// ============================================================================
// PAGE 19 / MODULE 19: BÀN ĐIỀU PHỐI NỘI BỘ (ADMIN COMMAND CENTER)
// ROOT: /admin
// Chuẩn hóa theo spec 19.txt - CHUOICUNGUNG.COM
// ============================================================================

import {
  getAllMasterRequirements,
  getAllResponses,
  getAllAuditLogs as getRequirementAuditLogs
} from './requirementsData.js';

import {
  getAllOrganizations,
  getAllClaims,
  getAllOrgAuditLogs as getOrgAuditLogs
} from './organizationsData.js';

import {
  getAllServiceRequests,
  getAllServiceAuditLogs
} from './servicesData.js';

import {
  getAllFoundingPartnerships,
  getAllFoundingAuditLogs
} from './foundingPartnershipData.js';

import { PROGRAMS_DATA } from './programsData.js';

// Safe Storage Helper
const memoryStore = {};
const safeGet = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {}
  return memoryStore[key] || null;
};

const safeSet = (key, val) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
      return;
    }
  } catch (e) {}
  memoryStore[key] = val;
};

const STORAGE_KEYS = {
  TASKS: 'ccu_admin_unified_tasks_v1',
  CONNECTIONS: 'ccu_admin_unified_connections_v1',
  COORDINATOR_SETTINGS: 'ccu_admin_coordinator_settings_v1',
  SAVED_VIEWS: 'ccu_admin_saved_views_v1',
  CURRENT_ROLE: 'ccu_admin_active_role_v1'
};

// ----------------------------------------------------------------------------
// 1. RBAC ROLES & PERMISSIONS MATRIX (Section 21 - 29)
// ----------------------------------------------------------------------------
export const ADMIN_ROLES = {
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Toàn quyền cấu hình hệ thống, tài chính, phân quyền và dữ liệu.',
    canExport: true,
    canViewFinance: true,
    canEditCapabilities: true,
    canManageUsers: true,
    canMutateStatus: true
  },
  COORDINATOR: {
    id: 'COORDINATOR',
    name: 'Điều Phối Viên (Coordinator)',
    description: 'Quản lý Nhu cầu, điều phối kết nối, lên lịch gặp, tạo tasks, theo dõi outcome.',
    canExport: false,
    canViewFinance: false,
    canEditCapabilities: false,
    canManageUsers: false,
    canMutateStatus: true
  },
  SOURCING: {
    id: 'SOURCING',
    name: 'Chuyên Viên Tìm Nguồn (Sourcing Specialist)',
    description: 'Tìm kiếm, thẩm định và shortlist NCC đáp ứng tiêu chuẩn kỹ thuật.',
    canExport: false,
    canViewFinance: false,
    canEditCapabilities: true,
    canManageUsers: false,
    canMutateStatus: true
  },
  PARTNERSHIP: {
    id: 'PARTNERSHIP',
    name: 'Quản Trị Đối Tác (Partnership Sales & FP)',
    description: 'Quản lý đề xuất và hợp đồng tài trợ Founding Partner, bàn giao deliverables.',
    canExport: false,
    canViewFinance: false,
    canEditCapabilities: false,
    canManageUsers: false,
    canMutateStatus: true
  },
  PROGRAM_OPERATOR: {
    id: 'PROGRAM_OPERATOR',
    name: 'Vận Hành Chương Trình (Program Operator)',
    description: 'Điều phối sự kiện giao thương B2B, phiên kết nối 1-1, lịch gặp nhà máy FDI.',
    canExport: false,
    canViewFinance: false,
    canEditCapabilities: false,
    canManageUsers: false,
    canMutateStatus: true
  },
  FINANCE: {
    id: 'FINANCE',
    name: 'Kế Toán / Đối Soát (Finance & Reconciliation)',
    description: 'Chỉ quản lý hợp đồng, hóa đơn, công nợ, đối soát dịch vụ và tài trợ. Không sửa Nhu cầu.',
    canExport: true,
    canViewFinance: true,
    canEditCapabilities: false,
    canManageUsers: false,
    canMutateStatus: false
  },
  VIEWER: {
    id: 'VIEWER',
    name: 'Khách Quan Sát (Auditor / Viewer)',
    description: 'Chỉ đọc (Read-only), không chỉnh sửa hoặc xuất dữ liệu nội bộ.',
    canExport: false,
    canViewFinance: false,
    canEditCapabilities: false,
    canManageUsers: false,
    canMutateStatus: false
  }
};

export function getActiveAdminRole() {
  const saved = safeGet(STORAGE_KEYS.CURRENT_ROLE);
  return saved && ADMIN_ROLES[saved] ? ADMIN_ROLES[saved] : ADMIN_ROLES.SUPER_ADMIN;
}

