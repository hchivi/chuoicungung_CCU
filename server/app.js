import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getSupabase } from './supabase.js';
import { createSupabaseRepository } from './storage/supabaseRepository.js';

import { createApiRouter } from './routes/api.js';
import { createAssistantRouter } from './routes/assistants.js';
import { handleCanonicalRedirects } from './routes/redirects.js';
import { handleRobotsTxt, handleSitemapXml } from './routes/seo.js';
import { 
  requestIdMiddleware, 
  noSqlSanitizer, 
  createRateLimiter,
  sessionOwnershipMiddleware
} from './middleware/security.js';

export function createApp({ assistantService = null, client = getSupabase(), repository = createSupabaseRepository({ client }) } = {}) {
  const app = express();

  // 1. Security & Core Middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Handled or configured as needed
  }));

  // CORS Allowlist
  const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) 
    : ['http://localhost:3000', 'http://localhost:5173', 'https://chuoicungung.com', 'https://www.chuoicungung.com'];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true
  }));

  app.use(requestIdMiddleware);
  app.use(express.json({ limit: '1mb' }));
  app.use(noSqlSanitizer);

  // Rate Limiting (General API: 300 req / 15 min, SUPPI / write: 60 req / 15 min)
  const generalLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 300 });
  const writeLimiter = createRateLimiter({ 
    windowMs: 15 * 60 * 1000, 
    max: 60, 
    message: 'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.' 
  });

  // 2. Health & Readiness Endpoints (Mandatory Section III)
  // /healthz: Process liveness (always 200 if process is up)
  app.get('/healthz', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // /readyz: actual Supabase schema/read readiness, not mere key presence.
  app.get('/readyz', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let isReady = false;
    try { await repository.health(); isReady = true; } catch { /* Return 503 without leaking provider errors. */ }
    if (isReady) {
      return res.status(200).json({
        status: 'ready',
        database: 'connected', provider: 'supabase',
        timestamp: new Date().toISOString()
      });
    }
    return res.status(503).json({
      status: 'not_ready',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  });

  // 3. SEO Endpoints
  app.get('/robots.txt', handleRobotsTxt);
  app.get('/sitemap.xml', (req, res, next) => handleSitemapXml(req, res, next, repository));

  // 4. Canonical Redirects Middleware (Section VI)
  app.use(handleCanonicalRedirects);

  // 5. API Routes
  app.use('/api', generalLimiter);
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.origin && !allowedOrigins.includes(req.headers.origin)) return res.status(403).json({ success: false, error: { code: 'ORIGIN_DENIED', message: 'Nguồn truy cập không được phép.' } });
    next();
  });
  app.use('/api/assistants', writeLimiter, createAssistantRouter({ service: assistantService, client, repository }));
  // Retired legacy Mongo/OpenAI endpoint. All current UI uses /api/assistants.
  app.use('/api/suppi', (_req, res) => res.status(410).json({ success: false, error: { code: 'API_RETIRED', message: 'Sử dụng /api/assistants/chat. API MongoDB cũ đã ngừng hoạt động.' } }));
  app.use('/api', writeLimiter, createApiRouter({ repository, client }));

  // Server root welcome info
  app.get('/', (_req, res) => {
    res.json({
      message: 'Chuỗi Cung Ứng - Backend API is running',
      version: '1.0.0',
      endpoints: ['/healthz', '/readyz', '/api/status', '/api/enterprises', '/api/demands', '/api/industrial-parks', '/api/suppi/status']
    });
  });

  // 6. Unknown /api 404 Handler (MUST return JSON 404, NEVER SPA index.html)
  app.use('/api', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `API endpoint '${req.path}' không tồn tại trên hệ thống`,
        request_id: req.id || null
      }
    });
  });

  // 7. Global Error Handler
  app.use((err, req, res, _next) => {
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.isPublic ? err.message : 'Đã có lỗi xảy ra trên hệ thống',
        request_id: req.id || null
      }
    });
  });

  return app;
}
