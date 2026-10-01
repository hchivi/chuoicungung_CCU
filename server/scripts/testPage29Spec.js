// ============================================================================
// TEST SUITE: PAGE 29 - CHI TIẾT NHÀ MÁY (/nha-may/[slug])
// TUÂN THỦ TOÀN DIỆN 19 TIÊU CHÍ QA SECTION 52 SPEC 29.TXT - CHUOICUNGUNG.COM
// ============================================================================

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getFactoryByIdOrSlug,
  getPublicRequirementsForFactory,
  getProgramsForFactory,
  getSiblingFactories,
  submitFactoryConnectionRequest,
  getAllFactoryConnectionRequests,
  getAllFactoryAuditLogs,
  updateFactoryProfileAdmin
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
console.log('TEST SUITE: PAGE 29 - CHI TIẾT NHÀ MÁY (/nha-may/[slug])');
console.log('Đặc tả 29.txt - 19 Tiêu chí QA Section 52');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Page load đúng Factory slug (Section 52.1, Section 3)
// ----------------------------------------------------------------------------
runTest('QA 1: Page load đúng Factory slug (Proser & Samsung)', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.ok(proser, 'Phải tìm thấy nhà máy Proser bằng slug');
  assert.strictEqual(proser.slug, 'chuyen-gia-dong-phuc-proser');
  assert.ok(proser.name.includes('Proser'));

  const samsung = getFactoryByIdOrSlug('samsung-electronics-vietnam-bac-ninh');
  assert.ok(samsung, 'Phải tìm thấy nhà máy Samsung bằng slug');
  assert.strictEqual(samsung.slug, 'samsung-electronics-vietnam-bac-ninh');
});

// ----------------------------------------------------------------------------
// TEST 2: Factory relation đúng Organization (Section 52.2, Section 1, 2)
// ----------------------------------------------------------------------------
runTest('QA 2: Quan hệ Factory gắn chặt với Organization master duy nhất', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(proser.organizationId, 'ORG-PROSER-001', 'Organization ID phải chuẩn');
  assert.ok(proser.ownerOrganization, 'Phải có thông tin Organization chủ quản');
  assert.strictEqual(proser.ownerOrganization.id, 'ORG-PROSER-001');
  assert.ok(proser.ownerOrganization.taxCode, 'Phải có mã số thuế');
});

// ----------------------------------------------------------------------------
// TEST 3: Một Organization có nhiều Factory hoạt động (Section 52.3, Section 2, 32, 33)
// ----------------------------------------------------------------------------
runTest('QA 3: Một Organization có nhiều phân xưởng/nhà máy (Multi-facility)', () => {
  // Samsung có nhiều cơ sở (SEV Bắc Ninh, SEVT Thái Nguyên, SEHC TP.HCM)
  const ssFacs = getSiblingFactories('ORG-SAMSUNG-BN', 'FP-SAMSUNG-BN-001');
  assert.ok(ssFacs.length >= 2, 'Samsung phải có ít nhất 2 nhà máy anh em');
  assert.ok(ssFacs.some(f => f.slug.includes('thai-nguyen')), 'Có phân xưởng Thái Nguyên');
  assert.ok(ssFacs.some(f => f.slug.includes('hcmc-ce-complex')), 'Có phân xưởng TP.HCM');

  // Proser có phân xưởng vệ tinh Bình Dương
  const proserSiblings = getSiblingFactories('ORG-PROSER-001', 'FP-ORG-PROSER-001');
  assert.ok(proserSiblings.length >= 1, 'Proser có phân xưởng in thêu vệ tinh');
  assert.ok(proserSiblings.some(f => f.slug.includes('binh-duong')), 'Có phân xưởng VSIP 1 Bình Dương');
});

// ----------------------------------------------------------------------------
// TEST 4: MUA/BÁN không tạo duplicate Organization (Section 52.4, Section 1, 2, 13)
// ----------------------------------------------------------------------------
runTest('QA 4: Cùng 1 Organization quản lý cả vai trò Mua và Bán, không tạo 2 company', () => {
  const allOrgs = getAllOrganizations();
  const proserOrgs = allOrgs.filter(o => o.name && o.name.toLowerCase().includes('proser'));
  assert.strictEqual(proserOrgs.length, 1, 'Chỉ duy nhất 1 Organization cho Proser');

  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.ok(proser.roles.includes('FACTORY'), 'Có role FACTORY');
  assert.ok(proser.roles.includes('SUPPLIER'), 'Có role SUPPLIER');
});