export function setActiveAdminRole(roleId) {
  if (ADMIN_ROLES[roleId]) {
    safeSet(STORAGE_KEYS.CURRENT_ROLE, roleId);
    return ADMIN_ROLES[roleId];
  }
  return ADMIN_ROLES.SUPER_ADMIN;
}

// ----------------------------------------------------------------------------
// 2. 5-COLUMN KANBAN CORE PIPELINE MAPPING (Section 3 & 4)
// Map domain status -> 5 pipeline columns! Domain status is NOT overridden.
// ----------------------------------------------------------------------------
export const PIPELINE_COLUMNS = [
  {
    id: 'COLUMN_01_INTAKE',
    step: 1,
    title: 'ĐĂNG NHU CẦU',
    shortTitle: 'Đăng Nhu Cầu',
    color: 'blue',
    description: 'Nhu cầu mới tiếp nhận, cần làm rõ (Clarification) hoặc chờ phê duyệt công bố.'
  },
  {
    id: 'COLUMN_02_SOURCING',
    step: 2,
    title: 'TÌM NGUỒN',
    shortTitle: 'Tìm Nguồn',
    color: 'amber',
    description: 'Đã xác thực Need, đang quét danh bạ NCC, chạy thuật toán Matching và mời chào giá.'
  },
  {
    id: 'COLUMN_03_CONNECTING',
    step: 3,
    title: 'KẾT NỐI',
    shortTitle: 'Kết Nối',
    color: 'purple',
    description: 'Đã có NCC phản hồi, đang tổ chức giới thiệu 1-1, khảo sát xưởng hoặc gửi hồ sơ.'
  },
  {
    id: 'COLUMN_04_FOLLOW_UP',
    step: 4,
    title: 'THEO DÕI',
    shortTitle: 'Theo Dõi',
    color: 'indigo',
    description: 'Đang theo dõi gửi mẫu thử (Sample), đối chứng bảng báo giá (Quote) và đàm phán hợp đồng.'
  },
  {
    id: 'COLUMN_05_OUTCOME',
    step: 5,
    title: 'KẾT QUẢ',
    shortTitle: 'Kết Quả',
    color: 'emerald',
    description: 'Xác nhận kết quả thực tế (Ký hợp đồng, đặt hàng, tạm dừng hoặc không phù hợp).'
  }
];

export function mapRequirementToPipelineColumn(req) {
  const status = (req.status || '').toUpperCase();
  const modStatus = (req.moderationStatus || '').toUpperCase();

  // Column 1: Intake
  if (status === 'DRAFT' || status === 'PENDING' || modStatus === 'PENDING' || status === 'NEED_MORE_INFO' || status === 'NEW') {
    return 'COLUMN_01_INTAKE';
  }

  // Column 5: Outcome
  if (status === 'CLOSED' || status === 'ORDER_PLACED' || status === 'CONTRACT_SIGNED' || status === 'CANCELLED' || req.outcome) {
    return 'COLUMN_05_OUTCOME';
  }

  // Column 4: Follow up (Quotations, samples, negotiation)
  if (status === 'IN_PROGRESS' || status === 'NEGOTIATING' || status === 'SAMPLE_IN_PROGRESS' || status === 'QUOTED') {
    return 'COLUMN_04_FOLLOW_UP';
  }

  // Column 3: Connecting (Introduced, matched, responses awaiting introduction)
  if (status === 'CONNECTED' || status === 'MATCHED' || status === 'MEETING_SCHEDULED' || req.responseCount > 0) {
    return 'COLUMN_03_CONNECTING';
  }

  // Column 2: Sourcing
  return 'COLUMN_02_SOURCING';
}

// ----------------------------------------------------------------------------
// 3. SUPPLIER MATCH / CONNECTION STATUSES (Section 5)
// Tách riêng khỏi Requirement.status
// ----------------------------------------------------------------------------
export const MATCH_STATUSES = {
  PROPOSED: { id: 'PROPOSED', label: 'Đề xuất phù hợp (AI/Sourcing)', color: 'slate' },
  INVITED: { id: 'INVITED', label: 'Đã gửi lời mời chào giá', color: 'blue' },
  RESPONDED: { id: 'RESPONDED', label: 'NCC đã gửi phản hồi khả năng', color: 'indigo' },
  CONNECTED: { id: 'CONNECTED', label: 'Đã kết nối trao đổi trực tiếp', color: 'purple' },
  SAMPLE_OR_SURVEY: { id: 'SAMPLE_OR_SURVEY', label: 'Đang gửi mẫu / Khảo sát xưởng', color: 'amber' },
  QUOTED: { id: 'QUOTED', label: 'Đã nhận báo giá chính thức', color: 'cyan' },
  NEGOTIATING: { id: 'NEGOTIATING', label: 'Đang đàm phán thương mại', color: 'orange' },
  OUTCOME: { id: 'OUTCOME', label: 'Đã có kết quả chốt thỏa thuận', color: 'emerald' },
  NOT_SUITABLE: { id: 'NOT_SUITABLE', label: 'Không phù hợp kỹ thuật/giá', color: 'rose' },
  WITHDRAWN: { id: 'WITHDRAWN', label: 'NCC chủ động rút lui', color: 'slate' },
  NO_RESPONSE: { id: 'NO_RESPONSE', label: 'Không phản hồi quá hạn', color: 'red' }
};

