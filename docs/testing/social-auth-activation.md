# Social authentication activation check — 2026-10-12

## Outcome

User requested activating Google and Zalo authentication without changing the existing form. No application code, CSS, provider credentials, cloud authentication settings, user records or permissions were changed. Activation is blocked on access to the owner's Google Cloud and Zalo Developers accounts, not a missing visual button.

## Verified evidence

- Read-only local `GET /api/auth/providers`: `google: false`, `zalo: false`.
- Existing shared AuthForm already starts `/api/auth/oauth/start`; server routes already implement a signed, expiring state cookie, PKCE, token exchange and verified Supabase session boundary.
- Authenticated Supabase dashboard: Google disabled; Client IDs and Client Secret fields empty. No custom providers found. Email confirmation remains enabled; no security checks were weakened.
- Google Cloud Clients page redirects to account sign-in. Zalo Developers Apps page requests sign-in. Neither account was logged in, created or modified by the agent.
- Relevant local environment has Supabase keys but no Google/Zalo OAuth configuration. Only key names and presence flags were inspected; no secret values were printed.
- Existing regression suite rerun: `node --test --experimental-test-coverage --test-coverage-include='server/auth/social.js' --test-coverage-lines=80 --test-coverage-branches=80 server/tests/auth-social.test.js`: 8/8 passed; 100% lines, 86.08% branches, 100% functions for social.js. Synthetic fixtures only, not real provider consent/login.
- No source edits: no RED/GREEN implementation cycle, checkpoint commits or frontend rebuild was needed. Browser confirmation concerns provider configuration, not new frontend QA. Full live login remains unverified.

## Required next steps

Owner logs in directly to Google Cloud and Zalo Developers; never sends passwords, OTPs or client secrets in chat. Resume from the retained setup tabs.

Google: select the owner's correct Cloud project and OAuth web client, configure Google callback to `https://fcllkddudeslshqwldeb.supabase.co/auth/v1/callback`, configure minimal profile/email scopes and the appropriate audience, then configure the Supabase provider. Application redirect allowlist must include the actual app callback including its state query. Production SITE_URL and HTTPS need separate confirmation before deployment. Do not invent project/audience details.

Zalo: inspect the real application and supported user-authentication permissions first. OA authorization is not by itself authentication of website visitors. Current code has only a configurable custom-provider bridge; no independently verified Zalo adapter exists. Confirm token exchange, profile identity and email behavior before activating. Existing verified-email checks must not be disabled to force compatibility, and an OA access token must not be treated as a visitor login session.

Official references:

- [Supabase Google authentication](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase custom providers](https://supabase.com/docs/guides/auth/custom-oauth-providers)
- [Zalo Developers](https://developers.zalo.me/)
- [Zalo user access token](https://developers.zalo.me/docs/social-api/tham-khao/user-access-token-v4)
- [Zalo OA authorization](https://developers.zalo.me/docs/official-account/bat-dau/xac-thuc-va-uy-quyen-cho-ung-dung-new)

## Self-evaluation

Summary: 3.8/5; accurate blocker handoff, activation unfinished.

| Axis | Score | Evidence / improvement |
| --- | --- | --- |
| Accuracy | 4/5 | Live API and dashboard agree; tests are explicitly synthetic. Improve with real provider callbacks after owner sign-in. |
| Completeness | 3/5 | Form preserved and existing flow checked; real activation cannot proceed without owner account access. Resume configuration after sign-in. |
| Clarity | 4/5 | Separates Google configuration, Zalo bridge compatibility and visitor identity from OA access; live Zalo behavior still unknown. |
| Actionability | 4/5 | Setup tabs retained and callback specified; owner sign-in is still required. |
| Conciseness | 4/5 | User handoff is brief; technical evidence retained here. |

No critical axis <=2. Highest-impact improvement: owner sign-in, then validate real Google OAuth and assess the actual Zalo application. Self-check: user should accept only a verified blocker, not a claim of activated login. Verdict: hand off the missing account access; do not fake enabled flags.
