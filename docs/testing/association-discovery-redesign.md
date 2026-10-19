# Association discovery redesign — 2026-10-07

## Current approved selection — C: Danh thiếp lãnh đạo

Applied the user's selected executive-business-card preview to the actual `/hiep-hoi` directory, not just the comparison page. The preview alternatives remain available for reference. This supersedes the earlier dossier-card revision below. No header, hero, filter, lower section, source record or backend changes were made in this adoption.

Taste and Hallmark guided faithful component-level adoption: white cards, 4px corners, a restrained dark bottom rule, existing 48px identity thumbnail/initial and compact outline profile action. Desktop shows at most three cards per row, tablet two, phone one. Identity, main industry, recorded member/year facts and full geography remain immediately visible. Native “Xem kết nối” disclosure retains all industries, organization introduction, program titles/roles/dates and catalogue entry. Published program titles link to their canonical destinations; unpublished references remain explicitly unavailable. Membership linking still calls the original handler with the selected organization. No request was submitted during QA.

Verification:

- Updated the card regression first: it failed on the old institutional style, then passed with signature markup and disclosure. All 33 tests in the five existing discovery suites passed.
- Chrome checked 320, 375, 414, 768, 1024, 1280, 1440 and 1920px. No horizontal overflow, component clipping, clipped control labels or controls below 44px. Card border widths are 1/1/3/1px; layout is 3/2/1 columns. Connection summaries reserve 56px.
- Search, scopes, sectors, region, program/catalogue switches, sorting, shortcuts, empty/reset states and mobile select matched the existing data API. Native disclosure toggles by click and Enter; the existing membership dialog opens/closes. Profile, published program and cooperation destinations loaded their actual content. Simulated image failure kept the readable initial in its 48px frame.
- Nine token contrast pairs passed 4.5:1 (minimum 6.15:1); keyboard focus and reduced motion were exercised. No full WCAG, axe, screen-reader or Core Web Vitals audit is claimed.
- Desktop/mobile card screenshots were inspected against the selected C preview: `/tmp/ccu-association-cards-{1440,375}.png`. Expanded phone state is `/tmp/ccu-association-signature-expanded-mobile.png`. This is visual review, not automated pixel-regression certification. Some remote thumbnails loaded slowly; reserved initials remain visible while loading.
- Production build passed, retaining existing large-chunk warnings. No deployment. Browser QA needed normal local Chrome launch outside the process sandbox; it performed no data writes.

Scoped design critique: P4 H4 E4 S4 R5 V4. Card typography, contrast, four-sided borders, native interaction, image fallback and responsive wrapping were reviewed. Approved structure and existing fonts intentionally override layout/font rotation; page-level hero/navigation/footer gates are outside this card-only task.

Self-evaluation: **4.0/5**. Accuracy 4: passing tests and live destinations support functional preservation; external source data remains unverified, so retain neutral record labels. Completeness 4: approved C and existing controls are implemented; formal assistive-technology review remains unperformed. Clarity 4: the front separates identity from expandable connections; very long original names still wrap naturally. Actionability 4: the real localhost page is ready for review; production deployment is outside scope. Conciseness 4: the collapsed cards are compact, but complete geography lists can still lengthen them. No axes at or below 2. Self-check: objective behavior is verified; visual approval remains the user's judgment. Future improvements: approved institutional imagery/data and representative leadership-user feedback. Verdict: deliver the selected design for review without claiming conversion gains.

## Earlier revision — institutional organization dossiers

The latest user request explicitly rejects the pastel covers and childlike presentation. This revision supersedes the card styling described in the earlier implementation record below; the invitation, filters, page hero, lower sections and shared chrome are untouched.

Taste and Hallmark shaped a structurally different card: one organization per horizontal white dossier, subtle 6px corners, a restrained green top rule, three desktop information columns and a shared action footer. The columns distinguish identity, expertise/geography and linked programs. At tablet widths the program area spans both columns; phones use one column. Oversized acronyms, pastel covers and outlined industry pills have been removed. Existing source thumbnails and initials remain; no official logos or endorsements were invented.

