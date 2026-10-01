import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Filter, ShoppingBag, MapPin, Building2, Calendar,
  Clock, PlusCircle, ArrowRight, ChevronRight, RotateCcw,
  CheckCircle2, AlertCircle, Sparkles, Users, Eye, ShieldCheck,
  Send, Bot, ChevronDown, Check, X, FileText, Factory, Layers,
  ExternalLink, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getPublicRequirements, 
  evaluateSupplierRelevance,
  getSupplierResponseForRequirement
} from '../data/requirementsData';
import { MASTER_SIX_STAGES } from '../data/sixStagesData';
import SupplierResponseModal from '../components/demands/SupplierResponseModal';
import SuppiDemandAssistantModal from '../components/demands/SuppiDemandAssistantModal';
import AuthModal from '../components/auth/AuthModal';
import B2bTradeNetworkCanvas from '../components/demands/B2bTradeNetworkCanvas';

export default function DemandsPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedSampleReq, setSelectedSampleReq] = useState(false);
  const [selectedSurveyReq, setSelectedSurveyReq] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest | expiring_soon
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Authenticated user state from session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isLoggedIn: false,
      name: 'Khách vãng lai',
      role: 'Guest',
      orgName: '',
      orgId: null,
      industry: 'May mặc & Bảo hộ lao động',
      location: 'Đồng Nai'
    };
  });

  // Modals state
  const [responseModal, setResponseModal] = useState({ isOpen: false, requirement: null });
  const [suppiModal, setSuppiModal] = useState({ isOpen: false, requirement: null });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, requirement: null });

  // Update session listener
  const refreshUserSession = () => {
    try {
      const saved = localStorage.getItem('ccu_user_session');
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch (e) {}
  };

  // Lấy danh sách Nhu cầu công khai đã sanitize từ Service
  const publicDemands = useMemo(() => {
    return getPublicRequirements({
      search: searchTerm,
      stageId: selectedStage,
      category: selectedCategory,
      province: selectedProvince,
      sampleRequired: selectedSampleReq,
      surveyRequired: selectedSurveyReq,
      sortBy: sortBy
    });
  }, [searchTerm, selectedStage, selectedCategory, selectedProvince, selectedSampleReq, selectedSurveyReq, sortBy]);

  // Danh mục chuyên mục duy nhất từ danh sách
  const categoriesList = useMemo(() => {
    const set = new Set();
    publicDemands.forEach(d => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, [publicDemands]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStage('all');
    setSelectedCategory('all');
    setSelectedProvince('all');
    setSelectedSampleReq(false);
    setSelectedSurveyReq(false);
    setSortBy('newest');
  };

  // SEO Schema, Document Title & Self-Canonical
  useEffect(() => {
    document.title = 'Sàn nhu cầu | CHUOICUNGUNG.COM';

    // Canonical link setup
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://chuoicungung.com/san-nhu-cau';

    // Meta description setup
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Sàn tiếp nhận và điều phối nhu cầu mua hàng công nghiệp, tìm nhà cung ứng phụ trợ, thiết bị nhà máy, bao bì, cơ khí và bảo trì tại 480+ KCN Việt Nam.';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Sàn nhu cầu | CHUOICUNGUNG.COM",
      "description": "Sàn tiếp nhận và điều phối nhu cầu mua hàng công nghiệp, tìm nhà cung ứng phụ trợ, thiết bị nhà máy, bao bì, cơ khí và bảo trì tại 480+ KCN Việt Nam.",
      "url": "https://chuoicungung.com/san-nhu-cau",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": publicDemands.slice(0, 10).map((d, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": d.title,
          "description": d.publicSummary,
          "url": `https://chuoicungung.com/san-nhu-cau/${d.id}`
        }))
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'san-nhu-cau-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('san-nhu-cau-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('san-nhu-cau-schema');
      if (el) el.remove();
    };
  }, [publicDemands]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Light Premium Sourcing Command Deck with Visual Panorama)  */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-[#eef2f6] border-b border-slate-200/80 pb-12 sm:pb-16 text-slate-900">

        {/* Right Half Sourcing Photo with Smooth Light Blend & Dynamic Network Canvas */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img
            src="/images/b2b_sourcing_demand_hero.jpg"
            alt="B2B Sourcing Demands Marketplace"
            className="w-full h-full object-cover object-center scale-105 opacity-20 mix-blend-multiply"
          />
          {/* Live Global Supply Chain Arc & RFQ Pulse Canvas */}
          <B2bTradeNetworkCanvas className="absolute inset-0 z-[2] opacity-45" />
          
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-white via-white/85 lg:via-white/60 to-transparent"></div>
          <div className="absolute inset-0 z-[3] bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Subtle Optical Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-slate-200/40 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4 sm:space-y-5">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar touch-scroll whitespace-nowrap py-0.5">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:text-slate-900 transition shrink-0 p-0.5 group">
                <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain group-hover:scale-110 transition-transform" />
                <span className="ml-1.5 text-slate-600 group-hover:text-slate-900">Trang chủ</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-semibold">
                Sàn nhu cầu mua sắm B2B
              </span>
            </nav>

            {/* Eyebrow Capsule */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0052cc] text-xs font-mono font-bold tracking-wider uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CỔNG GIAO DỊCH NHU CẦU &amp; TÌM NGUỒN CUNG ỨNG B2B</span>
            </div>

            {/* Exact H1 Title: Nhu cầu mua hàng và tìm nhà cung ứng */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[48px] font-black tracking-tight text-slate-950 leading-[1.14] font-heading">
              Nhu cầu mua hàng và tìm nhà cung ứng
            </h1>

            {/* Exact Description */}
            <p className="text-sm sm:text-base md:text-[16px] text-slate-600 leading-relaxed font-normal max-w-2xl">
              Điều phối đơn hàng công nghiệp trực tiếp giữa các Nhà máy, Bên mua FDI và mạng lưới Nhà cung ứng phụ trợ tại 480+ KCN trên toàn quốc. Tiêu chuẩn kỹ thuật minh bạch, bảo mật danh tính doanh nghiệp cho đến khi phê duyệt Shortlist.
            </p>

            {/* Exact Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dang-nhu-cau"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer font-heading"
              >
                <PlusCircle className="w-4 h-4 text-sky-200" />
                <span>Đăng nhu cầu / Tìm cơ hội</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (!currentUser?.isLoggedIn) {
                    setAuthModalOpen(true);
                  } else {
                    navigate('/tao-ho-so');
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 border border-slate-300 hover:border-slate-400 shadow-xs font-semibold text-xs sm:text-sm hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>Hoàn thiện hồ sơ năng lực</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 & 03 — SEARCH & FILTERS (ACCESSIBLE LABELS & IDS - STICKY)      */}
      {/* ========================================================================= */}
      <section aria-label="Bộ lọc tìm kiếm nhu cầu mua hàng" className="sticky top-[76px] sm:top-[88px] z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 py-2 transition-all">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/90 p-4 sm:p-5 space-y-4">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="demand-search-input" className="sr-only">
              Tìm nhu cầu theo sản phẩm, dịch vụ hoặc ngành
            </label>
            <input
              id="demand-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm nhu cầu theo sản phẩm, dịch vụ hoặc ngành..."
              aria-label="Tìm nhu cầu theo sản phẩm, dịch vụ hoặc ngành..."
              className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Primary Quick Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            
            {/* Giai đoạn (6 Stages) */}
            <div className="space-y-1">
              <label htmlFor="demand-stage-filter" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Giai đoạn vòng đời
              </label>
              <select
                id="demand-stage-filter"
                aria-label="Lọc theo giai đoạn vòng đời"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0052cc]"
              >
                <option value="all">Tất cả 6 giai đoạn</option>
                {MASTER_SIX_STAGES.map(s => (
                  <option key={s.id} value={s.id}>
                    GĐ {s.order}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nhóm nhu cầu / Category */}
            <div className="space-y-1">
              <label htmlFor="demand-category-filter" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Chuyên mục ngành
              </label>
              <select
                id="demand-category-filter"
                aria-label="Lọc theo chuyên mục ngành"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0052cc]"
              >
                <option value="all">Tất cả chuyên mục</option>
                {categoriesList.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tỉnh / thành */}
            <div className="space-y-1">
              <label htmlFor="demand-province-filter" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Tỉnh / Khu vực
              </label>
              <select
                id="demand-province-filter"
                aria-label="Lọc theo tỉnh hoặc khu vực"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0052cc]"
              >
                <option value="all">Toàn quốc</option>
                <option value="Đồng Nai">Đồng Nai</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Long An">Long An</option>
                <option value="Bắc Ninh">Bắc Ninh</option>
                <option value="Bình Phước">Bình Phước</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-1">
              <label htmlFor="demand-sort-filter" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Sắp xếp theo
              </label>
              <select
                id="demand-sort-filter"
                aria-label="Sắp xếp danh sách nhu cầu"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0052cc]"
              >
                <option value="newest">Mới nhất</option>
                <option value="expiring_soon">Sắp hết hạn phản hồi</option>
              </select>
            </div>

          </div>

          {/* Advanced Filters Toggle (Cần mẫu / Cần khảo sát) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="demand-sample-req" className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  id="demand-sample-req"
                  type="checkbox"
                  checked={selectedSampleReq}
                  onChange={(e) => setSelectedSampleReq(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="font-medium">Chỉ xem nhu cầu cần gửi mẫu trước</span>
              </label>

              <label htmlFor="demand-survey-req" className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  id="demand-survey-req"
                  type="checkbox"
                  checked={selectedSurveyReq}
                  onChange={(e) => setSelectedSurveyReq(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="font-medium">Yêu cầu khảo sát nhà xưởng</span>
              </label>
            </div>

            {(searchTerm || selectedStage !== 'all' || selectedCategory !== 'all' || selectedProvince !== 'all' || selectedSampleReq || selectedSurveyReq) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                Đặt lại bộ lọc
              </button>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — DEMAND FEED (SECTION 04 SPEC 11.TXT) */}
      {/* ========================================================================= */}
      <section aria-label="Danh sách gói thầu và nhu cầu mua hàng B2B" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Results Counter & Sourcing Rule Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs text-slate-600">
            Hiển thị <strong>{publicDemands.length}</strong> nhu cầu B2B được phép công bố trên hệ thống
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thông tin liên hệ của Buyer được mã hóa và chỉ kết nối khi hồ sơ được Shortlist.</span>
          </div>
        </div>

        {/* Empty State */}
        {publicDemands.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">
              Không tìm thấy nhu cầu phù hợp với bộ lọc hiện tại
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Bạn có thể điều chỉnh lại từ khóa tìm kiếm, chuyên mục hoặc đặt lại bộ lọc để xem các nhu cầu khác.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#0052cc] text-white rounded-xl text-xs font-bold hover:bg-[#0047a5] transition"
            >
              Xem tất cả nhu cầu
            </button>
          </div>
        ) : (
          /* Grid of Requirement Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicDemands.map((demand) => {
              // Kiểm tra xem supplier đã response chưa (Anti-duplicate - Section 10)
              const existingResponse = currentUser?.isLoggedIn 
                ? getSupplierResponseForRequirement(demand.id, currentUser.orgId || currentUser.name)
                : null;

              // Đánh giá mức độ phù hợp thực tế (Matching - Section 12)
              const relevance = currentUser?.isLoggedIn
                ? evaluateSupplierRelevance(demand, currentUser)
                : null;

              const isClosed = demand.status === 'CLOSED';

              return (
                <div
                  key={demand.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  
                  {/* Card Header & Badges */}
                  <div className="p-5 pb-3 space-y-3">
                    
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#0052cc] text-[11px] font-mono font-bold">
                        {demand.publicCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isClosed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isClosed ? 'Đã đóng tiếp nhận' : 'Đang tìm nguồn'}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading group-hover:text-[#0052cc] transition line-clamp-2 leading-snug">
                      {demand.title}
                    </h2>

                    {/* Buyer Summary Description (Section 04: "Nhà máy ngành điện tử tại Đồng Nai") */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{demand.buyerDisplayName}</span>
                    </div>

                    {/* Key Specs Matrix */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      
                      {/* Nhóm ngành */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Chuyên mục</span>
                        <span className="font-semibold text-slate-800 truncate block" title={demand.category}>
                          {demand.category}
                        </span>
                      </div>

                      {/* Khu vực */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Khu vực</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {demand.province}
                        </span>
                      </div>

                      {/* Số lượng */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Số lượng</span>
                        <span className="font-bold text-slate-900">
                          {demand.quantity ? `${demand.quantity} ${demand.unit}` : 'Theo thỏa thuận'}
                        </span>
                      </div>

                      {/* Thời hạn cần */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block font-heading uppercase">Thời hạn</span>
                        <span className="font-bold text-amber-700 truncate block font-mono">
                          {demand.deadline || 'Sớm nhất'}
                        </span>
                      </div>

                    </div>

                    {/* Điều kiện mẫu / Khảo sát */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                      {demand.sampleRequired && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          Cần gửi mẫu trước
                        </span>
                      )}
                      {demand.surveyRequired && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 font-medium">
                          Khảo sát hiện trường
                        </span>
                      )}
                      {demand.stageName && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {demand.stageName}
                        </span>
                      )}
                    </div>

                    {/* Matching relevance badge (Section 12) */}
                    {relevance && (
                      <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1 text-xs">
                        <div className="font-bold text-blue-900 text-[11px] flex items-center justify-between">
                          <span>{relevance.badgeText}</span>
                        </div>
                        <div className="space-y-0.5 text-[11px] text-slate-600">
                          {relevance.checks.map((c, i) => (
                            <div key={i} className="flex items-center gap-1">
                              {c.pass === true ? (
                                <span className="text-emerald-600 font-bold">✓</span>
                              ) : c.pass === false ? (
                                <span className="text-rose-500 font-bold">✗</span>
                              ) : (
                                <span className="text-amber-500 font-bold">?</span>
                              )}
                              <span>{c.title}: {c.note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Already Responded Badge (Section 10) */}
                    {existingResponse && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                        <span className="font-semibold text-[11px]">
                          Đã phản hồi ({existingResponse.responseStatus})
                        </span>
                        <span className="text-[10px] text-amber-700">
                          {new Date(existingResponse.submittedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Card Bottom CTA Bar (Section 04) */}
                  <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    
                    {/* View Details Button */}
                    <button
                      onClick={() => setDetailModal({ isOpen: true, requirement: demand })}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white hover:border-slate-300 transition text-center"
                    >
                      XEM CHI TIẾT
                    </button>

                    {/* Main CTA: “TÔI CÓ KHẢ NĂNG ĐÁP ỨNG” (Section 07 & 14) */}
                    <button
                      disabled={isClosed}
                      onClick={() => setResponseModal({ isOpen: true, requirement: demand })}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                        isClosed 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : existingResponse
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-[#0052cc] hover:bg-[#0047a5] text-white shadow-blue-500/10'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{existingResponse ? 'CẬP NHẬT' : 'TÔI CÓ KHẢ NĂNG'}</span>
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — RELATED SOURCING LINKS (BREADCRUMB & HUBS CÓ CĂN CỨ) */}
      {/* ========================================================================= */}
      <section aria-label="Tra cứu liên quan trong hệ sinh thái Chuỗi Cung Ứng" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Tra cứu liên kết trong Hệ sinh thái Chuỗi Cung Ứng</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Kết nối nhanh giữa dữ liệu nhu cầu mua sắm thực tế với mạng lưới nhà máy và hạ tầng công nghiệp.
              </p>
            </div>
            <Link
              to="/6-giai-doan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 shrink-0"
            >
              <span>Xem cấu trúc 6 Giai đoạn &amp; 18 Pha</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/ban-do-kcn"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                  Bản đồ 480+ KCN &amp; CCN
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Định vị các nhà máy, cụm công nghiệp vệ tinh và bán kính cung ứng theo tỉnh thành.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                <span>Khám phá bản đồ</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>

            <Link
              to="/tra-cuu"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition">
                  32.000+ Nhà cung ứng
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dữ liệu nhà sản xuất phụ trợ, gia công cơ khí, bao bì, tự động hóa đã xác minh MST.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span>Tra cứu nhà cung ứng</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>

            <Link
              to="/dang-nhu-cau"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition">
                  Đăng gói mua sắm B2B
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dành cho Buyer/Nhà máy: Tiếp nhận báo giá và hồ sơ năng lực tiêu chuẩn từ NCC xác thực.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                <span>Mở gói tìm nguồn</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>

            <Link
              to="/dang-ky-ncc"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Factory className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">
                  Đăng ký Nhà cung ứng
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Đưa hồ sơ xưởng sản xuất vào mạng lưới để nhận thông báo chào thầu tự động.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                <span>Tạo hồ sơ năng lực</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SAFE DETAIL MODAL (REUSE PUBLIC SUMMARY, ZERO SENSITIVE DATA EXPOSED) */}
      {/* ========================================================================= */}
      {detailModal.isOpen && detailModal.requirement && (
        <div className="fixed inset-0 z-[1100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 max-h-[90vh] overflow-y-auto space-y-6 text-slate-900 animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setDetailModal({ isOpen: false, requirement: null })}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-slate-100 pb-4 pr-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0052cc] font-mono font-bold text-xs">
                  {detailModal.requirement.publicCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs">
                  {detailModal.requirement.status === 'ACTIVE_SOURCING' ? 'Đang tìm nguồn' : 'Đã đóng'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading leading-snug">
                {detailModal.requirement.title}
              </h2>
              <div className="text-xs text-slate-500">
                Đăng bởi: <strong>{detailModal.requirement.buyerDisplayName}</strong>
              </div>
            </div>

            {/* Public Summary Details */}
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="space-y-1">
                <span className="font-extrabold uppercase text-slate-500 font-heading block">
                  Mô tả nhu cầu tóm tắt:
                </span>
                <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {detailModal.requirement.publicSummary}
                </p>
              </div>

              {detailModal.requirement.publicRequirements?.length > 0 && (
                <div className="space-y-2">
                  <span className="font-extrabold uppercase text-slate-500 font-heading block">
                    Yêu cầu kỹ thuật & Điều kiện tham gia:
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600">
                    {detailModal.requirement.publicRequirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grid attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Chuyên mục:</span>
                  <strong className="text-slate-800">{detailModal.requirement.category}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Sản phẩm cần:</span>
                  <strong className="text-slate-800">{detailModal.requirement.productService}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Địa bàn & KCN:</span>
                  <strong className="text-slate-800">{detailModal.requirement.province} {detailModal.requirement.industrialPark ? `(${detailModal.requirement.industrialPark})` : ''}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số lượng:</span>
                  <strong className="text-slate-800">{detailModal.requirement.quantity ? `${detailModal.requirement.quantity} ${detailModal.requirement.unit}` : 'Thỏa thuận'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Hạn tiếp nhận:</span>
                  <strong className="text-amber-700 font-mono">{detailModal.requirement.deadline || 'Sớm nhất'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gửi mẫu thử:</span>
                  <strong className="text-slate-800">{detailModal.requirement.sampleRequired ? 'Bắt buộc' : 'Không bắt buộc'}</strong>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const req = detailModal.requirement;
                  setDetailModal({ isOpen: false, requirement: null });
                  setSuppiModal({ isOpen: true, requirement: req });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <Bot className="w-4 h-4" />
                <span>Hỏi SUPPI về điều kiện đáp ứng</span>
              </button>

              <button
                disabled={detailModal.requirement.status === 'CLOSED'}
                onClick={() => {
                  const req = detailModal.requirement;
                  setDetailModal({ isOpen: false, requirement: null });
                  setResponseModal({ isOpen: true, requirement: req });
                }}
                className="py-2.5 px-6 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>TÔI CÓ KHẢ NĂNG ĐÁP ỨNG</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESPONSE MODAL, SUPPI MODAL & AUTH MODAL */}
      {/* ========================================================================= */}
      <SupplierResponseModal
        isOpen={responseModal.isOpen}
        onClose={() => setResponseModal({ isOpen: false, requirement: null })}
        requirement={responseModal.requirement}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onResponseSubmitted={() => {
          // Re-render
          refreshUserSession();
        }}
      />

      <SuppiDemandAssistantModal
        isOpen={suppiModal.isOpen}
        onClose={() => setSuppiModal({ isOpen: false, requirement: null })}
        requirement={suppiModal.requirement}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          refreshUserSession();
        }}
        initialTab="login"
      />

    </div>
  );
}
