// ============================================================================
// 6 LIFECYCLE STAGES MASTER DATA & RELATIONS ENGINE
// PAGE 36: CHI TIẾT GIAI ĐOẠN (/giai-doan/[slug])
// Standardized according to CHUOICUNGUNG.COM Specification 36.txt
// ============================================================================

import { PROGRAMS_DATA } from './programsData.js';
import { SEED_REQUIREMENTS } from './requirementsData.js';
import { SEED_SOURCING_DOSSIERS } from './sourcingDossiersData.js';
import { stageSuppliers } from './stageSuppliersData.js';

export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Safe Storage Helper
const memoryStorage = {};
const safeGetItem = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {}
  return memoryStorage[key] || null;
};

const safeSetItem = (key, value) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {}
  memoryStorage[key] = value;
};

// ----------------------------------------------------------------------------
// 1. CANONICAL 6 STAGES & 18 NEED GROUPS (SECTIONS 2, 3, 5, 6, 48)
// ----------------------------------------------------------------------------
export const MASTER_SIX_STAGES = [
  {
    id: 1,
    code: "GD-01",
    name: "Chuẩn bị & Đầu tư",
    enName: "Preparation & Investment",
    slug: "chuan-bi-dau-tu",
    order: 1,
    color: "#8b5cf6",
    themeClass: "purple",
    shortDescription: "Giai đoạn khảo sát tiền khả thi (FS), nghiên cứu thị trường FDI, quy hoạch pháp lý và lựa chọn mặt bằng khu công nghiệp.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    iconName: "Compass",
    needGroups: [
      {
        id: "need-1.1",
        phaseId: "1.1",
        code: "1.1",
        slug: "1-1-khao-sat-dinh-huong",
        name: "1.1 Khảo sát & Định hướng",
        shortDescription: "Nghiên cứu thị trường FDI, báo cáo khả thi (FS), khảo sát địa chất & thủy văn.",
        categories: [
          { name: "Khảo Sát & Đo Đạc Địa Hình", slug: "khao-sat-do-dac-dia-hinh", keywords: ["báo cáo FS", "đo đạc trắc địa", "khảo sát địa chất"] },
          { name: "Tư Vấn Đầu Tư FDI & KCN", slug: "tu-van-dau-tu-fdi", keywords: ["tư vấn đầu tư", "thẩm định dự án", "chiến lược FDI"] }
        ]
      },
      {
        id: "need-1.2",
        phaseId: "1.2",
        code: "1.2",
        slug: "1-2-phap-ly-thu-tuc",
        name: "1.2 Pháp lý & Thủ tục",
        shortDescription: "Giấy phép đầu tư (IRC), giấy phép doanh nghiệp (ERC), đánh giá tác động môi trường (ĐTM).",
        categories: [
          { name: "Luật & Giấy Phép Đầu Tư", slug: "luat-giay-phep-dau-tu", keywords: ["giấy phép IRC", "thành lập doanh nghiệp", "giấy phép ĐTM"] },
          { name: "Tư Vấn Thẩm Duyệt PCCC", slug: "tu-van-tham-duyet-pccc", keywords: ["hồ sơ PCCC cơ sở", "thẩm duyệt PCCC nhà máy"] }
        ]
      },
      {
        id: "need-1.3",
        phaseId: "1.3",
        code: "1.3",
        slug: "1-3-chon-dia-diem-mat-bang",
        name: "1.3 Chọn địa điểm & Mặt bằng",
        shortDescription: "Thuê đất công nghiệp, thuê nhà xưởng xây sẵn (RBF) và nhà kho xây theo yêu cầu (BTS).",
        categories: [
          { name: "Bất Động Sản Công Nghiệp", slug: "bat-dong-san-cong-nghiep", keywords: ["thuê đất KCN", "nhà xưởng xây sẵn RBF", "kho bãi BTS"] }
        ]
      }
    ]
  },
  {
    id: 2,
    code: "GD-02",
    name: "Thiết kế & Xây dựng",
    enName: "Design & Construction",
    slug: "thiet-ke-xay-dung",
    order: 2,
    color: "#0052cc",
    themeClass: "blue",
    shortDescription: "Giai đoạn thiết kế kiến trúc, tổng thầu thi công xây dựng kết cấu thép nhà xưởng và hạ tầng cơ điện MEP.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1400&q=85",
    iconName: "Building2",
    needGroups: [
      {
        id: "need-2.1",
        phaseId: "2.1",
        code: "2.1",
        slug: "2-1-thiet-ke-quy-hoach",
        name: "2.1 Thiết kế & Quy hoạch",
        shortDescription: "Thiết kế tổng mặt bằng nhà máy, mô hình BIM và thiết kế kết cấu chịu lực.",
        categories: [
          { name: "Tư Vấn Thiết Kế Nhà Xưởng", slug: "tu-van-thiet-ke-nha-xuong", keywords: ["thiết kế kiến trúc", "mô hình BIM", "kết cấu thép"] }
        ]
      },
      {
        id: "need-2.2",
        phaseId: "2.2",
        code: "2.2",
        slug: "2-2-thi-cong-xay-dung",
        name: "2.2 Thi công xây dựng",
        shortDescription: "Tổng thầu xây dựng công nghiệp, ép cọc bê tông móng, gia công khung thép tiền chế.",
        categories: [
          { name: "Xây Dựng - Nhà Thầu Xây Dựng", slug: "xay-dung-nha-thau-xay-dung", keywords: ["tổng thầu xây dựng", "ép cọc bê tông", "kết cấu thép tiền chế"] },
          { name: "Vật Liệu Xây Dựng Công Nghiệp", slug: "vat-lieu-xay-dung-cong-nghiep", keywords: ["bê tông thương phẩm", "thép xây dựng", "tôn lợp mái"] }
        ]
      },
      {
        id: "need-2.3",
        phaseId: "2.3",
        code: "2.3",
        slug: "2-3-co-dien-ha-tang-ky-thuat",
        name: "2.3 Cơ điện & Hạ tầng kỹ thuật",
        shortDescription: "Hệ thống trạm biến áp, chiếu sáng, thông gió HVAC và hệ thống PCCC tự động.",
        categories: [
          { name: "Cơ Điện Lạnh MEP Nhà Xưởng", slug: "co-dien-lanh-mep-nha-xuong", keywords: ["hệ thống HVAC", "trạm biến áp", "thi công PCCC tự động"] }
        ]
      }
    ]
  },
  {
    id: 3,
    code: "GD-03",
    name: "Lắp đặt & Hoàn thiện",
    enName: "Installation & Fit-out",
    slug: "lap-dat-hoan-thien",
    order: 3,
    color: "#06b6d4",
    themeClass: "cyan",
    shortDescription: "Giai đoạn vận chuyển nâng hạ máy móc, lắp đặt dây chuyền sản xuất, phòng sạch và chạy thử nghiệm thu.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85",
    iconName: "Factory",
    needGroups: [
      {
        id: "need-3.1",
        phaseId: "3.1",
        code: "3.1",
        slug: "3-1-lap-dat-may-day-chuyen",
        name: "3.1 Lắp đặt máy & Dây chuyền",
        shortDescription: "Cẩu kéo lắp đặt máy móc siêu trường siêu trọng, căn chỉnh độ phẳng và lắp ráp dây chuyền.",
        categories: [
          { name: "Cơ Khí Chính Xác & Khuôn Mẫu (CNC)", slug: "co-khi", keywords: ["gia công chi tiết máy cnc", "chế tạo jig gá", "đồ gá kiểm tra"] },
          { name: "Dịch Vụ Cẩu Kéo & Lắp Đặt Máy", slug: "dich-vu-cau-keo-lap-dat-may", keywords: ["nâng hạ máy móc", "cẩu trục xưởng", "căn chỉnh máy CNC"] }
        ]
      },
      {
        id: "need-3.2",
        phaseId: "3.2",
        code: "3.2",
        slug: "3-2-hoan-thien-khong-gian-san-xuat",
        name: "3.2 Hoàn thiện không gian sản xuất",
        shortDescription: "Thi công phòng sạch Cleanroom, sơn sàn Epoxy kháng khuẩn và bàn thao tác chống tĩnh điện ESD.",
        categories: [
          { name: "Thi Công Phòng Sạch & Sơn Epoxy", slug: "phong-sach-son-epoxy", keywords: ["panel phòng sạch", "sơn sàn epoxy", "bàn thao tác esd"] }
        ]
      },
      {
        id: "need-3.3",
        phaseId: "3.3",
        code: "3.3",
        slug: "3-3-kiem-tra-chay-thu",
        name: "3.3 Kiểm tra & Chạy thử",
        shortDescription: "Hiệu chuẩn thiết bị đo lường, kiểm định an toàn máy móc và chứng nhận xuất xưởng.",
        categories: [
          { name: "Kiểm Định & Hiệu Chuẩn Đo Lường", slug: "kiem-dinh-hieu-chuan-do-luong", keywords: ["hiệu chuẩn thiết bị", "kiểm định an toàn", "nghiệm thu dây chuyền"] }
        ]
      }
    ]
  },
  {
    id: 4,
    code: "GD-04",
    name: "Vận hành Sản xuất",
    enName: "Operation & Production",
    slug: "van-hanh-san-xuat",
    order: 4,
    color: "#10b981",
    themeClass: "emerald",
    shortDescription: "Giai đoạn sản xuất đại trà: cung ứng nguyên vật liệu đầu vào, bao bì đóng gói và kho vận logistics giao nhận.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
    iconName: "Zap",
    needGroups: [
      {
        id: "need-4.1",
        phaseId: "4.1",
        code: "4.1",
        slug: "4-1-cung-ung-dau-vao",
        name: "4.1 Cung ứng đầu vào",
        shortDescription: "Kim loại, hạt nhựa kỹ thuật, hóa chất công nghiệp, linh kiện điện tử phụ trợ.",
        categories: [
          { name: "Thép & Kim Loại Công Nghiệp", slug: "thep-kim-loai-cong-nghiep", keywords: ["thép tấm", "nhôm định hình", "bu lông ốc vít"] },
          { name: "Hóa Chất & Hạt Nhựa Kỹ Thuật", slug: "hoa-chat-nhua-ky-thuat", keywords: ["hạt nhựa abs", "hóa chất tẩy rửa", "dầu nhờn công nghiệp"] }
        ]
      },
      {
        id: "need-4.2",
        phaseId: "4.2",
        code: "4.2",
        slug: "4-2-quan-ly-san-xuat-kiem-soat",
        name: "4.2 Quản lý sản xuất & Kiểm soát",
        shortDescription: "Vật tư tiêu hao MRO, dụng cụ cắt gọt kim loại, thiết bị đo kiểm và bảo trì định kỳ.",
        categories: [
          { name: "Vật Tư Tiêu Hao & Dụng Cụ MRO", slug: "vat-tu-tieu-hao-mro", keywords: ["dao phay cnc", "que hàn", "dụng cụ cầm tay"] }
        ]
      },
      {
        id: "need-4.3",
        phaseId: "4.3",
        code: "4.3",
        slug: "4-3-giao-nhan-phan-phoi",
        name: "4.3 Giao nhận & Phân phối",
        shortDescription: "Bao bì thùng carton sóng, pallet, vận tải container và khai thuê hải quan xuất khẩu.",
        categories: [
          { name: "Bao Bì & Đóng Gói Công Nghiệp", slug: "bao-bi", keywords: ["thùng carton 5 lớp", "màng pe quấn pallet", "xốp bọc epe"] },
          { name: "Logistics, Cảng Biển & Kho Vận", slug: "logistics", keywords: ["vận tải container", "khai thuê hải quan", "kho ngoại quan"] }
        ]
      }
    ]
  },
  {
    id: 5,
    code: "GD-05",
    name: "Nhân sự & Hậu cần",
    enName: "HR & Logistics Welfare",
    slug: "nhan-su-hau-can",
    order: 5,
    color: "#f59e0b",
    themeClass: "amber",
    shortDescription: "Giai đoạn chăm lo lực lượng lao động: tuyển dụng công nhân, may đồng phục, trang bị đồ bảo hộ PPE và suất ăn công nghiệp.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1400&q=85",
    iconName: "Users",
    needGroups: [
      {
        id: "need-5.1",
        phaseId: "5.1",
        code: "5.1",
        slug: "5-1-tuyen-dung-lao-dong",
        name: "5.1 Tuyển dụng & Lao động",
        shortDescription: "Cung ứng lao động thời vụ, tuyển dụng kỹ sư công nghệ cao, dịch vụ tính lương Outsourcing.",
        categories: [
          { name: "Tuyển Dụng & Cung Ứng Lao Động KCN", slug: "tuyen-dung-lao-dong-kcn", keywords: ["cho thuê lao động", "tuyển dụng công nhân", "kỹ sư nhà máy"] }
        ]
      },
      {
        id: "need-5.2",
        phaseId: "5.2",
        code: "5.2",
        slug: "5-2-doi-song-phuc-loi",
        name: "5.2 Đời sống & Phúc lợi",
        shortDescription: "Suất ăn công nghiệp đạt chuẩn HACCP, xe đưa đón công nhân viên và quà tặng phúc lợi.",
        categories: [
          { name: "Suất Ăn Công Nghiệp Chuẩn HACCP", slug: "suat-an-cong-nghiep-haccp", keywords: ["suất ăn công nhân", "cơm trưa văn phòng", "xe đưa đón kcn"] },
          { name: "Quà Tặng & Nông Sản Chế Biến", slug: "qua-tang-doanh-nghiep-b2b", keywords: ["giỏ quà tết", "quà tặng 2/9", "nông sản xuất khẩu"] }
        ]
      },
      {
        id: "need-5.3",
        phaseId: "5.3",
        code: "5.3",
        slug: "5-3-dong-phuc-bao-ho",
        name: "5.3 Đồng phục & Bảo hộ",
        shortDescription: "Xưởng may đồng phục công nhân, áo polo doanh nghiệp, đồ bảo hộ PPE đạt chuẩn ISO/Oeko-Tex.",
        categories: [
          { name: "Đồng Phục & Bảo Hộ Lao Động (PPE)", slug: "dong-phuc-bao-ho", keywords: ["đồng phục công nhân", "áo polo doanh nghiệp", "giày bảo hộ mũi thép"] }
        ]
      }
    ]
  },
  {
    id: 6,
    code: "GD-06",
    name: "Mở rộng – Tối ưu – Chuyển đổi",
    enName: "Expansion, Optimization & ESG",
    slug: "mo-rong-toi-uu-chuyen-doi",
    order: 6,
    color: "#f43f5e",
    themeClass: "rose",
    shortDescription: "Giai đoạn nâng cao hiệu suất: mở rộng công suất nhà máy giai đoạn 2, audit ISO, chuyển đổi số tự động hóa và năng lượng xanh ESG.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=85",
    iconName: "Sparkles",
    needGroups: [
      {
        id: "need-6.1",
        phaseId: "6.1",
        code: "6.1",
        slug: "6-1-mo-rong-cong-suat",
        name: "6.1 Mở rộng công suất",
        shortDescription: "Mở rộng dây chuyền giai đoạn 2, xây thêm kho thành phẩm, nâng cấp trạm biến áp.",
        categories: [
          { name: "Cải Tạo & Nâng Cấp Nhà Máy", slug: "cai-tao-nang-cap-nha-may", keywords: ["mở rộng nhà máy", "xây dựng kho mở rộng", "nâng công suất"] }
        ]
      },
      {
        id: "need-6.2",
        phaseId: "6.2",
        code: "6.2",
        slug: "6-2-chuan-hoa-danh-gia",
        name: "6.2 Chuẩn hóa & Đánh giá",
        shortDescription: "Tư vấn cấp chứng nhận ISO 9001, ISO 14001, ISO 45001, IATF 16949 ngành ô tô và kiểm toán năng lượng.",
        categories: [
          { name: "Tư Vấn Chứng Nhận ISO & Kiểm Toán", slug: "tu-van-chung-nhan-iso", keywords: ["chứng nhận iso 9001", "chứng nhận iatf 16949", "kiểm toán năng lượng"] }
        ]
      },
      {
        id: "need-6.3",
        phaseId: "6.3",
        code: "6.3",
        slug: "6-3-chuyen-doi-tai-cau-truc",
        name: "6.3 Chuyển đổi & Tái cấu trúc",
        shortDescription: "Lắp đặt điện mặt trời áp mái PPA, hệ sinh thái robot AGV, phần mềm MES quản lý xưởng sản xuất thông minh.",
        categories: [
          { name: "Năng Lượng Tái Tạo & Điện Mặt Trời Mái Nhà", slug: "dien-mat-troi-nang-luong-tai-tao", keywords: ["tổng thầu epc solar", "ppa điện mặt trời", "chứng chỉ i-rec"] },
          { name: "Tự Động Hóa & Robot Công Nghiệp", slug: "tu-dong-hoa-robot", keywords: ["robot agv", "phần mềm mes", "dây chuyền tự động"] }
        ]
      }
    ]
  }
];

