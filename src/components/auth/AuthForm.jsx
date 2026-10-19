import React, { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Building2, Factory, Package, Landmark, Handshake, ArrowRight, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import BrandLogo from '../BrandLogo.jsx';
import { authAction } from '../../services/authSession.js';
import { supabase } from '../../services/supabaseAuth.js';
import './AuthExperience.css';

function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.61 4.61 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z" /><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.92V7.49H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.51l3.34-2.59Z" /><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.61 9.61 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59A5.99 5.99 0 0 1 12 5.96Z" /></svg>;
}
const ROLES = [
  { id: 'supplier', label: 'Nhà cung ứng', icon: Package },
  { id: 'factory', label: 'Nhà máy', icon: Factory },
  { id: 'kcn', label: 'Khu công nghiệp', icon: Building2 },
  { id: 'association', label: 'Hiệp hội', icon: Landmark },
  { id: 'partner', label: 'Dịch vụ / Đối tác', icon: Handshake },
];
export default function AuthForm({ initialTab = 'login', onSuccess }) {
  const id = useId();
  const [mode, setMode] = useState(['register', 'password'].includes(initialTab) ? initialTab : 'login');
  const [values, setValues] = useState({ email: '', password: '', fullName: '', companyName: '', role: 'supplier', roles: ['supplier'] });
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState({ google: true, zalo: true });
  const customerEntry = mode === 'login' || mode === 'register';
  useEffect(() => {
    if (initialTab === 'password') return;
    const controller = new AbortController();
    fetch('/api/auth/providers', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then(async response => {
        const body = await response.json();
        if (!response.ok || !body.success) throw new Error();
        return body.data;
      }).then(data => {
        if (data && typeof data === 'object') setProviders(data);
      }).catch(() => {
        // Giữ nguyên active trên môi trường static hosting
      });
    return () => controller.abort();
  }, [initialTab]);
  const changeMode = next => {
    setMode(next); setError(''); setMessage(''); setShowPassword(false);
    setValues(v => ({ ...v, password: '' }));
  };
  const toggleRole = roleId => setValues(v => {
    const roles = v.roles.includes(roleId) ? (v.roles.length > 1 ? v.roles.filter(r => r !== roleId) : v.roles) : [...v.roles, roleId];
    return { ...v, roles, role: roles[0] };
  });
  async function submit(event) {
    event.preventDefault(); setBusy('email'); setError(''); setMessage('');
    try {
      const result = await authAction(mode === 'forgot' ? 'forgot-password' : mode, values);
      setValues(v => ({ ...v, password: '' })); setShowPassword(false);
      if (result.data || mode === 'password') {
        setMessage(mode === 'password' ? 'Đã cập nhật mật khẩu.' : 'Đã đăng nhập.');
        onSuccess?.(result.data);
      } else setMessage(result.message || 'Vui lòng kiểm tra email để tiếp tục.');
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }
  async function socialLogin(provider) {
    setBusy(provider); setError(''); setMessage('');
    try {
      const next = new URLSearchParams(window.location.search).get('next') || '/tai-khoan';
      let targetUrl = '';
      try {
        const result = await authAction('oauth/start', { provider, next, role: values.role });
        if (result?.data?.url) targetUrl = result.data.url;
      } catch {
        // Fallback trực tiếp cho hosting tĩnh iNET khi server API không phản hồi
        if (provider === 'google') {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + next }
          });
          if (error) throw error;
          if (data?.url) targetUrl = data.url;
        } else if (provider === 'zalo') {
          targetUrl = window.location.origin + '/zalo-login.php';
        }
      }
      if (!targetUrl) {
        if (provider === 'zalo') targetUrl = window.location.origin + '/zalo-login.php';
        else throw new Error('Chưa mở được trang xác thực. Vui lòng thử lại.');
      }
      window.location.assign(targetUrl);
    } catch (err) { setError(err.message); setBusy(''); }
  }
  const titles = { login: 'Chào mừng bạn trở lại', register: 'Kết nối doanh nghiệp của bạn', forgot: 'Lấy lại mật khẩu', password: 'Đặt mật khẩu mới' };
  const descriptions = { login: 'Đăng nhập để tiếp tục các kết nối và công việc của bạn.', register: 'Tạo tài khoản để bắt đầu tham gia hệ sinh thái.', forgot: 'Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.', password: 'Tạo mật khẩu mới có ít nhất 10 ký tự.' };
  return (
    <section className={'ccu-entry-form ccu-entry-form--' + mode} aria-labelledby={id + '-title'}>
      <div className="ccu-entry-form-brand"><BrandLogo size="sm" /></div>
      {customerEntry && <div className="ccu-entry-tabs" role="group" aria-label="Chọn đăng nhập hoặc đăng ký">
        <button type="button" disabled={!!busy} aria-pressed={mode === 'login'} onClick={() => changeMode('login')}>Đăng nhập</button>
        <button type="button" disabled={!!busy} aria-pressed={mode === 'register'} onClick={() => changeMode('register')}>Đăng ký doanh nghiệp</button>
      </div>}
      <header className="ccu-entry-form-heading"><h2 id={id + '-title'}>{titles[mode]}</h2><p>{descriptions[mode]}</p></header>
      {customerEntry && <>
        <div className="ccu-entry-social" aria-label="Đăng nhập nhanh">
          {['google', 'zalo'].map(provider => <button type="button" key={provider} disabled={!!busy} onClick={() => socialLogin(provider)}>
            <span className="ccu-entry-provider-mark" aria-hidden="true">{provider === 'google' ? <GoogleMark /> : <span className="ccu-entry-zalo">Zalo</span>}</span>
            <span>{busy === provider ? 'Đang kết nối…' : provider === 'google' ? 'Google' : 'Zalo'}</span>
          </button>)}
        </div>
        <div className="ccu-entry-divider"><span>{mode === 'register' ? 'hoặc đăng ký bằng email' : 'hoặc đăng nhập bằng email'}</span></div>
      </>}
      <form onSubmit={submit} className="ccu-entry-fields" aria-busy={!!busy}>
        {mode === 'register' && <>
          <fieldset className="ccu-entry-roles"><legend>Doanh nghiệp của bạn thuộc nhóm nào?</legend><p>Có thể chọn nhiều nhóm phù hợp.</p><div>
            {ROLES.map(({ id: roleId, label, icon: Icon }) => <button type="button" key={roleId} disabled={!!busy} aria-pressed={values.roles.includes(roleId)} onClick={() => toggleRole(roleId)}><Icon aria-hidden="true" /><span>{label}</span>{values.roles.includes(roleId) && <Check aria-hidden="true" />}</button>)}
          </div></fieldset>
          <div className="ccu-entry-business-fields">
            <div className="ccu-entry-field"><label htmlFor={id + '-fullName'}>Họ và tên <span>*</span></label><div className="ccu-entry-input"><User aria-hidden="true" /><input id={id + '-fullName'} name="fullName" autoComplete="name" required disabled={!!busy} value={values.fullName} placeholder="Họ và tên của bạn" onChange={e => setValues(v => ({ ...v, fullName: e.target.value }))} /></div></div>
            <div className="ccu-entry-field"><label htmlFor={id + '-companyName'}>Doanh nghiệp / tổ chức <span>*</span></label><div className="ccu-entry-input"><Building2 aria-hidden="true" /><input id={id + '-companyName'} name="companyName" autoComplete="organization" required disabled={!!busy} value={values.companyName} placeholder="Tên doanh nghiệp / tổ chức" onChange={e => setValues(v => ({ ...v, companyName: e.target.value }))} /></div></div>
          </div>
        </>}
        {mode !== 'password' && <div className="ccu-entry-field"><label htmlFor={id + '-email'}>Email đăng nhập <span>*</span></label><div className="ccu-entry-input"><Mail aria-hidden="true" /><input id={id + '-email'} name="email" type="email" autoComplete="email" required disabled={!!busy} value={values.email} placeholder="Email của bạn hoặc doanh nghiệp" onChange={e => setValues(v => ({ ...v, email: e.target.value }))} /></div></div>}
        {mode !== 'forgot' && <div className="ccu-entry-field"><div className="ccu-entry-label-row"><label htmlFor={id + '-password'}>{mode === 'password' ? 'Mật khẩu mới' : 'Mật khẩu'} <span>*</span></label>{mode === 'login' && <button type="button" disabled={!!busy} onClick={() => changeMode('forgot')}>Quên mật khẩu?</button>}</div><div className="ccu-entry-input"><Lock aria-hidden="true" /><input id={id + '-password'} name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required disabled={!!busy} value={values.password} placeholder={mode === 'login' ? 'Nhập mật khẩu' : 'Ít nhất 10 ký tự'} minLength={mode !== 'login' ? 10 : undefined} onChange={e => setValues(v => ({ ...v, password: e.target.value }))} /><button className="ccu-entry-eye" type="button" disabled={!!busy} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></div>}
        {error && <p role="alert" className="ccu-entry-notice ccu-entry-notice--error">{error}</p>}
        {message && <p role="status" className="ccu-entry-notice ccu-entry-notice--success">{message}</p>}
        <button type="submit" disabled={!!busy} className="ccu-entry-submit"><span>{busy === 'email' ? 'Đang xử lý…' : mode === 'register' ? 'Tạo tài khoản doanh nghiệp' : mode === 'forgot' ? 'Gửi liên kết đặt lại mật khẩu' : mode === 'password' ? 'Lưu mật khẩu mới' : 'Đăng nhập'}</span><ArrowRight aria-hidden="true" /></button>
        {mode === 'forgot' && <button type="button" disabled={!!busy} className="ccu-entry-back" onClick={() => changeMode('login')}><ArrowLeft />Quay lại đăng nhập</button>}
      </form>
      <div className="ccu-entry-security"><ShieldCheck aria-hidden="true" /><span>Thông tin đăng nhập được bảo mật an toàn. Không chia sẻ mật khẩu hoặc mã xác nhận.</span></div>
      {customerEntry && <p className="ccu-entry-legal">Bằng cách tiếp tục, bạn đồng ý với <Link to="/phap-ly/thoa-thuan-dich-vu-b2b">Điều khoản dịch vụ</Link> và <Link to="/phap-ly/chinh-sach-bao-mat-du-lieu">Chính sách bảo mật</Link>.</p>}
    </section>
  );
}
