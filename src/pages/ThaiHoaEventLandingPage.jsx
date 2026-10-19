import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, MapPin, Factory, Package, UsersRound, Handshake, Radio, ChartNoAxesCombined, Check, Diamond, Truck, Wrench, Leaf, ClipboardList, ShieldCheck, Menu, X, CircleHelp, Building2 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import AuthModal from '../components/auth/AuthModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getCloudRecords } from '../data/cloudData.js';
import ProgramRegistrationSection from '../components/programs/ProgramRegistrationSection.jsx';
import ProgramMatchingSection from '../components/programs/ProgramMatchingSection.jsx';
import ProgramPostMatchingSection from '../components/programs/ProgramPostMatchingSection.jsx';
import ThaiHoaLiveEventDashboard from '../components/programs/ThaiHoaLiveEventDashboard.jsx';
import ThaiHoaPostEventDashboard from '../components/programs/ThaiHoaPostEventDashboard.jsx';
import ThaiHoaConfirmedParticipants from '../components/programs/ThaiHoaConfirmedParticipants.jsx';
import { EVENT_PATH, EVENT_FACTS, findEventRecord, eventState, eventViewTab, eventProgram, publicParticipants, sponsorPackages, eventStructuredData } from './thaiHoaEventLandingModel.js';
import './ThaiHoaEventLanding.css';
const money = value => value.toLocaleString('vi-VN') + 'đ';
const stages = [{
  id: 'before',
  title: 'Trước sự kiện',
  detail: 'Chuẩn bị & Matching',
  Icon: CalendarDays
}, {
  id: 'during',
  title: 'Đang diễn ra',
  detail: 'Check-in & Kết nối',
  Icon: Radio
}, {
  id: 'after',
  title: 'Sau sự kiện',
  detail: 'Kết quả & Follow-up',
  Icon: ChartNoAxesCombined
}];
const connectionGroups = [{
  Icon: Package,
  title: 'Mua bán & vật tư',
  detail: 'Bao bì, pallet, nguyên liệu, linh kiện…',
  color: 'green'
}, {
  Icon: Truck,
  title: 'Logistics & hạ tầng',
  detail: 'Vận chuyển, kho bãi, cảng, hải quan…',
  color: 'blue'
}, {
  Icon: Wrench,
  title: 'Dịch vụ chuyên môn',
  detail: 'Tài chính, công nghệ, môi trường, HVAC…',
  color: 'orange'
}, {
  Icon: Leaf,
  title: 'Chia sẻ vận hành & phát triển',
  detail: 'Chuyển đổi số, năng lượng, kỹ thuật…',
  color: 'green'
}];
const buyerBenefits = ['Tìm nhà cung ứng phù hợp', 'Tối ưu chi phí, vận hành', 'Mở rộng nguồn cung trong nước', 'Kết nối nhanh 1:1 tại sự kiện'];
const supplierBenefits = ['Giới thiệu năng lực & sản phẩm', 'Tiếp cận trực tiếp nhà máy', 'Mở rộng thị trường & đối tác', 'Kết nối dài hạn sau sự kiện'];
export function ThaiHoaLandingView({
  program,
  state,
  participants = [],
  identity = null,
  onLogin = () => {},
  onRegister,
  activeTab,
  onTabChange,
  selectedRole = 'buyer',
  registrationIntent = 0,
  meetingTarget = null,
  now = Date.now()
}) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const packages = sponsorPackages(program);
  const buyers = participants.filter(p => p.role === 'buyer');
  const suppliers = participants.filter(p => p.role === 'supplier');
  const registration = (role, packageTitle = '', target = null) => {
    setSelectedPackage(packageTitle);
    onRegister(role, target);
  };
  const publicNeeds = (program.publicBuyerNeeds || []).filter(p => p.visibility === 'PUBLIC' && p.publishStatus === 'PUBLISHED');
  const panelHeading = activeTab === 'before' ? 'Chuẩn bị đúng. Gặp đúng đối tác.' : activeTab === 'during' ? 'Đến đúng giờ. Kết nối đúng người.' : 'Sau cuộc gặp, tiếp tục tạo giá trị.';
  return <div className="th-landing">
    <section className="th-hero" id="gioi-thieu" aria-labelledby="th-event-title">
      <div className="th-organizers" aria-label="Đơn vị phối hợp tổ chức">
        <figure className="th-partner th-partner-vietson"><img src="/logo-thip-png.png" alt="VIETSON Eco-Industrial Park" width="300" height="200" /><figcaption>KCN Thái Hòa<span>Đơn vị phối hợp</span></figcaption></figure>
        <div className="th-organizer-brand"><BrandLogo size="lg" /></div>
        <figure className="th-partner th-partner-team"><img src="/logo_teamkcn.jpg" alt="Team KCN" width="1844" height="1632" /><figcaption>Team KCN Miền Nam<span>Đơn vị phối hợp</span></figcaption></figure>
      </div>
      <div className="th-hero-copy"><p className="th-event-kicker">Ngày hội</p><h1 id="th-event-title">CHUỖI CUNG ỨNG<span>BUSINESS MATCHING KCN THÁI HÒA 2026</span></h1><p className="th-hero-promise">Nhu cầu thật – Nguồn cung phù hợp – Cuộc gặp được theo dõi đến kết quả</p>
        <div className="th-hero-details"><div><CalendarDays /><p><strong>Thứ Tư, 07/10/2026</strong><span>Ngày tổ chức</span></p></div><div><Clock3 /><p><strong>08:00 – 11:00</strong><span>Giao thương & kết nối trực tiếp</span></p></div><div><MapPin /><p><strong>{EVENT_FACTS.venue}</strong><span>{EVENT_FACTS.address}</span></p></div></div>
      </div>
    </section>

    <main className={`th-content${activeTab === 'during' ? ' th-content-live' : activeTab === 'after' ? ' th-content-post' : ''}`}>
      <div className="th-stage-tabs" role="tablist" aria-label="Hành trình sự kiện">{stages.map(({
          id,
          title,
          detail,
          Icon
        }) => <button key={id} type="button" id={`th-tab-${id}`} role="tab" aria-selected={activeTab === id} aria-controls="th-lifecycle-panel" tabIndex={activeTab === id ? 0 : -1} onKeyDown={event => {
          const index = stages.findIndex(s => s.id === activeTab);
          if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
            onTabChange(stages[next].id);
            document.getElementById(`th-tab-${stages[next].id}`)?.focus();
          }
        }} onClick={() => onTabChange(id)}><Icon /><span><strong>{title}</strong><small>{detail}</small></span></button>)}</div>
      {activeTab === 'during' ? <ThaiHoaLiveEventDashboard program={program} state={state} participants={participants} identity={identity} onLogin={onLogin} now={now} /> : activeTab === 'after' ? <ThaiHoaPostEventDashboard program={program} participants={participants} identity={identity} onLogin={onLogin} /> : <>
      <section className="th-metrics-bar" id="dang_ky" aria-label="Quy mô dự kiến & đăng ký">
        <div className="th-metrics">
          {[[Building2, '150+', 'Doanh nghiệp tham gia'], [Factory, '40+', 'Nhà máy / Buyer'], [UsersRound, '70+', 'Nhà cung ứng / Supplier'], [Handshake, '1.000+', 'Cuộc gặp 1:1 dự kiến']].map(([Icon, value, label], i) => (
            <div key={label} className={`th-metric th-metric-${i}`}>
              <Icon />
              <p><strong>{value}</strong><span>{label}</span></p>
            </div>
          ))}
        </div>
        <div className="th-main-actions">
          <button className="th-button th-button-orange" onClick={() => registration('buyer')}>
            ĐĂNG KÝ THAM GIA <ArrowRight />
          </button>
          <a className="th-button th-button-outline" href="#doanh-nghiep">
            XEM DOANH NGHIỆP THAM GIA
          </a>
        </div>
      </section>

      <section className="th-entry-grid" aria-label="Chọn vai trò kết nối">
        <article className="th-role-card th-role-buyer">
          <div>
            <h2><Factory /> Dành cho Nhà máy / Buyer</h2>
            <ul>{buyerBenefits.map(t => <li key={t}><Check />{t}</li>)}</ul>
            <button className="th-button th-button-green" onClick={() => registration('buyer')}>
              Đăng ký Nhà máy <ArrowRight />
            </button>
          </div>
        </article>



        <article className="th-role-card th-role-supplier">
          <div>
            <h2><Package /> Dành cho Nhà cung ứng / Supplier</h2>
            <ul>{supplierBenefits.map(t => <li key={t}><Check />{t}</li>)}</ul>
            <button className="th-button th-button-orange" onClick={() => registration('supplier')}>
              Đăng ký Nhà cung ứng <ArrowRight />
            </button>
          </div>
        </article>
      </section>

      <ThaiHoaConfirmedParticipants participants={participants} open={state.open} onRequestMeeting={target => registration(target.role, '', target)} />

      <section className="th-info-grid" aria-label="Thông tin tham gia">
        <article className="th-info-card th-agenda">
          <div className="th-info-head">
            <h2><CalendarDays />Agenda dự kiến</h2>
            <a href="#agenda-detail" className="th-card-link" onClick={e => { e.preventDefault(); registration('buyer'); }}>Xem chi tiết <ArrowRight size={13} /></a>
          </div>
          <ol>
            {EVENT_FACTS.agenda.map(item => (
              <li key={item.time}>
                <time>{item.time}</time>
                <span>{item.title}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="th-info-card th-connections">
          <div className="th-info-head">
            <h2><Handshake />4 nhóm kết nối chính</h2>
          </div>
          <div className="th-connection-groups">
            {connectionGroups.map(({ Icon, title, detail, color }) => (
              <div className={`th-connection-${color}`} key={title}>
                <Icon />
                <p><strong>{title}</strong><span>{detail}</span></p>
              </div>
            ))}
          </div>
        </article>

        <article className="th-info-card th-fees">
          <div className="th-info-head">
            <h2><ClipboardList />Chi phí tham gia</h2>
            <a href="#fee-detail" className="th-card-link" onClick={e => { e.preventDefault(); registration('buyer'); }}>Xem chi tiết <ArrowRight size={13} /></a>
          </div>
          <table>
            <caption className="sr-only">Phí theo hạng mục và tư cách thành viên</caption>
            <thead>
              <tr>
                <th>Hạng mục</th>
                <th>Hội viên</th>
                <th>Không phải hội viên</th>
              </tr>
            </thead>
            <tbody>
              {EVENT_FACTS.fees.map(fee => (
                <tr key={fee.title}>
                  <th scope="row">{fee.title}</th>
                  <td>{money(fee.member)}</td>
                  <td>{money(fee.nonmember)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="th-fee-note">* Đã bao gồm teabreak, tài liệu, kết nối 1:1, tiệc trưa giao lưu cùng Ban tổ chức 2 bên, nhà máy và nhà cung cấp.</p>
          <div className="th-fee-promo">🎁 Ưu đãi đặc biệt cho doanh nghiệp đăng ký sớm!</div>
        </article>

        <article className="th-info-card th-sponsors">
          <div className="th-info-head">
            <h2><Diamond />Gói tài trợ sự kiện</h2>
            <a href="#sponsor-detail" className="th-card-link" onClick={e => { e.preventDefault(); registration('sponsor'); }}>Xem chi tiết <ArrowRight size={13} /></a>
          </div>
          <div className="th-sponsor-grid">
            {packages.map((p, index) => (
              <div key={p.id} className={`th-sponsor-tier th-tier-${index}`}>
                <div className={`th-tier-badge th-badge-${index}`}>
                  <Diamond size={13} />
                  <span>{p.title.toUpperCase()}</span>
                </div>
                <strong>{p.price === null ? 'Liên hệ BTC' : money(p.price)}</strong>
                <ul>
                  {p.rights.map(right => (
                    <li key={right}><Check /><span>{right}</span></li>
                  ))}
                </ul>
                <button className="th-button th-button-orange" onClick={() => registration('sponsor', p.title)}>
                  Xem quyền lợi chi tiết <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
      </>}
    </main>
  </div>;
}
export default function ThaiHoaEventLandingPage() {
  const {
    identity
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now);
  const record = findEventRecord(getCloudRecords('programs'));
  const state = eventState(record, now);
  const program = useMemo(() => eventProgram(record, now), [record, now]);
  const participants = useMemo(() => publicParticipants(record), [record]);
  const requestedTab = eventViewTab(location.search, location.hash, state.tab);
  const [activeTab, setActiveTab] = useState(requestedTab);
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [registrationIntent, setRegistrationIntent] = useState(0);
  const [meetingTarget, setMeetingTarget] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  useEffect(() => { setActiveTab(requestedTab); }, [requestedTab]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!location.hash) return;
    const anchor = location.hash === '#dang-ky-tai-tro' ? 'dang_ky' : decodeURIComponent(location.hash.slice(1));
    const timer = setTimeout(() => document.getElementById(anchor)?.scrollIntoView({
      block: 'start'
    }), 180);
    return () => clearTimeout(timer);
  }, [location.hash, activeTab]);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Ngày hội Chuỗi Cung Ứng KCN Thái Hòa 2026 | Business Matching';
    const added = [];
    const update = (selector, tag, attrs) => {
      let element = document.head.querySelector(selector);
      const previous = element ? Object.fromEntries(Object.keys(attrs).map(k => [k, element.getAttribute(k)])) : null;
      if (!element) {
        element = document.createElement(tag);
        document.head.append(element);
      }
      Object.entries(attrs).forEach(([k, v]) => element.setAttribute(k, v));
      added.push(() => {
        if (!previous) element.remove();else Object.entries(previous).forEach(([k, v]) => v === null ? element.removeAttribute(k) : element.setAttribute(k, v));
      });
    };
    update('meta[name="description"]', 'meta', {
      name: 'description',
      content: 'Ngày hội Chuỗi Cung Ứng KCN Thái Hòa 2026: kết nối nhu cầu nhà máy và năng lực nhà cung ứng; agenda, chi phí tham gia, tài trợ và theo dõi sau matching.'
    });
    update('link[rel="canonical"]', 'link', {
      rel: 'canonical',
      href: window.location.origin + EVENT_PATH
    });
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify([eventStructuredData(program, window.location.origin), {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{
        '@type': 'ListItem',
        position: 1,
        name: 'Ngày hội Chuỗi Cung Ứng',
        item: window.location.origin + '/ngay-hoi-chuoi-cung-ung'
      }, {
        '@type': 'ListItem',
        position: 2,
        name: 'KCN Thái Hòa 2026',
        item: window.location.origin + EVENT_PATH
      }]
    }]);
    document.head.append(schema);
    return () => {
      document.title = previousTitle;
      added.reverse().forEach(restore => restore());
      schema.remove();
    };
  }, [program]);
  const register = (role, target = null) => {
    setSelectedRole(role);
    setMeetingTarget(target);
    setRegistrationIntent(v => v + 1);
    navigate(EVENT_PATH + '?stage=before#dang_ky', { replace: true });
    document.getElementById('dang_ky')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  const changeTab = tab => {
    setActiveTab(tab);
    const params = new URLSearchParams(location.search);
    params.set('stage', tab);
    navigate({ pathname: EVENT_PATH, search: params.toString() }, { replace: true, preventScrollReset: true });
  };
  return <><ThaiHoaLandingView program={program} state={state} participants={participants} identity={identity} onLogin={() => setAuthOpen(true)} onRegister={register} activeTab={activeTab} onTabChange={changeTab} selectedRole={selectedRole} registrationIntent={registrationIntent} meetingTarget={meetingTarget} now={now} /><AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialTab="login" /></>;
}
