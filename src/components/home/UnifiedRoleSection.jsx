import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const ROLES = [
  {
    id: 'kcn',
    tag: 'HẠ TẦNG & MẶT BẰNG',
    title: 'KHU CÔNG NGHIỆP – QUỸ ĐẤT, NHÀ XƯỞNG & MẠNG LƯỚI NCC',
    subtitle: 'Quỹ đất · Nhà xưởng · Mạng lưới NCC',
    desc: 'Số hóa quỹ đất KCN, xúc tiến cho thuê nhà xưởng tiêu chuẩn và kết nối chuỗi cung ứng địa phương phục vụ đón làn sóng đầu tư FDI.',
    badges: ['Hạ tầng & Nhà xưởng', 'Bản đồ KCN GIS', 'NCC phụ trợ địa phương'],
    image: '/images/roles/role_vn_industrial_park.jpg',
    imageAlt: 'Hạ tầng khu công nghiệp hiện đại tại Việt Nam',
    link: '/khu-cong-nghiep',
  },
  {
    id: 'sponsor',
    tag: 'TÀI TRỢ & THƯƠNG HIỆU',
    title: 'NHÀ TÀI TRỢ – ĐỒNG HÀNH THƯƠNG HIỆU TẠI CÁC KỲ SOURCING DAY',
    subtitle: 'Chương trình · Ngành hàng · Thương hiệu',
    desc: 'Đồng hành thương hiệu tại các kỳ Sourcing Day B2B, triển lãm chuỗi cung ứng và kết nối trực tiếp với mạng lưới lãnh đạo doanh nghiệp.',
    badges: ['Tài trợ ngành', 'Nhận diện thương hiệu', 'Kết nối lãnh đạo B2B'],
    image: '/images/roles/role_vn_sponsor_pavilion.jpg',
    imageAlt: 'Nhà tài trợ thương hiệu B2B tại triển lãm công nghiệp Việt Nam',
    link: '/tai-tro',
  },
  {
    id: 'partner',
    tag: 'ĐỐI TÁC CHIẾN LƯỢC',
    title: 'ĐỐI TÁC ĐỒNG HÀNH – ĐỒNG KIẾN TẠO HỆ ĐIỀU HÀNH CHUỖI CUNG ỨNG',
    subtitle: 'Độc quyền ngành · Hiện diện VIP',
    desc: 'Quyền lợi sáng lập và hiện diện ưu tiên VIP trong các ấn phẩm số hóa, cẩm nang ngành và hệ thống khớp lệnh chuỗi cung ứng quốc gia.',
    badges: ['Độc quyền ngành', 'Hiện diện ưu tiên VIP', 'Quyền lợi sáng lập'],
    image: '/images/roles/role_vn_partner_signing.jpg',
    imageAlt: 'Lễ ký kết đối tác đồng hành chiến lược chuỗi cung ứng Việt Nam',
    link: '/founding-partner',
  },
  {
    id: 'factory',
    tag: 'SẢN XUẤT & MUA SẮM',
    title: 'NHÀ MÁY – BÓC TÁCH TIÊU CHUẨN KỸ THUẬT & TÌM NHÀ XƯỞNG TƯƠNG THÍCH',
    subtitle: 'Tìm nguồn · So sánh giá · Đăng nhu cầu',
    desc: 'Bóc tách tiêu chuẩn kỹ thuật bản vẽ, đối chiếu năng lực dây chuyền máy móc và tìm xưởng sản xuất gia công phụ trợ tương thích.',
    badges: ['Tìm nguồn cung ứng', 'So sánh báo giá', 'Đăng nhu cầu mua hàng'],
    image: '/images/roles/role_vn_factory.jpg',
    imageAlt: 'Kỹ sư Việt Nam và dây chuyền tự động hóa nhà máy',
    link: '/dang-nhu-cau',
  },
  {
    id: 'supplier',
    tag: 'HỒ SƠ NĂNG LỰC B2B',
    title: 'NHÀ CUNG ỨNG – CHUẨN HÓA HỒ SƠ & TIẾP CẬN BUYER FDI TRỰC TIẾP',
    subtitle: 'Hồ sơ năng lực · Tiếp cận Buyer FDI',
    desc: 'Chuẩn hóa hồ sơ năng lực gia công CNC, khuôn mẫu, bao bì, tự động hóa và nhận thông báo mở thầu mua sắm công khai.',
    badges: ['Chuẩn hóa hồ sơ', 'Tiếp cận Buyer FDI', 'Sourcing Day 1:1'],
    image: '/images/roles/role_vn_supplier_cnc.jpg',
    imageAlt: 'Kỹ sư cơ khí chính xác CNC và nhà cung ứng Việt Nam',
    link: '/tao-ho-so',
  },
  {
    id: 'association',
    tag: 'MẠNG LƯỚI TỔ CHỨC',
    title: 'HỘI & HIỆP HỘI – DỮ LIỆU HỘI VIÊN & XÚC TIẾN GIAO THƯƠNG ĐA NGÀNH',
    subtitle: 'Thu thập nhu cầu · Kết nối hội viên',
    desc: 'Cơ sở dữ liệu hội viên ngành nghề cơ khí, dệt may, điện tử, logistics; hỗ trợ xúc tiến giao thương và nâng cao tỷ lệ nội địa hóa.',
    badges: ['Nhu cầu ngành', 'Đồng hành hội viên', 'Xúc tiến giao thương'],
    image: '/images/roles/role_vn_association_delegates.jpg',
    imageAlt: 'Đại biểu hội và hiệp hội ngành nghề công nghiệp Việt Nam',
    link: '/hiep-hoi',
  },
];

