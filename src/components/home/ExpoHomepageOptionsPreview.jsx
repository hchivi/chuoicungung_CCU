// Local design-review entry. Not imported by the production App or HomePage.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ArrowUpRight, Check, Factory, Handshake, Building2, ImageOff } from 'lucide-react';
import SupplyChainExpoPaper3D from './SupplyChainExpoPaper3D';
import { EXPO_HOME_ROLES, resolveExpoRole } from './expoHomepageContent';
import '../../index.css';
import './ExpoHomepageOptionsPreview.css';

const icons = { buyer: Factory, supplier: Handshake, organizer: Building2 };
const options = [
  { id: 'invitation', name: 'A · Thiệp mời triển lãm', detail: 'Đã chọn cho trang chủ: khung thiệp trắng ngà, tên sự kiện lớn, ảnh ngang và đường xé vé. Không còn ghi chú vàng trên ảnh.' },
  { id: 'table', name: 'B · Bàn gặp gỡ B2B', detail: 'Chọn vị trí quanh bàn mẫu. Trực quan nhất: thấy ngay nhà máy, nhà cung cấp và tổ chức phối hợp với nhau.' },
  { id: 'poster', name: 'C · Sân khấu ngày hội', detail: 'Ảnh toàn khối, tên sự kiện đặt trên mảng giấy gấp và dải tham gia bên dưới. Nổi bật như một poster sự kiện.' },
];

function Photo({ table = false }) {
  const [state, setState] = useState('loading');
  const base = table ? 'sourcing-table-home-v2' : 'sourcing-meeting-home-v1';
  return <figure className="expo-option-photo" aria-busy={state === 'loading'} data-preview-photo-state={state}>
    {state === 'error' ? <div className="expo-option-photo-error" role="status"><ImageOff aria-hidden="true" /><p>Ảnh chưa tải được. Chọn vai trò để xem cách tham gia.</p></div> : <>
      {state === 'loading' && <span className="expo-option-photo-loading" role="status">Đang tải hình ảnh…</span>}
      <img src={'/images/services/' + base + '.jpg'} srcSet={'/images/services/' + base + '-960.jpg 960w, /images/services/' + base + '.jpg 1536w'} sizes="(max-width: 767px) calc(100vw - 32px), 1200px" width="1536" height="1024" loading="lazy" decoding="async" alt={table ? 'Bàn trao đổi B2B với mẫu sản phẩm và ba vị trí tham gia' : 'Doanh nghiệp xem mẫu và trao đổi tại bàn kết nối'} onLoad={() => setState('success')} onError={() => setState('error')} />
    </>}
  </figure>;
}

function Roles({ selected, onSelect, prefix }) {
  return <div className="expo-option-roles" role="group" aria-label="Chọn vai trò tham gia">
    {EXPO_HOME_ROLES.map(role => {
      const Icon = icons[role.id];
      return <button key={role.id} type="button" data-option-role={role.id} id={prefix + '-' + role.id} aria-label={role.label} aria-pressed={selected === role.id} aria-controls={prefix + '-panel'} onClick={() => onSelect(role.id)}>
        <Icon size={20} aria-hidden="true" /><span>{role.label}</span><Check className="expo-option-check" size={16} aria-hidden="true" />
      </button>;
    })}
  </div>;
}

function Story({ selected, prefix }) {
  const role = resolveExpoRole(selected);
  return <div className="expo-option-story" id={prefix + '-panel'} role="region" aria-labelledby={prefix + '-' + role.id}>
    <div aria-live="polite" aria-atomic="true"><h3>{role.title}</h3><p>{role.description}</p>
      <ul>{role.benefits.map(benefit => <li key={benefit}><Check size={16} aria-hidden="true" />{benefit}</li>)}</ul>
    </div>
    <a href={role.href} target="_blank" rel="noopener" data-option-cta className="expo-home-link expo-home-primary">{role.action}<ArrowUpRight size={18} aria-hidden="true" /></a>
  </div>;
}

