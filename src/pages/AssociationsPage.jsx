import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Users, MapPin, Globe, Calendar, 
  ArrowRight, ChevronRight, PlusCircle, RotateCcw, Sparkles,
  Building2, Phone, Mail, ShieldCheck, CheckCircle2, Award,
  Compass, Play, Layers, ExternalLink, Briefcase, ChevronDown,
  TrendingUp, Check, Landmark, ArrowUpRight, Handshake, Scale,
  BarChart3, FileText, X, Rocket, Cpu, Database
} from 'lucide-react';
import associationsList from '../data/associations.json';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssociationsPage() {
  const { t, lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const filtered = useMemo(() => {
    return associationsList.filter(a => {
      const matchText = (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (a.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (a.tagline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (a.president || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRegion = selectedRegion === 'all' || a.region === selectedRegion;
      return matchText && matchRegion;
    });
  }, [searchTerm, selectedRegion]);

  return (
    <div className="space-y-10 pb-20 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic Summit Visual) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Summit Photo with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/association_summit_hero.jpg" 
            alt="Vietnam International Trade Summit"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 lg:via-[#F4F8FA]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-5">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">{lang === 'en' ? 'Trade Associations' : 'Hội / Hiệp Hội / Tổ Chức'}</span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'OFFICIAL VIETNAM ASSOCIATIONS DIRECTORY' : 'MẠNG LƯỚI HỘI & HIỆP HỘI VIỆT NAM'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                {lang === 'en' ? 'Connecting Leaders' : 'Kết Nối Tổ Chức'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {lang === 'en' ? 'Inspiring Tomorrow' : 'Kiến Tạo Chuỗi Giá Trị'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en'
                ? 'We unite 71+ certified national trade associations, empowering B2B matchmaking, supply chain synergies, and industrial prosperity.'
                : 'Quy tụ mạng lưới 71+ Hội, Hiệp hội và Tổ chức ngành nghề quốc gia — Cầu nối xúc tiến thương mại, hỗ trợ pháp lý và mở rộng chuỗi cung ứng công nghiệp bền vững.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#danh-sach-hiep-hoi"
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <span>{lang === 'en' ? 'Our Directory' : 'Khám Phá Danh Bạ'}</span>
              </a>

              <button
                onClick={() => setShowVideoModal(true)}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <Play className="w-3.5 h-3.5 fill-[#0052cc] text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Watch Overview' : 'Xem Giới Thiệu'}</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR (Đặt CHÍNH GIỮA LINE ở trên, đưa lên 1 chút) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">71+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Trade Associations' : 'Hội & Hiệp hội chính thức'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">12.500+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Member Enterprises' : 'Doanh nghiệp hội viên'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">100%</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Legal Verification' : 'Xác thực pháp nhân & ĐKKD'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">63</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Provinces Served' : 'Tỉnh thành toàn quốc'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. WHAT WE DO: 4 PILLAR CARDS (Màu Chủ Đạo Của Web - Gọn Gàng) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 pt-2">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-black text-[#0052cc] font-heading uppercase tracking-wider">
              {lang === 'en' ? 'WHAT WE DO' : 'VAI TRÒ & SỨ MỆNH'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-950 tracking-tight">
              {lang === 'en' ? 'Solutions that Drive Real Impact' : 'Giải Pháp Kết Nối Chuỗi Cung Ứng Toàn Diện'}
            </h3>
          </div>

          <p className="text-xs text-slate-500 max-w-md font-normal md:text-right">
            Từ định hướng chiến lược đến thực thi kết nối B2B toàn diện cho cộng đồng doanh nghiệp.
          </p>
        </div>

        {/* 4 Compact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc]/50 transition flex flex-col justify-between space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-sm text-slate-950 font-heading">Xúc Tiến Thương Mại</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Tổ chức hội chợ, kết nối giao thương B2B trực tiếp và mở rộng mạng lưới phân phối.
              </p>
            </div>
            <a href="#danh-sach-hiep-hoi" className="text-xs font-bold text-[#0052cc] hover:text-[#0041a8] flex items-center space-x-1 font-heading pt-1">
              <span>Tìm hiểu thêm</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc]/50 transition flex flex-col justify-between space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-sm text-slate-950 font-heading">Tư Vấn & Pháp Lý</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Hỗ trợ cơ chế chính sách, tiêu chuẩn ISO/EIA và bảo vệ quyền lợi hội viên.
              </p>
            </div>
            <a href="#danh-sach-hiep-hoi" className="text-xs font-bold text-[#0052cc] hover:text-[#0041a8] flex items-center space-x-1 font-heading pt-1">
              <span>Tìm hiểu thêm</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-indigo-400 transition flex flex-col justify-between space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-sm text-slate-950 font-heading">Chuỗi Cung Ứng 18 Pha</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Liên kết chuỗi sản xuất từ hạ tầng KCN, xưởng đến logistic và thương mại hóa.
              </p>
            </div>
            <Link to="/ban-do-6-giai-doan" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 font-heading pt-1">
              <span>Xem 18 pha</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-sky-400 transition flex flex-col justify-between space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-sm text-slate-950 font-heading">Số Hóa & Dữ Liệu</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Minh bạch danh bạ doanh nghiệp, năng lực cốt lõi và thông tin liên hệ 100%.
              </p>
            </div>
            <Link to="/doanh-nghiep" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 font-heading pt-1">
              <span>Xem nhà cung ứng</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT SECTION (Màu Chủ Đạo Của Web) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 lg:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black text-[#0052cc] font-heading uppercase tracking-wider">
                  VỀ CHUOICUNGUNG.VN
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-950 leading-tight">
                  Đối Tác Tin Cậy Cho <span className="bg-gradient-to-r from-[#0047a5] to-[#0066d6] bg-clip-text text-transparent">Phát Triển Bền Vững</span>
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Chúng tôi kết hợp dữ liệu số hóa, mạng lưới hiệp hội và chuỗi 18 pha để khai phóng các cơ hội hợp tác mới, nâng cao vị thế cạnh tranh cho cộng đồng doanh nghiệp Việt Nam.
              </p>

              {/* 3 Checkmark Bullets */}
              <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0052cc] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Tiếp cận trực tiếp Ban thường vụ và người phụ trách chính thức</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0052cc] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Liên kết chuỗi cung ứng sản xuất 18 pha toàn diện trên 63 tỉnh thành</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0052cc] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Hỗ trợ xúc tiến thương mại, hội nghị chuyên đề và xuất khẩu quốc tế</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  to="/dang-nhu-cau"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#0047a5] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-900/20 transition font-heading"
                >
                  <span>Đăng Ký Liên Kết Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Meeting Image Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 aspect-16/10 group">
                <img 
                  src="/images/association_b2b_meeting.jpg" 
                  alt="Official Association Board Meeting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                {/* Floating Badge */}
                <div className="absolute bottom-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-white/50 shadow-lg space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-[#0052cc] font-mono">18+</span>
                    <ArrowUpRight className="w-4 h-4 text-[#0052cc]" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-900 font-heading">Pha Nghiệp Vụ Chuỗi Cung Ứng</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DIRECTORY LISTING (ĐÃ BỎ DROPDOWN SELECT IMAGE 3 - LỌC CHUẨN XÁC) */}
      {/* ========================================================================= */}
      <section id="danh-sach-hiep-hoi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        
        {/* Search Bar - Removed Select Dropdown */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'en' ? "Search associations by name, industry, representative, address..." : "Tìm kiếm theo tên hiệp hội, ngành nghề, người đại diện, địa chỉ..."}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] transition"
            />
          </div>

          {/* Quick Filter Pills (Chính Xác 100%) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">{lang === 'en' ? 'Filter:' : 'Lọc nhanh:'}</span>
              {['all', 'Miền Bắc', 'Miền Nam', 'Miền Trung', 'Toàn quốc'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                    selectedRegion === reg
                      ? 'bg-[#0052cc] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {reg === 'all' ? (lang === 'en' ? 'All' : 'Tất cả') : reg}
                </button>
              ))}
            </div>

            <div className="text-slate-500 font-medium text-[11px]">
              {lang === 'en' ? 'Found ' : 'Tìm thấy '}<strong className="text-slate-950 font-bold">{filtered.length}</strong> {lang === 'en' ? 'associations' : 'tổ chức / hiệp hội'}
            </div>
          </div>
        </div>

        {/* Association Cards Grid: Logo Nhỏ + Tên Nằm Cạnh + Màu Chủ Đạo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((assoc) => {
            const initial = (assoc.name || 'H').charAt(0).toUpperCase();

            return (
              <div
                key={assoc.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-[#0052cc]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3 group relative"
              >
                
                {/* Header: Logo Nhỏ + Tên Nằm Cạnh + Badge Vùng Miền */}
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                      {/* Logo Nhỏ Gọn (w-10 h-10) */}
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-2xs group-hover:border-[#0052cc]/50 transition-colors">
                        {assoc.logo ? (
                          <img 
                            src={assoc.logo} 
                            alt={assoc.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain" 
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span 
                          style={{ display: assoc.logo ? 'none' : 'flex' }}
                          className="w-full h-full rounded-lg bg-[#0052cc] text-white font-black text-sm items-center justify-center font-heading"
                        >
                          {initial}
                        </span>
                      </div>

                      {/* Tên Tổ Chức Nằm Cạnh Logo */}
                      <Link 
                        to={`/hoi-hiep-hoi/${assoc.id}`}
                        className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-[#0052cc] transition line-clamp-2 font-heading leading-tight"
                        title={assoc.name}
                      >
                        {assoc.name}
                      </Link>
                    </div>

                    {/* Badge Vùng Miền (Chính xác theo khu vực thực tế) */}
                    <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-bold rounded-md border border-blue-200/60 font-mono shrink-0">
                      {assoc.region || 'Toàn quốc'}
                    </span>
                  </div>

                  {/* Mô Tả Ngắn */}
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {assoc.description || assoc.tagline}
                  </p>
                </div>

                {/* Địa Chỉ & Số Điện Thoại */}
                <div className="space-y-1.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                  {assoc.address && (
                    <div className="flex items-start space-x-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{assoc.address}</span>
                    </div>
                  )}
                  {assoc.phone && (
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-800 font-semibold">{assoc.phone}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Hội Viên & Link Chi Tiết */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                    <Users className="w-3.5 h-3.5 text-[#0052cc]" />
                    <span><strong>{assoc.membersCount || 200}+</strong> hội viên</span>
                  </div>

                  <Link
                    to={`/hoi-hiep-hoi/${assoc.id}`}
                    className="text-xs font-bold text-[#0052cc] group-hover:text-[#003d8f] flex items-center space-x-1 font-heading group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. PARTNER LOGO TICKER (Bottom Ribbon) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="border-t border-slate-200/80 pt-6 pb-2 text-center space-y-3">
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest font-heading">
            ĐỒNG HÀNH CÙNG CÁC TỔ CHỨC & HIỆP HỘI HÀNG ĐẦU VIỆT NAM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VCCI VIETNAM</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">TRANG VÀNG B2B</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VASEP THỦY SẢN</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VITAS DỆT MAY</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VNREA BẤT ĐỘNG SẢN</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VLA LOGISTICS</span>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#0052cc]">
              <Play className="w-5 h-5 fill-[#0052cc]" />
              <h4 className="font-bold text-base font-heading">Giới Thiệu Mạng Lưới Hội / Hiệp Hội</h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mạng lưới Hội / Hiệp Hội trên ChuoiCungUng.vn đóng vai trò là hạt nhân kết nối chuỗi cung ứng sản xuất 18 pha tại Việt Nam. Nền tảng hỗ trợ các tổ chức số hóa danh bạ hội viên, kết nối cơ hội giao thương B2B và tham vấn chính sách phát triển kinh tế bền vững.
            </p>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowVideoModal(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#0047a5] to-[#0052cc] text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-900/20"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
