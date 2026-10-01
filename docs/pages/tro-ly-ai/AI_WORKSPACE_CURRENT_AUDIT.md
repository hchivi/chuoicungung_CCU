# BÁO CÁO AUDIT HIỆN TRẠNG TRỢ LÝ AI (PAGE 02 — /tro-ly-ai)
**Dự án:** CHUOICUNGUNG.COM  
**Trang:** 02 — SUPPI & CHAINY AI WORKSPACE  
**Target Route:** `/tro-ly-ai` (alias `/ai`)  
**Giai đoạn:** PROMPT 02-01 — AUDIT /tro-ly-ai (Chưa xây AI, Chưa migration DB, Chưa tích hợp Zalo, Dừng lại sau Audit)  
**Thời gian thực hiện:** 28/09/2026  

---

## 1. Trạng thái Route `/tro-ly-ai` trong Codebase
- **Khai báo Route:** [src/App.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/App.jsx) (Lines 317–318):
  ```jsx
  <Route path="/tro-ly-ai" element={<AiWorkspacePage />} />
  <Route path="/ai" element={<AiWorkspacePage />} />
  ```
- **Component xử lý:** [src/pages/AiWorkspacePage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AiWorkspacePage.jsx).
- **Cơ chế Layout:** `MainLayout` trong `App.jsx` (Line 143–144) đã cấu hình:
  `const isAiWorkspace = location.pathname.startsWith('/tro-ly-ai') || location.pathname.startsWith('/ai');`
  Khi vào `/tro-ly-ai`, hệ thống tự động ẩn `Navbar`, `Footer`, `SuppliMascot` toàn cục để nhường toàn bộ không gian màn hình (Full-bleed 3-column layout) cho AI Workspace.
- **Quy mô hiện tại:** File [AiWorkspacePage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AiWorkspacePage.jsx) hiện có **4.293 dòng code**, là một component monolithic khổng lồ gộp chung toàn bộ header, sidebar, chat composer, business rules, context panel và các modals.

---

## 2. Rà soát toàn bộ Component liên quan trong hệ thống

| Nhóm chức năng | File / Component hiện có | Tình trạng & Phân tích kỹ thuật |
| :--- | :--- | :--- |
| **Chat / Chatbot** | [src/pages/AiWorkspacePage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AiWorkspacePage.jsx) | Đang tự dựng luồng chat bằng React state nội bộ (`messages`, `inputPrompt`, `isProcessing`). Chưa tách thành sub-components chuyên trách (`MessageList`, `AssistantMessage`, `UserMessage`). |
| **SUPPI Mascot** | [src/components/DualMascotInteractive.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/DualMascotInteractive.jsx)<br>[src/components/SuppliMascot.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/SuppliMascot.jsx) | `DualMascotInteractive` render sprite sheet WebP (`/mascots/suppi-directions.webp`, `suppi-reactions.webp`) với 9 hướng mắt xoay theo chuột và 10 biểu cảm, rất mượt và chuẩn UX. |
| **CHAINY Mascot** | [src/components/DualMascotInteractive.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/DualMascotInteractive.jsx) | Cùng nằm trong `DualMascotInteractive`, có asset sprite sheet riêng (`chainy-directions.webp`, `chainy-reactions.webp`). Đã sẵn sàng tương tác song hành cùng SUPPI. |
| **Assistant Switching** | `AiWorkspacePage.jsx` (Lines 39–90, 1014–1020) | Đã có tư duy phân vai: SUPPI (Sourcing, Clarify, RequirementDraft) và CHAINY (Connection, Meeting, Next Actions). Tuy nhiên logic handoff đang hard-code qua `setTimeout` client-side. |
| **Search Engine** | [src/components/ClickUpBrainSearchBar.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/ClickUpBrainSearchBar.jsx)<br>[src/components/SearchModal.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/SearchModal.jsx) | Search bar dạng từ khóa truyền thống; chưa kết nối API trợ lý ngữ nghĩa (Semantic Assistant Search). |
| **Demand Form** | [src/pages/PostDemandPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/PostDemandPage.jsx)<br>[src/pages/DemandWorkspacePage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/DemandWorkspacePage.jsx) | `PostDemandPage.jsx` đã có sẵn logic nhận tham số `?draft={id}`, nạp từ `localStorage`, hiển thị thanh tiến độ Completeness và 13 trường của `RequirementDraft`. |
| **Login / Auth UI** | [src/components/auth/AuthModal.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/components/auth/AuthModal.jsx)<br>[src/pages/AuthPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AuthPage.jsx) | Đã có modal xác thực doanh nghiệp đa vai trò (Nhà máy, NCC, KCN...) và trang đăng nhập độc lập. Trong `AiWorkspacePage` có thêm một `showLoginModal` dạng inline. |
| **Profile & Organization** | [src/pages/EnterprisesPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/EnterprisesPage.jsx)<br>[src/pages/FactoriesPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/FactoriesPage.jsx) | Profile hiển thị năng lực nhà máy & nhà cung ứng dựa trên dữ liệu JSON tĩnh. Chưa có màn hình quản lý Organization Roles động cho user đang đăng nhập. |
| **Dashboard** | [src/pages/AdminDashboardPage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/AdminDashboardPage.jsx)<br>[src/pages/DemandWorkspacePage.jsx](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/pages/DemandWorkspacePage.jsx) | `DemandWorkspacePage.jsx` cung cấp dashboard quản lý theo từng nhu cầu với 8 tabs (Tổng quan, NCC, Bằng chứng, Mẫu/khảo sát, Báo giá, Trao đổi, Việc tiếp theo, Kết quả). |
| **Sidebar** | `AiWorkspacePage.jsx` (Lines 568–853) | Hàm `buildLiveSidebarRoleSections` tính toán số liệu động theo 9 vai trò từ dữ liệu bộ nhớ. Chiếm hơn 500 dòng code inline trong page. |
| **Notification** | Inline `toastMessage` trong `AiWorkspacePage.jsx` | Chỉ có thông báo Toast tạm thời biến mất sau 3.5s. Chưa có Notification Center lưu trữ lịch sử tin nhắn/cảnh báo hệ thống. |

