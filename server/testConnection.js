import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Enterprise from './models/Enterprise.js';
import IndustrialPark from './models/IndustrialPark.js';
import Factory from './models/Factory.js';
import Demand from './models/Demand.js';
import { enterprisesData } from '../src/data/mockData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testAndSeed = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('🔄 Đang kết nối tới MongoDB Atlas...');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('\x1b[32m%s\x1b[0m', `✅ KẾT NỐI MONGODB ATLAS THÀNH CÔNG!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);

    // Seed Enterprise dataset (Full 4,672 Suppliers from Trang Vàng 69 pages)
    console.log('🔄 Đang xóa và đồng bộ danh sách 4.672+ Nhà cung ứng từ Trang Vàng...');
    const fullEntJsonPath = path.resolve(__dirname, 'data/enterprisesFull.json');
    let fullEntList = [];
    if (fs.existsSync(fullEntJsonPath)) {
      fullEntList = JSON.parse(fs.readFileSync(fullEntJsonPath, 'utf8'));
    }
    await Enterprise.deleteMany({});
    const insertedEnt = await Enterprise.insertMany(fullEntList, { ordered: false });
    console.log(`✅ Đã nạp thành công ${insertedEnt.length} Nhà cung ứng chuẩn hóa vào MongoDB Atlas.`);

    // Seed Industrial Parks dataset (480 KCN)
    console.log('🔄 Đang đồng bộ danh sách 480 Khu công nghiệp...');
    const fullJsonPath = path.resolve(__dirname, 'data/industrialParksFull.json');
    const fullKcnList = JSON.parse(fs.readFileSync(fullJsonPath, 'utf8'));
    await IndustrialPark.deleteMany({});
    const insertedIP = await IndustrialPark.insertMany(fullKcnList, { ordered: false });
    console.log(`✅ Đã nạp thành công ${insertedIP.length} Khu công nghiệp vào MongoDB.`);

    // Seed Factories dataset (14,237 Factories)
    console.log('🔄 Đang xóa và đồng bộ danh sách 14.237+ Nhà máy sản xuất...');
    const fullFacJsonPath = path.resolve(__dirname, 'data/factoriesFull.json');
    let fullFacList = [];
    if (fs.existsSync(fullFacJsonPath)) {
      fullFacList = JSON.parse(fs.readFileSync(fullFacJsonPath, 'utf8'));
    }
    await Factory.deleteMany({});
    const insertedFac = await Factory.insertMany(fullFacList, { ordered: false });
    console.log(`✅ Đã nạp thành công ${insertedFac.length} Nhà máy vào MongoDB Atlas.`);

    console.log('\x1b[32m%s\x1b[0m', '🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ LÊN MONGODB ATLAS!');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Lỗi kết nối MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

testAndSeed();
