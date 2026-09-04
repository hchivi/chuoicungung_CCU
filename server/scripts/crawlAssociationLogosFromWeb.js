import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_SRC = path.join(__dirname, '../../src/data/associations.json');
const DATA_SRV = path.join(__dirname, '../../server/data/associations.json');
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads/associations');
const SRV_UPLOADS_DIR = path.join(__dirname, '../../server/uploads/associations');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(SRV_UPLOADS_DIR)) {
  fs.mkdirSync(SRV_UPLOADS_DIR, { recursive: true });
}

// Blocked stock domains
const BLOCKED_DOMAINS = [
  'vecteezy.com', 'freepik.com', 'shutterstock.com', 'gettyimages.com',
  'istockphoto.com', 'alamy.com', 'dreamstime.com', 'depositphotos.com',
  '123rf.com', 'pngtree.com', 'rawpixel.com', 'vectorstock.com',
  'canva.com', 'clipartmax.com', 'cleanpng.com', 'pngitem.com', 'pngwing.com'
];

function isBlocked(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return BLOCKED_DOMAINS.some(domain => lower.includes(domain));
}

// Download helper
function downloadFile(rawUrl, destPath) {
  return new Promise((resolve, reject) => {
    if (!rawUrl || !rawUrl.startsWith('http') || isBlocked(rawUrl)) {
      return reject(new Error('Blocked or invalid URL: ' + rawUrl));
    }

    let urlObj;
    try {
      urlObj = new URL(rawUrl);
    } catch(e) {
      return reject(e);
    }

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.get(rawUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.bing.com/'
      },
      timeout: 12000
    }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
        }
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        try {
          const stats = fs.statSync(destPath);
          if (stats.size < 1200 || stats.size === 420991) {
            fs.unlinkSync(destPath);
            return reject(new Error('File too small or dummy (< 1.2 KB)'));
          }
          resolve(destPath);
        } catch(e) {
          reject(e);
        }
      });

      fileStream.on('error', (err) => {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(err);
      });
    });

    req.on('timeout', () => {
      req.destroy();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error('Download timeout'));
    });

    req.on('error', (err) => {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

// Known verified direct logo URLs
const KNOWN_EXACT_LOGOS = {
  "hiep-hoi-bat-dong-san-viet-nam": "https://cdnmedia.baotintuc.vn/Upload/GBzr0rzEkBb6ua36h4mJ9w/files/2022/12/Logo%20VNREA.jpg",
  "hiep-hoi-che-bien-va-xuat-khau-thuy-san-viet-nam": "https://vasep.com.vn/Content/Images/logo.png",
  "hoi-lam-vuon-viet-nam": "https://vacvina.org.vn/Site/images/bannerhnd.png",
  "hiep-hoi-thep-viet-nam": "https://vsa.com.vn/wp-content/uploads/2020/09/logo-vsa-1.png",
  "hiep-hoi-giay-va-bot-giay-viet-nam": "http://vppa.vn/wp-content/uploads/2019/11/logo-VPPA.png",
  "hoi-khoa-hoc-ky-thuat-an-toan-thuc-pham-viet-nam": "https://vinfosa.org.vn/wp-content/uploads/2020/12/logo-vinfosa.png",
  "hoi-dieu-duong-viet-nam": "https://hoidieuduong.org.vn/wp-content/uploads/2021/06/logo-VNA.png",
  "hoi-chu-thap-do-viet-nam": "https://redcross.org.vn/assets/images/logo.png",
  "hiep-hoi-lang-nghe-viet-nam": "https://vicrafts.org.vn/wp-content/uploads/2021/05/logo-vicrafts.png",
  "hoi-dong-y-viet-nam": "https://hoidongyvietnam.vn/wp-content/uploads/2021/08/logo-hoidongy.png",
  "hiep-hoi-bong-soi-viet-nam": "http://vcosa.vn/wp-content/uploads/2018/08/logo-vcosa.png",
  "hiep-hoi-det-may-viet-nam": "https://vitas.org.vn/images/logo.png",
  "hiep-hoi-nang-luong-viet-nam": "https://vea.org.vn/wp-content/uploads/2021/03/logo-vea.png",
  "hoi-bao-ve-thien-nhien-va-moi-truong-viet-nam": "https://vacne.org.vn/images/logo.png",
  "hiep-hoi-tham-dinh-gia-viet-nam": "https://vva.org.vn/wp-content/uploads/2020/05/logo-vva.png",
  "hiep-hoi-doanh-nghiep-dich-vu-logistics-viet-nam": "https://vla.com.vn/wp-content/uploads/2021/03/logo-vla.png",
  "hiep-hoi-phan-bon-viet-nam": "https://hiephoiphanbon.org.vn/wp-content/uploads/2020/10/logo.png",
  "hiep-hoi-cang-bien-viet-nam": "https://vpa.org.vn/wp-content/uploads/2019/08/logo-vpa.png",
  "hiep-hoi-ca-phe-ca-cao-viet-nam": "https://vicofa.org.vn/wp-content/uploads/2021/05/logo-vicofa.png",
  "hiep-hoi-luong-thuc-viet-nam": "https://vietfood.org.vn/wp-content/uploads/2020/09/logo-vfa.png",
  "hiep-hoi-ngan-hang-viet-nam": "https://vnba.com.vn/images/logo.png",
  "hiep-hoi-bao-bi-viet-nam": "https://vinpas.org.vn/wp-content/uploads/2020/12/logo-vinpas.png",
  "hiep-hoi-cao-su-viet-nam": "https://vra.com.vn/wp-content/uploads/2021/04/logo-vra.png",
  "hiep-hoi-nhua-viet-nam": "https://vpas.vn/wp-content/uploads/2021/03/logo-vpas.png",
  "hiep-hoi-quang-cao-viet-nam": "https://vaa.org.vn/wp-content/uploads/2021/04/logo-vaa.png",
  "hiep-hoi-doanh-nghiep-dien-tu-viet-nam": "https://veia.org.vn/wp-content/uploads/2021/04/logo-veia.png",
  "hiep-hoi-bao-hiem-viet-nam": "https://iav.vn/wp-content/uploads/2020/11/logo-iav.png",
  "hiep-hoi-thuong-mai-dien-tu-viet-nam": "https://vecom.vn/images/logo.png",
  "hiep-hoi-cac-nha-dau-tu-tai-chinh-viet-nam": "https://vafi.org.vn/wp-content/uploads/2021/01/logo-vafi.png",
  "hoi-cao-su-nhua-tp-ho-chi-minh": "https://rpahcm.com.vn/wp-content/uploads/2021/05/logo-rpahcm.png",
  "hiep-hoi-in-viet-nam": "https://vpa.vn/wp-content/uploads/2021/04/logo-vpa.png",
  "hiep-hoi-cong-nghiep-ho-tro-viet-nam": "https://vasi.org.vn/wp-content/uploads/2021/05/logo-vasi.png",
  "hiep-hoi-nha-thau-xay-dung-viet-nam": "https://vacc.vn/wp-content/uploads/2021/05/logo-vacc.png",
  "hiep-hoi-du-lich-viet-nam": "https://vita.vn/wp-content/uploads/2021/03/logo-vita.png",
  "hiep-hoi-doanh-nghiep-phan-mem-viet-nam": "https://vinasa.org.vn/wp-content/uploads/2021/04/logo-vinasa.png",
  "hoi-duoc-hoc-viet-nam": "https://vapa.org.vn/wp-content/uploads/2021/04/logo-vapa.png",
  "hiep-hoi-chan-nuoi-gia-cam-viet-nam": "https://vipavietnam.vn/wp-content/uploads/2021/05/logo-vipa.png",
  "hiep-hoi-cong-nghiep-ky-thuat-dien-viet-nam": "https://velina.org.vn/wp-content/uploads/2021/05/logo-velina.png",
  "hoi-nong-dan-viet-nam": "https://hoinongdan.org.vn/images/logo.png",
  "trung-tam-ma-so-ma-vach-quoc-gia": "https://gs1.gov.vn/images/logo.png"
};

async function main() {
  console.log("==================================================================");
  console.log("🏛️ CÀO LOGO THỰC TẾ CHO 71 HIỆP HỘI VIỆT NAM (STOCK-FILTERED)");
  console.log("==================================================================");

  const raw = fs.readFileSync(DATA_SRC, 'utf8');
  const associations = JSON.parse(raw);
  console.log(`📋 Tổng số hiệp hội cần kiểm tra: ${associations.length}\n`);

  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1280,800"
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36");
  await page.setViewport({ width: 1280, height: 800 });

  let successCount = 0;

  for (let i = 0; i < associations.length; i++) {
    const assoc = associations[i];
    const fileName = `${assoc.id}.png`;
    const localDest = path.join(UPLOADS_DIR, fileName);
    const srvDest = path.join(SRV_UPLOADS_DIR, fileName);
    const publicUrl = `/uploads/associations/${fileName}`;

    console.log(`[${i + 1}/${associations.length}] 🏢 ${assoc.name}`);

    // If already downloaded and valid
    if (fs.existsSync(localDest) && fs.statSync(localDest).size > 2000 && assoc.logo === publicUrl) {
      console.log(`  ✓ Đã có logo: ${publicUrl}`);
      try { fs.copyFileSync(localDest, srvDest); } catch(e){}
      successCount++;
      continue;
    }

    let downloaded = false;

    // 1. Try known exact direct URL first
    if (KNOWN_EXACT_LOGOS[assoc.id]) {
      const directUrl = KNOWN_EXACT_LOGOS[assoc.id];
      try {
        console.log(`  🔍 Đang tải link chính thức: ${directUrl}`);
        await downloadFile(directUrl, localDest);
        if (fs.existsSync(localDest) && fs.statSync(localDest).size > 1200) {
          assoc.logo = publicUrl;
          try { fs.copyFileSync(localDest, srvDest); } catch(e){}
          downloaded = true;
          console.log(`  ✅ Tải thành công từ link chính thức!`);
        }
      } catch(e) {
        console.log(`  ⚠️ Lỗi link chính thức (${e.message}), chuyển sang tìm kiếm web...`);
      }
    }

    // 2. Search queries on Bing Images
    if (!downloaded) {
      const queries = [
        `logo "${assoc.name}"`,
        `logo ${assoc.name} site:vn`,
        `biểu trưng "${assoc.name}"`
      ];

      for (const q of queries) {
        if (downloaded) break;

        try {
          const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(q)}`;
          await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 20000 });
          await new Promise(r => setTimeout(r, 1000));

          const candidates = await page.evaluate(() => {
            const list = [];
            document.querySelectorAll("a.iusc").forEach(a => {
              const m = a.getAttribute("m");
              if (m) {
                try {
                  const json = JSON.parse(m);
                  if (json.murl) {
                    list.push({ url: json.murl, thumb: json.turl });
                  }
                } catch(e){}
              }
            });
            return list;
          });

          // Filter out stock sites
          const validCandidates = candidates.filter(c => !isBlocked(c.url));
          console.log(`  🔎 Tìm thấy ${validCandidates.length} ảnh hợp lệ cho: "${q}"`);

          for (const item of validCandidates.slice(0, 10)) {
            try {
              await downloadFile(item.url, localDest);
              if (fs.existsSync(localDest) && fs.statSync(localDest).size > 1200) {
                assoc.logo = publicUrl;
                try { fs.copyFileSync(localDest, srvDest); } catch(e){}
                downloaded = true;
                console.log(`  ✅ Tải logo thành công: ${item.url.substring(0, 70)}... (${(fs.statSync(localDest).size/1024).toFixed(1)} KB)`);
                break;
              }
            } catch(err) {
              if (item.thumb && !isBlocked(item.thumb)) {
                try {
                  await downloadFile(item.thumb, localDest);
                  if (fs.existsSync(localDest) && fs.statSync(localDest).size > 1200) {
                    assoc.logo = publicUrl;
                    try { fs.copyFileSync(localDest, srvDest); } catch(e){}
                    downloaded = true;
                    console.log(`  ✅ Tải logo thumbnail thành công: ${(fs.statSync(localDest).size/1024).toFixed(1)} KB`);
                    break;
                  }
                } catch(e2){}
              }
            }
          }
        } catch (err) {
          console.log(`  ⚠️ Lỗi tìm kiếm: ${err.message}`);
        }
      }
    }

    // 3. Fallback to Trang Vang logo if existed
    if (!downloaded && assoc.logo && assoc.logo.startsWith('http') && !isBlocked(assoc.logo)) {
      try {
        await downloadFile(assoc.logo, localDest);
        if (fs.existsSync(localDest) && fs.statSync(localDest).size > 1200) {
          assoc.logo = publicUrl;
          try { fs.copyFileSync(localDest, srvDest); } catch(e){}
          downloaded = true;
          console.log(`  ✅ Giữ logo từ Trang Vàng cũ`);
        }
      } catch(e){}
    }

    if (downloaded) {
      successCount++;
    } else {
      console.log(`  ❌ Không tải được logo cho ${assoc.name}`);
    }

    // Save progressively every 5 items
    if (i % 5 === 0 || i === associations.length - 1) {
      fs.writeFileSync(DATA_SRC, JSON.stringify(associations, null, 2), 'utf8');
      fs.writeFileSync(DATA_SRV, JSON.stringify(associations, null, 2), 'utf8');
    }
  }

  await browser.close();

  // Final write
  fs.writeFileSync(DATA_SRC, JSON.stringify(associations, null, 2), 'utf8');
  fs.writeFileSync(DATA_SRV, JSON.stringify(associations, null, 2), 'utf8');

  console.log("\n==================================================================");
  console.log(`🎉 HOÀN THÀNH: Đã crawl logo cho ${successCount}/${associations.length} Hiệp hội!`);
  console.log("==================================================================");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
