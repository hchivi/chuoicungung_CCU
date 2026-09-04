import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Award, Shield, Crown, Sparkles, CheckCircle2, Download, 
  ArrowRight, Users, Building2, Globe, HeartHandshake, FileText, Check,
  Search, Filter, MapPin, Eye, PhoneCall, Send, Star, X, Layers,
  ChevronRight, ArrowUpRight, Zap, Factory, CheckCircle, Lock, ShieldCheck,
  RotateCcw, SlidersHorizontal, ArrowLeftRight, CheckCheck
} from 'lucide-react';
import { foundingPartnersData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  STRATEGIC_FOUNDING_PARTNERS, 
  resolveStrategicSponsor, 
  VERIFIED_B2B_SUPPLIERS 
} from '../data/strategicFoundingPartners';
import SupplierCompareModal from '../components/suppliers/SupplierCompareModal';
import SupplierRequestQuoteModal from '../components/suppliers/SupplierRequestQuoteModal';
import AuthModal from '../components/auth/AuthModal';

// 24 Latin Alphabet Letters for the compact A-Z quick jump
const ALPHABET_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X'];

// 18 Technical Phases Reference
const TECHNICAL_18_PHASES = [
  { id: "all", title: "Tất cả 18 Pha kỹ thuật", stage: "Tất cả" },
  { id: "1.1", title: "1.1 Khảo sát & Định hướng", stage: "GD 01" },
  { id: "1.2", title: "1.2 Pháp lý & Thủ tục", stage: "GD 01" },
  { id: "1.3", title: "1.3 Chọn địa điểm & Mặt bằng KCN", stage: "GD 01" },
  { id: "2.1", title: "2.1 Thiết kế & Quy hoạch", stage: "GD 02" },
  { id: "2.2", title: "2.2 Thi công xây dựng", stage: "GD 02" },
  { id: "2.3", title: "2.3 Cơ điện & Hạ tầng kỹ thuật MEP", stage: "GD 02" },
  { id: "3.1", title: "3.1 Lắp đặt máy & Gia công CNC", stage: "GD 03" },
  { id: "3.2", title: "3.2 Hoàn thiện phòng sạch Cleanroom", stage: "GD 03" },
  { id: "3.3", title: "3.3 Chạy thử nghiệm thu & Kiểm định", stage: "GD 03" },
  { id: "4.1", title: "4.1 Cung ứng đầu vào, Bao bì & Quà tặng", stage: "GD 04" },
  { id: "4.2", title: "4.2 Quản lý sản xuất & QA/QC", stage: "GD 04" },
  { id: "4.3", title: "4.3 Giao nhận, Logistics & Pallet", stage: "GD 04" },
  { id: "5.1", title: "5.1 Tuyển dụng lao động & Nhân sự", stage: "GD 05" },
  { id: "5.2", title: "5.2 Suất ăn công nghiệp & Phúc lợi", stage: "GD 05" },
  { id: "5.3", title: "5.3 Đồng phục & Bảo hộ lao động (PPE)", stage: "GD 05" },
  { id: "6.1", title: "6.1 Mở rộng công suất & Xưởng Phase 2", stage: "GD 06" },
  { id: "6.2", title: "6.2 Audit ISO, ESG & Chuẩn hóa FDI", stage: "GD 06" },
  { id: "6.3", title: "6.3 Chuyển đổi số & Tự động hóa Smart Factory", stage: "GD 06" }
];

// Trending Niche Keywords from Prompt & Blueprint
const TRENDING_SEARCH_CHIPS = [
  { label: "hộp quà dọc 9:16", query: "hộp quà 9:16", tag: "Hot Trend" },
  { label: "giỏ quà bọc màng co", query: "giỏ quà màng co", tag: "Quà Tết" },
  { label: "mít sấy Nam Huy", query: "mít sấy", tag: "Nông sản" },
  { label: "đồng phục siêu thị", query: "đồng phục", tag: "Đồng phục" },
  { label: "gia công CNC 5 trục", query: "gia công CNC", tag: "Cơ khí" },
  { label: "thùng carton 5 lớp", query: "carton", tag: "Bao bì" },
  { label: "pallet gỗ xuất khẩu", query: "pallet gỗ", tag: "Logistics" },
  { label: "vận tải container lạnh", query: "container lạnh", tag: "Vận tải" },
  { label: "phòng sạch Class 1000", query: "phòng sạch", tag: "Cleanroom" }
];

