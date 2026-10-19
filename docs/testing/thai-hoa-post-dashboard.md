# Thái Hòa — tab Sau sự kiện

Ngày kiểm tra: 12/10/2026.

Review: http://localhost:3000/chuong-trinh/ngay-hoi-chuoi-cung-ung-kcn-thai-hoa-2026?stage=after#th-tab-after

## Kết quả và phạm vi

- Dashboard tổng kết riêng: 8 chỉ số, hành trình 6 bước, donut kết quả, nhóm nhu cầu, doanh nghiệp đã tham dự, khu vực việc cá nhân, ảnh/video, tài liệu và tải báo cáo.
- Theo thứ tự và phân cấp của ảnh mẫu; giữ chữ dễ đọc và bố cục responsive. Giữ nguyên header/logo và các thay đổi khác của người dùng. Không dùng số liệu, doanh nghiệp hoặc ảnh minh họa của ảnh mẫu làm kết quả thật.
- Giữ phần cặp kết nối và biểu mẫu gửi ảnh/kết quả đã có, đưa vào disclosure cuối trang. Không sửa API gửi biểu mẫu và không gửi dữ liệu thử lên Supabase.
- Giữ tab Đang diễn ra; tab Trước sự kiện giữ nội dung chuẩn bị. Chọn tab không đổi lifecycle hoặc mở lại đăng ký cho sự kiện đã kết thúc.
- Sửa hồi quy deep link: `#dang_ky` và `#dang-ky-tai-tro` không kèm stage mở phần trước sự kiện, vẫn giữ thông báo đóng đăng ký; query stage hợp lệ luôn được ưu tiên.

## Hợp đồng dữ liệu công khai

Nguồn: `program.workflowContent.postEvent`, được truyền qua bản ghi chương trình hiện có. Snapshot phải có `visibility: PUBLIC`, `publishStatus: PUBLISHED`, và `programId` nếu có phải trùng chương trình.

- `metrics`: số nguyên không âm cho registered, attended, checkedIn, buyers, suppliers, meetings, needs, nextActions. Thiếu/sai là unknown (`—`), không đổi thành 0.
- `matchedSuggestions`: số nguyên không âm.
- `attendedParticipantIds`: giao với danh sách public participants đã xác nhận; loại trùng, không công khai người đăng ký chưa được duyệt.
- `outcomes`: 6 loại CONTINUE, QUOTE, SURVEY, SAMPLE, SECOND_MEETING, NOT_FIT cùng count. Chỉ vẽ donut khi đủ loại, tổng > 0, không tràn số và khớp metrics.meetings nếu đã công bố tổng cuộc gặp.
- `demandThemes`: label/count hợp lệ, loại trùng, xếp giảm dần. Tỷ trọng trong các nhóm đã phân loại, không tự suy diễn từ mô tả.
- `documents`: id/title/url, kind SUMMARY cho báo cáo tổng quan; sizeBytes tùy chọn. Mỗi tài liệu phải được duyệt public đúng scope; URL an toàn. Không tạo download giả nếu chưa có file.
- `media`: PHOTO/VIDEO, url/caption/poster; từng item được duyệt public đúng scope. Dùng thêm gallery đã duyệt từ workflow hiện có. Video controls, preload none, không tự phát; ảnh lazy-load.
- Không đọc tasks, email, thông tin thương mại riêng tư từ snapshot. Sổ việc cá nhân chưa có API owner-scoped; UI ghi rõ chưa kết nối khi đăng nhập. Không giả checklist hoàn thành hoặc dùng localStorage thay thế.

Chưa triển khai trong phạm vi UI: form Admin xuất bản snapshot tổng kết, endpoint riêng tư cho sổ việc, tài liệu/báo cáo thật và số liệu đã xác nhận. Không tuyên bố backend hoàn thành.

## Bằng chứng kiểm thử

