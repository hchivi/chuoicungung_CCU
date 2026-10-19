import { privateBrowserStorage } from "../services/privateBrowserStorage.js";
// ============================================================================
import { isCloudBrowser, getCloudRecords } from './cloudData.js';
import { persistSubmission, getPrivateSubmissions } from '../services/submissionService.js';
// MASTER REQUIREMENTS & PUBLIC B2B DEMANDS SERVICE
// PAGE 11: SÀN NHU CẦU (/san-nhu-cau)
// Chuẩn hóa theo spec 11.txt - CHUOICUNGUNG.COM
// ============================================================================

// Storage keys
const STORAGE_KEYS = {
  MASTER_REQUIREMENTS: 'ccu_master_requirements_v2',
  SUPPLIER_RESPONSES: 'ccu_supplier_requirement_responses',
  AUDIT_LOGS: 'ccu_requirement_audit_logs',
  SUPPLIER_MATCHES: 'ccu_supplier_matches',
  USER_SESSION: 'ccu_user_session'
};

// ----------------------------------------------------------------------------
// 1. SEED REQUIREMENTS (Dữ liệu gốc chuẩn hóa B2B)
// ----------------------------------------------------------------------------
export const SEED_REQUIREMENTS = websiteSeed('requirementsData.SEED_REQUIREMENTS');

// ----------------------------------------------------------------------------
// 2. DATA SANITIZATION SERVICE (ENFORCE SECURITY AT DATA LAYER)
// ----------------------------------------------------------------------------
/**
 * Chuyển đổi Requirement gốc thành Public Summary an toàn tuyệt đối.
 * Loại bỏ toàn bộ thông tin nhạy cảm (Tên cá nhân, SĐT, Email, Ngân sách nội bộ,
 * Target price, Ghi chú nội bộ, File mật) trước khi hiển thị trên Sàn Nhu Cầu.
 */
export function toPublicRequirementSummary(rawRequirement) {
  if (!rawRequirement) return null;

  // Quyết định tên hiển thị của Buyer:
  // Nếu buyer chưa cho phép công bố tên công ty, trả về tóm tắt ẩn danh
  let buyerDisplayName = rawRequirement.buyerInfo?.buyerSummary || 'Nhà máy sản xuất B2B trong nước';
  if (rawRequirement.buyerInfo?.allowPublicCompanyName && rawRequirement.buyerInfo?.companyName) {
    buyerDisplayName = rawRequirement.buyerInfo.companyName;
  }

  return {
    id: rawRequirement.id,
    publicCode: rawRequirement.publicCode || rawRequirement.biddingCode || `NC-${rawRequirement.id}`,
    title: rawRequirement.title,
    category: rawRequirement.category,
    categorySlug: rawRequirement.categorySlug,
    keyword: rawRequirement.keyword || rawRequirement.productService,
    keywordSlug: rawRequirement.keywordSlug,
    stageId: rawRequirement.stageId,
    stageName: rawRequirement.stageName,
    productService: rawRequirement.productService,
    quantity: rawRequirement.allowPublicQuantity !== false ? rawRequirement.quantity : null,
    unit: rawRequirement.unit || 'sản phẩm',
    province: rawRequirement.province || rawRequirement.location,
    location: rawRequirement.province || rawRequirement.location,
    industrialPark: rawRequirement.allowPublicIndustrialPark !== false ? rawRequirement.industrialPark : null,
    deadline: rawRequirement.deadline,
    sampleRequired: !!rawRequirement.sampleRequired,
    surveyRequired: !!rawRequirement.surveyRequired,
    publicSummary: rawRequirement.publicSummary || rawRequirement.description || '',
    publicRequirements: Array.isArray(rawRequirement.publicRequirements) ? rawRequirement.publicRequirements : [],
    status: rawRequirement.status || 'ACTIVE_SOURCING',
    visibility: rawRequirement.visibility || 'PUBLIC_SUMMARY',
    publishedAt: rawRequirement.publishedAt || new Date().toISOString(),
    responseDeadline: rawRequirement.responseDeadline || rawRequirement.deadline,
    buyerDisplayName: buyerDisplayName,
    // Số lượng phản hồi thật (được đếm từ cơ sở dữ liệu response)
    responsesCount: getRequirementResponsesCount(rawRequirement.id)
  };
}

