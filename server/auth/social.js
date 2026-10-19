import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { AssistantError } from '../assistants/difyClient.js';
import { readCookies } from './service.js';

const cookieOptions = { httpOnly: true, sameSite: 'lax', path: '/api/auth/oauth' };
const failure = () => new AssistantError('OAUTH_CALLBACK_FAILED', 'Phiên đăng nhập nhanh không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.', 400);
const unavailable = () => new AssistantError('OAUTH_UNAVAILABLE', 'Chưa kết nối được dịch vụ đăng nhập nhanh. Vui lòng dùng email hoặc thử lại sau.', 503);
const localNext = value => typeof value === 'string' && value.length <= 512 && /^\/(?!\/)/.test(value) && !/[\\\x00-\x20]|%(?:2f|5c|0[ad])/i.test(value) ? value : '/tai-khoan';
export function createSocialAuth({ service, config = {}, fetchImpl = fetch, now = Date.now } = {}) {
  const url = config.url || process.env.SUPABASE_URL;
  const key = config.key || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const site = (config.site || process.env.SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://chuoicungung.com' : 'http://localhost:3000')).replace(/\/$/, '');
  const signingKey = config.secret || process.env.SESSION_SECRET || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const secret = signingKey ? createHmac('sha256', signingKey).update('ccu-customer-oauth-v1').digest() : null;
  const zaloAppId = config.zaloAppId || process.env.ZALO_APP_ID;
  const zaloAppSecret = config.zaloAppSecret || process.env.ZALO_APP_SECRET;
  const zaloProvider = config.zaloProvider || process.env.ZALO_SUPABASE_PROVIDER;
  const providers = {
    google: 'google',
    zalo: /^custom:[a-z0-9-]+$/.test(zaloProvider || '') ? zaloProvider : (zaloAppId && zaloAppSecret ? 'direct:zalo' : null)
  };
  let cached;
  const sign = value => createHmac('sha256', secret).update(value).digest('base64url');
  async function json(path, options = {}) {
    if (!url || !key) throw unavailable();
    try {
      const response = await fetchImpl(`${url.replace(/\/$/, '')}/auth/v1/${path}`, { ...options, headers: { apikey: key, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw unavailable();
      return await response.json();
    } catch { throw unavailable(); }
  }
  async function availability() {
    if (!cached || now() - cached.time >= 60000) {
      const settings = await json('settings');
      if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw unavailable();
      const zaloEnabled = providers.zalo === 'direct:zalo' || (!!providers.zalo && settings.external?.[providers.zalo] === true);
      cached = { time: now(), data: { google: settings.external?.google === true, zalo: zaloEnabled } };
    }
    return { ...cached.data };
  }
  return {
    providers: availability,
    async start({ provider, next, ownerId } = {}, res) {
      if (!Object.hasOwn(providers, provider)) throw new AssistantError('AUTH_VALIDATION', 'Phương thức đăng nhập không hợp lệ.', 400);
      if (!(await availability())[provider]) throw new AssistantError('OAUTH_NOT_CONFIGURED', `${provider === 'google' ? 'Google' : 'Zalo'} chưa được kích hoạt. Bạn có thể đăng nhập bằng email trong lúc chờ cấu hình.`, 503);
      if (!secret || !/^https?:\/\//.test(site) || (process.env.NODE_ENV === 'production' && !site.startsWith('https://'))) throw unavailable();
      const verifier = randomBytes(48).toString('base64url'), state = randomBytes(32).toString('base64url');
      const payload = Buffer.from(JSON.stringify({ provider, verifier, state, next: localNext(next), ownerId: /^ccu_[a-f0-9]{64}$/.test(ownerId || '') ? ownerId : null, expires: now() + 600000 })).toString('base64url');
      res.cookie('ccu_oauth', `${payload}.${sign(payload)}`, { ...cookieOptions, secure: process.env.NODE_ENV === 'production', maxAge: 600000 });
      const callback = new URL('/api/auth/oauth/callback', site); callback.searchParams.set('state', state);

      if (providers[provider] === 'direct:zalo') {
        const zaloCallback = new URL('/api/auth/oauth/callback', site);
        const authorize = new URL('https://oauth.zaloapp.com/v4/permission');
        authorize.searchParams.set('app_id', zaloAppId);
        authorize.searchParams.set('redirect_uri', zaloCallback.toString());
        authorize.searchParams.set('code_challenge', createHash('sha256').update(verifier).digest('base64url'));
        authorize.searchParams.set('state', state);
        return { url: authorize.toString() };
      }

      const authorize = new URL(`${url.replace(/\/$/, '')}/auth/v1/authorize`);
      authorize.searchParams.set('provider', providers[provider]); authorize.searchParams.set('redirect_to', callback.toString());
      authorize.searchParams.set('code_challenge', createHash('sha256').update(verifier).digest('base64url'));
      authorize.searchParams.set('code_challenge_method', 's256');
      return { url: authorize.toString() };
    },
    async finish(req, res) {
      res.clearCookie('ccu_oauth', { ...cookieOptions, secure: process.env.NODE_ENV === 'production' });
      const cookie = readCookies(req).ccu_oauth;
      if (!secret || typeof cookie !== 'string' || cookie.length > 4000) throw failure();
      const [payload, signature, extra] = cookie.split('.');
      const expected = sign(payload || '');
      if (extra !== undefined || !/^[A-Za-z0-9_-]{43}$/.test(signature || '') || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw failure();
      let flow; try { flow = JSON.parse(Buffer.from(payload, 'base64url')); } catch { throw failure(); }
      if (!flow || typeof flow.expires !== 'number' || flow.expires <= now() || typeof flow.verifier !== 'string' || !flow.verifier || !flow.state || flow.state !== req.query.state || req.query.error || typeof req.query.code !== 'string' || !req.query.code || req.query.code.length > 4096) throw failure();

      if (flow.provider === 'zalo' && providers.zalo === 'direct:zalo') {
        const tokenRes = await fetchImpl('https://oauth.zaloapp.com/v4/access_token', {
          method: 'POST',
          headers: {
            'secret_key': zaloAppSecret,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            code: req.query.code,
            app_id: zaloAppId,
            grant_type: 'authorization_code',
            code_verifier: flow.verifier
          }).toString()
        });
        if (!tokenRes.ok) throw failure();
        const tokenData = await tokenRes.json();
        if (!tokenData?.access_token) throw failure();

        const meRes = await fetchImpl('https://graph.zalo.me/v2.0/me?fields=id,name,picture', {
          headers: { access_token: tokenData.access_token }
        });
        if (!meRes.ok) throw failure();
        const meData = await meRes.json();
        if (!meData?.id) throw failure();

        const email = `zalo_${meData.id}@zalo.chuoicungung.com`;
        const result = await service.acceptSocialProfile({
          email,
          fullName: meData.name || 'Người dùng Zalo',
          avatar: meData.picture?.data?.url || '',
          provider: 'zalo',
          providerId: meData.id
        });
        if (flow.ownerId) await service.claimAnonymous(flow.ownerId, result.identity.user.id);
        return { ...result, next: localNext(flow.next) };
      }

      const tokens = await json('token?grant_type=pkce', { method: 'POST', body: JSON.stringify({ auth_code: req.query.code, code_verifier: flow.verifier }) });
      // Reuse the verified-session boundary: Supabase getUser + confirmed email + server role lookup.
      const result = await service.acceptRecovery(tokens);
      if (flow.ownerId) await service.claimAnonymous(flow.ownerId, result.identity.user.id);
      return { ...result, next: localNext(flow.next) };
    }
  };
}
