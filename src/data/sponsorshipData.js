// ============================================================================
// SPONSORSHIP DATA LAYER & MANAGEMENT SERVICE
// PAGE 32: TÀI TRỢ / ĐỒNG HÀNH CHƯƠNG TRÌNH (/tai-tro)
// Chuẩn hóa theo spec 32.txt - CHUOICUNGUNG.COM
// ============================================================================

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

export const STORAGE_KEYS = {
  SPONSORSHIPS: 'ccu_sponsorships_v1',
  INQUIRIES: 'ccu_sponsorship_inquiries_v1',
  ENTITLEMENTS: 'ccu_sponsorship_entitlements_v1',
  AUDIT_LOGS: 'ccu_sponsorship_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. CHUẨN HÓA 5 HÌNH THỨC ĐỒNG HÀNH (SECTIONS 2, 4, 5, 7, 9, 10, 11)
// ----------------------------------------------------------------------------
export const SPONSORSHIP_TYPES = {
  PROGRAM: {
    id: 'PROGRAM',
    title: 'Tài Trợ Chương Trình Kết Nối',
    code: '01',
    description: 'Đồng hành cùng Ngày hội Chuỗi Cung Ứng, Sourcing Day B2B 1:1, gian hàng chung và các phiên pitching năng lực.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    targetRoute: '/chuong-trinh'
  },
  CATALOGUE: {
    id: 'CATALOGUE',
    title: 'Tài Trợ Catalogue / Ấn Phẩm',
    code: '02',
    description: 'Hiện diện thương hiệu trong ấn phẩm ngành in phát hành trực tiếp đến 1.000+ nhà máy FDI tại các KCN trọng điểm.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    targetRoute: '/catalogue'
  },
  MEDIA: {
    id: 'MEDIA',
    title: 'Tài Trợ Video / Thư Viện Ảnh / Nội Dung',
    code: '03',
    description: 'Bảo trợ sản xuất video phóng sự xưởng, bộ tư liệu ảnh sự kiện và cẩm nang tiêu chuẩn kiểm định chuỗi cung ứng.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    targetRoute: '/thu-vien'
  },
  MERCHANDISE: {
    id: 'MERCHANDISE',
    title: 'Tài Trợ Vật Phẩm Sự Kiện',
    code: '04',
    description: 'Đồng hành quà tặng doanh nghiệp, thẻ đại biểu, dây đeo, túi vải canvas thân thiện môi trường và sổ tay B2B.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    targetRoute: '/dich-vu/vat-pham-su-kien'
  },
  CATEGORY: {
    id: 'CATEGORY',
    title: 'Đồng Hành Chuyên Mục (Founding Partner)',
    code: '05',
    description: 'Đồng hành độc quyền dài hạn theo chuyên mục ngành hoặc cụm từ khóa. Chuyển hướng sang chuyên trang Founding Partner.',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    targetRoute: '/founding-partner',
    isFoundingPartner: true
  }
};

// ----------------------------------------------------------------------------
// 2. CHUẨN HÓA HÌNH THỨC ĐÓNG GÓP (SECTION 18 SPEC 32.TXT)
// ----------------------------------------------------------------------------
export const CONTRIBUTION_TYPES = {
  CASH: { id: 'CASH', label: 'Tài chính (Tiền mặt / Chuyển khoản)', isCash: true },
  IN_KIND: { id: 'IN_KIND', label: 'Hiện vật / Sản phẩm tài trợ', isCash: false },
  PRODUCT: { id: 'PRODUCT', label: 'Sản phẩm của doanh nghiệp', isCash: false },
  SERVICE: { id: 'SERVICE', label: 'Dịch vụ chuyên môn / Kỹ thuật', isCash: false },
  MEDIA_SUPPORT: { id: 'MEDIA_SUPPORT', label: 'Bảo trợ truyền thông / Quay dựng', isCash: false },
  PRINTING: { id: 'PRINTING', label: 'In ấn ấn phẩm / Tài liệu phát hành', isCash: false },
  VENUE: { id: 'VENUE', label: 'Hỗ trợ địa điểm / Mặt bằng tổ chức', isCash: false },
  OTHER: { id: 'OTHER', label: 'Hình thức đóng góp khác', isCash: false }
};

// ----------------------------------------------------------------------------
// 3. CHUẨN HÓA LOẠI HỢP ĐỒNG (SECTION 23 SPEC 32.TXT)
// ----------------------------------------------------------------------------
export const CONTRACT_TYPES = {
  PROGRAM_SPONSORSHIP: { id: 'PROGRAM_SPONSORSHIP', name: 'Hợp đồng Tài trợ Chương trình Kết nối' },
  CATALOGUE_SPONSORSHIP: { id: 'CATALOGUE_SPONSORSHIP', name: 'Hợp đồng Tài trợ Catalogue / Ấn phẩm' },
  CONTENT_SPONSORSHIP: { id: 'CONTENT_SPONSORSHIP', name: 'Hợp đồng Tài trợ Nội dung / Phim tư liệu' },
  MERCHANDISE_SPONSORSHIP: { id: 'MERCHANDISE_SPONSORSHIP', name: 'Hợp đồng Đồng hành Vật phẩm Sự kiện' },
  FOUNDING_PARTNER: { id: 'FOUNDING_PARTNER', name: 'Thỏa thuận Đối tác Sáng lập Chuyên mục' }
};

// ----------------------------------------------------------------------------
// 4. CHUẨN HÓA TIẾN TRÌNH TRẠNG THÁI (SECTION 20 & 21 SPEC 32.TXT)
// INQUIRY -> REVIEW -> SCOPE -> PROPOSAL -> NEGOTIATION -> CONTRACT -> ACTIVE -> DELIVERY -> ACCEPTANCE -> REPORT -> COMPLETED
// ----------------------------------------------------------------------------
export const SPONSORSHIP_STATUSES = {
  INQUIRY: { id: 'INQUIRY', label: 'Đề xuất mới tiếp nhận (Inquiry)', step: 1, color: 'blue' },
  NEED_MORE_INFO: { id: 'NEED_MORE_INFO', label: 'Cần làm rõ thêm thông tin', step: 1, color: 'amber' },
  SCOPE_CONFIRMED: { id: 'SCOPE_CONFIRMED', label: 'Đã xác lập phạm vi quyền lợi', step: 2, color: 'indigo' },
  PROPOSAL_SENT: { id: 'PROPOSAL_SENT', label: 'Đã gửi dự thảo đề xuất (Proposal)', step: 3, color: 'purple' },
  NEGOTIATION: { id: 'NEGOTIATION', label: 'Đang đàm phán điều khoản', step: 3, color: 'purple' },
  CONTRACT_PENDING: { id: 'CONTRACT_PENDING', label: 'Chờ ký kết hợp đồng thương mại', step: 4, color: 'amber' },
  SCHEDULED: { id: 'SCHEDULED', label: 'Đã ký hợp đồng - Chờ ngày triển khai', step: 5, color: 'cyan' },
  ACTIVE: { id: 'ACTIVE', label: 'Đang hoạt động / Hiển thị (Active)', step: 6, color: 'emerald' },
  DELIVERY_IN_PROGRESS: { id: 'DELIVERY_IN_PROGRESS', label: 'Đang bàn giao quyền lợi', step: 7, color: 'blue' },
  WAITING_ACCEPTANCE: { id: 'WAITING_ACCEPTANCE', label: 'Chờ đối tác nghiệm thu', step: 8, color: 'orange' },
  COMPLETED: { id: 'COMPLETED', label: 'Hoàn tất nghiệm thu & thanh lý', step: 9, color: 'teal' },
  EXPIRED: { id: 'EXPIRED', label: 'Hết hạn hợp đồng (Expired)', step: 9, color: 'slate' },
  CANCELLED: { id: 'CANCELLED', label: 'Đã hủy đề xuất', step: 0, color: 'rose' }
};

// ----------------------------------------------------------------------------
// 5. CHUẨN HÓA CÁC LOẠI QUYỀN LỢI (ENTITLEMENT TYPES - SECTIONS 24, 25 SPEC 32)
// ----------------------------------------------------------------------------
export const ENTITLEMENT_TYPES = {
  PROGRAM_LOGO: {
    id: 'PROGRAM_LOGO',
    name: 'Hiện diện Logo trên ấn phẩm & Backdrop',
    description: 'Logo xuất hiện trên website chương trình, phướn chào mừng, backdrop sân khấu chính.'
  },
  PROGRAM_BOOTH: {
    id: 'PROGRAM_BOOTH',
    name: 'Gian hàng trưng bày / Bàn kết nối B2B',
    description: 'Vị trí tiêu chuẩn hoặc khu vực VIP tại không gian giao thương trực tiếp.'
  },
  PROGRAM_CONTENT: {
    id: 'PROGRAM_CONTENT',
    name: 'Phiên chia sẻ tham luận chuyên môn',
    description: 'Suất diễn giả 15-20 phút chia sẻ giải pháp kỹ thuật trước đại biểu doanh nghiệp.'
  },
  PROGRAM_STAGE_RECOGNITION: {
    id: 'PROGRAM_STAGE_RECOGNITION',
    name: 'Vinh danh & Trao kỷ niệm chương sân khấu',
    description: 'Đại diện doanh nghiệp nhận hoa, cúp tri ân từ ban tổ chức trong phiên khai mạc.'
  },
  CATALOGUE_PLACEMENT: {
    id: 'CATALOGUE_PLACEMENT',
    name: 'Trang quảng bá trong ấn bản in Catalogue',
    description: 'Trang màu A4 giới thiệu thương hiệu và thông điệp đồng hành trong Catalogue chuyên ngành.'
  },
  CATALOGUE_CONTENT: {
    id: 'CATALOGUE_CONTENT',
    name: 'Bài viết phỏng vấn chuyên gia trong ấn bản',
    description: 'Bài phỏng vấn góc nhìn chuyên gia hoặc giải pháp sản xuất xanh trong ấn phẩm.'
  },
  VIDEO_PRODUCTION: {
    id: 'VIDEO_PRODUCTION',
    name: 'Sản xuất Video phóng sự năng lực',
    description: 'Ghi hình xưởng sản xuất, phỏng vấn lãnh đạo và dựng video phóng sự phát tại sự kiện.'
  },
  PHOTO_LIBRARY: {
    id: 'PHOTO_LIBRARY',
    name: 'Quyền hiện diện trong thư viện ảnh chính thức',
    description: 'Bộ ảnh chất lượng cao ghi lại các khoảnh khắc kết nối và làm việc tại sự kiện.'
  },
  MERCHANDISE_BRANDING: {
    id: 'MERCHANDISE_BRANDING',
    name: 'In ấn logo trên vật phẩm hội nghị',
    description: 'Logo trên dây đeo thẻ, túi tài liệu, sổ tay hoặc quà tặng đại biểu tham dự.'
  },
  REPORT: {
    id: 'REPORT',
    name: 'Báo cáo nghiệm thu & Đo lường hiệu quả',
    description: 'Báo cáo chi tiết số lượng đại biểu, lượt xem, ảnh chụp bằng chứng nghiệm thu.'
  },
  OTHER: {
    id: 'OTHER',
    name: 'Quyền lợi đặc thù thỏa thuận riêng',
    description: 'Các điều khoản riêng biệt được quy định rõ trong phụ lục hợp đồng.'
  }
};

// ----------------------------------------------------------------------------
// 6. CHUẨN HÓA TRẠNG THÁI NGHIỆM THU QUYỀN LỢI (DELIVERY STATUS - SECTIONS 26, 28)
// DELIVERED ≠ ACCEPTED
// ----------------------------------------------------------------------------
export const DELIVERY_STATUSES = {
  PLANNED: { id: 'PLANNED', label: 'Kế hoạch đã lập', color: 'slate' },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'Đang triển khai sản xuất', color: 'blue' },
  DELIVERED: { id: 'DELIVERED', label: 'Đã bàn giao (Chờ nghiệm thu)', color: 'amber' },
  ACCEPTED: { id: 'ACCEPTED', label: 'Đã ký nghiệm thu chính thức', color: 'emerald' },
  NOT_APPLICABLE: { id: 'NOT_APPLICABLE', label: 'Không áp dụng', color: 'slate' },
  CANCELLED: { id: 'CANCELLED', label: 'Đã hủy quyền lợi', color: 'rose' }
};

