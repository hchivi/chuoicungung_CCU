# Founding Partner — nội dung theo phạm vi năng lực

Ngày kiểm tra: 2026-10-03. Trang: `/founding-partner`.

## Brief và phạm vi

Đã đọc toàn bộ `founding_partner.rtf` bằng `textutil`. Yêu cầu trực tiếp của người dùng là sửa nội dung và thiết kế, viết kỹ để khách hàng hiểu. Dòng yêu cầu chỉ đọc trong tài liệu là nội dung brief cũ, không thay thế yêu cầu hiện tại.

Chỉ thay đổi page, CSS riêng, dữ liệu nội dung, helper chuẩn bị đề xuất và test tương ứng. Không đổi URL, backend, database, giao diện dùng chung; không commit hoặc deploy. Những thay đổi không liên quan đã có trong working tree được giữ nguyên.

## Nội dung đã triển khai

| Gói | Mức tham khảo | Thời hạn | Phạm vi định hướng |
| --- | --- | --- | --- |
| Starter | 6 triệu VNĐ | 6 tháng | 1 nhóm năng lực chính |
| Bạc | 12 triệu VNĐ | Năm | 1 nhóm năng lực chính |
| Vàng | 24 triệu VNĐ | Năm | Khoảng 3 nhóm năng lực |
| Kim Cương | 48 triệu VNĐ | Năm | Khoảng 5 nhóm năng lực |

Các mức trên lấy từ tài liệu người dùng, không phải mức giá đã được xác nhận bằng hợp đồng. Thuế, hạng mục, nội dung sản xuất mới và chi phí bổ sung phải thống nhất trong đề xuất thương mại. Không tự nhân giá khi thay đổi thời hạn.

- Giải thích Founding Partner là gói đồng hành thương mại theo năng lực thực, không phải góp vốn hay tư cách đồng sáng lập.
- Bổ sung sơ đồ một nhóm năng lực liên quan tới danh mục, sản phẩm/dịch vụ, từ khóa và địa bàn. Ví dụ CNC được ghi rõ là minh họa, không phải kết quả tìm kiếm hoặc doanh nghiệp thực.
- Không tính phí riêng từng từ khóa/địa bàn; nhiều điểm hiện diện phải phù hợp với năng lực thực tế.
- Bốn gói có nút chọn riêng và nút xem quyền lợi riêng; quyền lợi hiển thị là phạm vi dự kiến cần thỏa thuận.
- SUPPI vẫn matching theo nhu cầu, năng lực, địa bàn, thời gian, khả năng đáp ứng. Không tuyên bố đã sửa thuật toán matching trong lần này.
- Không hứa số lead/đơn hàng, không coi tài trợ là KYC/chứng nhận, không hiển thị danh sách đối tác mẫu như bằng chứng thực. Không xóa dữ liệu đối tác cũ.
- Quy trình bốn bước và tám FAQ giải thích năng lực, nhiều danh mục, giới hạn mềm, matching, đơn hàng, chứng nhận/góp vốn, chi phí nội dung, cách chọn gói.
- KCN, ban quản lý, hội/hiệp hội và nhà đầu tư được dẫn tới `/hop-tac` để chọn đúng hình thức thay vì gán quyền lợi không có trong gói.
- Form cho phép mô tả nhiều nhóm năng lực và phạm vi phục vụ. Các selector ngành/cụm nhu cầu/địa bàn là thông tin tham chiếu, không phải giới hạn từ khóa hoặc khoản phí riêng.
- Mô tả năng lực và gói quan tâm được ghép vào trường `objective` có sẵn khi lưu, không tạo schema hoặc migration mới.
- Luồng hiện tại vẫn chỉ lưu trên trình duyệt, chưa gửi đội ngũ CCU. Trang thông báo rõ điều này ở bước nhập và bước xem lại.

Nội dung các gói và FAQ được tách vào `src/pages/foundingPartnerContent.js` để cập nhật tập trung.

## Thiết kế và kỹ năng áp dụng

Sử dụng `design-taste-frontend` và `redesign-existing-projects`: giữ nhận diện B2B sáng, font sẵn có, ảnh công nghiệp minh họa có nhãn AI; tăng phân cấp chữ và trình tự hiểu → ví dụ → so sánh gói → đề xuất. Dials: DESIGN_VARIANCE=5, MOTION_INTENSITY=2, VISUAL_DENSITY=6. Màu Starter xanh, Bạc slate, Vàng champagne, Kim Cương teal phân biệt cấp gói; không dùng huy hiệu phổ biến hoặc cấp bách giả. Nội dung dài hơn mặc định của taste skill vì yêu cầu người dùng cần giải thích kỹ; chia thành đoạn, ví dụ và FAQ để dễ đọc.

## Kiểm chứng

TDD: trước implementation, 7 test cũ pass / 3 test mới fail (thiếu Starter/bốn mức giá, mô hình nhiều điểm hiện diện, helper lưu ngữ cảnh). Sau implementation:

