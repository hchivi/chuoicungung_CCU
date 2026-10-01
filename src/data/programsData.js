// ============================================================================
// PAGE 20: DANH SÁCH CHƯƠNG TRÌNH KẾT NỐI DOANH NGHIỆP
// ROUTE: /chuong-trinh & /admin/chuong-trinh
// Chuẩn hóa theo spec 20.txt - CHUOICUNGUNG.COM
// ============================================================================

// ----------------------------------------------------------------------------
// 1. CANONICAL ENUMS & TYPE DEFINITIONS (SECTION 3, 4, 5, 6)
// ----------------------------------------------------------------------------

export const PROGRAM_TYPES_ENUM = {
  SUPPLY_CHAIN_DAY: 'SUPPLY_CHAIN_DAY',                 // Ngày hội Chuỗi Cung Ứng
  BUYER_SUPPLIER_MEETING: 'BUYER_SUPPLIER_MEETING',     // Gặp nhà cung ứng theo nhu cầu (Sourcing Day 1:1)
  SHARED_BOOTH: 'SHARED_BOOTH',                         // Gian hàng chung
  TRADE_FAIR: 'TRADE_FAIR',                             // Hội chợ / hoạt động triển lãm
  SUPPLIER_PRESENTATION: 'SUPPLIER_PRESENTATION',       // Phiên giới thiệu sản phẩm & năng lực (Pitching)
  SEMINAR: 'SEMINAR',                                   // Hội thảo / hoạt động chuyên môn
  WELFARE_COMMUNITY: 'WELFARE_COMMUNITY'                // Phúc lợi cộng đồng khi đã triển khai
};

export const PROGRAM_STATUSES_ENUM = {
  NEEDS_DISCOVERY: 'NEEDS_DISCOVERY',                   // Đang khảo sát nhu cầu
  UPCOMING: 'UPCOMING',                                 // Sắp mở đăng ký
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',               // Đang nhận đăng ký
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',           // Đã đóng đăng ký
  COMPLETED: 'COMPLETED',                               // Đã diễn ra
  POSTPONED: 'POSTPONED',                               // Hoãn
  CANCELLED: 'CANCELLED'                                // Hủy
};

export const TARGET_ROLES_ENUM = {
  BUYER: 'BUYER',
  FACTORY: 'FACTORY',
  SUPPLIER: 'SUPPLIER',
  ASSOCIATION: 'ASSOCIATION',
  INDUSTRIAL_PARK: 'INDUSTRIAL_PARK',
  SPONSOR: 'SPONSOR',
  PARTNER: 'PARTNER'
};

export const MODALITY_ENUM = {
  OFFLINE: 'OFFLINE',
  ONLINE: 'ONLINE',
  HYBRID: 'HYBRID'
};

// ----------------------------------------------------------------------------
// 1.1 CANONICAL ENUMS CHO PAGE 22: REGISTRATION FORM ENGINE (SECTIONS 24, 25, 26, 40)
// ----------------------------------------------------------------------------

export const REGISTRATION_STATUSES_ENUM = {
  DRAFT: 'DRAFT',                   // Bản nháp đang nhập
  SUBMITTED: 'SUBMITTED',           // Đã nộp, chờ điều phối viên tiếp nhận
  UNDER_REVIEW: 'UNDER_REVIEW',     // Đang thẩm định hồ sơ kỹ thuật
  NEED_MORE_INFO: 'NEED_MORE_INFO', // Yêu cầu bổ sung chứng chỉ / hồ sơ
  APPROVED: 'APPROVED',             // Đã được duyệt tham gia
  REJECTED: 'REJECTED',             // Từ chối (kèm lý do)
  WITHDRAWN: 'WITHDRAWN',           // Doanh nghiệp chủ động rút
  CANCELLED: 'CANCELLED'            // Hủy do chương trình hoãn/hủy
};

export const PAYMENT_STATUSES_ENUM = {
  NOT_REQUIRED: 'NOT_REQUIRED',     // Không áp dụng phí (VD: Buyer miễn phí)
  NOT_STARTED: 'NOT_STARTED',       // Chưa mở cổng thanh toán (chờ duyệt hồ sơ)
  PENDING: 'PENDING',               // Đang chờ chuyển khoản / đối soát
  PAID: 'PAID',                     // Đã thanh toán đầy đủ
  PARTIALLY_PAID: 'PARTIALLY_PAID', // Đã thanh toán một phần
  FAILED: 'FAILED',                 // Giao dịch lỗi
  REFUND_PENDING: 'REFUND_PENDING', // Đang xử lý hoàn phí
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  REFUNDED: 'REFUNDED',             // Đã hoàn phí
  CANCELLED: 'CANCELLED'            // Hủy lệnh thanh toán
};

export const ATTENDANCE_STATUSES_ENUM = {
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',     // Chưa đủ điều kiện cấp thẻ
  EXPECTED: 'EXPECTED',             // Dự kiến tham dự (đã cấp QR)
  CHECKED_IN: 'CHECKED_IN',         // Đã quét mã QR tại bàn đón tiếp
  ATTENDED: 'ATTENDED',             // Đã tham dự trọn vẹn sự kiện
  NO_SHOW: 'NO_SHOW',               // Vắng mặt không báo trước
  CANCELLED: 'CANCELLED'            // Hủy tham dự
};

export const REJECTION_REASONS_ENUM = {
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',             // Không thuộc đối tượng mục tiêu của kỳ này
  PROGRAM_FULL: 'PROGRAM_FULL',             // Đã hết số lượng bàn làm việc B2B
  PROFILE_INCOMPLETE: 'PROFILE_INCOMPLETE', // Hồ sơ năng lực xưởng chưa đạt yêu cầu
  SCOPE_NOT_MATCH: 'SCOPE_NOT_MATCH',       // Danh mục phụ trợ không khớp nhu cầu nhà máy
  DUPLICATE: 'DUPLICATE',                   // Đăng ký trùng lặp doanh nghiệp
  OTHER: 'OTHER'                            // Lý do khác
};

// ----------------------------------------------------------------------------
// 2. BACKWARD-COMPATIBLE CONSTANTS (Phục vụ UI & các trang P0-P18)
// ----------------------------------------------------------------------------

export const PROGRAM_TYPES = [
  { id: 'all', name: 'Tất cả chương trình', code: 'ALL' },
  { id: 'ngay-hoi-chuoi-cung-ung', name: 'Ngày hội Chuỗi Cung Ứng', code: PROGRAM_TYPES_ENUM.SUPPLY_CHAIN_DAY },
  { id: 'gap-nha-cung-ung', name: 'Gặp nhà cung ứng theo nhu cầu', code: PROGRAM_TYPES_ENUM.BUYER_SUPPLIER_MEETING },
  { id: 'gian-hang-hoi-cho', name: 'Gian hàng tại hội chợ / triển lãm', code: PROGRAM_TYPES_ENUM.SHARED_BOOTH },
  { id: 'hoi-thao-pitching', name: 'Hội thảo hoặc giới thiệu năng lực', code: PROGRAM_TYPES_ENUM.SEMINAR },
  { id: 'phuc-loi-cong-dong', name: 'Phúc lợi cộng đồng khi đã triển khai', code: PROGRAM_TYPES_ENUM.WELFARE_COMMUNITY }
];

export const PROGRAM_STATUSES = [
  { id: 'dang-nhan-dang-ky', name: 'Đang nhận đăng ký', code: PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN, color: 'emerald', actionText: 'Đăng ký tham gia' },
  { id: 'sap-mo-dang-ky', name: 'Sắp mở đăng ký', code: PROGRAM_STATUSES_ENUM.UPCOMING, color: 'blue', actionText: 'Đăng ký quan tâm' },
  { id: 'dang-khao-sat', name: 'Đang khảo sát nhu cầu', code: PROGRAM_STATUSES_ENUM.NEEDS_DISCOVERY, color: 'amber', actionText: 'Đăng ký quan tâm' },
  { id: 'da-dong-dang-ky', name: 'Đã đóng đăng ký', code: PROGRAM_STATUSES_ENUM.REGISTRATION_CLOSED, color: 'slate', actionText: 'Danh sách chờ' },
  { id: 'da-dien-ra', name: 'Đã diễn ra', code: PROGRAM_STATUSES_ENUM.COMPLETED, color: 'indigo', actionText: 'Xem kết quả & Thư viện' },
  { id: 'hoan', name: 'Hoãn', code: PROGRAM_STATUSES_ENUM.POSTPONED, color: 'orange', actionText: 'Xem thông báo hoãn' },
  { id: 'huy', name: 'Hủy', code: PROGRAM_STATUSES_ENUM.CANCELLED, color: 'rose', actionText: 'Thông báo hủy' }
];

export const PROGRAM_FORMATS = [
  { id: 'all', name: 'Tất cả hình thức', code: 'ALL' },
  { id: 'truc-tiep', name: 'Trực tiếp (In-person)', code: MODALITY_ENUM.OFFLINE },
  { id: 'truc-tuyen', name: 'Trực tuyến (Online)', code: MODALITY_ENUM.ONLINE },
  { id: 'ket-hop', name: 'Kết hợp (Hybrid)', code: MODALITY_ENUM.HYBRID }
];

export const PROGRAM_ROLES = [
  { id: 'all', name: 'Tất cả vai trò', code: 'ALL' },
  { id: 'buyer', name: 'Người mua / Nhà máy (Buyer)', code: TARGET_ROLES_ENUM.BUYER },
  { id: 'supplier', name: 'Nhà cung ứng (Supplier)', code: TARGET_ROLES_ENUM.SUPPLIER },
  { id: 'partner', name: 'KCN / Hiệp hội / Đối tác', code: TARGET_ROLES_ENUM.PARTNER }
];

export const PROGRAM_ZONES = [
  { id: 'all', name: 'Tất cả địa bàn' },
  { id: 'Miền Nam', name: 'Miền Nam' },
  { id: 'Miền Bắc', name: 'Miền Bắc' },
  { id: 'Miền Trung', name: 'Miền Trung' }
];

export const PROGRAM_INDUSTRIES = [
  'Tất cả ngành hàng',
  'Cơ khí chính xác & Bán dẫn',
  'Điện tử & Vi mạch công nghệ cao',
  'Tự động hóa & Robot công nghiệp',
  'Dệt may, Giày da & Bảo hộ PPE',
  'Thực phẩm, Đồ uống & Nông sản',
  'Bao bì, In ấn & Nhựa kỹ thuật',
  'Logistics, Cảng biển & Kho bãi',
  'Cơ điện lạnh MEP & Năng lượng xanh',
  'Phúc lợi công nhân & Tiêu dùng sỉ'
];

// ----------------------------------------------------------------------------
// 3. MASTER PROGRAMS SEED DATA (CHUẨN HÓA THEO MODEL SECTION 5 & 27)
// ----------------------------------------------------------------------------