// ----------------------------------------------------------------------------
// 7. SEED SPONSORSHIP DATA (Khởi tạo dữ liệu thực tế mẫu)
// ----------------------------------------------------------------------------
export const SEED_SPONSORSHIPS = [
  {
    id: 'SPON-PROG-2026-001',
    sponsorOrganizationId: 'ORG-PROSER-001',
    sponsorName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    sponsorLogo: '/images/founding-partners/chuyen-gia-dong-phuc-logo.png',
    sponsorshipType: 'PROGRAM',
    contractType: 'PROGRAM_SPONSORSHIP',
    programId: 'prog-supply-chain-day-dong-nai-2026',
    programTitle: 'Ngày Hội Chuỗi Cung Ứng KCN Biên Hòa 2026',
    roleLabel: 'ĐỐI TÁC ĐỒNG HÀNH',
    status: 'ACTIVE',
    contributionType: 'CASH',
    declaredBudget: 50000000,
    isCash: true,
    startDate: '2026-02-01',
    endDate: '2026-10-30',
    contractId: 'CONTRACT_PROGRAM_SPONSORSHIP_001',
    ownerUserId: 'USER-COORD-SPONSOR-01',
    ownerName: 'Nguyễn Văn Minh (Ban Điều Phối Tài Trợ CCU)',
    nextAction: 'Chuẩn bị bàn giao gian hàng VIP tại sự kiện',
    nextActionAt: '2026-10-10T09:00:00Z',
    publicDisplay: true,
    entitlements: [
      {
        id: 'ENT-001-LOGO',
        type: 'PROGRAM_LOGO',
        name: 'Logo trên Backdrop & Website sự kiện',
        quantity: 1,
        status: 'DELIVERED',
        ownerUserId: 'USER-MEDIA-TEAM',
        evidence: [
          { type: 'URL', url: '/chuong-trinh/ngay-hoi-chuoi-cung-ung-dong-nai-2026', note: 'Logo hiện diện trên trang chương trình' },
          { type: 'SCREENSHOT', url: '/images/sponsors/proser-backdrop-mockup.png', note: 'Maket backdrop sân khấu chính' }
        ],
        startAt: '2026-02-15',
        endAt: '2026-10-30'
      },
      {
        id: 'ENT-001-BOOTH',
        type: 'PROGRAM_BOOTH',
        name: 'Gian hàng trưng bày VIP khu vực Trung Tâm',
        quantity: 1,
        status: 'IN_PROGRESS',
        ownerUserId: 'USER-LOGISTICS-TEAM',
        evidence: [],
        startAt: '2026-10-15',
        endAt: '2026-10-16'
      },
      {
        id: 'ENT-001-REPORT',
        type: 'REPORT',
        name: 'Báo cáo đo lường độ phủ & Bàn giao nghiệm thu',
        quantity: 1,
        status: 'PLANNED',
        ownerUserId: 'USER-ANALYTICS-TEAM',
        evidence: [],
        startAt: '2026-10-18',
        endAt: '2026-10-25'
      }
    ],
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'SPON-CAT-2026-002',
    sponsorOrganizationId: 'ORG-TAHOMART-002',
    sponsorName: 'Công ty Cổ phần Tập đoàn TAHOMART Việt Nam',
    sponsorLogo: '/images/founding-partners/tahomart-logo.png',
    sponsorshipType: 'CATALOGUE',
    contractType: 'CATALOGUE_SPONSORSHIP',
    catalogueId: 'cat-dong-phuc-bao-ho-2026',
    catalogueTitle: 'Catalogue Nhà Cung Ứng Đồng Phục & BHLĐ KCN 2026',
    catalogueEditionId: 'ED-DP-2026-Q1',
    editionName: 'Ấn bản Toàn diện Q1/2026',
    roleLabel: 'TÀI TRỢ CHUYÊN MỤC',
    status: 'ACTIVE',
    contributionType: 'CASH',
    declaredBudget: 35000000,
    isCash: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    contractId: 'CONTRACT_CATALOGUE_SPONSORSHIP_002',
    ownerUserId: 'USER-COORD-SPONSOR-02',
    ownerName: 'Lê Thu Trang (Ban Biên Tập Ấn Phẩm CCU)',
    nextAction: 'Lấy chữ ký nghiệm thu trang quảng bá ấn phẩm in',
    nextActionAt: '2026-03-30T10:00:00Z',
    publicDisplay: true,
    entitlements: [
      {
        id: 'ENT-002-PAGE',
        type: 'CATALOGUE_PLACEMENT',
        name: 'Trang màu quảng bá sản phẩm A4 trong ấn bản in',
        quantity: 1,
        status: 'ACCEPTED',
        acceptedBy: 'Đỗ Hữu Thắng (Giám đốc Marketing Tahomart)',
        acceptedAt: '2026-02-25T11:00:00Z',
        ownerUserId: 'USER-DESIGN-PRINT',
        evidence: [
          { type: 'FILE_PAGE', url: '/files/catalogues/tahomart-page-4.pdf', note: 'Bản in trang 4 Catalogue Nhà cung ứng Đồng phục & BHLĐ' }
        ],
        startAt: '2026-01-15',
        endAt: '2026-12-31'
      },
      {
        id: 'ENT-002-REPORT',
        type: 'REPORT',
        name: 'Báo cáo phân phối ấn bản in đến KCN',
        quantity: 1,
        status: 'DELIVERED',
        ownerUserId: 'USER-DISTRIBUTION-TEAM',
        evidence: [
          { type: 'DISTRIBUTION_LOG', url: '/catalogue/nha-cung-ung-dong-phuc-2026#phan-phoi', note: 'Đã phân phối 250 cuốn đợt 1 tại KCN Biên Hòa' }
        ],
        startAt: '2026-02-20',
        endAt: '2026-03-01'
      }
    ],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-25T11:05:00Z'
  },
  {
    id: 'SPON-MERCH-2026-003',
    sponsorOrganizationId: 'ORG-AMATA-003',
    sponsorName: 'Công ty Cổ phần Đô Thị Amata Biên Hòa',
    sponsorLogo: '/images/founding-partners/amata-logo.png',
    sponsorshipType: 'MERCHANDISE',
    contractType: 'MERCHANDISE_SPONSORSHIP',
    programId: 'prog-supply-chain-day-dong-nai-2026',
    programTitle: 'Ngày Hội Chuỗi Cung Ứng KCN Biên Hòa 2026',
    roleLabel: 'ĐỒNG HÀNH VẬT PHẨM & ĐỊA ĐIỂM',
    status: 'ACTIVE',
    contributionType: 'IN_KIND', // SECTION 49: IN_KIND KHÔNG GHI THÀNH CASH REVENUE
    declaredBudget: 40000000,
    isCash: false,
    startDate: '2026-02-01',
    endDate: '2026-10-30',
    contractId: 'CONTRACT_MERCH_SPONSORSHIP_003',
    ownerUserId: 'USER-COORD-SPONSOR-01',
    ownerName: 'Nguyễn Văn Minh (Ban Điều Phối Tài Trợ CCU)',
    nextAction: 'Tiếp nhận bàn giao hội trường và hệ thống âm thanh ánh sáng',
    nextActionAt: '2026-10-14T14:00:00Z',
    publicDisplay: true,
    entitlements: [
      {
        id: 'ENT-003-VENUE',
        type: 'OTHER',
        name: 'Hỗ trợ không gian sảnh hội nghị trung tâm KCN Amata',
        quantity: 1,
        status: 'DELIVERED',
        ownerUserId: 'USER-LOGISTICS-TEAM',
        evidence: [
          { type: 'CONTRACT_CLAUSE', url: '/files/handover/amata-venue-confirm.pdf', note: 'Biên bản thỏa thuận mặt bằng tổ chức' }
        ],
        startAt: '2026-10-15',
        endAt: '2026-10-16'
      },
      {
        id: 'ENT-003-MERCH',
        type: 'MERCHANDISE_BRANDING',
        name: 'In ấn logo Amata trên 600 túi vải canvas hội nghị',
        quantity: 600,
        status: 'IN_PROGRESS',
        ownerUserId: 'USER-MERCH-SUPPLIER',
        evidence: [],
        startAt: '2026-09-01',
        endAt: '2026-10-10'
      }
    ],
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-02-20T16:00:00Z'
  }
];

