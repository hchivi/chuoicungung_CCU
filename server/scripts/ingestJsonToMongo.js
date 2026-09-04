import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IndustrialPark from '../models/IndustrialPark.js';

dotenv.config();

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

async function ingest() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Không tìm thấy MONGODB_URI');
    return;
  }

  const jsonPath = path.resolve('server/data/industrialParksFull.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📊 Đọc được ${data.length} KCN từ file JSON.`);

  // Ensure unique slug ID for each KCN
  const seenIds = new Set();
  data.forEach((kcn, idx) => {
    let slug = createSlug(`${kcn.name}-${kcn.province}`);
    if (seenIds.has(slug)) {
      slug = createSlug(`${kcn.name}-${kcn.province}-${kcn.stt || idx + 1}`);
    }
    seenIds.add(slug);
    kcn.id = slug;
  });

  // Save back unique IDs to JSON files
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(path.resolve('src/data/industrialParksFull.json'), JSON.stringify(data, null, 2), 'utf8');
  console.log('💾 Đã cập nhật slug ID duy nhất vào file JSON.');

  console.log('🔄 Đang kết nối MongoDB Atlas...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Đã kết nối MongoDB Atlas.');

  console.log('🧹 Xóa toàn bộ dữ liệu KCN cũ...');
  await IndustrialPark.deleteMany({});
  console.log('✅ Đã xóa toàn bộ KCN cũ.');

  console.log('🔄 Đang nạp 480 KCN mới vào MongoDB Atlas...');
  await IndustrialPark.insertMany(data);
  console.log(`🎉 NẠP THÀNH CÔNG ${data.length} KHU CÔNG NGHIỆP VÀO MONGODB ATLAS!`);

  const count = await IndustrialPark.countDocuments();
  console.log(`✅ Xác minh: Tổng số KCN hiện có trong database: ${count}`);

  await mongoose.disconnect();
  console.log('🏁 Hoàn tất!');
}

ingest();
