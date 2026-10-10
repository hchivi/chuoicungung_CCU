import React, { useRef, useState } from 'react';
import { persistSubmission } from '../../services/submissionService.js';
import { publicResults, safeMediaUrl } from './programWorkflowModel.js';
import './ProgramWorkflow.css';

export default function ProgramPostMatchingSection({ program }) {
  const { pairs, photos } = publicResults(program);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [sending, setSending] = useState(false);
  const busy = useRef(false);
  const visiblePhotos = photos.filter(photo => filter === 'all' || photo.pairId === filter);
  const submit = async event => {
    event.preventDefault(); if (busy.current) return;
    const form = new FormData(event.currentTarget);
    const photoUrl = String(form.get('photoUrl') || '').trim();
    if (photoUrl && !safeMediaUrl(photoUrl)) { setError('Đường dẫn ảnh / album phải là http hoặc https hợp lệ.'); return; }
    busy.current = true; setSending(true); setError(''); setReceipt(null);
    try {
      const saved = await persistSubmission('serviceRequest', { domain: 'program-post-matching', programId: program.id, programTitle: program.title, buyer: form.get('buyer'), supplier: form.get('supplier'), product: form.get('product'), nextAction: form.get('nextAction'), photoUrl, contactEmail: form.get('email'), consent: true });
      setReceipt(saved.id);
    } catch (failure) { setError(failure.message || 'Chưa lưu được kết quả. Vui lòng thử lại.'); }
    finally { busy.current = false; setSending(false); }
  };
  return <section id="sau-matching" className="pw-section pw-results">
    <header className="pw-section-head"><span className="pw-index">03 / SAU KẾT NỐI</span><div><h2>Cuộc gặp kết thúc.<br />Hợp tác được tiếp nối.</h2><p>Theo dõi bên nào đã gặp bên nào, sản phẩm trao đổi và bước tiếp theo. Hình ảnh, kết quả chỉ công khai sau khi được duyệt.</p></div></header>
    <div className="pw-results-heading"><div><span className="pw-eyebrow">SỔ KẾT NỐI CỦA CHƯƠNG TRÌNH</span><h3>{pairs.length ? `${pairs.length} cặp kết nối đã công bố` : 'Chưa công bố cặp kết nối'}</h3></div><button className="pw-button" type="button" aria-expanded={showForm} aria-controls="pw-evidence-form" onClick={() => setShowForm(!showForm)}>Gửi ảnh và kết quả <span aria-hidden="true">↗</span></button></div>
    {showForm && <form id="pw-evidence-form" className="pw-evidence-form" onSubmit={submit}><h3>Ghi nhận cuộc gặp & gửi tư liệu</h3><p>Gửi liên kết ảnh / album đã có. Đây là đề nghị rà soát, chưa phải kết quả được xác nhận hoặc công bố.</p><fieldset disabled={sending}><legend className="sr-only">Thông tin kết quả cuộc gặp</legend><div className="pw-fields">{[['buyer', 'Nhà máy / Bên mua', true], ['supplier', 'Nhà cung ứng / Bên bán', true], ['product', 'Sản phẩm / nội dung trao đổi', true], ['nextAction', 'Bước tiếp theo & thời hạn dự kiến', true], ['photoUrl', 'Liên kết ảnh / album (không bắt buộc)', false], ['email', 'Email để xác minh kết quả', true]].map(([name, label, required]) => <label className="pw-field" key={name} htmlFor={`pw-result-${name}`}><span>{label}{required ? ' *' : ''}</span><input name={name} id={`pw-result-${name}`} required={required} type={name === 'email' ? 'email' : name === 'photoUrl' ? 'url' : 'text'} /></label>)}</div><label className="pw-consent"><input type="checkbox" required /><span>Tôi có quyền chia sẻ tư liệu này và đồng ý để ban điều phối liên hệ, rà soát quyền công bố với các bên liên quan.</span></label></fieldset>{error && <p className="pw-error" role="alert">{error} Chưa xác nhận đã lưu.</p>}{receipt && <p className="pw-success" role="status">Đã lưu đề nghị {receipt}. Tư liệu đang chờ rà soát, chưa hiển thị công khai.</p>}<button className="pw-button" type="submit" disabled={sending}>{sending ? 'Đang gửi…' : 'Gửi đề nghị rà soát'}</button></form>}
    <div className="pw-pair-list">{pairs.map((pair, index) => <article key={pair.id || index} className="pw-pair"><div className="pw-pair-number">{String(index + 1).padStart(2, '0')}</div><div><span className="pw-eyebrow">BÊN MUA</span><h4>{pair.buyer}</h4></div><span className="pw-pair-arrow" aria-label="kết nối với">↔</span><div><span className="pw-eyebrow">BÊN CUNG CẤP</span><h4>{pair.supplier}</h4></div><div className="pw-pair-outcome"><strong>{pair.product}</strong><p>{pair.status}</p>{pair.meetingTime && <p>{pair.meetingTime}{pair.table ? ` · ${pair.table}` : ''}</p>}{pair.nextAction && <p>Bước tiếp theo: {pair.nextAction}</p>}</div></article>)}</div>
    {!pairs.length && <div className="pw-empty pw-result-empty"><span>Đang chờ dữ liệu được duyệt</span><p>Khi có kết quả, từng cặp nhà máy–nhà cung ứng sẽ xuất hiện cùng nội dung trao đổi và đầu việc tiếp theo. Không công khai giá chào, liên hệ riêng hoặc tài liệu bảo mật.</p></div>}
    <div className="pw-photo-heading"><h3>Những kết nối được ghi lại.</h3>{photos.length > 0 && <label className="pw-field" htmlFor="pw-photo-filter"><span>Lọc ảnh theo cặp kết nối</span><select id="pw-photo-filter" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">Tất cả hình ảnh ({photos.length})</option>{pairs.filter(pair => pair.id).map(pair => <option key={pair.id} value={pair.id}>{pair.buyer} ↔ {pair.supplier}</option>)}</select></label>}</div>
    {visiblePhotos.length ? <div className="pw-photo-grid">{visiblePhotos.map(photo => <figure key={photo.id}><a href={photo.url} target="_blank" rel="noopener noreferrer" aria-label={`Mở ảnh: ${photo.caption}`}><img src={photo.url} alt={photo.caption} loading="lazy" /></a><figcaption>{photo.caption}</figcaption></figure>)}</div> : <div className="pw-photo-empty"><span>Hình ảnh cuộc gặp · Trưng bày sản phẩm · Tư liệu hợp tác</span><p>{photos.length ? 'Chưa có ảnh cho cặp kết nối này.' : 'Ảnh đã duyệt sẽ được cập nhật tại đây. Có thể gửi liên kết ảnh hoặc album bằng nút “Gửi ảnh và kết quả”.'}</p></div>}
  </section>;
}
