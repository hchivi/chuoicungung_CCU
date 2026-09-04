import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Calendar, User, Briefcase, Award, CheckCircle2, 
  ArrowRight, ShieldCheck, Star, Compass, RefreshCw, X, 
  Zap, Brain, Target, ChevronRight, Layers, Flame, FileText, Check
} from 'lucide-react';
import { 
  calculateLifePathNumber, 
  calculateDestinyNumber, 
  calculateSoulNumber, 
  calculatePersonalityNumber, 
  calculateRoleMatchScore,
  NUMEROLOGY_PROFILES 
} from '../utils/numerology';
import { recruitmentJobsData, recruitmentCandidatesData } from '../data/recruitmentData';

export default function NumerologyModal({ isOpen, onClose, initialTab = 'candidate', onFilterByNumber }) {
  if (!isOpen) return null;

  // Active Tab: 'candidate' (Chọn Việc) | 'recruiter' (Chọn Người)
  const [activeTab, setActiveTab] = useState(initialTab);

  // Candidate Form State
  const [candidateName, setCandidateName] = useState('Nguyễn Văn Hùng');
  const [birthDay, setBirthDay] = useState(14);
  const [birthMonth, setBirthMonth] = useState(8);
  const [birthYear, setBirthYear] = useState(1992);
  const [hasCalculatedCandidate, setHasCalculatedCandidate] = useState(true);

  // Recruiter Form State
  const [selectedRole, setSelectedRole] = useState('Trưởng Phòng QA/QC Ngành Dệt May & Đồng Phục Cao Cấp');
  const [selectedIndustry, setSelectedIndustry] = useState('Dệt may & Da giày');
  const [recruiterCandidateName, setRecruiterCandidateName] = useState('Trần Thị Thanh Mai');
  const [recruiterBirthDay, setRecruiterBirthDay] = useState(22);
  const [recruiterBirthMonth, setRecruiterBirthMonth] = useState(5);
  const [recruiterBirthYear, setRecruiterBirthYear] = useState(1994);
  const [hasCalculatedRecruiter, setHasCalculatedRecruiter] = useState(true);

  // Candidate Calculation Results
  const candidateResults = useMemo(() => {
    const lifePath = calculateLifePathNumber(birthDay, birthMonth, birthYear);
    const destiny = calculateDestinyNumber(candidateName);
    const soul = calculateSoulNumber(candidateName);
    const personality = calculatePersonalityNumber(candidateName);
    const profile = NUMEROLOGY_PROFILES[lifePath] || NUMEROLOGY_PROFILES[4];

    // Find matched jobs in our real database
    const matchedJobs = recruitmentJobsData.filter(j => 
      (j.idealNumbers || []).includes(lifePath) || profile.recommendedRoles.some(r => j.title.toLowerCase().includes(r.toLowerCase().slice(0, 7)))
    );

    return {
      lifePath,
      destiny,
      soul,
      personality,
      profile,
      matchedJobs: matchedJobs.length > 0 ? matchedJobs : recruitmentJobsData.slice(0, 3)
    };
  }, [candidateName, birthDay, birthMonth, birthYear]);

  // Recruiter Calculation Results
  const recruiterResults = useMemo(() => {
    const lifePath = calculateLifePathNumber(recruiterBirthDay, recruiterBirthMonth, recruiterBirthYear);
    const destiny = calculateDestinyNumber(recruiterCandidateName);
    const profile = NUMEROLOGY_PROFILES[lifePath] || NUMEROLOGY_PROFILES[4];
    const matchScore = calculateRoleMatchScore(lifePath, selectedRole, selectedIndustry);

    return {
      lifePath,
      destiny,
      profile,
      matchScore
    };
  }, [recruiterCandidateName, recruiterBirthDay, recruiterBirthMonth, recruiterBirthYear, selectedRole, selectedIndustry]);

  // Quick preset loader for candidates
  const handleQuickLoadCandidate = (cand) => {
    setRecruiterCandidateName(cand.fullName);
    if (cand.birthdate) {
      const parts = cand.birthdate.split('/');
      if (parts.length === 3) {
        setRecruiterBirthDay(parseInt(parts[0], 10));
        setRecruiterBirthMonth(parseInt(parts[1], 10));
        setRecruiterBirthYear(parseInt(parts[2], 10));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col animate-in zoom-in-95 overflow-hidden">
        
        {/* Header with Mystic Industrial Gradient */}
        <div className="bg-gradient-to-r from-[#072348] via-[#0047a5] to-[#4338ca] text-white p-5 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PYTHAGORAS INDUSTRIAL NUMEROLOGY AI</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading tracking-tight text-white leading-tight">
              Phân Tích Thần Số Học: Chọn Đúng Người – Đặt Đúng Việc
            </h2>
            
            <p className="text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed">
              Ứng dụng nguyên lý Pythagoras & Dữ liệu 18 Pha kỹ thuật để thấu hiểu năng lực cốt lõi, phong cách làm việc và độ tương thích với môi trường Nhà máy & KCN.
            </p>
          </div>

          {/* Subsystem Switcher Tabs */}
          <div className="flex items-center gap-2 mt-5 bg-black/20 p-1.5 rounded-2xl w-fit border border-white/10">
            <button
              onClick={() => setActiveTab('candidate')}
              className={`px-4 py-2 rounded-xl text-xs font-black font-heading transition-all flex items-center space-x-2 ${
                activeTab === 'candidate'
                  ? 'bg-white text-[#072348] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>DÀNH CHO ỨNG VIÊN (CHỌN VIỆC)</span>
            </button>

            <button
              onClick={() => setActiveTab('recruiter')}
              className={`px-4 py-2 rounded-xl text-xs font-black font-heading transition-all flex items-center space-x-2 ${
                activeTab === 'recruiter'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>DÀNH CHO NHÀ MÁY (CHỌN NGƯỜI)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-[#FBFBFC]">

          {/* ========================================================================= */}
          {/* TAB 1: DÀNH CHO ỨNG VIÊN (CHỌN VIỆC HỢP NĂNG LỰC & SỐ CHỦ ĐẠO) */}
          {/* ========================================================================= */}
          {activeTab === 'candidate' && (
            <div className="space-y-6">
              
              {/* Input Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 font-heading uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#0052cc]" />
                  <span>Nhập thông tin để giải mã con số chủ đạo & định hướng nghề nghiệp</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Họ và tên đầy đủ *
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="VD: Nguyễn Văn Hùng"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Ngày / Tháng sinh *
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={birthDay}
                        onChange={(e) => setBirthDay(parseInt(e.target.value, 10))}
                        className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <option key={d} value={d}>Ngày {d < 10 ? `0${d}` : d}</option>
                        ))}
                      </select>

                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(parseInt(e.target.value, 10))}
                        className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                          <option key={m} value={m}>Tháng {m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Năm sinh *
                    </label>
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {Array.from({ length: 50 }, (_, i) => 2006 - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 4 Numerology Indices Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-sm space-y-1 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-200">Số Chủ Đạo (Life Path)</span>
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </div>
                  <div className="text-3xl font-black font-mono">{candidateResults.lifePath}</div>
                  <p className="text-[11px] text-blue-100 font-medium line-clamp-1">{candidateResults.profile.title}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Số Sứ Mệnh (Destiny)</span>
                  <div className="text-2xl font-black font-mono text-[#0052cc]">{candidateResults.destiny}</div>
                  <p className="text-[11px] text-slate-500 font-medium">Năng lực hành động</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Số Linh Hồn (Soul Urge)</span>
                  <div className="text-2xl font-black font-mono text-emerald-600">{candidateResults.soul}</div>
                  <p className="text-[11px] text-slate-500 font-medium">Động lực thôi thúc</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Số Tính Cách (Personality)</span>
                  <div className="text-2xl font-black font-mono text-indigo-600">{candidateResults.personality}</div>
                  <p className="text-[11px] text-slate-500 font-medium">Ấn tượng ngoại giao</p>
                </div>
              </div>

              {/* In-depth Analysis Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#0052cc] uppercase">HỒ SƠ NĂNG LỰC SỐ HỌC</span>
                    <h4 className="text-lg font-black text-slate-900 font-heading">
                      {candidateResults.profile.title} (Con số {candidateResults.lifePath})
                    </h4>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-[#0052cc] rounded-full text-xs font-mono font-bold border border-blue-100">
                    {candidateResults.profile.element}
                  </span>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-slate-700">
                  <p className="font-semibold text-slate-900">
                    🌟 <strong>Phong cách làm việc trong Nhà máy / Xưởng sản xuất:</strong>
                  </p>
                  <p className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700">
                    {candidateResults.profile.workStyle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5 font-heading">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Top Điểm Mạnh Kỹ Thuật & Quản Trị
                    </span>
                    <ul className="space-y-1.5 text-slate-700">
                      {candidateResults.profile.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl space-y-2">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 font-heading">
                      <Zap className="w-4 h-4 text-amber-600" />
                      Lưu Ý Cải Thiện Dưới Áp Lực Tiến Độ
                    </span>
                    <ul className="space-y-1.5 text-slate-700">
                      {candidateResults.profile.challenges.map((ch, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Positions in 6 Stages */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold text-slate-900 font-heading block">
                    🎯 Top Vị Trí Việc Làm Tương Thích Nhất Với Con Số {candidateResults.lifePath}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {candidateResults.profile.recommendedRoles.map((role, idx) => (
                      <div key={idx} className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center space-x-2 text-xs font-bold text-slate-800">
                        <Target className="w-4 h-4 text-[#0052cc] shrink-0" />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matched Job Openings in System */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 font-heading uppercase flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#0052cc]" />
                    <span>Việc làm đang tuyển dụng khớp 100% với Số {candidateResults.lifePath}</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Tự động đối soát yêu cầu kỹ năng</span>
                </div>

                <div className="space-y-2.5">
                  {candidateResults.matchedJobs.map(job => (
                    <div key={job.id} className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-100">
                            Khớp 95%+
                          </span>
                          <span className="text-xs font-bold text-slate-900 font-heading">{job.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{job.company} • {job.location}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-black text-emerald-700 font-mono">{job.salary}</span>
                        <button
                          onClick={() => {
                            onClose();
                            alert(`Đã chọn ứng tuyển vị trí: ${job.title} tại ${job.company}`);
                          }}
                          className="px-3.5 py-1.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold font-heading transition shadow-xs"
                        >
                          Ứng Tuyển
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DÀNH CHO NHÀ MÁY (CHỌN NGƯỜI & ĐÁNH GIÁ ĐỘ TƯƠNG THÍCH) */}
          {/* ========================================================================= */}
          {activeTab === 'recruiter' && (
            <div className="space-y-6">
              
              {/* Recruiter Evaluation Form */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 font-heading uppercase flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-600" />
                    <span>Thiết lập vị trí tuyển dụng & thông tin ứng viên</span>
                  </h3>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    AI Talent Matcher
                  </span>
                </div>

                {/* Quick Select Preset Candidates */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Hoặc chọn nhanh ứng viên từ hệ thống nhân sự KCN:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {recruitmentCandidatesData.map(cand => (
                      <button
                        key={cand.id}
                        onClick={() => handleQuickLoadCandidate(cand)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition ${
                          recruiterCandidateName === cand.fullName
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cand.fullName} ({cand.industry.slice(0, 10)}...)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Vị trí tuyển dụng cần đánh giá *
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                    >
                      {recruitmentJobsData.map(j => (
                        <option key={j.id} value={j.title}>{j.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Nhóm ngành sản xuất *
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Cơ khí & Chế tạo">Cơ khí & Chế tạo</option>
                      <option value="Điện & Điện tử">Điện & Điện tử</option>
                      <option value="Dệt may & Da giày">Dệt may & Da giày</option>
                      <option value="Logistics & Kho vận">Logistics & Kho vận</option>
                      <option value="Hóa chất & Môi trường">Hóa chất & Môi trường</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Họ và tên ứng viên
                    </label>
                    <input
                      type="text"
                      value={recruiterCandidateName}
                      onChange={(e) => setRecruiterCandidateName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Ngày / Tháng sinh
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={recruiterBirthDay}
                        onChange={(e) => setRecruiterBirthDay(parseInt(e.target.value, 10))}
                        className="px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <select
                        value={recruiterBirthMonth}
                        onChange={(e) => setRecruiterBirthMonth(parseInt(e.target.value, 10))}
                        className="px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                          <option key={m} value={m}>Th.{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Năm sinh
                    </label>
                    <select
                      value={recruiterBirthYear}
                      onChange={(e) => setRecruiterBirthYear(parseInt(e.target.value, 10))}
                      className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {Array.from({ length: 50 }, (_, i) => 2006 - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Match Score & Diagnostic Card */}
              <div className="bg-gradient-to-br from-slate-900 to-[#072348] text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                      KẾT QUẢ ĐỐI SOÁT TƯƠNG THÍCH NHÂN SỰ
                    </span>
                    <h3 className="text-xl font-black text-white font-heading">
                      Ứng viên: {recruiterCandidateName}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Số chủ đạo: <strong className="text-amber-300 font-mono text-sm">{recruiterResults.lifePath}</strong> • {recruiterResults.profile.title}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-start sm:self-auto bg-white/10 px-5 py-3 rounded-2xl border border-white/15">
                    <div className="text-right">
                      <span className="text-[10px] text-blue-200 uppercase font-mono block">Chỉ số hòa hợp</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{recruiterResults.matchScore}%</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Recruiter Advice */}
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5 font-heading">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Lời Khuyên Tuyển Dụng & Bố Trí Nhân Sự:
                    </span>
                    <p className="text-slate-200">
                      {recruiterResults.profile.adviceForRecruiter}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] text-slate-300">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <strong className="text-white block mb-1 font-heading">Môi trường làm việc tối ưu:</strong>
                      {recruiterResults.profile.workStyle}
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <strong className="text-white block mb-1 font-heading">Nhóm đối tác hòa hợp cao:</strong>
                      Tương hợp xuất sắc khi phối hợp cùng đồng nghiệp có Số Chủ Đạo: <strong>{recruiterResults.profile.compatibility.join(', ')}</strong>.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0052cc]" />
            <span>Mô hình số học chuẩn Pythagoras tích hợp với tiêu chuẩn vận hành 6 Giai đoạn KCN</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-heading transition"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
}
