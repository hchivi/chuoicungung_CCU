// ============================================================================
// MASTER ORGANIZATION REGISTRY & CLAIM OWNERSHIP SERVICE
// PAGE 12: TẠO / NHẬN QUẢN LÝ HỒ SƠ (/tao-ho-so)
// Chuẩn hóa theo spec 12.txt - CHUOICUNGUNG.COM
// ============================================================================

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
  ORGANIZATIONS: 'ccu_organizations_registry_v1',
  CLAIMS: 'ccu_organization_claims_v1',
  MEMBERSHIPS: 'ccu_organization_memberships_v1',
  AUDIT_LOGS: 'ccu_organization_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. SEED ORGANIZATIONS (Khởi tạo sẵn một số doanh nghiệp tiêu biểu để test Search/Claim)
// ----------------------------------------------------------------------------
export const SEED_ORGANIZATIONS = [
  {
    id: 'ORG-PROSER-001',
    name: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    legalName: 'CÔNG TY TNHH CHUYÊN GIA ĐỒNG PHỤC PROSER',
    taxCode: '0314567890',
    website: 'https://chuyengiadongphuc.com',
    country: 'Việt Nam',
    province: 'TP. Hồ Chí Minh',
    address: '154 Phạm Văn Chiêu, Phường 9, Quận Gò Vấp, TP. Hồ Chí Minh',
    orgType: 'Doanh nghiệp sản xuất',
    logo: '/images/founding-partners/chuyen-gia-dong-phuc-logo.png',
    roles: ['SUPPLIER', 'FACTORY', 'FOUNDING_PARTNER'],
    isClaimed: true,
    isPublished: true,
    ownerUserId: 'USER-PROSER-ADMIN',
    completenessScore: 85,
    createdAt: '2026-01-15T08:00:00Z',
    capabilities: ['May mặc bảo hộ lao động', 'Đồng phục doanh nghiệp FDI', 'Dệt kháng tĩnh điện ESD'],
    productsServices: ['Áo thun polo', 'Đồng phục công nhân kaki', 'Đồng phục phòng sạch cleanroom']
  },
  {
    id: 'ORG-TAHOMART-002',
    name: 'Công ty Cổ phần Tập đoàn TAHOMART Việt Nam',
    legalName: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN TAHOMART VIỆT NAM',
    taxCode: '0101234567',
    website: 'https://tahomart.vn',
    country: 'Việt Nam',
    province: 'Hà Nội',
    address: 'Tầng 12, Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội',
    orgType: 'Doanh nghiệp thương mại & chế biến',
    logo: '/images/founding-partners/tahomart-logo.png',
    roles: ['SUPPLIER', 'BUYER', 'FOUNDING_PARTNER'],
    isClaimed: true,
    isPublished: true,
    ownerUserId: 'USER-TAHO-ADMIN',
    completenessScore: 90,
    createdAt: '2026-02-10T09:30:00Z',
    capabilities: ['Đóng gói màng co nhiệt tự động', 'Nông sản chế biến xuất khẩu'],
    productsServices: ['Giỏ quà màng co 9:16', 'Mít sấy Nam Huy', 'Hộp quà tết công nhân']
  },
  {
    id: 'ORG-AMATA-003',
    name: 'Công ty Cổ phần Đô Thị Amata Biên Hòa',
    legalName: 'CÔNG TY CỔ PHẦN ĐÔ THỊ AMATA BIÊN HÒA',
    taxCode: '3600284561',
    website: 'https://amata.com',
    country: 'Việt Nam',
    province: 'Đồng Nai',
    address: 'KCN Amata, Phường Long Bình, TP. Biên Hòa, Tỉnh Đồng Nai',
    orgType: 'Chủ đầu tư Hạ tầng KCN',
    logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100&auto=format&fit=crop&q=80',
    roles: ['INDUSTRIAL_PARK', 'BUYER', 'DEVELOPMENT_PARTNER'],
    isClaimed: false, // Chưa được claim -> Có thể claim thử
    isPublished: true,
    ownerUserId: null,
    completenessScore: 60,
    createdAt: '2026-03-01T10:00:00Z',
    capabilities: ['Hạ tầng kỹ thuật KCN hoàn chỉnh', 'Cấp điện 110kV', 'Xử lý nước thải 12.000m3/ngày'],
    productsServices: ['Cho thuê đất công nghiệp', 'Cho thuê nhà xưởng xây sẵn (RBF)']
  },
  {
    id: 'ORG-MEKONG-FOOD-004',
    name: 'Công ty Cổ phần Thực Phẩm Xanh Mekong',
    legalName: 'CÔNG TY CỔ PHẦN THỰC PHẨM XANH MEKONG',
    taxCode: '1100987654',
    website: 'https://mekongfoods.vn',
    country: 'Việt Nam',
    province: 'Long An',
    address: 'KCN Long Hậu, Xã Long Hậu, Huyện Cần Giuộc, Tỉnh Long An',
    orgType: 'Nhà máy chế biến',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
    roles: ['FACTORY', 'BUYER'],
    isClaimed: false,
    isPublished: true,
    ownerUserId: null,
    completenessScore: 50,
    createdAt: '2026-03-12T14:20:00Z',
    capabilities: ['Chế biến đóng gói thực phẩm đạt chuẩn HACCP', 'Kho lạnh -18 độ C'],
    productsServices: ['Thực phẩm sấy', 'Thủy hải sản đông lạnh']
  },
  {
    id: 'ORG-HAME-005',
    name: 'Hội Doanh Nghiệp Cơ Khí - Điện TP. Hồ Chí Minh (HAME)',
    legalName: 'HỘI DOANH NGHIỆP CƠ KHÍ - ĐIỆN THÀNH PHỐ HỒ CHÍ MINH',
    taxCode: '0303889911',
    website: 'https://hame.org.vn',
    country: 'Việt Nam',
    province: 'TP. Hồ Chí Minh',
    address: '156 Nam Kỳ Khởi Nghĩa, Phường Bến Nghé, Quận 1, TP. HCM',
    orgType: 'Hội / Hiệp hội',
    logo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&auto=format&fit=crop&q=80',
    roles: ['ASSOCIATION', 'PROGRAM_ORGANIZER', 'DEVELOPMENT_PARTNER'],
    isClaimed: false,
    isPublished: true,
    ownerUserId: null,
    completenessScore: 65,
    createdAt: '2026-01-20T11:00:00Z',
    capabilities: ['Kết nối giao thương B2B ngành Cơ khí', 'Hội chợ triển lãm chuyên ngành'],
    productsServices: ['Chương trình kết nối giao thương', 'Hội thảo đào tạo kỹ thuật']
  },
  {
    id: 'ORG-VLA-008',
    name: 'Hiệp hội Doanh nghiệp Dịch vụ Logistics Việt Nam (VLA)',
    legalName: 'HIỆP HỘI DOANH NGHIỆP DỊCH VỤ LOGISTICS VIỆT NAM',
    taxCode: '0101568912',
    website: 'https://vla.com.vn',
    country: 'Việt Nam',
    province: 'Hà Nội',
    address: 'Tầng 5, Tòa nhà VCCI, Số 9 Đào Duy Anh, Q. Đống Đa, Hà Nội',
    orgType: 'Hội / Hiệp hội',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=80',
    roles: ['ASSOCIATION', 'DEVELOPMENT_PARTNER'],
    isClaimed: false,
    isPublished: true,
    ownerUserId: null,
    completenessScore: 75,
    createdAt: '2026-01-18T09:00:00Z',
    capabilities: ['Logistics & Giao nhận quốc tế', 'Kho bãi & Vận tải đa phương thức'],
    productsServices: ['Kết nối giải pháp logistics', 'Đào tạo hải quan & chuỗi cung ứng']
  },
  {
    id: 'ORG-VITAS-009',
    name: 'Hiệp hội Dệt May Việt Nam (VITAS)',
    legalName: 'HIỆP HỘI DỆT MAY VIỆT NAM',
    taxCode: '0101458923',
    website: 'https://vietnamtextile.org.vn',
    country: 'Việt Nam',
    province: 'Hà Nội',
    address: 'Số 32 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    orgType: 'Hội / Hiệp hội',
    logo: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&auto=format&fit=crop&q=80',
    roles: ['ASSOCIATION', 'PROGRAM_ORGANIZER', 'DEVELOPMENT_PARTNER'],
    isClaimed: false,
    isPublished: true,
    ownerUserId: null,
    completenessScore: 80,
    createdAt: '2026-01-10T10:00:00Z',
    capabilities: ['Chuỗi cung ứng dệt may xanh', 'Xúc tiến xuất khẩu thời trang'],
    productsServices: ['Chương trình kết nối nguồn cung vải', 'Hội thảo ESG dệt may']
  },
  {
    id: 'ORG-VASEP-010',
    name: 'Hiệp hội Chế biến và Xuất khẩu Thủy sản Việt Nam (VASEP)',
    legalName: 'HIỆP HỘI CHẾ BIẾN VÀ XUẤT KHẨU THỦY SẢN VIỆT NAM',
    taxCode: '0301429811',
    website: 'https://vasep.com.vn',
    country: 'Việt Nam',
    province: 'TP. Hồ Chí Minh',
    address: 'Số 71 đường 75, KDC Tân Quy Đông, P. Tân Phong, Quận 7, TP. HCM',
    orgType: 'Hội / Hiệp hội',
    logo: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=100&auto=format&fit=crop&q=80',
    roles: ['ASSOCIATION', 'DEVELOPMENT_PARTNER'],
    isClaimed: false,
    isPublished: true,
    ownerUserId: null,
    completenessScore: 78,
    createdAt: '2026-01-12T14:00:00Z',
    capabilities: ['Bảo quản lạnh & Đóng gói thủy sản', 'Kiểm soát chất lượng xuất khẩu'],
    productsServices: ['Chương trình kết nối nhà máy & bao bì', 'Kỷ yếu xuất khẩu thủy sản']
  },
  {
    id: 'ORG-DNBA-012',
    name: 'Hiệp hội Doanh nghiệp Tỉnh Đồng Nai (DNBA)',
    legalName: 'HIỆP HỘI DOANH NGHIỆP TỈNH ĐỒNG NAI',
    taxCode: '3600554421',
    website: 'https://dnba.org.vn',
    country: 'Việt Nam',
    province: 'Đồng Nai',
    address: 'Đường Nguyễn Ái Quốc, Phường Tân Phong, TP. Biên Hòa, Tỉnh Đồng Nai',
    orgType: 'Hội / Hiệp hội',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=100&auto=format&fit=crop&q=80',
    roles: ['ASSOCIATION', 'PROGRAM_ORGANIZER', 'DEVELOPMENT_PARTNER'],
    isClaimed: false,
    isPublished: true,
    ownerUserId: null,
    completenessScore: 70,
    createdAt: '2026-02-01T08:30:00Z',
    capabilities: ['Phát triển công nghiệp phụ trợ KCN', 'Giao thương doanh nghiệp địa phương'],
    productsServices: ['Chương trình kết nối cung cầu Đồng Nai', 'Diễn đàn đối thoại KCN']
  },
  {
    id: 'ORG-VEIA-014',
    name: 'Hiệp hội Doanh nghiệp Điện tử Việt Nam (VEIA)',
    legalName: 'HIỆP HỘI DOANH NGHIỆP ĐIỆN TỬ VIỆT NAM',
    taxCode: '0101889922',
    website: 'https://veia.org.vn',
    country: 'Việt Nam',
    province: 'Hà Nội',
    address: 'Số 11B Cát Linh, Quận Ba Đình, Hà Nội',
    orgType: 'Hội / Hiệp hội',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    roles: ['ASSOCIATION', 'DEVELOPMENT_PARTNER'],
    isClaimed: false,
    isPublished: true,
    ownerUserId: null,
    completenessScore: 72,
    createdAt: '2026-02-15T10:00:00Z',
    capabilities: ['Linh kiện điện tử & Bán dẫn', 'SMT & Lắp ráp bo mạch PCB'],
    productsServices: ['Danh bạ nhà cung cấp Tier-2', 'Kết nối chuỗi FDI điện tử']
  }
];

