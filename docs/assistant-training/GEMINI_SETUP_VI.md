# SUPPI & CHAINY — Gemini trực tiếp

## Cấu hình đã kiểm tra ngày 08/10/2026

Gemini `gemini-3.1-flash-lite` trả HTTP 200 và nội dung `OK` bằng key backend hiện có. Việc liệt kê model hoặc gọi Dify `/info` thành công chỉ chứng minh truy cập API, không chứng minh chat chạy được. Không đăng ký tài khoản mới, bật billing hay lấy key của bên thứ ba.

Cả hai giao diện chat vẫn gọi `/api/assistants/chat`; backend chọn provider. Nếu không đặt `ASSISTANT_PROVIDER`, backend ưu tiên `GEMINI_API_KEY` khi có, nếu không mới dùng Dify. Khi provider đã chọn gặp lỗi, không tự đổi provider/model hoặc retry yêu cầu có thể tính phí.

```dotenv
ASSISTANT_PROVIDER=gemini
GEMINI_MODEL=gemini-3.1-flash-lite
# Điền key riêng trong môi trường backend, không commit:
GEMINI_API_KEY=
```

Để quay lại Dify: đặt `ASSISTANT_PROVIDER=dify`, cấu hình `DIFY_API_KEY` và restart backend. Model thực tế do app Dify đã publish quyết định, không phải nhãn cố định trong CCU.

Chạy đầy đủ web và backend bằng **hai terminal**:

```sh
npm run server
```

```sh
npm run dev
```

Web Vite ở cổng 3000 proxy `/api` đến backend 5050. Chỉ chạy Vite không đủ để chat hoạt động. `/api/assistants/status` cho biết cấu hình và tình trạng database, không gọi AI hoặc xác nhận billing. Metadata từng lượt chat cung cấp model thực tế khi Gemini trả `modelVersion`.

## “Train” nghiệp vụ đã triển khai

Đây là **system instructions + ví dụ nghiệp vụ + truy vấn dữ liệu công khai bằng tool**, không huấn luyện lại trọng số, không fine-tune và không tự học từ khách hàng.

Nguồn hướng dẫn thực thi: `server/assistants/instructions.js`, phiên bản `ccu-dual-2026-10-08`. Nội dung chắt lọc vai trò từ tài liệu SUPPI/CHAINY hiện có:

- SUPPI: làm rõ nhu cầu, giữ quy cách/số lượng/địa bàn, tìm nguồn và chuẩn bị nháp RFQ.
- CHAINY: giữ ngữ cảnh bàn giao; soạn liên hệ, câu hỏi báo giá, kế hoạch gặp và checklist theo việc. Không gửi tin, tạo lịch/nhắc tự động hay cập nhật WON.
- Ví dụ không phải hồ sơ thật. Chỉ dùng doanh nghiệp, ID và URL từ tool; nguồn lỗi không được biến thành kết quả rỗng thành công.
- Backend vẫn kiểm soát schema tool, quyền sở hữu và xác nhận trước lưu DRAFT; không publish nhu cầu hoặc thực hiện hành động bên ngoài.

Lượt hỏi thêm/tư vấn/soạn tin không cần truy vấn chỉ gọi Gemini **một lần**. Lượt có tool cần lần thứ hai để diễn giải đúng bằng chứng. Lịch sử gửi có giới hạn 8 tin gần nhất cùng slots và tối đa 5 hồ sơ shortlist; không gửi toàn bộ database. Timeout 25 giây mỗi lần gọi; không retry tự động.

## Miễn phí, quyền riêng tư và giới hạn

Google có free tier cho model này nhưng quota tùy model/project và có thể thay đổi. Mã nguồn không xác định được key hiện tại thuộc free hay paid tier; cần kiểm tra Google AI Studio/Google Cloud của chủ tài khoản. Không có bảo đảm miễn phí vô hạn hoặc không bao giờ chạm quota. Không thay model hoặc bật billing khi chưa được chủ tài khoản đồng ý.

Theo chính sách free tier, Google có thể dùng nội dung để cải thiện sản phẩm. Người dùng phải tránh dữ liệu mật, bản vẽ, giá riêng, contact cá nhân và tài liệu khách hàng chưa được phép chia sẻ. Backend chỉ truy vấn projection public/published; câu chat và ngữ cảnh đã nhập vẫn được gửi đến Google. Đây không phải bộ lọc DLP tự động.

Không dùng tên biến `VITE_*` cho API key. Dự án có alias key legacy trong môi trường hiện tại: cần chủ tài khoản thu hồi/đổi key nếu key đó từng nằm trong bundle hoặc đã chia sẻ; chat mới chỉ đọc `GEMINI_API_KEY` ở server. Không đưa key vào log, URL, status hay trình duyệt.

Nếu database chưa kết nối, AI vẫn có thể hỏi thêm và soạn nội dung, nhưng không thể xác nhận hồ sơ hoặc lưu nháp. Các nguồn productsServices/programs/catalogues/publicRequirements chưa nối vẫn báo đúng giới hạn, không trả dữ liệu giả.

Lỗi 429: đợi/kiểm tra quota. 401/403: kiểm tra key/quyền. 404: kiểm tra model. 503: gián đoạn/quá tải. Nếu backend restart làm mất phiên tạm, giao diện bỏ phiên cũ và yêu cầu gửi lại; không tự lặp thao tác ghi.

Nguồn chính thức: [Giá và free tier](https://ai.google.dev/gemini-api/docs/pricing), [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [Model tuning](https://ai.google.dev/gemini-api/docs/model-tuning).
