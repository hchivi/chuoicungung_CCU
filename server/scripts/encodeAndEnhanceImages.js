import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IndustrialPark from '../models/IndustrialPark.js';

dotenv.config();

const defaultHqImages = [
  'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
  '/stage1_hero.jpg',
  '/stage2_hero.jpg',
  '/stage3_hero.jpg',
  '/stage4_hero.jpg',
  '/stage5_hero.jpg',
  '/stage6_hero.jpg'
];

async function run() {
  const jsonPath = path.resolve('server/data/industrialParksFull.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  data.forEach((kcn, idx) => {
    if (kcn.image && kcn.image.startsWith('http')) {
      // Correctly percent-encode Vietnamese Unicode characters in URL
      try {
        kcn.image = encodeURI(decodeURI(kcn.image));
      } catch (e) {
        kcn.image = encodeURI(kcn.image);
      }
    } else {
      kcn.image = defaultHqImages[idx % defaultHqImages.length];
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(path.resolve('src/data/industrialParksFull.json'), JSON.stringify(data, null, 2), 'utf8');
  console.log('💾 Đã lưu file JSON với link ảnh mã hóa chuẩn URI.');

  const uri = process.env.MONGODB_URI;
  if (uri) {
    console.log('🔄 Đang cập nhật MongoDB Atlas...');
    await mongoose.connect(uri);
    await IndustrialPark.deleteMany({});
    await IndustrialPark.insertMany(data);
    console.log('✅ Đã cập nhật toàn bộ 480 KCN lên MongoDB Atlas!');
    await mongoose.disconnect();
  }
}

run();
