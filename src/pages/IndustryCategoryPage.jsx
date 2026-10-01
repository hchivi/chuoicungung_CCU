import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Building2, ChevronRight, ArrowRight, RotateCcw, 
  ShieldCheck, Tag, Phone, Globe, ArrowUp, ChevronDown, Layers, Check, Sparkles,
  ChevronLeft, ArrowLeft, Wrench, Factory, Cpu, Truck, Users, Leaf,
  ExternalLink, FileText, Download, CheckCircle2, AlertCircle, Bot,
  Send, HelpCircle, Filter, X, SlidersHorizontal, Package, Calendar, Award
} from 'lucide-react';
import enterprisesFullList from '../data/enterprisesFull.json';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getCompanyMonogram, 
  getMonogramGradient, 
  isValidCustomLogo, 
  getEnterpriseAvatarImage
} from '../utils/companyUtils';
import { 
  slugify, 
  getCategoryHubBySlug, 
  getCategoryProducts, 
  getCategoryFoundingPartner, 
  getCategoryPrograms 
} from '../data/categoryHubData';

export { slugify };

const PROVINCES = [
  "Toàn quốc", "Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Hà Nội", "Bắc Ninh", 
  "Hải Phòng", "Long An", "Đà Nẵng", "Bà Rịa - Vũng Tàu", "Hưng Yên", "Hải Dương", 
  "Vĩnh Phúc", "Bắc Giang", "Quảng Nam", "Quảng Ngãi", "Khánh Hòa", "Cần Thơ", "Thái Nguyên"
];

const ORDER_SIZES = [
  { id: "all", label: "Tất cả quy mô đơn" },
  { id: "small", label: "Đơn mẫu / MOQ nhỏ (< 100)" },
  { id: "medium", label: "Quy mô vừa (100 - 1.000)" },
  { id: "large", label: "Quy mô công nghiệp (> 1.000)" }
];

