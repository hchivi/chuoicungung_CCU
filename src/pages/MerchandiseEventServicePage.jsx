import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Send, CheckCircle2, ShieldCheck, ArrowRight, 
  Clock, FileText, Sparkles, ChevronRight, Layers, Tag,
  ShoppingBag, Award, Palette, Truck, AlertTriangle, Eye,
  Check, UserCheck, Calendar, MapPin, RefreshCw, X, HelpCircle,
  ExternalLink, Building2, PhoneCall, ShieldAlert, BadgeCheck
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MERCHANDISE_KITS, 
  MERCHANDISE_WORKFLOW_STEPS,
  COORDINATION_MODES,
  MERCH_IMAGE_TYPES,
  SAMPLE_QUOTATION_TEMPLATE,
  findMatchingSuppliersForMerchandise,
  getAllMerchandiseRequests
} from '../data/merchandiseEventData';
import { PROGRAMS_DATA } from '../data/programsData';

export default function MerchandiseEventServicePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // State
  const [selectedKit, setSelectedKit] = useState(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [activeCoordinationMode, setActiveCoordinationMode] = useState('PLATFORM_COORDINATION');
  const [selectedImageTypeFilter, setSelectedImageTypeFilter] = useState('ALL');
  const [simulatedSampleStatus, setSimulatedSampleStatus] = useState('APPROVED');

  // SEO Setup (Section 16 Spec 16.txt)
  useEffect(() => {
    document.title = 'Vật Phẩm Doanh Nghiệp & Sự Kiện | CHUOICUNGUNG.COM';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Tiếp nhận yêu cầu đồng phục, thẻ QR, túi, quà tặng và vật phẩm chương trình theo số lượng, quy cách, thời gian và địa điểm bàn giao.';

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = 'https://chuoicungung.com/dich-vu/vat-pham-su-kien';
  }, []);

  const scrollToKits = () => {
    const el = document.getElementById('cac-bo-vat-pham');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Lấy các chương trình thật có nhu cầu vật phẩm
  const relatedPrograms = (PROGRAMS_DATA || []).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-28 antialiased selection:bg-[#0052cc] selection:text-white overflow-x-hidden">
      
      {/* ==================================================================== */}
      {/* 1. HERO SECTION (SECTION 2 SPEC 16.TXT) */}
      {/* ==================================================================== */}
      <section className="relative bg-gradient-to-b from-slate-950 via-[#07192F] to-[#04101F] text-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800 overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          {/* Breadcrumb & Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/dich-vu" className="text-xs font-semibold text-slate-400 hover:text-white transition">
              Trung tâm dịch vụ
            </Link>
            <span className="text-slate-600 text-xs">/</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Page 16: Vật Phẩm & Sự Kiện B2B
            </span>
          </div>

          {/* Exact H1 & Subtitle per Section 2 Spec 16.txt */}
          <div className="max-w-3xl space-y-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white leading-[1.15]">
              CHUẨN BỊ VẬT PHẨM THEO NHẬN DIỆN DOANH NGHIỆP VÀ CHƯƠNG TRÌNH
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Từ đồng phục, thẻ QR đến túi, quà tặng và tài liệu, CHUOICUNGUNG.COM tiếp nhận yêu cầu và phối hợp nguồn cung theo số lượng, thiết kế, thời gian và địa điểm bàn giao đã thống nhất.
            </p>
          </div>

          {/* Quality Notice Pill: B2B Coordination, Not a Retail Shop */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Quy trình sản xuất & cung ứng theo đơn đặt hàng B2B — Không phải shop bán lẻ đại trà</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* CTA Chính */}
            <Link
              to="/yeu-cau-dich-vu?service=vat-pham-su-kien"
              className="py-3 px-6 sm:px-8 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-700/30 transition flex items-center gap-2 group"
            >
              <span>GỬI YÊU CẦU BÁO GIÁ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* CTA Phụ */}
            <button
              type="button"
              onClick={scrollToKits}
              className="py-3 px-5 sm:px-6 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/40 text-slate-200 text-xs sm:text-sm font-semibold transition"
            >
              XEM CÁC BỘ VẬT PHẨM
            </button>
          </div>

          {/* Target Audience Badges */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Ban tổ chức sự kiện</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Nhà máy & Xưởng FDI</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Hội / Hiệp hội ngành</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Ban Quản lý KCN</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Nhà cung ứng triển lãm</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Đơn vị tổ chức B2B</div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. CÁC BỘ SẢN PHẨM CHUẨN (SECTION 3 SPEC 16.TXT) */}
      {/* CARD 01, 02, 03, 04 */}
      {/* ==================================================================== */}
      <section id="cac-bo-vat-pham" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-teal-600 font-black text-xs uppercase tracking-wider font-heading">
              DANH MỤC GIẢI PHÁP
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-heading mt-1">
              4 BỘ VẬT PHẨM DOANH NGHIỆP & SỰ KIỆN TIÊU BIỂU
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Mỗi gói giải pháp đều được thiết kế may in đồng bộ, có bảng quy cách kỹ thuật rõ ràng và hỗ trợ làm mẫu thực tế trước khi chạy đại trà.
          </p>
        </div>

        {/* Grid 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MERCHANDISE_KITS.map((kit) => {
            const imgBadge = MERCH_IMAGE_TYPES[kit.imageType] || MERCH_IMAGE_TYPES.REAL_PRODUCT;
            return (
              <div 
                key={kit.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image header with strict classification badge */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={kit.image} 
                      alt={kit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Kit Code & Image Classification Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-mono font-bold text-[11px] shadow-xs">
                        {kit.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${imgBadge.badgeClass}`}>
                        {imgBadge.label}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                        {kit.suitableAudience}
                      </span>
                      <h3 className="text-base sm:text-lg font-black font-heading text-white line-clamp-1">
                        {kit.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {kit.subtitle}
                    </p>

                    {/* Highlights Checklist */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold uppercase text-slate-400 font-heading">
                        Hạng mục tiêu biểu trong bộ:
                      </div>
                      <div className="space-y-1.5">
                        {kit.highlights.map((hl, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evidence & Lead Time Badges */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Thời gian sản xuất:</span>
                        <strong className="text-slate-800">{kit.leadTimeTypical}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Số lượng đề xuất:</span>
                        <strong className="text-slate-800">{kit.moqTypical}</strong>
                      </div>
                      <div className="text-slate-500 pt-1 border-t border-slate-200/60 flex items-start gap-1 text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                        <span className="italic">{kit.evidenceNote}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 sm:p-6 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedKit(kit)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Chi tiết quy cách</span>
                  </button>

                  <Link
                    to={`/yeu-cau-dich-vu?service=vat-pham-su-kien&package=${kit.id}`}
                    className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-2xs"
                  >
                    <span>Báo giá bộ này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. WORKFLOW 11 BƯỚC BẮT BUỘC (SECTION 5 SPEC 16.TXT) */}
      {/* ==================================================================== */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 border-y border-slate-800 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-teal-400 font-black text-xs uppercase tracking-wider font-heading">
                QUY TRÌNH THỰC THI CHUẨN
              </span>
              <h2 className="text-xl sm:text-3xl font-black font-heading text-white mt-1">
                11 BƯỚC TỪ TIẾP NHẬN ĐỀ BÀI ĐẾN BÀN GIAO & NGHIỆM THU
              </h2>
            </div>
            
            {/* Rule Callout: Requested date != Confirmed date */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-300 max-w-md">
              <strong>Quy tắc cam kết tiến độ:</strong> Ngày khách mong muốn là căn cứ điều phối. Thời hạn bàn giao chính thức chỉ được xác lập sau khi nhà xưởng thẩm định lịch chạy chuyền và phát hành văn bản xác nhận (Confirmed Delivery Date).
            </div>
          </div>

          {/* Workflow Interactive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MERCHANDISE_WORKFLOW_STEPS.map((step) => {
              const isActive = activeWorkflowStep === step.step;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveWorkflowStep(step.step)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-teal-950/60 border-teal-500 text-white shadow-md ring-1 ring-teal-500/40'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isActive ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {step.step}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {step.key}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white font-heading">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-700/60 text-[10px] text-teal-400/90 font-medium">
                    {step.step <= 4 && '→ Tiền sản xuất'}
                    {step.step === 5 && '⚠️ Bắt buộc duyệt mẫu'}
                    {(step.step >= 6 && step.step <= 7) && '→ Chốt pháp lý & tiến độ'}
                    {(step.step >= 8 && step.step <= 9) && '→ Sản xuất & KCS'}
                    {step.step >= 10 && '→ Bàn giao & VAT'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. MINH BẠCH BÁO GIÁ 13 THÀNH PHẦN (SECTION 7 SPEC 16.TXT) */}
      {/* Tuyệt đối không gửi báo giá mơ hồ chỉ có tổng tiền */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-teal-600 font-black text-xs uppercase tracking-wider font-heading">
              TIÊU CHUẨN THƯƠNG MẠI
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 font-heading mt-1">
              BÁO GIÁ MINH BẠCH 13 HẠNG MỤC BẮT BUỘC
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowQuotationModal(true)}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 self-start md:self-auto transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>Xem mẫu báo giá 13 hạng mục chuẩn</span>
          </button>
        </div>

        {/* 13 Item Components Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              1-4
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Thực thể & Quy cách
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              <li>• <strong>1. Bên bán:</strong> Tên công ty, MST, người phụ trách kỹ thuật</li>
              <li>• <strong>2. Hạng mục:</strong> Danh mục sản phẩm bóc tách từng mã</li>
              <li>• <strong>3. Số lượng:</strong> Đơn vị tính và số lượng chính xác</li>
              <li>• <strong>4. Quy cách:</strong> Vật liệu vải/giấy, công nghệ in/thêu, dung sai</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              5-9
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Bóc tách chi phí thực
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              <li>• <strong>5. Chi phí mẫu:</strong> Hoàn phí 100% khi ký HĐ chính thức</li>
              <li>• <strong>6. Chi phí thiết kế:</strong> Miễn phí chế bản mockup 3D</li>
              <li>• <strong>7. Chi phí sản xuất:</strong> Đơn giá theo khối lượng đặt hàng</li>
              <li>• <strong>8. Vận chuyển:</strong> Phí xe tải giao tận kho nhà máy/sự kiện</li>
              <li>• <strong>9. Thuế GTGT:</strong> Tách riêng thuế suất VAT rõ ràng</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              10-13
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Cam kết & Bảo lãnh
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              <li>• <strong>10. Điều kiện thanh toán:</strong> Tạm ứng & tất toán sau nghiệm thu</li>
              <li>• <strong>11. Thời gian cam kết:</strong> Ngày giao được xưởng xác nhận</li>
              <li>• <strong>12. Trách nhiệm bàn giao:</strong> Bốc dỡ, kiểm đếm niêm phong</li>
              <li>• <strong>13. Chính sách xử lý lỗi:</strong> Bù 1-đổi-1 hoặc trừ tiền trong 7 ngày</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. PHÂN BIỆT VAI TRÒ CHUOICUNGUNG.COM (SECTION 8 SPEC 16.TXT) */}
      {/* MODE A vs MODE B */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-[#071F36] text-white border border-teal-800/40 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-teal-400 font-bold text-xs uppercase tracking-wider font-heading">
              MINH BẠCH PHÁP LÝ & HỢP ĐỒNG (MỤC 8 SPEC 16)
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
              LỰA CHỌN MÔ HÌNH PHỐI HỢP PHÙ HỢP VỚI DOANH NGHIỆP
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              CHUOICUNGUNG.COM không để hai mô hình bị nhập nhằng. Doanh nghiệp được chủ động lựa chọn phương thức ký kết ngay từ bước gửi đề bài.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode A */}
            <div 
              onClick={() => setActiveCoordinationMode('PLATFORM_COORDINATION')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                activeCoordinationMode === 'PLATFORM_COORDINATION'
                  ? 'bg-teal-950/70 border-teal-400 shadow-md ring-1 ring-teal-400/50'
                  : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30">
                  MODE A
                </span>
                <span className="text-xs text-slate-400 font-medium">Điều phối sàn</span>
              </div>
              <h3 className="font-bold text-base text-white font-heading">
                {COORDINATION_MODES.PLATFORM_COORDINATION.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {COORDINATION_MODES.PLATFORM_COORDINATION.desc}
              </p>
              <div className="text-[11px] pt-3 border-t border-slate-700/60 space-y-1 text-slate-300">
                <div>• Bên ký hợp đồng: <strong className="text-white">{COORDINATION_MODES.PLATFORM_COORDINATION.contractSigner}</strong></div>
                <div>• Bên xuất hóa đơn VAT: <strong className="text-white">{COORDINATION_MODES.PLATFORM_COORDINATION.vatIssuer}</strong></div>
              </div>
            </div>

            {/* Mode B */}
            <div 
              onClick={() => setActiveCoordinationMode('DIRECT_SALE')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                activeCoordinationMode === 'DIRECT_SALE'
                  ? 'bg-teal-950/70 border-teal-400 shadow-md ring-1 ring-teal-400/50'
                  : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30">
                  MODE B
                </span>
                <span className="text-xs text-slate-400 font-medium">Hợp đồng trực tiếp CCU</span>
              </div>
              <h3 className="font-bold text-base text-white font-heading">
                {COORDINATION_MODES.DIRECT_SALE.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {COORDINATION_MODES.DIRECT_SALE.desc}
              </p>
              <div className="text-[11px] pt-3 border-t border-slate-700/60 space-y-1 text-slate-300">
                <div>• Bên ký hợp đồng: <strong className="text-white">{COORDINATION_MODES.DIRECT_SALE.contractSigner}</strong></div>
                <div>• Bên xuất hóa đơn VAT: <strong className="text-white">{COORDINATION_MODES.DIRECT_SALE.vatIssuer}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. SAMPLE & APPROVAL SAFETY GUARD (SECTION 9 SPEC 16.TXT) */}
      {/* Không sản xuất đại trà khi chưa duyệt mẫu */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-teal-600 font-bold text-xs uppercase tracking-wider font-heading">
                AN TOÀN SẢN XUẤT (MỤC 9 SPEC 16)
              </span>
              <h2 className="text-lg sm:text-2xl font-black font-heading text-slate-900 mt-1">
                QUY TRÌNH DUYỆT MẪU VẬT LÝ VÀ CHẶN LỖI SẢN XUẤT
              </h2>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Chốt an toàn: Cấm chạy chuyền khi mẫu chưa Approved</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">1. Làm mẫu thử (Sample)</div>
              <p className="text-slate-500 text-[11px]">Xưởng may/in 01 sản phẩm mẫu theo file thiết kế trong 3 - 5 ngày.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">2. Gửi khách đối soát</div>
              <p className="text-slate-500 text-[11px]">Chuyển phát nhanh hoặc chuyên viên mang mẫu tận nhà máy để đối soát.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 space-y-1">
              <div className="font-bold text-teal-800">3. Ký duyệt mẫu (Version)</div>
              <p className="text-teal-700 text-[11px]">Lưu chữ ký người duyệt, ngày giờ và số phiên bản (v1.0, v1.1...).</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-800">4. Mở lệnh sản xuất</div>
              <p className="text-emerald-700 text-[11px]">Hệ thống kiểm tra cờ APPROVED trước khi cho phép xưởng chạy đại trà.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. CHƯƠNG TRÌNH KẾT NỐI LIÊN QUAN (SECTION 11 SPEC 16.TXT) */}
      {/* Tái sử dụng programId từ programsData */}
      {/* ==================================================================== */}
      {relatedPrograms.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-teal-600 font-bold text-xs uppercase tracking-wider font-heading">
                TÍCH HỢP HỆ SINH THÁI
              </span>
              <h2 className="text-lg sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                VẬT PHẨM SỬ DỤNG TẠI CÁC CHƯƠNG TRÌNH KẾT NỐI CHÍNH THỨC
              </h2>
            </div>
            <Link
              to="/chuong-trinh"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Xem tất cả chương trình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs hover:shadow-xs transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                    {prog.zone || 'Đông Nam Bộ'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    MÃ: {prog.id}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm font-heading line-clamp-1">
                  {prog.title || prog.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {prog.shortDesc || prog.description || 'Chương trình giao thương kết nối nhà cung ứng và các nhà máy KCN.'}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Đồng phục, thẻ QR & Catalogue</span>
                  <Link
                    to={`/yeu-cau-dich-vu?service=vat-pham-su-kien&programId=${prog.id}`}
                    className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 text-[11px]"
                  >
                    <span>Đặt vật phẩm cho sự kiện này</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 8. BOTTOM CALL TO ACTION BANNER (MOBILE ORDER SECTION 16 SPEC 16) */}
      {/* Mobile order: Hero -> 4 Bộ sản phẩm -> Quy trình -> CTA báo giá */}
      {/* ==================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-teal-800/40 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 font-heading">
              KHỞI TẠO ĐỀ BÀI NGAY HÔM NAY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white">
              CẦN CHUẨN BỊ ĐỒNG PHỤC, THẺ QR HOẶC VẬT PHẨM SỰ KIỆN?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Gửi số lượng, thời gian mong muốn và bản thiết kế. Đội ngũ kỹ thuật của CHUOICUNGUNG.COM sẽ phản hồi báo giá 13 hạng mục và tiến độ chạy mẫu trong vòng 24 giờ làm việc.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link
              to="/yeu-cau-dich-vu?service=vat-pham-su-kien"
              className="py-3 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition flex items-center gap-2 group"
            >
              <span>GỬI YÊU CẦU BÁO GIÁ CHI TIẾT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/dich-vu"
              className="py-3 px-6 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/60 text-slate-200 text-xs sm:text-sm font-semibold transition"
            >
              Về trung tâm dịch vụ
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 9. STICKY MOBILE CTA BAR (SECTION 16 SPEC 16.TXT) */}
      {/* Tuyệt đối không tràn màn hình 390px */}
      {/* ==================================================================== */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 z-40 flex items-center justify-between gap-3">
        <div className="text-left leading-tight">
          <div className="text-[10px] text-teal-400 font-bold uppercase">Báo giá theo số lượng</div>
          <div className="text-xs text-white font-bold font-heading">Vật phẩm & Sự kiện B2B</div>
        </div>
        <Link
          to="/yeu-cau-dich-vu?service=vat-pham-su-kien"
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-700/30 transition flex items-center gap-1.5 shrink-0"
        >
          <span>GỬI YÊU CẦU BÁO GIÁ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: CHI TIẾT BỘ SẢN PHẨM (SPECIFICATIONS MODAL) */}
      {/* ==================================================================== */}
      {selectedKit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-mono font-bold">
                  {selectedKit.code}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-heading mt-1">
                  {selectedKit.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedKit.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedKit(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide font-heading">
                Bảng quy cách kỹ thuật từng hạng mục:
              </h4>
              <div className="space-y-2">
                {selectedKit.itemsList.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <p className="text-slate-600 pl-5 text-[11px] leading-relaxed">
                      {item.spec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-800">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Cam kết mẫu thử thực tế</span>
              </div>
              <p>
                Xưởng may/sản xuất hỗ trợ cung ứng mẫu thử thực tế để duyệt chất liệu, đường may và màu in trước khi ký duyệt sản xuất đại trà.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedKit(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Đóng lại
              </button>
              <Link
                to={`/yeu-cau-dich-vu?service=vat-pham-su-kien&package=${selectedKit.id}`}
                className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>Yêu cầu báo giá bộ này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: MẪU BÁO GIÁ 13 THÀNH PHẦN CHUẨN (SECTION 7 SPEC 16.TXT) */}
      {/* ==================================================================== */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-mono font-bold">
                  BÁO GIÁ CHUẨN {SAMPLE_QUOTATION_TEMPLATE.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-heading mt-1">
                  Cấu Trúc Báo Giá Minh Bạch 13 Hạng Mục Bắt Buộc
                </h3>
                <p className="text-xs text-slate-500">
                  Áp dụng cho mọi yêu cầu vật phẩm tại CHUOICUNGUNG.COM — Không báo giá gộp mơ hồ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQuotationModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seller & Buyer Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <div className="font-bold text-slate-800">1. Bên Bán (Đơn vị xuất VAT):</div>
                <div className="text-slate-600 text-[11px] mt-1">
                  {SAMPLE_QUOTATION_TEMPLATE.seller.name}<br />
                  MST: {SAMPLE_QUOTATION_TEMPLATE.seller.taxId}<br />
                  Đại diện: {SAMPLE_QUOTATION_TEMPLATE.seller.representative}
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-800">Bên Mua (Doanh nghiệp):</div>
                <div className="text-slate-600 text-[11px] mt-1">
                  {SAMPLE_QUOTATION_TEMPLATE.buyer.name}<br />
                  Người liên hệ: {SAMPLE_QUOTATION_TEMPLATE.buyer.contactPerson}<br />
                  Địa điểm: {SAMPLE_QUOTATION_TEMPLATE.buyer.address}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <div className="font-bold text-xs text-slate-800 uppercase font-heading">
                2, 3, 4. Bảng kê hạng mục, số lượng & quy cách:
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-2.5 font-bold">Hạng mục</th>
                      <th className="p-2.5 font-bold">Quy cách kỹ thuật</th>
                      <th className="p-2.5 font-bold text-center">SL</th>
                      <th className="p-2.5 font-bold text-right">Đơn giá</th>
                      <th className="p-2.5 font-bold text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {SAMPLE_QUOTATION_TEMPLATE.items.map((it) => (
                      <tr key={it.code}>
                        <td className="p-2.5 font-bold text-slate-800">{it.name}</td>
                        <td className="p-2.5 text-slate-600">{it.specifications}</td>
                        <td className="p-2.5 text-center font-mono">{it.quantity} {it.unit}</td>
                        <td className="p-2.5 text-right font-mono">{it.unitPrice.toLocaleString('vi-VN')} đ</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">{it.amount.toLocaleString('vi-VN')} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs space-y-1.5">
              <div className="font-bold text-teal-900 uppercase font-heading text-[11px]">
                5-9. Bóc tách chi phí & Thuế VAT:
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Chi phí sản xuất đại trà:</span>
                <span className="font-mono font-bold">{SAMPLE_QUOTATION_TEMPLATE.costBreakdown.productionCost.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí may mẫu thực tế:</span>
                <span className="font-mono">{SAMPLE_QUOTATION_TEMPLATE.costBreakdown.sampleCost.toLocaleString('vi-VN')} đ (Hoàn 100% khi ký HĐ)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Chi phí thiết kế & chế bản:</span>
                <span className="font-mono text-emerald-600 font-bold">Miễn phí (0 đ)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển giao tận nơi:</span>
                <span className="font-mono">{SAMPLE_QUOTATION_TEMPLATE.costBreakdown.shippingCost.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thuế GTGT (VAT 8%):</span>
                <span className="font-mono">{SAMPLE_QUOTATION_TEMPLATE.costBreakdown.vatTaxAmount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-teal-200">
                <span>TỔNG CỘNG THANH TOÁN:</span>
                <span className="font-mono text-teal-700 text-base">{SAMPLE_QUOTATION_TEMPLATE.costBreakdown.grandTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            {/* Commercial Terms 10-13 */}
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="font-bold text-xs text-slate-800 uppercase font-heading">
                10-13. Điều khoản thanh toán, tiến độ & cam kết lỗi:
              </div>
              <div>• <strong>10. Điều kiện thanh toán:</strong> {SAMPLE_QUOTATION_TEMPLATE.paymentTerms}</div>
              <div>• <strong>11. Thời gian cam kết:</strong> Ngày giao dự kiến <strong>{SAMPLE_QUOTATION_TEMPLATE.estimatedTimeline.confirmedDeliveryDate}</strong> (Đã được xưởng xác nhận tiến độ).</div>
              <div>• <strong>12. Trách nhiệm bàn giao:</strong> {SAMPLE_QUOTATION_TEMPLATE.deliveryResponsibility}</div>
              <div>• <strong>13. Chính sách lỗi:</strong> {SAMPLE_QUOTATION_TEMPLATE.defectPolicy}</div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQuotationModal(false)}
                className="py-2.5 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Đã hiểu quy chuẩn báo giá
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
