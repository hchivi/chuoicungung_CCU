// ============================================================================
// MASTER SERVICES & SERVICE REQUESTS SERVICE
// PAGE 13: TRUNG TÂM DỊCH VỤ (/dich-vu & /yeu-cau-dich-vu)
// Chuẩn hóa theo spec 13.txt - CHUOICUNGUNG.COM
// ============================================================================

import { PROGRAMS_DATA } from './programsData.js';

const STORAGE_KEYS = {
  SERVICES: 'ccu_master_services_v1',
  SERVICE_REQUESTS: 'ccu_service_requests_v1',
  AUDIT_LOGS: 'ccu_services_audit_logs_v1'
};

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

// ----------------------------------------------------------------------------
// 1. MASTER SERVICES DATA (SECTION 3, 4, 5, 6 SPEC 13.TXT)
// ----------------------------------------------------------------------------
export const MASTER_SERVICES = [
  {
    id: 'srv-to-chuc-ket-noi',
    slug: 'to-chuc-ket-noi',
    name: 'Tổ chức kết nối doanh nghiệp',
    shortDescription: 'Chuẩn bị nhu cầu, tiếp nhận đăng ký, sắp xếp cuộc gặp và theo dõi đầu việc sau chương trình.',
    description: 'Dịch vụ tổ chức các phiên giao thương B2B, ngày hội kết nối cung cầu, hội nghị kết nối nhà cung ứng tại KCN, tỉnh thành hoặc theo đề bài riêng của Hội / Tập đoàn.',
    serviceType: 'MATCHMAKING_EVENT',
    status: 'ACTIVE', // DRAFT | ACTIVE | PAUSED | INACTIVE | ARCHIVED
    acceptingRequests: true,
    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Đặng Tuấn Kiệt (Head of Matchmaking Desk)',
    targetAudience: [
      'Doanh nghiệp FDI & Nhà máy quy mô lớn',
      'Ban Quản lý KCN & Khu chế xuất',
      'Hội / Hiệp hội ngành hàng',
      'Cộng đồng Nhà cung ứng cấp 1, 2'
    ],
    deliverables: [
      'Trang chương trình & sự kiện riêng trên hệ thống',
      'Hệ thống tiếp nhận đăng ký trực tuyến & thẩm định hồ sơ',
      'Danh sách matching & sắp xếp lịch hẹn gặp mặt B2B',
      'Bảng điều phối theo dõi đầu việc sau chương trình',
      'Báo cáo kết quả kết nối & đề xuất bước triển khai tiếp'
    ],
    pricingNote: 'Nhận báo giá theo phạm vi & quy mô sự kiện',
    relatedPages: ['/chuong-trinh', '/ngay-hoi-chuoi-cung-ung'],
    ctaLabel: 'XEM DỊCH VỤ',
    ctaUrl: '/dich-vu/to-chuc-ket-noi',
    sortOrder: 1,
    publishable: true,
    icon: 'Handshake',
    badge: 'Dịch vụ trọng tâm'
  },
  {
    id: 'srv-vat-pham-su-kien',
    slug: 'vat-pham-su-kien',
    name: 'Vật phẩm doanh nghiệp & Sự kiện',
    shortDescription: 'Thiết kế và phối hợp cung ứng đồng phục, thẻ QR, túi, quà tặng và tài liệu theo yêu cầu.',
    description: 'Giải pháp trọn gói thiết kế, in ấn và phối hợp cung ứng vật phẩm nhận diện, quà tặng hội nghị, đồng phục công nhân/sự kiện và bộ tài liệu chuyên nghiệp.',
    serviceType: 'MERCHANDISE_GIFTS',
    status: 'ACTIVE',
    acceptingRequests: true,
    ownerUserId: 'USER-TRONG-OPS',
    ownerName: 'Trần Đình Trọng (Production & Procurement Lead)',
    targetAudience: [
      'Ban tổ chức sự kiện & hội nghị B2B',
      'Nhà máy & Doanh nghiệp FDI',
      'Hội ngành nghề & Câu lạc bộ doanh nghiệp'
    ],
    deliverables: [
      'Đồng phục sự kiện, áo polo & đồng phục công nhân may kỹ',
      'Thẻ đeo nhận diện thông minh tích hợp mã QR cá nhân hóa',
      'Túi vải canvas, cặp tài liệu & kỷ yếu sự kiện chất lượng cao',
      'Hộp quà tặng doanh nghiệp & giỏ quà thiết yếu bọc màng co',
      'Báo giá chi tiết theo số lượng, quy cách và mẫu vải thực tế'
    ],
    pricingNote: 'Nhận báo giá theo phạm vi & số lượng đặt hàng',
    relatedPages: ['/dich-vu/vat-pham-su-kien'],
    ctaLabel: 'XEM DỊCH VỤ',
    ctaUrl: '/dich-vu/vat-pham-su-kien',
    sortOrder: 2,
    publishable: true,
    icon: 'Package',
    badge: 'Cung ứng nhanh'
  },
  {
    id: 'srv-truyen-thong-doanh-nghiep',
    slug: 'truyen-thong-doanh-nghiep',
    name: 'Hồ sơ & Truyền thông doanh nghiệp',
    shortDescription: 'Chuẩn hóa hồ sơ, sản xuất video giới thiệu, ảnh và nội dung catalogue để sử dụng trên nhiều điểm tiếp xúc.',
    description: 'Gói dịch vụ xây dựng bộ nhận diện năng lực B2B chuẩn quốc tế: chụp ảnh cơ sở vật chất nhà xưởng, quay dựng video dây chuyền sản xuất và biên soạn Company Profile.',
    serviceType: 'MEDIA_BRANDING',
    status: 'ACTIVE',
    acceptingRequests: true,
    ownerUserId: 'USER-DUNG-MEDIA',
    ownerName: 'Tô Ngọc Dũng (Media & Strategy Director)',
    targetAudience: [
      'Nhà cung ứng muốn chuẩn hóa hồ sơ tiếp cận khách hàng FDI',
      'Nhà máy mở rộng quy mô xưởng & xuất khẩu',
      'Doanh nghiệp tham gia chuỗi cung ứng toàn cầu'
    ],
    deliverables: [
      'Bộ hồ sơ năng lực (Company Profile) chuẩn hóa song ngữ / tam ngữ',
      'Video ngắn giới thiệu nhà máy, dây chuyền và quy trình QA/QC',
      'Bộ ảnh tư liệu độ phân giải cao phục vụ xúc tiến thương mại',
      'E-Catalogue số hóa tra cứu nhanh trên di động',
      'Trang giới thiệu bảo chứng chính thức tại CHUOICUNGUNG.COM'
    ],
    pricingNote: 'Nhận báo giá theo phạm vi sản xuất',
    relatedPages: ['/dich-vu/truyen-thong-doanh-nghiep'],
    ctaLabel: 'XEM DỊCH VỤ',
    ctaUrl: '/dich-vu/truyen-thong-doanh-nghiep',
    sortOrder: 3,
    publishable: true,
    icon: 'Video',
    badge: 'Chuẩn hóa B2B'
  },
  {
    id: 'srv-hien-dien-tu-xa',
    slug: 'hien-dien-tu-xa',
    name: 'Hiện diện từ xa tại sự kiện',
    shortDescription: 'Đưa hồ sơ, video hoặc mẫu của doanh nghiệp đến chương trình phù hợp và tiếp nhận yêu cầu liên hệ theo phạm vi đã thống nhất.',
    description: 'Giải pháp xúc tiến thương mại ủy quyền: Doanh nghiệp không cần cử đoàn công tác nhưng vẫn có bàn trưng bày mẫu, phát video giới thiệu và thu thập danh thiếp của đối tác.',
    serviceType: 'REMOTE_PRESENCE',
    status: 'ACTIVE',
    acceptingRequests: true,
    ownerUserId: 'USER-TRANG-COORDINATOR',
    ownerName: 'Lê Thu Trang (Regional Coordinator Desk)',
    targetAudience: [
      'Doanh nghiệp ở các tỉnh xa hoặc nước ngoài',
      'Nhà sản xuất muốn kiểm tra dung lượng thị trường mới',
      'Đơn vị có nguồn nhân lực tham gia sự kiện hạn chế'
    ],
    deliverables: [
      'Bàn trưng bày mẫu sản phẩm đối chứng tại không gian sự kiện',
      'Phát video giới thiệu và tờ rơi catalogue trực tiếp tới Buyer',
      'Đại diện tiếp nhận yêu cầu mua sắm và danh thiếp khách thăm',
      'Biên bản bàn giao danh sách đối tác tiềm năng sau sự kiện',
      'Đầu mối liên hệ phản hồi và hỗ trợ kết nối tiếp nối'
    ],
    pricingNote: 'Nhận báo giá theo từng chương trình cụ thể',
    relatedPages: ['/dich-vu/hien-dien-tu-xa'],
    ctaLabel: 'TÌM HIỂU',
    ctaUrl: '/dich-vu/hien-dien-tu-xa',
    sortOrder: 4,
    publishable: true,
    icon: 'Radio',
    badge: 'Tiết kiệm chi phí'
  },
  // --------------------------------------------------------------------------
  // SECTION 4 SPEC 13.TXT: PHÚC LỢI DOANH NGHIỆP
  // "Chỉ hiển thị service này khi hệ thống thực sự có đối tác, có phạm vi rõ,
  // có người phụ trách, đang nhận yêu cầu. Nếu chưa sẵn sàng: ẨN. Không tạo card Coming soon."
  // --------------------------------------------------------------------------
  {
    id: 'srv-phuc-loi-doanh-nghiep',
    slug: 'phuc-loi-doanh-nghiep',
    name: 'Phúc lợi doanh nghiệp',
    shortDescription: 'Gói giải pháp phúc lợi, suất ăn, bảo hiểm và chăm lo đời sống người lao động.',
    description: 'Dịch vụ chưa kích hoạt chính thức.',
    serviceType: 'EMPLOYEE_BENEFITS',
    status: 'INACTIVE', // ẨN HOÀN TOÀN THEO SPEC
    acceptingRequests: false,
    publishable: false, // ẨN
    sortOrder: 5
  }
];

