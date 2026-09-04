import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ShoppingBag, MapPin, Building2, Calendar, 
  Clock, PlusCircle, ArrowRight, ChevronRight, RotateCcw, 
  DollarSign, CheckCircle2, AlertCircle, Sparkles, Award,
  Users, Eye, Lock, ShieldCheck, Heart, Share2, Layers,
  Phone, Mail, MessageSquare, X, LogIn, UserPlus
} from 'lucide-react';
import { demandsMarketplaceData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

// Mask phone number completely (no exposed digits or letters)
function maskPhone() {
  return '•••• ••• •••';
}

// Mask email completely (no exposed letters or domain)
function maskEmail() {
  return '••••••••••••••••';
}

export default function DemandsPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Modal Auth Gate State (Demo)
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    targetDemandId: null,
    targetDemandTitle: '',
    activeTab: 'login' // 'login' | 'register'
  });

  const [authForm, setAuthForm] = useState({
    role: 'Nhà cung ứng',
    emailOrPhone: '',
    password: '',
    companyName: '',
    fullName: ''
  });

  // Filter demands
  const filteredDemands = demandsMarketplaceData.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesIndustry = industryFilter === 'all' || (d.industry && d.industry.includes(industryFilter));
    return matchesSearch && matchesCategory && matchesIndustry;
  });

  // Open Auth Gate Modal when clicking a demand card
  const handleCardClick = (demand) => {
    setAuthModal({
      isOpen: true,
      targetDemandId: demand.id,
      targetDemandTitle: demand.title,
      activeTab: 'login'
    });
  };

  // Direct bypass to Demand Detail Page (Demo feature as requested)
  const handleProceedToDetail = (demandId) => {
    const idToNavigate = demandId || authModal.targetDemandId || 'dem-proser-vai-dong-phuc';
    setAuthModal({ ...authModal, isOpen: false });
    navigate(`/san-nhu-cau/${idToNavigate}`);
  };

  return (
    <div className="space-y-10 pb-20 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic B2B Sourcing Hub Visual) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Sourcing Photo with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/b2b_sourcing_demand_hero.jpg" 
            alt="B2B Sourcing Demands Marketplace"
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
              <span className="text-[#0052cc] font-bold">{lang === 'en' ? 'B2B2C Marketplace' : 'Sàn B2B2C'}</span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'B2B2C SOURCING & PROCUREMENT HUB • 1,250+ PLANTS' : 'SÀN B2B2C • NGUỒN CUNG & NHU CẦU TOÀN DIỆN'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                {lang === 'en' ? 'B2B2C Marketplace' : 'Sàn Nhu Cầu B2B2C'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {lang === 'en' ? 'Connecting Enterprise Trade' : 'Kết Nối Giao Thương Toàn Diện'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en'
                ? 'Directly connect manufacturing plants & enterprise corporations with certified industrial suppliers across Vietnam 18 phases.'
                : 'Quy tụ nhu cầu tìm nguồn cung từ các nhà máy, tập đoàn & đối tác sáng lập — Đăng tải hỏi hàng nguyên phụ liệu, bao bì, linh kiện và giải pháp công nghiệp trực tiếp.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/dang-nhu-cau"
                className="px-6 py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'en' ? 'Post Sourcing Demand' : 'Đăng Nhu Cầu Ngay'}</span>
              </Link>

              <a
                href="#danh-sach-nhu-cau"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <ShoppingBag className="w-4 h-4 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Explore Demands' : 'Xem Nhu Cầu Mở'}</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS & SEARCH/FILTER BAR (Overlapping Hero smoothly) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20 space-y-4">
        
        {/* 5 Stats Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-[#0052cc] font-mono">1.256+</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">{lang === 'en' ? 'Open Demands' : 'Nhu cầu đang mở'}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-emerald-600 font-mono">368</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">{lang === 'en' ? 'Posting Plants/Corps' : 'Nhà máy / DN đăng tin'}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-amber-600 font-mono">28</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">{lang === 'en' ? 'Sectors' : 'Nhóm ngành sản xuất'}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md">
            <span className="text-xl font-black text-purple-600 font-mono">356,8 Tỷ</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">{lang === 'en' ? 'Total Est. Value' : 'Tổng giá trị đơn hàng'}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md col-span-2 sm:col-span-1">
            <span className="text-xl font-black text-sky-600 font-mono">4.875+</span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5">{lang === 'en' ? 'Bidding Suppliers' : 'Lượt NCC quan tâm'}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'en' ? "Search demands, company name, raw materials (e.g. Kate fabric, Kaki, Uniforms, Packaging, Proser...)" : "Tìm kiếm nhu cầu, tên công ty, nguyên vật liệu (VD: Vải Kate, Kaki, Đồng phục, Proser, Bao bì, Linh kiện...)..."}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">Loại nhu cầu (Tất cả)</option>
              <option value="Sản phẩm">Sản phẩm / Vật tư</option>
              <option value="Dịch vụ">Dịch vụ sản xuất</option>
              <option value="Giải pháp">Giải pháp & Thiết bị</option>
            </select>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              <option value="all">Ngành hàng (Tất cả)</option>
              <option value="Dệt may">Dệt may & Đồng phục</option>
              <option value="Bao bì">Bao bì & In ấn</option>
              <option value="Điện tử">Điện tử & Linh kiện</option>
              <option value="Cơ khí">Cơ khí & Xây dựng</option>
            </select>

            <div className="flex items-center gap-2 col-span-2 sm:col-span-2 justify-end">
              <span className="text-xs text-slate-500">
                Hiển thị: <strong className="text-slate-900">{filteredDemands.length}</strong> nhu cầu
              </span>
              <button 
                onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setIndustryFilter('all'); }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Đặt lại</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Demands List Area */}
      <div id="danh-sach-nhu-cau" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2">

        {/* Highlight Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <span>Danh sách nhu cầu Sourcing đang mở</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Click vào thẻ để xem chi tiết & gửi báo giá
          </span>
        </div>

        {/* Demands Grid */}
        <div className="space-y-4">
          {filteredDemands.map((demand) => {
            const isProser = demand.id === 'dem-proser-vai-dong-phuc';

            return (
              <div
                key={demand.id}
                onClick={() => handleCardClick(demand)}
                className={`group relative bg-white rounded-3xl p-5 sm:p-7 transition-all duration-200 cursor-pointer border ${
                  isProser 
                    ? 'border-blue-300 ring-2 ring-blue-500/20 shadow-md hover:shadow-xl hover:border-blue-500 bg-gradient-to-br from-white via-blue-50/10 to-indigo-50/20' 
                    : 'border-slate-200/90 hover:border-blue-300 hover:shadow-lg shadow-xs'
                }`}
              >
                {/* VIP Flag if Proser / Founding Partner */}
                {isProser && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider font-heading shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    ⭐ Nhu Cầu Tiêu Biểu Từ Đối Tác Sáng Lập (Founding Partner)
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left Main Content */}
                  <div className="space-y-3 flex-1 min-w-0">
                    
                    {/* Top Row: Company Info & Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Logo or Monogram */}
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        {demand.logo ? (
                          <img 
                            src={demand.logo} 
                            alt={demand.company} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span class="font-bold text-blue-700 text-[10px]">CCU</span>';
                            }}
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      <span className="font-extrabold text-slate-900 font-heading">
                        {demand.company}
                      </span>

                      {demand.isFoundingPartner && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-0.5">
                          <Award className="w-3 h-3 text-amber-600" />
                          Founding Partner
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-mono font-bold border border-blue-100">
                        {demand.category}
                      </span>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        {demand.status || 'Đang mở'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors">
                      {demand.title}
                    </h3>

                    {/* Short Description */}
                    {demand.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {demand.description}
                      </p>
                    )}

                    {/* Demand Specifications Chips */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Ngân sách: <strong className="text-slate-900 font-bold">{demand.budget}</strong></span>
                      </div>

                      {demand.quantity && (
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Sản lượng: <strong className="text-slate-900 font-bold">{demand.quantity}</strong></span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{demand.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{demand.deadline}</span>
                      </div>
                    </div>

                    {/* Masked Contact Row (Phone & Email 100% Hidden) */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1.5 pb-0.5">
                      {/* Masked Phone */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(demand);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200 rounded-xl transition cursor-pointer shadow-2xs"
                        title="Đăng nhập để xem số điện thoại"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="text-slate-500 font-semibold text-[11px]">SĐT:</span>
                        <span className="font-mono font-black text-blue-950 text-xs sm:text-sm tracking-widest select-none">
                          •••• ••• •••
                        </span>
                      </div>

                      {/* Masked Email */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(demand);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer shadow-2xs"
                        title="Đăng nhập để xem email liên hệ"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-slate-500 font-semibold text-[11px]">Email:</span>
                        <span className="font-mono font-black text-slate-700 text-xs sm:text-sm tracking-widest select-none">
                          ••••••••••••••••
                        </span>
                      </div>
                    </div>

                    {/* Avatar Stack of Interested / Viewed Suppliers (Special Requested Feature) */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                      <div className="flex items-center -space-x-2 overflow-hidden">
                        {(demand.interestedSuppliers || []).slice(0, 5).map((sup, idx) => (
                          <div 
                            key={sup.id || idx}
                            title={`${sup.name} - ${sup.viewedAt || 'Đã xem'}`}
                            className="relative group/avatar"
                          >
                            <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-black text-[10px] bg-gradient-to-br ${sup.bgGradient || 'from-blue-600 to-indigo-600'} shadow-xs cursor-pointer transition-transform hover:scale-115 hover:z-20`}>
                              {sup.monogram || 'DN'}
                            </div>
                          </div>
                        ))}

                        {demand.totalInterestedCount && demand.totalInterestedCount > 5 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[10px] shadow-xs">
                            +{demand.totalInterestedCount - 5}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          <strong className="text-blue-700 font-bold">{demand.totalInterestedCount || 12}+ doanh nghiệp</strong> dệt may / nhà cung ứng đã click xem & quan tâm
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Right Action Button & CTA */}
                  <div className="lg:self-center shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-2 lg:pt-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(demand);
                      }}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 font-heading uppercase tracking-wider transition group-hover:scale-[1.02]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Xem SĐT & Báo Giá</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProceedToDetail(demand.id);
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition text-center"
                    >
                      Xem trang chi tiết ➔
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 🔐 AUTH GATE MODAL POPUP (WITH DEMO 1-CLICK ACCESS BUTTON) */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setAuthModal({ ...authModal, isOpen: false })}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Lock Icon & Notice */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                🔒
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase">
                Xác Thực Quyền Truy Cập B2B
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Để bảo vệ thông tin liên hệ trực tiếp (Hotline, Zalo & Bảng yêu cầu kỹ thuật) của <strong>Chuyên Gia Đồng Phục (Proser)</strong>, vui lòng đăng nhập hoặc đăng ký tài khoản Doanh nghiệp.
              </p>
            </div>

            {/* ⭐ SPECIAL PROMINENT DEMO BUTTON (AS REQUESTED BY USER) */}
            <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#0052cc] uppercase font-heading">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>CHẾ ĐỘ TRẢI NGHIỆM DEMO (DÀNH CHO KHÁCH THĂM)</span>
              </div>
              <p className="text-[11.5px] text-slate-600 leading-normal">
                Bạn có thể bỏ qua bước đăng nhập để trải nghiệm ngay đầy đủ thông tin liên hệ, hotline, Zalo và quy cách vải của Proser:
              </p>
              <button
                onClick={() => handleProceedToDetail(authModal.targetDemandId)}
                className="w-full py-3 bg-gradient-to-r from-[#0052cc] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 font-heading uppercase tracking-wider transition-all hover:scale-[1.02]"
              >
                <span>👉 Vào Trang Thông Tin Nhu Cầu Xem Chi Tiết</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Switcher: Login / Register */}
            <div className="pt-2">
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold font-heading">
                <button
                  onClick={() => setAuthModal({ ...authModal, activeTab: 'login' })}
                  className={`py-2 rounded-lg transition ${
                    authModal.activeTab === 'login' 
                      ? 'bg-white text-blue-600 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Đăng nhập tài khoản
                </button>
                <button
                  onClick={() => setAuthModal({ ...authModal, activeTab: 'register' })}
                  className={`py-2 rounded-lg transition ${
                    authModal.activeTab === 'register' 
                      ? 'bg-white text-blue-600 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Đăng ký nhanh
                </button>
              </div>

              {/* Form Content */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Đăng nhập thành công với vai trò: ${authForm.role}! Đang chuyển đến trang chi tiết nhu cầu...`);
                  handleProceedToDetail(authModal.targetDemandId);
                }}
                className="space-y-3.5 pt-4 text-xs"
              >
                {authModal.activeTab === 'register' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 font-heading">Tên công ty / Doanh nghiệp *</label>
                    <input
                      type="text"
                      placeholder="VD: Công ty TNHH Dệt May..."
                      value={authForm.companyName}
                      onChange={(e) => setAuthForm({...authForm, companyName: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">Email hoặc Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: sales@detmay.vn hoặc 090xxxxxxx"
                    value={authForm.emailOrPhone}
                    onChange={(e) => setAuthForm({...authForm, emailOrPhone: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">Mật khẩu *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">Vai trò của bạn</label>
                  <select
                    value={authForm.role}
                    onChange={(e) => setAuthForm({...authForm, role: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Nhà cung ứng">Nhà cung ứng (Supplier / Xưởng dệt)</option>
                    <option value="Nhà máy / Chủ đầu tư">Nhà máy / Khách mua (Buyer)</option>
                    <option value="Hội viên Hiệp hội">Hội viên Hiệp hội / Tổ chức</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs font-heading uppercase tracking-wider transition shadow-sm"
                >
                  {authModal.activeTab === 'login' ? 'Đăng nhập & Tiếp tục' : 'Tạo tài khoản & Tiếp tục'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