export const SEED_PROGRAMS = [
  // 1. Ngày hội Chuỗi Cung Ứng KCN VSIP 1 & 2
  {
    id: 'vsip-binh-duong',
    publicCode: 'PRG-2026-001',
    slug: 'vsip-binh-duong',
    aliasIds: ['vsip-binh-duong-2026'],
    name: 'Ngày Hội Kết Nối Giao Thương Chuỗi Cung Ứng KCN VSIP 1 & 2',
    title: 'Ngày Hội Kết Nối Giao Thương Chuỗi Cung Ứng KCN VSIP 1 & 2',
    shortName: 'Ngày Hội Cung Ứng KCN VSIP 1 & 2',
    shortDescription: 'Kết nối trực tiếp 68 Nhà máy FDI với hơn 160 nhà sản xuất cơ khí, tự động hóa và bao bì phụ trợ.',
    type: 'ngay-hoi-chuoi-cung-ung',
    programType: PROGRAM_TYPES_ENUM.SUPPLY_CHAIN_DAY,
    typeName: 'Ngày hội Chuỗi Cung Ứng',
    image: '/images/smart_factory_hero.jpg',
    coverImageId: 'img_vsip_hero_01',
    date: '15/10/2026',
    time: '08:30 - 17:30',
    startAt: '2026-10-15T08:30:00+07:00',
    endAt: '2026-10-15T17:30:00+07:00',
    registrationOpenAt: '2026-09-01T08:00:00+07:00',
    registrationCloseAt: '2026-10-10T17:00:00+07:00',
    location: 'Trung tâm Hội nghị KCN VSIP 1, TP. Thuận An, Bình Dương',
    locationType: 'INDUSTRIAL_PARK',
    venue: 'Trung tâm Hội nghị KCN VSIP 1',
    provinceId: 'binh-duong',
    industrialParkId: 'kcn-vsip-1',
    zone: 'Miền Nam',
    kcn: 'VSIP 1 & 2',
    industry: 'Cơ khí chính xác & Bán dẫn',
    needGroup: ['Thi công phòng sạch', 'Gia công CNC đồ gá Jig', 'Bu lông ốc vít Inox', 'Robot AGV kho ASRS'],
    organizerOrganizationId: 'ORG-VSIP-006',
    organizer: 'Ban Quản lý KCN VSIP & Mạng lưới CHUOICUNGUNG.COM',
    suitableFor: ['Nhà máy FDI Nhật Bản, Hàn Quốc, Châu Âu', 'Doanh nghiệp cơ khí & tự động hóa cấp 1-2'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.FACTORY, TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'dang-nhan-dang-ky',
    statusName: 'Đang nhận đăng ký',
    programStatus: PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Rà soát danh sách 15 nhà cung cấp đồ gá Jig gửi phòng Purchasing',
    nextActionAt: '2026-10-02T17:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Miễn phí 100% bàn làm việc và đón tiếp cho Trưởng phòng/Giám đốc Mua hàng (Purchasing) sau khi xác thực hồ sơ.',
      supplier: 'Gói Trực Tiếp: 6.500.000đ/bàn làm việc riêng kèm kỷ yếu; Gói Từ Xa: 2.200.000đ (ủy thác điều phối viên đại diện).'
    },
    participationOptions: [
      {
        id: 'opt_vsip_buyer',
        role: TARGET_ROLES_ENUM.BUYER,
        participationType: 'BUYER_DESK',
        title: 'Bàn tiếp đón Trưởng phòng Purchasing (FDI/Nhà máy)',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Miễn phí trọn gói bàn làm việc riêng, trà giải lao và tiếp nhận danh mục chào hàng đã chọn lọc.'
      },
      {
        id: 'opt_vsip_supplier_direct',
        role: TARGET_ROLES_ENUM.SUPPLIER,
        participationType: 'BOOTH_DESK',
        title: 'Bàn làm việc B2B & Trưng bày mẫu trực tiếp',
        feeType: 'FIXED',
        amount: 6500000,
        currency: 'VND',
        description: '01 bàn làm việc riêng, 02 đại biểu tham dự, in ấn kỷ yếu giao thương, kết nối tối thiểu 5 Buyer.'
      },
      {
        id: 'opt_vsip_supplier_remote',
        role: TARGET_ROLES_ENUM.SUPPLIER,
        participationType: 'REMOTE_PROXY',
        title: 'Gói Hiện Diện Ủy Thác Từ Xa',
        feeType: 'FIXED',
        amount: 2200000,
        currency: 'VND',
        description: 'Điều phối viên đại diện phát catalogue mẫu và thu thập danh thiếp phản hồi từ các nhà máy.'
      }
    ],
    isSponsored: false,
    factoriesCount: 68,
    suppliersCount: 160,
    highlight: 'Sự kiện quy tụ hơn 68 Nhà máy FDI bán dẫn, điện tử và cơ khí chính xác tại cụm KCN VSIP.',
    description: 'Chương trình được thiết kế nhằm hỗ trợ các nhà máy FDI tìm kiếm nhà cung cấp nội địa hóa đủ năng lực đáp ứng tiêu chuẩn phòng sạch, cơ khí chính xác và tự động hóa nhà xưởng.',
    relations: {
      categoryIds: ['co-khi-chinh-xac', 'phong-sach-mep', 'tu-dong-hoa'],
      keywords: ['gia công CNC', 'phòng sạch ESD', 'đồ gá jig', 'bu lông ốc vít', 'robot AGV'],
      organizationIds: ['ORG-PROSER-001', 'ORG-VSIP-006'],
      requirementIds: ['REQ-2026-001', 'REQ-2026-004'],
      sponsorIds: [],
      mediaItems: ['/images/smart_factory_hero.jpg']
    },
    needToBuy: [
      { item: 'Thi công phòng sạch Class 1000 & Sàn Epoxy chống tĩnh điện ESD', qty: '6.500 m²', buyer: 'Tập Đoàn Điện Tử MicroTech VSIP' },
      { item: 'Gia công cơ khí chính xác CNC, đồ gá Jig kiểm tra bản mạch', qty: 'Hợp đồng dài hạn', buyer: 'Công ty Công Nghệ Bán Dẫn S-Semicon' },
      { item: 'Bu lông ốc vít tiêu chuẩn DIN 933, tán chốt thép hợp kim', qty: '5 triệu pcs/quý', buyer: 'Nhà máy Cơ Điện Tử Sun Precision' },
      { item: 'Robot tự hành AGV & Hệ thống kho tự động ASRS', qty: '6 xe AGV + Kệ ASRS', buyer: 'Trung Tâm Phân Phối Linh Kiện VSIP' },
      { item: 'Áo thun chống tĩnh điện, đồng phục phòng sạch & Giày ESD', qty: '8.000 bộ', buyer: 'Điện Tử Hanwha Vina' },
      { item: 'Hóa chất tẩy rửa công nghiệp & Dung môi vi mạch', qty: '20 phuy/tháng', buyer: 'Năng Lượng Xanh Solar VSIP' }
    ],
    needToSell: [
      { item: 'Robot tự hành AGV, giải pháp tự động hóa dây chuyền', supplier: 'Robotics & AI Automation VN' },
      { item: 'Đồng phục phòng sạch, may đo đồng phục doanh nghiệp', supplier: 'ADAMEVA Fashion Group' },
      { item: 'Gia công CNC phay tiện 5 trục, đồ gá khuôn mẫu chính xác', supplier: 'Cơ Khí Công Nghiệp Tiến Phát' },
      { item: 'Dịch vụ Forwarding hàng không & Chuyển phát nhanh linh kiện', supplier: 'SEAIRLANDEX Global' },
      { item: 'Vật tư phụ trợ phòng sạch, thảm dính bụi, găng tay PU', supplier: 'Phòng Sạch CleanPro' }
    ],
    createdAt: '2026-08-15T09:00:00+07:00',
    updatedAt: '2026-09-28T10:00:00+07:00'
  },

  // 2. Ngày hội Chuỗi Cung Ứng KCN Tràng Duệ & DEEP C Hải Phòng
  {
    id: 'trang-due-deep-c',
    publicCode: 'PRG-2026-002',
    slug: 'trang-due-deep-c',
    aliasIds: ['trang-due-deep-c-2026'],
    name: 'Ngày Hội Chuỗi Cung Ứng KCN Tràng Duệ & DEEP C Hải Phòng',
    title: 'Ngày Hội Chuỗi Cung Ứng KCN Tràng Duệ & DEEP C Hải Phòng',
    shortName: 'Ngày Hội Cung Ứng Tràng Duệ & DEEP C',
    shortDescription: 'Khớp lệnh cung - cầu phụ trợ cho tổ hợp công nghiệp ô tô, cảng biển và điện tử miền Bắc.',
    type: 'ngay-hoi-chuoi-cung-ung',
    programType: PROGRAM_TYPES_ENUM.SUPPLY_CHAIN_DAY,
    typeName: 'Ngày hội Chuỗi Cung Ứng',
    image: '/images/supplier_b2b_hero.jpg',
    coverImageId: 'img_deepc_hero_01',
    date: '05/11/2026',
    time: '08:00 - 17:00',
    startAt: '2026-11-05T08:00:00+07:00',
    endAt: '2026-11-05T17:00:00+07:00',
    registrationOpenAt: '2026-09-15T08:00:00+07:00',
    registrationCloseAt: '2026-10-30T17:00:00+07:00',
    location: 'Khu Công Nghiệp DEEP C / Tràng Duệ, An Dương, Hải Phòng',
    locationType: 'INDUSTRIAL_PARK',
    venue: 'Trung tâm Dịch vụ KCN DEEP C Hải Phòng',
    provinceId: 'hai-phong',
    industrialParkId: 'kcn-deep-c',
    zone: 'Miền Bắc',
    kcn: 'DEEP C & Tràng Duệ',
    industry: 'Cơ khí chính xác & Bán dẫn',
    needGroup: ['Linh kiện ô tô', 'Dịch vụ container cảng', 'PCCC Sprinkler', 'Suất ăn HACCP'],
    organizerOrganizationId: 'ORG-DEEPC-007',
    organizer: 'Tổ hợp KCN DEEP C, KCN Tràng Duệ & CHUOICUNGUNG.COM',
    suitableFor: ['Nhà máy linh kiện ô tô, điện tử tiêu dùng', 'Đơn vị logistics cảng biển và cơ khí'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.FACTORY, TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'dang-nhan-dang-ky',
    statusName: 'Đang nhận đăng ký',
    programStatus: PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_bac',
    ownerName: 'Hoàng Văn Thắng (Coordinator Miền Bắc)',
    nextAction: 'Xác nhận sơ đồ 45 gian làm việc B2B với BQL KCN DEEP C',
    nextActionAt: '2026-10-05T14:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Miễn phí tham dự cho Đại diện Nhà máy FDI & KCN.',
      supplier: 'Phí gian làm việc B2B: 5.800.000đ; Hiện diện ủy thác: 2.000.000đ.'
    },
    participationOptions: [
      {
        id: 'opt_deepc_buyer',
        role: TARGET_ROLES_ENUM.BUYER,
        participationType: 'BUYER_DESK',
        title: 'Đại diện Mua hàng FDI / KCN',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Miễn phí bàn tiếp đón riêng và thẩm định danh sách nhà cung cấp trước phiên gặp.'
      },
      {
        id: 'opt_deepc_supplier_booth',
        role: TARGET_ROLES_ENUM.SUPPLIER,
        participationType: 'BOOTH_DESK',
        title: 'Gian làm việc B2B tiêu chuẩn',
        feeType: 'FIXED',
        amount: 5800000,
        currency: 'VND',
        description: 'Bao gồm bàn ghế, backdrop thương hiệu, kỷ yếu và 4 phiên gặp riêng với Buyer.'
      }
    ],
    isSponsored: false,
    factoriesCount: 54,
    suppliersCount: 130,
    highlight: 'Khớp lệnh cung - cầu phụ trợ cho tổ hợp công nghiệp ô tô, cảng biển và điện tử miền Bắc.',
    description: 'Tạo cầu nối trực tiếp giữa các nhà sản xuất linh kiện, phụ trợ ô tô với các tập đoàn công nghiệp cảng biển Hải Phòng.',
    relations: {
      categoryIds: ['phu-tro-o-to', 'logistics-cang-bien', 'an-toan-pccc'],
      keywords: ['khuôn dập ô tô', 'container lạnh', 'pccc sprinkler', 'suất ăn công nghiệp'],
      organizationIds: ['ORG-DEEPC-007'],
      requirementIds: ['REQ-2026-002'],
      sponsorIds: [],
      mediaItems: ['/images/supplier_b2b_hero.jpg']
    },
    needToBuy: [
      { item: 'Dịch vụ vận chuyển container lạnh & Cho thuê kho bãi cảng', qty: '300 cont/tháng', buyer: 'Logistics Quốc Tế Hải Phòng Port' },
      { item: 'Khuôn dập kim loại & Đúc linh kiện nhôm áp lực cao', qty: '12 bộ khuôn', buyer: 'Linh Kiện Ô Tô HP Auto Parts' },
      { item: 'Suất ăn công nghiệp đạt chuẩn HACCP & ISO 22000', qty: '4.500 suất/ngày', buyer: 'Điện Tử LG Tràng Duệ Component' },
      { item: 'Hệ thống PCCC tự động Sprinkler & Cụm bơm chữa cháy diesel', qty: '2 nhà xưởng mới', buyer: 'Nhà Máy Chế Tạo Cơ Khí Đình Vũ' },
      { item: 'Áo khoác gió mùa đông & Đồng phục bảo hộ thợ cơ khí', qty: '6.000 áo', buyer: 'Đóng Tàu & Cẩu Trục Sông Cấm' }
    ],
    needToSell: [
      { item: 'Vận tải đường biển quốc tế, đại lý tàu & Khai báo hải quan', supplier: 'PORTALINK Logistics' },
      { item: 'Áo khoác đồng phục, bảo hộ lao động chuyên dụng', supplier: 'PIJU Uniform' },
      { item: 'Thép cuộn mạ kẽm SGCC, tôn lợp cách nhiệt PU 3 lớp', supplier: 'Thép Tôn Công Nghiệp Việt Nhật' },
      { item: 'Dầu mỡ nhờn công nghiệp & Hóa chất xử lý nước thải KCN', supplier: 'Hóa Chất Công Nghiệp PetroVina' }
    ],
    createdAt: '2026-08-20T08:00:00+07:00',
    updatedAt: '2026-09-28T11:00:00+07:00'
  },

  // 3. Sourcing Day 1:1 - Gặp nhà cung ứng theo nhu cầu (Samsung & LG Tier 1)
  {
    id: 'sourcing-day-electronics-bac-ninh',
    publicCode: 'PRG-2026-003',
    slug: 'sourcing-day-electronics-bac-ninh',
    aliasIds: ['yen-phong-que-vo'],
    name: 'Phiên Gặp Gỡ Nhà Cung Ứng Theo Nhu Cầu Mua Hàng FDI Điện Tử',
    title: 'Phiên Gặp Gỡ Nhà Cung Ứng Theo Nhu Cầu Mua Hàng FDI Điện Tử',
    shortName: 'Phiên Sourcing Day 1:1 Bán Dẫn & Điện Tử',
    shortDescription: 'Mỗi nhà cung ứng được bố trí tối thiểu 4 phiên gặp trực tiếp 1:1 với Giám đốc mua hàng FDI.',
    type: 'gap-nha-cung-ung',
    programType: PROGRAM_TYPES_ENUM.BUYER_SUPPLIER_MEETING,
    typeName: 'Gặp nhà cung ứng theo nhu cầu',
    image: '/images/b2b_sourcing_demand_hero.jpg',
    coverImageId: 'img_sourcing_bacninh_01',
    date: '18/11/2026',
    time: '09:00 - 16:30',
    startAt: '2026-11-18T09:00:00+07:00',
    endAt: '2026-11-18T16:30:00+07:00',
    registrationOpenAt: '2026-10-01T08:00:00+07:00',
    registrationCloseAt: '2026-11-10T17:00:00+07:00',
    location: 'Phòng Hội nghị VIP, KCN Yên Phong, Bắc Ninh',
    locationType: 'CONVENTION_CENTER',
    venue: 'Phòng Hội nghị VIP KCN Yên Phong',
    provinceId: 'bac-ninh',
    industrialParkId: 'kcn-yen-phong',
    zone: 'Miền Bắc',
    kcn: 'Yên Phong & Quế Võ',
    industry: 'Điện tử & Vi mạch công nghệ cao',
    needGroup: ['Bản mạch FPCB/PCB', 'Khuôn dập dung sai 0.005mm', 'Khay nhựa chống tĩnh điện', 'Vật tư phòng sạch'],
    organizerOrganizationId: 'ORG-HAME-005',
    organizer: 'Hiệp hội Doanh nghiệp Điện tử & Đội điều phối Chuỗi Cung Ứng',
    suitableFor: ['Nhà cung ứng đạt chứng nhận ISO 9001, ISO 14001', 'Doanh nghiệp có báo cáo kiểm toán nhà xưởng'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.SUPPLIER],
    format: 'ket-hop',
    modality: MODALITY_ENUM.HYBRID,
    formatName: 'Kết hợp (Hybrid)',
    status: 'sap-mo-dang-ky',
    statusName: 'Sắp mở đăng ký',
    programStatus: PROGRAM_STATUSES_ENUM.UPCOMING,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_bac',
    ownerName: 'Hoàng Văn Thắng (Coordinator Miền Bắc)',
    nextAction: 'Hoàn thiện hồ sơ thẩm định 4 nhà máy FDI tham gia phiên gặp 1:1',
    nextActionAt: '2026-10-08T10:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Miễn phí cho phòng Purchasing FDI đăng ký nhu cầu trước 10 ngày.',
      supplier: 'Phí thẩm định hồ sơ & sắp xếp 4 phiên gặp 1:1: 3.500.000đ/doanh nghiệp.'
    },
    participationOptions: [
      {
        id: 'opt_sourcing_buyer',
        role: TARGET_ROLES_ENUM.BUYER,
        participationType: 'PURCHASING_MEETING',
        title: 'Phòng Mua Hàng FDI Tiếp Nhận Báo Giá 1:1',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Miễn phí tiếp nhận danh sách báo giá và thẩm định mẫu trước tại phiên họp kín.'
      },
      {
        id: 'opt_sourcing_supplier',
        role: TARGET_ROLES_ENUM.SUPPLIER,
        participationType: 'MATCHMAKING_SESSION',
        title: 'Gói Kết Nối 4 Phiên Gặp 1:1 Có Thẩm Định',
        feeType: 'FIXED',
        amount: 3500000,
        currency: 'VND',
        description: 'Cam kết tối thiểu 4 phiên gặp riêng với Trưởng phòng Mua hàng đúng chuyên ngành.'
      }
    ],
    isSponsored: true,
    sponsorName: 'Tài trợ địa điểm bởi KCN Yên Phong',
    factoriesCount: 22,
    suppliersCount: 45,
    highlight: 'Mỗi nhà cung ứng được bố trí tối thiểu 4 phiên gặp trực tiếp 1:1 với Giám đốc mua hàng FDI.',
    description: 'Phiên kết nối kín có chọn lọc cao, chỉ tiếp nhận các nhà cung ứng đã qua bước rà soát năng lực và khớp lệnh nhu cầu.',
    relations: {
      categoryIds: ['dien-tu-vi-mach', 'khuon-mau-chinh-xac', 'bao-bi-chong-tinh-dien'],
      keywords: ['bản mạch PCB', 'khuôn dập chính xác', 'khay nhựa ESD', 'vận chuyển air express'],
      organizationIds: ['ORG-HAME-005'],
      requirementIds: ['REQ-2026-003'],
      sponsorIds: ['ORG-AMATA-003'],
      mediaItems: ['/images/b2b_sourcing_demand_hero.jpg']
    },
    needToBuy: [
      { item: 'Bản mạch in nhiều lớp PCB/FPCB & Linh kiện dán bề mặt SMT', qty: '10 triệu pcs/tháng', buyer: 'Điện Tử Công Nghệ Cao Bắc Ninh' },
      { item: 'Khuôn ép nhựa chính xác dung sai 0.005mm', qty: '20 bộ khuôn', buyer: 'Nhà Máy Khuôn Mẫu Điện Tử Vina' },
      { item: 'Đồng phục phòng sạch chống tĩnh điện & Áo blouse kỹ thuật', qty: '12.000 bộ', buyer: 'Tổ Hợp Vi Mạch Bán Dẫn Yên Phong' },
      { item: 'Dịch vụ logistics đường hàng không Nội Bài đi toàn cầu', qty: '50 tấn/tuần', buyer: 'Chuỗi Xuất Khẩu Vi Mạch Quốc Tế' }
    ],
    needToSell: [
      { item: 'Phòng sạch Class 100-10.000 & Thiết bị FFU lọc khí', supplier: 'AirClean Tech' },
      { item: 'May đồng phục kỹ thuật viên & Bảo hộ ESD', supplier: 'PIJU Uniform' },
      { item: 'Vận chuyển hàng air express & Khai báo hải quan Nội Bài', supplier: 'SEAIRLANDEX Express' },
      { item: 'Bao bì khay nhựa định hình PET/PS chống tĩnh điện', supplier: 'Khay Nhựa Điện Tử An Phát' }
    ],
    createdAt: '2026-08-25T10:00:00+07:00',
    updatedAt: '2026-09-28T12:00:00+07:00'
  },

  // 4. Gian hàng tại hội chợ - Expo Công Nghiệp Quốc Tế Hiệp Phước - Tân Thuận
  {
    id: 'gian-hang-hiep-phuoc-tan-thuan',
    publicCode: 'PRG-2026-004',
    slug: 'gian-hang-hiep-phuoc-tan-thuan',
    aliasIds: ['hiep-phuoc-tan-thuan'],
    name: 'Khu Gian Hàng Giao Thương Cung Ứng Sản Xuất KCN Hiệp Phước & Tân Thuận',
    title: 'Khu Gian Hàng Giao Thương Cung Ứng Sản Xuất KCN Hiệp Phước & Tân Thuận',
    shortName: 'Gian Hàng Giao Thương Hiệp Phước - Tân Thuận',
    shortDescription: 'Quy tụ hơn 75 nhà máy thực phẩm, dược phẩm và hàng tiêu dùng xuất khẩu khu vực cảng TP.HCM.',
    type: 'gian-hang-hoi-cho',
    programType: PROGRAM_TYPES_ENUM.SHARED_BOOTH,
    typeName: 'Gian hàng tại hội chợ',
    image: '/images/association_summit_hero.jpg',
    coverImageId: 'img_hiepphuoc_hero_01',
    date: '25/11/2026',
    time: '08:30 - 17:00',
    startAt: '2026-11-25T08:30:00+07:00',
    endAt: '2026-11-25T17:00:00+07:00',
    registrationOpenAt: '2026-09-20T08:00:00+07:00',
    registrationCloseAt: '2026-11-15T17:00:00+07:00',
    location: 'Khu Công Nghiệp Hiệp Phước, Huyện Nhà Bè, TP. Hồ Chí Minh',
    locationType: 'INDUSTRIAL_PARK',
    venue: 'Trung tâm Triển lãm KCN Hiệp Phước',
    provinceId: 'ho-chi-minh',
    industrialParkId: 'kcn-hiep-phuoc',
    zone: 'Miền Nam',
    kcn: 'Hiệp Phước & Tân Thuận',
    industry: 'Thực phẩm, Đồ uống & Nông sản',
    needGroup: ['Chai lọ PET dược phẩm', 'Màng nhôm tiệt trùng', 'Đồng phục công sở', 'Xử lý nước thải 1500m³'],
    organizerOrganizationId: 'ORG-PROSER-001',
    organizer: 'Ban Quản lý KCN Tân Thuận & Hiệp Phước phối hợp CCU',
    suitableFor: ['Doanh nghiệp bao bì, thực phẩm, hóa chất và phụ liệu công nghiệp'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.FACTORY, TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'dang-nhan-dang-ky',
    statusName: 'Đang nhận đăng ký',
    programStatus: PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Gửi danh mục 20 nhà máy thực phẩm đăng ký gian hàng cho ban tổ chức',
    nextActionAt: '2026-10-04T16:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Miễn phí thẻ tham quan và tài liệu danh bạ nhà cung cấp.',
      supplier: 'Gian hàng tiêu chuẩn 3x3m: 9.000.000đ; Bàn giao thương mở: 4.500.000đ.'
    },
    participationOptions: [
      {
        id: 'opt_hp_buyer',
        role: TARGET_ROLES_ENUM.BUYER,
        participationType: 'VISITOR',
        title: 'Khách mời Mua hàng & Ban Giám đốc Nhà máy',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Miễn phí thẻ ra vào, tài liệu danh bạ nhà cung ứng và khu vực tiếp khách VIP.'
      },
      {
        id: 'opt_hp_supplier_booth',
        role: TARGET_ROLES_ENUM.SUPPLIER,
        participationType: 'EXPO_BOOTH',
        title: 'Gian hàng trưng bày tiêu chuẩn 3x3m',
        feeType: 'FIXED',
        amount: 9000000,
        currency: 'VND',
        description: 'Vách ngăn, thảm, bàn ghế, chiếu sáng, tên biển hiệu và 03 bài giới thiệu năng lực trên cổng CCU.'
      },
      {
        id: 'opt_hp_supplier_desk',
        role: TARGET_ROLES_ENUM.SUPPLIER,
        participationType: 'OPEN_DESK',
        title: 'Bàn giao thương mở 1.2m',
        feeType: 'FIXED',
        amount: 4500000,
        currency: 'VND',
        description: 'Phù hợp doanh nghiệp dịch vụ, quà tặng doanh nghiệp và văn phòng phẩm công nghiệp.'
      }
    ],
    isSponsored: false,
    factoriesCount: 75,
    suppliersCount: 190,
    highlight: 'Quy tụ hơn 75 nhà máy thực phẩm, dược phẩm và hàng tiêu dùng xuất khẩu khu vực cảng TP.HCM.',
    description: 'Gian hàng chuyên đề dành cho các nhà cung ứng trưng bày sản phẩm mẫu, catalogue trực tiếp với phòng mua hàng.',
    relations: {
      categoryIds: ['bao-bi-in-an', 'thuc-pham-nong-san', 'xu-ly-moi-truong'],
      keywords: ['chai lọ PET', 'màng nhôm tiệt trùng', 'đồng phục may đo', 'xử lý nước thải'],
      organizationIds: ['ORG-PROSER-001', 'ORG-MEKONG-FOOD-004'],
      requirementIds: ['REQ-2026-004'],
      sponsorIds: [],
      mediaItems: ['/images/association_summit_hero.jpg']
    },
    needToBuy: [
      { item: 'Vải may đo đồng phục, phụ liệu may & In thêu logo cao cấp', qty: '100.000 mét vải', buyer: 'Tập Đoàn Dệt May Sài Gòn' },
      { item: 'Chai lọ nhựa PET, màng nhôm dược phẩm & Bao bì tiệt trùng', qty: '2 triệu sản phẩm/tháng', buyer: 'Dược Phẩm & Sinh Học Medipharm' },
      { item: 'Trạm biến áp 22kV và Hệ thống xử lý nước thải công suất 1500m³/ngày', qty: '1 dự án', buyer: 'Thực Phẩm & Đồ Uống Tân Thuận' },
      { item: 'Cung ứng lao động thời vụ & Kỹ sư vận hành máy', qty: '300 nhân sự', buyer: 'Chế Biến Hàng Xuất Khẩu Hiệp Phước' }
    ],
    needToSell: [
      { item: 'E-Catalogue đồng phục công sở, quà tặng lưu niệm đối tác', supplier: 'Chuyên Gia Đồng Phục (CGDP.vn)' },
      { item: 'Thực phẩm tiêu dùng giá sỉ, giỏ quà tết doanh nghiệp', supplier: 'TAHOMART Siêu Thị Sỉ' },
      { item: 'In ấn catalogue, brochure giới thiệu năng lực sản xuất', supplier: 'In Ấn Công Nghiệp Tân Á' },
      { item: 'Dịch vụ logistics trọn gói cảng Cát Lái - Hiệp Phước', supplier: 'SEAIRLANDEX Forwarding' }
    ],
    createdAt: '2026-08-28T09:00:00+07:00',
    updatedAt: '2026-09-28T13:00:00+07:00'
  },

  // 5. Hội thảo hoặc giới thiệu năng lực - ESG & Báo cáo Carbon nhà xưởng (Miễn phí 100%)
  {
    id: 'webinar-esg-carbon-green-factory',
    publicCode: 'PRG-2026-005',
    slug: 'webinar-esg-carbon-green-factory',
    name: 'Hội Thảo Giới Thiệu Giải Pháp Chuyển Đổi Xanh & Tiêu Chuẩn ESG Cho Nhà Cung Ứng KCN',
    title: 'Hội Thảo Giới Thiệu Giải Pháp Chuyển Đổi Xanh & Tiêu Chuẩn ESG Cho Nhà Cung Ứng KCN',
    shortName: 'Hội Thảo Chuyển Đổi Xanh & ESG',
    shortDescription: 'Hướng dẫn cụ thể lộ trình đạt chuẩn kiểm toán chuỗi cung ứng xanh từ các tập đoàn đa quốc gia.',
    type: 'hoi-thao-pitching',
    programType: PROGRAM_TYPES_ENUM.SEMINAR,
    typeName: 'Hội thảo hoặc giới thiệu năng lực',
    image: '/images/association_b2b_meeting.jpg',
    coverImageId: 'img_esg_webinar_01',
    date: '02/12/2026',
    time: '14:00 - 17:00',
    startAt: '2026-12-02T14:00:00+07:00',
    endAt: '2026-12-02T17:00:00+07:00',
    registrationOpenAt: '2026-10-01T08:00:00+07:00',
    registrationCloseAt: '2026-11-30T17:00:00+07:00',
    location: 'Trực tuyến qua Zoom & Livestream Cổng Chuỗi Cung Ứng',
    locationType: 'ONLINE_PORTAL',
    venue: 'Hội trường Trực Tuyến CCU & Zoom Pro',
    provinceId: 'toan-quoc',
    industrialParkId: null,
    zone: 'Miền Nam',
    kcn: 'Liên KCN Toàn Quốc',
    industry: 'Cơ điện lạnh MEP & Năng lượng xanh',
    needGroup: ['Điện mặt trời áp mái', 'Chứng chỉ ISO 14064', 'Báo cáo kiểm kê khí nhà kính', 'Thiết bị tiết kiệm năng lượng'],
    organizerOrganizationId: 'ORG-CCU-MASTER',
    organizer: 'Viện Nghiên cứu Phát triển Kinh tế Tuần hoàn & Mạng lưới CCU',
    suitableFor: ['Chủ doanh nghiệp, Giám đốc kỹ thuật, Quản lý chuỗi cung ứng bền vững'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.FACTORY, TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tuyen',
    modality: MODALITY_ENUM.ONLINE,
    formatName: 'Trực tuyến (Online)',
    status: 'dang-nhan-dang-ky',
    statusName: 'Đang nhận đăng ký',
    programStatus: PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Phối hợp chuyên gia Viện tuần hoàn duyệt slide hướng dẫn CBAM',
    nextActionAt: '2026-10-15T09:00:00+07:00',
    pricingType: 'free',
    pricingSummary: 'Miễn phí',
    pricingDetail: {
      buyer: 'Miễn phí 100% toàn bộ tài liệu và chứng nhận tham gia hội thảo.',
      supplier: 'Miễn phí 100% tham dự trực tuyến; Đăng ký phần Pitching giới thiệu giải pháp: 1.500.000đ.'
    },
    participationOptions: [
      {
        id: 'opt_esg_all_free',
        role: 'ALL',
        participationType: 'ONLINE_ATTENDEE',
        title: 'Tham dự Trực Tuyến & Nhận Tài Liệu Chuẩn Hóa ESG',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Miễn phí 100% cho mọi doanh nghiệp thành viên, bao gồm slide thuyết trình và bộ template kiểm kê phát thải.'
      }
    ],
    isSponsored: true,
    sponsorName: 'Tài trợ bởi Chương trình Phát triển Bền vững',
    factoriesCount: 120,
    suppliersCount: 300,
    highlight: 'Hướng dẫn cụ thể lộ trình đạt chuẩn kiểm toán chuỗi cung ứng xanh từ các tập đoàn đa quốc gia.',
    description: 'Chương trình hội thảo chuyên sâu cập nhật các quy định mới nhất về CBAM Châu Âu và yêu cầu kiểm toán ESG.',
    relations: {
      categoryIds: ['nang-luong-xanh', 'kiem-dinh-chung-nhan'],
      keywords: ['điện mặt trời', 'chứng chỉ ISO 14064', 'kiểm kê khí nhà kính', 'tiết kiệm năng lượng'],
      organizationIds: ['ORG-CCU-MASTER'],
      requirementIds: [],
      sponsorIds: [],
      mediaItems: ['/images/association_b2b_meeting.jpg']
    },
    needToBuy: [
      { item: 'Lắp đặt hệ thống Điện mặt trời áp mái nhà xưởng 1.5MWp', qty: '3 dự án', buyer: 'Tập đoàn Sản Xuất Giày Da Tân Bình' },
      { item: 'Dịch vụ tư vấn chứng chỉ kiểm kê khí nhà kính ISO 14064', qty: 'Trọn gói', buyer: 'Công ty Cổ Phần Nhựa Sinh Học' },
      { item: 'Giải pháp biến tần tiết kiệm điện & Tự động ngắt tải cao điểm', qty: '50 cụm máy', buyer: 'Nhà máy Dệt Sợi KCN' }
    ],
    needToSell: [
      { item: 'Tư vấn chứng chỉ ISO 14001, ISO 50001 & Báo cáo ESG', supplier: 'Viện Nghiên Cứu Chuyển Đổi Xanh' },
      { item: 'Hệ thống điện mặt trời áp mái và giải pháp lưu trữ BESS', supplier: 'GreenEnergy Solutions VN' },
      { item: 'Thiết bị cảm biến đo lường tiêu thụ điện năng thông minh IoT', supplier: 'SmartSensor Tech' }
    ],
    createdAt: '2026-09-01T08:00:00+07:00',
    updatedAt: '2026-09-28T14:00:00+07:00'
  },

  // 6. Khảo sát nhu cầu: Ngày hội KCN Nhơn Trạch & Long Thành
  {
    id: 'nhon-trach-long-thanh',
    publicCode: 'PRG-2026-006',
    slug: 'nhon-trach-long-thanh',
    aliasIds: ['nhon-trach-long-thanh-survey'],
    name: 'Khảo Sát Nhu Cầu & Ngày Hội Cung Ứng KCN Nhơn Trạch 1-6 & Sân Bay Long Thành',
    title: 'Khảo Sát Nhu Cầu & Ngày Hội Cung Ứng KCN Nhơn Trạch 1-6 & Sân Bay Long Thành',
    shortName: 'Ngày Hội Cung Ứng Nhơn Trạch & Long Thành',
    shortDescription: 'Quy mô lớn nhất khu vực Đồng Nai trước thềm vận hành chính thức Sân bay Quốc tế Long Thành.',
    type: 'ngay-hoi-chuoi-cung-ung',
    programType: PROGRAM_TYPES_ENUM.SUPPLY_CHAIN_DAY,
    typeName: 'Ngày hội Chuỗi Cung Ứng',
    image: '/images/industrial_park_hero.jpg',
    coverImageId: 'img_nhontrach_hero_01',
    date: '15/12/2026',
    time: '08:00 - 17:30',
    startAt: '2026-12-15T08:00:00+07:00',
    endAt: '2026-12-15T17:30:00+07:00',
    registrationOpenAt: null,
    registrationCloseAt: null,
    location: 'Khu Đô Thị & KCN Nhơn Trạch 3, Huyện Nhơn Trạch, Đồng Nai',
    locationType: 'INDUSTRIAL_PARK',
    venue: 'Trung tâm Hành chính KCN Nhơn Trạch 3',
    provinceId: 'dong-nai',
    industrialParkId: 'kcn-nhon-trach',
    zone: 'Miền Nam',
    kcn: 'Nhơn Trạch 1-6 & Long Thành',
    industry: 'Logistics, Cảng biển & Kho bãi',
    needGroup: ['Máy bơm hạt nhựa', 'Pallet gỗ ISPM 15', 'Kho logistics lạnh', 'Thép tiền chế', 'Suất ăn công nghiệp'],
    organizerOrganizationId: 'ORG-AMATA-003',
    organizer: 'Hiệp hội Doanh nghiệp Đồng Nai & Ban Điều phối CCU',
    suitableFor: ['Nhà máy sản xuất nhựa, cơ khí, kho bãi hậu cần sân bay Long Thành'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.FACTORY, TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'dang-khao-sat',
    statusName: 'Đang khảo sát nhu cầu',
    programStatus: PROGRAM_STATUSES_ENUM.NEEDS_DISCOVERY,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Gửi bảng khảo sát danh mục mua sắm cho 35 nhà máy KCN Nhơn Trạch 2',
    nextActionAt: '2026-10-10T11:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Miễn phí khảo sát và tiếp nhận danh mục mua sắm.',
      supplier: 'Đang cập nhật biểu phí theo sơ đồ mặt bằng; Nhận đăng ký quan tâm giữ chỗ ưu tiên.'
    },
    participationOptions: [
      {
        id: 'opt_nt_interest',
        role: 'ALL',
        participationType: 'INTEREST_ONLY',
        title: 'Đăng Ký Quan Tâm & Nhận Báo Cáo Khảo Sát Nhu Cầu',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Đăng ký quan tâm để nhận danh mục nhu cầu mua sắm tổng hợp ngay khi ban tổ chức đóng cổng khảo sát.'
      }
    ],
    isSponsored: false,
    factoriesCount: 82,
    suppliersCount: 210,
    highlight: 'Quy mô lớn nhất khu vực Đồng Nai trước thềm vận hành chính thức Sân bay Quốc tế Long Thành.',
    description: 'Ban tổ chức đang tiến hành thu thập và chuẩn hóa danh mục nhu cầu mua sắm từ 80+ nhà máy FDI tại các KCN Nhơn Trạch.',
    relations: {
      categoryIds: ['logistics-kho-bai', 'nhua-va-cao-su', 'xay-dung-nha-xuong'],
      keywords: ['máy bơm hạt nhựa', 'pallet gỗ ISPM 15', 'kho logistics lạnh', 'thép kết cấu'],
      organizationIds: ['ORG-AMATA-003'],
      requirementIds: [],
      sponsorIds: [],
      mediaItems: ['/images/industrial_park_hero.jpg']
    },
    needToBuy: [
      { item: 'Máy bơm hạt nhựa, trục vít đùn cao su & Máy ép thủy lực 500T', qty: '4 máy ép mới', buyer: 'Nhựa Kỹ Thuật Nhơn Trạch Vina' },
      { item: 'Hạt nhựa ABS, PP, POM tái sinh & Hạt nhựa nguyên sinh', qty: '150 tấn/tháng', buyer: 'Sản Xuất Nhựa Gia Dụng & Công Nghiệp' },
      { item: 'Khảo sát địa chất mở rộng xưởng & Thép kết cấu tiền chế', qty: '20.000 m² sàn', buyer: 'Khu Phức Hợp Kho Long Thành Gateway' },
      { item: 'Đồng phục nhân viên kho bãi & Quần áo bảo hộ chống cháy', qty: '10.000 bộ', buyer: 'Trung Tâm Khai Thác Sân Bay Long Thành' },
      { item: 'Dịch vụ suất ăn công nghiệp 3 ca liên tục', qty: '6.000 phần/ngày', buyer: 'Nhà Máy Sản Xuất Dây Cáp Điện VinaCable' }
    ],
    needToSell: [
      { item: 'Đồng phục may đo chuẩn nhận diện, quà tặng doanh nghiệp', supplier: 'ADAMEVA & CGDP.vn' },
      { item: 'Cơ khí máy móc phụ trợ, máy bơm hút hạt nhựa', supplier: 'Cơ Khí Tân Thành' },
      { item: 'Dịch vụ logistics đường bộ, vận chuyển siêu trường siêu trọng', supplier: 'PORTALINK Heavy Transport' },
      { item: 'Sàn bê tông mài tăng cứng Liquid Hardener, sơn Epoxy', supplier: 'Thi Công Xây Dựng Sàn Sài Gòn' }
    ],
    createdAt: '2026-09-05T09:00:00+07:00',
    updatedAt: '2026-09-28T14:30:00+07:00'
  },

  // 7. Phúc lợi cộng đồng khi đã triển khai - Hội chợ Phúc lợi Công nhân KCN
  {
    id: 'phuc-loi-cong-nhan-kcn-binh-duong',
    publicCode: 'PRG-2026-007',
    slug: 'phuc-loi-cong-nhan-kcn-binh-duong',
    name: 'Chương Trình Phúc Lợi Cộng Đồng: Hàng Tiêu Dùng Giá Xuất Xưởng Dành Cho Công Nhân KCN',
    title: 'Chương Trình Phúc Lợi Cộng Đồng: Hàng Tiêu Dùng Giá Xuất Xưởng Dành Cho Công Nhân KCN',
    shortName: 'Phúc Lợi Công Nhân KCN Bình Dương',
    shortDescription: 'Hoạt động trách nhiệm xã hội (CSR) kết nối sản phẩm giá gốc từ nhà máy trực tiếp tới đời sống công nhân.',
    type: 'phuc-loi-cong-dong',
    programType: PROGRAM_TYPES_ENUM.WELFARE_COMMUNITY,
    typeName: 'Phúc lợi cộng đồng khi đã triển khai',
    image: '/images/recruitment_hero.jpg',
    coverImageId: 'img_csr_binhduong_01',
    date: '20/12/2026',
    time: '07:30 - 20:00',
    startAt: '2026-12-20T07:30:00+07:00',
    endAt: '2026-12-20T20:00:00+07:00',
    registrationOpenAt: '2026-10-15T08:00:00+07:00',
    registrationCloseAt: '2026-12-10T17:00:00+07:00',
    location: 'Nhà Văn Hóa Lao Động KCN Mỹ Phước, Bến Cát, Bình Dương',
    locationType: 'CONVENTION_CENTER',
    venue: 'Nhà Văn Hóa Lao Động KCN Mỹ Phước',
    provinceId: 'binh-duong',
    industrialParkId: 'kcn-my-phuoc',
    zone: 'Miền Nam',
    kcn: 'Mỹ Phước 1, 2 & 3',
    industry: 'Phúc lợi công nhân & Tiêu dùng sỉ',
    needGroup: ['Áo thun đồng phục giá xưởng', 'Gia vị thực phẩm đóng gói', 'Đồ gia dụng nhà bếp', 'Quà tết công nhân'],
    organizerOrganizationId: 'ORG-TAHOMART-002',
    organizer: 'Công đoàn KCN & Mạng lưới Doanh nghiệp Chuỗi Cung Ứng',
    suitableFor: ['Công nhân viên nhà máy', 'Doanh nghiệp sản xuất hàng tiêu dùng và thực phẩm thiết yếu'],
    targetRoles: [TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'sap-mo-dang-ky',
    statusName: 'Sắp mở đăng ký',
    programStatus: PROGRAM_STATUSES_ENUM.UPCOMING,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Làm việc với Công đoàn KCN Mỹ Phước về danh mục 15 gian trợ giá',
    nextActionAt: '2026-10-12T15:00:00+07:00',
    pricingType: 'free',
    pricingSummary: 'Miễn phí',
    pricingDetail: {
      buyer: 'Miễn phí 100% vé vào cổng cho toàn bộ công nhân và người lao động tại KCN.',
      supplier: 'Miễn phí mặt bằng cho 15 doanh nghiệp sản xuất cam kết bán giảm giá 20-30% cho công nhân.'
    },
    participationOptions: [
      {
        id: 'opt_csr_free',
        role: 'ALL',
        participationType: 'COMMUNITY_FREE',
        title: 'Tham gia Ngày Hội Phúc Lợi Cộng Đồng',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Miễn phí vé vào cổng và tài trợ mặt bằng cho nhà sản xuất cam kết giá trợ giá.'
      }
    ],
    isSponsored: true,
    sponsorName: 'Bảo trợ bởi Quỹ Hỗ trợ Người lao động KCN',
    factoriesCount: 35,
    suppliersCount: 60,
    highlight: 'Hoạt động trách nhiệm xã hội (CSR) kết nối sản phẩm giá gốc từ nhà máy trực tiếp tới đời sống công nhân.',
    description: 'Chương trình phúc lợi thường niên mang đến hàng nghìn sản phẩm thiết yếu với mức giá trợ giá từ nhà sản xuất.',
    relations: {
      categoryIds: ['hang-tieu-dung-si', 'thuc-pham-gia-dinh'],
      keywords: ['quà tết công nhân', 'áo thun giá xưởng', 'gia vị thực phẩm', 'đồ gia dụng'],
      organizationIds: ['ORG-TAHOMART-002'],
      requirementIds: [],
      sponsorIds: [],
      mediaItems: ['/images/recruitment_hero.jpg']
    },
    needToBuy: [
      { item: 'Giỏ quà tết công nhân viên nhà máy bánh kẹo, dầu ăn', qty: '12.000 suất quà', buyer: 'Ban Chấp Hành Công Đoàn KCN' },
      { item: 'Áo thun polo quà tặng công nhân cuối năm', qty: '15.000 áo', buyer: 'Liên Đoàn Lao Động Địa Phương' }
    ],
    needToSell: [
      { item: 'Dầu ăn, gia vị thực phẩm đóng gói giá gốc xuất xưởng', supplier: 'TAHOMART Thực Phẩm Sỉ' },
      { item: 'Nồi cơm điện, chảo chống dính, bình giữ nhiệt quà tặng', supplier: 'Gia Dụng Sunhouse Phân Phối Sỉ' }
    ],
    createdAt: '2026-09-08T10:00:00+07:00',
    updatedAt: '2026-09-28T15:00:00+07:00'
  },

  // 8. Đã diễn ra: Ngày hội Chuỗi Cung Ứng KCN Hàm Kiệm 1 (Lưu trữ ảnh & kết quả đã xác nhận)
  {
    id: 'ham-kiem-1',
    publicCode: 'PRG-2026-008',
    slug: 'ham-kiem-1',
    aliasIds: ['ham-kiem-1-archive'],
    name: 'Ngày Hội Chuỗi Cung Ứng Khu Công Nghiệp Hàm Kiệm 1',
    title: 'Ngày Hội Chuỗi Cung Ứng Khu Công Nghiệp Hàm Kiệm 1 (Tổng kết kỳ 1)',
    shortName: 'Ngày Hội Cung Ứng KCN Hàm Kiệm 1',
    shortDescription: 'Kỳ sự kiện thành công với 18 biên bản MOU được ký tại chỗ và 142 phiên kết nối giao thương trực tiếp.',
    type: 'ngay-hoi-chuoi-cung-ung',
    programType: PROGRAM_TYPES_ENUM.SUPPLY_CHAIN_DAY,
    typeName: 'Ngày hội Chuỗi Cung Ứng',
    image: '/images/supply_chain_expo_hero.jpg',
    coverImageId: 'img_hamkiem_hero_01',
    date: '20/09/2026',
    time: '08:00 - 17:00',
    startAt: '2026-09-20T08:00:00+07:00',
    endAt: '2026-09-20T17:00:00+07:00',
    registrationOpenAt: '2026-08-01T08:00:00+07:00',
    registrationCloseAt: '2026-09-15T17:00:00+07:00',
    location: 'Khu Công Nghiệp Hàm Kiệm 1, Hàm Thuận Nam, Bình Thuận',
    locationType: 'INDUSTRIAL_PARK',
    venue: 'Hội trường KCN Hàm Kiệm 1',
    provinceId: 'binh-thuan',
    industrialParkId: 'kcn-ham-kiem-1',
    zone: 'Miền Nam',
    kcn: 'Hàm Kiệm 1',
    industry: 'Thực phẩm, Đồ uống & Nông sản',
    needGroup: ['Áo thun công nhân', 'Máy ép nhựa đùn', 'Thùng carton 5 lớp', 'Sàn Epoxy 12.000m²'],
    organizerOrganizationId: 'ORG-PROSER-001',
    organizer: 'Ban Quản lý KCN Hàm Kiệm 1 & Chuỗi Cung Ứng Việt Nam',
    suitableFor: ['Nhà máy chế biến nông thủy sản xuất khẩu', 'Nhà cung ứng vật tư bao bì, máy móc phụ trợ'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.FACTORY, TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'da-dien-ra',
    statusName: 'Đã diễn ra',
    programStatus: PROGRAM_STATUSES_ENUM.COMPLETED,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Hoàn tất gửi báo cáo tổng kết kỳ 1 cho Ban Quản lý các KCN Bình Thuận',
    nextActionAt: '2026-09-30T17:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Đã hoàn thành phiên làm việc với 42 đại diện mua hàng FDI/DDI.',
      supplier: 'Đã hoàn thành khớp nối với 115 nhà cung ứng tham gia.'
    },
    participationOptions: [
      {
        id: 'opt_hk_archive',
        role: 'ALL',
        participationType: 'ARCHIVE_VIEW',
        title: 'Truy cập Thư Viện & Kỷ Yếu Dữ Liệu Sự Kiện',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Xem thư viện ảnh, báo cáo số liệu tổng hợp đã xác thực và danh bạ kết nối.'
      }
    ],
    isSponsored: false,
    factoriesCount: 42,
    suppliersCount: 115,
    highlight: 'Kỳ sự kiện thành công với 18 biên bản MOU được ký tại chỗ và 142 phiên kết nối giao thương trực tiếp.',
    description: 'Sự kiện đã khép lại thành công tốt đẹp. Dưới đây là biên bản tổng hợp số liệu và hình ảnh hoạt động được phép công bố chính thức.',
    relations: {
      categoryIds: ['che-bien-thuy-san', 'bao-bi-carton', 'thi-cong-san-epoxy'],
      keywords: ['áo thun công nhân', 'máy ép nhựa đùn', 'thùng carton 5 lớp', 'sàn epoxy 12000m2'],
      organizationIds: ['ORG-PROSER-001'],
      requirementIds: ['REQ-2026-001'],
      sponsorIds: [],
      mediaItems: ['/images/supply_chain_expo_hero.jpg', '/images/association_b2b_meeting.jpg', '/images/smart_factory_hero.jpg']
    },
    needToBuy: [
      { item: 'Áo thun & Đồng phục công nhân, bảo hộ PPE', qty: '15.000 bộ/năm', buyer: 'Nhà máy Dệt May Tân Bình Thuận' },
      { item: 'Máy bơm hạt nhựa & Máy ép khuôn đùn', qty: '8 cụm máy', buyer: 'Công ty Bao Bì Nhựa KCN' },
      { item: 'Nước mắm & Gia vị đóng can suất ăn công nghiệp', qty: '3.500 lít/tháng', buyer: 'Suất ăn công nghiệp Hải Âu' },
      { item: 'Thùng carton 3-5 lớp in flexo chống thấm', qty: '50.000 thùng/tháng', buyer: 'Chế Biến Thủy Hải Sản Bình Thuận' },
      { item: 'Lắp đặt hệ thống Điện mặt trời áp mái nhà xưởng 1.2MWp', qty: '1 hệ thống', buyer: 'Nhà máy Chế Biến Nông Sản Nam Việt' },
      { item: 'Pallet nhựa chịu tải 1.5 tấn & Pallet gỗ hun trùng ISPM 15', qty: '2.000 chiếc', buyer: 'Kho Logistics Cảng Hàm Kiệm' },
      { item: 'Thi công sàn bê tông mài tăng cứng & Sơn Epoxy chống bám bụi', qty: '12.000 m²', buyer: 'Dự án Mở Rộng Xưởng Pha 2' }
    ],
    needToSell: [
      { item: 'Áo thun đồng phục nhân viên & May đo công sở cao cấp', supplier: 'Chuyên Gia Đồng Phục (CGDP.vn)' },
      { item: 'Dịch vụ Vận tải container lạnh & Logistics hải quan', supplier: 'PORTALINK Logistics' },
      { item: 'Bu lông ốc vít inox 304/316 & Linh kiện gá kẹp Jig CNC', supplier: 'Cơ Khí Chính Xác VinaFastener' },
      { item: 'Hệ thống trạm biến áp 22kV, tủ điện điều khiển công nghiệp', supplier: 'Cơ Điện MEP Tech' },
      { item: 'Thùng carton, túi màng PE, màng co tự hủy sinh học', supplier: 'Bao Bì Xanh Việt Nam' },
      { item: 'Tư vấn hồ sơ chứng nhận ISO 9001:2015 & Báo cáo phát thải ESG', supplier: 'Tổ Chức Kiểm Định Chất Lượng VN' }
    ],
    // Dữ liệu kết quả thực tế đã xác nhận tuân thủ Section 21
    recap: {
      verified: true,
      registrationsCount: 168,
      attendanceCount: 157, // Thực tế điểm danh khác số đăng ký
      factoriesJoined: 42,
      suppliersJoined: 115,
      sessionsCompleted: 142, // Số phiên gặp thực tế diễn ra
      requirementsConfirmed: 38,
      quotesRecorded: 64,
      outcomesConfirmed: 18, // 18 thỏa thuận/MOU được xác nhận, không đánh đồng là Deal hoàn tất
      estimatedDealValue: '48.5 Tỷ VNĐ',
      topCategories: ['May mặc đồng phục & PPE', 'Bao bì carton chống ẩm', 'Điện mặt trời mái xưởng', 'Pallet kho lạnh'],
      publishedPhotos: [
        '/images/supply_chain_expo_hero.jpg',
        '/images/association_b2b_meeting.jpg',
        '/images/smart_factory_hero.jpg'
      ]
    },
    createdAt: '2026-07-20T08:00:00+07:00',
    updatedAt: '2026-09-22T17:00:00+07:00'
  },

  // 9. Hội thảo Pitching năng lực: Công nghệ Tự Động Hóa KCN Hòa Khánh & Chu Lai (Đã đóng đăng ký)
  {
    id: 'pitching-automation-chu-lai',
    publicCode: 'PRG-2026-009',
    slug: 'pitching-automation-chu-lai',
    aliasIds: ['hoa-khanh-chu-lai'],
    name: 'Phiên Pitching Giới Thiệu Năng Lực Cơ Khí & Tự Động Hóa KCN Chu Lai - Hòa Khánh',
    title: 'Phiên Pitching Giới Thiệu Năng Lực Cơ Khí & Tự Động Hóa KCN Chu Lai - Hòa Khánh',
    shortName: 'Pitching Cơ Khí & Tự Động Hóa Miền Trung',
    shortDescription: 'Chương trình nhằm tuyển chọn các nhà cung ứng linh kiện đạt chuẩn tham gia chuỗi cung ứng sản xuất ô tô.',
    type: 'hoi-thao-pitching',
    programType: PROGRAM_TYPES_ENUM.SUPPLIER_PRESENTATION,
    typeName: 'Phiên giới thiệu sản phẩm & năng lực',
    image: '/images/association_hero_modern.jpg',
    coverImageId: 'img_chulai_hero_01',
    date: '28/09/2026',
    time: '13:30 - 17:30',
    startAt: '2026-09-28T13:30:00+07:00',
    endAt: '2026-09-28T17:30:00+07:00',
    registrationOpenAt: '2026-08-15T08:00:00+07:00',
    registrationCloseAt: '2026-09-25T17:00:00+07:00',
    location: 'Hội trường Thaco Chu Lai, Núi Thành, Quảng Nam',
    locationType: 'FACTORY_VENUE',
    venue: 'Hội trường Khu Công Nghiệp Cơ Khí Ô Tô Chu Lai',
    provinceId: 'quang-nam',
    industrialParkId: 'kcn-chu-lai',
    zone: 'Miền Trung',
    kcn: 'Khu Kinh Tế Mở Chu Lai & KCN Hòa Khánh',
    industry: 'Cơ khí chính xác & Bán dẫn',
    needGroup: ['Dập thân vỏ ô tô', 'Dây cáp điện xe hơi', 'Sơn tĩnh điện tự động', 'Gia công chi tiết đúc'],
    organizerOrganizationId: 'ORG-HAME-005',
    organizer: 'Hiệp hội Doanh nghiệp Cơ khí Miền Trung phối hợp CCU',
    suitableFor: ['Doanh nghiệp phụ trợ ngành lắp ráp ô tô và gia công kim loại tấm'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.SUPPLIER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'da-dong-dang-ky',
    statusName: 'Đã đóng đăng ký',
    programStatus: PROGRAM_STATUSES_ENUM.REGISTRATION_CLOSED,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_trung',
    ownerName: 'Phạm Hồng Thái (Coordinator Miền Trung)',
    nextAction: 'Kiểm tra tài liệu thuyết trình của 30 doanh nghiệp phụ trợ cơ khí đã đăng ký',
    nextActionAt: '2026-09-29T10:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Miễn phí theo thư mời đích danh.',
      supplier: 'Đã đủ số lượng 30 doanh nghiệp thuyết trình năng lực.'
    },
    participationOptions: [
      {
        id: 'opt_cl_closed',
        role: 'ALL',
        participationType: 'CLOSED_WAITLIST',
        title: 'Đăng Ký Danh Sách Chờ (Waitlist)',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Chương trình đã chốt đủ danh sách. Để lại thông tin nếu có doanh nghiệp hủy chỗ.'
      }
    ],
    isSponsored: false,
    factoriesCount: 28,
    suppliersCount: 30,
    highlight: 'Phiên pitching khép kín đã đủ chỉ tiêu đăng ký, chuyển sang giai đoạn chuẩn bị tài liệu kỹ thuật.',
    description: 'Chương trình nhằm tuyển chọn các nhà cung ứng linh kiện đạt chuẩn tham gia chuỗi cung ứng sản xuất ô tô.',
    relations: {
      categoryIds: ['phu-tro-o-to', 'co-khi-che-tao'],
      keywords: ['dập thân vỏ ô tô', 'dây cáp điện xe hơi', 'sơn tĩnh điện'],
      organizationIds: ['ORG-HAME-005'],
      requirementIds: [],
      sponsorIds: [],
      mediaItems: ['/images/association_hero_modern.jpg']
    },
    needToBuy: [
      { item: 'Dây cáp điện ô tô, đầu cos & Ống gen bọc cách điện', qty: '500.000 mét', buyer: 'Tập Đoàn Sản Xuất Ô Tô Chu Lai' },
      { item: 'Gia công dập thân vỏ kim loại & Sơn tĩnh điện bột', qty: '50.000 chi tiết', buyer: 'Cơ Khí Ô Tô Miền Trung' },
      { item: 'Suất ăn công nghiệp và May đồng phục công nhân xưởng cơ khí', qty: '4.000 bộ', buyer: 'KCN Hòa Khánh Đà Nẵng' }
    ],
    needToSell: [
      { item: 'Đồng phục may đo & Bảo hộ công nhân cơ khí', supplier: 'Chuyên Gia Đồng Phục (CGDP.vn)' },
      { item: 'Dịch vụ logistics đường biển cảng Tiên Sa - Chu Lai', supplier: 'PORTALINK Miền Trung' },
      { item: 'Thép hộp mạ kẽm, sắt tấm cắt laser theo bản vẽ', supplier: 'Cắt Gọt Thép Đà Nẵng' }
    ],
    createdAt: '2026-08-01T09:00:00+07:00',
    updatedAt: '2026-09-28T09:00:00+07:00'
  },

  // 10. Hoãn: Ngày hội KCN Tân Đức & Hải Sơn Long An
  {
    id: 'tan-duc-hai-son-postponed',
    publicCode: 'PRG-2026-010',
    slug: 'tan-duc-hai-son-postponed',
    name: 'Ngày Hội Chuỗi Cung Ứng KCN Tân Đức & Hải Sơn Long An (Tạm Hoãn)',
    title: 'Ngày Hội Chuỗi Cung Ứng KCN Tân Đức & Hải Sơn Long An (Tạm Hoãn)',
    shortName: 'Ngày Hội Cung Ứng KCN Tân Đức - Hải Sơn',
    shortDescription: 'Tạm hoãn do điều chỉnh mặt bằng mở rộng phân khu kết nối; sẽ thông báo ngày chính thức trước 30 ngày.',
    type: 'ngay-hoi-chuoi-cung-ung',
    programType: PROGRAM_TYPES_ENUM.SUPPLY_CHAIN_DAY,
    typeName: 'Ngày hội Chuỗi Cung Ứng',
    image: '/images/industrial_park_hero.jpg',
    coverImageId: 'img_tanduc_hero_01',
    date: 'Dự kiến Quý 1/2027',
    time: 'Thông báo sau',
    startAt: null,
    endAt: null,
    registrationOpenAt: null,
    registrationCloseAt: null,
    location: 'Khu Công Nghiệp Tân Đức, Huyện Đức Hòa, Long An',
    locationType: 'INDUSTRIAL_PARK',
    venue: 'Trung tâm Triển lãm KCN Tân Đức',
    provinceId: 'long-an',
    industrialParkId: 'kcn-tan-duc',
    zone: 'Miền Nam',
    kcn: 'Tân Đức & Hải Sơn',
    industry: 'Bao bì, In ấn & Nhựa kỹ thuật',
    needGroup: ['Bao bì màng ghép', 'Hạt nhựa tái sinh', 'Pallet gỗ xuất khẩu', 'Thi công mái che xưởng'],
    organizerOrganizationId: 'ORG-CCU-MASTER',
    organizer: 'Ban Quản lý KCN Long An & Ban Tổ Chức CCU',
    suitableFor: ['Doanh nghiệp trong KCN Đức Hòa, Bến Lức'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.FACTORY, TARGET_ROLES_ENUM.SUPPLIER, TARGET_ROLES_ENUM.PARTNER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'hoan',
    statusName: 'Hoãn',
    programStatus: PROGRAM_STATUSES_ENUM.POSTPONED,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Họp với BQL KCN Tân Đức chốt ngày tổ chức mới trong Quý 1/2027',
    nextActionAt: '2026-10-20T14:00:00+07:00',
    pricingType: 'tiered',
    pricingSummary: 'Xem phí theo hình thức',
    pricingDetail: {
      buyer: 'Giữ nguyên danh sách đăng ký quan tâm cho lịch mới.',
      supplier: 'Chưa thu phí; Sẽ thông báo lịch điều chỉnh sớm nhất.'
    },
    participationOptions: [
      {
        id: 'opt_td_postponed',
        role: 'ALL',
        participationType: 'POSTPONED_NOTIFICATION',
        title: 'Nhận Thông Báo Lịch Mới',
        feeType: 'FREE',
        amount: 0,
        currency: 'VND',
        description: 'Đăng ký để nhận thông báo ngày tổ chức mới ngay khi được phê duyệt.'
      }
    ],
    isSponsored: false,
    factoriesCount: 30,
    suppliersCount: 80,
    highlight: 'Tạm hoãn do điều chỉnh mặt bằng mở rộng phân khu kết nối; sẽ thông báo ngày chính thức trước 30 ngày.',
    description: 'Để đảm bảo không gian tiếp đón và đồng bộ với tiến độ khánh thành trung tâm dịch vụ mới của KCN, sự kiện được lùi sang đầu năm 2027.',
    relations: {
      categoryIds: ['bao-bi-nhua', 'hat-nhua'],
      keywords: ['màng ghép 3 lớp', 'pallet gỗ tràm'],
      organizationIds: ['ORG-CCU-MASTER'],
      requirementIds: [],
      sponsorIds: [],
      mediaItems: ['/images/industrial_park_hero.jpg']
    },
    needToBuy: [
      { item: 'Bao bì màng ghép 3 lớp chống ẩm thực phẩm', qty: '500.000 túi/tháng', buyer: 'Nhà Máy Thực Phẩm Long An' },
      { item: 'Pallet gỗ tràm hun trùng xuất khẩu EU', qty: '3.000 cái', buyer: 'Kho Ngoại Quan Đức Hòa' }
    ],
    needToSell: [
      { item: 'Màng PE bọc pallet, dây đai PP tự động', supplier: 'Nhựa Đóng Gói Vina' },
      { item: 'Bảo hộ lao động, giày chống đinh KCN', supplier: 'Bảo Hộ Sài Gòn' }
    ],
    createdAt: '2026-08-10T10:00:00+07:00',
    updatedAt: '2026-09-28T08:00:00+07:00'
  },

  // 11. Hủy: Diễn đàn Chuỗi Cung Ứng Phụ Trợ Amata
  {
    id: 'dien-dan-phu-tro-amata-cancelled',
    publicCode: 'PRG-2026-011',
    slug: 'dien-dan-phu-tro-amata-cancelled',
    name: 'Diễn Đàn Chuỗi Cung Ứng Phụ Trợ KCN Amata Biên Hòa (Đã Hủy)',
    title: 'Diễn Đàn Chuỗi Cung Ứng Phụ Trợ KCN Amata Biên Hòa (Đã Hủy)',
    shortName: 'Diễn Đàn Phụ Trợ KCN Amata',
    shortDescription: 'Đã hủy tổ chức riêng lẻ và sáp nhập toàn bộ nhu cầu mua hàng vào sự kiện KCN Nhơn Trạch - Long Thành.',
    type: 'hoi-thao-pitching',
    programType: PROGRAM_TYPES_ENUM.SEMINAR,
    typeName: 'Hội thảo hoặc giới thiệu năng lực',
    image: '/images/association_hero_modern.jpg',
    coverImageId: 'img_amata_cancelled_01',
    date: 'Đã hủy',
    time: 'Đã hủy',
    startAt: null,
    endAt: null,
    registrationOpenAt: null,
    registrationCloseAt: null,
    location: 'Khu Công Nghiệp Amata, TP. Biên Hòa, Đồng Nai',
    locationType: 'INDUSTRIAL_PARK',
    venue: 'KCN Amata Biên Hòa',
    provinceId: 'dong-nai',
    industrialParkId: 'kcn-amata',
    zone: 'Miền Nam',
    kcn: 'Amata Biên Hòa',
    industry: 'Cơ khí chính xác & Bán dẫn',
    needGroup: ['Cơ khí đột dập', 'Mạ kẽm nhúng nóng'],
    organizerOrganizationId: 'ORG-AMATA-003',
    organizer: 'Hiệp hội Doanh nghiệp Phụ trợ & CCU',
    suitableFor: ['Doanh nghiệp phụ trợ cơ khí Biên Hòa'],
    targetRoles: [TARGET_ROLES_ENUM.BUYER, TARGET_ROLES_ENUM.SUPPLIER],
    format: 'truc-tiep',
    modality: MODALITY_ENUM.OFFLINE,
    formatName: 'Trực tiếp',
    status: 'huy',
    statusName: 'Hủy',
    programStatus: PROGRAM_STATUSES_ENUM.CANCELLED,
    visibility: true,
    publishable: true,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân (Coordinator Miền Nam)',
    nextAction: 'Lưu trữ hồ sơ và chuyển nhu cầu mua hàng sang chương trình Nhơn Trạch',
    nextActionAt: '2026-09-30T10:00:00+07:00',
    pricingType: 'free',
    pricingSummary: 'Miễn phí',
    pricingDetail: {
      buyer: 'Đã thông báo hủy đến các nhà máy đăng ký.',
      supplier: 'Nội dung được sáp nhập vào Ngày hội Chuỗi Cung Ứng KCN Nhơn Trạch & Long Thành.'
    },
    participationOptions: [],
    isSponsored: false,
    factoriesCount: 15,
    suppliersCount: 40,
    highlight: 'Đã hủy tổ chức riêng lẻ và sáp nhập toàn bộ nhu cầu mua hàng vào sự kiện KCN Nhơn Trạch - Long Thành.',
    description: 'Chương trình được sáp nhập quy mô vào sự kiện lớn hơn tại KCN Nhơn Trạch để tăng hiệu quả kết nối tập trung.',
    relations: {
      categoryIds: ['co-khi-dot-dap'],
      keywords: ['mạ kẽm nhúng nóng'],
      organizationIds: ['ORG-AMATA-003'],
      requirementIds: [],
      sponsorIds: [],
      mediaItems: []
    },
    needToBuy: [],
    needToSell: [],
    createdAt: '2026-08-01T08:00:00+07:00',
    updatedAt: '2026-09-20T08:00:00+07:00'
  }
];

export const PROGRAMS_DATA = SEED_PROGRAMS;

// ----------------------------------------------------------------------------
// 4. STORAGE KEYS & LOCALSTORAGE INITIALIZATION
// ----------------------------------------------------------------------------

const STORAGE_KEYS = {
  PROGRAMS: 'ccu_programs_data',
  PROGRAM_INTERESTS: 'ccu_program_interests',
  PROGRAM_REGISTRATIONS: 'ccu_program_registrations_v1',
  LEAD_CONSENTS: 'ccu_lead_consents',
  CUSTOM_NOTIFICATIONS: 'ccu_program_custom_notifications',
  AUDIT_LOGS: 'ccu_program_audit_logs'
};

// ----------------------------------------------------------------------------
// 5. HELPER SERVICES & OPERATIONS (SECTIONS 11, 12, 14, 15, 27, 30)
// ----------------------------------------------------------------------------



/**
 * Chuẩn hóa và làm giàu dữ liệu chi tiết chương trình cho Page 21
 */
export function enrichProgramData(p) {
  if (!p) return null;

  // 1. Agenda (Section 15)
  const defaultAgenda = [
    {
      id: `${p.id}_ag_1`,
      startAt: '08:00',
      endAt: '08:30',
      timeRange: '08:00 - 08:30',
      title: 'Đón tiếp đại biểu & Check-in QR Code',
      description: 'Tiếp đón đại biểu, phát thẻ đeo, tài liệu kỷ yếu và danh bạ kết nối giao thương.',
      room: 'Sảnh chính',
      type: 'CHECK_IN',
      visibility: 'PUBLIC'
    },
    {
      id: `${p.id}_ag_2`,
      startAt: '08:30',
      endAt: '09:30',
      timeRange: '08:30 - 09:30',
      title: 'Khai mạc & Công bố Nhu cầu Chuỗi Cung Ứng',
      description: 'Đại diện BQL KCN và các Giám đốc Mua hàng FDI công bố tiêu chuẩn nhà cung cấp và danh mục ưu tiên nội địa hóa.',
      room: 'Hội trường lớn',
      type: 'OPENING',
      visibility: 'PUBLIC'
    },
    {
      id: `${p.id}_ag_3`,
      startAt: '09:30',
      endAt: '11:45',
      timeRange: '09:30 - 11:45',
      title: 'Phiên Kết nối 1:1 (Session 1) & Trình diễn năng lực',
      description: 'Gặp gỡ 1:1 theo lịch hẹn đã xác nhận giữa Buyer và Supplier đã qua thẩm định hồ sơ kỹ thuật.',
      room: 'Khu vực Bàn làm việc B2B',
      type: 'B2B_MATCHING',
      visibility: 'PUBLIC'
    },
    {
      id: `${p.id}_ag_4`,
      startAt: '11:45',
      endAt: '13:30',
      timeRange: '11:45 - 13:30',
      title: 'Networking Lunch & Thảo luận tự do',
      description: 'Tiệc trưa kết nối mở giữa đại diện các nhà máy FDI, nhà sản xuất phụ trợ và hiệp hội ngành hàng.',
      room: 'Khu vực VIP Lounge',
      type: 'BREAK',
      visibility: 'PUBLIC'
    },
    {
      id: `${p.id}_ag_5`,
      startAt: '13:30',
      endAt: '16:30',
      timeRange: '13:30 - 16:30',
      title: 'Phiên Kết nối 1:1 (Session 2) & Thẩm định mẫu sản phẩm',
      description: 'Trao đổi sâu về dung sai bản vẽ, kiểm tra mẫu sản phẩm thực tế và thống nhất kế hoạch đánh giá xưởng.',
      room: 'Khu vực Bàn làm việc B2B',
      type: 'B2B_MATCHING',
      visibility: 'PUBLIC'
    },
    {
      id: `${p.id}_ag_6`,
      startAt: '16:30',
      endAt: '17:30',
      timeRange: '16:30 - 17:30',
      title: 'Ký kết Biên bản ghi nhớ (MOU) & Bế mạc',
      description: 'Ghi nhận các biên bản kết nối ban đầu, tổng kết giao thương và hướng dẫn các bước theo dõi sau sự kiện.',
      room: 'Hội trường lớn',
      type: 'CLOSING',
      visibility: 'PUBLIC'
    }
  ];

  // 2. Audience Details (Section 5)
  const defaultAudienceDetails = {
    buyer: {
      role: 'BUYER',
      title: 'Dành cho Nhà máy / Phòng Mua hàng (Purchasing)',
      whoIsItFor: 'Trưởng phòng Mua hàng, Giám đốc Mua sắm (CPO), Giám đốc Chuỗi cung ứng và Trưởng bộ phận Kỹ thuật các nhà máy FDI.',
      eligibility: 'Nhà máy đang hoạt động tại KCN hoặc các tỉnh lân cận, có nhu cầu tìm nhà cung cấp nội địa hóa và sẵn sàng tiếp nhận chào giá.',
      expectedPreparation: 'Chuẩn bị danh mục phụ trợ cần tìm, tiêu chuẩn kỹ thuật (Tolerance, Material specs), số lượng dự kiến và yêu cầu chứng chỉ.',
      participationOptionId: p.participationOptions?.find(o => o.role === 'BUYER')?.id || 'opt_buyer_default'
    },
    supplier: {
      role: 'SUPPLIER',
      title: 'Dành cho Nhà cung ứng / Nhà sản xuất phụ trợ',
      whoIsItFor: 'Doanh nghiệp sản xuất công nghiệp phụ trợ, cơ khí CNC, khuôn mẫu, tự động hóa, bao bì, phòng sạch và vật tư công nghiệp tiêu hao.',
      eligibility: 'Có xưởng sản xuất trực tiếp, có hồ sơ năng lực đầy đủ, đạt tối thiểu chứng nhận ISO 9001 hoặc tương đương.',
      expectedPreparation: 'Chuẩn bị Hồ sơ năng lực (Company Profile), danh mục sản phẩm/dịch vụ, catalog kỹ thuật, mẫu sản phẩm thực tế và bảng chào giá tham khảo.',
      participationOptionId: p.participationOptions?.find(o => o.role === 'SUPPLIER')?.id || 'opt_supplier_default'
    },
    partner: {
      role: 'PARTNER',
      title: 'Dành cho KCN, Hiệp hội & Đơn vị đồng hành',
      whoIsItFor: 'Ban quản lý KCN, Hiệp hội ngành hàng cơ khí, tự động hóa, logistics, các tổ chức xúc tiến thương mại trong và ngoài nước.',
      eligibility: 'Đơn vị có tư cách pháp nhân, đại diện quyền lợi cho cộng đồng doanh nghiệp hội viên hoặc hạ tầng KCN.',
      expectedPreparation: 'Chuẩn bị thông điệp phát biểu, gian giới thiệu chính sách ưu đãi đầu tư và danh sách doanh nghiệp hội viên đồng hành.',
      participationOptionId: p.participationOptions?.find(o => o.role === 'PARTNER')?.id || 'opt_partner_default'
    }
  };

  // 3. Support Contact (Section 3)
  const defaultSupportContact = {
    coordinatorName: p.ownerName ? p.ownerName.split('(')[0].trim() : 'Lê Minh Quân',
    role: 'Điều phối viên Trưởng Ban Kết nối B2B',
    phone: '0903 888 777',
    email: 'quan.le@chuoicungung.com',
    zalo: '0903888777',
    office: `Văn phòng Ban Điều phối Chuỗi Cung Ứng ${p.zone || 'Miền Nam'}`
  };

  // 4. Policies (Section 24)
  const defaultPolicies = {
    changeInfo: 'Doanh nghiệp có thể cập nhật thông tin đại biểu và danh mục chào hàng trước ngày đóng đăng ký tối thiểu 05 ngày làm việc.',
    cancellation: 'Hủy đăng ký trước ngày đóng cổng được bảo lưu quyền tham gia sang kỳ tiếp theo hoặc hoàn trả theo quy định hiện hành.',
    postponement: 'Trường hợp có thay đổi về thời gian do nguyên nhân khách quan, Ban điều phối sẽ thông báo chính thức trước tối thiểu 07 ngày.',
    refund: 'Hoàn 100% phí gian làm việc nếu chương trình bị hủy bởi Ban tổ chức; hoàn 80% nếu doanh nghiệp xin rút trước ngày đóng cổng 10 ngày.',
    paymentEntity: 'Công ty Cổ phần Mạng lưới Chuỗi Cung Ứng Việt Nam (STK: 1122334455 - Vietcombank CN Tân Định).',
    supportContact: 'Hotline điều phối: 0903 888 777 | Email: b2b-events@chuoicungung.com',
    dataPrivacy: 'Thông tin kỹ thuật và nhu cầu bảo mật của Buyer được bảo vệ theo thỏa thuận NDA. Không chia sẻ dữ liệu liên hệ riêng tư cho bên thứ ba.'
  };

  // 5. Sponsors (Section 13)
  const defaultSponsors = [
    {
      organizationId: 'ORG-PROSER-001',
      name: 'Chuyên Gia Đồng Phục Proser',
      tier: 'DIAMOND',
      tierName: 'Nhà Tài Trợ Kim Cương',
      logo: '/images/founding-partners/chuyen-gia-dong-phuc-logo.png',
      isConfirmed: true
    },
    {
      organizationId: 'ORG-AMATA-003',
      name: 'Tập Đoàn Hạ Tầng Amata',
      tier: 'STRATEGIC_PARTNER',
      tierName: 'Đối Tác Chiến Lược Hạ Tầng',
      logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100&auto=format&fit=crop&q=80',
      isConfirmed: true
    },
    {
      organizationId: 'ORG-TAHOMART-002',
      name: 'Tập Đoàn Tahomart Việt Nam',
      tier: 'GOLD',
      tierName: 'Nhà Tài Trợ Vàng',
      logo: '/images/founding-partners/tahomart-logo.png',
      isConfirmed: true
    }
  ];

  // 6. Catalogue (Section 20)
  const defaultCatalogue = {
    id: `CAT-${p.publicCode || p.id}`,
    title: `Kỷ Yếu Giao Thương & Danh Bạ Nhà Cung Ứng - ${p.shortName || p.title}`,
    totalPages: 48,
    totalSuppliers: p.suppliersCount || 120,
    totalBuyerNeeds: p.factoriesCount || 45,
    downloadUrl: '#',
    publishedDate: p.date
  };

  // 7. Gallery (Section 27)
  const defaultGallery = [
    { id: 'gal_1', url: p.image || '/images/smart_factory_hero.jpg', caption: 'Khu vực Bàn làm việc B2B 1:1 giữa Giám đốc Mua hàng FDI và Nhà cung ứng', verified: true },
    { id: 'gal_2', url: '/images/supplier_b2b_hero.jpg', caption: 'Trình diễn năng lực kỹ thuật và mẫu phôi cơ khí CNC chính xác', verified: true },
    { id: 'gal_3', url: '/images/b2b_sourcing_demand_hero.jpg', caption: 'Trao đổi bản vẽ kỹ thuật, tiêu chuẩn phụ trợ và kế hoạch kiểm toán xưởng', verified: true },
    { id: 'gal_4', url: '/images/supply_chain_expo_hero.jpg', caption: 'Lễ ký kết Biên bản ghi nhớ (MOU) kết nối cung ứng dài hạn', verified: true }
  ];

  // 8. Meeting Workflow & Hard Rule Notice (Section 9 & 16)
  const defaultMeetingWorkflow = {
    policyDisclaimer: 'Đề nghị cuộc gặp được xem xét dựa trên mức độ phù hợp giữa Nhu cầu Mua hàng (Buyer Requirement) và Năng lực Cung ứng (Supplier Capability). Việc thanh toán phí tham gia KHÔNG tự động bảo đảm lịch gặp với Người mua.',
    timePerMeeting: '25 phút / phiên gặp riêng',
    confirmationDeadline: 'Trước ngày diễn ra chương trình 48 giờ',
    rules: [
      'Nhà cung ứng cần nộp trước hồ sơ năng lực và đề xuất kỹ thuật ngắn gọn',
      'Buyer xem xét hồ sơ và phê duyệt đề nghị gặp gỡ',
      'Điều phối viên hệ thống CHUOICUNGUNG.COM sắp xếp khung giờ và bàn làm việc riêng',
      'Lịch gặp được thông báo trực tiếp qua SMS, Email và Workspace cá nhân'
    ]
  };

  return {
    ...p,
    agenda: (p.agenda && p.agenda.length > 0) ? p.agenda : defaultAgenda,
    audienceDetails: p.audienceDetails || defaultAudienceDetails,
    supportContact: p.supportContact || defaultSupportContact,
    policies: p.policies || defaultPolicies,
    sponsors: (p.sponsors && p.sponsors.length > 0) ? p.sponsors : defaultSponsors,
    catalogue: p.catalogue || defaultCatalogue,
    gallery: (p.gallery && p.gallery.length > 0) ? p.gallery : defaultGallery,
    meetingWorkflow: p.meetingWorkflow || defaultMeetingWorkflow
  };
}

/**
 * Lấy danh sách toàn bộ programs (gộp SEED + custom updates trong localStorage)
 */
export function getAllPrograms() {
  let programs = [...SEED_PROGRAMS];
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      if (stored) {
        const custom = JSON.parse(stored);
        const map = new Map(programs.map(p => [p.id, p]));
        custom.forEach(c => map.set(c.id, { ...map.get(c.id), ...c }));
        programs = Array.from(map.values());
      }
    }
  } catch (err) {
    console.warn('Lỗi đọc chương trình:', err);
  }
  return programs.map(enrichProgramData);
}

