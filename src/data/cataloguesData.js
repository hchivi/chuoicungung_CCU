// ============================================================================
import { isCloudBrowser, getCloudRecords } from './cloudData.js';
import { persistSubmission, getPrivateSubmissions } from '../services/submissionService.js';
// MASTER CATALOGUES & INDUSTRIAL PUBLICATIONS DATA SERVICE
// PAGE 30: DANH SÁCH CATALOGUE & ẤN PHẨM (/catalogue)
// Chuẩn hóa theo spec 30.txt - CHUOICUNGUNG.COM
// ============================================================================

const inMemoryStore = {};

function safeGetItem(key) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return inMemoryStore[key] || null;
    }
  }
  return inMemoryStore[key] || null;
}

function safeSetItem(key, val) {
  inMemoryStore[key] = val;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }
}

const STORAGE_KEYS = {
  CATALOGUES: 'ccu_master_catalogues_v1',
  EDITIONS: 'ccu_catalogue_editions_v1',
  ENTRIES: 'ccu_catalogue_entries_v1',
  DISTRIBUTION_BATCHES: 'ccu_catalogue_distribution_batches_v1',
  QR_SCANS: 'ccu_catalogue_qr_scans_v1',
  PARTICIPATION_REQUESTS: 'ccu_catalogue_participation_requests_v1',
  AUDIT_LOGS: 'ccu_catalogue_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. CATALOGUE TYPES & STATUSES (SPEC SECTION 6 & 21)
// ----------------------------------------------------------------------------
export const CATALOGUE_TYPES = {
  CATEGORY_CATALOGUE: {
    id: 'CATEGORY_CATALOGUE',
    label: 'Theo Chuyên Mục & Ngành',
    shortName: 'Chuyên mục',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  PROGRAM_CATALOGUE: {
    id: 'PROGRAM_CATALOGUE',
    label: 'Theo Chương Trình & Sự Kiện',
    shortName: 'Chương trình',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  INDUSTRIAL_PARK_CATALOGUE: {
    id: 'INDUSTRIAL_PARK_CATALOGUE',
    label: 'Theo Khu Công Nghiệp',
    shortName: 'Khu công nghiệp',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  ASSOCIATION_CATALOGUE: {
    id: 'ASSOCIATION_CATALOGUE',
    label: 'Theo Hội & Hiệp Hội',
    shortName: 'Hiệp hội',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  SUPPLIER_SHORTLIST_CATALOGUE: {
    id: 'SUPPLIER_SHORTLIST_CATALOGUE',
    label: 'Top Tuyển Chọn & Bạch Thư',
    shortName: 'Top tuyển chọn',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  GENERAL_SUPPLIER_CATALOGUE: {
    id: 'GENERAL_SUPPLIER_CATALOGUE',
    label: 'Tổng Hợp Nhà Cung Cấp',
    shortName: 'Tổng hợp',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
  }
};

export const CATALOGUE_STATUSES = {
  PLANNING: { id: 'PLANNING', label: 'Lên Kế Hoạch', color: 'slate' },
  CONTENT_COLLECTION: { id: 'CONTENT_COLLECTION', label: 'Thu Thập Hồ Sơ', color: 'amber' },
  CONTENT_REVIEW: { id: 'CONTENT_REVIEW', label: 'Biên Tập & Thẩm Định', color: 'orange' },
  DIGITAL_PREVIEW: { id: 'DIGITAL_PREVIEW', label: 'Bản Xem Trước Số', color: 'blue' },
  APPROVED: { id: 'APPROVED', label: 'Đã Duyệt Nội Dung', color: 'indigo' },
  PUBLISHED_DIGITAL: { id: 'PUBLISHED_DIGITAL', label: 'Phát Hành Trực Tuyến', color: 'emerald' },
  PRINT_CONFIRMED: { id: 'PRINT_CONFIRMED', label: 'Xác Nhận In Ấn', color: 'purple' },
  PRINTED: { id: 'PRINTED', label: 'Đã In Thành Phẩm', color: 'teal' },
  DISTRIBUTING: { id: 'DISTRIBUTING', label: 'Đang Phân Phối', color: 'sky' },
  COMPLETED: { id: 'COMPLETED', label: 'Hoàn Tất Phát Hành', color: 'green' },
  ARCHIVED: { id: 'ARCHIVED', label: 'Lưu Trữ', color: 'gray' },
  CANCELLED: { id: 'CANCELLED', label: 'Hủy Bỏ', color: 'rose' }
};

export const ENTRY_APPROVAL_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  NEED_MORE_INFO: 'NEED_MORE_INFO',
  CONTENT_PREPARATION: 'CONTENT_PREPARATION',
  CLIENT_REVIEW: 'CLIENT_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export const SPONSOR_PLACEMENT_TYPES = {
  ORGANIC: { id: 'ORGANIC', label: 'Hồ sơ tiêu chuẩn' },
  SPONSORED: { id: 'SPONSORED', label: 'TÀI TRỢ', badge: 'bg-amber-500 text-white' },
  FOUNDING_PARTNER_ENTITLEMENT: { id: 'FOUNDING_PARTNER_ENTITLEMENT', label: 'ĐỐI TÁC ĐỒNG HÀNH', badge: 'bg-indigo-600 text-white' },
  STRATEGIC_CO_HOST: { id: 'STRATEGIC_CO_HOST', label: 'ĐỒNG CHỦ TRÌ', badge: 'bg-emerald-600 text-white' }
};

// ----------------------------------------------------------------------------
// 2. SEED MASTER CATALOGUES & EDITIONS (SPEC SECTION 4, 5, 13, 21, 31, 32, 36)
// ----------------------------------------------------------------------------
export const SEED_MASTER_CATALOGUES = websiteSeed('cataloguesData.SEED_MASTER_CATALOGUES');

// ----------------------------------------------------------------------------
// 3. UPCOMING EDITIONS CALL FOR PROFILES (SPEC SECTION 25: THAM GIA ẤN PHẨM TIẾP THEO)
// ----------------------------------------------------------------------------
export const UPCOMING_EDITIONS_CALL_FOR_PAPERS = [
  {
    id: 'UPCOMING-ED-NORTH-2026',
    title: 'Catalogue Nhà Cung Ứng Phụ Trợ & Công Nghệ Cao KCN Phía Bắc - Q3/2026',
    scope: 'KCN Bắc Ninh, Hải Phòng, Hà Nội, Vĩnh Phúc & Thái Nguyên',
    categoryTarget: 'Cơ khí chính xác, Khuôn mẫu, Ép nhựa kỹ thuật & Tự động hóa',
    deadline: '30/06/2026',
    publicationTargetDate: '15/08/2026',
    plannedPrintRun: 1500,
    targetDistributionEvents: 'Diễn đàn Chuỗi Cung Ứng Vùng Thủ Đô & Hội chợ Điện tử Quốc tế NEPCON',
    requirements: [
      'Có nhà máy/phân xưởng sản xuất thực tế tại Việt Nam (có kiểm xưởng hoặc ảnh đối chiếu)',
      'Hồ sơ pháp lý minh bạch, mã số thuế hợp lệ, không nợ đọng thuế tiêu cực',
      'Đạt tối thiểu 01 chứng nhận quản lý chất lượng (ISO 9001, IATF 16949 hoặc tương đương)',
      'Cam kết cung cấp mẫu vật phẩm và báo giá theo quy chuẩn B2B khi có yêu cầu từ Buyer'
    ],
    editorialProcess: [
      'Bước 1: Tiếp nhận hồ sơ & thẩm định sơ bộ tính đầy đủ pháp lý (3 ngày làm việc)',
      'Bước 2: Chuẩn hóa dữ liệu năng lực, quy cách máy móc và thẩm định bản quyền ảnh xưởng',
      'Bước 3: Xuất bản Bản Số Xem Trước (Digital Preview) và gửi doanh nghiệp duyệt (Client Review)',
      'Bước 4: Phê duyệt chính thức (Approved) ➔ Gắn mã QR định danh và xuất bản trên E-Catalogue',
      'Bước 5: Đưa vào danh sách in ấn thành phẩm khi hội đồng xuất bản ký lệnh in'
    ],
    pricingAndEntitlements: {
      standardFee: '12.000.000 VNĐ / Doanh nghiệp',
      foundingPartnerEntitlement: 'MIỄN PHÍ 100% (Đã bao gồm trong Quyền lợi Hợp đồng Đối tác Sáng lập - INCLUDED_IN_FOUNDING_PARTNER)',
      includes: '01 Trang hồ sơ chuẩn hóa song ngữ + 20 cuốn in thành phẩm gửi tận nơi + Trưng bày tại Bàn Giao Thương CCU'
    },
    status: 'ACCEPTING_SUBMISSIONS'
  },
  {
    id: 'UPCOMING-ED-GREEN-ESG-2026',
    title: 'Bạch Thư & E-Catalogue Nhà Máy Chuyển Đổi Xanh & Tiết Kiệm Năng Lượng 2026',
    scope: 'Toàn quốc (Ưu tiên các nhà máy KCN Sinh Thái)',
    categoryTarget: 'Năng lượng mặt trời mái nhà, Xử lý nước thải, Tái chế vật liệu & Chứng chỉ Carbon',
    deadline: '15/07/2026',
    publicationTargetDate: '20/09/2026',
    plannedPrintRun: 1000,
    targetDistributionEvents: 'Hội nghị Bàn tròn ESG Doanh Nghiệp FDI & Diễn đàn Sản Xuất Xanh',
    requirements: [
      'Có giải pháp hoặc dịch vụ giảm phát thải CO2, tiết kiệm điện/nước cho nhà xưởng',
      'Có case study hoặc dự án thực tế đã nghiệm thu tại ít nhất 01 khu công nghiệp'
    ],
    editorialProcess: [
      'Thẩm định tiêu chuẩn xanh ➔ Biên tập chuyên sâu ➔ Duyệt bản số ➔ Phát hành điện tử & in ấn'
    ],
    pricingAndEntitlements: {
      standardFee: '15.000.000 VNĐ / Doanh nghiệp',
      foundingPartnerEntitlement: 'MIỄN PHÍ (Theo hạn mức quyền lợi)',
      includes: 'Báo cáo độc lập + Mã QR tương tác + Bài viết chuyên đề trên Cổng thông tin CCU'
    },
    status: 'ACCEPTING_SUBMISSIONS'
  }
];

// ----------------------------------------------------------------------------
// 4. STORAGE HELPERS & DATA ACCESS API
// ----------------------------------------------------------------------------
export function getAllCatalogues(filters = {}) {
  let list = [];
  try {
    const raw = isCloudBrowser() ? JSON.stringify(getCloudRecords('catalogues')) : safeGetItem(STORAGE_KEYS.CATALOGUES);
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = [...SEED_MASTER_CATALOGUES];
    }
  } catch (e) {
    list = [...SEED_MASTER_CATALOGUES];
  }

  // Filter: Search Term (Section 7)
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(item => {
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchTopic = (item.topic || '').toLowerCase().includes(q);
      const matchDesc = (item.shortDescription || '').toLowerCase().includes(q);
      const matchCategory = (item.categoryName || '').toLowerCase().includes(q);
      const matchProvince = (item.provinceName || '').toLowerCase().includes(q);
      const matchPark = (item.industrialParkName || '').toLowerCase().includes(q);
      const matchPublisher = (item.publisherName || '').toLowerCase().includes(q);
      const matchProgram = (item.programTitle || '').toLowerCase().includes(q);

      // Search in approved supplier entries
      const currentEd = (item.editions || []).find(e => e.id === item.currentEditionId) || item.editions?.[0];
      const matchEntry = (currentEd?.entries || []).some(entry => 
        entry.approvalStatus === 'APPROVED' && (entry.organizationName || '').toLowerCase().includes(q)
      );

      return matchTitle || matchTopic || matchDesc || matchCategory || matchProvince || matchPark || matchPublisher || matchProgram || matchEntry;
    });
  }

  // Filter: Category / Topic (Section 8)
  if (filters.categoryId && filters.categoryId !== 'ALL') {
    list = list.filter(item => item.categoryId === filters.categoryId);
  }

  // Filter: Catalogue Type (Section 8 & 21)
  if (filters.catalogueType && filters.catalogueType !== 'ALL') {
    list = list.filter(item => item.catalogueType === filters.catalogueType);
  }

  // Filter: Province / Region (Section 8)
  if (filters.provinceId && filters.provinceId !== 'ALL') {
    list = list.filter(item => item.provinceId === filters.provinceId || item.provinceId === 'all');
  }

  // Filter: Industrial Park (Section 8)
  if (filters.industrialParkId && filters.industrialParkId !== 'ALL') {
    list = list.filter(item => item.industrialParkId === filters.industrialParkId);
  }

  // Filter: Format (Section 8: Online / Print / Both)
  if (filters.format && filters.format !== 'ALL') {
    list = list.filter(item => {
      const curEd = item.editions?.find(e => e.id === item.currentEditionId) || item.editions?.[0];
      return curEd?.format === filters.format || curEd?.format === 'BOTH';
    });
  }

  // Filter: Status (Active vs Archived)
  if (filters.status && filters.status !== 'ALL') {
    if (filters.status === 'ARCHIVED') {
      list = list.filter(item => item.status === 'ARCHIVED');
    } else {
      list = list.filter(item => item.status !== 'ARCHIVED');
    }
  }

  return list;
}

export function getCatalogueBySlug(slug) {
  const all = getAllCatalogues();
  return all.find(c => c.slug === slug || c.id === slug) || null;
}

export function getCatalogueById(id) {
  const all = getAllCatalogues();
  return all.find(c => c.id === id) || null;
}

export function saveAllCatalogues(cats) {
  try {
    safeSetItem(STORAGE_KEYS.CATALOGUES, JSON.stringify(cats));
  } catch (e) {}
}

// ----------------------------------------------------------------------------
// 5. PUBLIC ENTRIES SANITIZATION (SPEC SECTION 14 & 50)
// ----------------------------------------------------------------------------
export function getPublicApprovedEntries(catalogueOrEdition) {
  if (!catalogueOrEdition) return [];
  let entries = [];

  if (catalogueOrEdition.entries) {
    entries = catalogueOrEdition.entries;
  } else if (catalogueOrEdition.editions) {
    const curEd = catalogueOrEdition.editions.find(e => e.id === catalogueOrEdition.currentEditionId) || catalogueOrEdition.editions[0];
    entries = curEd?.entries || [];
  }

  // Hard Rule Section 14: Only approved entries appear in public edition!
  return entries.filter(e => e.approvalStatus === 'APPROVED').sort((a, b) => (a.position || 99) - (b.position || 99));
}

// ----------------------------------------------------------------------------
// 6. ADMIN PRINT GATE BLOCKERS CHECK (SPEC SECTION 12 & 47)
// ----------------------------------------------------------------------------
export function checkPrintGate(edition) {
  if (!edition) {
    return { canPrint: false, blockers: ['Không tìm thấy ấn bản tương ứng'] };
  }

  const blockers = [];

  // Check 1: Approved content and approved supplier list
  const approvedEntries = (edition.entries || []).filter(e => e.approvalStatus === 'APPROVED');
  if (approvedEntries.length === 0) {
    blockers.push('Chưa có doanh nghiệp nào được duyệt nội dung chính thức (Approved entries = 0)');
  }

  // Check 2: Budget confirmed
  if (!edition.commercialBreakdown || !edition.commercialBreakdown.printingCostPerCopy) {
    blockers.push('Chưa xác nhận đơn giá in ấn và dự toán ngân sách xuất bản');
  }

  // Check 3: Print quantity confirmed
  if (!edition.confirmedPrintQuantity || edition.confirmedPrintQuantity <= 0) {
    blockers.push('Chưa xác nhận số lượng in thành phẩm thực tế (confirmedPrintQuantity <= 0)');
  }

  // Check 4: Distribution scope & plan confirmed
  if (!edition.distributionBatches || edition.distributionBatches.length === 0) {
    blockers.push('Thiếu kế hoạch phân phối (Chưa thiết lập đợt giao nhận hoặc kênh phân phối cụ thể)');
  }

  // Check 5: Responsible owner
  if (!edition.status || edition.status === 'PLANNING') {
    blockers.push('Ấn bản chưa hoàn thành thẩm định nội dung số (Phải đạt trạng thái APPROVED hoặc PUBLISHED_DIGITAL trước khi in)');
  }

  return {
    canPrint: blockers.length === 0,
    blockers
  };
}

// ----------------------------------------------------------------------------
// 7. QR CODE TRACKING & SCAN ENGINE (SPEC SECTION 17, 18, 19, 40)
// ----------------------------------------------------------------------------
export function generateCatalogueQrDestinationUrl(catalogueId, editionId, entryId, targetSlug) {
  const baseUrl = `https://chuoicungung.com${targetSlug.startsWith('/') ? targetSlug : '/' + targetSlug}`;
  return `${baseUrl}?utm_source=catalogue&utm_medium=qr&catalogue=${catalogueId}&edition=${editionId}&entry=${entryId}&scan_ts=${Date.now()}`;
}

export function trackCatalogueQrScan(catalogueId, editionId, entryId) {
  const scanEvent = {
    id: `SCAN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    catalogueId,
    editionId,
    entryId,
    scannedAt: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
    // Hard Rule Section 19 & 40: QR Scan != Buyer Need, != Deal
    isQualifiedBuyerNeed: false,
    convertedToRequirement: false
  };

  try {
    const raw = safeGetItem(STORAGE_KEYS.QR_SCANS);
    const scans = raw ? JSON.parse(raw) : [];
    scans.push(scanEvent);
    safeSetItem(STORAGE_KEYS.QR_SCANS, JSON.stringify(scans.slice(-1000))); // Keep last 1000
  } catch (e) {}

  return scanEvent;
}

// ----------------------------------------------------------------------------
// 8. SERVICE REQUEST & PARTICIPATION REGISTRATION (SPEC SECTION 25, 26, 27)
// ----------------------------------------------------------------------------
export async function submitCatalogueParticipation(participationData) {
  const submission = {
    id: `CAT-SUB-${Date.now()}`,
    serviceType: 'CATALOGUE_PARTICIPATION',
    targetEditionId: participationData.editionId || 'UPCOMING-ED-NORTH-2026',
    editionTitle: participationData.editionTitle || 'Ấn phẩm sắp tới',
    companyName: participationData.companyName,
    taxCode: participationData.taxCode,
    contactPerson: participationData.contactPerson,
    phone: participationData.phone,
    email: participationData.email,
    category: participationData.category,
    province: participationData.province,
    capabilitiesSummary: participationData.capabilitiesSummary,
    isFoundingPartner: !!participationData.isFoundingPartner,
    // Flow: ServiceRequest -> Review -> Scope -> Quote -> Preparation -> Approval -> Publish (Section 27)
    status: 'SUBMITTED', // Section 27: Form submit != Catalogue approval!
    createdAt: new Date().toISOString()
  };
  if (isCloudBrowser()) return persistSubmission('catalogueParticipation', submission);

  try {
    const raw = safeGetItem(STORAGE_KEYS.PARTICIPATION_REQUESTS);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(submission);
    safeSetItem(STORAGE_KEYS.PARTICIPATION_REQUESTS, JSON.stringify(list));
  } catch (e) {}

  // Ghi nhận AuditLog (Section 55 QA 17)
  logCatalogueAudit('CATALOGUE_PARTICIPATION_SUBMITTED', {
    submissionId: submission.id,
    companyName: submission.companyName,
    targetEditionId: submission.targetEditionId
  });

  return submission;
}

export function getAllCatalogueParticipations() {
  if (isCloudBrowser()) return getPrivateSubmissions('catalogueParticipation');
  try {
    const raw = safeGetItem(STORAGE_KEYS.PARTICIPATION_REQUESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

// ----------------------------------------------------------------------------
// 9. AUDIT LOGGING (SPEC SECTION 45 & 55 QA 17)
// ----------------------------------------------------------------------------
export function logCatalogueAudit(action, metadata = {}, actor = 'System') {
  const entry = {
    id: `LOG-CAT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    metadata,
    actor,
    timestamp: new Date().toISOString()
  };

  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift(entry);
    safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 500)));
  } catch (e) {}

  return entry;
}

