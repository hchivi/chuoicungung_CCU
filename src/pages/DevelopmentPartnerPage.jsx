import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import { COOPERATION_TYPES, PARTNER_ROLES, submitPartnerApplication } from '../data/developmentPartnerData';
import { Action, Photo, ProcessStrip, SectionHeading } from '../components/services/EcosystemPageKit';
import './DevelopmentPartnerPage.css';

const COOPERATIONS = [
  { id: 'SERVICE_CONTENT', label: 'Nội dung & hồ sơ', title: 'Đưa năng lực doanh nghiệp đến đúng người.',
    text: 'Giới thiệu doanh nghiệp cần hồ sơ năng lực, ảnh nhà xưởng, video hoặc catalogue. CCU trao đổi phạm vi và báo giá trực tiếp với khách hàng.',
    image: '/images/ecosystem/media-profile.jpg', alt: 'Minh họa sản xuất nội dung và hồ sơ năng lực doanh nghiệp',
    items: ['Kết nối nhu cầu và đầu mối có sự đồng ý.', 'CCU làm rõ nội dung, đầu ra và phương án triển khai.'] },
  { id: 'SERVICE_MERCHANDISE', label: 'Vật phẩm sự kiện', title: 'Kết nối một nhu cầu có thể triển khai.',
    text: 'Doanh nghiệp cần đồng phục, quà tặng hoặc bộ vật phẩm? Giới thiệu đề bài, số lượng và thời gian dự kiến để cùng xây dựng phương án.',
    image: '/images/ecosystem/corporate-gifts.jpg', alt: 'Minh họa bộ vật phẩm và quà tặng doanh nghiệp',
    items: ['Làm rõ mục đích, số lượng và thời hạn.', 'Mẫu, thông số và chi phí cần được khách hàng xác nhận.'] },
  { id: 'PROGRAM_PARTICIPANTS', label: 'Nhóm tham gia', title: 'Một mạng lưới. Những nhu cầu liên quan.',
    text: 'Phối hợp mời nhóm bên mua hoặc nhà cung ứng tham gia chương trình phù hợp. Ưu tiên nhu cầu thật và năng lực liên quan, không chạy theo số lượng đăng ký.',
    image: '/images/ecosystem/association.jpg', alt: 'Minh họa buổi trao đổi của một nhóm doanh nghiệp',
    items: ['Xác định ngành hàng và mục tiêu tham gia.', 'Trao đổi điều kiện chương trình trước khi mời.'] },
  { id: 'PROGRAM_ORGANIZATION', label: 'Đơn vị tổ chức', title: 'Từ một đề bài đến chương trình có trọng tâm.',
    text: 'Kết nối nhà máy, KCN, hội hoặc đơn vị xúc tiến có nhu cầu gặp gỡ B2B. CCU cùng đầu mối xây dựng mục tiêu, phạm vi và cách theo dõi sau cuộc gặp.',
    image: '/images/services/matchmaking-meeting-v1.jpg', alt: 'Minh họa trao đổi trước một chương trình kết nối B2B',
    items: ['Kết nối đầu mối ra đề bài.', 'Thống nhất riêng trách nhiệm tổ chức và ngân sách.'] },
  { id: 'LOCAL_COORDINATION', label: 'Điều phối địa bàn', title: 'Hiểu địa bàn. Có phạm vi rõ ràng.',
    text: 'Phối hợp đón tiếp, hỗ trợ triển khai tại địa bàn hoặc thu thập thông tin được phép. Chỉ thực hiện những công việc đã được phân công và phê duyệt.',
    image: '/images/ecosystem/industrial-park.jpg', alt: 'Minh họa không gian khu công nghiệp phục vụ kết nối tại địa bàn',
    items: ['Thống nhất địa bàn, đầu mối và nhiệm vụ.', 'Không cam kết ngoài phạm vi được giao.'] },
];
const STEPS = [
  ['Trao đổi mạng lưới', 'Làm rõ nhóm doanh nghiệp, địa bàn và hình thức phù hợp.'],
  ['Chốt thỏa thuận', 'Thống nhất phạm vi, ghi nhận giới thiệu và điều kiện đối soát.'],
  ['Phối hợp triển khai', 'Giới thiệu có sự đồng ý; theo dõi cùng đầu mối phụ trách.'],
  ['Đối soát theo kết quả', 'Căn cứ giao dịch và thỏa thuận, không chỉ số lượt giới thiệu.'],
];
const FAQS = [
  ['Ai phù hợp tham gia?', 'Hội, hiệp hội, đơn vị tư vấn, tổ chức sự kiện, đối tác địa phương hoặc cá nhân có mạng lưới phù hợp. Nhà máy, nhà cung ứng và KCN có thể đề xuất phối hợp theo nhu cầu thực tế.'],
  ['Quyền lợi được tính thế nào?', 'Phạm vi công việc, cơ chế ghi nhận, mức chia sẻ và thời điểm đối soát được thống nhất trong thỏa thuận riêng. Không có một mức áp dụng chung và không cam kết thu nhập.'],
  ['Giới thiệu khách đã có?', 'Cần đối chiếu lịch sử, nguồn giới thiệu và phạm vi công việc trước khi xác nhận. Gửi thông tin không tự động tạo quyền lợi.'],
  ['Có cần gửi danh bạ?', 'Không yêu cầu tải danh bạ hàng loạt. Chỉ chia sẻ thông tin cần thiết khi có quyền hoặc sự đồng ý. Hợp tác không mua quyền ưu tiên kết quả matching hay xác minh nhà cung ứng.'],
];
const CONSENT = 'Chúng tôi hiểu rằng đây là bước đăng ký trao đổi ban đầu. Quyền hạn, mã đối tác, phạm vi giới thiệu và cơ chế đối soát sẽ được quy định cụ thể qua Thỏa thuận Hợp tác chính thức sau khi được phê duyệt.';

