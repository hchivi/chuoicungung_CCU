import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, CheckCircle, XCircle, Compass, Layers, Shield, 
  Target, Users, Building2, Factory, ChevronRight, Sparkles, 
  AlertCircle, FileText, CheckCircle2, TrendingUp,
  FolderOpen, MapPin, Filter, ArrowUpRight, Zap, Globe, Ship, DollarSign
} from 'lucide-react';
import HeroLifecycleWheel from '../components/HeroLifecycleWheel';
import NetworkBackground from '../components/NetworkBackground';
import ClickUpBrainSearchBar from '../components/ClickUpBrainSearchBar';
import SupplyChainPipelineFlow from '../components/SupplyChainPipelineFlow';
import InteractiveExplodedFlower3D from '../components/InteractiveExplodedFlower3D';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic real counts
  const kcnCountFormatted = "480+";
  const factoriesCountFormatted = "14.200+";
  const suppliersCountFormatted = "24.000+";

  // Continuous Marquee Sourcing Keywords (like tradeit.global)
  const marqueeKeywordsRow1 = [
    { label: lang === 'en' ? "precision CNC machining" : "gia công cơ khí chính xác", category: "enterprises" },
    { label: lang === 'en' ? "corporate uniforms" : "đồng phục doanh nghiệp", category: "enterprises" },
    { label: lang === 'en' ? "occupational safety PPE" : "bảo hộ lao động", category: "enterprises" },
    { label: lang === 'en' ? "logistics & warehousing" : "logistics & kho bãi", category: "enterprises" },
    { label: lang === 'en' ? "Northern Industrial Parks" : "khu công nghiệp Miền Bắc", category: "industrial_parks" },
    { label: lang === 'en' ? "automation & industrial robotics" : "tự động hóa & robot", category: "enterprises" },
    { label: lang === 'en' ? "corrugated box & packaging" : "đóng gói & thùng carton", category: "enterprises" },
    { label: lang === 'en' ? "HVAC & cleanroom systems" : "thiết bị HVAC & phòng sạch", category: "enterprises" },
    { label: lang === 'en' ? "molds & plastic injection" : "khuôn mẫu & ép nhựa", category: "enterprises" },
    { label: lang === 'en' ? "water treatment & environmental" : "xử lý nước & môi trường", category: "enterprises" },
    { label: lang === 'en' ? "CNC laser cutting & bending" : "cắt laser CNC & chấn gấp", category: "enterprises" },
    { label: lang === 'en' ? "wooden & plastic pallets" : "pallet gỗ & nhựa công nghiệp", category: "enterprises" },
  ];

  const marqueeKeywordsRow2 = [
    { label: lang === 'en' ? "industrial catering service" : "cung ứng suất ăn công nghiệp", category: "enterprises" },
    { label: lang === 'en' ? "pre-engineered steel & factory EPC" : "xây dựng nhà xưởng & thép tiền chế", category: "enterprises" },
    { label: lang === 'en' ? "insulation materials & PU panels" : "vật liệu cách nhiệt & panel PU", category: "enterprises" },
    { label: lang === 'en' ? "surface treatment chemicals" : "hóa chất xử lý bề mặt", category: "enterprises" },
    { label: lang === 'en' ? "forklifts & lifting equipment" : "xe nâng & thiết bị nâng hạ", category: "enterprises" },
    { label: lang === 'en' ? "legal licensing & IP permits" : "tư vấn pháp lý & giấy phép KCN", category: "enterprises" },
    { label: lang === 'en' ? "fire fighting & prevention PCCC" : "phòng cháy chữa cháy PCCC", category: "enterprises" },
    { label: lang === 'en' ? "HVAC mechanical electrical MEP" : "cơ điện lạnh MEP", category: "enterprises" },
    { label: lang === 'en' ? "industrial inverters & panels" : "biến tần & tủ điện công nghiệp", category: "enterprises" },
    { label: lang === 'en' ? "security & facility protection" : "dịch vụ bảo vệ & an ninh KCN", category: "enterprises" },
    { label: lang === 'en' ? "Southern Industrial Parks" : "khu công nghiệp Miền Nam", category: "industrial_parks" },
    { label: lang === 'en' ? "powder coating subcontracting" : "gia công sơn tĩnh điện", category: "enterprises" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      navigate('/ban-do-6-giai-doan');
      return;
    }
    
    // Redirect based on selected category or search across directory
    if (searchCategory === 'enterprises') {
      navigate(`/doanh-nghiep?q=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'factories') {
      navigate(`/nha-may?q=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'industrial_parks') {
      navigate(`/khu-cong-nghiep?q=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'associations') {
      navigate(`/hoi-hiep-hoi?q=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'stages') {
      navigate(`/ban-do-6-giai-doan?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/doanh-nghiep?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTagClick = (tagLabel, category) => {
    setSearchQuery(tagLabel);
    if (category === 'industrial_parks') {
      navigate(`/khu-cong-nghiep?q=${encodeURIComponent(tagLabel)}`);
    } else {
      navigate(`/doanh-nghiep?q=${encodeURIComponent(tagLabel)}`);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-slate-50/50 font-sans">
      
      {/* 1. HERO SECTION (CONTAINERIZED ARTISTIC CRYSTAL POSTER CARD WITH INTERACTIVE NETWORK) */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-10 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/50 border-b border-slate-200/80">
        
        {/* Interactive Neural Network Background Canvas (Restored from Image 1) */}
        <NetworkBackground />

        {/* Soft Background Canvas Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-blue-100/20 via-indigo-50/30 to-teal-50/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Floating Trust Metrics Chips on Outer Canvas */}
        <div className="hidden 2xl:block absolute top-10 left-8 z-10 pointer-events-none">
          <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md space-y-1">
            <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Hệ sinh thái sản xuất</span>
            </div>
            <div className="text-base font-black text-[#072348] font-heading">34 Tỉnh Thành VN</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
          
          <div className="text-center max-w-5xl mx-auto space-y-4 sm:space-y-5">
            
            {/* Eyebrow Badge (Compact & Sleek) */}
            <div className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-1 rounded-full bg-blue-50/90 border border-blue-200 text-blue-800 text-[11px] sm:text-xs font-bold shadow-2xs font-heading uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="leading-snug">{t('hero.badge')}</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 hidden sm:inline" />
            </div>

            {/* BIG MAIN HEADLINE: (FONT SPACE GROTESK + 6-COLOR GRADIENT, NO DIACRITIC CLIPPING) */}
            <div className="w-full py-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[40px] font-black text-[#072348] tracking-normal uppercase font-heading text-center leading-[1.35]">
                <span className="inline-block py-0.5">{t('hero.titlePart1')}</span>{' '}
                <span className="text-rainbow-gradient">{t('hero.titlePart2')}</span>
              </h1>
            </div>

            {/* Concise Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed sm:leading-loose">
              {t('hero.subtitle')}
            </p>

          </div>

          {/* 2. CLICKUP BRAIN SEARCH BAR WITH 6-COLOR GRADIENT RUNNING SHEEN (IMAGE 2) */}
          <div className="max-w-4xl mx-auto space-y-4 relative z-20">
            
            <ClickUpBrainSearchBar
              searchCategory={searchCategory}
              setSearchCategory={setSearchCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearchSubmit={handleSearchSubmit}
            />

            {/* Sourcing Marquee Tags (2 Horizontal Rows Scrolling in Opposite Directions) */}
            <div className="space-y-2 pt-2">
              
              {/* Track 1: Scrolling Left */}
              <div className="flex overflow-hidden py-0.5">
                <div className="animate-marquee-left flex items-center space-x-2.5">
                  {[...marqueeKeywordsRow1, ...marqueeKeywordsRow1].map((kw, i) => (
                    <button
                      key={`row1-${i}`}
                      type="button"
                      onClick={() => handleTagClick(kw.label, kw.category)}
                      className="px-3.5 py-1.5 bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-white rounded-full text-xs font-semibold transition-all duration-200 shadow-2xs whitespace-nowrap hover:scale-105 cursor-pointer flex-shrink-0"
                    >
                      {kw.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Track 2: Scrolling Right */}
              <div className="flex overflow-hidden py-0.5">
                <div className="animate-marquee-right flex items-center space-x-2.5">
                  {[...marqueeKeywordsRow2, ...marqueeKeywordsRow2].map((kw, i) => (
                    <button
                      key={`row2-${i}`}
                      type="button"
                      onClick={() => handleTagClick(kw.label, kw.category)}
                      className="px-3.5 py-1.5 bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-white rounded-full text-xs font-semibold transition-all duration-200 shadow-2xs whitespace-nowrap hover:scale-105 cursor-pointer flex-shrink-0"
                    >
                      {kw.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* 3. LIFECYCLE POSTER SECTION (6-STAGE FLOWER ON LOGO_ONLY.PNG) WITH ARTISTIC LUXURY DESIGN */}
          <div className="pt-6 relative">
            
            {/* Outer Artistic Multi-Chromatic Crystal Gradient Aura Border */}
            <div className="relative p-[1.5px] rounded-[36px] bg-gradient-to-br from-blue-600/30 via-indigo-500/25 via-sky-400/20 to-emerald-400/25 shadow-[0_25px_70px_-15px_rgba(7,35,72,0.09)] transition-all duration-700">
              
              {/* Inner Luxury Glass Surface */}
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center bg-white/95 backdrop-blur-3xl rounded-[34.5px] p-5 sm:p-8 lg:p-12 overflow-hidden">
                
                {/* Subtle Atmospheric Aurora Light Fields */}
                <div className="pointer-events-none absolute -top-32 -left-20 w-[420px] h-[420px] bg-radial from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 left-1/4 w-[380px] h-[380px] bg-radial from-amber-400/8 via-orange-300/4 to-transparent rounded-full blur-3xl" />
                <div className="pointer-events-none absolute -top-20 -right-20 w-[460px] h-[460px] bg-radial from-sky-400/12 via-teal-400/6 to-transparent rounded-full blur-3xl" />
                
                {/* Subtle Tech Micro-Grid */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#072348_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.025]" />

                {/* Left Column: Slogan, Description & Action Buttons */}
                <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left relative z-10">
                  
                  {/* Top Badge & Main Heading */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50/90 border border-blue-200/80 rounded-full shadow-2xs backdrop-blur-md">
                      <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-blue-600"></span>
                      </span>
                      <span className="text-blue-950 text-[11px] sm:text-xs font-black uppercase tracking-wider font-heading">
                        {t('poster.badge')}
                      </span>
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <h2 className="text-lg sm:text-xl lg:text-[25px] font-black uppercase font-heading tracking-normal space-y-1">
                        <span className="text-[#072348] block leading-normal py-0.5">
                          {t('poster.title1')}
                        </span>
                        <span className="bg-gradient-to-r from-[#0047a5] via-[#0066d6] to-[#0284c7] bg-clip-text text-transparent block leading-normal py-0.5">
                          {t('poster.title2')}
                        </span>
                      </h2>
                      <div className="h-1 w-14 sm:w-16 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full mt-1 sm:mt-2" />
                    </div>
                  </div>

                  {/* 3 Connected Entity Buttons on Single Row with NƠI: prefix */}
                  <div className="space-y-2.5 pt-0.5 sm:pt-1">
                    <div className="flex items-center flex-nowrap gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar sm:overflow-visible pb-0.5">
                      <span className="text-xs sm:text-[13px] font-black text-slate-500 uppercase tracking-wider flex-shrink-0 mr-0.5 font-heading">
                        {lang === 'en' ? 'WHERE:' : 'NƠI:'}
                      </span>
                      
                      <Link
                        to="/hoi-hiep-hoi"
                        className="inline-flex items-center px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-blue-50/90 hover:bg-blue-600 border border-blue-200/90 hover:border-blue-600 text-blue-950 hover:text-white text-[10.5px] sm:text-xs font-black uppercase tracking-wider shadow-2xs transition-all transform hover:-translate-y-0.5 whitespace-nowrap font-heading group"
                      >
                        <Users className="w-3.5 h-3.5 mr-1.5 text-blue-600 group-hover:text-white shrink-0 transition-colors" />
                        <span>{lang === 'en' ? 'ASSOCIATIONS & NETWORKS' : 'HỘI / HIỆP HỘI / TỔ CHỨC KẾT NỐI'}</span>
                      </Link>

                      <span className="text-slate-300 font-bold text-xs flex-shrink-0">•</span>

                      <Link
                        to="/nha-cung-ung"
                        className="inline-flex items-center px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-indigo-50/90 hover:bg-indigo-600 border border-indigo-200/90 hover:border-indigo-600 text-indigo-950 hover:text-white text-[10.5px] sm:text-xs font-black uppercase tracking-wider shadow-2xs transition-all transform hover:-translate-y-0.5 whitespace-nowrap font-heading group"
                      >
                        <Building2 className="w-3.5 h-3.5 mr-1.5 text-indigo-600 group-hover:text-white shrink-0 transition-colors" />
                        <span>{lang === 'en' ? 'B2B SUPPLIERS' : 'NHÀ CUNG ỨNG'}</span>
                      </Link>

                      <span className="text-slate-300 font-bold text-xs flex-shrink-0">•</span>

                      <Link
                        to="/nha-may"
                        className="inline-flex items-center px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-sky-50/90 hover:bg-sky-600 border border-sky-200/90 hover:border-sky-600 text-sky-950 hover:text-white text-[10.5px] sm:text-xs font-black uppercase tracking-wider shadow-2xs transition-all transform hover:-translate-y-0.5 whitespace-nowrap font-heading group"
                      >
                        <Factory className="w-3.5 h-3.5 mr-1.5 text-sky-600 group-hover:text-white shrink-0 transition-colors" />
                        <span>{lang === 'en' ? 'FACTORIES' : 'NHÀ MÁY'}</span>
                      </Link>
                    </div>
                    
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                      {t('poster.tagline1')}<span className="text-[#072348] font-bold">{t('poster.taglineRole')}</span>, <span className="text-[#072348] font-bold">{t('poster.taglineStage')}</span>, <span className="text-[#072348] font-bold">{t('poster.taglineTime')}</span>
                    </p>
                  </div>

                  {/* Balanced Rich Description matching Right Flower Wheel */}
                  <div className="space-y-2.5 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed max-w-xl">
                    <p>
                      {t('poster.desc')}
                    </p>
                    <p className="text-slate-500 hidden sm:block">
                      {t('poster.descExtra')}
                    </p>
                  </div>

                  {/* 2 Big Action Buttons with Shimmer & Glow Effects */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <Link
                      to="/ban-do-6-giai-doan"
                      className="relative group/btn w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-600/35 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 whitespace-nowrap font-heading uppercase overflow-hidden"
                    >
                      {/* Shimmer Sweep Reflection */}
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                      
                      <FolderOpen className="w-4 h-4 text-sky-200 group-hover/btn:rotate-6 transition-transform" />
                      <span>{t('poster.btnMap')}</span>
                      <ArrowRight className="w-4 h-4 text-sky-200 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to="/dinh-vi-doanh-nghiep"
                      className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#072348] border-2 border-slate-200 hover:border-blue-400 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 whitespace-nowrap font-heading uppercase group/sub"
                    >
                      <Compass className="w-4 h-4 text-blue-600 group-hover/sub:rotate-45 transition-transform" />
                      <span>{t('poster.btnDiagnostic')}</span>
                    </Link>
                  </div>

                </div>

                {/* Right Column: Exact 6-Stage Flower Wheel with 3D Scroll Motion & Centered Titles */}
                <div className="lg:col-span-6 flex items-center justify-center relative z-10 py-2 sm:py-0">
                  <HeroLifecycleWheel />
                </div>

              </div>
            </div>
          </div>

          {/* 4. SOURCING METRICS & TRUST METRICS BAR (5 COLUMNS IN EXACT REQUESTED ORDER) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 pt-2">
            {/* 1. 6 Giai đoạn vòng đời */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs text-center space-y-0.5 sm:space-y-1 hover:border-purple-300 hover:shadow-md transition">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-600 font-heading">6</span>
              <h4 className="text-xs sm:text-xs lg:text-[13px] font-extrabold text-slate-900 uppercase font-heading">{t('metrics.stagesTitle')}</h4>
              <p className="text-[10.5px] sm:text-xs text-slate-500">{t('metrics.stagesDesc')}</p>
            </div>

            {/* 2. 18 Pha kỹ thuật */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs text-center space-y-0.5 sm:space-y-1 hover:border-emerald-300 hover:shadow-md transition">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 font-heading">18</span>
              <h4 className="text-xs sm:text-xs lg:text-[13px] font-extrabold text-slate-900 uppercase font-heading">{t('metrics.phasesTitle')}</h4>
              <p className="text-[10.5px] sm:text-xs text-slate-500">{t('metrics.phasesDesc')}</p>
            </div>

            {/* 3. Số lượng Khu công nghiệp */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs text-center space-y-0.5 sm:space-y-1 hover:border-orange-300 hover:shadow-md transition">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-500 font-heading">{kcnCountFormatted}</span>
              <h4 className="text-xs sm:text-xs lg:text-[13px] font-extrabold text-slate-900 uppercase font-heading">{t('metrics.parksTitle')}</h4>
              <p className="text-[10.5px] sm:text-xs text-slate-500">{t('metrics.parksDesc')}</p>
            </div>

            {/* 4. Số lượng Nhà máy */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs text-center space-y-0.5 sm:space-y-1 hover:border-indigo-300 hover:shadow-md transition">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-indigo-600 font-heading">{factoriesCountFormatted}</span>
              <h4 className="text-xs sm:text-xs lg:text-[13px] font-extrabold text-slate-900 uppercase font-heading">{t('metrics.factoriesTitle')}</h4>
              <p className="text-[10.5px] sm:text-xs text-slate-500">{t('metrics.factoriesDesc')}</p>
            </div>

            {/* 5. Số lượng Nhà cung ứng */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs text-center space-y-0.5 sm:space-y-1 hover:border-blue-300 hover:shadow-md transition col-span-2 sm:col-span-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 font-heading">{suppliersCountFormatted}</span>
              <h4 className="text-xs sm:text-xs lg:text-[13px] font-extrabold text-slate-900 uppercase font-heading">{t('metrics.suppliersTitle')}</h4>
              <p className="text-[10.5px] sm:text-xs text-slate-500">{t('metrics.suppliersDesc')}</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION: 3-COLUMN SUPPLY CHAIN PIPELINE FLOW (INPUTS -> PROCESSING LOGO -> OUTPUTS) */}
      <SupplyChainPipelineFlow />

      {/* 3. SECTION: VÌ SAO NHIỀU DOANH NGHIỆP VẪN "ĐỨNG SAI CHỖ" (FULL WIDTH CONTINUOUS HEADLINE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-6xl mx-auto space-y-3">
          <div className="w-full overflow-hidden py-1">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[25px] font-black text-slate-900 uppercase font-heading whitespace-nowrap text-center leading-snug">
              <span>{t('why.headlinePart1')}</span>
              <span className="text-red-600">{t('why.headlineHighlight')}</span>
              <span>{t('why.headlinePart2')}</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            {t('why.sub')}
          </p>
        </div>

        {/* 3 Cards with 3D Depth (No Tick/X, Elegant Glowing Indicators) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Nhà máy / Chủ đầu tư */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 space-y-4 group">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/25 group-hover:scale-110 transition duration-300">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#072348] text-base uppercase font-heading">
                {t('why.c1Title')}
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Cannot see the complete structure of the relevant supply chain.' : 'Không nhìn thấy toàn bộ cấu trúc chuỗi cung ứng liên quan.'}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Uncertain which specific suppliers are needed at each phase.' : 'Không biết giai đoạn nào thực sự cần đơn vị cung ứng nào.'}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Waste time inquiring through multiple intermediate layers.' : 'Mất nhiều thời gian hỏi dò qua nhiều tầng trung gian.'}</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Nhà cung ứng / B2B */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 space-y-4 group hover:border-emerald-300">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition duration-300">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#072348] text-base uppercase font-heading">
                {t('why.c2Title')}
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Possess many highly capable members and partners.' : 'Có rất nhiều hội viên, đối tác năng lực xuất sắc.'}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Member roles are only seen through isolated networking events.' : 'Vai trò hội viên chỉ nhìn thấy qua từng sự kiện riêng lẻ.'}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Not yet positioned in the overall production lifecycle map.' : 'Chưa được đặt trong bức tranh tổng thể vòng đời sản xuất.'}</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Hội / Hiệp hội / Tổ chức */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 space-y-4 group hover:border-purple-300">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/25 group-hover:scale-110 transition duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#072348] text-base uppercase font-heading">
                {t('why.c3Title')}
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Called for mismatched needs not aligned with core expertise.' : 'Bị gọi nhầm nhu cầu, không đúng chuyên môn thực tế.'}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Arriving at the wrong time in project implementation schedule.' : 'Xuất hiện sai thời điểm trong tiến độ triển khai dự án.'}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                <span>{lang === 'en' ? 'Generic introductions weaken competitive credibility.' : 'Tự giới thiệu chung chung làm giảm tính tin cậy.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 1. PROMINENT ALERT BOX WITH INTERACTIVE HOVER TYPEWRITER EFFECT (IMAGE 1) */}
        <HoverTypewriterAlertBox />
      </section>

      {/* 4. SECTION: 6 GIAI ĐOẠN CỦA VÒNG ĐỜI HỆ THỐNG SẢN XUẤT (3D EXPLODED / BLOSSOM VIEW AS PER MAP PAGE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-[#072348] uppercase font-heading leading-snug">
            {lang === 'en' ? '6 Stages of the Production System Lifecycle' : '6 Giai đoạn của Vòng đời Hệ thống Sản xuất'}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            {lang === 'en' ? 'Standardized sequentially from investment idea, design, construction, machinery installation to operation and green transition.' : 'Chuẩn hóa tuần tự từ ý tưởng đầu tư, thiết kế, thi công, lắp đặt máy đến vận hành và chuyển đổi tối ưu.'}
          </p>
        </div>

        {/* INTERACTIVE 3D EXPLODED FLOWER VIEW ON HOMEPAGE */}
        <div className="py-2">
          <InteractiveExplodedFlower3D />
        </div>
      </section>

      {/* 5. SECTION: NGUYÊN TẮC THAM GIA & RANH GIỚI VẬN HÀNH */}
      <section id="nguyen-tac" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-24 space-y-8 group/principles select-none">
        
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-200 font-heading uppercase shadow-xs">
            {lang === 'en' ? 'PARTICIPATION PRINCIPLES & OPERATING BOUNDARIES' : 'NGUYÊN TẮC THAM GIA & RANH GIỚI VẬN HÀNH'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#072348] uppercase font-heading leading-snug">
            {lang === 'en' ? 'Operating Boundaries & 3 Core Principles' : 'Ranh giới vận hành & 3 Nguyên tắc cốt lõi'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {lang === 'en' ? 'Committed to transparency, maintaining standard structure and facilitating the right roles.' : 'Cam kết minh bạch, giữ vững cấu trúc chuẩn hóa và điều phối đúng vai trò.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" style={{ perspective: '1600px' }}>
          
          {/* Left: Chúng tôi không làm */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white via-rose-50/40 to-white rounded-3xl p-6 sm:p-7 border-2 border-rose-200/90 shadow-lg shadow-rose-900/5 flex flex-col justify-between space-y-5 transition-all duration-700 ease-out transform-gpu lg:-translate-x-10 lg:-rotate-y-6 lg:opacity-90 group-hover/principles:translate-x-0 group-hover/principles:rotate-y-0 group-hover/principles:opacity-100 group-hover/principles:-translate-y-2 group-hover/principles:scale-[1.02] group-hover/principles:shadow-2xl hover:border-rose-400">
            <div className="space-y-3.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 bg-rose-100 border border-rose-200 rounded-full text-rose-700 text-xs font-bold font-heading uppercase shadow-2xs">
                <span>{lang === 'en' ? 'System Boundaries' : 'Ranh giới hệ thống'}</span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-black text-[#072348] leading-snug uppercase font-heading">
                {lang === 'en' ? 'What we ' : 'Chúng tôi '}<span className="text-rose-600">{lang === 'en' ? 'DO NOT DO' : 'KHÔNG LÀM'}</span>:
              </h3>

              <div className="space-y-2 pt-1">
                {(lang === 'en' ? [
                  "No direct product selling or trading",
                  "No selling commercial lead lists",
                  "No subjective ranking of enterprises",
                  "No replacing association leadership roles",
                  "No hosting events on behalf of any entity"
                ] : [
                  "Không bán hàng trực tiếp",
                  "Không bán lead thương mại",
                  "Không xếp hạng doanh nghiệp chủ quan",
                  "Không thay thế vai trò của hội / hiệp hội",
                  "Không tổ chức sự kiện thay bất kỳ tổ chức nào"
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white hover:bg-rose-50/80 border border-rose-100 text-xs sm:text-sm text-slate-700 leading-relaxed transition-all duration-200 shadow-2xs hover:shadow-sm hover:translate-x-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-ping"></span>
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-rose-100 text-xs text-slate-500 italic font-medium leading-relaxed">
              {lang === 'en' ? '👉 Supply Chain - chuoicungung.com solely maintains standard structure and orchestrates roles at the right time.' : '👉 Chuỗi Cung Ứng - chuoicungung.com chỉ giữ cấu trúc chuẩn và điều phối vai trò đúng thời điểm.'}
            </div>
          </div>

          {/* Right: 3 Nguyên tắc vận hành */}
          <div className="lg:col-span-7 bg-gradient-to-br from-white via-sky-50/40 to-white rounded-3xl p-6 sm:p-7 border-2 border-sky-200/90 shadow-lg shadow-blue-900/5 flex flex-col justify-between space-y-5 transition-all duration-700 ease-out transform-gpu lg:translate-x-10 lg:rotate-y-6 lg:opacity-90 group-hover/principles:translate-x-0 group-hover/principles:rotate-y-0 group-hover/principles:opacity-100 group-hover/principles:-translate-y-2 group-hover/principles:scale-[1.02] group-hover/principles:shadow-2xl hover:border-blue-400">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 bg-blue-100 border border-blue-200 rounded-full text-blue-800 text-xs font-bold font-heading uppercase shadow-2xs">
                <span>{lang === 'en' ? 'Operating Philosophy' : 'Cam kết đồng hành'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#072348] mt-1.5 uppercase font-heading leading-snug">
                {lang === 'en' ? '3 Platform Operating Principles' : '3 Nguyên tắc vận hành nền tảng'}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all duration-300 flex items-start space-x-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-black text-base flex-shrink-0 font-mono shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
                  1
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[#072348] text-xs sm:text-sm uppercase font-heading group-hover:text-purple-700 transition">
                    {lang === 'en' ? 'Neutrality' : 'Trung lập'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'en' ? 'Impartial to any specific organization or sector. Every sourcing matchmaking opportunity is transparent.' : 'Không thiên vị bất kỳ hội / hiệp / ngành nghề nào. Mọi cơ hội kết nối đều minh bạch.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex items-start space-x-4 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-black text-base flex-shrink-0 font-mono shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                  2
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[#072348] text-xs sm:text-sm uppercase font-heading group-hover:text-emerald-700 transition">
                    {lang === 'en' ? 'Structure First, Connection Next' : 'Cấu trúc trước, kết nối sau'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'en' ? 'Every partnership is routed through specific stages and phases, eliminating premature reachouts.' : 'Mọi kết nối đều dựa trên giai đoạn và pha cụ thể, tránh tiếp cận sai thời điểm.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white hover:bg-orange-50/50 rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all duration-300 flex items-start space-x-4 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-white flex items-center justify-center font-black text-base flex-shrink-0 font-mono shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
                  3
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[#072348] text-xs sm:text-sm uppercase font-heading group-hover:text-orange-700 transition">
                    {lang === 'en' ? 'Respect Respective Roles' : 'Không tranh vai'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'en' ? 'Associations endorse & connect. Suppliers deliver solutions. Factories & Investors decide.' : 'Hội/Hiệp hội bảo chứng & kết nối. Doanh nghiệp cung ứng giải pháp. Nhà máy / Chủ đầu tư quyết định.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/90 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center space-x-2.5 leading-relaxed shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0"></span>
              <span className="font-semibold">{lang === 'en' ? 'Ensuring long-term balanced benefits for all participating stakeholders in the ecosystem.' : 'Đảm bảo lợi ích cân bằng và lâu dài cho tất cả các thành phần tham gia hệ sinh thái.'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 select-none group/cta" style={{ perspective: '1200px' }}>
        <div className="bg-gradient-to-r from-[#072847] via-[#0b3f6d] to-[#072847] rounded-3xl p-5 sm:p-7 text-white shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(7,35,72,0.55)] border-2 border-blue-400/30 hover:border-amber-400 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden transition-all duration-700 ease-out transform-gpu translate-y-3 opacity-95 group-hover/cta:translate-y-0 group-hover/cta:opacity-100 group-hover/cta:-translate-y-2 group-hover/cta:scale-[1.015] cursor-pointer">
          
          <div className="space-y-1 text-center md:text-left z-10">
            <div className="w-full overflow-hidden">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase font-heading whitespace-nowrap leading-snug text-white group-hover/cta:text-amber-300 transition duration-300">
                {lang === 'en' ? 'Where are you in the production system lifecycle?' : 'Bạn đang ở đâu trong vòng đời hệ thống sản xuất?'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              {lang === 'en' ? 'Begin your standardized roadmap and connect with the right partners today.' : 'Hãy bắt đầu hành trình chuẩn hóa và kết nối đúng đối tác ngay hôm nay.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5 z-10">
            <Link
              to="/dinh-vi-doanh-nghiep"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold shadow-md transition font-heading uppercase"
            >
              {lang === 'en' ? 'Which Stage Am I In →' : 'Tôi đang ở giai đoạn nào →'}
            </Link>
            <Link
              to="/ban-do-6-giai-doan"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md transition font-heading uppercase"
            >
              {lang === 'en' ? 'View 6-Stage Map →' : 'Xem Bản đồ 6 Giai đoạn →'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// 1. Interactive Typewriter Box on Hover (Image 1 Feature)
function HoverTypewriterAlertBox() {
  const { lang } = useLanguage();
  const fullText = lang === 'en' 
    ? "The issue is not about capability. The issue is lacking a shared lifecycle supply chain structure."
    : "Vấn đề không nằm ở năng lực. Vấn đề nằm ở thiếu một cấu trúc chuỗi chung.";
    
  const [displayedText, setDisplayedText] = useState(fullText);
  const [isTyping, setIsTyping] = useState(false);

  // Sync on language change
  React.useEffect(() => {
    setDisplayedText(fullText);
  }, [fullText]);

  const handleMouseEnter = () => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      onClick={handleMouseEnter}
      className="mt-8 p-6 sm:p-7 bg-gradient-to-r from-[#072348] via-[#0b3f6d] to-[#072348] rounded-[28px] text-white flex items-center justify-center space-x-3.5 shadow-2xl shadow-blue-950/25 border-2 border-blue-400/40 hover:border-amber-400 hover:shadow-blue-500/25 transition-all duration-500 transform-gpu hover:-translate-y-1.5 cursor-pointer group"
    >
      <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 animate-bounce group-hover:scale-110 transition" />
      <p className="text-xs sm:text-sm md:text-base font-semibold text-center leading-relaxed font-sans min-h-[1.5em] flex items-center justify-center flex-wrap">
        <span>{displayedText}</span>
        {isTyping && (
          <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse"></span>
        )}
      </p>
    </div>
  );
}
