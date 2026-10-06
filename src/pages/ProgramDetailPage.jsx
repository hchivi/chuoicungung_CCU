import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Building2, Factory, ArrowRight,
  ChevronRight, Sparkles, Filter, Search, ShoppingCart, Truck,
  Store, Handshake, Info, Award, ArrowLeft, ShieldCheck,
  CheckCircle2, Clock, Globe, DollarSign, AlertCircle, X,
  Send, Camera, FileText, Check, RotateCcw, Tag, ExternalLink,
  ShieldAlert, PhoneCall, Mail, MessageSquare, Download, Layers,
  Compass, HelpCircle, UserCheck, ChevronDown, ChevronUp, Share2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getProgramByIdOrSlug,
  calculateFeeDisplay,
  getProgramPublicBuyerNeeds,
  getProgramShowcaseSuppliers,
  trackProgramAnalytics,
  PROGRAM_STATUSES_ENUM,
  TARGET_ROLES_ENUM
} from '../data/programsData';

// Shared Page 20 & 21 Subcomponents
import ProgramInterestModal from '../components/programs/ProgramInterestModal';
import ProgramSuppiGuideModal from '../components/programs/ProgramSuppiGuideModal';
import ProgramCompletedRecapModal from '../components/programs/ProgramCompletedRecapModal';

