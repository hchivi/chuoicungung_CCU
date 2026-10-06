export class AssistantError extends Error {
  constructor(code, message, status = 502) {
    super(message);
    this.code = code;
    this.status = status;
    this.isPublic = true;
  }
}

// Credentials and raw provider responses never cross the browser boundary.
export function createDifyClient({ apiKey, baseUrl = 'https://api.dify.ai/v1', timeoutMs = 60000, fetchImpl = fetch } = {}) {
  return async ({ query, user, conversationId = '', inputs = {} }) => {
    if (!apiKey || /your_|xxxxxxxx/.test(apiKey)) throw new AssistantError('DIFY_NOT_CONFIGURED', 'Chưa cấu hình kết nối Dify ở backend.', 503);
    const url = new URL(`${baseUrl.replace(/\/$/, '')}/chat-messages`);
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new AssistantError('DIFY_UNSAFE_URL', 'Kết nối Dify cần HTTPS.', 503);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ inputs, query, response_mode: 'blocking', conversation_id: conversationId || '', user }),
        signal: controller.signal, redirect: 'error'
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Dify API Error]:', response.status, errorText);
        let errorMsg = 'Dify chưa xử lý được yêu cầu. Vui lòng kiểm tra kết nối hoặc hạn mức.';
        try {
          const errJson = JSON.parse(errorText);
          if (errJson?.message) {
            if (errJson.message.includes('503') || errJson.message.includes('high demand')) {
              errorMsg = 'Model Gemini trên Dify đang bị quá tải (Google 503 High Demand). Vui lòng thử lại sau giây lát hoặc đổi model trên Dify.';
            } else if (errJson.message.includes('quota') || errJson.message.includes('rate limit')) {
              errorMsg = 'Model trên Dify đã hết hạn mức (Quota/Rate Limit). Vui lòng kiểm tra API key.';
            }
          }
        } catch (_) {}
        throw new AssistantError('DIFY_UPSTREAM_ERROR', errorMsg);
      }
      const raw = await response.text();
      let data;
      try { data = JSON.parse(raw); }
      catch { throw new AssistantError('DIFY_INVALID_RESPONSE', 'Dify trả dữ liệu không hợp lệ. Vui lòng thử lại.'); }
      if (typeof data?.answer !== 'string' || !data.answer.trim()) throw new AssistantError('DIFY_EMPTY_ANSWER', 'Dify chưa trả nội dung phản hồi. Vui lòng thử lại hoặc liên hệ nhân sự CCU.');
      if (typeof data.conversation_id !== 'string' || !data.conversation_id) throw new AssistantError('DIFY_INVALID_RESPONSE', 'Dify chưa cung cấp phiên trao đổi hợp lệ.');
      return { answer: data.answer.trim(), conversation_id: data.conversation_id, message_id: data.message_id || data.id || null };
    } catch (error) {
      if (controller.signal.aborted) throw new AssistantError('DIFY_TIMEOUT', 'Dify phản hồi quá lâu. Chưa xác nhận kết quả; hệ thống không tự gửi lại.', 504);
      if (error instanceof AssistantError) throw error;
      throw new AssistantError('DIFY_UNAVAILABLE', 'Chưa kết nối được Dify. Vui lòng thử lại.', 503);
    } finally { clearTimeout(timer); }
  };
}
