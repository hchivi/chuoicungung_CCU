import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Truck, HardHat, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function KcnCrossSellBanner() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-50/95 via-indigo-50/85 to-sky-50/95 border-2 border-blue-200/90 shadow-lg p-6 sm:p-8 lg:p-10 my-8">
      
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Headline */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0052cc] text-xs font-black font-mono uppercase tracking-wider border border-blue-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>KHÉP KÍN CHUỖI CUNG ỨNG 18 PHA CHO NHÀ ĐẦU TƯ FDI</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading tracking-tight text-slate-950 leading-tight">
            Đã chọn được quỹ đất? Hệ sinh thái Chuoicungung.com sẵn sàng triển khai nhà máy của bạn.
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Kết nối trực tiếp 24.000+ Nhà cung cấp đã xác thực qua 3 Lớp KYC B2B để nhập khẩu máy móc, thông quan cảng và thi công nhà xưởng đạt chuẩn ISO.
          </p>
        </div>

        {/* Right 2 Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:w-auto shrink-0">
          
          {/* Nút 1: Kết nối PORTALINK - Vận tải thiết bị về KCN (Pha 1) */}
          <Link
            to="/pha/1.1"
            className="p-5 rounded-2xl bg-white hover:bg-blue-50/70 border-2 border-blue-200/90 hover:border-[#0052cc] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold border border-blue-100 group-hover:bg-[#0052cc] group-hover:text-white transition">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10.5px] font-mono font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                Pha 1
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm font-heading group-hover:text-[#0052cc] transition">
                Kết nối PORTALINK - Vận tải thiết bị về KCN
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                Thông quan cảng biển, kéo container máy móc và logistics siêu trường siêu trọng.
              </p>
            </div>

            <div className="text-xs font-bold text-[#0052cc] flex items-center space-x-1 font-heading uppercase group-hover:translate-x-1 transition pt-1">
              <span>Khớp nối ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Nút 2: Tìm Nhà thầu Xây dựng/M&E (Pha 2, 3, 4) */}
          <Link
            to="/pha/2.1"
            className="p-5 rounded-2xl bg-white hover:bg-emerald-50/70 border-2 border-emerald-200/90 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition">
                <HardHat className="w-5 h-5" />
              </div>
              <span className="text-[10.5px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Pha 2, 3, 4
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm font-heading group-hover:text-emerald-700 transition">
                Tìm Nhà thầu Xây dựng / M&amp;E
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                Tổng thầu EPC kết cấu thép, trạm biến áp, PCCC và phòng sạch Cleanroom GMP.
              </p>
            </div>

            <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1 font-heading uppercase group-hover:translate-x-1 transition pt-1">
              <span>Tìm nhà thầu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>

      </div>

    </div>
  );
}
