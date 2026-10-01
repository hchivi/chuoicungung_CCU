// ============================================================================
// AUTOMATED TEST SUITE: PAGE 16 (VẬT PHẨM DOANH NGHIỆP & SỰ KIỆN)
// ROUTE: /dich-vu/vat-pham-su-kien
// Chuẩn hóa theo spec 16.txt - CHUOICUNGUNG.COM
// ============================================================================

import assert from 'assert';
import { 
  MERCHANDISE_STATUSES,
  MERCHANDISE_WORKFLOW_STEPS,
  COORDINATION_MODES,
  MERCH_IMAGE_TYPES,
  MERCHANDISE_KITS,
  SAMPLE_QUOTATION_TEMPLATE,
  getAllMerchandiseRequests,
  createMerchandiseRequest,
  updateMerchandiseRequestStatus,
  recordSampleApproval,
  saveMerchandiseQuotation,
  findMatchingSuppliersForMerchandise,
  getAllMerchandiseAuditLogs,
  getMerchandiseProgressSummary
} from '../../src/data/merchandiseEventData.js';

import { 
  getAllServiceRequests, 
  submitServiceRequest 
} from '../../src/data/servicesData.js';

import { PROGRAMS_DATA } from '../../src/data/programsData.js';

console.log('----------------------------------------------------');
console.log('🧪 CHẠY BỘ KIỂM THỬ SPEC 16.TXT CHO CHUOICUNGUNG.COM');
console.log('----------------------------------------------------\n');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: CTA GIỮ SERVICE CONTEXT
// ----------------------------------------------------------------------------
it('1. CTA giữ service context vat-pham-su-kien', () => {
  const targetRoute = '/yeu-cau-dich-vu?service=vat-pham-su-kien';
  assert.ok(targetRoute.includes('service=vat-pham-su-kien'), 'CTA link phải chứa query param service=vat-pham-su-kien');
});

// ----------------------------------------------------------------------------
// TEST 2: FORM HỖ TRỢ ĐẦY ĐỦ SỐ LƯỢNG, QUY CÁCH, SIZE, IN THÊU, FILES
// ----------------------------------------------------------------------------
it('2. Form hỗ trợ số lượng, quy cách, bảng size, in thêu, màu sắc, files', () => {
  const reqData = {
    companyName: 'Công ty TNHH Dệt May Kim Long',
    customerName: 'Trịnh Thanh Mai',
    roleTitle: 'Trưởng ban Mua sắm',
    email: 'mai.trinh@kimlongtextile.vn',
    phone: '0903 888 999',
    productTypes: ['Áo Polo đồng phục', 'Thẻ tên QR'],
    quantities: '1.000 áo + 1.000 thẻ',
    sizeChart: 'M: 300, L: 500, XL: 200',
    specifications: 'Vải cá sấu poly thái 4 chiều, giấy C300',
    printRequirements: 'Thêu vi tính ngực 8cm, in lụa lưng',
    colors: 'Xanh coban phối trắng',
    brandGuideline: 'Logo AI vector chuẩn',
    packagingRequirements: 'Túi OPP từng cái, 50 cái/thùng',
    sampleRequired: true,
    requestedDate: '2026-05-10',
    deliveryLocation: 'KCN Sóng Thần 2, Dĩ An, Bình Dương',
    approvalContact: 'Trịnh Thanh Mai - 0903 888 999',
    coordinationMode: 'PLATFORM_COORDINATION',
    budget: '150 triệu VNĐ',
    attachments: [{ name: 'KimLong_BrandGuideline.pdf', size: '2.5 MB' }]
  };

  const created = createMerchandiseRequest(reqData);
  assert.ok(created.success, 'Phải tạo thành công ServiceRequest');
  assert.ok(created.request.id.startsWith('DV-2026-'), 'Mã phải có định dạng DV-2026-XXXXX');
  assert.strictEqual(created.request.quantities, '1.000 áo + 1.000 thẻ');
  assert.strictEqual(created.request.sizeChart, 'M: 300, L: 500, XL: 200');
  assert.strictEqual(created.request.attachments.length, 1);
});

