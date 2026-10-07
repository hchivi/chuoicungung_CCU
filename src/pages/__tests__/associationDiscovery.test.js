import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';
import { getAssociationsListing } from '../../data/associationsData.js';

const require = createRequire(import.meta.url);
const entry = fileURLToPath(new URL('../../components/association/AssociationDiscovery.jsx', import.meta.url));
const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' } });
const bundled = new Module(entry);
bundled.filename = entry;
bundled.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
bundled._compile(result.outputFiles[0].text, entry);
const { StaticRouter } = require('react-router-dom/server');
const render = (component, props) => renderToStaticMarkup(React.createElement(StaticRouter, { location: '/hiep-hoi' }, React.createElement(component, props)));
const { default: Discovery, AssociationDiscoveryCard: Card, uniqueAssociations, getAssociationProgramPath } = bundled.exports;
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const props = { listingData: getAssociationsListing(), sectors: [{ id: 'all', label: 'Tất cả lĩnh vực' }, { id: 'cơ khí', label: 'Cơ khí & Tự động hóa' }], filters: { search: '', sector: 'all', region: 'all', scope: 'all', openPrograms: false, catalogue: false, sort: 'default' }, onChange() {}, onQuickFilter() {}, onReset() {}, onClaim() {} };

test('invitation replaces unverifiable proof metrics with clear collaboration and discovery paths', () => {
  const html = render(Discovery, props);
  assert.match(html, /Cộng đồng vững mạnh/);
  assert.match(html, /Để năng lực được nhìn thấy/); assert.match(html, /Bắt đầu từ đúng cộng đồng/);
  for (const path of ['/dich-vu/to-chuc-ket-noi?source=association', '/tao-ho-so?type=association', '#danh-sach-hiep-hoi', '/chuong-trinh']) assert.ok(html.includes(escape(path)));
  assert.match(html, /không mặc định là đối tác/);
  assert.doesNotMatch(html, /100%|Xác Nhận Thật|marketing ảo|thẩm định tư cách|<svg|animate-pulse/);
});

test('directory exposes all existing filter dimensions with labels and result announcement', () => {
  const html = render(Discovery, props);
  for (const id of ['ad-search', 'ad-scope', 'ad-region', 'ad-sector', 'ad-sort']) {
    assert.ok(html.includes(`for="${id}"`)); assert.ok(html.includes(`id="${id}"`));
  }
  for (const value of ['NATIONAL', 'REGIONAL', 'PROVINCIAL', 'SPECIALIZED_INDUSTRY', 'default', 'programs', 'members', 'az']) assert.ok(html.includes(`value="${value}"`));
  assert.match(html, /aria-pressed="true"/); assert.match(html, /aria-live="polite"/);
  assert.match(html, /Có chương trình liên kết/); assert.match(html, /Có catalogue \/ kỷ yếu/);
  assert.equal((html.match(/data-association-card=/g) || []).length, new Set(props.listingData.associations.map(a => a.id)).size);
});

test('organization cards retain complete names, images, industries, geography and program relationships', () => {
  for (const association of uniqueAssociations(props.listingData.associations)) {
    const html = render(Card, { association, onClaim() {} });
    assert.ok(html.includes(escape(association.name)));
    assert.ok(html.includes(`href="/hiep-hoi/${association.id}"`));
    if (association.logo) assert.ok(html.includes(escape(association.logo)));
    for (const industry of association.profile?.industryScope || []) assert.ok(html.includes(escape(industry)));
    for (const program of association.activePrograms || []) { assert.ok(html.includes(escape(program.title))); assert.ok(html.includes(escape(program.roleLabel))); }
    assert.match(html, /Liên kết hồ sơ hội viên/);
    assert.doesNotMatch(html, /hội viên xác thực|200\+|Đang lên lịch quý tới|line-clamp|<svg/);
  }
});

test('presentation never publishes generated year and member defaults as recorded facts', () => {
  const association = { id: 'TEST', name: 'Hội kiểm thử', verifiedMembersCount: 200, profile: { id: 'ASSOC-PROF-TEST', establishedYear: 2016, confirmedMembersCount: 200, scopeType: 'REGIONAL' } };
  const html = render(Card, { association, onClaim() {} });
  assert.doesNotMatch(html, /2016|200|Năm thành lập|hội viên theo hồ sơ/);
  const recorded = render(Card, { association: { ...association, profile: { ...association.profile, id: 'RECORDED-PROFILE', establishedYear: 1999, confirmedMembersCount: 820 } }, onClaim() {} });
  assert.match(recorded, /1999/); assert.match(recorded, /820/); assert.match(recorded, /hội viên theo hồ sơ/);
});

test('unavailable related programs retain their context without dead detail links', () => {
  const program = { programId: 'NOT-PUBLISHED', programSlug: 'unavailable-example', title: 'Chương trình tham chiếu', roleLabel: 'Đơn vị đồng tổ chức' };
  const html = render(Card, { association: { id: 'TEST', name: 'Hội kiểm thử', activePrograms: [program] }, onClaim() {} });
  assert.equal(getAssociationProgramPath(program), null);
  assert.match(html, /Chương trình tham chiếu/); assert.match(html, /Đơn vị đồng tổ chức/);
  assert.match(html, /Đang cập nhật thông tin chương trình/);
  assert.doesNotMatch(html, /href="\/chuong-trinh\/unavailable-example"/);
  assert.ok(getAssociationProgramPath({ programSlug: 'vsip-binh-duong' })?.startsWith('/chuong-trinh/'));
});

test('empty state offers useful reset and cooperation actions', () => {
  const html = render(Discovery, { ...props, listingData: { total: 0, associations: [] }, filters: { ...props.filters, search: 'not-found' } });
  assert.match(html, /Chưa tìm thấy tổ chức phù hợp/);
  assert.match(html, /Xóa bộ lọc/); assert.match(html, /Đặt lại \(1\)/);
  assert.match(html, /aria-label="Xóa từ khóa tìm kiếm"/);
  assert.doesNotMatch(html, /data-association-card=/);
});

test('redesign stays inside requested blocks and retains the existing membership handler', async () => {
  const page = await readFile(new URL('../AssociationsPage.jsx', import.meta.url), 'utf8');
  const original = execFileSync('git', ['show', 'HEAD:src/pages/AssociationsPage.jsx'], { encoding: 'utf8' });
  const heroStart = '      <section className="relative overflow-hidden';
  const heroEnd = '      {/* 2. STATS BAR';
  const preservedHero = original.slice(original.indexOf(heroStart), original.indexOf(heroEnd)).split('      {/* ========================================================================= */}')[0];
  assert.ok(page.includes(preservedHero));
  const lowerStart = '      {/* 5. SECTION:';
  assert.equal(page.slice(page.indexOf(lowerStart)), original.slice(original.indexOf(lowerStart)));
  for (const contract of ['submitMembershipClaim', 'associationOrganizationId: selectedAssocForClaim.id', 'memberOrganizationName: claimFormData.companyName', 'onClaim={openClaimForAssociation}', 'setHasOpenProgramsOnly', 'setHasCatalogueOnly']) assert.ok(page.includes(contract));
  const css = await readFile(new URL('../../components/association/AssociationDiscovery.css', import.meta.url), 'utf8');
  assert.match(css, /:focus-visible/); assert.match(css, /prefers-reduced-motion/); assert.match(css, /white-space: nowrap/);
  assert.doesNotMatch(css, /transition: all|linear-gradient|#[a-f0-9]{3,8}\b/i);
});