// ----------------------------------------------------------------------------
// 2. RETRIEVE SERVICES (CHỈ TRẢ VỀ DỊCH VỤ PUBLISHABLE & ACTIVE)
// ----------------------------------------------------------------------------
export function getAllPublishableServices() {
  const raw = safeGetItem(STORAGE_KEYS.SERVICES);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return parsed.filter(s => s.publishable && s.status === 'ACTIVE');
    } catch (e) {}
  }
  return MASTER_SERVICES.filter(s => s.publishable && s.status === 'ACTIVE');
}

export function getAllAdminServices() {
  const raw = safeGetItem(STORAGE_KEYS.SERVICES);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [...MASTER_SERVICES];
}

export function saveAllServices(services) {
  safeSetItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
}

export function getServiceBySlug(slug) {
  const all = getAllAdminServices();
  return all.find(s => s.slug === slug || s.id === slug) || null;
}

// ----------------------------------------------------------------------------
// 2.1. HÌNH THỨC TRIỂN KHAI TỔ CHỨC KẾT NỐI (PAGE 14 - SECTION 3 SPEC 14.TXT)
// ----------------------------------------------------------------------------
export const MATCHMAKING_MODELS = [
  {
    id: 'plant-sourcing',
    name: 'Buổi gặp nhà cung ứng cho một nhà máy',
    shortDescription: 'Tập trung giải quyết danh mục mua sắm, nội địa hóa linh kiện theo đơn đặt hàng độc quyền của 1 nhà máy FDI hoặc Tập đoàn.',
    suitableFor: 'Nhà máy FDI, Tổng thầu EPC, Nhà máy sản xuất quy mô lớn muốn mở rộng chuỗi cung ứng cấp 1, cấp 2 tại Việt Nam.',
    typicalScale: '1 Nhà máy Buyer • 8 - 15 Nhà cung ứng chọn lọc',
    deliverablesHighlight: 'Bảng đặc tả nhu cầu chuẩn hóa, shortlist nhà cung ứng phù hợp, lịch gặp 1:1, biên bản làm việc & đầu việc tiếp theo',
    tag: 'Chuyên sâu & Bảo mật'
  },
  {
    id: 'kcn-expo',
    name: 'Ngày hội Chuỗi Cung Ứng theo Hội/KCN',
    shortDescription: 'Sự kiện giao thương quy mô cụm Khu công nghiệp hoặc theo chương trình liên kết của Hội / Hiệp hội ngành nghề.',
    suitableFor: 'Ban Quản lý KCN, Đơn vị đầu tư hạ tầng KCN, Hiệp hội doanh nghiệp tỉnh/thành phố, Tổ chức xúc tiến thương mại.',
    typicalScale: '20 - 50 Nhà máy Buyer • 100 - 300 Nhà cung ứng tham gia',
    deliverablesHighlight: 'Trang sự kiện riêng, hệ thống bàn đàm phán B2B, hồ sơ năng lực số, điều phối viên tại bàn & báo cáo tổng hợp',
    tag: 'Quy mô lớn & Lan tỏa'
  },
  {
    id: 'joint-booth',
    name: 'Gian hàng chung tại hội chợ chuyên ngành',
    shortDescription: 'Hợp lực liên minh doanh nghiệp trong cùng ngành nghề tham gia trưng bày tại triển lãm, hội chợ quốc tế với chi phí tối ưu.',
    suitableFor: 'Chi hội ngành nghề, nhóm 6 - 12 doanh nghiệp SMEs cơ khí, điện tử, bao bì, nhựa kỹ thuật, bảo hộ lao động.',
    typicalScale: '6 - 12 Doanh nghiệp đồng triển lãm • Gian hàng tiêu chuẩn 36 - 72m²',
    deliverablesHighlight: 'Bộ nhận diện chung, backdrop chuyên nghiệp, catalogue số hóa, điều phối viên tiếp nhận và phân loại thông tin khách',
    tag: 'Tối ưu ngân sách'
  },
  {
    id: 'pitching-session',
    name: 'Phiên giới thiệu sản phẩm & năng lực B2B',
    shortDescription: 'Diễn đàn thuyết trình chuyên sâu (Showcase & Pitching) cho các đơn vị sở hữu công nghệ mới, vật liệu xanh hoặc giải pháp đột phá.',
    suitableFor: 'Doanh nghiệp tiên phong công nghệ, tự động hóa nhà xưởng, giải pháp chuyển đổi xanh ESG, vật liệu tái chế.',
    typicalScale: '3 - 5 Đơn vị thuyết trình • 30 - 60 Đại diện Mua hàng, Giám đốc Nhà máy & Kỹ sư trưởng',
    deliverablesHighlight: 'Kịch bản thuyết trình, video năng lực, hồ sơ kỹ thuật gửi trước cho Buyer, khảo sát quan tâm & kết nối chuyên sâu',
    tag: 'Công nghệ & Đột phá'
  }
];

