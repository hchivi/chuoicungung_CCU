// ============================================================================
// MASTER FACTORIES & MANUFACTURING ECOSYSTEM DATA ENGINE
// PAGE 28: ROUTE /nha-may & /admin/nha-may
// TUÂN THỦ TOÀN DIỆN SPEC 28.TXT - CHUOICUNGUNG.COM
// ============================================================================

import { factories as factoriesFullList, isCloudBrowser, getCloudRecords } from './cloudData.js';
import { persistSubmission, getPrivateSubmissions } from '../services/submissionService.js';
import { getAllOrganizations } from './organizationsData.js';
import { getAllMasterRequirements } from './requirementsData.js';
import { getAllPrograms, TARGET_ROLES_ENUM } from './programsData.js';
import { resolveCanonicalKcnId } from './industrialParksData.js';

// ----------------------------------------------------------------------------
// 1. FACTORY PROFILE SCHEMA (SECTION 2, 3 SPEC 28.TXT)
// QUY TẮC CỐT LÕI: MỘT FACTORY = MỘT ORGANIZATION MASTER
// Không tạo 2 company record riêng cho cùng một nhà máy khi họ vừa mua vừa bán
// ----------------------------------------------------------------------------

export const FACTORY_PROFILE_STATUS_ENUM = {
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
  INCOMPLETE: 'INCOMPLETE',
  ARCHIVED: 'ARCHIVED'
};

export const PRODUCT_DATA_STATUS_ENUM = {
  SELF_DECLARED: 'SELF_DECLARED',
  REVIEWED: 'REVIEWED',
  NEEDS_UPDATE: 'NEEDS_UPDATE'
};

// Seed specialized Factory Profiles linking to existing Organizations
// MỘT DOANH NGHIỆP CÓ THỂ CÓ NHIỀU NHÀ MÁY / PHÂN XƯỞNG (SECTION 2, 32 SPEC 29.TXT)
export const SEED_FACTORY_PROFILES = websiteSeed('factoriesData.SEED_FACTORY_PROFILES');

// In-memory profiles, connection requests & audit logs
let inMemoryFactoryProfiles = isCloudBrowser() ? getCloudRecords('factoryProfiles') : [...SEED_FACTORY_PROFILES];
let inMemoryFactoryAuditLogs = [];
let inMemoryFactoryConnectionRequests = [];

/**
 * Ghi nhận Audit Log cho Nhà máy (Section 14 QA)
 */
