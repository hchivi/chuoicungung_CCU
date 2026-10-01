// Category Hub Data & Taxonomy Management
// Standardized according to CHUOICUNGUNG.COM Specification 08.txt

import phaseTaxonomyAlphabetical from './phaseTaxonomyAlphabetical.json' with { type: 'json' };
import supplierTopCategories from './supplierTopCategories.json' with { type: 'json' };
import categoriesAlphabetical from './categoriesAlphabetical.json' with { type: 'json' };
import enterprisesFullList from './enterprisesFull.json' with { type: 'json' };
import { STRATEGIC_FOUNDING_PARTNERS } from './strategicFoundingPartners.js';
import { getActiveEligiblePartnership } from './foundingPartnershipData.js';
import { PROGRAMS_DATA } from './programsData.js';
import { SEEDED_PRODUCT_SERVICES } from './productServicesData.js';

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

// Master 6 Stages Reference
export const SIX_STAGES_TAXONOMY = [
  { id: 1, name: "Chuẩn bị & Đầu tư", slug: "chuan-bi-dau-tu", color: "#8b5cf6" },
  { id: 2, name: "Thiết kế & Xây dựng", slug: "thiet-ke-xay-dung", color: "#0052cc" },
  { id: 3, name: "Lắp đặt & Hoàn thiện", slug: "lap-dat-hoan-thien", color: "#06b6d4" },
  { id: 4, name: "Vận hành Sản xuất", slug: "van-hanh-san-xuat", color: "#10b981" },
  { id: 5, name: "Nhân sự & Hậu cần", slug: "nhan-su-hau-can", color: "#f59e0b" },
  { id: 6, name: "Mở rộng – Tối ưu – Chuyển đổi", slug: "mo-rong-toi-uu-chuyen-doi", color: "#f43f5e" }
];

