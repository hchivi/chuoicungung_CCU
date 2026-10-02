/**
 * DIFY AI SERVICE ADAPTER — CHUOICUNGUNG.COM
 * Kết nối Bộ não AI Dify (Self-hosted hoặc Dify Cloud) với SUPPI & CHAINY
 * Hỗ trợ Streaming, Conversation Memory, trích xuất thực thể B2B Sourcing
 */

import { askGeminiSourcingAgent } from './geminiSourcingService';

const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1';
const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY || '';

/**
 * Gửi tin nhắn đến Dify Chat App
 * @param {Object} params
 * @param {string} params.query - Câu hỏi hoặc yêu cầu của người dùng
 * @param {string} params.conversationId - ID phiên chat Dify (giữ ngữ cảnh)
 * @param {string} params.user - ID định danh người dùng / session ID
 * @param {string} params.mode - 'SUPPI' (Sourcing) hoặc 'CHAINY' (Điều phối)
 * @param {Object} params.inputs - Biến đầu vào bổ sung cho Dify Workflow
 * @param {Function} params.onChunk - Callback khi có stream text trả về
 */
export async function sendDifyMessage({
  query,
  conversationId = '',
  user = 'guest_web_user',
  mode = 'SUPPI',
  inputs = {},
  onChunk = null
}) {
  if (!query || !query.trim()) return null;

  // Nếu ưu tiên dùng Direct Gemini hoặc chưa cấu hình Dify Key
  if (!DIFY_API_KEY) {
    console.info('[DifyService] Tự động chuyển tiếp qua Direct Gemini Engine.');
    const geminiRes = await askGeminiSourcingAgent({
      query,
      userRole: mode === 'CHAINY' ? 'Điều phối viên giao thương' : 'Nhà máy / Người mua tìm nguồn',
      mode
    });
    return {
      answer: typeof geminiRes === 'string' ? geminiRes : (geminiRes?.markdown || geminiRes?.text || ''),
      conversation_id: conversationId || `conv-local-${Date.now()}`,
      metadata: { engine: 'direct-gemini', mode }
    };
  }

  try {
    const response = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`
      },
      body: JSON.stringify({
        inputs: {
          agent_mode: mode,
          platform: 'CCU_WEB_PORTAL',
          ...inputs
        },
        query: query.trim(),
        response_mode: onChunk ? 'streaming' : 'blocking',
        conversation_id: conversationId || undefined,
        user: user || 'web_guest'
      })
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status} ${response.statusText}`);
    }

    // Nếu không stream, trả về JSON trực tiếp
    if (!onChunk) {
      const data = await response.json();
      return {
        answer: data.answer,
        conversation_id: data.conversation_id,
        message_id: data.id,
        metadata: { engine: 'dify', ...data.metadata }
      };
    }

    // Xử lý Server-Sent Events (SSE) Streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullAnswer = '';
    let finalConvId = conversationId;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.event === 'message' || data.event === 'agent_message') {
              fullAnswer += data.answer || '';
              if (onChunk) onChunk(data.answer, fullAnswer);
            }
            if (data.conversation_id) {
              finalConvId = data.conversation_id;
            }
          } catch {
            // bỏ qua chunk không phải JSON hợp lệ
          }
        }
      }
    }

    return {
      answer: fullAnswer,
      conversation_id: finalConvId,
      metadata: { engine: 'dify-stream', mode }
    };
  } catch (error) {
    console.error('[DifyService] Lỗi khi gọi Dify API:', error);
    // Fallback an toàn sang Gemini
    const geminiFallback = await askGeminiSourcingAgent({
      query,
      userRole: mode === 'CHAINY' ? 'Doanh nghiệp B2B' : 'Nhà máy sản xuất',
      mode
    });
    return {
      answer: typeof geminiFallback === 'string' ? geminiFallback : (geminiFallback?.markdown || 'Tôi đã tiếp nhận yêu cầu và đang kết nối dữ liệu. Anh/chị có thể bấm Mở Zalo OA để trao đổi trực tiếp.'),
      conversation_id: conversationId,
      metadata: { engine: 'gemini-fallback-on-error', error: error.message }
    };
  }
}
