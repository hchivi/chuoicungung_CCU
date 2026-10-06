import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFile, access } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';
import { PARTNER_STORIES, MERCH_STORIES, SPONSOR_STORIES } from '../ecosystemPageContent.js';

const require = createRequire(import.meta.url);
const pages = [
  ['RemotePresenceServicePage', '/dich-vu/hien-dien-tu-xa'],
  ['MerchandiseEventServicePage', '/dich-vu/vat-pham-su-kien'],
  ['MediaBrandingServicePage', '/dich-vu/truyen-thong-doanh-nghiep'],
  ['PartnershipHubPage', '/hop-tac'],
  ['SponsorshipPage', '/tai-tro'],
];
const renderers = new Map();
before(async () => {
  for (const [name, route] of pages) {
    const entry = fileURLToPath(new URL(`../${name}.jsx`, import.meta.url));
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
    renderers.set(name, (location = route) => renderToStaticMarkup(React.createElement(StaticRouter, { location }, React.createElement(bundled.exports.default))));
  }
});

for (const [name] of pages) {
  test(`${name}: light page scope, single H1, image-led hero and primary CTA`, () => {
    const html = renderers.get(name)();
    assert.match(html, /class="ec-page/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.doesNotMatch(html, /<main[\s>]/);
    assert.match(html, /class="ec-button"/);
    assert.match(html, /<img[^>]+loading="eager"/);
    assert.match(html, /<img[^>]+loading="lazy"/);
    assert.doesNotMatch(html, /Ảnh minh họa AI|không phải sự kiện|4\.000\+|14\.000\+|Section [0-9]/);
  });
}

test('investor query selects a distinct investment story and form', () => {
  const html = renderers.get('PartnershipHubPage')('/hop-tac?type=INVESTOR');
  assert.match(html, /Trao đổi riêng về định hướng đầu tư/);
  assert.match(html, /<form[\s>]/);
  assert.match(html, /aria-pressed="true"[^>]*>[^<]*Nhà đầu tư/);
});

test('unknown partnership category falls back to association', () => {
  const html = renderers.get('PartnershipHubPage')('/hop-tac?type=NOT_A_ROLE');
  assert.match(html, /Đưa năng lực hội viên đến đúng nhu cầu/);
});

test('merchandise keeps four kit-specific request links and a quotation preview', () => {
  const html = renderers.get('MerchandiseEventServicePage')();
  for (const id of Object.keys(MERCH_STORIES)) assert.ok(html.includes(`service=vat-pham-su-kien&amp;package=${id}`));
  assert.match(html, /Xem cấu trúc báo giá/);
});

test('sponsor and remote request forms retain explicit consent', () => {
  for (const name of ['SponsorshipPage', 'RemotePresenceServicePage']) {
    const html = renderers.get(name)();
    assert.match(html, /<form[\s>]/);
    assert.match(html, /type="checkbox"/);
    assert.match(html, /type="submit"/);
  }
});

test('merchandise sponsorship exposes its own rights and report fields', () => {
  const html = renderers.get('SponsorshipPage')('/tai-tro?type=MERCHANDISE');
  assert.ok(html.includes('In ấn logo trên vật phẩm hội nghị'));
  assert.ok(html.includes('Báo cáo nghiệm thu &amp; Đo lường hiệu quả'));
});

test('all presentation assets exist locally', async () => {
  for (const item of [...Object.values(PARTNER_STORIES), ...Object.values(MERCH_STORIES), ...Object.values(SPONSOR_STORIES)]) {
    assert.ok(item.alt?.length > 12);
    await access(new URL(`../../../public${item.image}`, import.meta.url));
  }
});

test('design CSS is scoped with responsive and reduced-motion safeguards', async () => {
  const css = await readFile(new URL('../EcosystemServicePages.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /(?:^|\n)\s*(?:html|body|:root|h1|h2|a|summary|\*)\s*[{,]/);
  assert.doesNotMatch(css, /transition:\s*all|#[0-9a-f]{3,8}\b|(?:rgb|hsl|oklch)\(/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /minmax\(0,/);
});

test('light-page palette has sufficient text, action, input and focus contrast', async () => {
  const css = await readFile(new URL('../../../tokens.css', import.meta.url), 'utf8');
  const tokens = css.match(/\.ec-page\s*\{([^}]+)\}/s)?.[1];
  assert.ok(tokens);
  const luminance = {};
  for (const [, name, lightness, chroma, hue] of tokens.matchAll(/--color-([\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\);/g)) {
    const L = Number(lightness) / 100, C = Number(chroma), H = Number(hue) * Math.PI / 180;
    const a = C * Math.cos(H), b = C * Math.sin(H);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map(value => Math.min(1, Math.max(0, value)));
    luminance[name] = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  }
  for (const [text, background, minimum] of [['ink', 'paper', 4.5], ['muted', 'paper', 4.5], ['muted', 'paper-2', 4.5], ['accent-ink', 'accent', 4.5], ['accent', 'paper', 4.5], ['focus', 'paper', 3], ['input-rule', 'paper', 3], ['success', 'success-soft', 4.5], ['error', 'error-soft', 4.5]]) {
    const a = luminance[text], b = luminance[background];
    assert.ok(Number.isFinite(a) && Number.isFinite(b));
    const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    assert.ok(ratio >= minimum, `${text}/${background}: ${ratio.toFixed(2)}`);
  }
});