// Curated Category Hub Master Definitions (Primary Seeded Hubs)
export const CURATED_CATEGORIES = [
  {
    id: "cat-dong-phuc-bao-ho",
    slug: "dong-phuc-bao-ho",
    name: "Đồng Phục & Bảo Hộ Lao Động (PPE)",
    stageId: 5,
    stageName: "Nhân sự & Hậu cần",
    phaseId: "5.3",
    phaseName: "5.3 Đồng phục & Bảo hộ (PPE)",
    shortDescription: "Trung tâm kết nối các xưởng may đồng phục công nghiệp, áo polo nhận diện, đồ bảo hộ PPE đạt chuẩn Quatest/Oeko-Tex và trang thiết bị phòng sạch ESD.",
    buyerIntent: "Tìm nhà cung ứng đồng phục công nhân, kỹ sư, quần áo chống tĩnh điện, giày bảo hộ và đồ bảo hộ định kỳ cho nhà máy sản xuất.",
    status: "ACTIVE",
    publishable: true,
    sortOrder: 1,
    seoTitle: "Đồng Phục & Bảo Hộ Lao Động Nhà Máy | Tìm Nhà Cung Ứng | CHUOICUNGUNG.COM",
    seoDescription: "Tìm xưởng may đồng phục công nhân, bảo hộ PPE, phòng sạch ESD đạt chuẩn ISO/Oeko-Tex theo năng lực, MOQ và tiến độ giao hàng trên toàn quốc.",
    bannerImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1400&q=85",
    buyerGuide: {
      title: "TRƯỚC KHI TÌM NGUỒN ĐỒNG PHỤC & BẢO HỘ, BẠN NÊN CHUẨN BỊ GÌ?",
      items: [
        { label: "Số lượng & Quy mô nhân sự", desc: "Xác định rõ số lượng theo size (S, M, L, XL, 2XL) và dự phòng tuyển mới 10-15%." },
        { label: "Môi trường làm việc thực tế", desc: "Phòng sạch tĩnh điện, xưởng nhiệt độ cao, hàn cắt cơ khí hay môi trường kho lạnh." },
        { label: "Tiêu chuẩn chất liệu mong muốn", desc: "Vải Cotton thoáng khí, Kaki 65/35 chống rách, hay vải có sợi carbon chống tĩnh điện (ESD)." },
        { label: "Yêu cầu in/thêu logo & nhận diện", desc: "File vector logo gốc, vị trí ngực/lưng/tay áo, quy cách in pet chuyển nhiệt hay thêu vi tính." },
        { label: "Thời gian giao hàng & Tiến độ cấp phát", desc: "Ngày bắt đầu ca kíp mới của nhà máy hoặc thời hạn nghiệm thu trang bị định kỳ." },
        { label: "Chính sách làm mẫu & Thử size", desc: "Cần xưởng gửi bộ size mẫu đối chứng thực tế trước khi lên chuyền may hàng loạt." }
      ]
    },
    keywords: [
      { id: "kw-dp-01", name: "Đồng phục công nhân", slug: "dong-phuc-cong-nhan", query: "đồng phục công nhân", count: 185 },
      { id: "kw-dp-02", name: "Áo polo doanh nghiệp", slug: "ao-polo-doanh-nghiep", query: "áo polo", count: 142 },
      { id: "kw-dp-03", name: "Đồng phục phòng sạch ESD", slug: "dong-phuc-phong-sach-esd", query: "phòng sạch esd", count: 96 },
      { id: "kw-dp-04", name: "Giày bảo hộ chống đinh", slug: "giay-bao-ho-chong-dinh", query: "giày bảo hộ", count: 120 },
      { id: "kw-dp-05", name: "Áo phản quang công trình", slug: "ao-phan-quang-cong-trinh", query: "áo phản quang", count: 88 },
      { id: "kw-dp-06", name: "Nón bảo hộ & Kính an toàn", slug: "non-bao-ho-kinh-an-toan", query: "nón bảo hộ", count: 110 }
    ],
    catalogues: [
      { id: "catl-01", title: "Catalogue Mẫu Đồng Phục & Vải KCN 2026", size: "14.2 MB", format: "PDF", pages: 36 },
      { id: "catl-02", title: "Bộ Quy chuẩn Trang phục An Toàn PPE Nhà Máy", size: "8.6 MB", format: "PDF", pages: 24 }
    ]
  },
  {
    id: "cat-co-khi-chinh-xac",
    slug: "co-khi",
    name: "Cơ Khí Chính Xác & Khuôn Mẫu (CNC)",
    stageId: 3,
    stageName: "Lắp đặt & Hoàn thiện",
    phaseId: "3.1",
    phaseName: "3.1 Lắp đặt máy & Dây chuyền",
    shortDescription: "Trung tâm kết nối các xưởng gia công chi tiết máy CNC 3-5 trục, chế tạo Jig gá, đồ gá kiểm tra CMM, đột dập kim loại tấm và đúc áp lực đạt chuẩn dung sai ±0.005mm.",
    buyerIntent: "Tìm xưởng cơ khí gia công phụ tùng thay thế, đồ gá lắp ráp nhà máy FDI và khuôn ép nhựa chính xác.",
    status: "ACTIVE",
    publishable: true,
    sortOrder: 2,
    seoTitle: "Cơ Khí Chính Xác & Gia Công Chi Tiết Máy CNC | CHUOICUNGUNG.COM",
    seoDescription: "Tìm nhà máy gia công CNC, tiện phay bào mài, chế tạo Jig gá dung sai cao, khuôn mẫu đột dập phục vụ chuỗi cung ứng FDI tại Việt Nam.",
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85",
    buyerGuide: {
      title: "TRƯỚC KHI TÌM NGUỒN CƠ KHÍ CHÍNH XÁC, BẠN NÊN CHUẨN BỊ GÌ?",
      items: [
        { label: "Bản vẽ 2D/3D chi tiết kỹ thuật", desc: "File định dạng STEP, IGES, DXF hoặc PDF có đầy đủ dung sai kích thước hình học (GD&T)." },
        { label: "Mác thép hoặc vật liệu chỉ định", desc: "Nhôm 6061/7075, Thép S50C/SKD11, Inox 304/316, Đồng thau hay nhựa kỹ thuật POM/Bakelite." },
        { label: "Dung sai cho phép & Độ nhám bề mặt", desc: "Dung sai ±0.01mm hay ±0.005mm; độ bóng Ra 0.8 hay yêu cầu đánh bóng gương." },
        { label: "Xử lý nhiệt luyện & Bề mặt", desc: "Nhiệt luyện tôi cứng HRC, xi mạ Anode nhôm (cứng/màu), mạ niken crom hay nhuộm đen." },
        { label: "Số lượng đơn hàng thử & Hàng loạt", desc: "Gia công 1-5 bộ làm mẫu thử hay hợp đồng cung ứng định kỳ hàng tháng." },
        { label: "Báo cáo kiểm tra chất lượng (CMM / QC)", desc: "Yêu cầu kèm chứng nhận xuất xưởng (CO/CQ) và phiếu đo kích thước CMM từng chi tiết." }
      ]
    },
    keywords: [
      { id: "kw-ck-01", name: "Gia công chi tiết máy CNC", slug: "gia-cong-chi-tiet-may-cnc", query: "chi tiết máy cnc", count: 210 },
      { id: "kw-ck-02", name: "Chế tạo Jig gá lắp ráp", slug: "che-tao-jig-ga-lap-rap", query: "jig gá", count: 145 },
      { id: "kw-ck-03", name: "Cắt laser kim loại tấm", slug: "cat-laser-kim-loai-tam", query: "cắt laser", count: 180 },
      { id: "kw-ck-04", name: "Khuôn đột dập chính xác", slug: "khuon-dot-dap-chinh-xac", query: "khuôn đột dập", count: 98 },
      { id: "kw-ck-05", name: "Xi mạ & Anode nhôm", slug: "xi-ma-anode-nhom", query: "anode nhôm", count: 75 }
    ],
    catalogues: [
      { id: "catl-03", title: "Năng Lực Máy Gia Công CNC & Đo Lường CMM 2026", size: "18.5 MB", format: "PDF", pages: 42 }
    ]
  },
  {
    id: "cat-bao-bi-dong-goi",
    slug: "bao-bi",
    name: "Bao Bì & Đóng Gói Công Nghiệp",
    stageId: 4,
    stageName: "Vận hành Sản xuất",
    phaseId: "4.3",
    phaseName: "4.3 Giao nhận & Phân phối",
    shortDescription: "Trung tâm kết nối nhà máy sản xuất thùng carton sóng 3-5-7 lớp, màng co nhiệt, xốp EPE chống sốc, màng quấn pallet Stretch Film và bao bì xuất khẩu chuẩn RoHs/FSC.",
    buyerIntent: "Tìm nhà cung ứng thùng carton, màng bảo vệ, màng PE bọc hàng và pallet đóng gói chịu lực cho hàng công nghiệp.",
    status: "ACTIVE",
    publishable: true,
    sortOrder: 3,
    seoTitle: "Bao Bì Carton & Đóng Gói Công Nghiệp | CHUOICUNGUNG.COM",
    seoDescription: "Tìm nhà cung cấp thùng carton sóng chịu lực, màng PE quấn pallet, xốp bọc bảo vệ linh kiện điện tử đạt chuẩn FSC và RoHS xuất khẩu.",
    bannerImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
    buyerGuide: {
      title: "TRƯỚC KHI TÌM NGUỒN BAO BÌ & ĐÓNG GÓI, BẠN NÊN CHUẨN BỊ GÌ?",
      items: [
        { label: "Kích thước phủ bì & Lọt lòng", desc: "Chiều Dài x Rộng x Cao (cm) của sản phẩm và khoảng trống cần chèn lót an toàn." },
        { label: "Tải trọng chứa đựng & Xếp chồng", desc: "Trọng lượng sản phẩm bên trong và số lớp thùng xếp chồng trên pallet kho bãi." },
        { label: "Quy cách sóng & Giấy", desc: "Sóng B, C, BC (3-5-7 lớp), định lượng giấy mặt (Kraft vàng/trắng) và giấy sóng gia keo chịu lực." },
        { label: "Quy cách in ấn & Cảnh báo an toàn", desc: "In flexo 1-3 màu hay in offset cán màng; ký hiệu hàng dễ vỡ, hướng đặt, mã vạch." },
        { label: "Tiêu chuẩn xuất khẩu bắt buộc", desc: "Chứng chỉ rừng FSC, hàm lượng kim loại nặng RoHS, độ ẩm tiêu chuẩn dưới 12%." }
      ]
    },
    keywords: [
      { id: "kw-bb-01", name: "Thùng carton sóng 5 lớp", slug: "thung-carton-song-5-lop", query: "thùng carton", count: 230 },
      { id: "kw-bb-02", name: "Màng PE quấn pallet", slug: "mang-pe-quan-pallet", query: "màng pe", count: 165 },
      { id: "kw-bb-03", name: "Xốp EPE chống trầy xước", slug: "xop-epe-chong-tray-xuoc", query: "xốp epe", count: 112 },
      { id: "kw-bb-04", name: "Bao bì màng co nhiệt", slug: "bao-bi-mang-co-nhiet", query: "màng co nhiệt", count: 84 },
      { id: "kw-bb-05", name: "Pallet gỗ hun trùng & Pallet nhựa", slug: "pallet-go-pallet-nhua", query: "pallet", count: 140 }
    ],
    catalogues: [
      { id: "catl-04", title: "Bảng Tra Cứu Thông Số Sóng & Khả Năng Nén Thùng Carton", size: "6.8 MB", format: "PDF", pages: 18 }
    ]
  },
  {
    id: "cat-logistics-kho-van",
    slug: "logistics",
    name: "Logistics, Cảng Biển & Kho Vận",
    stageId: 4,
    stageName: "Vận hành Sản xuất",
    phaseId: "4.3",
    phaseName: "4.3 Giao nhận & Phân phối",
    shortDescription: "Trung tâm dịch vụ giao nhận vận tải container đường bộ, khai thuê hải quan xuất nhập khẩu, kho ngoại quan, kho lạnh và logistics chặng cuối cho khu công nghiệp.",
    buyerIntent: "Tìm đơn vị logistics vận chuyển container từ nhà máy đến cảng Cát Lái, Cái Mép, Hải Phòng và thủ tục thông quan hàng hóa.",
    status: "ACTIVE",
    publishable: true,
    sortOrder: 4,
    seoTitle: "Logistics & Vận Tải Nhà Máy KCN | CHUOICUNGUNG.COM",
    seoDescription: "Tìm công ty vận tải container, khai báo hải quan, cho thuê kho bãi đạt chuẩn tại các cụm KCN trọng điểm phía Bắc và phía Nam.",
    bannerImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=85",
    buyerGuide: {
      title: "TRƯỚC KHI TÌM NGUỒN DỊCH VỤ LOGISTICS, BẠN NÊN CHUẨN BỊ GÌ?",
      items: [
        { label: "Tuyến đường & Tần suất vận chuyển", desc: "Điểm đóng hàng (KCN) đến cảng xuất (Cát Lái, Cái Mép, Hải Phòng) hoặc phân phối nội địa." },
        { label: "Loại container & Phương tiện", desc: "Container 20ft/40ft thường, cont Flat-rack máy móc quá khổ, cont lạnh hay xe tải bạt." },
        { label: "Tính chất hàng hóa & Yêu cầu đặc biệt", desc: "Hàng thông thường, hàng hóa chất nguy hiểm (DG), linh kiện điện tử giá trị cao." },
        { label: "Nhu cầu dịch vụ trọn gói", desc: "Vận tải thuần túy hay bao gồm nâng hạ hạ bãi, dỡ hàng xe nâng, kiểm hóa và thủ tục hải quan." }
      ]
    },
    keywords: [
      { id: "kw-log-01", name: "Vận tải xe đầu kéo container", slug: "van-tai-xe-dau-keo-container", query: "vận tải container", count: 195 },
      { id: "kw-log-02", name: "Khai thuê hải quan trọn gói", slug: "khai-thue-hai-quan-tron-goi", query: "hải quan", count: 130 },
      { id: "kw-log-03", name: "Cho thuê kho xưởng & Kho ngoại quan", slug: "cho-thue-kho-xuong-kho-ngoai-quan", query: "kho bãi", count: 160 },
      { id: "kw-log-04", name: "Dịch vụ cẩu kéo máy siêu trường siêu trọng", slug: "dich-vu-cau-keo-may-sieu-truong", query: "cẩu kéo", count: 68 }
    ],
    catalogues: [
      { id: "catl-05", title: "Cẩm Nang Tuyến Đường & Biểu Phí Cảng Biển 2026", size: "11.4 MB", format: "PDF", pages: 30 }
    ]
  },
  {
    id: "cat-nang-luong-dien-mat-troi",
    slug: "dien-mat-troi-nang-luong-tai-tao",
    name: "Năng Lượng Tái Tạo & Điện Mặt Trời Mái Nhà",
    stageId: 6,
    stageName: "Mở rộng – Tối ưu – Chuyển đổi",
    phaseId: "6.3",
    phaseName: "6.3 Chuyển đổi số & Tự động hóa",
    shortDescription: "Trung tâm kết nối nhà thầu tổng thầu EPC điện mặt trời áp mái nhà xưởng, trạm biến áp, giải pháp lưu trữ BESS và chứng chỉ năng lượng tái tạo I-REC đạt chuẩn ESG.",
    buyerIntent: "Tìm nhà thầu EPC triển khai hệ thống điện mặt trời mái nhà máy theo mô hình tự đầu tư hoặc PPA 0 đồng.",
    status: "ACTIVE",
    publishable: true,
    sortOrder: 5,
    seoTitle: "Tổng Thầu EPC Điện Mặt Trời Mái Nhà Xưởng | CHUOICUNGUNG.COM",
    seoDescription: "Tìm nhà thầu EPC điện mặt trời mái nhà xưởng KCN, thẩm định kết cấu, PCCC và hỗ trợ cấp chứng chỉ năng lượng tái tạo ESG.",
    bannerImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=85",
    buyerGuide: {
      title: "TRƯỚC KHI TÌM NGUỒN EPC ĐIỆN MẶT TRỜI, BẠN NÊN CHUẨN BỊ GÌ?",
      items: [
        { label: "Diện tích & Hiện trạng mái xưởng", desc: "Diện tích mái tôn khả dụng (m²), hướng nghiêng và khả năng chịu lực của khung kèo xưởng." },
        { label: "Biểu đồ phụ tải tiêu thụ điện", desc: "Hóa đơn tiền điện 12 tháng gần nhất, công suất trạm biến áp hiện hữu (kVA) của nhà máy." },
        { label: "Hồ sơ nghiệm thu PCCC hiện tại", desc: "Hồ sơ thiết kế PCCC cơ sở để lập hồ sơ bổ sung an toàn phòng cháy chữa cháy hệ thống pin." },
        { label: "Mô hình tài chính đầu tư", desc: "Nhà máy tự bỏ vốn đầu tư hưởng 100% tiết kiệm điện, hay mô hình Quỹ PPA đầu tư 0 đồng bán điện chiết khấu." }
      ]
    },
    keywords: [
      { id: "kw-sol-01", name: "Tổng thầu EPC điện mặt trời", slug: "tong-thau-epc-dien-mat-troi", query: "điện mặt trời", count: 110 },
      { id: "kw-sol-02", name: "Hợp đồng mua bán điện PPA 0 đồng", slug: "hop-dong-ppa-0-dong", query: "ppa điện mặt trời", count: 45 },
      { id: "kw-sol-03", name: "Tấm pin năng lượng mặt trời Tier 1", slug: "tam-pin-nang-luong-tier-1", query: "tấm pin mặt trời", count: 85 },
      { id: "kw-sol-04", name: "Chứng chỉ năng lượng xanh I-REC", slug: "chung-chi-nang-luong-xanh-i-rec", query: "chứng chỉ i-rec", count: 32 }
    ],
    catalogues: [
      { id: "catl-06", title: "Báo Cáo Tối Ưu Lợi Nhuận EPC Điện Mặt Trời Mái Nhà Xưởng", size: "9.2 MB", format: "PDF", pages: 28 }
    ]
  }
];

