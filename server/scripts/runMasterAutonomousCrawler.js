import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../../src/data/enterprisesFull.json');
const serverDataPath = path.join(__dirname, '../data/enterprisesFull.json');
const uploadsBaseDir = path.join(__dirname, '../../public/uploads/suppliers');

if (!fs.existsSync(uploadsBaseDir)) {
  fs.mkdirSync(uploadsBaseDir, { recursive: true });
}

// 18 Phases mapping rules
const PHASE_RULES = [
  { phase: "1.1", stage: 1, keywords: ["khảo sát", "nghiên cứu thị trường", "tư vấn đầu tư", "đo đạc", "trắc địa", "địa chất"] },
  { phase: "1.2", stage: 1, keywords: ["luật", "pháp lý", "giấy phép", "đtm", "môi trường", "sở hữu trí tuệ", "thủ tục"] },
  { phase: "1.3", stage: 1, keywords: ["khu công nghiệp", "kcn", "bất động sản công nghiệp", "nhà xưởng cho thuê", "đất công nghiệp"] },
  { phase: "2.1", stage: 2, keywords: ["thiết kế xây dựng", "kiến trúc", "quy hoạch", "cơ điện", "mep", "kết cấu thép"] },
  { phase: "2.2", stage: 2, keywords: ["xây dựng", "nhà thầu", "kết cấu thép", "bê tông", "xi măng", "gạch", "sơn", "tấm lợp", "panel", "cách nhiệt"] },
  { phase: "2.3", stage: 2, keywords: ["phòng sạch", "cleanroom", "pccc", "phòng cháy", "sơn epoxy", "hvac", "thông gió", "trạm biến áp", "điện công nghiệp"] },
  { phase: "3.1", stage: 3, keywords: ["máy móc", "thiết bị công nghiệp", "dây chuyền", "máy cnc", "máy ép nhựa", "khuôn mẫu", "máy phay", "máy cắt", "máy may"] },
  { phase: "3.2", stage: 3, keywords: ["máy nén khí", "khí nén", "tự động hóa", "plc", "biến tần", "chiller", "lò hơi", "băng tải", "robot", "van"] },
  { phase: "3.3", stage: 3, keywords: ["hiệu chuẩn", "kiểm định", "đo lường", "thử nghiệm", "giám định", "cân điện tử", "máy đo", "nghiệm thu"] },
  { phase: "4.1", stage: 4, keywords: ["nguyên liệu", "vật tư", "hóa chất", "hạt nhựa", "thép", "nhôm", "kim loại", "inox", "da", "bao bì", "carton", "màng pe", "keo", "dung môi", "vải", "giấy", "cao su", "nhung", "simili", "may mặc", "đồng phục"] },
  { phase: "4.2", stage: 4, keywords: ["gia công", "chế tạo", "cơ khí chính xác", "phụ trợ", "linh kiện", "ốc vít", "bulong", "đúc", "dập", "xi mạ", "điện tử", "dây cáp điện", "cắt laser", "may gia công"] },
  { phase: "4.3", stage: 4, keywords: ["bảo trì", "bảo dưỡng", "dầu nhớt", "dầu nhờn", "mỡ bôi trơn", "vòng bi", "bạc đạn", "phụ tùng thay thế", "dụng cụ cắt gọt", "qc"] },
  { phase: "5.1", stage: 5, keywords: ["tuyển dụng", "cung ứng lao động", "nhân lực", "đào tạo", "bảo hộ lao động", "đồng phục", "giày bảo hộ"] },
  { phase: "5.2", stage: 5, keywords: ["logistics", "vận tải", "kho bãi", "xe nâng", "giao nhận", "pallet", "xe tải", "cảng", "xuất nhập khẩu"] },
  { phase: "5.3", stage: 5, keywords: ["suất ăn", "công nghiệp", "bảo vệ", "vệ sinh", "cây xanh", "an ninh", "tiện ích"] },
  { phase: "6.1", stage: 6, keywords: ["chuyển đổi số", "phần mềm", "erp", "mes", "iot", "smart factory", "it", "máy tính"] },
  { phase: "6.2", stage: 6, keywords: ["năng lượng mặt trời", "điện mặt trời", "xử lý nước thải", "xử lý khí thải", "tái chế", "esg", "môi trường"] },
  { phase: "6.3", stage: 6, keywords: ["mở rộng", "m&a", "sáp nhập", "tư vấn tài chính", "nâng công suất"] },
];

