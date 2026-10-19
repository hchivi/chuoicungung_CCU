import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { FEATURED_PAGE_SIZE, featuredParticipants, featuredParticipantPage } from '../../pages/thaiHoaEventLandingModel.js';
import './ThaiHoaConfirmedParticipants.css';

export function ParticipantDialog({ item, open, onClose, onRequestMeeting }) {
  const dialogRef = useRef(null);
  const buyer = item.role === 'buyer';
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialogRef} className="th-company-dialog" aria-modal="true" aria-labelledby="th-company-dialog-title" onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll('button:not(:disabled),a[href]')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  }} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <header><span>{buyer ? 'NHÀ MÁY / BUYER' : 'NHÀ CUNG ỨNG / SUPPLIER'}</span><button type="button" autoFocus aria-label="Đóng chi tiết doanh nghiệp" onClick={onClose}><X size={20} /></button></header>
    <div className="th-company-dialog-identity">{item.logo ? <img src={item.logo} alt={`Logo ${item.name}`} /> : null}<h2 id="th-company-dialog-title">{item.name}</h2></div>
    <dl><div><dt>Lĩnh vực</dt><dd>{item.industry || 'Đang cập nhật'}</dd></div><div><dt>{buyer ? 'Nhu cầu & mục tiêu kết nối' : 'Năng lực & mục tiêu kết nối'}</dt><dd>{item.summary || item.productsServices?.join(', ') || 'Đang cập nhật'}</dd></div></dl>
    <div className="th-company-dialog-actions">{item.profilePath && <Link to={item.profilePath} onClick={onClose}>Xem hồ sơ <ArrowUpRight size={16} /></Link>}<button type="button" disabled={!open} onClick={() => { onClose(); onRequestMeeting?.({ role: buyer ? 'supplier' : 'buyer', name: item.name }); }}>Đề nghị gặp <ArrowRight size={16} /></button></div>
    {!open && <p className="th-company-dialog-note">Chương trình đã đóng đăng ký gặp. Thông tin doanh nghiệp vẫn có thể xem.</p>}
  </dialog>;
}

export function FeaturedGroup({ role, items, expanded, onShowDetail }) {
  const [page, setPage] = useState(0);
  const buyer = role === 'buyer';
  const { current, lastPage, shown } = featuredParticipantPage(items, page, expanded);
  const noun = buyer ? 'nhà máy' : 'nhà cung ứng';
  return <section className={`th-confirmed-group is-${role}`} aria-labelledby={`th-featured-${role}`}>
    <header><h3 id={`th-featured-${role}`}>{buyer ? 'Nhà máy / Buyer nổi bật' : 'Nhà cung ứng / Supplier nổi bật'}</h3><span>{items.length ? `${items.length} doanh nghiệp` : 'Chờ công bố'}</span></header>
    {items.length ? <><div className="th-confirmed-cards" aria-live="polite">{shown.map(item => <article key={item.id}>
      <div className="th-confirmed-company">{item.logo ? <img src={item.logo} alt={`Logo ${item.name}`} loading="lazy" /> : null}<div><h4><button type="button" aria-haspopup="dialog" title={item.name} onClick={() => onShowDetail(item)}>{item.name}</button></h4><p title={item.industry}>{item.industry || 'Doanh nghiệp tham gia'}</p></div></div>
      <button type="button" className="th-confirmed-detail-trigger" aria-haspopup="dialog" aria-label={`Chi tiết ${item.name}`} onClick={() => onShowDetail(item)}>Chi tiết <ArrowUpRight size={14} aria-hidden="true" /></button>
    </article>)}</div>{!expanded && lastPage > 0 && <nav className="th-confirmed-paging" aria-label={`Chuyển nhóm ${noun}`}><button type="button" aria-label={`Nhóm ${noun} trước`} disabled={current === 0} onClick={() => setPage(current - 1)}><ArrowLeft size={17} /></button><span>{current + 1} / {lastPage + 1}</span><button type="button" aria-label={`Nhóm ${noun} tiếp theo`} disabled={current === lastPage} onClick={() => setPage(current + 1)}><ArrowRight size={17} /></button></nav>}</> : <div className="th-confirmed-empty"><div><strong>Chưa có danh sách {noun} được công bố</strong><p>Logo, lĩnh vực và {buyer ? 'nhu cầu mua' : 'năng lực cung ứng'} sẽ hiển thị sau khi hồ sơ được xác nhận và duyệt công khai.</p></div></div>}
  </section>;
}

export default function ThaiHoaConfirmedParticipants({ participants = [], open = false, onRequestMeeting }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const groups = ['buyer', 'supplier'].map(role => ({ role, items: featuredParticipants(participants, role) }));
  const hasMore = groups.some(group => group.items.length > FEATURED_PAGE_SIZE);
  return <section className="th-confirmed" id="doanh-nghiep" aria-labelledby="th-confirmed-title">
    <div className="th-confirmed-heading"><h2 id="th-confirmed-title">Những doanh nghiệp tiêu biểu đã xác nhận tham gia</h2><button type="button" disabled={!hasMore} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Thu gọn' : 'Xem tất cả'}<ArrowRight size={16} /></button></div>
    <div className="th-confirmed-columns">{groups.map(group => <FeaturedGroup key={group.role} {...group} expanded={expanded} onShowDetail={setSelected} />)}</div>
    {selected && <ParticipantDialog item={selected} open={open} onClose={() => setSelected(null)} onRequestMeeting={onRequestMeeting} />}
  </section>;
}
