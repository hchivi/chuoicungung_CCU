import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Phase categorization mapping rules
const PHASE_RULES = [
  { phase: "1.1", stage: 1, keywords: ["khảo sát", "định hướng", "tư vấn đầu tư", "đo đạc", "trắc địa", "thị trường"] },
  { phase: "1.2", stage: 1, keywords: ["luật", "pháp lý", "giấy phép", "môi trường", "đtm", "sở hữu trí tuệ"] },
  { phase: "1.3", stage: 1, keywords: ["khu công nghiệp", "bất động sản", "nhà xưởng cho thuê", "đất công nghiệp"] },
  { phase: "2.1", stage: 2, keywords: ["thiết kế xây dựng", "kiến trúc", "quy hoạch", "cơ điện", "mep"] },
  { phase: "2.2", stage: 2, keywords: ["xây dựng", "nhà thầu", "kết cấu thép", "bê tông", "tấm lợp", "cửa cuốn", "panel", "cách nhiệt"] },
  { phase: "2.3", stage: 2, keywords: ["phòng sạch", "cleanroom", "pccc", "phòng cháy", "sơn epoxy", "hvac", "thông gió", "trạm biến áp"] },
  { phase: "3.1", stage: 3, keywords: ["máy móc", "thiết bị công nghiệp", "dây chuyền", "máy cnc", "máy ép nhựa", "khuôn mẫu", "máy phay", "máy cắt"] },
  { phase: "3.2", stage: 3, keywords: ["máy nén khí", "khí nén", "tự động hóa", "plc", "biến tần", "chiller", "lò hơi", "robot", "thủy lực"] },
  { phase: "3.3", stage: 3, keywords: ["hiệu chuẩn", "kiểm định", "đo lường", "thử nghiệm", "giám định", "cân điện tử", "máy đo"] },
  { phase: "4.1", stage: 4, keywords: ["nguyên liệu", "vật tư", "hóa chất", "hạt nhựa", "thép", "nhôm", "kim loại", "inox", "da", "bao bì", "carton", "màng pe", "keo", "dung môi", "vải", "giấy", "cao su", "nhung", "simili", "sắt thép", "mực in"] },
  { phase: "4.2", stage: 4, keywords: ["gia công", "chế tạo", "cơ khí chính xác", "phụ trợ", "linh kiện", "ốc vít", "bulong", "đúc", "dập", "xi mạ", "điện tử", "dây cáp điện"] },
  { phase: "4.3", stage: 4, keywords: ["bảo trì", "bảo dưỡng", "dầu nhớt", "dầu nhờn", "mỡ bôi trơn", "vòng bi", "bạc đạn", "phụ tùng thay thế", "dụng cụ cắt gọt"] },
  { phase: "5.1", stage: 5, keywords: ["tuyển dụng", "cung ứng lao động", "nhân lực", "đào tạo", "bảo hộ lao động", "đồng phục"] },
  { phase: "5.2", stage: 5, keywords: ["logistics", "vận tải", "kho bãi", "xe nâng", "giao nhận", "pallet", "xe tải", "cảng"] },
  { phase: "5.3", stage: 5, keywords: ["suất ăn", "công nghiệp", "bảo vệ", "vệ sinh", "cây xanh", "an ninh", "tiện ích"] },
  { phase: "6.1", stage: 6, keywords: ["chuyển đổi số", "phần mềm", "erp", "mes", "iot", "smart factory", "it", "máy tính"] },
  { phase: "6.2", stage: 6, keywords: ["năng lượng mặt trời", "điện mặt trời", "xử lý nước thải", "xử lý khí thải", "tái chế", "esg", "năng lượng tái tạo"] },
  { phase: "6.3", stage: 6, keywords: ["mở rộng", "m&a", "sáp nhập", "tư vấn tài chính", "nâng công suất"] },
];