// ----------------------------------------------------------------------------
// 4. OUTCOME TYPES (Section 17 - Không dùng boolean success = true)
// ----------------------------------------------------------------------------
export const OUTCOME_TYPES = {
  ORDER_PLACED: { id: 'ORDER_PLACED', label: 'Đã chốt đơn đặt hàng chính thức (PO/Order)', success: true, color: 'emerald' },
  CONTRACT_SIGNED: { id: 'CONTRACT_SIGNED', label: 'Đã ký hợp đồng cung ứng định kỳ (Contract)', success: true, color: 'emerald' },
  SELECTED_SUPPLIER: { id: 'SELECTED_SUPPLIER', label: 'Buyer đã chọn NCC (Chuẩn bị ký HĐ)', success: true, color: 'teal' },
  SAMPLE_IN_PROGRESS: { id: 'SAMPLE_IN_PROGRESS', label: 'Đang thử nghiệm mẫu lần 2/3', success: false, color: 'amber' },
  WAITING_BUDGET: { id: 'WAITING_BUDGET', label: 'Chờ phê duyệt ngân sách Buyer kỳ sau', success: false, color: 'blue' },
  PRICE_NOT_SUITABLE: { id: 'PRICE_NOT_SUITABLE', label: 'Giá chào không phù hợp ngân sách Buyer', success: false, color: 'rose' },
  LEAD_TIME_NOT_SUITABLE: { id: 'LEAD_TIME_NOT_SUITABLE', label: 'Tiến độ giao hàng không đáp ứng', success: false, color: 'rose' },
  TECHNICAL_NOT_SUITABLE: { id: 'TECHNICAL_NOT_SUITABLE', label: 'Năng lực kỹ thuật/máy móc không đạt chuẩn', success: false, color: 'rose' },
  NO_RESPONSE: { id: 'NO_RESPONSE', label: 'Hai bên ngừng phản hồi sau trao đổi', success: false, color: 'slate' },
  BUYER_STOPPED: { id: 'BUYER_STOPPED', label: 'Buyer hủy nhu cầu (Thay đổi kế hoạch nội bộ)', success: false, color: 'slate' },
  UNKNOWN: { id: 'UNKNOWN', label: 'Chưa có thông tin xác nhận kết quả', success: false, color: 'slate' }
};

// ----------------------------------------------------------------------------
// 5. UNIFIED TASK ENGINE (Section 15 & 16)
// Schema thống nhất cho: REQUIREMENT, SUPPLIER_MATCH, SERVICE_REQUEST, FP...
// ----------------------------------------------------------------------------
export const TASK_STATUSES = {
  OPEN: { id: 'OPEN', label: 'Chưa bắt đầu', color: 'blue' },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'Đang thực hiện', color: 'amber' },
  WAITING: { id: 'WAITING', label: 'Chờ phản hồi bên ngoài', color: 'purple' },
  COMPLETED: { id: 'COMPLETED', label: 'Đã hoàn thành', color: 'emerald' },
  CANCELLED: { id: 'CANCELLED', label: 'Đã hủy', color: 'slate' }
};

