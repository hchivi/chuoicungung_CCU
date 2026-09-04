import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Factory, MapPin, Building2, CheckCircle2, 
  ChevronRight, ArrowRight, RotateCcw, LayoutGrid, LayoutList,
  Calendar, ShieldCheck, Sparkles, ExternalLink, Globe, Phone, Briefcase, Layers, Award
} from 'lucide-react';
import kcnFullList from '../data/industrialParksFull.json';
import factoriesFullList from '../data/factoriesFull.json';
import { useLanguage } from '../contexts/LanguageContext';

const PROVINCES = [
  "Toàn quốc", "Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Hà Nội", "Bắc Ninh", 
  "Hải Phòng", "Long An", "Đà Nẵng", "Bà Rịa - Vũng Tàu", "Hưng Yên", "Hải Dương", 
  "Vĩnh Phúc", "Bắc Giang", "Quảng Nam", "Quảng Ngãi", "Khánh Hòa", "Cần Thơ", "Thái Nguyên",
  "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Tây Ninh", "Bình Phước", "Tiền Giang", "Bến Tre"
];

const FACTORY_TYPES = [
  "Tất cả loại hình",
  "Doanh nghiệp FDI",
  "Kinh tế tư nhân",
  "Công ty Cổ phần",
  "Công ty TNHH",
  "100% Vốn nước ngoài"
];

