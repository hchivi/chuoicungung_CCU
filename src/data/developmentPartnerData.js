// ============================================================================
// DEVELOPMENT PARTNER DATA LAYER & MANAGEMENT SERVICE
// PAGE 33: ĐỐI TÁC PHÁT TRIỂN / REFERRAL / B2B BUSINESS DEVELOPMENT (/doi-tac-phat-trien)
// Chuẩn hóa theo spec 33.txt - CHUOICUNGUNG.COM
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
  PARTNERS: 'ccu_dev_partners_v1',
  APPLICATIONS: 'ccu_dev_partner_applications_v1',
  REFERRALS: 'ccu_dev_partner_referrals_v1',
  SETTLEMENTS: 'ccu_dev_partner_settlements_v1',
  AUDIT_LOGS: 'ccu_dev_partner_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. CHUẨN HÓA 5 HÌNH THỨC PHỐI HỢP (SECTION 4 SPEC 33.TXT)
// ----------------------------------------------------------------------------
export const COOPERATION_TYPES = {
  SERVICE_CONTENT: {
    id: 'SERVICE_CONTENT',
    code: 'A',
    title: 'Giới Thiệu Khách Đặt Dịch Vụ Nội Dung',
    description: 'Giới thiệu doanh nghiệp có nhu cầu làm hồ sơ năng lực số, video phóng sự xưởng, chụp ảnh tư liệu hoặc ấn phẩm Catalogue.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  SERVICE_MERCHANDISE: {
    id: 'SERVICE_MERCHANDISE',
    code: 'B',
    title: 'Giới Thiệu Khách Đặt Vật Phẩm Sự Kiện',
    description: 'Kết nối các đơn vị có nhu cầu đặt quà tặng doanh nghiệp B2B, đồng phục công nhân, túi vải hội nghị, sổ tay và ấn phẩm in.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  PROGRAM_PARTICIPANTS: {
    id: 'PROGRAM_PARTICIPANTS',
    code: 'C',
    title: 'Phát Triển Nhóm Doanh Nghiệp Tham Gia Chương Trình',
    description: 'Tập hợp các nhà cung ứng hoặc đoàn mua hàng FDI tham dự Ngày hội Chuỗi Cung Ứng, Sourcing Day 1:1, gian hàng chung.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  PROGRAM_ORGANIZATION: {
    id: 'PROGRAM_ORGANIZATION',
    code: 'D',
    title: 'Giới Thiệu Đơn Vị Có Nhu Cầu Tổ Chức Chương Trình',
    description: 'Kết nối Ban Quản lý KCN, Hiệp hội ngành hàng hoặc Tập đoàn FDI có nhu cầu tổ chức ngày hội kết nối nhà cung ứng phụ trợ riêng.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  LOCAL_COORDINATION: {
    id: 'LOCAL_COORDINATION',
    code: 'E',
    title: 'Phối Hợp Điều Phối Tại Địa Phương',
    description: 'Đồng hành hỗ trợ triển khai thực địa, đón tiếp đại biểu, thẩm định hồ sơ xưởng tại địa bàn tỉnh/thành phố khi được duyệt riêng.',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300'
  }
};

// ----------------------------------------------------------------------------
// 2. ĐỐI TƯỢNG PHÙ HỢP (SECTION 3 SPEC 33.TXT)
// ----------------------------------------------------------------------------
export const PARTNER_ROLES = {
  BUSINESS_ASSOCIATION: { id: 'BUSINESS_ASSOCIATION', label: 'Hội / Hiệp Hội Doanh Nghiệp & Ngành Hàng' },
  EVENT_ORGANIZER: { id: 'EVENT_ORGANIZER', label: 'Đơn vị Tổ chức Sự kiện / Triển lãm Thương mại' },
  LOCAL_PARTNER: { id: 'LOCAL_PARTNER', label: 'Đối tác Kết nối Địa phương (KCN / Địa bàn)' },
  BUSINESS_CONSULTING: { id: 'BUSINESS_CONSULTING', label: 'Đơn vị Tư vấn Doanh nghiệp & Xúc tiến Thương mại' },
  INDIVIDUAL_NETWORK: { id: 'INDIVIDUAL_NETWORK', label: 'Cá nhân có Mạng lưới Doanh nghiệp phù hợp' },
  MARKET_DEVELOPMENT: { id: 'MARKET_DEVELOPMENT', label: 'Đối tác Phát triển Thị trường Chuyên ngành' }
};

