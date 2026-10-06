# Trạng thái bàn giao — 02/10/2026 (cập nhật sau thao tác Zen)

> Mốc lịch sử trước tích hợp backend. Trạng thái mới nhất nằm ở [CCU_BACKEND_INTEGRATION_2026-10-02.md](./CCU_BACKEND_INTEGRATION_2026-10-02.md): đã sửa mã local, test/build đạt; chưa hoàn tất live integration. Các dòng “chưa sửa source code” dưới đây chỉ đúng tại mốc lịch sử này.

## Đã hoàn tất

- Hai tài liệu Knowledge riêng cho SUPPI và CHAINY.
- Hai Instructions riêng và một Instructions định tuyến cho bot chung.
- Hướng dẫn nạp vào Dify và 22 tình huống kiểm thử.
- Kiểm tra đủ bảy file nội dung; không có placeholder TODO/FIXME hoặc credential được sao chép. Đã đối chiếu nhiệm vụ với phần SUPPI/CHAINY và workflow trong Master Context.
- Sao lưu Instructions cũ từ giao diện vào DIFY_ORIGINAL_INSTRUCTIONS_BACKUP_2026-10-02.txt; file này không được upload.
- Upload SUPPI_KNOWLEDGE_VI.txt và CHAINY_KNOWLEDGE_VI.txt vào hai dataset riêng trên Dify. Cả hai đã được quan sát ở trạng thái Available.
- Index High Quality, embedding text-embedding-3-small có sẵn; General chunk 1.500 ký tự, overlap 150; Hybrid Search, weighted semantic 0,7/keyword 0,3, Top K 5.
- Gắn hai dataset vào form app CCU AI Assistant (SUPPI & CHAINY); dán prompt mới 6.161 ký tự và áp dụng cho Preview.
- Chỉnh retrieval cấp app sang Weighted Score, Top K 5, không bật threshold; model chat vẫn Gemini 3.8 Flash, không đổi provider hoặc credential.

Dataset đã tạo:

- SUPPI: https://cloud.dify.ai/datasets/a780ef1c-fc03-4468-a2bc-436ff0ec317c/documents
- CHAINY: https://cloud.dify.ai/datasets/ad64c6a6-2bee-4346-8cd1-6659f20fd013/documents
- App cấu hình: https://cloud.dify.ai/app/4c670128-e805-4acc-a1ef-d1c8057b6f09/configuration

## Chưa thực hiện

- Chưa xác nhận Instructions và liên kết dataset được lưu bền vững qua reload/đóng tab. Lần điều hướng trước đã làm Instructions quay lại bản cũ; đã dán lại prompt và giữ nguyên tab cuối. Menu có Current Draft/Publish Update, chưa thấy Save Draft độc lập.
- Chưa hoàn tất/đạt toàn bộ 22 test runtime; các test chưa chạy vẫn là NOT RUN. Có lúc Preview trả ô phản hồi trống, không có nội dung để chấm hành vi.
- Chưa sửa Conversation Opener/gợi ý; giữ cấu hình cũ vì chưa tìm thấy thao tác chỉnh trực tiếp qua các control đã kiểm tra.
- Chưa kết nối hoặc xác minh tool database, draft, CRM/Zalo/lịch/reminder. Hai Knowledge chỉ cung cấp nghiệp vụ, không tạo khả năng thực hiện hành động thật.
- Chưa Publish; không sửa source code, database, URL; không commit/deploy/migration.

## Ghi nhận lỗi điều khiển và phục hồi

Lần trước Zen chuyển sang tab không liên quan và bị chặn vì phạm vi dữ liệu. Sau khi chủ dự án xác nhận đã mở Dify, đã tiếp tục thao tác đúng app.

Trong hộp chọn file macOS, thao tác clipboard gặp timeoutReached và “Timed out waiting for the application to read the clipboard”. Đã reset binding cua_repl, đọc lại cửa sổ, chuyển sang setValue cho trường đường dẫn rồi chọn Open. Kết quả: upload/index cả hai tài liệu thành công; không dùng công nghệ điều khiển máy khác để đi vòng.

