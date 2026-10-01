import test from 'node:test';
import assert from 'node:assert/strict';

import { fuseRankedResults } from '../suppi/atlasHybridSearch.js';

test('hybrid reciprocal-rank fusion merges lexical and vector results without sponsor fields', () => {
  const lexical = [
    { entity_id: 'a', title: 'A', isSponsored: false },
    { entity_id: 'b', title: 'B', isSponsored: true }
  ];
  const vector = [
    { entity_id: 'b', title: 'B', isSponsored: true },
    { entity_id: 'c', title: 'C', isSponsored: false }
  ];
  const fused = fuseRankedResults(lexical, vector, 10);
  assert.equal(fused[0].entity_id, 'b');
  assert.ok(fused.every(item => !Object.hasOwn(item, 'isSponsored')));
  assert.ok(fused.every(item => typeof item.hybrid_score === 'number'));
});
