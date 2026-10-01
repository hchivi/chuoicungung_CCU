# BÁO CÁO AUDIT HIỆN TRẠNG HỆ THỐNG QUẢN TRỊ & BÀN ĐIỀU PHỐI (ADMIN CORE)
**Dự án:** CHUOICUNGUNG.COM  
**Phân hệ:** ADMIN / BÀN ĐIỀU PHỐI HỆ THỐNG  
**Target Routes:** `/admin`, `/admin/nhu-cau`, `/admin/to-chuc`, `/admin/nguoi-dung`  
**Giai đoạn:** PROMPT 03-01 — AUDIT /dang-nhu-cau + ADMIN HIỆN TẠI (Chưa redesign, Chưa migration, Dừng lại sau Audit)  
**Thời gian thực hiện:** 28/09/2026  

---

## 1. Khảo sát Định tuyến & Điểm vào Admin (Admin Routing & Entry Point)

- **File Component:** [src/pages/AdminDashboardPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AdminDashboardPage.jsx) (413 dòng code).
- **Trạng thái Import:** Đã được lazy-import trong [src/App.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/App.jsx) (Line 49):
  `const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));`
- **Logic Layout:** `MainLayout` trong `App.jsx` (Line 141) đã nhận biết tiền tố admin:
  `const isAdmin = location.pathname.startsWith('/admin');` (ẩn Navbar & Footer người dùng).
- **⚠️ PHÁT HIỆN LỖI ĐỊNH TUYẾN NGHIÊM TRỌNG (ROUTING DEFECT):**
  Trong danh sách `<Routes>` của [src/App.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/App.jsx) (Lines 170–348), **HOÀN TOÀN CHƯA CÓ DÒNG KHAI BÁO ROUTE CHO ADMIN**:
  ```jsx
  // THIẾU ROUTE NÀY TRONG APP.JSX:
  <Route path="/admin/*" element={<AdminDashboardPage />} />
  ```
  **Hậu quả:** Khi người dùng hoặc quản trị viên truy cập đường dẫn `/admin` trên trình duyệt, Router sẽ rơi vào route catch-all cuối cùng `<Route path="*" element={<HomePage />} />` và đẩy người dùng về lại Trang chủ! Trang Admin hiện tại đang bị cô lập và không thể mở được từ URL.

---

## 2. Khảo sát Tổng thể Giao diện Admin Dashboard hiện tại
Component [AdminDashboardPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AdminDashboardPage.jsx) được thiết kế với cấu trúc:
1. **Top Header:** Logo Chuỗi Cung Ứng, nhãn "Quản trị hệ thống", thanh tìm kiếm giả lập, chuông thông báo có chấm đỏ, avatar "Admin Master" (Super Administrator).
2. **Left Sidebar (15 mục):**
   - Tổng quan (`/admin`)
   - Doanh nghiệp (count: 1,254)
   - Khu công nghiệp (count: 436)
   - Pha mẫu (count: 18)
   - Bản đồ 6 giai đoạn
   - Hội / Hiệp hội (count: 32)
   - Founding Partner
   - Bài viết & Tin tức
   - Thư viện tài liệu
   - Người dùng (count: 24.5k)
   - Đối tác & Khách hàng
   - Banner & Truyền thông
   - Báo cáo & Thống kê
   - Cấu hình hệ thống
   - Nhật ký hoạt động
3. **Main Content Dashboard:**
   - 5 Thẻ KPI: Doanh nghiệp (1,254), KCN (436), Pha mẫu (18), Hội/Hiệp hội (32), Người dùng (24,568).
   - 2 Biểu đồ tĩnh dạng SVG: Biểu đồ cột tăng trưởng doanh nghiệp mới (30 ngày qua) và Biểu đồ Donut cơ cấu doanh nghiệp theo 6 giai đoạn.
   - Thẻ "Hoạt động gần đây" (Recent Audit Trail) với 5 dòng text tĩnh.
   - Bảng "Doanh nghiệp mới đăng ký cần duyệt" với 5 bản ghi mẫu, có nút bấm chuyển đổi trạng thái "Chờ duyệt" ↔ "Đã duyệt" nội bộ React state.
   - Biểu đồ thanh ngang: Thống kê số lượng theo lĩnh vực ngành nghề (Linh kiện điện tử, Cơ khí, Logistics...).

---

## 3. Khảo sát Chi tiết từng Phân hệ Quản trị theo Yêu cầu Spec

