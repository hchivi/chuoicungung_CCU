/**
 * CLI Local Database Seed Script
 * ONLY for local development / testing.
 *
 * Usage:
 *   node server/scripts/seedLocalDatabase.js --dry-run
 *   CONFIRM_SEED=1 node server/scripts/seedLocalDatabase.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Enterprise from '../models/Enterprise.js';
import IndustrialPark from '../models/IndustrialPark.js';
import { enterprisesData, industrialParksData } from '../../src/data/mockData.js';

dotenv.config();

const isDryRun = process.argv.includes('--dry-run');

async function run() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ CẤM chạy seed script trên môi trường production!');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chuoicungung';
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(mongoUri);

  console.log(`\n--- LOCAL SEED SCRIPT ---`);
  console.log(`Chế độ: ${isDryRun ? 'DRY-RUN (chỉ kiểm tra, không ghi vào DB)' : 'THỰC THI (áp dụng vào DB)'}`);
  console.log(`Số lượng Enterprises chuẩn bị nạp: ${enterprisesData.length}`);
  console.log(`Số lượng IndustrialParks chuẩn bị nạp: ${industrialParksData.length}`);

  if (isDryRun) {
    console.log(`\n✅ Dry-run hoàn tất thành công. Không có dữ liệu nào bị thay đổi.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  if (process.env.CONFIRM_SEED !== '1') {
    console.warn(`\n⚠️  Cảnh báo: Thao tác này sẽ ghi đè dữ liệu mẫu trên local DB.`);
    console.warn(`Vui lòng chạy lại với biến môi trường CONFIRM_SEED=1 để xác nhận.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`\nĐang nạp dữ liệu mẫu vào local DB...`);
  await Enterprise.deleteMany({});
  await Enterprise.insertMany(enterprisesData);
  console.log(`✅ Đã nạp ${enterprisesData.length} Enterprises`);

  await IndustrialPark.deleteMany({});
  await IndustrialPark.insertMany(industrialParksData);
  console.log(`✅ Đã nạp ${industrialParksData.length} IndustrialParks`);

  console.log(`\n🎉 Seed dữ liệu mẫu hoàn tất thành công!`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('Lỗi khi seed:', err);
  process.exit(1);
});
