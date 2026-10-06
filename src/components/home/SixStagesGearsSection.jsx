import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, PlusCircle, CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';

export const SIX_STAGES_GEARS = [
  {
    id: 1,
    num: "01",
    title: "CHUẨN BỊ & ĐẦU TƯ",
    shortTitle: "Chuẩn bị & Đầu tư",
    slug: "/giai-doan/chuan-bi-dau-tu",
    keywords: ["Khảo sát", "Pháp lý", "Mặt bằng"],
    color: "#8b5cf6", // Purple
    lightBg: "bg-purple-50",
    badgeBorder: "border-purple-200",
    badgeText: "text-purple-700",
    badgeBg: "bg-purple-50",
    glowColor: "rgba(139, 92, 246, 0.28)",
    activeBorder: "border-purple-500",
    isClockwise: true,
    cx: 140,
    cy: 150,
  },
  {
    id: 2,
    num: "02",
    title: "THIẾT KẾ & XÂY DỰNG",
    shortTitle: "Thiết kế & Xây dựng",
    slug: "/giai-doan/thiet-ke-xay-dung",
    keywords: ["Thiết kế", "Xây dựng", "M&E"],
    color: "#10b981", // Emerald
    lightBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-700",
    badgeBg: "bg-emerald-50",
    glowColor: "rgba(16, 185, 129, 0.28)",
    activeBorder: "border-emerald-500",
    isClockwise: false,
    cx: 299.6,
    cy: 263.8,
  },
  {
    id: 3,
    num: "03",
    title: "LẮP ĐẶT & HOÀN THIỆN",
    shortTitle: "Lắp đặt & Hoàn thiện",
    slug: "/giai-doan/lap-dat-hoan-thien",
    keywords: ["Máy móc", "Dây chuyền", "Chạy thử"],
    color: "#f97316", // Orange
    lightBg: "bg-orange-50",
    badgeBorder: "border-orange-200",
    badgeText: "text-orange-700",
    badgeBg: "bg-orange-50",
    glowColor: "rgba(249, 115, 22, 0.28)",
    activeBorder: "border-orange-500",
    isClockwise: true,
    cx: 459.2,
    cy: 150,
  },
  {
    id: 4,
    num: "04",
    title: "VẬN HÀNH SẢN XUẤT",
    shortTitle: "Vận hành Sản xuất",
    slug: "/giai-doan/van-hanh-san-xuat",
    keywords: ["Nguyên liệu", "Sản xuất", "Logistics"],
    color: "#0284c7", // Blue / Sky
    lightBg: "bg-sky-50",
    badgeBorder: "border-sky-200",
    badgeText: "text-sky-700",
    badgeBg: "bg-sky-50",
    glowColor: "rgba(2, 132, 199, 0.28)",
    activeBorder: "border-sky-500",
    isClockwise: false,
    cx: 618.8,
    cy: 263.8,
  },
  {
    id: 5,
    num: "05",
    title: "NHÂN SỰ & HẬU CẦN",
    shortTitle: "Nhân sự & Hậu cần",
    slug: "/giai-doan/nhan-su-hau-can",
    keywords: ["Tuyển dụng", "Phúc lợi", "Đồng phục & Bảo hộ"],
    color: "#eab308", // Yellow / Gold
    lightBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-800",
    badgeBg: "bg-amber-50",
    glowColor: "rgba(234, 179, 8, 0.28)",
    activeBorder: "border-amber-500",
    isClockwise: true,
    cx: 778.4,
    cy: 150,
  },
  {
    id: 6,
    num: "06",
    title: "MỞ RỘNG – TỐI ƯU – CHUYỂN ĐỔI",
    shortTitle: "Mở rộng & Chuyển đổi",
    slug: "/giai-doan/mo-rong-toi-uu-chuyen-doi",
    keywords: ["Mở rộng", "Chuẩn hóa", "Chuyển đổi"],
    color: "#ef4444", // Red / Rose
    lightBg: "bg-rose-50",
    badgeBorder: "border-rose-200",
    badgeText: "text-rose-700",
    badgeBg: "bg-rose-50",
    glowColor: "rgba(239, 68, 68, 0.28)",
    activeBorder: "border-rose-500",
    isClockwise: false,
    cx: 938.0,
    cy: 263.8,
  },
];

