import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, CheckCircle2, ArrowRight, RotateCcw, Sparkles, 
  Building2, Factory, Users, ShieldCheck, MapPin, Download, 
  FileText, Clock, AlertTriangle, ChevronRight, Check, Brain,
  ShoppingBag, Flame, Lock, Send, Layers, Award, Star, Phone, Mail, X
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function DiagnosticQuizPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Load initial state from LocalStorage if available
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_diagnostic_step');
      return saved ? parseInt(saved, 10) : 1;
    } catch (e) {
      return 1;
    }
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_diagnostic_answers');
      return saved ? JSON.parse(saved) : {
        role: 'supplier', // 'supplier' | 'factory' | 'buyer' | 'epc' | 'logistics'
        stageId: 6, // 1 - 6
        industry: 'packaging_food', // 'packaging_food' | 'mechanical' | 'electronics' | 'plastics' | 'mep' | 'textile'
        readiness: 'iso_ready', // 'iso_ready' | 'export_ready' | 'sme_growth' | 'fdi_capacity'
        urgentNeed: 'bid_rfq' // 'bid_rfq' | 'oem_odm' | 'lock_price' | 'kyc_l2'
      };
    } catch (e) {
      return {
        role: 'supplier',
        stageId: 6,
        industry: 'packaging_food',
        readiness: 'iso_ready',
        urgentNeed: 'bid_rfq'
      };
    }
  });

  const [hoveredOptionInfo, setHoveredOptionInfo] = useState('');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      return localStorage.getItem('ccu_diagnostic_completed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [leadForm, setLeadForm] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    zalo: ''
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('ccu_diagnostic_step', currentStep.toString());
      localStorage.setItem('ccu_diagnostic_answers', JSON.stringify(answers));
      localStorage.setItem('ccu_diagnostic_completed', isCompleted.toString());
    } catch (e) {
      // ignore
    }
  }, [currentStep, answers, isCompleted]);

  // AI Progress messages for Gamification
  const aiProgressMessages = {
    1: { pct: 20, msg: 'Đang phân tích vị thế cốt lõi của doanh nghiệp trong chuỗi cung ứng...' },
    2: { pct: 40, msg: 'Đang quét bản đồ 6 giai đoạn & 18 pha sản xuất công nghiệp...' },
    3: { pct: 60, msg: 'Đang đối soát 1.256+ nhu cầu thầu từ Odoo TAHOMART & HDBank...' },
    4: { pct: 80, msg: 'Đang tính toán ma trận tương thích năng lực & điểm KYC Lớp 2...' },
    5: { pct: 95, msg: 'Đang khởi tạo báo cáo định vị & danh mục gói thầu độc bản...' }
  };

  const currentAiState = aiProgressMessages[currentStep] || aiProgressMessages[1];

  // Options Data for Step 1: Core Role
  const roleOptions = [
    {
      id: 'supplier',
      title: 'Nhà Cung Cấp Nguyên Vật Liệu & Phụ Liệu',
      sub: 'Material & Component Supplier',
      desc: 'Cung cấp bao bì hộp quà 9:16, túi canvas, màng co, nông sản FMCG, hạt nhựa, kim loại, phụ tùng.',
      microCopy: 'Phù hợp để kết nối thầu với các chuỗi bán lẻ, ngân hàng và nhà máy sản xuất cần nguồn cung ổn định.',
      icon: ShoppingBag,
      badge: 'B2B Sourcing Target'
    },
    {
      id: 'factory',
      title: 'Nhà Máy & Xưởng Sản Xuất Vận Hành',
      sub: 'Manufacturing Factory Owner',
      desc: 'Sở hữu nhà xưởng, dây chuyền sản xuất cơ khí, chế biến thực phẩm, điện tử SMT, may mặc, nhựa.',
      microCopy: 'Được gợi ý tối ưu định mức nguyên liệu, nhận đơn gia công OEM/ODM và kết nối chuỗi phân phối.',
      icon: Factory,
      badge: 'Active Production'
    },
    {
      id: 'buyer',
      title: 'Chủ Đầu Tư FDI & Khối Mua Hàng Chuỗi',
      sub: 'FDI Enterprise & Chain Procurement',
      desc: 'Khối bán lẻ (TAHOMART), Ngân hàng (HDBank, VietinBank), FDI (Samsung, Foxconn) cần tìm nhà cung ứng.',
      microCopy: 'Mở quyền đăng RFQ thầu bảo mật, lọc danh sách nhà máy đã xác minh năng lực và hồ sơ ERP.',
      icon: Building2,
      badge: 'FDI / Procurement Hub'
    },
    {
      id: 'epc',
      title: 'Nhà Thầu Xây Dựng EPC, Cơ Điện & MEP',
      sub: 'EPC Contractor & Cleanroom MEP',
      desc: 'Thi công kết cấu thép, panel phòng sạch EPS/PU, hệ thống điều hòa HVAC, trạm biến áp, PCCC.',
      microCopy: 'Khớp lệnh trực tiếp với các dự án xây mới xưởng tại 400+ KCN toàn quốc.',
      icon: Layers,
      badge: 'Stage 1-3 EPC'
    },
    {
      id: 'logistics',
      title: 'Đơn Vị Logistics, Kho Bãi & Dịch Vụ Hỗ Trợ',
      sub: 'Logistics, Warehousing & HR Provider',
      desc: 'Cung cấp kho lạnh bảo quản nông sản, vận chuyển container cảng biển, tuyển dụng nhân lực KCN.',
      microCopy: 'Tham gia mạng lưới điều phối chuỗi cung ứng vệ tinh phía Bắc và phía Nam.',
      icon: Compass,
      badge: 'Stage 5 SCM Logistics'
    }
  ];

  // Options Data for Step 2: 6 Stages
  const stageOptions = [
    {
      id: 1,
      code: 'GĐ 1',
      title: 'Chuẩn Bị Đầu Tư & Khảo Sát KCN',
      desc: 'Khảo sát quỹ đất, lập nghiên cứu khả thi, thủ tục giấy phép đầu tư IRC/ERC.',
      microCopy: 'Gợi ý AI: Phù hợp cho tư vấn pháp lý, quy hoạch KCN, đo đạc địa chất và tài chính đầu tư.'
    },
    {
      id: 2,
      code: 'GĐ 2',
      title: 'Thành Lập & Thiết Kế Xây Dựng EPC',
      desc: 'Thiết kế kỹ thuật, lập hồ sơ môi trường, PCCC và thi công hạ tầng nhà máy.',
      microCopy: 'Gợi ý AI: Phù hợp cho nhà thầu EPC, kết cấu thép, hồ sơ thẩm duyệt và vật liệu xây dựng.'
    },
    {
      id: 3,
      code: 'GĐ 3',
      title: 'Lắp Đặt Máy Móc & Hoàn Thiện MEP',
      desc: 'Lắp đặt dây chuyền máy CNC, phòng sạch Cleanroom, khí nén và nghiệm thu an toàn.',
      microCopy: 'Gợi ý AI: Phù hợp cho thi công panel phòng sạch, trạm biến áp, máy nén khí và cẩu kéo máy nặng.'
    },
    {
      id: 4,
      code: 'GĐ 4',
      title: 'Vận Hành Sản Xuất & Chuỗi Đầu Vào',
      desc: 'Thu mua nguyên vật liệu thô, phụ tùng thay thế, quản lý sản xuất và QA/QC.',
      microCopy: 'Gợi ý AI: Phù hợp cho nhà máy chế biến nông sản, chè Cozy, cà phê G7, mít sấy Nam Huy, hạt nhựa, cơ khí...'
    },
    {
      id: 5,
      code: 'GĐ 5',
      title: 'Mở Rộng, Nhân Lực & Logistics',
      desc: 'Tuyển dụng công nhân KCN, kho lạnh cảng biển, bảo hộ lao động và xuất nhập khẩu.',
      microCopy: 'Gợi ý AI: Phù hợp cho nhà cung cấp kho bãi, xe container cảng biển và tuyển dụng nhân lực sản xuất.'
    },
    {
      id: 6,
      code: 'GĐ 6',
      title: 'Chuyển Đổi & Tối Ưu (Bao Bì, Quà Tặng, FMCG)',
      desc: 'Chuyển đổi số, tối ưu chuỗi bao bì, hộp quà tết tỷ lệ 9:16, túi canvas, vật tư FMCG cho siêu thị.',
      microCopy: 'Gợi ý AI: Phù hợp cho các doanh nghiệp cung ứng bao bì, hộp quà tết 9:16, giỏ màng co, vật tư FMCG, quà tặng doanh nghiệp cho các chuỗi siêu thị/ngân hàng...'
    }
  ];

  // Options Data for Step 3: Specific Sector / Industry
  const industryOptions = [
    {
      id: 'packaging_food',
      title: 'Bao Bì, Quà Tặng Doanh Nghiệp 9:16 & Nông Sản FMCG',
      desc: 'Hộp quà cứng ép kim dáng đứng 9:16, túi canvas, màng co nhiệt, Trà ô long Cozy, Cà phê G7, Mít sấy Nam Huy, Thập cẩm Nut Farm.',
      microCopy: 'Khớp 95% với Odoo TAHOMART & gói thầu 15.000 hộp quà HDBank/VietinBank đang mở thầu.',
      highlight: true
    },
    {
      id: 'mechanical',
      title: 'Cơ Khí Chế Tạo, Khuôn Mẫu & Đồ Gá JIG',
      desc: 'Khuôn dập liên hoàn CNC 5 trục, tiện phay chính xác cao, đồ gá kiểm tra QA/QC, cắt laser tấm.',
      microCopy: 'Khớp lệnh với các dự án Foxconn, Samsung và nhà máy phụ trợ cơ khí KCN Bắc Ninh, Bình Dương.'
    },
    {
      id: 'electronics',
      title: 'Điện – Điện Tử, Gia Công SMT & Bán Dẫn',
      desc: 'Gia công gắn chip SMT PCB, linh kiện thụ động SMD, cảm biến IoT, khay nhựa chống tĩnh điện ESD.',
      microCopy: 'Khớp lệnh với chuỗi cung ứng KCNC TP.HCM, VSIP Hải Phòng và Bắc Ninh.'
    },
    {
      id: 'plastics',
      title: 'Nhựa Kỹ Thuật, Ép Phun & Cao Su',
      desc: 'Linh kiện vỏ nhựa PP/ABS, gioăng cao su chịu nhiệt, hạt nhựa sinh học tái sinh ESG.',
      microCopy: 'Khớp lệnh với các nhà máy sản xuất đồ gia dụng, linh kiện ô tô và thiết bị điện.'
    },
    {
      id: 'mep',
      title: 'Xây Dựng Công Nghiệp, Panel Phòng Sạch & MEP',
      desc: 'Panel EPS/PU Cleanroom, hệ thống ống gió HVAC trung tâm, kết cấu thép, sàn Epoxy chịu lực.',
      microCopy: 'Khớp lệnh với các dự án mở rộng nhà xưởng giai đoạn 3 tại miền Bắc và miền Nam.'
    },
    {
      id: 'textile',
      title: 'Dệt May Kỹ Thuật, Da Giày & Đồng Phục',
      desc: 'Vải dệt kim kháng khuẩn, phụ liệu may mặc cúc khóa, may bảo hộ lao động và đồng phục KCN.',
      microCopy: 'Khớp lệnh với các KCN dệt may Nam Định, Long An và Bình Dương.'
    }
  ];

  // Options Data for Step 4: Readiness & Capacity
  const readinessOptions = [
    {
      id: 'iso_ready',
      title: 'Đã Đạt Chuẩn ISO 9001 / HACCP / FDA / RoHS',
      desc: 'Hệ thống quản lý chất lượng hoàn chỉnh, hồ sơ năng lực đầy đủ, sẵn sàng ký hợp đồng lớn.',
      badge: 'Đủ Điều Kiện Thầu FDI'
    },
    {
      id: 'export_ready',
      title: 'Đang Mở Rộng Năng Lực Cung Ứng Chuỗi Quốc Gia',
      desc: 'Có kinh nghiệm cung ứng cho các đơn hàng từ 500 triệu đến 5 tỷ VNĐ, muốn mở rộng vào siêu thị lớn.',
      badge: 'Quy Mô Đang Tăng Trưởng'
    },
    {
      id: 'sme_growth',
      title: 'Doanh Nghiệp / Xưởng Sản Xuất Vừa & Nhỏ (SME)',
      desc: 'Muốn nhận bảo trợ kết nối từ nền tảng CCU để tiếp cận trực tiếp các Giám đốc Mua hàng FDI.',
      badge: 'Cần Hỗ Trợ Đấu Thầu'
    },
    {
      id: 'fdi_capacity',
      title: 'Nhà Máy Công Suất Lớn (> 100.000 Sản Phẩm / Tháng)',
      desc: 'Dây chuyền tự động hóa cao, đáp ứng đơn hàng xuất khẩu khối lượng lớn giao nhanh 48h.',
      badge: 'Công Suất Khủng'
    }
  ];

  // Options Data for Step 5: Urgent Connection Goal
  const urgentOptions = [
    {
      id: 'bid_rfq',
      title: 'Nhận Đơn Đấu Thầu RFQ Trực Tiếp (TAHOMART, HDBank...)',
      desc: 'Nộp hồ sơ báo giá cho các gói thầu hộp quà 9:16, nông sản sấy thăng hoa, vật tư FMCG đang mở thầu.',
      highlight: true
    },
    {
      id: 'oem_odm',
      title: 'Tìm Xưởng Gia Công Vệ Tinh (OEM / ODM Chuyên Nghiệp)',
      desc: 'Hợp tác sản xuất gia công theo tiêu chuẩn kỹ thuật nghiêm ngặt để giải tỏa áp lực dây chuyền.',
      highlight: false
    },
    {
      id: 'lock_price',
      title: 'Khóa Hợp Đồng Nguyên Liệu Kỳ Hạn Cố Định Giá',
      desc: 'Chốt giá túi canvas, màng co, thép SKD11, hạt nhựa trước đợt điều chỉnh giá quý sau.',
      highlight: false
    },
    {
      id: 'kyc_l2',
      title: 'Nâng Cấp Định Danh KYC Lớp 2 & Xuất Báo Cáo Xếp Hạng',
      desc: 'Hoàn tất xác thực pháp nhân, kiểm tra định vị xưởng và nhận huy hiệu Đối Tác Xác Thực Quốc Gia.',
      highlight: false
    }
  ];

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setHoveredOptionInfo('');
    } else {
      // Step 5 completed -> Open Lead Capture Modal before showing results
      setIsLeadModalOpen(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setHoveredOptionInfo('');
    }
  };

  const handleResetQuiz = () => {
    localStorage.removeItem('ccu_diagnostic_step');
    localStorage.removeItem('ccu_diagnostic_answers');
    localStorage.removeItem('ccu_diagnostic_completed');
    setCurrentStep(1);
    setIsCompleted(false);
    setIsLeadModalOpen(false);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setLeadSubmitting(true);
    setTimeout(() => {
      setLeadSubmitting(false);
      setIsLeadModalOpen(false);
      setIsCompleted(true);
    }, 1000);
  };

  const matchedStage = stagesData.find(s => s.id === answers.stageId) || stagesData[5];

  return (
    <div className="space-y-8 pb-24 pt-6 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & GAMIFICATION PROGRESS BAR */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[#0052cc] font-bold font-heading">
            {lang === 'en' ? 'AI SCM Diagnostic & Positioning' : 'Công Cụ Chẩn Đoán & Định Vị Chuỗi Cung Ứng AI'}
          </span>
        </nav>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0047a5] text-[11px] font-bold font-heading">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'STEP-BY-STEP AI POSITIONING ENGINE' : 'CÔNG CỤ ĐỊNH VỊ VỊ THẾ & KHỚP LỆNH THẦU B2B'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading tracking-tight">
              Tôi Đang Ở Giai Đoạn Nào?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Chẩn đoán chuyên sâu vị thế doanh nghiệp để kết nối trực tiếp các gói thầu từ 400+ KCN, Odoo TAHOMART và HDBank.
            </p>
          </div>

          {isCompleted && (
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition self-start sm:self-center font-heading cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm Lại Bài Đánh Giá</span>
            </button>
          )}
        </div>

        {/* Gamified Giant AI Progress Bar (If not completed) */}
        {!isCompleted && (
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-slate-800 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                </span>
                <span className="font-bold text-sky-400 font-mono">
                  BƯỚC {currentStep} / 5
                </span>
                <span className="text-slate-400">|</span>
                <span className="font-medium text-slate-200 text-[11px] sm:text-xs">
                  {currentAiState.msg}
                </span>
              </div>
              <span className="font-mono font-black text-emerald-400 text-xs sm:text-sm self-end sm:self-auto">
                {currentAiState.pct}% HOÀN TẤT
              </span>
            </div>

            {/* Giant Horizontal Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-sky-500/50"
                style={{ width: `${currentAiState.pct}%` }}
              ></div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 2. STEP-BY-STEP SINGLE-FOCUS WIZARD (CÂU HỎI ĐỘC LẬP) */}
      {/* ========================================================================= */}
      {!isCompleted ? (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* =================================================================== */}
            {/* STEP 1: Vai Trò Cốt Lõi */}
            {/* =================================================================== */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#0052cc] uppercase">
                    CÂU HỎI 1: XÁC ĐỊNH VỊ THẾ CỐT LÕI
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    Vai trò cốt lõi của bạn trong chuỗi cung ứng là gì?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Hệ thống sẽ lọc đúng luồng dữ liệu thầu và đối tác tương thích nhất với vai trò của bạn.
                  </p>
                </div>

                {/* Option Cards */}
                <div className="space-y-3">
                  {roleOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setAnswers({ ...answers, role: opt.id });
                        setHoveredOptionInfo(opt.microCopy);
                      }}
                      onMouseEnter={() => setHoveredOptionInfo(opt.microCopy)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        answers.role === opt.id
                          ? 'bg-blue-50/80 border-[#0052cc] shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs border-slate-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          answers.role === opt.id ? 'bg-[#0052cc] text-white' : 'bg-slate-200/80 text-slate-700'
                        }`}>
                          <opt.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-sm sm:text-base text-slate-900 font-heading">
                              {opt.title}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-200/70 text-slate-700 hidden sm:inline">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center self-end sm:self-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                          answers.role === opt.id ? 'border-[#0052cc] bg-[#0052cc] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {answers.role === opt.id && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 2: Giai Đoạn Trọng Tâm */}
            {/* =================================================================== */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#0052cc] uppercase">
                    CÂU HỎI 2: VÒNG ĐỜI DỰ ÁN & SẢN XUẤT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    Giai đoạn sản xuất chính hoặc lĩnh vực bạn cung ứng giải pháp?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Rà soát 6 giai đoạn tiêu chuẩn chuỗi cung ứng sản xuất Việt Nam.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stageOptions.map((stg) => (
                    <div
                      key={stg.id}
                      onClick={() => {
                        setAnswers({ ...answers, stageId: stg.id });
                        setHoveredOptionInfo(stg.microCopy);
                      }}
                      onMouseEnter={() => setHoveredOptionInfo(stg.microCopy)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                        answers.stageId === stg.id
                          ? 'bg-blue-50/90 border-[#0052cc] shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs border-slate-200'
                      }`}
                      style={{ minHeight: '135px' }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono bg-blue-100 text-[#0052cc]">
                            {stg.code}
                          </span>
                          {answers.stageId === stg.id && (
                            <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-ping"></span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-heading leading-snug">
                          {stg.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {stg.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                        <span className={answers.stageId === stg.id ? 'text-[#0052cc] font-bold' : 'text-slate-400'}>
                          {answers.stageId === stg.id ? 'Đang chọn ✓' : 'Nhấp để chọn'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 3: Ngành Hàng & Sản Phẩm Mũi Nhọn */}
            {/* =================================================================== */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#0052cc] uppercase">
                    CÂU HỎI 3: DANH MỤC SẢN PHẨM & NGÀNH HÀNG
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    Ngành hàng hoặc dòng sản phẩm mũi nhọn của bạn là gì?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Đối soát với các danh mục hàng đang "khát" cung ứng tại các chuỗi bán lẻ & KCN.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {industryOptions.map((ind) => (
                    <div
                      key={ind.id}
                      onClick={() => {
                        setAnswers({ ...answers, industry: ind.id });
                        setHoveredOptionInfo(ind.microCopy);
                      }}
                      onMouseEnter={() => setHoveredOptionInfo(ind.microCopy)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-2 relative overflow-hidden ${
                        answers.industry === ind.id
                          ? 'bg-blue-50/90 border-[#0052cc] shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs border-slate-200'
                      }`}
                    >
                      {ind.highlight && (
                        <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-gradient-to-l from-rose-500 to-amber-500 text-white text-[9px] font-black font-mono uppercase rounded-bl-lg">
                          🔥 ĐANG KHÁT HÀNG THẦU
                        </div>
                      )}

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-heading pr-12">
                        {ind.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {ind.desc}
                      </p>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-emerald-700 font-semibold">
                          ✓ {ind.microCopy}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          answers.industry === ind.id ? 'border-[#0052cc] bg-[#0052cc] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {answers.industry === ind.id && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 4: Mức Độ Sẵn Sàng & Chứng Nhận */}
            {/* =================================================================== */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#0052cc] uppercase">
                    CÂU HỎI 4: NĂNG LỰC & CHỨNG NHẬN CHẤT LƯỢNG
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    Mức độ sẵn sàng về năng lực sản xuất & Chứng nhận tiêu chuẩn?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Đánh giá độ tin cậy để cấp điểm KYC Lớp 2 và xếp hạng thầu ưu tiên.
                  </p>
                </div>

                <div className="space-y-3">
                  {readinessOptions.map((rd) => (
                    <div
                      key={rd.id}
                      onClick={() => setAnswers({ ...answers, readiness: rd.id })}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        answers.readiness === rd.id
                          ? 'bg-blue-50/80 border-[#0052cc] shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-heading">
                            {rd.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-100 text-emerald-800">
                            {rd.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {rd.desc}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        answers.readiness === rd.id ? 'border-[#0052cc] bg-[#0052cc] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {answers.readiness === rd.id && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 5: Nhu Cầu Kết Nối Cấp Bách Nhất */}
            {/* =================================================================== */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#0052cc] uppercase">
                    CÂU HỎI 5: MỤC TIÊU KẾT NỐI HÀNH ĐỘNG
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    Nhu cầu kết nối cấp bách nhất hiện tại của bạn là gì?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    AI sẽ kích hoạt phễu khớp lệnh ngay khi bạn xác nhận hoàn tất bài đánh giá.
                  </p>
                </div>

                <div className="space-y-3">
                  {urgentOptions.map((urg) => (
                    <div
                      key={urg.id}
                      onClick={() => setAnswers({ ...answers, urgentNeed: urg.id })}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        answers.urgentNeed === urg.id
                          ? 'bg-blue-50/80 border-[#0052cc] shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-heading flex items-center gap-2">
                          {urg.title}
                          {urg.highlight && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-mono font-bold rounded">
                              Ưu Tiên 1-Click
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {urg.desc}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        answers.urgentNeed === urg.id ? 'border-[#0052cc] bg-[#0052cc] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {answers.urgentNeed === urg.id && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Micro-Copy Live Insight Banner */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 rounded-2xl border border-blue-200/80 flex items-center space-x-2 text-xs text-slate-800">
              <Sparkles className="w-4 h-4 text-[#0052cc] shrink-0" />
              <span>
                <strong>Gợi ý AI chuỗi cung ứng:</strong> {hoveredOptionInfo || 'Nhấp chọn đáp án phù hợp nhất để hệ thống tính toán ma trận tương thích thầu chính xác.'}
              </span>
            </div>

            {/* Navigation Action Buttons (No Skip Button) */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  onClick={handlePreviousStep}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition font-heading cursor-pointer"
                >
                  ← Quay Lại Câu Trước
                </button>
              ) : (
                <div></div>
              )}

              {/* Big Trust Blue CTA Button */}
              <button
                onClick={handleNextStep}
                className="px-8 py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-900/20 flex items-center space-x-2 transition font-heading cursor-pointer transform hover:-translate-y-0.5 tracking-wide"
              >
                <span>
                  {currentStep === 5 ? 'Phân Tích Chuyên Sâu Ngay ➔' : 'Tiếp Tục Câu Tiếp Theo ➔'}
                </span>
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 3. DYNAMIC TAILORED RESULT PAGE (BÁO CÁO ĐỘC BẢN MIX BIẾN SỐ) */
        /* ========================================================================= */
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
          
          {/* Main Hero Result Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#071936] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/50 space-y-6 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Top Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/60 pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex flex-col items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/20">
                  <span className="text-xl leading-none">95%</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider">KHỚP LỆNH</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider font-mono">
                    BÁO CÁO ĐỊNH VỊ CHUỖI CUNG ỨNG ĐỘC BẢN • CCU-AI-REPORT-{Math.floor(Math.random() * 89999 + 10000)}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
                    Giai Đoạn {answers.stageId}: {matchedStage.title}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Vai trò: <strong className="text-amber-300">{roleOptions.find(r => r.id === answers.role)?.title}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert('Đang xuất Báo cáo Định vị độc bản & Danh mục thầu Odoo (PDF)...')}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1.5 font-heading shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Báo Cáo PDF</span>
                </button>
              </div>
            </div>

            {/* Mixed Dynamic Blueprint Text Output (Exact match from prompt) */}
            <div className="relative z-10 p-5 rounded-2xl bg-blue-950/70 border border-blue-700/50 space-y-2.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>KẾT QUẢ ĐỐI SOÁT TỰ ĐỘNG VỚI ODOO TAHOMART & HDBANK:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans">
                Năng lực của bạn đang <strong className="text-emerald-300 font-bold">khớp 95% với 12 dự án thiết lập siêu thị nội bộ và sự kiện tri ân</strong>. Hệ thống Odoo của <strong>TAHOMART</strong> và <strong>HDBank</strong> hiện đang mở thầu cho các danh mục: 
                <strong className="text-amber-300"> Giỏ quà màng co, Trà ô long Cozy, Bánh ChocoPie, Thập cẩm sấy Nut Farm, Mít sấy Nam Huy, Hộp quà dọc tỷ lệ 9:16</strong>. Hoàn tất KYC Lớp 2 để nhận file thầu chi tiết.
              </p>
            </div>

            {/* 4 Score Indicators */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 block font-heading">DỰ ÁN KHỚP NĂNG LỰC</span>
                <strong className="text-lg font-black text-white font-mono block">12 Gói Thầu</strong>
                <span className="text-[10px] text-emerald-400">Đang mở thầu 48h</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 block font-heading">TỔNG NGÂN SÁCH THẦU</span>
                <strong className="text-lg font-black text-amber-300 font-mono block">4.250.000.000 đ</strong>
                <span className="text-[10px] text-slate-400">Đối soát e-Invoice</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 block font-heading">ĐIỂM TÍN NHIỆM KYC</span>
                <strong className="text-lg font-black text-sky-400 font-mono block">Lớp 2 (Hợp lệ)</strong>
                <span className="text-[10px] text-slate-400">Xác thực mã số thuế</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 block font-heading">KHU VỰC ƯU TIÊN GIAO</span>
                <strong className="text-lg font-black text-white font-mono block">Hà Nội & TP.HCM</strong>
                <span className="text-[10px] text-slate-400">Giao hàng trong 72h</span>
              </div>
            </div>

          </div>

          {/* 4 Hot RFQ Matches List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                  4 Gói Thầu RFQ Khớp Lệnh Nóng Bạn Có Thể Nộp Báo Giá Ngay
                </h3>
                <p className="text-xs text-slate-500">
                  Dữ liệu được đẩy tự động từ các chủ đầu tư chuỗi bán lẻ & Ngân hàng đối tác CCU.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full shrink-0">
                🔥 HẠN NỘP HỒ SƠ CÒN 48 GIỜ
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  buyer: 'Hệ Thống Siêu Thị TAHOMART',
                  title: 'Cung ứng 20.000 set Mít sấy Nam Huy & Thập cẩm sấy Nut Farm',
                  budget: '2.400.000.000 VNĐ',
                  specs: 'Hàng sấy thăng hoa tiêu chuẩn OCOP/HACCP, đóng gói túi màng nhôm & hũ PET 250g.',
                  location: 'Kho Trung Chuyển KCN Hưng Yên',
                  tag: 'Odoo TAHOMART'
                },
                {
                  buyer: 'Khối Ngân Hàng HDBank & VietinBank',
                  title: 'Đấu thầu 15.000 Hộp quà Tết dọc tỷ lệ 9:16 Ép kim logo thương hiệu',
                  budget: '1.850.000.000 VNĐ',
                  specs: 'Hộp cứng cao cấp 1200gsm, ép nhũ vàng logo, khay nhung định hình đựng trà & cà phê.',
                  location: 'KCN Quang Minh, Hà Nội',
                  tag: 'Ngân Hàng RFQ'
                },
                {
                  buyer: 'Tập Đoàn Phân Phối Chuỗi FMCG',
                  title: 'Thu mua 50 tấn Trà ô long Cozy & Cà phê G7 xuất khẩu',
                  budget: '4.200.000.000 VNĐ',
                  specs: 'Hàng nguyên seal date mới, có hóa đơn VAT và chứng chỉ xuất xứ CO/CQ đầy đủ.',
                  location: 'Cảng Cát Lái / Cái Mép',
                  tag: 'Xuất Khẩu'
                },
                {
                  buyer: 'Xưởng Đóng Gói Quà Doanh Nghiệp',
                  title: 'Cung cấp 30.000 Túi canvas thời trang & Giỏ màng co bọc quà nhiệt',
                  budget: '450.000.000 VNĐ',
                  specs: 'Vải canvas mộc định lượng 320gsm in lụa 2 màu, màng co PE dẻo dai chống rách.',
                  location: 'KCN Tân Bình, TP.HCM',
                  tag: 'Phụ Liệu Gói Quà'
                }
              ].map((rfq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 text-[#0052cc]">
                        {rfq.tag}
                      </span>
                      <strong className="text-xs text-slate-800 font-heading">{rfq.buyer}</strong>
                    </div>
                    <span className="text-sm font-black text-amber-600 font-mono">
                      {rfq.budget}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-heading">
                    {rfq.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Quy cách: {rfq.specs}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      📍 {rfq.location}
                    </span>
                    <button
                      onClick={() => navigate(`/nhu-cau?search=${encodeURIComponent(rfq.title)}`)}
                      className="px-4 py-2 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition font-heading shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Nộp Báo Giá 1-Click</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom 1:1 Consultation CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-sm sm:text-base font-heading">
                  Cần Chuyên Gia SCM Đồng Hành Hỗ Trợ Nộp Thầu Odoo?
                </h4>
                <p className="text-xs text-blue-200">
                  Đội ngũ điều phối Chuỗi Cung Ứng.vn sẽ rà soát hồ sơ năng lực và hỗ trợ kết nối trực tiếp với ban mua hàng.
                </p>
              </div>
              <button
                onClick={() => alert('Đã đăng ký tư vấn 1:1 với Chuyên gia SCM thành công! Chuyên viên sẽ liên hệ trong 15 phút.')}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap shadow-lg font-heading cursor-pointer shrink-0"
              >
                Đăng Ký Tư Vấn 1:1 Miễn Phí →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SILENT LEAD CAPTURE MODAL (Mở trước khi xuất báo cáo độc bản) */}
      {/* ========================================================================= */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            
            {/* Close button */}
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0052cc] flex items-center justify-center mx-auto shadow-sm">
                <Brain className="w-6 h-6" />
              </div>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800">
                AI MATCHING HOÀN TẤT (KHỚP 95%)
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900">
                Mở Khóa Báo Cáo Định Vị & Hồ Sơ 12 Gói Thầu
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhập thông tin doanh nghiệp để hệ thống xuất file phân tích độc bản và chuyển tiếp hồ sơ của bạn đến hệ thống Odoo của TAHOMART & HDBank.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 font-heading">
                  Họ và Tên Người Phụ Trách <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trần Đình Long"
                  value={leadForm.fullName}
                  onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-heading">
                  Tên Doanh Nghiệp / Nhà Máy <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công ty TNHH Sản Xuất & Thương Mại Nông Sản Việt"
                  value={leadForm.companyName}
                  onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-heading">
                    Số Điện Thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-heading">
                    Email Doanh Nghiệp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@doanhnghiep.vn"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cam kết bảo mật thông tin doanh nghiệp theo tiêu chuẩn ISO/IEC 27001.</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] hover:from-[#003d8f] hover:to-[#0052cc] text-white font-black rounded-xl shadow-lg transition flex items-center justify-center space-x-2 font-heading cursor-pointer text-xs sm:text-sm tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {leadSubmitting ? 'Đang Tạo Báo Cáo Độc Bản...' : 'Mở Khóa Báo Cáo & Xem Danh Sách Thầu Ngay'}
                  </span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
