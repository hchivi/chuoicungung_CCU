import express from 'express';
import { createAssistantSession } from '../assistants/session.js';
import { setAuthCookies } from '../auth/service.js';

export function createAuthRouter({ service }) {
  const router = express.Router();
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  router.get('/session', async (req, res) => res.json({ success: true, data: await service.session(req, res) }));
  for (const action of ['login', 'register']) router.post(`/${action}`, createAssistantSession(), async (req, res) => {
    const result = await service[action](req.body || {});
    if (result.session) {
      await service.claimAnonymous(req.assistantOwnerId, result.identity.user.id);
      setAuthCookies(res, result.session);
    }
    res.json({ success: true, data: result.identity, confirmationRequired: !result.session, message: result.session ? 'Đã đăng nhập.' : 'Nếu đăng ký hợp lệ, vui lòng kiểm tra email để xác nhận tài khoản rồi đăng nhập.' });
  });
  router.post('/logout', async (req, res) => { await service.logout(req, res); res.json({ success: true }); });
  router.post('/forgot-password', async (req, res) => { await service.forgotPassword(req.body?.email); res.json({ success: true, message: 'Nếu email có tài khoản, hướng dẫn đặt lại mật khẩu sẽ được gửi.' }); });
  router.post('/recovery', async (req, res) => { const result = await service.acceptRecovery(req.body || {}); setAuthCookies(res, result.session); res.json({ success: true, data: result.identity }); });
  router.post('/password', async (req, res) => { const session = await service.changePassword(req, req.body?.password); if (session) setAuthCookies(res, session); res.json({ success: true }); });
  return router;
}
