import test from 'node:test';
import assert from 'node:assert/strict';

import { createDraftStore } from '../suppi/draftStore.js';

test('create_requirement_draft creates a non-published draft', async () => {
  const store = createDraftStore();
  const draft = await store.create({
    conversation_id: 'conv-1',
    category: 'May mặc',
    product_service: '800 áo polo',
    quantity: 800,
    unit: 'áo',
    delivery_location: { province: 'Đồng Nai', district: 'Long Thành', industrial_park_id: null },
    deadline: '2026-11-30',
    specifications: [],
    certifications: [],
    sample_required: null,
    notes: null
  });

  assert.match(draft.id, /^REQ-DRAFT-/);
  assert.equal(draft.status, 'DRAFT');
  assert.equal(draft.published_at, null);
  assert.equal(draft.submitted_at, null);
});
