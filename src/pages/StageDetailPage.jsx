import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, ChevronRight, FileText, 
  Building2, Factory, Users, MapPin, Sparkles, Layers,
  Compass, Check, Shield, Wrench, RefreshCw, Briefcase, 
  FileCheck, Download, ExternalLink, HelpCircle, Send,
  Filter, Zap, Star, Clock, PlusCircle
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { stageSuppliers } from '../data/stageSuppliersData';
import { useLanguage } from '../contexts/LanguageContext';
import StageFilterSidebar from '../components/stage/StageFilterSidebar';
import StageSupplierCard from '../components/stage/StageSupplierCard';
import StageRequestQuoteModal from '../components/stage/StageRequestQuoteModal';

export default function StageDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  // Parse stageId (supports "1", "1-khao-sat-phap-ly-ha-tang", etc.)
  const stageId = parseInt(id) || 1;
  const stage = stagesData.find(s => s.id === stageId) || stagesData[0];

  // Dynamic Theme Palette matching the 6 Flower Petal Colors:
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

  // Micro-Tabs State: selected phase id ("all" or "1.1", "1.2", "1.3")
  const [selectedPhase, setSelectedPhase] = useState("all");

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    kycTiers: [],
    erpOnly: false,
    standards: []
  });

  // Skeleton loading simulation on filter change (< 250ms)
  const [isLoading, setIsLoading] = useState(false);

  // RFQ Modal State
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [selectedSupplierForRfq, setSelectedSupplierForRfq] = useState(null);

  // Reset phase when stage changes
  useEffect(() => {
    setSelectedPhase("all");
    setFilters({
      search: '',
      kycTiers: [],
      erpOnly: false,
      standards: []
    });
  }, [stage.id]);

  // Handle opening RFQ Modal
  const handleOpenRfq = (supplier = null) => {
    setSelectedSupplierForRfq(supplier);
    setIsRfqModalOpen(true);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      kycTiers: [],
      erpOnly: false,
      standards: []
    });
  };

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    // Start with suppliers for this stage
    let list = stageSuppliers.filter(s => s.stageId === stage.id);

    // Filter by selected phase
    if (selectedPhase !== "all") {
      list = list.filter(s => s.phaseId === selectedPhase);
    }

    // Filter by keyword search
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

    // Filter by KYC Tiers
    if (filters.kycTiers && filters.kycTiers.length > 0) {
      list = list.filter(s => filters.kycTiers.includes(s.kycTier));
    }

    // Filter by ERP Ready
    if (filters.erpOnly) {
      list = list.filter(s => s.erpReady === true || s.odooReady === true);
    }

    // Filter by Standards / Certifications
    if (filters.standards && filters.standards.length > 0) {
      list = list.filter(s => 
        s.standards && filters.standards.some(reqStd => s.standards.includes(reqStd))
      );
    }

    return list;
  }, [stage.id, selectedPhase, filters]);

  // Trigger quick skeleton animation on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [selectedPhase, filters]);

  // Dynamic Stage-Specific Ecosystem Roles (Customized for Stages 1 to 6)
  const ecosystemRoles = useMemo(() => {
    switch (stage.id) {
      case 2:
        return [
          { icon: <Factory className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "EPC General Contractor" : "Tổng thầu EPC", desc: lang === 'en' ? "Design & Build execution" : "Thiết kế & thi công xây dựng trọn gói" },
          { icon: <Building2 className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Steel Structure" : "Kết cấu thép tiền chế", desc: lang === 'en' ? "Fabrication & site erection" : "Gia công & lắp dựng dầm nhịp lớn" },
          { icon: <Wrench className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "MEP Contractor" : "Nhà thầu cơ điện MEP", desc: lang === 'en' ? "HVAC, Substation & Piping" : "Trạm biến áp, Chiller, PCCC tự động" },
          { icon: <Users className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Supervision Consultant" : "Tư vấn giám sát", desc: lang === 'en' ? "QA/QC on-site management" : "Kiểm soát chất lượng thi công hiện trường" },
          { icon: <Shield className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Fire Safety Agency" : "Thẩm duyệt PCCC", desc: lang === 'en' ? "QCVN 06:2022 fire standards" : "Nghiệm thu an toàn PCCC công trình" }
        ];
      case 3:
        return [
          { icon: <Cpu className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "OEM Equipment Maker" : "Nhà sản xuất máy móc", desc: lang === 'en' ? "Supplying assembly lines" : "Cung cấp dây chuyền công nghệ chính" },
          { icon: <Layers className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Cleanroom Contractor" : "Nhà thầu phòng sạch", desc: lang === 'en' ? "ISO 14644 panel fit-out" : "Thi công panel & AHU phòng sạch" },
          { icon: <Wrench className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Heavy Rigging Partner" : "Vận tải siêu trường", desc: lang === 'en' ? "Machine lifting & leveling" : "Nâng hạ, cân chỉnh máy móc nặng" },
          { icon: <FileCheck className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Audit & Inspection" : "Trung tâm kiểm định", desc: lang === 'en' ? "Safety load testing" : "Kiểm định an toàn thiết bị áp lực" },
          { icon: <Zap className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Scada/PLC Integrator" : "Tích hợp Scada/PLC", desc: lang === 'en' ? "Automation commissioning" : "Lập trình điều khiển & chạy thử" }
        ];
      case 4:
        return [
          { icon: <Factory className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Plant Director" : "Ban Giám Đốc Nhà Máy", desc: lang === 'en' ? "Daily manufacturing KPI" : "Điều hành sản xuất & chỉ số OEE" },
          { icon: <Building2 className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Raw Materials Supplier" : "Cung ứng NVL & Phụ tùng", desc: lang === 'en' ? "Just-In-Time supplies" : "Cung cấp phôi thép, nhựa, linh kiện" },
          { icon: <Cpu className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "MES / Smart Factory" : "Phần mềm MES / ERP", desc: lang === 'en' ? "Realtime shopfloor IoT" : "Số hóa lệnh sản xuất & AI Camera QC" },
          { icon: <Wrench className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "TPM Maintenance" : "Bảo trì bảo dưỡng TPM", desc: lang === 'en' ? "Preventive repairs" : "Bảo dưỡng phòng ngừa sự cố máy" },
          { icon: <MapPin className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "3PL Outbound Logistics" : "Logistics & Kho bãi", desc: lang === 'en' ? "Customs & shipping" : "Kho ngoại quan & xuất khẩu container" }
        ];
      case 5:
        return [
          { icon: <Users className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "HR & Labor Staffing" : "Cung ứng lao động", desc: lang === 'en' ? "Mass worker recruiting" : "Tuyển dụng hàng ngàn nhân công" },
          { icon: <Briefcase className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Headhunt Agency" : "Headhunter cấp cao", desc: lang === 'en' ? "Engineers & plant managers" : "Tuyển dụng kỹ sư & chuyên gia FDI" },
          { icon: <Building2 className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Industrial Catering" : "Suất ăn công nghiệp", desc: lang === 'en' ? "HACCP certified meals" : "Bếp ăn trung tâm chuẩn an toàn thực phẩm" },
          { icon: <MapPin className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Staff Commuter Bus" : "Xe đưa đón công nhân", desc: lang === 'en' ? "Daily bus transport" : "Hệ thống xe 45 chỗ & Limousine" },
          { icon: <Shield className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "PPE & Safety Gear" : "Bảo hộ lao động PPE", desc: lang === 'en' ? "Shoes, helmets & uniforms" : "Đồng phục, giày chống đinh, kính 3M" }
        ];
      case 6:
        return [
          { icon: <Building2 className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Industrial Park Dev" : "Chủ đầu tư KCN", desc: lang === 'en' ? "Phase 2 land expansion" : "Bàn giao quỹ đất mở rộng Phase 2" },
          { icon: <FileCheck className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "ESG Audit Agency" : "Tổ chức audit quốc tế", desc: lang === 'en' ? "TÜV, SGS, BSI audits" : "Audit BSCI, SMETA, ISO 14064" },
          { icon: <Zap className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Rooftop Solar PPA" : "Điện mặt trời mái xưởng", desc: lang === 'en' ? "Green I-REC credits" : "Đầu tư năng lượng xanh 0 đồng" },
          { icon: <Briefcase className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Corporate Gifts B2B" : "Quà tặng & Hậu mãi", desc: lang === 'en' ? "TahoMart eco packaging" : "Túi canvas, hộp quà đặc sản Nam Huy" },
          { icon: <Sparkles className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Green Finance Fund" : "Quỹ tài chính xanh ESG", desc: lang === 'en' ? "Expansion loans & IPO" : "Thu xếp vốn mở rộng & tư vấn IPO" }
        ];
      case 1:
      default:
        return [
          { icon: <Factory className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Factory / Investor" : "Nhà máy / Chủ đầu tư", desc: lang === 'en' ? "Orienting & executing project" : "Định hướng, quyết định và triển khai dự án" },
          { icon: <Users className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Industrial Association" : "Hội / Hiệp hội", desc: lang === 'en' ? "Consulting & networking" : "Tư vấn, kết nối, hỗ trợ thành viên" },
          { icon: <Building2 className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Verified Supplier" : "Doanh nghiệp cung ứng", desc: lang === 'en' ? "Supplying solutions per phase" : "Cung cấp giải pháp, dịch vụ theo từng pha" },
          { icon: <MapPin className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Industrial Park (IP)" : "Khu công nghiệp", desc: lang === 'en' ? "Land & infrastructure support" : "Cung cấp hạ tầng, quỹ đất và hỗ trợ đầu tư" },
          { icon: <Briefcase className="w-5 h-5" style={{ color: theme.color }} />, name: lang === 'en' ? "Support Entity" : "Tổ chức tài chính & pháp lý", desc: lang === 'en' ? "Banking, legal, consulting" : "Thu xếp vốn FDI, tư vấn thuế, ĐTM" }
        ];
    }
  }, [stage.id, theme.color, lang]);

  // Dynamic Stage-Specific Reference Documents
  const sampleDocuments = useMemo(() => {
    switch (stage.id) {
      case 2:
        return [
          { name: "Checklist thiết kế tổng mặt bằng & BIM 3D (PDF)", size: "2.8 MB" },
          { name: "Mẫu hồ sơ thẩm duyệt PCCC nhà xưởng QCVN 06:2022 (PDF)", size: "4.1 MB" },
          { name: "Tiêu chuẩn thi công kết cấu thép tiền chế & nền sàn (PDF)", size: "3.5 MB" },
          { name: "Danh bạ nhà thầu xây dựng EPC & MEP xác thực (PDF)", size: "2.2 MB" }
        ];
      case 3:
        return [
          { name: "Quy trình chạy thử nghiệm thu máy móc liên động (PDF)", size: "3.1 MB" },
          { name: "Checklist thi công phòng sạch ISO 14644 Class 100-100k (PDF)", size: "2.6 MB" },
          { name: "Mẫu biên bản kiểm định an toàn thiết bị áp lực & cầu trục (PDF)", size: "1.9 MB" },
          { name: "Sổ tay hướng dẫn lập trình Scada/PLC công nghiệp (PDF)", size: "5.4 MB" }
        ];
      case 4:
        return [
          { name: "Sổ tay quản trị bảo trì phòng ngừa TPM nhà máy (PDF)", size: "3.4 MB" },
          { name: "Bảng tiêu chuẩn kiểm soát chất lượng QA/QC AQL (PDF)", size: "1.7 MB" },
          { name: "Quy trình khai báo hải quan điện tử & kho ngoại quan (PDF)", size: "2.9 MB" },
          { name: "Danh bạ nhà cung cấp vật tư công nghiệp phụ trợ (PDF)", size: "4.8 MB" }
        ];
      case 5:
        return [
          { name: "Mẫu thỏa ước lao động tập thể & nội quy nhà máy (PDF)", size: "1.5 MB" },
          { name: "Quy chuẩn an toàn vệ sinh lao động nhóm 1 đến 6 (PDF)", size: "3.2 MB" },
          { name: "Tiêu chuẩn kiểm soát suất ăn công nghiệp HACCP (PDF)", size: "2.1 MB" },
          { name: "Danh bạ công ty cung ứng lao động & nhà xe đưa đón (PDF)", size: "2.8 MB" }
        ];
      case 6:
        return [
          { name: "Khung hướng dẫn lập báo cáo phát triển bền vững ESG (PDF)", size: "4.5 MB" },
          { name: "Quy trình kiểm kê khí nhà kính & bù trừ carbon ISO 14064 (PDF)", size: "3.6 MB" },
          { name: "Checklist audit trách nhiệm xã hội BSCI & Sedex SMETA (PDF)", size: "2.9 MB" },
          { name: "Hồ sơ đề xuất đầu tư mở rộng nhà máy giai đoạn 2 (PDF)", size: "5.1 MB" }
        ];
      case 1:
      default:
        return [
          { name: "Checklist thủ tục pháp lý & cấp phép FDI (PDF)", size: "1.2 MB" },
          { name: "Mẫu kế hoạch triển khai đầu tư nhà máy (PDF)", size: "2.4 MB" },
          { name: "Quy trình lập ĐTM & thẩm duyệt PCCC sơ bộ (PDF)", size: "1.8 MB" },
          { name: "Danh bạ KCN & Đối tác tài chính liên kết (PDF)", size: "3.1 MB" }
        ];
    }
  }, [stage.id]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgPage} space-y-8 pb-32 pt-4 transition-all duration-300 font-sans`}>
      
      {/* 1. BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <Link to="/ban-do-6-giai-doan" className="hover:text-blue-600 font-medium">{lang === 'en' ? '6-Stage Map' : 'Bản đồ 6 giai đoạn'}</Link>
          <span>&gt;</span>
          <span className="font-bold text-slate-900 font-heading uppercase">
            {lang === 'en' ? `Stage ${stage.id}: ${stage.titleEn || stage.title}` : `GIAI ĐOẠN ${stage.id}: ${stage.title}`}
          </span>
        </div>
      </div>

      {/* 2. HERO HEADER BANNER (EXACT IMAGE 1 DESIGN: Bright White Card, Right Factory Image, 3 Metric Pills, 6-Stage Pills) */}
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

      {/* 3. STICKY MICRO-TABS (PHASE NAVIGATOR) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-2 z-30">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-2 flex items-center justify-between gap-2 overflow-x-auto">
          
          <div className="flex items-center space-x-2 min-w-max">
            {/* All Phases Tab */}
            <button
              onClick={() => setSelectedPhase("all")}
              style={{
                backgroundColor: selectedPhase === "all" ? theme.color : undefined,
                color: selectedPhase === "all" ? "#ffffff" : undefined
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                selectedPhase === "all"
                  ? 'shadow-xs font-heading'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tất cả các pha ({stage.phases.length})</span>
            </button>

            {/* Phase Sub-Tabs */}
            {stage.phases.map((ph) => {
              const isActive = selectedPhase === ph.id;
              return (
                <button
                  key={ph.id}
                  onClick={() => setSelectedPhase(ph.id)}
                  style={{
                    backgroundColor: isActive ? theme.color : undefined,
                    color: isActive ? "#ffffff" : undefined
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'shadow-xs font-heading'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-black ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {ph.id}
                  </span>
                  <span>{ph.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick RFQ Action on Header */}
          <button
            onClick={() => handleOpenRfq(null)}
            style={{ backgroundColor: `${theme.color}15`, color: theme.color, borderColor: `${theme.color}40` }}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 border rounded-xl text-xs font-bold font-heading hover:bg-white transition flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tạo Nhu Cầu Báo Giá (RFQ)</span>
          </button>

        </div>
      </div>

      {/* 4. WORKSPACE: 2-COLUMN LAYOUT (SMART FILTER + SUPPLIER GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Smart Filter Sidebar (280px) */}
          <StageFilterSidebar
            stageId={stage.id}
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
            totalResults={filteredSuppliers.length}
            themeColor={theme.color}
          />

          {/* Right Column: Supplier Grid / List */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Top Workspace Header Bar */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                    {selectedPhase === "all" ? `Mạng Lưới Đối Tác Giai Đoạn ${stage.id}` : `Danh Sách Đối Tác Pha ${selectedPhase}`}
                  </h3>
                  <span 
                    style={{ backgroundColor: `${theme.color}20`, color: theme.darkColor }}
                    className="px-2.5 py-0.5 rounded-full text-xs font-black font-mono"
                  >
                    {filteredSuppliers.length} kết quả
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Xác thực năng lực qua hồ sơ KYC B2B, tích hợp báo giá tự động và hỗ trợ đàm phán 1-1.
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  onClick={() => handleOpenRfq(null)}
                  style={{ backgroundColor: theme.color }}
                  className="px-4 py-2 text-white rounded-xl text-xs font-bold font-heading shadow-xs hover:opacity-90 transition flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Đăng Yêu Cầu Chào Giá</span>
                </button>
              </div>
            </div>

            {/* Supplier Cards List */}
            {isLoading ? (
              // Skeleton Loading Transition (< 250ms)
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
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
            ) : filteredSuppliers.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {filteredSuppliers.map((supplier) => (
                  <StageSupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onRequestQuote={handleOpenRfq}
                    themeColor={theme.color}
                  />
                ))}
              </div>
            ) : (
              // Friendly Empty State with FOMO Message
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-10 sm:p-14 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
                  🔍
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="text-xl font-black text-slate-900 font-heading">
                    Chưa Có Đối Tác Khớp Bộ Lọc
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Hiện đang có <strong>15 dự án FDI</strong> đang tìm kiếm nhà cung cấp theo các tiêu chí này. Hãy đặt lại bộ lọc hoặc đăng ký tham gia chuỗi cung ứng ngay hôm nay.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                  >
                    Đặt lại bộ lọc
                  </button>
                  <button
                    onClick={() => handleOpenRfq(null)}
                    style={{ backgroundColor: theme.color }}
                    className="px-6 py-2.5 text-white rounded-xl text-xs font-bold font-heading shadow-md hover:opacity-90 transition flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Đăng Ký Nhu Cầu Tìm Đối Tác</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 5. SECTION: 3 PHA CHI TIẾT (CÔNG VIỆC CHÍNH, NHU CẦU THƯỜNG GẶP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-heading">
              {lang === 'en' ? `3 Core Phases Blueprint - Stage ${stage.id}` : `Bản Thiết Kế 3 Pha Của Giai Đoạn ${stage.id}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chi tiết các bước công việc chuẩn hóa ISO và các hạng mục thường xuyên phát sinh nhu cầu kết nối.
            </p>
          </div>
          
          <Link
            to="/ban-do-6-giai-doan"
            style={{ color: theme.color, borderColor: theme.color }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 border rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition self-start sm:self-auto font-heading uppercase"
          >
            <span>{lang === 'en' ? 'View 6 Stages Map' : 'Xem sa bàn 6 giai đoạn'}</span>
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
                      {idx === 0 ? <Compass className="w-5 h-5" style={{ color: theme.color }} /> :
                       idx === 1 ? <FileText className="w-5 h-5" style={{ color: theme.color }} /> :
                                   <MapPin className="w-5 h-5" style={{ color: theme.color }} />}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase font-heading leading-snug">
                    {lang === 'en' ? (phase.titleEn || phase.title) : phase.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {lang === 'en' ? (phase.summaryEn || phase.summary) : phase.summary}
                  </p>

                  <div className="pt-1 flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedPhase(phase.id);
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      style={{ color: theme.color }}
                      className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold hover:underline transition"
                    >
                      <span>Lọc đối tác pha này</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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

                {/* Col 3: NHU CẦU THƯỜNG GẶP (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-2.5">
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
                </div>

                {/* Col 4: HÀNH ĐỘNG NHANH (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading">
                    Kết nối nhanh B2B
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tạo yêu cầu báo giá chuyên biệt cho hạng mục thuộc Pha {phase.id}.
                  </p>
                  
                  <button
                    onClick={() => handleOpenRfq(null)}
                    style={{ backgroundColor: theme.color }}
                    className="w-full py-2.5 text-white rounded-xl text-xs font-bold font-heading shadow-xs hover:opacity-90 transition flex items-center justify-center space-x-1.5 uppercase"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Yêu Cầu Báo Giá Pha {phase.id}</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SECTION: HỆ SINH THÁI THAM GIA GIAI ĐOẠN + TÀI LIỆU THAM KHẢO */}
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
                {lang === 'en' ? 'REFERENCE DOCUMENTS' : 'Tài liệu tham khảo & Checklist'}
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

      {/* 7. BOTTOM STICKY FLOATING ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div 
              style={{ backgroundColor: `${theme.color}20`, color: theme.darkColor }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold"
            >
              🚀
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 font-heading">
                Bạn đang tìm kiếm hoặc cung cấp giải pháp trong {stage.title}?
              </h4>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Hơn 250+ doanh nghiệp đã được xác thực KYC và sẵn sàng kết nối giao thương.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleOpenRfq(null)}
              style={{ backgroundColor: theme.color }}
              className="flex-1 sm:flex-none px-5 py-2.5 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md hover:opacity-90 transition flex items-center justify-center space-x-1.5 uppercase"
            >
              <Send className="w-4 h-4" />
              <span>Tạo Nhu Cầu Báo Giá (RFQ)</span>
            </button>

            <Link
              to="/dang-nhu-cau"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md transition flex items-center justify-center space-x-1.5 uppercase"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Xác Thực Hồ Sơ Nhận Lead</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 8. REQUEST QUOTE MODAL */}
      <StageRequestQuoteModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        supplier={selectedSupplierForRfq}
        stageTitle={stage.title}
        phaseTitle={selectedPhase === "all" ? "Tất cả các pha" : `Pha ${selectedPhase}`}
        themeColor={theme.color}
      />

    </div>
  );
}
