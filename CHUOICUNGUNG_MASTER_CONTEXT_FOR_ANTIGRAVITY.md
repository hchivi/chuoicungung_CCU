# CHUOICUNGUNG.COM — MASTER PROJECT CONTEXT FOR ANTIGRAVITY

**Phiên bản:** 2026-09-30  
**Mục đích:** Tài liệu đầu vào toàn diện để Antigravity hiểu đúng sản phẩm, kiến trúc, dữ liệu, route, workflow, UI/UX, SEO, AI, backend, bảo mật, kiểm thử và giới hạn triển khai của CHUOICUNGUNG.COM.  
**Repository:** `/Users/heymac/Documents/hchivi/CODE/CCU`  
**Production origin:** `https://chuoicungung.com`  
**Phạm vi phát triển hiện tại:** P0 + P1. **Không tự mở P2.**

---

## 0. CÁCH ANTIGRAVITY PHẢI SỬ DỤNG TÀI LIỆU NÀY

Đây là tài liệu định hướng và bản đồ hiện trạng, không phải lệnh tự động sửa toàn bộ repository.

Thứ tự ưu tiên khi có xung đột:

1. Yêu cầu mới nhất do chủ dự án đưa ra.
2. Các nguyên tắc sản phẩm, dữ liệu, an toàn và phạm vi trong Master Context này.
3. `danh_sach_url_website.txt` đối với canonical URL, redirect registry và ghost entity.
4. Source code hiện tại đối với hành vi đang thực sự tồn tại.
5. Báo cáo audit trong `docs/` và `phan_tich_154_url_antigravity.txt`.
6. Các file `prompt/1.txt` đến `prompt/37.txt` là lịch sử specification P0/P1; không được giả định tất cả đã triển khai đúng.
7. Nội dung hard-code, seed data, mock data và localStorage không được coi là nguồn production đáng tin nếu chưa đối chiếu backend/database.

Trước mọi thay đổi, Antigravity phải:

- đọc route, component, model, data loader, API và test liên quan;
- kiểm tra `git status`; working tree hiện có nhiều thay đổi của người dùng;
- không ghi đè hoặc hoàn tác thay đổi không thuộc task;
- xác định rõ current state, target state và migration risk;
- không deploy, commit, chạy migration production, xóa hoặc seed lại database nếu chưa được yêu cầu rõ;
- không đưa credential, token, PII hoặc dữ liệu nội bộ vào output;
- không tự tạo dữ liệu giả để che lấp dữ liệu thiếu;
- không đổi canonical URL chỉ vì SEO hoặc vì code cũ đang dùng alias;
- không mở P2.

---

# PHẦN I — PRODUCT NORTH STAR

## 1. CHUOICUNGUNG.COM LÀ GÌ

CHUOICUNGUNG.COM không phải một danh bạ doanh nghiệp lớn, không phải marketplace bán lẻ, không phải sàn đấu thầu tài chính và không phải website brochure.

Nó là hạ tầng vận hành B2B để biến một nhu cầu thật thành quy trình có thể theo dõi:

> **NHU CẦU → TÌM NGUỒN → KẾT NỐI → THEO DÕI → KẾT QUẢ**

Lời hứa sản phẩm:

> **Một nhu cầu thật → tìm đúng nguồn → kết nối đúng người → theo dõi đến cùng → ghi nhận kết quả.**

Mọi page và module phải giúp người dùng biết bước tiếp theo và dẫn về ít nhất một hành động:

- Tìm nguồn.
- Đăng nhu cầu.
- Kết nối.
- Giới thiệu năng lực.
- Tham gia chương trình.
- Yêu cầu dịch vụ.
- Hợp tác.
- Theo dõi công việc.
- Ghi nhận kết quả.

Nếu visual “wow” xung đột với nội dung, khả năng sử dụng hoặc workflow, thì nội dung và workflow thắng.

## 2. ĐỐI TƯỢNG VÀ JOB-TO-BE-DONE

### 2.1 Nhà máy / Buyer

Cần:

- mô tả và chuẩn hóa nhu cầu;
- tìm sản phẩm, dịch vụ, nhà cung ứng;
- tìm nguồn theo năng lực, địa bàn, quy mô, thời hạn và tiêu chuẩn;
- so sánh lựa chọn;
- yêu cầu mẫu, báo giá hoặc meeting;
- theo dõi tiến độ;
- biết ai phụ trách và việc tiếp theo;
- ghi nhận Won, Not suitable, Cancelled, Paused, Expired hoặc Unknown result.

### 2.2 Nhà cung ứng

Cần:

- giới thiệu năng lực thật;
- quản lý sản phẩm/dịch vụ;
- mô tả địa bàn phục vụ, MOQ, lead time, khả năng nhận việc;
- cung cấp bằng chứng/chứng nhận;
- phản hồi nhu cầu công khai;
- tham gia chương trình;
- nhận cơ hội phù hợp;
- theo dõi kết nối, meeting, mẫu, báo giá và kết quả.

### 2.3 Nhà máy với vai trò bán

Một nhà máy có thể đồng thời là buyer và supplier/OEM. Không tạo hai Organization cho cùng pháp nhân.

### 2.4 Khu công nghiệp / Ban quản lý

Cần:

- hỗ trợ nhà máy trong KCN;
- xem nhu cầu và khoảng trống nguồn cung theo địa bàn;
- tìm nhà cung ứng phục vụ KCN;
- tổ chức chương trình;
- xây catalogue/supplier coverage;
- quản lý dữ liệu chính thức về KCN và quan hệ với nhà máy.

KCN không được biến thành trang môi giới bất động sản.

### 2.5 Hội / Hiệp hội / Tổ chức kết nối

Cần:

- hỗ trợ hội viên;
- tiếp nhận nhu cầu;
- tổ chức chương trình;
- kết nối doanh nghiệp;
- theo dõi kết quả;
- quản lý quan hệ hội viên đã được xác nhận.

Hội/hiệp hội không mặc nhiên “bảo chứng năng lực” hoặc “đảm bảo chất lượng”.

### 2.6 Nhà tài trợ

Tài trợ chương trình, catalogue, media, vật phẩm hoặc hoạt động cụ thể. Tài trợ không được tác động organic matching, thứ hạng hoặc xác minh.

### 2.7 Founding Partner

Là gói thương mại cho chuyên mục hoặc keyword cluster:

- không phải co-founder;
- không phải equity;
- không phải investor;
- không phải verification/certification;
- không có đặc quyền matching;
- quyền lợi thương mại phải tách khỏi dữ liệu năng lực.

### 2.8 Đối tác phát triển

Phối hợp chương trình, giới thiệu khách, phát triển mạng lưới và referral có đối soát. Không phải MLM, không bán database và không tự nhận hoa hồng chỉ vì gửi contact.

### 2.9 Cố vấn

Đóng góp chuyên môn theo phạm vi, thời hạn, trách nhiệm và quyền truy cập rõ.

### 2.10 Nhà đầu tư

Luồng riêng về vốn, ownership và governance.

> **Investor ≠ Sponsor.**

## 3. CÁC PHÂN BIỆT BẮT BUỘC

- Sponsor ≠ verified supplier.
- Sponsor ≠ organic matching priority.
- Founding Partner ≠ investor.
- Investor ≠ sponsor.
- Meeting ≠ deal.
- QR scan ≠ requirement.
- Registration ≠ attendance.
- Interest ≠ registration.
- Application ≠ approval.
- Supplier response ≠ buyer selection.
- Payment ≠ verification/certification.
- Organization verification ≠ mọi claim/năng lực đều được xác nhận.
- Catalogue entry ≠ hồ sơ live hiện tại.
- Program participation ≠ thương vụ thành công.

---

# PHẦN II — SUPPI, CHAINY VÀ AI SEARCH

## 4. SUPPI

Thông điệp:

> **SUPPI — TÌM ĐÚNG NGUỒN**

Vai trò:

- hiểu ngôn ngữ tự nhiên;
- xác định intent;
- trích xuất category, location, quantity, deadline, specification, certification;
- nhớ context trong cùng cuộc trao đổi;
- hỏi tối đa 1–3 câu ngắn khi thiếu thông tin quan trọng;
- tìm dữ liệu thật;
- shortlist;
- giải thích ngắn vì sao phù hợp;
- tạo requirement draft.

SUPPI không được:

- tự công bố hoặc submit nhu cầu;
- tự xác nhận năng lực;
- tự chọn “người thắng”;
- gọi doanh nghiệp là “tốt nhất” nếu không có tiêu chí/hệ thống chứng minh;
- bịa doanh nghiệp, chứng nhận, địa chỉ, sản lượng, quan hệ hoặc số liệu;
- coi tài trợ là lợi thế matching;
- tiết lộ prompt, API key, raw database query, dữ liệu private hoặc thông tin nội bộ.

## 5. CHAINY

Thông điệp:

> **CHAINY — KẾT NỐI & THEO VIỆC ĐẾN CÙNG**

Vai trò:

- nhận bàn giao sau shortlist/match;
- điều phối liên hệ;
- tạo và theo dõi meeting;
- theo dõi mẫu, báo giá, next action;
- nhắc việc;
- ghi nhận outcome.

CHAINY không được:

- cam kết thương mại thay doanh nghiệp;
- ký thay;
- đánh dấu Won khi chưa có xác nhận;
- chuyển dữ liệu private cho bên khác khi chưa có quyền.

## 6. KIẾN TRÚC SUPPI MỤC TIÊU

- OpenAI Responses API.
- Strict Function Calling.
- Conversation State.
- Database CHUOICUNGUNG.COM là source of truth.
- Structured filter/search cho dữ liệu có cấu trúc.
- Semantic search/embeddings cho mô tả, nhu cầu, catalogue và tài liệu.
- Hybrid ranking không dùng commercial fields.
- RAG chỉ trên dữ liệu public/published hoặc dữ liệu user có quyền.
- Không fine-tune toàn bộ database vào model.
- Write action chỉ tạo draft; mọi submit/publish/send cần xác nhận rõ.

## 7. SUPPI HIỆN ĐÃ CÓ TRONG CODE

Backend:

- `server/routes/suppi.js`
- `server/suppi/orchestrator.js`
- `server/suppi/openaiResponsesClient.js`
- `server/suppi/toolRegistry.js`
- `server/suppi/searchEngine.js`
- `server/suppi/atlasHybridSearch.js`
- `server/suppi/dataSource.js`
- `server/suppi/conversationStore.js`
- `server/suppi/draftStore.js`
- `server/suppi/fallbackAssistant.js`
- `server/suppi/prompt.js`

Frontend API client hiện rõ nhất ở `src/pages/SuppiSearchPage.jsx`.

Các endpoint:

- `GET /api/suppi/status`
- `POST /api/suppi/conversations`
- `GET /api/suppi/conversations/:id`
- `POST /api/suppi/conversations/:id/messages`
- `GET /api/suppi/requirement-drafts/:id`
- `PATCH /api/suppi/requirement-drafts/:id`

Các tool strict hiện có:

1. `search_suppliers`
2. `search_products_services`
3. `search_factories`
4. `search_industrial_parks`
5. `search_associations`
6. `search_programs`
7. `search_catalogues`
8. `search_public_requirements`
9. `get_supplier_profile`
10. `get_factory_profile`
11. `get_industrial_park`
12. `get_association`
13. `create_requirement_draft`

Hiện trạng:

- Có Responses API loop với `previous_response_id`.
- Có strict schema và giữ đúng `call_id`.
- Có safe fallback khi không cấu hình OpenAI.
- Có memory store khi MongoDB chưa kết nối.
- Có lexical search cục bộ.
- Có Atlas Search + Vector Search và reciprocal-rank fusion.
- Commercial fields bị loại khỏi kết quả hybrid.
- Requirement draft bị khóa ở trạng thái `DRAFT`.

Khoảng cách/rủi ro phải xử lý trước pilot:

- `AiWorkspacePage.jsx` vẫn dùng một service Gemini client-side riêng, không cùng kiến trúc SUPPI backend.
- Có fallback API credential hard-code ở client source. Không sao chép credential vào tài liệu/output; phải revoke/rotate và xóa khỏi bundle.
- Conversation/draft route chưa truyền owner constraint vào mọi lần get/update.
- Header `x-user-id` + `x-auth-token` hiện được coi là authenticated mà chưa có token verification thật.
- Safe fallback chỉ nhận diện một số địa điểm/intent bằng rule.
- SearchDocument index cần build và Atlas text/vector index cần tồn tại.
- Dữ liệu SUPPI hiện tải từ JSON/JS seed; chưa hoàn toàn dùng canonical Organization database.
- `openaiResponsesClient` có retry/timeout nhưng cần telemetry, request ownership, budget và abuse control production.

---

# PHẦN III — KIẾN TRÚC CODEBASE HIỆN TẠI

## 8. TECH STACK

| Layer | Technology | Phiên bản/ghi chú |
|---|---|---|
| Language | JavaScript ESM, JSX; một số TSX UI | `"type": "module"` |
| Frontend | React | 18.3.1 |
| Routing | react-router-dom | 6.28.1 |
| Build | Vite | 6.0.7 |
| CSS | Tailwind CSS + global CSS | 3.4.17 |
| Animation | GSAP, Motion, Three.js | GSAP 3.15, Motion 13.4, Three 0.186 |
| Maps | Leaflet | 1.9.4 |
| Icons | lucide-react | 0.475 |
| Backend | Express | 5.2.1 |
| Database | MongoDB Atlas / Mongoose | Mongoose 9.9.4 |
| Security middleware | Helmet, CORS, custom sanitizer/rate limiter | CSP hiện tắt |
| AI | OpenAI Responses API + Embeddings; legacy Gemini client service | Backend OpenAI là kiến trúc mục tiêu |
| Testing | Node built-in test runner | `node --test` |
| Deployment artifact | Vite `dist/` + generated static Todzung HTML | deployment config cần xác minh theo host |

## 9. PROCESS TOPOLOGY

```text
Browser
  ├─ React/Vite SPA
  │    ├─ React Router
  │    ├─ static/seed JSON and JS modules
  │    ├─ localStorage workflows
  │    └─ /api requests
  │
  └─ Express API :5050
       ├─ /healthz, /readyz
       ├─ /robots.txt, /sitemap.xml
       ├─ canonical redirect middleware
       ├─ /api enterprises/factories/KCN/demands/categories
       ├─ /api/suppi
       └─ MongoDB Atlas when connected
            ├─ current Mongo models
            └─ SearchDocument + Atlas text/vector indexes
```

Development:

- Vite port 3000.
- Express port 5050.
- Vite proxy `/api` → `http://localhost:5050`.

## 10. ENTRY POINTS

- Frontend HTML: `index.html`
- Frontend bootstrap: `src/main.jsx`
- Route registry/layout: `src/App.jsx`
- Global styling: `src/index.css`
- Server entry: `server/index.js`
- Express app factory: `server/app.js`
- General API: `server/routes/api.js`
- SUPPI API: `server/routes/suppi.js`
- Redirects: `server/routes/redirects.js`
- robots/sitemap: `server/routes/seo.js`
- Database connect: `server/db.js`
- Security middleware: `server/middleware/security.js`

## 11. DIRECTORY MAP

- `src/pages/`: 71 page files, gồm 18 phase pages.
- `src/components/`: 119 component files, có nhóm home/admin/demands/factories/KCN/programs/catalogues.
- `src/data/`: 42 data modules/JSON; nhiều workflow vẫn lưu localStorage.
- `src/services/`: legacy client-side AI service.
- `src/contexts/`: LanguageContext.
- `server/models/`: 8 Mongoose models hiện có.
- `server/routes/`: API, SUPPI, redirects, SEO.
- `server/suppi/`: orchestration, tools, search, stores, prompt.
- `server/scripts/`: 71 script crawl/seed/test/index/backfill.
- `server/tests/`: 9 test files.
- `server/data/`: bản sao dataset backend.
- `public/`: khoảng 2.938 file; ảnh, video, mascot, KCN, association, catalogue và uploads.
- `docs/`: audit hiện trạng và TDD evidence.
- `prompt/`: 37 workstream specification cùng audit/fix/pilot prompts.
- `archive_uploads/`: dữ liệu upload lưu trữ.
- `bank/`, `catalog/`, `characters/`, `font/`: asset hỗ trợ.
- `dist/`: build artifact, không phải source of truth.

## 12. LỆNH DỰ ÁN

- Dev frontend: `npm run dev`
- Backend: `npm run server`
- Test: `npm test`
- Coverage SUPPI: `npm run test:coverage`
- Build search documents: `npm run suppi:index`
- Production build: `npm run build`
- Preview: `npm run preview`
- Zip deployment: `npm run build:zip`

Không chạy `suppi:index`, seed, backfill, migration, build zip hoặc deploy trên production nếu chưa được phê duyệt và chưa có dry-run/backup.

## 13. ENVIRONMENT VARIABLES

Đã khai báo hoặc được code tham chiếu:

