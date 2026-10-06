# Founding Partner redesign

Date: 2026-10-03. Scope: `/founding-partner` only, local CCU checkout.

## Design read

Overhaul of a B2B commercial-partnership landing page for manufacturers, suppliers, industrial infrastructure businesses and industry organizations. Bright editorial layout, industrial imagery and restrained CCU blue. DESIGN_VARIANCE 6 / MOTION_INTENSITY 3 / VISUAL_DENSITY 4.

`design-taste-frontend` shaped the asymmetric hero, typography, single accent and asset-first approach. `redesign-existing-projects` informed the audit, simplified tier selector, inline errors and preserved stack. React 18, existing fonts, Lucide and page-local CSS; no dependency installation or global style rewrite. TDD and browser-qa were used for verification; self-evaluation is below.

## Changes and preserved contract

- Replaced centered dark/glow hero, all-caps headings and repeated card grids with a split image hero, editorial benefit list, selectable tier details and a live scope configurator.
- Retained Bạc / Vàng / Kim Cương and the existing price ranges, explicitly marked as reference prices requiring commercial confirmation.
- Removed unsupported claims about popularity, national advisory roles, VIP access and sponsored matching priority. Preserved sponsorship disclosure, matching neutrality, privacy, independent verification, no equity and no automatic activation.
- Preserved `category` / `cat`, `cluster` / `kw` query initialization and the existing inquiry data service. Cluster selection now follows the actual category association, including CNC, and does not fall back to unrelated industries.
- Preserved display-position values: `TOP_CATEGORY_SPONSORED_BLOCK`, `TOP_KEYWORD_SPONSORED_BLOCK`, `CATEGORY_SIDEBAR_SPONSOR`; all seven entitlement identifiers remain selectable.
- Tier CTA populates a budget option that actually exists. Scope remains synchronized with the proposal, without a separate stale copy. 24 months displays correctly.
- Consolidated the quick-registration path into the actual proposal form. Its former modal showed success after a timer without saving anything.
- Added inline validation, keyboard labels/focus and a review step. Success requires a successful service result and a persisted inquiry ID, rather than a timer alone.
- Explicitly disclosed that the existing service only stores inquiries locally. No claim of email delivery, server submission, activation or a 24-hour response promise.
- Removed tax-ID and website inputs from this contact-first form: the original page collected them but its existing submission payload/data service did not persist them. No backend/schema change was made.
- Existing partner records remain inspectable in a disclosure section, with clear sample/local-data provenance instead of an unverified active-contract endorsement.

No server, database, route, shared Navbar/Footer or Dify configuration edits. No commit or deploy. Existing unrelated working-tree changes were left intact.

## Verification and TDD evidence

Journeys: understand the offer; inspect all three tiers; select relevant scope; change period/entitlements; validate contact information; review before any local save.

Initial RED: `node --test src/pages/__tests__/foundingPartnerUi.test.js` ran against the old implementation. 1 passed, 5 failed for missing scoped redesign, missing labels/disclosures and not-yet-implemented presentation helpers. A separate compatibility regression test failed for the wrong display-position identifier before that identifier was corrected.

GREEN command:

```sh
node --test --experimental-test-coverage --test-coverage-include='src/pages/foundingPartnerUi.js' src/pages/__tests__/*.test.js
```

Result: 13 passed, 0 failed (7 Founding Partner tests and 6 existing Service Request tests). Presentation helper coverage: 100% lines, branches and functions. This is helper coverage, not a claim of 100% React component or app coverage.

| Guarantee | Evidence | Result |
|---|---|---|
| One H1, no nested main, scoped page styling | SSR render tests | PASS |
| Labels for scope and contact fields | SSR tests + browser DOM: 0 unlabeled page controls | PASS |
| Local-only state, illustration and reference pricing disclosed | SSR render tests | PASS |
| Query selection, category IDs/slugs, cluster mismatch and missing data handled | SSR + helper tests | PASS |
| Existing position identifiers remain compatible | RED then GREEN render test | PASS |
| Required contacts, email/phone validation and separate consent | Helper tests + empty-form browser test | PASS |
| All tiers selectable; CTA budget populated | Browser: Gold 1 tỷ, Diamond 2 - 3 tỷ | PASS |
| Category change keeps preview and form scope synchronized | Browser: CNC + matching cluster + 24 months | PASS |
| Missing Logistics cluster does not invent one | Browser: empty, disabled cluster select | PASS |
| Review contains scope, budget, contacts and selected entitlements | Browser with fictitious QA input, no save action | PASS |
| Editing returns without losing contact values | Browser review → edit | PASS |
| Tier controls work by keyboard | Tab from Silver focused Gold | PASS |
| In-page anchor targets exist | Browser DOM: 0 broken hash anchors | PASS |
| Responsive page fits viewport | 375×812, 768×1024, 1440×1000: no horizontal overflow | PASS |

