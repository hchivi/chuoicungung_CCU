import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createAuthService } from '../auth/service.js';
import { createAuthRouter } from '../routes/auth.js';
import { accountRoleSections } from '../../src/data/accountRoles.js';
import { validateAccountSettings, settingsFromUser, registrationBusinessRoles } from '../auth/accountSettings.js';

function fixture() {
  const users = new Map(['a', 'b'].map(id => [id, { id, email: `${id}@example.invalid`, email_confirmed_at: '2026-01-01', user_metadata: { full_name: id, company_name: 'Test', social_provider: 'google' } }]));
  const writes = []; let fail = false;
  const client = { auth: {
    getUser: async token => ({ data: { user: users.get(token) }, error: users.has(token) ? null : { status: 401 } }),
    admin: { updateUserById: async (id, patch) => { writes.push({ id, patch }); if (fail) return { error: { status: 503, message: 'private diagnostic' } }; const user = { ...users.get(id), user_metadata: patch.user_metadata }; users.set(id, user); return { data: { user }, error: null }; } }
  }, from: () => { const q = { select: () => q, eq: () => q, maybeSingle: async () => ({ data: null, error: null }) }; return q; } };
  let signup;
  const service = createAuthService({ client, authClientFactory: () => ({ auth: { signUp: async payload => { signup = payload; return { data: { session: null }, error: null }; } } }) });
  return { service, users, writes, fail: () => { fail = true; }, signup: () => signup };
}
const request = id => ({ headers: { cookie: `ccu_access=${id}` } });
const input = { fullName: 'Người dùng', companyName: 'Doanh nghiệp', businessRoles: ['factory', 'supplier'], primaryBusinessRole: 'factory' };