// ----------------------------------------------------------------------------
// 2.2. QUY TRÌNH DỊCH VỤ 3 GIAI ĐOẠN (PAGE 14 - SECTION 4 & 11 SPEC 14.TXT)
// ----------------------------------------------------------------------------
export const QUY_TRINH_TO_CHUC_KET_NOI = [
  {
    step: 'BLOCK 01',
    phase: 'TRƯỚC CHƯƠNG TRÌNH',
    title: 'Chuẩn Hóa Nhu Cầu & Sàng Lọc Đối Tác',
    roleAi: 'SUPPI AI Assistant',
    description: 'Nhu cầu của bên mua (Buyer) phải được thẩm định và xác nhận trước khi đưa vào kế hoạch matching.',
    items: [
      'Làm rõ danh mục mua sắm và tiêu chí kỹ thuật của nhóm Buyer',
      'Thu thập và chuẩn hóa bảng mô tả nhu cầu (Sourcing Specifications)',
      'Phân loại và đối soát năng lực mạng lưới Nhà cung ứng (NCC)',
      'Chuẩn bị hồ sơ đối tác, tạo trang sự kiện & cổng đăng ký trực tuyến',
      'SUPPI AI hỗ trợ so sánh năng lực nguồn và tạo danh sách Shortlist',
      'Lập lịch hẹn đàm phán và chuẩn bị tài liệu kỹ thuật gửi trước'
    ],
    principle: 'Nhu cầu phải được xác nhận trước khi đưa vào kế hoạch matching/cuộc gặp.'
  },
  {
    step: 'BLOCK 02',
    phase: 'TRONG CHƯƠNG TRÌNH',
    title: 'Điều Phối Cuộc Gặp & Ghi Nhận Đầu Việc',
    roleAi: 'CHAINY AI Coordinator',
    description: 'Tổ chức các phiên làm việc 1:1 có người điều phối, ghi nhận yêu cầu mẫu và báo giá tại chỗ.',
    items: [
      'Xác nhận check-in đại diện Buyer và Nhà cung ứng tại bàn đàm phán',
      'Điều phối lịch gặp theo khung giờ (20 - 30 phút/phiên làm việc)',
      'Ghi nhận nhu cầu phát sinh tại bàn làm việc',
      'Ghi nhận yêu cầu gửi mẫu (Sample Request) và yêu cầu báo giá (RFQ)',
      'Xác định rõ người phụ trách (Owner) cho từng đầu mối',
      'Xác lập bước kế tiếp (Next Action) và thời hạn hoàn thành (NextActionAt)'
    ],
    principle: 'Mỗi cuộc gặp phải có: Owner, Next Action và NextActionAt cụ thể.'
  },
  {
    step: 'BLOCK 03',
    phase: 'SAU CHƯƠNG TRÌNH',
    title: 'Theo Dõi Đầu Việc & Báo Cáo Kết Quả Thực',
    roleAi: 'CHAINY AI Follow-up Desk',
    description: 'Theo dõi xuyên suốt đến khi có kết quả thử mẫu hoặc báo giá chính thức. Gặp gỡ chưa phải là kết quả.',
    items: [
      'Nhắc nhở hai bên phản hồi và gửi mẫu/báo giá đúng hạn SLA',
      'Theo dõi tiến độ đánh giá mẫu thử tại phòng Lab / Nhà máy',
      'Theo dõi tiến độ đàm phán thương mại và điều khoản hợp đồng',
      'Cập nhật tiến độ đầu việc trên Bảng điều phối tập trung',
      'Ghi nhận kết quả giao thương thực tế (Đạt chuẩn / Ký HĐ / Đang thử nghiệm)',
      'Tổng hợp báo cáo kết quả chi tiết gửi Ban tổ chức / Doanh nghiệp'
    ],
    principle: 'Meeting ≠ Result. Không tự đánh dấu thành công chỉ vì hai bên đã gặp nhau.'
  }
];

