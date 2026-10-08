# SUPPI / CHAINY — kiểm chứng Gemini

Ngày kiểm tra: 08/10/2026. Phạm vi: khôi phục AI cho hai mascot tại localhost, tối ưu số lần gọi, hướng dẫn nghiệp vụ và bảo vệ key. Không triển khai production, bật billing, đăng ký tài khoản hoặc gửi tin bên ngoài.

## Kết quả

- Gemini `gemini-3.1-flash-lite`: gọi inference thật HTTP 200 bằng key backend hiện có; response trả `modelVersion` tương ứng.
- Hai lượt API qua Vite proxy: SUPPI làm rõ nhu cầu giả lập 500 áo thun; CHAINY nhận cùng conversation và soạn RFQ, giữ số lượng. Metadata `engine: gemini`, `model_verified: true`.
- Thử trực tiếp widget trang chủ: SUPPI trả lời, chuyển CHAINY giữ ngữ cảnh, có thông báo quyền riêng tư. Không bấm Zalo hoặc gửi liên hệ thật.
- Kiểm tra truy vấn khi database lỗi: API trả `retrieval.status: unavailable`, `code: DATABASE_UNAVAILABLE`, 0 hồ sơ; câu trả lời thông báo không thể truy vấn, không tạo doanh nghiệp giả.
- Chỉ hỏi thêm/tư vấn/soạn tin: một lần gọi model. Có tool: thêm một lượt diễn giải bằng chứng. Không tự retry, đổi model hay replay thao tác ghi.

## TDD và kiểm tra tự động

RED checkpoints trước các phần triển khai tương ứng:

- `14a8d36`: thiếu Gemini client/provider và kiểm chứng bàn giao ngữ cảnh.
- `33e314b`: adapter cũ lộ đường gọi Gemini ở frontend; phiên hết hạn chưa có hướng dẫn phục hồi rõ ràng.
- `f3bdecc`: browser phát hiện model tự thêm `slots.unit`; thêm test schema JSON ràng buộc trước khi sửa.

GREEN verification:

| Kiểm tra | Kết quả |
| --- | --- |
| `RUN_HTTP_TESTS=1 npm test` | 89 pass, 0 fail, 0 skip |
| Coverage assistant backend và transport được chọn | 51 test pass; lines 95.68%, branches 88.26%, functions 91.30% |
| Ngưỡng lines coverage | 80%, đạt |
| `npm run build` sau thay đổi cuối ở giao diện | Pass, 14.73 giây |
| Credential scan bundle bằng key hiện có, không in giá trị | 0 key provider tìm thấy |
| `git diff --check` | Pass |

Coverage không phải toàn dự án. Các đường runtime phụ thuộc database còn chưa được thử end-to-end với MongoDB hoạt động. Build vẫn cảnh báo các chunk dữ liệu lớn có sẵn; không giải quyết performance toàn trang trong thay đổi AI này. Không có kết luận kiểm toán toàn site về accessibility, responsive hay visual regression.

## Giới hạn cần bàn giao

1. MongoDB hiện lỗi `querySrv ENOTFOUND` tại bản ghi SRV của cluster. Chat và soạn nội dung chạy được; tìm hồ sơ thực và lưu DRAFT chưa dùng được. Cần chủ dự án kiểm tra trạng thái cluster/hostname và cập nhật `MONGODB_URI` riêng ở backend nếu đã thay đổi, rồi restart và thử lại tra cứu/lưu nháp.
2. Model có free tier nhưng billing tier của key chưa được xác minh. Không bật billing hay tự chuyển sang model khác. Quota vẫn có thể gây 429.
3. Free tier có chính sách sử dụng nội dung để cải thiện sản phẩm. UI đã cảnh báo; chưa có DLP tự động. Không nhập dữ liệu mật hoặc thông tin cá nhân không được phép chia sẻ.
4. Đây là system instructions + ví dụ + tool dữ liệu public, không fine-tuning trọng số hay tự học từ hội thoại. Không gửi Zalo/email, tạo lịch hoặc publish nhu cầu.
5. Dify `/info` truy cập được; chưa xác minh inference thực của app Dify. Không công bố một model Dify cố định.
6. Alias `VITE_GEMINI_API_KEY` legacy chưa bị sửa trong môi trường thật. Code mới không đọc alias này; chủ tài khoản cần rotate key nếu từng công khai hoặc nằm trong bundle cũ.

Hướng dẫn khởi chạy và cấu hình: [GEMINI_SETUP_VI.md](../assistant-training/GEMINI_SETUP_VI.md).

## Self-evaluation

Summary: 3.8/5; bàn giao kết nối chat đã kiểm chứng, ghi rõ phần sourcing bị giới hạn bởi MongoDB.

| Trục | Điểm | Bằng chứng và cải thiện |
| --- | --- | --- |
| Accuracy | 4/5 | Model được xác minh bằng inference thật; billing tier chưa xác minh. Chủ tài khoản kiểm tra AI Studio trước khi coi là miễn phí. |
| Completeness | 4/5 | Cả hai mascot, schema, context, lỗi và bảo mật key đã xử lý; live database và Dify inference chưa xác minh. Bổ sung kiểm tra sau khi cluster hoạt động. |
| Clarity | 4/5 | Tài liệu tách chat, dữ liệu, chi phí và giới hạn; tên hàm Dify legacy còn được giữ để tương thích. Có thể đổi tên trong một refactor riêng. |
| Actionability | 3/5 | Có lệnh chạy, cấu hình và chat dùng ngay; chưa hoàn tất tra cứu/lưu nháp vì DNS MongoDB. Khôi phục cluster rồi chạy thử bằng dữ liệu thử nghiệm được phép. |
| Conciseness | 4/5 | Báo cáo gom bằng chứng và phạm vi; có lặp phần giới hạn trong hướng dẫn để mỗi tài liệu đọc độc lập. Có thể hợp nhất khi tài liệu vận hành ổn định. |

Critical issues (điểm ≤ 2): không có.

Top improvements, theo ảnh hưởng:

1. Khôi phục MongoDB và xác minh tìm nguồn/lưu DRAFT với dữ liệu thử nghiệm. Đây là phần cần chủ tài khoản kiểm tra cluster, không thể xác nhận chỉ bằng sửa code AI.
2. Xác minh free/paid tier và quota trong AI Studio; rotate key legacy nếu từng lộ.
3. Bổ sung đo độ trễ nhiều lượt sau khi dùng thực tế; hiện mới smoke-test có kiểm soát để hạn chế gọi API.

Self-check: Người dùng có thể đồng ý rằng chat đã dùng được, nhưng chưa nên coi toàn bộ quy trình tìm nguồn là hoàn tất khi MongoDB chưa kết nối.

Verdict: Bàn giao chat với giới hạn rõ ràng; chưa chứng nhận full sourcing production-ready. Áp dụng TDD, Verification Loop, Browser QA và Agent Self-Evaluation.
