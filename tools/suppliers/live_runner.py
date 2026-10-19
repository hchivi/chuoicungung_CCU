"""Live high-speed crawler for Trang Vang Vietnam.
Uses patchright with system Chrome to bypass Cloudflare and seamlessly
continue from existing .crawl-data archive without AI tokens or quota limits.
"""
import argparse
import asyncio
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import sqlite3
import sys
import time
from urllib.parse import urljoin, urlsplit, urlunsplit

# Add current tools directory to path to import crawl.py
CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))
from crawl import export_browser_archive, parse_page

ORIGIN = 'https://trangvangvietnam.com'


def source_url(value, base=ORIGIN):
    try:
        url = urlsplit(urljoin(base, value))
        if url.scheme != 'https' or url.hostname != 'trangvangvietnam.com' or url.username or url.password or url.port not in (None, 443):
            return None
        # strip hash/fragment
        return urlunsplit(('https', url.netloc, url.path, url.query, ''))
    except Exception:
        return None


def key_of(job):
    url = job['url']
    if job['kind'] == 'listing':
        m = re.search(r'^/listings/(\d+)/', urlsplit(url).path)
        if m:
            return f"listing:{m.group(1)}"
    return url


def filename_of(job):
    key = key_of(job)
    h = hashlib.sha256(key.encode('utf-8')).hexdigest()
    return f"{job['kind']}-{h}.html"


def atomic_write(filepath, data):
    tmp = f"{filepath}.tmp"
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, filepath)


