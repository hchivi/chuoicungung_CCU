import React, { useEffect, useRef, useState } from 'react';
import { OPTIONS, LIVE_ORIGIN, previewAssociations, associationView } from './model.js';

const Arrow = () => <span aria-hidden="true">↗</span>;
const External = ({ href, children, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;

function IdentityImage({ organization, state = 'default' }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const error = failed || state === 'error';
  return <div className="ac-image" data-image-state={error ? 'error' : loaded ? 'loaded' : organization.logo ? 'loading' : 'initial'}>
    {(!loaded || error) && <span aria-hidden="true">{organization.shortName?.slice(0, 2) || organization.name.slice(0, 1)}</span>}
    {organization.logo && !error && <img src={organization.logo} alt="" width="64" height="64" loading="lazy" className={loaded ? 'is-loaded' : ''} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
  </div>;
}

function Facts({ organization }) {
  return <dl className="ac-facts">
    {organization.members && <div><dt>Hội viên theo hồ sơ</dt><dd>{organization.members.toLocaleString('vi-VN')}</dd></div>}
    {organization.year && <div><dt>Năm thành lập</dt><dd>{organization.year}</dd></div>}
  </dl>;
}

function Expertise({ organization }) {
  return <div className="ac-expertise"><h4>Lĩnh vực kết nối</h4><ul>{organization.industries.map((industry, i) => <li key={`${industry}-${i}`}>{industry}</li>)}</ul></div>;
}

function Program({ program }) {
  return <div className="ac-program">
    {program.href ? <External href={program.href} className="ac-program__title">{program.title}</External> : <p className="ac-program__title">{program.title}</p>}
    <p className="ac-program__role">{program.roleLabel}</p>
    {program.dates && <p className="ac-program__date">{program.dates}</p>}
    {!program.href && <p className="ac-program__pending">Đang cập nhật thông tin chương trình.</p>}
  </div>;
}

function Programs({ organization }) {
  const [first, ...rest] = organization.programs;
  return <div className="ac-programs"><h4>Chương trình liên kết <span>{organization.programs.length}</span></h4>
    {first ? <><Program program={first} />{rest.length > 0 && <details className="ac-more-programs"><summary>Chương trình khác <span aria-hidden="true">+</span></summary>{rest.map(program => <Program key={program.programId} program={program} />)}</details>}</> : <p className="ac-muted">Chưa có chương trình liên kết được công bố.</p>}
  </div>;
}

function About({ organization }) {
  return <details className="ac-about"><summary>Tìm hiểu tổ chức <span aria-hidden="true">+</span></summary><p>{organization.description || 'Xem thông tin hoạt động trong hồ sơ tổ chức.'}</p></details>;
}

function Geography({ organization }) {
  return <div className="ac-geography"><h4>Địa bàn hoạt động</h4><p>{organization.geography}</p></div>;
}

function Actions({ organization, onClaim, state }) {
  const disabled = state === 'disabled' || state === 'loading';
  return <div className="ac-actions">
    {disabled ? <button className="ac-button" disabled aria-busy={state === 'loading'}>{state === 'loading' ? 'Đang mở hồ sơ…' : 'Xem hồ sơ'} <Arrow /></button> : <External className="ac-button" href={organization.profileUrl}>Xem hồ sơ <Arrow /></External>}
    <button className="ac-claim ac-text-button" disabled={disabled} onClick={() => onClaim(organization)}>Liên kết hội viên <Arrow /></button>
  </div>;
}

function Catalogue({ organization }) {
  return organization.hasCatalogue && <External className="ac-catalogue ac-text-link" href={organization.profileUrl}>Catalogue / kỷ yếu <Arrow /></External>;
}

export function AssociationOptionCard({ association, variant, onClaim, state = 'default' }) {
  const organization = associationView(association);
  const identity = <div className="ac-identity"><IdentityImage organization={organization} state={state} /><div><p className="ac-short-name">{organization.shortName}</p><p className="ac-scope">{organization.scope}</p></div></div>;
  return <article className={`ac-card ac-card--${variant}`} data-organization={organization.id} data-demo-state={state}>
    {variant === 'publication' && <>
      <header className="ac-publication__cover">{identity}{organization.shortName && <p className="ac-publication__wordmark" aria-hidden="true">{organization.shortName}</p>}<h3>{organization.name}</h3><p className="ac-publication__geography">{organization.geography}</p></header>
      <div className="ac-publication__body"><Facts organization={organization} /><Expertise organization={organization} /><About organization={organization} /><Programs organization={organization} /><Catalogue organization={organization} /></div>
      <footer><Actions organization={organization} onClaim={onClaim} state={state} /></footer>
    </>}
    {variant === 'folio' && <>
      <div className="ac-folio__identity">{identity}<h3>{organization.name}</h3><p className="ac-description">{organization.description}</p><Facts organization={organization} /><Catalogue organization={organization} /></div>
      <div className="ac-folio__connections"><Expertise organization={organization} /><Geography organization={organization} /><Programs organization={organization} /></div>
      <footer><Actions organization={organization} onClaim={onClaim} state={state} /></footer>
    </>}
    {variant === 'signature' && <>
      <div className="ac-signature__front">{identity}<h3>{organization.name}</h3><p className="ac-signature__industry">{organization.industries[0] || organization.scope}</p><Facts organization={organization} /><p className="ac-signature__geography">{organization.geography}</p></div>
      <details className="ac-signature__details"><summary><span>Xem kết nối ({organization.programs.length})</span><span aria-hidden="true">+</span></summary><div className="ac-signature__expanded"><Expertise organization={organization} /><About organization={organization} /><Programs organization={organization} /><Catalogue organization={organization} /></div></details>
      <footer><Actions organization={organization} onClaim={onClaim} state={state} /></footer>
    </>}
    {state === 'error' && <p className="ac-state-message" role="status">Ảnh chưa tải được. Thông tin hồ sơ vẫn hiển thị.</p>}
    {state === 'success' && <p className="ac-state-message" role="status">Trạng thái hoàn tất — minh họa trong bản xem thử.</p>}
  </article>;
}

function PreviewDialog({ organization, onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog className="ac-dialog" ref={ref} onClose={onClose} aria-labelledby="ac-dialog-title">
    <h2 id="ac-dialog-title">Liên kết hồ sơ hội viên</h2>
    <p>{organization.name}</p><p>Đây là bản xem thử thiết kế. Để gửi đề nghị liên kết, mở trang Hội & Hiệp hội và dùng chức năng hiện có.</p>
    <div><External href={`${LIVE_ORIGIN}/hiep-hoi#danh-sach-hiep-hoi`} className="ac-button">Mở trang hiện tại <Arrow /></External><button className="ac-text-button" onClick={() => ref.current.close()}>Đóng</button></div>
  </dialog>;
}

function DemoStates({ variant, onClaim }) {
  const states = [['default', 'Mặc định'], ['hover', 'Rê chuột'], ['focus', 'Bàn phím'], ['active', 'Đang nhấn'], ['disabled', 'Vô hiệu hóa'], ['loading', 'Đang mở'], ['error', 'Ảnh lỗi'], ['success', 'Đã mở']];
  return <details className="ac-state-lab"><summary>Kiểm tra trạng thái tương tác <span aria-hidden="true">+</span></summary><div className="ac-state-grid">{states.map(([state, label]) => <section key={state}><h2>{label}</h2><AssociationOptionCard association={previewAssociations[0]} variant={variant} state={state} onClaim={onClaim} /></section>)}</div></details>;
}

export default function Preview() {
  const resolveOption = () => OPTIONS.find(option => option.id === new URLSearchParams(location.search).get('option')) || OPTIONS[0];
  const [option, setOption] = useState(resolveOption);
  const [selected, setSelected] = useState(null);
  const [claim, setClaim] = useState(null);
  useEffect(() => { const onHistory = () => setOption(resolveOption()); addEventListener('popstate', onHistory); return () => removeEventListener('popstate', onHistory); }, []);
  const changeOption = (event, next) => { event.preventDefault(); history.pushState({}, '', `?option=${next.id}`); setOption(next); };
  return <div className="ac-preview">
    <header className="ac-preview__bar"><a href="#options" className="ac-preview__brand">Hội & Hiệp hội <span>CCU Design Review</span></a><External href={`${LIVE_ORIGIN}/hiep-hoi#danh-sach-hiep-hoi`}>Xem trang hiện tại <Arrow /></External></header>
    <main>
      <div className="ac-preview__intro" id="options"><h1>Chọn một dấu ấn riêng.</h1><p>Ba thiết kế thẻ cho Hội, Hiệp hội & Tổ chức. Cùng dữ liệu, ba cách tiếp cận.</p></div>
      <nav className="ac-options" aria-label="Chọn phương án thiết kế">{OPTIONS.map(item => <a key={item.id} href={`?option=${item.id}`} aria-current={option.id === item.id ? 'page' : undefined} onClick={event => changeOption(event, item)}><span className="ac-option-letter">{item.letter}</span><span>{item.title}</span><Arrow /></a>)}</nav>
      <section className="ac-option-heading" aria-labelledby="ac-option-title"><div><h2 id="ac-option-title">{option.title}</h2><p>{option.description}</p></div><button className="ac-select" onClick={() => setSelected(option.id)}>Chọn phương án {option.letter} <Arrow /></button></section>
      <p className="ac-selection" role="status" aria-live="polite">{selected ? `Đã đánh dấu phương án ${OPTIONS.find(item => item.id === selected).letter} trong bản xem thử. Trang chính chưa thay đổi.` : 'Chỉ là bản xem thử. Trang chính chưa thay đổi.'}</p>
      <div className={`ac-gallery ac-gallery--${option.id}`} key={option.id}>{previewAssociations.map(association => <AssociationOptionCard key={association.id} association={association} variant={option.id} onClaim={setClaim} />)}</div>
      <aside className="ac-rationale"><h2>Khi nào nên chọn mẫu này?</h2><p>{option.rationale}</p><p>Dữ liệu và hình ảnh được dùng lại từ trang hiện tại, không phải bằng chứng bảo trợ hay xác nhận quan hệ hợp tác.</p></aside>
      <DemoStates key={`states-${option.id}`} variant={option.id} onClaim={setClaim} />
    </main>
    {claim && <PreviewDialog organization={claim} onClose={() => setClaim(null)} />}
  </div>;
}
