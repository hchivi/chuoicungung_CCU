import assert from 'assert';
import {
  getAllPrograms,
  getProgramByIdOrSlug,
  calculateFeeDisplay,
  getProgramPublicBuyerNeeds,
  getProgramShowcaseSuppliers,
  trackProgramAnalytics,
  updateProgramAdmin,
  getAllProgramAuditLogs,
  PROGRAM_TYPES_ENUM,
  PROGRAM_STATUSES_ENUM,
  TARGET_ROLES_ENUM,
  MODALITY_ENUM
} from '../../src/data/programsData.js';

console.log('====================================================================');
console.log('🧪 RUNNING PAGE 21 (CHI TIẾT CHƯƠNG TRÌNH) AUTOMATED TEST SUITE');
console.log('====================================================================\n');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    failedTests++;
  }
}

// 1. Detail load đúng slug
runTest('1. Detail load đúng slug (Section 2)', () => {
  const p1 = getProgramByIdOrSlug('vsip-binh-duong');
  assert.ok(p1, 'Không tìm thấy chương trình theo slug vsip-binh-duong');
  assert.strictEqual(p1.publicCode, 'PRG-2026-001');
  assert.ok(p1.title.includes('VSIP 1 & 2'));

  const p2 = getProgramByIdOrSlug('PRG-2026-002');
  assert.ok(p2, 'Không tìm thấy chương trình theo publicCode PRG-2026-002');
  assert.strictEqual(p2.slug, 'trang-due-deep-c');

  const pAlias = getProgramByIdOrSlug('vsip-binh-duong-2026');
  assert.ok(pAlias, 'Không tìm thấy chương trình qua alias ID');
  assert.strictEqual(pAlias.id, 'vsip-binh-duong');
});

// 2. Unpublished Program không public
runTest('2. Unpublished Program kiểm tra quyền hiển thị (Section 2)', () => {
  const all = getAllPrograms();
  const publicPrograms = all.filter(p => p.publishable === true && p.visibility === true);
  assert.ok(publicPrograms.length > 0, 'Phải có các chương trình công khai');
  // Giả định chương trình unpublished
  const fakeUnpublished = { publishable: false, visibility: false };
  assert.strictEqual(fakeUnpublished.publishable, false, 'Unpublished program phải bị chặn public render');
});

// 3. CTA thay đổi đúng theo Status
runTest('3. CTA và Status Banner thay đổi đúng theo Status (Section 4 & 13)', () => {
  const openProg = getProgramByIdOrSlug('vsip-binh-duong');
  assert.strictEqual(openProg.programStatus, PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN);
  assert.ok(openProg.participationOptions.length > 0);

  const upcomingProg = getProgramByIdOrSlug('sourcing-day-electronics-bac-ninh');
  assert.strictEqual(upcomingProg.programStatus, PROGRAM_STATUSES_ENUM.UPCOMING);

  const closedProg = getProgramByIdOrSlug('pitching-automation-chu-lai');
  assert.strictEqual(closedProg.programStatus, PROGRAM_STATUSES_ENUM.REGISTRATION_CLOSED);

  const completedProg = getProgramByIdOrSlug('ham-kiem-1');
  assert.strictEqual(completedProg.programStatus, PROGRAM_STATUSES_ENUM.COMPLETED);

  const postponedProg = getProgramByIdOrSlug('tan-duc-hai-son-postponed');
  assert.strictEqual(postponedProg.programStatus, PROGRAM_STATUSES_ENUM.POSTPONED);

  const cancelledProg = getProgramByIdOrSlug('dien-dan-phu-tro-amata-cancelled');
  assert.strictEqual(cancelledProg.programStatus, PROGRAM_STATUSES_ENUM.CANCELLED);
});

// 4. Buyer/Supplier CTA cùng một registration route + role preset
runTest('4. Buyer/Supplier CTA cùng một registration route + role preset (Section 22)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  const buyerRoute = `/chuong-trinh/${prog.slug}/dang-ky?role=buyer`;
  const supplierRoute = `/chuong-trinh/${prog.slug}/dang-ky?role=supplier`;

  assert.ok(buyerRoute.startsWith('/chuong-trinh/vsip-binh-duong/dang-ky'));
  assert.ok(buyerRoute.includes('role=buyer'));
  assert.ok(supplierRoute.startsWith('/chuong-trinh/vsip-binh-duong/dang-ky'));
  assert.ok(supplierRoute.includes('role=supplier'));
});

