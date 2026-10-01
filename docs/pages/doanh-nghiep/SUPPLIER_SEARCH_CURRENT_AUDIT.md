# BÁO CÁO AUDIT HIỆN TRẠNG — TRANG TÌM NHÀ CUNG ỨNG (`/doanh-nghiep`)
**Dự án**: CHUOICUNGUNG.COM  
**Trang**: Page 05 — `/doanh-nghiep` (Public Supplier Search & Matching Foundation)  
**Thời điểm thực hiện**: 28/09/2026  
**Phạm vi**: Đánh giá toàn diện hiện trạng route `/doanh-nghiep`, Supplier Card, Data Model Nhà cung cấp, Search Engine, Matching Engine và các rủi ro hệ thống.  
**Nguyên tắc thực hiện**: KHÔNG redesign, KHÔNG migration, KHÔNG can thiệp code ở bước này.

---

## 1. TỔNG QUAN ROUTE & COMPONENT HIỆN TẠI

### 1.1 Cấu hình Routing (`src/App.jsx`)
Hiện tại, route chính `/doanh-nghiep` và các URL alias liên quan được ánh xạ vào cùng component [src/pages/EnterprisesPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/EnterprisesPage.jsx):
- `/doanh-nghiep` -> `<EnterprisesPage />`
- `/doanh-nghiep/:id` -> `<EnterpriseDetailPage />`
- Alias: `/danh-ba-nha-cung-cap-xac-thuc`
- Alias: `/nha-cung-cap-xac-thuc`
- Alias: `/nha-cung-ung`

### 1.2 Định vị & Bản chất trang hiện tại
- **Hiện trạng**: Trang hiện tại là một **Directory tĩnh (Danh bạ doanh nghiệp)** hiển thị danh sách lớn, lọc theo chữ cái A-Z, 18 Pha kỹ thuật, tỉnh thành, và các nhãn tự sinh.
- **Khoảng cách so với Master Spec Page 05**:
  - Master Spec yêu cầu: Chuyển đổi thành **Supplier Search theo năng lực thực tế**, tập trung vào Nhu cầu $\rightarrow$ Năng lực $\rightarrow$ Địa bàn $\rightarrow$ Quy mô MOQ $\rightarrow$ Điều kiện nhận việc $\rightarrow$ Bằng chứng & Thông tin cần xác nhận.
  - Thực tế: Trang đang tải toàn bộ tệp JSON 47MB vào RAM trình duyệt của khách truy cập, lọc chuỗi thuần túy (string matching), chưa có cấu trúc Năng lực (Capability), chưa có Địa bàn phục vụ (Service Area), và chưa có Matching Engine theo ngữ cảnh Requirement (`?requirement=NC-...`).

---

## 2. AUDIT CHI TIẾT SUPPLIER CARD

### 2.1 Thành phần hiển thị trên Card hiện tại (`EnterprisesPage.jsx:1206-1428`)
1. **Logo / Avatar**: Ảnh logo hoặc monogram gradient tự sinh từ tên công ty.
2. **Tên doanh nghiệp**: Thường bị ghép thô với ngành và tỉnh (ví dụ: `Công Ty Cổ Phần Kỹ Thuật Hoàng Long - Báo Cáo Nghiên Cứu Khả Thi (FS) (Đồng Nai)`).
3. **Pha kỹ thuật**: Nhãn `Pha 1.1`, `Pha 4.1` dẫn link tới trang pha.
4. **Cấp độ KYC tự sinh**: Nhãn procedurally generated (`Kim Cương`, `Vàng`, `Bạc`) dựa trên độ dài dữ liệu và website, không có bằng chứng đối chiếu.
5. **Nút Bình chọn (+1)**: Bộ đếm lượt vote giả định (dùng hàm băm hash tên công ty `% 95` kết hợp localStorage).
6. **3 ảnh sản phẩm thu nhỏ**: Trích từ tệp hình ảnh cào dữ liệu hoặc ảnh placeholder Unsplash.
7. **Số điện thoại bị che & Nút liên hệ nhanh**:
   - Hiện số điện thoại dạng mask `0910***083`.
   - Nút gọi / chat Zalo / WhatsApp / Email / Website trực tiếp mà không cần đăng nhập hay tạo yêu cầu kết nối.
