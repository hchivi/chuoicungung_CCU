# Bộ tài liệu SUPPI và CHAINY

Trạng thái tích hợp mã nguồn và việc còn thiếu mới nhất: [CCU_BACKEND_INTEGRATION_2026-10-02.md](./CCU_BACKEND_INTEGRATION_2026-10-02.md). Hướng dẫn bên dưới mô tả bộ Knowledge/Instructions; không phải xác nhận bot đã vận hành production.

Ngày tạo: 02/10/2026. Nguồn định hướng: Master Context CHUOICUNGUNG.COM phiên bản 30/09/2026 và yêu cầu của chủ dự án. Bộ này chỉ chứa nghiệp vụ và tình huống minh họa, không chứa credential, danh bạ thật hoặc báo cáo bảo mật nội bộ.

## Dùng file nào?

- `SUPPI_KNOWLEDGE_VI.txt`: tải vào Knowledge của SUPPI.
- `CHAINY_KNOWLEDGE_VI.txt`: tải vào Knowledge của CHAINY.
- `SUPPI_INSTRUCTIONS_VI.txt`: dán vào Instructions nếu tạo bot SUPPI riêng.
- `CHAINY_INSTRUCTIONS_VI.txt`: dán vào Instructions nếu tạo bot CHAINY riêng.
- `CCU_DUAL_ASSISTANT_INSTRUCTIONS_VI.txt`: dán vào Instructions của bot chung SUPPI & CHAINY đang mở trong Dify; gắn cả hai Knowledge.
- `ACCEPTANCE_TESTS_VI.md`: bộ tình huống kiểm thử trước Publish.

Không tải README, báo cáo kiểm thử hoặc Master Context kỹ thuật đầy đủ vào Knowledge public của bot. Không coi ví dụ trong Knowledge là kết quả database.

## “Train” trong giao diện này là gì?

Instructions hướng dẫn hành vi. Knowledge cung cấp tài liệu được truy hồi theo câu hỏi (RAG). Hai việc này không fine-tune model và không tự kết nối database. Một bot chung có hai vai trò không phải hai agent độc lập; muốn hai bot riêng cần hai app và luồng chuyển context thực sự.

Giao diện quan sát là Dify Cloud, app Chatbot “CCU AI Assistant (SUPPI & CHAINY)”. Model hiển thị Gemini 3.8 Flash. Không tự đổi model/provider trong task này. Kiến trúc backend SUPPI mục tiêu trong Master Context là OpenAI Responses API + Function Calling + Conversation State; cấu hình Knowledge trên Dify không thay thế hoặc chứng minh kiến trúc đó đã được tích hợp.

## Cấu hình draft trong Dify

1. Sao lưu Instructions hiện tại trước thay thế.
2. Dán prompt bot chung vào Instructions của app hiện tại.
3. Tạo/gắn Knowledge từ hai file nghiệp vụ. Nếu workspace đã có dataset cùng tên, kiểm tra phiên bản trước để tránh gắn trùng.
4. Giữ Knowledge ở quyền hạn hiện có; không công khai dataset hay cấp quyền rộng thêm. Chọn phương án indexing có sẵn trong workspace, không đăng ký/nâng cấp gói hoặc đổi provider nếu chưa được yêu cầu.
5. Kiểm tra processing thành công cho từng tài liệu và cả hai dataset được gắn vào app. Đã upload không đồng nghĩa indexing thành công.
6. Đổi opening message/gợi ý của draft nếu chức năng có sẵn. Không đổi giao diện website.
7. Chạy Debug & Preview theo file kiểm thử. Không gắn nhãn “production ready” nếu tool/database chưa được kiểm chứng.
8. Giữ cấu hình hiện tại ở draft/Preview; không giả định Instructions đã lưu bền vững khi chưa kiểm tra. Trong giao diện Chatbot đã quan sát, menu có Current Draft và Publish Update, chưa thấy nút lưu draft độc lập. Lần điều hướng khỏi trang trước đó đã làm Instructions trở lại bản cũ, nên không refresh/đóng tab cấu hình trước khi hoàn tất hoặc sao lưu. Chỉ Publish khi chủ dự án xác nhận đưa cấu hình ra phiên bản đang dùng. Không commit/deploy website hoặc thay database.

## Opening message đề xuất

