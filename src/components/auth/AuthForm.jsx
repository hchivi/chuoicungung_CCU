import React, { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo.jsx';
import { authAction } from '../../services/authSession.js';
import './CustomerAuth.css';

function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.61 4.61 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.92V7.49H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.51l3.34-2.59Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.61 9.61 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59A5.99 5.99 0 0 1 12 5.96Z"/></svg>;
}

export default function AuthForm({ initialTab = 'login', onSuccess }) {
  const id = useId();
  const [mode, setMode] = useState(['register', 'password'].includes(initialTab) ? initialTab : 'login');
  const [values, setValues] = useState({ email: '', password: '', fullName: '', companyName: '' });
  const [busy, setBusy] = useState(''), [error, setError] = useState(''), [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false), [providers, setProviders] = useState(null);
  const customerEntry = mode === 'login' || mode === 'register';
  const labels = { login: 'Đăng nhập Chuỗi Cung Ứng', register: 'Đăng ký doanh nghiệp', forgot: 'Gửi hướng dẫn qua email', password: 'Lưu mật khẩu mới' };
  useEffect(() => {
    if (initialTab === 'password') return;
    const controller = new AbortController();
    fetch('/api/auth/providers', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then(async response => { const body = await response.json(); if (!response.ok || !body.success) throw new Error(); return body.data; })
      .then(setProviders).catch(() => { if (!controller.signal.aborted) setProviders({ google: false, zalo: false }); });
    return () => controller.abort();
  }, [initialTab]);
  const changeMode = next => { setMode(next); setError(''); setMessage(''); setShowPassword(false); setValues(v => ({ ...v, password: '' })); };
  async function submit(event) {
    event.preventDefault(); setBusy('email'); setError(''); setMessage('');
    try {
      const result = await authAction(mode === 'forgot' ? 'forgot-password' : mode, values);
      setValues(v => ({ ...v, password: '' })); setShowPassword(false);
      if (result.data || mode === 'password') { setMessage(mode === 'password' ? 'Đã cập nhật mật khẩu.' : 'Đã đăng nhập.'); onSuccess?.(result.data); }
      else setMessage(result.message || 'Vui lòng kiểm tra email để tiếp tục.');
    } catch (err) { setError(err.message); } finally { setBusy(''); }
  }
  async function socialLogin(provider) {
    setBusy(provider); setError(''); setMessage('');
    try {
      const next = new URLSearchParams(window.location.search).get('next') || '/tai-khoan';
      const result = await authAction('oauth/start', { provider, next });
      if (!result.data?.url) throw new Error('Chưa mở được trang xác thực. Vui lòng thử lại.');
      window.location.assign(result.data.url);
    } catch (err) { setError(err.message); setBusy(''); }
  }
  const field = (key, label, type = 'text', autoComplete = '', placeholder = '') => <div className="ccu-auth-field" key={key}>
    <div className="ccu-auth-field-heading"><label htmlFor={`${id}-${key}`}>{label} <span aria-hidden="true">*</span></label>
      {key === 'password' && mode === 'login' && <button type="button" className="ccu-auth-text-button" disabled={!!busy} onClick={() => changeMode('forgot')}>Quên mật khẩu?</button>}
    </div>
    <div className="ccu-auth-input-wrap"><input id={`${id}-${key}`} required disabled={!!busy} type={key === 'password' && showPassword ? 'text' : type} autoComplete={autoComplete} value={values[key]} placeholder={placeholder}
      minLength={key === 'password' && mode !== 'login' ? 10 : undefined} maxLength={key === 'password' ? 128 : key === 'email' ? 254 : 200}
      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
      {key === 'password' && <button type="button" className="ccu-auth-eye" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword} disabled={!!busy} onClick={() => setShowPassword(v => !v)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.7"/>{showPassword && <path d="m4 3 16 18"/>}</svg>
      </button>}
    </div>
  </div>;
  return <div className={`ccu-auth ccu-auth--${mode}`}>
    <header className="ccu-auth-heading">
      <BrandLogo size="md" />
      <h1>{customerEntry ? 'Cổng Định Danh Chuỗi Cung Ứng' : mode === 'forgot' ? 'Lấy lại quyền truy cập' : 'Đặt mật khẩu mới'}</h1>
      <p>{customerEntry ? 'Kết nối nhà máy, nhà cung ứng và tổ chức trong 18 pha cung ứng.' : mode === 'forgot' ? 'Nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.' : 'Sử dụng mật khẩu riêng, ít nhất 10 ký tự.'}</p>
    </header>
    {customerEntry && <>
      <div className="ccu-auth-tabs" role="group" aria-label="Chọn đăng nhập hoặc đăng ký">
        <button type="button" aria-pressed={mode === 'login'} disabled={!!busy} onClick={() => changeMode('login')}>Đăng nhập</button>
        <button type="button" aria-pressed={mode === 'register'} disabled={!!busy} onClick={() => changeMode('register')}>Đăng ký doanh nghiệp</button>
      </div>
      <section className="ccu-auth-social" aria-label="Đăng nhập nhanh">
        <p className="ccu-auth-social-label">{mode === 'register' ? 'Tạo tài khoản nhanh qua:' : 'Đăng nhập nhanh qua:'}</p>
        <div className="ccu-auth-social-options">{['zalo', 'google'].map(provider => <button type="button" key={provider} className={`ccu-auth-provider ccu-auth-provider--${provider}`} disabled={!!busy} onClick={() => socialLogin(provider)}>
          <span className="ccu-auth-provider-mark" aria-hidden="true">{provider === 'google' ? <GoogleMark /> : <span className="ccu-auth-zalo-mark">Zalo</span>}</span>
          <span><strong>{provider === 'zalo' ? 'Zalo' : 'Google'}</strong><small>{busy === provider ? 'Đang kết nối…' : providers === null ? 'Đang kiểm tra kết nối…' : providers[provider] ? `Tài khoản ${provider === 'zalo' ? 'Zalo' : 'Google'}` : 'Chưa kích hoạt'}</small></span>
        </button>)}</div>
        {providers && (!providers.google || !providers.zalo) && <p className="ccu-auth-provider-note">Phương thức chưa kích hoạt cần được kết nối trước khi sử dụng. Bạn vẫn có thể tiếp tục bằng email.</p>}
      </section>
      <div className="ccu-auth-divider"><span>{mode === 'register' ? 'hoặc đăng ký bằng email' : 'hoặc đăng nhập bằng email'}</span></div>
    </>}
    <form className="ccu-auth-form" onSubmit={submit} aria-busy={!!busy}>
      {mode === 'register' && <div className="ccu-auth-business-fields">{field('fullName', 'Họ và tên', 'text', 'name', 'Họ và tên của bạn')}{field('companyName', 'Doanh nghiệp / tổ chức', 'text', 'organization', 'Tên doanh nghiệp / tổ chức')}</div>}
      {mode !== 'password' && field('email', 'Email đăng nhập', 'email', 'email', 'Email của bạn hoặc email doanh nghiệp')}
      {mode !== 'forgot' && field('password', mode === 'password' ? 'Mật khẩu mới' : 'Mật khẩu', 'password', mode === 'login' ? 'current-password' : 'new-password', mode === 'login' ? 'Nhập mật khẩu' : 'Ít nhất 10 ký tự')}
      {error && <p role="alert" className="ccu-auth-notice ccu-auth-notice--error">{error}</p>}
      {message && <p role="status" className="ccu-auth-notice ccu-auth-notice--success">{message}</p>}
      <button type="submit" disabled={!!busy} className="ccu-auth-submit">{busy === 'email' ? 'Đang xử lý…' : labels[mode]}<span aria-hidden="true">→</span></button>
      {mode === 'register' && <p className="ccu-auth-hint">Xác nhận email để kích hoạt tài khoản. Việc đăng ký không tự cấp xác thực pháp nhân/KYC.</p>}
      {mode === 'login' && <p className="ccu-auth-hint">Thông tin đăng nhập được xác thực an toàn. Không chia sẻ mật khẩu hoặc mã xác nhận.</p>}
      {mode === 'forgot' && <button type="button" className="ccu-auth-text-button ccu-auth-back" disabled={!!busy} onClick={() => changeMode('login')}>← Quay lại đăng nhập</button>}
    </form>
    {mode !== 'password' && <footer className="ccu-auth-footer">Bằng cách tiếp tục, bạn đồng ý với <Link to="/phap-ly/thoa-thuan-dich-vu-b2b">Điều khoản dịch vụ</Link> và <Link to="/phap-ly/chinh-sach-bao-mat-du-lieu">Chính sách bảo mật</Link>.</footer>}
  </div>;
}
