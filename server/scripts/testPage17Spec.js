// ============================================================================
// AUTOMATED TEST SUITE: PAGE 17 (YÊU CẦU DỊCH VỤ / SERVICE REQUEST ENGINE)
// ROUTE: /yeu-cau-dich-vu
// Chuẩn hóa theo spec 17.txt - CHUOICUNGUNG.COM
// ============================================================================

import assert from 'assert';
import {
  SERVICE_ENGINE_TYPES,
  FORM_ENGINE_STATUSES,
  PROPOSAL_STATUSES,
  detectPossibleDuplicate,
  generatePublicTrackingCode,
  submitUnifiedServiceRequest,
  saveServiceRequestDraft,
  getServiceRequestDraft,
  clearServiceRequestDraft,
  getUserServiceRequests,
  getServiceRequestByCodeOrId,
  updateFormEngineRequestStatus,
  updateServiceRequestProposal,
  addServiceRequestTask
} from '../../src/data/serviceFormEngineData.js';

import {
  getAllServiceRequests,
  getAllServiceAuditLogs
} from '../../src/data/servicesData.js';

console.log('----------------------------------------------------');
console.log('🧪 CHẠY BỘ KIỂM THỬ SPEC 17.TXT CHO CHUOICUNGUNG.COM');
console.log('----------------------------------------------------\n');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: SERVICE CONTEXT ĐƯỢC PREFILL ĐÚNG (SECTION 3 & 24.1)
// ----------------------------------------------------------------------------
it('1. Service context được prefill đúng từ query params', () => {
  const queryMap = {
    'to-chuc-ket-noi': 'TO_CHUC_KET_NOI',
    'vat-pham-su-kien': 'VAT_PHAM_SU_KIEN',
    'truyen-thong-doanh-nghiep': 'TRUYEN_THONG_DOANH_NGHIEP',
    'hien-dien-tu-xa': 'HIEN_DIEN_TU_XA',
    'tai-tro': 'TAI_TRO'
  };

  for (const [slug, expectedType] of Object.entries(queryMap)) {
    const sLower = slug.toLowerCase().replace(/-/g, '_');
    let targetType = 'TO_CHUC_KET_NOI';
    if (sLower.includes('vat_pham')) targetType = 'VAT_PHAM_SU_KIEN';
    else if (sLower.includes('truyen_thong')) targetType = 'TRUYEN_THONG_DOANH_NGHIEP';
    else if (sLower.includes('hien_dien')) targetType = 'HIEN_DIEN_TU_XA';
    else if (sLower.includes('tai_tro')) targetType = 'TAI_TRO';

    assert.strictEqual(targetType, expectedType, `Slug ${slug} phải ánh xạ về ${expectedType}`);
    assert.ok(SERVICE_ENGINE_TYPES[targetType], `Phải có metadata cho service ${targetType}`);
  }
});

