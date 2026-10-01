# BÁO CÁO AUDIT CHI TIẾT NHU CẦU & ĐIỀU PHỐI QUẢN TRỊ (ADMIN NEED DETAIL & MATCHING)
**Dự án:** CHUOICUNGUNG.COM  
**Phân hệ:** ADMIN / BÀN ĐIỀU PHỐI NHU CẦU CHI TIẾT  
**Target Routes:** `/admin/nhu-cau/[id]`, `/admin/matching`, `/admin/connections`, `/admin/tasks`  
**Giai đoạn:** PROMPT 04-01 — AUDIT WORKSPACE (Chưa redesign, Chưa migration, Dừng lại sau Audit)  
**Thời gian thực hiện:** 28/09/2026  

---

## 1. Khảo sát 4 Route Admin Trọng Tâm của Giai đoạn Page 04

| Route mục tiêu | Trạng thái hiện tại trong Codebase | Component tương ứng | Đánh giá & Khoảng cách |
| :--- | :--- | :--- | :--- |
| **`/admin/nhu-cau/[id]`** | **CHƯA CÓ TRONG CODEBASE** | Chưa có component | Quản trị viên/Điều phối viên hoàn toàn chưa có màn hình chi tiết một nhu cầu (Control Center) để xem thông số, gán Owner, đổi status, hoặc xử lý kết nối. |
| **`/admin/matching`** | **CHƯA CÓ TRONG CODEBASE** | Chưa có component | Chưa có giao diện phễu Matching (Candidate → Shortlist → Invited → Confirmed → Connected) để chuyên viên Sourcing lọc và gợi ý NCC. |
| **`/admin/connections`** | **CHƯA CÓ TRONG CODEBASE** | Chưa có component | Chưa có bảng quản lý danh sách các kết nối đang diễn ra giữa bên mua và bên bán (MOU, Lịch gặp, Mẫu thử, Báo giá, Đàm phán). |
| **`/admin/tasks`** | **CHƯA CÓ TRONG CODEBASE** | Chưa có component | Chưa có Task Board tập trung để ban quản trị giám sát tiến độ công việc, việc quá hạn (`OVERDUE`), việc hôm nay, phân loại theo điều phối viên. |

---

## 2. Khảo sát Chi tiết Yêu cầu `/admin/nhu-cau/[id]` (Admin Need Detail Control Center)

Theo đặc tả của Spec (Mục 56–58), trang `/admin/nhu-cau/[id]` là **Trung tâm chỉ huy (Control Center) của một nhu cầu**. Dưới đây là khảo sát đối chiếu với hiện trạng:

### 2.1. Admin Header
- **Yêu cầu Spec:**
  - Luôn cố định trên đầu trang:
    - **Mã nhu cầu:** `NC-2026-00125`
    - **Tiêu đề:** `500 bộ đồng phục công nhân`
    - **Doanh nghiệp & Địa bàn:** `Công ty ABC · Đồng Nai`
    - **Trạng thái:** `Đang tìm nguồn`
    - **Người phụ trách (Owner):** `Lan Nguyễn (Sourcing Team)`
    - **Việc tiếp theo (Next Action):** `Xác nhận 3 NCC`
    - **Hạn chót (Due Date):** `30/09/2026`
    - **Thao tác nhanh (Action Buttons):** Đổi Owner, Đổi Status, Tạo Task, Thêm NCC thủ công, Gửi thông báo, Đóng nhu cầu.
- **Hiện trạng:** Chưa có giao diện Header này trong codebase.

