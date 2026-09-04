import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogIn, UserPlus, Menu, X, ChevronDown, ChevronRight,
  Sparkles, Building2, Factory, Users, Layers,
  MapPin, Compass, ArrowRight, User, Briefcase, UserCheck
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import BrandLogo from './BrandLogo';
import AuthModal from './auth/AuthModal';

export default function Navbar() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });

  // Nav links
  const navLinks = [
    {
      name: t('nav.stagesMap'),
      path: "/ban-do-6-giai-doan",
      hasDropdown: true
    },
    {
      name: t('nav.associations'),
      path: "/hoi-hiep-hoi"
    },
    {
      name: t('nav.enterprises'),
      path: "/doanh-nghiep"
    },
    {
      name: t('nav.factories'),
      path: "/nha-may"
    },
    {
      name: t('nav.industrialParks'),
      path: "/khu-cong-nghiep"
    },
    {
      name: t('nav.demands'),
      path: "/san-nhu-cau",
      isHot: true
    },
    {
      name: t('nav.recruitment') || (lang === 'en' ? 'Recruitment' : 'Tuyển Dụng'),
      path: "/tuyen-dung",
      hasRecruitmentDropdown: true
    },
  ];

  return (
    <>
      <header 
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}
        className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all w-full overflow-visible"
      >

        {/* Top Micro Announcement Bar - CENTERED, FLUID SPACING, POPPINS, MOBILE OPTIMIZED WITH LANGUAGE SWITCHER */}
        <div className="bg-[#072348] text-white py-1 sm:py-1.5 px-3 sm:px-6 flex justify-between items-center w-full font-poppins border-b border-white/5 relative z-40 overflow-visible">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative overflow-visible">
            <div className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-6 md:gap-x-8 gap-y-0.5 text-[10px] sm:text-[11.5px] md:text-[12px] font-poppins">
              <Link to="/dinh-vi-doanh-nghiep" className="text-amber-300 hover:text-white flex items-center font-semibold transition whitespace-nowrap">
                <Compass className="w-3 h-3 mr-1 flex-shrink-0" />
                <span>{t('topbar.diagnostic')}</span>
              </Link>
              <span className="text-slate-600/80">|</span>
              <Link to="/ban-do-viet-nam" className="text-sky-200 hover:text-white flex items-center font-medium transition whitespace-nowrap">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span>{t('topbar.map')}</span>
              </Link>
              <span className="text-slate-600/80">|</span>
              <Link to="/dang-nhu-cau" className="text-emerald-300 hover:text-white flex items-center transition font-semibold whitespace-nowrap">
                <span>{t('topbar.postDemand')}</span>
              </Link>
              <span className="text-slate-600/80 hidden md:inline">|</span>
              <span className="text-slate-300 font-medium hidden md:inline whitespace-nowrap">
                {t('topbar.support')} <strong className="text-white font-semibold">1900 8686</strong> – <a href="mailto:hotro@chuoicungung.com" className="text-slate-300 hover:text-white transition">hotro@chuoicungung.com</a>
              </span>
            </div>

            {/* Right: Language Switcher Button on Top Bar */}
            <div className="flex items-center pl-2 relative z-50">
              <LanguageSwitcher variant="topbar" />
            </div>
          </div>
        </div>

        {/* Main Luxury Navigation Bar */}
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-3 xl:px-6 2xl:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Left: Brand Logo (logo_only.png + Brand Name + Slogan) */}
            <Link to="/" className="flex items-center group flex-shrink-0 mr-1 lg:mr-2 xl:mr-3 2xl:mr-6">
              <BrandLogo variant="light" size="md" />
            </Link>

            {/* Center Navigation Links - 7 Tabs IN ĐẬM, CÂN ĐỐI TỶ LỆ, CHỐNG TRÀN */}
            <nav className="hidden lg:flex items-center space-x-0.5 lg:space-x-0.5 xl:space-x-1.5 2xl:space-x-2.5 flex-nowrap flex-shrink-0 font-heading">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group flex-shrink-0">
                  <Link
                    to={link.path}
                    className={`px-1 py-1.5 lg:px-1.5 lg:py-2 xl:px-2.5 xl:py-2 2xl:px-3 rounded-xl text-[10.5px] lg:text-[11px] xl:text-[12px] 2xl:text-[13px] font-black uppercase tracking-tight font-heading transition-all inline-flex items-center space-x-0.5 xl:space-x-1 whitespace-nowrap ${isActive(link.path)
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

                    {(link.hasDropdown || link.hasRecruitmentDropdown) && (
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#0052cc] transition-transform group-hover:rotate-180 flex-shrink-0 ml-0.5" />
                    )}
                  </Link>

                  {/* Dropdown for 6 Stages */}
                  {link.hasDropdown && (
                    <div className="absolute left-0 top-full hidden group-hover:block w-[360px] xl:w-[390px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
                      
                      {/* Header */}
                      <div className="px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between font-heading">
                        <span className="flex items-center space-x-1.5 text-slate-700 font-bold">
                          <Layers className="w-3.5 h-3.5 text-[#0052cc]" />
                          <span>{lang === 'en' ? '6 Production Lifecycle Stages' : '6 Giai Đoạn Vòng Đời'}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-mono font-black border border-blue-100">
                          {lang === 'en' ? '18 Phases' : '18 Pha Kỹ Thuật'}
                        </span>
                      </div>

                      {/* 6 Stages List with 6 Vivid Stage Colors */}
                      <div className="space-y-1.5 mt-2">
                        {stagesData.map((stg) => (
                          <Link
                            key={stg.id}
                            to={`/giai-doan/${stg.id}`}
                            className="flex items-center p-2.5 rounded-2xl transition-all duration-150 border border-transparent hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-xs group/stg relative overflow-hidden"
                          >
                            {/* Color Accent Indicator Strip */}
                            <span 
                              className="w-1.5 h-7 rounded-full mr-2.5 shrink-0 transition-transform group-hover/stg:scale-y-110" 
                              style={{ backgroundColor: stg.color }}
                            />

                            {/* Stage Badge with Exact Stage Color */}
                            <span
                              style={{ backgroundColor: stg.color }}
                              className="w-7 h-7 rounded-xl text-white flex items-center justify-center font-black text-[11px] font-mono mr-3 shadow-2xs shrink-0 group-hover/stg:scale-105 transition-transform"
                            >
                              0{stg.id}
                            </span>

                            {/* Title & Detail */}
                            <div className="flex-1 min-w-0 pr-2">
                              <div 
                                className="font-extrabold text-slate-800 text-xs sm:text-[13px] line-clamp-1 group-hover/stg:text-[#0052cc] transition-colors font-heading"
                              >
                                {lang === 'en' ? (stg.titleEn || stg.title) : stg.title}
                              </div>
                              <div className="text-[10.5px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                                {lang === 'en' ? (stg.summaryEn || stg.summary) : stg.summary}
                              </div>
                            </div>

                            {/* Phase Count Badge */}
                            <div className="flex items-center space-x-1 shrink-0">
                              <span 
                                className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold font-mono transition-colors"
                                style={{ 
                                  color: stg.color,
                                  backgroundColor: `${stg.color}18`
                                }}
                              >
                                {lang === 'en' ? '3 Phases' : '3 Pha'}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/stg:text-slate-600 group-hover/stg:translate-x-0.5 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Bottom Footer Action */}
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
                  )}

                  {/* Dropdown for Tuyển Dụng (2 mục: Việc Tìm Người & Người Tìm Việc) */}
                  {link.hasRecruitmentDropdown && (
                    <div className="absolute right-0 top-full hidden group-hover:block w-[330px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
                      
                      {/* Header */}
                      <div className="px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between font-heading">
                        <span className="flex items-center space-x-1.5 text-slate-700 font-bold">
                          <Users className="w-3.5 h-3.5 text-[#0052cc]" />
                          <span>{lang === 'en' ? 'Industrial Careers' : 'Cổng Nhân Lực KCN'}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-mono font-black border border-blue-100">
                          2 Phân Hệ
                        </span>
                      </div>

                      {/* 2 Items: Việc Tìm Người & Người Tìm Việc */}
                      <div className="space-y-1.5 mt-2">
                        <Link
                          to="/tuyen-dung/viec-tim-nguoi"
                          className="flex items-center p-3 rounded-2xl transition-all duration-150 border border-transparent hover:border-blue-200 hover:bg-blue-50/70 group/item"
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0052cc] flex items-center justify-center mr-3 shrink-0 font-bold">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-xs text-slate-900 group-hover/item:text-[#0052cc] transition-colors font-heading flex items-center justify-between">
                              <span>{lang === 'en' ? 'Jobs Seeking Talents' : 'Việc Tìm Người'}</span>
                              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md font-bold">4.320+</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-sans">
                              {lang === 'en' ? 'Factory & plant job openings' : 'Dành cho ứng viên tìm việc làm'}
                            </p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-[#0052cc] group-hover/item:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                        </Link>

                        <Link
                          to="/tuyen-dung/nguoi-tim-viec"
                          className="flex items-center p-3 rounded-2xl transition-all duration-150 border border-transparent hover:border-emerald-200 hover:bg-emerald-50/70 group/item"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mr-3 shrink-0 font-bold">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-xs text-slate-900 group-hover/item:text-emerald-700 transition-colors font-heading flex items-center justify-between">
                              <span>{lang === 'en' ? 'Talents Seeking Jobs' : 'Người Tìm Việc'}</span>
                              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">1.850+</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-sans">
                              {lang === 'en' ? 'Verified industrial talent profiles' : 'Dành cho nhà máy tìm nhân sự'}
                            </p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-emerald-700 group-hover/item:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                        </Link>
                      </div>

                      {/* Bottom Footer Action */}
                      <div className="pt-2.5 mt-2 border-t border-slate-100">
                        <Link
                          to="/tuyen-dung"
                          className="w-full text-xs font-extrabold text-[#0052cc] px-3.5 py-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/90 border border-blue-100 flex items-center justify-between transition group/all"
                        >
                          <span className="flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#0052cc]" />
                            <span>{lang === 'en' ? 'All Industrial Careers Hub' : 'Xem Tất Cả Việc Làm & Ứng Viên'}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Action Button: GỌN GÀNG, CÂN ĐỐI, KHÔNG TRÀN */}
            <div className="hidden sm:flex items-center flex-shrink-0 pl-1 lg:pl-1.5 xl:pl-2">
              <button
                onClick={() => setAuthModal({ isOpen: true, tab: 'login' })}
                className="px-3 py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0 hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{lang === 'en' ? 'LOG IN' : 'ĐĂNG NHẬP'}</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center">
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
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3.5 py-3 rounded-xl text-sm font-bold whitespace-nowrap ${isActive(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Quick 6 Stages Navigation in Mobile */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? '6 LIFECYCLE STAGES' : '6 GIAI ĐOẠN VÒNG ĐỜI'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {stagesData.map(stg => (
                  <Link
                    key={stg.id}
                    to={`/giai-doan/${stg.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-white rounded-xl border border-slate-100 flex items-center space-x-2 font-bold text-slate-700 whitespace-nowrap"
                  >
                    <span
                      style={{ backgroundColor: stg.color }}
                      className="w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center flex-shrink-0"
                    >
                      {stg.id}
                    </span>
                    <span className="truncate">{lang === 'en' ? `Stage ${stg.id}` : `GD ${stg.id}`}</span>
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
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold text-center shadow-xs whitespace-nowrap flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'en' ? 'Login / Register' : 'Đăng nhập / Đăng ký'}</span>
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
