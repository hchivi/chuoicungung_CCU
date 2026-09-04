import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, MapPin, Building2, Calendar, 
  Clock, PlusCircle, ArrowRight, ChevronRight, RotateCcw, 
  DollarSign, CheckCircle2, Sparkles, Award, Users, Eye, 
  Lock, ShieldCheck, Heart, Share2, Layers, Phone, Mail, 
  X, Check, FileText, Send, UserCheck, Flame, Compass, ChevronDown,
  GraduationCap, UserPlus, Star, BadgeCheck, Zap, Brain, User, UploadCloud
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
  const [numerologyFilter, setNumerologyFilter] = useState('all');

  // Numerology Modal state
  const [numerologyModal, setNumerologyModal] = useState({
    isOpen: false,
    tab: 'candidate' // 'candidate' | 'recruiter'
  });

  // Smart CV & Recruitment Matching Modal State (AI & Numerology & Location)
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
                        (j.numerologyHint || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      let matchNumerology = true;
      if (numerologyFilter !== 'all') {
        const num = parseInt(numerologyFilter, 10);
        matchNumerology = (j.idealNumbers || []).includes(num);
      }

      return matchText && matchIndustry && matchProvince && matchLevel && matchSalary && matchNumerology;
    });
  }, [searchTerm, industryFilter, provinceFilter, levelFilter, salaryFilter, numerologyFilter]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return recruitmentCandidatesData.filter(c => {
      const matchText = (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (c.headline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.degree || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.numerologyTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      let matchNumerology = true;
      if (numerologyFilter !== 'all') {
        const num = parseInt(numerologyFilter, 10);
        matchNumerology = c.lifePathNumber === num;
      }

      return matchText && matchIndustry && matchProvince && matchLevel && matchSalary && matchNumerology;
    });
  }, [searchTerm, industryFilter, provinceFilter, levelFilter, salaryFilter, numerologyFilter]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySubmitted(true);
    setTimeout(() => {
      setApplySubmitted(false);
      setApplyModal({ isOpen: false, job: null });
      alert('Ứng tuyển thành công! Nhà máy / Doanh nghiệp sẽ liên hệ với bạn trong thời gian sớm nhất.');
    }, 1200);
  };

  const handleCandidateConnectSubmit = (e) => {
    e.preventDefault();
    setCandidateSubmitted(true);
    setTimeout(() => {
      setCandidateSubmitted(false);
      setCandidateModal({ isOpen: false, candidate: null });
      alert(`Đã gửi lời mời phỏng vấn đến ứng viên ${candidateModal.candidate?.fullName}! Bộ phận tuyển dụng CCU sẽ kết nối hai bên trong 24h.`);
    }, 1200);
  };

  return (
    <div className="space-y-10 pb-20 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic Industrial Recruitment Visual) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Career Photo with Smooth Gradient Blend */}
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
                {activeTab === 'jobs' ? 'Việc Tìm Người' : 'Người Tìm Việc'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {activeTab === 'jobs' ? 'Kết Nối Nhà Máy & Xưởng Toàn Quốc' : 'Hồ Sơ Chuyên Gia & Kỹ Sư KCN'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {activeTab === 'jobs'
                ? 'Cổng thông tin việc làm chuyên ngành dành riêng cho Kỹ sư sản xuất, Trưởng phòng QA/QC, Chuyên viên XNK Logistics, Thợ kỹ thuật và Lao động tại hơn 400+ Khu Công Nghiệp toàn quốc.'
                : 'Ngân hàng dữ liệu hồ sơ nhân sự kỹ thuật cao, kỹ sư vận hành SMT/CNC, quản lý chuỗi cung ứng và chuyên gia QA/QC may mặc đã xác thực năng lực sẵn sàng nhận việc.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => setPostModal(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{activeTab === 'jobs' ? 'Đăng Tin Tuyển Dụng' : 'Tạo Hồ Sơ Tìm Việc'}</span>
              </button>

              <button
                onClick={() => setNumerologyModal({ isOpen: true, tab: activeTab === 'jobs' ? 'candidate' : 'recruiter' })}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-900/25 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Phân Tích Thần Số Học {activeTab === 'jobs' ? 'Chọn Việc' : 'Chọn Người'}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS & SEGMENTED 2-TAB SWITCHER & FILTER BAR */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20 space-y-4">
        
        {/* 5 Stats Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-[#0052cc] font-mono">{recruitmentStats.totalJobs}</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Việc làm đang tuyển</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-emerald-600 font-mono">{recruitmentStats.totalCandidates}</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Hồ sơ ứng viên KCN</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-indigo-600 font-mono">{recruitmentStats.totalCompanies}</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Nhà máy & DN KCN</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-amber-600 font-mono">{recruitmentStats.totalIndustries}</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Nhóm ngành sản xuất</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md col-span-2 sm:col-span-1">
            <span className="text-xl font-black text-sky-600 font-mono">{recruitmentStats.verifiedPercentage}</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">Xác thực hồ sơ</p>
          </div>
        </div>

        {/* 2-TAB SEGMENTED CONTROLLER (Việc Tìm Người & Người Tìm Việc) */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="grid grid-cols-2 w-full sm:w-auto gap-2">
            <button
              onClick={() => {
                setActiveTab('jobs');
                navigate('/tuyen-dung/viec-tim-nguoi');
              }}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-black font-heading transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-[#0052cc] to-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>VIỆC TÌM NGƯỜI ({recruitmentStats.totalJobs})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('candidates');
                navigate('/tuyen-dung/nguoi-tim-viec');
              }}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-black font-heading transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'candidates'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>NGƯỜI TÌM VIỆC ({recruitmentStats.totalCandidates})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: 'candidate' })}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold font-heading transition flex items-center space-x-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Tải CV Khớp Nhà Máy</span>
            </button>

            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: 'factory' })}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold font-heading transition flex items-center space-x-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Nhà Máy Post Tìm Người</span>
            </button>

            <button
              onClick={() => setNumerologyModal({ isOpen: true, tab: 'candidate' })}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-900 border border-indigo-200/80 rounded-xl text-xs font-bold font-heading transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Thần Số Học Tra Cứu</span>
            </button>
          </div>
        </div>

        {/* PROMINENT NUMEROLOGY & SMART CV MATCHING CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-[#072348] via-[#1e1b4b] to-[#312e81] rounded-3xl p-5 sm:p-6 text-white border border-indigo-500/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10.5px] font-mono font-bold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>TÍNH NĂNG ĐỘT PHÁ • CV AI & INDUSTRIAL NUMEROLOGY MATCHING</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-heading text-white tracking-tight">
              Tải CV Tự Động Phân Tích & Match Nhà Máy Theo Location Bằng Thần Số Học
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Ứng viên tải CV → Tự động tính Con số chủ đạo & Đổ ra danh sách <strong>Logo Nhà Máy</strong> cùng Location. Nhà máy đăng tin → Tự động quét và <strong>Đổ ra Avatar Ứng viên</strong> tương thích cao nhất.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 relative z-10 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: 'candidate' })}
              className="flex-1 sm:flex-none px-4 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs font-heading shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-950" />
              <span>Tải CV & Quét Nhà Máy</span>
            </button>

            <button
              onClick={() => setCvMatchingModal({ isOpen: true, mode: 'factory' })}
              className="flex-1 sm:flex-none px-4 py-3 bg-white hover:bg-slate-100 text-[#072348] font-black rounded-xl text-xs font-heading shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#0052cc]" />
              <span>Nhà Máy Đăng Tin</span>
            </button>
          </div>
        </div>

        {/* Search & Multi-criteria Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'jobs'
                  ? "Tìm vị trí tuyển dụng, tên nhà máy, kỹ năng (VD: Kỹ sư SMT, QA/QC, CNC, Cơ điện, Logistics...)..."
                  : "Tìm ứng viên theo tên, vị trí chuyên môn, kỹ năng kỹ thuật (VD: SMT, QA may mặc, SCADA, Mastercam, VNACCS...)..."
              }
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">Tất cả ngành nghề</option>
              <option value="Cơ khí & Chế tạo">Cơ khí & Chế tạo</option>
              <option value="Điện & Điện tử">Điện & Điện tử</option>
              <option value="Dệt may & Da giày">Dệt may & Da giày</option>
              <option value="Logistics & Kho vận">Logistics & Kho vận</option>
              <option value="Hóa chất & Môi trường">Hóa chất & Môi trường</option>
            </select>

            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
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

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">Tất cả cấp bậc</option>
              <option value="Công nhân / Kỹ thuật viên">Công nhân / Kỹ thuật viên</option>
              <option value="Chuyên viên / Kỹ sư">Chuyên viên / Kỹ sư</option>
              <option value="Trưởng nhóm / Giám sát">Trưởng nhóm / Giám sát</option>
              <option value="Trưởng phòng / Quản lý">Trưởng phòng / Quản lý</option>
            </select>

            <select
              value={numerologyFilter}
              onChange={(e) => setNumerologyFilter(e.target.value)}
              className="bg-purple-50 border border-purple-200 rounded-xl px-3 py-2.5 text-purple-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">🔮 Thần số học (Tất cả)</option>
              <option value="1">Số 1 (Tiên phong & Lãnh đạo)</option>
              <option value="2">Số 2 (Hòa giải & Ngoại giao)</option>
              <option value="3">Số 3 (Sáng tạo & Kaizen)</option>
              <option value="4">Số 4 (Kỷ luật & QA/QC)</option>
              <option value="5">Số 5 (Linh hoạt & Sourcing)</option>
              <option value="6">Số 6 (Trách nhiệm & HSE)</option>
              <option value="7">Số 7 (Nghiên cứu & R&D)</option>
              <option value="8">Số 8 (Điều hành & SCM)</option>
              <option value="9">Số 9 (ESG & Bền vững)</option>
              <option value="11">Số 11 (Trực giác đột phá)</option>
              <option value="22">Số 22 (Kiến tạo vĩ mô)</option>
            </select>

            <div className="flex items-center gap-2 justify-end">
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] flex-1"
              >
                <option value="all">Mức lương</option>
                <option value="under15">&lt; 15 Triệu</option>
                <option value="15to25">15 - 25 Triệu</option>
                <option value="above25">&gt; 25 Triệu</option>
              </select>

              <button 
                onClick={() => { setSearchTerm(''); setIndustryFilter('all'); setProvinceFilter('all'); setLevelFilter('all'); setSalaryFilter('all'); setNumerologyFilter('all'); }}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition shrink-0"
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
      <div id="danh-sach-noi-dung" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2">

        {/* TAB 1: VIỆC TÌM NGƯỜI */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">

            {/* Smart Feature Banner: Tải CV & Tự Động Match Nhà Máy Theo Location */}
            <div className="bg-gradient-to-r from-blue-900 via-[#0047a5] to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-blue-400/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl relative z-10">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10.5px] font-mono font-black uppercase tracking-wider border border-yellow-400/30">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>DÀNH CHO ỨNG VIÊN • AI & THẦN SỐ HỌC CV SCANNER</span>
                </div>
                <h3 className="text-base sm:text-xl font-black font-heading text-white tracking-tight">
                  Tải CV Lên – Tự Động Phân Tích & Đổ Ra Logo Doanh Nghiệp Cùng Location
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Kéo thả tệp CV của bạn để hệ thống tự động bóc tách kỹ năng, tính Con số chủ đạo (Life Path) và lọc ra danh sách các Nhà máy KCN đang tuyển dụng tương thích cao nhất.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
                <button
                  onClick={() => setCvMatchingModal({ isOpen: true, mode: 'candidate' })}
                  className="w-full sm:w-auto px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm font-heading shadow-md transition flex items-center justify-center space-x-2 cursor-pointer hover:scale-105"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Tải CV & Khớp Lệnh Ngay</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0052cc]" />
                <span>Danh sách vị trí việc làm KCN đang tuyển dụng ({filteredJobs.length})</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Ứng tuyển trực tiếp vào nhà máy, không qua trung gian
              </span>
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
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0">
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

                        <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>

                        {/* Numerology Hint Badge */}
                        {job.numerologyHint && (
                          <div 
                            onClick={() => setNumerologyModal({ isOpen: true, tab: 'candidate' })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-xl text-purple-900 text-xs font-semibold cursor-pointer hover:border-purple-400 transition"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span className="font-heading font-bold text-[11.5px]">{job.numerologyHint}</span>
                            <span className="text-[10px] text-purple-600 underline font-mono ml-1">Kiểm tra ngay →</span>
                          </div>
                        )}

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

                      <div className="lg:self-center shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-2 lg:pt-0">
                        <button
                          onClick={() => setApplyModal({ isOpen: true, job })}
                          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 font-heading uppercase tracking-wider transition group-hover:scale-[1.02]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Nộp Hồ Sơ Ứng Tuyển</span>
                        </button>
                        
                        <span className="text-[11px] text-center text-slate-400 font-medium">
                          Đăng {job.postedDate} • Phản hồi trong 24h
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

            {/* Smart Feature Banner: Nhà Máy Post Tìm Người & Đổ Ra Avatar Ứng Viên */}
            <div className="bg-gradient-to-r from-[#1e1b4b] via-purple-900 to-[#312e81] rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-purple-400/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl relative z-10">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10.5px] font-mono font-black uppercase tracking-wider border border-yellow-400/30">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>DÀNH CHO NHÀ MÁY • AUTO RECRUITMENT MATCHING</span>
                </div>
                <h3 className="text-base sm:text-xl font-black font-heading text-white tracking-tight">
                  Nhà Máy Post Tin Tìm Người – Tự Động Quét & Đổ Ra Avatar Ứng Viên Phù Hợp
                </h3>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  Nhập thông tin vị trí nhà máy cần tuyển dụng, hệ thống AI sẽ tự động phân tích độ tương thích Thần số học và đổ ra danh sách Avatar nhân sự sẵn sàng làm việc tại cùng Location.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
                <button
                  onClick={() => setCvMatchingModal({ isOpen: true, mode: 'factory' })}
                  className="w-full sm:w-auto px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm font-heading shadow-md transition flex items-center justify-center space-x-2 cursor-pointer hover:scale-105"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Post Tin & Quét Avatar Ứng Viên</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>Hồ sơ Chuyên gia & Kỹ sư KCN đang tìm việc ({filteredCandidates.length})</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Hồ sơ ứng viên đã xác thực bằng cấp & kinh nghiệm thực chiến
              </span>
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
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                              {cand.fullName}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              {cand.industry}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {cand.level}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-blue-700 font-heading mt-0.5">
                            {cand.headline}
                          </p>
                        </div>
                      </div>

                      {/* Numerology Profile Badge */}
                      {cand.numerologyTitle && (
                        <div 
                          onClick={() => setNumerologyModal({ isOpen: true, tab: 'recruiter' })}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/80 rounded-xl text-slate-800 text-xs font-semibold cursor-pointer hover:border-amber-400 transition"
                        >
                          <Brain className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="font-heading font-bold text-[11.5px]">{cand.numerologyTitle}</span>
                          <span className="text-[10px] text-amber-700 underline font-mono ml-1">Đánh giá độ khớp →</span>
                        </div>
                      )}

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

                      {/* Masked Contact Pills */}
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
                        className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 font-heading uppercase tracking-wider transition group-hover:scale-[1.02]"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Liên Hệ Phỏng Vấn</span>
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

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL APPLY CV (JOB SEEKERS APPLYING TO FACTORIES) */}
      {/* ========================================================================= */}
      {applyModal.isOpen && applyModal.job && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setApplyModal({ isOpen: false, job: null })}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
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
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-2 font-heading uppercase tracking-wider"
              >
                {applySubmitted ? (
                  <span>Đang gửi hồ sơ...</span>
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
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
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
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2 font-heading uppercase tracking-wider"
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
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
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
                <li>Tự động gắn thẻ Khu Công Nghiệp & Nhóm ngành nghề liên kết</li>
                <li>Nhận thông báo phản hồi trực tiếp qua Email & Hotline hỗ trợ 24/7</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setPostModal(false);
                  alert('Vui lòng liên hệ Hotline B2B: 1900 8686 hoặc gửi email: hr-partners@chuoicungung.com để được hỗ trợ đăng tin & kích hoạt tài khoản miễn phí!');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-2 font-heading uppercase tracking-wider"
              >
                <span>Liên Hệ Hỗ Trợ Đăng Tin Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. NUMEROLOGY MODAL (CANDIDATE & RECRUITER CAREER AI MATCHING) */}
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
