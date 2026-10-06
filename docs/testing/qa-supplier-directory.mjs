import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [];
const errors = [];
try {
  const page = await browser.newPage();
  const click = async selector => {
    await page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.click(selector);
  };
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://localhost:3000/nha-cung-ung', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-supplier-card]', { timeout: 60000 });
  await page.addStyleTag({ content: 'html, body, * { scroll-behavior: auto !important; }' });
  for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 1100 });
    const state = await page.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      phases: document.querySelectorAll('[data-phase]').length,
      cards: document.querySelectorAll('[data-supplier-card]').length,
      directContactLinks: document.querySelectorAll('[data-supplier-card] a[href^="mailto:"], [data-supplier-card] a[href*="zalo.me"], [data-supplier-card] a[href*="wa.me"]').length,
      shortControls: [...document.querySelectorAll('[data-supplier-explorer] button, [data-supplier-card] .sd-button, [data-supplier-card] .sd-contact-actions button')].filter(element => element.getBoundingClientRect().width && element.getBoundingClientRect().height < 43).map(element => element.textContent),
    }));
    assert.equal(state.overflow, false, 'Page overflow ' + width);
    assert.equal(state.phases, 18);
    assert.equal(state.cards, 24);
    assert.equal(state.directContactLinks, 0);
    assert.deepEqual(state.shortControls, []);
    results.push(state);
    if ([375, 768, 1440].includes(width)) {
      for (const [selector, section] of [['[data-supplier-explorer]', 'explorer'], ['.sd-workspace', 'results']]) {
        const clip = await page.$eval(selector, element => { const box = element.getBoundingClientRect(); return { x: box.left + scrollX, y: box.top + scrollY, width: box.width, height: Math.min(box.height, 1500) }; });
        await page.screenshot({ path: `/tmp/ccu-supplier-${section}-${width}.png`, clip, captureBeyondViewport: true });
      }
    }
  }
  await page.setViewport({ width: 1440, height: 1100 });
  for (const phase of ['1.1', '2.3', '4.3', '5.3', '6.3']) {
    await click(`[data-phase="${phase}"]`);
    await page.waitForFunction(id => new URLSearchParams(location.search).get('phase') === id, {}, phase);
    const ids = await page.$$eval('[data-supplier-card]', elements => elements.map(element => element.querySelector('[data-supplier-phase]')?.dataset.supplierPhase));
    assert.ok(ids.length > 0, 'No suppliers for phase ' + phase);
    assert.ok(ids.every(id => id === phase), 'Wrong displayed phase ' + phase);
    await click('[aria-label="Đặt lại tất cả bộ lọc"]');
    await page.waitForFunction(() => !location.search);
  }
  await page.keyboard.press('Tab');
  await page.focus('[data-phase="5.3"]');
  assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('phase') === '5.3');
  await click('[aria-label="Đặt lại tất cả bộ lọc"]');
  await click('.sd-alphabet button:nth-child(4)');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('letter') === 'C');
  await page.type('[aria-label="Tìm trong danh mục ngành"]', 'zzzzzz-not-found');
  assert.equal(await page.$$eval('.sd-industry-list a', elements => elements.length), 0);
  await click('.sd-small-empty button');
  await page.waitForFunction(() => !location.search);
  await click('input[value="gold"]');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('kyc') === 'gold');
  await page.select('#filter-province-select', 'Đà Nẵng');
  await click('#filter-api-ready');
  await click('#filter-fast-quote');
  await click('#filter-iso-certified');
  await click('[aria-label="Đặt lại tất cả bộ lọc"]');
  assert.equal(await page.evaluate(() => location.search), '');
  assert.deepEqual(await page.$$eval('.sd-checkbox-row input', elements => elements.map(element => element.checked)), [false, false, false]);
  await click('button[title="Chế độ xem dạng hàng (List)"]');
  assert.equal(await page.$eval('.sd-supplier-grid', element => element.dataset.view), 'list');
  await click('button[title="Chế độ xem dạng ô (Grid)"]');
  await click('[data-supplier-card] .sd-contact-actions button');
  await page.waitForSelector('input[placeholder="Nguyễn Văn A"]');
  // Read-only QA: do not submit the existing quote form.
  await click('.fixed.inset-0.z-50 button');
  await page.setViewport({ width: 375, height: 1000 });
  await click('.sd-mobile-filter-toggle');
  assert.equal(await page.$eval('#sd-filter-body', element => getComputedStyle(element).display), 'grid');
  await page.select('#sd-filter-phase', '5.3');
  await page.waitForFunction(() => new URLSearchParams(location.search).get('phase') === '5.3');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const contrast = await page.$eval('.sd-directory', root => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const luminance = color => {
      context.fillStyle = color; context.fillRect(0, 0, 1, 1);
      const rgb = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    const style = getComputedStyle(root);
    const pairs = [['--sd-ink', '--sd-paper'], ['--sd-muted', '--sd-paper'], ['--sd-muted', '--sd-soft'], ['--sd-accent-ink', '--sd-accent'], ['--sd-accent-ink', '--sd-accent-dark'], ['--sd-accent', '--sd-selected'], ...['one', 'two', 'three', 'four', 'five', 'six'].map(stage => ['--sd-stage-' + stage, '--sd-soft'])];
    return pairs.map(([foreground, background]) => {
      const a = luminance(style.getPropertyValue(foreground)), b = luminance(style.getPropertyValue(background));
      return { foreground, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
    });
  });
  assert.ok(contrast.every(pair => pair.ratio >= 4.5), JSON.stringify(contrast));
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ viewports: results, interactions: 'phase matching / keyboard / alphabet / local industry search / KYC / province / switches / reset / grid-list / masked-contact modal / mobile phase selector PASS', contrast, errors }, null, 2));
} finally { await browser.close(); }
