# Hai trang đối tác / kết nối và bộ màu xanh CCU

Ngày: 2026-10-05. Phạm vi: bản local trong dự án CCU, không commit hoặc deploy.

## Kết quả

- Đối tác phát triển: hero ảnh lớn, nội dung ngắn, 5 hình thức phối hợp có thể chọn, quy trình 4 bước, form có nhãn và FAQ.
- Tổ chức kết nối: 4 hình thức có ảnh, 3 giai đoạn tương tác, đầu việc/bàn giao, điều kiện thương mại, FAQ và CTA gửi đề bài.
- Taste + Hallmark định hướng bố cục sáng, ảnh giải thích dịch vụ, font CCU và nội dung trung lập. Không thêm số liệu thành tích, quyền ưu tiên matching, SLA hay cam kết hợp đồng.
- Nút chính: gradient xanh #127b4b → #006039; hover #158b54 → #00472a. Bộ chọn vẫn dùng nền sáng và trạng thái rõ.
- Footer: #082415, giữ cấu trúc, nội dung và liên kết. Lấy màu từ computed style của [Lacoste Vietnam](https://www.lacoste.com.vn/); hướng xanh tiết chế tham chiếu [Rolex](https://www.rolex.com/), không sao chép tài sản/logo của hai thương hiệu.
- Public shell nhận tokens và compatibility styles. Không áp dụng vào admin, ToDzung và AI workspace. Màu vòng đời, lỗi, trạng thái và biểu tượng CCU nhiều màu không bị đổi đồng loạt.

## Không thay đổi

Backend, database, migration, dữ liệu seed, endpoints, slug và hosting. Form đối tác giữ payload và hàm submitPartnerApplication hiện có. Trạng thái tạo mới vẫn là APPLIED, không tự duyệt.

Handler hiện tại lưu hồ sơ bằng localStorage. Đã làm rõ điều này trước và sau khi gửi; không khẳng định đã gửi email/CRM hoặc chuyển hồ sơ lên máy chủ. Cần kiểm tra tích hợp backend riêng trước khi dùng form để tiếp nhận hồ sơ thật.

Giữ liên kết yêu cầu dịch vụ với service=to-chuc-ket-noi và cả 4 format: plant-sourcing, kcn-expo, joint-booth, pitching-session.

## Bằng chứng kiểm thử

Lệnh:

```sh
node --test src/pages/__tests__/*.test.js
node docs/testing/qa-green-partnership-pages.mjs
npm run build
```

- RED trước triển khai: 4 kiểm thử mới thất bại đúng các tiêu chí thiết kế/màu chưa có. RED bổ sung cho việc giữ chiều cao vùng tải cũng thất bại trước khi sửa.
- Sau sửa: 42/42 kiểm thử frontend qua, gồm một H1, nhãn form, consent, query links, copy không cam kết sai và tính tương phản tokens.
- Browser QA: 12 trường hợp, hai trang × 320/375/414/768/1280/1920px; không tràn ngang, không ảnh lỗi, không trường thiếu nhãn, footer đúng màu.
- Tương tác: chọn 5 hướng hợp tác; prefill checkbox; thông tin bắt buộc; lỗi chưa chọn hình thức; lưu APPLIED trong hồ sơ Chrome tạm; 3 giai đoạn kết nối; 4 query links; FAQ bằng Enter; gradient/hover; reduced motion.
- Smoke màu chung: trang chủ, hợp tác INVESTOR, tài trợ, yêu cầu dịch vụ và Founding Partner.
- Hero desktop đã kiểm tra tại 1280×800: cả hai CTA nằm trong màn hình đầu tiên. Có ảnh trước/sau và screenshot mobile để đọc bằng mắt.
- Vite production build thành công. Vẫn có cảnh báo chunk dữ liệu lớn từ cấu trúc hiện có; không đổi kiến trúc dữ liệu trong tác vụ thiết kế này.

## Hiệu năng và giới hạn

