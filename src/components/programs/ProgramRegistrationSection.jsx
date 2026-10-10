import React, { useEffect, useRef, useState } from 'react';
import { persistSubmission } from '../../services/submissionService.js';
import { REGISTRATION_ROLES, buildRegistration, feeLabel, registrationState, sendRegistration, workflowContent } from './programWorkflowModel.js';
import './ProgramWorkflow.css';

const emptyForm = () => ({ companyName: '', contactPerson: '', phone: '', email: '', productsNeeded: '', productsOffered: '', targetSuppliers: '', targetFactories: '', memberCount: '', attendeesCount: '1', estimatedVolume: '', technicalStandards: '', preferredTime: '', presentationTime: '', presentationTopic: '', budgetProposal: '', consent: false });
function Field({ name, label, value, onChange, required = false, multiline = false, type = 'text', placeholder = '', min }) {
  const Tag = multiline ? 'textarea' : 'input';
  return <label className={`pw-field ${multiline ? 'pw-field-wide' : ''}`} htmlFor={`pw-${name}`}><span>{label}{required && <span aria-hidden="true"> *</span>}</span><Tag id={`pw-${name}`} name={name} type={multiline ? undefined : type} rows={multiline ? 3 : undefined} min={min} step={type === 'number' ? 1 : undefined} value={value || ''} required={required} placeholder={placeholder} onChange={event => onChange(name, event.target.value)} /></label>;
}
export default function ProgramRegistrationSection({ program, targetMeetingEntity = null, selectedRole = 'buyer', registrationIntent = 0 }) {
  const [role, setRole] = useState(selectedRole);
  const [forms, setForms] = useState(() => Object.fromEntries(REGISTRATION_ROLES.map(item => [item.id, emptyForm()])));
  const [options, setOptions] = useState({});
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const busy = useRef(false);
  const status = registrationState(program);
  const content = workflowContent(program);
  const form = forms[role];
  const setField = (name, value) => { setForms(previous => ({ ...previous, [role]: { ...previous[role], [name]: value } })); setReceipt(null); };
  const changeRole = next => { setRole(next); setError(''); setReceipt(null); };
  useEffect(() => { if (REGISTRATION_ROLES.some(item => item.id === selectedRole)) changeRole(selectedRole); }, [selectedRole, registrationIntent]);
  useEffect(() => {
    if (!targetMeetingEntity) return;
    const target = typeof targetMeetingEntity === 'string' ? { role: 'supplier', name: targetMeetingEntity } : targetMeetingEntity;
    changeRole(target.role);
    setForms(previous => ({ ...previous, [target.role]: { ...previous[target.role], [target.role === 'buyer' ? 'targetSuppliers' : 'targetFactories']: target.name, needId: target.needId || '' } }));
    document.getElementById('form-dang-ky-truc-tiep')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [targetMeetingEntity]);
  const allOptions = [...(program.participationOptions || []), ...content.packages.map(item => ({ ...item, role: 'SPONSOR' }))];
  const roleOptions = allOptions.filter(item => [REGISTRATION_ROLES.find(item => item.id === role).canonical, 'ALL'].includes(item.role));
  const submit = async event => {
    event.preventDefault(); if (busy.current) return;
    busy.current = true; setSending(true); setError(''); setReceipt(null);
    try { setReceipt(await sendRegistration(buildRegistration(program, role, form, options[role] || ''), persistSubmission)); }
    catch (failure) { setError(failure.message || 'Chưa lưu được đăng ký. Vui lòng thử lại.'); }
    finally { busy.current = false; setSending(false); }
  };
  const field = (name, label, props = {}) => <Field name={name} label={label} value={form[name]} onChange={setField} {...props} />;
  return <section id="dang-ky-tai-tro" className="pw-section">
    <header className="pw-section-head"><span className="pw-index">01 / THAM GIA</span><div><h2>Một hồ sơ đúng nhu cầu.<br />Một cuộc gặp có mục tiêu.</h2><p>Chọn vai trò, nêu sản phẩm mua–bán và đối tác muốn gặp. Ban điều phối rà soát hồ sơ trước khi xác nhận lịch.</p></div></header>
    <div className="pw-registration-layout">
      <div id="form-dang-ky-truc-tiep" className="pw-registration">
        <div className="pw-form-heading"><span>ĐĂNG KÝ KẾT NỐI</span><small>{status.open ? 'Hồ sơ → Rà soát → Xác nhận lịch' : 'Chưa nhận hồ sơ'}</small></div>
        <div className="pw-role-grid" aria-label="Vai trò tham gia">{REGISTRATION_ROLES.map(item => <button key={item.id} type="button" data-registration-role={item.id} aria-pressed={role === item.id} onClick={() => changeRole(item.id)} disabled={sending}><strong>{item.title}</strong><span>{item.description}</span></button>)}</div>
        {!status.open && <p className="pw-notice" role="status">{status.message}</p>}
        <form onSubmit={submit}>
          <fieldset disabled={!status.open || sending}><legend>Thông tin đơn vị & người phụ trách</legend><div className="pw-fields">
            {field('companyName', role === 'association' ? 'Tên Hội / Hiệp hội tham gia' : 'Tên doanh nghiệp / nhà máy', { required: true, placeholder: 'Tên đầy đủ của đơn vị' })}
            {field('contactPerson', role === 'association' ? 'Trưởng đoàn / người phụ trách' : 'Người phụ trách kết nối', { required: true, placeholder: 'Họ tên và chức vụ' })}
            {field('email', 'Email nhận xác nhận & lịch gặp', { required: true, type: 'email', placeholder: 'name@company.vn' })}
            {field('phone', 'Điện thoại / Zalo', { required: true, type: 'tel', placeholder: 'Số liên hệ của người phụ trách' })}
          </div></fieldset>
          <fieldset disabled={!status.open || sending}><legend>{role === 'sponsor' ? 'Phạm vi tài trợ & phiên giới thiệu' : 'Mục tiêu tham gia của doanh nghiệp'}</legend><div className="pw-fields">
            {role === 'buyer' && <>
              {field('productsNeeded', 'Nhà máy cần mua sản phẩm / dịch vụ gì?', { required: true, multiline: true, placeholder: 'Tên sản phẩm, quy cách, số lượng và thời điểm cần hàng' })}
              {field('targetSuppliers', 'Muốn kết nối / gặp 1:1 với nhà cung ứng nào?', { placeholder: 'Tên NCC hoặc nhóm năng lực cần tìm' })}
              {field('estimatedVolume', 'Số lượng / tần suất mua dự kiến', { placeholder: 'VD: 10.000 chi tiết mỗi tháng' })}
              {field('productsOffered', 'Nhà máy có sản phẩm cần bán / giới thiệu?', { multiline: true, placeholder: 'Không bắt buộc. Ghi sản phẩm nếu có nhu cầu chào bán.' })}
            </>}
            {role === 'supplier' && <>
              {field('productsOffered', 'Cung cấp / cần bán sản phẩm, dịch vụ gì?', { required: true, multiline: true, placeholder: 'Sản phẩm chủ lực, công suất, ứng dụng và lợi thế kỹ thuật' })}
              {field('targetFactories', 'Muốn gặp 1:1 với nhà máy / bên mua nào?', { required: true, placeholder: 'Tên nhà máy hoặc nhóm khách hàng mục tiêu' })}
              {field('technicalStandards', 'Năng lực & chứng chỉ đang có', { placeholder: 'Chỉ ghi chứng chỉ thực tế của doanh nghiệp' })}
              {field('productsNeeded', 'Doanh nghiệp cần mua sản phẩm / dịch vụ gì?', { multiline: true, placeholder: 'Không bắt buộc. Ghi nhu cầu mua nếu có.' })}
            </>}
            {role === 'association' && <>
              {field('memberCount', 'Số NCC / doanh nghiệp hội viên trong đoàn', { type: 'number', min: 1, required: true, placeholder: 'Số doanh nghiệp dự kiến tham gia' })}
              {field('targetFactories', 'Đoàn muốn gặp 1:1 với nhà máy nào?', { placeholder: 'Tên nhà máy hoặc ngành hàng mục tiêu' })}
              {field('productsOffered', 'Đoàn cung cấp / chào bán sản phẩm gì?', { multiline: true, required: true, placeholder: 'Nhóm ngành, sản phẩm và năng lực của các hội viên' })}
              {field('productsNeeded', 'Nhu cầu mua hàng của đoàn', { multiline: true, placeholder: 'Sản phẩm / dịch vụ cần tìm cho hội viên' })}
            </>}
            {role === 'sponsor' && <>
              {field('budgetProposal', 'Ngân sách tài trợ đề xuất (VND)', { placeholder: 'Ghi ngân sách để nhận đề xuất phạm vi phù hợp' })}
              {field('presentationTopic', 'Chủ đề giới thiệu / sản phẩm muốn trình bày', { required: true, placeholder: 'Giải pháp hoặc năng lực muốn giới thiệu' })}
              {field('productsOffered', 'Sản phẩm & nội dung đồng hành', { multiline: true, placeholder: 'Nội dung giới thiệu, trưng bày mẫu hoặc hoạt động hỗ trợ' })}
              {field('presentationTime', 'Khung giờ giới thiệu mong muốn', { placeholder: 'VD: phiên buổi sáng, đề xuất 5 phút' })}
            </>}
            {role !== 'sponsor' && field('preferredTime', 'Khung giờ gặp 1:1 mong muốn', { placeholder: 'VD: buổi sáng / sau 14:00' })}
            {field('attendeesCount', 'Số đại biểu tham gia', { type: 'number', min: 1, required: true })}
            {role === 'buyer' && field('technicalStandards', 'Tiêu chuẩn kỹ thuật / chứng chỉ yêu cầu', { placeholder: 'Vật liệu, dung sai, chứng nhận...' })}
            {roleOptions.length > 0 && <label className="pw-field pw-field-wide" htmlFor="pw-option"><span>Hình thức tham gia / gói đồng hành</span><select id="pw-option" value={options[role] || ''} onChange={event => setOptions(previous => ({ ...previous, [role]: event.target.value }))}><option value="">Chưa chọn — cần tư vấn</option>{roleOptions.map(option => <option key={option.id} value={option.id}>{option.title || option.name} — {feeLabel(option)}</option>)}</select></label>}
          </div><label className="pw-consent"><input type="checkbox" checked={form.consent} required onChange={event => setField('consent', event.target.checked)} /><span>Tôi đồng ý gửi thông tin cho ban điều phối để xử lý đăng ký và liên hệ về chương trình. Nhu cầu chi tiết và thông tin liên hệ không tự động công khai.</span></label></fieldset>
          {error && <p className="pw-error" role="alert">{error} Chưa xác nhận đăng ký thành công; thông tin đã điền vẫn được giữ trên form.</p>}
          {receipt && <div className="pw-success" role="status"><strong>Đã lưu hồ sơ đăng ký</strong><p>Mã tiếp nhận: {receipt.id}</p><p>Đang chờ rà soát. Đây chưa phải xác nhận thanh toán, giữ chỗ hoặc lịch gặp 1:1.</p></div>}
          <footer className="pw-form-footer"><p>Cuộc gặp cần sự đồng ý của hai bên.<br />Phí tham gia không bảo đảm một lịch gặp cụ thể.</p><button className="pw-button" type="submit" disabled={!status.open || sending}>{sending ? 'Đang gửi hồ sơ…' : 'Gửi đăng ký kết nối'} <span aria-hidden="true">↗</span></button></footer>
        </form>
      </div>
      <aside className="pw-event-sidebar">
        <section className="pw-agenda"><span className="pw-eyebrow">LỊCH CHƯƠNG TRÌNH</span><h3>Biết trước.<br />Chuẩn bị đúng.</h3><p>{program.date} · {program.time || 'Khung giờ đang cập nhật'}</p>
          {content.agenda.length ? <ol>{content.agenda.filter(item => item.visibility !== 'INTERNAL').map((item, index) => <li key={item.id || index}><time>{item.timeRange || item.time || [item.startAt, item.endAt].filter(Boolean).join(' – ') || 'Chờ xếp giờ'}</time><strong>{item.title}</strong><p>{item.description}</p>{item.room && <small>{item.room}</small>}</li>)}</ol> : <div className="pw-empty"><strong>Chờ công bố lịch chi tiết</strong><p>Khung giờ khai mạc, giới thiệu năng lực và gặp 1:1 sẽ được cập nhật riêng cho chương trình này.</p></div>}
          <p className="pw-fineprint">Khung giờ đề xuất trong form chưa phải lịch đã xác nhận.</p>
        </section>
        <section className="pw-pricing"><span className="pw-eyebrow">PHÍ & TÀI TRỢ</span><h3>Rõ phạm vi.<br />Rõ ngân sách.</h3>
          {allOptions.length ? allOptions.map(option => <div className="pw-price-row" key={option.id}><span>{option.title || option.name}<small>{option.description}</small></span><strong>{feeLabel(option)}</strong></div>) : <p>Ban tổ chức chưa công bố mức phí tham gia.</p>}
          {!content.packages.length && !(program.participationOptions || []).some(option => option.role === 'SPONSOR') && <p className="pw-fineprint">Gói tài trợ chưa công bố giá và thời lượng giới thiệu. Gửi đề xuất để ban tổ chức xác nhận bằng văn bản.</p>}
          <button type="button" className="pw-text-button" onClick={() => { changeRole('sponsor'); document.getElementById('form-dang-ky-truc-tiep')?.scrollIntoView({ behavior: 'smooth' }); }}>Trao đổi tài trợ <span aria-hidden="true">↗</span></button>
        </section>
      </aside>
    </div>
  </section>;
}
