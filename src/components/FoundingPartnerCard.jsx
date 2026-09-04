import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle2, Star, Globe, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import foundingPartnersData from '../data/foundingPartners.json';

const PHASE_NAMES_MAP = {
  "1.1": "1.1 Khảo sát & Định hướng",
  "1.2": "1.2 Pháp lý & Thủ tục",
  "1.3": "1.3 Chọn địa điểm & Mặt bằng",
  "2.1": "2.1 Thiết kế & Quy hoạch",
  "2.2": "2.2 Thi công xây dựng",
  "2.3": "2.3 Cơ điện & Hạ tầng kỹ thuật",
  "3.1": "3.1 Lắp đặt máy & Dây chuyền",
  "3.2": "3.2 Hoàn thiện không gian sản xuất",
  "3.3": "3.3 Kiểm tra & Chạy thử Nghiệm thu",
  "4.1": "4.1 Cung ứng đầu vào (NVL, linh kiện)",
  "4.2": "4.2 Quản lý sản xuất & Kiểm soát",
  "4.3": "4.3 Giao nhận & Phân phối",
  "5.1": "5.1 Tuyển dụng & Lao động",
  "5.2": "5.2 Đời sống & Phúc lợi",
  "5.3": "5.3 Đồng phục & Bảo hộ (PPE)",
  "6.1": "6.1 Mở rộng công suất & Nhà máy",
  "6.2": "6.2 Audit & ISO – Chuẩn hóa",
  "6.3": "6.3 Chuyển đổi số & Tự động hóa"
};

const STAGE_NAMES_MAP = {
  "1": "Giai đoạn 01: Chuẩn bị & Đầu tư",
  "2": "Giai đoạn 02: Thiết kế & Xây dựng",
  "3": "Giai đoạn 03: Lắp đặt & Hoàn thiện",
  "4": "Giai đoạn 04: Vận hành Sản xuất",
  "5": "Giai đoạn 05: Nhân sự & Hậu cần",
  "6": "Giai đoạn 06: Mở rộng – Tối ưu – Chuyển đổi"
};

