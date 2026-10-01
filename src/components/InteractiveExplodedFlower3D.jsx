import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, HelpCircle, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function InteractiveExplodedFlower3D() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeStageId, setActiveStageId] = useState(1);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [showGuide, setShowGuide] = useState(true);
  const containerRef = useRef(null);
  const sceneRootRef = useRef(null);

  // Responsive Screen Listener (debounced/infrequent)
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isWide = windowWidth >= 1600;

  // Responsive scale multipliers for coordinates and cards
  const coordScale = isMobile ? 0.44 : (isTablet ? 0.72 : (isWide ? 1.15 : 1.0));
  const cardScale = isMobile ? 0.76 : (isTablet ? 0.88 : (isWide ? 1.04 : 1.0));

  // 6 Petal Stages with Wider Exploded Coordinates for generous breathing room
  const petalStages = [
    {
      id: 1,
      num: '01',
      title: lang === 'en' ? 'PREPARATION & INVESTMENT' : 'CHUẨN BỊ & ĐẦU TƯ',
      color: '#8b5cf6',
      exploded: { x: 0, y: -290, z: 60, rotX: 14, rotY: 0, rotZ: 0 },
      phases: lang === 'en' 
        ? ['Market Research & Site Selection', 'Legal Procedures & Investment Licensing', 'Master Planning & Feasibility Study']
        : ['Nghiên cứu thị trường & Lựa chọn địa điểm', 'Thủ tục pháp lý & Cấp phép đầu tư', 'Quy hoạch sơ bộ & Đánh giá khả thi'],
      metric: lang === 'en' ? '320+ Advisory Profiles' : '320+ Hồ sơ tư vấn',
    },
    {
      id: 2,
      num: '02',
      title: lang === 'en' ? 'DESIGN & CONSTRUCTION' : 'THIẾT KẾ & XÂY DỰNG',
      color: '#10b981',
      exploded: { x: 440, y: -150, z: 45, rotX: 10, rotY: -16, rotZ: 8 },
      phases: lang === 'en' 
        ? ['Architectural, Structural & MEP Design', 'Civil Construction & Industrial Workshops', 'Cleanrooms & Industrial Utilities']
        : ['Thiết kế kiến trúc, kết cấu & Cơ điện MEP', 'Thi công xây dựng hạ tầng thô & Nhà xưởng', 'Hoàn thiện hệ thống phòng sạch & Tiện ích'],
      metric: lang === 'en' ? '180+ Contractors' : '180+ Nhà thầu thi công',
    },
    {
      id: 3,
      num: '03',
      title: lang === 'en' ? 'INSTALLATION & COMPLETION' : 'LẮP ĐẶT & HOÀN THIỆN',
      color: '#f97316',
      exploded: { x: 440, y: 150, z: 50, rotX: -10, rotY: -16, rotZ: -8 },
      phases: lang === 'en' 
        ? ['Machinery Import & Transportation', 'Specialized Equipment & Fire Safety Setup', 'Unit & Coupled Commissioning & Acceptance']
        : ['Nhập khẩu & Vận chuyển dây chuyền máy móc', 'Lắp đặt thiết bị chuyên dụng & Hệ thống PCCC', 'Chạy thử đơn động, liên động & Nghiệm thu'],
      metric: lang === 'en' ? '250+ Equipment Vendors' : '250+ Nhà cung cấp thiết bị',
    },
    {
      id: 4,
      num: '04',
      title: lang === 'en' ? 'PRODUCTION & OPERATION' : 'VẬN HÀNH SẢN XUẤT',
      color: '#0284c7',
      exploded: { x: 0, y: 290, z: 65, rotX: -16, rotY: 0, rotZ: 0 },
      phases: lang === 'en' 
        ? ['Raw Materials & Consumables Supply', 'Equipment Maintenance & Energy Optimization', 'Quality Control (QC) & Operational Management']
        : ['Cung ứng nguyên phụ liệu & Vật tư tiêu hao', 'Bảo trì, bảo dưỡng thiết bị & Tiết kiệm năng lượng', 'Kiểm soát chất lượng QC & Quản lý vận hành'],
      metric: lang === 'en' ? '520+ Auxiliary Suppliers' : '520+ Nhà cung ứng phụ trợ',
    },
    {
      id: 5,
      num: '05',
      title: lang === 'en' ? 'LOGISTICS & WORKFORCE' : 'NHÂN SỰ & HẬU CẦN',
      color: '#eab308',
      exploded: { x: -440, y: 150, z: 50, rotX: -10, rotY: 16, rotZ: 8 },
      phases: lang === 'en' 
        ? ['High-Skill Workforce Recruitment & Training', 'Warehousing, Forklift & Industrial Logistics', 'Industrial Catering & Industrial Park Security']
        : ['Tuyển dụng & Đào tạo nhân sự kỹ thuật cao', 'Dịch vụ logistics kho bãi, xe nâng & Pallet', 'Cung ứng suất ăn công nghiệp & An ninh KCN'],
      metric: lang === 'en' ? '190+ Logistics & Services' : '190+ Đơn vị Logistics & Dịch vụ',
    },
    {
      id: 6,
      num: '06',
      title: lang === 'en' ? 'EXPANSION & OPTIMIZATION' : 'MỞ RỘNG – TỐI ƯU',
      color: '#ef4444',
      exploded: { x: -440, y: -150, z: 45, rotX: 10, rotY: 16, rotZ: -8 },
      phases: lang === 'en' 
        ? ['Digital Transformation, IoT & Automation', 'Green ESG Certification & ISO Export Standards', 'Workshop Scale-up & Supply Chain Optimization']
        : ['Chuyển đổi số, IoT & Tự động hóa nhà máy', 'Chứng nhận xanh ESG & Tiêu chuẩn xuất khẩu ISO', 'Mở rộng quy mô phân xưởng & Tối ưu hóa chuỗi'],
      metric: lang === 'en' ? '140+ Industry Experts' : '140+ Chuyên gia tư vấn',
    }
  ];

  // Zero-render direct DOM CSS variable update on scroll for 120fps buttery smooth performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sceneRootRef.current && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const visibleCenter = rect.top + rect.height * 0.45;
            const distFromCenter = Math.abs(visibleCenter - windowHeight * 0.5);
            const maxDist = windowHeight * 0.75;
            // When centered: 1.0 (fully exploded wide), when far away: 0.35 (retracted)
            const fraction = Math.max(0.35, Math.min(1.0, 1 - (distFromCenter / maxDist)));
            sceneRootRef.current.style.setProperty('--bloom', fraction.toFixed(3));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Zero-render direct DOM mouse tilt for buttery 60/120fps performance
  const handleMouseMove = (e) => {
    if (!sceneRootRef.current || !containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 10;
    sceneRootRef.current.style.transform = `rotateX(${y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`;
  };

  const handleMouseLeave = () => {
    if (sceneRootRef.current) {
      sceneRootRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  const currentStage = petalStages.find(s => s.id === activeStageId) || petalStages[0];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-2 select-none overflow-visible space-y-4 sm:space-y-6"
    >
      
      {/* 3D PERSPECTIVE GIANT ARENA */}
      <div 
        className="relative w-full min-h-[560px] sm:min-h-[720px] lg:min-h-[820px] xl:min-h-[880px] flex items-center justify-center py-2 sm:py-4"
        style={{ perspective: isMobile ? '1200px' : '1800px' }}
      >
        
        {/* 3D Scene Root */}
        <div 
          ref={sceneRootRef}
          className="relative w-full max-w-[1100px] 2xl:max-w-[1360px] 3xl:max-w-[1500px] h-[540px] sm:h-[660px] lg:h-[720px] flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg) rotateY(0deg)',
            '--bloom': '1'
          }}
        >

          {/* 1. CENTRAL LOGO HUB */}
          <div 
            className="absolute z-10 flex flex-col items-center justify-center p-2 text-center transition-transform duration-300 cursor-pointer hover:scale-105"
            style={{
              transform: 'translateZ(20px)'
            }}
            onClick={() => navigate('/ban-do-6-giai-doan')}
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 xl:w-48 xl:h-48 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-blue-400/10 blur-xl"></div>
              <img 
                src="/logo_only.png" 
                alt="Logo Chuỗi Cung Ứng" 
                className="w-full h-full object-contain filter drop-shadow-md animate-spin-slow"
              />
            </div>
          </div>

          {/* 2. 6 GIANT FLOATING PETAL CARDS IN STABLE 3D SPACE */}
          {petalStages.map((stg) => {
            const isSelected = activeStageId === stg.id;

            const targetX = (stg.exploded.x * coordScale).toFixed(1);
            const targetY = (stg.exploded.y * coordScale).toFixed(1);
            const targetZ = stg.exploded.z;
            const rotX = stg.exploded.rotX;
            const rotY = stg.exploded.rotY;
            const rotZ = stg.exploded.rotZ;
            const baseScale = cardScale;

            return (
              <div
                key={stg.id}
                onMouseEnter={() => setActiveStageId(stg.id)}
                onClick={() => navigate(`/giai-doan/${stg.id}`)}
                className={`absolute cursor-pointer group transition-all duration-400 ease-out ${
                  isSelected ? 'z-30' : 'z-20'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(calc(${targetX}px * var(--bloom, 1)), calc(${targetY}px * var(--bloom, 1)), calc((${targetZ}px * var(--bloom, 1)) + ${isSelected ? (isMobile ? 25 : 45) : 0}px)) rotateX(calc(${rotX}deg * var(--bloom, 1))) rotateY(calc(${rotY}deg * var(--bloom, 1))) rotateZ(calc(${rotZ}deg * var(--bloom, 1))) scale(calc(${baseScale} * (0.85 + 0.15 * var(--bloom, 1)) * ${isSelected ? 1.07 : 1.0}))`
                }}
              >
                {/* Petal Card */}
                <div 
                  className={`w-[230px] sm:w-64 md:w-72 p-3 sm:p-4 md:p-5 rounded-3xl bg-white border-2 shadow-lg transition-all duration-300 ease-out ${
                    isSelected 
                      ? 'shadow-2xl ring-4 ring-offset-2' 
                      : 'border-slate-200/90 hover:border-slate-300 shadow-slate-200/80 hover:shadow-xl'
                  }`}
                  style={{
                    borderColor: isSelected ? stg.color : undefined,
                    boxShadow: isSelected ? `0 20px 48px -10px ${stg.color}45, 0 0 0 2px ${stg.color}30` : undefined
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <span 
                        style={{ backgroundColor: stg.color }}
                        className="w-7 h-7 rounded-xl text-white font-mono font-black text-xs flex items-center justify-center shadow-xs"
                      >
                        {stg.num}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 font-heading uppercase tracking-wide">
                        {lang === 'en' ? 'Stage' : 'Giai đoạn'} {stg.num}
                      </h4>
                    </div>
                    <span 
                      style={{ backgroundColor: stg.color }}
                      className="w-2.5 h-2.5 rounded-full ring-2 ring-slate-100"
                    ></span>
                  </div>

                  {/* Stage Title */}
                  <div className="py-2.5">
                    <div className="text-sm font-extrabold text-[#072348] font-heading uppercase leading-snug group-hover:text-blue-700 transition">
                      {stg.title}
                    </div>
                  </div>

                  {/* 3 Phases Detailed List */}
                  <div className="space-y-1.5 pt-1">
                    {stg.phases.map((ph, idx) => (
                      <div key={idx} className="flex items-start text-xs text-slate-600 font-medium leading-tight">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0 mt-0.5" />
                        <span>{ph}</span>
                      </div>
                    ))}
                    
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>{stg.metric}</span>
                      <span 
                        style={{ color: stg.color }}
                        className="font-heading uppercase font-bold flex items-center group-hover:translate-x-1 transition"
                      >
                        {lang === 'en' ? 'Details →' : 'Chi tiết →'}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Floating Bottom Action Dock for Selected Stage */}
      <div 
        className="max-w-4xl mx-auto mt-4 p-4 sm:p-5 rounded-3xl bg-white border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20"
        style={{ 
          borderColor: `${currentStage.color}50`, 
          boxShadow: `0 12px 30px -10px ${currentStage.color}25` 
        }}
      >
        <div className="flex items-center space-x-3.5 text-left">
          <span 
            style={{ backgroundColor: currentStage.color }}
            className="w-12 h-12 rounded-2xl text-white font-black flex items-center justify-center font-mono text-lg shadow-sm"
          >
            {currentStage.num}
          </span>
          <div>
            <div className="text-xs font-bold text-slate-400 font-heading uppercase tracking-wide">
              {lang === 'en' ? `Viewing Stage ${currentStage.num}` : `Đang xem Giai đoạn ${currentStage.num}`}
            </div>
            <div 
              style={{ color: currentStage.color }}
              className="text-sm sm:text-base font-black font-heading uppercase"
            >
              {currentStage.title}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/giai-doan/${currentStage.id}`);
          }}
          style={{ backgroundColor: currentStage.color }}
          className="px-6 py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all duration-200 hover:brightness-110 hover:scale-[1.02] font-heading uppercase tracking-wide cursor-pointer whitespace-nowrap"
        >
          <span>{lang === 'en' ? `Explore 3 Phases & Suppliers in Stage ${currentStage.num}` : `Khám phá 3 Pha & Doanh nghiệp Giai đoạn ${currentStage.num}`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3D FLOATING GUIDE POPUP AT BOTTOM OF HERO SECTION */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 pt-2 relative z-20">
        {showGuide ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-500 font-heading">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>{lang === 'en' ? 'HOW TO USE THIS MAP' : 'HƯỚNG DẪN SỬ DỤNG BẢN ĐỒ'}</span>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2.5 py-1 rounded-full transition flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Hide guide' : 'Ẩn hướng dẫn'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-3 group cursor-pointer" onClick={() => setActiveStageId(1)}>
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center flex-shrink-0 font-mono shadow-xs group-hover:scale-110 transition">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] uppercase font-heading">
                    {lang === 'en' ? 'SELECT A STAGE' : 'CHỌN GIAI ĐOẠN'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                    {lang === 'en' ? 'Click on any petal corresponding to your current project or factory cycle.' : 'Nhấn vào giai đoạn tương ứng với chu kỳ hiện tại của dự án hoặc doanh nghiệp bạn.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3 group cursor-pointer" onClick={() => setActiveStageId(2)}>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center flex-shrink-0 font-mono shadow-xs group-hover:scale-110 transition">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] uppercase font-heading">
                    {lang === 'en' ? 'EXPLORE 3 PHASES' : 'XEM CHI TIẾT PHA'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                    {lang === 'en' ? 'Review 3 technical phases with inputs, outputs, and mandatory deliverables.' : 'Xem rõ 3 pha kỹ thuật cùng đầu vào, đầu ra và sản phẩm bàn giao bắt buộc.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3 group cursor-pointer" onClick={() => setActiveStageId(3)}>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center flex-shrink-0 font-mono shadow-xs group-hover:scale-110 transition">
                  3
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] uppercase font-heading">
                    {lang === 'en' ? 'CONNECT PARTNERS' : 'KẾT NỐI ĐÚNG ĐỐI TÁC'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                    {lang === 'en' ? 'Directly source verified suppliers, factories, and trade associations.' : 'Tìm kiếm nhà cung ứng, nhà máy hoặc hiệp hội có năng lực chính xác theo pha đó.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 text-xs font-bold shadow-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-300 hover:scale-105 cursor-pointer font-heading uppercase tracking-wider"
            >
              <HelpCircle className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>{lang === 'en' ? 'How to use this map (3 steps)' : 'Hướng dẫn sử dụng bản đồ (3 bước)'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
