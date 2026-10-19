import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import express from 'express';
import { createSocialAuth } from '../auth/social.js';
import { createAuthRouter } from '../routes/auth.js';

function fixture(external = { google: true, 'custom:zalo': true }) {
  const calls = [], cookies = {}, cleared = [];
  let now = 1000, fail = false;
  const service = { acceptRecovery: async input => { calls.push(['verify', input]); return { session: { ...input, expires_in: 3600 }, identity: { user: { id: 'verified' }, role: null } }; }, claimAnonymous: async (...args) => calls.push(['claim', ...args]) };
  const social = createSocialAuth({ service, config: { url: 'https://test.supabase.co', key: 'public-test-key', site: 'http://localhost:3000', secret: 'synthetic-server-secret', zaloProvider: 'custom:zalo' }, now: () => now, fetchImpl: async (url, options) => { calls.push([url, options]); if (fail) throw new Error('private diagnostic'); return new Response(JSON.stringify(url.includes('/settings') ? { external } : { access_token: 'verified-access', refresh_token: 'private-refresh' })); } });
  const res = { cookie: (key, value, options) => { cookies[key] = { value, options }; }, clearCookie: key => cleared.push(key) };
  return { social, res, calls, cookies, cleared, expire: () => { now += 700000; }, fail: () => { fail = true; } };
}