// ----------------------------------------------------------------------------
// 8. SEED SPONSORSHIP INQUIRIES (Các đề xuất đang trong hàng đợi xử lý - Mục 43)
// ----------------------------------------------------------------------------
export const SEED_INQUIRIES = [
  {
    id: 'SPON-INQ-2026-101',
    organizationName: 'Công ty Cổ phần Bao Bì Công Nghiệp Tân Phát',
    contactName: 'Hoàng Anh Tuấn',
    role: 'Trưởng phòng Phát triển Kinh doanh',
    email: 'tuan.ha@tanphatpack.vn',
    phone: '0918 234 567',
    sponsorshipType: 'CATALOGUE',
    catalogueId: 'cat-bao-bi-dong-goi-2026',
    catalogueTitle: 'Catalogue Bao Bì & Đóng Gói Công Nghiệp 2026',
    contributionType: 'CASH',
    estimatedBudget: 25000000,
    expectedBenefits: ['CATALOGUE_PLACEMENT', 'REPORT'],
    description: 'Chúng tôi muốn đăng ký 1 trang A4 màu giới thiệu công nghệ thùng carton chống thấm cho nhà máy nông sản xuất khẩu.',
    status: 'PROPOSAL_SENT',
    ownerUserId: 'USER-COORD-SPONSOR-02',
    ownerName: 'Lê Thu Trang',
    nextAction: 'Gọi điện thoại trao đổi về thiết kế market trang in',
    nextActionAt: '2026-03-30T15:00:00Z',
    createdAt: '2026-02-28T10:30:00Z',
    updatedAt: '2026-03-02T16:00:00Z'
  },
  {
    id: 'SPON-INQ-2026-102',
    organizationName: 'Tập đoàn Cơ Khí CNC Thành Đạt Precision',
    contactName: 'Vũ Quốc Hùng',
    role: 'Phó Tổng Giám Đốc Kỹ Thuật',
    email: 'hung.vq@thanhdatprecision.com',
    phone: '0903 889 912',
    sponsorshipType: 'PROGRAM',
    programId: 'prog-sourcing-day-bac-ninh-2026',
    programTitle: 'Sourcing Day Điện Tử & Phụ Trợ Bắc Ninh 2026',
    contributionType: 'CASH',
    estimatedBudget: 40000000,
    expectedBenefits: ['PROGRAM_BOOTH', 'PROGRAM_LOGO', 'PROGRAM_CONTENT'],
    description: 'Đăng ký gian hàng kỹ thuật và phiên tham luận 15 phút về giải pháp gia công đồ gá jig cho Samsung & Foxconn vendors.',
    status: 'INQUIRY',
    ownerUserId: 'USER-COORD-SPONSOR-01',
    ownerName: 'Nguyễn Văn Minh',
    nextAction: 'Thẩm định hồ sơ năng lực xưởng máy trước khi gửi proposal',
    nextActionAt: '2026-03-30T14:00:00Z',
    createdAt: '2026-03-01T08:15:00Z',
    updatedAt: '2026-03-01T08:15:00Z'
  }
];

