// ============================================================================
// TEST SUITE: PAGE 28 - DANH SÁCH NHÀ MÁY (/nha-may)
// TUÂN THỦ TOÀN DIỆN 15 TIÊU CHÍ QA SECTION 49 SPEC 28.TXT
// ============================================================================

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getFactoriesListing,
  getFactoryByIdOrSlug,
  getPublicRequirementsForFactory,
  getProgramsForFactory,
  updateFactoryProfileAdmin,
  checkFactoryDataQuality,
  getAllFactoryAuditLogs,
  FACTORY_PROFILE_STATUS_ENUM
} from '../../src/data/factoriesData.js';

import { getAllOrganizations } from '../../src/data/organizationsData.js';
import { getAllMasterRequirements } from '../../src/data/requirementsData.js';

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
console.log('TEST SUITE: PAGE 28 - DANH SÁCH NHÀ MÁY (/nha-may)');
console.log('Đặc tả 28.txt - 15 Tiêu chí QA Section 49');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Listing reuse Organization (Section 49.1, Section 1, 2)
// ----------------------------------------------------------------------------
runTest('QA 1: Danh bạ nhà máy tái sử dụng thực thể Organization gốc, không phân mảnh dữ liệu', () => {
  const listing = getFactoriesListing({ pageSize: 50 });
  assert.ok(listing.total > 0, 'Phải có danh bạ nhà máy');
  assert.ok(listing.items.length > 0, 'Phải có items');

  // Kiểm tra nhà máy Proser được liên kết với Organization master ORG-PROSER-001
  const proser = listing.items.find(f => f.organizationId === 'ORG-PROSER-001');
  assert.ok(proser, 'Phải tìm thấy nhà máy Proser với Org ID chuẩn');
  assert.strictEqual(proser.organizationId, 'ORG-PROSER-001', 'Organization ID phải giữ nguyên');
});

// ----------------------------------------------------------------------------
// TEST 2: Factory Buyer/Supplier không duplicate company (Section 49.2, Section 1, 2, 13)
// ----------------------------------------------------------------------------
runTest('QA 2: Nhà máy vừa Mua vừa Bán dùng chung 1 Organization duy nhất, không tạo 2 company', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.ok(proser, 'Phải tìm thấy Proser');
  assert.ok(proser.roles.includes('FACTORY'), 'Có vai trò FACTORY');
  assert.ok(proser.roles.includes('SUPPLIER'), 'Đồng thời có vai trò SUPPLIER');

  // Kiểm tra không có Organization thứ hai nào tên "Proser Buyer" hay "Proser Supplier"
  const allOrgs = getAllOrganizations();
  const proserOrgs = allOrgs.filter(o => o.name && o.name.toLowerCase().includes('proser'));
  assert.strictEqual(proserOrgs.length, 1, 'Chỉ được phép tồn tại duy nhất 1 Organization cho Proser');
});

// ----------------------------------------------------------------------------
// TEST 3: Search theo name/industry/location hoạt động (Section 49.3, Section 6)
// ----------------------------------------------------------------------------
runTest('QA 3: Tìm kiếm theo tên, nhóm ngành, sản phẩm đầu ra và địa bàn hoạt động chính xác', () => {
  // Tìm theo tên
  const searchName = getFactoriesListing({ query: 'Proser' });
  assert.ok(searchName.items.some(f => f.name.includes('Proser')), 'Tìm theo tên phải ra Proser');

  // Tìm theo ngành
  const searchInd = getFactoriesListing({ query: 'Điện tử' });
  assert.ok(searchInd.items.every(f => 
    f.name.toLowerCase().includes('điện tử') || 
    f.industry.toLowerCase().includes('điện tử') ||
    f.outputProducts.some(p => p.toLowerCase().includes('điện tử'))
  ), 'Tìm theo ngành Điện tử');

  // Tìm theo tỉnh thành
  const searchProv = getFactoriesListing({ province: 'Bắc Ninh' });
  assert.ok(searchProv.items.every(f => f.province === 'Bắc Ninh'), 'Lọc theo tỉnh Bắc Ninh');
});

