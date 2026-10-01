import React from 'react';
import { 
  Search, Filter, RotateCcw, MapPin, Building2, Sparkles, 
  Layers, LayoutGrid, Table as TableIcon, Map as MapIcon, ChevronDown,
  Factory, Target, Rocket, Truck, BookOpen, Check
} from 'lucide-react';

export default function KcnAdvancedLandFilter({
  searchTerm,
  setSearchTerm,
  selectedRegion = 'all',
  setSelectedRegion,
  selectedIndustry = 'all',
  setSelectedIndustry,
  selectedProvince = 'all',
  setSelectedProvince,
  provinceList = [],
  quickFilters = {},
  setQuickFilters,
  totalResults = 0,
  viewMode = 'grid',
  setViewMode,
  onResetFilters
}) {
  const regions = [
    { id: 'all', label: 'Toàn quốc' },
    { id: 'Miền Bắc', label: 'Miền Bắc' },
    { id: 'Miền Trung', label: 'Miền Trung' },
    { id: 'Đông Nam Bộ', label: 'Đông Nam Bộ' },
    { id: 'Đồng bằng Sông Cửu Long', label: 'ĐBSCL' },
  ];

  const industries = [
    { id: 'all', label: 'Tất cả nhóm ngành KCN' },
    { id: 'Điện tử', label: 'Điện tử & Bán dẫn (Electronics / Semiconductor)' },
    { id: 'Cơ khí', label: 'Cơ khí chính xác & Chế tạo máy' },
    { id: 'Bao bì', label: 'Bao bì & Đóng gói công nghiệp' },
    { id: 'Dệt may', label: 'Dệt may & Da giày phụ trợ' },
    { id: 'Thực phẩm', label: 'Chế biến Thực phẩm & Nông sản' },
    { id: 'Logistics', label: 'Logistics KCN & Kho ngoại quan' },
    { id: 'Phụ trợ', label: 'Công nghiệp phụ trợ tổng hợp' }
  ];

  const topProvinces = [
    'Bình Dương', 'Đồng Nai', 'Bắc Ninh', 'Hải Phòng', 'Hồ Chí Minh', 'Long An', 'Bắc Giang', 'Quảng Nam'
  ];

  const hasActiveFilters = searchTerm || 
    selectedRegion !== 'all' || 
    selectedIndustry !== 'all' || 
    selectedProvince !== 'all' ||
    quickFilters.hasPublicFactories ||
    quickFilters.hasPublicRequirements ||
    quickFilters.hasActivePrograms ||
    quickFilters.hasSupplierCoverage ||
    quickFilters.hasCatalogue;

  const toggleQuickFilter = (key) => {
    if (!setQuickFilters) return;
    setQuickFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-md p-4 sm:p-5 space-y-3.5 font-sans">
      
      {/* Row 1: Search & Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        
        {/* Search Bar (5 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <label htmlFor="kcn-advanced-search-input" className="sr-only">Tìm theo tên KCN, địa bàn, ngành</label>
          <input
            id="kcn-advanced-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên KCN, tên viết tắt (Amata, VSIP...), địa bàn, ngành..."
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* 63 Provinces Selector (4 cols) */}
        <div className="lg:col-span-4">
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="kcn-advanced-province-select" className="sr-only">Chọn tỉnh thành</label>
            <select
              id="kcn-advanced-province-select"
              aria-label="Chọn tỉnh thành"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full pl-9 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate"
            >
              <option value="all">Tất cả Tỉnh / Thành phố ({provinceList.length})</option>
              {provinceList.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.count} KCN)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Priority Industries Selector (3 cols) */}
        <div className="lg:col-span-3">
          <div className="relative">
            <Building2 className="w-3.5 h-3.5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="kcn-advanced-industry-select" className="sr-only">Chọn ngành ưu tiên</label>
            <select
              id="kcn-advanced-industry-select"
              aria-label="Chọn ngành ưu tiên"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full pl-9 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate"
            >
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Row 2: Top Province Quick Chips (Section 42) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 mr-1">Tỉnh trọng điểm:</span>
        <button
          onClick={() => setSelectedProvince('all')}
          className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
            selectedProvince === 'all'
              ? 'bg-[#0052cc] text-white shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          Toàn quốc
        </button>
        {topProvinces.map((prov) => {
          const isSelected = selectedProvince.toLowerCase() === prov.toLowerCase();
          return (
            <button
              key={prov}
              onClick={() => setSelectedProvince(prov)}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition ${
                isSelected
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {prov}
            </button>
          );
        })}
      </div>

      {/* Row 3: Quick Filter Chips (Section 7) & View Mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
        
        {/* Quick Filter Chips (Section 7) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Có nhà máy */}
          <button
            onClick={() => toggleQuickFilter('hasPublicFactories')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 whitespace-nowrap transition cursor-pointer shrink-0 ${
              quickFilters.hasPublicFactories
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Có nhà máy ({">"}0)</span>
          </button>

          {/* Có nhu cầu */}
          <button
            onClick={() => toggleQuickFilter('hasPublicRequirements')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 whitespace-nowrap transition cursor-pointer shrink-0 ${
              quickFilters.hasPublicRequirements
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Có nhu cầu mở</span>
          </button>

          {/* Có chương trình */}
          <button
            onClick={() => toggleQuickFilter('hasActivePrograms')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 whitespace-nowrap transition cursor-pointer shrink-0 ${
              quickFilters.hasActivePrograms
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Có chương trình</span>
          </button>

          {/* Nguồn cung phục vụ */}
          <button
            onClick={() => toggleQuickFilter('hasSupplierCoverage')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 whitespace-nowrap transition cursor-pointer shrink-0 ${
              quickFilters.hasSupplierCoverage
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Có nguồn cung phục vụ</span>
          </button>

          {/* Catalogue */}
          <button
            onClick={() => toggleQuickFilter('hasCatalogue')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 whitespace-nowrap transition cursor-pointer shrink-0 ${
              quickFilters.hasCatalogue
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Có catalogue</span>
          </button>
        </div>

        {/* View Switcher & Counter */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
          
          <div className="text-slate-500 font-medium">
            <span>Tìm thấy </span>
            <strong className="text-[#0052cc] font-mono font-black text-sm">{totalResults}</strong>
            <span> KCN</span>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          )}

          {/* View Mode Buttons */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0052cc] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hệ sinh thái</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0052cc] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bảng tổng hợp</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('ban-do-kcn-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition text-slate-600 hover:text-[#0052cc] hover:bg-white/80 cursor-pointer"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bản đồ GIS ↓</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
