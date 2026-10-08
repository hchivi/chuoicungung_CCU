import test from 'node:test';
import assert from 'node:assert/strict';
import { persistSubmission, getPrivateSubmissions, loadPrivateSubmissions } from '../../src/services/submissionService.js';

test('form retry keeps idempotency key; cache changes only after a valid Supabase acknowledgement', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  const keys = [];
  let attempt = 0;
  globalThis.fetch = async (_url, options) => {
    keys.push(options.headers['Idempotency-Key']);
    attempt++;
    if (attempt === 1) throw new Error('Network unavailable');
    return { ok: true, json: async () => ({ success: true, source: 'supabase', data: { id: 'cloud-1', status: 'PENDING', data: { name: 'Synthetic' } } }) };
  };
  await assert.rejects(persistSubmission('serviceRequest', { name: 'Synthetic' }));
  assert.equal(getPrivateSubmissions('serviceRequest').length, 0);
  const saved = await persistSubmission('serviceRequest', { name: 'Synthetic' });
  assert.equal(keys[0], keys[1]);
  assert.equal(saved.persisted, true);
  assert.equal(saved.status, 'SUBMITTED');
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true, source: 'supabase', data: {} }) });
  await assert.rejects(persistSubmission('supplierQuote', { name: 'Synthetic' }));
  assert.equal(getPrivateSubmissions('supplierQuote').length, 0);
});

test('loading own private submissions requires a Supabase response', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true, source: 'local', data: [] }) });
  await assert.rejects(loadPrivateSubmissions());
});