```sh
node --test --experimental-test-coverage --test-coverage-include='src/pages/foundingPartnerUi.js' src/pages/__tests__/*.test.js
npm run build
git diff --check -- src/pages/FoundingPartnerPage.jsx src/pages/FoundingPartnerPage.css src/pages/foundingPartnerContent.js src/pages/foundingPartnerUi.js src/pages/__tests__/foundingPartnerUi.test.js
```

- 16/16 frontend tests pass, trong đó 10 Founding Partner và 6 Service Request.
- Helper `foundingPartnerUi.js`: 100% line/branch/function coverage. Không suy diễn thành coverage toàn page hoặc toàn repo.
- Production build pass. Cảnh báo chunk dữ liệu dùng chung vẫn còn (enterprises khoảng 42 MB, factories 7 MB, industrial parks 4 MB trước gzip); ngoài phạm vi page này.
- Browser QA trên localhost: desktop 1440×1000, tablet 768×1024, mobile 375×812. Không phát hiện phần tử page tràn ngang ở ba kích thước. Tablet bốn gói xếp 2×2, mobile xếp dọc; đã xem trực tiếp hero, khối giá, phần năng lực trên các kích thước liên quan.
- Chọn từng gói điền đúng ngân sách; Starter chuyển thời hạn 6 tháng, ba gói còn lại 12 tháng.
- Nút xem quyền lợi chỉ đổi phần xem, không làm thay đổi ngân sách/thời hạn của gói đã chọn. Enter trên nút xem quyền lợi hoạt động, chỉ một nút có `aria-pressed=true`.
- Form rỗng hiển thị năm lỗi liên hệ và một lỗi đồng ý, focus về tên doanh nghiệp.
- Dữ liệu giả chỉ dùng để kiểm tra bước xem lại: gói, nhóm năng lực, chuyên mục/cụm CNC và liên hệ xuất hiện đúng; nút chỉnh sửa giữ mô tả năng lực. Không bấm nút lưu cuối, không tạo inquiry giả. Reload tab QA riêng để xóa state tạm.
- FAQ nhóm năng lực mở được và hiển thị giải thích.
- Console tab QA không ghi nhận error; có cảnh báo chuyển đổi React Router v7 đã có sẵn.
- Chưa chạy Lighthouse/axe hoặc full E2E persistence. Không có baseline hình ảnh được quản lý để xác nhận visual regression tự động: INCONCLUSIVE cho bước so ảnh baseline.

Ảnh kiểm chứng tạm:

- `/private/tmp/ccu-founding-capability-pricing-desktop.png`
- `/private/tmp/ccu-founding-capability-pricing-tablet.png`
- `/private/tmp/ccu-founding-capability-pricing-mobile.png`

## Handoff / ANTIGRAVITY-READY

Đã thực hiện thay đổi frontend, không cần áp dụng lại từ đầu. Trước khi đưa lên web thật, chủ dự án cần duyệt bốn mức giá, quyền lợi cụ thể, thuế và điều kiện thương mại. Nếu cần nhận đăng ký thực, triển khai một task riêng nối endpoint có validation/consent, chống spam, xác nhận tiếp nhận; thay thông báo local-only chỉ sau khi đã kiểm chứng gửi thành công. Không biến nút chọn gói thành thanh toán hoặc tự kích hoạt tài trợ. Không để dữ liệu tài trợ ảnh hưởng kết quả matching tự nhiên.

Footer chung vẫn có tên “Đối Tác Sáng Lập” và các số liệu/KYC của hệ sinh thái. Không chỉnh phần dùng chung trong task này; cần kiểm chứng và rà lại nhãn ở một task được cho phép riêng để tránh mâu thuẫn với định nghĩa thương mại trên page.

## Self-evaluation

| Trục | Điểm /5 | Bằng chứng và giới hạn |
| --- | --- | --- |
| Accuracy | 4.5 | Giá/thời hạn/phạm vi đúng brief; không thêm cam kết lead/KYC. Quyền lợi cuối cùng vẫn cần chủ dự án duyệt. |
| Completeness | 4.5 | Definition, ví dụ, bốn gói, nguyên tắc, quy trình, form, tám FAQ. Không mở rộng sang backend ngoài yêu cầu nội dung/thiết kế. |
| Clarity | 4.5 | Phân biệt năng lực và từ khóa; các gói có giá/thời hạn/CTA; mobile heading đã chỉnh để tránh từ đơn bị rơi dòng. |
| Actionability | 4.5 | Code trực tiếp trong CCU, tests/build và checklist handoff; rõ giới hạn lưu local-only. |
| Conciseness | 4 | Nội dung dài có chủ đích theo yêu cầu, phân cấp và FAQ tránh dồn thành một đoạn. |

Không coi self-evaluation là bằng chứng thay thế tests hoặc kiểm tra trình duyệt.
