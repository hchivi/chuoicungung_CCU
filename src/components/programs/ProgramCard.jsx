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
    <div className="pd-card-top">
      <span className="pd-status"><StatusIcon size={14} aria-hidden="true" />{state.label}</span>
      {program.isSponsored ? <span className="pd-sponsored">Được tài trợ</span> : <span className="pd-code">{program.publicCode || 'CCU-PRG'}</span>}
    </div>
    <Link className="pd-card-photo" to={detailUrl} aria-label={`Xem chương trình ${program.title || program.name}`}>
      <img src={program.image || '/images/supply_chain_expo_hero.jpg'} alt={program.title || program.name} width="720" height="405" loading="lazy" onError={event => { event.currentTarget.hidden = true; }} />
      <ImageOff size={28} aria-hidden="true" />
    </Link>
    <div className="pd-card-content">
      <div className="pd-irace-row">
        <div className="pd-date" aria-label={program.date}>
          {dateParts ? <>
            <strong className="pd-date-day">{dateParts[1]}</strong>
            <span className="pd-date-month">THÁNG {dateParts[2]}</span>
            <small className="pd-date-year">{dateParts[3]}</small>
          </> : <div className="pd-date-fallback">
            <strong className="pd-date-day pd-date-special">{program.status === 'huy' ? 'HỦY' : program.status === 'hoan' ? 'HOÃN' : 'CCU'}</strong>
            <span className="pd-date-month">{program.date || 'Chưa công bố'}</span>
            <small className="pd-date-year">{program.publicCode ? program.publicCode.slice(4, 8) : '2026'}</small>
          </div>}
        </div>
        <div className="pd-irace-main">
          <h3 className="pd-card-title"><Link to={detailUrl}>{program.title || program.name}</Link></h3>
          <p className="pd-description">{program.shortDescription || program.description}</p>
        </div>
      </div>
      <div className="pd-card-kind">
        <CalendarClock size={14} aria-hidden="true" />
        <span className="pd-kind-name">{program.typeName}</span>
        <span className="pd-kind-sep">•</span>
        <small className="pd-kind-format">{program.formatName || 'Trực tiếp'}</small>
        {program.time && <>
          <span className="pd-kind-sep">•</span>
          <time className="pd-kind-time">{program.time}</time>
        </>}
      </div>
      {(roleMatches || locationMatches) && <p className="pd-relevance"><CheckCircle2 size={15} aria-hidden="true" />{[roleMatches && `Phù hợp vai trò: ${userRole}`, locationMatches && `Tại địa bàn: ${userLocation}`].filter(Boolean).join('. ')}</p>}
      {!!program.needGroup?.length && <section className="pd-needs" aria-label="Nhu cầu kết nối trọng tâm"><h4>Nhu cầu kết nối trọng tâm</h4><ul>{program.needGroup.map((need, index) => <li key={index}><ArrowUpRight size={14} aria-hidden="true" />{need}</li>)}</ul></section>}
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
