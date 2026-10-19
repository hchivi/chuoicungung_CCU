import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const origin = 'http://localhost:3002/docs/testing/association-card-options/';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = { layouts: [], interactions: [], errors: [], networkFailures: [], contrast: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://localhost:3002/')) report.networkFailures.push(response.url()); });
  const click = async selector => { await page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.click(selector); };
  for (const variant of ['publication', 'folio', 'signature']) {
    await page.goto(`${origin}?option=${variant}`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.ac-gallery > article');
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewport({ width, height: 1000 });
      const layout = await page.evaluate(() => {
        const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
        return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
          clipped: [...document.querySelectorAll('.ac-options a, .ac-gallery > article, .ac-button, .ac-select, .ac-gallery summary')].filter(visible).filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.className),
          smallControls: [...document.querySelectorAll('a, button, summary')].filter(visible).filter(element => !element.classList.contains('ac-program__title') && element.getBoundingClientRect().height < 44).map(element => element.textContent),
          columns: getComputedStyle(document.querySelector('.ac-gallery')).gridTemplateColumns.split(' ').length,
          cards: document.querySelectorAll('.ac-gallery > article').length,
        };
      });
      assert.equal(layout.overflow, false, `${variant} page overflow ${width}`);
      assert.deepEqual(layout.clipped, [], `${variant} clipping ${width}`);
      assert.deepEqual(layout.smallControls, [], `${variant} small controls ${width}`);
      assert.equal(layout.cards, 3);
      assert.equal(layout.columns, variant === 'folio' || width < 768 ? 1 : width <= 1100 ? 2 : 3);
      report.layouts.push({ variant, ...layout });
      if ([375, 768, 1440].includes(width)) {
        await page.$$eval('.ac-gallery img', elements => elements.forEach(element => { element.loading = 'eager'; }));
        await page.waitForFunction(() => [...document.querySelectorAll('.ac-gallery img')].every(element => element.complete), { timeout: 4000 }).catch(() => {});
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: `/tmp/ccu-association-option-${variant}-${width}.png`, fullPage: true });
        const clip = await page.$eval('.ac-gallery', element => { const rect = element.getBoundingClientRect(); return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: Math.min(rect.height, innerWidth < 768 ? 1300 : 1500) }; });
        await page.screenshot({ path: `/tmp/ccu-association-option-${variant}-cards-${width}.png`, clip, captureBeyondViewport: true });
      }
    }
    await page.setViewport({ width: 1440, height: 1000 });
    if (variant === 'signature') { await click('.ac-gallery .ac-signature__details summary'); assert.equal(await page.$eval('.ac-gallery .ac-signature__details', element => element.open), true); }
    if (variant !== 'folio') { await click('.ac-gallery .ac-about summary'); assert.equal(await page.$eval('.ac-gallery .ac-about', element => element.open), true); }
    const rest = '.ac-gallery article:nth-child(2) .ac-more-programs';
    if (variant === 'signature') await click('.ac-gallery article:nth-child(2) .ac-signature__details summary');
    await click(`${rest} summary`); assert.equal(await page.$eval(rest, element => element.open), true);
    await click('.ac-select'); assert.match(await page.$eval('.ac-selection', element => element.textContent), /Đã đánh dấu/);
    await click('.ac-gallery .ac-claim'); await page.waitForSelector('dialog[open]');
    await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('dialog'));
    await click('.ac-state-lab > summary');
    assert.equal(await page.$$eval('.ac-state-grid article', elements => elements.length), 8);
    assert.equal(await page.$eval('[data-demo-state="loading"] .ac-button', element => element.disabled && element.getAttribute('aria-busy') === 'true'), true);
    assert.equal(await page.$eval('[data-demo-state="disabled"] .ac-button', element => element.disabled), true);
    assert.equal(await page.$eval('[data-demo-state="error"] .ac-image', element => element.dataset.imageState), 'error');
    await page.keyboard.press('Tab');
    await page.focus('.ac-gallery .ac-button');
    assert.equal(await page.$eval('.ac-gallery .ac-button', element => getComputedStyle(element).outlineStyle), 'solid');
    report.interactions.push(`${variant}: disclosures, select, native modal/Escape, 8 state previews, keyboard focus`);
  }
  await click('.ac-options a:first-child');
  assert.match(page.url(), /option=publication/);
  await click('.ac-options a:nth-child(2)'); assert.match(page.url(), /option=folio/);
  await page.goBack(); await page.waitForSelector('.ac-gallery--publication');
  await page.goForward(); await page.waitForSelector('.ac-gallery--folio');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('.ac-button', element => getComputedStyle(element).transitionDuration), '0s');
  const links = await page.$$eval('a[target="_blank"]', elements => elements.map(element => ({ href: element.href, rel: element.rel })));
  for (const link of links) { assert.ok(link.href.startsWith('http://localhost:3000/')); assert.match(link.rel, /noopener/); }
  report.interactions.push('Option navigation, browser back/forward, reduced motion, real localhost:3000 destination links');
  report.contrast = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1; const ctx = canvas.getContext('2d');
    const luminance = name => { ctx.fillStyle = styles.getPropertyValue(name).trim(); ctx.fillRect(0, 0, 1, 1); const rgb = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722; };
    return [['--color-ink', '--color-surface'], ['--color-muted', '--color-surface'], ['--color-muted', '--color-soft'], ['--color-accent-ink', '--color-accent'], ['--color-surface', '--color-cover'], ['--color-cover-muted', '--color-cover']].map(([a, b]) => { const x = luminance(a); const y = luminance(b); return { pair: `${a}/${b}`, ratio: (Math.max(x, y) + .05) / (Math.min(x, y) + .05) }; });
  });
  for (const pair of report.contrast) assert.ok(pair.ratio >= 4.5, JSON.stringify(pair));
  assert.deepEqual(report.errors, []); assert.deepEqual(report.networkFailures, []);
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