Chào anh/chị! SUPPI giúp làm rõ nhu cầu và tìm nguồn theo dữ liệu được kết nối; CHAINY giúp chuẩn bị kết nối và theo dõi việc tiếp theo. Anh/chị đang cần gì cho doanh nghiệp?

Gợi ý mở đầu:

- Tôi cần may 800 áo polo giao Long Thành trong tháng 11.
- Tôi cần carton cho nhà máy.
- Tôi muốn tìm nhà máy, KCN hoặc hội/hiệp hội.
- Giúp tôi soạn yêu cầu báo giá cho nhà cung ứng đã chọn.

Gợi ý là tự nguyện, không yêu cầu chọn trước. Không dùng lời chào khẳng định đã có toàn bộ danh bạ KYC, hoặc “tư vấn giấy phép” như khả năng pháp lý chắc chắn.

## Tích hợp dữ liệu thật — công việc riêng, chưa thực hiện trong bộ tài liệu

SUPPI cần các công cụ tìm supplier/product/factory/KCN/association/program/catalogue/public requirement, đọc hồ sơ và tạo draft. API phải xác thực, kiểm tra ownership, chỉ trả dữ liệu được phép và URL/ID thật; dữ liệu có cấu trúc dùng filter/search, mô tả/tài liệu dùng semantic search; ranking không dựa vào tài trợ.

CHAINY cần công cụ đọc kết nối/task/meeting được phép và các write tool có guard xác nhận, audit, chống gửi trùng. Năng lực gửi Zalo/email, tạo lịch hoặc reminder chỉ tồn tại khi integration thực sự được cấu hình và kiểm thử. Không đưa bí mật tích hợp vào Knowledge/Instructions; giữ credential phía server hoặc cơ chế secret của nền tảng.

Giới hạn “không tự gửi/publish” trong prompt cần được enforce bằng quyền/tool/backend, không chỉ dựa vào model. Tài liệu không tự cấp quyền, tạo migration hoặc kết nối các module khác.

## Điều kiện trước sử dụng thật

Hai tài liệu được index và gắn đúng; bot tuân thủ các test cốt lõi; nguồn doanh nghiệp có quyền, đủ ID/URL/ngày cập nhật; ghi DRAFT được kiểm soát; hành động gửi/lịch/outcome có quyền và xác nhận; model không khẳng định có năng lực khi tool chưa tồn tại. Nếu thiếu tool, bot chỉ ở chế độ trợ lý nghiệp vụ/soạn nháp, chưa phải AI Search live.

## Cấu hình Knowledge đã thao tác ngày 02/10/2026

Đã tạo hai dataset riêng, mỗi dataset chứa đúng một tài liệu nghiệp vụ. Cả SUPPI và CHAINY đã được quan sát ở trạng thái Available.

- Index: High Quality; embedding model có sẵn `text-embedding-3-small`.
- Chunk mode: General; delimiter `\n\n`; tối đa 1.500 ký tự, overlap 150 ký tự.
- Dataset retrieval: Hybrid Search; Weighted Score, semantic 0,7 và keyword 0,3; Top K 5; không bật Score Threshold.
- Cấp app: đổi retrieval từ rerank model riêng sang Weighted Score, semantic 0,7/keyword 0,3; Top K 5; không bật Score Threshold.
- Model chat vẫn là Gemini 3.8 Flash; không đổi provider/credential, không mua hoặc nâng cấp gói.

Hybrid retrieval trên hai tài liệu này chỉ tìm tri thức nghiệp vụ, không phải hybrid search database doanh nghiệp sống. Prompt mới và hai Knowledge đã được quan sát trong form cấu hình; chưa Publish Update. Xem DELIVERY_STATUS_VI.md để biết kết quả kiểm thử và các phần chưa xác nhận.

Đã đối chiếu luồng gắn Knowledge và multi-path retrieval với [tài liệu chính thức Dify](https://docs.dify.ai/en/cloud/use-dify/knowledge/integrate-knowledge-within-application). Weighted Score dùng cơ chế chấm điểm nội bộ, không yêu cầu một model rerank ngoài; vẫn cần embedding/truy hồi và model chat hoạt động. Không coi việc đổi retrieval là chẩn đoán chắc chắn nguyên nhân Preview trống.
