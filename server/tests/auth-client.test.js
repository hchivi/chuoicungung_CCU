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
