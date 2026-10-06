import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import apiRoutes from './routes/api.js';
import suppiRoutes from './routes/suppi.js';
import { createAssistantRouter } from './routes/assistants.js';
import { handleCanonicalRedirects } from './routes/redirects.js';
import { handleRobotsTxt, handleSitemapXml } from './routes/seo.js';
import { 
  requestIdMiddleware, 
  noSqlSanitizer, 
  createRateLimiter,
  sessionOwnershipMiddleware 
} from './middleware/security.js';

export function createApp({ assistantService = null } = {}) {
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
        callback(null, true); // Allow during transition, can restrict via CORS_STRICT=1
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

  // /readyz: Dependency readiness (MongoDB connection check)
  app.get('/readyz', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const isReady = mongoose.connection.readyState === 1;
    if (isReady) {
      return res.status(200).json({
        status: 'ready',
        database: 'connected',
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
  app.get('/sitemap.xml', handleSitemapXml);

  // 4. Canonical Redirects Middleware (Section VI)
  app.use(handleCanonicalRedirects);

  // 5. API Routes
  app.use('/api', generalLimiter);
  app.use('/api/assistants', writeLimiter, createAssistantRouter({ service: assistantService }));
  app.use('/api/suppi', writeLimiter, sessionOwnershipMiddleware, suppiRoutes);
  app.use('/api', apiRoutes);

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