// ----------------------------------------------------------------------------
// 3. RETRIEVE MASTER REQUIREMENTS (TÍCH HỢP DB / LOCALSTORAGE)
// ----------------------------------------------------------------------------
export function getAllMasterRequirements() {
  if (isCloudBrowser()) return getCloudRecords('publicRequirements');
  let requirements = [...SEED_REQUIREMENTS];
  try {
    if (typeof localStorage !== 'undefined') {
      const customListStr = privateBrowserStorage.getItem(STORAGE_KEYS.MASTER_REQUIREMENTS);
    if (customListStr) {
      const parsed = JSON.parse(customListStr);
      // Gộp các requirement tùy biến mới thêm
      const ids = new Set(requirements.map(r => r.id));
      parsed.forEach(item => {
        if (!ids.has(item.id)) {
          requirements.unshift(item);
        }
      });
    }

    // Tích hợp cả nhu cầu do người dùng vừa đăng qua /dang-nhu-cau
    const userDemandsStr = privateBrowserStorage.getItem('ccu_user_demands');
    if (userDemandsStr) {
      const userDemands = JSON.parse(userDemandsStr);
      userDemands.forEach(d => {
        const existingIdx = requirements.findIndex(r => r.id === d.id);
        const mapped = {
          id: d.id,
          publicCode: d.publicCode || `NC-${d.id.replace('REQ-', '')}`,
          title: d.title,
          category: d.category || 'Sản phẩm & Dịch vụ công nghiệp',
          categorySlug: d.categorySlug || 'san-pham-cong-nghiep',
          keyword: d.productService || d.title,
          stageId: Number(d.stageId) || 4,
          stageName: `Giai đoạn ${d.stageId || 4}`,
          productService: d.productService,
          quantity: d.quantity,
          unit: d.unit,
          allowPublicQuantity: true,
          province: d.province || d.location || 'Toàn quốc',
          location: d.location || d.province || 'Toàn quốc',
          industrialPark: d.kcn || d.industrialParkId || null,
          allowPublicIndustrialPark: true,
          deadline: d.deadline,
          sampleRequired: !!d.sampleRequired,
          surveyRequired: !!d.surveyRequired,
          publicSummary: d.specifications || d.title,
          publicRequirements: d.certificationRequirements ? [d.certificationRequirements] : [],
          status: d.status === 'CLOSED' ? 'CLOSED' : 'ACTIVE_SOURCING',
          visibility: d.visibility || 'ONLY_MATCHED',
          moderationStatus: d.visibility === 'PUBLIC' ? 'APPROVED' : 'PENDING',
          publishedAt: d.createdAt || new Date().toISOString(),
          buyerInfo: {
            companyName: d.companyName,
            allowPublicCompanyName: false,
            buyerSummary: `Nhà máy tại ${d.location || 'Việt Nam'}`,
            contactPerson: d.contactName,
            phone: d.phone,
            email: d.email,
            internalBudget: `${d.budgetMin || ''} - ${d.budgetMax || ''} VNĐ`
          }
        };

        if (existingIdx >= 0) {
          requirements[existingIdx] = mapped;
        } else {
          requirements.unshift(mapped);
        }
      });
    }
    }
  } catch (e) {
    console.warn('Lỗi đọc master requirements:', e);
  }
  return requirements;
}

