import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Building2, Factory, ArrowRight,
  ChevronRight, Sparkles, Filter, Search, ShoppingCart, Truck,
  Store, Handshake, Info, Award, ArrowLeft, ShieldCheck,
  CheckCircle2, Clock, Globe, DollarSign, AlertCircle, X,
  Send, Camera, FileText, Check, RotateCcw, Tag, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  PROGRAM_TYPES,
  PROGRAM_STATUSES,
  PROGRAM_FORMATS,
  PROGRAM_ROLES,
  PROGRAM_ZONES,
  PROGRAM_INDUSTRIES,
  PROGRAMS_DATA
} from '../data/programsData';

// Page 20 Subcomponents
import ProgramCard from '../components/programs/ProgramCard';
import ProgramInterestModal from '../components/programs/ProgramInterestModal';
import ProgramSuppiGuideModal from '../components/programs/ProgramSuppiGuideModal';
import ProgramCompletedRecapModal from '../components/programs/ProgramCompletedRecapModal';

export default function SupplyChainExpoPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { eventId } = useParams();

  // Active Program Type Tab (5 types + 'all')
  const [activeTypeTab, setActiveTypeTab] = useState('all');

  // Search & Filter States
  const [searchKw, setSearchKw] = useState('');
  const [filterZone, setFilterZone] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('Tất cả ngành hàng');
  const [filterTime, setFilterTime] = useState('all'); // 'all', 'upcoming', 'past'
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'buyer', 'supplier', 'partner'
  const [filterFormat, setFilterFormat] = useState('all'); // 'all', 'truc-tiep', 'truc-tuyen', 'ket-hop'
  const [filterStatus, setFilterStatus] = useState('all');

  // Interest/Waitlist Modal State
  const [interestModalEvent, setInterestModalEvent] = useState(null);
  const [interestFormData, setInterestFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: 'supplier',
    needs: '',
    hasConsent: true
  });
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  // Bottom Custom Subscription Form State (ccu_lead_consents)
  const [subFormData, setSubFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    zone: 'Miền Nam',
    industry: 'Cơ khí chính xác & Bán dẫn',
    role: 'supplier',
    consent: true
  });
  const [subSubmitted, setSubSubmitted] = useState(false);

  // Selected event for detail view (matching by ID or alias)
  const selectedEvent = useMemo(() => {
    if (!eventId) return null;
    return PROGRAMS_DATA.find(e => 
      e.id === eventId || 
      (e.aliasIds && e.aliasIds.includes(eventId))
    ) || null;
  }, [eventId]);

  // Page 20 State Modals
  const [selectedInterestProgram, setSelectedInterestProgram] = useState(null);
  const [showSuppiModal, setShowSuppiModal] = useState(false);
  const [recapModalProgram, setRecapModalProgram] = useState(null);

  // SEO Optimization (Section 24)
  useEffect(() => {
    if (selectedEvent) {
      document.title = `${selectedEvent.title || selectedEvent.name} | CHUOICUNGUNG.COM`;
    } else {
      document.title = 'Chương Trình Kết Nối Doanh Nghiệp | CHUOICUNGUNG.COM';
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Khám phá các chương trình kết nối nhà máy, người mua và nhà cung ứng theo nhu cầu, ngành, địa bàn và hình thức tham gia.');
    }
  }, [selectedEvent]);

  // Filtered Programs Logic
  const filteredPrograms = useMemo(() => {
    return PROGRAMS_DATA.filter(p => {
      // Type Tab
      if (activeTypeTab !== 'all' && p.type !== activeTypeTab) {
        return false;
      }

      // Zone Filter
      if (filterZone !== 'all' && p.zone !== filterZone) {
        return false;
      }

      // Industry Filter
      if (filterIndustry !== 'Tất cả ngành hàng' && p.industry !== filterIndustry) {
        return false;
      }

      // Role Filter (Transparency rule: "Được tài trợ" does not break role filter)
      if (filterRole !== 'all' && p.targetRoles && !p.targetRoles.includes(filterRole)) {
        return false;
      }

      // Format Filter
      if (filterFormat !== 'all' && p.format !== filterFormat) {
        return false;
      }

      // Status Filter
      if (filterStatus !== 'all' && p.status !== filterStatus) {
        return false;
      }

      // Time Filter
      if (filterTime === 'past' && p.status !== 'da-dien-ra') return false;
      if (filterTime === 'upcoming' && (p.status === 'da-dien-ra' || p.status === 'huy')) return false;

      // Keyword Search (Name, KCN, location, needs, highlight)
      if (searchKw.trim()) {
        const kw = searchKw.toLowerCase().trim();
        const inName = (p.name || p.title || '').toLowerCase().includes(kw);
        const inLoc = (p.location || '').toLowerCase().includes(kw);
        const inKcn = (p.kcn || '').toLowerCase().includes(kw);
        const inHighlight = (p.highlight || '').toLowerCase().includes(kw);
        const inNeeds = (p.needGroup || []).some(n => n.toLowerCase().includes(kw));
        if (!inName && !inLoc && !inKcn && !inHighlight && !inNeeds) {
          return false;
        }
      }

      return true;
    });
  }, [activeTypeTab, filterZone, filterIndustry, filterRole, filterFormat, filterStatus, filterTime, searchKw]);

  // Reset all filters
  const resetFilters = () => {
    setActiveTypeTab('all');
    setSearchKw('');
    setFilterZone('all');
    setFilterIndustry('Tất cả ngành hàng');
    setFilterTime('all');
    setFilterRole('all');
    setFilterFormat('all');
    setFilterStatus('all');
  };

  const hasActiveFilters = activeTypeTab !== 'all' || searchKw || filterZone !== 'all' || 
    filterIndustry !== 'Tất cả ngành hàng' || filterTime !== 'all' || 
    filterRole !== 'all' || filterFormat !== 'all' || filterStatus !== 'all';

  // Navigate to Registration Page
  const goToRegistration = (targetId) => {
    navigate('/ngay-hoi-chuoi-cung-ung/dang-ky', { state: { eventId: targetId } });
  };

  // Scroll to Programs Section
  const scrollToPrograms = () => {
    const el = document.getElementById('danh-sach-chuong-trinh');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open Interest / Waitlist Modal
  const openInterestModal = (program, e) => {
    if (e) e.stopPropagation();
    setInterestModalEvent(program);
    setInterestSubmitted(false);
  };

  // Handle Interest Modal Submit
  const handleInterestSubmit = (e) => {
    e.preventDefault();
    if (!interestFormData.hasConsent) {
      alert('Vui lòng đồng ý với điều khoản nhận thông tin từ ban tổ chức.');
      return;
    }

    try {
      // Save consent to ccu_lead_consents in localStorage
      const existing = JSON.parse(localStorage.getItem('ccu_lead_consents') || '[]');
      const newLead = {
        id: 'lead_' + Date.now(),
        type: 'program_interest',
        programId: interestModalEvent?.id,
        programTitle: interestModalEvent?.title || interestModalEvent?.name,
        name: interestFormData.name,
        company: interestFormData.company,
        email: interestFormData.email,
        phone: interestFormData.phone,
        role: interestFormData.role,
        needs: interestFormData.needs,
        consentAccepted: true,
        disclaimerAgreed: 'Da xac nhan khong dong nghia giu cho chinh thuc',
        createdAt: new Date().toISOString()
      };
      existing.push(newLead);
      localStorage.setItem('ccu_lead_consents', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    setInterestSubmitted(true);
    setTimeout(() => {
      setInterestModalEvent(null);
      setInterestSubmitted(false);
    }, 2500);
  };

  // Handle Bottom Subscription Submit
  const handleBottomSubSubmit = (e) => {
    e.preventDefault();
    if (!subFormData.consent) {
      alert('Vui lòng tích đồng ý nhận thông tin để tiếp tục.');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('ccu_lead_consents') || '[]');
      const newConsent = {
        id: 'consent_' + Date.now(),
        type: 'general_program_notification',
        name: subFormData.name,
        company: subFormData.company,
        email: subFormData.email,
        phone: subFormData.phone,
        zone: subFormData.zone,
        industry: subFormData.industry,
        role: subFormData.role,
        consentAccepted: true,
        createdAt: new Date().toISOString()
      };
      existing.push(newConsent);
      localStorage.setItem('ccu_lead_consents', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    setSubSubmitted(true);
  };

  // Get status color helper
  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 'dang-nhan-dang-ky':
        return {
          bg: 'bg-emerald-500/90 text-white',
          border: 'border-emerald-600',
          dot: 'bg-emerald-300',
          text: 'Đang nhận đăng ký'
        };
      case 'sap-mo-dang-ky':
        return {
          bg: 'bg-blue-600/90 text-white',
          border: 'border-blue-700',
          dot: 'bg-blue-200',
          text: 'Sắp mở đăng ký'
        };
      case 'dang-khao-sat':
        return {
          bg: 'bg-amber-500/95 text-white',
          border: 'border-amber-600',
          dot: 'bg-amber-200',
          text: 'Đang khảo sát nhu cầu'
        };
      case 'da-dong-dang-ky':
        return {
          bg: 'bg-slate-700/90 text-white',
          border: 'border-slate-800',
          dot: 'bg-slate-400',
          text: 'Đã đóng đăng ký'
        };
      case 'da-dien-ra':
        return {
          bg: 'bg-indigo-600/90 text-white',
          border: 'border-indigo-700',
          dot: 'bg-indigo-200',
          text: 'Đã diễn ra'
        };
      case 'hoan':
        return {
          bg: 'bg-orange-500/95 text-white',
          border: 'border-orange-600',
          dot: 'bg-orange-200',
          text: 'Hoãn'
        };
      case 'huy':
        return {
          bg: 'bg-rose-600/90 text-white',
          border: 'border-rose-700',
          dot: 'bg-rose-200',
          text: 'Hủy'
        };
      default:
        return {
          bg: 'bg-slate-600 text-white',
          border: 'border-slate-700',
          dot: 'bg-slate-300',
          text: statusId
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 font-sans space-y-10 sm:space-y-12">
      
      {/* ========================================================
          1. HERO HEADER SECTION (Matching exact panoramic banner)
      ======================================================== */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-24 lg:pb-28 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        
        {/* Right Half B2B Supply Chain Expo Background with Smooth Gradient Fade */}
        <div className="absolute top-0 right-0 w-full lg:w-[68%] xl:w-[64%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/supply_chain_expo_hero.jpg" 
            alt="Chương trình kết nối doanh nghiệp B2B & Ngày hội Chuỗi Cung Ứng" 
            className="w-full h-full object-cover object-[62%_center] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 md:via-[#F4F8FA]/60 lg:via-[#F4F8FA]/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-2 relative z-10 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
                <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link 
                to="/chuong-trinh" 
                className={`hover:text-[#0052cc] transition ${selectedEvent ? 'text-slate-600' : 'text-[#0052cc] font-bold'}`}
              >
                Chương trình kết nối doanh nghiệp
              </Link>
              {selectedEvent && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[#0052cc] font-bold truncate max-w-[200px] sm:max-w-xs">
                    {selectedEvent.shortName || selectedEvent.title || selectedEvent.name}
                  </span>
                </>
              )}
            </nav>


            {/* Headline H1 (Requested: "Chương trình kết nối doanh nghiệp") */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                Chương trình kết nối doanh nghiệp
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.2]">
                Khớp lệnh Cung - Cầu tại các KCN trọng điểm
              </h2>
            </div>

            {/* Lead text (Requested by user) */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              Khám phá ngày hội chuỗi cung ứng, buổi gặp nhà cung ứng, gian hàng và hoạt động dành cho cộng đồng doanh nghiệp. Chọn chương trình phù hợp để đăng ký, chuẩn bị hồ sơ và trao đổi nhu cầu.
            </p>

            {/* Dual Action Buttons (Requested: Nút chính "Tìm chương trình", Nút phụ "Đề xuất tổ chức chương trình" -> /dich-vu/to-chuc-ket-noi) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={scrollToPrograms}
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Tìm chương trình</span>
              </button>

              <Link
                to="/dich-vu/to-chuc-ket-noi"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <Handshake className="w-3.5 h-3.5 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>Đề xuất tổ chức chương trình</span>
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================
          FLOATING STATS BAR
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-12 sm:-mt-14 lg:-mt-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="p-2 sm:p-0 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">LỊCH TRÌNH 2025–2026</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">7+ Kỳ Triển Lãm</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Tổ chức trực tiếp tại các KCN 3 miền</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">BÊN MUA THAM GIA</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">500+ Nhà Máy</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Tìm kiếm đối tác & công bố bài toán cung ứng</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">HỆ THỐNG DỮ LIỆU</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">24.000+ NCC</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">18 Pha năng lực & tiêu chuẩn công nghiệp</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">KẾT NỐI B2B</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">Khớp Lệnh 1:1</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Ghép nối phòng mua hàng trực tiếp tại sự kiện</p>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          DETAIL VIEW (IF VIEWING AN EVENT DIRECTLY VIA /:eventId)
      ======================================================== */}
      {selectedEvent ? (
        <div id="chi-tiet-chuong-trinh" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
          
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/chuong-trinh')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0052cc] hover:border-blue-300 font-bold text-xs sm:text-sm shadow-2xs transition group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Quay lại danh sách chương trình</span>
            </button>

            <span className="text-xs text-slate-500 font-medium">
              Chuyên mục: <strong>{selectedEvent.typeName}</strong>
            </span>
          </div>

          {/* DETAIL CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0047a5] text-xs font-bold font-mono">
                  {selectedEvent.date} — {selectedEvent.time}
                </span>

                {/* Status Badge */}
                {(() => {
                  const b = getStatusBadge(selectedEvent.status);
                  return (
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${b.bg}`}>
                      {selectedEvent.statusName || b.text}
                    </span>
                  );
                })()}

                {/* Format Badge */}
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                  {selectedEvent.formatName}
                </span>

                {/* Sponsored Badge */}
                {selectedEvent.isSponsored && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedEvent.sponsorName || 'Được tài trợ'}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-950 tracking-tight leading-tight pt-1">
                {selectedEvent.title || selectedEvent.name}
              </h1>

              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{selectedEvent.location}</span>
              </div>

              {selectedEvent.organizer && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đơn vị tổ chức: <strong>{selectedEvent.organizer}</strong></span>
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 leading-relaxed">
                <strong>Trọng tâm & Nhu cầu:</strong> {selectedEvent.highlight || selectedEvent.description}
              </div>

              {/* Pricing transparency block */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 font-bold text-[#0047a5]">
                  <DollarSign className="w-4 h-4 text-[#0052cc]" />
                  <span>Chính sách phí tham gia theo vai trò</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <strong className="text-slate-900 block mb-0.5">Phòng Purchasing / Nhà máy:</strong>
                    <span>{selectedEvent.pricingDetail?.buyer || 'Miễn phí tham dự sau khi xác thực hồ sơ.'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                    <strong className="text-slate-900 block mb-0.5">Nhà cung ứng (Supplier):</strong>
                    <span>{selectedEvent.pricingDetail?.supplier || 'Xem biểu phí và các gói đồng hành.'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* DANH MỤC CÁC NHÀ MÁY CẦN MUA TẠI SỰ KIỆN */}
            {selectedEvent.needToBuy && selectedEvent.needToBuy.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-black font-heading text-emerald-800 uppercase tracking-wide">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    <span>DANH MỤC CÁC NHÀ MÁY CẦN MUA TẠI SỰ KIỆN</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {selectedEvent.needToBuy.length} mặt hàng
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedEvent.needToBuy.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {item.item}
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-500">
                          Đơn vị mua: <strong className="text-slate-800 font-semibold">{item.buyer}</strong>
                        </div>
                      </div>

                      <span className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-bold text-xs sm:text-[13px] shrink-0 self-start sm:self-auto shadow-2xs font-mono">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SẢN PHẨM & DỊCH VỤ NHÀ CUNG ỨNG ĐÃ ĐĂNG KÝ TRƯNG BÀY */}
            {selectedEvent.needToSell && selectedEvent.needToSell.length > 0 && (
              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-black font-heading text-blue-800 uppercase tracking-wide">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5 text-[#0068FF]" />
                    <span>SẢN PHẨM & DỊCH VỤ NHÀ CUNG ỨNG ĐÃ ĐĂNG KÝ TRƯNG BÀY</span>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {selectedEvent.needToSell.length} sản phẩm
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedEvent.needToSell.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{item.item}</span>
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-500">
                          Đơn vị cung ứng: <strong className="text-slate-800 font-semibold">{item.supplier}</strong>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shrink-0 self-start sm:self-auto flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Đã xác thực KYC</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRANG ĐÃ DIỄN RA: KẾT QUẢ TỔNG HỢP & HÌNH ẢNH ĐÃ XÁC NHẬN */}
            {selectedEvent.status === 'da-dien-ra' && selectedEvent.recap && (
              <div className="pt-4 space-y-4 bg-indigo-50/50 p-5 sm:p-6 rounded-3xl border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-900 font-black font-heading text-base">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span>KẾT QUẢ TỔNG HỢP ĐÃ ĐƯỢC XÁC NHẬN (OFFICIAL RECAP)</span>
                </div>

                <p className="text-xs text-slate-600">
                  Sự kiện đã diễn ra thành công. Dưới đây là các số liệu giao thương chính thức và bộ ảnh tư liệu hoạt động đã được kiểm duyệt công bố.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-indigo-900 font-mono">{selectedEvent.recap.factoriesJoined}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Nhà máy tham gia</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-indigo-900 font-mono">{selectedEvent.recap.suppliersJoined}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Nhà cung ứng</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-indigo-900 font-mono">{selectedEvent.recap.mouSigned}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Biên bản MOU đã ký</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-indigo-100 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-emerald-600 font-mono">{selectedEvent.recap.estimatedDealValue}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Ước tính giá trị khớp lệnh</div>
                  </div>
                </div>

                {selectedEvent.recap.publishedPhotos && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Hình ảnh hoạt động được phép công bố:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedEvent.recap.publishedPhotos.map((photo, pIdx) => (
                        <div key={pIdx} className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 shadow-2xs">
                          <img src={photo} alt={`Tư liệu sự kiện ${pIdx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Jump to Registration Action */}
            <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                {selectedEvent.status === 'dang-nhan-dang-ky' && 'Đăng ký ngay để được bố trí bàn kết nối và tiếp cận danh sách mua sắm.'}
                {(selectedEvent.status === 'sap-mo-dang-ky' || selectedEvent.status === 'dang-khao-sat') && (
                  <span className="text-amber-800 font-medium">
                    ⚠️ Đăng ký quan tâm để nhận thông báo ưu tiên khi mở cổng. Lưu ý: Không đồng nghĩa với việc giữ chỗ.
                  </span>
                )}
                {selectedEvent.status === 'da-dong-dang-ky' && 'Chương trình đã đủ chỉ tiêu. Đăng ký vào danh sách chờ khi có suất bổ sung.'}
                {selectedEvent.status === 'da-dien-ra' && 'Sự kiện đã kết thúc. Bạn có thể đăng ký nhận tin về các kỳ tiếp theo.'}
                {selectedEvent.status === 'hoan' && 'Chương trình đang tạm hoãn. Đăng ký để nhận lịch cập nhật sớm nhất.'}
                {selectedEvent.status === 'huy' && 'Chương trình đã hủy hoặc chuyển đổi định dạng kết nối.'}
              </div>

              {selectedEvent.status === 'dang-nhan-dang-ky' && (
                <button
                  type="button"
                  onClick={() => goToRegistration(selectedEvent.id)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer font-heading tracking-wide"
                >
                  <span>Đăng Ký Tham Gia Sự Kiện</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {(selectedEvent.status === 'sap-mo-dang-ky' || selectedEvent.status === 'dang-khao-sat' || selectedEvent.status === 'da-dong-dang-ky' || selectedEvent.status === 'hoan') && (
                <button
                  type="button"
                  onClick={(e) => openInterestModal(selectedEvent, e)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0052cc] hover:bg-[#003ea8] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all text-center flex items-center justify-center gap-2 cursor-pointer font-heading tracking-wide"
                >
                  <span>{selectedEvent.status === 'da-dong-dang-ky' ? 'Tham gia danh sách chờ' : 'Đăng ký quan tâm'}</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* OTHER UPCOMING PROGRAMS SECTION */}
          <div className="pt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black font-heading text-slate-900">
                Các Chương Trình Kết Nối Khác
              </h3>
              <button
                onClick={() => navigate('/chuong-trinh')}
                className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả ({PROGRAMS_DATA.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROGRAMS_DATA.filter(e => e.id !== selectedEvent.id).slice(0, 3).map(ev => {
                const badge = getStatusBadge(ev.status);
                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      navigate(`/chuong-trinh/${ev.id}`);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img 
                        src={ev.image || '/images/supply_chain_expo_hero.jpg'} 
                        alt={ev.title || ev.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider bg-orange-600 text-white shadow-md">
                        {ev.date}
                      </span>
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${badge.bg}`}>
                        {ev.statusName || badge.text}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <h4 className="font-black font-heading text-sm sm:text-base text-slate-900 group-hover:text-[#0052cc] line-clamp-2 leading-snug">
                        {ev.title || ev.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0052cc]">
                        <span>{ev.pricingSummary}</span>
                        <span className="group-hover:translate-x-1 transition-transform">Chi tiết →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* ========================================================
            2. MAIN PROGRAMS LIST, TABS & COMPREHENSIVE FILTERS
        ======================================================== */
        <div id="danh-sach-chuong-trinh" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
          
          {/* Section Header */}
          <div className="border-b border-slate-200 pb-5 space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-orange-600 font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DANH SÁCH HOẠT ĐỘNG & SỰ KIỆN CHUỖI CUNG ỨNG B2B</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
                Chọn Điểm Đến & Khám Phá Nhu Cầu Cung - Cầu
              </h2>
              <div className="text-xs font-medium text-slate-500">
                Hiển thị <strong>{filteredPrograms.length}</strong> / {PROGRAMS_DATA.length} chương trình
              </div>
            </div>
          </div>

          {/* 5 PROGRAM TYPES TABS (Horizontal Pill Tabs) */}
          <div className="overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-2 min-w-max">
              {PROGRAM_TYPES.map(tab => {
                const isActive = activeTypeTab === tab.id;
                const count = tab.id === 'all' 
                  ? PROGRAMS_DATA.length 
                  : PROGRAMS_DATA.filter(p => p.type === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTypeTab(tab.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold font-heading transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xs ${
                      isActive 
                        ? 'bg-[#0052cc] text-white shadow-md shadow-blue-500/20 scale-[1.02]' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COMPREHENSIVE FILTER BAR */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            
            {/* Top Row: Search Input + Fast Status Select */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search input: Name, Industry, Need */}
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên chương trình, KCN, ngành hàng hoặc nhóm nhu cầu mua sắm..."
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                {searchKw && (
                  <button
                    onClick={() => setSearchKw('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="all">Tất cả trạng thái (7 trạng thái)</option>
                  {PROGRAM_STATUSES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Row: 5 Multi-select filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              
              {/* 1. Zone Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  <span>Địa bàn / KCN</span>
                </label>
                <select
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {PROGRAM_ZONES.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Industry / Need Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-500" />
                  <span>Ngành hàng / Nhu cầu</span>
                </label>
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium truncate"
                >
                  {PROGRAM_INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* 3. Role Filter (Buyer, Supplier, Partner) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-blue-500" />
                  <span>Vai trò tham gia</span>
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {PROGRAM_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* 4. Format Filter (In-person, Online, Hybrid) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-500" />
                  <span>Hình thức tổ chức</span>
                </label>
                <select
                  value={filterFormat}
                  onChange={(e) => setFilterFormat(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {PROGRAM_FORMATS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* 5. Time Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-500" />
                  <span>Thời gian</span>
                </label>
                <select
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="all">Tất cả thời gian</option>
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="past">Đã diễn ra</option>
                </select>
              </div>

            </div>

            {/* Active Filters Reset Bar */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Đang lọc theo các điều kiện đã chọn
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[#0052cc] hover:text-blue-800 font-bold hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại tất cả bộ lọc</span>
                </button>
              </div>
            )}

          </div>

          {/* 3 THẺ 1 DÒNG (GRID 3 COLUMNS) REUSABLE PROGRAM CARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                userRole={filterRole}
                userLocation={filterZone !== 'all' ? filterZone : ''}
                onOpenInterestModal={(p) => setSelectedInterestProgram(p)}
                onOpenRecapModal={(p) => setRecapModalProgram(p)}
              />
            ))}
          </div>

          {/* Empty State adhering to Section 31 */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto text-2xl font-bold">
                🔍
              </div>
              <h4 className="text-slate-900 font-black text-lg font-heading">
                Hiện chưa có chương trình đang mở phù hợp.
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Hệ thống liên tục cập nhật các kỳ sự kiện và phiên kết nối mới theo nhu cầu từ các KCN. Quý doanh nghiệp có thể để lại thông tin để nhận thông báo sớm nhất hoặc chủ động đề xuất tổ chức.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('dang-ky-thong-tin-phu-hop');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  ĐĂNG KÝ NHẬN THÔNG TIN
                </button>
                <Link
                  to="/dich-vu/to-chuc-ket-noi"
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  ĐỀ XUẤT TỔ CHỨC CHƯƠNG TRÌNH
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================
              3. KHỐI TIẾP THEO: "CHƯA CÓ CHƯƠNG TRÌNH PHÙ HỢP?"
              Đăng ký nhận thông tin theo địa bàn & chuyên mục (ccu_lead_consents)
          ======================================================== */}
          <div id="dang-ky-thong-tin-phu-hop" className="rounded-3xl bg-gradient-to-br from-[#072348] via-[#0b3368] to-[#0052cc] p-6 sm:p-10 text-white shadow-xl space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-6">
              <div className="space-y-1.5 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30 uppercase font-heading">
                  ĐĂNG KÝ THEO DÕI NĂNG ĐỘNG
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading">
                  Chưa có chương trình phù hợp với địa bàn và ngành hàng của bạn?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Để lại thông tin để hệ thống điều phối thông báo cho doanh nghiệp ngay khi có Ngày hội Chuỗi Cung Ứng hoặc phiên Sourcing Day 1:1 mở tại KCN mục tiêu của bạn.
                </p>
              </div>

              <div className="shrink-0 text-xs text-blue-200 bg-white/10 p-3 rounded-2xl border border-white/10 max-w-xs">
                🔒 <strong>Chính sách dữ liệu:</strong> Cam kết bảo mật thông tin, chỉ gửi các chương trình khớp lệnh nhu cầu chính xác.
              </div>
            </div>

            {/* Subscription Form */}
            {subSubmitted ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center space-y-2 border border-white/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Đăng ký nhận thông tin thành công!</h4>
                <p className="text-xs text-blue-100 max-w-md mx-auto">
                  Hệ thống đã lưu sự đồng ý và hồ sơ quan tâm của bạn. Đội điều phối CHUOICUNGUNG.COM sẽ chủ động gửi thư mời ngay khi có chương trình tại <strong>{subFormData.zone}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBottomSubSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-900">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-100 mb-1">Họ và tên *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nguyễn Văn A" 
                      value={subFormData.name}
                      onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-100 mb-1">Tên công ty / Nhà máy *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Công ty TNHH Sản Xuất..." 
                      value={subFormData.company}
                      onChange={(e) => setSubFormData({ ...subFormData, company: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-100 mb-1">Email nhận thư mời *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="purchasing@company.vn" 
                      value={subFormData.email}
                      onChange={(e) => setSubFormData({ ...subFormData, email: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-100 mb-1">Số điện thoại / Zalo *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="0912 345 678" 
                      value={subFormData.phone}
                      onChange={(e) => setSubFormData({ ...subFormData, phone: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-900">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-100 mb-1">Địa bàn / KCN mong muốn</label>
                    <select
                      value={subFormData.zone}
                      onChange={(e) => setSubFormData({ ...subFormData, zone: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none font-medium"
                    >
                      <option value="Miền Nam">Miền Nam (Bình Dương, Đồng Nai, TP.HCM, Long An...)</option>
                      <option value="Miền Bắc">Miền Bắc (Hà Nội, Hải Phòng, Bắc Ninh, Thái Nguyên...)</option>
                      <option value="Miền Trung">Miền Trung (Đà Nẵng, Quảng Nam, Quảng Ngãi...)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-100 mb-1">Chuyên mục / Ngành hàng</label>
                    <select
                      value={subFormData.industry}
                      onChange={(e) => setSubFormData({ ...subFormData, industry: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none font-medium"
                    >
                      {PROGRAM_INDUSTRIES.filter(i => i !== 'Tất cả ngành hàng').map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-100 mb-1">Vai trò của bạn</label>
                    <select
                      value={subFormData.role}
                      onChange={(e) => setSubFormData({ ...subFormData, role: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl text-xs focus:ring-2 focus:ring-amber-400 outline-none font-medium"
                    >
                      <option value="supplier">Nhà cung ứng (Supplier)</option>
                      <option value="buyer">Người mua / Nhà máy (Buyer)</option>
                      <option value="partner">KCN / Ban quản lý / Hiệp hội</option>
                    </select>
                  </div>
                </div>

                {/* Consent checkbox (Stored separately per requirements) */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <label className="flex items-start gap-2.5 text-xs text-blue-100 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={subFormData.consent}
                      onChange={(e) => setSubFormData({ ...subFormData, consent: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0052cc] mt-0.5"
                    />
                    <span>
                      Tôi đồng ý nhận thông báo về các chương trình kết nối và cơ hội chuỗi cung ứng phù hợp từ CHUOICUNGUNG.COM (Dữ liệu được lưu trữ và quản trị riêng theo thỏa thuận dịch vụ).
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-heading shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Đăng Ký Nhận Thông Báo</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      )}

      {/* ========================================================
          4. MODAL: ĐĂNG KÝ QUAN TÂM / DANH SÁCH CHỜ
          (Có chú thích rõ ràng: "Không đồng nghĩa với giữ chỗ")
      ======================================================== */}
      {interestModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setInterestModalEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0052cc] text-[11px] font-bold">
                {interestModalEvent.status === 'da-dong-dang-ky' ? 'DANH SÁCH CHỜ' : 'ĐĂNG KÝ QUAN TÂM'}
              </span>
              <h3 className="text-lg font-black font-heading text-slate-900 leading-snug">
                {interestModalEvent.title || interestModalEvent.name}
              </h3>
              <p className="text-xs text-slate-500">
                {interestModalEvent.date} • {interestModalEvent.location}
              </p>
            </div>

            {/* CRITICAL OPERATIONAL DISCLAIMER BANNER */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý quan trọng:</strong> "Đăng ký quan tâm" giúp doanh nghiệp của bạn nhận tài liệu sớm nhất và được ưu tiên khi mở cổng chính thức, <u>không đồng nghĩa với việc giữ chỗ tham dự</u>.
              </div>
            </div>

            {interestSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Đăng ký quan tâm thành công!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Ban tổ chức sẽ liên hệ và gửi thông báo ưu tiên trước khi chính thức mở cổng kết nối.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên người đại diện *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nguyễn Văn A" 
                    value={interestFormData.name}
                    onChange={(e) => setInterestFormData({ ...interestFormData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên công ty / Doanh nghiệp *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Công ty TNHH Cơ Khí & Tự Động Hóa..." 
                    value={interestFormData.company}
                    onChange={(e) => setInterestFormData({ ...interestFormData, company: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="info@company.vn" 
                      value={interestFormData.email}
                      onChange={(e) => setInterestFormData({ ...interestFormData, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="0901 234 567" 
                      value={interestFormData.phone}
                      onChange={(e) => setInterestFormData({ ...interestFormData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nhu cầu / Sản phẩm muốn kết nối</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Cung ứng bu lông ốc vít Inox, Tìm đối tác bao bì..." 
                    value={interestFormData.needs}
                    onChange={(e) => setInterestFormData({ ...interestFormData, needs: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <label className="flex items-start gap-2 pt-1 cursor-pointer text-slate-600 text-[11px]">
                  <input 
                    type="checkbox" 
                    required
                    checked={interestFormData.hasConsent}
                    onChange={(e) => setInterestFormData({ ...interestFormData, hasConsent: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0052cc] mt-0.5"
                  />
                  <span>
                    Tôi hiểu rằng việc đăng ký này không đảm bảo giữ chỗ và đồng ý nhận thông báo tiến độ sự kiện.
                  </span>
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInterestModalEvent(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003ea8] text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Gửi đăng ký</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Page 20 Modals */}
      {selectedInterestProgram && (
        <ProgramInterestModal 
          program={selectedInterestProgram} 
          onClose={() => setSelectedInterestProgram(null)} 
        />
      )}

      {recapModalProgram && (
        <ProgramCompletedRecapModal
          program={recapModalProgram}
          onClose={() => setRecapModalProgram(null)}
        />
      )}

      {showSuppiModal && (
        <ProgramSuppiGuideModal
          onClose={() => setShowSuppiModal(false)}
          onSelectTopic={(topic) => {
            setShowSuppiModal(false);
            setSearchKw(topic.prompt.split(' ')[0]);
            scrollToPrograms();
          }}
        />
      )}

      {/* Floating SUPPI Button (Section 17 & 18) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowSuppiModal(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xl shadow-blue-500/30 flex items-center space-x-2 transition transform hover:scale-105 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Hỏi SUPPI & CHAINY</span>
        </button>
      </div>

    </div>
  );
}