// ----------------------------------------------------------------------------
// TEST 5: Private Requirement không public (Section 52.5, Section 9, 38)
// ----------------------------------------------------------------------------
runTest('QA 5: Nhu cầu thu mua riêng tư (PRIVATE) tuyệt đối không xuất hiện trên public', () => {
  const proserNeeds = getPublicRequirementsForFactory('FP-ORG-PROSER-001', 'ORG-PROSER-001');
  
  // Không bao giờ chứa nhu cầu PRIVATE
  const privateNeed = proserNeeds.find(r => r.visibility === 'PRIVATE' || r.id === 'NC-2026-FAC-PROSER-PRIV-01');
  assert.strictEqual(privateNeed, undefined, 'Nhu cầu riêng tư không được có mặt trong public requirements');

  // Không lộ thông tin nhạy cảm
  proserNeeds.forEach(req => {
    assert.strictEqual(typeof req.buyerPhone, 'undefined', 'Không có buyerPhone');
    assert.strictEqual(typeof req.buyerEmail, 'undefined', 'Không có buyerEmail');
    assert.strictEqual(typeof req.internalBudget, 'undefined', 'Không có internalBudget');
    assert.strictEqual(typeof req.targetPrice, 'undefined', 'Không có targetPrice');
  });
});

// ----------------------------------------------------------------------------
// TEST 6: Buyer identity rule được tôn trọng (Section 52.6, Section 10)
// ----------------------------------------------------------------------------
runTest('QA 6: Tôn trọng quy tắc bảo mật danh tính doanh nghiệp mua hàng', () => {
  const proserNeeds = getPublicRequirementsForFactory('FP-ORG-PROSER-001', 'ORG-PROSER-001');
  proserNeeds.forEach(req => {
    if (req.allowPublicCompanyName === false) {
      assert.strictEqual(req.buyerInfo?.companyName, undefined, 'Không được render tên công ty khi allowPublicCompanyName = false');
    }
  });
});

// ----------------------------------------------------------------------------
// TEST 7: Public needs reuse Requirement (Section 52.7, Section 7)
// ----------------------------------------------------------------------------
runTest('QA 7: Khối nhu cầu mua hàng tái sử dụng chuẩn thực thể Requirement', () => {
  const proserNeeds = getPublicRequirementsForFactory('FP-ORG-PROSER-001', 'ORG-PROSER-001');
  assert.ok(proserNeeds.length >= 1, 'Proser phải có nhu cầu mua hàng công khai');
  const sample = proserNeeds[0];
  assert.ok(sample.id, 'Phải có id nhu cầu');
  assert.ok(sample.publicCode, 'Phải có mã công khai');
  assert.ok(sample.publicSummary, 'Phải có tóm tắt công khai');
  assert.ok(sample.category, 'Phải có ngành hàng thu mua');
});

// ----------------------------------------------------------------------------
// TEST 8: Supplier response không tiết lộ Buyer contact (Section 52.8, Section 12, 13)
// ----------------------------------------------------------------------------
runTest('QA 8: Luồng phản hồi cung ứng đi qua Bàn Điều Phối, không lộ SĐT trực tiếp', () => {
  const pageFile = path.resolve(__dirname, '../../src/pages/FactoryDetailPage.jsx');
  const content = fs.readFileSync(pageFile, 'utf8');
  assert.ok(content.includes('SupplierResponseModal'), 'Sử dụng SupplierResponseModal');
  assert.ok(!content.includes('href={`tel:${factory.phone}`}'), 'Không hardcode số điện thoại cá nhân direct call');
});

// ----------------------------------------------------------------------------
// TEST 9: Sell side reuse SupplierProfile (Section 52.9, Section 17, 18)
// ----------------------------------------------------------------------------
runTest('QA 9: Chiều Bán tái sử dụng năng lực của SupplierProfile', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(proser.hasSupplierCapability, true, 'Proser có năng lực Bán');
  assert.ok(proser.supplierCapabilities.length > 0, 'Có danh sách năng lực cung ứng');
});

