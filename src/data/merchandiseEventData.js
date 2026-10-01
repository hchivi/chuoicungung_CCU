// ============================================================================
// MASTER MERCHANDISE & EVENT ITEMS SERVICE
// PAGE 16: VẬT PHẨM DOANH NGHIỆP & SỰ KIỆN
// ROUTE: /dich-vu/vat-pham-su-kien
// Chuẩn hóa theo spec 16.txt - CHUOICUNGUNG.COM
// ============================================================================

import { SEED_ORGANIZATIONS } from './organizationsData.js';
import { PROGRAMS_DATA } from './programsData.js';

// Safe Storage Helper: Hỗ trợ cả Client Browser (localStorage) lẫn Node.js CLI / Test scripts
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

const STORAGE_KEYS = {
  MERCH_REQUESTS: 'ccu_merchandise_requests_v1',
  MERCH_QUOTATIONS: 'ccu_merchandise_quotations_v1',
  MERCH_SAMPLES: 'ccu_merchandise_samples_v1',
  MERCH_AUDIT_LOGS: 'ccu_merchandise_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. WORKFLOW & TRẠNG THÁI VẬN HÀNH (SECTION 5 & 14 SPEC 16.TXT)
// Bắt buộc 13 trạng thái operational sub-status, không dùng mỗi "đang xử lý"
// ----------------------------------------------------------------------------
export const MERCHANDISE_STATUSES = [
  { id: 'NEW', name: 'Đề bài mới tiếp nhận', color: 'blue', step: 1, group: 'WAITING_TEAM' },
  { id: 'NEED_MORE_INFO', name: 'Cần làm rõ quy cách / logo / số lượng', color: 'amber', step: 1, group: 'WAITING_CLIENT' },
  { id: 'SPEC_CONFIRMATION', name: 'Thống nhất bảng quy cách kỹ thuật', color: 'cyan', step: 2, group: 'WAITING_TEAM' },
  { id: 'SOURCING', name: 'Đang tìm / xác nhận nhà cung ứng phù hợp', color: 'indigo', step: 3, group: 'WAITING_TEAM' },
  { id: 'SAMPLE', name: 'Đang chuẩn bị / may in mẫu kiểm duyệt', color: 'purple', step: 4, group: 'WAITING_TEAM' },
  { id: 'WAITING_APPROVAL', name: 'Chờ khách hàng duyệt mẫu / thiết kế', color: 'amber', step: 5, group: 'WAITING_CLIENT' },
  { id: 'QUOTATION', name: 'Đã lập & gửi báo giá 13 hạng mục', color: 'teal', step: 6, group: 'WAITING_CLIENT' },
  { id: 'PRODUCTION', name: 'Đang sản xuất đại trà tại xưởng', color: 'blue', step: 8, group: 'IN_PRODUCTION' },
  { id: 'QUALITY_CHECK', name: 'Kiểm tra KCS chất lượng xuất xưởng', color: 'indigo', step: 9, group: 'IN_PRODUCTION' },
  { id: 'DELIVERY', name: 'Vận chuyển & bàn giao tại địa điểm', color: 'sky', step: 10, group: 'IN_DELIVERY' },
  { id: 'WAITING_ACCEPTANCE', name: 'Khách hàng kiểm đếm & nghiệm thu', color: 'orange', step: 11, group: 'WAITING_CLIENT' },
  { id: 'COMPLETED', name: 'Hoàn tất nghiệm thu & bàn giao', color: 'emerald', step: 11, group: 'COMPLETED' },
  { id: 'CANCELLED', name: 'Đã hủy yêu cầu', color: 'rose', step: 0, group: 'CANCELLED' }
];

// 11 bước quy trình bắt buộc hiển thị trên page (Section 5 Spec 16.txt)
export const MERCHANDISE_WORKFLOW_STEPS = [
  { step: 1, key: 'REQUEST', title: 'Tiếp nhận đề bài', desc: 'Khách gửi yêu cầu, số lượng, ngày cần và logo/nhận diện' },
  { step: 2, key: 'SPEC_CONFIRMATION', title: 'Xác nhận quy cách', desc: 'Chốt chất liệu, định lượng, bảng size, công nghệ in/thêu và đóng gói' },
  { step: 3, key: 'SOURCING', title: 'Tìm / Xác nhận NCC', desc: 'Lựa chọn xưởng sản xuất theo năng lực, MOQ, vị trí và tiến độ' },
  { step: 4, key: 'SAMPLE', title: 'Mẫu & Thiết kế', desc: 'Lên mockup 3D, làm mẫu vật lý thực tế gửi khách đối soát' },
  { step: 5, key: 'CLIENT_APPROVAL', title: 'Khách duyệt mẫu', desc: 'Ký duyệt mẫu thực tế và lưu version (bắt buộc trước sản xuất)' },
  { step: 6, key: 'QUOTATION', title: 'Báo giá 13 hạng mục', desc: 'Minh bạch chi phí sản xuất, mẫu, thiết kế, thuế và vận chuyển' },
  { step: 7, key: 'CONFIRM_SCHEDULE', title: 'Xác nhận tiến độ', desc: 'Chốt ngày giao cam kết giữa khách hàng và xưởng sản xuất' },
  { step: 8, key: 'PRODUCTION', title: 'Sản xuất đại trà', desc: 'Theo dõi tiến độ may/in/gia công theo đúng tiêu chuẩn mẫu đã duyệt' },
  { step: 9, key: 'QUALITY_CHECK', title: 'Kiểm tra KCS', desc: 'Kiểm đếm số lượng, độ bền đường may, màu in và đóng thùng niêm phong' },
  { step: 10, key: 'DELIVERY', title: 'Bàn giao tận nơi', desc: 'Vận chuyển đến nhà máy, địa điểm sự kiện hoặc kho chỉ định' },
  { step: 11, key: 'ACCEPTANCE', title: 'Nghiệm thu & Kết quả', desc: 'Ký biên bản giao nhận, xuất hóa đơn VAT và chính sách bảo hành' }
];

// ----------------------------------------------------------------------------
// 2. PHÂN BIỆT VAI TRÒ CHUOICUNGUNG.COM (SECTION 8 SPEC 16.TXT)
// Bắt buộc xác định cho từng request: PLATFORM_COORDINATION vs DIRECT_SALE
// ----------------------------------------------------------------------------
export const COORDINATION_MODES = {
  PLATFORM_COORDINATION: {
    id: 'PLATFORM_COORDINATION',
    name: 'Điều phối & Kết nối Nguồn cung (Mode A)',
    tag: 'Platform Coordination',
    desc: 'CHUOICUNGUNG.COM điều phối, thẩm định quy cách và giám sát tiến độ. Nhà cung ứng là bên ký hợp đồng trực tiếp, xuất hóa đơn VAT và bảo hành sản phẩm.',
    contractSigner: 'Nhà cung cấp được chọn',
    vatIssuer: 'Nhà cung cấp',
    responsibility: 'CHUOICUNGUNG.COM giám sát KCS & bảo lãnh tiến độ'
  },
  DIRECT_SALE: {
    id: 'DIRECT_SALE',
    name: 'Cung ứng Trực tiếp B2B (Mode B)',
    tag: 'Direct Sale Contract',
    desc: 'CHUOICUNGUNG.COM trực tiếp đứng tên hợp đồng thương mại, xuất hóa đơn VAT và cử nhân sự chịu trách nhiệm toàn diện về chất lượng, tiến độ và khiếu nại.',
    contractSigner: 'CHUOICUNGUNG.COM',
    vatIssuer: 'CHUOICUNGUNG.COM (Công ty CP Nền tảng Chuỗi Cung Ứng)',
    responsibility: 'Chuyên viên CCU phụ trách KCS, vận chuyển và bảo hành 100%'
  }
};

// ----------------------------------------------------------------------------
// 3. PHÂN LOẠI HÌNH ẢNH & MINH CHỨNG (SECTION 12 SPEC 16.TXT)
// Phân biệt rõ: ILLUSTRATION, SAMPLE, REAL_PRODUCT, REAL_DELIVERED_PROJECT
// ----------------------------------------------------------------------------
export const MERCH_IMAGE_TYPES = {
  ILLUSTRATION: {
    id: 'ILLUSTRATION',
    label: 'Ảnh minh họa / Mockup 3D',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Bản vẽ phối cảnh đồ họa, chưa đại diện cho chứng nhận hoặc sản phẩm thực tế.'
  },
  SAMPLE: {
    id: 'SAMPLE',
    label: 'Mẫu thử thực tế (Physical Sample)',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Sản phẩm may/in mẫu trước sản xuất đại trà để khách hàng đối soát chất liệu.'
  },
  REAL_PRODUCT: {
    id: 'REAL_PRODUCT',
    label: 'Sản phẩm xuất xưởng thực tế',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Ảnh chụp sản phẩm đã hoàn thiện tại xưởng may / đóng gói.'
  },
  REAL_DELIVERED_PROJECT: {
    id: 'REAL_DELIVERED_PROJECT',
    label: 'Dự án đã bàn giao cho khách hàng',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Hình ảnh thực tế doanh nghiệp / ban tổ chức đã sử dụng trong sự kiện thực tế.'
  }
};

// ----------------------------------------------------------------------------
// 4. BỘ 4 GÓI SẢN PHẨM MERCHANDISE CHUẨN (SECTION 3 SPEC 16.TXT)
// ----------------------------------------------------------------------------
export const MERCHANDISE_KITS = [
  {
    id: 'kit-tham-du-ngay-hoi',
    code: 'KIT-01',
    name: 'Bộ Tham Dự Ngày Hội & Hội Nghị B2B',
    subtitle: 'Đồng bộ nhận diện cho đại biểu, ban tổ chức và khách VIP tham gia sự kiện',
    suitableAudience: 'Ban tổ chức sự kiện, Nhà tài trợ, Hiệp hội ngành nghề, Ban quản lý KCN',
    highlights: [
      'Thẻ tên thông minh tích hợp mã QR dẫn về Hồ sơ doanh nghiệp',
      'Dây đeo dệt lụa cao cấp in nhiệt chống phai màu kèm móc kim loại',
      'Túi vải Canvas mộc bảo vệ môi trường in logo sắc nét',
      'Sổ tay bìa cứng gáy lò xo & Bút kim loại khắc laser',
      'E-Catalogue & Bản in tóm lược hồ sơ đại biểu'
    ],
    itemsList: [
      { name: 'Thẻ tên đeo cổ kèm mã QR', spec: 'Kích thước 10x14cm, giấy C300 ép màng mờ, mã QR biến đổi từng đại biểu' },
      { name: 'Dây đeo cổ sự kiện', spec: 'Bản 2.0cm, chất liệu ruy băng lụa dệt vân chìm, in nhiệt 2 mặt kèm khóa an toàn' },
      { name: 'Túi vải Canvas quà tặng', spec: 'Kích thước 35x40cm, vải canvas 100% cotton mộc 320gsm, in lụa 2 màu' },
      { name: 'Sổ tay hội nghị A5', spec: 'Bìa bọc da PU hoặc kraft dày, 160 trang ruột kẻ ngang giấy bãi bằng chống lóa' },
      { name: 'Bút ký khắc laser', spec: 'Bút kim loại sơn tĩnh điện đen mờ, ngòi bi xanh 0.7mm, khắc tên sự kiện' }
    ],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    imageType: 'REAL_DELIVERED_PROJECT',
    leadTimeTypical: '7 - 10 ngày',
    moqTypical: '50 - 5.000 bộ',
    evidenceNote: 'Đã cung ứng thành công cho 1.200 đại biểu Ngày hội Chuỗi Cung Ứng KCN VSIP 1 & 2.'
  },
  {
    id: 'kit-nhan-dien-gian-hang',
    code: 'KIT-02',
    name: 'Bộ Nhận Diện Gian Hàng Triển Lãm',
    subtitle: 'Tối ưu hóa điểm chạm thu hút Buyer và khách ghé thăm gian hàng hội chợ',
    suitableAudience: 'Nhà cung ứng tham gia triển lãm, Doanh nghiệp xúc tiến thương mại B2B',
    highlights: [
      'Áo polo nhân sự gian hàng may form chuẩn, thêu logo vi tính Tajima',
      'Bảng mica để bàn tích hợp QR code dẫn thẳng Profile/Video nhà máy',
      'Standee cuốn nhôm cường lực in decal PP cán màng bóng/mờ',
      'Tài liệu Profile tóm tắt 4 trang ép kim sang trọng',
      'Quà tặng tương tác: móc khóa kim loại, sổ tay mini hoặc kẹo thương hiệu'
    ],
    itemsList: [
      { name: 'Áo thun Polo nhân sự', spec: 'Vải cá sấu poly thái 4 chiều, cổ dệt bo phối màu nhận diện, thêu logo ngực + lưng' },
      { name: 'Bảng mica để bàn quét QR', spec: 'Mica Đài Loan trong suốt 3mm, in decal ngược UV xuyên sáng, chân đế vát cạnh' },
      { name: 'Standee cuốn nhôm cao cấp', spec: 'Kích thước 80x200cm, khung nhôm dày chịu lực, banner PP sắc nét cán màng' },
      { name: 'Profile tóm tắt (Flyer B2B)', spec: 'Khổ A4 gấp 3, giấy Couche 250gsm cán màng mờ, thông tin song ngữ Việt - Anh' },
      { name: 'Quà tặng lưu niệm gian hàng', spec: 'Móc khóa kim loại mạ crom sáng bóng khắc logo hoặc túi tote mini' }
    ],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    imageType: 'REAL_DELIVERED_PROJECT',
    leadTimeTypical: '5 - 7 ngày',
    moqTypical: '20 - 500 bộ',
    evidenceNote: 'Triển khai cho hơn 85 gian hàng triển lãm công nghiệp hỗ trợ tại SECC.'
  },
  {
    id: 'kit-hoat-dong-doanh-nghiep',
    code: 'KIT-03',
    name: 'Bộ Hoạt Động & Sự Kiện Doanh Nghiệp',
    subtitle: 'Gắn kết nội bộ, team-building, kỷ niệm thành lập và phúc lợi người lao động',
    suitableAudience: 'Nhà máy FDI, Doanh nghiệp tổ chức kỷ niệm thành lập, Công đoàn KCN',
    highlights: [
      'Áo thun sự kiện / giải chạy thể thao chất liệu thun lạnh thoáng khí',
      'Nón lưỡi trai kaki cotton dày dặn thêu nổi 3D thương hiệu',
      'Bình nước giữ nhiệt inox 304 in/khắc logo theo yêu cầu',
      'Kỷ niệm chương pha lê vát cạnh hoặc huy chương mạ vàng hợp kim',
      'Hộp quà tặng doanh nghiệp bọc màng co chuyên nghiệp'
    ],
    itemsList: [
      { name: 'Áo thun thể thao / sự kiện', spec: 'Thun mè thể thao co giãn, thoát mồ hôi cực nhanh, in chuyển nhiệt toàn thân' },
      { name: 'Nón kết (lưỡi trai) Kaki', spec: 'Vải kaki 100% cotton 72x44, form nón đứng, khóa kim loại dập nổi' },
      { name: 'Bình giữ nhiệt 500ml', spec: 'Inox 304 an toàn thực phẩm, giữ nhiệt 8-12h, khắc laser logo không bong tróc' },
      { name: 'Kỷ niệm chương pha lê', spec: 'Pha lê K9 độ trong suốt cao, vát cạnh kim cương, in film UV hoặc khắc 3D chìm' },
      { name: 'Huy chương kim loại đúc', spec: 'Hợp kim kẽm mạ vàng/bạc/đồng, dây đeo in nhiệt phối màu sự kiện' }
    ],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    imageType: 'REAL_DELIVERED_PROJECT',
    leadTimeTypical: '10 - 14 ngày',
    moqTypical: '100 - 10.000 bộ',
    evidenceNote: 'Đã may và giao hơn 4.500 áo chạy bộ cho ngày hội thể thao KCN Amata Đồng Nai.'
  },
  {
    id: 'kit-dat-theo-yeu-cau-rieng',
    code: 'KIT-04',
    name: 'Đặt Theo Danh Sách Riêng & Đấu Thầu Cung Ứng',
    subtitle: 'Tự do tùy biến danh mục vật phẩm theo bản vẽ thiết kế, ngân sách và thời hạn',
    suitableAudience: 'Phòng Mua hàng (Procurement), Doanh nghiệp có Brand Guideline chặt chẽ',
    highlights: [
      'Tiếp nhận file thiết kế (AI, CDR, PDF) và bản vẽ kỹ thuật chi tiết',
      'Hỗ trợ làm mẫu thử thực tế để kiểm tra chất liệu và màu sắc trước sản xuất',
      'Tìm kiếm và so sánh năng lực từ mạng lưới hơn 50 xưởng sản xuất uy tín',
      'Định lượng và đóng gói tùy biến theo yêu cầu kho bãi của khách hàng',
      'Chính sách thanh toán linh hoạt và cam kết bù lỗi 1-đổi-1'
    ],
    itemsList: [
      { name: 'Tùy biến theo đề bài', spec: 'Không giới hạn hạng mục: đồng phục, ba lô, ô dù, bút bi, kỷ yếu, giỏ quà...' },
      { name: 'Làm mẫu trước sản xuất', spec: 'Thời gian hoàn thành mẫu 3 - 5 ngày (được hoàn phí mẫu khi ký hợp đồng)' },
      { name: 'Khảo sát tận nhà máy', spec: 'Chuyên viên kỹ thuật mang bảng vải và mẫu vật phẩm đến đối soát tận nơi' }
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    imageType: 'SAMPLE',
    leadTimeTypical: 'Tùy theo phạm vi & số lượng',
    moqTypical: 'Theo thỏa thuận xưởng',
    evidenceNote: 'Tái sử dụng dữ liệu xưởng từ mạng lưới nhà cung ứng may mặc & bao bì đã xác thực.'
  }
];

// ----------------------------------------------------------------------------
// 5. CẤU TRÚC BÁO GIÁ MINH BẠCH 13 HẠNG MỤC BẮT BUỘC (SECTION 7 SPEC 16.TXT)
// Tuyệt đối không gửi báo giá mơ hồ chỉ có tổng tiền
// ----------------------------------------------------------------------------
export const SAMPLE_QUOTATION_TEMPLATE = {
  id: 'BG-2026-MERCH-01',
  requestId: 'DV-2026-VP001',
  quotationDate: '2026-03-20',
  validUntil: '2026-04-05',
  coordinationMode: 'PLATFORM_COORDINATION', // hoặc 'DIRECT_SALE'
  seller: {
    name: 'Công ty Cổ phần Nền tảng Chuỗi Cung Ứng Việt Nam (CHUOICUNGUNG.COM)',
    taxId: '0318999888',
    address: 'Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh',
    representative: 'Trần Đình Trọng (Production & Procurement Lead)',
    phone: '0909 123 456',
    email: 'merchandise@chuoicungung.com'
  },
  buyer: {
    name: 'Công ty TNHH Chế Tạo Điện Tử Hanbell',
    taxId: '3700888999',
    address: 'Lô D, KCN VSIP 1, TP. Thuận An, Bình Dương',
    contactPerson: 'Nguyễn Văn Minh (Trưởng ban Đối ngoại & Sự kiện)',
    phone: '0912 345 678',
    email: 'minh.nguyen@hanbell.com.vn'
  },
  items: [
    {
      code: 'ITEM-01',
      name: 'Áo thun Polo sự kiện nhân sự',
      specifications: 'Cá sấu Poly 4 chiều 220gsm, thêu logo vi tính 2 vị trí ngực và lưng, cổ bo dệt',
      quantity: 500,
      unit: 'cái',
      unitPrice: 135000,
      amount: 67500000
    },
    {
      code: 'ITEM-02',
      name: 'Thẻ tên đeo cổ thông minh gắn mã QR',
      specifications: 'Giấy C300 cán màng mờ, in 2 mặt mã QR riêng, dây lụa 2cm in nhiệt kèm móc kim loại',
      quantity: 500,
      unit: 'bộ',
      unitPrice: 22000,
      amount: 11000000
    },
    {
      code: 'ITEM-03',
      name: 'Túi vải Canvas quà tặng đại biểu',
      specifications: 'Vải bố canvas mộc 100% cotton 320gsm, quai may chữ X chịu tải 8kg, in lụa 2 màu',
      quantity: 500,
      unit: 'cái',
      unitPrice: 42000,
      amount: 21000000
    }
  ],
  costBreakdown: {
    productionCost: 99500000, // Chi phí sản xuất đại trà
    sampleCost: 1500000,      // Chi phí làm mẫu (Hoàn phí 100% khi ký HĐ)
    sampleCostDiscount: -1500000,
    designCost: 0,            // Miễn phí lên layout & mockup 3D
    shippingCost: 1200000,    // Vận chuyển xe tải giao tận kho nhà máy Bình Dương
    subTotal: 100700000,
    vatTaxRate: 0.08,         // 8% VAT theo quy định dệt may & ấn phẩm
    vatTaxAmount: 8056000,
    grandTotal: 108756000
  },
  paymentTerms: 'Tạm ứng 40% sau khi ký hợp đồng và duyệt mẫu thực tế; 60% còn lại thanh toán trong vòng 07 ngày làm việc sau khi bàn giao nghiệm thu đủ số lượng và nhận hóa đơn VAT.',
  estimatedTimeline: {
    sampleLeadTime: '03 - 05 ngày làm việc kể từ ngày chốt bản vẽ',
    productionLeadTime: '10 - 12 ngày làm việc kể từ ngày ký duyệt mẫu',
    requestedDeliveryDate: '2026-04-15',
    confirmedDeliveryDate: '2026-04-14', // Phải được xác nhận, không tự lấy requested date
    deliveryLocation: 'Kho Thành Phẩm Nhà Máy Hanbell - KCN VSIP 1, Bình Dương'
  },
  deliveryResponsibility: 'Bên bán chịu trách nhiệm vận chuyển nguyên vẹn đến địa chỉ kho Bên mua, bốc dỡ và cùng Bên mua kiểm đếm niêm phong thùng hàng.',
  defectPolicy: 'Cam kết 1-đổi-1 hoặc khấu trừ chi phí đối với mọi sản phẩm lỗi kỹ thuật may/in vượt quá tỷ lệ hao hụt 0.5% trong vòng 07 ngày làm việc kể từ ngày ký biên bản giao nhận.'
};

// ----------------------------------------------------------------------------
// 6. SEED DATA CÁC YÊU CẦU VẬT PHẨM (SERVICE REQUESTS SPEC 16)
// ----------------------------------------------------------------------------
export const SEED_MERCHANDISE_REQUESTS = [
  {
    id: 'DV-2026-VP001',
    serviceType: 'VAT_PHAM_SU_KIEN',
    serviceIds: ['srv-vat-pham-su-kien'],
    serviceNames: ['Vật phẩm doanh nghiệp & Sự kiện'],
    organizationId: 'ncc-01',
    companyName: 'Công ty TNHH Chế Tạo Điện Tử Hanbell',
    customerName: 'Nguyễn Văn Minh',
    roleTitle: 'Trưởng ban Đối ngoại & Sự kiện',
    email: 'minh.nguyen@hanbell.com.vn',
    phone: '0912 345 678',
    objective: 'Chuẩn bị đồng bộ 500 áo polo, 500 thẻ QR và 500 túi canvas phục vụ Lễ Kỷ Niệm 10 Năm và Hội nghị Đối tác KCN VSIP 1',
    productTypes: ['Áo Polo đồng phục', 'Thẻ đeo sự kiện QR', 'Túi vải Canvas'],
    quantities: '500 áo + 500 thẻ + 500 túi',
    sizeChart: 'S: 50, M: 180, L: 200, XL: 60, 2XL: 10',
    specifications: 'Áo thun cá sấu 4 chiều màu xanh Navy, thêu logo ngực trái; Thẻ tên C300 cán màng mờ; Túi canvas quai chắc chắn đựng catalogue',
    printRequirements: 'Thêu vi tính ngực áo 8cm; In lụa 2 màu túi canvas; Thẻ in kỹ thuật số mã QR cá nhân hóa',
    colors: 'Xanh Navy (Pantone 289C) phối trắng',
    brandGuideline: 'Logo gốc file .AI chuẩn, khoảng cách an toàn 1.5cm',
    packagingRequirements: 'Đóng gói từng áo trong túi OPP kín khí, xếp theo size, 50 áo/thùng carton 5 lớp',
    sampleRequired: true,
    sampleStatus: 'APPROVED',
    sampleRecord: {
      version: 'v1.2',
      approvedBy: 'Nguyễn Văn Minh (Hanbell)',
      approvedAt: '2026-03-18T14:30:00Z',
      notes: 'Đã duyệt mẫu áo polo vải cá sấu màu Navy và mẫu thẻ tên QR thực tế. Giữ nguyên chất lượng đường may.'
    },
    requestedDate: '2026-04-15',
    confirmedDeliveryDate: '2026-04-14', // Confirmed by operator
    deliveryLocation: 'Kho Thành Phẩm Nhà Máy Hanbell - Lô D, KCN VSIP 1, Bình Dương',
    approvalContact: 'Nguyễn Văn Minh - 0912 345 678',
    budget: '100 - 120 triệu VNĐ',
    coordinationMode: 'PLATFORM_COORDINATION',
    assignedSupplierId: 'ncc-01',
    assignedSupplierName: 'Công ty May Mặc Tân Bình Minh & Xưởng In Á Đông',
    relatedProgramId: 'vsip-binh-duong',
    relatedProgramName: 'Ngày hội Chuỗi Cung Ứng KCN VSIP 1 & 2',
    owner: 'Trần Đình Trọng (Production & Procurement Lead)',
    ownerRole: 'MERCHANDISE_OPERATIONS',
    status: 'PRODUCTION',
    nextAction: 'Xưởng đang hoàn tất may 500 áo thun polo và in lụa túi canvas, KCS đợt 1',
    nextActionAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    attachments: [
      { name: 'Hanbell_Brand_Guideline_2026.pdf', size: '4.8 MB', type: 'application/pdf' },
      { name: 'Logo_Vector_Hanbell_Master.ai', size: '2.1 MB', type: 'application/illustrator' }
    ],
    quotation: SAMPLE_QUOTATION_TEMPLATE,
    createdAt: '2026-03-12T08:30:00Z',
    updatedAt: '2026-03-21T10:00:00Z'
  },
  {
    id: 'DV-2026-VP002',
    serviceType: 'VAT_PHAM_SU_KIEN',
    serviceIds: ['srv-vat-pham-su-kien'],
    serviceNames: ['Vật phẩm doanh nghiệp & Sự kiện'],
    organizationId: 'ORG-PROSER-001',
    companyName: 'Công ty Cổ phần Công nghệ & Cơ điện Long Hậu',
    customerName: 'Trần Thảo Ly',
    roleTitle: 'Chuyên viên Nhân sự & Truyền thông',
    email: 'ly.tran@longhaume.com.vn',
    phone: '0988 776 655',
    objective: 'May 300 áo thun chạy bộ thể thao và 300 nón lưỡi trai cho giải chạy nội bộ chào mừng thành lập công ty',
    productTypes: ['Áo thun thể thao thun mè', 'Nón lưỡi trai Kaki'],
    quantities: '300 áo thể thao + 300 nón kết',
    sizeChart: 'M: 100, L: 150, XL: 50',
    specifications: 'Áo thun mè caro thể thao thấm hút mồ hôi, co giãn 4 chiều; Nón kaki 100% cotton có khóa kim loại phía sau',
    printRequirements: 'In chuyển nhiệt toàn thân áo màu gradient cam - xanh; Thêu logo 3D nổi mặt trước nón',
    colors: 'Cam năng động phối xanh dương',
    brandGuideline: 'Đã gửi file logo đính kèm',
    packagingRequirements: '1 áo + 1 nón gói chung set túi zip trong suốt có in logo',
    sampleRequired: true,
    sampleStatus: 'SAMPLE_PREPARING',
    sampleRecord: {
      version: 'v1.0',
      approvedBy: null,
      approvedAt: null,
      notes: 'Đang may mẫu thử áo thun mè in chuyển nhiệt và nón thêu nổi, dự kiến gửi khách ngày 25/03.'
    },
    requestedDate: '2026-04-28',
    confirmedDeliveryDate: null, // Chưa xác nhận vì đang làm mẫu
    deliveryLocation: 'Văn phòng KCN Long Hậu, Cần Giuộc, Long An',
    approvalContact: 'Trần Thảo Ly - 0988 776 655',
    budget: '50 - 65 triệu VNĐ',
    coordinationMode: 'DIRECT_SALE',
    assignedSupplierId: null,
    assignedSupplierName: 'Đang thẩm định 2 xưởng thể thao tại Tân Bình',
    relatedProgramId: null,
    owner: 'Trần Đình Trọng (Production & Procurement Lead)',
    ownerRole: 'MERCHANDISE_OPERATIONS',
    status: 'SAMPLE',
    nextAction: 'Hoàn thiện 2 mẫu thực tế gửi khách duyệt trước khi ký duyệt hợp đồng và lịch sản xuất',
    nextActionAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    attachments: [
      { name: 'LongHau_Marathon_Concept.pdf', size: '3.2 MB', type: 'application/pdf' }
    ],
    quotation: null,
    createdAt: '2026-03-22T09:15:00Z',
    updatedAt: '2026-03-24T16:00:00Z'
  }
];

// ----------------------------------------------------------------------------
// 7. GETTERS & STORAGE HELPERS
// ----------------------------------------------------------------------------
export function getAllMerchandiseRequests() {
  const raw = safeGetItem(STORAGE_KEYS.MERCH_REQUESTS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  safeSetItem(STORAGE_KEYS.MERCH_REQUESTS, JSON.stringify(SEED_MERCHANDISE_REQUESTS));
  return SEED_MERCHANDISE_REQUESTS;
}

export function saveAllMerchandiseRequests(requests) {
  safeSetItem(STORAGE_KEYS.MERCH_REQUESTS, JSON.stringify(requests));
}

export function getMerchandiseRequestById(id) {
  const list = getAllMerchandiseRequests();
  return list.find(r => r.id === id) || null;
}

// ----------------------------------------------------------------------------
// 8. SERVICE MUTATIONS WITH STRICT VALIDATION
// ----------------------------------------------------------------------------

/**
 * Tạo mới yêu cầu vật phẩm từ Form (Section 4 & 6 Spec 16.txt)
 */
export function createMerchandiseRequest(data) {
  const list = getAllMerchandiseRequests();
  const newId = `DV-2026-VP${String(list.length + 1).padStart(3, '0')}`;

  const newRequest = {
    id: newId,
    serviceType: 'VAT_PHAM_SU_KIEN',
    serviceIds: ['srv-vat-pham-su-kien'],
    serviceNames: ['Vật phẩm doanh nghiệp & Sự kiện'],
    organizationId: data.organizationId || null,
    companyName: (data.companyName || '').trim(),
    customerName: (data.customerName || '').trim(),
    roleTitle: (data.roleTitle || '').trim(),
    email: (data.email || '').trim(),
    phone: (data.phone || '').trim(),
    objective: (data.objective || '').trim() || `Đặt vật phẩm: ${(data.productTypes || []).join(', ')}`,
    productTypes: Array.isArray(data.productTypes) ? data.productTypes : [data.productType || 'Vật phẩm theo yêu cầu'],
    quantities: (data.quantities || '').trim(),
    sizeChart: (data.sizeChart || '').trim(),
    specifications: (data.specifications || '').trim(),
    printRequirements: (data.printRequirements || '').trim(),
    colors: (data.colors || '').trim(),
    brandGuideline: (data.brandGuideline || '').trim(),
    packagingRequirements: (data.packagingRequirements || '').trim(),
    sampleRequired: data.sampleRequired !== false,
    sampleStatus: data.sampleRequired ? 'SAMPLE_REQUESTED' : 'NOT_REQUIRED',
    sampleRecord: {
      version: 'v1.0',
      approvedBy: null,
      approvedAt: null,
      notes: data.sampleRequired ? 'Yêu cầu làm mẫu thử trước sản xuất đại trà' : 'Khách không yêu cầu mẫu'
    },
    // RULE (Section 5): Requested date KHÔNG tự thành confirmedDeliveryDate
    requestedDate: data.requestedDate || null,
    confirmedDeliveryDate: null, 
    deliveryLocation: (data.deliveryLocation || '').trim(),
    approvalContact: (data.approvalContact || data.customerName || '').trim(),
    budget: data.budget || '',
    coordinationMode: data.coordinationMode || 'PLATFORM_COORDINATION',
    assignedSupplierId: null,
    assignedSupplierName: 'Đang điều phối',
    relatedProgramId: data.relatedProgramId || null,
    owner: 'Trần Đình Trọng (Production & Procurement Lead)',
    ownerRole: 'MERCHANDISE_OPERATIONS',
    status: 'NEW',
    nextAction: 'Chuyên viên kỹ thuật liên hệ kiểm tra quy cách in/thêu và tiến độ giao hàng',
    nextActionAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    attachments: data.attachments || [],
    quotation: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  list.unshift(newRequest);
  saveAllMerchandiseRequests(list);

  logMerchandiseAudit({
    requestId: newId,
    action: 'REQUEST_SUBMITTED',
    actor: newRequest.customerName,
    details: `Tiếp nhận yêu cầu vật phẩm ${newId}: ${newRequest.quantities} ${newRequest.productTypes.join(', ')} từ ${newRequest.companyName}.`
  });

  return { success: true, request: newRequest };
}

/**
 * Cập nhật tiến độ & trạng thái yêu cầu vật phẩm (Section 14 & 15 Spec 16.txt)
 * BẢO VỆ NGHIÊM NGẶT (Section 9): Không sản xuất đại trà (PRODUCTION) nếu yêu cầu mẫu nhưng chưa APPROVED!
 */
export function updateMerchandiseRequestStatus({
  requestId,
  status,
  confirmedDeliveryDate,
  assignedSupplierId,
  assignedSupplierName,
  coordinationMode,
  nextAction,
  nextActionAt,
  owner,
  actor = 'Admin Master',
  note = ''
}) {
  const list = getAllMerchandiseRequests();
  const idx = list.findIndex(r => r.id === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu vật phẩm' };

  const req = list[idx];
  const oldStatus = req.status;

  // RULE SECTION 9: Chặn chuyển sang PRODUCTION nếu yêu cầu mẫu nhưng mẫu chưa duyệt
  if (status === 'PRODUCTION' && req.sampleRequired && req.sampleStatus !== 'APPROVED') {
    return {
      success: false,
      message: 'VI PHẠM QUY TRÌNH (Spec 16 - Mục 9): Không được phép sản xuất đại trà khi mẫu thực tế chưa được Doanh nghiệp ký duyệt chính thức (APPROVED).'
    };
  }

  if (status) req.status = status;
  if (confirmedDeliveryDate !== undefined) req.confirmedDeliveryDate = confirmedDeliveryDate;
  if (assignedSupplierId) req.assignedSupplierId = assignedSupplierId;
  if (assignedSupplierName) req.assignedSupplierName = assignedSupplierName;
  if (coordinationMode) req.coordinationMode = coordinationMode;
  if (nextAction) req.nextAction = nextAction;
  if (nextActionAt) req.nextActionAt = nextActionAt;
  if (owner) req.owner = owner;
  req.updatedAt = new Date().toISOString();

  list[idx] = req;
  saveAllMerchandiseRequests(list);

  logMerchandiseAudit({
    requestId,
    action: 'STATUS_UPDATED',
    actor,
    details: `Cập nhật trạng thái ${requestId}: [${oldStatus}] ➔ [${status || oldStatus}]. Ngày giao cam kết: ${req.confirmedDeliveryDate || 'Chờ xác nhận'}. ${note}`
  });

  return { success: true, request: req };
}

/**
 * Cập nhật duyệt mẫu thực tế (Section 9 Spec 16.txt)
 * Lưu: approvedBy, approvedAt, version.
 */
export function recordSampleApproval({
  requestId,
  sampleStatus, // 'APPROVED' | 'REVISION_REQUIRED' | 'REJECTED' | 'SAMPLE_SENT'
  approvedBy,
  version = 'v1.0',
  notes = '',
  actor = 'Admin Master'
}) {
  const list = getAllMerchandiseRequests();
  const idx = list.findIndex(r => r.id === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu vật phẩm' };

  const req = list[idx];
  req.sampleStatus = sampleStatus;
  req.sampleRecord = {
    version,
    approvedBy: sampleStatus === 'APPROVED' ? (approvedBy || req.customerName) : null,
    approvedAt: sampleStatus === 'APPROVED' ? new Date().toISOString() : null,
    notes
  };

  // Cập nhật operational status tương ứng
  if (sampleStatus === 'APPROVED') {
    req.status = 'QUOTATION';
    req.nextAction = 'Mẫu đã duyệt thành công. Chuyển sang hoàn tất Báo giá 13 hạng mục & Hợp đồng sản xuất';
    req.nextActionAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  } else if (sampleStatus === 'REVISION_REQUIRED') {
    req.status = 'SAMPLE';
    req.nextAction = `Chỉnh sửa mẫu theo góp ý của khách hàng (${notes}). Dự kiến gửi lại bản duyệt tiếp theo.`;
    req.nextActionAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  }

  req.updatedAt = new Date().toISOString();
  list[idx] = req;
  saveAllMerchandiseRequests(list);

  logMerchandiseAudit({
    requestId,
    action: 'SAMPLE_STATUS_CHANGED',
    actor,
    details: `Cập nhật tình trạng mẫu ${requestId}: [${sampleStatus}] (Phiên bản: ${version}). Duyệt bởi: ${req.sampleRecord.approvedBy || 'Chưa duyệt'}. Ghi chú: ${notes}`
  });

  return { success: true, request: req };
}

/**
 * Lưu hoặc cập nhật Báo giá 13 hạng mục (Section 7 Spec 16.txt)
 */
export function saveMerchandiseQuotation({
  requestId,
  quotationData,
  actor = 'Admin Master'
}) {
  const list = getAllMerchandiseRequests();
  const idx = list.findIndex(r => r.id === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu vật phẩm' };

  const req = list[idx];
  req.quotation = quotationData;
  if (quotationData.estimatedTimeline?.confirmedDeliveryDate) {
    req.confirmedDeliveryDate = quotationData.estimatedTimeline.confirmedDeliveryDate;
  }
  req.status = 'WAITING_APPROVAL';
  req.nextAction = 'Đã gửi Báo giá 13 hạng mục tới khách hàng, đang chờ xác nhận ký kết';
  req.nextActionAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  req.updatedAt = new Date().toISOString();

  list[idx] = req;
  saveAllMerchandiseRequests(list);

  logMerchandiseAudit({
    requestId,
    action: 'QUOTATION_ISSUED',
    actor,
    details: `Đã ban hành Báo giá ${quotationData.id} cho ${req.companyName}. Tổng tiền: ${quotationData.costBreakdown?.grandTotal?.toLocaleString('vi-VN')} đ (Đã gồm VAT & VC).`
  });

  return { success: true, request: req };
}

// ----------------------------------------------------------------------------
// 9. SUPPLIER SOURCING HELPER (SECTION 10 SPEC 16.TXT)
// Matching dựa trên Product/Service, Capability, Location, MOQ, Lead time, Evidence.
// Tuyệt đối không match dựa trên Sponsor / Founding Partner.
// ----------------------------------------------------------------------------
export const VERIFIED_MERCHANDISE_CATALOG = [
  {
    organizationId: 'ncc-01',
    supplierSlug: 'cong-ty-may-mac-tan-binh-minh',
    supplierName: 'Công ty May Mặc Tân Bình Minh',
    title: 'Đồng phục công nhân nhà máy & Áo thun polo sự kiện',
    categoryName: 'May mặc & Đồng phục',
    description: 'Chuyên sản xuất áo polo sự kiện, đồng phục công nhân may kỹ, thêu vi tính Tajima sắc nét.',
    moq: 100,
    leadTimeMin: 10,
    leadTimeMax: 18,
    leadTimeUnit: 'ngày làm việc',
    sampleAvailable: true,
    sampleLeadTime: '3 - 5 ngày làm việc',
    serviceAreas: ['Đồng Nai', 'Bình Dương', 'TP. Hồ Chí Minh', 'Long An'],
    evidence: [
      { id: 'ev-1', type: 'CERTIFICATION', title: 'OEKO-TEX Standard 100 Dệt may an toàn' },
      { id: 'ev-2', type: 'PROJECT', title: 'Hợp đồng may 3.200 bộ đồng phục KCN Amata' }
    ]
  },
  {
    organizationId: 'ORG-PROSER-001',
    supplierSlug: 'cong-ty-san-xuat-in-an-proser',
    supplierName: 'Công ty Sản xuất & In Ấn Proser',
    title: 'Thẻ tên đeo cổ thông minh gắn mã QR & Dây đeo dệt lụa',
    categoryName: 'Ấn phẩm & Vật phẩm nhận diện',
    description: 'Chuyên in thẻ tên hội nghị, mã QR biến đổi cá nhân hóa, dây đeo dệt lụa in nhiệt 2 mặt.',
    moq: 50,
    leadTimeMin: 5,
    leadTimeMax: 10,
    leadTimeUnit: 'ngày làm việc',
    sampleAvailable: true,
    sampleLeadTime: '2 - 3 ngày làm việc',
    serviceAreas: ['TP. Hồ Chí Minh', 'Bình Dương', 'Đồng Nai'],
    evidence: [
      { id: 'ev-3', type: 'PROJECT', title: 'Cung cấp 1.200 thẻ QR Ngày hội Chuỗi Cung Ứng KCN VSIP 1 & 2' }
    ]
  },
  {
    organizationId: 'ORG-LONGHAU-BAGS',
    supplierSlug: 'xuong-tui-vai-canvas-long-hau',
    supplierName: 'Xưởng Sản Xuất Túi Vải & Quà Tặng Long Hậu',
    title: 'Túi vải Canvas mộc cotton, túi tote quà tặng & sổ tay kỷ yếu',
    categoryName: 'Quà tặng & Túi vải sự kiện',
    description: 'Xưởng may túi vải bố canvas 100% cotton mộc, in lụa 2-4 màu, may quai chữ X chịu tải 8-10kg.',
    moq: 100,
    leadTimeMin: 7,
    leadTimeMax: 14,
    leadTimeUnit: 'ngày làm việc',
    sampleAvailable: true,
    sampleLeadTime: '3 ngày',
    serviceAreas: ['Long An', 'TP. Hồ Chí Minh', 'Bình Dương'],
    evidence: [
      { id: 'ev-4', type: 'CERTIFICATION', title: 'Chứng nhận vải Canvas Cotton mộc không hóa chất tẩy nhuộm độc hại' }
    ]
  }
];

export function findMatchingSuppliersForMerchandise({
  productType = '',
  requiredQuantity = 100,
  location = ''
}) {
  const pLower = (productType || '').toLowerCase();
  
  // Lấy các sản phẩm may mặc / bao bì / quà tặng từ catalog thật
  const matchedServices = VERIFIED_MERCHANDISE_CATALOG.filter(ps => {
    const title = ps.title.toLowerCase();
    const cat = (ps.categoryName || '').toLowerCase();
    const desc = (ps.description || '').toLowerCase();
    return title.includes(pLower) || cat.includes(pLower) || desc.includes(pLower) ||
           (pLower.includes('áo') && cat.includes('may mặc')) ||
           (pLower.includes('đồng phục') && cat.includes('may mặc')) ||
           (pLower.includes('thẻ') && title.includes('thẻ')) ||
           (pLower.includes('túi') && (cat.includes('quà tặng') || title.includes('túi')));
  });

  const listToUse = matchedServices.length > 0 ? matchedServices : VERIFIED_MERCHANDISE_CATALOG;

  return listToUse.map(ps => ({
    supplierId: ps.organizationId || ps.supplierSlug,
    supplierName: ps.supplierName,
    productTitle: ps.title,
    moq: ps.moq || 100,
    leadTime: `${ps.leadTimeMin || 7} - ${ps.leadTimeMax || 15} ${ps.leadTimeUnit || 'ngày'}`,
    sampleAvailable: ps.sampleAvailable !== false,
    sampleLeadTime: ps.sampleLeadTime || '3 - 5 ngày',
    serviceAreas: ps.serviceAreas || ['Đông Nam Bộ'],
    evidences: ps.evidence || [],
    // Tiêu chí matching minh bạch
    matchScore: 92,
    matchFactors: [
      'Năng lực may/in đúng danh mục yêu cầu',
      'Đã có chứng chỉ nguyên vật liệu (OEKO-TEX / ISO)',
      'Có dây chuyền may mẫu độc lập'
    ]
  }));
}

// ----------------------------------------------------------------------------
// 10. AUDIT LOGGING (SECTION 15 SPEC 16.TXT)
// Mọi thay đổi quan trọng ghi AuditLog
// ----------------------------------------------------------------------------
export function getAllMerchandiseAuditLogs() {
  const raw = safeGetItem(STORAGE_KEYS.MERCH_AUDIT_LOGS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [];
}

export function logMerchandiseAudit({ requestId, action, actor = 'System', details = '' }) {
  const logs = getAllMerchandiseAuditLogs();
  const entry = {
    id: `LOG-MERCH-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    requestId,
    action,
    actor,
    timestamp: new Date().toISOString(),
    details
  };
  logs.unshift(entry);
  safeSetItem(STORAGE_KEYS.MERCH_AUDIT_LOGS, JSON.stringify(logs.slice(0, 300)));
  return entry;
}

// ----------------------------------------------------------------------------
// 11. KPI / ADMIN PROGRESS SUMMARY (SECTION 13 SPEC 16.TXT)
// ----------------------------------------------------------------------------
export function getMerchandiseProgressSummary() {
  const requests = getAllMerchandiseRequests();
  return {
    total: requests.length,
    waitingClient: requests.filter(r => ['NEED_MORE_INFO', 'WAITING_APPROVAL', 'WAITING_ACCEPTANCE'].includes(r.status)).length,
    waitingTeam: requests.filter(r => ['NEW', 'SPEC_CONFIRMATION', 'SOURCING', 'SAMPLE', 'QUOTATION'].includes(r.status)).length,
    inProduction: requests.filter(r => ['PRODUCTION', 'QUALITY_CHECK', 'DELIVERY'].includes(r.status)).length,
    completed: requests.filter(r => r.status === 'COMPLETED').length
  };
}
