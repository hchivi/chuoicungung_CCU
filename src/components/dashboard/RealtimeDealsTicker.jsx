import React, { useState, useEffect } from 'react';
import { Radio, Zap, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RealtimeDealsTicker({ lang = 'vi' }) {
  const liveDeals = [
    {
      id: 1,
      buyer: 'TAHOMART Retail Chain',
      supplier: 'Nhà máy Nông sản Hưng Yên',
      item: '20.000 set Mít sấy Nam Huy & Thập cẩm Nut Farm',
      value: '2.400.000.000 VNĐ',
      status: 'Đã khớp lệnh thành công',
      time: 'Vừa xong',
      location: 'KCN Phố Nối A'
    },
    {
      id: 2,
      buyer: 'Khối Ngân Hàng HDBank',
      supplier: 'Xưởng Bao Bì Cao Cấp Hà Nội',
      item: '15.000 Hộp quà Tết dọc tỷ lệ 9:16 Ép kim',
      value: '1.850.000.000 VNĐ',
      status: 'Đã ký hợp đồng điện tử',
      time: '1 phút trước',
      location: 'KCN Quang Minh'
    },
    {
      id: 3,
      buyer: 'FDI Foxconn Precision',
      supplier: 'Công ty Cơ khí Bắc Ninh',
      item: '45 bộ Khuôn dập CNC chính xác & JIG kiểm tra',
      value: '3.600.000.000 VNĐ',
      status: 'Đã hoàn tất nghiệm thu',
      time: '3 phút trước',
      location: 'KCN Quế Võ'
    },
    {
      id: 4,
      buyer: 'Hệ Thống Phân Phối Chuỗi',
      supplier: 'Công ty Chè & Cà phê Lâm Đồng',
      item: '50 tấn Trà ô long Cozy & Cà phê G7 xuất khẩu',
      value: '4.200.000.000 VNĐ',
      status: 'Đang vận chuyển Phase 5',
      time: '6 phút trước',
      location: 'KCN Lộc Sơn'
    },
    {
      id: 5,
      buyer: 'Tập đoàn Điện tử Amkor',
      supplier: 'Nhà máy Phụ trợ Hải Phòng',
      item: '120.000 khay nhựa định hình ESD chống tĩnh điện',
      value: '980.000.000 VNĐ',
      status: 'Đã khớp lệnh thành công',
      time: '8 phút trước',
      location: 'KCN Tràng Duệ'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveDeals.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveDeals.length]);

  const deal = liveDeals[currentIndex];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 border border-slate-800 text-white rounded-2xl p-3 sm:px-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Live Badge */}
      <div className="flex items-center space-x-2 shrink-0">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          {lang === 'en' ? 'LIVE STREAMING DEALS (EVENT-DRIVEN)' : 'DÒNG CHẢY GIAO DỊCH REAL-TIME'}
        </span>
        <span className="hidden md:inline-block px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/50 text-[10px] text-blue-300 font-mono">
          ERP/e-Invoice Sync
        </span>
      </div>

      {/* Animated Deal Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left transition-all duration-500 transform key={deal.id}">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
          <span className="font-bold text-sky-300">{deal.buyer}</span>
          <span className="text-slate-400">➔</span>
          <span className="font-semibold text-emerald-300">{deal.supplier}</span>
          <span className="text-slate-300 text-[11px] truncate max-w-xs">({deal.item})</span>
          <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-[11px] rounded-md">
            {deal.value}
          </span>
          <span className="text-[10px] text-slate-400 font-mono ml-auto hidden lg:inline">
            📍 {deal.location} • {deal.time}
          </span>
        </div>
      </div>

      {/* Audit Tag */}
      <div className="shrink-0 flex items-center space-x-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>100% Đối Soát Hóa Đơn VAT</span>
      </div>
    </div>
  );
}
