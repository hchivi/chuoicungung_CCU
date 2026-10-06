# Trang tổ chức kết nối B2B — bàn giao giao diện

Ngày: 03/10/2026. URL: http://localhost:3000/dich-vu/to-chuc-ket-noi

## Phạm vi

Chỉ thiết kế lại trang dịch vụ này. Không sửa header/footer, Founding Partner, trang yêu cầu dịch vụ, dữ liệu chương trình, backend, database, slug hay luồng submit. Không commit hoặc deploy. Các thay đổi có sẵn trong worktree được giữ nguyên.

File triển khai: `src/pages/MatchmakingServicePage.jsx`, `src/pages/MatchmakingServicePage.css`, `tokens.css`. Tokens và mọi selector mới chỉ áp dụng bên trong `.mm-page`.

## Taste + Hallmark

- Macrostructure: Narrative Workflow; hero H2 Split diptych, nội dung đi theo trước–trong–sau cuộc gặp.
- Theme: Atelier điều chỉnh theo nhận diện CCU; nền giấy ấm, xanh mực, champagne tiết chế. Giữ SpaceGrotesk/Poppins tự host; không đổi font toàn website.
- Enrichment: E8, hai ảnh minh họa tạo bằng built-in imagegen, crop bất đối xứng và giảm saturation bằng CSS. Không phải hình ảnh sự kiện hay khách hàng đã được xác nhận.
- Sections: hero → bốn hình thức → quy trình → bàn giao/AI → phạm vi/chi phí → chương trình hiện có → FAQ → chuẩn bị đề bài.
- Motion: phản hồi nhấn nhẹ, xoay chevron của disclosure; không entrance animation, autoplay hoặc scroll-fade. Có CSS reduced-motion.
- Taste dials: variance 6, motion 2, density 5.
- Hallmark critique: P4 H4 E4 S4 R4 V4. Đây là tự đánh giá thiết kế, không phải kết quả đo người dùng.
- Gate sweep: đã kiểm tra các nhóm typography, hierarchy, tokens, contrast, honest copy, keyboard/disclosure và responsive của phần trang mới. Không tuyên bố toàn website đạt 58/58: gate 42/43 của chrome chung được giữ theo phạm vi; gates không liên quan đến form/video/toast/tab không áp dụng; kiểm tra responsive ở các mốc cụ thể, không quét liên tục mọi pixel. Tokens được scope `.mm-page` thay vì `:root` để không làm đổi trang khác.

## Nội dung

Giữ bốn format ID và các đường dẫn có `service=to-chuc-ket-noi&format=...`. Nội dung diễn đạt lại từ mô hình, quy trình và hạng mục hiện có; không thêm số lượng khách hàng, tỷ lệ thành công, giá hoặc cam kết ký hợp đồng.

Nhấn mạnh người phụ trách, bước tiếp theo và hạn phản hồi. Thời gian follow-up được chốt theo phương án, không mặc định 30–60 ngày. Vai trò AI là hỗ trợ tùy cấu hình, không tự xác nhận năng lực/kết quả. Tài trợ không phải tiêu chí ưu tiên matching. Dữ liệu chỉ bàn giao trong phạm vi cho phép.

Chương trình lấy từ helper/data hiện có, không mô tả là kết quả truy vấn database trực tiếp. Trang chi tiết cần xác nhận lịch và điều kiện tham gia.

## Kiểm thử tự động

TDD RED trước khi sửa: 6 tests, 1 pass / 5 fail (scope, nested main, disclosure, nội dung minh bạch và chiến lược ảnh chưa đáp ứng).

GREEN: `node --test src/pages/__tests__/*.test.js` — 24/24 pass, gồm 8 tests mới cho matchmaking và 16 regression tests hiện có.

Chạy V8 coverage với `--test-coverage-include='**/MatchmakingServicePage.jsx'`: 100% lines / 82.93% branches / 100% functions theo báo cáo của module được bundle bằng esbuild trong harness. Đây không phải coverage toàn ứng dụng hoặc bằng chứng automated test lifecycle SEO; lifecycle được kiểm tra riêng trong trình duyệt.

`npm run build`: pass. Có cảnh báo chunk lớn từ dữ liệu doanh nghiệp/nhà máy/KCN có sẵn; không thay cấu trúc dữ liệu ngoài phạm vi.

Diff check cho file trang: pass. Diff check toàn worktree báo whitespace ở các file đã có thay đổi trước task; không tự sửa các file đó.

## Kiểm tra trình duyệt thật

