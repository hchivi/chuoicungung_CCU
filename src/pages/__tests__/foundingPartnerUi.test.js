import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
let renderPage;
before(async () => {
  const entry = fileURLToPath(new URL('../FoundingPartnerPage.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs',
    external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' },
    plugins: [{ name: 'language-test', setup(builder) {
      builder.onResolve({ filter: /contexts\/LanguageContext$/ }, () => ({ path: 'language', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const useLanguage = () => ({ t: x => x, lang: "vi" });' }));
    } }],
  });
  const bundled = new Module(entry);
  bundled.filename = entry;
  bundled.paths = Module._nodeModulePaths(fileURLToPath(new URL('..', import.meta.url)));
  bundled._compile(result.outputFiles[0].text, entry);
  const { StaticRouter } = require('react-router-dom/server');
  renderPage = (location = '/founding-partner') => renderToStaticMarkup(
    React.createElement(StaticRouter, { location }, React.createElement(bundled.exports.default)));
});

test('landing has one H1, scoped design, and no nested main', () => {
  const html = renderPage();
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /class="fp-page/);
  assert.doesNotMatch(html, /<main[\s>]/);
});

test('scope and contact fields have associated labels', () => {
  const html = renderPage();
  for (const id of ['category', 'cluster', 'location', 'kcn', 'period', 'position', 'companyName', 'contactName', 'roleTitle', 'contactEmail', 'contactPhone', 'objective', 'budget']) {
    assert.match(html, new RegExp(`for="fp-${id}"`));
    assert.match(html, new RegExp(`id="fp-${id}"`));
  }
});

test('local-only submission, illustration, and reference pricing are disclosed', () => {
  const html = renderPage();
  assert.match(html, /chỉ lưu trên trình duyệt này/);
  assert.match(html, /Ảnh minh họa/);
  assert.match(html, /Giá tham khảo/);
  assert.doesNotMatch(html, /24 giờ|KYC 3 Lớp|VIP|Hội đồng Cố vấn/);
  assert.match(html, /không ảnh hưởng kết quả tìm kiếm/i);
});

test('all four capability plans show correct package prices, durations and individual CTAs', () => {
  const html = renderPage();
  const options = html.match(/<div[^>]*class="fp-tier-options"[\s\S]*?(?=<div id="fp-tier-detail")/)?.[0] || '';
  for (const [id, name, price, period] of [
    ['starter', 'Starter', '6', '6 tháng'],
    ['silver', 'Bạc', '12', 'năm'],
    ['gold', 'Vàng', '24', 'năm'],
    ['diamond', 'Kim Cương', '48', 'năm'],
  ]) {
    const card = options.match(new RegExp(`<article[^>]*data-tier="${id}"[\\s\\S]*?<\\/article>`))?.[0] || '';
    assert.match(card, new RegExp(`<strong>${price}<`), 'price must be visible: ' + name);
    assert.ok(card.includes('VNĐ / ' + period), 'duration must be accurate: ' + name);
    assert.ok(card.includes('Chọn gói ' + name), 'each plan needs its own CTA');
    assert.ok(card.includes(`aria-describedby="fp-tier-${id}-cost fp-tier-${id}-focus"`));
  }
  assert.equal((options.match(/aria-pressed="true"/g) || []).length, 1);
  assert.doesNotMatch(html, /300 - 500 triệu|Từ 1 tỷ|2 - 3 tỷ|100 - 200 triệu/);
  assert.doesNotMatch(options, /Bán chạy|Phổ biến nhất|Còn \d+ suất/);
});

test('capability model explains multiple relevant touchpoints without selling keyword or location counts', () => {
  const html = renderPage();
  assert.match(html, /Một gói, nhiều điểm hiện diện phù hợp/);
  assert.match(html, /không tính phí riêng từng từ khóa hoặc địa bàn/i);
  assert.match(html, /khoảng 3 nhóm năng lực/i);
  assert.match(html, /khoảng 5 nhóm năng lực/i);
  assert.match(html, /không phải chứng nhận chất lượng/i);
  for (const term of ['Nhu cầu', 'Năng lực', 'Địa bàn', 'Thời gian', 'Khả năng đáp ứng']) assert.ok(html.includes(term));
  assert.match(html, /for="fp-capabilityNotes"/);
  assert.match(html, /id="fp-capabilityNotes"/);
});

test('draft helper retains capability context in existing objective without corrupting original notes', async () => {
  const { buildFoundingObjective } = await import('../foundingPartnerUi.js');
  assert.equal(typeof buildFoundingObjective, 'function');
  assert.equal(buildFoundingObjective({ objective: ' Mục tiêu ', capabilityNotes: ' CNC, jig ', plan: 'Vàng' }), 'Gói quan tâm: Vàng\nPhạm vi năng lực đề xuất: CNC, jig\nMục tiêu đồng hành: Mục tiêu');
  assert.equal(buildFoundingObjective({ objective: ' Giữ nguyên ' }), 'Giữ nguyên');
  assert.equal(buildFoundingObjective({}), '');
  assert.equal(buildFoundingObjective({ capabilityNotes: ' CNC ' }), 'Phạm vi năng lực đề xuất: CNC');
});

test('query scope selects actual mechanical category and its CNC cluster', () => {
  const html = renderPage('/founding-partner?category=co-khi&cluster=cluster-cnc-jig-ga');
  assert.match(html, /value="co-khi" selected=""/);
  assert.match(html, /value="cluster-cnc-jig-ga" selected=""/);
  assert.doesNotMatch(html, /value="cluster-dong-phuc-cong-nhan" selected=""/);
});

test('existing display position identifiers remain compatible with stored inquiries', () => {
  const html = renderPage();
  for (const id of ['TOP_CATEGORY_SPONSORED_BLOCK', 'TOP_KEYWORD_SPONSORED_BLOCK', 'CATEGORY_SIDEBAR_SPONSOR']) {
    assert.ok(html.includes('value="' + id + '"'), 'missing existing display position: ' + id);
  }
});

test('scope helpers do not sell unrelated clusters and handle missing data', async () => {
  const { resolveFoundingScope, getScopeClusters, durationLabel } = await import('../foundingPartnerUi.js');
  const categories = [{ id: 'a', slug: 'uniform', name: 'Uniform' }, { id: 'b', slug: 'cnc', name: 'CNC' }, { id: 'c', slug: 'none' }];
  const clusters = [{ id: 'u', slug: 'polo', categorySlug: 'uniform' }, { id: 'm', categoryId: 'b', categorySlug: 'cnc' }];
  assert.equal(resolveFoundingScope(categories, clusters, 'b', 'u').cluster.id, 'm');
  assert.equal(resolveFoundingScope(categories, clusters, '', 'polo').category.id, 'a');
  assert.equal(resolveFoundingScope(categories, clusters, 'cnc', 'unknown').cluster.id, 'm');
  assert.equal(resolveFoundingScope(categories, clusters, 'missing', 'm').category.id, 'b');
  assert.deepEqual(getScopeClusters(clusters, categories[2]), []);
  assert.deepEqual(getScopeClusters(clusters, null), []);
  assert.equal(resolveFoundingScope(categories, clusters, 'none', '').cluster, null);
  assert.equal(resolveFoundingScope([], [], '', '').category, null);
  for (const [code, label] of [['6_MONTHS', '6 tháng'], ['12_MONTHS', '12 tháng'], ['24_MONTHS', '24 tháng'], ['CUSTOM', 'Theo thỏa thuận'], ['bad', 'Theo thỏa thuận']]) assert.equal(durationLabel(code), label);
});

test('contact validation has inline errors, email validation, and separate consent', async () => {
  const { getFoundingErrors } = await import('../foundingPartnerUi.js');
  const valid = { companyName: 'Công ty', contactName: 'Tên', roleTitle: 'Giám đốc', contactPhone: '0900000000', contactEmail: 'test@example.com', consent: true };
  assert.deepEqual(getFoundingErrors(valid), {});
  assert.equal(Object.keys(getFoundingErrors({})).length, 6);
  assert.ok(getFoundingErrors({ ...valid, companyName: ' ' }).companyName);
  assert.ok(getFoundingErrors({ ...valid, contactEmail: 'test@' }).contactEmail);
  assert.ok(getFoundingErrors({ ...valid, contactPhone: 'abc' }).contactPhone);
  assert.ok(getFoundingErrors({ ...valid, contactPhone: '123' }).contactPhone);
  assert.ok(getFoundingErrors({ ...valid, consent: false }).consent);
  assert.deepEqual(getFoundingErrors({ ...valid, contactEmail: ' test@example.com ', contactPhone: '+84 (90) 000-0000' }), {});
});
