import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/suppliers150k.db');

let db = null;
let stmtFindById = null;
let stmtFindBySourceId = null;
let stmtFindBySlug = null;
let stmtFindBySlugLike = null;
let stmtCount = null;

function initDb() {
  if (db) return db;
  if (!fs.existsSync(dbPath)) return null;
  try {
    db = new DatabaseSync(dbPath, { readOnly: true });
    stmtFindById = db.prepare('SELECT * FROM suppliers WHERE id = ? LIMIT 1');
    stmtFindBySourceId = db.prepare('SELECT * FROM suppliers WHERE source_id = ? LIMIT 1');
    stmtFindBySlug = db.prepare('SELECT * FROM suppliers WHERE slug = ? LIMIT 1');
    stmtFindBySlugLike = db.prepare('SELECT * FROM suppliers WHERE slug LIKE ? LIMIT 1');
    stmtCount = db.prepare('SELECT COUNT(*) as total FROM suppliers');
    return db;
  } catch (err) {
    console.warn('Không thể mở SQLite 150k suppliers:', err.message);
    return null;
  }
}

export function inferPhase(cat = '', name = '') {
  const text = (cat + ' ' + name).toLowerCase();
  if (/bảo hộ|áo phao|đồng phục|giày bảo hộ|phao|mũ bảo hộ|găng tay|khẩu trang|ppe/i.test(text)) {
    return { phase: '5.3', stage: 5 };
  }
  if (/máy móc|dây chuyền|thiết bị công nghiệp|chế tạo máy|máy nén|cẩu trục/i.test(text)) {
    return { phase: '3.1', stage: 3 };
  }
  if (/xây dựng|nhà thép|kết cấu|nhà xưởng|thi công|san lấp|bê tông/i.test(text)) {
    return { phase: '2.2', stage: 2 };
  }
  if (/pccc|phòng cháy|cơ điện|biến áp|chiếu sáng|mep|hvac|thông gió/i.test(text)) {
    return { phase: '2.3', stage: 2 };
  }
  if (/hóa chất|nguyên liệu|kim loại|thép|nhôm|nhựa|bao bì|carton|vật liệu/i.test(text)) {
    return { phase: '4.1', stage: 4 };
  }
  if (/gia công|cơ khí|khuôn mẫu|tiện|phay|cnc|đúc|hàn/i.test(text)) {
    return { phase: '4.2', stage: 4 };
  }
  if (/vận tải|logistics|kho bãi|giao nhận|xe nâng|pallet|container/i.test(text)) {
    return { phase: '4.3', stage: 4 };
  }
  if (/suất ăn|thực phẩm|nước uống|quà tặng/i.test(text)) {
    return { phase: '5.2', stage: 5 };
  }
  if (/lao động|tuyển dụng|nhân lực|đào tạo/i.test(text)) {
    return { phase: '5.1', stage: 5 };
  }
  if (/khu công nghiệp|bất động sản|thuê đất|cho thuê xưởng/i.test(text)) {
    return { phase: '1.3', stage: 1 };
  }
  if (/năng lượng|mặt trời|xanh|môi trường|xử lý nước thải|rác thải/i.test(text)) {
    return { phase: '6.2', stage: 6 };
  }
  if (/phần mềm|tự động hóa|robot|chuyển đổi số|iot|camera/i.test(text)) {
    return { phase: '6.1', stage: 6 };
  }
  return { phase: '4.1', stage: 4 };
}

export function maskMediaUrl(url) {
  if (!url || typeof url !== 'string') return url || '';
  const host = Buffer.from('dHJhbmd2YW5ndmlldG5hbS5jb20=', 'base64').toString('utf8');
  const pattern = new RegExp(`^https?:\\/\\/(products|pic|logo|img)\\.${host.replace('.', '\\.')}\\/(.+)$`, 'i');
  const match = url.trim().match(pattern);
  if (!match) return url;
  const subdomain = match[1].toLowerCase();
  const rawPath = match[2];
  return `/api/media/${subdomain}/${rawPath}`;
}

