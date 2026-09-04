import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, ChevronRight, FileText, 
  Building2, Factory, Users, MapPin, Sparkles, Layers,
  Compass, Check, Shield, Wrench, RefreshCw, Briefcase, 
  FileCheck, Download, ExternalLink, HelpCircle
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function StageDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const stageId = parseInt(id) || 1;
  const stage = stagesData.find(s => s.id === stageId) || stagesData[0];

  // Dynamic Theme Palette matching the exact 6 Flower Petal Colors:
  // 1: Tím, 2: Xanh lá, 3: Cam, 4: Xanh dương, 5: Vàng, 6: Đỏ
  const stageThemes = {
    1: { 
      color: "#8b5cf6", 
      darkColor: "#6b21a8",
      bgPage: "from-[#fbf8ff] via-[#f7f0fe] to-[#f3e8ff]/40", 
      heroImg: "/stage1_hero.jpg", 
      bgPill: "bg-purple-50",
      borderPill: "border-purple-200",
      textAcc: "text-purple-600" 
    },
    2: { 
      color: "#10b981", 
      darkColor: "#047857",
      bgPage: "from-[#f0fdf4] via-[#e6fbf0] to-[#dcfce7]/40", 
      heroImg: "/stage2_hero.jpg", 
      bgPill: "bg-emerald-50",
      borderPill: "border-emerald-200",
      textAcc: "text-emerald-600" 
    },
    3: { 
      color: "#f97316", 
      darkColor: "#c2410c",
      bgPage: "from-[#fff7ed] via-[#ffedd5] to-[#ffedd5]/40", 
      heroImg: "/stage3_hero.jpg", 
      bgPill: "bg-orange-50",
      borderPill: "border-orange-200",
      textAcc: "text-orange-600" 
    },
    4: { 
      color: "#0284c7", 
      darkColor: "#0369a1",
      bgPage: "from-[#f0f9ff] via-[#e0f2fe] to-[#e0f2fe]/40", 
      heroImg: "/stage4_hero.jpg", 
      bgPill: "bg-sky-50",
      borderPill: "border-sky-200",
      textAcc: "text-sky-600" 
    },
    5: { 
      color: "#eab308", 
      darkColor: "#b45309",
      bgPage: "from-[#fefce8] via-[#fef9c3] to-[#fef08a]/35", 
      heroImg: "/stage5_hero.jpg", 
      bgPill: "bg-amber-50",
      borderPill: "border-amber-200",
      textAcc: "text-amber-600" 
    },
    6: { 
      color: "#ef4444", 
      darkColor: "#b91c1c",
      bgPage: "from-[#fef2f2] via-[#fee2e2] to-[#fee2e2]/40", 
      heroImg: "/stage6_hero.jpg", 
      bgPill: "bg-red-50",
      borderPill: "border-red-200",
      textAcc: "text-red-600" 
    }
  };

  const theme = stageThemes[stage.id] || stageThemes[1];

  // Map phase icons
  const getPhaseIcon = (index) => {
    if (index === 0) return <Compass className="w-5 h-5" style={{ color: theme.color }} />;
    if (index === 1) return <FileText className="w-5 h-5" style={{ color: theme.color }} />;
    return <MapPin className="w-5 h-5" style={{ color: theme.color }} />;
  };

  // Sample ecosystem roles for bottom section
  const ecosystemRoles = [
    {
      icon: <Factory className="w-5 h-5" style={{ color: theme.color }} />,
      name: lang === 'en' ? "Factory / Investor" : "Nhà máy / Chủ đầu tư",
      desc: lang === 'en' ? "Orienting, deciding, and executing project roadmap" : "Định hướng, quyết định và triển khai dự án"
    },
    {
      icon: <Users className="w-5 h-5" style={{ color: theme.color }} />,
      name: lang === 'en' ? "Industrial Association" : "Hội / Hiệp hội",
      desc: lang === 'en' ? "Consulting, networking, supporting members" : "Tư vấn, kết nối, hỗ trợ thành viên"
    },
    {
      icon: <Building2 className="w-5 h-5" style={{ color: theme.color }} />,
      name: lang === 'en' ? "Verified Supplier" : "Doanh nghiệp cung ứng",
      desc: lang === 'en' ? "Supplying products and solutions per phase" : "Cung cấp giải pháp, dịch vụ theo từng pha"
    },
    {
      icon: <MapPin className="w-5 h-5" style={{ color: theme.color }} />,
      name: lang === 'en' ? "Industrial Park (IP)" : "Khu công nghiệp",
      desc: lang === 'en' ? "Providing land, infrastructure, and investment support" : "Cung cấp hạ tầng, quỹ đất và hỗ trợ đầu tư"
    },
    {
      icon: <Briefcase className="w-5 h-5" style={{ color: theme.color }} />,
      name: lang === 'en' ? "Support Entity" : "Tổ chức hỗ trợ",
      desc: lang === 'en' ? "Financial, legal, consulting, training, and media" : "Tài chính, pháp lý, tư vấn, đào tạo, truyền thông"
    }
  ];

  // Sample downloadable documents
  const sampleDocuments = [
    { name: lang === 'en' ? `Execution Checklist Stage ${stage.id} (PDF)` : `Checklist công việc GD ${stage.id} (PDF)`, size: "1.2 MB" },
    { name: lang === 'en' ? `Deployment Plan Template Stage ${stage.id} (PDF)` : `Mẫu kế hoạch triển khai GD ${stage.id} (PDF)`, size: "2.4 MB" },
    { name: lang === 'en' ? `Standard Operating Procedures (PDF)` : `Quy trình & thủ tục chuyên ngành (PDF)`, size: "1.8 MB" },
    { name: lang === 'en' ? `IPs & Partners Directory (PDF)` : `Danh bạ KCN & Đối tác liên kết (PDF)`, size: "3.1 MB" }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgPage} space-y-10 pb-24 pt-4 transition-all duration-300 font-sans`}>
      
      {/* 1. BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <Link to="/ban-do-6-giai-doan" className="hover:text-blue-600 font-medium">{lang === 'en' ? '6-Stage Map' : 'Bản đồ 6 giai đoạn'}</Link>
          <span>&gt;</span>
          <span className="font-bold text-slate-900 font-heading uppercase">
            {lang === 'en' ? `Stage ${stage.id}: ${stage.titleEn || stage.title}` : `Giai đoạn ${stage.id}: ${stage.title}`}
          </span>
        </div>
      </div>

      {/* 2. HERO HEADER BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
          
          {/* Right-Side High-Res Crisp Factory Photo */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[58%] lg:w-[55%] bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${theme.heroImg}')`,
            }}
          ></div>

          {/* Left-to-Right Soft Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-[42%] sm:via-white/90 sm:via-[45%] to-transparent pointer-events-none"></div>

          {/* Left Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-5">
            
            {/* Stage Color Badge */}
            <div 
              style={{ backgroundColor: theme.darkColor }}
              className="inline-block px-3.5 py-1.5 text-white rounded-lg text-xs font-black uppercase tracking-wider font-heading shadow-xs"
            >
              {lang === 'en' ? `STAGE ${stage.id}` : `GIAI ĐOẠN ${stage.id}`}
            </div>

            {/* Stage Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072348] tracking-tight leading-tight uppercase font-heading">
              {lang === 'en' ? (stage.titleEn || stage.title) : stage.title}
            </h1>

            {/* Stage Summary Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {lang === 'en' ? (stage.summaryEn || stage.summary) : stage.summary}
            </p>

            {/* 3 Metric Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800">
                <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: theme.color }} />
                <span><strong>{stage.phases.length}</strong> {lang === 'en' ? 'Core Phases' : 'Pha chính'}</span>
              </div>

              <div className="flex items-center space-x-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800">
                <Users className="w-4 h-4 flex-shrink-0" style={{ color: theme.color }} />
                <span><strong>{stage.stats.enterprises}</strong> {lang === 'en' ? 'Suppliers Participating' : 'Doanh nghiệp tham gia'}</span>
              </div>

              <div className="flex items-center space-x-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: theme.color }} />
                <span><strong>{stage.stats.industrialParks}</strong> {lang === 'en' ? 'Connected IPs' : 'KCN đang kết nối'}</span>
              </div>
            </div>

          </div>

          {/* Bottom 6-Stage Selector Tab Bar */}
          <div className="relative z-10 border-t border-slate-100 bg-white/85 backdrop-blur-md px-4 sm:px-8 py-3 overflow-x-auto">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-max">
              {stagesData.map((s) => {
                const isCurrent = s.id === stage.id;
                const sTheme = stageThemes[s.id] || stageThemes[1];
                return (
                  <div key={s.id} className="relative flex flex-col items-center">
                    <Link
                      to={`/giai-doan/${s.id}`}
                      style={{
                        backgroundColor: isCurrent ? sTheme.darkColor : undefined
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                        isCurrent
                          ? 'text-white shadow-md'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80 shadow-2xs'
                      }`}
                    >
                      <span 
                        style={{
                          backgroundColor: isCurrent ? 'rgba(255,255,255,0.25)' : sTheme.color,
                          color: '#ffffff'
                        }}
                        className="w-5 h-5 rounded-lg flex items-center justify-center font-mono font-black text-[10px]"
                      >
                        0{s.id}
                      </span>
                      <span className="font-heading uppercase">{lang === 'en' ? (s.titleEn || s.title) : s.title}</span>
                    </Link>

                    {/* Active Triangle Arrow pointing down */}
                    {isCurrent && (
                      <div 
                        style={{ borderTopColor: sTheme.darkColor }}
                        className="absolute -bottom-3 w-0 h-0 border-x-4 border-x-transparent border-t-4"
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 3. SECTION: 3 PHA CỦA GIAI ĐOẠN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header with Right CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-heading">
            {lang === 'en' ? `3 Phases of Stage ${stage.id}` : `3 Pha của Giai đoạn ${stage.id}`}
          </h2>
          
          <Link
            to="/ban-do-6-giai-doan"
            style={{ color: theme.color, borderColor: theme.color }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 border rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition self-start sm:self-auto font-heading uppercase"
          >
            <span>{lang === 'en' ? 'View 6 Stages Overview' : 'Xem tổng quan 6 giai đoạn'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Phase Cards List */}
        <div className="space-y-5">
          {stage.phases.map((phase, idx) => (
            <div 
              key={phase.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 hover:shadow-md transition-all space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Col 1: Phase Info (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span 
                      style={{ color: theme.color }}
                      className="text-3xl sm:text-4xl font-black font-mono"
                    >
                      {phase.id}
                    </span>
                    <div 
                      style={{ 
                        backgroundColor: `${theme.color}15`, 
                        borderColor: `${theme.color}35` 
                      }}
                      className="w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0"
                    >
                      {getPhaseIcon(idx)}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase font-heading leading-snug">
                    {lang === 'en' ? (phase.titleEn || phase.title) : phase.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {lang === 'en' ? (phase.summaryEn || phase.summary) : phase.summary}
                  </p>

                  <div className="pt-1">
                    <Link
                      to={`/pha/${phase.id}`}
                      style={{ color: theme.color }}
                      className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold hover:underline transition"
                    >
                      <span>{lang === 'en' ? 'View Details' : 'Xem chi tiết'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Col 2: CÔNG VIỆC CHÍNH (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-2.5">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-heading">
                    {lang === 'en' ? 'CORE TASKS' : 'CÔNG VIỆC CHÍNH'}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {(phase.tasks || [
                      "Nghiên cứu thị trường & ngành nghề",
                      "Đánh giá nhu cầu sản phẩm",
                      "Khảo sát hiện trạng khu vực",
                      "Phân tích tính khả thi dự án",
                      "Định hướng chiến lược đầu tư"
                    ]).slice(0, 5).map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start">
                        <Check 
                          className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" 
                          style={{ color: theme.color }} 
                        />
                        <span className="leading-snug">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 3: NHU CẦU THƯỜNG GẶP (lg:col-span-2) */}
                <div className="lg:col-span-2 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                    {lang === 'en' ? 'Common Demands' : 'Nhu cầu thường gặp'}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {(phase.commonDemands || [
                      "Tư vấn chiến lược đầu tư",
                      "Nghiên cứu thị trường",
                      "Khảo sát địa hình, địa chất",
                      "Đánh giá tác động môi trường sơ bộ"
                    ]).slice(0, 4).map((demand, dIdx) => (
                      <li key={dIdx} className="flex items-start">
                        <span 
                          style={{ color: theme.color }} 
                          className="mr-2 font-bold"
                        >
                          •
                        </span>
                        <span className="leading-snug">{demand}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/doanh-nghiep?phase=${phase.id}`}
                    style={{ color: theme.color }}
                    className="text-xs font-bold hover:underline block pt-1"
                  >
                    {lang === 'en' ? 'View matched suppliers →' : 'Xem các doanh nghiệp đáp ứng →'}
                  </Link>
                </div>

                {/* Col 4: VAI TRÒ THAM GIA (lg:col-span-2) */}
                <div className="lg:col-span-2 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                    {lang === 'en' ? 'Participating Roles' : 'Vai trò tham gia'}
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Factory className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.color }} />
                      <span>{lang === 'en' ? 'Factory / Investor' : 'Nhà máy / Chủ đầu tư'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.color }} />
                      <span>{lang === 'en' ? 'Association' : 'Hội / Hiệp hội'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.color }} />
                      <span>{lang === 'en' ? 'Verified Supplier' : 'Doanh nghiệp cung ứng'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.color }} />
                      <span>{lang === 'en' ? 'Industrial Park' : 'KCN'}</span>
                    </div>
                  </div>
                </div>

                {/* Col 5: VÍ DỤ DOANH NGHIỆP THAM GIA (lg:col-span-2) */}
                <div className="lg:col-span-2 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                    {lang === 'en' ? 'Sample Suppliers' : 'Ví dụ doanh nghiệp tham gia'}
                  </h4>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {(phase.featuredCompanies || ["VietinBank", "DEEP C", "PM Group"]).map((comp, cIdx) => (
                      <span 
                        key={cIdx} 
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold shadow-2xs"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/doanh-nghiep?phase=${phase.id}`}
                    style={{ color: theme.color }}
                    className="text-xs font-bold hover:underline block pt-2"
                  >
                    {lang === 'en' ? `View all (${phase.totalEnterprises || 85}) →` : `Xem tất cả (${phase.totalEnterprises || 85}) →`}
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 4. SECTION: HỆ SINH THÁI THAM GIA GIAI ĐOẠN + TÀI LIỆU THAM KHẢO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: HỆ SINH THÁI THAM GIA GIAI ĐOẠN (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
              {lang === 'en' ? `ECOSYSTEM STAKEHOLDERS IN STAGE ${stage.id}` : `HỆ SINH THÁI THAM GIA GIAI ĐOẠN ${stage.id}`}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
              {ecosystemRoles.map((role, rIdx) => (
                <div key={rIdx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 flex flex-col items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center">
                    {role.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{role.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tài liệu tham khảo (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 font-heading">
                {lang === 'en' ? 'REFERENCE DOCUMENTS' : 'Tài liệu tham khảo'}
              </h3>
              <div className="space-y-2">
                {sampleDocuments.map((doc, dIdx) => (
                  <div 
                    key={dIdx}
                    className="flex items-center space-x-2 text-xs text-slate-700 hover:text-blue-600 cursor-pointer transition p-1.5 rounded-lg hover:bg-slate-50"
                    onClick={() => alert(lang === 'en' ? `Downloading document: ${doc.name}` : `Tải xuống tài liệu: ${doc.name}`)}
                  >
                    <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="truncate font-medium">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert(lang === 'en' ? `Downloading document catalog for Stage ${stage.id}` : `Đang tải danh mục toàn bộ tài liệu giai đoạn ${stage.id}`)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 font-heading"
            >
              <span>{lang === 'en' ? 'View all documents' : 'Xem tất cả tài liệu'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