/**
 * Tìm program theo id hoặc slug hoặc alias
 */
export function getProgramByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const programs = getAllPrograms();
  const found = programs.find(p => 
    p.id === idOrSlug || 
    p.slug === idOrSlug || 
    p.publicCode === idOrSlug || 
    (p.aliasIds && p.aliasIds.includes(idOrSlug))
  );
  return found ? enrichProgramData(found) : null;
}

/**
 * LẤY DANH SÁCH NHU CẦU MUA CÔNG KHAI (BUYER NEEDS - SECTION 7 & 37)
 * Tuân thủ quy tắc bảo mật: KHÔNG lộ tên công ty kín, contact cá nhân, target price, budget nội bộ.
 */
export function getProgramPublicBuyerNeeds(program) {
  if (!program) return [];

  const publicNeeds = [];

  // 1. Lấy từ relations.requirementIds nếu có
  if (program.relations && program.relations.requirementIds && program.relations.requirementIds.length > 0) {
    program.relations.requirementIds.forEach(reqId => {
      // Tìm trong SEED_REQUIREMENTS
      try {
        // Tái sử dụng nhu cầu từ requirementsData nếu có
        publicNeeds.push({
          id: reqId,
          publicCode: reqId,
          title: `Nhu cầu cung ứng linh kiện & vật tư phục vụ ${program.industry || 'nhà máy'}`,
          category: program.industry || 'Cơ khí & Phụ trợ',
          location: program.provinceName || program.location,
          industrialPark: program.kcn || 'KCN Khu vực',
          deadline: 'Trước ngày đóng đăng ký',
          publicSummary: `Nhu cầu kết nối trực tiếp tại ${program.shortName || program.title}. Yêu cầu nhà cung cấp có xưởng sản xuất và chứng nhận chất lượng ISO.`,
          publicRequirements: [
            'Hồ sơ năng lực sản xuất xưởng trực tiếp',
            'Đạt chứng nhận hệ thống quản lý ISO 9001 hoặc tương đương',
            'Sẵn sàng cung cấp mẫu đối chứng và bản vẽ kiểm tra'
          ],
          buyerSummary: 'Nhà máy FDI trong cụm KCN',
          quantity: 'Theo nhu cầu dự án'
        });
      } catch (err) {
        // safe ignore
      }
    });
  }

  // 2. Bổ sung từ danh sách needToBuy của chương trình
  if (program.needToBuy && program.needToBuy.length > 0) {
    program.needToBuy.forEach((item, idx) => {
      publicNeeds.push({
        id: `NEED-${program.publicCode || 'PRG'}-${idx + 1}`,
        publicCode: `NEED-${program.publicCode || 'PRG'}-${idx + 1}`,
        title: item.item,
        category: program.industry || 'Công nghiệp phụ trợ',
        location: program.provinceName || program.location,
        industrialPark: program.kcn || 'KCN Khu vực',
        deadline: program.date ? `Trước ${program.date}` : 'Theo lịch sự kiện',
        publicSummary: `Nhu cầu chào hàng & báo giá: "${item.item}". Số lượng / Quy mô dự kiến: ${item.qty}.`,
        publicRequirements: [
          'Đạt tiêu chuẩn kỹ thuật nhà máy yêu cầu',
          'Khả năng giao hàng đúng tiến độ tại KCN',
          'Sẵn sàng gửi mẫu và tiếp đón đoàn đánh giá xưởng'
        ],
        buyerSummary: item.buyer || 'Nhà máy FDI / Tập đoàn công nghiệp',
        quantity: item.qty
      });
    });
  }

  return publicNeeds;
}