- `MONGODB_URI`
- `PORT`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_RESPONSES_MODEL`
- `OPENAI_EMBEDDING_MODEL`
- `SUPPI_TEXT_INDEX`
- `SUPPI_VECTOR_INDEX`
- `SUPPI_DISABLE_OPENAI`
- `SESSION_SECRET`
- `CORS_ORIGIN`
- `CANONICAL_ORIGIN`
- `NODE_ENV`
- `TEST_RATE_LIMIT`
- `RUN_HTTP_TESTS`

Không dùng default secret trong production. Không expose biến server qua `VITE_` nếu đó là secret.

---

# PHẦN IV — DATA ARCHITECTURE

## 14. NGUYÊN TẮC CANONICAL ENTITY

> **Một pháp nhân/doanh nghiệp = một Organization.**

Không tạo:

- ABC Buyer;
- ABC Supplier;
- ABC Sponsor;

thành ba organization riêng.

Dùng multi-role trên cùng Organization. Một Organization có thể có nhiều facility/factory.

Role chuẩn hiện có trong `Organization.js`:

- BUYER
- SUPPLIER
- FACTORY
- INDUSTRIAL_PARK_OPERATOR
- ASSOCIATION
- SPONSOR
- FOUNDING_PARTNER
- DEVELOPMENT_PARTNER
- ADVISOR
- INVESTOR

Canonical slug, alternate slugs, tax code, normalized name và source provenance phải hỗ trợ deduplication.

## 15. MONGOOSE MODELS HIỆN CÓ

1. `Demand`
2. `Enterprise`
3. `Factory`
4. `IndustrialPark`
5. `Organization`
6. `RequirementDraft`
7. `SearchDocument`
8. `SuppiConversation`

Hiện tồn tại song song `Enterprise` và `Organization`. Antigravity không được tự merge/xóa; phải lập mapping, dry-run, collision report và migration plan.

Các cờ `verified: true` hoặc `isVerified: true` trong dataset/model không được diễn giải thành bảo đảm năng lực tổng thể. Xác minh đúng phải gắn với từng claim/evidence và nguồn.

## 16. TARGET DOMAIN MODEL

Các entity lõi nên hội tụ về:

- organizations
- organization_users
- organization_roles
- facilities
- factory_profiles
- supplier_profiles
- capabilities
- products_services
- supplier_service_areas
- categories
- keywords
- locations
- industrial_parks
- industrial_park_organizations
- association_profiles
- organization_memberships
- evidence
- certifications
- data_claims
- requirements
- requirement_versions
- public_requirement_summaries
- supplier_responses
- requirement_supplier_matches
- connections
- meetings
- quotes
- samples
- tasks
- outcomes
- programs
- program_participation_options
- program_registrations
- program_payments
- program_attendance
- program_meetings
- program_media_assets
- services
- service_requests
- service_contracts
- sponsorships
- sponsorship_entitlements
- entitlement_deliveries
- founding_partnerships
- development_partners
- referrals
- settlements
- catalogues
- catalogue_editions
- catalogue_entries
- sourcing_dossiers
- media_assets
- payments
- invoices
- refunds
- consents
- permissions
- audit_logs
- search_documents
- suppi_conversations
- requirement_drafts

Target model là định hướng. Không tạo toàn bộ schema cùng lúc nếu task chỉ chạm một domain.

## 17. DATASET HIỆN CÓ

| Dataset | Số record/keys quan sát | Ghi chú |
|---|---:|---|
| `enterprisesFull.json` | 21.680 | khoảng 47 MB; chưa đồng nghĩa 21.680 record đã KYC |
| `factoriesFull.json` | 14.237 | không được tự gọi tất cả là FDI |
| `industrialParksFull.json` | 480 | dữ liệu KCN |
| `associations.json` | 71 | hội/hiệp hội |
| `industryCategories69Pages.json` | 3.418 | dữ liệu category crawl |
| `categoryImagesMap.json` | 6.835 keys | asset mapping |
| `categoriesAlphabetical.json` | 25 keys | nhóm alphabet |
| `phaseTaxonomyAlphabetical.json` | 18 | 18 pha |
| `supplierTopCategories.json` | 150 | không được dùng tên “top” như chứng nhận chất lượng |
| `foundingPartners.json` | 21 | commercial dataset |
| `demandsMapData.json` | 12 | seed/map |
| `suppliersMapData.json` | 20 | seed/map |
| `provinceCoordinates.json` | 56 | tọa độ địa phương |
| `vietnamExpressways.json` | 9 | lớp hạ tầng |

Kích thước quan sát:

- `src/`: khoảng 71 MB.
- `server/`: khoảng 41 MB.
- `public/`: khoảng 905 MB.
- `dist/`: khoảng 1,0 GB.
- Tổng JSON chính enterprises + factories + KCN khoảng 62,85 MB.

Không bundle toàn bộ dataset lên client. List page phải dùng server-side pagination/filter, payload tối thiểu, cache và lazy detail.

## 18. JS DATA MODULES VÀ WORKFLOW HIỆN CÓ

- `adminUnifiedCoordinationData.js`: role admin, pipeline, task, connection, audit; localStorage.
- `associationsData.js`: association profile, program organization, membership claim/review.
- `cataloguesData.js`: catalogue, edition, entry, participation, QR, audit.
- `categoryHubData.js`: 6-stage taxonomy, curated category hub, admin category.
- `developmentPartnerData.js`: application, partner, referral, settlement.
- `expoEventsData.js`: event seed, buy/sell keyword.
- `factoriesData.js`: factory enrichment, listing, connection, quality check.
- `foundingPartnershipData.js`: partnership scope, entitlement, conflict, neutrality.
- `industrialParksData.js`: KCN relations, supply gap, factory, supplier coverage, media.
- `keywordClustersData.js`: curated keyword cluster và admin.
- `mediaContentData.js`: media project/assets/catalogues.
- `merchandiseEventData.js`: vật phẩm, sample, quotation, supplier match.
- `mockData.js`: stage/enterprise/KCN/factory/association/demand/market mock.
- `organizationsData.js`: organization, claim, duplicate detection, completeness.
- `partnershipHubData.js`: partnership category, inquiry, finance separation.
- `productServicesData.js`: product/service schema và resolver.
- `programLibraryData.js`: albums, media permissions, download/exchange.
- `programsData.js`: program, registration, payment, attendance, consent.
- `recruitmentData.js`: jobs, candidates, matching demo.
- `remotePresenceData.js`: representation scope, restrictions, interaction/handover.
- `requirementsData.js`: requirement public projection, response, relevance, match, audit.
- `serviceFormEngineData.js`: unified service request/draft/status/task.
- `servicesData.js`: service catalogue, request, coordinator, program creation.
- `sixStagesData.js`: six stages, slug maps, needs, suppliers, neutrality.
- `sourcingDossiersData.js`: dossier, candidate, evidence, version, neutrality.
- `sponsorshipData.js`: sponsor/inquiry/entitlement/report/neutrality.
- `stageSuppliersData.js`: stage supplier seed.
- `strategicFoundingPartners.js`: commercial/marketing seed; không dùng cho organic rank.

Nhiều mutation ở frontend hiện chỉ ghi localStorage. Đây là prototype state, không phải production backend, không bảo đảm RBAC, ownership, audit integrity hoặc multi-device consistency.

## 19. REQUIREMENT STATE MACHINE

Target:

```text
NEW
→ NEED_MORE_INFO
→ VERIFIED
→ SOURCING
→ SUPPLIER_INVITED
→ RESPONSE_RECEIVED
→ MEETING
→ QUOTED
→ NEGOTIATING
→ CLOSED
```

Closed reason:

- WON
- NOT_SUITABLE
- CANCELLED
- PAUSED
- EXPIRED
- UNKNOWN_RESULT

Need status và supplier-match status phải tách riêng. Không dùng một status “Success” chung.

Mọi record công việc cần:

- `ownerUserId`
- `nextAction`
- `nextActionAt`
- `status`
- `lastUpdatedAt`

Không có owner/next action thì workflow dễ mất dấu.

## 20. FORM ENGINE

Không xây mỗi page một form architecture riêng.

Shared FormEngine cần:

- schema;
- version;
- steps;
- fields;
- conditions;
- validation client/server;
- consent;
- source context;
- idempotency;
- draft;
- audit.

Flow:

```text
OPEN
→ DRAFT
→ CLIENT VALIDATION
→ SUBMIT
→ SERVER VALIDATION
→ DEDUPLICATION
→ CREATE RECORD
→ ASSIGN OWNER
→ CREATE TASK
→ SEND CONFIRMATION
→ SHOW TRACKING CODE
```

Consent phải tách:

- consent xử lý yêu cầu;
- consent marketing.

---

# PHẦN V — 6 GIAI ĐOẠN VÀ 18 PHA

## 21. TAXONOMY CHÍNH THỨC CỦA SẢN PHẨM

Đây là taxonomy nội bộ, không phải quy chuẩn pháp lý bắt buộc.

### Giai đoạn 1 — Chuẩn bị & Đầu tư

1.1 Khảo sát & Định hướng  
1.2 Pháp lý & Thủ tục  
1.3 Chọn địa điểm & Mặt bằng

### Giai đoạn 2 — Thiết kế & Xây dựng

2.1 Thiết kế & Quy hoạch  
2.2 Thi công xây dựng  
2.3 Cơ điện & Hạ tầng kỹ thuật

### Giai đoạn 3 — Lắp đặt & Hoàn thiện

3.1 Lắp đặt máy & dây chuyền  
3.2 Hoàn thiện không gian sản xuất  
3.3 Kiểm tra & Chạy thử

### Giai đoạn 4 — Vận hành Sản xuất

4.1 Cung ứng đầu vào  
4.2 Quản lý sản xuất & Kiểm soát  
4.3 Giao nhận & Phân phối

### Giai đoạn 5 — Nhân sự & Hậu cần

5.1 Tuyển dụng & Lao động  
5.2 Đời sống & Phúc lợi  
5.3 Đồng phục & Bảo hộ

### Giai đoạn 6 — Mở rộng, Tối ưu & Chuyển đổi

6.1 Mở rộng công suất  
6.2 Chuẩn hóa & Đánh giá  
6.3 Chuyển đổi & Tái cấu trúc

Mọi stage/phase page phải dẫn tới nhu cầu, category/keyword, product/service, supplier, program và CTA; không tạo taxonomy song song.

---

# PHẦN VI — PAGE MAP P0 + P1

## 22. 37 WORKSTREAM CHÍNH

| # | Canonical/workspace | Mục tiêu |
|---:|---|---|
| 01 | `/` | Trang chủ đưa người dùng vào workflow |
| 02 | `/tro-ly-ai` | Không gian SUPPI & CHAINY |
| 03 | `/dang-nhu-cau` | Mô tả tự nhiên → requirement draft → xác nhận |
| 04 | `/tai-khoan/nhu-cau/[id]` | Theo dõi một nhu cầu |
| 05 | `/nha-cung-ung` | Tìm nguồn theo năng lực; canonical mới của `/doanh-nghiep` |
| 06 | `/nha-cung-ung/[slug]` | Hồ sơ nhà cung ứng |
| 07 | `/san-pham-dich-vu/[slug]` | Chi tiết sản phẩm/dịch vụ |
| 08 | `/nganh-nghe/[slug]` | Category sourcing hub |
| 09 | `/tu-khoa/[slug]` | Buyer-intent landing |
| 10 | `/ban-do-6-giai-doan` | Bản đồ điều hướng vòng đời |
| 11 | `/san-nhu-cau` | Nhu cầu B2B được phép công khai |
| 12 | `/tao-ho-so` | Tạo/claim Organization và chọn role |
| 13 | `/dich-vu` | Trung tâm dịch vụ |
| 14 | `/dich-vu/to-chuc-ket-noi` | Dịch vụ matchmaking/program |
| 15 | `/dich-vu/truyen-thong-doanh-nghiep` | Hồ sơ/video/truyền thông |
| 16 | `/dich-vu/vat-pham-su-kien` | Vật phẩm doanh nghiệp/sự kiện |
| 17 | `/yeu-cau-dich-vu` | Unified service request |
| 18 | `/founding-partner` | Commercial category/keyword partnership |
| 19 | `/admin` | Bàn điều phối nội bộ |
| 20 | `/chuong-trinh` | Danh sách chương trình |
| 21 | `/chuong-trinh/[slug]` | Chi tiết chương trình |
| 22 | `/chuong-trinh/[slug]/dang-ky` | Registration engine |
| 23 | `/chuong-trinh/[slug]/thu-vien` | Media/document library |
| 24 | `/hiep-hoi` | Danh sách hội/hiệp hội; canonical mới của `/hoi-hiep-hoi` |
| 25 | `/hiep-hoi/[slug]` | Hồ sơ hội/hiệp hội |
| 26 | `/khu-cong-nghiep` | Khám phá hệ sinh thái theo KCN |
| 27 | `/khu-cong-nghiep/[slug]` | KCN như node điều phối địa bàn |
| 28 | `/nha-may` | Danh sách nhà máy |
| 29 | `/nha-may/[slug]` | Factory buy/sell profile |
| 30 | `/catalogue` | Catalogue/ấn phẩm discovery |
| 31 | `/catalogue/[slug]` | Edition/entry/live profile |
| 32 | `/tai-tro` | Tài trợ hoạt động cụ thể |
| 33 | `/doi-tac-phat-trien` | Referral/business development |
| 34 | `/dich-vu/hien-dien-tu-xa` | Remote presence có phạm vi |
| 35 | `/bo-ho-so/[slug]` | Sourcing dossier theo tiêu chí |
| 36 | `/giai-doan/[slug]` | Nhu cầu theo giai đoạn |
| 37 | `/hop-tac` | Router đúng loại quan hệ hợp tác |

Các route phụ đang có: hệ sinh thái, thị trường, tuyển dụng, bản đồ Việt Nam, Todzung, pháp lý, auth và các alias. Không mở rộng chúng thành P2 khi task không yêu cầu.

## 23. TRANG CHỦ

Trang chủ là điểm bắt đầu công việc, không phải corporate brochure.

H1 tham chiếu:

> **Kết nối nhu cầu nhà máy với nhà cung ứng phù hợp**

Supporting copy:

> CHUOICUNGUNG.COM hỗ trợ doanh nghiệp tìm nguồn cung theo năng lực, địa bàn và nhóm nhu cầu. Hồ sơ, chương trình gặp gỡ và đội điều phối giúp các bên chuẩn bị trao đổi và theo dõi công việc tiếp theo.

Entry point:

- Tôi cần tìm nhà cung ứng → `/dang-nhu-cau` hoặc SUPPI.
- Tôi muốn giới thiệu năng lực → `/tao-ho-so`.
- Tôi muốn tổ chức kết nối → `/dich-vu/to-chuc-ket-noi`.

Thứ tự nội dung ưu tiên:

1. Hero + AI need/search.
2. Entry points theo job.
3. Nhóm nhu cầu/chuyên mục.
4. Quy trình.
5. Chương trình.
6. 6 giai đoạn.
7. Nhà cung ứng/bộ hồ sơ.
8. Hội/KCN/Nhà máy.
9. Dịch vụ.
10. Hợp tác.
11. Final CTA.

Không để sponsor banner, mascot, animation hoặc decoration che search/CTA.

## 24. HEADER

Desktop tham chiếu:

```text
Logo | Tìm nguồn cung | Nhu cầu | 6 Giai đoạn | Chương trình | Hệ sinh thái | Dịch vụ | Hợp tác
                                                        Search | Đăng nhu cầu | Đăng nhập/Account
