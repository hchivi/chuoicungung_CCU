import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const implementation = await import('../../tools/trangvang/browserArchive.mjs').catch(error => {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  return {};
});
const pipeline = await import('../../tools/trangvang/pipeline.mjs').catch(error => {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  return {};
});
const origin = 'https://trangvangvietnam.com';
const category = { id: '12', name: 'Ngành mẫu', url: origin + '/categories/12/a.html' };
const listing = origin + '/listings/123456789/a.html';
const pages = {
  [category.url]: { heading: 'Ngành mẫu', html: '<h1>Ngành mẫu</h1>', links: [{ href: listing, text: 'Công ty' }, { href: category.url + '?page=2', text: '2' }, { href: origin + '/categories/13/other.html', text: 'Khác' }, { href: 'https://example.invalid/', text: 'Ngoài nguồn' }] },
  [category.url + '?page=2']: { heading: 'Ngành mẫu', html: '<h1>Ngành mẫu</h1>', links: [{ href: listing, text: 'Công ty' }] },
  [listing]: { heading: 'Công ty mẫu', html: '<h1>Công ty mẫu</h1>', links: [] }
};
const fakeTab = (calls, overrides = {}) => {
  let url;
  return { goto: async value => { calls.push(value); url = value; }, playwright: { evaluate: async () => ({ ...pages[url], ...overrides, url }) } };
};

