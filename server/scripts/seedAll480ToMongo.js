import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import IndustrialPark from '../models/IndustrialPark.js';

dotenv.config();

const uri = process.env.MONGODB_URI;

async function seed() {
  console.log('🔄 Đang kết nối tới MongoDB Atlas...');
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      tls: true,
      tlsAllowInvalidCertificates: true
    });
    console.log('✅ Kết nối MongoDB Atlas thành công!');

    const fullJsonPath = path.resolve('server/data/industrialParksFull.json');
    const fullData = JSON.parse(fs.readFileSync(fullJsonPath, 'utf8'));
    console.log(`📊 Đọc được ${fullData.length} Khu công nghiệp từ file JSON...`);

    console.log('🧹 Đang làm sạch collection industrialparks cũ...');
    await IndustrialPark.deleteMany({});

    console.log('🚀 Đang chèn toàn bộ 480 Khu công nghiệp vào MongoDB Atlas...');
    const inserted = await IndustrialPark.insertMany(fullData, { ordered: false });
    console.log(`\x1b[32m%s\x1b[0m`, `🎉 THÀNH CÔNG: Đã nạp ${inserted.length} Khu công nghiệp vào MongoDB Atlas!`);

    const count = await IndustrialPark.countDocuments({});
    console.log(`📈 Tổng số KCN hiện tại trong MongoDB Atlas: ${count}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  }
}

seed();
