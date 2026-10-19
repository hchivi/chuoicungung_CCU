# Thái Hòa — tab Đang diễn ra

Ngày kiểm tra: 12/10/2026.

Review: http://localhost:3000/chuong-trinh/ngay-hoi-chuoi-cung-ung-kcn-thai-hoa-2026?stage=during#th-tab-during

## Phạm vi hoàn thành

- Tab `during` đổi sang dashboard riêng, không trộn phí/tài trợ/đăng ký của giai đoạn chuẩn bị.
- Bố cục theo ảnh: 4 chỉ số + thời điểm cập nhật; check-in; agenda; thông báo; doanh nghiệp có mặt; SUPPI gợi ý; bảng lịch gặp 1:1.
- Desktop rộng: ba panel chính, hai panel doanh nghiệp/gợi ý, bảng toàn chiều ngang. Màn hình nhỏ xếp lại theo cột, bảng có vùng cuộn riêng khi có dữ liệu.
- Bộ lọc Buyer/Supplier và 5 trạng thái cuộc gặp; mở rộng danh sách khi vượt giới hạn; xem chi tiết cuộc gặp; hướng dẫn check-in; form đăng nhập hiện có.
- `?stage=during` chỉ chọn giao diện, không đổi trạng thái chương trình, không mở đăng ký đã hết hạn.
- Giữ nguyên hero, logo và các thay đổi CSS chung đang được chỉnh đồng thời. Kiểm thử readability đổi từ kích thước tuyệt đối sang giới hạn tối thiểu để chấp nhận font17px/container1600px mới mà vẫn giữ yêu cầu dễ đọc.

## Dữ liệu và giới hạn chức năng

Dashboard đọc `program.workflowContent.liveEvent` từ bản ghi chương trình đang tải bằng bootstrap. Snapshot cần `visibility: PUBLIC`, `publishStatus: PUBLISHED`; `programId`, nếu có, phải khớp chương trình.

Các trường: `updatedAt` (ISO timestamp), `metrics` (`registered`, `buyersPresent`, `suppliersPresent`, `meetingsCompleted`, số nguyên không âm), `presentParticipantIds`, `announcements`, `suggestions`, `meetings`.

- Danh sách có mặt và đề xuất chỉ tham chiếu doanh nghiệp đã xác nhận/duyệt và công bố trong `participants` của chương trình.
- Thông báo: `id`, `publishedAt`, `text`, cờ công bố, scope chương trình.
- Đề xuất: `participantId` của Supplier, `publicReason`, cờ công bố. Là đề xuất công khai được BTC duyệt, không giả làm kết quả AI cá nhân hóa.
- Cuộc gặp: `id`, `buyerId`, `supplierId`, `startAt`, `table`, `publicTopic`, `status`, cờ công bố. Trạng thái: `UPCOMING`, `LIVE`, `COMPLETED`, `RESCHEDULED`, `CANCELLED`.
- Không sao chép dữ liệu mẫu trong ảnh. Thiếu số liệu → “—”; chưa có snapshot → “Chờ công bố”. Không giả vờ cập nhật realtime; hiển thị thời điểm cập nhật snapshot nếu có.
- Chưa triển khai API cấp Event Pass/check-in riêng tư hoặc gửi đề nghị gặp tại sự kiện trong thay đổi giao diện này. Nút tương ứng bị khóa và giải thích rõ. Biểu tượng QR là placeholder, không phải mã để quét; không tạo trạng thái “Đã check-in”.
- Không đưa token cá nhân, thông tin liên hệ, ghi chú nội bộ vào snapshot công khai. Chưa bổ sung form quản trị snapshot hoặc ghi dữ liệu Supabase trong task này.
- Ngày thực tế 12/10/2026 sau sự kiện07/10/2026: hiển thị “Đã kết thúc”, không đánh dấu agenda đang diễn ra. Agenda chỉ highlight đúng thời gian sự kiện, giờ Việt Nam.