// ----------------------------------------------------------------------------
// TEST 10: Products reuse ProductService (Section 52.10, Section 19)
// ----------------------------------------------------------------------------
runTest('QA 10: Sản phẩm đầu ra có cấu trúc chuẩn liên kết tới ProductService', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.ok(proser.outputProductsDetailed.length > 0, 'Có danh sách sản phẩm chi tiết');
  const sampleProduct = proser.outputProductsDetailed[0];
  assert.ok(sampleProduct.id, 'Sản phẩm có id');
  assert.ok(sampleProduct.name, 'Sản phẩm có tên');
  assert.ok(sampleProduct.slug, 'Sản phẩm có slug');
  assert.ok(sampleProduct.minOrderQuantity, 'Sản phẩm có MOQ');
});

// ----------------------------------------------------------------------------
// TEST 11: Capability reuse Supplier data (Section 52.11, Section 20, 21)
// ----------------------------------------------------------------------------
runTest('QA 11: Năng lực sản xuất có công suất chuẩn hóa với nguồn và ngày cập nhật', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.ok(proser.capabilitiesDetail, 'Có chi tiết năng lực sản xuất');
  assert.ok(proser.capabilitiesDetail.capacity, 'Có dữ liệu công suất');
  assert.ok(proser.capabilitiesDetail.capacity.value, 'Có giá trị công suất');
  assert.ok(proser.capabilitiesDetail.capacity.source, 'Có nguồn dữ liệu (Doanh nghiệp cung cấp)');
  assert.ok(proser.capabilitiesDetail.capacity.updatedAt, 'Có ngày cập nhật công suất');
});

// ----------------------------------------------------------------------------
// TEST 12: Factory location ≠ ServiceArea (Section 52.12, Section 26)
// ----------------------------------------------------------------------------
runTest('QA 12: Phân biệt rõ rệt địa chỉ xưởng và vùng phục vụ giao hàng (Service Area)', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  // Nhà máy ở TP.HCM
  assert.strictEqual(proser.province, 'TP. Hồ Chí Minh');
  // Nhưng vùng phục vụ giao hàng là Toàn quốc & Đông Nam Bộ & Phía Bắc
  assert.ok(proser.serviceAreas.includes('Toàn quốc'), 'Service Area bao gồm Toàn quốc');
  assert.ok(proser.serviceAreas.length > 1, 'Service Area đa dạng hơn một địa phương đặt xưởng');
});

// ----------------------------------------------------------------------------
// TEST 13: KCN chỉ hiện nếu relation confirmed (Section 52.13, Section 31)
// ----------------------------------------------------------------------------
runTest('QA 13: Khu công nghiệp chỉ hiển thị khi có quan hệ xác thực (isKcnConfirmed = true)', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(proser.isKcnConfirmed, true, 'Proser xác thực KCN Hiệp Phước');
  assert.strictEqual(proser.industrialParkId, 'khu-cong-nghiep-hiep-phuoc-ho-chi-minh');
});

// ----------------------------------------------------------------------------
// TEST 14: Quote không public (Section 52.14, Section 38)
// ----------------------------------------------------------------------------
runTest('QA 14: Báo giá (Quotation) tuyệt đối không xuất hiện trên payload public nhà máy', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(typeof proser.internalQuotations, 'undefined');
  assert.strictEqual(typeof proser.quotations, 'undefined');
});

// ----------------------------------------------------------------------------
// TEST 15: Meeting không public (Section 52.15, Section 38)
// ----------------------------------------------------------------------------
runTest('QA 15: Lịch họp B2B riêng tư không bị công khai trên trang chi tiết nhà máy', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.strictEqual(typeof proser.privateMeetings, 'undefined');
  assert.strictEqual(typeof proser.meetings, 'undefined');
});

// ----------------------------------------------------------------------------
// TEST 16: Program relation đúng visibility (Section 52.16, Section 14, 37)
// ----------------------------------------------------------------------------
runTest('QA 16: Chương trình hiển thị đúng mục tiêu Factory/Buyer theo ngành và địa bàn', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  const programs = getProgramsForFactory(proser);
  assert.ok(programs.length > 0, 'Phải có chương trình phù hợp cho nhà máy');
  programs.forEach(p => {
    assert.ok(p.id, 'Program có id');
    assert.ok(p.title, 'Program có tiêu đề');
  });
});