test('social auth exposes enabled flags only and fails closed for disabled or unknown providers', async () => {
  const f = fixture({});
  assert.deepEqual(await f.social.providers(), { google: false, zalo: false });
  await assert.rejects(f.social.start({ provider: 'google' }, f.res), { code: 'OAUTH_NOT_CONFIGURED' });
  await assert.rejects(f.social.start({ provider: 'attacker' }, f.res), { code: 'AUTH_VALIDATION' });
  const failed = fixture(); failed.fail();
  await assert.rejects(failed.social.providers(), { code: 'OAUTH_UNAVAILABLE' });
});
test('PKCE start binds callback to a signed expiring HttpOnly Lax cookie and local next path', async () => {
  const f = fixture();
  const result = await f.social.start({ provider: 'google', next: '//attacker.invalid', ownerId: 'ccu_' + 'a'.repeat(64) }, f.res);
  const url = new URL(result.url), callback = new URL(url.searchParams.get('redirect_to'));
  assert.equal(url.origin, 'https://test.supabase.co'); assert.equal(url.searchParams.get('provider'), 'google');
  assert.equal(url.searchParams.get('code_challenge_method'), 's256'); assert.ok(url.searchParams.get('code_challenge'));
  assert.equal(callback.pathname, '/api/auth/oauth/callback'); assert.ok(callback.searchParams.get('state'));
  const cookie = f.cookies.ccu_oauth;
  assert.equal(cookie.options.httpOnly, true); assert.equal(cookie.options.sameSite, 'lax'); assert.equal(cookie.options.maxAge, 600000);
  assert.doesNotMatch(JSON.stringify(result), /private-refresh|code_verifier/);
  const completed = await f.social.finish({ headers: { cookie: `ccu_oauth=${cookie.value}` }, query: { code: 'real-auth-code', state: callback.searchParams.get('state') } }, f.res);
  assert.equal(completed.next, '/tai-khoan'); assert.equal(completed.identity.user.id, 'verified');
  const token = f.calls.find(([url]) => typeof url === 'string' && url.includes('/token?'));
  assert.equal(JSON.parse(token[1].body).auth_code, 'real-auth-code'); assert.ok(JSON.parse(token[1].body).code_verifier);
  assert.ok(f.calls.some(([name]) => name === 'verify')); assert.ok(f.calls.some(([name]) => name === 'claim'));
  assert.ok(f.cleared.includes('ccu_oauth'));
});
test('social callback rejects missing, tampered, expired, cancelled or mismatched state before exchanging tokens', async () => {
  for (const variant of ['missing','tampered','expired','cancelled','state','code']) {
    const f = fixture(); const result = await f.social.start({ provider: 'zalo', next: '/tai-khoan/nhu-cau' }, f.res);
    const state = new URL(new URL(result.url).searchParams.get('redirect_to')).searchParams.get('state');
    let cookie = f.cookies.ccu_oauth.value;
    if (variant === 'tampered') cookie += 'bad'; if (variant === 'expired') f.expire();
    await assert.rejects(f.social.finish({ headers: { cookie: variant === 'missing' ? '' : `ccu_oauth=${cookie}` }, query: { code: variant === 'code' ? '' : 'code', state: variant === 'state' ? 'forged' : state, ...(variant === 'cancelled' ? { error: 'denied' } : {}) } }, f.res), { code: 'OAUTH_CALLBACK_FAILED' });
    assert.equal(f.calls.some(([url]) => typeof url === 'string' && url.includes('/token?')), false);
  }
});
test('provider errors are safe and do not create authenticated cookies', async () => {
  const f = fixture(); const start = await f.social.start({ provider: 'google', next: '/admin' }, f.res);
  f.fail();
  await assert.rejects(f.social.finish({ headers: { cookie: `ccu_oauth=${f.cookies.ccu_oauth.value}` }, query: { code: 'code', state: new URL(new URL(start.url).searchParams.get('redirect_to')).searchParams.get('state') } }, f.res), { code: 'OAUTH_UNAVAILABLE' });
  assert.equal(f.calls.some(([name]) => name === 'verify'), false);
});
test('customer entry preserves original brand/tabs/social choices and keeps password management separate', async () => {
  const form = await readFile(new URL('../../src/components/auth/AuthForm.jsx', import.meta.url), 'utf8');
  const page = await readFile(new URL('../../src/pages/AuthPage.jsx', import.meta.url), 'utf8');
  assert.match(form, /BrandLogo/); assert.match(form, /Đăng ký doanh nghiệp/); assert.match(form, /Zalo/); assert.match(form, /Google/);
  assert.match(form, /oauth\/start/); assert.doesNotMatch(form, /setTimeout|alert\(|localStorage|Hạng Vàng|SSL 256/);
  assert.match(page, /location.pathname === '\/tai-khoan'/);
  assert.doesNotMatch(page, /mt-10 border-t pt-7/);
});

test('settings HTTP, malformed JSON and null responses fail closed without private diagnostics', async () => {
  for (const response of [new Response('private diagnostic', { status: 500 }), new Response('not-json'), new Response('null')]) {
    const social = createSocialAuth({ service: {}, config: { url: 'https://test.supabase.co', key: 'public' }, fetchImpl: async () => response });
    await assert.rejects(social.providers(), error => error.code === 'OAUTH_UNAVAILABLE' && !error.message.includes('private diagnostic'));
  }
});
test('enabled Zalo uses only the configured custom provider; safe local return path survives', async () => {
  const f = fixture();
  const result = await f.social.start({ provider: 'zalo', next: '/tai-khoan/nhu-cau', ownerId: 'forged' }, f.res);
  assert.equal(new URL(result.url).searchParams.get('provider'), 'custom:zalo');
  const state = new URL(new URL(result.url).searchParams.get('redirect_to')).searchParams.get('state');
  const completed = await f.social.finish({ headers: { cookie: `ccu_oauth=${f.cookies.ccu_oauth.value}` }, query: { code: 'code', state } }, f.res);
  assert.equal(completed.next, '/tai-khoan/nhu-cau'); assert.equal(f.calls.some(([name]) => name === 'claim'), false);
});
test('callback routes set HttpOnly session cookies only after verified success, otherwise redirect safely', async t => {
  let reject = false;
  const social = { providers: async () => ({ google: true, zalo: false }), finish: async () => {
    if (reject) throw new Error('private provider diagnostic');
    return { session: { access_token: 'synthetic-access', refresh_token: 'synthetic-refresh', expires_in: 3600 }, identity: { user: { id: 'verified' }, role: null }, next: '/tai-khoan' };
  } };
  const app = express(); app.use('/api/auth', createAuthRouter({ service: {}, social }));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const flags = await fetch(`${base}/api/auth/providers`); assert.deepEqual((await flags.json()).data, { google: true, zalo: false });
  const success = await fetch(`${base}/api/auth/oauth/callback?code=test`, { redirect: 'manual' });
  assert.equal(success.status, 303); assert.equal(success.headers.get('location'), '/tai-khoan');
  assert.match(success.headers.get('set-cookie'), /HttpOnly/); assert.match(success.headers.get('set-cookie'), /SameSite=Strict/);
  assert.equal(success.headers.get('referrer-policy'), 'no-referrer');
  reject = true;
  const failure = await fetch(`${base}/api/auth/oauth/callback?code=test`, { redirect: 'manual' });
  assert.equal(failure.status, 303); assert.equal(failure.headers.get('location'), '/dang-nhap?oauth_error=failed');
  assert.equal(failure.headers.get('set-cookie'), null); assert.doesNotMatch(await failure.text(), /synthetic|private provider diagnostic/);
});

test('direct Zalo OAuth v4 generates Zalo permission URL with PKCE and exchanges profile', async () => {
  const calls = [];
  const service = {
    acceptSocialProfile: async profile => {
      calls.push(['acceptSocialProfile', profile]);
      return { session: { access_token: 'zalo-sess', refresh_token: 'zalo-ref', expires_in: 3600 }, identity: { user: { id: 'zalo_user_123' }, role: null } };
    },
    claimAnonymous: async () => {}
  };
  const social = createSocialAuth({
    service,
    config: {
      url: 'https://test.supabase.co',
      key: 'public-test-key',
      site: 'http://localhost:3000',
      secret: 'synthetic-server-secret',
      zaloAppId: '3500129788309602073',
      zaloAppSecret: '41jH76paHINop4AgVE2s'
    },
    fetchImpl: async (url, options) => {
      calls.push([url, options]);
      if (url.includes('/settings')) return new Response(JSON.stringify({ external: { google: true } }));
      if (url.includes('/access_token')) return new Response(JSON.stringify({ access_token: 'zalo-test-token' }));
      if (url.includes('/me')) return new Response(JSON.stringify({ id: '987654321', name: 'Test Zalo User', picture: { data: { url: 'https://avatar' } } }));
      return new Response('{}');
    }
  });

  const providers = await social.providers();
  assert.equal(providers.zalo, true);

  const cookies = {};
  const res = { cookie: (k, v, o) => { cookies[k] = { value: v, options: o }; }, clearCookie: () => {} };
  const start = await social.start({ provider: 'zalo', next: '/tai-khoan' }, res);
  const authUrl = new URL(start.url);
  assert.equal(authUrl.origin, 'https://oauth.zaloapp.com');
  assert.equal(authUrl.pathname, '/v4/permission');
  assert.equal(authUrl.searchParams.get('app_id'), '3500129788309602073');
  assert.ok(authUrl.searchParams.get('code_challenge'));
  assert.ok(authUrl.searchParams.get('state'));

  const finishRes = await social.finish({
    headers: { cookie: `ccu_oauth=${cookies.ccu_oauth.value}` },
    query: { code: 'zalo-auth-code', state: authUrl.searchParams.get('state') }
  }, res);

  assert.equal(finishRes.identity.user.id, 'zalo_user_123');
  assert.equal(finishRes.next, '/tai-khoan');
  const accepted = calls.find(([name]) => name === 'acceptSocialProfile');
  assert.ok(accepted);
  assert.equal(accepted[1].providerId, '987654321');
  assert.equal(accepted[1].fullName, 'Test Zalo User');
});

