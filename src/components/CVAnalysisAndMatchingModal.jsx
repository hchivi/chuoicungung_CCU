import React, { useState, useMemo, useEffect } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, Sparkles, Building2, MapPin, 
  DollarSign, Briefcase, Award, ArrowRight, UserCheck, X, RefreshCw, 
  Brain, Zap, ChevronRight, Star, ShieldCheck, Check, Layers, User,
  Calendar, Flame, Send, Eye, Filter, Lock
} from 'lucide-react';
import { 
  calculateLifePathNumber, 
  calculateDestinyNumber, 
  NUMEROLOGY_PROFILES 
} from '../utils/numerology';
import { 
  recruitmentJobsData, 
  recruitmentCandidatesData, 
  sampleCVPresets, 
  sampleJobPresets, 
  matchJobsForCandidate, 
  matchCandidatesForJob 
} from '../data/recruitmentData';
import { useLanguage } from '../contexts/LanguageContext';

export default function CVAnalysisAndMatchingModal({ 
  isOpen, 
  onClose, 
  initialMode = 'candidate', // 'candidate' (Upload CV & Match Factory Logos) | 'factory' (Post Job & Match Candidate Avatars)
  onApplyJob,
  onConnectCandidate
}) {
  const { t, lang } = useLanguage();
  const [activeMode, setActiveMode] = useState(initialMode);

  useEffect(() => {
    if (initialMode) setActiveMode(initialMode);
  }, [initialMode, isOpen]);

  // =========================================================================
  // 1. CANDIDATE MODE STATE (UPLOAD CV & MATCH FACTORIES)
  // =========================================================================
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedCVPreset, setSelectedCVPreset] = useState(sampleCVPresets[0]);
  const [isScanningCV, setIsScanningCV] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: Idle, 1: OCR, 2: Numerology, 3: Location & Skills, 4: Done
  const [candidateProfile, setCandidateProfile] = useState({
    fullName: sampleCVPresets[0].name,
    birthdate: sampleCVPresets[0].birthdate,
    headline: sampleCVPresets[0].headline,
    industry: sampleCVPresets[0].industry,
    location: sampleCVPresets[0].location,
    skills: sampleCVPresets[0].skills,
    experience: sampleCVPresets[0].experience,
    desiredSalary: sampleCVPresets[0].desiredSalary
  });
  const [matchedJobsList, setMatchedJobsList] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Calculate life path for candidate
  const candidateLifePath = useMemo(() => {
    if (!candidateProfile.birthdate) return 7;
    const parts = candidateProfile.birthdate.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      return calculateLifePathNumber(d, m, y);
    }
    return 7;
  }, [candidateProfile.birthdate]);

  const candidateNumerologyProfile = useMemo(() => {
    return NUMEROLOGY_PROFILES[candidateLifePath] || NUMEROLOGY_PROFILES[7];
  }, [candidateLifePath]);

  // Run initial match for candidate on mount or preset change
  useEffect(() => {
    const results = matchJobsForCandidate({
      ...candidateProfile,
      lifePathNumber: candidateLifePath
    }, recruitmentJobsData);
    setMatchedJobsList(results);
  }, [candidateProfile, candidateLifePath]);

  // Handle Preset Load
  const handleSelectCVPreset = (preset) => {
    setSelectedCVPreset(preset);
    setUploadedFile({ name: preset.cvFileName, size: '1.8 MB' });
    setIsScanningCV(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 500);
    setTimeout(() => setScanStep(3), 1000);
    setTimeout(() => {
      setCandidateProfile({
        fullName: preset.name,
        birthdate: preset.birthdate,
        headline: preset.headline,
        industry: preset.industry,
        location: preset.location,
        skills: preset.skills,
        experience: preset.experience,
        desiredSalary: preset.desiredSalary
      });
      setScanStep(4);
      setIsScanningCV(false);
    }, 1500);
  };

  // Handle File Upload Simulation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsScanningCV(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);
    setTimeout(() => {
      // Pick dynamic matched profile based on file name or default
      const randomPreset = sampleCVPresets[Math.floor(Math.random() * sampleCVPresets.length)];
      setCandidateProfile({
        fullName: randomPreset.name,
        birthdate: randomPreset.birthdate,
        headline: randomPreset.headline,
        industry: randomPreset.industry,
        location: randomPreset.location,
        skills: randomPreset.skills,
        experience: randomPreset.experience,
        desiredSalary: randomPreset.desiredSalary
      });
      setScanStep(4);
      setIsScanningCV(false);
    }, 1800);
  };

  const handleApplySingleJob = (jobId) => {
    setAppliedJobIds(prev => [...prev, jobId]);
    if (onApplyJob) onApplyJob(jobId);
  };

  // =========================================================================
  // 2. FACTORY MODE STATE (POST JOB & MATCH CANDIDATE AVATARS)
  // =========================================================================
  const [selectedJobPreset, setSelectedJobPreset] = useState(sampleJobPresets[0]);
  const [isScanningCandidates, setIsScanningCandidates] = useState(false);
  const [factoryScanStep, setFactoryScanStep] = useState(0);
  const [jobForm, setJobForm] = useState({
    company: sampleJobPresets[0].company,
    title: sampleJobPresets[0].title,
    industry: sampleJobPresets[0].industry,
    location: sampleJobPresets[0].location,
    province: sampleJobPresets[0].province,
    salary: sampleJobPresets[0].salary,
    requiredSkills: sampleJobPresets[0].requiredSkills,
    companyEstablishedYear: sampleJobPresets[0].companyEstablishedYear,
    preferredLifePath: sampleJobPresets[0].preferredLifePath
  });
  const [matchedCandidatesList, setMatchedCandidatesList] = useState([]);
  const [contactedCandidateIds, setContactedCandidateIds] = useState([]);

  // Run initial match for factory job posting
  useEffect(() => {
    const results = matchCandidatesForJob(jobForm, recruitmentCandidatesData);
    setMatchedCandidatesList(results);
  }, [jobForm]);

  // Handle Job Preset Selection
  const handleSelectJobPreset = (preset) => {
    setSelectedJobPreset(preset);
    setIsScanningCandidates(true);
    setFactoryScanStep(1);

    setTimeout(() => setFactoryScanStep(2), 500);
    setTimeout(() => setFactoryScanStep(3), 1000);
    setTimeout(() => {
      setJobForm({
        company: preset.company,
        title: preset.title,
        industry: preset.industry,
        location: preset.location,
        province: preset.province,
        salary: preset.salary,
        requiredSkills: preset.requiredSkills,
        companyEstablishedYear: preset.companyEstablishedYear,
        preferredLifePath: preset.preferredLifePath
      });
      setFactoryScanStep(4);
      setIsScanningCandidates(false);
    }, 1500);
  };

  const handleConnectSingleCandidate = (candId) => {
    setContactedCandidateIds(prev => [...prev, candId]);
    if (onConnectCandidate) onConnectCandidate(candId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 relative max-h-[94vh] flex flex-col animate-in zoom-in-95 overflow-hidden">
        
        {/* =========================================================================
            HEADER & MODE SELECTOR TABS
           ========================================================================= */}
        <div className="bg-gradient-to-r from-[#072348] via-[#0047a5] to-[#4338ca] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-yellow-400 font-mono text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            <span>HỆ THỐNG KHỚP NỐI TUYỂN DỤNG THÔNG MINH (AI & THẦN SỐ HỌC B2B)</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight leading-tight">
                {activeMode === 'candidate' 
                  ? 'Tải CV Lên Hệ Thống & Tự Động Match Nhà Máy Theo Location'
                  : 'Nhà Máy Post Tin Tìm Người & Tự Động Quét Avatar Ứng Viên Phù Hợp'
                }
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1">
                {activeMode === 'candidate'
                  ? 'Công nghệ quét CV trích xuất Kỹ năng, Con số chủ đạo & Đổ ra danh sách Logo Doanh nghiệp cùng Location'
                  : 'Quét toàn bộ kho nhân sự KCN, phân tích độ hợp Thần số học và Đổ ra Avatar ứng viên có tỷ lệ match cao nhất'
                }
              </p>
            </div>

            {/* Mode Switcher Pill */}
            <div className="inline-flex p-1 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setActiveMode('candidate')}
                className={`px-3.5 py-2 rounded-xl text-xs font-heading font-black transition flex items-center space-x-1.5 cursor-pointer ${
                  activeMode === 'candidate'
                    ? 'bg-yellow-400 text-slate-950 shadow-md'
                    : 'text-white hover:text-yellow-200'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>1. Ứng Viên Tải CV</span>
              </button>

              <button
                onClick={() => setActiveMode('factory')}
                className={`px-3.5 py-2 rounded-xl text-xs font-heading font-black transition flex items-center space-x-1.5 cursor-pointer ${
                  activeMode === 'factory'
                    ? 'bg-yellow-400 text-slate-950 shadow-md'
                    : 'text-white hover:text-yellow-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>2. Nhà Máy Đăng Tin</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN BODY (SCROLLABLE)
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* =========================================================================
              MODE 1: ỨNG VIÊN TẢI CV & MATCH LOGO DOANH NGHIỆP THEO LOCATION
             ========================================================================= */}
          {activeMode === 'candidate' && (
            <div className="space-y-6">

              {/* Upload Dropzone & Sample CV Presets */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* Drag & Drop Upload Zone */}
                <div className="lg:col-span-7 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-3xl p-5 sm:p-6 transition flex flex-col items-center justify-center text-center relative group">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                    Kéo thả hoặc Bấm để tải lên CV của bạn (PDF, DOCX, Ảnh)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Hệ thống tự động trích xuất thông tin, tính Con số chủ đạo và lọc việc làm nhà máy theo Location.
                  </p>

                  {uploadedFile && (
                    <div className="mt-3.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Đã nạp tệp: <strong>{uploadedFile.name}</strong></span>
                    </div>
                  )}
                </div>

                {/* Quick Sample CV Presets */}
                <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wide font-heading flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Chọn nhanh CV mẫu trải nghiệm:</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">5 Hồ sơ KCN</span>
                    </div>
                    <div className="space-y-1.5">
                      {sampleCVPresets.map((preset) => {
                        const isSelected = selectedCVPreset.id === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => handleSelectCVPreset(preset)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="font-bold">{preset.name}</span>
                              <span className="text-[11px] opacity-80 block truncate">{preset.headline} (📍 {preset.location})</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                              {preset.location}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scanning Progress Banner */}
              {isScanningCV && (
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black animate-spin">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase font-heading text-yellow-400">
                        {scanStep === 1 && "Đang phân tích định dạng CV & OCR văn bản..."}
                        {scanStep === 2 && "Đang tính toán Con số chủ đạo (Life Path Number)..."}
                        {scanStep === 3 && `Đang quét tọa độ Location & Kỹ năng tại ${candidateProfile.location}...`}
                        {scanStep === 4 && "Hoàn tất! Đang đổ ra danh sách Logo Doanh nghiệp..."}
                      </h4>
                      <p className="text-[11px] text-blue-200">Hệ thống AI đối chiếu tự động với 620+ Nhà máy đối tác KCN</p>
                    </div>
                  </div>
                  <div className="w-24 bg-white/20 h-2 rounded-full overflow-hidden shrink-0">
                    <div 
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${scanStep * 25}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Extracted Profile & Numerology Summary Card */}
              <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/70 rounded-3xl p-5 border border-indigo-100 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-950 font-heading">
                      {candidateProfile.fullName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      {candidateProfile.location}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-600" />
                      {candidateProfile.birthdate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    {candidateProfile.headline} • Kinh nghiệm: {candidateProfile.experience}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {candidateProfile.skills?.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-4 bg-white/90 rounded-2xl p-3.5 border border-indigo-200/80 shadow-xs flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center shrink-0 shadow-md font-mono font-black">
                    <span className="text-[10px] leading-none opacity-80">SỐ</span>
                    <span className="text-xl leading-none">{candidateLifePath}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-black text-purple-900 font-heading truncate">
                      {candidateNumerologyProfile.title}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                      Thế mạnh: {candidateNumerologyProfile.traits}
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  KẾT QUẢ: ĐỔ RA DANH SÁCH LOGO CÁC DOANH NGHIỆP MATCH VỚI CV
                 ========================================================================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide font-heading">
                      DOANH NGHIỆP & NHÀ MÁY PHÙ HỢP NHẤT VỚI CV ({matchedJobsList.length})
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ✓ Ưu tiên khớp theo Location: {candidateProfile.location}
                  </span>
                </div>

                {/* Grid of Matched Enterprise Cards with Prominent Logos */}
                <div className="grid grid-cols-1 gap-3.5">
                  {matchedJobsList.map(({ job, matchScore, reasons }) => {
                    const isApplied = appliedJobIds.includes(job.id);

                    return (
                      <div
                        key={job.id}
                        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                      >
                        {/* Left: Enterprise Logo + Job Title + Location */}
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          
                          {/* Prominent Enterprise Logo */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden shadow-xs flex items-center justify-center group-hover:border-blue-500 transition-colors relative">
                            <img
                              src={job.logo}
                              alt={job.company}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80";
                              }}
                            />
                            {job.isFoundingPartner && (
                              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-white"></span>
                            )}
                          </div>

                          {/* Info Column */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                              <span className="text-xs font-bold text-[#0052cc] hover:underline truncate max-w-xs sm:max-w-md block font-heading">
                                {job.company}
                              </span>
                              {job.isFoundingPartner && (
                                <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase font-mono shadow-2xs">
                                  Founding Partner
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#0052cc] transition line-clamp-1 font-heading">
                              {job.title}
                            </h4>

                            <div className="flex items-center space-x-3 text-xs text-slate-600 flex-wrap gap-y-1">
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1 font-bold text-emerald-600">
                                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                                {job.salary}
                              </span>
                            </div>

                            {/* Match Reasons Badges */}
                            <div className="pt-1.5 flex flex-wrap gap-1.5">
                              {reasons.slice(0, 2).map((r, rIdx) => (
                                <span key={rIdx} className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-medium flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Match Score Indicator & Action Button */}
                        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          
                          {/* Match Score Meter */}
                          <div className="text-left lg:text-right">
                            <div className="flex items-center gap-1.5 lg:justify-end">
                              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">ĐỘ TƯƠNG THÍCH:</span>
                              <span className="text-base sm:text-lg font-black font-mono text-[#0052cc]">
                                {matchScore}%
                              </span>
                            </div>
                            <div className="w-24 sm:w-28 bg-slate-100 h-2 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#0052cc]"
                                style={{ width: `${matchScore}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Quick Apply Button */}
                          <button
                            onClick={() => handleApplySingleJob(job.id)}
                            disabled={isApplied}
                            className={`px-4 py-2 rounded-xl text-xs font-heading font-black transition flex items-center space-x-1.5 cursor-pointer ${
                              isApplied
                                ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                                : 'bg-[#0052cc] hover:bg-[#0041a8] text-white shadow-md hover:scale-105'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Đã nộp CV thành công</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Nộp CV 1-Click</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              MODE 2: NHÀ MÁY POST TIN TÌM NGƯỜI & MATCH AVATAR ỨNG VIÊN
             ========================================================================= */}
          {activeMode === 'factory' && (
            <div className="space-y-6">

              {/* Job Posting Form & Quick Sample Job Presets */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* Form: Nhà máy đăng thông tin tìm người */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-black text-slate-900 uppercase tracking-wide font-heading border-b border-slate-100 pb-2.5">
                    <Building2 className="w-4 h-4 text-[#0052cc]" />
                    <span>THÔNG TIN TUYỂN DỤNG CỦA NHÀ MÁY / DOANH NGHIỆP</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tên Nhà Máy / Doanh Nghiệp Tuyển Dụng:</label>
                      <input
                        type="text"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#0052cc] focus:bg-white"
                        placeholder="VD: Nhà máy Samsung Electronics Việt Nam..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Vị Trí Cần Tuyển Dụng:</label>
                        <input
                          type="text"
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#0052cc] focus:bg-white"
                          placeholder="VD: Kỹ Sư Quản Lý Sản Xuất SMT..."
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Tỉnh Thành / Khu Công Nghiệp:</label>
                        <input
                          type="text"
                          value={jobForm.location}
                          onChange={(e) => {
                            const val = e.target.value;
                            setJobForm({ ...jobForm, location: val, province: val.split(',').pop()?.trim() || val });
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#0052cc] focus:bg-white"
                          placeholder="VD: KCN Yên Phong, Bắc Ninh..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Mức Lương Dự Kiến:</label>
                        <input
                          type="text"
                          value={jobForm.salary}
                          onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#0052cc] focus:bg-white"
                          placeholder="VD: 25 - 35 Triệu..."
                        />
                      </div>

                      <div>
                        <label className="font-bold text-purple-900 block mb-1">Con Số Thần Số Học Ưu Tiên (Nếu có):</label>
                        <select
                          value={jobForm.preferredLifePath}
                          onChange={(e) => setJobForm({ ...jobForm, preferredLifePath: parseInt(e.target.value, 10) })}
                          className="w-full px-3.5 py-2.5 bg-purple-50 border border-purple-200 rounded-xl font-bold text-purple-900 focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="1">Số 1 (Tiên phong & Lãnh đạo)</option>
                          <option value="4">Số 4 (Kỷ luật & QA/QC Chuẩn)</option>
                          <option value="5">Số 5 (Linh hoạt & Đàm phán)</option>
                          <option value="7">Số 7 (R&D & Kỹ thuật chuyên sâu)</option>
                          <option value="8">Số 8 (Quản trị SCM & Điều hành)</option>
                          <option value="9">Số 9 (Bền vững & ESG)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Sample Job Presets */}
                <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wide font-heading flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Chọn tin tuyển dụng mẫu của nhà máy:</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">5 Nhà máy KCN</span>
                    </div>
                    <div className="space-y-1.5">
                      {sampleJobPresets.map((preset) => {
                        const isSelected = selectedJobPreset.id === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => handleSelectJobPreset(preset)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-xs font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="font-bold">{preset.company}</span>
                              <span className="text-[11px] opacity-80 block truncate">{preset.title} (📍 {preset.province})</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                              Số {preset.preferredLifePath}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scanning Candidates Progress Banner */}
              {isScanningCandidates && (
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black animate-spin">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase font-heading text-yellow-400">
                        {factoryScanStep === 1 && "Đang đối chiếu yêu cầu kỹ năng của nhà máy..."}
                        {factoryScanStep === 2 && `Đang quét kho hồ sơ ứng viên tại khu vực ${jobForm.province}...`}
                        {factoryScanStep === 3 && `Đang phân tích Thần số học số ${jobForm.preferredLifePath}...`}
                        {factoryScanStep === 4 && "Hoàn tất! Đang đổ ra danh sách Avatar Ứng viên..."}
                      </h4>
                      <p className="text-[11px] text-purple-200">Hệ thống AI lọc ra các ứng viên có profile và độ tương thích cao nhất</p>
                    </div>
                  </div>
                  <div className="w-24 bg-white/20 h-2 rounded-full overflow-hidden shrink-0">
                    <div 
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${factoryScanStep * 25}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  KẾT QUẢ: ĐỔ RA DANH SÁCH AVATAR NHÂN SỰ ỨNG VỚI TIN POST
                 ========================================================================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide font-heading">
                      DANH SÁCH ỨNG VIÊN PHÙ HỢP NHẤT VỚI TIN TUYỂN DỤNG ({matchedCandidatesList.length})
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    ✓ Phân tích theo Thần số học & Location: {jobForm.province}
                  </span>
                </div>

                {/* Grid of Matched Candidate Cards with Prominent Avatars */}
                <div className="grid grid-cols-1 gap-3.5">
                  {matchedCandidatesList.map(({ candidate, matchScore, reasons }) => {
                    const isContacted = contactedCandidateIds.includes(candidate.id);

                    return (
                      <div
                        key={candidate.id}
                        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-purple-400 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                      >
                        {/* Left: Candidate Avatar + Headline + Location + Numerology */}
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          
                          {/* Prominent Candidate Avatar */}
                          <div className="relative shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden shadow-xs group-hover:border-purple-500 transition-colors">
                              <img
                                src={candidate.avatar}
                                alt={candidate.fullName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                                }}
                              />
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-purple-700 text-white font-mono font-black text-[10px] shadow">
                              SỐ {candidate.lifePathNumber}
                            </div>
                          </div>

                          {/* Info Column */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                              <h4 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                                {candidate.fullName}
                              </h4>
                              {candidate.availableNow && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                  ✓ Sẵn sàng đi làm ngay
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-bold text-purple-900 font-heading line-clamp-1">
                              {candidate.headline}
                            </p>

                            <div className="flex items-center space-x-3 text-xs text-slate-600 flex-wrap gap-y-1">
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                {candidate.location}
                              </span>
                              <span className="flex items-center gap-1 font-medium text-slate-600">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {candidate.experience}
                              </span>
                              <span className="flex items-center gap-1 font-bold text-emerald-600">
                                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                                Mong muốn: {candidate.desiredSalary}
                              </span>
                            </div>

                            {/* Match Reasons Badges */}
                            <div className="pt-1.5 flex flex-wrap gap-1.5">
                              {reasons.slice(0, 2).map((r, rIdx) => (
                                <span key={rIdx} className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200/80 text-purple-800 text-[11px] font-medium flex items-center gap-1">
                                  <Check className="w-3 h-3 text-purple-600" />
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Match Score Indicator & Contact Action Button */}
                        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          
                          {/* Match Score Meter */}
                          <div className="text-left lg:text-right">
                            <div className="flex items-center gap-1.5 lg:justify-end">
                              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">ĐỘ TƯƠNG THÍCH:</span>
                              <span className="text-base sm:text-lg font-black font-mono text-purple-700">
                                {matchScore}%
                              </span>
                            </div>
                            <div className="w-24 sm:w-28 bg-slate-100 h-2 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-purple-600"
                                style={{ width: `${matchScore}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Contact Candidate Button */}
                          <button
                            onClick={() => handleConnectSingleCandidate(candidate.id)}
                            disabled={isContacted}
                            className={`px-4 py-2 rounded-xl text-xs font-heading font-black transition flex items-center space-x-1.5 cursor-pointer ${
                              isContacted
                                ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                                : 'bg-purple-700 hover:bg-purple-800 text-white shadow-md hover:scale-105'
                            }`}
                          >
                            {isContacted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Đã gửi lời mời phỏng vấn</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Mời Phỏng Vấn Ngay</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dữ liệu hồ sơ & thông tin tuyển dụng được bảo mật 100% theo tiêu chuẩn B2B</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
