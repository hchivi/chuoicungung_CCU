import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const base = 'http://localhost:3000/';
const errors = [];
const results = [];
const screenshots = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base, { waitUntil: 'networkidle2' });
  await page.waitForSelector('[data-assistant-duo]', { timeout: 60000 });
  for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 1400 });
    await page.$eval('[data-assistant-duo]', el => el.scrollIntoView({ block: 'center' }));
    await page.waitForFunction(() => [...document.querySelectorAll('[data-assistant-duo] [data-mascot]')].every(el => el.dataset.mediaState === 'success'));
    const state = await page.$eval('[data-assistant-duo]', root => {
      const box = root.getBoundingClientRect();
      const overflow = [...root.querySelectorAll('*')].filter(el => {
        if (el.tagName === 'IMG' || getComputedStyle(el).display === 'none') return false;
        const b = el.getBoundingClientRect();
        return b.width && (b.left < box.left - 1 || b.right > box.right + 1);
      }).map(el => el.className);
      const names = [...root.querySelectorAll('.ccu-duo-identity strong')].map(el => {
        const range = document.createRange(); range.selectNodeContents(el);
        return { name: el.textContent, color: getComputedStyle(el).color, lines: new Set([...range.getClientRects()].map(b => Math.round(b.top))).size };
      });
      const links = [...root.querySelectorAll('[data-assistant-link]')].map(el => ({ href: el.getAttribute('href'), height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width, background: getComputedStyle(el).backgroundImage, color: getComputedStyle(el).color }));
      return { width: innerWidth, overflow, documentOverflow: document.documentElement.scrollWidth > innerWidth, names, links, images: [...root.querySelectorAll('img')].map(el => ({ src: el.getAttribute('src'), loaded: el.naturalWidth > 0 })), layer: [getComputedStyle(root.querySelector('.ccu-duo-identity')).zIndex, getComputedStyle(root.querySelector('.ccu-duo-pair')).zIndex] };
    });
    assert.deepEqual(state.overflow, [], 'Component overflow at ' + width);
    assert.equal(state.documentOverflow, false, 'Page overflow at ' + width);
    assert.ok(state.names.every(name => name.lines === 1));
    assert.notEqual(state.names[0].color, state.names[1].color);
    assert.ok(state.links.every(link => link.height >= 44 && link.width >= 44));
    assert.notEqual(state.links[0].background, state.links[1].background);
    assert.deepEqual(state.links.map(link => link.href), ['/tro-ly-ai?assistant=suppi', '/tro-ly-ai?assistant=chainy']);
    assert.equal(state.images.length, 2); assert.ok(state.images.every(image => image.loaded));
    assert.deepEqual(state.layer, ['1', '2']);
    results.push(state);
    if ([320, 375, 414, 768, 1280, 1920].includes(width)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const path = '/tmp/ccu-home-assistant-stage-' + width + '.png';
      const clip = await page.$eval('[data-assistant-duo]', el => {
        const b = el.getBoundingClientRect();
        return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height };
      });
      await page.screenshot({ path, clip, captureBeyondViewport: true });
      screenshots.push(path);
    }
  }
  const contrast = await page.$eval('[data-assistant-duo]', root => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const luminance = color => {
      ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
      const rgb = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    const style = getComputedStyle(root);
    return [['--ai-suppi', '--ai-mint'], ['--ai-chainy', '--ai-mint'], ['--ai-surface', '--ai-suppi'], ['--ai-surface', '--ai-suppi-light'], ['--ai-surface', '--ai-chainy'], ['--ai-surface', '--ai-chainy-light'], ['--ai-muted', '--ai-mint'], ['--ai-muted', '--ai-surface'], ['--ai-ink', '--ai-surface']].map(([fg, bg]) => {
      const a = luminance(style.getPropertyValue(fg)), b = luminance(style.getPropertyValue(bg));
      return { fg, bg, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
    });
  });
  assert.ok(contrast.every(pair => pair.ratio >= 4.5), JSON.stringify(contrast));
  for (const assistant of ['suppi', 'chainy']) {
    await page.waitForSelector('[data-assistant-link=' + assistant + ']', { timeout: 60000 });
    await page.focus('[data-assistant-link=' + assistant + ']');
    assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
    await page.keyboard.press('Enter');
    await page.waitForFunction(id => location.pathname === '/tro-ly-ai' && new URLSearchParams(location.search).get('assistant') === id, {}, assistant);
    await page.goto(base, { waitUntil: 'networkidle2' });
  }
  const failure = await browser.newPage();
  await failure.setRequestInterception(true);
  failure.on('request', request => request.url().includes('/mascots/') ? request.abort() : request.continue());
  await failure.goto(base, { waitUntil: 'networkidle2' });
  await failure.waitForSelector('[data-assistant-duo]', { timeout: 60000 });
  await failure.$eval('[data-assistant-duo]', el => el.scrollIntoView());
  await failure.waitForFunction(() => document.querySelectorAll('[data-assistant-duo] [data-media-state=error]').length === 2);
  assert.equal(await failure.$$eval('[data-assistant-duo] [data-assistant-link]', els => els.length), 2);
  await failure.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ verdict: 'PASS', breakpoints: results.length, results, contrast, keyboard: 'Both links navigate to existing routes', imageFailure: 'Both names and links remain available', screenshots, errors, backend: 'No assistant message sent; response behavior not validated', visualRegression: 'No committed baseline; screenshots reviewed manually' }, null, 2));
} finally {
  await browser.close();
}
