import express from 'express';
import { getSupabase } from '../supabase.js';
import { createSupabaseRepository } from '../storage/supabaseRepository.js';
import { createSupabaseDraftStore, createSupabaseConversationStore } from '../storage/assistantStores.js';
import { createAssistantRuntime } from '../assistants/runtime.js';
import { createAssistantSession } from '../assistants/session.js';
import { getAssistantConfiguration } from '../assistants/provider.js';

export function createAssistantRouter({ service = null, repository = createSupabaseRepository({ client: getSupabase() }), client = getSupabase() } = {}) {
  const router = express.Router();
  let runtime = service;
  router.use((req, res, next) => {
    const allowed = (process.env.CORS_ORIGIN || 'https://chuoicungung.com,https://www.chuoicungung.com,http://localhost:3000,http://localhost:5173').split(',').map(value => value.trim());
    if (req.headers.origin && !allowed.includes(req.headers.origin)) return res.status(403).json({ success: false, error: { code: 'ORIGIN_DENIED', message: 'Nguồn truy cập không được phép.' } });
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  router.get('/status', async (_req, res) => {
    const config = getAssistantConfiguration();
    let connected = false;
    try { await repository.health(); connected = true; } catch { /* Not configured is not ready. */ }
    return res.json({ success: true, data: {
      database: connected ? 'connected' : 'unavailable', database_provider: 'supabase',
      suppi: config.configured ? `${config.provider}-configured` : 'not-configured',
      chainy: config.configured ? `${config.provider}-configured` : 'not-configured',
      provider: config.provider, configured_model: config.model, model_verified: false,
      model_routing: config.routing,
      // Configuration is not a successful inference or a billing-tier check.
      model_verification: 'check_chat_response_metadata', billing_tier: 'not_verified',
      live_sources: connected ? ['suppliers', 'factories', 'industrialParks', 'associations', 'productsServices', 'programs', 'catalogues', 'publicRequirements'] : [],
      pending_sources: connected ? [] : ['supabase'],
      write_actions: ['create_requirement_draft'], external_actions: []
    } });
  });
  router.use(createAssistantSession());
  router.post('/chat', async (req, res, next) => {
    try {
      runtime ||= createAssistantRuntime({ client, repository });
      const result = await runtime.send({ query: req.body?.query, conversationId: req.body?.conversation_id, mode: req.body?.mode, ownerId: req.assistantOwnerId });
      res.json({ success: true, data: result });
    } catch (error) {
      console.warn('CCU assistant request failed:', error.code || 'INTERNAL_ERROR', req.id);
      next(error);
    }
  });
  router.get('/conversations/:id', async (req, res) => {
    const conversation = await createSupabaseConversationStore({ client }).get(req.params.id);
    if (!conversation || conversation.owner_id !== req.assistantOwnerId) return res.status(404).json({ success: false, error: { code: 'CONVERSATION_NOT_FOUND' } });
    res.json({ success: true, data: conversation });
  });
  router.get('/requirement-drafts/:id', async (req, res) => {
    const draft = await createSupabaseDraftStore({ client }).get(req.params.id, { owner_id: req.assistantOwnerId });
    if (!draft) return res.status(404).json({ success: false, error: { code: 'DRAFT_NOT_FOUND' } });
    res.json({ success: true, data: draft });
  });
  router.patch('/requirement-drafts/:id', async (req, res) => {
    const draft = await createSupabaseDraftStore({ client }).update(req.params.id, req.body || {}, { owner_id: req.assistantOwnerId });
    if (!draft) return res.status(404).json({ success: false, error: { code: 'DRAFT_NOT_FOUND' } });
    res.json({ success: true, data: draft });
  });
  return router;
}
