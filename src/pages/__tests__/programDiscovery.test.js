import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { PROGRAMS_DATA, PROGRAM_STATUSES, PROGRAM_TYPES } from '../../data/programsData.js';
import { getProgramCardState } from '../../components/programs/programCardModel.js';

async function load(file) {
  const entry = fileURLToPath(new URL('../../components/' + file, import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' } });
  const mod = new Module(entry); mod.filename = entry;
  mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
  mod._compile(result.outputFiles[0].text, entry);
  return mod.exports;
}
const render = (Component, props) => renderToStaticMarkup(React.createElement(StaticRouter, null, React.createElement(Component, props)));
const escaped = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#x27;');

test('program cards preserve every title, need, date, location, host, image and count, without fee teaser', async () => {
  const { default: Card } = await load('programs/ProgramCard.jsx');
  for (const program of PROGRAMS_DATA) {
    const html = render(Card, { program });
    for (const value of [program.title || program.name, program.shortDescription || program.description, program.date, program.time, program.location, program.organizer, ...(program.needGroup || [])].filter(Boolean)) assert.ok(html.includes(escaped(String(value))), `Missing ${value}`);
    assert.ok(html.includes(program.image));
    assert.match(html, /data-program-card/);
    assert.doesNotMatch(html, /Chi phí tham gia|Xem phí|feeDisplay|line-clamp|truncate/);
    assert.ok(html.includes(`/chuong-trinh/${program.slug || program.id}`));
    if (program.isSponsored) assert.match(html, /Được tài trợ/);
    for (const count of [program.factoriesCount, program.suppliersCount].filter(v => v != null)) assert.ok(html.includes(String(count)));
  }
  assert.equal(render(Card, { program: null }), '');
});

test('all seven program statuses retain distinct action semantics and canonical status support', async () => {
  const actions = ['detail', 'interest', 'interest', 'detail', 'recap', 'detail', 'detail'];
  for (const [index, status] of PROGRAM_STATUSES.entries()) {
    assert.equal(getProgramCardState({ status: status.id }).action, actions[index]);
    assert.deepEqual(getProgramCardState({ status: status.id }), getProgramCardState({ programStatus: status.code }));
  }
  assert.equal(getProgramCardState({ statusName: 'Khác' }).label, 'Khác');
  assert.equal(getProgramCardState({}).action, 'detail');
});

test('pinned supplier directory has independent expansion state, preventing scroll-height feedback', async () => {
  const source = await readFile(new URL('../../components/suppliers/SupplierDirectoryExplorer.jsx', import.meta.url), 'utf8');
  const scrollHandler = source.slice(source.indexOf('const handleScroll'), source.indexOf("window.addEventListener('scroll'"));
  assert.doesNotMatch(scrollHandler, /setExpanded\(/);
  assert.match(source, /aria-expanded=\{stickyExpanded\}/);
  assert.match(source, /id="sd-pinned-catalogue-content"/);
});

test('program navigation exposes every type and labelled filters without offscreen-only menu items', async () => {
  const { default: Explorer } = await load('programs/ProgramDiscoveryMenu.jsx');
  const html = render(Explorer, { programs: PROGRAMS_DATA, resultCount: 11, activeType: 'all', filters: {}, onTypeChange: () => {}, onFilterChange: () => {}, onReset: () => {} });
  for (const type of PROGRAM_TYPES) assert.ok(html.includes(`data-program-type="${type.id}"`));
  for (const filter of ['search', 'status', 'zone', 'industry', 'role', 'format', 'time']) assert.match(html, new RegExp(`id="pd-${filter}"`));
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-controls="pd-extra-filters"/);
});

test('program category navigation uses only text and actual counts, without decorative icons', async () => {
  const { default: Explorer } = await load('programs/ProgramDiscoveryMenu.jsx');
  const html = render(Explorer, { programs: PROGRAMS_DATA, resultCount: 11, activeType: 'all', filters: {}, onTypeChange: () => {}, onFilterChange: () => {}, onReset: () => {} });
  const navigation = html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0];
  assert.ok(navigation);
  assert.doesNotMatch(navigation, /<svg\b|<img\b|pd-type-arrow/);
  for (const type of PROGRAM_TYPES) {
    const count = type.id === 'all' ? PROGRAMS_DATA.length : PROGRAMS_DATA.filter(program => program.type === type.id).length;
    assert.ok(navigation.includes(`${type.name}, ${count} chương trình`));
  }
});

test('supplier profile cards keep recorded phases, gallery and protected contact within distinct capability layout', async () => {
  const { default: Card } = await load('suppliers/SupplierDirectoryCard.jsx');
  const html = render(Card, { supplier: { name: 'Công ty kỹ thuật', category: 'Cơ khí', phases: ['2.3'], products: ['CNC', 'Khuôn', 'Gia công'] }, phases: [{ id: '2.3', stage: 2, title: 'Cơ điện' }], images: ['/a.jpg', '/b.jpg', '/c.jpg'], detailUrl: '/nha-cung-ung/test', maskedPhone: '091 ••• 678' });
  assert.match(html, /sd-capability-head/);
  assert.match(html, /<details[^>]*class="sd-card-keywords"/);
  for (const word of ['CNC', 'Khuôn', 'Gia công', 'Pha 2.3', '091 ••• 678']) assert.ok(html.includes(word));
  assert.doesNotMatch(html, /mailto:|tel:|zalo.me/);
});

test('both grids are bounded at three columns with explicit narrow-screen fallbacks', async () => {
  const programCSS = await readFile(new URL('../../components/programs/ProgramDiscovery.css', import.meta.url), 'utf8');
  const supplierCSS = await readFile(new URL('../../components/suppliers/SupplierDirectory.css', import.meta.url), 'utf8');
  assert.match(programCSS, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(supplierCSS, /repeat\(3, minmax\(0, 1fr\)\)/);
  const programGridRules = [...programCSS.matchAll(/\.pd-program-grid\s*\{([^}]+)\}/g)].map(match => match[1]).join('\n');
  assert.doesNotMatch(programGridRules, /repeat\([4-9],/);
  assert.match(programCSS, /prefers-reduced-motion/);
});

test('program filter frame has a complete border and inner spacing', async () => {
  const css = await readFile(new URL('../../components/programs/ProgramDiscovery.css', import.meta.url), 'utf8');
  const rule = css.match(/\.pd-filter-panel\s*\{([^}]+)\}/)[1];
  assert.match(rule, /border: 1px solid var\(--pd-rule\)/);
  assert.match(rule, /padding: /);
  assert.doesNotMatch(rule, /border-block:/);
});

test('invitation intake keeps seven labelled fields, consent and honest local-save states', async () => {
  const { default: Invitation } = await load('programs/ProgramInvitationSignup.jsx');
  const data = { name: '', company: '', email: '', phone: '', zone: 'Miền Nam', industry: 'Cơ khí', role: 'supplier', consent: true };
  const props = { data, industries: ['Cơ khí'], onChange: () => {}, onSubmit: () => {}, submitted: false };
  const html = render(Invitation, props);
  for (const key of ['name', 'company', 'email', 'phone', 'zone', 'industry', 'role']) {
    assert.ok(html.includes(`id="invitation-${key}"`));
    assert.ok(html.includes(`for="invitation-${key}"`));
  }
  assert.match(html, /Nhận thư mời/);
  assert.match(html, /type="checkbox"[^>]*required/);
  assert.match(html, /lưu trên trình duyệt/);
  assert.doesNotMatch(html, /<svg\b|🔒|khớp lệnh nhu cầu chính xác/);
  const success = render(Invitation, { ...props, submitted: true });
  assert.match(success, /role="status"/);
  assert.match(success, /Đã lưu lựa chọn/);
  const error = render(Invitation, { ...props, error: 'Không thể lưu trên trình duyệt này.' });
  assert.match(error, /role="alert"/);
});
