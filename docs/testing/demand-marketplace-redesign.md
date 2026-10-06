# Sàn nhu cầu: thiết kế và kiểm thử

Ngày: 2026-10-05. Phạm vi: `/san-nhu-cau`, cách hiển thị title hero in hoa trên các trang công khai. Không commit, deploy, migration hoặc thay database/backend.

## Góc nhìn khách hàng

Nhà cung ứng cần biết nhu cầu gì, ở đâu, số lượng bao nhiêu, hạn phản hồi và cách gửi năng lực. Nhà máy/bên mua cần đường dẫn đăng nhu cầu rõ ràng. KCN/hội có thể xem nhu cầu công khai và hiểu cách điều phối kết nối, không cần một loạt khối quảng bá phụ.

Taste và Redesign được dùng để tiết chế bố cục, kế thừa màu xanh CCU, bỏ ma trận ô nhỏ khó đọc và các liên kết dạng bốn thẻ quảng bá. Dials: variance 5 / motion 2 / density 5. Ngoại lệ theo yêu cầu: giữ ảnh hero `/images/b2b_sourcing_demand_hero.jpg` và hai dòng title nguyên văn; không tạo ảnh thay thế. Phần danh sách là UI làm việc, nên không áp toàn bộ quy tắc landing page marketing của Taste.

## Thay đổi

- Tìm kiếm theo sản phẩm/dịch vụ/mã nhu cầu; hỗ trợ tiếng Việt không dấu. Ngành và tỉnh lấy từ toàn bộ bản tóm tắt công khai, không biến mất khi lọc ra danh sách rỗng.
- Trạng thái mặc định đang tìm nguồn. Nhu cầu tạm dừng/đã đóng xem được bằng bộ lọc nhưng không mở nút phản hồi.
- Sáu nhu cầu đầu tiên, nút xem thêm; hai cột trên desktop rộng, một cột trên mobile/tablet. Không xóa bản ghi.
- Hiển thị số lượng đã công bố và `responseDeadline` theo múi giờ Việt Nam. Thiếu số lượng ghi “Chưa công bố”, không suy diễn thành “Theo thỏa thuận”. Chi tiết tách ngày cần hàng khỏi hạn phản hồi.
- Giữ modal phản hồi/auth và SUPPI hiện có. Khởi tạo SUPPI đúng nhu cầu đang xem; đồng nhất nhận diện tổ chức với modal phản hồi để nhận ra hồ sơ đã gửi. Không thay model hoặc kết nối AI trong task này.
- Modal chi tiết có tên, Escape, vòng focus và trả focus về nút mở. Hero canvas dừng khi bật reduced motion; ảnh không đổi.
- Sửa title hero thứ hai bị mất chữ do CSS gradient shorthand reset `background-clip`. Quy tắc chuyển màu dùng `background-image` để giữ clipping ở các title khác.
- CSS chữ hoa áp dụng H1 trong public shell và title hero được đánh dấu; không ép H2/H3 danh sách in hoa. Không đổi title/meta vì chữ hoa.
- Liên kết phụ dùng `/nha-cung-ung`, `/khu-cong-nghiep`, `/ban-do-6-giai-doan`; URL cũ trong khối này chưa đăng ký và rơi về trang chủ. Không thay định nghĩa slug/router.
- Giữ chỗ khung tải riêng trang sàn để footer không nhảy khi lazy route xuất hiện.

## Bằng chứng TDD và verification

Journeys được rút từ yêu cầu, không dùng plan bên ngoài. Chưa tạo checkpoint commit: `.git` là read-only và task không yêu cầu commit. Bằng chứng RED/GREEN giữ ở báo cáo này.

| Cam kết | RED | GREEN / kiểm tra |
|---|---|---|
| Query/hiển thị mới, hero giữ nguyên | 7 bài mới thất bại trước triển khai: thiếu helper/UI và rule in hoa | `node --test src/pages/__tests__/demandMarketplace.test.js`: 11/11 đạt |
| Biên ô nhập đủ tương phản | Test contrast thất bại ở biên `#a5b9ad` | Biên `#718b7a`; chữ/nút ≥4.5:1, biên/focus ≥3:1 trong các cặp kiểm tra |
| Giữ chỗ khi tải và reduced motion | Hai bài kiểm tra thiếu marker/listener | Marker riêng sàn, listener có cleanup; browser giảm chuyển động đạt |
| Liên kết dẫn đúng trang | Test thất bại ở `/tra-cuu` chưa đăng ký | Tất cả Link tĩnh của page trỏ route đã đăng ký |
| Không làm hỏng frontend hiện có | Bộ test hiện có được chạy cùng bài mới | `node --test src/pages/__tests__/*.test.js`: 53/53 đạt |
| Build | Chạy sau thay đổi cuối | `npm run build`: đạt, Vite 2225 modules |