```

`Đăng nhu cầu` là CTA thường trực. Mobile menu phải dùng được bằng bàn phím, không che nội dung và không tạo overflow.

## 25. SÀN NHU CẦU

Chỉ public requirement có quyền chia sẻ.

Luồng:

```text
REQUIREMENT
→ PUBLIC SUMMARY
→ SUPPLIER DISCOVERY
→ SUPPLIER RESPONSE
→ ADMIN REVIEW
→ SUPPLIER MATCH
→ CONNECTION
→ CHAINY FOLLOW-UP
```

Public projection không lộ email, phone, contact nội bộ hoặc dữ liệu commercial nhạy cảm.

## 26. SUPPLIER SEARCH/PROFILE

Không trả lại hàng nghìn doanh nghiệp mà không giải thích.

Search theo:

- sản phẩm/dịch vụ;
- capability;
- category;
- tỉnh/KCN/service area;
- quantity/MOQ;
- lead time;
- availability;
- certification/evidence.

Supplier card cần:

- tên;
- năng lực chính;
- địa bàn;
- quy mô phù hợp;
- evidence status có nguồn;
- ngày cập nhật;
- lý do match.

Không fake rating, “Top Supplier” hoặc verified toàn cục.

## 27. PROGRAM

Phải tách:

- interest;
- registration;
- review;
- payment;
- attendance;
- meeting;
- follow-up;
- outcome.

Expired/cancelled/postponed program phải có trạng thái và CTA đúng. Program không phải hệ thống rời; nó tăng tốc workflow nhu cầu → match → meeting → outcome.

## 28. CATALOGUE

Catalogue là discovery/curation layer, không phải PDF dump.

- Printed edition là snapshot lịch sử.
- Live supplier profile là nguồn hiện tại.
- QR dẫn về live profile/context.
- QR scan không phải requirement, meeting hoặc transaction.
- Entry chỉ public khi được duyệt.
- Sponsor placement phải có nhãn và không thay organic matching.

## 29. ASSOCIATION, KCN, FACTORY

Association:

- chỉ hiển thị membership/relationship đã xác nhận;
- không bảo chứng năng lực;
- liên kết program, nhu cầu, supplier group, catalogue, outcome được phép công bố.

KCN:

- liên kết nhà máy, nhu cầu, supply gap, suppliers serving, program, catalogue;
- dữ liệu occupancy/area phải có nguồn/ngày;
- không biến thành quảng cáo bất động sản.

Factory:

- gắn Organization + facility/factory;
- có thể BUY và SUPPLY;
- public purchase data phải tuân privacy;
- không gắn FDI nếu record không có căn cứ.

## 30. SERVICE, SPONSORSHIP VÀ PARTNERSHIP

`/dich-vu` phải dẫn tới workflow và deliverable, không chỉ card brochure.

`/tai-tro`:

- program;
- catalogue;
- media;
- merchandise;
- hoạt động cụ thể.

`/founding-partner`:

- category/keyword cluster;
- agreement;
- scope;
- entitlement;
- delivery evidence;
- không matching privilege.

`/doi-tac-phat-trien`:

- application;
- agreement;
- referral attribution;
- qualified outcome;
- settlement;
- refund adjustment.

`/hop-tac` phải phân luồng Association/KCN/Sponsor/Founding Partner/Development Partner/Advisor/Investor; không gom tất cả thành “đối tác chiến lược”.

Nếu một công ty vừa sponsor vừa investor:

- hai relationship;
- hai agreement;
- hai cash flow.

## 31. ADMIN

Admin workflow trung tâm:

> **ĐĂNG NHU CẦU | TÌM NGUỒN | KẾT NỐI | THEO DÕI | KẾT QUẢ**

Admin cần thống nhất:

- permissions/RBAC;
- requirement;
- organization/supplier;
- matching/shortlist;
- connection;
- program;
- service;
- partnership/sponsorship;
- task;
- finance;
- audit.

Dashboard phải trả lời:

1. Có nhu cầu mới nào?
2. Nhu cầu nào chưa tìm được nguồn?
3. Kết nối nào quá hạn next action?
4. Task nào quá hạn?
5. Kết quả nào cần xác nhận?

Không coi localStorage admin state là production. Mọi mutation production cần API, server validation, authorization và audit.

---

# PHẦN VII — ROUTING, SEO VÀ URL

## 32. CANONICAL URL POLICY

- lowercase;
- không dấu;
- dùng dấu gạch ngang;
- mô tả đúng intent;
- chứa keyword tự nhiên;
- không keyword stuffing;
- homepage `/` là ngoại lệ;
- không đổi URL đã dùng chỉ để nhét keyword.

Nếu đổi URL:

- xác minh entity;
- 301 public;
- 308 chỉ cho alias nội bộ phù hợp;
- bảo toàn query string;
- cập nhật internal links;
- cập nhật canonical;
- cập nhật sitemap;
- kiểm tra QR/deep link;
- không redirect ghost entity về homepage.

Registry hiện có:

- 154 canonical URL.
- 127 public.
- 27 workspace/admin private trong registry; auth public route phải noindex.
- 17 redirect registry.
- 5 ghost entity trả 404/410.

Source of truth: `danh_sach_url_website.txt`.

## 33. PUBLIC PAGE SEO

Mỗi public indexable page:

- đúng một `main`;
- đúng một H1;
- H1 có dấu tiếng Việt;
- title cùng intent với H1;
- unique meta description;
- self-canonical;
- Open Graph/Twitter phù hợp;
- structured data chỉ khi dữ liệu đáp ứng schema;
- breadcrumb;
- internal link theo quan hệ thật;
- published/public gate;
- có trạng thái 404 thật cho entity không tồn tại.

Private routes:

- `/admin`: noindex, nofollow và server auth.
- `/tai-khoan`: noindex, nofollow và server auth.
- `/dang-nhap`, `/dang-ky`: noindex.
- Không đưa private/auth/admin vào sitemap.

## 34. SEO HIỆN TRẠNG CẦN BIẾT

- Metadata gốc nằm trong `index.html`.
- Nhiều page tự mutation `document.title`, meta và canonical bằng effect.
- Live audit ghi nhận 68 URL dùng title trang chủ và 87 URL dùng meta chung.
- Nhiều child route canonical về trang chủ.
- `EnterpriseDetailPage` còn tạo canonical `/doanh-nghiep/[slug]` trong khi registry canonical là `/nha-cung-ung`.
- Static sitemap trong `server/routes/seo.js` dùng stage slugs cũ, không khớp registry.
- Client catch-all hiện render HomePage, có nguy cơ soft-404.
- Sitemap dynamic query tìm field `slug` nhưng một số current model chưa khai báo slug.
- Phải hợp nhất SEO resolver thay vì tiếp tục thêm effect rời rạc.

## 35. REDIRECT VÀ GHOST ENTITY

13 public 301 và 4 admin 308 đã khai báo trong `server/routes/redirects.js`.

Ghost entity hiện có:

- `/nha-cung-ung/ORG-PROSER-001`
- `/nha-may/FAC-PROSER-FACTORY-1`
- `/hiep-hoi/VAMI-MECHANICAL`
- `/hiep-hoi/HAWA-WOOD`
- `/chuong-trinh/hoi-nghi-giao-thuong-fdi-2026`

Các route này không được soft-redirect về homepage.

---

# PHẦN VIII — UI/UX, CONTENT VÀ ACCESSIBILITY

## 36. DESIGN PRINCIPLES

Mục tiêu:

- gọn;
- rõ;
- nhanh;
- chuyên nghiệp;
- B2B;
- data-first;
- action-oriented.

Mỗi section:

- một ý chính;
- một hành động;
- không lặp CTA dày;
- không dùng 100vh/min-h-screen nếu tạo block trống;
- không render section rỗng;
- không ép layout quá chật;
- data state phải có loading, empty, error và retry phù hợp.

Brand tokens hiện có:

- Primary dark: `#072847`
- Primary: `#0b3f6d`
- Brand light: `#0e8ce4`
- Heading: Space Grotesk
- Body config: FzPoppins/Poppins; `index.html` còn tải Inter từ Google Fonts
- Accent blue/green/orange/purple/red/yellow

Antigravity không tự redesign nếu task là backend/database hoặc content-only.

## 37. RESPONSIVE

- Mobile-first audit.
- Breakpoint tối thiểu 375, 768, 1280.
- Không horizontal overflow.
- CTA không bị fixed banner che.
- Drawer/menu dùng được.
- Filter mobile phải thu gọn hợp lý.
- Map cần text alternative.
- Table admin cần responsive strategy, không chỉ overflow vô hạn.
- Skeleton phải có chiều cao ổn định để giảm layout shift.

## 38. ACCESSIBILITY

- Input/select/textarea có label lập trình được.
- Form error gắn field và focus.
- Modal có focus trap, Esc và restore focus.
- Menu/map/filter dùng được bằng bàn phím.
- Ảnh meaningful có alt; decorative image dùng alt rỗng.
- Kết quả tìm kiếm/AI dùng aria-live phù hợp.
- Màu và trạng thái không truyền đạt bằng màu duy nhất.
- Một main/page và heading hierarchy logic.

## 39. CONTENT RULES

- Tiếng Việt tự nhiên, ngắn, như trao đổi công việc.
- Không viết jargon khi không cần.
- Không nói “tốt nhất”, “hàng đầu”, “đã KYC”, “FDI” hoặc con số lớn nếu không có định nghĩa/nguồn.
- Không dùng “bảo chứng năng lực” cho hội/hiệp hội.
- Không biến category/keyword page thành doorway page.
- Không copy cùng một đoạn cho hàng chục landing page.
- Mỗi landing phải có intent, dữ liệu và CTA riêng.
- Mọi claim có source, source date và verification state.

---

# PHẦN IX — BACKEND/API/SECURITY

## 40. GENERAL API HIỆN CÓ

- `GET /api/status`
- `GET /api/enterprises`
- `GET /api/enterprises/:id`
- `GET /api/categories`
- `GET /api/categories/alphabetical`
- `GET /api/factories`
- `GET /api/factories/:id`
- `GET /api/demands`
- `POST /api/demands`
- `GET /api/industrial-parks`
- `GET /api/industrial-parks/:id`

Operational endpoints:

- `GET /healthz`: liveness.
- `GET /readyz`: Mongo readiness.
- `GET /robots.txt`.
- `GET /sitemap.xml`.

Unknown `/api` phải trả JSON 404, không trả SPA HTML.

Fallback behavior hiện tại:

- Khi MongoDB không kết nối, enterprise/factory/KCN đọc JSON local.
- Demand GET trả empty nếu MongoDB không kết nối.
- Demand POST hiện có thể trả success với record tạm nhưng không persist.
- API cho phép `limit=all` và payload lớn; cần hạn mức production rõ.

## 41. SECURITY BLOCKERS HIỆN TẠI

P0:

1. Client source chứa fallback Gemini credential; phải revoke/rotate và loại khỏi bundle.
2. CORS callback hiện vẫn allow origin không thuộc allowlist.
3. CSP đang disabled.
4. `SESSION_SECRET` có default cố định trong source.
5. “Authenticated” header chưa được verify bằng session/JWT.
6. SUPPI conversation/draft ownership chưa được enforce đầy đủ ở route.
7. Admin UI chưa có server RBAC thực.
8. Nhiều write workflow chỉ dùng localStorage.
9. Error response một số API trả raw `error.message`.
10. In-memory rate limiter không phù hợp multi-instance và có thể cần Redis/gateway.
11. NoSQL sanitizer là custom recursive delete; không thay thế validation schema.
12. Public/static fallback và server deployment routing cần chặn soft-404/API fallback.

Nguyên tắc:

- deny by default;
- validate server-side;
- ownership trong query;
- RBAC server-side;
- PII minimization;
- audit mutation;
- secret chỉ ở server secret manager/env;
- idempotency cho create;
- rate limit theo endpoint/user/IP;
- request ID;
- không log secrets/PII;
- không trả stack/raw internal error;
- production CORS allowlist thật.

## 42. PRIVACY

- Public requirement phải dùng public projection.
- Không public authorEmail/authorPhone.
- Không dùng localStorage như bằng chứng xóa dữ liệu server.
- Các tuyên bố GDPR/Nghị định 13 trên UI phải khớp chức năng backend thật.
- Consent lưu mục đích, version, timestamp, source.
- Right-to-delete cần authentication, scope, retention/legal hold và audit; không chỉ `localStorage.clear`.
- Catalogue/program/media download cần permission thật nếu restricted.
- Không public dữ liệu mua hàng nhà máy khi chưa được phép.

---

# PHẦN X — PERFORMANCE VÀ SEARCH DATA DELIVERY

## 43. PERFORMANCE PRINCIPLES

Đo:

- TTFB
- FCP
- LCP
- CLS
- TBT
- INP nếu có
- JS/CSS/font
- image/video/PDF
- third-party
- API payload
- database query/index

Target tham chiếu:

- LCP ≤ 2,5 giây
- INP ≤ 200 ms
- CLS ≤ 0,1

Không bịa metric.

## 44. HIỆN TRẠNG PERFORMANCE

- `dist/` khoảng 1,0 GB.
- Build chunk enterprises khoảng 40 MB.
- Factory chunk khoảng 7 MB.
- KCN chunk khoảng 4 MB.
- Public asset khoảng 905 MB.
- Một số landing mất 4–5 giây mới hiện đủ.
- Listing mobile rất dài.
- Trang nhà cung ứng có fixed promo banner che viewport mobile.

Hướng bắt buộc:

- bỏ large dataset khỏi client bundle;
- API pagination/filter/search;
- list/detail projection;
- image/video responsive và lazy load;
- cache/versioning;
- không import JSON lớn ở page component;
- split route/component hợp lý;
- preload có chọn lọc;
- font self-host hoặc nhất quán;
- asset audit trước khi xóa; không xóa asset chỉ vì dung lượng nếu chưa kiểm tra reference.

---

# PHẦN XI — KIỂM THỬ VÀ QUALITY GATE

## 45. TEST HIỆN CÓ

Test files:

- `codex-architecture.test.js`
- `suppi-api.test.js`
- `suppi-data-source.test.js`
- `suppi-drafts.test.js`
- `suppi-hybrid.test.js`
- `suppi-orchestrator.test.js`
- `suppi-responses.test.js`
- `suppi-search.test.js`
- `suppi-tools.test.js`

Coverage intent:

- API content types/404.
- robots/sitemap.
- PII masking.
- validation.
- draft ownership/store behavior.
- idempotency.
- ghost entity.
- redirects.
- sponsor neutrality.
- unpublished exclusion.
- no hallucination.
- conversation memory.
- safe OpenAI parsing.
- rate limiting.
- readiness.

Historical TDD doc ghi nhận SUPPI 15/16 test pass và coverage 84,54%. Tuy nhiên lần chạy audit gần nhất không hoàn tất sạch: 15 pass, 1 skipped, 1 cancelled; `codex-architecture.test.js` treo hơn 139 giây. Không được tuyên bố suite xanh cho tới khi chạy lại hiện trạng.

## 46. REQUIRED GATES

Trước pilot:

1. Unit tests.
2. API integration tests.
3. Route smoke test đủ canonical.
4. Redirect/404/410 test.
5. Metadata/canonical snapshot.
6. Accessibility scan + keyboard.
7. Responsive 375/768/1280.
8. Lighthouse CI template đại diện.
9. Authorization/IDOR tests.
10. Search neutrality tests.
11. PII leak tests.
12. Build không warning nghiêm trọng.
13. Test process thoát sạch, không hang/open handle.
14. DB migration dry-run + collision report khi có migration.
15. Rollback plan.

---

# PHẦN XII — LIVE AUDIT SNAPSHOT 30/09/2026

## 47. NHỮNG GÌ ĐANG TỐT

- 154/154 canonical URL đã được mở kiểm tra.
- Hệ sinh thái bao phủ đúng entity/role.
- Slug public phần lớn có keyword hợp lý.
- Hầu hết trang render được có một H1.
- Không phát hiện horizontal overflow desktop.
- 9 template mobile đại diện không tràn ngang 375 px.
- 6 giai đoạn/18 pha tạo cấu trúc internal linking tốt.
- Core SUPPI tools, draft guard và sponsor neutrality đã có code/test.

## 48. P0 LIVE BLOCKERS

- Hai catalogue detail lỗi `ArrowUpRight is not defined`.
- `/founding-partner` lỗi `Clock is not defined`.
- 23 admin URL lỗi `Calendar is not defined`.
- Ba product detail cùng nhận sai supplier/title/meta của Công ty Hoàng Long/Báo cáo FS Đồng Nai.
- Auth/private/admin hiện có robots/index vấn đề.
- Client-side exposed Gemini credential là security incident cần rotate.

## 49. P1 LIVE ISSUES

- 68 URL dùng title trang chủ.
- 87 URL dùng meta chung.
- Nhiều child canonical về homepage.
- H1 ngành/từ khóa không dấu.
- 11 trang có 2 main.
- Nhiều form/filter thiếu label.
- KCN và Bản đồ Việt Nam mỗi trang có 20 ảnh thiếu alt.
- Mobile page quá dài.
- Internal link và route aliases chưa thống nhất canonical.
- Sitemap static slugs lệch registry.
- Dữ liệu/claim KYC, FDI, rating, “bảo chứng” cần nguồn hoặc loại bỏ.

Chi tiết riêng từng URL nằm ở `phan_tich_154_url_antigravity.txt`.

---

# PHẦN XIII — QUY TẮC IMPLEMENTATION CHO ANTIGRAVITY

## 50. AUDIT-FIRST PROTOCOL

Với mỗi task:

1. Đọc Master Context.
2. Đọc URL registry nếu chạm routing/SEO.
3. Đọc source và test liên quan.
4. Chụp current behavior bằng test/log/screenshot phù hợp.
5. Xác định source of truth.
6. Liệt kê files dự kiến sửa.
7. Phân loại change: UI, content, frontend logic, backend, model, migration, data, SEO.
8. Nếu migration phá dữ liệu, credential, business decision hoặc architecture expansion: dừng và hỏi.
9. Implement tối thiểu đúng scope.
10. Chạy test tương xứng.
11. Báo diff, test, risk, rollback.

## 51. CÁC ĐIỀU ANTIGRAVITY KHÔNG ĐƯỢC TỰ LÀM

- Không rebuild toàn website.
- Không mở page/workstream 38.
- Không mở P2.
- Không tạo marketplace mới.
- Không tạo một directory song song.
- Không đổi design khi task backend/database.
- Không tự deploy.
- Không tự commit.
- Không chạy migration production.
- Không `deleteMany({})`.
- Không seed đè production.
- Không đổi URL không có registry/redirect plan.
- Không xóa untracked/user files.
- Không thay real data bằng mock.
- Không gắn sponsor vào organic matching.
- Không dùng client-only auth cho private data.
- Không tạo fake rating/review/KYC/FDI.
- Không đưa secret vào frontend.
- Không dùng catch-all HomePage thay cho 404 thật.
- Không tuyên bố performance/test pass khi chưa đo.

## 52. CHANGE REPORT FORMAT

Mỗi lần sửa, Antigravity phải trả:

1. Mục tiêu.
2. Current-state evidence.
3. Files thay đổi.
4. Database/migration impact.
5. API/route/SEO impact.
6. Security/privacy impact.
7. Tests đã chạy và kết quả thật.
8. Những gì không thay đổi.
9. Known gaps.
10. Rollback/cách kiểm tra thủ công.

---

# PHẦN XIV — P0/P1 VÀ NGOÀI PHẠM VI

## 53. P0

- Homepage/workflow entry.
- SUPPI/CHAINY workspace.
- Requirement draft/post/workspace.
- Supplier search/profile/product.
- Category/keyword.
- Six-stage map.
- Public demands.
- Organization claim/create.
- Core services.
- Founding Partner.
- Unified admin.
- Core backend/auth/privacy/search/SEO hardening.

## 54. P1

- Program/list/detail/registration/library.
- Association.
- KCN.
- Factory.
- Catalogue.
- Sponsorship.
- Development partner.
- Remote presence.
- Sourcing dossier.
- Stage detail.
- Partnership hub.

## 55. KHÔNG TỰ MỞ P2

Không tự xây:

- advanced buyer enterprise workspace ngoài spec;
- association enterprise workspace mở rộng;
- KCN enterprise workspace mở rộng;
- partner API platform;
- international sourcing expansion;
- advanced sector intelligence dashboard;
- specialized recruitment platform;
- welfare ecosystem mở rộng;
- advanced national GIS;
- payment/marketplace platform mới;
- mobile app native;
- module khác không thuộc task.

---

# PHẦN XV — TÀI LIỆU VÀ NGUỒN TRONG REPOSITORY

## 56. DOCUMENTATION INDEX

Audit hiện trạng:

- `docs/pages/home/HOME_CURRENT_AUDIT.md`
- `docs/pages/tro-ly-ai/AI_WORKSPACE_CURRENT_AUDIT.md`
- `docs/pages/dang-nhu-cau/REQUIREMENT_CURRENT_AUDIT.md`
- `docs/pages/requirement-workspace/WORKSPACE_CURRENT_AUDIT.md`
- `docs/pages/doanh-nghiep/SUPPLIER_SEARCH_CURRENT_AUDIT.md`
- `docs/admin/ADMIN_CURRENT_AUDIT.md`
- `docs/admin/REQUIREMENT_ADMIN_DETAIL_AUDIT.md`
- `docs/admin/SUPPLIER_ADMIN_CURRENT_AUDIT.md`
- `docs/testing/suppi-ai-search.tdd.md`

Project specifications:

- `prompt/1.txt` đến `prompt/37.txt`
- `prompt/audit.txt`
- `prompt/codex_fixed.txt`
- `prompt/pilot_ready.txt`

URL/audit:

- `danh_sach_url_website.txt`
- `phan_tich_154_url_antigravity.txt`

Visual reference:

- `UX UI CHUOICUNGUNG.pdf`

Các tài liệu audit mô tả thời điểm tạo và có thể cũ hơn source. Phải xác minh code/live trước khi sửa.

## 57. GIT/WORKTREE

Tại thời điểm tạo Master Context:

- branch: `main`;
- working tree có nhiều modified, deleted và untracked files;
- nhiều thay đổi là tài sản của người dùng;
- không reset, checkout, clean hoặc xóa để “làm sạch”;
- không dùng trạng thái commit cũ làm đại diện đầy đủ cho code hiện tại.

---

# PHẦN XVI — CANONICAL URL REGISTRY

Danh sách dưới đây là 154 canonical URL từ `danh_sach_url_website.txt`. Redirect và ghost entity được quản lý riêng, không được thêm vào sitemap như canonical.

