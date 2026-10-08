import { createClient } from '@supabase/supabase-js';
import { AssistantError } from '../assistants/difyClient.js';
import { databaseResult, requireDatabase } from '../storage/supabaseRepository.js';

export const STAFF_ROLES = new Set(['admin', 'moderator', 'viewer']);
export const readCookies = req => Object.fromEntries(String(req.headers?.cookie || '').split(';').map(part => part.trim().split(/=(.*)/s).slice(0, 2)).filter(([key, value]) => key && value));
const denied = () => new AssistantError('AUTH_REQUIRED', 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.', 401);
const safeUser = user => ({ id: user.id, email: user.email, fullName: String(user.user_metadata?.full_name || '').slice(0, 200), companyName: String(user.user_metadata?.company_name || '').slice(0, 200) });
const cookieOptions = { httpOnly: true, sameSite: 'strict', path: '/api' };
export function setAuthCookies(res, session) {
  const options = { ...cookieOptions, secure: process.env.NODE_ENV === 'production' };
  res.cookie('ccu_access', session.access_token, { ...options, maxAge: Math.min(session.expires_in || 3600, 3600) * 1000 });
  res.cookie('ccu_refresh', session.refresh_token, { ...options, maxAge: 30 * 86400 * 1000 });
}
export function clearAuthCookies(res) {
  for (const name of ['ccu_access', 'ccu_refresh', 'ccu_session_v2']) res.clearCookie(name, { ...cookieOptions, secure: process.env.NODE_ENV === 'production' });
}
function authError(error, fallback = 'AUTH_FAILED') {
  if (error?.status === 429) return new AssistantError('AUTH_RATE_LIMITED', 'Quá nhiều yêu cầu xác thực. Vui lòng thử lại sau.', 429);
  if (error?.status >= 500) return new AssistantError('AUTH_UNAVAILABLE', 'Dịch vụ xác thực đang gián đoạn. Vui lòng thử lại sau.', 503);
  return new AssistantError(fallback, fallback === 'AUTH_INVALID_CREDENTIALS' ? 'Email hoặc mật khẩu không đúng, hoặc email chưa được xác nhận.' : 'Chưa hoàn tất xác thực. Vui lòng kiểm tra thông tin hoặc thử lại sau.', 400);
}
export function createAuthService({ client, authClientFactory = () => {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!process.env.SUPABASE_URL || !key) throw new AssistantError('AUTH_NOT_CONFIGURED', 'Backend chưa cấu hình public key cho Supabase Auth.', 503);
  return createClient(process.env.SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
} } = {}) {
  const roleFor = async id => {
    requireDatabase(client);
    const { data } = await databaseResult(client.from('ccu_staff_roles').select('role,enabled').eq('user_id', id).maybeSingle());
    return data?.enabled && STAFF_ROLES.has(data.role) ? data.role : null;
  };
  const verified = async token => {
    requireDatabase(client);
    let result;
    try { result = await client.auth.getUser(token); } catch { throw new AssistantError('AUTH_UNAVAILABLE', 'Chưa xác minh được phiên đăng nhập.', 503); }
    if (result.error) {
      if (result.error.status >= 500) throw authError(result.error);
      throw denied();
    }
    if (!result.data?.user?.id || !result.data.user.email_confirmed_at) throw denied();
    const user = result.data.user;
    return { user: safeUser(user), role: await roleFor(user.id) };
  };
  const credentials = (input, registering = false) => {
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof input.password !== 'string' || input.password.length < (registering ? 10 : 1) || input.password.length > 128) throw new AssistantError('AUTH_VALIDATION', 'Nhập email hợp lệ; mật khẩu mới cần từ 10 đến 128 ký tự.', 400);
    return { email, password: input.password };
  };
  return {
    async identify(req) { const token = readCookies(req).ccu_access; if (!token) return null; return verified(token); },
    async session(req, res) {
      const cookies = readCookies(req);
      if (!cookies.ccu_access && !cookies.ccu_refresh) return null;
      try { if (cookies.ccu_access) return await verified(cookies.ccu_access); }
      catch (error) { if (error.code !== 'AUTH_REQUIRED') throw error; }
      if (!cookies.ccu_refresh) { clearAuthCookies(res); throw denied(); }
      const { data, error } = await authClientFactory().auth.refreshSession({ refresh_token: cookies.ccu_refresh });
      if (error || !data?.session) { clearAuthCookies(res); throw denied(); }
      const identity = await verified(data.session.access_token);
      setAuthCookies(res, data.session);
      return identity;
    },
    async login(input) {
      const { data, error } = await authClientFactory().auth.signInWithPassword(credentials(input));
      if (error || !data?.session) throw authError(error, 'AUTH_INVALID_CREDENTIALS');
      return { identity: await verified(data.session.access_token), session: data.session };
    },
    async register(input) {
      const payload = credentials(input, true);
      const { data, error } = await authClientFactory().auth.signUp({ ...payload, options: { data: { full_name: String(input.fullName || '').trim().slice(0, 200), company_name: String(input.companyName || '').trim().slice(0, 200) } } });
      if (error) throw authError(error);
      return data?.session ? { identity: await verified(data.session.access_token), session: data.session } : { identity: null, session: null };
    },
    async claimAnonymous(ownerId, userId) {
      if (!ownerId?.startsWith('ccu_')) return;
      await databaseResult(client.rpc('ccu_claim_anonymous', { p_old_owner: ownerId, p_user: userId }));
    },
    async logout(req, res) {
      const token = readCookies(req).ccu_access;
      clearAuthCookies(res);
      if (token) {
        const { error } = await client.auth.admin.signOut(token, 'local');
        if (error && ![401, 403, 404].includes(error.status)) throw authError(error);
      }
    },
    async forgotPassword(email) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new AssistantError('AUTH_VALIDATION', 'Nhập email hợp lệ.', 400);
      const site = process.env.SITE_URL || 'http://localhost:3000';
      const { error } = await authClientFactory().auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${site.replace(/\/$/, '')}/dang-nhap?recovery=1` });
      if (error) throw authError(error);
    },
    async acceptRecovery(input) {
      if (typeof input.access_token !== 'string' || typeof input.refresh_token !== 'string' || input.access_token.length > 10000 || input.refresh_token.length > 10000) throw denied();
      const identity = await verified(input.access_token);
      return { identity, session: { access_token: input.access_token, refresh_token: input.refresh_token, expires_in: 3600 } };
    },
    async changePassword(req, password) {
      if (typeof password !== 'string' || password.length < 10 || password.length > 128) throw new AssistantError('AUTH_VALIDATION', 'Mật khẩu mới cần từ 10 đến 128 ký tự.', 400);
      const cookies = readCookies(req); await verified(cookies.ccu_access);
      const isolated = authClientFactory();
      const { error: sessionError } = await isolated.auth.setSession({ access_token: cookies.ccu_access, refresh_token: cookies.ccu_refresh });
      if (sessionError) throw denied();
      const { data, error } = await isolated.auth.updateUser({ password });
      if (error || !data?.user) throw authError(error);
      const { data: current } = await isolated.auth.getSession();
      return current?.session;
    }
  };
}

export const identifyAccount = service => async (req, res, next) => {
  try { req.authIdentity = await service.identify(req); next(); } catch (error) { next(error); }
};
export const requireStaff = (service, allowed = [...STAFF_ROLES]) => async (req, res, next) => {
  try {
    req.authIdentity = await service.identify(req);
    if (!req.authIdentity) throw denied();
    if (!allowed.includes(req.authIdentity.role)) throw new AssistantError('FORBIDDEN', 'Tài khoản chưa được cấp quyền thực hiện thao tác quản trị này.', 403);
    next();
  } catch (error) { next(error); }
};
