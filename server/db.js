import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  Chưa cấu hình MONGODB_URI trong file .env! Đang chạy ở chế độ fallback Mock Data.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('\x1b[32m%s\x1b[0m', `✅ Kết nối MongoDB Atlas thành công: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Lỗi kết nối MongoDB: ${error.message}`);
    return false;
  }
};
