import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authAction } from '../services/authSession.js';
import AuthForm from '../components/auth/AuthForm.jsx';
export default function AuthPage() {
  const session = useAuth(), location = useLocation(), navigate = useNavigate();
  const [recovery, setRecovery] = useState(false), [error, setError] = useState('');
  const handled = useRef(false);
  useEffect(() => {
    if (handled.current || !window.location.hash.includes('access_token=')) return;
    handled.current = true;
    const tokens = new URLSearchParams(window.location.hash.slice(1));
    const type = tokens.get('type'), input = { access_token: tokens.get('access_token'), refresh_token: tokens.get('refresh_token') };
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    if (type !== 'recovery') { setError('Email đã được xác nhận. Vui lòng đăng nhập bằng mật khẩu.'); return; }
    authAction('recovery', input).then(() => setRecovery(true)).catch(err => setError(err.message));
  }, []);
  const success = identity => {
    if (recovery) { setRecovery(false); return; }
    const next = new URLSearchParams(location.search).get('next');
    navigate(next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : identity?.role ? '/admin' : '/dang-nhap', { replace: true });
  };
  async function logout() { try { await authAction('logout'); } catch (err) { setError(err.message); } }
  return <section className="mx-auto max-w-xl px-5 py-16"><div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
    {error && <p role="alert" className="mb-5 text-red-800">{error}</p>}
    {session.error && <p role="alert" className="mb-5 text-red-800">{session.error}</p>}
    {session.loading ? <p role="status">Đang kiểm tra phiên đăng nhập…</p> : recovery ? <AuthForm initialTab="password" onSuccess={success} /> : session.identity ? <>
      <h1 className="text-2xl font-bold text-[#183e30]">Tài khoản của bạn</h1><p className="mt-4 break-words">{session.identity.user.email}</p>
      <p className="mt-2 text-sm text-slate-600">{session.identity.role ? `Quyền quản trị: ${session.identity.role}` : 'Tài khoản doanh nghiệp — dữ liệu riêng được gắn với tài khoản của bạn.'}</p>
      <div className="mt-6 flex flex-wrap gap-4">{session.identity.role && <Link className="rounded-lg bg-emerald-800 px-4 py-3 font-semibold text-white" to="/admin">Vào quản trị</Link>}<button className="rounded-lg border border-slate-300 px-4 py-3" onClick={logout}>Đăng xuất</button></div>
      <div className="mt-10 border-t pt-7"><AuthForm initialTab="password" /></div>
    </> : <AuthForm key={location.pathname} initialTab={location.pathname === '/dang-ky' ? 'register' : 'login'} onSuccess={success} />}
  </div></section>;
}
