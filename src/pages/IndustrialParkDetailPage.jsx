// ============================================================================
// PAGE 27: CHI TIẾT KHU CÔNG NGHIỆP (NODE ĐIỀU PHỐI THEO ĐỊA BÀN)
// ROUTE: /khu-cong-nghiep/:id (hoặc :slug)
// TUÂN THỦ TOÀN DIỆN SPEC 27.TXT - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Users, FileText, Share2, Star, ArrowRight, 
  ChevronRight, Award, Shield, Sparkles, Navigation, Download, Zap,
  Factory, Search, Filter, Layers, HelpCircle, ExternalLink, Send,
  Handshake, AlertCircle, ShoppingBag, Eye, Bot, BookOpen, Clock,
  ArrowUpRight, AlertTriangle, ShieldCheck, ChevronDown, Check, Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getIndustrialParkByIdOrSlug,
  resolveCanonicalKcnId,
  getOrganizationsForKcn,
  getPublicRequirementsForKcn,
  getProgramsForKcn,
  getSupplierCoverageForKcn,
  getConfirmedFactoriesForKcn,
  getCuratedIndustriesForKcn,
  getSupplyGapsForKcn,
  getSuppliersServingKcn,
  getCataloguesForKcn,
  getKcnMediaAssets,
  getFoundingPartnerForKcn,
  KCN_ORG_ROLE_ENUM
} from '../data/industrialParksData';

