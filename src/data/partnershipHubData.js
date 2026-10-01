// ============================================================================
// PARTNERSHIP HUB & FINANCE SEPARATION DATA SERVICE
// PAGE 37: HỢP TÁC HỆ SINH THÁI (/hop-tac) & ADMIN (/admin/hop-tac)
// Chuẩn hóa theo spec 37.txt (Section 1-76) - CHUOICUNGUNG.COM
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
  PARTNERSHIP_INQUIRIES: 'ccu_partnership_inquiries_v1',
  FINANCE_LEDGER: 'ccu_finance_ledger_v1',
  AUDIT_LOGS: 'ccu_partnership_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. 7 CORE PARTNERSHIP CATEGORIES (SECTIONS 3 TO 20, 52)
// ----------------------------------------------------------------------------
export const PARTNERSHIP_CATEGORIES = [
  {
    id: 'ASSOCIATION',
    code: 'PT-01',
    title: 'HỘI / HIỆP HỘI',
    name: 'Hội & Hiệp Hội Ngành Nghề',
    enName: 'Industry Association',
    contribution: 'Bảo trợ chuyên môn, xác thực năng lực hội viên, đồng tổ chức sự kiện kết nối cung ứng.',
    scope: 'Theo chuyên ngành (Cơ khí, Dệt may, Điện tử, Da giày, Logistics, Thực phẩm...).',
    workflow: 'Đề xuất chương trình kết nối B2B hoặc xác thực mạng lưới hội viên.',
    targetRoute: '/dich-vu/to-chuc-ket-noi?source=partnership&partnerType=association',
    secondaryRoute: '/hoi-hiep-hoi',
    primaryCtaText: 'Đề xuất chương trình cho hội viên',
    secondaryCtaText: 'Xem hệ sinh thái Hội / Hiệp hội',
    financeType: 'NON_COMMERCIAL_ALLIANCE',
    allowedActions: [
      'Phối hợp chương trình giao thương cho hội viên',
      'Hỗ trợ thu nhận nhu cầu mua sắm được phép chia sẻ',
      'Giới thiệu hồ sơ năng lực xưởng tiêu biểu',
      'Theo dõi kết quả trong phạm vi thỏa thuận'
    ],
    hardRule: 'Việc một Hội đăng ký hợp tác KHÔNG tự động biến doanh nghiệp thành hội viên chính thức hoặc tạo quyền xem private Buyer data.'
  },
  {
    id: 'INDUSTRIAL_PARK',
    code: 'PT-02',
    title: 'KHU CÔNG NGHIỆP',
    name: 'Chủ Đầu Tư & BQL Khu Công Nghiệp',
    enName: 'Industrial Park Developer / Operator',
    contribution: 'Mặt bằng tổ chức sự kiện, kết nối 14.200+ nhà máy FDI, phối hợp chính quyền địa phương.',
    scope: 'Theo địa bàn KCN / Cụm công nghiệp tại các vùng kinh tế trọng điểm.',
    workflow: 'Đề xuất tổ chức Sourcing Day tại KCN hoặc khảo sát hạ tầng phụ trợ.',
    targetRoute: '/dich-vu/to-chuc-ket-noi?source=partnership&partnerType=industrial-park',
    secondaryRoute: '/khu-cong-nghiep',
    primaryCtaText: 'Đề xuất chương trình tại KCN',
    secondaryCtaText: 'Xem danh bạ Khu công nghiệp',
    financeType: 'NON_COMMERCIAL_ALLIANCE',
    allowedActions: [
      'Phối hợp chương trình kết nối theo địa bàn',
      'Thu nhận nhu cầu tìm nhà cung ứng của nhà máy FDI',
      'Tổ chức hoạt động tham quan thực địa nhà máy',
      'Cung cấp thông tin quỹ đất & hạ tầng cho nhà đầu tư'
    ],
    hardRule: 'Tiếp tục phân biệt State Management, Developer, Operator, Program Contact. Đăng ký không tự biến Organization thành Ban quản lý hay độc quyền KCN.'
  },
  {
    id: 'SPONSOR',
    code: 'PT-03',
    title: 'NHÀ TÀI TRỢ',
    name: 'Nhà Tài Trợ & Đồng Hành Sự Kiện',
    enName: 'Event & Activity Sponsor',
    contribution: 'Ngân sách tài trợ, hiện vật (quà tặng, ấn phẩm, thiết bị, địa điểm, dịch vụ truyền thông).',
    scope: 'Theo từng kỳ Ngày hội Chuỗi Cung Ứng, kỷ yếu Catalogue, thư viện ảnh/video, vật phẩm.',
    workflow: 'Hợp đồng tài trợ thương mại với danh mục quyền lợi đối soát (Entitlements Delivery).',
    targetRoute: '/tai-tro',
    secondaryRoute: '/chuong-trinh',
    primaryCtaText: 'Gửi đề xuất tài trợ',
    secondaryCtaText: 'Xem các chương trình sắp diễn ra',
    financeType: 'SPONSORSHIP_REVENUE',
    allowedActions: [
      'Đồng hành cùng Ngày hội Chuỗi Cung Ứng & Sourcing Day',
      'Tài trợ kỷ yếu Catalogue ngành phát hành 1.000+ bản',
      'Tài trợ vật phẩm, túi quà, kỷ niệm chương đại biểu',
      'Bảo trợ sản xuất video phóng sự xưởng 4K'
    ],
    hardRule: 'Sponsor ≠ Investor ≠ Shareholder ≠ Founding Partner mặc định ≠ Verified Supplier ≠ Matching priority. Không tăng điểm thuật toán.'
  },
  {
    id: 'FOUNDING_PARTNER',
    code: 'PT-04',
    title: 'FOUNDING PARTNER — ĐỐI TÁC TIÊN PHONG CHUYÊN MỤC',
    name: 'Đối Tác Đồng Hành Sáng Lập',
    enName: 'Category Founding Partner',
    contribution: 'Bảo trợ thương mại dài hạn cho một chuyên mục ngành hoặc cụm từ khóa cung ứng.',
    scope: 'Độc quyền hiển thị 01 thương hiệu đại diện cho 01 Chuyên Mục Ngành hoặc Cụm Từ Khóa có thời hạn.',
    workflow: 'Hợp đồng Founding Partner thương mại, cam kết deliverables và báo cáo hiển thị.',
    targetRoute: '/founding-partner',
    secondaryRoute: '/danh-muc',
    primaryCtaText: 'Trao đổi phạm vi đồng hành',
    secondaryCtaText: 'Xem chính sách Founding Partner',
    financeType: 'FOUNDING_PARTNER_REVENUE',
    allowedActions: [
      'Hiện diện độc quyền banner nhận diện chuyên mục',
      'Top placement được gắn nhãn minh bạch "Đối tác tiên phong"',
      'Bộ hồ sơ năng lực chuẩn hóa & video xưởng 4K',
      'Đặc quyền tham gia các phiên giao thương trọng điểm'
    ],
    hardRule: 'Founding Partner là COMMERCIAL PACKAGE, không phải cổ đông, không nhận equity, không ảnh hưởng kết quả tìm kiếm tự nhiên của nhà cung ứng.'
  },
  {
    id: 'DEVELOPMENT_PARTNER',
    code: 'PT-05',
    title: 'ĐỐI TÁC PHÁT TRIỂN',
    name: 'Đối Tác Phát Triển / B2B Referral',
    enName: 'Business Development Partner',
    contribution: 'Mạng lưới quan hệ doanh nghiệp, giới thiệu khách dùng dịch vụ, điều phối địa phương.',
    scope: 'Giới thiệu dịch vụ chuẩn hóa hồ sơ, video xưởng, quà tặng B2B, phát triển đoàn doanh nghiệp tham dự sự kiện.',
    workflow: 'Cấp mã Partner Code, theo dõi lượt giới thiệu, đối soát hoa hồng sau khi giao dịch hoàn tất.',
    targetRoute: '/doi-tac-phat-trien',
    secondaryRoute: '/dich-vu',
    primaryCtaText: 'Đăng ký trao đổi hợp tác',
    secondaryCtaText: 'Xem cơ chế đối tác phát triển',
    financeType: 'PARTNER_COMMISSION',
    allowedActions: [
      'Giới thiệu khách hàng có nhu cầu làm hồ sơ, video, quà tặng B2B',
      'Tập hợp nhóm doanh nghiệp tham dự Ngày hội Chuỗi Cung Ứng',
      'Phối hợp điều phối hoạt động tại địa phương',
      'Hưởng đối soát phát triển thị trường theo quy chế minh bạch'
    ],
    hardRule: 'Development Partner ≠ Affiliate MLM đa tầng, không bán danh bạ contact thô, không tính hoa hồng khi giao dịch bị hoàn hủy.'
  },
  {
    id: 'ADVISOR',
    code: 'PT-06',
    title: 'CỐ VẤN',
    name: 'Chuyên Gia & Cố Vấn Chuyên Môn',
    enName: 'Expert Advisor / Council',
    contribution: 'Tri thức chuyên sâu, kinh nghiệm quản trị nhà máy, tiêu chuẩn kỹ thuật & kiểm định chất lượng.',
    scope: 'Taxonomy review, Schema review, Tiêu chí năng lực xưởng, Hội đồng tuyển chọn Sourcing Dossier.',
    workflow: 'Quy trình tiếp nhận đề xuất cố vấn -> Phỏng vấn chuyên môn -> Ký xác nhận phạm vi cố vấn (Scope-based).',
    targetRoute: '/hop-tac',
    secondaryRoute: null,
    primaryCtaText: 'Trao đổi vai trò cố vấn',
    secondaryCtaText: null,
    financeType: 'EXPERT_HONORARIUM',
    allowedActions: [
      'Phản biện và chuẩn hóa danh mục phân loại ngành nghề',
      'Đóng góp tiêu chuẩn kỹ thuật cho bộ hồ sơ tuyển chọn Dossier',
      'Cố vấn nội dung các phiên hội thảo chuyên đề B2B',
      'Tham gia hội đồng thẩm định năng lực nhà cung ứng'
    ],
    hardRule: 'Advisor được duyệt không có nghĩa nền tảng bảo trợ toàn bộ đơn vị công tác của họ. Quyền truy cập tuân thủ nguyên tắc Least Privilege, không xem dữ liệu mua hàng mật.'
  },
  {
    id: 'INVESTOR',
    code: 'PT-07',
    title: 'NHÀ ĐẦU TƯ',
    name: 'Nhà Đầu Tư Chiến Lược',
    enName: 'Strategic Investor',
    contribution: 'Nguồn vốn tài chính mở rộng hạ tầng số, mạng lưới kết nối quốc tế, kinh nghiệm mở rộng quy mô.',
    scope: 'Đầu tư phát triển nền tảng công nghệ, mở rộng dữ liệu 480 KCN và giải pháp đối soát chuỗi cung ứng.',
    workflow: 'Tiếp nhận thư quan tâm (Investor Inquiry) -> Trao đổi bảo mật 1:1 -> Thỏa thuận đầu tư riêng biệt.',
    targetRoute: '/hop-tac',
    secondaryRoute: null,
    primaryCtaText: 'Đăng ký trao đổi đầu tư',
    secondaryCtaText: null,
    financeType: 'INVESTMENT_CAPITAL', // BẮT BUỘC: KHÔNG PHẢI DOANH THU (Section 48, 56)
    allowedActions: [
      'Đề xuất hợp tác nguồn vốn phát triển hạ tầng số',
      'Trao đổi chiến lược mở rộng thị trường khu vực',
      'Hợp tác thu xếp vốn tín dụng chuỗi cung ứng'
    ],
    hardRule: 'INVESTMENT ≠ SPONSORSHIP. Vốn đầu tư vào doanh nghiệp KHÔNG PHẢI là doanh thu bán hàng. Không tự nhận vị trí tài trợ thương mại.'
  }
];

