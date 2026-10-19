# Thái Hòa landing — readability update, 2026-10-12

User journey: read the event page comfortably without tiny type or competing decorative panels, on desktop and mobile. No database, authentication, fees, dates or registration policy changes.

## Changes

- Body base 18px desktop / 16px mobile; agenda, benefits and form inputs 16px. Main section headings 24–32px; supporting copy generally 14–16px.
- Content constrained to 1320px; increased section spacing and line height.
- Agenda and connection groups use two columns instead of four cramped information panels. Fees and sponsorship each have a separate full-width block. Sponsors stack on narrower screens.
- Replaced rotating gears with a static matching strip, shortened repetitive benefit copy and removed duplicate hero speech bubbles. Supplied logos and desktop mascot artwork are unchanged.
- Mobile hero omits decorative background artwork, keeping logos and event facts; role cards precede the matching strip.
- Reused existing registration, matching and after-event components. Anchor offsets account for the shared sticky header.

## Evidence

| Guarantee | Validation | Result |
| --- | --- | --- |
| Larger copy, bounded content, spacious panel grid, no rotating gear component | New Node/PostCSS readability test | RED: expected 18px, received 14px; GREEN: passing |
| Existing event facts, approved-only data, role payloads and closed-event behavior retained | `node --test src/pages/__tests__/programDiscovery.test.js src/pages/__tests__/programWorkflow.test.js src/pages/__tests__/thaiHoaEventLanding.test.js` | 28 passed, 0 failed |
| Model behavior remains covered | `node --test --experimental-test-coverage --test-coverage-include='src/pages/thaiHoaEventLandingModel.js' src/pages/__tests__/thaiHoaEventLanding.test.js` | 100% lines, 82.43% branches, 92.86% functions |
| Frontend compiles | `npm run build` | Passed |
| Responsive layout | Browser checks at 375, 768 and 1440px | No horizontal page overflow; checked text blocks did not overflow their own boxes |
| Supplier CTA preserves selected form | Browser click on “Đăng ký Nhà cung ứng” | Supplier role selected; relevant fields present and 16px; no form submitted |

Screenshots: [Desktop information panels](thai-hoa-landing/readability-desktop-1440.png), [Mobile hero](thai-hoa-landing/readability-mobile-375.png).

Known limits: this is visual/readability QA, not a complete accessibility audit or measured Core Web Vitals run. Shared Navbar/Footer and AI chat behavior were not redesigned. Closed registration remains closed because the recorded event date has passed. No new checkpoint commits: `.git` is read-only in this environment.

## Self-evaluation

Overall **4.0/5**. Accuracy 4: computed 16px copy and tests verified, but no full assistive-technology audit. Completeness 4: requested type/spacing/layout improvements delivered across three widths; other pages intentionally unchanged. Clarity 4: separate information blocks and static matching strip reduce competing detail; long event facts still wrap on small screens. Actionability 4: working local page and saved screenshots, not a production deployment. Conciseness 4: benefits shortened and duplicate decoration removed; existing detailed forms remain available below.

Self-check: the visible changes directly address larger text and less clutter; subjective design approval remains with the user. Highest-value follow-ups are user review at their normal zoom and a dedicated accessibility audit if requested. Verdict: deliver this scoped update.