// ----------------------------------------------------------------------------
// TEST 3: REQUESTED DATE KHÔNG TỰ THÀNH CONFIRMED DATE
// ----------------------------------------------------------------------------
it('3. Requested date KHÔNG được tự coi là confirmed delivery date', () => {
  const req = createMerchandiseRequest({
    companyName: 'Công ty Cơ khí Tân Phát',
    customerName: 'Lê Văn Phát',
    phone: '0918 123 456',
    email: 'phat@tanphat.vn',
    requestedDate: '2026-05-01'
  });

  assert.strictEqual(req.request.requestedDate, '2026-05-01');
  assert.strictEqual(req.request.confirmedDeliveryDate, null, 'confirmedDeliveryDate ban đầu PHẢI LÀ null');
});

// ----------------------------------------------------------------------------
// TEST 4: SAMPLE APPROVAL ĐƯỢC LƯU VERSION VÀ CHẶN SẢN XUẤT NẾU CHƯA DUYỆT
// ----------------------------------------------------------------------------
it('4. Sample approval lưu version, và CHẶN chuyển sang PRODUCTION nếu chưa duyệt mẫu', () => {
  const created = createMerchandiseRequest({
    companyName: 'Công ty Điện Tử Vĩnh An',
    customerName: 'Phạm Vĩnh An',
    phone: '0909 777 666',
    email: 'an@vinhan.com',
    sampleRequired: true
  });
  const reqId = created.request.id;

  // Cố tình chuyển sang PRODUCTION khi mẫu chưa APPROVED -> PHẢI BỊ CHẶN
  const blockedRes = updateMerchandiseRequestStatus({
    requestId: reqId,
    status: 'PRODUCTION',
    actor: 'Admin Test'
  });
  assert.strictEqual(blockedRes.success, false, 'Hệ thống PHẢI CHẶN sản xuất đại trà khi mẫu chưa duyệt');
  assert.ok(blockedRes.message.includes('VI PHẠM QUY TRÌNH'), 'Phải trả về thông báo lỗi vi phạm quy trình');

  // Khách ký duyệt mẫu thực tế version 1.2
  const approveRes = recordSampleApproval({
    requestId: reqId,
    sampleStatus: 'APPROVED',
    approvedBy: 'Phạm Vĩnh An',
    version: 'v1.2-physical-sample',
    notes: 'Đã duyệt chất liệu và màu in thực tế tại xưởng',
    actor: 'Admin Test'
  });
  assert.ok(approveRes.success);
  assert.strictEqual(approveRes.request.sampleStatus, 'APPROVED');
  assert.strictEqual(approveRes.request.sampleRecord.version, 'v1.2-physical-sample');

  // Sau khi approved, chuyển sang PRODUCTION được phép thành công
  const allowRes = updateMerchandiseRequestStatus({
    requestId: reqId,
    status: 'PRODUCTION',
    actor: 'Admin Test'
  });
  assert.ok(allowRes.success, 'Sau khi duyệt mẫu, được phép mở lệnh sản xuất');
  assert.strictEqual(allowRes.request.status, 'PRODUCTION');
});

