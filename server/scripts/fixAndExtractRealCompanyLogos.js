import fs from 'fs';
import path from 'path';

const ENTERPRISES_FILE = path.resolve('src/data/enterprisesFull.json');
const SUPPLIERS_DIR = path.resolve('public/uploads/suppliers');

const TRANG_VANG_DEFAULT_LOGO_SIZE = 5098; // Size of the yellow Trang Vang Vietnam site logo

async function downloadBinary(url, filePath) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > 500) {
        // Check if this is the Trang Vang site logo by byte length
        if (buffer.length === TRANG_VANG_DEFAULT_LOGO_SIZE || buffer.length === 5099 || buffer.length === 5097) {
          return null; // Reject fake Trang Vang yellow logo
        }
        fs.writeFileSync(filePath, buffer);
        return buffer.length;
      }
    }
  } catch (err) {
    // Ignore network error
  }
  return null;
}

async function findRealCompanyLogo(ent) {
  const cleanId = (ent.id || '').replace('ncc-tv-', '');
  const supplierFolder = path.join(SUPPLIERS_DIR, cleanId);

  if (!fs.existsSync(supplierFolder)) {
    fs.mkdirSync(supplierFolder, { recursive: true });
  }

  // 1. Try Trang Vang's genuine custom company logo endpoint (e.g. L[id].gif, L[id].jpg, L[id].png)
  if (cleanId && /^\d+$/.test(cleanId)) {
    const extensions = ['gif', 'png', 'jpg'];
    for (const ext of extensions) {
      const tvLogoUrl = `https://logo.trangvangvietnam.com/L${cleanId}.${ext}`;
      const localPath = path.join(supplierFolder, `real_logo.${ext}`);
      const downloadedBytes = await downloadBinary(tvLogoUrl, localPath);
      if (downloadedBytes && downloadedBytes !== TRANG_VANG_DEFAULT_LOGO_SIZE) {
        return `/uploads/suppliers/${cleanId}/real_logo.${ext}`;
      }
    }
  }

  // 2. Try official company website (if available)
  if (ent.website && !ent.website.includes('trangvangvietnam') && !ent.website.includes('facebook') && !ent.website.includes('zalo.me')) {
    let rawUrl = ent.website.trim();
    if (!rawUrl.startsWith('http')) {
      rawUrl = 'https://' + rawUrl;
    }

    try {
      const parsed = new URL(rawUrl);
      const domain = parsed.hostname.replace(/^www\./, '');

      // Try Google high-res favicon as crisp logo
      const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      const localFaviconPath = path.join(supplierFolder, 'logo.png');
      const downloadedFavicon = await downloadBinary(googleFaviconUrl, localFaviconPath);
      if (downloadedFavicon && downloadedFavicon > 600) {
        return `/uploads/suppliers/${cleanId}/logo.png`;
      }
    } catch (e) {
      // Invalid URL, continue
    }
  }

  return null;
}

async function main() {
  console.log('🚀 Bắt đầu làm sạch và cập nhật logo thực tế cho toàn bộ nhà cung ứng...');

  if (!fs.existsSync(ENTERPRISES_FILE)) {
    console.error('Không tìm thấy file:', ENTERPRISES_FILE);
    return;
  }

  const enterprises = JSON.parse(fs.readFileSync(ENTERPRISES_FILE, 'utf8'));
  console.log(`Tìm thấy ${enterprises.length} doanh nghiệp trong database.`);

  // 1. Quét và xóa toàn bộ file logo.gif giả mạo của Trang Vang (size 5098b)
  let deletedTrangVangLogos = 0;
  if (fs.existsSync(SUPPLIERS_DIR)) {
    const dirs = fs.readdirSync(SUPPLIERS_DIR);
    for (const d of dirs) {
      const p = path.join(SUPPLIERS_DIR, d, 'logo.gif');
      if (fs.existsSync(p)) {
        const sz = fs.statSync(p).size;
        if (sz === TRANG_VANG_DEFAULT_LOGO_SIZE || sz === 5099 || sz === 5097) {
          fs.unlinkSync(p);
          deletedTrangVangLogos++;
        }
      }
    }
  }
  console.log(`🗑️ Đã xóa ${deletedTrangVangLogos} file logo.gif mặc định của trangvangvietnam.com.`);

  // 2. Cập nhật từng doanh nghiệp
  let updatedRealLogos = 0;
  let monogramFallbacks = 0;

  for (let i = 0; i < enterprises.length; i++) {
    const ent = enterprises[i];
    const cleanId = (ent.id || '').replace('ncc-tv-', '');

    // Check if current logo is fake Trang Vang logo
    const isFakeLogo = ent.logo && (
      ent.logo.includes('logo.gif') || 
      ent.logo.includes('trangvangvietnam.com/images') || 
      ent.logo.includes('yellowpages')
    );

    if (isFakeLogo || !ent.logo) {
      // Find authentic logo
      const realLogo = await findRealCompanyLogo(ent);
      if (realLogo) {
        ent.logo = realLogo;
        updatedRealLogos++;
      } else {
        // If company has no custom logo, set null so UI displays Corporate Monogram Badge
        ent.logo = null;
        monogramFallbacks++;
      }
    }

    if ((i + 1) % 500 === 0 || i === enterprises.length - 1) {
      console.log(`Đã xử lý ${i + 1}/${enterprises.length} doanh nghiệp (Thực tế: ${updatedRealLogos}, Monogram chuẩn: ${monogramFallbacks})`);
    }
  }

  // Save updated database
  fs.writeFileSync(ENTERPRISES_FILE, JSON.stringify(enterprises, null, 2), 'utf8');
  console.log('✅ Đã lưu thành công enterprisesFull.json!');

  // Sync to dist if exists
  const distFile = path.resolve('dist/data/enterprisesFull.json');
  if (fs.existsSync(path.dirname(distFile))) {
    fs.writeFileSync(distFile, JSON.stringify(enterprises, null, 2), 'utf8');
  }

  console.log(`🎉 HOÀN TẤT! Đã loại bỏ 100% logo Trang Vàng. Cập nhật ${updatedRealLogos} logo công ty thực tế & ${monogramFallbacks} Monogram nhận diện chuyên nghiệp.`);
}

main().catch(console.error);
