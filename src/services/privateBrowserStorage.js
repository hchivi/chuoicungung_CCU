// Compatibility cache only. Authorization always comes from /api/auth/session.
// Unscoped legacy records are left untouched, never adopted by another account.
let identity = null, guest = crypto.randomUUID();
export function setBrowserAccount(next) {
  if (identity?.user?.id && !next?.user?.id) guest = crypto.randomUUID();
  identity = next;
}
export const browserAccountKey = () => identity?.user?.id || guest;
const scoped = key => `ccu-private:${browserAccountKey()}:${key}`;
const sessionKey = key => ['ccu_user_session', 'ccu_user_session_v1'].includes(key);
export const privateBrowserStorage = {
  getItem(key) {
    if (sessionKey(key)) return identity ? JSON.stringify({ id: identity.user.id, userId: identity.user.id, email: identity.user.email, name: identity.user.fullName || '', orgName: identity.user.companyName || '', isLoggedIn: true, isAuthenticated: true, isAdmin: identity.role === 'admin', isZaloLinked: false, isProgramParticipant: false }) : null;
    return localStorage.getItem(scoped(key));
  },
  setItem(key, value) { if (!sessionKey(key)) localStorage.setItem(scoped(key), value); },
  removeItem(key) { if (!sessionKey(key)) localStorage.removeItem(scoped(key)); }
};
