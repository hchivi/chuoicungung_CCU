import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Handshake, Package, Video, Radio, ArrowRight, CheckCircle2,
  Calendar, MapPin, Building2, ShieldCheck, Sparkles, Send,
  ChevronRight, Clock, Users, FileText, Check, HelpCircle,
  ExternalLink, Layers, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getAllPublishableServices, 
  getActiveRelatedPrograms 
} from '../data/servicesData';

export default function ServicesCenterPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Danh sách các dịch vụ công bố (Chỉ 4 dịch vụ active, ẩn hoàn toàn Phúc lợi)
  const services = getAllPublishableServices();
  const relatedPrograms = getActiveRelatedPrograms();

  // Multi-select state for combined package (Section 8)
  const [selectedServices, setSelectedServices] = useState([
    'to-chuc-ket-noi',
    'vat-pham-su-kien'
  ]);

  const toggleServiceSelection = (slug) => {
    setSelectedServices(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // SEO Setup
  useEffect(() => {
    document.title = 'Dịch vụ B2B | CHUOICUNGUNG.COM';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Các dịch vụ tổ chức kết nối, vật phẩm doanh nghiệp, hồ sơ – truyền thông và hiện diện tại chương trình dành cho doanh nghiệp, Hội và KCN.';

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', 'https://chuoicungung.com/dich-vu');

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Dịch vụ B2B | CHUOICUNGUNG.COM",
      "description": "Các dịch vụ tổ chức kết nối, vật phẩm doanh nghiệp, hồ sơ – truyền thông và hiện diện tại chương trình dành cho doanh nghiệp, Hội và KCN.",
      "url": "https://chuoicungung.com/dich-vu",
      "hasPart": services.map(s => ({
        "@type": "Service",
        "name": s.name,
        "description": s.shortDescription,
        "provider": {
          "@type": "Organization",
          "name": "CHUOICUNGUNG.COM"
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'services-center-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('services-center-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('services-center-schema');
      if (el) el.remove();
    };
  }, [services]);

  // Icon map
  const renderServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Handshake': return <Handshake className="w-6 h-6 text-blue-600" />;
      case 'Package': return <Package className="w-6 h-6 text-emerald-600" />;
      case 'Video': return <Video className="w-6 h-6 text-purple-600" />;
      case 'Radio': return <Radio className="w-6 h-6 text-amber-600" />;
      default: return <Layers className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* HERO SECTION (SECTION 02 SPEC 13.TXT)                                     */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-900 via-[#0B2545] to-[#071E3D] text-white border-b border-slate-800 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 relative z-10 space-y-5">
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <Link to="/" title="Trang chủ" className="inline-flex items-center hover:text-white transition">
              <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain brightness-200" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-400 font-bold">Trung Tâm Dịch Vụ B2B</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Dịch Vụ Thực Tế • Cam Kết Đầu Ra & Báo Giá Minh Bạch</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-white">
              Dịch vụ hỗ trợ kết nối B2B
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              Chọn dịch vụ phù hợp với công việc bạn đang cần: tổ chức chương trình, chuẩn bị vật phẩm, giới thiệu năng lực hoặc tham gia một hoạt động kết nối. CHUOICUNGUNG.COM tiếp nhận yêu cầu và thống nhất phạm vi, chi phí, thời hạn trước khi triển khai.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#danh-sach-dich-vu"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold shadow-md transition font-heading cursor-pointer"
              >
                <span>CHỌN NHU CẦU</span>
              </a>
              <Link
                to="/yeu-cau-dich-vu"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 font-heading"
              >
                <Send className="w-4 h-4" />
                <span>GỬI YÊU CẦU</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4 SERVICE CARDS (SECTION 03 SPEC 13.TXT) - GRID 2x2                       */}
      {/* ========================================================================= */}
      <div id="danh-sach-dich-vu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-10">
        
        {/* Services Grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 p-6 sm:p-8 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-blue-50 border border-slate-200/80 group-hover:border-blue-200 flex items-center justify-center transition">
                    {renderServiceIcon(srv.icon)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {srv.badge}
                  </span>
                </div>

                {/* Service Title */}
                <div className="space-y-1.5">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading group-hover:text-[#0052cc] transition">
                    {srv.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    “{srv.shortDescription}”
                  </p>
                </div>

                {/* Key Deliverables (Section 06: Mỗi dịch vụ phải có đầu ra rõ ràng) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                    Đầu ra thực tế bàn giao:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {srv.deliverables.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing Rule Note (Section 09: Không dùng fake price) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mức phí triển khai:</span>
                  <span className="font-bold text-slate-800 font-heading">{srv.pricingNote}</span>
                </div>

              </div>

              {/* Card Action Buttons (Section 03 & 07) */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Link
                  to={srv.ctaUrl}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>{srv.ctaLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to={`/yeu-cau-dich-vu?service=${srv.slug}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>GỬI YÊU CẦU</span>
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* ======================================================================= */}
        {/* SECTION 10 — PROGRAM INTEGRATION (REUSE REAL PROGRAM DATA)             */}
        {/* ======================================================================= */}
        {relatedPrograms.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-bold rounded uppercase">
                  TỔ CHỨC KẾT NỐI DOANH NGHIỆP
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading mt-1">
                  Các chương trình kết nối thực tế đang tiếp nhận đăng ký
                </h3>
              </div>
              <Link
                to="/chuong-trinh"
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                Xem tất cả chương trình
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
                      <span>Chi tiết sự kiện</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* SECTION 08 — GÓI KẾT HỢP (COMBINED SERVICES - SPEC 13.TXT)               */}
        {/* ======================================================================= */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg space-y-6">
          
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              BẠN CẦN KẾT HỢP NHIỀU DỊCH VỤ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hãy mô tả chương trình, đối tượng tham gia và thời gian dự kiến. Chúng tôi sẽ cùng bạn xác định các hạng mục cần thiết và gửi đề xuất phối hợp trọn gói.
            </p>
          </div>

          {/* Interactive Multi-Select Service Checkboxes (Section 8) */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] text-blue-300 font-bold uppercase tracking-wider">
              Chọn các dịch vụ doanh nghiệp muốn tích hợp cùng lúc:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {services.map((srv) => {
                const isChecked = selectedServices.includes(srv.slug);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleServiceSelection(srv.slug)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                      isChecked
                        ? 'bg-blue-600/30 border-blue-400 text-white shadow-xs'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      isChecked ? 'bg-[#0052cc] border-[#0052cc] text-white' : 'border-slate-400 bg-transparent'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs font-semibold truncate">{srv.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="text-xs text-slate-400">
              Đã chọn: <strong className="text-white font-mono">{selectedServices.length}</strong> dịch vụ phối hợp
            </div>
            <button
              onClick={() => {
                const params = selectedServices.join(',');
                navigate(`/yeu-cau-dich-vu?services=${params}`);
              }}
              className="py-3 px-6 rounded-xl bg-white text-blue-950 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <span>GỬI ĐỀ BÀI TỔNG HỢP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </main>
  );
}