// ----------------------------------------------------------------------------
// 4. PUBLIC SOURCING QUERY (ÁP DỤNG SECTION 2 & 4)
// ----------------------------------------------------------------------------
/**
 * Lấy danh sách nhu cầu được phép hiển thị trên Sàn Nhu Cầu (/san-nhu-cau).
 * Bắt buộc thỏa mãn:
 * 1. visibility === 'PUBLIC_SUMMARY' (hoặc 'PUBLIC')
 * 2. status !== 'CLOSED' && status !== 'CANCELLED' (trừ khi lọc theo trạng thái)
 * 3. moderationStatus === 'APPROVED'
 * TUYỆT ĐỐI LOẠI BỎ: PRIVATE, MATCHED_SUPPLIERS_ONLY / ONLY_MATCHED
 */
export function getPublicRequirements(filters = {}) {
  const all = getAllMasterRequirements();

  // 1. Lọc điều kiện bắt buộc theo quy định công bố
  const publicOnly = all.filter(r => {
    const isPublicVisibility = r.visibility === 'PUBLIC_SUMMARY' || r.visibility === 'PUBLIC';
    const isApproved = r.moderationStatus === 'APPROVED';
    return isPublicVisibility && isApproved;
  });

  // 2. Áp dụng các bộ lọc người dùng
  const filtered = publicOnly.filter(r => {
    // Search keyword
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      const matchProduct = (r.productService || '').toLowerCase().includes(q);
      const matchSummary = (r.publicSummary || '').toLowerCase().includes(q);
      const matchCode = (r.publicCode || '').toLowerCase().includes(q);
      const matchCat = (r.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchProduct && !matchSummary && !matchCode && !matchCat) return false;
    }

    // Stage filter
    if (filters.stageId && filters.stageId !== 'all') {
      if (String(r.stageId) !== String(filters.stageId)) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (r.categorySlug !== filters.category && r.category !== filters.category) return false;
    }

    // Province filter
    if (filters.province && filters.province !== 'all') {
      if (!r.province || !r.province.toLowerCase().includes(filters.province.toLowerCase())) return false;
    }

    // Industrial Park filter
    if (filters.industrialPark && filters.industrialPark !== 'all') {
      if (!r.industrialPark || !r.industrialPark.toLowerCase().includes(filters.industrialPark.toLowerCase())) return false;
    }

    // Sample Required
    if (filters.sampleRequired === true) {
      if (!r.sampleRequired) return false;
    }

    // Survey Required
    if (filters.surveyRequired === true) {
      if (!r.surveyRequired) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'open' && r.status !== 'ACTIVE_SOURCING') return false;
      if (filters.status === 'closed' && r.status !== 'CLOSED') return false;
    }

    return true;
  });

  // 3. Sắp xếp kết quả (Mới nhất, Sắp hết hạn)
  if (filters.sortBy === 'expiring_soon') {
    filtered.sort((a, b) => new Date(a.responseDeadline || a.deadline) - new Date(b.responseDeadline || b.deadline));
  } else {
    // Mặc định: Mới nhất
    filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  // 4. Sanitize trả về dữ liệu an toàn
  return filtered.map(r => toPublicRequirementSummary(r));
}

/**
 * Lấy chi tiết công khai của một Nhu cầu
 */
export function getPublicRequirementById(id) {
  const all = getAllMasterRequirements();
  const found = all.find(r => r.id === id || r.publicCode === id);
  if (!found) return null;

  // Kiểm tra quyền công bố
  const isPublic = (found.visibility === 'PUBLIC_SUMMARY' || found.visibility === 'PUBLIC') && found.moderationStatus === 'APPROVED';
  if (!isPublic) return null;

  return toPublicRequirementSummary(found);
}

