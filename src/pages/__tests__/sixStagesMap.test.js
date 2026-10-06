import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { stagesData } from '../../data/mockData.js';
import { build } from 'esbuild';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const loadUi = () => import('../sixStagesMapUi.js');
test('all original six stages and eighteen phases retain their complete data', () => {
  assert.equal(stagesData.length, 6);
  assert.equal(stagesData.flatMap(stage => stage.phases).length, 18);
  assert.equal(createHash('sha256').update(JSON.stringify(stagesData)).digest('hex'), '136f1da869c4e261b52388666532db3d904625abb60d9619af39c339ddccd2c2');
});
test('saved stage and phase are normalized together; corrupt or stale values cannot mismatch', async () => {
  const { resolveMapSelection } = await loadUi();
  assert.deepEqual(resolveMapSelection('2', '1.2'), { stageId: 2, phaseId: '2.1' });
  assert.deepEqual(resolveMapSelection('all', '5.3'), { stageId: 'all', phaseId: '5.3' });
  for (const input of [null, '', 'missing', '999', '2invalid']) assert.deepEqual(resolveMapSelection(input, 'bad'), { stageId: 1, phaseId: '1.1' });
  assert.deepEqual(resolveMapSelection('6', null), { stageId: 6, phaseId: '6.1' });
});
test('switching stage retains its selected phase or chooses its first phase; overview retains focus phase', async () => {
  const { selectMapStage } = await loadUi();
  assert.deepEqual(selectMapStage({ stageId: 1, phaseId: '1.2' }, 1), { stageId: 1, phaseId: '1.2' });
  assert.deepEqual(selectMapStage({ stageId: 1, phaseId: '1.2' }, 4), { stageId: 4, phaseId: '4.1' });
  assert.deepEqual(selectMapStage({ stageId: 5, phaseId: '5.3' }, 'all'), { stageId: 'all', phaseId: '5.3' });
});
test('selecting a phase respects overview and returns the correct parent stage', async () => {
  const { selectMapPhase, getMapContext } = await loadUi();
  assert.deepEqual(selectMapPhase({ stageId: 'all', phaseId: '1.2' }, '6.3'), { stageId: 'all', phaseId: '6.3' });
  assert.deepEqual(selectMapPhase({ stageId: 1, phaseId: '1.2' }, '6.3'), { stageId: 6, phaseId: '6.3' });
  const ctx = getMapContext({ stageId: 'all', phaseId: '6.3' });
  assert.equal(ctx.stage.id, 6); assert.equal(ctx.phase.slug, 'chuyen-doi-tai-cau-truc');
  assert.equal(getMapContext({ stageId: 99, phaseId: 'bad' }).phase.id, '1.1');
  assert.equal(selectMapPhase({ stageId: 2, phaseId: '2.3' }, 'bad').phaseId, '2.3');
});
test('keyword links use existing canonical routes and safe URL encoding', async () => {
  const { mapKeywordHref } = await loadUi();
  assert.equal(mapKeywordHref('thép & ĐTM'), '/tu-khoa/thep-dtm?q=th%C3%A9p%20%26%20%C4%90TM');
});
test('six stage palettes are distinct and keep readable text on tinted/selected surfaces', async () => {
  const { MAP_STAGE_PALETTES, mapStageStyle } = await loadUi();
  assert.equal(Object.keys(MAP_STAGE_PALETTES).length, 6);
  assert.equal(new Set(Object.values(MAP_STAGE_PALETTES).map(item => item.ink)).size, 6);
  const lum = hex => { const c = hex.slice(1).match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4); return c[0]*.2126+c[1]*.7152+c[2]*.0722; };
  const ratio = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  for (const stage of stagesData) {
    const palette = MAP_STAGE_PALETTES[stage.id];
    assert.ok(ratio('#ffffff', palette.ink) >= 4.5);
    for (const surface of [palette.surface, palette.selected]) {
      assert.ok(ratio(palette.ink, surface) >= 4.5);
      assert.ok(ratio('#53665b', surface) >= 4.5);
    }
    assert.equal(mapStageStyle(stage.id)['--stage-color'], stage.color);
    assert.equal(mapStageStyle(stage.id)['--stage-ink'], palette.ink);
  }
  assert.deepEqual(mapStageStyle(99), mapStageStyle(1));
});
test('floating board and cinematic cover are scoped and explicitly collapse for mobile/reduced motion', async () => {
  const css = await readFile(new URL('../SixStagesMapPage.css', import.meta.url), 'utf8');
  assert.match(css, /\.six-stages-map \.sm-hero-cinematic/);
  assert.match(css, /\.six-stages-map \.sm-floating-board[^}]*perspective:/s);
  assert.match(css, /\.six-stages-map \.sm-stage-card[^}]*rotate/s);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.six-stages-map \.sm-phase-card[^}]*var\(--stage-surface\)/s);
});
test('lifecycle map reserves its lazy loading fold without changing unrelated routes', async () => {
  const app = await readFile(new URL('../../App.jsx', import.meta.url), 'utf8');
  assert.match(app, /isLifecycleMap = location.pathname === '\/ban-do-6-giai-doan'/);
  assert.match(app, /isPhotographicRoute \|\| isDemandMarketplace \|\| isLifecycleMap/);
});
test('phase details offer a return path to the phase explorer', async () => {
  const source = await readFile(new URL('../SixStagesMapPage.jsx', import.meta.url), 'utf8');
  assert.match(source, /href="#sm-phase-list"/);
  assert.match(source, /id="sm-detail-title" tabIndex=\{-1\}/);
});
test('map body, muted text and action colors are readable on all surfaces', async () => {
  const css = await readFile(new URL('../SixStagesMapPage.css', import.meta.url), 'utf8');
  const lum = hex => { const c = hex.slice(1).match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4); return c[0]*.2126+c[1]*.7152+c[2]*.0722; };
  const ratio = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const muted = css.match(/--sm-muted: (#[a-f0-9]{6})/i)[1];
  for (const bg of ['#ffffff','#f5f8f3','#f0f6eb','#f3f6ef','#e5eee0']) {
    assert.ok(ratio(muted,bg)>=4.5); assert.ok(ratio('#006039',bg)>=4.5);
  }
  assert.ok(ratio('#ffffff','#127b4b')>=4.5);
});
test('rendered page presents the real interactive map, preserves original keyword block, and avoids fictitious proof', async () => {
  const entry = fileURLToPath(new URL('../SixStagesMapPage.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react','react-dom','react-router-dom'], loader: { '.css': 'empty' }, plugins: [{ name: 'language', setup(builder) {
    builder.onResolve({ filter: /contexts\/LanguageContext$/ }, () => ({ path: 'language', namespace: 'test' }));
    builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const useLanguage = () => ({ t: x => x, lang: "vi" });' }));
  } }] });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('..', import.meta.url))); mod._compile(result.outputFiles[0].text, entry);
  const { StaticRouter } = createRequire(import.meta.url)('react-router-dom/server');
  const html = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/ban-do-6-giai-doan' }, React.createElement(mod.exports.default)));
  assert.match(html, /class="six-stages-map"/);
  assert.match(html, /sm-hero-cinematic/);
  assert.match(html, /sm-floating-board/);
  assert.match(html, /sm-stage-rail/);
  assert.doesNotMatch(html, /class="sm-orbit"/);
  assert.equal((html.match(/data-stage-select="/g) || []).length, 6);
  assert.equal((html.match(/data-phase-select="/g) || []).length, 3);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /href="\/pha\/phap-ly-thu-tuc"/);
  assert.match(html, /href="\/giai-doan\/chuan-bi-dau-tu"/);
  for (const phase of stagesData[0].phases) assert.ok(html.includes(phase.summary.replaceAll('&', '&amp;')));
  for (const stage of stagesData) {
    const boardCard = html.match(new RegExp('data-stage-select="' + stage.id + '"[^]*?<\\/button>'))[0];
    for (const phase of stage.phases) assert.ok(boardCard.includes(phase.title.replaceAll('&', '&amp;')), 'Floating card preserves ' + phase.id);
  }
  assert.doesNotMatch(html, /24\.000|Top 1%|500\+ Triệu|VCCI-STD|30%|DN Xác Thực/);
  const source = await readFile(entry, 'utf8');
  const block = source.slice(source.indexOf('export const PHASE_ORIENTATION_KEYWORDS'), source.indexOf('export default function'));
  assert.equal(createHash('sha256').update(block).digest('hex'), 'ce2299242c0d48d03cd0bcaae0e7d7c5de9df23f7401329c8e4570dee90fe898');
});
