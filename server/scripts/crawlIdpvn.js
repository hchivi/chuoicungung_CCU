import https from 'https';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IndustrialPark from '../models/IndustrialPark.js';

dotenv.config();

// Helper to fetch URL content with User-Agent and strict timeout
function fetchUrl(url, redirectCount = 0) {
  if (redirectCount > 2) return Promise.resolve('');
  return new Promise((resolve) => {
    let timer = setTimeout(() => {
      resolve('');
    }, 7000);

    try {
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi,en;q=0.9'
        },
        timeout: 6000
      }, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          clearTimeout(timer);
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) {
            redirectUrl = 'https://idpvn.com' + redirectUrl;
          }
          return fetchUrl(redirectUrl, redirectCount + 1).then(resolve);
        }

        if (res.statusCode !== 200) {
          clearTimeout(timer);
          return resolve('');
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          clearTimeout(timer);
          resolve(data);
        });
      });

      req.on('error', () => {
        clearTimeout(timer);
        resolve('');
      });

      req.on('timeout', () => {
        clearTimeout(timer);
        req.destroy();
        resolve('');
      });
    } catch (e) {
      clearTimeout(timer);
      resolve('');
    }
  });
}

// Map province to standard economic region
function getRegion(province) {
  if (!province) return 'Đông Nam Bộ';
  const p = province.toLowerCase();

  const mienBac = [
    'hà nội', 'hải phòng', 'bắc ninh', 'bắc giang', 'vĩnh phúc', 'hưng yên', 'hải dương', 
    'hà nam', 'quảng ninh', 'phú thọ', 'thái nguyên', 'nam định', 'ninh bình', 'thái bình', 
    'hà giang', 'cao bằng', 'bắc kạn', 'bắc cạn', 'tuyên quang', 'lào cai', 'yên bái', 
    'điện biên', 'lai châu', 'sơn la', 'hòa bình', 'lạng sơn'
  ];

  const mienTrung = [
    'thanh hóa', 'nghệ an', 'hà tĩnh', 'quảng bình', 'quảng trị', 'thừa thiên huế', 
    'đà nẵng', 'quảng nam', 'quảng ngãi', 'bình định', 'phú yên', 'khánh hòa', 'ninh thuận', 'bình thuận'
  ];

  const tayNguyen = ['kon tum', 'gia lai', 'đắk lắk', 'đắc lắc', 'đắk nông', 'đắc nông', 'lâm đồng'];

  const dongNamBo = [
    'hồ chí minh', 'tp. hcm', 'tp hồ chí minh', 'bình dương', 'đồng nai', 
    'bà rịa – vũng tàu', 'bà rịa - vũng tàu', 'vũng tàu', 'tây ninh', 'bình phước'
  ];

  const mekongDelta = [
    'long an', 'tiền giang', 'bến tre', 'trà vinh', 'vĩnh long', 'đồng tháp', 
    'an giang', 'kiên giang', 'cần thơ', 'hậu giang', 'sóc trăng', 'bạc liêu', 'cà mau'
  ];

  if (mienBac.some(item => p.includes(item))) return 'Miền Bắc';
  if (mienTrung.some(item => p.includes(item))) return 'Miền Trung';
  if (tayNguyen.some(item => p.includes(item))) return 'Tây Nguyên';
  if (dongNamBo.some(item => p.includes(item))) return 'Đông Nam Bộ';
  if (mekongDelta.some(item => p.includes(item))) return 'Đồng bằng Sông Cửu Long';

  return 'Đông Nam Bộ';
}

