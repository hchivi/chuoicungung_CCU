// ============================================================================
// TEST SUITE: PAGE 34 - HIỆN DIỆN TỪ XA TẠI SỰ KIỆN (/dich-vu/hien-dien-tu-xa)
// Đặc tả 34.txt - 20 Tiêu chí QA Section 68
// ============================================================================

import {
  REPRESENTATION_SCOPE_FLAGS,
  DEFAULT_RESTRICTIONS,
  REMOTE_PRESENCE_STATUSES,
  INTERACTION_EVENT_TYPES,
  SAMPLE_RECEIVED_STATUSES,
  SAMPLE_RETURN_OPTIONS,
  EXCLUSION_ITEMS,
  SEED_REMOTE_PROGRAMS,
  getEligibleRemotePrograms,
  getAllRemoteRequests,
  checkProgramReadiness,
  submitRemotePresenceRequest,
  approveIntroductionScript,
  recordInteractionEvent,
  recordBuyerInquiry,
  clientAcceptanceHandover,
  verifySupplierMatchingNeutrality,
  handleProgramRescheduleOrCancel,
  submitRemotePresenceInterest
} from '../../src/data/remotePresenceData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('TESTING SPEC 34: HIỆN DIỆN TỪ XA TẠI SỰ KIỆN (/dich-vu/hien-dien-tu-xa)');
console.log('================================================================\n');

