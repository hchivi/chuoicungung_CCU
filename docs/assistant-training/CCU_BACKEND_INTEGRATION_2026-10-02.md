# CCU — tích hợp SUPPI/CHAINY, cập nhật 02/10/2026

## Kết luận

Đã tích hợp mã nguồn local vào CCU, giữ bố cục/CSS website. Chưa hoàn tất vận hành production. Không commit, deploy, migration, thay URL hoặc cập nhật database thật. Báo cáo này cập nhật trạng thái sau DELIVERY_STATUS_VI.md; các kết quả cũ trong file đó là lịch sử, không phải trạng thái hiện tại.

## Thay đổi đã làm

- Hai nơi chat hiện có — DifyChatWidget và AiWorkspacePage — dùng cùng transport `/api/assistants/chat`. Không gọi Dify trực tiếp từ trình duyệt, không dùng credential Vite, không chuyển sang Gemini frontend khi lỗi.
- Bỏ phản hồi mock trong luồng gửi chat workspace; không tự tạo shortlist 98–99%/KYC Kim Cương hay thông báo bàn giao bên ngoài như hành động thật. Các hàm mock cũ chưa được xóa toàn bộ vì nằm trong trang lớn có thay đổi của chủ dự án; lịch sử localStorage cũ chưa được tự xóa.
- Sửa lời chào widget để không khẳng định mọi xưởng đạt KYC. Không sửa JSX bố cục hoặc CSS của website trong lượt tích hợp này.
- Backend SUPPI dùng OpenAI Responses + function calling khi có key hợp lệ; thiếu key chỉ có xử lý có cấu trúc giới hạn, không được gọi là AI đầy đủ.
- CHAINY nối Dify qua server khi có key; chưa có key chỉ trả hướng dẫn chuẩn bị liên hệ, không phải điều phối tự động. Không có tool gửi Zalo/email, tạo nhóm/lịch/reminder, publish hoặc ghi WON.
- Cookie phiên ký HMAC, HttpOnly, SameSite Strict; không tin `user`/token tự gửi từ trình duyệt. Hội thoại gắn owner phiên; chặn owner khác và tin nhắn đồng thời trên cùng hội thoại trong một process.
- Giữ ID hội thoại Dify phía backend; giữ context giữa hai vai trò. Khi quay từ CHAINY sang SUPPI, replay lịch sử CCU giới hạn thay vì dùng Responses state thiếu lượt CHAINY.
- Đọc đúng nội dung `output[].content[].text` của Responses REST; từ chối phản hồi rỗng. Dify xử lý riêng empty body, HTML, empty answer, HTTP lỗi và timeout, không retry tự động tin nhắn có thể tính phí.
- Runtime mới đọc MongoDB theo allowlist trường và trạng thái PUBLISHED. Không dùng JSON fixture thay database khi mất kết nối; không truyền email/phone private hay mặc nhiên coi `verified=true` legacy là bằng chứng KYC.
- Draft tạo bởi SUPPI được gắn owner từ server, luôn DRAFT. Patch không đổi owner/status/published_at. Route SUPPI legacy không được đọc/sửa hội thoại hoặc draft có owner của gateway mới.

## API

`GET /api/assistants/status`: trạng thái cấu hình/database và danh sách nguồn đang chờ. Có cấu hình không đồng nghĩa provider hoạt động; endpoint này chưa thực hiện health check provider.

`POST /api/assistants/chat`, dùng cookie phiên, Content-Type application/json:

```json
{
  "query": "Anh cần carton",
  "conversation_id": "",
  "mode": "SUPPI"
}
```

`mode` và `conversation_id` có thể bỏ; backend tự phân vai bằng heuristic khi chưa có bộ định tuyến nâng cao. Không gửi `user`, API key hoặc account token. Thành công trả `success: true`, `data.answer`, `mode`, `conversation_id`, `slots`, `results`, `draft`, `actions_executed: []` và metadata engine. Lỗi trả JSON có code/message; không hiện nội dung raw provider.

## Nguồn và giới hạn chưa hoàn tất