test('settings persist multiple business roles for verified owner, survive a new session and never grant staff', async () => {
  const f = fixture();
  const result = await f.service.updateSettings(request('a'), { ...input, userId: 'b', role: 'admin' });
  assert.equal(f.writes[0].id, 'a'); assert.equal(result.role, null);
  assert.deepEqual(result.user.businessRoles, ['factory', 'supplier']);
  assert.equal(result.user.primaryBusinessRole, 'factory');
  assert.equal(f.users.get('a').user_metadata.social_provider, 'google');
  assert.equal(f.users.get('a').user_metadata.role, undefined);
  assert.deepEqual((await f.service.identify(request('a'))).user.businessRoles, input.businessRoles);
  assert.deepEqual((await f.service.identify(request('b'))).user.businessRoles, []);
  await f.service.updateSettings(request('a'), { ...input, businessRoles: ['kcn'], primaryBusinessRole: 'kcn' });
  assert.deepEqual((await f.service.identify(request('a'))).user.businessRoles, ['kcn']);
});
test('anonymous, forged sessions, invalid roles and invalid primary role cannot write settings', async () => {
  const f = fixture();
  for (const req of [{ headers: {} }, request('forged')]) await assert.rejects(f.service.updateSettings(req, input), { code: 'AUTH_REQUIRED' });
  for (const patch of [{ businessRoles: ['admin'] }, { businessRoles: [] }, { businessRoles: 'factory' }, { businessRoles: ['factory', 1] }, { primaryBusinessRole: 'kcn' }, { fullName: {} }, { companyName: 'x'.repeat(201) }]) {
    await assert.rejects(f.service.updateSettings(request('a'), { ...input, ...patch }), { code: 'AUTH_VALIDATION' });
  }
  assert.equal(f.writes.length, 0);
});
test('clearing all business roles is allowed only with no primary role and locks all groups', async () => {
  const f = fixture();
  const result = await f.service.updateSettings(request('a'), { ...input, businessRoles: [], primaryBusinessRole: '' });
  assert.deepEqual(result.user.businessRoles, []);
  assert.equal(result.user.primaryBusinessRole, null);
  assert.equal(accountRoleSections(result.user.businessRoles).some(section => section.enabled), false);
});
test('database errors cannot report settings saved or leak provider diagnostics', async () => {
  const f = fixture(); f.fail();
  await assert.rejects(f.service.updateSettings(request('a'), input), error => error.code === 'AUTH_UNAVAILABLE' && !error.message.includes('private'));
  assert.equal(f.users.get('a').user_metadata.business_roles, undefined);
});
test('personal profile, ten declared roles and AI/privacy preferences persist but confirmed roles remain server-managed', async () => {
  const f = fixture(); f.users.get('a').app_metadata = { confirmed_business_roles: ['factory'] };
  const saved = await f.service.updateSettings(request('a'), { ...input, title: 'Procurement', phone: '0123', zalo: 'Test', language: 'en', timezone: 'UTC', avatar: '/images/test.png', confirmedBusinessRoles: ['investor'], preferences: { suppi: { mode: 'Explore', useNeeds: true }, privacy: { email: 'MEMBERS' }, context: { role: 'factory' } } });
  assert.equal(saved.user.title, 'Procurement'); assert.equal(saved.user.preferences.suppi.mode, 'Explore');
  assert.deepEqual(saved.user.confirmedBusinessRoles, ['factory']);
  assert.equal((await f.service.identify(request('a'))).user.preferences.privacy.email, 'MEMBERS');
  assert.equal((await f.service.identify(request('b'))).user.title, '');
  await assert.rejects(f.service.updateSettings(request('a'), { ...input, preferences: { context: { organizationId: 'not-member' } } }), { status: 403 });
  await assert.rejects(f.service.updateSettings(request('a'), { ...input, preferences: { chainy: { email: true } } }), { code: 'UNSUPPORTED_CHANNEL' });
});
test('email signup saves selected business roles while stripping staff requests', async () => {
  const f = fixture();
  await f.service.register({ email: 'new@example.invalid', password: 'synthetic-password', fullName: 'New', companyName: 'Test', roles: ['supplier', 'factory'], role: 'admin' });
  assert.deepEqual(f.signup().options.data.business_roles, ['supplier', 'factory']);
  assert.equal(f.signup().options.data.role, undefined);
});
test('settings endpoint requires a session, writes only owner and returns no tokens', async t => {
  const f = fixture(); const app = express(); app.use(express.json());
  app.use('/api/auth', createAuthRouter({ service: f.service, social: {} }));
  app.use((err, _req, res, _next) => res.status(err.status || 500).json({ code: err.code }));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/api/auth/settings`;
  assert.equal((await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) })).status, 401);
  const saved = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', cookie: 'ccu_access=a' }, body: JSON.stringify(input) });
  assert.equal(saved.status, 200); const body = await saved.json();
  assert.equal(body.data.user.id, 'a'); assert.deepEqual(body.data.user.businessRoles, input.businessRoles);
  assert.doesNotMatch(JSON.stringify(body), /access_token|refresh_token|user_metadata/);
});
test('all role groups stay visible but only selected roles expose their functions', () => {
  const sections = accountRoleSections(['factory']);
  assert.equal(sections.length, 10);
  assert.deepEqual(sections.filter(section => section.enabled).map(section => section.id), ['factory']);
  assert.equal(accountRoleSections(null).some(section => section.enabled), false);
  assert.equal(accountRoleSections(['admin']).some(section => section.enabled), false);
});
test('settings normalize duplicate roles, ignore invalid stored roles and validate complete inputs', () => {
  assert.deepEqual(validateAccountSettings({ ...input, fullName: ' Name ', companyName: ' Company ', businessRoles: ['factory', 'factory'] }), { full_name: 'Name', company_name: 'Company', business_roles: ['factory'], primary_business_role: 'factory' });
  const stored = settingsFromUser({ user_metadata: { business_roles: ['admin', 'supplier', 'supplier'], primary_business_role: 'admin' } });
  assert.deepEqual(stored.businessRoles, ['supplier']); assert.equal(stored.primaryBusinessRole, 'supplier');
  assert.deepEqual(settingsFromUser({}).businessRoles, []); assert.equal(settingsFromUser({}).primaryBusinessRole, null);
  assert.deepEqual(registrationBusinessRoles({ role: 'admin' }), { business_roles: [], primary_business_role: null });
  for (const value of [null, [], { ...input, fullName: '' }, { ...input, businessRoles: Array(11).fill('factory') }]) assert.throws(() => validateAccountSettings(value), { code: 'AUTH_VALIDATION' });
});
