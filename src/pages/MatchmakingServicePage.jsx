import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Handshake, Building2, Factory, Users, Sparkles, Send,
  ArrowRight, CheckCircle2, ChevronRight, Clock, ShieldCheck,
  Calendar, MapPin, FileText, Check, AlertCircle, HelpCircle,
  ExternalLink, Layers, ArrowUpRight, Cpu, Target, Award,
  ListOrdered, UserCheck, MessageSquare, Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  MATCHMAKING_MODELS,
  QUY_TRINH_TO_CHUC_KET_NOI,
  MATCHMAKING_DELIVERABLES,
  MATCHMAKING_ADDONS,
  getActiveRelatedPrograms
} from '../data/servicesData';

export default function MatchmakingServicePage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const relatedPrograms = getActiveRelatedPrograms();
  const [selectedFormat, setSelectedFormat] = useState('plant-sourcing');

  // SEO Setup (Section 15 Spec 14.txt)
  useEffect(() => {
    document.title = 'Tổ Chức Kết Nối Doanh Nghiệp | CHUOICUNGUNG.COM';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tổ Chức Chương Trình Kết Nối Doanh Nghiệp Theo Nhu Cầu Thật",
      "description": "Dịch vụ tiếp nhận nhu cầu, tìm nhà cung ứng, tổ chức cuộc gặp và theo dõi đầu việc cho nhà máy, Hội và KCN.",
      "provider": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      },
      "url": "https://chuoicungung.com/dich-vu/to-chuc-ket-noi",
      "serviceType": "B2B Matchmaking and Supply Chain Sourcing Event Management"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'matchmaking-service-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('matchmaking-service-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('matchmaking-service-schema');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* SECTION 02: HERO (SPEC 14.TXT)                                            */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-900 via-[#0B2545] to-[#071E3D] text-white border-b border-slate-800 relative overflow-hidden">
        
        {/* Subtle engineering grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 relative z-10 space-y-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <Link to="/" title="Trang chủ" className="inline-flex items-center hover:text-white transition">
              <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain brightness-200" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link to="/dich-vu" className="hover:text-white transition">Trung Tâm Dịch Vụ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-400 font-bold">Tổ Chức Kết Nối B2B</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide uppercase">
              <Handshake className="w-3.5 h-3.5 text-blue-400" />
              <span>DỊCH VỤ TRỌNG TÂM • KẾT NỐI DỰA TRÊN NHU CẦU THẬT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-white">
              TỔ CHỨC CHƯƠNG TRÌNH KẾT NỐI THEO NHU CẦU DOANH NGHIỆP
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              CHUOICUNGUNG.COM phối hợp cùng đơn vị tổ chức để tiếp nhận nhu cầu, chuẩn bị hồ sơ, sắp xếp cuộc gặp và theo dõi đầu việc sau chương trình. Phạm vi triển khai được thống nhất theo mục tiêu, địa bàn và nguồn lực của từng hoạt động.
            </p>

            {/* Target Audience Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="text-slate-400 font-semibold text-[11px]">Dành cho:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-medium">Hội / Hiệp hội</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-medium">Ban Quản lý & Vận hành KCN</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-medium">Nhà máy FDI / Tập đoàn Buyer</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-medium">Tổ chức Xúc tiến thương mại</span>
            </div>

            {/* CTAs (Section 02 Spec 14.txt) */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                to="/yeu-cau-dich-vu?service=to-chuc-ket-noi"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>GỬI ĐỀ BÀI CHƯƠNG TRÌNH</span>
              </Link>

              <Link
                to="/chuong-trinh"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition"
              >
                <Calendar className="w-4 h-4 text-blue-300" />
                <span>XEM CHƯƠNG TRÌNH ĐANG MỞ</span>
              </Link>
            </div>

          </div>

          {/* Workflow Value Proposition Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 max-w-4xl text-xs space-y-2 mt-4">
            <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider font-heading flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Khác biệt cốt lõi: Không phải dịch vụ tổ chức Event hình thức</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Giá trị lớn nhất của CHUOICUNGUNG.COM không nằm ở âm thanh ánh sáng, mà nằm ở: 
              <strong className="text-white"> Chuẩn hóa nhu cầu Buyer ➔ Sàng lọc NCC phù hợp ➔ Sắp xếp cuộc gặp 1:1 ➔ Theo dõi gửi mẫu & Báo giá ➔ Đo lường kết quả thực</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03: HÌNH THỨC TRIỂN KHAI (4 CARDS - SPEC 14.TXT)                 */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-12">
        
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded uppercase">
              Mô hình triển khai
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              4 HÌNH THỨC TỔ CHỨC KẾT NỐI CHUYÊN BIỆT
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Lựa chọn hình thức phù hợp với mục tiêu, đối tượng tham gia và quy mô ngân sách dự kiến của đơn vị.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MATCHMAKING_MODELS.map((model, idx) => (
              <div
                key={model.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between space-y-4 group shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-mono font-black text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {model.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#0052cc] transition">
                    {model.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {model.shortDescription}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold">Phù hợp với: </span>
                      <span className="text-slate-700 font-medium">{model.suitableFor}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Quy mô mẫu: </span>
                      <span className="text-slate-800 font-bold font-mono">{model.typicalScale}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">
                    {model.deliverablesHighlight}
                  </span>
                  <Link
                    to={`/yeu-cau-dich-vu?service=to-chuc-ket-noi&format=${model.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-[#0052cc] text-[#0052cc] hover:text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
                  >
                    <span>Gửi đề bài</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* SECTION 04 & 11: QUY TRÌNH DỊCH VỤ 3 GIAI ĐOẠN & VAI TRÒ AI            */}
        {/* ======================================================================= */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Khép kín vòng đời giao thương
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              QUY TRÌNH 3 GIAI ĐOẠN VẬN HÀNH THỰC TẾ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Mỗi cuộc gặp phải có Owner, Next Action và NextActionAt cụ thể. Chúng tôi theo dõi đến khi có kết quả thử mẫu và báo giá chính thức.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {QUY_TRINH_TO_CHUC_KET_NOI.map((block, bIdx) => (
              <div
                key={bIdx}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Phase Header */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold">
                      {block.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {block.roleAi}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                      {block.phase}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-heading mt-0.5">
                      {block.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {block.description}
                    </p>
                  </div>

                  {/* Checklist Items */}
                  <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    {block.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Principle Alert Box */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                  ⚠️ <strong className="font-heading">Nguyên tắc:</strong> {block.principle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* SECTION 11: SUPPI + CHAINY ROLE ARCHITECTURE                           */}
        {/* ======================================================================= */}
        <div className="bg-gradient-to-r from-[#071E3D] via-[#0B2545] to-[#1E293B] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-2.5 py-0.5 rounded">
                CÔNG NGHỆ ĐỒNG HÀNH
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading mt-1 text-white">
                BỘ ĐÔI TRỢ LÝ SUPPI & CHAINY ĐIỀU PHỐI KẾT NỐI
              </h3>
            </div>
            <Link
              to="/tro-ly-ai"
              className="text-xs font-bold text-blue-300 hover:text-white inline-flex items-center gap-1 shrink-0"
            >
              <span>Tìm hiểu thêm về SUPPI & CHAINY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SUPPI Role */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold font-mono text-sm">
                  S
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">SUPPI — Trước Chương Trình</h4>
                  <span className="text-[10px] text-blue-300">Sourcing & Specification Specialist</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                SUPPI trực tiếp tương tác với Buyer để bóc tách thông số kỹ thuật, tiêu chuẩn chất lượng (ISO, IATF, RoHS), dự toán ngân sách và tự động rà soát cơ sở dữ liệu 32.000+ Nhà cung cấp để đề xuất danh sách ứng viên đạt chuẩn.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                • Đầu ra: Bản đặc tả nhu cầu B2B & Shortlist nhà cung ứng khả thi
              </div>
            </div>

            {/* CHAINY Role */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-sm">
                  C
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">CHAINY — Trong & Sau Chương Trình</h4>
                  <span className="text-[10px] text-emerald-300">Operations & Follow-up Coordinator</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                CHAINY xếp lịch làm việc 1:1, tự động nhắc hẹn hai bên, ghi nhận biên bản cuộc gặp, tạo đầu việc gửi mẫu thử/báo giá và tự động theo dõi tiến độ cho đến khi Buyer nghiệm thu kết quả đánh giá kỹ thuật.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                • Đầu ra: Bảng đầu việc SLA, theo dõi mẫu thử & Báo cáo kết quả giao thương
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* SECTION 05: BẠN NHẬN ĐƯỢC GÌ (DELIVERABLES & ADD-ONS)                   */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded uppercase">
              Cam kết đầu ra
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              BẠN NHẬN ĐƯỢC GÌ TRONG GÓI DỊCH VỤ TIÊU CHUẨN?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Toàn bộ các tài sản và báo cáo nghiệp vụ dưới đây được bàn giao minh bạch theo đúng quyền truy cập và cam kết bảo mật.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MATCHMAKING_DELIVERABLES.map((del, dIdx) => (
              <div
                key={dIdx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 font-heading">{del.name}</div>
                  <div className="text-[11px] text-slate-500">{del.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add-on options note (Section 05 Spec 14.txt) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 font-heading">
                Hạng Mục Tùy Chọn Bổ Sung (Add-on riêng)
              </h3>
              <span className="text-[11px] text-blue-700 font-semibold">
                Không tính trùng quyền lợi nếu đã có trong gói
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {MATCHMAKING_ADDONS.map(addon => (
                <div key={addon.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-800 font-medium">{addon.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">{addon.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* SECTION 10: REAL PROGRAMS SHOWCASE                                      */}
        {/* ======================================================================= */}
        {relatedPrograms.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded uppercase">
                  Thực tế đang diễn ra
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading mt-1">
                  Các chương trình đang tiếp nhận đăng ký trên hệ thống
                </h3>
              </div>
              <Link
                to="/chuong-trinh"
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Xem tất cả chương trình</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-blue-50/40 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-100">
                      {prog.typeName || 'B2B Matching'}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      ● {prog.statusName || prog.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 font-heading line-clamp-2">
                    {prog.title || prog.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{prog.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{prog.location}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <Link
                      to={`/chuong-trinh/${prog.id}`}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-between"
                    >
                      <span>Xem trang chương trình</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 14: COMMERCIAL RULES & TRANSPARENCY                            */}
        {/* ======================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 border border-slate-200 space-y-4 text-xs text-slate-700">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-heading flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>Nguyên Tắc Thương Mại & Cam Kết Dịch Vụ Của CHUOICUNGUNG.COM</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
            <div>
              <p>
                • <strong>Không cam kết con số giả định:</strong> Chúng tôi không bao giờ cam kết trước số lượng buyer, số lượng cuộc gặp hay giá trị hợp đồng khi chưa khảo sát thực tế tính khả thi và tiêu chuẩn kỹ thuật của danh mục nhu cầu.
              </p>
            </div>
            <div>
              <p>
                • <strong>Báo giá minh bạch theo phạm vi:</strong> Mức kinh phí triển khai phụ thuộc hoàn toàn vào số lượng phiên matching, địa bàn tổ chức, mức độ chuyên sâu của thẩm định kỹ thuật và các gói add-on đính kèm.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* BOTTOM CTA: GỬI ĐỀ BÀI (SPEC 14.TXT)                                   */}
        {/* ======================================================================= */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white text-center space-y-5 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight">
              BẮT ĐẦU CHUẨN BỊ CHO CHƯƠNG TRÌNH KẾT NỐI CỦA BẠN
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Mô tả sơ bộ mục tiêu, đối tượng tham gia và thời gian dự kiến. Đội ngũ chuyên gia của CHUOICUNGUNG.COM sẽ chủ động liên hệ để cùng bạn xác lập phạm vi và phương án tối ưu.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/yeu-cau-dich-vu?service=to-chuc-ket-noi"
              className="py-3 px-8 rounded-xl bg-white text-blue-950 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>GỬI ĐỀ BÀI CHƯƠNG TRÌNH</span>
            </Link>
            <Link
              to="/dich-vu"
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition"
            >
              <span>Xem tất cả dịch vụ</span>
            </Link>
          </div>
        </div>

      </main>

    </div>
  );
}