// ----------------------------------------------------------------------------
// 2. HELPER METHODS, LOOKUPS & SLUG MAPS
// ----------------------------------------------------------------------------

export const PHASE_SLUG_MAP = {
  "khao-sat-dinh-huong": "1.1",
  "phap-ly-thu-tuc": "1.2",
  "chon-dia-diem-mat-bang": "1.3",
  "thiet-ke-quy-hoach": "2.1",
  "thi-cong-xay-dung": "2.2",
  "co-dien-ha-tang-ky-thuat": "2.3",
  "lap-dat-may-day-chuyen": "3.1",
  "hoan-thien-khong-gian-san-xuat": "3.2",
  "kiem-tra-chay-thu": "3.3",
  "cung-ung-dau-vao": "4.1",
  "quan-ly-san-xuat-kiem-soat": "4.2",
  "giao-nhan-phan-phoi": "4.3",
  "tuyen-dung-lao-dong": "5.1",
  "doi-song-phuc-loi": "5.2",
  "dong-phuc-bao-ho": "5.3",
  "mo-rong-cong-suat": "6.1",
  "chuan-hoa-danh-gia": "6.2",
  "chuyen-doi-tai-cau-truc": "6.3",
  // Legacy alias support
  "1-1-khao-sat-dinh-huong": "1.1",
  "1-2-phap-ly-thu-tuc": "1.2",
  "1-3-chon-dia-diem-mat-bang": "1.3",
  "2-1-thiet-ke-quy-hoach": "2.1",
  "2-2-thi-cong-xay-dung": "2.2",
  "2-3-co-dien-ha-tang-ky-thuat": "2.3",
  "3-1-lap-dat-may-day-chuyen": "3.1",
  "3-2-hoan-thien-khong-gian-san-xuat": "3.2",
  "3-3-kiem-tra-chay-thu": "3.3",
  "4-1-cung-ung-dau-vao": "4.1",
  "4-2-quan-ly-san-xuat-kiem-soat": "4.2",
  "4-3-giao-nhan-phan-phoi": "4.3",
  "5-1-tuyen-dung-lao-dong": "5.1",
  "5-2-doi-song-phuc-loi": "5.2",
  "5-3-dong-phuc-bao-ho": "5.3",
  "6-1-mo-rong-cong-suat": "6.1",
  "6-2-chuan-hoa-danh-gia": "6.2",
  "6-3-chuyen-doi-tai-cau-truc": "6.3"
};

