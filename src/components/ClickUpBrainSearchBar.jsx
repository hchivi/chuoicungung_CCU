import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ClickUpBrainSearchBar({
  searchCategory,
  setSearchCategory,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit
}) {
  const { t } = useLanguage();

  return (
    <div className="relative w-full group">
      
      {/* 360° REVOLVING CONIC GRADIENT BORDER (CLICKUP STYLE) */}
      <div className="clickup-search-border shadow-lg shadow-blue-950/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
        
        {/* Inner Search Bar Body (Crisp White Background) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="relative z-10 bg-white p-1 sm:p-1.5 rounded-[24px] flex flex-col sm:flex-row items-stretch gap-1.5 sm:gap-2"
        >
          {/* Category Selector Dropdown */}
          <div className="relative sm:w-56 flex-shrink-0">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full h-10 sm:h-12 px-3.5 sm:px-4 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer pr-9 font-sans transition"
            >
              <option value="all">{t('hero.searchAll')}</option>
              <option value="enterprises">{t('hero.searchEnterprises')}</option>
              <option value="factories">{t('hero.searchFactories')}</option>
              <option value="industrial_parks">{t('hero.searchParks')}</option>
              <option value="associations">{t('hero.searchAssociations')}</option>
              <option value="stages">{t('hero.searchStages')}</option>
            </select>
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Keyword Input */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder={t('hero.searchPlaceholder')}
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
            <span>{t('hero.searchButton')}</span>
          </button>
        </form>

      </div>

    </div>
  );
}
