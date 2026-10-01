import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogIn, UserPlus, Menu, X, ChevronDown, ChevronRight,
  Sparkles, Building2, Factory, Users, Layers,
  MapPin, Compass, ArrowRight, User, Briefcase, UserCheck,
  Search, Handshake, FileText, Crown, Award, BookOpen
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { STAGE_ID_TO_SLUG_MAP } from '../data/sixStagesData';
import LanguageSwitcher from './LanguageSwitcher';
import BrandLogo from './BrandLogo';
import AuthModal from './auth/AuthModal';

export default function Navbar() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });
  const [activeSection, setActiveSection] = useState('');

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Nav links matching Image 1 order with Anchor IDs
  const navLinks = [
    {
      name: lang === 'en' ? 'Sourcing' : 'Tìm nguồn',
      anchorId: "tim-nguon",
      path: "/nha-cung-ung"
    },
    {
      name: lang === 'en' ? 'Demands' : 'Nhu cầu',
      anchorId: "nhu-cau",
      path: "/san-nhu-cau",
      isHot: true
    },
    {
      name: lang === 'en' ? '6 Stages' : '6 Giai đoạn',
      anchorId: "6-giai-doan",
      path: "/ban-do-6-giai-doan",
      hasDropdown: 'stages'
    },
    {
      name: lang === 'en' ? 'Programs' : 'Chương trình',
      anchorId: "chuong-trinh",
      path: "/chuong-trinh"
    },
    {
      name: lang === 'en' ? 'Ecosystem' : 'Hệ sinh thái',
      anchorId: "he-sinh-thai",
      path: "/he-sinh-thai",
      hasDropdown: 'ecosystem'
    },
    {
      name: lang === 'en' ? 'Services' : 'Dịch vụ',
      anchorId: "dich-vu",
      path: "/dich-vu",
      hasDropdown: 'services'
    },
    {
      name: lang === 'en' ? 'Partnership' : 'Hợp tác',
      anchorId: "hop-tac",
      path: "/hop-tac",
      hasDropdown: 'partnership'
    },
  ];

  // Scrollspy: Track active section on homepage as user scrolls
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['tim-nguon', 'nhu-cau', '6-giai-doan', 'chuong-trinh', 'he-sinh-thai', 'dich-vu', 'hop-tac'];

    const handleScroll = () => {
      // If at very top (Hero search), no section is highlighted
      if (window.scrollY < 320) {
        setActiveSection('');
        return;
      }

      const scrollPosition = window.scrollY + 180;
      let current = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
          }
        }
      }

      // Check if near page bottom, activate the last section
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
        current = 'hop-tac';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isNavActive = (link) => {
    if (location.pathname === '/') {
      return activeSection === link.anchorId;
    }
    return isActive(link.path);
  };

  return (
    <>
      <header 
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}
        className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all w-full overflow-visible"
      >

        {/* Top Micro Announcement Bar - CENTER ALIGNED, FLUID SPACING, POPPINS */}
        <div className="bg-[#072348] text-white py-1 sm:py-1.5 px-3 sm:px-6 w-full font-poppins border-b border-white/5 relative z-40 overflow-visible">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center relative overflow-visible">
            
            {/* Center Content Links & Support Info */}
            <div className="flex items-center justify-center overflow-x-auto no-scrollbar touch-scroll py-0.5 space-x-3 sm:space-x-4 md:space-x-6 text-[10.5px] sm:text-[11.5px] md:text-[12px] font-poppins text-center pr-16 sm:pr-20 md:pr-0">
              <Link to="/dinh-vi-doanh-nghiep" className="text-amber-300 hover:text-white flex items-center font-semibold transition shrink-0 whitespace-nowrap">
                <Compass className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span>{t('topbar.diagnostic')}</span>
              </Link>
              <span className="text-slate-600/80 shrink-0">|</span>
              <Link to="/khu-cong-nghiep" className="text-sky-200 hover:text-white flex items-center font-medium transition shrink-0 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span>Bản đồ KCN</span>
              </Link>
              <span className="text-slate-600/80 shrink-0">|</span>
              <Link to="/dang-nhu-cau" className="text-emerald-300 hover:text-white flex items-center transition font-semibold shrink-0 whitespace-nowrap">
                <span>{t('topbar.postDemand')}</span>
              </Link>
              <span className="text-slate-600/80 hidden md:inline shrink-0">|</span>
              <span className="text-slate-300 font-medium hidden md:inline whitespace-nowrap shrink-0">
                {t('topbar.support')} <strong className="text-white font-semibold">1900 8686</strong> – <a href="mailto:hotro@chuoicungung.com" className="text-slate-300 hover:text-white transition">hotro@chuoicungung.com</a>
              </span>
            </div>

            {/* Right: Language Switcher Button */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-50">
              <LanguageSwitcher variant="topbar" />
            </div>

          </div>
        </div>

        {/* Main Luxury Navigation Bar */}
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-3 xl:px-6 2xl:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Left: Brand Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0 mr-1 lg:mr-2 xl:mr-3 2xl:mr-6">
              <BrandLogo variant="light" size="md" />
            </Link>

            {/* Center Navigation Links - 7 Tabs IN ĐẬM */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5 2xl:space-x-2.5 flex-nowrap flex-shrink-0 font-heading">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group flex-shrink-0">
                  <Link
                    to={link.path}
                    className={`px-1 py-1.5 lg:px-1.5 lg:py-2 xl:px-2.5 xl:py-2 2xl:px-3 rounded-xl text-[11px] xl:text-[12px] 2xl:text-[13px] font-black uppercase tracking-tight font-heading transition-all inline-flex items-center space-x-0.5 xl:space-x-1 whitespace-nowrap ${isNavActive(link)
                      ? 'text-[#0052cc] bg-blue-50/90 shadow-2xs'
                      : 'text-slate-800 hover:text-[#0052cc] hover:bg-slate-50'
                      }`}
                  >
                    <span>{link.name}</span>

                    {link.isHot && (
                      <span className="px-1 py-0.2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[7.5px] font-black rounded-full uppercase tracking-wider animate-pulse shadow-xs ml-0.5">
                        HOT
                      </span>
                    )}

                    {link.hasDropdown && (
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#0052cc] transition-transform group-hover:rotate-180 flex-shrink-0 ml-0.5" />
                    )}
                  </Link>

                  {/* Dropdown for 6 Stages - Zero-gap hover bridge */}
                  {link.hasDropdown === 'stages' && (
                    <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                      <div className="w-[360px] xl:w-[390px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3">
                        <div className="px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between font-heading">
                          <span className="flex items-center space-x-1.5 text-slate-700 font-bold">
                            <Layers className="w-3.5 h-3.5 text-[#0052cc]" />
                            <span>{lang === 'en' ? '6 Production Lifecycle Stages' : '6 Giai Đoạn Vòng Đời'}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-mono font-black border border-blue-100">
                            {lang === 'en' ? '18 Phases' : '18 Pha Kỹ Thuật'}
                          </span>
                        </div>

                        <div className="space-y-1.5 mt-2">
                          {stagesData.map((stg) => (
                            <Link
                              key={stg.id}
                              to={`/giai-doan/${stg.slug || STAGE_ID_TO_SLUG_MAP[stg.id] || stg.id}`}
                              className="flex items-center p-2.5 rounded-2xl transition-all duration-150 border border-transparent hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-xs group/stg relative overflow-hidden"
                            >
                              <span 
                                className="w-1.5 h-7 rounded-full mr-2.5 shrink-0 transition-transform group-hover/stg:scale-y-110" 
                                style={{ backgroundColor: stg.color }}
                              />
                              <span
                                style={{ backgroundColor: stg.color }}
                                className="w-7 h-7 rounded-xl text-white flex items-center justify-center font-black text-[11px] font-mono mr-3 shadow-2xs shrink-0 group-hover/stg:scale-105 transition-transform"
                              >
                                0{stg.id}
                              </span>
                              <div className="flex-1 min-w-0 pr-2">
                                <div className="font-extrabold text-slate-800 text-xs sm:text-[13px] line-clamp-1 group-hover/stg:text-[#0052cc] transition-colors font-heading">
                                  {lang === 'en' ? (stg.titleEn || stg.title) : stg.title}
                                </div>
                                <div className="text-[10.5px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                                  {lang === 'en' ? (stg.summaryEn || stg.summary) : stg.summary}
                                </div>
                              </div>
                              <span 
                                className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold font-mono transition-colors"
                                style={{ color: stg.color, backgroundColor: `${stg.color}18` }}
                              >
                                3 Pha
                              </span>
                            </Link>
                          ))}
                        </div>

                        <div className="pt-2.5 mt-2 border-t border-slate-100">
                          <Link
                            to="/ban-do-6-giai-doan"
                            className="w-full text-xs font-extrabold text-[#0052cc] px-3.5 py-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/90 border border-blue-100 flex items-center justify-between transition group/all"
                          >
                            <span className="flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#0052cc]" />
                              <span>{lang === 'en' ? 'Explore 6-Stage & 18-Phase Interactive Map' : 'Xem Bản đồ 6 Giai đoạn & 18 Pha'}</span>
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropdown for Hệ sinh thái - Zero-gap hover bridge */}
                  {link.hasDropdown === 'ecosystem' && (
                    <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                      <div className="w-[300px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3">
                        <div className="px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 font-heading">
                          {lang === 'en' ? 'Industrial Ecosystem' : 'Hệ Sinh Thái CCU'}
                        </div>
                        <div className="space-y-1 mt-2">
                          {[
                            { name: 'Nhà cung ứng B2B', path: '/nha-cung-ung', icon: Building2, desc: 'Hồ sơ năng lực & chế tạo' },
                            { name: 'Mạng lưới nhà máy FDI', path: '/nha-may', icon: Factory, desc: '14.200+ nhà máy sản xuất' },
                            { name: 'Khu công nghiệp', path: '/khu-cong-nghiep', icon: MapPin, desc: 'Bản đồ 480+ KCN Việt Nam' },
                            { name: 'Hội / Hiệp hội', path: '/hiep-hoi', icon: Users, desc: 'Bảo trợ & kết nối chuỗi' },
                            { name: 'Catalogue & Ấn phẩm', path: '/catalogue', icon: BookOpen, desc: 'Hồ sơ năng lực & kỷ yếu B2B' },
                            { name: 'Tổng quan hệ sinh thái', path: '/he-sinh-thai', icon: Sparkles, desc: 'Hạ tầng kết nối quốc gia' },
                          ].map((sub, sIdx) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className="flex items-center p-2.5 rounded-xl hover:bg-slate-50 transition group/sub"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052cc] group-hover/sub:bg-blue-600 group-hover/sub:text-white flex items-center justify-center mr-2.5 shrink-0 transition-colors">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-900 group-hover/sub:text-[#0052cc] transition-colors">{sub.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{sub.desc}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropdown for Dịch vụ - Zero-gap hover bridge */}
                  {link.hasDropdown === 'services' && (
                    <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                      <div className="w-[300px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3">
                        <div className="px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 font-heading">
                          {lang === 'en' ? 'B2B Services' : 'Dịch Vụ Hỗ Trợ'}
                        </div>
                        <div className="space-y-1 mt-2">
                          {[
                            { name: 'Trung tâm Dịch vụ B2B', path: '/dich-vu', icon: Briefcase, desc: 'Tổng quan 4 nhóm dịch vụ thực thi' },
                            { name: 'Gửi yêu cầu tư vấn', path: '/yeu-cau-dich-vu', icon: FileText, desc: 'Tiếp nhận & phản hồi trong 24h' },
                            { name: 'Tổ chức kết nối B2B', path: '/dich-vu/to-chuc-ket-noi', icon: Handshake, desc: 'Phiên kết nối tại KCN & Hội' },
                            { name: 'Hiện diện từ xa sự kiện', path: '/dich-vu/hien-dien-tu-xa', icon: MapPin, desc: 'Đại diện kết nối tại Ngày hội KCN' },
                            { name: 'Vật phẩm & Sự kiện', path: '/dich-vu/vat-pham-su-kien', icon: Sparkles, desc: 'Quà tặng, đồng phục, ấn phẩm' },
                            { name: 'Hồ sơ & Truyền thông DN', path: '/dich-vu/truyen-thong-doanh-nghiep', icon: Building2, desc: 'Chuẩn hóa năng lực & video' },
                          ].map((sub, sIdx) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className="flex items-center p-2.5 rounded-xl hover:bg-slate-50 transition group/sub"
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 group-hover/sub:bg-emerald-600 group-hover/sub:text-white flex items-center justify-center mr-2.5 shrink-0 transition-colors">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-900 group-hover/sub:text-emerald-700 transition-colors">{sub.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{sub.desc}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropdown for Hợp tác - Zero-gap hover bridge */}
                  {link.hasDropdown === 'partnership' && (
                    <div className="absolute right-0 top-full hidden group-hover:block pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                      <div className="w-[320px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3">
                        <div className="px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 font-heading">
                          {lang === 'en' ? 'Strategic Partnership' : 'Hợp Tác & Đồng Hành'}
                        </div>
                        <div className="space-y-1 mt-2">
                          {[
                            { name: 'Trung tâm Hợp tác Toàn diện (Hub)', path: '/hop-tac', icon: Handshake, desc: 'Cổng kết nối 7 hình thức đồng hành' },
                            { name: 'Founding Partner (Đồng hành sáng lập)', path: '/founding-partner', icon: Crown, desc: 'Đồng hành ngành hàng & cụm từ khóa' },
                            { name: 'Nhà tài trợ & Bảo trợ sự kiện', path: '/tai-tro', icon: Award, desc: 'Tài trợ các kỳ Ngày hội KCN & kỷ yếu' },
                            { name: 'Đối tác Phát triển (Referral B2B)', path: '/doi-tac-phat-trien', icon: Users, desc: 'Mạng lưới phát triển dịch vụ & hoa hồng' },
                            { name: 'Cố vấn & Hội đồng chuyên môn', path: '/hop-tac?type=ADVISOR', icon: User, desc: 'Đóng góp tiêu chuẩn & thẩm định hồ sơ' },
                            { name: 'Nhà đầu tư chiến lược', path: '/hop-tac?type=INVESTOR', icon: Briefcase, desc: 'Đầu tư phát triển hạ tầng số công nghiệp' },
                          ].map((sub, sIdx) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className="flex items-center p-2.5 rounded-xl hover:bg-slate-50 transition group/sub"
                              >
                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 group-hover/sub:bg-amber-600 group-hover/sub:text-white flex items-center justify-center mr-2.5 shrink-0 transition-colors">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-900 group-hover/sub:text-amber-700 transition-colors">{sub.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{sub.desc}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </nav>

            {/* Right Action Button: ĐĂNG NHẬP (Clean Header) */}
            <div className="hidden sm:flex items-center flex-shrink-0 space-x-2 pl-1 lg:pl-1.5 xl:pl-2">
              <button
                onClick={() => setAuthModal({ isOpen: true, tab: 'login' })}
                className="px-4 py-2 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0 shadow-sm shadow-blue-500/20 hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{lang === 'en' ? 'LOG IN' : 'ĐĂNG NHẬP'}</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-8 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto touch-scroll">
            
            {/* Quick Action Banner on Mobile */}
            <div className="grid grid-cols-2 gap-2 pb-1">
              <Link
                to="/dang-nhu-cau"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex flex-col justify-between shadow-sm active:scale-95 transition-transform"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">B2B Sourcing</span>
                <span className="text-xs font-black font-heading mt-2">Đăng Nhu Cầu</span>
              </Link>
              <Link
                to="/khu-cong-nghiep"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex flex-col justify-between shadow-sm active:scale-95 transition-transform"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">GIS 63 Tỉnh</span>
                <span className="text-xs font-black font-heading mt-2">Bản Đồ KCN</span>
              </Link>
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-1 divide-y divide-slate-100/80">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-extrabold transition font-heading ${isNavActive(link)
                    ? 'text-[#0052cc] bg-blue-50/90'
                    : 'text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </Link>
              ))}
            </div>

            {/* Quick 6 Stages Navigation in Mobile */}
            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-2.5">
              <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider block font-heading">
                {lang === 'en' ? '6 LIFECYCLE STAGES' : 'SA BÀN 6 GIAI ĐOẠN CHUỖI CUNG ỨNG'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {stagesData.map(stg => (
                  <Link
                    key={stg.id}
                    to={`/giai-doan/${stg.slug || STAGE_ID_TO_SLUG_MAP[stg.id] || stg.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-center space-x-2 font-bold text-slate-800 active:bg-blue-50 transition shadow-2xs"
                  >
                    <span
                      style={{ backgroundColor: stg.color }}
                      className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      {stg.id}
                    </span>
                    <span className="truncate text-[11.5px] font-heading">{lang === 'en' ? `Stage ${stg.id}` : `GD ${stg.id}`}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Language Switcher */}
            <div className="pt-1">
              <LanguageSwitcher variant="drawer" />
            </div>

            {/* Mobile Action Button */}
            <div className="pt-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); setAuthModal({ isOpen: true, tab: 'login' }); }}
                className="w-full py-3.5 bg-gradient-to-r from-[#0047a5] to-[#0052cc] text-white rounded-xl text-sm font-extrabold text-center shadow-md shadow-blue-500/20 whitespace-nowrap flex items-center justify-center space-x-2 font-heading active:scale-[0.98] transition-transform"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'en' ? 'Login / Register' : 'Đăng nhập / Đăng ký Doanh nghiệp'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Interactive B2B/B2G Enterprise Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        initialTab={authModal.tab}
      />
    </>
  );
}
