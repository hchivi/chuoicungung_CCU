import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Factory, MapPin, Users, Layers, ArrowRight, ShieldCheck, 
  CheckCircle2, Sparkles, Compass, Handshake, ChevronRight, FileText, 
  Calendar, Database, Search, ArrowUpRight, Check, Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function EcosystemOverviewPage() {
  const { t, lang } = useLanguage();

  // SEO: Title, Meta Description, Canonical URL, JSON-LD Schema
  useEffect(() => {
    // 1. Exact Title
    document.title = 'Hệ sinh thái chuỗi cung ứng | CHUOICUNGUNG.COM';

    // 2. Meta description specific to real ecosystem data
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Hệ sinh thái chuỗi cung ứng công nghiệp Việt Nam: nền tảng kết nối xác thực giữa nhà máy sản xuất, nhà cung ứng phụ trợ, khu công nghiệp và hiệp hội ngành nghề theo 6 giai đoạn vòng đời.';

    // 3. Self-canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://chuoicungung.com/he-sinh-thai';

    // 4. Schema JSON-LD Structured Data
    const schemaScriptId = 'ecosystem-schema-jsonld';
    let schemaScript = document.getElementById(schemaScriptId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaScriptId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Hệ sinh thái chuỗi cung ứng | CHUOICUNGUNG.COM",
      "description": "Bản đồ hạ tầng kết nối các bên tham gia chuỗi cung ứng sản xuất công nghiệp tại Việt Nam.",
      "url": "https://chuoicungung.com/he-sinh-thai",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": "https://chuoicungung.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Hệ sinh thái chuỗi cung ứng",
            "item": "https://chuoicungung.com/he-sinh-thai"
          }
        ]
      }
    });

    return () => {
      const script = document.getElementById(schemaScriptId);
      if (script) script.remove();
    };
  }, []);

  const handleScrollToData = (e) => {
    e.preventDefault();
    const el = document.getElementById('du-lieu-he-sinh-thai');
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 antialiased overflow-x-hidden selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 01. BREADCRUMB & HERO BANNER                                              */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#071d38] via-[#09294f] to-[#0d3b6f] text-white pt-6 pb-12 sm:pb-16 relative overflow-hidden border-b border-slate-800/80">
        
        {/* Optical Ambient Illumination */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[200px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          {/* Breadcrumb có căn cứ */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
            <Link to="/" title="Trang chủ" className="inline-flex items-center hover:text-white transition">
              <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain brightness-110" />
              <span className="ml-1.5 text-slate-300 hover:text-white">Trang chủ</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sky-300 font-semibold">Hệ sinh thái chuỗi cung ứng</span>
          </nav>

          {/* Hero Core Copy */}
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-200 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>HẠ TẦNG KẾT NỐI SẢN XUẤT CÔNG NGHIỆP VIỆT NAM</span>
            </div>

            {/* Exactly ONE H1 on page */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.15] font-heading">
              Hệ sinh thái chuỗi cung ứng
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-3xl font-normal">
              Bản đồ hạ tầng kết nối các bên tham gia chuỗi cung ứng công nghiệp tại Việt Nam: Nhà máy sản xuất, Nhà cung ứng năng lực thực tế, Khu công nghiệp và Hiệp hội ngành nghề. Khớp lệnh chuẩn xác dựa trên 6 giai đoạn và 18 pha vòng đời dự án.
            </p>

            {/* CTAs: "Xem dữ liệu liên quan / Bắt đầu nhu cầu" */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#du-lieu-he-sinh-thai"
                onClick={handleScrollToData}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-[#0052cc] rounded-xl font-extrabold text-xs sm:text-sm font-heading shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer"
              >
                <span>Xem dữ liệu liên quan</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/dang-nhu-cau"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600/90 hover:bg-blue-600 border border-white/20 text-white rounded-xl font-extrabold text-xs sm:text-sm font-heading shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer"
              >
                <span>Bắt đầu nhu cầu</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs text-slate-300 border-t border-white/10 mt-6">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dữ liệu thực tế xác thực MST</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
                <span>Chuẩn hóa 6 giai đoạn &amp; 18 pha</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Không thu thập thông tin ảo</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. 4 NHÓM CHỦ THỂ TRỌNG TÂM TRONG HỆ SINH THÁI                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-6">
        
        <div className="space-y-1.5 text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0052cc] font-bold">
            CÁC BÊN THAM GIA HỆ SINH THÁI
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-heading tracking-tight">
            4 Nhóm chủ thể trọng tâm trong chuỗi cung ứng
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Mỗi chủ thể đóng vai trò mắt xích không thể tách rời, tương tác trực tiếp theo quy trình minh bạch nhằm tối ưu hóa chi phí và đẩy nhanh tiến độ sản xuất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Pillar 1: Nhà máy sản xuất & Bên mua */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
                  Nhà máy &amp; Bên mua FDI
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Manufacturing &amp; Buyers</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Các nhà máy FDI và tập đoàn sản xuất lớn phát hành bài toán thu mua linh kiện, phụ trợ, bao bì đóng gói và bảo hộ định kỳ.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Công bố gói thầu &amp; yêu cầu mẫu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Bảo mật thông tin dự thầu</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to="/nha-may" className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 font-heading">
                <span>Tra cứu Nhà máy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Nhà cung ứng phụ trợ */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
                  Nhà cung ứng phụ trợ
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Verified Supporting Vendors</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mạng lưới xưởng chế tạo cơ khí chính xác, khuôn mẫu, bao bì, hóa chất và tự động hóa có năng lực thực tế và chứng chỉ hợp chuẩn.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Xác thực MST &amp; hồ sơ máy móc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Báo giá cạnh tranh trực tiếp</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to="/nha-cung-ung" className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 font-heading">
                <span>Danh bạ Nhà cung ứng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Khu công nghiệp */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
                  Khu công nghiệp (KCN)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Industrial Parks &amp; Logistics</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bản đồ 480+ KCN toàn quốc, thông tin diện tích, tỷ lệ lấp đầy, hạ tầng điện nước, xưởng xây sẵn và chính sách thu hút đầu tư.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Định vị GIS 63 tỉnh thành</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Mạng lưới cụm xưởng vệ tinh</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to="/khu-cong-nghiep" className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 font-heading">
                <span>Bản đồ KCN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 4: Hội & Hiệp hội ngành nghề */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
                  Hội &amp; Hiệp hội ngành nghề
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Industry Associations</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Liên minh cùng các Hội Cơ khí, Điện tử, Da giày, Dệt may, Chế biến gỗ và Logistics để hỗ trợ doanh nghiệp hội viên mở rộng thị trường.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Bảo trợ chuyên môn &amp; hội viên</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Xúc tiến cung - cầu xuất khẩu</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to="/hiep-hoi" className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 font-heading">
                <span>Tra cứu Hiệp hội</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 03. HẠ TẦNG DỮ LIỆU & ĐIỀU PHỐI (ID: du-lieu-he-sinh-thai)                 */}
      {/* ========================================================================= */}
      <section id="du-lieu-he-sinh-thai" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-6 scroll-mt-24">
        
        <div className="space-y-1.5 text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0052cc] font-bold">
            DỮ LIỆU LIÊN QUAN TRỰC TIẾP
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-heading tracking-tight">
            Hạ tầng dữ liệu &amp; Chu trình điều phối liên kết
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Hệ sinh thái vận hành trên các cổng dữ liệu thật được cập nhật định kỳ, cho phép truy xuất và kết nối nhanh chóng theo từng mục đích công việc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: 6 Giai đoạn & 18 Pha */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition group space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-[#0052cc] px-2 py-0.5 rounded-full border border-blue-100">
                18 PHA KỸ THUẬT
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
              Bản đồ 6 Giai đoạn Vòng đời
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mô hình chuẩn hóa toàn bộ vòng đời dự án: Chuẩn bị đầu tư, Thiết kế thi công, Lắp đặt máy móc, Vận hành sản xuất và Nâng cấp xưởng.
            </p>
            <div className="pt-3 border-t border-slate-100">
              <Link to="/ban-do-6-giai-doan" className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 font-heading">
                <span>Khám phá bản đồ 6 giai đoạn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Sàn nhu cầu mua sắm B2B */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition group space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-100">
                ĐƠN HÀNG THẬT
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
              Sàn Nhu Cầu Mua Sắm B2B
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các bài toán thu mua, đơn đặt hàng gia công linh kiện và tìm nhà cung ứng phụ trợ đang mở thầu trên toàn quốc.
            </p>
            <div className="pt-3 border-t border-slate-100">
              <Link to="/san-nhu-cau" className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 font-heading">
                <span>Xem danh mục gói thầu đang mở</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Công cụ chẩn đoán định vị */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition group space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-100">
                ĐỊNH VỊ NHANH
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
              Tôi Ở Giai Đoạn Nào?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trắc nghiệm nhanh giúp doanh nghiệp xác định chính xác vị trí vòng đời để kết nối đúng nhà cung ứng tương ứng với nhu cầu hiện tại.
            </p>
            <div className="pt-3 border-t border-slate-100">
              <Link to="/dinh-vi-doanh-nghiep" className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 font-heading">
                <span>Làm trắc nghiệm định vị (2 phút)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Chương trình kết nối B2B */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition group space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                SỰ KIỆN TẠI KCN
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
              Ngày Hội Chuỗi Cung Ứng
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các kỳ Sourcing Day, triển lãm chuỗi cung ứng và phiên gặp gỡ B2B Matchmaking 1:1 tổ chức thực tế tại các khu công nghiệp.
            </p>
            <div className="pt-3 border-t border-slate-100">
              <Link to="/chuong-trinh" className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 font-heading">
                <span>Xem lịch sự kiện &amp; đăng ký</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 5: Dịch vụ hỗ trợ kỹ thuật */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition group space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                DỊCH VỤ B2B
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
              Dịch Vụ Hỗ Trợ Kết Nối
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bóc tách bản vẽ kỹ thuật, chuẩn hóa E-Catalogue sản xuất, tổ chức kết nối 1:1 tại xưởng và sản xuất quà tặng doanh nghiệp.
            </p>
            <div className="pt-3 border-t border-slate-100">
              <Link to="/dich-vu" className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 font-heading">
                <span>Xem 4 nhóm dịch vụ thực thi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 6: Hợp tác chiến lược */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#0052cc] transition group space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Handshake className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                ĐỒNG HÀNH
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0052cc] transition font-heading">
              Hợp Tác &amp; Đồng Hành
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cơ chế hợp tác Founding Partner độc quyền ngành hàng, nhà tài trợ sự kiện, đối tác phát triển referral và hội đồng chuyên môn.
            </p>
            <div className="pt-3 border-t border-slate-100">
              <Link to="/hop-tac" className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 font-heading">
                <span>Trung tâm hợp tác toàn diện</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 04. 3 NGUYÊN TẮC CỐT LÕI BẢO ĐẢM GIÁ TRỊ THỰC                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0052cc] font-bold">
              NGUYÊN TẮC VẬN HÀNH
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              3 Cam kết bảo vệ tính khách quan &amp; giá trị thực tế
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0052cc] flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm font-heading">Dữ Liệu Thật — Năng Lực Thật</h4>
              <p>Mọi hồ sơ doanh nghiệp đều được đối chiếu thông tin pháp lý (MST), năng lực máy móc và xưởng sản xuất thực tế trước khi hiển thị huy hiệu xác thực.</p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm font-heading">Bảo Mật Dự Thầu &amp; Chống Rò Rỉ</h4>
              <p>Danh tính bên mua và giá chào hàng được bảo mật tuyệt đối cho đến khi phê duyệt danh sách rút gọn (shortlist), chặn đứng các chào giá rác/spam.</p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm font-heading">Tôn Trọng Chuỗi Sẵn Có</h4>
              <p>Hệ sinh thái đóng vai trò bổ khuyết mắt xích còn thiếu, không làm gián đoạn hay cạnh tranh với các mối liên kết bạn hàng truyền thống đã ổn định.</p>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 05. ACTION CTA BANNER                                                     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        <div className="bg-gradient-to-r from-[#072847] via-[#0052cc] to-[#072847] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl space-y-6 relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading tracking-tight leading-tight">
              Bắt đầu kết nối cùng Hệ sinh thái Chuỗi Cung Ứng
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Cho dù bạn là Nhà máy cần tìm xưởng gia công hay Nhà cung ứng muốn mở rộng đơn hàng FDI, nền tảng luôn sẵn sàng hỗ trợ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/dang-nhu-cau"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-[#0052cc] rounded-xl font-black text-xs sm:text-sm uppercase font-heading tracking-wider shadow-md hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
            >
              <span>ĐĂNG NHU CẦU MUA SẮM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/tao-ho-so"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600/80 hover:bg-blue-600 border border-white/20 text-white rounded-xl font-black text-xs sm:text-sm uppercase font-heading tracking-wider transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>GIỚI THIỆU NĂNG LỰC DOANH NGHIỆP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </section>

    </main>
  );
}
