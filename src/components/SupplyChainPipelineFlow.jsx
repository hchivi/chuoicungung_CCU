import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SupplyChainPipelineFlow() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 1. BÊN TRÁI: NHÀ MÁY CÓ YÊU CẦU (ĐẦU VÀO - CHẤM ĐỎ & TEXT ĐỎ)
  const inputPills = [
    { id: 'in-1', label: t('flow.in1'), color: '#ef4444' },
    { id: 'in-2', label: t('flow.in2'), color: '#ef4444' },
    { id: 'in-3', label: t('flow.in3'), color: '#ef4444' },
    { id: 'in-4', label: t('flow.in4'), color: '#ef4444' },
    { id: 'in-5', label: t('flow.in5'), color: '#ef4444' },
    { id: 'in-6', label: t('flow.in6'), color: '#ef4444' },
  ];

  // 2. BÊN PHẢI: NHÀ CUNG CẤP ĐÃ THỰC HIỆN TƯƠNG ỨNG (ĐẦU RA - TICK XANH LÁ & TEXT XANH LÁ)
  const outputPills = [
    { id: 'out-1', label: t('flow.out1'), color: '#10b981' },
    { id: 'out-2', label: t('flow.out2'), color: '#10b981' },
    { id: 'out-3', label: t('flow.out3'), color: '#10b981' },
    { id: 'out-4', label: t('flow.out4'), color: '#10b981' },
    { id: 'out-5', label: t('flow.out5'), color: '#10b981' },
    { id: 'out-6', label: t('flow.out6'), color: '#10b981' },
  ];

  // Auto-cycle through the 6 rows sequentially with faster energetic pace (1400ms)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 1400);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Circuit coordinate parameters perfectly aligned to card outer edges
  // Left cards end at x=395; Right cards start at x=805; Center hub is at x=530..670
  const circuitPaths = [
    { left: "M 395 24 C 445 24, 480 140, 530 145", right: "M 670 145 C 720 140, 755 24, 805 24" },
    { left: "M 395 74 C 440 74, 480 145, 530 148", right: "M 670 148 C 720 145, 760 74, 805 74" },
    { left: "M 395 124 C 435 124, 480 148, 530 150", right: "M 670 150 C 720 148, 765 124, 805 124" },
    { left: "M 395 174 C 435 174, 480 152, 530 150", right: "M 670 150 C 720 152, 765 174, 805 174" },
    { left: "M 395 224 C 440 224, 480 155, 530 152", right: "M 670 152 C 720 155, 760 224, 805 224" },
    { left: "M 395 274 C 445 274, 480 160, 530 155", right: "M 670 155 C 720 160, 755 274, 805 274" },
  ];

  return (
    <section className="relative overflow-hidden py-4 sm:py-6 bg-gradient-to-b from-white via-[#f8fafc] to-white border-y border-slate-200/80 text-slate-900 font-sans select-none my-0">
      
      {/* Light Technical Neural Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-blue-100/25 rounded-full blur-[90px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            1. DESKTOP VIEW (LG+): SEQUENTIAL TURN-BY-TURN PIPELINE
           ========================================================================= */}
        <div className="hidden lg:grid relative min-h-[300px] grid-cols-12 items-center gap-0 font-sans">
          
          {/* SVG LASER CIRCUITS WITH FAST ACTIVE FLOW FOR CURRENT STEP */}
          <svg 
            viewBox="0 0 1200 300" 
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Laser flow gradient left */}
              <linearGradient id="activeInflowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#ef4444" stopOpacity="1" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="1" />
              </linearGradient>

              {/* Laser flow gradient right */}
              <linearGradient id="activeOutflowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="1" />
                <stop offset="30%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
              </linearGradient>

              <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render 6 left circuit paths (Inactive paths clearly visible with soft red stroke) */}
            {circuitPaths.map((path, idx) => {
              const isActive = activeStep === idx;
              return (
                <g key={`inflow-${idx}`}>
                  {/* Base Track */}
                  <path 
                    d={path.left} 
                    stroke={isActive ? "url(#activeInflowGrad)" : "#f87171"} 
                    strokeWidth={isActive ? "3.5" : "1.8"} 
                    fill="none" 
                    strokeDasharray={isActive ? "6,4" : "4,4"} 
                    opacity={isActive ? 1 : 0.55}
                    filter={isActive ? "url(#circuitGlow)" : undefined}
                    className={isActive ? "animate-signal-pulse-in transition-all duration-200" : "transition-all duration-200"}
                  />
                  {/* Moving Fast Energy Dot on Active Path */}
                  {isActive && (
                    <circle r="4" fill="#ef4444" className="filter drop-shadow-md">
                      <animateMotion dur="0.8s" repeatCount="indefinite" path={path.left} />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Render 6 right circuit paths (Inactive paths clearly visible with soft green stroke) */}
            {circuitPaths.map((path, idx) => {
              const isActive = activeStep === idx;
              return (
                <g key={`outflow-${idx}`}>
                  {/* Base Track */}
                  <path 
                    d={path.right} 
                    stroke={isActive ? "url(#activeOutflowGrad)" : "#4ade80"} 
                    strokeWidth={isActive ? "3.5" : "1.8"} 
                    fill="none" 
                    strokeDasharray={isActive ? "6,4" : "4,4"} 
                    opacity={isActive ? 1 : 0.55}
                    filter={isActive ? "url(#circuitGlow)" : undefined}
                    className={isActive ? "animate-signal-pulse-out transition-all duration-200" : "transition-all duration-200"}
                  />
                  {/* Moving Fast Energy Dot on Active Path */}
                  {isActive && (
                    <circle r="4" fill="#10b981" className="filter drop-shadow-md">
                      <animateMotion dur="0.8s" repeatCount="indefinite" path={path.right} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 1. LEFT COLUMN: RED INPUT CARDS */}
          <div className="col-span-4 flex flex-col items-end space-y-2.5 relative z-20 pr-0">
            {inputPills.map((node, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => {
                    setActiveStep(idx);
                    setIsPaused(true);
                  }}
                  onMouseLeave={() => setIsPaused(false)}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full max-w-[340px] xl:max-w-[360px] h-[40px] px-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between whitespace-nowrap group ${
                    isActive 
                      ? 'bg-white border-2 border-red-500 shadow-xl shadow-red-500/25 ring-4 ring-red-500/20 scale-[1.03] opacity-100 z-30' 
                      : 'bg-white border border-red-200/90 hover:border-red-400 hover:bg-red-50/60 opacity-90 hover:opacity-100 scale-100 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    {isActive ? (
                      <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-xs"></span>
                      </span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0"></span>
                    )}
                    <span className={`text-xs xl:text-[13px] truncate transition-colors ${
                      isActive ? 'font-bold text-red-600' : 'font-medium text-slate-800'
                    }`}>
                      {node.label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold pl-2 shrink-0 transition-all ${
                    isActive ? 'text-red-600 scale-110' : 'text-red-400/80 group-hover:text-red-600'
                  }`}>
                    ➔
                  </span>
                </div>
              );
            })}
          </div>

          {/* 2. CENTER COLUMN: CLEAN ROTATING LOGO WITH ACTIVE GLOW PULSE */}
          <div className="col-span-4 flex items-center justify-center relative z-10">
            <div className="relative flex items-center justify-center">
              {/* Dynamic Aura when processing current active step */}
              <div className="absolute w-36 h-36 rounded-full bg-blue-500/20 animate-ping pointer-events-none -z-10"></div>
              <img 
                src="/logo_only.png" 
                alt="Logo Chuỗi Cung Ứng" 
                className="w-32 h-32 xl:w-38 xl:h-38 object-contain filter drop-shadow-xl animate-spin-slow transition duration-300 hover:scale-105" 
              />
            </div>
          </div>

          {/* 3. RIGHT COLUMN: GREEN OUTPUT CARDS (ACTIVE HAS CHECKMARK ICON) */}
          <div className="col-span-4 flex flex-col items-start space-y-2.5 relative z-20 pl-0">
            {outputPills.map((node, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => {
                    setActiveStep(idx);
                    setIsPaused(true);
                  }}
                  onMouseLeave={() => setIsPaused(false)}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full max-w-[340px] xl:max-w-[360px] h-[40px] px-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between whitespace-nowrap group cursor-pointer ${
                    isActive 
                      ? 'bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/20 scale-[1.03] opacity-100 z-30' 
                      : 'bg-white border border-emerald-200/90 hover:border-emerald-400 hover:bg-emerald-50/60 opacity-90 hover:opacity-100 scale-100 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <span className={`text-xs font-bold pr-1 shrink-0 transition-all ${
                      isActive ? 'text-emerald-600 scale-110' : 'text-emerald-500/80 group-hover:text-emerald-600'
                    }`}>
                      ➔
                    </span>
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                    )}
                    <span className={`text-xs xl:text-[13px] truncate transition-colors ${
                      isActive ? 'font-bold text-emerald-600' : 'font-medium text-slate-800'
                    }`}>
                      {node.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* =========================================================================
            2. MOBILE & TABLET VIEW (< LG): SEQUENTIAL STEP-BY-STEP PAIRS
           ========================================================================= */}
        <div className="block lg:hidden space-y-3 py-1">
          
          {/* Mobile Central Hub Logo */}
          <div className="flex items-center justify-center space-x-2 py-1">
            <img 
              src="/logo_only.png" 
              alt="Logo Chuỗi Cung Ứng" 
              className="w-10 h-10 object-contain filter drop-shadow-md animate-spin-slow" 
            />
            <span className="text-[11px] font-bold text-slate-800 uppercase font-heading tracking-wide">
              {t('flow.title')}
            </span>
          </div>

          {/* 6 Paired Rows (Active Row Prominently Highlighted, Dimmed Rows readable with light tones) */}
          <div className="space-y-2">
            {inputPills.map((inp, idx) => {
              const outp = outputPills[idx];
              const isActive = activeStep === idx;
              return (
                <div 
                  key={inp.id}
                  onClick={() => setActiveStep(idx)}
                  className={`grid grid-cols-2 gap-1.5 sm:gap-2 items-stretch transition-all duration-200 cursor-pointer ${
                    isActive ? 'opacity-100 scale-[1.02]' : 'opacity-85 scale-100'
                  }`}
                >
                  {/* Left Mobile Card */}
                  <div className={`p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive 
                      ? 'bg-white border-red-500 shadow-md shadow-red-500/20 ring-2 ring-red-500/20' 
                      : 'bg-red-50/70 border-red-200/80'
                  }`}>
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-red-500 animate-pulse ring-1 ring-red-400' : 'bg-red-400'}`}></span>
                      <span className="text-[9.5px] font-bold text-red-600 uppercase tracking-wider">0{idx + 1} • In</span>
                    </div>
                    <p className={`text-[10.5px] sm:text-[11.5px] leading-tight ${isActive ? 'font-bold text-red-600' : 'font-medium text-slate-800'}`}>
                      {inp.label}
                    </p>
                  </div>

                  {/* Right Mobile Card */}
                  <div className={`p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive 
                      ? 'bg-white border-emerald-500 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20' 
                      : 'bg-emerald-50/70 border-emerald-200/80'
                  }`}>
                    <div className="flex items-center justify-between space-x-1.5 mb-1">
                      <span className="text-[9.5px] font-bold text-emerald-600 uppercase tracking-wider">0{idx + 1} • Out</span>
                      {isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className={`text-[10.5px] sm:text-[11.5px] leading-tight ${isActive ? 'font-bold text-emerald-600' : 'font-medium text-slate-800'}`}>
                      {outp.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