// ----------------------------------------------------------------------------
// 5. SUPPLIER RESPONSE SERVICE (ENTITY: supplier_requirement_responses)
// ----------------------------------------------------------------------------
export function getAllResponses() {
  if (isCloudBrowser()) return getPrivateSubmissions('supplierResponse');
  try {
    const data = privateBrowserStorage.getItem(STORAGE_KEYS.SUPPLIER_RESPONSES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveAllResponses(responses) {
  try {
    privateBrowserStorage.setItem(STORAGE_KEYS.SUPPLIER_RESPONSES, JSON.stringify(responses));
  } catch (e) {
    console.error('Lỗi lưu responses:', e);
  }
}

/**
 * Đếm số response thật của một Nhu cầu
 */
export function getRequirementResponsesCount(requirementId) {
  const responses = getAllResponses();
  return responses.filter(r => r.requirementId === requirementId).length;
}

/**
 * Kiểm tra Nhà cung ứng đã phản hồi nhu cầu này chưa (Tránh duplicate response - Section 10)
 */
export function getSupplierResponseForRequirement(requirementId, supplierOrgId) {
  if (!supplierOrgId) return null;
  const responses = getAllResponses();
  return responses.find(r => r.requirementId === requirementId && r.supplierOrganizationId === supplierOrgId) || null;
}

/**
 * Lấy danh sách responses của một nhu cầu theo phân quyền (Section 4 & 16 & 23)
 * - Nếu là Admin: xem được tất cả phản hồi để shortlist/kiểm duyệt.
 * - Nếu là Supplier: CHỈ xem được phản hồi của chính mình, TUYỆT ĐỐI không xem được đối thủ.
 */
export function getResponsesForRequirement(requirementId, currentSupplierOrgId = null, isAdmin = false) {
  const responses = getAllResponses().filter(r => r.requirementId === requirementId);
  if (isAdmin) return responses;
  if (currentSupplierOrgId) {
    return responses.filter(r => r.supplierOrganizationId === currentSupplierOrgId);
  }
  return [];
}

/**
 * Gửi phản hồi “TÔI CÓ KHẢ NĂNG ĐÁP ỨNG” (Section 7, 8, 9, 10)
 */
export async function submitSupplierResponse({
  requirementId,
  supplierOrganizationId,
  supplierName,
  productServiceOffered,
  capabilityNote,
  serviceArea,
  moqCapacity,
  leadTimeEstimated,
  sampleAvailable = false,
  surveyAvailable = false,
  message = '',
  attachments = []
}) {
  if (isCloudBrowser()) {
    const response = await persistSubmission('supplierResponse', { id: `response:${requirementId}:${supplierOrganizationId}`, requirementId, supplierOrganizationId, supplierName, productServiceOffered, capabilityNote, serviceArea, moqCapacity, leadTimeEstimated, sampleAvailable, surveyAvailable, message, attachments });
    return { success: true, response };
  }
  const allResponses = getAllResponses();
  const existingIdx = allResponses.findIndex(
    r => r.requirementId === requirementId && r.supplierOrganizationId === supplierOrganizationId
  );

  const now = new Date().toISOString();

  let savedRecord = null;
  if (existingIdx >= 0) {
    // Cập nhật phản hồi đã có, KHÔNG tạo record duplicate (Section 10)
    savedRecord = {
      ...allResponses[existingIdx],
      productServiceOffered: productServiceOffered || allResponses[existingIdx].productServiceOffered,
      capabilityNote: capabilityNote || allResponses[existingIdx].capabilityNote,
      serviceArea: serviceArea || allResponses[existingIdx].serviceArea,
      moqCapacity: moqCapacity || allResponses[existingIdx].moqCapacity,
      leadTimeEstimated: leadTimeEstimated || allResponses[existingIdx].leadTimeEstimated,
      sampleAvailable: sampleAvailable ?? allResponses[existingIdx].sampleAvailable,
      surveyAvailable: surveyAvailable ?? allResponses[existingIdx].surveyAvailable,
      message: message || allResponses[existingIdx].message,
      attachments: attachments.length > 0 ? attachments : allResponses[existingIdx].attachments,
      updatedAt: now
    };
    allResponses[existingIdx] = savedRecord;

    logRequirementAudit({
      action: 'SUPPLIER_RESPONSE_UPDATED',
      requirementId,
      actor: supplierName,
      details: `Nhà cung ứng ${supplierName} đã cập nhật hồ sơ phản hồi năng lực.`
    });
  } else {
    // Tạo mới phản hồi
    savedRecord = {
      id: `RESP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requirementId,
      supplierOrganizationId,
      supplierName,
      productServiceOffered,
      capabilityNote,
      serviceArea,
      moqCapacity,
      leadTimeEstimated,
      sampleAvailable,
      surveyAvailable,
      message,
      attachments,
      responseStatus: 'SUBMITTED', // SUBMITTED | UNDER_REVIEW | NEED_MORE_INFO | SHORTLISTED | NOT_SUITABLE | CONVERTED_TO_MATCH
      submittedAt: now,
      updatedAt: now
    };
    allResponses.unshift(savedRecord);

    logRequirementAudit({
      action: 'SUPPLIER_RESPONSE_SUBMITTED',
      requirementId,
      actor: supplierName,
      details: `Nhà cung ứng ${supplierName} gửi phản hồi "Tôi có khả năng đáp ứng".`
    });
  }

  saveAllResponses(allResponses);
  return { success: true, response: savedRecord };
}

// ----------------------------------------------------------------------------
// 6. MATCHING RELEVANCE EVALUATION (SECTION 12)
// ----------------------------------------------------------------------------
/**
 * Đánh giá tính liên quan thực tế giữa Nhu cầu và Hồ sơ Năng lực NCC đang đăng nhập.
 * KHÔNG dùng điểm phần trăm giả tạo (VD: 95%).
 * Giải thích theo từng tiêu chí cụ thể: Ngành hàng, Địa bàn, Năng lực mẫu thử.
 */
export function evaluateSupplierRelevance(requirement, supplierProfile) {
  if (!supplierProfile) return null;

  const checks = [];

  // 1. Kiểm tra nhóm ngành hàng
  const reqCategory = (requirement.categorySlug || requirement.category || '').toLowerCase();
  const supIndustry = (supplierProfile.industry || supplierProfile.category || '').toLowerCase();
  const matchCategory = reqCategory && (supIndustry.includes(reqCategory) || reqCategory.includes(supIndustry));
  checks.push({
    title: 'Nhóm sản phẩm / Chuyên mục',
    pass: matchCategory,
    note: matchCategory ? 'Khớp năng lực sản xuất chính' : 'Chưa khớp chuyên mục chính'
  });

  // 2. Kiểm tra địa bàn giao hàng
  const reqProvince = (requirement.province || requirement.location || '').toLowerCase();
  const supLoc = (supplierProfile.location || supplierProfile.address || '').toLowerCase();
  const matchLocation = reqProvince && (supLoc.includes(reqProvince) || reqProvince.includes(supLoc) || supLoc.includes('toàn quốc'));
  checks.push({
    title: 'Địa bàn phục vụ',
    pass: matchLocation,
    note: matchLocation ? `Sẵn sàng phục vụ tại ${requirement.province}` : 'Cần xác nhận chi phí vận chuyển'
  });

  // 3. Kiểm tra yêu cầu mẫu thử
  if (requirement.sampleRequired) {
    checks.push({
      title: 'Mẫu thử đối chứng',
      pass: null, // Cần xác nhận
      note: 'Buyer yêu cầu gửi mẫu thực tế trước khi ký kết'
    });
  }

  const allPassed = checks.filter(c => c.pass === true).length;
  let overall = 'RELEVANT';
  if (allPassed === 0) overall = 'NEEDS_VERIFICATION';
  else if (allPassed < checks.length) overall = 'PARTIALLY_RELEVANT';

  return {
    overall,
    badgeText: overall === 'RELEVANT' ? 'Phù hợp năng lực của bạn' : 'Cần kiểm tra thêm điều kiện',
    checks
  };
}

// ----------------------------------------------------------------------------
// 7. AUDIT LOG & ADMIN MUTATIONS (SECTION 15, 16, 24)
// ----------------------------------------------------------------------------
export function getAllAuditLogs() {
  try {
    const data = privateBrowserStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function logRequirementAudit({ action, requirementId, actor = 'System Admin', details = '' }) {
  const logs = getAllAuditLogs();
  const entry = {
    id: `LOG-${Date.now()}`,
    action,
    requirementId,
    actor,
    timestamp: new Date().toISOString(),
    details
  };
  logs.unshift(entry);
  try {
    privateBrowserStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  } catch (e) {}
  return entry;
}

/**
 * Admin duyệt trạng thái response: SHORTLISTED, NEED_MORE_INFO, NOT_SUITABLE
 */
export function adminReviewSupplierResponse({
  responseId,
  newStatus,
  reason = '',
  actor = 'System Admin'
}) {
  const allResponses = getAllResponses();
  const idx = allResponses.findIndex(r => r.id === responseId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy phản hồi' };

  const resp = allResponses[idx];
  const oldStatus = resp.responseStatus;
  resp.responseStatus = newStatus;
  resp.reviewNote = reason;
  resp.reviewedAt = new Date().toISOString();
  resp.reviewedBy = actor;

  allResponses[idx] = resp;
  saveAllResponses(allResponses);

  // Nếu Shortlist: tạo/cập nhật SupplierMatch (Section 16)
  if (newStatus === 'SHORTLISTED') {
    createOrUpdateSupplierMatch(resp.requirementId, resp.supplierOrganizationId, resp.supplierName);
  }

  logRequirementAudit({
    action: `RESPONSE_${newStatus}`,
    requirementId: resp.requirementId,
    actor,
    details: `Chuyển trạng thái phản hồi của ${resp.supplierName} từ ${oldStatus} -> ${newStatus}. Lý do: ${reason || 'Đạt tiêu chuẩn đánh giá.'}`
  });

  return { success: true, response: resp };
}

/**
 * Tạo kết nối SupplierMatch khi Admin shortlist
 */
function createOrUpdateSupplierMatch(requirementId, supplierOrgId, supplierName) {
  try {
    const rawMatches = privateBrowserStorage.getItem(STORAGE_KEYS.SUPPLIER_MATCHES);
    let matches = rawMatches ? JSON.parse(rawMatches) : [];
    const existing = matches.find(m => m.requirementId === requirementId && m.supplierOrgId === supplierOrgId);
    if (!existing) {
      matches.unshift({
        id: `MATCH-${Date.now()}`,
        requirementId,
        supplierOrgId,
        supplierName,
        status: 'COORDINATOR_SHORTLISTED',
        createdAt: new Date().toISOString()
      });
      privateBrowserStorage.setItem(STORAGE_KEYS.SUPPLIER_MATCHES, JSON.stringify(matches));
    }
  } catch (e) {}
}

/**
 * Cập nhật visibility của Requirement từ Admin
 */
export function adminUpdateRequirementVisibility(requirementId, newVisibility, actor = 'System Admin') {
  const all = getAllMasterRequirements();
  const item = all.find(r => r.id === requirementId);
  if (!item) return { success: false };

  const old = item.visibility;
  item.visibility = newVisibility;
  if (newVisibility === 'PUBLIC_SUMMARY') {
    item.moderationStatus = 'APPROVED';
    item.publishedAt = new Date().toISOString();
  }

  try {
    privateBrowserStorage.setItem(STORAGE_KEYS.MASTER_REQUIREMENTS, JSON.stringify(all));
  } catch (e) {}

  logRequirementAudit({
    action: 'VISIBILITY_CHANGED',
    requirementId,
    actor,
    details: `Thay đổi phạm vi chia sẻ từ [${old}] sang [${newVisibility}].`
  });

  return { success: true, item };
}
import { websiteSeed } from './websiteSeeds.js';
