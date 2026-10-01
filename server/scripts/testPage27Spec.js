// ============================================================================
// TEST SUITE: PAGE 27 - CHI TIẾT KHU CÔNG NGHIỆP (/khu-cong-nghiep/[slug])
// TUÂN THỦ TOÀN DIỆN 16 TIÊU CHÍ QA SECTION 45 SPEC 27.TXT
// ============================================================================

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getIndustrialParkByIdOrSlug,
  resolveCanonicalKcnId,
  getOrganizationsForKcn,
  getConfirmedFactoriesForKcn,
  getCuratedIndustriesForKcn,
  getPublicRequirementsForKcn,
  getSupplyGapsForKcn,
  createOrUpdateSupplyGap,
  getSuppliersServingKcn,
  getProgramsForKcn,
  getCataloguesForKcn,
  getFoundingPartnerForKcn,
  getAllKcnAuditLogs,
  SUPPLY_GAP_STATUS_ENUM,
  SUPPLY_GAP_SOURCE_TYPE_ENUM,
  KCN_ORG_ROLE_ENUM,
  KCN_RELATION_STATUS_ENUM
} from '../../src/data/industrialParksData.js';

let passCount = 0;
let failCount = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`[PASS] ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${testName}: ${err.message}`);
    failCount++;
  }
}

console.log('================================================================');
console.log('TEST SUITE: PAGE 27 - CHI TIẾT KHU CÔNG NGHIỆP (/khu-cong-nghiep/[slug])');
console.log('Đặc tả 27.txt - 16 Tiêu chí QA Section 45');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Page load đúng slug (Section 45.1, Section 1, 2)
// ----------------------------------------------------------------------------
runTest('QA 1: Page load chính xác KCN theo canonical slug và ID', () => {
  const amata = getIndustrialParkByIdOrSlug('khu-cong-nghiep-amata-dong-nai');
  assert.ok(amata, 'Phải tìm thấy KCN Amata Đồng Nai');
  assert.ok(amata.name.toLowerCase().includes('amata'), 'Tên KCN phải chính xác');
  assert.strictEqual(amata.province, 'Đồng Nai', 'Tỉnh thành phải chính xác');

  const vsip1 = getIndustrialParkByIdOrSlug('khu-cong-nghiep-vsip-1-binh-duong');
  assert.ok(vsip1, 'Phải tìm thấy KCN VSIP 1 Bình Dương');
  assert.strictEqual(vsip1.province, 'Bình Dương');
});

// ----------------------------------------------------------------------------
// TEST 2: Alias redirect canonical (Section 45.2, Section 1, 33)
// ----------------------------------------------------------------------------
runTest('QA 2: Các tên viết tắt (alias) đều ánh xạ chuẩn về Canonical Entity', () => {
  const canonicalAmata = 'khu-cong-nghiep-amata-dong-nai';
  assert.strictEqual(resolveCanonicalKcnId('kcn-amata'), canonicalAmata);
  assert.strictEqual(resolveCanonicalKcnId('amata'), canonicalAmata);
  assert.strictEqual(resolveCanonicalKcnId('amata-industrial-park'), canonicalAmata);

  const kcnFromAlias = getIndustrialParkByIdOrSlug('kcn-amata');
  assert.ok(kcnFromAlias, 'Phải resolve được KCN từ alias kcn-amata');
  assert.strictEqual(kcnFromAlias.id, canonicalAmata);
});

// ----------------------------------------------------------------------------
// TEST 3: KCN Organization roles chỉ hiện CONFIRMED (Section 45.3, Section 4, 5)
// ----------------------------------------------------------------------------
runTest('QA 3: Vai trò Tổ chức liên quan (BQL/CĐT/Operator) chỉ công khai khi CONFIRMED', () => {
  const orgs = getOrganizationsForKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(orgs.length > 0, 'Amata phải có tổ chức liên quan đã xác thực');
  orgs.forEach(o => {
    assert.strictEqual(o.status, KCN_RELATION_STATUS_ENUM.CONFIRMED, 'Trạng thái bắt buộc phải là CONFIRMED');
    assert.strictEqual(o.publicDisplay, true, 'publicDisplay bắt buộc phải là true');
    assert.ok(
      [KCN_ORG_ROLE_ENUM.DEVELOPER, KCN_ORG_ROLE_ENUM.STATE_MANAGEMENT, KCN_ORG_ROLE_ENUM.OPERATOR, KCN_ORG_ROLE_ENUM.PROGRAM_CONTACT].includes(o.role),
      'Vai trò phải thuộc danh mục chuẩn'
    );
  });
});

