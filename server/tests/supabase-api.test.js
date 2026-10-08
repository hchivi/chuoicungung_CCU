import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createApiRouter, filterDirectory } from '../routes/api.js';

test('directory combines Vietnamese search, phase, category, province and A-Z instead of OR-ing filters', () => {
  const rows = [
    { id: '1', name: 'Đồng Phục', industry: 'May mặc', province: 'Đồng Nai', phases: ['5.3'], stages: [5] },
    { id: '2', name: 'Đồng Phục', industry: 'May mặc', province: 'Hà Nội', phases: ['5.3'], stages: [5] },
    { id: '3', name: 'Đồng Phục', industry: 'May mặc', province: 'Đồng Nai', phases: ['4.1'], stages: [4] }
  ];
  assert.deepEqual(filterDirectory(rows, { q: 'dong phuc', province: 'Dong Nai', category: 'May mac', phase: '5.3', stage: '5', letter: 'D' }).map(x => x.id), ['1']);
  assert.equal(filterDirectory([{ name: 'X', category: '' }], { category: 'May' }).length, 0);
});

test('API pages are capped, errors propagate, unknown collection is rejected, no private fields returned', async t => {
  const repo = { all: async key => { if (key !== 'suppliers') throw Object.assign(new Error('Unavailable'), { status: 503, code: 'DATABASE_UNAVAILABLE' }); return [{ id: '1', name: 'A', phases: ['1.1'] }]; }, get: async () => null, health: async () => ({ connected: true }) };
  const app = express();
  app.use(express.json(), createApiRouter({ repository: repo, client: null }));
  app.use((err, req, res, next) => res.status(err.status || 500).json({ code: err.code }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(`${base}/enterprises?limit=999999`);
  const body = await response.json();
  assert.equal(body.source, 'supabase');
  assert.equal(body.pageSize, 1000);
  assert.deepEqual(body.data[0].phases, ['1.1']);
  assert.equal((await fetch(`${base}/data/suppi_conversations`)).status, 400);
  assert.equal((await fetch(`${base}/factories`)).status, 503);
  assert.equal((await fetch(`${base}/enterprises/missing`)).status, 404);
  const invalid = await fetch(`${base}/demands`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  assert.equal(invalid.status, 400);
  const failed = await fetch(`${base}/demands`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Test', category: 'Test', requirements: 'Test', authorName: 'Test', authorEmail: 'test@example.com', authorPhone: '0000000000', location: 'Test' }) });
  assert.equal(failed.status, 503);
});
