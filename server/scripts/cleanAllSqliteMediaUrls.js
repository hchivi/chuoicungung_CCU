import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const dbPath = path.resolve('server/data/suppliers150k.db');
const db = new DatabaseSync(dbPath);

console.log('Bắt đầu làm sạch toàn bộ dữ liệu SQLite suppliers150k.db...');
console.time('total-clean');

const BATCH_SIZE = 5000;
let offset = 0;
let totalUpdated = 0;

const selectStmt = db.prepare('SELECT id, data FROM suppliers LIMIT ? OFFSET ?');
const updateStmt = db.prepare('UPDATE suppliers SET data = ? WHERE id = ?');

while (true) {
  const rows = selectStmt.all(BATCH_SIZE, offset);
  if (!rows || rows.length === 0) break;

  db.exec('BEGIN TRANSACTION');
  for (const r of rows) {
    if (!r.data) continue;
    let str = r.data;
    str = str.replace(/https?:\/\/(products|pic|logo|img)\.trangvangvietnam\.com\/([^\s",\\]+)/gi, '/api/media/$1/$2');
    str = str.replace(/https?:\/\/[a-z0-9.]*trangvangvietnam\.com\/categories\/\d+\/([a-z0-9_-]+)\.html/gi, '/nganh-nghe/$1');
    str = str.replace(/https?:\/\/[a-z0-9.]*trangvangvietnam\.com[^\s",\\]*/gi, '');
    str = str.replace(/trangvangvietnam\.com/gi, 'chuoicungung.com');
    str = str.replace(/trang\s*vàng\s*(việt\s*nam)?/gi, 'Chuỗi Cung Ứng');
    str = str.replace(/trangvang/gi, 'Chuỗi Cung Ứng');
    
    updateStmt.run(str, r.id);
  }
  db.exec('COMMIT');

  totalUpdated += rows.length;
  offset += rows.length;
  process.stdout.write(`\rĐã chuẩn hóa: ${totalUpdated.toLocaleString()} / 152,623 doanh nghiệp...`);
}

console.log('\n');
console.timeEnd('total-clean');

// Check sample
const sample = db.prepare('SELECT id, name, data FROM suppliers LIMIT 1').get();
const parsed = JSON.parse(sample.data);
console.log('Sample verified:');
console.log(' - ID:', sample.id);
console.log(' - Logo:', parsed.logo);
console.log(' - Images (top 2):', (parsed.images || []).slice(0, 2));
console.log('Làm sạch SQLite hoàn tất 100%!');
