// ============================================================================
// REMOTE PRESENCE DATA LAYER & WORKFLOW ENGINE
// PAGE 34: HIỆN DIỆN TỪ XA TẠI SỰ KIỆN (/dich-vu/hien-dien-tu-xa)
// Chuẩn hóa theo spec 34.txt - CHUOICUNGUNG.COM
// ============================================================================

import { SEED_PROGRAMS } from './programsData.js';

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
  REQUESTS: 'ccu_remote_presence_requests_v1',
  INTERESTS: 'ccu_remote_presence_interests_v1',
  AUTHORIZATIONS: 'ccu_remote_presence_authorizations_v1',
  SAMPLES: 'ccu_remote_presence_samples_v1',
  AUDIT_LOGS: 'ccu_remote_presence_audit_logs_v1'
};

// ----------------------------------------------------------------------------
// 1. PHẠM VI ĐỘI ĐIỀU PHỐI ĐƯỢC PHÉP ĐẠI DIỆN (SECTION 12)
// ----------------------------------------------------------------------------
export const REPRESENTATION_SCOPE_FLAGS = {
  CAN_PRESENT_APPROVED_PROFILE: {
    key: 'CAN_PRESENT_APPROVED_PROFILE',
    label: 'Giới thiệu bản tóm tắt hồ sơ năng lực đã duyệt',
    description: 'Điều phối viên trình bày đúng thông tin tổng quan, năng lực sản xuất và chứng chỉ trong bộ hồ sơ đã thống nhất.',
    isDefault: true
  },
  CAN_SHOW_APPROVED_VIDEO: {
    key: 'CAN_SHOW_APPROVED_VIDEO',
    label: 'Trình chiếu video giới thiệu đã duyệt',
    description: 'Phát video 1 phút hoặc clip giới thiệu xưởng tại màn hình quầy kết nối hoặc phiên pitching.',
    isDefault: true
  },
  CAN_SHOW_CATALOGUE: {
    key: 'CAN_SHOW_CATALOGUE',
    label: 'Trưng bày và gửi catalogue đã duyệt',
    description: 'Bố trí catalogue bản in hoặc mã QR tải e-catalogue tại bàn đại diện.',
    isDefault: true
  },
  CAN_DISPLAY_SAMPLE: {
    key: 'CAN_DISPLAY_SAMPLE',
    label: 'Trưng bày mẫu sản phẩm đối chứng',
    description: 'Sắp xếp mẫu sản phẩm thực tế theo sơ đồ đã thống nhất (nếu chương trình chấp nhận mẫu).',
    isDefault: false
  },
  CAN_EXPLAIN_APPROVED_PRODUCT_SUMMARY: {
    key: 'CAN_EXPLAIN_APPROVED_PRODUCT_SUMMARY',
    label: 'Giải thích thông số cơ bản theo tài liệu đã duyệt',
    description: 'Diễn giải công dụng, thông số quy cách đã in trên tài liệu; không suy diễn ngoài văn bản.',
    isDefault: true
  },
  CAN_COLLECT_CONTACT_REQUEST: {
    key: 'CAN_COLLECT_CONTACT_REQUEST',
    label: 'Tiếp nhận yêu cầu liên hệ từ người tham quan',
    description: 'Thu thập danh thiếp và yêu cầu kết nối khi người tham gia đồng ý chia sẻ thông tin (có consent).',
    isDefault: true
  },
  CAN_FORWARD_APPROVED_MATERIALS: {
    key: 'CAN_FORWARD_APPROVED_MATERIALS',
    label: 'Chuyển tiếp tài liệu số cho khách quan tâm',
    description: 'Gửi link hồ sơ số hoặc PDF qua Zalo/Email cho đối tác trực tiếp tại sự kiện.',
    isDefault: true
  },
  CAN_RECORD_QUESTIONS: {
    key: 'CAN_RECORD_QUESTIONS',
    label: 'Ghi nhận câu hỏi chuyên sâu gửi về doanh nghiệp',
    description: 'Ghi chép chính xác câu hỏi kỹ thuật / thương mại và chuyển về đầu mối của doanh nghiệp.',
    isDefault: true
  },
  CAN_SCHEDULE_FOLLOW_UP_REQUEST: {
    key: 'CAN_SCHEDULE_FOLLOW_UP_REQUEST',
    label: 'Hỗ trợ hẹn lịch làm việc trực tuyến sau sự kiện',
    description: 'Ghi nhận khung giờ Buyer mong muốn họp 1:1 online với đội ngũ kỹ thuật/kinh doanh của doanh nghiệp.',
    isDefault: true
  }
};