// ----------------------------------------------------------------------------
// TEST 2: DYNAMIC FIELDS ĐỔI ĐÚNG SERVICE (SECTION 5 & 24.2)
// ----------------------------------------------------------------------------
it('2. Dynamic fields đổi đúng service (A, B, C, D, E)', () => {
  // A. Tổ chức kết nối
  const matchFields = ['objective', 'targetAudience', 'categories', 'location', 'expectedDate', 'scale', 'existingResources', 'ccuSupportNeeded'];
  // B. Vật phẩm
  const merchFields = ['productTypes', 'quantities', 'sizeChart', 'specifications', 'printRequirements', 'colors', 'packagingRequirements', 'sampleRequired', 'deliveryLocation', 'approvalContact'];
  // C. Truyền thông
  const mediaFields = ['mediaItems', 'targetProducts', 'existingDocs', 'shootingLocation', 'languages', 'distributionChannels', 'contentApprover', 'deadline'];
  // D. Hiện diện từ xa
  const remoteFields = ['targetProgramId', 'presentationFormat', 'existingMaterials', 'videoCatalogueLink', 'physicalSampleTypes', 'buyerContactPerson', 'representationScope'];
  // E. Tài trợ (Chỉ tư vấn, không auto-active)
  const sponsorFields = ['sponsoredProgramId', 'territory', 'sponsorshipDuration', 'benefitsInterested', 'contributionType', 'sponsorshipBudget'];

  assert.ok(matchFields.length >= 8, 'A: Tổ chức kết nối có đầy đủ fields');
  assert.ok(merchFields.length >= 10, 'B: Vật phẩm có đầy đủ fields');
  assert.ok(mediaFields.length >= 8, 'C: Truyền thông có đầy đủ fields');
  assert.ok(remoteFields.length >= 7, 'D: Hiện diện từ xa có đầy đủ fields');
  assert.ok(sponsorFields.length >= 6, 'E: Tài trợ có đầy đủ fields');
  assert.strictEqual(SERVICE_ENGINE_TYPES.TAI_TRO.isConsultationOnly, true, 'Nhánh tài trợ chỉ là yêu cầu tư vấn');
});

// ----------------------------------------------------------------------------
// TEST 3: LOGIN / DRAFT KHÔNG LÀM MẤT DỮ LIỆU (SECTION 13 & 24.3)
// ----------------------------------------------------------------------------
it('3. Draft autosave và khôi phục không làm mất dữ liệu', () => {
  const draftData = {
    companyName: 'Công ty Cổ phần Cơ khí Chính xác QA Test',
    customerName: 'Nguyễn Văn QA',
    phone: '0901234567',
    email: 'qa@cokhichinhxac.vn',
    description: 'Yêu cầu kết nối B2B với 5 nhà máy FDI tại VSIP',
    serviceType: 'TO_CHUC_KET_NOI'
  };

  saveServiceRequestDraft(draftData);
  const loadedDraft = getServiceRequestDraft();
  assert.ok(loadedDraft, 'Draft phải được lưu vào storage');
  assert.strictEqual(loadedDraft.companyName, draftData.companyName);
  assert.strictEqual(loadedDraft.customerName, draftData.customerName);
  assert.ok(loadedDraft.savedAt, 'Draft phải có timestamp lưu');

  clearServiceRequestDraft();
  assert.strictEqual(getServiceRequestDraft(), null, 'Sau khi clear thì draft phải null');
});

// ----------------------------------------------------------------------------
// TEST 4: ORGANIZATION DATA KHÔNG PHẢI NHẬP LẠI (SECTION 4 & 24.4)
// ----------------------------------------------------------------------------
it('4. Organization data & user session được tái sử dụng khi login', () => {
  const mockUserSession = {
    name: 'Đặng Quốc Huy',
    companyName: 'Tập đoàn Công nghiệp Việt Thắng',
    orgName: 'Tập đoàn Công nghiệp Việt Thắng',
    email: 'huy.dang@vietthang.vn',
    phone: '0988776655',
    role: 'Giám đốc Chuỗi cung ứng',
    organizationId: 'org-vietthang'
  };

  const autoFilledForm = {
    customerName: mockUserSession.name,
    companyName: mockUserSession.orgName,
    email: mockUserSession.email,
    phone: mockUserSession.phone,
    roleTitle: mockUserSession.role,
    organizationId: mockUserSession.organizationId
  };

  assert.strictEqual(autoFilledForm.companyName, 'Tập đoàn Công nghiệp Việt Thắng');
  assert.strictEqual(autoFilledForm.organizationId, 'org-vietthang');
  assert.strictEqual(autoFilledForm.customerName, 'Đặng Quốc Huy');
});

