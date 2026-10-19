import React, { useEffect, useState } from 'react';
import { Building2, LockKeyhole } from 'lucide-react';
import { authenticatedRequest } from '../../services/authSession.js';
import { normalizeBusinessRole } from '../../data/accountRoles.js';
import { MEMBER_ROLES } from '../../data/userSettings.js';
import { SettingsBlock, RoleChoices, roleLabel } from './SettingsPrimitives.jsx';
const api = '/api/auth/settings/organizations';
const permissionLabel = { owner: 'Chủ sở hữu', admin: 'Quản trị', buyer: 'Mua hàng', sales: 'Kinh doanh', editor: 'Biên tập', finance: 'Tài chính', event_coordinator: 'Điều phối sự kiện' };
export default function OrganizationSettings({ state, organization: org, onReload, onError, onMessage, ask, onContextClear }) {
  const [details, setDetails] = useState(null);
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [company, setCompany] = useState({ name: '', taxCode: '', website: '', roles: ['supplier'] });
  const [orgRoles, setOrgRoles] = useState([]);
  const [invite, setInvite] = useState({ email: '', roles: ['editor'] });
  const [facility, setFacility] = useState({ name: '', province: '' });
  useEffect(() => {
    setDetails(null); setOrgRoles((org?.roles || []).map(normalizeBusinessRole).filter(Boolean));
    if (!org || org.status === 'ARCHIVED') return;
    const controller = new AbortController();
    authenticatedRequest(`${api}/${org.id}`, { signal: controller.signal }).then(result => { if (!controller.signal.aborted) setDetails(result.data); }).catch(error => { if (!controller.signal.aborted) onError(error.message); });
    return () => controller.abort();
  }, [org?.id, org?.status]);
  async function execute(input) {
    setPending(true); onError(''); onMessage('');
    try {
      const result = await authenticatedRequest(api, { method: 'POST', body: JSON.stringify({ organizationId: org?.id, ...input }) });
      const latest = await onReload();
      if (org && latest.organizations.some(item => item.id === org.id && item.status !== 'ARCHIVED') && !['leave', 'archive'].includes(input.action)) {
        const next = await authenticatedRequest(`${api}/${org.id}`); setDetails(next.data);
      }
      if (['leave', 'archive'].includes(input.action)) onContextClear();
      onMessage(result.data?.message || 'Đã cập nhật doanh nghiệp.');
      return result.data;
    } catch (error) { onError(error.message); throw error; } finally { setPending(false); }
  }
  const run = input => execute(input).catch(() => {});
  const confirm = (title, message, input) => ask(title, message, () => execute({ ...input, confirm: true }));
  async function search(event) {
    event.preventDefault(); setPending(true); onError('');
    try { const result = await authenticatedRequest(`${api}/search?q=${encodeURIComponent(query)}`); setResults(result.data); }
    catch (error) { onError(error.message); } finally { setPending(false); }
  }
  return <>
    <SettingsBlock title="Doanh nghiệp của bạn" description="Một doanh nghiệp có nhiều vai trò; không tạo lại hồ sơ cho từng vai trò.">
      {!state ? <p role="status">Đang tải membership…</p> : !state.schemaReady ? <p className="us-note"><LockKeyhole />Database chưa có quan hệ User–Organization. Cần áp dụng migration User Settings để bật tạo, claim và quản lý doanh nghiệp.</p> : <>
        {state.organizations.length ? <div className="us-records">{state.organizations.map(item => <div key={item.id}><Building2 /><span><strong>{item.name}</strong><small>{item.membership.roles.map(role => permissionLabel[role]).join(', ')} · {item.status === 'ARCHIVED' ? 'Đã lưu trữ' : item.verificationStatus === 'VERIFIED' ? 'Đã xác minh' : 'Chưa xác minh'}</small></span>{item.status === 'ARCHIVED' && item.permissions.archive && <button type="button" disabled={pending} onClick={() => confirm('Khôi phục doanh nghiệp?', 'Khôi phục trạng thái trước khi lưu trữ để quản lý hoặc chuyển quyền sở hữu. Không tự xác minh hồ sơ.', { action: 'restore', organizationId: item.id })}>Khôi phục</button>}</div>)}</div> : <p className="us-empty">Bạn chưa thuộc doanh nghiệp nào. Tìm hồ sơ có sẵn để nhận quản lý, hoặc tạo hồ sơ mới.</p>}
        {state.invitations.map(item => <div key={item.id} className="us-session"><span><strong>Lời mời: {item.name}</strong><small>{item.membership.roles.map(role => permissionLabel[role]).join(', ')}</small></span><button type="button" disabled={pending} onClick={() => confirm('Tham gia doanh nghiệp?', `Tham gia ${item.name} với quyền đã được mời.`, { action: 'accept', organizationId: item.id })}>Chấp nhận</button></div>)}
      </>}
    </SettingsBlock>
    {org && <>
      <SettingsBlock title={`Vai trò của ${org.name}`} description="Chỉ owner / admin được thay đổi vai trò khai báo của doanh nghiệp. Vai trò xác minh do nền tảng quản lý."><RoleChoices value={orgRoles} onChange={setOrgRoles} disabled={pending || !org.permissions.roles} /><p className="us-note">Đã xác nhận: {org.confirmedRoles.length ? org.confirmedRoles.map(roleLabel).join(', ') : 'Chưa có vai trò xác nhận'}</p><button type="button" disabled={pending || !org.permissions.roles || !orgRoles.length} onClick={() => confirm('Cập nhật vai trò doanh nghiệp?', 'Thay đổi áp dụng cho cùng một doanh nghiệp, không tạo hồ sơ mới hoặc cấp thêm quyền membership.', { action: 'roles', roles: orgRoles })}>Lưu vai trò doanh nghiệp</button></SettingsBlock>
      <SettingsBlock title="Thành viên & quyền truy cập" description="Quyền được kiểm tra trên server. Vai trò Supplier / Buyer không tự cấp quyền admin.">{!details ? <p role="status">Đang tải thành viên…</p> : <div className="us-members">{details.members.filter(member => member.status !== 'LEFT').map(member => <div key={member.user_id}><span><strong>{member.name}</strong><small>{member.roles.map(role => permissionLabel[role]).join(', ')} · {member.status === 'INVITED' ? 'Đã mời' : 'Đang tham gia'}</small></span>{org.permissions.members && !member.roles.includes('owner') && member.status === 'ACTIVE' && <select aria-label={`Đổi quyền ${member.name}`} disabled={pending} value={member.roles.length === 1 ? member.roles[0] : ''} onChange={event => confirm('Đổi quyền thành viên?', `Gán quyền ${permissionLabel[event.target.value]} cho ${member.name}. Server sẽ kiểm tra lại quyền của bạn.`, { action: 'member', targetUserId: member.user_id, roles: [event.target.value] })}><option value="" disabled>Nhiều quyền</option>{MEMBER_ROLES.filter(role => role !== 'owner').map(role => <option key={role} value={role}>{permissionLabel[role]}</option>)}</select>}{org.permissions.transfer && !member.roles.includes('owner') && member.status === 'ACTIVE' && <button type="button" disabled={pending} onClick={() => confirm('Chuyển quyền sở hữu?', `Chuyển quyền sở hữu cho ${member.name}. Bạn sẽ trở thành admin của doanh nghiệp này.`, { action: 'transfer', targetUserId: member.user_id })}>Chuyển chủ sở hữu</button>}</div>)}</div>}
        {org.permissions.members ? <form className="us-inline-form" onSubmit={event => { event.preventDefault(); confirm('Mời thành viên?', 'Mời tài khoản email đã đăng ký. Người nhận phải chấp nhận; chưa gửi email tự động.', { action: 'invite', ...invite }); }}><label>Email tài khoản đã đăng ký<input type="email" required value={invite.email} onChange={event => setInvite(previous => ({ ...previous, email: event.target.value }))} /></label><label>Quyền thành viên<select value={invite.roles[0]} onChange={event => setInvite(previous => ({ ...previous, roles: [event.target.value] }))}>{MEMBER_ROLES.filter(role => role !== 'owner').map(role => <option key={role} value={role}>{permissionLabel[role]}</option>)}</select></label><button disabled={pending}>Mời tham gia</button></form> : <p className="us-note"><LockKeyhole />Chỉ owner / admin được quản lý thành viên.</p>}
      </SettingsBlock>
      <SettingsBlock title="Cơ sở & nhà máy" description="Cơ sở thuộc doanh nghiệp đang chọn, không tạo Organization riêng.">{details?.facilities.length ? <div className="us-records">{details.facilities.map(item => <div key={item.id}><strong>{item.name}</strong><small>{item.province || 'Chưa cập nhật địa phương'}</small></div>)}</div> : <p className="us-empty">Chưa có cơ sở.</p>}{org.permissions.facilities ? <form className="us-inline-form" onSubmit={event => { event.preventDefault(); run({ action: 'facility', ...facility }); }}><label>Tên cơ sở<input required minLength={2} maxLength={200} value={facility.name} onChange={event => setFacility(previous => ({ ...previous, name: event.target.value }))} /></label><label>Tỉnh / thành phố<input maxLength={200} value={facility.province} onChange={event => setFacility(previous => ({ ...previous, province: event.target.value }))} /></label><button disabled={pending}>Thêm cơ sở nháp</button></form> : <p className="us-note"><LockKeyhole />Cần quyền owner, admin hoặc editor để thêm cơ sở.</p>}</SettingsBlock>
      <SettingsBlock title="Rời / lưu trữ doanh nghiệp"><div className="us-lifecycle"><button type="button" disabled={pending} onClick={() => confirm('Rời doanh nghiệp?', 'Mất quyền truy cập doanh nghiệp này. Chủ sở hữu duy nhất phải chuyển quyền trước.', { action: 'leave' })}>Rời doanh nghiệp</button><button type="button" className="us-danger" disabled={pending || !org.permissions.archive} onClick={() => confirm('Lưu trữ doanh nghiệp?', 'Ẩn hồ sơ khỏi hoạt động và ngăn thay đổi. Không xóa tài khoản cá nhân hay dữ liệu doanh nghiệp.', { action: 'archive' })}>Lưu trữ doanh nghiệp</button></div></SettingsBlock>
    </>}
    <SettingsBlock title="Tìm & nhận quản lý doanh nghiệp" description="Tìm theo tên hoặc mã số thuế trước khi tạo. Nhận quản lý luôn cần xét duyệt, không tự cấp owner."><form className="us-search" onSubmit={search}><label className="sr-only" htmlFor="us-company-search">Tên hoặc mã số thuế</label><input id="us-company-search" minLength={2} maxLength={100} required placeholder="Tên doanh nghiệp hoặc mã số thuế" value={query} onChange={event => setQuery(event.target.value)} /><button disabled={pending || !state?.schemaReady}>Tìm hồ sơ</button></form>{results && (results.length ? <div className="us-records">{results.map(item => <div key={item.id}><span><strong>{item.name}</strong><small>{item.roles.map(roleLabel).join(', ')}</small></span><button type="button" disabled={pending} onClick={() => confirm('Yêu cầu nhận quản lý?', `Gửi yêu cầu quản lý ${item.name}. Không cấp quyền trước khi xác minh.`, { action: 'claim', organizationId: item.id })}>Nhận quản lý</button></div>)}</div> : <p className="us-note">Không thấy hồ sơ công khai phù hợp. Server sẽ kiểm tra trùng lại khi tạo.</p>)}
      <details><summary>Tạo doanh nghiệp chưa có hồ sơ</summary><form onSubmit={event => { event.preventDefault(); confirm('Tạo hồ sơ doanh nghiệp?', 'Kiểm tra trùng bằng tên, mã số thuế, website. Hồ sơ mới là nháp, chưa được xác minh hoặc công bố.', { action: 'create', ...company }); }}><div className="us-fields">{[['name', 'Tên pháp lý'], ['taxCode', 'Mã số thuế'], ['website', 'Website']].map(([key, title]) => <label key={key}>{title}<input required={key === 'name'} minLength={key === 'name' ? 2 : undefined} maxLength={200} value={company[key]} onChange={event => setCompany(previous => ({ ...previous, [key]: event.target.value }))} /></label>)}</div><RoleChoices value={company.roles} onChange={roles => setCompany(previous => ({ ...previous, roles }))} /><button type="submit" className="us-primary" disabled={pending || !state?.schemaReady || !company.roles.length}>Tạo hồ sơ nháp</button></form></details>
    </SettingsBlock>
  </>;
}