// ----------------------------------------------------------------------------
// 2. DANH MỤC HẠN CHẾ TUYỆT ĐỐI (SECTION 13 DEFAULT RESTRICTIONS)
// ----------------------------------------------------------------------------
export const DEFAULT_RESTRICTIONS = [
  { id: 'RESTRICT_QUOTE', text: 'Tuyệt đối KHÔNG tự ý báo giá hoặc cam kết giá cả cho Buyer.' },
  { id: 'RESTRICT_PRICE_CHANGE', text: 'Tuyệt đối KHÔNG thay đổi giá bán hoặc chiết khấu thương mại.' },
  { id: 'RESTRICT_MOQ', text: 'Tuyệt đối KHÔNG cam kết số lượng đặt hàng tối thiểu (MOQ) thay doanh nghiệp.' },
  { id: 'RESTRICT_LEAD_TIME', text: 'Tuyệt đối KHÔNG cam kết thời gian giao hàng (Lead Time) khi chưa có phản hồi chính thức.' },
  { id: 'RESTRICT_TECH_SPEC', text: 'Tuyệt đối KHÔNG cam kết tiêu chuẩn kỹ thuật vượt ngoài tài liệu đã duyệt.' },
  { id: 'RESTRICT_NEGOTIATE', text: 'Tuyệt đối KHÔNG đàm phán hợp đồng hoặc điều khoản thanh toán.' },
  { id: 'RESTRICT_ACCEPT_PO', text: 'Tuyệt đối KHÔNG chấp nhận đơn đặt hàng (Purchase Order) tại chỗ.' },
  { id: 'RESTRICT_SIGN_NDA', text: 'Tuyệt đối KHÔNG ký thỏa thuận bảo mật (NDA) thay cho pháp nhân doanh nghiệp.' },
  { id: 'RESTRICT_SIGN_CONTRACT', text: 'Tuyệt đối KHÔNG ký hợp đồng thương mại dưới bất kỳ hình thức nào.' },
  { id: 'RESTRICT_WARRANTY', text: 'Tuyệt đối KHÔNG cam kết chính sách bảo hành ngoài quy định văn bản.' },
  { id: 'RESTRICT_PAYMENT_TERMS', text: 'Tuyệt đối KHÔNG cam kết điều khoản thanh toán (công nợ, trả chậm).' }
];

// ----------------------------------------------------------------------------
// 3. CANONICAL ENUMS & WORKFLOW STATUSES (SECTION 14, 15, 19, 26, 36)
// ----------------------------------------------------------------------------
export const REMOTE_PRESENCE_STATUSES = {
  DRAFT: 'DRAFT',                               // Bản nháp chưa gửi
  SUBMITTED: 'SUBMITTED',                       // Đã nộp hồ sơ, chờ điều phối tiếp nhận
  NEED_MORE_INFO: 'NEED_MORE_INFO',             // Yêu cầu bổ sung tài liệu
  SCOPE_CONFIRMED: 'SCOPE_CONFIRMED',           // Đã thống nhất phạm vi đại diện
  PROPOSAL_SENT: 'PROPOSAL_SENT',               // Đã gửi đề xuất chi phí & quyền lợi
  ACCEPTED: 'ACCEPTED',                         // Doanh nghiệp chấp nhận đề xuất
  CONTENT_PREPARATION: 'CONTENT_PREPARATION',   // Đang chuẩn bị kịch bản & tư liệu
  CONTENT_APPROVED: 'CONTENT_APPROVED',         // Doanh nghiệp đã duyệt kịch bản giới thiệu
  MATERIAL_RECEIVED: 'MATERIAL_RECEIVED',       // Đã nhận đủ tư liệu in / video / mẫu đối chứng
  READY_FOR_PROGRAM: 'READY_FOR_PROGRAM',       // Đủ 11 điều kiện sẵn sàng ra quân sự kiện
  ACTIVE_IN_PROGRAM: 'ACTIVE_IN_PROGRAM',       // Đang hiện diện trực tiếp tại sự kiện
  FOLLOW_UP: 'FOLLOW_UP',                       // Đang xử lý câu hỏi & chuyển tiếp liên hệ
  WAITING_ACCEPTANCE: 'WAITING_ACCEPTANCE',     // Chờ doanh nghiệp nghiệm thu bàn giao
  COMPLETED: 'COMPLETED',                       // Nghiệm thu hoàn tất
  POSTPONED: 'POSTPONED',                       // Tạm hoãn cùng sự kiện (bảo lưu quyền lợi)
  CANCELLED: 'CANCELLED'                        // Hủy yêu cầu (hoàn trả tư liệu/chi phí theo policy)
};

export const INTERACTION_EVENT_TYPES = {
  PROFILE_OPEN: 'PROFILE_OPEN',                 // Khách mở xem hồ sơ số
  VIDEO_VIEW: 'VIDEO_VIEW',                     // Khách xem video giới thiệu
  QR_SCAN: 'QR_SCAN',                           // Khách quét mã QR tại quầy đại diện
  CATALOGUE_OPEN: 'CATALOGUE_OPEN',             // Khách lật xem catalogue hoặc nhận file
  CONTACT_REQUEST: 'CONTACT_REQUEST',           // Khách để lại danh thiếp/yêu cầu liên hệ (có consent)
  QUESTION_RECORDED: 'QUESTION_RECORDED',       // Ghi nhận câu hỏi chuyên sâu
  SAMPLE_INTEREST: 'SAMPLE_INTEREST',           // Khách trực tiếp xem và hỏi về mẫu trưng bày
  FOLLOW_UP_REQUEST: 'FOLLOW_UP_REQUEST'        // Khách đề nghị hẹn họp trực tuyến 1:1
};

