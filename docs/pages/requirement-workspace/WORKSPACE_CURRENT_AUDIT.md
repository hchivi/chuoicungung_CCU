# BÁO CÁO AUDIT HIỆN TRẠNG WORKSPACE NHU CẦU (PAGE 04)
**Dự án:** CHUOICUNGUNG.COM  
**Trang:** 04 — KHÔNG GIAN XỬ LÝ NHU CẦU (BUYER REQUIREMENT WORKSPACE)  
**Target Route:** `/tai-khoan/nhu-cau/[id]` (alias `/workspace/nhu-cau/:id`)  
**Giai đoạn:** PROMPT 04-01 — AUDIT WORKSPACE (Chưa redesign, Chưa migration, Dừng lại sau Audit)  
**Thời gian thực hiện:** 28/09/2026  

---

## 1. Trạng thái Route `/tai-khoan/nhu-cau/[id]` trong Codebase
- **Khai báo Router:** [src/App.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/App.jsx) (Lines 272–274):
  ```jsx
  <Route path="/tai-khoan/nhu-cau/:id" element={<DemandWorkspacePage />} />
  <Route path="/tai-khoan/nhu-cau" element={<DemandWorkspacePage />} />
  <Route path="/workspace/nhu-cau/:id" element={<DemandWorkspacePage />} />
  ```
- **Component đảm nhiệm:** [src/pages/DemandWorkspacePage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/DemandWorkspacePage.jsx) (1.198 dòng code).
- **Layout Wrapper:** Đang bị bọc bởi `MainLayout` toàn cục (hiển thị đầy đủ thanh `Navbar`, `Footer`, và widget `SuppliMascot`).
- **Khoảng cách với Spec (Mục 1, 3, 52):**
  - Spec quy định đây là **Private Authenticated Workspace**: Phải có Header riêng biệt (`← Nhu cầu của tôi`, mã nhu cầu `NC-2026-00125`, status badge, pipeline 5 bước ngang, profile tổ chức).
  - Không được index công khai (`noindex, nofollow`), không expose dữ liệu qua public SSR mà không kiểm tra quyền.

---

## 2. Rà soát Data Model & Backend API cho 12 Thực thể Cốt lõi

| Thực thể theo Spec (Mục 45) | Model Backend hiện tại | API Backend hiện tại | Trạng thái trong `DemandWorkspacePage.jsx` | Đánh giá & Khoảng cách |
| :--- | :--- | :--- | :--- | :--- |
| **1. `requirements`** | [server/models/Demand.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/server/models/Demand.js) | `GET /api/demands`, `POST /api/demands` | Đọc từ `localStorage` (`ccu_draft_...` hoặc default mock) | Model thiếu trường kỹ thuật; Frontend hoàn toàn chưa gọi API backend |
| **2. `requirement_versions`** | **CHƯA CÓ** | **CHƯA CÓ** | Chỉ có nhãn text `Phiên bản: v1.2 (Active)` | Thiếu bảng lịch sử thay đổi thông số quan trọng (số lượng, deadline...) |
| **3. `supplier_matches`** | **CHƯA CÓ** | **CHƯA CÓ** | Mảng state React `suppliers` (3 NCC mock) | Cần bảng liên kết matching độc lập với trạng thái riêng cho từng NCC |
| **4. `connections`** | **CHƯA CÓ** | **CHƯA CÓ** | Chưa có đối tượng connection riêng | Chưa có thực thể kết nối chính thức giữa Buyer và Supplier được chọn |
| **5. `meetings`** | **CHƯA CÓ** | **CHƯA CÓ** | Chưa có | Thiếu thực thể quản lý lịch gặp B2B, biên bản cuộc gặp và next action |
| **6. `samples`** | **CHƯA CÓ** | **CHƯA CÓ** | Thuộc tính chuỗi `sampleStatus` trong supplier card | Cần model Sample riêng: Ngày yêu cầu, ngày gửi, ngày nhận, nghiệm thu |
| **7. `surveys`** | **CHƯA CÓ** | **CHƯA CÓ** | Gộp chung trong tab Mẫu/Khảo sát | Cần model Survey riêng: Lịch khảo sát nhà máy, người tham gia, kết quả |
| **8. `quotations`** | **CHƯA CÓ** | **CHƯA CÓ** | Thuộc tính chuỗi `quotePrice`, `quoteTotal`, `quoteFile` | Cần model Quotation riêng: Số báo giá, file đính kèm, hiệu lực, bảo mật |
| **9. `tasks`** | **CHƯA CÓ** | **CHƯA CÓ** | Mảng state React `tasks` (3 tasks mock) | Cần model Task: `ownerUserId`, `dueAt`, `status`, cảnh báo `OVERDUE` |
| **10. `messages`** | **CHƯA CÓ** | **CHƯA CÓ** | Mảng state React `timelineNotes` (3 ghi chú mock) | Cần model Message hỗ trợ phân quyền scope: `BUYER_ONLY`, `INTERNAL`... |
| **11. `activities`** | **CHƯA CÓ** | **CHƯA CÓ** | Gộp chung trong `timelineNotes` | Cần bảng nhật ký hoạt động bất biến (Immutable activity log) |
| **12. `outcomes`** | **CHƯA CÓ** | **CHƯA CÓ** | Object state React `finalResult` mock | Cần model Outcome ghi nhận lý do đóng (WON, NOT_SUITABLE, PAUSED...) |