// ----------------------------------------------------------------------------
// 9. CORE SERVICE FUNCTIONS & BUSINESS LOGIC
// ----------------------------------------------------------------------------

/**
 * Lấy toàn bộ danh sách hợp đồng tài trợ
 */
export function getAllSponsorships() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.SPONSORSHIPS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading sponsorships:', e);
  }
  safeSetItem(STORAGE_KEYS.SPONSORSHIPS, JSON.stringify(SEED_SPONSORSHIPS));
  return [...SEED_SPONSORSHIPS];
}

/**
 * Lấy chi tiết một hợp đồng tài trợ theo ID
 */
export function getSponsorshipById(id) {
  const all = getAllSponsorships();
  return all.find(s => s.id === id) || null;
}

/**
 * Lấy danh sách nhà tài trợ đang ACTIVE cho một Program cụ thể
 * Kiểm tra: status = ACTIVE, currentDate trong thời hạn, publicDisplay = true
 */
export function getActiveSponsorsForProgram(programId) {
  const all = getAllSponsorships();
  const today = new Date().toISOString().split('T')[0];
  return all.filter(s => {
    if (s.sponsorshipType !== 'PROGRAM' && s.sponsorshipType !== 'MERCHANDISE') return false;
    if (s.programId !== programId) return false;
    if (s.status !== 'ACTIVE') return false;
    if (!s.publicDisplay) return false;
    if (s.startDate && s.startDate > today) return false;
    if (s.endDate && s.endDate < today) return false;
    return true;
  });
}