function Alternative({ type }) {
  const [selected, setSelected] = useState('buyer');
  const prefix = 'expo-option-' + type;
  return <section className={'expo-home expo-option expo-option--' + type} data-expo-option={type} aria-labelledby={prefix + '-title'}>
    <div className="expo-home-shell">
      {type === 'table' ? <>
        <header className="expo-option-table-head"><p>Sourcing Day &amp; B2B</p><h2 id={prefix + '-title'}>NGÀY HỘI<span>CHUỖI CUNG ỨNG</span></h2><p>Mang nhu cầu và năng lực đến cùng một bàn trao đổi.</p></header>
        <div className="expo-option-table-scene"><Photo table /><Roles selected={selected} onSelect={setSelected} prefix={prefix} /></div>
        <p className="expo-option-table-hint">Chọn vị trí của doanh nghiệp hoặc tổ chức bạn.</p>
      </> : <>
        <div className="expo-option-poster-scene"><Photo />
          <header className="expo-option-poster-paper"><p>Sourcing Day &amp; B2B</p><h2 id={prefix + '-title'}>NGÀY HỘI<span>CHUỖI CUNG ỨNG</span></h2><p>Xem mẫu sản phẩm.<br />Trao đổi trực tiếp với đối tác.</p></header>
          <div className="expo-option-poster-sign"><Handshake size={24} aria-hidden="true" /><span>Nhu cầu thực tế.<br /><strong>Cuộc gặp trực tiếp.</strong></span></div>
        </div>
        <Roles selected={selected} onSelect={setSelected} prefix={prefix} />
      </>}
      <Story selected={selected} prefix={prefix} />
      <a href="/chuong-trinh" target="_blank" rel="noopener" className="expo-option-program">Xem chương trình<ArrowUpRight size={18} aria-hidden="true" /></a>
    </div>
  </section>;
}

function Preview() {
  const query = new URLSearchParams(window.location.search).get('option');
  const [choice, setChoice] = useState(options.some(o => o.id === query) ? query : 'invitation');
  const active = options.find(o => o.id === choice);
  function select(id) {
    setChoice(id);
    const url = new URL(window.location.href); url.searchParams.set('option', id);
    window.history.replaceState(null, '', url);
  }
  return <main className="expo-design-review ccu-public-shell">
    <header className="expo-design-review-bar"><div><p>CCU · BẢN XEM THỬ</p><h1>Chọn diện mạo cho Ngày hội.</h1><p>Nhà máy · Nhà cung cấp · Hội / Hiệp hội / Tổ chức</p></div><a href="/#chuong-trinh" target="_blank" rel="noopener">Trang chủ<ArrowUpRight size={18} aria-hidden="true" /></a></header>
    <nav className="expo-design-review-options" aria-label="Chọn phương án thiết kế">{options.map(option => <button type="button" key={option.id} data-design-option={option.id} aria-pressed={choice === option.id} aria-controls="expo-design-review-result" onClick={() => select(option.id)}>{option.name}</button>)}</nav>
    <p className="expo-design-review-description" aria-live="polite">{active.detail}</p>
    <div id="expo-design-review-result" key={choice}>
      {choice === 'invitation' ? <SupplyChainExpoPaper3D preview /> : <Alternative type={choice} />}
    </div>
    <footer className="expo-design-review-foot">Đã áp dụng A — Thiệp mời triển lãm trên trang chủ localhost. B/C giữ lại để tham khảo; các nút tham gia mở trang hiện có trong tab mới.
      <details><summary>Kiểm tra 8 trạng thái điều khiển — chỉ trong bản xem thử</summary>
        <div className="expo-home expo-review-state-grid">
          {[
            {name:'Mặc định', label:'Nhà máy'},
            {name:'Hover', label:'Nhà máy', className:'is-hover'},
            {name:'Focus', label:'Nhà máy', className:'is-focus'},
            {name:'Nhấn', label:'Nhà máy', className:'is-active'},
            {name:'Vô hiệu', label:'Chưa khả dụng', disabled:true},
            {name:'Đang xử lý', label:'Đang tải…', state:'loading', busy:true},
            {name:'Lỗi', label:'Không tải được', state:'error'},
            {name:'Thành công', label:'Đã chọn nhà máy', state:'success'},
          ].map(state=><article key={state.name}><p>{state.name}</p><div className="expo-home-role-choices"><button type="button" className={state.className} disabled={state.disabled} data-state={state.state} aria-busy={state.busy} aria-describedby="expo-preview-state-explanation">{state.state==='error' ? <ImageOff size={16} aria-hidden="true"/> : state.state==='success' ? <Check size={16} aria-hidden="true"/> : null}{state.label}</button></div></article>)}
          <p id="expo-preview-state-explanation">Các trạng thái này là mẫu kiểm tra thiết kế, không thực hiện yêu cầu API. Lỗi và tải ảnh thật có thể kiểm tra bằng cách chặn ảnh trong trình duyệt.</p>
        </div>
      </details>
    </footer>
  </main>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><Preview /></BrowserRouter>);
