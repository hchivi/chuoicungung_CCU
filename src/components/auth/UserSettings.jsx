import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRound, Building2, Handshake, CalendarDays, ShieldCheck, CreditCard, Settings2, ArrowRight, LogOut, Save, Check, LockKeyhole } from 'lucide-react';
import { authAction, authenticatedRequest } from '../../services/authSession.js';
import { normalizeBusinessRole } from '../../data/accountRoles.js';
import { DEFAULT_PREFERENCES, SETTINGS_SECTIONS, NOTIFICATION_TYPES } from '../../data/userSettings.js';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import AuthForm from './AuthForm.jsx';
import OrganizationSettings from './OrganizationSettings.jsx';
import { SettingsBlock, ToggleRow, RoleChoices, SelectRow, ConfirmDialog, roleLabel } from './SettingsPrimitives.jsx';
import './AccountSettings.css';

const ICONS = [UserRound, Building2, Handshake, CalendarDays, ShieldCheck, CreditCard, Settings2];
const draftFrom = user => ({ fullName: user.fullName || '', companyName: user.companyName || '', businessRoles: user.businessRoles || [], primaryBusinessRole: user.primaryBusinessRole || '', title: user.title || '', avatar: user.avatar || '', phone: user.phone || '', zalo: user.zalo || '', language: user.language || 'vi', timezone: user.timezone || 'Asia/Ho_Chi_Minh', preferences: structuredClone(user.preferences || DEFAULT_PREFERENCES) });
const VISIBILITIES = { PUBLIC: 'Công khai', MEMBERS: 'Thành viên cùng doanh nghiệp', MATCHED_ONLY: 'Đối tác matching đã được duyệt', HIDDEN: 'Ẩn' };
export default function UserSettings({ session }) {
  const user = session.identity?.user;
  const location = useLocation();
  const { setLang } = useLanguage();
  const [draft, setDraft] = useState(() => draftFrom(user || {}));
  const [state, setState] = useState(null);
  const [records, setRecords] = useState([]);
  const [providers, setProviders] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const aliases = { 'vai-tro-doanh-nghiep': 'business', 'ho-so-tai-khoan': 'account', 'bao-mat-tai-khoan': 'system', 'khong-gian-vai-tro': 'business' };
  const hash = location.hash.slice(1);
  const active = aliases[hash] || (SETTINGS_SECTIONS.some(section => section.id === hash) ? hash : 'account');
  const generation = useRef(0);
  useEffect(() => { setDraft(draftFrom(user || {})); }, [user]);
  async function loadState() { const result = await authenticatedRequest('/api/auth/settings'); setState(result.data); return result.data; }
  useEffect(() => {
    const current = ++generation.current;
    setState(null); setRecords([]); setError(''); setMessage(''); setConfirmation(null);
    if (!user) return;
    const controller = new AbortController();
    Promise.allSettled([
      authenticatedRequest('/api/auth/settings', { signal: controller.signal }),
      authenticatedRequest('/api/submissions', { signal: controller.signal }),
      authenticatedRequest('/api/auth/providers', { signal: controller.signal }),
    ]).then(results => {
      if (current !== generation.current || controller.signal.aborted) return;
      if (results[0].status === 'fulfilled') setState(results[0].value.data); else setError(results[0].reason.message);
      if (results[1].status === 'fulfilled') setRecords(results[1].value.data || []); else setError(previous => previous || 'Chưa tải được đăng ký và yêu cầu của bạn.');
      if (results[2].status === 'fulfilled') setProviders(results[2].value.data);
    });
    return () => { controller.abort(); generation.current++; };
  }, [user?.id]);
  const prefs = draft.preferences;
  const organizations = state?.organizations || [];
  useEffect(() => {
    if (state && draft.preferences.context.organizationId && !state.organizations.some(item => item.id === draft.preferences.context.organizationId && item.status !== 'ARCHIVED')) {
      setDraft(previous => ({ ...previous, preferences: { ...previous.preferences, context: { organizationId: null, role: null } } }));
    }
  }, [state]);
  const org = organizations.find(item => item.id === prefs.context.organizationId && item.status !== 'ARCHIVED');
  const roles = org ? org.roles.map(normalizeBusinessRole).filter(Boolean) : draft.businessRoles;
  const dirty = user && JSON.stringify(draft) !== JSON.stringify(draftFrom(user));
  const preference = (section, key, value) => { setMessage(''); setDraft(previous => ({ ...previous, preferences: { ...previous.preferences, [section]: { ...previous.preferences[section], [key]: value } } })); };
  const field = (key, value) => { setMessage(''); setDraft(previous => ({ ...previous, [key]: value })); };
  async function save() {
    if (!draft.fullName.trim()) { setError('Vui lòng nhập họ và tên trong Account.'); return; }
    setBusy(true); setError(''); setMessage('');
    try { await authAction('settings', draft); setLang(draft.language); setMessage('Đã lưu cài đặt vào tài khoản của bạn.'); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function confirmedAction() {
    setBusy(true); setError('');
    try { await confirmation.run(); setConfirmation(null); }
    catch (err) { setError(err.message); setConfirmation(null); } finally { setBusy(false); }
  }
  const ask = (title, text, run) => setConfirmation({ title, message: text, run });
  const registrations = records.filter(record => record.kind === 'programRegistration');
  const section = SETTINGS_SECTIONS.find(item => item.id === active);
  if (session.loading) return <main className="us-page"><p role="status">Đang tải cài đặt…</p></main>;
  if (!user) return <main className="us-page"><div className="us-guest"><UserRound /><h1>Cài đặt người dùng</h1><p>Đăng nhập để quản lý hồ sơ, doanh nghiệp và kết nối của bạn.</p><Link to="/dang-nhap?next=%2Ftai-khoan%2Fcai-dat">Đăng nhập <ArrowRight /></Link></div></main>;
  return <main className="us-page"><div className="us-layout">
    <aside className="us-sidebar"><div className="us-person">{user.avatar ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" /> : <span>{user.fullName?.slice(0, 1) || 'U'}</span>}<div><strong>{user.fullName}</strong><small>Tài khoản cá nhân</small></div></div>
      <nav aria-label="Cài đặt người dùng">{SETTINGS_SECTIONS.map((item, index) => { const Icon = ICONS[index]; return <Link key={item.id} to={`#${item.id}`} aria-current={active === item.id ? 'page' : undefined}><Icon /><span>{item.label}<small>{item.title}</small></span></Link>; })}</nav>
      <div className="us-sidebar-bottom"><Link to="/tai-khoan/chuong-trinh">Không gian làm việc <ArrowRight /></Link>{session.identity.role && <Link to="/admin">Quản trị hệ thống <ArrowRight /></Link>}<button type="button" onClick={() => ask('Đăng xuất?', 'Kết thúc phiên đăng nhập trên thiết bị này.', () => authAction('logout'))}><LogOut />Đăng xuất</button></div>
    </aside>
    <div className="us-main"><header className="us-heading"><div><p>CÀI ĐẶT NGƯỜI DÙNG</p><h1>{section.title}</h1><span>Một tài khoản. Nhiều doanh nghiệp. Đúng ngữ cảnh làm việc.</span></div><span className="us-private"><ShieldCheck />Riêng tư theo tài khoản</span></header>
      <div className="us-context"><Building2 /><label>Doanh nghiệp<select aria-label="Chuyển doanh nghiệp" disabled={!state || busy} value={org?.id || ''} onChange={event => { const selected = organizations.find(item => item.id === event.target.value); setDraft(previous => ({ ...previous, preferences: { ...previous.preferences, context: { organizationId: selected?.id || null, role: null } } })); }}><option value="">Cá nhân / chưa chọn doanh nghiệp</option>{organizations.filter(item => item.status !== 'ARCHIVED').map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Ngữ cảnh<select aria-label="Chuyển ngữ cảnh" value={prefs.context.role || ''} disabled={busy} onChange={event => preference('context', 'role', event.target.value || null)}><option value="">Tất cả vai trò đã khai báo</option>{roles.map(role => <option key={role} value={role}>{roleLabel(role)}</option>)}</select></label><span>Đổi ngữ cảnh không cấp thêm quyền.</span></div>
      <div className="us-content" aria-busy={busy}>
      {active === 'account' && <SettingsBlock title="Thông tin cá nhân" description="Hồ sơ người dùng độc lập với hồ sơ và quyền trong mỗi doanh nghiệp."><div className="us-fields">{[['fullName', 'Họ và tên', 'text', 200], ['title', 'Chức danh', 'text', 120], ['phone', 'Điện thoại', 'tel', 40], ['zalo', 'Zalo (số điện thoại / đường dẫn)', 'text', 200], ['avatar', 'Đường dẫn ảnh đại diện HTTPS', 'url', 500]].map(([key, label, type, max]) => <label key={key}>{label}<input type={type} maxLength={max} value={draft[key]} disabled={busy} onChange={event => field(key, event.target.value)} /></label>)}<label>Email đăng nhập<input type="email" readOnly value={user.email || ''} /><small>Email được xác minh bởi phương thức đăng nhập; không đổi trực tiếp tại đây.</small></label><label>Ngôn ngữ<select value={draft.language} onChange={event => field('language', event.target.value)}><option value="vi">Tiếng Việt</option><option value="en">English</option></select></label><label>Múi giờ<input list="us-timezones" value={draft.timezone} onChange={event => field('timezone', event.target.value)} /><datalist id="us-timezones">{['Asia/Ho_Chi_Minh', 'Asia/Singapore', 'Asia/Tokyo', 'UTC'].map(value => <option key={value} value={value} />)}</datalist></label></div></SettingsBlock>}
      {active === 'business' && <><SettingsBlock title="Vai trò của bạn" description="Vai trò tự khai báo phục vụ cá nhân hóa. Vai trò xác nhận do nền tảng kiểm tra, không thay thế quyền membership."><RoleChoices value={draft.businessRoles} disabled={busy} onChange={value => setDraft(previous => ({ ...previous, businessRoles: value, primaryBusinessRole: value.includes(previous.primaryBusinessRole) ? previous.primaryBusinessRole : value[0] || '', preferences: { ...previous.preferences, context: previous.preferences.context.organizationId ? previous.preferences.context : { organizationId: null, role: value.includes(previous.preferences.context.role) ? previous.preferences.context.role : null } } }))} /><SelectRow label="Vai trò chính của cá nhân" value={draft.primaryBusinessRole} onChange={value => field('primaryBusinessRole', value)} options={{ '': 'Chưa chọn', ...Object.fromEntries(draft.businessRoles.map(role => [role, roleLabel(role)])) }} /><p className="us-note">Đã xác nhận: {user.confirmedBusinessRoles?.length ? user.confirmedBusinessRoles.map(roleLabel).join(', ') : 'Chưa có vai trò được xác nhận'}</p></SettingsBlock><OrganizationSettings state={state} organization={org} onReload={loadState} onError={setError} onMessage={setMessage} ask={ask} onContextClear={() => setDraft(previous => ({ ...previous, preferences: { ...previous.preferences, context: { organizationId: null, role: null } } }))} /></>}
      {active === 'connections' && <><SettingsBlock title="SUPPI · Tìm nguồn & matching" description="Chỉ dùng dữ liệu bạn cho phép. Không tự gửi nhu cầu hoặc liên hệ đối tác.">{Object.entries({ useProfile: 'Cho phép dùng hồ sơ cá nhân', useCapability: 'Cho phép dùng năng lực doanh nghiệp hiện tại', useNeeds: 'Cho phép dùng nhu cầu của bạn', useEvents: 'Cho phép dùng đăng ký sự kiện của bạn', buyerSuggestions: 'Buyer nhận gợi ý nhà cung ứng', supplierSuggestions: 'Supplier nhận gợi ý nhà máy / nhu cầu' }).map(([key, label]) => <ToggleRow key={key} label={label} checked={prefs.suppi[key]} onChange={value => preference('suppi', key, value)} />)}<SelectRow label="Chế độ matching" description="Exact: sát tiêu chí. Balanced: cân bằng. Explore: khám phá khả năng mới." value={prefs.suppi.mode} options={{ Exact: 'Exact', Balanced: 'Balanced', Explore: 'Explore' }} onChange={value => preference('suppi', 'mode', value)} /></SettingsBlock><SettingsBlock title="CHAINY · Kết nối & follow-up" description="Lưu lựa chọn nhắc việc. Bộ gửi nhắc tự động chưa hoạt động; CHAINY hiện hỗ trợ soạn nội dung và chuẩn bị việc cần làm.">{Object.entries({ meeting: 'Cuộc gặp', quote: 'Báo giá', sample: 'Mẫu sản phẩm', nextAction: 'Hành động tiếp theo', overdue: 'Follow-up quá hạn' }).map(([key, label]) => <ToggleRow key={key} label={label} checked={prefs.chainy[key]} onChange={value => preference('chainy', key, value)} />)}<ToggleRow label="Kênh trong ứng dụng" description="Lưu lựa chọn; chưa có bộ điều phối thông báo tự động." checked={prefs.chainy.inApp} onChange={value => preference('chainy', 'inApp', value)} /><p className="us-note"><LockKeyhole />Email / Zalo nhắc việc chưa được tích hợp. Đăng nhập Zalo không đồng nghĩa với quyền gửi tin OA.</p><ToggleRow label="Luôn xác nhận trước hành động AI có ảnh hưởng" description="Gửi liên hệ, đặt lịch, chia sẻ dữ liệu và hành động tài chính không tự thực hiện." checked disabled /></SettingsBlock></>}
      {active === 'events' && <><SettingsBlock title="Tùy chọn tham gia sự kiện" description="Các lựa chọn được lưu. Chia sẻ liên hệ chỉ được xét sau khi matching được duyệt.">{Object.entries({ allowMeetingRequests: 'Cho phép nhận đề nghị gặp', showCompany: 'Cho phép hiển thị doanh nghiệp trong danh sách tham dự', suppiSuggestions: 'Nhận gợi ý SUPPI theo sự kiện', shareContactAfterApproval: 'Cho phép chia sẻ liên hệ sau matching được duyệt' }).map(([key, label]) => <ToggleRow key={key} label={label} checked={prefs.events[key]} onChange={value => preference('events', key, value)} />)}<p className="us-note">Tùy chọn không công bố dữ liệu ngay. Chưa có bằng chứng matching được duyệt: liên hệ vẫn ẩn.</p></SettingsBlock><SettingsBlock title="Đăng ký & người tham dự"><div className="us-records">{registrations.length ? registrations.map(record => <div key={record.id}><strong>{record.data?.programTitle || record.data?.programName || record.data?.programSlug || 'Đăng ký chương trình'}</strong><span>{record.status === 'PENDING' ? 'Chờ xử lý' : record.status}</span><small>Người tham dự: {record.data?.attendeeName || record.data?.fullName || 'Theo hồ sơ đăng ký'} · Event Pass / QR: chờ BTC phát hành</small></div>) : <p className="us-empty">Chưa có đăng ký sự kiện.</p>}</div><Link className="us-link" to="/tai-khoan/chuong-trinh">Quản lý đăng ký & người tham dự <ArrowRight /></Link></SettingsBlock></>}
      {active === 'privacy' && <SettingsBlock title="Quyền riêng tư mặc định" description="Kiểm tra quyền ở server. Công khai hồ sơ không đồng nghĩa doanh nghiệp đã xác minh.">{[['profile', 'Hồ sơ cá nhân'], ['email', 'Email'], ['phone', 'Điện thoại'], ['zalo', 'Zalo']].map(([key, label]) => <SelectRow key={key} label={label} value={prefs.privacy[key]} options={VISIBILITIES} onChange={value => preference('privacy', key, value)} />)}<SelectRow label="Quyền riêng tư nhu cầu mới" value={prefs.privacy.requirement} onChange={value => preference('privacy', 'requirement', value)} options={{ PRIVATE: 'PRIVATE · Riêng tư', MATCHED_SUPPLIERS_ONLY: 'MATCHED_SUPPLIERS_ONLY · NCC matching được duyệt', PUBLIC_SUMMARY: 'PUBLIC_SUMMARY · Chỉ tóm tắt công khai' }} /><p className="us-note">Áp dụng cho nhu cầu mới. Dữ liệu đã công bố không tự đổi trạng thái. Chưa có matching được duyệt: quyền “Matched only” luôn đóng.</p></SettingsBlock>}
      {active === 'payments' && <SettingsBlock title="Thanh toán & hợp đồng" description="Tách biệt khỏi matching và vai trò kinh doanh. Không thu tiền hoặc xác nhận thanh toán từ trang cài đặt."><div className="us-finance">{[['Phí tham gia sự kiện', '/tai-khoan/chuong-trinh', 'Theo từng đăng ký chương trình'], ['Hợp đồng dịch vụ', '/tai-khoan/yeu-cau-dich-vu', 'Theo từng yêu cầu dịch vụ'], ['Tài trợ', '/tai-tro', 'Thỏa thuận tài trợ riêng'], ['Founding Partner', '/founding-partner', 'Hợp đồng đối tác sáng lập riêng']].map(([title, to, description]) => <Link key={title} to={to}><span><strong>{title}</strong><small>{description}</small></span><ArrowRight /></Link>)}</div><p className="us-note">Hóa đơn, hoàn tiền và cổng thanh toán chưa tích hợp. Liên hệ BTC / bộ phận phụ trách hợp đồng; matching không phải bằng chứng thanh toán.</p>{org && !org.permissions.finance && <p className="us-note"><LockKeyhole />Bạn chưa có quyền tài chính trong {org.name}. Liên kết trên chỉ mở không gian cá nhân / thông tin công khai.</p>}</SettingsBlock>}
      {active === 'system' && <><SettingsBlock title="Thông báo" description="Lưu tần suất mong muốn. Daily digest và bộ gửi tự động chưa được triển khai.">{Object.entries(NOTIFICATION_TYPES).map(([key, label]) => <SelectRow key={key} label={label} value={prefs.notifications[key]} onChange={value => preference('notifications', key, value)} disabled={key === 'system'} description={key === 'system' ? 'Thông báo bảo mật thiết yếu không thể tắt.' : undefined} options={{ REALTIME: 'Realtime', DAILY: 'Daily digest', OFF: 'Off' }} />)}</SettingsBlock><SettingsBlock title="Bảo mật & đăng nhập"><div className="us-integrations">{['google', 'zalo'].filter(provider => providers[provider]).map(provider => <div key={provider}><strong>{provider === 'google' ? 'Google' : 'Zalo'}</strong><span>{state?.providers?.includes(provider) ? 'Đã liên kết' : 'Hỗ trợ đăng nhập; chưa liên kết tài khoản này'}</span></div>)}</div><p className="us-note">Không tự liên kết tài khoản khác chỉ vì trùng tên. MFA / OTP bổ sung chưa hỗ trợ trong giao diện này.</p><details><summary>Đổi / đặt mật khẩu email</summary><AuthForm initialTab="password" /></details><div className="us-session"><ShieldCheck /><span><strong>Phiên hiện tại</strong><small>Được server xác minh. Chưa hỗ trợ liệt kê từng thiết bị.</small></span><button type="button" onClick={() => ask('Đăng xuất tất cả thiết bị?', 'Thu hồi refresh token tất cả phiên. Access token đã cấp có thể còn hiệu lực đến khi hết hạn.', () => authAction('logout-all', { confirm: true }))}>Đăng xuất tất cả</button></div></SettingsBlock><SettingsBlock title="Vòng đời tài khoản" description="Rời doanh nghiệp, xóa tài khoản và lưu trữ doanh nghiệp là ba thao tác khác nhau."><p className="us-note">Rời / lưu trữ tại Business. Chủ sở hữu duy nhất phải chuyển quyền trước khi rời hoặc yêu cầu xóa tài khoản.</p><button type="button" className="us-danger" disabled={!state?.schemaReady} onClick={() => ask('Gửi yêu cầu xóa tài khoản?', 'Server kiểm tra quyền sở hữu của tất cả doanh nghiệp. Đây là yêu cầu chờ xử lý, không xóa dữ liệu ngay.', async () => { const result = await authenticatedRequest('/api/auth/settings/organizations', { method: 'POST', body: JSON.stringify({ action: 'delete-account-request', confirm: true }) }); setMessage(result.data.message); })}>Yêu cầu xóa tài khoản</button></SettingsBlock></>}
      </div>
      <footer className="us-save"><div>{error ? <p role="alert" className="us-error">{error}</p> : message ? <p role="status" className="us-success"><Check />{message}</p> : <p>{dirty ? 'Có thay đổi chưa lưu.' : 'Đồng bộ theo tài khoản, không lưu riêng trên trình duyệt.'}</p>}</div><button type="button" className="us-primary" disabled={busy || !dirty || !state} onClick={save}><Save />{busy ? 'Đang xử lý…' : 'Lưu thay đổi'}</button></footer>
    </div>
  </div><ConfirmDialog value={confirmation} onClose={() => setConfirmation(null)} onConfirm={confirmedAction} busy={busy} /></main>;
}
