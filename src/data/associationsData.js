// ============================================================================
// MASTER DATA & BUSINESS LOGIC ENGINE: HỘI / HIỆP HỘI & TỔ CHỨC KẾT NỐI
// PAGE 24: ROUTE /hoi-hiep-hoi
// Tuân thủ triệt để đặc tả 24.txt - CHUOICUNGUNG.COM
// ============================================================================

import { associations as associationsList, isCloudBrowser, getCloudRecords } from './cloudData.js';
import { persistSubmission, getPrivateSubmissions } from '../services/submissionService.js';
import { getAllOrganizations } from './organizationsData.js';
import { getAllPrograms, PROGRAM_STATUSES_ENUM } from './programsData.js';
import { getAllMasterRequirements } from './requirementsData.js';

// ----------------------------------------------------------------------------
// 1. CANONICAL ENUMS & STORAGE KEYS (SECTIONS 1, 9, 10, 12, 16)
// ----------------------------------------------------------------------------

export const STORAGE_KEYS = {
  ASSOCIATION_PROFILES: 'ccu_association_profiles_v1',
  PROGRAM_ORGANIZATIONS: 'ccu_program_organizations_v1',
  ORGANIZATION_MEMBERSHIPS: 'ccu_organization_memberships_v1',
  ASSOCIATION_AUDIT_LOGS: 'ccu_association_audit_logs_v1'
};

/**
 * Phạm vi hoạt động địa lý / chuyên môn (Section 16)
 */
export const ASSOCIATION_SCOPE_TYPE_ENUM = {
  NATIONAL: 'NATIONAL',                         // Toàn quốc
  REGIONAL: 'REGIONAL',                         // Vùng (Miền Bắc / Nam / Trung)
  PROVINCIAL: 'PROVINCIAL',                     // Tỉnh / Thành phố
  SPECIALIZED_INDUSTRY: 'SPECIALIZED_INDUSTRY'   // Ngành chuyên môn sâu
};

/**
 * Vai trò của Tổ chức trong Chương trình (Section 9)
 */
export const PROGRAM_ORG_ROLE_ENUM = {
  ORGANIZER: 'ORGANIZER',                       // Đơn vị chủ trì tổ chức
  CO_ORGANIZER: 'CO_ORGANIZER',                 // Đơn vị đồng tổ chức
  PARTNER: 'PARTNER',                           // Đối tác chiến lược
  SUPPORTING_ORGANIZATION: 'SUPPORTING_ORGANIZATION', // Đơn vị bảo trợ / hỗ trợ
  OTHER: 'OTHER'
};

/**
 * Trạng thái xác nhận quan hệ Tổ chức ↔ Chương trình (Section 10)
 */
export const PROGRAM_ORG_STATUS_ENUM = {
  PENDING: 'PENDING',                           // Chờ xác nhận (KHÔNG được public)
  CONFIRMED: 'CONFIRMED',                       // Đã xác nhận chính thức
  DECLINED: 'DECLINED',                         // Từ chối tham gia
  ENDED: 'ENDED'                                // Đã hoàn thành/kết thúc
};

/**
 * Trạng thái Hội viên tổ chức (Section 12)
 */
export const MEMBERSHIP_STATUS_ENUM = {
  PENDING: 'PENDING',                           // Chờ phê duyệt (Claim)
  CONFIRMED: 'CONFIRMED',                       // Hội viên chính thức
  ENDED: 'ENDED',                               // Đã chấm dứt tư cách hội viên
  REJECTED: 'REJECTED'                          // Bị từ chối
};

/**
 * Phân loại hội viên
 */
export const MEMBERSHIP_TYPE_ENUM = {
  HOI_VIEN_CHINH_THUC: 'HOI_VIEN_CHINH_THUC',   // Hội viên chính thức
  HOI_VIEN_LIEN_KET: 'HOI_VIEN_LIEN_KET',       // Hội viên liên kết
  HOI_VIEN_DANH_DU: 'HOI_VIEN_DANH_DU'          // Hội viên danh dự
};

// ----------------------------------------------------------------------------
// 2. SEED ASSOCIATION PROFILES (SECTIONS 1, 2, 15, 27, 32)
// QUY TẮC CỨNG SECTION 2: Không copy name, logo, address nếu Organization đã có
// ----------------------------------------------------------------------------

