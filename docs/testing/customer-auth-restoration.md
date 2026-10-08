# Customer Auth restoration — 2026-10-08

## Request and scope

Restore the customer's original wide login/register modal, original BrandLogo and Zalo/Google choices. Keep Supabase verification, server-side roles and private-data ownership. Account administration must not replace the customer entry screen.

Hallmark influenced the scoped spacing, controls, keyboard states, responsive checks and contrast. This is a reference restoration, not a new landing-page theme: centered modal composition and existing brand typography are intentionally inherited. No global theme, logo or Admin design changes.

## Delivered

- Shared real `AuthForm` for the original modal, `/dang-nhap` and `/dang-ky`.
- Two customer tabs, Zalo/Google choices, email/password, registration name/organization fields, show-password and forgot-password flow.
- `/tai-khoan` contains the verified account/role display. Password management is a deliberate collapsed disclosure; recovery links still open the reset form.
- Header account buttons lead to `/tai-khoan`; anonymous login still opens the modal.
- OAuth scaffold uses signed, expiring HttpOnly state cookies, PKCE, same-origin initiation and a verified server session before setting account cookies. Provider errors never fabricate authentication or KYC.
- The screenshot's automatic Gold KYC / SSL / 2FA claims were not reintroduced: customer registration is not identity verification.

## RED → GREEN evidence

RED checkpoint: `cb85ce1`, current branch. `node --test server/tests/auth-social.test.js` failed because the required social-auth module did not exist. The test also requires original brand/tabs/providers and separation from password management.

GREEN commands:

```sh
node --test --experimental-test-coverage --test-coverage-include='server/auth/social.js' --test-coverage-lines=80 --test-coverage-branches=80 server/tests/auth-social.test.js
npm test
npm run build
```

- Focused suite: 8/8 passed. New social-auth module: 100% lines, 86.08% branches, 100% functions.
- Full suite: 131/131 passed, no skipped tests. Tests require local HTTP listeners; sandbox-only execution failed with `listen EPERM`, then passed with permitted local networking.
- Production build passed. Repeated after final UI edits before handoff.
- Tests cover disabled/unknown providers, PKCE/state, tamper/expiry/cancellation, remote errors, malformed provider settings, local return paths, owner binding, callback cookies and fail-closed redirects. All provider-success tests use synthetic fixtures, not real OAuth accounts.

## Browser verification

Real `/dang-nhap` and the real `AuthModal` in `/docs/testing/customer-auth/` were inspected using the in-app browser. Existing signed-in account was not logged out or modified.

- Login/register toggles: correct fields and labels.
- Google click when disabled: inline “Google chưa được kích hoạt…”; no fake success or redirect.
- Forgot-password: email-only form and back action.
- Empty login submission: browser required-field validation focuses email, no auth submission.
- Show-password: input switches to text; no password was entered/read.
- Modal focus wraps from close → last legal link and back. Escape closes it.
- Verified signed-in account route: Admin link retained; password disclosure initially closed; returning to customer entry restores the login form. No browser console errors were recorded in that QA tab.
- Widths 320/375/414/768/1280px: no document horizontal overflow; production form controls have minimum 44px height. Long CTA/tab labels were corrected after the 320px inspection.
- Contrast from the actual OKLCH palette: ink/paper 14.67:1; muted/input 6.43:1; muted/Zalo tint 6.16:1; input boundary 3.71:1; primary button 7.92:1; Zalo mark 7.16:1; error notice 9.07:1.
- Reduced-motion fallback and immediate keyboard focus indication are present.
- No automated screenshot baseline or axe run: visual regression and complete accessibility certification remain INCONCLUSIVE. Screenshots were visually reviewed, not pixel-diffed. No live password-reset email/signup/OAuth consent was submitted.

## Provider activation still required

Read-only Supabase settings check returned HTTP 200, `google: false`, no configured custom providers. **The UI is restored; live Google/Zalo SSO is not yet activated.**

1. Google: configure the Google OAuth client and Supabase Google provider, then add the website's `/api/auth/oauth/callback` URL (including its state query redirect pattern) to Supabase's redirect allowlist. Set server `SITE_URL` to the real HTTPS deployment origin. Google's authorized redirect goes to the Supabase project's Auth callback, not directly to the website.
2. Zalo: requires a compatible custom OAuth provider or a dedicated adapter. Set `ZALO_SUPABASE_PROVIDER` only after testing that integration. Zalo is not a built-in provider and compatibility/email verification cannot be assumed.
3. Test each real provider with a designated test account: consent → callback → verified account → protected resource. Test cancellation, repeat login, logout and production HTTPS cookies. Do not enable provider flags by pretending an integration exists.

Official references: [Supabase Google login](https://supabase.com/docs/guides/auth/social-login/auth-google), [custom OAuth providers](https://supabase.com/docs/guides/auth/custom-oauth-providers).

Provider credentials belong in the provider dashboard/server secret store, never in chat or browser code. No cloud provider configuration, roles or data were changed during this restoration.

## Self-evaluation

Overall 4.0/5. Accuracy 4: real tests pass; live OAuth remains unverified. Completeness 4: requested interface and account separation are delivered; provider activation needs credentials/configuration. Clarity 4: UI distinguishes unavailable providers and KYC; the configuration handoff still needs an operator. Actionability 4: localhost form is reviewable immediately, activation steps above are specific. Conciseness 4: shared form avoids duplicated flows; the QA documentation is longer than the user-facing handoff.

No critical axis ≤2. Highest-impact follow-up: configure and validate real Google OAuth, then assess Zalo adapter compatibility. Would the user agree? Likely for restoration; social login must not be described as fully live before those checks.