export function getAllCatalogueAuditLogs() {
  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 'LOG-CAT-01',
      action: 'CATALOGUE_PUBLISHED_DIGITAL',
      metadata: { catalogueId: 'CAT-DONG-PHUC-2026', editionCode: 'ED-2026-V1' },
      actor: 'Tô Ngọc Dũng',
      timestamp: '2026-03-10T10:00:00Z'
    },
    {
      id: 'LOG-CAT-02',
      action: 'PRINT_BATCH_CONFIRMED',
      metadata: { catalogueId: 'CAT-DONG-PHUC-2026', confirmedCopies: 800 },
      actor: 'Đặng Tuấn Kiệt',
      timestamp: '2026-03-14T15:30:00Z'
    }
  ];
}

// ----------------------------------------------------------------------------
// 10. CATALOGUE B2B CONNECTION REQUEST (SPEC SECTION 40)
// ----------------------------------------------------------------------------
export async function submitCatalogueConnectionRequest(data, actor = 'Buyer Partner') {
  const connection = {
    id: `CAT-CONN-${Date.now()}`,
    sourceCatalogueId: data.catalogueId,
    editionId: data.editionId,
    entryId: data.entryId,
    targetOrganizationId: data.targetOrganizationId,
    targetOrganizationName: data.targetOrganizationName,
    requesterName: data.contactName,
    requesterCompany: data.companyName,
    requesterPhone: data.contactPhone, // Kept private in CCU Desk
    requesterEmail: data.contactEmail,
    requirementSummary: data.requirementSummary || 'Yêu cầu kết nối cung ứng xuất phát từ ấn phẩm Catalogue',
    status: 'PENDING_COORDINATION', // Sent to CCU Coordination Desk
    createdAt: new Date().toISOString()
  };
  if (isCloudBrowser()) return persistSubmission('catalogueConnection', connection);

  try {
    const raw = safeGetItem('ccu_catalogue_connections_v1');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(connection);
    safeSetItem('ccu_catalogue_connections_v1', JSON.stringify(list));
  } catch (e) {}

  logCatalogueAudit('CATALOGUE_CONNECTION_REQUEST_CREATED', {
    connectionId: connection.id,
    catalogueId: data.catalogueId,
    targetOrganizationId: data.targetOrganizationId
  }, actor);

  return connection;
}

export function getAllCatalogueConnectionRequests(catalogueId = null) {
  if (isCloudBrowser()) return getPrivateSubmissions('catalogueConnection').filter(row => !catalogueId || row.sourceCatalogueId === catalogueId);
  try {
    const raw = safeGetItem('ccu_catalogue_connections_v1');
    if (raw) {
      const all = JSON.parse(raw);
      if (catalogueId) return all.filter(c => c.sourceCatalogueId === catalogueId);
      return all;
    }
  } catch (e) {}
  return [];
}
import { websiteSeed } from './websiteSeeds.js';