// ----------------------------------------------------------------------------
// 2. 8 CHUẨN MỰC PHÂN TÁCH TÀI CHÍNH MINH BẠCH (SECTION 25, 56, 61)
// ----------------------------------------------------------------------------
export const FINANCE_CLASSIFICATIONS = {
  SERVICE_REVENUE: {
    code: 'FIN-01',
    name: 'Doanh Thu Dịch Vụ B2B (Service Revenue)',
    isRevenue: true,
    description: 'Nguồn thu từ dịch vụ chuẩn hóa hồ sơ năng lực, quay video xưởng, sản xuất vật phẩm sự kiện, hiện diện từ xa.'
  },
  SPONSORSHIP_REVENUE: {
    code: 'FIN-02',
    name: 'Doanh Thu Tài Trợ (Sponsorship Revenue)',
    isRevenue: true,
    description: 'Nguồn thu từ các gói tài trợ ngày hội, tài trợ ấn phẩm Catalogue ngành có hợp đồng và nghiệm thu quyền lợi.'
  },
  FOUNDING_PARTNER_REVENUE: {
    code: 'FIN-03',
    name: 'Doanh Thu Đối Tác Sáng Lập (Founding Partner Revenue)',
    isRevenue: true,
    description: 'Doanh thu thương mại từ hợp đồng đồng hành chuyên mục ngành hoặc cụm từ khóa có thời hạn.'
  },
  INVESTMENT_CAPITAL: {
    code: 'FIN-04',
    name: 'Vốn Đầu Tư / Cổ Phần (Investment Capital)',
    isRevenue: false, // BẮT BUỘC: KHÔNG ĐƯỢC TÍNH LÀ DOANH THU
    description: 'Vốn góp đầu tư phát triển nền tảng hoặc cổ phần hóa. Hạch toán nguồn vốn chủ sở hữu, không tính vào doanh thu bán hàng.'
  },
  LOAN: {
    code: 'FIN-05',
    name: 'Khoản Vay / Nợ Phải Trả (Loan)',
    isRevenue: false,
    description: 'Nguồn vốn vay thương mại hoặc tín dụng dự án. Hạch toán nghĩa vụ nợ phải trả.'
  },
  COLLECTED_ON_BEHALF: {
    code: 'FIN-06',
    name: 'Thu Hộ / Chi Hộ (Collected On Behalf)',
    isRevenue: false,
    description: 'Các khoản thu hộ vé tham quan, chi hộ phí khách sạn sự kiện cho đại biểu, không ghi nhận doanh thu thuần.'
  },
  PARTNER_COMMISSION: {
    code: 'FIN-07',
    name: 'Chi Phí Hoa Hồng / Phát Triển Thị Trường (Partner Commission)',
    isRevenue: false,
    isExpense: true,
    description: 'Chi phí đối soát trả cho Đối tác Phát triển khi có giao dịch thương mại hợp lệ được nghiệm thu.'
  },
  REFUND: {
    code: 'FIN-08',
    name: 'Khoản Hoàn Tiền / Giảm Trừ Doanh Thu (Refund)',
    isRevenue: false,
    isDeduction: true,
    description: 'Khoản hoàn trả cho khách hàng khi hủy dịch vụ hoặc sự kiện bị hủy theo quy chế bảo lưu.'
  }
};