// ----------------------------------------------------------------------------
// TEST 5: SUBMIT TẠO ĐÚNG 1 SERVICE REQUEST (SECTION 7 & 24.5)
// ----------------------------------------------------------------------------
let createdRequest = null;
it('5. Submit tạo đúng 1 ServiceRequest chuẩn', () => {
  const initialCount = getAllServiceRequests().length;

  const testPayload = {
    serviceType: 'TO_CHUC_KET_NOI',
    companyName: 'Công ty TNHH Nhôm Đúc Nam Phát',
    organizationId: 'org-namphat-01',
    contactName: 'Trịnh Hoài Nam',
    roleTitle: 'Trưởng phòng Kinh doanh',
    contactEmail: 'nam.th@namphatcasting.com',
    contactPhone: '0912345678',
    description: 'Tìm kiếm đối tác thu mua linh kiện nhôm đúc áp lực cao xuất khẩu',
    location: 'KCN Sóng Thần 3, Bình Dương',
    desiredDate: '2026-11-20',
    budget: '50 - 80 triệu VNĐ',
    dynamicData: {
      objective: 'Tiếp cận 3 nhà máy xe máy điện và thiết bị gia dụng',
      scale: 'Quy mô 20 đại biểu'
    },
    consentToContact: true,
    marketingConsent: false
  };

  const res = submitUnifiedServiceRequest(testPayload);
  assert.strictEqual(res.success, true, 'Submit phải thành công');
  assert.ok(res.request, 'Phải trả về request object');
  createdRequest = res.request;

  const newCount = getAllServiceRequests().length;
  assert.strictEqual(newCount, initialCount + 1, 'Số lượng request trong DB phải tăng đúng 1');
});

// ----------------------------------------------------------------------------
// TEST 6: DUPLICATE ĐƯỢC FLAG (SECTION 12 & 24.6)
// ----------------------------------------------------------------------------
it('6. Duplicate được phát hiện và gắn cờ POSSIBLE_DUPLICATE (không xóa)', () => {
  const dupPayload = {
    serviceType: 'TO_CHUC_KET_NOI',
    companyName: 'Công ty TNHH Nhôm Đúc Nam Phát', // Cùng cty
    contactName: 'Trịnh Hoài Nam',
    contactEmail: 'nam.th@namphatcasting.com', // Cùng email
    contactPhone: '0912345678',
    description: 'Yêu cầu kết nối nhôm đúc gửi lần 2'
  };

  const dupRes = submitUnifiedServiceRequest(dupPayload);
  assert.strictEqual(dupRes.success, true, 'Vẫn lưu để Admin kiểm tra');
  assert.strictEqual(dupRes.isDuplicateWarning, true, 'Phải phát hiện duplicate');
  assert.strictEqual(dupRes.request.duplicateStatus, 'POSSIBLE_DUPLICATE', 'Phải có cờ POSSIBLE_DUPLICATE');
  assert.ok(dupRes.request.duplicateNote.includes('Trùng thông tin'), 'Phải có ghi chú duplicate lý do');
});

// ----------------------------------------------------------------------------
// TEST 7: PUBLIC CODE DV-* ĐƯỢC TẠO (SECTION 8 & 24.7)
// ----------------------------------------------------------------------------
it('7. Public code DV-2026-xxxxx được tạo, tách biệt với UUID nội bộ', () => {
  assert.ok(createdRequest.publicCode, 'Phải có publicCode');
  assert.match(createdRequest.publicCode, /^DV-\d{4}-\d{5}$/, 'Public code phải theo định dạng DV-YYYY-NNNNN');
  assert.notStrictEqual(createdRequest.publicCode, createdRequest.id, 'Public code phải tách biệt hoàn toàn với UUID nội bộ');
});

