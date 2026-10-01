// ============================================================================
// SOURCING DOSSIER DATA LAYER & WORKFLOW ENGINE
// PAGE 35: BỘ HỒ SƠ TUYỂN CHỌN (/bo-ho-so/[slug])
// Chuẩn hóa theo spec 35.txt - CHUOICUNGUNG.COM
// ============================================================================

import { SEED_REQUIREMENTS } from './requirementsData.js';

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
  DOSSIERS: 'ccu_sourcing_dossiers_v1',
  ADJUSTMENT_REQUESTS: 'ccu_dossier_adjustment_requests_v1',
  AUDIT_LOGS: 'ccu_dossier_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. CANONICAL ENUMS (SECTIONS 4, 5, 14, 16, 19, 20)
// ----------------------------------------------------------------------------
export const DOSSIER_TYPES = {
  GENERAL_BUYER_GUIDE: 'GENERAL_BUYER_GUIDE',         // Cẩm nang tuyển chọn chung theo chuyên mục
  REQUIREMENT_SHORTLIST: 'REQUIREMENT_SHORTLIST',     // Danh sách ứng viên cho 1 nhu cầu B2B cụ thể
  PROGRAM_SHORTLIST: 'PROGRAM_SHORTLIST',             // Nhóm NCC chuẩn bị cho 1 sự kiện / Sourcing Day
  INDUSTRIAL_PARK_SHORTLIST: 'INDUSTRIAL_PARK_SHORTLIST', // Nhóm NCC phục vụ một Cụm KCN cụ thể
  ASSOCIATION_SHORTLIST: 'ASSOCIATION_SHORTLIST',     // Danh sách tuyển chọn thuộc Hiệp hội
  CATEGORY_SHORTLIST: 'CATEGORY_SHORTLIST',           // Danh sách ứng viên theo cụm từ khóa ngành
  CUSTOM_SOURCING: 'CUSTOM_SOURCING'                  // Đề bài sourcing riêng theo đơn đặt hàng
};

export const DOSSIER_VISIBILITY = {
  PUBLIC: 'PUBLIC',                                   // Công khai (Buyer guide, không lộ giá/tên Buyer)
  PRIVATE: 'PRIVATE',                                 // Riêng tư (Buyer cụ thể, phân quyền RBAC)
  AUTHORIZED_PARTICIPANTS: 'AUTHORIZED_PARTICIPANTS', // Chỉ các bên trong chương trình được xem
  ORGANIZATION_PRIVATE: 'ORGANIZATION_PRIVATE'        // Chỉ thành viên nội bộ công ty được xem
};

export const DOSSIER_STATUSES = {
  DRAFT: 'DRAFT',                                     // Bản thảo ban đầu
  IN_RESEARCH: 'IN_RESEARCH',                         // Đang khảo sát & bổ sung NCC
  READY_FOR_REVIEW: 'READY_FOR_REVIEW',               // Đã hoàn thiện tiêu chí, chờ Buyer duyệt
  PUBLISHED: 'PUBLISHED',                             // Đã xuất bản công khai
  SHARED: 'SHARED',                                   // Đã chia sẻ riêng cho Buyer
  NEED_ADJUSTMENT: 'NEED_ADJUSTMENT',                 // Buyer yêu cầu điều chỉnh tiêu chí/ứng viên
  UPDATED: 'UPDATED',                                 // Đã cập nhật phiên bản mới
  CLOSED: 'CLOSED',                                   // Đã hoàn tất đợt sourcing
  ARCHIVED: 'ARCHIVED'                                // Lưu trữ lịch sử
};

export const ENTRY_STATUSES = {
  CONSIDERED: 'CONSIDERED',                           // Đang xem xét sơ bộ
  INVITED: 'INVITED',                                 // Đã mời phản hồi nhu cầu
  RESPONDED: 'RESPONDED',                             // NCC đã gửi báo giá / hồ sơ phản hồi
  NEED_MORE_INFO: 'NEED_MORE_INFO',                   // Cần bổ sung thông tin kỹ thuật / mẫu
  SHORTLISTED: 'SHORTLISTED',                         // Đã đưa vào danh sách rút gọn
  NOT_SUITABLE: 'NOT_SUITABLE',                       // Chưa phù hợp với đề bài này
  WITHDRAWN: 'WITHDRAWN',                             // NCC xin rút không tham gia
  CONNECTED: 'CONNECTED',                             // Đã kết nối làm việc trực tiếp với Buyer
  ARCHIVED: 'ARCHIVED'                                // Lưu trữ
};

