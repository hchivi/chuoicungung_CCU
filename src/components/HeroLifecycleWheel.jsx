import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function HeroLifecycleWheel({ activeStageId = null, onSelectStage = null }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [hoveredStage, setHoveredStage] = useState(activeStageId || null);
  const containerRef = useRef(null);

  // 3D Motion States for Scroll & Mouse Parallax
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // 6 Stages positioned exactly per user's directional adjustments
  const stages = [
    {
      id: 1,
      num: "01",
      singleNum: "1",
      title1: t('wheel.s1_line1'),
      title2: t('wheel.s1_line2'),
      color: "#6b21a8",
      lightColor: "#8b5cf6",
      pos: { x: 242, y: 82 }, // Đẩy nhẹ qua trái
    },
    {
      id: 2,
      num: "02",
      singleNum: "2",
      title1: t('wheel.s2_line1'),
      title2: t('wheel.s2_line2'),
      color: "#047857",
      lightColor: "#10b981",
      pos: { x: 420, y: 158 }, // Đẩy nhẹ lên trên nữa
    },
    {
      id: 3,
      num: "03",
      singleNum: "3",
      title1: t('wheel.s3_line1'),
      title2: t('wheel.s3_line2'),
      color: "#c2410c",
      lightColor: "#f97316",
      pos: { x: 426, y: 340 }, // Đẩy qua phải nhẹ và đẩy lên trên
    },
    {
      id: 4,
      num: "04",
      singleNum: "4",
      title1: t('wheel.s4_line1'),
      title2: t('wheel.s4_line2'),
      color: "#0369a1",
      lightColor: "#0284c7",
      pos: { x: 260, y: 452 }, // Đẩy nhẹ xuống
    },
    {
      id: 5,
      num: "05",
      singleNum: "5",
      title1: t('wheel.s5_line1'),
      title2: t('wheel.s5_line2'),
      color: "#b45309",
      lightColor: "#eab308",
      pos: { x: 88, y: 348 }, // Đẩy xuống dưới nữa
    },
    {
      id: 6,
      num: "06",
      singleNum: "6",
      title1: t('wheel.s6_line1'),
      title2: t('wheel.s6_line2'),
      color: "#b91c1c",
      lightColor: "#ef4444",
      pos: { x: 100, y: 180 }, // Đẩy nhẹ lên trên
    }
  ];

  // 1. SCROLL-DRIVEN ZOOM & ROTATION ANIMATION LISTENER
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const delta = (elementCenter - viewportCenter) / (windowHeight / 2);
          
          const clamped = Math.max(-1.5, Math.min(1.5, delta));
          setScrollProgress(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. MOUSE 3D PARALLAX INTERACTION
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 16, y: -y * 16 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    setHoveredStage(null);
  };

  const handleStageClick = (id) => {
    if (onSelectStage) {
      onSelectStage(id);
    } else {
      navigate(`/giai-doan/${id}`);
    }
  };

  const activeStage = stages.find(s => s.id === hoveredStage) || null;

  // Dynamic Scroll Zoom & Gentle Scroll-Driven Rotation Values
  const scrollZoom = 1 + Math.max(0, (1 - Math.abs(scrollProgress))) * 0.08;
  const rotateX = -scrollProgress * 6 + mouseTilt.y * 0.8;
  const rotateY = scrollProgress * 6 + mouseTilt.x * 0.8;
  const rotateZ = -scrollProgress * 18 + (mouseTilt.x * 0.3); // Gentle scroll rotation (~18deg)
  const translateZ = Math.max(0, (1 - Math.abs(scrollProgress)) * 20);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[540px] aspect-square flex items-center justify-center select-none group mx-auto perspective-1000 overflow-visible font-heading"
      style={{ perspective: '1200px' }}
    >
      
      {/* 3D Floating Glow Aura Beneath the Flower */}
      <div 
        className="absolute w-4/5 h-4/5 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-700 -z-10"
        style={{
          backgroundColor: activeStage ? activeStage.lightColor : '#0284c7',
          transform: `translate3d(${mouseTilt.x * 2.5}px, ${-mouseTilt.y * 2.5 + 30}px, -40px) scale(${scrollZoom})`
        }}
      ></div>

      {/* 3D Transformed Wheel Container with Gentle Scroll-Driven Rotation */}
      <div 
        className="w-full h-full flex items-center justify-center will-change-transform font-heading transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scrollZoom.toFixed(3)}) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) translateZ(${translateZ.toFixed(1)}px)`
        }}
      >

        {/* SVG Canvas for 6-Petal Flower (520x520) */}
        <svg 
          viewBox="0 0 520 520" 
          className="w-full h-full drop-shadow-2xl overflow-visible font-heading"
        >
          <defs>
            <filter id="flower-shadow-3d" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#072348" floodOpacity="0.22" />
            </filter>
            
            <filter id="pill-shadow-3d" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#000" floodOpacity="0.32" />
            </filter>

            <filter id="center-glow-3d" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#0052cc" floodOpacity="0.25" />
            </filter>

            <filter id="text-shadow-crisp" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
            </filter>

            <filter id="petal-luminous-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="pillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="centerJewelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a2e5c" />
              <stop offset="50%" stopColor="#072348" />
              <stop offset="100%" stopColor="#04142b" />
            </linearGradient>
          </defs>

          {/* 1. ORIGINAL 6-PETAL FLOWER EMBLEM (logo_only.png) */}
          <g filter="url(#flower-shadow-3d)">
            <image 
              href="/logo_only.png" 
              x="20" 
              y="20" 
              width="480" 
              height="480" 
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* 2. 6 PETAL LABELS WITH SPACE GROTESK FONT */}
          {stages.map((stg) => {
            const isHovered = hoveredStage === stg.id;

            return (
              <g
                key={stg.id}
                onClick={() => handleStageClick(stg.id)}
                onMouseEnter={() => setHoveredStage(stg.id)}
                onMouseLeave={() => setHoveredStage(null)}
                className="cursor-pointer transition-all duration-300 font-heading"
                style={{
                  transformOrigin: `${stg.pos.x}px ${stg.pos.y}px`,
                  transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                  opacity: hoveredStage && !isHovered ? 0.8 : 1,
                }}
              >
                {/* Hitbox */}
                <circle
                  cx={stg.pos.x}
                  cy={stg.pos.y}
                  r="48"
                  fill="transparent"
                  className="cursor-pointer"
                />

                {isHovered ? (
                  /* === HOVER STATE: GIANT 3D NUMBER IN CENTER OF PETAL === */
                  <g transform={`translate(${stg.pos.x}, ${stg.pos.y})`}>
                    <circle cx="0" cy="0" r="26" fill={stg.color} stroke="#ffffff" strokeWidth="2.5" filter="url(#pill-shadow-3d)" />
                    <text 
                      x="0" 
                      y="9" 
                      textAnchor="middle" 
                      fill="#ffffff" 
                      fontSize="24" 
                      fontWeight="900"
                      fontFamily="'Space Grotesk', sans-serif"
                    >
                      {stg.singleNum}
                    </text>
                  </g>
                ) : (
                  /* === DEFAULT STATE: CRISP NUMBER PILL + 2-LINE TITLE IN SPACE GROTESK === */
                  <g transform={`translate(${stg.pos.x}, ${stg.pos.y})`}>
                    
                    {/* Top: White Number Pill (01, 02, ...) */}
                    <g transform="translate(0, -14)" filter="url(#pill-shadow-3d)">
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="8.5" 
                        fill="url(#pillGrad)" 
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text 
                        x="0" 
                        y="3" 
                        textAnchor="middle" 
                        fill={stg.color}
                        fontSize="8.5" 
                        fontWeight="900"
                        fontFamily="'Space Grotesk', sans-serif"
                      >
                        {stg.num}
                      </text>
                    </g>

                    {/* Bottom: 2-Line Bold Title in Space Grotesk */}
                    <g transform="translate(0, 3)" filter="url(#text-shadow-crisp)">
                      <text 
                        x="0" 
                        y="-0.5" 
                        textAnchor="middle" 
                        fill="#ffffff" 
                        fontSize="8" 
                        fontWeight="900"
                        fontFamily="'Space Grotesk', sans-serif"
                        letterSpacing="0.3"
                      >
                        {stg.title1}
                      </text>
                      <text 
                        x="0" 
                        y="11" 
                        textAnchor="middle" 
                        fill="#ffffff" 
                        fontSize="8" 
                        fontWeight="900"
                        fontFamily="'Space Grotesk', sans-serif"
                        letterSpacing="0.3"
                      >
                        {stg.title2}
                      </text>
                    </g>

                  </g>
                )}

              </g>
            );
          })}

          {/* Luminous Glow Halo behind Active/Hovered Petal */}
          {activeStage && (
            <circle
              cx={activeStage.pos.x}
              cy={activeStage.pos.y}
              r="58"
              fill={activeStage.color}
              opacity="0.32"
              filter="url(#petal-luminous-glow)"
              className="transition-all duration-500 pointer-events-none animate-pulse"
            />
          )}

          {/* 3. CENTER OF THE FLOWER (3D HUB IN SPACE GROTESK) */}
          <g 
            transform="translate(260, 260)"
            className="cursor-pointer transition-all duration-300 font-heading"
            filter="url(#center-glow-3d)"
            onClick={() => {
              if (activeStage) {
                handleStageClick(activeStage.id);
              } else {
                navigate('/ban-do-6-giai-doan');
              }
            }}
          >
            <circle cx="0" cy="0" r="75" fill="transparent" />

            {activeStage ? (
              /* === HOVER STATE: STAGE PREVIEW === */
              <g className="animate-in fade-in duration-200">
                <rect 
                  x="-48" 
                  y="-32" 
                  width="96" 
                  height="22" 
                  rx="11" 
                  fill={activeStage.color} 
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.2"
                  filter="url(#pill-shadow-3d)"
                />
                <text 
                  x="0" 
                  y="-17" 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="10.5" 
                  fontWeight="900"
                  fontFamily="'Space Grotesk', sans-serif"
                  letterSpacing="0.6"
                >
                  {t('wheel.stagePrefix')} {activeStage.num}
                </text>

                <text 
                  x="0" 
                  y="7" 
                  textAnchor="middle" 
                  fill="#072348" 
                  fontSize={activeStage.id === 6 ? "12" : "13.5"} 
                  fontWeight="900"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {activeStage.title1}
                </text>
                <text 
                  x="0" 
                  y="23" 
                  textAnchor="middle" 
                  fill="#072348" 
                  fontSize={activeStage.id === 6 ? "12" : "13.5"} 
                  fontWeight="900"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {activeStage.title2}
                </text>

                <g transform="translate(0, 38)">
                  <rect x="-36" y="-8" width="72" height="16" rx="8" fill="#072348" />
                  <text 
                    x="0" 
                    y="3" 
                    textAnchor="middle" 
                    fill="#38bdf8" 
                    fontSize="8.5" 
                    fontWeight="800"
                    fontFamily="'Space Grotesk', sans-serif"
                  >
                    {t('wheel.viewPhases')}
                  </text>
                </g>
              </g>
            ) : (
              /* === DEFAULT STATE: CENTER STAR HUB === */
              <g>
                <g transform="translate(0, -20)">
                  <rect 
                    x="-58" 
                    y="-11" 
                    width="116" 
                    height="22" 
                    rx="11" 
                    fill="url(#centerJewelGrad)" 
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="1.2"
                    filter="url(#pill-shadow-3d)"
                  />
                  <text 
                    x="0" 
                    y="4.5" 
                    textAnchor="middle" 
                    fill="#ffffff" 
                    fontSize="11" 
                    fontWeight="900"
                    fontFamily="'Space Grotesk', sans-serif"
                    letterSpacing="0.6"
                  >
                    {t('wheel.hubBrand')}
                  </text>
                </g>

                <text 
                  x="0" 
                  y="10" 
                  textAnchor="middle" 
                  fill="#0052cc" 
                  fontSize="13.5" 
                  fontWeight="900"
                  fontFamily="'Space Grotesk', sans-serif"
                  letterSpacing="0.8"
                >
                  {t('wheel.hubStages')}
                </text>

                <text 
                  x="0" 
                  y="26" 
                  textAnchor="middle" 
                  fill="#64748b" 
                  fontSize="9.5" 
                  fontWeight="700"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {t('wheel.hubLifecycle')}
                </text>
              </g>
            )}
          </g>

        </svg>

      </div>

    </div>
  );
}
