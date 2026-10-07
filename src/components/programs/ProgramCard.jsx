import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Building2, CalendarClock, CheckCircle2, CircleHelp, ImageOff, MapPin, PauseCircle, Users, XCircle } from 'lucide-react';
import { getProgramCardState } from './programCardModel';
import './ProgramDiscovery.css';

export default function ProgramCard({ program, userRole = 'ALL', userLocation = '', onOpenInterestModal, onOpenRecapModal }) {
  if (!program) return null;
  const state = getProgramCardState(program);
  const StatusIcon = { open: CheckCircle2, upcoming: CalendarClock, discovery: CircleHelp, closed: PauseCircle, completed: CheckCircle2, postponed: CalendarClock, cancelled: XCircle }[state.tone];
  const detailUrl = `/chuong-trinh/${program.slug || program.id}`;
  const dateParts = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(program.date || '');
  const roleMatches = userRole && userRole.toLowerCase() !== 'all' && program.targetRoles?.some(role => role.toLowerCase() === userRole.toLowerCase());
  const locationMatches = userLocation && program.location?.toLowerCase().includes(userLocation.toLowerCase());
  return <article className="pd-card" data-program-card data-status={state.tone}>
    <div className="pd-card-top"><span className="pd-status"><StatusIcon size={14} aria-hidden="true" />{state.label}</span>{program.isSponsored ? <span className="pd-sponsored">Được tài trợ</span> : <span className="pd-code">{program.publicCode || 'CCU-PRG'}</span>}</div>
    <Link className="pd-card-photo" to={detailUrl} aria-label={`Xem chương trình ${program.title || program.name}`}>
      <img src={program.image || '/images/supply_chain_expo_hero.jpg'} alt={program.title || program.name} width="720" height="405" loading="lazy" onError={event => { event.currentTarget.hidden = true; }} />
      <ImageOff size={28} aria-hidden="true" />
    </Link>
    <div className="pd-card-content">
      <div className="pd-card-intro">
        <div className="pd-date" aria-label={program.date}>{dateParts ? <><strong>{dateParts[1]}</strong><span>THÁNG {dateParts[2]}</span><small>{dateParts[3]}</small></> : <strong className="pd-date-text">{program.date || 'Chưa công bố lịch'}</strong>}</div>
        <div className="pd-card-kind"><span>{program.typeName}</span><small>{program.formatName || 'Trực tiếp'}</small><time>{program.time}</time></div>
      </div>
      <h3><Link to={detailUrl}>{program.title || program.name}</Link></h3>
      <p className="pd-description">{program.shortDescription || program.description}</p>
      {(roleMatches || locationMatches) && <p className="pd-relevance"><CheckCircle2 size={15} aria-hidden="true" />{[roleMatches && `Phù hợp vai trò: ${userRole}`, locationMatches && `Tại địa bàn: ${userLocation}`].filter(Boolean).join('. ')}</p>}
      {!!program.needGroup?.length && <section className="pd-needs" aria-label="Nhu cầu kết nối trọng tâm"><h4>Nhu cầu kết nối trọng tâm</h4><ul>{program.needGroup.map((need, index) => <li key={index}><ArrowUpRight size={15} aria-hidden="true" />{need}</li>)}</ul></section>}
      <div className="pd-logistics">
        <p><MapPin size={16} aria-hidden="true" /><span>{program.location}{program.kcn && <strong> (KCN {program.kcn})</strong>}</span></p>
        <p><Building2 size={16} aria-hidden="true" /><span><small>Đơn vị chủ trì</small>{program.organizer}</span></p>
      </div>
    </div>
    <footer className="pd-card-footer">
      {(program.factoriesCount != null || program.suppliersCount != null) && <div className="pd-attendance" aria-label="Quy mô theo thông tin chương trình">
        {program.factoriesCount != null && <div><strong>{program.factoriesCount}</strong><span>Nhà máy / người mua</span></div>}
        {program.suppliersCount != null && <div><strong>{program.suppliersCount}</strong><span>Nhà cung ứng</span></div>}
        <Users size={22} aria-hidden="true" />
      </div>}
      <div className="pd-card-actions">
        {state.action === 'interest' ? <button className="pd-primary" onClick={() => onOpenInterestModal?.(program)}>{state.cta}<ArrowRight size={16} aria-hidden="true" /></button>
          : state.action === 'recap' ? <><Link className="pd-secondary" to={detailUrl}>Kỷ yếu chi tiết</Link><button className="pd-primary" onClick={() => onOpenRecapModal?.(program)}>Xem kết quả<ArrowRight size={16} aria-hidden="true" /></button></>
          : <Link className="pd-primary" to={detailUrl}>{state.cta}<ArrowRight size={16} aria-hidden="true" /></Link>}
      </div>
    </footer>
  </article>;
}
