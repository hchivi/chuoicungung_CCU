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
import AssociationDiscovery from '../components/association/AssociationDiscovery';
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
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (MATCHES IMAGE 2 LAYOUT & TEXT HIERARCHY)                */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">

        {/* Summit Panorama Background */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img
            src="/images/association_summit_hero.jpg"
            alt="Hội và hiệp hội trong chuỗi cung ứng"
            className="w-full h-full object-cover object-[62%_center] scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
          />
          <AssociationConstellationCanvas className="opacity-75 z-[2]" />
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 z-[3] bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Content Container Aligned Exactly with Image 2 */}
        <div className="hero-standard-container relative z-10 py-8 sm:py-10" style={{ width: 'min(1280px, calc(100% - 48px))', marginInline: 'auto' }}>
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn trang">
            <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-900 font-medium" aria-current="page">Hội &amp; Hiệp hội</span>
          </nav>

          <div className="max-w-xl">

            {/* Category Label */}
            <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
              Tổ chức ngành nghề &amp; Mạng lưới B2B
            </p>

            {/* H1 Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
              Hội và hiệp hội<br />trong chuỗi cung ứng.
            </h1>

            {/* Lede (Tagline) */}
            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
              Đúng tổ chức chuyên môn.<br />Rõ cộng đồng hội viên.
            </p>

            {/* Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
              Khám phá các tổ chức đang triển khai chương trình, kết nối nhu cầu và hỗ trợ doanh nghiệp theo ngành, địa bàn. Duy trì hoạt động đồng hành trước và sau mỗi chương trình.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#danh-sach-hiep-hoi"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95"
              >
                <span>Tìm hội / hiệp hội</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/tao-ho-so?type=association"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2"
              >
                <span>Cập nhật hồ sơ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </section>

      <AssociationDiscovery
        listingData={listingData}
        sectors={SECTOR_CATEGORIES}
        filters={{ search: searchTerm, sector: selectedSector, region: selectedRegion,
          scope: selectedScopeType, openPrograms: hasOpenProgramsOnly,
          catalogue: hasCatalogueOnly, sort: sortBy }}
        onChange={(key, value) => ({
          search: setSearchTerm, sector: setSelectedSector, region: setSelectedRegion,
          scope: setSelectedScopeType, openPrograms: setHasOpenProgramsOnly,
          catalogue: setHasCatalogueOnly, sort: setSortBy,
        })[key](value)}
        onQuickFilter={(values) => {
          resetAllFilters();
          if (values.sector) setSelectedSector(values.sector);
          if (values.region) setSelectedRegion(values.region);
          if (values.openPrograms) setHasOpenProgramsOnly(true);
        }}
        onReset={resetAllFilters}
        onClaim={openClaimForAssociation}
      />

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
