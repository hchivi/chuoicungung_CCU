import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import postcss from 'postcss';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { EVENT_PATH, EVENT_FACTS, eventState, eventViewTab, publicParticipants, sponsorPackages, eventProgram, eventStructuredData } from '../thaiHoaEventLandingModel.js';

test('registration deep links keep the form reachable without changing the actual lifecycle', () => {
  assert.equal(eventViewTab('', '#dang_ky', 'after'), 'before');
  assert.equal(eventViewTab('', '#dang-ky-tai-tro', 'after'), 'before');
  assert.equal(eventViewTab('?stage=during', '#dang_ky', 'after'), 'during');
  assert.equal(eventViewTab('?stage=invalid', '', 'after'), 'after');
  assert.equal(eventViewTab('?stage=after', '', 'before'), 'after');
  assert.equal(eventState({}, Date.parse('2026-10-12')).open, false);
});

test('canonical identity and source facts remain stable', () => {
  assert.equal(EVENT_PATH, '/chuong-trinh/ngay-hoi-chuoi-cung-ung-kcn-thai-hoa-2026');
  assert.equal(EVENT_FACTS.startAt, '2026-10-07T08:00:00+07:00');
  assert.equal(EVENT_FACTS.agenda.at(-1).time, '11:00 – 13:00');
  assert.equal(EVENT_FACTS.fees[0].member, 750000);
  assert.equal(EVENT_FACTS.fees[1].nonmember, 2000000);
});
test('readability layout uses larger copy and spacious panels', async () => {
  const css = postcss.parse(await readFile(new URL('../ThaiHoaEventLanding.css', import.meta.url), 'utf8'));
  const base = (selector, property) => {
    let value;
    css.nodes.filter(node => node.type === 'rule' && node.selector.split(',').includes(selector)).forEach(rule => rule.walkDecls(property, decl => { value = decl.value; }));
    return value;
  };
  assert.equal(base('.th-landing', 'font-size'), '18px');
  assert.ok(parseFloat(base('.th-role-card li', 'font-size')) >= 16);
  assert.equal(base('.th-entry-grid', 'grid-template-columns'), 'repeat(2,minmax(0,1fr))');
  assert.equal(base('.th-info-grid', 'grid-template-columns'), '1fr');
  assert.ok(parseFloat(base('.th-content', 'max-width')) >= 1320);
  const page = await readFile(new URL('../ThaiHoaEventLandingPage.jsx', import.meta.url), 'utf8');
  assert.ok(!page.includes('th-matching-gears'));
});
test('lifecycle uses Vietnam timestamps, closes registration at deadline and honours known overrides', () => {
  assert.deepEqual(eventState({}, Date.parse('2026-09-28T00:00:00Z')), { tab: 'before', open: true, label: 'Đang nhận đăng ký' });
  assert.equal(eventState({}, Date.parse('2026-09-30T00:00:00Z')).open, false);
  assert.equal(eventState({}, Date.parse('2026-10-07T02:00:00Z')).tab, 'during');
  assert.equal(eventState({}, Date.parse('2026-10-10T00:00:00Z')).tab, 'after');
  assert.equal(eventState({ statusOverride: 'CANCELLED' }, 0).open, false);
  assert.equal(eventState({ eventStartAt: 'bad' }, 0).open, false);
  assert.equal(eventState({ statusOverride: 'POST_EVENT' }, 0).tab, 'after');
  assert.equal(eventState({ statusOverride: 'REGISTRATION_OPEN' }, Date.parse('2026-10-10')).open, false);
});
test('only confirmed, published event participants are projected without contacts or commercial fields', () => {
  const good = { id: 'a', name: 'Doanh nghiệp A', role: 'BUYER', status: 'CONFIRMED', publishStatus: 'PUBLISHED', visibility: 'PUBLIC', logo: '/a.png', phone: 'secret', email: 'secret', quote: 'secret', productsServices: ['Bao bì'] };
  const list = publicParticipants({ participants: [good, { ...good, id: 'b', status: 'PENDING' }, { ...good, id: 'c', visibility: 'INTERNAL' }, { ...good, id: 'd', programId: 'wrong' }, good] });
  assert.equal(list.length, 1);
  assert.equal(list[0].role, 'buyer');
  assert.ok(!JSON.stringify(list).includes('secret'));
  assert.equal(publicParticipants({}).length, 0);
});
test('approved event defaults use diamond 50m, gold 30m, silver 15m; explicit cloud configuration still wins', () => {
  assert.equal(sponsorPackages({}).length, 3);
  assert.deepEqual(sponsorPackages({}).map(p => [p.id, p.price]), [['diamond', 50000000], ['gold', 30000000], ['silver', 15000000]]);
  assert.deepEqual(sponsorPackages(eventProgram({})).map(p => p.price), [50000000, 30000000, 15000000]);
  const packages = sponsorPackages({ sponsorshipPackages: [{ id: 'diamond', title: 'Kim cương', amount: 50000000, feeType: 'FIXED', priceApproved: false }, { id: 'gold', title: 'Vàng', amount: 30000000, feeType: 'FIXED', priceApproved: true }] });
  assert.equal(packages[0].price, null);
  assert.equal(packages[1].price, 30000000);
  assert.equal(packages[2].price, 15000000);
  for (const amount of [NaN, -1, Infinity, '5000000']) assert.equal(sponsorPackages({sponsorshipPackages:[{id:'silver',amount,feeType:'FIXED',priceApproved:true}]}).at(-1).price, null);
});
test('registration uses the original program id and closes past events even with stale cloud status', () => {
  const program = eventProgram({ id: 'real-cloud-id', programStatus: 'REGISTRATION_OPEN', gallery: [{ url: '/proof.jpg', visibility: 'INTERNAL' }] }, Date.parse('2026-10-10'));
  assert.equal(program.id, 'real-cloud-id');
  assert.equal(program.programStatus, 'COMPLETED');
  assert.equal(program.workflowContent.gallery.length, 1);
  const seo = eventStructuredData(program, 'http://localhost:3000');
  assert.equal(seo.url, 'http://localhost:3000' + EVENT_PATH);
  assert.equal(seo.startDate, EVENT_FACTS.startAt);
  assert.ok(!('offers' in seo));
});

