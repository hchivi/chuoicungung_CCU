import React from 'react';
import { Zap, ShieldCheck, ArrowRight, Building2, Factory } from 'lucide-react';

export default function LiveMatchTicker() {
  const matchRecords = [
    { phase: 'Pha 1.2', buyer: 'Nhà máy FDI tại VSIP Bắc Ninh', seller: 'Công ty Tư Vấn Pháp Lý VietAn', action: 'vừa hoàn tất thẩm duyệt PCCC' },
    { phase: 'Pha 2.2', buyer: 'Dự án Mở Rộng KCN Deep C Hải Phòng', seller: 'Tổng Thầu Thép Tiền Chế ATAD', action: 'vừa ký kết thi công 25.000m²' },
    { phase: 'Pha 3.1', buyer: 'Nhà máy Bán dẫn Amkor Technology', seller: 'M&E Phòng Sạch Hưng Thịnh', action: 'vừa nghiệm thu hệ thống AHU Class 1000' },
    { phase: 'Pha 4.2', buyer: 'Cụm FDI Điện Tử Amata Đồng Nai', seller: 'Cơ Khí Chính Xác Tiến Bộ CNC', action: 'vừa khớp lệnh 50.000 chi tiết Jig' },
    { phase: 'Pha 4.3', buyer: 'Tập đoàn Thực phẩm Masan KCN Tân Đông Hiệp', seller: 'Bao Bì Giấy Toàn Cầu', action: 'vừa ký hợp đồng cung ứng 200.000 thùng' },
    { phase: 'Pha 5.1', buyer: 'Nhà máy Sản xuất Lego Group Bình Dương', seller: 'Mạng lưới Logistics Ngoại Quan PORTALINK', action: 'vừa đồng bộ 100 container' },
    { phase: 'Pha 5.2', buyer: 'Khu Công Nghiệp Long Hậu', seller: 'Hệ Thống Chuyên Gia Đồng Phục', action: 'vừa bàn giao 5.000 bộ đồ bảo hộ chuẩn ESG' },
  ];

  return (
    <div className="w-full bg-[#051830] border-y border-blue-900/40 text-slate-300 py-2 px-3 overflow-hidden font-sans select-none">
      <div className="flex items-center space-x-3">

        {/* Fixed Title Tag */}
        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-[11px] font-black uppercase font-heading flex-shrink-0 z-10 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>DÒNG CHẢY GIAO THƯƠNG</span>
        </div>

        {/* Marquee Ticker Track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee-left flex items-center space-x-6 whitespace-nowrap">
            {[...matchRecords, ...matchRecords].map((item, idx) => (
              <div key={idx} className="inline-flex items-center space-x-2 text-xs text-slate-300">
                <span className="font-mono font-bold text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10.5px]">
                  [{item.phase}]
                </span>
                <span className="font-semibold text-white">{item.buyer}</span>
                <span className="text-slate-400">{item.action}</span>
                <span className="text-emerald-400 font-bold">({item.seller})</span>
                <span className="text-slate-600 font-bold">•</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
