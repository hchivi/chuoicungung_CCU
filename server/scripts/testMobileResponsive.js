// ============================================================================
// MOBILE RESPONSIVE 390PX VALIDATION SCRIPT (SPEC 15.TXT - SECTION 16)
// ============================================================================

import fs from 'fs';
import path from 'path';

console.log('--- Kiểm tra Responsive Mobile 390px (Section 16 Spec 15.txt) ---');

const pageFilePath = path.resolve('src/pages/MediaBrandingServicePage.jsx');
const pageCode = fs.readFileSync(pageFilePath, 'utf-8');

let pass = 0;
let fail = 0;

function check(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    pass++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    fail++;
  }
}

// 1. Check Mobile Order: Hero -> 4 service cards -> Multi-use block -> Process -> CTA
const heroIdx = pageCode.indexOf('SECTION 02: HERO');
const cardsIdx = pageCode.indexOf('SECTION 03: HẠNG MỤC DỊCH VỤ');
const multiUseIdx = pageCode.indexOf('SECTION 04: MỘT BỘ DỮ LIỆU');
const processIdx = pageCode.indexOf('SECTION 07 & 08: WORKFLOW SẢN XUẤT');
const ctaIdx = pageCode.indexOf('FINAL CALL TO ACTION');

check(heroIdx !== -1 && heroIdx < cardsIdx, 'Thứ tự hiển thị: Hero xuất hiện trước');
check(cardsIdx !== -1 && cardsIdx < multiUseIdx, 'Thứ tự hiển thị: 4 service cards xuất hiện tiếp theo');
check(multiUseIdx !== -1 && multiUseIdx < processIdx, 'Thứ tự hiển thị: Multi-use block xuất hiện tiếp theo');
check(processIdx !== -1 && processIdx < ctaIdx, 'Thứ tự hiển thị: Process / 12-step workflow xuất hiện trước CTA');
check(ctaIdx !== -1, 'Thứ tự hiển thị: Final CTA ở cuối trang');

// 2. Check no hardcoded fixed width > 390px without responsive breakpoints
const hardcodedWideRegex = /w-\[(39[1-9]|[4-9]\d\d|\d{4,})px\]/g;
const matches = pageCode.match(hardcodedWideRegex);
check(!matches || matches.length === 0, 'Không chứa hardcoded width > 390px gây tràn màn hình di động');

// 3. Check overflow-x-hidden / overflow-hidden on outer containers
check(pageCode.includes('overflow-hidden'), 'Container có overflow protection để chống horizontal scroll');

// 4. Check SEO & Schema data
check(pageCode.includes('Hồ Sơ, Video & Truyền Thông Doanh Nghiệp | CHUOICUNGUNG.COM'), 'SEO Title đúng chuẩn Section 16');
check(pageCode.includes('application/ld+json'), 'Có cấu hình Schema.org JSON-LD Service');

console.log(`\nKết quả kiểm tra Mobile: ${pass} PASSED, ${fail} FAILED`);
if (fail > 0) process.exit(1);
