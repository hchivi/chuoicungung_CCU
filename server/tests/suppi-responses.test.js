import test from 'node:test';
import assert from 'node:assert/strict';

import { runResponsesToolLoop } from '../suppi/openaiResponsesClient.js';

test('Responses tool loop returns function outputs with matching call_id', async () => {
  const requests = [];
  const responses = [
    {
      id: 'resp-1',
      output: [{
        type: 'function_call',
        call_id: 'call-123',
        name: 'search_suppliers',
        arguments: JSON.stringify({ query: 'carton' })
      }],
      output_text: ''
    },
    {
      id: 'resp-2',
      output: [{ type: 'message' }],
      output_text: 'Tôi tìm thấy một nhà cung ứng phù hợp.'
    }
  ];

  const createResponse = async request => {
    requests.push(request);
    return responses.shift();
  };
  const executeTool = async (name, args) => ({ name, query: args.query, items: [] });

  const result = await runResponsesToolLoop({
    createResponse,
    executeTool,
    instructions: 'SUPPI prompt',
    tools: [],
    model: 'test-model',
    input: 'Tìm carton',
    previousResponseId: null,
    maxIterations: 3
  });

  assert.equal(result.text, 'Tôi tìm thấy một nhà cung ứng phù hợp.');
  assert.equal(result.responseId, 'resp-2');
  assert.equal(requests[1].previous_response_id, 'resp-1');
  assert.deepEqual(requests[1].input, [{
    type: 'function_call_output',
    call_id: 'call-123',
    output: JSON.stringify({ name: 'search_suppliers', query: 'carton', items: [] })
  }]);
  assert.equal(requests[1].instructions, 'SUPPI prompt');
});

test('Responses tool loop rejects unknown tools without executing arbitrary code', async () => {
  const createResponse = async () => ({
    id: 'resp-unknown',
    output: [{ type: 'function_call', call_id: 'bad-call', name: 'publish_requirement', arguments: '{}' }],
    output_text: ''
  });

  await assert.rejects(
    runResponsesToolLoop({
      createResponse,
      executeTool: async () => { throw new Error('Unknown tool'); },
      instructions: 'SUPPI prompt', tools: [], model: 'test-model',
      input: 'publish', previousResponseId: null, maxIterations: 1
    }),
    /Unknown tool/
  );
});
