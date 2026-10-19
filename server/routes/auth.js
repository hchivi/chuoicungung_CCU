import express from 'express';
import { createAssistantSession } from '../assistants/session.js';
import { setAuthCookies } from '../auth/service.js';
import { createSocialAuth } from '../auth/social.js';

export function createAuthRouter({ service, social = createSocialAuth({ service }) }) {
  const router = express.Router();
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  router.get('/session', async (req, res) => res.json({ success: true, data: await service.session(req, res) }));
  router.post('/settings', async (req, res) => res.json({ success: true, data: await service.updateSettings(req, req.body || {}) }));
  router.get('/settings', async (req, res) => res.json({ success: true, data: await service.settingsState(req) }));
  router.get('/settings/organizations/search', async (req, res) => res.json({ success: true, data: await service.searchOrganizations(req, req.query.q) }));
  router.get('/settings/organizations/:id', async (req, res) => res.json({ success: true, data: await service.organizationDetails(req, req.params.id) }));
  router.post('/settings/organizations', async (req, res) => res.json({ success: true, data: await service.organizationAction(req, req.body || {}) }));
  router.get('/profiles/:id', async (req, res) => res.json({ success: true, data: await service.publicProfile(req, req.params.id) }));
  router.get('/providers', async (_req, res) => res.json({ success: true, data: await social.providers() }));
  router.post('/oauth/start', createAssistantSession(), async (req, res) => {
    const data = await social.start({ provider: req.body?.provider, next: req.body?.next, ownerId: req.assistantOwnerId }, res);
    res.json({ success: true, data });
  });
  const handleOAuthCallback = async (req, res) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    try {
      const result = await social.finish(req, res);
      setAuthCookies(res, result.session);
      res.redirect(303, result.identity.role ? '/admin' : result.next);
    } catch { res.redirect(303, '/dang-nhap?oauth_error=failed'); }
  };
  router.get('/oauth/callback', handleOAuthCallback);
  router.get('/oauth/zalo/callback', handleOAuthCallback);
  for (const action of ['login', 'register']) router.post(`/${action}`, createAssistantSession(), async (req, res) => {
    const result = await service[action](req.body || {});
    if (result.session) {
      await service.claimAnonymous(req.assistantOwnerId, result.identity.user.id);
      setAuthCookies(res, result.session);
    }
    res.json({ success: true, data: result.identity, confirmationRequired: !result.session, message: result.session ? 'Đã đăng nhập.' : 'Nếu đăng ký hợp lệ, vui lòng kiểm tra email để xác nhận tài khoản rồi đăng nhập.' });
  });
  router.post('/logout', async (req, res) => { await service.logout(req, res); res.json({ success: true }); });
  router.post('/logout-all', async (req, res) => {
    if (req.body?.confirm !== true) return res.status(400).json({ success: false, error: { message: 'Vui lòng xác nhận đăng xuất tất cả thiết bị.' } });
    await service.logout(req, res, true); res.json({ success: true });
  });
  router.post('/forgot-password', async (req, res) => { await service.forgotPassword(req.body?.email); res.json({ success: true, message: 'Nếu email có tài khoản, hướng dẫn đặt lại mật khẩu sẽ được gửi.' }); });
  router.post('/recovery', async (req, res) => { const result = await service.acceptRecovery(req.body || {}); setAuthCookies(res, result.session); res.json({ success: true, data: result.identity }); });
  router.post('/password', async (req, res) => { const session = await service.changePassword(req, req.body?.password); if (session) setAuthCookies(res, session); res.json({ success: true }); });
  return router;
}