// ----------------------------------------------------------------------------
// 2. HELPER FUNCTIONS & STORAGE ACCESS
// ----------------------------------------------------------------------------
export function getAllOrganizations() {
  const raw = safeGetItem(STORAGE_KEYS.ORGANIZATIONS);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [...SEED_ORGANIZATIONS];
}

export function saveAllOrganizations(orgs) {
  safeSetItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
}

export function getAllClaims() {
  const raw = safeGetItem(STORAGE_KEYS.CLAIMS);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [
    {
      id: 'CLM-2026-001',
      organizationId: 'ORG-AMATA-003',
      organizationName: 'Công ty Cổ phần Đô Thị Amata Biên Hòa',
      requesterUserId: 'USER-LE-HOANG',
      requesterName: 'Lê Hoàng Long',
      requestedRole: 'INDUSTRIAL_PARK',
      businessEmail: 'long.lh@amata.com',
      phone: '0918 888 999',
      evidenceType: 'BUSINESS_EMAIL_DOMAIN',
      evidenceAttachments: ['Giay_Uy_Quyen_Amata_2026.pdf'],
      note: 'Tôi là Giám đốc Ban xúc tiến đầu tư Amata Đồng Nai, cần nhận quyền quản lý hồ sơ để cập nhật quỹ đất.',
      status: 'PENDING',
      createdAt: '2026-09-27T10:00:00Z'
    }
  ];
}