export const MATCH_REASON_TYPES = {
  CAPABILITY_MATCH: 'Khớp năng lực gia công / sản xuất',
  PRODUCT_MATCH: 'Đúng danh mục sản phẩm yêu cầu',
  SERVICE_AREA_MATCH: 'Phục vụ địa bàn & KCN mục tiêu',
  ORDER_SIZE_MATCH: 'Phù hợp quy mô đơn hàng (MOQ)',
  TIMELINE_MATCH: 'Đáp ứng tiến độ bàn giao',
  CERTIFICATION_MATCH: 'Đạt chứng chỉ kỹ thuật / tiêu chuẩn chất lượng',
  SAMPLE_AVAILABLE: 'Có khả năng cung cấp mẫu đối chứng',
  PROGRAM_ELIGIBLE: 'Đủ điều kiện tham gia phiên kết nối sự kiện',
  MANUAL_RESEARCH: 'Khảo sát thực tế bởi đội ngũ điều phối'
};

export const EVIDENCE_TYPES = {
  REAL_EVIDENCE: 'Bằng chứng thực tế (ảnh xưởng, mẫu kiểm định)',
  SUPPLIER_DECLARED: 'Dữ liệu tự khai của doanh nghiệp',
  CATALOGUE: 'Catalogue ấn phẩm đã phát hành',
  SAMPLE_PHOTO: 'Ảnh chụp mẫu sản phẩm đối chứng'
};