export const SEED_UNIFIED_TASKS = [
  {
    id: 'TASK-2026-001',
    entityType: 'REQUIREMENT',
    entityId: 'NC-2026-00125',
    entityTitle: '500 bộ đồng phục công nhân KCN Amata',
    title: 'Đối chiếu mẫu vải Kaki 65/35 với Trưởng phòng Mua hàng Precision Tech',
    description: 'Liên hệ anh Nam để gửi 2 mẫu may đối chứng từ Proser và ghi nhận phản hồi kích thước.',
    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Đặng Tuấn Kiệt (Coordinator Lead)',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueAt: '2026-09-29T17:00:00Z', // Ngày mai
    createdAt: '2026-09-27T08:00:00Z'
  },
  {
    id: 'TASK-2026-002',
    entityType: 'REQUIREMENT',
    entityId: 'NC-2026-00128',
    entityTitle: '10.000 chi tiết CNC nhôm KCN VSIP 1',
    title: 'Sắp xếp lịch khảo sát thực địa máy đo CMM tại xưởng Cơ khí Long Thành',
    description: 'Hỗ trợ kỹ sư nhà máy FDI đến audit dàn máy phay 5 trục và chứng chỉ FAI.',
    ownerUserId: 'USER-TRONG-OPS',
    ownerName: 'Trần Đình Trọng (Sourcing Engineer)',
    status: 'OPEN',
    priority: 'HIGH',
    dueAt: '2026-09-28T10:00:00Z', // Hôm nay (cần xử lý ngay)
    createdAt: '2026-09-26T09:00:00Z'
  },
  {
    id: 'TASK-2026-003',
    entityType: 'SERVICE_REQUEST',
    entityId: 'SRV-2026-0089',
    entityTitle: 'Sản xuất Video Phóng sự Dây chuyền Xưởng May',
    title: 'Gửi bản dựng nháp Preview Video 4K cho Ban Lãnh đạo duyệt',
    description: 'Chỉnh sửa hạ âm lượng nhạc nền theo góp ý của khách hàng.',
    ownerUserId: 'USER-DUNG-MEDIA',
    ownerName: 'Lê Hoàng Dũng (Media Producer)',
    status: 'OPEN',
    priority: 'MEDIUM',
    dueAt: '2026-09-27T17:00:00Z', // ĐÃ QUÁ HẠN (OVERDUE TEST)
    createdAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'TASK-2026-004',
    entityType: 'FOUNDING_PARTNERSHIP',
    entityId: 'FP-2026-001',
    entityTitle: 'Founding Partner - Chuyên Gia Đồng Phục',
    title: 'Xuất Báo cáo nghiệm thu lượt hiển thị & RFQ Quý 3/2026',
    description: 'Tổng hợp số liệu hiển thị thực tế trên chuyên mục Đồng phục và báo cáo tiến độ.',
    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Đặng Tuấn Kiệt',
    status: 'WAITING',
    priority: 'NORMAL',
    dueAt: '2026-10-05T17:00:00Z',
    createdAt: '2026-09-20T14:00:00Z'
  }
];

