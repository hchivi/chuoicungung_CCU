import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ECOSYSTEM_PANELS = [
  {
    id: 'nha-cung-ung',
    kicker: 'HỆ THỐNG ĐỐI TÁC',
    kickerColor: '#ffd166', // warm gold
    title: 'NHÀ CUNG ỨNG PHỤ TRỢ',
    description: 'Năng lực sản xuất phụ trợ, gia công cơ khí chính xác, bao bì, may mặc, hóa chất công nghiệp và tự động hóa nhà xưởng.',
    image: '/images/roles/hero_card_supplier_cnc.jpg',
    imageAlt: 'Nhà cung ứng sản xuất cơ khí chính xác CNC',
    linkText: 'Xem danh mục',
    href: '/nha-cung-ung',
  },
  {
    id: 'san-pham-dich-vu',
    kicker: 'QUY CÁCH KỸ THUẬT',
    kickerColor: '#38bdf8', // sky blue
    title: 'SẢN PHẨM & DỊCH VỤ',
    description: 'Chi tiết máy CNC, thùng carton sóng, đồ gá Jig, hóa chất công nghiệp, giải pháp kỹ thuật và dịch vụ phụ trợ nhà xưởng.',
    image: '/images/roles/role_supplier_logistics.jpg',
    imageAlt: 'Sản phẩm và dịch vụ công nghiệp chuỗi cung ứng',
    linkText: 'Xem sản phẩm',
    href: '/nha-cung-ung',
  },
  {
    id: 'nha-may',
    kicker: 'CƠ SỞ SẢN XUẤT',
    kickerColor: '#34d399', // emerald
    title: 'NHÀ MÁY FDI & NỘI ĐỊA',
    description: 'Cơ sở dữ liệu các nhà máy sản xuất trực tiếp đang vận hành trên toàn quốc với thông tin dây chuyền và quy mô thực tế.',
    image: '/images/roles/role_factory_smart.jpg',
    imageAlt: 'Nhà máy sản xuất thông minh hiện đại',
    linkText: 'Khám phá nhà máy',
    href: '/nha-may',
  },
  {
    id: 'khu-cong-nghiep',
    kicker: 'HẠ TẦNG & MẶT BẰNG',
    kickerColor: '#fbbf24', // amber
    title: 'KHU CÔNG NGHIỆP GIS',
    description: 'Bản đồ vị trí GIS, quy mô diện tích, hạ tầng kỹ thuật, giá thuê và các ngành nghề ưu tiên thu hút đầu tư tại từng địa phương.',
    image: '/images/roles/role_industrial_park_aerial.jpg',
    imageAlt: 'Bản đồ và hạ tầng khu công nghiệp',
    linkText: 'Xem bản đồ KCN',
    href: '/khu-cong-nghiep',
  },
  {
    id: 'hiep-hoi',
    kicker: 'MẠNG LƯỚI TỔ CHỨC',
    kickerColor: '#a78bfa', // purple
    title: 'HỘI & HIỆP HỘI',
    description: 'Tổ chức ngành nghề cơ khí, dệt may, da giày, điện tử, logistics, chế biến gỗ và các liên minh xuất khẩu hàng đầu Việt Nam.',
    image: '/images/roles/role_association_summit.jpg',
    imageAlt: 'Hội và hiệp hội ngành nghề liên kết',
    linkText: 'Xem hiệp hội',
    href: '/hiep-hoi',
  },
  {
    id: 'chuong-trinh',
    kicker: 'SỰ KIỆN & B2B MATCH',
    kickerColor: '#fb7185', // rose
    title: 'CHƯƠNG TRÌNH KẾT NỐI',
    description: 'Ngày hội cung – cầu B2B Matchmaking 1:1, triển lãm chuyên ngành và các phiên xúc tiến thương mại trực tiếp tại các trung tâm kinh tế.',
    image: '/images/roles/role_sponsor_pavilion.jpg',
    imageAlt: 'Chương trình kết nối giao thương cung cầu',
    linkText: 'Xem sự kiện',
    href: '/chuong-trinh',
  },
  {
    id: 'catalogue',
    kicker: 'TÀI LIỆU & CẨM NANG',
    kickerColor: '#2dd4bf', // teal
    title: 'E-CATALOGUE SỐ HÓA',
    description: 'Thư viện cẩm nang ngành, profile năng lực nhà cung ứng tiêu biểu, báo cáo chuỗi cung ứng được chuẩn hóa định dạng số.',
    image: '/images/roles/role_partner_strategic.jpg',
    imageAlt: 'E-Catalogue và hồ sơ năng lực',
    linkText: 'Mở catalogue',
    href: '/catalogue',
  },
  {
    id: 'san-nhu-cau',
    kicker: 'KHỚP LỆNH TRỰC TIẾP',
    kickerColor: '#60a5fa', // blue
    title: 'NHU CẦU THU MUA',
    description: 'Nhu cầu mua hàng và tìm xưởng sản xuất đã được xác thực, công khai minh bạch điều kiện kỹ thuật và tiến độ phản hồi.',
    image: '/images/roles/hero_card_factory_sourcing.jpg',
    imageAlt: 'Nhu cầu mua hàng công khai chuỗi cung ứng',
    linkText: 'Xem nhu cầu',
    href: '/san-nhu-cau',
  },
];

