/**
 * Dịch vụ Trí tuệ Nhân tạo SUPPI AI Sourcing Agent
 * Sử dụng Google Gemini 3.5 Flash Lite với API Key chuẩn
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'REDACTED';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

const SYSTEM_INSTRUCTION = `Bạn là SUPPI - AI Sourcing Agent chuyên gia Chuỗi Cung Ứng B2B tại CHUOICUNGUNG.COM (Bản đồ Chuỗi cung ứng theo vòng đời doanh nghiệp Việt Nam).

QUY TẮC BẮT BUỘC VỀ TRÌNH BÀY & NỘI DUNG (TUÂN THỦ 100%):
1. TUYỆT ĐỐI KHÔNG chào hỏi rườm rà (KHÔNG viết "Chào bạn, tôi là SUPPI...", KHÔNG viết "Dưới đây là tư vấn..."). Hãy đi thẳng vào phân tích ngay từ câu đầu tiên.
2. SIÊU NGẮN GỌN & SÚC TÍCH: Độ dài toàn bộ câu trả lời chỉ từ 80 - 140 từ. Tuyệt đối không viết thành các đoạn văn dài lê thê đặc chữ.
3. CẤU TRÚC 3 PHẦN GỌN GÀNG:
   ### 1. Định vị & Tiêu chuẩn
   - Nêu rõ thuộc Giai đoạn nào trong 6 giai đoạn vòng đời và bài toán cốt lõi.
   ### 2. Giải pháp trọng tâm
   - Liệt kê 2 đến 3 gạch đầu dòng (*) cụ thể (tiêu chí kỹ thuật, công suất, địa bàn, thời hạn hoặc tiêu chuẩn).
   ### 3. Đề xuất triển khai
   - 1 câu ngắn gọn đề xuất hành động cụ thể cho CHAINY (ví dụ: tạo bản nháp RFQ, gửi yêu cầu báo giá tới nhà xưởng đạt KYC).
4. Luôn dùng xuống dòng rõ ràng và in đậm (**) các từ khóa trọng tâm để hiển thị đẹp trên giao diện.`;

export async function askGeminiSourcingAgent({ query, userRole = 'Nhà máy sản xuất', history = [] }) {
  if (!query || !query.trim()) return null;

  try {
    // Chuẩn bị các tin nhắn lịch sử (tối đa 4 lượt gần nhất để tối ưu tốc độ)
    const recentHistory = history.slice(-4).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || (typeof msg.suppi?.message === 'string' ? msg.suppi.message : '') }]
    })).filter(h => h.parts[0].text);

    const contents = [
      ...recentHistory,
      {
        role: 'user',
        parts: [
          {
            text: `[Vai trò người dùng: ${userRole}]\nNhu cầu / Câu hỏi: ${query.trim()}\nHãy trả lời với tư cách SUPPI AI Sourcing Agent, tư vấn phân tích ngắn gọn, giải pháp cụ thể và định hướng bước triển khai thực tế.`
          }
        ]
      }
    ];

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API response error status:', response.status);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText ? candidateText.trim() : null;
  } catch (error) {
    console.warn('Gemini Sourcing Agent fallback triggered:', error);
    return null;
  }
}