8. **Nút CTA**: "Báo giá" (mở modal đăng ký báo giá) và "Chi tiết" (chuyển sang `/doanh-nghiep/:id`).

### 2.2 Các yếu tố CÒN THIẾU theo Spec Page 05
- ❌ **Năng lực chính (Structured Capabilities)**: Không có trường năng lực cụ thể (công suất, máy móc, chủng loại).
- ❌ **Địa bàn phục vụ (Service Area)**: Hiện lấy địa chỉ trụ sở/nhà xưởng làm địa bàn phục vụ; không biết nhà cung ứng phục vụ được tỉnh nào, KCN nào.
- ❌ **Quy mô phù hợp (MOQ / Lot size / Order range)**: Hoàn toàn không có dữ liệu số lượng tối thiểu hoặc dải đơn hàng phù hợp.
- ❌ **Thời gian giao hàng (Lead time)**: Không có thông tin thời gian sản xuất / giao hàng.
- ❌ **Khả năng làm mẫu / Khảo sát thực địa**: Không có cờ `sampleAvailable`, `surveyAvailable`.
- ❌ **Ngày cập nhật hồ sơ & Độ tươi dữ liệu**: Không hiển thị ngày cập nhật hồ sơ (`updatedAt`, `availabilityCheckedAt`).
- ❌ **Khối "Thông tin cần xác nhận"**: Không có block chỉ ra những điểm còn thiếu dữ liệu (ví dụ: `? Lead time cần xác nhận`, `? Đúng chất liệu yêu cầu`).
- ❌ **Khối "Vì sao được đề xuất?" (Matching Context)**: Khi truy cập từ một nhu cầu mua sắm (`?requirement=NC-...`), card không hiển thị lý do khớp nối (Match Reasons).

### 2.3 Các yếu tố HIỂN THỊ SAI NGUYÊN TẮC
- ⚠️ **Lộ liên hệ trực tiếp trước khi buyer tạo nhu cầu**: Mở sẵn Zalo/WhatsApp/Hotline cào dữ liệu, khiến buyer rời nền tảng mà không tạo lead/yêu cầu có cấu trúc qua hệ thống CHAINY/SUPPI.
- ⚠️ **Hệ thống vote ảo & KYC giả định**: Dùng thuật toán băm (hash-based base votes) tạo số vote 18–110 và phân cấp KYC Kim Cương/Vàng tạo cảm giác uy tín ảo cho người dùng.

---

## 3. AUDIT DATA MODEL & DUPLICATE DOMAIN (ORGANIZATION VS SUPPLIER VS FACTORY)

### 3.1 Cấu trúc Model hiện tại trong Database (`server/models/Enterprise.js`)
```javascript
// Enterprise Schema hiện tại:
{
  id: Mixed,
  name: String,
  taxCode: String,
  representative: String,
  role: { type: String, default: 'Nhà cung ứng' },
  industry: String,
  stages: [Number],
  phases: [String],
  products: [String],
  location: String,
  province: String,
  verified: { type: Boolean, default: true },
  avatar: String,
  employees: String,
  establishedYear: Number,
  website: String,
  email: String,
  phone: String,
  description: String,
  certifications: [String],
  capacityRating: { type: Number, default: 5 }
}
```

### 3.2 Tình trạng trùng lặp thực thể (Duplicate Entities)
1. **Phân rã domain trái nguyên tắc "One Organization = Master"**:
   - `Enterprise` lưu doanh nghiệp nhà cung ứng (`enterprisesFull.json`: 21.680 bản ghi).
   - `Factory` lưu nhà máy sản xuất (`server/models/Factory.js` & `factoriesFull.json`: 14.237 bản ghi).
   - `IndustrialPark` lưu chủ đầu tư KCN (`industrialparksFull.json`: 480 bản ghi).
   - `Association` lưu hiệp hội ngành nghề (`associations.json`: 32 bản ghi).