// ----------------------------------------------------------------------------
// 3. SEED PARTNERSHIP INQUIRIES & AUDIT LOGS
// ----------------------------------------------------------------------------
export const SEED_PARTNERSHIP_INQUIRIES = [
  {
    id: 'HT-2026-00101',
    publicCode: 'HT-2026-00101',
    category: 'INVESTOR',
    categoryName: 'Nhà Đầu Tư Chiến Lược',
    organizationName: 'Quỹ Đầu Tư Hạ Tầng Công Nghiệp Việt - Nhật (VJIF)',
    legalName: 'VIET JAPAN INDUSTRIAL INFRASTRUCTURE FUND',
    representativeName: 'Kenji Takahashi',
    roleTitle: 'Giám Đốc Đầu Tư Vùng Đông Nam Á',
    email: 'takahashi.k@vjif-capital.jp',
    phone: '0908 123 456',
    proposalScope: 'Đề xuất tài trợ vốn phát triển hệ thống bản đồ số GIS kết nối 480 KCN và nền tảng đối soát tự động.',
    financeClassification: 'INVESTMENT_CAPITAL',
    isRevenue: false, // HARD RULE (Section 48, 56)
    status: 'UNDER_REVIEW', // NEW | NEED_MORE_INFO | UNDER_REVIEW | DISCUSSION | SCOPE_DEFINITION | AGREEMENT_PENDING | ACCEPTED | ACTIVE | PAUSED | COMPLETED | DECLINED | CANCELLED
    ownerUserId: 'coordinator_investor',
    nextAction: 'Lên lịch họp trực tuyến trao đổi thư bày tỏ quan tâm (Letter of Intent)',
    nextActionAt: '2026-10-05T09:00:00Z',
    submittedAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-21T08:30:00Z',
    consentOperational: true,
    consentMarketing: false
  },
  {
    id: 'HT-2026-00102',
    publicCode: 'HT-2026-00102',
    category: 'ASSOCIATION',
    categoryName: 'Hội & Hiệp Hội Ngành Nghề',
    organizationName: 'Hiệp Hội Doanh Nghiệp Điện Tử Việt Nam (VEIA)',
    legalName: 'HIỆP HỘI DOANH NGHIỆP ĐIỆN TỬ VIỆT NAM',
    representativeName: 'Bà Đỗ Thị Thúy Hương',
    roleTitle: 'Ủy viên Ban Chấp Hành',
    email: 'info@veia.org.vn',
    phone: '024 3762 9999',
    proposalScope: 'Phối hợp tổ chức phiên kết nối nhà cung ứng linh kiện SMT tại Ngày hội Chuỗi Cung Ứng KCN Bắc Ninh.',
    financeClassification: 'NON_COMMERCIAL_ALLIANCE',
    isRevenue: false,
    status: 'ACTIVE',
    ownerUserId: 'coordinator_association',
    nextAction: 'Gửi danh mục hội viên đăng ký phiên kết nối 1:1 cho Ban thư ký',
    nextActionAt: '2026-10-10T14:00:00Z',
    submittedAt: '2026-09-22T14:30:00Z',
    updatedAt: '2026-09-25T11:00:00Z',
    consentOperational: true,
    consentMarketing: true
  },
  {
    id: 'HT-2026-00103',
    publicCode: 'HT-2026-00103',
    category: 'ADVISOR',
    categoryName: 'Chuyên Gia & Cố Vấn Chuyên Môn',
    organizationName: 'Viện Năng Suất Chất Lượng Việt Nam (VPQI)',
    legalName: 'VIỆN NĂNG SUẤT CHẤT LƯỢNG VIỆT NAM',
    representativeName: 'TS. Nguyễn Hữu Dũng',
    roleTitle: 'Chuyên gia Trưởng Cố vấn Chuỗi',
    email: 'dung.nh@vpqi.gov.vn',
    phone: '0912 345 678',
    proposalScope: 'Tham gia hội đồng cố vấn xây dựng tiêu chí kỹ thuật và quy trình đánh giá rủi ro cho bộ hồ sơ Sourcing Dossier.',
    financeClassification: 'EXPERT_HONORARIUM',
    isRevenue: false,
    status: 'SCOPE_DEFINITION',
    ownerUserId: 'coordinator_technical',
    nextAction: 'Ký thỏa thuận phạm vi cố vấn (Advisor Engagement Scope) và bảo mật thông tin NDA',
    nextActionAt: '2026-10-02T10:00:00Z',
    submittedAt: '2026-09-26T09:00:00Z',
    updatedAt: '2026-09-27T16:00:00Z',
    consentOperational: true,
    consentMarketing: false
  }
];

