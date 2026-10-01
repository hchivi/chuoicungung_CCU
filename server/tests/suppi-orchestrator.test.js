import test from 'node:test';
import assert from 'node:assert/strict';

import { createConversationStore } from '../suppi/conversationStore.js';
import { createSuppiOrchestrator } from '../suppi/orchestrator.js';
import { createSearchEngine } from '../suppi/searchEngine.js';
import { createDraftStore } from '../suppi/draftStore.js';
import { createToolExecutor } from '../suppi/toolRegistry.js';

function fixtureOrchestrator() {
  const searchEngine = createSearchEngine({
    suppliers: [{
      id: 'carton-long-thanh', name: 'Bao Bì Long Thành', industry: 'Bao bì carton',
      products: ['Thùng carton 5 lớp'], province: 'Đồng Nai', serviceAreas: ['Long Thành'], verified: true
    }]
  });
  return createSuppiOrchestrator({
    conversationStore: createConversationStore(),
    executeTool: createToolExecutor({ searchEngine, draftStore: createDraftStore() }),
    openAI: null
  });
}

test('conversation remembers category and merges a later location answer', async () => {
  const suppi = fixtureOrchestrator();
  const conversation = await suppi.createConversation();

  const first = await suppi.sendMessage(conversation.id, 'Anh cần carton.');
  assert.match(first.message, /giao|địa điểm/i);
  assert.equal(first.conversation.slots.query, 'carton');

  const second = await suppi.sendMessage(conversation.id, 'Long Thành.');
  assert.equal(second.conversation.slots.location.district, 'Long Thành');
  assert.equal(second.conversation.slots.location.province, 'Đồng Nai');
  assert.equal(second.results[0].entity_id, 'carton-long-thanh');
  assert.match(second.message, /Bao Bì Long Thành/);
});

test('fallback assistant does not invent results when database has no match', async () => {
  const suppi = fixtureOrchestrator();
  const conversation = await suppi.createConversation();
  const result = await suppi.sendMessage(conversation.id, 'Tìm động cơ phản lực ở Đà Nẵng');
  assert.equal(result.results.length, 0);
  assert.match(result.message, /chưa tìm thấy/i);
});

test('unknown conversation is rejected', async () => {
  const suppi = fixtureOrchestrator();
  await assert.rejects(suppi.sendMessage('missing', 'carton'), /Không tìm thấy cuộc trao đổi/);
});

test('draft tool conversation_id is forced to the active conversation', async () => {
  let capturedArgs;
  let callCount = 0;
  const suppi = createSuppiOrchestrator({
    conversationStore: createConversationStore(),
    executeTool: async (_name, args) => { capturedArgs = args; return { id: 'draft-1', status: 'DRAFT' }; },
    openAI: async request => {
      callCount += 1;
      if (callCount === 1) return {
        id: 'resp-draft-1', output_text: '',
        output: [{ type: 'function_call', call_id: 'draft-call', name: 'create_requirement_draft', arguments: JSON.stringify({ conversation_id: 'forged' }) }]
      };
      return { id: 'resp-draft-2', output_text: 'Đã tạo bản nháp.', output: [] };
    },
    model: 'test-model'
  });
  const conversation = await suppi.createConversation();
  const response = await suppi.sendMessage(conversation.id, 'Tạo bản nháp');
  assert.equal(capturedArgs.conversation_id, conversation.id);
  assert.equal(response.draft.id, 'draft-1');
  assert.equal(response.draft.status, 'DRAFT');
});
