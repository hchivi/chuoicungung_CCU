import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Factory, ShieldCheck, ChevronRight, Download, 
  Eye, Navigation, Plane, Anchor, Sparkles, TrendingUp, Layers, CheckCircle2
} from 'lucide-react';
import { calculateKcnLogistics } from '../../utils/kcnLogisticsUtils';

export default function KcnCard({ kcn, onOpenSiteVisit, onOpenBrochure }) {
  if (!kcn) return null;

  const logistics = calculateKcnLogistics(kcn);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group relative">
      
      {/* 1. Visual Banner (16:9 Ratio with Master Plan / Photo + Overlays) */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={kcn.image || '/stage1_hero.jpg'}
          alt={kcn.name}
          onError={(e) => { e.currentTarget.src = '/stage1_hero.jpg'; }}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 brightness-[1.02] contrast-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          {/* Segment Tag */}
          <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-amber-300 font-extrabold text-[11px] border border-amber-400/40 shadow-md flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{logistics.segment}</span>
          </span>

          {/* Province Pill */}
          <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-bold text-[11px] shadow-sm">
            {kcn.province}
          </span>
        </div>

        {/* Bottom Metrics on Image */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2 text-white">
          <div>
            <span className="text-[10px] text-slate-300 block font-medium">Giá thuê tham khảo</span>
            <strong className="text-base sm:text-lg font-black font-mono text-amber-300 drop-shadow-sm">
              {logistics.rentPrice}
            </strong>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-300 block font-medium">Đất trống sẵn sàng</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-bold font-mono text-xs shadow-sm">
              Còn trống {logistics.readyLandHa} Ha
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card Body */}
      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        
        {/* Header & Verification */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-blue-700 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-heading uppercase tracking-wide">Xác thực Bộ KH&ĐT • BQL KCN</span>
          </div>

          <Link
            to={`/khu-cong-nghiep/${kcn.id}`}
            className="block text-base sm:text-lg font-black text-slate-900 font-heading hover:text-[#0052cc] transition line-clamp-1 leading-snug"
          >
            {kcn.name}
          </Link>

          <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{kcn.location || `${kcn.province}, Việt Nam`}</span>
          </p>
        </div>

        {/* 3. Logistics Intelligence Radar (Distance to Port & Airport) */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Airport */}
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">
                {logistics.airport.code}: <strong className="text-slate-900 font-mono">{logistics.airport.distanceKm} km</strong>
              </span>
            </div>

            {/* Port */}
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Anchor className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                Cảng biển: <strong className="text-slate-900 font-mono">{logistics.seaport.distanceKm} km</strong>
              </span>
            </div>
          </div>

          {/* Factories operating & Occupancy */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Đang hoạt động: <strong className="text-slate-800 font-mono font-bold">{kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0)} Nhà máy</strong></span>
            <span>Tỷ lệ lấp đầy: <strong className="text-emerald-700 font-bold">{logistics.occupancyRate}</strong></span>
          </div>
        </div>

        {/* 4. Priority Industries Tags */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-heading">
            Ngành nghề ưu tiên thu hút:
          </span>
          <div className="flex flex-wrap gap-1">
            {logistics.priorityIndustries.map((ind, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10.5px] font-medium border border-blue-100/80"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Dual Action Buttons */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          
          <button
            onClick={() => onOpenBrochure && onOpenBrochure(kcn, logistics)}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-heading uppercase transition flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="truncate">Tải Quy Hoạch</span>
          </button>

          <button
            onClick={() => onOpenSiteVisit && onOpenSiteVisit(kcn, logistics)}
            className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0284c7] hover:from-[#002f70] hover:to-[#0041a3] text-white text-xs font-bold font-heading uppercase transition shadow-md shadow-blue-900/15 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate">Thực Địa 1-1</span>
          </button>

        </div>

      </div>

    </div>
  );
}
