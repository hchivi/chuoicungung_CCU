import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ChevronRight, Sparkles, CheckCircle2, 
  Cpu, Layers, Users, Zap, Search, ShieldCheck, Activity,
  ChevronLeft, ArrowUpRight, BarChart3, Clock, Check
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function ClickUpBrainMatrixSection() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  
  // Interactive state per card so user can click, hover, and manually control any card
  const [activeStageHighlight, setActiveStageHighlight] = useState(1);
  const [card1Index, setCard1Index] = useState(0);
  const [card2Index, setCard2Index] = useState(1);
  const [card3Index, setCard3Index] = useState(2);
  const [card4Tab, setCard4Tab] = useState('hub');
  const [card5Index, setCard5Index] = useState(0);
  const [card6BadgeIdx, setCard6BadgeIdx] = useState(0);
  const [card6Progress, setCard6Progress] = useState(94);
  
  // Track hovered card id (null if none hovered)
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Card 1 Data Items
  const card1Items = lang === 'en' ? [
    { title: "Green IP • Ready for Handover", tag: "100% Legal Clearance", badge: "Dossier #01" },
    { title: "4-Year Corporate Tax Exemption", tag: "2-Yr Free, 50% for 4 Yrs", badge: "Incentive Policy" },
    { title: "110kV Power Grid & Port Link", tag: "Inter-regional Logistics", badge: "Infrastructure" }
  ] : [
    { title: "KCN Xanh • Sẵn sàng bàn giao", tag: "Pháp lý hoàn thiện 100%", badge: "Hồ sơ số 01" },
    { title: "Ưu đãi thuế TNDN 4 năm", tag: "Miễn 2 năm, giảm 50% 4 năm", badge: "Chính sách đầu tư" },
    { title: "Hạ tầng điện 110kV & Cảng", tag: "Logistics tối ưu liên vùng", badge: "Hạ tầng kỹ thuật" }
  ];

  // Card 2 Carousel Items
  const carouselItems = lang === 'en' ? [
    { label: "Phase 2.1: IP Master Plan", sub: "Geological Survey & Site Plan" },
    { label: "Phase 2.2: Civil Construction & MEP", sub: "Steel Structure & Fire Safety" },
    { label: "Phase 2.3: Cleanrooms & Utilities", sub: "HVAC & Wastewater Treatment" },
    { label: "100% Commissioning Handover", sub: "Ready for Machine Installation" }
  ] : [
    { label: "Pha 2.1: Quy hoạch KCN", sub: "Khảo sát địa chất & Mặt bằng" },
    { label: "Pha 2.2: Thi công Xây dựng MEP", sub: "Kết cấu thép & Cơ điện PCCC" },
    { label: "Pha 2.3: Phòng sạch & Tiện ích", sub: "HVAC & Xử lý nước thải" },
    { label: "Bàn giao 100% Nghiệm thu", sub: "Sẵn sàng lắp đặt máy móc" }
  ];

  // Card 3 Stacked Roles
  const stackedRoles = lang === 'en' ? [
    { name: "Investor & PMU Team", status: "Dossier Approved", color: "text-purple-400" },
    { name: "Chief MEP Engineer & Supervisor", status: "Commissioning", color: "text-amber-400" },
    { name: "CNC Machinery Contractor", status: "Handover Accepted ✓", color: "text-emerald-400" }
  ] : [
    { name: "Chủ đầu tư & Ban QLDA", status: "Đã duyệt hồ sơ", color: "text-purple-400" },
    { name: "Kỹ sư trưởng MEP & Giám sát", status: "Đang chạy thử", color: "text-amber-400" },
    { name: "Nhà thầu máy móc CNC", status: "Nghiệm thu ✓", color: "text-emerald-400" }
  ];

  // Card 5 Logistics Tasks
  const card5Tasks = lang === 'en' ? [
    { text: "Operating 50+ Forklifts & IP Warehouses", status: "100% Active", dot: "bg-emerald-400" },
    { text: "Supplying 2,000+ Daily Industrial Meals", status: "99.9% On-time", dot: "bg-amber-400" },
    { text: "Occupational Safety & 24/7 Security", status: "Patrolling", dot: "bg-blue-400" }
  ] : [
    { text: "Vận hành 50+ xe nâng & Kho KCN", status: "Hoạt động 100%", dot: "bg-emerald-400" },
    { text: "Cung ứng 2.000+ suất ăn/ngày", status: "Đúng giờ 99.9%", dot: "bg-amber-400" },
    { text: "Bảo hộ lao động & An ninh KCN 24/7", status: "Đang tuần tra", dot: "bg-blue-400" }
  ];

  // Card 6 Certifications
  const card6Badges = lang === 'en' ? [
    { label: "Green ESG Certification", iso: "ISO 14001:2015 ✓", color: "border-emerald-500/50 text-emerald-300" },
    { label: "Quality Management", iso: "ISO 9001:2015 ✓", color: "border-blue-500/50 text-blue-300" },
    { label: "Export Standards", iso: "RoHS & REACH ✓", color: "border-purple-500/50 text-purple-300" }
  ] : [
    { label: "Chứng nhận Xanh ESG", iso: "ISO 14001:2015 ✓", color: "border-emerald-500/50 text-emerald-300" },
    { label: "Quản lý Chất lượng", iso: "ISO 9001:2015 ✓", color: "border-blue-500/50 text-blue-300" },
    { label: "Tiêu chuẩn Xuất khẩu", iso: "RoHS & REACH ✓", color: "border-purple-500/50 text-purple-300" }
  ];

  // Auto-Cycle Engine: only auto-advances cards that are NOT currently hovered by the user
  useEffect(() => {
    const interval = setInterval(() => {
      if (hoveredCardId === null) {
        setActiveStageHighlight(prev => (prev % 6) + 1);
      }
      if (hoveredCardId !== 1) setCard1Index(prev => (prev + 1) % card1Items.length);
      if (hoveredCardId !== 2) setCard2Index(prev => (prev + 1) % carouselItems.length);
      if (hoveredCardId !== 3) setCard3Index(prev => (prev + 1) % stackedRoles.length);
      if (hoveredCardId !== 5) setCard5Index(prev => (prev + 1) % card5Tasks.length);
      if (hoveredCardId !== 6) {
        setCard6BadgeIdx(prev => (prev + 1) % card6Badges.length);
        setCard6Progress(prev => (prev >= 98 ? 92 : prev + 3));
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [hoveredCardId, card1Items.length, carouselItems.length, stackedRoles.length, card5Tasks.length, card6Badges.length]);

  return (
    <section 
      id="matrix-section" 
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-7 scroll-mt-24 font-sans select-none"
    >
      
      {/* SECTION HEADER: COMPACT & SHARP */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200/90 pb-3 sm:pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] sm:text-xs font-bold font-heading uppercase tracking-wider mb-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span>{lang === 'en' ? 'INTELLIGENT STANDARDIZATION MATRIX' : 'MA TRẬN CHUẨN HÓA THÔNG MINH'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#072348] uppercase font-heading tracking-tight">
            {lang === 'en' ? '6-Stage & 18-Phase Technical Matrix' : 'Ma trận 6 Giai đoạn & 18 Pha kỹ thuật'}
          </h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 font-medium max-w-md md:text-right">
          {lang === 'en' 
            ? 'Standardized sequentially across Vietnam’s industrial production lifecycle with multi-dimensional interactive 3D motion.' 
            : 'Chuẩn hóa tuần tự theo vòng đời sản xuất tại Việt Nam với hiệu ứng tương tác 3D đa chiều.'}
        </div>
      </div>

      {/* 6-CARD STRICT EQUAL-HEIGHT GRID (NO OVERFLOW, STRICT PROPORTIONS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch" style={{ perspective: '1400px' }}>
        
        {/* =========================================================================
            CARD 1: GIAI ĐOẠN 01 - CHUẨN BỊ & ĐẦU TƯ
           ========================================================================= */}
        <div 
          onMouseEnter={() => setHoveredCardId(1)}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => navigate('/giai-doan/1')}
          className={`group rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-[390px] sm:h-[400px] cursor-pointer relative overflow-hidden transform-gpu hover:-translate-y-1 hover:shadow-xl ${
            activeStageHighlight === 1 || hoveredCardId === 1
              ? 'border-purple-400 shadow-lg shadow-purple-500/10 ring-2 ring-purple-400/20' 
              : 'border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-200/50 transition"></div>

          {/* Header (Fixed Height) */}
          <div className="space-y-1 relative z-10 h-[85px] flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 font-mono font-black text-[11px] flex items-center justify-center">
                  01
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-purple-600 font-heading">
                  {lang === 'en' ? 'STAGE 01 • 250+ ENTERPRISES' : 'GĐ 01 • 250+ DOANH NGHIỆP'}
                </span>
              </div>
              <span className="text-purple-600 font-heading text-xs font-bold flex items-center group-hover:translate-x-1 transition">
                {lang === 'en' ? 'Details →' : 'Chi tiết →'}
              </span>
            </div>

            <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-purple-700 transition truncate">
              {lang === 'en' ? 'Preparation & Investment' : 'Chuẩn bị & Đầu tư'}
            </h3>
            <p className="text-xs text-slate-500 leading-snug font-medium line-clamp-2">
              {lang === 'en' 
                ? 'Market feasibility research, legal due diligence & strategic IP site selection.' 
                : 'Khảo sát thị trường, thẩm định pháp lý & lựa chọn vị trí KCN chiến lược.'}
            </p>
          </div>

          {/* 3D Visual Canvas 1: Interactive Memory Card (Fixed Height 145px) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full h-[145px] max-h-[145px] rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-2.5 flex flex-col justify-center items-center text-center shadow-inner border border-slate-800 overflow-hidden"
          >
            {/* Interactive Selector Pills */}
            <div className="flex items-center justify-center space-x-1 mb-2 w-full">
              {card1Items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCard1Index(idx)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono transition-all ${
                    card1Index === idx 
                      ? 'bg-purple-600 text-white font-bold shadow' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

            <div className="w-full max-w-[240px] p-2 rounded-xl bg-slate-800/90 border border-purple-500/50 shadow-md backdrop-blur-md transition-all">
              <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-300 pb-1 border-b border-slate-700">
                <span className="text-purple-300 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                  {card1Items[card1Index].badge}
                </span>
                <span className="text-[9px] text-slate-400">{lang === 'en' ? 'Click to select' : 'Click để chọn'}</span>
              </div>
              <div className="pt-1 text-left">
                <div className="text-[11px] font-black text-white font-heading truncate">
                  {card1Items[card1Index].title}
                </div>
                <div className="text-[9.5px] text-purple-300 font-medium truncate mt-0.5">
                  {card1Items[card1Index].tag}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Phase Links (Fixed Height 90px) */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 relative z-10 h-[90px] flex flex-col justify-center">
            {stagesData[0].phases.map((ph) => (
              <Link
                key={ph.id}
                to={`/pha/${ph.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between py-0.5 px-2 rounded-md text-xs text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition group/phase font-medium"
              >
                <div className="flex items-center space-x-1.5 overflow-hidden">
                  <span className="font-mono text-[11px] font-bold text-purple-600 flex-shrink-0">{ph.id}</span>
                  <span className="truncate">{lang === 'en' ? (ph.titleEn || ph.title) : ph.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/phase:text-purple-600 group-hover/phase:translate-x-0.5 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CARD 2: GIAI ĐOẠN 02 - THIẾT KẾ & XÂY DỰNG
           ========================================================================= */}
        <div 
          onMouseEnter={() => setHoveredCardId(2)}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => navigate('/giai-doan/2')}
          className={`group rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-[390px] sm:h-[400px] cursor-pointer relative overflow-hidden transform-gpu hover:-translate-y-1 hover:shadow-xl ${
            activeStageHighlight === 2 || hoveredCardId === 2
              ? 'border-emerald-400 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/20' 
              : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-200/50 transition"></div>

          {/* Header */}
          <div className="space-y-1 relative z-10 h-[85px] flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-mono font-black text-[11px] flex items-center justify-center">
                  02
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-600 font-heading">
                  {lang === 'en' ? 'STAGE 02 • 320+ CONTRACTORS' : 'GĐ 02 • 320+ NHÀ THẦU'}
                </span>
              </div>
              <span className="text-emerald-600 font-heading text-xs font-bold flex items-center group-hover:translate-x-1 transition">
                {lang === 'en' ? 'Details →' : 'Chi tiết →'}
              </span>
            </div>

            <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-emerald-700 transition truncate">
              {lang === 'en' ? 'Design & Construction' : 'Thiết kế & Xây dựng'}
            </h3>
            <p className="text-xs text-slate-500 leading-snug font-medium line-clamp-2">
              {lang === 'en'
                ? 'Architectural master planning, MEP structure engineering and factory infrastructure EPC.'
                : 'Quy hoạch kiến trúc, thiết kế kết cấu MEP và thi công hạ tầng nhà xưởng.'}
            </p>
          </div>

          {/* 3D Visual Canvas 2: Interactive Carousel (Fixed Height 145px) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full h-[145px] max-h-[145px] rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-2.5 flex flex-col justify-center items-center shadow-inner border border-slate-800 space-y-1.5 overflow-hidden"
          >
            <div className="flex items-center justify-between w-full px-1 text-slate-400">
              <button 
                onClick={() => setCard2Index((prev) => (prev > 0 ? prev - 1 : carouselItems.length - 1))}
                className="hover:text-white p-1 hover:bg-slate-800 rounded-full transition"
                title={lang === 'en' ? "Previous phase" : "Pha trước"}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-3 py-1 rounded-xl bg-slate-800 border border-emerald-500 text-white font-black text-[11px] font-heading shadow-md flex items-center space-x-1.5 max-w-[170px] truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span className="truncate">{carouselItems[card2Index].label}</span>
              </div>

              <button 
                onClick={() => setCard2Index((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0))}
                className="hover:text-white p-1 hover:bg-slate-800 rounded-full transition"
                title={lang === 'en' ? "Next phase" : "Pha kế tiếp"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[9px] text-emerald-300 font-mono font-bold text-center truncate w-full px-2">
              {carouselItems[card2Index].sub}
            </div>

            {/* Clickable Dots */}
            <div className="flex items-center justify-center space-x-1 pt-1">
              {carouselItems.map((_, i) => (
                <button
                  key={i} 
                  onClick={() => setCard2Index(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    card2Index === i ? 'w-4 bg-emerald-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 3 Phase Links */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 relative z-10 h-[90px] flex flex-col justify-center">
            {stagesData[1].phases.map((ph) => (
              <Link
                key={ph.id}
                to={`/pha/${ph.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between py-0.5 px-2 rounded-md text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition group/phase font-medium"
              >
                <div className="flex items-center space-x-1.5 overflow-hidden">
                  <span className="font-mono text-[11px] font-bold text-emerald-600 flex-shrink-0">{ph.id}</span>
                  <span className="truncate">{lang === 'en' ? (ph.titleEn || ph.title) : ph.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/phase:text-emerald-600 group-hover/phase:translate-x-0.5 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CARD 3: GIAI ĐOẠN 03 - LẮP ĐẶT & HOÀN THIỆN
           ========================================================================= */}
        <div 
          onMouseEnter={() => setHoveredCardId(3)}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => navigate('/giai-doan/3')}
          className={`group rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-[390px] sm:h-[400px] cursor-pointer relative overflow-hidden transform-gpu hover:-translate-y-1 hover:shadow-xl ${
            activeStageHighlight === 3 || hoveredCardId === 3
              ? 'border-orange-400 shadow-lg shadow-orange-500/10 ring-2 ring-orange-400/20' 
              : 'border-slate-200 hover:border-orange-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-200/50 transition"></div>

          {/* Header */}
          <div className="space-y-1 relative z-10 h-[85px] flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-mono font-black text-[11px] flex items-center justify-center">
                  03
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-orange-600 font-heading">
                  {lang === 'en' ? 'STAGE 03 • 210+ SUPPLIERS' : 'GĐ 03 • 210+ NHÀ CUNG ỨNG'}
                </span>
              </div>
              <span className="text-orange-600 font-heading text-xs font-bold flex items-center group-hover:translate-x-1 transition">
                {lang === 'en' ? 'Details →' : 'Chi tiết →'}
              </span>
            </div>

            <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-orange-700 transition truncate">
              {lang === 'en' ? 'Installation & Commissioning' : 'Lắp đặt & Hoàn thiện'}
            </h3>
            <p className="text-xs text-slate-500 leading-snug font-medium line-clamp-2">
              {lang === 'en'
                ? 'Industrial machinery import, MEP line commissioning and fire safety acceptance.'
                : 'Nhập khẩu máy móc chuyên dụng, lắp đặt dây chuyền cơ điện và nghiệm thu PCCC.'}
            </p>
          </div>

          {/* 3D Visual Canvas 3: Interactive Stacked Roles (Fixed Height 145px) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full h-[145px] max-h-[145px] rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-2 flex flex-col justify-center items-center shadow-inner border border-slate-800 overflow-hidden"
          >
            <div className="relative w-full max-w-[240px] space-y-1">
              {stackedRoles.map((role, idx) => {
                const isSelected = card3Index === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setCard3Index(idx)}
                    className={`w-full p-1.5 rounded-lg transition-all duration-300 flex items-center justify-between text-[10px] font-bold text-left cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-800 border border-orange-500 text-white shadow-md scale-[1.02]' 
                        : 'bg-slate-850/60 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 truncate pr-1">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>}
                      <span className="truncate">{role.name}</span>
                    </div>
                    <span className={`font-mono text-[9px] ${role.color} shrink-0`}>
                      {role.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Phase Links */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 relative z-10 h-[90px] flex flex-col justify-center">
            {stagesData[2].phases.map((ph) => (
              <Link
                key={ph.id}
                to={`/pha/${ph.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between py-0.5 px-2 rounded-md text-xs text-slate-600 hover:text-orange-700 hover:bg-orange-50 transition group/phase font-medium"
              >
                <div className="flex items-center space-x-1.5 overflow-hidden">
                  <span className="font-mono text-[11px] font-bold text-orange-600 flex-shrink-0">{ph.id}</span>
                  <span className="truncate">{lang === 'en' ? (ph.titleEn || ph.title) : ph.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/phase:text-orange-600 group-hover/phase:translate-x-0.5 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CARD 4: GIAI ĐOẠN 04 - VẬN HÀNH SẢN XUẤT
           ========================================================================= */}
        <div 
          onMouseEnter={() => setHoveredCardId(4)}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => navigate('/giai-doan/4')}
          className={`group rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-[390px] sm:h-[400px] cursor-pointer relative overflow-hidden transform-gpu hover:-translate-y-1 hover:shadow-xl ${
            activeStageHighlight === 4 || hoveredCardId === 4
              ? 'border-blue-400 shadow-lg shadow-blue-500/10 ring-2 ring-blue-400/20' 
              : 'border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-200/50 transition"></div>

          {/* Header */}
          <div className="space-y-1 relative z-10 h-[85px] flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-mono font-black text-[11px] flex items-center justify-center">
                  04
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-blue-600 font-heading">
                  {lang === 'en' ? 'STAGE 04 • 580+ SUPPLIERS' : 'GĐ 04 • 580+ NHÀ CUNG CẤP'}
                </span>
              </div>
              <span className="text-blue-600 font-heading text-xs font-bold flex items-center group-hover:translate-x-1 transition">
                {lang === 'en' ? 'Details →' : 'Chi tiết →'}
              </span>
            </div>

            <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-blue-700 transition truncate">
              {lang === 'en' ? 'Production Operations' : 'Vận hành Sản xuất'}
            </h3>
            <p className="text-xs text-slate-500 leading-snug font-medium line-clamp-2">
              {lang === 'en'
                ? 'Raw materials & consumable sourcing, machine preventive maintenance and QA/QC management.'
                : 'Cung ứng nguyên phụ liệu, vật tư tiêu hao, bảo trì thiết bị và quản trị QC.'}
            </p>
          </div>

          {/* 3D Visual Canvas 4: Interactive Circuit Nodes (Fixed Height 145px) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full h-[145px] max-h-[145px] rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-2.5 flex flex-col justify-center items-center shadow-inner border border-slate-800 overflow-hidden"
          >
            <div className="relative flex items-center justify-center w-full">
              <div className="absolute w-36 h-0.5 bg-gradient-to-r from-blue-500/20 via-blue-400 to-blue-500/20"></div>
              
              <button 
                onClick={() => setCard4Tab('nvl')}
                className={`absolute left-2 px-2 py-1 rounded-lg border text-[9px] font-bold transition-all ${
                  card4Tab === 'nvl' ? 'bg-blue-600 text-white border-blue-400 shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                📦 {lang === 'en' ? 'Materials' : 'NVL'}
              </button>

              <button 
                onClick={() => setCard4Tab('hub')}
                className="relative p-1.5 rounded-xl bg-slate-800 border-2 border-blue-500 shadow-md hover:scale-105 transition"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                </div>
              </button>

              <button 
                onClick={() => setCard4Tab('baotri')}
                className={`absolute right-2 px-2 py-1 rounded-lg border text-[9px] font-bold transition-all ${
                  card4Tab === 'baotri' ? 'bg-blue-600 text-white border-blue-400 shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🔧 {lang === 'en' ? 'Maintenance' : 'Bảo trì'}
              </button>
            </div>

            <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-blue-500/40 text-blue-300 text-[9.5px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              <span>
                {lang === 'en'
                  ? (card4Tab === 'nvl' ? 'STANDARDIZED JIT SOURCING' : card4Tab === 'baotri' ? '24/7 PREVENTIVE MAINTENANCE' : 'ACTIVE ONLINE SUPPLY CHAIN')
                  : (card4Tab === 'nvl' ? 'VẬT TƯ JIT CHUẨN HÓA' : card4Tab === 'baotri' ? 'BẢO TRÌ ĐỊNH KỲ 24/7' : 'CHUỖI KẾT NỐI ONLINE')}
              </span>
            </div>
          </div>

          {/* 3 Phase Links */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 relative z-10 h-[90px] flex flex-col justify-center">
            {stagesData[3].phases.map((ph) => (
              <Link
                key={ph.id}
                to={`/pha/${ph.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between py-0.5 px-2 rounded-md text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition group/phase font-medium"
              >
                <div className="flex items-center space-x-1.5 overflow-hidden">
                  <span className="font-mono text-[11px] font-bold text-blue-600 flex-shrink-0">{ph.id}</span>
                  <span className="truncate">{lang === 'en' ? (ph.titleEn || ph.title) : ph.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/phase:text-blue-600 group-hover/phase:translate-x-0.5 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CARD 5: GIAI ĐOẠN 05 - NHÂN SỰ & HẬU CẦN
           ========================================================================= */}
        <div 
          onMouseEnter={() => setHoveredCardId(5)}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => navigate('/giai-doan/5')}
          className={`group rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-[390px] sm:h-[400px] cursor-pointer relative overflow-hidden transform-gpu hover:-translate-y-1 hover:shadow-xl ${
            activeStageHighlight === 5 || hoveredCardId === 5
              ? 'border-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/20' 
              : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-200/50 transition"></div>

          {/* Header */}
          <div className="space-y-1 relative z-10 h-[85px] flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 font-mono font-black text-[11px] flex items-center justify-center">
                  05
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-600 font-heading">
                  {lang === 'en' ? 'STAGE 05 • 340+ SERVICES' : 'GĐ 05 • 340+ ĐƠN VỊ DỊCH VỤ'}
                </span>
              </div>
              <span className="text-amber-600 font-heading text-xs font-bold flex items-center group-hover:translate-x-1 transition">
                {lang === 'en' ? 'Details →' : 'Chi tiết →'}
              </span>
            </div>

            <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-amber-700 transition truncate">
              {lang === 'en' ? 'Workforce & Logistics' : 'Nhân sự & Hậu cần'}
            </h3>
            <p className="text-xs text-slate-500 leading-snug font-medium line-clamp-2">
              {lang === 'en'
                ? 'High-skill technical recruiting, bonded warehousing and IP industrial catering services.'
                : 'Tuyển dụng lao động kỹ thuật cao, dịch vụ kho bãi và cung ứng suất ăn KCN.'}
            </p>
          </div>

          {/* 3D Visual Canvas 5: Interactive Live Tasks (Fixed Height 145px) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full h-[145px] max-h-[145px] rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-2 flex flex-col justify-center items-center shadow-inner border border-slate-800 space-y-1 overflow-hidden"
          >
            <div className="w-full max-w-[240px] px-2 py-0.5 rounded-lg bg-slate-800 border border-amber-500/40 flex items-center justify-between text-[10px] font-bold text-amber-300 font-mono">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
                {lang === 'en' ? 'Logistics Orchestration' : 'Điều phối Logistics'}
              </span>
              <span className="text-[9px] text-slate-400">{lang === 'en' ? 'Click to view' : 'Click xem'}</span>
            </div>

            <div className="w-full max-w-[240px] space-y-1 text-[9.5px]">
              {card5Tasks.map((task, idx) => {
                const isSelected = card5Index === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setCard5Index(idx)}
                    className={`w-full p-1 rounded-lg border transition-all flex items-center justify-between text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-white font-bold shadow'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 truncate pr-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${task.dot} shrink-0`}></span>
                      <span className="truncate">{task.text}</span>
                    </div>
                    <span className="text-[8.5px] font-mono text-emerald-400 shrink-0">{task.status}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Phase Links */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 relative z-10 h-[90px] flex flex-col justify-center">
            {stagesData[4].phases.map((ph) => (
              <Link
                key={ph.id}
                to={`/pha/${ph.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between py-0.5 px-2 rounded-md text-xs text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition group/phase font-medium"
              >
                <div className="flex items-center space-x-1.5 overflow-hidden">
                  <span className="font-mono text-[11px] font-bold text-amber-600 flex-shrink-0">{ph.id}</span>
                  <span className="truncate">{lang === 'en' ? (ph.titleEn || ph.title) : ph.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/phase:text-amber-600 group-hover/phase:translate-x-0.5 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CARD 6: GIAI ĐOẠN 06 - MỞ RỘNG & TỐI ƯU HÓA
           ========================================================================= */}
        <div 
          onMouseEnter={() => setHoveredCardId(6)}
          onMouseLeave={() => setHoveredCardId(null)}
          onClick={() => navigate('/giai-doan/6')}
          className={`group rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-[390px] sm:h-[400px] cursor-pointer relative overflow-hidden transform-gpu hover:-translate-y-1 hover:shadow-xl ${
            activeStageHighlight === 6 || hoveredCardId === 6
              ? 'border-red-400 shadow-lg shadow-red-500/10 ring-2 ring-red-400/20' 
              : 'border-slate-200 hover:border-red-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-red-200/50 transition"></div>

          {/* Header */}
          <div className="space-y-1 relative z-10 h-[85px] flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-md bg-red-100 text-red-700 font-mono font-black text-[11px] flex items-center justify-center">
                  06
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-600 font-heading">
                  {lang === 'en' ? 'STAGE 06 • 190+ EXPERTS' : 'GĐ 06 • 190+ CHUYÊN GIA'}
                </span>
              </div>
              <span className="text-red-600 font-heading text-xs font-bold flex items-center group-hover:translate-x-1 transition">
                {lang === 'en' ? 'Details →' : 'Chi tiết →'}
              </span>
            </div>

            <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-red-700 transition truncate">
              {lang === 'en' ? 'Expansion & Optimization' : 'Mở rộng – Tối ưu hóa'}
            </h3>
            <p className="text-xs text-slate-500 leading-snug font-medium line-clamp-2">
              {lang === 'en'
                ? 'Digital transformation, smart factory IoT, ESG green certification and ISO export compliance.'
                : 'Chuyển đổi số, IoT nhà máy thông minh, chứng nhận ESG và xuất khẩu ISO.'}
            </p>
          </div>

          {/* 3D Visual Canvas 6: Interactive Certifications (Fixed Height 145px) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full h-[145px] max-h-[145px] rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-2.5 flex flex-col justify-center items-center shadow-inner border border-slate-800 space-y-1.5 overflow-hidden"
          >
            <div className="flex items-center space-x-2 w-full max-w-[240px]">
              <div className="p-1 rounded-full bg-slate-800 border border-red-500/50 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block"></span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-[9.5px] font-bold text-slate-300 font-mono flex items-center justify-between">
                  <span>{lang === 'en' ? 'Supply Chain Optimization' : 'Tối ưu hóa chuỗi'}</span>
                  <span className="text-red-400 font-black">{card6Progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-500" 
                    style={{ width: `${card6Progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Clickable Certifications Selector */}
            <div className="w-full max-w-[240px] flex items-center justify-between gap-1 pt-0.5">
              {card6Badges.map((badge, idx) => (
                <button
                  key={idx}
                  onClick={() => setCard6BadgeIdx(idx)}
                  className={`flex-1 py-1 px-1 rounded-md text-[8px] font-mono font-bold border transition-all truncate ${
                    card6BadgeIdx === idx 
                      ? 'bg-slate-800 border-red-400 text-white shadow' 
                      : 'bg-slate-850/50 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {badge.iso.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className={`w-full max-w-[240px] px-2 py-0.5 rounded-lg bg-slate-800/90 border ${card6Badges[card6BadgeIdx].color} text-[9px] font-mono flex items-center justify-between font-bold shadow truncate`}>
              <span className="truncate">🌿 {card6Badges[card6BadgeIdx].label}</span>
              <span className="text-slate-300 font-mono shrink-0">{card6Badges[card6BadgeIdx].iso}</span>
            </div>
          </div>

          {/* 3 Phase Links */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 relative z-10 h-[90px] flex flex-col justify-center">
            {stagesData[5].phases.map((ph) => (
              <Link
                key={ph.id}
                to={`/pha/${ph.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between py-0.5 px-2 rounded-md text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 transition group/phase font-medium"
              >
                <div className="flex items-center space-x-1.5 overflow-hidden">
                  <span className="font-mono text-[11px] font-bold text-red-600 flex-shrink-0">{ph.id}</span>
                  <span className="truncate">{lang === 'en' ? (ph.titleEn || ph.title) : ph.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/phase:text-red-600 group-hover/phase:translate-x-0.5 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
