import React, { useState, useEffect, useRef } from 'react';
import {
  Database, RefreshCw, Cpu, Gem, CheckCircle2, ShieldCheck,
  Zap, ArrowRight, Play, Sparkles, Layers, Activity, Lock
} from 'lucide-react';

export default function AssociationApiMotionGraphic3D() {
  const [activeStep, setActiveStep] = useState(2); // 1: DB, 2: Core Logo, 3: Diamond
  const [pulseActive, setPulseActive] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [procCount, setProcCount] = useState(12840);
  const [latency, setLatency] = useState(118);
  const containerRef = useRef(null);

  // Auto cycling pulse & live counter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev % 3) + 1);
      setProcCount(c => c + Math.floor(Math.random() * 5) + 1);
      setLatency(110 + Math.floor(Math.random() * 15));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; // tilt angle
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const triggerManualPulse = () => {
    setPulseActive(false);
    setTimeout(() => setPulseActive(true), 50);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl bg-gradient-to-b from-white via-blue-50/30 to-white border border-blue-200/90 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-blue-900/10 overflow-hidden select-none transition-all duration-300"
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Ambient Background Lighting & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0052cc08_1px,transparent_1px),linear-gradient(to_bottom,#0052cc08_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info & Realtime Status */}
      <div className="relative z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-blue-100 pb-6 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-[#0052cc] text-xs font-bold font-mono shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-[#0052cc] animate-pulse" />
            <span>3D REALTIME ALGORITHMIC MATCHMAKING PIPELINE</span>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading tracking-tight text-slate-950">
            Minh Chứng Công Nghệ: <span className="bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent">Luồng Dữ Liệu Tự Động 100%</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
            Hệ thống đối soát phân tán loại bỏ hoàn toàn việc phê duyệt bằng tay — Toàn bộ quy trình xác minh MST, liên kết bảo lãnh và cấp Huy Hiệu Kim Cương Lớp 3 diễn ra tự động qua API với độ trễ &lt; 0.45s.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D MOTION GRAPHIC VIEWPORT */}
      {/* ========================================================================= */}
      <div
        className="relative z-20 py-4 transition-transform duration-200 ease-out"
        style={{
          transform: `rotateY(${mouseOffset.x}deg) rotateX(${mouseOffset.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-3 items-center">

          {/* ===================================================================== */}
          {/* NODE 1: [Database Của Hiệp Hội (CRM/ERP)] - 3 COLS */}
          {/* ===================================================================== */}
          <div
            onClick={() => setActiveStep(1)}
            className={`lg:col-span-3 rounded-3xl p-5 sm:p-6 transition-all duration-500 relative cursor-pointer group ${activeStep === 1
              ? 'bg-white border-2 border-[#0052cc] shadow-2xl shadow-blue-500/20 scale-102 ring-4 ring-blue-500/10'
              : 'bg-white/90 border border-slate-200/90 shadow-sm hover:border-blue-300 hover:shadow-md'
              }`}
            style={{
              transform: activeStep === 1 ? 'translateZ(30px)' : 'translateZ(0px)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-mono font-bold border border-blue-200">
                BƯỚC 1: DỮ LIỆU NGUỒN
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            </div>

            {/* 3D Stacked Database Isometric Icon */}
            <div className="flex justify-center my-3 relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-blue-500 to-[#0047a5] text-white flex flex-col items-center justify-center p-3 shadow-lg shadow-blue-600/30 relative overflow-hidden group-hover:scale-105 transition-transform">
                {/* 3D stacked database rings */}
                <div className="w-full space-y-1.5 flex flex-col items-center">
                  <div className="w-12 h-3.5 rounded-full bg-blue-200/90 border border-white/60 shadow-inner"></div>
                  <div className="w-12 h-3.5 rounded-full bg-blue-300/80 border border-white/40 shadow-inner -mt-1.5"></div>
                  <div className="w-12 h-3.5 rounded-full bg-blue-100 border border-white/60 shadow-inner -mt-1.5 flex items-center justify-center">
                    <Database className="w-2.5 h-2.5 text-[#0052cc]" />
                  </div>
                </div>

                {/* Data emitting particles */}
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-1 mt-2">
              <h4 className="text-sm sm:text-base font-black font-heading text-slate-900">
                Database Hiệp Hội
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                CRM / ERP Hiệp Hội / VCCI / BNI Connect
              </p>
            </div>

            {/* Dynamic Live Payload Chip */}
            <div className="mt-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-[10.5px] text-slate-700 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-200/60 pb-1">
                <span className="text-[#0052cc] font-bold">● JSON STREAM</span>
                <span className="text-emerald-600 font-bold">200 OK</span>
              </div>
              <div className="truncate text-slate-900 font-bold">MST: 0100109106</div>
              <div className="truncate text-[9.5px] text-slate-500">Endorser: Hiệp Hội Ngành Nghề</div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3D LASER CONDUIT PIPE 1 (Node 1 -> Node 2) - 1 COL */}
          {/* ===================================================================== */}
          <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center space-y-1 relative">
            <div className="w-full flex items-center justify-center relative">
              {/* 3D Optical Pipe Body */}
              <div className="w-full h-2.5 bg-blue-100 rounded-full border border-blue-300 relative overflow-hidden shadow-inner">
                {/* Moving High-speed Laser Pulse */}
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-transparent via-[#0052cc] to-sky-300 rounded-full animate-[marquee-left_1.2s_linear_infinite] shadow-md shadow-blue-500"></div>
              </div>
              {/* Connector Arrow */}
              <div className="absolute -right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-blue-600 tracking-tight">
              OAuth 2.0
            </span>
          </div>

          {/* ===================================================================== */}
          {/* NODE 2: [logo_only.png] CENTER HUB - 3 COLS */}
          {/* ===================================================================== */}
          <div
            onClick={() => setActiveStep(2)}
            className={`lg:col-span-3 rounded-3xl p-5 sm:p-6 transition-all duration-500 relative cursor-pointer group text-center flex flex-col items-center justify-between ${activeStep === 2
              ? 'bg-gradient-to-b from-white via-blue-50/50 to-white border-2 border-[#0052cc] shadow-2xl shadow-blue-600/30 scale-105 ring-4 ring-blue-500/20'
              : 'bg-white/95 border border-blue-200 shadow-sm hover:border-[#0052cc]/70 hover:shadow-md'
              }`}
            style={{
              transform: activeStep === 2 ? 'translateZ(45px)' : 'translateZ(10px)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Top Indicator */}
            <div className="w-full flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold shadow-2xs">
                BƯỚC 2: THUẬT TOÁN CORE
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                &lt; 0.45s
              </span>
            </div>

            {/* 3D Gyroscope Glowing Center with logo_only.png */}
            <div className="relative my-2">
              {/* Outer Glowing Spinning Rings */}
              <div className="absolute -inset-4 rounded-full border border-blue-400/40 border-dashed animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute -inset-2 rounded-full border border-sky-400/50 border-dotted animate-[spin_6s_linear_infinite_reverse]"></div>
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 via-sky-400/20 to-indigo-500/20 rounded-full blur-md animate-pulse"></div>

              {/* Center logo_only.png without border box */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 p-1 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/logo_only.png"
                  alt="Chuỗi Cung Ứng Core Matchmaking"
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
            </div>

            {/* Title & Core Subtitle */}
            <div className="space-y-1 mt-2">
              <h4 className="text-sm sm:text-base font-black font-heading text-slate-950">
                ChuoiCungUng.com
              </h4>
            </div>

            {/* 3 Checks Realtime Badges */}
            <div className="w-full mt-3 space-y-1 text-left bg-blue-50/80 border border-blue-100 rounded-2xl p-2.5 text-[10px] font-mono text-slate-700">
              <div className="flex items-center space-x-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>✓ Khớp MST ĐKKD Quốc Gia</span>
              </div>
              <div className="flex items-center space-x-1 text-[#0052cc] font-bold">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>✓ Xác Thực Bảo Lãnh Hiệp Hội</span>
              </div>
              <div className="flex items-center space-x-1 text-amber-600 font-bold">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>✓ 0 Phê Duyệt Thủ Công Bằng Tay</span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3D LASER CONDUIT PIPE 2 (Node 2 -> Node 3) - 1 COL */}
          {/* ===================================================================== */}
          <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center space-y-1 relative">
            <div className="w-full flex items-center justify-center relative">
              {/* 3D Optical Pipe Body */}
              <div className="w-full h-2.5 bg-amber-100 rounded-full border border-amber-300 relative overflow-hidden shadow-inner">
                {/* Moving Gold Laser Pulse */}
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-transparent via-amber-500 to-yellow-300 rounded-full animate-[marquee-left_1.2s_linear_infinite] shadow-md shadow-amber-500"></div>
              </div>
              {/* Connector Arrow */}
              <div className="absolute -right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-amber-700 tracking-tight">
              Cấp Lớp 3
            </span>
          </div>

          {/* ===================================================================== */}
          {/* NODE 3: [Huy hiệu Kim Cương tự động cấp cho Member] - 3 COLS */}
          {/* ===================================================================== */}
          <div
            onClick={() => setActiveStep(3)}
            className={`lg:col-span-3 rounded-3xl p-5 sm:p-6 transition-all duration-500 relative cursor-pointer group ${activeStep === 3
              ? 'bg-gradient-to-br from-white via-amber-50/70 to-yellow-50/50 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 scale-102 ring-4 ring-amber-500/10'
              : 'bg-white/90 border border-slate-200/90 shadow-sm hover:border-amber-300 hover:shadow-md'
              }`}
            style={{
              transform: activeStep === 3 ? 'translateZ(30px)' : 'translateZ(0px)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-200">
                BƯỚC 3: ĐẶC QUYỀN VIP
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            </div>

            {/* 3D Sparkling Faceted Diamond Emblem */}
            <div className="flex justify-center my-3 relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-white flex items-center justify-center p-3 shadow-lg shadow-amber-600/30 relative overflow-hidden group-hover:scale-105 transition-transform">
                <Gem className="w-10 h-10 text-white animate-bounce drop-shadow-md" />
                {/* Light flares */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-1 mt-2">
              <h4 className="text-sm sm:text-base font-black font-heading text-slate-900">
                Huy Hiệu Kim Cương 💎
              </h4>
              <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                Tự động cấp cho Doanh nghiệp Hội viên
              </p>
            </div>

            {/* Active Verified Badge Card */}
            <div className="mt-4 p-2.5 rounded-2xl bg-white border border-amber-200/90 font-mono text-[10.5px] text-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-amber-700 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>DIAMOND KYC 3</span>
                </span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">ACTIVE</span>
              </div>
              <div className="truncate text-slate-900 font-bold">Vị thế: TOP 1 Matching FDI</div>
              <div className="truncate text-[9.5px] text-slate-500">Phủ sóng: Chuỗi khép kín 18 Pha</div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D MOTION GRAPHIC FOOTER CAPTION (100% Algorithmic Assurance) */}
      {/* ========================================================================= */}
      <div className="relative z-20 pt-6 mt-6 border-t border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-[#0052cc]" />
          <span>Thuật toán mã hóa phân tán SHA-256 đối soát trực tiếp giữa Cổng Hiệp Hội và ChuoiCungUng.vn SSO</span>
        </div>
        <div className="font-mono text-[11px] text-slate-700 font-semibold flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Đã xác thực tự động: <strong className="text-slate-950 font-black">{procCount.toLocaleString('vi-VN')}</strong> lượt</span>
        </div>
      </div>

    </div>
  );
}
