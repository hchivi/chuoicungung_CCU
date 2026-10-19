import { DatabaseSync } from 'node:sqlite';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractSlug(ent) {
  if (ent.slug) return ent.slug;
  if (ent.sourceUrl) {
    const match = ent.sourceUrl.match(/\/listings\/\d+\/([^/]+)\.html/);
    if (match) return match[1];
  }
  return slugify(ent.name);
}

const dbDir = path.resolve('server/data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'suppliers150k.db');

console.log('⚡ Đang khởi tạo SQLite database tại:', dbPath);
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    source_id TEXT,
    slug TEXT,
    name TEXT,
    category TEXT,
    province TEXT,
    data TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_suppliers_slug ON suppliers(slug);
  CREATE INDEX IF NOT EXISTS idx_suppliers_source_id ON suppliers(source_id);
  CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
  CREATE INDEX IF NOT EXISTS idx_suppliers_province ON suppliers(province);
  CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers(category);
`);

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO suppliers (id, source_id, slug, name, category, province, data)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const jsonlPath = path.resolve('.supplier-data/browser-archive/pilot-484435/suppliers.jsonl');
if (!fs.existsSync(jsonlPath)) {
  console.error('Không tìm thấy file:', jsonlPath);
  process.exit(1);
}

const fileStream = fs.createReadStream(jsonlPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

console.log('Bắt đầu nạp dữ liệu hơn 150.000 nhà cung ứng vào SQLite...');
const startTime = Date.now();
let count = 0;

db.exec('BEGIN TRANSACTION;');

for await (const line of rl) {
  if (!line || !line.trim()) continue;
  try {
    const ent = JSON.parse(line);
    const sourceId = String(ent.sourceId || '');
    const id = ent.id || (sourceId ? `tv-${sourceId}` : `sup-${count}`);
    const slug = extractSlug(ent);
    const name = String(ent.name || '');
    const category = typeof ent.categories?.[0] === 'object' ? ent.categories[0].name : String(ent.categories?.[0] || ent.category || '');
    const province = String(ent.province || '');

    // Ensure ent has id and slug in its JSON
    ent.id = id;
    ent.slug = slug;

    insertStmt.run(id, sourceId, slug, name, category, province, JSON.stringify(ent));
    count++;

    if (count % 25000 === 0) {
      db.exec('COMMIT; BEGIN TRANSACTION;');
      console.log(`Đã nạp ${count} doanh nghiệp (${((Date.now() - startTime) / 1000).toFixed(1)}s)...`);
    }
  } catch (err) {
    // continue
  }
}

db.exec('COMMIT;');
const duration = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`✅ Hoàn thành! Đã nạp thành công ${count} doanh nghiệp vào SQLite trong ${duration}s.`);