export default function IndustryCategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  // Category entity resolution from slug & name parameter
  const category = useMemo(() => {
    return getCategoryHubBySlug(slug, searchParams.get('name'));
  }, [slug, searchParams]);

  // Filtering states (Page 05 reuse)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Toàn quốc');
  const [selectedOrderSize, setSelectedOrderSize] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyReady, setOnlyReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const pageSize = 18;

  // Requirement Draft state for Callout
  const [draftNote, setDraftNote] = useState('');
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);

  // SUPPI Quick Interactive Dialog State
  const [isSuppiModalOpen, setIsSuppiModalOpen] = useState(false);
  const [suppiQuery, setSuppiQuery] = useState('');
  const [suppiResponse, setSuppiResponse] = useState(null);

  // Related data
  const foundingPartner = useMemo(() => getCategoryFoundingPartner(category), [category]);
  const relatedProducts = useMemo(() => getCategoryProducts(category), [category]);
  const relatedPrograms = useMemo(() => getCategoryPrograms(category), [category]);

  // SEO Management
  useEffect(() => {
    if (!category) return;
    document.title = `${category.name} – Nhà cung ứng và nhu cầu B2B | CHUOICUNGUNG.COM`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = category.seoDescription || `${category.name} – Danh bạ nhà cung ứng, xưởng chế tạo và nhu cầu mua sắm B2B uy tín. Tìm kiếm theo năng lực thật, khu vực phục vụ, MOQ và gửi yêu cầu kết nối trực tiếp.`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://chuoicungung.com/nganh-nghe/${slug || category.slug}`;

    // Schema JSON-LD (CollectionPage & ItemList)
    const scriptId = 'category-hub-jsonld';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": category.name,
      "description": category.shortDescription,
      "url": `https://chuoicungung.com/nganh-nghe/${category.slug}`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://chuoicungung.com/" },
          { "@type": "ListItem", "position": 2, "name": category.stageName, "item": `https://chuoicungung.com/ban-do-6-giai-doan` },
          { "@type": "ListItem", "position": 3, "name": category.name, "item": `https://chuoicungung.com/nganh-nghe/${category.slug}` }
        ]
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  // Filter matching suppliers from enterprises database
  const matchingEnterprises = useMemo(() => {
    if (!category) return [];
    const catNameLower = (category.name || '').toLowerCase();
    const catSlug = slugify(category.name || '');

    // 1. Initial Match by Industry/Category
    let list = enterprisesFullList.filter(e => {
      const c = (e.category || e.industry || '').toLowerCase();
      const s = slugify(c);
      return c.includes(catNameLower) || catNameLower.includes(c) || s.includes(catSlug) || catSlug.includes(s);
    });

    // Fallback if strict match yields few
    if (list.length < 5) {
      const tokens = catNameLower.split(/\s+/).filter(t => t.length > 2);
      const broad = enterprisesFullList.filter(e => {
        const text = `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${(e.products || []).join(' ')}`.toLowerCase();
        return tokens.some(t => text.includes(t));
      });
      list = Array.from(new Set([...list, ...broad]));
    }

    // 2. Filter by Province
    if (selectedProvince !== 'Toàn quốc') {
      list = list.filter(e => e.province && (e.province === selectedProvince || e.province.includes(selectedProvince)));
    }

    // 3. Filter by Verification
    if (onlyVerified) {
      list = list.filter(e => e.isVerified);
    }

    // 4. Filter by search keyword
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(e => 
        (e.name || '').toLowerCase().includes(q) ||
        (e.address || '').toLowerCase().includes(q) ||
        (e.products && e.products.some(p => p.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [category, selectedProvince, onlyVerified, searchTerm]);

  const totalCount = matchingEnterprises.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const displayedEnterprises = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return matchingEnterprises.slice(start, start + pageSize);
  }, [matchingEnterprises, currentPage]);

  // Handle Quick Requirement Submission from Callout
  const handleCreateDraft = (e) => {
    e.preventDefault();
    if (!draftNote.trim()) return;

    setIsSubmittingDraft(true);
    const draftId = `req-${Date.now()}`;
    const draftPayload = {
      id: draftId,
      categoryId: category.id,
      categoryName: category.name,
      phaseId: category.phaseId,
      stageId: category.stageId,
      sourcePage: 'CATEGORY_PAGE',
      sourceSlug: category.slug,
      initialDescription: draftNote,
      province: selectedProvince !== 'Toàn quốc' ? selectedProvince : undefined,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('ccu_current_requirement_draft', JSON.stringify(draftPayload));
    } catch (err) {}

    setTimeout(() => {
      setIsSubmittingDraft(false);
      navigate(`/dang-nhu-cau?draft=${draftId}`);
    }, 400);
  };

  // Handle SUPPI Ask in Category Context
  const handleAskSuppi = (promptText) => {
    const q = promptText || suppiQuery;
    if (!q) return;

    setIsSuppiModalOpen(true);
    setSuppiQuery(q);

    // Context-grounded response without hallucination
    const loc = selectedProvince !== 'Toàn quốc' ? `tại ${selectedProvince}` : 'trên toàn quốc';
    setSuppiResponse({
      title: `SUPPI Đang Phân Tích Yêu Cầu Cho Ngành: ${category.name}`,
      text: `Dựa trên cơ sở dữ liệu xác thực, hiện có ${totalCount} nhà cung ứng đạt chuẩn ${loc}. Để tạo Requirement Draft gửi báo giá bảo mật:`,
      actionDraft: {
        categoryId: category.id,
        categoryName: category.name,
        notes: q,
        location: selectedProvince
      }
    });
  };

  // Publication Rule Check
  if (category.status !== 'ACTIVE' || !category.publishable) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">Chuyên mục đang chuẩn hóa dữ liệu</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Chuyên mục <strong>{category.name}</strong> hiện đang được ban quản trị kiểm tra hồ sơ năng lực và liên kết nhà cung ứng trước khi công bố công khai.
          </p>
          <Link to="/nha-cung-ung" className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs">
            Quay về Danh bạ Nhà cung ứng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBFBFC] pb-24 font-sans text-slate-900 antialiased space-y-10">
      
      {/* Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">

        {/* =========================================================================
            01. BREADCRUMB
           ========================================================================= */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium flex-wrap gap-y-1">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/ban-do-6-giai-doan" className="hover:text-blue-600 transition">
            Giai đoạn {category.stageId}: {category.stageName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-blue-600 font-bold truncate max-w-[260px] sm:max-w-md">{category.name}</span>
        </nav>

        {/* =========================================================================
            02. HERO SECTION
           ========================================================================= */}
        <section className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 lg:p-10">
          {/* Category Banner Background */}
          <div className="absolute top-0 right-0 w-full sm:w-[55%] md:w-[50%] h-full pointer-events-none overflow-hidden z-0 select-none">
            <img 
              src={category.bannerImage} 
              alt={category.name}
              className="w-full h-full object-cover object-center scale-105 opacity-80"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 via-35% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-white/40" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            {/* Stage & Hierarchy Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>CHUYÊN MỤC SOURCING B2B • PHA {category.phaseId}</span>
            </div>

            {/* H1 Headline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-slate-950 leading-tight">
                Nhà cung ứng {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {category.shortDescription}
              </p>
            </div>

            {/* Search Input Bar inside Hero */}
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={`Bạn đang cần gì trong nhóm ${category.name}?`}
                className="w-full pl-11 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => handleAskSuppi(searchTerm || `Tìm nguồn ${category.name}`)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl shadow-2xs transition"
              >
                Tìm
              </button>
            </div>

            {/* Two Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#category-suppliers-grid"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center space-x-2 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Tìm nhà cung ứng {category.name}</span>
              </a>

              <Link
                to={`/dang-nhu-cau?category=${encodeURIComponent(category.name)}`}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 flex items-center space-x-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>Đăng nhu cầu</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            03. NHÓM NHU CẦU / KEYWORD CLUSTER
           ========================================================================= */}
        {category.keywords && category.keywords.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                NHÓM NHU CẦU TRỌNG TÂM TRONG NGÀNH
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                {category.keywords.length} từ khóa chuyên sâu
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {category.keywords.map((kw) => (
                <Link
                  key={kw.id}
                  to={`/tu-khoa/${kw.slug}?q=${encodeURIComponent(kw.query || kw.name)}`}
                  className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 hover:text-blue-700 transition shadow-2xs group"
                >
                  <Tag className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>{kw.name}</span>
                  {kw.count && (
                    <span className="px-1.5 py-0.2 bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-700 text-[10px] rounded-md font-mono">
                      {kw.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            04. SEARCH & FILTER SUPPLIER (PAGE 05 REUSE)
           ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 font-heading">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>BỘ LỌC TÌM KIẾM NHÀ CUNG ỨNG TRONG NGÀNH</span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-slate-500">
                Tìm thấy <strong className="text-blue-600 font-mono">{totalCount}</strong> doanh nghiệp
              </span>
              {(selectedProvince !== 'Toàn quốc' || onlyVerified || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedProvince('Toàn quốc');
                    setOnlyVerified(false);
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Keyword */}
            <div className="sm:col-span-6 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Lọc theo tên doanh nghiệp, sản phẩm, địa chỉ..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Province Select */}
            <div className="sm:col-span-3">
              <select
                value={selectedProvince}
                onChange={(e) => { setSelectedProvince(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                {PROVINCES.map(p => (
                  <option key={p} value={p}>{p === "Toàn quốc" ? "📍 Toàn quốc (63 Tỉnh)" : `📍 ${p}`}</option>
                ))}
              </select>
            </div>

            {/* Verified Only Toggle */}
            <div className="sm:col-span-3 flex items-center">
              <label className="flex items-center space-x-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition w-full">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => { setOnlyVerified(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Chỉ hiển thị đã xác minh B2B</span>
              </label>
            </div>
          </div>
        </section>

        {/* =========================================================================
            05. CALLOUT: ĐĂNG NHU CẦU "CHƯA TÌM THẤY ĐÚNG NGUỒN?"
           ========================================================================= */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[11px] font-bold">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span>YÊU CẦU TÌM NGUỒN BẢO MẬT & ĐÚNG NĂNG LỰC</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              Chưa tìm thấy đúng nguồn cung ứng cho nhu cầu của bạn?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Đừng tốn thời gian gọi điện từng nơi. Hãy mô tả nhanh số lượng, quy cách hoặc yêu cầu giao hàng; hệ thống SUPPI sẽ tự động đối soát hồ sơ kỹ thuật và gợi ý các đơn vị phù hợp nhất.
            </p>

            <form onSubmit={handleCreateDraft} className="space-y-3 pt-1">
              <textarea
                rows={2}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder={`Ví dụ: Tôi cần gia công 1.000 chi tiết theo bản vẽ STEP tại Bình Dương, giao hàng trước 30/11...`}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 italic">
                  * Yêu cầu sẽ được tạo dưới dạng bản nháp bảo mật, không tự động công khai.
                </span>

                <button
                  type="submit"
                  disabled={isSubmittingDraft || !draftNote.trim()}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-white/20 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingDraft ? 'Đang tạo nháp...' : 'ĐỂ SUPPI TÌM NGUỒN'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* =========================================================================
            06. FOUNDING PARTNER (SPONSORED BLOCK - STRICTLY LABELED)
           ========================================================================= */}
        {foundingPartner && (
          <section className="bg-amber-50/50 border border-amber-200/80 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs relative">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-200/60 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-md uppercase tracking-wider font-mono">
                  ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC
                </span>
                <span className="text-xs text-slate-500 italic">
                  (Khối tài trợ đồng hành • Không ảnh hưởng đến xếp hạng tìm kiếm tự nhiên)
                </span>
              </div>

              <Link
                to={`/doanh-nghiep/${foundingPartner.slug || foundingPartner.id}`}
                className="text-xs font-bold text-amber-800 hover:underline flex items-center space-x-1"
              >
                <span>Xem hồ sơ đối tác</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-amber-200 p-1 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center">
                    <img
                      src={foundingPartner.logo}
                      alt={foundingPartner.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/logo_only.png";
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                      {foundingPartner.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-800 font-sans">
                      {foundingPartner.brandTitle || foundingPartner.slogan}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-white text-slate-700 text-[11px] font-medium rounded border border-amber-200">
                        📍 {foundingPartner.address}
                      </span>
                      {foundingPartner.capacity && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded">
                          ⚡ {foundingPartner.capacity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {foundingPartner.description}
                </p>
              </div>

              <div className="md:col-span-4 bg-white rounded-2xl p-4 border border-amber-200/80 space-y-3 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  SẢN PHẨM / NĂNG LỰC NỔI BẬT
                </div>
                {Array.isArray(foundingPartner.coreProducts) && foundingPartner.coreProducts.slice(0, 2).map((cp, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold line-clamp-1">{cp.name}</span>
                  </div>
                ))}
                <Link
                  to={`/doanh-nghiep/${foundingPartner.slug || foundingPartner.id}`}
                  className="block w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold text-center rounded-xl transition shadow-xs"
                >
                  XEM NĂNG LỰC ĐỐI TÁC
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            07. NHÀ CUNG ỨNG LIÊN QUAN (REUSE SUPPLIER CARD - REAL DATABASE)
           ========================================================================= */}
        <section id="category-suppliers-grid" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                NHÀ CUNG ỨNG ĐẠT CHUẨN TRONG NGÀNH
              </h2>
              <p className="text-xs text-slate-500">
                Hiển thị nhà sản xuất, xưởng gia công thực tế từ cơ sở dữ liệu chuỗi cung ứng
              </p>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Trang {currentPage} / {totalPages}
            </span>
          </div>

          {displayedEnterprises.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Không tìm thấy nhà cung ứng phù hợp với tiêu chí lọc
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hãy thử chọn lại khu vực "Toàn quốc" hoặc xóa bớt từ khóa lọc.
              </p>
              <button
                onClick={() => { setSelectedProvince('Toàn quốc'); setSearchTerm(''); setOnlyVerified(false); }}
                className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Xem tất cả nhà cung ứng
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedEnterprises.map((ent) => {
                const entId = ent.id || ent._id || ent.taxCode || ent.name;
                const detailUrl = `/doanh-nghiep/${ent.id || ent._id}`;

                return (
                  <div
                    key={entId}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-0.5 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center group-hover:border-blue-300 transition-colors">
                          <img 
                            src={getEnterpriseAvatarImage(ent)} 
                            alt={ent.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/logo_only.png";
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md font-mono">
                              📍 {ent.province || 'Toàn quốc'}
                            </span>
                            {ent.isVerified && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md flex items-center space-x-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>

                          <Link
                            to={detailUrl}
                            className="font-bold text-xs sm:text-[13px] text-slate-950 group-hover:text-blue-600 transition line-clamp-2 font-heading leading-tight"
                            title={ent.name}
                          >
                            {ent.name}
                          </Link>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-800">
                          <Tag className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">{ent.category || ent.industry || category.name}</span>
                        </div>
                        {ent.address && (
                          <div className="flex items-start space-x-1.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{ent.address}</span>
                          </div>
                        )}
                      </div>

                      {Array.isArray(ent.products) && ent.products.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {ent.products.slice(0, 3).map((prod, pIdx) => (
                            <span 
                              key={pIdx} 
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium truncate max-w-[140px]"
                            >
                              {prod}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          const draftId = `req-${Date.now()}`;
                          localStorage.setItem('ccu_current_requirement_draft', JSON.stringify({
                            id: draftId,
                            categoryId: category.id,
                            categoryName: category.name,
                            preferredSupplierId: ent.id,
                            preferredSupplierName: ent.name,
                            sourcePage: 'CATEGORY_PAGE'
                          }));
                          navigate(`/dang-nhu-cau?draft=${draftId}`);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        Gửi yêu cầu
                      </button>

                      <Link
                        to={detailUrl}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center space-x-1"
                      >
                        <span>Xem năng lực</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                Trước
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                Sau
              </button>
            </div>
          )}
        </section>

        {/* =========================================================================
            08. HƯỚNG DẪN BUYER (BUYER GUIDE CHECKLIST)
           ========================================================================= */}
        {category.buyerGuide && (
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                  {category.buyerGuide.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Chuẩn bị đầy đủ các thông tin kỹ thuật này sẽ giúp rút ngắn 70% thời gian trao đổi và nhận báo giá chính xác.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.buyerGuide.items.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            09. CHƯƠNG TRÌNH & CATALOGUE LIÊN QUAN
           ========================================================================= */}
        {(relatedPrograms.length > 0 || (category.catalogues && category.catalogues.length > 0)) && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Related Programs */}
            {relatedPrograms.length > 0 && (
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>CHƯƠNG TRÌNH KẾT NỐI LIÊN QUAN</span>
                  </h3>
                  <Link to="/chuong-trinh" className="text-xs font-bold text-blue-600 hover:underline">
                    Xem tất cả
                  </Link>
                </div>

                <div className="space-y-3">
                  {relatedPrograms.map((prog) => (
                    <div key={prog.id} className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200 transition space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">
                          {prog.time || 'Sắp diễn ra'}
                        </span>
                        <span className="text-slate-500 font-medium">{prog.zone || 'Toàn quốc'}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 font-heading line-clamp-1">
                        {prog.title}
                      </h4>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">{prog.location}</span>
                        <Link 
                          to="/ngay-hoi-chuoi-cung-ung" 
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1"
                        >
                          <span>Đăng ký tham gia</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Catalogues */}
            {category.catalogues && category.catalogues.length > 0 && (
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>CATALOGUE & BỘ HỒ SƠ NGÀNH</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.catalogues.map((catl) => (
                    <div key={catl.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{catl.title}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {catl.format} • {catl.size} • {catl.pages} trang
                        </p>
                      </div>
                      <a
                        href="#download"
                        onClick={(e) => { e.preventDefault(); alert("Đang chuẩn bị tệp tải về..."); }}
                        className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition shrink-0"
                        title="Tải catalogue"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </div>

      {/* =========================================================================
          SUPPI CONTEXT INTERACTION MODAL
         ========================================================================= */}
      {isSuppiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">Trợ lý Sourcing SUPPI</h3>
                  <p className="text-[11px] text-slate-500">Ngữ cảnh: {category.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSuppiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {suppiResponse && (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-slate-700 leading-relaxed space-y-2">
                  <div className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{suppiResponse.title}</span>
                  </div>
                  <p>{suppiResponse.text}</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      const draftId = `req-${Date.now()}`;
                      localStorage.setItem('ccu_current_requirement_draft', JSON.stringify({
                        id: draftId,
                        categoryId: category.id,
                        categoryName: category.name,
                        sourcePage: 'CATEGORY_PAGE',
                        sourceSlug: category.slug,
                        initialDescription: suppiQuery
                      }));
                      setIsSuppiModalOpen(false);
                      navigate(`/dang-nhu-cau?draft=${draftId}`);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    Tạo Requirement Draft ngay
                  </button>

                  <button
                    onClick={() => {
                      setIsSuppiModalOpen(false);
                      navigate(`/tro-ly-ai?q=${encodeURIComponent(suppiQuery)}`);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    Mở phiên trò chuyện sâu với SUPPI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE STICKY ACTION DOCK (390PX READY)
         ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-blue-700 truncate font-mono">
            {category.name}
          </div>
          <div className="text-xs font-bold text-slate-900">
            {totalCount} nhà cung ứng
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handleAskSuppi(`Tìm nhà cung ứng ${category.name}`)}
            className="px-3.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Hỏi SUPPI</span>
          </button>

          <button
            onClick={() => {
              const draftId = `req-${Date.now()}`;
              localStorage.setItem('ccu_current_requirement_draft', JSON.stringify({
                id: draftId,
                categoryId: category.id,
                categoryName: category.name,
                sourcePage: 'CATEGORY_PAGE'
              }));
              navigate(`/dang-nhu-cau?draft=${draftId}`);
            }}
            className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Đăng nhu cầu
          </button>
        </div>
      </div>

    </main>
  );
}