2. **Hậu quả**: Một pháp nhân (ví dụ: Công ty Nhựa Bình Minh vừa là nhà máy tại KCN Sóng Thần, vừa là nhà cung ứng ống nhựa B2B, vừa là hội viên Hiệp hội Nhựa VPA) bị nhân bản thành 3 thực thể độc lập ở 3 bảng khác nhau với mã số thuế và tên trùng nhau, không liên kết được với nhau.

---

## 4. BẢNG AUDIT CÁC TRƯỜNG DỮ LIỆU (FIELD-BY-FIELD AUDIT)

| Trường dữ liệu Master Spec | Hiện trạng trong Code CCU | Đánh giá | Rủi ro / Khoảng cách |
| :--- | :--- | :--- | :--- |
| **Organization Identity** | `taxCode`, `name`, `representative` trong `Enterprise` | **MODIFY** | Tên bị nhiễm chuỗi phụ (gắn thêm tên ngành & tỉnh). MST nhiều bản ghi dạng giả lập (`0100000037`). |
| **Organization Roles** | `role: String` (mặc định `'Nhà cung ứng'`) | **MODIFY** | Cần chuyển thành mảng roles `['SUPPLIER', 'BUYER', 'FACTORY', ...]` liên kết với một `Organization`. |
| **Categories / Taxonomy** | `category`, `industry` (dạng text tự do) | **MODIFY** | Chưa gắn với Taxonomy chuẩn 6 Giai đoạn $\rightarrow$ Nhóm nhu cầu $\rightarrow$ Category $\rightarrow$ Product/Service. |
| **Capabilities (Năng lực)** | Chỉ có text chung trong `description` | **MISSING** | Thiếu hẳn bảng/collection `capabilities` (công suất, đơn vị tính, dải MOQ, lead time, trạng thái bằng chứng). |
| **Products / Services** | Mảng string `products: [String]` | **MISSING** | Thiếu bảng `products_services` có quy cách kỹ thuật (specs), MOQ, lead time, file catalogue, bằng chứng. |
| **Service Area (Địa bàn phục vụ)** | Chỉ có `province` (địa chỉ đặt trụ sở) | **MISSING** | Trụ sở ở TP.HCM bị coi là chỉ phục vụ TP.HCM, không khai báo được mạng lưới cung ứng liên tỉnh/toàn quốc. |
| **Industrial Park Coverage** | Chỉ có text đề cập trong `address` | **MISSING** | Thiếu liên kết chuẩn hóa `supplier_industrial_park_coverage` (danh sách KCN cam kết giao hàng/phục vụ). |
| **MOQ / Order Range** | Hoàn toàn không có trường dữ liệu | **MISSING** | Buyer không thể biết nhà cung ứng nhận đơn tối thiểu bao nhiêu (ví dụ: 100 bộ hay 10.000 bộ). |
| **Lead Time (Thời gian giao hàng)** | Hoàn toàn không có trường dữ liệu | **MISSING** | Không có thông tin ngày giao hàng tiêu chuẩn, thời gian làm mẫu. |
| **Availability (Khả năng nhận việc)** | Hoàn toàn không có trường dữ liệu | **MISSING** | Hệ thống mặc định mọi NCC đều đang sẵn sàng nhận việc; không có `availabilityStatus` hay ngày kiểm tra. |
| **Certifications** | Mảng string `certifications: [String]` | **MODIFY** | Chuỗi text tự do (ISO 9001, HACCP), không có ngày cấp, ngày hết hạn, tổ chức cấp hay tệp chứng chỉ đính kèm. |
| **Evidence (Bằng chứng)** | Hoàn toàn không có hệ thống bằng chứng | **MISSING** | Chưa có cấu trúc `evidence` với trạng thái (SELF_DECLARED, DOCUMENT_PROVIDED, REVIEWED, CONFIRMED, EXPIRED). |
| **Factory / Facility** | Nằm riêng biệt ở `Factory`, không liên kết | **DUPLICATE** | Dữ liệu nhà máy bị cô lập, không hiển thị được cơ sở sản xuất trên hồ sơ nhà cung ứng. |
| **Media Assets** | Mảng link `images: [String]` cào dữ liệu | **MODIFY** | Cần phân loại rõ: ảnh nhà xưởng, ảnh máy móc, ảnh sản phẩm, video kiểm tra thực địa. |
| **Updated Date / Freshness** | `timestamps` MongoDB, tệp JSON không có | **MISSING** | Không có ngày cập nhật hồ sơ công khai, buyer không thể đánh giá độ tin cậy của thông tin. |

