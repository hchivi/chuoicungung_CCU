# CCU: bản thiết kế sáng cho 5 trang

Ngày: 03/10/2026. Chỉ triển khai trong dự án local, chưa commit và chưa deploy.

## Phạm vi đã thay đổi

- `/dich-vu/hien-dien-tu-xa`: ảnh trọng tâm, phần chuẩn bị tài liệu, chương trình và form hồ sơ.
- `/dich-vu/vat-pham-su-kien`: bộ vật phẩm bằng hình ảnh, modal hạng mục, cấu trúc báo giá và cơ chế cung ứng.
- `/dich-vu/truyen-thong-doanh-nghiep`: ảnh bìa ngang, hồ sơ/video/ảnh/catalogue, lựa chọn ngữ cảnh sử dụng và quy trình duyệt.
- `/hop-tac`: chọn vai trò và đề bài tương ứng, giữ query `type=INVESTOR` và form tiếp nhận.
- `/tai-tro`: cặp ảnh bất đối xứng, hình thức đồng hành, quyền lợi, lọc hoạt động và form đề xuất.

Taste và Hallmark định hướng nội dung ngắn, ưu tiên hình ảnh, nền sáng và bố cục riêng theo mục đích từng trang. Token màu và font nằm trong phạm vi `.ec-page`; không đổi navbar, footer hay giao diện các trang khác.

Giữ các handler/persistence hiện có. Không sửa backend, database, data layer, slug hay cấu hình hosting. Không dùng số liệu báo cáo mẫu, thông tin phê duyệt mô phỏng hoặc ảnh minh họa để chứng minh thành tích thực tế. Không thêm chú thích ảnh AI trên giao diện theo yêu cầu.

