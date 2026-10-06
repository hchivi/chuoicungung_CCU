import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = new URL('../../../', import.meta.url);
async function loadUi() {
  return import('../demandMarketplaceUi.js');
}
const records = [
  { id: 'a', title: 'Cần áo polo', category: 'May mặc', province: 'Đồng Nai', stageId: 5, status: 'ACTIVE_SOURCING', sampleRequired: true, quantity: 500, publishedAt: '2026-10-01', responseDeadline: 'Trước 15/11/2026' },
  { id: 'b', title: 'Carton 5 lớp', category: 'Bao bì', province: 'Hà Nội', stageId: 4, status: 'PAUSED', surveyRequired: true, publishedAt: '2026-10-02', responseDeadline: '2026-10-30T17:00:00Z' },
  { id: 'c', title: 'Gia công CNC', category: 'Cơ khí', province: 'Bình Dương', stageId: 4, status: 'CLOSED', publishedAt: '2026-10-03' },
];
test('stable categories and provinces come from the full public snapshot', async () => {
  const { getDemandFilterOptions } = await loadUi();
  const options = getDemandFilterOptions([...records, records[0], { category: null, province: '' }]);
  assert.deepEqual(new Set(options.categories), new Set(['May mặc', 'Bao bì', 'Cơ khí']));
  assert.deepEqual(new Set(options.provinces), new Set(['Đồng Nai', 'Hà Nội', 'Bình Dương']));
  assert.deepEqual(getDemandFilterOptions([]), { categories: [], provinces: [] });
});
test('Vietnamese search ignores case, accents and surrounding spaces; keeps inputs unchanged', async () => {
  const { filterPublicDemands } = await loadUi();
  assert.deepEqual(filterPublicDemands(records, { search: '  AO POLO ', status: 'all' }).map(r => r.id), ['a']);
  assert.deepEqual(filterPublicDemands(records, { search: 'dong nai', status: 'all' }).map(r => r.id), ['a']);
  assert.equal(records[0].title, 'Cần áo polo');
});
test('combined filters and state distinguish open, paused and closed opportunities', async () => {
  const { filterPublicDemands } = await loadUi();
  assert.equal(filterPublicDemands(records, { category: 'May mặc', province: 'Đồng Nai', stageId: '5', sampleRequired: true, status: 'open' }).length, 1);
  assert.equal(filterPublicDemands(records, { surveyRequired: true, status: 'open' }).length, 0);
  assert.deepEqual(filterPublicDemands(records, { status: 'PAUSED' }).map(r => r.id), ['b']);
  assert.deepEqual(filterPublicDemands(records, { status: 'CLOSED' }).map(r => r.id), ['c']);
  assert.equal(filterPublicDemands(records, { category: 'missing' }).length, 0);
  assert.equal(filterPublicDemands(records, { province: 'missing' }).length, 0);
  assert.equal(filterPublicDemands(records, { stageId: '1' }).length, 0);
});
test('deadline sorting supports ISO and Vietnamese dates, leaves undated last, never mutates the snapshot', async () => {
  const { filterPublicDemands, formatDemandDeadline } = await loadUi();
  assert.deepEqual(filterPublicDemands(records, { status: 'all', sortBy: 'expiring_soon' }).map(r => r.id), ['b', 'a', 'c']);
  assert.deepEqual(records.map(r => r.id), ['a', 'b', 'c']);
  assert.equal(formatDemandDeadline(records[0].responseDeadline), '15/11/2026');
  assert.equal(formatDemandDeadline(''), 'Chưa công bố');
  assert.equal(formatDemandDeadline('Tháng 11'), 'Tháng 11');
  assert.equal(formatDemandDeadline('31/02/2026'), '31/02/2026');
});
test('status copy and quantity never imply undisclosed capacity or quantities', async () => {
  const { getDemandStatus, formatDemandQuantity } = await loadUi();
  assert.equal(getDemandStatus('ACTIVE_SOURCING').canRespond, true);
  assert.equal(getDemandStatus('PAUSED').canRespond, false);
  assert.equal(getDemandStatus('CLOSED').canRespond, false);
  assert.equal(getDemandStatus('UNKNOWN').canRespond, false);
  assert.equal(formatDemandQuantity({ quantity: null, unit: 'bộ' }), 'Chưa công bố');
  assert.equal(formatDemandQuantity({ quantity: 0, unit: 'bộ' }), '0 bộ');
  assert.equal(formatDemandQuantity({ quantity: 500, unit: 'bộ' }), '500 bộ');
});
test('rendered marketplace preserves hero asset/copy, public-only records and critical actions', async () => {
  const entry = fileURLToPath(new URL('../DemandsPage.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react','react-dom','react-router-dom'], loader: { '.css': 'empty' }, plugins: [{ name: 'language-test', setup(builder) {
    builder.onResolve({ filter: /contexts\/LanguageContext$/ }, () => ({ path: 'language', namespace: 'test' }));
    builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const useLanguage = () => ({ t: x => x, lang: "vi" });' }));
  } }] });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('..', import.meta.url))); mod._compile(result.outputFiles[0].text, entry);
  const { StaticRouter } = createRequire(import.meta.url)('react-router-dom/server');
  const html = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/san-nhu-cau' }, React.createElement(mod.exports.default)));
  assert.match(html, /demand-marketplace/);
  assert.match(html, /\/images\/b2b_sourcing_demand_hero.jpg/);
  assert.match(html, /Nhu cầu mua hàng/); assert.match(html, /và tìm nhà cung ứng/);
  assert.match(html, /id="demand-search-input"/); assert.match(html, /id="demand-status-filter"/);
  assert.match(html, /data-demand-id=/); assert.match(html, /Hạn phản hồi/);
  assert.match(html, /Gửi hồ sơ đáp ứng/); assert.match(html, /href="\/dang-nhu-cau"/);
  assert.doesNotMatch(html, /procurement@precisiontech|0903 888 999|Bang_du_toan_noi_bo|internalBudget|targetPrice/);
  assert.doesNotMatch(html, /32\.000\+ Nhà cung ứng|Thông tin liên hệ.*mã hóa/);
});
test('uppercase styling is public-only and not applied to all subsection headings', async () => {
  const css = await readFile(new URL('src/index.css', root), 'utf8');
  assert.match(css, /\.ccu-public-shell #main-content h1[^}]+text-transform:\s*uppercase/s);
  assert.match(css, /\.ccu-public-shell \[data-hero-title\]/);
  assert.doesNotMatch(css, /\.ccu-public-shell h2\s*\{[^}]*text-transform:\s*uppercase/s);
});
test('demand marketplace reserves the loading viewport without applying it to every route', async () => {
  const app = await readFile(new URL('src/App.jsx', root), 'utf8');
  assert.match(app, /isDemandMarketplace\s*=\s*location.pathname === '\/san-nhu-cau'/);
  assert.match(app, /isPhotographicRoute \|\| isDemandMarketplace/);
});
test('existing hero canvas honors live reduced-motion changes and cleans up the listener', async () => {
  const source = await readFile(new URL('src/components/demands/B2bTradeNetworkCanvas.jsx', root), 'utf8');
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /addEventListener\('change'/);
  assert.match(source, /removeEventListener\('change'/);
});
test('marketplace internal links target registered public routes, not the homepage fallback', async () => {
  const app = await readFile(new URL('src/App.jsx', root), 'utf8');
  const page = await readFile(new URL('src/pages/DemandsPage.jsx', root), 'utf8');
  for (const [, route] of page.matchAll(/to="(\/[^"?]*)"/g)) assert.ok(app.includes('path="' + route + '"'), 'Unregistered route: ' + route);
});
test('marketplace text, primary actions and input boundaries have readable contrast', async () => {
  const css = await readFile(new URL('src/pages/DemandMarketplace.css', root), 'utf8');
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const contrast = (first, second) => { const a = luminance(first), b = luminance(second); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
  const muted = css.match(/--dm-muted: (#[a-f0-9]{6})/i)[1];
  const boundary = css.match(/\.dm-search\s*\{[^}]*border: 1px solid (#[a-f0-9]{6})/i)[1];
  assert.ok(contrast(muted, '#ffffff') >= 4.5);
  assert.ok(contrast(muted, '#f5f8f6') >= 4.5);
  assert.ok(contrast('#ffffff', '#127b4b') >= 4.5);
  assert.ok(contrast('#006039', '#eaf3ed') >= 4.5);
  assert.ok(contrast(boundary, '#ffffff') >= 3, 'Input boundary must be distinguishable from white');
  assert.ok(contrast(boundary, '#f5f8f6') >= 3, 'Input boundary must be distinguishable from its field background');
});
