import test from 'node:test';
import assert from 'node:assert/strict';
import { createGeminiClient } from '../assistants/geminiClient.js';
import { getAssistantConfiguration, createAssistantProvider } from '../assistants/provider.js';
import { createDifyTurnRunner } from '../assistants/difyOrchestrator.js';
import { createAssistantService } from '../assistants/service.js';
import { createConversationStore } from '../suppi/conversationStore.js';
import { SUPPI_TOOLS } from '../suppi/toolRegistry.js';

const responseFor = (text = 'Xin chào', extra = {}) => new Response(JSON.stringify({ modelVersion: 'gemini-3.1-flash-lite', candidates: [{ finishReason: 'STOP', content: { parts: [{ text }] } }], ...extra }));
const plan = { mode: 'SUPPI', slots: { product_service: 'áo thun', quantity: '500 cái' }, tool: null, answer: 'Anh/chị cần giao ở đâu?' };

test('Gemini uses server header credentials, business instructions, JSON planning and actual model metadata', async () => {
  let sent;
  const client = createGeminiClient({ apiKey: 'test-only-key', fetchImpl: async (url, options) => {
    sent = { url, options, body: JSON.parse(options.body) };
    return responseFor(JSON.stringify(plan));
  } });
  const result = await client({ query: 'CCU_BACKEND_PLAN_V1\nCần áo thun' });
  assert.equal(sent.options.headers['x-goog-api-key'], 'test-only-key');
  assert.doesNotMatch(sent.url, /test-only-key|key=/);
  assert.equal(sent.options.redirect, 'error');
  assert.equal(sent.body.generationConfig.responseMimeType, 'application/json');
  const schema = sent.body.generationConfig.responseJsonSchema;
  assert.equal(schema.properties.slots.additionalProperties, false);
  assert.deepEqual(schema.properties.mode.enum, ['SUPPI', 'CHAINY']);
  assert.equal(schema.properties.tool.anyOf[0].type, 'null');
  assert.match(sent.body.systemInstruction.parts[0].text, /SUPPI[\s\S]*CHAINY/);
  assert.match(sent.body.systemInstruction.parts[0].text, /chưa gửi|không gửi/);
  assert.match(sent.body.systemInstruction.parts[0].text, /không phải danh bạ/i);
  assert.equal(result.model, 'gemini-3.1-flash-lite');
  assert.equal(result.model_verified, true);
  assert.equal(result.conversation_id, '');
  assert.doesNotMatch(JSON.stringify(result), /test-only-key/);
});

test('Gemini natural reply is not constrained to JSON and hides thinking parts', async () => {
  const client = createGeminiClient({ apiKey: 'test-key', fetchImpl: async (_url, options) => {
    assert.equal(JSON.parse(options.body).generationConfig.responseMimeType, undefined);
    return responseFor('', { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'private reasoning', thought: true }, { text: 'Chưa gửi tin.' }] } }] });
  } });
  assert.equal((await client({ query: 'CCU_BACKEND_REPLY_V1\nSoạn tin' })).answer, 'Chưa gửi tin.');
});

for (const [status, code] of [[400, 'GEMINI_BAD_REQUEST'], [401, 'GEMINI_AUTH_ERROR'], [403, 'GEMINI_AUTH_ERROR'], [404, 'GEMINI_MODEL_UNAVAILABLE'], [429, 'GEMINI_QUOTA_EXCEEDED'], [503, 'GEMINI_UNAVAILABLE']]) {
  test(`Gemini maps HTTP ${status} to a safe actionable error without retry`, async () => {
    let calls = 0;
    const client = createGeminiClient({ apiKey: 'test-key', fetchImpl: async () => {
      calls++;
      return new Response('secret upstream diagnostic', { status });
    } });
    await assert.rejects(client({ query: 'test' }), error => error.code === code && !error.message.includes('secret upstream'));
    assert.equal(calls, 1);
  });
}

test('Gemini rejects missing keys and unsafe model names before any network call', async () => {
  await assert.rejects(createGeminiClient({ apiKey: '' })({ query: 'test' }), { code: 'GEMINI_NOT_CONFIGURED' });
  await assert.rejects(createGeminiClient({ apiKey: 'test', model: '../secrets?key=x' })({ query: 'test' }), { code: 'GEMINI_MODEL_INVALID' });
});

test('Gemini timeout and network failure are bounded, safe and never retried', async () => {
  let calls = 0;
  const client = createGeminiClient({ apiKey: 'test', timeoutMs: 5, fetchImpl: async (_url, { signal }) => {
    calls++;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
  } });
  await assert.rejects(client({ query: 'test' }), { code: 'GEMINI_TIMEOUT' });
  assert.equal(calls, 1);
  await assert.rejects(createGeminiClient({ apiKey: 'test', fetchImpl: async () => { throw new Error('private network details'); } })({ query: 'test' }), { code: 'GEMINI_UNAVAILABLE' });
});