class LiveCrawler:
    def __init__(self, directory, delay=0.5, batch_size=50, max_pages=300000, concurrency=3):
        self.directory = Path(directory).resolve()
        self.delay = delay
        self.batch_size = batch_size
        self.max_pages = max_pages
        self.concurrency = max(1, concurrency)
        self.pages_dir = self.directory / 'pages'
        self.pages_dir.mkdir(parents=True, exist_ok=True)

        self.jobs = {}  # key -> job
        self.done = {}  # key -> ack
        self.total_bytes = 0
        self.running = True
        self.lock_path = self.directory / 'browser.lock'

        # Signal handlers for clean shutdown
        signal.signal(signal.SIGINT, self._handle_exit)
        signal.signal(signal.SIGTERM, self._handle_exit)

    def _handle_exit(self, signum, frame):
        print("\n[Crawler] Stopping gracefully on signal...")
        self.running = False

    def load_queue(self):
        print(f"[Crawler] Loading existing queue from {self.directory}...")

        # 1. Load seeds
        seeds_path = self.directory / 'browser-seeds.json'
        if seeds_path.exists():
            with open(seeds_path, 'r', encoding='utf-8') as f:
                seeds = json.load(f)
            for cat in seeds:
                self._enqueue({
                    'kind': 'category',
                    'url': cat['url'],
                    'categories': [cat]
                })

        # 2. Load acknowledged pages journal
        journal_path = self.directory / 'browser-pages.jsonl'
        if journal_path.exists():
            with open(journal_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        record = json.loads(line)
                        page = record['page']
                        self._enqueue(page)
                        for disc in record.get('discovered', []):
                            self._enqueue(disc)
                        k = key_of(page)
                        self.done[k] = page
                        self.total_bytes += page.get('bytes', 0)
                    except Exception as e:
                        print(f"[Warning] Bad line in journal: {e}")

        print(f"[Crawler] Queue loaded: {len(self.done)} completed, {len(self.jobs) - len(self.done)} pending out of {len(self.jobs)} total discovered.")

    def _enqueue(self, job):
        clean_url = source_url(job['url'])
        if not clean_url:
            return
        job['url'] = clean_url
        k = key_of(job)
        if k in self.jobs:
            # Merge categories
            existing = self.jobs[k]
            cat_map = {c['id']: c for c in existing.get('categories', [])}
            for c in job.get('categories', []):
                cat_map[c['id']] = c
            existing['categories'] = list(cat_map.values())
        else:
            self.jobs[k] = {
                'kind': job['kind'],
                'url': job['url'],
                'categories': list({c['id']: c for c in job.get('categories', [])}.values())
            }

    def save_status(self, reason=None, error=None):
        cat_count = sum(1 for p in self.done.values() if p['kind'] == 'category')
        listing_count = sum(1 for p in self.done.values() if p['kind'] == 'listing')
        pending_count = len(self.jobs) - len(self.done)

        status = {
            'complete': pending_count == 0 and not error,
            'categoryPages': cat_count,
            'listings': listing_count,
            'pending': pending_count,
            'bytes': self.total_bytes,
            'retries': 0,
            'reason': reason,
            'error': error,
            'updatedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'databaseWrites': 0,
            'binaryImagesDownloaded': 0
        }
        atomic_write(self.directory / 'browser-status.json', status)

        # Also update manifest
        manifest = {
            **status,
            'pages': [
                {
                    **page,
                    'categories': self.jobs.get(k, {}).get('categories', [])
                }
                for k, page in self.done.items()
            ]
        }
        atomic_write(self.directory / 'browser-manifest.json', manifest)
        return status

    async def run(self):
        # Acquire lock
        if self.lock_path.exists():
            print(f"[Warning] Lock file exists: {self.lock_path}. Removing stale lock...")
            try:
                self.lock_path.unlink()
            except Exception:
                pass
        self.lock_path.write_text(str(os.getpid()), encoding='utf-8')

        from patchright.async_api import async_playwright

        self.load_queue()
        processed_since_export = 0
        total_processed_session = 0

        # Update runner status to running
        runner_status = {
            'state': 'running',
            'startedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'updatedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'mode': 'patchright-direct-crawler',
            'delay': self.delay
        }
        atomic_write(self.directory / 'runner-status.json', runner_status)

        journal_file = open(self.directory / 'browser-pages.jsonl', 'a', encoding='utf-8')
        cache_conn = sqlite3.connect(self.directory / 'export-cache.sqlite')
        cache_conn.execute('CREATE TABLE IF NOT EXISTS parsed_pages(url TEXT PRIMARY KEY, signature TEXT NOT NULL, payload TEXT NOT NULL)')
        suppliers_append_file = open(self.directory / 'suppliers.jsonl', 'a', encoding='utf-8')

        try:
            async with async_playwright() as p:
                print("[Crawler] Launching real Google Chrome with anti-detection...")
                # Launch with window off-screen to avoid disturbing the user
                browser = await p.chromium.launch(
                    executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                    headless=False,
                    args=[
                        '--window-position=3000,3000',
                        '--window-size=1280,800',
                        '--disable-blink-features=AutomationControlled',
                        '--no-default-browser-check'
                    ]
                )
                context = await browser.new_context(
                    viewport={'width': 1280, 'height': 800},
                    user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
                )
                # Test start page
                test_page = await context.new_page()
                print("[Crawler] Verifying connection to Trang Vang...")
                await test_page.goto(ORIGIN, wait_until='domcontentloaded', timeout=30000)
                title = await test_page.title()
                print(f"[Crawler] Connected! Title: {title}")
                await test_page.close()

                print(f"[Crawler] Starting {self.concurrency} concurrent workers with delay {self.delay}s...")
                pages = [await context.new_page() for _ in range(self.concurrency)]
                lock = asyncio.Lock()
                in_flight = set()

                CF_MARKERS = ['sorry, you have been blocked', 'just a moment...', 'cf-chl-', 'cf-error-details', 'verify you are human', 'attention required!']

                async def worker(worker_id, page, initial_delay=0.0):
                    nonlocal total_processed_session, processed_since_export
                    if initial_delay > 0:
                        await asyncio.sleep(initial_delay)
                    while self.running and total_processed_session < self.max_pages:
                        if (self.directory / 'STOP').exists():
                            print(f"[Worker {worker_id}] STOP file detected. Stopping.")
                            break

                        target_key = None
                        job = None
                        async with lock:
                            pending_keys = [k for k in self.jobs if k not in self.done and k not in in_flight]
                            if pending_keys:
                                target_key = next((k for k in pending_keys if self.jobs[k]['kind'] == 'listing'), pending_keys[0])
                                in_flight.add(target_key)
                                job = self.jobs[target_key]
                            elif not in_flight:
                                break

                        if not target_key:
                            await asyncio.sleep(0.5)
                            continue

                        await asyncio.sleep(self.delay)

                        try:
                            resp = await page.goto(job['url'], wait_until='domcontentloaded', timeout=35000)
                            page_data = await page.evaluate('''() => ({
                                url: location.href,
                                heading: document.querySelector('h1')?.textContent.trim() || '',
                                html: document.documentElement.outerHTML,
                                links: [...document.querySelectorAll('a[href]')].map(n => ({ href: n.href, text: n.textContent.trim() }))
                            })''')

                            html = page_data.get('html', '')
                            is_cf = any(m in html.lower() for m in CF_MARKERS) or '<title>just a moment...' in html.lower()
                            if is_cf:
                                print(f"[Worker {worker_id}] Cloudflare challenge detected on {job['url']}. Waiting for solve...")
                                for _ in range(5):
                                    await asyncio.sleep(2)
                                    html = await page.content()
                                    if not any(m in html.lower() for m in CF_MARKERS) and '<title>just a moment...' not in html.lower():
                                        is_cf = False
                                        break
                                if is_cf:
                                    print(f"[Worker {worker_id}] Cloudflare challenge persists on {job['url']}. Re-queuing and pausing worker...")
                                    async with lock:
                                        in_flight.discard(target_key)
                                    await asyncio.sleep(6)
                                    continue

                            is_not_found = 'khong tim thay doanh nghiep' in html.lower() or len(html.strip()) < 500
                            if is_not_found:
                                print(f"[Worker {worker_id}] Page closed/not found on Trang Vang: {job['url']}")
                                ack = {
                                    'kind': job['kind'],
                                    'url': job['url'],
                                    'file': None,
                                    'skipped': True,
                                    'fetchedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                    'bytes': 0
                                }
                                async with lock:
                                    self.done[target_key] = ack
                                    in_flight.discard(target_key)
                                    total_processed_session += 1
                                continue

                            if any(m in html.lower() for m in CF_MARKERS) or '<title>just a moment...' in html.lower():
                                print(f"[Worker {worker_id}] Skipping save for challenge page: {job['url']}")
                                async with lock:
                                    in_flight.discard(target_key)
                                await asyncio.sleep(2)
                                continue

                            discovered = []
                            if job['kind'] == 'category':
                                category_path = urlsplit(job['url']).path
                                for lk in page_data.get('links', []):
                                    u = source_url(lk['href'])
                                    if not u:
                                        continue
                                    p = urlsplit(u).path
                                    if re.match(r'^/listings/\d+/', p):
                                        discovered.append({
                                            'kind': 'listing',
                                            'url': u,
                                            'categories': job.get('categories', [])
                                        })
                                    elif p == category_path and lk['text'].isdigit():
                                        query = urlsplit(u).query
                                        if 'page=' in query:
                                            discovered.append({
                                                'kind': 'category',
                                                'url': u,
                                                'categories': job.get('categories', [])
                                            })

                            parsed_supplier = None
                            if job['kind'] == 'listing':
                                try:
                                    parsed_res = parse_page(job['url'], html)
                                    parsed_supplier = parsed_res.get('supplier')
                                except Exception as parse_err:
                                    print(f"[Worker {worker_id} Parse Warning on {job['url']}]: {parse_err}")

                            ack = {
                                'kind': job['kind'],
                                'url': job['url'],
                                'file': None,
                                'fetchedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                'bytes': len(html.encode('utf-8'))
                            }

                            async with lock:
                                if parsed_supplier:
                                    cats = parsed_supplier.get('categories', []) + job.get('categories', [])
                                    parsed_supplier['categories'] = list({item['id']: item for item in cats if isinstance(item, dict) and 'id' in item}.values())
                                    sig = json.dumps([3, f"direct:{job['url']}"])
                                    cache_conn.execute('INSERT OR REPLACE INTO parsed_pages VALUES(?,?,?)', (job['url'], sig, json.dumps(parsed_supplier, ensure_ascii=False)))
                                    cache_conn.commit()
                                    suppliers_append_file.write(json.dumps(parsed_supplier, ensure_ascii=False) + '\n')
                                    suppliers_append_file.flush()

                                journal_line = json.dumps({'page': ack, 'discovered': discovered}, ensure_ascii=False)
                                journal_file.write(journal_line + '\n')
                                journal_file.flush()
                                os.fsync(journal_file.fileno())

                                for d in discovered:
                                    self._enqueue(d)

                                self.done[target_key] = ack
                                self.total_bytes += ack['bytes']
                                processed_since_export += 1
                                total_processed_session += 1
                                in_flight.discard(target_key)
                                print(f"[{total_processed_session}] (W{worker_id}) Fetched {job['kind']}: {job['url']}")

                                if processed_since_export >= self.batch_size:
                                    print(f"[Batch] Saving manifest & status (Processed: {total_processed_session})...")
                                    self.save_status()
                                    processed_since_export = 0

                        except Exception as e:
                            print(f"[Worker {worker_id} Error on {job['url']}]: {e}")
                            err_str = str(e)
                            if 'ERR_HTTP_RESPONSE_CODE_FAILURE' in err_str or '404' in err_str:
                                print(f"[Worker {worker_id}] Dead listing / 404 response on {job['url']}. Skipping.")
                                ack = {
                                    'kind': job['kind'],
                                    'url': job['url'],
                                    'file': None,
                                    'skipped': True,
                                    'fetchedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                    'bytes': 0
                                }
                                async with lock:
                                    self.done[target_key] = ack
                                    in_flight.discard(target_key)
                                    total_processed_session += 1
                                continue
                            async with lock:
                                in_flight.discard(target_key)
                            await asyncio.sleep(3)

                await asyncio.gather(*(worker(i+1, pages[i], initial_delay=i*0.5) for i in range(self.concurrency)))
                await browser.close()

        finally:
            journal_file.close()
            cache_conn.close()
            suppliers_append_file.close()
            # Final export on exit
            print("[Crawler] Finalizing status and exporting data...")
            self.save_status(reason='finished' if total_processed_session >= self.max_pages else 'operator-stop')
            try:
                res = export_browser_archive(self.directory)
                print(f"[Final Result] Suppliers in suppliers.jsonl: {res['suppliers']}")
            except Exception as e:
                print(f"[Export Error]: {e}")

            if self.lock_path.exists():
                try:
                    self.lock_path.unlink()
                except Exception:
                    pass
            print(f"[Crawler] Run finished. Processed {total_processed_session} pages.")


def main():
    parser = argparse.ArgumentParser(description="Live Trang Vang Crawler")
    parser.add_argument('--directory', default='.crawl-data/trangvang-browser/pilot-484435')
    parser.add_argument('--delay', type=float, default=0.5)
    parser.add_argument('--batch-size', type=int, default=50)
    parser.add_argument('--max-pages', type=int, default=300000)
    parser.add_argument('--concurrency', type=int, default=3)
    args = parser.parse_args()

    crawler = LiveCrawler(
        directory=args.directory,
        delay=args.delay,
        batch_size=args.batch_size,
        max_pages=args.max_pages,
        concurrency=args.concurrency
    )
    asyncio.run(crawler.run())


if __name__ == '__main__':
    main()
