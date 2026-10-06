import express from 'express';
import dotenv from 'dotenv';

import SuppiConversation from '../models/SuppiConversation.js';
import RequirementDraft from '../models/RequirementDraft.js';
import SearchDocument from '../models/SearchDocument.js';
import { loadSuppiData } from '../suppi/dataSource.js';
import { createSearchEngine } from '../suppi/searchEngine.js';
import { createConversationStore } from '../suppi/conversationStore.js';
import { createDraftStore } from '../suppi/draftStore.js';
import { createToolExecutor } from '../suppi/toolRegistry.js';
import { createOpenAIResponseRequester } from '../suppi/openaiResponsesClient.js';
import { createSuppiOrchestrator } from '../suppi/orchestrator.js';
import { createAtlasHybridSearch, createEmbeddingRequester } from '../suppi/atlasHybridSearch.js';

dotenv.config();
const router = express.Router();
const dataPromise = loadSuppiData();
const conversationStore = createConversationStore({ model: SuppiConversation });
const draftStore = createDraftStore({ model: RequirementDraft });
let orchestratorPromise;

async function getOrchestrator() {
  if (!orchestratorPromise) {
    orchestratorPromise = dataPromise.then(data => {
      const searchEngine = createSearchEngine(data);
      const hybridSearch = process.env.OPENAI_API_KEY && process.env.SUPPI_VECTOR_INDEX && process.env.SUPPI_DISABLE_OPENAI !== '1'
        ? createAtlasHybridSearch({
            model: SearchDocument,
            embed: createEmbeddingRequester({
              apiKey: process.env.OPENAI_API_KEY,
              model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'
            }),
            textIndex: process.env.SUPPI_TEXT_INDEX || 'suppi_text',
            vectorIndex: process.env.SUPPI_VECTOR_INDEX
          })
        : null;
      const executeTool = createToolExecutor({ searchEngine, draftStore, hybridSearch });
      const openAI = process.env.OPENAI_API_KEY && process.env.SUPPI_DISABLE_OPENAI !== '1'
        ? createOpenAIResponseRequester({ apiKey: process.env.OPENAI_API_KEY })
        : null;
      return createSuppiOrchestrator({
        conversationStore,
        executeTool,
        openAI,
        model: process.env.OPENAI_MODEL || 'gpt-5.4-mini'
      });
    });
  }
  return orchestratorPromise;
}

router.get('/status', async (_req, res) => {
  const data = await dataPromise;
  res.json({
    success: true,
    mode: process.env.OPENAI_API_KEY && process.env.SUPPI_DISABLE_OPENAI !== '1' ? 'openai' : 'safe-fallback',
    model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
    counts: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.length]))
  });
});

router.post('/conversations', async (req, res, next) => {
  try {
    const suppi = await getOrchestrator();
    const conversation = await suppi.createConversation({ user_id: req.body?.user_id || null });
    res.status(201).json({ success: true, data: conversation });
  } catch (error) { next(error); }
});

router.get('/conversations/:id', async (req, res, next) => {
  try {
    const suppi = await getOrchestrator();
    const conversation = await suppi.getConversation(req.params.id);
    // Cookie-owned conversations are accessible only through /api/assistants.
    if (!conversation || conversation.owner_id) return res.status(404).json({ success: false, error: 'Không tìm thấy cuộc trao đổi' });
    res.json({ success: true, data: conversation });
  } catch (error) { next(error); }
});

router.post('/conversations/:id/messages', async (req, res, next) => {
  try {
    const suppi = await getOrchestrator();
    const conversation = await suppi.getConversation(req.params.id);
    if (!conversation || conversation.owner_id) return res.status(404).json({ success: false, error: 'Không tìm thấy cuộc trao đổi' });
    const result = await suppi.sendMessage(req.params.id, req.body?.message || '');
    res.json({ success: true, data: result });
  } catch (error) {
    if (/Không tìm thấy/.test(error.message)) return res.status(404).json({ success: false, error: error.message });
    if (/để trống/.test(error.message)) return res.status(400).json({ success: false, error: error.message });
    next(error);
  }
});

router.get('/requirement-drafts/:id', async (req, res, next) => {
  try {
    const draft = await draftStore.get(req.params.id);
    if (!draft || draft.owner_id) return res.status(404).json({ success: false, error: 'Không tìm thấy bản nháp' });
    res.json({ success: true, data: draft });
  } catch (error) { next(error); }
});

router.patch('/requirement-drafts/:id', async (req, res, next) => {
  try {
    const draft = await draftStore.get(req.params.id);
    if (!draft || draft.owner_id) return res.status(404).json({ success: false, error: 'Không tìm thấy bản nháp' });
    const updated = await draftStore.update(req.params.id, req.body || {});
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

router.use((error, _req, res, _next) => {
  console.error('SUPPI API error:', error.message);
  res.status(500).json({ success: false, error: 'SUPPI chưa thể xử lý yêu cầu. Vui lòng thử lại.' });
});

export default router;