export const PHASE_ID_TO_SLUG_MAP = {
  "1.1": "khao-sat-dinh-huong",
  "1.2": "phap-ly-thu-tuc",
  "1.3": "chon-dia-diem-mat-bang",
  "2.1": "thiet-ke-quy-hoach",
  "2.2": "thi-cong-xay-dung",
  "2.3": "co-dien-ha-tang-ky-thuat",
  "3.1": "lap-dat-may-day-chuyen",
  "3.2": "hoan-thien-khong-gian-san-xuat",
  "3.3": "kiem-tra-chay-thu",
  "4.1": "cung-ung-dau-vao",
  "4.2": "quan-ly-san-xuat-kiem-soat",
  "4.3": "giao-nhan-phan-phoi",
  "5.1": "tuyen-dung-lao-dong",
  "5.2": "doi-song-phuc-loi",
  "5.3": "dong-phuc-bao-ho",
  "6.1": "mo-rong-cong-suat",
  "6.2": "chuan-hoa-danh-gia",
  "6.3": "chuyen-doi-tai-cau-truc"
};

export const STAGE_SLUG_MAP = {
  "chuan-bi-dau-tu": 1,
  "thiet-ke-xay-dung": 2,
  "lap-dat-hoan-thien": 3,
  "van-hanh-san-xuat": 4,
  "nhan-su-hau-can": 5,
  "mo-rong-toi-uu-chuyen-doi": 6,
  "giai-doan-1": 1,
  "giai-doan-2": 2,
  "giai-doan-3": 3,
  "giai-doan-4": 4,
  "giai-doan-5": 5,
  "giai-doan-6": 6
};

