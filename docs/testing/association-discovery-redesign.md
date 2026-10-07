# Association discovery redesign — 2026-10-07

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
