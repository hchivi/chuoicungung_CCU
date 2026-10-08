# Supabase Auth và Admin — bàn giao 2026-10-08

## Kết quả

Đăng nhập website bằng Supabase Auth thật; tài khoản đã được người dùng chỉ định và xác nhận email đã được cấp `admin`. Không lưu email quản trị, mật khẩu hoặc token trong tài liệu này. Đã kiểm tra đăng nhập thực tế và Admin đọc được dữ liệu nhà cung ứng, nhà máy từ Supabase.

Không tuyên bố hoàn tất 100% mọi nghiệp vụ của Admin cũ. Các màn hình tài chính, pipeline, quản lý hội viên và file riêng tư chưa được nối đầy đủ; giao diện hiển thị thông báo rõ thay vì bảng mô phỏng.

## Tiêu chí đã thực hiện

- Supabase xác minh danh tính và email; đăng ký không tự cấp quyền quản trị hay KYC.
- Backend đọc lại quyền `admin`, `moderator`, `viewer` từ `ccu_staff_roles`; không tin role trong trình duyệt hoặc metadata người dùng tự sửa.
- Cookie Auth HttpOnly, SameSite Strict, Secure trong production; token không trả vào JSON hoặc lưu localStorage.
- Admin/viewer/moderator được đọc; admin/moderator được rà soát biểu mẫu; chỉ admin được sửa nội dung danh mục cho phép. Mọi thao tác ghi có kiểm tra quyền backend.
- Rà soát và sửa dữ liệu yêu cầu ghi chú, kiểm tra phiên bản cập nhật và ghi audit trong cùng transaction. Duyệt nội bộ không tự công bố hay gửi thông tin liên hệ.
- Admin có hộp tiếp nhận, các danh mục dữ liệu công khai, tìm kiếm/phân trang và nhật ký thao tác. Chỉnh sửa nội dung không mở quyền sửa liên hệ, hình ảnh hoặc trạng thái hiển thị.
- Dữ liệu riêng gắn UUID Auth. Cache trình duyệt tách theo tài khoản; phản hồi đang chờ của tài khoản trước không được nạp lại sau đổi tài khoản.
- Cache cũ không phân tài khoản được giữ nguyên nhưng không tự nhận vào tài khoản mới. Không xóa dữ liệu cũ và không dùng cache để giả lập đăng nhập hoặc xác nhận lưu Supabase.

## Migration đã áp dụng

1. `server/migrations/20261008_auth_admin.sql`: role, audit, RLS và RPC quản trị chỉ dành cho service role.
2. `server/migrations/20261008_auth_claim_permissions.sql`: sửa bước nhận dữ liệu phiên khách khi đăng nhập.

Lỗi thực tế người dùng báo là bước nhận phiên khách đọc trực tiếp `auth.users` trong hàm SECURITY INVOKER, nhưng service role không có quyền SQL đọc bảng đó. Đã bỏ truy vấn dư thừa vì backend đã xác minh người dùng bằng `auth.getUser`. Không cấp thêm quyền đọc `auth.users`, không chuyển sang SECURITY DEFINER. RPC đã được chạy lại thành công với owner không có dữ liệu, không sửa hồ sơ thật để thử nghiệm.

## Bằng chứng kiểm thử

Ngày kiểm tra: 2026-10-08, môi trường localhost hiện có.

- `npm test`: **123 passed, 0 failed**.
- Auth/Admin và client: **16 passed, 0 failed**.
- Coverage tập trung các module mới: **96.43% dòng, 87.10% nhánh, 89.71% hàm**. Đây không phải coverage toàn dự án hoặc JSX E2E.
  - `server/auth/service.js`: 96.83% dòng.
  - `server/routes/auth.js`, `server/routes/admin.js`: 100% dòng.
  - `src/services/authSession.js`: 86.96% dòng, 50% nhánh; nhánh BroadcastChannel còn cần kiểm tra đa tab sâu hơn.
  - `src/services/privateBrowserStorage.js`: 100% dòng.
