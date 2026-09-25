import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Building2, Factory, ArrowRight,
  ChevronRight, PhoneCall, Sparkles, Filter, Search, 
  ShoppingCart, Truck, Store, Handshake, Info, Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { EXPO_EVENTS } from '../data/expoEventsData';

export default function SupplyChainExpoPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // Selected event state
  const [selectedEventId, setSelectedEventId] = useState(EXPO_EVENTS[0].id);
  const [filterZone, setFilterZone] = useState('all'); // 'all', 'Miền Nam', 'Miền Bắc', 'Miền Trung'
  const [searchKw, setSearchKw] = useState('');

  const activeEvent = EXPO_EVENTS.find(e => e.id === selectedEventId) || EXPO_EVENTS[0];

  // Filtered events
  const filteredEvents = EXPO_EVENTS.filter(ev => {
    const matchZone = filterZone === 'all' || ev.zone === filterZone;
    const matchSearch = !searchKw.trim() || 
      ev.name.toLowerCase().includes(searchKw.toLowerCase()) || 
      ev.location.toLowerCase().includes(searchKw.toLowerCase()) ||
      ev.tagline.toLowerCase().includes(searchKw.toLowerCase());
    return matchZone && matchSearch;
  });

  const goToRegistration = (eventId) => {
    navigate('/ngay-hoi-chuoi-cung-ung/dang-ky', { state: { eventId: eventId || activeEvent.id } });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 font-sans space-y-10 sm:space-y-12">
      
      {/* ========================================================
          1. HERO HEADER SECTION (Matching modern panoramic banner)
      ======================================================== */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pt-6 sm:pt-10 lg:pt-12 pb-20 sm:pb-24 lg:pb-28 min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex items-center">
        
        {/* Right Half B2B Supply Chain Expo Background with Smooth Gradient Fade */}
        <div className="absolute top-0 right-0 w-full lg:w-[68%] xl:w-[64%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/supply_chain_expo_hero.jpg" 
            alt="Ngày hội Chuỗi Cung Ứng & Kết Nối Giao Thương B2B" 
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 md:via-[#F4F8FA]/60 lg:via-[#F4F8FA]/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-2 relative z-10 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
                <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">Ngày Hội Chuỗi Cung Ứng</span>
            </nav>

            {/* Tagline Badge with Rotating Logo */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <img 
                src="/logo_only.png" 
                alt="Logo CCU" 
                className="w-3.5 h-3.5 object-contain animate-[spin_8s_linear_infinite]" 
              />
              <span>SỰ KIỆN KẾT NỐI B2B HÀNG ĐẦU VIỆT NAM 2026 - 2027</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                Ngày Hội Chuỗi Cung Ứng
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                Tại Các Khu Công Nghiệp Trọng Điểm
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              Diễn đàn giao thương và khớp lệnh cung - cầu trực tiếp giữa hơn <strong>500+ Nhà máy FDI/DDI</strong>, Ban quản lý KCN và <strong>24.000+ Nhà cung ứng</strong> trải rộng khắp 6 Giai đoạn Vòng đời Doanh nghiệp.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => goToRegistration(activeEvent.id)}
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Handshake className="w-4 h-4" />
                <span>Đăng Ký Tham Gia Ngay</span>
              </button>

              <a
                href="#danh-sach-ngay-hoi"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>Lịch Trình & Cung Cầu</span>
              </a>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================
          FLOATING STATS BAR
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-12 sm:-mt-14 lg:-mt-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">7+ Kỳ Sự Kiện</div>
                <p className="text-[11px] text-slate-500 font-medium">Tại các KCN 3 Miền</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">500+ Nhà Máy</div>
                <p className="text-[11px] text-slate-500 font-medium">Tìm kiếm đối tác cung ứng</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">24.000+ NCC</div>
                <p className="text-[11px] text-slate-500 font-medium">18 Pha năng lực chuẩn hóa</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">Khớp Lệnh 1:1</div>
                <p className="text-[11px] text-slate-500 font-medium">B2B Matchmaking tại chỗ</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          2. INTERACTIVE EVENT EXPLORER & MATCHMAKING BOARD
      ======================================================== */}
      <div id="danh-sach-ngay-hoi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-orange-600 font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LỊCH TRÌNH CÁC NGÀY HỘI CHUỖI CUNG ỨNG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight mt-1">
              Chọn Điểm Đến & Khám Phá Nhu Cầu Cung - Cầu
            </h2>
          </div>

          {/* Region Tabs & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'Miền Nam', label: 'Miền Nam' },
                { id: 'Miền Bắc', label: 'Miền Bắc' },
                { id: 'Miền Trung', label: 'Miền Trung' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterZone(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterZone === tab.id ? 'bg-white text-[#0052cc] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm KCN, ngành hàng..."
                value={searchKw}
                onChange={(e) => setSearchKw(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* Two Columns: Event List (Left) + Selected Event Realtime Matchmaking Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Event List Cards */}
          <div className="lg:col-span-5 space-y-3.5">
            {filteredEvents.map(ev => {
              const isSelected = ev.id === selectedEventId;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-900 via-[#072348] to-[#0a3166] text-white border-blue-600 shadow-xl ring-2 ring-blue-500/30'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-sm hover:border-slate-300'
                  }`}
                >
                  {/* Top Badge Line */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {ev.date}
                    </span>
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                      {ev.zone}
                    </span>
                  </div>

                  <h3 className={`text-sm sm:text-base font-black font-heading tracking-tight leading-snug line-clamp-2 ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}>
                    {ev.name}
                  </h3>

                  <div className={`mt-2 flex items-center gap-1.5 text-xs ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-orange-500" />
                    <span className="truncate">{ev.location}</span>
                  </div>

                  <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-medium ${
                    isSelected ? 'border-white/15 text-blue-200' : 'border-slate-100 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span><strong>{ev.factoriesCount}</strong> Nhà máy</span>
                      <span>•</span>
                      <span><strong>{ev.suppliersCount}</strong> NCC</span>
                    </div>

                    <div className={`flex items-center gap-1 font-bold ${
                      isSelected ? 'text-orange-400' : 'text-[#0052cc]'
                    }`}>
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Event Live Demands Board */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-24">
            
            {/* Header of Active Event */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                  {activeEvent.date} — {activeEvent.time}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Khớp lệnh Cung - Cầu 1:1
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-950 tracking-tight">
                {activeEvent.name}
              </h2>

              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{activeEvent.location}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 leading-relaxed">
                <strong>Trọng tâm:</strong> {activeEvent.highlight}
              </p>
            </div>

            {/* Need To Buy Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-black font-heading text-emerald-800 uppercase tracking-wide">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>DANH MỤC CÁC NHÀ MÁY CẦN MUA TẠI SỰ KIỆN</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {activeEvent.needToBuy.length} mặt hàng
                </span>
              </div>

              <div className="space-y-2">
                {activeEvent.needToBuy.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px] truncate">
                        {item.item}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Đơn vị mua: <strong className="text-slate-700">{item.buyer}</strong>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-bold text-[11px] shrink-0 self-start sm:self-auto shadow-2xs font-mono">
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need To Sell Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-black font-heading text-blue-800 uppercase tracking-wide">
                  <Store className="w-4 h-4 text-[#0068FF]" />
                  <span>SẢN PHẨM & DỊCH VỤ NHÀ CUNG ỨNG ĐÃ ĐĂNG KÝ TRƯNG BÀY</span>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {activeEvent.needToSell.length} sản phẩm
                </span>
              </div>

              <div className="space-y-2">
                {activeEvent.needToSell.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-blue-50/50 border border-blue-200/70 hover:border-blue-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-slate-800 text-xs sm:text-[13px] flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{item.item}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Đơn vị cung ứng: <strong className="text-slate-700">{item.supplier}</strong>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-800 text-[11px] font-bold shrink-0 self-start sm:self-auto">
                      Đã xác thực KYC
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jump to Registration Action (Image 3 exact button) */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Bạn muốn tham gia sự kiện này để gặp gỡ trực tiếp các nhà máy?
              </div>

              {/* IMAGE 3 BUTTON: Đăng Ký Tham Gia Sự Kiện Này -> CHUYỂN QUA TRANG IMAGE 2 */}
              <button
                type="button"
                onClick={() => goToRegistration(activeEvent.id)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Đăng Ký Tham Gia Sự Kiện Này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================
            3. BOTTOM PROMO & CALL-TO-ACTION CARD
        ======================================================== */}
        <div className="rounded-3xl bg-gradient-to-r from-[#072348] via-[#092d5c] to-[#0068FF] p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/25 text-orange-300 text-xs font-bold border border-orange-400/30 uppercase font-heading">
              <Award className="w-4 h-4" />
              <span>ĐỒNG HÀNH & KẾT NỐI TOÀN DIỆN</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading">
              Sẵn Sàng Tham Gia Ngày Hội Chuỗi Cung Ứng & B2B Matchmaking?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Đăng ký tham gia miễn phí hoặc bố trí bàn trưng bày để giới thiệu năng lực sản xuất trực tiếp đến hơn 500+ Nhà máy và Ban quản lý KCN trên toàn quốc.
            </p>
          </div>

          <button
            type="button"
            onClick={() => goToRegistration(activeEvent.id)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm font-heading shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 flex items-center gap-2.5 cursor-pointer"
          >
            <span>Đăng Ký Tham Gia Ngay</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
}