- RED dashboard: test mới thất bại ERR_MODULE_NOT_FOUND vì chưa có thaiHoaPostEventModel.js, sau đó thêm implementation.
- RED deep link: test thất bại thiếu export eventViewTab, sau đó thêm resolver và nối vào page.
- RED icon: SSR phát hiện lucide-sparkles bị CSS toàn site ẩn; đổi sang Handshake, không sửa quy tắc global của người dùng.
- GREEN cuối: `node --test src/pages/__tests__/thaiHoaPostEvent.test.js src/pages/__tests__/thaiHoaLiveEvent.test.js src/pages/__tests__/thaiHoaEventLanding.test.js src/pages/__tests__/programWorkflow.test.js src/pages/__tests__/programDiscovery.test.js` — 39/39 pass, exit 0.
- Coverage `node --test --experimental-test-coverage --test-coverage-include='src/pages/thaiHoaPostEventModel.js' src/pages/__tests__/thaiHoaPostEvent.test.js`: model mới 100% lines, 93.65% branches, 100% functions. Đây không phải coverage toàn repository hoặc toàn JSX.
- Build Vite dùng outDir riêng `/private/tmp/ccu-post-build.Kus8o8`, không xóa dist/uploads đang được tác vụ khác ghi. Build đầu thành công 2235 modules, 8.02s; build lại bản cuối thành công 2235 modules, 7.58s, exit 0. Không thêm dependency.
- Browser QA read-only bằng CUA ở 375/768/1440px: document width không vượt viewport, panel không tràn ngang, heading 20–28px. Đã nhìn trực quan tổng quan, journey, donut và các vùng dữ liệu trống.
- Supplier và Đang chờ thay đổi aria-pressed/caption; đăng nhập mở AuthModal có Google/Zalo. Disclosure mở được cặp kết nối và form gửi ảnh/kết quả với field có label. Không nhập mật khẩu, không submit dữ liệu.
- End trên tab Trước sự kiện chuyển sang Sau sự kiện, selected/focus cùng th-tab-after. `#dang_ky` vẫn mở form cùng thông báo đã hết hạn.
- Console error: không có trong log trả về lúc kiểm tra. Không đo đầy đủ network/CWV/axe/screen-reader; không tuyên bố đạt toàn bộ accessibility/performance.
- Pixel regression: INCONCLUSIVE vì chưa có baseline tự động cho dashboard mới; đã đối chiếu trực quan với ảnh mẫu và lưu ảnh.
- Checkpoint git chưa thực hiện vì .git read-only trong môi trường; không reset/sửa những thay đổi ngoài phạm vi. RED/GREEN được lưu ở đây.

Ảnh: thai-hoa-landing/post-desktop-1440.png, post-mobile-375.png, post-mobile-charts-375.png, post-tablet-768.png.

## Tự đánh giá

Tổng 4.0/5. Hướng dẫn redesign giúp tách màn hình tổng kết khỏi nội dung đăng ký và thu gọn phần cập nhật kết quả; browser QA xác nhận breakpoints và tương tác, không dùng số liệu giả để lấp đầy giao diện.

| Trục | Điểm | Bằng chứng / cải thiện |
|---|---:|---|
| Accuracy | 4 | 39 tests, coverage model và kiểm tra UI; dữ liệu thật qua form Admin chưa được kiểm tra vì form publish snapshot mới chưa có. |
| Completeness | 4 | Đủ các vùng của ảnh, nhưng vùng sổ việc riêng tư là trạng thái chưa kết nối, không phải workflow cập nhật nhiệm vụ đã hoàn thành. |
| Clarity | 4 | Phân cấp chữ và trạng thái chờ rõ; có thể rút ngắn một số thông báo sau khi backend riêng tư sẵn sàng. |
| Actionability | 4 | Có URL mở thẳng, screenshot, schema và tests; dữ liệu hiển thị đầy đủ vẫn phụ thuộc BTC công bố. |
| Conciseness | 4 | Dashboard và model tách riêng; JSX còn dày, có thể tách panel khi phát triển tương tác sâu hơn. |

Critical issues: không có trong phạm vi giao diện. Self-check: người dùng có thể xem bố cục mới ngay, cần hiểu rõ phần dữ liệu thật và sổ việc chưa được hoàn thiện backend. Ưu tiên tiếp theo nếu được yêu cầu: publish snapshot qua Admin và API sổ việc owner-scoped.
