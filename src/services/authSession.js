import { clearPrivateSubmissions, loadPrivateSubmissions } from './submissionService.js';
import { setBrowserAccount } from './privateBrowserStorage.js';
import { supabase, mapUser } from './supabaseAuth.js';

let snapshot = { identity: null, loading: true, error: '' };
let refreshing;
const listeners = new Set();
const emit = value => { snapshot = { ...snapshot, ...value }; setBrowserAccount(snapshot.identity); for (const listener of listeners) listener(); };
export const emitAuth = emit;
export const authSnapshot = () => snapshot;
export const subscribeAuth = listener => { listeners.add(listener); return () => listeners.delete(listener); };

if (typeof window !== 'undefined') {
  try {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const identity = { user: mapUser(session.user), role: null };
        emit({ identity, loading: false, error: '' });
        try { localStorage.setItem('ccu_session_data', JSON.stringify(identity)); } catch {}
      } else if (event === 'SIGNED_OUT') {
        try { localStorage.removeItem('ccu_session_data'); } catch {}
        emit({ identity: null, loading: false, error: '' });
      }
    });
  } catch (e) {
    console.warn('onAuthStateChange init error:', e);
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, { ...options, credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', ...options.headers } });
  let body; try { body = await response.json(); } catch { const err = new Error('Máy chủ chưa trả dữ liệu hợp lệ.'); err.status = response.status; throw err; }
  if (!response.ok || !body.success) { const error = new Error(body.error?.message || 'Chưa hoàn tất thao tác.'); error.status = response.status; throw error; }
  return body;
}

export async function restoreAuthSession() {
  // 1. First check Supabase client session (handles both implicit # and PKCE ?code= automatically)
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const identity = { user: mapUser(session.user), role: null };
      emit({ identity, loading: false, error: '' });
      return identity;
    }
  } catch (err) {
    console.warn('Lỗi kiểm tra phiên Supabase:', err);
  }

  // 2. Check localStorage fallback
  try {
    const saved = localStorage.getItem('ccu_session_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.user) {
        const identity = { user: parsed.user, role: parsed.role || null };
        emit({ identity, loading: false, error: '' });
        return identity;
      }
    }
  } catch {}

  // 3. Fallback to /api/auth/session if available
  if (!refreshing) {
    refreshing = request('/api/auth/session').then(body => {
      if (snapshot.identity?.user.id !== body.data?.user.id) clearPrivateSubmissions();
      emit({ identity: body.data, loading: false, error: '' });
      return body.data;
    }).catch(() => {
      clearPrivateSubmissions();
      emit({ identity: null, loading: false, error: '' });
      return null;
    }).finally(() => { refreshing = null; });
  }
  return refreshing;
}

export async function authAction(action, input = {}) {
  // Handle client-side Supabase authentication on static hosting
  if (action === 'login') {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password
      });
      if (error) throw error;
      if (data?.user) {
        const identity = { user: mapUser(data.user), role: null };
        clearPrivateSubmissions();
        emit({ identity, loading: false, error: '' });
        try { await loadPrivateSubmissions(); } catch {}
        channel?.postMessage('session-changed');
        return { success: true, data: identity };
      }
    } catch (sbErr) {
      try {
        const body = await request(`/api/auth/${action}`, { method: 'POST', body: JSON.stringify(input) });
        clearPrivateSubmissions();
        emit({ identity: body.data || null, loading: false, error: '' });
        if (body.data) { try { await loadPrivateSubmissions(); } catch {} }
        channel?.postMessage('session-changed');
        return body;
      } catch {
        throw new Error(sbErr.message || 'Email hoặc mật khẩu không chính xác.');
      }
    }
  }

  if (action === 'register') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            company_name: input.companyName,
            roles: input.roles,
            role: input.role
          }
        }
      });
      if (error) throw error;
      const identity = data?.user ? { user: mapUser(data.user), role: null } : null;
      if (data?.session && identity) {
        clearPrivateSubmissions();
        emit({ identity, loading: false, error: '' });
      }
      return {
        success: true,
        data: identity,
        message: data?.session ? 'Đã tạo tài khoản.' : 'Vui lòng kiểm tra email để xác nhận tài khoản.'
      };
    } catch (sbErr) {
      try {
        return await request(`/api/auth/${action}`, { method: 'POST', body: JSON.stringify(input) });
      } catch {
        throw new Error(sbErr.message || 'Không thể tạo tài khoản. Vui lòng thử lại.');
      }
    }
  }

  if (action === 'logout' || action === 'logout-all') {
    try { await supabase.auth.signOut(); } catch {}
    try { localStorage.removeItem('ccu_session_data'); } catch {}
    clearPrivateSubmissions();
    emit({ identity: null, loading: false, error: '' });
    channel?.postMessage('session-changed');
    try { await request(`/api/auth/${action}`, { method: 'POST', body: JSON.stringify(input) }); } catch {}
    return { success: true };
  }

  if (action === 'forgot-password') {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: window.location.origin + '/dang-nhap?type=recovery'
      });
      if (error) throw error;
      return { success: true, message: 'Nếu email có tài khoản, hướng dẫn đặt lại mật khẩu sẽ được gửi.' };
    } catch (sbErr) {
      try {
        return await request(`/api/auth/${action}`, { method: 'POST', body: JSON.stringify(input) });
      } catch {
        throw new Error(sbErr.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
      }
    }
  }

  const body = await request(`/api/auth/${action}`, { method: 'POST', body: JSON.stringify(input) });
  if (action === 'settings') {
    if (!snapshot.identity || snapshot.identity.user.id !== body.data?.user.id) throw new Error('Tài khoản đã thay đổi. Vui lòng tải lại trang cài đặt.');
    emit({ identity: body.data, loading: false, error: '' });
    channel?.postMessage('session-changed');
  }
  return body;
}

export async function authenticatedRequest(url, options = {}) {
  if (!url.startsWith('/api/')) throw new Error('Địa chỉ API không hợp lệ.');
  try { return await request(url, options); }
  catch (error) {
    if (error.status !== 401) throw error;
    const identity = await restoreAuthSession(); if (!identity) throw error;
    return request(url, options);
  }
}

const channel = typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('ccu-account') : null;
channel?.addEventListener('message', () => { clearPrivateSubmissions(); emit({ identity: null, loading: true }); restoreAuthSession().catch(() => {}); });
