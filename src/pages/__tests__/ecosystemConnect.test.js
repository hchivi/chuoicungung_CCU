import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFile, access } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const componentPath = fileURLToPath(new URL('../../components/ecosystem/EcosystemConnectSection.jsx', import.meta.url));

async function renderSection() {
  const result = await build({ entryPoints: [componentPath], bundle: true, write: false,
    platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'],
    loader: { '.css': 'empty' } });
  const bundled = new Module(componentPath);
  bundled.filename = componentPath;
  bundled.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
  bundled._compile(result.outputFiles[0].text, componentPath);
  const { StaticRouter } = require('react-router-dom/server');
  return renderToStaticMarkup(React.createElement(StaticRouter, { location: '/he-sinh-thai' },
    React.createElement(bundled.exports.default)));
}

test('ecosystem CTA retains exactly two clear, existing customer journeys', async () => {
  const html = await renderSection();
  assert.equal((html.match(/<a /g) || []).length, 2);
  assert.match(html, /href="\/dang-nhu-cau"/);
  assert.match(html, /href="\/tao-ho-so"/);
  for (const label of ['Nhà máy', 'Nhà cung cấp', 'Đăng nhu cầu', 'Giới thiệu năng lực']) {
    assert.ok(html.includes(label), label);
  }
});

test('ecosystem CTA explains what each role should prepare without invented promises', async () => {
  const html = await renderSection();
  for (const label of ['Quy cách', 'Số lượng', 'Tiến độ', 'Ngành nghề', 'Pha cung ứng', 'Hình ảnh năng lực']) {
    assert.ok(html.includes(label), label);
  }
  assert.doesNotMatch(html, /<svg|gradient|đảm bảo|cam kết|tự động khớp|\d[,.]\d{3}/i);
  assert.match(html, /aria-labelledby="ecosystem-connect-title"/);
  assert.match(html, /<h2 id="ecosystem-connect-title"/);
});

test('ecosystem CTA uses a local, labelled, lazy-loaded image with reserved dimensions', async () => {
  const html = await renderSection();
  const image = html.match(/<img[^>]+>/)?.[0];
  assert.ok(image);
  assert.match(image, /loading="lazy"/);
  assert.match(image, /width="1376"/);
  assert.match(image, /height="768"/);
  assert.match(image, /alt="[^"\s][^"]+"/);
  const asset = image.match(/src="([^"]+)"/)[1];
  await access(fileURLToPath(new URL(`../../../public${asset}`, import.meta.url)));
});

test('ecosystem CTA is scoped, responsive and has instant keyboard focus', async () => {
  const css = await readFile(new URL('../../components/ecosystem/EcosystemConnectSection.css', import.meta.url), 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /white-space: nowrap/);
  assert.match(css, /min-height: 48px/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|linear-gradient|transition: all|scale\(/i);
  const page = await readFile(new URL('../EcosystemOverviewPage.jsx', import.meta.url), 'utf8');
  assert.match(page, /<EcosystemConnectSection\s*\/>/);
  assert.doesNotMatch(page, /Bắt đầu kết nối cùng Hệ sinh thái/);
  assert.match(page, /pillar_fdi_factory/);
});