// ----------------------------------------------------------------------------
// 4. PARTNERSHIP OPERATIONS & VALIDATION
// ----------------------------------------------------------------------------

export function getAllPartnershipInquiries() {
  const saved = safeGetItem(STORAGE_KEYS.PARTNERSHIP_INQUIRIES);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const ids = new Set(SEED_PARTNERSHIP_INQUIRIES.map(i => i.id));
      const combined = [...SEED_PARTNERSHIP_INQUIRIES];
      parsed.forEach(item => {
        if (!ids.has(item.id)) combined.unshift(item);
      });
      return combined;
    } catch (e) {}
  }
  return SEED_PARTNERSHIP_INQUIRIES;
}

export function saveAllPartnershipInquiries(list) {
  safeSetItem(STORAGE_KEYS.PARTNERSHIP_INQUIRIES, JSON.stringify(list));
}

/**
 * Kiểm tra trùng lặp đề xuất hợp tác (Section 59)
 * Không block nếu cùng Organization nhưng khác hình thức hợp tác (VD: vừa Sponsor vừa Investor).
 */
export function checkDuplicatePartnershipInquiry(orgName, categoryId) {
  if (!orgName) return { isDuplicate: false };
  const all = getAllPartnershipInquiries();
  const cleanOrg = orgName.toLowerCase().trim();

  const found = all.find(item => {
    const itemOrg = (item.organizationName || '').toLowerCase().trim();
    return itemOrg === cleanOrg && item.category === categoryId && item.status !== 'CANCELLED' && item.status !== 'DECLINED';
  });

  if (found) {
    return {
      isDuplicate: true,
      existingRecord: found,
      message: `Đơn vị "${orgName}" đã có đề xuất hợp tác cho hạng mục này (Mã: ${found.publicCode}) đang trong trạng thái xử lý.`
    };
  }

  return { isDuplicate: false };
}

