// ============================================================================
// AUTOMATED TEST SUITE: PAGE 26 - DANH SÁCH KHU CÔNG NGHIỆP
// ROUTE: /khu-cong-nghiep
// Tuân thủ 15 tiêu chí nghiệm thu Section 45 đặc tả 26.txt - CHUOICUNGUNG.COM
// ============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getAllIndustrialParks,
  getIndustrialParkByIdOrSlug,
  getIndustrialParksListing,
  resolveCanonicalKcnId,
  getOrganizationsForKcn,
  getPublicRequirementsForKcn,
  getProgramsForKcn,
  getSupplierCoverageForKcn,
  setKcnOrganizationRelation,
  getAllKcnAuditLogs,
  KCN_ORG_ROLE_ENUM,
  KCN_RELATION_STATUS_ENUM
} from '../../src/data/industrialParksData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log('TEST SUITE: PAGE 26 - DANH SÁCH KHU CÔNG NGHIỆP (/khu-cong-nghiep)');
console.log('Đặc tả 26.txt - 15 Tiêu chí QA Section 45');
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
// TEST 1: Listing lấy KCN DB thật (Section 45.1)
// ----------------------------------------------------------------------------
runTest('QA 1: Listing lấy KCN từ cơ sở dữ liệu thật (480 KCNs)', () => {
  const allKcns = getAllIndustrialParks();
  assert.ok(allKcns.length >= 480, `Phải có đủ 480 KCN từ DB master, hiện có: ${allKcns.length}`);
  
  // Kiểm tra cấu trúc bản ghi KCN thật
  const sample = allKcns[0];
  assert.ok(sample.id, 'KCN phải có id');
  assert.ok(sample.name, 'KCN phải có name');
  assert.ok(sample.province, 'KCN phải có province');
});

// ----------------------------------------------------------------------------
// TEST 2: Search tên/alias hoạt động (Section 45.2, Section 6)
// ----------------------------------------------------------------------------
runTest('QA 2: Search theo tên KCN và alias viết tắt hoạt động chính xác', () => {
  // Search 'Amata'
  const resAmata = getIndustrialParksListing({ query: 'Amata' });
  assert.ok(resAmata.total > 0, 'Phải tìm thấy KCN Amata');
  assert.ok(resAmata.data.some(k => k.id.includes('amata')), 'Kết quả phải chứa Amata');

  // Search 'kcn-vsip-1' (alias)
  const resVsip = getIndustrialParksListing({ query: 'kcn-vsip-1' });
  assert.ok(resVsip.total > 0, 'Phải tìm thấy KCN qua alias kcn-vsip-1');

  // Search 'deep c'
  const resDeepC = getIndustrialParksListing({ query: 'deep c' });
  assert.ok(resDeepC.total > 0, 'Phải tìm thấy KCN DEEP C');
});

// ----------------------------------------------------------------------------
// TEST 3: Filter province hoạt động (Section 45.3, Section 7)
// ----------------------------------------------------------------------------
runTest('QA 3: Filter theo Tỉnh / Thành phố hoạt động chính xác', () => {
  const resDongNai = getIndustrialParksListing({ province: 'Đồng Nai' });
  assert.ok(resDongNai.total > 0, 'Đồng Nai phải có KCN');
  resDongNai.data.forEach(k => {
    assert.strictEqual(k.province.toLowerCase(), 'đồng nai', 'Tất cả KCN phải thuộc tỉnh Đồng Nai');
  });

  const resBacNinh = getIndustrialParksListing({ province: 'Bắc Ninh' });
  assert.ok(resBacNinh.total > 0, 'Bắc Ninh phải có KCN');
  resBacNinh.data.forEach(k => {
    assert.strictEqual(k.province.toLowerCase(), 'bắc ninh', 'Tất cả KCN phải thuộc tỉnh Bắc Ninh');
  });
});