1. https://chuoicungung.com/
2. https://chuoicungung.com/he-sinh-thai
3. https://chuoicungung.com/san-nhu-cau
4. https://chuoicungung.com/dang-nhu-cau
5. https://chuoicungung.com/san-nhu-cau/NC-2026-00125
6. https://chuoicungung.com/nha-cung-ung
7. https://chuoicungung.com/tao-ho-so
8. https://chuoicungung.com/san-pham-dich-vu/dong-phuc-cong-nhan-nha-may-chong-tinh-dien
9. https://chuoicungung.com/san-pham-dich-vu/gia-cong-chi-tiet-may-cnc-chinh-xac-jig-ga
10. https://chuoicungung.com/san-pham-dich-vu/thung-carton-5-lop-song-bc-in-flexo-xuat-khau
11. https://chuoicungung.com/nganh-nghe/co-khi-che-tao
12. https://chuoicungung.com/nganh-nghe/nhua-cao-su-ky-thuat
13. https://chuoicungung.com/nganh-nghe/dien-dien-tu
14. https://chuoicungung.com/nganh-nghe/may-mac-da-giay
15. https://chuoicungung.com/nganh-nghe/bao-bi-in-an
16. https://chuoicungung.com/nganh-nghe/logistics-kho-bai
17. https://chuoicungung.com/nganh-nghe/hoa-chat-cong-nghiep
18. https://chuoicungung.com/nganh-nghe/thep-kim-loai
19. https://chuoicungung.com/nganh-nghe/tu-dong-hoa-robotics
20. https://chuoicungung.com/nganh-nghe/xay-dung-nha-xuong
21. https://chuoicungung.com/nganh-nghe/co-dien-hvac-pccc
22. https://chuoicungung.com/nganh-nghe/dien-mat-troi-nang-luong-tai-tao
23. https://chuoicungung.com/nganh-nghe/xu-ly-moi-truong-nuoc-thai
24. https://chuoicungung.com/nganh-nghe/thiet-bi-y-te-duoc-pham
25. https://chuoicungung.com/nganh-nghe/che-bien-thuc-pham-do-uong
26. https://chuoicungung.com/nganh-nghe/go-noi-that-cong-nghiep
27. https://chuoicungung.com/nganh-nghe/dong-phuc-bao-ho-lao-dong
28. https://chuoicungung.com/nganh-nghe/vat-lieu-xay-dung-cong-nghiep
29. https://chuoicungung.com/nganh-nghe/cong-nghe-thong-tin-phan-mem-erp
30. https://chuoicungung.com/nganh-nghe/dau-nhot-hoa-chat-boi-tron
31. https://chuoicungung.com/nganh-nghe/khi-cong-nghiep
32. https://chuoicungung.com/nganh-nghe/thu-gom-tai-che-phe-lieu
33. https://chuoicungung.com/nganh-nghe/giay-phep-phap-ly-fdi
34. https://chuoicungung.com/nganh-nghe/suat-an-cong-nghiep
35. https://chuoicungung.com/tu-khoa/cnc-5-truc
36. https://chuoicungung.com/tu-khoa/khuon-mau-chinh-xac
37. https://chuoicungung.com/tu-khoa/dong-phuc-cong-nhan
38. https://chuoicungung.com/tu-khoa/dong-phuc-phong-sach-esd
39. https://chuoicungung.com/tu-khoa/thung-carton-5-lop
40. https://chuoicungung.com/tu-khoa/mang-pe-quan-pallet
41. https://chuoicungung.com/tu-khoa/van-tai-container-kcn
42. https://chuoicungung.com/tu-khoa/khai-thue-hai-quan
43. https://chuoicungung.com/tu-khoa/dien-mat-troi-ap-mai-1mwp
44. https://chuoicungung.com/tu-khoa/tong-thau-epc-solar
45. https://chuoicungung.com/tu-khoa/ket-cau-thep-tien-che
46. https://chuoicungung.com/tu-khoa/lap-dat-he-thong-pccc
47. https://chuoicungung.com/tu-khoa/tram-bien-ap-ha-the
48. https://chuoicungung.com/tu-khoa/son-san-epoxy-nha-xuong
49. https://chuoicungung.com/tu-khoa/phong-sach-gmp
50. https://chuoicungung.com/tu-khoa/jig-ga-lap-rap
51. https://chuoicungung.com/tu-khoa/cat-laser-kim-loai-tam
52. https://chuoicungung.com/tu-khoa/xi-ma-anode-nhom
53. https://chuoicungung.com/tu-khoa/nhua-ep-phu-tung-fdi
54. https://chuoicungung.com/tu-khoa/pallet-go-hun-trung-ispm15
55. https://chuoicungung.com/tu-khoa/xe-nang-hang-dien
56. https://chuoicungung.com/tu-khoa/bang-tai-tu-dong
57. https://chuoicungung.com/tu-khoa/phan-mem-mes-quan-ly-san-xuat
58. https://chuoicungung.com/tu-khoa/kiem-dinh-may-moc-thiet-bi
59. https://chuoicungung.com/tu-khoa/he-thong-loc-bui-cong-nghiep
60. https://chuoicungung.com/tu-khoa/suat-an-cong-nhan-kcn
61. https://chuoicungung.com/tu-khoa/khao-sat-dia-chat-fs
62. https://chuoicungung.com/tu-khoa/chung-chi-xanh-i-rec
63. https://chuoicungung.com/nha-may
64. https://chuoicungung.com/nha-may/samsung-electronics-vietnam-bac-ninh
65. https://chuoicungung.com/nha-may/chuyen-gia-dong-phuc-proser
66. https://chuoicungung.com/khu-cong-nghiep
67. https://chuoicungung.com/khu-cong-nghiep/khu-cong-nghiep-amata-dong-nai
68. https://chuoicungung.com/khu-cong-nghiep/khu-cong-nghiep-vsip-1-binh-duong
69. https://chuoicungung.com/khu-cong-nghiep/khu-cong-nghiep-hiep-phuoc-ho-chi-minh
70. https://chuoicungung.com/hiep-hoi
71. https://chuoicungung.com/hiep-hoi/hoi-doanh-nghiep-co-khi-dien-tp-ho-chi-minh-hame
72. https://chuoicungung.com/hiep-hoi/hiep-hoi-doanh-nghiep-dich-vu-logistics-viet-nam-vla
73. https://chuoicungung.com/dich-vu
74. https://chuoicungung.com/yeu-cau-dich-vu
75. https://chuoicungung.com/dich-vu/truyen-thong-doanh-nghiep
76. https://chuoicungung.com/dich-vu/vat-pham-su-kien
77. https://chuoicungung.com/dich-vu/hien-dien-tu-xa
78. https://chuoicungung.com/dich-vu/to-chuc-ket-noi
79. https://chuoicungung.com/bo-ho-so/dong-phuc-bao-ho-nha-may-dong-nai
80. https://chuoicungung.com/bo-ho-so/bao-bi-thuc-pham-xuat-khau-binh-duong
81. https://chuoicungung.com/chuong-trinh
82. https://chuoicungung.com/chuong-trinh/vsip-binh-duong/dang-ky
83. https://chuoicungung.com/chuong-trinh/vsip-binh-duong
84. https://chuoicungung.com/chuong-trinh/vsip-binh-duong/thu-vien
85. https://chuoicungung.com/catalogue
86. https://chuoicungung.com/catalogue/nha-cung-ung-dong-phuc-bao-ho-2026
87. https://chuoicungung.com/catalogue/catalogue-ngay-hoi-chuoi-cung-ung-dong-nai-2026
88. https://chuoicungung.com/ban-do-6-giai-doan
89. https://chuoicungung.com/dinh-vi-doanh-nghiep
90. https://chuoicungung.com/giai-doan/chuan-bi-dau-tu
91. https://chuoicungung.com/giai-doan/thiet-ke-xay-dung
92. https://chuoicungung.com/giai-doan/lap-dat-hoan-thien
93. https://chuoicungung.com/giai-doan/van-hanh-san-xuat
94. https://chuoicungung.com/giai-doan/nhan-su-hau-can
95. https://chuoicungung.com/giai-doan/mo-rong-toi-uu-chuyen-doi
96. https://chuoicungung.com/pha/khao-sat-dinh-huong
97. https://chuoicungung.com/pha/phap-ly-thu-tuc
98. https://chuoicungung.com/pha/chon-dia-diem-mat-bang
99. https://chuoicungung.com/pha/thiet-ke-quy-hoach
100. https://chuoicungung.com/pha/thi-cong-xay-dung
101. https://chuoicungung.com/pha/co-dien-ha-tang-ky-thuat
102. https://chuoicungung.com/pha/lap-dat-may-day-chuyen
103. https://chuoicungung.com/pha/hoan-thien-khong-gian-san-xuat
104. https://chuoicungung.com/pha/kiem-tra-chay-thu
105. https://chuoicungung.com/pha/cung-ung-dau-vao
106. https://chuoicungung.com/pha/quan-ly-san-xuat-kiem-soat
107. https://chuoicungung.com/pha/giao-nhan-phan-phoi
108. https://chuoicungung.com/pha/tuyen-dung-lao-dong
109. https://chuoicungung.com/pha/doi-song-phuc-loi
110. https://chuoicungung.com/pha/dong-phuc-bao-ho
111. https://chuoicungung.com/pha/mo-rong-cong-suat
112. https://chuoicungung.com/pha/chuan-hoa-danh-gia
113. https://chuoicungung.com/pha/chuyen-doi-tai-cau-truc
114. https://chuoicungung.com/hop-tac
115. https://chuoicungung.com/founding-partner
116. https://chuoicungung.com/tai-tro
117. https://chuoicungung.com/doi-tac-phat-trien
118. https://chuoicungung.com/thi-truong
119. https://chuoicungung.com/tuyen-dung/viec-tim-nguoi
120. https://chuoicungung.com/tuyen-dung/nguoi-tim-viec
121. https://chuoicungung.com/ban-do-viet-nam
122. https://chuoicungung.com/tro-ly-ai
123. https://chuoicungung.com/todzung
124. https://chuoicungung.com/phap-ly/thoa-thuan-dich-vu-b2b
125. https://chuoicungung.com/phap-ly/chinh-sach-bao-mat-du-lieu
126. https://chuoicungung.com/dang-nhap
127. https://chuoicungung.com/dang-ky
128. https://chuoicungung.com/tai-khoan/nhu-cau
129. https://chuoicungung.com/tai-khoan/nhu-cau/NC-2026-00125
130. https://chuoicungung.com/tai-khoan/yeu-cau-dich-vu
131. https://chuoicungung.com/tai-khoan/chuong-trinh
132. https://chuoicungung.com/admin
133. https://chuoicungung.com/admin/danh-muc
134. https://chuoicungung.com/admin/tu-khoa
135. https://chuoicungung.com/admin/giai-doan
136. https://chuoicungung.com/admin/nhu-cau
137. https://chuoicungung.com/admin/dich-vu
138. https://chuoicungung.com/admin/yeu-cau-quan-ly-ho-so
139. https://chuoicungung.com/admin/to-chuc
140. https://chuoicungung.com/admin/founding-partner
141. https://chuoicungung.com/admin/pipeline
142. https://chuoicungung.com/admin/connections
143. https://chuoicungung.com/admin/chuong-trinh
144. https://chuoicungung.com/admin/khu-cong-nghiep
145. https://chuoicungung.com/admin/nha-may
146. https://chuoicungung.com/admin/catalogue
147. https://chuoicungung.com/admin/tai-tro
148. https://chuoicungung.com/admin/doi-tac-phat-trien
149. https://chuoicungung.com/admin/hop-tac
150. https://chuoicungung.com/admin/hien-dien-tu-xa
151. https://chuoicungung.com/admin/bo-ho-so
152. https://chuoicungung.com/admin/tasks
153. https://chuoicungung.com/admin/tai-chinh
154. https://chuoicungung.com/admin/logs