/**
 * LẤY DANH SÁCH NHÀ CUNG ỨNG TRƯNG BÀY (SUPPLIER SHOWCASE - SECTION 19)
 */
export function getProgramShowcaseSuppliers(program) {
  if (!program) return [];
  const suppliers = [];

  if (program.needToSell && program.needToSell.length > 0) {
    program.needToSell.forEach((item, idx) => {
      suppliers.push({
        id: `SUP-${program.publicCode || 'PRG'}-${idx + 1}`,
        name: item.supplier,
        productsServices: [item.item],
        capabilities: ['Sản xuất trực tiếp', 'Đạt chuẩn ISO', 'Cung ứng KCN'],
        province: program.provinceName || 'Toàn quốc',
        isKycVerified: true,
        logo: '/images/founding-partners/chuyen-gia-dong-phuc-logo.png'
      });
    });
  }

  return suppliers;
}

/**
 * THEO DÕI SỰ KIỆN ANALYTICS CHO TRANG CHI TIẾT (SECTION 41)
 */
export function trackProgramAnalytics(eventName, payload = {}) {
  const event = {
    id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventName,
    payload,
    timestamp: new Date().toISOString()
  };
  try {
    if (typeof localStorage !== 'undefined') {
      const events = JSON.parse(localStorage.getItem('ccu_analytics_events') || '[]');
      events.unshift(event);
      localStorage.setItem('ccu_analytics_events', JSON.stringify(events.slice(0, 100)));
    }
  } catch (err) {
    // safe ignore
  }
  return event;
}

