// ============================================================================
// MOBILE & RESPONSIVE VALIDATION SUITE: PAGE 17 (YÊU CẦU DỊCH VỤ)
// ROUTE: /yeu-cau-dich-vu
// Chuẩn hóa theo Section 22 Spec 17.txt
// ============================================================================

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('----------------------------------------------------');
console.log('📱 KIỂM TRA MOBILE & RESPONSIVE (390PX) CHO PAGE 17');
console.log('----------------------------------------------------\n');

const pageFilePath = path.resolve('src/pages/ServiceRequestPage.jsx');
const pageContent = fs.readFileSync(pageFilePath, 'utf-8');

const workspaceFilePath = path.resolve('src/pages/UserRequestsWorkspacePage.jsx');
const workspaceContent = fs.readFileSync(workspaceFilePath, 'utf-8');

let pass = 0;
let fail = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    pass++;
  } catch (e) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${e.message}`);
    fail++;
  }
}

// 1. Mobile Step Indicator
it('1. Có Step Indicator 3 bước trực quan: Thông tin chung -> Đặc tả nghiệp vụ -> Xem lại & Nộp', () => {
  assert.ok(pageContent.includes('3-STEP WIZARD PROGRESS INDICATOR'), 'Phải có chỉ báo 3 bước');
  assert.ok(pageContent.includes('1. Thông tin chung'), 'Bước 1: Thông tin chung');
  assert.ok(pageContent.includes('2. Đặc tả nghiệp vụ'), 'Bước 2: Đặc tả nghiệp vụ');
  assert.ok(pageContent.includes('3. Xem lại & Nộp'), 'Bước 3: Xem lại & Nộp');
});

// 2. Không hiển thị 30 field cùng lúc
it('2. Phân chia bước rõ ràng (currentStep === 1 | 2 | 3), không hiển thị 30 fields cùng lúc', () => {
  assert.ok(pageContent.includes('currentStep === 1'), 'Có điều kiện render bước 1');
  assert.ok(pageContent.includes('currentStep === 2'), 'Có điều kiện render bước 2');
  assert.ok(pageContent.includes('currentStep === 3'), 'Có điều kiện render bước 3');
});

// 3. Sticky Mobile CTA Bar
it('3. Có Sticky CTA Bar cố định ở bottom trên màn hình di động (<640px)', () => {
  assert.ok(pageContent.includes('STICKY MOBILE CTA BAR'), 'Phải có chú thích Sticky Mobile CTA');
  assert.ok(pageContent.includes('fixed bottom-0'), 'Thẻ CTA phải có fixed bottom-0');
  assert.ok(pageContent.includes('sm:hidden'), 'Chỉ hiện sticky bar trên mobile, ẩn trên sm+');
  assert.ok(pageContent.includes('GỬI YÊU CẦU TƯ VẤN'), 'Nút CTA cuối cùng là GỬI YÊU CẦU TƯ VẤN');
});

// 4. Chống tràn ngang 390px
it('4. Khung giao diện bao bọc có overflow-x-hidden và padding thích hợp', () => {
  assert.ok(pageContent.includes('overflow-x-hidden'), 'ServiceRequestPage phải có overflow-x-hidden');
  assert.ok(workspaceContent.includes('max-w-6xl'), 'UserRequestsWorkspacePage có max-w container');
  assert.ok(pageContent.includes('px-4 sm:px-6'), 'Có padding an toàn px-4 cho mobile 390px');
});

// 5. Success Screen có các khuyến nghị minh bạch
it('5. Màn hình thành công có mã DV-2026-xxxxx và thông điệp chuẩn Section 8 Spec 17', () => {
  assert.ok(pageContent.includes('đã được ghi nhận'), 'Có câu chữ đã được ghi nhận');
  assert.ok(pageContent.includes('Bạn có thể theo dõi trạng thái hoặc bổ sung thông tin qua đầu mối được xác nhận'), 'Có text theo dõi trạng thái');
  assert.ok(pageContent.includes('không cam kết chi phí cố định, lịch trình hay số lượng cuộc gặp'), 'Có cảnh báo minh bạch về cam kết dịch vụ');
});

// 6. Account Workspace hỗ trợ mobile tra cứu
it('6. Account Workspace (/tai-khoan/yeu-cau-dich-vu) hỗ trợ mobile search và responsive tabs', () => {
  assert.ok(workspaceContent.includes('searchQuery'), 'Hỗ trợ tra cứu nhanh');
  assert.ok(workspaceContent.includes('activeTab'), 'Hỗ trợ các tab chi tiết');
  assert.ok(workspaceContent.includes('DV-2026-'), 'Tìm kiếm theo định dạng mã chuẩn');
});

console.log('\n====================================================');
console.log(`📱 KẾT QUẢ KIỂM THỬ MOBILE: ${pass} PASS / ${fail} FAIL`);
console.log('====================================================');

if (fail > 0) process.exit(1);
else process.exit(0);
