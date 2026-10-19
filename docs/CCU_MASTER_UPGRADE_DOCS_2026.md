# CHUỖI CUNG ỨNG (CHUOICUNGUNG.COM) — BÁO CÁO NÂNG CẤP VÀ SO SÁNH PHIÊN BẢN (MASTER CHANGELOG & SYSTEM SPECIFICATION)

> **Dự án**: Cổng Thông Tin & Nền Tảng Kết Nối Chuỗi Cung Ứng Công Nghiệp Việt Nam (CHUOICUNGUNG.COM)  
> **Tài liệu đối chiếu**: Bản ban đầu trên Git (Baseline Repo) vs Bản mới nhất hiện tại (Current Master Release)  
> **Thời điểm xuất báo cáo**: 17/10/2026  
> **Môi trường thử nghiệm**: Localhost:3000 (Frontend Vite) & Localhost:5050 (Backend Express)  
> **Môi trường sản xuất**: `https://chuoicungung.com` (Hosting iNET & Supabase Cloud PostgreSQL)

---

## I. TỔNG QUAN CHIẾN LƯỢC & QUY MÔ THAY ĐỔI

Phiên bản mới nhất của **CHUOICUNGUNG.COM** đánh dấu bước chuyển đổi mang tính cách mạng từ một website giới thiệu danh mục seed ban đầu sang một **Nền tảng Dữ liệu Siêu quy mô (Big Data Sourcing Platform)** phục vụ kết nối B2B thực chất giữa **Nhà mua hàng (Buyers) — Nhà cung cấp phụ trợ (Suppliers) — Nhà máy — Khu công nghiệp (KCN)**.