export const SEED_ASSOCIATION_PROFILES = websiteSeed('associationsData.SEED_ASSOCIATION_PROFILES');

// ----------------------------------------------------------------------------
// 3. SEED PROGRAM-ORGANIZATION RELATIONS (SECTIONS 8, 9, 10, 31)
// QUY TẮC CỨNG SECTION 10: Chỉ public role khi status === 'CONFIRMED'
// ----------------------------------------------------------------------------

export const SEED_PROGRAM_ORGANIZATIONS = websiteSeed('associationsData.SEED_PROGRAM_ORGANIZATIONS');

// ----------------------------------------------------------------------------
// 4. SEED ORGANIZATION MEMBERSHIPS (SECTIONS 11, 12, 13)
// QUY TẮC CỨNG SECTION 11:
// - Tham gia Program KHÔNG đồng nghĩa là hội viên
// - Cùng Category KHÔNG đồng nghĩa là hội viên
// - Chỉ hiển thị khi có Membership record status === 'CONFIRMED'
// ----------------------------------------------------------------------------

export const SEED_ORGANIZATION_MEMBERSHIPS = websiteSeed('associationsData.SEED_ORGANIZATION_MEMBERSHIPS');

// ----------------------------------------------------------------------------
// 5. IN-MEMORY RUNTIME REPOSITORIES & HELPERS
// ----------------------------------------------------------------------------

let inMemoryProfiles = [...SEED_ASSOCIATION_PROFILES];
let inMemoryProgramOrgs = [...SEED_PROGRAM_ORGANIZATIONS];
let inMemoryMemberships = [...SEED_ORGANIZATION_MEMBERSHIPS];
let inMemoryAssociationAuditLogs = [];

export function getAllAssociationProfiles() {
  if (isCloudBrowser()) return getCloudRecords('associationProfiles');
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEYS.ASSOCIATION_PROFILES);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(STORAGE_KEYS.ASSOCIATION_PROFILES, JSON.stringify(SEED_ASSOCIATION_PROFILES));
    }
  } catch (err) {}
  return inMemoryProfiles;
}

export function getAllProgramOrganizations() {
  if (isCloudBrowser()) return getCloudRecords('programOrganizations');
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRAM_ORGANIZATIONS);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(STORAGE_KEYS.PROGRAM_ORGANIZATIONS, JSON.stringify(SEED_PROGRAM_ORGANIZATIONS));
    }
  } catch (err) {}
  return inMemoryProgramOrgs;
}

export function getAllOrganizationMemberships() {
  if (isCloudBrowser()) return getCloudRecords('organizationMemberships');
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEYS.ORGANIZATION_MEMBERSHIPS);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION_MEMBERSHIPS, JSON.stringify(SEED_ORGANIZATION_MEMBERSHIPS));
    }
  } catch (err) {}
  return inMemoryMemberships;
}