// Local resilient filter fallback for factories
function filterFactoriesLocally(allData, { searchTerm, selectedProvince, selectedKcn, selectedType, currentPage, limit = 24, sortBy }) {
  if (!allData || !Array.isArray(allData)) return { data: [], total: 0, totalPages: 1 };
  try {
    let filtered = allData;
    if (searchTerm) {
      const qClean = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => {
        if (!f) return false;
        const nameClean = (f.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const kcnClean = (f.kcnName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const addrClean = (f.address || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const indClean = (f.industry || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const typeClean = (f.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nameClean.includes(qClean) || kcnClean.includes(qClean) || addrClean.includes(qClean) || indClean.includes(qClean) || typeClean.includes(qClean);
      });
    }
    if (selectedProvince !== 'Toàn quốc' && selectedProvince !== 'all') {
      const provClean = selectedProvince.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => {
        if (!f) return false;
        const fProv = (f.province || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return fProv.includes(provClean) || provClean.includes(fProv);
      });
    }
    if (selectedKcn !== 'all') {
      const kcnClean = selectedKcn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => f && (f.kcnName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kcnClean));
    }
    if (selectedType !== 'all' && selectedType !== 'Tất cả loại hình') {
      const typeClean = selectedType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => f && (f.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(typeClean));
    }
    if (sortBy === 'name-asc') {
      filtered = [...filtered].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    } else if (sortBy === 'year-desc') {
      filtered = [...filtered].sort((a, b) => parseInt(b?.foundedYear || 0) - parseInt(a?.foundedYear || 0));
    }
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit);
    return { data: paginated, total, totalPages };
  } catch (e) {
    console.error('Error filtering factories locally:', e);
    return { data: (allData || []).slice(0, limit), total: allData?.length || 0, totalPages: Math.ceil((allData?.length || 0) / limit) || 1 };
  }
}

export default function FactoriesPage() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(queryParams.get('q') || '');
  const [selectedProvince, setSelectedProvince] = useState(queryParams.get('province') || 'Toàn quốc');
  const [selectedKcn, setSelectedKcn] = useState(queryParams.get('kcn') || 'all');
  const [selectedType, setSelectedType] = useState(queryParams.get('type') || 'all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'name-asc' | 'year-desc'

  // Initialize with local dataset immediately
  const initialLocal = useMemo(() => {
    return filterFactoriesLocally(factoriesFullList, {
      searchTerm: queryParams.get('q') || '',
      selectedProvince: queryParams.get('province') || 'Toàn quốc',
      selectedKcn: queryParams.get('kcn') || 'all',
      selectedType: queryParams.get('type') || 'all',
      currentPage: 1,
      limit: 24,
      sortBy: 'default'
    });
  }, []);

  const [factories, setFactories] = useState(initialLocal.data || []);
  const [totalCount, setTotalCount] = useState(initialLocal.total || 14237);
  const [totalPages, setTotalPages] = useState(initialLocal.totalPages || 594);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filter KCN list based on chosen province for the KCN dropdown
  const filteredKcnList = useMemo(() => {
    if (!kcnFullList || !Array.isArray(kcnFullList)) return [];
    if (selectedProvince === 'Toàn quốc' || selectedProvince === 'all') {
      return kcnFullList;
    }
    const provClean = selectedProvince.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    return kcnFullList.filter(k => {
      const kProv = (k.province || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      return kProv.includes(provClean) || provClean.includes(kProv);
    });
  }, [selectedProvince]);

  // Fetch factories from API with debounce and immediate offline fallback
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('q', searchTerm);
        if (selectedProvince !== 'Toàn quốc' && selectedProvince !== 'all') params.append('province', selectedProvince);
        if (selectedKcn !== 'all') params.append('kcn', selectedKcn);
        if (selectedType !== 'all' && selectedType !== 'Tất cả loại hình') params.append('type', selectedType);
        params.append('page', currentPage);
        params.append('limit', '24');

        const res = await fetch(`/api/factories?${params.toString()}`, { signal: controller.signal });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data)) {
            let list = json.data || [];
            if (sortBy === 'name-asc') {
              list = [...list].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
            } else if (sortBy === 'year-desc') {
              list = [...list].sort((a, b) => parseInt(b?.foundedYear || 0) - parseInt(a?.foundedYear || 0));
            }
            setFactories(list);
            setTotalCount(json.total || json.count || 0);
            setTotalPages(json.totalPages || 1);
            setIsLoading(false);
            return;
          }
        }
        throw new Error('API unavailable, switching to local dataset');
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Robust Fallback: Calculate from local 14,237 factories dataset
          const localResult = filterFactoriesLocally(factoriesFullList, {
            searchTerm,
            selectedProvince,
            selectedKcn,
            selectedType,
            currentPage,
            limit: 24,
            sortBy
          });
          if (isMounted) {
            setFactories(localResult.data);
            setTotalCount(localResult.total);
            setTotalPages(localResult.totalPages);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchTerm, selectedProvince, selectedKcn, selectedType, currentPage, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('Toàn quốc');
    setSelectedKcn('all');
    setSelectedType('all');
    setSortBy('default');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-24 font-sans text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white space-y-10">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic Smart Factory Visual) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Smart Factory Photo with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/smart_factory_hero.jpg" 
            alt="Vietnam Smart Manufacturing Plant"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 lg:via-[#F4F8FA]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-5">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">{lang === 'en' ? 'Factories Directory' : 'Nhà Máy & Cơ Sở Sản Xuất'}</span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'VIETNAM FDI & MANUFACTURING FACTORIES' : 'HỆ THỐNG DỮ LIỆU NHÀ MÁY & FDI VIỆT NAM'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                {lang === 'en' ? 'Factory Network' : 'Mạng Lưới Nhà Máy'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {lang === 'en' ? 'Smart Manufacturing Plants' : 'Cơ Sở Sản Xuất Thông Minh'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en'
                ? 'Search comprehensive database of 14,237+ manufacturing plants, fabrication facilities, and FDI enterprises actively operating across 480 Industrial Parks.'
                : 'Tra cứu danh sách 14.237+ nhà máy sản xuất, cơ sở chế tạo và doanh nghiệp FDI đang hoạt động thực tế trong 480 Khu công nghiệp trên toàn quốc.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#danh-sach-nha-may"
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <span>{lang === 'en' ? 'Explore Factories' : 'Tra Cứu Nhà Máy'}</span>
              </a>

              <Link
                to="/dang-nhu-cau"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Open Demands' : 'Nhu Cầu Cung Ứng'}</span>
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR (Đặt CHÍNH GIỮA LINE ở trên) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">14.237+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Active Factories' : 'Nhà máy đang hoạt động'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">480 KCN</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Connected IPs' : 'Khu công nghiệp kết nối'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">63</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Provinces Covered' : 'Tỉnh thành toàn quốc'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">FDI & B2B</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Sourcing Ready' : 'Nhu cầu mở kết nối'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div id="danh-sach-nha-may" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">

        {/* SEARCH & MULTI-FILTER WORKSPACE */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
            {/* Search Box */}
            <div className="sm:col-span-12 lg:col-span-5 relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={lang === 'en' ? "Search factory name, IP, industry, address..." : "Tìm tên nhà máy, KCN, ngành sản xuất, địa chỉ..."}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc]"
              />
            </div>

            {/* Province Filter */}
            <div className="sm:col-span-4 lg:col-span-3">
              <select
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setSelectedKcn('all'); setCurrentPage(1); }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc]"
              >
                {PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>{prov === "Toàn quốc" ? (lang === 'en' ? "📍 Nationwide (63 Provinces)" : "📍 Toàn quốc (63 Tỉnh)") : `📍 ${prov}`}</option>
                ))}
              </select>
            </div>

            {/* KCN Filter */}
            <div className="sm:col-span-4 lg:col-span-2">
              <select
                value={selectedKcn}
                onChange={(e) => { setSelectedKcn(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc]"
              >
                <option value="all">🏢 {lang === 'en' ? `IPs (${filteredKcnList.length})` : `KCN (${filteredKcnList.length})`}</option>
                {filteredKcnList.map((k) => (
                  <option key={k.id || k._id || k.stt} value={k.name}>{k.name}</option>
                ))}
              </select>
            </div>

            {/* Type / Sector Filter */}
            <div className="sm:col-span-4 lg:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc]"
              >
                {FACTORY_TYPES.map((t) => (
                  <option key={t} value={t === "Tất cả loại hình" ? "all" : t}>
                    {t === "Tất cả loại hình" && lang === 'en' ? "All Company Types" : t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-500">{lang === 'en' ? 'Sort by:' : 'Sắp xếp theo:'}</span>
              <button
                onClick={() => setSortBy('default')}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  sortBy === 'default' ? 'bg-[#0052cc] text-white border-[#0052cc]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lang === 'en' ? 'Default Index' : 'Mặc định STT'}
              </button>
              <button
                onClick={() => setSortBy('name-asc')}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  sortBy === 'name-asc' ? 'bg-[#0052cc] text-white border-[#0052cc]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lang === 'en' ? 'Name A → Z' : 'Tên A → Z'}
              </button>
              <button
                onClick={() => setSortBy('year-desc')}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  sortBy === 'year-desc' ? 'bg-[#0052cc] text-white border-[#0052cc]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lang === 'en' ? 'Newest Founded Year' : 'Năm thành lập mới nhất'}
              </button>
              {(searchTerm || selectedProvince !== 'Toàn quốc' || selectedKcn !== 'all' || selectedType !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 text-rose-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> {lang === 'en' ? 'Reset filters' : 'Đặt lại lọc'}
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition flex items-center gap-1 font-bold ${
                  viewMode === 'grid' ? 'bg-white text-[#0052cc] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title={lang === 'en' ? "Grid View" : "Dạng Lưới"}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'en' ? "Grid" : "Lưới"}</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl transition flex items-center gap-1 font-bold ${
                  viewMode === 'table' ? 'bg-white text-[#0052cc] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title={lang === 'en' ? "Table View" : "Dạng Bảng"}
              >
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'en' ? "Detail Table" : "Bảng chi tiết"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER & COUNT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>
              {lang === 'en' ? 'Found ' : 'Tìm thấy '}
              <strong className="text-[#0052cc] font-black text-base">{(totalCount || 0).toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')}</strong> 
              {lang === 'en' ? ' manufacturing factories' : ' nhà máy sản xuất'}
            </span>
            {selectedProvince !== 'Toàn quốc' && (
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-extrabold">
                {selectedProvince}
              </span>
            )}
            {selectedKcn !== 'all' && (
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-extrabold line-clamp-1 max-w-xs">
                {selectedKcn}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            {lang === 'en' 
              ? `Page ${currentPage} / ${totalPages} (Displaying 24 factories / page)` 
              : `Trang ${currentPage} / ${totalPages} (Hiển thị 24 nhà máy / trang)`}
          </div>
        </div>

        {/* FACTORIES PRESENTATION */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-slate-50 rounded-2xl" />
                <div className="h-8 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (!factories || factories.length === 0) ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Factory className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">{lang === 'en' ? 'No matching factories found' : 'Không tìm thấy nhà máy phù hợp'}</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {lang === 'en' 
                ? 'Try changing search keywords, choosing another Industrial Park, or reset filters to browse the full directory of 14,237 factories.' 
                : 'Hãy thử thay đổi từ khóa tìm kiếm, chọn lại Khu công nghiệp hoặc đặt lại bộ lọc để xem toàn bộ danh mục 14.237 nhà máy.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              {lang === 'en' ? 'View all factories' : 'Xem tất cả nhà máy'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(factories || []).map((fac, idx) => {
              if (!fac) return null;
              const initial = (fac?.name || 'NM').charAt(0).toUpperCase();

              return (
                <div
                  key={fac?.id || fac?._id || `fac-${idx}`}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0052cc]/50 transition duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    {/* Header: Name & Type */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0047a5] to-[#0052cc] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 
                            className="font-extrabold text-slate-900 text-sm sm:text-base hover:text-[#0052cc] transition line-clamp-2 font-heading leading-snug"
                            title={fac?.name}
                          >
                            {fac?.name}
                          </h3>
                          <CheckCircle2 className="w-4 h-4 text-[#0052cc] shrink-0" title={lang === 'en' ? "Operating inside IP" : "Đang hoạt động trong KCN"} />
                        </div>
                        <p className="text-xs text-slate-500 font-semibold line-clamp-1 mt-0.5">
                          {fac?.type || (lang === 'en' ? "Manufacturing Enterprise" : "Doanh nghiệp sản xuất")}
                        </p>
                      </div>
                    </div>

                    {/* KCN & Province Badges */}
                    <div className="space-y-1.5">
                      <Link 
                        to={`/khu-cong-nghiep/${fac?.kcnId}`}
                        className="p-2 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 rounded-xl transition flex items-center gap-2 text-xs text-slate-700 group/kcn"
                        title={lang === 'en' ? `View details of ${fac?.kcnName}` : `Xem chi tiết ${fac?.kcnName}`}
                      >
                        <Building2 className="w-4 h-4 text-[#0052cc] shrink-0" />
                        <span className="font-bold text-slate-900 group-hover/kcn:text-[#0052cc] line-clamp-1">{fac?.kcnName}</span>
                      </Link>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/70 rounded-lg text-[10.5px] font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0052cc]" />
                          {fac?.province}
                        </span>
                        {fac?.foundedYear && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10.5px] font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {lang === 'en' ? `Est: ${fac.foundedYear}` : `Năm TL: ${fac.foundedYear}`}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-lg text-[10.5px] font-extrabold flex items-center gap-1 ml-auto">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] animate-pulse" />
                          {lang === 'en' ? 'Operating' : 'Đang hoạt động'}
                        </span>
                      </div>
                    </div>

                    {/* Industry & Address */}
                    <div className="space-y-2 pt-1 border-t border-slate-100 text-xs text-slate-600">
                      <div>
                        <span className="font-bold text-slate-700">{lang === 'en' ? 'Industry: ' : 'Ngành SX: '}</span>
                        <span className="text-slate-800 font-medium line-clamp-1">{fac?.industry}</span>
                      </div>
                      <div className="line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700">{lang === 'en' ? 'Address: ' : 'Địa chỉ: '}</span>
                        {fac?.address}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/doanh-nghiep?q=${encodeURIComponent(fac?.industry || fac?.name || '')}`}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-[#0052cc] text-[#0052cc] hover:text-white border border-blue-200/80 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                      title={lang === 'en' ? "Find supporting suppliers for this sector" : "Tìm nhà cung ứng phụ trợ cho ngành này"}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Supporting Suppliers' : 'Tìm NCC phụ trợ'}</span>
                    </Link>

                    <Link
                      to={`/khu-cong-nghiep/${fac?.kcnId}`}
                      className="px-3 py-1.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1"
                    >
                      <span>{lang === 'en' ? 'View IP' : 'Vào KCN'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white uppercase text-[11px] font-heading tracking-wider">
                  <tr>
                    <th className="p-3.5 text-center w-12">{lang === 'en' ? 'Index' : 'STT'}</th>
                    <th className="p-3.5 min-w-[240px]">{lang === 'en' ? 'Factory Name' : 'Tên Nhà Máy'}</th>
                    <th className="p-3.5 min-w-[200px]">{lang === 'en' ? 'Industrial Park' : 'Thuộc Khu Công Nghiệp'}</th>
                    <th className="p-3.5 min-w-[120px]">{lang === 'en' ? 'Province / City' : 'Tỉnh / Thành'}</th>
                    <th className="p-3.5 min-w-[90px] text-center">{lang === 'en' ? 'Est. Year' : 'Năm TL'}</th>
                    <th className="p-3.5 min-w-[140px]">{lang === 'en' ? 'Enterprise Type' : 'Loại Hình'}</th>
                    <th className="p-3.5 min-w-[200px]">{lang === 'en' ? 'Manufacturing Sector' : 'Ngành Sản Xuất'}</th>
                    <th className="p-3.5 text-center min-w-[110px]">{lang === 'en' ? 'Status' : 'Trạng Thái'}</th>
                    <th className="p-3.5 text-center min-w-[100px]">{lang === 'en' ? 'Action' : 'Thao Tác'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(factories || []).map((fac, idx) => {
                    if (!fac) return null;
                    return (
                      <tr key={fac?.id || fac?._id || `factr-${idx}`} className="hover:bg-blue-50/40 transition">
                        <td className="p-3.5 text-center text-slate-500 font-bold font-mono">
                          {(currentPage - 1) * 24 + idx + 1}
                        </td>
                        <td className="p-3.5">
                          <div className="font-extrabold text-slate-900 text-sm hover:text-[#0052cc] transition">
                            {fac?.name}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{fac?.address}</div>
                        </td>
                        <td className="p-3.5">
                          <Link 
                            to={`/khu-cong-nghiep/${fac?.kcnId}`}
                            className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{fac?.kcnName}</span>
                          </Link>
                        </td>
                        <td className="p-3.5 font-bold text-slate-700">
                          {fac?.province}
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-600">
                          {fac?.foundedYear || "—"}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold">
                            {fac?.type || (lang === 'en' ? "Private Enterprise" : "Kinh tế tư nhân")}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700">
                          <span className="line-clamp-2">{fac?.industry}</span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] mr-1" />
                            {lang === 'en' ? 'Active' : 'Hoạt động'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <Link
                            to={`/khu-cong-nghiep/${fac?.kcnId}`}
                            className="px-2.5 py-1 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-0.5"
                          >
                            <span>{lang === 'en' ? 'IP' : 'KCN'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              &larr; {lang === 'en' ? 'Previous' : 'Trang trước'}
            </button>
            <span className="px-4 py-2 bg-blue-50 border border-blue-200 text-[#0052cc] rounded-xl text-xs font-black">
              {lang === 'en' ? `Page ${currentPage} / ${totalPages}` : `Trang ${currentPage} / ${totalPages}`}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              {lang === 'en' ? 'Next' : 'Trang sau'} &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
