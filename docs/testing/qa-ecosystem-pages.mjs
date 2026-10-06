import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

// Only drive an isolated, temporary headless browser against the local preview.
const origin = process.env.CCU_QA_ORIGIN || 'http://localhost:3000';
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) throw new Error('QA is restricted to localhost.');
const output = '/tmp/ccu-ecosystem-qa';
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = { origin, date: new Date().toISOString(), viewports: [], interactions: [], pageErrors: [], consoleErrors: [], networkFailures: [] };
const routes = [
  '/dich-vu/hien-dien-tu-xa', '/dich-vu/vat-pham-su-kien', '/dich-vu/truyen-thong-doanh-nghiep', '/hop-tac?type=INVESTOR', '/tai-tro',
];
const page = await browser.newPage();
page.on('pageerror', error => report.pageErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text().slice(0, 240)); });
page.on('response', response => { if (response.status() >= 400) report.networkFailures.push({ url: response.url().replace(/\?.*$/, ''), status: response.status() }); });

async function navigate(route) {
  await page.goto(origin + route, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('.ec-page');
  await page.evaluate(() => document.fonts.ready);
}
async function clickText(selector, text) {
  const found = await page.evaluateHandle((selector, text) => [...document.querySelectorAll(selector)].find(node => node.textContent.trim() === text), selector, text);
  const element = found.asElement();
  assert.ok(element, `Missing ${selector}: ${text}`);
  await element.click();
  await found.dispose();
}
function passed(name) { report.interactions.push({ name, result: 'PASS' }); }

try {
  for (const route of routes) {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await navigate(route);
    const slug = route.split('?')[0].split('/').pop();
    await page.screenshot({ path: `${output}/${slug}-desktop.png` });
    for (const width of [320, 375, 414, 768, 1280, 1920]) {
      await page.setViewport({ width, height: width >= 768 ? 800 : 844, deviceScaleFactor: 1 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(() => [...document.querySelectorAll('.ec-page img[loading=eager]')].every(img => img.complete));
      const measure = await page.evaluate(() => {
        const scope = document.querySelector('.ec-page');
        const hero = scope.querySelector('section');
        const primary = hero.querySelector('.ec-button');
        const primaryRect = primary.getBoundingClientRect();
        const brokenImages = [...scope.querySelectorAll('img')].filter(img => img.complete && !img.naturalWidth).map(img => img.getAttribute('src'));
        const overflowing = [...scope.querySelectorAll('h1,h2,h3,.ec-button,.ec-text-link,input,select,textarea')].filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
        }).map(node => ({ tag: node.tagName, text: node.textContent.trim().slice(0, 70) }));
        const unnamedFields = [...scope.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(node => !node.labels?.length && !node.getAttribute('aria-label')).map(node => node.id || node.type);
        return { documentOverflow: document.documentElement.scrollWidth > innerWidth + 1, overflowing, brokenImages, unnamedFields, h1: scope.querySelectorAll('h1').length, primaryVisible: primaryRect.top >= 0 && primaryRect.bottom <= innerHeight, background: getComputedStyle(scope).backgroundColor };
      });
      report.viewports.push({ route, width, ...measure });
      assert.equal(measure.h1, 1);
      assert.equal(measure.documentOverflow, false, `${route} document overflow @ ${width}`);
      assert.deepEqual(measure.overflowing, [], `${route} elements overflow @ ${width}`);
      assert.deepEqual(measure.brokenImages, [], `${route} broken images`);
      assert.deepEqual(measure.unnamedFields, [], `${route} unnamed form fields`);
      if (width === 1280) assert.equal(measure.primaryVisible, true, `${route} hero CTA below fold`);
      if (width === 375) {
        await page.screenshot({ path: `${output}/${slug}-mobile-fold.png` });
        await page.screenshot({ path: `${output}/${slug}-mobile.png`, fullPage: true });
      }
    }
  }

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await navigate('/dich-vu/vat-pham-su-kien');
  await clickText('.ec-product button', 'Xem hạng mục');
  await page.waitForSelector('dialog[open]');
  assert.equal(await page.$eval('dialog', dialog => dialog.contains(document.activeElement)), true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  passed('Kit modal opens, contains focus and closes with Escape');
  await clickText('button', 'Xem cấu trúc báo giá');
  await page.waitForSelector('dialog[open]');
  assert.ok(await page.$eval('dialog', dialog => dialog.textContent.includes('không phải báo giá có hiệu lực')));
  await page.click('dialog button[aria-label="Đóng"]');
  await clickText('.ec-modes button', 'CCU cung ứng trực tiếp');
  assert.ok(await page.$eval('.ec-detail-line', el => el.textContent.includes('CCU là đầu mối cung ứng')));
  passed('Merchandise coordination mode changes the responsible party');
  await clickText('.ec-product a', 'Yêu cầu bộ này');
  await page.waitForFunction(() => location.pathname === '/yeu-cau-dich-vu');
  assert.ok(page.url().includes('service=vat-pham-su-kien&package=kit-tham-du-ngay-hoi'));
  passed('Kit CTA preserves service and kit query');

  await navigate('/dich-vu/truyen-thong-doanh-nghiep');
  await clickText('.ec-modes button', 'Hiện diện từ xa');
  assert.equal(await page.$eval('.ec-context-panel a', node => node.getAttribute('href')), '/dich-vu/hien-dien-tu-xa');
  passed('Media usage context switches to remote presence');

  await navigate('/hop-tac?type=INVESTOR');
  assert.match(await page.$eval('.ec-role-story h3', el => el.textContent), /Trao đổi riêng/);
  await clickText('.ec-role-nav button', 'Hội & Hiệp hội');
  assert.match(await page.$eval('.ec-role-story h3', el => el.textContent), /hội viên/);
  await navigate('/hop-tac?type=INVALID');
  assert.match(await page.$eval('.ec-role-story h3', el => el.textContent), /hội viên/);
  passed('Investor role is distinct; unknown role safely falls back');

  await navigate('/tai-tro?type=CATALOGUE');
  assert.equal(await page.$eval('.ec-sponsor-form-types button[aria-pressed=true]', el => el.textContent.trim().replace(/^02\s*/, '')), 'Catalogue');
  await clickText('.ec-modes button', 'Catalogue');
  assert.ok(await page.$$eval('#hoat-dong-dong-hanh .ec-programs article', nodes => nodes.every(node => node.textContent.includes('ấn bản'))));
  await clickText('.ec-programs button', 'Chọn ấn phẩm này');
  assert.notEqual(await page.$eval('#sponsor-field-2', el => el.value), '');
  passed('Catalogue opportunity prefills the sponsorship form');
  await navigate('/tai-tro?type=CATEGORY');
  assert.equal(await page.$('form'), null);
  assert.ok(await page.$('a[href="/founding-partner"]'));
  passed('Category sponsorship uses Founding Partner instead of an invalid intake');

  await navigate('/dich-vu/hien-dien-tu-xa');
  await clickText('button', 'Nhận tin chương trình mới');
  await page.waitForSelector('dialog[open]');
  await page.keyboard.press('Escape');
  passed('Remote interest modal opens and closes');
  const firstProgramId = await page.$eval('#remote-field-1', select => select.options[0].value);
  await navigate(`/dich-vu/hien-dien-tu-xa?programId=${encodeURIComponent(firstProgramId)}`);
  assert.equal(await page.$eval('#remote-field-1', select => select.value), firstProgramId);
  passed('Remote programId context is retained in the form');

  // Existing intake handlers persist only to localStorage. Block all network writes
  // while exercising them in this throwaway browser profile, never the user's tabs.
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) request.abort();
    else request.continue();
  });
  await page.click('#hasSampleCheck');
  assert.ok(await page.$('label[for="remote-field-4"]'));
  await page.click('form button[type=submit]');
  assert.equal(await page.$eval('#remote-field-2', node => node.validity.valueMissing), true);
  for (const [selector, value] of [['#remote-field-2', 'CCU QA doanh nghiệp thử nghiệm'], ['#remote-products', 'Gia công cơ khí'], ['#remote-field-7', 'Người kiểm thử CCU'], ['#remote-field-9', '0900000000'], ['#remote-field-10', 'qa@example.invalid']]) await page.type(selector, value);
  await page.$$eval('#dang-ky-hien-dien form input[type=checkbox]', nodes => nodes.at(-1).click());
  await page.click('#dang-ky-hien-dien form button[type=submit]');
  await page.waitForFunction(() => document.querySelector('#dang-ky-hien-dien').textContent.includes('Hồ sơ đã được ghi nhận'));
  passed('Remote form rejects empty input and accepts consented local test record');

  await navigate('/hop-tac?type=INVESTOR');
  for (const [selector, value] of [['#partner-field-1', 'CCU QA đầu tư thử nghiệm'], ['#partner-field-3', 'Người kiểm thử CCU'], ['#partner-field-5', '0900000000'], ['#partner-field-6', 'qa@example.invalid']]) await page.type(selector, value);
  await page.click('#gui-de-xuat-hop-tac form button[type=submit]');
  await page.waitForFunction(() => document.querySelector('#gui-de-xuat-hop-tac').textContent.includes('Đề xuất đã được ghi nhận'));
  passed('Investor form retains its existing local submit and success flow');

  await navigate('/tai-tro?type=MERCHANDISE');
  const checkedRights = await page.$$eval('#gui-de-xuat-tai-tro input[type=checkbox]:checked', nodes => nodes.map(node => node.parentElement.textContent.trim()));
  assert.ok(checkedRights.some(text => text.includes('In ấn logo')));
  assert.ok(checkedRights.some(text => text.includes('Báo cáo nghiệm thu')));
  for (const [selector, value] of [['#sponsor-field-5', 'CCU QA tài trợ thử nghiệm'], ['#sponsor-field-6', 'Người kiểm thử CCU'], ['#sponsor-field-8', '0900000000'], ['#sponsor-field-9', 'qa@example.invalid']]) await page.type(selector, value);
  await page.$$eval('#gui-de-xuat-tai-tro form input[type=checkbox]', nodes => nodes.at(-1).click());
  await page.click('#gui-de-xuat-tai-tro form button[type=submit]');
  await page.waitForFunction(() => document.querySelector('#gui-de-xuat-tai-tro').textContent.includes('Đề xuất đã được ghi nhận'));
  passed('Merchandise sponsor rights and consented local submit work');

  await page.evaluate(() => localStorage.clear());
  passed('All QA records removed from the isolated test profile');

  assert.deepEqual(report.pageErrors, []);
  report.result = 'PASS';
} catch (error) {
  report.result = 'FAIL';
  report.failure = error.message;
  await page.screenshot({ path: `${output}/failure.png`, fullPage: true });
  process.exitCode = 1;
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ result: report.result, viewports: report.viewports.length, interactions: report.interactions.length, pageErrors: report.pageErrors, consoleErrors: report.consoleErrors, networkFailures: report.networkFailures, failure: report.failure, output }, null, 2));
  await browser.close();
}