1. Đã nối adapter MongoDB cho Enterprise, Factory, IndustrialPark và Organization có role ASSOCIATION. Chưa truy vấn database thật trong lượt này; chưa xác nhận số hồ sơ được xuất bản hoặc URL hồ sơ. Legacy thiếu dấu PUBLISHED không được tự công khai.
2. Product/service, program, catalogue và public requirement chưa có mapping nguồn đã kiểm chứng trong runtime mới. Tool tương ứng báo SOURCE_NOT_CONNECTED, không báo sai là database không có kết quả.
3. Hybrid/vector của `/api/suppi` legacy đã tồn tại và có unit test, nhưng **chưa nối vào runtime `/api/assistants` mới**. Cần structured query Mongo + lexical/vector, recheck quyền và trạng thái live sau retrieval. Không chạy tạo index, embedding hoặc migration trong lượt này.
4. Adapter hiện nạp tối đa 50.000 hồ sơ/collection rồi tìm trong bộ nhớ; chưa phải truy vấn database tối ưu/pagination đầy đủ. Không phát hành cho quy mô lớn trước khi thay bằng query bounded theo entity/filter và load test.
5. Owner hiện là phiên trình duyệt ẩn danh, không phải tài khoản CCU đã xác thực. Cần tích hợp authentication thật, clear phiên/historical chat khi logout và khóa giao dịch đa worker trước production.
6. Draft tool đã có phía backend nhưng luồng mở/sửa/submit draft từ UI hiện có chưa kiểm thử end-to-end với dữ liệu thật; route legacy cố ý từ chối draft có owner mới. Cần route draft có cookie ownership và mapping form trước khi phát hành luồng này. Không tự submit/publish.
7. SUPPI offline có thể nhớ carton + Long Thành nhưng không đảm bảo bóc tách đầy đủ quantity/deadline/specification. Intent heuristic không thay được bộ đánh giá intent AI. Chưa đạt toàn bộ acceptance tests nghiệp vụ.
8. Có credential Gemini hardcode trong module legacy không còn được chat import. Không sao chép key vào tài liệu. Chủ dự án cần thu hồi/rotate key cũ và dọn credential khỏi source/history bằng quy trình riêng.

## Dify trên máy chủ dự án

Đã thao tác trên Zen đúng app CCU AI Assistant (SUPPI & CHAINY), kiểm tra Instructions/Knowledge/Preview/Logs/Access Point.

- Hai dataset SUPPI và CHAINY đã có tài liệu index Available; ID và liên kết trong DELIVERY_STATUS_VI.md.
- Prompt chung 6.161 ký tự và hai Knowledge đã hiện trên form. Retrieval app đã chỉnh Weighted Score 0,7 semantic/0,3 keyword, Top K 5.
- Preview mới bị trống. Log lần `Anh cn carton.` ghi Gemini 2.5 Flash, 0.00s, Token spent 0 và không có answer. Đã trả model trên form về Gemini 3.8 Flash sau kiểm tra. Chưa có evidence xác định nguyên nhân là key/quota/model/stop; không kết luận tùy đoán.
- DSL export tải xuống vẫn chứa prompt cũ và datasets rỗng. Vì vậy **chưa xác nhận cấu hình mới lưu bền vững hoặc trở thành running version**. Knowledge upload không đồng nghĩa app đã sử dụng đúng Knowledge.
- Access Point hiển thị Backend Service API IN SERVICE, endpoint `https://api.dify.ai/v1`, API Key 1. Không mở/sao chép/tạo key, không đổi quyền. Đã để trang Access Point để chủ dự án tiếp tục cấu hình.
- Chưa Publish Update; backend chưa có DIFY_API_KEY/OPENAI_API_KEY. Chưa gọi live AI hoặc kiểm thử live database.

## Cấu hình cần chủ dự án cung cấp