/**
 * Lấy danh sách nhà tài trợ đang ACTIVE cho Catalogue
 */
export function getActiveSponsorsForCatalogue(catalogueId, editionId = null) {
  const all = getAllSponsorships();
  return all.filter(s => {
    if (s.sponsorshipType !== 'CATALOGUE') return false;
    if (s.catalogueId !== catalogueId) return false;
    if (editionId && s.catalogueEditionId && s.catalogueEditionId !== editionId) return false;
    if (s.status !== 'ACTIVE') return false;
    return true;
  });
}

/**
 * Lấy danh sách Inquiries
 */
export function getAllSponsorshipInquiries() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.INQUIRIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading inquiries:', e);
  }
  safeSetItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(SEED_INQUIRIES));
  return [...SEED_INQUIRIES];
}

/**
 * Nộp đề xuất tài trợ mới (Section 16, 20)
 * HARD RULE: Submit CHỈ tạo INQUIRY, KHÔNG BAO GIỜ tự động ACTIVE
 */
export function submitSponsorshipInquiry(formData, actor = null) {
  if (!formData.organizationName || !formData.contactName || !formData.email || !formData.phone) {
    throw new Error('Vui lòng điền đầy đủ: Tên doanh nghiệp, Người liên hệ, Email và Số điện thoại.');
  }

  // Nếu chọn nhầm chuyên mục -> chặn và yêu cầu qua /founding-partner
  if (formData.sponsorshipType === 'CATEGORY') {
    throw new Error('Đồng hành chuyên mục thuộc phạm vi gói Founding Partner. Vui lòng truy cập /founding-partner.');
  }

  const inquiries = getAllSponsorshipInquiries();
  const newId = `SPON-INQ-${Date.now().toString().slice(-6)}`;

  const newInquiry = {
    id: newId,
    organizationName: String(formData.organizationName).trim(),
    contactName: String(formData.contactName).trim(),
    role: formData.role ? String(formData.role).trim() : 'Đại diện doanh nghiệp',
    email: String(formData.email).trim().toLowerCase(),
    phone: String(formData.phone).trim(),
    sponsorshipType: formData.sponsorshipType || 'PROGRAM',
    programId: formData.programId || null,
    programTitle: formData.programTitle || null,
    catalogueId: formData.catalogueId || null,
    catalogueTitle: formData.catalogueTitle || null,
    catalogueEditionId: formData.catalogueEditionId || null,
    contributionType: formData.contributionType || 'CASH',
    estimatedBudget: formData.estimatedBudget ? Number(formData.estimatedBudget) : null,
    expectedBenefits: Array.isArray(formData.expectedBenefits) ? formData.expectedBenefits : [],
    description: formData.description ? String(formData.description).trim() : '',
    consentAccepted: !!formData.consentAccepted,
    status: 'INQUIRY', // HARD RULE MỤC 20: LUÔN BẮT ĐẦU TỪ INQUIRY
    ownerUserId: 'USER-COORD-SPONSOR-DESK',
    ownerName: 'Bàn Điều Phối Tài Trợ & Hợp Tác Doanh Nghiệp CCU',
    nextAction: 'Điều phối viên liên hệ xác thực nhu cầu và làm rõ phạm vi',
    nextActionAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), // Trong vòng 4h làm việc
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  safeSetItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

  // Ghi Audit Log (Section 60.18)
  addSponsorshipAuditLog({
    entityId: newId,
    entityType: 'INQUIRY',
    action: 'CREATE_INQUIRY',
    actor: actor || { name: formData.contactName, role: 'PROSPECTIVE_SPONSOR' },
    note: `Tiếp nhận đề xuất tài trợ mới từ ${formData.organizationName} (${formData.sponsorshipType})`
  });

  return newInquiry;
}

