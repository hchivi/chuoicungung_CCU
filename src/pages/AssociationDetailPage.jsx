import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Clock, Download, FileText, Share2, Star, ArrowRight, 
  ChevronRight, Award, Shield, Sparkles, Building2, Layers,
  PhoneCall, MessageCircle, ExternalLink, ShieldCheck, Briefcase,
  ImageIcon, Compass, HelpCircle, Check, Smartphone, Contact,
  Headphones, Landmark, Handshake, Rocket, X, Tag, FileCheck,
  Target, ArrowUpRight, FolderLock, FileDown, BookOpen, AlertCircle
} from 'lucide-react';
import associationsList from '../data/associations.json';
import { associationsData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getFullAssociationData, 
  submitMembershipClaim, 
  MEMBERSHIP_TYPE_ENUM,
  getSupplierGroupsForAssociation,
  getConnectionCasesForAssociation,
  getConfirmedMembersForAssociation,
  getDetailedProgramsForAssociation,
  getPublicRequirementsForAssociation,
  exportMembershipRoster,
  slugify
} from '../data/associationsData';

export default function AssociationDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  
  // Resolve via master Association engine or fallback to crawled
  const fullAssoc = getFullAssociationData(id);
  const assoc = fullAssoc || 
                associationsList.find(a => a.id === id || slugify(a.name) === id) || 
                associationsData.find(a => a.id === id) || 
                associationsList[0] || associationsData[0];

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
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
  const [exportMessage, setExportMessage] = useState(null);

  const rawPhone = assoc.publicContact?.phone || assoc.phone || '024 3822 5555';
  const cleanDigits = rawPhone.replace(/\D/g, '');
  const zaloUrl = cleanDigits.length >= 9 ? `https://zalo.me/${cleanDigits}` : null;
  const initial = (assoc.name || 'H').charAt(0).toUpperCase();

  // Queries according to spec 25.txt
  const orgId = assoc.organizationId || assoc.id;
  const confirmedMembers = getConfirmedMembersForAssociation(orgId);
  const detailedPrograms = getDetailedProgramsForAssociation(orgId);
  const publicRequirements = getPublicRequirementsForAssociation(orgId);
  const supplierGroups = getSupplierGroupsForAssociation(orgId);
  const connectionCases = getConnectionCasesForAssociation(orgId);

  // Open vs Completed programs
  const openPrograms = detailedPrograms.openPrograms || [];
  const completedPrograms = detailedPrograms.completedPrograms || [];

  // Industry & Geographic tags
  const industryList = assoc.profile?.industryScope || assoc.capabilities || ['Cơ khí chính xác', 'Điện - Điện tử', 'Tự động hóa'];
  const geographicList = assoc.profile?.geographicScope || [assoc.province || 'Toàn quốc'];
  const scopeText = industryList.slice(0, 3).join(', ');

  // SEO & JSON-LD (Section 31 & 32)
  useEffect(() => {
    if (assoc?.name) {
      document.title = `${assoc.name} | CHUOICUNGUNG.COM`;

      // Set meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `Thông tin ${assoc.name}, lĩnh vực hoạt động, chương trình kết nối, hội viên đã xác nhận, nhu cầu và catalogue được phép công bố.`;

      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', `https://chuoicungung.com/hiep-hoi/${id || assoc.slug || assoc.id}`);

      // JSON-LD Structured Data (Section 32)
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'association-structured-data';
      schemaScript.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `https://chuoicungung.com/hoi-hiep-hoi/${assoc.slug || assoc.id}#organization`,
            'name': assoc.name,
            'url': `https://chuoicungung.com/hoi-hiep-hoi/${assoc.slug || assoc.id}`,
            'logo': assoc.logo || 'https://chuoicungung.com/logo_onlyc.png',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': assoc.publicContact?.address || assoc.address || 'Việt Nam',
              'addressCountry': 'VN'
            },
            'foundingDate': assoc.profile?.establishedYear ? `${assoc.profile.establishedYear}-01-01` : undefined,
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': rawPhone,
              'contactType': 'customer support',
              'email': assoc.publicContact?.email || assoc.email
            }
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
                'name': 'Hội / Hiệp Hội',
                'item': 'https://chuoicungung.com/hoi-hiep-hoi'
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': assoc.name,
                'item': `https://chuoicungung.com/hoi-hiep-hoi/${assoc.slug || assoc.id}`
              }
            ]
          }
        ]
      });

      const oldSchema = document.getElementById('association-structured-data');
      if (oldSchema) oldSchema.remove();
      document.head.appendChild(schemaScript);

      return () => {
        const toRemove = document.getElementById('association-structured-data');
        if (toRemove) toRemove.remove();
      };
    }
  }, [assoc]);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(rawPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleExportRoster = () => {
    try {
      // Mock user context as association visitor without export permission
      // to demonstrate strict RBAC compliance (Section 40, 41, 44.14)
      const userContext = { isAuthenticated: false };
      exportMembershipRoster(orgId, userContext);
    } catch (err) {
      setExportMessage(err.message);
      setTimeout(() => setExportMessage(null), 4000);
    }
  };

  const hasGallery = Array.isArray(assoc.galleryGroups) && assoc.galleryGroups.length > 0;

  return (
    <main className="space-y-6 pb-28 pt-2 sm:pt-4 font-sans bg-[#f8fafc] min-h-screen text-slate-800 antialiased">
      
      {/* 1. Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto py-2">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/hoi-hiep-hoi" className="hover:text-blue-600 transition shrink-0">Hội / Hiệp Hội / Tổ Chức</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate">{assoc.name}</span>
        </nav>
      </div>

      {/* 2. Top Hero Profile Banner (Section 3 & 4) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#0a2540] to-[#0B3558] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center space-x-4 sm:space-x-5">
              {/* Logo / Initials */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                {assoc.logo ? (
                  <img 
                    src={assoc.logo} 
                    alt={assoc.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  style={{ display: assoc.logo ? 'none' : 'flex' }}
                  className="w-full h-full rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-2xl sm:text-3xl items-center justify-center font-heading shadow-md"
                >
                  {initial}
                </span>
              </div>

              {/* Title & Tags */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {assoc.profile?.shortName && (
                    <span className="px-2.5 py-0.5 bg-blue-500/25 text-blue-200 text-[11px] font-black rounded-full border border-blue-400/40 font-mono tracking-wide">
                      {assoc.profile.shortName}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-400/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{assoc.status || "Hồ sơ đã xác thực"}</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-500/20 text-slate-200 text-[11px] font-medium rounded-full border border-slate-400/30 font-mono">
                    {assoc.profile?.associationType || assoc.orgType || "Hội ngành nghề kỹ thuật"}
                  </span>
                  <span className="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-300 text-[11px] font-bold rounded-full border border-yellow-400/30 font-mono">
                    Thành lập: {assoc.profile?.establishedYear || assoc.establishedYear || "2001"}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading leading-tight tracking-tight">
                  {assoc.name}
                </h1>
                
                {/* Canonical Subtitle (Section 3) */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
                  Hỗ trợ doanh nghiệp trong {scopeText} thông qua các chương trình, hoạt động kết nối và thông tin được xác nhận.
                </p>

                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 pt-1">
                  <span>Địa bàn: <strong className="text-slate-200">{assoc.province || assoc.region || 'Toàn quốc'}</strong></span>
                  <span>•</span>
                  <span>Cập nhật: <strong className="text-slate-200">{assoc.profile?.updatedAt ? new Date(assoc.profile.updatedAt).toLocaleDateString('vi-VN') : '28/09/2026'}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions & CTAs (Section 4) */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
              <a
                href="#programs-section"
                className="flex-1 md:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md font-heading cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Xem hoạt động</span>
              </a>

              <Link
                to={`/dich-vu/to-chuc-ket-noi?source=association&organizationId=${orgId}`}
                className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md font-heading"
                title="Đề nghị kết nối với hội viên"
              >
                <Handshake className="w-4 h-4" />
                <span>Đề nghị kết nối</span>
              </Link>

              <button
                onClick={() => {
                  setClaimResult(null);
                  setShowClaimModal(true);
                }}
                className="flex-1 md:flex-initial px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Tôi là hội viên</span>
              </button>

              <a 
                href={`tel:${cleanDigits}`}
                className="flex-1 md:flex-initial px-3.5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md font-heading"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hotline</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Content Layout (Section 42 Mobile Order) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT / MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-6">

            {/* SECTION 5: GIỚI THIỆU TỔ CHỨC */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                  1. Giới thiệu tổ chức & Vai trò điều phối
                </h2>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 font-normal">
                <p>
                  {assoc.profile?.scopeDescription || assoc.description || `${assoc.name} là tổ chức đại diện uy tín cho cộng đồng doanh nghiệp ngành nghề tại Việt Nam, đóng vai trò then chốt trong việc thúc đẩy liên kết chuỗi giá trị sản xuất, tư vấn chính sách và bảo vệ quyền lợi hợp pháp của hội viên.`}
                </p>
                <p>
                  Tổ chức đóng vai trò node điều phối trong hệ sinh thái CHUOICUNGUNG.COM: liên kết năng lực nhà cung ứng hội viên với các bài toán mua hàng thực tế từ nhà máy FDI và tập đoàn công nghiệp.
                </p>
              </div>

              {/* Scope & Verified Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-blue-600 font-mono">{confirmedMembers.length}</span>
                  <p className="text-[10.5px] text-slate-500 font-medium">Hội viên đã xác nhận</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-emerald-600 font-mono">{openPrograms.length + completedPrograms.length}</span>
                  <p className="text-[10.5px] text-slate-500 font-medium">Chương trình liên kết</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-amber-600 font-mono">{supplierGroups.length}</span>
                  <p className="text-[10.5px] text-slate-500 font-medium">Cụm nhóm cung ứng</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-purple-600 font-mono">{connectionCases.length}</span>
                  <p className="text-[10.5px] text-slate-500 font-medium">Case ghép nối chuẩn</p>
                </div>
              </div>
            </section>

            {/* SECTION 7: LĨNH VỰC / PHẠM VI HOẠT ĐỘNG */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                  2. Lĩnh vực & Phạm vi hoạt động
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Lĩnh vực chuyên môn trọng tâm
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {industryList.map((ind, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-[#0052cc] text-xs font-bold rounded-xl border border-blue-200">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Phạm vi địa bàn hoạt động
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {geographicList.map((geo, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{geo}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 13, 14, 15: CHƯƠNG TRÌNH ĐANG TRIỂN KHAI & ĐÃ THỰC HIỆN */}
            <section id="programs-section" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    3. Chương trình phối hợp cùng Hội
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-xs font-bold font-mono rounded-full border border-blue-200">
                  {openPrograms.length + completedPrograms.length} Chương trình
                </span>
              </div>

              {/* Sắp diễn ra / Đang mở đăng ký */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Đang mở & Sắp diễn ra ({openPrograms.length})</span>
                </h3>

                {openPrograms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {openPrograms.map((prog, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition shadow-2xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10.5px] font-bold rounded-md border border-emerald-200 font-mono">
                            {prog.roleLabel || 'Đơn vị tổ chức'}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                            {prog.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                            <p className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{prog.dates || 'Tháng 10/2026'}</span>
                            </p>
                            <p className="flex items-center space-x-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{prog.location || 'Việt Nam'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/70 flex justify-end">
                          <Link
                            to={`/chuong-trinh/${prog.slug || prog.id}`}
                            className="px-3.5 py-1.5 bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-2xs"
                          >
                            <span>Xem chi tiết</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 text-center">
                    Hiện chưa có chương trình mở đăng ký mới. Các chương trình sẽ được công bố định kỳ sau khi ký kết kế hoạch.
                  </div>
                )}
              </div>

              {/* Đã diễn ra / Lịch sử */}
              {completedPrograms.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Chương trình đã thực hiện ({completedPrograms.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {completedPrograms.map((prog, pIdx) => (
                      <div key={pIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] text-slate-400 font-mono">{prog.roleLabel}</span>
                          <h5 className="font-bold text-xs text-slate-800 truncate">{prog.title}</h5>
                        </div>
                        <Link
                          to={`/chuong-trinh/${prog.slug || prog.id}`}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 shrink-0"
                        >
                          Kết quả
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 16 & 17: NHU CẦU ĐANG ĐƯỢC KẾT NỐI (PUBLIC REQUIREMENTS) */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    4. Nhu cầu mua hàng đang kết nối cho Hội viên
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-xs font-bold font-mono rounded-full border border-amber-200">
                  {publicRequirements.length} Nhu cầu công khai
                </span>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center space-x-2 text-xs text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Bảo vệ dữ liệu Buyer: Mọi thông tin danh tính người mua, liên hệ cá nhân và ngân sách chi tiết được bảo mật qua workflow điều phối.
                </span>
              </div>

              {publicRequirements.length > 0 ? (
                <div className="space-y-3">
                  {publicRequirements.map((req, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10.5px] font-mono font-bold rounded-md">
                          Mã: {req.id}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {req.sanitizedBuyerRole}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {req.title}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400">Số lượng: </span>
                          <strong className="text-slate-800">{req.quantity}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Địa điểm: </span>
                          <strong className="text-slate-800">{req.deliveryLocation}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Hạn phản hồi: </span>
                          <strong className="text-slate-800">{req.deadline}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Ngân sách kín • Hồ sơ thẩm định
                        </span>
                        <Link
                          to={`/nhu-cau-mua-hang/${req.id}`}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-2xs font-heading"
                        >
                          <span>Tôi có khả năng đáp ứng</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 text-center">
                  Hiện tại các nhu cầu đang trong giai đoạn tiếp nhận và phân bổ trực tiếp qua Ban Thư ký.
                </div>
              )}
            </section>

            {/* SECTION 8, 9, 10: HỘI VIÊN ĐÃ ĐƯỢC XÁC NHẬN */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    5. Hội viên đã được xác nhận chính thức
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold font-mono rounded-full border border-emerald-200">
                  {confirmedMembers.length} Doanh nghiệp
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11.5px] text-slate-600 flex items-center justify-between">
                <span>
                  Quy định Section 8 & 9: Chỉ công khai doanh nghiệp có quyết định kết nạp chính thức (status = CONFIRMED) và cho phép hiển thị danh bạ.
                </span>
                <button
                  onClick={handleExportRoster}
                  className="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-[10.5px] font-bold rounded-lg shrink-0 flex items-center space-x-1 ml-2"
                >
                  <FileDown className="w-3 h-3 text-slate-500" />
                  <span>Tải danh bạ</span>
                </button>
              </div>

              {exportMessage && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{exportMessage}</span>
                </div>
              )}

              {confirmedMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {confirmedMembers.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 shadow-2xs overflow-hidden">
                            {m.logo ? (
                              <img src={m.logo} alt={m.companyName} className="w-full h-full object-contain p-1" />
                            ) : (
                              <span>{m.companyName.charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                              {m.roles?.[0] || 'SUPPLIER'}
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 truncate font-heading">
                              {m.companyName}
                            </h4>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-1 pl-1">
                          <p className="truncate">Năng lực: <strong className="text-slate-700">{m.category}</strong></p>
                          <p className="flex items-center space-x-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{m.location}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex justify-end">
                        <Link
                          to={`/doanh-nghiep/${m.memberOrganizationId}`}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 transition flex items-center space-x-1"
                        >
                          <span>Xem hồ sơ</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 text-center">
                  Danh bạ hội viên đang được Ban Chấp hành cập nhật niên giám mới.
                </div>
              )}

              {/* Claim CTA Inline */}
              <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-medium text-center sm:text-left">
                  Doanh nghiệp của bạn là hội viên chính thức của {assoc.name}?
                </span>
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shrink-0"
                >
                  Tôi là hội viên của tổ chức này
                </button>
              </div>
            </section>

            {/* SECTION 18, 19, 20: NHÓM NHÀ CUNG ỨNG LIÊN QUAN (SUPPLIER GROUPS) */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    6. Nhóm nhà cung ứng liên quan theo năng lực
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-800 text-xs font-bold font-mono rounded-full border border-purple-200">
                  {supplierGroups.length} Nhóm năng lực
                </span>
              </div>

              {supplierGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {supplierGroups.map((grp, gIdx) => (
                    <div
                      key={gIdx}
                      className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-purple-300 transition shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md font-mono">
                            {grp.category}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 font-mono">
                            {grp.supplierCount} Nhà máy / Xưởng
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          {grp.title}
                        </h4>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed">
                          {grp.description}
                        </p>

                        {grp.sampleSuppliers?.length > 0 && (
                          <div className="pt-1 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Doanh nghiệp tiêu biểu:</span>
                            <div className="flex flex-wrap gap-1">
                              {grp.sampleSuppliers.map((s, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 bg-white text-slate-700 text-[10.5px] font-medium rounded border border-slate-200 truncate max-w-full">
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex justify-end">
                        <Link
                          to={`/doanh-nghiep?category=${encodeURIComponent(grp.category)}`}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-2xs"
                        >
                          <span>Xem nhà cung ứng</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 text-center">
                  Các nhóm cung ứng đang được phân cụm theo khảo sát năng lực sản xuất mới.
                </div>
              )}
            </section>

            {/* SECTION 21: CATALOGUE & ẤN PHẨM */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    7. Catalogue & Ấn phẩm chuyên ngành
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-xs font-bold font-mono rounded-full border border-teal-200">
                  Xuất bản chính thức
                </span>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-50/60 to-emerald-50/40 rounded-2xl border border-teal-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-md font-mono">
                    CATALOGUE 2026
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">
                    {assoc.profile?.catalogueTitle || `Kỷ yếu Năng lực Doanh nghiệp Hội viên ${assoc.profile?.shortName || assoc.name} 2026`}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Tuyển tập hồ sơ năng lực máy móc thiết bị, chứng chỉ ISO, IATF và các giải pháp phụ trợ đã được Ban Thẩm định hiệp hội kiểm tra thực địa.
                  </p>
                </div>
                <button
                  onClick={() => alert('Catalogue đang được cập nhật bản in điện tử mới nhất. Vui lòng liên hệ Văn phòng Hiệp hội để nhận file PDF gốc.')}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-md shadow-teal-700/20 font-heading"
                >
                  <Download className="w-4 h-4" />
                  <span>Xem Catalogue</span>
                </button>
              </div>
            </section>

            {/* SECTION 23 & 24: CASE KẾT NỐI TIÊU BIỂU */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    8. Case kết nối thành công tiêu biểu
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold font-mono rounded-full border border-emerald-200">
                  {connectionCases.length} Case được đồng ý công bố
                </span>
              </div>

              {connectionCases.length > 0 ? (
                <div className="space-y-4">
                  {connectionCases.map((cs, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10.5px] font-bold rounded-md font-mono">
                          Xác nhận kết quả • {cs.connectionDate}
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-mono">
                          Mã minh chứng: {cs.evidenceRef}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">
                        {cs.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {cs.summary}
                      </p>

                      {/* 4 Steps Flow */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Nhu cầu gốc:</span>
                          <p className="font-semibold text-slate-800 line-clamp-1">{cs.initialRequirement?.title}</p>
                          <span className="text-[10.5px] text-slate-500 font-mono">{cs.initialRequirement?.quantity}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Nhà cung cấp ghép nối:</span>
                          <p className="font-semibold text-slate-800 line-clamp-1">{cs.matchedSupplier?.name}</p>
                          <span className="text-[10.5px] text-slate-500">{cs.matchedSupplier?.location}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">Kết quả bàn giao:</span>
                          <p className="font-bold text-emerald-900 line-clamp-2">{cs.outcome}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 text-center">
                  Các case kết nối khác đang trong quá trình bảo lưu thời hạn bảo mật thương mại.
                </div>
              )}
            </section>

            {/* SECTION 27 & 28: CTA CUỐI TRANG (SERVICE REQUEST INTEGRATION) */}
            <section className="bg-gradient-to-br from-slate-900 via-[#0B3558] to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 border border-slate-700">
              <span className="px-2.5 py-0.5 bg-yellow-400 text-slate-950 text-[10px] font-black rounded-md font-mono uppercase tracking-wider">
                HỢP TÁC TỔ CHỨC CHƯƠNG TRÌNH
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading">
                Muốn tổ chức chương trình cho Hội viên?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Gửi mục tiêu, nhóm doanh nghiệp, địa bàn và thời gian dự kiến. CHUOICUNGUNG.COM sẽ cùng làm rõ phạm vi và đề xuất cách triển khai.
              </p>
              <div className="pt-2">
                <Link
                  to={`/dich-vu/to-chuc-ket-noi?source=association&organizationId=${orgId}`}
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 font-heading"
                >
                  <Handshake className="w-4 h-4 text-slate-950" />
                  <span>TỔ CHỨC CHƯƠNG TRÌNH CHO HỘI VIÊN</span>
                </Link>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Contact & Quick Info (Section 6) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
              
              {/* Header Box (Dark Top Bar) */}
              <div className="bg-[#14120c] text-white p-4 flex items-center space-x-2.5 border-b border-yellow-500/30">
                <Headphones className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 font-heading">
                  ĐẦU MỐI HỢP TÁC CHÍNH THỨC
                </h3>
              </div>

              {/* Organization Logo & Title */}
              <div className="p-4 sm:p-5 flex items-center space-x-3.5 border-b border-slate-100 bg-slate-50/50">
                <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-white p-1.5 shrink-0 shadow-2xs flex items-center justify-center overflow-hidden">
                  {assoc.logo ? (
                    <img 
                      src={assoc.logo} 
                      alt={assoc.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    style={{ display: assoc.logo ? 'none' : 'flex' }}
                    className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl items-center justify-center font-heading shadow-inner"
                  >
                    {initial}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 font-heading line-clamp-2 leading-tight">
                    {assoc.name}
                  </h4>
                  {assoc.profile?.shortName && (
                    <span className="text-[11px] font-bold text-blue-600 font-mono">
                      {assoc.profile.shortName}
                    </span>
                  )}
                </div>
              </div>

              {/* SECTION 6: ĐẦU MỐI HỢP TÁC */}
              <div className="p-4 sm:p-5 space-y-4 border-b border-slate-100">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  <Contact className="w-3.5 h-3.5 text-amber-700" />
                  <span>LIÊN HỆ VĂN PHÒNG TIẾP NHẬN</span>
                </div>

                <div className="space-y-3">
                  {/* Phone */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Điện thoại chính thức</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <a href={`tel:${cleanDigits}`} className="font-mono font-bold text-xs text-slate-900 hover:text-blue-600">
                          {rawPhone}
                        </a>
                      </div>
                      <button
                        onClick={handleCopyPhone}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                      >
                        {copiedPhone ? 'Đã sao chép' : 'Chép'}
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  {(assoc.publicContact?.email || assoc.email) && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Email công vụ</span>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-mono text-xs text-slate-800 truncate">
                          {assoc.publicContact?.email || assoc.email}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {(assoc.publicContact?.website || assoc.website) && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Website chính thức</span>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <a 
                          href={assoc.publicContact?.website || assoc.website} 
                          target="_blank" 
                          rel="noreferrer"
                          className="font-mono text-xs text-blue-600 hover:underline truncate flex items-center space-x-1"
                        >
                          <span className="truncate">{assoc.publicContact?.website || assoc.website}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Zalo button if available */}
                  {zaloUrl && (
                    <a
                      href={zaloUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md font-heading"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Kết nối Zalo Văn phòng</span>
                    </a>
                  )}
                </div>
              </div>

              {/* THÔNG TIN NHANH */}
              <div className="p-4 sm:p-5 space-y-2.5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-amber-700" />
                  <span>THÔNG TIN PHÁP LÝ & ĐỊA BÀN</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-500 shrink-0">Loại hình</span>
                    <span className="font-bold text-slate-900 text-right">{assoc.profile?.associationType || assoc.orgType || "Hội ngành nghề"}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 shrink-0">Năm thành lập</span>
                    <span className="font-mono font-bold text-slate-900">{assoc.profile?.establishedYear || assoc.establishedYear || "2001"}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 shrink-0">Mã số thuế / Số ĐKKD</span>
                    <span className="font-mono font-bold text-slate-900">{assoc.taxCode || "Đã xác thực"}</span>
                  </div>
                </div>
              </div>

              {/* ĐỊA ĐIỂM TRỤ SỞ */}
              <div className="p-4 sm:p-5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>TRỤ SỞ HOẠT ĐỘNG</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {assoc.publicContact?.address || assoc.address || "Việt Nam"}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* MODAL: ĐỀ NGHỊ LIÊN KẾT HỘI VIÊN (SECTION 11) */}
      {showClaimModal && (
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
                Gửi tới Ban Thư Ký: <strong className="text-slate-800">{assoc.name}</strong>
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Quy định xác thực minh bạch (Section 11):</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Hồ sơ đề nghị sẽ được Ban Thư Ký Hiệp Hội đối chiếu với sổ bộ hội viên chính thức trước khi phê duyệt (status: CONFIRMED). Không tự động duyệt claim.
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setClaimSubmitting(true);
                  try {
                    const res = submitMembershipClaim({
                      associationOrganizationId: orgId,
                      memberOrganizationName: claimFormData.companyName,
                      requesterName: claimFormData.representativeName,
                      requesterEmail: claimFormData.email,
                      requesterPhone: claimFormData.phone,
                      membershipType: claimFormData.membershipType,
                      evidenceNotes: `MST: ${claimFormData.taxCode}. Ghi chú: ${claimFormData.evidenceNotes}`
                    });
                    setClaimResult({ success: true, message: res.message });
                  } catch (err) {
                    setClaimResult({ success: false, message: err.message || 'Lỗi gửi yêu cầu' });
                  } finally {
                    setClaimSubmitting(false);
                  }
                }}
                className="space-y-3.5"
              >
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
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
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
                      placeholder="Họ và tên"
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
                  <label className="text-xs font-bold text-slate-700">Ghi Chú / Bằng Chứng Hội Viên</label>
                  <textarea
                    rows={2}
                    placeholder="Số thẻ hội viên, ngày gia nhập hoặc chứng từ..."
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
                    className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-900/20"
                  >
                    {claimSubmitting ? 'Đang gửi...' : 'GỬI ĐỀ NGHỊ LIÊN KẾT'}
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