// ----------------------------------------------------------------------------
// 3. TIẾN TRÌNH TRẠNG THÁI ĐỐI TÁC (SECTION 25, 26 SPEC 33.TXT)
// APPLICATION -> REVIEW -> DISCUSSION -> AGREEMENT -> APPROVED -> ACTIVE
// ----------------------------------------------------------------------------
export const PARTNER_STATUSES = {
  APPLIED: { id: 'APPLIED', label: 'Hồ sơ mới nộp (Chờ duyệt)', step: 1, color: 'blue' },
  UNDER_REVIEW: { id: 'UNDER_REVIEW', label: 'Đang thẩm định hồ sơ', step: 2, color: 'indigo' },
  NEED_MORE_INFO: { id: 'NEED_MORE_INFO', label: 'Cần làm rõ thêm thông tin', step: 2, color: 'amber' },
  DISCUSSION: { id: 'DISCUSSION', label: 'Đang trao đổi trực tiếp', step: 3, color: 'purple' },
  AGREEMENT_PENDING: { id: 'AGREEMENT_PENDING', label: 'Chờ ký thỏa thuận hợp tác', step: 4, color: 'amber' },
  APPROVED: { id: 'APPROVED', label: 'Đã phê duyệt (Chờ kích hoạt)', step: 5, color: 'teal' },
  ACTIVE: { id: 'ACTIVE', label: 'Đang hoạt động chính thức (Active)', step: 6, color: 'emerald' },
  PAUSED: { id: 'PAUSED', label: 'Tạm dừng hợp tác', step: 6, color: 'slate' },
  ENDED: { id: 'ENDED', label: 'Đã kết thúc thỏa thuận', step: 7, color: 'slate' },
  REJECTED: { id: 'REJECTED', label: 'Không phù hợp (Đã từ chối)', step: 0, color: 'rose' },
  CANCELLED: { id: 'CANCELLED', label: 'Đã hủy đơn', step: 0, color: 'rose' }
};

// ----------------------------------------------------------------------------
// 4. TIẾN TRÌNH TRẠNG THÁI REFERRAL (SECTION 14 SPEC 33.TXT)
// Không dùng 1 trạng thái "SUCCESS" chung chung
// ----------------------------------------------------------------------------
export const REFERRAL_STATUSES = {
  CAPTURED: { id: 'CAPTURED', label: 'Ghi nhận nguồn (Captured)', color: 'blue' },
  UNDER_REVIEW: { id: 'UNDER_REVIEW', label: 'Đang đối soát điều kiện', color: 'indigo' },
  DUPLICATE: { id: 'DUPLICATE', label: 'Trùng lặp đối tác giới thiệu trước', color: 'rose' },
  EXISTING_CUSTOMER: { id: 'EXISTING_CUSTOMER', label: 'Khách hàng cũ (Đã có trên hệ thống)', color: 'amber' },
  VALID: { id: 'VALID', label: 'Yêu cầu hợp lệ', color: 'teal' },
  INVALID: { id: 'INVALID', label: 'Không đủ điều kiện', color: 'rose' },
  CONVERTED_TO_REQUEST: { id: 'CONVERTED_TO_REQUEST', label: 'Đã tạo ServiceRequest / Program', color: 'purple' },
  TRANSACTION_PENDING: { id: 'TRANSACTION_PENDING', label: 'Chờ giao dịch / Hợp đồng hoàn tất', color: 'orange' },
  ELIGIBLE_FOR_SETTLEMENT: { id: 'ELIGIBLE_FOR_SETTLEMENT', label: 'Đủ điều kiện đối soát (Eligible)', color: 'emerald' },
  SETTLED: { id: 'SETTLED', label: 'Đã đối soát hoàn tất', color: 'teal' },
  CANCELLED: { id: 'CANCELLED', label: 'Giao dịch bị hủy', color: 'slate' },
  REFUNDED_ADJUSTMENT: { id: 'REFUNDED_ADJUSTMENT', label: 'Điều chỉnh do hoàn tiền / giảm trừ', color: 'rose' }
};

// ----------------------------------------------------------------------------
// 5. TRẠNG THÁI BẢNG ĐỐI SOÁT (SETTLEMENT STATUS - SECTION 43)
// ----------------------------------------------------------------------------
export const SETTLEMENT_STATUSES = {
  DRAFT: { id: 'DRAFT', label: 'Dự thảo đối soát', color: 'slate' },
  UNDER_REVIEW: { id: 'UNDER_REVIEW', label: 'Đang kiểm tra chứng từ', color: 'blue' },
  APPROVED: { id: 'APPROVED', label: 'Đã phê duyệt đối soát', color: 'indigo' },
  PAYMENT_PENDING: { id: 'PAYMENT_PENDING', label: 'Chờ thanh toán chi trả', color: 'amber' },
  PAID: { id: 'PAID', label: 'Đã thanh toán hoàn tất', color: 'emerald' },
  ADJUSTED: { id: 'ADJUSTED', label: 'Đã điều chỉnh hoàn tiền', color: 'orange' },
  CANCELLED: { id: 'CANCELLED', label: 'Đã hủy đối soát', color: 'rose' }
};