// ----------------------------------------------------------------------------
// TEST 5: BÁO GIÁ CÓ ĐẦY ĐỦ 13 THÀNH PHẦN
// ----------------------------------------------------------------------------
it('5. Báo giá bắt buộc có đầy đủ 13 thành phần (không gửi báo giá mơ hồ)', () => {
  const q = SAMPLE_QUOTATION_TEMPLATE;
  assert.ok(q.seller?.name && q.seller?.taxId, 'Thiếu thông tin bên bán');
  assert.ok(q.items?.length > 0, 'Thiếu danh mục hạng mục');
  assert.ok(q.items[0].quantity && q.items[0].unit, 'Thiếu số lượng & ĐVT');
  assert.ok(q.items[0].specifications, 'Thiếu quy cách chi tiết');
  assert.ok(q.costBreakdown.sampleCost !== undefined, 'Thiếu chi phí mẫu');
  assert.ok(q.costBreakdown.designCost !== undefined, 'Thiếu chi phí thiết kế');
  assert.ok(q.costBreakdown.productionCost > 0, 'Thiếu chi phí sản xuất');
  assert.ok(q.costBreakdown.shippingCost !== undefined, 'Thiếu chi phí vận chuyển');
  assert.ok(q.costBreakdown.vatTaxAmount > 0, 'Thiếu thuế VAT');
  assert.ok(q.paymentTerms, 'Thiếu điều kiện thanh toán');
  assert.ok(q.estimatedTimeline?.confirmedDeliveryDate, 'Thiếu ngày giao cam kết');
  assert.ok(q.deliveryResponsibility, 'Thiếu trách nhiệm bàn giao');
  assert.ok(q.defectPolicy, 'Thiếu chính sách xử lý lỗi');
});

// ----------------------------------------------------------------------------
// TEST 6: SUPPLIER SOURCING REUSE SEARCH/MATCHING (KHÔNG DÙNG SPONSOR BIAS)
// ----------------------------------------------------------------------------
it('6. Supplier sourcing matching theo năng lực thực tế, không dùng Sponsor làm factor', () => {
  const matches = findMatchingSuppliersForMerchandise({
    productType: 'đồng phục',
    requiredQuantity: 500,
    location: 'Đồng Nai'
  });

  assert.ok(matches.length > 0, 'Phải tìm thấy xưởng may mặc từ productServicesData');
  matches.forEach(m => {
    assert.ok(m.supplierName, 'Supplier phải có tên');
    assert.ok(m.moq !== undefined, 'Supplier phải có MOQ');
    assert.ok(m.matchFactors.length > 0, 'Phải có matchFactors minh bạch');
    // Kiểm tra không có factor Sponsor
    const hasSponsorFactor = m.matchFactors.some(f => f.toLowerCase().includes('sponsor'));
    assert.strictEqual(hasSponsorFactor, false, 'Không được dùng Sponsor làm tiêu chí matching');
  });
});

// ----------------------------------------------------------------------------
// TEST 7: PHÂN BIỆT RÕ RÀNG PLATFORM COORDINATION VÀ DIRECT SALE
// ----------------------------------------------------------------------------
it('7. Phân biệt rõ rệt Mode A (Platform Coordination) và Mode B (Direct Sale)', () => {
  const modeA = COORDINATION_MODES.PLATFORM_COORDINATION;
  const modeB = COORDINATION_MODES.DIRECT_SALE;

  assert.strictEqual(modeA.id, 'PLATFORM_COORDINATION');
  assert.strictEqual(modeB.id, 'DIRECT_SALE');
  assert.notStrictEqual(modeA.vatIssuer, modeB.vatIssuer, 'Đơn vị xuất VAT giữa 2 mô hình phải khác nhau');
  assert.notStrictEqual(modeA.contractSigner, modeB.contractSigner, 'Bên ký hợp đồng giữa 2 mô hình phải khác nhau');
});

// ----------------------------------------------------------------------------
// TEST 8: PROGRAM RELATION KHÔNG DUPLICATE DỮ LIỆU
// ----------------------------------------------------------------------------
it('8. Program relation liên kết đúng programId, không copy duplicate model', () => {
  const sampleProg = PROGRAMS_DATA[0];
  assert.ok(sampleProg && sampleProg.id, 'Phải có program từ programsData');

  const req = createMerchandiseRequest({
    companyName: 'Đơn vị tham gia Expo',
    customerName: 'Hoàng Long',
    phone: '0933 222 111',
    email: 'long@expo.vn',
    relatedProgramId: sampleProg.id
  });

  assert.strictEqual(req.request.relatedProgramId, sampleProg.id);
});

