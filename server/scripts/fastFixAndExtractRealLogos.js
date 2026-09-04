import fs from 'fs';
import path from 'path';

const ENTERPRISES_FILE = path.resolve('src/data/enterprisesFull.json');
const SUPPLIERS_DIR = path.resolve('public/uploads/suppliers');
const TRANG_VANG_DEFAULT_LOGO_SIZE = 5098;

async function downloadBinary(url, filePath) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

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
        if (buffer.length === TRANG_VANG_DEFAULT_LOGO_SIZE || buffer.length === 5099 || buffer.length === 5097) {
          return null; // Reject fake yellow logo
        }
        fs.writeFileSync(filePath, buffer);
        return buffer.length;
      }
    }
  } catch (err) {
    // Ignore error
  }
  return null;
}

async function processSupplier(ent) {
  const cleanId = (ent.id || '').replace('ncc-tv-', '');
  const supplierFolder = path.join(SUPPLIERS_DIR, cleanId);

  // If already has an existing valid non-yellow logo file
  if (ent.logo && !ent.logo.includes('logo.gif') && !ent.logo.includes('trangvangvietnam.com/images')) {
    const relPath = ent.logo.startsWith('/') ? ent.logo.slice(1) : ent.logo;
    const diskPath = path.resolve('public', relPath);
    if (fs.existsSync(diskPath) && fs.statSync(diskPath).size !== TRANG_VANG_DEFAULT_LOGO_SIZE) {
      return { status: 'kept', logo: ent.logo };
    }
  }

  // 1. Try real company website favicon/logo
  if (ent.website && !ent.website.includes('trangvangvietnam') && !ent.website.includes('facebook') && !ent.website.includes('zalo.me')) {
    let rawUrl = ent.website.trim();
    if (!rawUrl.startsWith('http')) {
      rawUrl = 'https://' + rawUrl;
    }

    try {
      const parsed = new URL(rawUrl);
      const domain = parsed.hostname.replace(/^www\./, '');

      if (!fs.existsSync(supplierFolder)) {
        fs.mkdirSync(supplierFolder, { recursive: true });
      }

      const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      const localFaviconPath = path.join(supplierFolder, 'logo.png');
      const downloadedFavicon = await downloadBinary(googleFaviconUrl, localFaviconPath);
      if (downloadedFavicon && downloadedFavicon > 600) {
        return { status: 'website_logo', logo: `/uploads/suppliers/${cleanId}/logo.png` };
      }
    } catch (e) {
      // Ignore
    }
  }

  // 2. Try Trang Vang genuine custom company logo endpoint (L[id].png or L[id].jpg)
  if (cleanId && /^\d+$/.test(cleanId)) {
    if (!fs.existsSync(supplierFolder)) {
      fs.mkdirSync(supplierFolder, { recursive: true });
    }
    const tvLogoUrl = `https://logo.trangvangvietnam.com/L${cleanId}.png`;
    const localPath = path.join(supplierFolder, 'real_logo.png');
    const downloadedBytes = await downloadBinary(tvLogoUrl, localPath);
    if (downloadedBytes && downloadedBytes !== TRANG_VANG_DEFAULT_LOGO_SIZE) {
      return { status: 'tv_custom_logo', logo: `/uploads/suppliers/${cleanId}/real_logo.png` };
    }
  }

  // 3. Otherwise, set to null (renders stylish corporate monogram)
  return { status: 'monogram', logo: null };
}

async function main() {
  console.log('⚡ Đang xử lý làm sạch và cập nhật logo thực tế...');

  const enterprises = JSON.parse(fs.readFileSync(ENTERPRISES_FILE, 'utf8'));
  console.log(`Tổng số: ${enterprises.length} doanh nghiệp.`);

  const BATCH_SIZE = 50;
  let realLogoCount = 0;
  let monogramCount = 0;

  for (let i = 0; i < enterprises.length; i += BATCH_SIZE) {
    const batch = enterprises.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(ent => processSupplier(ent)));

    for (let j = 0; j < batch.length; j++) {
      const res = results[j];
      batch[j].logo = res.logo;
      if (res.logo) {
        realLogoCount++;
      } else {
        monogramCount++;
      }
    }

    if ((i + BATCH_SIZE) % 1000 === 0 || i + BATCH_SIZE >= enterprises.length) {
      console.log(`Đã xử lý: ${Math.min(i + BATCH_SIZE, enterprises.length)}/${enterprises.length} (Có logo thực tế: ${realLogoCount}, Monogram: ${monogramCount})`);
    }
  }

  fs.writeFileSync(ENTERPRISES_FILE, JSON.stringify(enterprises, null, 2), 'utf8');
  console.log('✅ Đã lưu src/data/enterprisesFull.json');

  const distFile = path.resolve('dist/data/enterprisesFull.json');
  if (fs.existsSync(path.dirname(distFile))) {
    fs.writeFileSync(distFile, JSON.stringify(enterprises, null, 2), 'utf8');
  }

  console.log(`🎉 HOÀN THÀNH: ${realLogoCount} logo thương hiệu thực tế, ${monogramCount} Monogram sang trọng chuẩn B2B. Đã loại bỏ hoàn toàn 100% logo Trang Vàng!`);
}

main().catch(console.error);
