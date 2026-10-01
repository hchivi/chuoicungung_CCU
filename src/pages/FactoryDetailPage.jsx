// ============================================================================
// PAGE 29: CHI TIẾT NHÀ MÁY & DOANH NGHIỆP SẢN XUẤT
// ROUTE: /nha-may/:slug hoặc /nha-may/:id
// TUÂN THỦ TOÀN DIỆN SPEC 29.TXT - CHUOICUNGUNG.COM
// KIẾN TRÚC: MỘT NHÀ MÁY CÓ THỂ MUA VÀ BÁN TRÊN CÙNG MỘT ORGANIZATION GỐC
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Factory, MapPin, Building2, Globe, Shield, CheckCircle2, 
  ExternalLink, Calendar, Users, FileText, Share2, Star, 
  ArrowRight, Award, PlusCircle, Handshake, ShoppingCart, 
  Package, Wrench, Clock, CheckSquare, Sparkles, AlertCircle, 
  Send, ChevronRight, Video, Download, HelpCircle, Layers
} from 'lucide-react';

import { 
  getFactoryByIdOrSlug, 
  getPublicRequirementsForFactory, 
  getProgramsForFactory 
} from '../data/factoriesData.js';

import SupplierResponseModal from '../components/demands/SupplierResponseModal.jsx';
import SuppiDemandAssistantModal from '../components/demands/SuppiDemandAssistantModal.jsx';
import FactoryConnectionModal from '../components/factories/FactoryConnectionModal.jsx';

