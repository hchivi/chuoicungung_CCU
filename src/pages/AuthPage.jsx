import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Building2, Calendar, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authAction, restoreAuthSession, emitAuth } from '../services/authSession.js';
import { supabase, mapUser } from '../services/supabaseAuth.js';
import BrandLogo from '../components/BrandLogo.jsx';
import AuthForm from '../components/auth/AuthForm.jsx';
import AccountSettings from '../components/auth/AccountSettings.jsx';

const HIGHLIGHTS = [
  {
    icon: FileText,
    title: 'Lưu nhu cầu và kết quả matching',
    desc: 'Quản lý nhu cầu, theo dõi kết quả kết nối phù hợp.'
  },
  {
    icon: Building2,
    title: 'Quản lý hồ sơ doanh nghiệp',
    desc: 'Cập nhật thông tin, năng lực, sản phẩm dịch vụ.'
  },
  {
    icon: Calendar,
    title: 'Tham gia sự kiện & kết nối 1:1',
    desc: 'Tiếp cận đối tác tại các sự kiện, hội thảo, ngày hội.'
  },
  {
    icon: Share2,
    title: 'Đồng bộ hỗ trợ từ SUPPI & CHAINY',
    desc: 'Nhận tư vấn, kết nối và hỗ trợ trong suốt hành trình.'
  }
];

export default function AuthPage() {
  const session = useAuth(), location = useLocation(), navigate = useNavigate();
  const [recovery, setRecovery] = useState(false), [error, setError] = useState('');
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (window.location.hash.includes('access_token=')) {
      handled.current = true;
      const tokens = new URLSearchParams(window.location.hash.slice(1));
      const type = tokens.get('type'), input = { access_token: tokens.get('access_token'), refresh_token: tokens.get('refresh_token') };
      if (type === 'recovery') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        authAction('recovery', input).then(() => setRecovery(true)).catch(err => setError(err.message));
        return;
      }
      restoreAuthSession();
      return;
    }
    if (window.location.search.includes('code=')) {
      handled.current = true;
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (state?.startsWith('zalo_')) {
        window.location.replace('/zalo-callback.php' + window.location.search);
        return;
      }

      supabase.auth.exchangeCodeForSession(code).then(({ data }) => {
        if (data?.session?.user) {
          const identity = { user: mapUser(data.session.user), role: null };
          emitAuth(identity);
          try { localStorage.setItem('ccu_session_data', JSON.stringify(identity)); } catch {}
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          restoreAuthSession();
        }
      }).catch(() => {
        restoreAuthSession();
      });
      return;
    }
  }, []);

  const success = identity => {
    if (recovery) { setRecovery(false); return; }
    const next = new URLSearchParams(location.search).get('next');
    navigate(next?.startsWith('/') && !next.startsWith('//') && !/[\\\x00-\x20]|%(?:2f|5c|0[ad])/i.test(next) ? next : identity?.role ? '/admin' : '/tai-khoan', { replace: true });
  };

  const accountPage = location.pathname === '/tai-khoan' || location.pathname === '/tai-khoan/cai-dat';
  const oauthFailed = new URLSearchParams(location.search).get('oauth_error') === 'failed';
  if (accountPage) return <AccountSettings session={session} />;

  return (
    <main className="ccu-entry-page">
      <div className="ccu-entry-layout">
        <aside className="ccu-entry-story" aria-label="Hệ sinh thái Chuỗi Cung Ứng">
          <div className="ccu-entry-story-content">
            <BrandLogo size="md" />
            <h1>Đúng đối tác.<br />Thêm cơ hội hợp tác.</h1>
            <p className="ccu-entry-intro">Kết nối nhà máy, nhà cung ứng và tổ chức trên cùng một nền tảng.</p>
            <div className="ccu-entry-benefits">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <div key={title}><span><Icon aria-hidden="true" /></span><div><h3>{title}</h3><p>{desc}</p></div></div>
              ))}
            </div>
            <p className="ccu-entry-audience">Dành cho nhà máy, nhà cung ứng, khu công nghiệp, hiệp hội và đối tác dịch vụ.</p>
          </div>
          <figure className="ccu-entry-photo"><img src="/images/smart_factory_hero.jpg" alt="Không gian sản xuất và vận hành nhà máy" width="1200" height="675" /><figcaption>Từ nhu cầu thực tế đến kết nối phù hợp.</figcaption></figure>
        </aside>
        <div className="ccu-entry-form-column">
          {(error || oauthFailed) && <div role="alert" className="ccu-entry-notice ccu-entry-notice--error">{error || 'Chưa hoàn tất đăng nhập nhanh. Phiên có thể đã hết hạn hoặc chưa được cấu hình. Vui lòng thử lại hoặc dùng email.'}</div>}
          <AuthForm key={recovery ? 'recovery' : location.pathname} initialTab={recovery ? 'password' : location.pathname === '/dang-ky' ? 'register' : 'login'} onSuccess={success} />
          <p className="ccu-entry-help">Cần hỗ trợ? <a href="mailto:hotro@chuoicungung.com">hotro@chuoicungung.com</a></p>
        </div>
      </div>
    </main>
  );
}
