import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Building2, Heart, ChevronRight, 
  RotateCcw, ArrowRight, Layers, Sparkles, Table as TableIcon,
  LayoutGrid, Map as MapIcon, ChevronLeft, Factory, ExternalLink,
  ShieldCheck, CheckCircle2, TrendingUp, Compass, Award, Check,
  Plane, Anchor, Download, Navigation, Truck, HardHat, Shirt,
  Target, Rocket, Handshake, BookOpen, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getAllIndustrialParks, 
  getIndustrialParksListing,
  getProgramsForKcn
} from '../data/industrialParksData';
import { getAllPrograms } from '../data/programsData';
import InteractiveVietnamMap from '../components/InteractiveVietnamMap';
import KcnGisMap from '../components/kcn/KcnGisMap';
import KcnCard from '../components/kcn/KcnCard';
import KcnAdvancedLandFilter from '../components/kcn/KcnAdvancedLandFilter';
import KcnCrossSellBanner from '../components/kcn/KcnCrossSellBanner';

export default function IndustrialParksPage() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Master KCN List from data engine
  const allKcns = useMemo(() => getAllIndustrialParks(), []);

  // Filter States (Section 6, 7)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('province') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || 'all');
  const [quickFilters, setQuickFilters] = useState({
    hasPublicFactories: false,
    hasPublicRequirements: false,
    hasActivePrograms: false,
    hasSupplierCoverage: false,
    hasCatalogue: false
  });

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [sortBy, setSortBy] = useState('ecosystem'); // 'ecosystem' | 'name-asc' | 'factories-desc'

  // Map Interactive States (Section 23)
  const [mapActiveSelection, setMapActiveSelection] = useState({ type: 'region', name: 'Toàn quốc' });
  const [mapFlyToTarget, setMapFlyToTarget] = useState(null);

  // 3 Major Economic Zones List
  const allRegionsMapList = [
    {
      name: "Toàn quốc",
      kcn: 480,
      factories: 14237,
      pct: "100%",
      desc: "Toàn cảnh mạng lưới 480+ khu công nghiệp và hệ sinh thái doanh nghiệp tại 63 tỉnh/thành phố."
    },
    {
      name: "Vùng Kinh Tế Trọng Điểm Phía Bắc",
      filterRegion: "Miền Bắc",
      kcn: 185,
      factories: 5890,
      pct: "38.5%",
      desc: "Hà Nội, Bắc Ninh, Hải Phòng, Quảng Ninh, Bắc Giang... Trọng điểm bán dẫn, điện tử và công nghệ cao."
    },
    {
      name: "Vùng Kinh Tế Trọng Điểm Miền Trung",
      filterRegion: "Miền Trung",
      kcn: 65,
      factories: 1420,
      pct: "13.5%",
      desc: "Đà Nẵng, Quảng Nam (Chu Lai), Quảng Ngãi (Dung Quất)... Trung tâm cơ khí, ô tô và logistics."
    },
    {
      name: "Vùng Kinh Tế Trọng Điểm Phía Nam & ĐBSCL",
      filterRegion: "Đông Nam Bộ",
      kcn: 230,
      factories: 6927,
      pct: "48.0%",
      desc: "TP.HCM, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu, Long An... Cụm công nghiệp chế tạo lớn nhất cả nước."
    }
  ];

  // Extract unique provinces with counts
  const provinceList = useMemo(() => {
    const counts = {};
    allKcns.forEach(k => {
      if (k.province) {
        counts[k.province] = (counts[k.province] || 0) + 1;
      }
    });
    return Object.keys(counts).sort().map(p => ({
      name: p,
      count: counts[p]
    }));
  }, [allKcns]);

  // Query results from master IndustrialParks data engine (Section 6, 7, 26)
  const listingResult = useMemo(() => {
    return getIndustrialParksListing({
      query: searchTerm,
      province: selectedProvince,
      region: selectedRegion,
      industry: selectedIndustry,
      hasPublicFactories: quickFilters.hasPublicFactories,
      hasPublicRequirements: quickFilters.hasPublicRequirements,
      hasActivePrograms: quickFilters.hasActivePrograms,
      hasSupplierCoverage: quickFilters.hasSupplierCoverage,
      hasCatalogue: quickFilters.hasCatalogue,
      page: currentPage,
      pageSize,
      sortBy
    });
  }, [searchTerm, selectedProvince, selectedRegion, selectedIndustry, quickFilters, currentPage, pageSize, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProvince, selectedRegion, selectedIndustry, quickFilters]);

  // Featured Programs at KCNs (Section 16 & 17)
  const featuredKcnPrograms = useMemo(() => {
    const allProgs = getAllPrograms();
    return allProgs.filter(p => p.industrialParkId || (p.location && p.location.includes('KCN'))).slice(0, 6);
  }, []);

  // SEO & Structured Data (Section 39, 40)
  useEffect(() => {
    document.title = 'Danh bạ khu công nghiệp | CHUOICUNGUNG.COM';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Khám phá khu công nghiệp theo địa bàn, nhà máy, nhóm ngành, nhu cầu, nhà cung ứng phục vụ khu vực và chương trình kết nối doanh nghiệp.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://chuoicungung.com/khu-cong-nghiep';

    // Structured Data JSON-LD (Section 40)
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'kcn-listing-structured-data';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://chuoicungung.com/khu-cong-nghiep#collection',
          'name': 'Khu Công Nghiệp & Hệ Sinh Thái Doanh Nghiệp',
          'url': 'https://chuoicungung.com/khu-cong-nghiep',
          'description': 'Khám phá khu công nghiệp theo địa bàn, nhà máy, nhóm ngành, nhu cầu, nhà cung ứng phục vụ khu vực và chương trình kết nối doanh nghiệp.'
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Trang chủ',
              'item': 'https://chuoicungung.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Khu công nghiệp & Địa bàn',
              'item': 'https://chuoicungung.com/khu-cong-nghiep'
            }
          ]
        }
      ]
    });

    const oldSchema = document.getElementById('kcn-listing-structured-data');
    if (oldSchema) oldSchema.remove();
    document.head.appendChild(schemaScript);

    return () => {
      const toRemove = document.getElementById('kcn-listing-structured-data');
      if (toRemove) toRemove.remove();
    };
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('all');
    setSelectedRegion('all');
    setSelectedIndustry('all');
    setQuickFilters({
      hasPublicFactories: false,
      hasPublicRequirements: false,
      hasActivePrograms: false,
      hasSupplierCoverage: false,
      hasCatalogue: false
    });
    setCurrentPage(1);
  };

  const handleMapSelectRegion = (regItem) => {
    setMapActiveSelection({ type: 'region', name: regItem.name });
    const targetName = regItem.filterRegion || 'Toàn quốc';
    setMapFlyToTarget({ type: 'region', name: targetName, timestamp: Date.now() });
  };

  return (
    <main className="space-y-10 pb-24 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (MATCHES IMAGE 2 LAYOUT & TEXT HIERARCHY)                */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        
        {/* Right Half Modern Industrial Video with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            poster="/images/industrial_park_hero.jpg"
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
          >
            <source src="/images/industrial_drone_flycam.webm" type="video/webm" />
            <source src="/images/industrial_drone_flycam_480p.webm" type="video/webm" />
            <img 
              src="/images/industrial_park_hero.jpg" 
              alt="Tìm khu công nghiệp phù hợp"
              className="w-full h-full object-cover object-center scale-105"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Content Container Aligned Exactly with Image 2 */}
        <div className="w-[min(1280px,calc(100%-48px))] mx-auto relative z-10 w-full py-8 sm:py-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn trang">
            <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-900 font-medium" aria-current="page">Khu công nghiệp &amp; Địa bàn</span>
          </nav>

          <div className="max-w-xl">
            
            {/* Category Label */}
            <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
              Hạ tầng &amp; Hệ sinh thái công nghiệp
            </p>

            {/* H1 Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
              Quy hoạch KCN<br />hệ sinh thái địa bàn.
            </h1>

            {/* Lede (Tagline) */}
            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
              Đúng địa bàn đầu tư.<br />Rõ liên kết hạ tầng.
            </p>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
              Khám phá nhà máy, nhu cầu, nguồn cung và chương trình kết nối theo từng khu công nghiệp và địa bàn. Dữ liệu chuẩn hóa hỗ trợ xúc tiến và hợp tác chuỗi cung ứng.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#danh-sach-kcn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95"
              >
                <span>Lọc khu công nghiệp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#ban-do-kcn"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Xem bản đồ KCN</span>
              </a>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. ECOSYSTEM MACRO METRIC BANNER (Section 8, 9 - Không số liệu BĐS)       */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            {/* Metric 1: KCN */}
            <div className="p-2 sm:p-3 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc]"></span>
                <span>QUY HOẠCH QUỐC GIA</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">480+</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Khu Công Nghiệp &amp; Cụm CN</p>
            </div>

            {/* Metric 2: Nhà máy FDI & Sản xuất */}
            <div className="p-2 sm:p-3 pt-4 sm:pt-3 sm:pl-6 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>XÁC THỰC HOẠT ĐỘNG</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">14.237+</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Nhà Máy Hoạt Động Xác Thực</p>
            </div>

            {/* Metric 3: Nhu cầu mở */}
            <div className="p-2 sm:p-3 pt-4 sm:pt-3 sm:pl-6 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>BÀI TOÁN BÊN MUA</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">100+</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Nhu Cầu Mua Hàng &amp; Bài Toán KCN</p>
            </div>

            {/* Metric 4: Chương trình kết nối */}
            <div className="p-2 sm:p-3 pt-4 sm:pt-3 sm:pl-6 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                <span>XÚC TIẾN THƯƠNG MẠI</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">11+</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Chương Trình Kết Nối Địa Bàn</p>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: SEARCH, MULTI-FACET FILTER & KCN LISTING              */}
      {/* ========================================================================= */}
      <div id="danh-sach-kcn" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Sticky Ecosystem Filter Bar (Section 6, 7) */}
        <KcnAdvancedLandFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          provinceList={provinceList}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          quickFilters={quickFilters}
          setQuickFilters={setQuickFilters}
          totalResults={listingResult.total}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onResetFilters={handleResetFilters}
        />

        {/* VIEW 1: B2B GRID CARDS VIEW (Section 8 & 9) */}
        {viewMode === 'grid' && (
          <div className="space-y-8">
            
            {listingResult.total === 0 ? (
              /* Empty State (Section 41) */
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 font-heading">
                    Chưa tìm thấy khu công nghiệp phù hợp với bộ lọc này.
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Vui lòng thử mở rộng tìm kiếm theo tỉnh/thành lân cận hoặc bấm đặt lại bộ lọc.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    XÓA BỘ LỌC
                  </button>
                  <Link
                    to="/dang-nhu-cau"
                    className="px-4 py-2 bg-[#0052cc] hover:bg-[#003d8f] text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    GỬI NHU CẦU DOANH NGHIỆP
                  </Link>
                  <Link
                    to="/dich-vu/to-chuc-ket-noi?source=industrial-park"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    ĐỀ XUẤT CHƯƠNG TRÌNH
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {listingResult.data.map((kcn) => (
                    <KcnCard
                      key={kcn.id}
                      kcn={kcn}
                    />
                  ))}
                </div>

                {/* 18-Phase Ecosystem Cross-Sell Banner */}
                <KcnCrossSellBanner />
              </>
            )}

            {/* Grid Pagination */}
            {listingResult.totalPages > 1 && (
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

                {Array.from({ length: listingResult.totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === listingResult.totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
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
                  disabled={currentPage === listingResult.totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(listingResult.totalPages, prev + 1));
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

        {/* VIEW 2: TABLE VIEW (Section 8 Master Table) */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-extrabold uppercase font-heading border-b border-slate-200 text-[11px] tracking-wider whitespace-nowrap">
                    <th className="py-3.5 px-3 w-14 text-center font-mono shrink-0">STT</th>
                    <th className="py-3.5 px-5 min-w-[220px]">TÊN KHU CÔNG NGHIỆP</th>
                    <th className="py-3.5 px-4 min-w-[130px]">TỈNH THÀNH</th>
                    <th className="py-3.5 px-4 text-center min-w-[110px]">NHÀ MÁY</th>
                    <th className="py-3.5 px-4 text-center min-w-[120px]">NHU CẦU MỞ</th>
                    <th className="py-3.5 px-4 min-w-[160px]">CHƯƠNG TRÌNH KCN</th>
                    <th className="py-3.5 px-4 text-right min-w-[160px] shrink-0">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listingResult.total === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Chưa tìm thấy khu công nghiệp phù hợp với bộ lọc này.
                      </td>
                    </tr>
                  ) : (
                    listingResult.data.map((kcn, idx) => {
                      return (
                        <tr 
                          key={kcn.id || idx}
                          className="hover:bg-blue-50/40 transition group cursor-pointer"
                        >
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-500 whitespace-nowrap">
                            {(currentPage - 1) * pageSize + idx + 1}
                          </td>
                          <td className="py-3.5 px-5">
                            <Link 
                              to={`/khu-cong-nghiep/${kcn.id}`}
                              className="font-bold text-slate-900 group-hover:text-[#0052cc] transition flex items-center space-x-1.5"
                            >
                              <span>{kcn.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-[#0052cc] shrink-0" />
                            </Link>
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium truncate">
                              {(kcn.primaryIndustries || []).slice(0, 3).join(' • ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-700 flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{kcn.province}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-bold border border-slate-200">
                              <Factory className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                              <span>{kcn.publicFactoriesCount} NM</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                              kcn.publicNeedsCount > 0 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Target className="w-3 h-3 mr-1 text-amber-600 shrink-0" />
                              <span>{kcn.publicNeedsCount} Nhu cầu</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                            {kcn.programsCount > 0 ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded border border-emerald-200 text-[10.5px] flex items-center space-x-1 w-fit">
                                <Rocket className="w-3 h-3 text-emerald-600" />
                                <span>{kcn.programsCount} Chương trình</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Đang mở sourcing</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap shrink-0 space-x-1.5">
                            <Link
                              to={`/dang-nhu-cau?industrialParkId=${kcn.id}`}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition font-heading inline-block cursor-pointer"
                            >
                              Gửi nhu cầu
                            </Link>
                            <Link
                              to={`/khu-cong-nghiep/${kcn.id}`}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition font-heading inline-block cursor-pointer"
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
                <strong className="text-slate-900">{Math.min(currentPage * pageSize, listingResult.total)}</strong> trong tổng số{' '}
                <strong className="text-[#0052cc] font-bold">{listingResult.total}</strong> KCN
              </div>

              <div className="flex items-center space-x-1 font-mono">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: listingResult.totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === listingResult.totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
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
                  disabled={currentPage === listingResult.totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(listingResult.totalPages, prev + 1))}
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
      {/* 4. SECTION 18: CHƯƠNG TRÌNH & DỊCH VỤ HỖ TRỢ THEO ĐỊA BÀN                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
              SECTION 18 • DỊCH VỤ HỆ SINH THÁI
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              CHƯƠNG TRÌNH & DỊCH VỤ HỖ TRỢ DOANH NGHIỆP THEO ĐỊA BÀN
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Các gói giải pháp kết nối trực tiếp nguồn cung cấp địa phương với nhà máy FDI và ban quản lý KCN.
            </p>
          </div>

          <Link
            to="/dich-vu/to-chuc-ket-noi?source=industrial-park"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-md shrink-0 font-heading"
          >
            <Handshake className="w-4 h-4" />
            <span>Đề xuất chương trình tại KCN</span>
          </Link>
        </div>

        {/* 5 Blocks (Section 18) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Service 1 */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition shadow-xs flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">01 / SOURCING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                Ngày Hội Chuỗi Cung Ứng KCN
              </h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Tổ chức phiên kết nối trực tiếp (Sourcing Day) theo cụm KCN trọng điểm nhằm thu hút NCC nội địa.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition shadow-xs flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">02 / MATCHING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-blue-700 transition">
                Buyer–Supplier Matchmaking 1:1
              </h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Ghép nối phiên làm việc riêng tư giữa phòng mua hàng nhà máy FDI với nhà cung ứng đạt chuẩn.
              </p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition shadow-xs flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">03 / AUDIT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-amber-700 transition">
                Sourcing Theo Nhu Cầu Kỹ Thuật
              </h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Định vị và thẩm định xưởng gia công cơ khí, bao bì, tự động hóa phục vụ trực tiếp cho nhà máy.
              </p>
            </div>
          </div>

          {/* Service 4 */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition shadow-xs flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">04 / PROFILE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-purple-700 transition">
                Kỷ Yếu Năng Lực &amp; Catalogue
              </h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Xuất bản danh bạ năng lực nhà cung ứng công nghiệp phụ trợ theo từng phân khu và địa phương.
              </p>
            </div>
          </div>

          {/* Service 5 */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition shadow-xs flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">05 / ECOSYSTEM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-teal-700 transition">
                Liên Kết BQL &amp; Chủ Đầu Tư
              </h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Phối hợp Ban Quản Lý Khu Kinh Tế / Ban Quản Lý KCN triển khai đề án gia tăng tỷ lệ nội địa hóa.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 16: CHƯƠNG TRÌNH TẠI CÁC KHU VỰC CÔNG NGHIỆP                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10.5px] font-bold rounded-md font-mono">
              SECTION 16 • LIÊN KẾT ĐỊA BÀN
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              CHƯƠNG TRÌNH TẠI CÁC KHU VỰC CÔNG NGHIỆP
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Các chương trình giao thương chuỗi cung ứng diễn ra thực địa tại các cụm KCN trọng điểm.
            </p>
          </div>

          <Link
            to="/chuong-trinh"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-sm shrink-0 font-heading"
          >
            <span>Xem tất cả chương trình</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Programs Grid (Reuse Page 20 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredKcnPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-400 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={prog.coverImage || '/stage1_hero.jpg'}
                    alt={prog.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 bg-slate-900/85 backdrop-blur-md text-amber-300 font-mono text-[10.5px] font-bold rounded-lg border border-amber-400/30">
                      {prog.dates || 'Tháng 10/2026'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-bold rounded font-mono">
                    ĐỊA BÀN KCN LIÊN KẾT
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                    {prog.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center space-x-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{prog.location}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10.5px] font-semibold text-slate-500 truncate">
                  {prog.organizerName || 'CHUOICUNGUNG.COM'}
                </span>
                <Link
                  to={`/chuong-trinh/${prog.slug || prog.id}`}
                  className="px-3.5 py-1.5 bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-2xs shrink-0"
                >
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE GIS MAP SECTION (Section 23 - Không làm blocker)           */}
      {/* ========================================================================= */}
      <section id="ban-do-kcn" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6 border-t border-slate-200">
        
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
              Sa bàn địa lý tương tác phân chia 3 Vùng Kinh Tế Trọng Điểm (Bắc - Trung - Nam).
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

        {/* 2-Column Map Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main GIS Leaflet Map */}
          <div className="lg:col-span-8 xl:col-span-9 h-full min-h-[750px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <KcnGisMap 
              height="100%" 
              externalFlyTo={mapFlyToTarget}
            />
          </div>

          {/* Right Regional Analytics */}
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
              <p className="text-[11px] text-slate-400">Nhấp vào vùng để tự động phóng to trên sa bàn:</p>
              
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
                <h4 className="font-extrabold uppercase font-heading text-xs">Cổng Hỗ Trợ FDI &amp; KCN 24/7</h4>
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed">
                Hỗ trợ trọn gói kết nối nhà máy FDI, nhà thầu xây dựng công nghiệp và chuỗi cung ứng vật tư theo địa bàn.
              </p>
              <Link
                to="/dang-nhu-cau"
                className="block w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-center font-bold font-heading uppercase text-xs transition shadow-sm"
              >
                Gửi Nhu Cầu Tìm Nguồn Cung
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CTA SECTION (SECTION 19 & 20 SPEC 26.TXT)                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-br from-slate-900 via-[#0B3558] to-slate-950 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl space-y-5 border border-slate-700 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="px-2.5 py-0.5 bg-yellow-400 text-slate-950 text-[10px] font-black rounded-md font-mono uppercase tracking-wider">
              KẾT NỐI HỆ SINH THÁI DOANH NGHIỆP KCN
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading">
              Bạn là Nhà máy hoặc Đơn vị Quản lý / Vận hành KCN?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gửi bài toán mua hàng của nhà máy, đề xuất tổ chức ngày hội kết nối chuỗi cung ứng hoặc đăng ký tham gia mạng lưới nhà cung ứng phục vụ KCN trên toàn quốc.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dang-nhu-cau"
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-md font-heading flex items-center space-x-1.5"
              >
                <Target className="w-4 h-4" />
                <span>GỬI NHU CẦU MUA HÀNG</span>
              </Link>
              <Link
                to="/dich-vu/to-chuc-ket-noi?source=industrial-park"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md font-heading flex items-center space-x-1.5"
              >
                <Handshake className="w-4 h-4" />
                <span>ĐỀ XUẤT CHƯƠNG TRÌNH TẠI KCN</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
