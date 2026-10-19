// ============================================================================
import { isCloudBrowser, getCloudRecords } from './cloudData.js';
import { persistSubmission, getPrivateSubmissions } from '../services/submissionService.js';
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

export const PROGRAM_MONTHS = [
  { id: 'all', name: 'Tất cả tháng' },
  { id: '1', name: 'Tháng 1' },
  { id: '2', name: 'Tháng 2' },
  { id: '3', name: 'Tháng 3' },
  { id: '4', name: 'Tháng 4' },
  { id: '5', name: 'Tháng 5' },
  { id: '6', name: 'Tháng 6' },
  { id: '7', name: 'Tháng 7' },
  { id: '8', name: 'Tháng 8' },
  { id: '9', name: 'Tháng 9' },
  { id: '10', name: 'Tháng 10' },
  { id: '11', name: 'Tháng 11' },
  { id: '12', name: 'Tháng 12' }
];

export const PROGRAM_YEARS = [
  { id: 'all', name: 'Tất cả năm' },
  { id: '2026', name: 'Năm 2026' },
  { id: '2027', name: 'Năm 2027' }
];

export function getProgramMonthAndYear(program) {
  if (!program) return { month: null, year: null };
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(program.date || '');
  if (match) {
    return {
      month: parseInt(match[2], 10),
      year: parseInt(match[3], 10)
    };
  }
  if (program.startAt) {
    const d = new Date(program.startAt);
    if (!isNaN(d.getTime())) {
      return {
        month: d.getMonth() + 1,
        year: d.getFullYear()
      };
    }
  }
  let year = null;
  let month = null;
  const yearMatch = /(202\d)/.exec((program.date || '') + ' ' + (program.publicCode || ''));
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }
  const qMatch = /Quý\s*([1-4])/i.exec(program.date || '');
  if (qMatch) {
    month = (parseInt(qMatch[1], 10) - 1) * 3 + 1;
  }
  return { month, year };
}


// ----------------------------------------------------------------------------
// 3. MASTER PROGRAMS SEED DATA (CHUẨN HÓA THEO MODEL SECTION 5 & 27)
// ----------------------------------------------------------------------------

export const SEED_PROGRAMS = websiteSeed('programsData.SEED_PROGRAMS');

export const PROGRAMS_DATA = isCloudBrowser() ? getCloudRecords('programs') : SEED_PROGRAMS;

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
    // Keep editorial workflow facts separate from legacy presentation defaults.
    // Never turn a placeholder gallery, timetable or sponsor into a published fact.
    workflowContent: p.workflowContent || {
      agenda: p.agenda || [],
      sponsorshipPackages: p.sponsorshipPackages || [],
      participatingAssociations: p.participatingAssociations || [],
      matchedPairs: p.matchedPairs || [],
      gallery: p.gallery || []
    },
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
  if (isCloudBrowser()) return getCloudRecords('programs').map(enrichProgramData);
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
export async function registerProgramInterest({
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
  if (isCloudBrowser()) return { success: true, record: await persistSubmission('programInterest', interestRecord) };

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
export async function registerProgramNotificationConsent({
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
  if (isCloudBrowser()) return { success: true, record: await persistSubmission('programNotification', consentRecord) };

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

export const SEED_REGISTRATIONS = websiteSeed('programsData.SEED_REGISTRATIONS');

let inMemoryRegistrations = [...SEED_REGISTRATIONS];

/**
 * LẤY TOÀN BỘ ĐĂNG KÝ CHƯƠNG TRÌNH
 */
export function getAllProgramRegistrations() {
  if (isCloudBrowser()) return getPrivateSubmissions('programRegistration');
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
export async function submitProgramRegistration(formData) {
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

  if (isCloudBrowser()) {
    const saved = await persistSubmission('programRegistration', newRegistration);
    clearProgramRegistrationDraft(program.slug || program.id);
    return { success: true, registration: { ...saved, registrationStatus: 'SUBMITTED', paymentStatus: 'NOT_STARTED', attendanceStatus: 'NOT_ELIGIBLE', qrToken: null }, message: 'Hồ sơ đã lưu và đang chờ thẩm định.' };
  }
  // 8. Node-only fixtures for isolated tests.
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
import { websiteSeed } from './websiteSeeds.js';