- `npm run build`: thành công, 2.220 module.
- `git diff --check` cho các file Auth/Admin mới và thay đổi cache liên quan: sạch. Không khẳng định toàn worktree sạch: còn thay đổi thiết kế trước đó và whitespace ngoài phạm vi.
- Test HTTP cần quyền mở cổng loopback; lần chạy sandbox bị EPERM, chạy lại với quyền phù hợp đã qua. Không phải lỗi ứng dụng.
- Live: khóa public không đọc được role/audit; API Admin không cookie trả 401; auth mutation thiếu Origin trả 403.
- Live: quyền admin đúng tài khoản đã xác nhận, có audit cấp quyền; RPC sửa/rà soát với ID không tồn tại trả lỗi not-found như mong đợi.
- Browser: đăng nhập thật mở `Hộp tiếp nhận`, không alert; danh sách nhà cung ứng và nhà máy có 25 dòng dữ liệu/trang, không alert. Không lưu thay đổi thử vào hồ sơ thật. Nhật ký có test API và xác minh database; không tuyên bố đã hoàn tất kiểm tra màn hình nhật ký bằng tài khoản thật.
- Không có lệnh gọi suy luận AI trong đợt kiểm tra này.

## Cách sử dụng

Vào `http://localhost:3000/dang-nhap`, tự nhập mật khẩu của tài khoản đã xác nhận; mở `http://localhost:3000/admin`. Chọn dữ liệu, xem chi tiết hoặc chỉnh sửa nội dung nếu có quyền. Đọc thông báo lưu thành công trước khi coi thao tác đã hoàn tất; lỗi Supabase không được thay bằng thành công cục bộ.

## Còn lại trước khi vận hành production đầy đủ

1. Kiểm tra tên miền HTTPS, SITE_URL/redirect Auth, gửi email SMTP thực tế và luồng quên mật khẩu đầu-cuối trên tên miền triển khai; chưa thực hiện đổi mật khẩu người dùng để QA.
2. Bổ sung nghiệp vụ Admin còn thiếu theo từng module, quyền chi tiết và kiểm thử; hiện chưa có tạo/xóa/xuất bản hàng loạt, tài chính/pipeline/hội viên đầy đủ.
3. Thiết kế Supabase Storage và chính sách file riêng, quy trình nhập dữ liệu riêng lịch sử, backup/restore; chưa có migration file lịch sử.
4. Kiểm thử đa tab, thiết bị thật, phục hồi phiên dài hạn; cân nhắc MFA cho quản trị trước khi mở production. SSO/Zalo chưa tích hợp, không giả lập thành công.

## Tự đánh giá chất lượng

Summary: **4.0/5** trên 5 tiêu chí; đủ bàn giao Auth và Admin cốt lõi, chưa đủ để gọi toàn hệ thống production hoàn chỉnh.

| Tiêu chí | Điểm | Bằng chứng và cải thiện |
| --- | --- | --- |
| Accuracy | 4/5 | 123 test và đăng nhập thật đã qua; thao tác ghi Admin được test bằng mock/RPC thiếu ID, cần QA trên bộ dữ liệu thử riêng. |
| Completeness | 4/5 | Auth, ba role và Admin cốt lõi đã nối; nghiệp vụ cũ chưa nối được nêu rõ, cần các đợt triển khai riêng. |
| Clarity | 4/5 | Phân biệt duyệt nội bộ, công bố và lưu cloud; tên trường kỹ thuật trong hộp sửa còn cần nhãn tiếng Việt dễ hiểu. |
| Actionability | 4/5 | Có URL Admin dùng ngay và migration đã áp dụng; checklist SMTP/HTTPS cần hoàn tất ở môi trường triển khai. |
| Conciseness | 4/5 | Bàn giao ngắn, bằng chứng chi tiết nằm tại đây; tránh lặp trạng thái trong các đợt tiếp theo. |

Overall: **4.0/5**. Critical issues (điểm ≤2): không có trong phạm vi bàn giao đã nêu.

Self-check: Người dùng có thể đồng ý nếu đánh giá trên Auth/Admin cốt lõi và sửa lỗi đăng nhập; không nên coi đây là xác nhận mọi nghiệp vụ cũ đã hoàn tất.

Ưu tiên cải thiện: (1) QA ghi/rollback trên dữ liệu thử riêng; (2) kiểm thử Auth/SMTP trên tên miền HTTPS; (3) nối các nghiệp vụ còn thiếu theo checklist. Verdict: bàn giao với giới hạn được ghi rõ.