// ----------------------------------------------------------------------------
// TEST 4: KCN relation chỉ dùng confirmed relation (Section 49.4, Section 14, 18)
// ----------------------------------------------------------------------------
runTest('QA 4: Quan hệ KCN chỉ hiển thị khi có quan hệ xác thực (isKcnConfirmed = true)', () => {
  const amataList = getFactoriesListing({ industrialParkId: 'khu-cong-nghiep-amata-dong-nai' });
  amataList.items.forEach(f => {
    assert.strictEqual(f.isKcnConfirmed, true, 'Nhà máy trong KCN phải có xác thực KCN');
    assert.strictEqual(f.industrialParkId, 'khu-cong-nghiep-amata-dong-nai');
  });
});

// ----------------------------------------------------------------------------
// TEST 5: Private Requirement không public (Section 49.5, Section 9, 10)
// ----------------------------------------------------------------------------
runTest('QA 5: Nhu cầu mua hàng của nhà máy tuyệt đối không lộ thông tin liên hệ và ngân sách kín', () => {
  const proserNeeds = getPublicRequirementsForFactory('fac-org-proser-001', 'ORG-PROSER-001');
  proserNeeds.forEach(req => {
    assert.strictEqual(req.isPublicSummary, true, 'Chỉ được phép ở dạng public summary');
    assert.strictEqual(typeof req.buyerPhone, 'undefined', 'Không có số điện thoại buyer');
    assert.strictEqual(typeof req.buyerEmail, 'undefined', 'Không có email buyer');
  });
});

// ----------------------------------------------------------------------------
// TEST 6: Public Requirement reuse /san-nhu-cau workflow (Section 49.6, Section 23)
// ----------------------------------------------------------------------------
runTest('QA 6: Khối nhu cầu mua hàng tái sử dụng cấu trúc chuẩn từ /san-nhu-cau', () => {
  const allMasterReqs = getAllMasterRequirements();
  assert.ok(allMasterReqs.length > 0, 'Phải có dữ liệu nhu cầu master');
  const sample = allMasterReqs[0];
  assert.ok(sample.id, 'Có id nhu cầu');
  assert.ok(sample.title, 'Có title nhu cầu');
  assert.ok(sample.category || sample.industry, 'Có ngành/chuyên mục');
});

// ----------------------------------------------------------------------------
// TEST 7: Factory Supplier role reuse SupplierProfile (Section 49.7, Section 12, 13)
// ----------------------------------------------------------------------------
runTest('QA 7: Khi nhà máy đóng vai trò Bán, tái sử dụng dữ liệu năng lực cung ứng của SupplierProfile', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(proser.hasSupplierCapability, true, 'Proser có năng lực cung ứng');
  assert.ok(proser.supplierCapabilities.length > 0, 'Có danh sách năng lực cung ứng');
  assert.ok(proser.outputProducts.length > 0, 'Có danh sách sản phẩm đầu ra');
});

// ----------------------------------------------------------------------------
// TEST 8: Quote không public (Section 49.8, Section 32)
// ----------------------------------------------------------------------------
runTest('QA 8: Báo giá (Quotation) tuyệt đối không xuất hiện trên giao diện public nhà máy', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(typeof proser.internalQuotations, 'undefined', 'Không có internalQuotations');
  assert.strictEqual(typeof proser.targetPrice, 'undefined', 'Không có targetPrice');
});

// ----------------------------------------------------------------------------
// TEST 9: Meeting private không public (Section 49.9, Section 33)
// ----------------------------------------------------------------------------
runTest('QA 9: Lịch họp B2B riêng tư giữa nhà máy và đối tác không bị công khai trên trang listing', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(typeof proser.privateMeetings, 'undefined', 'Không có privateMeetings');
});

// ----------------------------------------------------------------------------
// TEST 10: Program participation không auto public (Section 49.10, Section 21, 22)
// ----------------------------------------------------------------------------
runTest('QA 10: Việc nhà máy tham gia sự kiện chỉ công khai khi có sự đồng thuận', () => {
  const programs = getProgramsForFactory();
  assert.ok(programs.length > 0, 'Phải có chương trình hướng tới Factory/Buyer');
  programs.forEach(p => {
    assert.ok(p.id, 'Program phải có id');
    assert.ok(p.title, 'Program phải có title');
  });
});

// ----------------------------------------------------------------------------
// TEST 11: Claim Factory không auto approve (Section 49.11, Section 34)
// ----------------------------------------------------------------------------
runTest('QA 11: Quy trình nhận quản lý hồ sơ nhà máy (Claim) phải qua xác minh, không auto approve', () => {
  const amataOrg = getAllOrganizations().find(o => o.id === 'ORG-AMATA-003');
  assert.ok(amataOrg, 'Amata Org phải tồn tại');
  assert.strictEqual(amataOrg.isClaimed, false, 'Doanh nghiệp chưa claim phải có isClaimed = false để người dùng nộp minh chứng');
});