---

## 3. Khảo sát Cơ chế Auth, Session & Role hiện tại

- **Guest Session:**
  - Hiện tại, người dùng chưa đăng nhập được gán một object mặc định:
    `{ isLoggedIn: false, name: 'Nguyễn Văn An', orgName: 'Công ty Cổ phần Tân Á Packaging', role: 'Nhà máy' }`.
  - Toàn bộ trạng thái tạm thời được lưu trong trình duyệt qua `localStorage.setItem('ccu_user_session', ...)`.
  - **Hạn chế:** Chưa có cơ chế cấp phát `guest_session_id` an toàn từ backend; nếu đổi thiết bị hoặc xóa cache thì dữ liệu guest bị mất.
- **Login / Signup Workflow:**
  - Người dùng bấm đăng nhập qua `showLoginModal` hoặc `AuthModal.jsx`.
  - Khi login thành công, cờ `isLoggedIn` được chuyển thành `true` trong localStorage.
  - Đã có xử lý giữ lại bản nháp: Nếu đang có `currentDraft` ở trạng thái `DRAFT_AI`, sau khi login sẽ mở tiếp màn hình xác nhận mà không yêu cầu nhập lại form.
- **Session Storage / Data Persistence:**
  - Hệ thống đang dùng 6 keys trong `localStorage`:
    1. `ccu_user_session`: Lưu thông tin phiên user / auth.
    2. `ccu_requirement_draft`: Bản nháp nhu cầu hiện hành.
    3. `ccu_active_conversation`: Hội thoại AI đang mở (gồm `id`, `entityType`, `entityId`, `currentIntent`).
    4. `ccu_draft_{id}`: Bản nháp lưu theo ID cụ thể.
    5. `ccu_user_demands`: Danh sách nhu cầu của tài khoản.
    6. `ccu_active_connections`: Danh sách kết nối đang xử lý.
- **Organization & Multi-Role:**
  - UI hỗ trợ 9 vai trò: `factory` (Nhà máy), `supplier` (Nhà cung ứng), `association` (Hội/Hiệp hội), `kcn` (KCN), `sponsor` (Nhà tài trợ), `founding_partner` (Đối tác sáng lập), `fdi` (FDI), `investor` (Nhà đầu tư), `expert` (Chuyên gia).
  - Tuy nhiên, trong cơ sở dữ liệu backend, hệ thống đang lưu riêng rẽ thành 3 collection Mongoose khác nhau (`Enterprise`, `Factory`, `IndustrialPark`), **chưa có mô hình `Organization` thống nhất** cho phép 1 doanh nghiệp sở hữu đồng thời nhiều roles (`organization.roles = ['buyer', 'supplier', 'sponsor']`).

---

## 4. Khảo sát Database & Data Model hiện tại

