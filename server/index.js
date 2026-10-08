import dotenv from 'dotenv';
import { testSupabaseConnection } from './supabase.js';
import { createApp } from './app.js';

dotenv.config({ quiet: true });

const app = createApp();
const PORT = process.env.PORT || 5050;

// Supabase is the sole runtime database. MongoDB is no longer connected.
app.listen(PORT, async () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
  await testSupabaseConnection();
});