export default function FactoryDetailPage() {
  const { id, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSlug = slug || id;

  // 1. Data retrieval
  const factory = useMemo(() => {
    return getFactoryByIdOrSlug(currentSlug);
  }, [currentSlug]);

  // Tab state: 'buy' (MUA) hoặc 'sell' (BÁN)
  const initialTab = searchParams.get('tab') || 'buy';
  const [activeTab, setActiveTab] = useState(initialTab === 'sell' ? 'sell' : 'buy');

  // Modals state
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isSuppiModalOpen, setIsSuppiModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'sell' || tabParam === 'buy') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Requirements public list for this factory
  const publicRequirements = useMemo(() => {
    if (!factory) return [];
    return getPublicRequirementsForFactory(factory.id, factory.organizationId);
  }, [factory]);

  // Programs for this factory
  const relevantPrograms = useMemo(() => {
    if (!factory) return [];
    return getProgramsForFactory(factory).slice(0, 3);
  }, [factory]);

  // SEO & Head Management (Section 46, 47, 48)
  useEffect(() => {
    if (!factory) return;
    const pageTitle = `${factory.name} | CHUOICUNGUNG.COM`;
    const metaDescription = `Xem thông tin công khai về ${factory.name}, ngành ${factory.industry || 'sản xuất'}, địa bàn ${factory.province}. Nhu cầu thu mua, sản phẩm đầu ra, năng lực cung ứng và đề nghị kết nối trực tiếp.`;
    
    document.title = pageTitle;

    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'description';
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', metaDescription);

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', `https://chuoicungung.com/nha-may/${currentSlug || factory.slug}`);

    // Structured Data JSON-LD (Section 48: Organization, Place & BreadcrumbList)
    const scriptId = 'factory-detail-schema';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': factory.name,
      'description': factory.productionDescription || metaDescription,
      'url': `https://chuoicungung.com/nha-may/${factory.slug}`,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': factory.province,
        'addressCountry': 'VN'
      },
      'parentOrganization': {
        '@type': 'Organization',
        'name': factory.ownerOrganization?.legalName || factory.ownerOrganization?.name
      }
    };
    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [factory]);

  // Share URL handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // If factory not found
  if (!factory) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <Factory className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 font-heading">
          Không tìm thấy hồ sơ nhà máy
        </h1>
        <p className="text-xs text-slate-500 max-w-md">
          Hồ sơ nhà máy bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang mã định danh mới.
        </p>
        <Link
          to="/nha-may"
          className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition font-heading"
        >
          Quay lại Danh bạ Nhà máy
        </Link>
      </div>
    );
  }

  const outputProducts = factory.outputProductsDetailed || [];
  const hasSellData = factory.hasSupplierCapability || outputProducts.length > 0 || factory.oemAvailable;

  return (
    <main className="space-y-6 pb-24 pt-4 font-sans bg-slate-50/50 min-h-screen">

      {/* -------------------------------------------------------------------- */}
      {/* 1. BREADCRUMB & CLAIM CTA (SECTION 44)                               */}
      {/* -------------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <nav className="flex items-center space-x-2 text-slate-500 overflow-x-auto whitespace-nowrap py-1">
            <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
              <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
            </Link>
            <span>&gt;</span>
            <Link to="/nha-may" className="hover:text-blue-600 font-medium">Danh bạ Nhà máy</Link>
            <span>&gt;</span>
            <span className="text-blue-600 font-bold font-heading truncate max-w-xs">{factory.name}</span>
          </nav>

          {/* Claim Factory Profile CTA */}
          <Link
            to={`/tao-ho-so?role=factory&organizationId=${factory.organizationId}&factoryId=${factory.id}&intent=claim`}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:border-blue-300 transition shrink-0 self-start sm:self-auto font-medium"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Quản lý hồ sơ nhà máy</span>
          </Link>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. HERO SECTION (SECTION 4 SPEC 29.TXT)                              */}
      {/* -------------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            
            {/* Left Info Column */}
            <div className="space-y-4 max-w-3xl">
              
              {/* Badges bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 flex items-center space-x-1 font-heading">
                  <Factory className="w-3.5 h-3.5 mr-1" />
                  <span>NHÀ MÁY SẢN XUẤT</span>
                </span>
                
                {factory.hasSupplierCapability && (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 font-heading">
                    CÓ NĂNG LỰC CUNG ỨNG
                  </span>
                )}

                {factory.hasPublicNeeds && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-200 font-heading">
                    CÓ NHU CẦU THU MUA
                  </span>
                )}

                {factory.oemAvailable && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md border border-slate-200 text-[11px]">
                    OEM / GIA CÔNG
                  </span>
                )}

                {factory.exportAvailable && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md border border-slate-200 text-[11px]">
                    XUẤT KHẨU
                  </span>
                )}
              </div>

              {/* H1 & Owner Organization (Section 4, 32) */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
                  {factory.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Thuộc doanh nghiệp: <strong>{factory.ownerOrganization?.legalName || factory.ownerOrganization?.name || factory.organizationId}</strong></span>
                </p>
              </div>

              {/* Sub description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {factory.productionDescription || "Thông tin công khai về hoạt động sản xuất, nhu cầu được phép chia sẻ và năng lực cung ứng của nhà máy."}
              </p>

              {/* Meta details chips */}
              <div className="flex flex-wrap gap-2 text-xs text-slate-700 pt-1">
                <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1.5 shrink-0" />
                  <span>{factory.address || factory.province}</span>
                </span>

                {factory.isKcnConfirmed && factory.industrialParkName && (
                  <Link 
                    to={`/khu-cong-nghiep/${factory.industrialParkId}`}
                    className="px-3 py-1.5 bg-blue-50/70 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl flex items-center font-bold transition"
                  >
                    <Building2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-blue-600" />
                    <span>{factory.industrialParkName}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                  </Link>
                )}

                <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                  <span>Cập nhật: {factory.updatedAt || '2026-09-28'}</span>
                </span>
              </div>

              {/* Action Buttons (Section 4) */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#factory-tabs-section"
                  onClick={() => handleTabChange('buy')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 font-heading cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Xem nhu cầu</span>
                </a>

                <button
                  onClick={() => setIsConnectionModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5 font-heading cursor-pointer"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Đề nghị kết nối</span>
                </button>

                <Link
                  to={`/dang-nhu-cau?factoryId=${factory.id}&role=factory&organizationId=${factory.organizationId}&sourcePage=factory-detail`}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 font-heading"
                >
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Đăng nhu cầu</span>
                </Link>

                <button
                  onClick={handleShare}
                  className="px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                  title="Chia sẻ liên kết"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{isCopied ? 'Đã chép link' : 'Chia sẻ'}</span>
                </button>
              </div>

            </div>

            {/* Right Photo Column */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-2">
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-[16/10] bg-slate-100">
                <img 
                  src={factory.evidences?.[0]?.fileUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"} 
                  alt={factory.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold font-heading">
                  ẢNH XƯỞNG THỰC TẾ
                </div>
              </div>

              {/* Parent Org Quick Card (Section 32) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                  Doanh nghiệp chủ quản
                </div>
                <div className="font-bold text-slate-900 truncate">
                  {factory.ownerOrganization?.legalName || factory.ownerOrganization?.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  Mã số thuế: {factory.ownerOrganization?.taxCode || '0314567890'} • {factory.ownerOrganization?.province || factory.province}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. SIBLING FACTORIES OF SAME ENTERPRISE (SECTION 2, 32, 33)          */}
      {/* -------------------------------------------------------------------- */}
      {factory.siblingFactories && factory.siblingFactories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 font-heading">
                  Các phân xưởng / nhà máy khác trực thuộc doanh nghiệp ({factory.siblingFactories.length})
                </h3>
              </div>
              <span className="text-[11px] text-blue-700 font-medium hidden sm:inline">
                Chuyển nhanh giữa các cơ sở sản xuất
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {factory.siblingFactories.map((sib) => (
                <Link
                  key={sib.id}
                  to={`/nha-may/${sib.slug}`}
                  className="p-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl text-xs transition block group shadow-2xs"
                >
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 truncate">
                    {sib.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{sib.industrialParkName || sib.province}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 4. NAVIGATION 2 TAB LỚN: MUA vs BÁN (SECTION 5 SPEC 29.TXT)           */}
      {/* -------------------------------------------------------------------- */}
      <div id="factory-tabs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-16 z-30 bg-slate-50/95 backdrop-blur-md py-2">
        <div className="bg-slate-200/80 p-1 rounded-2xl flex max-w-md shadow-inner">
          
          <button
            onClick={() => handleTabChange('buy')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 font-heading uppercase ${
              activeTab === 'buy'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>MUA (BUY SIDE)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'buy' ? 'bg-blue-100 text-blue-800' : 'bg-slate-300 text-slate-700'
            }`}>
              {publicRequirements.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('sell')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 font-heading uppercase ${
              activeTab === 'sell'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>BÁN (SELL SIDE)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'sell' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300 text-slate-700'
            }`}>
              {outputProducts.length > 0 ? outputProducts.length : (hasSellData ? '1+' : '0')}
            </span>
          </button>

        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 5. TAB MUA (BUY SIDE) CONTENT (SECTIONS 6 - 16 SPEC 29.TXT)          */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'buy' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
          
          {/* Section Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span>Nhu Cầu Thu Mua & Tìm Nguồn Cung Của Nhà Máy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Các nhu cầu mua hàng được phép chia sẻ công khai theo quy chuẩn B2B. Nhà cung ứng phù hợp có thể phản hồi khả năng đáp ứng an toàn.
            </p>
          </div>

          {/* Block: Nhu cầu được phép chia sẻ (Section 7, 8, 9, 10) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center space-x-2">
                <span>Nhu cầu được phép chia sẻ</span>
                <span className="text-xs text-blue-600 font-mono">({publicRequirements.length})</span>
              </h3>
              <Link
                to="/san-nhu-cau"
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1"
              >
                <span>Xem tất cả trên Sàn nhu cầu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {publicRequirements.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800 text-sm font-heading">
                  Nhà máy hiện chưa có nhu cầu thu mua nào ở chế độ công bố công khai
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Bạn là cán bộ quản lý thu mua của nhà máy này? Hãy đăng nhu cầu để được Bàn Điều Phối kết nối mạng lưới 14.000+ nhà cung ứng xác thực.
                </p>
                <Link
                  to={`/dang-nhu-cau?factoryId=${factory.id}&role=factory&organizationId=${factory.organizationId}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition font-heading"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Đăng Nhu Cầu Mua Hàng</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicRequirements.map((req) => (
                  <div 
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                          {req.publicCode || req.id}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-medium border border-emerald-200">
                          ĐANG TÌM NGUỒN CUNG
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 font-heading leading-snug line-clamp-2">
                        {req.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {req.publicSummary}
                      </p>

                      {/* Public conditions */}
                      {req.publicRequirements && req.publicRequirements.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Yêu cầu chính:</div>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {req.publicRequirements.slice(0, 2).map((item, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-blue-500 font-bold">•</span>
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Footer of card */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        Hạn phản hồi: <strong className="text-slate-700">{req.deadline || 'Trong 30 ngày'}</strong>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRequirement(req);
                          setIsResponseModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm font-heading"
                      >
                        Tôi Có Khả Năng Đáp Ứng
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Block: Nhóm nhu cầu thu mua (Section 11) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
              Nhóm nhu cầu nhà máy thường xuyên thu mua (Dữ liệu hệ sinh thái)
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Nguyên phụ liệu may mặc & Dệt kỹ thuật',
                'Thiết bị phòng sạch & Đo kiểm tĩnh điện ESD',
                'Bao bì carton & Màng co đóng gói',
                'Bảo trì định kỳ máy móc & M&E nhà xưởng',
                'Đồ bảo hộ lao động & Trang thiết bị PCCC',
                'Logistics vận chuyển nội địa & Xuất nhập khẩu',
                'Dịch vụ suất ăn công nghiệp & Quà tặng phúc lợi'
              ].map((cat, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Block: Quy trình tiếp nhận chào giá (Section 12, 13) */}
          <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-5 space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2 font-bold text-slate-800 font-heading">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Quy trình kết nối cung ứng an toàn tại CHUOICUNGUNG.COM</span>
            </div>
            <p className="leading-relaxed">
              Nhà cung ứng gửi khả năng đáp ứng thông qua nút <strong>[Tôi Có Khả Năng Đáp Ứng]</strong>. 
              Hồ sơ năng lực và chào giá sẽ được Bàn Điều Phối CCU thẩm định và bàn giao cho bộ phận thu mua của nhà máy. 
              Mọi thông tin liên hệ riêng tư và ngân sách nội bộ được bảo mật 100% theo chuẩn B2B.
            </p>
          </div>

          {/* Block: Chương trình phù hợp với nhà máy (Section 14) */}
          {relevantPrograms.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
                  Chương trình B2B & Ngày hội cung ứng phù hợp với nhà máy
                </h3>
                <Link to="/chuong-trinh" className="text-xs text-blue-600 font-bold hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relevantPrograms.map((prog) => (
                  <Link
                    key={prog.id}
                    to={`/chuong-trinh/${prog.id}`}
                    className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition space-y-2 block group shadow-2xs"
                  >
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                      {prog.type || 'SỰ KIỆN KẾT NỐI'}
                    </span>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 text-xs font-heading">
                      {prog.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {prog.description || prog.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* In-tab Assistant Suppi Trigger (Section 16) */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/10">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="font-black text-sm uppercase tracking-wider font-heading">Trợ lý thu mua thông minh Suppi</span>
              </div>
              <p className="text-xs text-blue-100 max-w-xl">
                Bạn cần tìm nhanh nguồn cung linh kiện, vật tư tiêu hao, M&E hoặc đơn vị gia công cho nhà máy này? Trò chuyện cùng Suppi để tạo phiếu yêu cầu chuẩn xác chỉ trong 1 phút.
              </p>
            </div>
            <button
              onClick={() => setIsSuppiModalOpen(true)}
              className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-md transition font-heading shrink-0"
            >
              Hỏi Trợ Lý Suppi
            </button>
          </div>

          {/* Bottom CTA MUA (Section 15) */}
          <div className="text-center py-6 space-y-3">
            <h3 className="text-base font-bold text-slate-800 font-heading">
              Bạn đang cần tìm nguồn cung ứng cho nhà máy?
            </h3>
            <Link
              to={`/dang-nhu-cau?factoryId=${factory.id}&role=factory&organizationId=${factory.organizationId}&sourcePage=factory-detail`}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition font-heading uppercase"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Nhu Cầu Tìm Nguồn Cung</span>
            </Link>
          </div>

        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 6. TAB BÁN (SELL SIDE) CONTENT (SECTIONS 17 - 30 SPEC 29.TXT)         */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'sell' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
          
          {/* Section Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center space-x-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>Năng Lực Sản Xuất & Sản Phẩm Đầu Ra Của Nhà Máy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Thông tin công bố minh bạch về sản phẩm đầu ra, quy mô phân xưởng, máy móc công nghệ, tiêu chuẩn chất lượng và năng lực OEM / Xuất khẩu.
            </p>
          </div>

          {!hasSellData ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="font-bold text-slate-800 text-sm font-heading">
                Nhà máy chưa công bố thông tin cung ứng công khai
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Nếu bạn là đại diện được ủy quyền của nhà máy, vui lòng quản lý hồ sơ để cập nhật sản phẩm đầu ra, dây chuyền máy móc và chứng chỉ kiểm định.
              </p>
              <Link
                to={`/tao-ho-so?role=factory&organizationId=${factory.organizationId}&factoryId=${factory.id}&intent=supplier-capability`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition font-heading"
              >
                <span>Cập Nhật Năng Lực Cung Ứng</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Block: Sản phẩm đầu ra (Section 19) */}
              {outputProducts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
                      Sản phẩm đầu ra chủ lực ({outputProducts.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {outputProducts.map((prod) => (
                      <div 
                        key={prod.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                            <img 
                              src={prod.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"} 
                              alt={prod.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-bold">
                              {prod.category}
                            </span>
                          </div>

                          <div className="p-4 space-y-2">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-heading line-clamp-2">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {prod.shortSpecification}
                            </p>
                            
                            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                              <div><strong>Ứng dụng:</strong> {prod.useCase}</div>
                              <div><strong>MOQ:</strong> <span className="font-bold text-blue-600">{prod.minOrderQuantity || 'Thỏa thuận'}</span></div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 pt-0">
                          <Link
                            to={`/san-pham-dich-vu/${prod.slug}`}
                            className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 font-heading"
                          >
                            <span>Xem chi tiết sản phẩm</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Block: Năng lực sản xuất & Công suất (Section 20, 21) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Năng lực công nghệ & Tiêu chuẩn */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>Công đoạn sản xuất & Công nghệ gia công</span>
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {(factory.capabilitiesDetail?.processCapabilities || factory.supplierCapabilities).map((cap, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  {/* Structured Capacity (Section 21) */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                    <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                      Công suất sản xuất (Dữ liệu doanh nghiệp cung cấp)
                    </div>
                    <div className="text-lg font-black text-emerald-700 font-heading">
                      {factory.capabilitiesDetail?.capacity?.value || "Theo đơn đặt hàng thực tế"}
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Nguồn: <strong>{factory.capabilitiesDetail?.capacity?.source || "Doanh nghiệp cung cấp"}</strong> • Cập nhật: {factory.capabilitiesDetail?.capacity?.updatedAt || factory.updatedAt}
                    </div>
                  </div>

                  {/* Quality Standards */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tiêu chuẩn chất lượng:</div>
                    <div className="flex flex-wrap gap-2">
                      {(factory.capabilitiesDetail?.qualityStandards || ['ISO 9001:2015']).map((std, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 mr-1" />
                          <span>{std}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right: Dây chuyền & Thiết bị chủ lực (Section 20, 22) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading flex items-center space-x-2">
                    <Factory className="w-4 h-4 text-blue-600" />
                    <span>Cơ sở vật chất & Quy mô phân xưởng</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-xs text-slate-500">Diện tích khuôn viên</div>
                      <div className="text-sm font-bold text-slate-900 font-heading mt-0.5">{factory.facilityInfo?.landArea || "10.000+ m²"}</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-xs text-slate-500">Diện tích xưởng</div>
                      <div className="text-sm font-bold text-slate-900 font-heading mt-0.5">{factory.facilityInfo?.productionArea || "6.000+ m²"}</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-xs text-slate-500">Dây chuyền</div>
                      <div className="text-sm font-bold text-slate-900 font-heading mt-0.5">{factory.facilityInfo?.productionLinesCount || "4"} chuyền</div>
                    </div>
                  </div>

                  {/* Equipment list */}
                  {factory.capabilitiesDetail?.equipmentList && factory.capabilitiesDetail.equipmentList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Danh mục máy móc tiêu biểu:</div>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                        {factory.capabilitiesDetail.equipmentList.map((eq, idx) => (
                          <div key={idx} className="p-2.5 bg-white flex items-center justify-between">
                            <span className="font-medium text-slate-800">{eq.name}</span>
                            <span className="text-[11px] text-slate-500 shrink-0 ml-2">{eq.origin} • {eq.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Labels (Section 28) */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Trạng thái hồ sơ kỹ thuật:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ĐÃ ĐỐI CHIẾU
                    </span>
                  </div>

                </div>

              </div>

              {/* Block: OEM, Xuất khẩu & Phân phối (Section 23, 24, 25) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* OEM / ODM */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading flex items-center space-x-1.5">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>OEM / ODM / Gia công</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {factory.oemAvailable ? "Sẵn sàng nhận hợp đồng OEM/ODM theo tiêu chuẩn và bản vẽ đối tác." : "Sản xuất trực tiếp nhãn hàng của nhà máy."}
                  </p>
                  {factory.oemDetails && factory.oemDetails.length > 0 && (
                    <ul className="text-xs text-slate-600 space-y-1 pt-1">
                      {factory.oemDetails.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Xuất khẩu */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading flex items-center space-x-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Năng lực xuất khẩu</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {factory.exportAvailable ? `Thị trường mục tiêu: ${(factory.exportInfo?.markets || []).join(', ')}` : "Tập trung thị trường nội địa."}
                  </p>
                  {factory.exportInfo?.certificates && factory.exportInfo.certificates.length > 0 && (
                    <div className="text-[11px] text-slate-500 pt-1">
                      Chứng từ CO: {factory.exportInfo.certificates.join(' • ')}
                    </div>
                  )}
                </div>

                {/* Vùng phục vụ (Section 26) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Vùng phục vụ giao hàng</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {(factory.serviceAreas || ['Toàn quốc']).join('; ')}
                  </p>
                  <div className="text-[11px] text-slate-400 italic pt-1">
                    * Địa chỉ xưởng tại {factory.province} có thể giao hàng toàn quốc theo đơn thỏa thuận.
                  </div>
                </div>

              </div>

              {/* Block: Bằng chứng & Hồ sơ tài liệu (Evidence - Section 27) */}
              {factory.evidences && factory.evidences.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
                    Bằng chứng & Hồ sơ kiểm định đã đối chiếu ({factory.evidences.length})
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {factory.evidences.map((ev) => (
                      <div 
                        key={ev.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {ev.type}
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            {ev.status}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 line-clamp-2">
                          {ev.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Nguồn: {ev.source} • {ev.updatedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Block: Video & Catalogue (Section 29, 30) */}
              {(factory.catalogues?.length > 0 || factory.mediaAssets?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {factory.catalogues?.[0] && (
                    <div className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-2xs">
                      <div className="space-y-1 pr-3">
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-heading">Tài liệu giới thiệu</div>
                        <div className="text-xs font-bold text-slate-900">{factory.catalogues[0].title}</div>
                        <div className="text-[11px] text-slate-500">Dung lượng: {factory.catalogues[0].fileSize || '8.5 MB'} • {factory.catalogues[0].pages || 36} trang</div>
                      </div>
                      <a 
                        href={factory.catalogues[0].fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xem Catalogue</span>
                      </a>
                    </div>
                  )}

                  {factory.mediaAssets?.[0] && (
                    <div className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-2xs">
                      <div className="space-y-1 pr-3">
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-heading">Video năng lực xưởng</div>
                        <div className="text-xs font-bold text-slate-900">{factory.mediaAssets[0].title}</div>
                        <div className="text-[11px] text-slate-500">Thời lượng: {factory.mediaAssets[0].duration || '3:45'} • Sản xuất bởi CCU Media</div>
                      </div>
                      <a 
                        href={factory.mediaAssets[0].embedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Xem Video</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom CTA BÁN (Section 34, 35) */}
              <div className="text-center py-6 space-y-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                <h3 className="text-base font-bold text-slate-800 font-heading">
                  Bạn muốn hợp tác hoặc đặt hàng gia công từ nhà máy này?
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Gửi yêu cầu cung ứng trực tiếp để Bàn Điều Phối CCU kết nối phiên làm việc B2B bảo mật và chuẩn xác.
                </p>
                <button
                  onClick={() => setIsConnectionModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition font-heading uppercase"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Cho Nhà Máy</span>
                </button>
              </div>

            </>
          )}

        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 7. INDUSTRIAL PARK BLOCK (SECTION 31 SPEC 29.TXT)                     */}
      {/* -------------------------------------------------------------------- */}
      {factory.isKcnConfirmed && factory.industrialParkId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-heading">
                Khu Công Nghiệp Sở Tại
              </div>
              <div className="text-sm font-bold text-slate-900 font-heading">
                {factory.industrialParkName} ({factory.province})
              </div>
              <p className="text-xs text-slate-500">
                Nhà máy đã xác thực quan hệ hoạt động tại khu công nghiệp này theo cơ sở dữ liệu KCN CHUOICUNGUNG.COM.
              </p>
            </div>
            <Link
              to={`/khu-cong-nghiep/${factory.industrialParkId}`}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
            >
              <span>Xem Khu Công Nghiệp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 8. STICKY MOBILE ACTION BAR (SECTION 49 SPEC 29.TXT)                  */}
      {/* -------------------------------------------------------------------- */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-3">
        {activeTab === 'buy' ? (
          <Link
            to={`/dang-nhu-cau?factoryId=${factory.id}&role=factory&organizationId=${factory.organizationId}&sourcePage=factory-detail`}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md text-center font-heading uppercase flex items-center justify-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng Nhu Cầu Mua Hàng</span>
          </Link>
        ) : (
          <button
            onClick={() => setIsConnectionModalOpen(true)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md text-center font-heading uppercase flex items-center justify-center space-x-1.5"
          >
            <Handshake className="w-4 h-4" />
            <span>Gửi Yêu Cầu Cho Nhà Máy</span>
          </button>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 9. MODALS INTEGRATION                                                */}
      {/* -------------------------------------------------------------------- */}
      
      {/* Modal 1: Phản hồi nhu cầu mua hàng của nhà máy */}
      {isResponseModalOpen && selectedRequirement && (
        <SupplierResponseModal
          isOpen={isResponseModalOpen}
          onClose={() => {
            setIsResponseModalOpen(false);
            setSelectedRequirement(null);
          }}
          requirement={selectedRequirement}
        />
      )}

      {/* Modal 2: Gửi yêu cầu B2B cho nhà máy (Tab Bán) */}
      <FactoryConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        factory={factory}
      />

      {/* Modal 3: Trợ lý Suppi hỗ trợ tạo nhu cầu */}
      <SuppiDemandAssistantModal
        isOpen={isSuppiModalOpen}
        onClose={() => setIsSuppiModalOpen(false)}
        initialContext={{
          factoryId: factory.id,
          factoryName: factory.name,
          organizationId: factory.organizationId,
          province: factory.province,
          industry: factory.industry
        }}
      />

    </main>
  );
}
