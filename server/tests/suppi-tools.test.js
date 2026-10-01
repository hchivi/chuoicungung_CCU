import test from 'node:test';
import assert from 'node:assert/strict';

import { SUPPI_TOOLS, validateStrictToolSchemas } from '../suppi/toolRegistry.js';

test('all SUPPI function tools use strict JSON schemas', () => {
  assert.equal(validateStrictToolSchemas(SUPPI_TOOLS), true);
  assert.ok(SUPPI_TOOLS.some(tool => tool.name === 'search_suppliers'));
  assert.ok(SUPPI_TOOLS.some(tool => tool.name === 'search_public_requirements'));
  assert.ok(SUPPI_TOOLS.some(tool => tool.name === 'create_requirement_draft'));
  assert.ok(!SUPPI_TOOLS.some(tool => /publish|submit|send_to/i.test(tool.name)));
});

test('all optional tool arguments are required nullable properties', () => {
  for (const tool of SUPPI_TOOLS) {
    const keys = Object.keys(tool.parameters.properties);
    assert.deepEqual([...tool.parameters.required].sort(), [...keys].sort(), tool.name);
    assert.equal(tool.parameters.additionalProperties, false, tool.name);
  }
});
