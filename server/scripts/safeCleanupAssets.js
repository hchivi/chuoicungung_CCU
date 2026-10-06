import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');
const backupDir = path.join(rootDir, '_backup_unused_assets');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Danh sách các file rác và file media hoàn toàn không được sử dụng
const filesToClean = [
  // Root junk
  'INTENT:',
  'test_pex.jpg',
  'test_wiki.jpg',
  '1.png',
  'PIJU vi.png',

  // public root scrap
  'public/1.png',
  'public/PIJU vi.png',
  'public/contour_0.txt',
  'public/contour_0_centered.txt',
  'public/contour_1.txt',
  'public/contour_1_centered.txt',
  'public/hero_bg.jpg',
  'public/hero_luxury_bg.jpg',
  'public/stage1_bg.jpg',
  'public/stage2_bg.jpg',
  'public/stage3_bg.jpg',
  'public/stage4_bg.jpg',
  'public/stage5_bg.jpg',
  'public/stage6_bg.jpg',
  'public/stage_factory_hero.jpg',
  'public/logo_doc.png',
  'public/logo_final_ccu.png',
  'public/logo_gear_mono.svg',
  'public/logo_mono_shaded.png',
  'public/logo_monochrome.png',
  'public/logo_sea.png',
  'public/logo_slogan.png',

  // public/uniform (thư mục ảnh test uniform/pin cài thừa)
  'public/uniform/Screenshot_20261004-124023_Gallery.jpg',
  'public/uniform/file_000000001af481faa56d6bb554035853.png',
  'public/uniform/file_000000002d2c82099c61f0c00790cbdb.png',
  'public/uniform/file_00000000409081fab00e3fa0a3efcbb2.png',
  'public/uniform/file_00000000536881faa2da4afa1ffd2a9b.png',
  'public/uniform/file_00000000e1d8820bbea4fa3e2417e758.png',
  'public/uniform/logo_only.png',
  'public/uniform/pin.png',
  'public/uniform/uni.png',

  // public/mascots (mascot Suppli cũ & chainy png thừa)
  'public/mascots/suppli-transparent.png',
  'public/mascots/suppli-transparent.webp',
  'public/mascots/suppli-directions.webp',
  'public/mascots/suppli-reactions.webp',
  'public/mascots/chainy-transparent.png',

  // public/images/partners (phiên bản cũ trước 2026)
  'public/images/partners/partner_vn_association.jpg',
  'public/images/partners/partner_vn_development.jpg',
  'public/images/partners/partner_vn_founding.jpg',
  'public/images/partners/partner_vn_sponsor.jpg',

  // public/images variants không dùng của Tô Ngọc Dũng (code dùng to_ngoc_dung_real.jpg & Anh_Dung.jpg)
  'public/images/to_ngoc_dung.jpg',
  'public/images/to_ngoc_dung_og.jpg',
  'public/images/to_ngoc_dung_og_crop.jpg',
  'public/images/to_ngoc_dung_og_padded.jpg',

  // public/images videos nặng không sử dụng
  'public/images/vietnam_enterprise_recruitment.mp4',
  'public/images/vietnam_recruitment_talent.mp4',
  'public/images/vietnam_financial_centers_flycam_480p.webm',
  'public/images/vietnam_sme_recruitment.mp4',
  'public/images/vietnam_office_talent.webm',
  'public/images/ecosystem_hero_smart_factory.mp4',
  'public/images/ecosystem_hero_smart_factory_poster.jpg',
  'public/images/ecosystem_component_assembly.mp4',
  'public/images/ecosystem_component_assembly_poster.jpg',
  'public/images/vietnam_factory_workforce.mp4'
];

let movedCount = 0;
let totalBytes = 0;

for (const relPath of filesToClean) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    totalBytes += stat.size;
    const destPath = path.join(backupDir, relPath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.renameSync(fullPath, destPath);
    movedCount++;
    console.log(`📦 Đã sao lưu an toàn sang _backup_unused_assets/: ${relPath} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

// Xóa thư mục public/uniform nếu rỗng
const uniformDir = path.join(rootDir, 'public/uniform');
if (fs.existsSync(uniformDir)) {
  const remaining = fs.readdirSync(uniformDir).filter(f => f !== '.DS_Store');
  if (remaining.length === 0) {
    fs.rmSync(uniformDir, { recursive: true, force: true });
    console.log('🗑️  Đã gỡ bỏ thư mục rỗng: public/uniform');
  }
}

// Dọn .DS_Store trong public và root
function removeDsStore(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    if (item === '.DS_Store') {
      try { fs.unlinkSync(p); } catch (e) {}
    } else {
      try {
        if (fs.statSync(p).isDirectory() && item !== 'node_modules' && item !== '.git') {
          removeDsStore(p);
        }
      } catch (e) {}
    }
  }
}
removeDsStore(rootDir);

console.log(`\n🎉 HOÀN TẤT DỌN DẸP AN TOÀN!`);
console.log(`- Đã di chuyển an toàn: ${movedCount} files.`);
console.log(`- Dung lượng giải phóng khỏi thư mục build: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB.`);
console.log(`- Toàn bộ files đã được lưu dự phòng tại: ${backupDir}`);
