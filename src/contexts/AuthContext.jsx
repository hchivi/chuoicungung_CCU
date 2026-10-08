import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { authSnapshot, subscribeAuth, restoreAuthSession } from '../services/authSession.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribeAuth, authSnapshot, authSnapshot);
  useEffect(() => {
    if (authSnapshot().loading) restoreAuthSession().catch(() => {});
    const refresh = () => { if (authSnapshot().identity) restoreAuthSession().catch(() => {}); };
    const timer = setInterval(refresh, 50 * 60 * 1000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  return <AuthContext.Provider value={session}><React.Fragment key={session.identity?.user.id || 'guest'}>{children}</React.Fragment></AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider is required'); return value; }
