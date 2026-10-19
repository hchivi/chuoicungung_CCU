import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
dotenv.config({ path: path.resolve(projectRoot, '.env') });

import { getSupabase } from '../supabase.js';
import { createSupabaseRepository, DOCUMENT_COLLECTIONS, ENTITY_TABLES } from '../storage/supabaseRepository.js';

async function generateBootstrapJson() {
  console.log('⚡ Đang xuất dữ liệu Supabase bootstrap cho static hosting iNET...');
  try {
    const repository = createSupabaseRepository({ client: getSupabase() });
    const collections = [...Object.keys(ENTITY_TABLES), ...DOCUMENT_COLLECTIONS];
    const data = Object.fromEntries(
      await Promise.all(collections.map(async c => {
        if (c === 'suppliers') {
          return [c, await repository.preview('suppliers', 50)];
        }
        const items = await repository.all(c);
        return [c, items];
      }))
    );
    const payload = { success: true, source: 'supabase', data };
    const jsonStr = JSON.stringify(payload);

    const apiDir = path.resolve(projectRoot, 'dist/api');
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }

    fs.writeFileSync(path.join(apiDir, 'bootstrap'), jsonStr);
    fs.writeFileSync(path.join(apiDir, 'bootstrap.json'), jsonStr);
    console.log(`✅ Đã tạo thành công dist/api/bootstrap & bootstrap.json (${(jsonStr.length / 1024 / 1024).toFixed(2)} MB)`);

    const authDir = path.resolve(projectRoot, 'dist/api/auth');
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
    const providersPayload = JSON.stringify({ success: true, data: { google: true, zalo: true } });
    fs.writeFileSync(path.join(authDir, 'providers'), providersPayload);
    fs.writeFileSync(path.join(authDir, 'providers.json'), providersPayload);
    console.log('✅ Đã tạo thành công dist/api/auth/providers & providers.json (google: true, zalo: true)');
  } catch (error) {
    console.error('⚠️ Không thể xuất dữ liệu Supabase bootstrap:', error.message);
    // Tạo fallback rỗng hợp lệ để frontend không bị lỗi JSON.parse
    const apiDir = path.resolve(projectRoot, 'dist/api');
    if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });
    const fallback = JSON.stringify({ success: true, source: 'supabase', data: {} });
    fs.writeFileSync(path.join(apiDir, 'bootstrap'), fallback);
    fs.writeFileSync(path.join(apiDir, 'bootstrap.json'), fallback);
  }
}

generateBootstrapJson();
