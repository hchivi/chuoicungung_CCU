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
    navigate(next?.startsWith('/') && !next.startsWith('//') && !/[\\\x00-\x20]|%(?:2f|5c|0[ad])/i.test(next) ? next : identity?.role ? '/admin' : '/tai-khoan', { replace: true });
  };
  async function logout() { try { await authAction('logout'); } catch (err) { setError(err.message); } }
  const accountPage = location.pathname === '/tai-khoan';
  const oauthFailed = new URLSearchParams(location.search).get('oauth_error') === 'failed';
  return <section className="ccu-auth-page"><div className="ccu-auth-page-panel">
    {(error || session.error || oauthFailed) && <p role="alert" className="ccu-auth-notice ccu-auth-notice--error">{error || session.error || 'Chưa hoàn tất đăng nhập nhanh. Phiên có thể đã hết hạn hoặc chưa được cấu hình. Vui lòng thử lại hoặc dùng email.'}</p>}
    {recovery ? <AuthForm initialTab="password" onSuccess={success} /> : accountPage && session.loading ? <p role="status">Đang kiểm tra phiên đăng nhập…</p> : accountPage && session.identity ? <div className="ccu-auth ccu-auth-account">
      <h1>Tài khoản của bạn</h1><p className="ccu-auth-account-email">{session.identity.user.email}</p>
      <p>{session.identity.role ? `Quyền quản trị: ${session.identity.role}` : 'Tài khoản doanh nghiệp — dữ liệu riêng được gắn với tài khoản của bạn.'}</p>
      <div className="ccu-auth-account-actions">{session.identity.role && <Link className="ccu-auth-submit" to="/admin">Vào quản trị →</Link>}<button className="ccu-auth-secondary" onClick={logout}>Đăng xuất</button></div>
      <details className="ccu-auth-password-settings"><summary>Thay đổi mật khẩu</summary><AuthForm initialTab="password" /></details>
    </div> : <>
      {session.identity && <div className="ccu-auth-session-note">Bạn đang đăng nhập. <Link to="/tai-khoan">Quản lý tài khoản →</Link></div>}
      <AuthForm key={location.pathname} initialTab={location.pathname === '/dang-ky' ? 'register' : 'login'} onSuccess={success} />
    </>}
  </div></section>;
}
