import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePreferences, validatePersonalSettings, projectProfile, requireOrgPermission, validateContext, assertCanLeave } from '../auth/settingsPolicy.js';
import { createUserSettingsService } from '../auth/userSettingsService.js';
import { buildMatchingContext } from '../auth/matchingContext.js';
import { publicRecord } from '../storage/supabaseRepository.js';

test('preferences validate enums, consent and security settings without granting permissions', () => {
  const prefs = validatePreferences({ suppi: { mode: 'Exact', useProfile: true }, notifications: { matching: 'DAILY' } });
  assert.equal(prefs.suppi.useNeeds, false); assert.equal(prefs.privacy.requirement, 'PRIVATE');
  for (const input of [{ suppi: { mode: 'Fast' } }, { suppi: { useNeeds: 'true' } }, { privacy: { email: 'ANY' } }, { notifications: { system: 'OFF' } }, { chainy: { confirmActions: false } }, { admin: true }, { context: { organizationId: '../x' } }]) assert.throws(() => validatePreferences(input), { code: 'AUTH_VALIDATION' });
});
test('personal settings enforce safe avatar, language and timezone', () => {
  assert.deepEqual(validatePersonalSettings({ title: ' Buyer ', avatar: 'https://example.invalid/avatar.png', timezone: 'Asia/Ho_Chi_Minh', language: 'vi' }), { title: 'Buyer', avatar_url: 'https://example.invalid/avatar.png', timezone: 'Asia/Ho_Chi_Minh', language: 'vi' });
  for (const input of [{ avatar: 'javascript:alert(1)' }, { avatar: 'https://u:p@example.invalid/a' }, { language: 'xx' }, { timezone: 'invalid' }, { phone: 3 }]) assert.throws(() => validatePersonalSettings(input), { code: 'AUTH_VALIDATION' });
});
test('organization RBAC is independent of declared business roles and rejects escalation', () => {
  for (const [role, action] of [['owner', 'members'], ['finance', 'finance'], ['event_coordinator', 'events'], ['buyer', 'sourcing']]) assert.equal(requireOrgPermission({ status: 'ACTIVE', roles: [role] }, action), true);
  for (const m of [null, { status: 'INVITED', roles: ['owner'] }, { status: 'ACTIVE', roles: ['supplier'] }, { status: 'ACTIVE', roles: ['buyer'], isAdmin: true }]) assert.throws(() => requireOrgPermission(m, 'members'), { status: 403 });
  assert.throws(() => requireOrgPermission({ status: 'ACTIVE', roles: ['admin'] }, 'transfer'), { status: 403 });
});
test('organization and context switches reject non-members and undeclared roles', () => {
  const organizations = [{ id: 'org-a', roles: ['SUPPLIER', 'FACTORY'], membership: { status: 'ACTIVE' } }];
  assert.deepEqual(validateContext({ organizationId: 'org-a', role: 'factory' }, organizations, []), { organizationId: 'org-a', role: 'factory' });
  assert.throws(() => validateContext({ organizationId: 'org-b', role: null }, organizations, []), { status: 403 });
  assert.throws(() => validateContext({ organizationId: 'org-a', role: 'investor' }, organizations, []), { status: 400 });
  assert.throws(() => validateContext({ organizationId: null, role: 'advisor' }, [], []), { status: 400 });
});
test('contact privacy is fail-closed, matched sharing requires opt-in and owners can see their own profile', () => {
  const preferences = validatePreferences({ privacy: { profile: 'PUBLIC', email: 'MEMBERS', phone: 'MATCHED_ONLY', zalo: 'HIDDEN' } });
  const user = { id: 'a', fullName: 'A', email: 'a@example.invalid', phone: '123', zalo: '456', preferences };
  assert.equal(projectProfile(user).email, undefined); assert.equal(projectProfile(user, { member: true }).email, user.email);
  assert.equal(projectProfile(user, { matched: true }).phone, undefined);
  preferences.events.shareContactAfterApproval = true; assert.equal(projectProfile(user, { matched: true }).phone, '123');
  assert.equal(projectProfile(user, { self: true }).zalo, '456'); preferences.privacy.profile = 'HIDDEN'; assert.equal(projectProfile(user, { member: true }), null);
});
test('requirement privacy never exposes matched-only records and public summary omits full specifications', () => {
  assert.equal(publicRecord({ title: 'Private need', visibility: 'MATCHED_SUPPLIERS_ONLY' }), null);
  assert.deepEqual(publicRecord({ id: 'need-a', title: 'Carton', summary: 'Bao bì', visibility: 'PUBLIC_SUMMARY', specifications: 'Private specs', attachments: ['private.pdf'], quantity: 500, email: 'hidden@example.invalid' }), { id: 'need-a', title: 'Carton', summary: 'Bao bì', visibility: 'PUBLIC_SUMMARY' });
});
test('sole owner cannot leave until ownership is transferred', () => {
  const owner = { user_id: 'a', status: 'ACTIVE', roles: ['owner'] };
  assert.throws(() => assertCanLeave([owner], 'a'), { code: 'SOLE_OWNER' });
  assert.doesNotThrow(() => assertCanLeave([owner, { user_id: 'b', status: 'ACTIVE', roles: ['owner'] }], 'a'));
  assert.doesNotThrow(() => assertCanLeave([owner], 'b'));
});
test('settings service refuses anonymous actions, exposes migration state and never trusts input actor', async () => {
  const calls = [];
  const client = { from: () => { const q = { select: () => q, eq: () => q, then: resolve => resolve({ error: { code: 'PGRST205' } }) }; return q; }, rpc: async (name, args) => { calls.push({ name, args }); return { data: { id: 'o' } }; } };
  const service = createUserSettingsService({ client });
  await assert.rejects(service.state(null), { status: 401 });
  assert.equal((await service.state({ id: 'a', user_metadata: {} })).schemaReady, false);
  await assert.rejects(service.organizationAction({ id: 'a' }, { action: 'members', actor: 'b', organizationId: 'o' }), { status: 503 });
  assert.equal(calls.length, 0);
});
test('SUPPI context defaults to no private data and never includes contact fields', async () => {
  const user = { id: 'a', fullName: 'Test', title: 'Buyer', email: 'private@example.invalid', preferences: validatePreferences() };
  assert.equal(await buildMatchingContext({ user }), null);
  user.preferences.suppi.useProfile = true;
  const context = await buildMatchingContext({ user });
  assert.equal(context.profile.name, 'Test'); assert.equal(context.profile.email, undefined);
  assert.equal(context.requireConfirmation, true); assert.equal(context.mode, 'Balanced');
});
function dbFixture() {
  const calls = []; let error = null;
  const rows = { ccu_org_user_memberships: [{ organization_id: 'org-a', user_id: 'a', roles: ['owner'], status: 'ACTIVE' }], organizations: [{ id: 'org-a', name: 'Org A', roles: ['supplier','factory'], status: 'DRAFT', metadata: { confirmed_roles: ['factory'] } }], factories: [{ id: 'factory-a', name: 'Factory' }] };
  const client = { from(table) { const q = { select: () => q, eq: () => q, in: () => q, contains: () => q, or: () => q, limit: () => q, then: resolve => resolve({ data: rows[table] || [], error }) }; return q; }, rpc: async (name, args) => { calls.push(args); return { data: name.includes('member_names') ? [{ user_id: 'a', name: 'A' }] : { id: 'org-a' }, error }; }, auth: { admin: { getUserById: async id => ({ data: { user: { id, user_metadata: { full_name: 'Profile', settings_v2: { privacy: { profile: 'PUBLIC' } } } } } }) } } };
  return { client, calls, rows, fail: value => { error = value; } };
}
test('organization service projects memberships and detail permissions without exposing raw metadata', async () => {
  const f = dbFixture(); const service = createUserSettingsService(f); const user = { id: 'a', user_metadata: {}, identities: [{ provider: 'google' }] };
  const state = await service.state(user); assert.equal(state.schemaReady, true); assert.deepEqual(state.providers, ['google']);
  assert.equal(state.organizations[0].metadata, undefined); assert.equal(state.organizations[0].permissions.members, true);
  const details = await service.organizationDetails(user, 'org-a'); assert.equal(details.members[0].name, 'A'); assert.equal(details.facilities.length, 1);
  await assert.rejects(service.organizationDetails(user, 'foreign'), { status: 403 });
  f.rows.ccu_org_user_memberships[0].status = 'INVITED'; assert.equal((await service.state(user)).invitations.length, 1);
  f.fail({ code: 'network' }); await assert.rejects(service.state(user), { status: 503 });
});
test('organization mutations strip forged actors and require explicit confirmations and valid input', async () => {
  const f = dbFixture(); const service = createUserSettingsService(f); const user = { id: 'a' };
  await service.organizationAction(user, { action: 'create', actor: 'b', name: 'Test', roles: ['factory', 'supplier'], admin: true });
  assert.equal(f.calls[0].p_actor, 'a'); assert.equal(f.calls[0].p_input.actor, undefined); assert.equal(f.calls[0].p_input.admin, undefined);
  for (const input of [{ action: 'hack' }, { action: 'roles', organizationId: '../bad' }, { action: 'roles', organizationId: 'org-a', roles: ['owner'] }, { action: 'create', name: 1 }, { action: 'create', name: '' }, { action: 'leave', organizationId: 'org-a' }]) await assert.rejects(service.organizationAction(user, input), { status: 400 });
  assert.equal((await service.searchOrganizations(user, 'Te')).length, 1); assert.deepEqual(await service.searchOrganizations(user, 'x'), []);
  assert.equal((await service.publicProfile(null, 'a')).fullName, 'Profile');
  assert.equal((await service.publicProfile(user, 'a')).id, 'a');
  await assert.rejects(service.publicProfile(null, '../a'), { status: 400 });
  f.client.rpc = async () => ({ error: { message: 'SOLE_OWNER private detail' } });
  await assert.rejects(service.organizationAction(user, { action: 'leave', organizationId: 'org-a', confirm: true }), { code: 'SOLE_OWNER', status: 409 });
});
