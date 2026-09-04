import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IndustrialPark from '../models/IndustrialPark.js';

dotenv.config();

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      return resolve(true);
    }

    let file = fs.createWriteStream(destPath);
    let client = url.startsWith('https') ? https : http;

    let req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://idpvn.com/'
      },
      timeout: 8000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return downloadImage(res.headers.location, destPath).then(resolve);
      }

      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve(false);
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    });

    req.on('error', () => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });
  });
}

async function main() {
  const imagesDir = path.resolve('public/kcn_images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const jsonPath = path.resolve('server/data/industrialParksFull.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log(`🚀 Bắt đầu tải ảnh cho ${data.length} KCN vào thư mục public/kcn_images/...`);

  let successCount = 0;
  for (let i = 0; i < data.length; i++) {
    const kcn = data[i];
    const fileName = `${kcn.id}.jpg`;
    const destPath = path.join(imagesDir, fileName);

    if (kcn.image && kcn.image.startsWith('http')) {
      const ok = await downloadImage(kcn.image, destPath);
      if (ok && fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
        kcn.localImage = `/kcn_images/${fileName}`;
        successCount++;
      } else {
        kcn.localImage = kcn.image;
      }
    } else {
      kcn.localImage = kcn.image || '/stage1_hero.jpg';
    }

    if ((i + 1) % 50 === 0 || i === data.length - 1) {
      console.log(`⏳ Tiến độ tải ảnh: ${i + 1}/${data.length} (Đã tải thành công: ${successCount})`);
    }
  }

  // Update image property to localImage if available
  data.forEach(kcn => {
    if (kcn.localImage && kcn.localImage.startsWith('/kcn_images/')) {
      kcn.image = kcn.localImage;
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(path.resolve('src/data/industrialParksFull.json'), JSON.stringify(data, null, 2), 'utf8');
  console.log(`🎉 Hoàn tất tải ảnh! Tổng cộng ${successCount}/${data.length} ảnh thực tế đã được lưu vào public/kcn_images/`);

  const uri = process.env.MONGODB_URI;
  if (uri) {
    console.log('🔄 Đang đồng bộ cập nhật đường dẫn ảnh vào MongoDB Atlas...');
    await mongoose.connect(uri);
    await IndustrialPark.deleteMany({});
    await IndustrialPark.insertMany(data);
    console.log('✅ Đã cập nhật toàn bộ 480 KCN lên MongoDB Atlas!');
    await mongoose.disconnect();
  }
}

main();
