import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Building2, Calendar, PlusCircle, ArrowRight, ChevronRight, RotateCcw, Send, Bot, ChevronDown, Check, X } from 'lucide-react';
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
import { getDemandFilterOptions, filterPublicDemands, formatDemandDeadline, formatDemandQuantity, getDemandStatus } from './demandMarketplaceUi';
import './DemandMarketplace.css';

export default function DemandsPage() {
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
  const [selectedStatus, setSelectedStatus] = useState('open');
  const [visibleCount, setVisibleCount] = useState(6);
  const [dataRevision, setDataRevision] = useState(0);
  const detailDialogRef = useRef(null);

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
      industry: '',
      location: ''
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

  // Filter choices remain stable while a query changes. Only sanitized summaries enter the UI.
  const allPublicDemands = useMemo(() => getPublicRequirements(), [dataRevision]);
  const { categories: categoriesList, provinces: provincesList } = useMemo(() => getDemandFilterOptions(allPublicDemands), [allPublicDemands]);
  const publicDemands = useMemo(() => filterPublicDemands(allPublicDemands, {
    search: searchTerm, stageId: selectedStage, category: selectedCategory, province: selectedProvince,
    sampleRequired: selectedSampleReq, surveyRequired: selectedSurveyReq, sortBy, status: selectedStatus
  }), [allPublicDemands, searchTerm, selectedStage, selectedCategory, selectedProvince, selectedSampleReq, selectedSurveyReq, sortBy, selectedStatus]);
  const visibleDemands = publicDemands.slice(0, visibleCount);
  const advancedFilterCount = Number(selectedStage !== 'all') + Number(selectedSampleReq) + Number(selectedSurveyReq);
  const hasActiveFilters = Boolean(searchTerm || selectedCategory !== 'all' || selectedProvince !== 'all' || advancedFilterCount || selectedStatus !== 'open');
  const supplierOrgId = currentUser.orgId || currentUser.taxId || (currentUser.name ? `SUP-${currentUser.name.replace(/\s+/g, '_')}` : 'SUP_ACTIVE_ORG');

  useEffect(() => setVisibleCount(6), [searchTerm, selectedStage, selectedCategory, selectedProvince, selectedSampleReq, selectedSurveyReq, selectedStatus, sortBy]);

  // Contain focus, support Escape and return to the trigger when closing public details.
  useEffect(() => {
    if (!detailModal.isOpen) return;
    const dialog = detailDialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.querySelector('button')?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') setDetailModal({ isOpen: false, requirement: null });
      if (event.key !== 'Tab' || !dialog) return;
      const controls = [...dialog.querySelectorAll('button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [detailModal.isOpen]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStage('all');
    setSelectedCategory('all');
    setSelectedProvince('all');
    setSelectedSampleReq(false);
    setSelectedSurveyReq(false);
    setSortBy('newest');
    setSelectedStatus('open');
    setVisibleCount(6);
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
    metaDesc.content = 'Tìm nhu cầu mua hàng công nghiệp theo ngành và khu vực. Xem yêu cầu công khai, số lượng, hạn phản hồi và gửi hồ sơ năng lực cung ứng.';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Sàn nhu cầu | CHUOICUNGUNG.COM",
      "description": "Tìm nhu cầu mua hàng công nghiệp theo ngành và khu vực. Xem yêu cầu công khai, số lượng, hạn phản hồi và gửi hồ sơ năng lực cung ứng.",
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
    <div className="demand-marketplace min-h-screen text-slate-900 font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Light Premium Sourcing Command Deck with Visual Panorama)  */}
      {/* ========================================================================= */}
      <section data-page-hero className="dm-hero relative overflow-hidden bg-gradient-to-b from-[#F4F8FA] via-white to-[#F1F5F9] border-b border-slate-200/90 pt-8 sm:pt-12 lg:pt-14 pb-16 sm:pb-20 lg:pb-24 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center text-slate-900">

        {/* Right Half Sourcing Photo with Vibrant Color & Interactive Supply Canvas */}
        <div className="absolute top-0 right-0 w-full lg:w-[62%] h-full pointer-events-none overflow-hidden z-0">
          <img
            src="/images/b2b_sourcing_demand_hero.jpg"
            alt="B2B Sourcing Demands Marketplace"
            className="w-full h-full object-cover object-[62%_center] scale-105 opacity-85 lg:opacity-95"
          />
          {/* Live Global Supply Chain Arc & RFQ Pulse Canvas */}
          <B2bTradeNetworkCanvas className="absolute inset-0 z-[2] opacity-75" />
          
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 lg:via-[#F4F8FA]/55 to-transparent"></div>
          <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Optical Ambient Color Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-4 sm:space-y-5">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar touch-scroll whitespace-nowrap py-0.5">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:text-slate-900 transition shrink-0 p-0.5 group">
                <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain group-hover:scale-110 transition-transform" />
                <span className="ml-1.5 text-slate-600 group-hover:text-slate-900">Trang chủ</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-semibold">
                Sàn nhu cầu mua sắm B2B
              </span>
            </nav>

            {/* Eyebrow Capsule with Vibrant Blue Theme */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/90 text-[#0047a5] text-xs font-mono font-bold tracking-wider uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse" />
              <span>CỔNG GIAO DỊCH NHU CẦU &amp; TÌM NGUỒN CUNG ỨNG B2B</span>
            </div>

            {/* Exact H1 Title with Colorful Brand Gradient Accent like Image 5 */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[48px] font-black tracking-tight text-slate-950 leading-[1.14] font-heading">
                Nhu cầu mua hàng
              </h1>
              <h2 data-hero-title className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[48px] font-black tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.14] font-heading">
                và tìm nhà cung ứng
              </h2>
            </div>

            {/* Exact Description */}
            <p className="text-sm sm:text-base md:text-[16px] text-slate-600 leading-relaxed font-normal max-w-2xl">
              Điều phối đơn hàng công nghiệp trực tiếp giữa các Nhà máy, Bên mua FDI và mạng lưới Nhà cung ứng phụ trợ tại 480+ KCN trên toàn quốc. Tiêu chuẩn kỹ thuật minh bạch, bảo mật danh tính doanh nghiệp cho đến khi phê duyệt Shortlist.
            </p>

            {/* Exact Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dang-nhu-cau"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/25 hover:shadow-blue-800/40 hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer font-heading"
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


      <section className="dm-board" aria-labelledby="demand-board-title">
        <div className="dm-board-intro">
          <div><h2 id="demand-board-title">Tìm đơn hàng phù hợp với năng lực.</h2><p>Chọn ngành và khu vực. Đọc yêu cầu trước khi gửi hồ sơ.</p></div>
          <a href="#dm-how-it-works" className="dm-text-link">Cách tham gia <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="dm-finder" role="search" aria-label="Tìm nhu cầu mua hàng">
          <div className="dm-search">
            <Search size={21} aria-hidden="true" />
            <label htmlFor="demand-search-input" className="sr-only">Tìm nhu cầu theo sản phẩm, dịch vụ hoặc mã nhu cầu</label>
            <input id="demand-search-input" type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Bạn cung cấp sản phẩm hoặc dịch vụ gì?" />
            {searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label="Xóa từ khóa"><X size={18} aria-hidden="true" /></button>}
          </div>
          <div className="dm-primary-filters">
            <div><label htmlFor="demand-category-filter">Ngành hàng</label><select id="demand-category-filter" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}><option value="all">Tất cả ngành hàng</option>{categoriesList.map(category => <option key={category} value={category}>{category}</option>)}</select></div>
            <div><label htmlFor="demand-province-filter">Khu vực</label><select id="demand-province-filter" value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)}><option value="all">Toàn quốc</option>{provincesList.map(province => <option key={province} value={province}>{province}</option>)}</select></div>
            <div><label htmlFor="demand-status-filter">Tiếp nhận hồ sơ</label><select id="demand-status-filter" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}><option value="open">Đang tìm nguồn</option><option value="all">Tất cả trạng thái</option><option value="PAUSED">Tạm dừng</option><option value="CLOSED">Đã đóng</option></select></div>
            <button type="button" className="dm-filter-toggle" aria-expanded={showAdvancedFilters} aria-controls="dm-advanced-filters" onClick={() => setShowAdvancedFilters(value => !value)}><Filter size={17} aria-hidden="true" />Lọc thêm{advancedFilterCount > 0 && <span>{advancedFilterCount}</span>}<ChevronDown size={16} aria-hidden="true" /></button>
          </div>
          <div id="dm-advanced-filters" className="dm-advanced-filters" hidden={!showAdvancedFilters}>
            <div><label htmlFor="demand-stage-filter">Giai đoạn vòng đời</label><select id="demand-stage-filter" value={selectedStage} onChange={e => setSelectedStage(e.target.value)}><option value="all">Tất cả 6 giai đoạn</option>{MASTER_SIX_STAGES.map(stage => <option key={stage.id} value={stage.id}>GĐ {stage.order}: {stage.name}</option>)}</select></div>
            <label className="dm-checkbox" htmlFor="demand-sample-req"><input id="demand-sample-req" type="checkbox" checked={selectedSampleReq} onChange={e => setSelectedSampleReq(e.target.checked)} />Cần gửi mẫu trước</label>
            <label className="dm-checkbox" htmlFor="demand-survey-req"><input id="demand-survey-req" type="checkbox" checked={selectedSurveyReq} onChange={e => setSelectedSurveyReq(e.target.checked)} />Cần khảo sát hiện trường</label>
          </div>
        </div>

        <div className="dm-market-layout">
          <div className="dm-results">
            <div className="dm-results-toolbar">
              <p role="status" aria-live="polite" aria-atomic="true"><strong>{publicDemands.length}</strong> nhu cầu{hasActiveFilters ? ' phù hợp' : ' đang tìm nguồn'}</p>
              <div className="dm-result-actions">
                {hasActiveFilters && <button type="button" className="dm-text-link" onClick={handleResetFilters}><RotateCcw size={15} aria-hidden="true" />Xóa bộ lọc</button>}
                <label htmlFor="demand-sort-filter" className="sr-only">Sắp xếp danh sách nhu cầu</label>
                <select id="demand-sort-filter" value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="newest">Mới nhất</option><option value="expiring_soon">Hạn phản hồi gần nhất</option></select>
              </div>
            </div>
            {publicDemands.length === 0 ? <div className="dm-empty">
              <Search size={32} aria-hidden="true" /><h3>Chưa có nhu cầu khớp bộ lọc.</h3><p>Thử ngành hàng khác hoặc mở rộng khu vực tìm kiếm.</p>
              <button type="button" className="dm-button" onClick={handleResetFilters}>Xem nhu cầu đang mở</button>
            </div> : <div className="dm-demand-list">
              {visibleDemands.map(demand => {
                const existingResponse = currentUser?.isLoggedIn ? getSupplierResponseForRequirement(demand.id, supplierOrgId) : null;
                const relevance = currentUser?.isLoggedIn ? evaluateSupplierRelevance(demand, currentUser) : null;
                const status = getDemandStatus(demand.status);
                return <article key={demand.id} className="dm-demand" data-demand-id={demand.id} aria-labelledby={'dm-title-' + demand.id}>
                  <div className="dm-demand-top"><span className="dm-category">{demand.category || 'Chưa phân ngành'}</span><span className={'dm-status ' + status.className}>{status.label}</span></div>
                  <h3 id={'dm-title-' + demand.id}><button type="button" onClick={() => setDetailModal({ isOpen: true, requirement: demand })}>{demand.title}</button></h3>
                  <p className="dm-summary">{demand.publicSummary || demand.productService || 'Xem chi tiết nhu cầu để tìm hiểu yêu cầu công bố.'}</p>
                  <dl className="dm-specs">
                    <div><dt><MapPin size={15} aria-hidden="true" />Khu vực</dt><dd>{demand.province || 'Chưa công bố'}</dd></div>
                    <div><dt>Số lượng</dt><dd>{formatDemandQuantity(demand)}</dd></div>
                    <div><dt><Calendar size={15} aria-hidden="true" />Hạn phản hồi</dt><dd>{formatDemandDeadline(demand.responseDeadline || demand.deadline)}</dd></div>
                  </dl>
                  {(demand.sampleRequired || demand.surveyRequired) && <div className="dm-conditions">{demand.sampleRequired && <span><Check size={14} aria-hidden="true" />Cần gửi mẫu</span>}{demand.surveyRequired && <span><Check size={14} aria-hidden="true" />Cần khảo sát</span>}</div>}
                  {relevance && <details className="dm-relevance"><summary>{relevance.badgeText}</summary><ul>{relevance.checks.map((check, index) => <li key={index}>{check.title}: {check.note}</li>)}</ul></details>}
                  <div className="dm-demand-bottom">
                    <div className="dm-buyer"><span>{demand.buyerDisplayName}</span><span className="dm-code">{demand.publicCode}</span>{existingResponse && <span className="dm-response-state">Đã gửi hồ sơ · {existingResponse.responseStatus}</span>}</div>
                    <div className="dm-card-actions"><button type="button" className="dm-detail-button" aria-label={'Xem chi tiết: ' + demand.title} onClick={() => setDetailModal({ isOpen: true, requirement: demand })}>Chi tiết <ArrowRight size={15} aria-hidden="true" /></button><button type="button" className="dm-button" disabled={!status.canRespond} onClick={() => setResponseModal({ isOpen: true, requirement: demand })}>{existingResponse ? 'Cập nhật hồ sơ' : 'Gửi hồ sơ đáp ứng'}</button></div>
                  </div>
                </article>;
              })}
            </div>}
            {visibleDemands.length < publicDemands.length && <button type="button" className="dm-load-more" onClick={() => setVisibleCount(count => count + 6)}>Xem thêm {Math.min(6, publicDemands.length - visibleDemands.length)} nhu cầu <ChevronDown size={18} aria-hidden="true" /></button>}
          </div>
          <aside className="dm-guide" aria-label="Hướng dẫn tham gia sàn nhu cầu">
            <div id="dm-how-it-works" className="dm-guide-block">
              <h2>Từ nhu cầu đến kết nối.</h2>
              <ol><li><strong>Đọc yêu cầu</strong><p>Kiểm tra quy cách, số lượng, địa bàn và thời hạn.</p></li><li><strong>Gửi hồ sơ đáp ứng</strong><p>Đăng nhập, giới thiệu năng lực và cách bạn có thể cung ứng.</p></li><li><strong>Chờ xem xét</strong><p>Bên mua hoặc điều phối xem hồ sơ trước khi kết nối.</p></li></ol>
              <p className="dm-privacy">Sàn hiển thị bản tóm tắt công khai, không hiển thị thông tin liên hệ riêng của bên mua.</p>
              <Link to="/phap-ly/chinh-sach-bao-mat-du-lieu" className="dm-text-link">Chính sách bảo mật <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="dm-suppi-block"><Bot size={25} aria-hidden="true" /><h2>Chưa rõ yêu cầu?</h2><p>Mở chi tiết nhu cầu và hỏi SUPPI về điều kiện công bố.</p><button type="button" className="dm-text-link" onClick={() => setSuppiModal({ isOpen: true, requirement: null })}>Mở SUPPI <ArrowRight size={16} aria-hidden="true" /></button></div>
            <nav className="dm-related" aria-label="Tra cứu liên quan"><Link to="/nha-cung-ung">Tra cứu nhà cung ứng <ArrowRight size={16} aria-hidden="true" /></Link><Link to="/khu-cong-nghiep">Khu công nghiệp <ArrowRight size={16} aria-hidden="true" /></Link><Link to="/ban-do-6-giai-doan">6 giai đoạn vòng đời <ArrowRight size={16} aria-hidden="true" /></Link></nav>
          </aside>
        </div>
        <div className="dm-buyer-cta"><div><h2>Bạn đang cần tìm nguồn cung?</h2><p>Đăng nhu cầu với quy cách, số lượng và ngày cần hàng.</p></div><Link to="/dang-nhu-cau" className="dm-button">Đăng nhu cầu <PlusCircle size={18} aria-hidden="true" /></Link></div>
      </section>

      {/* ========================================================================= */}
      {/* SAFE DETAIL MODAL (REUSE PUBLIC SUMMARY, ZERO SENSITIVE DATA EXPOSED) */}
      {/* ========================================================================= */}
      {detailModal.isOpen && detailModal.requirement && (
        <div className="fixed inset-0 z-[1100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
          <div ref={detailDialogRef} role="dialog" aria-modal="true" aria-labelledby="dm-detail-title" className="dm-detail-dialog bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 max-h-[90vh] overflow-y-auto space-y-6 text-slate-900 animate-in zoom-in-95 duration-200">
            
            <button
              aria-label="Đóng chi tiết nhu cầu"
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
                <span className={'dm-status ' + getDemandStatus(detailModal.requirement.status).className}>
                  {getDemandStatus(detailModal.requirement.status).label}
                </span>
              </div>
              <h2 id="dm-detail-title" className="text-lg sm:text-xl font-black text-slate-900 font-heading leading-snug">
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
                  <strong className="text-slate-800">{formatDemandQuantity(detailModal.requirement)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Hạn phản hồi:</span>
                  <strong className="text-slate-800 font-mono">{formatDemandDeadline(detailModal.requirement.responseDeadline || detailModal.requirement.deadline)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ngày cần hàng:</span>
                  <strong className="text-slate-800">{detailModal.requirement.deadline || 'Chưa công bố'}</strong>
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
                disabled={!getDemandStatus(detailModal.requirement.status).canRespond}
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
          setDataRevision(value => value + 1);
        }}
      />

      <SuppiDemandAssistantModal
        key={(suppiModal.requirement?.id || 'general') + String(suppiModal.isOpen)}
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
