/**
 * Security, Rate-Limiting & Session Ownership Middleware
 * Standardized according to codex_fixed.txt Sections III, IV & IX.
 */

import crypto from 'node:crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'ccu-suppi-secret-token-key-2026';

// 1. Request ID Middleware
export function requestIdMiddleware(req, res, next) {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = String(reqId);
  res.setHeader('X-Request-Id', req.id);
  next();
}

// 2. NoSQL Injection Sanitizer
export function noSqlSanitizer(req, res, next) {
  const cleanObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        cleanObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) cleanObject(req.body);
  if (req.query) cleanObject(req.query);
  if (req.params) cleanObject(req.params);
  next();
}

// 3. Lightweight In-Memory Rate Limiter
export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 300, message = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' } = {}) {
  const hits = new Map();

  // Periodic cleanup
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now > record.resetTime) hits.delete(ip);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    // Skip in testing environment if flag is set
    if (process.env.NODE_ENV === 'test' && !process.env.TEST_RATE_LIMIT) {
      return next();
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const record = hits.get(clientIp);

    if (!record || now > record.resetTime) {
      hits.set(clientIp, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          request_id: req.id || null
        }
      });
    }

    next();
  };
}

// 4. Server-Signed Anonymous Session for SUPPI & RequirementDrafts
export function signSessionId(id) {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(id);
  const signature = hmac.digest('hex').substring(0, 16);
  return `${id}.${signature}`;
}

export function verifySessionId(signedToken) {
  if (!signedToken || typeof signedToken !== 'string') return null;
  const parts = signedToken.split('.');
  if (parts.length !== 2) return null;
  const [id, signature] = parts;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(id);
  const expectedSig = hmac.digest('hex').substring(0, 16);
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return id;
  }
  return null;
}

export function sessionOwnershipMiddleware(req, res, next) {
  // 1. Authenticated user from auth token/header
  if (req.headers['x-user-id'] && req.headers['x-auth-token']) {
    req.user = { id: req.headers['x-user-id'] };
    req.ownerId = req.headers['x-user-id'];
  } else {
    // 2. Anonymous session
    let rawSession = req.headers['x-suppi-session'] || req.headers['x-session-id'];
    let verifiedId = verifySessionId(rawSession);

    if (!verifiedId) {
      // Generate and attach a new signed session
      verifiedId = `anon_${crypto.randomUUID()}`;
      const signed = signSessionId(verifiedId);
      res.setHeader('X-Suppi-Session', signed);
    }
    req.anonymousSessionId = verifiedId;
    req.ownerId = verifiedId;
  }

  next();
}