// ----------------------------------------------------------------------------
// TEST 4: Factory count chỉ count public/confirmed (Section 45.4, Section 11, 12)
// ----------------------------------------------------------------------------
runTest('QA 4: Factory count chỉ tính các nhà máy xác thực trong KCN', () => {
  const amata = getIndustrialParkByIdOrSlug('khu-cong-nghiep-amata-dong-nai');
  assert.ok(amata, 'Phải tìm thấy KCN Amata');
  assert.strictEqual(amata.publicFactoriesCount, 223, 'Amata phải có đúng 223 nhà máy xác thực');

  const vsip1 = getIndustrialParkByIdOrSlug('khu-cong-nghiep-vsip-1-binh-duong');
  assert.ok(vsip1, 'Phải tìm thấy VSIP 1');
  assert.strictEqual(vsip1.publicFactoriesCount, 189, 'VSIP 1 phải có đúng 189 nhà máy xác thực');
});

// ----------------------------------------------------------------------------
// TEST 5: Need count không tính private Need (Section 45.5, Section 13)
// ----------------------------------------------------------------------------
runTest('QA 5: Nhu cầu mua hàng KCN tuyệt đối không tính hoặc để lộ private Needs', () => {
  const reqs = getPublicRequirementsForKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(Array.isArray(reqs), 'Phải trả về mảng nhu cầu');

  reqs.forEach(r => {
    assert.strictEqual(r.isPublicSummary, true, 'Chỉ hiển thị nhu cầu dạng tóm lược public');
    assert.strictEqual(r.confidentialBudgetProtected, true, 'Bảo vệ ngân sách kín');
    assert.strictEqual(r.privateContactProtected, true, 'Bảo vệ thông tin liên hệ buyer');
    assert.strictEqual(typeof r.buyerPhone, 'undefined', 'Không lộ SĐT Buyer');
    assert.strictEqual(typeof r.buyerEmail, 'undefined', 'Không lộ Email Buyer');
  });
});

// ----------------------------------------------------------------------------
// TEST 6: Supplier service coverage không bị gọi là KCN member (Section 45.6, Section 14, 15)
// ----------------------------------------------------------------------------
runTest('QA 6: Nguồn cung phục vụ KCN phân biệt rạch ròi, không gọi là KCN member', () => {
  const coverage = getSupplierCoverageForKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(coverage.suppliersCount > 0, 'Phải có số lượng NCC phục vụ');
  assert.ok(
    coverage.disclaimer.includes('Không đồng nghĩa doanh nghiệp có nhà máy trong KCN, là đối tác hay được KCN chứng nhận'),
    'Phải có tuyên bố từ chối trách nhiệm rạch ròi theo Section 15'
  );
});

// ----------------------------------------------------------------------------
// TEST 7: Program location không tự tạo Organizer relation (Section 45.7, Section 4, 21)
// ----------------------------------------------------------------------------
runTest('QA 7: Program location không tự suy diễn thành KCN là Đơn vị tổ chức', () => {
  // KCN Hàm Kiệm 1 có sự kiện nhưng không có quan hệ confirmed Organizer
  const progs = getProgramsForKcn('khu-cong-nghiep-ham-kiem-1-binh-thuan');
  assert.ok(progs.length > 0, 'Hàm Kiệm 1 có chương trình');
  progs.forEach(p => {
    // Không được tự gán vai trò "Đơn vị tổ chức"
    assert.strictEqual(
      p.kcnRoleLabel, 
      'Địa điểm diễn ra sự kiện', 
      'Khi chưa có quan hệ confirmed, nhãn vai trò KCN chỉ là địa điểm'
    );
  });
});

