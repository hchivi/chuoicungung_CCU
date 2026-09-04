import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function InteractivePhaseWheel({ activeStageId = null, onSelectStage = null }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [hoveredStage, setHoveredStage] = useState(activeStageId || 1);

  const selectedStage = stagesData.find(s => s.id === hoveredStage) || stagesData[0];

  const handleStageClick = (id) => {
    if (onSelectStage) {
      onSelectStage(id);
    } else {
      navigate(`/giai-doan/${id}`);
    }
  };

  const getStageTitle = (id) => {
    if (lang === 'en') {
      const titles = {
        1: "Preparation & Investment",
        2: "Design & Construction",
        3: "Installation & Commissioning",
        4: "Production & Operation",
        5: "HR & Logistics Services",
        6: "Scale – Optimize – ESG"
      };
      return titles[id] || "";
    }
    const titles = {
      1: "Chuẩn bị & Đầu tư",
      2: "Thiết kế & Xây dựng",
      3: "Lắp đặt & Hoàn thiện",
      4: "Vận hành Sản xuất",
      5: "Nhân sự & Hậu cần",
      6: "Mở rộng - Tối ưu"
    };
    return titles[id] || "";
  };

  return (
    <div className="bg-gradient-to-br from-[#061e38] via-[#072847] to-[#041426] p-6 md:p-8 rounded-3xl text-white shadow-2xl border border-sky-900/40 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left / Center: Interactive SVG Cycle Graphic */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* Outer Rotating Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-400/20 animate-spin-slow"></div>

            {/* Center Logo Core */}
            <div 
              className="z-20 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white text-slate-800 p-3 shadow-2xl border-4 border-sky-100 flex items-center justify-center text-center group cursor-pointer transition transform hover:scale-105"
              onClick={() => navigate('/ban-do-6-giai-doan')}
            >
              <img 
                src="/logo_only.png" 
                alt="Logo" 
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain" 
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </div>

            {/* 6 Stage Orbital Nodes with Custom Colors */}
            
            {/* Stage 1: Top-Left (10:30) - TÍM */}
            <button
              onClick={() => handleStageClick(1)}
              onMouseEnter={() => setHoveredStage(1)}
              className={`absolute top-2 left-6 sm:left-10 w-24 sm:w-28 p-2 rounded-2xl transition-all duration-300 transform text-left ${
                hoveredStage === 1 
                  ? 'bg-purple-600 text-white scale-110 shadow-lg shadow-purple-500/50 ring-4 ring-purple-300' 
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:scale-105 border border-purple-500/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-purple-400/30 text-purple-200 flex items-center justify-center font-black text-xs font-mono">01</span>
                <span className="font-bold text-[11px] leading-tight line-clamp-2 font-heading">{getStageTitle(1)}</span>
              </div>
            </button>

            {/* Stage 2: Top-Right (1:30) - XANH LÁ */}
            <button
              onClick={() => handleStageClick(2)}
              onMouseEnter={() => setHoveredStage(2)}
              className={`absolute top-2 right-6 sm:right-10 w-24 sm:w-28 p-2 rounded-2xl transition-all duration-300 transform text-left ${
                hoveredStage === 2 
                  ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/50 ring-4 ring-emerald-300' 
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:scale-105 border border-emerald-500/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-400/30 text-emerald-200 flex items-center justify-center font-black text-xs font-mono">02</span>
                <span className="font-bold text-[11px] leading-tight line-clamp-2 font-heading">{getStageTitle(2)}</span>
              </div>
            </button>

            {/* Stage 3: Mid-Right (3:30) - CAM */}
            <button
              onClick={() => handleStageClick(3)}
              onMouseEnter={() => setHoveredStage(3)}
              className={`absolute top-1/2 -translate-y-1/2 -right-3 sm:right-0 w-24 sm:w-28 p-2 rounded-2xl transition-all duration-300 transform text-left ${
                hoveredStage === 3 
                  ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/50 ring-4 ring-orange-300' 
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:scale-105 border border-orange-500/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-orange-400/30 text-orange-200 flex items-center justify-center font-black text-xs font-mono">03</span>
                <span className="font-bold text-[11px] leading-tight line-clamp-2 font-heading">{getStageTitle(3)}</span>
              </div>
            </button>

            {/* Stage 4: Bottom-Right (5:00) - XANH DƯƠNG */}
            <button
              onClick={() => handleStageClick(4)}
              onMouseEnter={() => setHoveredStage(4)}
              className={`absolute bottom-2 right-6 sm:right-10 w-24 sm:w-28 p-2 rounded-2xl transition-all duration-300 transform text-left ${
                hoveredStage === 4 
                  ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/50 ring-4 ring-blue-300' 
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:scale-105 border border-blue-500/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-blue-400/30 text-blue-200 flex items-center justify-center font-black text-xs font-mono">04</span>
                <span className="font-bold text-[11px] leading-tight line-clamp-2 font-heading">{getStageTitle(4)}</span>
              </div>
            </button>

            {/* Stage 5: Bottom-Left (7:00) - VÀNG */}
            <button
              onClick={() => handleStageClick(5)}
              onMouseEnter={() => setHoveredStage(5)}
              className={`absolute bottom-2 left-6 sm:left-10 w-24 sm:w-28 p-2 rounded-2xl transition-all duration-300 transform text-left ${
                hoveredStage === 5 
                  ? 'bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/50 ring-4 ring-amber-300' 
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:scale-105 border border-amber-500/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-amber-400/30 text-amber-200 flex items-center justify-center font-black text-xs font-mono">05</span>
                <span className="font-bold text-[11px] leading-tight line-clamp-2 font-heading">{getStageTitle(5)}</span>
              </div>
            </button>

            {/* Stage 6: Mid-Left (8:30) - ĐỎ */}
            <button
              onClick={() => handleStageClick(6)}
              onMouseEnter={() => setHoveredStage(6)}
              className={`absolute top-1/2 -translate-y-1/2 -left-3 sm:left-0 w-24 sm:w-28 p-2 rounded-2xl transition-all duration-300 transform text-left ${
                hoveredStage === 6 
                  ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-600/50 ring-4 ring-red-300' 
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:scale-105 border border-red-500/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-6 h-6 rounded-lg bg-red-400/30 text-red-200 flex items-center justify-center font-black text-xs font-mono">06</span>
                <span className="font-bold text-[11px] leading-tight line-clamp-2 font-heading">{getStageTitle(6)}</span>
              </div>
            </button>

          </div>
          <span className="text-[11px] text-slate-400 mt-2 italic">
            {lang === 'en' ? '* Hover or click on each stage to view breakdown' : '* Rê chuột hoặc bấm vào từng giai đoạn để xem thông tin chi tiết'}
          </span>
        </div>

        {/* Right: Dynamic Stage Info Card */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <span 
                style={{ backgroundColor: selectedStage.color }}
                className="px-2.5 py-1 rounded-lg text-white font-black text-xs shadow-xs font-mono"
              >
                {lang === 'en' ? `Stage ${selectedStage.id}` : `Giai đoạn ${selectedStage.id}`}
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-heading">
                {getStageTitle(selectedStage.id)}
              </h3>
            </div>
            <span className="text-[10px] text-slate-300 font-mono">
              {selectedStage.phases.length} {lang === 'en' ? 'Phases' : 'Pha thực thi'}
            </span>
          </div>

          <p className="text-xs text-slate-200 mt-3 leading-relaxed font-sans">
            {selectedStage.summary}
          </p>

          {/* 3 Sub-phases with links */}
          <div className="mt-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block font-heading">
              {lang === 'en' ? 'Sub-Phase Modules:' : 'Các pha thành phần:'}
            </span>
            <div className="space-y-1.5">
              {selectedStage.phases.map((phase) => (
                <Link
                  key={phase.id}
                  to={`/pha/${phase.id}`}
                  className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span 
                      style={{ backgroundColor: selectedStage.color }}
                      className="w-5 h-5 rounded-md text-white font-black text-[10px] flex items-center justify-center flex-shrink-0 font-mono"
                    >
                      {phase.id}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition truncate">
                      {phase.title}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-1 group-hover:text-amber-300 transition-all flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>

          {/* Action Link */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-mono">
              {selectedStage.stats.enterprises} {lang === 'en' ? 'suppliers participating' : 'doanh nghiệp tham gia'}
            </span>
            <Link
              to={`/giai-doan/${selectedStage.id}`}
              className="inline-flex items-center space-x-1 text-xs font-bold text-sky-300 hover:text-white transition group font-heading"
            >
              <span>{lang === 'en' ? `Explore Stage ${selectedStage.id}` : `Khám phá chi tiết Giai đoạn ${selectedStage.id}`}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