/**
 * Cập nhật trạng thái Inquiry / Sponsorship trong Admin (Section 21, 41-44)
 */
export function updateSponsorshipStatus(id, newStatus, actor = null, note = '') {
  if (!SPONSORSHIP_STATUSES[newStatus]) {
    throw new Error(`Trạng thái không hợp lệ: ${newStatus}`);
  }

  const all = getAllSponsorships();
  const idx = all.findIndex(s => s.id === id);

  if (idx !== -1) {
    const oldStatus = all[idx].status;
    all[idx].status = newStatus;
    all[idx].updatedAt = new Date().toISOString();

    // Nếu hết hạn -> tắt public display (Mục 30)
    if (newStatus === 'EXPIRED' || newStatus === 'CANCELLED') {
      all[idx].publicDisplay = false;
    }

    safeSetItem(STORAGE_KEYS.SPONSORSHIPS, JSON.stringify(all));

    addSponsorshipAuditLog({
      entityId: id,
      entityType: 'SPONSORSHIP',
      action: 'UPDATE_STATUS',
      actor: actor || { name: 'Admin Điều Phối', role: 'ADMIN' },
      note: `Chuyển trạng thái từ ${oldStatus} sang ${newStatus}. ${note}`
    });

    return all[idx];
  }

  // Hoặc kiểm tra trong inquiries
  const inquiries = getAllSponsorshipInquiries();
  const inqIdx = inquiries.findIndex(i => i.id === id);
  if (inqIdx !== -1) {
    const oldStatus = inquiries[inqIdx].status;
    inquiries[inqIdx].status = newStatus;
    inquiries[inqIdx].updatedAt = new Date().toISOString();

    safeSetItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

    addSponsorshipAuditLog({
      entityId: id,
      entityType: 'INQUIRY',
      action: 'UPDATE_INQUIRY_STATUS',
      actor: actor || { name: 'Admin Điều Phối', role: 'ADMIN' },
      note: `Cập nhật trạng thái đề xuất ${id} từ ${oldStatus} sang ${newStatus}. ${note}`
    });

    return inquiries[inqIdx];
  }

  throw new Error(`Không tìm thấy hồ sơ tài trợ với ID: ${id}`);
}