| Entity mục tiêu (Spec Mục 27) | Trạng thái hiện tại | File / Model tương ứng | Đánh giá & Khoảng cách |
| :--- | :--- | :--- | :--- |
| **`conversations`** | **CHƯA CÓ TRONG DB** | Chỉ là JS object trong `AiWorkspacePage.jsx` | Cần tạo Mongoose Model `Conversation` (chứa `organizationId`, `userId`, `role`, `intent`, `activeAssistant`, `requirementId`, `connectionId`, `source`). |
| **`messages`** | **CHƯA CÓ TRONG DB** | Chỉ là state array `messages` trong React | Cần tạo Mongoose Model `Message` (chứa `conversationId`, `senderType`, `assistantRole`, `channel: WEB/ZALO/SYSTEM`, `text`, `attachments`, `syncStatus`). |
| **`requirements` / `demands`** | **ĐÃ CÓ (Bản đơn giản)** | [server/models/Demand.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/server/models/Demand.js) | Đã có schema lưu nhu cầu nhưng thiếu các trường chuyên sâu: `completenessScore`, `visibility`, `specifications`, `sampleRequired`, `surveyRequired`, `deliveryRequirements`. |
| **`requirement_drafts`** | **CHƯA CÓ TRONG DB** | Lưu trong `localStorage` | Cần tạo model hoặc collection riêng cho `RequirementDraft` với trạng thái `DRAFT_AI`, `DRAFT_USER_REVIEW`, `READY_FOR_CONFIRMATION`, `CONFIRMED`. |
| **`suppliers` / `enterprises`**| **ĐÃ CÓ** | [server/models/Enterprise.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/server/models/Enterprise.js) | Đã có dữ liệu 32.000+ NCC trong `enterprisesFull.json` và API đọc dữ liệu. |
| **`supplier_matches`** | **CHƯA CÓ TRONG DB** | Giả lập tĩnh trong UI | Thiếu bảng liên kết matching giữa 1 Requirement và nhiều NCC ứng viên với trạng thái riêng cho từng match. |
| **`connections`** | **CHƯA CÓ TRONG DB** | Lưu mảng tạm trong localStorage | Thiếu model `Connection` ghi nhận tiến độ kết nối 2 bên (MOU, lịch hẹn, gửi mẫu, báo giá). |
| **`activities` / `next_actions`**| **CHƯA CÓ TRONG DB** | Chưa có | Thiếu model quản lý công việc tiếp theo có cấu trúc: `owner`, `action`, `deadline`, `status`. |
| **`programs`** | **CHƯA CÓ TRONG DB (Chỉ có JS)** | `programsData.js`, `expoEventsData.js` | Dữ liệu sự kiện đang ở dạng file code JS, chưa đưa vào MongoDB. |
| **`organization_roles`** | **CHƯA CÓ TRONG DB** | Hard-code theo role ID | Cần bảng phân quyền vai trò cho từng thành viên trong tổ chức. |

*Tuân thủ nghiêm ngặt:* **Không tự ý tạo model mới ở bước audit này.**

---

## 5. Khảo sát Năng lực Kỹ thuật Hạ tầng (Infrastructure & Integrations)

1. **File Upload & Attachments:**
   - Server Express có thư mục `server/uploads/` và cấu hình lưu trữ file cục bộ.
   - Tại `AiWorkspacePage.jsx`, chức năng đính kèm tài liệu hiện chỉ giả lập qua state mảng `attachedFiles` và chưa upload multipart/form-data thực sự lên server.
2. **Notification System:**
   - Hệ thống thông báo hoàn toàn là client-side Toast, không có cơ chế lưu thông báo vào database hay gửi thông báo khi có phản hồi mới từ NCC/Buyer.
3. **Websocket & Streaming:**
   - Codebase hiện tại chạy Vite HTTP dev server + Express backend REST, **chưa cài đặt Socket.io, WebSocket hoặc Server-Sent Events (SSE)**.
   - Các tin nhắn phản hồi của SUPPI & CHAINY hiện đang sử dụng `setTimeout(..., 1200)` để tạo cảm giác máy tính đang suy nghĩ.
4. **AI Engine / LLM API:**
   - **Chưa có kết nối API LLM thật** (như Google Gemini API qua `@google/genai` hay OpenAI).
   - Logic nhận diện ý đồ (`Intent Detection`) và trích xuất thực thể (`Entity Extraction`) trong `AiWorkspacePage.jsx` hiện đang được viết bằng **thuật toán đối soát từ khóa và Regex thuần** (hàm `updateRequirementDraftRealtime` và `detectIntent`).
