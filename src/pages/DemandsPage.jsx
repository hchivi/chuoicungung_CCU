import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Filter, ShoppingBag, MapPin, Building2, Calendar,
  Clock, PlusCircle, ArrowRight, ChevronRight, RotateCcw,
  DollarSign, CheckCircle2, AlertCircle, Sparkles, Award,
  Users, Eye, Lock, ShieldCheck, Heart, Share2, Layers,
  Phone, Mail, MessageSquare, X, LogIn, UserPlus, Zap,
  TrendingUp, Flame, Timer, FileText, Send, Radio
} from 'lucide-react';
import { demandsMarketplaceData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import OneClickApplyModal from '../components/demands/OneClickApplyModal';
import KycPaywallModal from '../components/demands/KycPaywallModal';
import FastRfqModal from '../components/demands/FastRfqModal';
import LiveDemandToast from '../components/demands/LiveDemandToast';

export default function DemandsPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedBudgetTier, setSelectedBudgetTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Fast-RFQ Box Quick State
  const [quickRfqText, setQuickRfqText] = useState('');
  const [quickRfqPhase, setQuickRfqPhase] = useState('1.1');
  const [quickRfqAnonymous, setQuickRfqAnonymous] = useState(true);

  // Modals
  const [applyModal, setApplyModal] = useState({ isOpen: false, demand: null });
  const [paywallModal, setPaywallModal] = useState({ isOpen: false, demand: null });
  const [fastRfqModalOpen, setFastRfqModalOpen] = useState(false);

  // Filter logic
  const filteredDemands = useMemo(() => {
    return demandsMarketplaceData.filter(d => {
      // Search term filter
      const matchesSearch = !searchTerm ||
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.anonymousBuyerName && d.anonymousBuyerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.biddingCode && d.biddingCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.kcn && d.kcn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase()));

      // Phase filter
      const matchesPhase = selectedPhase === 'all' ||
        d.phaseId === selectedPhase ||
        String(d.stageId) === selectedPhase;

      // Budget tier filter
      let matchesBudget = true;
      if (selectedBudgetTier === 'under-1b') {
        matchesBudget = (d.budgetValue || 0) < 1000000000;
      } else if (selectedBudgetTier === '1b-5b') {
        matchesBudget = (d.budgetValue || 0) >= 1000000000 && (d.budgetValue || 0) <= 5000000000;
      } else if (selectedBudgetTier === 'above-5b') {
        matchesBudget = (d.budgetValue || 0) > 5000000000;
      }

      // Status filter
      let matchesStatus = true;
      if (selectedStatus === 'urgent') {
        matchesStatus = d.isUrgent === true;
      } else if (selectedStatus === 'open') {
        matchesStatus = d.status.includes('Đang mở');
      } else if (selectedStatus === 'anonymous') {
        matchesStatus = d.isAnonymousBuyer === true;
      }

      // Location filter
      const matchesLocation = selectedLocation === 'all' ||
        (d.location && d.location.toLowerCase().includes(selectedLocation.toLowerCase()));

      return matchesSearch && matchesPhase && matchesBudget && matchesStatus && matchesLocation;
    });
  }, [searchTerm, selectedPhase, selectedBudgetTier, selectedStatus, selectedLocation]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedPhase('all');
    setSelectedBudgetTier('all');
    setSelectedStatus('all');
    setSelectedLocation('all');
  };

  const handleQuickRfqSubmit = (e) => {
    e.preventDefault();
    setFastRfqModalOpen(true);
  };

  const handleOpenApply = (demand) => {
    setApplyModal({ isOpen: true, demand });
  };

  const handleOpenPaywall = (demand) => {
    setPaywallModal({ isOpen: true, demand });
  };

  return (
    <div className="space-y-0 pb-20 font-sans bg-[#F8FAFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic B2B Sourcing Hub Visual) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-24 sm:pb-28 lg:pb-36">

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
              <Link to="/" className="hover:text-[#0052cc] transition">
                {lang === 'en' ? 'Home' : 'Trang chủ'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">
                {lang === 'en' ? 'B2B2C Marketplace' : 'Sàn B2B2C'}
              </span>
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
              <button
                onClick={() => setFastRfqModalOpen(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'en' ? 'Post Sourcing Demand' : 'Đăng Nhu Cầu Ngay'}</span>
              </button>

              <a
                href="#bidding-feed"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Explore Demands' : 'Xem Nhu Cầu Mở'}</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REALTIME MACRO METRIC DASHBOARD (Đặt CHÍNH GIỮA LINE ở trên)          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-10 sm:-mt-12 lg:-mt-14">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            {/* Metric 1 */}
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">1.256+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Open Demands' : 'Nhu cầu đang mở'}</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-4 lg:pl-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">368</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Posting Plants/Corps' : 'Nhà máy / DN đăng tin'}</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-4 lg:pl-6">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">28</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Manufacturing Sectors' : 'Nhóm ngành sản xuất'}</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-4 lg:pl-6">
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">356,8 Tỷ</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Total Order Value' : 'Tổng giá trị đơn hàng'}</p>
              </div>
            </div>

            {/* Metric 5 */}
            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-4 lg:pl-6 col-span-2 sm:col-span-1">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">4.875+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Supplier Interests' : 'Lượt NCC quan tâm'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FAST-RFQ BOX & MAIN CONTENT                                            */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">

        {/* 2. FAST-RFQ BOX (Khu Vực Đăng Nhu Cầu Nhanh Trong 1 Phút) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0284c7] text-white p-5 sm:p-7 shadow-xl shadow-blue-900/20 border-2 border-blue-400/40 relative overflow-hidden">

          <div className="relative z-10 space-y-4">

            {/* Header Text */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-bold tracking-widest text-amber-300 uppercase">
                  FAST-RFQ • DÀNH CHO GIÁM ĐỐC MUA HÀNG FDI &amp; NHÀ MÁY
                </span>
                <h3 className="text-base sm:text-lg font-black font-heading text-white">
                  Bạn cần tìm nhà cung cấp? Chỉ mất 1 phút để nhận báo giá từ 15,000+ đối tác xác thực.
                </h3>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-blue-100 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Chuẩn hóa dữ liệu ERP/Odoo</span>
              </div>
            </div>

            {/* Fast-RFQ Interactive Form */}
            <form onSubmit={handleQuickRfqSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

              {/* Big Text Input */}
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  value={quickRfqText}
                  onChange={(e) => setQuickRfqText(e.target.value)}
                  placeholder="Bạn đang cần gì? (VD: May 5.000 áo đồng phục ESD, Kéo 10 cont máy móc...)"
                  className="w-full px-4 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                />
              </div>

              {/* Phase Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={quickRfqPhase}
                  onChange={(e) => setQuickRfqPhase(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="1.1">Pha 1.1 - Logistics Siêu trường</option>
                  <option value="2.1">Pha 2.1 - Tổng thầu Xây dựng EPC &amp; M&amp;E</option>
                  <option value="2.3">Pha 2.3 - Môi trường &amp; PCCC</option>
                  <option value="4.1">Pha 4.1 - Bao bì, Thùng Carton &amp; In ấn</option>
                  <option value="5.1">Pha 5.1 - Tuyển dụng &amp; Nhân sự</option>
                  <option value="5.3">Pha 5.3 - Đồng phục &amp; Bảo hộ (PPE)</option>
                  <option value="6.1">Pha 6.1 - Quà tặng, Bao bì &amp; Văn phòng phẩm</option>
                  <option value="6.3">Pha 6.3 - Số hóa, MES &amp; Tự động hóa</option>
                </select>
              </div>

              {/* Toggle Anonymous */}
              <div className="md:col-span-2 flex items-center justify-start md:justify-center bg-white/10 px-3 py-2.5 rounded-2xl border border-white/20">
                <label className="flex items-center space-x-2 text-xs font-semibold text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={quickRfqAnonymous}
                    onChange={(e) => setQuickRfqAnonymous(e.target.checked)}
                    className="rounded text-[#0052cc] focus:ring-amber-400 h-4 w-4"
                  />
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-amber-300" />
                    <span>Đấu thầu ẩn danh</span>
                  </span>
                </label>
              </div>

              {/* Dispatch Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm font-heading uppercase rounded-2xl shadow-lg shadow-amber-900/30 transition flex items-center justify-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Phát Lệnh Thu Mua</span>
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA: 2-COLUMN LAYOUT (Sidebar Filter 25% | Bidding Feed 75%) */}
      {/* ========================================================================= */}
      <section id="bidding-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ========================================================================= */}
          {/* 3. BỘ LỌC SÀN GIAO DỊCH (Smart Bidding Filter - Cột Trái Sticky 25% ~ 3 Cols) */}
          {/* ========================================================================= */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-5">

            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-5">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-[#0052cc]" />
                  <h3 className="font-extrabold text-sm text-slate-900 font-heading uppercase">
                    Bộ Lọc Săn Gói Thầu
                  </h3>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tìm kiếm từ khóa:</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tên gói thầu, nguyên liệu, KCN..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Filter by Phase (18 Pha) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Lọc theo Pha Chuỗi Cung Ứng:</label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-slate-800 cursor-pointer"
                >
                  <option value="all">Tất cả các Pha (18 Pha)</option>
                  <optgroup label="GĐ 01: Khởi tạo & Pháp lý">
                    <option value="1.1">Pha 1.1 - Logistics Siêu trường & Hải quan</option>
                    <option value="1.2">Pha 1.2 - Pháp lý & Tư vấn đầu tư</option>
                  </optgroup>
                  <optgroup label="GĐ 02: Quy hoạch & Xây dựng">
                    <option value="2.1">Pha 2.1 - Tổng thầu EPC & M&amp;E</option>
                    <option value="2.2">Pha 2.2 - Xây dựng nhà xưởng</option>
                    <option value="2.3">Pha 2.3 - Môi trường &amp; PCCC</option>
                  </optgroup>
                  <optgroup label="GĐ 04: Sản xuất & Gia công">
                    <option value="4.1">Pha 4.1 - Bao bì, In ấn & Linh kiện</option>
                    <option value="4.3">Pha 4.3 - Vận chuyển hàng hóa</option>
                  </optgroup>
                  <optgroup label="GĐ 05: Nhân sự & Hậu cần">
                    <option value="5.1">Pha 5.1 - Tuyển dụng & Đào tạo lao động</option>
                    <option value="5.3">Pha 5.3 - Đồng phục & Bảo hộ (PPE)</option>
                  </optgroup>
                  <optgroup label="GĐ 06: Vận hành & Nâng cấp">
                    <option value="6.1">Pha 6.1 - Quà tặng, Bao bì & Phúc lợi</option>
                    <option value="6.3">Pha 6.3 - Số hóa, MES & Tự động hóa</option>
                  </optgroup>
                </select>
              </div>

              {/* Filter by Budget Tier */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Quy mô Ngân sách Gói thầu:</label>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'all', label: 'Tất cả quy mô' },
                    { id: 'under-1b', label: 'Dưới 1 Tỷ VNĐ' },
                    { id: '1b-5b', label: 'Từ 1 Tỷ - 5 Tỷ VNĐ' },
                    { id: 'above-5b', label: 'Trên 5 Tỷ VNĐ (Dự án FDI lớn 🔥)' }
                  ].map((tier) => (
                    <label
                      key={tier.id}
                      className={`flex items-center space-x-2 p-2 rounded-xl border transition cursor-pointer ${selectedBudgetTier === tier.id
                        ? 'bg-blue-50 border-blue-300 text-[#0052cc] font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <input
                        type="radio"
                        name="budgetTier"
                        value={tier.id}
                        checked={selectedBudgetTier === tier.id}
                        onChange={() => setSelectedBudgetTier(tier.id)}
                        className="text-[#0052cc] focus:ring-blue-500"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter by Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Trạng thái Gói thầu:</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus(selectedStatus === 'urgent' ? 'all' : 'urgent')}
                    className={`p-2 rounded-xl border text-center transition font-semibold cursor-pointer ${selectedStatus === 'urgent'
                      ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    ⏳ Sắp đóng (Khẩn)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus(selectedStatus === 'anonymous' ? 'all' : 'anonymous')}
                    className={`p-2 rounded-xl border text-center transition font-semibold cursor-pointer ${selectedStatus === 'anonymous'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    🛡️ FDI Ẩn danh
                  </button>
                </div>
              </div>

              {/* Filter by Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khu vực / Tỉnh thành KCN:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-slate-800"
                >
                  <option value="all">Toàn quốc (Tất cả tỉnh thành)</option>
                  <option value="Đồng Nai">Đồng Nai (Amata, Long Thành, Nhơn Trạch)</option>
                  <option value="Bình Dương">Bình Dương (VSIP I, II, III, Sóng Thần)</option>
                  <option value="Bắc Ninh">Bắc Ninh (Yên Phong, Quế Võ, VSIP Bắc Ninh)</option>
                  <option value="Hải Phòng">Hải Phòng (Deep C, Tràng Duệ, Nam Đình Vũ)</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (SHTP, Tân Thuận, Hiệp Phước)</option>
                  <option value="Quảng Nam">Quảng Nam (Chu Lai, Tam Thăng)</option>
                </select>
              </div>

              {/* Help Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1 text-amber-900">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cảnh Báo Cạnh Tranh (FOMO)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Mỗi gói thầu giới hạn tối đa 6 - 10 hồ sơ. Khi đủ số lượng, hệ thống sẽ tự động đóng thầu để Hội đồng Mua hàng đánh giá.
                </p>
              </div>

            </div>

          </aside>

          {/* ========================================================================= */}
          {/* 4. LIVE BIDDING FEED (Bảng Tin Đấu Thầu Thực Chiến - Cột Phải 75% ~ 9 Cols) */}
          {/* ========================================================================= */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-4">

            {/* Feed Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base sm:text-lg font-black font-heading text-slate-900 uppercase">
                  Bảng Tin Nhu Cầu
                </h2>
              </div>
            </div>

            {/* If no demands match */}
            {filteredDemands.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto text-2xl font-bold">
                  🔍
                </div>
                <h3 className="text-base font-bold text-slate-800 font-heading">
                  Không tìm thấy gói thầu phù hợp với bộ lọc
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hãy thử mở rộng tiêu chí tìm kiếm hoặc xóa các điều kiện lọc để xem thêm các cơ hội đấu thầu khác.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-heading uppercase transition"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              /* Demands Cards List */
              <div className="space-y-4">
                {filteredDemands.map((demand) => {
                  const percentFilled = demand.progressPercent || Math.round(((demand.currentBids || 3) / (demand.maxBids || 10)) * 100);
                  const isUrgent = demand.isUrgent || demand.timeRemaining?.includes('Khẩn') || demand.timeRemaining?.includes('24h');

                  return (
                    <div
                      key={demand.id}
                      className="bg-white rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-5 sm:p-6 space-y-4 group relative overflow-hidden"
                    >
                      {/* Top Badges & Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-2">

                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0052cc] border border-blue-200 text-xs font-mono font-bold">
                            {demand.phaseBadge || `Pha ${demand.phaseId}`}
                          </span>

                          <span className="text-[11px] font-mono text-slate-400 font-bold">
                            {demand.biddingCode || `#${demand.id}`}
                          </span>

                          {demand.isAnonymousBuyer && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10.5px] font-semibold border border-indigo-200">
                              <Lock className="w-3 h-3" />
                              <span>FDI Ẩn danh</span>
                            </span>
                          )}
                        </div>

                        {/* Countdown Tag */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center space-x-1.5 ${isUrgent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                          <Timer className="w-3.5 h-3.5" />
                          <span>{demand.timeRemaining || demand.deadline}</span>
                        </div>

                      </div>

                      {/* Demand Title & Buyer */}
                      <div className="space-y-1.5">
                        <Link
                          to={`/san-nhu-cau/${demand.id}`}
                          className="text-base sm:text-lg font-black font-heading text-slate-900 group-hover:text-[#0052cc] transition-colors leading-snug block"
                        >
                          {demand.title}
                        </Link>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <div className="flex items-center space-x-1 font-semibold text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {demand.isAnonymousBuyer ? demand.anonymousBuyerName : demand.company}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{demand.kcn || demand.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Specs / Description snippet */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {demand.description}
                      </p>

                      {/* 5. FOMO Progress Bar & Dual Smart CTA */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Left: FOMO Progress & Budget */}
                        <div className="space-y-1.5 flex-1 max-w-md">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1 font-bold text-amber-600">
                              <Flame className="w-3.5 h-3.5 text-amber-500" />
                              <span>
                                Đã có {demand.currentBids || 4}/{demand.maxBids || 10} nhà cung cấp nộp hồ sơ
                              </span>
                            </div>
                            <span className="font-mono font-black text-slate-800 text-xs">
                              {demand.estBudget || demand.budget}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${percentFilled >= 70 ? 'bg-rose-500' : percentFilled >= 40 ? 'bg-amber-500' : 'bg-blue-500'
                                }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                        </div>

                        {/* Right: Dual CTA Smart Paywall */}
                        <div className="flex items-center space-x-2 shrink-0">

                          {/* Button 1: 1-Click Apply */}
                          <button
                            onClick={() => handleOpenApply(demand)}
                            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs font-heading uppercase rounded-xl shadow-md shadow-orange-500/20 transition flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5"
                          >
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>Nộp Hồ Sơ / Báo Giá</span>
                          </button>

                          {/* Button 2: Locked / KYC Paywall */}
                          <button
                            onClick={() => handleOpenPaywall(demand)}
                            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center space-x-1 cursor-pointer group/lock"
                            title="Yêu cầu KYC Lớp 2 hoặc Lớp 3"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-500 group-hover/lock:text-amber-600" />
                            <span>Mở Khóa Đấu Thầu</span>
                          </button>

                          {/* View Detail Link */}
                          <Link
                            to={`/san-nhu-cau/${demand.id}`}
                            className="p-2.5 text-slate-400 hover:text-[#0052cc] rounded-xl hover:bg-blue-50 transition"
                            title="Xem chi tiết gói thầu"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </main>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODALS & REAL-TIME TOASTS */}
      {/* ========================================================================= */}
      <OneClickApplyModal
        isOpen={applyModal.isOpen}
        demand={applyModal.demand}
        onClose={() => setApplyModal({ isOpen: false, demand: null })}
      />

      <KycPaywallModal
        isOpen={paywallModal.isOpen}
        demand={paywallModal.demand}
        onClose={() => setPaywallModal({ isOpen: false, demand: null })}
      />

      <FastRfqModal
        isOpen={fastRfqModalOpen}
        initialData={{
          title: quickRfqText,
          phaseId: quickRfqPhase,
          isAnonymous: quickRfqAnonymous
        }}
        onClose={() => setFastRfqModalOpen(false)}
      />

      {/* Zero-Reload Real-time Toast notification */}
      <LiveDemandToast />

    </div>
  );
}
