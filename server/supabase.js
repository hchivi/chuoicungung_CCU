import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 
                    process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
}

export function getSupabase() {
  return supabase;
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey && supabase);
}

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  Chưa cấu hình SUPABASE_URL hoặc SUPABASE_KEY trong file .env');
    return false;
  }
  try {
    const { count, error } = await supabase
      .from('enterprises')
      .select('*', { count: 'exact', head: true });

    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase unavailable: check schema and backend credentials.');
      return false;
    }
    console.log('\x1b[32m%s\x1b[0m', `✅ Kết nối Supabase thành công! (Dữ liệu enterprises: ${count ?? 0} bản ghi)`);
    return true;
  } catch (err) {
    console.error('Supabase connection check failed.');
    return false;
  }
}