5. **Zalo CRM Integration:**
   - UI có popup mô phỏng "Liên kết Zalo" (`showZaloModal`) sinh mã QR và lưu cờ `isZaloLinked = true` kèm một `zaloUid` ngẫu nhiên.
   - Chưa có Zalo Official Account (OA) Webhook, Zalo OAuth token handler, hay SDK đồng bộ tin nhắn 2 chiều.

---

## 6. BẢNG TỔNG HỢP AUDIT /tro-ly-ai

### BẢNG 1: EXISTING (Những gì đang có trong Codebase)
| Thành phần | File / Module | Chi tiết hiện trạng |
| :--- | :--- | :--- |
| **Trang `/tro-ly-ai`** | `src/pages/AiWorkspacePage.jsx` | Giao diện workspace trợ lý AI (4.293 dòng), layout 3 cột, tích hợp sẵn SUPPI & CHAINY |
| **Mascot tương tác kép** | `src/components/DualMascotInteractive.jsx` | SUPPI & CHAINY xoay mắt theo con trỏ chuột, có biểu cảm và lời thoại phản hồi |
| **Role Taxonomy** | `ROLE_SUGGESTIONS` & `ROLES` | Đầy đủ 9 nhóm vai trò và bộ gợi ý công việc mẫu cho từng vai trò theo đúng spec |
| **Intent Router sơ bộ** | `AiWorkspacePage.jsx` (Lines 1033–1150) | Hàm phân loại ý đồ theo từ khóa (Nhận diện: Nhu cầu mua, cơ hội bán, câu hỏi chung) |
| **Realtime Draft Logic** | `AiWorkspacePage.jsx` | Tự động trích xuất: Số lượng, sản phẩm, địa bàn, KCN, yêu cầu mẫu, tiêu chuẩn ISO |
| **Trang hoàn thiện nhu cầu** | `src/pages/PostDemandPage.jsx` | Trang `/dang-nhu-cau?draft={id}` đọc draft từ localStorage và điền trước form |
| **Workspace quản lý nhu cầu** | `src/pages/DemandWorkspacePage.jsx` | Trang `/tai-khoan/nhu-cau/:id` với 8 tab pipeline quản lý nhu cầu sau khi publish |
| **Modal xác thực nhanh** | `AiWorkspacePage.jsx` (`showLoginModal`) | Popup yêu cầu đăng nhập khi muốn lưu nhu cầu hoặc xác nhận tìm nguồn |