/**
 * Quy tắc hiển thị mức phí theo Section 11 & 12 (Hard Rule: Không ghi Miễn Phí nếu chỉ đúng một role)
 */
export function calculateFeeDisplay(program, targetRole = 'ALL') {
  if (!program) return 'Xem chi tiết';

  // Nếu chương trình đã đánh dấu là 'free' 100% cho mọi đối tượng
  if (program.pricingType === 'free') {
    return 'Miễn phí';
  }

  // Nếu có danh sách options cụ thể
  if (program.participationOptions && program.participationOptions.length > 0) {
    if (targetRole && targetRole !== 'ALL' && targetRole !== 'all') {
      const roleUpper = targetRole.toUpperCase();
      const roleOpts = program.participationOptions.filter(o => o.role === roleUpper || o.role === 'ALL');
      if (roleOpts.length > 0) {
        const allFree = roleOpts.every(o => o.feeType === 'FREE');
        if (allFree) return 'Miễn phí (dành cho vai trò của bạn)';
        const minFixed = roleOpts.find(o => o.feeType === 'FIXED');
        if (minFixed) return `Từ ${minFixed.amount?.toLocaleString('vi-VN')} đ`;
      }
    }

    // Nếu không chọn role cụ thể: Kiểm tra xem mọi option có cùng miễn phí không
    const isTotallyFree = program.participationOptions.every(o => o.feeType === 'FREE');
    if (isTotallyFree) {
      return 'Miễn phí';
    }

    // Nếu Buyer miễn phí nhưng Supplier có phí -> TUYỆT ĐỐI KHÔNG GHI "MIỄN PHÍ"
    return 'Xem phí theo hình thức';
  }

  return program.pricingSummary || 'Xem phí theo hình thức';
}

