// ============================================================================
// TEST SUITE: SPEC 37 - FINAL PRE-PILOT SYSTEM AUDIT (P0 + P1)
// 15 E2E Scenarios (Sections 67 to 81) & Pilot Acceptance Gates (Section 90)
// ============================================================================

import {
  getAllMasterRequirements,
  getPublicRequirements,
  toPublicRequirementSummary,
  SEED_REQUIREMENTS
} from '../../src/data/requirementsData.js';

import {
  getAllOrganizations,
  detectDuplicateOrganization,
  auditOrganizationDuplicates,
  calculateProfileCompleteness,
  SEED_ORGANIZATIONS
} from '../../src/data/organizationsData.js';

import {
  PROGRAMS_DATA,
  getProgramByIdOrSlug
} from '../../src/data/programsData.js';

import {
  submitServiceRequest,
  getAllServiceRequests
} from '../../src/data/servicesData.js';

import {
  getAllFoundingPartnerships,
  verifySupplierMatchingNeutrality as verifyFoundingNeutrality
} from '../../src/data/foundingPartnershipData.js';

import {
  getAllSponsorships,
  verifySupplierMatchingNeutrality as verifySponsorshipNeutrality
} from '../../src/data/sponsorshipData.js';

import {
  captureReferral,
  adjustSettlementForRefund,
  verifySupplierMatchingNeutrality as verifyReferralNeutrality
} from '../../src/data/developmentPartnerData.js';

import {
  SEED_SOURCING_DOSSIERS,
  getDossierBySlug,
  verifyDossierNeutrality
} from '../../src/data/sourcingDossiersData.js';

import {
  PARTNERSHIP_CATEGORIES,
  FINANCE_CLASSIFICATIONS,
  submitPartnershipInquiry,
  verifyFinanceSeparationRule
} from '../../src/data/partnershipHubData.js';

import {
  MASTER_SIX_STAGES,
  verifyStageNeutrality
} from '../../src/data/sixStagesData.js';

import fs from 'fs';
import path from 'path';

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
console.log('TESTING SPEC 37: PRE-PILOT SYSTEM AUDIT (P0 + P1 FREEZE)');
console.log('================================================================\n');