---

# PHẦN XVII — SOURCE INVENTORY INDEX

Inventory này giúp Antigravity định vị source. Public binary asset không liệt kê từng file vì có khoảng 2.938 file; phải dùng search/reference audit trước khi sửa hoặc xóa asset.

```text
src/pages/AdminDashboardPage.jsx
src/pages/AiWorkspacePage.jsx
src/pages/AssociationDetailPage.jsx
src/pages/AssociationsPage.jsx
src/pages/AuthPage.jsx
src/pages/B2bPrivacyPolicyPage.jsx
src/pages/B2bTermsOfServicePage.jsx
src/pages/CatalogueDetailPage.jsx
src/pages/CataloguesPage.jsx
src/pages/CreateProfilePage.jsx
src/pages/DemandDetailPage.jsx
src/pages/DemandWorkspacePage.jsx
src/pages/DemandsPage.jsx
src/pages/DevelopmentPartnerPage.jsx
src/pages/DiagnosticQuizPage.jsx
src/pages/EcosystemOverviewPage.jsx
src/pages/EnterpriseDetailPage.jsx
src/pages/EnterprisesPage.jsx
src/pages/FactoriesPage.jsx
src/pages/FactoryDetailPage.jsx
src/pages/FoundingPartnerPage.jsx
src/pages/HomePage.jsx
src/pages/IndustrialParkDetailPage.jsx
src/pages/IndustrialParksPage.jsx
src/pages/IndustryCategoryPage.jsx
src/pages/KeywordDetailPage.jsx
src/pages/MarketDashboardPage.jsx
src/pages/MatchmakingServicePage.jsx
src/pages/MediaBrandingServicePage.jsx
src/pages/MerchandiseEventServicePage.jsx
src/pages/PartnershipHubPage.jsx
src/pages/PhaseDetailPage.jsx
src/pages/PostDemandPage.jsx
src/pages/ProductServiceDetailPage.jsx
src/pages/ProgramDetailPage.jsx
src/pages/ProgramLibraryPage.jsx
src/pages/ProgramRegistrationPage.jsx
src/pages/RecruitmentPage.jsx
src/pages/RemotePresenceServicePage.jsx
src/pages/ServiceRequestPage.jsx
src/pages/ServicesCenterPage.jsx
src/pages/SixStagesMapPage.jsx
src/pages/SourcingDossierDetailPage.jsx
src/pages/SponsorshipPage.jsx
src/pages/StageDetailPage.jsx
src/pages/SuppiSearchPage.jsx
src/pages/SupplyChainExpoPage.jsx
src/pages/SupplyChainExpoRegistrationPage.jsx
src/pages/ToDzungPortfolioPage.jsx
src/pages/UserProgramsWorkspacePage.jsx
src/pages/UserRequestsWorkspacePage.jsx
src/pages/VietnamMapPage.jsx
src/pages/phases/Phase1_1Page.jsx
src/pages/phases/Phase1_2Page.jsx
src/pages/phases/Phase1_3Page.jsx
src/pages/phases/Phase2_1Page.jsx
src/pages/phases/Phase2_2Page.jsx
src/pages/phases/Phase2_3Page.jsx
src/pages/phases/Phase3_1Page.jsx
src/pages/phases/Phase3_2Page.jsx
src/pages/phases/Phase3_3Page.jsx
src/pages/phases/Phase4_1Page.jsx
src/pages/phases/Phase4_2Page.jsx
src/pages/phases/Phase4_3Page.jsx
src/pages/phases/Phase5_1Page.jsx
src/pages/phases/Phase5_2Page.jsx
src/pages/phases/Phase5_3Page.jsx
src/pages/phases/Phase6_1Page.jsx
src/pages/phases/Phase6_2Page.jsx
src/pages/phases/Phase6_3Page.jsx
src/pages/phases/index.js

---COMPONENTS---
src/components/BrandLogo.jsx
src/components/CVAnalysisAndMatchingModal.jsx
src/components/ClickUpBrainMatrixSection.jsx
src/components/ClickUpBrainSearchBar.jsx
src/components/DualMascotInteractive.jsx
src/components/Footer.jsx
src/components/FormattedAiMessage.jsx
src/components/FoundingPartnerCard.jsx
src/components/HeroLifecycleWheel.jsx
src/components/InteractiveExplodedFlower3D.jsx
src/components/InteractiveLifecycleFlow.jsx
src/components/InteractivePhaseWheel.jsx
src/components/InteractiveVietnamMap.jsx
src/components/LanguageSwitcher.jsx
src/components/Mascot.jsx
src/components/Navbar.jsx
src/components/NetworkBackground.jsx
src/components/NumerologyModal.jsx
src/components/SearchModal.jsx
src/components/SuppliMascot.jsx
src/components/SupplierTopNavigationBlocks.jsx
src/components/SupplyChainExpoWidget.jsx
src/components/SupplyChainPipelineFlow.jsx
src/components/WovenClothFlag.jsx
src/components/admin/AdminAssociationsManagement.jsx
src/components/admin/AdminCataloguesManagement.jsx
src/components/admin/AdminCategoriesManagement.jsx
src/components/admin/AdminClaimsManagement.jsx
src/components/admin/AdminConnectionsManagement.jsx
src/components/admin/AdminDataQualityQueue.jsx
src/components/admin/AdminDemandsManagement.jsx
src/components/admin/AdminDevelopmentPartnersManagement.jsx
src/components/admin/AdminFactoriesManagement.jsx
src/components/admin/AdminFinanceBoard.jsx
src/components/admin/AdminFoundingPartnersManagement.jsx
src/components/admin/AdminIndustrialParksManagement.jsx
src/components/admin/AdminKeywordsManagement.jsx
src/components/admin/AdminMediaProjectsManagement.jsx
src/components/admin/AdminMerchandiseManagement.jsx
src/components/admin/AdminPartnershipHubManagement.jsx
src/components/admin/AdminProgramsManagement.jsx
src/components/admin/AdminRemotePresenceManagement.jsx
src/components/admin/AdminServicesManagement.jsx
src/components/admin/AdminSourcingDossiersManagement.jsx
src/components/admin/AdminSponsorshipsManagement.jsx
src/components/admin/AdminStagesManagement.jsx
src/components/admin/AdminTasksAndOverdueCenter.jsx
src/components/admin/AdminUnifiedOverview.jsx
src/components/admin/AdminUnifiedPipelineKanban.jsx
src/components/association/AssociationApiMotionGraphic3D.jsx
src/components/association/AssociationConstellationCanvas.jsx
src/components/auth/AuthModal.jsx
src/components/catalogues/CatalogueBusinessRequestModal.jsx
src/components/catalogues/CatalogueCard.jsx
src/components/catalogues/CatalogueOnlineViewerModal.jsx
src/components/catalogues/CatalogueParticipationModal.jsx
src/components/dashboard/ActionableAlertsList.jsx
src/components/dashboard/FreemiumDiamondModal.jsx
src/components/dashboard/HeatmapProvincesTable.jsx
src/components/dashboard/InteractiveTreemap.jsx
src/components/dashboard/MacroKpiSparklines.jsx
src/components/dashboard/PredictiveAiRadar.jsx
src/components/dashboard/RealtimeDealsTicker.jsx
src/components/demands/B2bTradeNetworkCanvas.jsx
src/components/demands/FastRfqModal.jsx
src/components/demands/KycPaywallModal.jsx
src/components/demands/LiveDemandToast.jsx
src/components/demands/OneClickApplyModal.jsx
src/components/demands/SuppiDemandAssistantModal.jsx
src/components/demands/SupplierResponseModal.jsx
src/components/factories/FactoryCard.jsx
src/components/factories/FactoryConnectionModal.jsx
src/components/factories/FactoryHeatmapMapSection.jsx
src/components/factories/FactoryHunterSidebar.jsx
src/components/factories/FactoryKycPaywallModal.jsx
src/components/factories/FactoryProcurementTicker.jsx
src/components/factories/FactorySubmitRfqModal.jsx
src/components/home/ActiveDemandsSection.jsx
src/components/home/B2BProgramsMarquee3D.jsx
src/components/home/B2BProgramsSection.jsx
src/components/home/EcosystemDataDirectory.jsx
src/components/home/EcosystemDirectorySection.jsx
src/components/home/HomeMatchingHub.jsx
src/components/home/HowItWorksWorkflow.jsx
src/components/home/IndustrialBlueprintCards.jsx
src/components/home/StaggerRoleCards.jsx
src/components/home/SuppiChainyConciseSection.jsx
src/components/home/SupplyChainExpoPaper3D.jsx
src/components/home/TrustAndPrinciplesSection.jsx
src/components/home/UnifiedRoleSection.jsx
src/components/home/VerifiedSuppliersSection.jsx
src/components/kcn/KcnAdvancedLandFilter.jsx
src/components/kcn/KcnBrochureModal.jsx
src/components/kcn/KcnCard.jsx
src/components/kcn/KcnCrossSellBanner.jsx
src/components/kcn/KcnGisMap.jsx
src/components/kcn/KcnSiteVisitModal.jsx
src/components/phase/PhaseDetailLayout.jsx
src/components/programs/ProgramCard.jsx
src/components/programs/ProgramCompletedRecapModal.jsx
src/components/programs/ProgramCustomNotificationBlock.jsx
src/components/programs/ProgramInterestModal.jsx
src/components/programs/ProgramSuppiGuideModal.jsx
src/components/recruitment/RecruitmentCareerNetworkCanvas.jsx
src/components/six-stages/CaseStudiesSection.jsx
src/components/six-stages/LiveMatchTicker.jsx
src/components/six-stages/MoUModal.jsx
src/components/six-stages/StickyPhaseCTA.jsx
src/components/six-stages/ThreeLayerKYCSection.jsx
src/components/stage/StageFilterSidebar.jsx
src/components/stage/StageRequestQuoteModal.jsx
src/components/stage/StageSupplierCard.jsx
src/components/suppliers/SupplierCompareModal.jsx
src/components/suppliers/SupplierRegistrationModal.jsx
src/components/suppliers/SupplierRequestQuoteModal.jsx
src/components/ui/carousel-squeeze.jsx
src/components/ui/carousel-squeeze.tsx
src/components/ui/testimonials-columns-1.jsx
src/components/ui/testimonials-columns-1.tsx

---SERVER---
server/.DS_Store
server/app.js
server/db.js
server/index.js
server/middleware/security.js
server/models/Demand.js
server/models/Enterprise.js
server/models/Factory.js
server/models/IndustrialPark.js
server/models/Organization.js
server/models/RequirementDraft.js
server/models/SearchDocument.js
server/models/SuppiConversation.js
server/routes/api.js
server/routes/redirects.js
server/routes/seo.js
server/routes/suppi.js
server/scripts/backfillOrganizations.js
server/scripts/buildCompleteSearchIndex.js
server/scripts/buildSuppiSearchDocuments.js
server/scripts/cleanAndEnrichTrangVang.js
server/scripts/cleanAndRecrawlAccurateEnterprises.js
server/scripts/crawlAllExactAssociations.js
server/scripts/crawlAllTrangVangGalleriesBatch.js
server/scripts/crawlAssociationLogosFromWeb.js
server/scripts/crawlAuthenticEnterpriseDetails.js
server/scripts/crawlFullTrangVangGalleries.js
server/scripts/crawlIdpvn.js
server/scripts/crawlRealLogosAndWebsites.js
server/scripts/crawlTop45CategoriesFull.js
server/scripts/crawlTrangVangAssociations.js
server/scripts/crawlTrangVangAssociationsMaster.js
server/scripts/crawlTrangVangEnrichListings.js
server/scripts/crawlTrangVangFull.js
server/scripts/crawlTrangVangFullDetails.js
server/scripts/crawlWikipediaAssociationLogos.js
server/scripts/downloadKcnImages.js
server/scripts/encodeAndEnhanceImages.js
server/scripts/enrichAndDeduplicateAllEnterprises.js
server/scripts/enrichEnterprises.js
server/scripts/fastFixAndExtractRealLogos.js
server/scripts/fetchAllAssociationLogosMaster.js
server/scripts/fixAndExtractRealCompanyLogos.js
server/scripts/generateAlphabetCategories.js
server/scripts/generateCategoryImagesMap.py
server/scripts/generateTodzungHtml.js
server/scripts/ingestJsonToMongo.js
server/scripts/inspectImages.js
server/scripts/rewriteOriginalContentAndImages.js
server/scripts/runMasterAutonomousCrawler.js
server/scripts/seedAll480ToMongo.js
server/scripts/seedCompleteSuppliersAndCategories.js
server/scripts/seedLocalDatabase.js
server/scripts/testCategoryPage.js
server/scripts/testCrawlListing.js
server/scripts/testDownloadImages.js
server/scripts/testFindexD.js
server/scripts/testMobileResponsive.js
server/scripts/testPage15Spec.js
server/scripts/testPage16Mobile.js
server/scripts/testPage16Spec.js
server/scripts/testPage17Mobile.js
server/scripts/testPage17Spec.js
server/scripts/testPage18Mobile.js
server/scripts/testPage18Spec.js
server/scripts/testPage19Spec.js
server/scripts/testPage20Spec.js
server/scripts/testPage21Spec.js
server/scripts/testPage22Spec.js
server/scripts/testPage23Spec.js
server/scripts/testPage24Spec.js
server/scripts/testPage25Spec.js
server/scripts/testPage26Spec.js
server/scripts/testPage27Spec.js
server/scripts/testPage28Spec.js
server/scripts/testPage29Spec.js
server/scripts/testPage30Spec.js
server/scripts/testPage31Spec.js
server/scripts/testPage32Spec.js
server/scripts/testPage33Spec.js
server/scripts/testPage34Spec.js
server/scripts/testPage35Spec.js
server/scripts/testPage36Spec.js
server/scripts/testPage37Spec.js
server/scripts/testPilotReadyGates.js
server/scripts/testStealthCrawl.js
server/scripts/testTabsAndGallery.js
server/scripts/updateTranLinhExact.js
server/suppi/atlasHybridSearch.js
server/suppi/conversationStore.js
server/suppi/dataSource.js
server/suppi/draftStore.js
server/suppi/fallbackAssistant.js
server/suppi/openaiResponsesClient.js
server/suppi/orchestrator.js
server/suppi/prompt.js
server/suppi/searchEngine.js
server/suppi/toolRegistry.js
server/testConnection.js
server/tests/codex-architecture.test.js
server/tests/suppi-api.test.js
server/tests/suppi-data-source.test.js
server/tests/suppi-drafts.test.js
server/tests/suppi-hybrid.test.js
server/tests/suppi-orchestrator.test.js
server/tests/suppi-responses.test.js
server/tests/suppi-search.test.js
server/tests/suppi-tools.test.js

---DATA---
server/data/associations.json
server/data/categoriesAlphabetical.json
server/data/factoriesFull.json
server/data/industrialParksFull.json
server/data/industryCategories69Pages.json
src/data/adminUnifiedCoordinationData.js
src/data/associations.json
src/data/associationsData.js
src/data/cataloguesData.js
src/data/categoriesAlphabetical.json
src/data/categoryHubData.js
src/data/categoryImagesMap.json
src/data/demandsMapData.json
src/data/developmentPartnerData.js
src/data/enterprisesFull.json
src/data/expoEventsData.js
src/data/factoriesData.js
src/data/factoriesFull.json
src/data/foundingPartners.json
src/data/foundingPartnershipData.js
src/data/industrialParksData.js
src/data/industrialParksFull.json
src/data/industryCategories69Pages.json
src/data/keywordClustersData.js
src/data/mediaContentData.js
src/data/merchandiseEventData.js
src/data/mockData.js
src/data/organizationsData.js
src/data/partnershipHubData.js
src/data/phaseTaxonomyAlphabetical.json
src/data/productServicesData.js
src/data/programLibraryData.js
src/data/programsData.js
src/data/provinceCoordinates.json
src/data/recruitmentData.js
src/data/remotePresenceData.js
src/data/requirementsData.js
src/data/serviceFormEngineData.js
src/data/servicesData.js
src/data/sixStagesData.js
src/data/sourcingDossiersData.js
src/data/sponsorshipData.js
src/data/stageSuppliersData.js
src/data/strategicFoundingPartners.js
src/data/supplierTopCategories.json
src/data/suppliersMapData.json
src/data/vietnamExpressways.json

---DOCS---
docs/admin/ADMIN_CURRENT_AUDIT.md
docs/admin/REQUIREMENT_ADMIN_DETAIL_AUDIT.md
docs/admin/SUPPLIER_ADMIN_CURRENT_AUDIT.md
docs/pages/dang-nhu-cau/REQUIREMENT_CURRENT_AUDIT.md
docs/pages/doanh-nghiep/SUPPLIER_SEARCH_CURRENT_AUDIT.md
docs/pages/home/HOME_CURRENT_AUDIT.md
docs/pages/requirement-workspace/WORKSPACE_CURRENT_AUDIT.md
docs/pages/tro-ly-ai/AI_WORKSPACE_CURRENT_AUDIT.md
docs/testing/suppi-ai-search.tdd.md
prompt/1.txt
prompt/10.txt
prompt/11.txt
prompt/12.txt
prompt/13.txt
prompt/14.txt
prompt/15.txt
prompt/16.txt
prompt/17.txt
prompt/18.txt
prompt/19.txt
prompt/2.txt
prompt/20.txt
prompt/21.txt
prompt/22.txt
prompt/23.txt
prompt/24.txt
prompt/25.txt
prompt/26.txt
prompt/27.txt
prompt/28.txt
prompt/29.txt
prompt/3.txt
prompt/30.txt
prompt/31.txt
prompt/32.txt
prompt/33.txt
prompt/34.txt
prompt/35.txt
prompt/36.txt
prompt/37.txt
prompt/4.txt
prompt/5.txt
prompt/6.txt
prompt/7.txt
prompt/8.txt
prompt/9.txt
prompt/audit.txt
prompt/codex_fixed.txt
prompt/pilot_ready.txt

```

