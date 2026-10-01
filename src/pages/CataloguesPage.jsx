import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Sparkles, 
  Globe, 
  Printer, 
  Building2, 
  MapPin, 
  Layers, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Crown, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  RefreshCw,
  QrCode,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  getAllCatalogues, 
  CATALOGUE_TYPES, 
  CATALOGUE_STATUSES,
  UPCOMING_EDITIONS_CALL_FOR_PAPERS
} from '../data/cataloguesData';
import CatalogueCard from '../components/catalogues/CatalogueCard';
import CatalogueParticipationModal from '../components/catalogues/CatalogueParticipationModal';
import CatalogueOnlineViewerModal from '../components/catalogues/CatalogueOnlineViewerModal';

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [showArchived, setShowArchived] = useState(false);

  // Modals state
  const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false);
  const [targetEditionForParticipation, setTargetEditionForParticipation] = useState(null);
  const [selectedCatalogueForViewer, setSelectedCatalogueForViewer] = useState(null);
  const [isOnlineViewerOpen, setIsOnlineViewerOpen] = useState(false);

  const listTopRef = useRef(null);

  // Fetch catalogues on mount
  useEffect(() => {
    const list = getAllCatalogues();
    setCatalogues(list);
  }, []);

  // SEO & Native DOM Metadata (Section 51 & 52)
  useEffect(() => {
    document.title = 'Catalogue công nghiệp | CHUOICUNGUNG.COM';
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Khám phá catalogue và ấn phẩm nhà cung ứng theo chuyên mục, địa bàn và chương trình; mỗi hồ sơ dẫn về thông tin doanh nghiệp đang được cập nhật trên CHUOICUNGUNG.COM.';

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://chuoicungung.com/catalogue';

    // JSON-LD Structured Data (Section 52: CollectionPage & ItemList)
    let script = document.getElementById('catalogues-listing-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'catalogues-listing-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Danh Sách Catalogue & Ấn Phẩm Nhà Cung Ứng Việt Nam",
      "description": "Cổng tra cứu catalogue nhà cung cấp công nghiệp theo chuyên mục, địa bàn và chương trình B2B.",
      "url": "https://chuoicungung.com/catalogue",
      "publisher": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      }
    });

    // Track analytics (Section 54)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'catalogue_listing_view' });
    }
  }, []);

  // Filter logic (Section 7 & 8)
  const filteredCatalogues = useMemo(() => {
    return getAllCatalogues({
      search: searchTerm,
      catalogueType: selectedType,
      categoryId: selectedCategory,
      provinceId: selectedProvince,
      format: selectedFormat,
      status: showArchived ? 'ARCHIVED' : 'ACTIVE'
    });
  }, [searchTerm, selectedType, selectedCategory, selectedProvince, selectedFormat, showArchived]);

  // Unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const map = new Map();
    catalogues.forEach(c => {
      if (c.categoryId && c.categoryName) {
        map.set(c.categoryId, c.categoryName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [catalogues]);

  // Unique provinces for filter dropdown
  const uniqueProvinces = useMemo(() => {
    const map = new Map();
    catalogues.forEach(c => {
      if (c.provinceId && c.provinceName && c.provinceId !== 'all') {
        map.set(c.provinceId, c.provinceName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [catalogues]);

  const handleOpenParticipation = (editionId = null) => {
    setTargetEditionForParticipation(editionId);
    setIsParticipationModalOpen(true);
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'catalogue_participation_click', editionId });
    }
  };

  const handleQuickViewOnline = (cat) => {
    setSelectedCatalogueForViewer(cat);
    setIsOnlineViewerOpen(true);
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'catalogue_online_view', catalogueId: cat.id });
    }
  };

  const handleDownloadPdf = (cat, ed) => {
    if (ed?.fileUrl) {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event: 'catalogue_download', catalogueId: cat.id, editionCode: ed.editionCode });
      }
      alert(`Đang mở tải về tài liệu: ${cat.title}\nẤn bản: ${ed.editionCode} (${ed.fileSize || 'PDF'})\n\nLưu ý: Mọi mã QR trên bản in đều dẫn về hồ sơ số đang được cập nhật liên tục.`);
      window.open(ed.fileUrl, '_blank');
    }
  };

  const scrollToGrid = () => {
    listTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-800">Catalogue & Ấn Phẩm Doanh Nghiệp</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section (Section 2 Spec 30.txt) */}
      <header className="relative bg-gradient-to-b from-[#072847] via-[#0b3f6d] to-[#0052cc] text-white pt-10 sm:pt-14 pb-14 sm:pb-20 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Hạ Tầng Ấn Phẩm & Hồ Sơ Số Chuỗi Cung Ứng</span>
            </div>

            {/* H1 Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading leading-tight tracking-tight text-white">
              Catalogue công nghiệp
            </h1>
            <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
              Ấn phẩm nhà cung ứng theo nhu cầu doanh nghiệp
            </p>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-blue-100 leading-relaxed max-w-2xl font-normal">
              Tìm hồ sơ nhà cung ứng theo chuyên mục, địa bàn hoặc chương trình kết nối. Mỗi ấn phẩm có thời điểm phát hành và mã QR dẫn trực tiếp về thông tin doanh nghiệp đang được cập nhật trên CHUOICUNGUNG.COM.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* Primary CTA */}
              <button
                onClick={scrollToGrid}
                type="button"
                className="py-3 px-6 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center space-x-2 cursor-pointer"
              >
                <span>XEM CATALOGUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA */}
              <Link
                to="/nha-cung-ung"
                className="py-3 px-6 bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/30 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-2 backdrop-blur-xs cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-300" />
                <span>TÌM NHÀ CUNG ỨNG</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* 3. Core Ecosystem Philosophy Strip (Section 3: Catalogue KHÔNG PHẢI blog PDF tĩnh) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          <div className="flex items-start space-x-3.5 pt-2 sm:pt-0 sm:px-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 font-heading">Doanh Nghiệp Đã Duyệt</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Chỉ hồ sơ đạt chuẩn KYC và được kiểm tra năng lực xưởng mới xuất bản.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 pt-3 sm:pt-0 sm:px-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 font-heading">QR Dẫn Về Hồ Sơ Số</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Bản in tĩnh luôn có cầu nối tới dữ liệu sản phẩm và chứng nhận mới nhất.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 pt-3 sm:pt-0 sm:px-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 font-heading">Số Liệu In Thực Tế</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Công bố chính xác số bản in xác nhận và số lượng đã phát hành.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 pt-3 sm:pt-0 sm:px-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 font-heading">Quy Trình Digital-First</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Phát hành bản số tương tác trước khi quyết định in ấn và phân phối.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Search & Filter Bar (Section 7 & 8) */}
      <div ref={listTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-5">
        
        {/* Search Input Box */}
        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <label htmlFor="catalogue-search-input" className="sr-only">Tìm theo tên catalogue, chuyên mục, KCN, tỉnh thành</label>
            <input 
              id="catalogue-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên catalogue, chuyên mục, KCN, tỉnh thành, chương trình hoặc tên doanh nghiệp..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Clear / Reset Filters */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            {(selectedType !== 'ALL' || selectedCategory !== 'ALL' || selectedProvince !== 'ALL' || selectedFormat !== 'ALL' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedType('ALL');
                  setSelectedCategory('ALL');
                  setSelectedProvince('ALL');
                  setSelectedFormat('ALL');
                  setSearchTerm('');
                  setShowArchived(false);
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center space-x-1"
                type="button"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center space-x-1 border ${
                showArchived 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              type="button"
            >
              <span>{showArchived ? 'Đang xem: Lưu trữ' : 'Ấn phẩm lưu trữ'}</span>
            </button>
          </div>

        </div>

        {/* Filter Chips / Dropdowns Bar */}
        <div className="space-y-3">
          
          {/* Catalogue Type Chips (Section 21) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-bold shrink-0 mr-1 text-[11px] uppercase tracking-wider">
              Loại ấn phẩm:
            </span>
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedType === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tất cả ({catalogues.length})
            </button>

            {Object.values(CATALOGUE_TYPES).map(t => {
              const count = catalogues.filter(c => c.catalogueType === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-1 ${
                    selectedType === t.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{t.shortName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedType === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            
            {/* Category Dropdown */}
            <div>
              <label htmlFor="catalogue-category-select" className="sr-only">Chuyên mục ngành</label>
              <select
                id="catalogue-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600 transition shadow-2xs"
              >
                <option value="ALL">Mọi chuyên mục ngành</option>
                {uniqueCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Province Dropdown */}
            <div>
              <label htmlFor="catalogue-province-select" className="sr-only">Địa bàn / KCN</label>
              <select
                id="catalogue-province-select"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600 transition shadow-2xs"
              >
                <option value="ALL">Mọi địa bàn / KCN</option>
                {uniqueProvinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Format Dropdown (Online / Print / Both) */}
            <div>
              <label htmlFor="catalogue-format-select" className="sr-only">Định dạng phát hành</label>
              <select
                id="catalogue-format-select"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600 transition shadow-2xs"
              >
                <option value="ALL">Mọi định dạng phát hành</option>
                <option value="ONLINE_ONLY">Bản số trực tuyến</option>
                <option value="PRINT_CONFIRMED">Bản in phát tay</option>
                <option value="BOTH">Song hành (Số & Bản in)</option>
              </select>
            </div>

            {/* Total Results Summary */}
            <div className="p-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Kết quả lọc:</span>
              <span className="text-[#0052cc] font-mono">{filteredCatalogues.length} ấn phẩm</span>
            </div>

          </div>

        </div>

      </div>

      {/* 5. Catalogue Cards Listing Grid (Section 9) */}
      <div id="danh-sach-catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {filteredCatalogues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalogues.map((cat) => (
              <CatalogueCard
                key={cat.id}
                catalogue={cat}
                onQuickViewOnline={handleQuickViewOnline}
                onDownloadPdf={handleDownloadPdf}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-xl font-bold">
              📚
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Không tìm thấy catalogue phù hợp với tiêu chí lọc
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Vui lòng thử tìm với từ khóa khác hoặc điều chỉnh lại bộ lọc chuyên mục và địa bàn.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('ALL');
                setSelectedCategory('ALL');
                setSelectedProvince('ALL');
                setSelectedFormat('ALL');
              }}
              className="py-2 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Hiển thị tất cả ấn phẩm
            </button>
          </div>
        )}

      </div>

      {/* 6. Block: THAM GIA ẤN PHẨM TIẾP THEO (Section 25 Spec 30.txt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-gradient-to-r from-slate-900 via-[#072847] to-slate-900 rounded-3xl text-white p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tuyển Chọn Nhà Cung Ứng</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-heading tracking-tight text-white">
                THAM GIA ẤN PHẨM TIẾP THEO
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                CHUOICUNGUNG.COM định kỳ phát hành các chuyên đề kết nối năng lực cung ứng theo ngành và vùng kinh tế trọng điểm. Mỗi doanh nghiệp tham gia được chuẩn hóa hồ sơ số, gắn mã QR định danh và giới thiệu trực tiếp tới các đoàn thu mua.
              </p>
            </div>

            <button
              onClick={() => handleOpenParticipation()}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-lg shrink-0 flex items-center justify-center space-x-2"
            >
              <span>Đăng Ký Tham Gia</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cards of upcoming calls for papers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UPCOMING_EDITIONS_CALL_FOR_PAPERS.map((upcoming) => (
              <div 
                key={upcoming.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-blue-400/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Title & Deadline */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 text-[10.5px] font-mono font-bold">
                      Hạn chót: {upcoming.deadline}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Dự kiến phát hành: {upcoming.publicationTargetDate}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                    {upcoming.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400">Phạm vi: </span>
                      <span className="font-semibold text-white">{upcoming.scope}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Chuyên mục trọng tâm: </span>
                      <span className="font-semibold text-white">{upcoming.categoryTarget}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Sự kiện phát hành: </span>
                      <span className="font-semibold text-white">{upcoming.targetDistributionEvents}</span>
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] text-slate-400">
                    <div className="font-bold text-slate-300">Tiêu chuẩn lựa chọn:</div>
                    {upcoming.requirements.map((req, rIdx) => (
                      <div key={rIdx} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* Founding Partner Entitlement Note (Section 32) */}
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start space-x-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Quyền lợi Founding Partner:</div>
                      <div>{upcoming.pricingAndEntitlements.foundingPartnerEntitlement}</div>
                    </div>
                  </div>

                </div>

                {/* Bottom CTA for this edition */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Phí tham gia tiêu chuẩn: <strong className="text-white">{upcoming.pricingAndEntitlements.standardFee}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenParticipation(upcoming.id)}
                    type="button"
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>Nộp Hồ Sơ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Metric Separation & Philosophy Hard Rules (Section 10 & 40) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-blue-900 font-black text-sm sm:text-base font-heading">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>NGUYÊN TẮC MINH BẠCH & ĐO LƯỜNG CHỈ SỐ B2B (HARD RULES)</span>
          </div>

          <p className="text-xs text-blue-950/80 leading-relaxed">
            Hệ thống CHUOICUNGUNG.COM tuân thủ quy chuẩn đo lường minh bạch tuyệt đối theo đặc tả Section 10 & 40:
          </p>

          <div className="p-3.5 bg-white rounded-2xl border border-blue-200 font-mono text-xs text-blue-900 font-bold overflow-x-auto whitespace-nowrap">
            PRINTED ≠ DISTRIBUTED ≠ READ ≠ QR SCAN ≠ PROFILE ENGAGEMENT ≠ CONTACT REQUEST ≠ BUYER NEED ≠ DEAL
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">1. Bản in thực tế (Confirmed Print):</strong>
              <p className="text-[11px] text-slate-600">
                Nếu kế hoạch in 1.000 bản nhưng mới in 300 bản, hệ thống chỉ hiển thị đúng 300 bản đã in. Tuyệt đối không biến số dự kiến thành số phát hành thực tế.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">2. Quét mã QR ≠ Nhu cầu mua:</strong>
              <p className="text-[11px] text-slate-600">
                Hành động quét QR chỉ là thao tác mở hồ sơ số có xác thực, không tự động tạo Buyer Need hay Commercial Lead khi chưa có trao đổi chính thức.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">3. Static Print vs Live Profile:</strong>
              <p className="text-[11px] text-slate-600">
                Ấn phẩm in ấn là ảnh chụp snapshot tại ngày phát hành, còn hồ sơ số luôn hiển thị năng lực sản xuất, chứng chỉ và báo giá đang cập nhật theo thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Participation Modal */}
      <CatalogueParticipationModal
        isOpen={isParticipationModalOpen}
        onClose={() => setIsParticipationModalOpen(false)}
        initialEditionId={targetEditionForParticipation}
      />

      {/* Online Viewer Modal */}
      <CatalogueOnlineViewerModal
        isOpen={isOnlineViewerOpen}
        onClose={() => setIsOnlineViewerOpen(false)}
        catalogue={selectedCatalogueForViewer}
      />

    </main>
  );
}
