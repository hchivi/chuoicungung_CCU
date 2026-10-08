import { clearPrivateSubmissions, loadPrivateSubmissions } from './submissionService.js';
import { setBrowserAccount } from './privateBrowserStorage.js';
let snapshot = { identity: null, loading: true, error: '' };
let refreshing;
const listeners = new Set();
const emit = value => { snapshot = { ...snapshot, ...value }; setBrowserAccount(snapshot.identity); for (const listener of listeners) listener(); };
export const authSnapshot = () => snapshot;
export const subscribeAuth = listener => { listeners.add(listener); return () => listeners.delete(listener); };
async function request(url, options = {}) {
  const response = await fetch(url, { ...options, credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', ...options.headers } });
  let body; try { body = await response.json(); } catch { throw new Error('Máy chủ chưa trả dữ liệu hợp lệ.'); }
  if (!response.ok || !body.success) { const error = new Error(body.error?.message || 'Chưa hoàn tất thao tác.'); error.status = response.status; throw error; }
  return body;
}
export function restoreAuthSession() {
  // Supabase refresh tokens rotate: deduplicate concurrent refreshes, including StrictMode.
  if (!refreshing) refreshing = request('/api/auth/session').then(body => {
    if (snapshot.identity?.user.id !== body.data?.user.id) clearPrivateSubmissions();
    emit({ identity: body.data, loading: false, error: '' }); return body.data;
  }).catch(error => {
    clearPrivateSubmissions(); emit({ identity: null, loading: false, error: error.status === 401 ? '' : error.message });
    if (error.status !== 401) throw error;
    return null;
  }).finally(() => { refreshing = null; });
  return refreshing;
}
export async function authAction(action, input = {}) {
  const body = await request(`/api/auth/${action}`, { method: 'POST', body: JSON.stringify(input) });
  if (['login', 'register', 'recovery', 'logout'].includes(action)) {
    clearPrivateSubmissions(); emit({ identity: action === 'logout' ? null : body.data || null, loading: false, error: '' });
    if (action !== 'logout' && body.data) { try { await loadPrivateSubmissions(); } catch (error) { emit({ error: error.message }); } }
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
