import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { publicParticipants, featuredParticipants, featuredParticipantPage } from '../thaiHoaEventLandingModel.js';

test('supplier ordering pins only the platform, preserves peers and never mutates input', () => {
  const input = [{id: 'a', name: 'A', role: 'supplier'}, {id: 'b', name: 'B', role: 'supplier'}, {id: 'ccu', name: '  chuỗi  cung ứng ', role: 'supplier'}, {id: 'buyer', name: 'CHUỖI CUNG ỨNG', role: 'buyer'}, {id: 'none', role: 'supplier'}];
  assert.deepEqual(featuredParticipants(input, 'supplier').map(p => p.id), ['ccu', 'a', 'b', 'none']);
  assert.deepEqual(input.map(p => p.id), ['a', 'b', 'ccu', 'buyer', 'none']);
  assert.deepEqual(featuredParticipants(input, 'buyer').map(p => p.id), ['buyer']);
  assert.deepEqual(featuredParticipants([], 'supplier'), []);
});

test('featured pagination clamps stale pages, preserves all records on expansion and handles empty groups', () => {
  const items = Array.from({ length: 9 }, (_, id) => ({ id }));
  assert.deepEqual(featuredParticipantPage(items, 0, false).shown.map(p => p.id), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(featuredParticipantPage(items, 1, false).shown.map(p => p.id), [8]);
  assert.deepEqual(featuredParticipantPage(items, 50, false), { current: 1, lastPage: 1, shown: [items[8]] });
  assert.equal(featuredParticipantPage(items, -1, false).current, 0);
  assert.equal(featuredParticipantPage(items, 0, true).shown.length, 9);
  assert.deepEqual(featuredParticipantPage([], 1, false), { current: 0, lastPage: 0, shown: [] });
});

test('before-event confirmed companies expose both featured groups, honest empty states and bounded cards', async () => {
  const entry = fileURLToPath(new URL('../../components/programs/ThaiHoaConfirmedParticipants.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-router-dom'], loader: { '.css': 'empty' } });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url))); mod._compile(result.outputFiles[0].text, entry);
  const render = props => renderToStaticMarkup(React.createElement(StaticRouter, null, React.createElement(mod.exports.default, props)));
  const empty = render({});
  for (const label of ['Những doanh nghiệp tiêu biểu đã xác nhận tham gia', 'Nhà máy / Buyer nổi bật', 'Nhà cung ứng / Supplier nổi bật', 'Chờ công bố', 'id="doanh-nghiep"']) assert.ok(empty.includes(label), label);
  assert.doesNotMatch(empty, /ABC Foods|Green Pallet|TTF Furniture/);
  const fixture = Array.from({length: 10}, (_, i) => ({ id: 'buyer-' + i, name: 'Nhà máy kiểm thử ' + i, role: 'BUYER', status: 'CONFIRMED', visibility: 'PUBLIC', publishStatus: 'PUBLISHED', logo: '/test-logo.png', industry: 'Thực phẩm', publicSummary: 'Cần bao bì carton', profilePath: '/nha-may/test-' + i }));
  fixture.push(...Array.from({length: 8}, (_, i) => ({ ...fixture[0], id: 'supplier-' + i, name: 'NCC kiểm thử ' + i, role: 'SUPPLIER', publicSummary: 'Cung cấp pallet' })), { ...fixture[0], id: 'ccu', name: 'CHUỖI CUNG ỨNG', role: 'SUPPLIER' }, { ...fixture[0], id: 'hidden', name: 'private-secret', visibility: 'INTERNAL' });
  const original = JSON.stringify(fixture);
  const populated = render({ participants: publicParticipants({ participants: fixture }), open: true });
  assert.match(populated, /Xem tất cả/);
  assert.match(populated, /Nhà máy kiểm thử 7/);
  assert.doesNotMatch(populated, /Nhà máy kiểm thử 8|NCC kiểm thử 7|private-secret/);
  assert.equal((populated.match(/<article/g) || []).length, 16);
  assert.ok(populated.indexOf('CHUỖI CUNG ỨNG') < populated.indexOf('NCC kiểm thử 0'));
  assert.ok(populated.indexOf('NCC kiểm thử 0') < populated.indexOf('NCC kiểm thử 1'));
  assert.equal(JSON.stringify(fixture), original, 'display ordering must not mutate source records');
  assert.doesNotMatch(populated, /<details/);
  assert.match(populated, /<button[^>]*aria-haspopup="dialog"[^>]*>Nhà máy kiểm thử 0/);
  assert.match(populated, /aria-label="Chi tiết Nhà máy kiểm thử 0"/);
  assert.ok(populated.includes('Nhóm nhà máy tiếp theo'));
  const renderDialog = (item, open) => renderToStaticMarkup(React.createElement(StaticRouter, null, React.createElement(mod.exports.ParticipantDialog, { item, open, onClose: () => {} })));
  const buyer = renderDialog(publicParticipants({participants:fixture})[0], false);
  for (const label of ['<dialog', 'aria-modal="true"', 'aria-labelledby="th-company-dialog-title"', 'Đóng chi tiết doanh nghiệp', 'Cần bao bì carton', '/nha-may/test-0', 'Chương trình đã đóng đăng ký gặp']) assert.ok(buyer.includes(label), label);
  assert.match(buyer, /disabled=""[^>]*>Đề nghị gặp/);
  const supplier = renderDialog({id:'s',role:'supplier',name:'NCC',productsServices:['Pallet']}, true);
  assert.match(supplier, /NHÀ CUNG ỨNG \/ SUPPLIER/);
  assert.match(supplier, /Pallet/);
  assert.doesNotMatch(supplier, /disabled=""|Chương trình đã đóng|Xem hồ sơ/);
});

test('block titles are uppercase without forcing company names to uppercase', () => {
  const css = readFileSync(new URL('../ThaiHoaEventLanding.css', import.meta.url), 'utf8');
  assert.match(css, /\.th-landing h2,\s*\.th-landing h3\s*\{[^}]*text-transform:uppercase/);
  assert.match(css, /\.th-landing h4\s*\{[^}]*text-transform:none/);
});
