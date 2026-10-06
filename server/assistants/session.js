import crypto from 'node:crypto';

const COOKIE = 'ccu_assistant_session';
const ephemeralSecret = crypto.randomBytes(32).toString('hex');

export function createAssistantSession({ secret = process.env.ASSISTANT_SESSION_SECRET || process.env.SESSION_SECRET || ephemeralSecret } = {}) {
  const sign = id => crypto.createHmac('sha256', secret).update(id).digest('hex');
  return (req, res, next) => {
    const token = String(req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) || '';
    const [id, signature] = token.split('.');
    let valid = false;
    if (/^[a-f0-9-]{36}$/.test(id || '') && /^[a-f0-9]{64}$/.test(signature || '')) valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(id)));
    const sessionId = valid ? id : crypto.randomUUID();
    if (!valid) res.cookie(COOKIE, `${sessionId}.${sign(sessionId)}`, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/api/assistants', maxAge: 30 * 24 * 60 * 60 * 1000 });
    // Client user IDs and account-token strings are not authentication.
    req.assistantOwnerId = `ccu_${crypto.createHmac('sha256', secret).update(sessionId).digest('hex')}`;
    next();
  };
}