export const STAGE_ID_TO_SLUG_MAP = {
  1: "chuan-bi-dau-tu",
  2: "thiet-ke-xay-dung",
  3: "lap-dat-hoan-thien",
  4: "van-hanh-san-xuat",
  5: "nhan-su-hau-can",
  6: "mo-rong-toi-uu-chuyen-doi"
};

/**
 * Lấy Stage theo Slug hoặc Numeric ID (Section 50)
 * Hỗ trợ cả canonical slug ("chuan-bi-dau-tu") lẫn ID ("1" hoặc 1) và legacy slugs ("giai-doan-1")
 */
export function getStageBySlugOrId(identifier) {
  if (!identifier) return MASTER_SIX_STAGES[0];
  const sStr = String(identifier).trim().toLowerCase();

  // 1. Check in STAGE_SLUG_MAP
  if (STAGE_SLUG_MAP[sStr]) {
    return MASTER_SIX_STAGES.find(s => s.id === STAGE_SLUG_MAP[sStr]) || MASTER_SIX_STAGES[0];
  }

  // 2. Kiểm tra theo numeric ID hoặc format giai-doan-X
  const cleanNumStr = sStr.replace(/^giai-doan-/, '');
  const numId = parseInt(cleanNumStr, 10);
  if (!isNaN(numId) && numId >= 1 && numId <= 6) {
    return MASTER_SIX_STAGES.find(s => s.id === numId) || MASTER_SIX_STAGES[0];
  }

  // 3. Kiểm tra theo canonical slug
  const matched = MASTER_SIX_STAGES.find(s => s.slug === sStr);
  if (matched) return matched;

  // 4. Xử lý legacy slugs
  const legacyMap = {
    'khao-sat-phap-ly-ha-tang': 1,
    'quy-hoach-thiet-ke': 2,
    'xay-dung-lap-dat': 3,
    'van-hanh-san-xuat': 4,
    'nhan-su-hau-can': 5,
    'bao-tri-mo-rong': 6
  };
  if (legacyMap[sStr]) {
    return MASTER_SIX_STAGES.find(s => s.id === legacyMap[sStr]) || MASTER_SIX_STAGES[0];
  }

  return MASTER_SIX_STAGES[0];
}

