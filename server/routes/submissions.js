import express from 'express';
import { createAssistantSession } from '../assistants/session.js';
import { createSubmissionStore } from '../storage/submissionStore.js';

export function createSubmissionsRouter({ client } = {}) {
  const router = express.Router();
  const store = createSubmissionStore({ client });
  router.use(createAssistantSession(), (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  router.get('/', async (req, res) => res.json({ success: true, source: 'supabase', data: await store.list({ ownerId: req.assistantOwnerId, kind: req.query.kind }) }));
  router.post('/:kind', async (req, res) => {
    let input = req.body?.data;
    if (req.params.kind === 'demand' && input && typeof input === 'object' && !Array.isArray(input)) {
      const allowed = ['PRIVATE', 'MATCHED_SUPPLIERS_ONLY', 'PUBLIC_SUMMARY'];
      // The default is derived from the verified account, not a browser userId.
      const visibility = allowed.includes(input.visibility) ? input.visibility : req.authIdentity?.user?.preferences?.privacy?.requirement || 'PRIVATE';
      input = { ...input, visibility };
    }
    const record = await store.create({ kind: req.params.kind, ownerId: req.assistantOwnerId, data: input, idempotencyKey: req.headers['idempotency-key'] });
    // Return only to the owner; no service key, owner token or raw SQL details.
    const { owner_id, idempotency_key, ...data } = record;
    res.status(201).json({ success: true, source: 'supabase', data });
  });
  return router;
}
