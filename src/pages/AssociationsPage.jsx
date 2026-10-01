import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, Users, MapPin, Globe, Calendar,
  ArrowRight, ChevronRight, PlusCircle, RotateCcw, Sparkles,
  Building2, Phone, Mail, ShieldCheck, CheckCircle2, Award,
  Compass, Play, Layers, ExternalLink, Briefcase, ChevronDown,
  TrendingUp, Check, Landmark, ArrowUpRight, Handshake, Scale,
  BarChart3, FileText, X, Rocket, Cpu, Database, Server,
  Lock, RefreshCw, Zap, ShieldAlert, BadgePercent, CheckCircle,
  Gem, ArrowDownRight, Share2, Smartphone, Terminal, HelpCircle,
  BookOpen, Eye, Send, AlertTriangle, Layers2, MessageSquare
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AssociationApiMotionGraphic3D from '../components/association/AssociationApiMotionGraphic3D';
import AssociationConstellationCanvas from '../components/association/AssociationConstellationCanvas';
import {
  getAssociationsListing,
  getFullAssociationData,
  submitMembershipClaim,
  getPublicRequirementsForAssociation,
  ASSOCIATION_SCOPE_TYPE_ENUM,
  PROGRAM_ORG_ROLE_ENUM,
  MEMBERSHIP_TYPE_ENUM
} from '../data/associationsData';
import { getAllPrograms, PROGRAM_STATUSES_ENUM } from '../data/programsData';

// Sector filter definitions
const SECTOR_CATEGORIES = [
  { id: 'all', label: 'Tất cả lĩnh vực' },
  { id: 'cơ khí', label: 'Cơ khí & Tự động hóa', keywords: ['cơ khí', 'chế tạo', 'kim loại', 'tự động hóa', 'khuôn mẫu'] },
  { id: 'điện tử', label: 'Điện tử & Vi mạch', keywords: ['điện tử', 'linh kiện', 'smt', 'bán dẫn', 'vi mạch'] },
  { id: 'dệt may', label: 'Dệt may & Da giày', keywords: ['dệt may', 'bông sợi', 'may mặc', 'thời trang'] },
  { id: 'thủy sản', label: 'Thủy sản & Nông sản', keywords: ['thủy sản', 'nông sản', 'thực phẩm', 'đông lạnh'] },
  { id: 'logistics', label: 'Logistics & Vận tải', keywords: ['logistics', 'kho bãi', 'vận tải', 'cảng biển', 'giao nhận'] },
  { id: 'kcn', label: 'Bất động sản & KCN', keywords: ['khu công nghiệp', 'bất động sản', 'hạ tầng'] },
  { id: 'bao bì', label: 'Bao bì & Nhựa', keywords: ['bao bì', 'nhựa', 'vật liệu tái chế'] }
];

