# CCU — SUPPI và CHAINY qua Dify/Gemini

Cập nhật 02/10/2026. Thay thế hướng dẫn cũ dùng khóa VITE_ và gọi Gemini trực tiếp.

## Kiến trúc hiện tại

Web CCU → /api/assistants/chat → Dify → model của app Dify.
Cả SUPPI, CHAINY và trang /suppi-search dùng chung adapter; không cần khóa OpenAI cho luồng này. Giữ nguyên bố cục/CSS web.

Một tin nhắn có hai lần gọi Dify: chuẩn hóa JSON và viết câu trả lời. Giữa hai lần, backend kiểm tra schema, thực thi tối đa một tool được phép và gửi dữ liệu công khai có căn cứ. Vì vậy chi phí/độ trễ có thể cao hơn một lượt chat trực tiếp.

## Cấu hình ứng dụng Dify đã có

1. Mở app CCU AI Assistant (SUPPI & CHAINY), chọn đúng Gemini 3.8 Flash như yêu cầu. Cần kiểm tra provider thực sự hỗ trợ model này; backend không tự đổi sang model khác và không thể chọn model thông qua chat API.
2. Dán toàn bộ docs/assistant-training/CCU_DUAL_ASSISTANT_INSTRUCTIONS_VI.txt vào Instructions. Giao thức PLAN/REPLY là bắt buộc để backend chuẩn hóa và thực thi tool.
3. Gắn hai tài liệu SUPPI_KNOWLEDGE_VI.txt và CHAINY_KNOWLEDGE_VI.txt nếu chưa có. Đây là nghiệp vụ, KHÔNG phải danh bạ live; không fine-tune database vào model.
4. Kiểm tra lưu, publish bản app Dify sau khi xem lại cấu hình. Không đồng nghĩa deploy website CCU. Tạo cuộc trao đổi mới khi đổi model/prompt để tránh cấu hình cũ của hội thoại.
5. Trong Access API/API Keys, dùng khóa ứng dụng hiện có. Khóa provider Gemini nằm trong Dify và không thay thế được khóa ứng dụng Dify.

## Cấu hình backend local

Điền vào .env đã có, không ghi đè các biến khác, không gửi khóa vào chat:

```dotenv
DIFY_API_URL=https://api.dify.ai/v1
DIFY_API_KEY=
ASSISTANT_SESSION_SECRET=
```

Điền khóa ứng dụng Dify vào DIFY_API_KEY. Production cần ASSISTANT_SESSION_SECRET ngẫu nhiên, giữ ổn định giữa lần khởi động. Không thêm VITE_ trước khóa. Giữ MongoDB URI hợp lệ trong MONGODB_URI.

Khởi động lại **backend** sau khi sửa .env: `npm run server`. Frontend: `npm run dev` nếu chưa chạy. Vite cổng 3000 proxy /api về 5050; không cần thay giao diện.

Mở http://localhost:3000/api/assistants/status: cần hai vai trò dify-configured, database connected. configured_model chỉ là model yêu cầu; model_verified: false nhắc rằng phải kiểm tra model thực tế ở Dify Logs, không phải bằng chứng đã gọi thành công.

Theo [tài liệu Dify chính thức](https://docs.dify.ai/en/api-reference/guides/get-started), API key của app chỉ được dùng phía backend.

## Test trên website local

- /suppi-search: “Anh cần carton.” → “Long Thành.”: giữ nhu cầu carton và địa điểm; không hỏi lại thông tin đã biết.
- /tro-ly-ai hoặc chat nổi: “Soạn nội dung xin báo giá cho hồ sơ vừa tìm.”: CHAINY giữ context, chỉ soạn, chưa gửi.
- “Tạo bản nháp nhu cầu”: chỉ ghi DRAFT khi MongoDB kết nối; không publish, không gửi bên ngoài.
- “Đừng tạo bản nháp”: không ghi dữ liệu.
- Database lỗi hoặc nguồn chưa nối: báo đúng lỗi, không dùng hồ sơ mẫu làm kết quả thật.

Chat trong Preview Dify riêng lẻ KHÔNG kiểm thử được tool MongoDB nằm ở backend CCU. E2E phải thực hiện trên localhost và xem log app Dify cùng lúc.

## Giới hạn đang có

- Adapter live hiện có: nhà cung ứng, nhà máy, KCN, hội/hiệp hội, chỉ lấy bản ghi công khai và đã PUBLISHED rõ ràng. Không tự nâng dữ liệu cũ thành đã xác minh.
- Sản phẩm/dịch vụ, chương trình, catalogue và nhu cầu công khai chưa nối live trong gateway này; trả SOURCE_NOT_CONNECTED, không giả vờ tìm xong.
- Gateway dùng structured/lexical search hiện có; chưa tích hợp vector retrieval thật. Knowledge Dify không thay thế vector index đồng bộ database CCU. Chưa đạt toàn bộ hybrid-search roadmap ban đầu.
- Khi MongoDB mất kết nối, hội thoại chỉ tạm trong RAM; không lưu draft, không hứa nhớ qua lần restart.
- Chưa có tool gửi Zalo/email, tạo lịch, nhắc tự động hoặc ghi WON.
- Luồng /api/suppi cũ vẫn còn để tương thích/test; ba giao diện AI đã chuyển sang /api/assistants/chat.

## Đưa lên web thật — chủ dự án tự thực hiện

Deploy cả Node backend và frontend, đặt secret phía server, cấu hình reverse proxy /api về backend. Chỉ upload thư mục dist không đủ cho AI. Không rewrite /api/* thành index.html. Chưa có thao tác deploy/commit/migration trong lần bàn giao này.
