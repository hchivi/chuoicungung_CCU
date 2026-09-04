import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, Compass, Settings, Factory, Users,
  RefreshCw, ArrowRight, ChevronRight, CheckCircle2,
  ExternalLink, Sparkles, Layers, ShieldCheck, Zap
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function InteractiveLifecycleFlow({ onStageSelect = null }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeStageId, setActiveStageId] = useState(1);
  const [hoveredStageId, setHoveredStageId] = useState(null);

  // 6 Stages matching exact colors: 1: Tím, 2: Xanh lá, 3: Cam, 4: Xanh dương, 5: Vàng, 6: Đỏ
  const stages = [
    {
      id: 1,
      num: "01",
      title: lang === 'en' ? "Preparation & Investment" : "Chuẩn bị & Đầu tư",
      subtitle: lang === 'en' ? "Legal & Site Planning" : "Pháp lý & Quy hoạch",
      color: "#8b5cf6",
      bgLight: "bg-purple-50",
      borderLight: "border-purple-200",
      textCol: "text-purple-700",
      glowColor: "rgba(139, 92, 246, 0.45)",
      gradient: "from-purple-600 to-indigo-600",
      icon: TrendingUp,
      desc: lang === 'en' 
        ? "Market feasibility, investment licensing, location sourcing and project approvals."
        : "Nghiên cứu thị trường, pháp lý đầu tư, quy hoạch địa điểm và thẩm duyệt dự án.",
      phases: lang === 'en' 
        ? ["1.1 Feasibility & Orientation", "1.2 Legal & Procedures", "1.3 Site & Park Selection"]
        : ["1.1 Khảo sát & Định hướng", "1.2 Pháp lý & Thủ tục", "1.3 Lựa chọn Địa điểm & KCN"]
    },
    {
      id: 2,
      num: "02",
      title: lang === 'en' ? "Design & Construction" : "Thiết kế & Xây dựng",
      subtitle: lang === 'en' ? "EPC General Contracting & Infra" : "Tổng thầu EPC & Hạ tầng",
      color: "#10b981",
      bgLight: "bg-emerald-50",
      borderLight: "border-emerald-200",
      textCol: "text-emerald-700",
      glowColor: "rgba(16, 185, 129, 0.45)",
      gradient: "from-emerald-600 to-teal-600",
      icon: Compass,
      desc: lang === 'en' 
        ? "Architectural - MEP design, factory EPC construction, utilities and auxiliary infrastructure."
        : "Thiết kế kiến trúc - MEP, tổng thầu xây dựng nhà xưởng, hạ tầng kỹ thuật phụ trợ.",
      phases: lang === 'en' 
        ? ["2.1 Masterplan & MEP Design", "2.2 Factory Construction", "2.3 Cleanroom & Technical Infrastructure"]
        : ["2.1 Thiết kế Quy hoạch & MEP", "2.2 Thi công Xây dựng Nhà xưởng", "2.3 Hạ tầng Kỹ thuật & Phòng sạch"]
    },
    {
      id: 3,
      num: "03",
      title: lang === 'en' ? "Installation & Commissioning" : "Lắp đặt & Hoàn thiện",
      subtitle: lang === 'en' ? "Machinery & Trial Runs" : "Máy móc & Chạy thử",
      color: "#f97316",
      bgLight: "bg-orange-50",
      borderLight: "border-orange-200",
      textCol: "text-orange-700",
      glowColor: "rgba(249, 115, 22, 0.45)",
      gradient: "from-orange-500 to-amber-600",
      icon: Settings,
      desc: lang === 'en' 
        ? "Equipment procurement, HVAC & refrigeration, production line automation and acceptance testing."
        : "Nhập khẩu máy móc thiết bị, cơ điện lạnh, tự động hóa dây chuyền và nghiệm thu.",
      phases: lang === 'en' 
        ? ["3.1 Machinery Supply", "3.2 HVAC & Automation", "3.3 Calibration & Trial Runs"]
        : ["3.1 Cung ứng Máy móc Thiết bị", "3.2 Cơ điện Lạnh & Tự động hóa", "3.3 Hiệu chuẩn & Nghiệm thu Chạy thử"]
    },
    {
      id: 4,
      num: "04",
      title: lang === 'en' ? "Production & Operation" : "Vận hành Sản xuất",
      subtitle: lang === 'en' ? "Raw Materials, Machining & QA" : "NVL, Gia công & QA",
      color: "#0284c7",
      bgLight: "bg-sky-50",
      borderLight: "border-sky-200",
      textCol: "text-sky-700",
      glowColor: "rgba(2, 132, 199, 0.45)",
      gradient: "from-sky-600 to-blue-700",
      icon: Factory,
      desc: lang === 'en' 
        ? "Raw materials sourcing, precision component subcontracting, equipment maintenance and QA."
        : "Cung ứng nguyên phụ liệu, gia công linh kiện phụ trợ, bảo trì và kiểm soát chất lượng.",
      phases: lang === 'en' 
        ? ["4.1 Raw Materials Supply", "4.2 Precision Machining & Subcontracting", "4.3 Maintenance & Quality Assurance"]
        : ["4.1 Cung ứng Nguyên vật liệu", "4.2 Gia công & Chế tạo Phụ trợ", "4.3 Bảo trì Thiết bị & Quản lý Chất lượng"]
    },
    {
      id: 5,
      num: "05",
      title: lang === 'en' ? "HR & Logistics Services" : "Nhân sự & Hậu cần",
      subtitle: lang === 'en' ? "Logistics & Industrial Living" : "Logistics & Đời sống KCN",
      color: "#eab308",
      bgLight: "bg-amber-50",
      borderLight: "border-amber-200",
      textCol: "text-amber-700",
      glowColor: "rgba(234, 179, 8, 0.45)",
      gradient: "from-amber-500 to-yellow-600",
      icon: Users,
      desc: lang === 'en' 
        ? "Talent recruitment, warehouse logistics, export packaging, and industrial park lifestyle services."
        : "Tuyển dụng nhân lực, kho bãi logistics, đóng gói xuất khẩu và dịch vụ đời sống công nghiệp.",
      phases: lang === 'en' 
        ? ["5.1 Recruitment & Workforce Training", "5.2 Logistics, Warehousing & Freight", "5.3 Industrial Catering & Utilities"]
        : ["5.1 Tuyển dụng & Đào tạo Nhân lực", "5.2 Logistics, Kho bãi & Vận tải", "5.3 Suất ăn & Dịch vụ Tiện ích KCN"]
    },
    {
      id: 6,
      num: "06",
      title: lang === 'en' ? "Scale – Optimize – ESG" : "Mở rộng – Tối ưu – Chuyển đổi",
      subtitle: lang === 'en' ? "Digitalization & Green Industry" : "Chuyển đổi số & ESG",
      color: "#ef4444",
      bgLight: "bg-rose-50",
      borderLight: "border-rose-200",
      textCol: "text-rose-700",
      glowColor: "rgba(239, 68, 68, 0.45)",
      gradient: "from-rose-600 to-red-700",
      icon: RefreshCw,
      desc: lang === 'en' 
        ? "Smart factory digitalization, clean green energy compliance (ESG) and supply chain expansion."
        : "Chuyển đổi số nhà máy thông minh, tối ưu năng lượng xanh ESG và mở rộng chuỗi.",
      phases: lang === 'en' 
        ? ["6.1 Digital Transformation & Smart Factory", "6.2 Green Energy & ESG Standards", "6.3 Capacity Expansion & Restructuring"]
        : ["6.1 Chuyển đổi số & Smart Factory", "6.2 Năng lượng Xanh & Tiêu chuẩn ESG", "6.3 Mở rộng Công suất & Tái cấu trúc"]
    }
  ];

  const currentStage = stages.find(s => s.id === (hoveredStageId || activeStageId)) || stages[0];

  const handleStageClick = (id) => {
    setActiveStageId(id);
    if (onStageSelect) {
      onStageSelect(id);
    }
  };

  return (
    <div className="w-full space-y-6">

      {/* 1. Main Interactive Flow Container */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">

        {/* Background Delicate Grid and Watermark */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px] opacity-60 pointer-events-none"></div>

        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentStage.color }}
        ></div>

        {/* TOP HEADER: Central Core Typography "CHUỖI CUNG ỨNG . COM" & Asset logo_only.png Integration */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">

          {/* Brand Core Hub with logo_only.png watermark/emblem */}
          <div className="flex items-center space-x-3.5">

            {/* Elegant Emblem using logo_only.png */}
            <div className="relative w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 p-1.5 flex items-center justify-center flex-shrink-0 group hover:scale-105 transition-transform duration-300">
              <img
                src="/logo_only.png"
                alt="Supply Chain Icon"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Typography Core: CHUỖI CUNG ỨNG . COM (Clean & Prominent) */}
            <div className="space-y-0.5 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black text-[#072348] tracking-tight leading-none font-heading">
                  CHUỖI CUNG ỨNG<span className="text-blue-600">.COM</span>
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider hidden sm:inline-block font-mono">
                  LIFECYCLE HUB
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {lang === 'en' 
                  ? 'Interactive 6-Stage & 18-Phase Architecture of Vietnam Industrial Ecosystem' 
                  : 'Sơ đồ cấu trúc 6 Giai đoạn & 18 Pha Vòng đời Hệ thống Sản xuất'
                }
              </p>
            </div>

          </div>

          {/* Quick Filter / Action Buttons */}
          <div className="flex items-center space-x-2 self-stretch md:self-auto justify-end">
            <Link
              to="/ban-do-6-giai-doan"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap font-heading"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'en' ? '18-Phase Matrix' : 'Ma trận 18 Pha'}</span>
            </Link>
            <Link
              to="/dinh-vi-doanh-nghiep"
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap font-heading"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'Diagnostic Wizard' : 'Định vị giai đoạn'}</span>
            </Link>
          </div>

        </div>

        {/* 2. STAGE FLOW DIAGRAM: 6 CONNECTED INTERACTIVE CARDS */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-6">
          {stages.map((stage, idx) => {
            const isSelected = activeStageId === stage.id;
            const isHovered = hoveredStageId === stage.id;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                onMouseEnter={() => setHoveredStageId(stage.id)}
                onMouseLeave={() => setHoveredStageId(null)}
                className={`relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border text-left flex flex-col justify-between group ${isSelected
                    ? 'bg-white shadow-xl ring-2 scale-[1.02] z-20'
                    : 'bg-slate-50/80 hover:bg-white hover:shadow-md hover:scale-[1.01] border-slate-200/80'
                  }`}
                style={{
                  borderColor: isSelected ? stage.color : undefined,
                  boxShadow: isSelected ? `0 12px 28px -6px ${stage.glowColor}` : undefined
                }}
              >
                {/* Connecting flow arrow for sequential visual queue */}
                {idx < 5 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    {/* Visual flow indicator */}
                  </div>
                )}

                {/* Top Card Bar: Number Badge + Icon + Phase Tag */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span
                      style={{ backgroundColor: stage.color }}
                      className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs font-mono"
                    >
                      {stage.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      {lang === 'en' ? `STAGE ${stage.num}` : `Giai đoạn ${stage.num}`}
                    </span>
                  </div>

                  <div
                    style={{ color: stage.color, backgroundColor: `${stage.color}15` }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Stage Title & Short Context */}
                <div className="space-y-1 my-1">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors font-heading">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-sans">
                    {stage.desc}
                  </p>
                </div>

                {/* 3 Sub-Phases Micro Pills */}
                <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500 font-mono">
                    {lang === 'en' ? '3 Standard Phases' : '3 Pha chuẩn hóa'}
                  </span>
                  <Link
                    to={`/giai-doan/${stage.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold flex items-center space-x-0.5 text-blue-600 hover:text-blue-800 transition group-hover:translate-x-0.5 font-heading"
                  >
                    <span>{lang === 'en' ? 'Details' : 'Chi tiết'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* 3. DYNAMIC DETAIL INSPECTOR FOR CURRENTLY SELECTED STAGE */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-100">
          <div
            className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-r from-slate-50 via-white to-slate-50"
            style={{ borderColor: `${currentStage.color}50` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              {/* Left Stage Details */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center space-x-2">
                  <span
                    style={{ backgroundColor: currentStage.color }}
                    className="px-2.5 py-0.5 rounded-md text-white font-bold text-xs font-mono"
                  >
                    {lang === 'en' ? `STAGE ${currentStage.num}` : `GIAI ĐOẠN ${currentStage.num}`}
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 font-heading">
                    {currentStage.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 max-w-3xl font-sans">
                  {currentStage.desc}
                </p>
              </div>

              {/* Action Button to Open Stage Page */}
              <Link
                to={`/giai-doan/${currentStage.id}`}
                style={{ backgroundColor: currentStage.color }}
                className="px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:brightness-110 transition flex items-center justify-center space-x-1.5 whitespace-nowrap self-start lg:self-center font-heading uppercase tracking-wider"
              >
                <span>{lang === 'en' ? `Explore Stage ${currentStage.num}` : `Khám phá Giai đoạn ${currentStage.num}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>

            {/* 3 Phases Chips of Selected Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-200/60">
              {currentStage.phases.map((ph, pIdx) => {
                const phaseId = `${currentStage.id}.${pIdx + 1}`;
                return (
                  <Link
                    key={phaseId}
                    to={`/pha/${phaseId}`}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition flex items-center justify-between text-xs group/phase"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span
                        style={{ color: currentStage.color }}
                        className="font-mono font-black text-xs"
                      >
                        {lang === 'en' ? `Phase ${phaseId}` : `Pha ${phaseId}`}
                      </span>
                      <span className="font-semibold text-slate-700 truncate group-hover/phase:text-blue-600">
                        {ph.replace(/^\d+\.\d+\s*/, '')}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/phase:text-blue-600 group-hover/phase:translate-x-0.5 transition" />
                  </Link>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

