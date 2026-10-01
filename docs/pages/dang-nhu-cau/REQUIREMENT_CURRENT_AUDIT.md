# BÁO CÁO AUDIT HIỆN TRẠNG /dang-nhu-cau (PAGE 03)
**Dự án:** CHUOICUNGUNG.COM  
**Trang:** 03 — ĐĂNG NHU CẦU B2B  
**Target Route:** `/dang-nhu-cau` (hỗ trợ `?draft={id}`)  
**Giai đoạn:** PROMPT 03-01 — AUDIT /dang-nhu-cau + ADMIN HIỆN TẠI (Chưa redesign, Chưa migration, Dừng lại sau Audit)  
**Thời gian thực hiện:** 28/09/2026  

---

## 1. Route `/dang-nhu-cau` hiện tại
- **Khai báo Router:** [src/App.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/App.jsx) (Line 269):
  ```jsx
  <Route path="/dang-nhu-cau" element={<PostDemandPage />} />
  ```
- **Component đảm nhiệm:** [src/pages/PostDemandPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/PostDemandPage.jsx) (1.406 dòng code).
- **Layout Wrapper:** Nằm trong `MainLayout` toàn cục, có thanh điều hướng `Navbar`, chân trang `Footer`, và widget mascot `SuppliMascot`.
- **Đánh giá khoảng cách với Spec (Mục 4 & 5):**
  - Spec yêu cầu giao diện desktop chia tỉ lệ: **65–70% Form Nhu Cầu** (bên trái) và **30–35% SUPPI Assistant Panel** (bên phải), header có nút quay lại `← Trợ lý Chuỗi Cung Ứng`.
  - Hiện tại trang đang dùng layout full-width 1 cột dài, chưa chia layout 2 cột đồng bộ với SUPPI panel.

---

## 2. Các Form & Sub-components hiện có trên Trang
Trang hiện tại chia làm 3 bước hiển thị (`currentStep`):
1. **Bước 1: Form Hoàn thiện thông tin (1.406 dòng code):**
   - Chứa 12 mục nhập liệu với hơn 15 trường thông tin:
     - Tên nhu cầu (`title`)
     - Sản phẩm / Dịch vụ (`productService`)
     - Số lượng (`quantity`) & Đơn vị (`unit`)
     - Địa bàn (`location`, `province`) & Khu công nghiệp (`kcn`, `industrialParkId`)
     - Thời gian cần hoàn thành (`deadline`)
     - Ngân sách tối thiểu / tối đa (`budgetMin`, `budgetMax`)
     - Yêu cầu mẫu thực tế (`sampleRequired`)
     - Yêu cầu khảo sát hiện trường (`surveyRequired`)
     - Tiêu chuẩn / Chứng chỉ bắt buộc (`certificationRequirements`)
     - Tiêu chí kỹ thuật chi tiết (`specifications`)
     - Ghi chú bổ sung (`notes`)
     - Thông tin liên hệ: Tên công ty (`companyName`), Người liên hệ (`contactName`), Điện thoại (`phone`), Email (`email`).
   - Hộp hỗ trợ nhanh: Modal `showSuppiAssistModal` với 4 preset ngành (Đồng phục, Thùng carton, Cơ khí CNC, Pallet gỗ).
   - Thanh tiến độ: `completeness` (30% – 100%) tính điểm theo số trường đã điền.
2. **Bước 2: Màn hình Xác nhận 11.3 (Review & Chọn quyền chia sẻ):**
   - Hiển thị lại toàn bộ thông tin đã nhập vào một thẻ tóm tắt.
   - Lựa chọn quyền chia sẻ (Visibility): `PRIVATE` (Riêng tư), `ONLY_MATCHED` (Chỉ NCC phù hợp - Mặc định), `PUBLIC` (Sàn Nhu Cầu).
3. **Bước 3: Màn hình Hoàn tất & Khởi động tìm nguồn:**
   - Thông báo tiếp nhận nhu cầu, hiển thị mã `#{formData.id}` và 3 nhà cung ứng sơ bộ được khớp lệnh mẫu.

### Điểm thiếu sót so với Spec Mục 2, 6, 7:
- **Thiếu Cửa vào 1 (Direct intake) theo ngôn ngữ tự nhiên:** Spec yêu cầu bắt đầu bằng Step 1: "BẠN ĐANG CẦN GÌ?" với ô Textarea mô tả tự nhiên + upload file để SUPPI trích xuất trước, sau đó mới sang form làm rõ chi tiết. Hiện tại trang nhảy ngay vào một form dài với hơn 15 trường input.
- **Chưa có tùy chọn "Tôi chưa xác định — Cần SUPPI hỗ trợ"** cho từng trường kỹ thuật khó (Spec Mục 10).

---

## 3. Luồng nạp dữ liệu từ Cửa vào 2 (`/tro-ly-ai?draft={id}`)
- `PostDemandPage.jsx` (Lines 66–129) đã có sẵn logic đọc tham số URL `searchParams.get('draft')`:
  - Tìm draft trong `localStorage` theo key `ccu_draft_{id}` hoặc `ccu_requirement_draft`.
  - Nếu tìm thấy, tự động map dữ liệu vào state `formData`: Tiêu đề, sản phẩm, số lượng, địa bàn, KCN, yêu cầu mẫu, tiêu chuẩn kỹ thuật, completeness score.
