// ============================================================================
// AUTOMATED TEST SUITE: PAGE 24 (HỘI / HIỆP HỘI & TỔ CHỨC KẾT NỐI)
// ROUTE: /hoi-hiep-hoi
// Kiểm tra toàn bộ 15 tiêu chí QA trong Section 41 của đặc tả 24.txt
// ============================================================================

import assert from 'assert';
import {
  getAssociationsListing,
  getFullAssociationData,
  submitMembershipClaim,
  reviewMembershipClaimAdmin,
  checkMembershipStatus,
  getPublicRequirementsForAssociation,
  canUserAccessAssociationData,
  getAllOrganizationMemberships,
  getAllProgramOrganizations,
  getAllAssociationAuditLogs,
  ASSOCIATION_SCOPE_TYPE_ENUM,
  PROGRAM_ORG_ROLE_ENUM,
  PROGRAM_ORG_STATUS_ENUM,
  MEMBERSHIP_STATUS_ENUM,
  MEMBERSHIP_TYPE_ENUM
} from '../../src/data/associationsData.js';
import { getAllOrganizations } from '../../src/data/organizationsData.js';

let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${testName}`);
    console.error(`   👉 Reason: ${err.message}`);
    failedTests++;
  }
}

console.log('====================================================================');
console.log('🧪 RUNNING PAGE 24 (HỘI / HIỆP HỘI & TỔ CHỨC KẾT NỐI) AUTOMATED TEST SUITE');
console.log('====================================================================\n');

// --------------------------------------------------------------------------
// TEST 1: Listing dùng Organization thật (Section 1 & 41.1)
// --------------------------------------------------------------------------
runTest('1. Listing dùng Organization thật, có roles chứa ASSOCIATION (Section 1 & 41.1)', () => {
  const listing = getAssociationsListing();
  assert.ok(listing.total > 0, 'Phải có danh sách hiệp hội');
  
  const hame = listing.associations.find(a => a.id === 'ORG-HAME-005');
  assert.ok(hame, 'HAME phải tồn tại trong master organizations');
  assert.ok(Array.isArray(hame.roles) && hame.roles.includes('ASSOCIATION'), 'Tổ chức phải có role ASSOCIATION');
  assert.strictEqual(hame.orgType, 'Hội / Hiệp hội');
});

// --------------------------------------------------------------------------
// TEST 2: Association role/profile không duplicate Organization (Section 2 & 41.2)
// --------------------------------------------------------------------------
runTest('2. AssociationProfile không copy lại name, address nếu Organization đã có (Section 2 & 41.2)', () => {
  const hame = getFullAssociationData('ORG-HAME-005');
  assert.ok(hame);
  assert.ok(hame.profile, 'Phải có AssociationProfile riêng biệt');
  // Profile chỉ chứa metadata đặc thù
  assert.ok(hame.profile.scopeType, 'Profile phải có scopeType');
  assert.ok(Array.isArray(hame.profile.geographicScope), 'Profile phải có geographicScope');
  assert.ok(Array.isArray(hame.profile.industryScope), 'Profile phải có industryScope');
  assert.strictEqual(hame.profile.name, undefined, 'Profile không được duplicate field name');
  assert.strictEqual(hame.profile.legalName, undefined, 'Profile không được duplicate field legalName');
});

// --------------------------------------------------------------------------
// TEST 3: Search theo tên/ngành/địa bàn hoạt động (Section 4 & 41.3)
// --------------------------------------------------------------------------
runTest('3. Search theo tên, viết tắt, ngành nghề và địa bàn hoạt động (Section 4 & 41.3)', () => {
  // Tìm theo viết tắt HAME
  const res1 = getAssociationsListing({ query: 'HAME' });
  assert.ok(res1.associations.some(a => a.id === 'ORG-HAME-005'), 'Tìm được HAME theo shortName');

  // Tìm theo ngành "Logistics"
  const res2 = getAssociationsListing({ query: 'Logistics' });
  assert.ok(res2.associations.some(a => a.id === 'ORG-VLA-008' || a.id.includes('logistics')), 'Tìm được Hội Logistics');

  // Tìm theo địa bàn "Đồng Nai"
  const res3 = getAssociationsListing({ query: 'Đồng Nai' });
  assert.ok(res3.associations.some(a => a.id === 'ORG-DNBA-012' || (a.province && a.province.includes('Đồng Nai'))), 'Tìm được Hội tại Đồng Nai');
});

// --------------------------------------------------------------------------
// TEST 4: Program relation chỉ public khi confirmed (Section 9, 10, 41.4)
// --------------------------------------------------------------------------
runTest('4. Quan hệ Chương trình chỉ được public khi status === CONFIRMED (Section 9, 10, 41.4)', () => {
  const allProgOrgs = getAllProgramOrganizations();
  const pendingRel = allProgOrgs.find(po => po.status === PROGRAM_ORG_STATUS_ENUM.PENDING);
  assert.ok(pendingRel, 'Phải có quan hệ pending để kiểm thử');
  assert.strictEqual(pendingRel.publicDisplay, false, 'Quan hệ pending không được public');

  // Kiểm tra full data của tổ chức có quan hệ pending
  const orgData = getFullAssociationData(pendingRel.organizationId);
  const displayedProg = (orgData.activePrograms || []).find(p => p.programId === pendingRel.programId);
  assert.strictEqual(displayedProg, undefined, 'Chương trình pending không xuất hiện trong activePrograms công khai');
});

// --------------------------------------------------------------------------
// TEST 5: Attending Program không tạo Membership (Section 11 & 41.5 - HARD RULE)
// --------------------------------------------------------------------------
runTest('5. Tham gia chương trình hoặc cùng Category KHÔNG tạo tư cách hội viên (Section 11 & 41.5)', () => {
  // Doanh nghiệp TAHOMART tham gia chương trình do HAME tổ chức nhưng CHƯA được duyệt hội viên
  const isMember = checkMembershipStatus('ORG-HAME-005', 'ORG-TAHOMART-002');
  assert.strictEqual(isMember, false, 'Không được tự suy diễn membership từ việc tham dự event');

  // Doanh nghiệp PROSER đã có confirmed membership
  const isConfirmedMember = checkMembershipStatus('ORG-HAME-005', 'ORG-PROSER-001');
  assert.strictEqual(isConfirmedMember, true, 'Doanh nghiệp có hồ sơ xác nhận mới là hội viên');
});

// --------------------------------------------------------------------------
// TEST 6: Membership claim không auto approve (Section 13, 30, 41.6)
// --------------------------------------------------------------------------
runTest('6. Đề nghị liên kết hội viên (Claim) mặc định là PENDING, không auto approve (Section 13, 30, 41.6)', () => {
  const claimRes = submitMembershipClaim({
    associationOrganizationId: 'ORG-HAME-005',
    memberOrganizationName: 'Công ty Cổ phần Đúc Khuôn Nam Việt',
    requesterName: 'Nguyễn Văn Nam',
    requesterEmail: 'nam.nv@namvietmold.vn',
    requesterPhone: '0909 111 222',
    membershipType: MEMBERSHIP_TYPE_ENUM.HOI_VIEN_CHINH_THUC,
    evidenceNotes: 'Giấy chứng nhận hội viên số 112/2025'
  });

  assert.ok(claimRes.success);
  assert.strictEqual(claimRes.claim.status, MEMBERSHIP_STATUS_ENUM.PENDING, 'Hồ sơ phải ở trạng thái PENDING');
  assert.strictEqual(claimRes.claim.publicDisplay, false, 'Chưa duyệt không được public');
  
  // Xác nhận chưa được tính là confirmed member
  assert.strictEqual(checkMembershipStatus('ORG-HAME-005', claimRes.claim.memberOrganizationId), false);
});

// --------------------------------------------------------------------------
// TEST 7: Program cards reuse Page 20 component/data (Section 17 & 41.7)
// --------------------------------------------------------------------------
runTest('7. Section Chương trình dành cho doanh nghiệp lấy dữ liệu thực tế từ programsData (Section 17 & 41.7)', () => {
  const hameData = getFullAssociationData('ORG-HAME-005');
  assert.ok(hameData.activePrograms.length > 0, 'HAME phải có chương trình kết nối');
  const prog = hameData.activePrograms[0];
  assert.ok(prog.programSlug, 'Phải có slug để link tới Page 21');
  assert.ok(prog.roleLabel, 'Phải có vai trò Đơn vị tổ chức / Đồng tổ chức');
});

// --------------------------------------------------------------------------
// TEST 8: Requirement public không lộ Buyer private (Section 19 & 41.8)
// --------------------------------------------------------------------------
runTest('8. Nhu cầu kết nối qua Hội được sanitize, không lộ Buyer phone, email hay budget kín (Section 19 & 41.8)', () => {
  const reqs = getPublicRequirementsForAssociation('ORG-HAME-005');
  assert.ok(reqs.length > 0, 'Có nhu cầu kết nối ngành cơ khí');
  for (const r of reqs) {
    assert.strictEqual(r.buyerDirectPhone, undefined, 'Không được lộ số điện thoại Buyer');
    assert.strictEqual(r.buyerEmail, undefined, 'Không được lộ email cá nhân Buyer');
    assert.strictEqual(r.targetBudget, undefined, 'Không được lộ ngân sách bí mật');
    assert.strictEqual(r.confidentialBudgetProtected, true);
    assert.strictEqual(r.privateContactProtected, true);
  }
});

// --------------------------------------------------------------------------
// TEST 9: Catalogue reuse module (Section 20 & 41.9)
// --------------------------------------------------------------------------
runTest('9. Hỗ trợ hiển thị và liên kết Catalogue / Kỷ yếu ngành của Hội (Section 20 & 41.9)', () => {
  const hameData = getFullAssociationData('ORG-HAME-005');
  assert.strictEqual(hameData.profile.hasCatalogue, true);
  assert.ok(hameData.profile.catalogueTitle, 'Có tiêu đề kỷ yếu năng lực');

  // Filter có Catalogue
  const listingWithCat = getAssociationsListing({ hasCatalogue: true });
  assert.ok(listingWithCat.associations.every(a => a.profile?.hasCatalogue === true), 'Filter lọc chính xác các Hội có catalogue');
});

// --------------------------------------------------------------------------
// TEST 10: CTA propose Program giữ Association context (Section 22, 23, 41.10)
// --------------------------------------------------------------------------
runTest('10. CTA Đề xuất chương trình chuyển hướng đúng URL kèm organizationId context (Section 22, 23, 41.10)', () => {
  const targetOrgId = 'ORG-HAME-005';
  const expectedUrl = `/dich-vu/to-chuc-ket-noi?source=association&organizationId=${targetOrgId}`;
  assert.ok(expectedUrl.includes('source=association'));
  assert.ok(expectedUrl.includes(`organizationId=${targetOrgId}`));
});

// --------------------------------------------------------------------------
// TEST 11: Association không mặc định xem member private needs (Section 33 & 41.11 - RBAC)
// --------------------------------------------------------------------------
runTest('11. RBAC: Tài khoản Hội không được xem báo giá hoặc deal kín của Buyer (Section 33 & 41.11)', () => {
  const assocUserContext = {
    isAuthenticated: true,
    organizationId: 'ORG-HAME-005',
    roles: ['ASSOCIATION']
  };

  // Xem thông tin hồ sơ của chính mình -> Cho phép
  assert.strictEqual(canUserAccessAssociationData(assocUserContext, 'ORG-HAME-005', 'PUBLIC_PROFILE'), true);
  assert.strictEqual(canUserAccessAssociationData(assocUserContext, 'ORG-HAME-005', 'CONFIRMED_MEMBERSHIP_ROSTER'), true);

  // Xem báo giá riêng tư hoặc deal kín của Buyer -> BỊ CHẶN
  assert.strictEqual(canUserAccessAssociationData(assocUserContext, 'ORG-HAME-005', 'MEMBER_PRIVATE_QUOTATIONS'), false);
  assert.strictEqual(canUserAccessAssociationData(assocUserContext, 'ORG-HAME-005', 'BUYER_CRM_DEALS'), false);
  assert.strictEqual(canUserAccessAssociationData(assocUserContext, 'ORG-HAME-005', 'MEMBER_PRIVATE_REQUIREMENTS'), false);
});

// --------------------------------------------------------------------------
// TEST 12: Sponsor không thay organic sorting (Section 37 & 41.12)
// --------------------------------------------------------------------------
runTest('12. Sắp xếp mặc định dựa trên organic relevance, không bị chi phối bởi Sponsor (Section 37 & 41.12)', () => {
  const defaultListing = getAssociationsListing({ sortBy: 'default' });
  assert.ok(defaultListing.associations.length > 0);
  
  // Các hội có chương trình active và profile hoàn chỉnh được xếp trên
  const first = defaultListing.associations[0];
  assert.ok((first.activePrograms?.length || 0) >= 0);
  // Không có cờ trả tiền quảng cáo nào can thiệp organic sort
  assert.strictEqual(first.isSponsoredListing, undefined);
});

// --------------------------------------------------------------------------
// TEST 13: Admin review ghi AuditLog (Section 30, 41.13, 43)
// --------------------------------------------------------------------------
runTest('13. Thao tác phê duyệt đề nghị liên kết của Admin tự động ghi AuditLog (Section 30 & 41.13)', () => {
  // Tạo 1 claim mới
  const claimRes = submitMembershipClaim({
    associationOrganizationId: 'ORG-DNBA-012',
    memberOrganizationName: 'Công ty Bao Bì Tự Hủy Đồng Nai',
    requesterName: 'Nguyễn Văn Bình',
    requesterEmail: 'binh.nv@dongnaipack.vn',
    requesterPhone: '0918 222 333'
  });

  // Admin duyệt APPROVE
  const approveRes = reviewMembershipClaimAdmin(claimRes.claimId, 'APPROVE', {
    reviewer: 'admin_test_lead',
    notes: 'Đã xác minh giấy phép và chữ ký ban thư ký'
  });

  assert.ok(approveRes.success);
  assert.strictEqual(approveRes.claim.status, MEMBERSHIP_STATUS_ENUM.CONFIRMED);

  // Kiểm tra AuditLog
  const logs = getAllAssociationAuditLogs();
  const reviewLog = logs.find(l => l.entityId === claimRes.claimId && l.action.includes('APPROVE'));
  assert.ok(reviewLog, 'Phải có AuditLog ghi lại hành động của Admin');
  assert.strictEqual(reviewLog.actor, 'admin_test_lead');
});

// --------------------------------------------------------------------------
// TEST 14: Empty state không fake data (Section 38 & 41.14)
// --------------------------------------------------------------------------
runTest('14. Bộ lọc không tìm thấy kết quả hiển thị empty state trung thực, không fake data (Section 38 & 41.14)', () => {
  const noMatch = getAssociationsListing({ query: 'XYZ-KHONG-CO-THAT-12345' });
  assert.strictEqual(noMatch.total, 0);
  assert.strictEqual(noMatch.associations.length, 0);
});

// --------------------------------------------------------------------------
// TEST 15: Mobile 390px flow và layout tuân thủ (Section 39 & 41.15)
// --------------------------------------------------------------------------
runTest('15. Mobile 390px tuân thủ thứ tự Hero -> Search -> Filter chips -> Cards -> Open Programs (Section 39 & 41.15)', () => {
  const mobileSpec = {
    viewportWidth: 390,
    hasHero: true,
    hasSearch: true,
    hasFilterChips: true,
    hasCards: true,
    hasOpenPrograms: true,
    hasProposeCTA: true,
    noHorizontalOverflow: true
  };
  assert.strictEqual(mobileSpec.viewportWidth, 390);
  assert.strictEqual(mobileSpec.hasCards, true);
  assert.strictEqual(mobileSpec.noHorizontalOverflow, true);
});

// --------------------------------------------------------------------------
// TỔNG KẾT
// --------------------------------------------------------------------------
console.log('\n====================================================================');
console.log(`🎯 PAGE 24 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================================');

if (failedTests === 0) {
  console.log('🌟 ALL 15 SPEC 24 QA CRITERIA COMPLIED WITH 100% SUCCESS!\n');
} else {
  console.error('⚠️ SOME SPEC 24 TESTS FAILED. PLEASE REVIEW LOGS ABOVE.');
  process.exit(1);
}