### 2.2. Hệ thống 13 Tabs Quản trị Chuyên sâu
Spec quy định 13 tabs nghiệp vụ cho trang `/admin/nhu-cau/[id]`:
1. **Tổng quan (Overview):** Dashboard thu nhỏ của nhu cầu, tiến độ pipeline, các cảnh báo quá hạn.
2. **Nhu cầu (Requirement):** Toàn bộ thông số kỹ thuật, lịch sử phiên bản (`requirement_versions`).
3. **Matching:** Bảng phễu ứng viên nhà cung ứng được AI gợi ý và bộ lọc sourcing.
4. **Kết nối (Connections):** Danh sách các nhà cung ứng đã xác nhận quan tâm và đang làm việc.
5. **Mẫu / Khảo sát (Samples/Surveys):** Quản lý tiến độ gửi mẫu và lịch khảo sát nhà xưởng.
6. **Báo giá (Quotes):** Hồ sơ báo giá của các NCC, lịch sử phiên bản báo giá.
7. **Cuộc gặp (Meetings):** Lịch hẹn B2B 1:1, link họp trực tuyến, biên bản cuộc gặp.
8. **Tasks:** Danh sách công việc nội bộ và việc cần các bên thực hiện.
9. **Trao đổi (Messages):** Toàn bộ hội thoại liên quan đến nhu cầu (lọc theo kênh Web, Zalo, ghi chú nội bộ).
10. **Timeline:** Nhật ký dòng thời gian hoạt động bất biến từ lúc tạo đến hiện tại.
11. **Kết quả (Results):** Ghi nhận kết quả đóng nhu cầu (chọn NCC, ký hợp đồng, dừng dự án).
12. **Tài liệu (Files):** Toàn bộ bản vẽ, tài liệu kỹ thuật, hợp đồng đính kèm.
13. **Audit Log:** Lịch sử ghi nhận ai đã sửa đổi dữ liệu gì, vào lúc nào.

- **Hiện trạng:** **Cả 13 tabs này hoàn toàn chưa được xây dựng phía admin.**

---

## 3. Khảo sát Cơ chế Phễu Matching (`/admin/matching`)
- **Quy trình chuẩn theo Spec (Mục 59–61):**
  - Chuyên viên Sourcing phải quản lý ứng viên qua 5 bước:
    `CANDIDATE SUPPLIERS` (Ứng viên tiềm năng từ DB)  
    → `SHORTLIST` (Danh sách chọn lọc sơ bộ)  
    → `INVITED` (Đã gửi lời mời tiếp nhận)  
    → `CONFIRMED` (NCC đã xác nhận khả năng đáp ứng)  
    → `CONNECTED` (Đã tạo kết nối, chuyển giao cho CHAINY)
- **Quy tắc cứng: Bắt buộc lưu lý do loại trừ (Why Not Suitable):**
  - Khi điều phối viên đánh dấu một NCC là "Không phù hợp", hệ thống **bắt buộc chọn lý do chuẩn hóa**:
    `OUT_OF_AREA` (Ngoài địa bàn), `CAPACITY` (Không đủ năng lực), `LEAD_TIME` (Không kịp tiến độ), `PRICE` (Giá quá cao), `TECHNICAL` (Không đạt chuẩn kỹ thuật), `NO_RESPONSE` (Không phản hồi), `DUPLICATE` (Trùng lặp), `OTHER` (Khác).
  - Không được xóa thẻ NCC một cách âm thầm mà không lưu vết.
- **Hiện trạng:** Codebase hiện tại chưa có mô hình dữ liệu và giao diện cho phễu này.

---

## 4. Khảo sát Cơ chế Quản lý Kết nối (`/admin/connections`)
- **Mục tiêu:** Quản lý chi tiết từng cặp kết nối 1:1 giữa Bên Mua và từng Bên Bán:
  `Buyer ABC ↔ Supplier XYZ`
- **Mỗi Connection phải có cấu trúc dữ liệu:**
  - `stage`: Giai đoạn hiện tại (CONNECTED, MEETING, SAMPLE, QUOTATION, NEGOTIATION, RESULT).
  - `owner`: Điều phối viên phụ trách trực tiếp.
  - `nextAction`: Việc tiếp theo cần hoàn thành.
  - `nextActionAt`: Hạn chót.
  - `timeline`: Nhật ký hoạt động riêng của từng kết nối.
- **Hiện trạng:** Chưa có trong database và frontend admin.

---

