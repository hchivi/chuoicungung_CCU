# Program detail workflow — 2026-10-10

## Scope and user journeys

Derived from the user's request, not a supplied plan. All `/chuong-trinh/:slug` detail pages share the redesigned registration, matching and post-meeting components.

- A factory describes purchases, optional sales, target suppliers, quantity, technical standards and preferred meeting time.
- A supplier describes products/services, purchases, actual capabilities and factories it wants to meet.
- An association identifies its delegation, supplier count, offers, purchases and target factories.
- A sponsor proposes budget, presentation topic and time, or selects a package actually recorded for the event.
- A visitor selects a public demand/capability; the registration form selects the opposite role and preserves the target identity.
- A participant sends counterparties, product, next action and an existing image/album URL for private review.
- A visitor sees only explicitly published, public event pairs and photos, never invented MOU totals.

## Changes

The redesign skill informed the editorial hierarchy: large left-aligned headings, green/ivory surfaces, compact text-only role controls, a separate agenda/fee sidebar and readable product-first matching cards. No additional dependency or AI image generation.

Registration now uses the supported `programRegistration` submission kind rather than the unsupported `program_event_registration`. It waits for an actual server receipt, propagates failures, retains inputs and uses stable retry payloads without generated timestamps/codes. Status is authoritative over legacy labels. Meeting requests are proposals, not confirmations or payment receipts.

`enrichProgramData` exposes original `workflowContent` separately from legacy fallback agenda/gallery/sponsors. The new sections never present those defaults as event facts. Event-specific fee amounts are retained; unknown sponsor prices and schedules explicitly remain unpublished.

## TDD and verification evidence

RED checkpoint `511579f`: 10 executed tests failed for the missing workflow model, missing four-role UI, fabricated universal results and blanket verification copy. Additional RED checkpoint `d19e819`: invalid attendee counts were not rejected. Both are reachable on the active `main` branch.

| Guarantee | Test / command | Result |
| --- | --- | --- |
| Four roles, real event fees, canonical status, stable compatible payloads, input validation, actual ACK/error semantics, public result allowlist, correct meeting target | `node --test src/pages/__tests__/programWorkflow.test.js` | 11/11 |
| Existing program/supplier discovery unaffected | `node --test src/pages/__tests__/programDiscovery.test.js` | 10/10 |
| Backend regression | `npm test` | 151/151 |
| Workflow model coverage | `node --test --experimental-test-coverage --test-coverage-include='src/components/programs/programWorkflowModel.js' src/pages/__tests__/programWorkflow.test.js` | 100% lines, 89.36% branches, 94.44% functions; model only, not whole UI |
| Production bundle | `npm run build` | PASS |
| Browser interactions and responsive layout | `node docs/testing/qa-program-workflow.mjs` | PASS at 320, 375, 768, 1024, 1440px; no page/section horizontal overflow; labelled fields |
| Browser submission safety | Same QA script | POST requests intercepted; 0 actual database writes |
| Closed states | Same QA script | Upcoming, completed, registration closed, postponed and cancelled events disable submission |
| Syntax and whitespace | `node --check docs/testing/qa-program-workflow.mjs`; scoped `git diff --check` | PASS |

Browser QA covered switching roles, matching-to-supplier prefill, repeated top Buyer CTA after a manual role change, mocked 503 without false success, retry with server ACK, and private post-meeting evidence submission. First browser assertion ran before React's effect updated the role; changing it to wait for the observable selected role resolved the test, then the extended run passed. Screenshots inspected: `/tmp/ccu-program-workflow-1440.png`, `/tmp/ccu-program-workflow-375.png`.

No TypeScript or lint script exists in package.json. Automated accessibility coverage here is labels/focus styling/responsive checks, not a WCAG certification. Visual regression baseline unavailable: comparison is inconclusive, screenshots were manually inspected.

## Known boundaries

- Photos are submitted as links to existing images/albums, **not binary uploads to Supabase Storage**. No bucket, storage policy, cloud migration, publication or paid service was created.
- This is a request/review UI, not an automatic matching engine, calendar integration, payment processor or mutual-confirmation service.
- No live submission was written to Supabase for verification. Backend contract regression tests and intercepted browser requests passed; real cloud write acceptance remains environment-dependent.
- Public results require per-item `visibility: PUBLIC`, `publishStatus: PUBLISHED`, optional matching `programId`; optional photo `pairId` supports filtering by connection. These data must be supplied/approved by the organizer; registration does not publish them automatically.
- Legacy detail-page schema/support/recap code outside the three redesigned sections was not comprehensively audited. The dedicated `/dang-ky` page remains unchanged.
- Existing unrelated dirty tracked edits in `ProgramDetailPage.jsx` and `programsData.js` were preserved. New component/model/test/style checkpoints do not stage all of those earlier edits.
- Crawler scripts, browser collector tab, runtime and archived data were not changed or restarted for this UI task.

## Self-evaluation

Overall 4.0/5. Accuracy 4: build, 151 backend tests, 11 workflow tests and live browser mocks pass; real cloud writes not exercised. Completeness 4: all requested role fields and three stages exist; binary photo upload and automated matching are outside the delivered UI. Clarity 4: proposals, confirmed results and unknown prices have explicit labels; organizer needs to supply schedule/results. Actionability 4: localhost page usable now, while real data approval and storage setup remain separate. Conciseness 4: shared model and sections replace hardcoded duplicated claims; dense JSX can be formatted more readably later.

Highest-impact follow-ups: configure a permissioned Storage upload path if direct file uploads are wanted; add organizer review/editor controls for agenda, sponsor packages and approved pairs/photos. Self-check: a user can review the new page immediately, but should not mistake it for an already-operated event-management backend.