/**
 * ĐĂNG KÝ QUAN TÂM (SECTION 14: ĐĂNG KÝ QUAN TÂM ≠ ĐĂNG KÝ THAM GIA)
 * Không tạo ProgramRegistration, không giữ chỗ, không tạo attendance hay payment
 */
export function registerProgramInterest({
  programId,
  programTitle,
  name,
  company,
  email,
  phone,
  role = 'SUPPLIER',
  categoryId,
  provinceId,
  needs = '',
  consent = true
}) {
  if (!consent) {
    throw new Error('Vui lòng đồng ý với điều khoản nhận thông tin từ Ban tổ chức.');
  }

  const interestRecord = {
    id: `INT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: 'PROGRAM_INTEREST',
    programId,
    programTitle,
    name,
    company,
    email,
    phone,
    role: role.toUpperCase(),
    categoryId: categoryId || null,
    provinceId: provinceId || null,
    needs,
    consent: true,
    disclaimer: 'Đăng ký quan tâm KHÔNG phải đăng ký tham gia chính thức, KHÔNG giữ chỗ, KHÔNG phát sinh chi phí.',
    createdAt: new Date().toISOString()
  };

  try {
    if (typeof localStorage !== 'undefined') {
      // 1. Lưu vào ccu_program_interests
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRAM_INTERESTS) || '[]');
      existing.unshift(interestRecord);
      localStorage.setItem(STORAGE_KEYS.PROGRAM_INTERESTS, JSON.stringify(existing));

      // 2. Đồng bộ sang ccu_lead_consents cho CRM
      const leadConsents = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAD_CONSENTS) || '[]');
      leadConsents.unshift({
        id: `lead_${Date.now()}`,
        type: 'program_interest',
        programId,
        programTitle,
        name,
        company,
        email,
        phone,
        role,
        needs,
        consentAccepted: true,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.LEAD_CONSENTS, JSON.stringify(leadConsents));
    }
  } catch (err) {
    console.warn('Lỗi ghi nhận đăng ký quan tâm:', err);
  }

  return { success: true, record: interestRecord };
}

/**
 * ĐĂNG KÝ NHẬN THÔNG TIN CHƯƠNG TRÌNH PHÙ HỢP (SECTION 15)
 * Dành cho trường hợp chưa tìm thấy chương trình phù hợp
 */
export function registerProgramNotificationConsent({
  name,
  company,
  email,
  phone,
  role = 'SUPPLIER',
  category = 'Tất cả ngành hàng',
  zone = 'Miền Nam',
  province = '',
  consent = true
}) {
  if (!consent) {
    throw new Error('Vui lòng đồng ý nhận thông báo chương trình phù hợp.');
  }

  const consentRecord = {
    id: `CNS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: 'PROGRAM_MATCH_SUBSCRIPTION',
    name,
    company,
    email,
    phone,
    role: role.toUpperCase(),
    category,
    zone,
    province,
    consentAccepted: true,
    createdAt: new Date().toISOString()
  };

  try {
    if (typeof localStorage !== 'undefined') {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_NOTIFICATIONS) || '[]');
      list.unshift(consentRecord);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_NOTIFICATIONS, JSON.stringify(list));

      const leadConsents = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAD_CONSENTS) || '[]');
      leadConsents.unshift({
        id: `lead_sub_${Date.now()}`,
        type: 'program_match_subscription',
        name,
        company,
        email,
        phone,
        role,
        zone,
        industry: category,
        consentAccepted: true,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.LEAD_CONSENTS, JSON.stringify(leadConsents));
    }
  } catch (err) {
    console.warn('Lỗi lưu đăng ký thông báo chương trình:', err);
  }

  return { success: true, record: consentRecord };
}

