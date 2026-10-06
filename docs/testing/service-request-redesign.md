# Thiết kế lại /yeu-cau-dich-vu

Ngày: 2026-10-03. Phạm vi: giao diện và kiểm tra nhập liệu phía client của trang yêu cầu dịch vụ.

## Hướng thiết kế

Áp dụng `design-taste-frontend` cho hệ thống thị giác và quy tắc redesign-preserve. Trang là wizard nghiệp vụ, ngoài phạm vi các mẫu landing page của skill: không áp đặt hero ảnh, scroll storytelling hoặc cài một design system mới. Dials phù hợp biểu mẫu B2B: variance 4, motion 2, density 5. Giữ theme sáng, màu CCU, font và thư viện icon hiện có.

- Header trang ngắn, bỏ nhãn triển khai nội bộ.
- Thanh tiến trình dọc trên desktop, ngang trên tablet/mobile.
- Năm dịch vụ được chọn bằng radio có mô tả và thao tác bàn phím.
- Input có nhãn liên kết, lỗi tại trường và focus vào lỗi đầu tiên.
- Cung cấp ít nhất điện thoại hoặc email, theo quy tắc validation vốn có.
- Xem lại hiển thị dữ liệu của nhánh dịch vụ, không chỉ một nút sửa.
- Nút mobile liên kết đúng form; Enter ở bước đầu không gửi yêu cầu sớm.
- Launcher chat chỉ được dịch vị trí trên trang này khi có thanh hành động mobile.

Không sửa route, API, database, Dify/Gemini, form engine, referral hay merchandise persistence. Không sửa component Navbar/Footer/chat dùng chung. Không commit/deploy.

## TDD và lệnh xác minh

Journeys: chọn một trong năm dịch vụ; điền nhu cầu với một kênh liên hệ; chuyển bước không mất thông tin; xem lại chi tiết; yêu cầu xác nhận liên hệ; khôi phục nháp.

Test: `src/pages/__tests__/serviceRequestUi.test.js`.

- RED thực: component cũ render được nhưng thiếu radio/label liên kết, còn nhãn nội bộ và main lồng nhau. Helper presentation/validation chưa có. Sửa lỗi setup ESM trước khi lấy kết quả RED làm bằng chứng.
- GREEN: `node --test src/pages/__tests__/serviceRequestUi.test.js`, 6/6 đạt, không bỏ qua.
- Coverage: `node --test --experimental-test-coverage --test-coverage-include='src/pages/serviceRequestUi.js' --test-coverage-lines=80 src/pages/__tests__/serviceRequestUi.test.js`.
  Helper mới: lines 100%, functions 100%, branches 96.55%. Không phải coverage toàn bộ JSX hay browser E2E.
- `npm run build`: đạt. Cảnh báo chunk lớn của dataset dùng chung vẫn tồn tại; không thay đổi kiến trúc dữ liệu trong task UI.
- `npm test`: 68 test, 67 đạt, 1 bỏ qua theo cấu hình, 0 lỗi. Lần chạy trong sandbox bị EPERM khi mở socket localhost; dừng tiến trình test đó và chạy lại ngoài sandbox thành công. Không sửa backend để vượt lỗi môi trường.
- `git diff --check -- src/pages/ServiceRequestPage.jsx`: đạt.

Không tạo checkpoint commit vì yêu cầu dự án không cho tự commit; lưu bằng chứng RED/GREEN tại tài liệu này.

## Browser QA thực tế

URL: http://localhost:3000/yeu-cau-dich-vu.

| Kiểm tra | Kết quả |
| --- | --- |
| Desktop 1440px | Không tràn ngang; width tài liệu 1434px, scrollbar 6px |
| Tablet 768px | Không tràn ngang; width tài liệu 762px |
| Mobile 375px | Không tràn ngang; width tài liệu 369px |
| Năm nhánh dịch vụ | Chuyển bước được; input/select/textarea hiển thị đều có label lập trình được |
| Bỏ trống thông tin chung | Hiện lỗi tại trường; focus service-companyName |
| Chỉ email, không điện thoại | Chuyển sang chi tiết và xem lại được |
| Xem lại kết nối B2B | Hiện đúng quy mô kiểm thử đã nhập, tên hình thức thay vì ID |
| Quay lại | Giữ thông tin chung đã nhập |
| Chưa đồng ý liên hệ | Không gửi; hiện lỗi và focus checkbox |
| Khôi phục nháp | Khôi phục đúng công ty kiểm thử và nhánh TAI_TRO |
| Launcher và CTA mobile | Bounding rectangles không giao nhau |
| Cleanup | Xóa riêng nháp do agent tạo; form cuối trống, không còn banner nháp |
| SEO | Một H1; title và canonical /yeu-cau-dich-vu được giữ nguyên |

Không tạo yêu cầu thật, không test gửi thành công vào kho dữ liệu. Cơ chế lưu/gửi cũ vẫn là form engine/localStorage hiện có; redesign không biến nó thành API production. Các giá trị mặc định chi tiết dịch vụ và consent có sẵn cũng được giữ nguyên, không coi là dữ liệu được người dùng xác nhận.

Đã tính tương phản token chính: placeholder #5b6e83 trên #fcfdff khoảng 5.15:1; border input #8394a6 khoảng 3.06:1; màu nút #0052cc khoảng 6.70:1 trên nền gần trắng. Chưa chạy axe, screen reader hoặc Lighthouse; không tuyên bố WCAG/Core Web Vitals toàn trang đã đạt. Visual regression chưa có baseline commit: INCONCLUSIVE; kiểm tra ảnh mới và luồng tương tác đã thực hiện.

Ảnh QA tại máy hiện tại:

- /private/tmp/ccu-service-request-desktop.png
- /private/tmp/ccu-service-request-tablet.png
- /private/tmp/ccu-service-request-mobile.png

## Tự đánh giá

| Trục | Điểm | Bằng chứng và giới hạn |
| --- | --- | --- |
| Accuracy | 4/5 | Build/test và DOM thực xác nhận thay đổi; chưa chứng minh gửi thành công hoặc performance production |
| Completeness | 4/5 | Thiết kế đủ năm nhánh và ba breakpoint; chưa kiểm tra bằng screen reader |
| Clarity | 4/5 | Phân nhóm và mô tả dịch vụ rõ; một số nhãn nghiệp vụ dài được giữ nguyên để không đổi ý nghĩa |
| Actionability | 4/5 | Có thể xem/test ngay localhost; production do chủ dự án triển khai |
| Conciseness | 4/5 | Không thêm thư viện/ảnh/motion; JSX nghiệp vụ cũ vẫn dài, chưa tái kiến trúc ngoài phạm vi |

Overall: 4.0/5. Cải thiện tiếp theo: kiểm tra screen reader/axe; đo Lighthouse trên preview production; kiểm thử submit trên môi trường test được phê duyệt. Chủ dự án có thể đánh giá thị giác qua localhost và ảnh, nhưng không nên suy ra backend đã được nâng cấp. Verdict: bàn giao UI local với các giới hạn xác minh đã nêu.
