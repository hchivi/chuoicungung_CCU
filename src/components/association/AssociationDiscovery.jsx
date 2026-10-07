import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProgramByIdOrSlug } from '../../data/programsData';
import './AssociationDiscovery.css';

export const ASSOCIATION_SCOPES = [
  { id: 'NATIONAL', label: 'Toàn quốc', tone: 'blue' },
  { id: 'REGIONAL', label: 'Liên vùng', tone: 'mint' },
  { id: 'PROVINCIAL', label: 'Tỉnh / Thành phố', tone: 'rose' },
  { id: 'SPECIALIZED_INDUSTRY', label: 'Chuyên ngành', tone: 'yellow' },
];

export function uniqueAssociations(associations) {
  return [...new Map(associations.map(association => [association.id, association])).values()];
}

export function getAssociationProgramPath(program) {
  const record = getProgramByIdOrSlug(program.programSlug) || getProgramByIdOrSlug(program.programId);
  return record && record.publishable !== false ? `/chuong-trinh/${record.slug || record.id}` : null;
}

function AssociationProgramTitle({ program }) {
  const path = getAssociationProgramPath(program);
  return path ? <Link to={path}>{program.title}</Link> : <p className="ad-card__program-title">{program.title}</p>;
}

export function AssociationDiscoveryCard({ association, onClaim }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const profile = association.profile || {};
  const scope = ASSOCIATION_SCOPES.find(item => item.id === profile.scopeType) || ASSOCIATION_SCOPES[0];
  const programs = association.activePrograms || [];
  const industries = profile.industryScope || association.capabilities || [];
  const isRecordedProfile = profile.id && profile.id !== `ASSOC-PROF-${association.id}`;
  const memberCount = isRecordedProfile ? profile.confirmedMembersCount : null;
  const year = isRecordedProfile ? profile.establishedYear : null;
  const shortName = profile.shortName?.length <= 18 ? profile.shortName : null;
  const detailPath = `/hiep-hoi/${association.id}`;
  const firstProgramPath = programs.length > 0 ? getAssociationProgramPath(programs[0]) : null;
  return <article className="ad-card" data-association-card={association.id} data-card-style="institutional">
    <div className="ad-card__identity">
      <div className="ad-card__identity-top">
        <div className="ad-card__image" data-image-state={imageFailed ? 'error' : imageLoaded ? 'loaded' : 'loading'}>{!imageLoaded && <span aria-hidden="true">{shortName?.slice(0, 2) || association.name.slice(0, 1)}</span>}{association.logo && !imageFailed && <img className={imageLoaded ? 'is-loaded' : ''} src={association.logo} alt="" width="64" height="64" loading="lazy" onLoad={() => setImageLoaded(true)} onError={() => { setImageFailed(true); setImageLoaded(false); }} />}</div>
        <div>{shortName && <p className="ad-card__short-name">{shortName}</p>}<span className="ad-card__scope">{scope.label}</span></div>
      </div>
      <h3><Link to={detailPath}>{association.name}</Link></h3>
      <div className="ad-card__record">{memberCount > 0 && <p><strong>{memberCount.toLocaleString('vi-VN')}</strong><span>hội viên theo hồ sơ</span></p>}{year && <p><strong>{year}</strong><span>Năm thành lập</span></p>}{profile.hasCatalogue && <Link to={detailPath}>Catalogue / kỷ yếu <span aria-hidden="true">↗</span></Link>}</div>
    </div>
    <div className="ad-card__dossier">
      <div className="ad-card__expertise"><p className="ad-card__label">Lĩnh vực kết nối</p><ul>{industries.slice(0, 3).map((industry, index) => <li key={`${industry}-${index}`}>{industry}</li>)}</ul></div>
      <div className="ad-card__location"><p className="ad-card__label">Địa bàn hoạt động</p><p className="ad-card__geography">{profile.geographicScope?.join(', ') || association.province || 'Xem địa bàn trong hồ sơ'}</p></div>
      <details className="ad-card__about"><summary>Tìm hiểu tổ chức <span aria-hidden="true">+</span></summary><p>{profile.scopeDescription || association.description || 'Khám phá thông tin và lĩnh vực hoạt động trong hồ sơ tổ chức.'}</p>{industries.length > 3 && <p><strong>Lĩnh vực khác:</strong> {industries.slice(3).join(' · ')}</p>}</details>
    </div>
    <div className="ad-card__activities">
      <p className="ad-card__label">Chương trình liên kết <span className="ad-card__program-count">{programs.length}</span></p>
      {programs.length > 0 ? <div className="ad-card__program"><AssociationProgramTitle program={programs[0]} /><p className="ad-card__role">{programs[0].roleLabel}</p>{programs[0].dates && <p className="ad-card__date">{programs[0].dates}</p>}{!firstProgramPath && <p className="ad-card__unavailable">Đang cập nhật thông tin chương trình.</p>}{programs.length > 1 && <details><summary>Chương trình khác <span aria-hidden="true">+</span></summary>{programs.slice(1).map(program => <div key={program.programId}><AssociationProgramTitle program={program} /><small>{program.roleLabel}</small>{program.dates && <small>{program.dates}</small>}{!getAssociationProgramPath(program) && <small>Đang cập nhật thông tin chương trình.</small>}</div>)}</details>}</div> : <p className="ad-card__no-program">Chưa có chương trình liên kết được công bố.</p>}
    </div>
    <footer className="ad-card__footer">
      <div className="ad-card__actions"><Link className="ad-button ad-button--primary" to={detailPath}>Xem hồ sơ tổ chức <span aria-hidden="true">↗</span></Link>{firstProgramPath && <Link className="ad-card__program-link" to={firstProgramPath}>Xem chương trình <span aria-hidden="true">↗</span></Link>}</div>
      <button type="button" className="ad-card__claim" onClick={() => onClaim(association)}>Liên kết hồ sơ hội viên <span aria-hidden="true">↗</span></button>
    </footer>
  </article>;
}