## Bằng chứng kiểm thử

- RED: tạo `thaiHoaLiveEvent.test.js` trước triển khai; runner báo `ERR_MODULE_NOT_FOUND` cho model chưa tồn tại (exit1).
- GREEN: 33/33 tests qua trong4 suite: programDiscovery, programWorkflow, thaiHoaEventLanding, thaiHoaLiveEvent. Có SSR cả trạng thái trống và snapshot công bố, kiểm tra scope, private-field omission, metrics sai định dạng, agenda, trạng thái kết thúc, logo/giai đoạn khác.
- Coverage model mới: lines100%, branches93.55%, functions90.48%.
- `npm run build` lần đầu thành công; lần cuối gặp `ENOTEMPTY dist/uploads` trong lúc thư mục build bị ghi đồng thời. Không xóa uploads. Kiểm tra lại Vite bằng outDir riêng `/private/tmp/ccu-live-build.Ysh0Fi`: thành công,2232 modules,7.98s (exit0). Không cài thêm dependency.
- UI read-only bằng CUA: 375px,768px,1440px; document scrollWidth không vượt viewport. Desktop3 panel; mobile1 panel. Font heading20–21px, dashboard16px.
- Bộ lọc Supplier, Completed đổi selected state/caption; hướng dẫn mở/đóng; đăng nhập mở lại AuthModal Google/Zalo; ArrowLeft/ArrowRight chuyển giai đoạn và giữ focus. Không submit tài khoản hoặc mutation thật.
- Console error tại thời điểm kiểm tra: không có trong log trình duyệt trả về.
- Ảnh: `thai-hoa-landing/live-desktop-1440.png`, `thai-hoa-landing/live-mobile-375.png`.
- Không có baseline tự động cho dashboard mới: so sánh pixel regression INCONCLUSIVE; đã kiểm tra trực quan theo ảnh người dùng. Chưa đo CWV/axe/screen-reader đầy đủ, không tuyên bố đạt accessibility toàn bộ.
- Git checkpoint không thực hiện vì `.git` read-only trong môi trường hiện tại; RED/GREEN được ghi ở đây, không reset các thay đổi khác.
- `git diff --check` toàn repo có trailing whitespace từ file ngoài phạm vi; không sửa các file đó.

## Tự đánh giá

Tổng4.2/5; đối chiếu yêu cầu giao diện, không mở rộng thành backend check-in.

| Tiêu chí | Điểm | Bằng chứng / cải thiện |
|---|---:|---|
| Accuracy | 4 | Tests dữ liệu/SSR và lifecycle qua; chưa kiểm chứng snapshot qua form Admin thật vì chưa có form cho schema mới. |
| Completeness | 4 | Đủ7 khối của ảnh, filter/mobile; nội dung thật hiện chờ BTC công bố, không lấy mẫu làm dữ liệu chính thức. |
| Clarity | 4 | Trạng thái chờ và chức năng khóa có giải thích; có thể rút gọn thông báo check-in khi API thật đã sẵn sàng. |
| Actionability | 5 | Có URL mở thẳng tab, ảnh kiểm tra, test/build và hợp đồng dữ liệu để tiếp tục kết nối backend. |
| Conciseness | 4 | Thành phần tách riêng không sửa database; JSX kế thừa vẫn dài, có thể tách từng panel khi phát triển tương tác tiếp. |

Critical issues: không có trong phạm vi UI. Self-check: người dùng có thể xem đúng bố cục đã yêu cầu, nhưng cần phân biệt giao diện hoàn thành với check-in/AI/live backend chưa được triển khai.

Ưu tiên tiếp theo nếu mở rộng phạm vi: endpoint Event Pass/check-in owner-scoped; quản trị/publish snapshot và cơ chế cập nhật; gửi/yêu cầu xác nhận cuộc gặp thực sự.