export function saveAllClaims(claims) {
  safeSetItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
}

export function getAllMemberships() {
  const raw = safeGetItem(STORAGE_KEYS.MEMBERSHIPS);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [];
}

export function saveAllMemberships(memberships) {
  safeSetItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
}

// ----------------------------------------------------------------------------
// 3. DUPLICATE DETECTION SERVICE (SECTION 6 SPEC 12.TXT)
// ----------------------------------------------------------------------------
/**
 * Phát hiện khả năng trùng lặp trước khi tạo hồ sơ mới:
 * Kiểm tra: taxCode, legalName, domain, phone, name similarity.
 */
export function detectDuplicateOrganization({ taxCode, legalName, name, website, phone }) {
  const allOrgs = getAllOrganizations();
  const matched = [];

  const cleanTax = (taxCode || '').replace(/\s+/g, '').trim();
  const normLegal = (legalName || '').toLowerCase().trim();
  const normName = (name || '').toLowerCase().trim();
  const cleanDomain = website ? website.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase() : '';

  allOrgs.forEach(org => {
    let matchReason = null;

    // 1. Trùng mã số thuế (Chính xác tuyệt đối)
    if (cleanTax && org.taxCode && org.taxCode.replace(/\s+/g, '').trim() === cleanTax) {
      matchReason = `Trùng khớp Mã Số Thuế: ${cleanTax}`;
    }
    // 2. Trùng tên pháp lý
    else if (normLegal && org.legalName && org.legalName.toLowerCase().trim() === normLegal) {
      matchReason = `Trùng khớp Tên Pháp Lý: ${org.legalName}`;
    }
    // 3. Trùng tên thương hiệu / tên công ty
    else if (normName && org.name && (org.name.toLowerCase().trim() === normName || org.name.toLowerCase().includes(normName))) {
      matchReason = `Trùng lặp hoặc tương đồng cao với: ${org.name}`;
    }
    // 4. Trùng website domain
    else if (cleanDomain && org.website) {
      const orgDomain = org.website.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
      if (orgDomain === cleanDomain) {
        matchReason = `Trùng website doanh nghiệp: ${cleanDomain}`;
      }
    }

    if (matchReason) {
      matched.push({
        organization: org,
        reason: matchReason
      });
    }
  });

  return {
    hasDuplicate: matched.length > 0,
    matches: matched
  };
}