---

## 3. Khảo sát Cơ chế Phân quyền & Bảo mật (Authorization & Access Control)

- **HOÀN TOÀN THIẾU XÁC THỰC VÀ KIỂM SOÁT QUYỀN (CRITICAL VULNERABILITY):**
  1. **Không kiểm tra Đăng nhập:** Bất kỳ ai (kể cả Guest chưa đăng nhập) gõ URL `/tai-khoan/nhu-cau/REQ-849201` đều mở được workspace và xem toàn bộ dữ liệu.
  2. **Không kiểm tra Quyền sở hữu (Buyer Ownership):** Không có cơ chế kiểm tra xem nhu cầu này có thuộc về tài khoản đang đăng nhập hay không. Người dùng A có thể đổi tham số ID trên URL để xem nhu cầu của Người dùng B.
  3. **Không phân tách quyền Nhà cung ứng (Supplier Access):** Nhà cung ứng nếu có link này sẽ nhìn thấy danh sách các đối thủ cạnh tranh, thấy giá chào của các NCC khác (`quotePrice: '185.000 VNĐ'` vs `'195.000 VNĐ'`) — vi phạm nghiêm trọng nguyên tắc bảo mật B2B của hệ thống (Spec Mục 17 & 25).
  4. **Không có phân quyền Admin/Coordinator:** Chưa có cơ chế nhận biết điều phối viên được giao phụ trách nhu cầu.

---

## 4. Khảo sát Tình trạng Trộn lẫn Trạng thái (Status Mixing)

- **Hiện trạng trên UI:**
  - Trang có 1 state tổng: `currentNeedStatus = 'ACTIVE_SOURCING'`.
  - Mỗi thẻ NCC trong mảng `suppliers` có trạng thái cục bộ: `status: 'ĐÃ BÁO GIÁ'`, `'MẪU / KHẢO SÁT'`, `'ĐÃ PHẢN HỒI'`.
- **Đánh giá:**
  - Về mặt ý tưởng UI, component đã có nhận thức phân tách: Trạng thái của toàn bộ nhu cầu (cấp cao) và trạng thái của từng nhà cung ứng (cấp chi tiết).
  - **Tuy nhiên ở tầng dữ liệu:** Do chưa có 2 bảng riêng `requirements` và `supplier_matches`, toàn bộ dữ liệu này đang nằm trong một object state duy nhất. Nếu lưu vào database hiện tại (`Demand.js`), hệ thống chỉ có một trường `status: enum['pending', 'approved', 'closed']`, làm mất toàn bộ trạng thái chi tiết của từng NCC.
  - Cần tách biệt rõ ràng 3 cấp trạng thái theo Spec:
    1. **Requirement Status:** `NEW` → `NEED_MORE_INFO` → `VERIFIED` → `SOURCING` → `CONNECTING` → `IN_PROGRESS` → `CLOSED`.
    2. **SupplierMatch Status:** `CANDIDATE` → `CHECKING` → `INVITED` → `RESPONDED` → `SUPPLIER_CONFIRMED` → `CONNECTED` → `SAMPLE` → `QUOTED` → `RESULT`.
    3. **Connection Stage:** `CONNECTED` → `MEETING` → `SAMPLE_OR_SURVEY` → `QUOTATION` → `NEGOTIATION` → `RESULT`.

---

## 5. Khảo sát `owner`, `nextAction` và `nextActionAt`

- **Trạng thái hiện tại:**
  - Trong mảng mock `tasks`, đã có trường `ownerUserId: 'Nguyễn Văn Nam (Trưởng phòng mua hàng)'` và `deadline`.
  - Tuy nhiên, **ở cấp độ Connection và Requirement tổng thể, hoàn toàn chưa có các trường**:
    - `ownerUserId`: Điều phối viên hoặc người chịu trách nhiệm chính.
    - `nextAction`: Tên công việc cụ thể tiếp theo cần làm.
    - `nextActionAt`: Thời hạn bắt buộc hoàn thành.
- **Quy tắc cứng chưa được thực thi (Spec Mục 11):**
  - Spec quy định: *"Mỗi active connection bắt buộc phải có owner, nextAction và nextActionAt. Không cho một connection ở trạng thái Đang xử lý mà không biết Ai làm? Làm gì? Khi nào?"*. Hiện tại hệ thống chưa có validation này.
