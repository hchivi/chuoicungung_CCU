import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { getAssociationsListing } from '../../src/data/associationsData.js';

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = { viewports: [], interactions: [], contrast: [], destinations: [], errors: [], networkFailures: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.networkFailures.push({ status: response.status(), url: response.url() }); });
  await page.goto('http://localhost:3000/hiep-hoi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-association-card]', { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'html, body, * { scroll-behavior: auto !important; }' });
  const click = async selector => { await page.$eval(selector, element => element.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.click(selector); };
  const unique = filters => [...new Map(getAssociationsListing(filters).associations.map(a => [a.id, a])).values()];
  const expectResults = async filters => {
    const expected = unique(filters).map(a => a.id);
    await page.waitForFunction(expected => JSON.stringify([...document.querySelectorAll('[data-association-card]')].map(card => card.dataset.associationCard)) === JSON.stringify(expected), {}, expected);
    assert.deepEqual(await page.$$eval('[data-association-card]', cards => cards.map(card => card.dataset.associationCard)), expected);
  };
  for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 1000 });
    await page.$eval('.ad-discovery', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    const state = await page.evaluate(() => {
      const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        clipped: [...document.querySelectorAll('.ad-discovery section, .ad-directory__head, .ad-directory__head > p, .ad-card, .ad-filter-panel')].filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.className),
        smallControls: [...document.querySelectorAll('.ad-discovery button, .ad-button, .ad-text-link, .ad-card summary')].filter(visible).filter(element => element.getBoundingClientRect().height < 44).map(element => element.textContent),
        wrappedControls: [...document.querySelectorAll('.ad-button, .ad-text-link, .ad-card__claim, .ad-quick button, .ad-card summary')].filter(visible).filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent),
        borders: ['Top', 'Right', 'Bottom', 'Left'].map(side => getComputedStyle(document.querySelector('.ad-filter-panel'))[`border${side}Width`]),
        columns: getComputedStyle(document.querySelector('.ad-grid')).gridTemplateColumns.split(' ').length,
      };
    });
    assert.equal(state.overflow, false, `Page overflow at ${width}`); assert.deepEqual(state.clipped, [], `Component clipping ${width}`); assert.deepEqual(state.smallControls, [], `Small controls ${width}`); assert.deepEqual(state.wrappedControls, [], `Wrapped or clipped labels ${width}`); assert.ok(state.borders.every(value => value === '1px')); assert.ok(state.columns <= 3);
    report.viewports.push(state);
    if ([375, 768, 1440].includes(width)) {
      await page.$$eval('.ad-card__image img', images => images.slice(0, 6).forEach(image => { image.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.querySelectorAll('.ad-card__image img')].slice(0, 6).every(image => image.complete), { timeout: 3000 }).catch(() => { report.interactions.push(`Remote thumbnails still loading at ${width}; reserved initial fallback remains visible`); });
      await page.evaluate(() => window.scrollTo(0, 0));
      const clip = await page.$eval('.ad-discovery', element => { const rect = element.getBoundingClientRect(); return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: Math.min(rect.height, 2300) }; });
      await page.screenshot({ path: `/tmp/ccu-association-discovery-${width}.png`, clip, captureBeyondViewport: true });
      await page.$eval('.ad-grid', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.evaluate(() => window.scrollTo(0, 0));
      const cardsClip = await page.$eval('.ad-grid', element => { const rect = element.getBoundingClientRect(); return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: Math.min(rect.height, 1300) }; });
      await page.screenshot({ path: `/tmp/ccu-association-cards-${width}.png`, clip: cardsClip, captureBeyondViewport: true });
    }
  }
  await page.setViewport({ width: 1440, height: 1000 });
  for (const scopeType of ['NATIONAL', 'REGIONAL', 'PROVINCIAL', 'SPECIALIZED_INDUSTRY']) { await page.select('#ad-scope', scopeType); await expectResults({ scopeType }); }
  await click('.ad-reset');
  for (const sector of ['cơ khí', 'điện tử', 'dệt may', 'thủy sản', 'logistics', 'kcn', 'bao bì']) { await click(`[data-sector="${sector}"]`); await expectResults({ sector }); }
  await click('.ad-reset');
  for (const query of ['HAME', 'logistics', 'zzzz-no-association']) { await page.type('#ad-search', query); await expectResults({ query }); await click('[aria-label="Xóa từ khóa tìm kiếm"]'); }
  await page.type('#ad-region', 'Đồng Nai'); await expectResults({ region: 'Đồng Nai' }); await click('.ad-reset');
  await click('.ad-checks label:first-child'); await expectResults({ hasOpenPrograms: true }); await click('.ad-reset');
  await click('.ad-checks label:last-child'); await expectResults({ hasCatalogue: true }); await click('.ad-reset');
  for (const sortBy of ['az', 'members', 'programs']) { await page.select('#ad-sort', sortBy); await expectResults({ sortBy }); }
  await click('.ad-reset');
  for (const [name, filters] of [['mechanical', { sector: 'cơ khí' }], ['dongnai', { region: 'Đồng Nai' }], ['programs', { hasOpenPrograms: true }]]) { await click(`[data-quick="${name}"]`); await expectResults(filters); }
  await click('.ad-reset'); report.interactions.push('All scopes, sectors, query, region, program/catalogue filters, sorts, quick shortcuts, empty state and reset match existing data API');
  assert.equal(await page.$$eval('[data-association-card]', elements => elements.length === new Set(elements.map(element => element.dataset.associationCard)).size), true);
  await click('.ad-card__about summary'); assert.equal(await page.$eval('.ad-card__about', element => element.open), true);
  await click('.ad-card__claim');
  await page.waitForFunction(() => document.body.textContent.includes('Đề Nghị Liên Kết Hồ Sơ Hội Viên'));
  await click('.fixed.inset-0.z-50 button');
  report.interactions.push('Deduplicated organization records; information disclosure; existing membership dialog opens and closes, no request submitted');
  await page.setViewport({ width: 375, height: 1000 });
  await page.select('#ad-sector', 'logistics'); await expectResults({ sector: 'logistics' }); await click('.ad-reset');
  await page.focus('#ad-search'); assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('.ad-button', element => getComputedStyle(element).transitionDuration), '0s');
  report.interactions.push('Mobile native sector select, visible keyboard focus and reduced motion');
  const pairs = [['--ad-ink', '--ad-white'], ['--ad-muted', '--ad-white'], ['--ad-on-green', '--ad-green'], ['--ad-on-green', '--ad-green-hover'], ['--ad-blue-ink', '--ad-blue'], ['--ad-rose-ink', '--ad-rose'], ['--ad-yellow-ink', '--ad-yellow'], ['--ad-mint-ink', '--ad-mint'], ['--ad-focus', '--ad-white']];
  report.contrast = await page.evaluate(pairs => {
    const styles = getComputedStyle(document.querySelector('.ad-discovery'));
    const luminance = hex => { const values = hex.replace('#', '').match(/../g).slice(0, 3).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4); return .2126 * values[0] + .7152 * values[1] + .0722 * values[2]; };
    return pairs.map(([foreground, background]) => { const a = luminance(styles.getPropertyValue(foreground).trim()); const b = luminance(styles.getPropertyValue(background).trim()); return { foreground, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) }; });
  }, pairs);
  for (const pair of report.contrast) assert.ok(pair.ratio >= 4.5, `Contrast ${pair.foreground}: ${pair.ratio}`);
  await page.setViewport({ width: 1440, height: 1000 });
  for (const [selector, path] of [['.ad-card h3 a', '/hiep-hoi/'], ['.ad-card__program > a', '/chuong-trinh/'], ['.ad-invitation__copy > .ad-button', '/dich-vu/to-chuc-ket-noi']]) {
    const href = await page.$eval(selector, element => element.getAttribute('href')); assert.ok(href.startsWith(path));
    const destination = await browser.newPage(); await destination.goto(`http://localhost:3000${href}`, { waitUntil: 'domcontentloaded' });
    await destination.waitForFunction(() => document.querySelector('h1, h2'), { timeout: 30000 });
    const content = await destination.evaluate(() => document.querySelector('#root').textContent);
    report.destinations.push({ href, url: destination.url(), headings: await destination.$$eval('h1, h2', elements => elements.map(element => element.textContent)) });
    assert.doesNotMatch(content, /404 -|Không tìm thấy (hội|hiệp hội|chương trình)|Chương Trình Chưa Công Bố Hoặc Không Tồn Tại/i, `Unavailable destination: ${href}`); await destination.close();
  }
  report.interactions.push('Live organization profile, related program and cooperation destinations load');
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} catch (error) { console.log(JSON.stringify(report, null, 2)); throw error; }
finally { await browser.close(); }
