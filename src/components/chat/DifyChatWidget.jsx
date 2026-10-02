import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Send, Bot, MessageSquare, ArrowRight, ShieldCheck, 
  ExternalLink, QrCode, RefreshCw, ChevronRight, User, CheckCircle2,
  FileText, Building2, Sparkles, Layers, PhoneCall, Maximize2
} from 'lucide-react';
import { sendDifyMessage } from '../../services/difyService';

export default function DifyChatWidget({ isOpen, onClose, initialMode = 'SUPPI' }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'SUPPI' or 'CHAINY'
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [showZaloModal, setShowZaloModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Khởi tạo và nạp lịch sử chat (từ localStorage nếu có)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ccu_active_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {}

    // Lời chào ban đầu từ SUPPI
    setMessages([
      {
        sender: 'ai',
        mode: 'SUPPI',
        text: 'Chào anh/chị, tôi là **SUPPI | Trợ lý tìm nguồn** tại **CHUOICUNGUNG.COM**.\n\nTôi có thể hỗ trợ anh/chị bóc tách tiêu chuẩn kỹ thuật, xác định mã ngành vòng đời và tìm kiếm nhà cung ứng xưởng thực tế đạt chuẩn KYC.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Tìm 500 bộ đồng phục công nhân giao tháng 11',
          'Tìm nhà xưởng gia công CNC chính xác tại miền Bắc',
          'Tư vấn thủ tục ĐTM & PCCC cho nhà máy FDI'
        ]
      }
    ]);
  }, []);

  // Tự động lưu đoạn chat vào localStorage để khi mở rộng không bao giờ bị mất
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('ccu_active_chat_messages', JSON.stringify(messages));
      } catch (e) {}
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Xử lý mở rộng sang trang Trợ lý AI toàn màn hình mà vẫn giữ nguyên đoạn chat
  const handleExpandToWorkspace = () => {
    try {
      localStorage.setItem('ccu_active_chat_messages', JSON.stringify(messages));
      localStorage.setItem('ccu_active_chat_mode', mode);
    } catch (e) {}
    onClose?.();
    navigate('/tro-ly-ai', {
      state: {
        transferredMessages: messages,
        initialMode: mode,
        fromWidget: true
      }
    });
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    // Tự động nhận diện vai trò phù hợp: CHAINY cho kết nối/Zalo/báo giá, SUPPI cho tìm nguồn/kỹ thuật
    const qLower = query.toLowerCase();
    const isChainyQuery = qLower.includes('kết nối') || 
                          qLower.includes('zalo') || 
                          qLower.includes('báo giá') || 
                          qLower.includes('tiến độ') || 
                          qLower.includes('hợp đồng') || 
                          qLower.includes('gặp') || 
                          qLower.includes('chainy');

    const activeMode = isChainyQuery ? 'CHAINY' : 'SUPPI';
    setMode(activeMode);

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await sendDifyMessage({
        query,
        conversationId,
        mode: activeMode,
        user: 'web_session_' + (localStorage.getItem('ccu_user_token') || 'guest')
      });

      if (response?.conversation_id) {
        setConversationId(response.conversation_id);
      }

      const answerText = response?.answer || (
        activeMode === 'CHAINY' 
          ? 'Chào anh/chị, tôi là CHAINY | Trợ lý kết nối. Tôi đã ghi nhận yêu cầu và sẵn sàng kết nối qua nhóm Zalo OA.' 
          : 'Chào anh/chị, tôi là SUPPI | Trợ lý tìm nguồn. Tôi đã tiếp nhận yêu cầu bóc tách và tìm xưởng sản xuất cho anh/chị.'
      );

      const aiMsg = {
        sender: 'ai',
        mode: activeMode,
        text: answerText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isZaloPrompt: isChainyQuery || qLower.includes('kết nối') || qLower.includes('zalo')
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          mode: activeMode,
          text: 'Xin lỗi, kết nối đang được làm mới. Anh/chị vui lòng thử lại hoặc bấm "Mở Zalo OA" bên dưới để được nhân sự hỗ trợ trực tiếp.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[1000] w-[92vw] sm:w-[420px] max-w-full h-[600px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans">
      
      {/* 1. HEADER (SUPPI & CHAINY MASCOT + HANDOFF + EXPAND) */}
      <div className="p-3.5 sm:p-4 text-white transition-all flex items-center justify-between bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0284c7]">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            <img 
              src="/mascots/SUPPI_2.png" 
              alt="Mascot" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm uppercase tracking-wide font-heading">
                SUPPI &amp; CHAINY • AI TRỢ LÝ
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-blue-100/90 font-medium">
              Tìm nguồn cung ứng &amp; Điều phối kết nối giao thương
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Nút Handoff Sang Zalo OA */}
          <button
            onClick={() => setShowZaloModal(true)}
            title="Đồng bộ sang Zalo OA"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[10px]">Zalo</span>
          </button>

          {/* Nút Mở rộng vào trang Trợ lý AI toàn màn hình — Vẫn giữ nguyên đoạn chat */}
          <button
            onClick={handleExpandToWorkspace}
            title="Mở rộng vào Trang Trợ lý AI đầy đủ"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MESSAGE STREAM LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 no-scrollbar text-xs">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const isChainy = msg.mode === 'CHAINY';

          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* KHÁCH (USER) — CHỮ MÀU ĐEN */}
              {isUser ? (
                <div className="max-w-[85%] p-3.5 rounded-2xl rounded-br-xs bg-slate-100 text-black border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="whitespace-pre-line text-[12.5px] font-medium text-black">
                    {msg.text}
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    {msg.time}
                  </div>
                </div>
              ) : (
                /* SUPPI HOẶC CHAINY */
                <div className={`max-w-[88%] p-3.5 rounded-2xl rounded-bl-xs shadow-xs space-y-2 leading-relaxed ${
                  isChainy 
                    ? 'bg-rose-50/50 border border-rose-200/90 text-[#e11d48]' 
                    : 'bg-blue-50/50 border border-blue-200/90 text-[#0052cc]'
                }`}>
                  {/* Header Trợ lý: Icon SUPPI_2.png hoặc CHAINY_2.png + Badge Tên */}
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                    <img 
                      src={isChainy ? "/mascots/CHAINY_2.png" : "/mascots/SUPPI_2.png"}
                      alt={isChainy ? "CHAINY" : "SUPPI"}
                      className={`w-6 h-6 rounded-full object-cover border shrink-0 ${
                        isChainy ? 'border-rose-300' : 'border-blue-300'
                      }`}
                    />
                    <span className={`font-black text-xs uppercase tracking-wide font-heading ${
                      isChainy ? 'text-[#e11d48]' : 'text-[#0052cc]'
                    }`}>
                      {isChainy ? 'CHAINY | Trợ lý kết nối' : 'SUPPI | Trợ lý tìm nguồn'}
                    </span>
                  </div>

                  {/* Nội dung tin nhắn: chữ màu xanh cho SUPPI, chữ màu hồng cho CHAINY */}
                  <div className={`whitespace-pre-line text-[12.5px] font-medium leading-relaxed ${
                    isChainy ? 'text-[#e11d48]' : 'text-[#0052cc]'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Suggestions Chips */}
                  {msg.suggestions && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                      <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        Gợi ý thao tác nhanh:
                      </div>
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="w-full text-left p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#0052cc] text-xs font-semibold transition flex items-center justify-between group cursor-pointer shadow-2xs"
                        >
                          <span className="line-clamp-1">{sug}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Zalo OA Handoff Action inside message */}
                  {msg.isZaloPrompt && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-600 font-medium">Nhận báo giá &amp; vào nhóm làm việc:</span>
                      <button
                        onClick={() => setShowZaloModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-[#0068ff] hover:bg-[#0052cc] text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                      >
                        <span>Mở Zalo OA</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 pt-0.5 text-right">
                    {msg.time}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* LOADING INDICATOR: ĐỔI THÀNH "đang chat..." */}
        {isLoading && (
          <div className="flex items-center space-x-2 p-3 bg-white rounded-2xl border border-slate-200/90 w-max shadow-2xs">
            <div className="w-2 h-2 rounded-full bg-[#0052cc] animate-ping" />
            <span className="text-xs text-slate-600 font-medium">
              đang chat...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. FOOTER INPUT BOX */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Nhập nhu cầu tìm nguồn, nhà xưởng, sản phẩm hoặc điều phối Zalo..."
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-[#0052cc] focus:bg-white transition"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className={`p-2.5 rounded-xl text-white font-bold transition flex items-center justify-center shrink-0 cursor-pointer ${
            inputQuery.trim() && !isLoading
              ? 'bg-[#0052cc] hover:bg-[#0047a5]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* 4. ZALO OA CONNECT MODAL OVERLAY */}
      {showZaloModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 p-6 flex flex-col justify-center items-center text-center text-white space-y-4 animate-in fade-in duration-150">
          <div className="w-12 h-12 rounded-2xl bg-[#0068ff] p-2.5 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <QrCode className="w-full h-full text-white" />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-black font-heading text-white">
              Đồng Bộ Sang Zalo Official Account
            </h4>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              Nhà máy và NCC trao đổi thuận tiện trên Zalo hằng ngày. CHAINY sẽ tự động tạo nhóm 3 bên và cập nhật tiến độ vào CRM.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            <img 
              src="/logo_only.png" 
              alt="Zalo OA QR" 
              className="w-32 h-32 object-contain p-2 bg-slate-50 rounded-xl border border-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 w-full max-w-xs">
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-[#0068ff] hover:bg-[#0052cc] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Mở Ứng Dụng Zalo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setShowZaloModal(false)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
