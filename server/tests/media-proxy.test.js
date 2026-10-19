import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

test('media proxy endpoint validates subdomain and blocks path traversal', async t => {
  const repository = { health: async () => {}, all: async () => [], invalidate() {} };
  const app = createApp({ repository });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => server.close());

  const base = `http://127.0.0.1:${server.address().port}`;

  // Invalid subdomain returns 400
  const invalidSub = await fetch(`${base}/api/media/unauthorized/test.jpg`);
  assert.equal(invalidSub.status, 400);
  const invalidSubJson = await invalidSub.json();
  assert.equal(invalidSubJson.error, 'Invalid media target');

  // Path traversal attempt returns 400
  const pathTraversal = await fetch(`${base}/api/media/products/..%2F..%2Fetc%2Fpasswd`);
  assert.equal(pathTraversal.status, 400);
});

test('media proxy endpoint streams valid image with long-term cache headers', async t => {
  const repository = { health: async () => {}, all: async () => [], invalidate() {} };
  const app = createApp({ repository });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => server.close());

  const base = `http://127.0.0.1:${server.address().port}`;

  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });

  globalThis.fetch = async (url, opts) => {
    assert.match(String(url), /^https:\/\/products\.trangvangvietnam\.com\//);
    assert.equal(opts.headers.Referer, 'https://trangvangvietnam.com/');
    return new Response(new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]), {
      status: 200,
      headers: { 'content-type': 'image/jpeg' }
    });
  };

  const res = await originalFetch(`${base}/api/media/products/395738848/vch7%20lg.jpg`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'image/jpeg');
  assert.match(res.headers.get('cache-control'), /public, max-age=2592000/);
  const bytes = new Uint8Array(await res.arrayBuffer());
  assert.equal(bytes.length, 4);
});
