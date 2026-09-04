import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, MapPin, Building2, Calendar, 
  Clock, PlusCircle, ArrowRight, ChevronRight, RotateCcw, 
  DollarSign, CheckCircle2, Sparkles, Award, Users, Eye, 
  Lock, ShieldCheck, Heart, Share2, Layers, Phone, Mail, 
  X, Check, FileText, Send, UserCheck, Flame, Compass, ChevronDown,
  GraduationCap, UserPlus, Star, BadgeCheck, Zap, Brain, User, UploadCloud,
  Navigation, CheckCircle, SlidersHorizontal, Activity
} from 'lucide-react';
import { recruitmentJobsData, recruitmentCandidatesData, recruitmentStats } from '../data/recruitmentData';
import { useLanguage } from '../contexts/LanguageContext';
import NumerologyModal from '../components/NumerologyModal';
import CVAnalysisAndMatchingModal from '../components/CVAnalysisAndMatchingModal';

export default function RecruitmentPage({ defaultTab }) {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Active Sub-system Tab: 'jobs' (Việc Tìm Người) | 'candidates' (Người Tìm Việc)
  const [activeTab, setActiveTab] = useState(() => {
    if (defaultTab) return defaultTab;
    if (location.pathname.includes('nguoi-tim-viec')) return 'candidates';
    return 'jobs';
  });

  useEffect(() => {
    if (location.pathname.includes('nguoi-tim-viec')) {
      setActiveTab('candidates');
    } else if (location.pathname.includes('viec-tim-nguoi')) {
      setActiveTab('jobs');
    }
  }, [location.pathname]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [discFilter, setDiscFilter] = useState('all'); // 'all' | 'D' | 'I' | 'S' | 'C'
  const [radiusFilter, setRadiusFilter] = useState('all'); // 'all' | '5' | '10' | '20'

  // Numerology & DISC Modal state
  const [numerologyModal, setNumerologyModal] = useState({
    isOpen: false,
    tab: 'candidate' // 'candidate' | 'recruiter'
  });

  // Smart CV & Recruitment Matching Modal State (AI & DISC & Location)
  const [cvMatchingModal, setCvMatchingModal] = useState({
    isOpen: false,
    mode: 'candidate' // 'candidate' (Upload CV & Match Factory Logos) | 'factory' (Post Job & Match Candidate Avatars)
  });

  // Job Apply Modal state
  const [applyModal, setApplyModal] = useState({
    isOpen: false,
    job: null
  });
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    experienceYears: '2 - 3 năm',
    note: ''
  });
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Candidate Connect Modal state (For enterprises hiring candidate)
  const [candidateModal, setCandidateModal] = useState({
    isOpen: false,
    candidate: null
  });
  const [candidateForm, setCandidateForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    positionTitle: '',
    message: ''
  });
  const [candidateSubmitted, setCandidateSubmitted] = useState(false);

  // Post Job / Post Profile Modal state
  const [postModal, setPostModal] = useState(false);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return recruitmentJobsData.filter(j => {
      const matchText = (j.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (j.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (j.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (j.kcnName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (j.discBadge || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (j.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchIndustry = industryFilter === 'all' || j.industry === industryFilter;
      const matchProvince = provinceFilter === 'all' || j.province === provinceFilter;
      const matchLevel = levelFilter === 'all' || j.level === levelFilter;
      
      let matchSalary = true;
      if (salaryFilter === 'under15') {
        matchSalary = j.salary.includes('12') || j.salary.includes('14');
      } else if (salaryFilter === '15to25') {
        matchSalary = j.salary.includes('16') || j.salary.includes('18') || j.salary.includes('20') || j.salary.includes('22');
      } else if (salaryFilter === 'above25') {
        matchSalary = j.salary.includes('25') || j.salary.includes('30') || j.salary.includes('32') || j.salary.includes('35') || j.salary.includes('45');
      }

      let matchDisc = true;
      if (discFilter !== 'all') {
        matchDisc = j.targetDisc === discFilter || (j.discProfile && (j.discProfile.primary === discFilter || j.discProfile.secondary === discFilter));
      }

      let matchRadius = true;
      if (radiusFilter !== 'all') {
        const maxKm = parseFloat(radiusFilter);
        matchRadius = (j.distanceKm || 5) <= maxKm;
      }

      return matchText && matchIndustry && matchProvince && matchLevel && matchSalary && matchDisc && matchRadius;
    });
  }, [searchTerm, industryFilter, provinceFilter, levelFilter, salaryFilter, discFilter, radiusFilter]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return recruitmentCandidatesData.filter(c => {
      const matchText = (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (c.headline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.kcnNearby || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.degree || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.discBadge || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchIndustry = industryFilter === 'all' || c.industry === industryFilter;
      const matchProvince = provinceFilter === 'all' || c.province === provinceFilter;
      const matchLevel = levelFilter === 'all' || c.level === levelFilter;

      let matchSalary = true;
      if (salaryFilter === 'under15') {
        matchSalary = c.desiredSalary.includes('12') || c.desiredSalary.includes('14');
      } else if (salaryFilter === '15to25') {
        matchSalary = c.desiredSalary.includes('18') || c.desiredSalary.includes('20') || c.desiredSalary.includes('23') || c.desiredSalary.includes('25');
      } else if (salaryFilter === 'above25') {
        matchSalary = c.desiredSalary.includes('25') || c.desiredSalary.includes('28') || c.desiredSalary.includes('32') || c.desiredSalary.includes('35') || c.desiredSalary.includes('45');
      }

      let matchDisc = true;
      if (discFilter !== 'all') {
        matchDisc = c.discType === discFilter || (c.discProfile && (c.discProfile.primary === discFilter || c.discProfile.secondary === discFilter));
      }

      let matchRadius = true;
      if (radiusFilter !== 'all') {
        const maxKm = parseFloat(radiusFilter);
        matchRadius = (c.distanceKm || 5) <= maxKm;
      }

      return matchText && matchIndustry && matchProvince && matchLevel && matchSalary && matchDisc && matchRadius;
    });
  }, [searchTerm, industryFilter, provinceFilter, levelFilter, salaryFilter, discFilter, radiusFilter]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySubmitted(true);
    setTimeout(() => {
      setApplySubmitted(false);
      setApplyModal({ isOpen: false, job: null });
      alert('Ứng tuyển thành công! Nhà máy / Doanh nghiệp sẽ liên hệ với bạn trong thời gian sớm nhất qua ATS.');
    }, 1200);
  };

  const handleCandidateConnectSubmit = (e) => {
    e.preventDefault();
    setCandidateSubmitted(true);
    setTimeout(() => {
      setCandidateSubmitted(false);
      setCandidateModal({ isOpen: false, candidate: null });
      alert(`Đã gửi lời mời phỏng vấn đến ứng viên ${candidateModal.candidate?.fullName}! Bộ phận tuyển dụng CCU & ATS sẽ kết nối hai bên trong 24h.`);
    }, 1200);
  };

  // Helper for DISC color style
  const getDiscBadgeStyle = (discCode) => {
    switch(discCode) {
      case 'D': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'I': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'S': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'C': return 'bg-sky-50 text-sky-700 border-sky-200';
      default: return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Identical to Image 1) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Industrial Panoramic Visual with Seamless Gradient Fade */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/recruitment_hero.jpg" 
            alt="Vietnam Industrial Careers & Factory Recruitment Hub"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 lg:via-[#F4F8FA]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-5">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link to="/tuyen-dung" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Recruitment' : 'Tuyển Dụng'}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">
                {activeTab === 'jobs' ? (lang === 'en' ? 'Jobs Seeking Talents' : 'Việc Tìm Người') : (lang === 'en' ? 'Talents Seeking Jobs' : 'Người Tìm Việc')}
              </span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'VIETNAM INDUSTRIAL WORKFORCE & CAREERS' : 'MẠNG LƯỚI VIỆC LÀM & NHÂN LỰC KCN VIỆT NAM'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                Việc Tìm Người
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                Kết Nối Nhà Máy & Xưởng Toàn Quốc
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              Cổng thông tin việc làm chuyên ngành dành riêng cho Kỹ sư sản xuất, Trưởng phòng QA/QC, Chuyên viên XNK Logistics, Thợ kỹ thuật và Lao động tại hơn 400+ Khu Công Nghiệp toàn quốc.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => setPostModal(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Đăng Tin Tuyển Dụng</span>
              </button>

              <button
                onClick={() => setNumerologyModal({ isOpen: true, tab: activeTab === 'jobs' ? 'candidate' : 'recruiter' })}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-900/25 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Phân Tích Thần Số Học Chọn Việc</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS (5 Cards from Image 1) & SEGMENTED 2-TAB SWITCHER & FILTER BAR */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20 space-y-6">
        
        {/* 5 Stats Chips (Identical to Image 1) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-[#0052cc] font-mono">4.320+</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Việc làm đang tuyển</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-emerald-600 font-mono">1.850+</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Hồ sơ ứng viên KCN</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-indigo-600 font-mono">620+</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Nhà máy & DN KCN</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-amber-600 font-mono">18+</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Nhóm ngành sản xuất</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md col-span-2 sm:col-span-1">
            <span className="text-xl font-black text-sky-600 font-mono">100%</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Xác thực hồ sơ</p>
          </div>
        </div>

        {/* 2-TAB SEGMENTED CONTROLLER (Việc Tìm Người & Người Tìm Việc) */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="grid grid-cols-2 w-full lg:w-auto gap-2">
            <button
              onClick={() => {
                setActiveTab('jobs');
                navigate('/tuyen-dung/viec-tim-nguoi');
              }}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black font-heading transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-[#0052cc] to-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>VIỆC TÌM NGƯỜI (4.320+)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('candidates');
                navigate('/tuyen-dung/nguoi-tim-viec');
              }}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black font-heading transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'candidates'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>NGƯỜI TÌM VIỆC (1.850+)</span>
            </button>
          </div>

          {/* Quick Action Bar for Smart AI Matching */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: activeTab === 'jobs' ? 'candidate' : 'factory' })}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl text-xs font-heading transition flex items-center space-x-1.5 shadow-md shadow-orange-500/20 cursor-pointer animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>AI Khớp Lệnh Nhanh</span>
            </button>

            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: 'candidate' })}
              className="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold font-heading transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Quét CV Khớp Nhà Máy</span>
            </button>

            <button
              onClick={() => setNumerologyModal({ isOpen: true, tab: activeTab === 'jobs' ? 'candidate' : 'recruiter' })}
              className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 rounded-xl text-xs font-bold font-heading transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span>Trắc Nghiệm DISC & MBTI</span>
            </button>
          </div>
        </div>

        {/* PROMINENT SMART MATCHING & DISC BANNER (SPEC B2B FDI STANDARD) */}
        <div className="bg-gradient-to-r from-[#072348] via-[#111c4e] to-[#1e1b4b] rounded-3xl p-5 sm:p-6 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-sky-300 text-[10.5px] font-mono font-bold uppercase tracking-wider border border-blue-400/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>SMART MATCHING: RIGHT PERSON - RIGHT SEAT - RIGHT LOCATION</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-heading text-white tracking-tight">
              Phân Tích Tính Cách DISC & Tự Động Khớp Nhân Lực KCN Trong Bán Kính 5 - 20KM
            </h3>
            <p className="text-xs text-indigo-200/90 leading-relaxed">
              Thuật toán AI đối soát <strong>Kỹ năng chuyên môn (Skill Match %)</strong> + <strong>Tính cách tổ chức (DISC D-I-S-C Culture Match)</strong> + <strong>Vị trí GIS KCN</strong> giúp doanh nghiệp tuyển đúng người, giảm 65% tỷ lệ nghỉ việc.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Powered by ATS & TopCV Partner</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-sky-400" /> Odoo HR Integration API</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 relative z-10 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: 'candidate' })}
              className="flex-1 sm:flex-none px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs font-heading shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-950" />
              <span>Tải CV Quét Nhà Máy Gần Bạn</span>
            </button>

            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: 'factory' })}
              className="flex-1 sm:flex-none px-5 py-3 bg-white hover:bg-slate-100 text-[#072348] font-black rounded-xl text-xs font-heading shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#0052cc]" />
              <span>Nhà Máy Khớp Ứng Viên Top 10</span>
            </button>
          </div>
        </div>

        {/* Search & Multi-criteria Filter Bar with GIS Radius & DISC Traits */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'jobs'
                  ? "Tìm theo chức danh, nhà máy FDI, KCN (VD: Kỹ sư SMT, QA/QC May mặc, KCN Yên Phong, Long Thành...)..."
                  : "Tìm ứng viên theo chuyên môn, kỹ năng, KCN cư trú (VD: PLC Siemens, ISO 9001, Mastercam, KCN VSIP...)..."
              }
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {/* GIS Radius Filter */}
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(e.target.value)}
              className="bg-blue-50/70 border border-blue-200 rounded-xl px-3 py-2.5 text-[#0047a5] font-bold focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">📍 Bán kính KCN (Tất cả)</option>
              <option value="5">&lt; 5km (Gần KCN / Đi bộ)</option>
              <option value="10">&lt; 10km (Xe máy 15-20p)</option>
              <option value="20">&lt; 20km (Có xe đưa đón KCN)</option>
            </select>

            {/* DISC Personality Profile Filter */}
            <select
              value={discFilter}
              onChange={(e) => setDiscFilter(e.target.value)}
              className="bg-purple-50/80 border border-purple-200 rounded-xl px-3 py-2.5 text-purple-950 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">🧠 Nhóm tính cách DISC</option>
              <option value="D">Nhóm D (Quyết đoán / Lãnh đạo)</option>
              <option value="I">Nhóm I (Giao tiếp / Sourcing)</option>
              <option value="S">Nhóm S (Kiên định / QA-QC)</option>
              <option value="C">Nhóm C (Tuân thủ / Kỹ thuật)</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">Tất cả ngành nghề (18 nhóm)</option>
              <option value="Điện & Điện tử">Điện & Điện tử (SMT/PCB)</option>
              <option value="Cơ khí & Chế tạo">Cơ khí chính xác & CNC</option>
              <option value="Dệt may & Da giày">Dệt may & Đồng phục</option>
              <option value="Logistics & Kho vận">Logistics & Xuất nhập khẩu</option>
              <option value="Hóa chất & Môi trường">Hóa chất & HSE Nhà máy</option>
            </select>

            {/* Province & KCN Filter */}
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">Tất cả tỉnh thành / KCN</option>
              <option value="Bắc Ninh">Bắc Ninh (Yên Phong, Quế Võ)</option>
              <option value="Đồng Nai">Đồng Nai (Long Thành, Amata)</option>
              <option value="Bình Dương">Bình Dương (VSIP, Mỹ Phước)</option>
              <option value="Hải Phòng">Hải Phòng (Deep C, Tràng Duệ)</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (SHTP, Tân Thuận)</option>
              <option value="Quảng Nam">Quảng Nam (Chu Lai)</option>
              <option value="Hà Nam">Hà Nam (Đồng Văn)</option>
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">Tất cả cấp bậc</option>
              <option value="Công nhân / Kỹ thuật viên">Công nhân / Kỹ thuật viên</option>
              <option value="Chuyên viên / Kỹ sư">Chuyên viên / Kỹ sư</option>
              <option value="Trưởng nhóm / Giám sát">Trưởng nhóm / Giám sát chuyền</option>
              <option value="Trưởng phòng / Quản lý">Trưởng phòng / Quản lý nhà máy</option>
            </select>

            {/* Salary & Reset */}
            <div className="flex items-center gap-1.5">
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] flex-1 text-xs"
              >
                <option value="all">Mức lương</option>
                <option value="under15">&lt; 15 Tr</option>
                <option value="15to25">15 - 25 Tr</option>
                <option value="above25">&gt; 25 Tr</option>
              </select>

              <button 
                onClick={() => { 
                  setSearchTerm(''); 
                  setIndustryFilter('all'); 
                  setProvinceFilter('all'); 
                  setLevelFilter('all'); 
                  setSalaryFilter('all'); 
                  setDiscFilter('all'); 
                  setRadiusFilter('all'); 
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center transition shrink-0 cursor-pointer"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. CONTENT AREA: JOBS TAB OR CANDIDATES TAB */}
      {/* ========================================================================= */}
      <div id="danh-sach-noi-dung" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">

        {/* TAB 1: VIỆC TÌM NGƯỜI */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#0052cc]" />
                  <span>Danh sách vị trí việc làm KCN đang tuyển dụng ({filteredJobs.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khớp nối trực tiếp nhà máy FDI & Xưởng chuỗi cung ứng • Không qua trung gian thu phí
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Cập nhật mới 5 phút trước</span>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const isProser = job.company.includes('Proser');

                return (
                  <div
                    key={job.id}
                    className={`group relative bg-white rounded-3xl p-5 sm:p-7 transition-all duration-200 border ${
                      isProser 
                        ? 'border-blue-300 ring-2 ring-blue-500/20 shadow-md hover:shadow-xl hover:border-blue-500 bg-gradient-to-br from-white via-blue-50/10 to-indigo-50/20' 
                        : 'border-slate-200/90 hover:border-blue-300 hover:shadow-lg shadow-xs'
                    }`}
                  >
                    {job.urgent && (
                      <div className="absolute -top-3 left-6 px-3 py-0.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider font-heading shadow-xs flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Tuyển Gấp
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1 min-w-0">
                        
                        {/* Company & Meta info */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                            {job.logo ? (
                              <img 
                                src={job.logo} 
                                alt={job.company} 
                                className="w-full h-full object-contain rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<span class="font-bold text-blue-700 text-[10px]">KCN</span>';
                                }}
                              />
                            ) : (
                              <Building2 className="w-4 h-4 text-slate-500" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 font-heading">
                                {job.company}
                              </span>

                              {job.isFoundingPartner && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-0.5">
                                  <Award className="w-3 h-3 text-amber-600" />
                                  Founding Partner
                                </span>
                              )}

                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-mono font-bold border border-blue-100">
                                {job.industry}
                              </span>

                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                {job.level}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {job.atsSystem || 'TopCV / Odoo ATS Integrated'}
                            </span>
                          </div>
                        </div>

                        {/* Job Title */}
                        <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>

                        {/* Match Indicator Pill & DISC Badge */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {/* DISC Badge */}
                          <div 
                            onClick={() => setNumerologyModal({ isOpen: true, tab: 'candidate' })}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-xl text-xs font-semibold cursor-pointer hover:shadow-xs transition ${getDiscBadgeStyle(job.targetDisc || 'D')}`}
                          >
                            <Brain className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-heading font-bold text-[11.5px]">{job.discBadge || `DISC: Nhóm ${job.targetDisc || 'D'}`}</span>
                          </div>

                          {/* Skill Match & Culture Match Badges */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold font-mono">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Độ khớp kỹ năng: {job.skillMatchPercent || 92}%</span>
                          </div>

                          {/* GIS Radius distance badge */}
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-mono font-semibold">
                            <Navigation className="w-3 h-3 text-[#0052cc]" />
                            <span>Bán kính {job.distanceKm || '3.5'}km ({job.kcnName || job.location})</span>
                          </div>
                        </div>

                        {/* Meta Specs Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 pt-1">
                          <div className="flex items-center gap-1.5 font-mono">
                            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Mức lương: <strong className="text-emerald-700 font-black text-sm">{job.salary}</strong></span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Hạn nộp: <strong>{job.deadline}</strong></span>
                          </div>
                        </div>

                        {/* Tags */}
                        {job.tags && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {job.tags.map((tg, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium rounded-lg transition">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Action CTA */}
                      <div className="lg:self-center shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-2 lg:pt-0">
                        <button
                          onClick={() => setApplyModal({ isOpen: true, job })}
                          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 font-heading uppercase tracking-wider transition group-hover:scale-[1.02] cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Nộp Hồ Sơ Ứng Tuyển</span>
                        </button>
                        
                        <span className="text-[11px] text-center text-slate-400 font-medium">
                          Đăng {job.postedDate} • Phản hồi qua ATS
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: NGƯỜI TÌM VIỆC */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Hồ sơ Chuyên gia & Kỹ sư KCN đang tìm việc ({filteredCandidates.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nhân sự kỹ thuật cao đã xác thực CCCD, bằng cấp & kinh nghiệm thực chiến tại các nhà máy
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{recruitmentStats.verifiedPercentage} hồ sơ đạt chuẩn</span>
              </div>
            </div>

            {/* Candidates Grid */}
            <div className="space-y-4">
              {filteredCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="group relative bg-white rounded-3xl p-5 sm:p-7 transition-all duration-200 border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg shadow-xs"
                >
                  {cand.availableNow && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider font-heading shadow-xs flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      Sẵn Sàng Đi Làm Ngay
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1 min-w-0">
                      
                      {/* Top Row: Avatar & Basic Info */}
                      <div className="flex flex-wrap items-center gap-3">
                        <img 
                          src={cand.avatar} 
                          alt={cand.fullName} 
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/30 p-0.5 shrink-0"
                        />

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                              {cand.fullName}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              {cand.industry}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {cand.level}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold font-mono">
                              ✓ Đã xác thực
                            </span>
                          </div>

                          <p className="text-xs font-bold text-blue-700 font-heading mt-0.5">
                            {cand.headline}
                          </p>
                        </div>
                      </div>

                      {/* DISC Profile & Match Indicators */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <div 
                          onClick={() => setNumerologyModal({ isOpen: true, tab: 'recruiter' })}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-xl text-xs font-semibold cursor-pointer hover:shadow-xs transition ${getDiscBadgeStyle(cand.discType || 'D')}`}
                        >
                          <Brain className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-heading font-bold text-[11.5px]">{cand.discBadge || `DISC: Nhóm ${cand.discType}`}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold font-mono">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tương thích văn hóa: {cand.cultureMatchPercent || 94}%</span>
                        </div>

                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-mono font-semibold">
                          <Navigation className="w-3 h-3 text-[#0052cc]" />
                          <span>Cư trú cách {cand.kcnNearby || cand.location} {cand.distanceKm || '4.2'}km</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {cand.summary}
                      </p>

                      {/* Specs Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-1.5 font-mono">
                          <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Lương mong muốn: <strong className="text-emerald-700 font-black text-sm">{cand.desiredSalary}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Khu vực: <strong>{cand.location}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">{cand.degree}</span>
                        </div>
                      </div>

                      {/* Skills & Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {cand.tags.map((tg, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium rounded-lg transition border border-emerald-100">
                            ✓ {tg}
                          </span>
                        ))}
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg border border-slate-200">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>SĐT: {cand.contactPhone}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg border border-slate-200">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>Email: {cand.contactEmail}</span>
                        </span>
                      </div>

                    </div>

                    {/* Right Actions */}
                    <div className="lg:self-center shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-2 lg:pt-0">
                      <button
                        onClick={() => setCandidateModal({ isOpen: true, candidate: cand })}
                        className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 font-heading uppercase tracking-wider transition group-hover:scale-[1.02] cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Mời Phỏng Vấn Ngay</span>
                      </button>
                      
                      <span className="text-[11px] text-center text-slate-400 font-medium">
                        Kinh nghiệm: {cand.experience}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CROSS-SELL ECOSYSTEM BANNER (KHÉP KÍN CHUỖI CUNG ỨNG) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-400/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>HỆ SINH THÁI KHÉP KÍN CHUOICUNGUNG.COM</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              Giải Pháp Đồng Phục Bảo Hộ & Đào Tạo Nhân Lực Nhà Máy Chuẩn KCN
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn đang setup nhà máy mới hoặc mở rộng quy mô xưởng sản xuất? Kết nối ngay với <strong>Chuyên Gia Đồng Phục Proser</strong> để may đo trang phục bảo hộ PPE đạt chuẩn ISO, cùng chương trình đào tạo kỹ năng 5S/Kaizen cho công nhân.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap w-full lg:w-auto">
            <Link
              to="/doanh-nghiep"
              className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs font-heading shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Kết Nối Xưởng May Proser</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/san-nhu-cau"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs font-heading border border-white/20 transition flex items-center justify-center space-x-2"
            >
              <span>Đăng Nhu Cầu Tuyển Dụng Lớn</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL APPLY CV (JOB SEEKERS APPLYING TO FACTORIES) */}
      {/* ========================================================================= */}
      {applyModal.isOpen && applyModal.job && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setApplyModal({ isOpen: false, job: null })}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-bold">
                <Briefcase className="w-3 h-3" />
                Ứng tuyển trực tiếp nhà máy
              </div>
              <h3 className="text-lg font-black text-slate-900 font-heading">
                {applyModal.job.title}
              </h3>
              <p className="text-xs text-slate-500">
                {applyModal.job.company} • {applyModal.job.location}
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Họ và tên ứng viên *
                </label>
                <input
                  required
                  type="text"
                  placeholder="VD: Nguyễn Văn Hùng"
                  value={applyForm.fullName}
                  onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="VD: 0988 123 456"
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email nhận phản hồi *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="VD: hung.nguyen@gmail.com"
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Số năm kinh nghiệm trong ngành *
                </label>
                <select
                  value={applyForm.experienceYears}
                  onChange={(e) => setApplyForm({ ...applyForm, experienceYears: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs sm:text-sm"
                >
                  <option value="Dưới 1 năm">Dưới 1 năm kinh nghiệm</option>
                  <option value="1 - 2 năm">1 - 2 năm kinh nghiệm</option>
                  <option value="2 - 3 năm">2 - 3 năm kinh nghiệm</option>
                  <option value="3 - 5 năm">3 - 5 năm kinh nghiệm</option>
                  <option value="Trên 5 năm">Trên 5 năm kinh nghiệm quản lý</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tải lên CV / Hồ sơ năng lực (PDF, DOCX)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-blue-50/50 transition cursor-pointer">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Kéo thả file CV của bạn vào đây</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hỗ trợ PDF, DOC, DOCX dung lượng tối đa 10MB</p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ghi chú cho bộ phận tuyển dụng
                </label>
                <textarea
                  rows={3}
                  placeholder="Giới thiệu ngắn gọn thế mạnh kỹ thuật, thời gian có thể bắt đầu làm việc..."
                  value={applyForm.note}
                  onChange={(e) => setApplyForm({ ...applyForm, note: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={applySubmitted}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-2 font-heading uppercase tracking-wider cursor-pointer"
              >
                {applySubmitted ? (
                  <span>Đang gửi hồ sơ qua ATS...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Hồ Sơ Ứng Tuyển Ngay</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL CONNECT CANDIDATE (ENTERPRISES CONTACTING CANDIDATES) */}
      {/* ========================================================================= */}
      {candidateModal.isOpen && candidateModal.candidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCandidateModal({ isOpen: false, candidate: null })}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                <UserCheck className="w-3 h-3" />
                Mời phỏng vấn nhân sự kỹ thuật cao
              </div>
              <h3 className="text-lg font-black text-slate-900 font-heading">
                Kết nối với Ứng viên: {candidateModal.candidate.fullName}
              </h3>
              <p className="text-xs text-slate-500">
                {candidateModal.candidate.headline} • {candidateModal.candidate.location}
              </p>
            </div>

            <form onSubmit={handleCandidateConnectSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tên Nhà máy / Doanh nghiệp tuyển dụng *
                </label>
                <input
                  required
                  type="text"
                  placeholder="VD: Công ty TNHH Cơ Khí Chính Xác & Tự Động Hóa VN"
                  value={candidateForm.companyName}
                  onChange={(e) => setCandidateForm({ ...candidateForm, companyName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Người phụ trách tuyển dụng *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="VD: Nguyễn Thị Lan (HR Manager)"
                    value={candidateForm.contactPerson}
                    onChange={(e) => setCandidateForm({ ...candidateForm, contactPerson: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="VD: 0912 345 678"
                    value={candidateForm.phone}
                    onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Vị trí mời phỏng vấn *
                </label>
                <input
                  required
                  type="text"
                  placeholder="VD: Kỹ Sư Trưởng Chuyền SMT / Giám Sát Tự Động Hóa"
                  value={candidateForm.positionTitle}
                  onChange={(e) => setCandidateForm({ ...candidateForm, positionTitle: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nội dung trao đổi & mức đãi ngộ dự kiến
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt chế độ đãi ngộ, thời gian phỏng vấn online/offline tại nhà máy..."
                  value={candidateForm.message}
                  onChange={(e) => setCandidateForm({ ...candidateForm, message: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={candidateSubmitted}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2 font-heading uppercase tracking-wider cursor-pointer"
              >
                {candidateSubmitted ? (
                  <span>Đang gửi thư mời phỏng vấn...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Lời Mời Phỏng Vấn Ngay</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL POST (POST JOB / POST TALENT PROFILE) */}
      {/* ========================================================================= */}
      {postModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95">
            <button
              onClick={() => setPostModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                Cổng Dịch Vụ Nhân Lực KCN
              </div>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                {activeTab === 'jobs' ? 'Đăng Tin Tuyển Dụng Nhà Máy' : 'Đăng Hồ Sơ Ứng Viên Nổi Bật'}
              </h3>
              <p className="text-xs text-slate-500">
                Tiếp cận hơn 50.000+ hồ sơ kỹ sư và 620+ nhà máy FDI trong chuỗi cung ứng
              </p>
            </div>

            <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs text-blue-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-[#0052cc]">
                <ShieldCheck className="w-4 h-4" />
                Quyền Lợi Doanh Nghiệp & Ứng Viên Chuỗi Cung Ứng
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11.5px]">
                <li>Đăng tin miễn phí tiếp cận toàn bộ mạng lưới 18 pha kỹ thuật</li>
                <li>Tự động bóc tách DISC Profile & gắn thẻ Khu Công Nghiệp</li>
                <li>Nhận thông báo phản hồi trực tiếp qua Email & Hotline hỗ trợ 24/7</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setPostModal(false);
                  alert('Vui lòng liên hệ Hotline B2B: 1900 8686 hoặc gửi email: hr-partners@chuoicungung.com để được hỗ trợ đăng tin & kích hoạt tài khoản miễn phí!');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-2 font-heading uppercase tracking-wider cursor-pointer"
              >
                <span>Liên Hệ Hỗ Trợ Đăng Tin Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. NUMEROLOGY & DISC MODAL (CANDIDATE & RECRUITER CAREER AI MATCHING) */}
      {/* ========================================================================= */}
      <NumerologyModal
        isOpen={numerologyModal.isOpen}
        onClose={() => setNumerologyModal({ isOpen: false, tab: 'candidate' })}
        initialTab={numerologyModal.tab}
      />

      {/* ========================================================================= */}
      {/* 8. SMART CV & RECRUITMENT MATCHING MODAL (UPLOAD CV & POST JOB MATCHING) */}
      {/* ========================================================================= */}
      <CVAnalysisAndMatchingModal
        isOpen={cvMatchingModal.isOpen}
        onClose={() => setCvMatchingModal({ ...cvMatchingModal, isOpen: false })}
        initialMode={cvMatchingModal.mode}
        onApplyJob={(jobId) => {
          console.log("Applied to job:", jobId);
        }}
        onConnectCandidate={(candId) => {
          console.log("Connected to candidate:", candId);
        }}
      />

    </div>
  );
}
