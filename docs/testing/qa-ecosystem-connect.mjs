import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
});
const report = { viewports: [], navigation: [], errors: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto('http://localhost:3000/he-sinh-thai', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ecosystem-connect', { timeout: 60000 });
  await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' });
  for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 900 });
    await page.$eval('.ecosystem-connect', root => root.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('.ecosystem-connect img').complete);
    const state = await page.$eval('.ecosystem-connect', root => {
      const box = root.getBoundingClientRect();
      const links = [...root.querySelectorAll('a')].map(link => {
        const rect = link.getBoundingClientRect();
        const text = link.querySelector('span');
        const range = document.createRange(); range.selectNodeContents(text);
        return { href: link.getAttribute('href'), height: rect.height,
          lineCount: range.getClientRects().length, clipped: link.scrollWidth > link.clientWidth + 1,
          within: rect.left >= box.left && rect.right <= box.right };
      });
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        localOverflow: root.scrollWidth > root.clientWidth + 1, height: box.height,
        imageLoaded: root.querySelector('img').naturalWidth > 0, links,
        borders: ['Top', 'Right', 'Bottom', 'Left'].map(side => getComputedStyle(root)[`border${side}Width`]) };
    });
    assert.equal(state.overflow, false, `Document overflow at ${width}`);
    assert.equal(state.localOverflow, false, `CTA overflow at ${width}`);
    assert.equal(state.imageLoaded, true);
    assert.ok(state.borders.every(border => border === '1px'));
    assert.ok(state.links.every(link => link.height >= 48 && link.lineCount === 1 && !link.clipped && link.within), JSON.stringify(state));
    report.viewports.push(state);
    if ([375, 768, 1440].includes(width)) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      const clip = await page.$eval('.ecosystem-connect', root => {
        const rect = root.getBoundingClientRect();
        return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
      });
      await page.screenshot({ path: `/tmp/ccu-ecosystem-connect-${width}.png`, clip, captureBeyondViewport: true });
    }
  }
  await page.setViewport({ width: 1440, height: 900 });
  await page.focus('.ecosystem-connect__action');
  assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '/tao-ho-so');
  report.contrast = await page.$eval('.ecosystem-connect', root => {
    const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const luminance = color => {
      context.fillStyle = color; context.fillRect(0, 0, 1, 1);
      const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(value => {
        value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
      });
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    const style = getComputedStyle(root);
    const pairs = [['ink', 'paper'], ['muted', 'paper'], ['paper', 'forest'],
      ['on-forest', 'forest'], ['highlight', 'forest'], ['accent', 'paper'], ['paper', 'accent'],
      ['forest', 'soft'], ['focus', 'paper']];
    return pairs.map(([foreground, background]) => {
      const a = luminance(style.getPropertyValue('--connect-' + foreground));
      const b = luminance(style.getPropertyValue('--connect-' + background));
      return { foreground, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
    });
  });
  assert.ok(report.contrast.every(pair => pair.ratio >= 4.5), JSON.stringify(report.contrast));
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('.ecosystem-connect__action', link => getComputedStyle(link).transitionDuration), '0s');
  for (const [selector, expected] of [
    ['.ecosystem-connect__action--buyer', '/dang-nhu-cau'],
    ['.ecosystem-connect__action--supplier', '/tao-ho-so'],
  ]) {
    await page.goto('http://localhost:3000/he-sinh-thai');
    await page.waitForSelector(selector);
    await page.$eval(selector, link => link.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.click(selector);
    await page.waitForFunction(path => location.pathname === path, {}, expected);
    await page.waitForSelector('main');
    report.navigation.push({ destination: expected, rendered: true });
  }
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