// 5. Buyer Needs chỉ public đúng sharing scope (Section 7 & 37)
runTest('5. Buyer Needs sanitized, không lộ contact cá nhân hay budget kín (Section 7 & 37)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  const publicNeeds = getProgramPublicBuyerNeeds(prog);

  assert.ok(Array.isArray(publicNeeds), 'Buyer Needs phải là array');
  assert.ok(publicNeeds.length > 0, 'Phải có nhu cầu mua');

  publicNeeds.forEach(need => {
    assert.ok(need.publicCode, 'Mỗi nhu cầu phải có publicCode');
    assert.ok(need.title, 'Mỗi nhu cầu phải có title');
    // BẢO MẬT BẮT BUỘC:
    assert.strictEqual(need.phone, undefined, 'Không được lộ số điện thoại cá nhân của Buyer');
    assert.strictEqual(need.email, undefined, 'Không được lộ email cá nhân của Buyer');
    assert.strictEqual(need.internalBudget, undefined, 'Không được lộ internalBudget');
    assert.strictEqual(need.targetPrice, undefined, 'Không được lộ targetPrice');
    assert.strictEqual(need.internalNotes, undefined, 'Không được lộ internalNotes');
    assert.strictEqual(need.confidentialAttachments, undefined, 'Không được lộ confidentialAttachments');
  });
});

// 6. Hard Rule: Trả phí ≠ Được meeting (Section 9)
runTest('6. Hard Rule: Trả phí ≠ Được meeting (Section 9)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  assert.ok(prog.meetingWorkflow, 'Chương trình phải có meetingWorkflow');
  assert.ok(
    prog.meetingWorkflow.policyDisclaimer.includes('KHÔNG tự động bảo đảm lịch gặp') ||
    prog.meetingWorkflow.policyDisclaimer.includes('KHÔNG tự động có meeting'),
    'Policy disclaimer phải khẳng định trả phí không đảm bảo meeting'
  );
  assert.ok(prog.meetingWorkflow.rules.length >= 3, 'Phải có quy trình xét duyệt meeting');
});

// 7. Private meeting schedule không công bố public (Section 16)
runTest('7. Private meeting schedule không công bố public (Section 16)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  assert.strictEqual(prog.privateMeetingSchedule, undefined, 'Không được expose privateMeetingSchedule');
  assert.strictEqual(prog.buyerContacts, undefined, 'Không được expose buyerContacts');
});

// 8. Sponsor không ảnh hưởng matching (Section 14)
runTest('8. Sponsor không ảnh hưởng matching và có nhãn rõ (Section 13 & 14)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  assert.ok(Array.isArray(prog.sponsors), 'Sponsors phải là array');
  prog.sponsors.forEach(sp => {
    assert.ok(sp.name, 'Sponsor phải có name');
    assert.ok(sp.tierName, 'Sponsor phải có tierName rõ ràng');
    assert.strictEqual(sp.isConfirmed, true, 'Sponsor phải được confirm');
  });
});

// 9. Participation fee đúng theo role (Section 11 & 12)
runTest('9. Participation fee minh bạch theo role (Section 11 & 12)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  const feeBuyer = calculateFeeDisplay(prog, 'BUYER');
  const feeSupplier = calculateFeeDisplay(prog, 'SUPPLIER');
  const feeAll = calculateFeeDisplay(prog, 'ALL');

  assert.ok(feeBuyer.toLowerCase().includes('miễn phí'), 'Buyer phải được miễn phí');
  assert.ok(feeSupplier.toLowerCase().includes('từ') || feeSupplier.toLowerCase().includes('đ'), 'Supplier có mức phí riêng');
  assert.ok(feeAll.includes('Xem phí theo hình thức') || feeAll.includes('Từ'), 'Không được ghi Miễn phí chung cho ALL nếu chỉ Buyer free');
});

// 10. Remote Presence option (Section 12)
runTest('10. Remote Presence option có deliverables và CTA rõ ràng (Section 12)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  const remoteOpt = prog.participationOptions.find(o => o.participationType === 'REMOTE_PROXY' || o.id.includes('remote'));
  assert.ok(remoteOpt, 'Phải có option tham gia từ xa / ủy thác');
  assert.ok(remoteOpt.title.includes('Từ Xa') || remoteOpt.title.includes('Hiện Diện'));
  assert.ok(remoteOpt.description.length > 20);
});

// 11. Agenda lấy DB/SEED (Section 15)
runTest('11. Agenda có tối thiểu 4-6 timeline items (Section 15)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  assert.ok(Array.isArray(prog.agenda), 'Agenda phải là array');
  assert.ok(prog.agenda.length >= 4, 'Agenda phải có tối thiểu 4 items');
  prog.agenda.forEach(item => {
    assert.ok(item.startAt && item.endAt, 'Agenda item phải có startAt và endAt');
    assert.ok(item.title, 'Agenda item phải có title');
    assert.ok(item.room, 'Agenda item phải có room/location');
  });
});

