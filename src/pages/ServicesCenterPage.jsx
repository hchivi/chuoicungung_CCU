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
      {/* HERO SECTION (LIGHT PANORAMIC TASTE SPEC)                                */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* HERO SECTION (LIGHT PANORAMIC TASTE SPEC - MATCHES IMAGE 1 LAYOUT)       */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        
        {/* Background Panoramic B2B Meeting Visual (Boss in Image 2 context) */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/b2b_services_hero.jpg" 
            alt="Dịch vụ hỗ trợ kết nối B2B" 
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        <div className="hero-standard-container relative z-10 py-8 sm:py-10" style={{ width: 'min(1280px, calc(100% - 48px))', marginInline: 'auto' }}>
          
          {/* Breadcrumb aligned exactly as Image 1 */}
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn trang">
            <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-900 font-medium" aria-current="page">Dịch vụ</span>
          </nav>

          <div className="max-w-xl">
            
            <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
              Tổ chức kết nối doanh nghiệp
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
              Dịch vụ hỗ trợ<br />kết nối B2B.
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
              Đúng người để trao đổi.<br />Rõ việc để đi tiếp.
            </p>

            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
              Chọn dịch vụ phù hợp với công việc bạn đang cần: tổ chức chương trình, chuẩn bị vật phẩm, giới thiệu năng lực hoặc tham gia một hoạt động kết nối. CHUOICUNGUNG.COM tiếp nhận yêu cầu và thống nhất phạm vi, chi phí, thời hạn trước khi triển khai.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#danh-sach-dich-vu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95"
              >
                <span>Chọn nhu cầu</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/yeu-cau-dich-vu"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2"
              >
                <span>Gửi yêu cầu dịch vụ</span>
                <Send className="w-4 h-4" />
              </Link>
            </div>

            {/* Verification highlights under CTA */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Báo giá minh bạch theo phạm vi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thẩm định KYC doanh nghiệp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đầu ra thực tế có nghiệm thu</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Floating 4-Metric Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100/90 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>CAM KẾT 100%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-950 mt-1">100%</div>
            <div className="text-xs text-slate-500 font-normal mt-0.5">Đầu ra nghiệm thu thực tế</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100/90 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc]"></span>
              <span>PHẢN HỒI NHANH</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-950 mt-1">&lt; 24h</div>
            <div className="text-xs text-slate-500 font-normal mt-0.5">Phản hồi &amp; tư vấn đề bài</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100/90 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              <span>HỆ THỐNG GIAO THƯƠNG</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-950 mt-1">4 Nhóm</div>
            <div className="text-xs text-slate-500 font-normal mt-0.5">Dịch vụ chuyên biệt B2B</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100/90 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>MINH BẠCH CHI PHÍ</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-950 mt-1">0đ Phí Ẩn</div>
            <div className="text-xs text-slate-500 font-normal mt-0.5">Thống nhất trước triển khai</div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 SERVICE CARDS (SECTION 03 SPEC 13.TXT) - EDITORIAL ARCHITECTURE         */}
      {/* ========================================================================= */}
      <div id="danh-sach-dich-vu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 relative z-20 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-[#0052cc] text-xs font-mono font-bold tracking-wider uppercase">
              <span>DANH MỤC DỊCH VỤ THỰC THI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight">
              4 Nhóm Dịch Vụ Hỗ Trợ Chuyên Biệt
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Được thiết kế dựa trên nhu cầu thực tế của các nhà máy sản xuất, doanh nghiệp FDI, ban quản lý KCN và hội ngành nghề tại Việt Nam.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TIẾP NHẬN YÊU CẦU 24/7</span>
          </div>
        </div>

        {/* Services Grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((srv) => {
            const SERVICE_IMAGES = {
              'to-chuc-ket-noi': '/images/services/service_vn_matchmaking.jpg',
              'vat-pham-su-kien': '/images/services/service_vn_corporate_gifts.jpg',
              'truyen-thong-doanh-nghiep': '/images/services/service_vn_media_profile.jpg',
              'hien-dien-tu-xa': '/images/roles/role_vn_sponsor_pavilion.jpg'
            };
            const serviceImg = SERVICE_IMAGES[srv.slug] || '/images/b2b_services_hero.jpg';

            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#0052cc] p-5 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  
                  {/* Service Visual Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80">
                    <img
                      src={serviceImg}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Service Title */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading group-hover:text-[#0052cc] transition">
                      {srv.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      “{srv.shortDescription}”
                    </p>
                  </div>

                  {/* Target Audience */}
                  {srv.targetAudience && srv.targetAudience.length > 0 && (
                    <div className="pt-2 text-xs text-slate-500 space-y-1.5">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        ĐỐI TƯỢNG PHÙ HỢP:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {srv.targetAudience.map((aud, aIdx) => (
                          <span key={aIdx} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700 text-[11px] font-medium">
                            {aud}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Deliverables */}
                  <div className="space-y-2.5 pt-3.5 border-t border-slate-100">
                    <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      ĐẦU RA THỰC TẾ BÀN GIAO:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {srv.deliverables.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                          <span className="leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Rule Note */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Mức phí triển khai:</span>
                    <span className="font-bold text-slate-900 font-heading">{srv.pricingNote}</span>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <Link
                    to={srv.ctaUrl}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs font-heading group/btn"
                  >
                    <span>{srv.ctaLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>

                  <Link
                    to={`/yeu-cau-dich-vu?service=${srv.slug}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0041a8] text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 font-heading"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>GỬI YÊU CẦU</span>
                  </Link>
                </div>

              </div>
            );
          })}
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