Đo trên Vite localhost, Chrome headless, không phải kết quả production hoặc Lighthouse: lượt QA gần nhất ghi nhận ví dụ LCP 716ms tại đối tác/320px; CLS đối tác/375px khoảng 0.000064 và kết nối/1280px khoảng 0.001084.

Ban đầu CLS khoảng 0.186–0.205 ở viewport 1000px. Chẩn đoán cold-load 375×844 thấy footer đang hiển thị trong Suspense fallback rồi bị đẩy khỏi viewport, tạo shift khoảng 0.220. Giữ min-height:100svh cho main-content của riêng hai route đã loại bỏ shift lớn này. Không đổi fallback các trang khác.

Chưa có INP thực địa, chạy Lighthouse, axe-core hoặc đánh giá screen reader đầy đủ. Không tuyên bố WCAG toàn website hoặc production performance. Không có baseline screenshot đã commit nên visual regression tự động: INCONCLUSIVE; thiết kế mới được kiểm tra trực quan, không phải pixel-match bản cũ. Chưa đo coverage 80%.

## Nguồn ảnh và tính trung thực

Công cụ tạo ảnh mới báo quota 429; không tiếp tục gọi, không yêu cầu API key. Dùng ảnh giải thích dịch vụ đã có tại public/images/ecosystem và hai ảnh matchmaking-v1. Không dùng cảnh ảnh làm chứng cứ rằng CCU đã tổ chức sự kiện, có khách hàng/đối tác cụ thể hoặc đã nghiệm thu. Không thêm caption AI theo yêu cầu trước của người dùng; giữ alt mô tả là minh họa và provenance ở đây. Nên thay bằng ảnh doanh nghiệp được cấp quyền/phê duyệt trước khi xuất bản.

Không kiểm chứng lại các số lượng doanh nghiệp/KYC và dữ liệu chương trình có sẵn trong shared footer/data. Giữ nguyên vì phạm vi footer là màu sắc, không phải sửa dữ liệu hay copy toàn hệ thống.

## Agent self-debug report

- Failure: QA chờ .dp-error nhưng form đã chuyển sang success. Một lần đo reduced-motion trúng lúc stylesheet HMR còn cập nhật.
- Diagnosis: thao tác click checkbox theo tọa độ không chắc chắn đã bỏ hết lựa chọn; chưa kiểm tra trạng thái trước khi submit.
- Recovery: kiểm tra native validity, dùng focus + Space, assert từng checkbox unchecked và tổng lựa chọn = 0; chờ computed transform sau đổi media.
- Result: nhánh validation và APPLIED đều qua. Không thay backend hoặc handler để làm cho test vượt qua. Chrome dùng profile tạm, không thao tác vào Zen hoặc dữ liệu trình duyệt của người dùng.
- Prevention: kiểm tra preconditions trạng thái DOM trước khi kiểm thử nhánh lỗi; không thay CSS giữa một lượt chạy QA.

## Tự đánh giá

Tổng 4.0/5; không có trục dưới 3.

| Trục | Điểm | Bằng chứng / giới hạn |
| --- | --- | --- |
| Accuracy | 4 | Test/build và trạng thái APPLIED xác nhận; chưa xác minh production hay bản quyền tất cả ảnh sẵn có. |
| Completeness | 4 | Hai trang và màu public/hover/footer đã làm; kiểm thử smoke màu không phải audit mọi route. |
| Clarity | 4 | Copy ngắn, CTA rõ, local-storage disclosure; cần khách hàng thật kiểm chứng cách gọi từng hình thức. |
| Actionability | 4 | Xem ngay trên localhost, có QA script; form chưa phải kênh gửi production. |
| Conciseness | 4 | Bỏ preview giả và gom nội dung; form consent giữ dài vì cần bảo toàn điều kiện. |

Ưu tiên tiếp theo nếu được yêu cầu: phê duyệt ảnh thật, kiểm tra dữ liệu công khai, nối tiếp nhận hồ sơ production. Không tự thực hiện.
Self-check: người dùng có thể kiểm tra ngay hai URL; thẩm mỹ cần phản hồi thực tế, không tự nhận đạt điểm tuyệt đối.