/**
 * Tiếp nhận đề xuất hợp tác từ /hop-tac
 * HARD RULE (Section 37, 52): Form submit CHỈ tạo inquiry/request ở trạng thái RECEIVED.
 * Tuyệt đối KHÔNG auto-confirm partner.
 */
export function submitPartnershipInquiry(formData) {
  if (!formData.organizationName || !formData.representativeName || !formData.phone || !formData.email) {
    return { success: false, message: 'Vui lòng điền đầy đủ các trường bắt buộc (Tổ chức, Người đại diện, Email, SĐT).' };
  }

  if (!formData.consentOperational) {
    return { success: false, message: 'Vui lòng xác nhận đồng ý với quy chế bảo mật và điều khoản tiếp nhận đề xuất B2B.' };
  }

  const category = PARTNERSHIP_CATEGORIES.find(c => c.id === formData.category) || PARTNERSHIP_CATEGORIES[0];
  
  // Kiểm tra trùng lặp
  const dupCheck = checkDuplicatePartnershipInquiry(formData.organizationName, category.id);
  if (dupCheck.isDuplicate) {
    return { success: false, message: dupCheck.message };
  }

  // Xác định rõ phân loại tài chính (Section 25, 48, 56)
  const isInvestor = category.id === 'INVESTOR';
  const financeClassification = isInvestor ? 'INVESTMENT_CAPITAL' : (
    category.id === 'SPONSOR' ? 'SPONSORSHIP_REVENUE' : (
      category.id === 'FOUNDING_PARTNER' ? 'FOUNDING_PARTNER_REVENUE' : (
        category.id === 'DEVELOPMENT_PARTNER' ? 'PARTNER_COMMISSION' : (
          category.id === 'ADVISOR' ? 'EXPERT_HONORARIUM' : 'NON_COMMERCIAL_ALLIANCE'
        )
      )
    )
  );

  const newId = `HT-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
  const now = new Date();
  const nextTarget = new Date(now.getTime() + 48 * 3600 * 1000); // 48 giờ làm việc

  const newInquiry = {
    id: newId,
    publicCode: newId,
    category: category.id,
    categoryName: category.name,
    organizationName: formData.organizationName.trim(),
    representativeName: formData.representativeName.trim(),
    roleTitle: (formData.roleTitle || 'Đại diện hợp tác').trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    proposalScope: (formData.proposalScope || '').trim(),
    financeClassification,
    isRevenue: !isInvestor && (financeClassification === 'SPONSORSHIP_REVENUE' || financeClassification === 'FOUNDING_PARTNER_REVENUE'),
    status: 'RECEIVED', // BẮT BUỘC (Section 37): Ban đầu chỉ ở trạng thái RECEIVED, chờ admin thẩm định
    ownerUserId: 'coordinator_partnership', // Section 58: Mọi active request phải có owner
    nextAction: 'Thẩm định hồ sơ năng lực & liên hệ trao đổi phạm vi hợp tác',
    nextActionAt: nextTarget.toISOString(),
    submittedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    sourceContext: {
      sourcePage: '/hop-tac',
      partnershipType: category.id
    },
    consentOperational: !!formData.consentOperational,
    consentMarketing: !!formData.consentMarketing
  };

  const list = getAllPartnershipInquiries();
  list.unshift(newInquiry);
  saveAllPartnershipInquiries(list);

  logPartnershipAudit({
    action: 'PARTNERSHIP_INQUIRY_RECEIVED',
    inquiryId: newId,
    actor: formData.representativeName,
    details: `Tiếp nhận đề xuất hợp tác [${category.name}] từ ${formData.organizationName}. Phân loại tài chính: ${financeClassification}. Gán người phụ trách: coordinator_partnership.`
  });

  return {
    success: true,
    trackingCode: newId,
    inquiry: newInquiry,
    message: 'Đề xuất hợp tác đã được tiếp nhận thành công. Ban Thư Ký sẽ thẩm định và phản hồi trong vòng 24–48 giờ làm việc.'
  };
}

/**
 * Cập nhật trạng thái đề xuất hợp tác trong Admin (Section 55, 56)
 */
export function updatePartnershipRequestStatus(id, newStatus, { ownerUserId = null, nextAction = null, nextActionAt = null, note = '', adminUser = 'Admin Lead' } = {}) {
  const list = getAllPartnershipInquiries();
  const idx = list.findIndex(item => item.id === id || item.publicCode === id);
  if (idx < 0) return { success: false, message: 'Không tìm thấy hồ sơ' };

  const current = list[idx];
  const oldStatus = current.status;
  current.status = newStatus;
  current.updatedAt = new Date().toISOString();
  if (ownerUserId) current.ownerUserId = ownerUserId;
  if (nextAction) current.nextAction = nextAction;
  if (nextActionAt) current.nextActionAt = nextActionAt;
  if (note) current.adminNote = note;

  list[idx] = current;
  saveAllPartnershipInquiries(list);

  logPartnershipAudit({
    action: 'STATUS_UPDATED',
    inquiryId: current.id,
    actor: adminUser,
    details: `Chuyển trạng thái đề xuất [${current.publicCode}] từ ${oldStatus} sang ${newStatus}. Ghi chú: ${note || 'Cập nhật tiến độ thẩm định.'}`
  });

  return { success: true, inquiry: current };
}

export function getAllPartnershipAuditLogs() {
  const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [];
}

export function logPartnershipAudit({ action, inquiryId, actor = 'System', details = '' }) {
  const logs = getAllPartnershipAuditLogs();
  logs.unshift({
    id: `AUDIT-HT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    inquiryId,
    actor,
    timestamp: new Date().toISOString(),
    details
  });
  safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 150)));
}

/**
 * Kiểm định độc lập: Không được tính Vốn đầu tư vào Doanh thu bán hàng (Section 25, 48, 56, 81)
 */
export function verifyFinanceSeparationRule() {
  const investorCategory = PARTNERSHIP_CATEGORIES.find(c => c.id === 'INVESTOR');
  const investorFinance = FINANCE_CLASSIFICATIONS.INVESTMENT_CAPITAL;
  
  return {
    investorIsRevenue: investorFinance.isRevenue, // Must be false
    investorCategoryFinanceType: investorCategory.financeType,
    ruleEnforced: investorFinance.isRevenue === false,
    message: 'Quy tắc phân tách tài chính: Vốn đầu tư (INVESTMENT_CAPITAL) không được ghi nhận vào doanh thu thương mại.'
  };
}