All original information remains, including every industry, description, location, recorded year/member count, program title, role and date. Extra industries/programs use native disclosures. Published programs retain working links; unpublished references retain their context and explicit unavailable-detail message. Profile and membership-linking actions use the original destinations/callbacks. The membership dialog was opened and closed, not submitted.

Verification of this revision:

- 33 regression tests passed across the five discovery suites, including 8 association tests.
- Chrome checked 320, 375, 414, 768, 1024, 1280, 1440 and 1920px: no horizontal overflow, component clipping, clipped control labels or controls below 44px. All cards have a white background, complete borders and no legacy covers. Desktop dossiers have three internal columns, tablet two, phone one.
- Existing filters, sorting, search, quick shortcuts, disclosures, empty/reset states and membership dialog matched the original behavior. Profile, published program and cooperation pages loaded their actual content. A simulated image failure retained its initial and reserved 64px frame.
- Nine color pairs exceed 4.5:1 (minimum 6.15:1). Keyboard focus and reduced motion were exercised. These checks do not claim a complete accessibility audit.
- Desktop, tablet and phone screenshots were inspected at `/tmp/ccu-association-cards-{1440,768,375}.png`. No baseline visual-regression comparison is claimed: the requested design is intentionally different.
- Production build passes with existing large-chunk warnings. No deployment or backend changes were performed.

Scoped design check: Philosophy 4, Hierarchy 4, Execution 4, Specificity 4, Restraint 5, Variety 5. The card-only review checks typography, contrast, image sizing, focus, responsive wrapping, factual content and absence of decorative icon/gradient/pastel-cover patterns. Existing site fonts/tokens are intentionally inherited; hero/navigation gates are out of scope.

Self-evaluation: **4.0/5**. Accuracy 4: regression tests and live paths pass; source institution data is not independently verified, so approved organizational data remains the next improvement. Completeness 4: the pictured cards and existing interactions are covered; visual appeal still needs the user's review. Clarity 4: explicit information columns replace mixed tall card content; approved shorter program summaries could improve scan time further. Actionability 4: the result is live on the existing localhost route; production publishing was not requested. Conciseness 4: desktop rows are significantly less vertically fragmented, but preserving full source information still makes phone cards long. No critical axes at or below 2.

Priority improvements: obtain approved institution imagery/data, then validate the hierarchy with association leaders. Self-check: functional preservation is evidenced; whether the new appearance meets the user's taste is theirs to judge. Verdict: deliver the scoped implementation for review, without claiming conversion gains.

## Scope

Only the two requested screenshot areas on `/hiep-hoi` were redesigned: the old proof/guidance/filter area and organization cards. `AssociationsPage.jsx` remains the owner of filters, URL state, claim dialog and submission. The hero and every section below the directory remain unchanged; a regression test compares these boundaries with HEAD.

Hallmark and Taste informed a light, institutional direction: an invitation to collaborate, asymmetric colored entry paths and identity-first organization dossiers. Blue, mint, rose and yellow distinguish recorded organization scope. Existing brand typography, green actions, navigation, footer and mascots remain in place. No new decorative icon set, invented logo or generated imagery was introduced.

## Content and behavior

- Replaced unsupported `100%` verification and marketing proof with a clear invitation: “Cộng đồng vững mạnh. Cơ hội rộng mở.”
- Preserved search, all seven sector filters, four scope types, region, program/catalogue switches, four sorting choices, reset and quick shortcuts.
- Display deduplicates IDs: the current 21 listing rows represent 19 unique organizations. Source records are not modified.
- Cards retain full names, source thumbnails, geography, industries, descriptions, linked program titles and roles. Additional information is accessible through native disclosures, not discarded.
- Recorded profile years and member counts are shown neutrally. Automatically generated 2016/200 defaults are not presented as facts.
- Existing VITAS and DNBA program references lack published detail records. Their title and role remain visible with “Đang cập nhật thông tin chương trình”; unavailable detail links are omitted. Published HAME program links remain actionable.
- Existing organization-profile, cooperation and membership-linking routes/callbacks remain. The membership dialog was opened and closed during QA; no request was submitted.
- Source images remain remote; a visible organization initial occupies their reserved space while loading or after failure. No replacement official logos were fabricated.

