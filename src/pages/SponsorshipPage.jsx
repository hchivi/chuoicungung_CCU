// ============================================================================
// PAGE 32: TÀI TRỢ & ĐỒNG HÀNH CHƯƠNG TRÌNH
// ROUTE: /tai-tro
// Triển khai chuẩn hóa theo đặc tả 32.txt - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Send, X, CheckCircle, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';

import { SPONSORSHIP_TYPES, CONTRIBUTION_TYPES, ENTITLEMENT_TYPES, submitSponsorshipInquiry } from '../data/sponsorshipData';

import { getAllPrograms, PROGRAM_STATUSES_ENUM } from '../data/programsData';
import { getAllCatalogues } from '../data/cataloguesData';

import { PageIntro, Action, Photo, SectionHeading, ProcessStrip, ClosingNote } from '../components/services/EcosystemPageKit';
import { SPONSOR_STORIES, SPONSOR_RIGHTS } from './ecosystemPageContent';

export default function SponsorshipPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const typesRef = useRef(null);
  const opportunitiesRef = useRef(null);

  // SEO & Head title (Section 55)
  useEffect(() => {
    document.title = "Tài Trợ Chương Trình & Hoạt Động Doanh Nghiệp | CHUOICUNGUNG.COM";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Đồng hành cùng chương trình kết nối, catalogue, nội dung, thư viện ảnh và vật phẩm doanh nghiệp với phạm vi, quyền lợi, thời hạn và báo cáo được thống nhất rõ.'
      );
    }

    // Structured Data JSON-LD
    let scriptTag = document.getElementById('sponsorship-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'sponsorship-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Tài Trợ Chương Trình & Hoạt Động Doanh Nghiệp",
      "description": "Đồng hành cùng chương trình kết nối, catalogue, nội dung, thư viện ảnh và vật phẩm doanh nghiệp với phạm vi, quyền lợi minh bạch.",
      "url": "https://chuoicungung.com/tai-tro",
      "publisher": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      }
    });

    return () => {
      const existing = document.getElementById('sponsorship-jsonld');
      if (existing) existing.remove();
    };
  }, []);

  // Đọc ngữ cảnh prefill từ URL parameters (Sections 51, 52, 53)
  const initialProgramId = searchParams.get('programId') || '';
  const initialCatalogueId = searchParams.get('catalogueId') || '';
  const initialEditionId = searchParams.get('editionId') || '';
  const initialTypeParam = (searchParams.get('type') || '').toUpperCase();

  // Xác định sponsorshipType ban đầu từ query
  const resolveInitialType = () => {
    if (initialTypeParam === 'CATALOGUE' || initialCatalogueId) return 'CATALOGUE';
    if (initialTypeParam === 'MEDIA') return 'MEDIA';
    if (initialTypeParam === 'MERCHANDISE') return 'MERCHANDISE';
    if (initialTypeParam === 'CATEGORY') return 'CATEGORY';
    return 'PROGRAM';
  };

  // State cho Form gửi đề xuất
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    role: '',
    email: '',
    phone: '',
    sponsorshipType: resolveInitialType(),
    programId: initialProgramId,
    catalogueId: initialCatalogueId,
    catalogueEditionId: initialEditionId,
    contributionType: 'CASH',
    estimatedBudget: '',
    expectedBenefits: resolveInitialType() === 'CATALOGUE' ? ['CATALOGUE_PLACEMENT', 'REPORT'] : resolveInitialType() === 'MEDIA' ? ['VIDEO_PRODUCTION', 'PHOTO_LIBRARY'] : resolveInitialType() === 'MERCHANDISE' ? ['MERCHANDISE_BRANDING', 'REPORT'] : ['PROGRAM_LOGO', 'PROGRAM_BOOTH'],
    description: '',
    consentAccepted: false
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Lấy dữ liệu Programs & Catalogues
  const programs = useMemo(() => {
    try {
      const all = getAllPrograms();
      return all.filter(p =>
        p.status === PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN ||
        p.status === PROGRAM_STATUSES_ENUM.UPCOMING ||
        p.status === 'UPCOMING' ||
        p.status === 'REGISTRATION_OPEN'
      );
    } catch (e) {
      return [];
    }
  }, []);

  const catalogues = useMemo(() => {
    try {
      return getAllCatalogues();
    } catch (e) {
      return [];
    }
  }, []);

  // Bộ lọc danh sách cơ hội tài trợ
  const [activeOpportunityTab, setActiveOpportunityTab] = useState('ALL');

  // Xử lý chuyển tab / click vào loại tài trợ
  const handleSelectSponsorshipType = (typeKey) => {
    if (typeKey === 'CATEGORY') {
      // Hard rule Section 2 & 11: Redirect sang /founding-partner
      navigate('/founding-partner');
      return;
    }

    setFormData(prev => ({
      ...prev,
      sponsorshipType: typeKey,
      expectedBenefits: typeKey === 'CATALOGUE'
        ? ['CATALOGUE_PLACEMENT', 'REPORT']
        : typeKey === 'MEDIA'
        ? ['VIDEO_PRODUCTION', 'PHOTO_LIBRARY']
        : typeKey === 'MERCHANDISE'
        ? ['MERCHANDISE_BRANDING', 'REPORT']
        : ['PROGRAM_LOGO', 'PROGRAM_BOOTH']
    }));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nút prefill từ một Program / Catalogue cụ thể
  const handleSelectActivity = (type, id, title) => {
    setFormData(prev => ({
      ...prev,
      sponsorshipType: type,
      programId: type === 'PROGRAM' ? id : prev.programId,
      catalogueId: type === 'CATALOGUE' ? id : prev.catalogueId,
      expectedBenefits: type === 'CATALOGUE' ? ['CATALOGUE_PLACEMENT', 'REPORT'] : ['PROGRAM_LOGO', 'PROGRAM_BOOTH'],
      description: `Đề xuất đồng hành cùng hoạt động: ${title}`
    }));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle checkbox quyền lợi kỳ vọng
  const handleBenefitToggle = (benefitId) => {
    setFormData(prev => {
      const exists = prev.expectedBenefits.includes(benefitId);
      return {
        ...prev,
        expectedBenefits: exists
          ? prev.expectedBenefits.filter(b => b !== benefitId)
          : [...prev.expectedBenefits, benefitId]
      };
    });
  };

  // Xử lý gửi đề xuất tài trợ
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.organizationName || !formData.contactName || !formData.email || !formData.phone) {
      setFormError('Vui lòng điền đầy đủ Tên doanh nghiệp, Người liên hệ, Email và Số điện thoại.');
      return;
    }

    if (!formData.consentAccepted) {
      setFormError('Vui lòng tích xác nhận đồng ý với nguyên tắc đồng hành minh bạch của hệ thống.');
      return;
    }

    setFormSubmitting(true);

    try {
      const result = submitSponsorshipInquiry(formData, {
        name: formData.contactName,
        role: 'PROSPECTIVE_SPONSOR'
      });

      setSubmitSuccess(result);
      setFormSubmitting(false);

      // Scroll to success banner
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra khi nộp đề xuất. Vui lòng thử lại.');
      setFormSubmitting(false);
    }
  };

  return (
    <div className="ec-page ec-sponsorship-page">
      <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        {/* Right Half Panoramic Showcase Visual with Smooth Gradient Fade matching Image 2 */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/ecosystem/remote-presence.jpg" 
            alt="Không gian giới thiệu sản phẩm và hồ sơ doanh nghiệp tại bàn kết nối" 
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
            <Link to="/hop-tac">Hợp tác</Link><ChevronRight size={16} aria-hidden="true" />
            <span aria-current="page">Tài trợ & Đồng hành</span>
          </nav>
          <div className="max-w-xl">
            <PageIntro
              label="Tài trợ & Đồng hành"
              title={<>Đặt thương hiệu vào<br />đúng cuộc kết nối.</>}
              description="Đồng hành cùng chương trình, ấn phẩm hoặc nội dung. Rõ hoạt động, rõ quyền lợi, rõ cách bàn giao."
            >
              <Action onClick={() => typesRef.current?.scrollIntoView({ behavior: 'smooth' })}>Chọn hình thức đồng hành</Action>
              <Action onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} secondary>Gửi đề xuất</Action>
            </PageIntro>
          </div>
          <div className="mt-12 pt-6 border-t border-slate-100/90 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
            <p className="font-medium text-slate-700">Quyền lợi cụ thể, minh bạch đối soát sau chương trình.</p>
            <button type="button" onClick={() => typesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-1 text-[#0052cc] font-semibold hover:underline">
              Xem các hình thức tài trợ <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section ref={typesRef} id="hinh-thuc-dong-hanh" className="ec-section ec-container">
        <SectionHeading title="Đồng hành theo mục tiêu của bạn.">Chọn hoạt động phù hợp thương hiệu, đối tượng muốn tiếp cận và hình thức đóng góp.</SectionHeading>
        <div className="ec-sponsor-collection">{Object.entries(SPONSOR_STORIES).map(([key, item]) => <article key={key} className="ec-sponsor-option">
          <Photo src={item.image} alt={item.alt} /><h3>{item.title}</h3><p>{item.description}</p>
          <div className="ec-actions"><Action onClick={() => handleSelectSponsorshipType(key)} secondary>Trao đổi quyền lợi</Action></div>
        </article>)}</div>
        <div className="ec-detail-line"><h3>Muốn hiện diện theo chuyên mục?</h3><div><p>Founding Partner là gói đồng hành thương mại riêng theo ngành hoặc nhóm từ khóa, không phải tài trợ một chương trình.</p><div className="ec-actions"><Action to="/founding-partner" secondary>Xem Founding Partner</Action></div></div></div>
      </section>

      <section className="ec-section ec-container">
        <div className="ec-rights">
          <div className="ec-feature-copy"><h2>Quyền lợi phải cụ thể. Không chỉ là một logo.</h2><p>Trước khi triển khai, hai bên thống nhất hạng mục, thời hạn và tài liệu đối soát cho từng hoạt động.</p><p className="ec-note">Tài trợ không làm tăng thứ hạng matching, không thay thế xác minh năng lực và không bảo đảm đơn hàng.</p></div>
          <dl>{[['Vị trí & Phạm vi', 'Logo, bài viết, không gian giới thiệu hoặc vật phẩm nào được đưa vào thỏa thuận.'], ['Thời hạn & Đầu mối', 'Mốc triển khai, thời gian hiện diện và người phụ trách của hai bên.'], ['Bàn giao & Báo cáo', 'Danh sách hạng mục, hình ảnh hoặc đường dẫn thực hiện để đối chiếu quyền lợi.']].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
        </div>
      </section>

      <section ref={opportunitiesRef} id="hoat-dong-dong-hanh" className="ec-section ec-container">
        <SectionHeading title="Tìm hoạt động muốn đồng hành.">Chương trình và ấn phẩm từ dữ liệu hiện có trong hệ thống.</SectionHeading>
        <div className="ec-modes" aria-label="Loại hoạt động">{[['ALL', 'Tất cả'], ['PROGRAM', 'Chương trình'], ['CATALOGUE', 'Catalogue']].map(([key, label]) => <button type="button" key={key} className="ec-choice" aria-pressed={activeOpportunityTab === key} onClick={() => setActiveOpportunityTab(key)}>{label}</button>)}</div>
        <div className="ec-programs">
          {activeOpportunityTab !== 'CATALOGUE' && programs.slice(0, 4).map(program => <article key={program.id} className="ec-program"><h3>{program.title}</h3><div className="ec-program-meta"><span>{program.date}</span><span>{program.location}</span></div><div className="ec-actions"><Action onClick={() => handleSelectActivity('PROGRAM', program.id, program.title)} secondary>Chọn chương trình này</Action><Action to={`/chuong-trinh/${program.slug || program.id}`} secondary>Xem chi tiết</Action></div></article>)}
          {activeOpportunityTab !== 'PROGRAM' && catalogues.slice(0, 2).map(catalogue => <article key={catalogue.id} className="ec-program"><h3>{catalogue.title}</h3><p>Trao đổi về ấn bản, vị trí thương hiệu và phạm vi phát hành.</p><div className="ec-actions"><Action onClick={() => handleSelectActivity('CATALOGUE', catalogue.id, catalogue.title)} secondary>Chọn ấn phẩm này</Action><Action to={`/catalogue/${catalogue.slug || catalogue.id}`} secondary>Xem chi tiết</Action></div></article>)}
        </div>
        {((activeOpportunityTab === 'PROGRAM' && !programs.length) || (activeOpportunityTab === 'CATALOGUE' && !catalogues.length) || (activeOpportunityTab === 'ALL' && !programs.length && !catalogues.length)) && <div className="ec-empty"><h3>Chưa có hoạt động phù hợp trong danh sách.</h3><p>Bạn vẫn có thể gửi mục tiêu đồng hành để trao đổi phương án tiếp theo.</p></div>}
        <div className="ec-actions"><Action to="/chuong-trinh" secondary>Tất cả chương trình</Action><Action to="/catalogue" secondary>Tất cả ấn phẩm</Action></div>
      </section>

      <section className="ec-section ec-container">
        <SectionHeading title="Từ mục tiêu đến quyền lợi được bàn giao." />
        <ProcessStrip steps={[['Gửi đề xuất', 'Hoạt động, mục tiêu và hình thức đóng góp.'], ['Chốt quyền lợi', 'Xác lập phạm vi, thời hạn và chi phí.'], ['Ký thỏa thuận', 'Thống nhất trách nhiệm trước triển khai.'], ['Đối soát kết quả', 'Nghiệm thu các hạng mục đã cam kết.']]} />
      </section>

      {formData.sponsorshipType === 'CATEGORY' ? <section ref={formRef} className="ec-registration ec-container ec-empty"><h2>Đồng hành chuyên mục với Founding Partner.</h2><p>Hình thức bạn chọn có trang và hồ sơ đăng ký riêng.</p><div className="ec-actions"><Action to="/founding-partner">Xem Founding Partner</Action></div></section> : <>
      <section id="gui-de-xuat-tai-tro" ref={formRef} className="ec-registration ec-container">
        <div className="ec-intake">
          <div className="ec-form-shell">
            <div className="mb-8">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                Tiếp Nhận Nhu Cầu Đồng Hành
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Gửi đề xuất đồng hành
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Chọn hoạt động, hình thức đóng góp và quyền lợi bạn muốn trao đổi.
              </p>
            </div>

            {/* Thông báo thành công */}
            {submitSuccess && (
              <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-950 mb-1">
                      Đề xuất đã được ghi nhận (Mã: {submitSuccess.id})
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                      Hồ sơ của <strong>{submitSuccess.organizationName}</strong> đã được ghi nhận vào hàng đợi điều phối tài trợ (Trạng thái: <strong>ĐỀ XUẤT MỚI TIẾP NHẬN - INQUIRY</strong>).
                    </p>
                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                      <p><strong>Bước tiếp theo:</strong> Làm rõ hoạt động, quyền lợi và phạm vi đóng góp với đầu mối liên hệ ({submitSuccess.phone}).</p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      Gửi thêm đề xuất khác
                    </button>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <div role="alert" className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {!submitSuccess && (
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* 1. Chọn loại tài trợ */}
                <div>
                  <label htmlFor="sponsor-field-1" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    1. Hình thức tài trợ quan tâm *
                  </label>
                  <div className="ec-sponsor-form-types">
                    {['PROGRAM', 'CATALOGUE', 'MEDIA', 'MERCHANDISE'].map(typeKey => {
                      const typeObj = SPONSORSHIP_TYPES[typeKey];
                      const isSelected = formData.sponsorshipType === typeKey;
                      return (
                        <button
                          key={typeKey}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleSelectSponsorshipType(typeKey)}
                          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="text-[10px] font-black text-slate-400 block mb-1">
                            {typeObj.code}
                          </span>
                          <span className="text-xs font-bold leading-tight">
                            {SPONSOR_STORIES[typeKey].label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Chọn hoạt động cụ thể nếu có */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.sponsorshipType === 'PROGRAM' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chương trình muốn đồng hành (Tùy chọn)
                      </label>
                      <select id="sponsor-field-1"
                        value={formData.programId}
                        onChange={(e) => setFormData(prev => ({ ...prev, programId: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="">-- Chưa chọn (Tư vấn chương trình phù hợp) --</option>
                        {programs.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.sponsorshipType === 'CATALOGUE' && (
                    <div>
                      <label htmlFor="sponsor-field-2" className="block text-xs font-bold text-slate-700 mb-1">
                        Catalogue / Ấn phẩm muốn tài trợ
                      </label>
                      <select id="sponsor-field-2"
                        value={formData.catalogueId}
                        onChange={(e) => setFormData(prev => ({ ...prev, catalogueId: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="">-- Chưa chọn ấn phẩm cụ thể --</option>
                        {catalogues.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="sponsor-field-3" className="block text-xs font-bold text-slate-700 mb-1">
                      Hình thức đóng góp dự kiến *
                    </label>
                    <select id="sponsor-field-3"
                      value={formData.contributionType}
                      onChange={(e) => setFormData(prev => ({ ...prev, contributionType: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {Object.values(CONTRIBUTION_TYPES).map(c => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sponsor-field-4" className="block text-xs font-bold text-slate-700 mb-1">
                      Ngân sách dự kiến (VNĐ - Không bắt buộc)
                    </label>
                    <input id="sponsor-field-4"
                      type="number"
                      placeholder="Ví dụ: 30000000 (30 triệu)"
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      * Không bắt buộc đưa ngân sách trước khi xác lập phạm vi.
                    </span>
                  </div>
                </div>

                {/* 3. Thông tin người đại diện & Doanh nghiệp */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-base mb-3">
                    2. Thông tin doanh nghiệp & Đầu mối liên hệ *
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="sponsor-field-5" className="block text-xs text-slate-700 font-medium mb-1">
                        Tên doanh nghiệp / Đơn vị *
                      </label>
                      <input id="sponsor-field-5"
                        type="text"
                        required
                        placeholder="Công ty TNHH / Cổ phần..."
                        value={formData.organizationName}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="sponsor-field-6" className="block text-xs text-slate-700 font-medium mb-1">
                        Người đại diện liên hệ *
                      </label>
                      <input id="sponsor-field-6"
                        type="text"
                        required
                        placeholder="Họ và tên..."
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="sponsor-field-7" className="block text-xs text-slate-700 font-medium mb-1">
                        Chức vụ / Phòng ban
                      </label>
                      <input id="sponsor-field-7"
                        type="text"
                        placeholder="Giám đốc Marketing / Trưởng phòng Kinh doanh..."
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="sponsor-field-8" className="block text-xs text-slate-700 font-medium mb-1">
                        Số điện thoại liên hệ *
                      </label>
                      <input id="sponsor-field-8"
                        type="tel"
                        required
                        placeholder="09xx xxx xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="sponsor-field-9" className="block text-xs text-slate-700 font-medium mb-1">
                        Email nhận hồ sơ đề xuất (Proposal) *
                      </label>
                      <input id="sponsor-field-9"
                        type="email"
                        required
                        placeholder="email@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Quyền lợi kỳ vọng (Checkboxes) */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-base mb-2">
                    3. Quyền lợi kỳ vọng hướng tới (Chọn các mục phù hợp)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.values(ENTITLEMENT_TYPES).filter(ent => SPONSOR_RIGHTS[formData.sponsorshipType]?.includes(ent.id)).map(ent => {
                      const isChecked = formData.expectedBenefits.includes(ent.id);
                      return (
                        <label
                          key={ent.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                            isChecked ? 'bg-blue-50/60 border-blue-400 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleBenefitToggle(ent.id)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span className="font-medium">{ent.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Ghi chú mô tả thêm */}
                <div>
                  <label htmlFor="sponsor-field-10" className="block text-xs text-slate-700 font-medium mb-1">
                    Ghi chú chi tiết về mục tiêu đồng hành hoặc yêu cầu đặc thù
                  </label>
                  <textarea id="sponsor-field-10"
                    rows={3}
                    placeholder="Mô tả thông điệp muốn truyền tải, quy mô xưởng sản xuất hoặc số lượng sản phẩm dự kiến tài trợ..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  ></textarea>
                </div>

                {/* 6. Checkbox đồng thuận */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consentAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, consentAccepted: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>
                      Chúng tôi hiểu rằng đề xuất này là bước tiếp nhận thông tin (Inquiry). Mọi quyền lợi, nghĩa vụ tài chính và biên bản nghiệm thu sẽ được thống nhất qua Hợp đồng chính thức theo quy định của CHUOICUNGUNG.COM.
                    </span>
                  </label>
                </div>

                {/* Nút gửi */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {formSubmitting ? (
                      <span>Đang gửi...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gửi đề xuất</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      </>}

      <section className="ec-section ec-container ec-qa">
        <div><h3>Có thể đóng góp bằng sản phẩm?</h3><p>Có thể đề xuất hiện vật, dịch vụ, in ấn hoặc địa điểm. Phạm vi và điều kiện tiếp nhận được thống nhất theo từng hoạt động.</p></div>
        <div><h3>Tài trợ có phải góp vốn vào CCU?</h3><p>Không. Nhà đầu tư trao đổi theo luồng riêng; tài trợ là đồng hành với hoạt động và quyền lợi đã thỏa thuận.</p><div className="ec-actions"><Action to="/hop-tac?type=INVESTOR" secondary>Trao đổi đầu tư</Action></div></div>
      </section>

      <ClosingNote title="Chọn sự hiện diện có ý nghĩa với thương hiệu." description="Gửi mục tiêu bạn muốn đạt được. Hai bên sẽ làm rõ hoạt động và phạm vi đồng hành trước khi cam kết.">
        <Action onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}>Gửi đề xuất đồng hành</Action>
      </ClosingNote>
    </div>
  );
}