export function logFactoryAudit(entry) {
  const logItem = {
    id: `FAUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    actor: entry.actor || 'System Coordinator',
    factoryId: entry.factoryId || 'SYSTEM',
    action: entry.action,
    entityType: entry.entityType || 'FACTORY_PROFILE',
    entityId: entry.entityId,
    details: entry.details,
    previousState: entry.previousState || null,
    newState: entry.newState || null
  };
  inMemoryFactoryAuditLogs.unshift(logItem);
  return logItem;
}

export function getAllFactoryAuditLogs(factoryId = null) {
  if (factoryId) {
    return inMemoryFactoryAuditLogs.filter(l => l.factoryId === factoryId);
  }
  return inMemoryFactoryAuditLogs;
}

/**
 * Gửi yêu cầu kết nối tới Nhà máy (Section 34, 35 Spec 29.txt)
 * Tuyệt đối không để lộ SĐT / Zalo cá nhân của đại diện nhà máy trên giao diện
 */
export async function submitFactoryConnectionRequest(requestData, actor = 'Anonymous Buyer/Partner') {
  const connId = `CONN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const connectionItem = {
    id: connId,
    timestamp: new Date().toISOString(),
    factoryId: requestData.factoryId,
    factoryName: requestData.factoryName,
    organizationId: requestData.organizationId,
    targetType: requestData.targetType || 'SUPPLIER_CAPABILITY',
    requirementId: requestData.requirementId || null,
    requirementTitle: requestData.requirementTitle || null,
    message: requestData.message || '',
    senderName: requestData.senderName || 'Đại diện doanh nghiệp',
    senderCompany: requestData.senderCompany || 'Doanh nghiệp tìm nguồn cung',
    senderEmail: requestData.senderEmail || '',
    senderPhone: requestData.senderPhone || '',
    status: 'PENDING_COORDINATION',
    owner: 'Bàn Điều Phối CCU (Page 19 Unified Pipeline)',
    nextAction: 'Xác minh hồ sơ nhu cầu & thông báo đại diện nhà máy',
    nextActionAt: new Date(Date.now() + 86400000).toISOString()
  };

  if (isCloudBrowser()) {
    const saved = await persistSubmission('factoryConnection', connectionItem);
    return { success: true, connectionId: saved.id, message: 'Yêu cầu đã lưu và đang chờ điều phối.' };
  }
  inMemoryFactoryConnectionRequests.unshift(connectionItem);

  // Ghi AuditLog (Section 18 QA)
  logFactoryAudit({
    action: 'CREATE_FACTORY_CONNECTION_REQUEST',
    factoryId: requestData.factoryId,
    entityType: 'CONNECTION_REQUEST',
    entityId: connId,
    actor: actor || requestData.senderName,
    details: `Đối tác [${requestData.senderCompany || requestData.senderName}] gửi yêu cầu kết nối tới nhà máy [${requestData.factoryName}]. Chủ đề: ${requestData.requirementTitle || requestData.targetType}`
  });

  return {
    success: true,
    connectionId: connId,
    message: 'Yêu cầu kết nối đã được gửi đến Bàn Điều Phối CCU để xác minh và chuyển giao an toàn tới nhà máy.'
  };
}

export function getAllFactoryConnectionRequests(factoryId = null) {
  if (isCloudBrowser()) return getPrivateSubmissions('factoryConnection').filter(row => !factoryId || row.factoryId === factoryId);
  if (factoryId) {
    return inMemoryFactoryConnectionRequests.filter(r => r.factoryId === factoryId);
  }
  return inMemoryFactoryConnectionRequests;
}

/**
 * Lấy danh sách các nhà máy khác cùng một Doanh nghiệp sở hữu (Section 2, 32 Spec 29.txt)
 */
export function getSiblingFactories(organizationId, currentFactoryId) {
  if (!organizationId) return [];
  return inMemoryFactoryProfiles
    .filter(p => p.organizationId === organizationId && p.id !== currentFactoryId && p.factorySlug !== currentFactoryId)
    .map(p => ({
      id: p.id,
      slug: p.factorySlug,
      name: p.factoryName,
      industrialParkName: p.industrialParkName,
      province: p.province,
      productionDescription: p.productionDescription,
      hasSupplierRole: p.hasSupplierRole
    }));
}

// ----------------------------------------------------------------------------
// 2. HELPER: BỔ TRỢ HỆ SINH THÁI NHÀ MÁY (BUY SIDE & SELL SIDE)
// TUÂN THỦ SECTION 5, 8, 9, 10, 11, 12, 13 SPEC 28.TXT & SPEC 29.TXT
// ----------------------------------------------------------------------------

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

/**
 * Kiểm tra xem Factory có nhu cầu mua hàng công khai hay không (Section 10)
 * QUY TẮC BẢO MẬT: Chỉ tính Requirement dạng PUBLIC_SUMMARY, lọc bỏ mọi dữ liệu kín (Section 9, 38)
 */
export function getPublicRequirementsForFactory(factoryId, organizationId = null) {
  const allReqs = getAllMasterRequirements();
  return allReqs.filter(r => {
    if (r.moderationStatus === 'REJECTED' || r.status === 'CLOSED') return false;
    // Kiểm tra match theo buyerOrganizationId hoặc factoryId
    const isOwner = (organizationId && r.buyerOrganizationId === organizationId) || 
                    (r.factoryId === factoryId);
    return isOwner && (r.isPublicSummary === true || r.visibility === 'PUBLIC_SUMMARY');
  }).map(req => {
    // Sanitization: Ensure NO private fields (buyer phone, email, internal budget, target price) are exposed
    return {
      id: req.id,
      publicCode: req.publicCode || req.id,
      title: req.title,
      category: req.category,
      categorySlug: req.categorySlug,
      productService: req.productService,
      quantity: req.allowPublicQuantity ? req.quantity : null,
      unit: req.allowPublicQuantity ? req.unit : null,
      province: req.province,
      location: req.location,
      industrialPark: req.allowPublicIndustrialPark ? req.industrialPark : null,
      deadline: req.deadline,
      publicSummary: req.publicSummary,
      publicRequirements: req.publicRequirements || [],
      status: req.status,
      visibility: req.visibility,
      isPublicSummary: true,
      publishedAt: req.publishedAt,
      responseDeadline: req.responseDeadline,
      buyerSummary: req.buyerInfo?.buyerSummary,
      allowPublicCompanyName: req.buyerInfo?.allowPublicCompanyName !== false
    };
  });
}

/**
 * Lấy các sự kiện dành cho Nhà máy (Section 20)
 * Lọc theo targetRole: BUYER hoặc FACTORY
 */
export function getProgramsForFactory(factory = null) {
  const allProgs = getAllPrograms();
  return allProgs.filter(p => {
    const roles = p.targetRoles || [];
    const isTarget = roles.includes(TARGET_ROLES_ENUM.BUYER) || 
                     roles.includes('FACTORY') || 
                     roles.includes(TARGET_ROLES_ENUM.SUPPLIER);
    if (!isTarget) return false;

    if (factory && factory.province) {
      const pLoc = (p.location || '').toLowerCase();
      const matchLoc = pLoc.includes(factory.province.toLowerCase());
      return matchLoc || p.industrialParkId === factory.industrialParkId;
    }
    return true;
  });
}

/**
 * Chuyển đổi một bản ghi raw factory thành Entity Hệ Sinh Thái đầy đủ
 */
export function enrichFactoryEntity(raw) {
  const id = raw.id || `fac-${raw.no || 0}`;
  const rawSlug = raw.slug || slugify(raw.name) || id;

  // Tìm FactoryProfile nếu đã được đăng ký quản lý
  const profile = inMemoryFactoryProfiles.find(p => 
    p.factorySlug === rawSlug || p.id === id || (raw.organizationId && p.organizationId === raw.organizationId) || (raw.factorySlug && p.factorySlug === raw.factorySlug)
  );

  const slug = profile?.factorySlug || raw.slug || rawSlug;

  // Tìm Organization gốc nếu có (Section 2, 32 Spec 29.txt)
  const allOrgs = getAllOrganizations();
  const matchedOrg = allOrgs.find(o => 
    o.id === raw.organizationId || (profile?.organizationId && o.id === profile.organizationId) || o.name?.toLowerCase() === raw.name?.toLowerCase()
  );

  const orgId = matchedOrg ? matchedOrg.id : (profile?.organizationId || raw.organizationId || `ORG-${slug.slice(0, 16).toUpperCase()}`);
  
  const kcnSourceId = raw.kcnId || profile?.industrialParkId;
  const canonicalKcnId = kcnSourceId ? resolveCanonicalKcnId(kcnSourceId) : null;
  const kcnName = raw.kcnName || profile?.industrialParkName || null;

  // Xác định multi-roles: Nhà máy, Cung ứng, Mua hàng (Section 1, 2)
  const isSupplierRole = Boolean(matchedOrg?.roles?.includes('SUPPLIER') || profile?.hasSupplierRole);
  const publicNeeds = getPublicRequirementsForFactory(id, orgId);
  const hasPublicNeeds = publicNeeds.length > 0;

  // Sản phẩm đầu ra
  const outputProductsDetailed = profile?.outputProducts || [];
  const outputProductsSummary = profile?.outputProductsSummary || (raw.industry ? [`Sản phẩm thuộc ngành ${raw.industry}`] : []);

  const orgRoles = matchedOrg?.roles || ['FACTORY'];
  const finalRoles = Array.from(new Set([
    'FACTORY',
    ...orgRoles.filter(r => r === 'SUPPLIER' || r === 'BUYER' || r === 'FACTORY'),
    ...(hasPublicNeeds ? ['BUYER'] : []),
    ...(isSupplierRole ? ['SUPPLIER'] : [])
  ]));

  // Doanh nghiệp chủ quản (Organization Parent - Section 32, 33)
  const ownerOrganization = matchedOrg ? {
    id: matchedOrg.id,
    name: matchedOrg.name,
    legalName: matchedOrg.legalName || matchedOrg.name,
    taxCode: matchedOrg.taxCode || '0314567890',
    website: matchedOrg.website || null,
    logo: matchedOrg.logo || null,
    province: matchedOrg.province,
    address: matchedOrg.address,
    orgType: matchedOrg.orgType || 'Doanh nghiệp sản xuất',
    isClaimed: matchedOrg.isClaimed === true,
    roles: matchedOrg.roles || ['FACTORY']
  } : {
    id: orgId,
    name: raw.name,
    legalName: raw.name,
    taxCode: '0310000000',
    website: null,
    logo: null,
    province: raw.province || 'Đồng Nai',
    address: raw.address || raw.name,
    orgType: 'Doanh nghiệp sản xuất',
    isClaimed: false,
    roles: ['FACTORY']
  };

  // Danh sách nhà máy anh em cùng doanh nghiệp (Section 2, 32)
  const siblingFactories = getSiblingFactories(orgId, id);

  return {
    id,
    slug,
    name: raw.name,
    organizationId: orgId,
    ownerOrganization,
    siblingFactories,
    facilityCode: profile?.facilityCode || `FAC-${id}`,
    no: raw.no || 1,
    hasProfile: Boolean(profile),
    profileId: profile?.id || null,
    industry: raw.industry || profile?.industryCategories?.[0] || 'Chế biến chế tạo & Phụ trợ công nghiệp',
    type: raw.type || 'FDI',
    province: raw.province || profile?.province || 'Đồng Nai',
    region: raw.region || 'Miền Nam',
    address: raw.address || profile?.province || raw.name,
    foundedYear: raw.foundedYear || '2015',
    status: raw.status || 'Đang hoạt động',
    rating: raw.rating || '4.8',
    isVerified: raw.isVerified !== false,
    
    // KCN relation (Section 14: chỉ dùng relation đã xác thực)
    industrialParkId: canonicalKcnId,
    industrialParkName: kcnName,
    isKcnConfirmed: Boolean(canonicalKcnId),

    // Multi-role flags (Section 1, 2, 8)
    roles: finalRoles,
    hasPublicNeeds,
    publicNeedsCount: publicNeeds.length,
    publicNeedsList: publicNeeds,

    hasSupplierCapability: isSupplierRole,
    supplierCapabilities: matchedOrg?.capabilities || [
      'Gia công cơ khí chính xác theo bản vẽ',
      'Dây chuyền lắp ráp công nghiệp đạt tiêu chuẩn ISO 9001'
    ],

    // Output Products & Capabilities (Section 16, 19, 20, 21)
    outputProducts: outputProductsSummary,
    outputProductsDetailed,
    capabilitiesDetail: profile?.capabilitiesDetail || {
      processCapabilities: matchedOrg?.capabilities || ['Gia công / Sản xuất trực tiếp theo đơn'],
      equipmentList: [],
      capacity: { value: 'Theo đơn đặt hàng B2B', source: 'Doanh nghiệp cung cấp', updatedAt: '2026-09-20', visibility: 'PUBLIC' },
      qualityStandards: ['ISO 9001:2015']
    },
    facilityInfo: profile?.facilityInfo || {
      landArea: raw.type === 'FDI' ? '25.000 m²' : '8.000 m²',
      productionArea: raw.type === 'FDI' ? '18.000 m²' : '5.000 m²',
      warehouseArea: '2.500 m²',
      productionLinesCount: 4
    },
    productionDescription: profile?.productionDescription || (raw.industry ? `Nhà máy hoạt động trong lĩnh vực ${raw.industry} tại ${raw.province}.` : ''),
    productDataStatus: profile?.productDataStatus || PRODUCT_DATA_STATUS_ENUM.SELF_DECLARED,
    manufacturingTypes: profile?.manufacturingTypes || ['Gia công / Sản xuất trực tiếp'],
    oemAvailable: profile?.oemAvailable !== undefined ? profile.oemAvailable : (raw.type === 'FDI' || isSupplierRole),
    odmAvailable: profile?.odmAvailable || false,
    oemDetails: profile?.oemDetails || (profile?.oemAvailable ? ['Gia công OEM theo bản vẽ kỹ thuật'] : []),
    exportAvailable: profile?.exportAvailable !== undefined ? profile.exportAvailable : (raw.type === 'FDI'),
    exportInfo: profile?.exportInfo || {
      markets: profile?.exportAvailable ? ['Đông Nam Á (ASEAN)'] : [],
      certificates: [],
      incoterms: ['FOB', 'EXW'],
      languages: ['Tiếng Việt', 'English']
    },
    distributionAvailable: profile?.distributionAvailable !== undefined ? profile.distributionAvailable : true,
    distributionInfo: profile?.distributionInfo || {
      channels: ['Cung ứng trực tiếp B2B'],
      seekingDistributors: false
    },
    serviceAreas: profile?.serviceAreas || [raw.province || 'Toàn quốc'],
    evidences: profile?.evidences || [],
    mediaAssets: profile?.mediaAssets || [],
    catalogues: profile?.catalogues || [],

    // Public Profile metadata
    publicProfileStatus: profile?.publicProfileStatus || FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: profile?.updatedAt || '2026-09-28',
    ownerUserId: matchedOrg?.ownerUserId || null
  };
}

// ----------------------------------------------------------------------------
// 3. SEARCH & MULTI-FACET FILTER ENGINE (SECTION 6, 7, 36)
// ----------------------------------------------------------------------------

export function getFactoriesListing(options = {}) {
  const {
    query = '',
    industry = 'all',
    province = 'all',
    industrialParkId = 'all',
    hasPublicRequirements = false,
    hasSupplierCapability = false,
    hasOutputProducts = false,
    hasActivePrograms = false,
    oemAvailable = false,
    exportAvailable = false,
    page = 1,
    pageSize = 18,
    sortBy = 'relevance' // 'relevance' | 'name-asc' | 'year-desc' | 'needs-desc'
  } = options;

  // 1. Tạo các entities từ inMemoryFactoryProfiles (Hồ sơ nhà máy đã được chuẩn hóa)
  const seedEntities = inMemoryFactoryProfiles.map(p => {
    return enrichFactoryEntity({
      id: p.id,
      name: p.factoryName,
      organizationId: p.organizationId,
      industry: p.industryCategories?.[0] || 'Sản xuất công nghiệp phụ trợ',
      province: p.province,
      address: p.province,
      type: p.manufacturingTypes?.[0] || 'Doanh nghiệp sản xuất',
      status: 'Đang hoạt động',
      foundedYear: '2015',
      kcnId: p.industrialParkId,
      kcnName: p.industrialParkName
    });
  });

  // 2. Lấy dữ liệu nền tảng từ factoriesFull
  const rawList = factoriesFullList.map(f => enrichFactoryEntity(f));

  // Ghép và loại bỏ duplicate theo organizationId hoặc slug
  const seenOrgIds = new Set(seedEntities.map(s => s.organizationId));
  const seenSlugs = new Set(seedEntities.map(s => s.slug));

  const filteredRaw = rawList.filter(f => !seenOrgIds.has(f.organizationId) && !seenSlugs.has(f.slug));

  let allEnriched = [...seedEntities, ...filteredRaw];

  // Bổ sung các Organization có role FACTORY nếu chưa có trong danh bạ
  const orgs = getAllOrganizations();
  orgs.filter(o => o.roles?.includes('FACTORY')).forEach(org => {
    const exists = allEnriched.some(e => e.organizationId === org.id);
    if (!exists) {
      allEnriched.push(enrichFactoryEntity({
        id: `fac-${org.id.toLowerCase()}`,
        name: org.name,
        organizationId: org.id,
        industry: org.capabilities?.[0] || 'Sản xuất công nghiệp phụ trợ',
        province: org.province || 'Hồ Chí Minh',
        address: org.address,
        type: 'Kinh tế tư nhân',
        status: 'Đang hoạt động',
        foundedYear: '2016'
      }));
    }
  });

  let results = allEnriched;

  // 1. Search Query (Section 6)
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    const cleanQ = slugify(q);

    results = results.filter(f => {
      const matchName = f.name.toLowerCase().includes(q);
      const matchInd = f.industry.toLowerCase().includes(q);
      const matchKcn = f.industrialParkName && f.industrialParkName.toLowerCase().includes(q);
      const matchLoc = f.province.toLowerCase().includes(q) || f.address.toLowerCase().includes(q);
      const matchProd = f.outputProducts.some(p => p.toLowerCase().includes(q));
      const matchCap = f.supplierCapabilities.some(c => c.toLowerCase().includes(q));

      return matchName || matchInd || matchKcn || matchLoc || matchProd || matchCap;
    });
  }

  // 2. Filter theo Ngành sản xuất (Section 7, 15)
  if (industry && industry !== 'all') {
    const indClean = industry.toLowerCase();
    results = results.filter(f => f.industry.toLowerCase().includes(indClean));
  }

  // 3. Filter theo Tỉnh / Thành phố (Section 7, 19)
  if (province && province !== 'all') {
    const provClean = province.toLowerCase();
    results = results.filter(f => f.province.toLowerCase().includes(provClean));
  }

  // 4. Filter theo KCN (Section 7, 14, 18 - Query confirmed KCN relation)
  if (industrialParkId && industrialParkId !== 'all') {
    const canonicalKcn = resolveCanonicalKcnId(industrialParkId);
    results = results.filter(f => f.industrialParkId === canonicalKcn);
  }

  // 5. Quick Role Chips & Capabilities (Section 7, 8)
  if (hasPublicRequirements) {
    results = results.filter(f => f.hasPublicNeeds);
  }
  if (hasSupplierCapability) {
    results = results.filter(f => f.hasSupplierCapability);
  }
  if (hasOutputProducts) {
    results = results.filter(f => f.outputProducts && f.outputProducts.length > 0);
  }
  if (oemAvailable) {
    results = results.filter(f => f.oemAvailable);
  }
  if (exportAvailable) {
    results = results.filter(f => f.exportAvailable);
  }

  // 6. Sorting: Organic relevance + profile completeness (Section 36)
  // Không ưu tiên Sponsor hay Paid service trong organic search
  if (sortBy === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'year-desc') {
    results.sort((a, b) => parseInt(b.foundedYear || 0, 10) - parseInt(a.foundedYear || 0, 10));
  } else if (sortBy === 'needs-desc') {
    results.sort((a, b) => b.publicNeedsCount - a.publicNeedsCount);
  } else {
    // Default relevance: Profile completeness (Spec 36) + Có nhu cầu public + có KCN relation + có năng lực cung ứng
    results.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.hasProfile) scoreA += 100;
      if (b.hasProfile) scoreB += 100;
      if (a.hasPublicNeeds) scoreA += 50;
      if (b.hasPublicNeeds) scoreB += 50;
      if (a.isKcnConfirmed) scoreA += 30;
      if (b.isKcnConfirmed) scoreB += 30;
      if (a.hasSupplierCapability) scoreA += 20;
      if (b.hasSupplierCapability) scoreB += 20;
      return scoreB - scoreA;
    });
  }

  const total = results.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = results.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