---

## 5. AUDIT SEARCH ENGINE & MATCHING ENGINE

### 5.1 Tìm kiếm văn bản (Text Search)
- **Hiện trạng**: Thực hiện ở client-side bằng cách tách từ khóa người dùng (`searchTerm`) và so khớp substring với chuỗi gộp `_searchTokens`:
  ```javascript
  const tokens = `${e.name} ${e.category} ${e.industry} ${e.province} ${e.products.join(' ')} ${e.taxCode}`;
  return queryTokens.every(tok => tokens.includes(tok));
  ```
- **Hạn chế**:
  - Không có bộ phân tích ý định (Intent Detection). Khi người dùng nhập: `"đồng phục 500 công nhân Đồng Nai"`, hệ thống tìm các công ty có chứa đủ các từ đó trong tên hoặc mô tả, thay vì bóc tách:
    - `Category`: May mặc / Đồng phục công nhân
    - `Quantity`: 500
    - `Location`: Đồng Nai
    - `Intent`: Sourcing / Tìm nhà cung ứng
  - Nếu công ty may mặc ghi mô tả: "chuyên may đồng phục văn phòng, xưởng tại TP.HCM nhưng giao toàn quốc", câu lệnh tìm kiếm hiện tại sẽ loại bỏ vì không có chữ "Đồng Nai" trong tên hoặc địa chỉ.

### 5.2 Bộ lọc (Filters)
- **Bộ lọc hiện tại**:
  - Giai đoạn (Stage 1-6)
  - Pha kỹ thuật (Phase 1.1-6.3)
  - Tỉnh / Thành (63 tỉnh)
  - Danh mục (10 ngành chọn lọc)
  - Chữ cái A-Z
  - KYC level (`diamond`, `gold`, `silver`)
  - 3 checkbox công nghệ: Kết nối API, Báo giá 24h, ISO/ESG
- **Khoảng cách**:
  - Thiếu bộ lọc theo **Quy mô đơn hàng (MOQ)**.
  - Thiếu bộ lọc theo **KCN phục vụ**.
  - Thiếu bộ lọc theo **Khả năng làm mẫu / Khảo sát**.
  - Thiếu bộ lọc theo **Khả năng nhận việc hiện tại (Availability)**.
  - Bộ lọc hiện tại hiển thị tràn lan, chưa phân tách **Bộ lọc cơ bản** và **Bộ lọc nâng cao**.

### 5.3 Sắp xếp (Sorting)
- **Hiện trạng**: Cố định sắp xếp theo `totalVotes` giảm dần (số vote giả lập kết hợp localStorage):
  ```javascript
  filtered.sort((a, b) => totalB - totalA);
  ```
- **Hạn chế**: Hoàn toàn không hỗ trợ các tiêu chí sắp xếp thực tế của Buyer:
  - Liên quan nhất (Relevance)
  - Cập nhật gần đây nhất (Freshness)
  - Địa bàn phù hợp nhất (Service Area Fit)
  - Khả năng nhận việc (Availability Status)

