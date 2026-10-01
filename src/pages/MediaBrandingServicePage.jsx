import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Video, Camera, FileText, BookOpen, Layers, CheckCircle2, 
  ArrowRight, ShieldCheck, ChevronRight, Clock, AlertTriangle, 
  HelpCircle, ExternalLink, QrCode, Monitor, Share2, 
  Sparkles, Check, Play, Download, Send, RefreshCw, Eye,
  Lock, Globe, Award, Building2, MapPin, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MEDIA_PROJECT_STATUSES, 
  SEED_MEDIA_PROJECTS, 
  SEED_CATALOGUES,
  getAllMediaProjects 
} from '../data/mediaContentData';
import { getActiveRelatedPrograms } from '../data/servicesData';

export default function MediaBrandingServicePage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const relatedPrograms = getActiveRelatedPrograms();
  const [activeCardTab, setActiveCardTab] = useState('card-profile');
  const [activeContextTab, setActiveContextTab] = useState('profile');

  // Interactive Approval Simulator State (Section 8 Spec 15.txt)
  const [simReviewedItems, setSimReviewedItems] = useState({
    copy: true,
    photos: true,
    video: true,
    capabilities: true,
    references: true,
    contact: true,
    qrDestination: true
  });
  const [simSigned, setSimSigned] = useState(true);
  const [simApproverName, setSimApproverName] = useState('Nguyễn Bích Thủy (Giám đốc)');
  const [simVersion, setSimVersion] = useState('v2.1-approved');

  // SEO Setup (Section 16 Spec 15.txt)
  useEffect(() => {
    document.title = 'Hồ Sơ, Video & Truyền Thông Doanh Nghiệp | CHUOICUNGUNG.COM';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Hồ Sơ, Video & Truyền Thông Doanh Nghiệp B2B",
      "description": "Chuẩn hóa hồ sơ năng lực, video giới thiệu 1 phút, ảnh thực tế nhà xưởng và nội dung catalogue để doanh nghiệp sử dụng trên website và trong các chương trình kết nối.",
      "provider": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      },
      "url": "https://chuoicungung.com/dich-vu/truyen-thong-doanh-nghiep",
      "serviceType": "Industrial Media Branding and Supplier Profile Standardization"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'media-branding-service-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('media-branding-service-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('media-branding-service-schema');
      if (el) el.remove();
    };
  }, []);

  const scrollToDeliverables = () => {
    const el = document.getElementById('hang-muc-dich-vu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const allReviewed = Object.values(simReviewedItems).every(Boolean);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* SECTION 02: HERO (SPEC 15.TXT)                                            */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-950 via-[#0B1E38] to-[#07172B] text-white border-b border-slate-800 relative overflow-hidden">
        
        {/* Subtle grid background */}
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
            <span className="text-blue-400 font-bold">Hồ Sơ & Truyền Thông Doanh Nghiệp</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide uppercase">
              <Video className="w-3.5 h-3.5 text-blue-400" />
              <span>CHUẨN HÓA NỘI DUNG NĂNG LỰC B2B • TÁI SỬ DỤNG ĐA ĐIỂM TIẾP XÚC</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-white">
              GIỚI THIỆU RÕ NĂNG LỰC ĐỂ NGƯỜI MUA DỄ TÌM HIỂU VÀ LIÊN HỆ
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              CHUOICUNGUNG.COM hỗ trợ doanh nghiệp chuẩn hóa hồ sơ, xây dựng video giới thiệu và chuẩn bị hình ảnh, nội dung catalogue. Tài liệu được tổ chức theo sản phẩm, năng lực và địa bàn phục vụ để sử dụng trên website và trong các chương trình kết nối.
            </p>

            {/* Target Criteria Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="text-slate-400 font-semibold text-[11px]">Đặc điểm:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-medium">Dữ liệu nguồn duy nhất</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-medium">Bảo chứng thực tế (Real Evidence)</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white font-medium">Ký duyệt trước khi công bố</span>
            </div>

            {/* CTA Buttons (Section 2 Spec 15.txt) */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition transform active:scale-95 font-heading"
              >
                <span>NHẬN TƯ VẤN NỘI DUNG</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={scrollToDeliverables}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs sm:text-sm font-semibold transition font-heading"
              >
                <span>XEM HẠNG MỤC BÀN GIAO</span>
              </button>
            </div>

            {/* Core Anti-Ad Disclaimer */}
            <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-[11px] text-blue-200/90 flex items-start gap-2 max-w-2xl">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Đây KHÔNG phải dịch vụ quảng cáo chung chung.</strong> Dữ liệu sau khi hoàn thành sẽ được gắn trực tiếp vào Hồ sơ nhà cung ứng (Supplier Profile), gắn mã QR, sử dụng tại các bàn giao thương B2B và đưa vào E-Catalogue cho Buyer tra cứu.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 03: HẠNG MỤC DỊCH VỤ (4 CARDS - SPEC 15.TXT)                      */}
      {/* ========================================================================= */}
      <section id="hang-muc-dich-vu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0052cc] uppercase tracking-wider font-heading">
            <Layers className="w-4 h-4" />
            <span>4 HẠNG MỤC BÀN GIAO CHUẨN HÓA</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-heading">
            CÁC CẤU PHẦN TRUYỀN THÔNG NĂNG LỰC DOANH NGHIỆP
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mỗi hạng mục đều được kiểm duyệt chặt chẽ, gắn nguồn dữ liệu minh bạch và tách bạch rõ ràng giữa bằng chứng thực tế với đồ họa minh họa.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD 01: HỒ SƠ DOANH NGHIỆP */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-blue-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0052cc] text-xs font-mono font-bold border border-blue-100">
                  CARD 01
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Dữ liệu nguồn mở</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    HỒ SƠ DOANH NGHIỆP
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chuẩn hóa toàn bộ thông tin pháp nhân và năng lực kỹ thuật theo mẫu tra cứu B2B tiêu chuẩn cho Người Mua (Buyer).
                </p>
              </div>

              {/* Checklist items */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 font-heading pb-1 border-b border-slate-200/80">
                  Bao gồm các trường dữ liệu:
                </div>
                <ul className="space-y-1.5 text-[11px]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Thông tin pháp nhân do doanh nghiệp cung cấp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Danh mục sản phẩm & dịch vụ chủ lực</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Năng lực sản xuất, quy mô máy móc & xưởng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Địa bàn phục vụ & điều kiện nhận việc (MOQ, Lead-time)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Bằng chứng kiểm định (ISO, CO/CQ, hình ảnh xưởng)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Đầu mối liên hệ trực tiếp & Ngày cập nhật thông tin</span>
                  </li>
                </ul>
              </div>

              {/* Data Quality Notice */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                <strong>Quy định bảo chứng:</strong> Không gọi toàn bộ thông tin là &quot;đã xác minh&quot;. Mỗi loại dữ liệu phải giữ đúng source và trạng thái (Doanh nghiệp tự khai / CCU thẩm định cơ sở).
              </div>
            </div>

            <Link
              to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep"
              className="w-full py-2.5 bg-slate-900 hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold text-center transition font-heading"
            >
              YÊU CẦU CHUẨN HÓA HỒ SƠ
            </Link>
          </div>

          {/* CARD 02: VIDEO GIỚI THIỆU KHOẢNG 1 PHÚT */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-blue-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-mono font-bold border border-purple-100">
                  CARD 02
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Thời lượng: 60 - 75s</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    VIDEO GIỚI THIỆU KHOẢNG 1 PHÚT
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Video quay thực tế dây chuyền, máy móc và quy trình kiểm soát chất lượng, cô đọng để Buyer nắm bắt trong 60 giây.
                </p>
              </div>

              {/* 6 Suggested Content Points (Spec 15.txt) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 font-heading pb-1 border-b border-slate-200/80">
                  Nội dung gợi ý chuẩn B2B (6 phần):
                </div>
                <ol className="space-y-1.5 text-[11px] list-decimal list-inside text-slate-600">
                  <li><strong>Doanh nghiệp cung cấp gì?</strong> (Sản phẩm cốt lõi)</li>
                  <li><strong>Phục vụ ai?</strong> (Khách hàng mục tiêu, FDI, xuất khẩu)</li>
                  <li><strong>Sản phẩm / quy trình chính</strong> (Công nghệ máy móc)</li>
                  <li><strong>Năng lực & điều kiện nhận việc</strong> (Công suất, tiêu chuẩn)</li>
                  <li><strong>Địa bàn phục vụ</strong> (KCN, tỉnh thành, bán kính giao)</li>
                  <li><strong>CTA liên hệ / Mã QR</strong> (Dẫn thẳng về Supplier Profile)</li>
                </ol>
              </div>

              {/* Pricing transparency note (Section 3 Card 02 Spec 15.txt) */}
              <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                <strong>Minh bạch chi phí:</strong> Báo giá quy định rõ thời lượng, kịch bản, địa điểm quay, số vòng sửa (tối đa 3), ngôn ngữ, quyền sử dụng và chi phí quay lại. Không áp đặt giá cố định khi chưa khảo sát phạm vi.
              </div>
            </div>

            <Link
              to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep"
              className="w-full py-2.5 bg-slate-900 hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold text-center transition font-heading"
            >
              ĐẶT LỊCH SẢN XUẤT VIDEO
            </Link>
          </div>

          {/* CARD 03: ẢNH NĂNG LỰC & SẢN PHẨM */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-blue-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-100">
                  CARD 03
                </span>
                <span className="text-[11px] text-slate-500 font-medium">25 - 50 ảnh Full-Res</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    ẢNH NĂNG LỰC & SẢN PHẨM
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bộ ảnh độ phân giải cao ghi nhận trực tiếp diện mạo xưởng, hệ thống máy móc, khu vực lưu kho và quy trình KCS.
                </p>
              </div>

              {/* Management aspects */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 font-heading pb-1 border-b border-slate-200/80">
                  Phạm vi bàn giao & bản quyền:
                </div>
                <ul className="space-y-1.5 text-[11px]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Danh sách cảnh chụp thống nhất trước buổi chụp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Số lượng ảnh bàn giao: 25 - 50 ảnh chỉnh sửa màu chuẩn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Định dạng: JPG Full-Res + File RAW gốc theo thỏa thuận</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Quyền sử dụng: Toàn quyền thương mại B2B vĩnh viễn</span>
                  </li>
                </ul>
              </div>

              {/* Strict AI vs Evidence Distinction (Spec 15.txt) */}
              <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl text-[11px] text-rose-900 leading-relaxed">
                <strong>NGUYÊN TẮC BẮT BUỘC:</strong> Phân biệt rõ giữa <code>REAL_EVIDENCE</code> (ảnh chụp thực tế) và <code>ILLUSTRATION / AI / MASCOT</code>. Ảnh AI hoặc mascot KHÔNG được dùng như bằng chứng nhà xưởng, máy móc hay năng lực thực tế.
              </div>
            </div>

            <Link
              to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep"
              className="w-full py-2.5 bg-slate-900 hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold text-center transition font-heading"
            >
              YÊU CẦU CHỤP ẢNH XƯỞNG
            </Link>
          </div>

          {/* CARD 04: NỘI DUNG CATALOGUE */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-blue-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-mono font-bold border border-cyan-100">
                  CARD 04
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Bản in & E-Catalogue</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    NỘI DUNG CATALOGUE
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thiết kế tài liệu giới thiệu sản phẩm & năng lực gia công chuyên sâu, tra cứu nhanh trên di động và bản in chất lượng cao.
                </p>
              </div>

              {/* Elements & QR */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 font-heading pb-1 border-b border-slate-200/80">
                  Nội dung ấn phẩm bao gồm:
                </div>
                <ul className="space-y-1.5 text-[11px]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Mô tả ngắn gọn về doanh nghiệp và định hướng kỹ thuật</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Thông số kỹ thuật sản phẩm & dải năng lực gia công</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Hình ảnh chụp thực tế sản phẩm hoàn thiện</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Mã QR dẫn trực tiếp về Supplier Profile cập nhật thời gian thực</span>
                  </li>
                </ul>
              </div>

              {/* Transparent Cost Breakdown (Spec 15.txt) */}
              <div className="p-3 bg-cyan-50/80 border border-cyan-200/80 rounded-xl text-[11px] text-cyan-950 space-y-1">
                <div className="font-bold font-heading">Tách bạch rõ 4 cấu phần chi phí:</div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                  <div>• <code>content fee</code> (Phí nội dung)</div>
                  <div>• <code>placement fee</code> (Phí vị trí tài trợ)</div>
                  <div>• <code>printing cost</code> (Phí in ấn)</div>
                  <div>• <code>distribution cost</code> (Phí phát hành)</div>
                </div>
              </div>
            </div>

            <Link
              to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep"
              className="w-full py-2.5 bg-slate-900 hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold text-center transition font-heading"
            >
              YÊU CẦU BIÊN SOẠN CATALOGUE
            </Link>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 04: MỘT BỘ DỮ LIỆU — NHIỀU ĐIỂM SỬ DỤNG (SPEC 15.TXT)             */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>TRIẾT LÝ DỮ LIỆU ĐỒNG NHẤT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              DÙNG MỘT BỘ HỒ SƠ CHO NHIỀU HOẠT ĐỘNG
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dữ liệu sau khi doanh nghiệp ký duyệt sẽ trở thành một nguồn sự thật duy nhất (Single Source of Truth). Hệ thống không copy nội dung thành nhiều source độc lập mà render linh hoạt vào 8 điểm tiếp xúc B2B.
            </p>
          </div>

          {/* Interactive Multi-use Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { id: 'profile', label: 'Supplier Profile', icon: Globe },
              { id: 'website', label: 'Website riêng', icon: ExternalLink },
              { id: 'buyer-deck', label: 'Tài liệu gửi Buyer', icon: FileText },
              { id: 'catalogue', label: 'Cuốn Catalogue', icon: BookOpen },
              { id: 'qr', label: 'Mã QR kết nối', icon: QrCode },
              { id: 'booth', label: 'Màn hình gian hàng', icon: Monitor },
              { id: 'program', label: 'Chương trình B2B', icon: Share2 },
              { id: 'remote', label: 'Hiện diện từ xa', icon: Building2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeContextTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveContextTab(tab.id)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span className="text-[11px] leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Context Preview Box */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
            
            {activeContextTab === 'profile' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 01: TRANG HỒ SƠ SUPPLIER PROFILE BẢO CHỨNG</span>
                  <span>CHUOICUNGUNG.COM</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Video 1 phút và toàn bộ ảnh thực tế được nhúng trực tiếp vào mục <code>7. Video Giới Thiệu & Catalogue Năng Lực</code> trên trang chi tiết nhà cung cấp. Khách mua hàng trong nước và quốc tế có thể xem trực quan dây chuyền sản xuất mà không cần đến tận nơi.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>URL chuẩn hóa: /doanh-nghiep/[slug-doanh-nghiep]</span>
                  <span className="text-emerald-400 font-bold">Tự động đồng bộ</span>
                </div>
              </div>
            )}

            {activeContextTab === 'website' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 02: TÍCH HỢP TRANG WEB RIÊNG DOANH NGHIỆP</span>
                  <span>IFRAME / WIDGET / API</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cung cấp mã nhúng (embed code) hoặc bản nén tối ưu để doanh nghiệp đưa video giới thiệu và bộ ảnh chất lượng cao lên website riêng, không tốn thêm chi phí thiết kế lại từ đầu.
                </p>
              </div>
            )}

            {activeContextTab === 'buyer-deck' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 03: HỒ SƠ NĂNG LỰC GỬI TRỰC TIẾP BUYER</span>
                  <span>FILE PDF 300DPI</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bản PDF Profile song ngữ (Anh - Việt) được định dạng chuẩn quốc tế, tóm lược đầy đủ quy cách máy móc, chứng chỉ ISO, năng lực cung ứng tháng và chính sách chất lượng QA/QC.
                </p>
              </div>
            )}

            {activeContextTab === 'catalogue' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 04: E-CATALOGUE & CUỐN CATALOGUE IN ẤN</span>
                  <span>DIGITAL FLIPBOOK & PRINT</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dữ liệu sản phẩm và hình ảnh được bố cục tự động thành ấn phẩm Catalogue giới thiệu tại hội chợ triển lãm và gửi kèm trong các gói quà tặng doanh nghiệp B2B.
                </p>
              </div>
            )}

            {activeContextTab === 'qr' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 05: MÃ QR ĐỘNG KẾT NỐI HỒ SƠ</span>
                  <span>DYNAMIC QR CODE</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mã QR được in lên danh thiếp, bảng tên nhân viên, bao bì thùng hàng hoặc standee. Khách hàng quét mã sẽ truy cập thẳng vào hồ sơ năng lực phiên bản mới nhất, không lo lỗi thời thông tin.
                </p>
              </div>
            )}

            {activeContextTab === 'booth' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 06: MÀN HÌNH TRÌNH CHIẾU TẠI GIAN HÀNG</span>
                  <span>4K LOOP DISPLAY</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Video 1 phút xuất file 4K không nén để trình chiếu lặp lại (loop) trên TV, màn hình LED tại gian hàng triển lãm, giúp thu hút khách tham quan và đối tác mua sắm.
                </p>
              </div>
            )}

            {activeContextTab === 'program' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 07: KẾT NỐI VÀO CÁC CHƯƠNG TRÌNH NGÀY HỘI CHUỖI CUNG ỨNG</span>
                  <span>EXPO & SOURCING EVENTS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Doanh nghiệp tham gia các phiên giao thương B2B sẽ có sẵn hồ sơ đã chuẩn hóa để Ban Tổ chức gửi trước cho các nhà máy FDI sàng lọc nhu cầu.
                </p>
              </div>
            )}

            {activeContextTab === 'remote' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono font-bold">
                  <span>ỨNG DỤNG 08: HIỆN DIỆN TỪ XA TẠI SỰ KIỆN LIÊN TỈNH</span>
                  <span>REMOTE SHOWCASE</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kết hợp cùng gói dịch vụ Hiện diện từ xa: Doanh nghiệp không cần cử đoàn công tác nhưng vẫn có video trình chiếu, catalogue phát tay và bàn trưng bày mẫu tại sự kiện.
                </p>
              </div>
            )}

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 07 & 08: WORKFLOW SẢN XUẤT & QUY TRÌNH DUYỆT (SPEC 15.TXT)        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0052cc] uppercase tracking-wider font-heading">
            <Clock className="w-4 h-4" />
            <span>QUY TRÌNH MINH BẠCH & KIỂM SOÁT PHIÊN BẢN</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-heading">
            12 BƯỚC TRIỂN KHAI TỪ ĐỀ BÀI ĐẾN CÔNG BỐ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Quy tắc nghiêm ngặt: <strong>Không bao giờ publish khi chưa có sự xác nhận chính thức (APPROVED) từ người có thẩm quyền của doanh nghiệp.</strong>
          </p>
        </div>

        {/* 12 Steps Visual Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {MEDIA_PROJECT_STATUSES.map((step, idx) => (
            <div
              key={step.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  step.group === 'WAITING_CLIENT' ? 'bg-amber-500' :
                  step.group === 'APPROVED' ? 'bg-teal-500' :
                  step.group === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-black text-slate-900 font-heading">
                  {step.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {step.id}
                </div>
              </div>

              <div className="text-[10px] font-semibold">
                {step.group === 'WAITING_CLIENT' && <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Chờ DN</span>}
                {step.group === 'WAITING_TEAM' && <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Team CCU</span>}
                {step.group === 'APPROVED' && <span className="text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">Đã duyệt</span>}
                {step.group === 'PUBLISHED' && <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Đã công bố</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Approval Simulator (Section 8 Spec 15.txt) */}
        <div className="bg-white rounded-3xl border-2 border-indigo-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                  MÔ PHỎNG QUY TRÌNH DUYỆT CỦA DOANH NGHIỆP (APPROVAL WORKFLOW)
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Doanh nghiệp phải trực tiếp tích chọn xác nhận 7 cấu phần nội dung trước khi xuất bản. Mọi lượt duyệt đều ghi nhận người duyệt, thời gian và phiên bản độc lập.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full font-mono text-xs font-bold border border-indigo-200">
                PHIÊN BẢN: {simVersion}
              </span>
            </div>
          </div>

          {/* 7 Reviewed Items Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { key: 'copy', label: '1. Nội dung văn bản (Copywriting)' },
              { key: 'photos', label: '2. Bộ ảnh nhà xưởng & máy móc' },
              { key: 'video', label: '3. Video 1 phút & Kịch bản' },
              { key: 'capabilities', label: '4. Thông số năng lực & MOQ' },
              { key: 'references', label: '5. Khách hàng & Dự án mẫu' },
              { key: 'contact', label: '6. Thông tin liên hệ & Pháp nhân' },
              { key: 'qrDestination', label: '7. Đích đến của Mã QR' }
            ].map(item => {
              const isChecked = simReviewedItems[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => setSimReviewedItems(prev => ({ ...prev, [item.key]: !isChecked }))}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-[11px] leading-tight">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Signoff details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-slate-500 text-[11px]">Người đại diện ký duyệt:</div>
              <div className="font-bold text-slate-900 font-heading">{simApproverName}</div>
              <div className="text-[10px] text-slate-400 font-mono">Thời gian ký duyệt: 2026-09-28 14:30:00 (GMT+7)</div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                allReviewed ? 'bg-emerald-600 text-white shadow-xs' : 'bg-amber-100 text-amber-800'
              }`}>
                {allReviewed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ĐỦ ĐIỀU KIỆN CÔNG BỐ (APPROVED)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>CHƯA ĐỦ ĐIỀU KIỆN (CHỜ DUYỆT HẾT 7 MỤC)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * Nguyên tắc bất biến: Nếu nội dung có bất kỳ sự thay đổi nào sau khi ký duyệt, hệ thống sẽ tự động kích hoạt phiên bản mới (v2.2) và không bao giờ ghi đè lên lịch sử duyệt cũ.
          </p>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 14 & 15: QUY ĐỊNH BẢO CHỨNG DỮ LIỆU & THƯƠNG MẠI (SPEC 15.TXT)     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 14 Data Quality Rule */}
          <div className="bg-white rounded-3xl border border-rose-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs font-heading">
              <AlertTriangle className="w-4 h-4" />
              <span>DATA QUALITY RULE (MỤC 14 SPEC 15.TXT)</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
              THANH TOÁN CHO NỘI DUNG ≠ XÁC MINH NĂNG LỰC
            </h3>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Gói trả phí làm hồ sơ và video <strong>KHÔNG ĐƯỢC TỰ ĐỘNG TẠO</strong> các danh hiệu bảo chứng như:
              </p>
              <div className="flex flex-wrap gap-1.5 py-1">
                <span className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 font-bold line-through text-[11px]">Verified Supplier</span>
                <span className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 font-bold line-through text-[11px]">Trusted Supplier</span>
                <span className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 font-bold line-through text-[11px]">Top Supplier</span>
                <span className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 font-bold line-through text-[11px]">Certified Supplier</span>
              </div>
              <p>
                Mọi chứng nhận hoặc bằng chứng kỹ thuật (ISO, chứng chỉ kiểm định xưởng) hiển thị trên hệ thống đều phải trải qua luồng thẩm định Evidence riêng biệt.
              </p>
            </div>
          </div>

          {/* Section 15 Commercial Rule */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs font-heading">
              <ShieldCheck className="w-4 h-4" />
              <span>COMMERCIAL RULE (MỤC 15 SPEC 15.TXT)</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
              MINH BẠCH BÁO GIÁ & CAM KẾT THỰC TẾ
            </h3>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Mọi bản chào giá và hợp đồng đều quy định rõ: Deliverables, số lượng ảnh, số vòng sửa, timeline, chi phí đi lại ngoại thành, phụ phí thêm ngôn ngữ và các hạng mục không bao gồm.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                <strong>Cam kết trung thực:</strong> Không bao giờ hứa hẹn số lượng views, leads, buyers hay giá trị hợp đồng nếu không có phạm vi thẩm định và cam kết đo lường độc lập.
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 12: CHƯƠNG TRÌNH KẾT NỐI LIÊN QUAN (SPEC 15.TXT)                   */}
      {/* ========================================================================= */}
      {relatedPrograms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#0052cc] uppercase font-heading">
                KẾ THỪA VÀO CHƯƠNG TRÌNH THỰC TẾ (MỤC 12)
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                CÁC NGÀY HỘI KẾT NỐI SẮP TỚI ĐỂ SỬ DỤNG HỒ SƠ
              </h3>
            </div>
            <Link
              to="/chuong-trinh"
              className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 font-heading"
            >
              <span>Xem tất cả chương trình</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPrograms.map(p => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                    {p.statusName || 'Đang nhận đăng ký'}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 font-heading line-clamp-2">
                    {p.title || p.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {p.description || p.location}
                  </p>
                </div>

                <Link
                  to={`/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep&program=${p.id}`}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#0052cc] rounded-xl text-xs font-bold text-center transition font-heading"
                >
                  CHUẨN HÓA CHO SỰ KIỆN NÀY
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FINAL CALL TO ACTION (MOBILE ORDER SPEC 15.TXT)                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-[#071E3D] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight">
              BẮT ĐẦU CHUẨN HÓA BỘ HỒ SƠ NĂNG LỰC DOANH NGHIỆP NGAY HÔM NAY
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mô tả sơ bộ về nhà máy, sản phẩm chính và nhu cầu truyền thông của bạn. Ban Biên Tập & Kỹ Thuật CHUOICUNGUNG.COM sẽ liên hệ tư vấn kịch bản trong vòng 24 giờ.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link
              to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep"
              className="px-8 py-3.5 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition transform active:scale-95 font-heading flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>GỬI YÊU CẦU TƯ VẤN DỊCH VỤ</span>
            </Link>

            <Link
              to="/dich-vu"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs sm:text-sm font-semibold transition font-heading"
            >
              XEM CÁC DỊCH VỤ KHÁC
            </Link>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 relative z-10">
            CHUOICUNGUNG.COM • Nền tảng hạ tầng số kết nối chuỗi cung ứng quốc gia
          </div>

        </div>
      </section>

    </div>
  );
}
