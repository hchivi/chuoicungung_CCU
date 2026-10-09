import test from 'node:test';
import assert from 'node:assert/strict';
import { publicRecord } from '../storage/supabaseRepository.js';

const implementation = await import('../crawling/trangvangImport.js').catch(error => {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  return {};
});
const source = (extra = {}) => ({ sourceId: '123456789', sourceUrl: 'https://trangvangvietnam.com/listings/123456789/example.html', name: 'Công ty ví dụ', address: 'Địa chỉ mẫu', phones: ['0000000000'], emails: ['sample@example.invalid'], categories: [{ id: '12', name: 'Ngành mẫu' }], images: ['https://pic.trangvangvietnam.com/example.jpg'], fetchedAt: '2026-10-09T00:00:00Z', ...extra });
const existing = (extra = {}) => ({ id: 'ccu-1', name: 'Tên cũ', province: 'Hà Nội', updated_at: '2026-10-08T00:00:00Z', data: { sourceUrl: source().sourceUrl, phases: ['5.3'], stages: [5], kycLevel: 'GOLD', visibility: 'PUBLIC', slug: 'giu-duong-dan', description: 'Mô tả đang có', phone: '0000000001' }, ...extra });

test('import implementation exists; a known source updates stable CCU id without changing phases, KYC or publication', () => {
  assert.equal(typeof implementation.planSupplierImport, 'function', 'Missing safe supplier import implementation');
  const [item] = implementation.planSupplierImport([source({ phases: ['1.1'], kycLevel: 'DIAMOND', visibility: 'PUBLIC' })], [existing()]);
  assert.equal(item.action, 'update');
  assert.equal(item.after.id, 'ccu-1');
  assert.equal(item.after.name, source().name);
  for (const key of ['phases', 'stages', 'kycLevel', 'visibility', 'slug', 'description']) assert.deepEqual(item.after.data[key], existing().data[key]);
});

test('empty extracted fields never erase existing values; contacts stay out of public projection', () => {
  const [item] = implementation.planSupplierImport([source({ name: '', phones: [], address: '', description: '' })], [existing()]);
  assert.equal(item.after.name, 'Tên cũ');
  assert.equal(item.after.data.phone, '0000000001');
  assert.ok(item.after.data.contact.emails.includes('sample@example.invalid'));
  assert.ok(!JSON.stringify(publicRecord(item.after.data)).includes('sample@example.invalid'));
});

test('repeated supplier across categories yields one record and unions industry membership and images', () => {
  const plan = implementation.planSupplierImport([source(), source({ categories: [{ id: '13', name: 'Ngành khác' }], images: ['https://pic.trangvangvietnam.com/other.jpg'] })], [existing()]);
  assert.equal(plan.length, 1);
  assert.equal(plan[0].after.data.sourceCategories.length, 2);
  assert.equal(plan[0].after.data.gallery.length, 2);
});

test('tax-code match is allowed, fuzzy/same-name-only and conflicting identities are not auto-replaced', () => {
  const taxRow = existing({ data: { taxCode: '0100000000' } });
  assert.equal(implementation.planSupplierImport([source({ taxCode: '0100000000' })], [taxRow])[0].action, 'update');
  const ambiguous = [existing(), existing({ id: 'ccu-2' })];
  assert.equal(implementation.planSupplierImport([source()], ambiguous)[0].action, 'review');
  assert.equal(implementation.planSupplierImport([source({ taxCode: '0200000000' })], [existing({ data: { sourceUrl: source().sourceUrl, taxCode: '0100000000' } })])[0].action, 'review');
  assert.equal(implementation.planSupplierImport([source({ name: 'Tên cũ', address: '' })], [existing({ data: {} })])[0].action, 'review');
});

test('new supplier is staged, never fabricated as verified or assigned an arbitrary lifecycle phase', () => {
  const [item] = implementation.planSupplierImport([source({ kycLevel: 'DIAMOND', verified: true })], []);
  assert.equal(item.action, 'insert');
  assert.equal(item.after.data.status, 'DRAFT');
  assert.equal(item.after.data.isPublished, false);
  assert.deepEqual(item.after.data.phases, []);
  assert.equal(item.after.data.kycLevel, undefined);
  assert.equal(publicRecord(item.after.data), null);
});

test('reject external source hosts, URL/id mismatch, invalid payloads and unsupported image protocols', () => {
  for (const row of [source({ sourceUrl: 'https://example.invalid/listings/123456789/x' }), source({ sourceId: '999' }), source({ images: ['javascript:alert(1)'] }), source({ categories: 'not-an-array' })]) {
    assert.throws(() => implementation.planSupplierImport([row], []));
  }
});

test('apply writes durable backup before any mutation; rechecks concurrency and records ACK, never silently succeeds', async () => {
  const plan = implementation.planSupplierImport([source()], [existing()]);
  const calls = [];
  const io = { read: async () => existing(), backup: async () => calls.push('backup'), write: async () => { calls.push('write'); return { ...plan[0].after, updated_at: '2026-10-09T00:00:00Z' }; }, receipt: async () => calls.push('receipt') };
  await implementation.applySupplierPlan(plan, io);
  assert.deepEqual(calls, ['backup', 'write', 'receipt']);
  calls.length = 0;
  await assert.rejects(implementation.applySupplierPlan(plan, { ...io, read: async () => existing({ updated_at: 'changed' }) }), /conflict/i);
  assert.deepEqual(calls, []);
  await assert.rejects(implementation.applySupplierPlan(plan, { ...io, backup: async () => { throw new Error('disk'); } }), /disk/);
  await assert.rejects(implementation.applySupplierPlan(plan, { ...io, write: async () => null }), /ack/i);
});

test('Postgres JSONB key reordering is not a conflict or invalid ACK', async () => {
  const plan = implementation.planSupplierImport([source()], [existing()]);
  const current = { ...existing(), data: Object.fromEntries(Object.entries(existing().data).reverse()) };
  const saved = { ...plan[0].after, data: Object.fromEntries(Object.entries(plan[0].after.data).reverse()) };
  assert.equal((await implementation.applySupplierPlan(plan, { read: async () => current, backup: async () => {}, write: async () => saved, receipt: async () => {} })).applied, 1);
});

test('source descriptions cannot leak contacts through a public text field', () => {
  const [item] = implementation.planSupplierImport([source({ description: 'Gọi 0000000000 hoặc sample@example.invalid để trao đổi.' })], [existing()]);
  const published = JSON.stringify(publicRecord(item.after.data));
  assert.ok(!published.includes('sample@example.invalid'));
  assert.ok(!published.includes('0000000000'));
  assert.ok(item.after.data.contact.sourceDescription.includes('sample@example.invalid'));
});