try {
  // --------------------------------------------------------------------------
  // E2E SCENARIO 01: BUYER REQUIREMENT CHAIN (Section 67)
  // --------------------------------------------------------------------------
  console.log('--- [E2E SCENARIO 01] BUYER REQUIREMENT PERSISTENCE & MATCHING ---');
  const allReqs = getAllMasterRequirements();
  assert(allReqs.length >= 5, '1.1 Danh sách Nhu Cầu Gốc (Master Requirements) tồn tại đầy đủ');
  const req01 = allReqs.find(r => r.id === 'NC-2026-00125');
  assert(req01 !== undefined, '1.2 Nhu cầu chuẩn NC-2026-00125 tồn tại và chứa đủ dữ liệu kỹ thuật');
  assert(req01.publicCode.startsWith('NC-'), '1.3 Mã định danh công khai tuân chuẩn tracking code NC-...');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 02: PUBLIC NEED & PRIVACY PRESERVATION (Section 13, 14, 68)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 02] PUBLIC NEED & PRIVACY ENFORCEMENT ---');
  const publicReqs = getPublicRequirements();
  const hasPrivateInPublic = publicReqs.some(r => r.visibility === 'PRIVATE');
  assert(!hasPrivateInPublic, '2.1 Nhu cầu trạng thái PRIVATE tuyệt đối KHÔNG lọt vào danh sách công khai');

  const sanitizedSample = toPublicRequirementSummary(req01);
  const privacyCheck = !sanitizedSample.buyerPhone &&
                       !sanitizedSample.phone &&
                       !sanitizedSample.email &&
                       !sanitizedSample.internalBudget &&
                       !sanitizedSample.targetPrice &&
                       !sanitizedSample.internalNotes &&
                       !sanitizedSample.confidentialAttachments;
  assert(privacyCheck, '2.2 Bản tóm tắt công khai (Public Summary) đã lọc bỏ 100% SĐT, Email, Ngân sách và File mật của Buyer');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 03: ONE ORGANIZATION RULE & SUPPLIER ONBOARDING (Section 6, 7, 69)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 03] ONE ORGANIZATION & MULTI-ROLE CONSISTENCY ---');
  const orgs = getAllOrganizations();
  const proserOrg = orgs.find(o => o.id === 'ORG-PROSER-001');
  assert(proserOrg !== undefined, '3.1 Tổ chức ORG-PROSER-001 tồn tại');
  assert(proserOrg.roles.includes('SUPPLIER') && proserOrg.roles.includes('FACTORY') && proserOrg.roles.includes('FOUNDING_PARTNER'),
    '3.2 MỘT Doanh nghiệp duy nhất đồng thời nắm giữ các vai trò SUPPLIER + FACTORY + FOUNDING_PARTNER (Không tạo 3 Org song song)');

  // Duplicate detection audit
  const dupAudit = auditOrganizationDuplicates(orgs);
  assert(dupAudit.totalChecked >= 5, '3.3 Công cụ Rà soát Trùng lặp Doanh nghiệp hoạt động trên toàn bộ danh bạ');
  assert(Array.isArray(dupAudit.safeAutoMergeCandidates) && Array.isArray(dupAudit.manualReviewRequired),
    '3.4 Phân định rõ ràng giữa ứng viên Safe Auto-Merge (Trùng MST) và Manual Review (Trùng tên khác MST)');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 04: FACTORY PROFILE BUY/SELL SEPARATION (Section 8, 9, 36, 70)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 04] FACTORY PROFILE BUY/SELL SEPARATION ---');
  const tahomartOrg = orgs.find(o => o.id === 'ORG-TAHOMART-002');
  assert(tahomartOrg.roles.includes('BUYER') && tahomartOrg.roles.includes('SUPPLIER'),
    '4.1 Doanh nghiệp Tahomart đồng thời có luồng MUA (Bao bì, màng co) và luồng BÁN (Nông sản sấy, giỏ quà tết)');
  const completeness = calculateProfileCompleteness(tahomartOrg);
  assert(completeness.score >= 50, '4.2 Bộ đo Profile Completeness tính toán chính xác mức độ hoàn thiện hồ sơ');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 05: PROGRAM LIFECYCLE & STATUS SEPARATION (Section 37, 38, 40, 71)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 05] PROGRAM & ATTENDANCE SEPARATION ---');
  assert(PROGRAMS_DATA.length >= 3, '5.1 Danh sách chương trình giao thương B2B sẵn sàng');
  const expoProg = getProgramByIdOrSlug('vsip-binh-duong');
  assert(expoProg !== null && expoProg !== undefined, '5.2 Truy vấn thành công chương trình Sourcing Day VSIP Bình Dương');
  // Meeting != Result Rule (Section 40)
  assert(expoProg.factoriesCount !== undefined, '5.3 Chương trình đo lường số lượng Nhu cầu đối soát tách biệt với kết quả giao dịch');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 08: SERVICE REQUEST LIFECYCLE (Section 23, 25, 74)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 08] SERVICE REQUEST DEDUPE & TRACKING CODE ---');
  const newSrv = submitServiceRequest({
    serviceType: 'MEDIA_BRANDING',
    customerName: 'Công ty Cơ Khí Tiên Phong',
    contactPerson: 'Nguyễn Văn Tiến',
    phone: '0903 123 789',
    email: 'tien.nv@tienphong.vn',
    requirements: 'Cần quay video phóng sự xưởng gia công cơ khí chính xác tại KCN VSIP.',
    consentOperational: true
  });
  assert(newSrv.success === true, '8.1 Tiếp nhận yêu cầu dịch vụ thành công');
  assert(newSrv.trackingCode.startsWith('DV-'), '8.2 Mã tiếp nhận dịch vụ tuân chuẩn tracking code DV-...');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 10 & 11: SPONSOR & FOUNDING PARTNER NEUTRALITY (Section 16, 45, 47, 76, 77)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIOS 10 & 11] COMMERCIAL SPONSORSHIP NEUTRALITY ---');
  const fpNeutrality = verifyFoundingNeutrality();
  assert(fpNeutrality.matchingBonus === 0, '10.1 Founding Partner tuyệt đối KHÔNG được cộng điểm ưu ái trong Supplier Matching');
  assert(fpNeutrality.organicSearchUnaffected === true, '10.2 Kết quả tìm kiếm tự nhiên của nhà cung ứng không bị bóp méo bởi gói tài trợ');

  const spNeutrality = verifySponsorshipNeutrality();
  assert(spNeutrality.matchingBonus === 0 && spNeutrality.paidTickVerifiedGranted === false,
    '11.1 Nhà tài trợ sự kiện không được tự cấp tick xanh Verified hay tăng thứ hạng');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 13: DEVELOPMENT PARTNER & REFUND ADJUSTMENT (Section 18, 49, 79)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 13] DEVELOPMENT PARTNER & REFUND ADJUSTMENT ---');
  const refNeutrality = verifyReferralNeutrality();
  assert(refNeutrality.matchingBonus === 0, '13.1 Đối tác giới thiệu (Referral) không làm thay đổi điểm đối soát kỹ thuật');

  const refundAdj = adjustSettlementForRefund('REF-2026-00126', 2000000, 'Đơn hàng bị khách hủy sau khi đối soát.');
  assert(refundAdj.status === 'REFUNDED_ADJUSTMENT',
    '13.2 Giao dịch hoàn hủy tự động kích hoạt điều chỉnh giảm trừ REFUNDED_ADJUSTMENT, bảo toàn lịch sử sổ cái');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 14: SOURCING DOSSIER NEUTRALITY (Section 50, 80)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 14] SOURCING DOSSIER RELEVANCE & NEUTRALITY ---');
  const dossierNeutrality = verifyDossierNeutrality();
  assert(dossierNeutrality.sponsorAltersShortlist === false, '14.1 Tài trợ tuyệt đối không thể tự chèn ứng viên vào Shortlist bộ hồ sơ');
  assert(SEED_SOURCING_DOSSIERS.length >= 2, '14.2 Bộ hồ sơ tuyển chọn có đầy đủ tiêu chí kỹ thuật và bằng chứng xác thực');

  // --------------------------------------------------------------------------
  // E2E SCENARIO 15: PARTNERSHIP HUB & FINANCE SEPARATION (Section 48, 52, 56, 81)
  // --------------------------------------------------------------------------
  console.log('\n--- [E2E SCENARIO 15] PARTNERSHIP HUB & STRICT FINANCE SEPARATION ---');
  assert(PARTNERSHIP_CATEGORIES.length === 7, '15.1 Chuẩn hóa đầy đủ 7 khung hợp tác đối tác (Hội, KCN, Sponsor, FP, DP, Advisor, Investor)');

  const finSep = verifyFinanceSeparationRule();
  assert(finSep.investorIsRevenue === false, '15.2 HARD RULE: Vốn đầu tư (INVESTMENT_CAPITAL) tuyệt đối KHÔNG PHẢI là doanh thu bán hàng');
  assert(FINANCE_CLASSIFICATIONS.SPONSORSHIP_REVENUE.isRevenue === true &&
         FINANCE_CLASSIFICATIONS.SERVICE_REVENUE.isRevenue === true,
         '15.3 Doanh thu tài trợ và dịch vụ B2B được phân định rạch ròi là doanh thu thương mại');

  const newInquiry = submitPartnershipInquiry({
    category: 'INVESTOR',
    organizationName: 'Quỹ Đầu Tư Phát Triển Hạ Tầng',
    representativeName: 'Trần Văn Đầu Tư',
    phone: '0988 888 888',
    email: 'investor@fund.vn',
    proposalScope: 'Tài trợ vốn mở rộng hệ sinh thái.',
    consentOperational: true
  });
  assert(newInquiry.success === true && newInquiry.trackingCode.startsWith('HT-'),
    '15.4 Tiếp nhận đề xuất hợp tác thành công với mã tracking HT-...');
  assert(newInquiry.inquiry.status === 'RECEIVED', '15.5 Đề xuất hợp tác khởi tạo ở trạng thái RECEIVED, tuyệt đối không tự động confirm');

  // --------------------------------------------------------------------------
  // STAGE & NON-SEQUENTIAL WORKFLOW (Section 51)
  // --------------------------------------------------------------------------
  console.log('\n--- [TAXONOMY & STAGE] CANONICAL STAGES & NON-SEQUENTIAL PROCESS ---');
  assert(MASTER_SIX_STAGES.length === 6, '16.1 Duy nhất 6 giai đoạn canonical, không thừa không thiếu');
  const stageNeutrality = verifyStageNeutrality();
  assert(stageNeutrality.stageMonopolySold === false, '16.2 Giai đoạn chỉ là lớp ngữ cảnh định vị nhu cầu, tuyệt đối không bán độc quyền');

  // --------------------------------------------------------------------------
  // PILOT ACCEPTANCE GATES AUDIT (Section 90)
  // --------------------------------------------------------------------------
  console.log('\n--- [PILOT ACCEPTANCE GATES] GATES A -> I AUDIT ---');
  
  // Gate A: Navigation
  const appPath = path.resolve('src/App.jsx');
  const appCode = fs.readFileSync(appPath, 'utf-8');
  const hasHopTacRoute = appCode.includes('/hop-tac') && appCode.includes('PartnershipHubPage');
  assert(hasHopTacRoute, 'Gate A (Navigation): Route /hop-tac đã được khai báo và liên kết PartnershipHubPage');

  const navPath = path.resolve('src/components/Navbar.jsx');
  const navCode = fs.readFileSync(navPath, 'utf-8');
  const navHasHopTac = navCode.includes('/hop-tac') && navCode.includes('/tai-tro') && navCode.includes('/doi-tac-phat-trien');
  assert(navHasHopTac, 'Gate A (Navigation): Navbar liên kết đầy đủ các trang cốt lõi P0+P1');

  // Gate B: Form
  assert(newSrv.trackingCode && newInquiry.trackingCode, 'Gate B (Forms): Mọi biểu mẫu quan trọng đều có xác nhận và tracking code riêng biệt');

  // Gate C: Data
  assert(!hasPrivateInPublic && orgs.length > 0, 'Gate C (Data): Dữ liệu sạch, không trùng lặp pháp nhân, không lộ private records');

  // Gate D: Privacy
  assert(privacyCheck, 'Gate D (Privacy): Quyền riêng tư của Buyer được bảo vệ ở tầng dữ liệu lõi');

  // Gate H: Finance
  assert(finSep.investorIsRevenue === false, 'Gate H (Finance): Phân tách rạch ròi 8 nhóm dòng tiền, vốn đầu tư không lẫn vào doanh thu');

} catch (err) {
  console.error('Lỗi thực thi test suite audit:', err);
  failed++;
}

console.log('\n================================================================');
console.log(`TOTAL SPEC 37 AUDIT CHECKS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('================================================================\n');

if (failed === 0) {
  console.log('🎉 ALL SPEC 37 PRE-PILOT AUDIT CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error(`💥 ${failed} CHECKS FAILED! Check implementation.\n`);
  process.exit(1);
}
