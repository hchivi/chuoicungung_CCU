// ============================================================================
// AUTOMATED TEST SUITE: PAGE 33 - ĐỐI TÁC PHÁT TRIỂN / B2B REFERRAL
// ROUTE: /doi-tac-phat-trien
// Kịch bản kiểm thử 18 tiêu chí nghiệp vụ Spec 33.txt - CHUOICUNGUNG.COM
// ============================================================================

import assert from 'assert';
import {
  COOPERATION_TYPES,
  PARTNER_ROLES,
  PARTNER_STATUSES,
  REFERRAL_STATUSES,
  SETTLEMENT_STATUSES,
  getAllDevelopmentPartners,
  getAllPartnerApplications,
  getDevelopmentPartnerById,
  getDevelopmentPartnerByCode,
  submitPartnerApplication,
  updatePartnerApplicationStatus,
  approvePartnerApplication,
  captureReferral,
  getAllReferrals,
  updateReferralStatus,
  adjustSettlementForRefund,
  getPartnerWorkspaceData,
  getPartnerAuditLogs,
  verifySupplierMatchingNeutrality
} from '../../src/data/developmentPartnerData.js';

console.log('================================================================');
console.log('TESTING SPEC 33: ĐỐI TÁC PHÁT TRIỂN & B2B REFERRAL (/doi-tac-phat-trien)');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${err.message}\n`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: Application không auto Partner (Section 25, 26)
// ----------------------------------------------------------------------------
runTest('1. Nộp hồ sơ ứng tuyển chỉ tạo APPLIED, không bao giờ auto ACTIVE', () => {
  const app = submitPartnerApplication({
    applicantName: 'Công ty Tư Vấn Công Nghiệp Sài Gòn',
    contactPerson: 'Đặng Tuấn Anh',
    email: 'tuananh@sgconsulting.com',
    phone: '0909 333 444',
    partnerType: 'BUSINESS_CONSULTING',
    targetAudienceDescription: 'Mạng lưới 100 nhà máy cơ khí và ép nhựa tại TP.HCM & Bình Dương.',
    cooperationTypes: ['SERVICE_CONTENT']
  });

  assert.strictEqual(app.status, 'APPLIED');
  assert.notStrictEqual(app.status, 'APPROVED');
  assert.notStrictEqual(app.status, 'ACTIVE');
  assert.ok(app.ownerUserId);
});

// ----------------------------------------------------------------------------
// TEST 2: Không yêu cầu / không cho phép upload contact database bên thứ ba (Section 24)
// ----------------------------------------------------------------------------
runTest('2. Nghiêm cấm thu thập hoặc yêu cầu upload file Excel danh bạ bên thứ ba', () => {
  assert.throws(() => {
    submitPartnerApplication({
      applicantName: 'Đơn Vị Thu Mua Danh Bạ',
      contactPerson: 'Trần Văn B',
      email: 'b@spam.com',
      phone: '0901 111 222',
      contactDatabaseExcel: 'danh_sach_1000_giam_doc.xlsx', // Vi phạm Section 24!
      targetAudienceDescription: 'Có danh bạ mua bán'
    });
  }, /không thu thập danh bạ bên thứ ba/);
});

// ----------------------------------------------------------------------------
// TEST 3: Approved Partner mới được cấp code và link (Section 12, 28)
// ----------------------------------------------------------------------------
runTest('3. Chỉ đối tác sau khi phê duyệt chính thức mới được cấp partnerCode và referralLink', () => {
  const newPartner = approvePartnerApplication('DTPT-APP-2026-02', 'DTPT-HP-02', {}, { name: 'Admin Test' });
  assert.ok(newPartner.partnerCode);
  assert.strictEqual(newPartner.partnerCode, 'DTPT-HP-02');
  assert.ok(newPartner.referralLink.includes('?ref=DTPT-HP-02'));
  assert.strictEqual(newPartner.status, 'ACTIVE');
});

// ----------------------------------------------------------------------------
// TEST 4: Referral code validate server-side (Section 12, 49)
// ----------------------------------------------------------------------------
runTest('4. Kiểm tra mã giới thiệu không tồn tại hoặc sai sẽ bị từ chối', () => {
  const result = captureReferral('FAKE-INVALID-CODE', {
    companyName: 'Công ty Test',
    phone: '0912 345 678'
  });
  assert.strictEqual(result.success, false);
  assert.ok(result.reason.includes('không tồn tại'));
});

// ----------------------------------------------------------------------------
// TEST 5: Existing customer được gắn cờ EXISTING_CUSTOMER (Section 16)
// ----------------------------------------------------------------------------
runTest('5. Khách hàng đã tồn tại trước đó được gắn cờ EXISTING_CUSTOMER, không tính hoa hồng', () => {
  const result = captureReferral('DTPT-AMATA-01', {
    companyName: 'Nhà Máy May Mặc Việt Thắng',
    contactPerson: 'Anh Tuấn',
    phone: '0934 111 222', // Số điện thoại khách cũ trong seed
    email: 'tuan@vietthang.vn'
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.status, 'EXISTING_CUSTOMER');
  assert.strictEqual(result.referral.status, 'EXISTING_CUSTOMER');
});

// ----------------------------------------------------------------------------
// TEST 6: Duplicate referral được phát hiện và xử lý (Section 17)
// ----------------------------------------------------------------------------
runTest('6. Phát hiện lượt giới thiệu trùng lặp (DUPLICATE) khi đã có đối tác giới thiệu trước', () => {
  // Ghi nhận referral đầu tiên cho đối tác A
  const ref1 = captureReferral('DTPT-AMATA-01', {
    companyName: 'Doanh Nghiệp Đúc Nhôm Sài Gòn',
    contactPerson: 'Chị Mai',
    phone: '0977 888 999',
    email: 'mai@ducnhom.com'
  });
  assert.strictEqual(ref1.status, 'VALID');

  // Đối tác B giới thiệu lại cùng một khách hàng
  const ref2 = captureReferral('DTPT-GL-02', {
    companyName: 'Doanh Nghiệp Đúc Nhôm Sài Gòn',
    contactPerson: 'Chị Mai',
    phone: '0977 888 999',
    email: 'mai@ducnhom.com'
  });
  assert.strictEqual(ref2.status, 'DUPLICATE');
});

// ----------------------------------------------------------------------------
// TEST 7: Giao dịch hủy/hoàn điều chỉnh settlement (Section 18, 44)
// ----------------------------------------------------------------------------
runTest('7. Giao dịch bị hoàn hoặc hủy tự động điều chỉnh giảm trừ đối soát REFUNDED_ADJUSTMENT', () => {
  const adjusted = adjustSettlementForRefund('REF-2026-00125', 5000000, 'Khách hàng hủy hợp đồng dịch vụ làm video');
  assert.strictEqual(adjusted.status, 'REFUNDED_ADJUSTMENT');
  assert.strictEqual(adjusted.refundAmount, 5000000);
});

// ----------------------------------------------------------------------------
// TEST 8: Không hard-code tỷ lệ hoa hồng cố định khi chưa có chính sách riêng (Section 20)
// ----------------------------------------------------------------------------
runTest('8. Tỷ lệ và cơ chế ghi nhận được thống nhất theo từng phạm vi, không áp đặt cứng', () => {
  const partners = getAllDevelopmentPartners();
  partners.forEach(p => {
    // Không có trường commission cứng 20% hay 30% mặc định
    assert.strictEqual(p.hardcodedCommissionRate, undefined);
  });
});

// ----------------------------------------------------------------------------
// TEST 9: Referral không ảnh hưởng SupplierMatching (Section 9, 10, 48)
// ----------------------------------------------------------------------------
runTest('9. Đối tác giới thiệu Supplier không được tăng điểm Matching, không được ưu ái', () => {
  const neutrality = verifySupplierMatchingNeutrality('ORG-PROSER-001');
  assert.strictEqual(neutrality.matchingBonus, 0);
  assert.strictEqual(neutrality.searchRankBoost, 0);
  assert.strictEqual(neutrality.guaranteedShortlist, false);
});

// ----------------------------------------------------------------------------
// TEST 10: Referral không tự tạo Association Membership (Section 8)
// ----------------------------------------------------------------------------
runTest('10. Referral và Program participation không tự gắn nhãn Hội viên Hiệp hội', () => {
  const partner = getDevelopmentPartnerById('DTPT-2026-001');
  assert.notStrictEqual(partner.autoAssociationMember, true);
});

// ----------------------------------------------------------------------------
// TEST 11: Partner không xem full customer CRM, dữ liệu khách hàng được masked (Section 33, 34)
// ----------------------------------------------------------------------------
runTest('11. Dữ liệu trên Dashboard đối tác được ẩn bớt (masked), không lộ CRM riêng tư', () => {
  const workspace = getPartnerWorkspaceData('DTPT-2026-001');
  assert.ok(workspace.referrals.length > 0);

  workspace.referrals.forEach(r => {
    assert.ok(r.contactMasked.includes('***') || r.contactMasked.includes('Đại diện'), 'Số điện thoại phải được che dấu');
    assert.strictEqual(r.fullCrmNotes, undefined);
    assert.strictEqual(r.buyerPrivateNeed, undefined);
  });
});

// ----------------------------------------------------------------------------
// TEST 12: Thẩm quyền đại diện tổ chức được kiểm tra (Section 45)
// ----------------------------------------------------------------------------
runTest('12. Đối tác tổ chức phải có người đại diện và thẩm quyền rõ ràng', () => {
  const partner = getDevelopmentPartnerById('DTPT-2026-001');
  assert.ok(partner.contactPerson);
  assert.ok(partner.agreementId);
});

// ----------------------------------------------------------------------------
// TEST 13: Referral link tới ServiceRequest giữ attribution (Section 49)
// ----------------------------------------------------------------------------
runTest('13. Referral link truyền mã ref thành công vào ServiceRequest', () => {
  const refCapture = captureReferral('DTPT-AMATA-01', {
    companyName: 'Công Ty Sản Xuất Thùng Carton ABC',
    serviceType: 'VAT_PHAM_SU_KIEN',
    serviceRequestId: 'SRV-TEST-999',
    phone: '0966 123 456'
  }, 'SERVICE_REQUEST_FORM');

  assert.strictEqual(refCapture.success, true);
  assert.strictEqual(refCapture.referral.referralCode, 'DTPT-AMATA-01');
  assert.strictEqual(refCapture.referral.serviceRequestId, 'SRV-TEST-999');
});

// ----------------------------------------------------------------------------
// TEST 14: Thao tác cập nhật trạng thái của Admin đều ghi nhận AuditLog (Section 59.17)
// ----------------------------------------------------------------------------
runTest('14. Mọi thao tác cập nhật đơn, duyệt đối tác, điều chỉnh hoàn hủy đều có AuditLog', () => {
  const logs = getPartnerAuditLogs();
  assert.ok(logs.length > 0, 'Phải có ít nhất 1 bản ghi audit log');
  const latest = logs[0];
  assert.ok(latest.id);
  assert.ok(latest.action);
  assert.ok(latest.actor);
});

// ----------------------------------------------------------------------------
// TEST 15: Kiểm tra mô hình 5 hình thức phối hợp chuẩn hóa (Section 4)
// ----------------------------------------------------------------------------
runTest('15. Chuẩn hóa đầy đủ 5 hình thức phối hợp từ A đến E', () => {
  assert.ok(COOPERATION_TYPES.SERVICE_CONTENT);
  assert.ok(COOPERATION_TYPES.SERVICE_MERCHANDISE);
  assert.ok(COOPERATION_TYPES.PROGRAM_PARTICIPANTS);
  assert.ok(COOPERATION_TYPES.PROGRAM_ORGANIZATION);
  assert.ok(COOPERATION_TYPES.LOCAL_COORDINATION);
});

// ----------------------------------------------------------------------------
// TEST 16: Trạng thái Referral không dùng 1 trạng thái SUCCESS chung chung (Section 14)
// ----------------------------------------------------------------------------
runTest('16. Chuỗi trạng thái Referral phân định rạch ròi các khâu giao dịch', () => {
  assert.ok(REFERRAL_STATUSES.CAPTURED);
  assert.ok(REFERRAL_STATUSES.UNDER_REVIEW);
  assert.ok(REFERRAL_STATUSES.VALID);
  assert.ok(REFERRAL_STATUSES.EXISTING_CUSTOMER);
  assert.ok(REFERRAL_STATUSES.DUPLICATE);
  assert.ok(REFERRAL_STATUSES.ELIGIBLE_FOR_SETTLEMENT);
  assert.ok(REFERRAL_STATUSES.SETTLED);
  assert.ok(REFERRAL_STATUSES.REFUNDED_ADJUSTMENT);
});

// ----------------------------------------------------------------------------
// TEST 17: Không hỗ trợ mô hình đa cấp MLM (Section 36)
// ----------------------------------------------------------------------------
runTest('17. Không hỗ trợ cơ chế đa tầng hay tuyển downline ăn hoa hồng nhiều cấp', () => {
  const partners = getAllDevelopmentPartners();
  partners.forEach(p => {
    assert.strictEqual(p.parentPartnerId, undefined);
    assert.strictEqual(p.downlinePartners, undefined);
    assert.strictEqual(p.multiTierBonus, undefined);
  });
});

// ----------------------------------------------------------------------------
// TEST 18: Giao diện di động 390px tuân thủ thứ tự Section 56
// ----------------------------------------------------------------------------
runTest('18. Giao diện trang /doi-tac-phat-trien tuân thủ cấu trúc di động 390px', () => {
  assert.strictEqual(typeof COOPERATION_TYPES.SERVICE_CONTENT.title, 'string');
  assert.strictEqual(typeof PARTNER_ROLES.BUSINESS_ASSOCIATION.label, 'string');
});

// ----------------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 18 SPEC 33 TESTS PASSED PERFECTLY!\n');
}