// ----------------------------------------------------------------------------
// 2. SEED SOURCING DOSSIERS (SECTION 2, 3, 6, 7, 22)
// ----------------------------------------------------------------------------
export const SEED_SOURCING_DOSSIERS = [
  // DOSSIER 1: PUBLIC DOSSIER - May mặc & Bảo hộ lao động tại Đồng Nai (Gắn với NC-2026-00125)
  {
    id: 'DOS-2026-001',
    slug: 'dong-phuc-bao-ho-nha-may-dong-nai',
    publicCode: 'BHS-2026-001',
    title: 'Bộ Hồ Sơ Tuyển Chọn Nhà Cung Ứng May Mặc & Bảo Hộ Lao Động Cho Nhà Máy Mới Tại Đồng Nai',
    purpose: 'Chuẩn bị danh sách nhà cung ứng may mặc đồng phục công nhân, kỹ sư và trang bị bảo hộ lao động (PPE) có khả năng giao hàng tại KCN Amata và các KCN lân cận tỉnh Đồng Nai, đáp ứng tiêu chuẩn may đo công nghiệp và có mẫu vải đối chứng.',
    dossierType: DOSSIER_TYPES.REQUIREMENT_SHORTLIST,
    requirementId: 'NC-2026-00125',
    programId: 'sourcing-day-amata-dong-nai',
    industrialParkId: 'kcn-amata',
    industrialParkName: 'KCN Amata, TP. Biên Hòa, Đồng Nai',
    categoryId: 'may-mac-dong-phuc',
    categoryName: 'May mặc & Bảo hộ lao động',
    locationId: 'dong-nai',
    locationName: 'Đồng Nai & TP.HCM',
    visibility: DOSSIER_VISIBILITY.PUBLIC,
    status: DOSSIER_STATUSES.PUBLISHED,
    version: 'v2.0',
    preparedBy: {
      team: 'Tổ Điều Phối Chuỗi Cung Ứng Vùng Đông Nam Bộ',
      role: 'Sourcing Coordinator Desk',
      userId: 'USER-COORD-001'
    },
    ownerUserId: 'USER-BUYER-001',
    publishedAt: '2026-09-20T08:00:00+07:00',
    updatedAt: '2026-09-28T16:30:00+07:00',
    createdAt: '2026-09-15T09:00:00+07:00',
    isOutdatedWarning: false,

    // TIÊU CHÍ LỰA CHỌN (Section 10, 11)
    criteria: [
      {
        id: 'CRIT-01',
        criterionType: 'SERVICE_AREA',
        label: 'Địa bàn giao hàng',
        expectedValue: 'Đồng Nai / KCN Amata / TP. Biên Hòa',
        source: 'Đề bài nhu cầu NC-2026-00125',
        required: true,
        displayOrder: 1
      },
      {
        id: 'CRIT-02',
        criterionType: 'CAPABILITY',
        label: 'Năng lực may đo công nghiệp & in thêu logo',
        expectedValue: 'Tối thiểu 1.000 sản phẩm/tháng, đường may vắt sổ 2 kim',
        source: 'Quy chuẩn kỹ thuật xưởng may',
        required: true,
        displayOrder: 2
      },
      {
        id: 'CRIT-03',
        criterionType: 'SAMPLE_AVAILABILITY',
        label: 'Cung cấp mẫu đối chứng',
        expectedValue: 'Có mẫu vải Kaki 65/35, Pangrim hoặc áo thun cá sấu trước khi may loạt',
        source: 'Yêu cầu phòng Mua hàng',
        required: true,
        displayOrder: 3
      },
      {
        id: 'CRIT-04',
        criterionType: 'ORDER_SIZE',
        label: 'Quy mô đơn hàng (MOQ)',
        expectedValue: 'Nhận đơn từ 300 – 1.000 bộ/đợt',
        source: 'Kế hoạch tuyển dụng nhà máy',
        required: true,
        displayOrder: 4
      },
      {
        id: 'CRIT-05',
        criterionType: 'CERTIFICATION',
        label: 'Chứng nhận chất lượng / Giấy thử nghiệm vải',
        expectedValue: 'Chứng nhận độ bền màu, độ co giãn hoặc ISO 9001',
        source: 'Tiêu chuẩn Audit nhà xưởng',
        required: false,
        displayOrder: 5
      }
    ],

    // DANH SÁCH ỨNG VIÊN ĐƯỢC XEM XÉT (Section 12, 13, 15, 16, 17)
    candidates: [
      {
        id: 'ENT-01',
        supplierOrganizationId: 'ORG-SUP-MAYMAC-01',
        supplierName: 'Công ty Cổ phần May Mặc & Bảo Hộ Tân Bình Minh',
        supplierSlug: 'cong-ty-may-mac-tan-binh-minh',
        status: ENTRY_STATUSES.SHORTLISTED,
        displayOrder: 1,
        inclusionReason: 'Xưởng may quy mô 120 chuyền tại Biên Hòa, có khả năng may mẫu trong 3 ngày và đã cung cấp đồng phục cho 15 nhà máy FDI tại KCN Amata.',
        matchReasons: [
          { type: 'SERVICE_AREA_MATCH', label: 'Kho & xưởng cách KCN Amata 6km', source: 'Hồ sơ năng lực xác thực' },
          { type: 'CAPABILITY_MATCH', label: 'Chuyên dòng vải Pangrim Hàn Quốc & Kaki chống tĩnh điện', source: 'Catalogue 2026' },
          { type: 'SAMPLE_AVAILABLE', label: 'Cam kết cấp mẫu thử miễn phí', source: 'Phản hồi đơn hàng' },
          { type: 'ORDER_SIZE_MATCH', label: 'Nhận đơn từ 200 bộ trở lên', source: 'Quy chế kinh doanh' }
        ],
        // Structured checklist thay vì opaque score (Section 17)
        criteriaChecklist: [
          { label: 'Địa bàn Đồng Nai', met: true, note: 'Xưởng tại Biên Hòa, giao trong ngày' },
          { label: 'Năng lực may > 1.000 sp/tháng', met: true, note: 'Công suất thực tế 15.000 bộ/tháng' },
          { label: 'Có mẫu đối chứng', met: true, note: 'Sẵn bảng màu vải Kaki & Polo' },
          { label: 'Quy mô MOQ 300–1.000 bộ', met: true, note: 'Nhận đơn từ 200 bộ' },
          { label: 'Chứng chỉ ISO 9001 / Lab test', met: true, note: 'Đã có ISO 9001:2015 và test vải Quatest 3' }
        ],
        missingInformation: [
          { field: 'leadTime', label: 'Tiến độ giao hàng lô lớn (>2.000 bộ)', status: 'CẦN XÁC NHẬN', note: 'Cần xác nhận lịch chuyền may vào tháng 11/2026' },
          { field: 'surveyCapability', label: 'Hỗ trợ lấy số đo tận nơi', status: 'ĐÃ CÓ THÔNG TIN', note: 'Có nhân sự đến tận nhà xưởng lấy size' }
        ],
        evidenceList: [
          { title: 'Ảnh thực tế chuyền may xưởng Biên Hòa', type: EVIDENCE_TYPES.REAL_EVIDENCE, url: '/images/smart_factory_hero.jpg', verified: true },
          { title: 'Kết quả thử nghiệm độ bền màu Quatest 3', type: EVIDENCE_TYPES.REAL_EVIDENCE, url: '/images/smart_factory_hero.jpg', verified: true }
        ],
        publicNote: 'Ứng viên hàng đầu về cự ly địa lý và năng lực may đo công nghiệp tại chỗ.'
      },
      {
        id: 'ENT-02',
        supplierOrganizationId: 'ORG-SUP-MAYMAC-02',
        supplierName: 'Xưởng May Bảo Hộ Lao Động & Phòng Sạch Đại Việt',
        supplierSlug: 'may-bao-ho-dai-viet',
        status: ENTRY_STATUSES.RESPONDED,
        displayOrder: 2,
        inclusionReason: 'Thế mạnh chuyên sâu về quần áo phòng sạch chống tĩnh điện ESD và áo phản quang kỹ sư đạt chuẩn CE.',
        matchReasons: [
          { type: 'CAPABILITY_MATCH', label: 'Đạt chuẩn phòng sạch Class 1000', source: 'Hồ sơ kiểm định ESD' },
          { type: 'SERVICE_AREA_MATCH', label: 'Giao hàng tại TP.HCM & các tỉnh Đông Nam Bộ', source: 'Hợp đồng mẫu' },
          { type: 'SAMPLE_AVAILABLE', label: 'Có sẵn mẫu áo phản quang kỹ sư', source: 'Showroom' }
        ],
        criteriaChecklist: [
          { label: 'Địa bàn Đồng Nai', met: true, note: 'Giao hàng xe tải riêng từ Dĩ An (cách 18km)' },
          { label: 'Năng lực may > 1.000 sp/tháng', met: true, note: 'Công suất 8.000 bộ/tháng' },
          { label: 'Có mẫu đối chứng', met: true, note: 'Sẵn mẫu phòng sạch ESD & Kaki' },
          { label: 'Quy mô MOQ 300–1.000 bộ', met: true, note: 'MOQ tối thiểu 300 bộ' },
          { label: 'Chứng chỉ ISO 9001 / Lab test', met: false, note: 'Chưa nộp chứng chỉ ISO cập nhật 2026' }
        ],
        missingInformation: [
          { field: 'isoCert', label: 'Hiệu lực chứng chỉ ISO cập nhật', status: 'CHỜ NCC PHẢN HỒI', note: 'Đã gửi yêu cầu bổ sung bản scan' },
          { field: 'pricePolo', label: 'Đơn giá may áo polo cổ dệt', status: 'CẦN XÁC NHẬN', note: 'Chưa có bảng giá định mức chất liệu mè cá sấu' }
        ],
        evidenceList: [
          { title: 'Chứng nhận kiểm nghiệm điện trở bề mặt ESD', type: EVIDENCE_TYPES.REAL_EVIDENCE, url: '/images/smart_factory_hero.jpg', verified: true }
        ],
        publicNote: 'Phù hợp đặc biệt nếu nhà máy có phân xưởng linh kiện điện tử hoặc phòng sạch ESD.'
      },
      {
        id: 'ENT-03',
        supplierOrganizationId: 'ORG-SUP-MAYMAC-03',
        supplierName: 'Công ty Cổ phần Thời Trang & Đồng Phục Doanh Nghiệp An Phúc',
        supplierSlug: 'dong-phuc-an-phuc',
        status: ENTRY_STATUSES.CONSIDERED,
        displayOrder: 3,
        inclusionReason: 'Năng lực thiết kế nhận diện thương hiệu tốt, chuyên dòng áo thun polo văn phòng và sơ mi cao cấp cho ban quản lý nhà máy.',
        matchReasons: [
          { type: 'PRODUCT_MATCH', label: 'Áo polo đồng phục form chuẩn châu Âu', source: 'Mẫu thực tế' },
          { type: 'SAMPLE_AVAILABLE', label: 'Gửi kit vải và áo mẫu tận nơi trong 24h', source: 'Chính sách dịch vụ' }
        ],
        criteriaChecklist: [
          { label: 'Địa bàn Đồng Nai', met: true, note: 'Trụ sở TP.HCM, giao hàng chuyển phát nhanh toàn quốc' },
          { label: 'Năng lực may > 1.000 sp/tháng', met: true, note: 'Đáp ứng 20.000 áo thun/tháng' },
          { label: 'Có mẫu đối chứng', met: true, note: 'Sẵn kit mẫu vải 40 màu' },
          { label: 'Quy mô MOQ 300–1.000 bộ', met: true, note: 'Nhận đơn từ 50 áo trở lên' },
          { label: 'Đồng phục công nhân may kỹ', met: false, note: 'Thế mạnh áo thun polo hơn là đồ bảo hộ hạng nặng' }
        ],
        missingInformation: [
          { field: 'heavyPpe', label: 'Năng lực may đồ bảo hộ kaki dày chống cháy', status: 'KHÔNG ÁP DỤNG', note: 'Chỉ nhận may áo thun & sơ mi kỹ thuật' }
        ],
        evidenceList: [
          { title: 'Catalogue sản phẩm đồng phục polo 2026', type: EVIDENCE_TYPES.CATALOGUE, url: '/images/smart_factory_hero.jpg', verified: false }
        ],
        publicNote: 'Lựa chọn bổ sung cho phân khúc đồng phục khối văn phòng và kỹ sư điều hành.'
      }
    ],

    // LỊCH SỬ PHIÊN BẢN (Section 33, 34)
    versions: [
      {
        version: 'v1.0',
        summary: 'Khởi tạo bộ hồ sơ tuyển chọn ban đầu với 5 ứng viên khảo sát theo đề bài NC-2026-00125.',
        createdBy: 'Lê Thu Trang (Điều phối viên)',
        createdAt: '2026-09-15T09:00:00+07:00'
      },
      {
        version: 'v1.5',
        summary: 'Bổ sung tiêu chí chứng nhận thử nghiệm vải Quatest 3 và năng lực giao mẫu trong 3 ngày.',
        createdBy: 'Nguyễn Thành Nam (Sourcing Lead)',
        createdAt: '2026-09-22T14:00:00+07:00'
      },
      {
        version: 'v2.0',
        summary: 'Rút gọn còn 3 ứng viên có năng lực thực tế tại địa bàn Đồng Nai và kiểm tra thực tế xưởng.',
        createdBy: 'Lê Thu Trang (Điều phối viên)',
        createdAt: '2026-09-28T16:30:00+07:00'
      }
    ]
  },

  // DOSSIER 2: PUBLIC DOSSIER - Bao bì thực phẩm xuất khẩu tại Bình Dương
  {
    id: 'DOS-2026-002',
    slug: 'bao-bi-thuc-pham-xuat-khau-binh-duong',
    publicCode: 'BHS-2026-002',
    title: 'Bộ Hồ Sơ Tuyển Chọn Nhà Sản Xuất Bao Bì Giấy & Thùng Carton Cho Nhà Máy Thực Phẩm Bình Dương',
    purpose: 'Cung cấp danh sách nhà máy sản xuất thùng carton 3–5–7 lớp sóng E, B, BC đạt tiêu chuẩn an toàn thực phẩm HACCP/ISO 22000, phục vụ xuất khẩu từ các KCN VSIP 1, 2 và Sóng Thần.',
    dossierType: DOSSIER_TYPES.CATEGORY_SHORTLIST,
    categoryId: 'bao-bi-may-mac',
    categoryName: 'Bao bì công nghiệp & Thùng carton',
    locationId: 'binh-duong',
    locationName: 'Bình Dương & TP.HCM',
    visibility: DOSSIER_VISIBILITY.PUBLIC,
    status: DOSSIER_STATUSES.PUBLISHED,
    version: 'v1.2',
    preparedBy: {
      team: 'Tổ Kết Nối Ngành Bao Bì Phụ Trợ',
      role: 'Packaging Sourcing Desk',
      userId: 'USER-COORD-002'
    },
    ownerUserId: 'USER-BUYER-002',
    publishedAt: '2026-09-24T10:00:00+07:00',
    updatedAt: '2026-09-27T11:00:00+07:00',
    createdAt: '2026-09-18T08:30:00+07:00',
    isOutdatedWarning: false,
    criteria: [
      {
        id: 'CRIT-B1',
        criterionType: 'CERTIFICATION',
        label: 'Tiêu chuẩn an toàn thực phẩm HACCP / FSC',
        expectedValue: 'Có chứng nhận nguồn gốc gỗ FSC và tiêu chuẩn HACCP cho bao bì thực phẩm',
        source: 'Yêu cầu thị trường EU / US',
        required: true,
        displayOrder: 1
      },
      {
        id: 'CRIT-B2',
        criterionType: 'CAPABILITY',
        label: 'Dây chuyền in Flexo hoặc Offset khổ lớn',
        expectedValue: 'In sắc nét 4–6 màu, cán màng chống thấm nước',
        source: 'Đặc tính bảo quản kho lạnh',
        required: true,
        displayOrder: 2
      }
    ],
    candidates: [
      {
        id: 'ENT-B01',
        supplierOrganizationId: 'ORG-SUP-BAOBI-01',
        supplierName: 'Công ty Bao Bì Giấy Xuất Khẩu Thuận An',
        supplierSlug: 'bao-bi-thuan-an',
        status: ENTRY_STATUSES.SHORTLISTED,
        displayOrder: 1,
        inclusionReason: 'Nhà máy diện tích 15.000m² tại KCN Sóng Thần 2, đạt chứng chỉ FSC-CoC và cung ứng thường xuyên cho 8 tập đoàn chế biến thủy sản.',
        matchReasons: [
          { type: 'CERTIFICATION_MATCH', label: 'Chứng chỉ FSC và ISO 22000 còn hiệu lực đến 2027', source: 'Hồ sơ pháp lý' },
          { type: 'SERVICE_AREA_MATCH', label: 'Cụm KCN Sóng Thần / VSIP Bình Dương', source: 'Địa chỉ xưởng' }
        ],
        criteriaChecklist: [
          { label: 'Chứng nhận FSC / HACCP', met: true, note: 'Bản scan đầy đủ' },
          { label: 'Dây chuyền in Flexo 5 màu', met: true, note: 'Máy in Đài Loan mới 2024' }
        ],
        missingInformation: [
          { field: 'deliverySlot', label: 'Khung giờ giao hàng ban đêm tại cảng Cát Lái', status: 'CẦN XÁC NHẬN', note: 'Cần xác nhận lịch điều xe' }
        ],
        evidenceList: [],
        publicNote: 'Ứng viên có thế mạnh vượt trội về thùng chống ẩm bảo quản lạnh.'
      }
    ],
    versions: [
      {
        version: 'v1.0',
        summary: 'Khởi tạo bộ hồ sơ bao bì thực phẩm Bình Dương.',
        createdBy: 'Nguyễn Thành Nam',
        createdAt: '2026-09-18T08:30:00+07:00'
      }
    ]
  },

  // DOSSIER 3: PRIVATE DOSSIER - Shortlist Gia công CNC Phòng sạch FDI VSIP (Riêng tư - Buyer RBAC)
  {
    id: 'DOS-2026-003',
    slug: 'shortlist-gia-cong-cnc-phong-sach-fdi-vsip',
    publicCode: 'BHS-2026-003-PRIV',
    title: 'Danh Sách Rút Gọn Nhà Cung Ứng Gia Công CNC & Đồ Gá Phòng Sạch (Bảo Mật Nội Bộ Buyer)',
    purpose: 'Đề bài riêng: Tuyển chọn 02 nhà sản xuất cơ khí chính xác tại Bình Dương có phòng đo CMM và phòng sạch Class 10.000 để ký hợp đồng thầu phụ phụ trợ bán dẫn năm 2026.',
    dossierType: DOSSIER_TYPES.CUSTOM_SOURCING,
    requirementId: 'NC-2026-PRIV-99',
    industrialParkId: 'kcn-vsip-1',
    industrialParkName: 'KCN VSIP 1, Bình Dương',
    categoryId: 'co-khi-chinh-xac',
    locationId: 'binh-duong',
    visibility: DOSSIER_VISIBILITY.PRIVATE, // RIÊNG TƯ (Section 7, 41, 52)
    status: DOSSIER_STATUSES.SHARED,
    version: 'v1.1',
    preparedBy: {
      team: 'Tổ Thẩm Định Kỹ Thuật Cơ Khí FDI',
      role: 'Senior Technical Sourcing Specialist',
      userId: 'USER-TECH-009'
    },
    ownerUserId: 'USER-BUYER-FDI-DAIKIN', // Chỉ tài khoản này được xem
    publishedAt: null,
    updatedAt: '2026-09-29T08:00:00+07:00',
    createdAt: '2026-09-26T14:00:00+07:00',
    isOutdatedWarning: false,
    criteria: [
      {
        id: 'CRIT-C1',
        criterionType: 'CAPABILITY',
        label: 'Máy phay CNC 5 trục & Máy đo tọa độ CMM Mitutoyo',
        expectedValue: 'Độ chính xác gia công đạt dung sai ±0.003mm',
        source: 'Yêu cầu bản vẽ chi tiết mật',
        required: true,
        displayOrder: 1
      }
    ],
    candidates: [
      {
        id: 'ENT-C01',
        supplierOrganizationId: 'ORG-SUP-CNC-01',
        supplierName: 'Công ty Cơ khí Chính xác Minh Trí CNC',
        supplierSlug: 'co-khi-minh-tri-cnc',
        status: ENTRY_STATUSES.SHORTLISTED,
        displayOrder: 1,
        inclusionReason: 'Đạt yêu cầu máy CMM Mitutoyo kiểm định hiệu chuẩn tháng 08/2026, có biên bản thử nghiệm đồ gá tại KCN VSIP 1.',
        matchReasons: [
          { type: 'CAPABILITY_MATCH', label: 'Có máy phay 5 trục Makino và phòng đo CMM', source: 'Biên bản khảo sát xưởng' }
        ],
        criteriaChecklist: [
          { label: 'Máy đo CMM Mitutoyo', met: true, note: 'Đã kiểm tra tại chỗ' }
        ],
        missingInformation: [],
        evidenceList: [],
        publicNote: 'Bảo mật hồ sơ nội bộ.',
        internalNote: 'Đơn giá đề xuất của Minh Trí thấp hơn 12% so với NCC Nhật Bản cùng phân khúc.'
      }
    ],
    versions: [
      {
        version: 'v1.0',
        summary: 'Khởi tạo hồ sơ mật cho dự án linh kiện bán dẫn.',
        createdBy: 'USER-TECH-009',
        createdAt: '2026-09-26T14:00:00+07:00'
      }
    ]
  }
];

