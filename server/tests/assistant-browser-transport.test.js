import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { sendDifyMessage } from '../../src/services/difyService.js';

test('legacy Gemini entry point cannot expose keys, call providers or fabricate fallback companies', async () => {
  const source = await fs.readFile(new URL('../../src/services/geminiSourcingService.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /VITE_GEMINI_API_KEY|generativelanguage\.googleapis|generateSmartFallback|FALLBACK_MODELS/);
  assert.match(source, /sendDifyMessage/);
});

test('workspace marks actual Gemini responses as live AI', async () => {
  const source = await fs.readFile(new URL('../../src/pages/AiWorkspacePage.jsx', import.meta.url), 'utf8');
  assert.match(source, /\['openai', 'dify', 'gemini'\]\.includes\(response.engine\)/);
});

test('browser reports expired session without replaying a potential write', async () => {
  const savedFetch = globalThis.fetch;
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  let removed = false;
  let calls = 0;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => 'expired', removeItem: () => { removed = true; } } });
  globalThis.fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ success: false, error: { code: 'CONVERSATION_NOT_FOUND', message: 'expired' } }), { status: 404 });
  };
  try {
    await assert.rejects(sendDifyMessage({ query: 'Lưu nháp' }), error => error.code === 'CONVERSATION_NOT_FOUND' && /gửi lại/.test(error.message));
    assert.equal(removed, true);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = savedFetch;
    if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor);
    else delete globalThis.localStorage;
  }
});

test('browser timeout stops waiting and never repeats the request', async () => {
  const savedFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (_url, { signal }) => {
    calls++;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
  };
  try {
    await assert.rejects(sendDifyMessage({ query: 'test', timeoutMs: 5 }), error => error.code === 'ASSISTANT_TIMEOUT');
    assert.equal(calls, 1);
  } finally { globalThis.fetch = savedFetch; }
});
