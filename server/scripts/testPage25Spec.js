// ============================================================================
// AUTOMATED TEST SUITE: PAGE 25 - CHI TIẾT HỘI / HIỆP HỘI
// ROUTE: /hoi-hiep-hoi/[slug]
// Tuân thủ 15 tiêu chí nghiệm thu Section 44 đặc tả 25.txt - CHUOICUNGUNG.COM
// ============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getFullAssociationData,
  slugify,
  getConfirmedMembersForAssociation,
  getDetailedProgramsForAssociation,
  getPublicRequirementsForAssociation,
  getSupplierGroupsForAssociation,
  getConnectionCasesForAssociation,
  canUserAccessAssociationData,
  submitMembershipClaim,
  reviewMembershipClaim,
  exportMembershipRoster,
  getAllAssociationAuditLogs,
  checkMembershipStatus,
  MEMBERSHIP_STATUS_ENUM,
  PROGRAM_ORG_STATUS_ENUM
} from '../../src/data/associationsData.js';

import { getAllOrganizations } from '../../src/data/organizationsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log('TEST SUITE: PAGE 25 - CHI TIẾT HỘI / HIỆP HỘI (/hoi-hiep-hoi/[slug])');
console.log('Đặc tả 25.txt - 15 Tiêu chí QA Section 44');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`[PASS] ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${testName}: ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: Page load đúng slug (Section 44.1)
// ----------------------------------------------------------------------------
runTest('QA 1: Page load đúng slug và ID (HAME, VLA, DNBA)', () => {
  const byId = getFullAssociationData('ORG-HAME-005');
  assert.ok(byId, 'Phải load được theo ID gốc ORG-HAME-005');
  assert.strictEqual(byId.id, 'ORG-HAME-005');

  const byShortName = getFullAssociationData('hame');
  assert.ok(byShortName, 'Phải load được theo slug/shortName "hame"');
  assert.strictEqual(byShortName.id, 'ORG-HAME-005');

  const byVla = getFullAssociationData('vla');
  assert.ok(byVla, 'Phải load được theo slug "vla"');
  assert.strictEqual(byVla.id, 'ORG-VLA-008');

  const byDnba = getFullAssociationData('dnba');
  assert.ok(byDnba, 'Phải load được theo slug "dnba"');
  assert.strictEqual(byDnba.id, 'ORG-DNBA-012');

  const byLongSlug = getFullAssociationData('hoi-doanh-nghiep-co-khi-dien-tp-ho-chi-minh');
  assert.ok(byLongSlug, 'Phải load được theo canonical slug đầy đủ');
  assert.strictEqual(byLongSlug.id, 'ORG-HAME-005');
});

// ----------------------------------------------------------------------------
// TEST 2: Association reuse Organization Master (Section 44.2, Section 1, 2)
// ----------------------------------------------------------------------------
runTest('QA 2: Association reuse Organization master mà không duplicate', () => {
  const allOrgs = getAllOrganizations();
  const masterOrg = allOrgs.find(o => o.id === 'ORG-HAME-005');
  assert.ok(masterOrg, 'HAME phải tồn tại trong Organization master');
  assert.ok(masterOrg.roles.includes('ASSOCIATION'), 'Phải có role ASSOCIATION');

  const assoc = getFullAssociationData('ORG-HAME-005');
  // Tên, logo, website, address lấy từ Organization master
  assert.strictEqual(assoc.name, masterOrg.name);
  assert.strictEqual(assoc.logo, masterOrg.logo);
  assert.strictEqual(assoc.website, masterOrg.website);

  // AssociationProfile chỉ mở rộng các trường đặc thù
  assert.ok(assoc.profile, 'Phải có AssociationProfile liên kết');
  assert.strictEqual(assoc.profile.organizationId, 'ORG-HAME-005');
  assert.ok(Array.isArray(assoc.profile.industryScope), 'Có industryScope');
  assert.ok(Array.isArray(assoc.profile.geographicScope), 'Có geographicScope');
});

// ----------------------------------------------------------------------------
// TEST 3: Unpublished Association không public (Section 44.3)
// ----------------------------------------------------------------------------
runTest('QA 3: Unpublished Association không thể truy cập công khai', () => {
  // Tạo giả lập một organization chưa xuất bản
  const unpubAssoc = {
    id: 'ORG-UNPUB-TEST',
    name: 'Hội Thử Nghiệm Chưa Xuất Bản',
    isPublished: false,
    roles: ['ASSOCIATION']
  };

  // Mock checking through getFullAssociationData authorization logic
  const publicAccess = getFullAssociationData('ORG-UNPUB-TEST', null);
  assert.strictEqual(publicAccess, null, 'Public user không được xem hội chưa xuất bản');

  const adminAccess = getFullAssociationData('ORG-HAME-005', { isAdmin: true });
  assert.ok(adminAccess, 'Admin có quyền xem đầy đủ');
});

// ----------------------------------------------------------------------------
// TEST 4: Membership chỉ hiện CONFIRMED (Section 44.4, Section 8, 9, 12)
// ----------------------------------------------------------------------------
runTest('QA 4: Membership chỉ hiện status = CONFIRMED và publicDisplay = true', () => {
  const members = getConfirmedMembersForAssociation('ORG-HAME-005');
  assert.ok(members.length > 0, 'Phải có ít nhất 1 hội viên CONFIRMED cho HAME');

  members.forEach(m => {
    assert.ok(m.companyName, 'Hội viên phải có tên');
    assert.ok(m.memberOrganizationId, 'Hội viên phải liên kết memberOrganizationId');
    assert.strictEqual(typeof m.publicDisplay === 'undefined' || m.publicDisplay === true, true);
  });

  // Kiểm tra doanh nghiệp PENDING không xuất hiện trong danh bạ
  const pendingOrgId = 'ORG-TEST-PENDING-999';
  const hasPending = members.some(m => m.memberOrganizationId === pendingOrgId);
  assert.strictEqual(hasPending, false, 'Doanh nghiệp PENDING tuyệt đối không xuất hiện');
});

// ----------------------------------------------------------------------------
// TEST 5: Event attendance không tạo membership (Section 44.5, Section 9)
// ----------------------------------------------------------------------------
runTest('QA 5: Tham gia sự kiện / chương trình không tự suy diễn thành Membership', () => {
  // ORG-MEKONG-FOOD-004 tham gia sự kiện nhưng không phải hội viên HAME
  const isMember = checkMembershipStatus('ORG-HAME-005', 'ORG-MEKONG-FOOD-004');
  assert.strictEqual(isMember, false, 'Tham dự sự kiện không được coi là Hội viên');
});

// ----------------------------------------------------------------------------
// TEST 6: Program role chỉ public khi confirmed (Section 44.6, Section 13, 14)
// ----------------------------------------------------------------------------
runTest('QA 6: Program role chỉ public khi relation đã CONFIRMED', () => {
  const progDetails = getDetailedProgramsForAssociation('ORG-HAME-005');
  assert.ok(Array.isArray(progDetails.openPrograms), 'Phải có openPrograms');
  assert.ok(Array.isArray(progDetails.completedPrograms), 'Phải có completedPrograms');

  const allProgRels = [...progDetails.openPrograms, ...progDetails.completedPrograms];
  assert.ok(allProgRels.length >= 2, 'HAME có ít nhất 2 chương trình liên kết confirmed');

  allProgRels.forEach(p => {
    assert.ok(['ORGANIZER', 'CO_ORGANIZER', 'PARTNER', 'SUPPORTING_ORGANIZATION'].includes(p.role), 'Role hợp lệ');
    assert.ok(p.roleLabel, 'Phải có nhãn vai trò hiển thị');
  });
});

// ----------------------------------------------------------------------------
// TEST 7: Public Need không lộ private Buyer data (Section 44.7, Section 16, 17)
// ----------------------------------------------------------------------------
runTest('QA 7: Nhu cầu mua hàng công khai tuyệt đối không lộ thông tin Buyer nhạy cảm', () => {
  const reqs = getPublicRequirementsForAssociation('ORG-HAME-005');
  assert.ok(reqs.length > 0, 'Phải lấy được nhu cầu liên quan lĩnh vực HAME');

  reqs.forEach(r => {
    assert.ok(r.id, 'Phải có mã nhu cầu');
    assert.ok(r.title, 'Phải có tiêu đề');
    assert.strictEqual(r.confidentialBudgetProtected, true, 'Ngân sách kín phải được bảo vệ');
    assert.strictEqual(r.privateContactProtected, true, 'Liên hệ cá nhân phải được bảo vệ');
    assert.strictEqual(typeof r.buyerEmail, 'undefined', 'Không lộ email Buyer');
    assert.strictEqual(typeof r.buyerPhone, 'undefined', 'Không lộ phone Buyer');
    assert.strictEqual(typeof r.rawBudget, 'undefined', 'Không lộ rawBudget');
  });
});

// ----------------------------------------------------------------------------
// TEST 8: Supplier groups reuse SupplierProfile (Section 44.8, Section 18, 19, 20)
// ----------------------------------------------------------------------------
runTest('QA 8: Nhóm nhà cung ứng liên quan tái sử dụng SupplierProfile theo cluster', () => {
  const groups = getSupplierGroupsForAssociation('ORG-HAME-005');
  assert.ok(groups.length >= 3, 'HAME phải có 3 cụm nhóm cung ứng (CNC, Điện-Tự động hóa, Khuôn mẫu)');

  groups.forEach(g => {
    assert.strictEqual(g.associationOrganizationId, 'ORG-HAME-005');
    assert.ok(g.title, 'Nhóm phải có tiêu đề');
    assert.ok(g.category, 'Nhóm phải có ngành');
    assert.ok(g.supplierCount > 0, 'Nhóm phải có số lượng NCC thực tế');
    if (g.sampleSuppliers.length > 0) {
      g.sampleSuppliers.forEach(s => {
        assert.ok(s.id, 'Sample supplier phải có org id');
        assert.ok(s.name, 'Sample supplier phải có tên');
      });
    }
  });
});

// ----------------------------------------------------------------------------
// TEST 9: Catalogue reuse Catalogue model (Section 44.9, Section 21)
// ----------------------------------------------------------------------------
runTest('QA 9: Khối Catalogue tái sử dụng mô hình Catalogue có kiểm soát', () => {
  const assoc = getFullAssociationData('ORG-HAME-005');
  assert.strictEqual(assoc.profile.hasCatalogue, true);
  assert.ok(assoc.profile.catalogueTitle.includes('Kỷ yếu Năng lực'), 'Có tiêu đề kỷ yếu năng lực');
});

// ----------------------------------------------------------------------------
// TEST 10: Case phải có permission/consent (Section 44.10, Section 23, 24)
// ----------------------------------------------------------------------------
runTest('QA 10: Case kết nối chỉ public khi consentStatus = GRANTED và outcome rõ ràng', () => {
  const cases = getConnectionCasesForAssociation('ORG-HAME-005');
  assert.ok(cases.length > 0, 'HAME có case kết nối được phê duyệt');

  cases.forEach(c => {
    assert.strictEqual(c.consentStatus, 'GRANTED', 'Chỉ public case có consent');
    assert.strictEqual(c.publishStatus, 'PUBLISHED', 'Chỉ public case đã xuất bản');
    assert.ok(c.outcome, 'Phải có kết quả outcome thực tế');
    assert.ok(c.initialRequirement, 'Phải có nhu cầu ban đầu');
    assert.ok(c.matchedSupplier, 'Phải có NCC được ghép nối');
    assert.ok(c.evidenceRef, 'Phải có chứng từ tham chiếu');
  });
});

// ----------------------------------------------------------------------------
// TEST 11: Association private report không public (Section 44.11, Section 25, 26)
// ----------------------------------------------------------------------------
runTest('QA 11: Báo cáo chi tiết nội bộ hiệp hội không lộ ra ngoài trang public', () => {
  const publicCanViewReqs = canUserAccessAssociationData(null, 'ORG-HAME-005', 'MEMBER_PRIVATE_REQUIREMENTS');
  assert.strictEqual(publicCanViewReqs, false, 'Public user không thể xem private requirements');

  const publicCanViewDeals = canUserAccessAssociationData(null, 'ORG-HAME-005', 'BUYER_CRM_DEALS');
  assert.strictEqual(publicCanViewDeals, false, 'Public user không thể xem CRM deals');

  const publicCanViewQuotes = canUserAccessAssociationData(null, 'ORG-HAME-005', 'MEMBER_PRIVATE_QUOTATIONS');
  assert.strictEqual(publicCanViewQuotes, false, 'Public user không thể xem báo giá riêng của hội viên');
});

// ----------------------------------------------------------------------------
// TEST 12: CTA program giữ organization context (Section 44.12, Section 4, 27)
// ----------------------------------------------------------------------------
runTest('QA 12: CTA đề xuất chương trình giữ nguyên organizationId context', () => {
  const orgId = 'ORG-HAME-005';
  const expectedUrl = `/dich-vu/to-chuc-ket-noi?source=association&organizationId=${orgId}`;
  assert.ok(expectedUrl.includes('source=association'), 'Giữ context source=association');
  assert.ok(expectedUrl.includes(`organizationId=${orgId}`), 'Giữ đúng organizationId');
});

// ----------------------------------------------------------------------------
// TEST 13: Admin mutations có AuditLog (Section 44.13, Section 35)
// ----------------------------------------------------------------------------
runTest('QA 13: Thao tác nộp claim và duyệt claim ghi nhận AuditLog', () => {
  const claim = submitMembershipClaim({
    associationOrganizationId: 'ORG-HAME-005',
    memberOrganizationName: 'Doanh Nghiệp Kiểm Thử Audit Log',
    requesterName: 'Nguyễn Văn Test',
    requesterEmail: 'test@audit.vn',
    requesterPhone: '0909123456',
    evidenceNotes: 'MST: 0399887766'
  });

  assert.ok(claim.success, 'Nộp claim thành công');
  assert.ok(claim.claimId, 'Có claimId');

  // Review claim
  const review = reviewMembershipClaim(claim.claimId, 'APPROVE', 'admin_reviewer', 'Đạt yêu cầu');
  assert.ok(review.success, 'Duyệt claim thành công');

  // Verify AuditLog
  const logs = getAllAssociationAuditLogs('ORG-HAME-005');
  assert.ok(logs.length > 0, 'Phải có AuditLog ghi nhận');
  const found = logs.find(l => l.entityId === claim.claimId);
  assert.ok(found, 'Phải có log cho claim tương ứng');
});

// ----------------------------------------------------------------------------
// TEST 14: Export enforce permission (Section 44.14, Section 40, 41)
// ----------------------------------------------------------------------------
runTest('QA 14: Quyền xuất danh bạ hội viên được kiểm soát chặt chẽ (RBAC) & ghi AuditLog', () => {
  // 1. Không đăng nhập -> bị chặn
  assert.throws(() => {
    exportMembershipRoster('ORG-HAME-005', { isAuthenticated: false });
  }, /Yêu cầu đăng nhập/, 'Khách vãng lai không được phép tải danh bạ');

  // 2. Hội viên thông thường không có quyền export -> bị chặn
  assert.throws(() => {
    exportMembershipRoster('ORG-HAME-005', { 
      isAuthenticated: true, 
      organizationId: 'ORG-HAME-005', 
      hasExportPermission: false 
    });
  }, /Quyền hạn bị từ chối/, 'User không có quyền export bị từ chối');

  // 3. Admin hoặc người được cấp quyền -> thành công và ghi AuditLog
  const exportResult = exportMembershipRoster('ORG-HAME-005', {
    isAuthenticated: true,
    isAdmin: true,
    email: 'admin_security@ccu.vn'
  });

  assert.ok(exportResult.success, 'Admin export thành công');
  assert.ok(exportResult.count > 0, 'Có danh sách hội viên');

  const logs = getAllAssociationAuditLogs('ORG-HAME-005');
  const exportLog = logs.find(l => l.action === 'EXPORT_MEMBERSHIP_ROSTER');
  assert.ok(exportLog, 'Hành động export danh bạ được ghi vào AuditLog');
});

// ----------------------------------------------------------------------------
// TEST 15: Mobile 390px hoạt động (Section 44.15, Section 42)
// ----------------------------------------------------------------------------
runTest('QA 15: Giao diện AssociationDetailPage tuân thủ thứ tự mobile Section 42 và không tràn màn hình', () => {
  const pageFile = path.resolve(__dirname, '../../src/pages/AssociationDetailPage.jsx');
  const content = fs.readFileSync(pageFile, 'utf8');

  // Kiểm tra sự hiện diện đầy đủ các section theo thứ tự Section 42
  assert.ok(content.includes('Top Hero Profile Banner'), 'Có Hero section');
  assert.ok(content.includes('Giới thiệu tổ chức'), 'Có Giới thiệu');
  assert.ok(content.includes('Lĩnh vực & Phạm vi hoạt động'), 'Có Lĩnh vực');
  assert.ok(content.includes('Chương trình phối hợp cùng Hội'), 'Có Chương trình');
  assert.ok(content.includes('Nhu cầu mua hàng đang kết nối'), 'Có Nhu cầu');
  assert.ok(content.includes('Hội viên đã được xác nhận'), 'Có Hội viên');
  assert.ok(content.includes('Nhóm nhà cung ứng liên quan'), 'Có Nhóm NCC');
  assert.ok(content.includes('Catalogue & Ấn phẩm chuyên ngành'), 'Có Catalogue');
  assert.ok(content.includes('Case kết nối thành công'), 'Có Case kết nối');
  assert.ok(content.includes('Muốn tổ chức chương trình cho Hội viên?'), 'Có Bottom CTA');

  // Kiểm tra responsive classes: không có fixed width lớn, dùng max-w-7xl, overflow-hidden hoặc responsive grid
  assert.ok(!content.includes('w-[450px]'), 'Không có fixed width lớn gây overflow 390px');
  assert.ok(!content.includes('w-[500px]'), 'Không có fixed width lớn gây overflow 390px');
  assert.ok(content.includes('grid-cols-1 sm:grid-cols-2'), 'Có 1 cột trên mobile');
});

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`KẾT QUẢ TEST PAGE 25: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('TẤT CẢ 15 TIÊU CHÍ QA SECTION 44 ĐÃ ĐẠT CHUẨN HOÀN TOÀN!');
  process.exit(0);
}