## Kiểm tra thực tế

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run build` | PASS; Vite và bước sinh HTML hoàn thành |
| `node --test src/pages/__tests__/*.test.js` | 37/37 PASS, gồm 13 kiểm tra mới |
| `node docs/testing/qa-ecosystem-pages.mjs` | PASS: 30 tổ hợp trang/kích thước và 13 luồng tương tác |
| Kích thước | 320, 375, 414, 768, 1280, 1920px cho cả 5 trang |
| Tràn ngang, ảnh lỗi, form không có nhãn | Không phát hiện trong các kích thước đã kiểm tra |
| Lỗi JavaScript, console error, HTTP lỗi | Không phát hiện trong lượt QA local |
| Hero desktop | CTA chính thấy được ở 1280×800 |
| Tương tác | Modal, Escape/focus, lựa chọn cơ chế cung ứng, ngữ cảnh nội dung, vai trò đầu tư, prefill catalogue/chương trình, phân luồng Founding Partner |
| Form | Gửi thử hiện diện từ xa, hợp tác nhà đầu tư và tài trợ vật phẩm thành công trong localStorage của phiên headless riêng |
| Màu | Các cặp token chữ/nền, nút, border input và focus vượt ngưỡng tương phản được kiểm tra bằng unit test |

QA tạo Chrome headless riêng, không sử dụng tab Zen/Chrome của chủ dự án. Trong bước gửi form, tất cả request ghi ra mạng bị chặn. Dữ liệu thử được xóa khỏi localStorage của phiên kiểm thử trước khi đóng trình duyệt. Không tạo bản ghi trong database của dự án.

Ảnh kiểm tra và JSON chi tiết: `/tmp/ccu-ecosystem-qa/`. Script tái chạy được lưu ngay cạnh tài liệu này.

### Bằng chứng RED → GREEN

1. Kiểm tra giao diện mới được viết trước khi thay 5 page: 8 FAIL, 3 PASS. Các lỗi tương ứng giao diện cũ thiếu scope sáng, ảnh hero, nội dung vai trò và CTA bộ vật phẩm.
2. Sau triển khai: 11/11 PASS.
3. Thêm trường hợp tài trợ vật phẩm: 1 FAIL vì quyền lợi logo và báo cáo bị ẩn bởi danh sách 8 mục cố định.
4. Đổi phần hiển thị quyền lợi theo hình thức tài trợ: PASS. Sau bổ sung kiểm tra tương phản: 13/13 PASS; toàn bộ test frontend: 37/37 PASS.
5. QA phát hiện dropdown phản hồi tràn ở 320px; đã giới hạn width, giảm padding lồng và gắn nhãn control. Lượt QA sau sửa không còn tràn.
6. Test tương phản trang kết nối cũ từng đọc nhầm token của family mới; đã giới hạn parser vào `.mm-page`. Không sửa màu hoặc giao diện trang kết nối cũ để làm test qua.

Không tạo checkpoint commit vì đây là worktree có nhiều thay đổi đang dở và người dùng chưa yêu cầu commit. Chưa đo coverage toàn bộ JSX/branch; không tuyên bố đạt 80% coverage chỉ từ số case PASS.

## Giới hạn cần biết

- Form vẫn dùng lớp dữ liệu localStorage/seed hiện có. QA thành công không chứng minh CRM, email hay backend production đã tiếp nhận.
- Hàm lọc chương trình hiện diện từ xa hiện có mốc ngày cố định trong data layer; không thay đổi logic đó trong nhiệm vụ giao diện.
- Build còn cảnh báo chunk dữ liệu toàn dự án lớn, gồm dữ liệu doanh nghiệp. Không mở rộng sang tối ưu backend hoặc thay kiến trúc dữ liệu ở nhiệm vụ này.
- Chưa đo Lighthouse/Core Web Vitals của production; không tuyên bố tốc độ production hoặc SEO đã được cải thiện qua điểm số.
- Chưa có baseline hình ảnh được duyệt để so sánh pixel. Đã xem ảnh render mới desktop và mobile; kiểm tra visual regression so với baseline là INCONCLUSIVE.
- Chưa chạy axe hoặc screen reader toàn diện. Nhãn control, focus và tương phản được kiểm tra ở phạm vi cụ thể, không phải chứng nhận WCAG toàn trang.
- `git diff --check` của 5 page đã sửa: PASS. Worktree toàn dự án còn whitespace trong một số file ngoài phạm vi, được giữ nguyên.

## Tài sản hình ảnh

Tài sản mới được tạo bằng công cụ image generation tích hợp, không sử dụng API key của dự án.

File cuối: `public/images/ecosystem/remote-presence.jpg` (JPEG tối ưu cho web).

Prompt:

> Use case: photorealistic-natural. Asset type: CCU Vietnamese B2B remote-presence service editorial hero. Landscape 3:2. A bright industrial matching venue with a white and pale-blue supplier corner; blank catalogue, metal machining samples and a brochure holder. A Vietnamese visitor and event coordinator discussing materials. Focus on the tangible sample display, natural daylight, documentary photography, asymmetrical composition. No legible text, logo, banner, event name, watermark, UI or collage.

Ảnh này giải thích dịch vụ, không mô tả một chương trình CCU đã diễn ra. Các ảnh còn lại dùng tài sản local có sẵn, tạo bản JPEG nén riêng trong `public/images/ecosystem/` và không ghi đè ảnh nguồn.

## Tự đánh giá

Tổng: 4.0/5. Không có vấn đề nghiêm trọng trong phạm vi giao diện đã kiểm tra.

- Accuracy 4/5: build/test/QA có bằng chứng; chưa kiểm tra production, screen reader hoặc dữ liệu thực.
- Completeness 4/5: đủ 5 route, ảnh, nội dung và các form chính; chưa có baseline thị giác hay coverage JSX được đo.
- Clarity 4/5: rút gọn nội dung và tách đúng vai trò; form hiện diện vẫn dài vì cần giữ phạm vi giới thiệu và thông tin phản hồi.
- Actionability 4/5: xem ngay trên localhost và tái chạy QA; không có bước deploy production trong nhiệm vụ.
- Conciseness 4/5: bỏ nhiều khối lặp và mô phỏng; vẫn giữ nội dung điều khoản/consent cần thiết trong form.

Tự kiểm tra: người dùng có thể xác nhận trực tiếp qua 5 route. Cảm nhận phong cách cần phản hồi của người dùng, không tự tuyên bố thiết kế hoàn hảo.

Ưu tiên cho nhiệm vụ tiếp theo nếu được yêu cầu: duyệt thị giác, kiểm tra accessibility sâu hơn, rồi đánh giá kết nối persistence production riêng biệt.
