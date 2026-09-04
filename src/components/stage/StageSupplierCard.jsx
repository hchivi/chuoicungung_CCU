import React from 'react';
import { 
  ShieldCheck, Zap, Star, Clock, CheckCircle2, 
  ArrowRight, Award, ExternalLink, MapPin, Building2, Send
} from 'lucide-react';

export default function StageSupplierCard({ 
  supplier, 
  onRequestQuote, 
  themeColor = "#8b5cf6" 
}) {
  const getKycBadge = (tier) => {
    switch (tier) {
      case 'diamond':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[11px] font-black tracking-wide shadow-xs">
            <span>💎</span>
            <span>KYC KIM CƯƠNG</span>
          </span>
        );
      case 'gold':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[11px] font-black tracking-wide shadow-xs">
            <span>🥇</span>
            <span>KYC VÀNG</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-700 text-white text-[11px] font-bold tracking-wide shadow-xs">
            <span>🥈</span>
            <span>KYC BẠC</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between space-y-4 group relative overflow-hidden">
      
      {/* Top row: Logo, Name, Tier badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start space-x-3.5">
            {/* Logo box */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-xs border border-slate-100 ${supplier.avatarBg || 'bg-slate-100'}`}>
              {supplier.logo || '🏢'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h4 className="text-sm sm:text-base font-black text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition">
                  {supplier.name}
                </h4>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  Pha {supplier.phaseId}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                  {supplier.location}
                </span>
              </div>
            </div>
          </div>

          {/* KYC Tier Badge in Corner */}
          <div className="flex-shrink-0">
            {getKycBadge(supplier.kycTier)}
          </div>

        </div>

        {/* Description summary */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
          {supplier.description}
        </p>

        {/* 3 Core Keyword Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {supplier.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-800 transition"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Standards & ERP badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {supplier.odooReady && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-[10px] font-black uppercase font-mono">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>ERP / API Ready</span>
            </span>
          )}

          {supplier.standards && supplier.standards.map((std, sIdx) => (
            <span
              key={sIdx}
              className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-[10px] font-bold"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              <span>{std}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom row: Stats + CTA buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left Stats: Rating, Completed Projects, SLA */}
        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <div className="flex items-center space-x-1 font-bold text-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{supplier.rating}</span>
            <span className="text-slate-400 font-normal">({supplier.reviewsCount})</span>
          </div>
          <span>•</span>
          <div>
            <strong className="text-slate-800">{supplier.completedProjects}</strong> dự án
          </div>
          <span>•</span>
          <div className="flex items-center text-emerald-700 font-semibold">
            <Clock className="w-3 h-3 mr-1" />
            <span>SLA {supplier.slaHours}</span>
          </div>
        </div>

        {/* Right CTA buttons */}
        <div className="flex items-center space-x-2 self-end sm:self-auto w-full sm:w-auto">
          <button
            onClick={() => onRequestQuote(supplier)}
            style={{
              backgroundColor: themeColor
            }}
            className="flex-1 sm:flex-none px-4 py-2 text-white hover:opacity-90 rounded-xl text-xs font-bold font-heading shadow-xs transition flex items-center justify-center space-x-1.5 uppercase"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yêu Cầu Báo Giá</span>
          </button>
        </div>

      </div>

    </div>
  );
}