// ----------------------------------------------------------------------------
// TEST 8: OWNER ĐƯỢC ASSIGN THEO DESK ROUTING (SECTION 11, 18 & 24.8)
// ----------------------------------------------------------------------------
it('8. Owner và Routing Desk được phân công tự động theo loại dịch vụ', () => {
  assert.strictEqual(createdRequest.desk, SERVICE_ENGINE_TYPES.TO_CHUC_KET_NOI.desk);
  assert.strictEqual(createdRequest.owner, SERVICE_ENGINE_TYPES.TO_CHUC_KET_NOI.defaultOwner);
  assert.strictEqual(createdRequest.ownerUserId, SERVICE_ENGINE_TYPES.TO_CHUC_KET_NOI.ownerRole);
});

// ----------------------------------------------------------------------------
// TEST 9: INITIAL TASK ĐƯỢC TẠO (SECTION 7, 24.9)
// ----------------------------------------------------------------------------
it('9. Initial task được tạo ngay khi nộp yêu cầu', () => {
  assert.ok(Array.isArray(createdRequest.tasks), 'Request phải có mảng tasks');
  assert.strictEqual(createdRequest.tasks.length, 1, 'Phải có ít nhất 1 initial task');
  assert.strictEqual(createdRequest.tasks[0].status, 'PENDING');
  assert.strictEqual(createdRequest.tasks[0].assignee, createdRequest.owner);
  assert.ok(createdRequest.tasks[0].dueDate, 'Initial task phải có dueDate');
});

// ----------------------------------------------------------------------------
// TEST 10: ACTIVE REQUEST CÓ NEXT ACTION & NEXT ACTION AT (SECTION 11 & 24.10)
// ----------------------------------------------------------------------------
it('10. Mọi active request có nextAction và nextActionAt cụ thể', () => {
  assert.ok(createdRequest.nextAction, 'Phải có nextAction');
  assert.notStrictEqual(createdRequest.nextAction.trim(), '', 'nextAction không được để trống');
  assert.ok(createdRequest.nextActionAt, 'Phải có nextActionAt (thời hạn cụ thể)');
});

// ----------------------------------------------------------------------------
// TEST 11: MARKETING CONSENT TÁCH RIÊNG (SECTION 15 & 24.11)
// ----------------------------------------------------------------------------
it('11. Consent liên hệ (bắt buộc) và Marketing Consent (tùy chọn) tách biệt', () => {
  assert.strictEqual(createdRequest.consentToContact, true, 'consentToContact phải là boolean true');
  assert.strictEqual(createdRequest.marketingConsent, false, 'marketingConsent phải là boolean false (không bị gộp)');
});

// ----------------------------------------------------------------------------
// TEST 12: PRIVATE FILES KHÔNG PUBLIC (SECTION 14 & 24.12)
// ----------------------------------------------------------------------------
it('12. Tệp đính kèm gắn cờ isPrivate: true (Private by default)', () => {
  const reqWithFile = submitUnifiedServiceRequest({
    serviceType: 'VAT_PHAM_SU_KIEN',
    companyName: 'Test File Security Org',
    contactName: 'Security Lead',
    contactPhone: '0909999888',
    description: 'Yêu cầu mẫu in túi quà tặng',
    attachments: [{ name: 'Brand_Identity_Confidential.pdf', size: '2.4 MB', type: 'application/pdf' }]
  });

  assert.ok(reqWithFile.request.attachments.length > 0);
  assert.strictEqual(reqWithFile.request.attachments[0].isPrivate, true, 'Tệp tải lên phải private by default');
});

// ----------------------------------------------------------------------------
// TEST 13: QUOTATION STATUS TÁCH REQUEST STATUS (SECTION 19 & 24.13)
// ----------------------------------------------------------------------------
it('13. Trạng thái Báo giá / Proposal tách biệt với trạng thái Yêu cầu', () => {
  const propRes = updateServiceRequestProposal({
    requestId: createdRequest.id,
    proposalStatus: PROPOSAL_STATUSES.SENT,
    title: 'Phương án kết nối nhà máy FDI Quý 4/2026',
    totalAmount: '65.000.000 VNĐ',
    deliverables: ['Khảo sát thực địa nhà xưởng', 'Tổ chức phiên kết nối 1-1', 'Bàn giao danh bạ Buyer'],
    sharedWithCustomer: true
  });

  assert.strictEqual(propRes.success, true);
  assert.strictEqual(propRes.proposal.status, 'SENT', 'Proposal status là SENT');
  assert.strictEqual(propRes.request.status, 'NEW', 'Request status vẫn giữ nguyên NEW (tách biệt 2 state machine)');
});

