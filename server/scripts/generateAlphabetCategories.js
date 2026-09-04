import fs from 'fs';
import path from 'path';

const categoriesPath = path.resolve('server/data/industryCategories69Pages.json');
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

// Vietnamese alphabet letters including Z
const ALPHABET = ['A', 'B', 'C', 'D', 'Đ', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z'];

function getFirstLetter(name = '') {
  const trimmed = name.trim();
  if (!trimmed) return '#';
  const first = trimmed.charAt(0).toUpperCase();
  
  // Normalize variations
  if (['A', 'Á', 'À', 'Ả', 'Ã', 'Ạ', 'Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ', 'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ'].includes(first)) return 'A';
  if (['B'].includes(first)) return 'B';
  if (['C'].includes(first)) return 'C';
  if (['D'].includes(first)) return 'D';
  if (['Đ'].includes(first)) return 'Đ';
  if (['E', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ', 'Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ'].includes(first)) return 'E';
  if (['G'].includes(first)) return 'G';
  if (['H'].includes(first)) return 'H';
  if (['I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị'].includes(first)) return 'I';
  if (['K'].includes(first)) return 'K';
  if (['L'].includes(first)) return 'L';
  if (['M'].includes(first)) return 'M';
  if (['N'].includes(first)) return 'N';
  if (['O', 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ', 'Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ'].includes(first)) return 'O';
  if (['P'].includes(first)) return 'P';
  if (['Q'].includes(first)) return 'Q';
  if (['R'].includes(first)) return 'R';
  if (['S'].includes(first)) return 'S';
  if (['T'].includes(first)) return 'T';
  if (['U', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ', 'Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự'].includes(first)) return 'U';
  if (['V'].includes(first)) return 'V';
  if (['X'].includes(first)) return 'X';
  if (['Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ'].includes(first)) return 'Y';
  if (['Z'].includes(first)) return 'Z';
  
  return first;
}

const grouped = {};
for (const l of ALPHABET) {
  grouped[l] = [];
}
grouped['#'] = [];

for (const cat of categories) {
  const letter = getFirstLetter(cat.name);
  if (grouped[letter]) {
    grouped[letter].push(cat);
  } else {
    grouped['#'].push(cat);
  }
}

// Sort categories within each letter
for (const l of Object.keys(grouped)) {
  grouped[l].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

const outPathSrc = path.resolve('src/data/categoriesAlphabetical.json');
const outPathServer = path.resolve('server/data/categoriesAlphabetical.json');

fs.writeFileSync(outPathSrc, JSON.stringify(grouped, null, 2), 'utf8');
fs.writeFileSync(outPathServer, JSON.stringify(grouped, null, 2), 'utf8');

console.log('✅ Đã tạo mục lục ngành nghề theo bảng chữ cái A-Z:', Object.keys(grouped).map(k => `${k}: ${grouped[k].length}`).join(', '));
