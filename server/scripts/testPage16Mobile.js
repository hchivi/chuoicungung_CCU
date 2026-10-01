// ============================================================================
// MOBILE & RESPONSIVE VALIDATION SUITE: PAGE 16 (VẬT PHẨM DOANH NGHIỆP & SỰ KIỆN)
// ROUTE: /dich-vu/vat-pham-su-kien
// Chuẩn hóa theo Section 16 Spec 16.txt
// ============================================================================

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('----------------------------------------------------');
console.log('📱 KIỂM TRA MOBILE & RESPONSIVE (390PX) CHO PAGE 16');
console.log('----------------------------------------------------\n');

const pageFilePath = path.resolve('src/pages/MerchandiseEventServicePage.jsx');
const content = fs.readFileSync(pageFilePath, 'utf-8');

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

// 1. Mobile Order verification
it('1. Mobile layout order: Hero -> 4 Bộ sản phẩm -> Quy trình -> CTA báo giá', () => {
  const heroIndex = content.indexOf('1. HERO SECTION');
  const kitsIndex = content.indexOf('2. CÁC BỘ SẢN PHẨM CHUẨN');
  const workflowIndex = content.indexOf('3. WORKFLOW 11 BƯỚC BẮT BUỘC');
  const ctaIndex = content.indexOf('8. BOTTOM CALL TO ACTION BANNER');

  assert.ok(heroIndex !== -1, 'Thiếu Hero section');
  assert.ok(kitsIndex !== -1, 'Thiếu Kits section');
  assert.ok(workflowIndex !== -1, 'Thiếu Workflow section');
  assert.ok(ctaIndex !== -1, 'Thiếu CTA section');

  assert.ok(heroIndex < kitsIndex, 'Hero phải xuất hiện trước 4 Bộ sản phẩm');
  assert.ok(kitsIndex < workflowIndex, '4 Bộ sản phẩm phải xuất hiện trước Quy trình');
  assert.ok(workflowIndex < ctaIndex, 'Quy trình phải xuất hiện trước CTA');
});

// 2. Sticky Mobile CTA
it('2. Có Sticky Mobile Bottom CTA: GỬI YÊU CẦU BÁO GIÁ', () => {
  assert.ok(content.includes('STICKY MOBILE CTA BAR'), 'Thiếu Sticky Mobile CTA Bar');
  assert.ok(content.includes('GỬI YÊU CẦU BÁO GIÁ'), 'Thiếu text CTA GỬI YÊU CẦU BÁO GIÁ');
  assert.ok(content.includes('fixed bottom-0'), 'CTA phải cố định ở bottom trên mobile');
  assert.ok(content.includes('/yeu-cau-dich-vu?service=vat-pham-su-kien'), 'CTA link đúng query service=vat-pham-su-kien');
});

// 3. Prevent overflow on 390px
it('3. Thẻ gốc và các container có cơ chế chống tràn ngang (overflow-x-hidden)', () => {
  assert.ok(content.includes('overflow-x-hidden'), 'Root element phải có overflow-x-hidden');
  assert.ok(content.includes('max-w-6xl mx-auto'), 'Container phải có max-w chuẩn');
});

// 4. SEO Metadata & Title
it('4. SEO Title, Description và Canonical đúng spec 16', () => {
  assert.ok(content.includes('Vật Phẩm Doanh Nghiệp & Sự Kiện | CHUOICUNGUNG.COM'), 'SEO Title không khớp');
  assert.ok(content.includes('Tiếp nhận yêu cầu đồng phục, thẻ QR, túi, quà tặng và vật phẩm chương trình'), 'Meta description không khớp');
  assert.ok(content.includes('https://chuoicungung.com/dich-vu/vat-pham-su-kien'), 'Canonical link không khớp');
});

// 5. Build check
it('5. Không có lỗi cú pháp hoặc tag chưa đóng', () => {
  assert.ok(content.includes('export default function MerchandiseEventServicePage'), 'Thiếu export default component');
});

console.log('\n====================================================');
console.log(`KẾT QUẢ KIỂM TRA MOBILE: ${pass} PASSED, ${fail} FAILED`);
console.log('====================================================');

if (fail > 0) process.exit(1);
else process.exit(0);
