import React from 'react';
import { 
  Search, Filter, RotateCcw, MapPin, Building2, Sparkles, 
  Layers, LayoutGrid, Table as TableIcon, Map as MapIcon, ChevronDown
} from 'lucide-react';

export default function KcnAdvancedLandFilter({
  searchTerm,
  setSearchTerm,
  selectedSegment,
  setSelectedSegment,
  selectedIndustry,
  setSelectedIndustry,
  selectedProvince,
  setSelectedProvince,
  provinceList,
  totalResults,
  viewMode,
  setViewMode,
  onResetFilters
}) {
  const segments = [
    { id: 'all', label: 'Tất cả phân khúc' },
    { id: 'eco', label: '🌿 KCN Sinh thái (Eco-IP)' },
    { id: 'hitech', label: '⚡ KCN Công nghệ cao' },
    { id: 'multi', label: '🏭 KCN Đa ngành' },
    { id: 'ccn', label: '🏢 Cụm Công nghiệp (CCN)' },
  ];

  const industries = [
    { id: 'all', label: 'Tất cả ngành nghề thu hút' },
    { id: 'semiconductor', label: 'Điện tử & Bán dẫn (Semiconductor)' },
    { id: 'mechanics', label: 'Cơ khí chính xác & Tự động hóa' },
    { id: 'garment', label: 'Dệt may & Giày da xuất khẩu' },
    { id: 'packaging', label: 'Bao bì & In ấn công nghiệp' },
    { id: 'food', label: 'Chế biến Thực phẩm & F&B' },
    { id: 'pharma', label: 'Dược phẩm & Y tế (GMP Cleanroom)' },
    { id: 'logistics', label: 'Logistics & Kho bãi 3PL/4PL' },
  ];

  const hasActiveFilters = searchTerm || selectedSegment !== 'all' || selectedIndustry !== 'all' || selectedProvince !== 'all';

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-md p-4 sm:p-5 space-y-4 font-sans">
      
      {/* Row 1: Search & Dropdown Selectors (3 Clean Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        
        {/* Search Bar (5 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên KCN, vị trí, cảng biển..."
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

        {/* 34 Provinces Selector (4 cols) */}
        <div className="lg:col-span-4">
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full pl-9 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate"
            >
              <option value="all">Tất cả 34 Tỉnh Thành Trọng Điểm ({provinceList.length})</option>
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
            <select
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

      {/* Row 2: Segment Pills + View Switcher + Reset */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        
        {/* Segment Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {segments.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0052cc] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {seg.label}
              </button>
            );
          })}
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
              <span className="hidden sm:inline">Thẻ B2B</span>
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
              <span className="hidden sm:inline">Bảng 480 KCN</span>
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
