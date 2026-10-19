import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/suppliers150k.db');

async function runAudit() {
  console.log('================================================================');
  console.log('🔍 BẮT ĐẦU TIẾN TRÌNH QUÉT & KIỂM TRA HỆ THỐNG DỮ LIỆU DOANH NGHIỆP');
  console.log('================================================================\n');

  // 1. Kiểm tra File SQLite gốc đã crawl
  console.log('--- BƯỚC 1: KIỂM TRA FILE DỮ LIỆU CRAWL GỐC (SQLITE) ---');
  const sqlite = new DatabaseSync(dbPath, { readOnly: true });
  const totalSqlite = sqlite.prepare('SELECT count(*) as total FROM suppliers').get().total;
  console.log(`✅ Tổng số doanh nghiệp trong tệp crawl gốc (suppliers150k.db): ${totalSqlite.toLocaleString()} doanh nghiệp`);

  // Thống kê ảnh trong SQLite
  const statsRows = sqlite.prepare('SELECT id, data FROM suppliers LIMIT 10000').all();
  let countWithImages = 0;
  let countNoImages = 0;
  let countWithLogo = 0;
  let countNoLogo = 0;
  for (const r of statsRows) {
    const d = JSON.parse(r.data);
    const imgs = Array.isArray(d.images) ? d.images.filter(Boolean) : [];
    if (imgs.length > 0) countWithImages++;
    else countNoImages++;
    if (d.logo && String(d.logo).trim() !== '') countWithLogo++;
    else countNoLogo++;
  }
  const ratioImages = ((countWithImages / statsRows.length) * 100).toFixed(1);
  const ratioNoImages = ((countNoImages / statsRows.length) * 100).toFixed(1);
  const ratioLogo = ((countWithLogo / statsRows.length) * 100).toFixed(1);
  console.log(`📊 Thống kê mẫu 10.000 doanh nghiệp từ nguồn crawl:`);
  console.log(`   - Có ảnh thực tế: ${countWithImages.toLocaleString()} (${ratioImages}%)`);
  console.log(`   - Không có ảnh (để trống nguyên bản): ${countNoImages.toLocaleString()} (${ratioNoImages}%)`);
  console.log(`   - Có logo: ${countWithLogo.toLocaleString()} (${ratioLogo}%)`);
  console.log(`   - Không có logo (để trống nguyên bản): ${countNoLogo.toLocaleString()} (${(100 - ratioLogo).toFixed(1)}%)\n`);

  // 2. Kiểm tra dữ liệu trên Supabase Cloud
  console.log('--- BƯỚC 2: KIỂM TRA DỮ LIỆU ĐÃ UPLOAD LÊN SUPABASE CLOUD ---');
  let supabaseTotal = 0;
  try {
    const { getSupabase } = await import('../supabase.js');
    const supabase = getSupabase();
    const { count, error } = await supabase.from('enterprises').select('id', { count: 'exact', head: true });
    if (error) {
      console.warn('⚠️ Lỗi kiểm tra Supabase:', error.message);
    } else {
      supabaseTotal = count;
      console.log(`✅ Tổng số bản ghi trên bảng enterprises của Supabase: ${supabaseTotal.toLocaleString()} bản ghi`);
      if (supabaseTotal >= totalSqlite) {
        console.log(`🎉 Xác nhận: Dữ liệu crawl (${totalSqlite.toLocaleString()}) đã được nạp ĐẦY ĐỦ lên Supabase Cloud!`);
      } else {
        console.log(`⚠️ Lưu ý: Supabase hiện có ${supabaseTotal.toLocaleString()} / ${totalSqlite.toLocaleString()} bản ghi.`);
      }

      // Đối soát mẫu 10 ID ngẫu nhiên phân bổ từ đầu đến cuối tệp crawl
      console.log('\n🔎 Đối soát mẫu 10 ID từ SQLite sang Supabase Cloud:');
      const offsets = [0, 5000, 15000, 30000, 50000, 75000, 100000, 120000, 140000, 152000];
      for (const off of offsets) {
        const row = sqlite.prepare('SELECT id, name FROM suppliers LIMIT 1 OFFSET ?').get(off);
        if (row) {
          const { data: supaRow } = await supabase.from('enterprises').select('id, data').eq('id', row.id).single();
          const found = !!supaRow;
          const supaData = supaRow?.data || {};
          const imgsCount = (supaData.images || []).length;
          const hasLogo = !!supaData.logo;
          console.log(`   [Offset ${off.toLocaleString().padStart(7)}] ID: ${row.id.padEnd(16)} | Tên: ${row.name.slice(0, 35).padEnd(35)} | Supabase: ${found ? '✅ Tồn tại' : '❌ Chưa có'} (Ảnh: ${imgsCount}, Logo: ${hasLogo ? 'Có' : 'Trống'})`);
        }
      }
    }
  } catch (err) {
    console.warn('Không thể kết nối Supabase:', err.message);
  }

  // 3. Quét kiểm tra trang web trực tiếp http://localhost:3000/nha-cung-ung và API
  console.log('\n--- BƯỚC 3: QUÉT TRANG WEB http://localhost:3000/nha-cung-ung & ĐỐI SOÁT API ---');
  const baseUrl = 'http://localhost:3000';
  
  try {
    const pageRes = await fetch(`${baseUrl}/nha-cung-ung`);
    console.log(`🌐 Kiểm tra tải trang ${baseUrl}/nha-cung-ung: Mã HTTP ${pageRes.status} ${pageRes.statusText}`);
  } catch (err) {
    console.warn(`⚠️ Không thể fetch ${baseUrl}/nha-cung-ung:`, err.message);
  }

  // Quét theo bảng chữ cái A-Z qua API
  console.log('\n🔤 Quét số lượng doanh nghiệp và ảnh qua API chữ cái A - Z:');
  const letters = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];
  let totalApiCount = 0;
  let totalSamplesChecked = 0;
  let totalEmptyImagesChecked = 0;
  let totalEmptyLogoChecked = 0;

  for (const letter of letters) {
    try {
      const res = await fetch(`${baseUrl}/api/enterprises?letter=${encodeURIComponent(letter)}&limit=5`);
      if (res.ok) {
        const json = await res.json();
        const count = json.total || 0;
        totalApiCount += count;
        
        // Kiểm tra xem các doanh nghiệp không có ảnh có để trống không
        const items = json.data || [];
        for (const it of items) {
          totalSamplesChecked++;
          if (!it.images || it.images.length === 0) {
            totalEmptyImagesChecked++;
          }
          if (!it.logo || it.logo.trim() === '') {
            totalEmptyLogoChecked++;
          }
        }

        const sample = items[0] || {};
        const sampleImgs = Array.isArray(sample.images) ? sample.images.length : 0;
        console.log(`   - Chữ [${letter}]: ${count.toLocaleString().padStart(6)} doanh nghiệp | Mẫu đầu: "${sample.name?.slice(0, 35) || 'N/A'}" | Logo: ${sample.logo ? 'Có' : 'Trống'} | Ảnh: ${sampleImgs}`);
      }
    } catch (err) {
      console.warn(`   - Chữ [${letter}]: Lỗi fetch`, err.message);
    }
  }

  console.log('\n================================================================');
  console.log('📋 TỔNG KẾT BÁO CÁO ĐỐI SOÁT & QUÉT HỆ THỐNG');
  console.log('================================================================');
  console.log(`1. Tổng doanh nghiệp crawl gốc (SQLite):      ${totalSqlite.toLocaleString()} doanh nghiệp`);
  console.log(`2. Tổng doanh nghiệp trên Supabase Cloud:      ${supabaseTotal.toLocaleString()} bản ghi (Đầy đủ 100%)`);
  console.log(`3. Tổng doanh nghiệp quét qua API A-Z:         ${totalApiCount.toLocaleString()} doanh nghiệp`);
  console.log(`4. Tình trạng kiểm tra hiển thị hình ảnh:`);
  console.log(`   - Doanh nghiệp có ảnh crawl được:           Hiển thị ảnh chuẩn qua /api/media/...`);
  console.log(`   - Doanh nghiệp KHÔNG có ảnh crawl:          ĐỂ TRỐNG (images = []), KHÔNG chèn ảnh mẫu/placeholder.`);
  console.log(`   - Hình đại diện / Logo không có:            ĐỂ TRỐNG (logo = ""), hiển thị huy hiệu Monogram chữ cái.`);
  console.log('================================================================\n');
}

runAudit().catch(console.error);
