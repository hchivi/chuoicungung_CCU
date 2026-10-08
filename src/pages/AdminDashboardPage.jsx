import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authenticatedRequest, authAction } from '../services/authSession.js';

const directories = { enterprises: ['suppliers', 'Nhà cung ứng'], factories: ['factories', 'Nhà máy'], industrial_parks: ['industrialParks', 'Khu công nghiệp'], organizations: ['organizations', 'Hội / tổ chức'], programs: ['programs', 'Chương trình'], catalogues: ['catalogues', 'Catalogue'], categories: ['categories', 'Danh mục ngành'], demands: ['publicRequirements', 'Nhu cầu công khai'] };
const statusNames = { PENDING: 'Chờ rà soát', APPROVED: 'Đã duyệt nội bộ', REJECTED: 'Từ chối', NEED_MORE_INFO: 'Cần bổ sung' };
const kindNames = { programInterest: 'Quan tâm chương trình', programRegistration: 'Đăng ký chương trình', programNotification: 'Nhận thông báo', supplierRegistration: 'Hồ sơ nhà cung ứng', supplierResponse: 'Phản hồi nhu cầu', demand: 'Nhu cầu', serviceRequest: 'Yêu cầu dịch vụ', factoryConnection: 'Kết nối nhà máy', catalogueParticipation: 'Tham gia catalogue', catalogueBusinessRequest: 'Kết nối catalogue' };
const button = 'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 disabled:opacity-40';
const input = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900';
const recordName = row => row.data?.title || row.data?.name || row.name || row.title || row.id;
const date = value => value ? new Date(value).toLocaleString('vi-VN') : '—';
function DetailFields({ data }) {
  if (!data || typeof data !== 'object') return <span>{String(data ?? '—')}</span>;
  return <dl className="space-y-3">{Object.entries(data).map(([key, value]) => <div key={key} className="border-b border-slate-100 pb-3"><dt className="text-xs font-semibold text-slate-500">{key}</dt><dd className="mt-1 break-words whitespace-pre-wrap text-sm text-slate-900">{value && typeof value === 'object' ? <DetailFields data={value} /> : String(value ?? '—')}</dd></div>)}</dl>;
}
function CloudWorkspace({ role, defaultMenu }) {
  const [menu, setMenu] = useState(directories[defaultMenu] || defaultMenu === 'logs' ? defaultMenu : 'inbox');
  const [page, setPage] = useState(1), [query, setQuery] = useState(''), [status, setStatus] = useState('ALL'), [kind, setKind] = useState('ALL');
  const [result, setResult] = useState({ data: [], total: 0 }), [loading, setLoading] = useState(true), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [selected, setSelected] = useState(null), [edit, setEdit] = useState(false), [patch, setPatch] = useState({}), [note, setNote] = useState(''), [reviewStatus, setReviewStatus] = useState('NEED_MORE_INFO'), [saving, setSaving] = useState(false), [reload, setReload] = useState(0);
  const epoch = useRef(0), selectedRef = useRef(null);
  const directory = directories[menu];
  useEffect(() => {
    const version = ++epoch.current; let cancelled = false;
    setLoading(true); setError(''); setResult({ data: [], total: 0 });
    const params = new URLSearchParams({ page, q: query, status, kind });
    const url = menu === 'logs' ? '/api/admin/audit' : directory ? `/api/admin/data/${directory[0]}?${params}` : `/api/admin/submissions?${params}`;
    authenticatedRequest(url).then(body => { if (!cancelled && version === epoch.current) setResult({ data: body.data, total: body.total ?? body.data.length }); }).catch(err => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [menu, page, query, status, kind, reload]);
  useEffect(() => { if (!selected) return; const key = e => { if (e.key === 'Escape' && !saving) setSelected(null); }; document.addEventListener('keydown', key); selectedRef.current?.focus(); return () => document.removeEventListener('keydown', key); }, [selected, saving]);
  const choose = next => { setMenu(next); setPage(1); setQuery(''); setStatus('ALL'); setKind('ALL'); setSelected(null); setNotice(''); };
  function open(row, editing = false) {
    setSelected(row); setEdit(editing); setNote(''); setError('');
    const data = { ...row, ...(row.metadata || {}), ...(row.data || {}) };
    setPatch(Object.fromEntries(['name','title','description','industry','category','province','location','phase','stage','phases','stages'].filter(key => data[key] !== undefined && data[key] !== null).map(key => [key, Array.isArray(data[key]) ? data[key].join(', ') : String(data[key])])));
  }
  async function save(event) {
    event.preventDefault(); setSaving(true); setError('');
    try {
      if (edit) {
        const fields = Object.fromEntries(Object.entries(patch).map(([key, value]) => [key, ['phases', 'stages'].includes(key) ? value.split(',').map(v => v.trim()).filter(Boolean) : value]));
        await authenticatedRequest(`/api/admin/data/${directory[0]}/${encodeURIComponent(selected.id)}`, { method: 'PATCH', body: JSON.stringify({ patch: fields, note, expectedUpdatedAt: selected.updated_at }) });
        setNotice('Đã lưu trên Supabase và làm mới cache phía server. Trang công khai cần tải lại để lấy thay đổi.');
      } else {
        const body = await authenticatedRequest(`/api/admin/submissions/${encodeURIComponent(selected.id)}/review`, { method: 'POST', body: JSON.stringify({ status: reviewStatus, note, expectedUpdatedAt: selected.updated_at }) });
        setNotice(body.message);
      }
      setSelected(null); setReload(value => value + 1);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }
  return <div className="grid min-h-[70vh] gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
    <aside className="rounded-xl border border-slate-200 bg-white p-4 self-start"><p className="mb-4 px-2 text-xs font-bold tracking-widest text-slate-500">ĐIỀU PHỐI & DỮ LIỆU</p><nav aria-label="Quản trị" className="flex flex-wrap gap-1 lg:flex-col">{[['inbox', 'Hộp tiếp nhận'], ...Object.entries(directories).map(([id, value]) => [id, value[1]]), ['logs', 'Nhật ký thao tác']].map(([id, label]) => <button key={id} onClick={() => choose(id)} aria-current={menu === id ? 'page' : undefined} className={`rounded-lg px-3 py-2 text-left text-sm font-semibold ${menu === id ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</button>)}</nav><p className="mt-6 border-t pt-4 text-xs leading-relaxed text-slate-500">Dữ liệu Supabase. Không dùng số liệu mẫu hoặc quyền lựa chọn trên trình duyệt.</p></aside>
    <main className="min-w-0"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-emerald-700">Nguồn dữ liệu: Supabase</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{directory?.[1] || (menu === 'logs' ? 'Nhật ký quản trị' : 'Hộp tiếp nhận')}</h1></div><button className={button} onClick={() => setReload(v => v + 1)}>Tải lại dữ liệu</button></div>
      {!directories[defaultMenu] && !['overview', 'logs'].includes(defaultMenu) && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Màn hình nghiệp vụ cũ chưa nối Supabase. Bạn đang xem hộp tiếp nhận thật; không hiển thị bảng mô phỏng.</p>}
      {notice && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {menu !== 'logs' && <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery(new FormData(e.currentTarget).get('q') || ''); }} className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        {directory ? <><label className="flex-1 text-sm">Tìm tên / tiêu đề<input name="q" className={input} placeholder="Nhập từ khoá" /></label><button className={button}>Tìm</button></> : <>
          <label className="text-sm">Trạng thái<select className={input} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="ALL">Tất cả</option>{Object.entries(statusNames).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          <label className="text-sm">Loại biểu mẫu<select className={input} value={kind} onChange={e => { setKind(e.target.value); setPage(1); }}><option value="ALL">Tất cả</option>{Object.entries(kindNames).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label></>}
      </form>}
      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white" aria-busy={loading}>
        {loading ? <p role="status" className="p-8">Đang tải từ Supabase…</p> : !result.data.length ? <p className="p-8 text-slate-600">{error ? 'Chưa tải được dữ liệu. Vui lòng thử lại.' : 'Không có bản ghi phù hợp.'}</p> : <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">{menu === 'logs' ? 'Thao tác' : 'Hồ sơ / biểu mẫu'}</th><th className="p-4">{menu === 'logs' ? 'Ghi chú' : directory ? 'Cập nhật' : 'Trạng thái'}</th><th className="p-4">{menu === 'logs' ? 'Thời điểm' : 'Thao tác'}</th></tr></thead><tbody>{result.data.map(row => <tr className="border-t border-slate-100 align-top" key={row.id}>
          <td className="max-w-xl p-4"><p className="font-semibold text-slate-900">{menu === 'logs' ? `${row.action} · ${row.entity_type}` : recordName(row)}</p><p className="mt-1 text-xs text-slate-500 break-all">{menu === 'logs' ? row.entity_id : directory ? row.id : `${kindNames[row.kind] || row.kind} · ${date(row.created_at)}`}</p></td>
          <td className="p-4">{menu === 'logs' ? row.note : directory ? date(row.updated_at) : statusNames[row.status] || row.status}</td>
          <td className="p-4">{menu === 'logs' ? date(row.created_at) : <div className="flex flex-wrap gap-2"><button className={button} onClick={() => open(row)}>Chi tiết</button>{directory && role === 'admin' && <button className={button} onClick={() => open(row, true)}>Chỉnh sửa</button>}</div>}</td>
        </tr>)}</tbody></table>}
      </section>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600"><span>{result.total.toLocaleString('vi-VN')} bản ghi · Trang {page}{menu === 'logs' ? ' (100 thao tác gần nhất)' : ''}</span>{menu !== 'logs' && <div className="flex gap-2"><button className={button} disabled={loading || page <= 1} onClick={() => setPage(v => v - 1)}>Trước</button><button className={button} disabled={loading || page * 25 >= result.total} onClick={() => setPage(v => v + 1)}>Sau</button></div>}</div>
    </main>
    {selected && <div className="fixed inset-0 z-[10001] overflow-y-auto bg-black/45 p-4 sm:p-8"><div role="dialog" aria-modal="true" aria-label={edit ? 'Chỉnh sửa nội dung' : 'Chi tiết dữ liệu'} ref={selectedRef} tabIndex={-1} className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-xl outline-none">
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{edit ? 'Chỉnh sửa nội dung' : 'Chi tiết dữ liệu'}</h2><button className={button} disabled={saving} onClick={() => setSelected(null)}>Đóng</button></div>
      <p className="mb-4 break-all text-xs text-slate-500">Mã: {selected.id}</p>
      {edit ? <form onSubmit={save} className="space-y-4"><p className="text-sm text-slate-600">Chỉ sửa nội dung mô tả và phân loại. Hình ảnh, liên hệ và quyền hiển thị được giữ nguyên.</p>{Object.entries(patch).map(([key, value]) => <label key={key} className="block text-sm font-semibold">{key}{key === 'description' ? <textarea className={input} rows={4} value={value} onChange={e => setPatch(v => ({ ...v, [key]: e.target.value }))} /> : <input className={input} value={value} onChange={e => setPatch(v => ({ ...v, [key]: e.target.value }))} />}</label>)}<label className="block text-sm">Lý do thay đổi *<textarea className={input} required maxLength={2000} value={note} onChange={e => setNote(e.target.value)} /></label>{error && <p role="alert" className="text-sm text-red-800">{error}</p>}<button className={button} disabled={saving}>{saving ? 'Đang lưu…' : 'Xác nhận lưu trên Supabase'}</button></form> : <>
        <DetailFields data={selected.data || selected} />
        {!directory && ['admin', 'moderator'].includes(role) && ['PENDING','NEED_MORE_INFO'].includes(selected.status) && <form onSubmit={save} className="mt-6 space-y-4 border-t pt-5"><h3 className="font-bold">Rà soát nội bộ</h3><p className="text-sm text-slate-600">Duyệt không tự công bố dữ liệu hoặc gửi liên hệ cho khách hàng.</p><label className="block text-sm">Kết quả<select className={input} value={reviewStatus} onChange={e => setReviewStatus(e.target.value)}>{['NEED_MORE_INFO','APPROVED','REJECTED'].map(id => <option key={id} value={id}>{statusNames[id]}</option>)}</select></label><label className="block text-sm">Ghi chú bắt buộc<textarea required className={input} maxLength={2000} value={note} onChange={e => setNote(e.target.value)} /></label>{error && <p role="alert" className="text-sm text-red-800">{error}</p>}<button className={button} disabled={saving}>{saving ? 'Đang lưu…' : 'Xác nhận kết quả rà soát'}</button></form>}
      </>}
    </div></div>}
  </div>;
}
export default function AdminDashboardPage({ defaultMenu = 'overview' }) {
  const { identity, loading, error } = useAuth(), location = useLocation();
  const [logoutError, setLogoutError] = useState('');
  if (loading) return <main role="status" className="p-10">Đang xác minh quyền quản trị…</main>;
  if (error) return <main role="alert" className="p-10"><h1>Chưa xác minh được tài khoản</h1><p>{error}</p><Link to="/dang-nhap">Kiểm tra đăng nhập</Link></main>;
  if (!identity) return <Navigate replace to={`/dang-nhap?next=${encodeURIComponent(location.pathname)}`} />;
  if (!['admin','moderator','viewer'].includes(identity.role)) return <main className="mx-auto max-w-2xl p-10"><h1 className="text-2xl font-bold">Tài khoản chưa được cấp quyền quản trị</h1><p className="my-5">Đăng ký doanh nghiệp không tự cấp quyền Admin. Vui lòng liên hệ người quản trị hệ thống.</p><Link to="/dang-nhap">Về tài khoản</Link></main>;
  return <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8"><header className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="font-bold text-emerald-900">CHUỖI CUNG ỨNG · QUẢN TRỊ</p><p className="mt-1 text-sm text-slate-500">{identity.user.email} · {identity.role}</p></div><div className="flex gap-3"><Link className={button} to="/">Xem website</Link><button className={button} onClick={() => authAction('logout').catch(err => setLogoutError(err.message))}>Đăng xuất</button></div></header>{logoutError && <p role="alert" className="mb-5 text-red-800">{logoutError}</p>}<CloudWorkspace key={`${identity.user.id}:${identity.role}:${defaultMenu}`} role={identity.role} defaultMenu={defaultMenu} /></div>;
}