// ----------------------------------------------------------------------------
// 2.3. BẠN NHẬN ĐƯỢC GÌ: DELIVERABLES & ADD-ONS (SECTION 5 SPEC 14.TXT)
// ----------------------------------------------------------------------------
export const MATCHMAKING_DELIVERABLES = [
  { name: 'Trang chương trình & sự kiện riêng trên hệ thống', note: 'Domain chuoicungung.com/chuong-trinh/[id] đầy đủ nội dung' },
  { name: 'Biểu mẫu tiếp nhận đăng ký trực tuyến', note: 'Thu thập thông tin theo phân quyền vai trò Buyer / Supplier' },
  { name: 'Dữ liệu đăng ký được chuẩn hóa và kiểm duyệt', note: 'Chỉ bàn giao dữ liệu theo phạm vi và cam kết bảo mật' },
  { name: 'Danh sách Buyer / NCC matching theo phạm vi cho phép', note: 'Đã sàng lọc năng lực và đối chiếu đúng nhu cầu' },
  { name: 'Danh sách và lịch sắp xếp cuộc gặp B2B chi tiết', note: 'Phân ca, chỉ định bàn làm việc, có điều phối viên hỗ trợ' },
  { name: 'Bảng theo dõi đầu việc sau cuộc gặp', note: 'Theo dõi việc gửi mẫu, gửi báo giá và tiến độ phản hồi' },
  { name: 'Timeline kế hoạch follow-up trong 30 - 60 ngày', note: 'Kèm nhắc việc tự động qua hệ thống & chuyên viên CCU' },
  { name: 'Báo cáo tổng kết chương trình và kết quả kết nối', note: 'Số liệu cuộc gặp, tỷ lệ yêu cầu mẫu/báo giá, khuyến nghị' }
];