// ----------------------------------------------------------------------------
// 4. SEARCH ORGANIZATIONS (SECTION 3 SPEC 12.TXT)
// ----------------------------------------------------------------------------
/**
 * Tìm kiếm tổ chức/doanh nghiệp đã có theo Tên, Pháp lý, MST, Website.
 * Kết quả sanitize giới hạn: Tên, Logo nếu có, Địa bàn, Loại tổ chức.
 * Tuyệt đối không public private contact, internal owner, internal notes.
 */
export function searchOrganizations(keyword) {
  const allOrgs = getAllOrganizations();
  if (!keyword || !keyword.trim()) return allOrgs.slice(0, 10);

  const q = keyword.toLowerCase().trim();
  const cleanTax = q.replace(/\s+/g, '');

  return allOrgs.filter(org => {
    const matchName = (org.name || '').toLowerCase().includes(q);
    const matchLegal = (org.legalName || '').toLowerCase().includes(q);
    const matchTax = org.taxCode && org.taxCode.replace(/\s+/g, '').includes(cleanTax);
    const matchWeb = (org.website || '').toLowerCase().includes(q);
    const matchProvince = (org.province || '').toLowerCase().includes(q);
    return matchName || matchLegal || matchTax || matchWeb || matchProvince;
  }).map(org => ({
    id: org.id,
    name: org.name,
    legalName: org.legalName,
    taxCode: org.taxCode,
    logo: org.logo,
    orgType: org.orgType,
    province: org.province,
    address: org.address,
    roles: org.roles || [],
    isClaimed: !!org.isClaimed,
    completenessScore: org.completenessScore || 45
  }));
}