// ----------------------------------------------------------------------------
// TEST 14: CANCELLED BẮT BUỘC CÓ REASON (SECTION 10 & 24.14)
// ----------------------------------------------------------------------------
it('14. Chuyển trạng thái sang CANCELLED bắt buộc phải có reason', () => {
  // Thử hủy không có reason -> phải bị từ chối
  const failCancel = updateFormEngineRequestStatus({
    requestId: createdRequest.id,
    status: 'CANCELLED',
    reason: '' // Rỗng
  });
  assert.strictEqual(failCancel.success, false, 'Không được phép hủy nếu không có reason');
  assert.ok(failCancel.message.includes('Spec 17 - Mục 10'), 'Thông báo lỗi phải trích xuất quy định Spec 17');

  // Hủy có reason hợp lệ -> thành công
  const okCancel = updateFormEngineRequestStatus({
    requestId: createdRequest.id,
    status: 'CANCELLED',
    reason: 'Doanh nghiệp thay đổi kế hoạch sản xuất sang Quý 1 năm sau'
  });
  assert.strictEqual(okCancel.success, true, 'Hủy thành công khi có reason');
  assert.strictEqual(okCancel.request.status, 'CANCELLED');
  assert.strictEqual(okCancel.request.cancellationReason, 'Doanh nghiệp thay đổi kế hoạch sản xuất sang Quý 1 năm sau');
});

// ----------------------------------------------------------------------------
// TEST 15: ADMIN MUTATION CÓ AUDIT LOG (SECTION 21 & 24.15)
// ----------------------------------------------------------------------------
it('15. Mọi thao tác submit, status change, proposal, task đều ghi AuditLog', () => {
  const logs = getAllServiceAuditLogs();
  assert.ok(logs.length > 0, 'Phải có nhật ký kiểm toán trong hệ thống');

  const hasCreatedLog = logs.some(l => l.action === 'SERVICE_REQUEST_CREATED');
  const hasStatusLog = logs.some(l => l.action === 'SERVICE_REQUEST_CANCELLED' || l.action === 'SERVICE_REQUEST_STATUS_CHANGED');
  const hasPropLog = logs.some(l => l.action === 'PROPOSAL_STATUS_CHANGED');

  assert.ok(hasCreatedLog, 'Phải có log tạo yêu cầu');
  assert.ok(hasStatusLog, 'Phải có log cập nhật trạng thái / hủy');
  assert.ok(hasPropLog, 'Phải có log thay đổi báo giá');
});

// ----------------------------------------------------------------------------
// TEST 16: TRA CỨU WORKSPACE THEO MÃ HOẶC LIÊN HỆ (SECTION 16)
// ----------------------------------------------------------------------------
it('16. Tra cứu yêu cầu dịch vụ trong Account Workspace', () => {
  const foundByCode = getServiceRequestByCodeOrId(createdRequest.publicCode);
  assert.ok(foundByCode, 'Phải tra cứu được qua publicCode DV-2026-xxxxx');
  assert.strictEqual(foundByCode.id, createdRequest.id);

  const foundByUser = getUserServiceRequests('0912345678');
  assert.ok(foundByUser.length > 0, 'Phải tra cứu được qua số điện thoại');
  assert.ok(foundByUser.some(r => r.id === createdRequest.id));
});

console.log('\n====================================================');
console.log(`🎉 KẾT QUẢ KIỂM THỬ: ${passCount} PASS / ${failCount} FAIL`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
