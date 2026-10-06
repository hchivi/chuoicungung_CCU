// ============================================================================
// PAGE 28: DANH SÁCH NHÀ MÁY & DOANH NGHIỆP SẢN XUẤT
// ROUTE: /nha-may
// TUÂN THỦ TOÀN DIỆN SPEC 28.TXT - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Factory, Search, Filter, MapPin, Building2, CheckCircle2, 
  ShoppingBag, Zap, Calendar, ArrowRight, ChevronRight, RotateCcw,
  Sparkles, Layers, ShieldCheck, Globe, Handshake, Bot, HelpCircle,
  ExternalLink, Package, ArrowUpRight, Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FactoryCard from '../components/factories/FactoryCard';
import { 
  getFactoriesListing,
  getProgramsForFactory
} from '../data/factoriesData';
import { getAllMasterRequirements } from '../data/requirementsData';
import { getAllIndustrialParks } from '../data/industrialParksData';

export default function FactoriesPage() {
  const { lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter States (Section 6 & 7)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || 'all');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('province') || 'all');
  const [selectedKcn, setSelectedKcn] = useState(searchParams.get('kcn') || 'all');
  
  // Quick Filter Chips (Section 7)
  const [hasPublicRequirements, setHasPublicRequirements] = useState(false);
  const [hasSupplierCapability, setHasSupplierCapability] = useState(false);
  const [hasOutputProducts, setHasOutputProducts] = useState(false);
  const [oemAvailable, setOemAvailable] = useState(false);
  const [exportAvailable, setExportAvailable] = useState(false);

  // Sorting & Pagination
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;

  // Master Reference Data
  const allKcns = useMemo(() => getAllIndustrialParks(), []);
  const publicRequirements = useMemo(() => {
    return getAllMasterRequirements()
      .filter(r => r.isPublicSummary === true && r.status !== 'CLOSED')
      .slice(0, 4);
  }, []);

  const factoryPrograms = useMemo(() => {
    return getProgramsForFactory().slice(0, 4);
  }, []);

  // Top provinces with high factory density
  const topProvinces = [
    'Đồng Nai', 'Bình Dương', 'Bắc Ninh', 'Hải Phòng', 'Hồ Chí Minh', 
    'Hà Nội', 'Long An', 'Vĩnh Phúc', 'Quảng Nam', 'Bà Rịa - Vũng Tàu'
  ];

  // Top industries
  const topIndustries = [
    'Cơ khí chính xác & Đột dập',
    'Điện & Điện tử',
    'Chế biến thực phẩm & Đồ uống',
    'Bao bì carton & Màng nhựa',
    'Dệt may & Da giày',
    'Hóa chất & Nhựa kỹ thuật',
    'Công nghiệp phụ trợ ô tô'
  ];

  // Query Listing Engine
  const listingData = useMemo(() => {
    return getFactoriesListing({
      query: searchQuery,
      industry: selectedIndustry,
      province: selectedProvince,
      industrialParkId: selectedKcn,
      hasPublicRequirements,
      hasSupplierCapability,
      hasOutputProducts,
      oemAvailable,
      exportAvailable,
      page: currentPage,
      pageSize,
      sortBy
    });
  }, [
    searchQuery, selectedIndustry, selectedProvince, selectedKcn,
    hasPublicRequirements, hasSupplierCapability, hasOutputProducts,
    oemAvailable, exportAvailable, currentPage, sortBy
  ]);

  // SEO & Head Metadata (Section 43 & 44)
  useEffect(() => {
    document.title = 'Danh bạ nhà máy | CHUOICUNGUNG.COM';
    
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'description';
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute(
      'content',
      'Danh bạ các nhà máy sản xuất, cơ sở chế tạo công nghiệp và khu vực phụ trợ tại Việt Nam. Tìm kiếm theo ngành nghề, khu công nghiệp, địa bàn và gửi yêu cầu kết nối.'
    );

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', 'https://chuoicungung.com/nha-may');

    // JSON-LD Schema (Section 44)
    const scriptId = 'factories-page-schema';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Nhà Máy & Doanh Nghiệp Sản Xuất',
      'url': 'https://chuoicungung.com/nha-may',
      'description': 'Khám phá mạng lưới nhà máy sản xuất, nhu cầu thu mua và năng lực gia công OEM trong chuỗi cung ứng công nghiệp Việt Nam.',
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': listingData.total,
        'itemListElement': listingData.items.slice(0, 10).map((fac, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'item': {
            '@type': 'Organization',
            'name': fac.name,
            'address': fac.address,
            'url': `https://chuoicungung.com/nha-may/${fac.slug || fac.id}`
          }
        }))
      }
    };

    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [listingData.total, listingData.items]);

  // Reset Filters Handler (Section 45)
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSelectedProvince('all');
    setSelectedKcn('all');
    setHasPublicRequirements(false);
    setHasSupplierCapability(false);
    setHasOutputProducts(false);
    setOemAvailable(false);
    setExportAvailable(false);
    setCurrentPage(1);
    setSortBy('relevance');
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 font-sans text-slate-800">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (MATCHES IMAGE 2 LAYOUT & TEXT HIERARCHY)                */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        
        {/* Right Half Smart Factory & Illuminated Industrial Park Flycam Video with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            poster="/images/smart_factory_hero.jpg"
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
          >
            <source src="/images/factory_illuminated_drone_1080p.webm" type="video/webm" />
            <source src="/images/factory_illuminated_drone_480p.webm" type="video/webm" />
            <img 
              src="/images/smart_factory_hero.jpg" 
              alt="Vietnam Smart Manufacturing Plant Flycam"
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
            <span className="text-slate-900 font-medium" aria-current="page">Nhà máy &amp; Cơ sở sản xuất</span>
          </nav>

          <div className="max-w-xl">
            
            {/* Category Label */}
            <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
              Hệ thống dữ liệu nhà máy &amp; FDI Việt Nam
            </p>

            {/* H1 Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
              Mạng lưới nhà máy<br />cơ sở sản xuất.
            </h1>

            {/* Lede (Tagline) */}
            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
              Đúng năng lực chế tạo.<br />Rõ quy mô để hợp tác.
            </p>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
              Tra cứu danh sách 14.237+ nhà máy sản xuất, cơ sở chế tạo và doanh nghiệp FDI đang hoạt động thực tế trong 480 Khu công nghiệp trên toàn quốc.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#factory-list-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95"
              >
                <span>Tra cứu nhà máy</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/dang-nhu-cau"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2"
              >
                <span>Nhu cầu cung ứng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* STATS BAR (EXACT 4 STAT CARDS FROM IMAGE 4) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="p-2 sm:p-3 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>XÁC THỰC MÃ SỐ THUẾ</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">14.237+</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Nhà máy đang hoạt động</p>
            </div>

            <div className="p-2 sm:p-3 pt-4 sm:pt-3 sm:pl-6 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc]"></span>
                <span>HẠ TẦNG KCN TOÀN QUỐC</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">480 KCN</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Khu công nghiệp kết nối</p>
            </div>

            <div className="p-2 sm:p-3 pt-4 sm:pt-3 sm:pl-6 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>ĐỊA BÀN TRỌNG ĐIỂM</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">34</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Tỉnh thành toàn quốc</p>
            </div>

            <div className="p-2 sm:p-3 pt-4 sm:pt-3 sm:pl-6 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>KẾT NỐI KHÔNG TRUNG GIAN</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1">FDI &amp; B2B</div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Nhu cầu mở kết nối</p>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-8">

        {/* ===================================================================== */}
        {/* 2. GIẢI THÍCH 2 VAI TRÒ: MUA VS BÁN (SECTION 5 SPEC 28.TXT) */}
        {/* ===================================================================== */}
        <section 
          aria-label="Two Factory Roles Explanation"
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4"
        >
          <div className="space-y-1 text-center max-w-2xl mx-auto">
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
              SECTION 5 • ĐẶC TRƯNG HỆ THỐNG
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              NHÀ MÁY CÓ THỂ VỪA MUA — VỪA BÁN
            </h2>
            <p className="text-xs text-slate-500">
              Cùng một doanh nghiệp, hệ thống quản lý linh hoạt cả chiều thu mua nguyên liệu phụ trợ và chiều cung ứng sản phẩm đầu ra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Card 01: Nhà Máy Mua (Buy Side) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/60 to-slate-50 border border-blue-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0052cc] font-mono text-[10px] font-bold">BUY SIDE</span>
                  <h3 className="font-black text-slate-900 text-base font-heading">
                    1. NHÀ MÁY MUA (BUY SIDE)
                  </h3>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Thu mua nguyên vật liệu &amp; dịch vụ vận hành</div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Nhà máy cần nguồn cung: nguyên vật liệu kim loại/nhựa, bao bì carton, thiết bị bảo hộ PPE, 
                  suất ăn công nghiệp, dịch vụ kho bãi logistics, cơ điện M&E và bảo trì máy móc.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-white border border-blue-200 font-medium">Bảo trì & M&E</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-blue-200 font-medium">Đồng phục & PPE</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-blue-200 font-medium">Bao bì Carton</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-blue-200 font-medium">Logistics KCN</span>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-200/60">
                <Link
                  to="/dang-nhu-cau?role=factory"
                  className="w-full py-2.5 bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 font-heading shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ĐĂNG NHU CẦU TÌM NGUỒN CUNG</span>
                </Link>
              </div>
            </div>

            {/* Card 02: Nhà Máy Bán (Sell Side) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-slate-50 border border-emerald-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">SELL SIDE</span>
                  <h3 className="font-black text-slate-900 text-base font-heading">
                    2. NHÀ MÁY BÁN (SELL SIDE)
                  </h3>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Giới thiệu sản phẩm &amp; nhận gia công OEM</div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Nhà máy cung ứng: năng lực sản xuất máy móc CNC, gia công đúc ép dập, sản phẩm đầu ra đã hoàn thiện, 
                  nhận hợp đồng OEM/ODM cho các đối tác FDI, xuất khẩu và mở rộng mạng lưới phân phối.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-medium">Gia công OEM/ODM</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-medium">Xuất khẩu EU/US</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-medium">Phân phối sỉ</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-medium">Đạt chuẩn ISO</span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200/60">
                <Link
                  to="/tao-ho-so?role=factory&intent=supplier-capability"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 font-heading shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>GIỚI THIỆU NĂNG LỰC SẢN XUẤT</span>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. SEARCH & MULTI-FACET FILTER ENGINE (SECTIONS 6 & 7) */}
        {/* ===================================================================== */}
        {/* 2. SEARCH & FILTER PANEL (SECTION 6 & 7 SPEC 28.TXT) */}
        {/* ===================================================================== */}
        <section id="factory-list-section" aria-label="Search and Filter Factories" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          
          {/* Main Search Input & Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input (Section 6) */}
            <div className="relative lg:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <label htmlFor="factory-search-query" className="sr-only">Tìm nhà máy, sản phẩm, ngành...</label>
              <input
                id="factory-search-query"
                type="text"
                placeholder="Tìm nhà máy, sản phẩm, ngành..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            {/* Industry Selector */}
            <div>
              <label htmlFor="factory-industry-select" className="sr-only">Ngành sản xuất</label>
              <select
                id="factory-industry-select"
                aria-label="Ngành sản xuất"
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
              >
                <option value="all">Tất cả ngành sản xuất</option>
                {topIndustries.map((ind, idx) => (
                  <option key={idx} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Province Selector */}
            <div>
              <label htmlFor="factory-province-select" className="sr-only">Tỉnh thành</label>
              <select
                id="factory-province-select"
                aria-label="Tỉnh thành"
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
              >
                <option value="all">Tất cả tỉnh / thành</option>
                {topProvinces.map((prov, idx) => (
                  <option key={idx} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* KCN Selector (Section 14 & 18) */}
            <div>
              <label htmlFor="factory-kcn-select" className="sr-only">Khu công nghiệp</label>
              <select
                id="factory-kcn-select"
                aria-label="Khu công nghiệp"
                value={selectedKcn}
                onChange={(e) => {
                  setSelectedKcn(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
              >
                <option value="all">Tất cả khu công nghiệp</option>
                {allKcns.slice(0, 30).map((kcn) => (
                  <option key={kcn.id} value={kcn.id}>{kcn.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Chips (Section 7) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 font-heading mr-1">
              Lọc nhanh:
            </span>

            <button
              onClick={() => {
                setHasPublicRequirements(!hasPublicRequirements);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                hasPublicRequirements 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Có nhu cầu công khai</span>
            </button>

            <button
              onClick={() => {
                setHasSupplierCapability(!hasSupplierCapability);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                hasSupplierCapability 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Có năng lực cung ứng</span>
            </button>

            <button
              onClick={() => {
                setHasOutputProducts(!hasOutputProducts);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                hasOutputProducts 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Có sản phẩm đầu ra</span>
            </button>

            <button
              onClick={() => {
                setOemAvailable(!oemAvailable);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                oemAvailable 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>Nhận OEM / Gia công</span>
            </button>

            <button
              onClick={() => {
                setExportAvailable(!exportAvailable);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                exportAvailable 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>Có xuất khẩu</span>
            </button>

            {(searchQuery || selectedIndustry !== 'all' || selectedProvince !== 'all' || selectedKcn !== 'all' || hasPublicRequirements || hasSupplierCapability || hasOutputProducts || oemAvailable || exportAvailable) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center space-x-1 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 4. FACTORY CARDS GRID (SECTIONS 8, 9, 10, 16, 45) */}
        {/* ===================================================================== */}
        <section aria-label="Factory Directory Grid" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs text-slate-500 font-medium">
              Hiển thị <span className="font-bold text-slate-900">{listingData.items.length}</span> trên tổng số <span className="font-bold text-slate-900">{listingData.total.toLocaleString()}</span> nhà máy xác thực
            </div>

            {/* Sorting Select (Section 36) */}
            <div className="flex items-center space-x-2 text-xs">
              <label htmlFor="factory-sort-select" className="text-slate-400 font-medium cursor-pointer">Sắp xếp:</label>
              <select
                id="factory-sort-select"
                aria-label="Sắp xếp danh sách nhà máy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="relevance">Độ hoàn thiện hệ sinh thái (Organic)</option>
                <option value="name-asc">Tên nhà máy (A - Z)</option>
                <option value="year-desc">Năm thành lập mới nhất</option>
                <option value="needs-desc">Có nhiều nhu cầu mua hàng nhất</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listingData.items.map((factory) => (
              <FactoryCard key={factory.id} factory={factory} />
            ))}
          </div>

          {/* Empty State (Section 45) */}
          {listingData.items.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Factory className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 font-heading">
                  Chưa tìm thấy nhà máy phù hợp với bộ lọc này.
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Bạn có thể thử xóa bớt tiêu chí lọc hoặc gửi nhu cầu trực tiếp để Ban Điều Phối hỗ trợ kết nối.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  XÓA BỘ LỌC
                </button>
                <Link
                  to="/dang-nhu-cau?role=factory"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
                >
                  ĐĂNG NHU CẦU
                </Link>
                <Link
                  to="/chuong-trinh?role=buyer"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
                >
                  TÌM CHƯƠNG TRÌNH
                </Link>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {listingData.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                Trang trước
              </button>

              <div className="text-xs font-bold text-slate-600 font-mono px-3">
                Trang {currentPage} / {listingData.totalPages}
              </div>

              <button
                disabled={currentPage === listingData.totalPages}
                onClick={() => setCurrentPage(prev => Math.min(listingData.totalPages, prev + 1))}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                Trang tiếp
              </button>
            </div>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 5. NHU CẦU NHÀ MÁY ĐƯỢC PHÉP CHIA SẺ (SECTION 23 & 24) */}
        {/* ===================================================================== */}
        <section aria-label="Public Requirements from Factories" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
                SECTION 23 • CƠ HỘI CUNG ỨNG
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                NHU CẦU NHÀ MÁY ĐƯỢC PHÉP CHIA SẺ
              </h2>
              <p className="text-xs text-slate-500">
                Các gói thu mua đang mở từ các nhà máy trong mạng lưới. Thông tin liên hệ và ngân sách kín được bảo mật tuyệt đối.
              </p>
            </div>

            <Link
              to="/san-nhu-cau"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-sm"
            >
              <span>XEM SÀN NHU CẦU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicRequirements.map((req) => (
              <div 
                key={req.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white shadow-xs space-y-3 flex flex-col justify-between transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#0052cc]">
                      {req.publicCode || req.id}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ĐANG TÌM NGUỒN CUNG
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 font-heading">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {req.description}
                  </p>

                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5 pt-1">
                    <div>Địa bàn: <span className="text-slate-700 font-sans">{req.province || 'Toàn quốc'}</span></div>
                    <div>Ngành: <span className="text-slate-700 font-sans">{req.industry}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] text-slate-400 font-mono">
                    Bảo mật Buyer: ĐẠT CHUẨN
                  </span>
                  <Link
                    to={`/nhu-cau-mua-hang/${req.id}`}
                    className="px-3.5 py-1.5 bg-[#0052cc] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition inline-flex items-center space-x-1"
                  >
                    <span>Gửi hồ sơ chào giá</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 6. CHƯƠNG TRÌNH DÀNH CHO NHÀ MÁY (SECTION 20 SPEC 28.TXT) */}
        {/* ===================================================================== */}
        <section aria-label="Programs for Factories" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10.5px] font-bold rounded-md font-mono">
                SECTION 20 • KẾT NỐI B2B
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                CHƯƠNG TRÌNH DÀNH CHO NHÀ MÁY
              </h2>
              <p className="text-xs text-slate-500">
                Ngày hội chuỗi cung ứng, phiên gặp gỡ nhà cung cấp (Buyer-Supplier Meeting) và hội thảo tiêu chuẩn công nghiệp.
              </p>
            </div>

            <Link
              to="/chuong-trinh?role=buyer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-sm"
            >
              <span>XEM TẤT CẢ CHƯƠNG TRÌNH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factoryPrograms.map((prog) => (
              <div 
                key={prog.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-purple-400 bg-white shadow-xs space-y-3 flex flex-col justify-between transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700">
                      {prog.dates || prog.date}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Dành cho Nhà máy
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 font-heading">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{prog.location}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Tổ chức: {prog.organizerName || 'CHUOICUNGUNG.COM'}
                  </span>
                  <Link
                    to={`/chuong-trinh/${prog.slug || prog.id}`}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition inline-flex items-center space-x-1"
                  >
                    <span>Xem & Đăng ký</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 7. BOTTOM CTA SECTION & SUPPI ASSISTANT (SECTIONS 25, 26, 27, 28) */}
        {/* ===================================================================== */}
        <section 
          aria-label="Bottom Assistance Call to Action"
          className="bg-gradient-to-r from-[#072847] via-[#0b3f6d] to-[#0052cc] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6"
        >
          <div className="max-w-3xl space-y-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full font-mono">
              SECTION 28 • ĐIỀU PHỐI HỆ SINH THÁI NHÀ MÁY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
              BẠN LÀ NHÀ MÁY SẢN XUẤT? HÃY THAM GIA MẠNG LƯỚI
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Trợ lý SUPPI hỗ trợ làm rõ yêu cầu thu mua linh kiện, phụ trợ hoặc giới thiệu năng lực sản xuất OEM 
              đến các đối tác tập đoàn đa quốc gia. Một hồ sơ duy nhất phục vụ cả hai nhu cầu Mua và Bán.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/dang-nhu-cau?role=factory&sourcePage=factory-list"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/20 font-heading inline-flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>GỬI NHU CẦU TÌM NGUỒN CUNG</span>
            </Link>

            <Link
              to="/tao-ho-so?role=factory&intent=supplier-capability"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm rounded-xl transition font-heading inline-flex items-center space-x-2"
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>GIỚI THIỆU NĂNG LỰC SẢN XUẤT</span>
            </Link>

            <Link
              to="/chuong-trinh?role=buyer"
              className="px-5 py-3.5 text-white/90 hover:text-white font-bold text-xs sm:text-sm transition flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4 text-purple-300" />
              <span>Lịch sự kiện B2B</span>
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
