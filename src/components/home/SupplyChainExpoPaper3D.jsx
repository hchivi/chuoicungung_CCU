import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Factory, Handshake, Building2, Check, ImageOff } from 'lucide-react';
import { EXPO_HOME_ROLES, resolveExpoRole } from './expoHomepageContent';
import './ExpoHomepage.css';

const ROLE_ICONS = { buyer: Factory, supplier: Handshake, organizer: Building2 };

// Keep the existing component entry point and #chuong-trinh section in HomePage.
// Readable HTML replaces the texture-based pass; no WebGL or continuous render loop.
export default function SupplyChainExpoPaper3D({ preview = false } = {}) {
  const [roleId, setRoleId] = useState('buyer');
  const [photoFailed, setPhotoFailed] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const role = resolveExpoRole(roleId);

  return (
    <section className="expo-home" data-expo-home data-expo-invitation aria-labelledby="expo-home-title">
      <div className="expo-home-shell" data-expo-invitation-ticket>
        <p className="expo-home-salutation">Trân trọng mời doanh nghiệp</p>
        <header className="expo-home-masthead">
          <div className="expo-home-title-group">
            <p className="expo-home-kicker">
              <img src="/logo_onlyc.png" alt="" width="38" height="38" loading="lazy" />
              Sourcing Day &amp; B2B
            </p>
            <h2 id="expo-home-title">
              <span className="text-gradient-flow-green block">NGÀY HỘI</span>
              <span className="text-gradient-flow-green block">CHUỖI CUNG ỨNG</span>
            </h2>
          </div>
          <div className="expo-home-invite-copy">
            <p className="expo-home-intro">Một cuộc gặp trực tiếp để xem mẫu, làm rõ nhu cầu và trao đổi khả năng hợp tác.</p>
            <Link className="expo-home-link expo-home-program" data-expo-program-link to="/chuong-trinh" target={preview ? '_blank' : undefined} rel={preview ? 'noopener' : undefined}>
              Xem chương trình<span className="expo-home-arrow-disc"><ArrowUpRight size={24} aria-hidden="true" /></span>
            </Link>
          </div>
        </header>
        <div className="expo-home-stage">
          <figure className="expo-home-media" data-photo-state={photoFailed ? 'error' : photoLoaded ? 'success' : 'loading'} aria-busy={!photoFailed && !photoLoaded}>
            {!photoFailed && !photoLoaded && <span className="expo-home-photo-loading" role="status">Đang tải hình ảnh…</span>}
            {photoFailed ? <div className="expo-home-photo-fallback" role="status">
              <ImageOff size={32} aria-hidden="true" />
              <p>Ảnh chưa tải được. Bạn vẫn có thể xem chương trình và chọn hình thức tham gia bên dưới.</p>
            </div> : <img data-expo-photo
              src="/images/services/sourcing-meeting-home-v1.jpg"
              srcSet="/images/services/sourcing-meeting-home-v1-960.jpg 960w, /images/services/sourcing-meeting-home-v1.jpg 1264w"
              sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1328px) calc(100vw - 112px), 1216px"
              width="1264" height="848" loading="lazy" decoding="async"
              alt="Doanh nghiệp trao đổi nhu cầu và xem mẫu sản phẩm tại bàn kết nối B2B"
              onLoad={() => setPhotoLoaded(true)} onError={() => setPhotoFailed(true)} />}
          </figure>
          <div className="expo-home-stage-caption"><span>Nhu cầu nhà máy</span><ArrowRight size={20} aria-hidden="true" /><span>Năng lực nhà cung ứng</span></div>
        </div>
        <div className="expo-home-invitation-bottom">
          <div className="expo-home-role-bar">
            <p>Vị trí của bạn tại ngày hội?</p>
            <div className="expo-home-role-choices" role="group" aria-label="Chọn vai trò tham gia">
              {EXPO_HOME_ROLES.map(item => {
                const Icon = ROLE_ICONS[item.id];
                return <button key={item.id} type="button" data-expo-role={item.id}
                  id={'expo-home-role-' + item.id}
                  aria-label={item.label} aria-pressed={roleId === item.id} aria-controls="expo-home-role-panel"
                  onClick={() => setRoleId(item.id)}>
                  <Icon size={18} aria-hidden="true" /><span className="expo-home-role-label">{item.label}</span>{item.shortLabel && <span className="expo-home-role-short" aria-hidden="true">{item.shortLabel}</span>}<Check className="expo-home-role-check" size={16} aria-hidden="true" />
                </button>;
              })}
            </div>
          </div>
          <div id="expo-home-role-panel" className="expo-home-role-panel"
            role="region" aria-labelledby={'expo-home-role-' + role.id}>
            <div aria-live="polite" aria-atomic="true"><div className="expo-home-role-story" key={role.id}>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <ul className="expo-home-benefits">{role.benefits.map(benefit =>
                <li key={benefit}><Check size={16} aria-hidden="true" />{benefit}</li>)}
              </ul>
            </div>
            </div>
            <Link data-expo-role-link className="expo-home-link expo-home-primary" to={role.href} target={preview ? '_blank' : undefined} rel={preview ? 'noopener' : undefined}>
              {role.action}<ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