export const MATCHMAKING_ADDONS = [
  { id: 'addon-photo', name: 'Nhiếp ảnh chuyên nghiệp tư liệu sự kiện & hồ sơ', note: 'Add-on riêng' },
  { id: 'addon-video', name: 'Sản xuất Video Recap sự kiện & phóng sự B2B', note: 'Add-on riêng' },
  { id: 'addon-merch', name: 'Vật phẩm nhận diện: Thẻ QR, dây đeo, áo polo, túi canvas', note: 'Add-on riêng' },
  { id: 'addon-catalogue', name: 'Thiết kế & in ấn Kỷ yếu sự kiện, E-Catalogue', note: 'Add-on riêng' },
  { id: 'addon-booth', name: 'Thi công gian hàng trưng bày mẫu & Backdrop nhận diện', note: 'Add-on riêng' }
];

// ----------------------------------------------------------------------------
// 2.4. TRẠNG THÁI YÊU CẦU DỊCH VỤ (9 TRẠNG THÁI - SECTION 8 SPEC 14.TXT)
// ----------------------------------------------------------------------------
export const SERVICE_REQUEST_STATUSES = [
  { id: 'NEW', label: 'Mới tiếp nhận (NEW)', color: 'amber', description: 'Đề bài vừa gửi qua hệ thống' },
  { id: 'NEED_MORE_INFO', label: 'Cần bổ sung thông tin (NEED_MORE_INFO)', color: 'orange', description: 'Đang liên hệ để làm rõ mục tiêu & địa bàn' },
  { id: 'PREPARING_PROPOSAL', label: 'Đang soạn đề xuất (PREPARING_PROPOSAL)', color: 'blue', description: 'Đang xây dựng dự thảo kịch bản & deliverables' },
  { id: 'PROPOSAL_SENT', label: 'Đã gửi đề xuất (PROPOSAL_SENT)', color: 'purple', description: 'Chờ khách hàng duyệt phương án & phạm vi' },
  { id: 'ACCEPTED', label: 'Khách hàng chấp thuận (ACCEPTED)', color: 'emerald', description: 'Đã thống nhất phương án, sẵn sàng phân công Coordinator & tạo Program' },
  { id: 'IN_PROGRESS', label: 'Đang vận hành (IN_PROGRESS)', color: 'indigo', description: 'Đang thu thập nhu cầu, matching, tổ chức gặp gỡ' },
  { id: 'WAITING_ACCEPTANCE', label: 'Chờ nghiệm thu (WAITING_ACCEPTANCE)', color: 'sky', description: 'Các cuộc gặp hoàn tất, đang theo dõi đầu việc' },
  { id: 'COMPLETED', label: 'Đã hoàn tất (COMPLETED)', color: 'teal', description: 'Bàn giao đầy đủ báo cáo kết quả thực tế' },
  { id: 'CANCELLED', label: 'Đã hủy (CANCELLED)', color: 'slate', description: 'Tạm ngưng hoặc không đạt điều kiện triển khai' }
];

