import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ArrowRight, X, ChevronRight, 
  ChevronLeft, Award, CheckCircle, PhoneCall, Building2, Send,
  Minimize2, Maximize2, ExternalLink, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SupplyChainExpoWidget() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* ========================================================
          1. FLOATING RIGHT-EDGE HERO WIDGET (COLLAPSIBLE)
      ======================================================== */}
      <div className="hidden lg:block absolute top-6 xl:top-8 right-4 xl:right-8 z-30 transition-all duration-300">
        
        {/* COLLAPSED STATE: COMPACT FLOATING TAB / PILL (NO FLAME ICON) */}
        {!isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/40 cursor-pointer backdrop-blur-md"
            title={lang === 'en' ? "Open Vietnam Supply Chain Expo" : "Mở Ngày hội Chuỗi Cung Ứng"}
          >
            {/* Glowing Pulse Ring */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-200"></span>
            </span>

            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-100 flex items-center gap-1">
                <span>{lang === 'en' ? "HOT EVENT 2026" : "SỰ KIỆN NỔI BẬT"}</span>
              </div>
              <div className="text-xs sm:text-sm font-black font-heading tracking-tight whitespace-nowrap text-white">
                {lang === 'en' ? "Supply Chain Expo" : "Ngày hội Chuỗi Cung Ứng"}
              </div>
            </div>

            <ChevronLeft className="w-4 h-4 text-white/90 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* EXPANDED STATE: HIGH-END ARTISTIC CRYSTAL WINDOW */}
        {isExpanded && (
          <div className="w-[320px] xl:w-[350px] bg-white/95 backdrop-blur-xl border border-orange-300/80 rounded-3xl shadow-2xl shadow-slate-900/15 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-right-4">
            
            {/* Header with Transparent Rotating Chuoi Cung Ung Logo & Close Button (No white box) */}
            <div className="relative p-3.5 sm:p-4 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white flex items-center justify-between overflow-hidden">
              {/* Background Accent Shimmer */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center space-x-2.5 min-w-0">
                {/* Rotating Chuoi Cung Ung Logo (Clean Transparent directly on gradient, NO white background) */}
                <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-transparent drop-shadow-md">
                  <img 
                    src="/logo_only.png" 
                    alt="Logo Chuỗi Cung Ứng" 
                    className="w-full h-full object-contain animate-[spin_8s_linear_infinite]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logo.png';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9.5px] font-black uppercase tracking-wider text-amber-100 border border-white/20">
                      {lang === 'en' ? "SPECIAL EVENT" : "SỰ KIỆN ĐẶC BIỆT"}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black font-heading text-white tracking-tight truncate">
                    {lang === 'en' ? "Supply Chain Festival" : "Ngày hội Chuỗi Cung Ứng"}
                  </h3>
                </div>
              </div>

              {/* Minimize / Collapse Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-7 h-7 rounded-lg bg-black/15 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title={lang === 'en' ? "Collapse window" : "Thu gọn cửa sổ"}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-3.5 sm:p-4 space-y-3 text-slate-700 text-xs">
              
              {/* Event Pitch / Slogan (No star icon) */}
              <div className="p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 space-y-1">
                <div className="font-bold text-[#072348] text-xs sm:text-[13px] font-heading">
                  {lang === 'en' ? "Vietnam Supply Chain Summit & Expo" : "Kết Nối Giao Thương B2B Toàn Quốc"}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  {lang === 'en' 
                    ? "Direct 1-on-1 matchmaking between 500+ factories, industrial parks and 24,000+ verified suppliers."
                    : "Khớp lệnh cung - cầu 1:1 giữa 500+ Nhà máy, KCN và 24.000+ Nhà cung ứng theo 6 Giai đoạn vòng đời."}
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-[11px] sm:text-xs">
                  <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Users className="w-3 h-3" />
                  </div>
                  <span className="truncate">
                    <strong>500+</strong> Nhà máy & KCN tham dự
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium text-[11px] sm:text-xs">
                  <div className="w-5 h-5 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-3 h-3" />
                  </div>
                  <span className="truncate">
                    <strong>18 Pha Kỹ Thuật</strong> trưng bày năng lực
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium text-[11px] sm:text-xs">
                  <div className="w-5 h-5 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Award className="w-3 h-3" />
                  </div>
                  <span className="truncate">
                    Tặng gói <strong>KYC Kim Cương & E-Profile</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Changed to "Xem Chi Tiết" navigating to /ngay-hoi-chuoi-cung-ung */}
              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/ngay-hoi-chuoi-cung-ung')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{lang === 'en' ? "View Details" : "Xem Chi Tiết"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between gap-2 pt-0.5 text-[10.5px] text-slate-500 font-medium">
                  <a
                    href="tel:19008686"
                    className="inline-flex items-center gap-1 hover:text-orange-600 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3 text-orange-600" />
                    <span>Hotline: <strong>1900 8686</strong></span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? "Minimize" : "Thu gọn"}
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MOBILE FLOATING TRIGGER BUTTON (STICKY AT BOTTOM RIGHT) */}
      <div className="lg:hidden fixed bottom-6 right-4 z-40">
        <button
          type="button"
          onClick={() => navigate('/ngay-hoi-chuoi-cung-ung')}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-xl shadow-orange-500/40 border border-white/30 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          {/* Mini Rotating Logo for Mobile */}
          <img 
            src="/logo_only.png" 
            alt="CCU" 
            className="w-4 h-4 object-contain animate-[spin_8s_linear_infinite]"
          />
          <span>Ngày hội Chuỗi Cung Ứng</span>
        </button>
      </div>
    </>
  );
}
