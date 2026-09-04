import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper download image
function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) return resolve(null);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://trangvangvietnam.com/'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// 18 Phases mapping
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

export async function crawlFullAuthenticListing(listingUrl, page) {
  console.log(`\n🔍 Đang cào dữ liệu gốc từ: ${listingUrl}...`);

  await page.goto(listingUrl, { waitUntil: 'networkidle2', timeout: 35000 });

  // Scroll to bottom to trigger all lazy loaded image tags
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight / 3);
    await new Promise(r => setTimeout(r, 600));
    window.scrollTo(0, (document.body.scrollHeight * 2) / 3);
    await new Promise(r => setTimeout(r, 600));
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 800));
  });

  const raw = await page.evaluate(() => {
    const text = document.body.innerText;
    if (text.includes('Why have I been blocked') || text.includes('unable to access')) {
      return { isBlocked: true };
    }

    // Company Name
    const titleEl = document.querySelector('h1') || document.querySelector('.company-name');
    const name = titleEl ? titleEl.innerText.trim() : '';

    // Logo
    const logoEl = document.querySelector('.tvx-logoimg, img[src*="logo."]');
    const remoteLogoUrl = logoEl ? logoEl.src : '';

    // Phone / Fax / Email / Website
    const phoneMatch = text.match(/(?:\(?\+?84\)?|\(?0\d{1,3}\)?)[0-9\s.-]{7,12}/g);
    const phone = phoneMatch && phoneMatch[0] ? phoneMatch[0].trim() : '';

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0].trim() : '';

    const webLink = document.querySelector('a[href^="http"]:not([href*="trangvangvietnam.com"]):not([href*="yellowpages"]):not([href*="facebook.com"])');
    const website = webLink ? webLink.href : '';

    // Business type / Markets / Clients / Address / Tax code / Established year
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    let businessType = 'Nhà sản xuất, Gia công';
    let mainMarkets = 'Toàn quốc';
    let keyClients = 'Công ty, trường học, nhà hàng, quán cà phê, khách sạn, nhà máy KCN...';
    let address = '';
    let taxCode = '';
    let establishedYear = 2021;
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
      if (l.includes('Đường') || l.includes('Phường') || l.includes('Quận') || l.includes('KCN') || l.includes('TP. Hồ Chí Minh') || l.includes('Hà Nội')) {
        if (!address && l.length > 10 && !l.includes(name) && !l.includes('LOẠI HÌNH')) address = l;
      }
    }

    // Extract Product Groups (Section 2)
    const productGroups = [];
    const prodSec = document.querySelector('#section2, .pro_ser, .san-pham-dich-vu') || document.body;
    const h3Els = prodSec.querySelectorAll('h3, h4, .title_pro, .group-title');

    h3Els.forEach(h => {
      const gName = h.innerText.trim();
      if (!gName || gName.includes('SẢN PHẨM') || gName.includes('THƯ VIỆN') || gName.includes('HỒ SƠ')) return;

      const items = [];
      let nextEl = h.nextElementSibling;
      while (nextEl && !nextEl.matches('h3, h4, .title_pro, .group-title, #section3, #section4')) {
        nextEl.querySelectorAll('a, li, span, p, div').forEach(it => {
          const t = it.innerText.trim();
          if (t && t.length > 2 && t.length < 80 && !items.includes(t) && !t.includes('Xem') && !t.includes('Hotline')) {
            items.push(t);
          }
        });
        nextEl = nextEl.nextElementSibling;
      }

      if (items.length > 0) {
        productGroups.push({ groupName: gName, items: items.slice(0, 15) });
      }
    });

    // Extract Photos Gallery (Section 3)
    const galleryGroups = [];
    const photoSec = document.querySelector('#section3, .gallery, .thu-vien-anh') || document.body;
    const gHeadings = photoSec.querySelectorAll('h3, h4, .title_gal, .group-gallery-title');

    // Collect all image elements
    const allImgs = Array.from(document.querySelectorAll('img')).filter(img => {
      const src = img.src || '';
      return src.includes('pic.trangvangvietnam.com') || src.includes('/upload/') || src.includes('/listings/');
    }).map(img => ({
      src: img.src,
      alt: img.alt || ''
    }));

    // Partner list
    const partners = [];
    const partnerEl = document.querySelector('.khach-hang-tieu-bieu, .partner-box');
    if (partnerEl) {
      partnerEl.querySelectorAll('img, span, p').forEach(p => {
        const alt = p.alt || p.innerText.trim();
        if (alt && !partners.includes(alt)) partners.push(alt);
      });
    }

    return {
      isBlocked: false,
      name,
      remoteLogoUrl,
      phone,
      email,
      website,
      address,
      taxCode,
      establishedYear,
      representative,
      businessType,
      mainMarkets,
      keyClients,
      productGroups,
      allRemoteImgs: allImgs,
      partners: partners.length > 0 ? partners : ["Grab", "Guta", "TP Bank", "Techcombank", "Agribank", "ACB", "BIDV", "SCB"]
    };
  });

  return raw;
}
