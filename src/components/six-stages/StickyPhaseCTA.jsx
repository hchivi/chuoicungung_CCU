import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PlusCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function StickyPhaseCTA({ activePhase, activeStage }) {
  if (!activePhase) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-4 pointer-events-none font-sans">
      <div className="pointer-events-auto bg-[#072348]/95 backdrop-blur-xl rounded-3xl p-3 sm:p-4 text-white shadow-2xl border-2 border-blue-400/40 hover:border-amber-400 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 shadow-blue-950/40">
        
        {/* Left Info */}
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black font-mono shadow-md flex-shrink-0 hidden sm:flex">
            {activePhase.id}
          </div>
          <div>
            <div className="text-[10.5px] font-black uppercase tracking-wider text-amber-400 font-heading flex items-center space-x-1.5 justify-center sm:justify-start">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Phễu Khớp Nối Năng Lực Quốc Gia</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-100">
              Bạn cần mua hàng hoặc cung ứng dịch vụ tại <span className="text-amber-300 font-extrabold">{activePhase.title}</span>?
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <Link
            to="/dang-nhu-cau"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-xs font-black uppercase font-heading tracking-wider shadow-md hover:shadow-lg transition flex items-center space-x-1.5 whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tạo Nhu Cầu</span>
          </Link>

          <Link
            to="/dinh-vi-doanh-nghiep"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-xs font-black uppercase font-heading tracking-wider shadow-md hover:shadow-lg transition flex items-center space-x-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Xác Thực Hồ Sơ</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
