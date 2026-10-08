import test from 'node:test';
import assert from 'node:assert/strict';
import { selectModelTier, createModelRoutedTurn } from '../assistants/modelRouting.js';
import { getAssistantConfiguration } from '../assistants/provider.js';
import { createAssistantService } from '../assistants/service.js';
import { createConversationStore } from '../suppi/conversationStore.js';
import { SUPPI_TOOLS } from '../suppi/toolRegistry.js';

const env = { GEMINI_API_KEY: 'test-only', GEMINI_ROUTING: 'auto', GEMINI_SIMPLE_MODEL: 'gemini-3.1-flash-lite', GEMINI_COMPLEX_MODEL: 'gemini-3.8-flash' };
const plan = { mode: 'SUPPI', slots: {}, tool: null, answer: 'Nội dung thử nghiệm. Chưa gửi.' };
const reply = (value, model) => new Response(JSON.stringify({ modelVersion: model, candidates: [{ finishReason: 'STOP', content: { parts: [{ text: typeof value === 'string' ? value : JSON.stringify(value) }] } }] }));

test('deterministic routing keeps greetings/basic search on Lite, routes technical/compare/RFQ to Flash', () => {
  for (const query of ['Xin chào', 'SUPPI hỗ trợ gì?', 'Tìm nhà cung ứng áo thun tại Bình Dương', 'Soạn lời chào đối tác']) assert.equal(selectModelTier(query).tier, 'simple', query);
  for (const query of ['So sánh 3 nhà cung ứng', 'Phân tích bản vẽ và dung sai 0.005mm', 'Soạn RFQ 500 áo thun', 'Lập yêu cầu báo giá', 'Đối chiếu năng lực và tiêu chuẩn ISO 9001']) assert.equal(selectModelTier(query).tier, 'complex', query);
  assert.equal(selectModelTier('Viết lại ngắn hơn', { messages: [{ role: 'user', content: 'Soạn RFQ 500 áo' }] }).tier, 'complex');
  assert.equal(selectModelTier('Xin chào', { messages: [{ role: 'user', content: 'Soạn RFQ' }] }).tier, 'simple');
});

test('model configuration exposes both tiers without credentials and preserves legacy model override', () => {
  const config = getAssistantConfiguration(env);
  assert.equal(config.routing.mode, 'auto');
  assert.equal(config.routing.simple_model, env.GEMINI_SIMPLE_MODEL);
  assert.equal(config.routing.complex_model, env.GEMINI_COMPLEX_MODEL);
  assert.equal(JSON.stringify(config).includes('test-only'), false);
  assert.equal(getAssistantConfiguration({ GEMINI_API_KEY: 'test', GEMINI_MODEL: 'custom-lite' }).routing.simple_model, 'custom-lite');
});

test('SUPPI and CHAINY switch models on one conversation with shared history, one call for no-tool turns', async () => {
  const calls = [];
  const runner = createModelRoutedTurn({ env, executeTool: async () => assert.fail('No tool expected'), fetchImpl: async (url, options) => {
    const model = url.match(/models\/([^:]+)/)[1];
    calls.push({ model, body: JSON.parse(options.body) });
    return reply({ ...plan, mode: calls.length === 2 ? 'CHAINY' : 'SUPPI', slots: { product_service: 'áo thun' } }, model);
  } });
  const service = createAssistantService({ conversationStore: createConversationStore(), difyTurn: runner });
  const first = await service.send({ query: 'Cần áo thun', ownerId: 'owner', mode: 'SUPPI' });
  const second = await service.send({ query: 'Soạn RFQ cho nhu cầu vừa nêu, không gửi', conversationId: first.conversation_id, ownerId: 'owner', mode: 'CHAINY' });
  assert.equal(first.conversation_id, second.conversation_id);
  assert.deepEqual(calls.map(c => c.model), [env.GEMINI_SIMPLE_MODEL, env.GEMINI_COMPLEX_MODEL]);
  assert.match(calls[1].body.contents[0].parts[0].text, /Cần áo thun/);
  assert.equal(second.metadata.model_routing.tier, 'complex');
  assert.equal(second.model, env.GEMINI_COMPLEX_MODEL);
  assert.equal(second.model_verified, true);
  assert.deepEqual(second.actions_executed, []);
});

test('tool planning and evidence reply stay on the same selected model; no speculative dual calls', async () => {
  const tool = SUPPI_TOOLS.find(t => t.name === 'search_suppliers');
  const args = Object.fromEntries(Object.entries(tool.parameters.properties).map(([k, v]) => [k, Array.isArray(v.type) ? null : v.type === 'number' ? 5 : 'CNC']));
  const calls = [];
  const runner = createModelRoutedTurn({ env, executeTool: async () => ({ items: [{ id: 'p1', name: 'Public supplier' }] }), fetchImpl: async url => {
    const model = url.match(/models\/([^:]+)/)[1]; calls.push(model);
    return reply(calls.length === 1 ? { ...plan, tool: { name: tool.name, arguments: args } } : 'Kết quả từ hệ thống.', model);
  } });
  await runner({ query: 'So sánh năng lực gia công CNC', conversation: { id: 'c1', messages: [] }, ownerId: 'owner', mode: 'SUPPI' });
  assert.deepEqual(calls, [env.GEMINI_COMPLEX_MODEL, env.GEMINI_COMPLEX_MODEL]);
});

test('quota error never triggers another model, provider, or automatic retry', async () => {
  let calls = 0;
  const runner = createModelRoutedTurn({ env, fetchImpl: async () => { calls++; return new Response('{}', { status: 429 }); } });
  await assert.rejects(runner({ query: 'Soạn RFQ', conversation: { id: 'c1' }, ownerId: 'owner', mode: 'CHAINY' }), { code: 'GEMINI_QUOTA_EXCEEDED' });
  assert.equal(calls, 1);
});

test('single mode remains an explicit rollback option', async () => {
  let calledModel;
  const runner = createModelRoutedTurn({ env: { ...env, GEMINI_ROUTING: 'single' }, fetchImpl: async url => {
    calledModel = url.match(/models\/([^:]+)/)[1]; return reply(plan, calledModel);
  } });
  await runner({ query: 'Soạn RFQ', conversation: { id: 'c1' }, ownerId: 'owner', mode: 'SUPPI' });
  assert.equal(calledModel, env.GEMINI_SIMPLE_MODEL);
});
