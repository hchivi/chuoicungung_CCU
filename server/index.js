import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { createApp } from './app.js';

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 5050;

// Start Server & Connect MongoDB
app.listen(PORT, async () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
  await connectDB();
});