`node --experimental-test-coverage --test src/pages/__tests__/demandMarketplace.test.js`: helper `demandMarketplaceUi.js` có 100% line/function, 91.04% branch coverage. Dòng coverage cho component JSX được esbuild bundle ánh xạ lại, không dùng để tuyên bố mọi hook/modal đã được unit-test.

`node docs/testing/qa-demand-marketplace.mjs`: PASS. Profile Chrome headless riêng, chỉ localhost. Không dùng phiên Zen, không gửi hồ sơ, không gọi AI, không đăng nhập thật. Fixture PRIVATE/PENDING/CLOSED/PAUSED chỉ ghi vào localStorage của profile tạm và được xóa.

- 6 viewport: 320, 375, 414, 768, 1280, 1920; không tràn ngang, không ảnh hỏng, bộ lọc có label.
- Search rỗng/không dấu, category, province, stage, khảo sát, reset, sắp xếp hạn, xem thêm, chi tiết bằng bàn phím, Escape/focus, mở SUPPI đúng context, guest phải đăng nhập và chặn phản hồi ở PAUSED/CLOSED đều đạt.
- 14 trang công khai × desktop/mobile: title uppercase, khung title nằm trong màn hình, không bị fallback sang trang chủ. Cơ chế CSS áp dụng các H1 công khai khác; không tuyên bố đã duyệt thủ công mọi URL chi tiết.
- Console page errors: 0; HTTP ≥400: 0 trong lần chạy cuối.
- Dev-local CLS trước giữ chỗ: 0.186–0.204; sau: 0 ở cả 6 viewport. Ví dụ LCP ở 1280px là 116ms trong lần chạy cuối; không suy ra tốc độ production/INP từ kết quả này.

Ảnh kiểm tra: `/tmp/ccu-demands-before-1280.png`, `/tmp/ccu-demands-before-375.png`, `/tmp/ccu-demands-final-1280.png`, `/tmp/ccu-demands-final-375.png`. Đây là screenshot tham khảo trước/sau, không phải baseline pixel-diff tự động.

## Chẩn đoán script kiểm thử

Các lỗi ban đầu nằm trong bài test: từ “đồng phục” khớp cả nhu cầu vải (không chỉ một đơn hàng), Puppeteer không nhận phím gộp `Shift+Tab`, và click tọa độ/đọc DOM ngay sau cuộn mượt có thể bỏ lỡ cập nhật. Kiểm tra riêng xác nhận reset trả về 6 nhu cầu và xóa từ khóa. Script dùng bàn phím native, chờ trạng thái React; lần chạy đầy đủ cuối đạt. Không thay logic reset của sản phẩm để khớp kỳ vọng sai.

## Giới hạn

Project không cấu hình frontend lint/typecheck riêng. Đã build và quét file task không có secret/debug placeholder mới. `git diff --check` phát hiện khoảng trắng tồn tại sẵn ở `src/App.jsx:88`, ngoài thay đổi của task; không sửa dòng đó. Chưa chạy axe hoặc screen reader nên không tuyên bố WCAG audit toàn bộ. Cảnh báo bundle dữ liệu doanh nghiệp lớn là tồn tại của project, chưa xử lý trong task giao diện. Service nhu cầu hiện đọc seed/localStorage; bản tóm tắt không hiển thị thông tin liên hệ riêng, nhưng đây không phải kiểm chứng bảo mật database hay loại bỏ private seed khỏi bundle. Luồng response và SUPPI cũ được giữ, không khẳng định đã kết nối production.

## Self-evaluation

| Trục | Điểm | Bằng chứng / cải thiện |
|---|---|---|
| Accuracy | 4 | 53 test, build, QA đạt; chưa có chứng cứ production hoặc screen reader |
| Completeness | 4 | Giữ hero, gọn discovery, chữ hoa chung; chỉ smoke 14 route, chưa mọi trang động |
| Clarity | 4 | Yêu cầu chính và CTA rõ; nội dung dữ liệu gốc dài vẫn cần mở chi tiết |
| Actionability | 5 | Xem ngay tại localhost, script QA có thể chạy lại |
| Conciseness | 4 | Bỏ liên kết quảng bá và ô spec lặp; module còn giữ modal cũ để hạn chế rủi ro |

Trung bình 4.2/5. Deliver as-is cho phạm vi local UI. Kiểm tra production, screen reader và backend data wiring là việc riêng, không tự triển khai thêm. Người dùng có thể đánh giá trực tiếp trang live; điểm thẩm mỹ là đánh giá của agent, không thay phản hồi của người dùng.
