import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../../dist');
const distIndexPath = path.join(distPath, 'index.html');
const pages = [
  {
    targetDir: path.join(distPath, 'todzung'),
    htmlFileName: 'todzung.html',
    seoTitle: 'TÔ NGỌC DŨNG | TODZUNG',
    metaDesc: 'Kết nối và đồng hành cùng đối tác, khách hàng trong lĩnh vực may mặc, đồng phục, quà tặng doanh nghiệp, giao nhận logistics và bán lẻ, hướng đến những giá trị hợp tác bền vững và hiệu quả.',
    ogImage: 'https://chuoicungung.com/images/anh_Dung_profile.jpg',
    pageUrl: 'https://chuoicungung.com/todzung'
  },
  {
    targetDir: path.join(distPath, 'tonydong'),
    htmlFileName: 'tonydong.html',
    seoTitle: 'ĐỒNG THÀNH TUYÊN | TONY DONG',
    metaDesc: 'Với hơn 10 năm kinh nghiệm thực chiến trong lĩnh vực công nghệ số, Fintech, Web3 và phát triển bền vững (ESG), tôi là nhà lãnh đạo chiến lược và nhà sáng lập các hệ sinh thái đổi mới sáng tạo, tiên phong kết nối nguồn lực, thúc đẩy chuyển đổi số và phát triển xanh cho doanh nghiệp trong nước và quốc tế.',
    ogImage: 'https://chuoicungung.com/images/anh_Tuyen_profile.jpg',
    pageUrl: 'https://chuoicungung.com/tonydong'
  },
  {
    targetDir: path.join(distPath, 'jennytrinh'),
    htmlFileName: 'jennytrinh.html',
    seoTitle: 'NGUYỄN THỊ HÀ TRINH | JENNY TRINH',
    metaDesc: 'Kết nối và đồng hành cùng đối tác, khách hàng trong lĩnh vực may đồng phục nhân viên, trang thiết bị bảo hộ lao động và quà tặng doanh nghiệp, hướng đến các giải pháp tối ưu, chất lượng và hợp tác bền vững nhất.',
    ogImage: 'https://chuoicungung.com/images/chi_Trinh_profile.jpg',
    pageUrl: 'https://chuoicungung.com/jennytrinh'
  },
  {
    targetDir: path.join(distPath, 'mstrinh'),
    htmlFileName: 'mstrinh.html',
    seoTitle: 'NGUYỄN THỊ HÀ TRINH | JENNY TRINH',
    metaDesc: 'Kết nối và đồng hành cùng đối tác, khách hàng trong lĩnh vực may đồng phục nhân viên, trang thiết bị bảo hộ lao động và quà tặng doanh nghiệp, hướng đến các giải pháp tối ưu, chất lượng và hợp tác bền vững nhất.',
    ogImage: 'https://chuoicungung.com/images/chi_Trinh_profile.jpg',
    pageUrl: 'https://chuoicungung.com/jennytrinh'
  }
];

if (fs.existsSync(distIndexPath)) {
  const originalHtml = fs.readFileSync(distIndexPath, 'utf8');

  pages.forEach(({ targetDir, htmlFileName, seoTitle, metaDesc, ogImage, pageUrl }) => {
    let html = originalHtml;

    // Replace Title & Primary Meta
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${seoTitle}</title>`);
    html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/gi, `<meta name="title" content="${seoTitle}" />`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${metaDesc}" />`);

    // Replace Open Graph tags
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${seoTitle}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${metaDesc}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${pageUrl}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${ogImage}" />`);
    html = html.replace(/<meta\s+property="og:image:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:url" content="${ogImage}" />`);
    html = html.replace(/<meta\s+property="og:image:secure_url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:secure_url" content="${ogImage}" />`);
    html = html.replace(/<meta\s+property="og:image:type"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:type" content="image/jpeg" />`);
    html = html.replace(/<meta\s+property="og:image:width"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:width" content="1024" />`);
    html = html.replace(/<meta\s+property="og:image:height"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:height" content="768" />`);
    html = html.replace(/<meta\s+property="og:image:alt"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:alt" content="${seoTitle}" />`);

    // Replace Twitter tags
    html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${seoTitle}" />`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${metaDesc}" />`);
    html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${ogImage}" />`);
    html = html.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:url" content="${pageUrl}" />`);

    // Replace Canonical & Schema
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${pageUrl}" />`);
    html = html.replace(/<meta\s+itemprop="name"\s+content=".*?"\s*\/?>/gi, `<meta itemprop="name" content="${seoTitle}" />`);
    html = html.replace(/<meta\s+itemprop="description"\s+content=".*?"\s*\/?>/gi, `<meta itemprop="description" content="${metaDesc}" />`);
    html = html.replace(/<meta\s+itemprop="image"\s+content=".*?"\s*\/?>/gi, `<meta itemprop="image" content="${ogImage}" />`);

    // Ensure image_src link tag for Zalo & Viber crawlers
    if (html.includes('rel="image_src"')) {
      html = html.replace(/<link\s+rel="image_src"\s+href=".*?"\s*\/?>/gi, `<link rel="image_src" href="${ogImage}" />`);
    } else {
      html = html.replace('</head>', `  <link rel="image_src" href="${ogImage}" />\n</head>`);
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join(distPath, htmlFileName), html, 'utf8');
    console.log(`✅ Đã tạo thành công ${targetDir}/index.html & ${htmlFileName}!`);
  });
} else {
  console.warn('⚠️ Không tìm thấy dist/index.html. Hãy chạy vite build trước.');
}
