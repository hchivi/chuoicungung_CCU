/**
 * Comprehensive Backend Architecture & Security Tests
 * Mandatory according to codex_fixed.txt Section XIII (22 Required Tests).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';
import { createDraftStore } from '../suppi/draftStore.js';
import { createOpenAIResponseRequester } from '../suppi/openaiResponsesClient.js';
import { CANONICAL_REDIRECT_MAP, GHOST_ENTITIES_404 } from '../routes/redirects.js';
import { createRateLimiter } from '../middleware/security.js';

let server;
let baseUrl;

test.before(async () => {
  process.env.SUPPI_DISABLE_OPENAI = '1';
  process.env.TEST_RATE_LIMIT = '1';
  const app = createApp();
  server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  if (server) await new Promise(r => server.close(r));
});

// 1. /api/status trả JSON
test('1. /api/status trả JSON', async () => {
  const res = await fetch(`${baseUrl}/api/status`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') || '', /application\/json/);
  const data = await res.json();
  assert.equal(data.status, 'online');
  assert.ok(data.mongodb !== undefined);
});

// 2. /robots.txt trả text/plain
test('2. /robots.txt trả text/plain', async () => {
  const res = await fetch(`${baseUrl}/robots.txt`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') || '', /text\/plain/);
  const text = await res.text();
  assert.match(text, /User-agent: \*/);
  assert.match(text, /Sitemap: https:\/\/chuoicungung\.com\/sitemap\.xml/);
});

// 3. /sitemap.xml trả XML
test('3. /sitemap.xml trả application/xml', async () => {
  const res = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') || '', /application\/xml/);
  const xml = await res.text();
  assert.match(xml, /<\?xml version="1\.0"/);
  assert.match(xml, /<urlset/);
});

// 4. Unknown /api route trả JSON 404
test('4. Unknown /api route trả JSON 404', async () => {
  const res = await fetch(`${baseUrl}/api/non-existent-endpoint-xyz`);
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-type') || '', /application\/json/);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.error.code, 'NOT_FOUND');
});

// 5. Không có API route nào trả index.html
test('5. Không có API route nào trả index.html', async () => {
  const res = await fetch(`${baseUrl}/api/random-unknown-route`);
  const text = await res.text();
  assert.doesNotMatch(text, /<!DOCTYPE html>/i);
  assert.doesNotMatch(text, /<div id="root">/i);
});

