import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../../dist');
const distIndexPath = path.join(distPath, 'index.html');
const targetDir = path.join(distPath, 'todzung');
const targetIndexPath = path.join(targetDir, 'index.html');

const SEO_TITLE = 'TÔ NGỌC DŨNG | TODZUNG';
const META_DESC = 'Kết nối và đồng hành cùng đối tác, khách hàng trong lĩnh vực may mặc, đồng phục, quà tặng doanh nghiệp, giao nhận logistics và bán lẻ, hướng đến những giá trị hợp tác bền vững và hiệu quả.';
const OG_IMAGE = 'https://chuoicungung.com/images/Anh_Dung.jpg';
const PAGE_URL = 'https://chuoicungung.com/todzung';

if (fs.existsSync(distIndexPath)) {
  let html = fs.readFileSync(distIndexPath, 'utf8');

  // Replace Title & Primary Meta
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${SEO_TITLE}</title>`);
  html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/gi, `<meta name="title" content="${SEO_TITLE}" />`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${META_DESC}" />`);

  // Replace Open Graph tags
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${SEO_TITLE}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${META_DESC}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${PAGE_URL}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${OG_IMAGE}" />`);
  html = html.replace(/<meta\s+property="og:image:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:url" content="${OG_IMAGE}" />`);
  html = html.replace(/<meta\s+property="og:image:secure_url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:secure_url" content="${OG_IMAGE}" />`);
  html = html.replace(/<meta\s+property="og:image:type"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:type" content="image/jpeg" />`);
  html = html.replace(/<meta\s+property="og:image:width"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:width" content="1200" />`);
  html = html.replace(/<meta\s+property="og:image:height"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:height" content="630" />`);
  html = html.replace(/<meta\s+property="og:image:alt"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:alt" content="${SEO_TITLE}" />`);

  // Replace Twitter tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${SEO_TITLE}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${META_DESC}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${OG_IMAGE}" />`);
  html = html.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:url" content="${PAGE_URL}" />`);

  // Replace Canonical & Schema
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${PAGE_URL}" />`);
  html = html.replace(/<meta\s+itemprop="name"\s+content=".*?"\s*\/?>/gi, `<meta itemprop="name" content="${SEO_TITLE}" />`);
  html = html.replace(/<meta\s+itemprop="description"\s+content=".*?"\s*\/?>/gi, `<meta itemprop="description" content="${META_DESC}" />`);
  html = html.replace(/<meta\s+itemprop="image"\s+content=".*?"\s*\/?>/gi, `<meta itemprop="image" content="${OG_IMAGE}" />`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetIndexPath, html, 'utf8');
  fs.writeFileSync(path.join(distPath, 'todzung.html'), html, 'utf8');
  console.log('✅ Đã tạo thành công dist/todzung/index.html & dist/todzung.html với ảnh preview Anh_Dung.jpg!');
} else {
  console.warn('⚠️ Không tìm thấy dist/index.html. Hãy chạy vite build trước.');
}
