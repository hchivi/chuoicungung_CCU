// Uses only the supplied, supported browser tab API. No cookies, stealth,
// alternate network transport, CAPTCHA handling or database access.
import { mkdir, open, readFile, rename, stat, statfs, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const HOST = Buffer.from('dHJhbmd2YW5ndmlldG5hbS5jb20=', 'base64').toString('utf8');
const ORIGIN = `https://${HOST}`;
const sourceUrl = value => {
  try {
    const url = new URL(value);
    if (url.origin !== ORIGIN || url.username || url.password) return null;
    url.hash = '';
    return url;
  } catch { return null; }
};
const keyOf = job => job.kind === 'listing' ? `listing:${new URL(job.url).pathname.match(/^\/listings\/(\d+)\//)[1]}` : job.url;
const sleepDefault = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function runBrowserArchive({ tab, directory, categories = [], maxPages = 500000, delayMs = 3000, maxBytes = 2 * 1024 ** 3, maxNetworkRetries = 2, deadlineMs = Infinity, sleep = sleepDefault, onProgress = () => {} }) {
  if (!Number.isInteger(maxPages) || maxPages < 1 || delayMs < 0 || maxBytes < 1 || !Number.isInteger(maxNetworkRetries) || maxNetworkRetries < 0 || maxNetworkRetries > 5 || typeof deadlineMs !== 'number' || Number.isNaN(deadlineMs)) throw new Error('Invalid crawl limits');
  await mkdir(join(directory, 'pages'), { recursive: true, mode: 0o700 });
  const lockPath = join(directory, 'browser.lock');
  const lock = await open(lockPath, 'wx', 0o600);
  const jobs = new Map(), done = new Map();
  let journal, bytes = 0, retries = 0, reason = null, failure = null;
  const shouldStop = async () => {
    try { await stat(join(directory, 'STOP')); reason = 'operator-stop'; return true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (Date.now() >= deadlineMs) { reason = 'time-budget'; return true; }
    return false;
  };
  const atomic = async (name, value) => {
    const target = join(directory, name);
    await writeFile(target + '.tmp', JSON.stringify(value), { mode: 0o600 });
    await rename(target + '.tmp', target);
  };
  const enqueue = job => {
    const url = sourceUrl(job.url);
    if (!url || !['category', 'listing'].includes(job.kind) || !new RegExp(`^/${job.kind === 'category' ? 'categories' : 'listings'}/\\d+/`).test(url.pathname)) throw new Error('Invalid observed source URL');
    const key = keyOf(job);
    const existing = jobs.get(key);
    if (existing) existing.categories = [...new Map([...existing.categories, ...job.categories].map(category => [category.id, category])).values()];
    else jobs.set(key, { ...job, categories: [...job.categories] });
  };
  const snapshot = () => ({
    complete: done.size === jobs.size && !failure,
    categoryPages: [...done.values()].filter(page => page.kind === 'category').length,
    listings: [...done.values()].filter(page => page.kind === 'listing').length,
    pending: jobs.size - done.size, bytes, retries, reason, error: failure,
    updatedAt: new Date().toISOString(), databaseWrites: 0, binaryImagesDownloaded: 0
  });
  try {
    let seeds = [];
    try { seeds = JSON.parse(await readFile(join(directory, 'browser-seeds.json'), 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    seeds = [...new Map([...seeds, ...categories].map(category => [category.id, category])).values()];
    for (const category of seeds) enqueue({ kind: 'category', url: category.url, categories: [category] });
    await atomic('browser-seeds.json', seeds);
    let events = '';
    try { events = await readFile(join(directory, 'browser-pages.jsonl'), 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    // Append-only ACK log, not a repeated rewrite of the full source archive.
    for (const line of events.split('\n').filter(Boolean)) {
      const event = JSON.parse(line);
      enqueue(event.page);
      for (const job of event.discovered) enqueue(job);
      done.set(keyOf(event.page), event.page);
      bytes += event.page.bytes;
    }
    journal = await open(join(directory, 'browser-pages.jsonl'), 'a', 0o600);
    processing: for (let processed = 0; processed < maxPages; processed++) {
      if (await shouldStop()) break;
      const pending = [...jobs.entries()].filter(([key]) => !done.has(key));
      // Finish discovered suppliers before moving to the next industry.
      const next = pending.find(([, job]) => job.kind === 'listing') || pending[0];
      if (!next) break;
      if (bytes >= maxBytes) { reason = 'archive-size-limit'; break; }
      const space = await statfs(directory);
      if (space.bavail * space.bsize < 1024 ** 3) { reason = 'disk-reserve'; break; }
      const [key, job] = next;
      await sleep(Math.max(3000, delayMs));
      for (let attempt = 0; ; attempt++) {
        if (await shouldStop()) break processing;
        try {
          if (attempt > 0 || typeof tab.url !== 'function' || await tab.url() !== job.url) await tab.goto(job.url);
          break;
        } catch (error) {
          // Only transient transport failures; challenges, 403s and markup
          // errors must still stop, never be worked around with retries.
          if (attempt >= maxNetworkRetries || !/net::ERR_(?:NETWORK_CHANGED|INTERNET_DISCONNECTED|CONNECTION_RESET|CONNECTION_CLOSED|TIMED_OUT)\b|\bETIMEDOUT\b/.test(String(error.message))) throw error;
          retries++;
          await atomic('browser-status.json', { ...snapshot(), phase: 'network-backoff', retryAttempt: attempt + 1 });
          await sleep(Math.min(30000, 3000 * 2 ** attempt));
        }
      }
      const page = await tab.playwright.evaluate(() => ({
        url: location.href,
        heading: document.querySelector('h1')?.textContent.trim() || '',
        html: document.documentElement.outerHTML,
        links: [...document.querySelectorAll('a[href]')].map(node => ({ href: node.href, text: node.textContent.trim() }))
      }));
      if (!page.html || !page.heading || /sorry, you have been blocked|just a moment\.\.\.|cf-chl-|verify you are human|attention required!/i.test(page.html)) throw new Error('Source blocked/challenge: stopped without bypass');
      const actual = sourceUrl(page.url);
      if (!actual || actual.pathname !== new URL(job.url).pathname) throw new Error('Unexpected source redirect');
      const discovered = [];
      if (job.kind === 'category') {
        for (const link of page.links) {
          const url = sourceUrl(link.href);
          if (!url) continue;
          if (/^\/listings\/\d+\//.test(url.pathname)) discovered.push({ kind: 'listing', url: url.href, categories: job.categories });
          else if (url.pathname === actual.pathname && /^\d+$/.test(link.text) && Number(url.searchParams.get('page')) > 1 && [...url.searchParams.keys()].every(name => name === 'page')) discovered.push({ kind: 'category', url: url.href, categories: job.categories });
        }
        if (!discovered.some(value => value.kind === 'listing') && !/\(0 (?:công ty|doanh nghiệp)/i.test(page.html)) throw new Error('Unknown category markup: no supplier links');
      }
      const filename = `${job.kind}-${createHash('sha256').update(key).digest('hex')}.html`;
      const htmlFile = await open(join(directory, 'pages', filename), 'w', 0o600);
      try { await htmlFile.writeFile(page.html); await htmlFile.sync(); } finally { await htmlFile.close(); }
      const ack = { ...job, file: filename, fetchedAt: new Date().toISOString(), bytes: Buffer.byteLength(page.html) };
      await journal.write(JSON.stringify({ page: ack, discovered }) + '\n');
      await journal.sync();
      for (const found of discovered) enqueue(found);
      done.set(key, ack);
      bytes += ack.bytes;
      await atomic('browser-status.json', snapshot());
      onProgress(snapshot());
      if (processed + 1 === maxPages) reason = 'page-limit';
    }
  } catch (error) {
    failure = String(error.message).slice(0, 300);
    throw error;
  } finally {
    try {
      const status = snapshot();
      await atomic('browser-status.json', status);
      await atomic('browser-manifest.json', { ...status, pages: [...done].map(([key, page]) => ({ ...page, categories: jobs.get(key).categories })) });
    } finally {
      await journal?.close();
      await lock.close();
      await unlink(lockPath);
    }
  }
  return snapshot();
}
