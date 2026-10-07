import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import * as directoryModel from '../../components/suppliers/supplierDirectoryModel.js';
const { getSupplierPhases, findDirectoryCategories, normalizeDirectoryText } = directoryModel;

async function load(name) {
  const entry = fileURLToPath(new URL('../../components/suppliers/' + name, import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' } });
  const mod = new Module(entry); mod.filename = entry;
  mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
  mod._compile(result.outputFiles[0].text, entry);
  return mod.exports;
}
const phases = Array.from({ length: 18 }, (_, i) => ({ id: `${Math.floor(i / 3) + 1}.${i % 3 + 1}`, stage: Math.floor(i / 3) + 1, title: `Pha ${i}`, stageName: `Giai đoạn ${Math.floor(i / 3) + 1}` }));
const render = (Component, props) => renderToStaticMarkup(React.createElement(StaticRouter, { location: '/nha-cung-ung' }, React.createElement(Component, props)));

test('all 18 phases remain selectable with full names and stage context', async () => {
  const { default: Explorer } = await load('SupplierDirectoryExplorer.jsx');
  const html = render(Explorer, { phases, categories: [{ name: 'Cơ khí', count: 2 }], letters: ['A', 'C'], keywords: [{ query: 'CNC', labelVi: 'Gia công CNC' }], selectedLetter: 'TẤT CẢ', effectivePhase: '2.3', effectiveStage: '2', selectedCategory: 'all', selectedKeyword: '', letterCounts: { A: 0, C: 2 } });
  for (const phase of phases) assert.match(html, new RegExp(`data-phase="${phase.id}"`));
  assert.match(html, /data-phase="2.3"[^>]*aria-pressed="true"/);
  assert.match(html, /href="\/nganh-nghe\//);
  assert.match(html, /href="\/tu-khoa\//);
  assert.match(html, /aria-label="Tìm trong danh mục ngành"/);
  assert.match(html, /aria-expanded="true"/);
});

test('cards show every recorded phase, prioritise selected matching phase, never invent a phase', async () => {
  assert.deepEqual(getSupplierPhases({ phases: ['4.1', '5.3', '4.1', '99'] }, phases, '5.3').map(p => p.id), ['5.3', '4.1']);
  assert.deepEqual(getSupplierPhases({ phases: ['4.3'] }, phases, '1.1').map(p => p.id), ['4.3']);
  assert.deepEqual(getSupplierPhases({}, phases), []);
  assert.deepEqual(getSupplierPhases({ phases: '5.3' }, phases), []);
  assert.deepEqual(getSupplierPhases(null, phases), []);
  assert.deepEqual(getSupplierPhases({ phases: ['1.1', '1.2', '1.3'] }, phases).map(p => p.id), ['1.1', '1.2', '1.3']);
});

test('industry search ignores accents and supports multi-word queries without mutating categories', () => {
  const categories = [{ name: 'Áo đồng phục', count: 10 }, { name: 'Cơ khí CNC', count: 4 }];
  assert.equal(normalizeDirectoryText('  ĐỒNG PHỤC '), 'dong phuc');
  assert.equal(normalizeDirectoryText(), '');
  assert.equal(normalizeDirectoryText(null), 'null');
  assert.deepEqual(findDirectoryCategories(categories, 'DONG phuc'), [categories[0]]);
  assert.deepEqual(findDirectoryCategories(categories, 'cnc co'), [categories[1]]);
  assert.deepEqual(findDirectoryCategories(categories, ''), categories);
  assert.deepEqual(findDirectoryCategories(categories, 'missing'), []);
  assert.deepEqual(findDirectoryCategories([], 'co'), []);
  assert.equal(categories.length, 2);
});

test('only recorded phone numbers are masked; missing contacts never become fabricated numbers', () => {
  const { getSupplierMaskedPhone } = directoryModel;
  assert.equal(getSupplierMaskedPhone({ phone: '0912345678' }), '091 ••• 678');
  assert.equal(getSupplierMaskedPhone({ phone: 'null', hotline: '+84 912 345 678' }), '091 ••• 678');
  assert.equal(getSupplierMaskedPhone({ tel: 912345678 }), '912 ••• 678');
  assert.equal(getSupplierMaskedPhone({ phone: '091 ••• 678' }), '091 ••• 678');
  assert.equal(getSupplierMaskedPhone({ phone: 'undefined', hotline: 'not recorded' }), '');
  assert.equal(getSupplierMaskedPhone({ phone: '123' }), '');
  assert.equal(getSupplierMaskedPhone({}), '');
  assert.equal(getSupplierMaskedPhone(null), '');
});

test('supplier cards preserve three images, phases and masked contact without exposing direct addresses', async () => {
  const { default: Card } = await load('SupplierDirectoryCard.jsx');
  const supplier = { id: 'sample', name: 'Nhà cung ứng mẫu', category: 'Đồng phục', phases: ['5.3'], province: 'Đà Nẵng', phone: '0912345678', email: 'private@example.test', website: 'private.example.test' };
  const images = ['/samples/a.jpg', '/samples/b.jpg', '/samples/c.jpg'];
  const html = render(Card, { supplier, phases, images, avatar: '/samples/logo.jpg', maskedPhone: '091 ••• 678', detailUrl: '/nha-cung-ung/sample', onQuote: () => {} });
  for (const image of images) assert.match(html, new RegExp(`src="${image}"`));
  assert.match(html, /href="\/giai-doan-cung-ung\/pha\/5.3"/);
  assert.match(html, /091 ••• 678/);
  assert.doesNotMatch(html, /0912345678|private@example|private.example|mailto:|zalo.me|wa.me/);
  assert.match(html, /Mô tả nhu cầu/);
  assert.match(html, /Xem hồ sơ/);
  assert.doesNotMatch(html, /100 - 500|7-14 ngày|công suất ca 3/);
});

test('unknown phase and missing photos remain honest and usable', async () => {
  const { default: Card } = await load('SupplierDirectoryCard.jsx');
  const html = render(Card, { supplier: { name: 'Chưa phân loại' }, phases, images: [], maskedPhone: '', detailUrl: '/nha-cung-ung/sample', onQuote: () => {} });
  assert.match(html, /Chưa phân loại pha/);
  assert.doesNotMatch(html, /\/pha\/4.1/);
  assert.match(html, /Liên hệ được ẩn/);
});

test('filter controls keep KYC, all technical switches, province and phase selectors labelled', async () => {
  const { default: Filters } = await load('SupplierDirectoryFilters.jsx');
  const html = render(Filters, { phases, selectedKyc: 'gold', selectedProvince: 'Toàn quốc', selectedPhase: 'all', provinces: ['Toàn quốc', 'Đà Nẵng'], quickProvinces: ['Toàn quốc', 'Đà Nẵng'], filters: { api: true, fast: false, iso: false }, onChange: () => {}, onToggle: () => {}, onReset: () => {}, activeCount: 1 });
  for (const id of ['filter-api-ready', 'filter-fast-quote', 'filter-iso-certified', 'filter-province-select']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /value="5.3"/);
  assert.match(html, /<option[^>]*value="gold"[^>]*selected=""/);
  assert.match(html, /for="filter-kyc-select"/);
  assert.match(html, /<details[^>]*class="sd-quick-regions"/);
  assert.match(html, /Đặt lại/);
});