- **Đánh giá:** Luồng nạp draft từ SUPPI hoạt động mượt mà ở phía client, form được điền sẵn đầy đủ và không hỏi lại người dùng.

---

## 4. Điểm đến khi Form Submit & Cơ chế Lưu trữ
Khi người dùng bấm "XÁC NHẬN & BẮT ĐẦU TÌM NGUỒN" tại Bước 2 (`handleConfirmPublish`, Lines 250–305):
1. **Lưu trữ cục bộ:** Ghi đè vào `localStorage` (`ccu_requirement_draft`, `ccu_draft_{id}`, `ccu_user_demands`).
2. **Gọi API:** Gửi request HTTP `POST /api/demands` với JSON body tới server Express.
3. **Chuyển giao diện:** Chuyển ngay sang `currentStep = 3` (Hiển thị thẻ hoàn tất).
4. **Hạn chế nghiêm trọng:**
   - Không có xác thực Session hay Checksum từ phía server.
   - Chưa chuyển tiếp người dùng sang trang quản lý nhu cầu cá nhân `/tai-khoan/nhu-cau/[id]` theo spec.
   - Không tạo task, không gán người phụ trách (Owner), không đưa vào hàng đợi tiếp nhận của Admin Bàn điều phối.

---

## 5. Cơ sở Dữ liệu & Bảng nhận dữ liệu
- **Database Backend:** MongoDB thông qua Mongoose Model [server/models/Demand.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/server/models/Demand.js):
  ```javascript
  const demandSchema = new mongoose.Schema({
    title: { type: String, required: true },
    stageId: { type: Number, required: true },
    phaseId: { type: String, required: true },
    category: { type: String, required: true },
    authorName: { type: String, required: true },
    authorCompany: { type: String, required: true },
    authorEmail: { type: String, required: true },
    authorPhone: { type: String, required: true },
    location: { type: String, required: true },
    budget: { type: String },
    deadline: { type: String },
    requirements: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'closed'], default: 'approved' },
    responsesCount: { type: Number, default: 0 },
  }, { timestamps: true });
  ```
- **Xung đột cấu trúc dữ liệu:**
  1. `Demand.js` yêu cầu bắt buộc: `stageId`, `phaseId`, `category`, `requirements`. Trong khi form `PostDemandPage.jsx` gửi các trường: `specifications`, `productService`, `industrialParkId`, `sampleRequired`, `surveyRequired`, `visibility`.
  2. Trường `status`: Frontend gửi `ACTIVE_SOURCING`, trong khi Model MongoDB chỉ cho phép enum `['pending', 'approved', 'closed']`. Điều này dẫn đến **lỗi validation `MongooseError`** khi kết nối database thật.
  3. Chưa có các bảng phụ trợ theo Spec: `requirement_versions` (lưu lịch sử thay đổi số lượng/thông số), `requirement_attachments`, `consents`, `audit_logs`.

---

## 6. Đánh giá Validation Client / Server
- **Client-side:** Dùng thuộc tính HTML5 `required` trên các thẻ `<input>` (email, phone, contactName, productService). Có hiển thị viền vàng cam nhẹ (`border-amber-300`) cho các trường còn thiếu.
- **Server-side (Tại `server/routes/api.js` Line 454–465):**
  - **HOÀN TOÀN THIẾU VALIDATION PHÍA SERVER.**
  - Code chỉ thực hiện: `const newDemand = new Demand(req.body); await newDemand.save();`.
  - Không sanitize dữ liệu, không kiểm tra format email/số điện thoại, không kiểm tra độ dài văn bản, không chống spam/XSS.
  - Không có cơ chế Duplicate Detection (kiểm tra trùng lặp khi user bấm submit 2 lần liên tiếp).

---

## 7. Khảo sát Đính kèm Tập tin (File Upload)
- Trên giao diện `PostDemandPage.jsx`, mục đính kèm file đang sử dụng mảng tĩnh trong state:
  `attachedFiles: [{ name: 'Bang_thong_so_ky_thuat_DP.pdf', size: '1.4 MB' }]`.
- Chưa có input `<input type="file">` multipart/form-data kết nối với endpoint upload server (`/api/requirements/attachments`).
- Chưa có validation định dạng file an toàn (PDF, DOCX, XLSX, hình ảnh kỹ thuật) và giới hạn dung lượng file (< 25MB).

---