export default function AssociationDiscovery({ listingData, sectors, filters, onChange, onQuickFilter, onReset, onClaim }) {
  const associations = useMemo(() => uniqueAssociations(listingData.associations), [listingData.associations]);
  const { search, sector, region, scope, openPrograms, catalogue, sort } = filters;
  const activeCount = [search, sector !== 'all', region !== 'all', scope !== 'all', openPrograms, catalogue].filter(Boolean).length;
  return <div className="ad-discovery">
    <section className="ad-invitation" aria-labelledby="ad-invitation-title"><div className="ad-invitation__copy"><p className="ad-eyebrow">Dành cho Hội, Hiệp hội & Tổ chức</p><h2 id="ad-invitation-title">Cộng đồng vững mạnh.<br /><span>Cơ hội rộng mở.</span></h2><p>Kết nối năng lực hội viên với nhu cầu doanh nghiệp. Cùng xây dựng hoạt động giao thương có trọng tâm cho từng ngành, từng địa bàn.</p><Link className="ad-button ad-button--primary" to="/dich-vu/to-chuc-ket-noi?source=association">Đề xuất hợp tác <span aria-hidden="true">↗</span></Link></div>
      <div className="ad-invitation__paths"><Link className="ad-path ad-tone-blue" to="/chuong-trinh"><div><span>Kết nối giao thương</span><strong>Đưa hội viên đến gần thị trường.</strong></div><span aria-hidden="true">↗</span></Link><Link className="ad-path ad-tone-rose" to="/tao-ho-so?type=association"><div><span>Giới thiệu cộng đồng</span><strong>Để năng lực được nhìn thấy.</strong></div><span aria-hidden="true">↗</span></Link><a className="ad-path ad-tone-yellow" href="#danh-sach-hiep-hoi"><div><span>Tìm tổ chức chuyên môn</span><strong>Bắt đầu từ đúng cộng đồng.</strong></div><span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="danh-sach-hiep-hoi" className="ad-directory" aria-labelledby="ad-directory-title"><div className="ad-directory__head"><div><h2 id="ad-directory-title">Tìm đúng tổ chức.<br />Mở thêm kết nối.</h2></div><p>Tìm hiểu lĩnh vực, địa bàn và hoạt động của từng hội trước khi bắt đầu trao đổi. Tổ chức có mặt trong danh bạ không mặc định là đối tác của nền tảng.</p></div>
      <div className="ad-filter-panel"><div className="ad-filter-panel__primary"><div className="ad-field ad-field--search"><label htmlFor="ad-search">Tên tổ chức, ngành hoặc chương trình</label><div className="ad-search"><input type="search" id="ad-search" value={search} onChange={event => onChange('search', event.target.value)} placeholder="Ví dụ: HAME, logistics, dệt may…" />{search && <button type="button" aria-label="Xóa từ khóa tìm kiếm" onClick={() => onChange('search', '')}>×</button>}</div></div><div className="ad-field"><label htmlFor="ad-scope">Phạm vi hoạt động</label><select id="ad-scope" value={scope} onChange={event => onChange('scope', event.target.value)}><option value="all">Tất cả phạm vi</option>{ASSOCIATION_SCOPES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div><div className="ad-field"><label htmlFor="ad-region">Địa bàn</label><input id="ad-region" value={region === 'all' ? '' : region} onChange={event => onChange('region', event.target.value || 'all')} placeholder="Tỉnh, thành hoặc vùng" /></div></div>
        <div className="ad-sectors" role="group" aria-label="Lĩnh vực hoạt động">{sectors.map(item => <button key={item.id} type="button" data-sector={item.id} aria-pressed={sector === item.id} onClick={() => onChange('sector', item.id)}>{item.label}</button>)}</div>
        <div className="ad-sector-select ad-field"><label htmlFor="ad-sector">Lĩnh vực hoạt động</label><select id="ad-sector" value={sector} onChange={event => onChange('sector', event.target.value)}>{sectors.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
        <div className="ad-filter-panel__secondary"><div className="ad-checks"><label><input type="checkbox" checked={openPrograms} onChange={event => onChange('openPrograms', event.target.checked)} />Có chương trình liên kết</label><label><input type="checkbox" checked={catalogue} onChange={event => onChange('catalogue', event.target.checked)} />Có catalogue / kỷ yếu</label></div><div className="ad-sort"><label htmlFor="ad-sort">Sắp xếp</label><select id="ad-sort" value={sort} onChange={event => onChange('sort', event.target.value)}><option value="default">Gợi ý</option><option value="programs">Nhiều chương trình</option><option value="members">Quy mô theo hồ sơ</option><option value="az">Tên A–Z</option></select><button type="button" className="ad-reset" onClick={onReset}>Đặt lại{activeCount > 0 ? ` (${activeCount})` : ''}</button></div></div>
      </div>
      <div className="ad-quick"><span>Khám phá nhanh</span><button type="button" data-quick="mechanical" onClick={() => onQuickFilter({ sector: 'cơ khí' })}>Hội ngành cơ khí <span aria-hidden="true">↗</span></button><button type="button" data-quick="dongnai" onClick={() => onQuickFilter({ region: 'Đồng Nai' })}>Hội tại Đồng Nai <span aria-hidden="true">↗</span></button><button type="button" data-quick="programs" onClick={() => onQuickFilter({ openPrograms: true })}>Có chương trình liên kết <span aria-hidden="true">↗</span></button></div>
      <div className="ad-results"><p role="status" aria-live="polite"><strong>{associations.length}</strong> tổ chức phù hợp</p><Link className="ad-text-link" to="/tao-ho-so?type=association">Giới thiệu tổ chức <span aria-hidden="true">↗</span></Link></div>
      {associations.length > 0 ? <div className="ad-grid">{associations.map(association => <AssociationDiscoveryCard key={association.id} association={association} onClaim={onClaim} />)}</div> : <div className="ad-empty"><h3>Chưa tìm thấy tổ chức phù hợp.</h3><p>Thử tên viết tắt, đổi ngành hoặc mở rộng địa bàn tìm kiếm.</p><div><button type="button" className="ad-button" onClick={onReset}>Xóa bộ lọc</button><Link className="ad-button ad-button--primary" to="/dich-vu/to-chuc-ket-noi?source=association">Đề xuất hợp tác <span aria-hidden="true">↗</span></Link></div></div>}
    </section>
  </div>;
}