// In-memory fallback for Node.js testing environment
export let inMemoryAuditLogs = [];
let inMemoryPrograms = null;

/**
 * CẬP NHẬT PROGRAM TỪ ADMIN (KÈM AUDIT LOG MUTATION - SECTION 30)
 */
export function updateProgramAdmin(programId, updates, actorUserId = 'admin_super') {
  const programs = getAllPrograms();
  const index = programs.findIndex(p => p.id === programId || p.publicCode === programId);
  if (index === -1) {
    throw new Error(`Không tìm thấy chương trình: ${programId}`);
  }

  const before = { ...programs[index] };
  const after = { ...programs[index], ...updates, updatedAt: new Date().toISOString() };
  programs[index] = after;

  const logEntry = {
    id: `LOG-PRG-${Date.now()}`,
    actorUserId,
    action: 'UPDATE_PROGRAM',
    entityType: 'PROGRAM',
    entityId: programId,
    before: { status: before.status, ownerUserId: before.ownerUserId, nextAction: before.nextAction },
    after: { status: after.status, ownerUserId: after.ownerUserId, nextAction: after.nextAction },
    timestamp: new Date().toISOString()
  };

  inMemoryAuditLogs.unshift(logEntry);

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));

      // Ghi Audit Log theo chuẩn Section 30
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
      logs.unshift(logEntry);
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    }
  } catch (err) {
    console.warn('Lỗi lưu audit log chương trình:', err);
  }

  return { success: true, program: after };
}

/**
 * Lấy lịch sử Audit Log của Program
 */
export function getAllProgramAuditLogs() {
  try {
    if (typeof localStorage !== 'undefined') {
      const logs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return logs ? JSON.parse(logs) : inMemoryAuditLogs;
    }
  } catch (err) {
    return inMemoryAuditLogs;
  }
  return inMemoryAuditLogs;
}

// ----------------------------------------------------------------------------
// 6. PAGE 22: REGISTRATION FORM ENGINE SERVICES & MODELS (SECTIONS 1-54)
// ----------------------------------------------------------------------------

export const SEED_REGISTRATIONS = [
  {
    id: 'REG-2026-00101',
    registrationCode: 'DK-2026-00101',
    programId: 'vsip-binh-duong',
    programPublicCode: 'PRG-2026-001',
    programTitle: 'Ngày Hội Kết Nối Giao Thương Chuỗi Cung Ứng KCN VSIP 1 & 2',
    role: TARGET_ROLES_ENUM.BUYER,
    participationOptionId: 'opt_vsip_buyer',
    participationOptionTitle: 'Bàn tiếp đón Trưởng phòng Purchasing (FDI/Nhà máy)',
    feeType: 'FREE',
    feeAmount: 0,
    currency: 'VND',
    companyName: 'Công ty TNHH Điện Tử MicroTech VSIP',
    organizationId: 'ORG-MICROTECH-01',
    contactPerson: 'Trần Đại Nghĩa',
    title: 'Trưởng phòng Thu Mua (Procurement Manager)',
    email: 'nghia.tran@microtech-vsip.com',
    phone: '0912 345 678',
    attendeesCount: 2,
    attendees: [
      { name: 'Trần Đại Nghĩa', title: 'Trưởng phòng Thu Mua', phone: '0912 345 678' },
      { name: 'Nguyễn Văn Long', title: 'Kỹ sư Đánh giá Nhà cung cấp', phone: '0912 345 679' }
    ],
    roleData: {
      needCategory: 'Phòng sạch & Cơ điện MEP',
      needTitle: 'Thi công phòng sạch Class 1000 & Sàn Epoxy chống tĩnh điện ESD 6.500m²',
      serviceArea: 'KCN VSIP 1, Bình Dương',
      timeline: 'Trong Quý 4/2026',
      sampleRequired: true,
      surveyRequired: true,
      sharingScope: 'MATCHED_SUPPLIERS_ONLY'
    },
    registrationStatus: REGISTRATION_STATUSES_ENUM.APPROVED,
    paymentStatus: PAYMENT_STATUSES_ENUM.NOT_REQUIRED,
    attendanceStatus: ATTENDANCE_STATUSES_ENUM.EXPECTED,
    qrToken: 'QR-DK-2026-00101-SECURE-TOKEN-ABCD',
    qrIssuedAt: '2026-09-26T10:00:00+07:00',
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân',
    submittedAt: '2026-09-25T09:30:00+07:00',
    reviewedAt: '2026-09-26T10:00:00+07:00',
    reviewedBy: 'usr_coord_nam',
    reviewNotes: 'Hồ sơ FDI hợp lệ, nhu cầu thực tế đã thẩm định.',
    consents: {
      dataProcessing: true,
      programSharing: true,
      marketing: false
    }
  },
  {
    id: 'REG-2026-00102',
    registrationCode: 'DK-2026-00102',
    programId: 'vsip-binh-duong',
    programPublicCode: 'PRG-2026-001',
    programTitle: 'Ngày Hội Kết Nối Giao Thương Chuỗi Cung Ứng KCN VSIP 1 & 2',
    role: TARGET_ROLES_ENUM.SUPPLIER,
    participationOptionId: 'opt_vsip_supplier_direct',
    participationOptionTitle: 'Bàn làm việc B2B & Trưng bày mẫu trực tiếp',
    feeType: 'FIXED',
    feeAmount: 6500000,
    currency: 'VND',
    companyName: 'Công ty Cổ phần Cơ Khí Chính Xác VinaFastener',
    organizationId: 'ORG-VINAFASTENER-02',
    contactPerson: 'Phạm Hồng Thái',
    title: 'Giám đốc Kinh doanh B2B',
    email: 'thai.pham@vinafastener.vn',
    phone: '0908 123 456',
    attendeesCount: 2,
    attendees: [
      { name: 'Phạm Hồng Thái', title: 'Giám đốc Kinh doanh B2B', phone: '0908 123 456' },
      { name: 'Hoàng Lan', title: 'Kỹ sư Bán hàng Kỹ thuật', phone: '0908 123 457' }
    ],
    roleData: {
      category: 'Cơ khí chính xác & Bán dẫn',
      capabilities: ['Gia công CNC 5 trục', 'Bu lông ốc vít Inox 304/316 tiêu chuẩn DIN', 'Xử lý bề mặt Anode'],
      productsServices: ['Bu lông cấp bền 8.8 - 12.9', 'Đồ gá kiểm tra Jig bản mạch'],
      serviceArea: 'Toàn quốc & xuất khẩu',
      samplesToDisplay: '01 hộp mẫu bulong Inox vi sinh và 02 đồ gá phôi nhôm mạ crom',
      meetingRequest: 'Muốn đề nghị gặp Trưởng phòng Mua hàng S-Semicon và Hanwha Vina'
    },
    registrationStatus: REGISTRATION_STATUSES_ENUM.UNDER_REVIEW,
    paymentStatus: PAYMENT_STATUSES_ENUM.NOT_STARTED,
    attendanceStatus: ATTENDANCE_STATUSES_ENUM.EXPECTED,
    qrToken: null,
    ownerUserId: 'usr_coord_nam',
    ownerName: 'Lê Minh Quân',
    submittedAt: '2026-09-27T14:15:00+07:00',
    consents: {
      dataProcessing: true,
      programSharing: true,
      marketing: true
    }
  },
  {
    id: 'REG-2026-00103',
    registrationCode: 'DK-2026-00103',
    programId: 'trang-due-deep-c',
    programPublicCode: 'PRG-2026-002',
    programTitle: 'Ngày Hội Chuỗi Cung Ứng KCN Tràng Duệ & DEEP C Hải Phòng',
    role: TARGET_ROLES_ENUM.SUPPLIER,
    participationOptionId: 'opt_deepc_supplier_booth',
    participationOptionTitle: 'Gian làm việc B2B tiêu chuẩn',
    feeType: 'FIXED',
    feeAmount: 5800000,
    currency: 'VND',
    companyName: 'Công ty TNHH Tiếp Vận Cảng Biển PortLink Hải Phòng',
    organizationId: 'ORG-PORTLINK-03',
    contactPerson: 'Vũ Đức Thịnh',
    title: 'Phó Giám đốc Vận hành Logistics',
    email: 'thinh.vu@portlink.com.vn',
    phone: '0983 222 333',
    attendeesCount: 1,
    roleData: {
      category: 'Logistics, Cảng biển & Kho bãi',
      capabilities: ['Vận tải container lạnh', 'Khai báo hải quan điện tử', 'Cho thuê kho CFS cảng'],
      productsServices: ['Dịch vụ Forwarding quốc tế', 'Kho bãi container rỗng DEEP C'],
      serviceArea: 'Hải Phòng, Quảng Ninh, Hà Nội',
      meetingRequest: 'Đề nghị kết nối các nhà máy sản xuất linh kiện ô tô tại KCN DEEP C'
    },
    registrationStatus: REGISTRATION_STATUSES_ENUM.APPROVED,
    paymentStatus: PAYMENT_STATUSES_ENUM.PAID,
    attendanceStatus: ATTENDANCE_STATUSES_ENUM.EXPECTED,
    qrToken: 'QR-DK-2026-00103-SECURE-TOKEN-XYZW',
    qrIssuedAt: '2026-09-28T08:30:00+07:00',
    ownerUserId: 'usr_coord_bac',
    ownerName: 'Hoàng Văn Thắng',
    submittedAt: '2026-09-26T11:00:00+07:00',
    reviewedAt: '2026-09-27T09:00:00+07:00',
    reviewedBy: 'usr_coord_bac',
    paymentConfirmedAt: '2026-09-28T08:00:00+07:00',
    consents: {
      dataProcessing: true,
      programSharing: true,
      marketing: false
    }
  }
];

