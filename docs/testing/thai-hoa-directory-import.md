# Nhập danh bạ Thái Hòa — 12/10/2026

## Kết quả

Nguồn người dùng cung cấp: https://docs.google.com/spreadsheets/d/1TwLGGOaPU2Yq7nKzDKyeq3Pm5GKX-Upw/edit?gid=370501853#gid=370501853

File thực tế là `XTTM.KCN.ThaiHoa.07.2026.danh_ba_doanh_nghiep.xlsx`, không phải native Google Sheet. Đọc bản Excel gốc, không chuyển đổi hay sửa nguồn. Browser xác nhận gid 370501853 là tab `Danh Bạ XTTM Chi Tiết`. Đối chiếu 43 dòng business fields (group, badge, organization, company, field) với `xttmDirectoryData.js`: khớp hoàn toàn.

43 dòng đại diện → 40 doanh nghiệp; gộp Phương Yên, FRESHAIR và LBS, giữ các mục tiêu kết nối của mỗi doanh nghiệp. 16 THIP Members xếp Buyer; 24 TeamKCN/GEM Members xếp Supplier. Đây là cách phân nhóm theo tổ chức trong danh bạ, không phải xác thực từng nhu cầu mua. Không nhập tên đại diện, điện thoại, email. Nguồn không có logo và RFQ chi tiết: giữ icon thay thế, dùng lĩnh vực nguyên bản và mục tiêu kết nối, không bịa sản phẩm cần mua hoặc logo.

Đã nhập vào `ccu_documents`, collection `programs`, id `PRG-2026-TEAMKCN-THAIHOA`. Trước đó trang không nhận ra bản ghi này vì chỉ dò id/slug khác; sửa lookup tương thích cả mã Supabase, canonical slug và legacy slug. Không thêm local fallback. Không thay đổi Google file, header, thiết kế thẻ, schema hay chương trình khác.

Lệnh `node server/scripts/importThaiHoaParticipants.js` kiểm tra thử; thêm `--apply` để ghi. Import có whitelist, dedup, giữ hồ sơ/moderation cũ, kiểm soát xung đột bằng updated_at, backup mode 0600, và đọc lại so sánh sâu toàn bộ data. Không dùng làm tác vụ đồng bộ tự động.

Kết quả thực tế: sourceRows 43, uniqueCompanies/publicCompanies 40, buyers 16, suppliers 24, applied true. Bản trước khi nhập: `/private/tmp/ccu-thaihoa-program-1791774914770.json` (tạm thời, không đưa vào public/git). Restart riêng backend local để xóa cache 6 giờ, không dừng Vite/crawler. Browser reload đã nhận dữ liệu.

## TDD và kiểm chứng

User journey: xem doanh nghiệp từ danh bạ trong khối trước sự kiện, chuyển trang/xem tất cả, không công khai liên hệ cá nhân và không lặp doanh nghiệp nhiều đại diện.

- RED: `node --test server/tests/thai-hoa-participant-import.test.js` thất bại vì thiếu module chuyển đổi (ERR_MODULE_NOT_FOUND).
- GREEN: cùng test cùng 6 bộ test liên quan trang Thái Hòa/workflow/discovery: 45/45 pass, exit 0.
- Import tests: 40 unique, 16/24; gộp trùng; giữ mục tiêu nhiều nhóm; whitelist loại PII; reject group/org không nhận diện; blank names/industry; merge idempotent và giữ nội dung/moderation cũ; lookup Supabase/legacy/canonical.
- Coverage command: `node --test --experimental-test-coverage --test-coverage-include='server/imports/thaiHoaParticipants.js' --test-coverage-include='src/pages/thaiHoaEventLandingModel.js' server/tests/thai-hoa-participant-import.test.js src/pages/__tests__/thaiHoaEventLanding.test.js src/pages/__tests__/thaiHoaConfirmedParticipants.test.js`.
- Coverage import: 100% lines/functions, 96.15% branches. Event model: 100% lines, 89.53% branches, 94.44% functions. Không phải coverage toàn repo hoặc script vận hành.
- Supabase dry run và apply thành công, đọc lại toàn bộ data khớp bằng isDeepStrictEqual. Không claim unit-test toàn bộ lỗi mạng của script.
- Build `./node_modules/.bin/vite build --outDir /private/tmp/ccu-post-build.Kus8o8 --emptyOutDir false`: exit 0, 2237 modules, 8.63s. Không đụng dist/uploads.
- Browser thật: mặc định 8 thẻ, Buyer 4 trang/Supplier 6 trang. Next Buyer → VBOOK/Việt Gia Minh/Âu Việt/Đồng Tiến; next Supplier → Á Châu/LBS/Life Sciences/MB. Xem tất cả → 40 thẻ, Thu gọn → 8. Không có email/số điện thoại trong section. Nút gặp vẫn khóa theo thời hạn thật, không tự mở đăng ký.
- Responsive 375, 768, 1440px: không tràn ngang (scrollWidth lần lượt 369, 762, 1434); 8 thẻ ở chế độ thu gọn. Console error log rỗng lúc kiểm tra. Đã reset viewport.
- Ảnh tại `thai-hoa-landing/directory-import-{desktop-1440,tablet-768,mobile-375}.png`. Desktop và mobile kiểm tra trực quan. Không có baseline pixel tự động; visual regression INCONCLUSIVE. Không đo axe/CWV/screen-reader toàn bộ.
- .git read-only theo môi trường; không tạo checkpoint commit. Lưu RED/GREEN ở đây; giữ các thay đổi khác trong dirty tree.

## Tự đánh giá

Overall 4.0/5. Skill Google Drive/Sheets + Spreadsheets giúp phát hiện Excel và đối chiếu đúng tab, TDD bắt lỗi lookup, Browser QA xác nhận các nút với dữ liệu thật; agent-self-evaluation ghi rõ giới hạn.

| Trục | Điểm | Bằng chứng / cải thiện |
|---|---:|---|
| Accuracy | 4 | 43 dòng đối chiếu khớp, 40 hồ sơ đọc lại từ cloud. Vai trò được phân theo tổ chức, chưa có xác nhận vai trò riêng từng công ty trong nguồn. |
| Completeness | 4 | Đủ 40 doanh nghiệp và phân trang/expand. Không thể thêm logo hoặc RFQ nguồn chưa cung cấp. |
| Clarity | 4 | Thẻ phân biệt industry và mục tiêu kết nối. Một số industry nguồn tiếng Anh được giữ nguyên thay vì dịch suy đoán. |
| Actionability | 4 | Trang thật có dữ liệu Supabase, import có backup. Chỉnh sửa Excel sau lần nhập không tự đồng bộ. |
| Conciseness | 4 | Không thêm dependency, schema hoặc thiết kế khác. Script nhập riêng phục vụ tái kiểm tra, không tạo hệ thống đồng bộ ngoài yêu cầu. |

Critical issues: không có trong phạm vi nhập danh sách. Self-check: người dùng có thể xem 40 doanh nghiệp trong khối đã yêu cầu ngay. Cải thiện tiếp nếu có dữ liệu: cung cấp logo/RFQ thật và xác nhận vai trò riêng; không coi đây là blocker của việc bổ sung danh bạ hiện tại.
