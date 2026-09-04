import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Truck, HardHat, Shirt, ShieldCheck, 
  Building2, Factory, Layers, CheckCircle2
} from 'lucide-react';

export default function KcnCrossSellBanner() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#072348] to-[#003d8f] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-blue-500/30 my-8">
      
      {/* Ambient background glows */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Headline */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>KHÉP KÍN CHUỖI CUNG ỨNG 18 PHA CHO NHÀ ĐẦU TƯ FDI</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading tracking-tight text-white leading-tight">
            Đã Chọn Được Quỹ Đất KCN? Khởi Động Ngay Nhà Máy Của Bạn!
          </h3>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Hệ sinh thái <strong className="text-white">Chuoicungung.com</strong> với 24.000+ Nhà cung cấp đã xác thực 3 Lớp KYC sẵn sàng đồng hành từ vận chuyển thiết bị siêu trường, tổng thầu EPC đến trang bị đồ bảo hộ toàn diện.
          </p>
        </div>

        {/* Right 3 Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          
          {/* Action 1: Logistics PORTALINK */}
          <Link
            to="/pha/1.1"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-blue-300 transition-all flex flex-col justify-between space-y-2.5 group backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-400/20 text-blue-200 px-2 py-0.5 rounded">
                Pha 1 & 5
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs font-heading group-hover:text-amber-300 transition">
                Vận Tải & Logistics
              </h4>
              <p className="text-[11px] text-blue-200 line-clamp-2">
                Kết nối Nhóm PORTALINK - Thủ tục hải quan & kéo container.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-300 flex items-center group-hover:translate-x-1 transition font-heading">
              <span>Khớp nối ngay →</span>
            </div>
          </Link>

          {/* Action 2: EPC Contractors & M&E */}
          <Link
            to="/pha/2.1"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2.5 group backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold">
                <HardHat className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded">
                Pha 2, 3, 4
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs font-heading group-hover:text-amber-300 transition">
                Tổng Thầu EPC & M&E
              </h4>
              <p className="text-[11px] text-blue-200 line-clamp-2">
                Thi công nhà xưởng, PCCC & phòng sạch GMP chuẩn ISO.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-300 flex items-center group-hover:translate-x-1 transition font-heading">
              <span>Tìm nhà thầu →</span>
            </div>
          </Link>

          {/* Action 3: Uniforms & PPE */}
          <Link
            to="/pha/5.3"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-amber-300 transition-all flex flex-col justify-between space-y-2.5 group backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold">
                <Shirt className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded">
                Pha 5 & 6
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs font-heading group-hover:text-amber-300 transition">
                Đồng Phục & BHLĐ
              </h4>
              <p className="text-[11px] text-blue-200 line-clamp-2">
                Nhóm Chuyên Gia Đồng Phục - Cung ứng PPE chống tĩnh điện ESD.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-300 flex items-center group-hover:translate-x-1 transition font-heading">
              <span>Xem báo giá →</span>
            </div>
          </Link>

        </div>

      </div>

    </div>
  );
}
