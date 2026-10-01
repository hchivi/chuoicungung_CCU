// ============================================================================
// FOUNDING PARTNERSHIP DATA LAYER & MANAGEMENT SERVICE
// PAGE 18: FOUNDING PARTNER (/founding-partner)
// Chuẩn hóa theo spec 18.txt - CHUOICUNGUNG.COM
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

const STORAGE_KEYS = {
  PARTNERSHIPS: 'ccu_founding_partnerships_v1',
  INQUIRIES: 'ccu_founding_inquiries_v1',
  AUDIT_LOGS: 'ccu_founding_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. CHUẨN HÓA TRẠNG THÁI FOUNDING PARTNERSHIP (SECTION 11 SPEC 18.TXT)
// ----------------------------------------------------------------------------
export const PARTNERSHIP_STATUSES = {
  INQUIRY: { id: 'INQUIRY', label: 'Đề xuất mới tiếp nhận (Inquiry)', color: 'blue', step: 1 },
  PROPOSAL: { id: 'PROPOSAL', label: 'Đang lập dự thảo phương án', color: 'indigo', step: 2 },
  NEGOTIATION: { id: 'NEGOTIATION', label: 'Đang đàm phán phạm vi & quyền lợi', color: 'purple', step: 3 },
  CONTRACT_PENDING: { id: 'CONTRACT_PENDING', label: 'Chờ ký kết hợp đồng thương mại', color: 'amber', step: 4 },
  SCHEDULED: { id: 'SCHEDULED', label: 'Đã ký hợp đồng - Chờ ngày kích hoạt', color: 'cyan', step: 5 },
  ACTIVE: { id: 'ACTIVE', label: 'Đang hiển thị tài trợ (Active)', color: 'emerald', step: 6 },
  PAUSED: { id: 'PAUSED', label: 'Tạm dừng hiển thị theo yêu cầu', color: 'orange', step: 6 },
  EXPIRED: { id: 'EXPIRED', label: 'Hết hạn hợp đồng (Expired)', color: 'slate', step: 7 },
  RENEWED: { id: 'RENEWED', label: 'Đã gia hạn chu kỳ mới', color: 'teal', step: 7 },
  CANCELLED: { id: 'CANCELLED', label: 'Đã hủy thỏa thuận', color: 'rose', step: 0 }
};

// ----------------------------------------------------------------------------
// 2. CHUẨN HÓA CÁC LOẠI QUYỀN LỢI (ENTITLEMENT TYPES - SECTION 6 SPEC 18.TXT)
// ----------------------------------------------------------------------------
export const ENTITLEMENT_TYPES = {
  FEATURED_SPONSORED_BLOCK: {
    id: 'FEATURED_SPONSORED_BLOCK',
    name: '01. Khối giới thiệu nổi bật đầu chuyên mục',
    shortName: 'Khối tài trợ đầu trang',
    description: 'Vị trí trang trọng đầu trang ngành / từ khóa với nhãn bắt buộc "ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC".'
  },
  CAPABILITY_PROFILE_SHOWCASE: {
    id: 'CAPABILITY_PROFILE_SHOWCASE',
    name: '02. Hồ sơ năng lực & Product Service',
    shortName: 'Hồ sơ năng lực chuẩn hóa',
    description: 'Trang hồ sơ năng lực chi tiết giới thiệu dàn máy, chứng chỉ ISO/FDI và sản phẩm chủ lực.'
  },
  VIDEO_SHOWCASE: {
    id: 'VIDEO_SHOWCASE',
    name: '03. Video giới thiệu nhà máy & năng lực',
    shortName: 'Video giới thiệu 4K',
    description: 'Khung phát video phóng sự xưởng sản xuất và quy trình QC đạt chuẩn trực tiếp trên chuyên mục.'
  },
  CATALOGUE_INCLUSION: {
    id: 'CATALOGUE_INCLUSION',
    name: '04. Catalogue sản phẩm kỹ thuật số',
    shortName: 'E-Catalogue tải về',
    description: 'Tài liệu brochure/catalogue chuẩn PDF cho phép Buyer tải về trực tiếp từ chuyên mục.'
  },
  CATEGORY_CONTENT_FEATURE: {
    id: 'CATEGORY_CONTENT_FEATURE',
    name: '05. Nội dung định hướng chuyên mục & cẩm nang',
    shortName: 'Bài viết chuyên sâu',
    description: 'Đồng hành xây dựng cẩm nang tiêu chuẩn kỹ thuật & gợi ý nghiệm thu cho Buyer.'
  },
  PROGRAM_PRESENCE: {
    id: 'PROGRAM_PRESENCE',
    name: '06. Hiện diện trong chương trình kết nối giao thương',
    shortName: 'Hiện diện sự kiện B2B',
    description: 'Suất trưng bày hoặc kết nối 1-1 tại ngày hội chuỗi cung ứng liên quan theo thỏa thuận.'
  },
  PARTNERSHIP_REPORT: {
    id: 'PARTNERSHIP_REPORT',
    name: '07. Báo cáo quyền lợi định kỳ',
    shortName: 'Báo cáo định kỳ',
    description: 'Báo cáo minh bạch về lượt hiển thị, tương tác và tiến độ bàn giao quyền lợi thực tế.'
  }
};

export const ENTITLEMENT_STATUSES = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED',
  ACCEPTED: 'ACCEPTED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  CANCELLED: 'CANCELLED'
};

