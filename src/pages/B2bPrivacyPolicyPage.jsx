import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Eye, EyeOff, Server, Database, 
  Trash2, Bell, CheckCircle2, ChevronRight, ChevronDown, 
  Sparkles, Download, Printer, QrCode, FileText, AlertTriangle, 
  KeyRound, ShieldAlert, Cpu, Clock, Check, ExternalLink, HelpCircle,
  ToggleLeft, ToggleRight, Radio, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function B2bPrivacyPolicyPage() {
  const { t, lang } = useLanguage();

  // Active TOC section
  const [activeSection, setActiveSection] = useState('sec-1');

  // Accordion state (expanded sections)
  const [expandedSections, setExpandedSections] = useState({
    'sec-1': true,
    'sec-2': true,
    'sec-3': true,
    'sec-4': false,
    'sec-5': false,
    'sec-6': false,
    'sec-7': false,
  });

  // Consent Dashboard Toggles
  const [consents, setConsents] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_privacy_consents');
      return saved ? JSON.parse(saved) : {
        rfqAlerts: true,
        aiAnalytics: true,
        anonymousBenchmark: false,
        performanceCookies: true
      };
    } catch (e) {
      return {
        rfqAlerts: true,
        aiAnalytics: true,
        anonymousBenchmark: false,
        performanceCookies: true
      };
    }
  });

  const [consentSavedToast, setConsentSavedToast] = useState(false);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [isPurged, setIsPurged] = useState(false);

  // TOC items
  const tocItems = [
    { id: 'sec-1', title: '1. Thu Thập Dữ Liệu B2B & Phạm Vi Áp Dụng' },
    { id: 'sec-2', title: '2. Mã Hóa Database & Data Masking (AES-256)' },
    { id: 'sec-3', title: '3. Bảo Mật RFQ, Hồ Sơ Thầu & Cổng Odoo/ERP' },
    { id: 'sec-4', title: '4. Bảo Mật Tuyển Dụng & Trắc Nghiệm DISC KCN' },
    { id: 'sec-5', title: '5. Cơ Chế Chia Sẻ Dữ Liệu Với Hiệp Hội & BQL KCN' },
    { id: 'sec-6', title: '6. Quyền Của Doanh Nghiệp & Xóa Dữ Liệu 1-Click' },
    { id: 'sec-7', title: '7. Quy Trình Ứng Phó Sự Cố Rò Rỉ (Data Breach)' }
  ];

  // Sync consents to local storage
  const handleToggleConsent = (key) => {
    const updated = { ...consents, [key]: !consents[key] };
    setConsents(updated);
    try {
      localStorage.setItem('ccu_privacy_consents', JSON.stringify(updated));
    } catch (e) {}
    setConsentSavedToast(true);
    setTimeout(() => setConsentSavedToast(false), 2000);
  };

  const toggleAccordion = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: true }));
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Intersection observer for sidebar TOC
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

  const handleConfirmPurge = () => {
    setIsPurged(true);
    setIsPurgeModalOpen(false);
    alert('Đã kích hoạt lệnh xóa dữ liệu 1-Click (Right to be Forgotten). Toàn bộ lịch sử duyệt web tạm thời, token API và bản ghi nháp của phiên này đã được xóa sạch khỏi bộ nhớ máy chủ.');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans antialiased selection:bg-[#0052cc] selection:text-white pb-28 pt-6">
      
      {/* ========================================================================= */}
      {/* 1. BREADCRUMBS & HERO HEADER (DARK THEME WITH 3D SHIELD AURA)             */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-600">Trung Tâm Pháp Lý</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[#0052cc] font-bold font-heading">Chính Sách Bảo Mật Dữ Liệu</span>
        </nav>

        {/* Hero Header - Sleek Dark Theme */}
        <div className="bg-gradient-to-br from-slate-950 via-[#071329] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-blue-900/50 space-y-6 relative overflow-hidden">
          
          {/* Subtle Ambient Shield Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-3xl">
              {/* Category Tag */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-sky-300 text-xs font-bold font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ENTERPRISE DATA PRIVACY • ISO/IEC 27001 &amp; NGHỊ ĐỊNH 13/2023/NĐ-CP</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white tracking-tight leading-tight">
                Chính Sách Bảo Mật Dữ Liệu B2B Chuẩn Quốc Tế
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Tấm khiên tín nhiệm bảo vệ toàn vẹn dữ liệu chuỗi cung ứng: Từ kịch bản chiến dịch thu mua TAHOMART, báo giá thầu giỏ quà màng co, cấu trúc định giá ERP Odoo đến hồ sơ ứng viên nhân lực 400+ Khu công nghiệp.
              </p>

              {/* Certification Badges Ribbon */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10.5px]">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-emerald-300 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> Mã hóa AES-256 GCM
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-sky-300 font-bold flex items-center gap-1">
                  <Server className="w-3 h-3 text-sky-400" /> TLS 1.3 End-to-End
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-purple-300 font-bold flex items-center gap-1">
                  <Database className="w-3 h-3 text-purple-400" /> Data Masking DB
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-amber-300 font-bold flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-400" /> Audit Trail SHA-256
                </span>
              </div>
            </div>

            {/* 3D Pulsing Shield Graphic Widget */}
            <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 shadow-inner text-center self-center lg:self-auto min-w-[200px]">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 animate-pulse-slow">
                  <ShieldCheck className="w-9 h-9 text-slate-950" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
              </div>
              <span className="text-xs font-black uppercase tracking-wider font-mono text-emerald-400">
                LÁ CHẮN TÍN NHIỆM
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Bảo vệ 100% bí mật kinh doanh
              </span>
            </div>

          </div>

          {/* Audit Trail Metadata Footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span><strong>Mã văn bản:</strong> CCU-PRIVACY-B2B-v2.1</span>
              <span>•</span>
              <span><strong>Hiệu lực:</strong> Toàn hệ thống KCN &amp; Đối tác FDI</span>
              <span>•</span>
              <span><strong>Cập nhật:</strong> 01/09/2026</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tuân thủ Luật An Ninh Mạng &amp; Nghị Định 13</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. DATA FLOW VISUAL (SƠ ĐỒ PHÂN LUỒNG DỮ LIỆU BẢO MẬT KHÉP KÍN)           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#0052cc]" />
                <span>Sơ Đồ Phân Luồng &amp; Đóng Gói Dữ Liệu Khép Kín (Data Flow Sandbox)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Minh họa quy trình xử lý an toàn khi nhà máy tải lên kịch bản chiến dịch TAHOMART hoặc kết nối ERP Odoo đấu thầu giỏ màng co.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
              ZERO-TRUST ARCHITECTURE
            </span>
          </div>

          {/* 4-Step Interactive Pipeline Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono">1</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Input Data</span>
              </div>
              <h4 className="text-xs font-bold font-heading text-slate-900">
                Tải Lên Hồ Sơ / API Odoo
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Nhà máy gửi kịch bản truyền thông TAHOMART, BOM thầu giỏ màng co, token kết nối Odoo/SAP.
              </p>
              <div className="text-[10px] text-[#0052cc] font-mono font-bold pt-1">
                ➔ Cổng truyền TLS 1.3
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#0052cc] text-white text-xs font-black flex items-center justify-center font-mono">2</span>
                <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">Data Masking</span>
              </div>
              <h4 className="text-xs font-bold font-heading text-slate-900">
                Phân Mảnh &amp; Ẩn Danh
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Hệ thống tự động che mờ MST, đơn giá gốc và mã nhà máy; mã hóa AES-256 ngay trước khi lưu trữ.
              </p>
              <div className="text-[10px] text-emerald-700 font-mono font-bold pt-1">
                ✓ Ẩn danh danh tính 100%
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono">3</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Enclave Sandbox</span>
              </div>
              <h4 className="text-xs font-bold font-heading text-slate-900">
                Xử Lý Khép Kín Vùng Cách Ly
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Máy chủ AI khớp lệnh thầu chạy trong vùng bộ nhớ độc lập (Secure Enclave), tuyệt đối không rò rỉ cho bên thứ ba.
              </p>
              <div className="text-[10px] text-purple-700 font-mono font-bold pt-1">
                🔒 Không truy cập ngoài
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center font-mono">4</span>
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Matched Output</span>
              </div>
              <h4 className="text-xs font-bold font-heading text-slate-900">
                Khớp Lệnh Hợp Đồng Số
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Chỉ xuất kết quả điểm tương thích năng lực và kích hoạt hợp đồng điện tử khi cả 2 bên đồng ý mở thầu.
              </p>
              <div className="text-[10px] text-emerald-700 font-mono font-bold pt-1">
                ✓ Đối soát hóa đơn VAT
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TL;DR CARDS (3 THẺ TÓM TẮT ĐẶC QUYỀN BẢO MẬT THỰC CHIẾN)              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Anonymous Bidding */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-blue-50 text-[#0052cc]">
                <EyeOff className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                ẨN DANH 100%
              </span>
            </div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              1. Bảo Mật Đấu Thầu &amp; RFQ
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mọi kế hoạch mua sắm (như gói quà tặng Quốc Khánh 2/9 định dạng 9:16, giỏ màng co) được <strong>ẩn danh 100%</strong>. Đối thủ không thể biết đơn giá chào hoặc sản lượng thầu của bạn.
            </p>
          </div>

          {/* Card 2: Recruitment & DISC */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-purple-300 transition">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Lock className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                MÃ HÓA NHÂN SỰ
              </span>
            </div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              2. Bảo Mật Tuyển Dụng &amp; DISC
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dữ liệu tính cách DISC, bài kiểm tra thần số học và CV ứng viên kỹ thuật KCN được <strong>mã hóa phân quyền nghiêm ngặt</strong>, bảo vệ quyền riêng tư cá nhân của người lao động.
            </p>
          </div>

          {/* Card 3: 1-Click Data Purge */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-rose-300 transition">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Trash2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                GDPR COMPLIANT
              </span>
            </div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              3. Quyền Được Lãng Quên (1-Click)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cam kết <strong>xóa vĩnh viễn toàn bộ dữ liệu chỉ với 1 click</strong> theo chuẩn GDPR và Nghị định 13. Hệ thống sẽ thanh lọc sạch token kết nối và hồ sơ lưu nháp theo yêu cầu.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN BODY: STICKY TOC (25%) + INTERACTIVE ACCORDION CLAUSES (75%)      */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STICKY TABLE OF CONTENTS SIDEBAR (COL 4 - 25%) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#0052cc]" />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 font-heading">
                    Mục Lục Chính Sách Bảo Mật
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">7 ĐIỀU KHOẢN</span>
              </div>

              {/* Navigation list with live highlight */}
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

              {/* Data Protection Officer (DPO) Contact */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-mono space-y-1">
                <div className="font-bold text-slate-800">CÁN BỘ BẢO VỆ DỮ LIỆU (DPO):</div>
                <div>Email: dpo@chuoicungung.com</div>
                <div>Hotline khẩn cấp: 1900 8686 (Ext 102)</div>
              </div>
            </div>

            {/* Quick Action 1-Click Purge Widget */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold font-heading text-rose-700">
                <Trash2 className="w-4 h-4" />
                <span>Quyền Được Lãng Quên (Right to be Forgotten)</span>
              </div>
              <p className="text-[11px] text-rose-900/80 leading-relaxed">
                Yêu cầu xóa toàn bộ lịch sử thầu tạm và gỡ bỏ token kết nối Odoo/ERP của doanh nghiệp bạn ngay lập tức.
              </p>
              <button
                onClick={() => setIsPurgeModalOpen(true)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer font-heading"
              >
                Kích Hoạt Lệnh Xóa Dữ Liệu 1-Click
              </button>
            </div>
          </aside>

          {/* ACCORDION LEGAL CLAUSES (COL 8 - 75%) */}
          <main className="lg:col-span-8 space-y-4 max-w-[840px]">
            
            {/* Clause 1: Data Collection & Scope */}
            <div id="sec-1" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('sec-1')}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono shrink-0">
                    01
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                    Điều 1. Thu Thập Dữ Liệu B2B &amp; Phạm Vi Áp Dụng
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections['sec-1'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['sec-1'] && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <p>
                    <strong>1.1. Nguyên tắc tối thiểu hóa dữ liệu (Data Minimization):</strong> Nền tảng Chuỗi Cung Ứng Quốc Gia chỉ thu thập các thông tin thiết yếu phục vụ trực tiếp cho quá trình xác thực định danh pháp nhân, đăng tải nhu cầu mua sắm công nghiệp (RFQ) và điều phối năng lực sản xuất giữa các nhà máy trong 400+ KCN.
                  </p>
                  <p>
                    <strong>1.2. Danh mục dữ liệu được xử lý:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Thông tin doanh nghiệp: Tên pháp nhân, mã số thuế, giấy phép kinh doanh (GPKD), chứng chỉ chất lượng (ISO, RoHS, FDA, HACCP).</li>
                    <li>Thông tin giao dịch thầu: Quy cách kỹ thuật sản phẩm, tiến độ giao hàng, ngân sách dự kiến (được mã hóa).</li>
                    <li>Thông tin kỹ thuật hệ thống: Địa chỉ IP, nhật ký kiểm toán phiên làm việc, mã khóa công khai API Odoo/SAP.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Clause 2: Database Masking & AES-256 */}
            <div id="sec-2" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('sec-2')}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono shrink-0">
                    02
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                    Điều 2. Cơ Chế Mã Hóa Dữ Liệu Tầng Database (Data Masking &amp; Hashing)
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections['sec-2'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['sec-2'] && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <p>
                    <strong>2.1. Mã hóa một chiều (Hashing) cho thông tin xác thực:</strong> Toàn bộ mật khẩu tài khoản người dùng và mã PIN ký số đều được băm bằng thuật toán <strong>Argon2id / bcrypt với Salt ngẫu nhiên</strong>. Không bất kỳ kỹ sư hệ thống hoặc quản trị viên nào có khả năng đọc được mật khẩu gốc.
                  </p>
                  <p>
                    <strong>2.2. Mã hóa đối xứng AES-256 đối với chuỗi API Token:</strong> Mọi Access Token, Secret Key kết nối với phần mềm Odoo, SAP, Fast ERP của khách hàng đều được mã hóa đối xứng cấp độ quân sự (AES-256 GCM) ngay khi ghi xuống tầng lưu trữ dữ liệu (Database-at-Rest).
                  </p>
                  <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950">
                    🔒 <strong>Data Masking:</strong> Khi hiển thị trong các báo cáo phân tích thị trường hoặc màn hình giám sát, các trường dữ liệu nhạy cảm (như đơn giá chào thầu nội bộ, tên nhà cung cấp độc quyền) sẽ được che mặt nạ tự động (VD: <em>0912****89</em> hoặc <em>Nhà máy Cơ khí KCN B***</em>).
                  </div>
                </div>
              )}
            </div>

            {/* Clause 3: RFQ & Odoo ERP Privacy */}
            <div id="sec-3" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('sec-3')}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono shrink-0">
                    03
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                    Điều 3. Chính Sách Bảo Mật RFQ, Hồ Sơ Thầu &amp; Cổng Odoo/ERP
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections['sec-3'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['sec-3'] && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <p>
                    <strong>3.1. Bảo vệ kế hoạch mua sắm chuỗi:</strong> Các đơn hàng thu mua số lượng lớn từ chuỗi siêu thị (ví dụ: TAHOMART) hoặc các khối ngân hàng (ví dụ: HDBank mở gói thầu 15.000 hộp quà 9:16) được áp dụng chế độ <strong>Ẩn danh đấu thầu (Anonymous RFQ)</strong>. Danh tính bên mua và danh tính nhà máy nộp hồ sơ chỉ được mở khóa khi bước vào giai đoạn thương thảo hợp đồng chính thức.
                  </p>
                  <p>
                    <strong>3.2. Không can thiệp dữ liệu kế toán:</strong> Cổng kết nối Odoo B2B Bridge chỉ đọc duy nhất danh mục sản phẩm và trạng thái đơn hàng được người dùng cấu hình phân quyền; tuyệt đối không quét hóa đơn, sổ cái kế toán hay dữ liệu lương nội bộ.
                  </p>
                </div>
              )}
            </div>

            {/* Clause 4: Recruitment & DISC */}
            <div id="sec-4" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('sec-4')}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono shrink-0">
                    04
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                    Điều 4. Bảo Mật Dữ Liệu Tuyển Dụng &amp; Trắc Nghiệm DISC KCN
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections['sec-4'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['sec-4'] && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <p>
                    <strong>4.1. Mã hóa hồ sơ ứng viên:</strong> Thông tin cá nhân của người lao động, kỹ sư nhà máy (Số điện thoại, địa chỉ cư trú, căn cước công dân) được bảo vệ theo chế độ riêng tư. Doanh nghiệp tuyển dụng chỉ được xem thông tin chi tiết sau khi ứng viên bấm đồng ý kết nối phỏng vấn.
                  </p>
                  <p>
                    <strong>4.2. Bảo mật trắc nghiệm tâm lý &amp; DISC:</strong> Kết quả phân tích hành vi DISC và thần số học phục vụ định hướng nghề nghiệp được lưu trữ trong phân vùng dữ liệu cá nhân riêng biệt, không sử dụng cho mục đích chấm điểm tín dụng hoặc thương mại ngoài sàn.
                  </p>
                </div>
              )}
            </div>

            {/* Clause 5: Association Sharing */}
            <div id="sec-5" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('sec-5')}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono shrink-0">
                    05
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                    Điều 5. Cơ Chế Chia Sẻ Dữ Liệu Với Hiệp Hội &amp; BQL KCN
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections['sec-5'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['sec-5'] && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <p>
                    <strong>5.1. Dữ liệu vĩ mô tổng hợp:</strong> Nền tảng CCU chỉ cung cấp các chỉ số thống kê vĩ mô (như: Tổng sản lượng bao bì xuất khẩu, tỷ lệ lấp đầy xưởng tại KCN Bắc Ninh, nhu cầu thầu cơ khí theo quý) cho các Hiệp hội ngành nghề (VCCI, HUBA, VLA) và Ban Quản Lý KCN.
                  </p>
                  <p>
                    <strong>5.2. Nguyên tắc bất khả xâm phạm:</strong> Tuyệt đối không cung cấp danh tính cụ thể của từng hợp đồng, báo giá chi tiết của doanh nghiệp cho bất kỳ cơ quan hoặc bên thứ ba nào, trừ trường hợp có yêu cầu bằng văn bản từ cơ quan tố tụng có thẩm quyền theo quy định của pháp luật Việt Nam.
                  </p>
                </div>
              )}
            </div>

            {/* Clause 6: Rights & 1-Click Purge */}
            <div id="sec-6" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('sec-6')}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono shrink-0">
                    06
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                    Điều 6. Quyền Của Doanh Nghiệp &amp; Xóa Dữ Liệu 1-Click (Right to be Forgotten)
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections['sec-6'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['sec-6'] && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <p>
                    Theo Nghị định 13/2023/NĐ-CP và tiêu chuẩn GDPR, doanh nghiệp thành viên có đầy đủ các quyền:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Quyền truy cập &amp; trích xuất:</strong> Yêu cầu xuất toàn bộ dữ liệu hồ sơ thầu dưới định dạng JSON/Excel bất kỳ lúc nào.</li>
                    <li><strong>Quyền chỉnh sửa:</strong> Cập nhật chứng chỉ ISO, thông tin máy móc xưởng khi có thay đổi.</li>
                    <li><strong>Quyền xóa vĩnh viễn (Right to be Forgotten):</strong> Yêu cầu hủy bỏ tài khoản, xóa sạch lịch sử RFQ và thu hồi token Odoo khỏi cụm máy chủ trong vòng 24 giờ làm việc.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Clause 7: Data Breach Incident Response */}
            <div id="sec-7" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion('sec-7')}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] text-xs font-black flex items-center justify-center font-mono shrink-0">
                    07
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                    Điều 7. Quy Trình Ứng Phó Sự Cố Rò Rỉ Dữ Liệu (Data Breach Response)
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections['sec-7'] ? 'rotate-180' : ''}`} />
              </button>

              {expandedSections['sec-7'] && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <p>
                    Nền tảng CCU thiết lập quy trình phản ứng khẩn cấp 4 bước khi phát hiện dấu hiệu xâm phạm dữ liệu:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                      <strong className="text-rose-900 block font-heading">Bước 1: Cách Ly Trong 15 Phút</strong>
                      <span className="text-[11px] text-rose-800">Tự động ngắt kết nối cụm máy chủ bị tấn công, vô hiệu hóa token API liên quan.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <strong className="text-amber-900 block font-heading">Bước 2: Thông Báo Trong 72 Giờ</strong>
                      <span className="text-[11px] text-amber-800">Gửi văn bản cảnh báo tới các doanh nghiệp bị ảnh hưởng và Cục An Toàn Thông Tin.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <strong className="text-blue-900 block font-heading">Bước 3: Khắc Phục Lỗ Hổng</strong>
                      <span className="text-[11px] text-blue-800">Vá lỗi bảo mật, cấp mới chữ ký số và token mã hóa cho toàn bộ thành viên.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <strong className="text-emerald-900 block font-heading">Bước 4: Bồi Thường &amp; Kiểm Toán</strong>
                      <span className="text-[11px] text-emerald-800">Kích hoạt gói bảo hiểm an ninh mạng 10 tỷ VNĐ và công bố báo cáo kiểm toán độc lập.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================================== */}
            {/* 5. PRIVACY & CONSENT DASHBOARD (BẢNG ĐIỀU KHIỂN QUYỀN RIÊNG TƯ)     */}
            {/* =================================================================== */}
            <div className="bg-white rounded-3xl border-2 border-blue-500/30 p-6 sm:p-8 shadow-lg space-y-5 mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0052cc] text-white">
                      B2B CONSENT DASHBOARD
                    </span>
                    <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
                      Bảng Điều Khiển Quyền Riêng Tư &amp; Thông Báo Thầu
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Chủ động bật/tắt các quyền chia sẻ dữ liệu và thông báo FOMO. Thay đổi được áp dụng tức thì.
                  </p>
                </div>

                {consentSavedToast && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl animate-fadeIn flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Đã lưu quyền!
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Toggle 1: RFQ Alerts */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <strong className="font-bold text-slate-900 block font-heading">
                      Nhận thông báo thầu khẩn cấp &amp; biến động giá nguyên liệu qua Zalo/Email
                    </strong>
                    <p className="text-[11px] text-slate-500">
                      Gửi cảnh báo tức thì khi có gói thầu giỏ màng co, hộp quà 9:16 hoặc vật tư KCN phù hợp với bạn.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleConsent('rfqAlerts')}
                    className="shrink-0 p-1 cursor-pointer transition text-[#0052cc]"
                    title="Bật/Tắt"
                  >
                    {consents.rfqAlerts ? (
                      <ToggleRight className="w-8 h-8 text-[#0052cc]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                {/* Toggle 2: AI Behavioral Analytics */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <strong className="font-bold text-slate-900 block font-heading">
                      Cho phép AI phân tích hành vi tìm kiếm để gợi ý đơn hàng tương thích
                    </strong>
                    <p className="text-[11px] text-slate-500">
                      AI học lịch sử báo giá thầu của bạn để ưu tiên đề xuất các RFQ có tỷ lệ trúng thầu cao nhất.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleConsent('aiAnalytics')}
                    className="shrink-0 p-1 cursor-pointer transition text-[#0052cc]"
                    title="Bật/Tắt"
                  >
                    {consents.aiAnalytics ? (
                      <ToggleRight className="w-8 h-8 text-[#0052cc]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                {/* Toggle 3: Anonymous Benchmarking */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <strong className="font-bold text-slate-900 block font-heading">
                      Đóng góp dữ liệu sản lượng ẩn danh cho Báo Cáo Thị Trường Quốc Gia
                    </strong>
                    <p className="text-[11px] text-slate-500">
                      Số liệu công suất xưởng được làm mờ và tổng hợp để xây dựng chỉ số giá nguyên liệu chung cho 400+ KCN.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleConsent('anonymousBenchmark')}
                    className="shrink-0 p-1 cursor-pointer transition text-[#0052cc]"
                    title="Bật/Tắt"
                  >
                    {consents.anonymousBenchmark ? (
                      <ToggleRight className="w-8 h-8 text-[#0052cc]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                {/* Toggle 4: Analytics Cookies */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <strong className="font-bold text-slate-900 block font-heading">
                      Cookie phân tích tốc độ &amp; độ ổn định tải trang (Performance Cookies)
                    </strong>
                    <p className="text-[11px] text-slate-500">
                      Giúp kỹ thuật viên tối ưu hóa tốc độ load web cho các máy tính văn phòng tại Khu công nghiệp.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleConsent('performanceCookies')}
                    className="shrink-0 p-1 cursor-pointer transition text-[#0052cc]"
                    title="Bật/Tắt"
                  >
                    {consents.performanceCookies ? (
                      <ToggleRight className="w-8 h-8 text-[#0052cc]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* =================================================================== */}
            {/* 6. IMMUTABLE AUDIT TRAIL LOG BOX (BẰNG CHỨNG KIỂM TOÁN ĐIỆN TỬ)    */}
            {/* =================================================================== */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>IMMUTABLE AUDIT TRAIL RECORD (NHẬT KÝ KIỂM TOÁN BẤT BIẾN)</span>
                </div>
                <span className="text-[10px]">HASH: 0x9f8b...2c4a</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">USER ID ĐỊNH DANH</span>
                  <strong>CCU-FDI-99214</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">THỜI GIAN ĐỐI SOÁT</span>
                  <strong>01/09/2026 09:15:30 GMT+7</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ĐỊA CHỈ IP KIỂM TOÁN</span>
                  <strong>113.161.72.*** (Việt Nam)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PHIÊN BẢN CHẤP THUẬN</span>
                  <strong className="text-emerald-400">v2.1 (GDPR Verified)</strong>
                </div>
              </div>
            </div>

          </main>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. MODAL: 1-CLICK RIGHT TO BE FORGOTTEN CONFIRMATION                      */}
      {/* ========================================================================= */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-200 space-y-4 text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black font-heading text-slate-900">
                Xác Nhận Xóa Dữ Liệu 1-Click?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hệ thống sẽ xóa vĩnh viễn toàn bộ lịch sử RFQ nháp, token kết nối Odoo và các bản ghi cookie tạm thời theo chuẩn <strong>Right to be Forgotten (GDPR &amp; Nghị Định 13)</strong>.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-left space-y-1">
              <strong>Lưu ý:</strong>
              <p>Hành động này không thể hoàn tác. Các hợp đồng đã ký số CA chính thức sẽ được lưu trữ theo quy định của Luật Kế Toán 2015.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsPurgeModalOpen(false)}
                className="py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 transition font-heading cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmPurge}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white shadow-md transition font-heading cursor-pointer"
              >
                Xóa Vĩnh Viễn Ngay
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
