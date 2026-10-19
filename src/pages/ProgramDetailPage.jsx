import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Building2, Factory, ArrowRight,
  ChevronRight, Sparkles, Filter, Search, ShoppingCart, Truck,
  Store, Handshake, Info, Award, ArrowLeft, ShieldCheck,
  CheckCircle2, Clock, Globe, DollarSign, AlertCircle, X,
  Send, Camera, FileText, Check, RotateCcw, Tag, ExternalLink,
  ShieldAlert, PhoneCall, Mail, MessageSquare, Download, Layers,
  Compass, HelpCircle, UserCheck, ChevronDown, ChevronUp, Share2,
  BookOpen
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
import ProgramRegistrationSection from '../components/programs/ProgramRegistrationSection';
import ProgramMatchingSection from '../components/programs/ProgramMatchingSection';
import ProgramPostMatchingSection from '../components/programs/ProgramPostMatchingSection';

export default function ProgramDetailPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Target meeting entity requested from Matching section
  const [selectedMeetingTarget, setSelectedMeetingTarget] = useState(null);
  const [registrationRole, setRegistrationRole] = useState('buyer');
  const [registrationIntent, setRegistrationIntent] = useState(0);
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
    setRegistrationRole('buyer');
    setRegistrationIntent(value => value + 1);
    setSelectedMeetingTarget(null);
    trackProgramAnalytics('buyer_registration_click', { programId: program.id });
    const el = document.getElementById('dang-ky-tai-tro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/chuong-trinh/${program.slug || program.id}/dang-ky?role=buyer`);
    }
  };

  const handleSupplierReg = () => {
    setRegistrationRole('supplier');
    setRegistrationIntent(value => value + 1);
    setSelectedMeetingTarget(null);
    trackProgramAnalytics('supplier_registration_click', { programId: program.id });
    const el = document.getElementById('dang-ky-tai-tro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/chuong-trinh/${program.slug || program.id}/dang-ky?role=supplier`);
    }
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
    <div className="pw-page min-h-screen bg-[#f7f8f4] text-slate-800 pb-28 sm:pb-20 font-sans">
      
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
          <div className="pw-event-title">
            <div>
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
            {program.image && <figure className="pw-event-cover"><img src={program.image} alt={`Giới thiệu chương trình ${program.shortName || program.title}`} /><figcaption>{program.typeName} · {program.provinceName || program.zone}</figcaption></figure>}
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

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      const el = document.getElementById('matching-giao-thuong');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#006039]" />
                    <span>Xem nhu cầu & đối tác</span>
                  </button>
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
        {/* Navigation jump bar between 3 key blocks */}
        <nav className="pw-nav" aria-label="Hành trình tham gia chương trình">
            <a
              href="#dang-ky-tai-tro"
            >
              <span>01</span><div>Đăng ký tham gia<small>Vai trò · Ngân sách · Lịch giới thiệu</small></div>
            </a>
            <a
              href="#matching-giao-thuong"
            >
              <span>02</span><div>Ghép nối 1:1<small>Sản phẩm · Nhu cầu · Đối tác muốn gặp</small></div>
            </a>
            <a
              href="#sau-matching"
            >
              <span>03</span><div>Sau kết nối<small>Cặp doanh nghiệp · Hình ảnh · Bước tiếp theo</small></div>
            </a>
        </nav>

        {/* ========================================================
            BLOCK 1: ĐĂNG KÝ, GÓI TÀI TRỢ & LỊCH TRÌNH GIỜ GIẤC
        ======================================================== */}
        <ProgramRegistrationSection
          key={program.id}
          program={program}
          selectedRole={registrationRole}
          registrationIntent={registrationIntent}
          targetMeetingEntity={selectedMeetingTarget}
          onBuyerRegister={handleBuyerReg}
          onSupplierRegister={handleSupplierReg}
        />

        {/* ========================================================
            BLOCK 2: MATCHING & GIAO THƯƠNG (NHÀ MÁY, NCC, DANH BẠ XTTM)
        ======================================================== */}
        <ProgramMatchingSection
          program={program}
          publicBuyerNeeds={publicBuyerNeeds}
          showcaseSuppliers={showcaseSuppliers}
          onRequestMeetingWith={(target) => {
            setSelectedMeetingTarget(target);
            const el = document.getElementById("form-dang-ky-truc-tiep");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        {/* ========================================================
            BLOCK 3: SAU MATCHING (HÌNH ẢNH TƯ LIỆU, CẶP DOANH NGHIỆP MATCHING)
        ======================================================== */}
        <ProgramPostMatchingSection
          program={program}
          onOpenRecapModal={() => setShowRecapModal(true)}
        />

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