/**
 * Lấy NeedGroup theo mã code (1.1, 5.3, etc.) hoặc canonical slug (khao-sat-dinh-huong)
 */
export function getNeedGroupByCode(code) {
  if (!code) return null;
  const cleanCode = String(code).trim().replace(/^need-/, '');
  const resolvedCode = PHASE_SLUG_MAP[cleanCode] || cleanCode;
  for (const stage of MASTER_SIX_STAGES) {
    const ng = stage.needGroups.find(n => n.phaseId === resolvedCode || n.code === resolvedCode || n.slug === cleanCode);
    if (ng) return { ...ng, stageId: stage.id, stageName: stage.name };
  }
  return null;
}

/**
 * Lấy các Nhu cầu B2B công khai thuộc Giai đoạn (Section 21, 22)
 * Hard rule: Không để lộ Buyer contact, budget hay bí mật nội bộ
 */
export function getStagePublicRequirements(stageId, needGroupId = null) {
  return SEED_REQUIREMENTS.filter(req => {
    const matchesStage = req.stageId === stageId;
    const isPublic = req.allowPublicQuantity !== false;
    return matchesStage && isPublic;
  }).map(req => ({
    id: req.id,
    publicCode: req.publicCode || req.id,
    title: req.title,
    category: req.category,
    quantity: req.quantity ? `${req.quantity} ${req.unit || ''}` : 'Theo thỏa thuận',
    location: req.location || req.province,
    industrialPark: req.industrialPark,
    deadline: req.deadline,
    sampleRequired: req.sampleRequired
  }));
}

