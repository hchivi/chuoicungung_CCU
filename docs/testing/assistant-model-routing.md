# SUPPI / CHAINY: định tuyến hai model

Kiểm chứng ngày 08/10/2026 tại localhost. Không triển khai production, bật billing hay gửi liên hệ.

## Cấu hình đang áp dụng

- `gemini-3.1-flash-lite`: chào hỏi, câu đơn giản, tìm nguồn cơ bản.
- `gemini-3.5-flash`: phân tích kỹ thuật, so sánh nhà cung ứng, soạn RFQ; yêu cầu dài trên 1.200 ký tự cũng vào nhóm này.
- Cả SUPPI và CHAINY dùng cùng router và lịch sử hội thoại. Phân loại tại server bằng quy tắc, không tốn thêm lượt AI để chọn model. Chưa phải bộ phân loại ngữ nghĩa hay fine-tuning.
- Mỗi lượt chọn một model, không gọi đồng thời cả hai. Không dùng tool: một lần inference; có tool: có thể thêm một lần diễn giải bằng cùng model. Backend vẫn kiểm tra quyền và schema trước khi chạy tool.
- Không tự retry, chuyển provider/model khi lỗi hoặc hết quota. Không thay đổi cấu hình thanh toán; free/paid tier của project chưa xác minh.

Biến server: `GEMINI_ROUTING=auto`, `GEMINI_SIMPLE_MODEL`, `GEMINI_COMPLEX_MODEL`. Nếu không khai báo model riêng, simple giữ `GEMINI_MODEL` hiện có và complex mặc định 3.5 Flash. Rollback có chủ đích: đặt `GEMINI_ROUTING=single`, restart backend; không tự động rollback khi gặp lỗi. API key chỉ ở backend.

Chọn 3.5 thay vì 3.8: 3.8 trả HTTP 200 cho câu tối thiểu nhưng lặp lại HTTP 503 ở planner có schema; không đủ bằng chứng để kết luận nguyên nhân sâu hơn. 3.5 xử lý cùng luồng RFQ thành công. Đây là thay đổi cấu hình được kiểm chứng, không phải fallback tự động khi khách đang sử dụng.

Tài liệu model: [Google Gemini 3.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash). Hạn mức và miễn phí phụ thuộc project: [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [pricing](https://ai.google.dev/gemini-api/docs/pricing). Không nhập hồ sơ mật khi chưa đánh giá chính sách dữ liệu của gói đang dùng.

## Bằng chứng TDD và xác minh

Journeys được rút từ yêu cầu: câu đơn giản dùng Lite; kỹ thuật/RFQ dùng Flash; đổi mascot giữ hội thoại; lỗi quota không phát sinh lần gọi khác.

| Bảo đảm | Bằng chứng |
| --- | --- |
| Chọn model, giữ history, cùng model cho planner/reply, không retry 429, rollback single | 6 test trong `server/tests/model-routing.test.js` |
| RED router chưa tồn tại → GREEN triển khai | Checkpoints `00e9b78` → `d775a7c`; target 34 test pass |
| RED yêu cầu default 3.5, actual 3.8 → GREEN đổi default | Checkpoints `72c6d1e` → `9169109`; target 6 test pass |
| Regression backend | `npm test`: 107 pass, 0 fail, 0 skip sau thay đổi cuối |
| Coverage router | `node --test --experimental-test-coverage --test-coverage-include='server/assistants/modelRouting.js' server/tests/model-routing.test.js`: lines 100%, branches 87.5%, functions 100% |
| Build | `npm run build`: pass; Vite 8.30s |
| Live qua Vite proxy sau restart | `/api/assistants/status`: Supabase connected, auto, Lite + 3.5 Flash |
| Live cùng một hội thoại | SUPPI HTTP 200, verified Lite; CHAINY HTTP 200, verified 3.5 Flash; RFQ giữ số lượng 500, có nội dung, không tạo draft, 0 external actions |

Live chỉ dùng dữ liệu giả lập; không stress-test hoặc lặp retry. Coverage chỉ cho router, không phải toàn dự án. Không sửa giao diện ở tác vụ này; chưa chạy lại visual/browser regression. Repo không có script lint/typecheck. `git diff --check` toàn repo phát hiện whitespace ở các thay đổi frontend ngoài tác vụ; giữ nguyên chúng. Test và build không chứng minh chất lượng chuyên môn của mọi RFQ hay khả năng hoạt động liên tục của nhà cung cấp API.

## Self-evaluation

Summary: 4.0/5; định tuyến hoạt động thật, chưa chứng nhận chất lượng kỹ thuật hoặc SLA production.

| Trục | Điểm | Bằng chứng / cải thiện |
| --- | --- | --- |
| Accuracy | 4 | Actual model được xác minh qua response; cần đo dài hạn trước khi tuyên bố ổn định. |
| Completeness | 4 | Hai tier, history và lỗi quota có test; thêm bộ câu kỹ thuật thực tế để đo sai phân loại. |
| Clarity | 4 | Phân biệt chọn một model và số lần inference; quy tắc hiện chưa giải thích trực tiếp trên UI. |
| Actionability | 4 | Backend đang chạy và hai lượt live đạt; cần xác minh billing/quota trước production. |
| Conciseness | 4 | Bàn giao ngắn, bằng chứng gom ở đây; có thể tích hợp vào hướng dẫn vận hành chung. |

Critical issues ≤2: không có. Ưu tiên tiếp theo: bộ đánh giá kỹ thuật do doanh nghiệp duyệt; xác minh quota/billing trong AI Studio; quan sát lỗi thực tế không ghi nội dung nhạy cảm. Self-check: người dùng có thể kiểm tra hai loại câu ngay, nhưng không nên hiểu là miễn phí vô hạn. Verdict: bàn giao localhost với giới hạn rõ ràng. Áp dụng TDD Workflow, Verification Loop và Agent Self-Evaluation.
