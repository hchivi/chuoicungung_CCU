import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { stagesData } from '../../src/data/mockData.js';

const origin = process.env.CCU_QA_ORIGIN || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
const errors = [], networkIssues = [], responsive = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) networkIssues.push({ status: response.status(), url: response.url() }); });
await page.evaluateOnNewDocument(() => {
  window.ccuMapPerf = { lcp: null, cls: 0 };
  try { new PerformanceObserver(list => { window.ccuMapPerf.lcp = list.getEntries().at(-1)?.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.ccuMapPerf.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
});
async function visit() {
  await page.goto(origin + '/ban-do-6-giai-doan', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.six-stages-map');
  await page.evaluate(() => document.fonts.ready);
}
async function activate(selector) { await page.focus(selector); await page.keyboard.press('Enter'); }
const selectedPhase = async id => {
  await page.waitForFunction(id => document.querySelector('[data-phase-select="' + id + '"]')?.getAttribute('aria-pressed') === 'true', {}, id);
};
try {
  for (const width of [320, 375, 414, 768, 900, 1024, 1280, 1920]) {
    await page.setViewport({ width, height: 1000 });
    await visit();
    const state = await page.evaluate(() => {
      const root = document.querySelector('.six-stages-map');
      const nodes = [...root.querySelectorAll('[data-stage-select]')];
      const rects = [...nodes, root.querySelector('[data-stage-overview]')].map(el => el.getBoundingClientRect());
      const overlaps = rects.some((a, i) => rects.slice(i + 1).some(b => Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)));
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        nodeOverlaps: overlaps, nodesInViewport: rects.every(r => r.left >= 0 && r.right <= innerWidth),
        uppercase: getComputedStyle(root.querySelector('h1')).textTransform === 'uppercase',
        images: [...root.querySelectorAll('img:not([loading="lazy"])')].every(img => img.complete && img.naturalWidth > 0),
        heroCtaVisible: root.querySelector('.sm-hero .sm-primary').getBoundingClientRect().bottom < innerHeight,
        perf: window.ccuMapPerf };
    });
    responsive.push(state);
    assert.equal(state.overflow, false, 'Overflow at ' + width);
    assert.equal(state.nodeOverlaps, false, 'Map nodes overlap at ' + width);
    assert.ok(state.nodesInViewport && state.uppercase && state.images && state.heroCtaVisible);
    assert.ok(state.perf.cls < .1, 'Loading layout shift at ' + width);
    if ([375,1280].includes(width)) {
      await page.screenshot({ path: '/tmp/ccu-stages-v2-hero-' + width + '.png' });
      await page.$eval('.sm-floating-board', el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 125, behavior: 'instant' }));
      await page.screenshot({ path: '/tmp/ccu-stages-v2-board-' + width + '.png' });
    }
    for (const stage of stagesData) {
      const cardCopy = await page.$eval('[data-stage-select="' + stage.id + '"]', el => el.textContent);
      for (const phase of stage.phases) assert.ok(cardCopy.includes(phase.title), 'Board phase ' + phase.id);
    }
    await activate('[data-hero-stage="5"]');
    await page.waitForFunction(() => document.activeElement?.id === 'sm-explorer-heading');
    assert.equal(await page.$eval('[data-stage-select="5"]', el => el.getAttribute('aria-pressed')), 'true');
    await activate('[data-stage-overview]');
    await page.waitForFunction(() => document.querySelectorAll('[data-phase-select]').length === 18);
    const phaseColors = await page.$$eval('.sm-phase-group', groups => groups.map(group => getComputedStyle(group.querySelector('.sm-phase-card')).backgroundColor));
    assert.equal(new Set(phaseColors).size, 6, 'Six distinct stage surfaces');
    if (width === 1280) {
      await page.$eval('#sm-phase-list', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.screenshot({ path: '/tmp/ccu-stages-v2-phases-1280.png' });
    }
    assert.equal(await page.$eval('[data-stage-overview]', el => el.getAttribute('aria-pressed')), 'true');
    for (const stage of stagesData) {
      await activate('[data-stage-select="' + stage.id + '"]');
      await page.waitForFunction(id => document.querySelector('[data-stage-select="' + id + '"]').getAttribute('aria-pressed') === 'true', {}, stage.id);
      await page.waitForFunction(() => document.activeElement?.id === 'sm-phases-heading');
      assert.equal(await page.$$eval('[data-phase-select]', els => els.length), 3);
      assert.equal(await page.$eval('#sm-stage-panel h2', el => el.textContent), stage.title);
      for (const phase of stage.phases) {
        await activate('[data-phase-select="' + phase.id + '"]');
        await selectedPhase(phase.id);
        await page.waitForFunction(() => document.activeElement?.id === 'sm-detail-title');
        const content = await page.$eval('#sm-phase-detail', el => el.textContent);
        for (const text of [...phase.tasks, ...phase.commonDemands, ...phase.roles]) assert.ok(content.includes(text), 'Missing preserved phase copy: ' + text);
        assert.equal(await page.$eval('[data-current-phase-link]', el => el.getAttribute('href')), '/pha/' + phase.slug);
        assert.equal(await page.$eval('#sm-stage-panel a', el => el.getAttribute('href')), '/giai-doan/' + stage.slug);
      }
    }
  }
  // Short displays and bilingual copy must also fit the actual board geometry.
  const secondary = [];
  for (const [width, height, language] of [[375, 812, 'vi'], [1440, 800, 'vi'], [320, 812, 'en'], [1024, 900, 'en'], [1280, 1000, 'en']]) {
    await page.setViewport({ width, height });
    await page.evaluate(language => localStorage.setItem('ccu_language', language), language);
    await visit();
    const state = await page.evaluate(() => {
      const root = document.querySelector('.six-stages-map');
      const rects = [...root.querySelectorAll('[data-stage-select], [data-stage-overview]')].map(el => el.getBoundingClientRect());
      return { overflow: document.documentElement.scrollWidth > innerWidth,
        overlap: rects.some((a,i) => rects.slice(i+1).some(b => Math.min(a.right,b.right) > Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom) > Math.max(a.top,b.top))),
        ctaVisible: root.querySelector('.sm-hero .sm-primary').getBoundingClientRect().bottom < innerHeight };
    });
    assert.ok(!state.overflow && !state.overlap && state.ctaVisible, JSON.stringify({ width, height, language, state }));
    secondary.push({ width, height, language, ...state });
    if (language === 'en') for (const stage of stagesData) {
      const card = await page.$eval('[data-stage-select="' + stage.id + '"]', el => el.textContent);
      for (const phase of stage.phases) assert.ok(card.includes(phase.titleEn));
    }
  }
  await page.evaluate(() => localStorage.setItem('ccu_language', 'vi'));
  await visit();
  // Overview selection, disclosure, persistence, and invalid storage recovery.
  await activate('[data-stage-overview]');
  await page.waitForFunction(() => document.querySelectorAll('[data-phase-select]').length === 18);
  await page.waitForFunction(() => document.activeElement?.id === 'sm-phases-heading');
  for (const stage of stagesData) for (const phase of stage.phases) {
    const content = await page.$eval('[data-phase-select="' + phase.id + '"]', el => el.textContent);
    assert.ok(content.includes(phase.title) && content.includes(phase.summary));
  }
  await activate('[data-phase-select="3.2"]'); await selectedPhase('3.2');
  await page.waitForFunction(() => document.activeElement?.id === 'sm-detail-title');
  assert.equal(await page.$eval('[data-stage-overview]', el => el.getAttribute('aria-pressed')), 'true');
  await activate('.sm-back-link');
  await page.waitForFunction(() => document.activeElement?.id === 'sm-phases-heading');
  await activate('.sm-keyword-details summary');
  assert.ok(await page.$eval('.sm-keyword-details', el => el.open));
  await visit(); await selectedPhase('3.2');
  assert.equal(await page.$eval('[data-stage-overview]', el => el.getAttribute('aria-pressed')), 'true');
  await page.evaluate(() => { localStorage.setItem('ccu_selected_stage', 'corrupt'); localStorage.setItem('ccu_selected_phase', 'bad'); });
  await visit(); await selectedPhase('1.1');
  await page.evaluate(() => { localStorage.setItem('ccu_selected_stage', '2'); localStorage.setItem('ccu_selected_phase', '1.2'); });
  await visit(); await selectedPhase('2.1');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('.sm-stage-card', el => getComputedStyle(el).transitionDuration), '0s');
  const stillTransform = await page.$eval('.sm-stage-card', el => getComputedStyle(el).transform);
  await page.hover('.sm-stage-card');
  assert.equal(await page.$eval('.sm-stage-card', el => getComputedStyle(el).transform), stillTransform);
  await page.focus('[data-stage-select="4"]');
  const focus = await page.$eval('[data-stage-select="4"]', el => ({ focused: el === document.activeElement, outline: getComputedStyle(el).outlineStyle }));
  assert.ok(focus.focused && focus.outline === 'solid');
  await page.keyboard.press('Enter'); await selectedPhase('4.1');
  // Verify a phase link actually lands on the correct route, not homepage fallback.
  await activate('[data-current-phase-link]');
  await page.waitForFunction(() => location.pathname === '/pha/cung-ung-dau-vao');
  await page.waitForSelector('#main-content h1');
  assert.ok((await page.$eval('#main-content', el => el.textContent)).includes('Cung ứng đầu vào'));
  assert.deepEqual(errors, []); assert.deepEqual(networkIssues, []);
  console.log(JSON.stringify({ verdict: 'PASS', responsive, secondary, interactions: '8 widths × 6 stages × 3 phases; floating board and center do not overlap; all 18 board phase titles; six distinct phase surfaces; hero rail; phase-list reveal/focus; visible hero CTA; short displays and English; keyword disclosure; keyboard activation/focus; persistence; invalid storage; reduced motion; actual phase navigation', errors, networkIssues }, null, 2));
} finally { await browser.close(); }