export default function ProgramDetailPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Active Role Tab for "Chương trình dành cho ai" & "Bạn nên chuẩn bị gì"
  const [activeRoleTab, setActiveRoleTab] = useState('buyer'); // 'buyer', 'supplier', 'partner'
  const [activePrepTab, setActivePrepTab] = useState('buyer');

  // Policy Accordion Active Key
  const [activePolicyTab, setActivePolicyTab] = useState('changeInfo');

  // Modals
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showSuppiModal, setShowSuppiModal] = useState(false);
  const [showRecapModal, setShowRecapModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);

  // Gallery lightbox preview
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState(null);

  // Retrieve Program by slug or id
  const program = useMemo(() => {
    return getProgramByIdOrSlug(slug);
  }, [slug]);

  // Derived Public Buyer Needs (strictly sanitized of private contacts/budgets)
  const publicBuyerNeeds = useMemo(() => {
    return program ? getProgramPublicBuyerNeeds(program) : [];
  }, [program]);

  // Derived Showcase Suppliers
  const showcaseSuppliers = useMemo(() => {
    return program ? getProgramShowcaseSuppliers(program) : [];
  }, [program]);

  // SEO & Schema.org JSON-LD (Section 38 & 39)
  useEffect(() => {
    if (!program) return;

    // Track analytics view (Section 41)
    trackProgramAnalytics('program_detail_view', {
      programId: program.id,
      publicCode: program.publicCode,
      title: program.title
    });

    // Document Title & Meta Description
    document.title = `${program.title} | CHUOICUNGUNG.COM`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `${program.title} kết nối doanh nghiệp theo nhóm nhu cầu ${program.needGroup?.slice(0, 3).join(', ') || program.industry} tại ${program.provinceName || program.location}. Xem đối tượng phù hợp, hình thức tham gia, lịch trình và thông tin đăng ký.`
      );
    }

    // Dynamic Schema.org Event & Breadcrumb
    const schemaScriptId = 'program-jsonld-schema';
    let script = document.getElementById(schemaScriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = schemaScriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    // Map Event Status (Section 39)
    let schemaStatus = 'https://schema.org/EventScheduled';
    if (program.status === 'hoan' || program.programStatus === PROGRAM_STATUSES_ENUM.POSTPONED) {
      schemaStatus = 'https://schema.org/EventPostponed';
    } else if (program.status === 'huy' || program.programStatus === PROGRAM_STATUSES_ENUM.CANCELLED) {
      schemaStatus = 'https://schema.org/EventCancelled';
    }

    // Map Event Modality
    let attendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
    if (program.modality === 'ONLINE') {
      attendanceMode = 'https://schema.org/OnlineEventAttendanceMode';
    } else if (program.modality === 'HYBRID') {
      attendanceMode = 'https://schema.org/MixedEventAttendanceMode';
    }

    const eventJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Event',
          'name': program.title,
          'description': program.shortDescription || program.description,
          'startDate': program.startAt || program.date,
          'endDate': program.endAt || program.date,
          'eventStatus': schemaStatus,
          'eventAttendanceMode': attendanceMode,
          'location': {
            '@type': 'Place',
            'name': program.venue || program.location,
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': program.location,
              'addressLocality': program.provinceName || program.location,
              'addressCountry': 'VN'
            }
          },
          'image': [program.image || 'https://chuoicungung.com/images/smart_factory_hero.jpg'],
          'organizer': {
            '@type': 'Organization',
            'name': program.organizer || 'CHUOICUNGUNG.COM',
            'url': 'https://chuoicungung.com'
          },
          'offers': {
            '@type': 'Offer',
            'url': `https://chuoicungung.com/chuong-trinh/${program.slug || program.id}`,
            'price': program.pricingType === 'free' ? '0' : '0',
            'priceCurrency': 'VND',
            'availability': 'https://schema.org/InStock',
            'validFrom': program.registrationOpenAt || '2026-09-01T08:00:00+07:00'
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
              'name': 'Chương trình kết nối',
              'item': 'https://chuoicungung.com/chuong-trinh'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': program.shortName || program.title,
              'item': `https://chuoicungung.com/chuong-trinh/${program.slug || program.id}`
            }
          ]
        }
      ]
    };

    script.textContent = JSON.stringify(eventJsonLd);

    return () => {
      const el = document.getElementById(schemaScriptId);
      if (el) el.remove();
    };
  }, [program]);

  // Section 2: Unpublished Program Protection
  if (!program || program.publishable === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Chương Trình Chưa Công Bố Hoặc Không Tồn Tại
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Chương trình này đang trong quá trình điều phối nội bộ hoặc đường dẫn không chính xác. Vui lòng quay lại danh sách để tìm kiếm chương trình phù hợp.
          </p>
          <div className="pt-2">
            <Link
              to="/chuong-trinh"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0052cc] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#003ea8] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Xem danh sách chương trình</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper check for registration status
  const isRegOpen = program.programStatus === PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN || program.status === 'dang-nhan-dang-ky';
  const isUpcomingOrDiscovery = 
    program.programStatus === PROGRAM_STATUSES_ENUM.UPCOMING || 
    program.programStatus === PROGRAM_STATUSES_ENUM.NEEDS_DISCOVERY ||
    program.status === 'sap-mo-dang-ky' ||
    program.status === 'dang-khao-sat';
  const isCompleted = program.programStatus === PROGRAM_STATUSES_ENUM.COMPLETED || program.status === 'da-dien-ra';
  const isClosed = program.programStatus === PROGRAM_STATUSES_ENUM.REGISTRATION_CLOSED || program.status === 'da-dong-dang-ky';
  const isPostponed = program.programStatus === PROGRAM_STATUSES_ENUM.POSTPONED || program.status === 'hoan';
  const isCancelled = program.programStatus === PROGRAM_STATUSES_ENUM.CANCELLED || program.status === 'huy';

  // Navigation handlers
  const handleBuyerReg = () => {
    trackProgramAnalytics('buyer_registration_click', { programId: program.id });
    navigate(`/chuong-trinh/${program.slug || program.id}/dang-ky?role=buyer`);
  };

  const handleSupplierReg = () => {
    trackProgramAnalytics('supplier_registration_click', { programId: program.id });
    navigate(`/chuong-trinh/${program.slug || program.id}/dang-ky?role=supplier`);
  };

  const handleSendNeed = () => {
    trackProgramAnalytics('send_need_click', { programId: program.id });
    navigate(`/dang-nhu-cau?program=${program.id}`);
  };

  const handleRemotePresence = () => {
    trackProgramAnalytics('remote_presence_click', { programId: program.id });
    navigate(`/yeu-cau-dich-vu?service=hien-dien-tu-xa&program=${program.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 sm:pb-20 font-sans">
      
      {/* ========================================================
          1. BREADCRUMB & TOP NAV
      ======================================================== */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-1.5 text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/chuong-trinh" className="hover:text-blue-600 transition">Chương trình kết nối</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[350px]">
              {program.shortName || program.title}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: program.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép liên kết chương trình!');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ</span>
            </button>

            <Link
              to="/chuong-trinh"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. HERO SECTION & PROGRAM FACTS (SECTION 3)
      ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-6 pb-8 sm:pt-8 sm:pb-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Top Status & Fact Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0052cc] text-xs font-bold font-mono">
              {program.publicCode || 'PRG-2026'}
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
              {program.typeName}
            </span>

            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{program.formatName || 'Trực tiếp'}</span>
            </span>

            {program.kcn && (
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1">
                <Factory className="w-3.5 h-3.5 text-amber-700" />
                <span>KCN {program.kcn}</span>
              </span>
            )}
          </div>

          {/* H1 Title & Subtitle (Section 3) */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-slate-950 tracking-tight leading-tight">
              {program.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
              Kết nối doanh nghiệp có nhu cầu{' '}
              <strong className="text-slate-900 font-bold">
                {program.needGroup?.slice(0, 4).join(', ') || program.industry}
              </strong>{' '}
              với nhà cung ứng phục vụ tại{' '}
              <strong className="text-slate-900 font-bold">
                {program.zone || program.provinceName || program.location}
              </strong>
              . Xem nội dung, hình thức tham gia và gửi đăng ký phù hợp với doanh nghiệp của bạn.
            </p>
          </div>

          {/* Program Facts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs sm:text-sm pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Thời gian diễn ra</div>
                <div className="font-bold text-slate-900 font-mono">{program.date}</div>
                <div className="text-[11px] text-slate-500">{program.time}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Địa điểm tổ chức</div>
                <div className="font-bold text-slate-900 line-clamp-1">{program.venue || program.location}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{program.location}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Đơn vị chủ trì / tổ chức</div>
                <div className="font-bold text-slate-900 line-clamp-1">{program.organizer}</div>
                <div className="text-[11px] text-slate-500">Mạng lưới CHUOICUNGUNG.COM</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] text-blue-700 font-medium">Đầu mối hỗ trợ đã xác nhận</div>
                <div className="font-bold text-slate-900 font-mono">{program.supportContact?.phone || '0903 888 777'}</div>
                <div className="text-[11px] text-slate-600">{program.supportContact?.coordinatorName || 'Ban Điều phối B2B'}</div>
              </div>
            </div>
          </div>

          {/* STATUS BANNER (SECTION 4) */}
          <div className="pt-1">
            {isRegOpen && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-black font-heading text-sm uppercase tracking-wide">
                    ĐANG NHẬN ĐĂNG KÝ THAM GIA
                  </span>
                  <span className="hidden sm:inline text-xs text-emerald-700 font-medium">
                    (Hạn chót: {program.registrationCloseAt ? new Date(program.registrationCloseAt).toLocaleDateString('vi-VN') : 'Trước 5 ngày sự kiện'})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBuyerReg}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    Đăng Ký Người Mua
                  </button>
                  <button
                    onClick={handleSupplierReg}
                    className="px-4 py-2 rounded-xl bg-[#0052cc] hover:bg-[#003ea8] text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    Đăng Ký Nhà Cung Ứng
                  </button>
                </div>
              </div>
            )}

            {isUpcomingOrDiscovery && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-black font-heading text-sm uppercase tracking-wide">
                    {program.statusName || 'SẮP MỞ ĐĂNG KÝ / ĐANG KHẢO SÁT NHU CẦU'}
                  </span>
                  <span className="hidden sm:inline text-xs text-blue-700 font-medium">
                    — Cổng đăng ký chính thức sẽ mở theo lịch trình điều phối
                  </span>
                </div>

                <button
                  onClick={() => setShowInterestModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003ea8] text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Đăng Ký Quan Tâm Nhận Tin</span>
                </button>
              </div>
            )}

            {isClosed && (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <LockIcon className="w-4 h-4 text-slate-600" />
                  <span className="font-black font-heading text-sm uppercase tracking-wide">
                    ĐÃ ĐÓNG CỔNG ĐĂNG KÝ
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-600 font-medium">
                    — Chương trình đã chốt đủ chỉ tiêu bàn kết nối
                  </span>
                </div>

                <button
                  onClick={() => setShowInterestModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  Tham Gia Danh Sách Chờ
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span className="font-black font-heading text-sm uppercase tracking-wide">
                    CHƯƠNG TRÌNH ĐÃ DIỄN RA THÀNH CÔNG
                  </span>
                  <span className="hidden sm:inline text-xs text-indigo-700 font-medium">
                    — Xem kết quả tổng hợp chính thức và bộ ảnh tư liệu giao thương
                  </span>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('ket-qua-sau-chuong-trinh');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  Xem Kết Quả & Thư Viện
                </button>
              </div>
            )}

            {isPostponed && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-700" />
                  <span>CHƯƠNG TRÌNH TẠM HOÃN — BAN TỔ CHỨC SẼ CẬP NHẬT LỊCH MỚI TRÊN HỆ THỐNG</span>
                </div>
                <button
                  onClick={() => setShowInterestModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition cursor-pointer"
                >
                  Nhận Thông Báo Lịch Mới
                </button>
              </div>
            )}

            {isCancelled && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-2.5 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-700" />
                <span>CHƯƠNG TRÌNH ĐÃ HỦY THEO QUYẾT ĐỊNH CỦA BAN TỔ CHỨC. KHÔNG TIẾP NHẬN ĐĂNG KÝ.</span>
              </div>
            )}
          </div>

          {/* Quick Relevance Fact Checklist (No Fake Probabilities) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Tiêu chí đánh giá tính phù hợp của hồ sơ doanh nghiệp:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cụm địa bàn: <strong>{program.zone} ({program.provinceName || program.location})</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ngành trọng điểm: <strong>{program.industry}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hình thức: <strong>{program.formatName || 'Trực tiếp'}</strong></span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. MAIN CONTENT CONTAINER WITH SECTIONS
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        
        {/* ======================================================
            SECTION 5: CHƯƠNG TRÌNH DÀNH CHO AI?
        ====================================================== */}
        <section id="chuong-trinh-danh-cho-ai" className="space-y-5">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                Chương Trình Dành Cho Ai?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Mỗi nhóm doanh nghiệp tham gia với mục tiêu, tiêu chuẩn xét duyệt và quyền lợi riêng biệt.
              </p>
            </div>

            {/* Role Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-bold">
              <button
                onClick={() => setActiveRoleTab('buyer')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeRoleTab === 'buyer' 
                    ? 'bg-white text-emerald-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nhà Máy / Buyer
              </button>
              <button
                onClick={() => setActiveRoleTab('supplier')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeRoleTab === 'supplier' 
                    ? 'bg-white text-blue-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nhà Cung Ứng
              </button>
              <button
                onClick={() => setActiveRoleTab('partner')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeRoleTab === 'partner' 
                    ? 'bg-white text-purple-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                KCN / Đối Tác
              </button>
            </div>
          </div>

          {/* Active Role Card Details */}
          {activeRoleTab === 'buyer' && (
            <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-black text-emerald-700 uppercase tracking-widest">
                    VAI TRÒ NGƯỜI MUA / BÊN MUA FDI
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  {program.audienceDetails?.buyer?.title || 'Dành cho Nhà máy / Phòng Mua hàng (Purchasing)'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">1. Đối tượng phù hợp:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.buyer?.whoIsItFor}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">2. Tiêu chí tham gia (Eligibility):</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.buyer?.eligibility}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">3. Cần chuẩn bị trước sự kiện:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.buyer?.expectedPreparation}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Phòng Purchasing được <strong>miễn phí 100%</strong> bàn làm việc riêng và hỗ trợ lọc hồ sơ nhà cung ứng.
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleSendNeed}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs transition cursor-pointer"
                  >
                    Gửi Nhu Cầu Tìm Nguồn
                  </button>
                  <button
                    onClick={handleBuyerReg}
                    disabled={!isRegOpen}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isRegOpen ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'bg-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Đăng Ký Người Mua</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === 'supplier' && (
            <div className="bg-white rounded-3xl border border-blue-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-black text-blue-700 uppercase tracking-widest">
                    VAI TRÒ NHÀ CUNG ỨNG NỘI ĐỊA
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  {program.audienceDetails?.supplier?.title || 'Dành cho Nhà cung ứng / Nhà sản xuất phụ trợ'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">1. Đối tượng phù hợp:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.supplier?.whoIsItFor}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">2. Tiêu chí năng lực (Eligibility):</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.supplier?.eligibility}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">3. Cần chuẩn bị trước sự kiện:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.supplier?.expectedPreparation}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Lưu ý: Đăng ký tham gia cần kèm theo Hồ sơ năng lực (Profile) và danh mục mẫu sản phẩm.
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/tao-ho-so"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-blue-300 text-blue-800 hover:bg-blue-50 font-bold text-xs transition text-center"
                  >
                    Hoàn Thiện Hồ Sơ Năng Lực
                  </Link>
                  <button
                    onClick={handleSupplierReg}
                    disabled={!isRegOpen}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isRegOpen ? 'bg-[#0052cc] hover:bg-[#003ea8] shadow-md' : 'bg-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Đăng Ký Nhà Cung Ứng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === 'partner' && (
            <div className="bg-white rounded-3xl border border-purple-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-black text-purple-700 uppercase tracking-widest">
                    VAI TRÒ ĐỐI TÁC HẠ TẦNG & HIỆP HỘI
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  {program.audienceDetails?.partner?.title || 'Dành cho KCN, Hiệp hội & Đơn vị đồng hành'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">1. Đối tượng phù hợp:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.partner?.whoIsItFor}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">2. Tiêu chí đồng hành:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    {program.audienceDetails?.partner?.eligibility}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">3. Quyền lợi nhận được:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Quảng bá hình ảnh KCN, thu hút dòng vốn đầu tư phụ trợ thứ cấp và đồng chủ trì các phiên B2B.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Liên hệ trực tiếp Ban Điều phối để bố trí bàn thông tin xúc tiến đầu tư.
                </div>
                <button
                  onClick={() => setShowSponsorModal(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Đăng Ký Đồng Hành / Bảo Trợ
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ======================================================
            SECTION 7 & 37: BUYER NEEDS (NHÓM NHU CẦU KẾT NỐI)
            PRIVACY ENFORCED: Zero private contacts/internal budgets
        ====================================================== */}
        <section id="nhom-nhu-cau-ket-noi" className="space-y-5">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-black font-heading text-lg sm:text-xl">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <span>Nhóm Nhu Cầu Kết Nối (Buyer Sourcing Demands)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Danh mục phụ trợ và dịch vụ nhà máy công bố công khai để tìm kiếm nhà cung cấp tại chương trình.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {publicBuyerNeeds.length} nhu cầu công khai
              </span>
              <button
                onClick={handleSendNeed}
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>+ Gửi nhu cầu</span>
              </button>
            </div>
          </div>

          {publicBuyerNeeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicBuyerNeeds.map((need, idx) => (
                <div
                  key={need.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 space-y-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        {need.publicCode}
                      </span>
                      <span className="text-slate-500 font-medium">
                        Hạn: <strong className="text-slate-800">{need.deadline}</strong>
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {need.title}
                    </h4>

                    <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {need.publicSummary}
                    </div>

                    <div className="space-y-1 pt-1 text-xs">
                      <div className="text-slate-500">
                        Đơn vị mua: <strong className="text-slate-800">{need.buyerSummary}</strong>
                      </div>
                      <div className="text-slate-500">
                        Địa bàn / KCN: <strong className="text-slate-800">{need.industrialPark || need.location}</strong>
                      </div>
                      <div className="text-slate-500">
                        Quy mô dự kiến: <strong className="text-slate-800 font-mono">{need.quantity}</strong>
                      </div>
                    </div>

                    {need.publicRequirements && need.publicRequirements.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Tiêu chuẩn chào hàng:</div>
                        <ul className="text-xs text-slate-600 space-y-0.5 pl-3 list-disc">
                          {need.publicRequirements.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 italic text-[11px]">
                      Bảo mật thông tin liên hệ theo quy chế
                    </span>
                    <button
                      onClick={handleSupplierReg}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Chào giá tại sự kiện</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200">
              Hiện danh mục nhu cầu đang được điều phối viên thẩm định và sẽ cập nhật trước ngày diễn ra.
            </div>
          )}
        </section>

        {/* ======================================================
            SECTION 9: HARD RULE — TRẢ PHÍ ≠ ĐƯỢC MEETING
        ====================================================== */}
        <section className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-black font-heading text-base sm:text-lg">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
            <span>NGUYÊN TẮC BẢO ĐẢM KẾT NỐI KHÁCH QUAN (B2B MATCHING RULE)</span>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong>Hard Rule của CHUOICUNGUNG.COM:</strong> Nhà cung ứng thanh toán phí tham gia{' '}
            <strong className="underline">KHÔNG tự động có cuộc gặp bảo đảm</strong> với Người mua.
            Mọi đề nghị cuộc gặp đều được xem xét dựa trên mức độ phù hợp giữa <strong>Nhu cầu Mua hàng (Buyer Requirement)</strong> và{' '}
            <strong>Năng lực Cung ứng (Supplier Capability)</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-amber-800">
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80">
              ✓ Không bán vị trí gặp Buyer bằng tiền
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80">
              ✓ Ưu tiên hồ sơ đạt chuẩn ISO & năng lực xưởng thật
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80">
              ✓ Điều phối viên thẩm định trước khi lên lịch 1:1
            </div>
          </div>
        </section>

        {/* ======================================================
            SECTION 10 & 11: PARTICIPATION MODES & FEE DISPLAY
        ====================================================== */}
        <section id="hinh-thuc-tham-gia" className="space-y-5">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                Hình Thức Tham Gia & Mức Phí Minh Bạch
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Lựa chọn gói đồng hành phù hợp với mục tiêu và nguồn lực của doanh nghiệp.
              </p>
            </div>

            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Chính sách phí công khai
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {program.participationOptions && program.participationOptions.map((opt, oIdx) => {
              const isFree = opt.feeType === 'FREE';
              const isFixed = opt.feeType === 'FIXED';
              const isQuote = opt.feeType === 'QUOTE_REQUIRED';

              return (
                <div
                  key={opt.id || oIdx}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-lg transition-all ${
                    isFree ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-200/90 hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        opt.role === 'BUYER' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {opt.role === 'BUYER' ? 'Nhà máy / Buyer' : opt.role === 'SUPPLIER' ? 'Nhà cung ứng' : 'Đối tác'}
                      </span>

                      {/* Fee Badge (Section 11) */}
                      <span className={`px-3 py-1 rounded-full text-xs font-black font-mono ${
                        isFree ? 'bg-emerald-100 text-emerald-800' : isFixed ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {isFree ? 'MIỄN PHÍ' : isFixed ? `${opt.amount?.toLocaleString('vi-VN')} ${opt.currency || 'VND'}` : 'NHẬN BÁO GIÁ'}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black font-heading text-slate-900 leading-snug">
                      {opt.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {opt.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="font-bold text-slate-800">Quyền lợi bàn giao (Deliverables):</div>
                      <ul className="space-y-1.5 text-slate-600 pl-4 list-disc">
                        <li>Bố trí vị trí làm việc giao thương theo tiêu chuẩn</li>
                        <li>Đăng tải thông tin trên Kỷ yếu giao thương</li>
                        <li>Tham gia các phiên trình bày năng lực & Networking</li>
                        <li>Hỗ trợ kết nối follow-up sau sự kiện</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (opt.role === 'BUYER') handleBuyerReg();
                        else handleSupplierReg();
                      }}
                      disabled={!isRegOpen}
                      className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        !isRegOpen 
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : isFree 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-[#0052cc] hover:bg-[#003ea8] text-white shadow-sm'
                      }`}
                    >
                      <span>{isRegOpen ? 'Chọn Hình Thức Này' : 'Chưa Mở Đăng Ký'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 12: Remote Presence Option */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>HIỆN DIỆN TỪ XA / ỦY THÁC KẾT NỐI (REMOTE PRESENCE)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                Không Thể Có Mặt Trực Tiếp?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Doanh nghiệp ở xa có thể ủy thác Điều phối viên CCU đại diện trưng bày mẫu phôi, phát catalogue in ấn, chiếu video năng lực xưởng và thu thập danh thiếp phản hồi từ các Trưởng phòng Mua hàng FDI.
              </p>
            </div>

            <button
              onClick={handleRemotePresence}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>Đăng Ký Hiện Diện Từ Xa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ======================================================
            SECTION 15: AGENDA (LỊCH TRÌNH CHƯƠNG TRÌNH)
        ====================================================== */}
        <section id="lich-trinh-chuong-trinh" className="space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                Lịch Trình Chương Trình (Agenda)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Lịch trình chi tiết các phiên làm việc, kết nối 1:1 và thẩm định hồ sơ kỹ thuật.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {program.date}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 space-y-4">
            {program.agenda && program.agenda.map((ag, idx) => (
              <div
                key={ag.id || idx}
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-all"
              >
                <div className="sm:w-36 shrink-0">
                  <span className="px-3 py-1 rounded-lg bg-blue-100/70 text-[#0047a5] font-mono font-black text-xs">
                    {ag.timeRange || `${ag.startAt} - ${ag.endAt}`}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{ag.room}</div>
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-900 text-sm sm:text-base font-heading">
                      {ag.title}
                    </h4>
                    {ag.type === 'B2B_MATCHING' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        1:1 Matchmaking
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ag.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================
            SECTION 16, 17, 18: CUỘC GẶP 1:1 (MEETINGS)
        ====================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                QUY TRÌNH BẢO ĐẢM KẾT NỐI
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                Cuộc Gặp Giao Thương 1:1 & Khớp Lệnh Nhu Cầu
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {program.meetingWorkflow?.policyDisclaimer}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <strong className="block text-slate-900 font-bold">Nộp Hồ Sơ Kỹ Thuật</strong>
              <p className="text-slate-600 text-xs">
                Nhà cung ứng đăng ký kèm hồ sơ năng lực, chứng chỉ ISO và danh mục phụ trợ phù hợp nhu cầu công bố.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <strong className="block text-slate-900 font-bold">Buyer Thẩm Định</strong>
              <p className="text-slate-600 text-xs">
                Trưởng phòng Purchasing xem xét hồ sơ và phê duyệt đề nghị gặp gỡ trực tiếp tại sự kiện.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <strong className="block text-slate-900 font-bold">Sắp Xếp Bàn Riêng</strong>
              <p className="text-slate-600 text-xs">
                Điều phối viên CCU bố trí khung giờ (25 phút/phiên) và bàn làm việc 1:1 riêng tư.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <strong className="block text-slate-900 font-bold">Gặp & Ký Biên Bản</strong>
              <p className="text-slate-600 text-xs">
                Hai bên trao đổi kỹ thuật, xem xét mẫu đối chứng và ký Biên bản ghi nhớ (MOU) kết nối.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 italic">
            Lưu ý bảo mật: Lịch hẹn cá nhân chỉ hiển thị trong tài khoản của đại biểu sau khi được Ban điều phối xác nhận. Không công bố danh sách phòng họp hay số điện thoại riêng của Buyer ra bên ngoài.
          </div>
        </section>

        {/* ======================================================
            SECTION 19: SUPPLIER SHOWCASE (NHÀ CUNG ỨNG TRƯNG BÀY)
        ====================================================== */}
        {showcaseSuppliers.length > 0 && (
          <section id="nha-cung-ung-trung-bay" className="space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-900 font-black font-heading text-lg sm:text-xl">
                  <Store className="w-5 h-5 text-blue-600" />
                  <span>Sản Phẩm & Năng Lực Nhà Cung Ứng Trưng Bày</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Các doanh nghiệp sản xuất phụ trợ đã qua kiểm duyệt KYC tham gia trưng bày tại chương trình.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                {showcaseSuppliers.length} nhà cung cấp
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcaseSuppliers.map((sup, idx) => (
                <div
                  key={sup.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {sup.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>KYC Verified</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Sản phẩm trưng bày:</strong> {sup.productsServices?.join(', ')}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {sup.capabilities?.map((c, cIdx) => (
                        <span key={cIdx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Địa bàn: {sup.province}</span>
                    <span className="text-blue-600 font-bold hover:underline cursor-pointer">
                      Xem gian hàng
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================
            SECTION 20: CATALOGUE (KỶ YẾU GIAO THƯƠNG)
        ====================================================== */}
        {program.catalogue && (
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0052cc] shrink-0 shadow-2xs">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  KỶ YẾU GIAO THƯƠNG CHÍNH THỨC
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                  {program.catalogue.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Tổng hợp {program.catalogue.totalSuppliers} nhà cung ứng phụ trợ và {program.catalogue.totalBuyerNeeds} danh mục mua hàng đã kiểm duyệt.
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Kỷ yếu số ${program.catalogue.id} sẽ được gửi kèm qua email khi đăng ký thành công hoặc phát trực tiếp tại bàn Check-in.`)}
              className="px-5 py-2.5 rounded-xl border border-blue-300 text-[#0052cc] hover:bg-blue-50 font-bold text-xs sm:text-sm transition shrink-0 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Nhận Kỷ Yếu Sự Kiện</span>
            </button>
          </section>
        )}

        {/* ======================================================
            SECTION 21: BẠN NÊN CHUẨN BỊ GÌ? (ROLE CHECKLISTS)
        ====================================================== */}
        <section id="ban-nen-chuan-bi-gi" className="space-y-5">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                Bạn Nên Chuẩn Bị Gì Trước Sự Kiện?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Checklist chuyên nghiệp giúp các doanh nghiệp tối ưu hóa hiệu quả kết nối và khớp lệnh.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActivePrepTab('buyer')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activePrepTab === 'buyer' 
                    ? 'bg-white text-emerald-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nhà Máy / Buyer
              </button>
              <button
                onClick={() => setActivePrepTab('supplier')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activePrepTab === 'supplier' 
                    ? 'bg-white text-blue-700 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nhà Cung Ứng
              </button>
            </div>
          </div>

          {activePrepTab === 'buyer' ? (
            <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">1. Danh mục phụ trợ cần tìm nguồn:</strong>
                <p className="text-slate-600 text-xs">
                  Chuẩn bị mã linh kiện, thông số vật liệu, dung sai bản vẽ và sản lượng dự kiến theo tháng/quý.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">2. Tiêu chuẩn nhà cung cấp & chứng chỉ:</strong>
                <p className="text-slate-600 text-xs">
                  Yêu cầu bắt buộc về chứng chỉ chất lượng (ISO 9001, IATF 16949, ESD, RoHS, REACH...).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">3. Mẫu sản phẩm đối chứng (nếu có):</strong>
                <p className="text-slate-600 text-xs">
                  Mang theo mẫu phôi hoặc sản phẩm hoàn thiện để nhà cung ứng đánh giá trực tiếp độ khó gia công.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">4. Đại biểu đại diện có quyền quyết định:</strong>
                <p className="text-slate-600 text-xs">
                  Cử đại diện Trưởng phòng Mua hàng hoặc Kỹ sư đánh giá nhà cung cấp tham dự trực tiếp.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">1. Hồ sơ năng lực (Company Profile):</strong>
                <p className="text-slate-600 text-xs">
                  In sẵn tối thiểu 10 bộ hồ sơ năng lực tóm tắt danh sách máy móc, diện tích xưởng và khách hàng tiêu biểu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">2. Mẫu sản phẩm thực tế (Physical Samples):</strong>
                <p className="text-slate-600 text-xs">
                  Đem theo mẫu phôi gia công thực tế, chi tiết hoàn thiện và bảng dữ liệu kỹ thuật đối chứng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">3. Danh thiếp & Mã QR liên hệ nhanh:</strong>
                <p className="text-slate-600 text-xs">
                  Chuẩn bị đầy đủ danh thiếp có số di động trực tiếp của Giám đốc kinh doanh hoặc Quản lý dự án.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                <strong className="text-slate-900 block font-bold">4. Khung giá tham chiếu & Điều khoản thanh toán:</strong>
                <p className="text-slate-600 text-xs">
                  Nắm rõ đơn giá gia công ước tính, thời gian lead-time và khả năng giao hàng nội bộ KCN.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ======================================================
            SECTION 13 & 14: SPONSORS (ĐỒNG HÀNH CÙNG CHƯƠNG TRÌNH)
            RULE: SPONSOR ≠ MATCHING
        ====================================================== */}
        {program.sponsors && program.sponsors.length > 0 && (
          <section id="dong-hanh-cung-chuong-trinh" className="space-y-5">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                  Đồng Hành Cùng Chương Trình
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Các đối tác chiến lược và doanh nghiệp tài trợ phát triển mạng lưới chuỗi cung ứng bền vững.
                </p>
              </div>

              <button
                onClick={() => setShowSponsorModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
              >
                Tôi Muốn Tài Trợ Chương Trình
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {program.sponsors.map((sp, idx) => (
                <div
                  key={sp.organizationId || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 flex items-center gap-4 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shrink-0">
                    <img src={sp.logo} alt={sp.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider block truncate">
                      {sp.tierName || 'ĐỐI TÁC CHƯƠNG TRÌNH'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {sp.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">Đã xác nhận & kiểm duyệt</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rule 14 Sponsor Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
              <strong>Cam kết độc lập:</strong> Nhà tài trợ không được tự động xếp hạng ưu tiên trong kết quả tìm kiếm, không được cấp danh bạ Buyer bảo mật và không can thiệp vào quy trình matching khách quan.
            </div>
          </section>
        )}

        {/* ======================================================
            SECTION 24: PROGRAM POLICIES (CHÍNH SÁCH CHƯƠNG TRÌNH)
        ====================================================== */}
        <section id="chinh-sach-quy-dinh" className="space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              Chính Sách & Quy Định Chương Trình
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Quy chế tham gia, điều khoản bảo lưu, hoàn phí và cam kết bảo mật thông tin.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <strong className="text-slate-900 block font-bold">1. Thay đổi thông tin & đại biểu:</strong>
                <p className="text-slate-600 text-xs leading-relaxed">{program.policies?.changeInfo}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <strong className="text-slate-900 block font-bold">2. Chính sách hủy & bảo lưu:</strong>
                <p className="text-slate-600 text-xs leading-relaxed">{program.policies?.cancellation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <strong className="text-slate-900 block font-bold">3. Chính sách hoãn & bất khả kháng:</strong>
                <p className="text-slate-600 text-xs leading-relaxed">{program.policies?.postponement}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <strong className="text-slate-900 block font-bold">4. Chính sách hoàn phí tham dự:</strong>
                <p className="text-slate-600 text-xs leading-relaxed">{program.policies?.refund}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <strong className="text-slate-900 block font-bold">5. Đơn vị thụ hưởng thanh toán:</strong>
                <p className="text-slate-600 text-xs leading-relaxed font-mono">{program.policies?.paymentEntity}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <strong className="text-slate-900 block font-bold">6. Bảo mật thông tin & Bản quyền:</strong>
                <p className="text-slate-600 text-xs leading-relaxed">{program.policies?.dataPrivacy}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            SECTION 25, 26, 27: SAU CHƯƠNG TRÌNH & THƯ VIỆN ẢNH
        ====================================================== */}
        {(isCompleted || program.recap) && (
          <section id="ket-qua-sau-chuong-trinh" className="space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-900 font-black font-heading text-lg sm:text-xl">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span>Kết Quả Đã Xác Thực & Thư Viện Ảnh (Official Recap)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Số liệu giao dịch chính thức và bộ ảnh tư liệu hoạt động đã được kiểm duyệt.
                </p>
              </div>

              <button
                onClick={() => setShowRecapModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Xem Toàn Bộ Báo Cáo
              </button>
            </div>

            {/* Confirmed Aggregate Result Cards (Section 26) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs text-center space-y-1">
                <div className="text-xl sm:text-2xl font-black text-indigo-950 font-mono">
                  {program.recap?.factoriesJoined || program.factoriesCount || 68}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Nhà máy tham gia</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs text-center space-y-1">
                <div className="text-xl sm:text-2xl font-black text-indigo-950 font-mono">
                  {program.recap?.suppliersJoined || program.suppliersCount || 160}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Nhà cung ứng kết nối</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs text-center space-y-1">
                <div className="text-xl sm:text-2xl font-black text-indigo-950 font-mono">
                  {program.recap?.mouSigned || '28'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Biên bản MOU đã ký</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs text-center space-y-1">
                <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                  {program.recap?.estimatedDealValue || '45.8 tỷ'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Ước tính giá trị khớp lệnh</div>
              </div>
            </div>

            {/* Photo Gallery Preview (Section 27) */}
            {program.gallery && program.gallery.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Camera className="w-4 h-4 text-indigo-600" />
                    <span>Hình ảnh tư liệu hoạt động đã kiểm duyệt bản quyền:</span>
                  </div>
                  <Link
                    to={`/chuong-trinh/${program.slug || program.id}/thu-vien`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>Xem toàn bộ thư viện & tài liệu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {program.gallery.map((img, gIdx) => (
                    <div
                      key={img.id || gIdx}
                      onClick={() => setActiveGalleryPhoto(img)}
                      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                          Bản quyền CCU
                        </div>
                      </div>
                      <div className="p-3 text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        {img.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ======================================================
            SECTION 30: ĐƠN VỊ TỔ CHỨC & ĐẦU MỐI HỖ TRỢ
        ====================================================== */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                CHỦ TRÌ & ĐIỀU PHỐI CHƯƠNG TRÌNH
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                {program.organizer}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-slate-500 text-xs">Điều phối viên phụ trách:</div>
              <div className="font-bold text-slate-900 text-sm">
                {program.supportContact?.coordinatorName || program.ownerName || 'Lê Minh Quân'}
              </div>
              <div className="text-slate-600 text-xs">{program.supportContact?.role || 'Điều phối viên Trưởng Ban B2B'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-slate-500 text-xs">Hotline & Zalo hỗ trợ:</div>
              <div className="font-bold text-blue-700 font-mono text-sm">
                {program.supportContact?.phone || '0903 888 777'}
              </div>
              <div className="text-slate-600 text-xs">Hỗ trợ 24/7 trước và trong sự kiện</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-slate-500 text-xs">Văn phòng tiếp nhận:</div>
              <div className="font-bold text-slate-900 text-sm">
                {program.supportContact?.office || `Văn phòng Ban Điều phối CCU ${program.zone || 'Miền Nam'}`}
              </div>
              <div className="text-slate-600 text-xs">Email: {program.supportContact?.email || 'b2b-events@chuoicungung.com'}</div>
            </div>
          </div>
        </section>

      </div>

      {/* ========================================================
          4. STICKY MOBILE BOTTOM CTA BAR (SECTION 40)
      ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 sm:hidden shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {program.shortName || program.title}
            </div>
            <div className="text-[11px] text-slate-500">
              {calculateFeeDisplay(program, 'ALL')}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {isRegOpen ? (
              <>
                <button
                  onClick={handleBuyerReg}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Mua Hàng
                </button>
                <button
                  onClick={handleSupplierReg}
                  className="px-3 py-2 rounded-xl bg-[#0052cc] text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Cung Ứng
                </button>
              </>
            ) : isUpcomingOrDiscovery ? (
              <button
                onClick={() => setShowInterestModal(true)}
                className="px-4 py-2 rounded-xl bg-[#0052cc] text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Đăng Ký Quan Tâm
              </button>
            ) : isCompleted ? (
              <button
                onClick={() => setShowRecapModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Xem Kết Quả
              </button>
            ) : (
              <button
                onClick={() => setShowInterestModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Danh Sách Chờ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          5. FLOATING SUPPI GUIDE BUTTON (SECTION 28)
      ======================================================== */}
      <button
        type="button"
        onClick={() => setShowSuppiModal(true)}
        className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold p-3 sm:px-4 sm:py-3 rounded-full sm:rounded-2xl shadow-xl flex items-center gap-2 transition cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
        <span className="hidden sm:inline text-xs">Hỏi SUPPI Về Chương Trình Này</span>
      </button>

      {/* ========================================================
          6. MODALS
      ======================================================== */}
      {/* Interest Modal */}
      {showInterestModal && (
        <ProgramInterestModal
          program={program}
          onClose={() => setShowInterestModal(false)}
        />
      )}

      {/* Suppi AI Guide Modal */}
      {showSuppiModal && (
        <ProgramSuppiGuideModal
          programs={[program]}
          onClose={() => setShowSuppiModal(false)}
          onSelectProgram={() => setShowSuppiModal(false)}
        />
      )}

      {/* Completed Recap Modal */}
      {showRecapModal && (
        <ProgramCompletedRecapModal
          program={program}
          onClose={() => setShowRecapModal(false)}
        />
      )}

      {/* Sponsor Consultation Modal (Section 13) */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => { setShowSponsorModal(false); setSponsorSubmitted(false); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!sponsorSubmitted ? (
              <>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                    ĐỒNG HÀNH & TÀI TRỢ
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-heading">
                    Đăng Ký Tài Trợ Cho {program.shortName || program.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Nhận hồ sơ mời tài trợ độc quyền và quyền lợi hiện diện thương hiệu trước cộng đồng 500+ nhà máy FDI.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSponsorSubmitted(true);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tên doanh nghiệp / Đơn vị:</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Tập Đoàn Công Nghiệp ABC"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Người đại diện:</label>
                      <input
                        type="text"
                        required
                        placeholder="Họ và tên"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Số điện thoại:</label>
                      <input
                        type="tel"
                        required
                        placeholder="09xx xxx xxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Hạng mức tài trợ quan tâm:</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500">
                      <option>Tài trợ Kim Cương (Đồng chủ trì & Phát biểu VIP)</option>
                      <option>Tài trợ Vàng (Gian làm việc lớn & Kỷ yếu)</option>
                      <option>Tài trợ Bạc (Kỷ yếu & Hiện diện thương hiệu)</option>
                      <option>Bảo trợ truyền thông & Đồng hành hạ tầng</option>
                    </select>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl text-purple-900 text-[11px] leading-relaxed">
                    Điều phối viên tài trợ sẽ liên hệ trong vòng 4 giờ làm việc để gửi bộ Proposal chi tiết.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                  >
                    Gửi Đăng Ký Tài Trợ Nhanh
                  </button>

                  <div className="text-center pt-1">
                    <Link
                      to={`/tai-tro?programId=${program.id}`}
                      className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold underline"
                    >
                      Xem trang chuyên đề tài trợ & biểu mẫu đầy đủ →
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black text-slate-900 font-heading">
                  Đã Tiếp Nhận Thông Tin Tài Trợ
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Cảm ơn Quý doanh nghiệp đã quan tâm đồng hành. Ban Điều phối sự kiện sẽ gửi Hồ sơ mời tài trợ và liên hệ trao đổi chi tiết.
                </p>
                <button
                  onClick={() => { setShowSponsorModal(false); setSponsorSubmitted(false); }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Lightbox Modal */}
      {activeGalleryPhoto && (
        <div 
          onClick={() => setActiveGalleryPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setActiveGalleryPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[16/10] bg-black flex items-center justify-center">
              <img
                src={activeGalleryPhoto.url}
                alt={activeGalleryPhoto.caption}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 text-white text-xs sm:text-sm border-t border-slate-800">
              {activeGalleryPhoto.caption}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function LockIcon(props) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
