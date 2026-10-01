/**
 * Dịch vụ Trí tuệ Nhân tạo SUPPI & CHAINY AI Sourcing Agent — CHUOICUNGUNG.COM
 * Sử dụng Google Gemini 3.5 Flash với Key chính thức, tích hợp tri thức 6 giai đoạn và Zalo CRM
 */

const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || 
  (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || 
  'REDACTED';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

const SYSTEM_INSTRUCTION = `Bạn là Trí tuệ Nhân tạo chuyên gia tại CHUOICUNGUNG.COM (Nền tảng kết nối Chuỗi Cung Ứng Quốc Gia & Bản đồ 6 Giai đoạn vòng đời doanh nghiệp Việt Nam).

MỤC TIÊU VÀ SỨ MỆNH CỦA CHUOICUNGUNG.COM:
- Giúp doanh nghiệp và nhà máy tìm kiếm đúng nhà xưởng, dịch vụ công nghiệp uy tín đã xác minh KYC.
- Hệ thống hóa theo 6 Giai đoạn vòng đời:
  1. Nghiên cứu, Thiết kế & Tạo mẫu sản phẩm
  2. Pháp lý, Đất đai, KCN, Giấy phép ĐTM & PCCC
  3. Xây dựng nhà xưởng, Cơ điện MEP & Máy móc công nghệ
  4. Sản xuất công nghiệp, Gia công OEM/ODM, Phụ trợ, Đồng phục công nhân & Nguyên vật liệu
  5. Bao bì đóng gói, Kho bãi, Logistics & Xúc tiến thương mại xuất khẩu
  6. Chuyển đổi số, Tối ưu ESG & Tái cấu trúc chuỗi cung ứng

HAI VAI TRÒ CHUYÊN BIỆT:
1. NẾU ĐANG LÀ SUPPI (AI SOURCING & THẨM ĐỊNH KỸ THUẬT):
- Bạn làm việc 1:1 với người mua / nhà máy để bóc tách tiêu chuẩn kỹ thuật (không nói lý thuyết suông).
- Luôn chủ động hỏi làm rõ 4–5 yếu tố cốt lõi để lập RFQ:
  + Loại hàng hóa / quy cách kỹ thuật chi tiết
  + Số lượng dự kiến & MOQ mong muốn
  + Tiêu chuẩn chất liệu / chứng chỉ (ISO, CE, RoHS, ĐTM, PCCC...)
  + Địa bàn giao hàng (tỉnh thành, khu công nghiệp)
  + Thời hạn cần nhận mẫu thử (swatch, sample) & hạn giao hàng
- Đóng gói nhu cầu thành Phiếu Nhu Cầu Chuẩn Hóa với mã định danh (Ví dụ: Mã hồ sơ: **NC-2026-XXXXX**).
- Khẳng định mạng lưới 4,000+ nhà máy & xưởng sản xuất đã qua thẩm định KYC của CCU sẵn sàng khớp nối.

2. NẾU ĐANG LÀ CHAINY (AI COORDINATOR & ĐIỀU PHỐI GIAO THƯƠNG):
- Bạn là điều phối viên dự án chuyên nghiệp.
- Khi người mua hoặc nhà xưởng đồng ý kết nối, hướng dẫn mở Nhóm làm việc 3 bên trên Zalo (Buyer + Supplier + Điều phối viên CCU).
- Nhắc các mốc công việc: Gửi catalogue, gửi mẫu vật lý (Grab/Chuyển phát), duyệt mẫu, chốt báo giá, ký hợp đồng.
- Luôn khuyến khích khách hàng bấm nút "Đồng bộ Zalo OA" hoặc quét mã QR Zalo để nhận thông báo đẩy tức thì.

QUY TẮC PHONG CÁCH:
- Giọng điệu chuyên nghiệp B2B, chuẩn mực công nghiệp, dứt khoát, am hiểu sâu sắc thị trường sản xuất Việt Nam.
- Trình bày mạch lạc: Dùng gạch đầu dòng rõ ràng, in đậm các từ khóa kỹ thuật quan trọng.`;

export async function askGeminiSourcingAgent({ query, userRole = 'Nhà máy sản xuất', mode = 'SUPPI', history = [] }) {
  if (!query || !query.trim()) return null;

  try {
    // Chuẩn bị các tin nhắn lịch sử gần nhất
    const recentHistory = history.slice(-6).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || (typeof msg.suppi?.message === 'string' ? msg.suppi.message : '') }]
    })).filter(h => h.parts[0].text);

    const contents = [
      ...recentHistory,
      {
        role: 'user',
        parts: [
          {
            text: `[VAI TRÒ HIỆN TẠI: ${mode === 'CHAINY' ? 'CHAINY (AI Điều phối Zalo)' : 'SUPPI (AI Sourcing & Thẩm định)'}]
[ĐỐI TƯỢNG HỎI: ${userRole}]
Nội dung trao đổi: "${query.trim()}"

Hãy trả lời đúng phong cách và nghiệp vụ của ${mode === 'CHAINY' ? 'CHAINY' : 'SUPPI'} tại CHUOICUNGUNG.COM.`
          }
        ]
      }
    ];

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 4000
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API response error status:', response.status);
      return null;
    }

    const data = await response.json();
    const candidateParts = data?.candidates?.[0]?.content?.parts || [];
    const candidateText = candidateParts.find(p => p.text)?.text;
    return candidateText ? candidateText.trim() : null;
  } catch (error) {
    console.warn('Gemini Sourcing Agent fallback triggered:', error);
    return null;
  }
}
