# Homepage program invitation refresh
Date: 2026-10-05. Scope: the “Ngày hội Chuỗi Cung Ứng” block only.

## Customer brief and audit
The former portrait paper pass rendered its copy into a 2048 × 2800 canvas texture, used a continuously updated Three.js mesh and treated its canvas as a clickable surface. It was visually washed out, consumed a large vertical area and did not explain next steps for different business roles.
The replacement uses readable HTML, a photograph-led bright composition and a compact role-specific preparation panel. The existing HomePage import, #chuong-trinh anchor, registered routes, other sections and database are unchanged. No commit or deploy. The interrupted earlier gear task is outside this request.

Taste configuration: variance 6 / motion 3 / density 4. Native CSS, existing React/Router and Lucide dependency; actual site Space Grotesk/Poppins typography retained. Light homepage inheritance overrides automatic dark-mode switching. Hover/press only, reduced-motion fallback; no continuous animation or motion claims.

## User journeys / TDD evidence
Tests: src/pages/__tests__/expoHomepage.test.js.
- Read program purpose without canvas/WebGL.
- Select buyer, supplier or organizer and see relevant preparation content.
- Open the existing program route or a role-specific next step.
- Continue to use the block when the photograph fails to load.
- Read the block on small screens and operate it with a keyboard.

RED: before production changes, the five newly added tests executed: 0 pass / 5 fail (missing HTML content, role model, photograph/fallback and scoped stylesheet).
GREEN: those five tests passed after implementation. A sixth palette-contrast verification test was added during final QA.
Commands:
- node --test src/pages/__tests__/expoHomepage.test.js
- node --test --experimental-test-coverage --test-coverage-include='src/components/home/expoHomepageContent.js' src/pages/__tests__/expoHomepage.test.js
- node docs/testing/qa-expo-homepage.mjs
- npm run build

Checkpoint commits intentionally omitted: task grants source edits, not commits, and repository metadata is read-only.

## Verification
Browser QA: PASS, 24 role-layout combinations (3 roles × 320/375/414/768/1024/1280/1440/1920px). Actual text-line count is two; it excludes the site's global diacritic padding. All block controls meet 44px height, keyboard focus is visible, selected content and aria-labelledby update together, and scoped content does not horizontally overflow.
Native navigation tested: /chuong-trinh; registration role=buyer and role=supplier apply their correct dynamic preparation fields after lazy route loading; organizer opens /dich-vu/to-chuc-ket-noi. No forms submitted.
Photograph request deliberately blocked in a separate test page: fallback status appears and role action remains usable.
Hover arrow movement and live reduced-motion disable verified. Dark system preference preserves the site's deliberate bright theme.
Runtime page errors: 0. Unexpected HTTP errors: 0 in these journeys.
Build: PASS (last run 18.41 seconds). Existing oversized snapshot/vendor chunk warnings remain outside this block.
Full existing frontend suite: 75 tests, 72 pass / 3 fail; failures are the separate pre-existing dualGearsMatching.test.js assumptions (MATCHING_STAGES export, inner-gear markup, old CSS), not this block. Do not alter that block/tests to conceal the failures.
Coverage: 100% lines/branches/functions for expoHomepageContent.js. JSX is exercised through SSR plus browser journeys; its line coverage is not instrumented. No claim of whole-project coverage.
No lint/typecheck scripts configured for this JS project. Axe and Lighthouse are not installed: no comprehensive WCAG certification or measured production CWV claim. Color-pair assertions and manual screenshot inspection are narrower checks.
Formal screenshot regression: INCONCLUSIVE, no committed baseline. New local screenshots visually inspected at /tmp/ccu-expo-home-1280.png and /tmp/ccu-expo-home-375.png.

## Asset provenance and final prompt
Built-in image generation, not CLI. Generated photograph is not a testimonial or proof of a real CCU event. No named attendees, logos or event dates. No visible decorative AI caption; provenance stays here.
Original: /Users/heymac/.codex/generated_images/01a0ec2e-7927-73c2-b6b1-aeaf05dabab3/exec-c6efe564-823f-405e-9cbb-1d09983de319.png
Project assets (non-destructive JPEG exports):
- public/images/services/sourcing-meeting-home-v1.jpg: 1536 × 1024, 333665 bytes.
- public/images/services/sourcing-meeting-home-v1-960.jpg: 960 × 640, 162072 bytes.
Use srcset/sizes, lazy loading, async decode and explicit intrinsic size; original asset files untouched.

Final generation prompt:
Use case: photorealistic-natural.
Asset type: editorial photograph for a bright Vietnamese B2B supply-chain platform homepage section.
Primary request: a sophisticated horizontal photograph of a small industrial sourcing meeting where factory procurement managers and suppliers examine tangible product samples together.
Scene: sunlit modern business exhibition space in Vietnam, understated white walls, forest-green architectural accents, airy professional setting with a few softly blurred meeting tables behind.
Subject: four Vietnamese professionals, two women and two men, in credible business attire, discussing industrial components, a neatly folded uniform fabric sample and compact packaging samples on a clean table. One person thoughtfully explains a sample, others listen. Natural candid interaction, no exaggerated handshake, no posing to camera.
Composition: horizontal 3:2 photograph, camera at table height, balanced medium-wide shot, recognizable people and sample objects, subtle depth of field. Main subjects within central 80 percent for responsive crop.
Lighting: bright soft daylight, true skin texture and realistic hands, high-end restrained documentary aesthetic, convincing material details.
Colors: neutral silver-white and muted forest green, natural warm skin tones. No neon or colored glows.
Constraints: no text, no logos, no watermarks, no branded event signs, no named real attendees, no claim of a specific real event. Deliver photo only, no UI mockup or borders.

## Preflight and self-evaluation
Changed surface reviewed for copy correctness, consistent green palette/radius, readable CTA labels, no decorative em-dashes/claims/metrics, reserved photograph box, image failure, responsive layout, native link/button semantics, selected state and polite live updates. Other homepage/global navigation layout is not restyled.
Overall 4.2/5:
- Accuracy 4: executed block tests/browser journeys and checked role destinations; live event availability and production registration delivery are not verified or promised.
- Completeness 4: desktop/mobile, roles and image failure handled; formal visual baseline, screen-reader session and production CWV measurement remain unavailable.
- Clarity 4: short event purpose and practical role content replace texture copy; the existing component filename still says Paper3D to preserve its entry point.
- Actionability 5: saved source and assets are loaded by existing localhost; native next-step routes work without new backend setup.
- Conciseness 4: one brief invitation plus one selectable panel; complete project-suite limitations are kept here rather than expanded into the UI.
Critical issues in this block: none identified by these checks.
Self-check: user can inspect the real localhost block, but visual preference still needs the user's judgement.
Top follow-ups: obtain approved real event photography when available; establish a visual baseline and run production Lighthouse/screen-reader QA in a separate verification pass.
Verdict: deliver local redesign; do not claim the full repository test suite is clean.
