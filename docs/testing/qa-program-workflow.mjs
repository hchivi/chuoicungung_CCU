import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = { viewports: [], interactions: [], errors: [], submissions: [], actualDatabaseWrites: 0 };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  let fail = true;
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('/api/submissions/') && request.method() === 'POST') {
      const payload = JSON.parse(request.postData()).data;
      report.submissions.push({ kind: request.url().split('/').pop(), role: payload.role, programId: payload.programId, domain: payload.domain });
      return request.respond({ status: fail ? 503 : 201, contentType: 'application/json', body: JSON.stringify(fail ? { success: false, error: { message: 'Supabase kiểm thử chưa kết nối' } } : { success: true, source: 'supabase', data: { id: 'CCU-QA-ACK', status: 'PENDING', data: payload } }) });
    }
    return request.continue();
  });
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000/chuong-trinh/vsip-binh-duong', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.pw-registration', { timeout: 60000 });
  await page.addStyleTag({ content: '* { scroll-behavior: auto !important; }' });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewport({ width, height: 1100 });
    const state = await page.evaluate(() => ({ width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, workflowOverflow: [...document.querySelectorAll('.pw-section')].some(element => element.scrollWidth > element.clientWidth + 1), roles: document.querySelectorAll('[data-registration-role]').length, labels: [...document.querySelectorAll('.pw-section input:not([type=checkbox]), .pw-section select, .pw-section textarea')].every(element => Boolean(element.labels?.length)) }));
    assert.equal(state.overflow, false, JSON.stringify(state));
    assert.equal(state.workflowOverflow, false, JSON.stringify(state));
    assert.equal(state.roles, 4); assert.equal(state.labels, true);
    report.viewports.push(state);
    if ([375, 1440].includes(width)) {
      await page.$eval('#dang-ky-tai-tro', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.screenshot({ path: `/tmp/ccu-program-workflow-${width}.png` });
    }
  }
  await page.setViewport({ width: 1440, height: 1100 });
  const click = async selector => { await page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.click(selector); };
  for (const role of ['supplier', 'association', 'sponsor', 'buyer']) {
    await click(`[data-registration-role=${role}]`);
    assert.equal(await page.$eval(`[data-registration-role=${role}]`, element => element.getAttribute('aria-pressed')), 'true');
  }
  report.interactions.push('four roles switch correctly');
  await click('[data-matching-target]');
  await page.waitForSelector('[data-registration-role=supplier][aria-pressed=true]');
  assert.equal(await page.$eval('[data-registration-role=supplier]', element => element.getAttribute('aria-pressed')), 'true');
  assert.ok(await page.$eval('#pw-targetFactories', element => element.value));
  report.interactions.push('buyer demand selects supplier role and fills meeting target');
  // Repeated top CTA must override a role selected inside the form.
  await page.$$eval('button', buttons => buttons.find(button => button.textContent.trim() === 'Đăng Ký Người Mua')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const topBuyer = await page.waitForSelector('button::-p-text(Đăng Ký Người Mua)');
  await topBuyer.click();
  await page.waitForSelector('[data-registration-role=buyer][aria-pressed=true]');
  await click('[data-registration-role=association]');
  await topBuyer.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await topBuyer.click();
  await page.waitForSelector('[data-registration-role=buyer][aria-pressed=true]');
  await click('[data-matching-target]');
  await page.waitForSelector('[data-registration-role=supplier][aria-pressed=true]');
  report.interactions.push('repeated top Buyer CTA restores buyer form after local role switches');
  await page.type('#pw-companyName', 'QA doanh nghiệp');
  await page.type('#pw-contactPerson', 'QA đại diện');
  await page.type('#pw-email', 'qa@example.com');
  await page.type('#pw-phone', '0901234567');
  await page.type('#pw-productsOffered', 'Gia công CNC');
  await click('.pw-registration input[type=checkbox]');
  await click('.pw-registration button[type=submit]');
  await page.waitForSelector('.pw-registration .pw-error');
  assert.equal(await page.$('.pw-registration .pw-success'), null);
  assert.equal(await page.$eval('#pw-companyName', element => element.value), 'QA doanh nghiệp');
  fail = false;
  await click('.pw-registration button[type=submit]');
  await page.waitForSelector('.pw-registration .pw-success');
  assert.ok((await page.$eval('.pw-registration .pw-success', element => element.textContent)).includes('CCU-QA-ACK'));
  report.interactions.push('mock 503 keeps draft and does not show success; retry ACK shows actual receipt');
  await click('.pw-results-heading button');
  assert.ok(await page.$('#pw-evidence-form'));
  await page.type('#pw-result-buyer', 'QA nhà máy');
  await page.type('#pw-result-supplier', 'QA NCC');
  await page.type('#pw-result-product', 'CNC');
  await page.type('#pw-result-nextAction', 'Gửi mẫu tuần tới');
  await page.type('#pw-result-photoUrl', 'https://example.com/album');
  await page.type('#pw-result-email', 'qa@example.com');
  await click('#pw-evidence-form input[type=checkbox]');
  await click('#pw-evidence-form button[type=submit]');
  await page.waitForSelector('#pw-evidence-form .pw-success');
  assert.equal(report.submissions.at(-1).domain, 'program-post-matching');
  report.interactions.push('post-meeting evidence submitted privately via mocked API, not auto-published');
  for (const slug of ['sourcing-day-electronics-bac-ninh', 'ham-kiem-1', 'pitching-automation-chu-lai', 'tan-duc-hai-son-postponed', 'dien-dan-phu-tro-amata-cancelled']) {
    await page.goto(`http://localhost:3000/chuong-trinh/${slug}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.pw-registration button[type=submit]', { timeout: 60000 });
    assert.equal(await page.$eval('.pw-registration button[type=submit]', element => element.disabled), true, slug);
  }
  report.interactions.push('upcoming, completed, closed, postponed and cancelled pages block new registrations');
  assert.equal(report.errors.length, 0, report.errors.join('\n'));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