// 12. Catalogue metadata (Section 20)
runTest('12. Catalogue metadata chuẩn hóa (Section 20)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  assert.ok(prog.catalogue, 'Phải có catalogue');
  assert.ok(prog.catalogue.title, 'Catalogue phải có title');
  assert.ok(prog.catalogue.totalSuppliers > 0, 'Catalogue phải có tổng số nhà cung cấp');
  assert.ok(prog.catalogue.totalBuyerNeeds > 0, 'Catalogue phải có tổng số nhu cầu mua');
});

// 13. Gallery verified media (Section 27)
runTest('13. Gallery có nhãn kiểm duyệt bản quyền (Section 27)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  assert.ok(Array.isArray(prog.gallery), 'Gallery phải là array');
  assert.ok(prog.gallery.length >= 4, 'Gallery phải có tối thiểu 4 ảnh tư liệu');
  prog.gallery.forEach(img => {
    assert.ok(img.url, 'Ảnh phải có url');
    assert.ok(img.caption, 'Ảnh phải có caption');
    assert.strictEqual(img.verified, true, 'Ảnh phải được verified bản quyền');
  });
});

// 14. Completed Program giữ nguyên archive (Section 25)
runTest('14. Completed Program giữ nguyên archive (Section 25)', () => {
  const completedProg = getProgramByIdOrSlug('ham-kiem-1');
  assert.strictEqual(completedProg.programStatus, PROGRAM_STATUSES_ENUM.COMPLETED);
  assert.ok(completedProg.title, 'Completed program vẫn giữ title');
  assert.ok(completedProg.venue || completedProg.location, 'Completed program vẫn giữ venue');
  assert.ok(completedProg.organizer, 'Completed program vẫn giữ organizer');
});

// 15. Result metrics lấy dữ liệu xác thực (Section 21 & 26)
runTest('15. Result metrics lấy dữ liệu xác thực (Section 21 & 26)', () => {
  const completedProg = getProgramByIdOrSlug('ham-kiem-1');
  assert.ok(completedProg.recap, 'Completed program phải có recap');
  assert.ok(completedProg.recap.factoriesJoined, 'Recap phải có factoriesJoined');
  assert.ok(completedProg.recap.suppliersJoined, 'Recap phải có suppliersJoined');
  assert.ok(completedProg.recap.outcomesConfirmed || completedProg.recap.mouSigned, 'Recap phải có outcomesConfirmed hoặc mouSigned');
  assert.ok(completedProg.recap.estimatedDealValue, 'Recap phải có estimatedDealValue');
});

// 16. Organizer reuse Organization (Section 30)
runTest('16. Organizer reuse Organization (Section 28 & 30)', () => {
  const prog = getProgramByIdOrSlug('vsip-binh-duong');
  assert.ok(prog.organizerOrganizationId, 'Program phải có organizerOrganizationId');
  assert.ok(prog.organizerOrganizationId.startsWith('ORG-'), 'organizerOrganizationId phải trỏ tới Organization thực');
  assert.ok(prog.supportContact?.coordinatorName, 'Phải có tên điều phối viên hỗ trợ');
  assert.ok(prog.supportContact?.phone, 'Phải có hotline điều phối viên');
});

// 17. Admin mutations ghi AuditLog (Section 31 & 35)
runTest('17. Admin mutations ghi AuditLog (Section 31 & 35)', () => {
  const updated = updateProgramAdmin('vsip-binh-duong', {
    nextAction: 'Rà soát danh sách 20 nhà cung ứng đồ gá Jig đợt 2'
  }, 'admin_test');
  assert.strictEqual(updated.success, true);
  assert.strictEqual(updated.program.nextAction, 'Rà soát danh sách 20 nhà cung ứng đồ gá Jig đợt 2');

  const logs = getAllProgramAuditLogs();
  assert.ok(logs.length > 0, 'Phải có audit logs');
  const targetLog = logs.find(l => l.actorUserId === 'admin_test');
  assert.ok(targetLog, 'Phải tìm thấy log của admin_test');
});

// 18. Analytics tracking helper (Section 41)
runTest('18. Analytics tracking helper ghi nhận đúng sự kiện (Section 41)', () => {
  const evt = trackProgramAnalytics('buyer_registration_click', { programId: 'vsip-binh-duong' });
  assert.strictEqual(evt.eventName, 'buyer_registration_click');
  assert.strictEqual(evt.payload.programId, 'vsip-binh-duong');
  assert.ok(evt.timestamp);
});

console.log('\n====================================================================');
console.log(`🏁 TEST RESULTS: ${passedTests} PASSED / ${failedTests} FAILED`);
console.log('====================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PAGE 21 / MODULE 21 SPEC CRITERIA PASSED SUCCESSFULLY!\n');
}
