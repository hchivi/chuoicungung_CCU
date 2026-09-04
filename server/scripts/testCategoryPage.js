import puppeteer from 'puppeteer-core';

async function testCategoryPage() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    const url = 'https://trangvangvietnam.com/categories/140660/da-do-dung-gia-da.html';
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const info = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href }));
      const listingLinks = allLinks.filter(l => l.href.includes('/listings/') || l.href.includes('trangvangvietnam.com/'));
      const h2s = Array.from(document.querySelectorAll('h2, h3, .company-name, .title_company, .tvx-cn')).map(el => el.innerText.trim());

      return {
        title: document.title,
        h2Count: h2s.length,
        sampleH2s: h2s.slice(0, 10),
        totalLinks: allLinks.length,
        sampleLinks: listingLinks.slice(0, 15),
        sampleText: document.body.innerText.slice(0, 1000)
      };
    });

    console.log('Category page info:', JSON.stringify(info, null, 2));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await browser.close();
  }
}

testCategoryPage();