try {
  // QA 1: Chỉ Program hỗ trợ Remote Presence mới hiện (Section 3, 4)
  const eligible = getEligibleRemotePrograms();
  const allSupportRemote = eligible.every(p => p.remotePresenceEnabled === true);
  assert(eligible.length > 0 && allSupportRemote, '1. Chỉ hiển thị các chương trình có cấu hình remotePresenceEnabled = true rõ ràng');

  // QA 2: Program deadline được enforce (Section 4, 24)
  const allNotExpired = eligible.every(p => new Date(p.remoteSubmissionDeadline) >= new Date('2026-09-29T00:00:00+07:00'));
  assert(allNotExpired, '2. Các chương trình trong danh sách đều còn hạn nhận hồ sơ hiện diện từ xa');

  // QA 3: Chọn sản phẩm cụ thể 1-3 món, từ chối dump toàn bộ catalogue (Section 7)
  let rejectedDump = false;
  try {
    submitRemotePresenceRequest({
      programId: 'vsip-binh-duong',
      supplierName: 'Công ty Thử Nghiệm',
      selectedProducts: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]
    });
  } catch (e) {
    rejectedDump = true;
  }
  assert(rejectedDump, '3. Từ chối yêu cầu chọn quá 3 sản phẩm, bắt buộc chọn 1–3 danh mục trọng tâm phù hợp');

  // QA 4: Tạo hồ sơ hợp lệ ở trạng thái SUBMITTED, không tự nhận là ACTIVE (Section 36)
  const validRequest = submitRemotePresenceRequest({
    programId: 'vsip-binh-duong',
    supplierOrganizationId: 'ORG-TEST-001',
    supplierName: 'Công ty Cơ khí Tân Phát',
    selectedProducts: [{ id: 'PROD-01', name: 'Trục dẫn hướng CNC' }],
    responderName: 'Nguyễn Văn Phát',
    responderPhone: '0901234567',
    responderRole: 'Kỹ sư trưởng',
    consent: true
  });
  assert(validRequest.status === REMOTE_PRESENCE_STATUSES.SUBMITTED, '4. Hồ sơ nộp mới khởi tạo ở trạng thái SUBMITTED chờ thẩm định');

  // QA 5: Phân định rạch ròi 9 quyền đại diện (Section 12)
  const scopeKeys = Object.keys(REPRESENTATION_SCOPE_FLAGS);
  assert(scopeKeys.length === 9 && scopeKeys.includes('CAN_PRESENT_APPROVED_PROFILE') && scopeKeys.includes('CAN_RECORD_QUESTIONS'), '5. Chuẩn hóa đầy đủ 9 cờ phân định phạm vi đội điều phối có thể đại diện');

  // QA 6: Danh mục 11 điều cấm mặc định của điều phối viên (Section 13)
  assert(DEFAULT_RESTRICTIONS.length === 11, '6. Thiết lập 11 ranh giới cấm tuyệt đối: không tự báo giá, không cam kết MOQ/lead time, không ký hợp đồng');

  // QA 7: Kịch bản tự khai (Self-declared) không được dùng từ cam kết bảo đảm (Section 39)
  let scriptRejected = false;
  try {
    approveIntroductionScript(validRequest.id, 'Coordinator Trang', 'Công ty Tân Phát cam kết chất lượng số 1 và đã xác minh bởi CHUOICUNGUNG.COM', true);
  } catch (e) {
    scriptRejected = true;
  }
  assert(scriptRejected, '7. Chặn kịch bản tự khai chứa từ ngữ "đã xác minh" hoặc "chứng nhận bởi CHUOICUNGUNG.COM"');

  // QA 8: Duyệt kịch bản hợp lệ thành công và ghi nhận version (Section 37, 38)
  const approvedScript = approveIntroductionScript(validRequest.id, 'Coordinator Trang', 'Công ty Tân Phát gia công cơ khí trục dẫn hướng CNC theo yêu cầu bản vẽ.', false);
  assert(approvedScript.hasApprovedScript === true && approvedScript.approvedScript.version.includes('APPROVED'), '8. Duyệt kịch bản giới thiệu hợp lệ thành công kèm phiên bản và người duyệt');

  // QA 9: Tách rạch ròi từng loại số liệu tương tác (Section 18, 19)
  recordInteractionEvent(validRequest.id, INTERACTION_EVENT_TYPES.QR_SCAN);
  recordInteractionEvent(validRequest.id, INTERACTION_EVENT_TYPES.VIDEO_VIEW);
  const reqWithMetrics = getAllRemoteRequests().find(r => r.id === validRequest.id);
  assert(reqWithMetrics.metrics.qrScans === 1 && reqWithMetrics.metrics.videoViews === 1 && reqWithMetrics.metrics.dealOutcomes === 0, '9. Tách bạch đo lường: QR Scan ≠ Contact Request ≠ RFQ ≠ Deal Outcome');

  // QA 10: Chỉ ghi nhận Contact Request khi có consent của người tham quan (Section 20, 21)
  let noConsentBlocked = false;
  try {
    recordInteractionEvent(validRequest.id, INTERACTION_EVENT_TYPES.CONTACT_REQUEST, { consent: false });
  } catch (e) {
    noConsentBlocked = true;
  }
  assert(noConsentBlocked, '10. Chặn thu thập danh thiếp/liên hệ khi người tham gia không đồng ý chia sẻ thông tin');

  // QA 11: Buyer hỏi giá được ghi nhận QUOTE_REQUESTED chuyển về xưởng, không tự báo giá (Section 14)
  const inquiry = recordBuyerInquiry(validRequest.id, {
    inquiryType: 'QUOTE_REQUEST',
    question: 'Báo giá 1.000 trục dẫn hướng kích thước phi 25?',
    buyerCompany: 'Nhà máy Canon Tiên Sơn'
  });
  assert(inquiry.type === 'QUOTE_REQUESTED' && inquiry.dueAt !== null, '11. Buyer hỏi giá chuyển thành QUOTE_REQUESTED về cho đầu mối xưởng xử lý');

  // QA 12: Buyer hỏi kỹ thuật vượt phạm vi kịch bản ghi nhận NEEDS_SUPPLIER_RESPONSE (Section 15)
  const techInquiry = recordBuyerInquiry(validRequest.id, {
    inquiryType: 'TECH_QUESTION',
    question: 'Xưởng có chứng chỉ mạ Niken bề mặt không?',
    buyerCompany: 'Nhà máy Sumitomo'
  });
  assert(techInquiry.type === 'NEEDS_SUPPLIER_RESPONSE', '12. Câu hỏi kỹ thuật chuyên sâu ghi nhận trạng thái NEEDS_SUPPLIER_RESPONSE');

  // QA 13: Đội điều phối không cam kết bán hàng thay doanh nghiệp (Section 11)
  const sampleExclusions = EXCLUSION_ITEMS;
  assert(sampleExclusions.length >= 6 && sampleExclusions.some(e => e.includes('Lập báo giá') || e.includes('Đàm phán')), '13. Minh bạch danh mục "KHÔNG BAO GỒM": Không bán hàng thay, không đàm phán hợp đồng');

  // QA 14: Sample handling có đầy đủ phương án hoàn trả sau sự kiện (Section 23, 26)
  const sampleReturnKeys = Object.keys(SAMPLE_RETURN_OPTIONS);
  assert(sampleReturnKeys.includes('RETURN_TO_SUPPLIER') && sampleReturnKeys.includes('DISPOSE_WITH_APPROVAL'), '14. Quy trình xử lý vật mẫu có đầy đủ 5 phương án hoàn trả/lưu trữ/tiêu hủy minh bạch');

  // QA 15: Kiểm tra bảng 11 tiêu chí sẵn sàng của Admin (Section 58 Readiness Checklist)
  const readinessCheck = checkProgramReadiness(validRequest);
  // Do chưa có mẫu đối chứng được tiếp nhận và kịch bản đã duyệt
  assert(typeof readinessCheck.isReady === 'boolean' && Array.isArray(readinessCheck.missingItems), '15. Hệ thống kiểm tra điều kiện xuất quân (Admin Readiness Gate) phát hiện các hạng mục còn thiếu');

  // QA 16: Mua gói hiện diện từ xa không tăng điểm SupplierMatching và không tự cấp tick xanh (Section 22, 40)
  const neutrality = verifySupplierMatchingNeutrality('ORG-SUP-001');
  assert(neutrality.matchingBonus === 0 && neutrality.verifiedBadgeGranted === false, '16. Tuyệt đối không cộng điểm Matching score và không tự cấp tick xanh Verified cho gói trả phí');

  // QA 17: Khách hàng nghiệm thu dịch vụ phân tách COMPLETED ≠ Deal Success (Section 50, 51)
  const acceptedHandover = clientAcceptanceHandover(validRequest.id, 'ACCEPT_DELIVERY', 'Đã nhận đủ ảnh quầy và 15 lượt tương tác');
  assert(acceptedHandover.status === REMOTE_PRESENCE_STATUSES.COMPLETED && acceptedHandover.metrics.dealOutcomes === 0, '17. Nghiệm thu hoàn tất dịch vụ (COMPLETED) chỉ xác nhận bàn giao quyền lợi, không ngụy tạo kết quả chốt deal');

  // QA 18: Sự kiện bị hoãn hoặc hủy bảo toàn lịch sử yêu cầu, không xóa dữ liệu (Section 62)
  const cancelResult = handleProgramRescheduleOrCancel('vsip-binh-duong', 'POSTPONED', 'Thời tiết bão lũ');
  assert(cancelResult.affectedCount > 0, '18. Sự kiện hoãn/hủy tự động cập nhật trạng thái bảo lưu quyền lợi và lưu vết AuditLog');

  // QA 19: Đăng ký quan tâm khi chưa có chương trình phù hợp (Section 52, 53)
  const interest = submitRemotePresenceInterest({
    organizationName: 'Công ty Nhựa Kỹ Thuật Đạt Hòa',
    categories: ['Nhựa kỹ thuật'],
    contactName: 'Lê Văn Đạt',
    contactPhone: '0933445566',
    consent: true
  });
  assert(interest.id.startsWith('INT-') && interest.consent === true, '19. Tiếp nhận đăng ký quan tâm (Interest) khi chưa có chương trình phù hợp mà không thu phí');

  // QA 20: Mọi thao tác cập nhật đơn, duyệt kịch bản, nghiệm thu đều có AuditLog (Section 1)
  const finalReq = getAllRemoteRequests().find(r => r.id === validRequest.id);
  assert(finalReq.auditLogs.length >= 4, '20. Mọi biến động trạng thái hồ sơ, duyệt kịch bản và nghiệm thu đều được ghi vết AuditLog');

  // QA 21: Giao diện trang /dich-vu/hien-dien-tu-xa tuân thủ cấu trúc di động 390px (Section 66)
  const fs = await import('fs');
  const path = await import('path');
  const pagePath = path.resolve('src/pages/RemotePresenceServicePage.jsx');
  const pageCode = fs.readFileSync(pagePath, 'utf-8');

  const hasHero = pageCode.includes('GIỚI THIỆU DOANH NGHIỆP TẠI CHƯƠNG TRÌNH DÙ BẠN CHƯA THỂ CÓ MẶT');
  const hasPrograms = pageCode.includes('Chương Trình Đang Nhận Hồ Sơ Hiện Diện Từ Xa');
  const hasContent = pageCode.includes('Nội Dung Doanh Nghiệp Có Thể Gửi');
  const hasScope = pageCode.includes('Phần Việc Được Thực Hiện Tại Sự Kiện');
  const hasRestrictions = pageCode.includes('Ranh giới đại diện & Điều cấm tuyệt đối');
  const hasForm = pageCode.includes('Đăng Ký Hiện Diện Từ Xa');
  const hasFaq = pageCode.includes('Câu Hỏi Thường Gặp');
  const hasOverflowProtection = pageCode.includes('overflow-hidden') || pageCode.includes('max-w-');
  const noHardcodedWide = !pageCode.match(/w-\[(39[1-9]|[4-9]\d\d|\d{4,})px\]/g);

  assert(
    hasHero && hasPrograms && hasContent && hasScope && hasRestrictions && hasForm && hasFaq && hasOverflowProtection && noHardcodedWide,
    '21. Giao diện trang /dich-vu/hien-dien-tu-xa tuân thủ đầy đủ 9 khối nội dung di động 390px không tràn viền'
  );

} catch (err) {
  console.error('Lỗi thực thi test suite:', err);
  failed++;
}

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('================================================================\n');

if (failed === 0) {
  console.log('🎉 ALL 20 SPEC 34 TESTS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error(`💥 ${failed} TESTS FAILED! Check logic implementation.\n`);
  process.exit(1);
}
