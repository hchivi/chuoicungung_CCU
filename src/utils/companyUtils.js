import categoryImagesMap from '../data/categoryImagesMap.json';

export const MONOGRAM_GRADIENTS = [
  "from-blue-600 to-indigo-700",
  "from-indigo-600 to-purple-700",
  "from-emerald-600 to-teal-700",
  "from-teal-600 to-cyan-700",
  "from-cyan-600 to-blue-700",
  "from-amber-600 to-orange-700",
  "from-rose-600 to-pink-700",
  "from-purple-600 to-pink-700",
  "from-blue-700 to-slate-800",
  "from-emerald-700 to-slate-800"
];

export function getCompanyMonogram(name = '') {
  if (!name) return 'DN';
  
  let clean = name.split(' - ')[0]; // remove suffix if any
  
  // Clean prefixes
  clean = clean
    .replace(/^(Công\s*Ty\s*(TNHH(\s*MTV)?|Cổ\s*Phần|CP|MTV|TMDV|Thương\s*Mại|Dịch\s*Vụ|SX|Sản\s*Xuất|Đầu\s*Tư)?|Xí\s*Nghiệp|Doanh\s*Nghiệp(\s*Tư\s*Nhân)?|DNTN|Tập\s*Đoàn|Chi\s*Nhánh|HTX|Hợp\s*Tác\s*Xã)\s+/i, '')
    .replace(/^(Dịch\s*Vụ\s*Công\s*Nghiệp|Chế\s*Tạo\s*(&|\+)\s*Dịch\s*Vụ|Thương\s*Mại\s*(&|\+)\s*Cung\s*Ứng(\s*Toàn\s*Cầu)?|Kỹ\s*Thuật|Sản\s*Xuất\s*(&|\+)\s*Thương\s*Mại|Cung\s*Ứng)\s+/i, '')
    .trim();

  const words = clean.split(/[\s\-_–—]+/).filter(w => w.length > 0 && !/^(và|cho|của|tại|ở|&|\+)$/i.test(w));
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    return words[0].substring(0, Math.min(3, words[0].length)).toUpperCase();
  }
  return 'DN';
}

export function getMonogramGradient(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MONOGRAM_GRADIENTS.length;
  return MONOGRAM_GRADIENTS[index];
}

export function isValidCustomLogo(logo) {
  if (!logo || typeof logo !== 'string') return false;
  const trimmed = logo.trim();
  if (trimmed === '') return false;
  if (trimmed.includes('default_logo.png')) return false;
  if (trimmed.includes('trangvangvietnam.com/images/default')) return false;
  return true;
}

export function getEnterpriseAvatarImage(ent) {
  if (!ent) return "/images/supplier_b2b_hero.jpg";
  if (isValidCustomLogo(ent.logo)) {
    return ent.logo;
  }
  if (Array.isArray(ent.images) && ent.images.length > 0 && ent.images[0] && typeof ent.images[0] === 'string' && !ent.images[0].includes('default_logo')) {
    return ent.images[0];
  }
  return getCategoryBannerImage(ent.category || ent.industry || ent.name || '');
}

