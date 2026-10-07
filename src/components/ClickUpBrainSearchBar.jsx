import React from 'react';
import { Search } from 'lucide-react';
import GlassAiButton from './GlassAiButton';

export default function ClickUpBrainSearchBar({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit
}) {
  return (
    <div className="relative w-full group">
      {/* SUPPI & CHAINY Assistant Role Tagline Above Search Bar */}
      <div className="flex items-center justify-center mb-3">
        <div className="inline-flex items-center gap-2 sm:gap-3.5 px-3 sm:px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xs transition-all">
          <div className="flex items-center gap-1.5">
            <img 
              src="/mascots/type_suppi.png" 
              alt="SUPPI" 
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain"
              onError={(e) => { e.currentTarget.src = '/type_suppi.png'; }}
            />
            <span className="text-xs sm:text-[13px] font-medium text-slate-700">
              <strong className="font-black text-[#0066cc]">SUPPI</strong> tìm nguồn
            </span>
          </div>

          <span className="text-slate-300 font-light select-none">|</span>

          <div className="flex items-center gap-1.5">
            <img 
              src="/mascots/type_chainy.png" 
              alt="CHAINY" 
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain"
              onError={(e) => { e.currentTarget.src = '/type_chainy.png'; }}
            />
            <span className="text-xs sm:text-[13px] font-medium text-slate-700">
              <strong className="font-black text-[#e91e63]">CHAINY</strong> kết nối
            </span>
          </div>
        </div>
      </div>

      {/* 360° REVOLVING CONIC GRADIENT BORDER (CLICKUP STYLE) */}
      <div className="clickup-search-border shadow-lg shadow-blue-950/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
        
        {/* Inner Search Bar Body (Crisp White Background) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="relative z-10 bg-white p-1 sm:p-1.5 rounded-[24px] flex items-center gap-1.5 sm:gap-2"
        >
          {/* Search Keyword Input */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Nhập từ khoá quan tâm, trợ lý SUPPI & CHAINY sẽ hỗ trợ"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-4 bg-transparent text-xs sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Submit Glass AI Button (ThreeUI Glass AI Button style) */}
          <GlassAiButton type="submit" text="TÌM KIẾM" />
        </form>

      </div>

    </div>
  );
}
