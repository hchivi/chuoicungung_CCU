import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Building2, Heart, ChevronRight, 
  RotateCcw, ArrowRight, Layers, Sparkles, Table as TableIcon,
  LayoutGrid, Map as MapIcon, ChevronLeft, Factory, ExternalLink,
  ShieldCheck, CheckCircle2, TrendingUp, Compass, Award, Check,
  Plane, Anchor, Download, Navigation, Truck, HardHat, Shirt
} from 'lucide-react';
import fullKcnFallback from '../data/industrialParksFull.json';
import InteractiveVietnamMap from '../components/InteractiveVietnamMap';
import { vietnamMapRegions } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateKcnLogistics } from '../utils/kcnLogisticsUtils';
import KcnCard from '../components/kcn/KcnCard';
import KcnAdvancedLandFilter from '../components/kcn/KcnAdvancedLandFilter';
import KcnCrossSellBanner from '../components/kcn/KcnCrossSellBanner';
import KcnSiteVisitModal from '../components/kcn/KcnSiteVisitModal';
import KcnBrochureModal from '../components/kcn/KcnBrochureModal';

export default function IndustrialParksPage() {
  const { t, lang } = useLanguage();
  const [kcnList, setKcnList] = useState(fullKcnFallback);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedAreaRange, setSelectedAreaRange] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [sortBy, setSortBy] = useState('stt-asc');

  // Modal States
  const [siteVisitModalData, setSiteVisitModalData] = useState({ isOpen: false, kcn: null, logistics: null });
  const [brochureModalData, setBrochureModalData] = useState({ isOpen: false, kcn: null, logistics: null });

  // Map Interactive States
  const [mapActiveSelection, setMapActiveSelection] = useState({ type: 'region', name: 'Toàn quốc' });
  const [mapFlyToTarget, setMapFlyToTarget] = useState(null);

  // 3 Major Economic Zones List
  const allRegionsMapList = [
    {
      name: "Toàn quốc",
      kcn: 480,
      factories: 14237,
      pct: "100%",
      desc: "Toàn cảnh mạng lưới hạ tầng và quỹ đất công nghiệp trên 34 tỉnh/thành phố Việt Nam."
    },
    {
      name: "Vùng Kinh Tế Trọng Điểm Phía Bắc",
      filterRegion: "Miền Bắc",
      kcn: 185,
      factories: 5890,
      pct: "38.5%",
      desc: "Hà Nội, Bắc Ninh, Hải Phòng, Quảng Ninh, Bắc Giang... Kết nối Sân bay Nội Bài & Cảng nước sâu Lạch Huyện."
    },
    {
      name: "Vùng Kinh Tế Trọng Điểm Miền Trung",
      filterRegion: "Miền Trung",
      kcn: 65,
      factories: 1420,
      pct: "13.5%",
      desc: "Đà Nẵng, Quảng Nam, Quảng Ngãi (Dung Quất), Bình Định... Kết nối Cảng Tiên Sa & Sân bay Đà Nẵng."
    },
    {
      name: "Vùng Kinh Tế Trọng Điểm Phía Nam & ĐBSCL",
      filterRegion: "Đông Nam Bộ",
      kcn: 230,
      factories: 6927,
      pct: "48.0%",
      desc: "TP.HCM, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu, Long An... Kết nối Cụm Cảng Cái Mép & Sân bay Long Thành."
    }
  ];

  const handleMapSelectRegion = (regItem) => {
    setMapActiveSelection({ type: 'region', name: regItem.name });
    const targetName = regItem.filterRegion || 'Toàn quốc';
    setMapFlyToTarget({ type: 'region', name: targetName, timestamp: Date.now() });
  };

  // Fetch from API fallback
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

  // Extract unique provinces
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

  // Total factories count
  const totalFactoriesCount = useMemo(() => {
    return kcnList.reduce((acc, k) => acc + (k.totalFactories || (k.factories ? k.factories.length : 0)), 0);
  }, [kcnList]);

  // Text normalizer for accent-insensitive search
  const removeAccents = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase();
  };

  // Advanced B2B Land Multi-Criteria Filtering Engine
  const filteredKCN = useMemo(() => {
    const rawQ = searchTerm.trim();
    const qClean = removeAccents(rawQ);

    const result = kcnList.filter(kcn => {
      const nameClean = removeAccents(kcn.name);
      const provClean = removeAccents(kcn.province);
      const locClean = removeAccents(kcn.location);

      const matchesSearch = !qClean || nameClean.includes(qClean) || provClean.includes(qClean) || locClean.includes(qClean);
      const matchesProvince = selectedProvince === 'all' || (kcn.province && kcn.province.toLowerCase() === selectedProvince.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || kcn.region === selectedRegion;

      // Calculate logistics & land metrics for precise filtering
      const logistics = calculateKcnLogistics(kcn);

      // Segment filter
      let matchesSegment = true;
      if (selectedSegment === 'eco') {
        matchesSegment = logistics.segment.includes('Sinh Thái');
      } else if (selectedSegment === 'hitech') {
        matchesSegment = logistics.segment.includes('Công Nghệ Cao');
      } else if (selectedSegment === 'multi') {
        matchesSegment = logistics.segment.includes('Đa Ngành');
      } else if (selectedSegment === 'ccn') {
        matchesSegment = logistics.segment.includes('Cụm Công Nghiệp');
      }

      // Ready land area filter
      let matchesArea = true;
      if (selectedAreaRange === '1-5') {
        matchesArea = logistics.readyLandHa >= 1 && logistics.readyLandHa <= 5;
      } else if (selectedAreaRange === '5-15') {
        matchesArea = logistics.readyLandHa > 5 && logistics.readyLandHa <= 15;
      } else if (selectedAreaRange === '15+') {
        matchesArea = logistics.readyLandHa > 15;
      }

      // Industry filter
      let matchesInd = true;
      if (selectedIndustry !== 'all') {
        const indMap = {
          semiconductor: 'Bán dẫn',
          mechanics: 'Cơ khí',
          garment: 'Dệt may',
          packaging: 'Bao bì',
          food: 'Thực phẩm',
          pharma: 'Dược phẩm',
          logistics: 'Logistics'
        };
        const targetKeyword = indMap[selectedIndustry] || '';
        matchesInd = logistics.priorityIndustries.some(i => i.toLowerCase().includes(targetKeyword.toLowerCase()));
      }

      return matchesSearch && matchesProvince && matchesRegion && matchesSegment && matchesArea && matchesInd;
    });

    // Sorting
    if (rawQ) {
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
      }
    }

    return result;
  }, [kcnList, searchTerm, selectedProvince, selectedRegion, selectedSegment, selectedAreaRange, selectedIndustry, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredKCN.length / pageSize) || 1;
  const paginatedKCN = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredKCN.slice(start, start + pageSize);
  }, [filteredKCN, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProvince, selectedRegion, selectedSegment, selectedAreaRange, selectedIndustry]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSegment('all');
    setSelectedAreaRange('all');
    setSelectedIndustry('all');
    setSelectedProvince('all');
    setSelectedRegion('all');
    setCurrentPage(1);
  };

  const handleOpenSiteVisit = (kcn, logistics) => {
    setSiteVisitModalData({ isOpen: true, kcn, logistics });
  };

  const handleOpenBrochure = (kcn, logistics) => {
    setBrochureModalData({ isOpen: true, kcn, logistics });
  };

  return (
    <div className="space-y-10 pb-20 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO DASHBOARD (Trung tâm Chỉ huy Vĩ mô - The Billion-Dollar Gateway)  */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Modern Industrial Photo with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/industrial_park_hero.jpg" 
            alt="Vietnam Modern Eco Industrial Parks GIS Map"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 lg:via-[#F4F8FA]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-5">
            
            {/* Breadcrumb as per Doc Requirements */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">
                {lang === 'en' ? 'Vietnam Industrial Parks & Zones Map' : 'Bản Đồ Khu Công Nghiệp & Cụm Công Nghiệp'}
              </span>
            </nav>

            {/* High-Tech Authority Tagline */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>CỔNG THÔNG TIN ĐỊA LÝ GIS & DỮ LIỆU ĐẦU TƯ VĨ MÔ QUỐC GIA</span>
            </div>

            {/* Headline as per Doc */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                Mạng Lưới Quỹ Đất &amp;
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                Hạ Tầng Công Nghiệp Việt Nam
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
              Cửa ngõ kết nối dòng vốn FDI với 480+ Khu công nghiệp, cụm công nghiệp sinh thái và toàn bộ hạ tầng logistics cảng biển, sân bay quốc tế. Tích hợp trực tiếp chuỗi cung ứng 18 Pha triển khai nhà máy.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#danh-sach-kcn"
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Khám Phá 480 KCN Quy Hoạch</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#ban-do-kcn-section"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#0052cc]" />
                <span>Bản Đồ GIS 3 Vùng Trọng Điểm</span>
              </a>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. REALTIME MACRO METRIC DASHBOARD (Đặt CHÍNH GIỮA LINE ở trên)          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            {/* Metric 1 */}
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">480+</div>
                <p className="text-[11px] text-slate-500 font-medium">Tổng KCN &amp; CCN Quy Hoạch</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">132.500+ Ha</div>
                <p className="text-[11px] text-slate-500 font-medium">Tổng Quỹ Đất Sẵn Sàng</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">85.4%</div>
                <p className="text-[11px] text-slate-500 font-medium">Tỷ Lệ Lấp Đầy Trung Bình</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">
                  {totalFactoriesCount ? totalFactoriesCount.toLocaleString('vi-VN') : '14.237+'}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Nhà Máy FDI Đang Vận Hành</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: STICKY ADVANCED LAND FILTER & KCN LISTING              */}
      {/* ========================================================================= */}
      <div id="danh-sach-kcn" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Sticky Advanced Land Filter Bar */}
        <KcnAdvancedLandFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSegment={selectedSegment}
          setSelectedSegment={setSelectedSegment}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          provinceList={provinceList}
          totalResults={filteredKCN.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onResetFilters={handleResetFilters}
        />

        {/* VIEW 1: B2B GRID CARDS VIEW (16:9 Visuals with Logistics Radar) */}
        {viewMode === 'grid' && (
          <div className="space-y-8">
            
            {filteredKCN.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 font-heading">
                  Không tìm thấy khu công nghiệp phù hợp với tiêu chí lọc.
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Vui lòng thử thay đổi khoảng diện tích, phân khúc hoặc bấm đặt lại để xem toàn bộ 480 KCN.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-50 text-[#0052cc] rounded-xl text-xs font-bold font-heading uppercase hover:bg-blue-100 transition cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <>
                {/* First 8 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginatedKCN.slice(0, 8).map((kcn) => (
                    <KcnCard
                      key={kcn.id}
                      kcn={kcn}
                      onOpenSiteVisit={handleOpenSiteVisit}
                      onOpenBrochure={handleOpenBrochure}
                    />
                  ))}
                </div>

                {/* 18-Phase Ecosystem Cross-Sell Banner Inserted Between Rows */}
                <KcnCrossSellBanner />

                {/* Remaining Cards on Current Page */}
                {paginatedKCN.length > 8 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {paginatedKCN.slice(8).map((kcn) => (
                      <KcnCard
                        key={kcn.id}
                        kcn={kcn}
                        onOpenSiteVisit={handleOpenSiteVisit}
                        onOpenBrochure={handleOpenBrochure}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Grid Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 font-mono pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
                  .map((page, idx, arr) => {
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2 text-slate-400 font-sans">...</span>}
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#0052cc] text-white shadow-xs'
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
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: TABLE VIEW (Standard Full Master Table) */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-extrabold uppercase font-heading border-b border-slate-200 text-[11px] tracking-wider whitespace-nowrap">
                    <th className="py-3.5 px-3 w-14 text-center font-mono shrink-0">STT</th>
                    <th className="py-3.5 px-5 min-w-[200px]">TÊN KHU CÔNG NGHIỆP</th>
                    <th className="py-3.5 px-4 min-w-[130px]">TỈNH THÀNH</th>
                    <th className="py-3.5 px-4 min-w-[160px]">LOGISTICS CẢNG / SÂN BAY</th>
                    <th className="py-3.5 px-4 text-center min-w-[120px]">SỐ NHÀ MÁY</th>
                    <th className="py-3.5 px-4 text-right min-w-[160px] shrink-0">HÀNH ĐỘNG</th>
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
                    paginatedKCN.map((kcn, idx) => {
                      const logistics = calculateKcnLogistics(kcn);
                      return (
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
                              className="font-bold text-slate-900 group-hover:text-[#0052cc] transition flex items-center space-x-1.5"
                            >
                              <span>{kcn.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-[#0052cc] shrink-0" />
                            </Link>
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                              {logistics.segment}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-700 flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{kcn.province}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                            <div>✈️ {logistics.airport.code} ({logistics.airport.distanceKm}km)</div>
                            <div>🚢 Cảng ({logistics.seaport.distanceKm}km)</div>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-bold border border-slate-200 whitespace-nowrap">
                              <Factory className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                              <span>{kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0)} NM</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap shrink-0 space-x-1.5">
                            <button
                              onClick={() => handleOpenSiteVisit(kcn, logistics)}
                              className="px-2.5 py-1 bg-gradient-to-r from-[#003d8f] to-[#0052cc] text-white rounded-lg text-xs font-bold transition font-heading uppercase cursor-pointer"
                            >
                              Thực địa
                            </button>
                            <Link
                              to={`/khu-cong-nghiep/${kcn.id}`}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition font-heading uppercase inline-block cursor-pointer"
                            >
                              Chi tiết
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-slate-500 font-medium">
                Đang xem <strong className="text-slate-900">{(currentPage - 1) * pageSize + 1}</strong> đến{' '}
                <strong className="text-slate-900">{Math.min(currentPage * pageSize, filteredKCN.length)}</strong> trong tổng số{' '}
                <strong className="text-[#0052cc] font-bold">{filteredKCN.length}</strong> KCN
              </div>

              <div className="flex items-center space-x-1 font-mono">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
                  .map((page, idx, arr) => {
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2 text-slate-400 font-sans">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#0052cc] text-white shadow-xs'
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
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE GIS MAP SECTION (3 VÙNG KINH TẾ TRỌNG ĐIỂM)                */}
      {/* ========================================================================= */}
      <section id="ban-do-kcn-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-10 border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[11px] font-extrabold rounded-full uppercase tracking-wider font-heading">
                Bản đồ số GIS Quốc Gia
              </span>
              <span className="text-xs text-slate-400 font-medium">Định tuyến Logistics Cảng &amp; Sân bay</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072348] font-heading uppercase tracking-tight mt-2">
              Bản Đồ Quy Hoạch Vùng &amp; Quỹ Đất 3 Miền
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Sa bàn địa lý tương tác phân chia 3 Vùng Kinh Tế Trọng Điểm (Bắc - Trung - Nam). Tự động tính toán cự ly đến Cảng biển nước sâu và Sân bay quốc tế.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              to="/ban-do-so"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl font-bold text-xs shadow-md transition font-heading uppercase cursor-pointer"
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
            
            {/* THỐNG KÊ 3 VÙNG KINH TẾ TRỌNG ĐIỂM */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] font-heading">
                  3 VÙNG KINH TẾ TRỌNG ĐIỂM
                </h3>
                <span className="text-[10px] font-bold text-[#0052cc] font-mono bg-blue-50 px-2 py-0.5 rounded-md">
                  480 KCN
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Nhấp vào vùng để tự động phóng to (Zoom in) trên sa bàn:</p>
              
              <div className="space-y-2">
                {allRegionsMapList.map(reg => {
                  const isActive = mapActiveSelection.type === 'region' && mapActiveSelection.name === reg.name;
                  return (
                    <button
                      key={reg.name}
                      onClick={() => handleMapSelectRegion(reg)}
                      className={`w-full text-left flex flex-col justify-between p-3 rounded-2xl border transition duration-200 cursor-pointer space-y-2 ${
                        isActive 
                          ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-md ring-2 ring-blue-400/40' 
                          : 'bg-slate-50/90 border-slate-200/70 text-slate-800 hover:bg-blue-50/80 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className={`block text-xs font-heading ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {reg.name}
                          </strong>
                          <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                            Chiếm {reg.pct} quỹ đất KCN
                          </span>
                        </div>
                        <span className={`font-black font-mono text-xs ${isActive ? 'text-amber-300' : 'text-[#0052cc]'}`}>
                          {reg.kcn} KCN
                        </span>
                      </div>
                      <p className={`text-[10.5px] leading-snug ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {reg.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK ACTIONS FOR INVESTORS */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-amber-300">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-extrabold uppercase font-heading text-xs">Cổng Hỗ Trợ FDI 24/7</h4>
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed">
                Hỗ trợ trọn gói thủ tục thẩm định giấy phép IRC, ERC, ĐTM Môi Trường và PCCC theo tiêu chuẩn Nghị định 35/2022/NĐ-CP.
              </p>
              <Link
                to="/dang-nhu-cau"
                className="block w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-center font-bold font-heading uppercase text-xs transition shadow-sm"
              >
                Đăng Ký Khảo Sát Quỹ Đất
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. MODALS                                                                 */}
      {/* ========================================================================= */}
      <KcnSiteVisitModal
        isOpen={siteVisitModalData.isOpen}
        onClose={() => setSiteVisitModalData({ isOpen: false, kcn: null, logistics: null })}
        kcn={siteVisitModalData.kcn}
        logisticsInfo={siteVisitModalData.logistics}
      />

      <KcnBrochureModal
        isOpen={brochureModalData.isOpen}
        onClose={() => setBrochureModalData({ isOpen: false, kcn: null, logistics: null })}
        kcn={brochureModalData.kcn}
        logisticsInfo={brochureModalData.logistics}
      />

    </div>
  );
}
