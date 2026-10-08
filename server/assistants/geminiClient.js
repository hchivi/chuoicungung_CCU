import { AssistantError } from './difyClient.js';
import { ASSISTANT_INSTRUCTIONS } from './instructions.js';
import { ASSISTANT_PLAN_SCHEMA } from './planSchema.js';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite';

// Server-only REST transport. No automatic retries or paid-model failover.
export function createGeminiClient({ apiKey, model = DEFAULT_GEMINI_MODEL, timeoutMs = 25000, fetchImpl = fetch } = {}) {
  return async ({ query }) => {
    if (!apiKey || /your_|xxxxxxxx/.test(apiKey)) throw new AssistantError('GEMINI_NOT_CONFIGURED', 'Chưa cấu hình GEMINI_API_KEY ở backend.', 503);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(model)) throw new AssistantError('GEMINI_MODEL_INVALID', 'Tên model Gemini ở backend không hợp lệ.', 503);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', redirect: 'error', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: ASSISTANT_INSTRUCTIONS }] },
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048,
            ...(query.startsWith('CCU_BACKEND_PLAN_V1') ? { responseMimeType: 'application/json', responseJsonSchema: ASSISTANT_PLAN_SCHEMA } : {}) }
        })
      });
      if (!response.ok) {
        // Never log provider bodies: they can echo queries, credentials or internals.
        if ([401, 403].includes(response.status)) throw new AssistantError('GEMINI_AUTH_ERROR', 'Gemini từ chối API key/quyền truy cập. Vui lòng kiểm tra key và giới hạn truy cập tại Google AI Studio.', 503);
        if (response.status === 404) throw new AssistantError('GEMINI_MODEL_UNAVAILABLE', 'Model Gemini đã chọn không khả dụng cho key này. Vui lòng kiểm tra GEMINI_MODEL ở backend.', 503);
        if (response.status === 429) throw new AssistantError('GEMINI_QUOTA_EXCEEDED', 'Gemini đã chạm hạn mức hoặc giới hạn tốc độ. Vui lòng đợi rồi thử lại, kiểm tra quota trong Google AI Studio; hệ thống không tự chuyển sang model trả phí.', 429);
        if (response.status >= 500) throw new AssistantError('GEMINI_UNAVAILABLE', 'Gemini đang quá tải hoặc gián đoạn. Vui lòng thử lại sau; chưa có thao tác nào được tự gửi lại.', 503);
        throw new AssistantError('GEMINI_BAD_REQUEST', 'Gemini chưa xử lý được yêu cầu. Vui lòng kiểm tra cấu hình model ở backend.', 502);
      }
      let data;
      try { data = await response.json(); }
      catch { throw new AssistantError('GEMINI_INVALID_RESPONSE', 'Gemini trả dữ liệu không hợp lệ. Chưa xác nhận kết quả.', 502); }
      const candidate = data?.candidates?.[0];
      if (data?.promptFeedback?.blockReason || ['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT'].includes(candidate?.finishReason)) throw new AssistantError('GEMINI_BLOCKED', 'Gemini không thể xử lý nội dung này. Vui lòng diễn đạt lại nhu cầu và không gửi thông tin nhạy cảm.', 422);
      if (candidate?.finishReason === 'MAX_TOKENS') throw new AssistantError('GEMINI_TRUNCATED', 'Phản hồi quá dài và chưa hoàn tất. Vui lòng chia yêu cầu thành các phần ngắn hơn.', 502);
      const answer = candidate?.content?.parts?.filter(part => !part.thought && typeof part.text === 'string').map(part => part.text).join('').trim();
      if (!answer) throw new AssistantError('GEMINI_EMPTY_ANSWER', 'Gemini chưa trả nội dung phản hồi. Vui lòng thử lại với yêu cầu ngắn hơn.', 502);
      return { answer, conversation_id: '', model: data.modelVersion || model, model_verified: Boolean(data.modelVersion) };
    } catch (error) {
      if (controller.signal.aborted) throw new AssistantError('GEMINI_TIMEOUT', 'Gemini phản hồi quá lâu. Chưa xác nhận kết quả; hệ thống không tự gửi lại.', 504);
      if (error instanceof AssistantError) throw error;
      throw new AssistantError('GEMINI_UNAVAILABLE', 'Chưa kết nối được Gemini. Vui lòng kiểm tra mạng của backend và thử lại.', 503);
    } finally { clearTimeout(timer); }
  };
}