Theo `.env.example`, lưu riêng ở backend/deployment secret store, không gửi key trong chat và không thêm prefix VITE_:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
DIFY_API_URL=https://api.dify.ai/v1
DIFY_API_KEY=
ASSISTANT_SESSION_SECRET=
```

Chọn model thực sự khả dụng cho tài khoản; giá trị mẫu không chứng minh tài khoản có quyền. ASSISTANT_SESSION_SECRET phải là secret ngẫu nhiên bền vững, giống nhau giữa các instance. Thiếu secret hiện dùng giá trị tạm trong process, cookie/hội thoại mất quyền truy cập sau restart; không dùng cách này cho production. Không thay MONGODB_URI sẵn có khi chưa được yêu cầu.

Trước lưu key có sẵn qua điều khiển web, cần chủ dự án xác nhận lưu credential đó ở backend CCU. Không cần tạo key mới vì Dify hiển thị đã có 1 key. Sau khi có key, cần sửa/kiểm thử/publish đúng cấu hình Dify trước kích hoạt CHAINY; API đang gọi running version, không gọi form draft.

## Kiểm chứng

- TDD: test mới RED trước code (missing module, frontend unsafe/mock). Bốn regression bổ sung về validation/owner/raw Responses cũng thất bại trước sửa, sau sửa đạt.
- `RUN_HTTP_TESTS=1 npm test`: **57/57 PASS**, 0 fail/skip/cancel, exit 0. Dùng localhost và memory/mock, không MongoDB thật hoặc provider thật. Một guard legacy kiểm tra source, không thay thế pentest HTTP + Mongo production.
- Coverage 19 test tích hợp mới: **96,31% lines**, **78,86% branches**, **96,43% functions**, exit 0 với ngưỡng lines 80%. Không coi coverage là chứng minh provider/database hoạt động.
- `npm run build`: PASS, exit 0. Còn cảnh báo chunk lớn do các bộ dữ liệu website sẵn có; không sửa module khác để xử lý cảnh báo trong task này.
- `git diff --check` cho backend/env/transport/workspace: PASS. Toàn worktree vẫn có trailing whitespace từ thay đổi đã có ở widget/catalogue/ecosystem; không tự dọn chỉnh sửa ngoài phạm vi.
- Worktree ban đầu đã dirty ở DifyChatWidget/AiWorkspace/Catalogues/Ecosystem và có media/tài liệu mới của chủ dự án. Giữ nguyên thay đổi ngoài phạm vi; không reset, xóa, commit hoặc deploy.

## Công việc tiếp theo trước production

1. Chủ dự án cho phép lưu key hiện có vào backend hoặc tự cấu hình secret; không gửi key vào chat. Kiểm tra provider/quota và phản hồi Dify bằng một test có nội dung; xác minh prompt/Knowledge lưu và running version đúng sau Publish có duyệt.
2. Kiểm chứng mapping tám loại dữ liệu, public/ACL/canonical URL, hybrid retrieval và ranking. Không tự expose toàn bộ legacy hoặc lấy Knowledge nghiệp vụ làm dữ liệu doanh nghiệp.
3. Kiểm thử browser end-to-end không đổi giao diện: chat widget → workspace, context đổi vai trò, lỗi/reset/logout, shortlist có căn cứ, draft có quyền; hoàn tất acceptance tests trước quyết định deploy.

## Agent Self-Debug Report

- Task: tích hợp hai trợ lý vào CCU, giữ giao diện.
- Failure: Preview lặp phản hồi trống; export không chứa draft mới. Test socket ban đầu bị sandbox EPERM, không phải lỗi business logic.
- Root cause: Preview/draft persistence chưa xác định; socket bị giới hạn môi trường. Credential backend thiếu đã kiểm chứng nhưng không đủ kết luận là nguyên nhân Preview Dify.
- Recovery: ngừng retry Preview/đổi model; đọc Logs/Access Point và export; kiểm thử localhost sau escalation được phép; thêm test response rỗng và REST text thực.
- Result: partial — mã local qua test/build, live integration chưa hoàn tất.
- Risk: tiếp tục retry model khi chưa biết lỗi có thể tốn token/thời gian, Publish có thể phát hành cấu hình chưa đạt.
- Follow-up: xác nhận lưu credential; kiểm tra provider và lưu/publish đúng running config.
- Prevention: tách thử thao tác UI, kiểm chứng persistence, test backend mock và live acceptance; không đồng nhất chúng.

## Tự đánh giá

| Trục | Điểm | Evidence và cải thiện |
|---|---|---|
| Chính xác | 4/5 | 57 test/build đạt; chưa xác minh Mongo/provider thật. Cần live smoke test có credential. |
| Đầy đủ | 2/5 | Chưa vận hành production, hybrid/new nguồn/draft UI còn thiếu. Cần hoàn tất ba nhóm việc tiếp theo. |
| Rõ ràng | 4/5 | Tách local, Dify draft, running version và nguồn pending; vẫn cần chủ dự án đọc báo cáo dài để triển khai. |
| Khả năng sử dụng | 3/5 | Có route/transport/tests/env mẫu nhưng chưa có key và Dify ổn định; chưa thể dùng bot production ngay. |
| Súc tích | 4/5 | Báo cáo có giới hạn và bằng chứng, nhưng một số guard lặp để tránh nhầm trạng thái. |

Trung bình 3,4/5. Ưu tiên: credential + Dify, dữ liệu/hybrid, E2E/draft. Tự kiểm: chủ dự án có thể xác minh mã/tests nhưng không nên đồng ý gọi đây là hoàn tất toàn bộ. Skills TDD/verification/error-handling dẫn tới test trước sửa, parse lỗi an toàn và tách kết quả kiểm thử với chứng cứ live; skill self-debug khiến dừng retry/Publish khi Preview chưa đạt.

## Tắt quyền xem/điều khiển màn hình trên Mac

Sau khi không cần thao tác web, mở Apple → System Settings → Privacy & Security:

1. Accessibility: tắt ứng dụng/helper ChatGPT hoặc Codex đã cấp quyền điều khiển.
2. Screen & System Audio Recording (hoặc Screen Recording tùy macOS): tắt ứng dụng/helper tương ứng đã cấp quyền xem màn hình.
3. Nếu macOS yêu cầu đóng/mở lại ứng dụng, thực hiện. Không phải tắt Zen/Chrome. Ẩn mascot/icon không tự thu hồi hai quyền này.

[Apple: Accessibility](https://support.apple.com/en-mn/guide/mac-help/mh43185/mac) · [Apple: Screen recording](https://support.apple.com/en-gb/guide/mac-help/mchld6aa7d23/mac).

Chưa tự thu hồi quyền hệ thống hoặc xác nhận capture đã tắt trong lượt này; chủ dự án thực hiện và kiểm tra công tắc.