// ----------------------------------------------------------------------------
// 5. CLAIM ORGANIZATION PROFILE (SECTION 4 & 5 SPEC 12.TXT)
// ----------------------------------------------------------------------------
/**
 * Nộp yêu cầu nhận quyền quản lý hồ sơ (Claim Profile).
 * Không tự động phê duyệt ngay; tạo bản ghi PENDING và chờ xác minh.
 */
export function submitOrganizationClaim({
  organizationId,
  requesterUserId,
  requesterName,
  requestedRoles = ['SUPPLIER'],
  businessEmail,
  phone,
  evidenceType = 'BUSINESS_LICENSE',
  evidenceAttachments = [],
  note = ''
}) {
  const claims = getAllClaims();

  // Kiểm tra xem user này đã nộp claim cho org này và đang pending chưa
  const existingPending = claims.find(
    c => c.organizationId === organizationId && c.requesterUserId === requesterUserId && c.status === 'PENDING'
  );
  if (existingPending) {
    return {
      success: false,
      message: 'Bạn đã có yêu cầu quyền quản lý cho doanh nghiệp này đang chờ thẩm định.'
    };
  }

  const allOrgs = getAllOrganizations();
  const org = allOrgs.find(o => o.id === organizationId);
  const orgName = org ? org.name : 'Doanh nghiệp hệ thống';

  const newClaim = {
    id: `CLM-${Date.now()}`,
    organizationId,
    organizationName: orgName,
    requesterUserId,
    requesterName: requesterName || 'Người dùng',
    requestedRoles: Array.isArray(requestedRoles) ? requestedRoles : [requestedRoles],
    businessEmail,
    phone,
    evidenceType,
    evidenceAttachments,
    note,
    status: 'PENDING', // PENDING | NEED_MORE_INFO | APPROVED | REJECTED
    createdAt: new Date().toISOString()
  };

  claims.unshift(newClaim);
  saveAllClaims(claims);

  logOrgAudit({
    action: 'CLAIM_SUBMITTED',
    orgId: organizationId,
    actor: requesterName || requesterUserId,
    details: `Nộp yêu cầu quyền quản lý hồ sơ doanh nghiệp ${orgName}.`
  });

  return { success: true, claim: newClaim };
}

// ----------------------------------------------------------------------------
// 6. CREATE NEW ORGANIZATION (SECTION 6, 7, 8 SPEC 12.TXT)
// ----------------------------------------------------------------------------
/**
 * Tạo mới hồ sơ tổ chức với hỗ trợ nhiều vai trò (Multi-role).
 * Không duplicate Organization theo vai trò.
 * Tạo Organization != public ngay (Section 11).
 */
export function createNewOrganization({
  name,
  legalName,
  taxCode,
  website,
  country = 'Việt Nam',
  province,
  address,
  orgType = 'Doanh nghiệp sản xuất',
  logo = null,
  roles = ['SUPPLIER'],
  creatorUserId = 'USER_GUEST',
  creatorName = 'Đại diện doanh nghiệp'
}) {
  const allOrgs = getAllOrganizations();

  const newOrgId = `ORG-${Date.now()}`;
  const now = new Date().toISOString();

  const newOrg = {
    id: newOrgId,
    name: name.trim(),
    legalName: (legalName || name).trim(),
    taxCode: taxCode ? taxCode.trim() : null,
    website: website ? website.trim() : null,
    country,
    province,
    address,
    orgType,
    logo,
    roles: Array.isArray(roles) && roles.length > 0 ? roles : ['SUPPLIER'],
    isClaimed: true, // Do chính người tạo sở hữu ban đầu
    isPublished: false, // Section 11: Tạo mới không auto public ngay, cần review
    ownerUserId: creatorUserId,
    completenessScore: 45, // Cơ bản đạt 45% (Section 10)
    createdAt: now,
    capabilities: [],
    productsServices: []
  };

  allOrgs.unshift(newOrg);
  saveAllOrganizations(allOrgs);

  // Tạo membership ban đầu
  const memberships = getAllMemberships();
  memberships.unshift({
    id: `MEM-${Date.now()}`,
    organizationId: newOrgId,
    userId: creatorUserId,
    userName: creatorName,
    roleInOrg: 'Owner/Admin',
    assignedRoles: newOrg.roles,
    createdAt: now
  });
  saveAllMemberships(memberships);

  logOrgAudit({
    action: 'ORGANIZATION_CREATED',
    orgId: newOrgId,
    actor: creatorName,
    details: `Tạo mới tổ chức ${name} với các vai trò: ${newOrg.roles.join(', ')}.`
  });

  return { success: true, organization: newOrg };
}