/**
 * Lấy chi tiết một Nhà máy theo ID hoặc Slug
 */
export function getFactoryByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const cleanTerm = slugify(idOrSlug);

  // 1. Tìm trong seed profiles
  const profile = inMemoryFactoryProfiles.find(p => 
    p.factorySlug === cleanTerm || p.id === idOrSlug || p.organizationId === idOrSlug
  );
  if (profile) {
    const rawFac = factoriesFullList.find(f => slugify(f.name) === profile.factorySlug) || {
      id: profile.id,
      name: profile.factoryName,
      organizationId: profile.organizationId,
      province: profile.province,
      kcnId: profile.industrialParkId,
      kcnName: profile.industrialParkName,
      industry: profile.industryCategories?.[0]
    };
    rawFac.organizationId = profile.organizationId;
    return enrichFactoryEntity(rawFac);
  }

  // 2. Tìm trong master JSON
  const found = factoriesFullList.find(f => 
    f.id === idOrSlug || 
    slugify(f.name) === cleanTerm || 
    String(f.no) === String(idOrSlug)
  );

  if (found) {
    return enrichFactoryEntity(found);
  }

  // Fallback lấy item đầu tiên
  return enrichFactoryEntity(factoriesFullList[0]);
}

/**
 * Cập nhật hồ sơ Nhà máy từ Admin (Section 38, 39)
 */
