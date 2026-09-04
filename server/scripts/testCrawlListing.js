import puppeteer from 'puppeteer-core';

async function testCrawl() {
  console.log('Testing crawl listing on trangvangvietnam.com...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    const url = 'https://trangvangvietnam.com/listings/1187676072/cong-ty-tnhh-thuong-mai-xuat-nhap-khau-tin-phat.html';
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const detailData = await page.evaluate(() => {
      // Company name
      const titleEl = document.querySelector('h1') || document.querySelector('.company-name') || document.querySelector('.detail-title');
      const name = titleEl ? titleEl.innerText.trim() : '';

      // Logo
      const logoEl = document.querySelector('.detail-logo img, .company-logo img, img[src*="logo.trangvangvietnam.com"]');
      const logo = logoEl ? logoEl.src : null;

      // Extract all text content
      const pageText = document.body.innerText;

      // Products / Services
      const productElements = document.querySelectorAll('.product-item, .san-pham li, .ds-san-pham li, .detail-products li, .prod-title, .sp-tieubieu, #tab-product li, #sanpham li, ul.list-product li');
      const products = [];
      productElements.forEach(el => {
        const text = el.innerText.trim();
        if (text && text.length > 2 && text.length < 150) {
          products.push(text);
        }
      });

      // Product Categories / Groups
      const categoryElements = document.querySelectorAll('.nganh-nghe-item, .cat-item, .detail-categories a, .business-categories a, .tag-item, .listing-category a');
      const categories = [];
      categoryElements.forEach(el => {
        const text = el.innerText.trim();
        if (text && text.length > 2) categories.push(text);
      });

      // Company info table
      const infoBlocks = {};
      document.querySelectorAll('table tr, .company-info-row, .thong-tin-cong-ty div, .detail-info-item').forEach(row => {
        const text = row.innerText.trim();
        if (text.includes(':')) {
          const [k, ...v] = text.split(':');
          infoBlocks[k.trim()] = v.join(':').trim();
        }
      });

      // Description / About Us
      const descEl = document.querySelector('.company-description, .gioi-thieu, .about-company, #gioithieu, .detail-desc, .detail-content');
      const description = descEl ? descEl.innerText.trim() : '';

      // Phone, Email, Website
      const webEl = document.querySelector('a[href^="http"]:not([href*="trangvangvietnam.com"]):not([href*="yellowpages"]):not([href*="facebook.com"])');
      const website = webEl ? webEl.href : '';

      const emailEl = document.querySelector('a[href^="mailto:"]');
      const email = emailEl ? emailEl.href.replace('mailto:', '').trim() : '';

      // Extract images
      const imgElements = document.querySelectorAll('.detail-gallery img, .product-img img, .slider img, .san-pham img, .album img');
      const images = [];
      imgElements.forEach(img => {
        if (img.src && !img.src.includes('logo') && !img.src.includes('banner') && !img.src.includes('icon')) {
          images.push(img.src);
        }
      });

      return {
        name,
        logo,
        website,
        email,
        description,
        products: Array.from(new Set(products)),
        categories: Array.from(new Set(categories)),
        infoBlocks,
        images: Array.from(new Set(images)),
        sampleText: pageText.slice(0, 1500)
      };
    });

    console.log('Result:', JSON.stringify(detailData, null, 2));
  } catch (err) {
    console.error('Error during crawl:', err);
  } finally {
    await browser.close();
  }
}

testCrawl();