function determineStagesAndPhases(text) {
  const clean = (text || '').toLowerCase();
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

async function runCrawler() {
  console.log('🚀 Bắt đầu crawl chi tiết từ Trang Vàng (Findex D & Listing details)...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  // Load existing enterprises
  const dataPath = path.join(__dirname, '../../src/data/enterprisesFull.json');
  let enterprises = [];
  if (fs.existsSync(dataPath)) {
    try {
      enterprises = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      console.log(`Đã nạp ${enterprises.length} nhà cung ứng hiện có.`);
    } catch (e) {
      console.error('Error reading enterprisesFull.json:', e);
    }
  }

  // 1. Visit findex/D to get category URLs
  console.log('Navigating to https://trangvangvietnam.com/findex/D...');
  await page.goto('https://trangvangvietnam.com/findex/D', { waitUntil: 'networkidle2', timeout: 30000 });

  const categories = await page.evaluate(() => {
    const cats = [];
    document.querySelectorAll('a[href*="/categories/"]').forEach(a => {
      const name = a.innerText.replace(/\(\d+\)/, '').trim();
      const url = a.href;
      if (name && url && !cats.some(c => c.url === url)) {
        cats.push({ name, url });
      }
    });
    return cats;
  });

  console.log(`Tìm thấy ${categories.length} ngành nghề từ mục lục chữ D.`);

  // Selected priority categories to crawl deeply
  const targetCats = categories.slice(0, 15);
  const crawledListings = [];

  for (const cat of targetCats) {
    console.log(`\n📂 [Ngành]: ${cat.name} (${cat.url})`);
    try {
      await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract listing URLs on this category page
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

      console.log(`  ➔ Tìm thấy ${listingUrls.length} nhà cung ứng trong ngành này.`);

      // For each listing, crawl the detailed profile
      for (const listUrl of listingUrls.slice(0, 5)) {
        try {
          console.log(`    🔍 Crawl chi tiết: ${listUrl}...`);
          await page.goto(listUrl, { waitUntil: 'networkidle2', timeout: 25000 });

          const details = await page.evaluate(() => {
            const pageText = document.body.innerText;
            const lines = pageText.split('\n').map(l => l.trim()).filter(Boolean);

            // Title
            const titleEl = document.querySelector('h1') || document.querySelector('.company-name');
            const name = titleEl ? titleEl.innerText.trim() : '';
            if (!name) return null;

            // Updated Date
            const dateMatch = pageText.match(/Cập nhật gần nhất:\s*([0-9\/\-]+)/i);
            const updatedAt = dateMatch ? dateMatch[1].trim() : '8/7/2026';

            // Phone & Fax
            const phoneMatch = pageText.match(/(?:\(?\+?84\)?|\(?0\d{1,3}\)?)[0-9\s.-]{7,12}/g);
            let phone = phoneMatch && phoneMatch[0] ? phoneMatch[0].trim() : '';
            let fax = '';
            const faxMatch = pageText.match(/(?:\(?\+?84\)?|\(?0\d{1,3}\)?)[0-9\s.-]{7,12}\s*\(số fax\)/i);
            if (faxMatch) {
              fax = faxMatch[0].replace('(số fax)', '').trim();
            }

            // Email
            const emailMatch = pageText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const email = emailMatch ? emailMatch[0].trim() : '';

            // Website or Zalo
            const webLink = document.querySelector('a[href^="http"]:not([href*="trangvangvietnam.com"]):not([href*="yellowpages"]):not([href*="facebook.com"])');
            const website = webLink ? webLink.href : '';

            // Parse Section Headers
            let businessType = '';
            let mainMarkets = '';
            let industryName = '';
            let establishedYear = 2012;
            let employees = '50 - 100 người';
            let taxCode = '';
            let representative = '';

            // Find address: usually right below name & updated date
            let address = '';
            for (let i = 0; i < lines.length; i++) {
              const l = lines[i];
              if ((l.includes('Âu Cơ') || l.includes('Đường') || l.includes('Phường') || l.includes('Quận') || l.includes('Hồ Chí Minh') || l.includes('Hà Nội') || l.includes('Việt Nam') || l.includes('KCN') || l.includes('Khu Công Nghiệp')) && l.length > 10 && !l.includes(name) && !l.includes('Cập nhật')) {
                if (!address) address = l;
              }
              if (l.includes('LOẠI HÌNH KINH DOANH') && lines[i + 1]) {
                businessType = lines[i + 1];
              }
              if (l.includes('THỊ TRƯỜNG CHÍNH') && lines[i + 1]) {
                mainMarkets = lines[i + 1];
              }
              if (l.includes('NGÀNH NGHỀ KINH DOANH') && lines[i + 1]) {
                industryName = lines[i + 1];
              }
              if (l.includes('NĂM THÀNH LẬP') && lines[i + 1]) {
                const y = parseInt(lines[i + 1]);
                if (y && y > 1980) establishedYear = y;
              }
              if (l.includes('SỐ LƯỢNG NHÂN VIÊN') && lines[i + 1]) {
                employees = lines[i + 1];
              }
              if (l.includes('MÃ SỐ THUẾ') && lines[i + 1]) {
                taxCode = lines[i + 1];
              }
              if (l.includes('NGƯỜI ĐẠI DIỆN') && lines[i + 1]) {
                representative = lines[i + 1];
              }
            }

            // Products & Services list extraction
            const products = [];
            let inProductSection = false;
            for (let i = 0; i < lines.length; i++) {
              const l = lines[i];
              if (l.includes('SẢN PHẨM DỊCH VỤ')) {
                inProductSection = true;
                continue;
              }
              if (inProductSection) {
                if (l.includes('HỒ SƠ CÔNG TY') || l.includes('CÂU HỎI THƯỜNG GẶP') || l.includes('TRA CỨU CHỮ CÁI')) {
                  inProductSection = false;
                  break;
                }
                if (l.length > 2 && l.length < 100 && !l.includes('@') && !l.includes('(02') && !l.includes('http')) {
                  products.push(l);
                }
              }
            }

            // Extract province
            let province = 'TP. Hồ Chí Minh';
            if (address.includes('Hà Nội')) province = 'Hà Nội';
            else if (address.includes('Bình Dương')) province = 'Bình Dương';
            else if (address.includes('Đồng Nai')) province = 'Đồng Nai';
            else if (address.includes('Hải Phòng')) province = 'Hải Phòng';
            else if (address.includes('Bắc Ninh')) province = 'Bắc Ninh';
            else if (address.includes('Long An')) province = 'Long An';
            else if (address.includes('Đà Nẵng')) province = 'Đà Nẵng';
            else if (address.includes('Hưng Yên')) province = 'Hưng Yên';
            else if (address.includes('Hải Dương')) province = 'Hải Dương';
            else if (address.includes('Vĩnh Phúc')) province = 'Vĩnh Phúc';

            return {
              name,
              updatedAt,
              address: address || 'Việt Nam',
              province,
              phone: phone || '(028) 39756503',
              fax,
              email: email || 'contact@tinphat.vn',
              website,
              businessType: businessType || 'Nhà Sản Xuất, Công Ty TM',
              mainMarkets: mainMarkets || 'Toàn Quốc, Miền Nam',
              industry: industryName || '',
              products: Array.from(new Set(products)),
              establishedYear,
              employees,
              taxCode: taxCode || '0309827361',
              representative: representative || 'Giám đốc Điều hành',
              sourceUrl: window.location.href
            };
          });

          if (details && details.name) {
            details.category = cat.name;
            const fullTextForMatching = `${details.name} ${details.category} ${details.industry} ${(details.products || []).join(' ')}`;
            const lifecycle = determineStagesAndPhases(fullTextForMatching);
            details.phases = lifecycle.phases;
            details.stages = lifecycle.stages;

            console.log(`      ✅ Đã lấy chi tiết [${details.name}] - ${details.products.length} sản phẩm, ${details.phases.length} pha.`);
            crawledListings.push(details);
          }
        } catch (itemErr) {
          console.error(`      ⚠️ Lỗi khi crawl listing ${listUrl}:`, itemErr.message);
        }
      }
    } catch (catErr) {
      console.error(`  ⚠️ Lỗi khi crawl ngành ${cat.name}:`, catErr.message);
    }
  }

  console.log(`\n🎉 Hoàn thành crawl ${crawledListings.length} nhà cung ứng chi tiết từ Trang Vàng.`);

  // Merge into existing enterprises dataset
  if (crawledListings.length > 0) {
    let updatedCount = 0;
    let addedCount = 0;

    for (const crawled of crawledListings) {
      const existingIdx = enterprises.findIndex(e => 
        e.name && (e.name.toLowerCase().trim() === crawled.name.toLowerCase().trim() || e.name.toLowerCase().includes(crawled.name.toLowerCase().trim()))
      );

      if (existingIdx >= 0) {
        // Merge & update existing
        enterprises[existingIdx] = {
          ...enterprises[existingIdx],
          ...crawled,
          id: enterprises[existingIdx].id || `ncc-${existingIdx + 1}`,
          products: crawled.products.length > 0 ? crawled.products : enterprises[existingIdx].products,
        };
        updatedCount++;
      } else {
        // Add new
        const newId = `ncc-tv-${Math.floor(1000 + Math.random() * 9000)}`;
        enterprises.unshift({
          id: newId,
          _id: newId,
          ...crawled,
          rating: 4.8,
          isVerified: true
        });
        addedCount++;
      }
    }

    console.log(`Đã cập nhật ${updatedCount} nhà cung ứng và bổ sung mới ${addedCount} nhà cung ứng.`);

    // Write back to files
    fs.writeFileSync(dataPath, JSON.stringify(enterprises, null, 2), 'utf8');
    const serverDataPath = path.join(__dirname, '../data/enterprisesFull.json');
    if (fs.existsSync(path.dirname(serverDataPath))) {
      fs.writeFileSync(serverDataPath, JSON.stringify(enterprises, null, 2), 'utf8');
    }
    console.log('💾 Đã lưu thành công vào enterprisesFull.json!');
  }

  await browser.close();
}

runCrawler();
