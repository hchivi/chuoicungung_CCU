// Both existing chat surfaces use the same backend. No provider credentials in Vite.
const CHAT_ENDPOINT = '/api/assistants/chat';
const CONVERSATION_KEY = 'ccu_backend_assistant_conversation';

export function resetAssistantConversation() {
  try { localStorage.removeItem(CONVERSATION_KEY); } catch { /* storage can be disabled */ }
}

export async function sendDifyMessage({ query, conversationId = '', mode, onChunk = null }) {
  if (typeof query !== 'string' || !query.trim()) return null;
  let savedId = '';
  try { savedId = localStorage.getItem(CONVERSATION_KEY) || ''; } catch { /* storage can be disabled */ }
  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: query.trim(), conversation_id: conversationId || savedId, ...(mode ? { mode } : {}) })
  });
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); }
  catch { throw new Error('Backend chưa trả dữ liệu hợp lệ. Vui lòng kiểm tra kết nối API CCU.'); }
  if (!response.ok || !data?.success) {
    if (data?.error?.code === 'CONVERSATION_NOT_FOUND') {
      try { localStorage.removeItem(CONVERSATION_KEY); } catch { /* storage can be disabled */ }
    }
    throw new Error(data?.error?.message || 'Chưa kết nối được trợ lý CCU. Vui lòng thử lại.');
  }
  const result = data.data;
  if (typeof result?.answer !== 'string' || !result.answer.trim()) throw new Error('Trợ lý chưa trả nội dung phản hồi. Vui lòng thử lại.');
  try { localStorage.setItem(CONVERSATION_KEY, result.conversation_id); } catch { /* storage can be disabled */ }
  onChunk?.(result.answer, result.answer); // Blocking transport, not pretend SSE.
  return result;
}
