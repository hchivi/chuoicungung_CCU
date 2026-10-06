import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const entry = fileURLToPath(new URL('../../components/home/DualGearsMatchingSection.jsx', import.meta.url));
async function loadSection() {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' } });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url))); mod._compile(result.outputFiles[0].text, entry);
  return mod.exports;
}

test('matching stages keep all six existing demand/solution keyword pairs and canonical links', async () => {
  const { MATCHING_STAGES } = await loadSection();
  assert.equal(MATCHING_STAGES.length, 6);
  for (const stage of MATCHING_STAGES) {
    assert.equal(stage.stageKeywords.length, 3); assert.equal(stage.solutionKeywords.length, 3);
    assert.ok(stage.stageSlug.startsWith('/giai-doan/'));
  }
  const source = await readFile(entry, 'utf8');
  const block = source.slice(source.indexOf('export const MATCHING_STAGES'), source.indexOf('export default function'));
  assert.equal(createHash('sha256').update(block).digest('hex'), 'be60a6a4180b7b4a79aca0f2a120bcaa16b828c8eceb41966372fe09cb6b7679');
});

test('cycle is paired and wraps safely, with no per-frame React updates', async () => {
  const { nextMatchingIndex, MATCHING_CYCLE_MS } = await import('../../components/home/dualGearsUi.js');
  assert.equal(MATCHING_CYCLE_MS, 4500);
  assert.equal(nextMatchingIndex(0, 6), 1); assert.equal(nextMatchingIndex(5, 6), 0);
  assert.equal(nextMatchingIndex(-1, 6), 0); assert.equal(nextMatchingIndex(99, 6), 0);
  assert.equal(nextMatchingIndex(NaN, 6), 0); assert.equal(nextMatchingIndex(0, 0), 0);
});

test('pause, live reduced motion, hidden tab, offscreen and hub focus stop automatic changes', async () => {
  const { matchingCanRun } = await import('../../components/home/dualGearsUi.js');
  const ready = { paused: false, reducedMotion: false, hidden: false, inView: true, hubFocused: false };
  assert.equal(matchingCanRun(ready), true);
  for (const key of ['paused', 'reducedMotion', 'hidden', 'hubFocused']) assert.equal(matchingCanRun({ ...ready, [key]: true }), false);
  assert.equal(matchingCanRun({ ...ready, inView: false }), false);
});

test('only the traced inner white contour rotates, with a large rear demand gear and small front solution gear', async () => {
  const { default: Section } = await loadSection();
  const { StaticRouter } = createRequire(import.meta.url)('react-router-dom/server');
  const html = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/' }, React.createElement(Section)));
  assert.match(html, /id="khop-lenh-cung-cau"/);
  assert.equal((html.match(/data-gear-rotor="/g) || []).length, 2);
  assert.equal((html.match(/src="\/logo_inner_gear.svg"/g) || []).length, 2);
  assert.match(html, /data-gear-size="large" data-gear-layer="rear"/);
  assert.match(html, /data-gear-size="small" data-gear-layer="front"/);
  assert.equal((html.match(/data-matching-stage="/g) || []).length, 6);
  assert.match(html, /data-matching-pause/);
  assert.match(html, /data-gear-hub="demand"[^]*?href="\/giai-doan\/chuan-bi-dau-tu"/);
  assert.match(html, /data-gear-hub="solution"[^]*?href="\/nha-cung-ung"/);
  assert.doesNotMatch(html, /src="\/logo_only.png"|maskImage|logo_mono_shaded|ĐANG KHỚP LỆNH|ĂN KHỚP GIAI ĐOẠN/);
});

test('opposite six-lobe rotation preserves white hubs, front/rear depth and explicit mobile/reduced motion', async () => {
  const css = await readFile(new URL('../../components/home/DualGearsMatchingSection.css', import.meta.url), 'utf8');
  assert.match(css, /\.dual-gears-matching \.dg-gear-outline[^}]*animation: dg-spin 36s linear infinite/s);
  assert.match(css, /\.dual-gears-matching \.dg-gear-solution \.dg-gear-outline[^}]*animation-direction: reverse/s);
  assert.match(css, /\.dual-gears-matching \.dg-gear-demand[^}]*z-index: 0/s);
  assert.match(css, /\.dual-gears-matching \.dg-gear-solution[^}]*z-index: 1/s);
  assert.match(css, /--small-gear-size:/);
  assert.match(css, /\.dual-gears-matching \.dg-hub[^}]*background: #fff[^}]*border:/s);
  assert.match(css, /\.dual-gears-matching \.dg-connector/);
  assert.match(css, /max-width: 767px/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /animation-play-state: paused/);
});

test('inner-only vector is a white six-lobed contour with a fine line, not the colored petals', async () => {
  const svg = await readFile(new URL('../../../public/logo_inner_gear.svg', import.meta.url), 'utf8');
  assert.match(svg, /viewBox="0 0 600 600"/);
  assert.match(svg, /fill="#ffffff"/);
  assert.match(svg, /stroke="#006039"/);
  assert.match(svg, /M 300 12/); // Actual inner-hole upper edge traced from the supplied logo.
  assert.doesNotMatch(svg, /image|linearGradient|radialGradient|filter/);
});