`npm run build`: successful. Existing warnings remain for very large shared dataset chunks; that is not addressed by this page-only redesign. `git diff --check -- src/pages/FoundingPartnerPage.jsx`: clean. Whole-worktree diff check reports pre-existing whitespace in unrelated files; those files were not changed here.

Browser console capture included historical intermediate HMR/import and `fetchPriority` warnings during editing. Both were corrected and the final reloaded page rendered; remaining latest warnings concern existing React Router v7 future flags.

## Limits / follow-ups

- No real/local inquiry was created during browser QA. Successful persistence and storage-denied UI states were reviewed in source, but not exercised via the browser save button. The review flow was tested with fictitious data, then the test tab was reloaded to clear the unsaved inputs.
- No Lighthouse/Core Web Vitals, network trace, axe-core or screen-reader certification was run. No performance/WCAG score is claimed.
- Visual regression is INCONCLUSIVE: no committed screenshot baseline. Responsive screenshots and manual review are the evidence available.
- The existing floating mascot, global header and footer were unchanged. It may overlap edge content while scrolling on small viewports; broader shared-widget behavior is outside this page rewrite.
- Existing source uses seeded/local partner records. The page does not imply they establish real signed contracts.
- Before public production inquiry intake, wire the existing data service to a real authenticated server workflow. This was not implemented or represented as complete.

## Assets and screenshots

Built-in image generation, no user API key or external upload. One conceptual industrial campus photograph; no actual business identity, logo or certification. Visible caption and alt text disclose illustration. Source kept intact at `/Users/heymac/.codex/generated_images/01a0ec2e-7927-73c2-b6b1-aeaf05dabab3/exec-ba6b8c21-bb62-4f62-ae68-7987e517af48.png`.

Project asset: `public/images/partners/founding-campus-v2.jpg`, 1440×960, approximately 513 KiB. Converted from the generated PNG, without replacing any existing asset.

Prompt direction: landscape 3:2 architectural photographic illustration of a plausible Vietnamese industrial campus, navy/grey factories, glass office facade, internal roads and tropical greenery, soft late-afternoon light, close elevated view with diagonal composition. No text, logo, watermark, actual identified partner or fake UI.

Screenshots: `/private/tmp/ccu-founding-partner-desktop.png`, `/private/tmp/ccu-founding-partner-tablet.png`, `/private/tmp/ccu-founding-partner-mobile.png`. Temporary viewport override reset after QA. Agent-created test tab is closed; user-owned tabs remain untouched.

## Self-evaluation

Summary: 4.0/5 across five axes; no critical issues in the page design scope.

| Axis | Score | Evidence / improvement |
|---|---|---|
| Accuracy | 4 | 13 passing tests; real price/source and local-storage boundaries disclosed. Improve with isolated persistence/error-state integration tests. |
| Completeness | 4 | Entire landing, tiers, scope, review, mobile and keyboard checks delivered. Formal accessibility and save-state browser checks remain unmeasured. |
| Clarity | 4 | Short headings, labeled fields, truthful sponsorship semantics. Some inherited taxonomy names are still long on mobile selects. |
| Actionability | 4 | Runs on the existing localhost; source, tests and screenshots supplied. Official submission still needs the separate backend integration. |
| Conciseness | 4 | Seven commercial policy screens condensed into clear landing sections and disclosures. Detailed policy text can be reviewed further with the business owner. |

Self-check: the result is directly inspectable, but whether this visual direction meets the owner's taste still requires their feedback. Verdict: deliver the local redesign, clearly disclose production-intake limitations.