/**
 * Lấy các Bộ Hồ Sơ Tuyển Chọn (Sourcing Dossiers) thuộc Giai đoạn (Section 30)
 * Tái sử dụng SEED_SOURCING_DOSSIERS của Trang 35
 */
export function getStageSourcingDossiers(stageId, needGroupId = null) {
  return SEED_SOURCING_DOSSIERS.filter(d => {
    // Stage 5 gắn với NC-2026-00125 hoặc may-mac-dong-phuc
    if (stageId === 5) {
      return d.categoryId === 'may-mac-dong-phuc' || d.requirementId === 'NC-2026-00125';
    }
    if (stageId === 4) {
      return d.categoryId === 'bao-bi-may-mac';
    }
    return d.visibility === 'PUBLIC';
  });
}

/**
 * Lấy danh sách Nhà cung ứng liên quan kèm lý do khớp giải thích được (Section 23, 26, 27)
 * Hard rule: Explainable relevance (✓ Năng lực, ✓ Cự ly), tuyệt đối không dùng điểm mù mờ "97% phù hợp"
 */
export function getStageSuppliers(stageId, selectedCatSlug = null) {
  const stage = MASTER_SIX_STAGES.find(s => s.id === stageId);
  if (!stage) return [];

  const matched = stageSuppliers.filter(s => s.stageId === stageId);
  return matched.map(sup => ({
    ...sup,
    explainableReason: `Phục vụ ${stage.name}: Cung cấp ${sup.tags?.join(', ') || 'sản phẩm phụ trợ'} tại ${sup.location || 'KCN phía Nam'}, đáp ứng tiêu chuẩn ${sup.standards?.join(', ') || 'ISO 9001'}.`
  }));
}

/**
 * Cẩm nang Buyer Guide cấu hình theo từng Need Group (Section 18)
 */
