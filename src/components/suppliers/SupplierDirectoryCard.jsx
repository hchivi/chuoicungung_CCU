import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ImageOff, LockKeyhole, MapPin, MessageCircle, Phone, Mail, Globe, Plus, Send, Tag } from 'lucide-react';
import { slugify } from '../../pages/IndustryCategoryPage';
import { getSupplierPhases } from './supplierDirectoryModel';

export default function SupplierDirectoryCard({ supplier, phases, selectedPhase, images, avatar, maskedPhone, detailUrl, onQuote, onAdd, requirement, added, viewMode }) {
  const supplierPhases = getSupplierPhases(supplier, phases, selectedPhase);
  const keywords = [...new Set([...(Array.isArray(supplier.products) ? supplier.products : []), ...(Array.isArray(supplier.productGroups) ? supplier.productGroups.flatMap(group => group.items || []) : []), ...(Array.isArray(supplier.keywords) ? supplier.keywords : []), supplier.category, supplier.industry].filter(value => typeof value === 'string' && value))].slice(0, 3);
  return <article className="sd-supplier-card" data-supplier-card data-view={viewMode} data-stage={supplierPhases[0]?.stage || 0}>
    <header className="sd-capability-head">
      <div className="sd-capability-line"><span>{supplier.category || supplier.industry || 'Chưa cập nhật ngành nghề'}</span><span className="sd-card-location"><MapPin size={14} aria-hidden="true" />{supplier.province || 'Toàn quốc'}</span></div>
      <div className="sd-company-heading">{avatar && <img className="sd-company-avatar" src={avatar} alt="" loading="lazy" referrerPolicy="no-referrer" onError={event => { event.currentTarget.hidden = true; }} />}<h3><Link to={detailUrl}>{supplier.name}</Link></h3></div>
    </header>
    <div className="sd-card-gallery" aria-label={`Hình ảnh ${supplier.name}`}>
      {images.map((src, index) => <Link to={detailUrl} key={index} aria-label={`Xem hình ảnh và hồ sơ ${supplier.name}`} className="sd-card-photo"><img src={src} alt={`Hình ảnh ${index + 1} trong hồ sơ ${supplier.name}`} loading="lazy" referrerPolicy="no-referrer" onError={event => { event.currentTarget.hidden = true; }} /><ImageOff size={22} aria-hidden="true" /></Link>)}
      {images.length === 0 && <div className="sd-photo-empty"><ImageOff size={24} /><span>Chưa có hình ảnh</span></div>}
    </div>
    <div className="sd-card-body">
      <div className="sd-card-phases"><span className="sd-field-label">Pha cung ứng</span>{supplierPhases.length ? supplierPhases.map(phase => <Link data-supplier-phase={phase.id} data-stage={phase.stage} key={phase.id} to={`/giai-doan-cung-ung/pha/${phase.id}`} title={phase.title}><b>Pha {phase.id}</b><span>{phase.title.replace(/^\d\.\d\s*/, '')}</span></Link>) : <p>Chưa phân loại pha</p>}</div>
      {(supplier.moq || supplier.leadTime) && <dl className="sd-card-specs">{supplier.moq && <div><dt>MOQ</dt><dd>{supplier.moq}</dd></div>}{supplier.leadTime && <div><dt>Thời gian giao</dt><dd>{supplier.leadTime}</dd></div>}</dl>}
      {supplier.needsConfirmation && <p className="sd-confirmation"><strong>Cần xác nhận: </strong>{supplier.needsConfirmation}</p>}
      {keywords.length > 0 && <details className="sd-card-keywords"><summary><Tag size={15} aria-hidden="true" /><span>Từ khoá chuyên môn</span><b>{keywords.length}</b></summary><div aria-label="Từ khoá nhà cung ứng">{keywords.map(keyword => <Link key={keyword} to={`/tu-khoa/${slugify(keyword)}?q=${encodeURIComponent(keyword)}`} title={keyword}><span>{keyword}</span><ArrowRight size={13} aria-hidden="true" /></Link>)}</div></details>}
    </div>
    <div className="sd-card-bottom">
      <div className="sd-contact-row"><div><span className="sd-contact-label"><LockKeyhole size={14} aria-hidden="true" />Liên hệ được ẩn</span>{maskedPhone && <span className="sd-masked-phone">{maskedPhone}</span>}</div><div className="sd-contact-actions">{[[Phone, 'Yêu cầu kết nối điện thoại'], [MessageCircle, 'Yêu cầu kết nối tin nhắn'], [Mail, 'Yêu cầu kết nối email'], [Globe, 'Yêu cầu thông tin website']].map(([Icon, label]) => <button key={label} aria-label={label} title={label} onClick={() => onQuote(supplier)}><Icon size={16} aria-hidden="true" /></button>)}</div></div>
      {requirement && <button className="sd-button sd-button-outline sd-add-requirement" disabled={added} onClick={() => onAdd(supplier)}>{added ? <Check size={16} /> : <Plus size={16} />}{added ? 'Đã thêm vào nhu cầu' : `Thêm vào nhu cầu #${requirement.id}`}</button>}
      <div className="sd-card-cta"><button className="sd-button sd-button-primary" onClick={() => onQuote(supplier)}><Send size={15} aria-hidden="true" />Mô tả nhu cầu</button><Link className="sd-button sd-button-outline" to={detailUrl}>Xem hồ sơ<ArrowRight size={16} aria-hidden="true" /></Link></div>
    </div>
  </article>;
}
