import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fcllkddudeslshqwldeb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ltwpossmApfznfIixz8XVA_Mpcmim27';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce'
  }
});

export function mapUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    fullName: String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '').slice(0, 200),
    companyName: String(user.user_metadata?.company_name || '').slice(0, 200),
    avatar: String(user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.avatar || '').slice(0, 500),
    roles: Array.isArray(user.user_metadata?.roles) ? user.user_metadata.roles : [user.user_metadata?.role || 'supplier'],
    role: user.user_metadata?.role || 'supplier',
    preferences: user.user_metadata?.preferences || null
  };
}
