import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');

const srcFiles = [];
function findFiles(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    if (f === 'node_modules' || f === '.git' || f === 'dist' || f === 'archive_uploads') return;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) findFiles(p);
    else if (/\.(jsx?|tsx?|json|html|css)$/.test(f)) srcFiles.push(p);
  });
}

findFiles(path.join(rootDir, 'src'));
findFiles(path.join(rootDir, 'server'));
srcFiles.push(path.join(rootDir, 'index.html'));

const mediaRegex = /["'](\/(?:images|mascots|kcn_images|catalogues|fonts|uploads|stage)[^"'\s>]+\.(?:png|jpg|jpeg|svg|webp|webm|mp4|pdf|gif|woff2?|ttf))["']/gi;

const referenced = new Set();
for (const file of srcFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = mediaRegex.exec(content)) !== null) {
      referenced.add(match[1]);
    }
  } catch (e) {}
}

console.log(`🔍 Quét được ${referenced.size} đường dẫn media trong toàn bộ code & dữ liệu.`);

const missing = [];
for (const ref of referenced) {
  const diskPath = path.join(rootDir, 'public', ref);
  if (!fs.existsSync(diskPath)) {
    missing.push(ref);
  }
}

if (missing.length > 0) {
  console.log(`⚠️ Có ${missing.length} file được code gọi nhưng không tìm thấy trong public:`);
  missing.forEach(m => console.log(`  ❌ ${m}`));
} else {
  console.log('✅ TẤT CẢ các file ảnh, video, tài liệu được code tham chiếu đều TỒN TẠI đầy đủ trong public!');
}
