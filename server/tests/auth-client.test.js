import test from 'node:test';
import assert from 'node:assert/strict';

test('browser auth is cookie-only, refresh is deduplicated and logout clears private cache', async () => {
  const { restoreAuthSession, authSnapshot, authAction, authenticatedRequest } = await import('../../src/services/authSession.js');
  const { getPrivateSubmissions, loadPrivateSubmissions } = await import('../../src/services/submissionService.js');
  const original = globalThis.fetch; let count = 0;
  globalThis.fetch = async (url, options = {}) => {
    assert.equal(options.credentials, 'same-origin');
    assert.equal(options.headers?.Authorization, undefined);
    if (url === '/api/submissions') return new Response(JSON.stringify({ success: true, source: 'supabase', data: [{ id: 'one', kind: 'programInterest', data: {}, status: 'PENDING' }] }));
    if (url === '/api/auth/session') { count++; await new Promise(resolve => setTimeout(resolve, 5)); return new Response(JSON.stringify({ success: true, data: { user: { id: 'verified-user' }, role: null } })); }
    return new Response(JSON.stringify({ success: true, data: [] }));
  };
  try {
    await Promise.all([restoreAuthSession(), restoreAuthSession()]); assert.equal(count, 1);
    assert.equal(authSnapshot().identity.user.id, 'verified-user');
    await loadPrivateSubmissions(); assert.equal(getPrivateSubmissions('programInterest').length, 1);
    await authAction('logout'); assert.equal(authSnapshot().identity, null); assert.equal(getPrivateSubmissions('programInterest').length, 0);
    globalThis.fetch = async () => new Response(JSON.stringify({ success: false, error: { message: 'Denied' } }), { status: 403 });
    await assert.rejects(authenticatedRequest('/api/admin/submissions'), /Denied/);
  } finally { globalThis.fetch = original; }
});

test('all admin views gate by server session, no legacy role picker or simulated authentication', async () => {
  const { readFile } = await import('node:fs/promises');
  const admin = await readFile(new URL('../../src/pages/AdminDashboardPage.jsx', import.meta.url), 'utf8');
  assert.match(admin, /useAuth/); assert.match(admin, /\/api\/admin/);
  assert.doesNotMatch(admin, /getActiveAdminRole|SUPER_ADMIN|localStorage/);
  const form = await readFile(new URL('../../src/components/auth/AuthForm.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(form, /setTimeout|alert\(|localStorage|isVerified/);
  assert.match(form, /authAction/);
});
test('a pending private read cannot repopulate cache after account changes', async () => {
  const { clearPrivateSubmissions, loadPrivateSubmissions, getPrivateSubmissions } = await import('../../src/services/submissionService.js');
  const original = globalThis.fetch; let finish;
  globalThis.fetch = () => new Promise(resolve => { finish = resolve; });
  try {
    const pending = loadPrivateSubmissions(); clearPrivateSubmissions();
    finish(new Response(JSON.stringify({ success: true, source: 'supabase', data: [{ id: 'old', kind: 'demand', data: { title: 'Previous account' }, status: 'PENDING' }] })));
    await pending; assert.equal(getPrivateSubmissions('demand').length, 0);
  } finally { globalThis.fetch = original; }
});
test('legacy private browser storage is account-scoped and cannot manufacture login or admin rights', async () => {
  const original = globalThis.localStorage;
  const values = new Map();
  globalThis.localStorage = {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  try {
    const { privateBrowserStorage: storage, setBrowserAccount } = await import('../../src/services/privateBrowserStorage.js');
    setBrowserAccount({user:{id:'account-a',email:'a@example.invalid'},role:null});
    storage.setItem('ccu_active_chat_messages','private A');
    storage.setItem('ccu_user_session',JSON.stringify({isLoggedIn:true,isAdmin:true}));
    assert.equal(JSON.parse(storage.getItem('ccu_user_session')).isAdmin,false);
    setBrowserAccount({user:{id:'account-b',email:'b@example.invalid'},role:null});
    assert.equal(storage.getItem('ccu_active_chat_messages'),null);
    setBrowserAccount(null); assert.equal(storage.getItem('ccu_user_session'),null);
    setBrowserAccount({user:{id:'account-a',email:'a@example.invalid'},role:null});
    assert.equal(storage.getItem('ccu_active_chat_messages'),'private A');
  } finally { globalThis.localStorage=original; }
});
test('saving settings updates the current account but cannot switch browser identity', async () => {
  const { restoreAuthSession, authSnapshot, authAction } = await import('../../src/services/authSession.js');
  const original = globalThis.fetch;
  let savedUser = 'settings-user';
  globalThis.fetch = async url => new Response(JSON.stringify({ success: true, data: { user: { id: url === '/api/auth/session' ? 'settings-user' : savedUser, businessRoles: ['factory'] }, role: null } }));
  try {
    await restoreAuthSession();
    await authAction('settings', { businessRoles: ['factory'] });
    assert.deepEqual(authSnapshot().identity.user.businessRoles, ['factory']);
    savedUser = 'other-user';
    await assert.rejects(authAction('settings', {}), /Tài khoản đã thay đổi/);
    assert.equal(authSnapshot().identity.user.id, 'settings-user');
  } finally { globalThis.fetch = original; }
});
