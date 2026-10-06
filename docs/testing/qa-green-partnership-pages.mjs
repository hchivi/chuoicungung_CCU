import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

// Isolated ephemeral Chrome profile. Localhost only; no production submissions.
const origin = process.env.CCU_QA_ORIGIN || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname));
const browser = await puppeteer.launch({
  executablePath: process.env.CCU_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage();
const errors = [], networkIssues = [], results = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) networkIssues.push({ url: response.url(), status: response.status() }); });
await page.evaluateOnNewDocument(() => {
  window.ccuPerf = { lcp: null, cls: 0 };
  try { new PerformanceObserver(list => { window.ccuPerf.lcp = list.getEntries().at(-1)?.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.ccuPerf.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
});
async function visit(route, selector) {
  await page.goto(origin + route, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.waitForSelector(selector);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('#main-content img')].filter(img => img.loading !== 'lazy').map(img => img.decode().catch(() => {})));
  });
}
try {
  for (const [route, scope, name] of [
    ['/doi-tac-phat-trien', '.dp-page', 'dev'],
    ['/dich-vu/to-chuc-ket-noi', '.mm-page', 'match'],
  ]) {
    for (const width of [320, 375, 414, 768, 1280, 1920]) {
      await page.setViewport({ width, height: 1000 });
      await visit(route, scope);
      const state = await page.evaluate(scope => {
        const root = document.querySelector(scope);
        const footer = document.querySelector('.ccu-footer');
        const hero = root.querySelector('h1').getBoundingClientRect();
        return {
          h1: root.querySelectorAll('h1').length,
          overflow: document.documentElement.scrollWidth > innerWidth,
          rootOverflow: root.scrollWidth > root.clientWidth + 1,
          brokenImages: [...root.querySelectorAll('img')].filter(img => img.complete && !img.naturalWidth).map(img => img.src),
          footerColor: getComputedStyle(footer).backgroundColor,
          labelsMissing: [...root.querySelectorAll('input,select,textarea')].filter(input => !input.labels?.length).map(input => input.name),
          heroInside: hero.left >= 0 && hero.right <= innerWidth + 1,
          perf: window.ccuPerf,
        };
      }, scope);
      assert.equal(state.h1, 1);
      assert.equal(state.overflow, false, route + ' document overflow at ' + width);
      assert.equal(state.rootOverflow, false, route + ' page overflow at ' + width);
      assert.equal(state.heroInside, true);
      assert.deepEqual(state.brokenImages, []);
      assert.deepEqual(state.labelsMissing, []);
      assert.equal(state.footerColor, 'rgb(8, 36, 21)');
      results.push({ route, width, ...state });
      if ([375,1280].includes(width)) await page.screenshot({ path: '/tmp/ccu-green-' + name + '-' + width + '.png', fullPage: true });
    }
  }
  await page.setViewport({ width: 1280, height: 1000 });
  await visit('/dich-vu/to-chuc-ket-noi', '.mm-page');
  for (let index = 0; index < 3; index++) {
    await page.click('#mm-stage-' + index);
    assert.equal(await page.$eval('#mm-stage-' + index, el => el.getAttribute('aria-pressed')), 'true');
    assert.equal(await page.$eval('#mm-phase-' + index, el => el.hidden), false);
    assert.equal(await page.$$eval('.mm-phase:not([hidden])', els => els.length), 1);
  }
  for (const id of ['plant-sourcing','kcn-expo','joint-booth','pitching-session']) {
    const href = await page.$eval('[data-format="' + id + '"] a', el => el.href);
    assert.equal(new URL(href).searchParams.get('service'), 'to-chuc-ket-noi');
    assert.equal(new URL(href).searchParams.get('format'), id);
  }
  await page.focus('.mm-faq summary');
  await page.keyboard.press('Enter');
  assert.equal(await page.$eval('.mm-faq details', el => el.open), true);
  const buttonBefore = await page.$eval('.mm-button', el => getComputedStyle(el).backgroundImage);
  await page.hover('.mm-button');
  const buttonHover = await page.$eval('.mm-button', el => getComputedStyle(el).backgroundImage);
  assert.match(buttonBefore, /rgb\(18, 123, 75\)/);
  assert.match(buttonHover, /rgb\(0, 71, 42\)/);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.mm-button')).transform === 'none');

  await visit('/doi-tac-phat-trien', '.dp-page');
  assert.equal(await page.$eval('.dp-form', form => form.checkValidity()), false);
  for (let index = 0; index < 5; index++) {
    const buttons = await page.$$('.dp-choice-list button');
    await buttons[index].click();
    assert.equal(await buttons[index].evaluate(el => el.getAttribute('aria-pressed')), 'true');
    assert.equal(await page.$$eval('.dp-choice-list [aria-pressed=true]', els => els.length), 1);
  }
  await page.click('#dp-cooperation-detail .ec-button');
  assert.equal(await page.$eval('[value=LOCAL_COORDINATION]', el => el.checked), true);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'dp-applicantName');
  for (const [name,value] of Object.entries({ applicantName: 'CCU UI QA', contactPerson: 'UI Test', email: 'ccu-ui-qa@example.invalid', phone: '0900000000', targetAudienceDescription: 'Local isolated interface test, not a real partnership request.' })) await page.type('[name="' + name + '"]', value);
  await page.click('[name=consentAccepted]');
  assert.equal(await page.$eval('.dp-form', form => form.checkValidity()), true, 'Filled intake must pass native validation before testing custom validation');
  for (const box of await page.$$('input[name=cooperationTypes]:checked')) {
    await box.focus();
    await page.keyboard.press('Space');
    assert.equal(await box.evaluate(el => el.checked), false);
  }
  assert.equal(await page.$$eval('input[name=cooperationTypes]:checked', els => els.length), 0);
  await page.click('.dp-submit');
  await page.waitForSelector('.dp-error', { timeout: 5000 });
  assert.match(await page.$eval('.dp-error', el => el.textContent), /ít nhất một/);
  await page.click('[value=PROGRAM_ORGANIZATION]');
  await page.click('.dp-submit');
  await page.waitForSelector('.dp-success');
  const submitted = await page.evaluate(() => JSON.parse(localStorage.getItem('ccu_dev_partner_applications_v1')).find(item => item.email === 'ccu-ui-qa@example.invalid'));
  assert.ok(submitted);
  assert.equal(submitted.status, 'APPLIED');
  assert.deepEqual(submitted.cooperationTypes, ['PROGRAM_ORGANIZATION']);
  assert.equal(submitted.consentAccepted, true);
  assert.match(await page.$eval('.dp-success', el => el.textContent), /Chưa xác nhận chuyển hồ sơ/);
  // Data is removed from the isolated QA profile, never from the user's browser.
  await page.evaluate(() => localStorage.clear());
  await page.emulateMediaFeatures([]);

  for (const [route,scope] of [['/','.ccu-public-shell'],['/hop-tac?type=INVESTOR','.ec-page'],['/tai-tro','.ec-page'],['/yeu-cau-dich-vu','.service-request'],['/founding-partner','.fp-page']]) {
    await visit(route, scope);
    assert.equal(await page.$eval('.ccu-footer', el => getComputedStyle(el).backgroundColor), 'rgb(8, 36, 21)');
    const color = await page.$eval('.ccu-public-shell', el => getComputedStyle(el).getPropertyValue('--brand-green').trim());
    assert.equal(color, '#006039');
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'PASS', responsiveCases: results.length, interactions: 'stages, format links, keyboard FAQ, gradient hover, reduced motion, partner choices/prefill/validation/APPLIED', results, networkIssues, pageErrors: errors }, null, 2));
} catch (error) {
  console.log(JSON.stringify({ failedAt: error.message, page: page.url(), form: await page.evaluate(() => [...document.querySelectorAll('.dp-form input,.dp-form textarea,.dp-form select')].map(el => ({ name: el.name, valid: el.checkValidity(), message: el.validationMessage, checked: el.checked, value: el.value }))), errors }, null, 2));
  await page.screenshot({ path: '/tmp/ccu-green-qa-failure.png' });
  throw error;
} finally { await browser.close(); }
