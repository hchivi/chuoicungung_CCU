// ============================================================================
// MOBILE RESPONSIVENESS & DOM CHECK: PAGE 18 FOUNDING PARTNER
// Section 29 in 18.txt - CHUOICUNGUNG.COM
// ============================================================================

import fs from 'fs';
import path from 'path';

const pagePath = path.resolve('src/pages/FoundingPartnerPage.jsx');
const pageContent = fs.readFileSync(pagePath, 'utf8');

let pass = 0;
let fail = 0;

function it(desc, condition) {
  if (condition) {
    console.log(`✅ [PASS] ${desc}`);
    pass++;
  } else {
    console.error(`❌ [FAIL] ${desc}`);
    fail++;
  }
}

console.log('====================================================================');
console.log('📱 CHECKING PAGE 18 MOBILE LAYOUT & SECTION ORDER SPEC (390px)');
console.log('====================================================================\n');

// 1. Check Section 29 mobile order in page JSX
const heroIdx = pageContent.indexOf('ĐỒNG HÀNH PHÁT TRIỂN CHUYÊN MỤC PHÙ HỢP VỚI NĂNG LỰC DOANH NGHIỆP');
const whatIsFPIdx = pageContent.indexOf('FOUNDING PARTNER LÀ GÌ?');
const scopeIdx = pageContent.indexOf('CHỌN PHẠM VI ĐỒNG HÀNH');
const entitlementsIdx = pageContent.indexOf('QUYỀN LỢI CÓ THỂ CÓ');
const limitsIdx = pageContent.indexOf('FOUNDING PARTNER KHÔNG ĐƯỢC LÀM GÌ?');
const workflowIdx = pageContent.indexOf('QUY TRÌNH HỢP TÁC TỪ ĐỀ XUẤT ĐẾN KÍCH HOẠT');
const formIdx = pageContent.indexOf('<section ref={formRef}');

it('1. Hero section appears first', heroIdx > -1 && heroIdx < whatIsFPIdx);
it('2. "Founding Partner là gì" appears after Hero', whatIsFPIdx > -1 && whatIsFPIdx < scopeIdx);
it('3. "Chọn phạm vi" configurator appears after definition', scopeIdx > -1 && scopeIdx < entitlementsIdx);
it('4. "Quyền lợi có thể có" appears after scope', entitlementsIdx > -1 && entitlementsIdx < limitsIdx);
it('5. "Nguyên tắc minh bạch / Giới hạn" appears after entitlements', limitsIdx > -1 && limitsIdx < workflowIdx);
it('6. "Quy trình hợp tác" appears before form', workflowIdx > -1 && workflowIdx < formIdx);
it('7. "Form đề xuất CTA" appears after workflow', formIdx > -1 && formIdx > workflowIdx);

// 2. Responsive UI utility classes
it('8. Uses responsive grid classes (grid-cols-1 md:...)', pageContent.includes('grid-cols-1') && pageContent.includes('md:grid-cols-'));
it('9. Uses responsive padding (px-4 sm:px-6)', pageContent.includes('px-4 sm:px-6'));
it('10. Contains overflow-hidden or max-w containers to prevent 390px overflow', pageContent.includes('max-w-6xl mx-auto') && pageContent.includes('overflow-hidden'));
it('11. Contains mandatory label "ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC"', pageContent.includes('ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC'));
it('12. Contains legal disclaimer note about commercial package', pageContent.includes('Founding Partner là gói thương mại'));

console.log('\n====================================================================');
console.log(`🏁 MOBILE ORDER VERIFICATION: ${pass} PASSED / ${fail} FAILED`);
console.log('====================================================================');

if (fail > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL MOBILE LAYOUT & SPEC ORDER CHECKS PASSED!');
  process.exit(0);
}
