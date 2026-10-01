// ============================================================================
// SERVICE REQUEST FORM ENGINE & DATA LAYER
// PAGE 17: YÊU CẦU DỊCH VỤ (/yeu-cau-dich-vu)
// Chuẩn hóa theo spec 17.txt - CHUOICUNGUNG.COM
// ============================================================================

import { MASTER_SERVICES, getAllServiceRequests, saveAllServiceRequests, logServiceAudit } from './servicesData.js';
import { SEED_ORGANIZATIONS } from './organizationsData.js';
import { PROGRAMS_DATA } from './programsData.js';

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

const safeRemoveItem = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
  } catch (e) {}
  delete memoryStorage[key];
};

const STORAGE_KEYS = {
  DRAFT: 'ccu_service_request_draft_v1',
  PROPOSALS: 'ccu_service_proposals_v1',
  TASKS: 'ccu_service_tasks_v1'
};

// ----------------------------------------------------------------------------
// 1. CHUẨN HÓA 5 LOẠI HÌNH DỊCH VỤ & ROUTING (SECTION 5 & 18 SPEC 17.TXT)
// ----------------------------------------------------------------------------
export const SERVICE_ENGINE_TYPES = {
  TO_CHUC_KET_NOI: {
    id: 'TO_CHUC_KET_NOI',
    slug: 'to-chuc-ket-noi',
    serviceId: 'srv-to-chuc-ket-noi',
    name: 'Tổ chức kết nối doanh nghiệp',
    shortName: 'Kết nối B2B',
    desk: 'Partnership / Program Desk',
    defaultOwner: 'Đặng Tuấn Kiệt (Head of Matchmaking Desk)',
    ownerRole: 'MATCHMAKING_LEAD',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  VAT_PHAM_SU_KIEN: {
    id: 'VAT_PHAM_SU_KIEN',
    slug: 'vat-pham-su-kien',
    serviceId: 'srv-vat-pham-su-kien',
    name: 'Vật phẩm doanh nghiệp & Sự kiện',
    shortName: 'Vật phẩm & Quà tặng',
    desk: 'Commercial / Operations Desk',
    defaultOwner: 'Trần Đình Trọng (Production & Procurement Lead)',
    ownerRole: 'MERCHANDISE_OPERATIONS',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  TRUYEN_THONG_DOANH_NGHIEP: {
    id: 'TRUYEN_THONG_DOANH_NGHIEP',
    slug: 'truyen-thong-doanh-nghiep',
    serviceId: 'srv-truyen-thong-doanh-nghiep',
    name: 'Hồ sơ & Truyền thông doanh nghiệp',
    shortName: 'Profile & Video',
    desk: 'Content / Media Desk',
    defaultOwner: 'Tô Ngọc Dũng (Media & Strategy Director)',
    ownerRole: 'MEDIA_DIRECTOR',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  HIEN_DIEN_TU_XA: {
    id: 'HIEN_DIEN_TU_XA',
    slug: 'hien-dien-tu-xa',
    serviceId: 'srv-hien-dien-tu-xa',
    name: 'Hiện diện từ xa tại sự kiện',
    shortName: 'Hiện diện từ xa',
    desk: 'Program / Remote Desk',
    defaultOwner: 'Lê Thu Trang (Regional Coordinator Desk)',
    ownerRole: 'REGIONAL_COORDINATOR',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  },
  TAI_TRO: {
    id: 'TAI_TRO',
    slug: 'tai-tro',
    serviceId: 'srv-tai-tro-dong-hanh',
    name: 'Tài trợ & Đồng hành chương trình',
    shortName: 'Tài trợ chương trình',
    desk: 'Partnership / Sponsorship Desk',
    defaultOwner: 'Ban Điều Phối Tài Trợ & Đồng Hành (Sponsorship Desk)',
    ownerRole: 'SPONSORSHIP_DESK',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    isConsultationOnly: true // LƯU Ý BẮT BUỘC: Nhánh tài trợ chỉ tạo YÊU CẦU TƯ VẤN
  }
};

// ----------------------------------------------------------------------------
// 2. CHUẨN HÓA TRẠNG THÁI YÊU CẦU (SECTION 10 SPEC 17.TXT)
// ----------------------------------------------------------------------------
export const FORM_ENGINE_STATUSES = [
  { id: 'NEW', name: 'Đề bài mới tiếp nhận', color: 'blue', step: 1 },
  { id: 'NEED_MORE_INFO', name: 'Cần làm rõ thêm thông tin', color: 'amber', step: 1 },
  { id: 'PREPARING_PROPOSAL', name: 'Đang lập đề xuất & báo giá', color: 'indigo', step: 2 },
  { id: 'PROPOSAL_SENT', name: 'Đã gửi đề xuất / báo giá', color: 'purple', step: 2 },
  { id: 'ACCEPTED', name: 'Khách hàng chấp thuận đề xuất', color: 'teal', step: 3 },
  { id: 'IN_PROGRESS', name: 'Đang triển khai thực hiện', color: 'blue', step: 3 },
  { id: 'WAITING_ACCEPTANCE', name: 'Chờ khách hàng nghiệm thu', color: 'orange', step: 4 },
  { id: 'COMPLETED', name: 'Hoàn tất nghiệm thu & bàn giao', color: 'emerald', step: 5 },
  { id: 'CANCELLED', name: 'Đã hủy yêu cầu', color: 'rose', step: 0 }
];

// Trạng thái báo giá / đề xuất tách riêng khỏi trạng thái request (Section 19 Spec 17)
export const PROPOSAL_STATUSES = {
  DRAFT: 'DRAFT',
  INTERNAL_REVIEW: 'INTERNAL_REVIEW',
  SENT: 'SENT',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

// ----------------------------------------------------------------------------
// 3. DUPLICATE DETECTION ENGINE (SECTION 12 SPEC 17.TXT)
// Kiểm tra: Cùng organization / cùng SĐT / email + cùng service + gửi gần đây (48h)
// Không tự xóa -> Đánh cờ 'POSSIBLE_DUPLICATE' để Admin review
// ----------------------------------------------------------------------------
export function detectPossibleDuplicate(newReq, existingReqs) {
  if (!Array.isArray(existingReqs) || existingReqs.length === 0) return { isDuplicate: false };

  const now = Date.now();
  const FORTY_EIGHT_HOURS_MS = 48 * 3600 * 1000;

  const duplicateCandidate = existingReqs.find(existing => {
    // Không so sánh với chính nó
    if (existing.id === newReq.id || existing.publicCode === newReq.publicCode) return false;

    // Kiểm tra thời gian trong vòng 48h
    const createdTime = new Date(existing.createdAt || 0).getTime();
    if (now - createdTime > FORTY_EIGHT_HOURS_MS) return false;

    // Kiểm tra cùng loại dịch vụ
    const sameService = existing.serviceType === newReq.serviceType ||
      (existing.serviceIds && existing.serviceIds.some(id => newReq.serviceIds?.includes(id)));
    if (!sameService) return false;

    // Kiểm tra cùng đơn vị hoặc cùng số điện thoại / email
    const cleanPhoneA = (newReq.contactPhone || newReq.phone || '').replace(/\D/g, '');
    const cleanPhoneB = (existing.contactPhone || existing.phone || '').replace(/\D/g, '');
    const samePhone = cleanPhoneA && cleanPhoneA === cleanPhoneB;

    const cleanEmailA = (newReq.contactEmail || newReq.email || '').trim().toLowerCase();
    const cleanEmailB = (existing.contactEmail || existing.email || '').trim().toLowerCase();
    const sameEmail = cleanEmailA && cleanEmailA === cleanEmailB;

    const sameOrg = (newReq.organizationId && newReq.organizationId === existing.organizationId) ||
      (newReq.companyName && existing.companyName &&
       newReq.companyName.trim().toLowerCase() === existing.companyName.trim().toLowerCase());

    return samePhone || sameEmail || sameOrg;
  });

  if (duplicateCandidate) {
    return {
      isDuplicate: true,
      duplicateOf: duplicateCandidate.publicCode || duplicateCandidate.id,
      reason: `Trùng thông tin liên hệ / doanh nghiệp với yêu cầu ${duplicateCandidate.publicCode || duplicateCandidate.id} gửi trong vòng 48 giờ qua.`
    };
  }

  return { isDuplicate: false };
}

// ----------------------------------------------------------------------------
// 4. TẠO MÃ PUBLIC CODE DV-2026-XXXXX (SECTION 8 SPEC 17.TXT)
// Tách biệt giữa UUID nội bộ và mã định danh công khai
// ----------------------------------------------------------------------------
export function generatePublicTrackingCode(existingReqs = []) {
  const year = new Date().getFullYear();
  let maxSeq = 130;
  const list = Array.isArray(existingReqs) ? existingReqs : getAllServiceRequests();
  list.forEach(r => {
    const code = r.publicCode || r.id || '';
    const match = code.match(/DV-\d{4}-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) maxSeq = num;
    }
  });
  const sequence = String(maxSeq + 1).padStart(5, '0');
  return `DV-${year}-${sequence}`;
}

// ----------------------------------------------------------------------------
// 5. UNIFIED SUBMIT SERVICE REQUEST (SECTION 7, 8, 9, 15, 18, 21 SPEC 17.TXT)
// ----------------------------------------------------------------------------
export function submitUnifiedServiceRequest(formData) {
  const existingReqs = getAllServiceRequests();

  // 1. Phân giải ServiceType & Routing Desk (Section 18)
  const serviceKey = formData.serviceType || 
    (formData.serviceIds?.[0] ? formData.serviceIds[0].replace('srv-', '').toUpperCase().replace(/-/g, '_') : 'TO_CHUC_KET_NOI');
  
  const serviceMeta = SERVICE_ENGINE_TYPES[serviceKey] || SERVICE_ENGINE_TYPES.TO_CHUC_KET_NOI;

  // 2. Sinh mã Tracking Code & UUID
  const publicCode = generatePublicTrackingCode(existingReqs);
  const internalUuid = `sr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  // 3. Kiểm tra Duplicate (Section 12)
  const dupCheck = detectPossibleDuplicate({
    ...formData,
    serviceType: serviceMeta.id,
    serviceIds: [serviceMeta.serviceId]
  }, existingReqs);

  // 4. Initial Task (Section 7)
  const initialTask = {
    id: `task-${Date.now()}-01`,
    title: `Rà soát mục tiêu & liên hệ khảo sát nhu cầu ${formData.companyName}`,
    assignee: serviceMeta.defaultOwner,
    status: 'PENDING',
    dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  };

  // 5. Khởi tạo ServiceRequest Entity chuẩn (Section 9)
  const newRequest = {
    id: internalUuid,
    publicCode, // DV-2026-XXXXX
    serviceType: serviceMeta.id,
    serviceIds: [serviceMeta.serviceId],
    serviceNames: [serviceMeta.name],
    desk: serviceMeta.desk,

    // Tổ chức & Người liên hệ
    organizationId: formData.organizationId || null,
    requesterUserId: formData.requesterUserId || null,
    companyName: (formData.companyName || '').trim(),
    contactName: (formData.contactName || formData.customerName || '').trim(),
    customerName: (formData.contactName || formData.customerName || '').trim(), // Alias tương thích
    roleTitle: (formData.roleTitle || '').trim(),
    contactEmail: (formData.contactEmail || formData.email || '').trim(),
    email: (formData.contactEmail || formData.email || '').trim(),
    contactPhone: (formData.contactPhone || formData.phone || '').trim(),
    phone: (formData.contactPhone || formData.phone || '').trim(),

    // Thông tin chung
    description: (formData.description || formData.objective || formData.scopeDetails || '').trim(),
    objective: (formData.objective || formData.description || '').trim(),
    location: (formData.location || '').trim(),
    locationId: formData.locationId || null,
    desiredDate: formData.desiredDate || formData.expectedDate || '',
    expectedDate: formData.desiredDate || formData.expectedDate || '',
    budget: formData.budget || '',
    budgetMin: formData.budgetMin || null,
    budgetMax: formData.budgetMax || null,

    // Dữ liệu động theo serviceType (Validated dynamicData schema)
    dynamicData: formData.dynamicData || {},

    // Tệp đính kèm (Mặc định Private)
    attachments: (formData.attachments || []).map(a => ({
      name: typeof a === 'string' ? a : (a.name || 'Tài liệu đính kèm'),
      size: a.size || 'N/A',
      type: a.type || 'application/octet-stream',
      isPrivate: true, // Section 14: Private by default
      uploadedAt: new Date().toISOString()
    })),

    // Context nguồn
    sourcePage: formData.sourcePage || '/yeu-cau-dich-vu',
    sourceProgramId: formData.sourceProgramId || formData.programId || null,
    sourceOrganizationId: formData.sourceOrganizationId || null,

    // Phân công & Vận hành (Section 11 & 18)
    ownerUserId: serviceMeta.ownerRole,
    owner: serviceMeta.defaultOwner,
    status: 'NEW',
    statusHistory: [
      {
        status: 'NEW',
        changedAt: new Date().toISOString(),
        changedBy: formData.contactName || 'Người dùng trực tuyến',
        note: 'Đề bài vừa được gửi qua cổng dịch vụ trực tuyến'
      }
    ],
    nextAction: `Chuyên viên ${serviceMeta.desk} liên hệ khảo sát nhu cầu & làm rõ phạm vi`,
    nextActionAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),

    // Duplicate Flag (Section 12)
    duplicateStatus: dupCheck.isDuplicate ? 'POSSIBLE_DUPLICATE' : 'NORMAL',
    duplicateNote: dupCheck.isDuplicate ? dupCheck.reason : null,

    // Tách riêng Consent (Section 15 Spec 17)
    consentToContact: formData.consentToContact !== false, // Bắt buộc
    marketingConsent: Boolean(formData.marketingConsent),   // Tùy chọn

    // Tasks & Proposals
    tasks: [initialTask],
    proposal: null,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Lưu vào database
  existingReqs.unshift(newRequest);
  saveAllServiceRequests(existingReqs);

  // Ghi Audit Log (Section 21)
  logServiceAudit({
    action: 'SERVICE_REQUEST_CREATED',
    serviceId: serviceMeta.serviceId,
    actor: newRequest.contactName,
    details: `Tiếp nhận yêu cầu ${newRequest.publicCode} (${newRequest.id}): Dịch vụ ${serviceMeta.name} từ ${newRequest.companyName}. Cờ duplicate: ${newRequest.duplicateStatus}.`
  });

  // Xóa draft sau khi gửi thành công
  clearServiceRequestDraft();

  return { 
    success: true, 
    request: newRequest,
    publicCode: newRequest.publicCode,
    isDuplicateWarning: dupCheck.isDuplicate
  };
}

// ----------------------------------------------------------------------------
// 6. DRAFT AUTO-SAVE & RESTORE (SECTION 13 SPEC 17.TXT)
// ----------------------------------------------------------------------------
export function saveServiceRequestDraft(draft) {
  if (!draft) return;
  const payload = {
    ...draft,
    savedAt: new Date().toISOString()
  };
  safeSetItem(STORAGE_KEYS.DRAFT, JSON.stringify(payload));
}

export function getServiceRequestDraft() {
  const raw = safeGetItem(STORAGE_KEYS.DRAFT);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return null;
}

export function clearServiceRequestDraft() {
  safeRemoveItem(STORAGE_KEYS.DRAFT);
}

// ----------------------------------------------------------------------------
// 7. ACCOUNT WORKSPACE REQUESTS LOOKUP (SECTION 16 SPEC 17.TXT)
// Tra cứu danh sách yêu cầu của người dùng / doanh nghiệp
// ----------------------------------------------------------------------------
export function getUserServiceRequests(emailOrPhone) {
  if (!emailOrPhone) return [];
  const cleanTarget = emailOrPhone.trim().toLowerCase().replace(/\D/g, '');
  const emailTarget = emailOrPhone.trim().toLowerCase();

  const all = getAllServiceRequests();
  return all.filter(r => {
    const cleanP = (r.contactPhone || r.phone || '').replace(/\D/g, '');
    const cleanE = (r.contactEmail || r.email || '').trim().toLowerCase();
    return (cleanTarget && cleanP.includes(cleanTarget)) || (emailTarget && cleanE === emailTarget);
  });
}

// ----------------------------------------------------------------------------
// 8. CẬP NHẬT TRẠNG THÁI & HỦY YÊU CẦU (BẮT BUỘC REASON NẾU CANCEL) (SECTION 10 & 21)
// ----------------------------------------------------------------------------
export function updateFormEngineRequestStatus({
  requestId,
  status,
  reason = '',
  nextAction,
  nextActionAt,
  owner,
  actor = 'Admin Master'
}) {
  const requests = getAllServiceRequests();
  const idx = requests.findIndex(r => r.id === requestId || r.publicCode === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu' };

  const req = requests[idx];
  const oldStatus = req.status;

  // RULE SECTION 10: Nếu CANCELLED, bắt buộc phải có reason
  if (status === 'CANCELLED' && !reason.trim()) {
    return {
      success: false,
      message: 'LỖI QUY TRÌNH (Spec 17 - Mục 10): Khi chuyển trạng thái sang CANCELLED, bắt buộc phải nhập lý do hủy (reason).'
    };
  }

  req.status = status;
  if (status === 'CANCELLED') {
    req.cancellationReason = reason.trim();
  }

  if (nextAction) req.nextAction = nextAction;
  if (nextActionAt) req.nextActionAt = nextActionAt;
  if (owner) req.owner = owner;

  if (!Array.isArray(req.statusHistory)) req.statusHistory = [];
  req.statusHistory.push({
    status,
    changedAt: new Date().toISOString(),
    changedBy: actor,
    note: reason || `Cập nhật trạng thái sang ${status}`
  });

  req.updatedAt = new Date().toISOString();
  requests[idx] = req;
  saveAllServiceRequests(requests);

  // Log Audit
  logServiceAudit({
    action: status === 'CANCELLED' ? 'SERVICE_REQUEST_CANCELLED' : 'SERVICE_REQUEST_STATUS_CHANGED',
    serviceId: req.serviceIds?.[0] || 'service',
    actor,
    details: `Đổi trạng thái yêu cầu ${req.publicCode || req.id}: [${oldStatus}] ➔ [${status}]. Lý do / Ghi chú: ${reason || 'Tiến độ bình thường'}.`
  });

  return { success: true, request: req };
}

// ----------------------------------------------------------------------------
// 9. TRA CỨU CHI TIẾT YÊU CẦU THEO MÃ (PUBLIC CODE HOẶC UUID)
// ----------------------------------------------------------------------------
export function getServiceRequestByCodeOrId(codeOrId) {
  if (!codeOrId) return null;
  const target = String(codeOrId).trim().toLowerCase();
  const all = getAllServiceRequests();
  return all.find(r => 
    (r.publicCode && r.publicCode.toLowerCase() === target) ||
    (r.id && r.id.toLowerCase() === target)
  ) || null;
}

// ----------------------------------------------------------------------------
// 10. QUẢN LÝ BÁO GIÁ / PROPOSAL (SECTION 19 SPEC 17.TXT)
// Tách biệt giữa trạng thái yêu cầu và trạng thái proposal
// ----------------------------------------------------------------------------
export function updateServiceRequestProposal({
  requestId,
  proposalStatus, // DRAFT | INTERNAL_REVIEW | SENT | REVISION_REQUESTED | ACCEPTED | REJECTED | EXPIRED
  title = '',
  totalAmount = '',
  deliverables = [],
  validUntil = '',
  sharedWithCustomer = false,
  note = '',
  actor = 'Admin Master'
}) {
  const requests = getAllServiceRequests();
  const idx = requests.findIndex(r => r.id === requestId || r.publicCode === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu dịch vụ' };

  const req = requests[idx];
  const previousProposal = req.proposal || {};

  const updatedProposal = {
    ...previousProposal,
    proposalId: previousProposal.proposalId || `PROP-${Date.now().toString().slice(-6)}`,
    status: proposalStatus || previousProposal.status || PROPOSAL_STATUSES.DRAFT,
    title: title || previousProposal.title || `Phương án dịch vụ ${req.serviceNames?.[0] || ''}`,
    totalAmount: totalAmount || previousProposal.totalAmount || 'Đang lập dự toán chi tiết',
    deliverables: deliverables.length > 0 ? deliverables : (previousProposal.deliverables || []),
    validUntil: validUntil || previousProposal.validUntil || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    sharedWithCustomer: sharedWithCustomer !== undefined ? sharedWithCustomer : (previousProposal.sharedWithCustomer || false),
    note: note || previousProposal.note || '',
    updatedAt: new Date().toISOString()
  };

  req.proposal = updatedProposal;
  req.updatedAt = new Date().toISOString();
  requests[idx] = req;
  saveAllServiceRequests(requests);

  // Log Audit (Section 21)
  logServiceAudit({
    action: 'PROPOSAL_STATUS_CHANGED',
    serviceId: req.serviceIds?.[0] || 'service',
    actor,
    details: `Cập nhật Proposal ${updatedProposal.proposalId} cho ${req.publicCode || req.id}: [${previousProposal.status || 'NONE'}] -> [${updatedProposal.status}]. Chia sẻ với KH: ${updatedProposal.sharedWithCustomer ? 'CÓ' : 'CHƯA'}.`
  });

  return { success: true, request: req, proposal: updatedProposal };
}

// ----------------------------------------------------------------------------
// 11. THÊM / CẬP NHẬT TASK CHO YÊU CẦU DỊCH VỤ (SECTION 7 SPEC 17.TXT)
// ----------------------------------------------------------------------------
export function addServiceRequestTask({
  requestId,
  title,
  assignee,
  dueDate,
  actor = 'Admin Master'
}) {
  const requests = getAllServiceRequests();
  const idx = requests.findIndex(r => r.id === requestId || r.publicCode === requestId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy yêu cầu' };

  const req = requests[idx];
  if (!Array.isArray(req.tasks)) req.tasks = [];

  const newTask = {
    id: `task-${Date.now()}`,
    title: title.trim(),
    assignee: assignee || req.owner || 'Chuyên viên phụ trách',
    dueDate: dueDate || new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 10),
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  req.tasks.push(newTask);
  req.updatedAt = new Date().toISOString();
  requests[idx] = req;
  saveAllServiceRequests(requests);

  logServiceAudit({
    action: 'TASK_CREATED',
    serviceId: req.serviceIds?.[0] || 'service',
    actor,
    details: `Tạo đầu việc mới: "${newTask.title}" phân công cho ${newTask.assignee} (Yêu cầu ${req.publicCode || req.id}).`
  });

  return { success: true, request: req, task: newTask };
}