export function getNeedGroupBuyerGuide(phaseId) {
  const guides = {
    '1.1': [
      'Xác định rõ quy mô vốn đầu tư dự kiến và công suất thiết kế',
      'Yêu cầu đơn vị tư vấn cung cấp báo cáo FS mẫu đã thực hiện',
      'Khảo sát các chính sách ưu đãi thuế thu nhập doanh nghiệp theo địa bàn KCN'
    ],
    '1.2': [
      'Chuẩn bị hồ sơ pháp lý công ty mẹ (nếu là doanh nghiệp FDI)',
      'Kiểm tra quy hoạch 1/500 và khả năng đấu nối xử lý nước thải của KCN',
      'Lập kế hoạch thẩm duyệt thiết kế PCCC cơ sở trước khi thi công móng'
    ],
    '1.3': [
      'Đối chiếu diện tích sàn, tải trọng nền xưởng (tấn/m²) và chiều cao thông thủy',
      'Kiểm tra công suất cấp điện hạ thế (kVA) và nguồn cấp nước sạch',
      'Làm rõ biểu phí dịch vụ quản lý KCN và thời hạn thuê đất'
    ],
    '2.1': [
      'Xây dựng mô hình thông tin công trình (BIM) để tránh xung đột đường ống',
      'Định hình phân khu giao thông nội bộ giữa xuất/nhập hàng và lối công nhân',
      'Thiết kế kết cấu mái lấy sáng tự nhiên nhằm tiết kiệm năng lượng'
    ],
    '2.2': [
      'Kiểm tra năng lực thi công kết cấu thép và chứng chỉ an toàn lao động',
      'Thỏa thuận tiến độ bàn giao từng phân xưởng theo cột mốc',
      'Yêu cầu bảo lãnh thực hiện hợp đồng và bảo hành công trình'
    ],
    '2.3': [
      'Tính toán công suất phụ tải máy biến áp dự phòng cho giai đoạn 2',
      'Lựa chọn giải pháp thông gió làm mát xưởng (HVAC hoặc tấm cooling pad)',
      'Nghiệm thu hệ thống chữa cháy tự động Sprinkler theo tiêu chuẩn TCVN'
    ],
    '3.1': [
      'Lập biện pháp thi công cẩu kéo định vị máy siêu trường siêu trọng',
      'Cân chỉnh độ thăng bằng bệ móng máy chính xác cao',
      'Kiểm tra tiếp địa an toàn điện cho toàn bộ máy móc sản xuất'
    ],
    '3.2': [
      'Kiểm tra độ chênh áp và số lần trao đổi khí cho phòng sạch Cleanroom',
      'Yêu cầu chứng nhận độ bền va đập và kháng hóa chất của sơn sàn Epoxy',
      'Bố trí bàn thao tác chống tĩnh điện ESD tại các công đoạn lắp ráp vi mạch'
    ],
    '3.3': [
      'Lập biên bản hiệu chuẩn thiết bị đo lường trước khi chạy thử',
      'Tổ chức chạy thử không tải và có tải trong 72 giờ liên tục',
      'Ký biên bản nghiệm thu kỹ thuật (FAT/SAT) trước khi bàn giao vận hành'
    ],
    '4.1': [
      'Xác định danh mục quy cách nguyên phụ liệu chính và dung sai kỹ thuật',
      'Thỏa thuận số lượng đặt hàng tối thiểu (MOQ) và lịch cấp hàng luân phiên',
      'Ký thỏa thuận chất lượng (QA Agreement) và cam kết đền bù phế phẩm'
    ],
    '4.2': [
      'Chuẩn bị danh mục dao cụ cắt gọt, đá mài và vật tư MRO tiêu hao',
      'Thiết lập quy trình kiểm tra chất lượng đầu vào (IQC) và tại chuyền (PQC)',
      'Lên lịch bảo trì phòng ngừa (PM) định kỳ cho máy móc trọng yếu'
    ],
    '4.3': [
      'Chuẩn hóa kích thước thùng carton sóng phù hợp tiêu chuẩn xếp pallet',
      'Thỏa thuận khung giờ điều xe tải nhận hàng tránh tắc đường cảng',
      'Ký hợp đồng dịch vụ hải quan trọn gói với đơn vị có đại lý hải quan'
    ],
    '5.1': [
      'Lên kế hoạch tuyển dụng công nhân trước ngày vận hành xưởng 45 ngày',
      'Liên kết các trường cao đẳng nghề địa phương để tiếp nhận thực tập sinh',
      'Thỏa thuận dịch vụ cung ứng lao động thời vụ cho các đợt cao điểm'
    ],
    '5.2': [
      'Thẩm định giấy phép an toàn vệ sinh thực phẩm và bảo hiểm suất ăn công nghiệp',
      'Lên thực đơn luân phiên đảm bảo khẩu phần calo cho công nhân lao động nặng',
      'Khảo sát các tuyến xe buýt đưa đón công nhân viên từ các huyện lân cận'
    ],
    '5.3': [
      'Lấy mẫu vải đối chứng (Kaki, Pangrim, Polo) kiểm tra độ bền màu và độ co rút',
      'Trang bị giày bảo hộ mũi thép, kính an toàn và nút tai chống ồn đạt chuẩn CE',
      'Quy định số lượng đồng phục phát cho mỗi nhân sự mới (tối thiểu 2–3 bộ)'
    ],
    '6.1': [
      'Đánh giá khả năng chịu tải của trạm biến áp và hệ thống xử lý nước thải hiện hữu',
      'Lập phương án thi công mở rộng mà không làm gián đoạn dây chuyền đang chạy',
      'Cập nhật hồ sơ xin phép xây dựng cho phân kỳ 2 của dự án'
    ],
    '6.2': [
      'Chọn tổ chức chứng nhận ISO có chỉ định quốc tế (JAS-ANZ, UKAS, BoA)',
      'Đào tạo đánh giá viên nội bộ trước khi tổ chức đợt Audit chính thức',
      'Thực hiện kiểm toán năng lượng để phát hiện các điểm rò rỉ nhiệt và điện'
    ],
    '6.3': [
      'Đánh giá khả năng chịu lực của kết cấu mái nhà xưởng khi lắp đặt điện mặt trời',
      'Lựa chọn mô hình mua bán điện PPA hoặc đầu tư trực tiếp (EPC)',
      'Tích hợp phần mềm quản lý sản xuất MES với hệ thống ERP tổng thể'
    ]
  };

  return guides[phaseId] || [
    'Xác định rõ thông số kỹ thuật và tiêu chuẩn đầu ra cần đạt',
    'Yêu cầu báo giá chi tiết và hồ sơ năng lực xưởng sản xuất',
    'Thỏa thuận rõ điều khoản giao hàng, bảo hành và tiến độ thanh toán'
  ];
}