### 3.1. Phân hệ Nhu cầu & Bàn điều phối (`needs` / `/admin/nhu-cau`)
- **Tình trạng:** **HOÀN TOÀN CHƯA CÓ TRONG ADMIN!**
- **Khoảng cách:**
  - Sidebar admin hiện tại không hề có mục "Nhu cầu" hay "Bàn tiếp nhận nhu cầu".
  - Chưa có bảng danh sách nhu cầu dạng Table (Columns: Mã, Tổ chức, Nhu cầu, Địa bàn, Trạng thái, Completeness %, Owner, Next Action, Deadline).
  - Chưa có giao diện dạng Kanban chia 8 cột trạng thái (`MỚI` → `CẦN BỔ SUNG` → `ĐÃ XÁC NHẬN` → `ĐANG TÌM NGUỒN` → `ĐANG KẾT NỐI` → `ĐANG TRAO ĐỔI` → `ĐÓNG`).
  - Chưa có trang chi tiết `/admin/nhu-cau/[id]` để điều phối viên xem thông tin người mua, lịch sử trao đổi với SUPPI, phân công phụ trách, và quản lý các nhà cung ứng ứng viên.

### 3.2. Phân hệ Tổ chức & Doanh nghiệp (`organizations` / `/admin/to-chuc`)
- **Tình trạng:** Mới chỉ có 1 tab `enterprises` sơ khai hiển thị 5 dòng table mock.
- **Khoảng cách:**
  - Chưa có Master Registry `organizations` hợp nhất cho mọi loại hình đối tượng (Nhà máy, NCC, KCN, Hội, Nhà tài trợ).
  - Chưa có bộ lọc theo vai trò (Role: Buyer, Supplier, Sponsor...), theo địa bàn tỉnh thành, hay theo KCN.
  - Chưa có trang chi tiết tổ chức `/admin/to-chuc/[id]` với 13 tabs chuyên sâu (Tổng quan, Vai trò, Người dùng, Hồ sơ năng lực, Nhu cầu đã đăng, Kết nối, Hợp tác...).

### 3.3. Phân hệ Nhà máy (`factories`)
- **Tình trạng:** Chưa có phân hệ quản lý nhà máy trong Admin.
- **Dữ liệu hiện có:** Tệp [src/data/factoriesFull.json](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/data/factoriesFull.json) (14.237 nhà máy) và model [server/models/Factory.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/server/models/Factory.js).
- **Khoảng cách:** Chưa có giao diện quản lý hồ sơ nhà máy, diện tích xưởng, số lượng công nhân, nhu cầu mua sắm thường xuyên, hay thông tin người phụ trách mua hàng (Purchasing).

### 3.4. Phân hệ Nhà cung ứng (`suppliers`)
- **Tình trạng:** Chưa có phân hệ quản lý năng lực nhà cung ứng.
- **Dữ liệu hiện có:** Tệp [src/data/enterprisesFull.json](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/data/enterprisesFull.json) (32.000+ NCC) và model [server/models/Enterprise.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/server/models/Enterprise.js).
- **Khoảng cách:** Chưa có công cụ thẩm định hồ sơ, xác thực cấp độ KYC (Đồng, Bạc, Vàng, Kim Cương), kiểm tra năng lực máy móc, chứng chỉ ISO/FSC/OEKO-TEX, và quản lý trạng thái publish hồ sơ.

### 3.5. Phân hệ Hội & Hiệp hội (`associations`)
- **Tình trạng:** Sidebar chỉ có 1 mục icon Users với số lượng cứng `32`.
- **Dữ liệu hiện có:** [src/data/associations.json](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/data/associations.json).
- **Khoảng cách:** Chưa có giao diện quản trị Hội/Hiệp hội, danh sách hội viên, phạm vi bảo trợ kết nối, hay phân quyền dữ liệu hội viên.

### 3.6. Phân hệ Khu công nghiệp (`industrial_parks`)
- **Tình trạng:** Sidebar chỉ có 1 mục icon MapPin với số lượng cứng `436`.
- **Dữ liệu hiện có:** [src/data/industrialParksFull.json](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/data/industrialParksFull.json) (480 KCN) và model [server/models/IndustrialPark.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/server/models/IndustrialPark.js).
- **Khoảng cách:** Chưa có giao diện quản lý Ban quản lý KCN, danh sách nhà máy trong KCN, trạm Chuỗi Cung Ứng, hay tổng hợp nhu cầu mua sắm tại địa bàn KCN.

### 3.7. Phân hệ Nhà tài trợ (`sponsors`) & Đối tác Đồng hành (`founding_partners`)
- **Tình trạng:** Sidebar có mục `partners` nhưng chưa có trang chức năng.
- **Dữ liệu hiện có:** [src/data/foundingPartners.json](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/data/foundingPartners.json) và [src/data/strategicFoundingPartners.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/data/strategicFoundingPartners.js).
- **Khoảng cách:** Thiếu hoàn toàn module quản lý hợp đồng tài trợ (`sponsorships`), phân bổ ngành hàng độc quyền cho Founding Partners, thời hạn bảo trợ, và báo cáo hiệu quả hiện diện thương hiệu (ROI).

