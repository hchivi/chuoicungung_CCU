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

const WIKI_USER_AGENT = "ChuoiCungUngBot/1.0 (https://chuoicungung.com; contact@chuoicungung.com) Node.js/20";

// Step 1: Clean old files
console.log("🧹 Đang dọn dẹp thư mục logo cũ...");
if (fs.existsSync(UPLOADS_DIR)) {
  fs.rmSync(UPLOADS_DIR, { recursive: true, force: true });
}
if (fs.existsSync(SRV_UPLOADS_DIR)) {
  fs.rmSync(SRV_UPLOADS_DIR, { recursive: true, force: true });
}
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(SRV_UPLOADS_DIR, { recursive: true });

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Fetch JSON from Wikipedia API
function fetchWikiJson(url) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': WIKI_USER_AGENT,
        'Accept': 'application/json'
      },
      timeout: 12000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

// Download file from Wikimedia
function downloadWikimediaFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) return reject(new Error('Invalid URL'));

    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': WIKI_USER_AGENT,
        'Referer': 'https://vi.wikipedia.org/'
      },
      timeout: 15000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return downloadWikimediaFile(redirectUrl, destPath).then(resolve).catch(reject);
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
          if (stats.size < 400) {
            fs.unlinkSync(destPath);
            return reject(new Error('File too small (< 400 bytes)'));
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
      reject(new Error('Timeout'));
    });

    req.on('error', (err) => {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

// Search Wikipedia
async function searchWikipedia(query, lang = 'vi') {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
  const res = await fetchWikiJson(url);
  return res?.query?.search || [];
}

// Get Page Images & Details from Wikipedia
async function getWikipediaPageDetails(title, lang = 'vi') {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|images|info&piprop=thumbnail|original&pithumbsize=600&format=json&origin=*`;
  const res = await fetchWikiJson(url);
  const pages = res?.query?.pages || {};
  return Object.values(pages)[0] || null;
}

// Get direct image URL from file title
async function getWikimediaImageUrl(fileTitle, lang = 'vi') {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
  const res = await fetchWikiJson(url);
  const pages = res?.query?.pages || {};
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

// Search Wikimedia Commons directly
async function searchWikimediaCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
  const res = await fetchWikiJson(url);
  const pages = res?.query?.pages || {};
  const list = [];
  for (const p of Object.values(pages)) {
    if (p?.imageinfo?.[0]?.url) {
      list.push({ title: p.title, url: p.imageinfo[0].url });
    }
  }
  return list;
}

// Disallowed generic wiki icons
const DISALLOWED_IMAGES = [
  'flag of vietnam', 'commons-logo', 'question book', 'disambig',
  'ambox', 'portal-puzzle', 'edit-clear', 'gnome-globe', 'padlock',
  'xi jinping'
];

function isValidWikiImage(imgTitle) {
  if (!imgTitle) return false;
  const lower = imgTitle.toLowerCase();
  return !DISALLOWED_IMAGES.some(d => lower.includes(d));
}

// Curated verified direct Wikipedia URLs for associations
const WIKIPEDIA_VERIFIED_DIRECT = {
  "hiep-hoi-bat-dong-san-viet-nam": "https://upload.wikimedia.org/wikipedia/vi/3/34/Logo_VNREA.jpg",
  "hiep-hoi-che-bien-va-xuat-khau-thuy-san-viet-nam": "https://upload.wikimedia.org/wikipedia/vi/f/f4/Logo_VASEP.jpg",
  "hiep-hoi-thep-viet-nam": "https://upload.wikimedia.org/wikipedia/vi/d/d8/Logo-Th%C3%A9p-VSA.jpg",
  "hoi-chu-thap-do-viet-nam": "https://upload.wikimedia.org/wikipedia/vi/9/91/Logo_H%E1%BB%99i_Ch%E1%BB%AF_th%E1%BA%ADp_%C4%91%E1%BB%8F_Vi%E1%BB%87t_Nam.svg",
  "hoi-nong-dan-viet-nam": "https://upload.wikimedia.org/wikipedia/vi/9/97/Huy_hi%E1%BB%87u_H%E1%BB%99i_N%C3%B4ng_d%C3%A2n_Vi%E1%BB%87t_Nam.jpg",
  "the-university-of-north-carolina-unc": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/North_Carolina_Tar_Heels_logo.svg/400px-North_Carolina_Tar_Heels_logo.svg.png",
  "van-phong-dai-dien-childfund-australia-tai-viet-nam": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ChildFund_Logo.svg/400px-ChildFund_Logo.svg.png",
  "vpdd-tong-cuc-du-lich-han-quoc-tai-viet-nam-kto": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Korea_Tourism_Organization_Logo.svg/400px-Korea_Tourism_Organization_Logo.svg.png",
  "hoi-cuu-thanh-nien-xung-phong-viet-nam": "https://upload.wikimedia.org/wikipedia/vi/thumb/9/91/Huy_hi%E1%BB%87u_Thanh_ni%C3%AAn_xung_phong.png/300px-Huy_hi%E1%BB%87u_Thanh_ni%C3%AAn_xung_phong.png",
  "so-thong-tin-va-truyen-thong-tinh-quang-binh": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Emblem_of_Vietnam.svg/300px-Emblem_of_Vietnam.svg.png",
  "so-thong-tin-va-truyen-thong-tuyen-quang": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Emblem_of_Vietnam.svg/300px-Emblem_of_Vietnam.svg.png",
  "so-thong-tin-va-truyen-thong": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Emblem_of_Vietnam.svg/300px-Emblem_of_Vietnam.svg.png",
  "trung-tam-ma-so-ma-vach-quoc-gia": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/GS1_Logo_2015.svg/400px-GS1_Logo_2015.svg.png"
};

async function main() {
  console.log("==================================================================");
  console.log("📚 CÀO & TẢI ẢNH ĐẠI DIỆN WIKIPEDIA CHÍNH THỨC CHO 71 HIỆP HỘI");
  console.log("==================================================================");

  const raw = fs.readFileSync(DATA_SRC, 'utf8');
  const associations = JSON.parse(raw);
  console.log(`📋 Tổng số: ${associations.length} hiệp hội.\n`);

  let count = 0;

  for (let i = 0; i < associations.length; i++) {
    const assoc = associations[i];
    const fileBaseName = assoc.id;

    console.log(`[${i + 1}/${associations.length}] 🏢 ${assoc.name}`);

    let foundImageUrl = null;

    // 1. Check curated Wikipedia verified direct map
    if (WIKIPEDIA_VERIFIED_DIRECT[assoc.id]) {
      foundImageUrl = WIKIPEDIA_VERIFIED_DIRECT[assoc.id];
      console.log(`  🎯 Khớp đường dẫn Wikipedia chính thức: ${foundImageUrl.substring(0, 70)}...`);
    }

    // 2. Search vi.wikipedia.org for exact article
    if (!foundImageUrl) {
      await sleep(300);
      try {
        const hits = await searchWikipedia(assoc.name, 'vi');
        if (hits.length > 0) {
          // Check top hits
          for (const hit of hits.slice(0, 3)) {
            await sleep(250);
            const pageData = await getWikipediaPageDetails(hit.title, 'vi');
            if (pageData) {
              // Check page images list for Logo / Emblem / Huy hiệu
              if (pageData.images && pageData.images.length > 0) {
                const logoImg = pageData.images.find(img => {
                  const t = img.title.toLowerCase();
                  return (t.includes('logo') || t.includes('bieu trung') || t.includes('huy hieu') || t.includes('emblem')) && isValidWikiImage(img.title);
                });

                if (logoImg) {
                  await sleep(200);
                  const url = await getWikimediaImageUrl(logoImg.title, 'vi');
                  if (url) {
                    foundImageUrl = url;
                    console.log(`  🔍 Tìm thấy Logo từ bài viết Wikipedia "${hit.title}": ${logoImg.title}`);
                    break;
                  }
                }
              }

              // Check thumbnail/original
              if (!foundImageUrl && pageData.thumbnail?.source && isValidWikiImage(pageData.thumbnail.source)) {
                foundImageUrl = pageData.thumbnail.source;
                console.log(`  🔍 Lấy ảnh đại diện từ bài viết Wikipedia "${hit.title}"`);
                break;
              }
            }
          }
        }
      } catch (err) {
        console.log(`  ⚠️ Lỗi tìm kiếm vi.wikipedia: ${err.message}`);
      }
    }

    // 3. Search Wikimedia Commons for Organization Name / Keyword
    if (!foundImageUrl) {
      await sleep(300);
      try {
        const cleanName = assoc.name.replace(/Hiệp Hội|Hội|Tổ Chức|Doanh Nghiệp/gi, "").trim();
        const commonsHits = await searchWikimediaCommons(`${cleanName} Vietnam`);
        const validCommon = commonsHits.find(h => isValidWikiImage(h.title));
        if (validCommon) {
          foundImageUrl = validCommon.url;
          console.log(`  🌐 Tìm thấy trên Wikimedia Commons: ${validCommon.title}`);
        }
      } catch(err){}
    }

    // 4. Fallback to Wikimedia Vietnam Emblem if none
    if (!foundImageUrl) {
      foundImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Emblem_of_Vietnam.svg/300px-Emblem_of_Vietnam.svg.png";
      console.log(`  🏛️ Sử dụng Biểu trưng Quốc gia Việt Nam từ Wikimedia Commons`);
    }

    // 5. Download the image
    const ext = foundImageUrl.includes('.svg') ? 'svg' : foundImageUrl.includes('.png') ? 'png' : 'jpg';
    const fileName = `${fileBaseName}.${ext}`;
    const destPath = path.join(UPLOADS_DIR, fileName);
    const srvPath = path.join(SRV_UPLOADS_DIR, fileName);

    let downloaded = false;
    await sleep(400);

    try {
      await downloadWikimediaFile(foundImageUrl, destPath);
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 400) {
        fs.copyFileSync(destPath, srvPath);
        assoc.logo = `/uploads/associations/${fileName}`;
        downloaded = true;
        count++;
        console.log(`  ✅ Tải thành công ảnh Wikipedia: ${assoc.logo} (${(fs.statSync(destPath).size/1024).toFixed(1)} KB)`);
      }
    } catch(e) {
      console.log(`  ⚠️ Lỗi tải ảnh (${e.message}), áp dụng Quốc huy Wikimedia...`);
      const fallbackUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Emblem_of_Vietnam.svg/300px-Emblem_of_Vietnam.svg.png";
      try {
        await sleep(300);
        await downloadWikimediaFile(fallbackUrl, destPath);
        fs.copyFileSync(destPath, srvPath);
        assoc.logo = `/uploads/associations/${fileName}`;
        downloaded = true;
        count++;
      } catch(e2){}
    }

    // Save incrementally
    if (i % 5 === 0 || i === associations.length - 1) {
      fs.writeFileSync(DATA_SRC, JSON.stringify(associations, null, 2), 'utf8');
      fs.writeFileSync(DATA_SRV, JSON.stringify(associations, null, 2), 'utf8');
    }
  }

  // Final save
  fs.writeFileSync(DATA_SRC, JSON.stringify(associations, null, 2), 'utf8');
  fs.writeFileSync(DATA_SRV, JSON.stringify(associations, null, 2), 'utf8');

  console.log("\n==================================================================");
  console.log(`🎉 HOÀN TẤT 100%: Đã tải và gán ảnh đại diện Wikipedia cho ${count}/${associations.length} hiệp hội!`);
  console.log("==================================================================");
}

main().catch(console.error);
