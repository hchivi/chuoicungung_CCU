import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, CheckCircle2, Sparkles, Building2, Factory, 
  MapPin, Users, Handshake, Crown, Award, FileText, Gift, 
  ChevronRight, Calendar, Layers, Clock, ShieldCheck, 
  MessageSquare, Bot, Cpu, Zap, Compass, HelpCircle, Send, Check,
  GitMerge, FileCheck
} from 'lucide-react';
import NetworkBackground from '../components/NetworkBackground';
import InteractiveExplodedFlower3D from '../components/InteractiveExplodedFlower3D';
import DualMascotInteractive from '../components/DualMascotInteractive';
import ClickUpBrainSearchBar from '../components/ClickUpBrainSearchBar';
import EcosystemDataDirectory from '../components/home/EcosystemDataDirectory';
import UnifiedRoleSection from '../components/home/UnifiedRoleSection';
import ActiveDemandsSection from '../components/home/ActiveDemandsSection';
import VerifiedSuppliersSection from '../components/home/VerifiedSuppliersSection';
import SuppiChainyConciseSection from '../components/home/SuppiChainyConciseSection';
import SupplyChainExpoPaper3D from '../components/home/SupplyChainExpoPaper3D';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { slugify } from './IndustryCategoryPage';

export default function HomePage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Search Submit -> Route to matching directory or query
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/tro-ly-ai?q=${encodeURIComponent(q)}` : '/tro-ly-ai');
  };

  const handleTagClick = (label, category) => {
    if (category === 'industrial_parks') {
      navigate(`/khu-cong-nghiep?q=${encodeURIComponent(label)}`);
    } else {
      navigate(`/tu-khoa/${slugify(label)}?q=${encodeURIComponent(label)}`);
    }
  };

  // Marquee Sourcing Keywords (Image 1 Exact Layout)
  const marqueeKeywordsRow1 = [
    { label: "tư vấn pháp lý & giấy phép KCN", category: "enterprises" },
    { label: "thiết kế quy hoạch 1/500 & BIM", category: "enterprises" },
    { label: "xây dựng nhà xưởng & thép tiền chế", category: "enterprises" },
    { label: "sàn bê tông mài tăng cứng", category: "enterprises" },
    { label: "trạm biến áp 22kV & tủ điện", category: "enterprises" },
    { label: "phòng cháy chữa cháy PCCC", category: "enterprises" },
    { label: "cơ điện lạnh MEP & HVAC", category: "enterprises" },
    { label: "khu công nghiệp trọng điểm", category: "industrial_parks" },
  ];

  const marqueeKeywordsRow2 = [
    { label: "gia công cơ khí chính xác CNC", category: "enterprises" },
    { label: "thép cuộn mạ kẽm & nhôm định hình", category: "enterprises" },
    { label: "bu lông ốc vít & khuôn mẫu Jig", category: "enterprises" },
    { label: "quản lý sản xuất MES & ERP", category: "enterprises" },
    { label: "vận tải container lạnh & logistics", category: "enterprises" },
    { label: "cho thuê kho bãi KCN", category: "industrial_parks" },
    { label: "khu công nghiệp Miền Nam", category: "industrial_parks" },
    { label: "cẩu trục 10T & lắp đặt máy móc", category: "enterprises" },
  ];

  const marqueeKeywordsRow3 = [
    { label: "suất ăn công nghiệp HACCP", category: "enterprises" },
    { label: "quà tặng doanh nghiệp & bao bì carton", category: "enterprises" },
    { label: "áo thun đồng phục & bảo hộ PPE", category: "enterprises" },
    { label: "mở rộng nhà máy & nâng cấp xưởng", category: "enterprises" },
    { label: "tư vấn chứng nhận ISO & chuẩn ESG", category: "enterprises" },
    { label: "tự động hóa & robot tự hành AGV", category: "enterprises" },
    { label: "điện mặt trời áp mái 1MWp", category: "enterprises" },
  ];

  // Structured Requirements for Block 06 (No private personal buyer contacts shown)
  const openRequirements = [
    {
      code: "NC-2026-00125",
      title: "Đồng phục công nhân & Áo polo kỹ thuật",
      category: "May mặc & Bảo hộ",
      quantity: "500 bộ",
      location: "Đồng Nai (KCN Amata / Long Thành)",
      condition: "Cần xem mẫu trước",
      deadline: "05/10/2026",
      status: "Đang tìm nguồn",
      stage: "Giai đoạn 5",
      badgeCol: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      code: "NC-2026-00124",
      title: "Thùng carton 5 lớp sóng BC in Flexo",
      category: "Bao bì & Đóng gói",
      quantity: "10.000 thùng/tháng",
      location: "Bình Dương (KCN VSIP 1)",
      condition: "Giao hàng định kỳ 2 tuần/lần",
      deadline: "12/10/2026",
      status: "Đang tìm nguồn",
      stage: "Giai đoạn 4",
      badgeCol: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
      code: "NC-2026-00123",
      title: "Gia công chi tiết máy CNC & Jig hàn",
      category: "Cơ khí chính xác",
      quantity: "200 bộ cụm chi tiết",
      location: "Bắc Ninh (KCN Quế Võ)",
      condition: "Dung sai ±0.01mm, test CMM",
      deadline: "18/10/2026",
      status: "Đang tìm nguồn",
      stage: "Giai đoạn 4",
      badgeCol: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
    {
      code: "NC-2026-00122",
      title: "Suất ăn công nghiệp ca ngày & ca đêm",
      category: "Hậu cần & Đời sống",
      quantity: "1.200 suất/ngày",
      location: "Đồng Nai (KCN Long Đức)",
      condition: "Chuẩn HACCP / Bảo hiểm ngộ độc",
      deadline: "25/10/2026",
      status: "Đang tìm nguồn",
      stage: "Giai đoạn 5",
      badgeCol: "bg-purple-50 text-purple-800 border-purple-200"
    }
  ];

  // Featured Capability-verified Suppliers for Block 07
  const featuredSuppliers = [
    {
      id: "ncc-01",
      name: "Công ty May Mặc Tân Bình Minh",
      capabilities: ["Đồng phục công nhân", "Áo thun polo", "PPE bảo hộ lao động"],
      serviceArea: "TP.HCM · Đồng Nai · Bình Dương",
      orderRange: "300 – 5.000 sản phẩm",
      sample: "Có thể làm mẫu",
      updatedAt: "22/09/2026",
      verifiedChips: ["Hồ sơ DN", "Ảnh xưởng thật", "Mẫu sẵn sàng"],
      logo: "/images/icons/zalo-icon.png"
    },
    {
      id: "ncc-02",
      name: "Bao Bì Công Nghiệp Toàn Thắng",
      capabilities: ["Thùng carton 3-5-7 lớp", "Pallet gỗ & Pallet nhựa", "Màng PE quấn hàng"],
      serviceArea: "Bình Dương · Đồng Nai · Long An",
      orderRange: "1.000 – 50.000 thùng",
      sample: "Có xưởng sản xuất",
      updatedAt: "20/09/2026",
      verifiedChips: ["ISO 9001", "Dây chuyền Flexo", "Giao xe tải"],
      logo: "/logo_only.png"
    },
    {
      id: "ncc-03",
      name: "Cơ Khí Chính Xác & Khuôn Mẫu An Phát",
      capabilities: ["Gia công phay tiện CNC", "Đồ gá Jig hàn", "Dập chi tiết kim loại"],
      serviceArea: "Bắc Ninh · Hà Nội · Hải Phòng",
      orderRange: "50 – 2.000 chi tiết",
      sample: "Kiểm tra đo CMM",
      updatedAt: "19/09/2026",
      verifiedChips: ["Máy CNC 5 trục", "Hồ sơ đối chiếu", "Bảo mật NDA"],
      logo: "/logo_only.png"
    }
  ];

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-[#0052cc] selection:text-white">
      
      {/* =========================================================================
          BLOCK 01 — HERO SEARCH (TASTE SKILL & HALLMARK REFINED)
         ========================================================================= */}
      <section className="relative overflow-hidden min-h-[calc(100vh-68px)] lg:min-h-[88vh] flex flex-col justify-center items-center py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-[#F0F6FF] via-[#F8FAFC] to-[#F8FAFC] border-b border-slate-200/80">
        
        {/* Interactive Neural Canvas Background (GIỮ NGUYÊN) */}
        <NetworkBackground />

        {/* Precision Optical Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,255,255,0.75),transparent_80%)] pointer-events-none" />

        {/* Center Container: Title & Search Bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full flex flex-col items-center space-y-4 sm:space-y-5">
          
          {/* Main H1 Title (Cập nhật chuẩn theo yêu cầu) */}
          <div className="space-y-2.5 sm:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-black uppercase font-heading text-center leading-[1.22] sm:leading-[1.18] tracking-tight">
              <span className="text-[#072348] block lg:inline">NỀN TẢNG KẾT NỐI VÀ TÌM NGUỒN </span>
              <span className="text-rainbow-gradient block sm:inline">CHUỖI CUNG ỨNG CÔNG NGHIỆP</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Tra cứu nhà máy, khu công nghiệp và kết nối đúng nhà cung ứng có năng lực thực tế tại Việt Nam.
            </p>
          </div>

          {/* ClickUp Brain Search Bar (GIỮ NGUYÊN KHUNG CHAT 100%) */}
          <div className="w-full max-w-4xl mx-auto relative z-20 pt-1">
            <ClickUpBrainSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearchSubmit={handleSearchSubmit}
            />
          </div>

        </div>

        {/* Sourcing Marquee Tags (FULL SCREEN WIDTH, CHUẨN MASK MỜ TỰ NHIÊN, KHÔNG LỖI Ô MÀU) */}
        <div
          className="w-full relative z-10 overflow-hidden space-y-2.5 mt-6 shrink-0"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          }}
        >
          {/* Track 1: Scrolling Left */}
          <div className="flex overflow-hidden py-0.5">
            <div className="animate-marquee-left flex items-center space-x-2.5">
              {[...marqueeKeywordsRow1, ...marqueeKeywordsRow1, ...marqueeKeywordsRow1].map((kw, i) => (
                <button
                  key={`row1-${i}`}
                  type="button"
                  onClick={() => handleTagClick(kw.label, kw.category)}
                  className="px-3.5 py-1.5 bg-white/95 hover:bg-[#0052cc] border border-slate-200/90 hover:border-[#0052cc] text-slate-700 hover:text-white rounded-full text-xs font-medium transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  {kw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Track 2: Scrolling Right */}
          <div className="flex overflow-hidden py-0.5">
            <div className="animate-marquee-right flex items-center space-x-2.5">
              {[...marqueeKeywordsRow2, ...marqueeKeywordsRow2, ...marqueeKeywordsRow2].map((kw, i) => (
                <button
                  key={`row2-${i}`}
                  type="button"
                  onClick={() => handleTagClick(kw.label, kw.category)}
                  className="px-3.5 py-1.5 bg-white/95 hover:bg-[#0052cc] border border-slate-200/90 hover:border-[#0052cc] text-slate-700 hover:text-white rounded-full text-xs font-medium transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  {kw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Track 3: Scrolling Left Slow */}
          <div className="flex overflow-hidden py-0.5">
            <div className="animate-marquee-left-slow flex items-center space-x-2.5">
              {[...marqueeKeywordsRow3, ...marqueeKeywordsRow3, ...marqueeKeywordsRow3].map((kw, i) => (
                <button
                  key={`row3-${i}`}
                  type="button"
                  onClick={() => handleTagClick(kw.label, kw.category)}
                  className="px-3.5 py-1.5 bg-white/95 hover:bg-[#0052cc] border border-slate-200/90 hover:border-[#0052cc] text-slate-700 hover:text-white rounded-full text-xs font-medium transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  {kw.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </section>


      {/* =========================================================================
          01. TÌM NGUỒN — VAI TRÒ THAM GIA, NHÀ CUNG ỨNG & TRỢ LÝ SUPPI/CHAINY
         ========================================================================= */}
      <div id="tim-nguon" className="scroll-mt-24 space-y-14 sm:space-y-20">
        <UnifiedRoleSection />
        <VerifiedSuppliersSection />
        <SuppiChainyConciseSection />
      </div>

      {/* =========================================================================
          02. NHU CẦU [HOT] — BẢNG TIN NHU CẦU MUA SẮM ĐANG TÌM NGUỒN
         ========================================================================= */}
      <div id="nhu-cau" className="scroll-mt-24">
        <ActiveDemandsSection />
      </div>

      {/* =========================================================================
          03. 6 GIAI ĐOẠN — BẢN ĐỒ 6 GIAI ĐOẠN & 18 PHA VÒNG ĐỜI DỰ ÁN
         ========================================================================= */}
      <section id="6-giai-doan" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4 pb-2">
        <div className="text-center max-w-5xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[36px] font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight">
            Nhu cầu nhà máy phát sinh trong suốt vòng đời đầu tư và vận hành
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
            Từ chuẩn bị đầu tư (FS), thiết kế thi công, lắp đặt máy móc đến vận hành sản xuất và nâng cấp mở rộng. Mỗi giai đoạn đều có nhóm nhà cung ứng phụ trợ tương ứng.
          </p>
        </div>

        {/* 3D Exploded Flower View */}
        <InteractiveExplodedFlower3D />
      </section>

      {/* =========================================================================
          04. CHƯƠNG TRÌNH — NGÀY HỘI CHUỖI CUNG ỨNG — 3D PAPER PASS INTERACTION
         ========================================================================= */}
      <div id="chuong-trinh" className="scroll-mt-24">
        <SupplyChainExpoPaper3D />
      </div>

      {/* =========================================================================
          05. HỆ SINH THÁI — TRA CỨU HỆ SINH THÁI 8 NHÓM DỮ LIỆU THỰC TẾ
         ========================================================================= */}
      <div id="he-sinh-thai" className="scroll-mt-24">
        <EcosystemDataDirectory />
      </div>

      {/* =========================================================================
          06. DỊCH VỤ — DỊCH VỤ HỖ TRỢ KẾT NỐI (DESIGN-TASTE PHOTOGRAPHIC CARDS)
         ========================================================================= */}
      <section id="dich-vu" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-5xl mx-auto space-y-2">

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
            DỊCH VỤ HỖ TRỢ KẾT NỐI
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
            Các giải pháp chuyên sâu giúp doanh nghiệp chuẩn bị hồ sơ kỹ thuật, thẩm định năng lực và tổ chức giao thương thực chất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              image: "/images/services/service_vn_sourcing.jpg",
              imageAlt: "Bóc tách bản vẽ kỹ thuật và thẩm định năng lực nhà máy",
              tag: "SLA 24H · THẨM ĐỊNH",
              accentColor: "text-sky-300",
              title: "Tìm nguồn cung & Bóc tách",
              desc: "Tiếp nhận đề bài thu mua, giải mã bản vẽ tiêu chuẩn và chọn lọc 3-5 xưởng sản xuất có năng lực máy móc tương thích.",
              deliverables: [
                "Bóc tách bản vẽ kỹ thuật & định mức BOM",
                "Thẩm định chứng chỉ ISO/IATF & máy móc",
                "Tổng hợp 3-5 báo giá cạnh tranh trực tiếp"
              ],
              action: "Đăng ký tìm nguồn",
              link: "/dang-nhu-cau"
            },
            {
              image: "/images/services/service_vn_matchmaking.jpg",
              imageAlt: "Tổ chức gặp gỡ B2B Matchmaking 1:1 tại nhà máy",
              tag: "MATCHMAKING 1:1 · TẠI XƯỞNG",
              accentColor: "text-emerald-300",
              title: "Tổ chức kết nối B2B",
              desc: "Thiết kế và điều phối các phiên gặp gỡ B2B 1:1 chuyên sâu trực tiếp tại nhà xưởng, văn phòng hoặc KCN mục tiêu.",
              deliverables: [
                "Khảo sát nhu cầu mua sắm thực từ Buyer FDI",
                "Lên lịch làm việc & chuẩn bị tài liệu kỹ thuật",
                "Ký kết biên bản ghi nhớ (MOU) & theo dõi đơn"
              ],
              action: "Xem quy trình kết nối",
              link: "/dich-vu/to-chuc-ket-noi"
            },
            {
              image: "/images/services/service_vn_media_profile.jpg",
              imageAlt: "Quay phim chụp ảnh dây chuyền xưởng và E-Catalogue",
              tag: "CHUẨN HÓA SỐ · VIDEO PROFILE",
              accentColor: "text-purple-300",
              title: "Hồ sơ & Truyền thông DN",
              desc: "Chuẩn hóa profile sản xuất song ngữ, sản xuất video thực chứng dây chuyền máy móc và số hóa E-Catalogue chuyên nghiệp.",
              deliverables: [
                "Biên soạn E-Catalogue chuẩn kỹ thuật công nghiệp",
                "Ghi hình dây chuyền, máy CNC & quy trình QC",
                "Cấp huy hiệu năng lực xác thực trên hệ thống"
              ],
              action: "Đăng ký làm hồ sơ",
              link: "/dich-vu/truyen-thong-doanh-nghiep"
            },
            {
              image: "/images/services/service_vn_corporate_gifts.jpg",
              imageAlt: "Đồng phục bảo hộ và quà tặng sự kiện B2B",
              tag: "TRỌN GÓI B2B · NHẬN DIỆN KCN",
              accentColor: "text-rose-300",
              title: "Vật phẩm doanh nghiệp & Sự kiện",
              desc: "Cung ứng đồng phục bảo hộ lao động, quà tặng đối tác B2B cao cấp và toàn bộ ấn phẩm nhận diện tại sự kiện xúc tiến.",
              deliverables: [
                "Đồng phục công nhân, kỹ sư & áo thun sự kiện",
                "Quà tặng đối tác ngoại giao & kỷ niệm chương",
                "Bộ ấn phẩm gian hàng & tài liệu giới thiệu KCN"
              ],
              action: "Khám phá gói vật phẩm",
              link: "/dich-vu/vat-pham-su-kien"
            }
          ].map((srv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs hover:shadow-xl hover:border-[#0052cc] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Visual Photo Header */}
                <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                  <img
                    src={srv.image}
                    alt={srv.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-col text-white">
                    <span className="text-lg sm:text-xl font-black font-heading tracking-tight leading-snug">
                      {srv.title}
                    </span>
                  </div>
                </div>

                {/* Details & Deliverables */}
                <div className="px-1 space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {srv.desc}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200">
                    {srv.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#0052cc] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-1 pt-3 mt-3.5 border-t border-slate-100">
                <Link
                  to={srv.link}
                  className="w-full text-xs font-bold font-heading text-slate-900 group-hover:text-[#0052cc] flex items-center justify-between transition-colors"
                >
                  <span>{srv.action}</span>
                  <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-[#0052cc] group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-1">
          <Link
            to="/dich-vu/to-chuc-ket-noi"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0052cc] hover:text-[#0041a8] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition font-heading shadow-2xs"
          >
            <span>Xem tất cả gói dịch vụ kết nối B2B</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          07. HỢP TÁC — HỢP TÁC CHIẾN LƯỢC (DESIGN-TASTE PHOTOGRAPHIC CARDS)
         ========================================================================= */}
      <section id="hop-tac" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-5xl mx-auto space-y-2">

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
            HỢP TÁC CÙNG CHUOICUNGUNG.COM
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
            Hợp tác chiến lược cùng các đối tác sáng lập, nhà tài trợ, khu công nghiệp và tổ chức hiệp hội nâng tầm công nghiệp Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { 
              image: "/images/partners/partner_founding_alliance_2026.jpg",
              imageAlt: "Ký kết Đối tác Sáng lập Chuỗi cung ứng tại phòng họp hội đồng VIP",
              tag: "ĐỘC QUYỀN TOÀN NGÀNH", 
              accentColor: "text-amber-300",
              title: "Đối tác Sáng lập", 
              subtitle: "Founding Partner",
              desc: "Đại diện đầu ngành độc quyền dẫn dắt hệ sinh thái và đồng kiến tạo chuẩn mực khớp lệnh chuỗi cung ứng.",
              highlights: [
                "Độc quyền 1 thương hiệu duy nhất theo từng ngành hàng",
                "Hiện diện ưu tiên VIP tại toàn bộ cổng tra cứu & trang chủ",
                "Quyền tham gia Hội đồng Chuyên môn thẩm định năng lực"
              ],
              action: "Chi tiết quyền lợi Sáng lập",
              link: "/founding-partner" 
            },
            { 
              image: "/images/partners/partner_sponsor_leadership_2026.jpg",
              imageAlt: "Gian hàng nhà tài trợ B2B và sảnh vinh danh Leadership Awards",
              tag: "ĐỒNG HÀNH SỰ KIỆN", 
              accentColor: "text-sky-300",
              title: "Nhà tài trợ B2B", 
              subtitle: "Event & Sourcing Sponsor",
              desc: "Đồng hành cùng chuỗi ngày hội Sourcing Day, triển lãm chuỗi cung ứng và xúc tiến giao thương tại các KCN.",
              highlights: [
                "Gian hàng ưu tiên tại chuỗi ngày hội kết nối B2B toàn quốc",
                "Tiếp cận trực tiếp 500+ doanh nghiệp FDI & xưởng sản xuất",
                "Quảng bá thương hiệu trên Kỷ yếu & E-Catalogue thường niên"
              ],
              action: "Xem các gói tài trợ",
              link: "/tai-tro" 
            },
            { 
              image: "/images/partners/partner_dev_smart_factory_2026.jpg",
              imageAlt: "Kỹ sư tự động hóa và dây chuyền chuyển đổi số sản xuất thông minh",
              tag: "GIẢI PHÁP LIÊN KẾT", 
              accentColor: "text-emerald-300",
              title: "Đối tác Phát triển", 
              subtitle: "Development Partner",
              desc: "Tích hợp giải pháp tài chính, logistics, giám định chất lượng và giải pháp chuyển đổi số cho nhà máy.",
              highlights: [
                "Tích hợp giải pháp chuyên môn vào các bước khớp lệnh CCU",
                "Mạng lưới Referral B2B với chính sách hoa hồng minh bạch",
                "Cùng phát hành báo cáo chuyên đề và cẩm nang kỹ thuật B2B"
              ],
              action: "Gia nhập mạng lưới đối tác",
              link: "/doi-tac-phat-trien" 
            },
            { 
              image: "/images/partners/partner_association_summit_2026.jpg",
              imageAlt: "Hội nghị thượng đỉnh hiệp hội ngành nghề và liên minh doanh nghiệp Việt Nam",
              tag: "MẠNG LƯỚI BẢO TRỢ", 
              accentColor: "text-purple-300",
              title: "Hội & Hiệp hội", 
              subtitle: "Industry Association",
              desc: "Liên minh cùng các Hội Cơ khí, Điện tử, Da giày, Dệt may, Gỗ và Logistics thúc đẩy nội địa hóa.",
              highlights: [
                "Không gian số hóa miễn phí cơ sở dữ liệu doanh nghiệp hội viên",
                "Đồng tổ chức các phiên xúc tiến cung - cầu nội địa & xuất khẩu",
                "Thu thập nhu cầu mở thầu tập trung bảo vệ quyền lợi hội viên"
              ],
              action: "Liên hệ hợp tác Hiệp hội",
              link: "/hop-tac" 
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-[#0052cc] hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Visual Photo Header */}
                <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-col text-white">
                    <span className="text-lg sm:text-xl font-black font-heading tracking-tight leading-snug">
                      {item.title}
                    </span>
                  </div>
                </div>

                {/* Details & Highlights */}
                <div className="px-1 space-y-2">
                  <div>
                    <p className="text-[11px] font-mono text-[#0052cc] font-semibold">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal mt-1">
                      {item.desc}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200">
                    {item.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="px-1 pt-3 mt-3.5 border-t border-slate-100">
                <Link 
                  to={item.link} 
                  className="w-full text-xs font-bold font-heading text-slate-900 group-hover:text-[#0052cc] flex items-center justify-between transition-colors"
                >
                  <span>{item.action}</span>
                  <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-[#0052cc] group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 font-mono italic text-center max-w-2xl mx-auto">
          * Quyền lợi ưu tiên xuất hiện của Nhà tài trợ và Founding Partner là ưu tiên truyền thông và nhận diện thương hiệu, không ảnh hưởng đến tính khách quan của kết quả matching.
        </p>
      </section>

      {/* =========================================================================
          BLOCK 14 — CTA CUỐI TRANG (CLEAN ENTERPRISE ACTION)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0b3f6d] rounded-[36px] p-8 sm:p-12 lg:p-14 text-white text-center shadow-2xl relative overflow-hidden space-y-6">
          
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading uppercase tracking-wide leading-tight">
              MỘT NHU CẦU THẬT. MỘT KẾT NỐI ĐÚNG. MỘT KẾT QUẢ CÓ THỂ THEO DÕI.
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
              Bắt đầu ngay hôm nay để nền tảng CHUOICUNGUNG.COM hỗ trợ doanh nghiệp tối ưu hóa nguồn lực, mở rộng đối tác và gia tăng đơn hàng thực tế.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/tao-ho-so"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-[#0052cc] rounded-2xl font-black text-xs sm:text-sm uppercase font-heading tracking-wider shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>GIỚI THIỆU NĂNG LỰC DOANH NGHIỆP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dang-nhu-cau"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600/80 hover:bg-blue-600 border border-white/20 text-white rounded-2xl font-black text-xs sm:text-sm uppercase font-heading tracking-wider transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>ĐĂNG NHU CẦU MUA SẮM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