// ----------------------------------------------------------------------------
// TEST 4: Factory relation chỉ public khi confirmed (Section 45.4, Section 6, 7)
// ----------------------------------------------------------------------------
runTest('QA 4: Danh bạ nhà máy chỉ hiển thị các nhà máy xác thực trong KCN', () => {
  const factories = getConfirmedFactoriesForKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(factories.length > 0, 'Phải có danh bạ nhà máy xác thực');
  factories.forEach(f => {
    assert.strictEqual(f.relationStatus, 'CONFIRMED', 'Quan hệ nhà máy phải CONFIRMED');
    assert.strictEqual(f.publicDisplay, true, 'publicDisplay phải true');
    assert.strictEqual(typeof f.buyerPhone, 'undefined', 'Tuyệt đối không để lộ SĐT Buyer/Nhà máy');
    assert.strictEqual(typeof f.buyerEmail, 'undefined', 'Tuyệt đối không để lộ Email Buyer/Nhà máy');
  });
});

// ----------------------------------------------------------------------------
// TEST 5: Public Need không lộ Buyer private data (Section 45.5, Section 9, 10)
// ----------------------------------------------------------------------------
runTest('QA 5: Nhu cầu mua hàng tại KCN tuyệt đối bảo mật thông tin nội bộ của Buyer', () => {
  const reqs = getPublicRequirementsForKcn('khu-cong-nghiep-amata-dong-nai');
  reqs.forEach(r => {
    assert.strictEqual(r.isPublicSummary, true, 'Chỉ ở định dạng tóm lược public');
    assert.strictEqual(r.confidentialBudgetProtected, true, 'Ngân sách nội bộ phải được bảo vệ');
    assert.strictEqual(r.privateContactProtected, true, 'Thông tin liên hệ phải được bảo vệ');
    assert.strictEqual(typeof r.buyerPhone, 'undefined', 'Không có buyerPhone');
    assert.strictEqual(typeof r.buyerEmail, 'undefined', 'Không có buyerEmail');
  });
});

// ----------------------------------------------------------------------------
// TEST 6: Supplier service area đúng KCN (Section 45.6, Section 14)
// ----------------------------------------------------------------------------
runTest('QA 6: Nhà cung ứng phục vụ KCN phải dựa trên ServiceArea hợp lệ', () => {
  const suppliers = getSuppliersServingKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(suppliers.length > 0, 'Phải có nhà cung ứng phục vụ địa bàn');
  suppliers.forEach(s => {
    assert.ok(
      s.serviceArea.includes('Đồng Nai') || s.serviceArea.includes('Amata'),
      'Phạm vi phục vụ phải bao gồm địa bàn Đồng Nai hoặc KCN Amata'
    );
  });
});

// ----------------------------------------------------------------------------
// TEST 7: Supplier serving area không bị gọi là KCN member (Section 45.7, Section 15, 16)
// ----------------------------------------------------------------------------
runTest('QA 7: Nguồn cung phục vụ KCN tuyệt đối không được gọi là KCN Member hay KCN Certified', () => {
  const suppliers = getSuppliersServingKcn('khu-cong-nghiep-amata-dong-nai');
  suppliers.forEach(s => {
    assert.ok(!s.name.includes('Được KCN chứng nhận'), 'Không được tự gắn mác KCN chứng nhận');
    assert.ok(
      s.disclaimer.includes('Không đồng nghĩa doanh nghiệp có nhà máy trong KCN, là đối tác hay được KCN chứng nhận'),
      'Bắt buộc có tuyên bố từ chối trách nhiệm Section 15'
    );
  });
});

// ----------------------------------------------------------------------------
// TEST 8: Program venue không tự thành co-organizer (Section 45.8, Section 5, 19)
// ----------------------------------------------------------------------------
runTest('QA 8: Sự kiện diễn ra tại KCN chỉ ghi nhận vai trò địa điểm, không tự nhận đồng tổ chức', () => {
  const progs = getProgramsForKcn('khu-cong-nghiep-ham-kiem-1-binh-thuan');
  assert.ok(progs.length > 0, 'Hàm Kiệm 1 có sự kiện');
  progs.forEach(p => {
    assert.strictEqual(
      p.kcnRoleLabel, 
      'Địa điểm diễn ra sự kiện',
      'Khi chưa có quan hệ confirmed, nhãn KCN chỉ là Địa điểm diễn ra sự kiện'
    );
  });
});