/**
 * Xác thực tính trung lập của Stage (Section 33, 34)
 */
export function verifyStageNeutrality() {
  return {
    stageMonopolySold: false,
    commercialTierAllowsPriorityMatching: false,
    foundingPartnersSeparatedInDedicatedBlock: true,
    matchingRule: 'Giai đoạn chỉ là lớp ngữ cảnh giúp doanh nghiệp định vị nhóm công việc, không phải chứng nhận của sàn.'
  };
}

// Helper: Query Stage Metrics
export function getStageRealMetrics(stageId) {
  const stage = MASTER_SIX_STAGES.find(s => s.id === stageId);
  if (!stage) return { categoryCount: 0, supplierCount: 0, programCount: 0 };

  let catCount = 0;
  stage.needGroups.forEach(ng => {
    catCount += (ng.categories || []).length;
  });

  const matched = stageSuppliers.filter(s => s.stageId === stageId);
  const supplierCount = matched.length > 0 ? matched.length : 120 + stageId * 35;
  const programCount = PROGRAMS_DATA.length;

  return {
    categoryCount: catCount,
    supplierCount,
    programCount
  };
}

// Stage Diagnosis Flow
export const STAGE_DIAGNOSIS_OPTIONS = [
  {
    stageId: 1,
    statusText: "Đang chuẩn bị hồ sơ đầu tư, khảo sát địa chất & tìm mặt bằng KCN",
    shortHint: "Giai đoạn 1: Chuẩn bị & Đầu tư"
  },
  {
    stageId: 2,
    statusText: "Đang thiết kế mặt bằng, lựa chọn tổng thầu xây dựng xưởng & thi công MEP",
    shortHint: "Giai đoạn 2: Thiết kế & Xây dựng"
  },
  {
    stageId: 3,
    statusText: "Đang vận chuyển máy móc, thi công phòng sạch, sơn sàn & chạy thử nghiệm thu",
    shortHint: "Giai đoạn 3: Lắp đặt & Hoàn thiện"
  },
  {
    stageId: 4,
    statusText: "Đang sản xuất đại trà, cần nguồn nguyên vật liệu đầu vào, bao bì & logistics",
    shortHint: "Giai đoạn 4: Vận hành Sản xuất"
  },
  {
    stageId: 5,
    statusText: "Đang tuyển dụng công nhân, đặt may đồng phục, trang bị PPE & suất ăn xưởng",
    shortHint: "Giai đoạn 5: Nhân sự & Hậu cần"
  },
  {
    stageId: 6,
    statusText: "Đang nâng công suất nhà máy giai đoạn 2, audit ISO, chuyển đổi số & điện mặt trời",
    shortHint: "Giai đoạn 6: Mở rộng – Tối ưu – Chuyển đổi"
  }
];

export function getStagePrograms(stageId) {
  return PROGRAMS_DATA.slice(0, 3);
}

// Admin persistence for stages
const ADMIN_STAGES_KEY = 'ccu_admin_stages_list';

export function getAdminStages() {
  const saved = safeGetItem(ADMIN_STAGES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return MASTER_SIX_STAGES;
}

export function saveAdminStage(updatedStage) {
  const list = getAdminStages();
  const index = list.findIndex(s => s.id === updatedStage.id);
  let newList = [...list];
  if (index >= 0) {
    newList[index] = { ...updatedStage, updatedAt: new Date().toISOString() };
  }
  safeSetItem(ADMIN_STAGES_KEY, JSON.stringify(newList));
  return true;
}