export default function FoundingPartnerCard({ selectedPhase = 'all', selectedStage = 'all' }) {
  const { t, lang } = useLanguage();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Determine which founding partner to display
  let partner = foundingPartnersData[selectedPhase];
  if (!partner && selectedStage !== 'all') {
    partner = foundingPartnersData[`stage-${selectedStage}`] || foundingPartnersData[selectedStage];
  }
  if (!partner) {
    partner = foundingPartnersData['5.3'];
  }

  // Get full display title for current selection matching top block 100%
  const getFullSelectionTitle = () => {
    if (selectedPhase && selectedPhase !== 'all') {
      return PHASE_NAMES_MAP[selectedPhase] || `Pha ${selectedPhase}`;
    }
    if (selectedStage && selectedStage !== 'all') {
      return STAGE_NAMES_MAP[selectedStage] || `Giai đoạn 0${selectedStage}`;
    }
    return "5.3 Đồng phục & Bảo hộ (PPE)";
  };

  // 1. Auto-play video when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsPlayingVideo(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, []);

  // 2. Smooth auto-scrolling to the left for categories
  useEffect(() => {
    if (isHovered || !partner?.featuredProducts || partner.featuredProducts.length <= 3) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const scrollAmount = 190;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered, partner]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!partner) return null;

  return (
    // Outer Container with ClickUp 360° Revolving Gradient Border Animation
    <div className="clickup-card-border w-full shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Inner White Card */}
      <div className="relative z-10 w-full bg-white rounded-[22px] overflow-hidden">
        
        {/* Top Banner Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2 flex items-center justify-between text-xs font-black tracking-wide border-b border-amber-300">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Award className="w-4 h-4 text-slate-950 animate-bounce shrink-0" />
            <span className="uppercase tracking-wider font-heading text-[11px] sm:text-xs font-black">
              {lang === 'en' ? 'FOUNDING PARTNER SPOTLIGHT' : 'NHÀ CUNG CẤP NỔI BẬT - ĐỐI TÁC SÁNG LẬP (FOUNDING PARTNER)'}
            </span>
            <span className="inline-block bg-slate-950 text-yellow-400 text-[10.5px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-bold shadow-xs">
              {getFullSelectionTitle()}
            </span>
          </div>

          {/* Founding Partner Button (Keeps Gradient Background) */}
          <div className="flex items-center space-x-2 shrink-0 ml-2">
            <Link
              to="/founding-partner"
              className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff007f] via-[#7b2cbf] via-[#3a86ff] via-[#00f2fe] to-[#ffbe0b] animate-gradient-flow text-white font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/30"
              title={lang === 'en' ? 'Explore Founding Partners Program' : 'Khám phá chương trình Đối Tác Sáng Lập'}
            >
              <span className="flex items-center space-x-1.5 drop-shadow-xs">
                <span>FOUNDING PARTNER</span>
                <ChevronRight className="w-3.5 h-3.5 text-white stroke-[3] group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* Main Content: 2-Column Grid */}
        <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          
          {/* Left Column: Video Player with Auto-Play On Scroll (Aspect Video 16:9) */}
          <div className="lg:col-span-5 flex flex-col justify-center" ref={videoContainerRef}>
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center">
              {isPlayingVideo ? (
                <iframe
                  src={`${partner.youtubeEmbed || 'https://www.youtube.com/embed/OvvhcglmHzc'}?autoplay=1&mute=1&enablejsapi=1&rel=0&playsinline=1`}
                  title={partner.name}
                  className="w-full h-full border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer group flex items-center justify-center"
                  onClick={() => setIsPlayingVideo(true)}
                >
                  <img
                    src={partner.videoThumbnail || "https://img.youtube.com/vi/OvvhcglmHzc/maxresdefault.jpg"}
                    alt={partner.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-yellow-300 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>
                  {/* Video Play Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center space-x-1.5">
                    <Play className="w-3 h-3 fill-current text-yellow-400" />
                    <span>{lang === 'en' ? 'Play Factory Video' : 'Xem Video Quy Mô Nhà Máy'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Company Header & Smooth Auto-Scrolling Categories Slider (cols 6-12) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Company Info Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-start space-x-3.5">
                {/* Partner Logo */}
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200 p-1 shadow-xs hover:border-yellow-400 transition flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "/images/founding-partners/chuyen-gia-dong-phuc-logo.png";
                    }}
                  />
                </a>

                {/* Partner Name (UPPERCASE) + Rating (4.9 Stars right after name) */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5 flex-wrap">
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg font-black text-slate-950 hover:text-blue-700 transition font-heading uppercase tracking-wide"
                    >
                      CHUYÊN GIA ĐỒNG PHỤC
                    </a>

                    {/* Rating moved directly behind name */}
                    <span className="inline-flex items-center text-amber-600 font-black text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                      <Star className="w-3 h-3 fill-current text-amber-500 mr-1" />
                      4.9 <span className="text-slate-400 font-normal ml-0.5">({partner.reviewsCount || 328})</span>
                    </span>
                  </div>

                  {/* Sub-line: Verified + Country + Years */}
                  <div className="flex items-center space-x-2 text-xs text-slate-600 flex-wrap gap-y-1">
                    <span className="inline-flex items-center text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified Partner
                    </span>
                    <span className="font-bold text-slate-700">🇻🇳 VN</span>
                    <span className="font-medium text-slate-500">• {partner.yearsExperience || 12} năm B2B</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: ONLY Icons (Zalo & Website) */}
              <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-start w-full sm:w-auto justify-end">
                {/* Official Zalo Icon-Only Button */}
                <a
                  href="https://zalo.me/0582877799"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-1.5 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                  title="Chat Zalo: 0582 87 77 99"
                >
                  <img 
                    src="/images/icons/zalo-icon.png" 
                    alt="Zalo" 
                    className="w-full h-full object-contain"
                  />
                </a>

                {/* Website Icon-Only Button */}
                <a
                  href={partner.website || "https://chuyengiadongphuc.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 p-2 shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                  title="Truy cập Website: chuyengiadongphuc.com"
                >
                  <Globe className="w-full h-full stroke-[2.2]" />
                </a>
              </div>
            </div>

            {/* Continuous Auto-Scrolling Slider With Slogan in Header */}
            <div 
              className="space-y-2 relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Header: DANH MỤC SẢN PHẨM TIÊU BIỂU + Slogan */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 flex-wrap gap-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="uppercase tracking-wider text-slate-950 text-[11px] sm:text-xs font-heading font-black">
                    DANH MỤC SẢN PHẨM TIÊU BIỂU:
                  </span>
                  <span className="text-xs sm:text-[13px] text-amber-800 font-extrabold tracking-tight">
                    "{partner.slogan || 'cần ĐỒNG PHỤC có CHUYÊN GIA'}"
                  </span>
                </div>

                {/* Slider Controls + View All Link */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleScroll('left')}
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-yellow-400 text-slate-700 hover:text-slate-950 flex items-center justify-center transition shadow-2xs border border-slate-200 cursor-pointer"
                    title="Trượt sang trái"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleScroll('right')}
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-yellow-400 text-slate-700 hover:text-slate-950 flex items-center justify-center transition shadow-2xs border border-slate-200 cursor-pointer"
                    title="Trượt sang phải"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline text-[11px] font-semibold flex items-center ml-2"
                  >
                    {lang === 'en' ? 'View all' : 'Xem toàn bộ'}
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

            {/* Continuous Horizontal Slider */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
            >
              {partner.featuredProducts?.map((product, pIdx) => (
                <a
                  key={pIdx}
                  href={product.url || partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-[145px] sm:w-[160px] group/p bg-slate-50 hover:bg-white rounded-2xl p-2.5 border border-slate-200 hover:border-yellow-400 hover:shadow-md transition-all flex flex-col items-center justify-between text-center cursor-pointer"
                  title={`Xem danh mục: ${product.name}`}
                >
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-100 mb-2 flex items-center justify-center relative p-1 shadow-2xs">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg group-hover/p:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/images/founding-partners/products/may-ao-thun-dong-phuc.jpg";
                      }}
                    />
                  </div>
                  
                  {/* Category Name Unified to Exactly 2 Lines Height */}
                  <div className="w-full h-10 flex items-center justify-center text-center px-0.5">
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-900 group-hover/p:text-yellow-700 leading-tight tracking-tight line-clamp-2">
                      {product.name}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
  );
}