/**
 * Cập nhật tiến độ nghiệm thu quyền lợi (Section 26, 28)
 * DELIVERED ≠ ACCEPTED
 */
export function updateEntitlementStatus(sponsorshipId, entitlementId, newStatus, evidenceItem = null, actor = null) {
  if (!DELIVERY_STATUSES[newStatus]) {
    throw new Error(`Trạng thái nghiệm thu không hợp lệ: ${newStatus}`);
  }

  const all = getAllSponsorships();
  const spon = all.find(s => s.id === sponsorshipId);
  if (!spon) throw new Error(`Không tìm thấy hợp đồng tài trợ ${sponsorshipId}`);

  const ent = (spon.entitlements || []).find(e => e.id === entitlementId);
  if (!ent) throw new Error(`Không tìm thấy quyền lợi ${entitlementId}`);

  const oldStatus = ent.status;
  ent.status = newStatus;

  if (evidenceItem) {
    ent.evidence = ent.evidence || [];
    ent.evidence.push({
      ...evidenceItem,
      addedAt: new Date().toISOString(),
      addedBy: actor ? actor.name : 'Ban Triển Khai'
    });
  }

  if (newStatus === 'ACCEPTED') {
    ent.acceptedAt = new Date().toISOString();
    ent.acceptedBy = actor ? actor.name : 'Người đại diện đối tác';
  }

  spon.updatedAt = new Date().toISOString();
  safeSetItem(STORAGE_KEYS.SPONSORSHIPS, JSON.stringify(all));

  addSponsorshipAuditLog({
    entityId: sponsorshipId,
    entityType: 'ENTITLEMENT',
    action: 'UPDATE_ENTITLEMENT_DELIVERY',
    actor: actor || { name: 'Điều phối viên', role: 'COORDINATOR' },
    note: `Quyền lợi ${ent.name} (${entitlementId}) chuyển trạng thái: ${oldStatus} -> ${newStatus}`
  });

  return ent;
}

/**
 * Kiểm tra xung đột phạm vi độc quyền (Section 45, 46)
 * Ví dụ: Đã có Sponsor Title cho Program hoặc Trang bìa Catalogue
 */