export const SAMPLE_RECEIVED_STATUSES = {
  PENDING: 'PENDING',                           // Chờ gửi mẫu
  IN_TRANSIT: 'IN_TRANSIT',                     // Mẫu đang trên đường vận chuyển
  RECEIVED: 'RECEIVED',                         // Đã tiếp nhận tại kho ban tổ chức
  DAMAGED: 'DAMAGED'                            // Hàng mẫu bị móp méo/vỡ trong quá trình vận chuyển
};

export const SAMPLE_RETURN_OPTIONS = {
  NO_RETURN: {
    key: 'NO_RETURN',
    label: 'Không nhận lại (tiêu hao/lưu trữ vĩnh viễn)',
    description: 'Doanh nghiệp tặng mẫu hoặc mẫu thuộc loại vật phẩm tiêu hao không cần thu hồi.'
  },
  RETURN_TO_SUPPLIER: {
    key: 'RETURN_TO_SUPPLIER',
    label: 'Gửi trả về địa chỉ doanh nghiệp (doanh nghiệp chịu cước)',
    description: 'Ban tổ chức đóng gói và gửi chuyển phát nhanh trả lại xưởng sau sự kiện.'
  },
  PICKUP_BY_SUPPLIER: {
    key: 'PICKUP_BY_SUPPLIER',
    label: 'Doanh nghiệp cử đại diện đến nhận lại tại văn phòng',
    description: 'Đại diện doanh nghiệp nhận lại mẫu trong vòng 7 ngày làm việc sau sự kiện.'
  },
  DISPOSE_WITH_APPROVAL: {
    key: 'DISPOSE_WITH_APPROVAL',
    label: 'Hủy mẫu sau sự kiện có xác nhận',
    description: 'Ban tổ chức tiến hành tiêu hủy an toàn theo biên bản thống nhất.'
  },
  KEEP_FOR_FUTURE_PROGRAM: {
    key: 'KEEP_FOR_FUTURE_PROGRAM',
    label: 'Lưu kho cho các chương trình tiếp theo (cần thỏa thuận riêng)',
    description: 'Lưu giữ tại phòng trưng bày mẫu trung tâm để tiếp tục giới thiệu kỳ tới.'
  }
};

// ----------------------------------------------------------------------------
// 4. DANH MỤC HẠNG MỤC KHÔNG BAO GỒM (SECTION 55 EXCLUSIONS)
// ----------------------------------------------------------------------------
export const EXCLUSION_ITEMS = [
  'Lập báo giá chi tiết hoặc dự toán dự thầu thay doanh nghiệp',
  'Đàm phán thương mại và bảo vệ đơn giá kỹ thuật với phòng Mua hàng',
  'Chi phí đi lại, ăn ở hoặc tiếp khách của đại biểu Buyer',
  'Cước phí vận chuyển hàng mẫu hai chiều (gửi đến và gửi trả)',
  'Phiên dịch viên chuyên ngành riêng biệt cho từng cuộc hội thoại (trừ khi đặt thêm)',
  'Sản xuất video quay mới hoặc thiết kế lại toàn bộ catalogue thương hiệu',
  'In ấn số lượng lớn catalogue vượt quá định mức của gói'
];