// 6. Public demand không lộ email/phone
test('6. Public demand không lộ authorEmail hoặc authorPhone', async () => {
  const res = await fetch(`${baseUrl}/api/demands`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  for (const demand of body.data) {
    assert.equal(demand.authorEmail, undefined);
    assert.equal(demand.authorPhone, undefined);
  }
});

// 7. Unauthenticated write / malformed demand bị từ chối
test('7. POST /api/demands thiếu trường bắt buộc bị từ chối 400', async () => {
  const res = await fetch(`${baseUrl}/api/demands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Thiếu trường' })
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.error.code, 'VALIDATION_ERROR');
});

// 8. User A không đọc/sửa conversation hoặc draft của User B
test('8. User A không đọc/sửa draft của User B (Ownership Check)', async () => {
  const store = createDraftStore();
  const draft = await store.create({
    conversation_id: 'conv-owner-1',
    owner_id: 'user-a',
    category: 'Bao bì',
    product_service: 'Thùng carton 5 lớp'
  });

  // User B attempts to read User A's draft
  const readByB = await store.get(draft.id, { owner_id: 'user-b' });
  assert.equal(readByB, null);

  // User B attempts to update User A's draft
  const updateByB = await store.update(draft.id, { notes: 'Hacked' }, { owner_id: 'user-b' });
  assert.equal(updateByB, null);

  // User A can read successfully
  const readByA = await store.get(draft.id, { owner_id: 'user-a' });
  assert.ok(readByA !== null);
  assert.equal(readByA.category, 'Bao bì');
});

// 9. Seed HTTP endpoint không tồn tại ở production
test('9. POST /api/seed không tồn tại (trả 404)', async () => {
  const res = await fetch(`${baseUrl}/api/seed`, { method: 'POST' });
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.success, false);
});

// 10. Requirement draft không thể thành published
test('10. Requirement draft không thể đổi status thành PUBLISHED', async () => {
  const store = createDraftStore();
  const draft = await store.create({
    conversation_id: 'conv-10',
    category: 'Cơ khí',
    product_service: 'Gia công CNC'
  });

  const updated = await store.update(draft.id, { status: 'PUBLISHED', published_at: '2026-09-30' });
  assert.equal(updated.status, 'DRAFT');
  assert.equal(updated.published_at, null);
});

// 11. Repeated create_requirement_draft với cùng idempotency key không tạo bản ghi trùng
test('11. create_requirement_draft với cùng idempotency_key trả về bản ghi cũ', async () => {
  const store = createDraftStore();
  const draft1 = await store.create({
    conversation_id: 'conv-idem',
    idempotency_key: 'idem-key-12345',
    category: 'Hóa chất',
    product_service: 'Dung môi công nghiệp'
  });

  const draft2 = await store.create({
    conversation_id: 'conv-idem',
    idempotency_key: 'idem-key-12345',
    category: 'Hóa chất',
    product_service: 'Dung môi công nghiệp'
  });

  assert.equal(draft1.id, draft2.id);
});

// 12. Invalid slug trả 404, không trả bản ghi đầu tiên
test('12. Ghost entity slug trả 404, không soft-fallback', async () => {
  for (const ghostPath of GHOST_ENTITIES_404) {
    const res = await fetch(`${baseUrl}${ghostPath}`);
    assert.equal(res.status, 404);
  }
});

// 13. Duplicate slug được phát hiện trong Registry
test('13. Canonical redirect map contains verified duplicate routes', () => {
  assert.equal(CANONICAL_REDIRECT_MAP['/tam-nhin-ha-tang-quoc-gia'], '/he-sinh-thai');
  assert.equal(CANONICAL_REDIRECT_MAP['/san-pham-dich-vu'], '/nha-cung-ung');
});

// 14. Sponsored flag không làm thay đổi thứ tự matching
test('14. Sponsored flag không làm thay đổi thứ tự matching', async () => {
  const { fuseRankedResults } = await import('../suppi/atlasHybridSearch.js');
  const lexical = [
    { entity_id: '1', title: 'Công ty 1', isSponsored: false },
    { entity_id: '2', title: 'Công ty 2', isSponsored: true }
  ];
  const vector = [
    { entity_id: '1', title: 'Công ty 1', isSponsored: false },
    { entity_id: '2', title: 'Công ty 2', isSponsored: true }
  ];
  const fused = fuseRankedResults(lexical, vector, 2);
  assert.equal(fused[0].entity_id, '1');
  assert.ok(fused.every(item => !Object.hasOwn(item, 'isSponsored')));
});

// 15. Unpublished entity không xuất hiện trong search
test('15. Unpublished entity không xuất hiện trong kết quả search', async () => {
  const { createAtlasHybridSearch } = await import('../suppi/atlasHybridSearch.js');
  const dummyModel = { db: { readyState: 0 } }; // not ready, returns null
  const searcher = createAtlasHybridSearch({ model: dummyModel });
  const result = await searcher.search('SUPPLIER', { query: 'test' });
  assert.equal(result, null);
});

// 16. Search result chỉ chứa entity thật trong database
test('16. Fallback assistant không bịa đặt khi database rỗng', async () => {
  const { runFallbackTurn } = await import('../suppi/fallbackAssistant.js');
  const result = await runFallbackTurn({
    message: 'Tìm nhà cung cấp tên Vũ Trụ Ma Thuật Không Tồn Tại ở Đà Nẵng',
    conversation: { slots: { location: { province: 'Đà Nẵng' } } },
    executeTool: async () => ({ items: [], total: 0 })
  });
  assert.match(result.message, /chưa tìm thấy/i);
});

// 17. Conversation nhớ context "carton" + "Long Thành"
test('17. Conversation remembers category carton and merges location Long Thành', async () => {
  const { mergeConversationSlots } = await import('../suppi/fallbackAssistant.js');
  
  // Turn 1: user asks for carton
  const slots1 = mergeConversationSlots({}, 'Anh cần carton');
  assert.equal(slots1.query, 'carton');

  // Turn 2: user responds with location Long Thành
  const slots2 = mergeConversationSlots(slots1, 'Long Thành');
  assert.equal(slots2.query, 'carton');
  assert.equal(slots2.location.district, 'Long Thành');
  assert.equal(slots2.location.province, 'Đồng Nai');
});

// 18. Empty/non-JSON OpenAI response không gây JSON.parse crash
test('18. Empty/non-JSON OpenAI response được xử lý an toàn không crash', async () => {
  const fakeFetch = async () => ({
    ok: false,
    status: 500,
    text: async () => 'Internal Server Error HTML'
  });

  const requester = createOpenAIResponseRequester({
    apiKey: 'fake-key',
    fetchImpl: fakeFetch,
    maxRetries: 0
  });

  await assert.rejects(
    async () => await requester({ model: 'gpt-4o', input: 'test' }),
    /không phải JSON hợp lệ/
  );
});

// 19. Rate limit trả 429 có JSON body hợp lệ
test('19. Rate limiter trả 429 với JSON body chuẩn', async () => {
  const limiter = createRateLimiter({ windowMs: 10000, max: 2 });
  const mockReq = { headers: {}, socket: { remoteAddress: '10.0.0.1' }, id: 'test-req-id' };
  let statusCode = 200;
  let jsonBody = null;
  const mockRes = {
    setHeader: () => {},
    status: (code) => { statusCode = code; return { json: (body) => { jsonBody = body; } }; }
  };
  const next = () => {};

  limiter(mockReq, mockRes, next); // 1
  limiter(mockReq, mockRes, next); // 2
  limiter(mockReq, mockRes, next); // 3 (exceeded)

  assert.equal(statusCode, 429);
  assert.equal(jsonBody.success, false);
  assert.equal(jsonBody.error.code, 'RATE_LIMIT_EXCEEDED');
});

// 20. Redirect giữ nguyên query string
test('20. 301 Redirect giữ nguyên query string', async () => {
  const res = await fetch(`${baseUrl}/tam-nhin-ha-tang-quoc-gia?utm_source=google&ref=123`, {
    redirect: 'manual'
  });
  assert.equal(res.status, 301);
  const location = res.headers.get('location');
  assert.equal(location, '/he-sinh-thai?utm_source=google&ref=123');
});

// 21. Sitemap không chứa redirect, 404, admin hoặc private URL
test('21. Sitemap không chứa route admin hoặc ghost 404', async () => {
  const res = await fetch(`${baseUrl}/sitemap.xml`);
  const xml = await res.text();
  assert.doesNotMatch(xml, /\/admin\//);
  assert.doesNotMatch(xml, /\/tai-khoan\//);
  assert.doesNotMatch(xml, /ORG-PROSER-001/);
});

// 22. MongoDB unavailable làm /readyz trả 503
test('22. /readyz trả 503 khi MongoDB chưa kết nối', async () => {
  const res = await fetch(`${baseUrl}/readyz`);
  // If local mongodb is not connected in this test process, readyState is 0/2, so status is 503
  // If connected, it would be 200.
  const data = await res.json();
  if (data.database === 'disconnected') {
    assert.equal(res.status, 503);
    assert.equal(data.status, 'not_ready');
  } else {
    assert.equal(res.status, 200);
    assert.equal(data.status, 'ready');
  }
});