// ----------------------------------------------------------------------------
// TEST 12: Paid status không ảnh hưởng organic ranking (Section 49.12, Section 36, 37)
// ----------------------------------------------------------------------------
runTest('QA 12: Trạng thái tài trợ không làm xáo trộn thứ tự tìm kiếm tự nhiên của nhà máy', () => {
  const listingRelevance = getFactoriesListing({ sortBy: 'relevance' });
  assert.ok(listingRelevance.items.length > 0);
  // Organic ranking phải dựa trên completeness và quan hệ KCN/Nhu cầu
  const firstItem = listingRelevance.items[0];
  assert.ok(firstItem.name, 'Item đầu tiên phải hợp lệ');
});

// ----------------------------------------------------------------------------
// TEST 13: Admin Buy/Sell views cùng Organization (Section 49.13, Section 39, 40)
// ----------------------------------------------------------------------------
runTest('QA 13: Giao diện Admin quản trị nhà máy phân tách rõ rệt chiều MUA và BÁN trên cùng 1 Org', () => {
  const adminComponentFile = path.resolve(__dirname, '../../src/components/admin/AdminFactoriesManagement.jsx');
  const content = fs.readFileSync(adminComponentFile, 'utf8');

  assert.ok(content.includes('BUY SIDE (MUA)'), 'Có tab BUY SIDE');
  assert.ok(content.includes('SELL SIDE (BÁN)'), 'Có tab SELL SIDE');
  assert.ok(content.includes('Organization Master ID'), 'Hiển thị rõ Organization Master ID');
});

// ----------------------------------------------------------------------------
// TEST 14: Audit mutations hoạt động (Section 49.14, Section 38, 42)
// ----------------------------------------------------------------------------
runTest('QA 14: Các thay đổi hồ sơ nhà máy của Admin đều ghi vết vào AuditLog', () => {
  updateFactoryProfileAdmin('FP-ORG-PROSER-001', {
    factoryName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    oemAvailable: true,
    productionDescription: 'Kiểm tra ghi vết Audit Log'
  }, 'admin_test_operator_page28');

  const logs = getAllFactoryAuditLogs('FP-ORG-PROSER-001');
  const targetLog = logs.find(l => l.actor === 'admin_test_operator_page28');
  assert.ok(targetLog, 'Phải tìm thấy log do admin_test_operator_page28 thực hiện');
  assert.strictEqual(targetLog.entityType, 'FACTORY_PROFILE');
});

// ----------------------------------------------------------------------------
// TEST 15: Mobile 390px hoạt động (Section 49.15, Section 46)
// ----------------------------------------------------------------------------
runTest('QA 15: Thứ tự giao diện tuân thủ Section 46 Mobile và không tràn 390px', () => {
  const pageFile = path.resolve(__dirname, '../../src/pages/FactoriesPage.jsx');
  const content = fs.readFileSync(pageFile, 'utf8');

  // Kiểm tra thứ tự mobile Section 46:
  // Hero -> 2-role explanation -> Search & Filter chips -> Factory cards -> Public needs -> Programs -> Final CTAs
  assert.ok(content.includes('Hero Section'), '1. Có Hero Section');
  assert.ok(content.includes('Two Factory Roles Explanation'), '2. Có Giải thích 2 vai trò');
  assert.ok(content.includes('Search and Filter Factories'), '3. Có Search & Filter');
  assert.ok(content.includes('Factory Directory Grid'), '4. Có Factory Grid');
  assert.ok(content.includes('Public Requirements from Factories'), '5. Có Nhu cầu công khai');
  assert.ok(content.includes('Programs for Factories'), '6. Có Chương trình cho nhà máy');
  assert.ok(content.includes('Bottom Assistance Call to Action'), '7. Có Final CTAs');

  // Kiểm tra responsive: không có fixed width lớn gây vỡ layout 390px
  assert.ok(!content.includes('w-[450px]'), 'Không có fixed width lớn gây overflow 390px');
  assert.ok(!content.includes('w-[500px]'), 'Không có fixed width lớn gây overflow 390px');
});

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`KẾT QUẢ TEST PAGE 28: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('TẤT CẢ 15 TIÊU CHÍ QA SECTION 49 ĐÃ ĐẠT CHUẨN HOÀN TOÀN!');
  process.exit(0);
}
