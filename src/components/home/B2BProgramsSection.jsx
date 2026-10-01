import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, ArrowRight, ArrowUpRight, 
  CheckCircle2, Building2, Factory, Users, Sparkles
} from 'lucide-react';
import { EXPO_EVENTS } from '../../data/expoEventsData';

export default function B2BProgramsSection() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState('ALL');

  const zones = [
    { id: 'ALL', label: 'Tất cả các khu vực', count: EXPO_EVENTS.length },
    { id: 'Miền Nam', label: 'Miền Nam', count: EXPO_EVENTS.filter(e => e.zone === 'Miền Nam').length },
    { id: 'Miền Bắc', label: 'Miền Bắc', count: EXPO_EVENTS.filter(e => e.zone === 'Miền Bắc').length },
    { id: 'Miền Trung', label: 'Miền Trung', count: EXPO_EVENTS.filter(e => e.zone === 'Miền Trung').length },
  ];

  const filteredEvents = selectedZone === 'ALL' 
    ? EXPO_EVENTS 
    : EXPO_EVENTS.filter(e => e.zone === selectedZone);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      
      {/* 1. Header: Strictly 1 Line Title */}
      <div className="text-center w-full max-w-5xl mx-auto px-2 space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
          CÁC NGÀY HỘI KẾT NỐI CUNG ỨNG TRỌNG ĐIỂM
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
          Các phiên gặp gỡ, thẩm định năng lực và kết nối giao thương trực tiếp giữa Nhà máy FDI và Nhà cung ứng tại các KCN.
        </p>
      </div>

      {/* 2. Interactive Region Filter Tabs (Centered) */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto pt-1">
        {zones.map((zone) => {
          const isActive = selectedZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-heading transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#0052cc] text-white font-bold shadow-md shadow-blue-600/20 border border-[#0052cc]'
                  : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-2xs font-semibold'
              }`}
            >
              <span>{zone.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {zone.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Redesigned Premium Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredEvents.map((event) => {
          const zoneBadgeClass = event.zone === 'Miền Bắc'
            ? 'bg-amber-50 text-amber-800 border-amber-200/80'
            : event.zone === 'Miền Trung'
            ? 'bg-purple-50 text-purple-800 border-purple-200/80'
            : 'bg-blue-50 text-blue-800 border-blue-200/80';

          // Format date parts
          const [day, month, year] = event.date.split('/');

          return (
            <div
              key={event.id}
              onClick={() => navigate(`/chuong-trinh/${event.id}`)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group relative"
            >
              {/* Card Top Banner Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#0052cc] via-blue-500 to-indigo-600 group-hover:h-2 transition-all" />

              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Row 1: Date Calendar Block + Zone & Status */}
                <div className="flex items-start justify-between gap-3">
                  {/* Compact Date Box */}
                  <div className="flex items-center space-x-2.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/70 flex flex-col items-center justify-center text-center shrink-0 shadow-2xs group-hover:bg-[#0052cc] group-hover:text-white transition-colors">
                      <span className="text-xs font-black font-mono leading-none group-hover:text-white text-[#0052cc]">
                        {day}
                      </span>
                      <span className="text-[10px] font-bold font-mono uppercase leading-tight text-slate-500 group-hover:text-white/90">
                        T{month}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono border ${zoneBadgeClass}`}>
                          {event.zone === 'Miền Bắc' ? '🇻🇳 Miền Bắc' : event.zone === 'Miền Trung' ? '🇻🇳 Miền Trung' : '🇻🇳 Miền Nam'}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Tiếp nhận hồ sơ
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        @{event.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Event Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0052cc] font-heading tracking-tight leading-snug line-clamp-2 transition-colors">
                    {event.shortName || event.name}
                  </h3>
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 mt-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Row 3: Sourcing Highlight Box */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-1">
                  <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider block">
                    Trọng tâm chuỗi cung ứng:
                  </span>
                  <p className="line-clamp-2 font-medium text-[11.5px] text-slate-700">
                    {event.tagline || event.highlight}
                  </p>
                </div>

                {/* Row 4: Scale Counter Chips (3 Columns) */}
                <div className="grid grid-cols-3 gap-2 py-1 text-center">
                  <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100/70">
                    <span className="text-xs font-mono font-black text-[#0052cc] block">
                      {event.factoriesCount}+
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Nhà máy FDI
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100/70">
                    <span className="text-xs font-mono font-black text-indigo-700 block">
                      {event.suppliersCount}+
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Nhà cung ứng
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100/70">
                    <span className="text-xs font-mono font-black text-emerald-700 block">
                      Khớp 1:1
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Bàn thẩm định
                    </span>
                  </div>
                </div>

              </div>

              {/* Card Footer: Clean Action Button */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50/40 transition-colors">
                <span className="text-xs font-bold text-[#0052cc] group-hover:text-[#0041a8] flex items-center gap-1 font-heading">
                  Đăng ký tham dự & Xem chi tiết
                </span>
                
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 group-hover:bg-[#0052cc] group-hover:border-[#0052cc] text-slate-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer Link to View All */}
      <div className="text-center pt-2">
        <Link
          to="/chuong-trinh"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#0052cc] hover:text-[#0041a8] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition font-heading shadow-2xs"
        >
          <span>Xem tất cả sự kiện & ngày hội ({EXPO_EVENTS.length})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </section>
  );
}
