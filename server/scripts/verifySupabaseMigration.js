// Explicit live QA: synthetic records only; exact owner/id cleanup in finally.
// No model inference, email, payment, notification, or customer records modified.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabase } from '../supabase.js';
import { createSubmissionStore } from '../storage/submissionStore.js';
import { createSupabaseConversationStore, createSupabaseDraftStore } from '../storage/assistantStores.js';
import { databaseResult, requireDatabase } from '../storage/supabaseRepository.js';

if (!process.argv.includes('--live')) throw new Error('Run with --live to verify the configured Supabase project.');
const client = getSupabase();
requireDatabase(client);
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
assert.ok(key, 'Public key required for access checks');
const publicClient = createClient(process.env.SUPABASE_URL, key, { auth: { persistSession: false } });
const tables = ['enterprises','factories','industrial_parks','organizations','demands','suppi_conversations','requirement_drafts','ccu_documents','ccu_submissions'];
for (const table of tables) {
  const { error, status } = await publicClient.from(table).select('id').limit(1);
  assert.ok(error && [401, 403].includes(status), `Public access must be denied: ${table}`);
}
console.log('PASS: public-key access denied on all 9 tables');
for (const table of ['enterprises','factories','industrial_parks','organizations']) {
  const { count } = await databaseResult(client.from(table).select('id', { count: 'exact', head: true }));
  console.log(`${table}: ${count} records`);
}
const owner = `migration-qa:${randomUUID()}`;
let submission, conversation, draft;
try {
  const input = { kind: 'serviceRequest', ownerId: owner, idempotencyKey: randomUUID(), data: { qaTest: true, domain: 'migrationVerification', message: 'Synthetic persistence check; not a customer inquiry.' } };
  const store = createSubmissionStore({ client });
  submission = await store.create(input);
  assert.equal((await createSubmissionStore({ client }).create(input)).id, submission.id);
  assert.equal((await store.list({ ownerId: owner })).length, 1);
  assert.equal((await store.list({ ownerId: `${owner}:other` })).length, 0);
  assert.equal(submission.status, 'PENDING');
  console.log('PASS: private submission survives store recreation; retries deduplicated; foreign owner denied');
  const conversations = createSupabaseConversationStore({ client });
  conversation = await conversations.create({ owner_id: owner });
  conversation.messages = [{ role: 'user', content: 'Synthetic migration QA', created_at: new Date().toISOString() }];
  await conversations.save(conversation);
  assert.equal((await createSupabaseConversationStore({ client }).get(conversation.id)).messages.length, 1);
  const drafts = createSupabaseDraftStore({ client });
  draft = await drafts.create({ owner_id: owner, conversation_id: conversation.id, category: 'Migration QA', product_service: 'Synthetic', idempotency_key: 'qa' });
  assert.equal(draft.status, 'DRAFT');
  assert.equal(await drafts.get(draft.id, { owner_id: `${owner}:other` }), null);
  console.log('PASS: assistant conversation and private draft persisted; foreign draft owner denied');
} finally {
  for (const [table, record] of [['requirement_drafts', draft], ['suppi_conversations', conversation], ['ccu_submissions', submission]]) {
    if (record?.id && record.owner_id === owner) await databaseResult(client.from(table).delete().eq('id', record.id).eq('owner_id', owner));
  }
  console.log('QA cleanup finished: only synthetic records created by this run were targeted');
}
