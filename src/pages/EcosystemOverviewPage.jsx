import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Factory, MapPin, Users, Layers, ArrowRight, ShieldCheck, 
  CheckCircle2, Sparkles, Compass, Handshake, ChevronRight, FileText, 
  Calendar, Database, Search, ArrowUpRight, Check, Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import EcosystemConnectSection from '../components/ecosystem/EcosystemConnectSection';

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
      {/* 01. BREADCRUMB & HERO BANNER (MATCHES IMAGE 2 LAYOUT & TEXT HIERARCHY)    */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        
        {/* Right Half Industrial Video with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            poster="/images/industrial_park_hero.jpg"
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
          >
            <source src="/images/industrial_drone_flycam_480p.webm" type="video/webm" />
            <source src="/images/industrial_drone_flycam.webm" type="video/webm" />
            <img 
              src="/images/industrial_park_hero.jpg" 
              alt="Hạ tầng sản xuất chuỗi cung ứng Việt Nam"
              className="w-full h-full object-cover object-center scale-105"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Content Container Aligned Exactly with Image 2 */}
        <div className="hero-standard-container relative z-10 py-8 sm:py-10" style={{ width: 'min(1280px, calc(100% - 48px))', marginInline: 'auto' }}>
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn trang">
            <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-900 font-medium" aria-current="page">Hệ sinh thái chuỗi cung ứng</span>
          </nav>

          <div className="max-w-xl">
            
            {/* Category Label */}
            <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
              Hạ tầng kết nối sản xuất công nghiệp Việt Nam
            </p>

            {/* H1 Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
              Hệ sinh thái<br />chuỗi cung ứng.
            </h1>

            {/* Lede (Tagline) */}
            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
              Đúng đối tác tham gia.<br />Rõ giai đoạn kết nối.
            </p>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
              Bản đồ hạ tầng kết nối các bên tham gia chuỗi cung ứng công nghiệp tại Việt Nam: Nhà máy sản xuất, Nhà cung ứng năng lực thực tế, Khu công nghiệp và Hiệp hội ngành nghề.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#du-lieu-he-sinh-thai"
                onClick={handleScrollToData}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>Xem dữ liệu liên quan</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/dang-nhu-cau"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2"
              >
                <span>Bắt đầu nhu cầu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 02. FLOATING STATS BAR (REAL VERIFIED ECOSYSTEM METRICS)                  */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-10 sm:-mt-12 lg:-mt-14">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="p-2 sm:p-0 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">BÊN MUA FDI</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-heading tracking-tight">500+ Nhà Máy</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Phát hành bài toán & nhu cầu cung ứng</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">XƯỞNG NỘI ĐỊA</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-heading tracking-tight">24.000+ Xưởng</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Xác thực KYC & năng lực sản xuất</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">HẠ TẦNG KCN</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-heading tracking-tight">480+ KCN & CCN</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Tọa độ GIS & hạ tầng 63 tỉnh thành</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-6 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">LIÊN MINH NGÀNH</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-heading tracking-tight">21+ Hiệp Hội</div>
              <p className="text-[11.5px] text-slate-500 leading-snug">Bảo trợ chuyên môn & xúc tiến thương mại</p>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 03. 4 NHÓM CHỦ THỂ TRỌNG TÂM (TASTE SKILL — NO AI FLOP ICONS + VIDEO PROOF)*/}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-[#0052cc] text-xs font-mono font-bold tracking-wider uppercase">
              <span>CÁC BÊN THAM GIA HỆ SINH THÁI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight">
              4 Nhóm chủ thể trọng tâm trong chuỗi cung ứng
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Mỗi chủ thể đóng vai trò mắt xích không thể tách rời, tương tác trực tiếp theo quy trình minh bạch nhằm tối ưu hóa chi phí và đẩy nhanh tiến độ sản xuất.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>HẠ TẦNG KẾT NỐI KHÔNG TRUNG GIAN</span>
          </div>
        </div>


        {/* 4 Cards Architecture (Editorial B2B, No Flop Icons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Pillar 1: Nhà máy sản xuất & Bên mua FDI */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-lg hover:border-[#0052cc] transition-all flex flex-col justify-between group hover:-translate-y-1 duration-300">
            <div className="space-y-3">
              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80">
                <img
                  src="/images/pillar_fdi_factory.jpg"
                  alt="Nhà máy & Bên mua FDI"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent"></div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  MANUFACTURING &amp; BUYERS
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0052cc] transition font-heading mt-0.5">
                  Nhà máy &amp; Bên mua FDI
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Các nhà máy FDI và tập đoàn sản xuất lớn phát hành bài toán thu mua linh kiện, phụ trợ, bao bì đóng gói và bảo hộ định kỳ.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc]"></span>
                  <span>Công bố gói thầu &amp; yêu cầu mẫu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc]"></span>
                  <span>Bảo mật thông tin dự thầu</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link to="/nha-may" className="text-xs font-bold text-[#0052cc] hover:text-[#003d8f] flex items-center justify-between font-heading group/link">
                <span>Tra cứu Nhà máy</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Nhà cung ứng phụ trợ */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-lg hover:border-sky-600 transition-all flex flex-col justify-between group hover:-translate-y-1 duration-300">
            <div className="space-y-3">
              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80">
                <img
                  src="/images/pillar_supporting_vendor.jpg"
                  alt="Nhà cung ứng phụ trợ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent"></div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  SUPPORTING VENDORS
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-700 transition font-heading mt-0.5">
                  Nhà cung ứng phụ trợ
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Mạng lưới xưởng chế tạo cơ khí chính xác, khuôn mẫu, bao bì, hóa chất và tự động hóa có năng lực thực tế và chứng chỉ hợp chuẩn.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                  <span>Xác thực MST &amp; hồ sơ máy móc</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                  <span>Báo giá cạnh tranh trực tiếp</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link to="/nha-cung-ung" className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center justify-between font-heading group/link">
                <span>Danh bạ Nhà cung ứng</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Khu công nghiệp */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-lg hover:border-emerald-600 transition-all flex flex-col justify-between group hover:-translate-y-1 duration-300">
            <div className="space-y-3">
              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80">
                <img
                  src="/images/pillar_industrial_park.jpg"
                  alt="Khu công nghiệp (KCN)"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent"></div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  INDUSTRIAL PARKS &amp; LOGISTICS
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition font-heading mt-0.5">
                  Khu công nghiệp (KCN)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Bản đồ 480+ KCN toàn quốc, thông tin diện tích, tỷ lệ lấp đầy, hạ tầng điện nước, xưởng xây sẵn và chính sách thu hút đầu tư.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Định vị GIS 63 tỉnh thành</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Mạng lưới cụm xưởng vệ tinh</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link to="/khu-cong-nghiep" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-between font-heading group/link">
                <span>Bản đồ KCN</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 4: Hội & Hiệp hội ngành nghề */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-lg hover:border-amber-600 transition-all flex flex-col justify-between group hover:-translate-y-1 duration-300">
            <div className="space-y-3">
              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80">
                <img
                  src="/images/pillar_industry_association.jpg"
                  alt="Hội & Hiệp hội ngành nghề"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent"></div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  INDUSTRY ASSOCIATIONS
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-700 transition font-heading mt-0.5">
                  Hội &amp; Hiệp hội ngành nghề
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Liên minh cùng các Hội Cơ khí, Điện tử, Da giày, Dệt may, Chế biến gỗ và Logistics để hỗ trợ doanh nghiệp hội viên mở rộng thị trường.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Bảo trợ chuyên môn &amp; hội viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Xúc tiến cung - cầu xuất khẩu</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link to="/hiep-hoi" className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center justify-between font-heading group/link">
                <span>Tra cứu Hiệp hội</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
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
        <EcosystemConnectSection />
      </section>

    </main>
  );
}
