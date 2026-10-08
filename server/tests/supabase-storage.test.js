import test from 'node:test';
import assert from 'node:assert/strict';
import { createSupabaseRepository, publicRecord } from '../storage/supabaseRepository.js';
import { createSupabaseConversationStore, createSupabaseDraftStore } from '../storage/assistantStores.js';
import { createSubmissionStore } from '../storage/submissionStore.js';

function fakeClient(seed = {}) {
  const tables = structuredClone(seed);
  const calls = [];
  let failure = null;
  return { tables, calls, fail(error) { failure = error; }, from(table) {
    calls.push(table);
    let filters = [], start = 0, end = 999, operation = 'select', payload, single = false;
    const builder = {
      select() { return builder; }, order() { return builder; },
      eq(k, v) { filters.push(row => row[k] === v); return builder; },
      in(k, v) { filters.push(row => v.includes(row[k])); return builder; },
      is(k, v) { filters.push(row => row[k] === v); return builder; },
      range(a, b) { start = a; end = b; return builder; }, limit(n) { end = start + n - 1; return builder; },
      maybeSingle() { single = true; return builder; }, single() { single = true; return builder; },
      insert(value) { operation = 'insert'; payload = value; return builder; },
      upsert(value, options) { operation = options?.ignoreDuplicates ? 'ignore' : 'upsert'; payload = value; return builder; },
      update(value) { operation = 'update'; payload = value; return builder; },
      then(resolve, reject) { return Promise.resolve().then(() => {
        if (failure) return { data: null, error: failure };
        const rows = tables[table] ||= [];
        if (operation === 'insert' || operation === 'upsert' || operation === 'ignore') {
          for (const value of [].concat(payload)) {
            const index = rows.findIndex(row => row.id === value.id);
            if (index < 0) rows.push(structuredClone(value));
            else if (operation !== 'ignore') rows[index] = { ...rows[index], ...structuredClone(value) };
          }
          return { data: single ? payload : [].concat(payload), error: null };
        }
        let selected = rows.filter(row => filters.every(filter => filter(row)));
        if (operation === 'update') selected.forEach(row => Object.assign(row, payload));
        const result = structuredClone(selected.slice(start, end + 1));
        return { data: single ? result[0] || null : result, count: selected.length, error: null };
      }).then(resolve, reject); }
    };
    return builder;
  } };
}

test('repository reads all pages, merges JSONB without losing phases/images, and uses only allowlisted tables', async () => {
  const rows = Array.from({ length: 1002 }, (_, i) => ({ id: String(i), name: `Company ${i}`, data: { id: i, phases: ['5.3'], images: ['photo.jpg'] } }));
  const client = fakeClient({ enterprises: rows });
  const repo = createSupabaseRepository({ client });
  const data = await repo.all('suppliers');
  assert.equal(data.length, 1002);
  assert.deepEqual(data[1001].phases, ['5.3']);
  assert.deepEqual(data[1001].images, ['photo.jpg']);
  await assert.rejects(repo.all('suppi_conversations'), { code: 'INVALID_COLLECTION' });
  assert.ok(client.calls.every(table => table === 'enterprises'));
});

test('database errors never silently fall back to JSON or empty success and do not leak provider errors', async () => {
  const client = fakeClient();
  client.fail({ message: 'secret-key, private query', code: 'XX' });
  const repo = createSupabaseRepository({ client });
  await assert.rejects(repo.all('suppliers'), error => error.code === 'DATABASE_UNAVAILABLE' && !error.message.includes('secret-key'));
  await assert.rejects(createSupabaseRepository({ client: null }).all('suppliers'), { code: 'DATABASE_UNAVAILABLE' });
});

test('public projection removes nested contacts/internal fields and refuses private, draft or rejected records', () => {
  const aliases = publicRecord({ name: 'Public', tax_code: 'secret', tel: 'secret', mobile: 'secret', contact: { name: 'secret', address: 'secret' }, phone_number: 'secret' });
  assert.equal(JSON.stringify(aliases).includes('secret'), false);
  const safe = publicRecord({ id: '1', name: 'Public', phone: 'secret', data: 'safe', nested: { email: 'secret', logo: 'x.jpg' }, buyerInfo: { companyName: 'secret' }, internalNotes: 'secret' });
  assert.equal(JSON.stringify(safe).includes('secret'), false);
  assert.equal(safe.nested.logo, 'x.jpg');
  const nested = publicRecord({ id: 'p', entries: [{ id: 'approved', status: 'APPROVED', senderEmail: 'secret', evidenceNotes: 'secret' }, { id: 'pending', moderationStatus: 'PENDING' }, { id: 'private', visibility: 'PRIVATE' }], responsibleUserName: 'secret' });
  assert.deepEqual(nested.entries, [{ id: 'approved', status: 'APPROVED' }]);
  assert.equal(JSON.stringify(nested).includes('secret'), false);
  for (const record of [{ status: 'DRAFT' }, { visibility: 'PRIVATE' }, { publishable: false }, { moderationStatus: 'REJECTED' }, { isPublished: false }]) assert.equal(publicRecord(record), null);
});

