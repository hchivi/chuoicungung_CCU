import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';

async function loadHomepageBlock() {
  const entry = fileURLToPath(new URL('../../components/home/SuppiChainyConciseSection.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' } });
  const mod = new Module(entry);
  mod.filename = entry;
  mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
  mod._compile(result.outputFiles[0].text, entry);
  return mod.exports.default;
}

test('homepage adopts the approved duo stage with the exact two laptop mascots', async () => {
  const Block = await loadHomepageBlock();
  const html = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/' }, React.createElement(Block)));
  assert.match(html, /data-assistant-duo/);
  assert.match(html, /CÓ VIỆC\./);
  for (const id of ['suppi', 'chainy']) {
    assert.match(html, new RegExp('/mascots/' + id + '-directions.webp\\?v=8'));
    assert.match(html, new RegExp('href="/tro-ly-ai\\?assistant=' + id + '"'));
  }
  assert.equal((html.match(/data-mascot=/g) || []).length, 2);
  assert.doesNotMatch(html, /21.680|bg-\[#060D1A\]|backdrop-blur|đảm bảo/);
});

test('customers can distinguish sourcing and coordination without unsupported outcome promises', async () => {
  const Block = await loadHomepageBlock();
  const html = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/' }, React.createElement(Block)));
  assert.match(html, /TRỢ LÝ TÌM NGUỒN/);
  assert.match(html, /TRỢ LÝ ĐIỀU PHỐI/);
  assert.match(html, /quy cách/);
  assert.match(html, /yêu cầu báo giá/);
  assert.match(html, /lịch gặp/);
  assert.match(html, /gửi mẫu/);
});

test('blue and pink are scoped to the duo, with explicit stacking and reduced motion', async () => {
  const css = await readFile(new URL('../../components/home/AssistantDuoStage.css', import.meta.url), 'utf8');
  assert.match(css, /--ai-suppi/);
  assert.match(css, /--ai-chainy/);
  assert.match(css, /z-index: var\(--ai-layer-mascot\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /transition:\s*all|text-shadow|backdrop-filter/);
  const home = await readFile(new URL('../HomePage.jsx', import.meta.url), 'utf8');
  assert.match(home, /<SuppiChainyConciseSection\s*\/>/);
});