## Verification

Commands:

```sh
node --test src/pages/__tests__/associationDiscovery.test.js src/pages/__tests__/catalogueDiscovery.test.js src/pages/__tests__/ecosystemConnect.test.js src/pages/__tests__/programDiscovery.test.js src/pages/__tests__/supplierDirectory.test.js
node docs/testing/qa-association-discovery.mjs
npm run build
git diff --check
```

- 32 regression tests passed, including seven new association tests. Association tests were rerun after the final copy-spacing adjustment: 7/7 passed.
- Chrome QA covered widths 320, 375, 414, 768, 1024, 1280, 1440 and 1920px. No horizontal page overflow, component clipping or clipped CTA labels; measured controls meet 44px targets; the filter frame has four 1px borders. Cards use one, two or at most three columns.
- All scopes, sectors, searches, region, switches, sorts, quick filters and reset matched the existing data API. Empty state, information disclosures, mobile native selector, keyboard focus and reduced motion were exercised.
- Nine text/focus color pairs exceed 4.5:1; lowest measured ratio is 6.15:1. Focus also has a visible outline, rather than color alone.
- Live profile `/hiep-hoi/ORG-VITAS-009`, published program `/chuong-trinh/sourcing-day-electronics-bac-ninh` and cooperation destination loaded their actual headings, not merely the shared navigation shell.
- Build passed. Existing large-data chunk warnings remain unrelated to this scoped redesign. Node prints an experimental localStorage warning in test imports.
- Final browser run reported no JavaScript page errors or HTTP failure responses. Remote thumbnail latency is recorded separately; successful loading is not assumed.

Screenshots were visually reviewed for desktop, tablet and phone. They are local QA artifacts at `/tmp/ccu-association-discovery-{375,768,1440}.png` and `/tmp/ccu-association-cards-{375,768,1440}.png`. Capture-from-document placement of the existing fixed mascot can differ from its normal viewport position; its shared implementation was not changed.

## Design check

Hallmark critique: Philosophy 4, Hierarchy 4, Execution 4, Specificity 4, Restraint 4, Variety 4. The hierarchy prioritizes organization identity and the reason to connect. No unsupported proof metrics, gradient fills, generic feature icons, forced mobile word joins or inaccessible custom filter widgets were added. Mobile paths were widened after visual review rather than keeping narrow multi-line tiles.

## Self-evaluation

Overall **4.0/5**, deliver with the scope and limitations above.

| Axis | Score | Evidence and improvement |
| --- | --- | --- |
| Accuracy | 4 | Tests and live destinations pass; source records are still demonstration data, not independently verified organization endorsements. Obtain approved organizational information before treating them as proof. |
| Completeness | 4 | Both pictured areas and their interactions are covered. Formal leadership-user feedback is not yet available; validate the discovery hierarchy with an association representative. |
| Clarity | 4 | Full names, labeled controls and explicit unavailable-program copy replace clipped titles and vague validation claims. Future content editing can shorten long geography lists without deleting information. |
| Actionability | 4 | Changes are wired directly into the existing localhost route, and commands reproduce verification. Production publishing was not requested or performed. |
| Conciseness | 4 | Additional information uses disclosures, but dense original organization records still create tall cards. An approved compact summary per organization would improve scan time. |

Priority improvements: approved organization imagery/data; representative-user review; curated short organization summaries. None require expanding this requested implementation.

Self-check: the user can assess the actual changed page immediately, but visual appeal and credibility to senior association leaders cannot be established by automated tests alone. No conversion uplift is claimed.
