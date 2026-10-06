import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('web Dify adapter never contains provider credentials or direct Gemini fallback', async () => {
  const source = await fs.readFile(new URL('../../src/services/difyService.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /VITE_DIFY_API_KEY|Authorization|askGeminiSourcingAgent/);
  assert.match(source, /\/api\/assistants\/chat/);
});

test('workspace uses the same backend transport and does not call the mock response factory', async () => {
  const source = await fs.readFile(new URL('../../src/pages/AiWorkspacePage.jsx', import.meta.url), 'utf8');
  const handler = source.slice(source.indexOf('const handleSendMessage ='), source.indexOf('const handleKeyDown ='));
  assert.match(handler, /sendDifyMessage/);
  assert.doesNotMatch(handler, /askGeminiSourcingAgent|createEntityDraft|KYC Kim Cương|matchRate: "98%"/);
});

test('Dify server client keeps key on server and preserves provider conversation', async () => {
  const { createDifyClient } = await import('../assistants/difyClient.js');
  let sent;
  const client = createDifyClient({ apiKey: 'test-only-key', fetchImpl: async (url, options) => {
    sent = { url, options, body: JSON.parse(options.body) };
    return new Response(JSON.stringify({ answer: 'Giao ở đâu anh/chị?', conversation_id: 'provider-conversation', id: 'message-1' }));
  } });
  const result = await client({ query: 'carton', user: 'server-owner', conversationId: 'provider-conversation' });
  assert.equal(sent.options.headers.Authorization, 'Bearer test-only-key');
  assert.equal(sent.body.conversation_id, 'provider-conversation');
  assert.equal(sent.body.user, 'server-owner');
  assert.equal(result.answer, 'Giao ở đâu anh/chị?');
  assert.equal(result.conversation_id, 'provider-conversation');
  assert.doesNotMatch(JSON.stringify(result), /test-only-key/);
});

for (const [label, response, code] of [
  ['empty body', new Response(''), 'DIFY_INVALID_RESPONSE'],
  ['HTML instead of JSON', new Response('<html>proxy error</html>'), 'DIFY_INVALID_RESPONSE'],
  ['empty answer', new Response(JSON.stringify({ answer: ' ', conversation_id: 'provider' })), 'DIFY_EMPTY_ANSWER'],
  ['upstream error', new Response('private provider details', { status: 401 }), 'DIFY_UPSTREAM_ERROR']
]) test(`Dify client reports ${label} without exposing provider details`, async () => {
  const { createDifyClient } = await import('../assistants/difyClient.js');
  const client = createDifyClient({ apiKey: 'test-key', fetchImpl: async () => response.clone() });
  await assert.rejects(client({ query: 'carton', user: 'owner' }), error => error.code === code && !error.message.includes('private provider details'));
});

test('Dify client rejects missing key and times out without retrying billable messages', async () => {
  const { createDifyClient } = await import('../assistants/difyClient.js');
  await assert.rejects(createDifyClient({ apiKey: '' })({ query: 'test', user: 'owner' }), { code: 'DIFY_NOT_CONFIGURED' });
  let calls = 0;
  const client = createDifyClient({ apiKey: 'test-key', timeoutMs: 10, fetchImpl: async (_url, options) => {
    calls++;
    return new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason)));
  } });
  await assert.rejects(client({ query: 'test', user: 'owner' }), { code: 'DIFY_TIMEOUT' });
  assert.equal(calls, 1);
});

test('assistant service binds context to server owner, retains slots and refuses cross-owner access', async () => {
  const { createAssistantService } = await import('../assistants/service.js');
  const { createConversationStore } = await import('../suppi/conversationStore.js');
  const { createSuppiOrchestrator } = await import('../suppi/orchestrator.js');
  const store = createConversationStore();
  const suppi = createSuppiOrchestrator({ conversationStore: store, executeTool: async () => ({ items: [], total: 0 }) });
  const service = createAssistantService({ suppi, conversationStore: store });
  const first = await service.send({ query: 'Anh cần carton', ownerId: 'owner-a' });
  assert.match(first.answer, /khu vực/);
  const second = await service.send({ query: 'Long Thành', conversationId: first.conversation_id, ownerId: 'owner-a' });
  assert.equal(second.slots.query, 'carton');
  assert.equal(second.slots.location.district, 'Long Thành');
  await assert.rejects(service.send({ query: 'xem lịch sử', conversationId: first.conversation_id, ownerId: 'owner-b' }), { code: 'CONVERSATION_NOT_FOUND' });
});

test('CHAINY keeps sourcing context but cannot send, publish, mark WON or schedule without integrations', async () => {
  const { createAssistantService } = await import('../assistants/service.js');
  const { createConversationStore } = await import('../suppi/conversationStore.js');
  const { createSuppiOrchestrator } = await import('../suppi/orchestrator.js');
  const store = createConversationStore();
  const suppi = createSuppiOrchestrator({ conversationStore: store, executeTool: async () => ({ items: [], total: 0 }) });
  const service = createAssistantService({ suppi, conversationStore: store });
  const first = await service.send({ query: 'Anh cần carton', ownerId: 'owner' });
  const second = await service.send({ query: 'Gửi báo giá, ghi WON và nhắc thứ Sáu', mode: 'CHAINY', conversationId: first.conversation_id, ownerId: 'owner' });
  assert.equal(second.mode, 'CHAINY');
  assert.equal(second.slots.query, 'carton');
  assert.match(second.answer, /chưa gửi/i);
  assert.match(second.answer, /WON/);
  assert.deepEqual(second.actions_executed, []);
});