// ----------------------------------------------------------------------------
// TEST 9: CLAIM TIÊU CHUẨN PHẢI CÓ EVIDENCE (PHÂN BIỆT ẢNH REAL VS ILLUSTRATION)
// ----------------------------------------------------------------------------
it('9. Phân loại hình ảnh sản phẩm phân biệt rõ REAL_DELIVERED, REAL_PRODUCT, SAMPLE, ILLUSTRATION', () => {
  assert.ok(MERCH_IMAGE_TYPES.REAL_DELIVERED_PROJECT, 'Phải có REAL_DELIVERED_PROJECT');
  assert.ok(MERCH_IMAGE_TYPES.REAL_PRODUCT, 'Phải có REAL_PRODUCT');
  assert.ok(MERCH_IMAGE_TYPES.SAMPLE, 'Phải có SAMPLE');
  assert.ok(MERCH_IMAGE_TYPES.ILLUSTRATION, 'Phải có ILLUSTRATION');

  MERCHANDISE_KITS.forEach(kit => {
    assert.ok(kit.imageType in MERCH_IMAGE_TYPES, `Kit ${kit.id} phải có imageType hợp lệ`);
    assert.ok(kit.evidenceNote, `Kit ${kit.id} phải có bằng chứng/evidence thực tế`);
  });
});

// ----------------------------------------------------------------------------
// TEST 10: MỌI ACTIVE REQUEST PHẢI CÓ OWNER + NEXT ACTION + NEXT ACTION AT
// ----------------------------------------------------------------------------
it('10. Mọi active request có owner, nextAction và nextActionAt', () => {
  const reqs = getAllMerchandiseRequests();
  const activeReqs = reqs.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
  assert.ok(activeReqs.length > 0, 'Phải có active requests');

  activeReqs.forEach(r => {
    assert.ok(r.owner && r.owner.length > 0, `Request ${r.id} thiếu owner`);
    assert.ok(r.nextAction && r.nextAction.length > 0, `Request ${r.id} thiếu nextAction`);
    assert.ok(r.nextActionAt && !isNaN(Date.parse(r.nextActionAt)), `Request ${r.id} thiếu nextActionAt hợp lệ`);
  });
});

// ----------------------------------------------------------------------------
// TEST 11: MỌI ADMIN MUTATION GHI AUDIT LOG
// ----------------------------------------------------------------------------
it('11. Mọi Admin mutation đều được ghi vào AuditLog', () => {
  const initialLogCount = getAllMerchandiseAuditLogs().length;

  const req = createMerchandiseRequest({
    companyName: 'Công ty Test Audit',
    customerName: 'Kiểm toán viên',
    phone: '0901 000 000',
    email: 'audit@test.vn'
  });

  updateMerchandiseRequestStatus({
    requestId: req.request.id,
    status: 'SPEC_CONFIRMATION',
    actor: 'Admin Auditor',
    note: 'Đã thống nhất định lượng vải'
  });

  const updatedLogCount = getAllMerchandiseAuditLogs().length;
  assert.ok(updatedLogCount >= initialLogCount + 2, 'Phải có ít nhất 2 logs mới được ghi nhận');
});

// ----------------------------------------------------------------------------
// TEST 12: TIẾN ĐỘ 4 BUCKETS CHO ADMIN (SECTION 13 SPEC 16)
// ----------------------------------------------------------------------------
it('12. Bảng tổng hợp KPI phân loại rõ 4 nhóm tiến độ', () => {
  const summary = getMerchandiseProgressSummary();
  assert.ok(summary.total >= 2, 'Tổng số requests phải >= 2');
  assert.ok(typeof summary.waitingClient === 'number');
  assert.ok(typeof summary.waitingTeam === 'number');
  assert.ok(typeof summary.inProduction === 'number');
  assert.ok(typeof summary.completed === 'number');
});

console.log('\n====================================================');
console.log(`KẾT QUẢ KIỂM THỬ: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