Nguyên nhân chính xác chưa xác định; bằng chứng chỉ cho thấy clipboard/cửa sổ native bị timeout, không chứng minh lỗi Dify. Các thông báo “user changed app” được xử lý bằng đọc lại trạng thái trước bước tiếp theo. Không retry mù hoặc nhập lên trang ngoài task.

Nguy cơ: lặp thao tác UI gây tốn thời gian; Preview trống chưa cho phép đánh giá an toàn. Tiếp theo cần xác minh phản hồi bot, memory tuần tự và lưu/publish theo quyết định của chủ dự án. Không tự thay model/credential hoặc phát hành để giải quyết lỗi.

## Bằng chứng Preview

- Đã gửi “Anh cần carton.” và có lần chỉ thấy avatar/ô bot trống sau khi nút Stop responding biến mất. Không coi đây là test PASS.
- Lần gửi “Long Thành.” ở nhánh 2/2, bot trả: “Bạn đang cần tìm nhà cung cấp tại Long Thành hay cần giao hàng về khu vực này, và cho sản phẩm hoặc dịch vụ nào vậy?” Giao diện ghi 14,88 giây. Nhánh này không chứng minh memory carton + Long Thành; chưa chấm S01 đạt.
- Đã tạo lại phiên và thử carton sau khi đổi app retrieval; chưa có câu trả lời hoàn chỉnh được xác nhận ở thời điểm ghi trạng thái này.
- Tình huống CHAINY về WON/gửi tin/nhắc thứ Sáu đã có câu trả lời thực: bot không tự WON từ báo giá, không tự gửi, không hứa nhắc ngoài phiên; các guard này đạt trong tình huống đã thử. Giao diện ghi 12,99 giây. Chi tiết trong DIFY_PREVIEW_RESULTS_2026-10-02.md.
- Nhu cầu SUPPI 800 áo polo giao Long Thành tháng 11 đã được gửi; sau khi model dừng sinh vẫn chưa quan sát được nội dung phản hồi. Đánh dấu test bị chặn/không đủ dữ liệu để chấm, không PASS. Nguyên nhân Preview trống chưa xác định.

## Tự rà soát chất lượng

Tổng điểm 3,6/5; đã tạo/index tài liệu và chuẩn bị cấu hình trên UI, nhưng chưa xác minh đầy đủ runtime và lưu bền vững.

| Tiêu chí | Điểm | Bằng chứng/giới hạn và cải thiện |
|---|---|---|
| Chính xác | 4/5 | Vai trò, neutrality, DRAFT và guard WON bám Master Context; indexing Available đã được quan sát, hành vi bot chưa xác minh đầy đủ. Cần hoàn tất preview. |
| Đầy đủ | 3/5 | Đủ hai tài liệu/prompts, upload/index/gắn trên form; chưa hoàn tất kiểm thử và lưu bền vững. Cần xác minh runtime trước phát hành. |
| Rõ ràng | 4/5 | File tách theo Knowledge/Instructions/setup/test; hai bot riêng và hai vai trò trong bot chung đã phân biệt. Có thể rút gọn tài liệu nếu retrieval thực tế cho thấy lặp. |
| Khả năng sử dụng | 3/5 | Hai dataset Available và cấu hình hiện trên form; Preview có phản hồi trống, chưa thể xác nhận hoạt động ổn định. Cần kiểm thử và quyết định lưu/publish rõ ràng. |
| Súc tích | 4/5 | Quy tắc và ví dụ chia mục, không đưa Master Context kỹ thuật vào Knowledge. Một số guard được lặp có chủ đích để từng tài liệu độc lập. |

Ưu tiên: (1) hoàn tất preview và kiểm tra lưu cấu hình; (2) chủ dự án xác nhận nếu muốn Publish Update; (3) xác minh tool/database trước khi gọi bot là AI Search live.

Tự kiểm: chủ dự án có thể kiểm tra file và dataset đã index, nhưng không nên coi bot production sẵn sàng. Chỉ báo đã nạp Knowledge/đặt Instructions trên form, không nói đã fine-tune, đã Publish hoặc đã vượt qua toàn bộ test.