---

# PHẦN XVIII — DEFINITION OF READY / DONE

## 58. READY ĐỂ BẮT ĐẦU MỘT TASK

Một task chỉ ready khi:

- có URL/module cụ thể;
- có mục tiêu nghiệp vụ;
- có audience;
- có source of truth;
- có phạm vi UI/backend/data;
- có acceptance criteria;
- đã biết có migration hay không;
- đã biết dữ liệu production có bị chạm hay không.

## 59. DONE

Không coi là done chỉ vì UI render.

Done khi:

- workflow chính chạy end-to-end;
- dữ liệu đúng source of truth;
- auth/ownership đúng;
- không lộ PII;
- route/status/canonical đúng;
- empty/error/loading states đúng;
- responsive/accessibility đạt;
- test pass và process thoát sạch;
- không làm hỏng redirect/SEO;
- không tạo duplicate entity;
- không đưa sponsor vào organic rank;
- không để write action vượt xác nhận;
- có báo cáo thay đổi và rollback.

---

# PHẦN XIX — CÂU LỆNH KHỞI ĐỘNG GỢI Ý CHO ANTIGRAVITY

> Đọc toàn bộ file `CHUOICUNGUNG_MASTER_CONTEXT_FOR_ANTIGRAVITY.md`. Đây là context sản phẩm và kỹ thuật của CHUOICUNGUNG.COM. Trước khi thay đổi, hãy audit source code hiện tại, `git status`, URL registry, model/API/data loader và test liên quan. Phân biệt rõ target architecture với implementation đang có; không giả định localStorage/mock là backend production. Chỉ thực hiện task tôi giao, không mở P2, không đổi URL, không migration/deploy/commit hoặc thay database production nếu chưa được yêu cầu. Database là source of truth; không bịa dữ liệu; tài trợ không ảnh hưởng matching; hội/hiệp hội không bảo chứng năng lực. Trả current-state evidence, plan ngắn, files dự kiến sửa và acceptance tests trước khi code nếu task có rủi ro.

---

# PHẦN XX — TÓM TẮT BẤT BIẾN

1. CHUOICUNGUNG.COM là workflow B2B, không phải directory.
2. Xương sống: **Nhu cầu → Tìm nguồn → Kết nối → Theo dõi → Kết quả**.
3. Một pháp nhân = một Organization đa vai trò.
4. Database là source of truth.
5. SUPPI tìm nguồn; CHAINY điều phối.
6. AI chỉ dùng dữ liệu được phép và chỉ tạo draft trước xác nhận.
7. Sponsor/Founding Partner không ảnh hưởng organic matching/xác minh.
8. Hội/hiệp hội không mặc nhiên bảo chứng năng lực.
9. Public/private/PII phải tách rõ.
10. Canonical URL registry không được phá.
11. Content/usability/workflow thắng visual “wow”.
12. P0 + P1 trước; không tự mở P2.
13. Audit trước, sửa tối thiểu, test bằng bằng chứng.
14. Không deploy/commit/migration production nếu chưa được yêu cầu.
15. Người dùng luôn phải biết bước tiếp theo.

**XƯƠNG SỐNG KHÔNG ĐỔI:**

> **NHU CẦU → TÌM NGUỒN → KẾT NỐI → THEO DÕI → KẾT QUẢ**

