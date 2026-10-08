import express from 'express';
import mongoose from 'mongoose';
import { createAssistantRuntime } from '../assistants/runtime.js';
import { createAssistantSession } from '../assistants/session.js';
import { getAssistantConfiguration } from '../assistants/provider.js';

export function createAssistantRouter({ service = null } = {}) {
  const router = express.Router();
  let runtime = service;
  router.use((req, res, next) => {
    const allowed = (process.env.CORS_ORIGIN || 'https://chuoicungung.com,https://www.chuoicungung.com,http://localhost:3000,http://localhost:5173').split(',').map(value => value.trim());
    if (req.headers.origin && !allowed.includes(req.headers.origin)) return res.status(403).json({ success: false, error: { code: 'ORIGIN_DENIED', message: 'Nguồn truy cập không được phép.' } });
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  router.get('/status', (_req, res) => {
    const config = getAssistantConfiguration();
    return res.json({ success: true, data: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'unavailable',
      suppi: config.configured ? `${config.provider}-configured` : 'not-configured',
      chainy: config.configured ? `${config.provider}-configured` : 'not-configured',
      provider: config.provider, configured_model: config.model, model_verified: false,
      // Configuration is not a successful inference or a billing-tier check.
      model_verification: 'check_chat_response_metadata', billing_tier: 'not_verified',
      live_sources: ['suppliers', 'factories', 'industrialParks', 'associations'],
      pending_sources: ['productsServices', 'programs', 'catalogues', 'publicRequirements'],
      write_actions: ['create_requirement_draft'], external_actions: []
    } });
  });
  router.use(createAssistantSession());
  router.post('/chat', async (req, res, next) => {
    try {
      runtime ||= createAssistantRuntime();
      const result = await runtime.send({ query: req.body?.query, conversationId: req.body?.conversation_id, mode: req.body?.mode, ownerId: req.assistantOwnerId });
      res.json({ success: true, data: result });
    } catch (error) {
      console.warn('CCU assistant request failed:', error.code || 'INTERNAL_ERROR', req.id);
      next(error);
    }
  });
  return router;
}
