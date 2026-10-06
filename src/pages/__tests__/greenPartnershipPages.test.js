import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';

let partnerHtml, matchHtml;
const require = createRequire(import.meta.url);
before(async () => {
  const { StaticRouter } = require('react-router-dom/server');
  async function render(name, location) {
    const entry = fileURLToPath(new URL('../' + name + '.jsx', import.meta.url));
    const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs',
      external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' },
      plugins: [{ name: 'language-test', setup(builder) {
        builder.onResolve({ filter: /contexts\/LanguageContext$/ }, () => ({ path: 'language', namespace: 'test' }));
        builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const useLanguage = () => ({ t: x => x, lang: "vi" });' }));
      } }],
    });
    const mod = new Module(entry); mod.filename = entry;
    mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('..', import.meta.url)));
    mod._compile(result.outputFiles[0].text, entry);
    return renderToStaticMarkup(React.createElement(StaticRouter, { location }, React.createElement(mod.exports.default)));
  }
  partnerHtml = await render('DevelopmentPartnerPage', '/doi-tac-phat-trien');
  matchHtml = await render('MatchmakingServicePage', '/dich-vu/to-chuc-ket-noi');
});

test('development partnership is photographic, concise and without seeded workspace proof', () => {
  assert.match(partnerHtml, /class="ec-page dp-page"/);
  assert.equal((partnerHtml.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(partnerHtml, /Cùng mở rộng/);
  assert.match(partnerHtml, /<img[^>]+loading="eager"/);
  assert.doesNotMatch(partnerHtml, /DTPT-2026-001|8 giờ|Dashboard|dashboard|<figcaption/);
});
test('existing partner intake payload fields and consent remain accessible', () => {
  for (const field of ['applicantName', 'partnerType', 'contactPerson', 'role', 'email', 'phone', 'website', 'targetAudienceDescription']) {
    assert.match(partnerHtml, new RegExp('name="' + field + '"'));
    assert.match(partnerHtml, new RegExp('for="dp-' + field + '"'));
  }
  for (const id of ['SERVICE_CONTENT', 'SERVICE_MERCHANDISE', 'PROGRAM_PARTICIPANTS', 'PROGRAM_ORGANIZATION', 'LOCAL_COORDINATION']) assert.ok(partnerHtml.includes('value="' + id + '"'));
  assert.match(partnerHtml, /name="consentAccepted"/);
  assert.match(partnerHtml, /Thỏa thuận Hợp tác chính thức/);
  assert.match(partnerHtml, /không ảnh hưởng kết quả matching/i);
});
test('matchmaking has interactive preparation stages and four photographic formats', () => {
  for (let index = 0; index < 3; index++) assert.ok(matchHtml.includes('id="mm-stage-' + index + '"'));
  assert.equal((matchHtml.match(/data-format=/g) || []).length, 4);
  assert.ok((matchHtml.match(/<img/g) || []).length >= 5);
  assert.doesNotMatch(matchHtml, /<figcaption|Ảnh minh họa AI/);
});
test('green shared branding is explicit and excluded from private layouts', async () => {
  const root = new URL('../../../', import.meta.url);
  const index = await readFile(new URL('src/index.css', root), 'utf8');
  const tokens = await readFile(new URL('tokens.css', root), 'utf8');
  const app = await readFile(new URL('src/App.jsx', root), 'utf8');
  const footer = await readFile(new URL('src/components/Footer.jsx', root), 'utf8');
  assert.match(index, /ccu-public-shell/);
  assert.match(tokens, /--brand-footer:\s*#082415/i);
  assert.match(tokens, /--brand-green:\s*#006039/i);
  assert.match(app, /hideHeaderFooter\s*\?\s*''\s*:\s*'ccu-public-shell'/);
  assert.match(footer, /ccu-footer/);
});

test('photographic routes reserve the loading fold to avoid footer layout shifts', async () => {
  const root = new URL('../../../', import.meta.url);
  const css = await readFile(new URL('src/index.css', root), 'utf8');
  const app = await readFile(new URL('src/App.jsx', root), 'utf8');
  assert.match(app, /isPhotographicRoute/);
  assert.match(app, /ccu-photographic-route/);
  assert.match(css, /\.ccu-photographic-route #main-content\s*\{\s*min-height:\s*100svh/);
});
