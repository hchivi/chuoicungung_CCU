import puppeteer from 'puppeteer-core';

async function testTabsAndGallery() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    const url = 'https://trangvangvietnam.com/listings/1188012861/xuong-may-dong-phuc-tran-linh-cong-ty-tnhh-may-mac-tran-linh.html';
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });

    const tabInfo = await page.evaluate(async () => {
      // Find all tab buttons/links
      const clickableTabs = Array.from(document.querySelectorAll('a, button, li, .nav-tab, .tab-title, span')).filter(el => {
        const t = el.innerText.trim();
        return t === 'Sản phẩm dịch vụ' || t === 'Thư viện ảnh' || t === 'Hồ sơ công ty' || t === 'Giới thiệu chung';
      });

      const tabTexts = clickableTabs.map(t => ({ text: t.innerText.trim(), tag: t.tagName, href: t.href || '' }));

      return {
        tabCount: clickableTabs.length,
        tabTexts,
      };
    });

    console.log('Tabs info:', JSON.stringify(tabInfo, null, 2));

    // Try clicking "Thư viện ảnh"
    console.log('Clicking "Thư viện ảnh"...');
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('a, button, li, span')).find(e => e.innerText.trim() === 'Thư viện ảnh');
      if (el) el.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    const galleryData = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
        src: i.src,
        alt: i.alt,
        width: i.width,
        height: i.height,
        parentText: i.parentElement?.parentElement?.innerText?.slice(0, 100) || ''
      }));

      // Find all headers or product group names in gallery
      const headings = Array.from(document.querySelectorAll('h2, h3, h4, h5, .gallery-title, .title_pro')).map(h => h.innerText.trim());

      return {
        allImgsCount: imgs.length,
        imgs: imgs.filter(i => !i.src.includes('trangvang') && !i.src.includes('logo_')),
        headings
      };
    });

    console.log('Gallery Data after click:', JSON.stringify(galleryData, null, 2));

    // Try clicking "Sản phẩm dịch vụ"
    console.log('Clicking "Sản phẩm dịch vụ"...');
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('a, button, li, span')).find(e => e.innerText.trim() === 'Sản phẩm dịch vụ');
      if (el) el.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    const productServicesData = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        pageSnippet: text.slice(text.indexOf('SẢN PHẨM DỊCH VỤ'), text.indexOf('SẢN PHẨM DỊCH VỤ') + 2000)
      };
    });

    console.log('Product Services snippet:', JSON.stringify(productServicesData, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

testTabsAndGallery();
