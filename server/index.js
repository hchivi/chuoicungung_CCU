import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Chuỗi Cung Ứng - Backend API is running',
    version: '1.0.0',
    endpoints: ['/api/status', '/api/enterprises', '/api/demands', '/api/industrial-parks']
  });
});

// Start Server & Connect MongoDB
app.listen(PORT, async () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
  await connectDB();
});