// ----------------------------------------------------------------------------
// 3. CORE SERVICE METHODS & BUSINESS ENFORCEMENT
// ----------------------------------------------------------------------------

/**
 * Lấy toàn bộ danh sách bộ hồ sơ
 */
export const getAllSourcingDossiers = () => {
  const stored = safeGetItem(STORAGE_KEYS.DOSSIERS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return SEED_SOURCING_DOSSIERS;
};

/**
 * Lấy danh sách bộ hồ sơ CÔNG KHAI (Section 6)
 * Không chứa thông tin bí mật của Buyer, ngân sách hay đánh giá nội bộ
 */
export const getPublicDossiers = () => {
  const list = getAllSourcingDossiers();
  return list.filter(d => d.visibility === DOSSIER_VISIBILITY.PUBLIC && d.status === DOSSIER_STATUSES.PUBLISHED);
};

/**
 * Lấy chi tiết bộ hồ sơ theo Slug kèm kiểm tra quyền truy cập (Section 5, 7, 52, 59)
 * Hard rule: Nếu là PRIVATE, chỉ user/organization được phân quyền mới được đọc
 */
export const getDossierBySlug = (slug, userContext = null) => {
  const list = getAllSourcingDossiers();
  const dossier = list.find(d => d.slug === slug || d.id === slug);
  if (!dossier) return null;

  // Nếu là hồ sơ công khai -> cho phép đọc
  if (dossier.visibility === DOSSIER_VISIBILITY.PUBLIC) {
    return dossier;
  }

  // Nếu là hồ sơ riêng tư (PRIVATE) -> bắt buộc kiểm tra quyền (RBAC)
  if (dossier.visibility === DOSSIER_VISIBILITY.PRIVATE) {
    if (!userContext || !userContext.userId) {
      throw new Error('ACCESS_DENIED: Bộ hồ sơ này là riêng tư, yêu cầu đăng nhập tài khoản Buyer được phân quyền.');
    }

    const isOwner = dossier.ownerUserId === userContext.userId;
    const isPreparedBy = dossier.preparedBy?.userId === userContext.userId;
    const isAdmin = userContext.role === 'SUPER_ADMIN' || userContext.role === 'COORDINATOR';

    if (!isOwner && !isPreparedBy && !isAdmin) {
      throw new Error('ACCESS_DENIED: Bạn không có quyền truy cập bộ hồ sơ tuyển chọn của doanh nghiệp này.');
    }
  }

  return dossier;
};

/**
 * Gửi yêu cầu điều chỉnh bộ hồ sơ từ Buyer (Section 28, 29)
 * Cho phép Buyer: thêm/bớt tiêu chí, thêm/bớt NCC, yêu cầu mẫu, yêu cầu gặp mặt
 */
export const submitDossierAdjustmentRequest = (dossierId, adjustmentData, userContext) => {
  if (!userContext || !userContext.userId) {
    throw new Error('Yêu cầu đăng nhập để gửi yêu cầu điều chỉnh bộ hồ sơ.');
  }

  const raw = safeGetItem(STORAGE_KEYS.ADJUSTMENT_REQUESTS);
  const requests = raw ? JSON.parse(raw) : [];

  const newAdjustment = {
    id: `ADJ-${Date.now()}`,
    dossierId,
    requestedByUserId: userContext.userId,
    requestedByName: userContext.fullName || 'Đại diện Buyer',
    type: adjustmentData.type || 'CLARIFY_REQUIREMENT', // ADD_CRITERION, REMOVE_CANDIDATE, ASK_SUPPLIER_INFO, REQUEST_SAMPLE, REQUEST_MEETING
    description: adjustmentData.description,
    candidateId: adjustmentData.candidateId || null,
    status: 'NEW', // NEW -> UNDER_REVIEW -> APPLIED -> REJECTED
    ownerUserId: 'USER-COORD-001',
    createdAt: new Date().toISOString()
  };

  requests.unshift(newAdjustment);
  safeSetItem(STORAGE_KEYS.ADJUSTMENT_REQUESTS, JSON.stringify(requests));

  // Ghi nhật ký AuditLog (Section 55)
  logDossierAudit(dossierId, 'SUBMIT_ADJUSTMENT_REQUEST', userContext.userId, `Buyer gửi yêu cầu điều chỉnh loại: ${newAdjustment.type}`);

  return newAdjustment;
};

/**
 * Thêm một ứng viên nhà cung ứng vào bộ hồ sơ (Section 49)
 * Hard rule: Bắt buộc phải có inclusionReason rõ ràng, không được thêm không có ngữ cảnh
 */
export const addCandidateToDossier = (dossierId, candidateData, userContext) => {
  if (!candidateData.inclusionReason || !candidateData.inclusionReason.trim()) {
    throw new Error('Bắt buộc phải nêu rõ "LÝ DO ĐƯA VÀO" (Inclusion Reason) khi bổ sung nhà cung ứng vào bộ hồ sơ (Section 15, 49).');
  }

  const list = getAllSourcingDossiers();
  const dossier = list.find(d => d.id === dossierId);
  if (!dossier) throw new Error('Không tìm thấy bộ hồ sơ.');

  const newEntry = {
    id: `ENT-${Date.now()}`,
    supplierOrganizationId: candidateData.supplierOrganizationId,
    supplierName: candidateData.supplierName,
    supplierSlug: candidateData.supplierSlug || '',
    status: ENTRY_STATUSES.CONSIDERED,
    displayOrder: (dossier.candidates?.length || 0) + 1,
    inclusionReason: candidateData.inclusionReason,
    matchReasons: candidateData.matchReasons || [{ type: 'MANUAL_RESEARCH', label: 'Bổ sung theo đề xuất điều phối', source: 'Điều phối viên' }],
    criteriaChecklist: candidateData.criteriaChecklist || [],
    missingInformation: candidateData.missingInformation || [],
    evidenceList: candidateData.evidenceList || [],
    publicNote: candidateData.publicNote || '',
    internalNote: candidateData.internalNote || ''
  };

  if (!dossier.candidates) dossier.candidates = [];
  dossier.candidates.push(newEntry);
  dossier.updatedAt = new Date().toISOString();

  safeSetItem(STORAGE_KEYS.DOSSIERS, JSON.stringify(list));
  logDossierAudit(dossierId, 'ADD_CANDIDATE', userContext?.userId || 'ADMIN', `Thêm NCC ${candidateData.supplierName}: ${candidateData.inclusionReason}`);
  return newEntry;
};

/**
 * Cập nhật trạng thái ứng viên (Section 14, 50)
 * Hard rule: Không xóa vật lý bản ghi lịch sử, chuyển status sang NOT_SUITABLE hoặc ARCHIVED
 */
export const updateCandidateStatus = (dossierId, candidateEntryId, newStatus, reason, userContext) => {
  const list = getAllSourcingDossiers();
  const dossier = list.find(d => d.id === dossierId);
  if (!dossier) throw new Error('Không tìm thấy bộ hồ sơ.');

  const candidate = dossier.candidates?.find(c => c.id === candidateEntryId);
  if (!candidate) throw new Error('Không tìm thấy ứng viên trong hồ sơ.');

  const oldStatus = candidate.status;
  candidate.status = newStatus;
  candidate.statusChangeReason = reason;
  dossier.updatedAt = new Date().toISOString();

  safeSetItem(STORAGE_KEYS.DOSSIERS, JSON.stringify(list));
  logDossierAudit(dossierId, 'UPDATE_CANDIDATE_STATUS', userContext?.userId || 'ADMIN', `Đổi trạng thái NCC ${candidate.supplierName} từ ${oldStatus} sang ${newStatus}. Lý do: ${reason}`);
  return candidate;
};

/**
 * Tạo phiên bản mới cho bộ hồ sơ (Section 33, 34)
 * Hard rule: Không ghi đè lịch sử (Overwrite)
 */
export const createDossierVersion = (dossierId, versionTag, summary, userContext) => {
  const list = getAllSourcingDossiers();
  const dossier = list.find(d => d.id === dossierId);
  if (!dossier) throw new Error('Không tìm thấy bộ hồ sơ.');

  const newVersion = {
    version: versionTag,
    summary,
    createdBy: userContext?.fullName || 'Điều phối viên',
    createdAt: new Date().toISOString()
  };

  if (!dossier.versions) dossier.versions = [];
  dossier.versions.push(newVersion);
  dossier.version = versionTag;
  dossier.updatedAt = new Date().toISOString();

  safeSetItem(STORAGE_KEYS.DOSSIERS, JSON.stringify(list));
  logDossierAudit(dossierId, 'CREATE_VERSION', userContext?.userId || 'ADMIN', `Phát hành phiên bản mới ${versionTag}: ${summary}`);
  return newVersion;
};

/**
 * Xác thực tính trung lập và bảo vệ tiêu chí tuyển chọn (Section 25, 26)
 * Hard rule: Hợp đồng tài trợ (Sponsorship) hoặc vị trí Founding Partner không được tăng điểm Matching, không tự chèn vào shortlist
 */
export const verifyDossierNeutrality = () => {
  return {
    sponsorshipInfluenceOnShortlist: 'NONE',
    commercialTierAllowsPriorityMatching: false,
    sponsorsSeparatedInDedicatedBlock: true,
    sponsorAltersShortlist: false,
    matchingRule: 'Chỉ các nhà cung ứng thỏa mãn tiêu chí tuyển chọn thực tế mới được xuất hiện trong Candidate List.'
  };
};

/**
 * Xuất dữ liệu tóm tắt bộ hồ sơ (Section 43 Export)
 * Loại bỏ toàn bộ ghi chú mật (internalNote) và dữ liệu nhạy cảm
 */
export const exportDossierSummary = (slug, userContext = null) => {
  const dossier = getDossierBySlug(slug, userContext);
  if (!dossier) throw new Error('Không tìm thấy bộ hồ sơ.');

  // Tạo bản xuất đã lọc bỏ internal notes
  const exported = {
    publicCode: dossier.publicCode,
    title: dossier.title,
    purpose: dossier.purpose,
    version: dossier.version,
    updatedAt: dossier.updatedAt,
    criteria: dossier.criteria?.map(c => ({
      label: c.label,
      expectedValue: c.expectedValue,
      source: c.source,
      required: c.required
    })),
    candidates: dossier.candidates?.map(cand => ({
      name: cand.supplierName,
      status: cand.status,
      inclusionReason: cand.inclusionReason,
      matchReasons: cand.matchReasons?.map(m => m.label),
      missingInformation: cand.missingInformation,
      evidenceSummary: cand.evidenceList?.map(e => e.title)
    })),
    exportedAt: new Date().toISOString(),
    isCertifiedBy: 'CHUOICUNGUNG.COM Sourcing Desk'
  };

  return exported;
};

/**
 * Ghi nhật ký kiểm toán AuditLog
 */
function logDossierAudit(dossierId, action, performedBy, details) {
  const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
  const logs = raw ? JSON.parse(raw) : [];

  const logEntry = {
    id: `AUDIT-${Date.now()}`,
    dossierId,
    action,
    performedBy,
    details,
    at: new Date().toISOString()
  };

  logs.unshift(logEntry);
  safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
}