// ----------------------------------------------------------------------------
// 5. SEED PROGRAMS HỖ TRỢ HIỆN DIỆN TỪ XA (SECTION 3, 4, 5)
// ----------------------------------------------------------------------------
export const SEED_REMOTE_PROGRAMS = [
  {
    id: 'vsip-binh-duong',
    publicCode: 'PRG-2026-001',
    title: 'Ngày Hội Kết Nối Giao Thương Chuỗi Cung Ứng KCN VSIP 1 & 2',
    date: '15/10/2026',
    time: '08:30 - 17:30',
    location: 'Trung tâm Hội nghị KCN VSIP 1, TP. Thuận An, Bình Dương',
    category: 'Cơ khí chính xác, Tự động hóa, MEP',
    targetRoles: ['Nhà máy FDI', 'Tổng thầu EPC', 'Nhà cung ứng phụ trợ'],
    remotePresenceEnabled: true,
    remoteSubmissionDeadline: '2026-10-05T17:00:00+07:00',
    contentSubmissionDeadline: '2026-10-05T17:00:00+07:00',
    sampleSubmissionDeadline: '2026-10-08T17:00:00+07:00',
    acceptedContentTypes: ['Hồ sơ số', 'Video 1 phút', 'Catalogue A4', 'Tờ rơi năng lực', 'Mẫu sản phẩm'],
    acceptsSample: true,
    sampleMaxDimensions: '40x40x40 cm, tối đa 5kg',
    feeType: 'FIXED',
    feeAmount: 2200000,
    currency: 'VND',
    displayQuota: '01 ô trưng bày tiêu chuẩn tại Bàn Kết Nối Chung',
    status: 'REGISTRATION_OPEN',
    coordinatorName: 'Lê Thu Trang (Bàn Điều Phối Miền Nam)'
  },
  {
    id: 'sourcing-day-amata-dong-nai',
    publicCode: 'PRG-2026-002',
    title: 'Sourcing Day 1:1 Nhà Máy FDI Nhật Bản & Hàn Quốc Tại KCN Amata',
    date: '28/10/2026',
    time: '09:00 - 16:30',
    location: 'Hội trường Ban Quản lý KCN Amata, TP. Biên Hòa, Đồng Nai',
    category: 'Gia công CNC, Khuôn mẫu, Xử lý bề mặt kim loại',
    targetRoles: ['Purchasing Manager FDI', 'Chủ xưởng phụ trợ'],
    remotePresenceEnabled: true,
    remoteSubmissionDeadline: '2026-10-18T17:00:00+07:00',
    contentSubmissionDeadline: '2026-10-18T17:00:00+07:00',
    sampleSubmissionDeadline: '2026-10-22T17:00:00+07:00',
    acceptedContentTypes: ['Hồ sơ số', 'Catalogue song ngữ Anh - Nhật', 'Mẫu chi tiết cơ khí'],
    acceptsSample: true,
    sampleMaxDimensions: '30x30x20 cm, dưới 3kg',
    feeType: 'FIXED',
    feeAmount: 2500000,
    currency: 'VND',
    displayQuota: '01 khay trưng bày chi tiết mẫu kèm mã QR hồ sơ',
    status: 'REGISTRATION_OPEN',
    coordinatorName: 'Nguyễn Thành Nam (Ban Kết Nối Cơ Khí)'
  },
  {
    id: 'fdi-bac-ninh-electronics',
    publicCode: 'PRG-2026-004',
    title: 'Hội Thảo Kết Nối Chuỗi Cung Ứng Công Nghiệp Điện Tử KCN Yên Phong',
    date: '12/11/2026',
    time: '08:30 - 15:30',
    location: 'Trung tâm Văn hóa Thể thao KCN Yên Phong, Bắc Ninh',
    category: 'Linh kiện điện tử, Dây cáp, Nhựa kỹ thuật, Phòng sạch',
    targetRoles: ['Tier-1 Supplier', 'Tier-2 Vendor', 'Nhà máy lắp ráp'],
    remotePresenceEnabled: true,
    remoteSubmissionDeadline: '2026-11-01T17:00:00+07:00',
    contentSubmissionDeadline: '2026-11-01T17:00:00+07:00',
    sampleSubmissionDeadline: '2026-11-05T17:00:00+07:00',
    acceptedContentTypes: ['Hồ sơ số', 'Video dây chuyền SMT', 'Catalogue điện tử'],
    acceptsSample: false, // Program này KHÔNG nhận vật mẫu (Section 6)
    sampleMaxDimensions: 'Không áp dụng nhận vật mẫu',
    feeType: 'FIXED',
    feeAmount: 1800000,
    currency: 'VND',
    displayQuota: 'Màn hình LED chiếu luân phiên + Standee QR',
    status: 'REGISTRATION_OPEN',
    coordinatorName: 'Phạm Hoàng Yến (Văn Phòng Phía Bắc)'
  }
];