export function getAllUnifiedTasks() {
  const raw = safeGet(STORAGE_KEYS.TASKS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [...SEED_UNIFIED_TASKS];
}

export function saveAllUnifiedTasks(list) {
  safeSet(STORAGE_KEYS.TASKS, JSON.stringify(list));
}

export function createUnifiedTask(taskData) {
  const tasks = getAllUnifiedTasks();
  const year = new Date().getFullYear();
  const seq = String(tasks.length + 101).padStart(4, '0');
  const newTask = {
    id: `TASK-${year}-${seq}`,
    entityType: taskData.entityType || 'REQUIREMENT',
    entityId: taskData.entityId,
    entityTitle: taskData.entityTitle || '',
    title: taskData.title.trim(),
    description: (taskData.description || '').trim(),
    ownerUserId: taskData.ownerUserId || 'USER-KIET-B2B',
    ownerName: taskData.ownerName || 'Đặng Tuấn Kiệt',
    status: taskData.status || 'OPEN',
    priority: taskData.priority || 'NORMAL',
    dueAt: taskData.dueAt || new Date(Date.now() + 86400000 * 2).toISOString(),
    completedAt: null,
    createdBy: taskData.createdBy || 'Coordinator CCU Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveAllUnifiedTasks(tasks);

  logAdminMutationAudit({
    action: 'TASK_CREATED',
    entityType: newTask.entityType,
    entityId: newTask.entityId,
    actor: newTask.createdBy,
    details: `Tạo công việc [${newTask.id}] "${newTask.title}" giao cho ${newTask.ownerName}, hạn xử lý: ${newTask.dueAt.slice(0, 10)}.`
  });

  return newTask;
}

export function updateUnifiedTaskStatus(taskId, newStatus, actor = 'Coordinator Admin', note = '') {
  const tasks = getAllUnifiedTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy Task' };

  const task = tasks[idx];
  const oldStatus = task.status;
  task.status = newStatus;
  task.updatedAt = new Date().toISOString();
  if (newStatus === 'COMPLETED') {
    task.completedAt = new Date().toISOString();
  }

  tasks[idx] = task;
  saveAllUnifiedTasks(tasks);

  logAdminMutationAudit({
    action: 'TASK_STATUS_CHANGED',
    entityType: task.entityType,
    entityId: task.entityId,
    actor,
    details: `Cập nhật trạng thái Task ${task.id}: [${oldStatus}] -> [${newStatus}]. Ghi chú: ${note || 'Bình thường'}.`
  });

  return { success: true, task };
}

// ----------------------------------------------------------------------------
// 6. CONNECTIONS MATRIX SERVICE (Section 7 Board 03)
// ----------------------------------------------------------------------------
export const SEED_CONNECTIONS = [
  {
    id: 'CONN-2026-001',
    requirementId: 'NC-2026-00125',
    requirementCode: 'NC-2026-00125',
    requirementTitle: '500 bộ đồng phục công nhân KCN Amata',
    category: 'May mặc & Bảo hộ lao động',
    buyerCompanyName: 'Công ty TNHH Điện Tử Precision Tech Đồng Nai',
    buyerLocation: 'Đồng Nai (KCN Amata)',
    supplierId: 'ORG-PROSER-001',
    supplierName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    matchStatus: 'SAMPLE_OR_SURVEY',
    matchReason: 'Xưởng may trực tiếp tại Gò Vấp & Đồng Nai, đạt chứng chỉ OEKO-TEX, công suất 50.000 sp/tháng.',
    latestInteraction: 'Đã gửi 2 mẫu áo polo và bộ kaki 2 kim đến nhà máy qua ViettelPost.',
    sampleStatus: 'SENT_AWAITING_REVIEW',
    surveyStatus: 'NOT_REQUIRED',
    quotationAmount: '125.000.000 VNĐ (250.000 đ/bộ)',
    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Đặng Tuấn Kiệt',
    nextAction: 'Nhắc anh Nam (Buyer) phản hồi kết quả duyệt mẫu vải trước thứ Năm',
    nextActionAt: '2026-09-30T17:00:00Z',
    outcome: 'SAMPLE_IN_PROGRESS',
    createdAt: '2026-09-25T14:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z'
  },
  {
    id: 'CONN-2026-002',
    requirementId: 'NC-2026-00128',
    requirementCode: 'NC-2026-00128',
    requirementTitle: '10.000 chi tiết CNC nhôm KCN VSIP 1',
    category: 'Cơ khí & Chế tạo',
    buyerCompanyName: 'Công Ty TNHH Robot Tự Động Hóa FDI',
    buyerLocation: 'Bình Dương (KCN VSIP 1)',
    supplierId: 'ORG-LONGTHANH-002',
    supplierName: 'Công Ty Cổ Phần Cơ Khí Xây Dựng Long Thành',
    matchStatus: 'INVITED',
    matchReason: 'Sở hữu 12 máy phay CNC 4-5 trục Makino, có phòng đo CMM Mitutoyo.',
    latestInteraction: 'Gửi bản vẽ 2D/3D bóc tách dung sai ±0.01mm cho Trưởng xưởng.',
    sampleStatus: 'NOT_YET',
    surveyStatus: 'SCHEDULED_AUDIT',
    quotationAmount: 'Đang bóc tách dự toán vật liệu A6061-T6',
    ownerUserId: 'USER-TRONG-OPS',
    ownerName: 'Trần Đình Trọng',
    nextAction: 'Nhắc kỹ sư Long Thành gửi bảng chào giá sơ bộ trước 17:00 hôm nay',
    nextActionAt: '2026-09-28T17:00:00Z',
    outcome: 'NEGOTIATING',
    createdAt: '2026-09-26T10:30:00Z',
    updatedAt: '2026-09-27T15:00:00Z'
  },
  {
    id: 'CONN-2026-003',
    requirementId: 'NC-2026-00125',
    requirementCode: 'NC-2026-00125',
    requirementTitle: '500 bộ đồng phục công nhân KCN Amata',
    category: 'May mặc & Bảo hộ lao động',
    buyerCompanyName: 'Công ty TNHH Điện Tử Precision Tech Đồng Nai',
    buyerLocation: 'Đồng Nai (KCN Amata)',
    supplierId: 'ORG-ANPHU-003',
    supplierName: 'Xưởng May Bảo Hộ Lao Động An Phú',
    matchStatus: 'NOT_SUITABLE',
    matchReason: 'Chỉ nhận đơn hàng may tối thiểu 2.000 sản phẩm (Không đạt MOQ của Buyer).',
    latestInteraction: 'Trao đổi qua điện thoại xác nhận không đáp ứng MOQ đợt 1.',
    sampleStatus: 'NONE',
    surveyStatus: 'NONE',
    quotationAmount: 'N/A',
    ownerUserId: 'USER-KIET-B2B',
    ownerName: 'Đặng Tuấn Kiệt',
    nextAction: 'Lưu trữ hồ sơ NCC cho các gói thầu quy mô >2.000 bộ',
    nextActionAt: '2026-10-15T00:00:00Z',
    outcome: 'TECHNICAL_NOT_SUITABLE',
    createdAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-09-26T08:00:00Z'
  }
];

export function getAllConnections() {
  const raw = safeGet(STORAGE_KEYS.CONNECTIONS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return [...SEED_CONNECTIONS];
}

export function saveAllConnections(list) {
  safeSet(STORAGE_KEYS.CONNECTIONS, JSON.stringify(list));
}

export function updateConnectionOutcome({ connectionId, outcome, note = '', actor = 'Coordinator Admin' }) {
  const connections = getAllConnections();
  const idx = connections.findIndex(c => c.id === connectionId);
  if (idx < 0) return { success: false, message: 'Không tìm thấy kết nối' };

  const conn = connections[idx];
  const oldOutcome = conn.outcome;
  conn.outcome = outcome;
  conn.updatedAt = new Date().toISOString();

  connections[idx] = conn;
  saveAllConnections(connections);

  logAdminMutationAudit({
    action: 'CONNECTION_OUTCOME_RECORDED',
    entityType: 'CONNECTION',
    entityId: conn.id,
    actor,
    details: `Xác nhận kết quả kết nối [${conn.id}]: [${oldOutcome}] -> [${outcome}]. Ghi chú: ${note || 'Xác thực từ Buyer/NCC'}.`
  });

  return { success: true, connection: conn };
}

// ----------------------------------------------------------------------------
// 7. DATA QUALITY & COMPLETENESS QUEUE (Section 31)
// ----------------------------------------------------------------------------
export function getDataQualityQueue() {
  const orgs = getAllOrganizations();
  const claims = getAllClaims ? getAllClaims() : [];
  const issues = [];

  orgs.forEach(org => {
    // 1. Kiểm tra thiếu Năng lực
    if (!Array.isArray(org.capabilities) || org.capabilities.length === 0) {
      issues.push({
        id: `DQ-CAP-${org.id}`,
        orgId: org.id,
        orgName: org.name,
        type: 'MISSING_CAPABILITY',
        severity: 'HIGH',
        title: 'Doanh nghiệp chưa khai báo danh mục Năng Lực kỹ thuật',
        details: 'Không có dữ liệu dây chuyền máy móc để chạy thuật toán Matching.',
        ownerName: 'Đặng Tuấn Kiệt',
        dueAt: '2026-10-02T17:00:00Z'
      });
    }

    // 2. Kiểm tra thiếu Sản phẩm/Dịch vụ
    if (!Array.isArray(org.productsServices) || org.productsServices.length === 0) {
      issues.push({
        id: `DQ-PROD-${org.id}`,
        orgId: org.id,
        orgName: org.name,
        type: 'MISSING_PRODUCT',
        severity: 'MEDIUM',
        title: 'Hồ sơ chưa có Sản phẩm / Dịch vụ chủ lực',
        details: 'Buyer không xem được năng lực sản phẩm thực tế.',
        ownerName: 'Trần Đình Trọng',
        dueAt: '2026-10-05T17:00:00Z'
      });
    }

    // 3. Thiếu địa bàn hoặc KCN
    if (!org.province) {
      issues.push({
        id: `DQ-LOC-${org.id}`,
        orgId: org.id,
        orgName: org.name,
        type: 'MISSING_LOCATION',
        severity: 'LOW',
        title: 'Chưa cập nhật Tỉnh/Thành phố hoặc Khu Công Nghiệp',
        details: 'Cần bổ sung để định tuyến theo khu vực địa lý.',
        ownerName: 'Ban Dữ Liệu',
        dueAt: '2026-10-10T17:00:00Z'
      });
    }
  });

  // 4. Claims pending review
  claims.filter(c => c.status === 'PENDING').forEach(claim => {
    issues.push({
      id: `DQ-CLAIM-${claim.id}`,
      orgId: claim.organizationId,
      orgName: claim.organizationName || 'Hồ sơ yêu cầu xác minh',
      type: 'PENDING_CLAIM',
      severity: 'CRITICAL',
      title: `Yêu cầu nhận quyền quản lý hồ sơ: ${claim.claimantName} (${claim.claimantPhone})`,
      details: 'Chờ đối soát giấy phép kinh doanh / Giấy ủy quyền MST.',
      ownerName: 'Ban Pháp Lý & Xác Minh VCCI',
      dueAt: '2026-09-29T12:00:00Z'
    });
  });

  return issues;
}

// ----------------------------------------------------------------------------
// 8. 5 OPERATIONAL QUESTIONS & BOTTLENECK ENGINE (Section 2, 18, 41)
// Tính toán 100% từ DỮ LIỆU THẬT - Tuyệt đối không dùng số ảo / vanity metrics!
// ----------------------------------------------------------------------------
export function getUnifiedDashboardOperationalMetrics() {
  const requirements = getAllMasterRequirements();
  const connections = getAllConnections();
  const tasks = getAllUnifiedTasks();
  const now = new Date();
  const nowIso = now.toISOString();

  // 1. Có nhu cầu mới nào? (Intake / New / Submitted / Need more info)
  const newRequirements = requirements.filter(r => {
    const col = mapRequirementToPipelineColumn(r);
    return col === 'COLUMN_01_INTAKE';
  });

  // 2. Nhu cầu nào chưa tìm được nguồn? (Sourcing stage với 0 response / 0 match)
  const sourcingRequirements = requirements.filter(r => {
    const col = mapRequirementToPipelineColumn(r);
    return col === 'COLUMN_02_SOURCING';
  });
  const unsuppliedRequirements = sourcingRequirements.filter(r => {
    const conns = connections.filter(c => c.requirementId === r.id);
    return conns.length === 0;
  });

  // 3. Kết nối nào đang chờ? (Pending introduction / responses awaiting action)
  const pendingConnections = connections.filter(c => {
    return ['INVITED', 'RESPONDED', 'CONNECTED'].includes(c.matchStatus) && c.outcome !== 'ORDER_PLACED' && c.outcome !== 'CONTRACT_SIGNED';
  });

  // 4. Việc nào quá hạn? (nextActionAt < now or task dueAt < now)
  const overdueTasks = tasks.filter(t => {
    return t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && t.dueAt && t.dueAt < nowIso;
  });
  const overdueConnections = connections.filter(c => {
    return c.nextActionAt && c.nextActionAt < nowIso && !['ORDER_PLACED', 'CONTRACT_SIGNED', 'NOT_SUITABLE'].includes(c.matchStatus);
  });
  const totalOverdueCount = overdueTasks.length + overdueConnections.length;

  // 5. Kết quả nào chưa được xác nhận? (Connections in follow up or negotiation with UNKNOWN outcome)
  const unconfirmedOutcomes = connections.filter(c => {
    return ['SAMPLE_OR_SURVEY', 'QUOTED', 'NEGOTIATING'].includes(c.matchStatus) && (!c.outcome || c.outcome === 'UNKNOWN' || c.outcome === 'NEGOTIATING');
  });

  // Bottleneck distribution across 5 columns
  const columnCounts = {
    COLUMN_01_INTAKE: 0,
    COLUMN_02_SOURCING: 0,
    COLUMN_03_CONNECTING: 0,
    COLUMN_04_FOLLOW_UP: 0,
    COLUMN_05_OUTCOME: 0
  };

  requirements.forEach(r => {
    const col = mapRequirementToPipelineColumn(r);
    if (columnCounts[col] !== undefined) columnCounts[col]++;
  });

  // Xác định điểm nghẽn lớn nhất
  let maxCol = 'COLUMN_01_INTAKE';
  let maxCount = 0;
  Object.entries(columnCounts).forEach(([colId, count]) => {
    if (colId !== 'COLUMN_05_OUTCOME' && count > maxCount) {
      maxCount = count;
      maxCol = colId;
    }
  });

  return {
    operationalQuestions: {
      q1_newRequirementsCount: newRequirements.length,
      q2_unsuppliedRequirementsCount: unsuppliedRequirements.length,
      q3_pendingConnectionsCount: pendingConnections.length,
      q4_overdueWorkCount: totalOverdueCount,
      q5_unconfirmedOutcomesCount: unconfirmedOutcomes.length
    },
    bottleneck: {
      columnCounts,
      primaryBottleneckColumn: maxCol,
      primaryBottleneckCount: maxCount,
      totalActiveRequirements: requirements.length
    },
    overdueItems: {
      tasks: overdueTasks,
      connections: overdueConnections
    }
  };
}

// ----------------------------------------------------------------------------
// 9. UNIFIED AUDIT LOGGING (Section 30)
// Mọi mutation quan trọng đều được ghi nhật ký với actor, action, timestamp
// ----------------------------------------------------------------------------
const UNIFIED_AUDIT_KEY = 'ccu_admin_unified_audit_logs_v1';

export function getAllAdminAuditLogs() {
  const raw = safeGet(UNIFIED_AUDIT_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  // Fallback to sample audit trails
  return [
    {
      id: 'AUD-001',
      actor: 'Đặng Tuấn Kiệt (Coordinator)',
      action: 'REQUIREMENT_STATUS_CHANGED',
      entityType: 'REQUIREMENT',
      entityId: 'NC-2026-00125',
      details: 'Chuyển trạng thái sang TÌM NGUỒN (ACTIVE_SOURCING) sau khi xác thực MST và KCN Amata.',
      timestamp: '2026-09-25T08:45:00Z'
    },
    {
      id: 'AUD-002',
      actor: 'Trần Đình Trọng (Sourcing)',
      action: 'SUPPLIER_SHORTLISTED',
      entityType: 'SUPPLIER_MATCH',
      entityId: 'CONN-2026-001',
      details: 'Ghép nối NCC Proser (Chuyên Gia Đồng Phục) với Nhu cầu 500 bộ đồng phục.',
      timestamp: '2026-09-25T14:15:00Z'
    },
    {
      id: 'AUD-003',
      actor: 'System Admin Master',
      action: 'FOUNDING_INQUIRY_SUBMITTED',
      entityType: 'FOUNDING_PARTNERSHIP',
      entityId: 'FP-2026-001',
      details: 'Tiếp nhận đề xuất Founding Partner từ Proser cho cụm Đồng phục công nhân.',
      timestamp: '2026-09-28T09:00:00Z'
    }
  ];
}

export function logAdminMutationAudit({ action, entityType, entityId, actor = 'System Admin', details = '' }) {
  const logs = getAllAdminAuditLogs();
  const newLog = {
    id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    actor,
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  safeSet(UNIFIED_AUDIT_KEY, JSON.stringify(logs.slice(0, 150))); // Giữ 150 log gần nhất
  return newLog;
}

// ----------------------------------------------------------------------------
// 10. GLOBAL ADMIN SEARCH (Section 11)
// Tìm kiếm xuyên suốt: Requirement, ServiceRequest, Organization, Supplier, FP
// ----------------------------------------------------------------------------
export function searchAdminGlobal(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  // 1. Search Requirements
  const requirements = getAllMasterRequirements();
  requirements.forEach(r => {
    const matchCode = (r.publicCode || '').toLowerCase().includes(q);
    const matchTitle = (r.title || '').toLowerCase().includes(q);
    const matchBuyer = (r.buyerInfo?.companyName || '').toLowerCase().includes(q);
    if (matchCode || matchTitle || matchBuyer) {
      results.push({
        type: 'REQUIREMENT',
        id: r.id,
        code: r.publicCode,
        title: r.title,
        subtitle: `${r.category} • ${r.location}`,
        status: r.status,
        url: `/admin/nhu-cau/${r.id}`
      });
    }
  });

  // 2. Search Organizations & Suppliers
  const orgs = getAllOrganizations();
  orgs.forEach(o => {
    const matchName = (o.name || '').toLowerCase().includes(q);
    const matchTax = (o.taxCode || '').toLowerCase().includes(q);
    if (matchName || matchTax) {
      results.push({
        type: 'ORGANIZATION',
        id: o.id,
        code: o.taxCode ? `MST: ${o.taxCode}` : o.id,
        title: o.name,
        subtitle: `${o.province || 'Toàn quốc'} • ${o.roles?.join(', ')}`,
        status: o.isClaimed ? 'ĐÃ XÁC MINH' : 'CHƯA CLAIM',
        url: `/admin/to-chuc/${o.id}`
      });
    }
  });

  // 3. Search Service Requests
  const srvRequests = getAllServiceRequests ? getAllServiceRequests() : [];
  srvRequests.forEach(s => {
    const matchCode = (s.publicCode || s.id || '').toLowerCase().includes(q);
    const matchCompany = (s.companyName || s.customerName || '').toLowerCase().includes(q);
    if (matchCode || matchCompany) {
      results.push({
        type: 'SERVICE_REQUEST',
        id: s.id,
        code: s.publicCode || s.id,
        title: s.companyName || s.customerName || 'Yêu cầu dịch vụ',
        subtitle: `${s.serviceType} • Hạn: ${s.deadline || 'Theo tiến độ'}`,
        status: s.status,
        url: `/admin/dich-vu/${s.id}`
      });
    }
  });

  // 4. Search Founding Partnerships
  const fps = getAllFoundingPartnerships ? getAllFoundingPartnerships() : [];
  fps.forEach(fp => {
    const matchName = (fp.partnerName || '').toLowerCase().includes(q);
    const matchCat = (fp.categoryName || '').toLowerCase().includes(q);
    if (matchName || matchCat) {
      results.push({
        type: 'FOUNDING_PARTNER',
        id: fp.id,
        code: fp.publicCode || fp.id,
        title: fp.partnerName,
        subtitle: `Tài trợ: ${fp.categoryName} (${fp.startDate} → ${fp.endDate})`,
        status: fp.status,
        url: `/admin/founding-partner/${fp.id}`
      });
    }
  });

  return results.slice(0, 15);
}
