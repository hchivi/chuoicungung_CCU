import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createAuthService } from '../auth/service.js';
import { createAuthRouter } from '../routes/auth.js';
import { createAdminRouter } from '../routes/admin.js';
import { createAssistantSession } from '../assistants/session.js';
import { createApp } from '../app.js';

const user = { id: '11111111-1111-4111-8111-111111111111', email: 'staff@example.invalid', email_confirmed_at: '2026-01-01', user_metadata: { role: 'admin' } };
function fixture(role = null) {
  const calls = [];
  const state = { role, fail: false };
  const client = { auth: { getUser: async token => token === 'valid' ? { data: { user }, error: null } : { data: {}, error: { status: 401 } }, admin: { signOut: async () => ({ error: null }) } },
    from(table) { calls.push(table); let single = false; const q = { select: () => q, eq: () => q, order: () => q, range: () => q, limit: () => q, ilike: () => q, maybeSingle: () => { single = true; return q; }, then: resolve => Promise.resolve({ data: state.fail ? null : table === 'ccu_staff_roles' ? state.role ? { user_id: user.id, role: state.role, enabled: true } : null : single ? null : [], count: 0, error: state.fail ? { code: 'FAIL', message: 'secret diagnostic' } : null }).then(resolve) }; return q; },
    rpc: async (name, args) => { calls.push({ name, args }); return { data: { id: 's1', status: args.p_status, updated_at: 'next' }, error: null }; }
  };
  const session = { access_token: 'valid', refresh_token: 'private-refresh', expires_in: 3600, user };
  const auth = { auth: {
    signInWithPassword: async () => ({ data: { session, user }, error: null }),
    signUp: async input => { calls.push(input); return { data: { user, session: null }, error: null }; },
    refreshSession: async () => ({ data: { session, user }, error: null }),
    resetPasswordForEmail: async () => ({ error: null })
  } };
  return { client, auth, calls, state, service: createAuthService({ client, authClientFactory: () => auth }) };
}
async function serve(t, fixture) {
  const app = express(); app.use(express.json());
  app.use('/auth', createAuthRouter({ service: fixture.service }));
  app.use('/admin', createAdminRouter({ client: fixture.client, authService: fixture.service }));
  app.use((err, req, res, next) => res.status(err.status || 500).json({ code: err.code, message: err.isPublic ? err.message : 'Error' }));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); t.after(() => server.close());
  return `http://127.0.0.1:${server.address().port}`;
}
const headers = { cookie: 'ccu_access=valid', 'content-type': 'application/json' };