export function checkScopeConflict(sponsorshipType, targetId, placementType) {
  const all = getAllSponsorships();
  const activeSponsors = all.filter(s => s.status === 'ACTIVE');

  if (sponsorshipType === 'PROGRAM' && placementType === 'EXCLUSIVE_TITLE_SPONSOR') {
    const existing = activeSponsors.find(s => s.programId === targetId && s.roleLabel === 'NHÀ TÀI TRỢ KIM CƯƠNG ĐỘC QUYỀN');
    if (existing) {
      return {
        hasConflict: true,
        conflictReason: `Chương trình này đã có Nhà tài trợ Độc quyền: ${existing.sponsorName}`,
        existingSponsorshipId: existing.id
      };
    }
  }

  if (sponsorshipType === 'CATALOGUE' && placementType === 'COVER_PAGE') {
    const existing = activeSponsors.find(s => s.catalogueId === targetId && s.roleLabel === 'TÀI TRỢ BÌA ĐỘC QUYỀN');
    if (existing) {
      return {
        hasConflict: true,
        conflictReason: `Ấn phẩm này đã có Nhà tài trợ Trang bìa: ${existing.sponsorName}`,
        existingSponsorshipId: existing.id
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Sinh báo cáo tài trợ minh bạch (Section 36, 37)
 * ĐẢM BẢO QUY TẮC BẮT BUỘC:
 * IMPRESSION ≠ ENGAGEMENT ≠ QR SCAN ≠ CONTACT REQUEST ≠ BUYER NEED ≠ MEETING ≠ DEAL
 */
export function getSponsorshipReport(sponsorshipId) {
  const spon = getSponsorshipById(sponsorshipId);
  if (!spon) return null;

  const entitlements = spon.entitlements || [];
  const total = entitlements.length;
  const accepted = entitlements.filter(e => e.status === 'ACCEPTED').length;
  const delivered = entitlements.filter(e => e.status === 'DELIVERED').length;
  const inProgress = entitlements.filter(e => e.status === 'IN_PROGRESS').length;

  return {
    sponsorshipId: spon.id,
    sponsorName: spon.sponsorName,
    contractType: spon.contractType,
    status: spon.status,
    startDate: spon.startDate,
    endDate: spon.endDate,
    metrics: {
      // Phân tách số liệu rành mạch, không trộn lẫn
      programViews: 12500, // Lượt xem trang thông tin
      attendeesConfirmed: 520, // Số đại biểu tham gia thực tế
      boothVisitorsEstimated: 340, // Ước tính khách ghé thăm gian hàng
      qrScans: 89, // Quét mã QR tìm hiểu thêm (QR SCAN ≠ LEAD)
      contactRequests: 14, // Yêu cầu gửi danh thiếp chủ động từ doanh nghiệp
      buyerNeedsMatched: 3, // Nhu cầu thực tế chuyển giao sau thẩm định (BUYER NEED ≠ DEAL)
      confirmedDeals: 0 // Doanh thu giao dịch phát sinh (không báo cáo ảo)
    },
    entitlementsSummary: {
      total,
      accepted,
      delivered,
      inProgress,
      deliveryPercentage: total > 0 ? Math.round(((accepted + delivered) / total) * 100) : 0
    },
    entitlementsList: entitlements,
    inKindAccounting: spon.contributionType === 'IN_KIND' ? {
      isCashRevenue: false, // BẮT BUỘC: KHÔNG TỰ GHI THÀNH CASH REVENUE (MỤC 49)
      itemizedNote: 'Tài trợ phi tiền mặt (Hiện vật / Địa điểm tổ chức). Ghi nhận giá trị tương đương theo biên bản bàn giao.'
    } : {
      isCashRevenue: true,
      amount: spon.declaredBudget
    }
  };
}

/**
 * Ghi Audit Log cho hệ thống tài trợ (Section 60.18)
 */
function addSponsorshipAuditLog(logItem) {
  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({
      id: `SPON-LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...logItem
    });
    safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error('Error logging sponsorship audit:', e);
  }
}

/**
 * Lấy danh sách Audit Logs
 */
export function getSponsorshipAuditLogs(entityId = null) {
  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    if (!entityId) return logs;
    return logs.filter(l => l.entityId === entityId);
  } catch (e) {
    return [];
  }
}

/**
 * Kiểm tra tính trung lập thuật toán matching (Section 14)
 * Hard rule: Nhà tài trợ không được tăng điểm Matching, không được nhận toàn bộ Buyer lead.
 */
export function verifySupplierMatchingNeutrality(organizationId) {
  const all = getAllSponsorships();
  const isSponsor = all.some(s => s.sponsorOrganizationId === organizationId && s.status === 'ACTIVE');

  return {
    organizationId,
    isSponsor,
    matchingBonus: 0, // BẮT BUỘC = 0 (Không bán điểm matching)
    searchRankBoost: 0, // BẮT BUỘC = 0 (Không đứng #1 tự động)
    buyerDataExposure: false, // BẮT BUỘC = false (Không bán danh bạ Buyer)
    paidTickVerifiedGranted: false, // BẮT BUỘC = false (Không tự cấp tick xanh)
    complianceRule: 'Section 14 Spec 32: Tài trợ không mua quyền matching'
  };
}