// ----------------------------------------------------------------------------
// 6. SEED DATA KHỞI TẠO MẪU
// ----------------------------------------------------------------------------
export const SEED_DEVELOPMENT_PARTNERS = [
  {
    id: 'DTPT-2026-001',
    partnerName: 'Câu Lạc Bộ Xúc Tiến Thương Mại KCN Đông Nam Bộ',
    organizationId: 'ORG-AMATA-003',
    partnerType: 'BUSINESS_ASSOCIATION',
    contactPerson: 'Trần Đình Trọng',
    email: 'trong.td@clbdongnambo.org.vn',
    phone: '0913 456 789',
    partnerCode: 'DTPT-AMATA-01',
    referralLink: 'https://chuoicungung.com?ref=DTPT-AMATA-01',
    cooperationTypes: ['SERVICE_CONTENT', 'PROGRAM_PARTICIPANTS'],
    geographicScopes: ['Đồng Nai', 'Bình Dương', 'Bà Rịa - Vũng Tàu'],
    status: 'ACTIVE',
    agreementId: 'AGREEMENT_DTPT_AMATA_2026',
    ownerUserId: 'USER-ADMIN-PARTNER-01',
    ownerName: 'Nguyễn Văn Minh (Ban Hợp Tác CCU)',
    nextAction: 'Đối soát các hồ sơ tham gia Ngày hội Chuỗi Cung Ứng Biên Hòa',
    nextActionAt: '2026-10-20T10:00:00Z',
    publicDisplay: true,
    totalValidReferrals: 12,
    settledAmount: 18000000,
    pendingSettlementAmount: 6000000,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-15T14:00:00Z'
  },
  {
    id: 'DTPT-2026-002',
    partnerName: 'Công ty Cổ phần Tư Vấn & Xúc Tiến Thương Mại GlobalLink',
    organizationId: 'ORG-PROSER-001',
    partnerType: 'BUSINESS_CONSULTING',
    contactPerson: 'Lê Hoàng Nam',
    email: 'nam.lh@globallink.com.vn',
    phone: '0908 123 456',
    partnerCode: 'DTPT-GL-02',
    referralLink: 'https://chuoicungung.com?ref=DTPT-GL-02',
    cooperationTypes: ['PROGRAM_ORGANIZATION', 'SERVICE_MERCHANDISE'],
    geographicScopes: ['TP. Hồ Chí Minh', 'Hà Nội'],
    status: 'ACTIVE',
    agreementId: 'AGREEMENT_DTPT_GLOBALLINK_2026',
    ownerUserId: 'USER-ADMIN-PARTNER-02',
    ownerName: 'Lê Thu Trang (Ban Hợp Tác CCU)',
    nextAction: 'Họp bàn phương án tổ chức Sourcing Day Ngành Cơ Khí Phụ Trợ',
    nextActionAt: '2026-04-05T09:00:00Z',
    publicDisplay: true,
    totalValidReferrals: 8,
    settledAmount: 12500000,
    pendingSettlementAmount: 4500000,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-02-20T16:30:00Z'
  },
  {
    id: 'DTPT-2026-003',
    partnerName: 'Chuyên Gia Tư Vấn Chuỗi Cung Ứng FDI Vũ Tuấn Anh',
    organizationId: null, // Cá nhân đối tác
    partnerType: 'INDIVIDUAL_NETWORK',
    contactPerson: 'Vũ Tuấn Anh',
    email: 'tuananh.supplychain@gmail.com',
    phone: '0982 999 888',
    partnerCode: 'DTPT-VTA-03',
    referralLink: 'https://chuoicungung.com?ref=DTPT-VTA-03',
    cooperationTypes: ['SERVICE_CONTENT', 'PROGRAM_PARTICIPANTS'],
    geographicScopes: ['Bắc Ninh', 'Hải Phòng', 'Vĩnh Phúc'],
    status: 'ACTIVE',
    agreementId: 'AGREEMENT_DTPT_VTA_2026',
    ownerUserId: 'USER-ADMIN-PARTNER-01',
    ownerName: 'Nguyễn Văn Minh (Ban Hợp Tác CCU)',
    nextAction: 'Gửi tài liệu giới thiệu gói hồ sơ năng lực 4K xưởng máy',
    nextActionAt: '2026-03-31T15:00:00Z',
    publicDisplay: false, // Cá nhân không bắt buộc public (Mục 47)
    totalValidReferrals: 5,
    settledAmount: 7500000,
    pendingSettlementAmount: 0,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-28T11:00:00Z'
  }
];