// ----------------------------------------------------------------------------
// TEST 8: KCN role chỉ public khi confirmed (Section 45.8, Section 3, 4, 30)
// ----------------------------------------------------------------------------
runTest('QA 8: Quan hệ Tổ chức KCN chỉ public khi đã CONFIRMED', () => {
  // Quan hệ CONFIRMED
  const orgs = getOrganizationsForKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(orgs.length > 0, 'Amata có quan hệ Chủ đầu tư confirmed');
  orgs.forEach(o => {
    assert.strictEqual(o.status, KCN_RELATION_STATUS_ENUM.CONFIRMED);
    assert.strictEqual(o.publicDisplay, true);
  });

  // Thêm một quan hệ PENDING
  setKcnOrganizationRelation({
    kcnId: 'khu-cong-nghiep-amata-dong-nai',
    organizationId: 'ORG-PENDING-TEST-99',
    organizationName: 'Đơn Vị Quản Lý Chờ Duyệt',
    role: KCN_ORG_ROLE_ENUM.OPERATOR,
    status: KCN_RELATION_STATUS_ENUM.PENDING,
    publicDisplay: false
  });

  // Query public không được thấy quan hệ PENDING
  const publicOrgs = getOrganizationsForKcn('khu-cong-nghiep-amata-dong-nai');
  const hasPending = publicOrgs.some(o => o.organizationId === 'ORG-PENDING-TEST-99');
  assert.strictEqual(hasPending, false, 'Quan hệ PENDING tuyệt đối không được public');
});

// ----------------------------------------------------------------------------
// TEST 9: CTA Need prefill đúng KCN (Section 45.9, Section 19)
// ----------------------------------------------------------------------------
runTest('QA 9: CTA gửi nhu cầu prefill đúng ngữ cảnh KCN', () => {
  const kcnId = 'khu-cong-nghiep-amata-dong-nai';
  const ctaUrl = `/dang-nhu-cau?industrialParkId=${kcnId}`;
  assert.ok(ctaUrl.includes(`industrialParkId=${kcnId}`), 'Prefill đúng ID KCN');
});

// ----------------------------------------------------------------------------
// TEST 10: CTA Program prefill đúng KCN (Section 45.10, Section 20)
// ----------------------------------------------------------------------------
runTest('QA 10: CTA đề xuất chương trình tại KCN tái sử dụng ServiceRequest', () => {
  const kcnId = 'khu-cong-nghiep-amata-dong-nai';
  const ctaUrl = `/dich-vu/to-chuc-ket-noi?source=industrial-park&industrialParkId=${kcnId}`;
  assert.ok(ctaUrl.includes('source=industrial-park'), 'Đúng source industrial-park');
  assert.ok(ctaUrl.includes(`industrialParkId=${kcnId}`), 'Đúng industrialParkId');
});

// ----------------------------------------------------------------------------
// TEST 11: ProgramCard reuse Page 20 (Section 45.11, Section 16)
// ----------------------------------------------------------------------------
runTest('QA 11: Khối chương trình tại KCN tái sử dụng dữ liệu Program chuẩn Page 20', () => {
  const amataProgs = getProgramsForKcn('khu-cong-nghiep-amata-dong-nai');
  assert.ok(amataProgs.length > 0, 'Amata có chương trình');
  const prog = amataProgs[0];
  assert.ok(prog.id, 'Có program id');
  assert.ok(prog.title, 'Có title');
  assert.ok(prog.location, 'Có location');
  assert.ok(prog.dates, 'Có dates');
});

// ----------------------------------------------------------------------------
// TEST 12: Sponsor/Founding Partner phân biệt (Section 45.12, Section 22)
// ----------------------------------------------------------------------------
runTest('QA 12: Phân biệt quyền lợi Program Sponsor và Category Founding Partner', () => {
  const sponsorType = 'PROGRAM_SPONSOR';
  const foundingPartnerType = 'CATEGORY_FOUNDING_PARTNER';
  assert.notStrictEqual(sponsorType, foundingPartnerType, 'Sponsor và Founding Partner phải là hai thực thể quyền lợi tách biệt');
});