## 8. Khảo sát Luồng Xác thực (Login Flow)
- **Hiện trạng:** Người dùng với tư cách Khách (Guest) vẫn có thể điền toàn bộ form và bấm "Xác nhận & Bắt đầu tìm nguồn" thành công mà **không hề bị chặn để đăng nhập**.
- **Vi phạm Spec (Mục 19 & Tiêu chuẩn P0):**
  - Spec quy định: Guest được tự do mô tả và làm rõ nhu cầu, nhưng khi bấm nút "XÁC NHẬN & BẮT ĐẦU TÌM NGUỒN" tại Bước cuối, hệ thống **bắt buộc mở Modal đăng nhập / tạo tài khoản** để lưu nhu cầu vào tài khoản chính thức.
  - Sau khi login, người dùng phải được đưa trở lại chính xác màn hình Xác nhận với dữ liệu nguyên vẹn 100%.

---

## 9. Khảo sát Liên kết Tổ chức & Người dùng (Organization Linking)
- Hiện tại, tên doanh nghiệp chỉ là một chuỗi văn bản thuần túy nhập tay (`formData.companyName`).
- Không có liên kết khóa ngoại (`organizationId`) với Master Organization Registry.
- Nếu một người mua thuộc một nhà máy đã có hồ sơ trong hệ thống nhập tên hơi khác một chút (ví dụ "Công ty TNHH Nhựa ABC" vs "Nhựa ABC"), hệ thống không nhận diện được và có nguy cơ tạo ra nhiều bản ghi trùng lặp.
- Chưa có trường Mã số thuế (`taxCode`) tùy chọn để đối soát doanh nghiệp.

---

## 10. Mã Nhu Cầu & Trạng Thái (Tracking Code & Status)
- **Mã nhu cầu:** Đang sinh ngẫu nhiên ở client bằng `REQ-` + 6 số ngẫu nhiên (`REQ-849201`).
  - Spec quy định: Mã nhu cầu phải được cấp phát từ server theo format chuẩn nhận diện: **`NC-2026-xxxxx`** (ví dụ `NC-2026-00125`), không dùng database auto ID làm mã public.
- **Trạng thái (State Machine):**
  - Chưa hỗ trợ vòng đời chuẩn theo Spec:
    `NEW` → `NEED_MORE_INFO` → `VERIFIED` → `SOURCING` → `CONNECTING` → `IN_PROGRESS` → `CLOSED` / `CANCELLED`.
  - Thiếu trường lý do đóng (`closedReason`: WON, NOT_SUITABLE, CANCELLED, PAUSED, EXPIRED, UNKNOWN_RESULT).

---

## 11. BẢNG TỔNG HỢP ĐÁNH GIÁ /dang-nhu-cau

| Hạng mục | Hiện trạng | Yêu cầu chuẩn Spec | Đánh giá |
| :--- | :--- | :--- | :--- |
| **Cửa vào 1 (Direct)** | Nhập form chi tiết ngay từ đầu | Textarea mô tả tự nhiên + SUPPI đọc & gợi ý trường | ⚠️ Cần bổ sung Step 1 Natural Text |
| **Cửa vào 2 (Từ SUPPI)** | Nhận `?draft={id}`, điền trước form | Điền trước form từ `RequirementDraft`, không hỏi lại | ✅ Đạt yêu cầu |
| **Layout Desktop** | 1 cột dài full-width | 65-70% Form + 30-35% SUPPI Assistant Panel | ⚠️ Cần tái cấu trúc 2 cột |
| **Trường khó** | Bắt buộc hoặc để trống | Tùy chọn "Tôi chưa xác định — Cần SUPPI hỗ trợ" | ❌ Chưa có |
| **Quyền chia sẻ** | 3 mức: Private, Only Matched, Public | Mặc định `MATCHED_SUPPLIERS_ONLY`, tách consent marketing | ✅ Đã có 3 mức, cần tách consent |
| **Bảo mật Buyer** | Không lộ thông tin liên hệ | Luôn che số điện thoại, email, ngân sách nội bộ | ✅ Đạt yêu cầu |
| **Login Trigger** | Cho phép Guest submit | Chặn modal đăng nhập trước khi submit, giữ context | ❌ Chưa có trigger login |
| **Mã nhu cầu** | `REQ-` + số random client | `NC-2026-xxxxx` cấp phát từ server | ❌ Chưa chuẩn format |
| **Server Validation** | Không có validation server | Validate đầy đủ, kiểm tra trùng lặp (Deduplication) | ❌ Thiếu hoàn toàn |
| **Database Schema** | `Demand.js` cũ, thiếu trường | Schema mở rộng 18+ trường, có versioning | ❌ Cần nâng cấp schema |
| **Đích đến sau submit** | Hiển thị thông báo tĩnh tại chỗ | Chuyển sang `/tai-khoan/nhu-cau/[id]` & đưa vào Admin queue | ❌ Chưa có điều hướng |

---

## 12. KẾT LUẬN & DỪNG LẠI SAU AUDIT (STOP AFTER AUDIT)
Theo đúng chỉ đạo của tài liệu spec `3.txt`:
- Toàn bộ audit hiện trạng tiếp nhận nhu cầu `/dang-nhu-cau`, data models, validations và rủi ro đã được hoàn thành đầy đủ và lưu tại:
  `docs/pages/dang-nhu-cau/REQUIREMENT_CURRENT_AUDIT.md`
- **Chưa redesign, chưa migration, không tạo code mới.**
