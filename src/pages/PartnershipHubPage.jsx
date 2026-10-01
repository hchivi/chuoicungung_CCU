import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Handshake, Building2, Factory, Users, Crown, Award,
  Sparkles, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck,
  FileText, Mail, Phone, Lock, AlertTriangle, ExternalLink,
  DollarSign, Briefcase, Info, Send, HelpCircle, Layers, Check
} from 'lucide-react';
import {
  PARTNERSHIP_CATEGORIES,
  FINANCE_CLASSIFICATIONS,
  submitPartnershipInquiry,
  getAllPartnershipInquiries
} from '../data/partnershipHubData.js';

export default function PartnershipHubPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);
  const selectorRef = useRef(null);

  // Initial category from query param if available
  const initialCat = searchParams.get('type') || 'ASSOCIATION';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);

  // Form State
  const [formData, setFormData] = useState({
    organizationName: '',
    legalName: '',
    representativeName: '',
    roleTitle: '',
    phone: '',
    email: '',
    proposalScope: '',
    consentOperational: true,
    consentMarketing: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // SEO & Schema (URL 114)
  useEffect(() => {
    document.title = 'Hợp tác | CHUOICUNGUNG.COM';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://chuoicungung.com/hop-tac';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Cổng hợp tác hệ sinh thái CHUOICUNGUNG.COM: nguyên tắc minh bạch, phân định rõ phạm vi, tài trợ không can thiệp matching hay xếp hạng.';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Hợp Tác Hệ Sinh Thái – CHUOICUNGUNG.COM",
      "description": "Khám phá các hình thức hợp tác cùng CHUOICUNGUNG.COM dành cho Hội/Hiệp hội, Khu công nghiệp, nhà tài trợ, Founding Partner, đối tác phát triển, cố vấn và nhà đầu tư.",
      "url": "https://chuoicungung.com/hop-tac"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'partnership-hub-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('partnership-hub-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('partnership-hub-schema');
      if (el) el.remove();
    };
  }, []);

  const scrollToSelector = () => {
    selectorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = (category = null) => {
    if (category) setSelectedCategory(category);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const result = submitPartnershipInquiry({
      ...formData,
      category: selectedCategory
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitResult(result);
      setFormData({
        organizationName: '',
        legalName: '',
        representativeName: '',
        roleTitle: '',
        phone: '',
        email: '',
        proposalScope: '',
        consentOperational: true,
        consentMarketing: false
      });
    } else {
      setErrorMessage(result.message || 'Có lỗi xảy ra khi gửi đề xuất.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-24 overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (SECTION 2 SPEC 37.TXT)                                   */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-5">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Hợp tác hệ sinh thái</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono">
            <Handshake className="w-4 h-4 text-blue-600" />
            <span>PARTNERSHIP HUB — ĐỊNH HƯỚNG QUAN HỆ HỆ SINH THÁI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl font-heading">
            Hợp tác
          </h1>
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Hợp tác cùng hệ sinh thái chuỗi cung ứng
          </p>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
            Chọn hình thức phù hợp với vai trò và nguồn lực của bạn. Mỗi quan hệ hợp tác được xác định rõ phạm vi, trách nhiệm, quyền truy cập, quyền lợi và cách ghi nhận trước khi triển khai.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={scrollToSelector}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
            >
              <span>XEM NGUYÊN TẮC</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToForm()}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-600" />
              <span>GỬI ĐỀ NGHỊ</span>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5 max-w-3xl mt-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>Nguyên tắc minh bạch & độc lập:</strong> CHUOICUNGUNG.COM không gom tất cả thành danh xưng mơ hồ &ldquo;Đối tác chiến lược&rdquo;. Mọi quan hệ đều được phân định rạch ròi theo hợp đồng chuyên biệt. Tài trợ hoặc hợp tác thương mại <strong>hoàn toàn không can thiệp, không làm thay đổi kết quả matching, xếp hạng hoặc quy trình xác minh KYC</strong> của nhà cung ứng.
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 7 PARTNERSHIP CARDS (SECTIONS 3 TO 20)                                 */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <section ref={selectorRef} className="space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block font-mono">
              Danh mục 7 hình thức hợp tác
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mt-1 font-heading">
              Chọn Đúng Đối Tượng & Khung Hợp Tác Phù Hợp
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Bấm vào từng thẻ để khám phá phạm vi đóng góp, quyền lợi và truy cập quy trình chuyên biệt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNERSHIP_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                        {cat.code}
                      </span>
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                        {cat.enName}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug font-heading">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {cat.name}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div>
                        <strong className="text-slate-800 font-semibold block text-[11px] uppercase text-slate-500">
                          Bạn đóng góp gì:
                        </strong>
                        <p className="leading-relaxed mt-0.5">{cat.contribution}</p>
                      </div>

                      <div>
                        <strong className="text-slate-800 font-semibold block text-[11px] uppercase text-slate-500">
                          Phạm vi phối hợp:
                        </strong>
                        <p className="leading-relaxed mt-0.5">{cat.scope}</p>
                      </div>
                    </div>

                    {/* Hard Rule Badge */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800 block text-[10.5px] uppercase text-blue-700 mb-0.5">
                        Nguyên tắc ràng buộc:
                      </span>
                      {cat.hardRule}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 mt-5 border-t border-slate-100 space-y-2">
                    {/* Primary CTA */}
                    {cat.targetRoute === '/hop-tac' ? (
                      <button
                        onClick={() => scrollToForm(cat.id)}
                        className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <span>{cat.primaryCtaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        to={cat.targetRoute}
                        className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <span>{cat.primaryCtaText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {/* Secondary CTA if available */}
                    {cat.secondaryRoute && (
                      <Link
                        to={cat.secondaryRoute}
                        className="w-full px-3 py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-blue-600 block transition"
                      >
                        {cat.secondaryCtaText}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. "CÁCH MỘT ĐỀ XUẤT HỢP TÁC ĐƯỢC XỬ LÝ" (SECTION 39 SPEC 37.TXT)        */}
        {/* ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block font-mono">
              Quy trình chuẩn hóa
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-heading">
              Cách Một Đề Xuất Hợp Tác Được Tiếp Nhận & Triển Khai
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              8 bước minh bạch đảm bảo mọi đối tác đều được phục vụ đúng thẩm quyền và trách nhiệm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Chọn loại hợp tác', desc: 'Xác định rõ vai trò (Hội, KCN, Sponsor, FP, DP, Cố vấn hay Nhà đầu tư).' },
              { step: '02', title: 'Gửi đề xuất', desc: 'Nộp thông tin đại diện và phạm vi đề xuất qua Form tiếp nhận chuẩn.' },
              { step: '03', title: 'Làm rõ phạm vi', desc: 'Ban Thư Ký tiếp nhận, kiểm tra xung đột độc quyền và thẩm định sơ bộ.' },
              { step: '04', title: 'Xác định quyền lợi', desc: 'Phân định rõ trách nhiệm, quyền truy cập dữ liệu và nghĩa vụ pháp lý.' },
              { step: '05', title: 'Thỏa thuận văn bản', desc: 'Ký kết hợp đồng/MoU chuyên biệt tương ứng với từng loại hình.' },
              { step: '06', title: 'Giao người phụ trách', desc: 'Hệ thống tự động cấp Task, gán Owner chuyên trách theo dõi.' },
              { step: '07', title: 'Triển khai đầu việc', desc: 'Thực thi các hoạt động kết nối, bàn giao quyền lợi hoặc tổ chức sự kiện.' },
              { step: '08', title: 'Đối soát & báo cáo', desc: 'Nghiệm thu kết quả, xuất báo cáo và đối soát tài chính minh bạch.' },
            ].map((st) => (
              <div key={st.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-base font-black font-mono text-blue-600 block">
                  {st.step}.
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PARTNERSHIP TYPE SELECTOR & INTAKE FORM (SECTIONS 30, 31, 33, 35)      */}
        {/* ========================================================================= */}
        <section ref={formRef} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block font-mono">
              Biểu mẫu tiếp nhận chính thức
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-heading">
              Bạn Muốn Phối Hợp Theo Cách Nào?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Chọn phân hệ hợp tác bên dưới để mở đúng biểu mẫu và gán người phụ trách chuyên môn.
            </p>
          </div>

          {/* Type Selector Tabs (Section 30) */}
          <div className="flex flex-wrap gap-2">
            {PARTNERSHIP_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">{cat.code}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          {submitResult ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900 font-heading">
                Đề Xuất Hợp Tác Đã Được Ghi Nhận Thành Công!
              </h4>
              <p className="text-xs text-emerald-800">
                Mã tiếp nhận chính thức: <strong className="font-mono text-sm px-2.5 py-1 bg-emerald-200/60 rounded text-emerald-950 font-bold">{submitResult.trackingCode}</strong>
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Hồ sơ đang ở trạng thái <strong>CHỜ THẨM ĐỊNH (UNDER_REVIEW)</strong>. Điều phối viên sẽ liên hệ với đầu mối đại diện trong vòng 24–48 giờ làm việc.
              </p>
              <button
                type="button"
                onClick={() => setSubmitResult(null)}
                className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
              >
                Gửi Thêm Đề Xuất Khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500 block">Đang nộp hồ sơ cho phân hệ:</span>
                  <strong className="text-blue-700 font-bold text-sm">
                    {PARTNERSHIP_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </strong>
                </div>

                {/* Direct route hint for Sponsor / FP / DP / KCN */}
                {PARTNERSHIP_CATEGORIES.find(c => c.id === selectedCategory)?.targetRoute !== '/hop-tac' && (
                  <Link
                    to={PARTNERSHIP_CATEGORIES.find(c => c.id === selectedCategory)?.targetRoute || '#'}
                    className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Xem trang chuyên biệt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Đơn Vị / Tổ Chức Đề Xuất <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="VD: Hiệp Hội Doanh Nghiệp Điện Tử / Quỹ Đầu Tư..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Pháp Nhân Đầy Đủ (Nếu có)
                  </label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    placeholder="VD: CÔNG TY CỔ PHẦN..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Người Đại Diện Liên Hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    placeholder="Họ và tên"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chức Vụ / Vai Trò
                  </label>
                  <input
                    type="text"
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    placeholder="VD: Giám Đốc Đầu Tư / Phó Chủ Tịch..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số Điện Thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Công Tác <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@organization.vn"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội Dung & Phạm Vi Đề Xuất Hợp Tác
                </label>
                <textarea
                  rows={4}
                  value={formData.proposalScope}
                  onChange={(e) => setFormData({ ...formData, proposalScope: e.target.value })}
                  placeholder="Mô tả mục tiêu hợp tác, quy mô chương trình dự kiến, hoặc đề xuất cơ chế phối hợp..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentOperational}
                    onChange={(e) => setFormData({ ...formData, consentOperational: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Tôi cam kết thông tin cung cấp là chính xác và đồng ý để Ban Thư Ký liên hệ thẩm định theo Quy chế Bảo mật B2B của CHUOICUNGUNG.COM.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentMarketing}
                    onChange={(e) => setFormData({ ...formData, consentMarketing: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    (Tùy chọn) Nhận bản tin Báo cáo Thị trường FDI & Lịch trình Ngày hội Chuỗi Cung Ứng định kỳ qua Email.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Đề Xuất Hợp Tác'}</span>
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 5. FINANCIAL SEPARATION & TRANSPARENCY (SECTIONS 21, 25, 48, 56)           */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Nguyên Tắc Pháp Lý & Tài Chính Minh Bạch (Section 25 & 56)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading">
            Phân Tách Rạch Ròi Giữa Doanh Thu Thương Mại, Tài Trợ & Vốn Đầu Tư
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
              <span className="font-bold text-emerald-400 block font-mono text-xs">DOANH THU THƯƠNG MẠI</span>
              <p className="leading-relaxed">
                Hợp đồng cung cấp dịch vụ sản xuất hồ sơ, video, vật phẩm và tài trợ chuyên mục. Có nghĩa vụ giao nhận kết quả và xuất hóa đơn VAT theo quy định.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
              <span className="font-bold text-amber-400 block font-mono text-xs">VỐN ĐẦU TƯ / CỔ PHẦN</span>
              <p className="leading-relaxed">
                Các khoản góp vốn đầu tư hạ tầng số và phát triển nền tảng tuyệt đối <strong>KHÔNG</strong> được ghi nhận vào doanh thu bán hàng hay hòa lẫn vào chi phí hoạt động.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
              <span className="font-bold text-sky-400 block font-mono text-xs">LIÊN MINH PHI THƯƠNG MẠI</span>
              <p className="leading-relaxed">
                Thỏa thuận hợp tác đồng tổ chức với các Hội, Hiệp hội và BQL KCN hoạt động trên nguyên tắc hỗ trợ phi lợi nhuận cho cộng đồng sản xuất công nghiệp.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
