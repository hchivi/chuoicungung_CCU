import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createDifyTurnRunner, parseDifyPlan } from '../assistants/difyOrchestrator.js';
import { AssistantError } from '../assistants/difyClient.js';
import { SUPPI_TOOLS } from '../suppi/toolRegistry.js';

const argsFor = name => Object.fromEntries(Object.entries(SUPPI_TOOLS.find(t => t.name === name).parameters.properties).map(([key, schema]) => [key, Array.isArray(schema.type) ? null : schema.type === 'array' ? [] : schema.type === 'number' ? 5 : 'carton']));
const planFor = (name = null) => ({ mode: 'SUPPI', slots: { query: 'carton' }, answer: 'Giao ở đâu anh/chị?', tool: name ? { name, arguments: argsFor(name) } : null });
const conversation = { id: 'owned-conversation', slots: { location: 'Long Thành' }, messages: [], dify_conversation_id: 'dify-history' };
const run = (runner, query = 'Tìm carton') => runner({ query, conversation, ownerId: 'owner', mode: 'SUPPI' });

test('SUPPI search surface uses the same Dify backend and never legacy API', async () => {
  const source = await fs.readFile(new URL('../../src/pages/SuppiSearchPage.jsx', import.meta.url), 'utf8');
  assert.match(source, /sendDifyMessage/);
  assert.doesNotMatch(source, /\/api\/suppi/);
});

test('runtime refuses to claim a draft is saved when database is disconnected', async () => {
  const source = await fs.readFile(new URL('../assistants/runtime.js', import.meta.url), 'utf8');
  const draftBranch = source.slice(source.indexOf("if (name === 'create_requirement_draft')"), source.indexOf("if (['search_products_services'"));
  assert.match(draftBranch, /mongoose\.connection\.readyState !== 1/);
  assert.match(draftBranch, /DATABASE_UNAVAILABLE/);
});

test('planner and response use Dify, preserve context, and execute only validated search', async () => {
  const calls = [];
  const runner = createDifyTurnRunner({ dify: async input => {
    calls.push(input);
    return { answer: calls.length === 1 ? JSON.stringify(planFor('search_suppliers')) : 'Có hồ sơ phù hợp mô tả carton.', conversation_id: 'next-history' };
  }, executeTool: async (name, args) => {
    assert.equal(name, 'search_suppliers');
    assert.equal(args.query, 'carton');
    return { items: [{ name: 'Public record', url: '/public-record' }] };
  } });
  const result = await run(runner);
  assert.equal(result.engine, 'dify');
  assert.equal(calls[0].conversationId, '');
  assert.equal(calls[1].conversationId, 'dify-history');
  assert.match(calls[0].query, /Long Thành/);
  assert.match(calls[1].query, /Public record/);
  assert.equal(result.providerConversationId, 'next-history');
  assert.equal(result.results.length, 1);
});

test('invalid plans and unapproved tools are refused', () => {
  for (const answer of ['not json', '{}', JSON.stringify({ ...planFor(), slots: { secret: 'x' } })]) assert.throws(() => parseDifyPlan(answer), { code: 'DIFY_INVALID_PLAN' });
  assert.throws(() => parseDifyPlan(JSON.stringify({ ...planFor(), tool: { name: 'publish_requirement', arguments: {} } })), { code: 'DIFY_TOOL_DENIED' });
  const plan = planFor('search_suppliers');
  plan.tool.arguments.extra = 'forbidden';
  assert.throws(() => parseDifyPlan(JSON.stringify(plan)), { code: 'DIFY_INVALID_PLAN' });
  delete plan.tool.arguments.extra;
  plan.tool.arguments.limit = 500;
  assert.equal(parseDifyPlan(JSON.stringify(plan)).tool.arguments.limit, 5);
});

for (const code of ['DATABASE_UNAVAILABLE', 'SOURCE_NOT_CONNECTED']) test(`${code} is not represented as an empty successful search`, async () => {
  let calls = 0;
  const result = await run(createDifyTurnRunner({ dify: async ({ query }) => {
    if (++calls === 1) return { answer: JSON.stringify(planFor('search_suppliers')) };
    assert.match(query, new RegExp(code));
    return { answer: 'Chưa truy vấn được dữ liệu.', conversation_id: 'history' };
  }, executeTool: async () => { throw new AssistantError(code, 'Chưa truy vấn được.', 503); } }));
  assert.deepEqual(result.retrieval, { status: 'unavailable', code });
});

for (const query of ['Anh cần carton', 'Đừng tạo bản nháp', 'Không lưu nháp nhé']) test(`draft needs affirmative request: ${query}`, async () => {
  let writes = 0;
  const runner = createDifyTurnRunner({ dify: async () => ({ answer: JSON.stringify(planFor('create_requirement_draft')) }), executeTool: async () => { writes++; return { status: 'DRAFT' }; } });
  await assert.rejects(run(runner, query), { code: 'DRAFT_CONFIRMATION_REQUIRED' });
  assert.equal(writes, 0);
});

test('saved draft is reported even if wording call fails, with owned conversation id', async () => {
  let calls = 0;
  let writes = 0;
  const result = await run(createDifyTurnRunner({ dify: async () => {
    if (++calls === 1) return { answer: JSON.stringify(planFor('create_requirement_draft')) };
    throw new Error('unavailable');
  }, executeTool: async (_name, args) => {
    assert.equal(args.conversation_id, conversation.id);
    writes++;
    return { id: 'draft-1', status: 'DRAFT' };
  } }), 'Tạo bản nháp giúp tôi');
  assert.equal(writes, 1);
  assert.match(result.answer, /draft-1/);
  assert.equal(result.draft.status, 'DRAFT');
});

test('service clears stale shortlist after a new empty search', async () => {
  const { createAssistantService } = await import('../assistants/service.js');
  const { createConversationStore } = await import('../suppi/conversationStore.js');
  const store = createConversationStore();
  const saved = await store.create({ owner_id: 'owner', latest_results: [{ name: 'old' }] });
  const service = createAssistantService({ conversationStore: store, difyTurn: async () => ({ mode: 'CHAINY', slots: {}, results: [], answer: 'Không có kết quả.', engine: 'dify', retrieval: { status: 'completed' }, searched: true }) });
  await service.send({ query: 'Tìm khác', conversationId: saved.id, ownerId: 'owner' });
  assert.deepEqual((await store.get(saved.id)).latest_results, []);
});