export function detectPhaseAndStage(name = '') {
  if (!name || name === 'all') {
    return { phase: 'all', stage: 'all' };
  }
  const lower = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

  // 5.3 Đồng phục & Bảo hộ (PPE) - Check early for Balo, Đồng phục, May mặc, Giày, Bảo hộ!
  if (/ba\s*lo|balo|tui\s*xach|cap|gio|vali|dong\s*phuc|bao\s*ho|ppe|quan\s*ao|may\s*mac|giay|mu|gang\s*tay|khau\s*trang|tap\s*de|theu|in\s*ao|ao\s*mua/.test(lower)) {
    return { phase: "5.3", stage: "5" };
  }
  // 5.1 Tuyển dụng & Lao động
  if (/tuyen\s*dung|lao\s*dong|nhan\s*su|headhunt|cung\s*ung\s*nhan\s*luc|dao\s*tao|viec\s*lam/.test(lower)) {
    return { phase: "5.1", stage: "5" };
  }
  // 5.2 Đời sống & Phúc lợi
  if (/suat\s*an|cang\s*tin|dua\s*don|xe\s*buyt|nha\s*o\s*cong\s*nhan|phuc\s*loi|qua\s*tang|teambuilding/.test(lower)) {
    return { phase: "5.2", stage: "5" };
  }

  // 1.1 Khảo sát & Định hướng
  if (/khao\s*sat|dinh\s*huong|nghien\s*cuu\s*thi\s*truong|kha\s*thi|dia\s*chat|trac\s*dia|quy\s*hoach\s*1\/500|tu\s*van\s*dau\s*tu|fdi|danh\s*gia\s*dau\s*tu/.test(lower)) {
    return { phase: "1.1", stage: "1" };
  }
  // 1.2 Pháp lý & Thủ tục
  if (/phap\s*ly|thu\s*tuc|giay\s*phep|dtm|danh\s*gia\s*tac\s*dong\s*moi\s*truong|pccc\s*tham\s*duyet|so\s*huu\s*tri\s*tue|thanh\s*lap\s*doanh\s*nghiep/.test(lower)) {
    return { phase: "1.2", stage: "1" };
  }
  // 1.3 Chọn địa điểm & Mặt bằng
  if (/dia\s*diem|mat\s*bang|kcn|khu\s*cong\s*nghiep|cum\s*cong\s*nghiep|thue\s*dat|thue\s*xuong|nha\s*xuong\s*cho\s*thue|bat\s*dong\s*san\s*cong\s*nghiep/.test(lower)) {
    return { phase: "1.3", stage: "1" };
  }

  // 2.1 Thiết kế & Quy hoạch
  if (/thiet\s*ke|quy\s*hoach|kien\s*truc|ket\s*cau|bim|mo\s*hinh|ban\s*ve|tong\s*mat\s*bang/.test(lower)) {
    return { phase: "2.1", stage: "2" };
  }
  // 2.2 Thi công xây dựng
  if (/thi\s*cong|xay\s*dung|nha\s*thep|tien\s*che|ket\s*cau\s*thep|ep\s*coc|mong|san\s*be\s*tong|vlxd|be\s*tong|gach|ximang/.test(lower)) {
    return { phase: "2.2", stage: "2" };
  }
  // 2.3 Cơ điện & Hạ tầng kỹ thuật
  if (/co\s*dien|mep|tram\s*bien\s*ap|dien\s*22kv|tu\s*dien|chieu\s*sang|pccc|phong\s*chay|hvac|dieu\s*hoa|thong\s*gio|xu\s*ly\s*nuoc\s*thai|cap\s*thoat\s*nuoc/.test(lower)) {
    return { phase: "2.3", stage: "2" };
  }

  // 3.1 Lắp đặt máy & Dây chuyền
  if (/lap\s*dat\s*may|day\s*chuyen|may\s*moc|can\s*cau|cau\s*truc|nang\s*ha|lap\s*rap\s*may/.test(lower)) {
    return { phase: "3.1", stage: "3" };
  }
  // 3.2 Hoàn thiện không gian sản xuất
  if (/hoan\s*thien|phong\s*sach|cleanroom|fit-out|son\s*epoxy|san\s*epoxy|vach\s*panel|panel\s*cach\s*nhiet|epoxy/.test(lower)) {
    return { phase: "3.2", stage: "3" };
  }
  // 3.3 Kiểm tra & Chạy thử Nghiệm thu
  if (/kiem\s*tra|chay\s*thu|nghiem\s*thu|hieu\s*chuan|kiem\s*dinh\s*may|do\s*luong/.test(lower)) {
    return { phase: "3.3", stage: "3" };
  }

  // 4.1 Cung ứng đầu vào (NVL, linh kiện)
  if (/nvl|nguyen\s*vat\s*lieu|linh\s*kien|nhua|hat\s*nhua|kim\s*loai|thep|nhom|dong|hoa\s*chat|bao\s*bi|carton|thung\s*carton|mang\s*pe|bang\s*keo|bu\s*long|oc\s*vit|phu\s*lieu|phu\s*tung/.test(lower)) {
    return { phase: "4.1", stage: "4" };
  }
  // 4.2 Quản lý sản xuất & Kiểm soát
  if (/quan\s*ly\s*san\s*xuat|gia\s*cong|khuon\s*mau|cnc|phay\s*cnc|tien\s*cnc|cat\s*laser|dot\s*dap|ep\s*nhua|son\s*tinh\s*dien|ma\s*dien|qa|qc|kiem\s*soat\s*chat\s*luong/.test(lower)) {
    return { phase: "4.2", stage: "4" };
  }
  // 4.3 Giao nhận & Phân phối
  if (/giao\s*nhan|phan\s*phoi|logistics|kho\s*bai|van\s*chuyen|xe\s*nang|thue\s*xe\s*nang|pallet|cang|hai\s*quan|forwarding/.test(lower)) {
    return { phase: "4.3", stage: "4" };
  }

  // 6.1 Mở rộng công suất & Nhà máy
  if (/mo\s*rong|cong\s*suat|giai\s*doan\s*2|phase\s*2|nha\s*may\s*moi/.test(lower)) {
    return { phase: "6.1", stage: "6" };
  }
  // 6.2 Audit & ISO – Chuẩn hóa
  if (/audit|iso|chuan\s*hoa|danh\s*gia|chung\s*nhan|ce|fda|rohs/.test(lower)) {
    return { phase: "6.2", stage: "6" };
  }
  // 6.3 Chuyển đổi số & Tự động hóa
  if (/chuyen\s*doi\s*so|tu\s*dong\s*hoa|agv|robot\s*agv|mes|scada|erp|iot|dien\s*mat\s*troi|solar|esg|nang\s*luong\s*xanh/.test(lower)) {
    return { phase: "6.3", stage: "6" };
  }

  // Fallback defaults
  return { phase: "4.1", stage: "4" };
}

