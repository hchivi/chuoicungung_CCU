import React, { useState } from 'react';
import { 
  X, Bot, Sparkles, Send, CheckCircle2, AlertCircle, 
  HelpCircle, ShieldCheck, ArrowRight, Building2, Layers
} from 'lucide-react';

export default function SuppiDemandAssistantModal({
  isOpen,
  onClose,
  requirement,
  currentUser,
  onSelectRequirement
}) {
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      text: requirement 
        ? `Xin chào! Tôi là Trợ lý SUPPI. Bạn đang xem nhu cầu [${requirement.publicCode} - ${requirement.title}]. Bạn có muốn kiểm tra xem hồ sơ của mình đã đủ điều kiện phản hồi chưa?`
        : 'Xin chào! Tôi là SUPPI - Trợ lý ghép nối Sàn Nhu Cầu. Tôi có thể giúp bạn tìm các nhu cầu B2B phù hợp với năng lực sản xuất của doanh nghiệp bạn.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = requirement ? [
    'Hồ sơ của tôi có đáp ứng yêu cầu này không?',
    'Nhu cầu này có yêu cầu gửi mẫu trước không?',
    'Khu vực giao hàng và thời hạn tiếp nhận là khi nào?',
    'Tôi cần chuẩn bị giấy tờ gì để được duyệt Shortlist?'
  ] : [
    'Những nhu cầu nào phù hợp với ngành may mặc?',
    'Tìm các nhu cầu gia công cơ khí chính xác tại Bình Dương',
    'Doanh nghiệp mới tham gia cần hoàn thiện những gì?',
    'Quy trình từ khi phản hồi đến khi kết nối với Buyer ra sao?'
  ];

  const handleSend = (textToSend) => {
    const q = (textToSend || inputVal).trim();
    if (!q) return;

    const newMsgs = [...messages, { role: 'user', text: q }];
    setMessages(newMsgs);
    setInputVal('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (requirement) {
        if (lower.includes('đáp ứng') || lower.includes('phù hợp')) {
          reply = `Dựa trên bản tóm tắt công khai của nhu cầu ${requirement.publicCode}:
• Chuyên mục: ${requirement.category}
• Sản phẩm cần: ${requirement.productService}
• Địa bàn: ${requirement.province} ${requirement.industrialPark ? `(${requirement.industrialPark})` : ''}
• Yêu cầu mẫu: ${requirement.sampleRequired ? 'BẮT BUỘC gửi mẫu thử đối chứng' : 'Không bắt buộc mẫu'}
• Khảo sát: ${requirement.surveyRequired ? 'Có khảo sát hiện trường' : 'Không bắt buộc khảo sát'}

💡 Lời khuyên SUPPI: Doanh nghiệp của bạn cần nhấn mạnh năng lực cung ứng ${requirement.quantity || ''} ${requirement.unit || ''} và cam kết thời gian giao hàng ${requirement.deadline || 'đúng tiến độ'}.`;
        } else if (lower.includes('mẫu') || lower.includes('sample')) {
          reply = requirement.sampleRequired 
            ? `Nhu cầu này BẮT BUỘC gửi mẫu thử đối chứng để bộ phận kỹ thuật của Buyer kiểm tra chất lượng trước khi mở đàm phán hợp đồng.`
            : `Nhu cầu này hiện tại không yêu cầu gửi mẫu trước, nhưng bạn có thể đính kèm hình ảnh sản phẩm tương tự trong hồ sơ phản hồi.`;
        } else if (lower.includes('shortlist') || lower.includes('giấy tờ') || lower.includes('hồ sơ')) {
          reply = `Để được Ban Điều Phối đưa vào danh sách Shortlist kết nối với Buyer:
1. Xác nhận đầy đủ khả năng đáp ứng quy cách kỹ thuật công bố.
2. Có xưởng sản xuất hoặc kho vận phục vụ được tại ${requirement.province}.
3. Tích chọn sẵn sàng gửi mẫu thử đối chứng khi có yêu cầu.`;
        } else {
          reply = `Theo tóm tắt công khai của nhu cầu ${requirement.publicCode}: Thời hạn tiếp nhận là ${requirement.deadline || 'sớm nhất'}. Các thông tin nội bộ của Buyer như số điện thoại cá nhân và ngân sách chi tiết được bảo mật để đảm bảo tính công bằng và chống quấy rối.`;
        }
      } else {
        if (lower.includes('may mặc') || lower.includes('đồng phục')) {
          reply = 'Hiện trên Sàn đang có nhu cầu [NC-2026-00125: Cần 500 bộ đồng phục công nhân tại Đồng Nai] và [NC-2026-00140: 300 suất quà tết tại KCX Tân Thuận]. Bạn có thể lọc theo chuyên mục "May mặc & Bảo hộ lao động" để xem chi tiết.';
        } else if (lower.includes('cơ khí') || lower.includes('cnc')) {
          reply = 'Có nhu cầu [NC-2026-00128: Gia công 10.000 chi tiết nhôm CNC anode tại KCN VSIP 1, Bình Dương] đang tìm nguồn khẩn trước ngày 30/10.';
        } else {
          reply = 'Hệ thống Sàn Nhu Cầu B2B hoạt động theo nguyên tắc: Buyer đăng nhu cầu -> Ban Điều Phối rà soát & công bố bản tóm tắt -> Nhà cung ứng bấm "Tôi có khả năng đáp ứng" -> Ban Điều phối thẩm định năng lực -> Ghép đôi kết nối bảo mật.';
        }
      }

      setMessages([...newMsgs, { role: 'assistant', text: reply }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative flex flex-col h-[600px] max-h-[90vh] text-slate-900 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 font-heading">SUPPI AI Assistant</span>
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">Sàn Nhu Cầu</span>
              </div>
              <p className="text-[11px] text-slate-400">Tư vấn khả năng đáp ứng & hướng dẫn phản hồi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                  S
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#0052cc] text-white font-medium rounded-tr-xs'
                    : 'bg-slate-100/90 text-slate-800 border border-slate-200/60 rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>SUPPI đang phân tích yêu cầu...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 shrink-0">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Gợi ý câu hỏi nhanh:
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200/80 text-[11px] whitespace-nowrap transition shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="pt-2 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Nhập thắc mắc về nhu cầu này..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0052cc] focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white disabled:opacity-40 transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