test('CHAINY Dify receives bounded sourcing context and keeps its own provider conversation', async () => {
  const { createAssistantService } = await import('../assistants/service.js');
  const { createConversationStore } = await import('../suppi/conversationStore.js');
  const { createSuppiOrchestrator } = await import('../suppi/orchestrator.js');
  const store = createConversationStore();
  const conversation = await store.create({ owner_id: 'owner', slots: { query: 'carton' }, latest_results: [{ name: 'Public supplier', url: '/test-public', summary: 'carton', secret: 'must-not-send' }] });
  const calls = [];
  const service = createAssistantService({ conversationStore: store, suppi: createSuppiOrchestrator({ conversationStore: store, executeTool: async () => ({}) }), dify: async input => {
    calls.push(input);
    return { answer: 'Đây là bản soạn, chưa gửi.', conversation_id: 'provider-1' };
  } });
  const send = query => service.send({ query, mode: 'CHAINY', conversationId: conversation.id, ownerId: 'owner' });
  const first = await send('Soạn nội dung liên hệ');
  await send('Rút ngắn nội dung');
  assert.equal(first.engine, 'dify');
  assert.equal(calls[1].conversationId, 'provider-1');
  assert.match(calls[0].query, /carton/);
  assert.doesNotMatch(calls[0].query, /must-not-send/);
  assert.deepEqual(first.actions_executed, []);
});

