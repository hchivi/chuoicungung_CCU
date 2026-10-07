import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Video, Send, Check, AlertCircle, ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import { REPRESENTATION_SCOPE_FLAGS, SAMPLE_RETURN_OPTIONS, getEligibleRemotePrograms, submitRemotePresenceRequest, submitRemotePresenceInterest } from '../data/remotePresenceData.js';

import { PageIntro, Action, Photo, SectionHeading, ProcessStrip, ClosingNote, Modal } from '../components/services/EcosystemPageKit';

export default function RemotePresenceServicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledProgramId = searchParams.get('programId') || searchParams.get('program') || '';

  const eligiblePrograms = getEligibleRemotePrograms();

  // State Form Đăng Ký
  const [selectedProgramId, setSelectedProgramId] = useState(prefilledProgramId || (eligiblePrograms[0]?.id || ''));
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [selectedProductsText, setSelectedProductsText] = useState('');
  const [hasSample, setHasSample] = useState(false);
  const [sampleDetails, setSampleDetails] = useState('');
  const [sampleQuantity, setSampleQuantity] = useState(1);
  const [returnOption, setReturnOption] = useState('RETURN_TO_SUPPLIER');
  const [responderName, setResponderName] = useState('');
  const [responderRole, setResponderRole] = useState('');
  const [responderPhone, setResponderPhone] = useState('');
  const [responderEmail, setResponderEmail] = useState('');
  const [slaHours, setSlaHours] = useState(8);
  const [selectedScopes, setSelectedScopes] = useState([
    'CAN_PRESENT_APPROVED_PROFILE',
    'CAN_SHOW_APPROVED_VIDEO',
    'CAN_SHOW_CATALOGUE',
    'CAN_EXPLAIN_APPROVED_PRODUCT_SUMMARY',
    'CAN_COLLECT_CONTACT_REQUEST',
    'CAN_FORWARD_APPROVED_MATERIALS',
    'CAN_RECORD_QUESTIONS'
  ]);
  const [consent, setConsent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedRequestCode, setSubmittedRequestCode] = useState('');
  const [formError, setFormError] = useState('');

  // State Đăng ký quan tâm khi không có sự kiện phù hợp
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestOrg, setInterestOrg] = useState('');
  const [interestContact, setInterestContact] = useState('');
  const [interestPhone, setInterestPhone] = useState('');
  const [interestSuccess, setInterestSuccess] = useState(false);

  // SEO Setup (Section 65)
  useEffect(() => {
    document.title = 'Hiện Diện Từ Xa Tại Chương Trình | CHUOICUNGUNG.COM';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Hiện Diện Từ Xa Tại Sự Kiện Chuỗi Cung Ứng",
      "description": "Giới thiệu hồ sơ, video, catalogue hoặc mẫu sản phẩm tại chương trình phù hợp khi doanh nghiệp chưa thể có mặt trực tiếp; phạm vi đại diện và quyền lợi được thống nhất rõ.",
      "provider": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      },
      "url": "https://chuoicungung.com/dich-vu/hien-dien-tu-xa",
      "serviceType": "B2B Remote Presence and Proxy Representation"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'remote-presence-service-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('remote-presence-service-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('remote-presence-service-schema');
      if (el) el.remove();
    };
  }, []);

  const handleScopeToggle = (key) => {
    if (selectedScopes.includes(key)) {
      setSelectedScopes(selectedScopes.filter(k => k !== key));
    } else {
      setSelectedScopes([...selectedScopes, key]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!companyName.trim()) {
      setFormError('Vui lòng nhập tên công ty / doanh nghiệp.');
      return;
    }
    if (!responderName.trim() || !responderPhone.trim()) {
      setFormError('Vui lòng nhập đầy đủ họ tên và số điện thoại người phụ trách phản hồi.');
      return;
    }
    if (!consent) {
      setFormError('Bạn cần đồng ý với điều khoản dịch vụ và ranh giới đại diện ủy thác.');
      return;
    }

    // Tách các sản phẩm theo dòng hoặc dấu phẩy
    const rawProducts = selectedProductsText
      .split(/[\n,]+/)
      .map(p => p.trim())
      .filter(Boolean);

    if (rawProducts.length === 0) {
      setFormError('Vui lòng liệt kê ít nhất 1 sản phẩm/năng lực cụ thể.');
      return;
    }
    if (rawProducts.length > 3) {
      setFormError('Chọn tối đa 3 sản phẩm hoặc năng lực trọng tâm để giới thiệu.');
      return;
    }

    try {
      const newReq = submitRemotePresenceRequest({
        programId: selectedProgramId,
        supplierName: companyName,
        selectedProducts: rawProducts.map((p, idx) => ({ id: `P-${idx + 1}`, name: p })),
        responderName,
        responderRole,
        responderPhone,
        responderEmail,
        slaHours: Number(slaHours),
        representationScope: selectedScopes,
        sampleInfo: {
          hasSample,
          description: sampleDetails,
          quantity: sampleQuantity,
          returnOption
        },
        consent: true
      });

      setSubmittedRequestCode(newReq.requestPublicCode);
      setFormSubmitted(true);
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra khi nộp hồ sơ.');
    }
  };

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    if (!interestOrg.trim() || !interestPhone.trim()) return;

    submitRemotePresenceInterest({
      organizationName: interestOrg,
      contactName: interestContact,
      contactPhone: interestPhone,
      consent: true
    });
    setInterestSuccess(true);
  };

  return (
    <div className="ec-page ec-remote-page">
      {/* ========================================================================= */}
      {/* HERO SECTION (MATCHES IMAGE 2 LAYOUT & BALANCED COMPACT TITLE)            */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        {/* Right Half Panoramic Showcase Visual with Smooth Gradient Fade matching Image 2 */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/ecosystem/remote-presence.jpg" 
            alt="Điều phối viên trao đổi cùng khách tại bàn trưng bày hồ sơ và mẫu cơ khí" 
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-30 sm:opacity-45 lg:opacity-100 transition-opacity duration-700"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Content Container Aligned Exactly with Image 2 */}
        <div className="hero-standard-container relative z-10 py-8 sm:py-10" style={{ width: 'min(1280px, calc(100% - 48px))', marginInline: 'auto' }}>
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn trang">
            <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <Link to="/dich-vu" className="hover:text-slate-900 transition">Dịch vụ</Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-900 font-medium" aria-current="page">Hiện diện từ xa</span>
          </nav>

          <div className="max-w-xl">
            
            {/* Category Label */}
            <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
              Hiện diện từ xa &amp; Đại diện ủy thác
            </p>

            {/* H1 Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
              Không đến trực tiếp.<br />Vẫn giới thiệu được năng lực.
            </h1>

            {/* Lede (Tagline) */}
            <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
              Đúng hồ sơ &amp; mẫu chi tiết.<br />Rõ việc để đi tiếp.
            </p>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
              Gửi hồ sơ, catalogue và mẫu sản phẩm. Đội điều phối giới thiệu nội dung đã duyệt, ghi nhận nhu cầu và chuyển về doanh nghiệp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#danh-sach-chuong-trinh"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95"
              >
                <span>Chọn chương trình</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#dang-ky-hien-dien"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2"
              >
                <span>Gửi hồ sơ</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
            <p className="font-medium text-slate-700">Mỗi sự kiện đều có biên bản bàn giao và danh sách đối tác quan tâm.</p>
            <a href="#danh-sach-chuong-trinh" className="inline-flex items-center gap-1 text-[#008060] font-semibold hover:underline">
              Xem các chương trình sắp diễn ra <ChevronDown size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div className="ec-outcomes ec-container">
        {[['Hồ sơ đã duyệt', 'Giới thiệu đúng thông tin doanh nghiệp cung cấp.'], ['Mẫu & Catalogue', 'Có vật liệu để khách xem và trao đổi cụ thể.'], ['Ghi nhận nhu cầu', 'Chuyển câu hỏi và yêu cầu liên hệ về đầu mối.'], ['Bạn trực tiếp chốt', 'Báo giá và hợp đồng do doanh nghiệp quyết định.']].map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
      </div>

      <section className="ec-section ec-container ec-pair">
        <Photo src="/images/services/matchmaking-samples-v1.jpg" alt="Catalogue và các mẫu chi tiết cơ khí trên bàn trao đổi" />
        <div className="ec-feature-copy">
          <h2>Mang đúng phần khách cần xem.</h2>
          <p>Chọn tối đa 3 sản phẩm hoặc năng lực trọng tâm. Mỗi hồ sơ có tài liệu được phép giới thiệu và một người phụ trách phản hồi.</p>
          <ul className="ec-feature-list">
            {['Hồ sơ năng lực và thông tin liên hệ.', 'Video ngắn, catalogue hoặc mẫu phù hợp.', 'Câu hỏi cần ghi nhận và phạm vi được giới thiệu.'].map(text => <li key={text}><Check size={20} strokeWidth={1.5} aria-hidden="true" />{text}</li>)}
          </ul>
          <p className="ec-note">Điều phối viên không tự báo giá, đàm phán hay ký thay doanh nghiệp. Việc gửi mẫu, bảo quản và hoàn trả được thống nhất trước chương trình.</p>
          <Action to="/dich-vu/truyen-thong-doanh-nghiep" secondary>Chuẩn bị hồ sơ & Video</Action>
        </div>
      </section>

      <section id="danh-sach-chuong-trinh" className="ec-section ec-container">
        <SectionHeading title="Chọn nơi doanh nghiệp sẽ hiện diện.">Các chương trình trong hệ thống đang mở tiếp nhận hồ sơ từ xa.</SectionHeading>
        {eligiblePrograms.length ? <div className="ec-programs">
          {eligiblePrograms.map(prog => <article key={prog.id} className="ec-program">
            <h3>{prog.title}</h3>
            <div className="ec-program-meta"><span>{prog.date}</span><span>{prog.location}</span></div>
            {prog.remoteSubmissionDeadline && <p>Hạn gửi hồ sơ: {prog.remoteSubmissionDeadline}</p>}
            <div className="ec-actions"><Action onClick={() => {
              setSelectedProgramId(prog.id);
              document.getElementById('dang-ky-hien-dien')?.scrollIntoView({ behavior: 'smooth' });
            }}>Chọn tham gia</Action></div>
          </article>)}
        </div> : <div className="ec-empty"><h3>Chưa có chương trình nhận hồ sơ từ xa.</h3><p>Để lại đầu mối liên hệ nếu doanh nghiệp muốn nhận thông tin về chương trình tiếp theo.</p></div>}
        <div className="ec-actions"><Action onClick={() => setShowInterestModal(true)} secondary>Nhận tin chương trình mới</Action><Action to="/chuong-trinh" secondary>Xem tất cả chương trình</Action></div>
      </section>

      <section className="ec-section ec-container">
        <SectionHeading title="Chuẩn bị một lần. Theo dõi từng bước." />
        <ProcessStrip steps={[['Chọn chương trình', 'Xem ngành, địa bàn và hạn gửi hồ sơ.'], ['Duyệt nội dung', 'Chốt tài liệu, sản phẩm và phạm vi giới thiệu.'], ['Giới thiệu tại chỗ', 'Điều phối viên ghi nhận câu hỏi và đầu mối.'], ['Bạn tiếp nối', 'Doanh nghiệp trực tiếp phản hồi và làm việc.']]} />
      </section>

      <section id="dang-ky-hien-dien" className="ec-registration ec-container">
        <div className="ec-form-shell ec-intake">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-6 text-white">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">Tiếp nhận hồ sơ</div>
            <h2 className="text-2xl font-bold mt-1">Gửi hồ sơ hiện diện từ xa</h2>
            <p className="text-sm text-blue-100 mt-1">
              Điền thông tin doanh nghiệp và sản phẩm trọng tâm để được bộ phận điều phối thẩm định phạm vi giới thiệu.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Hồ sơ đã được ghi nhận</h3>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                Mã hồ sơ yêu cầu: <span className="font-mono font-bold text-blue-700 text-base">{submittedRequestCode}</span>.
                Bước tiếp theo là thống nhất phạm vi giới thiệu với đầu mối phản hồi của doanh nghiệp.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg"
                >
                  Nộp hồ sơ khác
                </button>
                <Link
                  to="/tai-khoan/dich-vu"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
                >
                  Theo dõi yêu cầu của tôi
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
              {formError && (
                <div role="alert" className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Chọn chương trình */}
              <div>
                <label htmlFor="remote-field-1" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  1. Chương trình tham gia từ xa <span className="text-rose-500">*</span>
                </label>
                <select id="remote-field-1"
                  required
                  disabled={!eligiblePrograms.length}
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {!eligiblePrograms.length && <option value="">Chưa có chương trình nhận hồ sơ</option>}
                  {eligiblePrograms.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      [{prog.publicCode}] {prog.title} ({prog.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Thông tin doanh nghiệp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="remote-field-2" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    2. Tên doanh nghiệp <span className="text-rose-500">*</span>
                  </label>
                  <input id="remote-field-2"
                    type="text"
                    required
                    placeholder="VD: Công ty Cơ khí Chính xác ABC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="remote-field-3" className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Mã số thuế (Tùy chọn)
                  </label>
                  <input id="remote-field-3"
                    type="text"
                    placeholder="VD: 0312345678"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 3. Sản phẩm trọng tâm (1-3 sản phẩm) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="remote-products" className="block text-xs font-bold text-slate-700 uppercase">
                    3. Sản phẩm / Năng lực cốt lõi muốn giới thiệu (Tối đa 3) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-500">Mỗi sản phẩm cách nhau bởi dấu phẩy hoặc xuống dòng</span>
                </div>
                <textarea id="remote-products"
                  rows={2}
                  required
                  placeholder="VD: Gia công đồ gá Jig kiểm tra; Tiện chi tiết nhôm chính xác; Đúc áp lực vỏ động cơ"
                  value={selectedProductsText}
                  onChange={(e) => setSelectedProductsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* 4. Quy cách hàng mẫu (nếu gửi mẫu) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasSampleCheck"
                      checked={hasSample}
                      onChange={(e) => setHasSample(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="hasSampleCheck" className="text-xs font-bold text-slate-800 uppercase cursor-pointer">
                      Có gửi hàng mẫu đối chứng trưng bày tại sự kiện
                    </label>
                  </div>
                  <span className="text-xs text-slate-500">Cần tuân thủ quy chuẩn kích thước</span>
                </div>

                {hasSample && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label htmlFor="remote-field-4" className="block text-xs font-semibold text-slate-600 mb-1">Mô tả mẫu sản phẩm</label>
                        <input id="remote-field-4"
                          type="text"
                          placeholder="VD: 02 chi tiết trục tiện mẫu kích thước 15x5cm"
                          value={sampleDetails}
                          onChange={(e) => setSampleDetails(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label htmlFor="remote-field-5" className="block text-xs font-semibold text-slate-600 mb-1">Số lượng mẫu</label>
                        <input id="remote-field-5"
                          type="number"
                          min={1}
                          max={5}
                          value={sampleQuantity}
                          onChange={(e) => setSampleQuantity(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="remote-field-6" className="block text-xs font-semibold text-slate-600 mb-1">Phương án xử lý mẫu sau sự kiện</label>
                      <select id="remote-field-6"
                        value={returnOption}
                        onChange={(e) => setReturnOption(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                      >
                        {Object.values(SAMPLE_RETURN_OPTIONS).map(opt => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Cước gửi và hoàn trả mẫu cần được xác nhận trước chương trình.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Đầu mối phản hồi của doanh nghiệp */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h3 className="text-base mb-3">
                  5. Đầu Mối Tiếp Nhận Câu Hỏi & Báo Giá (Responder) <span className="text-rose-500">*</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="remote-field-7" className="block text-xs font-semibold text-slate-600 mb-1">Họ tên người phụ trách</label>
                    <input id="remote-field-7"
                      type="text"
                      required
                      placeholder="VD: Trần Văn Minh"
                      value={responderName}
                      onChange={(e) => setResponderName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="remote-field-8" className="block text-xs font-semibold text-slate-600 mb-1">Chức vụ / Vai trò</label>
                    <input id="remote-field-8"
                      type="text"
                      placeholder="VD: Giám đốc Kỹ thuật / Trưởng phòng Kinh doanh"
                      value={responderRole}
                      onChange={(e) => setResponderRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="remote-field-9" className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại liên hệ</label>
                    <input id="remote-field-9"
                      type="tel"
                      required
                      placeholder="VD: 0912 345 678"
                      value={responderPhone}
                      onChange={(e) => setResponderPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="remote-field-10" className="block text-xs font-semibold text-slate-600 mb-1">Email nhận câu hỏi Buyer</label>
                    <input id="remote-field-10"
                      type="email"
                      required
                      placeholder="VD: minh.tv@congty.com"
                      value={responderEmail}
                      onChange={(e) => setResponderEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-xs text-slate-600">
                  <label htmlFor="remote-response-time">Thời gian doanh nghiệp cam kết phản hồi:</label>
                  <select id="remote-response-time"
                    value={slaHours}
                    onChange={(e) => setSlaHours(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800"
                  >
                    <option value={4}>Trong 4 giờ làm việc</option>
                    <option value={8}>Trong 8 giờ làm việc (1 ngày)</option>
                    <option value={24}>Trong 24 giờ</option>
                  </select>
                </div>
              </div>

              {/* 6. Phạm vi đại diện */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  6. Phạm vi được phép giới thiệu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.values(REPRESENTATION_SCOPE_FLAGS).map((scope) => (
                    <label
                      key={scope.key}
                      className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope.key)}
                        onChange={() => handleScopeToggle(scope.key)}
                        className="mt-0.5 rounded text-blue-600"
                      />
                      <div>
                        <span className="font-semibold text-slate-800 block">{scope.label}</span>
                        <span className="text-[11px] text-slate-500">{scope.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 7. Đồng ý điều khoản & Submit */}
              <div className="pt-4 border-t border-slate-200">
                <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 text-blue-600 rounded"
                  />
                  <span>
                    Doanh nghiệp xác nhận thông tin cung cấp là chính xác, chấp thuận ranh giới điều phối viên không tự ý báo giá/đàm phán hợp đồng, và đồng ý để ban tổ chức chuẩn hóa kịch bản giới thiệu theo quy định.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!eligiblePrograms.length}
                  className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/20 transition-transform flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Gửi hồ sơ</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="ec-section ec-container ec-qa">
        <div><h3>Khách hỏi giá thì sao?</h3><p>Điều phối viên ghi lại số lượng, quy cách và thông tin liên hệ để doanh nghiệp tự gửi báo giá.</p></div>
        <div><h3>Có được ưu tiên kết quả tìm kiếm?</h3><p>Không. Dịch vụ hiện diện không thay thế xác minh năng lực và không thay đổi matching nguồn cung.</p></div>
      </section>

      <ClosingNote title="Chưa có bộ hồ sơ sẵn sàng?" description="Chuẩn hóa hồ sơ, hình ảnh và video trước khi gửi doanh nghiệp đến một chương trình.">
        <Action to="/dich-vu/truyen-thong-doanh-nghiep">Xem dịch vụ nội dung</Action>
      </ClosingNote>

      {showInterestModal && <Modal title="Nhận tin chương trình mới" onClose={() => { setShowInterestModal(false); setInterestSuccess(false); }}>
        {interestSuccess ? <div role="status"><h3>Thông tin đã được ghi nhận.</h3><p>Doanh nghiệp đã đăng ký quan tâm chương trình hiện diện từ xa.</p><div className="ec-actions"><Action onClick={() => { setShowInterestModal(false); setInterestSuccess(false); }}>Đóng</Action></div></div> :
          <form onSubmit={handleInterestSubmit} className="ec-form-shell space-y-4">
            <p>Để lại đầu mối nhận thông tin. Việc đăng ký không tạo yêu cầu tham gia hay nghĩa vụ thanh toán.</p>
            <div><label htmlFor="interest-company">Tên doanh nghiệp</label><input id="interest-company" className="w-full" required value={interestOrg} onChange={e => setInterestOrg(e.target.value)} autoComplete="organization" /></div>
            <div><label htmlFor="interest-contact">Người liên hệ</label><input id="interest-contact" className="w-full" required value={interestContact} onChange={e => setInterestContact(e.target.value)} autoComplete="name" /></div>
            <div><label htmlFor="interest-phone">Số điện thoại</label><input id="interest-phone" className="w-full" type="tel" required value={interestPhone} onChange={e => setInterestPhone(e.target.value)} autoComplete="tel" /></div>
            <p className="text-sm">Khi gửi, bạn đồng ý để CCU liên hệ về chương trình hiện diện từ xa.</p>
            <button type="submit" className="ec-button">Đăng ký nhận tin</button>
          </form>}
      </Modal>}
    </div>
  );
}
