import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';
import { SEED_MASTER_CATALOGUES, CATALOGUE_TYPES, getAllCatalogues } from '../../data/cataloguesData.js';

const require = createRequire(import.meta.url);
async function render(name, props) {
  const entry = fileURLToPath(new URL(`../../components/catalogues/${name}.jsx`, import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node',
    format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' } });
  const bundled = new Module(entry);
  bundled.filename = entry;
  bundled.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
  bundled._compile(result.outputFiles[0].text, entry);
  const { StaticRouter } = require('react-router-dom/server');
  return renderToStaticMarkup(React.createElement(StaticRouter, { location: '/catalogue' },
    React.createElement(bundled.exports.default, props)));
}

test('catalogue cards retain full record information, images and detail destinations', async () => {
  for (const catalogue of SEED_MASTER_CATALOGUES) {
    const html = await render('CatalogueCard', { catalogue });
    assert.ok(html.includes(`href="/catalogue/${catalogue.slug}"`));
    for (const field of ['title', 'shortDescription', 'categoryName', 'publisherName', 'programTitle', 'industrialParkName']) {
      if (catalogue[field]) assert.ok(html.includes(catalogue[field].replaceAll('&', '&amp;')), field);
    }
    assert.ok(html.includes(catalogue.coverUrl.replaceAll('&', '&amp;')));
    assert.match(html, /data-catalogue-card=/);
    assert.match(html, /Xem bản số/);
    assert.doesNotMatch(html, /<svg|animate-pulse|line-clamp/);
  }
});

test('catalogue cards use the selected edition and only confirmed printing quantities', async () => {
  const catalogue = { ...SEED_MASTER_CATALOGUES[0], currentEditionId: 'latest', editions: [
    { id: 'old', editionCode: 'OLD' },
    { id: 'latest', editionCode: 'LATEST', publicationDate: '2026-10-07', format: 'ONLINE_ONLY',
      plannedPrintQuantity: 98765, confirmedPrintQuantity: 0, entries: [
        { approvalStatus: 'APPROVED' }, { approvalStatus: 'SUBMITTED' },
      ] },
  ] };
  const html = await render('CatalogueCard', { catalogue });
  assert.match(html, /LATEST/);
  assert.doesNotMatch(html, /OLD|98[.,]765|Số bản in xác nhận|Tải PDF/);
  assert.match(html, /1<\/strong>[^<]*hồ sơ đã duyệt/);
  assert.match(html, /7\/10\/2026/);
});

test('catalogue menu preserves all types, labelled filters, archive and reset controls', async () => {
  const html = await render('CatalogueDiscovery', {
    catalogues: SEED_MASTER_CATALOGUES, resultCount: 7,
    filters: { search: '', type: 'ALL', category: 'ALL', province: 'ALL', format: 'ALL', archived: false },
    categories: [], provinces: [], onFilterChange() {}, onReset() {},
  });
  for (const type of Object.values(CATALOGUE_TYPES)) assert.ok(html.includes(type.shortName));
  for (const id of ['cl-type', 'cl-search', 'cl-category', 'cl-province', 'cl-format']) {
    assert.ok(html.includes(`for="${id}"`));
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-controls="cl-advanced-filters"/);
  assert.match(html, /Ấn phẩm lưu trữ/);
  assert.match(html, /Đặt lại/);
});

test('catalogue filtering contracts remain unchanged', () => {
  assert.equal(getAllCatalogues({ status: 'ACTIVE' }).length, SEED_MASTER_CATALOGUES.filter(c => c.status !== 'ARCHIVED').length);
  for (const type of Object.keys(CATALOGUE_TYPES)) {
    assert.ok(getAllCatalogues({ catalogueType: type }).every(c => c.catalogueType === type));
  }
  assert.ok(getAllCatalogues({ search: 'zzzz-no-catalogue' }).length === 0);
});

test('catalogue redesign has scoped CSS and keeps page ownership and callbacks', async () => {
  const css = await readFile(new URL('../../components/catalogues/CatalogueDiscovery.css', import.meta.url), 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /white-space: nowrap/);
  assert.doesNotMatch(css, /transition: all|linear-gradient|#[a-f0-9]{3,8}\b/i);
  const page = await readFile(new URL('../CataloguesPage.jsx', import.meta.url), 'utf8');
  for (const item of ['<CatalogueDiscovery', 'handleQuickViewOnline', 'handleDownloadPdf', 'CatalogueParticipationModal', '/images/catalogue_hero.jpg']) {
    assert.ok(page.includes(item));
  }
});