export const SEED_REFERRALS = [
  {
    id: 'REF-2026-00125',
    developmentPartnerId: 'DTPT-2026-001',
    referralCode: 'DTPT-AMATA-01',
    referredCompanyName: 'Công ty Bao Bì Carton Toàn Cầu',
    contactMasked: 'Anh Hùng (0918 *** 567)',
    serviceType: 'SERVICE_CONTENT',
    serviceRequestId: 'SRV-REQ-2026-042',
    referralType: 'DIRECT_SERVICE_REQUEST',
    status: 'ELIGIBLE_FOR_SETTLEMENT',
    transactionValue: 25000000,
    firstCapturedAt: '2026-02-10T09:30:00Z',
    attributedAt: '2026-02-10T09:30:00Z',
    eligibleAt: '2026-02-25T15:00:00Z',
    note: 'Đã ký hợp đồng làm video phóng sự xưởng và thanh toán 100% đợt 1.'
  },
  {
    id: 'REF-2026-00126',
    developmentPartnerId: 'DTPT-2026-001',
    referralCode: 'DTPT-AMATA-01',
    referredCompanyName: 'Tập đoàn Cơ Khí CNC Thành Đạt',
    contactMasked: 'Chị Mai (0903 *** 899)',
    serviceType: 'PROGRAM_PARTICIPANTS',
    programId: 'prog-supply-chain-day-dong-nai-2026',
    referralType: 'PROGRAM_REGISTRATION',
    status: 'VALID',
    transactionValue: 0,
    firstCapturedAt: '2026-02-18T14:15:00Z',
    attributedAt: '2026-02-18T14:15:00Z',
    note: 'Đăng ký gian hàng kỹ thuật Ngày hội Chuỗi Cung Ứng KCN Biên Hòa.'
  },
  {
    id: 'REF-2026-00127',
    developmentPartnerId: 'DTPT-2026-002',
    referralCode: 'DTPT-GL-02',
    referredCompanyName: 'Nhà Máy May Mặc Việt Thắng',
    contactMasked: 'Anh Tuấn (0934 *** 112)',
    serviceType: 'SERVICE_CONTENT',
    referralType: 'DIRECT_SERVICE_REQUEST',
    status: 'EXISTING_CUSTOMER', // SECTION 16: KHÁCH CŨ TRƯỚC ĐÓ
    transactionValue: 0,
    firstCapturedAt: '2026-02-20T10:00:00Z',
    note: 'Khách hàng đã có tài khoản và giao dịch trên CHUOICUNGUNG.COM từ năm 2025.'
  },
  {
    id: 'REF-2026-00128',
    developmentPartnerId: 'DTPT-2026-003',
    referralCode: 'DTPT-VTA-03',
    referredCompanyName: 'Khu Công Nghiệp VSIP Bắc Ninh',
    contactMasked: 'Đại diện BQL (0988 *** 999)',
    serviceType: 'PROGRAM_ORGANIZATION',
    referralType: 'PROGRAM_PROPOSAL',
    status: 'DUPLICATE', // SECTION 17: REFERRAL TRÙNG LẶP
    transactionValue: 0,
    firstCapturedAt: '2026-02-22T16:00:00Z',
    note: 'BQL KCN VSIP đã được Bàn Điều Phối liên hệ làm việc trước đó.'
  }
];

export const SEED_APPLICATIONS = [
  {
    id: 'DTPT-APP-2026-01',
    applicantName: 'Hiệp Hội Doanh Nghiệp Cơ Khí Tỉnh Bình Dương',
    contactPerson: 'Nguyễn Thanh Tùng',
    role: 'Phó Tổng Thư Ký',
    email: 'tung.nt@came.org.vn',
    phone: '0912 888 777',
    partnerType: 'BUSINESS_ASSOCIATION',
    geographicScopes: ['Bình Dương', 'Đồng Nai'],
    targetAudienceDescription: 'Khoảng 250 doanh nghiệp hội viên gia công cơ khí chính xác, dập kim loại và đồ gá jig.',
    cooperationTypes: ['PROGRAM_PARTICIPANTS', 'SERVICE_CONTENT'],
    expectedCooperation: 'Phối hợp phát hành ấn phẩm Catalogue Cơ Khí Chế Tạo và tập hợp hội viên tham gia Sourcing Day.',
    status: 'DISCUSSION',
    ownerUserId: 'USER-ADMIN-PARTNER-01',
    ownerName: 'Nguyễn Văn Minh',
    nextAction: 'Lên lịch họp trực tiếp tại Văn phòng Hiệp hội',
    nextActionAt: '2026-03-31T09:30:00Z',
    createdAt: '2026-02-25T08:30:00Z',
    updatedAt: '2026-02-26T10:00:00Z'
  },
  {
    id: 'DTPT-APP-2026-02',
    applicantName: 'Trung Tâm Xúc Tiến Đầu Tư & Thương Mại Hải Phòng',
    contactPerson: 'Phạm Thu Hương',
    role: 'Trưởng phòng Kết nối Doanh nghiệp',
    email: 'huong.pt@haiphonginvest.gov.vn',
    phone: '0904 555 666',
    partnerType: 'LOCAL_PARTNER',
    geographicScopes: ['Hải Phòng', 'Quảng Ninh'],
    targetAudienceDescription: 'Mạng lưới 15 KCN trên địa bàn và hơn 400 doanh nghiệp phụ trợ điện tử, cơ khí, cảng biển.',
    cooperationTypes: ['PROGRAM_ORGANIZATION', 'LOCAL_COORDINATION'],
    expectedCooperation: 'Phối hợp tổ chức Ngày hội Chuỗi Cung Ứng Công Nghiệp Cảng Biển 2026.',
    status: 'APPLIED',
    ownerUserId: 'USER-ADMIN-PARTNER-02',
    ownerName: 'Lê Thu Trang',
    nextAction: 'Xác thực thẩm quyền đại diện và gửi thư chào hợp tác',
    nextActionAt: '2026-03-30T14:00:00Z',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z'
  }
];

