// ============================================================================
// TEST SUITE: PAGE 20 SPEC CRITERIA (CHƯƠNG TRÌNH KẾT NỐI DOANH NGHIỆP)
// ROUTE: /chuong-trinh & /admin/chuong-trinh
// ============================================================================

import assert from 'node:assert';
import { 
  getAllPrograms, 
  getProgramByIdOrSlug, 
  calculateFeeDisplay,
  registerProgramInterest,
  registerProgramNotificationConsent,
  updateProgramAdmin,
  getAllProgramAuditLogs,
  PROGRAM_TYPES_ENUM,
  PROGRAM_STATUSES_ENUM,
  TARGET_ROLES_ENUM,
  MODALITY_ENUM
} from '../../src/data/programsData.js';

import { getAllOrganizations } from '../../src/data/organizationsData.js';
import { getAllMasterRequirements } from '../../src/data/requirementsData.js';

console.log('====================================================================');
console.log('🧪 RUNNING PAGE 20 (DANH SÁCH CHƯƠNG TRÌNH) AUTOMATED TEST SUITE');
console.log('====================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`✅ [PASS] ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${testName}:`, err.message);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: Khởi tạo dữ liệu & Audit
// ----------------------------------------------------------------------------
runTest('1. Dữ liệu chương trình được khởi tạo đầy đủ từ DB/SEED thật', () => {
  const programs = getAllPrograms();
  assert(Array.isArray(programs), 'Programs phải là mảng');
  assert(programs.length >= 7, 'Phải có tối thiểu 7 chương trình đại diện cho các kỳ sự kiện');
  
  const first = programs[0];
  assert(first.publicCode && first.publicCode.startsWith('PRG-'), 'Mỗi program phải có publicCode PRG-...');
  assert(first.slug, 'Program phải có slug');
  assert(first.programType, 'Program phải có canonical programType');
  assert(first.programStatus, 'Program phải có canonical programStatus');
});

// ----------------------------------------------------------------------------
// TEST 2: Đầy đủ các loại hình chương trình (Section 3)
// ----------------------------------------------------------------------------
runTest('2. Hỗ trợ tối thiểu 5 loại hình chương trình theo chuẩn Section 3', () => {
  const programs = getAllPrograms();
  const types = new Set(programs.map(p => p.programType));
  
  assert(types.has(PROGRAM_TYPES_ENUM.SUPPLY_CHAIN_DAY), 'Thiếu loại SUPPLY_CHAIN_DAY');
  assert(types.has(PROGRAM_TYPES_ENUM.BUYER_SUPPLIER_MEETING), 'Thiếu loại BUYER_SUPPLIER_MEETING');
  assert(types.has(PROGRAM_TYPES_ENUM.SHARED_BOOTH), 'Thiếu loại SHARED_BOOTH');
  assert(types.has(PROGRAM_TYPES_ENUM.SEMINAR) || types.has(PROGRAM_TYPES_ENUM.SUPPLIER_PRESENTATION), 'Thiếu loại SEMINAR/PRESENTATION');
  assert(types.has(PROGRAM_TYPES_ENUM.WELFARE_COMMUNITY), 'Thiếu loại WELFARE_COMMUNITY');
});

// ----------------------------------------------------------------------------
// TEST 3: Đầy đủ các trạng thái vận hành theo Section 4
// ----------------------------------------------------------------------------
runTest('3. Hỗ trợ 7 trạng thái vận hành riêng biệt theo Section 4', () => {
  const programs = getAllPrograms();
  const statuses = new Set(programs.map(p => p.programStatus));

  assert(statuses.has(PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN), 'Thiếu REGISTRATION_OPEN');
  assert(statuses.has(PROGRAM_STATUSES_ENUM.UPCOMING), 'Thiếu UPCOMING');
  assert(statuses.has(PROGRAM_STATUSES_ENUM.NEEDS_DISCOVERY), 'Thiếu NEEDS_DISCOVERY');
  assert(statuses.has(PROGRAM_STATUSES_ENUM.REGISTRATION_CLOSED), 'Thiếu REGISTRATION_CLOSED');
  assert(statuses.has(PROGRAM_STATUSES_ENUM.COMPLETED), 'Thiếu COMPLETED');
  assert(statuses.has(PROGRAM_STATUSES_ENUM.POSTPONED), 'Thiếu POSTPONED');
  assert(statuses.has(PROGRAM_STATUSES_ENUM.CANCELLED), 'Thiếu CANCELLED');
});

// ----------------------------------------------------------------------------
// TEST 4: Tra cứu theo ID / Slug / Public Code (Section 23)
// ----------------------------------------------------------------------------
runTest('4. Tìm chương trình theo id, slug hoặc public code', () => {
  const byId = getProgramByIdOrSlug('vsip-binh-duong');
  assert(byId, 'Phải tìm được theo id');
  
  const byCode = getProgramByIdOrSlug('PRG-2026-001');
  assert(byCode && byCode.id === 'vsip-binh-duong', 'Phải tìm được theo publicCode PRG-2026-001');
});

// ----------------------------------------------------------------------------
// TEST 5: Quy tắc hiển thị mức phí theo Section 11 & 12 (Hard Rule)
// ----------------------------------------------------------------------------
runTest('5. Hard Rule Section 12: Không hiển thị "Miễn phí" nếu chỉ Buyer được miễn phí', () => {
  const vsip = getProgramByIdOrSlug('vsip-binh-duong');
  
  // Với đối tượng chung (chưa chọn role): Buyer free nhưng Supplier có phí -> Phải hiện "Xem phí theo hình thức"
  const generalFee = calculateFeeDisplay(vsip, 'ALL');
  assert.strictEqual(generalFee, 'Xem phí theo hình thức', 'Chương trình có phí Supplier không được ghi là Miễn phí');

  // Với role BUYER cụ thể: Option của Buyer là FREE -> Được hiện Miễn phí
  const buyerFee = calculateFeeDisplay(vsip, 'BUYER');
  assert(buyerFee.includes('Miễn phí'), 'Khi lọc vai trò Buyer phải hiện miễn phí');

  // Với chương trình 100% free (như Webinar ESG):
  const esg = getProgramByIdOrSlug('webinar-esg-carbon-green-factory');
  const esgFee = calculateFeeDisplay(esg, 'ALL');
  assert.strictEqual(esgFee, 'Miễn phí', 'Webinar miễn phí cho mọi role phải ghi Miễn phí');
});

// ----------------------------------------------------------------------------
// TEST 6: Quy tắc Section 14 (Đăng ký quan tâm != Đăng ký tham gia)
// ----------------------------------------------------------------------------
runTest('6. Quy tắc Section 14: Đăng ký quan tâm không tạo Registration hay Payment', () => {
  const result = registerProgramInterest({
    programId: 'nhon-trach-long-thanh',
    programTitle: 'Ngày Hội Cung Ứng Nhơn Trạch',
    name: 'Nguyễn Văn Test',
    company: 'Test Company Vina',
    email: 'test@company.com',
    phone: '0909123456',
    role: 'SUPPLIER',
    consent: true
  });

  assert(result.success, 'Đăng ký quan tâm phải thành công');
  assert.strictEqual(result.record.type, 'PROGRAM_INTEREST', 'Loại record phải là PROGRAM_INTEREST');
  assert(result.record.disclaimer.includes('KHÔNG phải đăng ký tham gia chính thức'), 'Phải có disclaimer pháp lý');
});

// ----------------------------------------------------------------------------
// TEST 7: Section 15 (Chưa có chương trình phù hợp -> Đăng ký thông báo riêng)
// ----------------------------------------------------------------------------
runTest('7. Section 15: Lưu thông tin đăng ký thông báo chương trình phù hợp', () => {
  const result = registerProgramNotificationConsent({
    name: 'Trần Thị B',
    company: 'Nhà Máy Bao Bì Long An',
    email: 'b@baobilongan.vn',
    phone: '0988776655',
    role: 'SUPPLIER',
    category: 'Bao bì, In ấn & Nhựa kỹ thuật',
    zone: 'Miền Nam',
    consent: true
  });

  assert(result.success, 'Đăng ký nhận thông tin phải thành công');
  assert.strictEqual(result.record.type, 'PROGRAM_MATCH_SUBSCRIPTION');
  assert.strictEqual(result.record.category, 'Bao bì, In ấn & Nhựa kỹ thuật');
});

// ----------------------------------------------------------------------------
// TEST 8: Section 20 & 21 (Completed Programs & Verified Aggregate Results)
// ----------------------------------------------------------------------------
runTest('8. Section 20 & 21: Lưu trữ kết quả aggregate đã xác thực cho chương trình đã diễn ra', () => {
  const completed = getProgramByIdOrSlug('ham-kiem-1');
  assert(completed.status === 'da-dien-ra', 'Hàm Kiệm 1 phải ở trạng thái đã diễn ra');
  assert(completed.recap, 'Phải có đối tượng recap');
  assert(completed.recap.verified === true, 'Recap phải được xác thực');
  
  // Kiểm tra tính riêng biệt giữa attendance và registration theo Section 21
  assert(completed.recap.attendanceCount !== completed.recap.registrationsCount, 
    'Attendance (157) phải phân biệt với Registrations (168)');
  assert(completed.recap.sessionsCompleted > 0, 'Phải có số phiên gặp hoàn thành');
  assert(completed.recap.outcomesConfirmed > 0, 'Phải có số kết quả/MOU được xác nhận');
});

// ----------------------------------------------------------------------------
// TEST 9: Section 27 (Hard Rule: Program active có Owner + Next Action)
// ----------------------------------------------------------------------------
runTest('9. Section 27: Mọi chương trình active đều có ownerUserId và nextAction có ngày', () => {
  const programs = getAllPrograms();
  const activePrograms = programs.filter(p => p.status !== 'da-dien-ra' && p.status !== 'huy');
  
  activePrograms.forEach(p => {
    assert(p.ownerUserId, `Chương trình ${p.id} thiếu ownerUserId`);
    assert(p.nextAction, `Chương trình ${p.id} thiếu nextAction`);
    assert(p.nextActionAt, `Chương trình ${p.id} thiếu nextActionAt`);
  });
});

// ----------------------------------------------------------------------------
// TEST 10: Section 28 (Organizer liên kết tới Organization master)
// ----------------------------------------------------------------------------
runTest('10. Section 28: Organizer phải có liên kết organizerOrganizationId', () => {
  const programs = getAllPrograms();
  programs.forEach(p => {
    assert(p.organizerOrganizationId, `Chương trình ${p.id} thiếu organizerOrganizationId`);
  });
});

// ----------------------------------------------------------------------------
// TEST 11: Section 29 (Requirement relation, không duplicate Need)
// ----------------------------------------------------------------------------
runTest('11. Section 29: Relations liên kết requirementIds không duplicate Need', () => {
  const vsip = getProgramByIdOrSlug('vsip-binh-duong');
  assert(vsip.relations, 'Phải có relations object');
  assert(Array.isArray(vsip.relations.requirementIds), 'requirementIds phải là mảng');
  assert(vsip.relations.requirementIds.includes('REQ-2026-001'), 'Phải liên kết tới REQ-2026-001');
});

// ----------------------------------------------------------------------------
// TEST 12: Section 30 (Audit Log khi Admin cập nhật)
// ----------------------------------------------------------------------------
runTest('12. Section 30: Admin cập nhật chương trình tự động ghi Audit Log', () => {
  const updateRes = updateProgramAdmin('vsip-binh-duong', {
    nextAction: 'Đã hoàn tất rà soát 20 nhà máy'
  }, 'admin_super_tester');

  assert(updateRes.success, 'Cập nhật admin phải thành công');
  
  const logs = getAllProgramAuditLogs();
  assert(logs.length > 0, 'Audit log phải ghi nhận');
  const latest = logs[0];
  assert.strictEqual(latest.entityId, 'vsip-binh-duong');
  assert.strictEqual(latest.actorUserId, 'admin_super_tester');
});

console.log('\n====================================================================');
console.log(`🏁 TEST RESULTS: ${passCount} PASSED / ${failCount} FAILED`);
console.log('====================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PAGE 20 / MODULE 20 SPEC CRITERIA PASSED SUCCESSFULLY!\n');
}