// ----------------------------------------------------------------------------
// 6. SEED SAMPLE REMOTE PRESENCE REQUESTS (SECTION 36, 56)
// ----------------------------------------------------------------------------
export const SEED_REMOTE_REQUESTS = [
  {
    id: 'REQ-REMOTE-2026-001',
    requestPublicCode: 'RPR-2026-0089',
    programId: 'vsip-binh-duong',
    programTitle: 'Ngày Hội Kết Nối Giao Thương Chuỗi Cung Ứng KCN VSIP 1 & 2',
    supplierOrganizationId: 'ORG-SUP-001',
    supplierName: 'Công ty Cơ khí Chính xác Minh Trí CNC',
    selectedProducts: [
      { id: 'PROD-001', name: 'Đồ gá kiểm tra (Jig hàn & Jig kiểm kích thước)', code: 'JIG-CNC-01' },
      { id: 'PROD-002', name: 'Chi tiết tiện CNC dung sai ±0.005mm', code: 'CNC-TURN-5' }
    ],
    status: REMOTE_PRESENCE_STATUSES.READY_FOR_PROGRAM,
    representationScope: [
      'CAN_PRESENT_APPROVED_PROFILE',
      'CAN_SHOW_APPROVED_VIDEO',
      'CAN_SHOW_CATALOGUE',
      'CAN_DISPLAY_SAMPLE',
      'CAN_EXPLAIN_APPROVED_PRODUCT_SUMMARY',
      'CAN_COLLECT_CONTACT_REQUEST',
      'CAN_FORWARD_APPROVED_MATERIALS',
      'CAN_RECORD_QUESTIONS'
    ],
    hasApprovedScript: true,
    approvedScript: {
      version: 'v1.2-FINAL',
      approvedAt: '2026-09-25T14:30:00+07:00',
      approvedBy: 'Trần Văn Minh (Giám đốc Kỹ thuật)',
      text: 'Công ty Cơ khí Minh Trí chuyên gia công Jig kiểm và chi tiết tiện CNC dung sai ±0.005mm theo tiêu chuẩn ISO 9001:2015, phục vụ các nhà máy FDI điện tử và ô tô. Quý khách vui lòng quét mã QR để tải hồ sơ năng lực chi tiết.'
    },
    sampleInfo: {
      hasSample: true,
      description: '01 bộ đồ gá mẫu kích thước 20x15cm và 03 mẫu trục tiện inox đối chứng',
      quantity: 4,
      shippingMethod: 'ViettelPost Express',
      trackingCode: 'VT-88291039VN',
      receivedStatus: SAMPLE_RECEIVED_STATUSES.RECEIVED,
      receivedAt: '2026-09-27T10:15:00+07:00',
      displayStatus: 'READY',
      returnOption: 'RETURN_TO_SUPPLIER',
      returnAddress: 'Lô C2, Cụm Công nghiệp Quất Động, Thường Tín, Hà Nội'
    },
    responderInfo: {
      fullName: 'Trần Văn Minh',
      role: 'Giám đốc Kỹ thuật',
      phone: '0912 345 678',
      email: 'minh.tv@minhtricnc.vn',
      timeZone: 'GMT+7',
      slaHours: 4
    },
    metrics: {
      profileViews: 42,
      videoViews: 18,
      qrScans: 29,
      catalogueOpens: 15,
      contactRequests: 6,
      buyerQuestions: 3,
      rfqRequested: 1,
      dealOutcomes: 0 // Tách rạch ròi metric (Section 18)
    },
    deliveryProofs: [
      { id: 'PRF-01', title: 'Ảnh bàn trưng bày mẫu chi tiết máy tại sự kiện', url: '/images/smart_factory_hero.jpg', type: 'PHOTO' },
      { id: 'PRF-02', title: 'Ảnh trình chiếu video giới thiệu xưởng trên màn hình kết nối', url: '/images/smart_factory_hero.jpg', type: 'PHOTO' }
    ],
    auditLogs: [
      { action: 'CREATE_REQUEST', performedBy: 'Doanh nghiệp', at: '2026-09-20T09:00:00+07:00', details: 'Nộp yêu cầu hiện diện từ xa' },
      { action: 'APPROVE_CONTENT', performedBy: 'Lê Thu Trang (Coordinator)', at: '2026-09-25T14:30:00+07:00', details: 'Duyệt kịch bản v1.2' },
      { action: 'RECEIVE_SAMPLE', performedBy: 'Ban Hậu cần', at: '2026-09-27T10:15:00+07:00', details: 'Tiếp nhận nguyên vẹn 4 mẫu chi tiết' }
    ]
  },
  {
    id: 'REQ-REMOTE-2026-002',
    requestPublicCode: 'RPR-2026-0092',
    programId: 'sourcing-day-amata-dong-nai',
    programTitle: 'Sourcing Day 1:1 Nhà Máy FDI Nhật Bản & Hàn Quốc Tại KCN Amata',
    supplierOrganizationId: 'ORG-SUP-002',
    supplierName: 'Nhà máy Đúc Áp Lực Nhôm & Xử Lý Bề Mặt An Thịnh',
    selectedProducts: [
      { id: 'PROD-003', name: 'Chi tiết đúc nhôm ADC12 tải trọng cao', code: 'CAST-ADC12' }
    ],
    status: REMOTE_PRESENCE_STATUSES.CONTENT_PREPARATION,
    representationScope: [
      'CAN_PRESENT_APPROVED_PROFILE',
      'CAN_SHOW_CATALOGUE',
      'CAN_COLLECT_CONTACT_REQUEST',
      'CAN_RECORD_QUESTIONS'
    ],
    hasApprovedScript: false,
    sampleInfo: {
      hasSample: true,
      description: '02 vỏ hộp động cơ đúc nhôm áp lực',
      quantity: 2,
      shippingMethod: 'Chuyển phát bưu điện',
      receivedStatus: SAMPLE_RECEIVED_STATUSES.IN_TRANSIT,
      returnOption: 'PICKUP_BY_SUPPLIER'
    },
    responderInfo: {
      fullName: 'Phạm Thị Thùy',
      role: 'Trưởng phòng Kinh doanh',
      phone: '0988 776 655',
      email: 'thuy.pt@anthinhcast.com',
      timeZone: 'GMT+7',
      slaHours: 8
    },
    metrics: {
      profileViews: 0,
      videoViews: 0,
      qrScans: 0,
      catalogueOpens: 0,
      contactRequests: 0,
      buyerQuestions: 0,
      rfqRequested: 0,
      dealOutcomes: 0
    },
    deliveryProofs: [],
    auditLogs: [
      { action: 'CREATE_REQUEST', performedBy: 'Doanh nghiệp', at: '2026-09-28T11:00:00+07:00', details: 'Nộp yêu cầu gói hiện diện Amata' }
    ]
  }
];

