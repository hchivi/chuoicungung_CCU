import puppeteer from 'puppeteer-core';

async function inspectImages() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    const url = 'https://trangvangvietnam.com/listings/1188012861/xuong-may-dong-phuc-tran-linh-cong-ty-tnhh-may-mac-tran-linh.html';
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });

    // Scroll down to trigger lazy loading
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight / 2);
      await new Promise(r => setTimeout(r, 1000));
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 1000));
    });

    const imgAttributes = await page.evaluate(() => {
      const allImgTags = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        dataSrc: img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy') || '',
        alt: img.alt,
        className: img.className
      }));

      // Background images
      const bgEls = Array.from(document.querySelectorAll('*')).filter(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg && bg !== 'none' && bg.includes('url');
      }).map(el => window.getComputedStyle(el).backgroundImage);

      return {
        allImgTags: allImgTags.slice(0, 20),
        bgEls: bgEls.slice(0, 10)
      };
    });

    console.log('Image attributes:', JSON.stringify(imgAttributes, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

inspectImages();
