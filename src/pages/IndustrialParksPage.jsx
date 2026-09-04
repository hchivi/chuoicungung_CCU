import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Building2, Heart, ChevronRight, 
  RotateCcw, ArrowRight, Layers, Sparkles, Table as TableIcon,
  LayoutGrid, Map as MapIcon, ChevronLeft, Factory, ExternalLink,
  ShieldCheck, CheckCircle2, TrendingUp, Compass, Award, Check
} from 'lucide-react';
import fullKcnFallback from '../data/industrialParksFull.json';
import InteractiveVietnamMap from '../components/InteractiveVietnamMap';
import { vietnamMapRegions, topProvincesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function IndustrialParksPage() {
  const { t, lang } = useLanguage();
  const [kcnList, setKcnList] = useState(fullKcnFallback);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Thẻ KCN mặc định) | 'table' | 'map'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [favorites, setFavorites] = useState({});
  const [sortBy, setSortBy] = useState('stt-asc');

  // Map Interactive States
  const [mapActiveSelection, setMapActiveSelection] = useState({ type: 'region', name: 'Toàn quốc' });
  const [mapFlyToTarget, setMapFlyToTarget] = useState(null);

  const allRegionsMapList = [
    {
      name: "Toàn quốc",
      kcn: 480,
      factories: 14237,
      pct: "100%",
      desc: "Toàn cảnh mạng lưới sản xuất và công nghiệp trên 34 tỉnh/thành phố Việt Nam."
    },
    ...vietnamMapRegions
  ];

  const handleMapSelectRegion = (regName) => {
    setMapActiveSelection({ type: 'region', name: regName });
    setMapFlyToTarget({ type: 'region', name: regName, timestamp: Date.now() });
  };

  const handleMapSelectProvince = (provName) => {
    setMapActiveSelection({ type: 'province', name: provName });
    setMapFlyToTarget({ type: 'province', name: provName, timestamp: Date.now() });
  };

  // Fetch from MongoDB API on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/industrial-parks?limit=all');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setKcnList(json.data);
          }
        }
      } catch (err) {
        console.warn('Dùng dữ liệu cục bộ 480 KCN:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Extract unique provinces with counts
  const provinceList = useMemo(() => {
    const counts = {};
    kcnList.forEach(k => {
      if (k.province) {
        counts[k.province] = (counts[k.province] || 0) + 1;
      }
    });
    return Object.keys(counts).sort().map(p => ({
      name: p,
      count: counts[p]
    }));
  }, [kcnList]);

  // Regional breakdown statistics
  const regionStats = useMemo(() => {
    const stats = {
      'all': kcnList.length,
      'Miền Bắc': 0,
      'Miền Trung': 0,
      'Đông Nam Bộ': 0,
      'Đồng bằng Sông Cửu Long': 0,
      'Tây Nguyên': 0,
    };
    kcnList.forEach(k => {
      if (stats[k.region] !== undefined) {
        stats[k.region]++;
      }
    });
    return stats;
  }, [kcnList]);

  // Total factories count
  const totalFactoriesCount = useMemo(() => {
    return kcnList.reduce((acc, k) => acc + (k.totalFactories || (k.factories ? k.factories.length : 0)), 0);
  }, [kcnList]);

  // Text normalizer for accent-insensitive search index
  const removeAccents = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase();
  };

  // Advanced multi-criteria search and filter engine
  const filteredKCN = useMemo(() => {
    const rawQ = searchTerm.trim();
    const qClean = removeAccents(rawQ);

    const result = kcnList.filter(kcn => {
      const nameClean = removeAccents(kcn.name);
      const provClean = removeAccents(kcn.province);
      const locClean = removeAccents(kcn.location);

      const matchesName = !qClean || nameClean.includes(qClean);
      const matchesProvinceSearch = !qClean || provClean.includes(qClean);
      const matchesLoc = !qClean || locClean.includes(qClean);

      // Search inside factories within KCN
      const matchesFactory = !qClean || (kcn.factories && kcn.factories.some(f => {
        const fClean = removeAccents(f.name);
        const indClean = removeAccents(f.industry);
        return fClean.includes(qClean) || indClean.includes(qClean);
      }));

      const matchesSearch = matchesName || matchesProvinceSearch || matchesLoc || matchesFactory;
      const matchesRegion = selectedRegion === 'all' || kcn.region === selectedRegion;
      const matchesProvince = selectedProvince === 'all' || (kcn.province && kcn.province.toLowerCase() === selectedProvince.toLowerCase());

      return matchesSearch && matchesRegion && matchesProvince;
    });

    // Sorting & Relevance ranking
    if (rawQ) {
      // Prioritize exact or prefix name matches when searching
      result.sort((a, b) => {
        const aClean = removeAccents(a.name);
        const bClean = removeAccents(b.name);
        const aExact = aClean.includes(qClean) ? 1 : 0;
        const bExact = bClean.includes(qClean) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return (a.stt || 0) - (b.stt || 0);
      });
    } else {
      if (sortBy === 'stt-asc') {
        result.sort((a, b) => (a.stt || 0) - (b.stt || 0));
      } else if (sortBy === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      } else if (sortBy === 'factories-desc') {
        result.sort((a, b) => (b.totalFactories || 0) - (a.totalFactories || 0));
      }
    }

    return result;
  }, [kcnList, searchTerm, selectedRegion, selectedProvince, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredKCN.length / pageSize) || 1;
  const paginatedKCN = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredKCN.slice(start, start + pageSize);
  }, [filteredKCN, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedProvince, sortBy]);

  // Helper for region color badge
  const getRegionBadge = (region) => {
    switch (region) {
      case 'Miền Bắc':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Miền Trung':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Đông Nam Bộ':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Đồng bằng Sông Cửu Long':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tây Nguyên':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic Industrial Park Drone Visual) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Drone Photo with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/industrial_park_hero.jpg" 
            alt="Vietnam Modern Eco Industrial Parks"
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
              <span className="text-[#0052cc] font-bold">{lang === 'en' ? 'Industrial Parks Directory' : 'Khu Công Nghiệp'}</span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'VIETNAM INDUSTRIAL PARKS & ECOSYSTEM' : 'BẢN ĐỒ QUY HOẠCH & DANH BẠ KCN VIỆT NAM'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                {lang === 'en' ? 'Industrial Infrastructure' : 'Khu Công Nghiệp'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {lang === 'en' ? 'Sustainable Ecosystem' : 'Hạ Tầng Sản Xuất Bền Vững'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en'
                ? 'Comprehensive master database of 480 Industrial Parks nationwide and over 14,000+ member manufacturing factories.'
                : 'Hệ thống tra cứu đầy đủ 480 Khu công nghiệp, cụm công nghiệp sinh thái và toàn bộ danh mục hơn 14.000+ nhà máy sản xuất trực thuộc.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#danh-sach-kcn"
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <span>{lang === 'en' ? 'Explore 480 IPs' : 'Khám Phá 480 KCN'}</span>
              </a>

              <button
                onClick={() => setViewMode('map')}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Interactive Map' : 'Bản Đồ KCN'}</span>
              </button>
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
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">480</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Industrial Parks' : 'Khu công nghiệp & Cụm CN'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">34</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Provinces / Cities' : 'Tỉnh / Thành phố trọng điểm'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">{totalFactoriesCount ? totalFactoriesCount.toLocaleString('vi-VN') : '14.237+'}</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Factories & Plants' : 'Nhà máy & Cơ sở sản xuất'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">100%</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Master Planned' : 'Tọa độ quy hoạch & GPS'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div id="danh-sach-kcn" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">

        {/* 2. Interactive Region Filter Bar (5 Economic Regions) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', name: lang === 'en' ? 'All Nationwide' : 'Tất cả toàn quốc', count: regionStats['all'] },
            { id: 'Miền Bắc', name: lang === 'en' ? 'Northern Region' : 'Miền Bắc', count: regionStats['Miền Bắc'] },
            { id: 'Miền Trung', name: lang === 'en' ? 'Central Region' : 'Miền Trung', count: regionStats['Miền Trung'] },
            { id: 'Đông Nam Bộ', name: lang === 'en' ? 'Southeast Region' : 'Đông Nam Bộ', count: regionStats['Đông Nam Bộ'] },
            { id: 'Đồng bằng Sông Cửu Long', name: lang === 'en' ? 'Mekong Delta' : 'Mekong Delta (ĐBSCL)', count: regionStats['Đồng bằng Sông Cửu Long'] },
            { id: 'Tây Nguyên', name: lang === 'en' ? 'Central Highlands' : 'Tây Nguyên', count: regionStats['Tây Nguyên'] },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => { setSelectedRegion(r.id); setCurrentPage(1); }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
                selectedRegion === r.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{r.name}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedRegion === r.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {r.count}
              </span>
            </button>
          ))}
        </div>

        {/* 3. Search and Quick Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'en' ? "Search by industrial park name, province, member factory..." : "Tìm theo tên KCN, tỉnh thành, công ty bên trong..."}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              {/* Province Select */}
              <select
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="all">{lang === 'en' ? `All Provinces (${provinceList.length})` : `Tất cả Tỉnh Thành (${provinceList.length})`}</option>
                {provinceList.map(p => (
                  <option key={p.name} value={p.name}>
                    {p.name} ({p.count} KCN)
                  </option>
                ))}
              </select>

              {/* Sorter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="stt-asc">{lang === 'en' ? 'Index: 1 → 480' : 'STT: 1 → 480'}</option>
                <option value="name-asc">{lang === 'en' ? 'Name (A → Z)' : 'Tên KCN (A → Z)'}</option>
                <option value="factories-desc">{lang === 'en' ? 'Most Factories' : 'Nhiều NM nhất'}</option>
              </select>

              {/* Reset filter */}
              {(searchTerm || selectedRegion !== 'all' || selectedProvince !== 'all') && (
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedRegion('all'); setSelectedProvince('all'); }}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
                  title="Xóa bộ lọc"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Reset' : 'Đặt lại'}</span>
                </button>
              )}
            </div>
          </div>

          {/* View Mode Switcher (Table vs Grid vs Map) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="text-slate-500 font-medium">
              {lang === 'en' ? 'Found ' : 'Tìm thấy '}
              <strong className="text-blue-600 font-bold font-mono">{filteredKCN.length}</strong> {lang === 'en' ? 'industrial parks' : 'khu công nghiệp'} 
              {selectedRegion !== 'all' && ` (${selectedRegion})`}
              {selectedProvince !== 'all' && ` in ${selectedProvince}`}
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Bảng 24 trang</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Thẻ KCN</span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('ban-do-kcn-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition text-slate-600 hover:text-blue-600 hover:bg-white/80 cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Bản đồ KCN ↓</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIEW 1: TABLE VIEW (Standard 24-page Table Matching idpvn.com) */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-extrabold uppercase font-heading border-b border-slate-200 text-[11px] tracking-wider whitespace-nowrap">
                    <th className="py-3.5 px-3 w-14 text-center font-mono shrink-0">STT</th>
                    <th className="py-3.5 px-5 min-w-[200px]">TÊN KHU CÔNG NGHIỆP</th>
                    <th className="py-3.5 px-4 min-w-[140px]">TỈNH THÀNH</th>
                    <th className="py-3.5 px-4 hidden md:table-cell min-w-[150px]">VÙNG MIỀN</th>
                    <th className="py-3.5 px-4 text-center min-w-[120px]">SỐ NHÀ MÁY</th>
                    <th className="py-3.5 px-4 text-right min-w-[150px] shrink-0">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedKCN.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Không tìm thấy khu công nghiệp nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    paginatedKCN.map((kcn, idx) => (
                      <tr 
                        key={kcn.id || idx}
                        className="hover:bg-blue-50/40 transition group cursor-pointer"
                      >
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-500 whitespace-nowrap">
                          {kcn.stt || (currentPage - 1) * pageSize + idx + 1}
                        </td>
                        <td className="py-3.5 px-5">
                          <Link 
                            to={`/khu-cong-nghiep/${kcn.id}`}
                            className="font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center space-x-1.5"
                          >
                            <span>{kcn.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-blue-600 shrink-0" />
                          </Link>
                          {kcn.factories && kcn.factories.length > 0 && (
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              Gồm: {kcn.factories.slice(0, 2).map(f => f.name).join(', ')}...
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-700 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            <span>{kcn.province}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap inline-block leading-none ${getRegionBadge(kcn.region)}`}>
                            {kcn.region}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-bold border border-slate-200 whitespace-nowrap">
                            <Factory className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                            <span>{kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0)} Nhà máy</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap shrink-0">
                          <Link
                            to={`/khu-cong-nghiep/${kcn.id}`}
                            className="inline-flex items-center justify-center space-x-1 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-xs font-bold transition font-heading uppercase whitespace-nowrap shrink-0 leading-none"
                          >
                            <span>Xem nhà máy</span>
                            <ArrowRight className="w-3 h-3 shrink-0" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Matching IDPVN 24 Pages */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-slate-500 font-medium">
                Đang xem <strong className="text-slate-900">{(currentPage - 1) * pageSize + 1}</strong> đến{' '}
                <strong className="text-slate-900">{Math.min(currentPage * pageSize, filteredKCN.length)}</strong> trong tổng số{' '}
                <strong className="text-blue-600 font-bold">{filteredKCN.length}</strong> mục
              </div>

              <div className="flex items-center space-x-1 font-mono">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Dynamic Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2);
                  })
                  .map((page, idx, arr) => {
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2 text-slate-400 font-sans">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  title="Trang tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: GRID CARDS VIEW */}
        {viewMode === 'grid' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedKCN.map(kcn => (
                <div 
                  key={kcn.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition flex flex-col justify-between group"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img 
                      src={kcn.image || "/stage1_hero.jpg"} 
                      alt={kcn.name} 
                      onError={(e) => { e.currentTarget.src = "/stage1_hero.jpg"; }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700 brightness-[1.03] contrast-[1.05] saturate-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${getRegionBadge(kcn.region)}`}>
                      {kcn.province}
                    </span>
                    <span className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-mono font-bold backdrop-blur-sm">
                      STT: #{kcn.stt || '01'}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Link 
                        to={`/khu-cong-nghiep/${kcn.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-blue-600 transition block line-clamp-1 font-heading"
                      >
                        {kcn.name}
                      </Link>

                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="line-clamp-1">{kcn.province}, Việt Nam</span>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-center text-xs">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Nhà máy trực thuộc</span>
                          <strong className="text-blue-600 font-black font-mono">
                            {kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0)} Nhà máy
                          </strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Lấp đầy</span>
                          <strong className="text-emerald-600 font-bold">{kcn.occupancyRate || "85%"}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <Link
                        to={`/khu-cong-nghiep/${kcn.id}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center group-hover:translate-x-1 transition font-heading uppercase"
                      >
                        <span>Xem {kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0)} nhà máy</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Grid */}
            <div className="flex justify-center items-center space-x-1 font-mono pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 text-xs text-slate-600 font-sans">
                Trang <strong>{currentPage}</strong> / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 4.5. PHẦN BẢN ĐỒ HỆ SINH THÁI KHU CÔNG NGHIỆP VIỆT NAM (NẰM PHÍA TRÊN FOOTER) */}
      <section id="ban-do-kcn-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-10 border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[11px] font-extrabold rounded-full uppercase tracking-wider font-heading">
                Bản đồ số GIS
              </span>
              <span className="text-xs text-slate-400 font-medium">Cập nhật thời gian thực</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072348] font-heading uppercase tracking-tight mt-2">
              Bản Đồ Phân Bố 480 Khu Công Nghiệp & 14.237 Nhà Máy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Nền tảng GIS trực quan phân bố 480 Khu công nghiệp, 14.237 Nhà máy, 32.000+ Nhà cung ứng và 1.256 Nhu cầu B2B trên khắp Việt Nam.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              to="/ban-do-so"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition font-heading uppercase"
            >
              <span>Xem toàn màn hình</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2-Column Equal-Height Map Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Leaflet Map with 4 Switchable Tabs (8 cols on lg, 9 on xl) */}
          <div className="lg:col-span-8 xl:col-span-9 h-full min-h-[820px]">
            <InteractiveVietnamMap 
              height="100%" 
              externalFlyTo={mapFlyToTarget}
            />
          </div>

          {/* Right Regional Analytics (4 cols on lg, 3 on xl) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-5 text-xs">
            
            {/* THỐNG KÊ VÙNG KINH TẾ (Bao gồm Toàn quốc & 5 vùng kinh tế) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] font-heading">
                  THỐNG KÊ VÙNG KINH TẾ
                </h3>
                <span className="text-[10px] font-bold text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-md">
                  480 KCN
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Nhấp vào tab để phóng to và lọc trực tiếp trên bản đồ:</p>
              
              <div className="space-y-1.5">
                {allRegionsMapList.map(reg => {
                  const isActive = mapActiveSelection.type === 'region' && mapActiveSelection.name === reg.name;
                  return (
                    <button
                      key={reg.name}
                      onClick={() => handleMapSelectRegion(reg.name)}
                      className={`w-full text-left flex justify-between items-center p-2.5 rounded-2xl border transition duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40' 
                          : 'bg-slate-50/90 border-slate-200/70 text-slate-800 hover:bg-blue-50/80 hover:border-blue-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <strong className={`block text-xs font-heading ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {reg.name}
                          </strong>
                          {isActive && <Check className="w-3 h-3 text-sky-200 shrink-0" />}
                        </div>
                        <span className={`text-[10px] block ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          {reg.pct} cả nước
                        </span>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className={`font-black font-mono block ${isActive ? 'text-amber-300' : 'text-blue-700'}`}>
                          {reg.kcn} KCN
                        </span>
                        <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                          {reg.factories.toLocaleString('vi-VN')} NM
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TOP TỈNH / THÀNH PHỐ DẪN ĐẦU */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] font-heading">
                TOP TỈNH THÀNH DẪN ĐẦU KCN
              </h3>
              <p className="text-[11px] text-slate-400">Nhấp vào tỉnh để định vị và mở danh sách:</p>
              
              <div className="space-y-1.5">
                {topProvincesData.map((prov, idx) => {
                  const isActive = mapActiveSelection.type === 'province' && mapActiveSelection.name === prov.name;
                  return (
                    <button 
                      key={prov.name}
                      onClick={() => handleMapSelectProvince(prov.name)}
                      className={`w-full text-left flex items-center justify-between p-2 rounded-xl border transition duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-400/30 shadow-xs'
                          : 'bg-transparent border-transparent text-slate-800 hover:bg-blue-50/70 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center font-mono ${
                          idx < 3 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <strong className={`text-xs ${isActive ? 'text-blue-900 font-black' : 'text-slate-800'}`}>
                          {prov.name}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-blue-700 font-mono block">{prov.kcn} KCN</span>
                        <span className="text-[10px] text-slate-400">{prov.factories} NM</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom 5 Regional Cards */}
        <div className="pt-4 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide font-heading">
            KHÁM PHÁ CHI TIẾT 5 VÙNG KINH TẾ TRỌNG ĐIỂM
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {vietnamMapRegions.map((reg, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition group">
                <div className="space-y-1.5">
                  <h4 className="font-black text-sm text-[#072348] group-hover:text-blue-600 transition font-heading">
                    {reg.name}
                  </h4>
                  <div className="text-[11px] font-bold text-blue-600 font-mono">
                    {reg.kcn} KCN • {reg.factories.toLocaleString('vi-VN')} Nhà máy
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {reg.desc}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    handleMapSelectRegion(reg.name);
                    const el = document.getElementById('ban-do-kcn-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 pt-2 border-t border-slate-100 uppercase tracking-wide font-heading cursor-pointer text-left"
                >
                  <span>Xem trên bản đồ</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 5. Bottom CTA Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-[#072847] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">DÀNH CHO CHỦ ĐẦU TƯ</span>
              <h3 className="text-xl font-bold font-heading mt-1">Đăng ký & Cập nhật Dữ liệu KCN</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Đưa thông tin quỹ đất, chính sách ưu đãi và hồ sơ pháp lý KCN tiếp cận trực tiếp mạng lưới hơn 10.000 nhà máy và tập đoàn FDI.
              </p>
            </div>
            <Link 
              to="/dang-ky-nha-cung-ung"
              className="self-start px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition font-heading uppercase"
            >
              Đăng ký cập nhật KCN →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wide">DÀNH CHO DOANH NGHIỆP SẢN XUẤT</span>
              <h3 className="text-xl font-bold font-heading mt-1">Tìm Nhà Máy & Thuê Đất Công Nghiệp</h3>
              <p className="text-xs text-blue-200 mt-1 leading-relaxed">
                Đăng ký nhu cầu tìm mặt bằng nhà xưởng, kết nối gia công phụ trợ hoặc tìm kiếm đối tác cung ứng trong cùng khu công nghiệp.
              </p>
            </div>
            <Link 
              to="/dang-nhu-cau"
              className="self-start px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition font-heading uppercase"
            >
              Đăng nhu cầu B2B ngay →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
