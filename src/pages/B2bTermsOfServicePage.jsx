import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, FileText, Download, Clock, CheckCircle2, 
  AlertTriangle, Lock, Award, ChevronRight, Eye, RefreshCw, 
  Layers, Building2, Factory, Scale, Check, Printer, QrCode, 
  Search, Bookmark, ExternalLink, Sparkles, X, KeyRound
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function B2bTermsOfServicePage() {
  const { t, lang } = useLanguage();

  // State management
  const [activeSection, setActiveSection] = useState('section-1');
  const [selectedVersion, setSelectedVersion] = useState('v2.1');
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [isSigned, setIsSigned] = useState(true);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // e-Sign modal form
  const [caProvider, setCaProvider] = useState('VNPT-CA');
  const [pinCode, setPinCode] = useState('');
  const [signingStatus, setSigningStatus] = useState(false);

  // Table of Contents definitions
  const tocItems = [
    { id: 'section-1', title: '1. Phạm Vi Áp Dụng & Định Nghĩa Thuật Ngữ' },
    { id: 'section-2', title: '2. Quyền & Nghĩa Vụ Bên Mua (FDI & Chuỗi Mua Hàng)' },
    { id: 'section-3', title: '3. Quyền & Nghĩa Vụ Bên Bán (Nhà Máy & Nhà Cung Cấp)' },
    { id: 'section-4', title: '4. Kết Nối Odoo/ERP & Bảo Mật Dữ Liệu Chuỗi' },
    { id: 'section-5', title: '5. Quy Chế Đấu Thầu RFQ & Chống Gian Lận Thầu' },
    { id: 'section-6', title: '6. Tiêu Chuẩn Định Danh KYC 3 Lớp & Xếp Hạng' },
    { id: 'section-7', title: '7. Biểu Phí, Ký Quỹ Đảm Bảo & Thanh Toán' },
    { id: 'section-8', title: '8. Cơ Chế Trọng Tài B2B & Giới Hạn Trách Nhiệm' }
  ];

  // Intersection Observer for scroll tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    setTimeout(() => {
      setIsExportingPdf(false);
      window.print();
    }, 800);
  };

  const handleSignCaSubmit = (e) => {
    e.preventDefault();
    setSigningStatus(true);
    setTimeout(() => {
      setSigningStatus(false);
      setIsSigned(true);
      setIsSignModalOpen(false);
      alert('Đã xác thực và ký số điện tử thành công bằng chứng thư ' + caProvider + '! Hồ sơ kiểm toán B2B của bạn đã được cập nhật.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans antialiased selection:bg-[#0052cc] selection:text-white pb-28 pt-6">
      
      {/* ========================================================================= */}
      {/* 1. BREADCRUMBS & LEGAL HEADER METADATA                                     */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-600">Trung Tâm Pháp Lý &amp; Kiểm Toán B2B</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[#0052cc] font-bold font-heading">Thỏa Thuận Dịch Vụ B2B</span>
        </nav>

        {/* Legal Title Header Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0047a5] text-[11px] font-bold font-mono">
                <Scale className="w-3.5 h-3.5 text-[#0052cc]" />
                <span>OFFICIAL AUDIT-GRADE LEGAL INSTRUMENT • DOC-CCU-B2B-2026-v2.1</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-serif tracking-tight leading-tight">
                Thỏa Thuận Cung Cấp &amp; Sử Dụng Dịch Vụ Mạng Lưới Chuỗi Cung Ứng
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Văn kiện pháp lý điện tử xác lập quyền hạn, trách nhiệm, cơ chế bảo mật tích hợp Odoo/ERP và quy chế đấu thầu B2B giữa Nền tảng Chuỗi Cung Ứng Quốc Gia và các Doanh nghiệp, Nhà máy FDI.
              </p>
            </div>

            {/* Version Selector & Diff Mode & Export Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-heading">
              
              {/* Version Dropdown */}
              <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={selectedVersion} 
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="v2.1">Bản v2.1 (Hiện tại - 2026)</option>
                  <option value="v2.0">Bản v2.0 (Tháng 01/2026)</option>
                  <option value="v1.0">Bản v1.0 (Năm 2025)</option>
                </select>
              </div>

              {/* Diff Compare Button */}
              <button
                onClick={() => setIsDiffMode(!isDiffMode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border cursor-pointer ${
                  isDiffMode 
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="Bật/Tắt chế độ so sánh thay đổi pháp lý giữa v2.0 và v2.1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isDiffMode ? 'Đang So Sánh (Diff ON)' : 'So Sánh Thay Đổi'}</span>
              </button>

              {/* Print / Export PDF Button */}
              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="px-4 py-2 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isExportingPdf ? 'Đang Tạo PDF...' : 'Tải Bản In PDF'}</span>
              </button>
            </div>
          </div>

          {/* MetaData Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-500 bg-slate-50/90 p-3 rounded-2xl border border-slate-200/80">
            <div className="flex flex-wrap items-center gap-4">
              <span><strong>Phiên bản:</strong> <span className="text-[#0052cc] font-bold">2.1 (Hiệu lực chính thức)</span></span>
              <span>•</span>
              <span><strong>Ngày có hiệu lực:</strong> 01/09/2026</span>
              <span>•</span>
              <span><strong>Cập nhật lần cuối:</strong> 15 ngày trước</span>
              <span>•</span>
              <span><strong>Mã kiểm toán:</strong> CCU-AUDIT-2026-9812</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã kiểm toán bởi Ban Pháp Chế &amp; Cục TMĐT</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. TL;DR STRATEGIC SUMMARY CARDS (3 THẺ TÓM TẮT THỰC CHIẾN)             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Odoo & ERP Data Privacy */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition group">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-blue-50 text-[#0052cc] group-hover:bg-blue-600 group-hover:text-white transition">
                <Lock className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                ISO/IEC 27001
              </span>
            </div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              1. Bảo Mật Odoo/ERP &amp; Dữ Liệu Nội Bộ
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cam kết tuyệt đối <strong>không can thiệp luồng dữ liệu định giá, bí mật kinh doanh, nhà cung cấp độc quyền</strong> hoặc đơn giá nội bộ khi tích hợp cổng Odoo, SAP, Fast ERP.
            </p>
          </div>

          {/* Card 2: Bidding Rules & Anti-Fraud */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-rose-300 transition group">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
                <Scale className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                LUẬT BIDDING B2B
              </span>
            </div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              2. Chống Gian Lận Thầu &amp; Thông Đồng Giá
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nghiêm cấm hành vi <strong>quân xanh quân đỏ, chào giá ảo phá giá hoặc vi phạm bảo mật thầu</strong>. Hệ thống tự động thu hồi tư cách thành viên và khởi kiện trọng tài đối với bên vi phạm.
            </p>
          </div>

          {/* Card 3: KYC Policy & Badge Responsibilities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition group">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                KYC 3 LỚP XÁC THỰC
              </span>
            </div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              3. Chính Sách KYC &amp; Xếp Hạng Kim Cương/Vàng
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Xác lập rõ quyền hạn và <strong>trách nhiệm pháp lý liên đới khi cấp Huy hiệu Xác thực Quốc gia</strong>. Mọi cam kết giao hàng và tiêu chuẩn kỹ thuật (ISO, RoHS) đều có giá trị pháp lý ràng buộc.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN LAYOUT: STICKY TOC (25%) + LEGAL READING COLUMN (MAX-W 820px)      */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STICKY TABLE OF CONTENTS SIDEBAR (COL 3 - 25%) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-4 h-4 text-[#0052cc]" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 font-heading">
                    Mục Lục Văn Kiện Pháp Lý
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">8 ĐIỀU KHOẢN</span>
              </div>

              {/* Multi-level Navigation List */}
              <nav className="space-y-1 text-xs">
                {tocItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition font-medium flex items-center justify-between cursor-pointer leading-snug ${
                        isActive
                          ? 'bg-blue-50 text-[#0052cc] font-bold border border-blue-200 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{item.title}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] shrink-0"></span>}
                    </button>
                  );
                })}
              </nav>

              {/* Watermark Notice */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Xác thực dấu điện tử SHA-256</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Mọi hành vi sao chép trái phép văn kiện này phục vụ mục đích thương mại ngoài mạng lưới CCU sẽ bị xử lý theo Luật SHTT.
                </p>
              </div>

            </div>

            {/* Support Hotline Widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-amber-300 font-bold font-heading">
                <Scale className="w-4 h-4" />
                <span>Hỗ Trợ Pháp Chế FDI 24/7</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Quý Giám đốc Pháp chế hoặc Tổng Giám đốc cần giải trình hợp đồng nguyên tắc B2B, vui lòng liên hệ:
              </p>
              <div className="font-mono text-xs text-sky-300 font-bold">
                legal@chuoicungung.com • 1900 8686
              </div>
            </div>
          </aside>

          {/* MAIN LEGAL TEXT CONTENT (COL 8 - MAX-WIDTH 820px) */}
          <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-10 max-w-[840px] font-sans text-slate-800 text-sm leading-relaxed relative">
            
            {/* Diff Mode Notification Banner */}
            {isDiffMode && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-900">
                <div className="flex items-center space-x-2 font-bold font-heading">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>ĐANG BẬT CHẾ ĐỘ SO SÁNH THAY ĐỔI (DIFF COMPARE: v2.0 ➔ v2.1)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Các đoạn văn bản <span className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded font-mono font-bold line-through">màu đỏ gạch bỏ</span> là nội dung đã bãi bỏ từ v2.0; các đoạn <span className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold">màu xanh lá</span> là điều khoản được bổ sung mới trong bản v2.1 liên quan đến Odoo, Luật Bidding và KYC Lớp 2.
                </p>
              </div>
            )}

            {/* =================================================================== */}
            {/* SECTION 1: PHẠM VI ÁP DỤNG & ĐỊNH NGHĨA                            */}
            {/* =================================================================== */}
            <section id="section-1" className="space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 1.</span>
                <span>Phạm Vi Áp Dụng &amp; Định Nghĩa Thuật Ngữ</span>
              </h2>

              <p>
                <strong>1.1. Phạm vi áp dụng:</strong> Thỏa thuận này xác lập các điều kiện, quyền hạn và nghĩa vụ pháp lý điều chỉnh toàn bộ hoạt động đăng ký, niêm yết hồ sơ năng lực, tích hợp hệ sinh thái ERP/Odoo, phát hành yêu cầu báo giá (RFQ), tham gia đấu thầu và xác lập giao dịch thương mại giữa các chủ thể trên Nền tảng Chuỗi Cung Ứng Quốc Gia (sau đây gọi tắt là <em>"Nền tảng CCU"</em>).
              </p>

              <p>
                <strong>1.2. Định nghĩa thuật ngữ:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-700">
                <li>
                  <strong>"Bên Mua" (Buyer / FDI):</strong> Là các doanh nghiệp đầu tư trực tiếp nước ngoài (FDI), chủ đầu tư dự án nhà máy, chuỗi bán lẻ (ví dụ: TAHOMART), ngân hàng thương mại (ví dụ: HDBank, VietinBank) có nhu cầu tìm kiếm và thu mua hàng hóa, bao bì, vật tư, máy móc và dịch vụ công nghiệp.
                </li>
                <li>
                  <strong>"Bên Bán" (Supplier / Nhà Máy):</strong> Là các pháp nhân sở hữu nhà máy, xưởng gia công, đơn vị phụ trợ, nhà cung ứng nguyên vật liệu được cấp mã số thuế hợp pháp tại Việt Nam.
                </li>
                <li>
                  <strong>"Mã Định Danh KYC 3 Lớp":</strong> Hệ thống xếp hạng và xác thực uy tín pháp nhân do Nền tảng CCU thẩm định theo tiêu chuẩn Bộ Công Thương và cơ quan quản lý KCN.
                </li>
              </ul>

              {isDiffMode && (
                <div className="p-3.5 bg-emerald-50/80 border-l-4 border-emerald-500 rounded-r-xl space-y-1 text-xs">
                  <div className="font-bold text-emerald-900 font-mono">
                    + [Bổ sung mới tại v2.1]:
                  </div>
                  <p className="text-emerald-950">
                    "Hệ thống Odoo B2B Bridge": Cổng kết nối dữ liệu tự động giữa phần mềm quản trị doanh nghiệp nội bộ của thành viên và máy chủ bảo mật của Nền tảng CCU.
                  </p>
                </div>
              )}
            </section>

            {/* =================================================================== */}
            {/* SECTION 2: QUYỀN & NGHĨA VỤ BÊN MUA (FDI)                           */}
            {/* =================================================================== */}
            <section id="section-2" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 2.</span>
                <span>Quyền &amp; Nghĩa Vụ Của Bên Mua (FDI &amp; Chuỗi Mua Hàng)</span>
              </h2>

              <p>
                <strong>2.1. Quyền của Bên Mua:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>Phát hành yêu cầu báo giá (RFQ) công khai hoặc bảo mật danh tính (Anonymous RFQ).</li>
                <li>Tiếp cận danh bạ 10.256+ nhà máy và 128.540+ doanh nghiệp phụ trợ đã qua rà soát KYC.</li>
                <li>Yêu cầu Nền tảng CCU cung cấp báo cáo thẩm định năng lực thực tế (Factory Audit Dossier) của nhà cung ứng trước khi chốt hợp đồng.</li>
              </ul>

              <p>
                <strong>2.2. Nghĩa vụ của Bên Mua:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>Cung cấp thông tin quy cách kỹ thuật, tiêu chuẩn chất lượng (RoHS, ISO, HACCP) và tiến độ giao hàng một cách chính xác, minh bạch.</li>
                <li>Thanh toán đầy đủ các khoản tiền hàng theo tiến độ hợp đồng đã ký kết điện tử với Bên Bán.</li>
              </ul>
            </section>

            {/* =================================================================== */}
            {/* SECTION 3: QUYỀN & NGHĨA VỤ BÊN BÁN (NHÀ MÁY & SUPPLIERS)           */}
            {/* =================================================================== */}
            <section id="section-3" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 3.</span>
                <span>Quyền &amp; Nghĩa Vụ Của Bên Bán (Nhà Máy &amp; Nhà Cung Cấp)</span>
              </h2>

              <p>
                <strong>3.1. Quyền của Bên Bán:</strong> Được tiếp cận trực tiếp các gói thầu độc quyền từ Odoo TAHOMART, HDBank, Foxconn và mạng lưới hơn 400 KCN toàn quốc; được bảo vệ quyền sở hữu trí tuệ đối với các giải pháp kỹ thuật, bản vẽ khuôn mẫu.
              </p>

              <p>
                <strong>3.2. Nghĩa vụ của Bên Bán:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>Cam kết 100% về tính xác thực của chứng chỉ chất lượng (ISO, FDA, HACCP) và hình ảnh nhà xưởng cung cấp cho hệ thống.</li>
                <li>Thực hiện đúng cam kết về đơn giá, quy cách và thời gian bàn giao sản phẩm theo RFQ đã trúng thầu.</li>
              </ul>
            </section>

            {/* =================================================================== */}
            {/* SECTION 4: KẾT NỐI ODOO/ERP & BẢO MẬT DỮ LIỆU                      */}
            {/* =================================================================== */}
            <section id="section-4" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 4.</span>
                <span>Cơ Chế Tích Hợp Odoo/ERP &amp; Bảo Mật Dữ Liệu Doanh Nghiệp</span>
              </h2>

              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center space-x-2 text-[#0052cc] font-bold font-heading">
                  <Lock className="w-4 h-4" />
                  <span>CAM KẾT BẢO MẬT DỮ LIỆU ĐIỆN TỬ CHUẨN ISO/IEC 27001:</span>
                </div>
                <p className="text-xs text-blue-950 leading-relaxed">
                  Nền tảng CCU cam kết <strong>không thu thập mật khẩu gốc, không đọc đơn giá bí mật nội bộ, không truy xuất dữ liệu kế toán tài chính ngoài phạm vi thầu</strong>. Toàn bộ gói tin truyền qua API Odoo/SAP đều được mã hóa đầu cuối bằng thuật toán AES-256 GCM và khóa định danh TLS 1.3.
                </p>
              </div>

              {isDiffMode && (
                <div className="space-y-2">
                  <div className="p-3 bg-rose-50 border-l-4 border-rose-400 rounded-r-xl text-xs text-rose-950 line-through">
                    - [Nội dung cũ v2.0 đã bỏ]: "Thành viên chịu hoàn toàn trách nhiệm trong trường hợp rò rỉ dữ liệu khi tích hợp webhook của bên thứ ba."
                  </div>
                  <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-xs text-emerald-950">
                    + [Quy định mới v2.1]: "Nền tảng CCU chịu trách nhiệm bồi thường thiệt hại và có bảo hiểm an ninh mạng lên đến 10 tỷ VNĐ đối với sự cố rò rỉ dữ liệu xuất phát từ lỗi hạ tầng máy chủ của hệ thống."
                  </div>
                </div>
              )}
            </section>

            {/* =================================================================== */}
            {/* SECTION 5: QUY CHẾ ĐẤU THẦU & CHỐNG THÔNG THẦU                    */}
            {/* =================================================================== */}
            <section id="section-5" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 5.</span>
                <span>Quy Chế Đấu Thầu RFQ, Chống Thông Thầu &amp; Xử Lý Vi Phạm</span>
              </h2>

              <p>
                <strong>5.1. Cơ chế khớp lệnh thầu minh bạch:</strong> Mọi phiên đấu thầu bao bì, quà tặng 9:16, nông sản chế biến, cơ khí CNC trên sàn đều được ghi nhận bằng nhật ký kiểm toán bất biến (Audit Trail).
              </p>

              <p>
                <strong>5.2. Chế tài đối với hành vi gian lận:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-700">
                <li>
                  <strong>Hành vi "Quân xanh quân đỏ" hoặc thông đồng giá:</strong> Khóa vĩnh viễn tài khoản doanh nghiệp, thu hồi toàn bộ tiền ký quỹ đảm bảo thầu, đưa vào danh sách đen (Blacklist) gửi đến Ban Quản Lý các KCN toàn quốc.
                </li>
                <li>
                  <strong>Hành vi bỏ thầu sau khi trúng thầu:</strong> Phạt 10% giá trị gói thầu và đình chỉ tư cách tham gia đấu thầu trong vòng 12 tháng.
                </li>
              </ul>
            </section>

            {/* =================================================================== */}
            {/* SECTION 6: ĐỊNH DANH KYC 3 LỚP & TRỌNG TÀI TRANH CHẤP              */}
            {/* =================================================================== */}
            <section id="section-6" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 6.</span>
                <span>Tiêu Chuẩn Định Danh KYC 3 Lớp &amp; Xếp Hạng Doanh Nghiệp</span>
              </h2>

              <p>
                <strong>6.1. Tiêu chuẩn 3 Lớp KYC:</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-heading">Lớp 1: Pháp Nhân</strong>
                  <span className="text-slate-500 text-[11px]">Đối soát MST, GPKD qua cổng Dịch vụ công Quốc gia.</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                  <strong className="text-[#0052cc] block font-heading">Lớp 2: Thực Địa</strong>
                  <span className="text-blue-900 text-[11px]">Xác minh tọa độ GIS xưởng, máy móc và hồ sơ PCCC.</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-amber-800 block font-heading">Lớp 3: Kim Cương</strong>
                  <span className="text-amber-900 text-[11px]">Được bảo chứng tài chính và năng lực cung ứng FDI.</span>
                </div>
              </div>
            </section>

            {/* =================================================================== */}
            {/* SECTION 7: BIỂU PHÍ & KÝ QUỸ ĐẢM BẢO                               */}
            {/* =================================================================== */}
            <section id="section-7" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 7.</span>
                <span>Biểu Phí Dịch Vụ, Ký Quỹ Đảm Bảo &amp; Thanh Toán Điện Tử</span>
              </h2>

              <p>
                <strong>7.1. Phí giao dịch:</strong> Nền tảng CCU áp dụng mức phí dịch vụ kết nối theo biểu phí niêm yết công khai trên Cổng thông tin. Các gói thầu từ thiện, bình ổn giá nông sản được miễn 100% phí nền tảng.
              </p>
              <p>
                <strong>7.2. Ký quỹ đảm bảo hợp đồng (Escrow):</strong> Các gói thầu có giá trị trên 1 tỷ VNĐ được khuyến nghị áp dụng cơ chế thanh toán tạm giữ Escrow qua Ngân hàng liên kết (HDBank, VietinBank) để đảm bảo an toàn tuyệt đối cho cả hai bên.
              </p>
            </section>

            {/* =================================================================== */}
            {/* SECTION 8: CƠ CHẾ TRỌNG TÀI & HIỆU LỰC                             */}
            {/* =================================================================== */}
            <section id="section-8" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-950 pb-2 border-b border-slate-100 flex items-center space-x-2">
                <span className="text-[#0052cc]">Điều 8.</span>
                <span>Cơ Chế Trọng Tài B2B &amp; Giới Hạn Trách Nhiệm</span>
              </h2>

              <p>
                <strong>8.1. Giải quyết tranh chấp:</strong> Mọi tranh chấp phát sinh từ hoặc liên quan đến Thỏa thuận này trước hết sẽ được giải quyết thông qua thương lượng, hòa giải bởi Hội Đồng Trọng Tài Chuỗi Cung Ứng Quốc Gia. Trong trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) theo Quy tắc tố tụng trọng tài của VIAC.
              </p>
              <p>
                <strong>8.2. Luật áp dụng:</strong> Thỏa thuận này được điều chỉnh và giải thích hoàn toàn theo quy định của pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
              </p>
            </section>

            {/* =================================================================== */}
            {/* 4. E-SIGN AUDIT & KYC VERIFICATION ZONE                             */}
            {/* =================================================================== */}
            <div className="pt-8 border-t-2 border-slate-200 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500 text-slate-950">
                        {isSigned ? 'ĐÃ KÝ ĐIỆN TỬ CA (VERIFIED)' : 'CHỜ XÁC THỰC CHỮ KÝ SỐ'}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">
                        MÃ: CCU-LEGAL-SIGN-2026-9921
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black font-heading text-white">
                      Xác Nhận Ký Điện Tử Bằng Token Chữ Ký Số Quốc Gia
                    </h3>
                    <p className="text-xs text-slate-300">
                      {isSigned 
                        ? 'Trạng thái: Đã ký điện tử thông qua định danh Lớp 1 (Ngày 01/09/2026 lúc 09:15:30 GMT+7, Token VNPT-CA / Viettel-CA).'
                        : 'Doanh nghiệp cần cắm USB Token hoặc xác thực SmartCA để kích hoạt đầy đủ quyền năng đấu thầu Odoo.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    <button
                      onClick={() => setIsSignModalOpen(true)}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition flex items-center space-x-2 font-heading cursor-pointer tracking-wide"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isSigned ? 'Ký Lại Bằng Token Khác' : 'Ký Số Token CA Ngay'}</span>
                    </button>
                  </div>
                </div>

                {/* Audit Seals */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[10.5px] font-mono text-slate-400">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Chứng thư số được chấp thuận: VNPT-CA, Viettel-CA, FPT-CA, MISA eSign</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-sky-300 font-bold">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Check: ccu.vn/verify/DOC-CCU-B2B-2026-v2.1</span>
                  </div>
                </div>

              </div>
            </div>

          </main>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. E-SIGN TOKEN CA SIMULATION MODAL                                       */}
      {/* ========================================================================= */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              onClick={() => setIsSignModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                <KeyRound className="w-3 h-3 text-[#0052cc]" />
                <span>CỔNG KÝ SỐ ĐIỆN TỬ B2B QUỐC GIA</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900">
                Xác Thực Chữ Ký Số Pháp Nhân
              </h3>
              <p className="text-xs text-slate-500">
                Vui lòng chọn nhà cung cấp dịch vụ chứng thực chữ ký số (CA) và nhập mã PIN để ký văn bản thỏa thuận DOC-CCU-B2B-2026-v2.1.
              </p>
            </div>

            <form onSubmit={handleSignCaSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 font-heading">
                  Nhà Cung Cấp Chứng Thư Số (CA Provider)
                </label>
                <select
                  value={caProvider}
                  onChange={(e) => setCaProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-sans bg-white"
                >
                  <option value="VNPT-CA">VNPT-CA (Tập đoàn Bưu chính Viễn thông Việt Nam)</option>
                  <option value="Viettel-CA">Viettel-CA (Tập đoàn Công nghiệp - Viễn thông Quân đội)</option>
                  <option value="FPT-CA">FPT-CA (Công ty TNHH Hệ thống Thông tin FPT)</option>
                  <option value="MISA eSign">MISA eSign (Công ty Cổ phần MISA)</option>
                  <option value="SmartCA">VNPT SmartCA (Ký số từ xa không dùng USB Token)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-heading">
                  Mã PIN Token / Xác Thực Sinh Trắc Học SmartCA <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0052cc] font-mono tracking-widest text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chữ ký số có giá trị pháp lý tương đương con dấu doanh nghiệp theo Luật Giao Dịch Điện Tử 2023.</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={signingStatus}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] hover:from-[#003d8f] hover:to-[#0052cc] text-white font-black rounded-xl shadow-lg transition flex items-center justify-center space-x-2 font-heading cursor-pointer text-xs sm:text-sm tracking-wide"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{signingStatus ? 'Đang Kiểm Tra Chứng Thư Số...' : 'Xác Nhận & Ký Điện Tử Ngay'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
