import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, Download, FileText, Building2, 
  Factory, Users, ShieldCheck, MapPin, Sparkles, ChevronRight,
  HelpCircle, PlusCircle, Check, Filter, Zap, Star, Clock, 
  Send, Lock, RotateCcw, Award, CheckSquare, Square, Layers,
  Compass, Wrench, FileCheck, ExternalLink, Shield
} from 'lucide-react';
import { stagesData } from '../../data/mockData';
import { stageSuppliers } from '../../data/stageSuppliersData';
import { useLanguage } from '../../contexts/LanguageContext';
import StageSupplierCard from '../stage/StageSupplierCard';
import StageRequestQuoteModal from '../stage/StageRequestQuoteModal';

export default function PhaseDetailLayout({ phaseId = "1.1", customHeroSubtitle = null }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Find current stage & phase
  let currentStage = stagesData[0];
  let currentPhase = stagesData[0].phases[0];

  for (const s of stagesData) {
    const found = s.phases.find(p => p.id === phaseId);
    if (found) {
      currentStage = s;
      currentPhase = found;
      break;
    }
  }

  // Dynamic Theme Palette matching Flower Petal Colors:
  const stageThemes = {
    1: { color: "#8b5cf6", darkColor: "#6b21a8", bgPage: "from-[#fbf8ff] via-[#f7f0fe] to-[#f3e8ff]/40", bgBadge: "bg-purple-100 text-purple-900 border-purple-200", heroImg: "/stage1_hero.jpg" },
    2: { color: "#10b981", darkColor: "#047857", bgPage: "from-[#f0fdf4] via-[#e6fbf0] to-[#dcfce7]/40", bgBadge: "bg-emerald-100 text-emerald-900 border-emerald-200", heroImg: "/stage2_hero.jpg" },
    3: { color: "#f97316", darkColor: "#c2410c", bgPage: "from-[#fff7ed] via-[#ffedd5] to-[#ffedd5]/40", bgBadge: "bg-orange-100 text-orange-900 border-orange-200", heroImg: "/stage3_hero.jpg" },
    4: { color: "#0284c7", darkColor: "#0369a1", bgPage: "from-[#f0f9ff] via-[#e0f2fe] to-[#e0f2fe]/40", bgBadge: "bg-sky-100 text-sky-900 border-sky-200", heroImg: "/stage4_hero.jpg" },
    5: { color: "#eab308", darkColor: "#b45309", bgPage: "from-[#fefce8] via-[#fef9c3] to-[#fef08a]/35", bgBadge: "bg-amber-100 text-amber-950 border-amber-200", heroImg: "/stage5_hero.jpg" },
    6: { color: "#ef4444", darkColor: "#b91c1c", bgPage: "from-[#fef2f2] via-[#fee2e2] to-[#fee2e2]/40", bgBadge: "bg-red-100 text-red-900 border-red-200", heroImg: "/stage6_hero.jpg" },
  };

  const theme = stageThemes[currentStage.id] || stageThemes[1];

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    region: 'all',
    kycTiers: [],
    erpOnly: false,
    standards: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [selectedSupplierForRfq, setSelectedSupplierForRfq] = useState(null);
  const [isPrivateBiddingMode, setIsPrivateBiddingMode] = useState(false);

  useEffect(() => {
    setFilters({
      search: '',
      region: 'all',
      kycTiers: [],
      erpOnly: false,
      standards: []
    });
  }, [phaseId]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 180);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleOpenRfq = (supplier = null, isPrivate = false) => {
    setSelectedSupplierForRfq(supplier);
    setIsPrivateBiddingMode(isPrivate);
    setIsRfqModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      region: 'all',
      kycTiers: [],
      erpOnly: false,
      standards: []
    });
  };

  // Filtered suppliers for this phase
  const phaseSuppliers = useMemo(() => {
    let list = stageSuppliers.filter(s => s.phaseId === currentPhase.id || (s.stageId === currentStage.id && !s.phaseId));
    
    if (list.length < 2) {
      list = stageSuppliers.filter(s => s.stageId === currentStage.id);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.location.toLowerCase().includes(q)
      );
    }

    if (filters.region !== 'all') {
      if (filters.region === 'north') {
        list = list.filter(s => s.location.includes("Hà Nội") || s.location.includes("Hải Phòng") || s.location.includes("Bắc Ninh") || s.location.includes("Quảng Ninh") || s.location.includes("Toàn quốc"));
      } else if (filters.region === 'south') {
        list = list.filter(s => s.location.includes("TP.HCM") || s.location.includes("Bình Dương") || s.location.includes("Đồng Nai") || s.location.includes("Long An") || s.location.includes("Toàn quốc"));
      } else if (filters.region === 'central') {
        list = list.filter(s => s.location.includes("Đà Nẵng") || s.location.includes("Quảng Nam") || s.location.includes("Quảng Ngãi") || s.location.includes("Toàn quốc"));
      }
    }

    if (filters.kycTiers.length > 0) {
      list = list.filter(s => filters.kycTiers.includes(s.kycTier));
    }

    if (filters.erpOnly) {
      list = list.filter(s => s.erpReady === true || s.odooReady === true);
    }

    if (filters.standards.length > 0) {
      list = list.filter(s => s.standards && filters.standards.some(std => s.standards.includes(std)));
    }

    return list;
  }, [currentPhase.id, currentStage.id, filters]);

  // Phase-specific compliance & regulations tags
  const complianceData = useMemo(() => {
    switch (currentPhase.id) {
      case "1.1":
        return {
          title: "Khung Pháp Lý & Tiêu Chuẩn Khảo Sát Đất KCN",
          tags: ["Luật Đất Đai 2024", "Quy hoạch KCN Nghị định 35/2022", "KCN Sinh Thái (ESG)", "Khảo sát địa chất TCVN 9363", "BIM 3D GIS"],
          docName: "Bộ tài liệu hướng dẫn khảo sát địa điểm đầu tư FDI (PDF)",
          docSize: "3.4 MB"
        };
      case "1.2":
        return {
          title: "Quy Chuẩn Cấp Phép Đầu Tư & Thẩm Duyệt PCCC",
          tags: ["Luật Đầu Tư 2020", "Luật Doanh Nghiệp (IRC/ERC)", "QCVN 06:2022/BXD (PCCC)", "ĐTM Luật Bảo vệ Môi trường", "Giấy phép xây dựng"],
          docName: "Checklist 12 bước cấp phép & thẩm định PCCC dự án FDI (PDF)",
          docSize: "4.8 MB"
        };
      case "1.3":
        return {
          title: "Tiêu Chuẩn Mặt Bằng & Hạ Tầng Kết Nối Logistics",
          tags: ["Hợp đồng thuê đất KCN", "Mô hình Ready-Built Factory (RBF)", "Hạ tầng nước thải Cột A", "Điện trung áp 22kV", "Logistics FIATA"],
          docName: "Cẩm nang so sánh đơn giá & hạ tầng 60 KCN trọng điểm (PDF)",
          docSize: "5.2 MB"
        };
      case "2.1":
        return {
          title: "Tiêu Chuẩn Thiết Kế Quy Hoạch & Mô Hình Hóa BIM",
          tags: ["BIM Level 2 ISO 19650", "QCVN 03:2022 Phân cấp công trình", "LEED Gold / Green Mark", "Mô phỏng năng lượng EnergyPlus"],
          docName: "Quy chuẩn thiết kế kết cấu & cơ điện nhà xưởng chuẩn BIM (PDF)",
          docSize: "6.1 MB"
        };
      case "2.2":
        return {
          title: "Tiêu Chuẩn Thi Công Kết Cấu Thép & Xây Dựng EPC",
          tags: ["AISC 360 / TCVN 5575 Kết cấu thép", "Sàn siêu phẳng ASTM E1155", "Sơn chống cháy EI120", "An toàn OHSAS/ISO 45001"],
          docName: "Checklist nghiệm thu móng & kết cấu thép nhà xưởng EPC (PDF)",
          docSize: "3.7 MB"
        };
      case "2.3":
        return {
          title: "Quy Chuẩn Hệ Thống Cơ Điện MEP & PCCC Tự Động",
          tags: ["QCVN 06:2022 PCCC", "HVAC Chiller ASHRAE 90.1", "Trạm biến áp 110kV IEC 61936", "Xử lý nước thải QCVN 40"],
          docName: "Sổ tay kiểm tra & nghiệm thu hệ thống MEP công nghiệp (PDF)",
          docSize: "4.5 MB"
        };
      case "3.1":
        return {
          title: "Quy Chuẩn Lắp Đặt Máy Móc & Căn Chỉnh Dây Chuyền",
          tags: ["Tiêu chuẩn máy móc CE Mark", "IEC 61131-3 PLC/Scada", "Cân chỉnh laser ISO 10816", "An toàn nâng hạ ASME B30"],
          docName: "Biểu mẫu kiểm tra lắp đặt & căn chỉnh máy móc siêu trọng (PDF)",
          docSize: "2.9 MB"
        };
      case "3.2":
        return {
          title: "Tiêu Chuẩn Phòng Sạch Cleanroom & Khí Nén Công Nghiệp",
          tags: ["ISO 14644-1 Cleanroom Class 100 - 100k", "GMP-WHO / FDA", "Khí nén sạch ISO 8573-1 Class 0", "ESD S20.20 Chống tĩnh điện"],
          docName: "Checklist nghiệm thu phòng sạch & hệ thống AHU/HEPA (PDF)",
          docSize: "3.8 MB"
        };
      case "3.3":
        return {
          title: "Quy Trình Chạy Thử & Kiểm Định An Toàn Nghiệm Thu",
          tags: ["Quy trình chạy thử không tải / có tải", "Kiểm định thiết bị áp lực", "Hiệu chuẩn sensor ISO 17025", "Hồ sơ hoàn công"],
          docName: "Bộ biên bản chạy thử liên động & nghiệm thu bàn giao (PDF)",
          docSize: "4.2 MB"
        };
      case "4.1":
        return {
          title: "Tiêu Chuẩn Cung Ứng Nguyên Vật Liệu & Phụ Tùng",
          tags: ["IATF 16949 Quản lý chất lượng", "RoHS / REACH Không độc hại", "Quản lý tồn kho Just-in-Time", "Vật tư phụ trợ TCVN"],
          docName: "Khung đánh giá năng lực nhà cung cấp phụ tùng JIT (PDF)",
          docSize: "3.1 MB"
        };
      case "4.2":
        return {
          title: "Tiêu Chuẩn Điều Hành Sản Xuất MES & Bảo Trì TPM",
          tags: ["Hệ thống điều hành MES", "Bảo trì phòng ngừa TPM", "Tiêu chuẩn AQL ISO 2859-1", "ISO 27001 An ninh dữ liệu"],
          docName: "Sổ tay chuyển đổi số MES & tối ưu hóa chỉ số OEE (PDF)",
          docSize: "5.6 MB"
        };
      case "4.3":
        return {
          title: "Quy Chuẩn Kho Bãi WMS & Logistics Xuất Nhập Khẩu",
          tags: ["Logistics FIATA / C-TPAT", "Kho ngoại quan AEO", "Vận tải đa phương thức", "Khai báo hải quan VNACCS"],
          docName: "Cẩm nang quy trình thông quan & kho vận 3PL xuất khẩu (PDF)",
          docSize: "4.0 MB"
        };
      case "5.1":
        return {
          title: "Quy Chuẩn Tuyển Dụng & Đào Tạo Lao Động Kỹ Thuật",
          tags: ["Luật Lao Động 2019", "An toàn vệ sinh lao động Nhóm 1-6", "Tiêu chuẩn tiền lương & BHXH", "Đào tạo kỹ năng 5S"],
          docName: "Mẫu hợp đồng lao động & quy chế đào tạo an toàn nhà máy (PDF)",
          docSize: "2.5 MB"
        };
      case "5.2":
        return {
          title: "Tiêu Chuẩn Suất Ăn HACCP & Xe Đưa Đón Công Nhân",
          tags: ["HACCP / ISO 22000 Suất ăn", "Bảo hiểm an toàn thực phẩm", "Quy chuẩn xe buýt chở công nhân", "Ký túc xá văn minh"],
          docName: "Checklist audit nhà thầu suất ăn công nghiệp đạt chuẩn HACCP (PDF)",
          docSize: "2.7 MB"
        };
      case "5.3":
        return {
          title: "Tiêu Chuẩn Trang Bị Bảo Hộ Lao Động (PPE) Cá Nhân",
          tags: ["EN ISO 20345 Giày bảo hộ S3", "ANSI Z87.1 Kính an toàn", "Khẩu trang N95 / 3M", "Đồ phòng sạch chống tĩnh điện"],
          docName: "Bảng quy định định mức trang cấp BHLĐ theo từng vị trí (PDF)",
          docSize: "1.9 MB"
        };
      case "6.1":
        return {
          title: "Quy Chuẩn Mở Rộng Quy Mô & Đầu Tư Giai Đoạn 2",
          tags: ["Điều chỉnh IRC/ERC mở rộng", "Báo cáo nghiên cứu khả thi F/S", "ĐTM mở rộng công suất", "Quy hoạch hạ tầng Phase 2"],
          docName: "Mẫu đề xuất dự án mở rộng nhà máy & ưu đãi thuế đầu tư (PDF)",
          docSize: "4.7 MB"
        };
      case "6.2":
        return {
          title: "Tiêu Chuẩn Audit Quốc Tế, ESG & Quà Tặng Doanh Nghiệp",
          tags: ["Báo cáo ESG (GRI/SASB)", "Audit trách nhiệm xã hội SMETA/BSCI", "ISO 14064 Kiểm kê CO2", "Quà tặng sinh thái TahoMart"],
          docName: "Bộ tiêu chí tự đánh giá sẵn sàng đạt chứng chỉ ESG & SMETA (PDF)",
          docSize: "5.8 MB"
        };
      case "6.3":
      default:
        return {
          title: "Tiêu Chuẩn Chuyển Đổi Số & Tối Ưu Hệ Thống AGV",
          tags: ["Robot tự hành AGV/AMR", "Hạ tầng 5G Private xưởng", "Điện mặt trời mái xưởng PPA", "Chứng chỉ năng lượng sạch I-REC"],
          docName: "Lộ trình chuyển đổi mô hình nhà máy xanh thông minh Net-Zero (PDF)",
          docSize: "6.5 MB"
        };
    }
  }, [currentPhase.id]);

  // All 18 Phases Navigation Map
  const all18Phases = useMemo(() => {
    return stagesData.flatMap(s => s.phases.map(p => ({
      ...p,
      stageColor: s.color,
      stageTitle: s.title
    })));
  }, []);

  const currentIndex = all18Phases.findIndex(p => p.id === currentPhase.id);
  const prevPhase = currentIndex > 0 ? all18Phases[currentIndex - 1] : null;
  const nextPhase = currentIndex < all18Phases.length - 1 ? all18Phases[currentIndex + 1] : null;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgPage} space-y-8 pb-32 pt-4 transition-all duration-300 font-sans`}>
      
      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2 flex-wrap gap-y-1">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <Link to="/ban-do-6-giai-doan" className="hover:text-blue-600 font-medium">{lang === 'en' ? '6-Stage Map' : 'Bản đồ 6 giai đoạn'}</Link>
          <span>&gt;</span>
          <Link to={`/giai-doan/${currentStage.id}`} className="hover:text-blue-600 font-medium">
            {lang === 'en' ? `Stage ${currentStage.id}: ${currentStage.titleEn || currentStage.title}` : `Giai đoạn ${currentStage.id}: ${currentStage.title}`}
          </Link>
          <span>&gt;</span>
          <span className="font-bold text-slate-900 font-heading uppercase">
            Pha {currentPhase.id}: {currentPhase.title}
          </span>
        </div>
      </div>

      {/* 2. BLOCK 1: HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
          
          <div 
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[58%] lg:w-[55%] bg-cover bg-center"
            style={{ backgroundImage: `url('${theme.heroImg}')` }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-[42%] sm:via-white/90 sm:via-[45%] to-transparent pointer-events-none"></div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-5">
            
            <div className="flex items-center space-x-2.5">
              <div 
                style={{ backgroundColor: theme.darkColor }}
                className="inline-block px-3 py-1 text-white rounded-lg text-xs font-black uppercase tracking-wider font-heading shadow-xs"
              >
                GIAI ĐOẠN {currentStage.id}
              </div>
              <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-mono font-bold">
                Pha chuyên ngành {currentPhase.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072348] tracking-tight leading-tight uppercase font-heading">
              Pha {currentPhase.id}: {currentPhase.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {customHeroSubtitle || currentPhase.summary}
            </p>

            {/* 3 Realtime Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-heading block">
                  Đối tác sẵn sàng
                </span>
                <strong className="text-sm font-bold text-slate-900 block font-mono">
                  {currentPhase.totalEnterprises || 85}+ Doanh nghiệp
                </strong>
              </div>

              <div className="p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-heading block">
                  Xác thực KYC Lớp 3
                </span>
                <strong className="text-sm font-bold text-emerald-600 block">
                  100% Đạt Chuẩn B2B
                </strong>
              </div>

              <div className="p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-heading block">
                  Cam kết phản hồi
                </span>
                <strong className="text-sm font-bold text-blue-600 block">
                  SLA &lt; 2 Giờ
                </strong>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleOpenRfq(null, false)}
                style={{ backgroundColor: theme.color }}
                className="px-6 py-3 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md hover:opacity-90 transition flex items-center space-x-2 uppercase"
              >
                <Send className="w-4 h-4" />
                <span>Yêu Cầu Báo Giá Pha {currentPhase.id}</span>
              </button>

              <button
                onClick={() => handleOpenRfq(null, true)}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md transition flex items-center space-x-2 uppercase"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Bidding Ẩn Danh</span>
              </button>
            </div>

          </div>

          {/* Bottom 3-Phase Switcher */}
          <div className="relative z-10 border-t border-slate-100 bg-white/85 backdrop-blur-md px-4 sm:px-8 py-3 overflow-x-auto">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-max">
              <span className="text-xs font-bold text-slate-400 uppercase font-heading mr-2">
                Các pha thuộc GĐ {currentStage.id}:
              </span>
              {currentStage.phases.map((p) => {
                const isCurrent = p.id === currentPhase.id;
                return (
                  <Link
                    key={p.id}
                    to={`/pha/${p.id}`}
                    style={{
                      backgroundColor: isCurrent ? theme.darkColor : undefined,
                      color: isCurrent ? '#ffffff' : undefined
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                      isCurrent
                        ? 'shadow-xs font-heading'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-black text-[10px] ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {p.id}
                    </span>
                    <span>{p.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 3. BLOCK 2: COMPLIANCE BOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wide font-heading">
                {complianceData.title}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mọi quy trình và hồ sơ kỹ thuật trong Pha {currentPhase.id} đều tuân thủ nghiêm ngặt hệ thống pháp luật Việt Nam và các tiêu chuẩn kiểm định quốc tế.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {complianceData.tags.map((tag, tIdx) => (
                <span 
                  key={tIdx}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-xs font-semibold text-slate-100 transition"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 self-start lg:self-center">
            <button
              onClick={() => alert(`Đang tải tài liệu: ${complianceData.docName}`)}
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs sm:text-sm font-bold font-heading shadow-md transition flex items-center space-x-2"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Tải Checklist Pháp Lý ({complianceData.docSize})</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. BLOCK 3: MATCHMAKING CORE (2 CỘT 3:7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* CỘT TRÁI: ADVANCED FILTER (280px) */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div 
                    style={{ backgroundColor: `${theme.color}15`, color: theme.color }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
                  >
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase font-heading">
                      Bộ Lọc Chuyên Sâu
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Tìm thấy <strong className="text-slate-900">{phaseSuppliers.length}</strong> đối tác Pha {currentPhase.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center space-x-1 transition"
                  title="Đặt lại bộ lọc"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading flex items-center justify-between">
                  <span>Tìm từ khóa dịch vụ</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên, dịch vụ, thiết bị..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                />
              </div>

              {/* Vị trí địa lý */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Khu vực địa lý</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                  {[
                    { id: 'all', label: 'Toàn quốc' },
                    { id: 'north', label: 'Miền Bắc' },
                    { id: 'south', label: 'Miền Nam' },
                    { id: 'central', label: 'Miền Trung' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setFilters({ ...filters, region: r.id })}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] transition ${
                        filters.region === r.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cấp độ KYC B2B */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cấp độ xác thực KYC</span>
                </label>
                {[
                  { id: 'diamond', label: '💎 Kim Cương (Lớp 3)', sub: 'Bảo chứng tài chính' },
                  { id: 'gold', label: '🥇 Vàng (Lớp 2)', sub: 'Xác minh thực tế' },
                  { id: 'silver', label: '🥈 Bạc (Lớp 1)', sub: 'Pháp lý cơ sở' }
                ].map(opt => {
                  const isChecked = filters.kycTiers.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        if (isChecked) {
                          setFilters({ ...filters, kycTiers: filters.kycTiers.filter(k => k !== opt.id) });
                        } else {
                          setFilters({ ...filters, kycTiers: [...filters.kycTiers, opt.id] });
                        }
                      }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isChecked ? 'bg-slate-50 border-slate-400 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs text-slate-900">{opt.label}</span>
                      {isChecked ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                    </div>
                  );
                })}
              </div>

              {/* Toggle ERP / Quản trị */}
              <div className="pt-2 border-t border-slate-100">
                <div 
                  onClick={() => setFilters({ ...filters, erpOnly: !filters.erpOnly })}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    filters.erpOnly ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 font-heading block">
                      ⚡ Sẵn sàng ERP / API Quản trị
                    </span>
                    <p className="text-[10px] text-slate-500">Đồng bộ API báo giá</p>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 ${filters.erpOnly ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${filters.erpOnly ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* CỘT PHẢI: LISTING GRID */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Header Listing Bar */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    Danh Sách Đối Tác & KCN – Pha {currentPhase.id}
                  </h3>
                  <span 
                    style={{ backgroundColor: `${theme.color}20`, color: theme.darkColor }}
                    className="px-2.5 py-0.5 rounded-full text-xs font-black font-mono"
                  >
                    {phaseSuppliers.length} kết quả
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Được xác thực qua hợp đồng điện tử CCU SafeMatch, cam kết phản hồi SLA &lt; 2h.
                </p>
              </div>

              <button
                onClick={() => handleOpenRfq(null, false)}
                style={{ backgroundColor: theme.color }}
                className="px-4 py-2 text-white rounded-xl text-xs font-bold font-heading shadow-xs hover:opacity-90 transition flex items-center space-x-1.5 self-start sm:self-auto uppercase"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Đăng Yêu Cầu Chào Giá</span>
              </button>
            </div>

            {/* Cards List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                        <div className="space-y-2">
                          <div className="w-48 h-4 bg-slate-200 rounded" />
                          <div className="w-32 h-3 bg-slate-200 rounded" />
                        </div>
                      </div>
                      <div className="w-24 h-6 bg-slate-200 rounded-lg" />
                    </div>
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : phaseSuppliers.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {phaseSuppliers.map(supplier => (
                  <StageSupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onRequestQuote={(s) => handleOpenRfq(s, false)}
                    themeColor={theme.color}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
                  🔍
                </div>
                <h4 className="text-lg font-black text-slate-900 font-heading">
                  Chưa tìm thấy đối tác khớp bộ lọc trong Pha {currentPhase.id}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Hiện đang có <strong>15 dự án FDI</strong> đang tìm kiếm nhà cung cấp theo tiêu chí này. Hãy đặt lại bộ lọc hoặc tạo yêu cầu báo giá mới.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                  >
                    Đặt lại bộ lọc
                  </button>
                  <button
                    onClick={() => handleOpenRfq(null, false)}
                    style={{ backgroundColor: theme.color }}
                    className="px-6 py-2.5 text-white rounded-xl text-xs font-bold font-heading shadow-md"
                  >
                    Tạo Yêu Cầu Chào Giá Mới
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 5. BLOCK 4: PRIVATE BIDDING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>BẢO VỆ DANH TÍNH CHỦ ĐẦU TƯ FDI 100%</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight leading-tight">
                Tạo Lệnh Bidding Ẩn Danh (Private Tender RFQ)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Bạn muốn tìm kiếm đối tác cung ứng trong Pha {currentPhase.id} nhưng chưa muốn công khai danh tính trên thị trường? Hệ thống CCU sẽ mã hóa thông tin dự án và chỉ kết nối trực tiếp với các nhà cung cấp đạt chuẩn <strong>KYC Kim Cương (Lớp 3)</strong>.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => handleOpenRfq(null, true)}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 font-heading uppercase transition flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Tạo Lệnh Bidding Ẩn Danh</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BLOCK 5: RELATED PHASES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
              Các Pha Tiếp Theo & Điều Hướng 18 Pha
            </h3>
            <p className="text-xs text-slate-500">
              Chuyển đổi mượt mà giữa 18 mắt xích cốt lõi trong chuỗi cung ứng công nghiệp quốc gia.
            </p>
          </div>

          <Link 
            to="/ban-do-6-giai-doan"
            style={{ color: theme.color }}
            className="text-xs font-bold font-heading hover:underline flex items-center space-x-1"
          >
            <span>Xem sa bàn 6 giai đoạn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prevPhase && (
            <Link
              to={`/pha/${prevPhase.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition space-y-2 group"
            >
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold">
                <span>← Pha trước đó</span>
                <span>•</span>
                <span className="text-slate-400">GĐ {prevPhase.stageId}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 font-heading group-hover:text-blue-600 transition">
                Pha {prevPhase.id}: {prevPhase.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">{prevPhase.summary}</p>
            </Link>
          )}

          {nextPhase && (
            <Link
              to={`/pha/${nextPhase.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition space-y-2 group"
            >
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold">
                <span>Pha tiếp theo →</span>
                <span>•</span>
                <span className="text-slate-400">GĐ {nextPhase.stageId}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 font-heading group-hover:text-blue-600 transition">
                Pha {nextPhase.id}: {nextPhase.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">{nextPhase.summary}</p>
            </Link>
          )}

          <Link
            to={`/giai-doan/${currentStage.id}`}
            style={{ backgroundColor: `${theme.color}10`, borderColor: `${theme.color}30` }}
            className="rounded-2xl border p-4 hover:shadow-sm transition space-y-2 flex flex-col justify-between"
          >
            <div>
              <span style={{ color: theme.darkColor }} className="text-xs font-black uppercase font-heading block">
                Tổng quan Giai đoạn {currentStage.id}
              </span>
              <h4 className="text-sm font-black text-slate-900 font-heading mt-1">
                {currentStage.title}
              </h4>
            </div>
            <span style={{ color: theme.color }} className="text-xs font-bold hover:underline flex items-center space-x-1">
              <span>Xem toàn bộ 3 pha của GĐ {currentStage.id}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* 7. BOTTOM STICKY FLOATING ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div 
              style={{ backgroundColor: `${theme.color}20`, color: theme.darkColor }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold"
            >
              ⚡
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 font-heading">
                Bạn đang tìm kiếm giải pháp cho Pha {currentPhase.id}: {currentPhase.title}?
              </h4>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Hơn {currentPhase.totalEnterprises || 85}+ doanh nghiệp đã được xác thực KYC và sẵn sàng kết nối.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleOpenRfq(null, false)}
              style={{ backgroundColor: theme.color }}
              className="flex-1 sm:flex-none px-5 py-2.5 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md hover:opacity-90 transition flex items-center justify-center space-x-1.5 uppercase"
            >
              <Send className="w-4 h-4" />
              <span>Tạo Nhu Cầu Báo Giá</span>
            </button>

            <button
              onClick={() => handleOpenRfq(null, true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md transition flex items-center justify-center space-x-1.5 uppercase"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Bidding Ẩn Danh</span>
            </button>
          </div>

        </div>
      </div>

      {/* 8. RFQ MODAL */}
      <StageRequestQuoteModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        supplier={selectedSupplierForRfq}
        stageTitle={`Giai đoạn ${currentStage.id}: ${currentStage.title}`}
        phaseTitle={`Pha ${currentPhase.id}: ${currentPhase.title} ${isPrivateBiddingMode ? '(Chế độ Bidding Ẩn Danh)' : ''}`}
        themeColor={theme.color}
      />

    </div>
  );
}
