// Both existing chat surfaces use the same backend. No provider credentials in Vite.
const CHAT_ENDPOINT = '/api/assistants/chat';
const CONVERSATION_KEY = 'ccu_backend_assistant_conversation';

export function resetAssistantConversation() {
  try { localStorage.removeItem(CONVERSATION_KEY); } catch { /* storage can be disabled */ }
}

export async function sendDifyMessage({ query, conversationId = '', mode, onChunk = null, timeoutMs = 65000 }) {
  if (typeof query !== 'string' || !query.trim()) return null;
  let savedId = '';
  try { savedId = localStorage.getItem(CONVERSATION_KEY) || ''; } catch { /* storage can be disabled */ }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
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
      const error = new Error(data?.error?.code === 'CONVERSATION_NOT_FOUND'
        ? 'Phiên trao đổi cũ đã hết hiệu lực. Anh/chị vui lòng gửi lại tin nhắn để bắt đầu phiên mới; hệ thống không tự gửi lại thao tác trước.'
        : data?.error?.message || 'Chưa kết nối được trợ lý CCU. Vui lòng thử lại.');
      error.code = data?.error?.code || 'ASSISTANT_UNAVAILABLE';
      throw error;
    }
    const result = data.data;
    if (typeof result?.answer !== 'string' || !result.answer.trim()) throw new Error('Trợ lý chưa trả nội dung phản hồi. Vui lòng thử lại.');
    try { localStorage.setItem(CONVERSATION_KEY, result.conversation_id); } catch { /* storage can be disabled */ }
    onChunk?.(result.answer, result.answer); // Blocking transport, not pretend SSE.
    return result;
  } catch (error) {
    if (controller.signal.aborted) {
      const timeout = new Error('Trợ lý phản hồi quá lâu. Chưa xác nhận kết quả; hệ thống không tự gửi lại. Vui lòng kiểm tra trước khi thử lại thao tác lưu nháp.');
      timeout.code = 'ASSISTANT_TIMEOUT';
      throw timeout;
    }
    throw error;
  } finally { clearTimeout(timer); }
}
