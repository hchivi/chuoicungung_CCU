# BÁO CÁO AUDIT HIỆN TRẠNG — QUẢN TRỊ NHÀ CUNG ỨNG TRONG ADMIN
**Dự án**: CHUOICUNGUNG.COM  
**Phân hệ**: Admin Supplier Management (Hậu đài Quản trị Nhà cung ứng & Năng lực)  
**Thời điểm thực hiện**: 28/09/2026  
**Phạm vi**: Đánh giá hiện trạng các route quản trị liên quan đến Doanh nghiệp / Nhà cung ứng, kiểm tra quy trình duyệt, cấu trúc dữ liệu, hàng đợi kiểm duyệt bằng chứng và công cụ Matching trong Admin.  
**Nguyên tắc thực hiện**: KHÔNG redesign, KHÔNG migration, KHÔNG can thiệp code ở bước này.

---

## 1. TỔNG QUAN HIỆN TRẠNG ROUTING & GIAO DIỆN ADMIN

### 1.1 Kiểm tra Routing Admin trong `src/App.jsx`
- **Kết quả kiểm tra thực tế**:
  - File [src/App.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/App.jsx#L49) có khai báo import lazy component `AdminDashboardPage`:
    ```javascript
    const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
    ```
  - **Nhưng KHÔNG CÓ BẤT KỲ ROUTE NÀO** được đăng ký cho `/admin`, `/admin/to-chuc` hay `/admin/nha-cung-ung` trong khối `<Routes>` của `App.jsx`!
  - Người dùng hoặc quản trị viên gõ `/admin` trên trình duyệt sẽ bị rơi vào route bắt lỗi catch-all `path="*"` dẫn về `<HomePage />`.
  - Như vậy, toàn bộ phần quản trị Admin hiện tại chỉ tồn tại dưới dạng một component cô lập [src/pages/AdminDashboardPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AdminDashboardPage.jsx) chưa được gắn kết nối định tuyến chính thức.

### 1.2 Hiện trạng giao diện quản trị doanh nghiệp trong `AdminDashboardPage.jsx`
- Trong component `AdminDashboardPage.jsx`:
  - Có mục menu sidebar: `{ id: 'enterprises', label: 'Doanh nghiệp', icon: Building2, count: "1,254" }`.
  - Khi bấm chọn mục menu này, trang không chuyển sang danh sách doanh nghiệp thực tế từ database mà vẫn giữ nguyên màn hình tổng quan, trong đó có một bảng giả lập tĩnh gồm 5 dòng:
    - `Công ty TNHH ABC` (Sản xuất linh kiện điện tử - Hà Nội - Giai đoạn 1 - Chờ duyệt)
    - `Công ty Cổ phần DEF` (Sản xuất cơ khí - Bắc Ninh - Giai đoạn 2 - Đã duyệt)
    - `Công ty TNHH GHI` (Logistics - Hải Phòng - Giai đoạn 1 - Chờ duyệt)
    - `Công ty Cổ phần JKL` (Sản xuất bao bì - Bình Dương - Giai đoạn 3 - Đã duyệt)
    - `Công ty TNHH MNO` (Thực phẩm & Đồ uống - Đồng Nai - Giai đoạn 2 - Chờ duyệt)
  - Nút bấm "Duyệt" / "Hủy duyệt" (`toggleStatus`) chỉ đổi trạng thái trong mảng state RAM tạm thời của React, không gọi API, không lưu cơ sở dữ liệu và mất ngay khi tải lại trang.

---

## 2. KHOẢNG CÁCH SO VỚI YÊU CẦU QUẢN TRỊ NHÀ CUNG ỨNG (SPEC PAGE 05)

### 2.1 Định tuyến theo Spec
- **Spec yêu cầu**:
  - Route chính: `/admin/to-chuc?role=SUPPLIER`
  - Route alias: `/admin/nha-cung-ung` (chỉ chuyển hướng hoặc lọc `role=SUPPLIER`, không tạo bảng dữ liệu riêng).
- **Hiện trạng**: Hoàn toàn chưa có các route này trong hệ thống.

### 2.2 Các cột hiển thị trên bảng danh sách Admin (Admin Supplier List Columns)
| Cột theo Master Spec | Hiện trạng trong Code | Tình trạng |
| :--- | :--- | :--- |
| **Tên doanh nghiệp** | Có (`name`) | Đạt một phần (bị dính chuỗi ngành/tỉnh) |
| **Mã số thuế (Tax ID)** | Không hiển thị trên bảng Admin | **MISSING** |
| **Năng lực chính** | Chỉ hiện ngành nghề chung chung (`industry`) | **MISSING** |
| **Địa bàn phục vụ** | Chỉ hiện vị trí trụ sở (`loc`) | **MISSING** |
| **Độ hoàn thiện hồ sơ (Completeness %)** | Hoàn toàn không có | **MISSING** |
| **Khả năng nhận việc (Availability)** | Hoàn toàn không có | **MISSING** |
| **Trạng thái bằng chứng (Evidence Status)** | Hoàn toàn không có | **MISSING** |
| **Ngày cập nhật hồ sơ** | Chỉ có ngày đăng ký (`date`) | **MISSING** |
| **Người phụ trách (Owner / Sourcing Lead)** | Hoàn toàn không có | **MISSING** |
| **Trạng thái (Status)** | Chỉ có `Chờ duyệt` / `Đã duyệt` (nhị phân) | **MODIFY** |

### 2.3 Bộ lọc Quản trị (Admin Filters)
- **Spec yêu cầu**: Lọc theo Ngành (Category), Năng lực (Capability), Tỉnh/Thành (Province), KCN phục vụ, Khả năng nhận việc (Availability), % Hoàn thiện hồ sơ, Trạng thái bằng chứng (Evidence Status), Người phụ trách (Owner), Ngày cập nhật.
- **Hiện trạng**: Không có bộ lọc nào hoạt động trên bảng Admin.

### 2.4 Trạng thái hồ sơ Nhà cung ứng (Supplier Lifecycle Status)
- **Spec yêu cầu**:
  - `DRAFT`: Bản nháp, chưa hoàn thiện thông tin tối thiểu.
  - `PENDING_PROFILE`: Đang chờ điền bổ sung năng lực / sản phẩm.
  - `ACTIVE`: Đã công bố công khai trên sàn.
  - `NEEDS_UPDATE`: Thông tin quá hạn hoặc bằng chứng hết hạn cần cập nhật.
  - `SUSPENDED`: Tạm ngưng hoạt động / vi phạm.
  - `ARCHIVED`: Đã lưu trữ / đóng cửa.
  - *Lưu ý*: Không dùng trạng thái "VERIFIED" cho toàn bộ nhà cung ứng. Xác thực phải nằm ở cấp độ bằng chứng cụ thể.
- **Hiện trạng**: Chỉ có cờ nhị phân `isVerified: true/false` trong database và `Chờ duyệt / Đã duyệt` trên UI mock.

---

## 3. AUDIT TRANG CHI TIẾT NHÀ CUNG ỨNG TRONG ADMIN (`/admin/to-chuc/[id]?tab=supplier`)

### 3.1 Cấu trúc Tabs chi tiết theo Spec
Master Spec Page 05 quy định trang chi tiết nhà cung ứng trong Admin phải có 17 tabs chuyên sâu để đội điều phối chuỗi cung ứng thẩm định và vận hành:
1. **Tổng quan (Overview)**: Pháp nhân, mã số thuế, người đại diện, liên hệ, người phụ trách nội bộ.
2. **Năng lực (Capabilities)**: Danh sách năng lực cấu trúc, công suất/tháng, dải đơn hàng, thời gian giao hàng.
3. **Sản phẩm / Dịch vụ (Products/Services)**: Danh mục sản phẩm chi tiết, quy cách, catalogue đính kèm.
4. **Địa bàn phục vụ (Service Areas)**: Tỉnh/thành, quốc gia, loại hình phủ sóng.
5. **Cơ sở vật chất (Facilities)**: Trụ sở, Nhà xưởng 1, Nhà xưởng 2, Kho bãi, Trung tâm dịch vụ.
6. **Máy móc thiết bị (Machines)**: Danh sách máy móc công nghệ, xuất xứ, năm sản xuất.
7. **Chứng nhận (Certifications)**: Danh sách chứng chỉ (ISO, ESG, HACCP...) kèm ngày cấp/hết hạn.
8. **Bằng chứng (Evidence)**: Giấy phép kinh doanh, ảnh xưởng thực tế, video thẩm định, hồ sơ năng lực.
9. **Hình ảnh / Video (Media)**: Kho tư liệu media đã qua kiểm duyệt.
10. **Catalogue / Báo giá mẫu**: Tệp tài liệu kỹ thuật dành cho buyer.
11. **Nhu cầu đã nhận (Received Requirements)**: Lịch sử nhận lời mời chào thầu / matching từ các buyer.
12. **Khớp nối (Matching)**: Các kết quả đề xuất nguồn cung cho các nhu cầu B2B.
13. **Kết nối (Connections)**: Danh sách buyer đã kết nối qua CHAINY.
14. **Chương trình (Programs)**: Sự kiện Ngày hội chuỗi cung ứng, Expo, B2B matchmaking đã tham gia.
15. **Nhiệm vụ (Tasks)**: Việc cần làm của đội vận hành (gọi điện xác minh, xin bổ sung file, khảo sát xưởng).
16. **Dòng thời gian (Timeline)**: Lịch sử tương tác với nhà cung ứng.
17. **Nhật ký kiểm toán (Audit Log)**: Ghi vết ai sửa trường dữ liệu nào, vào thời điểm nào.

### 3.2 Hiện trạng trong Code
- **Hoàn toàn KHÔNG TỒN TẠI** trang chi tiết nhà cung ứng trong Admin (`src/pages/AdminEnterpriseDetailPage.jsx` hoặc route lồng tương đương không có).

---

## 4. AUDIT CÁC HÀNG ĐỢI VẬN HÀNH (OPERATIONAL QUEUES) TRONG ADMIN

Theo Master Spec, Admin cần các hàng đợi xử lý dữ liệu để đội Sourcing làm sạch và chuẩn hóa nguồn cung:
1. **Hàng đợi hồ sơ chưa hoàn thiện (Incomplete Profile Queue)**:
   - *Hiện trạng*: Không có.
   - *Spec*: Liệt kê các NCC thiếu khối trọng yếu (thiếu năng lực chính, thiếu MOQ, thiếu lead time).
2. **Hàng đợi bằng chứng cần duyệt / đối chiếu (Evidence Review Queue)**:
   - *Hiện trạng*: Không có.
   - *Spec*: Admin duyệt các claim của doanh nghiệp (`SELF_DECLARED` $\rightarrow$ `REVIEWED` $\rightarrow$ `CONFIRMED`).
3. **Hàng đợi bằng chứng hết hạn (Expired Evidence Queue)**:
   - *Hiện trạng*: Không có.
   - *Spec*: Cảnh báo chứng chỉ ISO/HACCP đã quá hạn để gửi yêu cầu cập nhật.
4. **Hàng đợi kiểm tra khả năng nhận việc (Availability Stale Queue)**:
   - *Hiện trạng*: Không có.
   - *Spec*: Nếu `availabilityCheckedAt` quá 30–60 ngày, đưa vào queue để đội điều phối gọi điện xác nhận lại.
5. **Hàng đợi trùng lặp dữ liệu (Duplicate Detection Queue)**:
   - *Hiện trạng*: Không có.
   - *Spec*: Khi tạo hoặc import NCC, kiểm tra trùng MST, tên miền, hotline, tên pháp nhân. Nếu trùng, gán thêm role `SUPPLIER` vào `Organization` cũ thay vì tạo doanh nghiệp rác mới.

---

## 5. AUDIT QUY TRÌNH MATCHING & SHORTLIST TRONG ADMIN

### 5.1 Quy trình ghép nối nhà cung ứng từ Nhu cầu mua sắm (`Admin Need Detail`)
- **Spec yêu cầu**:
  - Từ chi tiết Nhu cầu mua sắm của Buyer (Page 04), Admin có nút: *"Tìm thêm nhà cung ứng"* $\rightarrow$ Mở công cụ tìm kiếm nhà cung ứng dùng chung `SupplierSearchService` trong ngữ cảnh của Requirement đó.
  - Hệ thống gợi ý 10–20 ứng viên kèm giải thích mức độ phù hợp (`MATCH`, `PARTIAL`, `UNKNOWN`, `MISMATCH`).
  - Admin chọn ra 3–5 nhà cung ứng phù hợp nhất để **Shortlist** $\rightarrow$ Tạo bản ghi trong bảng `supplier_matches` (lưu `requirementId`, `supplierId`, điểm, lý do, trạng thái).
  - Nếu loại bỏ (Reject) một ứng viên được đề xuất, Admin phải nhập lý do bắt buộc: `OUT_OF_AREA`, `CAPACITY`, `LEAD_TIME`, `CERTIFICATION`, `TECHNICAL`, `NO_RESPONSE`, `DATA_INSUFFICIENT`, `OTHER`.
- **Hiện trạng trong Code**:
  - Hoàn toàn chưa có liên kết giữa Admin Nhu cầu và Admin Nhà cung ứng.
  - Bảng `supplier_matches` chưa tồn tại trong cơ sở dữ liệu.

---

## 6. DANH MỤC PHÂN LOẠI: KEEP - MODIFY - MISSING - DUPLICATE - RISK

### 6.1 KEEP (Giữ lại & Tái sử dụng)
- Tông màu quản trị xanh đậm `#072847` và bộ khung layout sidebar + header của `AdminDashboardPage.jsx`.
- Iconography từ thư viện `lucide-react`.

### 6.2 MODIFY (Cần sửa đổi & Chuẩn hóa)
- **Khai báo Route Admin**: Cần đăng ký chính thức các route `/admin`, `/admin/to-chuc`, `/admin/nha-cung-ung` trong `src/App.jsx`.
- **Cấu trúc Menu Sidebar**: Thay mục chung `Doanh nghiệp` thành `Tổ chức & Doanh nghiệp` với bộ lọc role `SUPPLIER` hoặc alias `Nhà cung ứng`.
- **Bảng danh sách Admin**: Mở rộng từ 5 cột cơ bản thành 10 cột dữ liệu vận hành thực tế (MST, Năng lực, Địa bàn, % Hoàn thiện, Khả năng nhận việc, Trạng thái bằng chứng, Owner, Ngày cập nhật).

### 6.3 MISSING (Cần xây mới hoàn toàn)
- **API Admin**: Chưa có các endpoint quản trị:
  - `GET /api/admin/suppliers` (tìm kiếm, lọc theo nhiều tiêu chí).
  - `PATCH /api/admin/suppliers/:id` (cập nhật trạng thái, phân công owner).
  - `POST /api/admin/suppliers/:id/capabilities` (thêm/sửa năng lực).
  - `POST /api/admin/suppliers/:id/evidence` (thêm/duyệt bằng chứng).
- **Giao diện Chi tiết Nhà cung ứng lồng Tab (Admin Supplier Detail)**: 17 tabs quản trị chuyên sâu.
- **Hàng đợi kiểm duyệt bằng chứng (Claim / Evidence Review Queue)**.
- **Công cụ kiểm tra trùng lặp (Duplicate Checker)** trước khi tạo tổ chức mới.
- **Công cụ Shortlist & Ghi nhận lý do từ chối (Supplier Matcher & Rejection Logger)** cho Admin.
- **Nhật ký hoạt động (Audit Trail Log)** ghi nhận mọi thao tác sửa đổi dữ liệu hồ sơ.

### 6.4 DUPLICATE (Trùng lặp cần dọn dẹp)
- Menu `Doanh nghiệp`, `Khu công nghiệp`, `Nhà máy`, `Hội / Hiệp hội` hiện đang được coi là các thực thể quản trị hoàn toàn riêng biệt. Cần quy tụ về một trang quản trị Tổ chức (`/admin/to-chuc`) với bộ lọc vai trò (`role=SUPPLIER`, `role=FACTORY`, `role=ASSOCIATION`, `role=PARK_DEVELOPER`).

### 6.5 RISK (Rủi ro kỹ thuật & Nghiệp vụ nghiêm trọng)
1. **Rủi ro Route không truy cập được**: Trang `/admin` chưa được nối vào `<Routes>`, khiến toàn bộ nỗ lực xây dựng Admin trước đây không thể tiếp cận được từ trình duyệt.
2. **Rủi ro dữ liệu giả lập & Mất an toàn**: Toàn bộ thao tác duyệt hiện tại chỉ tác động lên bộ nhớ tạm của trình duyệt, không có kiểm tra phân quyền (RBAC) và không lưu vào cơ sở dữ liệu.
3. **Rủi ro duyệt tổng thể thay vì kiểm chứng từng bằng chứng**: Gán nhãn "Đã duyệt" cho toàn bộ doanh nghiệp khi mới chỉ nhìn thấy tên công ty và số điện thoại, vi phạm nguyên tắc xác minh theo từng bằng chứng cụ thể của CCU.

---

## 7. KẾT LUẬN & ĐỀ XUẤT CHO CÁC PROMPT TIẾP THEO
- Báo cáo này đã chỉ rõ: Phân hệ Admin Quản trị Nhà cung ứng hiện tại mới chỉ là bản demo giao diện tĩnh (mockup), chưa có dữ liệu thật và chưa được cấu hình định tuyến.
- Bước tiếp theo (**PROMPT 05-02**) phải thiết lập nền tảng dữ liệu vững chắc: Chuẩn hóa `Organization` làm Master Entity, xây dựng các bảng phụ trợ `SupplierProfile`, `Capability`, `ProductService`, `SupplierServiceArea`, `Evidence`, `DataClaim` và chuẩn bị các migration an toàn.
- Báo cáo hoàn thành yêu cầu kiểm toán của **PROMPT 05-01**.