// ----------------------------------------------------------------------------
// 3. SERVICE REQUEST MANAGEMENT (SECTION 7, 8, 12 SPEC 13.TXT & 14.TXT)
// ----------------------------------------------------------------------------
export const SEED_SERVICE_REQUESTS = [
  {
    id: 'DV-2026-00125',
    serviceIds: ['srv-to-chuc-ket-noi', 'srv-vat-pham-su-kien'],
    serviceType: 'TO_CHUC_KET_NOI',
    serviceNames: ['Tổ chức kết nối doanh nghiệp', 'Vật phẩm doanh nghiệp & Sự kiện'],
    formatType: 'kcn-expo',
    formatName: 'Ngày hội Chuỗi Cung Ứng theo Hội/KCN',
    customerName: 'Hoàng Minh Tuấn',
    companyName: 'Hiệp hội Doanh nghiệp Cơ khí Tỉnh Đồng Nai',
    email: 'tuan.hm@dongnaimeca.org.vn',
    phone: '0913 999 888',
    objective: 'Tổ chức ngày hội kết nối chuỗi cung ứng cơ khí chính xác cho 25 nhà máy FDI tại KCN Amata và Biên Hòa 2.',
    location: 'TP. Biên Hòa, Tỉnh Đồng Nai (KCN Amata / KCN Biên Hòa 2)',
    expectedDate: 'Tháng 11/2026',
    estimatedScale: '25 Nhà máy Buyer FDI • 120 Nhà cung ứng cơ khí',
    expectedBuyerCount: 25,
    expectedSupplierCount: 120,
    scopeDetails: 'Cần kết nối 25 nhà máy cơ khí, điện tử FDI với các nhà cung cấp gia công chi tiết CNC, khuôn mẫu, ốc vít hợp kim và xử lý bề mặt xi mạ. Cần đặt kèm 150 bộ tài liệu kỷ yếu và áo polo nhận diện.',
    existingResources: 'Hội trường 300 chỗ tại KCN Amata, danh sách 30 doanh nghiệp hội viên cơ khí nòng cốt.',
    ccuSupportNeeded: 'Chuẩn hóa danh mục nhu cầu của 25 nhà máy, tạo cổng đăng ký, sàng lọc shortlist 100 NCC đủ năng lực, điều phối 120 cuộc gặp 1:1 và theo dõi gửi mẫu sau sự kiện.',
    budgetNote: 'Nhận đề xuất theo phạm vi',
    owner: 'Đặng Tuấn Kiệt (Head of Matchmaking Desk)',
    ownerRole: 'PARTNERSHIP_SALES', // PARTNERSHIP_SALES | COORDINATOR
    coordinator: null,
    status: 'PROPOSAL_SENT',
    nextAction: 'Gửi bản dự thảo phương án điều phối và khung chi phí sơ bộ qua Email/Zalo',
    nextActionAt: '2026-10-02T10:00:00Z',
    programId: null, // Chưa tạo program khi chưa ACCEPTED (Section 9)
    source: 'WEBSITE_PORTAL',
    createdAt: '2026-09-27T08:30:00Z'
  },
  {
    id: 'DV-2026-00128',
    serviceIds: ['srv-to-chuc-ket-noi'],
    serviceType: 'TO_CHUC_KET_NOI',
    serviceNames: ['Tổ chức kết nối doanh nghiệp'],
    formatType: 'plant-sourcing',
    formatName: 'Buổi gặp nhà cung ứng cho một nhà máy',
    customerName: 'Trịnh Quốc Bảo',
    companyName: 'Công ty TNHH Thiết Bị Điện Tử Kyocera Vina',
    email: 'bao.tq@kyocera-vina.com',
    phone: '0978 654 321',
    objective: 'Tìm kiếm 10 nhà cung cấp nội địa hóa linh kiện nhựa kỹ thuật và khuôn ép chính xác cho nhà máy Kyocera.',
    location: 'KCN Thăng Long 2, Tỉnh Hưng Yên',
    expectedDate: 'Tháng 10/2026',
    estimatedScale: '1 Nhà máy Buyer • 12 Nhà cung cấp chọn lọc',
    expectedBuyerCount: 1,
    expectedSupplierCount: 12,
    scopeDetails: 'Cần tìm 10-12 nhà máy ép nhựa kỹ thuật đạt chuẩn ISO 9001/IATF 16949 tại miền Bắc để đàm phán hợp đồng cung ứng 2 năm.',
    existingResources: 'Phòng họp và phòng demo mẫu tại nhà máy Kyocera Hưng Yên.',
    ccuSupportNeeded: 'Thẩm định hồ sơ năng lực 20 ứng viên, chọn lọc 12 NCC xuất sắc nhất, sắp xếp lịch gặp riêng 45 phút/phiên, lập biên bản bàn giao mẫu.',
    budgetNote: 'Nhận đề xuất theo phạm vi',
    owner: 'Lê Thu Trang (Regional Coordinator Desk)',
    ownerRole: 'COORDINATOR',
    coordinator: 'Lê Thu Trang (Regional Coordinator Desk)',
    status: 'ACCEPTED', // Đã chấp thuận phương án
    nextAction: 'Khởi tạo Program chính thức trên hệ thống và gửi thư mời các NCC trong shortlist',
    nextActionAt: '2026-09-30T16:00:00Z',
    programId: 'kyocera-hung-yen-sourcing-2026',
    source: 'DIRECT_HOTLINE',
    createdAt: '2026-09-26T14:20:00Z'
  },
  {
    id: 'DV-2026-00130',
    serviceIds: ['srv-truyen-thong-doanh-nghiep'],
    serviceType: 'MEDIA_BRANDING',
    serviceNames: ['Hồ sơ & Truyền thông doanh nghiệp'],
    formatType: null,
    formatName: 'Hồ sơ & Truyền thông doanh nghiệp',
    customerName: 'Nguyễn Bích Thủy',
    companyName: 'Công ty TNHH Nhựa Kỹ Thuật Tân Tiến',
    email: 'thuy.nb@tantienplastic.vn',
    phone: '0908 123 456',
    objective: 'Xây dựng bộ nhận diện năng lực nhà máy ép nhựa chuẩn quốc tế để tiếp cận các khách hàng FDI tại VSIP 1.',
    location: 'KCN VSIP 1, TP. Thuận An, Tỉnh Bình Dương',
    expectedDate: 'Trước 15/10/2026',
    estimatedScale: 'Xưởng 4.500m² tại KCN VSIP 1',
    scopeDetails: 'Cần quay video 3 phút giới thiệu dàn máy ép nhựa 350 - 850 tấn và chụp ảnh hồ sơ năng lực gửi khách hàng Samsung.',
    budgetNote: 'Nhận báo giá theo phạm vi',
    owner: 'Tô Ngọc Dũng (Media & Strategy Director)',
    ownerRole: 'PARTNERSHIP_SALES',
    coordinator: null,
    status: 'PREPARING_PROPOSAL',
    nextAction: 'Gửi bản dự thảo kịch bản quay phim và phương án chụp ảnh',
    nextActionAt: '2026-10-02T15:00:00Z',
    programId: null,
    source: 'WEBSITE_PORTAL',
    createdAt: '2026-09-28T09:15:00Z'
  }
];

export function getAllServiceRequests() {
  const raw = safeGetItem(STORAGE_KEYS.SERVICE_REQUESTS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [...SEED_SERVICE_REQUESTS];
}

export function saveAllServiceRequests(requests) {
  safeSetItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(requests));
}

/**
 * Gửi đề bài / yêu cầu dịch vụ (Section 7, 8, 12 Spec 13.txt & 14.txt)
 * Hỗ trợ chọn 1 hoặc nhiều dịch vụ kết hợp (serviceIds[])
 */
