import dotenv from 'dotenv';
dotenv.config();
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSupabase } from '../supabase.js';
import { normalize150kSupplier } from '../storage/sqliteSupplierStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const dbPath = path.resolve(__dirname, '../data/suppliers150k.db');
const progressFile = path.resolve(projectRoot, '.supplier-data/supabase-upload-progress.json');

const BATCH_SIZE = 25;
const CONCURRENCY = 2;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadProgress() {
  try {
    if (fs.existsSync(progressFile)) {
      return JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    }
  } catch {}
  return { lastOffset: 0, totalProcessed: 0, startedAt: new Date().toISOString() };
}

function saveProgress(data) {
  try {
    const dir = path.dirname(progressFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(progressFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('Không thể lưu file tiến trình:', err.message);
  }
}

async function upsertBatchWithRetry(client, records, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { error } = await client.from('enterprises').upsert(records, {
        onConflict: 'id',
        ignoreDuplicates: false
      });
      if (!error) return true;
      if (attempt === retries) {
        console.error(`❌ Thất bại sau ${retries} lần thử:`, error.message);
        return false;
      }
      await sleep(attempt * 1200);
    } catch (err) {
      if (attempt === retries) {
        console.error(`❌ Lỗi mạng sau ${retries} lần thử:`, err.message);
        return false;
      }
      await sleep(attempt * 1500);
    }
  }
  return false;
}

export async function upload150kToSupabase() {
  console.log('========================================================');
  console.log('🚀 TIẾN TRÌNH NẠP 152.623 DOANH NGHIỆP LÊN SUPABASE CLOUD');
  console.log('========================================================');

  const client = getSupabase();
  if (!client) {
    console.error('❌ Không tìm thấy thông tin kết nối Supabase trong file .env');
    process.exit(1);
  }

  if (!fs.existsSync(dbPath)) {
    console.error(`❌ Không tìm thấy cơ sở dữ liệu SQLite tại: ${dbPath}`);
    process.exit(1);
  }

  const db = new DatabaseSync(dbPath, { readOnly: true });
  const totalRow = db.prepare('SELECT COUNT(*) as total FROM suppliers').get();
  const totalRecords = totalRow.total;
  console.log(`📊 Tổng số hồ sơ cần nạp: ${totalRecords.toLocaleString('vi-VN')} doanh nghiệp`);

  let progress = loadProgress();
  let currentOffset = progress.lastOffset || 0;
  console.log(`📌 Bắt đầu nạp tiếp từ vị trí: ${currentOffset.toLocaleString('vi-VN')} / ${totalRecords.toLocaleString('vi-VN')}`);

  const stmt = db.prepare('SELECT * FROM suppliers LIMIT ? OFFSET ?');
  const startTime = Date.now();
  let uploadedInSession = 0;

  while (currentOffset < totalRecords) {
    const chunkPromises = [];

    for (let c = 0; c < CONCURRENCY && currentOffset < totalRecords; c++) {
      const offset = currentOffset;
      const rows = stmt.all(BATCH_SIZE, offset);
      if (rows.length === 0) break;

      currentOffset += rows.length;

      const records = rows.map(row => {
        const norm = normalize150kSupplier(row);
        const cleanData = {
          id: norm.id,
          name: norm.name,
          shortName: norm.shortName,
          cleanName: norm.cleanName,
          category: norm.category,
          province: norm.province,
          address: norm.address,
          phone: norm.phone,
          email: norm.email,
          website: norm.website,
          taxCode: norm.taxCode,
          establishedYear: norm.establishedYear,
          employees: norm.employees,
          businessType: norm.businessType,
          logo: norm.logo,
          avatar: norm.avatar,
          products: (norm.products || []).slice(0, 8),
          images: (norm.images || []).slice(0, 8),
          imageCaptions: (norm.imageCaptions || []).slice(0, 8),
          description: (norm.description || '').slice(0, 500)
        };
        return {
          id: norm.id,
          name: norm.name,
          normalized_name: norm.cleanName ? norm.cleanName.toLowerCase() : norm.name.toLowerCase(),
          category: norm.category,
          province: norm.province,
          stage: norm.stage || 4,
          phase: norm.phases?.[0] || '4.1',
          verification_status: 'VERIFIED',
          data: cleanData
        };
      });

      chunkPromises.push(
        upsertBatchWithRetry(client, records).then(ok => {
          if (ok) uploadedInSession += records.length;
        })
      );
    }

    if (chunkPromises.length === 0) break;

    await Promise.all(chunkPromises);

    const percent = ((currentOffset / totalRecords) * 100).toFixed(1);
    const elapsedSec = Math.max(1, (Date.now() - startTime) / 1000);
    const speed = Math.round(uploadedInSession / elapsedSec);
    const remainingSec = Math.round((totalRecords - currentOffset) / Math.max(1, speed));
    const remainingMin = (remainingSec / 60).toFixed(1);

    console.log(
      `[${new Date().toLocaleTimeString('vi-VN')}] ` +
      `Đã nạp: ${currentOffset.toLocaleString('vi-VN')} / ${totalRecords.toLocaleString('vi-VN')} (${percent}%) ` +
      `| Tốc độ: ${speed} doanh nghiệp/s ` +
      `| Còn lại: ~${remainingMin} phút`
    );

    saveProgress({
      lastOffset: currentOffset,
      totalProcessed: currentOffset,
      totalRecords,
      percent: parseFloat(percent),
      lastUpdated: new Date().toISOString()
    });
  }

  console.log('========================================================');
  console.log(`🎉 HOÀN TẤT NẠP TOÀN BỘ ${totalRecords.toLocaleString('vi-VN')} DOANH NGHIỆP LÊN SUPABASE!`);
  console.log('========================================================');
}

upload150kToSupabase().catch(err => {
  console.error('❌ Lỗi tiến trình nạp:', err);
  process.exit(1);
});