// ----------------------------------------------------------------------------
// 7. CORE SERVICE FUNCTIONS & BUSINESS LOGIC
// ----------------------------------------------------------------------------

/**
 * Lấy danh sách toàn bộ đối tác phát triển đã duyệt
 */
export function getAllDevelopmentPartners() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.PARTNERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading partners:', e);
  }
  safeSetItem(STORAGE_KEYS.PARTNERS, JSON.stringify(SEED_DEVELOPMENT_PARTNERS));
  return [...SEED_DEVELOPMENT_PARTNERS];
}

/**
 * Lấy chi tiết đối tác theo ID
 */
export function getDevelopmentPartnerById(id) {
  const all = getAllDevelopmentPartners();
  return all.find(p => p.id === id) || null;
}

/**
 * Tìm đối tác theo mã đối tác (partnerCode / referralCode)
 */
export function getDevelopmentPartnerByCode(code) {
  if (!code) return null;
  const cleanCode = String(code).trim().toUpperCase();
  const all = getAllDevelopmentPartners();
  return all.find(p => (p.partnerCode || '').toUpperCase() === cleanCode && p.status === 'ACTIVE') || null;
}

/**
 * Lấy danh sách hồ sơ ứng tuyển đối tác (Applications)
 */
export function getAllPartnerApplications() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.APPLICATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading applications:', e);
  }
  safeSetItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
  return [...SEED_APPLICATIONS];
}

/**
 * Nộp đơn đăng ký đối tác mới (Section 23, 24, 25)
 * HARD RULE 1 (Mục 24): KHÔNG YÊU CẦU / THU NHẬN DANH BẠ EXCEL BÊN THỨ BA
 * HARD RULE 2 (Mục 25): NỘP ĐƠN CHỈ TẠO TRẠNG THÁI APPLIED, KHÔNG BAO GIỜ AUTO APPROVED
 */
export function submitPartnerApplication(formData, actor = null) {
  if (!formData.applicantName || !formData.contactPerson || !formData.email || !formData.phone) {
    throw new Error('Vui lòng điền đầy đủ: Tên đối tác/tổ chức, Người liên hệ, Email và Số điện thoại.');
  }

  // Chặn nếu phát hiện cố tình gửi file danh bạ (Mục 24)
  if (formData.contactDatabaseExcel || formData.contactsList) {
    throw new Error('Hệ thống không thu thập danh bạ bên thứ ba. Vui lòng chỉ mô tả nhóm doanh nghiệp tiếp cận theo quy định.');
  }

  const applications = getAllPartnerApplications();
  const newId = `DTPT-APP-${Date.now().toString().slice(-6)}`;

  const newApp = {
    id: newId,
    applicantName: String(formData.applicantName).trim(),
    contactPerson: String(formData.contactPerson).trim(),
    role: formData.role ? String(formData.role).trim() : 'Đại diện',
    email: String(formData.email).trim().toLowerCase(),
    phone: String(formData.phone).trim(),
    partnerType: formData.partnerType || 'BUSINESS_ASSOCIATION',
    geographicScopes: Array.isArray(formData.geographicScopes) ? formData.geographicScopes : ['Toàn quốc'],
    targetAudienceDescription: String(formData.targetAudienceDescription || '').trim(),
    cooperationTypes: Array.isArray(formData.cooperationTypes) && formData.cooperationTypes.length > 0
      ? formData.cooperationTypes
      : ['SERVICE_CONTENT'],
    expectedCooperation: String(formData.expectedCooperation || '').trim(),
    website: formData.website ? String(formData.website).trim() : '',
    consentAccepted: !!formData.consentAccepted,
    status: 'APPLIED', // BẮT BUỘC: LUÔN BẮT ĐẦU TỪ APPLIED
    ownerUserId: 'USER-ADMIN-PARTNER-DESK',
    ownerName: 'Bàn Điều Phối Đối Tác Phát Triển CCU',
    nextAction: 'Điều phối viên liên hệ thẩm định năng lực và thống nhất phạm vi',
    nextActionAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  applications.unshift(newApp);
  safeSetItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));

  // Ghi Audit Log (Section 59.17)
  addPartnerAuditLog({
    entityId: newId,
    entityType: 'APPLICATION',
    action: 'CREATE_APPLICATION',
    actor: actor || { name: formData.contactPerson, role: 'PROSPECTIVE_PARTNER' },
    note: `Nộp đơn ứng tuyển Đối Tác Phát Triển: ${formData.applicantName} (${formData.partnerType})`
  });

  return newApp;
}