export function submitServiceRequest({
  serviceIds = [],
  serviceType,
  formatType = '',
  formatName = '',
  customerName,
  companyName,
  organizationId = '',
  email,
  phone,
  objective = '',
  targetAudience = '',
  categories = '',
  location = '',
  expectedDate = '',
  scale = '',
  estimatedScale = '',
  expectedBuyerCount = null,
  expectedSupplierCount = null,
  existingResources = '',
  ccuSupportNeeded = '',
  scopeDetails = '',
  budget = '',
  budgetNote = 'Nhận đề xuất theo phạm vi',
  source = 'WEBSITE_PORTAL',
  // Page 15 Spec Fields (Hồ sơ & Truyền thông doanh nghiệp)
  itemsNeeded = [], // ['ho-so', 'video', 'anh', 'catalogue']
  targetProducts = '',
  shootingLocation = '',
  existingDocs = '',
  brandAssets = '',
  languages = [],
  distributionChannels = [],
  contentApprover = '',
  deadline = '',
  files = [],
  // Page 16 Spec Fields (Vật phẩm doanh nghiệp & sự kiện)
  productTypes = [],
  quantities = '',
  sizeChart = '',
  specifications = '',
  printRequirements = '',
  colors = '',
  brandGuideline = '',
  packagingRequirements = '',
  sampleRequired = true,
  requestedDate = '',
  deliveryLocation = '',
  approvalContact = '',
  coordinationMode = 'PLATFORM_COORDINATION',
  relatedProgramId = null
}) {
  const requests = getAllServiceRequests();
  const allServices = getAllAdminServices();

  const selectedServices = allServices.filter(s => serviceIds.includes(s.id) || serviceIds.includes(s.slug));
  const serviceNames = selectedServices.map(s => s.name);
  const primaryOwner = selectedServices[0]?.ownerName || 'Đặng Tuấn Kiệt (Head of Matchmaking Desk)';
  const determinedServiceType = serviceType || (selectedServices[0]?.serviceType || 'TO_CHUC_KET_NOI');

  const newRequestId = `DV-2026-${String(Date.now()).slice(-5)}`;

  const newRequest = {
    id: newRequestId,
    serviceIds: selectedServices.map(s => s.id),
    serviceType: determinedServiceType,
    serviceNames: serviceNames.length > 0 ? serviceNames : ['Yêu cầu dịch vụ B2B'],
    formatType,
    formatName,
    organizationId,
    customerName: customerName.trim(),
    companyName: (companyName || '').trim(),
    email: email.trim(),
    phone: phone.trim(),
    objective: objective.trim() || scopeDetails.trim() || (productTypes.length > 0 ? `Cung ứng ${quantities} ${productTypes.join(', ')}` : ''),
    targetAudience,
    categories,
    location: (shootingLocation || deliveryLocation || location).trim(),
    expectedDate: deadline || requestedDate || expectedDate,
    scale: scale || estimatedScale || quantities,
    estimatedScale: estimatedScale || scale || quantities,
    expectedBuyerCount: expectedBuyerCount || null,
    expectedSupplierCount: expectedSupplierCount || null,
    existingResources: existingResources.trim() || existingDocs.trim(),
    ccuSupportNeeded: ccuSupportNeeded.trim(),
    scopeDetails: scopeDetails.trim(),
    budget,
    budgetNote,
    owner: primaryOwner,
    ownerRole: determinedServiceType === 'VAT_PHAM_SU_KIEN' ? 'MERCHANDISE_OPERATIONS' : 'PARTNERSHIP_SALES',
    coordinator: null,
    status: 'NEW',
    nextAction: determinedServiceType === 'VAT_PHAM_SU_KIEN' 
      ? 'Chuyên viên kỹ thuật rà soát quy cách in/thêu, số lượng và báo giá 13 hạng mục'
      : 'Chuyên viên rà soát mục tiêu và liên hệ khảo sát phạm vi',
    nextActionAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    programId: relatedProgramId || null,
    source,
    // Page 15 Specific data storage
    mediaConfig: {
      itemsNeeded,
      targetProducts,
      shootingLocation: shootingLocation || location,
      existingDocs,
      brandAssets,
      languages,
      distributionChannels,
      contentApprover: contentApprover || customerName,
      deadline: deadline || expectedDate,
      files
    },
    // Page 16 Specific data storage (Section 6 Spec 16.txt)
    merchConfig: {
      productTypes: productTypes.length > 0 ? productTypes : (categories ? [categories] : ['Vật phẩm sự kiện']),
      quantities: quantities || scale || estimatedScale,
      sizeChart,
      specifications,
      printRequirements,
      colors,
      brandGuideline: brandGuideline || existingDocs,
      packagingRequirements,
      sampleRequired: sampleRequired !== false,
      requestedDate: requestedDate || expectedDate,
      confirmedDeliveryDate: null, // RULE: Ngày khách mong muốn KHÔNG tự thành confirmed date
      deliveryLocation: deliveryLocation || location,
      approvalContact: approvalContact || customerName,
      coordinationMode: coordinationMode || 'PLATFORM_COORDINATION',
      relatedProgramId,
      files: Array.isArray(files) ? files : []
    },
    createdAt: new Date().toISOString()
  };

  requests.unshift(newRequest);
  saveAllServiceRequests(requests);

  logServiceAudit({
    action: 'SERVICE_REQUEST_SUBMITTED',
    serviceId: newRequest.serviceIds.join(','),
    actor: customerName,
    details: `Tiếp nhận đề bài ${newRequest.id} từ ${customerName} (${companyName}): ${serviceNames.join(' + ')}.`
  });

  return { success: true, trackingCode: newRequestId, request: newRequest };
}

