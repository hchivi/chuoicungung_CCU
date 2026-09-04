import puppeteer from 'puppeteer-core';

async function testIndexD() {
  console.log('Testing index D on trangvangvietnam.com...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    const url = 'https://trangvangvietnam.com/findex/D';
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const data = await page.evaluate(() => {
      // Find all category links on findex/D
      const links = [];
      document.querySelectorAll('a[href*="/categories/"]').forEach(a => {
        const text = a.innerText.trim();
        const href = a.href;
        if (text && href) {
          links.push({ name: text, url: href });
        }
      });
      return {
        title: document.title,
        totalCategoryLinks: links.length,
        first10: links.slice(0, 10),
        sampleText: document.body.innerText.slice(0, 500)
      };
    });

    console.log('Findex D result:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

testIndexD();
