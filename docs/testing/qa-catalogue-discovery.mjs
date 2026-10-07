import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { getAllCatalogues, CATALOGUE_TYPES } from '../../src/data/cataloguesData.js';

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = { viewports: [], interactions: [], errors: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto('http://localhost:3000/catalogue', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-catalogue-card]', { timeout: 60000 });
  await page.addStyleTag({ content: 'html, body, * { scroll-behavior: auto !important; }' });
  const click = async selector => {
    await page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.click(selector);
  };
  const ids = () => page.$$eval('[data-catalogue-card]', cards => cards.map(card => card.dataset.catalogueCard));
  const expectResults = async filters => {
    const expected = getAllCatalogues({ status: 'ACTIVE', ...filters }).map(c => c.id);
    await page.waitForFunction(expected => JSON.stringify([...document.querySelectorAll('[data-catalogue-card]')].map(card => card.dataset.catalogueCard)) === JSON.stringify(expected), {}, expected);
    assert.deepEqual(await ids(), expected);
  };
  for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 1000 });
    await page.$eval('.cl-grid', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForFunction(() => [...document.querySelectorAll('[data-catalogue-card] img')].slice(0, 3).every(img => img.complete));
    const state = await page.evaluate(() => ({
      width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
      columns: getComputedStyle(document.querySelector('.cl-grid')).gridTemplateColumns.split(' ').length,
      badTargets: [...document.querySelectorAll('.cl-discovery button, .cl-card button, .cl-card__primary, .cl-card summary')].filter(element => {
        const rect = element.getBoundingClientRect();
        if (!element.getClientRects().length) return false;
        return rect.height < 44 || element.scrollWidth > element.clientWidth + 1;
      }).map(element => element.textContent),
      clipped: [...document.querySelectorAll('.cl-card, .cl-book, .cl-discovery')].filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.className),
      clippedBookText: [...document.querySelectorAll('.cl-book__label')].filter(element => element.getBoundingClientRect().bottom > element.parentElement.getBoundingClientRect().bottom + 1).map(element => element.textContent),
      borders: ['Top', 'Right', 'Bottom', 'Left'].map(side => getComputedStyle(document.querySelector('.cl-filter-panel'))[`border${side}Width`]),
    }));
    assert.equal(state.overflow, false, `Page overflow at ${width}`);
    assert.ok(state.columns <= 3);
    assert.deepEqual(state.badTargets, [], `Clipped or undersized controls at ${width}`);
    assert.deepEqual(state.clipped, [], `Clipped component at ${width}`);
    assert.deepEqual(state.clippedBookText, [], `Clipped book text at ${width}`);
    assert.ok(state.borders.every(border => border === '1px'));
    report.viewports.push(state);
    if ([375, 768, 1440].includes(width)) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      const clip = await page.evaluate(() => {
        const start = document.querySelector('.cl-discovery').getBoundingClientRect();
        const end = document.querySelector('.cl-grid').getBoundingClientRect();
        return { x: start.left + scrollX, y: start.top + scrollY, width: start.width, height: Math.min(end.bottom - start.top, 1800) };
      });
      await page.screenshot({ path: `/tmp/ccu-catalogue-discovery-${width}.png`, clip, captureBeyondViewport: true });
    }
  }
  await page.setViewport({ width: 375, height: 1000 });
  await click('.cl-more-filters');
  assert.equal(await page.$eval('#cl-category', select => select.getClientRects().length > 0), true);
  await page.select('#cl-type', 'PROGRAM_CATALOGUE');
  await expectResults({ catalogueType: 'PROGRAM_CATALOGUE' });
  await click('.cl-reset');
  await click('.cl-more-filters');
  assert.equal(await page.$eval('#cl-category', select => select.getClientRects().length), 0);
  report.interactions.push('Compact mobile type selector and filter disclosure');
  await page.setViewport({ width: 1440, height: 1000 });
  for (const type of Object.keys(CATALOGUE_TYPES)) {
    await click(`[data-catalogue-type="${type}"]`);
    await expectResults({ catalogueType: type });
  }
  await click('.cl-reset');
  for (const [selector, key] of [['#cl-category', 'categoryId'], ['#cl-province', 'provinceId'], ['#cl-format', 'format']]) {
    const values = await page.$$eval(`${selector} option`, options => options.slice(1).map(option => option.value));
    for (const value of values) {
      await page.select(selector, value);
      await expectResults({ [key]: value });
    }
    await click('.cl-reset');
  }
  for (const term of ['Đồng Phục', 'Hiệp Phước', 'OEKO-TEX', 'Công ty', 'zzzz-no-catalogue']) {
    await page.$eval('#cl-search', input => { input.value = ''; });
    await page.type('#cl-search', term);
    await expectResults({ search: term });
    await click('[aria-label="Xoá từ khoá tìm kiếm"]');
  }
  await click('.cl-archive');
  await expectResults({ status: 'ARCHIVED' });
  assert.equal(await page.$eval('.cl-archive', button => button.getAttribute('aria-pressed')), 'true');
  await click('.cl-reset');
  await expectResults({});
  await page.focus('#cl-search');
  assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
  await click('.cl-card__information summary');
  assert.equal(await page.$eval('.cl-card__information', details => details.open), true);
  await click('.cl-card__secondary button');
  await page.waitForSelector('.fixed.inset-0.z-50');
  assert.ok((await page.$eval('.fixed.inset-0.z-50', modal => modal.textContent)).includes(getAllCatalogues()[0].title));
  await click('.fixed.inset-0.z-50 button');
  report.interactions.push('Six type filters; all category/province/format options; title/park/description/company/empty searches; clear and reset; archived reset; keyboard focus; information disclosure; digital viewer open/close');
  report.contrast = await page.$eval('.cl-discovery', root => {
    const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const luminance = color => {
      context.fillStyle = color; context.fillRect(0, 0, 1, 1);
      const [r, g, b] = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
      return r * .2126 + g * .7152 + b * .0722;
    };
    const style = getComputedStyle(root);
    return [['ink', 'paper'], ['muted', 'paper'], ['muted', 'soft'], ['ink', 'warm'], ['accent', 'paper'], ['accent', 'mint'], ['paper', 'accent'], ['paper', 'ink'], ['focus', 'paper'], ['input-rule', 'paper']].map(([a, b]) => {
      const l1 = luminance(style.getPropertyValue('--cl-' + a)), l2 = luminance(style.getPropertyValue('--cl-' + b));
      return { foreground: a, background: b, ratio: (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05) };
    });
  });
  assert.ok(report.contrast.every(pair => pair.ratio >= (pair.foreground === 'input-rule' ? 3 : 4.5)), JSON.stringify(report.contrast));
  await click('.cl-card__primary');
  await page.waitForFunction(() => location.pathname.startsWith('/catalogue/'));
  await page.waitForSelector('h1');
  report.interactions.push('Existing catalogue detail route renders');
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