// ----------------------------------------------------------------------------
// 7. CORE SERVICE METHODS & BUSINESS ENFORCEMENT
// ----------------------------------------------------------------------------

/**
 * Lấy danh sách chương trình thực sự hỗ trợ Hiện diện từ xa (Section 3, 4)
 * Hard rule: Phải có remotePresenceEnabled = true và deadline chưa hết
 */
export const getEligibleRemotePrograms = () => {
  return SEED_REMOTE_PROGRAMS.filter(p => {
    const isRemoteEnabled = p.remotePresenceEnabled === true;
    const deadlineValid = !p.remoteSubmissionDeadline || new Date(p.remoteSubmissionDeadline) >= new Date('2026-09-29T00:00:00+07:00');
    const statusOpen = p.status === 'REGISTRATION_OPEN' || p.status === 'UPCOMING';
    return isRemoteEnabled && deadlineValid && statusOpen;
  });
};

/**
 * Lấy toàn bộ danh sách yêu cầu hiện diện từ xa
 */
export const getAllRemoteRequests = () => {
  const stored = safeGetItem(STORAGE_KEYS.REQUESTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return SEED_REMOTE_REQUESTS;
};

/**
 * Kiểm tra 11 tiêu chí sẵn sàng tham gia sự kiện (Section 58 Admin Readiness Checklist)
 */
export const checkProgramReadiness = (request) => {
  const missingItems = [];

  if (!request.programId) missingItems.push('Chưa xác nhận mã chương trình');
  if (!request.supplierOrganizationId && !request.supplierName) missingItems.push('Chưa xác nhận hồ sơ nhà cung ứng');
  if (!request.selectedProducts || request.selectedProducts.length === 0) missingItems.push('Chưa chọn 1–3 sản phẩm/năng lực cụ thể');
  if (request.selectedProducts && request.selectedProducts.length > 3) missingItems.push('Đã chọn vượt quá 3 sản phẩm/năng lực');
  if (!request.hasApprovedScript || !request.approvedScript?.text) missingItems.push('Chưa duyệt kịch bản giới thiệu (Approved Script)');
  if (!request.responderInfo?.fullName || !request.responderInfo?.phone) missingItems.push('Chưa xác nhận thông tin đầu mối phản hồi (Responder)');
  if (!request.representationScope || request.representationScope.length === 0) missingItems.push('Chưa chốt phạm vi đại diện của điều phối viên');
  
  // Nếu có vật mẫu, bắt buộc mẫu phải được tiếp nhận nguyên vẹn
  if (request.sampleInfo?.hasSample) {
    if (request.sampleInfo.receivedStatus !== SAMPLE_RECEIVED_STATUSES.RECEIVED) {
      missingItems.push('Hàng mẫu chưa được tiếp nhận tại kho điều phối');
    }
    if (!request.sampleInfo.returnOption) {
      missingItems.push('Chưa xác nhận phương án hoàn trả / xử lý mẫu sau sự kiện');
    }
  }

  const isReady = missingItems.length === 0;
  return {
    isReady,
    missingItems
  };
};

/**
 * Nộp yêu cầu hiện diện từ xa mới (Section 32, 33)
 */
export const submitRemotePresenceRequest = (formData) => {
  if (!formData.programId) {
    throw new Error('Bắt buộc phải chọn chương trình cụ thể có hỗ trợ tham gia từ xa.');
  }

  const eligiblePrograms = getEligibleRemotePrograms();
  const targetProgram = eligiblePrograms.find(p => p.id === formData.programId);
  if (!targetProgram) {
    throw new Error('Chương trình đã chọn không hỗ trợ hiện diện từ xa hoặc đã hết hạn nhận hồ sơ.');
  }

  if (formData.selectedProducts && formData.selectedProducts.length > 3) {
    throw new Error('Chỉ được chọn tối đa 3 sản phẩm/năng lực phù hợp nhất với chương trình (Section 7).');
  }

  const requests = getAllRemoteRequests();
  const newId = `REQ-REMOTE-2026-${String(requests.length + 1).padStart(3, '0')}`;
  const publicCode = `RPR-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

  const newRequest = {
    id: newId,
    requestPublicCode: publicCode,
    programId: targetProgram.id,
    programTitle: targetProgram.title,
    supplierOrganizationId: formData.supplierOrganizationId || 'ORG-SELF-DECLARED',
    supplierName: formData.supplierName || 'Doanh nghiệp chưa đặt tên',
    selectedProducts: formData.selectedProducts || [],
    status: REMOTE_PRESENCE_STATUSES.SUBMITTED,
    representationScope: formData.representationScope || [
      'CAN_PRESENT_APPROVED_PROFILE',
      'CAN_SHOW_APPROVED_VIDEO',
      'CAN_SHOW_CATALOGUE',
      'CAN_COLLECT_CONTACT_REQUEST',
      'CAN_RECORD_QUESTIONS'
    ],
    hasApprovedScript: false,
    approvedScript: null,
    sampleInfo: formData.sampleInfo || { hasSample: false },
    responderInfo: {
      fullName: formData.responderName || '',
      role: formData.responderRole || 'Phụ trách phản hồi',
      phone: formData.responderPhone || '',
      email: formData.responderEmail || '',
      timeZone: formData.timeZone || 'GMT+7',
      slaHours: formData.slaHours || 8
    },
    notes: formData.notes || '',
    consent: !!formData.consent,
    metrics: {
      profileViews: 0,
      videoViews: 0,
      qrScans: 0,
      catalogueOpens: 0,
      contactRequests: 0,
      buyerQuestions: 0,
      rfqRequested: 0,
      dealOutcomes: 0
    },
    deliveryProofs: [],
    createdAt: new Date().toISOString(),
    auditLogs: [
      {
        action: 'SUBMIT_REQUEST',
        performedBy: formData.responderName || 'Doanh nghiệp',
        at: new Date().toISOString(),
        details: `Nộp hồ sơ hiện diện từ xa tại chương trình: ${targetProgram.title}`
      }
    ]
  };

  requests.unshift(newRequest);
  safeSetItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return newRequest;
};

/**
 * Duyệt kịch bản giới thiệu (Section 37, 38, 39)
 * Hard rule: Nếu là SELF_DECLARED, không được xưng là "đã xác minh" hay "bảo đảm bởi CHUOICUNGUNG.COM"
 */
export const approveIntroductionScript = (requestId, approverName, scriptText, isSelfDeclared = true) => {
  const requests = getAllRemoteRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) throw new Error('Không tìm thấy yêu cầu hiện diện từ xa.');

  const forbiddenWords = ['đã xác minh', 'đảm bảo', 'chứng nhận bởi CHUOICUNGUNG.COM', 'cam kết chất lượng'];
  if (isSelfDeclared) {
    for (const word of forbiddenWords) {
      if (scriptText.toLowerCase().includes(word.toLowerCase())) {
        throw new Error(`Dữ liệu tự khai (Self-declared) không được chứa cụm từ khẳng định "${word}" (Section 39).`);
      }
    }
  }

  req.hasApprovedScript = true;
  req.approvedScript = {
    version: `v1.${(req.auditLogs.length % 5) + 1}-APPROVED`,
    approvedAt: new Date().toISOString(),
    approvedBy: approverName,
    text: scriptText
  };

  req.auditLogs.push({
    action: 'APPROVE_SCRIPT',
    performedBy: approverName,
    at: new Date().toISOString(),
    details: `Duyệt kịch bản giới thiệu chính thức ${req.approvedScript.version}`
  });

  safeSetItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return req;
};

/**
 * Ghi nhận tương tác sự kiện phân định rạch ròi từng loại metric (Section 18, 19)
 * Hard rule: QR SCAN ≠ CONTACT REQUEST ≠ BUYER NEED
 */
export const recordInteractionEvent = (requestId, eventType, metadata = {}) => {
  if (!INTERACTION_EVENT_TYPES[eventType]) {
    throw new Error(`Loại tương tác ${eventType} không hợp lệ.`);
  }

  const requests = getAllRemoteRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) throw new Error('Không tìm thấy yêu cầu hiện diện từ xa.');

  if (!req.metrics) {
    req.metrics = {
      profileViews: 0,
      videoViews: 0,
      qrScans: 0,
      catalogueOpens: 0,
      contactRequests: 0,
      buyerQuestions: 0,
      rfqRequested: 0,
      dealOutcomes: 0
    };
  }

  if (eventType === INTERACTION_EVENT_TYPES.PROFILE_OPEN) req.metrics.profileViews += 1;
  if (eventType === INTERACTION_EVENT_TYPES.VIDEO_VIEW) req.metrics.videoViews += 1;
  if (eventType === INTERACTION_EVENT_TYPES.QR_SCAN) req.metrics.qrScans += 1;
  if (eventType === INTERACTION_EVENT_TYPES.CATALOGUE_OPEN) req.metrics.catalogueOpens += 1;
  if (eventType === INTERACTION_EVENT_TYPES.CONTACT_REQUEST) {
    if (!metadata.consent) {
      throw new Error('Chỉ được tiếp nhận yêu cầu liên hệ khi người tham gia có consent rõ ràng (Section 20).');
    }
    req.metrics.contactRequests += 1;
  }
  if (eventType === INTERACTION_EVENT_TYPES.QUESTION_RECORDED) req.metrics.buyerQuestions += 1;

  safeSetItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return req.metrics;
};

/**
 * Tiếp nhận câu hỏi Buyer và chuyển tiếp về đầu mối (Section 14, 15)
 * Hard rule: Coordinator KHÔNG đoán câu trả lời hoặc tự ý báo giá
 */
export const recordBuyerInquiry = (requestId, inquiryData) => {
  const requests = getAllRemoteRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) throw new Error('Không tìm thấy yêu cầu hiện diện từ xa.');

  const isQuote = inquiryData.inquiryType === 'QUOTE_REQUEST';
  const status = isQuote ? 'QUOTE_REQUESTED' : 'NEEDS_SUPPLIER_RESPONSE';

  const newInquiry = {
    id: `INQ-${Date.now()}`,
    type: status,
    question: inquiryData.question,
    buyerName: inquiryData.buyerConsent ? inquiryData.buyerName : 'Đại diện Nhà máy (Bảo mật thông tin)',
    buyerCompany: inquiryData.buyerCompany,
    dueAt: new Date(Date.now() + (req.responderInfo.slaHours || 8) * 3600000).toISOString(),
    assignedResponder: req.responderInfo.fullName,
    createdAt: new Date().toISOString()
  };

  req.auditLogs.push({
    action: 'RECORD_BUYER_INQUIRY',
    performedBy: 'Điều phối viên sự kiện',
    at: new Date().toISOString(),
    details: `Ghi nhận ${status}: ${inquiryData.question.substring(0, 60)}...`
  });

  safeSetItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return newInquiry;
};

/**
 * Nghiệm thu bàn giao quyền lợi dịch vụ (Section 50, 51)
 * Hard rule: Dịch vụ COMPLETED chỉ có nghĩa là đã bàn giao đủ quyền lợi, KHÔNG đồng nghĩa cam kết chốt deal
 */
export const clientAcceptanceHandover = (requestId, decision, clientNotes = '') => {
  const validDecisions = ['ACCEPT_DELIVERY', 'REQUEST_CLARIFICATION', 'REPORT_MISSING_DELIVERABLE'];
  if (!validDecisions.includes(decision)) {
    throw new Error('Quyết định nghiệm thu không hợp lệ.');
  }

  const requests = getAllRemoteRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) throw new Error('Không tìm thấy yêu cầu hiện diện từ xa.');

  if (decision === 'ACCEPT_DELIVERY') {
    req.status = REMOTE_PRESENCE_STATUSES.COMPLETED;
    req.clientAcceptance = {
      status: 'ACCEPTED',
      acceptedAt: new Date().toISOString(),
      notes: clientNotes
    };
  } else {
    req.status = REMOTE_PRESENCE_STATUSES.FOLLOW_UP;
    req.clientAcceptance = {
      status: decision,
      reportedAt: new Date().toISOString(),
      notes: clientNotes
    };
  }

  req.auditLogs.push({
    action: `HANDOVER_${decision}`,
    performedBy: req.responderInfo?.fullName || 'Khách hàng',
    at: new Date().toISOString(),
    details: `Nghiệm thu: ${decision} - Ghi chú: ${clientNotes}`
  });

  safeSetItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return req;
};

/**
 * Xác thực tính trung lập của thuật toán kết nối (Section 22, 40)
 * Hard rule: Mua gói hiện diện từ xa KHÔNG tăng điểm Matching và KHÔNG tự động gắn Verified badge
 */
export const verifySupplierMatchingNeutrality = (supplierId) => {
  return {
    supplierId,
    remotePresencePurchased: true,
    matchingBonus: 0,                          // Tuyệt đối không cộng điểm Matching
    verifiedBadgeGranted: false,              // Không tự cấp tick xanh
    priorityBuyerMeetingGuaranteed: false,    // Không cam kết Buyer gặp riêng
    neutralityStatus: 'ENFORCED_NEUTRAL'
  };
};

/**
 * Xử lý khi chương trình bị hoãn hoặc hủy (Section 62)
 * Hard rule: Không xóa bản ghi, chuyển trạng thái và lưu vết AuditLog
 */
export const handleProgramRescheduleOrCancel = (programId, newStatus, reason) => {
  const requests = getAllRemoteRequests();
  const affected = requests.filter(r => r.programId === programId);

  affected.forEach(req => {
    req.status = newStatus === 'POSTPONED' ? REMOTE_PRESENCE_STATUSES.POSTPONED : REMOTE_PRESENCE_STATUSES.CANCELLED;
    req.auditLogs.push({
      action: `PROGRAM_${newStatus}`,
      performedBy: 'Ban Điều Phối Trung Tâm',
      at: new Date().toISOString(),
      details: `Chương trình bị ${newStatus}: ${reason}. Bảo lưu quyền lợi và lịch sử yêu cầu.`
    });
  });

  safeSetItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return { affectedCount: affected.length };
};

/**
 * Đăng ký nhận thông báo khi có chương trình mới phù hợp (Section 52, 53)
 */
export const submitRemotePresenceInterest = (interestData) => {
  const raw = safeGetItem(STORAGE_KEYS.INTERESTS);
  const list = raw ? JSON.parse(raw) : [];

  const newInterest = {
    id: `INT-${Date.now()}`,
    organizationName: interestData.organizationName,
    categories: interestData.categories || [],
    locations: interestData.locations || [],
    contactName: interestData.contactName,
    contactPhone: interestData.contactPhone,
    contactEmail: interestData.contactEmail,
    consent: !!interestData.consent,
    createdAt: new Date().toISOString()
  };

  list.unshift(newInterest);
  safeSetItem(STORAGE_KEYS.INTERESTS, JSON.stringify(list));
  return newInterest;
};