test('identity must be verified by Supabase; user metadata cannot grant staff permissions', async () => {
  const f = fixture();
  const identity = await f.service.identify({ headers });
  assert.equal(identity.user.id, user.id); assert.equal(identity.role, null);
  await assert.rejects(f.service.identify({ headers: { cookie: 'ccu_access=forged' } }), { code: 'AUTH_REQUIRED' });
  assert.equal(await f.service.identify({ headers: {} }), null);
  f.state.fail = true;
  await assert.rejects(f.service.identify({ headers }), { code: 'DATABASE_UNAVAILABLE' });
});
test('login stores HttpOnly cookies, never tokens in JSON; signup strips requested admin metadata', async t => {
  const f = fixture(); const base = await serve(t, f);
  const r = await fetch(`${base}/auth/login`, { method: 'POST', headers, body: JSON.stringify({ email: user.email, password: 'synthetic-password' }) });
  assert.equal(r.status, 200); const text = await r.text(); assert.doesNotMatch(text, /private-refresh|access_token|refresh_token/);
  assert.match(r.headers.get('set-cookie'), /HttpOnly/); assert.match(r.headers.get('set-cookie'), /SameSite=Strict/);
  const signup = await fetch(`${base}/auth/register`, { method: 'POST', headers, body: JSON.stringify({ email: 'test@example.invalid', password: 'synthetic-password', companyName: 'Synthetic', role: 'admin', isVerified: true }) });
  assert.equal(signup.status, 200);
  const sent = f.calls.find(c => typeof c === 'object' && c.email); assert.equal(sent.options.data.role, undefined); assert.equal(sent.options.data.isVerified, undefined);
});
test('anonymous and ordinary account cannot read admin; viewer cannot review; roles are reloaded', async t => {
  const f = fixture(); const base = await serve(t, f);
  assert.equal((await fetch(`${base}/admin/submissions`)).status, 401);
  assert.equal((await fetch(`${base}/admin/submissions`, { headers })).status, 403);
  f.state.role = 'viewer'; assert.equal((await fetch(`${base}/admin/submissions`, { headers })).status, 200);
  const review = () => fetch(`${base}/admin/submissions/s1/review`, { method: 'POST', headers, body: JSON.stringify({ status: 'APPROVED', note: 'Reviewed', expectedUpdatedAt: '2026-01-01T00:00:00Z', actor: 'forged' }) });
  assert.equal((await review()).status, 403);
  f.state.role = 'moderator'; assert.equal((await review()).status, 200);
  const rpc = f.calls.find(c => c.name === 'ccu_review_submission'); assert.equal(rpc.args.p_actor, user.id); assert.notEqual(rpc.args.p_actor, 'forged');
});
test('admin only allowlisted data collections; review rejects invalid status/empty reason without writes', async t => {
  const f = fixture('admin'); const base = await serve(t, f);
  assert.equal((await fetch(`${base}/admin/data/auth.users`, { headers })).status, 400);
  assert.equal((await fetch(`${base}/admin/data/suppi_conversations`, { headers })).status, 400);
  for (const body of [{ status: 'WON', note: 'x' }, { status: 'REJECTED', note: '' }]) assert.equal((await fetch(`${base}/admin/submissions/s1/review`, { method: 'POST', headers, body: JSON.stringify(body) })).status, 400);
  assert.equal(f.calls.filter(c => c.name === 'ccu_review_submission').length, 0);
});
test('authenticated owner replaces anonymous identity; caller userId cannot override it', () => {
  const req = { headers: {}, authIdentity: { user, role: null }, body: { ownerId: 'forged' } }; const res = { cookie() {} };
  createAssistantSession({ secret: 'synthetic-secret' })(req, res, () => {});
  assert.equal(req.assistantOwnerId, `auth:${user.id}`);
});
test('schema keeps roles/audit private, checks roles again in transactional RPCs, no automatic staff grant', async () => {
  const fs = await import('node:fs/promises'); const sql = await fs.readFile(new URL('../migrations/20261008_auth_admin.sql', import.meta.url), 'utf8');
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/); assert.match(sql, /REVOKE ALL[\s\S]*anon, authenticated/);
  assert.match(sql, /FOR UPDATE/); assert.match(sql, /ccu_staff_roles/); assert.doesNotMatch(sql, /INSERT INTO public\.ccu_staff_roles/i);
  assert.match(sql, /ccu_claim_anonymous[\s\S]*?SECURITY DEFINER SET search_path = ''/);
});
test('expired access with a refresh cookie cannot silently become an anonymous account', async () => {
  const f = fixture();
  await assert.rejects(f.service.identify({ headers: { cookie: 'ccu_refresh=private-refresh' } }), { code: 'AUTH_REQUIRED' });
});
test('refresh restores verified identity and logout clears account plus guest cookies', async t => {
  const f = fixture(); const base = await serve(t, f);
  const r = await fetch(`${base}/auth/session`, { headers: { cookie: 'ccu_access=expired; ccu_refresh=private-refresh' } });
  assert.equal(r.status, 200); assert.equal((await r.json()).data.user.id, user.id);
  assert.match(r.headers.get('set-cookie'), /HttpOnly/);
  const logout = await fetch(`${base}/auth/logout`, { method: 'POST', headers });
  assert.equal(logout.status, 200); assert.match(logout.headers.get('set-cookie'), /ccu_session_v2=;/);
});
test('content changes require admin and valid phase; conflicts do not report saved', async t => {
  const f = fixture('moderator'); const base = await serve(t, f);
  const patch = body => fetch(`${base}/admin/data/suppliers/s1`, { method: 'PATCH', headers, body: JSON.stringify({ patch: { phase: '5.3' }, note: 'Correct classification', expectedUpdatedAt: '2026-01-01', ...body }) });
  assert.equal((await patch()).status, 403);
  f.state.role = 'admin'; assert.equal((await patch({ patch: { phase: '9.9' } })).status, 400);
  assert.equal((await patch()).status, 200);
  f.client.rpc = async () => ({ error: { code: '40001' } });
  assert.equal((await patch()).status, 409);
});
test('app wires real auth/admin and requires explicit same-site origin for their mutations', async t => {
  const f = fixture();
  const repository = { health: async () => {}, all: async () => [], invalidate() {} };
  const app = createApp({ client: f.client, repository, authService: f.service });
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(`${base}/api/auth/session`)).status, 200);
  assert.equal((await fetch(`${base}/api/admin/submissions`)).status, 401);
  for (const origin of [undefined, 'https://attacker.invalid', 'null']) {
    assert.equal((await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json', ...(origin ? { origin } : {}) }, body: JSON.stringify({ email: user.email, password: 'synthetic' }) })).status, 403);
  }
  assert.equal((await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { ...headers, origin: 'http://localhost:3000' }, body: JSON.stringify({ email: user.email, password: 'synthetic' }) })).status, 200);
});
test('auth validates inputs, recovery and password changes; provider failures stay safe', async t => {
  const f = fixture(); const base = await serve(t, f);
  const post = (action, body) => fetch(`${base}/auth/${action}`, { method: 'POST', headers, body: JSON.stringify(body) });
  assert.equal((await post('login', {email:'invalid',password:'x'})).status,400);
  assert.equal((await post('register', {email:user.email,password:'short'})).status,400);
  assert.equal((await post('forgot-password', {email:'invalid'})).status,400);
  assert.equal((await post('forgot-password', {email:user.email})).status,200);
  assert.equal((await post('recovery', {})).status,401);
  const recovery = await post('recovery',{access_token:'valid',refresh_token:'private-refresh'});
  assert.equal(recovery.status,200); assert.doesNotMatch(await recovery.text(), /private-refresh/);
  assert.equal((await post('password',{password:'short'})).status,400);
  f.auth.auth.setSession=async()=>({error:null});
  f.auth.auth.updateUser=async()=>({data:{user},error:null});
  f.auth.auth.getSession=async()=>({data:{session:{access_token:'valid',refresh_token:'private-refresh'}}});
  assert.equal((await post('password',{password:'synthetic-new-password'})).status,200);
  f.auth.auth.setSession=async()=>({error:{status:401}});
  assert.equal((await post('password',{password:'synthetic-new-password'})).status,401);
  for (const [upstream, expected] of [[400,400],[429,429],[503,503]]) {
    f.auth.auth.signInWithPassword=async()=>({error:{status:upstream,message:'secret diagnostic'}});
    const r=await post('login',{email:user.email,password:'synthetic-password'}); assert.equal(r.status,expected); assert.doesNotMatch(await r.text(),/secret diagnostic/);
  }
  f.auth.auth.signUp=async()=>({error:{status:400}});
  assert.equal((await post('register',{email:user.email,password:'synthetic-password'})).status,400);
  f.auth.auth.resetPasswordForEmail=async()=>({error:{status:503}});
  assert.equal((await post('forgot-password',{email:user.email})).status,503);
  f.auth.auth.refreshSession=async()=>({error:{status:401}});
  const failedRefresh=await fetch(`${base}/auth/session`,{headers:{cookie:'ccu_refresh=expired'}});
  assert.equal(failedRefresh.status,401); assert.match(failedRefresh.headers.get('set-cookie'),/ccu_access=;/);
});
test('staff directory, audit and patch validation cover protected fields and RPC failures', async t => {
  const f=fixture('admin'); const base=await serve(t,f);
  assert.equal((await fetch(`${base}/admin/audit`,{headers})).status,200);
  assert.equal((await fetch(`${base}/admin/data/programs?q=cnc&page=2`,{headers})).status,200);
  assert.equal((await fetch(`${base}/admin/submissions?status=PENDING&kind=demand`,{headers})).status,200);
  const body={patch:{phases:['1.1','5.3'],stages:[1,5]},note:'Reviewed classification',expectedUpdatedAt:'2026-01-01'};
  const patch=value=>fetch(`${base}/admin/data/suppliers/s1`,{method:'PATCH',headers,body:JSON.stringify(value)});
  for (const fields of [{status:'PUBLIC'},{phases:['7.1']},{stages:[7]},{phase:'9.1'},{stage:9},{name:{}},{phases:'1.1'},{stages:[{}]}]) assert.equal((await patch({...body,patch:fields})).status,400);
  assert.equal((await patch(body)).status,200);
  for (const [code,status] of [['42501',403],['P0002',404],['22023',400],['OTHER',503]]) {
    f.client.rpc=async()=>({error:{code,message:'private sql details'}});
    const r=await patch(body); assert.equal(r.status,status); assert.doesNotMatch(await r.text(),/private sql details/);
  }
});