let inMemoryRegistrations = [...SEED_REGISTRATIONS];

/**
 * LẤY TOÀN BỘ ĐĂNG KÝ CHƯƠNG TRÌNH
 */
export function getAllProgramRegistrations() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRAM_REGISTRATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.PROGRAM_REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
      return SEED_REGISTRATIONS;
    }
  } catch (err) {
    return inMemoryRegistrations;
  }
  return inMemoryRegistrations;
}

/**
 * LẤY ĐĂNG KÝ THEO PROGRAM ID
 */
export function getProgramRegistrationsByProgram(programId) {
  const all = getAllProgramRegistrations();
  return all.filter(r => r.programId === programId || r.programPublicCode === programId);
}

/**
 * TÌM ĐĂNG KÝ THEO MÃ CODE HOẶC ID
 */
export function getRegistrationByCode(code) {
  if (!code) return null;
  const all = getAllProgramRegistrations();
  return all.find(r => r.registrationCode === code || r.id === code) || null;
}

let inMemoryDrafts = {};

/**
 * KIỂM TRA TRÙNG LẶP ĐĂNG KÝ (SECTION 33)
 */
export function checkProgramRegistrationDuplicate(programId, companyNameOrOrgId, role) {
  if (!programId || !companyNameOrOrgId) return { isDuplicate: false, existingRegistration: null };
  const all = getAllProgramRegistrations();
  const searchKey = companyNameOrOrgId.trim().toLowerCase();

  const found = all.find(r => 
    r.programId === programId &&
    (
      (r.companyName && r.companyName.trim().toLowerCase() === searchKey) ||
      (r.organizationId && r.organizationId.trim().toLowerCase() === searchKey)
    ) &&
    r.role === role &&
    r.registrationStatus !== REGISTRATION_STATUSES_ENUM.CANCELLED &&
    r.registrationStatus !== REGISTRATION_STATUSES_ENUM.WITHDRAWN &&
    r.registrationStatus !== REGISTRATION_STATUSES_ENUM.REJECTED
  );

  if (found) {
    return {
      ...found,
      isDuplicate: true,
      existingRegistration: found
    };
  }

  return {
    isDuplicate: false,
    existingRegistration: null
  };
}

/**
 * LƯU BẢN NHÁP FORM ĐĂNG KÝ (AUTOSAVE DRAFT - SECTION 34)
 */
export function saveProgramRegistrationDraft(slug, draftData) {
  if (!slug || !draftData) return;
  const draftObj = {
    ...draftData,
    savedAt: new Date().toISOString()
  };
  inMemoryDrafts[slug] = draftObj;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`ccu_reg_draft_${slug}`, JSON.stringify(draftObj));
    }
  } catch (err) {
    // safe ignore
  }
}

/**
 * LẤY BẢN NHÁP ĐÃ LƯU
 */
export function getProgramRegistrationDraft(slug) {
  if (!slug) return null;
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(`ccu_reg_draft_${slug}`);
      if (stored) return JSON.parse(stored);
    }
  } catch (err) {
    // fallback to in-memory
  }
  return inMemoryDrafts[slug] || null;
}

/**
 * XÓA BẢN NHÁP SAU KHI SUBMIT THÀNH CÔNG
 */
export function clearProgramRegistrationDraft(slug) {
  if (!slug) return;
  delete inMemoryDrafts[slug];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`ccu_reg_draft_${slug}`);
    }
  } catch (err) {
    // safe ignore
  }
}

/**
 * NỘP HỒ SƠ ĐĂNG KÝ CHƯƠNG TRÌNH (SERVER FLOW - SECTION 22 & 23)
 */
export function submitProgramRegistration(formData) {
  const {
    programId,
    role = TARGET_ROLES_ENUM.SUPPLIER,
    participationOptionId,
    companyName,
    organizationId,
    contactPerson,
    title,
    email,
    phone,
    attendeesCount = 1,
    attendees = [],
    roleData = {},
    consents = {}
  } = formData;

  // 1. Validate Program
  const program = getProgramByIdOrSlug(programId);
  if (!program) {
    throw new Error('Chương trình không tồn tại hoặc đã bị hủy.');
  }

  // 2. Validate Program Window
  if (program.status === 'huy' || program.programStatus === PROGRAM_STATUSES_ENUM.CANCELLED) {
    throw new Error('Chương trình đã hủy, không thể tiếp nhận đăng ký mới.');
  }

  // 3. Validate Role & Contact
  if (!companyName || !companyName.trim()) {
    throw new Error('Vui lòng nhập tên doanh nghiệp / đơn vị.');
  }
  if (!contactPerson || !contactPerson.trim()) {
    throw new Error('Vui lòng nhập họ tên người liên hệ phụ trách.');
  }
  if (!email || !email.includes('@')) {
    throw new Error('Vui lòng nhập địa chỉ email hợp lệ để nhận thông báo.');
  }
  if (!phone || phone.trim().length < 8) {
    throw new Error('Vui lòng nhập số điện thoại liên hệ hợp lệ.');
  }
  if (!consents.dataProcessing) {
    throw new Error('Vui lòng đồng ý với điều khoản xử lý thông tin để tiếp tục.');
  }

  // 4. Duplicate Check (Section 33)
  const existing = checkProgramRegistrationDuplicate(program.id, companyName, role);
  if (existing && existing.isDuplicate) {
    const err = new Error(`Doanh nghiệp "${companyName}" đã có đăng ký tham gia chương trình này (Mã: ${existing.registrationCode}).`);
    err.code = 'DUPLICATE_REGISTRATION';
    err.existingRegistration = existing.existingRegistration || existing;
    throw err;
  }

  // 5. Participation Option Resolution
  const selectedOption = program.participationOptions?.find(o => o.id === participationOptionId) || program.participationOptions?.[0] || {
    id: 'opt_default',
    title: 'Đăng ký tiêu chuẩn',
    feeType: 'FREE',
    amount: 0,
    currency: 'VND'
  };

  const isFree = selectedOption.feeType === 'FREE' || selectedOption.amount === 0;

  // 6. Generate Public Registration Code (Section 23)
  const allRegistrations = getAllProgramRegistrations();
  const regSeq = allRegistrations.length + 101;
  const registrationCode = `DK-2026-${String(regSeq).padStart(5, '0')}`;
  const regId = `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Merge role specific data
  const resolvedRoleData = {
    ...(role === TARGET_ROLES_ENUM.BUYER ? (formData.buyerData || {}) :
       role === TARGET_ROLES_ENUM.SPONSOR ? (formData.sponsorData || {}) :
       (formData.supplierData || {})),
    ...(roleData || {})
  };

  // 7. Initialize Three Separate Statuses (Section 24, 25, 26, 27)
  const newRegistration = {
    id: regId,
    registrationCode,
    programId: program.id,
    programPublicCode: program.publicCode || 'PRG-2026',
    programTitle: program.title,
    role,
    participationOptionId: selectedOption.id,
    participationOptionTitle: selectedOption.title,
    feeType: selectedOption.feeType,
    feeAmount: selectedOption.amount || 0,
    currency: selectedOption.currency || 'VND',
    companyName: companyName.trim(),
    organizationId: organizationId || null,
    contactPerson: contactPerson.trim(),
    title: title ? title.trim() : 'Đại diện doanh nghiệp',
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    attendeesCount: Number(attendeesCount) || 1,
    attendees: attendees.length > 0 ? attendees : [{ name: contactPerson, title: title || '', phone }],
    roleData: {
      ...resolvedRoleData,
      isSponsorInquiry: role === TARGET_ROLES_ENUM.SPONSOR, // Section 16 & 17
      meetingRequestRecorded: !!resolvedRoleData.meetingRequest // Section 14 & 15
    },
    // BA TRẠNG THÁI TÁCH BIỆT HOÀN TOÀN:
    registrationStatus: REGISTRATION_STATUSES_ENUM.SUBMITTED,
    paymentStatus: isFree ? PAYMENT_STATUSES_ENUM.NOT_REQUIRED : PAYMENT_STATUSES_ENUM.NOT_STARTED,
    attendanceStatus: ATTENDANCE_STATUSES_ENUM.EXPECTED,
    qrToken: null, // Chỉ cấp sau khi Approved và Paid (nếu có phí)
    ownerUserId: program.ownerUserId || 'usr_coord_nam',
    ownerName: program.ownerName || 'Ban Điều phối B2B',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    reviewNotes: '',
    consents: {
      dataProcessing: !!consents.dataProcessing,
      programSharing: !!consents.programSharing,
      marketing: !!consents.marketing
    }
  };

  // 8. Lưu vào state & localStorage
  inMemoryRegistrations.unshift(newRegistration);

  try {
    if (typeof localStorage !== 'undefined') {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRAM_REGISTRATIONS) || '[]');
      list.unshift(newRegistration);
      localStorage.setItem(STORAGE_KEYS.PROGRAM_REGISTRATIONS, JSON.stringify(list));

      // Clear draft sau khi submit thành công
      clearProgramRegistrationDraft(program.slug || program.id);

      // Ghi Lead Consent nếu có
      if (consents.marketing) {
        const leadConsents = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAD_CONSENTS) || '[]');
        leadConsents.unshift({
          id: `lead_reg_${Date.now()}`,
          type: 'program_registration_lead',
          name: contactPerson,
          company: companyName,
          email,
          phone,
          role,
          programId: program.id,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.LEAD_CONSENTS, JSON.stringify(leadConsents));
      }
    }
  } catch (err) {
    console.warn('Lỗi lưu đăng ký chương trình:', err);
  }

  // 9. Ghi Audit Log (Section 31 & 35)
  const auditLog = {
    id: `LOG-REG-${Date.now()}`,
    actorUserId: 'guest_or_user',
    action: 'CREATE_REGISTRATION',
    entityType: 'PROGRAM_REGISTRATION',
    entityId: newRegistration.id,
    registrationCode,
    programId: program.id,
    role,
    timestamp: new Date().toISOString()
  };
  inMemoryAuditLogs.unshift(auditLog);

  // 10. Track Analytics (Section 53)
  trackProgramAnalytics('registration_submit', {
    programId: program.id,
    registrationCode,
    role,
    feeAmount: newRegistration.feeAmount
  });

  return {
    success: true,
    registration: newRegistration,
    registrationCode
  };
}

/**
 * ADMIN REVIEW & DUYỆT ĐĂNG KÝ (SECTION 39 & 40)
 */
export function updateRegistrationStatusAdmin(regId, newStatus, { reason = null, notes = '', adminUserId = 'admin_super' } = {}) {
  const all = getAllProgramRegistrations();
  const index = all.findIndex(r => r.id === regId || r.registrationCode === regId);
  if (index === -1) {
    throw new Error(`Không tìm thấy đăng ký có mã: ${regId}`);
  }

  const before = { ...all[index] };
  const after = { ...all[index] };

  after.registrationStatus = newStatus;
  after.reviewedAt = new Date().toISOString();
  after.reviewedBy = adminUserId;
  after.reviewNotes = notes || after.reviewNotes;

  // Xử lý logic nghiệp vụ theo từng trạng thái:
  if (newStatus === REGISTRATION_STATUSES_ENUM.APPROVED) {
    // Nếu miễn phí -> cấp ngay mã QR check-in
    if (after.paymentStatus === PAYMENT_STATUSES_ENUM.NOT_REQUIRED) {
      after.qrToken = `QR-${after.registrationCode}-VALID-${Date.now().toString(36).toUpperCase()}`;
      after.qrIssuedAt = new Date().toISOString();
    } else if (after.paymentStatus === PAYMENT_STATUSES_ENUM.NOT_STARTED) {
      // Nếu có phí -> chuyển trạng thái thanh toán sang PENDING
      after.paymentStatus = PAYMENT_STATUSES_ENUM.PENDING;
    }
  } else if (newStatus === REGISTRATION_STATUSES_ENUM.REJECTED) {
    // Section 40: Bắt buộc lý do từ chối
    after.rejectionReason = reason || REJECTION_REASONS_ENUM.NOT_ELIGIBLE;
    after.attendanceStatus = ATTENDANCE_STATUSES_ENUM.CANCELLED;
    after.qrToken = null;
  } else if (newStatus === REGISTRATION_STATUSES_ENUM.CANCELLED) {
    after.attendanceStatus = ATTENDANCE_STATUSES_ENUM.CANCELLED;
    after.qrToken = null;
  }

  all[index] = after;
  inMemoryRegistrations = all;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROGRAM_REGISTRATIONS, JSON.stringify(all));
    }
  } catch (err) {
    console.warn('Lỗi cập nhật registration status:', err);
  }

  // Ghi Audit Log
  const logEntry = {
    id: `LOG-REG-STATUS-${Date.now()}`,
    actorUserId: adminUserId,
    action: 'UPDATE_REGISTRATION_STATUS',
    entityType: 'PROGRAM_REGISTRATION',
    entityId: after.id,
    registrationCode: after.registrationCode,
    before: { registrationStatus: before.registrationStatus, paymentStatus: before.paymentStatus },
    after: { registrationStatus: after.registrationStatus, paymentStatus: after.paymentStatus },
    reason,
    timestamp: new Date().toISOString()
  };
  inMemoryAuditLogs.unshift(logEntry);

  return { success: true, registration: after };
}

/**
 * ADMIN XÁC NHẬN THANH TOÁN (SECTION 28 & 42)
 */
export function confirmRegistrationPaymentAdmin(regId, { amount, transactionRef = '', adminUserId = 'admin_finance' } = {}) {
  const all = getAllProgramRegistrations();
  const index = all.findIndex(r => r.id === regId || r.registrationCode === regId);
  if (index === -1) {
    throw new Error(`Không tìm thấy đăng ký: ${regId}`);
  }

  const reg = all[index];
  reg.paymentStatus = PAYMENT_STATUSES_ENUM.PAID;
  reg.paymentConfirmedAt = new Date().toISOString();
  reg.paymentTransactionRef = transactionRef || `TXN-${Date.now()}`;

  // Nếu hồ sơ đã được duyệt -> Cấp mã QR tham dự (Section 29)
  if (reg.registrationStatus === REGISTRATION_STATUSES_ENUM.APPROVED) {
    reg.qrToken = `QR-${reg.registrationCode}-PAID-${Date.now().toString(36).toUpperCase()}`;
    reg.qrIssuedAt = new Date().toISOString();
  }

  all[index] = reg;
  inMemoryRegistrations = all;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROGRAM_REGISTRATIONS, JSON.stringify(all));
    }
  } catch (err) {
    console.warn('Lỗi xác nhận thanh toán:', err);
  }

  // Audit Log
  inMemoryAuditLogs.unshift({
    id: `LOG-REG-PAY-${Date.now()}`,
    actorUserId: adminUserId,
    action: 'CONFIRM_REGISTRATION_PAYMENT',
    entityType: 'PROGRAM_REGISTRATION',
    entityId: reg.id,
    registrationCode: reg.registrationCode,
    amount,
    transactionRef,
    timestamp: new Date().toISOString()
  });

  return { success: true, registration: reg };
}

