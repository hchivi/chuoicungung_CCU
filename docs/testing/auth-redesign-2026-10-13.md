# CCU authentication redesign, 2026-10-13

Existing-brand redesign for B2B users. Design read: calm, readable enterprise entry, retaining CCU green, logo and existing site typography. Design variance 3, motion 1, density 4. Native scoped CSS on the existing React components; no dependencies added.

## Changes

- Two-column desktop layout with an actual existing factory photograph; single-column layout below 1024px.
- Shared form for login, registration, forgotten password and new password. Login omits registration-only role choices. Registration preserves existing role selection and input payload.
- Semantic labels, autocomplete, keyboard-accessible password visibility control, explicit busy states, provider availability and notices.
- Removed the previous remember-me checkbox because its state was never sent to the authentication service. Session policy is unchanged.
- Existing legal text, routes and authentication endpoints preserved. Recovery now explicitly selects the new-password form after token acceptance.
- Provider availability comes from the existing API. This change makes no claim about completing provider activation and changes no provider credentials or backend session rules.

## Verification

- `node --test server/tests/auth-client.test.js server/tests/auth-social.test.js`: 13/13 passed. Initial restricted run could not bind localhost; rerun with local-network permission passed.
- `npm run build`: Vite production compilation passed. Subsequent existing bootstrap export logged inability to reach Supabase from this environment; no deployment or data-export success is claimed.
- Browser verified desktop layout at 1280px, tablet at 949px and phone at 390px. No horizontal overflow at phone width. Verified registration switching and multi-role selection, forgotten-password switching and return to login.
- Navbar's current sign-in behavior navigates to the auth page. AuthModal continues to reuse the same form; modal-specific live opening was not independently exercised.
- No real signup, reset email or OAuth session was created for this visual check. Existing auth regression tests cover server/session behavior.
- Existing light brand retained. No new image generation or dark theme introduced. Lighthouse/Core Web Vitals not measured.

Proofs: `/private/tmp/ccu-auth-register-mobile.png`, `/private/tmp/ccu-auth-redesign-desktop.png`.

## Self-check

Accuracy 4/5: checked rendered state and existing authentication tests; no unsupported production claims. Completeness 4/5: shared entry modes redesigned; modal live interaction and production data export not verified. Clarity 5/5: registration-only controls separated from login, clear field labels. Actionability 5/5: working local routes ready for review. Conciseness 4/5: repeated marketing chips and duplicate registration links removed.