export function updateFactoryProfileAdmin(factoryId, updateData, reviewer = 'Admin') {
  const existingIdx = inMemoryFactoryProfiles.findIndex(p => p.id === factoryId || p.organizationId === factoryId);

  const updatedProfile = {
    ...(existingIdx >= 0 ? inMemoryFactoryProfiles[existingIdx] : {}),
    id: factoryId.startsWith('FP-') ? factoryId : `FP-${factoryId}`,
    organizationId: updateData.organizationId || factoryId,
    factoryName: updateData.factoryName || updateData.name,
    factorySlug: slugify(updateData.factoryName || updateData.name || factoryId),
    industrialParkId: updateData.industrialParkId,
    industryCategories: updateData.industryCategories || [updateData.industry],
    productionDescription: updateData.productionDescription,
    outputProductsSummary: updateData.outputProductsSummary || [],
    oemAvailable: updateData.oemAvailable === true,
    exportAvailable: updateData.exportAvailable === true,
    distributionAvailable: updateData.distributionAvailable === true,
    publicProfileStatus: updateData.publicProfileStatus || FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: new Date().toISOString().slice(0, 10)
  };

  if (existingIdx >= 0) {
    inMemoryFactoryProfiles[existingIdx] = updatedProfile;
  } else {
    inMemoryFactoryProfiles.unshift(updatedProfile);
  }

  // Ghi AuditLog
  logFactoryAudit({
    action: existingIdx >= 0 ? 'UPDATE_FACTORY_PROFILE' : 'CREATE_FACTORY_PROFILE',
    factoryId: updatedProfile.id,
    entityType: 'FACTORY_PROFILE',
    entityId: updatedProfile.id,
    actor: reviewer,
    details: `Admin cập nhật hồ sơ nhà máy [${updatedProfile.factoryName}]. Trạng thái: ${updatedProfile.publicProfileStatus}`
  });

  return updatedProfile;
}

/**
 * Kiểm soát chất lượng dữ liệu nhà máy (Section 41)
 */
export function checkFactoryDataQuality(factory) {
  const warnings = [];
  if (!factory.isKcnConfirmed) {
    warnings.push('Chưa xác thực quan hệ KCN (IndustrialParkFactory relation pending)');
  }
  if (!factory.industry || factory.industry.length < 3) {
    warnings.push('Thiếu thông tin ngành sản xuất chi tiết');
  }
  if (!factory.outputProducts || factory.outputProducts.length === 0) {
    warnings.push('Chưa công bố sản phẩm đầu ra chính');
  }
  if (factory.hasSupplierCapability && (!factory.supplierCapabilities || factory.supplierCapabilities.length === 0)) {
    warnings.push('Hồ sơ năng lực nhà cung ứng (SupplierProfile) chưa đầy đủ');
  }

  return {
    isQualified: warnings.length === 0,
    warningsCount: warnings.length,
    warnings
  };
}
import { websiteSeed } from './websiteSeeds.js';
