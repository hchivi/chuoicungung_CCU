"""Permissioned Crawl4AI ingestion. Fail closed on robots, blocking or unknown markup.

No stealth, proxy rotation, CAPTCHA handling, LLM calls or automatic DB writes.
Private resumable SQLite output lives outside the website's public directory.
"""
import argparse
import asyncio
import datetime
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import sqlite3
import base64
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

DEFAULT_HOST = os.environ.get('DATA_PROVIDER_HOST') or base64.b64decode('dHJhbmd2YW5ndmlldG5hbS5jb20=').decode('utf-8')
ORIGIN = f'https://{DEFAULT_HOST}'
USER_AGENT = 'CCU-PermissionedCrawler/1.0'


class CrawlBlocked(RuntimeError):
    pass


def ensure_accessible(html, status):
    if status != 200 or not html.strip() or any(marker in html.lower() for marker in ['sorry, you have been blocked', 'just a moment...', 'cf-chl-', 'cf-error-details', 'verify you are human', 'attention required!']):
        raise CrawlBlocked('Source blocked/unavailable: stopped without marking page complete')


def robots_policy(text, status):
    ensure_accessible(text, status)
    if '<html' in text.lower() or not re.search(r'^\s*user-agent\s*:', text, re.I | re.M):
        raise CrawlBlocked('Cannot verify robots.txt; explicit access or an authorized export is required')
    policy = RobotFileParser()
    policy.parse(text.splitlines())
    return policy


def source_url(value, base):
    try:
        url = urlsplit(urljoin(base, value))
        if url.scheme != 'https' or url.hostname != DEFAULT_HOST or url.username or url.password or url.port not in (None, 443):
            return None
        return urlunsplit(('https', url.netloc, url.path, url.query, ''))
    except ValueError:
        return None


class Node:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    def all(self, tag=None):
        for child in self.children:
            if isinstance(child, Node):
                if tag is None or child.tag == tag:
                    yield child
                yield from child.all(tag)

    def text(self):
        return ' '.join(child.text() if isinstance(child, Node) else child for child in self.children).strip()


class Tree(HTMLParser):
    VOID = {'img', 'input', 'meta', 'link', 'br', 'hr', 'source', 'wbr', 'area', 'base', 'embed', 'param', 'track', 'col'}

    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = self.current = Node()
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in self.VOID:
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        node = self.current
        while node.parent:
            if node.tag == tag:
                self.current = node.parent
                return
            node = node.parent

    def handle_data(self, data):
        self.current.children.append(data)


def excluded(node):
    while node:
        if node.tag in {'footer', 'header', 'nav'} or re.search(r'footer|related|recommend|advert|tvx-foot|tvx-reg', node.attrs.get('id', '') + ' ' + node.attrs.get('class', ''), re.I):
            return True
        node = node.parent
    return False


def has_class(node, name):
    return name in node.attrs.get('class', '').split()


def within(node, element_id):
    while node:
        if node.attrs.get('id') == element_id:
            return True
        node = node.parent
    return False


def business_json(root):
    def find(value):
        if isinstance(value, list):
            return next((found for item in value if (found := find(item))), None)
        if isinstance(value, dict):
            kinds = value.get('@type', [])
            kinds = [kinds] if isinstance(kinds, str) else kinds
            if set(kinds) & {'Organization', 'LocalBusiness', 'Corporation', 'Store', 'ProfessionalService'}:
                return value
            return find(value.get('@graph', []))
        return None
    for node in root.all('script'):
        if node.attrs.get('type') == 'application/ld+json':
            try:
                found = find(json.loads(node.text()))
                if found:
                    return found
            except (ValueError, TypeError):
                pass
    return {}


def media_url(value, base):
    if not isinstance(value, str) or not value.strip():
        return None
    url = urlsplit(urljoin(base, value or ''))
    if url.scheme in {'https', 'http'} and not url.username and not url.password and url.hostname and (url.hostname == DEFAULT_HOST or url.hostname.endswith('.' + DEFAULT_HOST)):
        return urlunsplit((url.scheme, url.netloc, url.path, url.query, ''))
    return None