export const CATEGORY_HUBS = CURATED_CATEGORIES;

// Helper: Get or dynamically construct a Category Hub object from any slug or name
export function getCategoryHubBySlug(slug, nameParam) {
  if (!slug) slug = '';
  const cleanSlug = slugify(slug);

  // 1. Check in curated categories
  const curated = CURATED_CATEGORIES.find(c => c.slug === cleanSlug || slugify(c.name) === cleanSlug);
  if (curated) {
    return curated;
  }

  // 2. Check if it matches a category in categoriesAlphabetical
  let matchedName = nameParam || '';
  if (!matchedName) {
    for (const [letter, list] of Object.entries(categoriesAlphabetical)) {
      const match = list.find(item => slugify(item.name) === cleanSlug);
      if (match) {
        matchedName = match.name;
        break;
      }
    }
  }

  // 3. Check in supplierTopCategories
  if (!matchedName) {
    const topMatch = supplierTopCategories.find(item => slugify(item.name) === cleanSlug);
    if (topMatch) matchedName = topMatch.name;
  }

  // 4. Check in enterprises full list
  if (!matchedName) {
    const entMatch = enterprisesFullList.find(e => slugify(e.category || e.industry || '') === cleanSlug);
    if (entMatch) matchedName = entMatch.category || entMatch.industry;
  }

  // 5. Fallback name from slug
  if (!matchedName) {
    matchedName = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // Determine stage and phase intelligently
  let stageId = 4;
  let stageName = "Vận hành Sản xuất";
  let phaseId = "4.1";
  let phaseName = "4.1 Cung ứng đầu vào & Nguyên vật liệu";

  const lowerName = matchedName.toLowerCase();
  if (lowerName.includes('xây dựng') || lowerName.includes('thiết kế') || lowerName.includes('kiến trúc') || lowerName.includes('bê tông')) {
    stageId = 2;
    stageName = "Thiết kế & Xây dựng";
    phaseId = "2.2";
    phaseName = "2.2 Thi công xây dựng & Kết cấu";
  } else if (lowerName.includes('khảo sát') || lowerName.includes('luật') || lowerName.includes('đầu tư') || lowerName.includes('bất động sản')) {
    stageId = 1;
    stageName = "Chuẩn bị & Đầu tư";
    phaseId = "1.1";
    phaseName = "1.1 Khảo sát & Pháp lý";
  } else if (lowerName.includes('máy') || lowerName.includes('cơ khí') || lowerName.includes('thiết bị') || lowerName.includes('lắp đặt')) {
    stageId = 3;
    stageName = "Lắp đặt & Hoàn thiện";
    phaseId = "3.1";
    phaseName = "3.1 Lắp đặt máy móc & Dây chuyền";
  } else if (lowerName.includes('nhân sự') || lowerName.includes('tuyển dụng') || lowerName.includes('đồng phục') || lowerName.includes('bảo hộ') || lowerName.includes('suất ăn')) {
    stageId = 5;
    stageName = "Nhân sự & Hậu cần";
    phaseId = "5.3";
    phaseName = "5.3 Đồng phục & Hậu cần";
  } else if (lowerName.includes('năng lượng') || lowerName.includes('số') || lowerName.includes('môi trường') || lowerName.includes('xử lý nước')) {
    stageId = 6;
    stageName = "Mở rộng – Tối ưu – Chuyển đổi";
    phaseId = "6.3";
    phaseName = "6.3 Tối ưu & Chuyển đổi xanh";
  }

  // Generate dynamic keywords
  const keywords = [
    { id: `kw-dyn-01`, name: `${matchedName} chuyên dụng`, slug: slugify(`${matchedName} chuyên dụng`), query: matchedName, count: 65 },
    { id: `kw-dyn-02`, name: `Nhà máy sản xuất ${matchedName}`, slug: slugify(`san-xuat-${matchedName}`), query: `sản xuất ${matchedName}`, count: 48 },
    { id: `kw-dyn-03`, name: `Gia công & Cung ứng ${matchedName}`, slug: slugify(`gia-cong-${matchedName}`), query: `gia công ${matchedName}`, count: 34 },
    { id: `kw-dyn-04`, name: `Vật tư & Phụ tùng ${matchedName}`, slug: slugify(`vat-tu-${matchedName}`), query: `vật tư ${matchedName}`, count: 52 }
  ];

  return {
    id: `cat-${cleanSlug}`,
    slug: cleanSlug,
    name: matchedName,
    stageId,
    stageName,
    phaseId,
    phaseName,
    shortDescription: `Chuyên mục tập hợp các nhà sản xuất, đơn vị gia công và nhà cung ứng đạt chuẩn B2B trong ngành ${matchedName} phục vụ nhu cầu chuỗi cung ứng công nghiệp.`,
    buyerIntent: `Tìm đối tác cung ứng ${matchedName} có năng lực sản xuất thực tế, đáp ứng tiêu chuẩn kỹ thuật và tiến độ giao hàng cho nhà máy.`,
    status: "ACTIVE",
    publishable: true,
    sortOrder: 99,
    seoTitle: `${matchedName} | Tìm Nhà Cung Ứng B2B | CHUOICUNGUNG.COM`,
    seoDescription: `Danh bạ sản phẩm, dịch vụ và nhà cung ứng ${matchedName} chuẩn hóa tại Việt Nam. Tìm kiếm theo năng lực, MOQ, chứng nhận và gửi yêu cầu trực tiếp.`,
    bannerImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85",
    buyerGuide: {
      title: `TRƯỚC KHI TÌM NGUỒN ${matchedName.toUpperCase()}, BẠN NÊN CHUẨN BỊ GÌ?`,
      items: [
        { label: "Quy cách kỹ thuật & Tiêu chuẩn áp dụng", desc: `Mô tả cụ thể thông số kỹ thuật, kích thước, vật liệu hoặc tiêu chuẩn chất lượng của ${matchedName}.` },
        { label: "Sản lượng hoặc khối lượng dự kiến", desc: "Số lượng đặt hàng cho đợt đầu (MOQ) và sản lượng tiêu thụ trung bình hàng tháng/quý." },
        { label: "Địa bàn giao nhận & Yêu cầu tiến độ", desc: "Tỉnh thành hoặc KCN nhận hàng, mốc thời gian cần hoàn thành giao đợt 1." },
        { label: "Yêu cầu kiểm định hoặc chứng chỉ xuất xưởng", desc: "Các chứng chỉ bắt buộc như ISO, Quatest, CO/CQ hoặc phiếu kiểm tra nghiệm thu." }
      ]
    },
    keywords,
    catalogues: []
  };
}

// Helper: Query related Products/Services for this Category
export function getCategoryProducts(category) {
  if (!category) return [];
  const catSlug = slugify(category.slug || category.name);
  const catName = (category.name || '').toLowerCase();

  // Find in SEEDED_PRODUCT_SERVICES
  const seeded = SEEDED_PRODUCT_SERVICES.filter(p => {
    const pCat = (p.categoryName || '').toLowerCase();
    const pSlug = slugify(p.categoryName || '');
    return pCat.includes(catName) || catName.includes(pCat) || pSlug.includes(catSlug) || catSlug.includes(pSlug);
  });

  return seeded;
}

// Helper: Find Active Founding Partner for this category
export function getCategoryFoundingPartner(category) {
  if (!category) return null;

  // 1. Query từ FoundingPartnershipService theo Spec 18 (Section 20)
  const activeFounding = getActiveEligiblePartnership({
    categoryId: category.id || category.slug,
    categorySlug: category.slug
  });
  if (activeFounding) return activeFounding;

  // 2. Fallback tìm theo STRATEGIC_FOUNDING_PARTNERS
  const catName = (category.name || '').toLowerCase();
  const phaseId = category.phaseId;

  const match = STRATEGIC_FOUNDING_PARTNERS.find(fp => {
    if (!fp.verified) return false;
    const fpCat = (fp.category || '').toLowerCase();
    const matchesCategory = fpCat.includes(catName) || catName.includes(fpCat);
    const matchesPhase = fp.phaseId === phaseId;
    const matchesKeyword = Array.isArray(fp.keywords) && fp.keywords.some(kw => catName.includes(kw.toLowerCase()));

    return matchesCategory || matchesPhase || matchesKeyword;
  });

  return match || null;
}

// Helper: Find Related Programs for this category
export function getCategoryPrograms(category) {
  if (!category) return [];
  const catName = (category.name || '').toLowerCase();

  return PROGRAMS_DATA.filter(prog => {
    if (prog.industries && Array.isArray(prog.industries)) {
      return prog.industries.some(ind => {
        const iLower = ind.toLowerCase();
        return iLower.includes(catName) || catName.includes(iLower) || iLower === 'tất cả ngành hàng';
      });
    }
    return false;
  }).slice(0, 3);
}

// Helper: Local Storage for Admin Categories Management
const ADMIN_CATEGORIES_KEY = 'ccu_admin_categories_list';
const ADMIN_AUDIT_LOGS_KEY = 'ccu_admin_audit_logs';

export function getAdminCategories() {
  try {
    const saved = localStorage.getItem(ADMIN_CATEGORIES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading admin categories", e);
  }
  return CURATED_CATEGORIES;
}

export function saveAdminCategory(updatedCategory, actionType = 'UPDATE') {
  try {
    const categories = getAdminCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);
    let newCategories = [];
    if (index >= 0) {
      newCategories = [...categories];
      newCategories[index] = { ...updatedCategory, updatedAt: new Date().toISOString() };
    } else {
      newCategories = [
        ...categories,
        { ...updatedCategory, id: updatedCategory.id || `cat-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
    }
    localStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(newCategories));

    // Write audit log
    const auditLogs = getAdminAuditLogs();
    const logItem = {
      id: `audit-${Date.now()}`,
      action: actionType,
      targetType: 'CATEGORY',
      targetId: updatedCategory.id,
      targetName: updatedCategory.name,
      timestamp: new Date().toISOString(),
      performedBy: 'ADMIN'
    };
    localStorage.setItem(ADMIN_AUDIT_LOGS_KEY, JSON.stringify([logItem, ...auditLogs.slice(0, 99)]));
    return true;
  } catch (e) {
    console.error("Error saving admin category", e);
    return false;
  }
}

export function getAdminAuditLogs() {
  try {
    const saved = localStorage.getItem(ADMIN_AUDIT_LOGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [
    {
      id: 'audit-001',
      action: 'SYSTEM_SYNC',
      targetType: 'CATEGORY',
      targetId: 'cat-dong-phuc-bao-ho',
      targetName: 'Đồng Phục & Bảo Hộ Lao Động (PPE)',
      timestamp: new Date().toISOString(),
      performedBy: 'SYSTEM_ROBOT'
    }
  ];
}
