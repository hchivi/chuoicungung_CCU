import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to download image binary locally to avoid hotlinking
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://trangvangvietnam.com/'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
  });
}

async function testStealthCrawl() {
  console.log('Testing authentic deep extraction on Trần Linh listing...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Stealth overrides
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.chrome = { runtime: {} };
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
      Object.defineProperty(navigator, 'languages', { get: () => ['vi-VN', 'vi', 'en-US', 'en'] });
    });

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    const url = 'https://trangvangvietnam.com/listings/1188012861/xuong-may-dong-phuc-tran-linh-cong-ty-tnhh-may-mac-tran-linh.html';
    console.log(`Navigating to ${url}...`);
    
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });
    console.log(`Page HTTP Status: ${response.status()}`);

    // Extract exact authentic DOM structure
    const extractedData = await page.evaluate(() => {
      const titleEl = document.querySelector('h1') || document.querySelector('.company-name');
      const name = titleEl ? titleEl.innerText.trim() : '';

      // Check if blocked
      if (document.body.innerText.includes('Why have I been blocked') || document.body.innerText.includes('unable to access')) {
        return { isBlocked: true };
      }

      // Logo
      const logoEl = document.querySelector('.company-logo img, .tvx-logo img, img[alt*="logo" i], img[src*="logo" i]');
      const logoUrl = logoEl ? logoEl.src : '';

      // Address & contacts
      const pageText = document.body.innerText;
      
      // Extract all images in the photo gallery
      const galleryImgs = [];
      document.querySelectorAll('img').forEach(img => {
        const src = img.src;
        if (src && !src.includes('banner') && !src.includes('icon') && !src.includes('logo') && !src.includes('google') && !src.includes('facebook') && !src.includes('yellowpages')) {
          if (img.width > 80 || img.naturalWidth > 80 || src.includes('/upload/') || src.includes('/listings/')) {
            galleryImgs.push({
              src,
              alt: img.alt || ''
            });
          }
        }
      });

      // Extract all tabs / sections
      return {
        isBlocked: false,
        name,
        logoUrl,
        title: document.title,
        galleryCount: galleryImgs.length,
        sampleGallery: galleryImgs.slice(0, 10),
        rawTextPreview: pageText.slice(0, 1200)
      };
    });

    console.log('Crawl Result:', JSON.stringify(extractedData, null, 2));

  } catch (err) {
    console.error('Error during test crawl:', err);
  } finally {
    await browser.close();
  }
}

testStealthCrawl();
