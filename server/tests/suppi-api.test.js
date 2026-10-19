import test from 'node:test';
import assert from 'node:assert/strict';

test('retired Mongo SUPPI endpoint returns 410 without a database connection or model call', async t => {
  const { createApp } = await import('../app.js');
  const server = createApp({ client: null, repository: { health: async () => { throw new Error('Must not be called'); } } }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const createResponse = await fetch(`${base}/api/suppi/conversations`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
  });
  assert.equal(createResponse.status, 410);
  const created = await createResponse.json();

  assert.equal(created.error.code, 'API_RETIRED');
});