test('browser archive exists, follows observed pagination, saves durable progress and does not fetch unrelated URLs', async () => {
  assert.equal(typeof implementation.runBrowserArchive, 'function');
  const directory = await mkdtemp(join(tmpdir(), 'ccu-browser-'));
  try {
    const calls = [];
    const result = await implementation.runBrowserArchive({ tab: fakeTab(calls), directory, categories: [category], delayMs: 0, sleep: async () => {}, maxPages: 10 });
    assert.equal(result.complete, true);
    assert.equal(result.listings, 1);
    assert.equal(result.categoryPages, 2);
    assert.equal(new Set(calls).size, 3);
    assert.equal(calls.length, 3);
    const manifest = JSON.parse(await readFile(join(directory, 'browser-manifest.json'), 'utf8'));
    assert.equal(manifest.pages.length, 3);
    assert.equal(manifest.pages.find(page => page.kind === 'listing').categories[0].id, '12');
    const resumed = await implementation.runBrowserArchive({ tab: fakeTab(calls), directory, categories: [category], delayMs: 0, sleep: async () => {}, maxPages: 10 });
    assert.equal(resumed.listings, 1);
    assert.equal(calls.length, 3);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('browser archive stops on challenges, never marks failed supplier complete and releases its writer lock', async () => {
  assert.equal(typeof implementation.runBrowserArchive, 'function');
  const directory = await mkdtemp(join(tmpdir(), 'ccu-browser-'));
  try {
    await assert.rejects(implementation.runBrowserArchive({ tab: fakeTab([], { html: '<title>Just a moment...</title>', heading: '' }), directory, categories: [category], delayMs: 0, sleep: async () => {}, maxPages: 10 }), /blocked|challenge/i);
    const manifest = JSON.parse(await readFile(join(directory, 'browser-manifest.json'), 'utf8'));
    assert.equal(manifest.pages.length, 0);
    assert.equal(manifest.complete, false);
    await assert.rejects(readFile(join(directory, 'browser.lock')), { code: 'ENOENT' });
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('browser archive resumes a page-limited run without resetting another active writer', async () => {
  assert.equal(typeof implementation.runBrowserArchive, 'function');
  const directory = await mkdtemp(join(tmpdir(), 'ccu-browser-'));
  try {
    const calls = [];
    const result = await implementation.runBrowserArchive({ tab: fakeTab(calls), directory, categories: [category], delayMs: 0, sleep: async () => {}, maxPages: 1 });
    assert.equal(result.complete, false);
    assert.equal(result.reason, 'page-limit');
    const result2 = await implementation.runBrowserArchive({ tab: fakeTab(calls), directory, categories: [], delayMs: 0, sleep: async () => {}, maxPages: 10 });
    assert.equal(result2.complete, true);
    assert.equal(calls.length, 3);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('transient network changes retry the same unacknowledged URL without duplicating pages', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ccu-browser-'));
  try {
    const calls = [], delays = [];
    const tab = fakeTab(calls);
    const navigate = tab.goto;
    let failed = false;
    tab.goto = async url => {
      if (!failed) { failed = true; throw new Error('net::ERR_NETWORK_CHANGED'); }
      await navigate(url);
    };
    const result = await implementation.runBrowserArchive({ tab, directory, categories: [category], sleep: async ms => delays.push(ms), maxPages: 1 });
    assert.equal(result.categoryPages, 1);
    assert.equal(result.retries, 1);
    assert.equal(delays.length, 2);
    assert.equal(JSON.parse(await readFile(join(directory, 'browser-manifest.json'))).pages.length, 1);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('network retries are bounded and blocked navigation is never retried', async () => {
  for (const [message, attempts] of [['net::ERR_NETWORK_CHANGED', 3], ['HTTP 403 Forbidden', 1]]) {
    const directory = await mkdtemp(join(tmpdir(), 'ccu-browser-'));
    try {
      let calls = 0;
      const tab = { goto: async () => { calls++; throw new Error(message); } };
      await assert.rejects(implementation.runBrowserArchive({ tab, directory, categories: [category], sleep: async () => {}, maxPages: 1 }), new RegExp(message));
      assert.equal(calls, attempts);
      assert.equal(JSON.parse(await readFile(join(directory, 'browser-manifest.json'))).pages.length, 0);
    } finally { await rm(directory, { recursive: true, force: true }); }
  }
});

test('deadline and operator stop during network backoff retain the pending job', async () => {
  const { writeFile } = await import('node:fs/promises');
  for (const stop of ['deadline', 'operator']) {
    const directory = await mkdtemp(join(tmpdir(), 'ccu-browser-'));
    try {
      let calls = 0, sleeps = 0;
      const tab = { goto: async () => { calls++; throw new Error('net::ERR_NETWORK_CHANGED'); } };
      const result = await implementation.runBrowserArchive({ tab, directory, categories: [category], deadlineMs: stop === 'deadline' ? 0 : Infinity,
        sleep: async () => { if (++sleeps === 2) await writeFile(join(directory, 'STOP'), 'stop'); } });
      assert.equal(result.reason, stop === 'deadline' ? 'time-budget' : 'operator-stop');
      assert.equal(result.categoryPages, 0);
      assert.equal(result.pending, 1);
      assert.equal(calls, stop === 'deadline' ? 0 : 1);
    } finally { await rm(directory, { recursive: true, force: true }); }
  }
});

test('pipeline collects the next batch while exporting and flushes the final checkpoint', async () => {
  assert.equal(typeof pipeline.runArchivePipeline, 'function');
  let collected = 0, exports = 0, release;
  const gate = new Promise(resolve => { release = resolve; });
  const checkpoints = [];
  const result = await pipeline.runArchivePipeline({ deadlineMs: Infinity,
    collect: async () => {
      collected++;
      if (collected === 2) { assert.equal(exports, 1); release(); }
      return { complete: collected === 2, reason: 'page-limit', listings: collected };
    },
    exportData: async () => { exports++; if (exports === 1) await gate; return { suppliers: collected }; },
    onState: async value => checkpoints.push(value)
  });
  assert.equal(collected, 2);
  assert.equal(exports, 2);
  assert.equal(result.lastExport.suppliers, 2);
  assert.equal(checkpoints.at(-1).state, 'stopped');
  assert.equal(result.reason, 'queue-complete');
});

test('pipeline surfaces export failure and never launches overlapping exporters', async () => {
  assert.equal(typeof pipeline.runArchivePipeline, 'function');
  let active = 0, maximum = 0, collected = 0;
  const error = new Error('disk export failed');
  await assert.rejects(pipeline.runArchivePipeline({ deadlineMs: Infinity,
    collect: async ({ onProgress }) => { collected++; await new Promise(resolve => setImmediate(resolve)); onProgress(); return { complete: collected > 3, reason: 'page-limit' }; },
    exportData: async () => { active++; maximum = Math.max(maximum, active); try { throw error; } finally { active--; } }
  }), /disk export failed/);
  assert.equal(maximum, 1);
  assert.ok(collected <= 2);
});

test('pipeline respects an expired budget without navigating or exporting', async () => {
  assert.equal(typeof pipeline.runArchivePipeline, 'function');
  const result = await pipeline.runArchivePipeline({ deadlineMs: 0,
    collect: async () => assert.fail('Must not navigate'), exportData: async () => assert.fail('Must not export') });
  assert.equal(result.batches, 0);
  assert.equal(result.reason, 'time-budget');
});