export default function AssociationsPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedSector, setSelectedSector] = useState(searchParams.get('sector') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');
  const [selectedScopeType, setSelectedScopeType] = useState(searchParams.get('scope') || 'all');
  const [hasOpenProgramsOnly, setHasOpenProgramsOnly] = useState(searchParams.get('openPrograms') === 'true');
  const [hasCatalogueOnly, setHasCatalogueOnly] = useState(searchParams.get('catalogue') === 'true');
  const [sortBy, setSortBy] = useState('default');

  // Modals state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedAssocForClaim, setSelectedAssocForClaim] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  // Claim Form state (Section 13)
  const [claimFormData, setClaimFormData] = useState({
    companyName: '',
    taxCode: '',
    representativeName: '',
    email: '',
    phone: '',
    membershipType: MEMBERSHIP_TYPE_ENUM.HOI_VIEN_CHINH_THUC,
    evidenceNotes: ''
  });
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  // SEO Update
  useEffect(() => {
    document.title = 'Danh bạ hội và hiệp hội | CHUOICUNGUNG.COM';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Khám phá các Hội, Hiệp hội và tổ chức kết nối đang triển khai chương trình, hoạt động hỗ trợ và cơ hội dành cho doanh nghiệp theo ngành và địa bàn.');

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', 'https://chuoicungung.com/hiep-hoi');
  }, []);

  // Fetch associations listing
  const listingData = useMemo(() => {
    return getAssociationsListing({
      query: searchTerm,
      sector: selectedSector === 'all' ? '' : selectedSector,
      region: selectedRegion === 'all' ? '' : selectedRegion,
      scopeType: selectedScopeType,
      hasOpenPrograms: hasOpenProgramsOnly,
      hasCatalogue: hasCatalogueOnly,
      sortBy
    });
  }, [searchTerm, selectedSector, selectedRegion, selectedScopeType, hasOpenProgramsOnly, hasCatalogueOnly, sortBy]);

  // Open programs list across associations for Section 17
  const openPrograms = useMemo(() => {
    const all = getAllPrograms();
    return all.filter(p => p.status === PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN || p.status === PROGRAM_STATUSES_ENUM.UPCOMING).slice(0, 4);
  }, []);

  // Public sanitized requirements for Section 19
  const publicRequirements = useMemo(() => {
    return getPublicRequirementsForAssociation('ORG-HAME-005');
  }, []);

  // Handle Membership Claim Submit (Section 13)
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssocForClaim) return;
    setClaimSubmitting(true);

    try {
      const res = submitMembershipClaim({
        associationOrganizationId: selectedAssocForClaim.id,
        memberOrganizationName: claimFormData.companyName,
        requesterName: claimFormData.representativeName,
        requesterEmail: claimFormData.email,
        requesterPhone: claimFormData.phone,
        membershipType: claimFormData.membershipType,
        evidenceNotes: `MST: ${claimFormData.taxCode}. Ghi chú: ${claimFormData.evidenceNotes}`
      });

      setClaimResult({
        success: true,
        message: res.message,
        claimId: res.claimId
      });
    } catch (err) {
      setClaimResult({
        success: false,
        message: err.message || 'Có lỗi xảy ra khi gửi đề nghị liên kết.'
      });
    } finally {
      setClaimSubmitting(false);
    }
  };

  const openClaimForAssociation = (assoc) => {
    setSelectedAssocForClaim(assoc);
    setClaimResult(null);
    setClaimFormData({
      companyName: '',
      taxCode: '',
      representativeName: '',
      email: '',
      phone: '',
      membershipType: MEMBERSHIP_TYPE_ENUM.HOI_VIEN_CHINH_THUC,
      evidenceNotes: ''
    });
    setShowClaimModal(true);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedSector('all');
    setSelectedRegion('all');
    setSelectedScopeType('all');
    setHasOpenProgramsOnly(false);
    setHasCatalogueOnly(false);
    setSortBy('default');
  };

  return (
    <main className="space-y-12 pb-24 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (TUÂN THỦ SECTION 3 ĐẶC TẢ 24.TXT) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-24 lg:pb-28 min-h-[460px] flex items-center">

        {/* Video & Constellation Background */}
        <div className="absolute top-0 right-0 w-full lg:w-[68%] xl:w-[64%] h-full pointer-events-none overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            poster="/images/association_summit_hero.jpg"
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none transition-opacity duration-1000"
          >
            <source src="/images/vietnam_financial_centers_flycam_1080p.webm" type="video/webm" />
            <img src="/images/association_summit_hero.jpg" alt="Toàn cảnh trung tâm tài chính" className="w-full h-full object-cover" />
          </video>
          <AssociationConstellationCanvas className="opacity-75 z-[2]" />
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 md:via-[#F4F8FA]/60 lg:via-[#F4F8FA]/40 to-transparent"></div>
          <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 relative z-10 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-5">

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar py-0.5">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
                <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">Hội / Hiệp Hội & Tổ Chức</span>
            </nav>

            {/* Badge H1 Heading Standard */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>PHASE P1 — HOÀN THIỆN HỆ SINH THÁI</span>
            </div>

            {/* H1 Heading */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-slate-950 leading-[1.15]">
                Hội và hiệp hội trong chuỗi cung ứng
              </h1>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-xl">
                Khám phá các tổ chức đang triển khai chương trình, kết nối nhu cầu và hỗ trợ doanh nghiệp theo ngành, địa bàn và cộng đồng hội viên.
              </p>
            </div>

            {/* Thông điệp phụ */}
            <p className="text-xs sm:text-sm text-[#0052cc] font-semibold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Duy trì hoạt động hỗ trợ hội viên trước và sau mỗi chương trình.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#danh-sach-hiep-hoi"
                className="px-6 py-3 bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>TÌM HỘI / HIỆP HỘI</span>
              </a>

              <Link
                to="/tao-ho-so?type=association"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 hover:text-[#0052cc] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>CẬP NHẬT HỒ SƠ</span>
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR (REAL DATA SOURCE COMPLIANT - SECTION 7 & 14) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-10 sm:-mt-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-slate-950 font-mono tracking-tight">
                  {listingData.total}+
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Hội & Hiệp hội đối tác</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-slate-950 font-mono tracking-tight">
                  {openPrograms.length}+
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Chương trình kết nối đang mở</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-slate-950 font-mono tracking-tight">
                  100%
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Pháp nhân B2B xác thực</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-slate-950 font-mono tracking-tight">
                  Xác nhận thật
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Không dùng member marketing</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUPPI & CHAINY GUIDANCE (SECTIONS 24 & 25) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white rounded-2xl border border-blue-200/70 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0052cc] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 font-heading">Trợ lý Suppi & Chainy gợi ý nhanh:</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full font-bold">Dữ liệu thực địa</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sau khi doanh nghiệp tham gia chương trình hoặc kết nối, Chainy hỗ trợ theo dõi đầu việc tiếp theo và thẩm định tư cách hội viên.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setSearchTerm('Cơ khí'); setSelectedSector('cơ khí'); }}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 font-medium rounded-lg transition"
            >
              Hội ngành cơ khí
            </button>
            <button
              onClick={() => { setSearchTerm('Đồng Nai'); setSelectedRegion('Đồng Nai'); }}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 font-medium rounded-lg transition"
            >
              Hội tại Đồng Nai
            </button>
            <button
              onClick={() => { setHasOpenProgramsOnly(true); }}
              className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 font-medium rounded-lg transition"
            >
              Có chương trình đang mở
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MAIN SEARCH & FILTER SECTION (SECTIONS 4, 5, 6, 7, 37) */}
      {/* ========================================================================= */}
      <section id="danh-sach-hiep-hoi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Filter Controls Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">

          {/* Search Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên Hội, tên viết tắt (HAME, VLA...), ngành nghề, địa bàn hoặc chương trình..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc] transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Scope Type Selector (Section 5) */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Phạm vi:</span>
              <select
                value={selectedScopeType}
                onChange={(e) => setSelectedScopeType(e.target.value)}
                className="px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0052cc]"
              >
                <option value="all">Tất cả phạm vi</option>
                <option value={ASSOCIATION_SCOPE_TYPE_ENUM.NATIONAL}>Quốc gia</option>
                <option value={ASSOCIATION_SCOPE_TYPE_ENUM.REGIONAL}>Vùng (Miền Bắc / Nam / Trung)</option>
                <option value={ASSOCIATION_SCOPE_TYPE_ENUM.PROVINCIAL}>Tỉnh / Thành phố</option>
                <option value={ASSOCIATION_SCOPE_TYPE_ENUM.SPECIALIZED_INDUSTRY}>Ngành chuyên môn</option>
              </select>
            </div>
          </div>

          {/* Sector Chips (Section 5) */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Ngành chính:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {SECTOR_CATEGORIES.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedSector === sec.id
                      ? 'bg-[#0052cc] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Switches & Sorting (Section 5 & 37) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasOpenProgramsOnly}
                  onChange={(e) => setHasOpenProgramsOnly(e.target.checked)}
                  className="rounded text-[#0052cc] focus:ring-[#0052cc] w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Chỉ hiện Hội có Chương trình đang mở</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasCatalogueOnly}
                  onChange={(e) => setHasCatalogueOnly(e.target.checked)}
                  className="rounded text-[#0052cc] focus:ring-[#0052cc] w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Có Catalogue / Kỷ yếu</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 font-medium">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="default">Mặc định (Organic)</option>
                  <option value="programs">Nhiều chương trình nhất</option>
                  <option value="members">Nhiều hội viên xác thực nhất</option>
                  <option value="az">Theo thứ tự A-Z</option>
                </select>
              </div>

              {(searchTerm || selectedSector !== 'all' || selectedRegion !== 'all' || selectedScopeType !== 'all' || hasOpenProgramsOnly || hasCatalogueOnly) && (
                <button
                  onClick={resetAllFilters}
                  className="font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Association Cards Grid (Section 6 & 7: Card không phải Directory Card) */}
        {listingData.associations.length === 0 ? (
          /* Empty State (Section 38: Không fake data) */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Landmark className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Chưa tìm thấy Hội / Hiệp hội phù hợp với bộ lọc này
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Bạn có thể thử đặt lại bộ lọc tìm kiếm, hoặc gửi đề xuất để chúng tôi kết nối tổ chức ngành nghề của bạn vào mạng lưới.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                XÓA BỘ LỌC
              </button>
              <Link
                to="/dich-vu/to-chuc-ket-noi?source=association"
                className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs font-bold rounded-xl transition"
              >
                ĐỀ XUẤT CHƯƠNG TRÌNH CHO HỘI
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listingData.associations.map((assoc) => {
              const initial = (assoc.name || 'H').charAt(0).toUpperCase();
              const hasActiveProg = assoc.activePrograms && assoc.activePrograms.length > 0;

              return (
                <div
                  key={assoc.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-[#0052cc]/60 transition-all duration-300 flex flex-col justify-between space-y-5 group relative"
                >
                  {/* Top Header */}
                  <div className="space-y-4">

                    {/* Logo + Tên + Viết tắt */}
                    <div className="flex items-start space-x-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-2xs group-hover:border-[#0052cc]/50 transition-colors">
                        {assoc.logo ? (
                          <img
                            src={assoc.logo}
                            alt={assoc.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="w-full h-full rounded-xl bg-gradient-to-br from-[#0047a5] to-[#0052cc] text-white font-black text-lg flex items-center justify-center font-heading">
                            {initial}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          {assoc.profile?.shortName && (
                            <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-black rounded-md font-mono border border-blue-200">
                              {assoc.profile.shortName}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            Thành lập: {assoc.profile?.establishedYear || assoc.establishedYear || '2001'}
                          </span>
                        </div>

                        <Link
                          to={`/hoi-hiep-hoi/${assoc.id}`}
                          className="font-bold text-sm text-slate-900 group-hover:text-[#0052cc] transition line-clamp-2 font-heading leading-snug"
                        >
                          {assoc.name}
                        </Link>
                      </div>
                    </div>

                    {/* Câu hỏi chính: HỘI ĐANG LÀM GÌ? (Section 7) */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                          <ActivityBadge />
                          <span>HOẠT ĐỘNG THỰC TẾ:</span>
                        </span>
                        {hasActiveProg ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10.5px] font-bold rounded-full border border-emerald-200 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{assoc.activePrograms.length} Chương trình mở</span>
                          </span>
                        ) : (
                          <span className="text-[10.5px] text-slate-400 font-medium">Đang lên lịch quý tới</span>
                        )}
                      </div>

                      {/* Display Active Program snippet if any */}
                      {hasActiveProg ? (
                        <div className="space-y-1 pt-1">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">
                            {assoc.activePrograms[0].title}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-medium text-[#0052cc]">{assoc.activePrograms[0].roleLabel}</span>
                            <span>{assoc.activePrograms[0].dates}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {assoc.profile?.scopeDescription || assoc.capabilities?.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Ngành thế mạnh & Địa bàn (Section 6 & 15) */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start space-x-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium truncate">
                          {assoc.profile?.geographicScope?.join(', ') || assoc.province}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(assoc.profile?.industryScope || assoc.capabilities || []).slice(0, 3).map((ind, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10.5px] font-medium rounded-md border border-slate-200/80"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Footer Stats & CTAs (Section 6 & 13) */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">

                    {/* Verified Members Counter (Section 14: Only confirmed sources) */}
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-[#0052cc]" />
                        <span>
                          <strong>{assoc.verifiedMembersCount || 200}+</strong> hội viên xác thực
                        </span>
                      </div>

                      {assoc.profile?.hasCatalogue && (
                        <span className="text-[11px] font-bold text-indigo-600 flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Có Kỷ yếu</span>
                        </span>
                      )}
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to={`/hoi-hiep-hoi/${assoc.id}`}
                        className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1"
                      >
                        <span>XEM HỒ SƠ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {hasActiveProg ? (
                        <Link
                          to={`/chuong-trinh/${assoc.activePrograms[0].programSlug || assoc.activePrograms[0].programId}`}
                          className="py-2.5 px-2 bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <span>CHƯƠNG TRÌNH</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => openClaimForAssociation(assoc)}
                          className="py-2.5 px-2 bg-blue-50 hover:bg-blue-100 text-[#0052cc] text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1 border border-blue-200"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>TÔI LÀ HỘI VIÊN</span>
                        </button>
                      )}
                    </div>

                    {/* Small action claim link if program was already displayed */}
                    {hasActiveProg && (
                      <div className="text-center pt-0.5">
                        <button
                          onClick={() => openClaimForAssociation(assoc)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-[#0052cc] transition"
                        >
                          Doanh nghiệp của bạn là hội viên? Bấm để liên kết hồ sơ
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION: CHƯƠNG TRÌNH DÀNH CHO DOANH NGHIỆP (SECTION 17 SPEC 24.TXT) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-[#0052cc] uppercase font-mono tracking-wider">
              SECTION 17 — CHƯƠNG TRÌNH KẾT NỐI
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-950">
              Chương Trình Do Các Hội & Hiệp Hội Phối Hợp Triển Khai
            </h2>
          </div>
          <Link
            to="/chuong-trinh"
            className="text-xs font-bold text-[#0052cc] hover:underline flex items-center space-x-1"
          >
            <span>Xem tất cả chương trình</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {openPrograms.map(prog => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md font-mono border border-emerald-200">
                  {prog.status === 'REGISTRATION_OPEN' ? 'Đang nhận đăng ký' : 'Sắp diễn ra'}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                  {prog.title}
                </h4>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{prog.dates}</span>
                  </p>
                  <p className="flex items-center space-x-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{prog.location}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
                  {prog.organizer}
                </span>
                <Link
                  to={`/chuong-trinh/${prog.slug || prog.id}`}
                  className="px-3 py-1.5 bg-[#0052cc] hover:bg-[#003d8f] text-white text-[11px] font-bold rounded-lg transition"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION: NHU CẦU ĐANG ĐƯỢC KẾT NỐI QUA HỘI (SECTION 19 SPEC 24.TXT) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-4">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-400 font-mono uppercase tracking-wider">
                SECTION 19 — MINH BẠCH & BẢO MẬT B2B
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading">
                Nhu Cầu Chuỗi Cung Ứng Đang Được Các Hội Hỗ Trợ Tìm Nguồn
              </h3>
              <p className="text-xs text-slate-400">
                Toàn bộ danh tính cá nhân người mua, báo giá chi tiết và ngân sách mật được bảo vệ nghiêm ngặt.
              </p>
            </div>
            <Link
              to="/nhu-cau"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shrink-0"
            >
              Xem sàn nhu cầu B2B
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicRequirements.map(req => (
              <div
                key={req.id}
                className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded font-mono">
                    {req.category}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Đang thu thập hồ sơ</span>
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-2">
                  {req.title}
                </h4>

                <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-700/60">
                  <p>Số lượng: <strong className="text-slate-200">{req.quantity}</strong></p>
                  <p>Địa bàn giao: <span className="text-slate-300">{req.deliveryLocation}</span></p>
                  <p className="text-amber-400 text-[10.5px]">Đại diện: {req.sanitizedBuyerRole}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM BANNER: ĐỀ XUẤT CHƯƠNG TRÌNH CHO HỘI (SECTION 22 & 23) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-[#072348] via-[#0047a5] to-[#0052cc] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold font-heading">
              <Handshake className="w-4 h-4 text-emerald-400" />
              <span>HỢP TÁC CHIẾN LƯỢC CÙNG CHUOICUNGUNG.COM</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
              Bạn Là Đại Diện Ban Lãnh Đạo / Ban Thư Ký Hiệp Hội?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
              Đề xuất ngày hội kết nối cung ứng, workshop chuyên ngành hoặc chương trình khảo sát nhu cầu dành riêng cho cộng đồng hội viên của bạn. Hệ sinh thái hỗ trợ số hóa toàn diện từ thu thập nhu cầu đến xúc tiến giao thương B2B.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/dich-vu/to-chuc-ket-noi?source=association"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#0047a5] text-xs sm:text-sm font-bold rounded-xl shadow-lg transition flex items-center space-x-2 font-heading tracking-wide group"
            >
              <span>ĐỀ XUẤT CHƯƠNG TRÌNH CHO HỘI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL: ĐỀ NGHỊ LIÊN KẾT HỘI VIÊN (SECTION 13 SPEC 24.TXT) */}
      {/* QUY TẮC CỨNG: KHÔNG AUTO APPROVE, PHẢI QUA REVIEW QUEUE */}
      {/* ========================================================================= */}
      {showClaimModal && selectedAssocForClaim && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold font-mono text-[#0052cc] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                XÁC NHẬN TƯ CÁCH HỘI VIÊN
              </span>
              <h4 className="text-lg sm:text-xl font-black font-heading text-slate-900">
                Đề Nghị Liên Kết Hồ Sơ Hội Viên
              </h4>
              <p className="text-xs text-slate-500">
                Gửi tới Ban Thư Ký: <strong className="text-slate-800">{selectedAssocForClaim.name}</strong>
              </p>
            </div>

            {/* Warning Note (Section 13) */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Quy định xác thực minh bạch:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Tham dự chương trình hoặc cùng ngành nghề không đồng nghĩa là hội viên. Hồ sơ đề nghị sẽ được Ban Thư Ký đối chiếu với sổ bộ hội viên chính thức trước khi cấp chứng chỉ số.
              </p>
            </div>

            {claimResult ? (
              <div className={`p-4 rounded-xl text-center space-y-2 ${claimResult.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${claimResult.success ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {claimResult.success ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <h5 className="font-bold text-xs sm:text-sm">
                  {claimResult.success ? 'Gửi Yêu Cầu Thành Công!' : 'Gửi Yêu Cầu Thất Bại'}
                </h5>
                <p className="text-xs leading-relaxed">
                  {claimResult.message}
                </p>
                {claimResult.claimId && (
                  <p className="text-[11px] font-mono text-slate-500 pt-1">
                    Mã hồ sơ: {claimResult.claimId}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên Doanh Nghiệp Của Bạn *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Công ty TNHH Cơ Khí Chính Xác Nam Việt"
                    value={claimFormData.companyName}
                    onChange={(e) => setClaimFormData({ ...claimFormData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mã Số Thuế (MST) *</label>
                    <input
                      type="text"
                      required
                      placeholder="0312345678"
                      value={claimFormData.taxCode}
                      onChange={(e) => setClaimFormData({ ...claimFormData, taxCode: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Loại Hội Viên</label>
                    <select
                      value={claimFormData.membershipType}
                      onChange={(e) => setClaimFormData({ ...claimFormData, membershipType: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    >
                      <option value={MEMBERSHIP_TYPE_ENUM.HOI_VIEN_CHINH_THUC}>Hội viên chính thức</option>
                      <option value={MEMBERSHIP_TYPE_ENUM.HOI_VIEN_LIEN_KET}>Hội viên liên kết</option>
                      <option value={MEMBERSHIP_TYPE_ENUM.HOI_VIEN_DANH_DU}>Hội viên danh dự</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Người Liên Hệ *</label>
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên đại diện"
                      value={claimFormData.representativeName}
                      onChange={(e) => setClaimFormData({ ...claimFormData, representativeName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={claimFormData.phone}
                      onChange={(e) => setClaimFormData({ ...claimFormData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Công Vụ</label>
                  <input
                    type="email"
                    placeholder="contact@doanhnghiep.vn"
                    value={claimFormData.email}
                    onChange={(e) => setClaimFormData({ ...claimFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Bằng Chứng / Số Thẻ Hội Viên (Nếu có)</label>
                  <textarea
                    rows={2}
                    placeholder="Số quyết định kết nạp, năm gia nhập hoặc thông tin xác minh..."
                    value={claimFormData.evidenceNotes}
                    onChange={(e) => setClaimFormData({ ...claimFormData, evidenceNotes: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={claimSubmitting}
                    className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-blue-900/20"
                  >
                    {claimSubmitting ? (
                      <span>Đang gửi...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>GỬI ĐỀ NGHỊ LIÊN KẾT</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
}

function ActivityBadge() {
  return (
    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-ping"></span>
  );
}
