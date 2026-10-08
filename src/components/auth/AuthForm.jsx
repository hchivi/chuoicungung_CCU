import React, { useState } from 'react';
import { authAction } from '../../services/authSession.js';
export default function AuthForm({ initialTab = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialTab === 'register' ? 'register' : initialTab === 'password' ? 'password' : 'login');
  const [values, setValues] = useState({ email: '', password: '', fullName: '', companyName: '' });
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const labels = { login: 'Đăng nhập', register: 'Tạo tài khoản', forgot: 'Nhận hướng dẫn đặt lại mật khẩu', password: 'Lưu mật khẩu mới' };
  const changeMode = next => { setMode(next); setError(''); setMessage(''); setValues(v => ({ ...v, password: '' })); };
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const result = await authAction(mode === 'forgot' ? 'forgot-password' : mode, values);
      setValues(v => ({ ...v, password: '' }));
      if (result.data || mode === 'password') { setMessage(mode === 'password' ? 'Đã cập nhật mật khẩu.' : 'Đã đăng nhập.'); onSuccess?.(result.data); }
      else setMessage(result.message);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const field = (key, label, type = 'text', autoComplete = '') => <label className="block text-sm font-semibold text-slate-700" key={key}>{label}<input required type={type} autoComplete={autoComplete} value={values[key]} minLength={key === 'password' && mode !== 'login' ? 10 : undefined} maxLength={key === 'password' ? 128 : key === 'email' ? 254 : 200} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" /></label>;
  return <div>
    <h1 className="text-2xl font-bold text-[#183e30]">{labels[mode]}</h1>
    <p className="mt-3 mb-6 text-sm leading-relaxed text-slate-600">{mode === 'register' ? 'Lưu nhu cầu và theo dõi biểu mẫu của doanh nghiệp trên cùng một tài khoản. Xác nhận email trước khi đăng nhập.' : mode === 'password' ? 'Sử dụng mật khẩu riêng, ít nhất 10 ký tự.' : 'Đăng nhập để xem dữ liệu riêng của bạn. Quyền quản trị được cấp riêng, không phụ thuộc loại doanh nghiệp.'}</p>
    <form onSubmit={submit} className="space-y-5">
      {mode === 'register' && <>{field('fullName', 'Họ và tên', 'text', 'name')}{field('companyName', 'Tên doanh nghiệp / tổ chức', 'text', 'organization')}</>}
      {mode !== 'password' && field('email', 'Email', 'email', 'email')}
      {mode !== 'forgot' && field('password', mode === 'password' ? 'Mật khẩu mới' : 'Mật khẩu', 'password', mode === 'login' ? 'current-password' : 'new-password')}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-[#006039] px-5 py-3 font-bold text-white disabled:opacity-60">{busy ? 'Đang xử lý…' : labels[mode]}</button>
    </form>
    {mode !== 'password' && <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm font-semibold text-emerald-800">
      <button disabled={busy} onClick={() => changeMode(mode === 'register' || mode === 'forgot' ? 'login' : 'register')}>{mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Quay lại đăng nhập'}</button>
      {mode === 'login' && <button disabled={busy} onClick={() => changeMode('forgot')}>Quên mật khẩu?</button>}
    </div>}
    <p className="mt-6 text-xs leading-relaxed text-slate-500">Tài khoản đăng ký không đồng nghĩa với xác thực pháp nhân/KYC. Chúng tôi không yêu cầu gửi mật khẩu hoặc mã xác nhận qua chat.</p>
  </div>;
}
