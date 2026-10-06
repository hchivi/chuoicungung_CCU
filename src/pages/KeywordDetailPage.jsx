import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Building2, ChevronRight, ArrowRight, RotateCcw, 
  ShieldCheck, Tag, Phone, Globe, ArrowUp, ChevronDown, Key, Sparkles,
  ChevronLeft, ArrowLeft, Wrench, Factory, Cpu, Truck, Users, Leaf,
  ExternalLink, FileText, Download, CheckCircle2, AlertCircle, Bot,
  Send, HelpCircle, Filter, X, SlidersHorizontal, Package, Calendar, Award,
  Play, FolderCheck
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
  getKeywordClusterBySlug,
  getKeywordProducts,
  getKeywordFoundingPartner,
  getKeywordPrograms
} from '../data/keywordClustersData';

export { slugify };

const PROVINCES = [
  "Toàn quốc", "Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Hà Nội", "Bắc Ninh", 
  "Hải Phòng", "Long An", "Đà Nẵng", "Bà Rịa - Vũng Tàu", "Hưng Yên", "Hải Dương", 
  "Vĩnh Phúc", "Bắc Giang", "Quảng Nam", "Quảng Ngãi", "Khánh Hòa", "Cần Thơ", "Thái Nguyên"
];

export default function KeywordDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  // Resolve Canonical Keyword Cluster
  const cluster = useMemo(() => {
    const qParam = searchParams.get('q') || searchParams.get('label') || searchParams.get('name');
    return getKeywordClusterBySlug(slug, qParam);
  }, [slug, searchParams]);

  // Dynamic filter state - keyed by filterSchema ID
  const [dynamicFilters, setDynamicFilters] = useState({});
  const [selectedProvince, setSelectedProvince] = useState('Toàn quốc');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
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
  const foundingPartner = useMemo(() => getKeywordFoundingPartner(cluster), [cluster]);
  const relatedProducts = useMemo(() => getKeywordProducts(cluster), [cluster]);
  const relatedPrograms = useMemo(() => getKeywordPrograms(cluster), [cluster]);

  // SEO & Schema Management
  useEffect(() => {
    if (!cluster) return;
    document.title = `${cluster.name} – Tìm nhà cung ứng | CHUOICUNGUNG.COM`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = cluster.seoDescription || `${cluster.name} – Tìm nhà cung ứng, xưởng chế tạo và nhu cầu mua sắm B2B uy tín. Tìm kiếm theo năng lực thật, khu vực phục vụ, MOQ và gửi yêu cầu kết nối trực tiếp.`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://chuoicungung.com/tu-khoa/${slug || cluster.slug}`;

    // Schema JSON-LD (CollectionPage, ItemList, BreadcrumbList, FAQPage)
    const scriptId = 'keyword-landing-jsonld';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaObj = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `https://chuoicungung.com/tu-khoa/${cluster.slug}`,
          "name": cluster.name,
          "description": cluster.shortDescription,
          "url": `https://chuoicungung.com/tu-khoa/${cluster.slug}`
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://chuoicungung.com/" },
            { "@type": "ListItem", "position": 2, "name": cluster.stageName, "item": `https://chuoicungung.com/ban-do-6-giai-doan` },
            { "@type": "ListItem", "position": 3, "name": cluster.categoryName, "item": `https://chuoicungung.com/nganh-nghe/${cluster.categorySlug}` },
            { "@type": "ListItem", "position": 4, "name": cluster.name, "item": `https://chuoicungung.com/tu-khoa/${cluster.slug}` }
          ]
        }
      ]
    };

    if (Array.isArray(cluster.faqs) && cluster.faqs.length > 0) {
      schemaObj["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": cluster.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      });
    }

    scriptTag.text = JSON.stringify(schemaObj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [cluster]);

  // Filter matching suppliers from enterprises database
  const matchingEnterprises = useMemo(() => {
    if (!cluster) return [];
    const qTokens = (cluster.name || cluster.slug || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .split(/\s+/).filter(t => t.length > 2);

    let list = enterprisesFullList.filter(e => {
      const tokens = (
        `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${e.province || ''} ${Array.isArray(e.products) ? e.products.join(' ') : ''}`
      ).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

      // Check if at least 2 tokens match or name matches category
      const matchCount = qTokens.filter(t => tokens.includes(t)).length;
      return matchCount >= Math.min(qTokens.length, 2);
    });

    // Fallback if strict token match is small
    if (list.length < 5) {
      const catLower = (cluster.categoryName || '').toLowerCase();
      const broad = enterprisesFullList.filter(e => {
        const c = (e.category || e.industry || '').toLowerCase();
        return c.includes(catLower) || catLower.includes(c);
      });
      list = Array.from(new Set([...list, ...broad]));
    }

    // Filter by Province
    if (selectedProvince !== 'Toàn quốc') {
      list = list.filter(e => e.province && (e.province === selectedProvince || e.province.includes(selectedProvince)));
    }

    // Filter by Verified B2B
    if (onlyVerified) {
      list = list.filter(e => e.isVerified);
    }

    // Filter by Keyword Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(e => 
        (e.name || '').toLowerCase().includes(q) ||
        (e.address || '').toLowerCase().includes(q) ||
        (e.products && e.products.some(p => p.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [cluster, selectedProvince, onlyVerified, searchTerm]);

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
      keywordId: cluster.id,
      keywordClusterId: cluster.id,
      keywordName: cluster.name,
      keywordSlug: cluster.slug,
      categoryId: cluster.categoryId,
      categoryName: cluster.categoryName,
      phaseId: cluster.phaseId,
      stageId: cluster.stageId,
      sourcePage: 'KEYWORD_PAGE',
      sourceSlug: cluster.slug,
      initialDescription: draftNote,
      province: selectedProvince !== 'Toàn quốc' ? selectedProvince : undefined,
      appliedFilters: dynamicFilters,
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

  // Handle SUPPI Ask in Keyword Context
  const handleAskSuppi = (promptText) => {
    const q = promptText || suppiQuery;
    if (!q) return;

    setIsSuppiModalOpen(true);
    setSuppiQuery(q);

    const loc = selectedProvince !== 'Toàn quốc' ? `tại ${selectedProvince}` : 'trên toàn quốc';
    setSuppiResponse({
      title: `SUPPI Đã Tiếp Nhận Yêu Cầu Cho Nhu Cầu: ${cluster.name}`,
      text: `Hệ thống ghi nhận nhu cầu của bạn ${loc}. Đã phân tích sẵn danh mục "${cluster.categoryName}" và ${totalCount} nhà cung ứng liên kết. Bạn có muốn tạo ngay bản nháp Requirement để nhận báo giá?`,
      actionDraft: {
        keywordId: cluster.id,
        keywordName: cluster.name,
        notes: q,
        location: selectedProvince
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#FBFBFC] pb-24 font-sans text-slate-900 antialiased space-y-10">
      
      {/* Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">

        {/* =========================================================================
            01. HERO
           ========================================================================= */}
        {/* Breadcrumb: Trang chủ → Giai đoạn → Category → Keyword */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium flex-wrap gap-y-1">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/ban-do-6-giai-doan" className="hover:text-blue-600 transition">
            Giai đoạn {cluster.stageId}: {cluster.stageName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to={`/nganh-nghe/${cluster.categorySlug}`} className="hover:text-blue-600 transition">
            {cluster.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-blue-600 font-bold truncate max-w-[240px] sm:max-w-xs">{cluster.name}</span>
        </nav>

        <section className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 lg:p-10">
          <div className="absolute top-0 right-0 w-full sm:w-[55%] md:w-[50%] h-full pointer-events-none overflow-hidden z-0 select-none">
            <img 
              src={cluster.bannerImage} 
              alt={cluster.name}
              className="w-full h-full object-cover object-center scale-105 opacity-80"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 via-35% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-white/40" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>BUYER INTENT SOURCING • {cluster.phaseName}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-slate-950 leading-tight">
                Tìm nhà cung ứng {cluster.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {cluster.buyerIntent}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#keyword-suppliers-grid"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center space-x-2 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Tìm nhà cung ứng</span>
              </a>

              <Link
                to={`/dang-nhu-cau?keyword=${encodeURIComponent(cluster.name)}`}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 flex items-center space-x-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>Đăng nhu cầu {cluster.name}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            02. SEARCH / FILTER (DYNAMIC FILTER SCHEMA)
           ========================================================================= */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 font-heading">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>BỘ LỌC ĐẶC THÙ CHO NHU CẦU NÀY</span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-slate-500">
                Tìm thấy <strong className="text-blue-600 font-mono">{totalCount}</strong> nhà cung ứng liên quan
              </span>
              {(selectedProvince !== 'Toàn quốc' || onlyVerified || searchTerm || Object.keys(dynamicFilters).length > 0) && (
                <button
                  onClick={() => {
                    setSelectedProvince('Toàn quốc');
                    setOnlyVerified(false);
                    setSearchTerm('');
                    setDynamicFilters({});
                    setCurrentPage(1);
                  }}
                  className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Tìm tên xưởng, quy cách, thiết bị..."
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

            {/* Dynamic Filters rendered from keyword filterSchema */}
            {cluster.filterSchema && cluster.filterSchema.map((filterItem) => (
              <div key={filterItem.id} className="sm:col-span-3">
                <select
                  value={dynamicFilters[filterItem.id] || 'all'}
                  onChange={(e) => {
                    setDynamicFilters(prev => ({ ...prev, [filterItem.id]: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  {filterItem.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* Verified B2B Only */}
            <div className="sm:col-span-2 flex items-center">
              <label className="flex items-center space-x-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition w-full">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => { setOnlyVerified(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Verified</span>
              </label>
            </div>
          </div>
        </section>

        {/* =========================================================================
            03. ĐĂNG NHU CẦU (CALLOUT)
           ========================================================================= */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[11px] font-bold">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span>TIẾP NHẬN & ĐỐI SOÁT NHU CẦU BẢO MẬT</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              Bạn đang có nhu cầu cụ thể cho {cluster.name}?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Mô tả nhanh số lượng dự kiến, quy cách kỹ thuật hoặc mốc thời gian cần hoàn thành. Hệ thống SUPPI sẽ đối soát thông số với các xưởng đủ điều kiện và gửi bản nháp kết nối.
            </p>

            <form onSubmit={handleCreateDraft} className="space-y-3 pt-1">
              <textarea
                rows={2}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder={`Ví dụ: Tôi cần đơn vị cung cấp ${cluster.name} giao tại ${selectedProvince !== 'Toàn quốc' ? selectedProvince : 'nhà máy'}, cần gửi mẫu thử trong tuần tới...`}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 italic">
                  * Yêu cầu sẽ được khởi tạo dưới dạng Bản nháp bảo mật, không tự động công khai.
                </span>

                <button
                  type="submit"
                  disabled={isSubmittingDraft || !draftNote.trim()}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-white/20 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingDraft ? 'Đang tạo nháp...' : 'ĐỂ SUPPI LÀM RÕ & TÌM NGUỒN'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* =========================================================================
            04. FOUNDING PARTNER (SPONSORED BLOCK - STRICTLY LABELED)
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
                        e.target.src = "/logo_onlyc.png";
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
            05. NHÀ CUNG ỨNG LIÊN QUAN (REAL DATABASE)
           ========================================================================= */}
        <section id="keyword-suppliers-grid" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                NHÀ CUNG ỨNG CÓ NĂNG LỰC PHÙ HỢP
              </h2>
              <p className="text-xs text-slate-500">
                Xác thực năng lực từ cơ sở dữ liệu nhà máy và xưởng sản xuất thực tế
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
                Hãy thử chọn lại khu vực "Toàn quốc" hoặc xóa bớt tiêu chí lọc.
              </p>
              <button
                onClick={() => { setSelectedProvince('Toàn quốc'); setSearchTerm(''); setOnlyVerified(false); setDynamicFilters({}); }}
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
                              e.target.src = "/logo_onlyc.png";
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
                          <span className="truncate">{ent.category || ent.industry || cluster.categoryName}</span>
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
                            keywordId: cluster.id,
                            keywordName: cluster.name,
                            preferredSupplierId: ent.id,
                            preferredSupplierName: ent.name,
                            sourcePage: 'KEYWORD_PAGE'
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
            06. BUYER GUIDE (DYNAMIC CHECKLIST PER KEYWORD)
           ========================================================================= */}
        {cluster.buyerGuide && (
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                  {cluster.buyerGuide.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Chuẩn bị đầy đủ thông số trước khi trao đổi giúp rút ngắn quy trình phê duyệt giá từ nhà máy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cluster.buyerGuide.items.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
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
            07. BỘ HỒ SƠ ĐỀ XUẤT NGUỒN CUNG (SOURCING DOSSIER - PUBLIC ONLY)
           ========================================================================= */}
        {cluster.sourcingDossier && cluster.sourcingDossier.isPublic && (
          <section className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 space-y-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FolderCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded font-mono">
                      BỘ HỒ SƠ ĐỀ XUẤT NGUỒN CUNG
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Cập nhật: {cluster.sourcingDossier.updatedAt}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 font-heading pt-0.5">
                    {cluster.sourcingDossier.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => handleAskSuppi(`Yêu cầu xem bộ hồ sơ đề xuất nguồn cung: ${cluster.sourcingDossier.title}`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5"
              >
                <span>Yêu cầu tiếp cận hồ sơ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Mục đích:</strong> {cluster.sourcingDossier.purpose}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 font-heading">Tiêu chí tuyển chọn nhà cung ứng:</h4>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  {cluster.sourcingDossier.selectionCriteria.map((c, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 font-heading">Đơn vị được đưa vào danh sách ngắn:</h4>
                <ul className="space-y-1.5 text-[11px] text-slate-700 font-medium">
                  {cluster.sourcingDossier.selectedSuppliers.map((s, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                {cluster.sourcingDossier.missingInfoPrompt && (
                  <div className="pt-2 text-[10px] text-amber-700 italic border-t border-slate-200">
                    * Lưu ý: {cluster.sourcingDossier.missingInfoPrompt}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            08. VIDEO & 09. CATALOGUE & 10. CHƯƠNG TRÌNH (HIDE IF NO DATA)
           ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Video Block if available */}
          {cluster.video && (
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center space-x-2">
                  <Play className="w-4 h-4 text-rose-600" />
                  <span>VIDEO NĂNG LỰC / KHẢO SÁT THỰC ĐỊA</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">{cluster.video.duration}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{cluster.video.title}</h4>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <iframe
                  src={cluster.video.embedUrl}
                  title={cluster.video.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Programmes Block if available */}
          {relatedPrograms.length > 0 && (
            <div className={`${cluster.video ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>CHƯƠNG TRÌNH KẾT NỐI LIÊN QUAN</span>
                </h3>
                <Link to="/chuong-trinh" className="text-xs font-bold text-blue-600 hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-2.5">
                {relatedPrograms.map(prog => (
                  <div key={prog.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-blue-700 font-mono">{prog.time}</span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prog.title}</h4>
                      <p className="text-[11px] text-slate-500">{prog.location}</p>
                    </div>
                    <Link
                      to="/ngay-hoi-chuoi-cung-ung"
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shrink-0 hover:bg-blue-700 transition"
                    >
                      Đăng ký
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            11. FAQ (CÂU HỎI THƯỜNG GẶP PHỤC VỤ BUYER INTENT)
           ========================================================================= */}
        {Array.isArray(cluster.faqs) && cluster.faqs.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                CÂU HỎI THƯỜNG GẶP KHI TÌM NGUỒN CUNG ỨNG
              </h2>
              <p className="text-xs text-slate-500">
                Giải đáp các thắc mắc về điều kiện nhận đơn, quy trình làm mẫu và bảo mật thông tin
              </p>
            </div>

            <div className="space-y-3">
              {cluster.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-900 font-heading flex items-center space-x-2">
                    <span className="text-blue-600 font-mono font-bold">Q{idx + 1}:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6 font-normal">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* =========================================================================
          12. SUPPI CONTEXT INTERACTION MODAL
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
                  <p className="text-[11px] text-slate-500">Ngữ cảnh: {cluster.name}</p>
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
                        keywordId: cluster.id,
                        keywordName: cluster.name,
                        categoryId: cluster.categoryId,
                        categoryName: cluster.categoryName,
                        sourcePage: 'KEYWORD_PAGE',
                        sourceSlug: cluster.slug,
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
          16. MOBILE STICKY ACTION DOCK (390PX READY)
         ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-blue-700 truncate font-mono">
            {cluster.name}
          </div>
          <div className="text-xs font-bold text-slate-900">
            {totalCount} nhà cung ứng
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handleAskSuppi(`Tôi cần tìm nguồn cho ${cluster.name}`)}
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
                keywordId: cluster.id,
                keywordName: cluster.name,
                sourcePage: 'KEYWORD_PAGE'
              }));
              navigate(`/dang-nhu-cau?draft=${draftId}`);
            }}
            className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Gửi nhu cầu
          </button>
        </div>
      </div>

    </main>
  );
}