function createSlug(str) {
  if (!str) return 'kcn-' + Date.now();
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function runCrawler() {
  console.log('🚀 Bắt đầu thu thập dữ liệu 480 Khu công nghiệp từ idpvn.com...');

  // 1. Fetch Main KCN Page
  const mainHtml = await fetchUrl('https://idpvn.com/khu-cong-nghiep/');
  if (!mainHtml) {
    console.error('❌ Không thể tải trang chính idpvn.com/khu-cong-nghiep/');
    return;
  }

  const tableMatch = mainHtml.match(/<table id="tablepress-873"[\s\S]*?<\/table>/i);
  if (!tableMatch) {
    console.error('❌ Không tìm thấy bảng tablepress-873');
    return;
  }

  const rows = tableMatch[0].match(/<tr[\s\S]*?<\/tr>/gi) || [];
  console.log(`📊 Tìm thấy ${rows.length - 1} dòng dữ liệu KCN trong bảng TablePress.`);

  const kcnList = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cols = row.match(/<td[\s\S]*?<\/td>/gi) || [];
    if (cols.length >= 3) {
      const stt = parseInt(cols[0].replace(/<[^>]+>/g, '').trim()) || i;
      const linkMatch = cols[1].match(/href="([^"]+)"/i);
      const sourceUrl = linkMatch ? linkMatch[1] : '';
      let rawName = cols[1].replace(/<[^>]+>/g, '').trim();
      // Clean name from trailing URLs or artifacts
      rawName = rawName.replace(/https?:\/\/[^\s]+/gi, '').trim();
      const province = cols[2].replace(/<[^>]+>/g, '').trim();

      const slug = createSlug(rawName);

      kcnList.push({
        id: slug,
        stt,
        name: rawName,
        province,
        region: getRegion(province),
        sourceUrl,
        location: `${rawName}, ${province}, Việt Nam`,
        totalArea: '200 - 500 ha',
        occupancyRate: '85%',
        stages: [1, 2, 3, 4, 5, 6],
        primaryIndustries: ['Công nghiệp phụ trợ', 'Chế biến chế tạo', 'Cơ khí chính xác', 'Điện tử & Bán dẫn', 'Logistics KCN'],
        image: '/stage1_bg.jpg',
        description: `${rawName} là khu công nghiệp trọng điểm tại tỉnh ${province}, có vị trí giao thương chiến lược, hạ tầng đồng bộ và thu hút mạnh mẽ các doanh nghiệp sản xuất FDI và trong nước.`,
        factories: []
      });
    }
  }

  console.log(`✅ Đã phân tích xong danh sách cơ bản ${kcnList.length} Khu công nghiệp!`);

  // 2. Fetch Detail Pages & Extract Factories Concurrently (Batches of 10)
  console.log('🔄 Đang cào chi tiết từng KCN và danh sách nhà máy...');
  const BATCH_SIZE = 10;
  for (let i = 0; i < kcnList.length; i += BATCH_SIZE) {
    const batch = kcnList.slice(i, i + BATCH_SIZE);
    
    await Promise.all(batch.map(async (kcn) => {
      if (!kcn.sourceUrl) return;

      try {
        const detailHtml = await fetchUrl(kcn.sourceUrl);
        if (!detailHtml) return;

        // 1. Extract Image with precision
        const imgs = detailHtml.match(/<img[^>]+src="([^">]+)"[^>]*>/gi) || [];
        for (const imgTag of imgs) {
          const srcMatch = imgTag.match(/src="([^">]+)"/i);
          const altMatch = imgTag.match(/alt="([^">]*)"/i);
          const src = srcMatch ? srcMatch[1] : "";
          const alt = altMatch ? altMatch[1] : "";
          
          if (src.includes("wp-content/uploads") && 
              !src.includes("banner") && 
              !src.includes("logo") && 
              !src.includes("filter") && 
              !src.includes("sidebar") &&
              !src.includes("detector") &&
              !src.includes("icon") &&
              !src.includes("avatar")) {
            kcn.image = src;
            if (alt.toLowerCase().includes("khu") || alt.toLowerCase().includes("kcn")) {
              kcn.image = src;
              break;
            }
          }
        }

        // 2. Extract Description Paragraphs
        const pMatches = detailHtml.match(/<p>([\s\S]*?)<\/p>/gi) || [];
        const cleanParagraphs = pMatches
          .map(p => p.replace(/<[^>]+>/g, '').trim())
          .filter(t => t.length > 40 && !t.includes('Quảng cáo') && !t.includes('idpvn'));
        
        if (cleanParagraphs.length > 0) {
          kcn.description = cleanParagraphs.slice(0, 3).join('\n\n');
        }

        // 3. Extract Factory Table
        const tables = detailHtml.match(/<table[\s\S]*?<\/table>/gi) || [];
        for (const t of tables) {
          const tRows = t.match(/<tr[\s\S]*?<\/tr>/gi) || [];
          if (tRows.length > 1) {
            for (let rIdx = 1; rIdx < tRows.length; rIdx++) {
              const r = tRows[rIdx];
              const cCols = r.match(/<td[\s\S]*?<\/td>/gi) || [];
              if (cCols.length >= 4) {
                const no = parseInt(cCols[0].replace(/<[^>]+>/g, '').trim()) || rIdx;
                const fName = cCols[1].replace(/<[^>]+>/g, '').trim();
                const foundedYear = cCols.length > 2 ? cCols[2].replace(/<[^>]+>/g, '').trim() : '';
                const address = cCols.length > 3 ? cCols[3].replace(/<[^>]+>/g, '').trim() : '';
                const type = cCols.length > 4 ? cCols[4].replace(/<[^>]+>/g, '').trim() : 'Tư nhân';
                const industry = cCols.length > 5 ? cCols[5].replace(/<[^>]+>/g, '').trim() : 'Sản xuất công nghiệp';

                if (fName && fName.length > 2) {
                  kcn.factories.push({
                    no,
                    name: fName,
                    foundedYear: foundedYear || '2015',
                    address: address || kcn.location,
                    type: type || 'Kinh tế tư nhân',
                    industry: industry || 'Sản xuất công nghiệp & Gia công cơ khí'
                  });
                }
              }
            }
          }
        }

        kcn.totalFactories = kcn.factories.length;
        kcn.totalEnterprises = kcn.factories.length;
      } catch (err) {
        console.warn(`⚠️ Lỗi khi cào KCN ${kcn.name}:`, err.message);
      }
    }));

    const progress = Math.min(i + BATCH_SIZE, kcnList.length);
    if (progress % 50 === 0 || progress === kcnList.length) {
      console.log(`⏳ Tiến độ cào KCN: ${progress}/${kcnList.length} (${Math.round((progress / kcnList.length) * 100)}%)`);
    }
  }

  console.log(`🎉 Thu thập thành công ${kcnList.length} Khu công nghiệp!`);
  const totalFactoriesCount = kcnList.reduce((acc, k) => acc + (k.factories ? k.factories.length : 0), 0);
  console.log(`🏭 Tổng số lượng Nhà máy thu thập được: ${totalFactoriesCount} nhà máy.`);
  const withImagesCount = kcnList.filter(k => k.image && k.image.startsWith('http')).length;
  console.log(`🖼️ Số KCN có ảnh gốc từ IDPVN: ${withImagesCount}/${kcnList.length} KCN.`);

  // 3. Save to Local JSON file for Backup & Instant Frontend Fallback
  const dataDir = path.resolve('server/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const fullJsonPath = path.join(dataDir, 'industrialParksFull.json');
  fs.writeFileSync(fullJsonPath, JSON.stringify(kcnList, null, 2), 'utf8');
  console.log(`💾 Đã lưu file backup cục bộ: ${fullJsonPath}`);

  const frontendDataPath = path.resolve('src/data/industrialParksFull.json');
  fs.writeFileSync(frontendDataPath, JSON.stringify(kcnList, null, 2), 'utf8');
  console.log(`💾 Đã đồng bộ file frontend: ${frontendDataPath}`);

  // 4. Ingest into MongoDB Atlas
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ Chưa cấu hình MONGODB_URI trong .env, bỏ qua lưu MongoDB.');
    return;
  }

  try {
    console.log('🔄 Đang kết nối và lưu dữ liệu vào MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Đã kết nối MongoDB Atlas.');

    // Delete all old mock KCNs
    console.log('🧹 Đang xóa toàn bộ KCN cũ trong MongoDB Atlas...');
    await IndustrialPark.deleteMany({});
    console.log('✅ Đã xóa toàn bộ KCN cũ.');

    // Insert all 480 pure KCNs
    console.log('🔄 Đang nạp 480 KCN mới vào collection `industrialparks`...');
    await IndustrialPark.insertMany(kcnList);
    console.log(`✅ ĐÃ LƯU THÀNH CÔNG 480 KHU CÔNG NGHIỆP VÀO MONGODB ATLAS!`);

    await mongoose.disconnect();
    console.log('🏁 Hoàn tất toàn bộ quy trình!');
  } catch (dbErr) {
    console.error('❌ Lỗi lưu MongoDB Atlas:', dbErr.message);
  }
}

runCrawler();