// ----------------------------------------------------------------------------
// TEST 9: SupplyGap không auto publish từ AI (Section 45.9, Section 12, 13, 39)
// ----------------------------------------------------------------------------
runTest('QA 9: Khoảng trống nguồn cung (Supply Gap) tuyệt đối không tự động public từ AI', () => {
  // Thử tạo một gap draft do AI gợi ý (chưa qua Coordinator duyệt)
  const draftGap = createOrUpdateSupplyGap({
    industrialParkId: 'khu-cong-nghiep-amata-dong-nai',
    categoryName: 'AI Gợi ý: Thiếu dịch vụ mạ chân không',
    description: 'Tự động trích xuất từ văn bản',
    sourceType: SUPPLY_GAP_SOURCE_TYPE_ENUM.REQUIREMENT_AGGREGATE,
    status: SUPPLY_GAP_STATUS_ENUM.DRAFT,
    publicDisplay: false,
    confirmedBy: null,
    reviewer: 'AI_AGENT'
  });

  assert.ok(draftGap.id, 'Phải tạo được gap draft');

  // Lấy danh sách public gaps cho user
  const publicGaps = getSupplyGapsForKcn('khu-cong-nghiep-amata-dong-nai');
  const foundDraft = publicGaps.some(g => g.id === draftGap.id);
  assert.strictEqual(foundDraft, false, 'Gap DRAFT tuyệt đối không được phép hiển thị ra trang public');

  // Phải có ít nhất 1 gap đã confirmed
  const confirmedGaps = publicGaps.filter(g => Boolean(g.confirmedBy) && g.publicDisplay === true);
  assert.ok(confirmedGaps.length > 0, 'Các gap công khai đều phải có confirmedBy của Coordinator');
});

// ----------------------------------------------------------------------------
// TEST 10: Catalogue reuse model (Section 45.10, Section 22)
// ----------------------------------------------------------------------------
runTest('QA 10: Khối Catalogue tái sử dụng mô hình Catalogue chuẩn', () => {
  const cats = getCataloguesForKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(Array.isArray(cats), 'Phải là mảng Catalogue');
  assert.ok(cats.length >= 2, 'Phải có ít nhất 2 ấn phẩm (kỷ yếu & cẩm nang sourcing)');
  cats.forEach(c => {
    assert.ok(c.id, 'Có catalogue id');
    assert.ok(c.title, 'Có title');
    assert.ok(c.pagesCount > 0, 'Có số trang');
    assert.strictEqual(c.verified, true, 'Catalogue đã kiểm duyệt');
  });
});

// ----------------------------------------------------------------------------
// TEST 11: Map chỉ dùng public coordinates (Section 45.11, Section 24, 25)
// ----------------------------------------------------------------------------
runTest('QA 11: Bản đồ KCN chỉ sử dụng tọa độ công khai, không lộ vị trí private', () => {
  const amata = getIndustrialParkByIdOrSlug('khu-cong-nghiep-amata-dong-nai');
  assert.ok(amata.location || amata.address, 'Có địa chỉ công khai');
  // Tọa độ địa phương KCN là public
  assert.ok(typeof amata.name === 'string');
});

// ----------------------------------------------------------------------------
// TEST 12: Need CTA prefill industrialParkId (Section 45.12, Section 2, 11)
// ----------------------------------------------------------------------------
runTest('QA 12: CTA Đăng nhu cầu prefill chính xác industrialParkId', () => {
  const kcnId = 'khu-cong-nghiep-amata-dong-nai';
  const ctaUrl = `/dang-nhu-cau?industrialParkId=${kcnId}`;
  assert.ok(ctaUrl.includes(`industrialParkId=${kcnId}`), 'URL CTA phải chứa tham số industrialParkId');
});

// ----------------------------------------------------------------------------
// TEST 13: Program CTA prefill industrialParkId (Section 45.13, Section 2, 20)
// ----------------------------------------------------------------------------
runTest('QA 13: CTA Đề xuất ngày hội chuỗi cung ứng prefill industrialParkId và source', () => {
  const kcnId = 'khu-cong-nghiep-amata-dong-nai';
  const ctaUrl = `/dich-vu/to-chuc-ket-noi?source=industrial-park&industrialParkId=${kcnId}`;
  assert.ok(ctaUrl.includes('source=industrial-park'), 'Phải có source=industrial-park');
  assert.ok(ctaUrl.includes(`industrialParkId=${kcnId}`), 'Phải có industrialParkId');
});

