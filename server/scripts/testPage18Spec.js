// ============================================================================
// AUTOMATED QA TEST SUITE: PAGE 18 FOUNDING PARTNER SPEC
// Section 30 QA Checklist in 18.txt - CHUOICUNGUNG.COM
// ============================================================================

import {
  PARTNERSHIP_STATUSES,
  ENTITLEMENT_TYPES,
  ENTITLEMENT_STATUSES,
  getAllFoundingPartnerships,
  getActiveEligiblePartnership,
  checkScopeConflict,
  submitFoundingPartnershipInquiry,
  updateFoundingPartnershipStatus,
  updateEntitlementDelivery,
  renewFoundingPartnership,
  getAllFoundingAuditLogs,
  logFoundingAudit
} from '../../src/data/foundingPartnershipData.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${details}`);
    failed++;
  }
}

console.log('====================================================================');
console.log('🧪 RUNNING PAGE 18 (FOUNDING PARTNER) AUTOMATED TEST SUITE');
console.log('====================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Submit chỉ tạo Inquiry (Section 11, 13, 30.1)
// ----------------------------------------------------------------------------
const testInquiryData = {
  companyName: 'Công Ty May Mặc Mẫu Test QA',
  contactName: 'Nguyễn Văn Test',
  contactEmail: 'test@company.com',
  contactPhone: '0912345678',
  categoryId: 'dong-phuc-bao-ho-lao-dong',
  keywordClusterId: 'cluster-dong-phuc-cong-nhan',
  locationName: 'Hà Nội',
  expectedDuration: '12_MONTHS'
};

const submissionRes = submitFoundingPartnershipInquiry(testInquiryData);
assert(
  submissionRes.success && submissionRes.inquiry && submissionRes.inquiry.status === 'INQUIRY',
  '1. Submit chỉ tạo Inquiry',
  `Actual status: ${submissionRes.inquiry?.status}`
);

// ----------------------------------------------------------------------------
// TEST 2: Inquiry không tự thành Active Partner (Section 11, 13, 30.2)
// ----------------------------------------------------------------------------
const activeCheck = getActiveEligiblePartnership({
  categoryId: 'dong-phuc-bao-ho-lao-dong',
  keywordClusterId: 'cluster-dong-phuc-cong-nhan',
  locationId: 'ha-noi'
});
assert(
  activeCheck?.id !== submissionRes.inquiry.id,
  '2. Inquiry không tự thành Active Partner (Chờ duyệt và ký hợp đồng)',
  `Active partner matched newly created inquiry ID: ${activeCheck?.id}`
);

// ----------------------------------------------------------------------------
// TEST 3: Partnership phải có scope rõ (Section 4, 30.3)
// ----------------------------------------------------------------------------
const allPartners = getAllFoundingPartnerships();
const hasScope = allPartners.every(p => {
  return p.id && (p.categoryId || p.keywordClusterId) && p.partnerName;
});
assert(
  hasScope,
  '3. Partnership phải có scope rõ (Category, Keyword Cluster, Name)',
  'Một số đối tác thiếu thông tin phạm vi cốt lõi'
);

// ----------------------------------------------------------------------------
// TEST 4: Keyword synonym không bán thành scope duplicate (Section 5, 30.4)
// ----------------------------------------------------------------------------
const partner1 = getActiveEligiblePartnership({ keyword: 'đồng phục công nhân' });
const partner2 = getActiveEligiblePartnership({ keyword: 'áo công nhân nhà máy' });
const partner3 = getActiveEligiblePartnership({ keyword: 'đồng phục nhà xưởng' });

assert(
  partner1 && partner2 && partner3 && partner1.id === partner2.id && partner2.id === partner3.id,
  '4. Keyword synonym map vào cùng 1 Keyword Cluster & cùng 1 Founding Partner',
  `P1: ${partner1?.id}, P2: ${partner2?.id}, P3: ${partner3?.id}`
);

// ----------------------------------------------------------------------------
// TEST 5: Conflict checker phát hiện overlap (Section 14, 30.5)
// ----------------------------------------------------------------------------
const conflictTest = checkScopeConflict({
  categoryId: 'dong-phuc-bao-ho-lao-dong',
  keywordClusterId: 'cluster-dong-phuc-cong-nhan',
  locationId: 'dong-nai',
  startDate: '2026-06-01',
  endDate: '2026-12-31'
});
assert(
  conflictTest.hasConflict && conflictTest.status === 'SCOPE_CONFLICT',
  '5. Conflict checker phát hiện overlap (SCOPE_CONFLICT)',
  `Conflict result: ${JSON.stringify(conflictTest)}`
);

// ----------------------------------------------------------------------------
// TEST 6: Expired partnership tự dừng paid placement (Section 9, 24, 30.6)
// ----------------------------------------------------------------------------
const expiredSearch = getActiveEligiblePartnership({
  categoryId: 'co-dien-mep',
  keywordClusterId: 'cluster-mep-nha-xuong'
});
assert(
  expiredSearch === null,
  '6. Expired partnership tự dừng paid placement (currentDate > endDate trả về null)',
  `Expected null but found: ${expiredSearch?.id}`
);

// ----------------------------------------------------------------------------
// TEST 7: Partner không ảnh hưởng Supplier Matching (Section 8, 30.7)
// ----------------------------------------------------------------------------
const nonInfluenceMatching = allPartners.every(p => {
  return p.matchingBoostMultiplier === undefined && p.autoRankFirst === undefined;
});
assert(
  nonInfluenceMatching,
  '7. Partner không ảnh hưởng Supplier Matching Score hay thứ tự xếp hạng thuật toán'
);

// ----------------------------------------------------------------------------
// TEST 8: Partner không tự #1 organic search (Section 8, 30.8)
// ----------------------------------------------------------------------------
const verifiedDistinctPosition = allPartners.filter(p => p.status === 'ACTIVE').every(p => {
  return p.displayPosition !== 'ORGANIC_SEARCH_FIRST' && p.displayPosition.includes('SPONSORED_BLOCK');
});
assert(
  verifiedDistinctPosition,
  '8. Partner không tự #1 organic search (chỉ hiển thị tại khối SPONSORED_BLOCK)'
);

// ----------------------------------------------------------------------------
// TEST 9: Partner không nhận Buyer private data (Section 8, 19, 30.9)
// ----------------------------------------------------------------------------
const noPrivateDataLeak = allPartners.every(p => {
  return !p.buyerPrivateLeads && !p.buyerPrivateNotes && !p.confidentialDocuments;
});
assert(
  noPrivateDataLeak,
  '9. Partner không nhận Buyer private data / lead bảo mật'
);

// ----------------------------------------------------------------------------
// TEST 10: Label “ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC” luôn hiển thị (Section 7, 30.10)
// ----------------------------------------------------------------------------
const sampleActive = allPartners.find(p => p.status === 'ACTIVE');
assert(
  sampleActive && sampleActive.displayPosition && sampleActive.brandTitle,
  '10. Label "ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC" luôn được quy chuẩn định danh rõ'
);

// ----------------------------------------------------------------------------
// TEST 11: Category/Keyword page vẫn hoạt động khi không có Partner (Section 20, 30.11)
// ----------------------------------------------------------------------------
const nonSponsorResult = getActiveEligiblePartnership({
  categoryId: 'nganh-khong-co-sponsor-12345',
  categorySlug: 'nganh-khong-co-sponsor-12345'
});
assert(
  nonSponsorResult === null,
  '11. Category/Keyword page trả về null an toàn khi không có Partner (không crash trang)'
);

// ----------------------------------------------------------------------------
// TEST 12: Entitlement có owner/status/evidence (Section 17, 18, 30.12)
// ----------------------------------------------------------------------------
const activeWithEnts = allPartners.find(p => p.status === 'ACTIVE' && p.entitlements?.length > 0);
const validEnts = activeWithEnts?.entitlements.every(e => e.type && e.status && e.ownerUserId && Array.isArray(e.evidence));
assert(
  validEnts,
  '12. Entitlement có owner/status/evidence minh bạch'
);

// ----------------------------------------------------------------------------
// TEST 13: Contract history không bị overwrite khi renewal (Section 24, 30.13)
// ----------------------------------------------------------------------------
const renewalRes = renewFoundingPartnership({
  partnershipId: 'FP-2026-001',
  newStartDate: '2027-01-01',
  newEndDate: '2027-12-31',
  newContractNumber: 'HD-FP-2027-099',
  newContractValue: '150.000.000 VNĐ'
});
assert(
  renewalRes.success && renewalRes.partner.historicalContracts?.length > 0,
  '13. Contract history không bị overwrite khi renewal (lưu vào historicalContracts)'
);

// ----------------------------------------------------------------------------
// TEST 14: Founding Partner không được coi là investor/equity (Section 16, 25, 30.14)
// ----------------------------------------------------------------------------
const commercialOnly = allPartners.filter(p => p.contract).every(p => {
  return p.contract.isEquityOrInvestment === false && p.contract.commercialType === 'COMMERCIAL_SPONSORSHIP_PACKAGE';
});
assert(
  commercialOnly,
  '14. Founding Partner là gói thương mại, không được coi là investor/equity hay cổ phần'
);

// ----------------------------------------------------------------------------
// TEST 15: Admin mutations tạo AuditLog (Section 22, 23, 30.15)
// ----------------------------------------------------------------------------
const auditLogs = getAllFoundingAuditLogs();
assert(
  auditLogs.length > 0 && auditLogs.some(log => log.action === 'FOUNDING_INQUIRY_SUBMITTED' || log.action === 'PARTNERSHIP_RENEWED'),
  '15. Admin mutations và Inquiry submission tự động tạo AuditLog'
);

// ----------------------------------------------------------------------------
// TEST 16: Delivery Tracking & Bằng chứng nghiệm thu (Section 17, 18, 30.16)
// ----------------------------------------------------------------------------
const deliveryRes = updateEntitlementDelivery({
  partnershipId: 'FP-2026-001',
  entitlementId: 'ent-001-4',
  status: 'DELIVERED',
  deliveredQuantity: 4,
  evidenceItem: { title: 'Báo cáo tổng kết năm 2026 PDF', url: '/reports/fp-proser-annual-2026.pdf' }
});
assert(
  deliveryRes.success,
  '16. Cập nhật delivery tracking và đính kèm evidence thành công'
);

console.log('\n====================================================================');
console.log(`🏁 TEST RESULTS: ${passed} PASSED / ${failed} FAILED`);
console.log('====================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 16 PAGE 18 SPEC CRITERIA PASSED SUCCESSFULLY!');
  process.exit(0);
}
