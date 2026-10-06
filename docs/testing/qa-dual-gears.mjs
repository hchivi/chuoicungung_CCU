import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
const errors = [], networkIssues = [], responsive = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) networkIssues.push({ status: response.status(), url: response.url() }); });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function activate(selector) { await page.focus(selector); await page.keyboard.press('Enter'); }
async function bringIntoView() {
  await page.$eval('#khop-lenh-cung-cau', el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 125, behavior: 'instant' }));
}
async function geometry() {
  return page.$eval('#khop-lenh-cung-cau', root => {
    const hubs = [...root.querySelectorAll('[data-gear-hub]')];
    const rects = hubs.map(el => el.getBoundingClientRect());
    const rotors = [...root.querySelectorAll('[data-gear-rotor]')];
    const gears = [...root.querySelectorAll('[data-gear-size]')];
    const gearRects = gears.map(el => el.getBoundingClientRect());
    const childOutside = hubs.map(hub => {
      const r = hub.getBoundingClientRect();
      return [...hub.querySelectorAll('.dg-role, .dg-stage-label, h3, .dg-keywords, .dg-hub-action')].some(el => {
        if (!el.getClientRects().length) return false;
        const child = el.getBoundingClientRect();
        return child.left < r.left || child.right > r.right || child.top < r.top || child.bottom > r.bottom;
      });
    });
    return { overflow: document.documentElement.scrollWidth > innerWidth,
      images: rotors.every(img => img.complete && img.naturalWidth > 0 && img.getAttribute('src') === '/logo_inner_gear.svg'),
      largeBehindSmall: gearRects[0].width > gearRects[1].width && getComputedStyle(gears[0]).zIndex === '0' && getComputedStyle(gears[1]).zIndex === '1',
      diagonalDepth: gearRects[1].left > gearRects[0].left && gearRects[1].top > gearRects[0].top,
      whiteCenters: hubs.every(hub => getComputedStyle(hub).backgroundColor === 'rgb(255, 255, 255)'),
      hubOverlap: Math.min(rects[0].right,rects[1].right) > Math.max(rects[0].left,rects[1].left) && Math.min(rects[0].bottom,rects[1].bottom) > Math.max(rects[0].top,rects[1].top),
      childOutside, directions: rotors.map(el => getComputedStyle(el).animationDirection),
      durations: rotors.map(el => getComputedStyle(el).animationDuration),
      links: hubs.map(el => el.getAttribute('href')) };
  });
}
try {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#khop-lenh-cung-cau');
  for (const width of [320,375,414,768,1024,1280,1920]) {
    await page.setViewport({ width, height: 1000 });
    await bringIntoView();
    for (let stage=1; stage<=6; stage++) {
      await activate('[data-matching-stage="' + stage + '"]');
      await page.waitForFunction(stage => document.querySelector('#khop-lenh-cung-cau').dataset.activeStage === String(stage), {}, stage);
      await delay(80);
      const state = await geometry();
      responsive.push({ width, stage, ...state });
      assert.equal(state.overflow, false, 'Overflow: ' + width);
      assert.ok(state.images && state.whiteCenters && !state.hubOverlap && state.largeBehindSmall && state.diagonalDepth, JSON.stringify({ width,stage,state }));
      assert.deepEqual(state.childOutside, [false,false], 'Circle text overflow: ' + width + ' stage ' + stage);
    }
    await activate('[data-matching-stage="1"]');
    if ([375,1280].includes(width)) {
      await bringIntoView();
      await page.screenshot({ path: '/tmp/ccu-dual-gears-' + width + '.png' });
      await page.$eval('.dg-arena', el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 125, behavior: 'instant' }));
      await page.screenshot({ path: '/tmp/ccu-dual-gears-arena-' + width + '.png' });
    }
  }
  await page.setViewport({ width:1280,height:1000 });
  await bringIntoView();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.waitForFunction(() => document.querySelector('#khop-lenh-cung-cau').dataset.running === 'true');
  await page.screenshot({ path: '/tmp/ccu-dual-gears-running-1280.png' });
  const state = await geometry();
  assert.deepEqual(state.directions, ['normal','reverse']); assert.deepEqual(state.durations,['36s','36s']);
  const transforms = () => page.$$eval('[data-gear-rotor]', els => els.map(el => getComputedStyle(el).transform));
  const before = await transforms(); await delay(180); assert.notDeepEqual(await transforms(), before);
  assert.ok((await page.$$eval('[data-gear-hub]', els => els.map(el => getComputedStyle(el).transform))).every(value => value === 'none'), 'Hub text must stay upright');
  const stageBefore = await page.$eval('#khop-lenh-cung-cau', el => el.dataset.activeStage);
  await page.waitForFunction(stage => document.querySelector('#khop-lenh-cung-cau').dataset.activeStage !== stage, { timeout:6000 }, stageBefore);
  const paired = await page.$eval('#khop-lenh-cung-cau', el => {
    const titles=[...el.querySelectorAll('.dg-hub h3')].map(h=>h.textContent);
    const words=[...el.querySelectorAll('.dg-hub .dg-keywords')].map(h=>h.textContent);
    return { titles,words };
  });
  assert.ok(paired.titles.length===2 && paired.words.length===2);
  await activate('[data-matching-pause]');
  await page.waitForFunction(() => document.querySelector('#khop-lenh-cung-cau').dataset.running === 'false');
  await delay(80); const paused = await transforms();
  const frozenStage = await page.$eval('#khop-lenh-cung-cau', el => el.dataset.activeStage);
  await delay(4700); assert.deepEqual(await transforms(),paused);
  assert.equal(await page.$eval('#khop-lenh-cung-cau', el => el.dataset.activeStage),frozenStage);
  await activate('[data-matching-pause]');
  await page.waitForFunction(() => document.querySelector('#khop-lenh-cung-cau').dataset.running === 'true');
  await page.focus('[data-gear-hub="demand"]');
  await page.waitForFunction(() => document.querySelector('#khop-lenh-cung-cau').dataset.running === 'false');
  assert.equal(await page.$eval('[data-gear-hub="demand"]', el=>getComputedStyle(el).outlineStyle),'solid');
  await page.focus('[data-matching-stage="3"]');
  await page.waitForFunction(() => document.querySelector('#khop-lenh-cung-cau').dataset.running === 'true');
  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion',value:'reduce' }]);
  await page.waitForFunction(() => document.querySelector('#khop-lenh-cung-cau').dataset.running === 'false');
  assert.ok((await page.$$eval('[data-gear-rotor]', els=>els.map(el=>getComputedStyle(el).animationName))).every(name=>name==='none'));
  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion',value:'no-preference' }]);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('#khop-lenh-cung-cau').dataset.running==='false');
  await bringIntoView();
  await page.waitForFunction(()=>document.querySelector('#khop-lenh-cung-cau').dataset.running==='true');
  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion',value:'reduce' }]);
  await activate('[data-gear-hub="demand"]');
  await page.waitForFunction(()=>location.pathname.startsWith('/giai-doan/'));
  await page.waitForSelector('#main-content h1');
  assert.deepEqual(errors, []); assert.deepEqual(networkIssues, []);
  const widths = [...new Set(responsive.map(item=>item.width))];
  const summary = widths.map(width=>({ width, stages:responsive.filter(item=>item.width===width).length, overflow:false, circleTextOverflow:false, hubOverlap:false, largeBehindSmall:true, diagonalDepth:true, whiteCenters:true }));
  console.log(JSON.stringify({ verdict:'PASS', responsive:summary, paired, tests:'7 widths x 6 stages; inner-only contours; large rear / small front; actual opposite rotation; upright hubs; real 4.5s paired cycle; pause 4.7s; resume; focused-link freeze; live reduced motion; offscreen freeze; native stage navigation', errors, networkIssues },null,2));
} finally {
  // A busy dev-page socket can delay Chrome shutdown; only stop this script's own browser.
  const ownChrome = browser.process();
  const shutdownTimer = setTimeout(() => {
    browser.disconnect();
    ownChrome?.kill('SIGTERM');
  }, 5000);
  try { await browser.close(); } finally { clearTimeout(shutdownTimer); }
}
// All assertions are awaited above. Discard leftover CDP transport timers after successful cleanup.
process.exit(0);