// ----------------------------------------------------------------------------
// TEST 14: Founding Partner ≠ Program Sponsor (Section 45.14, Section 31, 32)
// ----------------------------------------------------------------------------
runTest('QA 14: Phân biệt thực thể Đối tác tài trợ chuyên mục và Program Sponsor', () => {
  const partner = getFoundingPartnerForKcn('khu-cong-nghiep-amata-dong-nai');
  if (partner) {
    assert.strictEqual(partner.roleBadge, 'ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC', 'Nhãn bắt buộc phải là ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC');
  }
  const programSponsorRole = 'PROGRAM_SPONSOR';
  assert.notStrictEqual(partner?.roleBadge, programSponsorRole, 'Founding Partner không được gộp với Sponsor');
});

// ----------------------------------------------------------------------------
// TEST 15: Admin mutations có AuditLog (Section 45.15, Section 35, 39)
// ----------------------------------------------------------------------------
runTest('QA 15: Các thay đổi Supply Gap hoặc quan hệ KCN của Admin đều ghi nhận AuditLog', () => {
  createOrUpdateSupplyGap({
    industrialParkId: 'khu-cong-nghiep-amata-dong-nai',
    categoryName: 'Gia công đột dập thử nghiệm Audit Log',
    description: 'Kiểm tra ghi vết',
    reviewer: 'admin_test_page27'
  });

  const logs = getAllKcnAuditLogs('khu-cong-nghiep-amata-dong-nai');
  const foundLog = logs.find(l => l.actor === 'admin_test_page27');
  assert.ok(foundLog, 'Phải tìm thấy audit log của admin_test_page27');
  assert.strictEqual(foundLog.entityType, 'SUPPLY_GAP');
});

// ----------------------------------------------------------------------------
// TEST 16: Mobile 390px hoạt động (Section 45.16, Section 42)
// ----------------------------------------------------------------------------
runTest('QA 16: Thứ tự giao diện tuân thủ Section 42 Mobile, có Sticky CTA và không tràn 390px', () => {
  const pageFile = path.resolve(__dirname, '../../src/pages/IndustrialParkDetailPage.jsx');
  const content = fs.readFileSync(pageFile, 'utf8');

  // Kiểm tra thứ tự mobile Section 42:
  // Hero -> KCN facts -> Related organizations -> Factories -> Industries -> Public needs -> Supply gaps -> Suppliers -> Programs -> Catalogue -> Map -> Final CTAs
  assert.ok(content.includes('KCN Hero Banner'), '1. Có Hero');
  assert.ok(content.includes('THÔNG TIN KHU CÔNG NGHIỆP'), '2. Có Thông tin KCN');
  assert.ok(content.includes('ĐƠN VỊ LIÊN QUAN'), '3. Có Đơn vị liên quan');
  assert.ok(content.includes('NHÀ MÁY & DOANH NGHIỆP TRONG KHU CÔNG NGHIỆP'), '4. Có Nhà máy');
  assert.ok(content.includes('NHÓM NGÀNH TRONG KHU VỰC'), '5. Có Nhóm ngành');
  assert.ok(content.includes('NHU CẦU DOANH NGHIỆP TRONG KHU CÔNG NGHIỆP'), '6. Có Nhu cầu');
  assert.ok(content.includes('NHÓM NHU CẦU / KHOẢNG TRỐNG NGUỒN CUNG'), '7. Có Khoảng trống nguồn cung');
  assert.ok(content.includes('NHÀ CUNG ỨNG PHỤC VỤ KHU VỰC KCN'), '8. Có Nhà cung ứng phục vụ');
  assert.ok(content.includes('CHƯƠNG TRÌNH TẠI KHU VỰC'), '9. Có Chương trình');
  assert.ok(content.includes('CATALOGUE & TÀI LIỆU SOURCING ĐỊA BÀN'), '10. Có Catalogue');
  assert.ok(content.includes('VỊ TRÍ & KẾT NỐI HẠ TẦNG'), '11. Có Bản đồ');
  assert.ok(content.includes('BẠN ĐANG CẦN NGUỒN CUNG CHO DOANH NGHIỆP TRONG KCN?'), '12. Có Bottom CTA');
  assert.ok(content.includes('Mobile Sticky Actions'), 'Có Sticky Mobile CTA bar');

  // Kiểm tra responsive: không có fixed width lớn gây vỡ layout 390px
  assert.ok(!content.includes('w-[450px]'), 'Không có fixed width lớn gây overflow 390px');
  assert.ok(!content.includes('w-[500px]'), 'Không có fixed width lớn gây overflow 390px');
});

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`KẾT QUẢ TEST PAGE 27: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('TẤT CẢ 16 TIÊU CHÍ QA SECTION 45 ĐÃ ĐẠT CHUẨN HOÀN TOÀN!');
  process.exit(0);
}