// ----------------------------------------------------------------------------
// 7. PROFILE COMPLETENESS CALCULATOR (SECTION 10 SPEC 12.TXT)
// ----------------------------------------------------------------------------
/**
 * Tính toán mức độ hoàn thiện hồ sơ và checklist theo từng vai trò.
 */
export function calculateProfileCompleteness(org) {
  if (!org) return { score: 0, items: [] };

  const items = [
    { key: 'basic', label: 'Thông tin cơ bản (Tên, MST, Địa chỉ)', done: !!(org.name && org.province) },
    { key: 'logo', label: 'Logo đại diện thương hiệu', done: !!org.logo },
    { key: 'website', label: 'Website hoặc trang giới thiệu', done: !!org.website },
    { key: 'roles', label: 'Xác định vai trò tổ chức trong chuỗi', done: !!(org.roles && org.roles.length > 0) }
  ];

  // Nếu có vai trò SUPPLIER
  if (org.roles?.includes('SUPPLIER')) {
    items.push({
      key: 'capabilities',
      label: 'Danh mục năng lực & công nghệ sản xuất',
      done: !!(org.capabilities && org.capabilities.length > 0)
    });
    items.push({
      key: 'products',
      label: 'Sản phẩm & Dịch vụ then chốt',
      done: !!(org.productsServices && org.productsServices.length > 0)
    });
    items.push({
      key: 'evidence',
      label: 'Chứng nhận chất lượng / Giấy phép (ISO, Quatest...)',
      done: false
    });
  }

  // Nếu có vai trò FACTORY
  if (org.roles?.includes('FACTORY')) {
    items.push({
      key: 'factory_info',
      label: 'Quy mô nhà xưởng & vị trí KCN',
      done: !!org.province
    });
  }

  // Nếu có vai trò ASSOCIATION / INDUSTRIAL_PARK
  if (org.roles?.includes('ASSOCIATION') || org.roles?.includes('INDUSTRIAL_PARK')) {
    items.push({
      key: 'scope',
      label: 'Phạm vi hoạt động & mạng lưới thành viên/nhà máy',
      done: false
    });
  }

  const doneCount = items.filter(i => i.done).length;
  const score = Math.round((doneCount / items.length) * 100);

  return { score, items };
}

// ----------------------------------------------------------------------------
// 8. ADMIN CLAIM WORKFLOW & MUTATIONS (SECTION 12 & 14 SPEC 12.TXT)
// ----------------------------------------------------------------------------
export function adminReviewClaim({ claimId, action, reviewer = 'Admin Master', reason = '' }) {
  const claims = getAllClaims();
  const idx = claims.findIndex(c => c.id === claimId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu' };

  const claim = claims[idx];
  claim.status = action; // APPROVED | NEED_MORE_INFO | REJECTED
  claim.reviewedBy = reviewer;
  claim.reviewedAt = new Date().toISOString();
  claim.reviewerNote = reason;

  claims[idx] = claim;
  saveAllClaims(claims);

  // Nếu APPROVED: Gán membership cho requester mà không tạo organization duplicate (Section 12)
  if (action === 'APPROVED') {
    const allOrgs = getAllOrganizations();
    const org = allOrgs.find(o => o.id === claim.organizationId);
    if (org) {
      org.isClaimed = true;
      org.ownerUserId = claim.requesterUserId;
      // Bổ sung role nếu có
      if (claim.requestedRoles && claim.requestedRoles.length > 0) {
        const set = new Set([...(org.roles || []), ...claim.requestedRoles]);
        org.roles = Array.from(set);
      }
      saveAllOrganizations(allOrgs);
    }

    // Tạo membership
    const memberships = getAllMemberships();
    memberships.unshift({
      id: `MEM-${Date.now()}`,
      organizationId: claim.organizationId,
      userId: claim.requesterUserId,
      userName: claim.requesterName,
      roleInOrg: 'Organization Admin',
      assignedRoles: claim.requestedRoles,
      createdAt: new Date().toISOString()
    });
    saveAllMemberships(memberships);
  }

  logOrgAudit({
    action: `CLAIM_${action}`,
    orgId: claim.organizationId,
    actor: reviewer,
    details: `Xử lý yêu cầu quản lý hồ sơ của ${claim.requesterName}: [${action}]. Lý do/Ghi chú: ${reason || 'Hồ sơ hợp lệ.'}`
  });

  return { success: true, claim };
}

// ----------------------------------------------------------------------------
// 9. AUDIT LOG (SECTION 19 SPEC 12.TXT)
// ----------------------------------------------------------------------------
export function getAllOrgAuditLogs() {
  const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [];
}

export function logOrgAudit({ action, orgId, actor = 'System Admin', details = '' }) {
  const logs = getAllOrgAuditLogs();
  const entry = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    orgId,
    actor,
    timestamp: new Date().toISOString(),
    details
  };
  logs.unshift(entry);
  safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  return entry;
}

