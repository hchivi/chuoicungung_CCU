import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://trangvangvietnam.com/'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function testDownloadTranLinhPhotos() {
  const sampleUrls = [
    { name: 'logo.gif', url: 'https://logo.trangvangvietnam.com/L39578523600.gif' },
    { name: 'dong-phuc-ao-thun-1.jpg', url: 'https://pic.trangvangvietnam.com/395785236/dong-phuc-ao-thun(1).jpg' },
    { name: 'dong-phuc-ao-thun-2.jpg', url: 'https://pic.trangvangvietnam.com/395785236/dong-phuc-ao-thun(2).jpg' },
    { name: 'dong-phuc-bao-ho-1.jpg', url: 'https://pic.trangvangvietnam.com/395785236/dong-phuc-bao-ho(1).jpg' },
    { name: 'dong-phuc-ao-khoac-1.jpg', url: 'https://pic.trangvangvietnam.com/395785236/dong-phuc-ao-khoac(1).jpg' },
    { name: 'dong-phuc-so-mi-1.jpg', url: 'https://pic.trangvangvietnam.com/395785236/dong-phuc-so-mi(1).jpg' }
  ];

  const targetDir = path.join(__dirname, '../../public/uploads/suppliers/1188012861');
  console.log(`Downloading to ${targetDir}...`);

  for (const item of sampleUrls) {
    const dest = path.join(targetDir, item.name);
    const ok = await downloadFile(item.url, dest);
    console.log(`- ${item.name}: ${ok ? '✅ OK' : '❌ Failed'}`);
  }
}

testDownloadTranLinhPhotos();
