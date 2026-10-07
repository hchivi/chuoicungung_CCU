import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { PROGRAMS_DATA, PROGRAM_TYPES, PROGRAM_STATUSES } from '../../src/data/programsData.js';

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = { viewports: [], interactions: [], errors: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const click = async selector => {
    await page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.click(selector);
  };
  const open = async (path, selector) => {
    await page.goto('http://localhost:3000' + path, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(selector, { timeout: 60000 });
    await page.addStyleTag({ content: 'html, body, * { scroll-behavior: auto !important; }' });
  };
  const screenshot = async (selector, name, width) => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const clip = await page.$eval(selector, element => { const r = element.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: Math.min(r.height, 1600) }; });
    await page.screenshot({ path: `/tmp/ccu-${name}-${width}.png`, clip, captureBeyondViewport: true });
  };
  for (const [path, card, grid, section, name] of [
    ['/chuong-trinh', '[data-program-card]', '.pd-program-grid', '#danh-sach-chuong-trinh', 'program-discovery'],
    ['/nha-cung-ung', '[data-supplier-card]', '.sd-supplier-grid', '.sd-workspace', 'supplier-discovery'],
  ]) {
    await open(path, card);
    for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewport({ width, height: 1100 });
      const state = await page.evaluate((card, grid) => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        columns: getComputedStyle(document.querySelector(grid)).gridTemplateColumns.split(' ').length,
        cards: document.querySelectorAll(card).length,
        clippedActions: [...document.querySelectorAll(`${card} .pd-primary, ${card} .pd-secondary, ${card} .sd-button`)].filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent),
      }), card, grid);
      assert.equal(state.overflow, false, `${path}: overflow at ${width}`);
      assert.ok(state.columns <= 3, `${path}: ${state.columns} columns at ${width}`);
      assert.equal(state.cards, name === 'program-discovery' ? PROGRAMS_DATA.length : 24);
      assert.deepEqual(state.clippedActions, [], `${path}: clipped CTA at ${width}`);
      const clippedControls = await page.$$eval('.pd-type-nav strong, .sd-results-heading button', elements => elements.filter(element => {
        const box = element.getBoundingClientRect();
        const parent = element.closest('.pd-type-nav, .sd-results-heading').getBoundingClientRect();
        return box.right > parent.right + 1 || element.scrollWidth > element.clientWidth + 1;
      }).map(element => element.textContent || element.getAttribute('aria-label')));
      assert.deepEqual(clippedControls, [], `${path}: local control overflow at ${width}`);
      report.viewports.push({ path, width, ...state });
      if ([320, 375, 414, 768, 1440].includes(width)) await screenshot(section, name, width);
    }
  }
  await page.setViewport({ width: 1440, height: 1100 });
  await open('/chuong-trinh', '[data-program-card]');
  const reset = async () => { const button = await page.$('.pd-filter-summary button:last-child'); if (button && await button.evaluate(el => el.textContent.includes('Đặt lại'))) await click('.pd-filter-summary button:last-child'); };
  for (const type of PROGRAM_TYPES) {
    await click(`[data-program-type="${type.id}"]`);
    const expected = type.id === 'all' ? PROGRAMS_DATA.length : PROGRAMS_DATA.filter(program => program.type === type.id).length;
    assert.equal(await page.$$eval('[data-program-card]', cards => cards.length), expected);
  }
  await reset();
  for (const status of PROGRAM_STATUSES) {
    await page.select('#pd-status', status.id);
    assert.equal(await page.$$eval('[data-program-card]', cards => cards.length), PROGRAMS_DATA.filter(program => program.status === status.id).length);
  }
  await reset();
  await page.type('#pd-search', 'Robot AGV');
  assert.ok(await page.$$eval('[data-program-card]', cards => cards.length) > 0);
  await click('[aria-label="Xoá từ khoá tìm kiếm"]');
  await page.type('#pd-search', 'zzzz-no-program');
  assert.equal(await page.$$eval('[data-program-card]', cards => cards.length), 0);
  await reset();
  await click('[aria-controls="pd-extra-filters"]');
  for (const filter of ['zone', 'industry', 'role', 'format', 'time']) {
    const value = await page.$eval(`#pd-${filter}`, select => select.options[1].value);
    await page.select(`#pd-${filter}`, value);
    assert.ok(await page.$('.pd-filter-summary button:last-child'));
    await reset();
    assert.equal(await page.$$eval('[data-program-card]', cards => cards.length), PROGRAMS_DATA.length);
  }
  await page.focus('#pd-search');
  assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
  report.contrast = await page.$eval('.pd-discovery', root => {
    const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const luminance = color => {
      context.fillStyle = color; context.fillRect(0, 0, 1, 1);
      const [r, g, b] = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
      return r * .2126 + g * .7152 + b * .0722;
    };
    const style = getComputedStyle(root);
    const pairs = [['ink', 'paper'], ['muted', 'paper'], ['muted', 'green-soft'], ['accent', 'green-soft'], ['on-accent', 'accent'], ['on-accent', 'accent-dark'], ['amber', 'amber-soft'], ['error', 'paper'], ['focus', 'paper'], ['input-rule', 'paper']];
    return pairs.map(([foreground, background]) => { const a = luminance(style.getPropertyValue('--pd-' + foreground)), b = luminance(style.getPropertyValue('--pd-' + background)); return { foreground, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) }; });
  });
  assert.ok(report.contrast.every(pair => pair.ratio >= (['focus', 'input-rule'].includes(pair.foreground) ? 3 : 4.5)), JSON.stringify(report.contrast));
  await click('[data-program-card][data-status="upcoming"] .pd-primary');
  await page.waitForSelector('.fixed.inset-0.z-50');
  await click('.fixed.inset-0.z-50 button');
  await click('[data-program-card][data-status="completed"] .pd-primary');
  await page.waitForSelector('.fixed.inset-0.z-50');
  await click('.fixed.inset-0.z-50 button');
  report.interactions.push('Program types / seven statuses / need search / empty reset / zone / industry / role / format / time / keyboard focus / interest and recap modal open-close');
  const detail = await page.$eval('[data-program-card] h3 a', anchor => anchor.getAttribute('href'));
  await open(detail, 'h1');
  assert.equal(new URL(page.url()).pathname, detail);
  report.interactions.push('Program detail route');
  await open('/nha-cung-ung', '[data-supplier-card]');
  await click('[data-supplier-card] .sd-card-keywords summary');
  assert.equal(await page.$eval('[data-supplier-card] .sd-card-keywords', element => element.open), true);
  assert.equal(await page.$$eval('[data-supplier-card]:first-child .sd-card-gallery img', images => images.length), 3);
  assert.equal(await page.$$eval('[data-supplier-card] a[href^="tel:"], [data-supplier-card] a[href^="mailto:"], [data-supplier-card] a[href*="zalo.me"]', links => links.length), 0);
  await click('button[title="Chế độ xem dạng hàng (List)"]');
  await page.waitForFunction(() => document.querySelector('.sd-supplier-grid').dataset.view === 'list');
  const initialY = await page.$eval('.sd-view-toggle', element => element.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollBy(0, 2));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const afterY = await page.$eval('.sd-view-toggle', element => element.getBoundingClientRect().top);
  assert.ok(Math.abs(initialY - afterY) < 5, 'Sticky catalogue must not shift result controls');
  assert.equal(await page.$eval('.sd-supplier-grid', element => element.dataset.view), 'list');
  await screenshot('.sd-workspace', 'supplier-list', 1440);
  await page.setViewport({ width: 375, height: 1100 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.setViewport({ width: 1440, height: 1100 });
  await click('button[title="Chế độ xem dạng ô (Grid)"]');
  await page.waitForFunction(() => document.querySelector('.sd-supplier-grid').dataset.view === 'grid');
  const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await click('.sd-catalogue-pinned button[aria-controls="sd-pinned-catalogue-content"]');
  await page.waitForSelector('#sd-pinned-catalogue-content');
  assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), documentHeight);
  await click('.sd-catalogue-pinned button[aria-controls="sd-pinned-catalogue-content"]');
  for (const phase of ['1.1', '2.3', '4.3', '5.3', '6.3']) {
    await click(`[data-phase="${phase}"]`);
    await page.waitForFunction(id => new URLSearchParams(location.search).get('phase') === id, {}, phase);
    const matches = await page.$$eval('[data-supplier-card]', cards => cards.map(card => card.querySelector('[data-supplier-phase]')?.dataset.supplierPhase));
    assert.ok(matches.length > 0 && matches.every(id => id === phase));
    await click('[aria-label="Đặt lại tất cả bộ lọc"]');
  }
  await click('[data-supplier-card] .sd-contact-actions button');
  await page.waitForSelector('input[placeholder="Nguyễn Văn A"]');
  await click('.fixed.inset-0.z-50 button');
  report.interactions.push('Supplier keywords disclosure / three original images / masked contacts / grid-list responsive / five phase matches / contact modal open-close');
  // Follow-up: complete frames, measured sticky clearance and invitation intake.
  await page.setViewport({ width: 1440, height: 900 });
  await page.$eval('.sd-workspace', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForSelector('.sd-catalogue-pinned');
  await page.waitForFunction(() => {
    const bar = document.querySelector('.sd-catalogue-pinned').getBoundingClientRect();
    const filter = document.querySelector('.sd-filters').getBoundingClientRect();
    return filter.top >= bar.bottom + 10 && filter.bottom <= innerHeight - 10;
  });
  const borders = await page.$eval('.sd-filters', element => {
    const css = getComputedStyle(element);
    return ['Top', 'Right', 'Bottom', 'Left'].map(side => parseFloat(css[`border${side}Width`]));
  });
  assert.ok(borders.every(width => width >= 1));
  assert.equal(await page.$eval('#sd-filter-phase', element => element.getBoundingClientRect().bottom <= element.closest('.sd-filters').getBoundingClientRect().bottom - 4), true, 'Default compact panel exposes lifecycle select without inner scrolling');
  await page.screenshot({ path: '/tmp/ccu-filter-sticky-1440.png' });
  for (const kyc of ['diamond', 'gold', 'silver', 'all']) {
    await page.select('#filter-kyc-select', kyc);
    await page.waitForFunction(value => document.querySelector('#filter-kyc-select').value === value, {}, kyc);
  }
  await click('.sd-standards summary');
  for (const id of ['filter-api-ready', 'filter-fast-quote', 'filter-iso-certified']) {
    await click(`#${id}`);
    assert.equal(await page.$eval(`#${id}`, element => element.checked), true);
    await click('[aria-label="Đặt lại tất cả bộ lọc"]');
  }
  await click('.sd-quick-regions summary');
  assert.equal(await page.$eval('.sd-quick-regions', element => element.open), true);
  await page.select('#filter-province-select', 'Đà Nẵng');
  assert.equal(await page.$eval('#filter-province-select', element => element.value), 'Đà Nẵng');
  await click('[aria-label="Đặt lại tất cả bộ lọc"]');
  await page.setViewport({ width: 375, height: 900 });
  await click('.sd-mobile-filter-toggle');
  assert.equal(await page.$eval('.sd-mobile-filter-toggle', element => element.getAttribute('aria-expanded')), 'true');
  await screenshot('.sd-filters', 'compact-filter', 375);
  report.interactions.push('Supplier frame: four visible borders, clear of A–Z at 900px height, all KYC and technical filters, region select and mobile disclosure');
  await open('/chuong-trinh', '.pd-invitation');
  for (const width of [320, 375, 414, 768, 1440]) {
    await page.setViewport({ width, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const clipped = await page.$$eval('.pd-invitation input, .pd-invitation select, .pd-invitation button', controls => controls.filter(control => {
      const box = control.getBoundingClientRect(), frame = control.closest('.pd-invitation').getBoundingClientRect();
      return box.right > frame.right - 8 || box.left < frame.left + 8 || (control.tagName === 'BUTTON' && control.scrollWidth > control.clientWidth);
    }).map(control => control.id));
    assert.deepEqual(clipped, [], `Invitation clipping at ${width}`);
    const completeBorder = await page.$eval('.pd-filter-panel', element => {
      const css = getComputedStyle(element);
      return ['Top', 'Right', 'Bottom', 'Left'].every(side => parseFloat(css[`border${side}Width`]) >= 1);
    });
    assert.equal(completeBorder, true);
    await screenshot('.pd-invitation', 'invitation-intake', width);
  }
  await page.$eval('.pd-invitation form', form => form.requestSubmit());
  assert.equal(await page.$eval('#invitation-name', input => input.validity.valueMissing), true);
  assert.equal(await page.evaluate(() => localStorage.getItem('ccu_lead_consents')), null);
  for (const [key, value] of Object.entries({ name: 'QA Test', company: 'QA Fixture', email: 'qa@example.test', phone: '0900000000' })) await page.type(`#invitation-${key}`, value);
  await page.select('#invitation-zone', 'Miền Bắc');
  await page.select('#invitation-role', 'buyer');
  await page.click('.pd-invitation-consent input');
  await page.$eval('.pd-invitation form', form => form.requestSubmit());
  assert.equal(await page.evaluate(() => localStorage.getItem('ccu_lead_consents')), null);
  await page.click('.pd-invitation-consent input');
  await page.$eval('.pd-invitation form', form => form.requestSubmit());
  await page.waitForSelector('.pd-invitation-success');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ccu_lead_consents')));
  assert.equal(stored.length, 1);
  assert.equal(stored[0].zone, 'Miền Bắc');
  assert.equal(stored[0].role, 'buyer');
  assert.equal(stored[0].consentAccepted, true);
  await open('/chuong-trinh', '.pd-invitation');
  for (const [key, value] of Object.entries({ name: 'QA Test', company: 'QA Fixture', email: 'qa@example.test', phone: '0900000000' })) await page.type(`#invitation-${key}`, value);
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('QA blocked storage'); }; });
  await page.$eval('.pd-invitation form', form => form.requestSubmit());
  await page.waitForSelector('.pd-invitation-error');
  assert.equal(await page.$('.pd-invitation-success'), null);
  report.interactions.push('Invitation: seven fields, five responsive widths, native required-field/consent validation, local save and honest success, blocked-storage error without false success (ephemeral browser only)');
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