test('supplier response can be edited by its owner while pending, but not after review', async () => {
  const client = fakeClient();
  const store = createSubmissionStore({ client });
  const input = { kind: 'supplierResponse', ownerId: 'a', idempotencyKey: 'response:1', data: { message: 'First' } };
  const first = await store.create(input);
  const revised = await store.create({ ...input, data: { message: 'Revised' } });
  assert.equal(first.id, revised.id);
  assert.equal(revised.data.message, 'Revised');
  assert.equal(client.tables.ccu_submissions.length, 1);
  client.tables.ccu_submissions[0].status = 'APPROVED';
  await assert.rejects(store.create({ ...input, data: { message: 'Cannot alter reviewed record' } }), { code: 'SUBMISSION_REVIEWED' });
  assert.equal(client.tables.ccu_submissions[0].data.message, 'Revised');
});

test('public data documents are filtered by collection and visibility, no cross-collection private read', async () => {
  const client = fakeClient({ ccu_documents: [
    { id: 'programs:1', collection: 'programs', visibility: 'PUBLIC', data: { id: '1', title: 'Visible' } },
    { id: 'programs:2', collection: 'programs', visibility: 'PRIVATE', data: { id: '2', title: 'Hidden' } },
    { id: 'catalogues:3', collection: 'catalogues', visibility: 'PUBLIC', data: { id: '3', title: 'Other' } }
  ] });
  assert.deepEqual((await createSupabaseRepository({ client }).all('programs')).map(x => x.id), ['1']);
});

test('conversations persist across store instances, require owners, and propagate write failures', async () => {
  const client = fakeClient();
  const first = createSupabaseConversationStore({ client });
  await assert.rejects(first.create({}), { code: 'SESSION_REQUIRED' });
  const conv = await first.create({ owner_id: 'owner-a' });
  conv.messages = [{ role: 'user', content: '500 áo', created_at: new Date().toISOString() }];
  await first.save(conv);
  const second = createSupabaseConversationStore({ client });
  assert.equal((await second.get(conv.id)).messages[0].content, '500 áo');
  client.fail({ message: 'private database detail' });
  await assert.rejects(second.save(conv), { code: 'DATABASE_UNAVAILABLE' });
});

test('draft persistence enforces owner, draft-only status, safe updates and deterministic idempotency across instances', async () => {
  const client = fakeClient();
  const first = createSupabaseDraftStore({ client });
  const input = { conversation_id: 'c1', owner_id: 'owner-a', idempotency_key: 'k1', category: 'Bao bì', product_service: 'Carton', status: 'PUBLISHED', published_at: 'now' };
  const draft = await first.create(input);
  const second = createSupabaseDraftStore({ client });
  assert.equal((await second.create(input)).id, draft.id);
  assert.equal(client.tables.requirement_drafts.length, 1);
  assert.equal(draft.status, 'DRAFT');
  assert.equal(draft.published_at, null);
  assert.equal(await second.get(draft.id, { owner_id: 'owner-b' }), null);
  assert.equal(await second.update(draft.id, { notes: 'hacked' }, { owner_id: 'owner-b' }), null);
  const updated = await second.update(draft.id, { notes: 'ok', status: 'PUBLISHED', owner_id: 'owner-b' }, { owner_id: 'owner-a' });
  assert.equal(updated.notes, 'ok');
  assert.equal(updated.status, 'DRAFT');
  assert.equal(updated.owner_id, 'owner-a');
  await assert.rejects(second.get(draft.id), { code: 'SESSION_REQUIRED' });
});

test('private form submissions persist only after database acknowledgement, cannot self-approve or read other owners', async () => {
  const client = fakeClient();
  const store = createSubmissionStore({ client });
  const input = { kind: 'programInterest', ownerId: 'a', idempotencyKey: 'k', data: { name: 'Synthetic', email: 'test@example.invalid', programId: 'p1', status: 'APPROVED', owner_id: 'b', paymentStatus: 'PAID' } };
  const first = await store.create(input);
  assert.equal(first.status, 'PENDING');
  assert.equal(first.data.status, undefined);
  assert.equal(first.data.paymentStatus, undefined);
  assert.equal(first.owner_id, 'a');
  assert.equal((await createSubmissionStore({ client }).create(input)).id, first.id);
  assert.equal((await store.list({ ownerId: 'b' })).length, 0);
  assert.equal((await store.list({ ownerId: 'a' })).length, 1);
  await assert.rejects(store.create({ ...input, kind: 'adminApproval' }), { code: 'INVALID_SUBMISSION' });
  await assert.rejects(store.create({ ...input, ownerId: '' }), { code: 'SESSION_REQUIRED' });
  client.fail({ message: 'database down' });
  await assert.rejects(store.create(input), { code: 'DATABASE_UNAVAILABLE' });
});
