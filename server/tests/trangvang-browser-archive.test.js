import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const implementation = await import('../../tools/trangvang/browserArchive.mjs').catch(error => {
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
