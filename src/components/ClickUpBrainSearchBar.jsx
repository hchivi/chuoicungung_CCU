import React from 'react';
import { Search } from 'lucide-react';

export default function ClickUpBrainSearchBar({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit
}) {
  return (
    <div className="relative w-full group">
      
      {/* 360° REVOLVING CONIC GRADIENT BORDER (CLICKUP STYLE) */}
      <div className="clickup-search-border shadow-lg shadow-blue-950/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
        
        {/* Inner Search Bar Body (Crisp White Background) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="relative z-10 bg-white p-1 sm:p-1.5 rounded-[24px] flex flex-col sm:flex-row items-stretch gap-1.5 sm:gap-2"
        >
          <div className="flex h-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-4 text-xs font-black text-blue-800 sm:h-12 sm:w-40 sm:rounded-2xl tracking-wide font-heading">
            <span>TRỢ LÝ AI</span>
          </div>

          {/* Search Keyword Input */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Anh/chị đang cần gì cho doanh nghiệp?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 sm:h-12 pl-10 sm:pl-11 pr-4 bg-transparent text-xs sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none font-sans"
            />
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            className="h-10 sm:h-12 px-6 sm:px-9 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition flex items-center justify-center space-x-2 whitespace-nowrap font-heading uppercase tracking-wide cursor-pointer flex-shrink-0"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>TÌM KIẾM</span>
          </button>
        </form>

      </div>

    </div>
  );
}