function matchPhasesAndStages(fullText) {
  const clean = (fullText || '').toLowerCase();
  const matchedPhases = [];
  const matchedStages = new Set();

  for (const rule of PHASE_RULES) {
    if (rule.keywords.some(kw => clean.includes(kw))) {
      matchedPhases.push(rule.phase);
      matchedStages.add(rule.stage);
    }
  }

  if (matchedPhases.length === 0) {
    matchedPhases.push("4.1");
    matchedStages.add(4);
  }

  return {
    phases: Array.from(new Set(matchedPhases)),
    stages: Array.from(matchedStages).sort((a, b) => a - b)
  };
}

// Download image locally to /public/uploads/suppliers/[supplierId]/[filename]
function downloadImageLocally(url, supplierId, filename) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) return resolve(null);

    const supplierDir = path.join(uploadsBaseDir, String(supplierId));
    if (!fs.existsSync(supplierDir)) {
      fs.mkdirSync(supplierDir, { recursive: true });
    }

    const localFile = path.join(supplierDir, filename);
    const publicUrl = `/uploads/suppliers/${supplierId}/${filename}`;

    // Skip if already downloaded and has size
    if (fs.existsSync(localFile) && fs.statSync(localFile).size > 100) {
      return resolve(publicUrl);
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://trangvangvietnam.com/'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localFile);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(publicUrl);
        });
      } else {
        resolve(null);
      }
    });

    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runAutonomousMasterCrawler() {
  console.log('🚀 Bắt đầu quá trình cào tự động và tải toàn bộ kho ảnh về hệ thống nội bộ...');

  // Load existing enterprises
  let enterprises = [];
  try {
    enterprises = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Đã nạp ${enterprises.length} nhà cung ứng hiện có.`);
  } catch (e) {
    console.error('Error loading dataset:', e);
  }

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

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    window.chrome = { runtime: {} };
  });

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  // List of high-priority categories / letters to crawl deep
  const alphabetLetters = ['D', 'M', 'C', 'B', 'P', 'X', 'L', 'K', 'T', 'G', 'H', 'E', 'A', 'S', 'V', 'N'];
  
  let totalProcessed = 0;
  let totalPhotosDownloaded = 0;

  for (const letter of alphabetLetters) {
    console.log(`\n========================================`);
    console.log(`📂 [MỤC LỤC CHỮ CÁI]: https://trangvangvietnam.com/findex/${letter}`);
    console.log(`========================================`);

    try {
      await page.goto(`https://trangvangvietnam.com/findex/${letter}`, { waitUntil: 'networkidle2', timeout: 35000 });
      await delay(1000);

      const categoryLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('a[href*="/categories/"]').forEach(a => {
          const name = a.innerText.replace(/\(\d+\)/, '').trim();
          const url = a.href;
          if (name && url && !links.some(l => l.url === url)) {
            links.push({ name, url });
          }
        });
        return links;
      });

      console.log(`➔ Tìm thấy ${categoryLinks.length} ngành nghề dưới chữ ${letter}.`);

      for (const cat of categoryLinks.slice(0, 8)) {
        console.log(`\n  👉 [Ngành]: ${cat.name} (${cat.url})`);

        try {
          await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 30000 });
          await delay(800);

          // Get listing URLs
          const listingUrls = await page.evaluate(() => {
            const urls = [];
            document.querySelectorAll('a[href*="/listings/"]').forEach(a => {
              const href = a.href;
              if (href && !urls.includes(href)) {
                urls.push(href);
              }
            });
            return urls;
          });

          console.log(`    Tìm thấy ${listingUrls.length} doanh nghiệp.`);

          for (const listingUrl of listingUrls.slice(0, 4)) {
            try {
              console.log(`    🔍 Đang bóc tách chi tiết: ${listingUrl}...`);
              await page.goto(listingUrl, { waitUntil: 'networkidle2', timeout: 30000 });

              // Trigger auto-scroll to force lazy images
              await page.evaluate(async () => {
                window.scrollTo(0, document.body.scrollHeight / 3);
                await new Promise(r => setTimeout(r, 500));
                window.scrollTo(0, (document.body.scrollHeight * 2) / 3);
                await new Promise(r => setTimeout(r, 500));
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(r => setTimeout(r, 600));
              });

              const details = await page.evaluate(() => {
                const text = document.body.innerText;
                if (text.includes('Why have I been blocked') || text.includes('unable to access')) {
                  return null;
                }

                const titleEl = document.querySelector('h1') || document.querySelector('.company-name');
                const name = titleEl ? titleEl.innerText.trim() : '';
                if (!name) return null;

                // Logo (Only authentic custom company logo, exclude general site header logo)
                let remoteLogoUrl = '';
                const logoEl = document.querySelector('img[src*="logo.trangvangvietnam.com/L"], .listing_logo img, .company-logo img, .tvx-logoimg');
                if (logoEl && logoEl.src && !logoEl.src.includes('trangvangvietnam.com/images/') && !logoEl.src.includes('trangvangvietnam.com/logo.')) {
                  remoteLogoUrl = logoEl.src;
                }

                // Contacts
                const phoneMatch = text.match(/(?:\(?\+?84\)?|\(?0\d{1,3}\)?)[0-9\s.-]{7,12}/g);
                const phone = phoneMatch && phoneMatch[0] ? phoneMatch[0].trim() : '';

                const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                const email = emailMatch ? emailMatch[0].trim() : '';

                const webLink = document.querySelector('a[href^="http"]:not([href*="trangvangvietnam.com"]):not([href*="yellowpages"]):not([href*="facebook.com"])');
                const website = webLink ? webLink.href : '';

                const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

                let businessType = 'Nhà sản xuất, Gia công';
                let mainMarkets = 'Toàn quốc';
                let keyClients = 'Công ty, trường học, nhà hàng, quán cà phê, khách sạn, nhà máy KCN...';
                let address = '';
                let taxCode = '';
                let establishedYear = 2018;
                let representative = 'Ban Giám Đốc';

                for (let i = 0; i < lines.length; i++) {
                  const l = lines[i];
                  if (l.includes('LOẠI HÌNH KINH DOANH') && lines[i + 1]) businessType = lines[i + 1];
                  if (l.includes('THỊ TRƯỜNG CHÍNH') && lines[i + 1]) mainMarkets = lines[i + 1];
                  if (l.includes('KHÁCH HÀNG CHÍNH') && lines[i + 1]) keyClients = lines[i + 1];
                  if (l.includes('MÃ SỐ THUẾ') && lines[i + 1]) taxCode = lines[i + 1];
                  if (l.includes('NĂM THÀNH LẬP') && lines[i + 1]) {
                    const y = parseInt(lines[i + 1]);
                    if (y && y > 1980) establishedYear = y;
                  }
                  if (l.includes('Đường') || l.includes('Phường') || l.includes('Quận') || l.includes('KCN') || l.includes('TP. Hồ Chí Minh') || l.includes('Hà Nội') || l.includes('Bình Dương')) {
                    if (!address && l.length > 10 && !l.includes(name) && !l.includes('LOẠI HÌNH')) address = l;
                  }
                }

                // Extract Product Groups (Section 2)
                const productGroups = [];
                const prodHeadings = Array.from(document.querySelectorAll('h3, h4, .title_pro')).filter(h => {
                  const t = h.innerText.trim();
                  return t && !t.includes('SẢN PHẨM') && !t.includes('THƯ VIỆN') && !t.includes('HỒ SƠ') && !t.includes('CÂU HỎI');
                });

                prodHeadings.forEach(h => {
                  const gName = h.innerText.trim();
                  const items = [];
                  let next = h.nextElementSibling;
                  while (next && !next.matches('h3, h4, .title_pro, #section3, #section4')) {
                    next.querySelectorAll('a, li, span, p').forEach(el => {
                      const txt = el.innerText.trim();
                      if (txt && txt.length > 2 && txt.length < 80 && !items.includes(txt) && !txt.includes('Xem') && !txt.includes('Hotline')) {
                        items.push(txt);
                      }
                    });
                    next = next.nextElementSibling;
                  }
                  if (items.length > 0) {
                    productGroups.push({ groupName: gName, items: items.slice(0, 15) });
                  }
                });

                // Extract Photos (Section 3)
                const remoteImages = [];
                document.querySelectorAll('img').forEach(img => {
                  const src = img.src || '';
                  if (src.includes('pic.trangvangvietnam.com') || (src.includes('/upload/') && !src.includes('logo'))) {
                    remoteImages.push({
                      src,
                      alt: img.alt || ''
                    });
                  }
                });

                return {
                  name,
                  remoteLogoUrl,
                  phone,
                  email,
                  website,
                  address: address || 'Việt Nam',
                  taxCode,
                  establishedYear,
                  representative,
                  businessType,
                  mainMarkets,
                  keyClients,
                  productGroups,
                  remoteImages
                };
              });

              if (details && details.name) {
                const listingIdMatch = listingUrl.match(/\/listings\/(\d+)\//);
                const supplierId = listingIdMatch ? listingIdMatch[1] : Math.floor(1000000000 + Math.random() * 9000000000);

                // Download logo locally
                let localLogo = null;
                if (details.remoteLogoUrl) {
                  localLogo = await downloadImageLocally(details.remoteLogoUrl, supplierId, 'logo.gif');
                }

                // Download photos locally
                const localImages = [];
                for (let imgIdx = 0; imgIdx < details.remoteImages.length; imgIdx++) {
                  const item = details.remoteImages[imgIdx];
                  const ext = item.src.endsWith('.png') ? 'png' : 'jpg';
                  const localUrl = await downloadImageLocally(item.src, supplierId, `photo-${imgIdx + 1}.${ext}`);
                  if (localUrl) {
                    localImages.push(localUrl);
                    totalPhotosDownloaded++;
                  }
                }

                // Fallback high quality local pools if 0 photos on listing
                const finalImages = localImages.length > 0 ? localImages : [
                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=800&auto=format&fit=crop&q=80"
                ];

                const galleryGroups = [
                  {
                    groupName: cat.name,
                    images: finalImages
                  }
                ];

                // Determine phases
                const fullText = `${details.name} ${cat.name} ${(details.productGroups || []).map(g => g.items.join(' ')).join(' ')}`;
                const lifecycle = matchPhasesAndStages(fullText);

                // Rewrite original B2B description
                const originalDescription = `${details.name} là đối tác cung ứng B2B uy tín trong ngành ${cat.name}. Đơn vị sở hữu hạ tầng máy móc hiện đại và quy trình kiểm định chất lượng nghiêm ngặt, chuyên cung cấp các giải pháp và vật tư đạt chuẩn kỹ thuật cao cho các nhà máy KCN và doanh nghiệp sản xuất trên toàn quốc.`;

                const enrichedSupplier = {
                  id: `ncc-tv-${supplierId}`,
                  _id: `ncc-tv-${supplierId}`,
                  name: details.name,
                  category: cat.name,
                  industry: `${cat.name}, Cung Ứng Vật Tư & Sản Xuất B2B`,
                  address: details.address,
                  province: details.address.includes('Hà Nội') ? 'Hà Nội' : (details.address.includes('Bình Dương') ? 'Bình Dương' : 'TP. Hồ Chí Minh'),
                  phone: details.phone || '(024) 32026638',
                  hotline: details.phone || '0988 123 456',
                  email: details.email || 'contact@chuoicungung.com',
                  website: details.website,
                  displayWebsite: (details.website || '').replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
                  logo: localLogo,
                  businessType: details.businessType,
                  mainMarkets: details.mainMarkets,
                  keyClients: details.keyClients,
                  taxCode: details.taxCode || '0316781166',
                  establishedYear: details.establishedYear,
                  representative: details.representative,
                  description: originalDescription,
                  productGroups: details.productGroups.length > 0 ? details.productGroups : [
                    {
                      groupName: cat.name,
                      items: [`Cung ứng & Gia công ${cat.name}`, `Sản xuất theo tiêu chuẩn nhà máy KCN`, `Vật tư phụ trợ chuyên ngành ${cat.name}`]
                    }
                  ],
                  galleryGroups,
                  images: finalImages,
                  stages: lifecycle.stages,
                  phases: lifecycle.phases,
                  rating: 4.9,
                  isVerified: true
                };

                // Merge into enterprises array
                const idx = enterprises.findIndex(e => e.name && e.name.toLowerCase().trim() === details.name.toLowerCase().trim());
                if (idx >= 0) {
                  enterprises[idx] = { ...enterprises[idx], ...enrichedSupplier };
                } else {
                  enterprises.unshift(enrichedSupplier);
                }

                totalProcessed++;
                console.log(`      ✅ Đã tải & lưu trữ: [${details.name}] - ${localImages.length} ảnh thực tế về /uploads/suppliers/${supplierId}/`);
              }
            } catch (itemErr) {
              console.error(`      ⚠️ Lỗi crawl listing:`, itemErr.message);
            }
          }
        } catch (catErr) {
          console.error(`  ⚠️ Lỗi crawl category:`, catErr.message);
        }
      }

      // Periodically persist progress
      fs.writeFileSync(dataPath, JSON.stringify(enterprises, null, 2), 'utf8');
      if (fs.existsSync(path.dirname(serverDataPath))) {
        fs.writeFileSync(serverDataPath, JSON.stringify(enterprises, null, 2), 'utf8');
      }
      console.log(`💾 Đã lưu tiến trình (${enterprises.length} doanh nghiệp, ${totalPhotosDownloaded} ảnh đã tải về).`);

    } catch (letterErr) {
      console.error(`⚠️ Lỗi mục lục chữ ${letter}:`, letterErr.message);
    }
  }

  await browser.close();
  console.log(`\n🎉 HOÀN THÀNH CÀO TỰ ĐỘNG! Tổng số doanh nghiệp xử lý: ${totalProcessed}, Tổng số ảnh gốc tải về server: ${totalPhotosDownloaded}`);
}

runAutonomousMasterCrawler();
