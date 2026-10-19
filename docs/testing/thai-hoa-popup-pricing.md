# Thái Hòa — popup doanh nghiệp và giá tài trợ

2026-10-12. Yêu cầu: mức 5/10/20 triệu theo cấp tài trợ; nhấn tên doanh nghiệp mở cửa sổ nhỏ thay dropdown.

## Triển khai

- Giá mặc định riêng sự kiện: Bạc 5.000.000 VND, Vàng 10.000.000 VND, Kim cương 20.000.000 VND. Thứ tự thẻ giữ Kim cương → Vàng → Bạc. Cấu hình Admin explicit vẫn ưu tiên; giá chưa duyệt/không hợp lệ không được thay bằng fallback. API bootstrap kiểm tra hiện không có gói override. Không ghi Supabase; đây là cấu hình mặc định trong model sự kiện, dùng chung khối giá và workflow đăng ký.
- Tên và nút Chi tiết mở native dialog tối đa 480px. Không còn details dropdown; giữ 8 thẻ/nhóm và CCU đầu Supplier. Popup hiển thị toàn bộ tên/lĩnh vực/mục tiêu công khai, link hồ sơ nếu có và đề nghị gặp đúng vai trò đối ứng.
- Native modal top layer, background inert, khóa scroll body; bổ sung vòng Tab/Shift+Tab, autofocus nút đóng, Escape/nền/X đóng và trả focus về trigger. Không thêm thư viện, không sửa dữ liệu liên hệ hoặc lifecycle đã đóng.

## TDD / verification

Journeys lấy từ yêu cầu, không source plan. RED cùng target `node --test src/pages/__tests__/thaiHoaConfirmedParticipants.test.js src/pages/__tests__/thaiHoaEventLanding.test.js`: 9/12 pass, 3 fail đúng thiếu giá mặc định, thiếu giá render và còn dropdown. GREEN: 12/12. SSR bổ sung semantics dialog, dữ liệu Buyer/Supplier, productsServices fallback, khóa gặp khi đóng, link hồ sơ có/không. Pure tests bảo đảm precedence và invalid amounts (NaN, âm, Infinity, chuỗi).

Regression `node --test --experimental-test-coverage --test-coverage-include='src/pages/thaiHoaEventLandingModel.js' src/pages/__tests__/thaiHoaEventLanding.test.js src/pages/__tests__/thaiHoaConfirmedParticipants.test.js src/pages/__tests__/thaiHoaLiveEvent.test.js src/pages/__tests__/thaiHoaPostEvent.test.js src/pages/__tests__/programWorkflow.test.js src/pages/__tests__/programDiscovery.test.js server/tests/thai-hoa-participant-import.test.js`: 47/47 pass. Model: 100% lines, 92.71% branches, 95.45% functions. Sau tinh chỉnh focus trap và clamp tên, chạy lại target 12/12 pass. Coverage không bao gồm toàn JSX/repo. .git read-only nên lưu checkpoint RED/GREEN tại đây, không commit.

Browser QA CUA read-only trên 1440×1000, 768×1024, 375×900: Buyer Đài Cát và Supplier CCU mở đúng popup từ tên/nút chi tiết. Desktop card heights không đổi khi mở popup, tối đa ~135px sau clamp. Desktop/tablet dialog 480px; mobile 331px rộng, ~465px cao; không tràn trang. Kiểm tra X, Escape, nền đóng, focus trigger phục hồi, body overflow phục hồi; Tab giữ focus trong dialog sau cải thiện. Console error log trống. Khôi phục viewport, giữ tab kết quả. Không submit form/thu tiền/ghi DB.

Ảnh: `thai-hoa-landing/company-popup-desktop-1440.png`, `company-popup-tablet-768.png`, `company-popup-mobile-375.png`, `sponsor-prices-desktop-1440.png`. Giá trực quan 20/10/5 triệu được xác nhận trên trang thật. Không chạy pixel diff, axe/CWV/screen-reader đầy đủ: không tuyên bố đạt toàn bộ WCAG hoặc performance. Repo không có lint/typecheck script; dùng SSR esbuild/Vite và diff check. Build Vite ra `/private/tmp/ccu-post-build.Kus8o8`, không ghi dist/uploads.

## Tự đánh giá

4.0/5. Accuracy 4: tests và dữ liệu thật, chưa kiểm tra quy trình thu phí (ngoài phạm vi). Completeness 4: đủ giá + popup + responsive, chưa screen-reader toàn diện. Clarity 4: giữ tên thẻ gọn, popup rõ thông tin; quyền lợi vẫn ghi đề xuất. Actionability 4: localhost và ảnh sẵn xem; chưa deploy production. Conciseness 4: dùng native dialog không dependency, JSX nhóm cũ vẫn dài. Không trục ≤3; không critical issue. Self-check: người dùng thấy giá đúng cấp, danh sách không xổ xuống. Cải thiện tiếp: screen-reader và production rollout nếu được yêu cầu. Hướng dẫn redesign giữ thay đổi có phạm vi; Browser QA phát hiện và giúp sửa vòng focus một nút.
