import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../../src/data/enterprisesFull.json');
const serverDataPath = path.join(__dirname, '../data/enterprisesFull.json');

let enterprises = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Exact authentic real profile for Trần Linh with local downloaded images
const TRAN_LINH_EXACT = {
  id: "ncc-tv-1188012861",
  _id: "ncc-tv-1188012861",
  name: "Xưởng May Đồng Phục Trần Linh - Công Ty TNHH May Mặc Trần Linh",
  shortName: "May Mặc Trần Linh",
  category: "May Đồng Phục - Công Ty May Đồng Phục",
  industry: "May Mặc, May Đồng Phục, Áo Thun Đồng Phục, Đồng Phục Bảo Hộ, Sơ Mi & Áo Khoác",
  industries: [
    "May Mặc - Các Công Ty May Mặc",
    "May Đồng Phục - Công Ty May Đồng Phục",
    "Áo Thun Đồng Phục - Công Ty May Áo Thun, Áo Phông Đồng Phục",
    "Đồng Phục Học Sinh, May Đồng Phục Học Sinh, Học Sinh Tiểu Học",
    "Đồng Phục Sơ Mi, Đồng Phục Áo Sơ Mi"
  ],
  address: "76C Đường 13A, Khu Phố 70, Phường Bình Hưng Hòa, TP. Hồ Chí Minh, Việt Nam",
  province: "TP. Hồ Chí Minh",
  phone: "0378135135",
  hotline: "0378 135 135",
  email: "maymactranlinh@gmail.com",
  website: "https://www.maymactranlinh.com",
  displayWebsite: "www.maymactranlinh.com",
  logo: "/uploads/suppliers/1188012861/logo.gif",
  businessType: "Nhà sản xuất, Gia công",
  mainMarkets: "Toàn quốc",
  keyClients: "Công ty, trường học, nhà hàng, quán cà phê, khách sạn...",
  establishedYear: 2021,
  employees: "50 - 100 người",
  taxCode: "0316781166",
  representative: "May Mặc Trần Linh",
  description: "Xưởng May Đồng Phục Trần Linh (Công Ty TNHH May Mặc Trần Linh) là đối tác sản xuất may mặc uy tín với bề dày kinh nghiệm hoạt động trong ngành từ năm 2005. Doanh nghiệp sở hữu xưởng may quy mô, dây chuyền in thêu công nghiệp hiện đại cùng đội ngũ công nhân may lành nghề. Chúng tôi chuyên sản xuất và may gia công trọn gói: Áo thun đồng phục, Áo polo, Đồng phục bảo hộ lao động phản quang, Đồng phục sơ mi công sở, Áo khoác gió đồng phục, Tạp dề và Nón đồng phục theo đơn đặt hàng kỹ thuật riêng của từng doanh nghiệp và nhà máy KCN.",
  partners: ["Grab", "Guta", "TP Bank", "Techcombank", "Agribank", "ACB", "BIDV", "SCB"],
  productGroups: [
    {
      groupName: "Đồng phục áo thun",
      items: [
        "Đồng phục áo thun",
        "Đồng phục áo thun cổ tàu",
        "Đồng phục áo thun có cổ",
        "Đồng phục áo polo",
        "Đồng phục áo thun cổ tròn",
        "Đồng phục áo thun trắng",
        "Đồng phục áo thun nam",
        "Đồng phục áo thun in logo",
        "Đồng phục áo thun theo yêu cầu"
      ]
    },
    {
      groupName: "Đồng phục bảo hộ",
      items: [
        "Đồng phục bảo hộ",
        "Đồng phục bảo hộ lao động",
        "Đồng phục bảo hộ phản quang",
        "Đồng phục bảo hộ ngành xây dựng",
        "Đồng phục bảo hộ 2 màu",
        "Đồng phục bảo hộ màu cam",
        "Đồng phục bảo hộ ngành hóa chất",
        "Đồng phục bảo hộ dài tay",
        "Đồng phục bảo hộ ngành y tế",
        "Đồng phục bảo hộ ngành thực phẩm"
      ]
    },
    {
      groupName: "Đồng phục học sinh, sơ mi, áo khoác",
      items: [
        "Đồng phục sơ mi",
        "Đồng phục học sinh",
        "Đồng phục theo yêu cầu",
        "Đồng phục sơ mi công sở",
        "Đồng phục áo khoác",
        "Đồng phục sơ mi nữ",
        "Đồng phục học sinh nữ",
        "Đồng phục áo khoác có mũ",
        "Đồng phục công sở",
        "Đồng phục sơ mi nam",
        "Đồng phục học sinh nam",
        "Đồng phục áo khoác in logo"
      ]
    },
    {
      groupName: "Đồng phục tạp dề, nón",
      items: [
        "Đồng phục nón",
        "Đồng phục tạp dề theo yêu cầu",
        "Đồng phục tạp dề cho nhà hàng",
        "Đồng phục tạp dề cho quán cà phê",
        "Đồng phục tạp dề"
      ]
    },
    {
      groupName: "May gia công đồng phục",
      items: [
        "May gia công đồng phục",
        "May gia công đồng phục bảo hộ",
        "May gia công đồng phục học sinh",
        "Gia công áo thun đồng phục",
        "May gia công đồng phục công sở",
        "Gia công đồng phục áo khoác",
        "Gia công đồng phục theo yêu cầu",
        "May gia công đồng phục công ty",
        "May gia công đồng phục theo đơn đặt hàng"
      ]
    }
  ],
  galleryGroups: [
    {
      groupName: "Đồng phục áo thun",
      images: [
        "/uploads/suppliers/1188012861/dong-phuc-ao-thun-1.jpg",
        "/uploads/suppliers/1188012861/dong-phuc-ao-thun-2.jpg",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      groupName: "Đồng phục bảo hộ",
      images: [
        "/uploads/suppliers/1188012861/dong-phuc-bao-ho-1.jpg",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80"
      ]
    },
    {
      groupName: "Đồng phục áo khoác & sơ mi",
      images: [
        "/uploads/suppliers/1188012861/dong-phuc-ao-khoac-1.jpg",
        "/uploads/suppliers/1188012861/dong-phuc-so-mi-1.jpg",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80"
      ]
    }
  ],
  stages: [4, 5],
  phases: ["4.1", "4.2", "5.1"],
  rating: 5.0,
  isVerified: true
};

// Place Tran Linh at top
const existingIdx = enterprises.findIndex(e => e.id === TRAN_LINH_EXACT.id || (e.name && e.name.includes("Trần Linh")));
if (existingIdx >= 0) {
  enterprises[existingIdx] = TRAN_LINH_EXACT;
} else {
  enterprises.unshift(TRAN_LINH_EXACT);
}

fs.writeFileSync(dataPath, JSON.stringify(enterprises, null, 2), 'utf8');
if (fs.existsSync(path.dirname(serverDataPath))) {
  fs.writeFileSync(serverDataPath, JSON.stringify(enterprises, null, 2), 'utf8');
}

console.log('✅ Đã cập nhật xong hồ sơ Trần Linh với ảnh local /uploads/suppliers/1188012861/!');