### 3.8. Phân hệ Người dùng (`users`), Vai trò (`roles`) & Phân quyền (`permissions`)
- **Tình trạng:** Sidebar có mục `users` với số lượng cứng `24.5k`.
- **Khoảng cách:**
  - Chưa phân tách giữa tài khoản Người dùng cá nhân (`User`) và Tổ chức doanh nghiệp (`Organization`).
  - Chưa có hệ thống phân quyền theo vai trò (RBAC): Đang chỉ có 1 profile cứng là "Super Administrator".
  - Chưa có bảng quyền (Permissions) theo phạm vi (Scope): `requirements.read.all`, `requirements.assign`, `organizations.verify`, `finance.read`...

### 3.9. Phân hệ Điều phối Công việc (`tasks`, `matching`, `connections`)
- **Tình trạng:** **HOÀN TOÀN CHƯA CÓ TRONG HỆ THỐNG.**
- **Khoảng cách:**
  - Chưa có bảng quản lý công việc tiếp theo (`NextAction`: Owner, Task, Deadline, Status).
  - Chưa có giao diện Matching để điều phối viên gợi ý nhà cung ứng đạt chuẩn cho người mua.
  - Chưa có phân hệ theo dõi cuộc gặp B2B, tiến độ gửi mẫu, báo giá và kết quả cuối cùng.

### 3.10. Phân hệ Nhật ký Hoạt động (`audit_logs`)
- **Tình trạng:** Sidebar có mục `logs`, nhưng trên giao diện chỉ là 5 dòng text tĩnh trong widget "Hoạt động gần đây".
- **Khoảng cách:** Không có bảng lưu trữ Audit Log trong cơ sở dữ liệu. Mọi thao tác quản trị (nếu có sau này) không được ghi lại vết thay đổi (Ai sửa, sửa trường gì, giá trị trước/sau, vào thời gian nào).

---

## 4. BẢNG TỔNG HỢP SO SÁNH HIỆN TRẠNG ADMIN VỚI SPEC

| Phân hệ Admin | Trạng thái hiện tại | Yêu cầu theo Spec (Mục 34–62) | Khoảng cách cần hoàn thiện |
| :--- | :--- | :--- | :--- |
| **Định tuyến Admin** | Bị lỗi định tuyến, không vào được `/admin` | Cấu hình Route `/admin/*` mở Dashboard | Phải bổ sung Route vào `App.jsx` |
| **Bàn tiếp nhận nhu cầu** | ❌ Chưa có | `/admin/nhu-cau` (Table + Kanban 8 cột) | Xây dựng Bàn điều phối nhu cầu |
| **Chi tiết một nhu cầu** | ❌ Chưa có | `/admin/nhu-cau/[id]` (13 tabs quản lý) | Xây dựng màn hình xử lý nhu cầu |
| **Quản trị Tổ chức (Master)**| ⚠️ Bảng mock 5 công ty | `/admin/to-chuc` (1 Registry duy nhất cho 9 roles) | Hợp nhất mô hình Organization |
| **Chi tiết tổ chức** | ❌ Chưa có | `/admin/to-chuc/[id]` (13 tabs theo role) | Xây dựng hồ sơ quản trị tổ chức |
| **Quản trị Người dùng & RBAC**| ❌ Dữ liệu text tĩnh | `/admin/nguoi-dung` + RBAC phân quyền chặt chẽ | Xây dựng quản lý User & Quyền |
| **Điều phối Tasks & SLA** | ❌ Chưa có | Mỗi record có Owner, Next Action, Due Date, SLA | Bổ sung Task & Queue quản lý |
| **Đối tác Sáng lập & Tài trợ**| ❌ Chưa có UI | Entity `founding_partnerships`, `sponsorships` | Xây dựng quản lý hợp đồng tài trợ |
| **Audit Logs** | ⚠️ Text giả lập | Bảng `audit_logs` bắt buộc ghi nhận mọi thay đổi | Xây dựng Audit Logger backend |
| **Tìm kiếm Quản trị toàn cục**| ⚠️ Input tĩnh | Tìm theo Mã nhu cầu, MST, Tên, SĐT, Email | Kết nối Global Search API |

---

## 5. KẾT LUẬN & DỪNG LẠI SAU AUDIT (STOP AFTER AUDIT)
Theo đúng chỉ đạo của tài liệu spec `3.txt`:
- Toàn bộ audit hiện trạng hệ thống quản trị Admin Core và các phân hệ dữ liệu liên quan đã được hoàn thành đầy đủ và lưu tại:
  `docs/admin/ADMIN_CURRENT_AUDIT.md`
- **Chưa redesign, chưa migration, không tạo code mới.**
- Hệ thống đã sẵn sàng cho bước kế tiếp: **PROMPT 03-02 — ORGANIZATION + ADMIN CORE DATA MODEL**.