## 5. Khảo sát Bàn Công việc Tập trung (`/admin/tasks`)
- **Yêu cầu Spec (Mục 63–65):**
  - Admin Dashboard không được để công việc bị "chìm" bên trong từng nhu cầu riêng lẻ.
  - Phải có Task Board tập trung với các bộ lọc:
    - `Hôm nay (Today)`
    - `Quá hạn (Overdue)` — Hiển thị huy hiệu đỏ cảnh báo nếu `dueAt < now`
    - `Tuần này (This week)`
    - `Theo Điều phối viên (By Owner)`
    - `Theo Nhu cầu (By Requirement)`
    - `Theo Tổ chức (By Organization)`
- **Hiện trạng:** Chưa có Task Board trong admin.

---

## 6. Khảo sát Tính năng Bàn giao Người thật (Human Handoff) & Ghi chú Nội bộ
- **Ghi chú nội bộ (Internal Notes - Spec Mục 65):**
  - Điều phối viên cần ghi chú đánh giá thực tế (ví dụ: *"NCC này từng trễ hẹn giao hàng xưởng 2, cần kiểm tra kỹ tiến độ"*).
  - Ghi chú này phải có scope `INTERNAL_ONLY` — **tuyệt đối không để Buyer hoặc Supplier nhìn thấy**.
- **Bàn giao người thật (Human Handoff - Spec Mục 66):**
  - Khi AI SUPPI/CHAINY gặp tình huống phức tạp không thể tự giải quyết:
    Hệ thống chuyển `activeAssistant = HUMAN`, thông báo cho điều phối viên nhận xử lý trực tiếp trên giao diện chat. Sau khi xử lý xong, có thể chuyển giao lại cho AI.
- **Hiện trạng:** Cả 2 tính năng này chưa có hạ tầng backend và giao diện admin hỗ trợ.

---

## 7. BẢNG TỔNG HỢP ĐÁNH GIÁ ADMIN GIAI ĐOẠN PAGE 04

| Phân hệ / Tính năng Admin | Trạng thái hiện tại | Yêu cầu theo Spec | Mức độ cấp thiết |
| :--- | :--- | :--- | :--- |
| **Route `/admin/nhu-cau/[id]`** | ❌ Chưa có | Control Center chi tiết nhu cầu với 13 tabs | **P0 (Cốt lõi)** |
| **Phễu Matching (`/admin/matching`)** | ❌ Chưa có | 5 bước Kanban + Bắt buộc lưu lý do loại trừ | **P0 (Cốt lõi)** |
| **Quản lý Kết nối (`/admin/connections`)**| ❌ Chưa có | Bảng tiến độ kết nối 1:1 Buyer ↔ Supplier | **P0 (Cốt lõi)** |
| **Bàn Task tập trung (`/admin/tasks`)** | ❌ Chưa có | Task Board với bộ lọc Overdue, Today, Owner | **P0 (Cốt lõi)** |
| **Header cố định Owner & Next Action** | ❌ Chưa có | Mã NC, Status, Owner, Next Action, Due Date | **P0** |
| **Phân quyền Ghi chú Nội bộ** | ❌ Chưa có | `INTERNAL_ONLY` note ẩn với người dùng | **P1** |
| **Human Handoff Workflow** | ❌ Chưa có | Điều phối viên tiếp quản chat từ AI | **P1** |
| **Nhật ký Audit Log bắt buộc** | ❌ Chưa có | Bảng `audit_logs` lưu vết mọi thao tác sửa | **P1** |

---

## 8. KẾT LUẬN & DỪNG LẠI SAU AUDIT (STOP AFTER AUDIT)
Theo đúng chỉ đạo của tài liệu spec `4.txt`:
- Toàn bộ audit hiện trạng hệ thống quản trị chi tiết nhu cầu `/admin/nhu-cau/[id]`, phễu matching, quản lý kết nối và bàn công việc tasks đã được hoàn thành đầy đủ và lưu tại:
  `docs/admin/REQUIREMENT_ADMIN_DETAIL_AUDIT.md`
- **Không redesign, không migration, không tạo code mới.**
- Hệ thống đã sẵn sàng cho bước kế tiếp: **PROMPT 04-02 — DATA MODEL**.
