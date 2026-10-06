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
  AlertCircle,
  PlusCircle
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
    document.title = 'Catalogue Nhà Cung Ứng | CHUOICUNGUNG.COM';
    
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (MATCHES IMAGE 2 LAYOUT & TEXT HIERARCHY)                */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        
        {/* Right Half Catalogue Showcase Visual with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/catalogue_hero.jpg" 
            alt="B2B Supply Chain Catalogues & Publications" 
            className="w-full h-full object-cover object-[62%_center] scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Content Container Aligned Exactly with Image 2 */}
        <div className="w-[min(1280px,calc(100%-48px))] mx-auto relative z-10 w-full py-8 sm:py-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn trang">
            <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-900 font-medium" aria-current="page">Catalogue &amp; Ấn phẩm</span>
          </nav>

          <div className="max-w-xl">
            
            {/* Category Label */}
            <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
              Ấn phẩm xúc tiến &amp; Hồ sơ số doanh nghiệp
            </p>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
              Catalogue B2B<br />theo nhu cầu thật.
            </h1>

            {/* Lede (Tagline) */}
            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
              Đúng hồ sơ năng lực.<br />Rõ dữ liệu xác thực.
            </p>

            {/* Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
              Tìm hồ sơ nhà cung ứng theo chuyên mục, địa bàn hoặc chương trình kết nối. Bản in luôn có mã QR trực tiếp tới dữ liệu sản phẩm và chứng nhận xác thực mới nhất.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                onClick={scrollToGrid}
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>Xem catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenParticipation()}
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2 cursor-pointer"
              >
                <span>Đăng ký giới thiệu doanh nghiệp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR (EXACT 4 STAT CARDS FROM IMAGE 2) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-10 sm:-mt-12 lg:-mt-14">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="p-2 sm:p-0 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">TIÊU CHUẨN KYC</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-950 font-heading tracking-tight">Doanh Nghiệp Đã Duyệt</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Chỉ hồ sơ đạt chuẩn KYC mới xuất bản</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">DỮ LIỆU ĐỒNG BỘ</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-950 font-heading tracking-tight">QR Dẫn Về Hồ Sơ Số</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Bản in liên kết trực tiếp dữ liệu sản phẩm</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">MINH BẠCH ẤN BẢN</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-950 font-heading tracking-tight">Số Liệu In Thực Tế</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Công bố chính xác số lượng phát hành</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">TƯƠNG TÁC ĐA KÊNH</span>
              </div>
              <div className="text-base sm:text-lg font-black text-slate-950 font-heading tracking-tight">Quy Trình Digital-First</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Bản số tương tác trước khi in ấn</p>
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
            <input 
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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600 transition shadow-2xs"
            >
              <option value="ALL">Mọi chuyên mục ngành</option>
              {uniqueCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Province Dropdown */}
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600 transition shadow-2xs"
            >
              <option value="ALL">Mọi địa bàn / KCN</option>
              {uniqueProvinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Format Dropdown (Online / Print / Both) */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600 transition shadow-2xs"
            >
              <option value="ALL">Mọi định dạng phát hành</option>
              <option value="ONLINE_ONLY">Bản số trực tuyến</option>
              <option value="PRINT_CONFIRMED">Bản in phát tay</option>
              <option value="BOTH">Song hành (Số & Bản in)</option>
            </select>

            {/* Total Results Summary */}
            <div className="p-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Kết quả lọc:</span>
              <span className="text-[#0052cc] font-mono">{filteredCatalogues.length} ấn phẩm</span>
            </div>

          </div>

        </div>

      </div>

      {/* 5. Catalogue Cards Listing Grid (Section 9) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
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

      </main>

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

    </div>
  );
}
