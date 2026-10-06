import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogIn, UserPlus, Menu, X, ChevronDown, ChevronRight,
  Sparkles, Building2, Factory, Users, Layers,
  MapPin, Compass, ArrowRight, User, Briefcase, UserCheck,
  Search, Handshake, FileText, Crown, Award, BookOpen,
  Globe2, Package, Video, Radio, GraduationCap, TrendingUp, LayoutGrid, Share2,
  PlusCircle, Headphones
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

  const isSubItemActive = (subPath) => {
    if (!subPath) return false;
    const currentFull = location.pathname + location.search;
    if (subPath.includes('?')) {
      return currentFull === subPath;
    }
    if (location.pathname === subPath) {
      if (location.search && subPath === '/hop-tac') return false;
      return true;
    }
    const baseRoutes = ['/dich-vu', '/he-sinh-thai', '/hop-tac', '/nha-cung-ung', '/khu-cong-nghiep', '/nha-may', '/hiep-hoi', '/catalogue', '/ban-do-6-giai-doan', '/chuong-trinh'];
    if (!baseRoutes.includes(subPath) && location.pathname.startsWith(subPath)) {
      return true;
    }
    return false;
  };

  // Nav links matching Image 1 order with Anchor IDs
  const navLinks = [
    {
      name: lang === 'en' ? 'Suppliers' : 'Tìm nhà cung ứng',
      anchorId: "tim-nguon",
      path: "/nha-cung-ung"
    },
    {
      name: lang === 'en' ? 'B2B Demands' : 'Sàn nhu cầu B2B',
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
      name: lang === 'en' ? 'Supply Chain Expo' : 'Ngày hội chuỗi cung ứng',
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
        <div className="ccu-nav-strip text-white py-1 sm:py-1.5 px-3 sm:px-6 w-full font-poppins border-b border-white/5 relative z-40 overflow-visible">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center relative overflow-visible">
            
            {/* Center Content Links & Support Info */}
            <div className="flex items-center justify-center overflow-x-auto no-scrollbar touch-scroll py-0.5 space-x-3 sm:space-x-4 md:space-x-6 text-[10.5px] sm:text-[11.5px] md:text-[12px] font-poppins text-center pr-16 sm:pr-20 md:pr-0 font-normal">
              <Link to="/dinh-vi-doanh-nghiep" className="text-amber-300 hover:text-white flex items-center font-normal transition shrink-0 whitespace-nowrap">
                <Compass className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span>{t('topbar.diagnostic')}</span>
              </Link>
              <span className="text-slate-600/80 shrink-0">|</span>
              <Link to="/khu-cong-nghiep" className="text-sky-200 hover:text-white flex items-center font-normal transition shrink-0 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span>Bản đồ KCN</span>
              </Link>
              <span className="text-slate-600/80 shrink-0">|</span>
              <Link to="/dang-nhu-cau" className="text-emerald-300 hover:text-white flex items-center font-normal transition shrink-0 whitespace-nowrap">
                <PlusCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span>{t('topbar.postDemand')}</span>
              </Link>
              <span className="text-slate-600/80 hidden md:inline shrink-0">|</span>
              <span className="text-slate-300 font-normal hidden md:inline-flex items-center whitespace-nowrap shrink-0">
                <Headphones className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-slate-300" />
                <span>{t('topbar.support')} <span className="text-white font-normal">1900 8686</span> – <a href="mailto:hotro@chuoicungung.com" className="text-slate-300 hover:text-white transition">hotro@chuoicungung.com</a></span>
              </span>
            </div>

            {/* Right: Language Switcher Button */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-50">
              <LanguageSwitcher variant="topbar" />
            </div>

          </div>
        </div>

        {/* Main Luxury Navigation Bar */}
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-2 xl:px-4 2xl:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Left: Brand Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0 mr-1 lg:mr-1.5 xl:mr-3 2xl:mr-6">
              <BrandLogo variant="light" size="md" />
            </Link>

            {/* Center Navigation Links - 7 Tabs IN ĐẬM */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-2 flex-nowrap flex-shrink-0 font-heading">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group flex-shrink-0">
                  <Link
                    to={link.path}
                    className={`px-1 py-1.5 lg:px-1.5 lg:py-2 xl:px-2 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg xl:rounded-xl text-[10px] xl:text-[11.5px] 2xl:text-[13px] font-bold uppercase tracking-tight transition-all inline-flex items-center space-x-0.5 xl:space-x-1 whitespace-nowrap leading-normal flex-shrink-0 ${isNavActive(link)
                      ? 'text-[#006039] bg-emerald-50/90 shadow-2xs font-bold'
                      : 'text-slate-800 hover:text-[#006039] hover:bg-slate-50'
                      }`}
                  >
                    <span className="inline-block py-0.5 whitespace-nowrap">{link.name}</span>

                    {link.isHot && (
                      <span className="px-1 py-0.2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[7px] xl:text-[7.5px] font-black rounded-full uppercase tracking-wider animate-pulse shadow-xs ml-0.5 shrink-0">
                        HOT
                      </span>
                    )}

                    {link.hasDropdown && (
                      <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-slate-400 group-hover:text-[#006039] transition-transform group-hover:rotate-180 flex-shrink-0 ml-0.5" />
                    )}
                  </Link>

                  {/* Dropdown for 6 Stages - Zero-gap hover bridge */}
                  {link.hasDropdown === 'stages' && (
                    <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                      <div className="w-[360px] xl:w-[390px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3">
                        <div className="px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between font-heading">
                          <span className="flex items-center space-x-1.5 text-slate-700 font-bold">
                            <Layers className="w-3.5 h-3.5 text-[#006039]" />
                            <span>{lang === 'en' ? '6 Production Lifecycle Stages' : '6 Giai Đoạn Vòng Đời'}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006039] text-[10px] font-mono font-black border border-emerald-100">
                            {lang === 'en' ? '18 Phases' : '18 Pha Kỹ Thuật'}
                          </span>
                        </div>

                        <div className="space-y-1.5 mt-2">
                          {stagesData.map((stg) => {
                            const stageSlug = stg.slug || STAGE_ID_TO_SLUG_MAP[stg.id] || stg.id;
                            const isStageActive = location.pathname.includes(`/giai-doan/${stageSlug}`) || location.pathname === `/giai-doan/${stg.id}`;
                            return (
                              <Link
                                key={stg.id}
                                to={`/giai-doan/${stageSlug}`}
                                className={`flex items-center p-2.5 rounded-2xl transition-all duration-150 border relative overflow-hidden group/stg ${
                                  isStageActive
                                    ? 'bg-slate-100/90 border-slate-300 shadow-2xs ring-1 ring-slate-300/60'
                                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-xs'
                                }`}
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
                                  <div className="font-extrabold text-slate-800 text-xs sm:text-[13px] line-clamp-1 group-hover/stg:text-[#006039] transition-colors font-heading flex items-center justify-between">
                                    <span>{lang === 'en' ? (stg.titleEn || stg.title) : stg.title}</span>
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
                            );
                          })}
                        </div>

                        <div className="pt-2.5 mt-2 border-t border-slate-100">
                          {(() => {
                            const isMapActive = location.pathname === '/ban-do-6-giai-doan';
                            return (
                              <Link
                                to="/ban-do-6-giai-doan"
                                className={`w-full text-xs font-extrabold px-3.5 py-2.5 rounded-xl border flex items-center justify-between transition group/all ${
                                  isMapActive
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                    : 'text-[#006039] bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-100'
                                }`}
                              >
                                <span className="flex items-center space-x-1.5">
                                  <Sparkles className={`w-3.5 h-3.5 ${isMapActive ? 'text-white' : 'text-[#006039]'}`} />
                                  <span>{lang === 'en' ? 'Explore 6-Stage & 18-Phase Interactive Map' : 'Xem Bản đồ 6 Giai đoạn & 18 Pha'}</span>
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" />
                              </Link>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropdown for Hệ sinh thái - Zero-gap hover bridge */}
                  {link.hasDropdown === 'ecosystem' && (
                    <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                      <div className="w-[310px] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-2.5">
                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between font-heading">
                          <span>{lang === 'en' ? 'Industrial Ecosystem' : 'Hệ Sinh Thái CCU'}</span>
                        </div>
                        <div className="space-y-0.5 mt-1.5">
                          {[
                            { name: 'Nhà cung ứng B2B', path: '/nha-cung-ung', icon: Building2, desc: 'Hồ sơ năng lực & chế tạo' },
                            { name: 'Mạng lưới nhà máy FDI', path: '/nha-may', icon: Factory, desc: '14.200+ nhà máy sản xuất' },
                            { name: 'Khu công nghiệp', path: '/khu-cong-nghiep', icon: MapPin, desc: 'Bản đồ 480+ KCN Việt Nam' },
                            { name: 'Hội / Hiệp hội', path: '/hiep-hoi', icon: Users, desc: 'Bảo trợ & kết nối chuỗi' },
                            { name: 'Catalogue & Ấn phẩm', path: '/catalogue', icon: BookOpen, desc: 'Hồ sơ năng lực & kỷ yếu B2B' },
                            { name: 'Tổng quan hệ sinh thái', path: '/he-sinh-thai', icon: Globe2, desc: 'Hạ tầng kết nối quốc gia' },
                          ].map((sub, sIdx) => {
                            const SubIcon = sub.icon;
                            const isSubActive = isSubItemActive(sub.path);
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className={`flex items-center p-2 rounded-xl transition group/sub ${
                                  isSubActive
                                    ? 'bg-blue-50/90 text-blue-950 font-bold border border-blue-200/90 shadow-2xs'
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mr-2.5 shrink-0 transition-all duration-200 shadow-2xs ${
                                  isSubActive
                                    ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-xs'
                                    : 'bg-slate-50 border-slate-200/90 text-slate-700 group-hover/sub:bg-[#0052cc] group-hover/sub:text-white group-hover/sub:border-[#0052cc]'
                                }`}>
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-xs font-bold transition-colors flex items-center justify-between ${
                                    isSubActive ? 'text-[#0052cc] font-extrabold' : 'text-slate-900 group-hover/sub:text-[#0052cc]'
                                  }`}>
                                    <span>{sub.name}</span>
                                  </div>
                                  <div className={`text-[11px] truncate mt-0.5 ${
                                    isSubActive ? 'text-blue-700/80 font-medium' : 'text-slate-400'
                                  }`}>{sub.desc}</div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 transition-all ml-1 shrink-0 ${
                                  isSubActive
                                    ? 'text-[#0052cc] opacity-100 translate-x-0.5'
                                    : 'text-slate-300 group-hover/sub:text-[#0052cc] group-hover/sub:translate-x-0.5 opacity-0 group-hover/sub:opacity-100'
                                }`} />
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
                      <div className="w-[310px] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-2.5">
                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between font-heading">
                          <span>{lang === 'en' ? 'B2B Services' : 'Dịch Vụ Hỗ Trợ'}</span>
                        </div>
                        <div className="space-y-0.5 mt-1.5">
                          {[
                            { name: 'Trung tâm Dịch vụ B2B', path: '/dich-vu', icon: LayoutGrid, desc: 'Tổng quan 4 nhóm dịch vụ thực thi' },
                            { name: 'Gửi yêu cầu tư vấn', path: '/yeu-cau-dich-vu', icon: FileText, desc: 'Tiếp nhận & phản hồi trong 24h' },
                            { name: 'Tổ chức kết nối B2B', path: '/dich-vu/to-chuc-ket-noi', icon: Handshake, desc: 'Phiên kết nối tại KCN & Hội' },
                            { name: 'Hiện diện từ xa sự kiện', path: '/dich-vu/hien-dien-tu-xa', icon: Radio, desc: 'Đại diện kết nối tại Ngày hội KCN' },
                            { name: 'Vật phẩm & Sự kiện', path: '/dich-vu/vat-pham-su-kien', icon: Package, desc: 'Quà tặng, đồng phục, ấn phẩm' },
                            { name: 'Hồ sơ & Truyền thông DN', path: '/dich-vu/truyen-thong-doanh-nghiep', icon: Video, desc: 'Chuẩn hóa năng lực & video' },
                          ].map((sub, sIdx) => {
                            const SubIcon = sub.icon;
                            const isSubActive = isSubItemActive(sub.path);
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className={`flex items-center p-2 rounded-xl transition group/sub ${
                                  isSubActive
                                    ? 'bg-emerald-50/90 text-emerald-950 font-bold border border-emerald-200/90 shadow-2xs'
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mr-2.5 shrink-0 transition-all duration-200 shadow-2xs ${
                                  isSubActive
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'bg-slate-50 border-slate-200/90 text-slate-700 group-hover/sub:bg-emerald-600 group-hover/sub:text-white group-hover/sub:border-emerald-600'
                                }`}>
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-xs font-bold transition-colors flex items-center justify-between ${
                                    isSubActive ? 'text-emerald-800 font-extrabold' : 'text-slate-900 group-hover/sub:text-emerald-700'
                                  }`}>
                                    <span>{sub.name}</span>
                                  </div>
                                  <div className={`text-[11px] truncate mt-0.5 ${
                                    isSubActive ? 'text-emerald-700/80 font-medium' : 'text-slate-400'
                                  }`}>{sub.desc}</div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 transition-all ml-1 shrink-0 ${
                                  isSubActive
                                    ? 'text-emerald-600 opacity-100 translate-x-0.5'
                                    : 'text-slate-300 group-hover/sub:text-emerald-600 group-hover/sub:translate-x-0.5 opacity-0 group-hover/sub:opacity-100'
                                }`} />
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
                      <div className="w-[330px] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-2.5">
                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between font-heading">
                          <span>{lang === 'en' ? 'Strategic Partnership' : 'Hợp Tác & Đồng Hành'}</span>
                        </div>
                        <div className="space-y-0.5 mt-1.5">
                          {[
                            { name: 'Trung tâm Hợp tác Toàn diện (Hub)', path: '/hop-tac', icon: Handshake, desc: 'Cổng kết nối 7 hình thức đồng hành' },
                            { name: 'Founding Partner (Đồng hành sáng lập)', path: '/founding-partner', icon: Crown, desc: 'Đồng hành ngành hàng & cụm từ khóa' },
                            { name: 'Nhà tài trợ & Bảo trợ sự kiện', path: '/tai-tro', icon: Award, desc: 'Tài trợ các kỳ Ngày hội KCN & kỷ yếu' },
                            { name: 'Đối tác Phát triển (Referral B2B)', path: '/doi-tac-phat-trien', icon: Share2, desc: 'Mạng lưới phát triển dịch vụ & hoa hồng' },
                            { name: 'Cố vấn & Hội đồng chuyên môn', path: '/hop-tac?type=ADVISOR', icon: GraduationCap, desc: 'Đóng góp tiêu chuẩn & thẩm định hồ sơ' },
                            { name: 'Nhà đầu tư chiến lược', path: '/hop-tac?type=INVESTOR', icon: TrendingUp, desc: 'Đầu tư phát triển hạ tầng số công nghiệp' },
                          ].map((sub, sIdx) => {
                            const SubIcon = sub.icon;
                            const isSubActive = isSubItemActive(sub.path);
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className={`flex items-center p-2 rounded-xl transition group/sub ${
                                  isSubActive
                                    ? 'bg-amber-50/90 text-amber-950 font-bold border border-amber-200/90 shadow-2xs'
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mr-2.5 shrink-0 transition-all duration-200 shadow-2xs ${
                                  isSubActive
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                    : 'bg-slate-50 border-slate-200/90 text-slate-700 group-hover/sub:bg-amber-600 group-hover/sub:text-white group-hover/sub:border-amber-600'
                                }`}>
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-xs font-bold transition-colors flex items-center justify-between ${
                                    isSubActive ? 'text-amber-800 font-extrabold' : 'text-slate-900 group-hover/sub:text-amber-700'
                                  }`}>
                                    <span>{sub.name}</span>
                                  </div>
                                  <div className={`text-[11px] truncate mt-0.5 ${
                                    isSubActive ? 'text-amber-700/80 font-medium' : 'text-slate-400'
                                  }`}>{sub.desc}</div>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 transition-all ml-1 shrink-0 ${
                                  isSubActive
                                    ? 'text-amber-600 opacity-100 translate-x-0.5'
                                    : 'text-slate-300 group-hover/sub:text-amber-600 group-hover/sub:translate-x-0.5 opacity-0 group-hover/sub:opacity-100'
                                }`} />
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

            {/* Right Action Button: ĐĂNG NHẬP (Rolex Green Pill Button - Image 1 Style) */}
            <div className="hidden sm:flex items-center flex-shrink-0 space-x-2 pl-1 lg:pl-1.5 xl:pl-2">
              <button
                onClick={() => setAuthModal({ isOpen: true, tab: 'login' })}
                className="px-3.5 py-1.5 lg:px-3 lg:py-2 xl:px-4.5 2xl:px-5 rounded-full bg-gradient-to-b from-[#127b4b] to-[#006039] hover:from-[#158b54] hover:to-[#00472a] text-white text-[10.5px] xl:text-xs font-heading font-black tracking-wider uppercase transition-all duration-200 flex items-center space-x-1 whitespace-nowrap flex-shrink-0 shadow-sm shadow-emerald-950/25 hover:shadow-md hover:shadow-emerald-900/35 hover:-translate-y-0.5 active:scale-98"
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
                className="p-3 bg-gradient-to-br from-[#127b4b] to-[#006039] text-white rounded-2xl flex flex-col justify-between shadow-sm active:scale-95 transition-transform"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">B2B Sourcing</span>
                <span className="text-xs font-black font-heading mt-2">Đăng Nhu Cầu</span>
              </Link>
              <Link
                to="/khu-cong-nghiep"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-gradient-to-br from-[#006039] to-[#00472a] text-white rounded-2xl flex flex-col justify-between shadow-sm active:scale-95 transition-transform"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">GIS 63 Tỉnh</span>
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
                    ? 'text-[#006039] bg-emerald-50/90'
                    : 'text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{link.name}</span>
                    {link.isHot && (
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[8px] font-black rounded-full uppercase tracking-wider">
                        HOT
                      </span>
                    )}
                  </span>
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
                    className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-center space-x-2 font-bold text-slate-800 active:bg-emerald-50 transition shadow-2xs"
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

            {/* Mobile Action Button: Rolex Green Pill Style */}
            <div className="pt-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); setAuthModal({ isOpen: true, tab: 'login' }); }}
                className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#127b4b] to-[#006039] hover:from-[#158b54] hover:to-[#00472a] text-white text-sm font-extrabold text-center shadow-md shadow-emerald-950/25 whitespace-nowrap flex items-center justify-center space-x-2 font-heading active:scale-[0.98] transition-all"
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