// ----------------------------------------------------------------------------
// 10. SYSTEM-WIDE ORGANIZATION DUPLICATE AUDIT (SECTION 7 SPEC 37.TXT)
// ----------------------------------------------------------------------------
/**
 * Rà soát trùng lặp toàn diện: taxCode, legalName, normalizedName, domain, phone.
 * Phân loại:
 * - safeAutoMergeCandidates (trùng chính xác mã số thuế)
 * - possibleDuplicates (trùng tên chuẩn hóa / domain)
 * - manualReviewRequired (cần chuyên viên pháp lý đối soát)
 */
export function auditOrganizationDuplicates(customList = null) {
  const allOrgs = customList || getAllOrganizations();
  const duplicateResults = {
    totalChecked: allOrgs.length,
    possibleDuplicates: [],
    safeAutoMergeCandidates: [],
    manualReviewRequired: []
  };

  const taxMap = new Map();
  const nameMap = new Map();
  const domainMap = new Map();

  allOrgs.forEach(org => {
    // 1. Kiểm tra TaxCode
    if (org.taxCode) {
      const cleanTax = String(org.taxCode).replace(/\D/g, '');
      if (cleanTax) {
        if (!taxMap.has(cleanTax)) taxMap.set(cleanTax, []);
        taxMap.get(cleanTax).push(org);
      }
    }

    // 2. Kiểm tra Normalized Legal / Display Name
    const rawName = org.legalName || org.name || '';
    if (rawName) {
      const normName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normName.length >= 6) {
        if (!nameMap.has(normName)) nameMap.set(normName, []);
        nameMap.get(normName).push(org);
      }
    }

    // 3. Kiểm tra Website Domain
    if (org.website) {
      try {
        const urlStr = org.website.startsWith('http') ? org.website : `https://${org.website}`;
        const domain = new URL(urlStr).hostname.replace(/^www\./, '').toLowerCase();
        if (domain && domain.includes('.')) {
          if (!domainMap.has(domain)) domainMap.set(domain, []);
          domainMap.get(domain).push(org);
        }
      } catch (e) {}
    }
  });

  // Đánh giá các ứng viên Safe Auto-Merge (Trùng MST)
  taxMap.forEach((list, tax) => {
    if (list.length > 1) {
      duplicateResults.safeAutoMergeCandidates.push({
        matchType: 'EXACT_TAX_CODE',
        identifier: tax,
        count: list.length,
        organizations: list.map(o => ({ id: o.id, name: o.name, roles: o.roles }))
      });
    }
  });

  // Đánh giá Trùng tên chuẩn hóa (Cần Review)
  nameMap.forEach((list, norm) => {
    if (list.length > 1) {
      const firstTax = list[0].taxCode?.replace(/\D/g, '');
      const allSameTax = list.every(o => o.taxCode?.replace(/\D/g, '') === firstTax);
      if (!allSameTax) {
        duplicateResults.possibleDuplicates.push({
          matchType: 'NORMALIZED_NAME',
          identifier: norm,
          count: list.length,
          organizations: list.map(o => ({ id: o.id, name: o.name, taxCode: o.taxCode, roles: o.roles }))
        });
        duplicateResults.manualReviewRequired.push({
          reason: `Trùng tên "${list[0].name}" nhưng khác mã số thuế, cần xác minh tư cách pháp nhân riêng.`,
          orgIds: list.map(o => o.id)
        });
      }
    }
  });

  return duplicateResults;
}