- **Right Sidebar Desktop (Spec Mục 43):**
  - Spec yêu cầu luôn có cột phải hiển thị: Trạng thái, Owner điều phối, Việc tiếp theo, Hạn chót, và nút bấm hành động với SUPPI/CHAINY. Hiện tại `DemandWorkspacePage.jsx` chưa có cột này (chỉ có 8 tabs nội dung chính).

---

## 6. Khảo sát 8 Tab chức năng trong Workspace

| Tab | Tên Tab hiện tại | Nội dung thực tế trong code | Đánh giá so với Spec Mục 6–38 |
| :--- | :--- | :--- | :--- |
| **Tab 1** | **Tổng quan** | Thẻ yêu cầu hiện tại, thẻ ngân sách, tiêu chuẩn kỹ thuật | Đạt 70%. Thiếu Block B (SUPPI/CHAINY status real), Block C (Tổng quan số lượng query thật), và Block D (Việc tiếp theo nổi bật nhất). |
| **Tab 2** | **Nhà cung ứng** | Danh sách 3 card NCC mock, có nút "Xem hồ sơ", "Chọn nhà cung cấp" | Thiếu lý do "Vì sao phù hợp" (`why matched`), thiếu phân cấp KYC động từ database thật. |
| **Tab 3** | **Bằng chứng** | Tab riêng hiển thị tài liệu chứng chỉ năng lực | Spec Mục 6 khuyến nghị: Bằng chứng nên nằm trực tiếp bên trong từng card NCC, không cần tab riêng gây phân mảnh. |
| **Tab 4** | **Mẫu & Khảo sát** | Danh sách nghiệm thu mẫu của 3 NCC | Dữ liệu tĩnh. Cần tách theo từng connection độc lập. |
| **Tab 5** | **Báo giá** | Bảng so sánh báo giá của các NCC | Cần ẩn báo giá đối thủ khi người xem là Nhà cung ứng (bảo mật tuyệt đối). |
| **Tab 6** | **Trao đổi** | Dòng ghi chú nội bộ + form thêm note mới | Đang lưu mảng tạm trong React state, mất khi refresh. Cần kết nối Conversation CRM. |
| **Tab 7** | **Việc tiếp theo** | Bảng checklist 3 tasks với deadline | Dữ liệu tĩnh. Cần tự động phát sinh task khi có sự kiện (gửi mẫu, báo giá). |
| **Tab 8** | **Kết quả** | Form chọn NCC thắng cuộc, lý do và hợp đồng | Cần hỗ trợ đa dạng kết quả (Đã chọn, Đang tiếp tục, Không phù hợp, Dừng dự án). |

---

## 7. BẢNG TỔNG HỢP HIỆN TRẠNG WORKSPACE NHU CẦU

| Tiêu chí | Hiện trạng | Yêu cầu theo Spec | Đánh giá |
| :--- | :--- | :--- | :--- |
| **URL Public** | `/tai-khoan/nhu-cau/:id` | `/tai-khoan/nhu-cau/NC-2026-xxxxx` | ⚠️ Cần chuẩn hóa format mã |
| **Xác thực truy cập** | Cho phép Guest xem tự do | Bắt buộc login, kiểm tra Buyer ownership | ❌ Lỗ hổng bảo mật nghiêm trọng |
| **Data Source** | `localStorage` + mock state tĩnh | Gọi API backend `GET .../workspace` | ❌ Thiếu kết nối backend |
| **Bảo mật B2B** | Lộ giá các NCC cho nhau | Không cho NCC xem dữ liệu của đối thủ | ❌ Vi phạm bảo mật B2B |
| **Status tách bạch** | Có nhận thức UI, dữ liệu chưa tách | 3 cấp: Requirement, Match, Connection | ⚠️ Cần tách bảng database |
| **Next Action Rule**| Chưa ràng buộc | Bắt buộc có Owner + Action + Deadline | ❌ Chưa có ràng buộc |
| **Right Sidebar** | Chưa có | Trạng thái + Owner + Next Action + Assistant | ❌ Chưa có UI cột phải |
| **Pipeline 5 bước** | Hiển thị 7 bước text | ĐĂNG → TÌM NGUỒN → KẾT NỐI → THEO DÕI → KẾT QUẢ | ⚠️ Cần tinh gọn chuẩn 5 bước |
| **SEO Meta** | Chưa cấu hình | Bắt buộc `noindex, nofollow` | ❌ Cần thêm thẻ noindex |

---

## 8. KẾT LUẬN & DỪNG LẠI SAU AUDIT (STOP AFTER AUDIT)
Theo đúng chỉ đạo của tài liệu spec `4.txt`:
- Toàn bộ audit hiện trạng không gian xử lý nhu cầu `/tai-khoan/nhu-cau/[id]`, data models, phân quyền và rủi ro bảo mật đã được hoàn thành đầy đủ và lưu tại:
  `docs/pages/requirement-workspace/WORKSPACE_CURRENT_AUDIT.md`
- **Không redesign, không migration, không tạo code mới.**