export function sanitizeText(str) {
  if (!str || typeof str !== 'string') return str || '';
  const host = Buffer.from('dHJhbmd2YW5ndmlldG5hbS5jb20=', 'base64').toString('utf8');
  const domainPattern = new RegExp(host.replace('.', '\\.'), 'gi');
  return str
    .replace(domainPattern, 'chuoicungung.com')
    .replace(/trang\s*vàng\s*(việt\s*nam)?/gi, 'Chuỗi Cung Ứng')
    .replace(/trangvang/gi, 'Chuỗi Cung Ứng');
}

export function normalize150kSupplier(row) {
  if (!row) return null;
  const d = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || row);
  const cat = sanitizeText(d.category || row.category || d.categories?.[0]?.name || 'Chuỗi Cung Ứng');
  const name = d.name || row.name || '';
  const phaseInfo = inferPhase(cat, name);
  const cleanName = name.replace(/^(công ty|cty|doanh nghiệp|dntn|hợp tác xã|htx|chi nhánh|vpđd)\s+(tnhh|cổ phần|cp|mtv)?\s*/i, '').trim();
  const phaseLetter = (cleanName[0] || name[0] || 'A').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D');

  const products = Array.isArray(d.products) && d.products.length 
    ? d.products.map(p => sanitizeText(p)) 
    : (Array.isArray(d.keywords) && d.keywords.length ? d.keywords.map(k => sanitizeText(k)) : []);

  const phone = d.phone || d.hotline || (Array.isArray(d.phones) ? d.phones[0] : '') || '';
  const phones = Array.isArray(d.phones) && d.phones.length ? d.phones : (phone ? [phone] : []);
  const email = d.email || (Array.isArray(d.emails) ? d.emails[0] : '') || '';
  const emails = Array.isArray(d.emails) && d.emails.length ? d.emails : (email ? [email] : []);
  const website = d.website || (Array.isArray(d.websites) ? d.websites[0] : '') || '';
  const websites = Array.isArray(d.websites) && d.websites.length ? d.websites : (website ? [website] : []);
  
  const rawImages = Array.isArray(d.images) ? d.images : [];
  const images = rawImages.map(maskMediaUrl).filter(Boolean);
  const logo = maskMediaUrl(d.logo || rawImages[0] || '');
  const avatar = maskMediaUrl(d.avatar || logo);

  const cleanCategories = (Array.isArray(d.categories) && d.categories.length ? d.categories : [{ name: cat }])
    .map(c => ({ id: c.id, name: sanitizeText(c.name) }));

  const copy = { ...d };
  delete copy.sourceUrl;
  delete copy.source_url;

  const rawId = d.id || row.id || '';
  const cleanSupplierId = String(rawId).replace(/^tv-/, 'ncc-');

  return {
    ...copy,
    id: cleanSupplierId,
    slug: d.slug || row.slug,
    sourceId: d.sourceId || row.source_id,
    sourceUrl: '',
    name,
    shortName: d.shortName || cleanName.split(/\s+-\s+|\s+–\s+/)[0] || cleanName,
    cleanName,
    phaseLetter,
    category: cat,
    industry: d.industry || cat,
    categories: cleanCategories,
    province: d.province || row.province || 'Toàn quốc',
    address: d.address || '',
    branches: d.branches || '',
    taxCode: d.taxCode || '',
    phone,
    phones,
    hotline: d.hotline || phone,
    email,
    emails,
    website,
    websites,
    businessType: d.businessType || 'Nhà sản xuất / Cung ứng',
    establishedYear: d.establishedYear || '',
    employees: d.employees || '',
    mainMarkets: d.mainMarkets || 'Toàn quốc',
    mainCustomers: d.mainCustomers || '',
    description: sanitizeText(d.description || ''),
    productGroups: Array.isArray(d.productGroups) ? d.productGroups.map(pg => sanitizeText(pg)) : [],
    keywords: Array.isArray(d.keywords) ? d.keywords.map(k => sanitizeText(k)) : [],
    products,
    images,
    imageCaptions: Array.isArray(d.imageCaptions) ? d.imageCaptions.map(c => sanitizeText(c)) : [],
    logo,
    avatar,
    phases: Array.isArray(d.phases) && d.phases.length ? d.phases : [phaseInfo.phase],
    stages: Array.isArray(d.stages) && d.stages.length ? d.stages : [phaseInfo.stage],
    stage: d.stage || phaseInfo.stage,
    kycStatus: d.kycStatus || 'verified',
    verificationLevel: d.verificationLevel || 'Doanh nghiệp đã xác thực'
  };
}

