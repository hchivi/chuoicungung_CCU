# Trước sự kiện — doanh nghiệp đã xác nhận

12/10/2026. URL: http://localhost:3000/chuong-trinh/ngay-hoi-chuoi-cung-ung-kcn-thai-hoa-2026?stage=before#doanh-nghiep

## Thay đổi

Khối cũ đã có nhưng dùng tiêu đề chung và chưa có public participants. Thay bằng component riêng, tiêu đề đúng ảnh, hai nhóm Buyer xanh / Supplier cam, mỗi nhóm tối đa 4 thẻ mỗi trang, nút trước/sau và xem toàn bộ. Không thay đổi header, logo, tab trong/sau sự kiện, cơ chế xác nhận hoặc database.

Mỗi thẻ dùng logo, tên, lĩnh vực, publicSummary/productsServices và profilePath đã được publicParticipants lọc. Giữ đề nghị gặp đúng vai trò đối ứng và khóa khi chương trình đã đóng đăng ký. Không dùng ABC Foods/TTF/Green Pallet của ảnh mẫu làm xác nhận tham gia thật. Khi chưa có bản ghi được duyệt thì cả hai nhóm vẫn hiển thị với thông báo chờ công bố.

## TDD / QA

User journey: tìm thấy đúng khối trước sự kiện; phân biệt nhu cầu Buyer với năng lực Supplier; xem hết doanh nghiệp mà không hiển thị hồ sơ chưa duyệt.

- RED: test component thất bại do chưa có ThaiHoaConfirmedParticipants.jsx. RED pagination: thiếu export featuredParticipantPage.
- GREEN: test fixture SSR kiểm tra heading, 2 nhóm, empty states, first-page limit, nhu cầu/năng lực, link hồ sơ, không lộ INTERNAL, khóa đề nghị gặp; pure tests kiểm tra trang tiếp, clamp stale page, empty và expand.
- `node --test src/pages/__tests__/thaiHoaConfirmedParticipants.test.js src/pages/__tests__/thaiHoaEventLanding.test.js src/pages/__tests__/thaiHoaPostEvent.test.js src/pages/__tests__/thaiHoaLiveEvent.test.js src/pages/__tests__/programWorkflow.test.js src/pages/__tests__/programDiscovery.test.js`: 41/41 pass, exit 0.
- `node --test --experimental-test-coverage --test-coverage-include='src/pages/thaiHoaEventLandingModel.js' src/pages/__tests__/thaiHoaConfirmedParticipants.test.js src/pages/__tests__/thaiHoaEventLanding.test.js`: model 100% lines, 88.75% branches, 93.75% functions; không phải coverage toàn JSX hoặc repository.
- Vite build outDir riêng /private/tmp/ccu-post-build.Kus8o8 để bảo toàn dist/uploads; không thêm dependency. Bản cuối thành công 2237 modules, 7.46s, exit 0.
- Browser QA read-only 375, 768, 1440px: tiêu đề/hai nhóm hiện đúng, document không tràn ngang; tablet/mobile xếp dọc. Console error log lúc kiểm tra trống.
- Trên trang thật chưa có doanh nghiệp được duyệt nên pagination/expand không kích hoạt; các nhánh dữ liệu được kiểm tra bằng fixture SSR và pure tests, không thêm dữ liệu thử vào cloud. Không tuyên bố đã kiểm tra end-to-end nút đề nghị gặp với hồ sơ thật.
- Ảnh: thai-hoa-landing/confirmed-desktop-1440.png, confirmed-tablet-768.png, confirmed-mobile-375.png.
- Pixel regression INCONCLUSIVE (chưa có baseline tự động); kiểm tra trực quan bằng ảnh mẫu. Không đo CWV/axe/screen-reader toàn bộ. .git read-only, lưu RED/GREEN tại đây thay checkpoint commit; giữ các thay đổi khác.

## Tự đánh giá

4.0/5. Hướng dẫn redesign giúp sửa riêng khối cũ, không thay cả trang; browser QA xác nhận hai nhóm ở các breakpoint.

| Trục | Điểm | Bằng chứng và cải thiện |
|---|---:|---|
| Accuracy | 4 | 41 tests; chỉ dùng hồ sơ public đã xác nhận. Chưa kiểm tra dữ liệu tham gia thật qua Admin. |
| Completeness | 4 | Đúng nhóm/thẻ/pagination; không thể hiện logo công ty thật khi snapshot chưa có doanh nghiệp được duyệt. |
| Clarity | 4 | Tiêu đề cụ thể, hai nhóm màu rõ; có thể tinh chỉnh tên dài khi dữ liệu thật xuất hiện. |
| Actionability | 4 | Link trực tiếp tới khối và screenshot; cần publish hồ sơ thật để danh sách có nội dung. |
| Conciseness | 4 | Component tách riêng, không thêm dependency; JSX cũ quanh khối vẫn dài, ngoài phạm vi. |

Critical issues: không có trong phạm vi UI. Self-check: người dùng thấy khối đúng vị trí ngay nhưng các logo ở ảnh mẫu không được tự suy diễn là doanh nghiệp đã xác nhận. Cải thiện tiếp nếu được yêu cầu: quản trị/publish danh sách doanh nghiệp đã xác nhận.
