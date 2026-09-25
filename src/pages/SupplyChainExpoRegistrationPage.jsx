import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Building2, Factory, ArrowRight, CheckCircle2, 
  ChevronRight, PhoneCall, Send, Award, DollarSign, 
  Sparkles, Check, X, ShieldCheck, Tag, ShoppingCart, Truck, Layers,
  Store, Handshake, Info, ArrowLeft, Download, QrCode
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { EXPO_EVENTS, SUGGESTED_BUY_KEYWORDS, SUGGESTED_SELL_KEYWORDS } from '../data/expoEventsData';

export default function SupplyChainExpoRegistrationPage() {
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine initial event ID from state or query parameter
  const initialEventId = location.state?.eventId || searchParams.get('event') || EXPO_EVENTS[0].id;
  const [targetEventId, setTargetEventId] = useState(initialEventId);

  useEffect(() => {
    const evFromParam = searchParams.get('event') || location.state?.eventId;
    if (evFromParam && EXPO_EVENTS.some(e => e.id === evFromParam)) {
      setTargetEventId(evFromParam);
    }
  }, [searchParams, location.state]);

  // Registration Form State
  const [userRole, setUserRole] = useState('factory'); // 'factory' (Nhà máy) or 'supplier' (Nhà cung cấp)
  const [selectedBuyKw, setSelectedBuyKw] = useState(["Áo thun & Đồng phục", "Máy bơm hạt nhựa"]);
  const [customBuyNote, setCustomBuyNote] = useState('');
  const [selectedSellKw, setSelectedSellKw] = useState(["May đo đồng phục doanh nghiệp", "Đồ bảo hộ lao động PPE"]);
  const [customSellNote, setCustomSellNote] = useState('');
  
  // Package & Sponsorship Options
  const [hasBooth, setHasBooth] = useState(false); // 1,000,000 VND / Bàn trưng bày
  const [hasSponsorship, setHasSponsorship] = useState(false);
  const [sponsorAmount, setSponsorAmount] = useState('5000000'); // Default 5M
  const [customSponsor, setCustomSponsor] = useState('');

  // Contact Info
  const [contactForm, setContactForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    provinceOrKcn: ''
  });

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  const toggleBuyKeyword = (kw) => {
    if (selectedBuyKw.includes(kw)) {
      setSelectedBuyKw(selectedBuyKw.filter(k => k !== kw));
    } else {
      setSelectedBuyKw([...selectedBuyKw, kw]);
    }
  };

  const toggleSellKeyword = (kw) => {
    if (selectedSellKw.includes(kw)) {
      setSelectedSellKw(selectedSellKw.filter(k => k !== kw));
    } else {
      setSelectedSellKw([...selectedSellKw, kw]);
    }
  };

  const currentEvent = EXPO_EVENTS.find(ev => ev.id === targetEventId) || EXPO_EVENTS[0];

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.phone || !contactForm.companyName) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Tên doanh nghiệp!");
      return;
    }

    const boothFee = hasBooth ? 1000000 : 0;
    const finalSponsor = hasSponsorship ? (parseInt(customSponsor || sponsorAmount, 10) || 0) : 0;
    const totalFee = boothFee + finalSponsor;

    const receipt = {
      code: `EXPO-${Math.floor(100000 + Math.random() * 900000)}`,
      eventName: currentEvent.name,
      eventDate: currentEvent.date,
      eventLocation: currentEvent.location,
      userRole: userRole === 'factory' ? 'Nhà máy / Doanh nghiệp sản xuất' : 'Nhà cung cấp / Đơn vị dịch vụ',
      fullName: contactForm.fullName,
      phone: contactForm.phone,
      email: contactForm.email,
      companyName: contactForm.companyName,
      provinceOrKcn: contactForm.provinceOrKcn,
      buyItems: userRole === 'factory' ? [...selectedBuyKw, customBuyNote].filter(Boolean) : [],
      sellItems: userRole === 'supplier' ? [...selectedSellKw, customSellNote].filter(Boolean) : [customSellNote].filter(Boolean),
      hasBooth,
      boothFee,
      hasSponsorship,
      sponsorAmount: finalSponsor,
      totalFee
    };

    setSuccessReceipt(receipt);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] pb-24 font-sans space-y-8">
      
      {/* TOP NAVIGATION & BREADCRUMB */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="inline-flex items-center hover:opacity-80 transition shrink-0">
              <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/ngay-hoi-chuoi-cung-ung" className="hover:text-blue-600 transition truncate">
              Ngày Hội Chuỗi Cung Ứng
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#0052cc] font-bold">Cổng Đăng Ký Giao Thương</span>
          </nav>

          <Link
            to="/ngay-hoi-chuoi-cung-ung"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại Lịch trình Sự kiện</span>
            <span className="sm:hidden">Lịch trình</span>
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================
            INTERACTIVE B2B REGISTRATION FORM (IMAGE 2 UI)
        ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Header Banner (Matching Image 2 exact title & style) */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#072348] via-[#092d5c] to-[#0068FF] text-white space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/25 text-orange-300 text-xs font-bold border border-orange-400/30 uppercase font-heading">
              <Handshake className="w-4 h-4" />
              <span>CỔNG ĐĂNG KÝ GIAO THƯƠNG NGÀY HỘI CHUỖI CUNG ỨNG</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black font-heading text-white tracking-tight">
              ĐĂNG KÝ THAM GIA NGÀY HỘI & GIAN HÀNG B2B
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl">
              Chọn vai trò của doanh nghiệp bạn (Nhà máy hay Nhà cung ứng) để Ban tổ chức sắp xếp lịch gặp gỡ 1:1, bố trí bàn trưng bày và hỗ trợ tài trợ truyền thông.
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleRegistrationSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* STEP 1: CHỌN SỰ KIỆN MUỐN THAM GIA */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-black text-[#072348] font-heading uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-xs">1</span>
                CHỌN NGÀY HỘI CHUỖI CUNG ỨNG MUỐN THAM DỰ *
              </label>

              <select
                value={targetEventId}
                onChange={(e) => setTargetEventId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0068FF] text-xs sm:text-sm font-bold text-slate-800 bg-slate-50"
              >
                {EXPO_EVENTS.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.date} — {ev.name} ({ev.location})
                  </option>
                ))}
              </select>
            </div>

            {/* STEP 2: CHỌN VAI TRÒ DOANH NGHIỆP */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-black text-[#072348] font-heading uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-xs">2</span>
                BẠN LÀ NHÀ MÁY HAY NHÀ CUNG CẤP? *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role: Factory */}
                <div
                  onClick={() => setUserRole('factory')}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    userRole === 'factory'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    userRole === 'factory' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm font-heading">
                      Tôi là Nhà Máy / Doanh Nghiệp Sản Xuất
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Cần tìm nhà cung ứng vật tư, nguyên liệu, gia công, đồng phục, bảo hộ, suất ăn... và tìm đầu ra sản phẩm.
                    </div>
                  </div>
                </div>

                {/* Role: Supplier */}
                <div
                  onClick={() => setUserRole('supplier')}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    userRole === 'supplier'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    userRole === 'supplier' ? 'bg-[#0068FF] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm font-heading">
                      Tôi là Nhà Cung Cấp / Đơn Vị Dịch Vụ
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Cung cấp hàng hóa, thiết bị, may mặc đồng phục, cơ điện, logistics, kho bãi cho các nhà máy KCN.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: CHI TIẾT NHU CẦU MUA / BÁN THEO VAI TRÒ */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5">
              
              {userRole === 'factory' ? (
                <>
                  {/* Factory Section: Cần Mua gì & Cần Bán gì */}
                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      <span>Nhà máy của bạn <strong>CẦN MUA</strong> gì tại ngày hội? (Chọn các từ khóa hoặc nhập thêm):</span>
                    </label>

                    {/* Quick suggested buy keywords */}
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_BUY_KEYWORDS.map(kw => {
                        const active = selectedBuyKw.includes(kw);
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => toggleBuyKeyword(kw)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-500'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{kw}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      placeholder="Nhập thêm các vật tư / dịch vụ cần mua khác (VD: Áo thun đồng phục, máy bơm hạt nhựa, nước mắm, khuôn mẫu...)"
                      value={customBuyNote}
                      onChange={(e) => setCustomBuyNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-blue-600" />
                      <span>Sản phẩm <strong>CẦN BÁN / ĐẦU RA</strong> của nhà máy bạn (nếu có):</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nhựa ép công nghiệp, vải thành phẩm, linh kiện điện tử, hàng nông sản..."
                      value={customSellNote}
                      onChange={(e) => setCustomSellNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Supplier Section: Cần Bán gì & Giới thiệu dịch vụ */}
                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-[#0068FF]" />
                      <span>Doanh nghiệp của bạn <strong>CUNG CẤP SẢN PHẨM / DỊCH VỤ</strong> gì cho nhà máy KCN?</span>
                    </label>

                    {/* Quick suggested sell keywords */}
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SELL_KEYWORDS.map(kw => {
                        const active = selectedSellKw.includes(kw);
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => toggleSellKeyword(kw)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-[#0068FF] text-white shadow-xs'
                                : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-500'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{kw}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      placeholder="Nhập chi tiết danh mục hàng hóa / dịch vụ cung ứng (VD: Đồng phục may đo, trạm biến áp, suất ăn, pallet...)"
                      value={customSellNote}
                      onChange={(e) => setCustomSellNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </>
              )}

            </div>

            {/* STEP 4: ĐĂNG KÝ BÀN TRƯNG BÀY SẢN PHẨM & TÀI TRỢ */}
            <div className="space-y-4">
              <label className="text-xs sm:text-sm font-black text-[#072348] font-heading uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-xs">3</span>
                ĐĂNG KÝ GIAN TRƯNG BÀY HOẶC TÀI TRỢ TRUYỀN THÔNG (TÙY CHỌN)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option 1: Product Display Table (1,000,000 VND) */}
                <div 
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-2.5 cursor-pointer ${
                    hasBooth ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-400/20' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  onClick={() => setHasBooth(!hasBooth)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hasBooth}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 pointer-events-none"
                      />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Đăng Ký 01 Bàn Trưng Bày Sản Phẩm
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold font-mono">
                      1.000.000đ
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 pl-6">
                    Bao gồm 01 Bàn phủ khăn trang trọng (1.2m x 0.6m), 02 ghế, bảng tên doanh nghiệp và standee giới thiệu catalogue sản phẩm.
                  </p>
                </div>

                {/* Option 2: Event Sponsorship */}
                <div 
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-2.5 ${
                    hasSponsorship ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-400/20' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label 
                      onClick={() => setHasSponsorship(!hasSponsorship)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={hasSponsorship}
                        onChange={() => setHasSponsorship(!hasSponsorship)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Đồng Hành Tài Trợ Sự Kiện
                      </span>
                    </label>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold font-mono">
                      VIP Partner
                    </span>
                  </div>

                  {hasSponsorship ? (
                    <div className="pl-6 space-y-2 pt-1">
                      <div className="flex flex-wrap gap-2">
                        {["2000000", "5000000", "10000000"].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setSponsorAmount(val);
                              setCustomSponsor('');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              sponsorAmount === val && !customSponsor
                                ? 'bg-purple-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-700 hover:border-purple-400'
                            }`}
                          >
                            {(parseInt(val, 10)).toLocaleString('vi-VN')}đ
                          </button>
                        ))}
                      </div>

                      <input
                        type="number"
                        placeholder="Hoặc nhập mức tài trợ mong muốn (VNĐ)..."
                        value={customSponsor}
                        onChange={(e) => setCustomSponsor(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />

                      <div className="text-[11px] text-purple-800 font-medium bg-purple-100/60 p-2 rounded-xl">
                        ★ Quyền lợi: Đặt Logo VIP trên Backdrop chính, VIP Desk kết nối lãnh đạo KCN & Bài viết truyền thông đa kênh.
                      </div>
                    </div>
                  ) : (
                    <p 
                      onClick={() => setHasSponsorship(true)}
                      className="text-xs text-slate-500 pl-6 cursor-pointer hover:text-slate-700"
                    >
                      Nhấp vào đây nếu doanh nghiệp muốn đồng hành tài trợ và nâng cao vị thế thương hiệu tại sự kiện.
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* STEP 5: THÔNG TIN LIÊN HỆ ĐẠI DIỆN */}
            <div className="space-y-4">
              <label className="text-xs sm:text-sm font-black text-[#072348] font-heading uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-xs">4</span>
                THÔNG TIN DOANH NGHIỆP & NGƯỜI ĐẠI DIỆN
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Họ và tên người đại diện *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Số điện thoại / Zalo *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0912 345 678"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email nhận thư mời VIP</label>
                  <input
                    type="email"
                    placeholder="VD: contact@company.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tên Doanh nghiệp / Nhà máy *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Công ty TNHH Sản Xuất May Mặc & Cơ Khí ABC"
                    value={contactForm.companyName}
                    onChange={(e) => setContactForm({ ...contactForm, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">KCN / Tỉnh thành hoạt động</label>
                  <input
                    type="text"
                    placeholder="VD: KCN Hàm Kiệm 1 / Bình Thuận"
                    value={contactForm.provinceOrKcn}
                    onChange={(e) => setContactForm({ ...contactForm, provinceOrKcn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* TOTAL ESTIMATION & SUBMIT BUTTON */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-orange-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-600">Tổng chi phí đăng ký:</div>
                  <div className="text-xl sm:text-2xl font-black text-orange-600 font-heading">
                    {hasBooth || hasSponsorship ? (
                      `${((hasBooth ? 1000000 : 0) + (hasSponsorship ? (parseInt(customSponsor || sponsorAmount, 10) || 0) : 0)).toLocaleString('vi-VN')} VNĐ`
                    ) : (
                      "MIỄN PHÍ VÉ THAM DỰ B2B"
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {hasBooth && "• Đã bao gồm 01 Bàn trưng bày sản phẩm (1.000.000đ)"}
                    {hasSponsorship && ` • Đã bao gồm gói tài trợ (${(parseInt(customSponsor || sponsorAmount, 10) || 0).toLocaleString('vi-VN')}đ)`}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm sm:text-base font-heading shadow-xl shadow-orange-500/25 hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
                >
                  <Send className="w-5 h-5" />
                  <span>XÁC NHẬN ĐĂNG KÝ THAM GIA</span>
                </button>
              </div>

              <div className="text-center text-xs text-slate-400">
                Hotline hỗ trợ Ban Tổ Chức: <strong className="text-slate-600">1900 8686</strong> (24/7) — Zalo Ban Thư Ký: <strong className="text-slate-600">0903 041 286</strong>
              </div>

            </div>

          </form>

        </div>

      </div>

      {/* ========================================================
          SUCCESS CONFIRMATION MODAL WITH RECEIPT / PASS
      ======================================================== */}
      {showSuccessModal && successReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center space-y-2 relative">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black font-heading tracking-tight">
                ĐĂNG KÝ THÀNH CÔNG!
              </h3>
              <p className="text-xs text-emerald-100">
                Mã xác nhận tham dự: <strong className="text-white text-sm bg-emerald-800/60 px-2 py-0.5 rounded-md font-mono">{successReceipt.code}</strong>
              </p>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-700">
              
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-[#072348] text-sm font-heading">
                  {successReceipt.eventName}
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ngày: <strong>{successReceipt.eventDate}</strong></span>
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Địa điểm: {successReceipt.eventLocation}</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <div>Đại diện: <strong>{successReceipt.fullName}</strong> ({successReceipt.phone})</div>
                <div>Doanh nghiệp: <strong>{successReceipt.companyName}</strong></div>
                <div>Vai trò: <strong>{successReceipt.userRole}</strong></div>
                
                {successReceipt.buyItems.length > 0 && (
                  <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl mt-1">
                    <strong>Nhu cầu cần mua:</strong> {successReceipt.buyItems.join(', ')}
                  </div>
                )}

                {successReceipt.sellItems.length > 0 && (
                  <div className="text-blue-700 bg-blue-50 p-2 rounded-xl mt-1">
                    <strong>Sản phẩm cung cấp:</strong> {successReceipt.sellItems.join(', ')}
                  </div>
                )}
              </div>

              {/* Payment Info if booth/sponsor */}
              {successReceipt.totalFee > 0 ? (
                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                    <span>Tổng phụ phí cần thanh toán:</span>
                    <span className="text-sm font-black text-orange-600">
                      {successReceipt.totalFee.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-800 leading-relaxed">
                    Ban tổ chức sẽ liên hệ qua SĐT/Zalo <strong>{successReceipt.phone}</strong> trong vòng 24h để gửi thư mời chính thức và hướng dẫn bố trí gian hàng.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-center font-medium">
                  Vé tham dự B2B miễn phí đã được ghi nhận. Ban tổ chức sẽ gửi QR Code vé mời qua Zalo cho bạn.
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/ngay-hoi-chuoi-cung-ung');
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#0068FF] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Đã hiểu & Về trang sự kiện
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