// ----------------------------------------------------------------------------
// TEST 17: Evidence có source/status (Section 52.17, Section 27, 28)
// ----------------------------------------------------------------------------
runTest('QA 17: Hồ sơ bằng chứng có nguồn gốc, phân loại và trạng thái kiểm tra minh bạch', () => {
  const proser = getFactoryByIdOrSlug('chuyen-gia-dong-phuc-proser');
  assert.ok(proser.evidences.length > 0, 'Phải có danh mục evidences');
  const ev = proser.evidences[0];
  assert.ok(ev.id, 'Evidence có id');
  assert.ok(ev.title, 'Evidence có tiêu đề');
  assert.ok(ev.type, 'Evidence có type');
  assert.ok(ev.source, 'Evidence có source');
  assert.strictEqual(ev.status, 'ĐÃ ĐỐI CHIẾU', 'Trạng thái minh chứng đã đối chiếu');
});

// ----------------------------------------------------------------------------
// TEST 18: Thao tác gửi yêu cầu kết nối & Admin mutation đều ghi AuditLog (Section 52.18, Section 34, 35)
// ----------------------------------------------------------------------------
runTest('QA 18: Thao tác gửi yêu cầu kết nối B2B và cập nhật hồ sơ đều ghi vết vào AuditLog', () => {
  // Gửi yêu cầu kết nối
  const connResult = submitFactoryConnectionRequest({
    factoryId: 'FP-ORG-PROSER-001',
    factoryName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser',
    organizationId: 'ORG-PROSER-001',
    targetType: 'OEM_ORDER',
    requirementTitle: 'Đặt gia công 1.000 bộ đồ bảo hộ',
    message: 'Chúng tôi cần báo giá gia công theo thiết kế riêng',
    senderName: 'Test Buyer Auditor',
    senderCompany: 'Auditor Company',
    senderEmail: 'auditor@test.com',
    senderPhone: '0901234567'
  }, 'Test Buyer Auditor');

  assert.strictEqual(connResult.success, true);
  assert.ok(connResult.connectionId.startsWith('CONN-'));

  // Kiểm tra AuditLog
  const logs = getAllFactoryAuditLogs('FP-ORG-PROSER-001');
  const targetLog = logs.find(l => l.actor === 'Test Buyer Auditor');
  assert.ok(targetLog, 'Phải tìm thấy AuditLog của Test Buyer Auditor');
  assert.strictEqual(targetLog.action, 'CREATE_FACTORY_CONNECTION_REQUEST');
});

// ----------------------------------------------------------------------------
// TEST 19: Mobile 390px hoạt động (Section 52.19, Section 49)
// ----------------------------------------------------------------------------
runTest('QA 19: Thứ tự giao diện tuân thủ Section 49 Mobile và không tràn 390px', () => {
  const pageFile = path.resolve(__dirname, '../../src/pages/FactoryDetailPage.jsx');
  const content = fs.readFileSync(pageFile, 'utf8');

  // Thứ tự Mobile Section 49:
  // Hero -> MUA / BÁN segmented control -> Current tab content -> Sticky CTA
  assert.ok(content.includes('HERO SECTION'), '1. Có Hero Section');
  assert.ok(content.includes('NAVIGATION 2 TAB LỚN: MUA vs BÁN'), '2. Có Segmented Control 2 Tab Mua / Bán');
  assert.ok(content.includes('TAB MUA (BUY SIDE) CONTENT'), '3. Có Tab Mua Content');
  assert.ok(content.includes('TAB BÁN (SELL SIDE) CONTENT'), '4. Có Tab Bán Content');
  assert.ok(content.includes('STICKY MOBILE ACTION BAR'), '5. Có Sticky Mobile Action Bar');

  // Không có fixed width lớn gây vỡ màn hình 390px
  assert.ok(!content.includes('w-[450px]'), 'Không có w-[450px]');
  assert.ok(!content.includes('w-[500px]'), 'Không có w-[500px]');
});

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`KẾT QUẢ TEST PAGE 29: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('TẤT CẢ 19 TIÊU CHÍ QA SECTION 52 ĐÃ ĐẠT CHUẨN HOÀN TOÀN!');
  process.exit(0);
}