### BẢNG 2: REUSABLE (Có thể tái sử dụng ngay)
| Thành phần tái sử dụng | Giá trị mang lại | Cách tích hợp vào cấu trúc mới |
| :--- | :--- | :--- |
| **DualMascotInteractive.jsx** | Hoàn thiện 100% về mặt đồ họa và tương tác | Tái sử dụng làm hạt nhân hiển thị cho `WorkspaceHeader` và Empty State |
| **Bộ từ điển ROLE_SUGGESTIONS** | Đầy đủ 9 vai trò với 80+ prompt chuẩn B2B | Tách thành file cấu hình sạch [src/data/roleSuggestionsConfig.js](file:///Users/heymac/Documents/hchivi/CODE/CCU/src/data/roleSuggestionsConfig.js) cấp cho `QuickActions` |
| **Logic tính toán Sidebar** (`buildLiveSidebarRoleSections`) | Tự động tính toán số lượng dựa trên data thực tế | Tách thành hook `useLiveSidebarMetrics` cung cấp dữ liệu cho `WorkspaceSidebar` |
| **Template RequirementDraft** (13 trường) | Chuẩn hóa cấu trúc dữ liệu bản nháp | Dùng làm interface chuẩn cho `RequirementDraft` frontend & backend |
| **PostDemandPage & DemandWorkspace** | Đã xử lý rất tốt luồng kế tiếp của nhu cầu | Giữ nguyên đích đến chuyển giao: `/dang-nhu-cau?draft={id}` và `/tai-khoan/nhu-cau/{id}` |

### BẢNG 3: MISSING (Các phần còn thiếu theo Spec Page 02)
| Thành phần còn thiếu | Yêu cầu theo Spec (Mục 17–48) | Mức độ cấp thiết |
| :--- | :--- | :--- |
| **Backend AI Engine / Services** | Thiếu `ConversationService`, `IntentDetectionService`, `RequirementDraftService` độc lập trên server Express | **P0** |
| **Database Models** | Thiếu các model MongoDB: `Conversation`, `Message`, `RequirementDraft`, `SupplierMatch`, `Connection` | **P0** |
| **Session an toàn (Guest & Auth)** | Cần API cấp phát `sessionId` cho khách và merge tự động với `userId` khi đăng nhập | **P0** |
| **Tách nhỏ Component Monolith** | Cần chia nhỏ file 4.293 dòng thành 10 components chuyên biệt theo kiến trúc sạch | **P0** |
| **Structured Output Schema** | Cần đảm bảo AI trả về JSON có cấu trúc (Intent, Entities, Missing fields) thay vì text thuần | **P1** |
| **Streaming / Realtime Server** | Thiếu SSE/WebSocket để stream câu trả lời từ AI theo thời gian thực | **P1** |
| **Zalo Webhook & Service** | Cần kiến trúc backend `ZaloIntegrationService` sẵn sàng nối với Zalo OA | **P2** |

### BẢNG 4: CONFLICT (Các điểm xung đột cần giải quyết)
| Điểm xung đột | Hiện trạng trong Code | Quy định trong Master Spec | Hướng giải quyết |
| :--- | :--- | :--- | :--- |
| **Lưu trữ dữ liệu hội thoại** | Đang lưu hoàn toàn trong `localStorage` của trình duyệt | Dữ liệu phải được lưu trên server CRM/Database trung tâm | Chuyển đổi từ localStorage sang gọi API backend có fallback offline |
| **Cấu trúc dữ liệu Tổ chức** | Tách rời 3 bảng: `Enterprise`, `Factory`, `IndustrialPark` | Một doanh nghiệp = 1 `Organization` sở hữu nhiều role linh hoạt | Hợp nhất logical layer qua `organization.roles = [...]` |
| **Xử lý Intent AI** | Đang dùng chuỗi regex if/else thủ công trong React component | Phải tách thành Service độc lập phía backend với 14 intent chuẩn | Di chuyển logic sang backend `IntentDetectionService` |
| **Kích thước file quá lớn** | 1 file `AiWorkspacePage.jsx` chứa hơn 4.200 dòng | Quy chuẩn code sạch yêu cầu chia nhỏ component độc lập (< 400 dòng/file) | Bóc tách thành thư mục `src/components/ai/` |

### BẢNG 5: TECHNICAL RISK (Rủi ro kỹ thuật)
| Rủi ro kỹ thuật | Mô tả rủi ro | Giải pháp giảm thiểu |
| :--- | :--- | :--- |
| **Rủi ro mất dữ liệu khi Refresh** | Nếu guest đang trao đổi mà trình duyệt dọn dẹp localStorage, toàn bộ câu chuyện và draft bị mất | Đồng bộ session tạm về backend ngay từ tin nhắn đầu tiên (`assistant_sessions`) |
| **Rủi ro lag UI khi chat dài** | Component 4.200 dòng re-render toàn bộ khi user gõ từng phím trong input chat | Tách `ChatComposer` thành component độc lập quản lý state nhập liệu cục bộ |
| **Rủi ro Hallucination của AI** | AI có thể tự hứa "Nhà cung ứng này chắc chắn giao hàng được" | Ràng buộc prompt hệ thống: AI chỉ dùng cụm "Có khả năng phù hợp, cần xác nhận" |
| **Rủi ro rò rỉ dữ liệu nhạy cảm** | Chat có thể chứa số điện thoại, giá mục tiêu, bản vẽ riêng tư của nhà máy | Mã hóa trường dữ liệu, che thông tin cá nhân (masking) trên public UI |

---

## 7. Đề xuất Kiến trúc Mapping sang 10 Component Mục Tiêu

Nhằm giải quyết triệt để vấn đề file monolith 4.293 dòng mà không làm gián đoạn tính năng, đề xuất chia nhỏ thành cấu trúc module:

```
src/pages/AiWorkspacePage.jsx (Container điều phối chính, < 300 dòng)
│
├── src/components/ai/
│   ├── WorkspaceHeader.jsx           // Header Guest / Auth, Hotline, Zalo Status, Mascot Indicator
│   ├── WorkspaceSidebar.jsx          // Danh mục công việc động theo 9 vai trò, Cuộc trò chuyện mới
│   ├── RoleSelector.jsx              // 9 thẻ chọn vai trò với icons & mô tả trực quan
│   ├── Conversation.jsx              // Khung hiển thị tin nhắn (MessageList, Assistant, User, SystemEvent)
│   ├── ChatComposer.jsx              // Ô nhập liệu sticky bottom, nút đính kèm tài liệu, gửi tin
│   ├── QuickActions.jsx              // 6 thẻ gợi ý công việc phổ biến theo từng vai trò
│   ├── RequirementContextPanel.jsx   // Cột phải: Thẻ tóm tắt tiến độ nhu cầu (Completeness %), trường thiếu
│   ├── SupplierMatchesPanel.jsx      // Cột phải: Danh sách nhà cung ứng phù hợp được AI tìm thấy
│   ├── ConnectionPanel.jsx           // Cột phải: Tiến độ kết nối, cuộc gặp, gửi mẫu, báo giá (CHAINY)
│   └── LoginModal.jsx                // Modal lưu nhu cầu và đồng bộ phiên làm việc không mất context
```

### Bảng đối chiếu chuyển đổi chi tiết:

| Component mục tiêu | Đoạn code hiện tại trong `AiWorkspacePage.jsx` | Chức năng cụ thể |
| :--- | :--- | :--- |
| **`WorkspaceHeader`** | Lines 2392–2500 | Hiển thị nút về Trang chủ, trạng thái SUPPI & CHAINY, hotline 1900 8686, nút Đăng nhập (Guest) hoặc Tên tổ chức + Role dropdown (Auth). |
| **`WorkspaceSidebar`** | Lines 2501–2850 | Sidebar trượt với nút "+ Cuộc trò chuyện mới", 4 phân nhóm (Công việc của tôi, Hồ sơ tổ chức, Cơ hội & chương trình, Hợp tác), hỗ trợ Drawer mobile. |
| **`RoleSelector`** | Lines 2851–2920 | Lưới chọn 9 vai trò (`ROLES`), tự động chuyển đổi ngữ cảnh trợ lý mà không bắt buộc chọn trước khi chat. |
| **`Conversation`** | Lines 2921–3650 | Toàn bộ dòng thời gian trò chuyện, thẻ bong bóng tin nhắn của SUPPI (xanh dương), CHAINY (cam/tím), User, và các sự kiện hệ thống Handoff. |
| **`ChatComposer`** | Lines 3651–3780 | Khung nhập văn bản đa dòng (Enter gửi, Shift+Enter xuống dòng), các nút đính kèm tài liệu, ảnh, chọn địa bàn, KCN. |
| **`QuickActions`** | Lines 2930–3050 | Hiển thị 6 thẻ tác vụ mẫu tương ứng với vai trò đã chọn (2 cột × 3 hàng) kèm nút mở rộng. |
| **`RequirementContextPanel`**| Lines 3781–4020 | Bảng điều khiển góc phải hiển thị thẻ nhu cầu đang soạn thảo (`NC-DRAFT`), thanh % hoàn thiện, danh sách trường đã có / còn thiếu, nút "Hoàn thiện nhu cầu". |
| **`SupplierMatchesPanel`** | Lines 4021–4150 | Danh sách các NCC có khả năng đáp ứng kèm năng lực cốt lõi, địa bàn và trạng thái phản hồi. |
| **`ConnectionPanel`** | Lines 4151–4250 | Khối điều phối của CHAINY hiển thị lịch gặp, tiến độ gửi mẫu, báo giá và việc cần làm tiếp theo (`NextActionCard`). |
| **`LoginModal`** | Lines 4251–4290 | Hộp thoại thông báo: "Đăng nhập để SUPPI lưu nhu cầu này và CHAINY theo dõi đến kết quả", cam kết bảo lưu toàn bộ context. |

---

## 8. KẾT LUẬN & DỪNG LẠI SAU AUDIT (STOP AFTER AUDIT)
Theo đúng chỉ đạo của tài liệu spec `2.txt`:
- Toàn bộ audit hiện trạng codebase liên quan đến `/tro-ly-ai`, auth, data models, các tích hợp và rủi ro đã được hoàn thành đầy đủ và lưu tại:
  `docs/pages/tro-ly-ai/AI_WORKSPACE_CURRENT_AUDIT.md`
- **Chưa xây AI, chưa migration database, chưa tích hợp Zalo, không tự tạo model mới, không làm gián đoạn ứng dụng đang chạy.**
- Hệ thống đã sẵn sàng cho prompt kế tiếp: **PROMPT 02-02 — DATA MODEL + BACKEND FOUNDATION**.