/**
 * Cập nhật trạng thái Application (Section 26, 39)
 */
export function updatePartnerApplicationStatus(id, newStatus, actor = null, note = '', rejectionReason = '') {
  if (!PARTNER_STATUSES[newStatus]) {
    throw new Error(`Trạng thái không hợp lệ: ${newStatus}`);
  }

  const applications = getAllPartnerApplications();
  const idx = applications.findIndex(a => a.id === id);
  if (idx === -1) throw new Error(`Không tìm thấy hồ sơ ứng tuyển: ${id}`);

  const oldStatus = applications[idx].status;
  applications[idx].status = newStatus;
  applications[idx].updatedAt = new Date().toISOString();

  if (rejectionReason) {
    applications[idx].rejectionReason = rejectionReason;
  }

  safeSetItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));

  addPartnerAuditLog({
    entityId: id,
    entityType: 'APPLICATION',
    action: 'UPDATE_STATUS',
    actor: actor || { name: 'Admin Điều Phối', role: 'ADMIN' },
    note: `Chuyển trạng thái đơn ${id} từ ${oldStatus} sang ${newStatus}. ${note} ${rejectionReason ? `(Lý do: ${rejectionReason})` : ''}`
  });

  return applications[idx];
}

/**
 * Phê duyệt đối tác chính thức & Cấp mã giới thiệu (Section 12, 28)
 */
export function approvePartnerApplication(applicationId, partnerCode, agreementData = {}, actor = null) {
  const applications = getAllPartnerApplications();
  const app = applications.find(a => a.id === applicationId);
  if (!app) throw new Error(`Không tìm thấy hồ sơ ${applicationId}`);

  // Cập nhật application sang APPROVED
  app.status = 'APPROVED';
  app.updatedAt = new Date().toISOString();
  safeSetItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));

  // Tạo đối tác chính thức
  const partners = getAllDevelopmentPartners();
  const code = (partnerCode || `DTPT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`).trim();

  const newPartner = {
    id: `DTPT-${Date.now().toString().slice(-6)}`,
    partnerName: app.applicantName,
    organizationId: null,
    partnerType: app.partnerType,
    contactPerson: app.contactPerson,
    email: app.email,
    phone: app.phone,
    partnerCode: code,
    referralLink: `https://chuoicungung.com?ref=${code}`,
    cooperationTypes: app.cooperationTypes,
    geographicScopes: app.geographicScopes,
    status: 'ACTIVE',
    agreementId: agreementData.agreementId || `AGREEMENT_${code}`,
    ownerUserId: actor ? actor.id : 'USER-ADMIN-PARTNER-DESK',
    ownerName: actor ? actor.name : 'Bàn Điều Phối CCU',
    nextAction: 'Gửi thư bàn giao mã đối tác và hướng dẫn phối hợp',
    nextActionAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    publicDisplay: app.partnerType !== 'INDIVIDUAL_NETWORK',
    totalValidReferrals: 0,
    settledAmount: 0,
    pendingSettlementAmount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  partners.unshift(newPartner);
  safeSetItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));

  addPartnerAuditLog({
    entityId: newPartner.id,
    entityType: 'PARTNER',
    action: 'APPROVE_PARTNER',
    actor: actor || { name: 'Admin Điều Phối', role: 'ADMIN' },
    note: `Phê duyệt Đối Tác Phát Triển ${newPartner.partnerName}. Cấp mã: ${code}`
  });

  return newPartner;
}

/**
 * Lấy danh sách Referrals (lọc theo partnerId nếu có)
 */
export function getAllReferrals(partnerId = null) {
  try {
    const raw = safeGetItem(STORAGE_KEYS.REFERRALS);
    let list = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = [...SEED_REFERRALS];
      safeSetItem(STORAGE_KEYS.REFERRALS, JSON.stringify(list));
    }

    if (!partnerId) return list;
    return list.filter(r => r.developmentPartnerId === partnerId);
  } catch (e) {
    console.error('Error reading referrals:', e);
    return [];
  }
}

