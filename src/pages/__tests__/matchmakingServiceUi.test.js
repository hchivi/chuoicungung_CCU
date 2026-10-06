import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
let renderPage;
before(async () => {
  const entry = fileURLToPath(new URL('../MatchmakingServicePage.jsx', import.meta.url));
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
  renderPage = () => renderToStaticMarkup(React.createElement(StaticRouter, { location: '/dich-vu/to-chuc-ket-noi' }, React.createElement(bundled.exports.default)));
});

test('luxury design is page-scoped, has a single H1 and no nested main', () => {
  const html = renderPage();
  assert.match(html, /class="mm-page"/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.doesNotMatch(html, /<main[\s>]/);
  assert.match(html.replace(/<[^>]*>/g, ''), /Kết nối từ nhu cầu thật/);
});

test('all existing service and format query links are preserved', () => {
  const html = renderPage();
  for (const id of ['plant-sourcing', 'kcn-expo', 'joint-booth', 'pitching-session']) {
    assert.ok(html.includes(`/yeu-cau-dich-vu?service=to-chuc-ket-noi&amp;format=${id}`));
  }
  assert.match(html, /href="\/chuong-trinh"/);
  assert.match(html, /href="\/dich-vu"/);
});

test('honest scope and illustrative assets replace unverified marketing claims', () => {
  const html = renderPage();
  assert.match(html, /không cam kết số hợp đồng/i);
  assert.doesNotMatch(html, /<figcaption|Ảnh minh họa AI/i);
  assert.match(html, /alt="Minh họa/);
  assert.match(html, /không thay thế quyết định của doanh nghiệp/i);
  assert.doesNotMatch(html, /32\.000|đến nghiệm thu|nhắc việc tự động|ĐÃ KYC|tốt nhất/);
});

test('customer journey explains preparation, meeting and subsequent work', () => {
  const html = renderPage();
  for (const phrase of ['Trước cuộc gặp', 'Trong cuộc gặp', 'Sau cuộc gặp', 'Người phụ trách', 'Bước tiếp theo', 'Hạn phản hồi', 'Bàn giao theo phạm vi đã thống nhất']) assert.ok(html.includes(phrase));
  assert.doesNotMatch(html, /NextActionAt|BLOCK 0/);
});

test('native FAQ remains keyboard accessible and does not add a new submission form', () => {
  const html = renderPage();
  assert.ok((html.match(/<details/g) || []).length >= 4);
  assert.ok((html.match(/<summary/g) || []).length >= 4);
  assert.doesNotMatch(html, /<form[\s>]/);
});

test('hero is eager with fixed intrinsic size and supporting photo is lazy', () => {
  const html = renderPage();
  const images = html.match(/<img[^>]+>/g) || [];
  assert.ok(images.some(img => img.includes('matchmaking-meeting-v1') && img.includes('width="1536"') && !img.includes('loading="lazy"')));
  assert.ok(images.some(img => img.includes('matchmaking-samples-v1') && img.includes('loading="lazy"')));
});

test('all new CSS selectors and tokens stay inside page scope', async () => {
  const css = await readFile(new URL('../MatchmakingServicePage.css', import.meta.url), 'utf8');
  const tokens = await readFile(new URL('../../../tokens.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css + tokens, /(?:^|\n)\s*(?:html|body|:root|h1|h2|a|summary|\*)\s*[{,]/);
  assert.doesNotMatch(css, /transition:\s*all|#[0-9a-f]{3,8}\b|(?:rgb|hsl|oklch)\(/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});

test('page body, muted text, buttons and light-page focus pass WCAG contrast', async () => {
  const css = await readFile(new URL('../../../tokens.css', import.meta.url), 'utf8');
  const pageTokens = css.match(/\.mm-page\s*\{([^}]+)\}/s)?.[1];
  assert.ok(pageTokens, 'Matchmaking page tokens must be defined in their own scope');
  const luminance = {};
  for (const [, name, lightness, chroma, hue] of pageTokens.matchAll(/--color-([\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\);/g)) {
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
  for (const [text, background, minimum] of [
    ['ink', 'paper', 4.5], ['ink-2', 'paper', 4.5], ['ink-2', 'paper-2', 4.5],
    ['muted', 'paper', 4.5], ['muted', 'paper-2', 4.5], ['ink', 'surface', 4.5],
    ['paper', 'ink', 4.5], ['accent-ink', 'accent', 4.5],
    ['focus', 'paper', 3], ['focus', 'paper-2', 3], ['focus', 'ink', 3],
  ]) {
    const a = luminance[text], b = luminance[background];
    assert.ok(Number.isFinite(a) && Number.isFinite(b));
    const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    assert.ok(ratio >= minimum, text + '/' + background + ': ' + ratio.toFixed(2));
  }
});
