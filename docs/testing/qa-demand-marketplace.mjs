import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

// Read-only journeys on localhost; fixtures live only in this ephemeral profile.
const origin = process.env.CCU_QA_ORIGIN || 'http://localhost:3000';
assert.ok(['localhost','127.0.0.1','[::1]'].includes(new URL(origin).hostname));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
const errors = [], networkIssues = [], responsive = [], uppercase = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) networkIssues.push({ status: response.status(), url: response.url() }); });
await page.evaluateOnNewDocument(() => {
  window.ccuDemandPerf = { lcp: null, cls: 0 };
  try { new PerformanceObserver(list => { window.ccuDemandPerf.lcp = list.getEntries().at(-1)?.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.ccuDemandPerf.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
});
async function visit(route, selector = '#main-content h1') {
  await page.goto(origin + route, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector(selector);
  await page.evaluate(() => document.fonts.ready);
}
const count = () => page.$$eval('[data-demand-id]', elements => elements.length);
const waitCount = expected => page.waitForFunction(expected => document.querySelectorAll('[data-demand-id]').length === expected, { timeout: 5000 }, expected);
async function clickText(text) {
  const clicked = await page.evaluate(text => {
    const el = [...document.querySelectorAll('button')].find(el => el.textContent.trim() === text);
    if (!el) return false;
    el.click(); return true;
  }, text);
  assert.ok(clicked, 'Missing button: ' + text);
}
async function activate(selector) {
  // Global smooth scrolling can move a control between Puppeteer's scroll and
  // coordinate click. Keyboard activation exercises the real native control.
  await page.focus(selector);
  await page.keyboard.press('Enter');
}
try {
  for (const width of [320,375,414,768,1280,1920]) {
    await page.setViewport({ width, height: 1000 });
    await visit('/san-nhu-cau', '.demand-marketplace');
    const state = await page.evaluate(() => {
      const root = document.querySelector('.demand-marketplace');
      const titles = [...root.querySelectorAll('.dm-hero h1,.dm-hero h2')];
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        rootOverflow: root.scrollWidth > root.clientWidth + 1,
        heroCopy: titles.map(el => el.textContent.trim()),
        uppercase: titles.every(el => getComputedStyle(el).textTransform === 'uppercase'),
        secondTitleReadable: getComputedStyle(titles[1]).color === 'rgb(0, 96, 57)',
        heroImage: root.querySelector('.dm-hero img').getAttribute('src'),
        brokenImages: [...root.querySelectorAll('img')].filter(img => img.complete && !img.naturalWidth).map(img => img.src),
        labelsMissing: [...root.querySelectorAll('.dm-board input,.dm-board select')].filter(el => !el.labels?.length).map(el => el.id),
        subtitleCase: getComputedStyle(root.querySelector('.dm-board-intro h2')).textTransform,
        perf: window.ccuDemandPerf, height: root.offsetHeight };
    });
    assert.equal(state.overflow, false, 'Document overflow ' + width);
    assert.equal(state.rootOverflow, false, 'Marketplace overflow ' + width);
    assert.equal(state.uppercase, true);
    assert.equal(state.secondTitleReadable, true);
    assert.deepEqual(state.heroCopy, ['Nhu cầu mua hàng','và tìm nhà cung ứng']);
    assert.equal(state.heroImage, '/images/b2b_sourcing_demand_hero.jpg');
    assert.deepEqual(state.brokenImages, []);
    assert.deepEqual(state.labelsMissing, []);
    assert.notEqual(state.subtitleCase, 'uppercase');
    assert.ok(state.perf.cls < .1, 'Loading layout shift must stay below .1 at ' + width);
    responsive.push(state);
    if ([375,1280].includes(width)) await page.screenshot({ path: '/tmp/ccu-demands-final-' + width + '.png', fullPage: true });
    console.log('Responsive PASS ' + width);
  }
  await page.setViewport({ width: 1280, height: 1000 });
  await visit('/san-nhu-cau', '.demand-marketplace');
  const initialCategories = await page.$$eval('#demand-category-filter option', options => options.map(el => el.value));
  assert.equal(await count(), 6);
  await activate('.dm-load-more'); await waitCount(8); assert.equal(await count(), 8);
  await page.type('#demand-search-input', 'zz-no-matching-requirement');
  await page.waitForSelector('.dm-empty');
  assert.deepEqual(await page.$$eval('#demand-category-filter option', options => options.map(el => el.value)), initialCategories);
  await activate('.dm-empty button'); await waitCount(6); assert.equal(await count(), 6);
  await page.type('#demand-search-input', 'dong phuc');
  await page.waitForFunction(() => document.querySelectorAll('[data-demand-id]').length > 0 && document.querySelectorAll('[data-demand-id]').length < 6);
  assert.ok(await count() >= 1);
  assert.ok(await page.$$eval('[data-demand-id]', elements => elements.some(el => el.textContent.includes('500 bộ'))));
  await clickText('Xóa bộ lọc'); await waitCount(6);
  const category = initialCategories.find(value => value !== 'all');
  await page.select('#demand-category-filter', category);
  await page.waitForFunction(() => [...document.querySelectorAll('.dm-category')].length > 0 && [...document.querySelectorAll('.dm-category')].every(el => el.textContent === document.querySelector('#demand-category-filter').value));
  assert.ok(await count() > 0);
  assert.equal(await page.$$eval('.dm-category', elements => elements.every(el => el.textContent === document.querySelector('#demand-category-filter').value)), true);
  await clickText('Xóa bộ lọc'); await waitCount(6);
  await page.select('#demand-province-filter', 'Hà Nội');
  await waitCount(1);
  assert.equal(await count(), 1);
  await clickText('Xóa bộ lọc'); await waitCount(6);
  await activate('.dm-filter-toggle');
  assert.equal(await page.$eval('.dm-filter-toggle', el => el.getAttribute('aria-expanded')), 'true');
  await page.select('#demand-stage-filter', '5');
  await waitCount(2);
  assert.equal(await count(), 2);
  await page.focus('#demand-survey-req'); await page.keyboard.press('Space');
  await page.waitForSelector('.dm-empty');
  await clickText('Xóa bộ lọc'); await waitCount(6);
  await page.select('#demand-sort-filter', 'expiring_soon');
  await page.waitForFunction(() => {
    const dates = [...document.querySelectorAll('.dm-specs > div:last-child dd')].map(el => { const [day,month,year] = el.textContent.split('/').map(Number); return new Date(year,month-1,day).getTime(); });
    return dates.every((date,index) => index === 0 || dates[index - 1] <= date);
  });
  const dates = await page.$$eval('.dm-specs > div:last-child dd', elements => elements.map(el => { const [day,month,year] = el.textContent.split('/').map(Number); return new Date(year,month-1,day).getTime(); }));
  assert.ok(dates.every((date,index) => index === 0 || dates[index - 1] <= date));

  await activate('.dm-detail-button'); await page.waitForSelector('[role=dialog]');
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Đóng chi tiết nhu cầu');
  await page.keyboard.down('Shift'); await page.keyboard.press('Tab'); await page.keyboard.up('Shift');
  assert.match(await page.evaluate(() => document.activeElement.textContent), /TÔI CÓ KHẢ NĂNG/);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Đóng chi tiết nhu cầu');
  await page.keyboard.press('Escape');
  assert.equal(await page.$('[role=dialog]'), null);
  assert.equal(await page.evaluate(() => document.activeElement.className), 'dm-detail-button');
  await activate('.dm-detail-button');
  const code = await page.$eval('[role=dialog]', el => el.textContent.match(/NC-[A-Z0-9-]+/)[0]);
  await clickText('Hỏi SUPPI về điều kiện đáp ứng');
  await page.waitForSelector('input[placeholder="Nhập thắc mắc về nhu cầu này..."]');
  assert.ok(await page.evaluate(code => [...document.querySelectorAll('.whitespace-pre-line')].some(el => el.textContent.includes('Bạn đang xem nhu cầu [' + code)), code));
  // Close the existing assistant through its own close control; no AI/API call.
  await page.evaluate(() => document.querySelector('input[placeholder="Nhập thắc mắc về nhu cầu này..."]').closest('.fixed').querySelector('button').click());
  await activate('.dm-card-actions .dm-button');
  await page.waitForFunction(() => document.body.textContent.includes('Xác thực Hồ sơ Doanh nghiệp'));
  await clickText('Đóng lại');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('.dm-hero canvas', el => getComputedStyle(el).display), 'none');
  await page.emulateMediaFeatures([]);

  // Custom public states and confidential fixtures in isolated browser storage only.
  await page.evaluate(() => {
    const base = { category: 'QA-only category', province: 'QA-only province', title: 'QA public requirement', visibility: 'PUBLIC_SUMMARY', moderationStatus: 'APPROVED', publishedAt: '2026-10-05' };
    localStorage.setItem('ccu_master_requirements_v2', JSON.stringify([
      { ...base, id: 'QA-CLOSED', status: 'CLOSED' }, { ...base, id: 'QA-PAUSED', status: 'PAUSED' },
      { ...base, id: 'QA-PRIVATE', visibility: 'PRIVATE', title: 'SECRET PRIVATE RECORD', category: 'SECRET CATEGORY', status: 'ACTIVE_SOURCING' },
      { ...base, id: 'QA-PENDING', moderationStatus: 'PENDING', title: 'SECRET PENDING RECORD', status: 'ACTIVE_SOURCING' }
    ]));
  });
  await visit('/san-nhu-cau', '.demand-marketplace');
  assert.equal(await page.$('[data-demand-id=QA-CLOSED]'), null);
  assert.equal(await page.evaluate(() => document.querySelector('.demand-marketplace').textContent.includes('SECRET')), false);
  await page.select('#demand-status-filter', 'CLOSED');
  await page.waitForSelector('[data-demand-id=QA-CLOSED]');
  assert.equal(await page.$eval('[data-demand-id=QA-CLOSED] .dm-button', el => el.disabled), true);
  await page.select('#demand-status-filter', 'PAUSED');
  await page.waitForSelector('[data-demand-id=QA-PAUSED]');
  assert.equal(await page.$eval('[data-demand-id=QA-PAUSED] .dm-button', el => el.disabled), true);
  await page.evaluate(() => localStorage.clear());
  console.log('Marketplace interactions PASS');

  for (const route of ['/','/doi-tac-phat-trien','/dich-vu/to-chuc-ket-noi','/dich-vu/hien-dien-tu-xa','/dich-vu/vat-pham-su-kien','/dich-vu/truyen-thong-doanh-nghiep','/hop-tac','/tai-tro','/founding-partner','/yeu-cau-dich-vu','/nha-cung-ung','/nha-may','/hiep-hoi','/catalogue']) {
    for (const width of [375,1280]) {
      await page.setViewport({ width, height: 1000 });
      await visit(route);
      const state = await page.evaluate(() => {
        const title = document.querySelector('#main-content h1');
        const box = title.getBoundingClientRect();
        return { title: title.textContent.trim(), transform: getComputedStyle(title).textTransform, inside: box.left >= -1 && box.right <= innerWidth + 1, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.equal(state.transform, 'uppercase', route);
      assert.equal(state.inside, true, route + ' heading overflow');
      if (route !== '/') assert.ok(!state.title.startsWith('NỀN TẢNG KẾT NỐI'), route + ' unexpectedly rendered the homepage fallback');
      uppercase.push({ route, width, ...state });
    }
    console.log('Hero uppercase PASS ' + route);
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'PASS', responsive, uppercase, pageErrors: errors, networkIssues }, null, 2));
} catch (error) {
  console.log(JSON.stringify({ failedAt: error.message, page: page.url(), errors, networkIssues }, null, 2));
  await page.screenshot({ path: '/tmp/ccu-demands-qa-failure.png', fullPage: true });
  throw error;
} finally { await browser.close(); }