/**
 * Admin cập nhật trạng thái yêu cầu dịch vụ (Section 11 & 12)
 */
export function updateServiceRequestStatus({
  requestId,
  status,
  nextAction,
  nextActionAt,
  owner,
  actor = 'Admin Master',
  note = ''
}) {
  const requests = getAllServiceRequests();
  const idx = requests.findIndex(r => r.id === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu' };

  const req = requests[idx];
  const oldStatus = req.status;
  req.status = status || req.status;
  if (nextAction) req.nextAction = nextAction;
  if (nextActionAt) req.nextActionAt = nextActionAt;
  if (owner) req.owner = owner;
  req.updatedAt = new Date().toISOString();

  requests[idx] = req;
  saveAllServiceRequests(requests);

  logServiceAudit({
    action: 'REQUEST_STATUS_UPDATED',
    serviceId: req.serviceIds.join(','),
    actor,
    details: `Cập nhật trạng thái yêu cầu ${requestId}: [${oldStatus}] -> [${status}]. Tiếp theo: ${nextAction || 'Theo tiến độ'}.`
  });

  return { success: true, request: req };
}

/**
 * Chuyển giao Coordinator sau khi đề bài được duyệt (Section 13 Spec 14.txt)
 */
export function reassignServiceRequestCoordinator({
  requestId,
  coordinatorName,
  actor = 'Admin Master',
  note = ''
}) {
  const requests = getAllServiceRequests();
  const idx = requests.findIndex(r => r.id === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu' };

  const req = requests[idx];
  const oldOwner = req.owner;
  req.owner = coordinatorName;
  req.coordinator = coordinatorName;
  req.ownerRole = 'COORDINATOR';
  req.status = 'IN_PROGRESS';
  req.nextAction = 'Vận hành thu thập nhu cầu Buyer & lập danh sách Matching';
  req.nextActionAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  req.updatedAt = new Date().toISOString();

  requests[idx] = req;
  saveAllServiceRequests(requests);

  logServiceAudit({
    action: 'COORDINATOR_HANDOFF',
    serviceId: req.serviceIds.join(','),
    actor,
    details: `Bàn giao đề bài ${requestId} từ [${oldOwner}] sang Điều phối viên [${coordinatorName}]. Trạng thái chuyển sang IN_PROGRESS. ${note}`
  });

  return { success: true, request: req };
}

/**
 * Khởi tạo Program chính thức sau khi Proposal được chấp thuận (Section 9 & 10 Spec 14.txt)
 */
export function createProgramFromServiceRequest({
  requestId,
  programTitle,
  programDate = '',
  programLocation = '',
  actor = 'Admin Master'
}) {
  const requests = getAllServiceRequests();
  const idx = requests.findIndex(r => r.id === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu dịch vụ' };

  const req = requests[idx];
  const newProgramId = `prog-${Date.now().toString(36)}`;
  
  req.programId = newProgramId;
  req.status = 'IN_PROGRESS';
  req.nextAction = `Vận hành trang sự kiện /chuong-trinh/${newProgramId} và mở cổng tiếp nhận đăng ký`;
  req.nextActionAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  req.updatedAt = new Date().toISOString();

  requests[idx] = req;
  saveAllServiceRequests(requests);

  logServiceAudit({
    action: 'PROGRAM_CREATED_FROM_REQUEST',
    serviceId: req.serviceIds.join(','),
    actor,
    details: `Đã khởi tạo Chương trình chính thức [${programTitle}] (Mã: ${newProgramId}) liên kết với đề bài ${requestId}.`
  });

  return { success: true, programId: newProgramId, request: req };
}

// ----------------------------------------------------------------------------
// 4. PROGRAM INTEGRATION HELPER (SECTION 10 SPEC 13.TXT)
// ----------------------------------------------------------------------------
/**
 * Lấy các chương trình đang mở liên quan từ cơ sở dữ liệu thật (programsData)
 */
export function getActiveRelatedPrograms() {
  if (!Array.isArray(PROGRAMS_DATA)) return [];
  return PROGRAMS_DATA.filter(p => p.status === 'dang-nhan-dang-ky' || p.statusName === 'Đang nhận đăng ký').slice(0, 3);
}

// ----------------------------------------------------------------------------
// 5. AUDIT LOG (SECTION 11 SPEC 13.TXT)
// ----------------------------------------------------------------------------
export function getAllServiceAuditLogs() {
  const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [];
}

export function logServiceAudit({ action, serviceId, actor = 'System Admin', details = '' }) {
  const logs = getAllServiceAuditLogs();
  const entry = {
    id: `LOG-SRV-${Date.now()}`,
    action,
    serviceId,
    actor,
    timestamp: new Date().toISOString(),
    details
  };
  logs.unshift(entry);
  safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  return entry;
}