export function count150kSuppliers() {
  const database = initDb();
  if (!database) return 0;
  try {
    const row = stmtCount.get();
    return row?.total || 0;
  } catch {
    return 0;
  }
}

export function find150kSupplier(idOrSlug) {
  const database = initDb();
  if (!database || !idOrSlug) return null;

  const raw = String(idOrSlug).trim();
  const normalized = raw.toLowerCase();

  try {
    // 1. Direct ID match
    let row = stmtFindById.get(raw) || stmtFindById.get(normalized);
    if (row) return normalize150kSupplier(row);

    // 2. Direct SourceID match
    const cleanId = raw.replace(/^(ncc|tv)-/, '');
    row = stmtFindBySourceId.get(cleanId);
    if (row) return normalize150kSupplier(row);

    // 3. Exact Slug match
    row = stmtFindBySlug.get(normalized);
    if (row) return normalize150kSupplier(row);

    // 4. Slug with triple dash or single dash variation
    const singleDashSlug = normalized.replace(/---+/g, '-');
    row = stmtFindBySlug.get(singleDashSlug);
    if (row) return normalize150kSupplier(row);

    // 5. Slug like search
    row = stmtFindBySlugLike.get(`%${singleDashSlug}%`);
    if (row) return normalize150kSupplier(row);

    return null;
  } catch (err) {
    console.warn('Lỗi truy vấn supplier từ SQLite:', err.message);
    return null;
  }
}

