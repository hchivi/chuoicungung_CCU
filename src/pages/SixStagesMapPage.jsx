import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Layers, ArrowRight, CheckCircle2, ChevronRight, Sparkles, 
  Building2, Factory, Users, ShieldCheck, MapPin, Search, Compass,
  FolderOpen, Zap, Landmark, Award, FileText, Check, Download,
  Activity, ArrowUpRight, HelpCircle, Send, Bot, Filter, SlidersHorizontal,
  ChevronDown, ChevronUp, RotateCcw, Calendar, CheckCircle, Tag
} from 'lucide-react';
import { 
  MASTER_SIX_STAGES, 
  getStageRealMetrics, 
  STAGE_DIAGNOSIS_OPTIONS,
  getStageSuppliers,
  getStagePrograms,
  slugify 
} from '../data/sixStagesData';
import { useLanguage } from '../contexts/LanguageContext';
import { getEnterpriseAvatarImage } from '../utils/companyUtils';

export default function SixStagesMapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  // Active Stage selection (1 to 6)
  const [selectedStageId, setSelectedStageId] = useState(() => {
    const fromUrl = parseInt(searchParams.get('stage') || '1');
    return (fromUrl >= 1 && fromUrl <= 6) ? fromUrl : 1;
  });

  // Active Category filter within selected stage (drilldown)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);

  // Diagnosis Modal / Section State
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [diagnosedStage, setDiagnosedStage] = useState(null);

  // SUPPI Context Modal
  const [isSuppiOpen, setIsSuppiOpen] = useState(false);
  const [suppiQuery, setSuppiQuery] = useState('');
  const [suppiResponse, setSuppiResponse] = useState(null);

  const selectedStage = useMemo(() => {
    return MASTER_SIX_STAGES.find(s => s.id === selectedStageId) || MASTER_SIX_STAGES[0];
  }, [selectedStageId]);

  // Stage Metrics map
  const stageMetrics = useMemo(() => {
    const map = {};
    MASTER_SIX_STAGES.forEach(s => {
      map[s.id] = getStageRealMetrics(s.id);
    });
    return map;
  }, []);

  // Mapped Suppliers for selected Stage and Category
  const stageSuppliers = useMemo(() => {
    return getStageSuppliers(selectedStageId, selectedCategorySlug);
  }, [selectedStageId, selectedCategorySlug]);

  // Mapped Programs
  const stagePrograms = useMemo(() => {
    return getStagePrograms(selectedStageId);
  }, [selectedStageId]);

  // Drilldown scroll reference
  const drillDownRef = useRef(null);

  // SEO Setup
  useEffect(() => {
    document.title = "Bản Đồ 6 Giai Đoạn Chuỗi Cung Ứng | CHUOICUNGUNG.COM";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Khám phá nhu cầu, chuyên mục, nhà cung ứng và chương trình theo 6 giai đoạn trong vòng đời của nhà máy.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = "https://chuoicungung.com/ban-do-6-giai-doan";

    const scriptId = 'six-stages-map-jsonld';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Bản Đồ 6 Giai Đoạn Chuỗi Cung Ứng",
      "url": "https://chuoicungung.com/ban-do-6-giai-doan",
      "description": "Bản đồ điều hướng 6 giai đoạn vòng đời công nghiệp",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://chuoicungung.com/" },
          { "@type": "ListItem", "position": 2, "name": "Bản đồ 6 giai đoạn", "item": "https://chuoicungung.com/ban-do-6-giai-doan" }
        ]
      }
    });
  }, []);

  const handleStageSelect = (stageId) => {
    setSelectedStageId(stageId);
    setSelectedCategorySlug(null);
  };

  const handleStageCardClick = (stageId) => {
    handleStageSelect(stageId);
    if (drillDownRef.current) {
      drillDownRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDiagnose = (opt) => {
    setDiagnosedStage(opt.stageId);
    setSelectedStageId(opt.stageId);
    setSelectedCategorySlug(null);
    setIsDiagnosisOpen(false);
    if (drillDownRef.current) {
      drillDownRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskSuppi = (promptText) => {
    const q = promptText || `Tư vấn nhà cung ứng cho ${selectedStage.name}`;
    setSuppiQuery(q);
    setIsSuppiOpen(true);

    setSuppiResponse({
      title: `SUPPI Đang Phân Tích Nhu Cầu Cho: ${selectedStage.name}`,
      text: `Dựa trên vòng đời nhà máy tại Giai đoạn ${selectedStage.id}, hệ thống đang kết nối với ${stageMetrics[selectedStage.id]?.supplierCount || 0} nhà cung ứng đạt chuẩn.`,
      stageId: selectedStage.id,
      stageName: selectedStage.name
    });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-24 font-sans text-slate-900 antialiased space-y-12">
      
      {/* Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">

        {/* =========================================================================
            SECTION 01 — HERO
           ========================================================================= */}
        <section className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold tracking-wide">
            <Layers className="w-3.5 h-3.5" />
            <span>HỆ THỐNG ĐIỀU HƯỚNG TRỌNG TÂM • CHUOICUNGUNG.COM</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-tight">
              BẢN ĐỒ 6 GIAI ĐOẠN CHUỖI CUNG ỨNG
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Khám phá nhu cầu, nguồn cung và chương trình theo từng giai đoạn trong vòng đời của nhà máy.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsDiagnosisOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm flex items-center space-x-2 transition hover:-translate-y-0.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>XÁC ĐỊNH GIAI ĐOẠN CỦA TÔI</span>
            </button>

            <button
              onClick={() => {
                const draftId = `req-${Date.now()}`;
                localStorage.setItem('ccu_current_requirement_draft', JSON.stringify({
                  id: draftId,
                  stageId: selectedStage.id,
                  stageName: selectedStage.name,
                  sourcePage: 'SIX_STAGES_MAP'
                }));
                navigate(`/dang-nhu-cau?draft=${draftId}`);
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-2xl border border-slate-200 flex items-center space-x-2 transition cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-600" />
              <span>ĐĂNG NHU CẦU</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02 — VISUAL 6 GIAI ĐOẠN (LIGHTWEIGHT SVG & CSS TIMELINE)
           ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              VÒNG ĐỜI 6 GIAI ĐOẠN PHÁT TRIỂN NHÀ MÁY
            </h2>
            <span className="text-[11px] text-blue-600 font-bold font-mono">
              Đang chọn: Giai đoạn {selectedStage.id}
            </span>
          </div>

          {/* Desktop Interactive Stepper Timeline (Lightweight CSS/SVG, NO WebGL) */}
          <div className="hidden lg:grid grid-cols-6 gap-3 pt-2">
            {MASTER_SIX_STAGES.map((s) => {
              const isSelected = s.id === selectedStageId;
              const metrics = stageMetrics[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => handleStageSelect(s.id)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 relative border cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.02]'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      style={{ backgroundColor: s.color }}
                      className="w-7 h-7 rounded-xl text-white text-xs font-black flex items-center justify-center font-mono shadow-2xs"
                    >
                      {s.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {metrics?.categoryCount || 0} nhóm
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-xs font-bold font-heading line-clamp-2 leading-snug ${
                      isSelected ? 'text-blue-900 font-black' : 'text-slate-800'
                    }`}>
                      {s.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {s.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">{metrics?.supplierCount || 0} NCC</span>
                    {isSelected && <span className="text-blue-600 font-bold">● Active</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Horizontal Carousel */}
          <div className="lg:hidden flex space-x-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
            {MASTER_SIX_STAGES.map((s) => {
              const isSelected = s.id === selectedStageId;
              return (
                <button
                  key={s.id}
                  onClick={() => handleStageSelect(s.id)}
                  className={`px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold border transition shrink-0 flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    {s.id}
                  </span>
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 03 — 6 STAGE CARDS GRID
           ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              TỔNG QUAN 6 GIAI ĐOẠN & NGUỒN CUNG
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Bản đồ dữ liệu thực tế
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MASTER_SIX_STAGES.map((stage) => {
              const isSelected = stage.id === selectedStageId;
              const metrics = stageMetrics[stage.id];

              return (
                <div
                  key={stage.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-lg ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span 
                          style={{ backgroundColor: stage.color }}
                          className="w-8 h-8 rounded-xl text-white font-mono font-black text-sm flex items-center justify-center shadow-2xs"
                        >
                          {stage.id}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">GIAI ĐOẠN {stage.id}</span>
                          <h3 className="text-base font-black text-slate-950 font-heading leading-tight">
                            {stage.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {stage.shortDescription}
                    </p>

                    {/* Main Need Groups */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Nhóm nhu cầu trọng tâm:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.needGroups.map((ng) => (
                          <span 
                            key={ng.id} 
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-medium"
                          >
                            {ng.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Real Data Metrics (No hardcoding) */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <div className="text-xs font-black text-slate-900 font-mono">{metrics?.categoryCount || 0}</div>
                        <div className="text-[9px] text-slate-400 font-medium">Chuyên mục</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <div className="text-xs font-black text-blue-600 font-mono">{metrics?.supplierCount || 0}</div>
                        <div className="text-[9px] text-slate-400 font-medium">Nhà cung ứng</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <div className="text-xs font-black text-emerald-600 font-mono">{metrics?.programCount || 0}</div>
                        <div className="text-[9px] text-slate-400 font-medium">Chương trình</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleStageCardClick(stage.id)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Xem Giai Đoạn {stage.id}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 04 — DRILL-DOWN: GIAI ĐOẠN → NHÓM NHU CẦU → CATEGORY → KEYWORDS
           ========================================================================= */}
        <section 
          ref={drillDownRef}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8 scroll-mt-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 font-mono">
                <span>GIAI ĐOẠN {selectedStage.id}: {selectedStage.name.toUpperCase()}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                CÂY PHÂN TÁCH NHU CẦU & CHUYÊN MỤC LIÊN QUAN
              </h2>
              <p className="text-xs text-slate-500">
                Click vào Chuyên mục hoặc Từ khóa để chuyển trực tiếp đến trang sourcing tương ứng.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAskSuppi()}
                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Hỏi SUPPI về giai đoạn này</span>
              </button>
            </div>
          </div>

          {/* Drill-down Hierarchy Tree */}
          <div className="space-y-6">
            {selectedStage.needGroups.map((ng) => (
              <div 
                key={ng.id} 
                className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
                      PHA {ng.phaseId}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading pt-1">
                      {ng.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal">
                      {ng.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Categories & Child Keywords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {ng.categories.map((cat, cIdx) => {
                    const isCatSelected = selectedCategorySlug === cat.slug;
                    return (
                      <div 
                        key={cIdx} 
                        className={`p-4 bg-white rounded-2xl border transition-all space-y-3 ${
                          isCatSelected
                            ? 'border-blue-500 ring-1 ring-blue-400 shadow-sm'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/nganh-nghe/${cat.slug}`}
                            className="font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition flex items-center space-x-1.5 font-heading"
                          >
                            <span>{cat.name}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          </Link>

                          <button
                            onClick={() => setSelectedCategorySlug(isCatSelected ? null : cat.slug)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700"
                          >
                            {isCatSelected ? 'Bỏ lọc' : 'Lọc NCC'}
                          </button>
                        </div>

                        {/* Keyword Chips */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Nhu cầu / Từ khóa con:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.keywords.map((kw, kIdx) => (
                              <Link
                                key={kIdx}
                                to={`/tu-khoa/${slugify(kw)}`}
                                className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[10px] rounded border border-slate-200 transition"
                              >
                                {kw}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 05 — NHÀ CUNG ỨNG LIÊN QUAN (REUSE SUPPLIER SEARCH)
           ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                NHÀ CUNG ỨNG TRONG GIAI ĐOẠN {selectedStage.id}
              </h2>
              <p className="text-xs text-slate-500">
                {selectedCategorySlug 
                  ? `Đang lọc theo chuyên mục: ${selectedCategorySlug}` 
                  : `Hiển thị các xưởng và nhà sản xuất đạt chuẩn phục vụ Giai đoạn ${selectedStage.id}`}
              </p>
            </div>

            {selectedCategorySlug && (
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xem tất cả trong giai đoạn</span>
              </button>
            )}
          </div>

          {stageSuppliers.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-3xl border border-slate-200 space-y-2">
              <p className="text-xs text-slate-500">Đang cập nhật thêm nhà cung ứng cho chuyên mục này.</p>
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Xem toàn bộ giai đoạn
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {stageSuppliers.map((ent) => {
                const entId = ent.id || ent._id || ent.taxCode || ent.name;
                const detailUrl = `/doanh-nghiep/${ent.id || ent._id}`;

                return (
                  <div
                    key={entId}
                    className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-lg transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-0.5 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center">
                          <img 
                            src={getEnterpriseAvatarImage(ent)} 
                            alt={ent.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/logo_only.png";
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md font-mono">
                              📍 {ent.province || 'Toàn quốc'}
                            </span>
                            {ent.isVerified && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md flex items-center space-x-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>

                          <Link
                            to={detailUrl}
                            className="font-bold text-xs sm:text-[13px] text-slate-950 hover:text-blue-600 transition line-clamp-2 font-heading leading-tight"
                            title={ent.name}
                          >
                            {ent.name}
                          </Link>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-800">
                          <Tag className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">{ent.category || ent.industry || selectedStage.name}</span>
                        </div>
                        {ent.address && (
                          <div className="flex items-start space-x-1.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{ent.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          const draftId = `req-${Date.now()}`;
                          localStorage.setItem('ccu_current_requirement_draft', JSON.stringify({
                            id: draftId,
                            stageId: selectedStage.id,
                            stageName: selectedStage.name,
                            preferredSupplierId: ent.id,
                            preferredSupplierName: ent.name,
                            sourcePage: 'SIX_STAGES_MAP'
                          }));
                          navigate(`/dang-nhu-cau?draft=${draftId}`);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        Gửi yêu cầu
                      </button>

                      <Link
                        to={detailUrl}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center space-x-1"
                      >
                        <span>Xem hồ sơ</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 06 — CHƯƠNG TRÌNH LIÊN QUAN (FROM REAL DATA)
           ========================================================================= */}
        {stagePrograms.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                  CHƯƠNG TRÌNH KẾT NỐI PHÙ HỢP VỚI GIAI ĐOẠN {selectedStage.id}
                </h3>
              </div>
              <Link to="/chuong-trinh" className="text-xs font-bold text-blue-600 hover:underline">
                Xem tất cả sự kiện
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stagePrograms.map(prog => (
                <div key={prog.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-700 font-mono">{prog.time}</span>
                    <h4 className="text-xs font-bold text-slate-900 font-heading line-clamp-2">{prog.title}</h4>
                    <p className="text-[11px] text-slate-500">{prog.location}</p>
                  </div>
                  <Link
                    to="/ngay-hoi-chuoi-cung-ung"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl text-center transition"
                  >
                    Đăng ký tham gia
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* =========================================================================
          SECTION 08 — XÁC ĐỊNH GIAI ĐOẠN CỦA TÔI (DIAGNOSIS MODAL)
         ========================================================================= */}
      {isDiagnosisOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Nhà máy hiện đang ở trạng thái nào?
                </h3>
              </div>
              <button 
                onClick={() => setIsDiagnosisOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Chọn hiện trạng thực tế của dự án để hệ thống tự động định vị Giai đoạn và gợi ý nhóm nhu cầu tương ứng:
            </p>

            <div className="space-y-2.5">
              {STAGE_DIAGNOSIS_OPTIONS.map((opt) => (
                <button
                  key={opt.stageId}
                  onClick={() => handleDiagnose(opt)}
                  className="w-full p-3.5 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-200 hover:border-blue-400 text-left transition flex items-start space-x-3 cursor-pointer group"
                >
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono shrink-0">
                    {opt.stageId}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block font-heading">
                      {opt.statusText}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      → {opt.shortHint}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 07 — SUPPI CONTEXT MODAL
         ========================================================================= */}
      {isSuppiOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <Bot className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">Trợ lý Sourcing SUPPI</h3>
                  <p className="text-[11px] text-slate-500">Ngữ cảnh: Giai đoạn {selectedStage.id} - {selectedStage.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSuppiOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {suppiResponse && (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-blue-900">{suppiResponse.title}</div>
                  <p>{suppiResponse.text}</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      const draftId = `req-${Date.now()}`;
                      localStorage.setItem('ccu_current_requirement_draft', JSON.stringify({
                        id: draftId,
                        stageId: selectedStage.id,
                        stageName: selectedStage.name,
                        sourcePage: 'SIX_STAGES_MAP',
                        initialDescription: suppiQuery
                      }));
                      setIsSuppiOpen(false);
                      navigate(`/dang-nhu-cau?draft=${draftId}`);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Tạo Requirement Draft ngay
                  </button>

                  <button
                    onClick={() => {
                      setIsSuppiOpen(false);
                      navigate(`/tro-ly-ai?q=${encodeURIComponent(suppiQuery)}`);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    Mở phiên trò chuyện sâu với SUPPI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 12 — MOBILE STICKY ACTION DOCK (390PX READY)
         ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-blue-700 truncate font-mono">
            Giai đoạn {selectedStage.id}: {selectedStage.name}
          </div>
          <div className="text-xs font-bold text-slate-900">
            {stageMetrics[selectedStage.id]?.supplierCount || 0} nhà cung ứng
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handleAskSuppi()}
            className="px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200"
          >
            Hỏi SUPPI
          </button>

          <button
            onClick={() => {
              const draftId = `req-${Date.now()}`;
              localStorage.setItem('ccu_current_requirement_draft', JSON.stringify({
                id: draftId,
                stageId: selectedStage.id,
                stageName: selectedStage.name,
                sourcePage: 'SIX_STAGES_MAP'
              }));
              navigate(`/dang-nhu-cau?draft=${draftId}`);
            }}
            className="px-3.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Đăng nhu cầu
          </button>
        </div>
      </div>

    </div>
  );
}