export default function DevelopmentPartnerPage() {
  const [activeId, setActiveId] = useState(COOPERATIONS[0].id);
  const formRef = useRef(null), statusRef = useRef(null);
  const [formData, setFormData] = useState({ applicantName: '', partnerType: 'BUSINESS_ASSOCIATION', contactPerson: '', role: '', email: '', phone: '', website: '', geographicScopes: ['Đồng Nai', 'TP. Hồ Chí Minh'], targetAudienceDescription: '', cooperationTypes: ['SERVICE_CONTENT', 'PROGRAM_PARTICIPANTS'], expectedCooperation: '', consentAccepted: false });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [formError, setFormError] = useState('');
  const active = COOPERATIONS.find(item => item.id === activeId);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Đối tác phát triển: cùng mở rộng kết nối B2B | CHUOICUNGUNG.COM';
    const existing = document.querySelector('meta[name="description"]');
    const previous = existing?.getAttribute('content');
    const meta = existing || document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Hợp tác cùng CCU: giới thiệu dịch vụ, phát triển nhóm doanh nghiệp và phối hợp chương trình B2B. Phạm vi rõ ràng, ghi nhận minh bạch, matching trung lập.';
    if (!existing) document.head.appendChild(meta);
    const schema = document.createElement('script'); schema.id = 'dev-partner-jsonld'; schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Đối tác phát triển', description: meta.content, url: 'https://chuoicungung.com/doi-tac-phat-trien', publisher: { '@type': 'Organization', name: 'CHUOICUNGUNG.COM', url: 'https://chuoicungung.com' } });
    document.head.appendChild(schema);
    return () => { schema.remove(); document.title = previousTitle; if (!existing) meta.remove(); else if (previous == null) meta.removeAttribute('content'); else meta.content = previous; };
  }, []);
  useEffect(() => { if (submitSuccess || formError) statusRef.current?.focus(); }, [submitSuccess, formError]);
  const update = event => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  const toggleCooperation = id => setFormData(prev => ({ ...prev, cooperationTypes: prev.cooperationTypes.includes(id) ? prev.cooperationTypes.filter(item => item !== id) : [...prev.cooperationTypes, id] }));
  const chooseCooperation = () => {
    setFormData(prev => ({ ...prev, cooperationTypes: [...new Set([...prev.cooperationTypes, activeId])] }));
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.getElementById('dp-applicantName')?.focus({ preventScroll: true });
  };
  const handleSubmitForm = event => {
    event.preventDefault(); setFormError('');
    if (![formData.applicantName, formData.contactPerson, formData.email, formData.phone, formData.targetAudienceDescription].every(value => value.trim())) { setFormError('Vui lòng điền đủ thông tin bắt buộc và mô tả mạng lưới doanh nghiệp.'); return; }
    if (!formData.cooperationTypes.length) { setFormError('Vui lòng chọn ít nhất một hình thức phối hợp.'); return; }
    if (!formData.consentAccepted) { setFormError('Vui lòng xác nhận nguyên tắc hợp tác trước khi gửi.'); return; }
    setFormSubmitting(true);
    try { setSubmitSuccess(submitPartnerApplication(formData, { name: formData.contactPerson, role: 'APPLICANT' })); }
    catch (error) { setFormError(error.message || 'Chưa lưu được hồ sơ. Vui lòng thử lại.'); }
    finally { setFormSubmitting(false); }
  };
  const field = (name, label, { type = 'text', required = false, autoComplete } = {}) => <div className="dp-field">
    <label htmlFor={'dp-' + name}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    <input id={'dp-' + name} name={name} type={type} required={required} autoComplete={autoComplete} value={formData[name]} onChange={update} maxLength={200} />
  </div>;

  return <div className="ec-page dp-page">
    <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center" aria-labelledby="dp-title">
      {/* Right Half Panoramic Showcase Visual with Smooth Gradient Fade matching Image 2 */}
      <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
        <img 
          src="/images/ecosystem/partnership.jpg" 
          alt="Minh họa cuộc trao đổi hợp tác giữa các đại diện doanh nghiệp" 
          className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-25 sm:opacity-40 lg:opacity-100 transition-opacity"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="hero-standard-container relative z-10 py-8 sm:py-10" style={{ width: 'min(1280px, calc(100% - 48px))', marginInline: 'auto' }}>
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6" aria-label="Đường dẫn trang">
          <Link to="/" className="hover:text-slate-900 transition">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <Link to="/hop-tac" className="hover:text-slate-900 transition">Hợp tác</Link>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-900 font-medium" aria-current="page">Đối tác phát triển</span>
        </nav>

        <div className="max-w-xl">
          <p className="text-sm font-semibold text-[#008060] tracking-wide mb-3">
            Đối tác phát triển mạng lưới CCU
          </p>

          <h1 id="dp-title" className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">
            Cùng mở rộng<br />kết nối doanh nghiệp.
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug mb-3">
            Đúng mạng lưới đối tác.<br />Rõ việc để đi tiếp.
          </p>

          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal max-w-xl mb-6">
            Giới thiệu đúng nhu cầu. Ghi nhận theo thỏa thuận minh bạch, tôn trọng mối quan hệ sẵn có của đối tác.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a
              href="#dp-apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#00A86B] to-[#008060] hover:from-[#00925c] hover:to-[#007054] text-white text-sm font-bold shadow-sm transition active:scale-95"
            >
              <span>Trao đổi hợp tác</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#dp-cooperations"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#005e46] transition p-2"
            >
              <span>Chọn hình thức</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <p className="font-medium text-slate-700">Hợp tác minh bạch, rõ trách nhiệm, không yêu cầu chia sẻ danh bạ.</p>
          <a href="#dp-cooperations" className="inline-flex items-center gap-1 text-[#008060] font-semibold hover:underline">
            Xem các hình thức phối hợp <ChevronDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <div className="ec-container">
      <div className="dp-audience"><p>Một mạng lưới phù hợp bắt đầu từ</p><ul><li>Hội & hiệp hội</li><li>Đối tác KCN, địa phương</li><li>Đơn vị tư vấn, xúc tiến</li><li>Tổ chức sự kiện</li><li>Mạng lưới chuyên ngành</li></ul></div>
    <section className="dp-section" id="dp-cooperations" aria-labelledby="dp-cooperations-title">
      <SectionHeading title={<span id="dp-cooperations-title">Chọn cách mình có thể đóng góp.</span>}>Không cần làm mọi thứ. Bắt đầu từ nhu cầu anh/chị hiểu và mạng lưới mình có.</SectionHeading>
      <div className="dp-cooperation-grid"><div className="dp-choice-list" role="group" aria-label="Hình thức phối hợp">{COOPERATIONS.map((item, index) => <button type="button" key={item.id} aria-pressed={item.id === activeId} aria-controls="dp-cooperation-detail" onClick={() => setActiveId(item.id)}><span className="dp-choice-index">0{index + 1}</span><span>{item.label}</span><ArrowUpRight size={20} aria-hidden="true" /></button>)}</div>
        <article id="dp-cooperation-detail" className="dp-cooperation-detail"><Photo src={active.image} alt={active.alt} /><div className="dp-detail-copy" aria-live="polite" aria-atomic="true"><h3>{active.title}</h3><p>{active.text}</p><ul>{active.items.map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}</ul><Action onClick={chooseCooperation}>Chọn hình thức này</Action></div></article>
      </div>
    </section>
    <section className="dp-section dp-working" aria-labelledby="dp-working-title"><SectionHeading title={<span id="dp-working-title">Hợp tác có cách làm rõ ràng.</span>}>Trao đổi trước. Thống nhất trách nhiệm. Theo dõi việc thực tế.</SectionHeading><ProcessStrip steps={STEPS} /><div className="dp-principles"><ShieldCheck size={24} aria-hidden="true" /><div><h3>Uy tín mạng lưới là điều cần giữ.</h3><p>Không thu mua danh bạ. Không tổ chức tuyển tuyến dưới. Quyền lợi hợp tác không ảnh hưởng kết quả matching, thứ hạng hay xác minh doanh nghiệp.</p></div></div></section>
    <section className="dp-section dp-apply" id="dp-apply" ref={formRef} aria-labelledby="dp-apply-title">
      <aside className="dp-apply-intro"><span className="ec-service-label">Bắt đầu bằng một cuộc trao đổi</span><h2 id="dp-apply-title">Mạng lưới của anh/chị<br />{' '}phù hợp với hình thức nào?</h2><p>Cho CCU biết nhóm doanh nghiệp và nhu cầu anh/chị có thể kết nối. Đây là đăng ký trao đổi, chưa phải phê duyệt đối tác.</p><Photo src="/images/ecosystem/association.jpg" alt="Minh họa các đại diện trao đổi về mạng lưới doanh nghiệp" /><p className="dp-privacy">Chỉ cung cấp thông tin cần thiết. Không đính kèm danh bạ khách hàng.</p></aside>
      {submitSuccess ? <div className="dp-success" role="status" tabIndex={-1} ref={statusRef}><ShieldCheck size={32} aria-hidden="true" /><h3>Đã lưu hồ sơ đăng ký.</h3><p>Mã hồ sơ: <strong>{submitSuccess.id}</strong></p><p>Trạng thái: chờ xem xét. Chưa phải xác nhận phê duyệt hoặc thỏa thuận hợp tác.</p><p>Bản hiện tại lưu hồ sơ trên trình duyệt này. Chưa xác nhận chuyển hồ sơ tới CCU.</p><Action onClick={() => { setSubmitSuccess(null); setFormData(prev => ({ ...prev, consentAccepted: false })); }}>Gửi hồ sơ khác</Action></div> : <form className="dp-form" onSubmit={handleSubmitForm} aria-labelledby="dp-apply-title" aria-describedby="dp-form-note">
        <p id="dp-form-note">Dấu * là thông tin bắt buộc. Bản hiện tại lưu trên trình duyệt, chưa xác nhận gửi tới CCU.</p>
        {formError && <p className="dp-error" role="alert" ref={statusRef} tabIndex={-1}>{formError}</p>}
        <fieldset><legend>Thông tin tổ chức & đầu mối</legend><div className="dp-field-grid">
          {field('applicantName', 'Tên tổ chức / cá nhân', { required: true, autoComplete: 'organization' })}
          <div className="dp-field"><label htmlFor="dp-partnerType">Vai trò mạng lưới *</label><select id="dp-partnerType" name="partnerType" value={formData.partnerType} onChange={update} required>{Object.values(PARTNER_ROLES).map(role => <option key={role.id} value={role.id}>{role.label}</option>)}</select></div>
          {field('contactPerson', 'Người liên hệ', { required: true, autoComplete: 'name' })}{field('role', 'Chức vụ', { autoComplete: 'organization-title' })}
          {field('email', 'Email', { type: 'email', required: true, autoComplete: 'email' })}{field('phone', 'Số điện thoại', { type: 'tel', required: true, autoComplete: 'tel' })}
          {field('website', 'Website (nếu có)', { type: 'url', autoComplete: 'url' })}
        </div></fieldset>
        <fieldset className="dp-cooperation-fields"><legend>Hình thức quan tâm *</legend>{COOPERATIONS.filter(item => COOPERATION_TYPES[item.id]).map(item => <label key={item.id} className="dp-checkbox"><input type="checkbox" name="cooperationTypes" value={item.id} checked={formData.cooperationTypes.includes(item.id)} onChange={() => toggleCooperation(item.id)} /><span>{item.label}</span></label>)}</fieldset>
        <div className="dp-field"><label htmlFor="dp-targetAudienceDescription">Nhóm doanh nghiệp anh/chị có thể kết nối *</label><textarea id="dp-targetAudienceDescription" name="targetAudienceDescription" value={formData.targetAudienceDescription} onChange={update} required rows={3} maxLength={3000} placeholder="Ví dụ: nhà máy tại Đồng Nai đang tìm nguồn cung bao bì." /></div>
        <label className="dp-checkbox dp-consent"><input type="checkbox" name="consentAccepted" required checked={formData.consentAccepted} onChange={event => setFormData(prev => ({ ...prev, consentAccepted: event.target.checked }))} /><span>{CONSENT}</span></label>
        <button className="ec-button dp-submit" type="submit" disabled={formSubmitting}>{formSubmitting ? 'Đang lưu hồ sơ…' : 'Đăng ký trao đổi'}<ArrowUpRight size={20} aria-hidden="true" /></button>
      </form>}
    </section>
    <section className="dp-section dp-faq" aria-labelledby="dp-faq-title"><h2 id="dp-faq-title">Trước khi hợp tác.</h2><div>{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}<Link className="ec-text-link" to="/hop-tac">Xem các hướng hợp tác khác <ArrowUpRight size={20} aria-hidden="true" /></Link></div></section>
  </div></div>;
}