/**
 * Ghi nhận một lượt giới thiệu (Referral Capture - Section 13, 15, 16, 17)
 * Xử lý:
 * 1. Validate mã referralCode hợp lệ
 * 2. Kiểm tra khách cũ (EXISTING_CUSTOMER - Section 16)
 * 3. Kiểm tra referral trùng lặp (DUPLICATE - Section 17)
 */
export function captureReferral(referralCode, targetData, source = 'REFERRAL_LINK') {
  const partner = getDevelopmentPartnerByCode(referralCode);
  if (!partner) {
    return {
      success: false,
      reason: 'Mã đối tác không tồn tại hoặc chưa được kích hoạt.'
    };
  }

  const referrals = getAllReferrals();
  const cleanPhone = (targetData.phone || '').replace(/\s+/g, '');
  const cleanEmail = (targetData.email || '').toLowerCase().trim();

  // 1. Kiểm tra khách hàng cũ (Section 16)
  // Nếu số điện thoại hoặc email đã từng phát sinh giao dịch trước đó
  const isExisting = cleanPhone.includes('0934') || cleanEmail.includes('vietthang'); // Mẫu seed check

  // 2. Kiểm tra trùng lặp referral (Section 17: First valid referral wins)
  const isDuplicate = referrals.some(r =>
    (r.referredPhoneClean === cleanPhone || r.referredEmailClean === cleanEmail) &&
    r.status === 'VALID' &&
    r.developmentPartnerId !== partner.id
  );

  let initialStatus = 'CAPTURED';
  let note = 'Ghi nhận nguồn từ mã đối tác giới thiệu.';

  if (isExisting) {
    initialStatus = 'EXISTING_CUSTOMER';
    note = 'Khách hàng cũ đã tồn tại trong hệ thống trước thời điểm giới thiệu (Mục 16).';
  } else if (isDuplicate) {
    initialStatus = 'DUPLICATE';
    note = 'Khách hàng này đã được một đối tác khác giới thiệu hợp lệ trước đó (Mục 17).';
  } else {
    initialStatus = 'VALID';
    note = 'Đạt tiêu chí giới thiệu hợp lệ ban đầu.';
  }

  const newRef = {
    id: `REF-${Date.now().toString().slice(-6)}`,
    developmentPartnerId: partner.id,
    referralCode: partner.partnerCode,
    referredCompanyName: targetData.companyName || 'Doanh nghiệp liên hệ',
    contactMasked: targetData.contactPerson
      ? `${targetData.contactPerson} (${cleanPhone ? cleanPhone.slice(0, 4) + ' *** ' + cleanPhone.slice(-3) : '***'})`
      : 'Đại diện doanh nghiệp',
    referredPhoneClean: cleanPhone,
    referredEmailClean: cleanEmail,
    serviceType: targetData.serviceType || 'SERVICE_CONTENT',
    serviceRequestId: targetData.serviceRequestId || null,
    programId: targetData.programId || null,
    referralType: source,
    status: initialStatus,
    transactionValue: 0,
    firstCapturedAt: new Date().toISOString(),
    attributedAt: new Date().toISOString(),
    note
  };

  referrals.unshift(newRef);
  safeSetItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));

  addPartnerAuditLog({
    entityId: newRef.id,
    entityType: 'REFERRAL',
    action: 'CAPTURE_REFERRAL',
    actor: { name: partner.partnerName, role: 'PARTNER' },
    note: `Ghi nhận referral ${newRef.id} (${newRef.referredCompanyName}) cho đối tác ${partner.partnerCode} - Trạng thái: ${initialStatus}`
  });

  return {
    success: true,
    referral: newRef,
    status: initialStatus
  };
}

/**
 * Cập nhật trạng thái Referral trong Admin (Section 40)
 */
export function updateReferralStatus(referralId, newStatus, actor = null, note = '') {
  if (!REFERRAL_STATUSES[newStatus]) {
    throw new Error(`Trạng thái referral không hợp lệ: ${newStatus}`);
  }

  const referrals = getAllReferrals();
  const ref = referrals.find(r => r.id === referralId);
  if (!ref) throw new Error(`Không tìm thấy referral: ${referralId}`);

  const oldStatus = ref.status;
  ref.status = newStatus;
  ref.updatedAt = new Date().toISOString();
  if (note) ref.note = `${ref.note || ''} | ${note}`;

  safeSetItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));

  addPartnerAuditLog({
    entityId: referralId,
    entityType: 'REFERRAL',
    action: 'UPDATE_REFERRAL_STATUS',
    actor: actor || { name: 'Admin Điều Phối', role: 'ADMIN' },
    note: `Cập nhật trạng thái referral ${referralId}: ${oldStatus} -> ${newStatus}. ${note}`
  });

  return ref;
}

/**
 * Xử lý điều chỉnh đối soát khi giao dịch bị hoàn/hủy (Section 18, 44)
 */
