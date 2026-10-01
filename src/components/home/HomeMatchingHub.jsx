import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Factory, Handshake, Calendar, MapPin, Users, ArrowRight, 
  CheckCircle2, ShieldCheck, ChevronRight, Gift, Shirt, 
  Megaphone, ExternalLink, Mail, Phone, Clock, Award, Star, X, Check,
  Send, Compass, ArrowUpRight
} from 'lucide-react';
import { EXPO_EVENTS } from '../../data/expoEventsData';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HomeMatchingHub() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // State for modals
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(false);
  const [submittedPartner, setSubmittedPartner] = useState(false);

  // Form states
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', company: '', zone: 'Miền Nam' });
  const [partnerForm, setPartnerForm] = useState({ name: '', phone: '', email: '', organization: '', type: 'kcn', message: '' });

  // Filter open / upcoming events (Auto-hide expired events)
  const openEvents = useMemo(() => {
    const today = new Date();
    // Default to system year 2026 or current year
    const currentYear = today.getFullYear();
    
    return EXPO_EVENTS.filter(ev => {
      if (!ev.date) return false;
      const parts = ev.date.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const eventDate = new Date(year, month, day, 23, 59, 59);
        return eventDate >= today;
      }
      return true;
    });
  }, []);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setSubmittedLead(true);
    setTimeout(() => {
      setSubmittedLead(false);
      setLeadModalOpen(false);
      setLeadForm({ name: '', phone: '', email: '', company: '', zone: 'Miền Nam' });
    }, 2200);
  };

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    setSubmittedPartner(true);
    setTimeout(() => {
      setSubmittedPartner(false);
      setPartnerModalOpen(false);
      setPartnerForm({ name: '', phone: '', email: '', organization: '', type: 'kcn', message: '' });
    }, 2200);
  };

  // Confirmed Partners & Sponsors (Only confirmed entities)
  const confirmedPartners = [
    { name: "KCN Hàm Kiệm 1 (Bình Thuận)", type: "Khu công nghiệp", role: "Đối tác KCN", logoText: "KCN HÀM KIỆM 1", color: "from-blue-600 to-indigo-700" },
    { name: "KCN VSIP 1 & 2 (Bình Dương)", type: "Khu công nghiệp", role: "Đối tác KCN", logoText: "VSIP GROUP", color: "from-emerald-600 to-teal-700" },
    { name: "KCN DEEP C & Tràng Duệ (Hải Phòng)", type: "Khu công nghiệp", role: "Đối tác KCN", logoText: "DEEP C & TRÀNG DUỆ", color: "from-sky-600 to-blue-700" },
    { name: "KCN Hiệp Phước (TP.HCM)", type: "Khu công nghiệp", role: "Đối tác KCN", logoText: "KCN HIỆP PHƯỚC", color: "from-cyan-600 to-blue-800" },
    { name: "Chuyên Gia Đồng Phục (CGDP.vn)", type: "Doanh nghiệp", role: "Đối tác Đồng hành", logoText: "CGDP.VN", color: "from-orange-500 to-amber-600" },
    { name: "TAHOMART B2B Gift Solutions", type: "Doanh nghiệp", role: "Nhà tài trợ", logoText: "TAHOMART B2B", color: "from-rose-500 to-pink-600" },
    { name: "PORTALINK Logistics", type: "Doanh nghiệp", role: "Đối tác Vận tải", logoText: "PORTALINK", color: "from-indigo-600 to-blue-900" },
    { name: "SEAIRLANDEX Global", type: "Doanh nghiệp", role: "Đối tác Logistics", logoText: "SEAIRLANDEX", color: "from-blue-700 to-slate-800" },
    { name: "ADAMEVA Group", type: "Doanh nghiệp", role: "Nhà tài trợ", logoText: "ADAMEVA", color: "from-pink-600 to-purple-700" },
    { name: "VCCI & Các Hiệp hội Doanh nghiệp", type: "Hội / Hiệp hội", role: "Bảo trợ kết nối", logoText: "VCCI & HIỆP HỘI", color: "from-purple-600 to-indigo-800" }
  ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-8 sm:pb-12 space-y-8 sm:space-y-10">
      
      {/* ======================================================================
          HEADER SECTION: H1 TITLE (1 LINE), LEAD TEXT, 3 CALL-TO-ACTION BUTTONS (COMPACT)
      ====================================================================== */}
      <div className="relative text-center max-w-5xl mx-auto space-y-3 sm:space-y-3.5">
        
        {/* Subtle Decorative Glow Behind Title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-20 bg-blue-500/10 blur-2xl pointer-events-none -z-10" />

        {/* PRIMARY H1 TITLE (GUARANTEED 1 SINGLE LINE ON DESKTOP/TABLET) */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[27px] xl:text-[30px] font-black text-[#072348] uppercase font-heading tracking-tight leading-snug md:whitespace-nowrap text-center">
          Kết nối nhu cầu nhà máy với <span className="bg-gradient-to-r from-[#0052cc] via-blue-600 to-[#0284c7] bg-clip-text text-transparent">nhà cung ứng phù hợp</span>
        </h1>

        {/* LEAD INTRODUCTORY TEXT (COMPACT & CLEAN) */}
        <p className="text-xs sm:text-[13.5px] md:text-sm text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto text-center">
          <strong className="text-[#072348] font-bold">CHUOICUNGUNG.COM</strong> hỗ trợ doanh nghiệp tìm nguồn cung theo năng lực, địa bàn và nhóm nhu cầu. Hồ sơ, chương trình gặp gỡ và đội điều phối giúp các bên chuẩn bị trao đổi và theo dõi công việc tiếp theo.
        </p>

        {/* 3 ENTRY POINT CTA BUTTONS (COMPACT) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 pt-1 max-w-3xl mx-auto">
          
          {/* CTA 1: Tôi cần tìm nhà cung ứng -> /dang-nhu-cau */}
          <Link
            to="/dang-nhu-cau"
            className="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0052cc] via-[#0047a5] to-[#0b3f6d] text-white shadow-md shadow-blue-900/15 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 transform hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="text-left space-y-0.5">
              <span className="block text-[10px] font-medium text-blue-200 uppercase tracking-wider font-heading">Dành cho Nhà máy</span>
              <span className="block text-xs sm:text-[13.5px] font-black font-heading tracking-tight leading-tight">
                Tôi cần tìm nhà cung ứng
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 ml-2 group-hover:bg-white group-hover:text-[#0052cc] transition-colors">
              <Factory className="w-4 h-4" />
            </div>
          </Link>

          {/* CTA 2: Tôi muốn giới thiệu năng lực -> /tao-ho-so */}
          <Link
            to="/tao-ho-so"
            className="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-500 text-slate-800 shadow-xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <div className="text-left space-y-0.5">
              <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-heading">Dành cho Nhà cung cấp</span>
              <span className="block text-xs sm:text-[13.5px] font-black text-[#072348] font-heading tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                Tôi muốn giới thiệu năng lực
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 ml-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </Link>

          {/* CTA 3: Tôi muốn tổ chức kết nối -> /dich-vu/to-chuc-ket-noi */}
          <Link
            to="/dich-vu/to-chuc-ket-noi"
            className="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-purple-500 text-slate-800 shadow-xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <div className="text-left space-y-0.5">
              <span className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider font-heading">Dành cho KCN & Hiệp hội</span>
              <span className="block text-xs sm:text-[13.5px] font-black text-[#072348] font-heading tracking-tight leading-tight group-hover:text-purple-700 transition-colors">
                Tôi muốn tổ chức kết nối
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 ml-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Handshake className="w-4 h-4" />
            </div>
          </Link>

        </div>

      </div>

      {/* ======================================================================
          KHỐI 1: CHƯƠNG TRÌNH DÀNH CHO DOANH NGHIỆP (CĂN GIỮA & LÀM GỌN)
      ====================================================================== */}
      <div className="space-y-4">
        
        {/* Block Header - CĂN GIỮA */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 pb-1">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider font-heading">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
            <span>Khối 01 · Lịch sự kiện & Ngày hội B2B</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#072348] uppercase font-heading">
            Chương trình dành cho doanh nghiệp
          </h2>
          <p className="text-xs text-slate-500">
            Các phiên gặp gỡ, ngày hội kết nối cung - cầu đang mở đăng ký tại các Khu Công Nghiệp trọng điểm.
          </p>
          <div className="pt-1">
            <Link
              to="/chuong-trinh"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0052cc] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg transition font-heading shadow-2xs"
            >
              <span>Xem tất cả chương trình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* List of Open Programs (or Fallback if none) */}
        {openEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {openEvents.slice(0, 3).map((event) => (
              <div 
                key={event.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-4 sm:p-4.5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-3 hover:-translate-y-0.5 relative overflow-hidden"
              >
                {/* Top Badge: Zone & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 text-blue-700 font-heading">
                    {event.zone}
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-heading">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Đang mở đăng ký</span>
                  </span>
                </div>

                {/* Event Name */}
                <div className="space-y-1">
                  <h3 className="font-black text-[#072348] text-sm sm:text-[15px] font-heading leading-snug group-hover:text-[#0052cc] transition-colors line-clamp-2">
                    {event.name}
                  </h3>
                  <p className="text-[11.5px] text-slate-500 line-clamp-1 leading-relaxed">
                    {event.tagline || event.highlight}
                  </p>
                </div>

                {/* Event Details: Time, Location, Needs, Participants */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11.5px] text-slate-600">
                  
                  {/* Thời gian */}
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span><strong>Thời gian:</strong> {event.date} ({event.time})</span>
                  </div>

                  {/* Địa bàn */}
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1"><strong>Địa bàn:</strong> {event.location}</span>
                  </div>

                  {/* Đối tượng */}
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Đối tượng:</strong> {event.factoriesCount}+ FDI · {event.suppliersCount}+ NCC</span>
                  </div>

                  {/* Nhóm nhu cầu tiêu biểu */}
                  {event.needToBuy && event.needToBuy.length > 0 && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] space-y-0.5">
                      <span className="font-bold text-slate-700 block">Nhu cầu mua trọng điểm:</span>
                      <span className="text-slate-600 line-clamp-1 leading-normal">
                        {event.needToBuy.slice(0, 2).map(n => n.item).join(', ')}...
                      </span>
                    </div>
                  )}

                </div>

                {/* Action button */}
                <div className="pt-1">
                  <Link
                    to={`/ngay-hoi-chuoi-cung-ung/${event.id}`}
                    className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-[#0052cc] text-[#072348] hover:text-white font-bold text-xs font-heading flex items-center justify-center space-x-1.5 transition-all duration-200 group/btn"
                  >
                    <span>Xem chương trình</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Fallback when no programs are currently open */
          <div className="bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 rounded-2xl p-6 border border-blue-200/90 text-center space-y-3 shadow-xs">
            <Calendar className="w-10 h-10 text-[#0052cc] mx-auto opacity-80" />
            <div className="space-y-1 max-w-xl mx-auto">
              <h3 className="text-base font-bold text-[#072348] font-heading">
                Hiện tại các phiên kết nối gần nhất đang trong giai đoạn chốt hồ sơ
              </h3>
              <p className="text-xs text-slate-600">
                Hãy đăng ký để nhận thông tin sớm nhất về các chương trình kết nối tại KCN và ngành hàng phù hợp với doanh nghiệp của bạn.
              </p>
            </div>
            <button
              onClick={() => setLeadModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm font-heading shadow-xs hover:shadow-md transition cursor-pointer"
            >
              Nhận thông tin chương trình phù hợp
            </button>
          </div>
        )}

      </div>

      {/* ======================================================================
          KHỐI 2: DỊCH VỤ HỖ TRỢ KẾT NỐI (CĂN GIỮA & LÀM GỌN)
      ====================================================================== */}
      <div className="space-y-4">
        
        {/* Block Header - CĂN GIỮA */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 pb-1">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider font-heading">
            <span>Khối 02 · Năng lực thực thi</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#072348] uppercase font-heading">
            Dịch vụ hỗ trợ kết nối
          </h2>
          <p className="text-xs text-slate-500">
            Cung cấp giải pháp trọn gói đồng hành cùng doanh nghiệp từ chuẩn bị tài liệu, vật phẩm đến tổ chức phiên làm việc trực tiếp.
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Card 1: Tổ chức kết nối */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-3.5 hover:-translate-y-0.5 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0052cc] flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition">
                <Handshake className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-[#0052cc] transition-colors">
                  Tổ chức kết nối
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thiết kế và điều phối các phiên gặp gỡ B2B 1:1 chuyên đề theo đúng nhu cầu mua sắm thực tế của nhà máy và khu công nghiệp.
                </p>
              </div>

              {/* Concrete Output */}
              <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 space-y-1">
                <span className="text-[10.5px] font-black uppercase text-blue-900 font-heading tracking-wide block">
                  Đầu ra cụ thể:
                </span>
                <ul className="text-[11.5px] text-slate-700 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Danh sách đối tác mua - bán đã xác thực nhu cầu</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Biên bản ghi nhớ làm việc (MOU) tại chỗ</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Kế hoạch bàn giao & đội ngũ theo dõi việc sau sự kiện</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              to="/dich-vu/to-chuc-ket-noi"
              className="inline-flex items-center justify-between w-full pt-2 border-t border-slate-100 text-xs font-bold text-[#0052cc] group-hover:text-blue-700 font-heading"
            >
              <span>Xem chi tiết dịch vụ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Vật phẩm sự kiện */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-3.5 hover:-translate-y-0.5 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition">
                <Shirt className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-orange-600 transition-colors">
                  Vật phẩm sự kiện
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cung cấp trọn gói áo thun đồng phục sự kiện, bảo hộ nhà máy, quà tặng doanh nghiệp B2B (hộp quà, nông sản chế biến) chuẩn nhận diện.
                </p>
              </div>

              {/* Concrete Output */}
              <div className="bg-orange-50/70 p-2.5 rounded-xl border border-orange-100 space-y-1">
                <span className="text-[10.5px] font-black uppercase text-orange-900 font-heading tracking-wide block">
                  Đầu ra cụ thể:
                </span>
                <ul className="text-[11.5px] text-slate-700 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Bộ mockup thiết kế chuẩn màu sắc thương hiệu</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Sản phẩm mẫu gửi tận nơi duyệt chất liệu trước khi may</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Cam kết chuẩn tiến độ bàn giao cho sự kiện</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              to="/dich-vu/vat-pham-su-kien"
              className="inline-flex items-center justify-between w-full pt-2 border-t border-slate-100 text-xs font-bold text-orange-600 group-hover:text-orange-700 font-heading"
            >
              <span>Xem chi tiết dịch vụ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Truyền thông doanh nghiệp */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-3.5 hover:-translate-y-0.5 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#072348] uppercase font-heading group-hover:text-purple-600 transition-colors">
                  Truyền thông doanh nghiệp
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Định danh và quảng bá năng lực sản xuất thực tế trên Bản đồ Chuỗi cung ứng, tiếp cận cộng đồng 480+ KCN và 14.000+ nhà máy FDI.
                </p>
              </div>

              {/* Concrete Output */}
              <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-100 space-y-1">
                <span className="text-[10.5px] font-black uppercase text-purple-900 font-heading tracking-wide block">
                  Đầu ra cụ thể:
                </span>
                <ul className="text-[11.5px] text-slate-700 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Hồ sơ năng lực số xác thực (Verified Supplier Badge)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Bài giới thiệu chuyên sâu trên cổng thông tin & AI Trợ lý</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>Báo cáo lượt tiếp cận và chỉ số quan tâm từ các nhà máy</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              to="/dich-vu/truyen-thong-doanh-nghiep"
              className="inline-flex items-center justify-between w-full pt-2 border-t border-slate-100 text-xs font-bold text-purple-600 group-hover:text-purple-700 font-heading"
            >
              <span>Xem chi tiết dịch vụ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>

      {/* ======================================================================
          KHỐI 3: GIỚI THIỆU DOANH NGHIỆP TẠI CHƯƠNG TRÌNH PHÙ HỢP (LÀM GỌN)
      ====================================================================== */}
      <div className="bg-gradient-to-br from-[#072348] via-[#0b3f6d] to-[#072847] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl space-y-5 relative overflow-hidden">
        
        {/* Decorative Watermark */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 relative z-10">
          <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold font-heading uppercase tracking-wider border border-blue-400/30">
            Khối 03 · Hình thức tham gia
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase font-heading leading-snug">
            Giới thiệu doanh nghiệp tại chương trình phù hợp
          </h2>
          <p className="text-xs sm:text-[13px] text-blue-200 max-w-xl mx-auto leading-relaxed">
            Doanh nghiệp có thể lựa chọn hình thức hiện diện phù hợp với ngân sách và điều kiện nhân sự để đạt hiệu quả kết nối tối ưu.
          </p>
        </div>

        {/* Comparison: 2 Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          
          {/* Gói 1: Tham gia trực tiếp */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/15 hover:border-amber-400/60 transition-all duration-300 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase font-heading">
                Gói Trực Tiếp
              </span>
              <span className="text-[11.5px] text-blue-200">Hiệu quả cao nhất</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-[17px] font-black text-white font-heading uppercase">
                Tham gia trực tiếp tại sự kiện
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed">
                Cử đại diện lãnh đạo / phòng kinh doanh trực tiếp hiện diện, giao thương và kết nối tại bàn làm việc riêng.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-200">
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Bàn làm việc, trưng bày mẫu phẩm & đặt catalogue riêng</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Trực tiếp gặp gỡ Giám đốc mua hàng (Purchasing) & đại diện FDI</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Khớp nối nhu cầu tại chỗ, ký thỏa thuận ghi nhớ (MOU)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Nhận trọn bộ kỷ yếu và danh bạ kết nối toàn chương trình</span>
              </li>
            </ul>
          </div>

          {/* Gói 2: Hiện diện từ xa */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/15 hover:border-sky-400/60 transition-all duration-300 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 font-black text-[11px] uppercase font-heading">
                Gói Từ Xa
              </span>
              <span className="text-[11.5px] text-blue-200">Tiết kiệm nhân sự & chi phí di chuyển</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-[17px] font-black text-white font-heading uppercase">
                Hiện diện từ xa (Ủy thác điều phối)
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed">
                Dành cho doanh nghiệp ở xa hoặc bận rộn: Đội ngũ điều phối viên đại diện giới thiệu năng lực tại Bàn Trung Tâm.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-200">
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Đặt catalogue, mẫu phẩm tại Bàn điều phối trung tâm</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Trình chiếu profile năng lực số trên màn hình chính sự kiện</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Nhận toàn bộ danh bạ các nhà máy có nhu cầu tìm mua sau sự kiện</span>
              </li>
              <li className="flex items-start">
                <Check className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0 mt-0.5 font-bold" />
                <span>Đội ngũ điều phối viên hỗ trợ chuyển giao thông tin & kết nối tiếp</span>
              </li>
            </ul>
          </div>

        </div>

        {/* CTA Button */}
        <div className="text-center pt-1 relative z-10">
          <button
            onClick={() => setPackageModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase font-heading shadow-md shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center space-x-1.5"
          >
            <span>Tìm hiểu hình thức tham gia</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ======================================================================
          KHỐI 4: ĐỒNG HÀNH CÙNG CHƯƠNG TRÌNH (LÀM GỌN)
      ====================================================================== */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        
        {/* Block Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider font-heading">
            <Award className="w-3.5 h-3.5" />
            <span>Khối 04 · Hợp tác & Đồng hành</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#072348] uppercase font-heading">
            Đồng hành cùng chương trình
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Trân trọng kính mời các <strong>Ban Quản lý Khu Công Nghiệp</strong>, <strong>Hội / Hiệp hội Doanh nghiệp</strong> và <strong>Đơn vị tài trợ</strong> gửi đề xuất phối hợp tổ chức các chuỗi sự kiện xúc tiến cung ứng thực chất.
          </p>
        </div>

        {/* Send Proposal Button */}
        <div className="text-center">
          <button
            onClick={() => setPartnerModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-white font-black text-xs uppercase font-heading shadow-xs hover:shadow-md transition cursor-pointer inline-flex items-center space-x-1.5"
          >
            <span>Gửi đề xuất đồng hành</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Confirmed Partners Logo & Name Grid (Only confirmed entities) */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
              Đối tác & Đơn vị đã xác nhận tham gia đồng hành
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
            {confirmedPartners.map((partner, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-sm transition text-center flex flex-col items-center justify-center space-y-1 group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${partner.color} text-white flex items-center justify-center font-black text-[9px] shadow-2xs group-hover:scale-105 transition`}>
                  {partner.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-0.5 w-full">
                  <span className="block text-[11px] font-black text-[#072348] truncate group-hover:text-[#0052cc] transition-colors font-heading">
                    {partner.name}
                  </span>
                  <span className="block text-[9.5px] text-slate-400 font-medium truncate">
                    {partner.role}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10.5px] text-slate-400 text-center italic pt-0.5">
            * Danh sách được cập nhật liên tục theo tiến độ xác nhận của Ban Tổ Chức và đơn vị phối hợp.
          </p>
        </div>

      </div>

      {/* ======================================================================
          MODAL 1: NHẬN THÔNG TIN CHƯƠNG TRÌNH PHÙ HỢP
      ====================================================================== */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setLeadModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-blue-600 font-heading uppercase">Đăng ký nhận tin</span>
              <h3 className="text-xl font-black text-[#072348] font-heading uppercase">
                Nhận thông tin chương trình phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Hệ thống sẽ gửi thông báo các ngày hội chuỗi cung ứng ngay khi mở đăng ký tại khu vực và ngành hàng của bạn.
              </p>
            </div>

            {submittedLead ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Đăng ký thành công!</h4>
                <p className="text-xs text-emerald-700">Đội ngũ điều phối sẽ gửi thông tin chương trình tới bạn sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-left text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input 
                    type="text" 
                    required 
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="Nguyễn Văn A" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      required 
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="0908 xxx xxx" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      required 
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="email@company.vn" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Doanh nghiệp / Tổ chức</label>
                  <input 
                    type="text" 
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    placeholder="Công ty TNHH Sản xuất..." 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa bàn quan tâm</label>
                  <select 
                    value={leadForm.zone}
                    onChange={(e) => setLeadForm({ ...leadForm, zone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="Miền Nam">KCN Miền Nam (Bình Dương, Đồng Nai, TP.HCM, Long An...)</option>
                    <option value="Miền Bắc">KCN Miền Bắc (Hải Phòng, Bắc Ninh, Hà Nội, Vĩnh Phúc...)</option>
                    <option value="Miền Trung">KCN Miền Trung (Đà Nẵng, Quảng Nam, Quảng Ngãi...)</option>
                    <option value="Toàn quốc">Tất cả các khu vực</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-white font-bold font-heading uppercase text-xs sm:text-sm shadow-md transition"
                >
                  Xác nhận đăng ký
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: GỬI ĐỀ XUẤT ĐỒNG HÀNH (DÀNH CHO HỘI / KCN / NHÀ TÀI TRỢ)
      ====================================================================== */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setPartnerModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-[#0052cc] font-heading uppercase">Đề xuất hợp tác</span>
              <h3 className="text-xl font-black text-[#072348] font-heading uppercase">
                Gửi đề xuất đồng hành cùng chương trình
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Dành cho Ban Quản lý KCN, Hội / Hiệp hội Doanh nghiệp hoặc Đơn vị tài trợ chiến lược.
              </p>
            </div>

            {submittedPartner ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Đã tiếp nhận đề xuất!</h4>
                <p className="text-xs text-emerald-700">Ban tổ chức sẽ liên hệ lại trong vòng 24 giờ làm việc.</p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-3.5 text-left text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại hình đơn vị *</label>
                  <select 
                    value={partnerForm.type}
                    onChange={(e) => setPartnerForm({ ...partnerForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="kcn">Ban Quản lý / Chủ đầu tư Khu Công Nghiệp</option>
                    <option value="association">Hội / Hiệp hội Doanh nghiệp / Tổ chức Xúc tiến</option>
                    <option value="sponsor">Nhà tài trợ & Đối tác Chiến lược</option>
                    <option value="other">Tổ chức khác</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Đơn vị / Tổ chức *</label>
                  <input 
                    type="text" 
                    required 
                    value={partnerForm.organization}
                    onChange={(e) => setPartnerForm({ ...partnerForm, organization: e.target.value })}
                    placeholder="BQL KCN... / Hiệp hội..." 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Người đại diện liên hệ *</label>
                    <input 
                      type="text" 
                      required 
                      value={partnerForm.name}
                      onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      placeholder="Nguyễn Văn A" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      required 
                      value={partnerForm.phone}
                      onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                      placeholder="09xx xxx xxx" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={partnerForm.email}
                    onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                    placeholder="contact@kcn.vn" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nội dung đề xuất phối hợp sơ bộ</label>
                  <textarea 
                    rows={3}
                    value={partnerForm.message}
                    onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                    placeholder="Chúng tôi mong muốn phối hợp tổ chức ngày hội kết nối cung ứng cho các nhà máy tại..." 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-white font-bold font-heading uppercase text-xs sm:text-sm shadow-md transition"
                >
                  Gửi đề xuất
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: TÌM HIỂU HÌNH THỨC THAM GIA
      ====================================================================== */}
      {packageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setPackageModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5 text-left">
              <span className="text-xs font-bold text-blue-600 font-heading uppercase">Tư vấn hình thức</span>
              <h3 className="text-xl font-black text-[#072348] font-heading uppercase">
                Lựa chọn gói tham gia phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Đăng ký ngay để nhận tư vấn chi tiết từ điều phối viên CHUOICUNGUNG.COM cho kỳ ngày hội gần nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase font-heading">
                  Trực tiếp
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Gặp gỡ 1:1 tại sự kiện</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Phù hợp cho doanh nghiệp có nhân sự kinh doanh/kỹ thuật sẵn sàng tiếp cận trực tiếp các nhà máy FDI.
                </p>
                <Link
                  to="/ngay-hoi-chuoi-cung-ung/dang-ky"
                  onClick={() => setPackageModalOpen(false)}
                  className="block text-center w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold font-heading uppercase transition"
                >
                  Đăng ký trực tiếp
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white font-black text-[11px] uppercase font-heading">
                  Từ xa
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Hiện diện tại Bàn trung tâm</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Phù hợp cho doanh nghiệp ngoại tỉnh muốn gửi catalogue, mẫu sản phẩm và nhận danh bạ nhu cầu mua.
                </p>
                <Link
                  to="/ngay-hoi-chuoi-cung-ung/dang-ky"
                  onClick={() => setPackageModalOpen(false)}
                  className="block text-center w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-heading uppercase transition"
                >
                  Đăng ký từ xa
                </Link>
              </div>

            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setPackageModalOpen(false);
                  setLeadModalOpen(true);
                }}
                className="text-xs font-bold text-slate-500 hover:text-[#0052cc] underline cursor-pointer"
              >
                Hoặc để lại thông tin để chuyên viên gọi lại tư vấn chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