def parse_page(url, html):
    ensure_accessible(html, 200)
    root = Tree(html).root
    path = urlsplit(url).path
    result = {'categories': [], 'listings': [], 'next': []}
    category_id = re.match(r'^/categories/(\d+)/', path)
    for node in root.all('a'):
        href = source_url(node.attrs.get('href', ''), url)
        if not href or excluded(node):
            continue
        target = urlsplit(href).path
        match = re.match(r'^/categories/(\d+)/', target)
        if path.startswith('/findex'):
            if match and node.text():
                name = re.sub(r'\s*\([\d.,]+\)\s*$', '', node.text()).strip()
                result['categories'].append({'id': match[1], 'name': name, 'url': href})
            elif target == '/findex' or target.startswith('/findex/'):
                if href != url:
                    result['next'].append(href)
        elif category_id:
            if re.match(r'^/listings/\d+/', target):
                result['listings'].append(href)
            elif match and match[1] == category_id[1] and href != url:
                result['next'].append(href)
    for key in ['next', 'listings']:
        result[key] = list(dict.fromkeys(result[key]))
    result['categories'] = list({item['id']: item for item in result['categories']}.values())
    listing_id = re.match(r'^/listings/(\d+)/', path)
    if listing_id:
        listing_main = next((node for node in root.all() if has_class(node, 'listing_trai')), None)
        main = listing_main or next(root.all('main'), root)
        heading = next((node for node in main.all('h1') if not excluded(node)), None)
        structured = business_json(root)
        name = (heading.text() if heading else '') or structured.get('name', '')
        if listing_main and heading and structured.get('name') != name:
            # The live site's Organization block may describe its publisher,
            # not this supplier. Never use that publisher's fallback fields.
            structured = {}
        if not isinstance(name, str) or len(name.strip()) < 3:
            raise ValueError('Listing markup is unknown: missing business name; review parser before retry')
        row = {'sourceId': listing_id[1], 'sourceUrl': url, 'name': name.strip(), 'categories': [], 'phones': [], 'emails': [], 'websites': [], 'images': [], 'imageCaptions': [], 'contactPerson': None, 'productGroups': [], 'keywords': [], 'fetchedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}
        address = structured.get('address', '')
        if isinstance(address, dict):
            address = ', '.join(str(address[key]) for key in ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry'] if isinstance(address.get(key), str))
        row['address'] = address if isinstance(address, str) else ''
        for key, output in [('telephone', 'phones'), ('email', 'emails')]:
            values = structured.get(key, [])
            # Live template's JSON-LD incorrectly repeats publisher contacts.
            # Its explicit supplier contact panels are authoritative instead.
            row[output] = [] if listing_main else [value for value in (values if isinstance(values, list) else [values]) if isinstance(value, str) and value.strip()]
        for key, output in [('description', 'description'), ('taxID', 'taxCode'), ('foundingDate', 'establishedYear')]:
            if isinstance(structured.get(key), str):
                row[output] = structured[key]
        # Current template has an explicit supplier contact sidebar. Do not scan
        # its neighbouring registration advert or the platform header/footer.
        contact_sidebar = next((node for node in root.all() if has_class(node, 'tvxc')), None) if listing_main else None
        nodes = list(main.all()) + (list(contact_sidebar.all()) if contact_sidebar else [])
        for node in nodes:
            if excluded(node):
                continue
            prop = node.attrs.get('itemprop')
            if has_class(node, 'tvxl-row'):
                icons = ' '.join(child.attrs.get('class', '') for child in node.all('i'))
                value = next((child for child in node.children if isinstance(child, Node) and child.tag == 'div'), None)
                if value and 'fa-location-dot' in icons:
                    row['address'] = value.text()
                    province = next(value.all('span'), None)
                    if province:
                        row['province'] = province.text()
                elif value and 'fa-map-location-dot' in icons:
                    row['branches'] = value.text()
            if has_class(node, 'tvxb-fact') or has_class(node, 'tvxf-r'):
                label_class, value_class = ('k', 'v') if has_class(node, 'tvxb-fact') else ('tvxf-k', 'tvxf-v')
                label = next((child.text() for child in node.all() if has_class(child, label_class)), '')
                value = next((child.text() for child in node.all() if has_class(child, value_class)), '')
                field = {'Loại hình kinh doanh': 'businessType', 'Thị trường chính': 'mainMarkets', 'Khách hàng chính': 'mainCustomers', 'Mã số thuế': 'taxCode', 'Năm thành lập': 'establishedYear', 'Số lượng nhân viên': 'employees'}.get(label)
                if field and value:
                    row[field] = value
            if within(node, 'section1') and has_class(node, 'gioithieucongty_img'):
                row['description'] = node.text()
            if prop == 'address' and not row['address']:
                row['address'] = node.text()
            if node.tag == 'a':
                href = node.attrs.get('href', '')
                if href.startswith('tel:'):
                    row['phones'].append(href[4:].split('?')[0])
                elif href.startswith('mailto:'):
                    row['emails'].append(href[7:].split('?')[0])
                category = source_url(href, url)
                if category and (match := re.match(r'^/categories/(\d+)/', urlsplit(category).path)) and node.text():
                    row['categories'].append({'id': match[1], 'name': node.text(), 'url': category})
                # Do not mistake platform navigation or adverts for supplier websites.
                if href.startswith(('https://', 'http://')) and (prop == 'url' or 'website' in node.attrs.get('class', '').lower() or has_class(node, 'tvxl-act')) and DEFAULT_HOST.split('.')[0] not in urlsplit(href).netloc:
                    row['websites'].append(href)
            if node.tag == 'img':
                src = media_url(node.attrs.get('data-src') or node.attrs.get('src'), url)
                marker = ' '.join([src or '', node.attrs.get('class', ''), node.attrs.get('alt', '')]).lower()
                if src and 'logo' in marker and not row.get('logo'):
                    row['logo'] = src
                elif src and (within(node, 'section3') or within(node, 'section0') or re.search(r'/pics?/|pics_low|sanpham|product|gallery', marker + ' ' + (node.parent.attrs.get('id', '') if node.parent else ''))):
                    if src not in row['images']:
                        row['images'].append(src)
                        row['imageCaptions'].append(node.attrs.get('alt', ''))
        # Contact person extraction
        if contact_sidebar:
            contact_name = next((node.text() for node in contact_sidebar.all() if has_class(node, 'tvxc-pn')), '').strip()
            contact_role = next((node.text() for node in contact_sidebar.all() if has_class(node, 'tvxc-pr')), '').strip()
            if contact_name or contact_role:
                row['contactPerson'] = {
                    'name': contact_name,
                    'role': contact_role
                }
        # Products, services and keywords extraction from section2 and section0
        sec2 = next((node for node in main.all() if node.attrs.get('id') == 'section2'), None)
        product_groups = [node.text() for node in sec2.all() if has_class(node, 'tvxp-gh')] if sec2 else []
        product_items = [node.text() for node in sec2.all() if has_class(node, 'tvxs-item')] if sec2 else []
        sec0 = next((node for node in main.all() if node.attrs.get('id') == 'section0'), None)
        featured_items = [node.text() for node in sec0.all() if has_class(node, 'tvxp-nm')] if sec0 else []
        featured_groups = [node.text() for node in sec0.all() if has_class(node, 'tvxp-gh')] if sec0 else []
        all_keywords = list(dict.fromkeys(item.strip() for item in (product_items + featured_items) if item.strip()))
        all_groups = list(dict.fromkeys(group.strip() for group in (product_groups + featured_groups) if group.strip()))
        row['productGroups'] = all_groups
        row['keywords'] = all_keywords

        for key in ['phones', 'emails', 'websites']:
            row[key] = list(dict.fromkeys(value.strip() for value in row[key] if value.strip()))
        row['categories'] = list({item['id']: item for item in row['categories']}.values())
        result['supplier'] = row
    elif path.startswith('/findex') and not result['categories']:
        raise ValueError('Index markup unknown: no categories found')
    elif category_id and not result['listings']:
        raise ValueError('Category is empty or markup unknown; cannot claim completeness')
    return result


class Queue:
    def __init__(self, path):
        self.db = sqlite3.connect(path)
        self.db.row_factory = sqlite3.Row
        self.db.executescript('''CREATE TABLE IF NOT EXISTS jobs(url TEXT PRIMARY KEY,kind TEXT,state TEXT DEFAULT 'pending',result TEXT,error TEXT);
            CREATE TABLE IF NOT EXISTS memberships(url TEXT,category TEXT,PRIMARY KEY(url,category));
            UPDATE jobs SET state='pending' WHERE state='running';''')
        self.db.commit()

    def add(self, url, kind, category=None):
        self.db.execute('INSERT OR IGNORE INTO jobs(url,kind) VALUES(?,?)', (url, kind))
        if category:
            self.db.execute('INSERT OR IGNORE INTO memberships VALUES(?,?)', (url, json.dumps(category, ensure_ascii=False)))
        self.db.commit()

    def take(self):
        job = self.db.execute("SELECT * FROM jobs WHERE state='pending' ORDER BY CASE kind WHEN 'index' THEN 0 WHEN 'category' THEN 1 ELSE 2 END,rowid LIMIT 1").fetchone()
        if job:
            self.db.execute("UPDATE jobs SET state='running' WHERE url=?", (job['url'],))
            self.db.commit()
            return dict(job)
        return None

    def finish(self, url, result):
        # Caller enqueues discovered links before this ACK. Crash => reprocess, deduplicated.
        self.db.execute("UPDATE jobs SET state='done',result=?,error=NULL WHERE url=?", (json.dumps(result, ensure_ascii=False), url))
        self.db.commit()

    def fail(self, url, error):
        self.db.execute("UPDATE jobs SET state='failed',error=? WHERE url=?", (str(error)[:300], url))
        self.db.commit()

    def export(self, directory):
        rows = []
        for job in self.db.execute("SELECT url,result FROM jobs WHERE state='done' AND kind='listing' ORDER BY url"):
            row = json.loads(job['result'])['supplier']
            categories = row['categories'] + [json.loads(value[0]) for value in self.db.execute('SELECT category FROM memberships WHERE url=?', (job['url'],))]
            row['categories'] = list({value['id']: value for value in categories}.values())
            rows.append(row)
        target = directory / 'suppliers.jsonl'
        with open(target, 'w', encoding='utf-8') as handle:
            for row in rows:
                handle.write(json.dumps(row, ensure_ascii=False) + '\n')
        os.chmod(target, 0o600)
        counts = dict(self.db.execute('SELECT state,count(*) FROM jobs GROUP BY state').fetchall())
        report = {'jobs': counts, 'suppliers': len(rows), 'complete': not any(counts.get(key, 0) for key in ['pending', 'running', 'failed']), 'imageMode': 'source URLs only; no binary image downloads yet'}
        (directory / 'status.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        return report

    def close(self):
        self.db.close()


def read_robots():
    request = Request(ORIGIN + '/robots.txt', headers={'User-Agent': USER_AGENT})
    try:
        with urlopen(request, timeout=25) as response:
            return robots_policy(response.read(1024 * 1024).decode('utf-8', 'replace'), response.status)
    except (HTTPError, OSError) as error:
        raise CrawlBlocked('robots.txt unavailable/blocked; no site-wide crawl attempted') from error


def export_browser_archive(directory):
    """Incrementally parse an authorized archive; never makes a network request.

    Cache only parsed source content, not category membership. The latter is
    reconciled on every export, including newly discovered cross-listings.
    Bump the version when extraction rules change to rebuild from saved HTML.
    """
    directory = Path(directory).resolve()
    manifest_file = directory / 'browser-manifest.json'
    manifest = json.loads(manifest_file.read_text(encoding='utf-8')) if manifest_file.exists() else {'pages': []}
    rows, parsed, reused = {}, 0, 0
    pages_root = (directory / 'pages').resolve()
    cache_path = directory / 'export-cache.sqlite'
    cache = sqlite3.connect(cache_path)
    os.chmod(cache_path, 0o600)
    try:
        cache.execute('CREATE TABLE IF NOT EXISTS parsed_pages(url TEXT PRIMARY KEY, signature TEXT NOT NULL, payload TEXT NOT NULL)')
        with cache:
            for page in manifest.get('pages', []):
                if page['kind'] != 'listing':
                    continue
                file_name = page.get('file')
                target = (pages_root / file_name).resolve() if file_name else None
                if target and not target.is_relative_to(pages_root):
                    raise ValueError('Archive file escapes pages directory')
                url = source_url(page['url'], ORIGIN)
                if not url or not re.match(r'^/listings/\d+/', urlsplit(url).path):
                    raise ValueError('Invalid archived listing URL')
                row = None
                if target and target.exists():
                    info = target.stat()
                    signature = json.dumps([2, file_name, info.st_mtime_ns, info.st_size])
                    cached = cache.execute('SELECT payload FROM parsed_pages WHERE url=? AND signature=?', (url, signature)).fetchone()
                    if cached:
                        row = json.loads(cached[0])
                        reused += 1
                    else:
                        row = parse_page(url, target.read_text(encoding='utf-8'))['supplier']
                        cache.execute('INSERT OR REPLACE INTO parsed_pages VALUES(?,?,?)', (url, signature, json.dumps(row, ensure_ascii=False)))
                        parsed += 1
                else:
                    cached = cache.execute('SELECT payload FROM parsed_pages WHERE url=?', (url,)).fetchone()
                    if cached:
                        row = json.loads(cached[0])
                        reused += 1
                if row:
                    row['fetchedAt'] = page.get('fetchedAt', row.get('fetchedAt', ''))
                    row['categories'] = list({item['id']: item for item in row.get('categories', []) + page.get('categories', [])}.values())
                    rows[row['sourceId']] = row
    finally:
        cache.close()
    temp = directory / 'suppliers.jsonl.tmp'
    with open(temp, 'w', encoding='utf-8') as handle:
        for row in rows.values():
            handle.write(json.dumps(row, ensure_ascii=False) + '\n')
        handle.flush()
        os.fsync(handle.fileno())
    os.chmod(temp, 0o600)
    temp.replace(directory / 'suppliers.jsonl')
    report = {'suppliers': len(rows), 'parsed': parsed, 'reused': reused, 'complete': manifest.get('complete', False), 'scope': 'saved browser manifest only', 'databaseWrites': 0, 'imageMode': 'source URLs'}
    (directory / 'export-status.json').write_text(json.dumps(report), encoding='utf-8')
    return report


async def run(args):
    directory = Path(args.output).resolve()
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(directory, 0o700)
    queue = None
    lock = None
    try:
        # Single writer only; a second crawler must not reset running jobs.
        lock = os.open(directory / 'run.lock', os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        queue = Queue(directory / 'queue.sqlite')
        if args.export_only:
            return queue.export(directory)
        start = source_url(args.start, ORIGIN)
        if not start or not (urlsplit(start).path.startswith('/findex') or re.match(r'^/categories/\d+/', urlsplit(start).path)):
            raise ValueError('Start URL must be a Trang Vang index or category')
        queue.add(start, 'index' if '/findex' in urlsplit(start).path else 'category')
        policy = read_robots()
        if not policy.can_fetch(USER_AGENT, start):
            raise CrawlBlocked('robots.txt disallows the start URL')
        if args.probe:
            return {'robots': 'allowed', 'crawlStarted': False}
        from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
        delay = max(3, args.delay, policy.crawl_delay(USER_AGENT) or policy.crawl_delay('*') or 0)
        config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS, page_timeout=45000, scan_full_page=True, check_robots_txt=True)
        async with AsyncWebCrawler(config=BrowserConfig(headless=True, user_agent=USER_AGENT)) as crawler:
            for _ in range(args.max_pages):
                job = queue.take()
                if not job:
                    break
                try:
                    if not policy.can_fetch(USER_AGENT, job['url']):
                        raise CrawlBlocked('robots.txt disallows a discovered URL')
                    response = await crawler.arun(url=job['url'], config=config)
                    ensure_accessible(response.html or '', response.status_code)
                    if not response.success:
                        raise CrawlBlocked('Browser fetch unsuccessful')
                    data = parse_page(job['url'], response.html)
                    for category in data['categories']:
                        queue.add(category['url'], 'category', category)
                    memberships = [json.loads(row[0]) for row in queue.db.execute('SELECT category FROM memberships WHERE url=?', (job['url'],))]
                    for url in data['listings'] + data['next']:
                        kind = 'listing' if '/listings/' in urlsplit(url).path else job['kind']
                        if memberships:
                            for category in memberships:
                                queue.add(url, kind, category)
                        else:
                            queue.add(url, kind)
                    queue.finish(job['url'], data)
                    print(json.dumps({'processed': job['kind'], 'counts': {key: len(data[key]) for key in ['categories', 'listings', 'next']}}, ensure_ascii=False), flush=True)
                    await asyncio.sleep(delay)
                except Exception as error:
                    queue.fail(job['url'], error)
                    raise
        return queue.export(directory)
    except Exception as error:
        if queue:
            queue.export(directory)
            (directory / 'last-error.json').write_text(json.dumps({'error': str(error), 'stopped': True, 'databaseWritten': False}), encoding='utf-8')
        raise
    finally:
        if queue:
            queue.close()
        if lock is not None:
            os.close(lock)
            (directory / 'run.lock').unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--start', default=ORIGIN + '/findex')
    parser.add_argument('--output', default='.crawl-data/suppliers')
    parser.add_argument('--max-pages', type=int, default=5, help='Pilot defaults to 5; explicit limit required for large runs')
    parser.add_argument('--delay', type=float, default=3)
    parser.add_argument('--probe', action='store_true')
    parser.add_argument('--export-only', action='store_true')
    parser.add_argument('--browser-archive', help='Offline: parse a saved permissioned browser manifest instead of fetching')
    args = parser.parse_args()
    if args.max_pages < 1 or args.delay < 0:
        parser.error('Positive page limit and nonnegative delay required')
    try:
        result = export_browser_archive(args.browser_archive) if args.browser_archive else asyncio.run(run(args))
        print(json.dumps(result, ensure_ascii=False))
    except Exception as error:
        print(json.dumps({'stopped': True, 'error': str(error), 'databaseWritten': False}, ensure_ascii=False))
        raise SystemExit(2)


if __name__ == '__main__':
    main()