- Viewports 320×800, 375×812, 414×896, 768×1024, 1280×800, 1440×900 và 1920×1080: không thấy phần tử thuộc `.mm-page` tràn ngang. Scrollbar dọc làm client width nhỏ hơn viewport 6px.
- Primary CTA hiển thị trong fold ở 1280×800. Các CTA có nhãn một dòng; touch targets mới đạt tối thiểu 44px.
- Cả bốn CTA format mở dịch vụ Kết nối doanh nghiệp. Đi đến bước chi tiết bằng dữ liệu QA giả, xác nhận select lần lượt là plant-sourcing / kcn-expo / joint-booth / pitching-session. Không bấm submit, không tạo yêu cầu hay lưu dữ liệu thử nghiệm.
- FAQ đầu mở/đóng bằng Enter, nội dung hiện đúng và focus outline 3px có hiệu lực.
- Hạng mục bổ sung mở/đóng, đủ năm mục từ dữ liệu hiện có.
- Neo quy trình nằm ở ~140px dưới đầu viewport, không bị header che. Ảnh hỗ trợ lazy-load hoàn tất khi đến phần quy trình.
- Link chương trình VSIP mở đúng trang `/chuong-trinh/vsip-binh-duong` và heading tương ứng.
- Runtime title/meta description đúng; chỉ một script Service JSON-LD sau nhiều lần rời/quay lại trang. Không thêm review, rating hoặc offer giả.
- Console tab QA: chỉ thấy các warning React Router future flags có sẵn, không thấy error trong các log kiểm tra.
- WCAG token pairs: chữ chính/nền giấy ~13.99:1; chữ phụ ~8.91:1; chữ muted/nền giấy ~6.34:1; muted/nền thứ cấp ~5.71:1; chữ trên nút champagne ~6.46:1. Test kiểm tra cả focus ở nền sáng; nút dark-section dùng outline sáng kèm khoảng tách tối.
- Reduced motion được kiểm tra từ CSS, chưa emulation hệ điều hành. Chưa chạy axe, Lighthouse hoặc đo Core Web Vitals production; không công bố điểm performance.

Ảnh desktop: `/private/tmp/ccu-matchmaking-desktop.png`. Ảnh mobile: `/private/tmp/ccu-matchmaking-mobile.png`.

## Tài sản ảnh

Built-in imagegen, không dùng CLI/API key. Prompt đầy đủ tại `docs/testing/matchmaking-image-prompts.md`.

- `public/images/services/matchmaking-meeting-v1.jpg`: 1536×1024, khoảng 275KB; eager/high priority, dimensions khai báo.
- `public/images/services/matchmaking-samples-v1.jpg`: 1536×1024, khoảng 280KB; lazy, dimensions khai báo.

Caption công khai ghi rõ minh họa AI. Nên thay bằng ảnh chương trình thực có quyền sử dụng khi có; chỉ cần đổi PHOTOS trong file trang. Không tạo testimonial hoặc gán tên doanh nghiệp cho người trong ảnh.

## Tự đánh giá

| Trục | Điểm | Bằng chứng / giới hạn |
| --- | --- | --- |
| Accuracy | 4/5 | 24 tests, CTA tương thích và build pass; nội dung chương trình vẫn phụ thuộc dữ liệu tĩnh hiện có. |
| Completeness | 4/5 | Đã đổi bố cục, nội dung, ảnh, responsive và FAQ đúng một trang; chưa có phản hồi khách hàng thực về thiết kế mới. |
| Clarity | 4/5 | Quy trình, đầu ra và chi phí tách rõ; nội dung trang vẫn dài vì giữ đủ phạm vi nghiệp vụ. |
| Actionability | 4/5 | Xem được ngay trên localhost, giữ CTA thật; production do người dùng tự triển khai. |
| Conciseness | 4/5 | Loại bỏ nhiều khung lồng và nhãn kỹ thuật; có thể tinh chỉnh độ dài mô tả sau khi xem hành vi đọc. |

Overall 4.0/5. Ưu tiên cải thiện tiếp theo (không tự thực hiện): (1) thay ảnh AI bằng ảnh thực được duyệt; (2) đo Lighthouse/CWV bản production; (3) lấy phản hồi khách hàng trước khi rút ngắn thêm nội dung.

Self-check: đánh giá còn chủ quan về thẩm mỹ; người dùng có thể thích phong cách rực rỡ hơn. Không coi điểm tự đánh giá là chứng nhận chất lượng.
