# Thái Hòa — thẻ doanh nghiệp gọn hơn

2026-10-12. Phạm vi: trang sự kiện, nhóm doanh nghiệp nổi bật trước sự kiện.

## Yêu cầu và triển khai

- Xem nhiều doanh nghiệp hơn: tăng từ 4 lên 8 thẻ/nhóm/trang (desktop 4 cột × 2 hàng; mobile 2 cột). Giữ cỡ chữ tên 16px/15px mobile, rút ngắn bằng khoảng cách và disclosure, không thu nhỏ toàn trang.
- Nội dung dài: tên tối đa 2 dòng, lĩnh vực 1 dòng; “Chi tiết” mở đầy đủ tên/lĩnh vực/mục tiêu và hành động cũ. Không xóa dữ liệu.
- Tiêu đề khối: scoped h2/h3 uppercase trong `.th-landing`; h4 tên công ty giữ cách viết gốc.
- CHUỖI CUNG ỨNG đầu Supplier: stable display ordering, chuẩn hóa dấu/case/whitespace để nhận diện; không đổi thứ tự Buyer, không mutate nguồn hoặc ghi Supabase.

## TDD và kiểm thử

Không có source plan; journeys lấy trực tiếp từ yêu cầu trên. .git read-only nên lưu checkpoint bằng báo cáo thay commit.

RED: `node --test src/pages/__tests__/thaiHoaConfirmedParticipants.test.js` — 0/3 pass; pagination chỉ trả 4 thay vì 8, SSR thiếu thẻ thứ 8, CSS không uppercase. Sau sửa cùng target GREEN 3/3. Bổ sung test stable ordering/không mutate/empty source.

| Bảo đảm | Kiểm thử | Kết quả |
|---|---|---|
| 8 thẻ mỗi trang, clamp trang cũ, xem hết/empty | Pure pagination + SSR | PASS |
| CCU đứng đầu Supplier, giữ thứ tự còn lại, không mutate | Pure ordering + SSR | PASS |
| Chi tiết mặc định đóng, đủ nội dung, không lộ INTERNAL, khóa khi hết hạn | SSR + browser disclosure | PASS |
| H2/H3 in hoa, H4 giữ nguyên | CSS contract + computed style | PASS |
| Pagination, xem hết 16 Buyer/24 Supplier, thu gọn | Browser QA trên dữ liệu thật | PASS |

Lệnh regression thực chạy:

`node --test --experimental-test-coverage --test-coverage-include='src/pages/thaiHoaEventLandingModel.js' src/pages/__tests__/thaiHoaEventLanding.test.js src/pages/__tests__/thaiHoaConfirmedParticipants.test.js src/pages/__tests__/thaiHoaLiveEvent.test.js src/pages/__tests__/thaiHoaPostEvent.test.js src/pages/__tests__/programWorkflow.test.js src/pages/__tests__/programDiscovery.test.js server/tests/thai-hoa-participant-import.test.js`

47/47 pass, exit 0. Model coverage: 100% lines, 92.63% branches, 95.45% functions (không phải coverage toàn JSX/repo).

Build: `./node_modules/.bin/vite build --outDir /private/tmp/ccu-post-build.Kus8o8 --emptyOutDir false` — exit 0, 2237 modules, 8.71s. Không chạy generateTodzungHtml hoặc ghi đè dist/uploads. Repo không có lint/typecheck script; esbuild SSR và Vite kiểm tra cú pháp/import. Diff whitespace check và scan console.log/localStorage/fetch/unsafe HTML trên component/test sạch; không thêm secret/dependency.

## Browser QA

Read-only, CUA: 1440×1000, 768×1024, 375×900. Không tràn ngang. Desktop 8+8 thẻ; thẻ đầu mỗi nhóm khoảng 134–135px cao. Mở Chi tiết CCU thấy đầy đủ mục tiêu; Enter đóng được; Đề nghị gặp disabled đúng lifecycle thực. Supplier trang 2 đổi đúng 8 tên, Xem tất cả hiện 16/24, Thu gọn về 8/8. CCU đứng đầu sau về trang 1. Tất cả h2/h3 trong before có computed textTransform uppercase. Console error log trống. Khôi phục viewport gốc, giữ tab kết quả mở.

Ảnh bằng chứng: `thai-hoa-landing/compact-cards-desktop-1440.png`, `compact-cards-tablet-768.png`, `compact-cards-mobile-375.png`. So sánh trực quan với ảnh người dùng, không có pixel diff tự động: regression pixel INCONCLUSIVE. Chưa đo CWV/axe/screen-reader đầy đủ; không tuyên bố đạt toàn bộ WCAG. Không gửi form hoặc thay đổi dữ liệu cloud.

## Tự đánh giá

4.0/5; không có trục ≤3 hoặc vấn đề nghiêm trọng trong phạm vi. Accuracy 4: 47 tests và UI thật; chưa có pixel diff tự động. Completeness 4: đủ 3 yêu cầu và breakpoint; chưa chạy screen reader đầy đủ. Clarity 4: thẻ ngắn, tiêu đề nhất quán; tên/lĩnh vực dài cần mở Chi tiết. Actionability 4: localhost và screenshot sẵn xem; chưa triển khai production (ngoài yêu cầu). Conciseness 4: sửa riêng component/model/CSS, không thêm thư viện; JSX hiện tại vẫn khá dài. Self-check: người dùng thấy nhiều công ty hơn, đúng thứ tự và chữ hoa. Cải thiện nếu cần: đánh giá khả năng đọc với tên cực dài và screen reader. Hướng dẫn redesign dẫn đến sửa gọn có phạm vi; Browser QA kiểm tra tương tác thay vì chỉ ảnh tĩnh.