test('landing renders correct logo order, real role controls, compact content and no fabricated participant claims', async () => {
  const entry = fileURLToPath(new URL('../ThaiHoaEventLandingPage.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' }, plugins: [{ name: 'test-language-context', setup(build) { build.onLoad({ filter: /LanguageContext\.jsx$/ }, () => ({ contents: "export const useLanguage=()=>({lang:'vi',t:(_p,f)=>f});", loader: 'js' })); } }] });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url))); mod._compile(result.outputFiles[0].text, entry);
  const program = eventProgram({}, Date.parse('2026-10-10'));
  const html = renderToStaticMarkup(React.createElement(StaticRouter, null, React.createElement(mod.exports.ThaiHoaLandingView, { program, state: eventState({}, Date.parse('2026-10-10')), activeTab: 'before', onRegister: () => {}, onTabChange: () => {} })));
  const organizers = html.slice(html.indexOf('class="th-organizers"'), html.indexOf('class="th-hero-copy"'));
  assert.ok(organizers.indexOf('/logo-thip-png.png') < organizers.indexOf('/logo_only.png'));
  assert.ok(organizers.indexOf('/logo_only.png') < organizers.indexOf('/logo_teamkcn.jpg'));
  for (const text of ['CHUỖI CUNG ỨNG', 'BEYOND CONNECTION. RIGHT PLACE.', 'Agenda dự kiến', '750.000đ', '2.000.000đ', '50.000.000đ', '30.000.000đ', '15.000.000đ', 'id="dang_ky"', 'id="th-tab-after"', 'aria-selected="true"', '150+', '40+', '70+', '1.000+']) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /0903 123 456|Tự động liên kết KYC/);
  const app = await readFile(new URL('../../App.jsx', import.meta.url), 'utf8');
  assert.ok(app.includes('path="' + EVENT_PATH + '" element={<ThaiHoaEventLandingPage />'));
  assert.ok(app.includes('to="' + EVENT_PATH + '#dang_ky" replace'));
  const css = await readFile(new URL('../ThaiHoaEventLanding.css', import.meta.url), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.ok(css.indexOf('.th-hero{position:relative') < css.indexOf('@media(max-width:1150px)'));
});
