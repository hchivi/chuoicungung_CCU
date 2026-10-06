import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
let markup;

before(async () => {
  const entry = fileURLToPath(new URL('../ServiceRequestPage.jsx', import.meta.url));
  const result = await build({
    entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs',
    external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' },
    plugins: [{
      name: 'test-language-context',
      setup(builder) {
        builder.onResolve({ filter: /contexts\/LanguageContext$/ }, () => ({ path: 'language', namespace: 'test' }));
        builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const useLanguage = () => ({ t: x => x });' }));
      },
    }],
  });
  const bundled = new Module(entry);
  bundled.filename = entry;
  bundled.paths = Module._nodeModulePaths(fileURLToPath(new URL('..', import.meta.url)));
  bundled._compile(result.outputFiles[0].text, entry);
  const { StaticRouter } = require('react-router-dom/server');
  const savedDocument = globalThis.document;
  globalThis.document = { referrer: '' };
  try {
    markup = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/yeu-cau-dich-vu' },
      React.createElement(bundled.exports.default)));
  } finally {
    if (savedDocument === undefined) delete globalThis.document;
    else globalThis.document = savedDocument;
  }
});

test('all five services are real keyboard-operable radio inputs', () => {
  assert.equal((markup.match(/type="radio"/g) || []).length, 5);
  assert.equal((markup.match(/name="serviceType"/g) || []).length, 5);
});

test('general fields have programmatically associated labels', () => {
  for (const id of ['companyName', 'customerName', 'roleTitle', 'phone', 'email', 'description', 'location', 'desiredDate', 'budget', 'attachedFilesNote']) {
    assert.match(markup, new RegExp(`for="service-${id}"`));
    assert.match(markup, new RegExp(`id="service-${id}"`));
  }
});

test('redesign has one H1 and no internal implementation labels', () => {
  assert.equal((markup.match(/<h1[\s>]/g) || []).length, 1);
  assert.doesNotMatch(markup, /Page 17: Service Request Engine/i);
  assert.match(markup, /aria-current="step"/);
});

test('no nested main landmark or premature native submit action', () => {
  assert.doesNotMatch(markup, /<main[\s>]/);
  assert.doesNotMatch(markup, /type="submit"/);
  assert.match(markup, /id="service-request-form"/);
});

const valid = { companyName: 'Công ty kiểm thử', customerName: 'Người kiểm thử', description: 'Yêu cầu kiểm thử', phone: '0900000000', email: '' };

test('required fields and either contact channel are validated without changing the payload', async () => {
  const { getServiceRequestErrors } = await import('../serviceRequestUi.js');
  assert.deepEqual(getServiceRequestErrors(valid), {});
  assert.deepEqual(getServiceRequestErrors({ ...valid, phone: '', email: 'test@example.com' }), {});
  const errors = getServiceRequestErrors({ companyName: ' ', customerName: '', description: '', phone: '', email: '' });
  assert.deepEqual(Object.keys(errors), ['companyName', 'customerName', 'phone', 'email', 'description']);
  assert.ok(getServiceRequestErrors({ ...valid, email: 'invalid' }).email);
  assert.ok(getServiceRequestErrors({ ...valid, email: 'test@' }).email);
  assert.deepEqual(getServiceRequestErrors({ ...valid, email: ' test@example.com ' }), {});
});

test('review shows all five branches without inventing missing details', async () => {
  const { getServiceRequestDetails, SERVICE_PRESENTATION } = await import('../serviceRequestUi.js');
  for (const type of Object.keys(SERVICE_PRESENTATION)) {
    const details = getServiceRequestDetails({ serviceType: type });
    assert.ok(details.length > 0);
    assert.ok(details.every(([label, value]) => label && value === 'Chưa bổ sung'));
  }
  assert.deepEqual(getServiceRequestDetails({ serviceType: 'unknown' }), []);
  const items = getServiceRequestDetails({ serviceType: 'VAT_PHAM_SU_KIEN', merchandise: { productTypes: ['Áo', 'Túi'], quantities: '800' } });
  assert.equal(items[0][1], 'Áo, Túi');
  assert.equal(items[1][1], '800');
  assert.equal(getServiceRequestDetails({ serviceType: 'VAT_PHAM_SU_KIEN', merchandise: { productTypes: [] } })[0][1], 'Chưa bổ sung');
  const formats = [{ id: 'plant-sourcing', name: 'Kết nối tại nhà máy' }];
  const programs = [{ id: 'event-1', title: 'Chương trình kiểm thử' }];
  assert.equal(getServiceRequestDetails({ serviceType: 'TO_CHUC_KET_NOI', matchmaking: { formatType: 'plant-sourcing' } }, { formats })[0][1], formats[0].name);
  assert.equal(getServiceRequestDetails({ serviceType: 'HIEN_DIEN_TU_XA', remotePresence: { targetProgramId: 'event-1' } }, { programs })[0][1], programs[0].title);
});