### 5.4 Phân trang & Quản trị URL
- **Client pagination**: Tải 21.680 bản ghi vào bộ nhớ, sau đó cắt mảng `.slice((page-1)*24, page*24)`.
- **Query params**: Đồng bộ một số tham số (`q`, `phase`, `stage`, `province`, `category`, `kyc`, `letter`), nhưng chưa hỗ trợ SEO Canonical cho các trang chuyên mục và chưa hỗ trợ lưu trữ trạng thái tìm kiếm sâu.

### 5.5 Matching Engine
- **Hiện trạng**: **0% Matching Engine**.
- Khi có tham số nhu cầu (ví dụ `/doanh-nghiep?requirement=NC-2026-00125`), trang bỏ qua hoàn toàn tham số này, hiển thị kết quả chung như một khách vãng lai thông thường, không đối chiếu tiêu chí và không giải thích lý do đề xuất.

---

## 6. DANH MỤC PHÂN LOẠI: KEEP - MODIFY - MISSING - DUPLICATE - RISK

### 6.1 KEEP (Giữ lại & Tái sử dụng)
- Tên route chuẩn `/doanh-nghiep` và các alias URL hiện có.
- Cấu trúc layout 2 cột (Bộ lọc bên trái sticky + Grid kết quả bên phải) đã được người dùng quen thuộc.
- Thanh tìm kiếm lớn phong cách trực quan tại Hero section.
- Taxonomy 6 giai đoạn và 18 pha kỹ thuật làm trục liên kết logic toàn sàn.
- Modal yêu cầu báo giá nhanh và modal đăng ký nhà cung ứng (`SupplierRequestQuoteModal`, `SupplierRegistrationModal`).

### 6.2 MODIFY (Cần sửa đổi & Chuẩn hóa)
- **H1 & Định vị**: Đổi từ *"Danh Bạ Nhà Cung Cấp Xác Thực"* sang *"TÌM NHÀ CUNG ỨNG THEO NĂNG LỰC THỰC TẾ"* theo đúng Spec P0.
- **Supplier Card**:
  - Bỏ hiển thị số điện thoại trực tiếp và link chat ra ngoài nền tảng khi buyer chưa gửi yêu cầu có cấu trúc.
  - Bổ sung các block: Năng lực chính, Địa bàn phục vụ, Quy mô phù hợp (MOQ), Khả năng làm mẫu/xưởng, Ngày cập nhật hồ sơ.
  - Thêm block "Thông tin cần xác nhận" với các dấu chấm hỏi `?` minh bạch.
- **Bộ lọc**: Thu gọn các filter chuyên sâu vào nút "Bộ lọc nâng cao", bổ sung bộ lọc MOQ, KCN phục vụ, Khả năng nhận việc, Chứng nhận có bằng chứng.
- **Thuật toán sắp xếp**: Loại bỏ hoàn toàn sắp xếp theo base votes ảo; thay bằng: *Liên quan nhất*, *Cập nhật gần đây*, *Địa bàn phù hợp*.
- **Founding Partner**: Tách riêng ra block thương mại độc lập có nhãn rõ ràng ("Đối tác đồng hành chuyên mục"); không tự động đưa lên #1 kết quả tìm kiếm tự nhiên.

