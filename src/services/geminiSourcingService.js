/**
 * Dịch vụ Trí tuệ Nhân tạo SUPPI & CHAINY AI Sourcing Agent — CHUOICUNGUNG.COM
 * Sử dụng Google Gemini 3.5 Flash với Key chính thức, tích hợp tri thức 6 giai đoạn và Zalo CRM
 */

const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || 
  (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || 
  'REDACTED';

// Danh sách các model fallback theo thứ tự ưu tiên tốc độ và độ ổn định cao nhất
const FALLBACK_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash'
];

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
1. SUPPI (AI SOURCING & TRỢ LÝ TÌM NGUỒN):
- Bóc tách tiêu chuẩn kỹ thuật, quy cách hàng hóa, sản phẩm, gia công, nhà máy đạt chuẩn KYC.
- Hỏi rõ các yếu tố cốt lõi: Số lượng (MOQ), tiêu chuẩn (ISO, ĐTM, PCCC...), địa bàn (KCN, tỉnh thành), thời gian giao mẫu và giao hàng.
- Định hướng chuẩn hóa thành Phiếu Nhu Cầu Chuẩn Hóa trên CCU.

2. CHAINY (AI TRỢ LÝ KẾT NỐI & ĐIỀU PHỐI GIAO THƯƠNG):
- Hướng dẫn kết nối trực tiếp, tạo nhóm làm việc 3 bên trên Zalo OA với điều phối viên CCU.
- Theo dõi các mốc: Gửi catalogue, gửi mẫu vật lý, báo giá cạnh tranh, hợp đồng và tiến độ giao hàng.

QUY TẮC:
- Trả lời bằng tiếng Việt, ngắn gọn, súc tích, chuyên nghiệp B2B.
- Dùng gạch đầu dòng rõ ràng, in đậm các từ khóa kỹ thuật.`;

function generateSmartFallback(query, mode) {
  const qLower = (query || '').toLowerCase();
  if (mode === 'CHAINY' || qLower.includes('kết nối') || qLower.includes('zalo') || qLower.includes('báo giá')) {
    return `Chào anh/chị, tôi là **CHAINY | Trợ lý kết nối** tại **CHUOICUNGUNG.COM**.\n\nTôi đã ghi nhận yêu cầu: "${query}".\n\n**Các bước hỗ trợ tiếp theo:**\n• Tạo nhóm làm việc 3 bên trên Zalo (Doanh nghiệp mua + Nhà cung ứng đạt chuẩn + Điều phối viên CCU)\n• Hỗ trợ nhận catalogue kỹ thuật & điều phối gửi mẫu vật lý tận nơi\n• Theo dõi tiến độ báo giá cạnh tranh và hỗ trợ thủ tục hợp đồng\n\nAnh/chị có thể bấm nút **"Mở Zalo OA"** để kết nối ngay với điều phối viên!`;
  }

  return `Chào anh/chị, tôi là **SUPPI | Trợ lý tìm nguồn** tại **CHUOICUNGUNG.COM**.\n\nTôi đã tiếp nhận yêu cầu tìm kiếm: "${query}".\n\nTừ mạng lưới **4,000+ nhà máy & xưởng sản xuất đã thẩm định KYC**, để khớp nối chính xác nhất, anh/chị vui lòng chia sẻ thêm một số tiêu chí:\n1. **Số lượng dự kiến / đợt đặt hàng** (MOQ mong muốn)\n2. **Quy cách kỹ thuật / tiêu chuẩn chất liệu** (tiêu chuẩn ISO, bản vẽ, mẫu swatch nếu có)\n3. **Địa bàn giao hàng** (tỉnh thành hoặc Khu công nghiệp ưu tiên)\n4. **Thời hạn cần nhận mẫu thử & thời hạn giao hàng**\n\nNgay khi có thêm thông tin, tôi sẽ xuất **Phiếu Nhu Cầu Chuẩn Hóa** và gửi danh sách 2–3 xưởng sản xuất tối ưu nhất cho anh/chị!`;
}

export async function askGeminiSourcingAgent({ query, userRole = 'Nhà máy sản xuất', mode = 'SUPPI', history = [] }) {
  if (!query || !query.trim()) return null;

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
          text: `[VAI TRÒ HIỆN TẠI: ${mode === 'CHAINY' ? 'CHAINY (AI Trợ lý kết nối)' : 'SUPPI (AI Trợ lý tìm nguồn)'}]
[ĐỐI TƯỢNG HỎI: ${userRole}]
Nội dung trao đổi: "${query.trim()}"

Hãy trả lời đúng phong cách và nghiệp vụ của ${mode === 'CHAINY' ? 'CHAINY' : 'SUPPI'} tại CHUOICUNGUNG.COM.`
        }
      ]
    }
  ];

  // Thử lần lượt các model trong danh sách fallback
  for (const model of FALLBACK_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(endpoint, {
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
            temperature: 0.5,
            maxOutputTokens: 2000,
            thinkingConfig: { thinkingBudget: 0 }
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[GeminiSourcing] Model ${model} returned HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const candidateParts = data?.candidates?.[0]?.content?.parts || [];
      const textParts = candidateParts.filter(p => !p.thought && p.text).map(p => p.text);
      const candidateText = textParts.join('\n').trim() || candidateParts.find(p => p.text)?.text?.trim();

      if (candidateText) {
        return candidateText;
      }
    } catch (err) {
      console.warn(`[GeminiSourcing] Model ${model} failed:`, err?.message || err);
    }
  }

  // Nếu tất cả các model đều gặp sự cố mạng hoặc quota, dùng smart local fallback
  console.info('[GeminiSourcing] Sử dụng Smart Local Fallback chuyên ngành CCU');
  return generateSmartFallback(query, mode);
}

