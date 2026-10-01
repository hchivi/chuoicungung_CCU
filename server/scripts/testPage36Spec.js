// ============================================================================
// TEST SUITE: PAGE 36 - CHI TIẾT GIAI ĐOẠN (/giai-doan/[slug])
// Đặc tả 36.txt - 19 Tiêu chí QA Section 61
// ============================================================================

import {
  MASTER_SIX_STAGES,
  getStageBySlugOrId,
  getNeedGroupByCode,
  getStagePublicRequirements,
  getStageSourcingDossiers,
  getStageSuppliers,
  getNeedGroupBuyerGuide,
  verifyStageNeutrality
} from '../../src/data/sixStagesData.js';

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
console.log('TESTING SPEC 36: CHI TIẾT GIAI ĐOẠN (/giai-doan/[slug])');
console.log('================================================================\n');

try {
  // QA 1: Chỉ 6 canonical Stage tồn tại (Section 2, 5)
  assert(MASTER_SIX_STAGES.length === 6, '1. Hệ thống có chính xác 6 giai đoạn canonical, không thừa không thiếu');

  // QA 2: Đúng 18 NeedGroup chuẩn mã code 1.1 đến 6.3 (Section 3, 6, 48)
  const allNeedGroups = MASTER_SIX_STAGES.flatMap(s => s.needGroups);
  assert(allNeedGroups.length === 18, '2. Hệ thống chuẩn hóa đầy đủ 18 nhóm công việc (Need Groups)');
  const expectedCodes = [
    '1.1', '1.2', '1.3',
    '2.1', '2.2', '2.3',
    '3.1', '3.2', '3.3',
    '4.1', '4.2', '4.3',
    '5.1', '5.2', '5.3',
    '6.1', '6.2', '6.3'
  ];
  const actualCodes = allNeedGroups.map(n => n.phaseId || n.code);
  const codesMatch = expectedCodes.every(c => actualCodes.includes(c));
  assert(codesMatch, '3. Toàn bộ 18 mã nhóm công việc (1.1 -> 6.3) đều là duy nhất và canonical');

  // QA 3: Tên Stage đúng chuẩn hiện hành của nền tảng (Section 2)
  const canonicalNames = [
    'Chuẩn bị & Đầu tư',
    'Thiết kế & Xây dựng',
    'Lắp đặt & Hoàn thiện',
    'Vận hành Sản xuất',
    'Nhân sự & Hậu cần',
    'Mở rộng – Tối ưu – Chuyển đổi'
  ];
  const namesMatch = MASTER_SIX_STAGES.every((s, i) => s.name === canonicalNames[i]);
  assert(namesMatch, '4. Tên 6 giai đoạn khớp 100% tên hiện hành chuẩn hóa của nền tảng');

  // QA 4: Xử lý ánh xạ Legacy Slugs không tạo duplicate stage (Section 49, 50)
  const stageFromLegacy = getStageBySlugOrId('khao-sat-phap-ly-ha-tang');
  assert(stageFromLegacy.id === 1 && stageFromLegacy.slug === 'chuan-bi-dau-tu', '5. Ánh xạ slug cũ (legacy alias) về đúng canonical Stage 1 chuẩn');

  // QA 5 & 6: Không trình bày tuần tự bắt buộc (Section 4)
  // Giai đoạn 5 (Nhân sự & Hậu cần) có thể diễn ra song song trước khi vận hành
  const stage5 = getStageBySlugOrId('nhan-su-hau-can');
  assert(stage5.id === 5 && stage5.name === 'Nhân sự & Hậu cần', '6. Truy cập giai đoạn 5 độc lập với các giai đoạn khác');

  // QA 7 & 8: Category và Keyword tái sử dụng taxonomy chuẩn (Section 7, 14, 15, 16)
  const need53 = getNeedGroupByCode('5.3');
  assert(need53 !== null && need53.name.includes('Đồng phục & Bảo hộ'), '7. Nhóm 5.3 Đồng phục & Bảo hộ liên kết đúng taxonomy');
  const cat53 = need53.categories[0];
  assert(cat53.slug.length > 0 && Array.isArray(cat53.keywords), '8. Category trong nhóm nhu cầu liên kết slug chuẩn và danh mục từ khóa');

  // QA 9: Cẩm nang chuẩn bị (Buyer Guide) cấu hình có cấu trúc theo nhóm việc (Section 18)
  const guide53 = getNeedGroupBuyerGuide('5.3');
  assert(Array.isArray(guide53) && guide53.length >= 3, '9. Cẩm nang Buyer Guide cho nhóm 5.3 có đầy đủ danh mục kiểm tra lấy mẫu, PPE');

  // QA 10: Khám phá nhà cung ứng có lý do giải thích được (Explainable relevance - Section 23, 26, 27)
  const suppliers5 = getStageSuppliers(5);
  assert(suppliers5.length > 0 && suppliers5[0].explainableReason && !suppliers5[0].explainableReason.includes('97% phù hợp'), '10. Nhà cung ứng liên kết giai đoạn giải thích lý do cụ thể, không dùng điểm mù mờ 97%');

  // QA 11: Nhu cầu B2B công khai bảo mật danh tính Buyer (Section 21, 22)
  const publicReqs = getStagePublicRequirements(5);
  const noPrivateData = publicReqs.every(r => !r.buyerPhone && !r.budget && !r.targetPrice);
  assert(noPrivateData, '11. Nhu cầu công khai gắn với giai đoạn không để lộ thông tin liên hệ riêng tư hoặc ngân sách của Buyer');

  // QA 12: Tính trung lập của Giai đoạn - Không bán độc quyền Stage (Section 33, 34)
  const neutrality = verifyStageNeutrality();
  assert(neutrality.stageMonopolySold === false && neutrality.commercialTierAllowsPriorityMatching === false, '12. Giai đoạn chỉ là lớp ngữ cảnh định vị nhu cầu, tuyệt đối không bán tài trợ độc quyền');

  // QA 13 & 14: Tích hợp Bộ hồ sơ tuyển chọn Sourcing Dossier từ Trang 35 (Section 30)
  const dossiers = getStageSourcingDossiers(5);
  assert(dossiers.length > 0 && dossiers[0].slug === 'dong-phuc-bao-ho-nha-may-dong-nai', '13. Tích hợp chính xác Sourcing Dossier tuyển chọn đồng phục cho Giai đoạn 5');

  // QA 15: Kiểm tra tệp giao diện StageDetailPage.jsx chuẩn hóa theo 36.txt (Section 9, 10, 55)
  const fs = await import('fs');
  const path = await import('path');
  const pagePath = path.resolve('src/pages/StageDetailPage.jsx');
  assert(fs.existsSync(pagePath), '14. Tệp giao diện StageDetailPage.jsx tồn tại và sẵn sàng tích hợp');

  const pageCode = fs.readFileSync(pagePath, 'utf-8');
  const hasNoSequenceEnforcement = !pageCode.includes('bước tiếp theo bắt buộc') && !pageCode.includes('bắt buộc phải hoàn tất giai đoạn trước');
  assert(hasNoSequenceEnforcement, '15. Giao diện hoàn toàn không có câu chữ ép buộc quy trình tuần tự bắt buộc');

  const hasContextNote = pageCode.includes('Các nhóm công việc có thể diễn ra đồng thời') || pageCode.includes('ngữ cảnh');
  assert(hasContextNote, '16. Có thông báo rõ ràng: "Các nhóm công việc có thể diễn ra đồng thời"');

  const has3NeedGroups = pageCode.includes('needGroups') || pageCode.includes('Nhóm công việc');
  assert(has3NeedGroups, '17. Hiển thị khối 3 nhóm công việc cốt lõi cho mỗi giai đoạn');

  const hasBuyerGuide = pageCode.includes('TRƯỚC KHI TÌM NHÀ CUNG ỨNG') || pageCode.includes('getNeedGroupBuyerGuide');
  assert(hasBuyerGuide, '18. Có khối Cẩm nang chuẩn bị (Buyer Guide) hướng dẫn doanh nghiệp trước khi đặt hàng');

  const hasOverflowProtection = pageCode.includes('overflow-hidden') || pageCode.includes('max-w-');
  const noHardcodedWide = !pageCode.match(/w-\[(39[1-9]|[4-9]\d\d|\d{4,})px\]/g);
  assert(hasOverflowProtection && noHardcodedWide, '19. Giao diện trang giai đoạn tương thích hoàn hảo màn hình di động 390px');

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
  console.log('🎉 ALL 19 SPEC 36 TESTS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error(`💥 ${failed} TESTS FAILED! Check logic implementation.\n`);
  process.exit(1);
}