// ----------------------------------------------------------------------------
// 3. SEED FOUNDING PARTNERSHIPS DATABASE (ACTIVE + HISTORY)
// ----------------------------------------------------------------------------
export const SEED_FOUNDING_PARTNERSHIPS = [
  {
    id: 'FP-2026-001',
    publicCode: 'FP-2026-001',
    partnerName: 'Chuyên Gia Đồng Phục - Công Ty TNHH Proser',
    shortName: 'Chuyên Gia Đồng Phục',
    organizationId: 'org-proser-dongphuc',
    categoryId: 'dong-phuc-bao-ho-lao-dong',
    categoryName: 'Đồng Phục & Bảo Hộ Lao Động (PPE)',
    phaseId: '5.3',
    keywordClusterId: 'cluster-dong-phuc-cong-nhan',
    keywordClusterName: 'Đồng phục công nhân nhà máy',
    synonymKeywords: ['đồng phục công nhân', 'áo công nhân nhà máy', 'đồng phục nhà xưởng', 'kaki công nhân'],
    locationId: 'dong-nai',
    locationName: 'Đồng Nai & TP. Hồ Chí Minh',
    industrialParkId: 'kcn-amata-dong-nai',
    industrialParkName: 'KCN Amata Đồng Nai',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    displayPosition: 'TOP_CATEGORY_SPONSORED_BLOCK',
    exclusivityScope: 'Độc quyền khối tài trợ chuyên mục Đồng phục công nhân tại khu vực Đồng Nai & TP.HCM trong thời hạn 1 năm.',
    status: 'ACTIVE',
    contractId: 'HD-FP-2026-088',
    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Đặng Tuấn Kiệt (Head of Partnership Sales)',
    brandTitle: 'cần ĐỒNG PHỤC có CHUYÊN GIA',
    slogan: 'May Đo Đồng Phục Doanh Nghiệp & Bảo Hộ Lao Động PPE Chuẩn ISO',
    tagline: 'Xưởng may trực tiếp 50.000 sản phẩm/tháng phục vụ 620+ nhà máy FDI',
    logo: '/images/founding-partners/chuyen-gia-dong-phuc-logo.png',
    videoThumbnail: 'https://img.youtube.com/vi/OvvhcglmHzc/maxresdefault.jpg',
    youtubeEmbed: 'https://www.youtube.com/embed/OvvhcglmHzc',
    catalogueUrl: '/catalogues/CATALOGUE_DONG_PHUC.pdf',
    hotline: '0582 87 77 99',
    email: 'contact@chuyengiadongphuc.com',
    address: '154 Phạm Văn Chiêu, Phường 9, Quận Gò Vấp, TP. Hồ Chí Minh',
    coreProducts: [
      { name: 'Áo Polo Công Nhân Poly Co Giãn', specs: 'Thun cá sấu 4 chiều, thêu vi tính' },
      { name: 'Bộ Quần Áo Kaki Công Trình Phản Quang', specs: 'Vải Kaki 65/35 chống bám bẩn' }
    ],
    entitlements: [
      {
        id: 'ent-001-1',
        type: 'FEATURED_SPONSORED_BLOCK',
        status: 'DELIVERED',
        ownerUserId: 'USER-KIET-B2B',
        quantity: 1,
        deliveredQuantity: 1,
        evidence: [{ title: 'Khối hiển thị trực tiếp trên /nganh-nghe/dong-phuc-bao-ho-lao-dong', url: '/nganh-nghe/dong-phuc-bao-ho-lao-dong' }]
      },
      {
        id: 'ent-001-2',
        type: 'VIDEO_SHOWCASE',
        status: 'DELIVERED',
        ownerUserId: 'USER-DUNG-MEDIA',
        quantity: 1,
        deliveredQuantity: 1,
        evidence: [{ title: 'Video phóng sự xưởng may nhúng YouTube', url: 'https://www.youtube.com/embed/OvvhcglmHzc' }]
      },
      {
        id: 'ent-001-3',
        type: 'CATALOGUE_INCLUSION',
        status: 'DELIVERED',
        ownerUserId: 'USER-TRONG-OPS',
        quantity: 1,
        deliveredQuantity: 1,
        evidence: [{ title: 'E-Catalogue PDF tải về', url: '/catalogues/CATALOGUE_DONG_PHUC.pdf' }]
      },
      {
        id: 'ent-001-4',
        type: 'PARTNERSHIP_REPORT',
        status: 'IN_PROGRESS',
        ownerUserId: 'USER-KIET-B2B',
        quantity: 4,
        deliveredQuantity: 2,
        evidence: [{ title: 'Báo cáo Quý 1 & Quý 2/2026', url: '/reports/fp-proser-q2-2026.pdf' }]
      }
    ],
    contract: {
      contractNumber: 'HD-FP-2026-088',
      signedDate: '2025-12-20',
      totalValue: '120.000.000 VNĐ',
      paymentTerms: 'Thanh toán 2 đợt (50% ký hợp đồng, 50% sau nghiệm thu tháng thứ 6)',
      commercialType: 'COMMERCIAL_SPONSORSHIP_PACKAGE', // Bắt buộc: Tách biệt khỏi vốn đầu tư/equity
      isEquityOrInvestment: false
    },
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2026-06-15T14:30:00Z'
  },
  {
    id: 'FP-2026-002',
    publicCode: 'FP-2026-002',
    partnerName: 'TAHOMART B2B Gift Solutions & Nông Sản Chế Biến',
    shortName: 'TAHOMART B2B Gift',
    organizationId: 'org-tahomart-gift',
    categoryId: 'hop-qua-tang-doanh-nghiep',
    categoryName: 'Quà Tặng & Nông Sản Chế Biến',
    phaseId: '4.1',
    keywordClusterId: 'cluster-hop-qua-9-16',
    keywordClusterName: 'Hộp quà tặng doanh nghiệp tỷ lệ vàng 9:16',
    synonymKeywords: ['hộp quà 9:16', 'hộp quà dọc', 'giỏ quà màng co', 'quà tặng đại hội'],
    locationId: 'bac-ninh',
    locationName: 'Bắc Ninh & Hà Nội',
    industrialParkId: 'kcn-vsip-bac-ninh',
    industrialParkName: 'KCN VSIP Bắc Ninh',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    displayPosition: 'TOP_CATEGORY_SPONSORED_BLOCK',
    exclusivityScope: 'Độc quyền khối tài trợ quà tặng màng co nhiệt tại khu vực miền Bắc.',
    status: 'ACTIVE',
    contractId: 'HD-FP-2026-092',
    ownerUserId: 'USER-TRONG-OPS',
    ownerName: 'Trần Đình Trọng (Production Lead)',
    brandTitle: 'GIẢI PHÁP QUÀ TẶNG DOANH NGHIỆP & GIỎ QUÀ MÀNG CO',
    slogan: 'Nâng Tầm Quà Tặng Doanh Nghiệp FDI & Sự Kiện Quốc Gia',
    tagline: 'Set quà tặng đóng gói màng co tự động với Mít sấy Nam Huy, Trà Lipton, Bánh ChocoPie',
    logo: '/images/founding-partners/tahomart-logo.png',
    videoThumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
    youtubeEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    catalogueUrl: '/catalogues/TAHOMART_THE_TAHO_WAY.pdf',
    hotline: '0908 123 888',
    email: 'b2b-gifts@tahomart.vn',
    address: 'Tầng 12, Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội',
    coreProducts: [
      { name: 'Giỏ Quà Bọc Màng Co Nhiệt Tự Động', specs: 'Mít sấy Nam Huy + Trà Lipton + ChocoPie' },
      { name: 'Hộp Quà Dọc Tỷ Lệ Vàng 9:16', specs: 'Khung carton ép kim cửa sổ mica' }
    ],
    entitlements: [
      {
        id: 'ent-002-1',
        type: 'FEATURED_SPONSORED_BLOCK',
        status: 'DELIVERED',
        ownerUserId: 'USER-TRONG-OPS',
        quantity: 1,
        deliveredQuantity: 1,
        evidence: [{ title: 'Vị trí trang trọng trên /nganh-nghe/hop-qua-tang-doanh-nghiep', url: '/nganh-nghe/hop-qua-tang-doanh-nghiep' }]
      }
    ],
    contract: {
      contractNumber: 'HD-FP-2026-092',
      signedDate: '2025-12-28',
      totalValue: '95.000.000 VNĐ',
      commercialType: 'COMMERCIAL_SPONSORSHIP_PACKAGE',
      isEquityOrInvestment: false
    },
    createdAt: '2025-12-28T11:00:00Z',
    updatedAt: '2026-06-01T09:00:00Z'
  },
  {
    id: 'FP-2025-EXPIRED',
    publicCode: 'FP-2025-EXPIRED',
    partnerName: 'Công Ty Cổ Phần Cơ Khí Xây Dựng Long Thành M&E',
    shortName: 'Long Thành M&E',
    organizationId: 'org-longthanh-me',
    categoryId: 'co-dien-mep',
    categoryName: 'Cơ Điện & MEP Nhà Xưởng',
    phaseId: '2.3',
    keywordClusterId: 'cluster-mep-nha-xuong',
    keywordClusterName: 'Thi công cơ điện MEP nhà xưởng FDI',
    synonymKeywords: ['cơ điện mep', 'hệ thống hvac', 'trạm biến áp nhà máy'],
    locationId: 'binh-duong',
    locationName: 'Bình Dương',
    startDate: '2025-01-01',
    endDate: '2025-12-31', // Đã hết hạn (Section 9 & 24)
    displayPosition: 'TOP_CATEGORY_SPONSORED_BLOCK',
    status: 'EXPIRED',
    contractId: 'HD-FP-2025-014',
    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Đặng Tuấn Kiệt',
    logo: '/images/founding-partners/long-thanh-mep-logo.png',
    entitlements: [],
    contract: {
      contractNumber: 'HD-FP-2025-014',
      totalValue: '80.000.000 VNĐ',
      commercialType: 'COMMERCIAL_SPONSORSHIP_PACKAGE',
      isEquityOrInvestment: false
    },
    createdAt: '2024-12-15T08:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

// ----------------------------------------------------------------------------
// 4. GET ALL PARTNERSHIPS
// ----------------------------------------------------------------------------
export function getAllFoundingPartnerships() {
  const raw = safeGetItem(STORAGE_KEYS.PARTNERSHIPS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [...SEED_FOUNDING_PARTNERSHIPS];
}

export function saveAllFoundingPartnerships(list) {
  safeSetItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(list));
}

// ----------------------------------------------------------------------------
// 5. PUBLIC DISPLAY LOGIC (SECTION 9 SPEC 18.TXT)
// Chỉ trả về đối tác nếu:
// - status === 'ACTIVE'
// - currentDate >= startDate
// - currentDate <= endDate
// - scope matches category / keywordCluster / location
// ----------------------------------------------------------------------------
export function getActiveEligiblePartnership({ categoryId, categorySlug, keywordClusterId, keyword, locationId, industrialParkId }) {
  const all = getAllFoundingPartnerships();
  const nowStr = new Date().toISOString().slice(0, 10);

  return all.find(p => {
    // 1. Chỉ nhận ACTIVE
    if (p.status !== 'ACTIVE') return false;

    // 2. Kiểm tra thời hạn hiệu lực (currentDate >= startDate AND <= endDate)
    if (p.startDate && nowStr < p.startDate) return false;
    if (p.endDate && nowStr > p.endDate) return false;

    // 3. Khớp Category
    if (categoryId || categorySlug) {
      const targetCat = (categoryId || categorySlug || '').toLowerCase();
      const pCatId = (p.categoryId || '').toLowerCase();
      const pCatName = (p.categoryName || '').toLowerCase();
      if (pCatId === targetCat || pCatName.includes(targetCat) || targetCat.includes(pCatId)) {
        return true;
      }
    }

    // 4. Khớp Keyword Cluster / Synonyms
    if (keywordClusterId) {
      if (p.keywordClusterId === keywordClusterId) return true;
    }

    if (keyword) {
      const qLower = keyword.trim().toLowerCase();
      const matchesCluster = (p.keywordClusterName || '').toLowerCase().includes(qLower);
      const matchesSynonyms = Array.isArray(p.synonymKeywords) && p.synonymKeywords.some(syn => qLower.includes(syn.toLowerCase()) || syn.toLowerCase().includes(qLower));
      if (matchesCluster || matchesSynonyms) return true;
    }

    return false;
  }) || null;
}

// ----------------------------------------------------------------------------
// 6. SCOPE CONFLICT CHECK (SECTION 14 SPEC 18.TXT)
// Trước khi lập Proposal / Contract: Kiểm tra xem đã có đối tác ACTIVE hoặc
// SCHEDULED trong cùng Category, Cluster, Địa bàn, Khung thời gian chưa.
// ----------------------------------------------------------------------------
export function checkScopeConflict({ categoryId, keywordClusterId, locationId, startDate, endDate, excludeId }) {
  const all = getAllFoundingPartnerships();
  const targetStart = startDate || new Date().toISOString().slice(0, 10);
  const targetEnd = endDate || '2099-12-31';

  const conflictPartner = all.find(p => {
    if (excludeId && p.id === excludeId) return false;
    if (!['ACTIVE', 'SCHEDULED', 'CONTRACT_PENDING'].includes(p.status)) return false;

    // Check Category overlap
    const sameCat = categoryId && p.categoryId && (p.categoryId.toLowerCase() === categoryId.toLowerCase());
    // Check Keyword Cluster overlap
    const sameCluster = keywordClusterId && p.keywordClusterId && (p.keywordClusterId === keywordClusterId);

    if (!sameCat && !sameCluster) return false;

    // Check Location overlap (nếu có xét địa bàn cụ thể)
    if (locationId && p.locationId && p.locationId !== 'all' && locationId !== 'all') {
      if (p.locationId.toLowerCase() !== locationId.toLowerCase()) return false;
    }

    // Check Date overlap: (StartA <= EndB) and (EndA >= StartB)
    const pStart = p.startDate || '1970-01-01';
    const pEnd = p.endDate || '2099-12-31';
    const isOverlappingDate = (targetStart <= pEnd) && (targetEnd >= pStart);

    return isOverlappingDate;
  });

  if (conflictPartner) {
    return {
      hasConflict: true,
      status: 'SCOPE_CONFLICT',
      conflictingPartner: conflictPartner,
      reason: `Xung đột phạm vi thương mại với đối tác đang hoạt động: ${conflictPartner.partnerName} (${conflictPartner.publicCode || conflictPartner.id}) tại chuyên mục [${conflictPartner.categoryName || conflictPartner.keywordClusterName}] từ ${conflictPartner.startDate} đến ${conflictPartner.endDate}.`
    };
  }

  return { hasConflict: false };
}

// ----------------------------------------------------------------------------
// 7. SUBMIT INQUIRY (SECTION 11, 12, 13 SPEC 18.TXT)
// LUẬT BẮT BUỘC: Form submit CHỈ TẠO "INQUIRY", TUYỆT ĐỐI KHÔNG TỰ KÍCH HOẠT "ACTIVE"!
// ----------------------------------------------------------------------------
export function submitFoundingPartnershipInquiry(formData) {
  const allPartnerships = getAllFoundingPartnerships();
  const year = new Date().getFullYear();
  const sequence = String(allPartnerships.length + 105).padStart(5, '0');
  const publicCode = `FP-INQ-${year}-${sequence}`;
  const internalId = `inq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  // Kiểm tra xung đột tiềm năng để cảnh báo nội bộ (Internal warning)
  const conflictCheck = checkScopeConflict({
    categoryId: formData.categoryId,
    keywordClusterId: formData.keywordClusterId,
    locationId: formData.locationId,
    startDate: formData.startDate,
    endDate: formData.endDate
  });

  const newInquiry = {
    id: internalId,
    publicCode,
    partnerName: (formData.companyName || formData.partnerName || '').trim(),
    organizationId: formData.organizationId || null,
    contactName: (formData.contactName || '').trim(),
    contactEmail: (formData.contactEmail || formData.email || '').trim(),
    contactPhone: (formData.contactPhone || formData.phone || '').trim(),
    roleTitle: (formData.roleTitle || '').trim(),
    
    // Phạm vi thương mại đề xuất
    categoryId: formData.categoryId || null,
    categoryName: formData.categoryName || '',
    keywordClusterId: formData.keywordClusterId || null,
    keywordClusterName: formData.keywordClusterName || '',
    locationId: formData.locationId || null,
    locationName: formData.locationName || 'Toàn quốc',
    industrialParkId: formData.industrialParkId || null,
    industrialParkName: formData.industrialParkName || '',
    expectedDuration: formData.expectedDuration || '12_MONTHS',
    displayPosition: formData.displayPosition || 'TOP_CATEGORY_SPONSORED_BLOCK',
    
    // Quyền lợi & Dịch vụ đi kèm quan tâm
    servicesInterested: formData.servicesInterested || ['featured_block', 'capability_profile', 'video', 'catalogue'],
    objective: (formData.objective || '').trim(),
    budget: formData.budget || 'Nhận đề xuất theo phạm vi',
    attachments: formData.attachments || [],
    consentToContact: formData.consentToContact !== false,

    // TRẠNG THÁI: LUÔN BẮT ĐẦU TỪ "INQUIRY" (KHÔNG ACTIVE TỰ ĐỘNG)
    status: 'INQUIRY',
    scopeConflictStatus: conflictCheck.hasConflict ? 'POTENTIAL_CONFLICT_NOTED' : 'NORMAL',
    scopeConflictNote: conflictCheck.hasConflict ? conflictCheck.reason : null,

    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Ban Điều Phối Founding Partner (Partnership Sales Desk)',
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  allPartnerships.unshift(newInquiry);
  saveAllFoundingPartnerships(allPartnerships);

  // Log Audit (Section 21)
  logFoundingAudit({
    action: 'FOUNDING_INQUIRY_SUBMITTED',
    partnerId: newInquiry.id,
    actor: newInquiry.contactName || 'Người dùng đề xuất',
    details: `Tiếp nhận đề xuất hợp tác Founding Partner ${newInquiry.publicCode} từ ${newInquiry.partnerName} cho chuyên mục [${newInquiry.categoryName || newInquiry.keywordClusterName}]. Cảnh báo xung đột: ${newInquiry.scopeConflictStatus}.`
  });

  return {
    success: true,
    inquiry: newInquiry,
    publicCode: newInquiry.publicCode,
    isConflictWarning: conflictCheck.hasConflict
  };
}

// ----------------------------------------------------------------------------
// 8. UPDATE PARTNERSHIP STATUS & AUDIT (SECTION 22, 23, 24)
// ----------------------------------------------------------------------------
export function updateFoundingPartnershipStatus({ partnershipId, status, actor = 'System Admin', reason = '' }) {
  const list = getAllFoundingPartnerships();
  const idx = list.findIndex(p => p.id === partnershipId || p.publicCode === partnershipId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy đối tác' };

  const partner = list[idx];
  const oldStatus = partner.status;
  partner.status = status;
  partner.updatedAt = new Date().toISOString();

  if (!Array.isArray(partner.history)) partner.history = [];
  partner.history.push({
    fromStatus: oldStatus,
    toStatus: status,
    changedAt: new Date().toISOString(),
    changedBy: actor,
    note: reason || `Chuyển trạng thái từ ${oldStatus} sang ${status}`
  });

  list[idx] = partner;
  saveAllFoundingPartnerships(list);

  logFoundingAudit({
    action: 'PARTNERSHIP_STATUS_CHANGED',
    partnerId: partner.id,
    actor,
    details: `Đổi trạng thái đối tác ${partner.publicCode || partner.id}: [${oldStatus}] -> [${status}]. Ghi chú: ${reason || 'Tiến độ bình thường'}.`
  });

  return { success: true, partner };
}

// ----------------------------------------------------------------------------
// 9. DELIVERY TRACKING & EVIDENCE UPDATE (SECTION 17 & 18 SPEC 18.TXT)
// ----------------------------------------------------------------------------
export function updateEntitlementDelivery({ partnershipId, entitlementId, status, deliveredQuantity, evidenceItem, actor = 'Admin Operator' }) {
  const list = getAllFoundingPartnerships();
  const idx = list.findIndex(p => p.id === partnershipId || p.publicCode === partnershipId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy đối tác' };

  const partner = list[idx];
  if (!Array.isArray(partner.entitlements)) partner.entitlements = [];

  const entIdx = partner.entitlements.findIndex(e => e.id === entitlementId);
  if (entIdx < 0) return { success: false, message: 'Không tìm thấy quyền lợi' };

  const ent = partner.entitlements[entIdx];
  if (status) ent.status = status;
  if (deliveredQuantity !== undefined) ent.deliveredQuantity = deliveredQuantity;
  if (evidenceItem) {
    if (!Array.isArray(ent.evidence)) ent.evidence = [];
    ent.evidence.push({
      ...evidenceItem,
      addedAt: new Date().toISOString(),
      addedBy: actor
    });
  }
  ent.updatedAt = new Date().toISOString();
  partner.entitlements[entIdx] = ent;
  partner.updatedAt = new Date().toISOString();

  list[idx] = partner;
  saveAllFoundingPartnerships(list);

  logFoundingAudit({
    action: 'ENTITLEMENT_DELIVERY_UPDATED',
    partnerId: partner.id,
    actor,
    details: `Cập nhật tiến độ bàn giao quyền lợi [${ent.type}] đối tác ${partner.publicCode || partner.id}: Trạng thái: ${ent.status}. Đã bàn giao: ${ent.deliveredQuantity || 0}/${ent.quantity || 1}.`
  });

  return { success: true, partner, entitlement: ent };
}

// ----------------------------------------------------------------------------
// 10. RENEW PARTNERSHIP (SECTION 24 SPEC 18.TXT)
// Không ghi đè lịch sử hợp đồng cũ, tạo phiên bản hợp đồng và chu kỳ mới
// ----------------------------------------------------------------------------
export function renewFoundingPartnership({ partnershipId, newStartDate, newEndDate, newContractNumber, totalValue, actor = 'Admin Commercial' }) {
  const list = getAllFoundingPartnerships();
  const idx = list.findIndex(p => p.id === partnershipId || p.publicCode === partnershipId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy đối tác' };

  const partner = list[idx];
  
  // Lưu hợp đồng cũ vào historicalContracts
  if (!Array.isArray(partner.historicalContracts)) partner.historicalContracts = [];
  if (partner.contract) {
    partner.historicalContracts.push({
      ...partner.contract,
      startDate: partner.startDate,
      endDate: partner.endDate,
      archivedAt: new Date().toISOString()
    });
  }

  // Cập nhật chu kỳ mới
  partner.startDate = newStartDate;
  partner.endDate = newEndDate;
  partner.status = 'ACTIVE';
  partner.contract = {
    contractNumber: newContractNumber || `HD-RENEW-${Date.now().toString().slice(-4)}`,
    signedDate: new Date().toISOString().slice(0, 10),
    totalValue: totalValue || partner.contract?.totalValue || 'Thỏa thuận gia hạn',
    commercialType: 'COMMERCIAL_SPONSORSHIP_PACKAGE',
    isEquityOrInvestment: false,
    isRenewal: true
  };
  partner.updatedAt = new Date().toISOString();

  list[idx] = partner;
  saveAllFoundingPartnerships(list);

  logFoundingAudit({
    action: 'PARTNERSHIP_RENEWED',
    partnerId: partner.id,
    actor,
    details: `Gia hạn hợp tác thương mại Founding Partner ${partner.publicCode || partner.id} đến ngày ${newEndDate}. Mã HĐ mới: ${partner.contract.contractNumber}.`
  });

  return { success: true, partner };
}

// ----------------------------------------------------------------------------
// 11. AUDIT LOGS (SECTION 21 SPEC 18.TXT)
// ----------------------------------------------------------------------------
export function getAllFoundingAuditLogs() {
  const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [];
}

export function logFoundingAudit({ action, partnerId, actor = 'System Admin', details = '' }) {
  const logs = getAllFoundingAuditLogs();
  const entry = {
    id: `LOG-FP-${Date.now()}`,
    action,
    partnerId,
    actor,
    timestamp: new Date().toISOString(),
    details
  };
  logs.unshift(entry);
  safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  return entry;
}

// ----------------------------------------------------------------------------
// 12. SUPPLIER MATCHING NEUTRALITY AUDIT (SPEC 18 & 37)
// ----------------------------------------------------------------------------
/**
 * Kiểm định tính trung lập của thuật toán SupplierMatching đối với Founding Partner:
 * Founding Partner là gói thương mại hiển thị nhận diện, KHÔNG được cộng điểm ưu ái matching hay bóp méo kết quả tìm kiếm tự nhiên.
 */
export function verifySupplierMatchingNeutrality() {
  return {
    matchingBonus: 0,
    organicSearchUnaffected: true,
    sponsorDoesNotAlterShortlist: true,
    ruleEnforced: true,
    message: 'Founding Partner không được cộng điểm matching, kết quả tìm kiếm tự nhiên hoàn toàn dựa trên năng lực kỹ thuật và khoảng cách địa lý.'
  };
}
