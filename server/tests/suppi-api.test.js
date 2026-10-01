import test from 'node:test';
import assert from 'node:assert/strict';

test('SUPPI HTTP API creates a conversation and keeps context across messages', {
  skip: process.env.RUN_HTTP_TESTS !== '1' && 'Set RUN_HTTP_TESTS=1 in an environment that permits localhost sockets'
}, async t => {
  process.env.SUPPI_DISABLE_OPENAI = '1';
  const { createApp } = await import('../app.js');
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const createResponse = await fetch(`${base}/api/suppi/conversations`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();

  const firstResponse = await fetch(`${base}/api/suppi/conversations/${created.data.id}/messages`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Anh cần carton' })
  });
  const first = await firstResponse.json();
  assert.equal(firstResponse.status, 200);
  assert.match(first.data.message, /khu vực/i);

  const secondResponse = await fetch(`${base}/api/suppi/conversations/${created.data.id}/messages`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Long Thành' })
  });
  const second = await secondResponse.json();
  assert.equal(secondResponse.status, 200);
  assert.equal(second.data.conversation.slots.location.district, 'Long Thành');
  assert.equal(second.data.mode, 'safe-fallback');
});