export function logAssociationAudit({ action, associationId, entityType, entityId, actor, details = '' }) {
  const newLog = {
    id: `AUDIT-ASSOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    associationId,
    entityType,
    entityId,
    actor: actor || 'system',
    details,
    timestamp: new Date().toISOString()
  };

  inMemoryAssociationAuditLogs.unshift(newLog);

  try {
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSOCIATION_AUDIT_LOGS) || '[]');
      existing.unshift(newLog);
      localStorage.setItem(STORAGE_KEYS.ASSOCIATION_AUDIT_LOGS, JSON.stringify(existing.slice(0, 500)));
    }
  } catch (err) {}

  return newLog;
}

export function getAllAssociationAuditLogs(associationId = null) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEYS.ASSOCIATION_AUDIT_LOGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return associationId ? parsed.filter(l => l.associationId === associationId) : parsed;
      }
    }
  } catch (err) {}

  return associationId 
    ? inMemoryAssociationAuditLogs.filter(l => l.associationId === associationId)
    : inMemoryAssociationAuditLogs;
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// 6. MASTER ENTITY RESOLVER (SECTIONS 1, 2, 31, 33, 44.1, 44.3)
// Merge Organization Master + AssociationProfile mà không duplicate
// ----------------------------------------------------------------------------

export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getFullAssociationData(orgIdOrSlug, userContext = null) {
  const allOrgs = getAllOrganizations();
  const allProfiles = getAllAssociationProfiles();
  const allProgOrgs = getAllProgramOrganizations();
  const allMemberships = getAllOrganizationMemberships();
  const allPrograms = getAllPrograms();

  const target = (orgIdOrSlug || '').toString().trim().toLowerCase();
  if (!target) return null;

  // 1. Tìm trong Master Organizations theo ID, slug, hoặc slugify(name)
  let org = allOrgs.find(o => 
    o.id.toLowerCase() === target || 
    (o.slug && o.slug.toLowerCase() === target) ||
    slugify(o.name) === target ||
    slugify(o.name.replace(/\(.*?\)/g, '')) === target
  );

  // 2. Tìm qua AssociationProfile shortName (VD: HAME, VLA, DNBA, VITAS)
  if (!org) {
    const matchedProf = allProfiles.find(p => 
      p.shortName && (p.shortName.toLowerCase() === target || slugify(p.shortName) === target)
    );
    if (matchedProf) {
      org = allOrgs.find(o => o.id === matchedProf.organizationId);
    }
  }

  // 3. Fallback tìm trong associations.json nếu là crawled data
  if (!org) {
    const rawAssoc = associationsList.find(a => 
      a.id.toLowerCase() === target || 
      slugify(a.name) === target ||
      slugify(a.name.replace(/\(.*?\)/g, '')) === target ||
      (a.slug && a.slug.toLowerCase() === target)
    );
    if (rawAssoc) {
      org = {
        id: rawAssoc.id,
        name: rawAssoc.name,
        legalName: rawAssoc.name,
        taxCode: rawAssoc.taxCode || 'Đang cập nhật',
        website: rawAssoc.website || '',
        country: 'Việt Nam',
        province: rawAssoc.region || 'Toàn quốc',
        address: rawAssoc.address || 'Hà Nội, Việt Nam',
        orgType: 'Hội / Hiệp hội',
        logo: rawAssoc.logo || '/logo_onlyc.png',
        roles: ['ASSOCIATION'],
        isClaimed: false,
        isPublished: true,
        completenessScore: 70,
        createdAt: '2026-01-01T00:00:00Z',
        capabilities: ['Kết nối giao thương', 'Hỗ trợ pháp lý hội viên', 'Tổ chức hội thảo'],
        productsServices: ['Chương trình hội viên', 'Sự kiện xúc tiến']
      };
    }
  }

  if (!org) return null;

  // QUY TẮC CỨNG SECTION 44.3: Unpublished Association không public
  const isAuthorized = userContext && (userContext.isAdmin || userContext.role === 'SUPER_ADMIN' || userContext.organizationId === org.id);
  if (org.isPublished === false && !isAuthorized) {
    return null;
  }

  // 3. Lấy AssociationProfile tương ứng
  const profile = allProfiles.find(p => p.organizationId === org.id) || {
    id: `ASSOC-PROF-${org.id}`,
    organizationId: org.id,
    shortName: org.name.split(' ').slice(0, 2).join(' '),
    associationType: 'Hội / Hiệp hội ngành nghề',
    scopeDescription: org.capabilities ? org.capabilities.join(', ') : 'Tổ chức kết nối xúc tiến chuỗi cung ứng.',
    geographicScope: [org.province || 'Toàn quốc'],
    industryScope: org.capabilities || ['Công nghiệp tổng hợp'],
    scopeType: ASSOCIATION_SCOPE_TYPE_ENUM.NATIONAL,
    establishedYear: 2016,
    publicContact: {
      phone: org.phone || '024 3822 5555',
      email: org.email || 'info@chuoicungung.com',
      address: org.address || 'Việt Nam',
      website: org.website || ''
    },
    membershipPublicPolicy: 'Doanh nghiệp đăng ký theo điều lệ ban hành của tổ chức.',
    publishable: true,
    confirmedMembersCount: 200,
    hasCatalogue: false,
    updatedAt: new Date().toISOString()
  };

  // 4. Lấy các chương trình CONFIRMED (Section 10)
  const confirmedProgOrgs = allProgOrgs.filter(
    po => po.organizationId === org.id && po.status === PROGRAM_ORG_STATUS_ENUM.CONFIRMED && po.publicDisplay === true
  );

  const activePrograms = confirmedProgOrgs.map(po => {
    const prog = allPrograms.find(p => p.id === po.programId);
    return {
      programId: po.programId,
      programSlug: po.programSlug,
      title: prog ? prog.title : po.programTitle,
      role: po.role,
      roleLabel: getProgramRoleLabel(po.role),
      status: prog ? prog.status : PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN,
      dates: prog ? prog.dates : 'Tháng 10/2026',
      location: prog ? prog.location : 'Việt Nam'
    };
  });

  // 5. Số hội viên đã xác nhận thực tế (Section 11 & 14)
  const confirmedMembers = allMemberships.filter(
    m => m.associationOrganizationId === org.id && m.status === MEMBERSHIP_STATUS_ENUM.CONFIRMED
  );

  return {
    ...org,
    slug: org.slug || slugify(profile.shortName || org.name),
    profile,
    activePrograms,
    confirmedProgramsCount: activePrograms.length,
    verifiedMembersCount: profile.confirmedMembersCount || confirmedMembers.length,
    confirmedMembersList: confirmedMembers
  };
}

export function getProgramRoleLabel(role) {
  switch (role) {
    case PROGRAM_ORG_ROLE_ENUM.ORGANIZER:
      return 'Đơn vị tổ chức';
    case PROGRAM_ORG_ROLE_ENUM.CO_ORGANIZER:
      return 'Đơn vị đồng tổ chức';
    case PROGRAM_ORG_ROLE_ENUM.PARTNER:
      return 'Đối tác chiến lược';
    case PROGRAM_ORG_ROLE_ENUM.SUPPORTING_ORGANIZATION:
      return 'Đơn vị bảo trợ / hỗ trợ';
    default:
      return 'Đơn vị tham gia';
  }
}

// ----------------------------------------------------------------------------
// 7. LISTING & SEARCH / FILTER ENGINE (SECTIONS 4, 5, 7, 37)
// ----------------------------------------------------------------------------

export function getAssociationsListing(options = {}) {
  const {
    query = '',
    sector = 'all',
    region = 'all',
    scopeType = 'all',
    hasOpenPrograms = false,
    hasCatalogue = false,
    sortBy = 'default' // 'default' (organic) | 'members' | 'programs' | 'az'
  } = options;

  // Lấy các tổ chức có role ASSOCIATION trong master
  const allMasterOrgs = getAllOrganizations().filter(o =>
    Array.isArray(o.roles) && o.roles.includes('ASSOCIATION')
  );

  // Thêm các profiles đã seed
  const seededOrgIds = new Set(allMasterOrgs.map(o => o.id));
  const profiles = getAllAssociationProfiles();
  profiles.forEach(p => {
    if (!seededOrgIds.has(p.organizationId)) {
      // Map từ associations.json
      const full = getFullAssociationData(p.organizationId);
      if (full) {
        allMasterOrgs.push(full);
        seededOrgIds.add(full.id);
      }
    }
  });

  // Bổ sung các bản ghi khác từ associations.json nếu chưa có
  associationsList.slice(0, 15).forEach(raw => {
    if (!seededOrgIds.has(raw.id)) {
      const full = getFullAssociationData(raw.id);
      if (full) {
        allMasterOrgs.push(full);
        seededOrgIds.add(raw.id);
      }
    }
  });

  // Resolve đầy đủ metadata từng Hội
  const fullList = allMasterOrgs.map(o => getFullAssociationData(o.id)).filter(Boolean);

  // Lọc
  const filtered = fullList.filter(item => {
    // 1. Search Query (Section 4)
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchShort = (item.profile?.shortName || '').toLowerCase().includes(q);
      const matchScope = (item.profile?.scopeDescription || '').toLowerCase().includes(q);
      const matchProvince = (item.province || '').toLowerCase().includes(q);
      const matchIndustry = (item.profile?.industryScope || []).some(ind => ind.toLowerCase().includes(q));
      const matchPrograms = (item.activePrograms || []).some(pr => pr.title.toLowerCase().includes(q));

      if (!matchName && !matchShort && !matchScope && !matchProvince && !matchIndustry && !matchPrograms) {
        return false;
      }
    }

    // 2. Sector Filter (Section 5)
    if (sector && sector !== 'all') {
      const s = sector.toLowerCase();
      const combined = `${item.name} ${item.profile?.scopeDescription || ''} ${(item.profile?.industryScope || []).join(' ')}`.toLowerCase();
      if (!combined.includes(s)) return false;
    }

    // 3. Region Filter
    if (region && region !== 'all') {
      const reg = region.toLowerCase();
      const matchProv = (item.province || '').toLowerCase().includes(reg);
      const matchGeo = (item.profile?.geographicScope || []).some(g => (typeof g === 'string' ? g : String(g?.name || g || '')).toLowerCase().includes(reg));
      if (!matchProv && !matchGeo) return false;
    }

    // 4. Scope Type Filter (Section 5: Quốc gia, Vùng, Tỉnh/thành, Chuyên ngành)
    if (scopeType && scopeType !== 'all') {
      if (item.profile?.scopeType !== scopeType) return false;
    }

    // 5. Có chương trình đang mở
    if (hasOpenPrograms) {
      if (!item.activePrograms || item.activePrograms.length === 0) return false;
    }

    // 6. Có catalogue
    if (hasCatalogue) {
      if (!item.profile?.hasCatalogue) return false;
    }

    return true;
  });

  // Section 37: Organic Sorting (Mặc định không ưu tiên vì Sponsor/Founding Partner)
  filtered.sort((a, b) => {
    if (sortBy === 'programs') {
      return (b.activePrograms?.length || 0) - (a.activePrograms?.length || 0);
    }
    if (sortBy === 'members') {
      return (b.verifiedMembersCount || 0) - (a.verifiedMembersCount || 0);
    }
    if (sortBy === 'az') {
      return (a.name || '').localeCompare(b.name || '');
    }
    // Mặc định organic: Ưu tiên có chương trình active > độ hoàn thiện hồ sơ
    const aScore = (a.activePrograms?.length || 0) * 10 + (a.completenessScore || 50);
    const bScore = (b.activePrograms?.length || 0) * 10 + (b.completenessScore || 50);
    return bScore - aScore;
  });

  return {
    total: filtered.length,
    associations: filtered
  };
}

// ----------------------------------------------------------------------------
// 8. MEMBERSHIP CLAIM & VERIFICATION (SECTIONS 11, 12, 13, 30)
// QUY TẮC CỨNG SECTION 13 & 30: KHÔNG AUTO APPROVE
// ----------------------------------------------------------------------------

export async function submitMembershipClaim({
  associationOrganizationId,
  memberOrganizationId,
  memberOrganizationName,
  requesterName,
  requesterEmail,
  requesterPhone,
  membershipType = MEMBERSHIP_TYPE_ENUM.HOI_VIEN_CHINH_THUC,
  evidenceNotes = ''
}) {
  if (!associationOrganizationId || !memberOrganizationName || !memberOrganizationName.trim()) {
    throw new Error('Vui lòng chọn Hiệp hội và nhập tên doanh nghiệp của bạn.');
  }
  if (!requesterName || !requesterPhone) {
    throw new Error('Vui lòng nhập họ tên và số điện thoại người đại diện đề nghị liên kết.');
  }

  const allMemberships = getAllOrganizationMemberships();
  const claimId = `MEMB-CLAIM-${Date.now()}`;

  const newClaim = {
    id: claimId,
    associationOrganizationId,
    memberOrganizationId: memberOrganizationId || `ORG-GUEST-${Date.now()}`,
    memberOrganizationName: memberOrganizationName.trim(),
    membershipType,
    // Quy tắc Section 13: KHÔNG AUTO APPROVE
    status: MEMBERSHIP_STATUS_ENUM.PENDING,
    startDate: null,
    endDate: null,
    source: 'PORTAL_CLAIM',
    evidenceNotes: evidenceNotes.trim(),
    requester: {
      name: requesterName.trim(),
      email: requesterEmail ? requesterEmail.trim() : '',
      phone: requesterPhone.trim()
    },
    publicDisplay: false, // Chưa duyệt tuyệt đối không public
    confirmedBy: null,
    confirmedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isCloudBrowser()) {
    const claim = await persistSubmission('membershipClaim', newClaim);
    return { success: true, claimId: claim.id, claim, message: 'Đề nghị đã lưu và đang chờ Ban Thư ký thẩm tra.' };
  }
  allMemberships.unshift(newClaim);
  inMemoryMemberships = allMemberships;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION_MEMBERSHIPS, JSON.stringify(allMemberships));
    }
  } catch (err) {}

  // Ghi Audit Log (Section 41.13)
  logAssociationAudit({
    action: 'SUBMIT_MEMBERSHIP_CLAIM',
    associationId: associationOrganizationId,
    entityType: 'MEMBERSHIP_CLAIM',
    entityId: claimId,
    actor: requesterEmail || requesterPhone,
    details: `Doanh nghiệp [${memberOrganizationName}] gửi đề nghị liên kết hội viên.`
  });

  return {
    success: true,
    claimId,
    claim: newClaim,
    message: 'Đề nghị liên kết hội viên đã được gửi thành công và đang chờ Ban Thư Ký Hiệp Hội thẩm tra.'
  };
}

export function reviewMembershipClaimAdmin(claimId, decision, { reviewer = 'admin_super', notes = '' } = {}) {
  const allMemberships = getAllOrganizationMemberships();
  const index = allMemberships.findIndex(m => m.id === claimId);
  if (index === -1) {
    throw new Error(`Không tìm thấy hồ sơ claim: ${claimId}`);
  }

  const target = allMemberships[index];
  let newStatus = MEMBERSHIP_STATUS_ENUM.PENDING;
  let publicDisplay = false;

  if (decision === 'APPROVE') {
    newStatus = MEMBERSHIP_STATUS_ENUM.CONFIRMED;
    publicDisplay = true;
    target.startDate = new Date().toISOString().split('T')[0];
    target.confirmedBy = reviewer;
    target.confirmedAt = new Date().toISOString();
  } else if (decision === 'REJECT') {
    newStatus = MEMBERSHIP_STATUS_ENUM.REJECTED;
    publicDisplay = false;
  } else if (decision === 'REQUEST_MORE_INFO') {
    newStatus = MEMBERSHIP_STATUS_ENUM.PENDING;
    publicDisplay = false;
  }

  target.status = newStatus;
  target.publicDisplay = publicDisplay;
  target.reviewNotes = notes;
  target.updatedAt = new Date().toISOString();

  allMemberships[index] = target;
  inMemoryMemberships = allMemberships;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION_MEMBERSHIPS, JSON.stringify(allMemberships));
    }
  } catch (err) {}

  logAssociationAudit({
    action: `REVIEW_CLAIM_${decision}`,
    associationId: target.associationOrganizationId,
    entityType: 'MEMBERSHIP_CLAIM',
    entityId: claimId,
    actor: reviewer,
    details: `Admin xử lý đề nghị hội viên: [${decision}]. Ghi chú: ${notes || 'Hồ sơ đạt yêu cầu.'}`
  });

  return { success: true, claim: target };
}

export const reviewMembershipClaim = (claimId, decision, reviewer, notes) =>
  reviewMembershipClaimAdmin(claimId, decision, { reviewer, notes });

export function getMembershipReviewQueue(associationOrgId = null) {
  const all = getAllOrganizationMemberships();
  return all.filter(m => {
    if (associationOrgId && m.associationOrganizationId !== associationOrgId) return false;
    return m.status === MEMBERSHIP_STATUS_ENUM.PENDING;
  });
}

// ----------------------------------------------------------------------------
// 9. CHECK MEMBERSHIP STATUS (SECTION 11 HARD RULE)
// ----------------------------------------------------------------------------

export function checkMembershipStatus(associationOrgId, targetOrgId) {
  if (!associationOrgId || !targetOrgId) return false;
  const allMemberships = getAllOrganizationMemberships();
  const match = allMemberships.find(
    m => m.associationOrganizationId === associationOrgId &&
         m.memberOrganizationId === targetOrgId &&
         m.status === MEMBERSHIP_STATUS_ENUM.CONFIRMED
  );
  return !!match;
}

// ----------------------------------------------------------------------------
// 10. PUBLIC REQUIREMENTS INTEGRATION (SECTION 19)
// QUY TẮC CỨNG SECTION 19: Tuyệt đối KHÔNG lộ Buyer identity, private contact,
// budget kín hay file bảo mật
// ----------------------------------------------------------------------------

export function getPublicRequirementsForAssociation(associationOrgId) {
  const assoc = getFullAssociationData(associationOrgId);
  if (!assoc) return [];

  const allReqs = getAllMasterRequirements();
  const industryKeywords = (assoc.profile?.industryScope || assoc.capabilities || ['cơ khí', 'chế tạo', 'công nghiệp']).map(i => i.toLowerCase());

  // Lọc requirement phù hợp lĩnh vực nhưng sanitize thông tin nhạy cảm (Section 19)
  const matched = allReqs.filter(r => {
    if (r.moderationStatus === 'REJECTED' || r.status === 'CLOSED') return false;
    const catStr = `${r.title || ''} ${r.category || ''} ${r.productService || ''} ${r.keyword || ''} ${r.publicSummary || ''}`.toLowerCase();
    return industryKeywords.some(k => {
      const lowerK = k.toLowerCase();
      if (catStr.includes(lowerK)) return true;
      const words = lowerK.split(/[\s,&-]+/).filter(w => w.length >= 3);
      return words.some(w => catStr.includes(w));
    });
  });

  // Sanitize data (Section 19: Không lộ Buyer contact, budget, quotes)
  return matched.slice(0, 5).map(r => ({
    id: r.id,
    title: r.title,
    category: r.category || 'Công nghiệp chế tạo',
    quantity: `${r.quantity || ''} ${r.unit || ''}`.trim() || 'Theo đợt cung ứng',
    deliveryLocation: `${r.industrialPark ? r.industrialPark + ', ' : ''}${r.province || r.location || 'Việt Nam'}`,
    deadline: r.deadline || '30/11/2026',
    sanitizedBuyerRole: r.buyerInfo?.buyerSummary || 'Đại diện phòng Mua hàng Nhà máy FDI', // Ẩn danh tính cá nhân
    status: r.status || 'ACTIVE_SOURCING',
    confidentialBudgetProtected: true,
    privateContactProtected: true
  }));
}

// ----------------------------------------------------------------------------
// 11. RBAC PERMISSIONS (SECTION 33)
// ----------------------------------------------------------------------------

export function canUserAccessAssociationData(userContext, associationOrgId, resourceType) {
  if (!userContext) return resourceType === 'PUBLIC_PROFILE';

  // Super Admin có full quyền
  if (userContext.isAdmin || userContext.role === 'SUPER_ADMIN') return true;

  // Quyền truy cập của chính Hội đó
  const isAssocOwner = userContext.organizationId === associationOrgId && userContext.roles?.includes('ASSOCIATION');

  switch (resourceType) {
    case 'PUBLIC_PROFILE':
    case 'CONFIRMED_PROGRAMS':
    case 'PUBLIC_CATALOGUE':
      return true;
    case 'CONFIRMED_MEMBERSHIP_ROSTER':
      return isAssocOwner || userContext.isStaff;
    case 'MEMBERSHIP_CLAIMS_QUEUE':
      return isAssocOwner || userContext.isStaff;
    // QUY TẮC CỨNG SECTION 33: Hội KHÔNG mặc định xem báo giá hoặc Buyer CRM kín
    case 'MEMBER_PRIVATE_QUOTATIONS':
    case 'BUYER_CRM_DEALS':
    case 'MEMBER_PRIVATE_REQUIREMENTS':
      return false;
    default:
      return false;
  }
}

// ----------------------------------------------------------------------------
// 13. SUPPLIER GROUPS MODEL & DATA (SECTIONS 18, 19, 20 SPEC 25.TXT)
// ----------------------------------------------------------------------------

export const SEED_SUPPLIER_GROUPS = websiteSeed('associationsData.SEED_SUPPLIER_GROUPS');

// ----------------------------------------------------------------------------
// 14. CONNECTION CASES MODEL & DATA (SECTIONS 23 & 24 SPEC 25.TXT)
// QUY TẮC CỨNG: Chỉ public khi có consentStatus === 'GRANTED' và outcome xác nhận
// ----------------------------------------------------------------------------

export const SEED_ASSOCIATION_CASES = websiteSeed('associationsData.SEED_ASSOCIATION_CASES');

export function getSupplierGroupsForAssociation(associationOrgId) {
  return SEED_SUPPLIER_GROUPS.filter(g => g.associationOrganizationId === associationOrgId && g.status === 'ACTIVE');
}

export function getConnectionCasesForAssociation(associationOrgId) {
  return SEED_ASSOCIATION_CASES.filter(c =>
    c.associationOrganizationId === associationOrgId &&
    c.publishStatus === 'PUBLISHED' &&
    c.consentStatus === 'GRANTED'
  );
}

export function getConfirmedMembersForAssociation(associationOrgId) {
  const allMemberships = getAllOrganizationMemberships();
  const allOrgs = getAllOrganizations();

  // QUY TẮC CỨNG SECTION 8 & 9: Chỉ lấy status === 'CONFIRMED' AND publicDisplay === true
  const confirmed = allMemberships.filter(m =>
    m.associationOrganizationId === associationOrgId &&
    m.status === MEMBERSHIP_STATUS_ENUM.CONFIRMED &&
    m.publicDisplay === true
  );

  return confirmed.map(m => {
    const org = allOrgs.find(o => o.id === m.memberOrganizationId);
    return {
      membershipId: m.id,
      memberOrganizationId: m.memberOrganizationId,
      companyName: org ? org.name : m.memberOrganizationName,
      logo: org ? org.logo : null,
      category: org?.capabilities?.[0] || 'Công nghiệp phụ trợ',
      location: org?.province || org?.address || 'Việt Nam',
      roles: org?.roles || ['SUPPLIER'],
      capabilities: org?.capabilities || ['Gia công theo yêu cầu'],
      startDate: m.startDate || '2024-01-01',
      membershipType: m.membershipType
    };
  });
}

export function getDetailedProgramsForAssociation(associationOrgId) {
  const allProgOrgs = getAllProgramOrganizations();
  const allPrograms = getAllPrograms();

  const rels = allProgOrgs.filter(po =>
    po.organizationId === associationOrgId &&
    po.status === PROGRAM_ORG_STATUS_ENUM.CONFIRMED &&
    po.publicDisplay === true
  );

  const openPrograms = [];
  const completedPrograms = [];

  rels.forEach(po => {
    const prog = allPrograms.find(p => p.id === po.programId);
    if (!prog) return;

    const mapped = {
      id: prog.id,
      slug: prog.slug || prog.id,
      title: prog.title,
      dates: prog.dates,
      location: prog.location,
      status: prog.status,
      role: po.role,
      roleLabel: getProgramRoleLabel(po.role),
      coverImage: prog.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    };

    if (prog.status === PROGRAM_STATUSES_ENUM.COMPLETED) {
      completedPrograms.push(mapped);
    } else {
      openPrograms.push(mapped);
    }
  });

  return { openPrograms, completedPrograms };
}

// ----------------------------------------------------------------------------
// 15. MEMBERSHIP EXPORT WITH STRICT RBAC (SECTIONS 40, 41, 44.14 SPEC 25.TXT)
// ----------------------------------------------------------------------------

export function exportMembershipRoster(associationOrgId, userContext) {
  if (!userContext || !userContext.isAuthenticated) {
    throw new Error('Yêu cầu đăng nhập tài khoản có thẩm quyền để xuất danh bạ hội viên.');
  }

  // Super Admin hoặc Trưởng ban Hiệp hội được cấp quyền
  const isSuperAdmin = userContext.isAdmin || userContext.role === 'SUPER_ADMIN';
  const isAssocManager = userContext.organizationId === associationOrgId && userContext.hasExportPermission === true;

  if (!isSuperAdmin && !isAssocManager) {
    throw new Error('Quyền hạn bị từ chối: Tài khoản của bạn không có quyền trích xuất dữ liệu danh bạ hội viên (Export Permission Enforced).');
  }

  const members = getConfirmedMembersForAssociation(associationOrgId);

  // Ghi AuditLog thao tác Export (Section 41 & 44.14)
  logAssociationAudit({
    action: 'EXPORT_MEMBERSHIP_ROSTER',
    associationId: associationOrgId,
    entityType: 'MEMBERSHIP_ROSTER',
    entityId: `EXPORT-${Date.now()}`,
    actor: userContext.email || userContext.userId || 'admin_user',
    details: `Trích xuất dữ liệu ${members.length} hội viên đã xác thực.`
  });

  return {
    success: true,
    count: members.length,
    exportedAt: new Date().toISOString(),
    data: members
  };
}
import { websiteSeed } from './websiteSeeds.js';
