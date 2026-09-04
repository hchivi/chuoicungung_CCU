import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, Download, FileText, Building2, 
  Factory, Users, ShieldCheck, MapPin, Sparkles, ChevronRight,
  HelpCircle, PlusCircle, Check
} from 'lucide-react';
import { stagesData, enterprisesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function PhaseDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const phaseId = id || "1.2";
  
  // Find phase across all stages
  let currentStage = stagesData[0];
  let currentPhase = stagesData[0].phases[1];

  for (const s of stagesData) {
    const found = s.phases.find(p => p.id === phaseId);
    if (found) {
      currentStage = s;
      currentPhase = found;
      break;
    }
  }

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: lang === 'en' ? 'OVERVIEW' : 'TỔNG QUAN' },
    { id: 'demands', label: lang === 'en' ? 'COMMON DEMANDS' : 'NHU CẦU THƯỜNG GẶP' },
    { id: 'suppliers', label: lang === 'en' ? 'SUPPLIERS' : 'NHÀ CUNG ỨNG' },
    { id: 'associations', label: lang === 'en' ? 'ASSOCIATIONS' : 'HỘI / HIỆP ĐỒNG HÀNH' },
    { id: 'documents', label: lang === 'en' ? 'DOCUMENTS & FORMS' : 'TÀI LIỆU & BIỂU MẪU' },
    { id: 'casestudy', label: lang === 'en' ? 'CASE STUDIES' : 'CASE STUDY' },
  ];

  // Stage Color Theme Map
  const stageThemes = {
    1: { bgPage: "from-[#fbf8ff] via-[#f7f0fe] to-[#eee2fc]/40", badge: "bg-purple-100 text-purple-900 border-purple-200", btn: "bg-purple-600 hover:bg-purple-700 text-white" },
    2: { bgPage: "from-[#f0fdf4] via-[#e6fbf0] to-[#d1f7e3]/40", badge: "bg-emerald-100 text-emerald-900 border-emerald-200", btn: "bg-emerald-600 hover:bg-emerald-700 text-white" },
    3: { bgPage: "from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]/40", badge: "bg-orange-100 text-orange-900 border-orange-200", btn: "bg-orange-600 hover:bg-orange-700 text-white" },
    4: { bgPage: "from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]/40", badge: "bg-sky-100 text-sky-900 border-sky-200", btn: "bg-blue-600 hover:bg-blue-700 text-white" },
    5: { bgPage: "from-[#fefce8] via-[#fef9c3] to-[#fef08a]/40", badge: "bg-amber-100 text-amber-950 border-amber-200", btn: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black" },
    6: { bgPage: "from-[#fef2f2] via-[#fee2e2] to-[#fecaca]/40", badge: "bg-red-100 text-red-900 border-red-200", btn: "bg-red-600 hover:bg-red-700 text-white" },
  };

  const theme = stageThemes[currentStage.id] || stageThemes[1];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgPage} space-y-10 pb-24 pt-6 transition-all duration-300 font-sans`}>
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2 flex-wrap">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <Link to="/ban-do-6-giai-doan" className="hover:text-blue-600 font-medium">{lang === 'en' ? '6-Stage Map' : 'Bản đồ 6 giai đoạn'}</Link>
          <span>&gt;</span>
          <Link to={`/giai-doan/${currentStage.id}`} className="hover:text-blue-600 font-medium">
            {lang === 'en' ? `Stage 0${currentStage.id}: ${currentStage.titleEn || currentStage.title}` : `Giai đoạn 0${currentStage.id}: ${currentStage.title}`}
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-slate-900 font-heading uppercase">
            {lang === 'en' ? `Phase ${currentPhase.id} – ${currentPhase.titleEn || currentPhase.title}` : `Pha ${currentPhase.id} – ${currentPhase.title}`}
          </span>
        </div>

        {/* Header Main Card with illustration background */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          
          {/* Subtle Ambient Background Illustration */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center opacity-10 pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url('/stage${currentStage.id}_bg.jpg')` }}
          ></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Left Header info */}
            <div className="lg:col-span-8 space-y-4">
              <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${theme.badge}`}>
                {lang === 'en' ? `STAGE 0${currentStage.id} • ${currentStage.titleEn || currentStage.title}` : `GIAI ĐOẠN 0${currentStage.id} • ${currentStage.title}`}
              </span>

              <div className="flex items-baseline space-x-3">
                <span 
                  style={{ color: currentStage.color }}
                  className="text-3xl sm:text-4xl font-black font-mono"
                >
                  {currentPhase.id}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-heading">
                  {lang === 'en' ? (currentPhase.titleEn || currentPhase.title) : currentPhase.title}
                </h1>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
                {lang === 'en' ? (currentPhase.summaryEn || currentPhase.summary) : currentPhase.summary}
              </p>

              {/* 4 Metric Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block font-heading">{lang === 'en' ? 'Stage' : 'Giai đoạn'}</span>
                  <strong className="text-sm font-bold text-slate-800">GD 0{currentStage.id}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block font-heading">{lang === 'en' ? 'Phase Order' : 'Thứ tự pha'}</span>
                  <strong className="text-sm font-bold text-slate-800">{lang === 'en' ? `Phase ${currentPhase.id}` : `Pha ${currentPhase.id}`}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block font-heading">{lang === 'en' ? 'Timing' : 'Thời điểm'}</span>
                  <strong className="text-sm font-bold text-emerald-600">{lang === 'en' ? 'Right on Schedule' : 'Đúng thời điểm'}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block font-heading">{lang === 'en' ? 'Suppliers' : 'Nhà cung ứng'}</span>
                  <strong className="text-sm font-bold text-blue-600">{currentPhase.totalEnterprises || 150}+ {lang === 'en' ? 'Suppliers' : 'DN'}</strong>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  to="/dang-nhu-cau"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 font-heading"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{lang === 'en' ? `Post Demand for Phase ${currentPhase.id}` : `Đăng nhu cầu cho Pha ${currentPhase.id}`}</span>
                </Link>

                <Link
                  to={`/doanh-nghiep?phase=${currentPhase.id}`}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 font-heading"
                >
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>{lang === 'en' ? `Find Suppliers (${currentPhase.totalEnterprises || '150+'})` : `Tìm nhà cung ứng (${currentPhase.totalEnterprises || '150+'})`}</span>
                </Link>
              </div>
            </div>

            {/* Right Stage & Phase Navigator */}
            <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <span className="text-xs font-black uppercase text-slate-400 block tracking-wider font-heading">
                {lang === 'en' ? `3 PHASES IN STAGE 0${currentStage.id}` : `3 PHA TRONG GIAI ĐOẠN 0${currentStage.id}`}
              </span>
              <div className="space-y-2">
                {currentStage.phases.map(p => (
                  <Link
                    key={p.id}
                    to={`/pha/${p.id}`}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition ${
                      p.id === currentPhase.id
                        ? 'bg-white text-blue-600 border-blue-500 shadow-xs'
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span 
                        style={{ backgroundColor: currentStage.color }}
                        className="w-5 h-5 rounded-md text-white flex items-center justify-center text-[10px] font-mono"
                      >
                        {p.id}
                      </span>
                      <span>{lang === 'en' ? (p.titleEn || p.title) : p.title}</span>
                    </div>
                    {p.id === currentPhase.id && <Check className="w-4 h-4 text-blue-600" />}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 pt-4 scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition uppercase font-heading ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            
            {/* 1. Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                
                {/* Công việc chính & Nhu cầu thường gặp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 uppercase font-heading flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                      {lang === 'en' ? 'Core Phase Deliverables & Workstreams' : 'Hạng mục công việc chính'}
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                      {currentPhase.tasks?.map((t, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2.5 mt-2 flex-shrink-0"></span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 uppercase font-heading flex items-center">
                      <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                      {lang === 'en' ? 'Frequently Sourced Demands' : 'Nhu cầu thường gặp'}
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                      {currentPhase.commonDemands?.map((d, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5 mt-2 flex-shrink-0"></span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Checklist đầu ra */}
                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-3">
                  <h3 className="text-base font-bold text-emerald-950 uppercase font-heading">
                    {lang === 'en' ? `Phase ${currentPhase.id} Key Deliverables Checklist` : `Kết quả đầu ra của Pha ${currentPhase.id}`}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-emerald-900 font-medium">
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      ✓ {lang === 'en' ? 'Technical Acceptance Report' : 'Báo cáo nghiệm thu kỹ thuật'}
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      ✓ {lang === 'en' ? 'Permits & Regulatory Approvals' : 'Giấy phép & Hồ sơ phê duyệt'}
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      ✓ {lang === 'en' ? 'Ready Supplier Network Directory' : 'Danh mục đối tác cung ứng sẵn sàng'}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Other tabs fallback */}
            {activeTab !== 'overview' && (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                <p className="text-sm font-semibold text-slate-600">
                  {lang === 'en' ? 'Deep-dive data for:' : 'Dữ liệu chuyên sâu cho mục:'} <strong>{tabs.find(t => t.id === activeTab)?.label}</strong>
                </p>
                <Link
                  to="/doanh-nghiep"
                  className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 font-heading"
                >
                  {lang === 'en' ? 'View matched suppliers list →' : 'Xem danh sách nhà cung ứng liên quan →'}
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