export default function FoundingPartnerPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [selectedKyc, setSelectedKyc] = useState('all'); // 'all' | 'Diamond' | 'Gold' | 'Silver'
  const [selectedRegion, setSelectedRegion] = useState('all'); // 'all' | 'Miền Bắc' | 'Miền Trung' | 'Miền Nam'
  
  // Page Tab View: 'marketplace' | 'packages'
  const [pageView, setPageView] = useState('marketplace');

  // Video playback state for Spotlight
  const [isPlayingSpotlightVideo, setIsPlayingSpotlightVideo] = useState(false);

  // Comparison selection state (up to 3 suppliers)
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // RFQ Modal State
  const [quoteSupplier, setQuoteSupplier] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Auth Modal State (for unmasking phones & Odoo SSO)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Sponsorship Tier Modal
  const [selectedTierModal, setSelectedTierModal] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // 1. Dynamic Sponsored Routing: Resolve Spotlight Partner based on search query or selected phase
  const activeSpotlightPartner = useMemo(() => {
    return resolveStrategicSponsor(searchQuery, selectedPhase);
  }, [searchQuery, selectedPhase]);

  // 2. Filter Verified Suppliers Grid
  const filteredSuppliers = useMemo(() => {
    return VERIFIED_B2B_SUPPLIERS.filter(s => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q);
        const matchIndustry = s.industry.toLowerCase().includes(q);
        const matchAddress = s.address.toLowerCase().includes(q);
        const matchThumbnails = s.thumbnails.some(t => t.name.toLowerCase().includes(q));
        if (!matchName && !matchIndustry && !matchAddress && !matchThumbnails) {
          return false;
        }
      }

      // Phase filter
      if (selectedPhase !== 'all') {
        if (s.phaseId !== selectedPhase && !s.phaseId.startsWith(selectedPhase)) {
          return false;
        }
      }

      // Alphabet filter
      if (selectedLetter !== 'all') {
        const firstLetter = (s.shortName || s.name).trim()[0].toUpperCase();
        if (firstLetter !== selectedLetter) {
          return false;
        }
      }

      // KYC filter
      if (selectedKyc !== 'all') {
        if (s.kycTier !== selectedKyc) return false;
      }

      // Region filter
      if (selectedRegion !== 'all') {
        if (s.region !== selectedRegion) return false;
      }

      return true;
    });
  }, [searchQuery, selectedPhase, selectedLetter, selectedKyc, selectedRegion]);

  // Compare Checkbox Handler (Max 3)
  const handleToggleCompare = (supplier) => {
    if (selectedForCompare.some(item => item.id === supplier.id)) {
      setSelectedForCompare(selectedForCompare.filter(item => item.id !== supplier.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert("Bạn chỉ có thể so sánh tối đa 3 nhà cung ứng cùng lúc. Vui lòng bỏ bớt 1 lựa chọn.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, supplier]);
    }
  };

  // RFQ Trigger Handler
  const handleOpenQuote = (supplier) => {
    setQuoteSupplier(supplier);
    setIsQuoteModalOpen(true);
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPhase('all');
    setSelectedLetter('all');
    setSelectedKyc('all');
    setSelectedRegion('all');
  };

  const handleRegisterTier = (e) => {
    e.preventDefault();
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setSelectedTierModal(null);
      alert("Cảm ơn bạn đã gửi thông tin đăng ký Founding Partner. Ban Điều phối Quốc gia sẽ liên hệ thẩm định trong vòng 24h!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 antialiased">
      
      {/* 0. Breadcrumb & Top Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white pt-6 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <Link to="/" className="hover:text-blue-400 transition font-medium">Trang chủ</Link>
            <span>&gt;</span>
            <span className="text-amber-400 font-bold font-heading">Founding Partner & Nhà Cung Ứng Chiến Lược</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wide">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>HẠ TẦNG ĐỐI TÁC SÁNG LẬP & NHÀ THẦU B2B CHIẾN LƯỢC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                Sàn Khớp Nhu Cầu & Đối Tác Sáng Lập Quốc Gia
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Độc quyền kết nối các tổng thầu, nhà sản xuất đầu ngành được bảo trợ bởi VCCI, đạt chuẩn kiểm định KYC 3 lớp với 620+ tập đoàn FDI và 400+ KCN toàn quốc.
              </p>
            </div>

            {/* Switch Tabs: Sàn Nhà Cung Cấp vs Gói Đồng Sáng Lập */}
            <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700 self-start md:self-auto shrink-0 text-xs font-heading font-bold">
              <button
                onClick={() => setPageView('marketplace')}
                className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
                  pageView === 'marketplace'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Sàn Khớp Nhu Cầu & Spotlight</span>
              </button>
              
              <button
                onClick={() => setPageView('packages')}
                className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
                  pageView === 'packages'
                    ? 'bg-white text-slate-900 font-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Gói Tài Trợ 2024 - 2027</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {pageView === 'marketplace' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
          
          {/* 1. KHỐI 1: SEARCH & FILTER BAR (TRẠM KHỚP LỆNH TỐC ĐỘ CAO <50MS) */}
          <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Gõ từ khóa tìm nhanh: 'hộp quà dọc 9:16', 'giỏ quà màng co', 'mít sấy', 'đồng phục siêu thị', 'gia công CNC 5 trục'..."
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#0052cc] focus:bg-white rounded-2xl text-xs sm:text-sm font-medium outline-none transition shadow-inner placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs hover:bg-slate-300 transition"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Filter Reset & Status Badge */}
              <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-start">
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 flex items-center space-x-1.5 shrink-0">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Khớp lệnh: <strong className="text-blue-700">{filteredSuppliers.length}</strong> đối tác</span>
                </span>

                {(searchQuery || selectedPhase !== 'all' || selectedLetter !== 'all' || selectedKyc !== 'all' || selectedRegion !== 'all') && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center space-x-1.5 transition shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt lại</span>
                  </button>
                )}
              </div>
            </div>

            {/* Trending Niche Keywords Quick Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 font-heading">
                Từ Khóa Hot:
              </span>
              {TRENDING_SEARCH_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(chip.query)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border flex items-center space-x-1.5 ${
                    searchQuery.toLowerCase().includes(chip.query.toLowerCase())
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                  }`}
                >
                  <span>{chip.label}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/10 text-current font-mono">
                    {chip.tag}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. KHỐI 2: BLOCK ĐẶC QUYỀN FOUNDING PARTNER SPOTLIGHT (VÀNG ĐỒNG SANG TRỌNG + DYNAMIC ROUTING) */}
          <section className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/50 bg-gradient-to-br from-[#1b1404] via-[#241a06] via-[#151a24] to-[#0a1120] text-white p-6 sm:p-8 lg:p-9">
            
            {/* Ambient Gold Glow Effects */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Spotlight Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-400/20 pb-5 mb-6 relative z-10">
              <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <Crown className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                      FOUNDING PARTNER SPOTLIGHT • TOP 0 ĐỘC QUYỀN
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ✓ Đã Xác Thực VCCI
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black font-heading text-amber-300 tracking-tight mt-0.5">
                    {activeSpotlightPartner.brandTitle}
                  </h3>
                </div>
              </div>

              {/* Selection Phase Tag */}
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-slate-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  {activeSpotlightPartner.phaseName}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-400/30">
                  ★ KYC {activeSpotlightPartner.kycTier}
                </span>
              </div>
            </div>

            {/* Spotlight 2-Column Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
              
              {/* Left Column: Factory Video / Virtual Tour Player (Col 5) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30 group">
                  {isPlayingSpotlightVideo ? (
                    <iframe
                      src={`${activeSpotlightPartner.youtubeEmbed}?autoplay=1&mute=1&enablejsapi=1&rel=0&playsinline=1`}
                      title={activeSpotlightPartner.name}
                      className="w-full h-full border-0 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div 
                      onClick={() => setIsPlayingSpotlightVideo(true)}
                      className="relative w-full h-full cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={activeSpotlightPartner.videoThumbnail}
                        alt={activeSpotlightPartner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-amber-300 transition-transform">
                          <svg className="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold flex items-center space-x-1.5 border border-white/20">
                        <Factory className="w-3.5 h-3.5 text-amber-400" />
                        <span>Xem Trực Quan Nhà Máy & Dây Chuyền</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3 Visual Core Products Thumbnail Strip */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {activeSpotlightPartner.coreProducts.map((prod, pIdx) => (
                    <div key={pIdx} className="bg-white/5 rounded-xl p-2 border border-white/10 hover:border-amber-400/50 transition text-left space-y-1">
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-800">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <h5 className="text-[10px] font-bold text-slate-200 line-clamp-1">{prod.name}</h5>
                      <span className="text-[9px] text-amber-400 font-mono block truncate">{prod.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: B2B Capability Matrix (Col 7) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                    {activeSpotlightPartner.name}
                  </h4>
                  <p className="text-xs text-amber-200/90 font-medium mt-1">
                    "{activeSpotlightPartner.slogan}"
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-3">
                    {activeSpotlightPartner.description}
                  </p>
                </div>

                {/* 4-Cell Capability Metric Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Công Suất / Tháng</span>
                    <span className="text-xs font-mono font-bold text-amber-300 block truncate">{activeSpotlightPartner.capacity.split('(')[0]}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Đơn Hàng (MOQ)</span>
                    <span className="text-xs font-mono font-bold text-sky-300 block truncate">{activeSpotlightPartner.moq.split('(')[0]}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Thời Gian Mẫu</span>
                    <span className="text-xs font-mono font-bold text-emerald-300 block truncate">{activeSpotlightPartner.leadTime.split(',')[0]}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Quy Mô Nhà Xưởng</span>
                    <span className="text-xs font-mono font-bold text-purple-300 block truncate">{activeSpotlightPartner.factoryArea}</span>
                  </div>
                </div>

                {/* Certifications Badge Row */}
                <div className="flex flex-wrap gap-1.5 items-center text-[10px]">
                  <span className="text-slate-400 font-bold uppercase mr-1">Tiêu Chuẩn:</span>
                  {activeSpotlightPartner.certifications.map((cert, cIdx) => (
                    <span key={cIdx} className="px-2.5 py-0.5 rounded-md bg-amber-400/10 text-amber-300 font-mono font-bold border border-amber-400/30 flex items-center space-x-1">
                      <Check className="w-2.5 h-2.5" />
                      <span>{cert}</span>
                    </span>
                  ))}
                </div>

                {/* CTA Actions for Strategic Spotlight */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleOpenQuote(activeSpotlightPartner)}
                    className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center space-x-2 font-heading uppercase cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Yêu Cầu Báo Giá Độc Quyền</span>
                  </button>

                  <a
                    href={`tel:${activeSpotlightPartner.hotline.replace(/\s+/g, '')}`}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition flex items-center space-x-2 font-heading"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>Hotline: {activeSpotlightPartner.hotline}</span>
                  </a>

                  <a
                    href={activeSpotlightPartner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition flex items-center space-x-1.5 font-heading"
                  >
                    <span>Xem Hồ Sơ 360°</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 3 & 4. LAYOUT 2 CỘT: STICKY SIDEBAR FILTER (CỘT TRÁI) + LƯỚI NHÀ CUNG CẤP (CỘT PHẢI) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* KHỐI 3: STICKY SIDEBAR BỘ LỌC GỒM A-Z & 18 PHA KỸ THUẬT (CỘT TRÁI - COL 4) */}
            <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              
              {/* Sidebar Container */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-6">
                
                {/* Header Filter Title */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#0052cc]" />
                    <h4 className="text-sm font-black text-slate-900 font-heading tracking-tight">
                      Bộ Lọc Phân Bổ Nhà Cung Cấp
                    </h4>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition"
                  >
                    Xóa tất cả
                  </button>
                </div>

                {/* 1. Quick Alphabet Jump A-Z Bar (Gọn gàng, không tràn màn hình) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 font-heading">
                    <span>Mục Lục Chữ Cái A-Z:</span>
                    <span className="text-[11px] font-mono text-blue-600">{selectedLetter === 'all' ? 'Tất cả' : `Ký tự: ${selectedLetter}`}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setSelectedLetter('all')}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-mono font-bold transition cursor-pointer ${
                        selectedLetter === 'all'
                          ? 'bg-[#0052cc] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ALL
                    </button>
                    {ALPHABET_LETTERS.map((letter) => (
                      <button
                        key={letter}
                        onClick={() => setSelectedLetter(letter)}
                        className={`w-6 h-6 rounded-lg text-[10.5px] font-mono font-bold transition cursor-pointer flex items-center justify-center ${
                          selectedLetter === letter
                            ? 'bg-[#0052cc] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 18 Technical Phases Taxonomy Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 font-heading">
                    <span>18 Pha Kỹ Thuật Chuỗi Cung Ứng:</span>
                    <span className="text-[11px] font-mono text-slate-400">18 Pha FDI</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin text-xs">
                    {TECHNICAL_18_PHASES.map((phase) => (
                      <button
                        key={phase.id}
                        onClick={() => setSelectedPhase(phase.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                          selectedPhase === phase.id
                            ? 'bg-blue-50 text-[#0052cc] font-bold border border-blue-200 shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate pr-2">{phase.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                          {phase.stage}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. KYC 3-Tier Selector (Kim Cương / Vàng / Bạc) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 font-heading block">
                    Cấp Độ Thẩm Định KYC 3 Lớp:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-heading">
                    <button
                      onClick={() => setSelectedKyc('all')}
                      className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                        selectedKyc === 'all'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Tất cả Hạng
                    </button>
                    <button
                      onClick={() => setSelectedKyc('Diamond')}
                      className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${
                        selectedKyc === 'Diamond'
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-black'
                          : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <span>★ Kim Cương</span>
                    </button>
                    <button
                      onClick={() => setSelectedKyc('Gold')}
                      className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${
                        selectedKyc === 'Gold'
                          ? 'bg-blue-600 text-white border-blue-600 font-black'
                          : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <span>★ Hạng Vàng</span>
                    </button>
                    <button
                      onClick={() => setSelectedKyc('Silver')}
                      className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${
                        selectedKyc === 'Silver'
                          ? 'bg-slate-700 text-white border-slate-700 font-black'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span>★ Hạng Bạc</span>
                    </button>
                  </div>
                </div>

                {/* 4. Region Selector */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 font-heading block">
                    Khu Vực Địa Lý:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-heading">
                    {['all', 'Miền Bắc', 'Miền Nam'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRegion(r)}
                        className={`py-2 px-1 rounded-xl border text-center font-bold transition cursor-pointer text-[11px] ${
                          selectedRegion === r
                            ? 'bg-[#0052cc] text-white border-[#0052cc]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r === 'all' ? 'Toàn quốc' : r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* B2B Trust Shield Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 space-y-1.5">
                  <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs font-heading">
                    <ShieldCheck className="w-4 h-4 text-[#0052cc]" />
                    <span>Quy Trình Xác Thực VCCI</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    100% doanh nghiệp trong danh bạ đã được đối soát Mã số thuế, Năng lực xưởng thực tế và Chứng chỉ ISO định kỳ.
                  </p>
                </div>
              </div>
            </aside>

            {/* KHỐI 4: LƯỚI DANH SÁCH NHÀ CUNG CẤP CHUẨN B2B (CỘT PHẢI - COL 8) */}
            <main className="lg:col-span-8 space-y-5">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Danh Sách Nhà Cung Cấp Đã Thẩm Định ({filteredSuppliers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hiển thị các doanh nghiệp đạt chuẩn năng lực cung ứng theo 18 pha kỹ thuật
                  </p>
                </div>

                {/* Compare Counter Indicator */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-600">
                    Đã chọn: <strong className="text-blue-700 font-bold">{selectedForCompare.length}/3</strong> so sánh
                  </span>
                  {selectedForCompare.length > 0 && (
                    <button
                      onClick={() => setIsCompareModalOpen(true)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition font-heading flex items-center space-x-1"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Xem Bảng So Sánh</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of B2B Supplier Cards with 3 Thumbnails */}
              {filteredSuppliers.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-heading">
                    Không tìm thấy nhà cung ứng phù hợp
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Vui lòng thử tìm kiếm với các từ khóa phổ biến hơn hoặc đặt lại các bộ lọc A-Z và ngành nghề.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#0052cc] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-800 transition"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredSuppliers.map((supplier) => {
                    const isSelected = selectedForCompare.some(item => item.id === supplier.id);

                    return (
                      <div
                        key={supplier.id}
                        className={`bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${
                          isSelected 
                            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {/* Card Header: Name, KYC Badge, Tax ID */}
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                supplier.kycTier === 'Diamond'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : supplier.kycTier === 'Gold'
                                  ? 'bg-blue-100 text-[#0052cc] border border-blue-200'
                                  : 'bg-slate-200 text-slate-800'
                              }`}>
                                ★ KYC {supplier.verifiedKYC}
                              </span>
                              <span className="text-[10.5px] font-mono text-slate-400">
                                MST: {supplier.taxId}
                              </span>
                            </div>

                            {/* Checkbox for Compare */}
                            <label className="inline-flex items-center space-x-1.5 cursor-pointer select-none bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded-lg border border-slate-200 transition">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleCompare(supplier)}
                                className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-[10px] font-bold text-slate-600 font-heading">
                                So sánh
                              </span>
                            </label>
                          </div>

                          <div>
                            <h4 className="font-black text-sm text-slate-900 font-heading line-clamp-2 hover:text-[#0052cc] transition">
                              {supplier.name}
                            </h4>
                            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{supplier.province} • {supplier.region}</span>
                            </div>
                          </div>

                          <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {supplier.industry}
                          </div>
                        </div>

                        {/* Visual Showcase: 3 Small Thumbnail Images (Mô Tả Năng Lực Minh Chứng) */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                            Sản phẩm / Năng lực thực tế:
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {supplier.thumbnails.map((thumb, tIdx) => (
                              <div key={tIdx} className="group relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                                <img
                                  src={thumb.img}
                                  alt={thumb.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                                  <span className="text-[9px] text-white font-medium line-clamp-1 leading-tight">
                                    {thumb.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Capacity Metrics & Data Masking Row */}
                        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                              <span className="text-slate-400 block text-[10px]">Công suất:</span>
                              <strong className="text-slate-800 font-mono font-bold truncate block">{supplier.capacity}</strong>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                              <span className="text-slate-400 block text-[10px]">Đơn hàng tối thiểu:</span>
                              <strong className="text-slate-800 font-mono font-bold truncate block">{supplier.moq}</strong>
                            </div>
                          </div>

                          {/* Data Masking Contact Row */}
                          <div className="flex items-center justify-between text-[11px] bg-amber-50/60 border border-amber-200/60 p-2 rounded-xl">
                            <div className="flex items-center space-x-1.5 text-amber-900 font-mono font-bold">
                              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                              <span>Hotline: {supplier.maskedPhone}</span>
                            </div>
                            <button
                              onClick={() => {
                                setAuthModalTab('login');
                                setIsAuthModalOpen(true);
                              }}
                              className="text-[10px] font-bold text-[#0052cc] hover:underline flex items-center space-x-0.5"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Hiện đầy đủ</span>
                            </button>
                          </div>
                        </div>

                        {/* Dual CTA: [Yêu Cầu Báo Giá] + [Kết Nối Odoo] */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={() => handleOpenQuote(supplier)}
                            className="py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 font-heading uppercase cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Báo Giá</span>
                          </button>

                          <button
                            onClick={() => {
                              alert(`Đang khởi tạo liên kết SSO với Odoo ERP của Doanh nghiệp ${supplier.shortName}...`);
                            }}
                            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 font-heading"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                            <span>Kết Nối Odoo</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      ) : (
        /* GÓI TÀI TRỢ SÁNG LẬP FOUNDING PARTNER 2024 - 2027 SECTION */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
          
          {/* Why Founding Partners */}
          <section className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              TIÊN PHONG ĐỒNG HÀNH KIẾN TẠO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Vì Sao Cần Trở Thành Founding Partner?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founding Partners là các tập đoàn, tổ chức sản xuất và nhà cung ứng đầu ngành tiên phong bảo trợ hạ tầng kết nối chuỗi cung ứng quốc gia, đặt nền móng bền vững cho công nghiệp Việt Nam.
            </p>
          </section>

          {/* 6 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Hạ Tầng Số Quốc Gia", desc: "Xây dựng nền tảng trung lập, phi lợi nhuận phục vụ hơn 50.000 doanh nghiệp sản xuất." },
              { title: "Đặc Quyền Top 0", desc: "Ghim độc quyền Spotlight thương hiệu trên đỉnh sàn giao dịch và công cụ tìm kiếm." },
              { title: "Kết Nối 620+ Nhà Máy FDI", desc: "Ưu tiên ghép nối các gói thầu mua sắm định kỳ hàng chục tỷ đồng của các tập đoàn FDI." },
              { title: "Bảo Trợ Bởi VCCI", desc: "Được công nhận và tôn vinh trong tất cả các ấn phẩm, diễn đàn kinh tế cấp cao." },
              { title: "Quyền Truy Cập Dữ Liệu", desc: "Nhận báo cáo phân tích chuỗi cung ứng chuyên sâu và dự báo nhu cầu thị trường." },
              { title: "Hội Đồng Cố Vấn", desc: "Tham gia Ban Cố Vấn Phát Triển Hạ Tầng Số cùng các chuyên gia hàng đầu." }
            ].map((p, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] font-mono font-black flex items-center justify-center text-sm">
                  0{idx + 1}
                </div>
                <h4 className="font-black text-sm text-slate-900 font-heading">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Tiers Pricing Grid */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                Các Gói Tham Gia Đồng Sáng Lập 2024 - 2027
              </h3>
              <p className="text-xs text-slate-500">
                Áp dụng cho giai đoạn 3 năm đầu tiên xây dựng và chuẩn hóa hạ tầng số
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {foundingPartnersData.tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border-2 flex flex-col justify-between shadow-card hover:shadow-card-hover transition relative ${tier.color} ${
                    tier.isPopular ? 'ring-2 ring-amber-400' : ''
                  }`}
                >
                  {tier.isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm font-heading">
                      Gói tiêu biểu
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-black text-lg text-slate-900 font-heading">{tier.name}</h3>
                      <div className="text-xl font-extrabold text-blue-700 mt-1 font-mono">{tier.price}</div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{tier.target}</p>
                    </div>

                    <div className="border-t border-slate-200/80 pt-4 space-y-2.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-heading">
                        QUYỀN LỢI GỒM:
                      </span>
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTierModal(tier)}
                    className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition font-heading uppercase cursor-pointer ${
                      tier.isPopular
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                        : 'bg-[#0b3f6d] hover:bg-blue-900 text-white'
                    }`}
                  >
                    Đăng ký gói {tier.name} →
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 5. KHỐI 5: FLOATING BOTTOM COMPARE DOCK (THANH SO SÁNH NỔI DƯỚI ĐÁY KHI CÓ CHỌN NHÀ CUNG CẤP) */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-950/90 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-amber-400/40 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold font-heading text-amber-300">
                  So Sánh Năng Lực Cung Ứng ({selectedForCompare.length}/3)
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  {selectedForCompare.map(s => s.shortName || s.name).join(' • ')}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setSelectedForCompare([])}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition font-heading"
              >
                Xóa
              </button>

              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition font-heading uppercase flex items-center space-x-1.5 cursor-pointer"
              >
                <span>So Sánh Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Matrix Modal */}
      <SupplierCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        suppliers={selectedForCompare}
        onRequestQuote={(targetSupplier) => {
          setIsCompareModalOpen(false);
          handleOpenQuote(targetSupplier);
        }}
      />

      {/* RFQ Quote Modal */}
      <SupplierRequestQuoteModal
        supplier={quoteSupplier}
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setQuoteSupplier(null);
        }}
      />

      {/* Auth Modal for Unmasking Data */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      {/* Sponsorship Application Modal */}
      {selectedTierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase font-heading">Đăng ký tham gia</span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">Gói {selectedTierModal.name} ({selectedTierModal.price})</h3>
              </div>
              <button onClick={() => setSelectedTierModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleRegisterTier} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1 font-heading">Tên Doanh nghiệp / Tổ chức *</label>
                <input required type="text" placeholder="VD: Tập đoàn ABC" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">Người đại diện *</label>
                  <input required type="text" placeholder="Họ và tên" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">Chức vụ *</label>
                  <input required type="text" placeholder="Tổng Giám đốc / Giám đốc" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">Số điện thoại *</label>
                  <input required type="tel" placeholder="090 123 4567" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">Email doanh nghiệp *</label>
                  <input required type="email" placeholder="contact@company.com" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1 font-heading">Ghi chú hoặc mong muốn kết nối</label>
                <textarea rows="3" placeholder="Chia sẻ thêm về mục tiêu đồng hành..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"></textarea>
              </div>

              <div className="pt-3 flex justify-end space-x-3 font-heading uppercase">
                <button type="button" onClick={() => setSelectedTierModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-2 bg-[#0b3f6d] hover:bg-blue-900 text-white rounded-xl font-bold shadow-md cursor-pointer">
                  {registerSuccess ? "Đang gửi..." : "Gửi thông tin đăng ký"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
