import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, AlertTriangle, ExternalLink, Send, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { PARTNERSHIP_CATEGORIES, submitPartnershipInquiry } from '../data/partnershipHubData.js';

import { PageIntro, Action, Photo, SectionHeading, ProcessStrip, ClosingNote } from '../components/services/EcosystemPageKit';
import { PARTNER_STORIES } from './ecosystemPageContent';

export default function PartnershipHubPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);
  const selectorRef = useRef(null);

  // Initial category from query param if available
  const requestedCategory = (searchParams.get('type') || '').toUpperCase();
  const initialCat = Object.hasOwn(PARTNER_STORIES, requestedCategory) ? requestedCategory : 'ASSOCIATION';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);

  useEffect(() => { setSelectedCategory(initialCat); }, [initialCat]);

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

  // SEO & Schema
  useEffect(() => {
    document.title = 'Hợp Tác Hệ Sinh Thái | CHUOICUNGUNG.COM';

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

  const story = PARTNER_STORIES[selectedCategory];
  return (
    <div className="ec-page ec-partnership-page">
      <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        {/* Right Half Panoramic Showcase Visual with Smooth Gradient Fade matching Image 2 */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/ecosystem/partnership.jpg" 
            alt="Đại diện doanh nghiệp trao đổi hợp tác tại phòng họp sáng" 
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-25 sm:opacity-40 lg:opacity-100 transition-opacity"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        <div className="ec-container relative z-10 w-full">
          <nav className="ec-breadcrumb" aria-label="Đường dẫn trang">
            <Link to="/">Trang chủ</Link><ChevronRight size={16} aria-hidden="true" />
            <span aria-current="page">Hợp tác cùng CCU</span>
          </nav>
          <div className="max-w-xl">
            <PageIntro
              label="Hợp tác cùng CCU"
              title={<>Cùng tạo những<br />kết nối có giá trị.</>}
              description="Từ hội viên, nhà máy đến khu công nghiệp. Chọn vai trò của bạn và tìm cách phối hợp phù hợp."
            >
              <Action onClick={scrollToSelector}>Chọn vai trò hợp tác</Action>
              <Action onClick={() => scrollToForm()} secondary>Gửi đề xuất</Action>
            </PageIntro>
          </div>
          <div className="mt-12 pt-6 border-t border-slate-100/90 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
            <p className="font-medium text-slate-700">Mỗi đối tác là một mắt xích trong chuỗi cung ứng quốc gia.</p>
            <button type="button" onClick={scrollToSelector} className="inline-flex items-center gap-1 text-[#0052cc] font-semibold hover:underline">
              Xem các vai trò hợp tác <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section ref={selectorRef} id="vai-tro-hop-tac" className="ec-section ec-container">
        <SectionHeading title="Bạn muốn tham gia với vai trò nào?" />
        <div className="ec-role-layout">
          <nav className="ec-role-nav" aria-label="Vai trò hợp tác">
            {PARTNERSHIP_CATEGORIES.map(category => <button key={category.id} type="button" aria-pressed={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)}>{PARTNER_STORIES[category.id].label}<ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" /></button>)}
          </nav>
          <div className="ec-role-story" aria-live="polite">
            <Photo src={story.image} alt={story.alt} />
            <h3>{story.title}</h3><p>{story.description}</p>
            <ul className="ec-feature-list">{story.points.map(text => <li key={text}><Check size={20} strokeWidth={1.5} aria-hidden="true" />{text}</li>)}</ul>
            <div className="ec-actions"><Action onClick={() => scrollToForm(selectedCategory)}>Trao đổi hợp tác</Action>{story.route && <Action to={story.route} secondary>{story.routeLabel}</Action>}</div>
          </div>
        </div>
      </section>

      <section className="ec-section ec-container">
        <SectionHeading title="Bắt đầu bằng một đề xuất rõ ràng." />
        <ProcessStrip steps={[['Giới thiệu tổ chức', 'Vai trò, lĩnh vực và đầu mối liên hệ.'], ['Trao đổi mục tiêu', 'Ngành, địa bàn hoặc hoạt động muốn phối hợp.'], ['Chốt phạm vi', 'Trách nhiệm, nguồn lực và điều kiện làm việc.'], ['Phối hợp triển khai', 'Có đầu mối và cách theo dõi từng hoạt động.']]} />
      </section>

        <section id="gui-de-xuat-hop-tac" ref={formRef} className="ec-form-shell ec-registration ec-container ec-intake space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block font-mono">
              Biểu mẫu tiếp nhận chính thức
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-heading">
              Gửi đề xuất hợp tác
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Chọn vai trò, giới thiệu tổ chức và nêu mục tiêu bạn muốn trao đổi.
            </p>
          </div>

          {/* Type Selector Tabs (Section 30) */}
          <div className="ec-compact-tabs">
            {PARTNERSHIP_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">{cat.code}</span>
                  <span>{PARTNER_STORIES[cat.id].label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          {submitResult ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900 font-heading">
                Đề xuất đã được ghi nhận
              </h4>
              <p className="text-xs text-emerald-800">
                Mã tiếp nhận chính thức: <strong className="font-mono text-sm px-2.5 py-1 bg-emerald-200/60 rounded text-emerald-950 font-bold">{submitResult.trackingCode}</strong>
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Hồ sơ đang chờ xem xét. Bước tiếp theo là làm rõ phạm vi phối hợp với đầu mối đại diện của bạn.
              </p>
              <button
                type="button"
                onClick={() => setSubmitResult(null)}
                className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
              >
                Gửi đề xuất khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div role="alert" className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-2xl flex flex-wrap items-center gap-3 justify-between">
                <div className="text-xs">
                  <span className="text-slate-500 block">Vai trò đăng ký:</span>
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
                    <span>Xem chi tiết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="partner-field-1" className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Đơn Vị / Tổ Chức Đề Xuất <span className="text-rose-500">*</span>
                  </label>
                  <input id="partner-field-1"
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="VD: Hiệp Hội Doanh Nghiệp Điện Tử / Quỹ Đầu Tư..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="partner-field-2" className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Pháp Nhân Đầy Đủ (Nếu có)
                  </label>
                  <input id="partner-field-2"
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
                  <label htmlFor="partner-field-3" className="block text-xs font-bold text-slate-700 mb-1">
                    Người Đại Diện Liên Hệ <span className="text-rose-500">*</span>
                  </label>
                  <input id="partner-field-3"
                    type="text"
                    required
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    placeholder="Họ và tên"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="partner-field-4" className="block text-xs font-bold text-slate-700 mb-1">
                    Chức Vụ / Vai Trò
                  </label>
                  <input id="partner-field-4"
                    type="text"
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    placeholder="VD: Giám Đốc Đầu Tư / Phó Chủ Tịch..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="partner-field-5" className="block text-xs font-bold text-slate-700 mb-1">
                    Số Điện Thoại <span className="text-rose-500">*</span>
                  </label>
                  <input id="partner-field-5"
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
                <label htmlFor="partner-field-6" className="block text-xs font-bold text-slate-700 mb-1">
                  Email Công Tác <span className="text-rose-500">*</span>
                </label>
                <input id="partner-field-6"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@organization.vn"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="partner-field-7" className="block text-xs font-bold text-slate-700 mb-1">
                  Nội Dung & Phạm Vi Đề Xuất Hợp Tác
                </label>
                <textarea id="partner-field-7"
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
                    (Tùy chọn) Nhận bản tin và lịch chương trình kết nối qua email.
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
                  <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đề xuất'}</span>
                </button>
              </div>
            </form>
          )}
        </section>

      <ClosingNote title="Hợp tác minh bạch theo từng vai trò." description="Tài trợ, gói Founding Partner và đầu tư là các hình thức riêng biệt. Không hình thức nào mua được kết quả matching hay thay thế xác minh năng lực.">
        <Action to="/tai-tro" secondary>Xem hình thức tài trợ</Action>
      </ClosingNote>
    </div>
  );
}