export function search150kSuppliers({ 
  query = '', 
  province = '', 
  category = '', 
  letter = '',
  stage = '',
  phase = '',
  limit = 24, 
  offset = 0 
} = {}) {
  const database = initDb();
  if (!database) return { total: 0, rows: [] };

  try {
    const conditions = [];
    const params = [];

    if (query && query.trim()) {
      conditions.push('(name LIKE ? OR category LIKE ?)');
      params.push(`%${query.trim()}%`, `%${query.trim()}%`);
    }

    if (province && province !== 'Toàn quốc' && province.trim()) {
      conditions.push('province LIKE ?');
      params.push(`%${province.trim()}%`);
    }

    if (category && category !== 'all' && category.trim()) {
      conditions.push('category LIKE ?');
      params.push(`%${category.trim()}%`);
    }

    if (letter && letter !== 'TẤT CẢ' && letter.trim()) {
      const L = letter.trim().toUpperCase();
      conditions.push('(name LIKE ? OR name LIKE ? OR name LIKE ? OR name LIKE ? OR category LIKE ?)');
      params.push(`${L}%`, `Công Ty % ${L}%`, `Công Ty TNHH % ${L}%`, `Công Ty Cổ Phần % ${L}%`, `${L}%`);
    }

    if (stage && stage !== 'all') {
      const stageKeywordsMap = {
        '1': ['%Quy Hoạch%', '%Khảo Sát%', '%Đo Đạc%', '%Khu Công Nghiệp%', '%Bất Động Sản%', '%Tư Vấn Đầu Tư%'],
        '2': ['%Xây Dựng%', '%Thi Công%', '%Nhà Xưởng%', '%Kết Cấu%', '%Cơ Điện%', '%PCCC%', '%Phòng Cháy%', '%Chiếu Sáng%'],
        '3': ['%Máy Móc%', '%Dây Chuyền%', '%Thiết Bị%', '%Lắp Đặt%', '%Điện Lạnh%', '%Phòng Sạch%', '%Tự Động Hóa%'],
        '4': ['%Nguyên Liệu%', '%Vật Liệu%', '%Hóa Chất%', '%Kim Loại%', '%Thép%', '%Cơ Khí%', '%Gia Công%', '%Bao Bì%', '%Carton%', '%Pallet%', '%Vận Tải%', '%Logistics%', '%Kho Bãi%'],
        '5': ['%Bảo Hộ%', '%Đồng Phục%', '%Suất Ăn%', '%Tuyển Dụng%', '%Lao Động%', '%Nhân Lực%', '%Quà Tặng%'],
        '6': ['%Năng Lượng%', '%Mặt Trời%', '%Môi Trường%', '%Xử Lý Nước%', '%Robot%', '%Phần Mềm%', '%Chuyển Đổi Số%']
      };
      const kws = stageKeywordsMap[String(stage)];
      if (kws) {
        const stageOr = kws.map(() => '(category LIKE ? OR name LIKE ?)').join(' OR ');
        conditions.push(`(${stageOr})`);
        params.push(...kws.flatMap(k => [k, k]));
      }
    }

    if (phase && phase !== 'all') {
      const phaseKeywordsMap = {
        '1.1': ['%Khảo Sát%', '%Địa Chất%', '%Đo Đạc%', '%FS%'],
        '1.2': ['%Pháp Lý%', '%Giấy Phép%', '%ĐTM%', '%Tư Vấn Luật%'],
        '1.3': ['%Khu Công Nghiệp%', '%Đất KCN%', '%Thuê Xưởng%', '%Bất Động Sản Công Nghiệp%'],
        '2.1': ['%Thiết Kế%', '%Quy Hoạch%', '%BIM%', '%Kiến Trúc%'],
        '2.2': ['%Xây Dựng%', '%Thi Công%', '%Nhà Xưởng%', '%Kết Cấu Thép%', '%Nhà Thép%', '%Bê Tông%'],
        '2.3': ['%PCCC%', '%Phòng Cháy%', '%Cơ Điện%', '%Biến Áp%', '%Hạ Tầng%', '%HVAC%'],
        '3.1': ['%Máy Móc%', '%Dây Chuyền%', '%Thiết Bị Công Nghiệp%', '%Cẩu Trục%', '%Chế Tạo Máy%'],
        '3.2': ['%Điện Lạnh%', '%Kho Lạnh%', '%Phòng Sạch%', '%Tự Động Hóa%', '%PLC%'],
        '3.3': ['%Hiệu Chuẩn%', '%Kiểm Định%', '%Đo Lường%', '%Nghiệm Thu%'],
        '4.1': ['%Nguyên Liệu%', '%Vật Liệu%', '%Hóa Chất%', '%Thép%', '%Kim Loại%', '%Nhựa%', '%Bao Bì%', '%Carton%'],
        '4.2': ['%Gia Công%', '%Cơ Khí%', '%Tiện%', '%Phay%', '%CNC%', '%Khuôn Mẫu%', '%Ốc Vít%'],
        '4.3': ['%Bảo Trì%', '%Bảo Dưỡng%', '%Vận Tải%', '%Logistics%', '%Kho Bãi%', '%Xe Nâng%', '%Pallet%'],
        '5.1': ['%Tuyển Dụng%', '%Lao Động%', '%Nhân Lực%', '%Đào Tạo Nghề%'],
        '5.2': ['%Suất Ăn%', '%Bếp Ăn%', '%Thực Phẩm Công Nghiệp%', '%Quà Tặng%'],
        '5.3': ['%Đồng Phục%', '%Bảo Hộ%', '%PPE%', '%Áo Phao%', '%Giày Bảo Hộ%', '%Găng Tay%'],
        '6.1': ['%Phần Mềm%', '%ERP%', '%MES%', '%Chuyển Đổi Số%', '%Smart Factory%'],
        '6.2': ['%Năng Lượng Mặt Trời%', '%Điện Áp Mái%', '%ESG%', '%Xử Lý Nước Thải%'],
        '6.3': ['%Robot%', '%AGV%', '%Tự Động Hóa Kho%', '%Mở Rộng Nhà Máy%']
      };
      const pkws = phaseKeywordsMap[String(phase)];
      if (pkws) {
        const phaseOr = pkws.map(() => '(category LIKE ? OR name LIKE ?)').join(' OR ');
        conditions.push(`(${phaseOr})`);
        params.push(...pkws.flatMap(k => [k, k]));
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM suppliers ${whereClause} LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM suppliers ${whereClause}`;

    const totalRow = database.prepare(countSql).get(...params);
    const rows = database.prepare(sql).all(...params, limit, offset);

    return {
      total: totalRow?.total || 0,
      rows: rows.map(normalize150kSupplier)
    };
  } catch (err) {
    console.warn('Lỗi tìm kiếm 150k suppliers:', err.message);
    return { total: 0, rows: [] };
  }
}
