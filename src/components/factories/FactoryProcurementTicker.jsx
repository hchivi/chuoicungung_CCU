import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck, ArrowRight, Building2, MapPin, Sparkles, Send, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const REALTIME_PROCUREMENT_FEED = [
  {
    id: 'rfq-1',
    factoryName: 'Tập Đoàn Điện Tử FDI Foxconn / Luxshare',
    location: 'KCN VSIP Bắc Ninh (Bắc Ninh)',
    phaseId: '5.3',
    phaseName: 'Đồng phục & BHLĐ',
    demandTitle: 'Tìm đối tác cung ứng 3.500 bộ Đồng phục & BHLĐ chống tĩnh điện ESD',
    budget: '1.2 - 1.8 Tỷ VNĐ',
    timeAgo: 'Vừa xong',
    urgent: true,
    bidsCount: 4
  },
  {
    id: 'rfq-2',
    factoryName: 'Chủ Đầu Tư KCN Long Hậu & Đức Hòa',
    location: 'KCN Long Hậu (Long An)',
    phaseId: '4.3',
    phaseName: 'Logistics & Kho bãi',
    demandTitle: 'Mời thầu dịch vụ Logistics Kho ngoại quan & Thuê 12 Xe nâng điện 3.5 tấn',
    budget: '2.5 Tỷ VNĐ / năm',
    timeAgo: '3 phút trước',
    urgent: true,
    bidsCount: 7
  },
  {
    id: 'rfq-3',
    factoryName: 'Nhà Máy Cơ Khí Chính Xác Makino Precision',
    location: 'KCN Amata (Đồng Nai)',
    phaseId: '4.2',
    phaseName: 'Gia công CNC & Khuôn mẫu',
    demandTitle: 'Cần gia công 50 bộ Khuôn dập kim loại chính xác & Phay tiện chi tiết trục',
    budget: '850 Triệu VNĐ',
    timeAgo: '8 phút trước',
    urgent: false,
    bidsCount: 3
  },
  {
    id: 'rfq-4',
    factoryName: 'Công Ty TNHH Bao Bì Dược Phẩm BioTech',
    location: 'KCN Tân Bình (TP. Hồ Chí Minh)',
    phaseId: '3.2',
    phaseName: 'Hoàn thiện Phòng sạch',
    demandTitle: 'Cần nhà thầu thi công Nâng cấp Phòng sạch GMP Class 100 & Sơn sàn Epoxy 2.000m²',
    budget: '3.4 Tỷ VNĐ',
    timeAgo: '15 phút trước',
    urgent: true,
    bidsCount: 5
  },
  {
    id: 'rfq-5',
    factoryName: 'Tập Đoàn May Mặc Xuất Khẩu Regent Apparel',
    location: 'KCN VSIP 1 (Bình Dương)',
    phaseId: '4.1',
    phaseName: 'Cung ứng Bao bì & Carton',
    demandTitle: 'Ký hợp đồng năm: Cung cấp 150.000 Thùng Carton 5 lớp in Flexo & Màng PE',
    budget: '920 Triệu VNĐ / đợt',
    timeAgo: '22 phút trước',
    urgent: false,
    bidsCount: 8
  },
  {
    id: 'rfq-6',
    factoryName: 'Nhà Máy Lắp Ráp Xe Điện & Phụ Tùng VinAutomotive',
    location: 'KCN Đình Vũ - Deep C (Hải Phòng)',
    phaseId: '2.3',
    phaseName: 'Cơ điện & Trạm biến áp',
    demandTitle: 'Đấu thầu bảo trì Trạm biến áp 22kV & Hệ thống PCCC tự động cho phân xưởng 3',
    budget: '1.6 Tỷ VNĐ',
    timeAgo: '30 phút trước',
    urgent: true,
    bidsCount: 6
  }
];

export default function FactoryProcurementTicker({ onSelectDemand }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeAnim, setFadeAnim] = useState(true);

  // Automatic smooth slide effect every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setFadeAnim(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % REALTIME_PROCUREMENT_FEED.length);
        setFadeAnim(true);
      }, 250);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeItem = REALTIME_PROCUREMENT_FEED[currentIndex];

  const handleNext = (e) => {
    e.stopPropagation();
    setFadeAnim(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % REALTIME_PROCUREMENT_FEED.length);
      setFadeAnim(true);
    }, 150);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setFadeAnim(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + REALTIME_PROCUREMENT_FEED.length) % REALTIME_PROCUREMENT_FEED.length);
      setFadeAnim(true);
    }, 150);
  };

  return (
    <div
      className="bg-gradient-to-r from-white via-blue-50/40 to-white border border-blue-200/90 rounded-3xl p-4 sm:p-5 shadow-lg shadow-blue-900/5 relative overflow-hidden transition-all duration-300 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-blue-100/80">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black font-heading tracking-wide text-[#0047a5] uppercase">
            BẢNG TIN THU MUA
          </span>
        </div>

        {/* Navigation arrows & Auto status */}
        <div className="flex items-center space-x-2">

          <div className="flex items-center space-x-1 pl-2">
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#0052cc] hover:border-blue-300 transition shadow-2xs cursor-pointer"
              title="Tin trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#0052cc] hover:border-blue-300 transition shadow-2xs cursor-pointer"
              title="Tin tiếp theo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Sliding Ticker Item */}
      <div
        className={`pt-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer transition-all duration-300 ${fadeAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        onClick={() => onSelectDemand && onSelectDemand(activeItem)}
      >
        <div className="flex items-start space-x-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0047a5] via-[#0052cc] to-[#0066d6] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform mt-0.5">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-md text-[10.5px] font-mono font-bold shadow-2xs">
                Pha {activeItem.phaseId} • {activeItem.phaseName}
              </span>
              <span className="text-xs font-black text-slate-900 flex items-center gap-1 truncate font-heading">
                <Building2 className="w-3.5 h-3.5 text-[#0052cc] shrink-0" />
                {activeItem.factoryName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                {activeItem.location}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-slate-950 group-hover:text-[#0052cc] transition line-clamp-1 font-heading">
              ⚡ {activeItem.demandTitle}
            </h4>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
              <span>Quy mô ước tính: <strong className="text-emerald-700 font-mono font-bold">{activeItem.budget}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                {activeItem.timeAgo}
              </span>
              <span>•</span>
              <span className="text-blue-700 font-bold font-mono bg-blue-50 px-2 py-0.2 rounded border border-blue-100">
                Đã có {activeItem.bidsCount} báo giá gửi tới
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-2 shrink-0 pt-1 lg:pt-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectDemand) onSelectDemand(activeItem);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white font-bold text-xs shadow-md shadow-blue-900/15 transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer transform hover:-translate-y-0.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi Báo Giá Ngay</span>
          </button>
        </div>
      </div>

      {/* Progress / Dot Indicators */}
      <div className="flex items-center justify-center space-x-1.5 pt-3">
        {REALTIME_PROCUREMENT_FEED.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setFadeAnim(false);
              setTimeout(() => {
                setCurrentIndex(idx);
                setFadeAnim(true);
              }, 150);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? 'w-6 bg-[#0052cc]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
