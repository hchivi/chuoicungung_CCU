import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const sampleLiveToasts = [
  {
    id: 1,
    icon: '🔔',
    title: 'TING! Nhu cầu Thu mua mới xuất hiện',
    subtitle: 'Nhà máy FDI tại KCN Amata vừa phát lệnh mua 2.000 Giỏ quà Tết công nhân',
    phase: 'Pha 6.1',
    link: '/san-giao-dich-b2b',
    time: 'Vừa xong'
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Gói thầu Vận tải Logistics Pha 1.1',
    subtitle: 'Nhà máy VSIP III vừa mở thầu 42 kiện siêu trường từ cảng Cái Mép',
    phase: 'Pha 1.1',
    link: '/san-giao-dich-b2b',
    time: '2 phút trước'
  },
  {
    id: 3,
    icon: '🔥',
    title: 'Cạnh tranh gói thầu Pha 5.3',
    subtitle: 'Đã có 4/10 nhà cung cấp nộp hồ sơ gói 5.000 áo đồng phục ESD Cleanroom',
    phase: 'Pha 5.3',
    link: '/san-giao-dich-b2b',
    time: '4 phút trước'
  },
  {
    id: 4,
    icon: '🛡️',
    title: 'Khớp lệnh thành công!',
    subtitle: 'Tổng thầu EPC Hạng 1 vừa được Buyer FDI tại Hải Phòng chấp thuận mở kết nối',
    phase: 'Pha 2.1',
    link: '/san-giao-dich-b2b',
    time: '7 phút trước'
  }
];

export default function LiveDemandToast() {
  const [currentToastIndex, setCurrentToastIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentToastIndex((prev) => (prev + 1) % sampleLiveToasts.length);
        setIsVisible(true);
      }, 500);
    }, 9000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentToast = sampleLiveToasts[currentToastIndex];

  if (!currentToast) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`fixed bottom-5 right-5 z-40 max-w-sm w-full transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl p-4 border border-blue-500/40 shadow-2xl shadow-blue-950/60 relative overflow-hidden group">
        
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 animate-pulse" />
        
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/40 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition">
            {currentToast.icon}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                {currentToast.phase}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentToast.time}
              </span>
            </div>

            <h5 className="text-xs font-bold text-slate-100 mt-1 font-heading line-clamp-1">
              {currentToast.title}
            </h5>
            
            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
              {currentToast.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white transition p-1 absolute top-2 right-2 rounded-lg hover:bg-slate-800"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