### 6.3 MISSING (Cần xây mới hoàn toàn)
- **SupplierProfile entity**: Mở rộng từ Organization, quản lý trạng thái nhận việc (`availabilityStatus`), ngày kiểm tra, điều kiện nhận đơn.
- **Capability entity**: Quản lý năng lực có cấu trúc (sản phẩm, công suất, dải đơn hàng, bằng chứng).
- **ProductService entity**: Danh mục sản phẩm/dịch vụ chi tiết của từng NCC.
- **SupplierServiceArea & IndustrialParkCoverage**: Bảng ánh xạ địa bàn và KCN phục vụ thực tế (tách biệt khỏi địa chỉ văn phòng).
- **Evidence Model**: Quản lý tài liệu bằng chứng (hồ sơ, giấy phép, ảnh xưởng, máy móc, chứng chỉ) kèm trạng thái xác thực rõ ràng.
- **SupplierSearchService & SupplierMatchingService**: Backend service tách biệt giữa Tìm kiếm ứng viên (Retrieval) và Đối chiếu với nhu cầu mua sắm (Matching).
- **Match Explanation Generator**: Khối "Vì sao được đề xuất?" (Khớp danh mục, Khớp địa bàn, Khớp MOQ, Cần xác nhận lead time).
- **Chế độ Hero Mode 2 (Requirement Context)**: Banner hiển thị ngữ cảnh nhu cầu khi buyer chuyển từ Workspace Sang.

### 6.4 DUPLICATE (Trùng lặp cần dọn dẹp)
- Thực thể doanh nghiệp bị phân mảnh giữa `Enterprise`, `Factory`, `IndustrialPark`: Phải quy tụ về Master Entity `Organization` có nhiều `roles`.
- Dữ liệu `enterprisesFull.json` (47MB) nằm song song giữa `src/data/` và `server/data/`: Cần đưa vào cơ sở dữ liệu và chỉ phục vụ qua API tìm kiếm phân trang.

### 6.5 RISK (Rủi ro kỹ thuật & Nghiệp vụ nghiêm trọng)
1. **Rủi ro hiệu năng nghiêm trọng (Performance Crash)**: File `enterprisesFull.json` nặng 47MB đang được import trực tiếp vào bundle frontend (`src/pages/EnterprisesPage.jsx:15`). Điều này làm dung lượng tải trang lần đầu cực lớn, gây đơ trình duyệt trên thiết bị di động yếu và vi phạm chuẩn SEO Core Web Vitals (LCP, INP).
2. **Rủi ro pháp lý & Uy tín thương hiệu (Fake Data & Ratings)**: Thuật toán tạo số vote ảo ngẫu nhiên và cấp huy hiệu KYC Kim Cương/Vàng giả định sẽ làm mất niềm tin của các Buyer công nghiệp, FDI và ban quản lý KCN.
3. **Rủi ro rò rỉ dữ liệu ngoài luồng (Lead Leakage)**: Việc công khai số điện thoại cào và link chat cá nhân ngay trên thẻ danh bạ khiến buyer bỏ qua hệ thống nhu cầu/báo giá, làm giảm giá trị của nền tảng và trợ lý SUPPI.
4. **Rủi ro không phân biệt được Địa chỉ văn phòng vs Địa bàn phục vụ**: Khiến hệ thống gợi ý sai nhà cung ứng cho các nhà máy tại các tỉnh xa.

---

## 7. KẾT LUẬN & ĐỀ XUẤT CHO PROMPT 05-02
- Hiện trạng trang `/doanh-nghiep` là một danh bạ phẳng, cồng kềnh, tải nặng và chứa nhiều dữ liệu giả định.
- Cần dứt khoát chuyển đổi sang mô hình dữ liệu chuẩn hóa đa tầng: `Organization` là Master Entity, mở rộng qua `SupplierProfile`, `Capability`, `ProductService`, `SupplierServiceArea` và `Evidence`.
- Toàn bộ kết quả tìm kiếm phải được chuyển giao về backend API phân trang (SSR/CSR kết hợp index chuẩn), loại bỏ hoàn toàn việc nạp file 47MB vào RAM client.
- Báo cáo này hoàn thành phạm vi **PROMPT 05-01** cho trang Public `/doanh-nghiep`. Tiếp tục đánh giá phần Admin tại [SUPPLIER_ADMIN_CURRENT_AUDIT.md](file:///Users/heymac/Documents/hchivi/CODE/CCU/docs/admin/SUPPLIER_ADMIN_CURRENT_AUDIT.md).