// Precision Parametric SVG Spur Gear Generator
function buildGearSvgPath(cx, cy, rOuter, rPitch, rInner, teeth = 16) {
  const step = (Math.PI * 2) / teeth;
  const toothAngle = step * 0.46;
  const tipAngle = toothAngle * 0.52;

  let d = '';
  for (let i = 0; i < teeth; i++) {
    const midA = i * step;
    const a0 = midA - step * 0.5;
    const a1 = midA - toothAngle * 0.5;
    const a2 = midA - tipAngle * 0.5;
    const a3 = midA + tipAngle * 0.5;
    const a4 = midA + toothAngle * 0.5;
    const a5 = midA + step * 0.5;

    const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;

    if (i === 0) {
      d += `M ${p(rInner, a0)}`;
    } else {
      d += ` L ${p(rInner, a0)}`;
    }
    d += ` L ${p(rInner, a1)}`;
    d += ` L ${p(rOuter, a2)}`;
    d += ` L ${p(rOuter, a3)}`;
    d += ` L ${p(rInner, a4)}`;
    d += ` L ${p(rInner, a5)}`;
  }
  d += ' Z';
  return d;
}

export default function SixStagesGearsSection() {
  const navigate = useNavigate();
  const [activeGear, setActiveGear] = useState(0);
  const [hoveredGear, setHoveredGear] = useState(null);
  const [keywordIndices, setKeywordIndices] = useState([0, 0, 0, 0, 0, 0]);

  // Auto-advance active gear every 2.8s and cycle its keyword
  useEffect(() => {
    if (hoveredGear !== null) return;

    const interval = setInterval(() => {
      setActiveGear((prev) => {
        const next = (prev + 1) % SIX_STAGES_GEARS.length;
        setKeywordIndices((curr) => {
          const updated = [...curr];
          updated[next] = (updated[next] + 1) % 3;
          return updated;
        });
        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [hoveredGear]);

  // Current effective highlighted stage
  const effectiveActive = hoveredGear !== null ? hoveredGear : activeGear;

  // Single gear SVG path for a 220x220 canvas
  const gearPath = React.useMemo(() => buildGearSvgPath(110, 110, 108, 98, 88, 16), []);

  return (
    <section 
      id="chuoi-6-giai-doan" 
      aria-label="6 Giai Đoạn Chuỗi Cung Ứng" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
    >
      {/* Scoped CSS animations for precision gear rotation */}
      <style>{`
        @keyframes gearSpinCw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gearSpinCcw {
          from { transform: rotate(11.25deg); }
          to { transform: rotate(-348.75deg); }
        }
        .animate-gear-cw {
          animation: gearSpinCw 42s linear infinite;
          transform-origin: center center;
        }
        .animate-gear-ccw {
          animation: gearSpinCcw 42s linear infinite;
          transform-origin: center center;
        }
        .gear-paused {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-gear-cw,
          .animate-gear-ccw {
            animation: none !important;
          }
        }
      `}</style>

      {/* Outer Hardware Shell matching Image 2's design system */}
      <div className="bg-slate-100/80 p-2.5 sm:p-3.5 rounded-[2.5rem] ring-1 ring-slate-900/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        
        {/* Inner Core Container */}
        <div className="bg-white rounded-[calc(2.5rem-0.75rem)] p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden space-y-8">
          
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50/60 to-purple-50/30 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-gradient-to-tr from-emerald-50/50 to-sky-50/40 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28" />

          {/* 1. Header: Strictly follows prompt message & SEO H2 */}
          <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[#0052cc] text-xs font-bold uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse" />
              <span>VÒNG ĐỜI DỰ ÁN LIÊN HOÀN · BẢN ĐỒ 6 GIAI ĐOẠN</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight">
              6 GIAI ĐOẠN – MỘT CHUỖI VẬN HÀNH LIÊN TỤC
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto text-center leading-relaxed font-normal">
              Từ chuẩn bị đầu tư đến vận hành và mở rộng, mỗi giai đoạn phát sinh những nhu cầu khác nhau. CHUOICUNGUNG.COM giúp doanh nghiệp tìm đúng nguồn cung và kết nối đúng năng lực tại từng thời điểm.
            </p>
          </div>

          {/* =========================================================================
              2. DESKTOP & TABLET VIEW: FULL INTERLOCKING MECHANICAL GEAR TRAIN
             ========================================================================= */}
          <div className="hidden md:block relative z-10 w-full pt-4 pb-2">
            
            {/* Aspect Ratio Container for 100% Mathematical Contact Preservation */}
            <div className="relative w-full max-w-[1080px] mx-auto" style={{ paddingBottom: '41%' }}>
              
              {/* Kinematic Axis Transmission Guide SVG in Background */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1080 440"
                fill="none"
              >
                {/* Connecting Axis Transmission Path */}
                <path
                  d="M 140 150 L 299.6 263.8 L 459.2 150 L 618.8 263.8 L 778.4 150 L 938.0 263.8"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                
                {/* Flow Direction Chevron Indicators between Gears */}
                {[
                  { x: (140 + 299.6) / 2, y: (150 + 263.8) / 2 },
                  { x: (299.6 + 459.2) / 2, y: (263.8 + 150) / 2 },
                  { x: (459.2 + 618.8) / 2, y: (150 + 263.8) / 2 },
                  { x: (618.8 + 778.4) / 2, y: (263.8 + 150) / 2 },
                  { x: (778.4 + 938.0) / 2, y: (150 + 263.8) / 2 },
                ].map((pt, idx) => (
                  <circle
                    key={`node-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#94a3b8"
                    className="transition-all duration-300"
                  />
                ))}
              </svg>

              {/* Render the 6 Interlocking Gears */}
              {SIX_STAGES_GEARS.map((stage, idx) => {
                const isActive = effectiveActive === idx;
                const isHovered = hoveredGear === idx;
                const currentKeyword = stage.keywords[keywordIndices[idx] || 0];

                // Coordinates in percentage
                const leftPct = ((stage.cx / 1080) * 100).toFixed(3);
                const topPct = ((stage.cy / 440) * 100).toFixed(3);
                const sizePct = ((220 / 1080) * 100).toFixed(3);

                return (
                  <div
                    key={stage.id}
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${sizePct}%`,
                      zIndex: isActive ? 30 : 20 - idx,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 aspect-square cursor-pointer transition-transform duration-300 ${
                      isActive ? 'scale-[1.03]' : 'scale-100'
                    }`}
                    onMouseEnter={() => setHoveredGear(idx)}
                    onMouseLeave={() => setHoveredGear(null)}
                    onClick={() => navigate(stage.slug)}
                    aria-label={`Giai đoạn ${stage.num}: ${stage.title}`}
                  >
                    {/* Gear Wheel SVG (Rotating Teeth & Machined Chamfer) */}
                    <svg
                      viewBox="0 0 220 220"
                      className={`absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm transition-all duration-300 ${
                        stage.isClockwise ? 'animate-gear-cw' : 'animate-gear-ccw'
                      } ${isHovered ? 'gear-paused' : ''}`}
                    >
                      <defs>
                        <radialGradient id={`gearGrad-${stage.id}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#f8fafc" />
                          <stop offset="70%" stopColor="#e2e8f0" />
                          <stop offset="100%" stopColor="#cbd5e1" />
                        </radialGradient>
                        <radialGradient id={`gearGradActive-${stage.id}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="70%" stopColor="#f1f5f9" />
                          <stop offset="100%" stopColor={stage.color} stopOpacity="0.4" />
                        </radialGradient>
                      </defs>

                      {/* Precision Cut Spur Teeth */}
                      <path
                        d={gearPath}
                        fill={isActive ? `url(#gearGradActive-${stage.id})` : `url(#gearGrad-${stage.id})`}
                        stroke={isActive ? stage.color : '#94a3b8'}
                        strokeWidth={isActive ? '2' : '1.5'}
                        strokeLinejoin="round"
                        className="transition-colors duration-300"
                      />

                      {/* Concentric Pitch Machining Circle */}
                      <circle
                        cx="110"
                        cy="110"
                        r="98"
                        fill="none"
                        stroke={isActive ? stage.color : '#cbd5e1'}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        opacity={isActive ? '0.7' : '0.4'}
                      />

                      {/* Chamfer Bezel Ring */}
                      <circle
                        cx="110"
                        cy="110"
                        r="84"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1"
                        opacity="0.5"
                      />

                      {/* 6 Precision Web Cutout Holes for Industrial Realism */}
                      {[0, 60, 120, 180, 240, 300].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        const hx = 110 + 74 * Math.cos(rad);
                        const hy = 110 + 74 * Math.sin(rad);
                        return (
                          <circle
                            key={deg}
                            cx={hx}
                            cy={hy}
                            r="4.5"
                            fill="#f8fafc"
                            stroke="#cbd5e1"
                            strokeWidth="1"
                          />
                        );
                      })}
                    </svg>

                    {/* Central Stationary Hub: 100% Upright, Crisp Typography, Accessible Link */}
                    <div
                      style={{
                        boxShadow: isActive ? `0 12px 28px -6px ${stage.glowColor}` : '0 4px 14px rgba(0,0,0,0.06)',
                      }}
                      className={`absolute inset-[17%] rounded-full bg-white transition-all duration-300 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center border overflow-hidden ${
                        isActive
                          ? `${stage.activeBorder} ring-2 ring-blue-500/20 shadow-md`
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Authentic Brand Asset: logo_only.png as Subtle Central Watermark */}
                      <img
                        src="/logo_only.png"
                        alt="CCU Logo Watermark"
                        className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 object-contain pointer-events-none opacity-[0.09] select-none"
                      />

                      {/* Top: Stage Number Pill */}
                      <div className="relative z-10 pt-0.5">
                        <span
                          className={`font-mono text-[10px] sm:text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full border ${stage.badgeBorder} ${stage.badgeText} ${stage.badgeBg}`}
                        >
                          {stage.num}
                        </span>
                      </div>

                      {/* Middle: Stage Title (Clean, 2-line maximum) */}
                      <div className="relative z-10 px-1">
                        <h3 className="text-[10px] sm:text-[11px] lg:text-[12px] font-black uppercase text-slate-900 font-heading leading-tight tracking-tight line-clamp-2">
                          {stage.shortTitle}
                        </h3>
                      </div>

                      {/* Bottom: Cycling Keyword or Hover All Keywords */}
                      <div className="relative z-10 w-full pb-0.5">
                        {isHovered ? (
                          <div className="flex flex-col items-center gap-1 animate-fadeIn">
                            <span 
                              className="text-[9px] sm:text-[10px] font-bold text-white px-2 py-0.5 rounded-md shadow-xs transition-transform transform scale-105"
                              style={{ backgroundColor: stage.color }}
                            >
                              Khám phá →
                            </span>
                          </div>
                        ) : (
                          <div className="h-5 flex items-center justify-center">
                            <span
                              key={currentKeyword}
                              style={{
                                color: isActive ? stage.color : '#475569',
                                backgroundColor: isActive ? `${stage.color}14` : '#f1f5f9',
                                borderColor: isActive ? `${stage.color}40` : '#e2e8f0',
                              }}
                              className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border truncate max-w-[120px] transition-all duration-300 animate-fadeIn"
                            >
                              {currentKeyword}
                            </span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Desktop Hover Floating Details Card */}
                    {isHovered && (
                      <div 
                        className="absolute left-1/2 -bottom-16 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white rounded-xl py-1.5 px-3 shadow-xl z-50 pointer-events-none whitespace-nowrap border border-slate-700/80 animate-fadeIn flex items-center gap-2"
                      >
                        <span className="text-[11px] font-mono text-amber-300 font-bold">Từ khóa:</span>
                        <span className="text-[11px] text-slate-200">
                          {stage.keywords.join(' · ')}
                        </span>
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </div>

          {/* =========================================================================
              3. MOBILE VIEW: 2 COLUMNS X 3 ROWS GRID WITH REAL GEAR MECHANISM
             ========================================================================= */}
          <div className="block md:hidden relative z-10 space-y-4">
            
            {/* Active Stage Live Monitor Pill on Mobile */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: SIX_STAGES_GEARS[effectiveActive].color }}
                />
                <span className="font-mono font-bold text-slate-700">
                  Giai đoạn {SIX_STAGES_GEARS[effectiveActive].num}:
                </span>
                <span className="font-semibold text-slate-900 truncate max-w-[150px]">
                  {SIX_STAGES_GEARS[effectiveActive].shortTitle}
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {keywordIndices[effectiveActive] + 1}/3
              </span>
            </div>

            {/* 6 Responsive Stage Cards */}
            <div className="grid grid-cols-2 gap-3">
              {SIX_STAGES_GEARS.map((stage, idx) => {
                const isActive = effectiveActive === idx;
                const currentKeyword = stage.keywords[keywordIndices[idx] || 0];

                return (
                  <div
                    key={`mobile-stage-${stage.id}`}
                    onClick={() => navigate(stage.slug)}
                    className={`rounded-2xl p-3.5 bg-white border transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer relative overflow-hidden ${
                      isActive
                        ? `border-2 shadow-lg ring-2 ring-blue-500/10 -translate-y-0.5`
                        : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                    }`}
                    style={{
                      borderColor: isActive ? stage.color : undefined,
                    }}
                  >
                    {/* Header: Stage Number & Rotating Gear Visual */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-xs font-black px-2 py-0.5 rounded-full border ${stage.badgeBorder} ${stage.badgeText} ${stage.badgeBg}`}
                      >
                        {stage.num}
                      </span>

                      {/* Compact Animated Mini Gear */}
                      <div className="relative w-8 h-8 shrink-0">
                        <svg
                          viewBox="0 0 220 220"
                          className={`w-full h-full pointer-events-none ${
                            stage.isClockwise ? 'animate-gear-cw' : 'animate-gear-ccw'
                          }`}
                        >
                          <path
                            d={gearPath}
                            fill={isActive ? `${stage.color}20` : '#f1f5f9'}
                            stroke={isActive ? stage.color : '#94a3b8'}
                            strokeWidth="2.5"
                          />
                          <circle cx="110" cy="110" r="45" fill="#ffffff" stroke={stage.color} strokeWidth="2" />
                        </svg>
                        <img
                          src="/logo_only.png"
                          alt="CCU"
                          className="absolute inset-0 m-auto w-4 h-4 object-contain opacity-40 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase text-slate-900 font-heading leading-tight line-clamp-2">
                        {stage.shortTitle}
                      </h3>
                      
                      {/* Rotating Keyword Badge */}
                      <div className="pt-0.5">
                        <span
                          style={{
                            color: stage.color,
                            backgroundColor: `${stage.color}14`,
                            borderColor: `${stage.color}35`,
                          }}
                          className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border truncate max-w-full"
                        >
                          {currentKeyword}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Card Footer Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0052cc]">
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* =========================================================================
              4. DUAL CALL TO ACTION BUTTONS (STRICTLY REQUIRED BY PROMPT)
             ========================================================================= */}
          <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            
            {/* Primary CTA */}
            <Link
              to="/ban-do-6-giai-doan"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold uppercase font-heading tracking-wider rounded-xl shadow-md shadow-blue-900/15 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
              <span>KHÁM PHÁ BẢN ĐỒ 6 GIAI ĐOẠN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/dang-nhu-cau"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 hover:text-[#0052cc] border border-slate-200 hover:border-blue-300 text-xs sm:text-sm font-bold uppercase font-heading tracking-wider rounded-xl shadow-2xs transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#0052cc]" />
              <span>ĐĂNG NHU CẦU</span>
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}