const TOTAL_ROLES = ROLES.length;

export default function UnifiedRoleSection() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Touch tracking for mobile swipe
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  // Computed previous, current, and next roles
  const prevIndex = (currentIndex - 1 + TOTAL_ROLES) % TOTAL_ROLES;
  const nextIndex = (currentIndex + 1) % TOTAL_ROLES;

  const currentRole = ROLES[currentIndex];
  const prevRole = ROLES[prevIndex];
  const nextRole = ROLES[nextIndex];

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % TOTAL_ROLES);
    setTimeout(() => setIsAnimating(false), 450);
  }, []);

  const prevSlide = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + TOTAL_ROLES) % TOTAL_ROLES);
    setTimeout(() => setIsAnimating(false), 450);
  }, []);

  const goToRole = (index) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 450);
  };

  // Autoplay (5.5s) with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current < -50) {
      nextSlide();
    } else if (touchDeltaX.current > 50) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchDeltaX.current = 0;
  };

  return (
    <section 
      className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          1. SECTION HEADER (Centered Headline & Subtitle matching Sao Kim)
         ========================================================================= */}
      <div className="text-center w-full max-w-5xl mx-auto px-4 mb-8 sm:mb-10 space-y-2.5">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-black uppercase font-heading tracking-tight text-center leading-tight">
          <span className="text-gradient-flow-green">
            CHUOICUNGUNG.COM CÓ THỂ GIÚP GÌ CHO BẠN?
          </span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
          Chọn đúng vai trò của bạn để khám phá công cụ, luồng khớp lệnh và dịch vụ chuyên biệt.
        </p>
      </div>

      {/* =========================================================================
          2. ROLE TITLE & TAG (Centered strictly per Image 3 requirement)
         ========================================================================= */}
      <div className="text-center max-w-4xl mx-auto px-4 mb-5 sm:mb-6 space-y-1.5">
        <span className="text-[11px] sm:text-xs font-bold tracking-[2.5px] uppercase font-mono text-[#006039] block text-center">
          {currentRole.tag}
        </span>
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[25px] font-black font-heading tracking-tight text-[#072348] uppercase leading-snug text-center line-clamp-2">
          {currentRole.title}
        </h3>
      </div>

      {/* =========================================================================
          3. 3D COVERFLOW SLIDER (With 3D tilted side images matching Sao Kim)
         ========================================================================= */}
      <div
        className="relative w-full overflow-hidden touch-pan-y select-none py-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8 w-full max-w-[1440px] mx-auto"
          style={{ perspective: '1400px' }}
        >
          
          {/* Previous Role Image (Left Peek - Tilted in 3D Perspective) */}
          <div
            onClick={prevSlide}
            className="hidden md:block w-[18%] lg:w-[20%] shrink-0 cursor-pointer select-none transition-all duration-500 hover:scale-[0.96]"
            style={{
              transform: 'rotateY(24deg)',
              transformOrigin: 'right center',
            }}
            title={`Xem vai trò: ${prevRole.title}`}
          >
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-slate-900 group">
              <img
                src={prevRole.image}
                alt={prevRole.imageAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
            </div>
          </div>

          {/* Current Role Image (Center Active - Full Size & Un-tilted) */}
          <div 
            className={`w-full md:w-[64%] lg:w-[60%] max-w-[880px] shrink-0 transition-all duration-500 z-20 ${
              isAnimating ? 'opacity-90 scale-[0.99]' : 'opacity-100 scale-100'
            }`}
          >
            <div className="relative w-full aspect-[21/10] sm:aspect-[21/9] rounded-xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.12)] bg-slate-900 group/img">
              <img
                src={currentRole.image}
                alt={currentRole.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
              />
              
              {/* Subtle vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Navigation Arrows on Left and Right of Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous Role"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-30 backdrop-blur-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next Role"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-30 backdrop-blur-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Next Role Image (Right Peek - Tilted in 3D Perspective) */}
          <div
            onClick={nextSlide}
            className="hidden md:block w-[18%] lg:w-[20%] shrink-0 cursor-pointer select-none transition-all duration-500 hover:scale-[0.96]"
            style={{
              transform: 'rotateY(-24deg)',
              transformOrigin: 'left center',
            }}
            title={`Xem vai trò: ${nextRole.title}`}
          >
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-slate-900 group">
              <img
                src={nextRole.image}
                alt={nextRole.imageAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          4. CONTENT DETAILS BELOW IMAGE (Centered strictly per Image 3 requirement)
         ========================================================================= */}
      <div className="mt-5 text-center max-w-3xl mx-auto px-4 space-y-3">
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal text-center mx-auto">
          {currentRole.desc}
        </p>

        {/* Key Capabilities Badges (Centered) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {currentRole.badges.map((badge, bIdx) => (
            <span
              key={bIdx}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#006039] border border-emerald-200/80"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. CENTER CTA BUTTON (Matching Sao Kim "Khám phá thêm >")
         ========================================================================= */}
      <div className="text-center pt-7 sm:pt-8">
        <button
          type="button"
          onClick={() => navigate(currentRole.link)}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white hover:bg-emerald-50/50 text-[#072348] border border-slate-300 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
        >
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase font-heading">
            Khám phá giải pháp
          </span>
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#006039] text-white flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-2xs">
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        </button>
      </div>

      {/* =========================================================================
          6. PAGINATION INDICATORS (6 Dots)
         ========================================================================= */}
      <div className="flex items-center justify-center gap-2 pt-6">
        {ROLES.map((role, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => goToRole(idx)}
              aria-label={`Go to ${role.title}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-8 bg-[#006039]'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          );
        })}
      </div>

    </section>
  );
}
