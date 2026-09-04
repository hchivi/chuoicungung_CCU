import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Truck, HardHat, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';

export default function KcnCrossSellBanner() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/80 border border-blue-200/90 shadow-lg shadow-blue-900/5 p-5 sm:p-7 lg:p-8 my-8 transition-all">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Container: 12-Cols prevents any overflow */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100/90 text-[#0052cc] text-[11px] font-black font-mono uppercase tracking-wide border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0052cc] animate-pulse" />
            <span>KHÉP KÍN CHUỖI CUNG ỨNG 18 PHA</span>
          </div>

          <h3 className="text-lg sm:text-xl xl:text-2xl font-black font-heading tracking-tight text-slate-900 leading-snug">
            Đã chọn được quỹ đất? Hệ sinh thái <span className="text-[#0052cc]">Chuoicungung.com</span> sẵn sàng triển khai nhà máy của bạn.
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Kết nối trực tiếp 24.000+ Nhà cung cấp đã xác thực qua 3 Lớp KYC B2B để nhập khẩu máy móc, thông quan cảng và thi công nhà xưởng đạt chuẩn ISO.
          </p>

          <div className="flex items-center space-x-4 pt-1 text-[11.5px] font-semibold text-slate-500">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Xác thực 3 lớp KYC</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Khớp lệnh dưới 15p</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): 2 Interactive Action Cards with Hover Popup Effect */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          
          {/* Nút 1: Kết nối PORTALINK - Vận tải thiết bị về KCN (Pha 1) */}
          <Link
            to="/pha/1.1"
            onMouseEnter={() => setHoveredCard('pha1')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative p-5 rounded-2xl bg-white hover:bg-gradient-to-b hover:from-blue-50/90 hover:to-white border-2 border-blue-200/80 hover:border-[#0052cc] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer overflow-hidden"
          >
            {/* Top Interactive Floating Pill (Tự động pop up nổi bật khi hover) */}
            <div className={`transition-all duration-300 flex items-center justify-between`}>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold border border-blue-100 group-hover:bg-[#0052cc] group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full group-hover:bg-[#0052cc] group-hover:text-white transition-colors duration-300">
                Pha 1
              </span>
            </div>

            {/* Content */}
            <div className="space-y-1.5 relative z-10">
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-heading group-hover:text-[#0052cc] transition-colors leading-snug">
                Kết nối PORTALINK - Vận tải thiết bị về KCN
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                Thông quan cảng biển, kéo container máy móc và logistics siêu trường siêu trọng.
              </p>
            </div>

            {/* Dynamic Popup Highlight Badge on Hover */}
            <div className="pt-1">
              <div className="h-6 flex items-center">
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>128+ Đội xe siêu trường sẵn sàng</span>
                </div>
              </div>
            </div>

            {/* CTA Arrow */}
            <div className="pt-2 border-t border-slate-100 group-hover:border-blue-200 text-xs font-black text-[#0052cc] flex items-center justify-between font-heading uppercase transition">
              <span>Khớp nối ngay</span>
              <div className="w-6 h-6 rounded-full bg-blue-50 group-hover:bg-[#0052cc] text-[#0052cc] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Nút 2: Tìm Nhà thầu Xây dựng/M&E (Pha 2, 3, 4) */}
          <Link
            to="/pha/2.1"
            onMouseEnter={() => setHoveredCard('pha2')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative p-5 rounded-2xl bg-white hover:bg-gradient-to-b hover:from-emerald-50/90 hover:to-white border-2 border-emerald-200/80 hover:border-emerald-600 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer overflow-hidden"
          >
            {/* Top Interactive Floating Pill (Tự động pop up nổi bật khi hover) */}
            <div className="transition-all duration-300 flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:-rotate-6 group-hover:scale-110 transition-all duration-300 shadow-2xs">
                <HardHat className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                Pha 2, 3, 4
              </span>
            </div>

            {/* Content */}
            <div className="space-y-1.5 relative z-10">
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-heading group-hover:text-emerald-700 transition-colors leading-snug">
                Tìm Nhà thầu Xây dựng / M&amp;E
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                Tổng thầu EPC kết cấu thép, trạm biến áp, PCCC và phòng sạch Cleanroom GMP.
              </p>
            </div>

            {/* Dynamic Popup Highlight Badge on Hover */}
            <div className="pt-1">
              <div className="h-6 flex items-center">
                <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>340+ Tổng thầu EPC &amp; M&amp;E</span>
                </div>
              </div>
            </div>

            {/* CTA Arrow */}
            <div className="pt-2 border-t border-slate-100 group-hover:border-emerald-200 text-xs font-black text-emerald-700 flex items-center justify-between font-heading uppercase transition">
              <span>Tìm nhà thầu</span>
              <div className="w-6 h-6 rounded-full bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

        </div>

      </div>

    </div>
  );
}