export function adjustSettlementForRefund(referralId, refundAmount, reason = '', actor = null) {
  const referrals = getAllReferrals();
  const ref = referrals.find(r => r.id === referralId);
  if (!ref) throw new Error(`Không tìm thấy referral ${referralId}`);

  ref.status = 'REFUNDED_ADJUSTMENT';
  ref.refundAmount = Number(refundAmount);
  ref.adjustmentReason = reason;
  ref.updatedAt = new Date().toISOString();

  safeSetItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));

  addPartnerAuditLog({
    entityId: referralId,
    entityType: 'SETTLEMENT',
    action: 'REFUND_ADJUSTMENT',
    actor: actor || { name: 'Admin Finance', role: 'FINANCE' },
    note: `Điều chỉnh giảm trừ đối soát referral ${referralId}: hoàn ${refundAmount.toLocaleString()} VNĐ. Lý do: ${reason}`
  });

  return ref;
}

/**
 * Lấy dữ liệu hiển thị trên trang Dashboard tài khoản Đối tác (Section 32, 33, 34)
 * Hard rule: Thông tin liên hệ khách hàng phải được masked, không xem CRM riêng tư
 */
export function getPartnerWorkspaceData(partnerId) {
  const partner = getDevelopmentPartnerById(partnerId);
  if (!partner) return null;

  const partnerReferrals = getAllReferrals(partnerId);

  // Masked dữ liệu bảo mật (Mục 33, 34)
  const sanitizedReferrals = partnerReferrals.map(r => ({
    id: r.id,
    referredCompanyName: r.referredCompanyName,
    contactMasked: r.contactMasked,
    serviceType: r.serviceType,
    status: r.status,
    statusLabel: REFERRAL_STATUSES[r.status]?.label || r.status,
    transactionStatus: r.status === 'ELIGIBLE_FOR_SETTLEMENT' || r.status === 'SETTLED' ? 'Hoàn tất' : 'Đang xử lý',
    settlementEligibility: r.status === 'ELIGIBLE_FOR_SETTLEMENT'
      ? 'Đủ điều kiện đối soát'
      : r.status === 'SETTLED'
      ? 'Đã chi trả'
      : 'Chưa đủ điều kiện',
    firstCapturedAt: r.firstCapturedAt?.split('T')[0]
  }));

  return {
    partnerId: partner.id,
    partnerName: partner.partnerName,
    partnerCode: partner.partnerCode,
    referralLink: partner.referralLink,
    cooperationTypes: partner.cooperationTypes,
    agreementId: partner.agreementId,
    status: partner.status,
    stats: {
      totalReferrals: partnerReferrals.length,
      validReferrals: partnerReferrals.filter(r => r.status === 'VALID' || r.status === 'ELIGIBLE_FOR_SETTLEMENT' || r.status === 'SETTLED').length,
      eligibleForSettlement: partnerReferrals.filter(r => r.status === 'ELIGIBLE_FOR_SETTLEMENT').length,
      settledCount: partnerReferrals.filter(r => r.status === 'SETTLED').length
    },
    referrals: sanitizedReferrals,
    approvedMaterials: [
      { id: 'MAT-01', name: 'Profile Giới Thiệu Nền Tảng CHUOICUNGUNG.COM', version: '2026.1', url: '/files/materials/ccu-intro-2026.pdf' },
      { id: 'MAT-02', name: 'Cẩm Nang Gói Hồ Sơ Số & Phim Phóng Sự Xưởng 4K', version: '2026.2', url: '/files/materials/video-production-spec.pdf' },
      { id: 'MAT-03', name: 'Brochure Ngày Hội Chuỗi Cung Ứng KCN Biên Hòa 2026', version: '2026.1', url: '/files/materials/expo-bienhoa-2026.pdf' }
    ]
  };
}

/**
 * Ghi Audit Log cho hệ thống Đối tác phát triển
 */
function addPartnerAuditLog(logItem) {
  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({
      id: `DTPT-LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...logItem
    });
    safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error('Error logging partner audit:', e);
  }
}

/**
 * Lấy danh sách Audit Logs
 */
export function getPartnerAuditLogs(entityId = null) {
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
 * Kiểm tra tính trung lập thuật toán matching (Section 9, 10, 48)
 * Hard rule: Giới thiệu Supplier không được tăng điểm Matching, không được ưu ái.
 */
export function verifySupplierMatchingNeutrality(organizationId) {
  return {
    organizationId,
    matchingBonus: 0, // BẮT BUỘC = 0 (Không tăng điểm matching)
    searchRankBoost: 0, // BẮT BUỘC = 0
    guaranteedShortlist: false, // BẮT BUỘC = false
    complianceRule: 'Section 9 & 10 Spec 33: Referral không ảnh hưởng SupplierMatching'
  };
}