export default function EcosystemDataDirectory() {
  const sectionRef = useRef(null);
  const rightViewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = ECOSYSTEM_PANELS.length;

  useEffect(() => {
    // Only apply GSAP pinned horizontal scroll on desktop (> 1024px)
    if (typeof window === 'undefined') return;

    let ctx;
    const initScrollTrigger = () => {
      if (window.innerWidth <= 1024) return;

      const section = sectionRef.current;
      const track = trackRef.current;
      const rightViewport = rightViewportRef.current;
      if (!section || !track || !rightViewport) return;

      ctx = gsap.context(() => {
        // Calculate the exact horizontal scroll distance needed
        const getScrollDistance = () => {
          const maxScroll = track.scrollWidth - rightViewport.clientWidth;
          return Math.max(0, maxScroll);
        };

        const nav = document.querySelector('header');
        const navHeight = nav ? nav.offsetHeight : 96;

        // Animate track translation tied to vertical scroll
        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
        });

        // Pin the section when it reaches the bottom of the sticky navbar
        const st = ScrollTrigger.create({
          trigger: section,
          start: () => `top ${navHeight}px`,
          end: () => `+=${Math.max(window.innerHeight * 2.8, getScrollDistance() + 400)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.8,
          animation: tween,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            // Update progress bar width
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(100, Math.max(12.5, progress * 100))}%`;
            }
            // Update active counter (01 / 08)
            const activeIdx = Math.min(
              totalSlides,
              Math.max(1, Math.floor(progress * totalSlides) + 1)
            );
            setCurrentSlide(activeIdx);
          },
        });

        scrollTriggerRef.current = st;
      }, sectionRef);
    };

    initScrollTrigger();

    // Refresh layout after fonts/images settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        if (ctx) ctx.revert();
        if (trackRef.current) {
          trackRef.current.style.transform = '';
        }
      } else {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', handleResize);
      if (ctx) ctx.revert();
    };
  }, [totalSlides]);

  const scrollToSlide = (index) => {
    const targetIdx = Math.max(1, Math.min(totalSlides, index));
    if (window.innerWidth > 1024 && scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const targetProgress = (targetIdx - 1) / (totalSlides - 1);
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    } else {
      const el = rightViewportRef.current;
      if (!el) return;
      const cardWidth = el.firstElementChild?.firstElementChild?.clientWidth || 340;
      el.scrollTo({
        left: (targetIdx - 1) * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  // Mobile horizontal swipe listener
  const handleMobileScroll = (e) => {
    if (window.innerWidth > 1024) return;
    const el = e.currentTarget;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const currentScroll = el.scrollLeft;
    const progressPercent = Math.min(100, Math.max(12.5, (currentScroll / maxScroll) * 100));
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progressPercent}%`;
    }

    const cardWidth = el.firstElementChild?.firstElementChild?.clientWidth || 340;
    const activeIndex = Math.min(
      totalSlides,
      Math.max(1, Math.round(currentScroll / cardWidth) + 1)
    );
    setCurrentSlide(activeIndex);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#011c12] text-white select-none h-auto lg:h-[calc(100vh-96px)] min-h-[760px] xl:min-h-[840px] 2xl:min-h-[920px] flex flex-col lg:flex-row border-y border-emerald-900/40 overflow-hidden shadow-2xl z-20"
      aria-label="Tra cứu hệ sinh thái chuỗi cung ứng"
    >
      {/* =========================================================
          CỘT TRÁI: PINNED EDITORIAL SIDEBAR (The Soul Alley Style)
         ========================================================= */}
      <aside className="w-full lg:w-[400px] xl:w-[460px] 2xl:w-[500px] shrink-0 h-auto lg:h-full bg-gradient-to-b from-[#043321] via-[#022518] to-[#01180f] border-b lg:border-b-0 lg:border-r border-emerald-800/35 p-8 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between z-20 relative">
          
          {/* Top block */}
          <div className="space-y-6">
            
            <div className="space-y-3">
              <span className="inline-block text-[11px] font-bold tracking-[2.5px] uppercase text-emerald-400 font-mono">
                HỆ SINH THÁI KẾT NỐI B2B
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase font-heading tracking-tight text-white leading-[1.02]">
                TRA CỨU<br />
                <span className="italic font-light font-serif text-emerald-100 lowercase">Hệ sinh thái</span>
              </h2>
            </div>

            <p className="text-emerald-100/75 text-sm sm:text-base leading-relaxed font-light max-w-sm">
              Kết quả được tìm từ dữ liệu đang có trong hệ thống và giải thích theo ngành nghề, địa bàn, năng lực, quy mô và yêu cầu thực tế.
            </p>

            <div className="pt-2">
              <Link
                to="/nha-cung-ung"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-[#011c12] text-xs sm:text-sm font-bold tracking-wide hover:bg-emerald-400 hover:text-[#011c12] transition-all duration-300 shadow-[0_8px_24px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 group"
              >
                <span>Khám phá ngay</span>
                <span className="w-5 h-5 rounded-full bg-[#011c12] text-white flex items-center justify-center text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  ↗
                </span>
              </Link>
            </div>

          </div>

          {/* Bottom block: Progress bar, Counter (01 / 08) & Slide Navigation */}
          <div className="pt-8 mt-8 border-t border-emerald-800/35 space-y-4">
            
            {/* Progress bar track */}
            <div className="w-full h-1 bg-emerald-950/80 border border-emerald-800/30 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-[#ffd166] rounded-full transition-[width] duration-75 ease-linear"
                style={{ width: '12.5%' }}
              />
            </div>

            {/* Counter and Nav Buttons */}
            <div className="flex items-center justify-between">
              
              {/* 01 / 08 counter */}
              <div className="flex items-center gap-2 font-mono text-base font-bold text-white tracking-wider">
                <span className="text-white text-lg">
                  {String(currentSlide).padStart(2, '0')}
                </span>
                <span className="text-emerald-400/50 font-light">/</span>
                <span className="text-emerald-300/40">
                  {String(totalSlides).padStart(2, '0')}
                </span>
              </div>

              {/* Arrow navigation buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSlide(currentSlide - 1)}
                  aria-label="Previous Slide"
                  className="w-10 h-10 rounded-full border border-emerald-700/40 bg-emerald-950/40 hover:bg-emerald-800/50 text-white flex items-center justify-center text-sm transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-30"
                  disabled={currentSlide === 1}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSlide(currentSlide + 1)}
                  aria-label="Next Slide"
                  className="w-10 h-10 rounded-full border border-emerald-700/40 bg-emerald-950/40 hover:bg-emerald-800/50 text-white flex items-center justify-center text-sm transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-30"
                  disabled={currentSlide === totalSlides}
                >
                  →
                </button>
              </div>

            </div>

          </div>

        </aside>

        {/* =========================================================
            CỘT PHẢI: VIEWPORT TRƯỢT NGANG (Horizontal Sliding Track)
           ========================================================= */}
        <div
          ref={rightViewportRef}
          onScroll={handleMobileScroll}
          className="flex-1 min-w-0 h-auto lg:h-full bg-[#011c12] relative overflow-x-auto lg:overflow-hidden scrollbar-none scroll-smooth"
        >
          <div
            ref={trackRef}
            className="flex h-[620px] sm:h-[680px] lg:h-full w-max will-change-transform py-6 px-4 lg:py-0 lg:px-0"
          >
            {ECOSYSTEM_PANELS.map((panel) => (
              <article
                key={panel.id}
                className="w-[320px] sm:w-[380px] lg:w-[clamp(380px,calc((100vw-460px)/3),520px)] shrink-0 h-full border border-emerald-900/35 lg:border-t-0 lg:border-b-0 lg:border-l-0 lg:border-r border-emerald-800/35 bg-[#022417] hover:bg-[#033120] transition-colors duration-400 relative flex flex-col justify-between overflow-hidden group rounded-2xl lg:rounded-none mr-4 lg:mr-0"
              >
                
                {/* Top info card with fixed height so all buttons align in a straight line */}
                <div className="p-8 sm:p-10 lg:p-11 xl:p-12 lg:pt-12 xl:pt-14 relative z-10 flex flex-col justify-between flex-shrink-0 h-[280px] sm:h-[300px] lg:h-[320px] xl:h-[340px]">
                  
                  <div className="space-y-2.5">
                    <span
                      className="text-[11px] font-bold tracking-[2.5px] uppercase font-mono block"
                      style={{ color: panel.kickerColor }}
                    >
                      {panel.kicker}
                    </span>

                    <h3 className="text-xl sm:text-2xl xl:text-[27px] font-black font-heading tracking-tight text-white uppercase leading-[1.15] h-[52px] sm:h-[58px] xl:h-[64px] flex items-start line-clamp-2">
                      {panel.title}
                    </h3>

                    <p className="text-emerald-100/75 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                      {panel.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={panel.href}
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-900/60 hover:bg-emerald-400 text-emerald-100 hover:text-[#011c12] border border-emerald-600/30 text-xs font-bold uppercase tracking-wider transition-all duration-300 w-fit group/link shadow-xs h-[38px]"
                    >
                      <span>{panel.linkText}</span>
                      <span className="text-xs transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5">
                        ↗
                      </span>
                    </Link>
                  </div>

                </div>

                {/* Bottom portrait media with seamless dark fade overlay */}
                <div className="absolute left-0 bottom-0 w-full h-[58%] lg:h-[62%] xl:h-[65%] overflow-hidden z-0 pointer-events-none">
                  
                  <img
                    src={panel.image}
                    alt={panel.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-bottom transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Gradient overlay: blends top dark background into image below */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022417] via-[#022417]/35 to-[#022417] pointer-events-none" />

                </div>

              </article>
            ))}

            {/* End trailing buffer to give breathing room after the 8th slide */}
            <div className="w-12 lg:w-20 shrink-0 h-full pointer-events-none" aria-hidden="true" />
          </div>
        </div>

      </section>
  );
}
