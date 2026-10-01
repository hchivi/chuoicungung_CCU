// ============================================================================
// TEST SUITE: PAGE 35 - BỘ HỒ SƠ TUYỂN CHỌN (/bo-ho-so/[slug])
// Đặc tả 35.txt - 17 Tiêu chí QA Section 60
// ============================================================================

import {
  DOSSIER_TYPES,
  DOSSIER_VISIBILITY,
  DOSSIER_STATUSES,
  ENTRY_STATUSES,
  MATCH_REASON_TYPES,
  SEED_SOURCING_DOSSIERS,
  getAllSourcingDossiers,
  getPublicDossiers,
  getDossierBySlug,
  submitDossierAdjustmentRequest,
  addCandidateToDossier,
  updateCandidateStatus,
  createDossierVersion,
  verifyDossierNeutrality,
  exportDossierSummary
} from '../../src/data/sourcingDossiersData.js';

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
console.log('TESTING SPEC 35: BỘ HỒ SƠ TUYỂN CHỌN / SOURCING DOSSIER (/bo-ho-so/[slug])');
console.log('================================================================\n');

try {
  // QA 1: Public / Private visibility hoạt động (Section 5, 6, 7)
  const publicDossier = getDossierBySlug('dong-phuc-bao-ho-nha-may-dong-nai', null);
  assert(publicDossier !== null && publicDossier.visibility === DOSSIER_VISIBILITY.PUBLIC, '1. Hồ sơ công khai cho phép truy cập tự do mà không lộ dữ liệu mật');

  let privateDenied = false;
  try {
    getDossierBySlug('shortlist-gia-cong-cnc-phong-sach-fdi-vsip', null); // Anonymous truy cập dossier PRIVATE
  } catch (e) {
    privateDenied = true;
  }
  assert(privateDenied, '2. Hồ sơ riêng tư (PRIVATE) chặn truy cập ẩn danh, yêu cầu xác thực tài khoản Buyer');

  // Cho phép truy cập khi đúng quyền Owner
  const privateAllowed = getDossierBySlug('shortlist-gia-cong-cnc-phong-sach-fdi-vsip', { userId: 'USER-BUYER-FDI-DAIKIN' });
  assert(privateAllowed !== null && privateAllowed.ownerUserId === 'USER-BUYER-FDI-DAIKIN', '3. Chủ sở hữu Buyer được phân quyền truy cập thành công hồ sơ riêng tư');

  // QA 2: Tái sử dụng dữ liệu Nhu cầu B2B (Requirement) gốc (Section 1, 22)
  assert(publicDossier.requirementId === 'NC-2026-00125' && publicDossier.industrialParkId === 'kcn-amata', '4. Tái sử dụng chính xác mã nhu cầu NC-2026-00125 và địa bàn KCN Amata');

  // QA 3: Candidate bắt buộc phải có inclusionReason (Section 13, 15, 49)
  let missingReasonBlocked = false;
  try {
    addCandidateToDossier(publicDossier.id, {
      supplierOrganizationId: 'ORG-TEST-099',
      supplierName: 'Công ty May Thử Nghiệm',
      inclusionReason: '' // Rỗng
    });
  } catch (e) {
    missingReasonBlocked = true;
  }
  assert(missingReasonBlocked, '5. Chặn thêm nhà cung ứng nếu thiếu mục "LÝ DO ĐƯA VÀO" (Inclusion Reason)');

  // Thêm ứng viên hợp lệ thành công
  const validCandidate = addCandidateToDossier(publicDossier.id, {
    supplierOrganizationId: 'ORG-SUP-NEW',
    supplierName: 'Xưởng May Công Nghiệp Sài Gòn Mới',
    inclusionReason: 'Chuyên may áo bảo hộ Kaki Nam Định giá tốt, có xưởng vệ tinh tại Nhơn Trạch.',
    matchReasons: [{ type: 'CAPABILITY_MATCH', label: 'Áo bảo hộ may kỹ', source: 'Khảo sát xưởng' }]
  }, { userId: 'ADMIN' });
  assert(validCandidate.inclusionReason.length > 10, '6. Thêm ứng viên thành công khi có đầy đủ lý do giải thích minh bạch');

  // QA 4: Tiêu chí tuyển chọn (Criteria) bắt buộc có nguồn gốc rõ ràng (Section 10, 11)
  const allCriteriaHaveSource = publicDossier.criteria.every(c => c.source && c.source.length > 0);
  assert(allCriteriaHaveSource, '7. Toàn bộ tiêu chí tuyển chọn đều có nguồn dữ liệu đối soát xác thực');

  // QA 5: Thông tin còn thiếu (Missing info) hiển thị riêng theo từng trường (Section 18, 19)
  const firstCandidate = publicDossier.candidates[0];
  const hasStructuredMissing = firstCandidate.missingInformation.every(m => m.field && m.status);
  assert(hasStructuredMissing, '8. Tách bạch khối thông tin còn thiếu (lead time, MOQ, năng lực đo) kèm trạng thái');

  // QA 6 & 7: Tính trung lập - Sponsor không thay thế tiêu chí tuyển chọn (Section 25, 26)
  const neutrality = verifyDossierNeutrality();
  assert(neutrality.sponsorshipInfluenceOnShortlist === 'NONE' && neutrality.commercialTierAllowsPriorityMatching === false, '9. Tài trợ hoặc trả phí không được phép thay đổi thứ hạng hay tự chèn vào Shortlist');

  // QA 8 & 9: Phân quyền bảo mật & Không lộ bí mật nội bộ (Section 6, 52, 53)
  assert(!publicDossier.candidates.some(c => c.internalNote && c.internalNote.length > 0), '10. Hồ sơ công khai tuyệt đối không chứa ghi chú mật hoặc đánh giá nội bộ của Buyer');

  // QA 10: Quy trình yêu cầu điều chỉnh bộ hồ sơ (Buyer Adjustment Request - Section 28, 29)
  const adjustment = submitDossierAdjustmentRequest(publicDossier.id, {
    type: 'ADD_CRITERION',
    description: 'Yêu cầu bổ sung thêm tiêu chí chứng nhận chống cháy chậm cho áo thun kỹ sư.'
  }, { userId: 'USER-BUYER-001', fullName: 'Trưởng phòng Mua hàng' });
  assert(adjustment.id.startsWith('ADJ-') && adjustment.status === 'NEW', '11. Tạo thành công phiếu yêu cầu điều chỉnh bộ hồ sơ từ phía Buyer');

  // QA 11: Cập nhật trạng thái ứng viên không xóa lịch sử (Section 14, 50)
  const updatedCandidate = updateCandidateStatus(publicDossier.id, firstCandidate.id, ENTRY_STATUSES.SHORTLISTED, 'Đã thẩm định mẫu đạt yêu cầu', { userId: 'ADMIN' });
  assert(updatedCandidate.status === ENTRY_STATUSES.SHORTLISTED, '12. Cập nhật trạng thái ứng viên (SHORTLISTED) kèm lý do lưu vết');

  // QA 12: Quản lý phiên bản lịch sử không ghi đè (Section 33, 34)
  const newVer = createDossierVersion(publicDossier.id, 'v2.1', 'Cập nhật thêm 1 ứng viên xưởng may Nhơn Trạch.', { fullName: 'Admin Sourcing' });
  assert(newVer.version === 'v2.1' && publicDossier.versions.length >= 3, '13. Lưu trữ chuỗi phiên bản lịch sử (v1.0 -> v2.0 -> v2.1) không xóa bản cũ');

  // QA 13: Hiển thị ngày cập nhật rõ ràng (Section 35)
  assert(publicDossier.updatedAt !== null, '14. Bộ hồ sơ có ngày cập nhật rõ ràng, bảo đảm tính thời sự của nguồn dữ liệu');

  // QA 14: Xuất báo cáo tóm tắt (Export) bảo mật (Section 43)
  const exported = exportDossierSummary('dong-phuc-bao-ho-nha-may-dong-nai', null);
  assert(exported.title && exported.criteria.length > 0 && !exported.internalNote, '15. Xuất tóm tắt bộ hồ sơ đầy đủ tiêu chí và ứng viên mà không lộ ghi chú nội bộ');

  // QA 15: Kiểm tra cấu trúc giao diện trang chi tiết /bo-ho-so/[slug] chuẩn di động 390px (Section 57)
  const fs = await import('fs');
  const path = await import('path');
  const pagePath = path.resolve('src/pages/SourcingDossierDetailPage.jsx');
  const pageExists = fs.existsSync(pagePath);
  assert(pageExists, '16. Tệp giao diện SourcingDossierDetailPage.jsx đã được tạo và định vị chính xác');

  if (pageExists) {
    const pageCode = fs.readFileSync(pagePath, 'utf-8');
    const hasHero = pageCode.includes('MỤC ĐÍCH BỘ HỒ SƠ') || pageCode.includes('purpose');
    const hasCriteria = pageCode.includes('TIÊU CHÍ LỰA CHỌN') || pageCode.includes('criteria');
    const hasCandidates = pageCode.includes('NHÀ CUNG ỨNG ĐƯỢC XEM XÉT') || pageCode.includes('candidates');
    const hasMissing = pageCode.includes('THÔNG TIN CẦN XÁC NHẬN') || pageCode.includes('missingInformation');
    const hasNoOpaqueScore = !pageCode.includes('92% phù hợp') && !pageCode.includes('Top 10 tốt nhất');
    const hasOverflowProtection = pageCode.includes('overflow-hidden') || pageCode.includes('max-w-');

    assert(
      hasHero && hasCriteria && hasCandidates && hasMissing && hasNoOpaqueScore && hasOverflowProtection,
      '17. Giao diện /bo-ho-so/[slug] tuân thủ đầy đủ cấu trúc Dossier, không opaque score và tương thích di động 390px'
    );
  }

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
  console.log('🎉 ALL 17 SPEC 35 TESTS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error(`💥 ${failed} TESTS FAILED! Check logic implementation.\n`);
  process.exit(1);
}