for (const [label, factory, code] of [
  ['HTML', () => new Response('<html>bad gateway</html>'), 'GEMINI_INVALID_RESPONSE'],
  ['empty', () => responseFor(' '), 'GEMINI_EMPTY_ANSWER'],
  ['blocked', () => responseFor('', { promptFeedback: { blockReason: 'SAFETY' } }), 'GEMINI_BLOCKED'],
  ['truncated', () => responseFor('partial', { candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: 'partial' }] } }] }), 'GEMINI_TRUNCATED']
]) test(`Gemini rejects ${label} output rather than pretending success`, async () => {
  await assert.rejects(createGeminiClient({ apiKey: 'test', fetchImpl: async () => factory() })({ query: 'test' }), { code });
});

test('provider selection is explicit, defaults to existing Gemini key, and never falls back silently', async () => {
  assert.equal(getAssistantConfiguration({ GEMINI_API_KEY: 'test' }).provider, 'gemini');
  assert.equal(getAssistantConfiguration({ DIFY_API_KEY: 'test' }).provider, 'dify');
  assert.equal(getAssistantConfiguration({ VITE_GEMINI_API_KEY: 'browser-only' }).configured, false);
  const dify = getAssistantConfiguration({ ASSISTANT_PROVIDER: 'dify', GEMINI_API_KEY: 'test' });
  assert.equal(dify.configured, false);
  assert.equal(dify.model, null);
  assert.equal(dify.model_verified, false);
  assert.throws(() => getAssistantConfiguration({ ASSISTANT_PROVIDER: 'unknown' }), { code: 'AI_PROVIDER_INVALID' });
  await assert.rejects(createAssistantProvider({ env: { ASSISTANT_PROVIDER: 'gemini', DIFY_API_KEY: 'test' } }).client({ query: 'hello' }), { code: 'GEMINI_NOT_CONFIGURED' });
  const provider = createAssistantProvider({ env: { GEMINI_API_KEY: 'test' }, fetchImpl: async () => responseFor('ok') });
  assert.equal((await provider.client({ query: 'hello' })).answer, 'ok');
  const legacy = createAssistantProvider({ env: { ASSISTANT_PROVIDER: 'dify', DIFY_API_KEY: 'test' }, fetchImpl: async () => new Response(JSON.stringify({ answer: 'ok', conversation_id: 'dify-id' })) });
  assert.equal((await legacy.client({ query: 'hello', user: 'test' })).answer, 'ok');
});

test('Gemini clarification costs one call; SUPPI to CHAINY retains context and reports real model', async () => {
  const store = createConversationStore();
  let calls = 0;
  const runner = createDifyTurnRunner({ engine: 'gemini', skipReplyWhenNoTool: true, dify: async ({ query }) => {
    calls++;
    if (calls === 2) {
      assert.match(query, /500 cái/);
      assert.match(query, /áo thun/);
      return { answer: JSON.stringify({ ...plan, mode: 'CHAINY', answer: 'Mẫu tin nhắn xin báo giá 500 áo thun. Chưa gửi.' }), model: 'gemini-3.1-flash-lite', model_verified: true };
    }
    return { answer: JSON.stringify(plan), model: 'gemini-3.1-flash-lite', model_verified: true };
  }, executeTool: async () => { assert.fail('No tool should execute'); } });
  const service = createAssistantService({ conversationStore: store, difyTurn: runner });
  const first = await service.send({ ownerId: 'owner', query: 'Cần 500 áo thun', mode: 'SUPPI' });
  assert.equal(calls, 1);
  const second = await service.send({ ownerId: 'owner', conversationId: first.conversation_id, query: 'Soạn tin xin báo giá, không gửi', mode: 'CHAINY' });
  assert.equal(calls, 2);
  assert.equal(second.mode, 'CHAINY');
  assert.equal(second.metadata.engine, 'gemini');
  assert.equal(second.metadata.model_verified, true);
  assert.equal(second.metadata.configured_model, 'gemini-3.1-flash-lite');
  assert.match(second.answer, /Chưa gửi/);
  assert.deepEqual(second.actions_executed, []);
  await assert.rejects(service.send({ ownerId: 'other', conversationId: first.conversation_id, query: 'read' }), { code: 'CONVERSATION_NOT_FOUND' });
});

test('Gemini search uses validated backend tools and a second evidence-grounded reply', async () => {
  const schema = SUPPI_TOOLS.find(tool => tool.name === 'search_associations').parameters;
  const args = Object.fromEntries(Object.entries(schema.properties).map(([key, value]) => [key, Array.isArray(value.type) ? null : value.type === 'number' ? 5 : 'cơ khí']));
  let calls = 0;
  const result = await createDifyTurnRunner({ engine: 'gemini', skipReplyWhenNoTool: true, dify: async ({ query }) => {
    if (++calls === 1) return { answer: JSON.stringify({ ...plan, tool: { name: 'search_associations', arguments: args } }) };
    assert.match(query, /Public association/);
    return { answer: 'Hồ sơ từ hệ thống.', model: 'gemini-3.1-flash-lite', model_verified: true };
  }, executeTool: async name => {
    assert.equal(name, 'search_associations');
    return { items: [{ id: 'public', name: 'Public association' }] };
  } })({ query: 'Tìm hội cơ khí', conversation: { id: 'owned', slots: {}, messages: [] }, ownerId: 'owner', mode: 'SUPPI' });
  assert.equal(calls, 2);
  assert.equal(result.retrieval.status, 'completed');
  assert.equal(result.model_verified, true);
});