### Những bước nhảy vọt quan trọng nhất:
1. **Dữ liệu thực tế 150.000+ Nhà cung ứng**: Mở rộng từ vài trăm bản ghi seed ban đầu lên hơn **152.623 doanh nghiệp thật** trên 63 tỉnh thành Việt Nam, phân bổ chuẩn xác theo **6 Giai đoạn (6 Stages)** và **18 Phân đoạn (18 Phases)** của chuỗi cung ứng công nghiệp.
2. **Đồng bộ 100% lên Cloud Supabase**: Toàn bộ dữ liệu 152.623 doanh nghiệp đã được ingest và đồng bộ thành công lên bảng `enterprises` của Supabase Cloud (`fcllkddudeslshqwldeb.supabase.co`), nâng tổng số bản ghi quản lý đạt **174.278 doanh nghiệp**.
3. **Chuẩn hóa Truyền thông & Bảo vệ Thương hiệu (Media Masking)**: 100% liên kết hình ảnh, logo, avatar được chuyển đổi sang cơ chế Proxy nội bộ (`/api/media/...`), xóa bỏ hoàn toàn mọi tên miền hoặc dấu vết nguồn gốc bên thứ ba trong toàn bộ hệ thống code và cơ sở dữ liệu.
4. **Quy chuẩn hiển thị Ảnh & Logo chân thực (Anti-Placeholder Policy)**: Triệt để xóa bỏ các hình ảnh stock photo Unsplash giả lập hoặc ảnh chèn ép sai lệch. Doanh nghiệp không có ảnh được để trống sạch sẽ (`images: []`, `avatar: ""`); logo trống hiển thị Monogram ký tự tên sang trọng; khối sản phẩm trống hiển thị trạng thái tinh tế.
5. **Khắc phục triệt để lỗi ảnh trên Web Thật (iNET Hosting Solution)**: Xây dựng bộ cầu nối PHP chuyên dụng ([api-media.php](file:///Users/heymac/Documents/hchivi/CODE/CCU/public/api-media.php) & [api-enterprises.php](file:///Users/heymac/Documents/hchivi/CODE/CCU/public/api-enterprises.php)) cùng cấu hình [.htaccess](file:///Users/heymac/Documents/hchivi/CODE/CCU/public/.htaccess), khắc phục lỗi rewrite SPA trên hosting Apache iNET, giúp web thật load ảnh siêu mượt và tìm kiếm 150.000+ dữ liệu thời gian thực.
6. **Độ ổn định & Kiểm thử toàn diện**: Toàn bộ **179/179 bài test tự động** đều vượt qua (`npm test`), bản build tối ưu hóa trong ~8 giây.

---

## II. BẢNG SO SÁNH TỔNG HỢP (GIT BASELINE VS CURRENT MASTER)

| Hạng mục đối chiếu | Phiên bản cũ trên Git (Baseline) | Phiên bản mới nhất hiện tại (Current Master Release) |
| :--- | :--- | :--- |
| **Quy mô Dữ liệu Doanh nghiệp** | ~1.000 doanh nghiệp mẫu (seed/mock data) chứa trong các file JSON tĩnh cục bộ. | **152.623 doanh nghiệp thực tế** đã crawl, chuẩn hóa, phân loại theo 6 Giai đoạn & 18 Phân đoạn; lưu trữ trên SQLite đánh index và **100% đã đồng bộ lên Supabase Cloud** (tổng 174.278 bản ghi). |
| **Nguồn cấp & Proxy Hình ảnh** | Liên kết trực tiếp tới các URL bên thứ 3; dễ bị chặn hotlink, lộ tên miền nguồn; thường dùng ảnh stock Unsplash chèn ngẫu nhiên. | **100% chuyển đổi sang URL Proxy nội bộ (`/api/media/...`)**; xóa bỏ hoàn toàn ảnh stock rác; doanh nghiệp không có ảnh để trống hoàn toàn; logo trống thay bằng **Monogram Badge** thương hiệu. |
| **Khả năng chạy trên Web Thật (iNET)** | Web thật chỉ chạy file tĩnh; gọi `/api/enterprises` hoặc `/api/media` bị lỗi trả về `index.html`, khiến **ảnh bị vỡ (broken) và không tìm kiếm được dữ liệu**. | **Hoàn tất bộ cầu nối PHP cho iNET hosting**: `api-media.php` stream ảnh trực tiếp có cache dài hạn; `api-enterprises.php` truy vấn Supabase Cloud tốc độ cao; định tuyến thông minh qua `.htaccess`. |
| **Trang Chi Tiết Doanh Nghiệp** | Giao diện cũ đơn giản; phát sinh lỗi `ReferenceError: ImageOff is not defined` khi gặp doanh nghiệp không có ảnh; gallery hiển thị ảnh giả. | **Sửa dứt điểm lỗi crash `ImageOff`**; hiển thị Monogram động theo chữ cái đầu; khối trống tinh gọn; gallery phân nhóm danh mục; hiển thị hồ sơ năng lực sản xuất (diện tích, sản lượng, khách hàng B2B). |
| **Trang Danh Bạ Nhà Cung Ứng** | Chỉ tìm kiếm và lọc trên mảng cục bộ ~50 doanh nghiệp; lọc chữ cái hay bị trùng lặp; phân trang tĩnh. | **Tìm kiếm Remote Search trực tiếp trên 150.000+ doanh nghiệp**: Tìm kiếm từ khóa tiếng Việt bỏ dấu; lọc đa chiều (6 Stages, 18 Phases, 63 Tỉnh thành, chữ cái A-Z, KYC); danh thiếp B2B bảo mật số điện thoại. |
| **Sự Kiện KCN Thái Hòa (Business Matching)** | Chỉ có ý tưởng văn bản thô hoặc chưa có phân hệ riêng. | **Cụm tính năng sự kiện hoàn chỉnh**: Trang đích Landing Page, Dashboard giám sát trực tiếp (Live Event), Danh sách đại biểu tham gia đã duyệt (Confirmed Participants), Báo cáo tổng kết sau sự kiện. |
| **Xác thực & Quản lý Tài khoản (Auth & RBAC)** | Giả lập đăng nhập qua localStorage; chưa có phân quyền doanh nghiệp; thiếu bảo mật thông tin liên hệ. | **Tích hợp Zalo OAuth v4 & Google SSO**; Hệ thống phân quyền tổ chức RBAC đa cấp độ (Admin, Member, Buyer, Supplier); lưu trữ an toàn trên Supabase Auth; cơ chế bảo vệ liên hệ riêng tư. |
| **Trợ Lý AI SUPPI & CHAINY** | Dùng endpoint MongoDB cũ đã lỗi thời hoặc gọi mô hình đơn lẻ không có kiểm soát chi phí. | **Nâng cấp Google Gemini 2.5 Flash & 1.5 Lite**: Cơ chế định tuyến thông minh (Deterministic Routing) tiết kiệm token; Function Calling chuẩn xác tra cứu danh bạ doanh nghiệp thật; cấm bịa đặt thông tin. |
| **Bản đồ GIS & Hạ tầng KCN** | Bản đồ tĩnh hoặc iframe rời rạc. | **Bản đồ số KCN tương tác cao (Leaflet GIS)**: Định vị 480+ KCN và 14.000+ Nhà máy, lọc theo 3 miền Bắc - Trung - Nam và theo từng tỉnh thành. |
| **Chất lượng Kiểm thử (Test Suite)** | Khoảng 100 tests cơ bản. | **179/179 Unit & Integration Tests đạt Pass 100%**: Kiểm thử toàn diện API, Media Proxy, RLS Supabase, phân quyền tổ chức và tìm kiếm tiếng Việt. |

---

## III. CHI TIẾT CÁC HẠNG MỤC NÂNG CẤP VÀ TÍNH NĂNG MỚI

### 1. Hệ Thống Dữ Liệu 150.000+ Nhà Cung Ứng & Đồng Bộ Supabase Cloud
* **Thu thập & Cấu trúc hóa**:
  * Tinh lọc dữ liệu của **152.623 doanh nghiệp Việt Nam** với đầy đủ các trường: Tên doanh nghiệp (`name`), Tên viết tắt (`cleanName`), Mã số thuế (`taxCode`), Địa chỉ (`address`), Tỉnh/Thành phố (`province`), Số điện thoại (`phone`), Email (`email`), Website (`website`), Danh mục ngành nghề (`category`), Sản phẩm chính (`products`), Mô tả năng lực (`description`), Quy mô nhân sự (`employees`), Năm thành lập (`establishedYear`), Loại hình kinh doanh (`businessType`).
  * Gắn nhãn phân loại theo đúng khung chuẩn 6 Giai đoạn vòng đời nhà xưởng và 18 Phân đoạn kỹ thuật công nghiệp.
* **Cơ sở dữ liệu SQLite tối ưu (`suppliers150k.db`)**:
  * Đánh chỉ mục (INDEX) trên các trường quan trọng: `name`, `cleanName`, `category`, `province`, `stage`, `phase`, `phaseLetter`.
  * Truy vấn tìm kiếm và phân trang chỉ mất từ 3ms – 15ms cho kho dữ liệu 150.000+ dòng.
* **Đồng bộ hóa 100% lên Supabase Cloud**:
  * Đã thực thi script tải lên additive thông minh qua `upload150kToSupabase.js`, hoàn tất đồng bộ 152.623 bản ghi vào bảng `enterprises` của Supabase.
  * Tổng số lượng bản ghi trong database cloud hiện tại là **174.278 bản ghi**, sẵn sàng phục vụ quy mô truy cập lớn trên toàn quốc.

### 2. Chuẩn Hóa Bảo Mật Hình Ảnh (Media Proxy) & Xóa Bỏ Dấu Vết Bên Thứ 3
* **Cơ chế che dấu nguồn dữ liệu (Masking Engine)**:
  * Toàn bộ các đường dẫn ảnh gốc trước đây được tự động chuyển đổi sang cấu trúc URL nội bộ:
    `/api/media/{subdomain}/{encodedPath}`
  * Ví dụ: `/api/media/pic/395694993/1-ao-thun-dong-phuc.jpg` hoặc `/api/media/logo/L39575011300-1.gif`.
  * Triệt để loại bỏ mọi từ khóa, tên miền hay nhãn hiệu cào dữ liệu của bên thứ ba trong toàn bộ mã nguồn frontend, backend và database.
* **Quy chuẩn hiển thị Ảnh chân thực (No Placeholder / No Fake Stock)**:
  * Loại bỏ hoàn toàn hơn 130 dòng code chứa danh sách ảnh stock Unsplash ngẫu nhiên và ảnh banner rác trong [companyUtils.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/utils/companyUtils.js).
  * Doanh nghiệp nào không có ảnh thực tế thì trường `images` trả về mảng rỗng `[]`, trường `avatar` và `logo` trả về chuỗi rỗng `""`.
  * Đối với logo rỗng: Tự động tạo huy hiệu chữ lồng (**Monogram**) từ chữ cái đầu của doanh nghiệp kết hợp gradient màu sắc thương hiệu sang trọng.
  * Đối với bộ sưu tập ảnh rỗng: Hiển thị thông báo trạng thái văn minh: *"Doanh nghiệp chưa cập nhật hình ảnh sản phẩm"*.

### 3. Giải Pháp Triển Khai Hoàn Chỉnh Cho Web Thật (Hosting iNET)
* **Khắc phục lỗi vỡ ảnh và mất kết nối dữ liệu**:
  * Trước đây, website đưa lên hosting tĩnh Apache tại iNET không có server Node.js chạy ngầm, khiến mọi request `/api/media/...` và `/api/enterprises/...` bị rewrite về `index.html`.
* **Cầu nối API Media Proxy PHP ([public/api-media.php](file:///Users/heymac/Documents/hchivi/CODE/CCU/public/api-media.php))**:
  * Tự động tiếp nhận các request `/api/media/...`, mã hóa URL an toàn, dùng cURL kéo ảnh từ nguồn về máy chủ và stream dữ liệu nhị phân trực tiếp cho trình duyệt.
  * Bổ sung đầy đủ header tối ưu hiệu năng: `Content-Type`, `Cache-Control: public, max-age=2592000, immutable`, `X-Content-Type-Options: nosniff`.
  * Trường hợp ảnh gốc bị lỗi hoặc 404, tự động trả về ảnh GIF trong suốt 1x1 pixel để không bao giờ làm vỡ khung giao diện.
* **Cầu nối API Doanh Nghiệp PHP ([public/api-enterprises.php](file:///Users/heymac/Documents/hchivi/CODE/CCU/public/api-enterprises.php))**:
  * Kết nối trực tiếp từ máy chủ hosting iNET đến kho dữ liệu Supabase Cloud qua giao thức bảo mật.
  * Hỗ trợ tìm kiếm từ khóa (`q`), lọc tỉnh thành (`province`), ngành nghề (`category`), chữ cái (`letter`), giai đoạn (`stage`), phân đoạn (`phase`) và phân trang (`page`, `limit`).
  * Trả dữ liệu JSON chuẩn xác cho frontend.
* **Cập nhật định tuyến [.htaccess](file:///Users/heymac/Documents/hchivi/CODE/CCU/public/.htaccess)**:
  * Thêm các luật rewrite ưu tiên chuyển hướng các request `/api/media` và `/api/enterprises` vào các bộ xử lý PHP tương ứng trước khi định tuyến về `index.html`.
* **Đóng gói sẵn 2 gói triển khai**:
  * [deploy_update.zip](file:///Users/heymac/Documents/hchivi/CODE/CCU/deploy_update.zip) (~31 MB): Bản cập nhật siêu nhẹ gồm code frontend mới, file `.htaccess` và các file API PHP, upload giải nén mất vài giây.
  * [deploy_inet.zip](file:///Users/heymac/Documents/hchivi/CODE/CCU/deploy_inet.zip) (~627 MB): Bản đầy đủ chứa toàn bộ video, catalogue và tài nguyên tĩnh.

### 4. Nâng Cấp Trang Chi Tiết Doanh Nghiệp ([EnterpriseDetailPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/EnterpriseDetailPage.jsx))
* **Sửa lỗi crash màn hình**: Bổ sung khai báo import `ImageOff` từ thư viện `lucide-react`, loại bỏ lỗi `ReferenceError: ImageOff is not defined`.
* **Hồ sơ năng lực chuẩn B2B**:
  * Hiển thị đầy đủ thông tin pháp lý, mã số thuế, địa chỉ trụ sở, số điện thoại, email, website.
  * Huy hiệu định danh KYC (Kim Cương / Vàng / Bạc) xác thực mức độ tin cậy của nhà cung ứng.
  * Khối tổng hợp hồ sơ năng lực sản xuất (Synthesized Profile) với 3 đoạn văn giới thiệu chi tiết, diện tích nhà xưởng, sản lượng hàng tháng, thị trường xuất khẩu và thương hiệu đối tác.
* **Bộ sưu tập ảnh sản phẩm phân nhóm**:
  * Tự động gom nhóm hình ảnh theo từng chủng loại sản phẩm có vạch đứng tone xanh thương hiệu CCU (`#0052cc`).
  * Nếu doanh nghiệp chưa có ảnh, hiển thị khung nét đứt kèm icon và hướng dẫn doanh nghiệp cập nhật hồ sơ.
* **Tương tác kết nối**: Nút mở modal gửi yêu cầu báo giá (Request Quote), lưu doanh nghiệp (Bookmark), chia sẻ hồ sơ (Share), tải danh thiếp điện tử (VCF).

### 5. Nâng Cấp Trang Danh Bạ Nhà Cung Ứng ([EnterprisesPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/EnterprisesPage.jsx))
* **Tìm kiếm từ khóa thông minh**: Bóc tách token tìm kiếm không dấu (`normalizeSearch`), tìm kiếm đồng thời trên tên công ty, ngành nghề, sản phẩm chính, địa chỉ và mã số thuế.
* **Hệ thống lọc đa chiều**:
  * 6 Giai đoạn (Stages 1 to 6) từ khảo sát đầu tư đến vận hành sản xuất và chuyển đổi xanh.
  * 18 Phân đoạn kỹ thuật chuyên sâu (Phases 1.1 đến 6.3).
  * 63 Tỉnh thành phố trên toàn quốc.
  * Bảng chữ cái Latinh 24 ký tự A-Z.
  * Lọc theo tiêu chuẩn chất lượng: ISO, HACCP, GMP, FDA, CE, RoHS, ESG.
* **Thẻ hiển thị danh bạ ([SupplierDirectoryCard.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/suppliers/SupplierDirectoryCard.jsx))**:
  * Hiển thị logo/monogram sắc nét, nhãn phân đoạn chuỗi cung ứng, sản phẩm tiêu biểu.
  * Ẩn số điện thoại (`0987***123`) chống nạn quét cào data rác, người dùng bấm vào mới hiển thị đầy đủ số để liên hệ.
  * Nút "Gửi nhu cầu" kết nối trực tiếp với form yêu cầu báo giá.

### 6. Cụm Tính Năng Sự Kiện Kết Nối KCN Thái Hòa (Business Matching)
* **Trang giới thiệu sự kiện ([ThaiHoaEventLandingPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/ThaiHoaEventLandingPage.jsx))**: Giới thiệu chương trình kết nối giao thương B2B, quy mô nhà máy, sơ đồ gian hàng và lịch trình làm việc.
* **Giám sát sự kiện trực tiếp ([ThaiHoaLiveEventDashboard.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/programs/ThaiHoaLiveEventDashboard.jsx))**: Cập nhật realtime số lượng cuộc gặp gỡ, bàn đàm phán đang hoạt động, tiến độ kết nối giữa các đơn vị mua và bán.
* **Danh sách đại biểu đã xác nhận ([ThaiHoaConfirmedParticipants.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/programs/ThaiHoaConfirmedParticipants.jsx))**: Danh sách doanh nghiệp mua hàng lớn (THIP Buyers) và nhà cung ứng đã qua thẩm định hồ sơ tham dự.
* **Báo cáo tổng kết sau sự kiện ([ThaiHoaPostEventDashboard.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/programs/ThaiHoaPostEventDashboard.jsx))**: Thống kê số lượng biên bản ghi nhớ (MOU) đã ký, tổng giá trị hợp đồng kết nối dự kiến và phản hồi đánh giá của doanh nghiệp.

### 7. Phân Quyền Tổ Chức & Xác Thực Người Dùng (Auth & User Settings)
* **Đăng nhập mạng xã hội**: Tích hợp Zalo OAuth v4 chính thức cho thị trường Việt Nam cùng Google Sign-In.
* **Phân quyền doanh nghiệp RBAC ([OrganizationSettings.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/auth/OrganizationSettings.jsx))**:
  * Tách biệt quyền hạn quản trị: `Owner`, `Admin`, `Member`, `Viewer`.
  * Cơ chế bảo vệ thông tin liên hệ: Chỉ những tài khoản đã xác thực và được cấp quyền mới có thể xem thông tin liên hệ chi tiết của đối tác.

### 8. Trợ Lý AI SUPPI & CHAINY (Google Gemini AI)
* **Kết nối mô hình thế hệ mới**: Ứng dụng Google Gemini 2.5 Flash và 1.5 Lite.
* **Định tuyến mô hình (Model Routing)**: Các câu hỏi chào hỏi hoặc tra cứu cơ bản được xử lý bằng tầng Lite để tiết kiệm tài nguyên; các tác vụ phân tích chuỗi cung ứng phức tạp, so sánh báo giá, lập hồ sơ RFQ được tự động chuyển lên tầng Flash.
* **Không bịa đặt thông tin (Grounded AI)**: Trợ lý AI chỉ trả lời dựa trên kho dữ liệu thực tế của CCU qua cơ chế Function Calling được kiểm soát chặt chẽ.

### 9. Bản Đồ Số KCN & GIS Toàn Quốc ([KcnGisMap.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/kcn/KcnGisMap.jsx))
* Tích hợp thư viện Leaflet tương tác mượt mà.
* Bản đồ định vị **480+ Khu công nghiệp** và **14.000+ Nhà máy** trên 63 tỉnh thành, hỗ trợ lọc nhanh theo vùng kinh tế trọng điểm.

### 10. Hệ Thống Kiểm Thử & Hiệu Năng (Test & Performance)
* **179/179 Test Cases Passed**:
  * Kiểm thử định tuyến AI, Media Proxy endpoint, Supabase RLS security policies, RBAC organization permissions, tìm kiếm tiếng Việt và phân trang.
* **Tối ưu tốc độ tải**: Áp dụng code splitting, nén gzip, thời gian build toàn bộ ứng dụng chỉ mất ~8 giây.

---

## IV. HƯỚNG DẪN TRIỂN KHAI VÀ VẬN HÀNH

### 1. Chạy trên môi trường Local:
```bash
cd /Users/heymac/Documents/hchivi/CODE/CCU
# Khởi động đồng thời cả frontend Vite (port 3000) và backend API (port 5050)
npm run dev
```

### 2. Triển khai lên môi trường Live (Hosting iNET):
1. Chạy lệnh đóng gói bản cập nhật:
   ```bash
   npm run build:zip:update
   ```
2. Truy cập cPanel hosting iNET > **File Manager** > vào thư mục `public_html`.
3. Tải file `deploy_update.zip` (hoặc `deploy_inet.zip`) lên và chọn **Extract (Giải nén đè)**.
4. Website `https://chuoicungung.com` sẽ lập tức tự động load ảnh ổn định và kết nối đầy đủ kho dữ liệu 150.000+ doanh nghiệp từ Supabase Cloud.