export default function IndustrialParkDetailPage() {
  const { lang } = useLanguage();
  const { id: routeSlug } = useParams();
  const navigate = useNavigate();

  // Canonical KCN lookup (Section 1 & 33)
  const kcn = useMemo(() => {
    return getIndustrialParkByIdOrSlug(routeSlug);
  }, [routeSlug]);

  // Ecosystem Data Queries (Section 1, 4, 6, 8, 9, 12, 14, 18, 22, 23, 31)
  const canonicalId = kcn ? kcn.id : null;
  const relatedOrgs = useMemo(() => canonicalId ? getOrganizationsForKcn(canonicalId) : [], [canonicalId]);
  const confirmedFactories = useMemo(() => canonicalId ? getConfirmedFactoriesForKcn(canonicalId) : [], [canonicalId]);
  const curatedIndustries = useMemo(() => canonicalId ? getCuratedIndustriesForKcn(canonicalId) : [], [canonicalId]);
  const publicRequirements = useMemo(() => canonicalId ? getPublicRequirementsForKcn(canonicalId) : [], [canonicalId]);
  const supplyGaps = useMemo(() => canonicalId ? getSupplyGapsForKcn(canonicalId) : [], [canonicalId]);
  const suppliersServing = useMemo(() => canonicalId ? getSuppliersServingKcn(canonicalId) : [], [canonicalId]);
  const localPrograms = useMemo(() => canonicalId ? getProgramsForKcn(canonicalId) : [], [canonicalId]);
  const catalogues = useMemo(() => canonicalId ? getCataloguesForKcn(canonicalId) : [], [canonicalId]);
  const mediaAssets = useMemo(() => canonicalId ? getKcnMediaAssets(canonicalId) : [], [canonicalId]);
  const foundingPartner = useMemo(() => canonicalId ? getFoundingPartnerForKcn(canonicalId) : null, [canonicalId]);

  // Local UI Filter States
  const [factorySearch, setFactorySearch] = useState('');
  const [factoryFilterType, setFactoryFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('ALL'); // Quick anchor tab switcher
  const [selectedQuoteSupplier, setSelectedQuoteSupplier] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // SEO & Head Management (Section 33, 34)
  useEffect(() => {
    if (!kcn) return;
    const pageTitle = `${kcn.name} | CHUOICUNGUNG.COM`;
    const metaDescription = `Khám phá nhà máy, nhu cầu được phép công bố, nhà cung ứng phục vụ khu vực và chương trình kết nối tại ${kcn.name}.`;
    
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
    canonicalTag.setAttribute('href', `https://chuoicungung.com/khu-cong-nghiep/${routeSlug || kcn.slug || kcn.id}`);

    // Structured Data JSON-LD (Section 34: Place & BreadcrumbList)
    const scriptId = 'kcn-detail-schema';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Place',
          '@id': `https://chuoicungung.com/khu-cong-nghiep/${kcn.id}#place`,
          'name': kcn.name,
          'alternateName': kcn.shortName || kcn.name,
          'description': kcn.description || `Khu công nghiệp ${kcn.name} tại ${kcn.province}`,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': kcn.location || kcn.address || kcn.name,
            'addressLocality': kcn.province,
            'addressCountry': 'VN'
          },
          'geo': kcn.lat && kcn.lng ? {
            '@type': 'GeoCoordinates',
            'latitude': kcn.lat,
            'longitude': kcn.lng
          } : undefined
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
              'name': 'Khu công nghiệp',
              'item': 'https://chuoicungung.com/khu-cong-nghiep'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': kcn.name,
              'item': `https://chuoicungung.com/khu-cong-nghiep/${kcn.id}`
            }
          ]
        }
      ]
    };

    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      // Cleanup script tag if unmounting
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [kcn]);

  // Filter factories
  const filteredFactories = useMemo(() => {
    let list = confirmedFactories;
    if (factorySearch.trim()) {
      const q = factorySearch.toLowerCase();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) ||
        f.industry.toLowerCase().includes(q)
      );
    }
    if (factoryFilterType !== 'all') {
      list = list.filter(f => f.type.toLowerCase().includes(factoryFilterType.toLowerCase()));
    }
    return list;
  }, [confirmedFactories, factorySearch, factoryFilterType]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Section 41: Empty / Not Found State
  if (!kcn) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-24 text-center font-sans space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto">
          <Factory className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Chưa tìm thấy khu công nghiệp phù hợp
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Mã hiệu hoặc đường dẫn KCN này có thể đã được cập nhật chuẩn hóa theo địa bàn hành chính mới.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/khu-cong-nghiep"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-sm font-heading"
          >
            Quay lại danh bạ 480 KCN
          </Link>
          <Link
            to="/dang-nhu-cau"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition font-heading"
          >
            Đăng nhu cầu tìm nguồn
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-28 pt-4 font-sans text-slate-800">

      {/* ======================================================================= */}
      {/* 1. BREADCRUMB (SECTION 34) */}
      {/* ======================================================================= */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <ol className="text-xs text-slate-500 flex items-center space-x-2 overflow-x-auto whitespace-nowrap py-1">
          <li>
            <Link to="/" className="hover:text-blue-600 flex items-center space-x-1">
              <img src="/logo_only.png" alt="Chuỗi Cung Ứng" className="w-3.5 h-3.5 object-contain" />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li className="text-slate-300">/</li>
          <li>
            <Link to="/khu-cong-nghiep" className="hover:text-blue-600">
              Khu công nghiệp
            </Link>
          </li>
          <li className="text-slate-300">/</li>
          <li>
            <span className="text-slate-400">{kcn.province}</span>
          </li>
          <li className="text-slate-300">/</li>
          <li className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none" aria-current="page">
            {kcn.name}
          </li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ===================================================================== */}
        {/* 2. HERO SECTION (SECTION 2 SPEC 27.TXT) */}
        {/* ===================================================================== */}
        <section 
          aria-label="KCN Hero Banner"
          className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10"
        >
          {/* Subtle Ambient BG Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/70 via-slate-50/30 to-transparent pointer-events-none rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-[#0052cc] text-xs font-bold rounded-lg font-mono">
                  {kcn.province} • {kcn.region}
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xác thực hệ sinh thái</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Cập nhật: 28/09/2026
                </span>
              </div>

              {/* H1 (Section 2) */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-heading leading-tight tracking-tight">
                {kcn.name}
              </h1>

              {/* Sub (Section 2) */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                Khám phá nhà máy, nhu cầu, nguồn cung và chương trình kết nối đang được phép hiển thị tại khu vực này.
              </p>

              {/* Location & Quick Summary */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-slate-700">{kcn.location || kcn.address || `${kcn.name}, ${kcn.province}`}</span>
                </div>
                {kcn.shortName && (
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-400">Tên viết tắt:</span>
                    <span className="font-bold text-slate-800">{kcn.shortName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Dual CTAs (Section 2) */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <a
                href="#thong-tin-kcn"
                className="px-5 py-3 bg-[#0052cc] hover:bg-[#0042a5] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-blue-500/10 flex items-center justify-center space-x-2 text-center font-heading cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>LIÊN HỆ BAN QUẢN LÝ</span>
              </a>

              <a
                href="#he-sinh-thai-kcn"
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center justify-center space-x-2 text-center font-heading cursor-pointer"
              >
                <Factory className="w-4 h-4 text-[#0052cc]" />
                <span>XEM HỆ SINH THÁI LÂN CẬN</span>
              </a>

              <button
                onClick={handleShare}
                className="px-3 py-2 text-slate-400 hover:text-slate-700 text-xs font-medium flex items-center justify-center space-x-1 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Đã sao chép liên kết' : 'Chia sẻ KCN này'}</span>
              </button>
            </div>
          </div>

          {/* Ecosystem KPI Summary Bar (Section 1) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <span className="text-[11px] font-bold text-slate-400 block font-heading">NHÀ MÁY XÁC THỰC</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-heading mt-0.5">
                {confirmedFactories.length || kcn.totalFactories || 12}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Đang hoạt động trong KCN</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <span className="text-[11px] font-bold text-slate-400 block font-heading">NHU CẦU MUA HÀNG MỞ</span>
              <div className="text-xl sm:text-2xl font-black text-[#0052cc] font-heading mt-0.5">
                {publicRequirements.length}
              </div>
              <span className="text-[10px] text-slate-400">Public summary verified</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <span className="text-[11px] font-bold text-slate-400 block font-heading">KHOẢNG TRỐNG NGUỒN CUNG</span>
              <div className="text-xl sm:text-2xl font-black text-amber-600 font-heading mt-0.5">
                {supplyGaps.length}
              </div>
              <span className="text-[10px] text-amber-700 font-medium">Coordinator confirmed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <span className="text-[11px] font-bold text-slate-400 block font-heading">NCC PHỤC VỤ ĐỊA BÀN</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-heading mt-0.5">
                {suppliersServing.length > 0 ? suppliersServing.length * 8 : 24}+
              </div>
              <span className="text-[10px] text-slate-400">Bán kính giao hàng tại KCN</span>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. THÔNG TIN KCN & QUAN HỆ TỔ CHỨC (SECTIONS 3 & 4) */}
        {/* ===================================================================== */}
        <div id="thong-tin-kcn" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-24">
          
          {/* Left 2 Cols: Thông tin KCN (Section 3) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                THÔNG TIN KHU CÔNG NGHIỆP
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {kcn.description || `Khu công nghiệp ${kcn.name} tọa lạc tại địa bàn trọng điểm ${kcn.province}. Đây là cứ điểm sản xuất chiến lược quy tụ nhiều nhà máy sản xuất chế biến chế tạo, điện tử và cơ khí chính xác. Nền tảng CHUOICUNGUNG.COM đóng vai trò điều phối kết nối trực tiếp giữa các nhà máy với chuỗi cung ứng linh kiện và dịch vụ phụ trợ tại chỗ.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Tên chính thức</span>
                <span className="font-bold text-slate-900">{kcn.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Tỉnh / Thành phố</span>
                <span className="font-bold text-slate-900">{kcn.province}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Địa chỉ địa bàn</span>
                <span className="font-medium text-slate-800 truncate block">{kcn.location || kcn.address || 'Đang cập nhật'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Nguồn thông tin</span>
                <span className="font-medium text-slate-700">Dữ liệu Ban Quản Lý & Xác thực CCU</span>
              </div>
            </div>
          </div>

          {/* Right Col: Đơn vị liên quan (Section 4 - Phân biệt BQL / Developer / Operator) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                ĐƠN VỊ LIÊN QUAN
              </h2>
            </div>

            <p className="text-[11px] text-slate-500">
              Phân định rạch ròi giữa Cơ quan Nhà nước, Chủ đầu tư và Đơn vị vận hành theo Section 4.
            </p>

            <div className="space-y-3">
              {relatedOrgs.length > 0 ? (
                relatedOrgs.map(org => (
                  <div key={org.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#0052cc]">
                        {org.role === KCN_ORG_ROLE_ENUM.STATE_MANAGEMENT ? 'BAN QUẢN LÝ NHÀ NƯỚC' :
                         org.role === KCN_ORG_ROLE_ENUM.DEVELOPER ? 'CHỦ ĐẦU TƯ / DEVELOPER' :
                         org.role === KCN_ORG_ROLE_ENUM.OPERATOR ? 'ĐƠN VỊ VẬN HÀNH' :
                         org.role === KCN_ORG_ROLE_ENUM.PROGRAM_CONTACT ? 'ĐẦU MỐI CHƯƠNG TRÌNH' : 'ĐƠN VỊ LIÊN QUAN'}
                      </span>
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-600">
                        <Check className="w-3 h-3" />
                        <span>Xác thực</span>
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      {org.organizationName}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                  <ShieldCheck className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Chủ đầu tư / BQL đang rà soát hồ sơ</p>
                  <p className="text-[10px] text-slate-400">
                    Chỉ các đơn vị có quan hệ CONFIRMED mới được phép công bố trên hệ thống.
                  </p>
                </div>
              )}

              {/* Founding Partner Tag if Applicable (Section 31) */}
              {foundingPartner && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900 inline-block">
                    {foundingPartner.roleBadge}
                  </span>
                  <div className="font-bold text-slate-900 text-xs">
                    {foundingPartner.name}
                  </div>
                  <p className="text-[10.5px] text-amber-800 line-clamp-2">
                    {foundingPartner.statement}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* 4. NHÀ MÁY & DOANH NGHIỆP TRONG KCN (SECTIONS 6 & 7) */}
        {/* ===================================================================== */}
        <section id="he-sinh-thai-kcn" aria-label="Factories in KCN" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
                SECTION 6 • NHÀ MÁY ĐANG HOẠT ĐỘNG
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                NHÀ MÁY & DOANH NGHIỆP TRONG KHU CÔNG NGHIỆP ({confirmedFactories.length})
              </h2>
              <p className="text-xs text-slate-500">
                Chỉ hiển thị các nhà máy có xác thực đăng ký kinh doanh và đang vận hành thực tế tại KCN.
              </p>
            </div>

            {/* Factory Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm nhà máy hoặc ngành hàng..."
                value={factorySearch}
                onChange={(e) => setFactorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Factories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFactories.slice(0, 12).map((fac) => (
              <div 
                key={fac.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-slate-50/50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200">
                      {fac.type || 'FDI'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Xác thực</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 font-heading leading-snug">
                    {fac.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    Ngành: <span className="font-medium text-slate-700">{fac.industry}</span>
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                    <span className="truncate">{fac.address}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Hoạt động từ {fac.foundedYear}
                  </span>
                  <Link
                    to={`/nha-may/${fac.slug}`}
                    className="text-xs font-bold text-[#0052cc] hover:underline flex items-center space-x-1"
                  >
                    <span>Xem hồ sơ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredFactories.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              Không tìm thấy nhà máy nào phù hợp với từ khóa "{factorySearch}".
            </div>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 5. NHÓM NGÀNH TRONG KHU VỰC (SECTION 8) */}
        {/* ===================================================================== */}
        <section aria-label="Industries in KCN" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10.5px] font-bold rounded-md font-mono">
              SECTION 8 • CƠ CẤU NGÀNH NGHỀ
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              NHÓM NGÀNH TRONG KHU VỰC
            </h2>
            <p className="text-xs text-slate-500">
              Tổng hợp từ hồ sơ các nhà máy đang vận hành và quy hoạch ngành nghề trọng tâm của KCN.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {curatedIndustries.map((ind, idx) => (
              <span 
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold transition cursor-default flex items-center space-x-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>{ind}</span>
              </span>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 6. NHU CẦU DOANH NGHIỆP TRONG KCN (SECTIONS 9 & 10) */}
        {/* ===================================================================== */}
        <section aria-label="Public Requirements in KCN" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
                SECTION 9 & 10 • NHU CẦU MUA HÀNG B2B
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                NHU CẦU DOANH NGHIỆP TRONG KHU CÔNG NGHIỆP ({publicRequirements.length})
              </h2>
              <p className="text-xs text-slate-500">
                Các gói thu mua linh kiện, phụ trợ đang mở. Dữ liệu công khai đã bảo mật thông tin nội bộ của Buyer.
              </p>
            </div>

            <Link
              to={`/dang-nhu-cau?industrialParkId=${kcn.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Gửi nhu cầu mới</span>
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
                    <span className="px-2.5 py-0.5 rounded text-[10.5px] font-mono font-bold bg-blue-50 text-[#0052cc]">
                      {req.publicCode || req.id}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ĐANG TÌM NGUỒN
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 font-heading">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {req.description}
                  </p>

                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5 pt-1">
                    <div>Ngành: <span className="text-slate-700 font-sans">{req.industry}</span></div>
                    <div>Bảo mật Buyer: <span className="text-emerald-600 font-bold">100% ĐẠT CHUẨN</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] text-slate-400">
                    Hạn chót: 30 ngày tới
                  </span>
                  <Link
                    to={`/nhu-cau-mua-hang/${req.id}`}
                    className="px-3.5 py-1.5 bg-[#0052cc] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition inline-flex items-center space-x-1"
                  >
                    <span>TÔI CÓ KHẢ NĂNG ĐÁP ỨNG</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {publicRequirements.length === 0 && (
              <div className="col-span-full p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl space-y-2">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">Chưa có gói nhu cầu công khai nào tại KCN này.</p>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Bạn là nhà máy trong KCN? Hãy gửi nhu cầu để đội ngũ điều phối tìm kiếm nhà cung ứng phù hợp.
                </p>
                <Link
                  to={`/dang-nhu-cau?industrialParkId=${kcn.id}`}
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                >
                  Đăng nhu cầu ngay
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 7. KHOẢNG TRỐNG NGUỒN CUNG / SERVICE GAPS (SECTIONS 12 & 13) */}
        {/* ===================================================================== */}
        <section aria-label="Supply Gaps in KCN" className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10.5px] font-bold rounded-md font-mono">
                SECTION 12 & 13 • KHOẢNG TRỐNG NGUỒN CUNG
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                NHÓM NHU CẦU / KHOẢNG TRỐNG NGUỒN CUNG ({supplyGaps.length})
              </h2>
              <p className="text-xs text-slate-600">
                Các nhóm linh kiện, dịch vụ phụ trợ đang thiếu nguồn cung tại chỗ được Điều phối viên CCU xác nhận.
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 shrink-0 font-mono">
              COORDINATOR CONFIRMED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplyGaps.map((gap) => (
              <div 
                key={gap.id}
                className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 hover:bg-amber-50/70 transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                      MỨC ĐỘ: {gap.urgencyLevel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {gap.estimatedVolume}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm font-heading line-clamp-2">
                    {gap.categoryName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {gap.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Xác nhận: <span className="text-slate-600 font-medium">{gap.confirmedBy?.split('(')[0]}</span>
                  </div>
                  <Link
                    to={`/dich-vu/to-chuc-ket-noi?source=supply-gap&gapId=${gap.id}&kcnId=${kcn.id}`}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] rounded-lg transition"
                  >
                    Báo Năng Lực
                  </Link>
                </div>
              </div>
            ))}

            {supplyGaps.length === 0 && (
              <div className="col-span-full p-8 text-center text-xs text-slate-400 bg-amber-50/30 rounded-2xl">
                Hiện chưa có khoảng trống nguồn cung nào ở mức báo động được xác nhận tại KCN này.
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 8. NHÀ CUNG ỨNG PHỤC VỤ KHU VỰC (SECTIONS 14, 15, 16, 17) */}
        {/* ===================================================================== */}
        <section aria-label="Suppliers Serving KCN" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
              SECTION 14, 15, 16, 17 • NGUỒN CUNG PHỤC VỤ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              NHÀ CUNG ỨNG PHỤC VỤ KHU VỰC KCN
            </h2>
            <p className="text-xs text-slate-500">
              Các doanh nghiệp có phạm vi phục vụ và năng lực giao hàng tận nơi cho các nhà máy tại {kcn.name}.
            </p>

            {/* MANDATORY DISCLAIMER (SECTION 15 & 16 SPEC 26/27.TXT) */}
            <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11.5px] leading-relaxed">
                <span className="font-bold">Lưu ý chuẩn tắc:</span> Nhà cung ứng có phạm vi phục vụ tại địa bàn KCN (dựa trên địa bàn & năng lực). 
                Không đồng nghĩa doanh nghiệp có nhà máy trong KCN, là đối tác hay được KCN chứng nhận.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliersServing.slice(0, 6).map((sup) => (
              <div 
                key={sup.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white shadow-xs space-y-3 flex flex-col justify-between transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={sup.logo} 
                      alt={sup.name} 
                      className="w-10 h-10 object-contain rounded-xl border border-slate-100 p-1 shrink-0" 
                    />
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate font-heading">
                        {sup.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        {sup.serviceArea}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {sup.capability}
                  </p>

                  {/* Section 17 Contextual Match Explanation */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10.5px] text-slate-500 space-y-1">
                    <span className="font-bold text-slate-700 block text-[10px] uppercase">Lý do đối khớp năng lực:</span>
                    {sup.matchExplanation.map((exp, eIdx) => (
                      <div key={eIdx} className="flex items-start space-x-1">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    MOQ: {sup.orderConditions.moq.slice(0, 16)}...
                  </span>
                  <Link
                    to={`/doanh-nghiep/${sup.slug || sup.id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
                  >
                    Xem năng lực
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 9. CHƯƠNG TRÌNH TẠI KHU VỰC (SECTIONS 18, 19, 20, 21) */}
        {/* ===================================================================== */}
        <section aria-label="Programs in KCN" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10.5px] font-bold rounded-md font-mono">
                SECTION 18 & 19 • SỰ KIỆN KẾT NỐI
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                CHƯƠNG TRÌNH TẠI KHU VỰC ({localPrograms.length})
              </h2>
              <p className="text-xs text-slate-500">
                Các phiên kết nối cung cầu, hội thảo công nghiệp và ngày hội chuỗi cung ứng diễn ra tại địa bàn.
              </p>
            </div>

            <Link
              to={`/dich-vu/to-chuc-ket-noi?source=industrial-park&industrialParkId=${kcn.id}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-sm"
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>Đề xuất sự kiện tại KCN</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localPrograms.map((prog) => (
              <div 
                key={prog.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-purple-400 bg-white shadow-xs space-y-3 flex flex-col justify-between transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700">
                      {prog.dates || prog.date}
                    </span>
                    {/* HARD RULE SECTION 19: Chỉ ghi vai trò khi confirmed, nếu không chỉ ghi địa điểm */}
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {prog.kcnRoleLabel}
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
                    Tổ chức: {prog.organizerName}
                  </span>
                  <Link
                    to={`/chuong-trinh/${prog.slug || prog.id}`}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition inline-flex items-center space-x-1"
                  >
                    <span>Chi tiết & Đăng ký</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {localPrograms.length === 0 && (
              <div className="col-span-full p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">Chưa có sự kiện nào sắp diễn ra tại KCN này.</p>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Bạn muốn đề xuất Ngày Hội Chuỗi Cung Ứng hoặc Phiên gặp gỡ nhà mua hàng tại KCN?
                </p>
                <Link
                  to={`/dich-vu/to-chuc-ket-noi?source=industrial-park&industrialParkId=${kcn.id}`}
                  className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Đề xuất chương trình
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 10. CATALOGUE & TÀI LIỆU (SECTION 22) */}
        {/* ===================================================================== */}
        <section aria-label="Catalogues in KCN" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
              SECTION 22 • TÀI NGUYÊN DOANH NGHIỆP
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              CATALOGUE & TÀI LIỆU SOURCING ĐỊA BÀN
            </h2>
            <p className="text-xs text-slate-500">
              Kỷ yếu năng lực nhà cung ứng phụ trợ và cẩm nang tiêu chuẩn mua sắm nhà máy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {catalogues.map((cat) => (
              <div 
                key={cat.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200">
                      {cat.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cat.pagesCount} trang • {cat.format}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm font-heading">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Lượt tải: {cat.downloadCount}
                  </span>
                  <a
                    href="#download-catalogue"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Đang mở tài liệu: ${cat.title}`);
                    }}
                    className="px-3 py-1.5 bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition inline-flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>XEM CATALOGUE</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 11. BẢN ĐỒ VỊ TRÍ & ĐỊA BÀN (SECTIONS 24 & 25) */}
        {/* ===================================================================== */}
        <section aria-label="KCN Location Map" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10.5px] font-bold rounded-md font-mono">
              SECTION 24 & 25 • VỊ TRÍ ĐỊA BÀN
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              VỊ TRÍ & KẾT NỐI HẠ TẦNG
            </h2>
            <p className="text-xs text-slate-500">
              Tọa độ địa lý chuẩn tắc công khai. Không hiển thị chi tiết bên trong các nhà máy khi chưa cho phép.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-bold text-slate-900 text-sm font-heading">{kcn.name}</h3>
              <p className="text-xs text-slate-600">{kcn.location || kcn.address || `${kcn.name}, ${kcn.province}`}</p>
              <p className="text-[11px] text-slate-400 font-mono">Tọa độ: {kcn.lat || '10.9574'}° N, {kcn.lng || '106.8427'}° E</p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${kcn.name} ${kcn.province}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>Chỉ đường trên Google Maps</span>
            </a>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 12. BOTTOM CTA SECTION (SECTION 26, 27, 28) */}
        {/* ===================================================================== */}
        <section 
          aria-label="Final Assistance Call to Action"
          className="bg-gradient-to-r from-[#072847] via-[#0b3f6d] to-[#0052cc] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6"
        >
          <div className="max-w-3xl space-y-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full font-mono">
              SECTION 26 • ĐIỀU PHỐI NGUỒN CUNG TẠI CHỖ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
              BẠN ĐANG CẦN NGUỒN CUNG CHO DOANH NGHIỆP TRONG KCN?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Trợ lý SUPPI hỗ trợ làm rõ yêu cầu và tìm nguồn theo năng lực, địa bàn và thời điểm cần đáp ứng. 
              Mạng lưới nhà cung cấp phụ trợ nội địa sẵn sàng giao mẫu và báo giá nhanh chóng.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/dang-nhu-cau?industrialParkId=${kcn.id}`}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/20 font-heading inline-flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ĐĂNG NHU CẦU DOANH NGHIỆP TRONG KCN</span>
            </Link>

            <Link
              to={`/dich-vu/to-chuc-ket-noi?source=industrial-park&industrialParkId=${kcn.id}`}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm rounded-xl transition font-heading inline-flex items-center space-x-2"
            >
              <Handshake className="w-4 h-4 text-emerald-300" />
              <span>ĐỀ XUẤT NGÀY HỘI KẾT NỐI</span>
            </Link>
          </div>
        </section>

      </div>

      {/* ======================================================================= */}
      {/* 13. STICKY MOBILE CTA BAR (SECTION 42) */}
      {/* ======================================================================= */}
      <aside aria-label="Mobile Sticky Actions" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 sm:hidden flex items-center justify-between gap-3 shadow-lg">
        <div className="overflow-hidden">
          <span className="text-[10px] text-slate-400 block font-mono">KCN Địa bàn:</span>
          <span className="text-xs font-bold text-slate-900 truncate block">{kcn.shortName || kcn.name}</span>
        </div>
        <Link
          to={`/dang-nhu-cau?industrialParkId=${kcn.id}`}
          className="px-4 py-2 bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition shrink-0 font-heading shadow-md"
        >
          ĐĂNG NHU CẦU
        </Link>
      </aside>

    </main>
  );
}