test('runtime requires Dify for both roles, never falls back to OpenAI or fixtures', async () => {
  const saved = { openai: process.env.OPENAI_API_KEY, dify: process.env.DIFY_API_KEY };
  delete process.env.OPENAI_API_KEY;
  delete process.env.DIFY_API_KEY;
  try {
    const { createAssistantRuntime } = await import('../assistants/runtime.js');
    const service = createAssistantRuntime();
    for (const mode of ['SUPPI', 'CHAINY']) await assert.rejects(service.send({ query: 'Anh cần carton', ownerId: 'owner', mode }), { code: 'DIFY_NOT_CONFIGURED' });
  } finally {
    for (const [name, value] of [['OPENAI_API_KEY', saved.openai], ['DIFY_API_KEY', saved.dify]]) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});

test('assistant request validation and concurrent turns fail explicitly', async () => {
  const { createAssistantService } = await import('../assistants/service.js');
  const { createConversationStore } = await import('../suppi/conversationStore.js');
  const { createSuppiOrchestrator } = await import('../suppi/orchestrator.js');
  const store = createConversationStore();
  let release;
  const suppi = createSuppiOrchestrator({ conversationStore: store, executeTool: () => new Promise(resolve => { release = resolve; }) });
  const service = createAssistantService({ suppi, conversationStore: store });
  await assert.rejects(service.send({ query: '', ownerId: 'owner' }), { code: 'INVALID_QUERY' });
  await assert.rejects(service.send({ query: 'test', mode: 'ADMIN', ownerId: 'owner' }), { code: 'INVALID_MODE' });
  await assert.rejects(service.send({ query: 'test', conversationId: { id: 'bad' }, ownerId: 'owner' }), { code: 'INVALID_CONVERSATION_ID' });
  const first = await service.send({ query: 'Anh cần carton', ownerId: 'owner' });
  const pending = service.send({ query: 'Long Thành', ownerId: 'owner', conversationId: first.conversation_id });
  while (!release) await new Promise(resolve => setImmediate(resolve));
  await assert.rejects(service.send({ query: 'Đồng Nai', ownerId: 'owner', conversationId: first.conversation_id }), { code: 'CONVERSATION_BUSY' });
  release({ items: [], total: 0 });
  await pending;
});

test('legacy routes cannot bypass ownership of the new assistant conversations or drafts', async () => {
  const source = await fs.readFile(new URL('../routes/suppi.js', import.meta.url), 'utf8');
  assert.match(source, /if \(!conversation \|\| conversation\.owner_id\)/);
  const handler = source.slice(source.indexOf("router.post('/conversations/:id/messages'"), source.indexOf("router.get('/requirement-drafts"));
  assert.ok(handler.indexOf('conversation.owner_id') < handler.indexOf('suppi.sendMessage'));
  const update = source.slice(source.indexOf("router.patch('/requirement-drafts"));
  assert.ok(update.indexOf('draft.owner_id') < update.indexOf('draftStore.update'));
});

test('draft ownership cannot be overwritten through an editable draft patch', async () => {
  const { createDraftStore } = await import('../suppi/draftStore.js');
  const store = createDraftStore();
  const draft = await store.create({ owner_id: 'owner-a', product_service: 'carton' });
  const updated = await store.update(draft.id, { owner_id: 'owner-b', product_service: 'polo' }, { owner_id: 'owner-a' });
  assert.equal(updated.owner_id, 'owner-a');
  assert.equal(updated.product_service, 'polo');
});

test('SUPPI reads raw Responses API message text and keeps CHAINY turns when switching back', async () => {
  const { createAssistantService } = await import('../assistants/service.js');
  const { createConversationStore } = await import('../suppi/conversationStore.js');
  const { createSuppiOrchestrator } = await import('../suppi/orchestrator.js');
  const store = createConversationStore();
  const requests = [];
  const suppi = createSuppiOrchestrator({ conversationStore: store, executeTool: async () => ({}), openAI: async payload => {
    requests.push(payload);
    return { id: `response-${requests.length}`, output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Hồ sơ cần xác nhận thêm.' }] }] };
  } });
  const service = createAssistantService({ suppi, conversationStore: store });
  const first = await service.send({ query: 'Anh cần carton', ownerId: 'owner' });
  assert.equal(first.answer, 'Hồ sơ cần xác nhận thêm.');
  await service.send({ query: 'Soạn liên hệ', mode: 'CHAINY', conversationId: first.conversation_id, ownerId: 'owner' });
  await service.send({ query: 'Long Thành', mode: 'SUPPI', conversationId: first.conversation_id, ownerId: 'owner' });
  assert.equal(requests[1].previous_response_id, undefined);
  assert.ok(requests[1].input.some(item => item.content === 'Soạn liên hệ'));
});

test('live source excludes private, draft and unapproved legacy records and never substitutes fixtures', async () => {
  const { loadPublicAssistantData } = await import('../assistants/dataSource.js');
  const publicRecord = { id: 'public-1', name: 'Public supplier', status: 'PUBLISHED', email: 'private@example.test', phone: 'private' };
  const model = { find: (filter, projection) => {
    assert.ok(filter.$and);
    assert.equal(projection.email, undefined);
    return { limit: () => ({ lean: async () => [publicRecord] }) };
  } };
  const data = await loadPublicAssistantData({ connected: true, models: { suppliers: model } });
  assert.equal(data.suppliers.length, 1);
  assert.deepEqual(data.factories, []);
  assert.equal(data.suppliers[0].email, undefined);
  assert.equal(data.suppliers[0].verified, false);
  await assert.rejects(loadPublicAssistantData({ connected: false, models: {} }), { code: 'DATABASE_UNAVAILABLE' });
});

test('server session signs an HttpOnly cookie, ignores browser user ID and handles malformed cookies', async () => {
  const { createAssistantSession } = await import('../assistants/session.js');
  const middleware = createAssistantSession({ secret: 'synthetic-session-secret' });
  const cookies = [];
  const response = { cookie: (...args) => cookies.push(args) };
  const first = { headers: { cookie: 'ccu_assistant_session=malformed', 'x-user-id': 'admin', 'x-auth-token': 'not-auth' } };
  middleware(first, response, () => {});
  assert.equal(cookies[0][2].httpOnly, true);
  assert.equal(cookies[0][2].sameSite, 'strict');
  assert.notEqual(first.assistantOwnerId, 'admin');
  const next = { headers: { cookie: `${cookies[0][0]}=${cookies[0][1]}` } };
  middleware(next, response, () => {});
  assert.equal(next.assistantOwnerId, first.assistantOwnerId);
  assert.equal(cookies.length, 1);
});

test('HTTP gateway retains cookie-owned memory, denies another session, validates input and rejects disallowed origins', async t => {
  process.env.SUPPI_DISABLE_OPENAI = '1';
  const { createAssistantService } = await import('../assistants/service.js');
  const { createConversationStore } = await import('../suppi/conversationStore.js');
  const { createSuppiOrchestrator } = await import('../suppi/orchestrator.js');
  const { createApp } = await import('../app.js');
  const store = createConversationStore();
  const suppi = createSuppiOrchestrator({ conversationStore: store, executeTool: async () => ({ items: [], total: 0 }) });
  const server = createApp({ assistantService: createAssistantService({ suppi, conversationStore: store }) }).listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/api/assistants/chat`;
  const status = await fetch(url.replace('/chat', '/status'));
  assert.equal(status.status, 200);
  assert.ok((await status.json()).data.pending_sources.includes('catalogues'));
  const send = (body, headers = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  const first = await send({ query: 'Anh cần carton', user: 'admin' });
  assert.equal(first.status, 200);
  const cookie = first.headers.get('set-cookie').split(';')[0];
  const id = (await first.json()).data.conversation_id;
  const second = await send({ query: 'Long Thành', conversation_id: id }, { Cookie: cookie });
  assert.equal((await second.json()).data.slots.location.district, 'Long Thành');
  const stranger = await send({ query: 'đọc', conversation_id: id });
  assert.equal(stranger.status, 404);
  assert.equal((await stranger.json()).error.code, 'CONVERSATION_NOT_FOUND');
  assert.equal((await send({ query: '' }, { Cookie: cookie })).status, 400);
  assert.equal((await send({ query: 'test' }, { Origin: 'https://untrusted.example' })).status, 403);
});