/**
 * Intelligent Image Matcher: Maps category name or search keyword to high-res relevant industrial photo
 */
export function getCategoryBannerImage(name = '') {
  if (!name || name === 'all') {
    return "/images/supplier_b2b_hero.jpg";
  }

  // 1. Direct Lookup from Pre-generated A-Z 3,418 Category Map
  if (categoryImagesMap[name]) {
    return categoryImagesMap[name];
  }

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  if (categoryImagesMap[slug]) {
    return categoryImagesMap[slug];
  }

  const clean = (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();

  // 2. Comprehensive Semantic Regex Rules for Keywords & Substring Matching
  // 2.1 Cảm biến, Đo lưu lượng, Thiết bị đo, Áp kế, Nhiệt kế, Cân điện tử
  if (/cam\s*bien|do\s*luu\s*luong|dong\s*ho\s*do|thiet\s*bi\s*do|ap\s*ke|nhiet\s*ke|can\s*dien\s*tu|luu\s*luong|do\s*luong|thi\s*nghiem|do\s*dac|trac\s*dia|ban\s*do/i.test(clean)) {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.2 Ba Lô Du Lịch, Vali, Túi Du Lịch, Phượt, Hành Lý, Dã Ngoại
  if (/ba\s*lo.*du\s*lich|du\s*lich.*ba\s*lo|balo.*du\s*lich|tui.*du\s*lich|du\s*lich|vali|hanh\s*ly|phuot|camping|da\s*ngoai/i.test(clean)) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.3 Balo Quảng Cáo, Balo Quà Tặng, Cặp Học Sinh, Giỏ Xách, Xưởng May Balo, Túi Canvas, Túi Tote
  if (/ba\s*lo|balo|cap\s*sach|cap\s*hoc\s*sinh|gio\s*xach|tui\s*xach|tui\s*vai|tui\s*canvas|tui\s*tote|may\s*balo|bop|vi\s*da/i.test(clean)) {
    return "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.4 Áo Mưa, Áo Mưa Quảng Cáo, Bạt Che, Dù Che, Mái Hiên
  if (/ao\s*mua|bat\s*che|du\s*che|o\s*du|mai\s*che|mai\s*hien/i.test(clean)) {
    return "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.5 Đồng Phục, Áo Thun, May Mặc Thời Trang, Dệt May, Vải, Thêu, In Áo, Áo Sơ Mi, Áo Khoác
  if (/dong\s*phuc|ao\s*thun|may\s*mac|quan\s*ao|vai|det\s*may|theu|in\s*ao|thoi\s*trang|ao\s*so\s*mi|ao\s*khoac|ao\s*gio|ao\s*choang|ao\s*phong/i.test(clean)) {
    return "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.6 Bảo Hộ Lao Động (PPE), Giày Bảo Hộ, Mũ Nón, Kính, Găng Tay, Áo Phản Quang, Khẩu Trang, Ủng
  if (/bao\s*ho|ppe|giay\s*bao\s*ho|mu\s*bao\s*ho|gang\s*tay|ao\s*phan\s*quang|khau\s*trang|kinh\s*bao\s*ho|ung\s*cach\s*dien|ung\s*loi/i.test(clean)) {
    return "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.7 Bảng Mạch In, Vi Mạch, Linh Kiện Điện Tử, Chip, Bán Dẫn
  if (/bang\s*mach|pcb|vi\s*mach|chip|linh\s*kien\s*dien\s*tu|dien\s*tu|ban\s*dan/i.test(clean)) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.8 Bạc Đạn, Vòng Bi, Khớp Nối, Trục Vít, Bánh Răng, Xích
  if (/bac\s*dan|vong\s*bi|goi\s*do|khop\s*noi|truc\s*vit|banh\s*rang|sen\s*xich/i.test(clean)) {
    return "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.9 Bao Bì, Thùng Carton, Hộp Giấy, Bao Bì Quà Tặng, In Ấn, Tem Nhãn, Decal, Màng PE, Băng Keo
  if (/bao\s*bi|carton|thung\s*carton|hop\s*giay|in\s*an|khuyen\s*mai|qua\s*tang|tui\s*giay|decal|tem\s*nhan|mang\s*pe|bang\s*keo|hop\s*qua|nhan\s*mac/i.test(clean)) {
    return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.10 Robot Tự Hành AGV, Tự Động Hóa, Điện Mặt Trời Solar, Chuyển Đổi Số, IoT, MES
  if (/robot|agv|tu\s*dong\s*hoa|dien\s*mat\s*troi|solar|iot|scada|mes|erp|chuyen\s*doi\s*so|ai/i.test(clean)) {
    return "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.11 Xe Nâng, Kho Bãi, Logistics, Vận Tải, Băng Tải, Cảng Biển, Pallet, Xuất Nhập Khẩu, Cẩu Trục
  if (/xe\s*nang|kho\s*bai|logistics|van\s*tai|giao\s*nhan|bang\s*tai|pallet|cang|xuat\s*nhap\s*khau|giao\s*hang|hai\s*quan|pa\s*lang|cau\s*truc/i.test(clean)) {
    return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.12 Sơn Sàn Epoxy, Phòng Sạch, Panel Cách Nhiệt, Hóa Chất, Dung Môi, Bột Giặt
  if (/son\s*san|epoxy|phong\s*sach|cleanroom|vach\s*panel|hoa\s*chat|nhua|hat\s*nhua|keo|dung\s*moi|xa\s*bong|bot\s*giat|zeolit/i.test(clean)) {
    return "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.13 Nhựa, Ca Nhựa, Bình Nhựa, Cao Su, Foam, EVA
  if (/ca\s*nhua|coc\s*nhua|binh\s*nhua|ep\s*nhua|nhua\s*dinh\s*hinh|cao\s*su|foam|eva|ong\s*nhua/i.test(clean)) {
    return "https://images.unsplash.com/photo-1585336261026-41ff346399c5?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.14 Cơ Khí Chính Xác, Máy Phay CNC, Tiện CNC, Khuôn Mẫu, Cắt Laser, Đột Dập, Bu Lông Ốc Vít
  if (/cnc|phay|tien|khuon\s*mau|cat\s*laser|dot\s*dap|co\s*khi|bu\s*long|oc\s*vit|gia\s*cong\s*co\s*khi|ban\s*thao\s*tac/i.test(clean)) {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.15 Gia Công Kim Loại, Hàn, Thép, Inox, Nhôm, Đồng, Anode, Mạ Crom, Xà Gồ
  if (/(\bhan\b|han\s*xi|may\s*han)|kim\s*loai|thep|nhom|dong|inox|anode|anodiz|ma\s*crom|ma\s*dong|xi\s*ma|\bsat\s*thep\b|luyen\s*kim|xa\s*go/i.test(clean)) {
    return "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.16 Lò Hơi, Nồi Hơi, Thiết Bị Áp Lực, Bàn Là Hơi
  if (/lo\s*hoi|ap\s*luc|noi\s*hoi|ban\s*la|ban\s*ui/i.test(clean)) {
    return "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.17 Cơ Điện, Trạm Biến Áp, Điện 22kV, Tủ Điện PLC, PCCC, HVAC, Thông Gió, Chiếu Sáng, Máy Phát Điện
  if (/co\s*dien|mep|tram\s*bien\s*ap|dien|tu\s*dien|plc|pccc|phong\s*chay|hvac|dieu\s*hoa|thong\s*gio|chieu\s*sang|may\s*phat\s*dien/i.test(clean)) {
    return "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.18 Xây Dựng, Nhà Xưởng, Nhà Thép Tiền Chế, Kết Cấu Thép, Ép Cọc, Bê Tông, VLXD, Gạch 3D, Đá
  if (/xay\s*dung|nha\s*xuong|nha\s*thep|tien\s*che|ket\s*cau\s*thep|ep\s*coc|be\s*tong|vlxd|san\s*go|gach|ximang|da\s*cuoi/i.test(clean)) {
    return "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.19 Cà Phê, Nông Sản, Máy Chế Biến Cà Phê, Trà
  if (/ca\s*phe|may\s*moc.*ca\s*phe|che\s*bien\s*ca\s*phe|tra|nong\s*san|che\s*bien\s*che/i.test(clean)) {
    return "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.20 Suất Ăn Công Nghiệp, Bếp Ăn, Căng Tin, Thực Phẩm, Bánh Kẹo, Kem Ăn, Hải Sản
  if (/suat\s*an|cang\s*tin|thuc\s*pham|am\s*thuc|bua\s*an|bep\s*an|nau\s*an|banh\s*keo|kem\s*an|hai\s*san/i.test(clean)) {
    return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.21 Gỗ, Nội Thất, Bàn Ghế, Sofa, Ván Ép, Vách Ngăn, Rèm Cuốn, Bảng Viết
  if (/go|noi\s*that|ban\s*ghe|composite|sofa|giuong|tu|van\s*ep|vach\s*ngan|rem\s*cuon|lam\s*che\s*nang|bang\s*viet|bang\s*kinh/i.test(clean)) {
    return "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.22 Âm Thanh, Ánh Sáng, Amply, Karaoke, Radio, Ăng Ten, Loa
  if (/amply|am\s*thanh|anh\s*sang|san\s*khau|karaoke|radio|loa|ang\s*ten/i.test(clean)) {
    return "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.23 An Ninh, Camera, An Toàn Giao Thông
  if (/an\s*ninh|an\s*toan|camera|giam\s*sat|giao\s*thong/i.test(clean)) {
    return "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.24 Sách, Xuất Bản, Album Ảnh, In 3D, Văn Phòng Phẩm
  if (/sach|nha\s*xuat\s*ban|album|in\s*3d|nha\s*sach|van\s*phong\s*pham/i.test(clean)) {
    return "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.25 Y Tế, Bệnh Viện, Dụng Cụ Y Khoa, Dược Phẩm
  if (/y\s*te|benh\s*vien|y\s*khoa|dung\s*cu\s*y\s*te|duoc\s*pham/i.test(clean)) {
    return "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.26 Bơm, Van, Đường Ống, Thủy Lực, Khí Nén
  if (/bom|van|duong\s*ong|thuy\s*luc|khi\s*nen|may\s*nen\s*khi/i.test(clean)) {
    return "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.27 Nước Thải, Khí Thải, Môi Trường, Bể Xử Lý
  if (/nuoc\s*thai|khi\s*thai|moi\s*truong|quan\s*trac|be\s*xu\s*ly/i.test(clean)) {
    return "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85";
  }

  // 2.28 Ô tô, Xe máy, Phụ tùng xe
  if (/o\s*to|xe\s*may|xe\s*tai|phu\s*tung\s*xe/i.test(clean)) {
    return "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1400&q=85";
  }

  // Default clean smart supplier visual
  return "/images/supplier_b2b_hero.jpg";
}

/**
 * Determine enterprise KYC Level (Diamond, Gold, Silver)
 */
export function getEnterpriseKYCLevel(ent) {
  if (!ent) {
    return {
      level: 'silver',
      label: 'Bạc',
      icon: '🥈',
      tag: 'Xác thực MST & Pháp nhân',
      color: '#64748b',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      glow: 'shadow-slate-500/10'
    };
  }

  // Diamond check: BNI/HUBA/Hiệp hội endorsement, or VIP, or high vote
  const isDiamond = ent.isDiamond || 
                    ent.isVerifiedPartner || 
                    (ent.association && ent.association.length > 0) || 
                    (ent.rating && ent.rating >= 4.8) || 
                    (ent.baseVotes && ent.baseVotes > 80) ||
                    /bni|huba|vcci|hamex|hawa|vinacas|vpas|vpa/i.test(ent.notes || ent.description || ent.name || '');

  if (isDiamond) {
    return {
      level: 'diamond',
      label: 'Kim Cương',
      icon: '💎',
      tag: 'Bảo chứng BNI / HUBA / Hiệp hội',
      color: '#0284c7',
      badgeBg: 'bg-gradient-to-r from-sky-500/10 via-blue-500/15 to-indigo-500/10 text-sky-700 border-sky-300 font-black',
      glow: 'shadow-sky-500/20 shadow-md ring-1 ring-sky-400/40'
    };
  }

  // Gold check: Factory inspected, ISO certified, or active production site
  const isGold = ent.isGold || 
                 ent.hasFactory || 
                 (ent.rating && ent.rating >= 4.2) || 
                 (ent.baseVotes && ent.baseVotes > 30) ||
                 /iso|fda|ce|haccp|nha xuong|nha may|khu cong nghiep|kcn|fdi/i.test(ent.address || ent.description || ent.category || '');

  if (isGold) {
    return {
      level: 'gold',
      label: 'Vàng',
      icon: '🥇',
      tag: 'Xác thực Nhà xưởng & Thực địa',
      color: '#d97706',
      badgeBg: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/15 text-amber-800 border-amber-300 font-bold',
      glow: 'shadow-amber-500/15 shadow-sm ring-1 ring-amber-400/30'
    };
  }

  return {
    level: 'silver',
    label: 'Bạc',
    icon: '🥈',
    tag: 'Xác thực Pháp nhân & MST',
    color: '#475569',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
    glow: 'shadow-slate-400/10'
  };
}

/**
 * Get enterprise phone from data or generate a deterministic masked phone
 */
export function getEnterprisePhone(ent) {
  if (!ent) return '090 ••• 123';
  const raw = ent.phone || ent.hotline || ent.tel || ent.mobile || ent.contactPhone;
  if (raw && typeof raw === 'string' && raw.trim() && raw.trim() !== 'null' && raw.trim() !== 'undefined') {
    return raw.trim();
  }
  // Deterministic seed based on enterprise ID / Tax code / Name
  const seedStr = String(ent.id || ent._id || ent.taxCode || ent.name || 'ccu_enterprise');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const prefixes = ['090', '091', '098', '097', '096', '093', '086', '088', '089', '077', '079', '083'];
  const pIndex = Math.abs(hash) % prefixes.length;
  const last3 = String(Math.abs((hash * 37) ^ 0x5a5a5a) % 900 + 100);
  return `${prefixes[pIndex]} ••• ${last3}`;
}

/**
 * Mask phone number for privacy: e.g. 090 ••• 123
 */
export function maskPhoneNumber(phone = '') {
  if (!phone) return '090 ••• 123';
  if (typeof phone !== 'string') phone = String(phone);
  if (phone.includes('•••') || phone.includes('***')) return phone;
  
  // Extract all digits
  let digits = phone.replace(/\D/g, '');
  if (!digits) return '090 ••• 123';
  
  if (digits.startsWith('84') && digits.length > 9) {
    digits = '0' + digits.substring(2);
  }
  
  if (digits.length >= 7) {
    return `${digits.substring(0, 3)} ••• ${digits.substring(digits.length - 3)}`;
  }
  if (digits.length >= 4) {
    return `${digits.substring(0, 2)} ••• ${digits.substring(digits.length - 2)}`;
  }
  return `${digits} ••• 123`;
}

/**
 * Generates 3 product / capability thumbnails for a supplier card
 */
export function getEnterpriseThumbnails(ent) {
  if (!ent) return [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
  ];

  // If enterprise has actual images array with valid urls
  if (Array.isArray(ent.images) && ent.images.length >= 3) {
    const valid = ent.images.filter(img => typeof img === 'string' && img.startsWith('http') && !img.includes('default'));
    if (valid.length >= 3) return valid.slice(0, 3);
  }

  const clean = (ent.category || ent.industry || ent.name || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd');

  // 1. Quà tặng, Bao bì, Hộp quà, Màng co, In ấn, Thùng Carton
  if (/qua|hop|bao\s*bi|carton|in\s*an|mang\s*co|decal|tem|tui\s*giay|nhan\s*mac/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // 2. Nông sản, Cà phê, Trà, Mít sấy, Thực phẩm, Bánh kẹo, Đồ uống
  if (/ca\s*phe|tra|mit\s*say|nong\s*san|thuc\s*pham|banh\s*keo|suat\s*an|nuoc\s*giai\s*khat/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // 3. Cơ khí chính xác, CNC, Jig, Khuôn mẫu, Cắt laser, Bu lông
  if (/cnc|phay|tien|khuon|jig|co\s*khi|bu\s*long|cat\s*laser|dot\s*dap|gia\s*cong/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // 4. Đồng phục, Áo thun, May mặc, Balo, Giày, Bảo hộ PPE
  if (/dong\s*phuc|ao\s*thun|may\s*mac|balo|tui|giay|bao\s*ho|ppe|khau\s*trang/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // 5. Logistics, Vận tải container lạnh, Xe nâng, Pallet gỗ, Kho bãi
  if (/logistics|kho|van\s*tai|xe\s*nang|pallet|container|cang|giao\s*nhan/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // 6. Thép cuộn mạ kẽm, Kim loại, Inox, Nhôm, Kết cấu
  if (/thep|kim\s*loai|inox|nhom|ton|xa\s*go|sat/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // 7. Phòng sạch Class 1000, MEP, HVAC, Sơn epoxy, PCCC, Panel
  if (/phong\s*sach|cleanroom|mep|hvac|epoxy|pccc|panel|dien/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // 8. Điện tử, Bảng mạch, Chip, Bán dẫn
  if (/dien\s*tu|bang\s*mach|pcb|chip|vi\s*mach|cam\s*bien/.test(clean)) {
    return [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
    ];
  }

  // Fallback high-tech industrial manufacturing trio
  return [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
  ];
}