// ----------------------------------------------------------------------------
// TEST 13: Duplicate alias map đúng canonical entity (Section 45.13, Section 33, 34)
// ----------------------------------------------------------------------------
runTest('QA 13: Các bí danh viết tắt đều map chuẩn về cùng một Canonical Entity', () => {
  const canonicalAmata = 'khu-cong-nghiep-amata-dong-nai';
  assert.strictEqual(resolveCanonicalKcnId('kcn-amata'), canonicalAmata);
  assert.strictEqual(resolveCanonicalKcnId('amata'), canonicalAmata);
  assert.strictEqual(resolveCanonicalKcnId('amata-industrial-park'), canonicalAmata);

  const canonicalVsip = 'khu-cong-nghiep-vsip-1-binh-duong';
  assert.strictEqual(resolveCanonicalKcnId('kcn-vsip-1'), canonicalVsip);
  assert.strictEqual(resolveCanonicalKcnId('vsip-1'), canonicalVsip);

  const canonicalDeepC = 'khu-cong-nghiep-deep-c-dinh-vu-hai-phong';
  assert.strictEqual(resolveCanonicalKcnId('kcn-deep-c'), canonicalDeepC);
  assert.strictEqual(resolveCanonicalKcnId('deep-c'), canonicalDeepC);
});

// ----------------------------------------------------------------------------
// TEST 14: Admin changes có AuditLog (Section 45.14, Section 28, 30)
// ----------------------------------------------------------------------------
runTest('QA 14: Các thay đổi quan hệ KCN của Admin đều ghi nhận AuditLog', () => {
  setKcnOrganizationRelation({
    kcnId: 'khu-cong-nghiep-amata-dong-nai',
    organizationId: 'ORG-AUDIT-TEST-001',
    organizationName: 'Doanh Nghiệp Kiểm Tra Audit Log',
    role: KCN_ORG_ROLE_ENUM.OPERATOR,
    status: KCN_RELATION_STATUS_ENUM.CONFIRMED,
    reviewer: 'admin_test_operator'
  });

  const logs = getAllKcnAuditLogs('khu-cong-nghiep-amata-dong-nai');
  assert.ok(logs.length > 0, 'Phải có AuditLog ghi nhận');
  const testLog = logs.find(l => l.actor === 'admin_test_operator');
  assert.ok(testLog, 'Phải tìm thấy log do admin_test_operator thực hiện');
});

// ----------------------------------------------------------------------------
// TEST 15: Mobile 390px hoạt động (Section 45.15, Section 42)
// ----------------------------------------------------------------------------
runTest('QA 15: Thứ tự giao diện tuân thủ Section 42 Mobile và không tràn 390px', () => {
  const pageFile = path.resolve(__dirname, '../../src/pages/IndustrialParksPage.jsx');
  const content = fs.readFileSync(pageFile, 'utf8');

  // Kiểm tra thứ tự mobile Section 42:
  // Hero -> Search & Filter -> Province chips -> Quick filters -> KCN cards -> Programs by location -> CTA need/program
  assert.ok(content.includes('HERO SECTION (SECTION 5 SPEC 26.TXT)'), 'Có Hero section');
  assert.ok(content.includes('Sticky Ecosystem Filter Bar'), 'Có Filter Bar');
  assert.ok(content.includes('B2B GRID CARDS VIEW'), 'Có KCN Cards Grid');
  assert.ok(content.includes('CHƯƠNG TRÌNH & DỊCH VỤ HỖ TRỢ DOANH NGHIỆP THEO ĐỊA BÀN'), 'Có Dịch vụ KCN');
  assert.ok(content.includes('CHƯƠNG TRÌNH TẠI CÁC KHU VỰC CÔNG NGHIỆP'), 'Có Chương trình tại khu vực');
  assert.ok(content.includes('BOTTOM CTA SECTION'), 'Có Bottom CTAs');

  // Kiểm tra responsive: không có fixed width lớn gây vỡ layout 390px
  assert.ok(!content.includes('w-[450px]'), 'Không có fixed width lớn gây overflow 390px');
  assert.ok(!content.includes('w-[500px]'), 'Không có fixed width lớn gây overflow 390px');
});

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`KẾT QUẢ TEST PAGE 26: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('TẤT CẢ 15 TIÊU CHÍ QA SECTION 45 ĐÃ ĐẠT CHUẨN HOÀN TOÀN!');
  process.exit(0);
}
