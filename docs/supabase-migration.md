# Supabase migration — 2026-10-08

## Status: core database migrated; full application cutover incomplete

Live Supabase schema/RLS migration was applied through the user-authorized Dashboard. No existing customer tables were dropped or truncated. The additive importer preserves existing cloud rows (`ignoreDuplicates`). MongoDB is no longer connected by the running backend; its original data/configuration has not been deleted.

Verified live counts:

| Table | Rows |
|---|---:|
| enterprises | 21,680 |
| factories | 14,237 |
| industrial_parks | 480 |
| organizations | 81 |

Public programs, catalogues, requirements, taxonomy and profile documents were imported into `ccu_documents`. These are existing website content, not newly verified business facts. Browser bundles no longer contain the primary server-only `websiteSeeds.json` fixture file. Other legacy modules still contain demo/local-only workflows; this is not a claim that every fixture has been removed.

## Implemented

- Backend public repositories and assistant conversation/draft stores use Supabase. Database failures return errors instead of local/mock success.
- Public API projections exclude contact/internal fields and private/unreviewed records, including nested records.
- Major registration, connection, demand, quotation, service and partnership forms save private `ccu_submissions` records. Success is shown only after a cloud acknowledgement. Identical retries are deduplicated.
- Submission status is server-controlled, initially PENDING. Browser-supplied approval/payment/admin fields are discarded. Supplier responses can be edited only by their signed owner before review.
- Private records are scoped to a signed HttpOnly anonymous browser-session cookie, **not yet a Supabase Auth account**. They do not automatically follow users across browsers/devices. Clearing the cookie or rotating its signing secret loses the browser's access to those records.
- RLS enabled, anon/authenticated direct table privileges revoked, service-role backend access retained. Service keys must never use a `VITE_` prefix or be deployed in frontend assets.

## Verification actually performed

- `npm test`: **101 passed, 0 failed, 0 skipped**.
- New regression target: **20 passed**; first run reproduced 5 failures (contact aliases, response updates, retry/ACK validation and stale local-only UI copy), then fixes passed. Checkpoints: `0879495` RED, `9c9695c` GREEN.
- Earlier storage coverage: 96.55% lines, 82.69% branches; not rerun after the last small fixes.
- Latest production build before final receipt/copy fixes passed. Final small fixes passed the targeted tests; production build not rerun after them to conserve user quota.
- Full frontend page-test suite previously: 113 passed / 117; four failures in untouched gear/expo visual expectations remain. Do not describe the whole project as green.
- Live `node server/scripts/verifySupabaseMigration.js --live`: public-key access denied on all 9 tables; private submissions, assistant conversation and draft persisted; repeat submission deduplicated; foreign owner denied. Exact synthetic QA records created by that run were deleted afterwards. No customer data was deleted and no AI inference/email/payment was invoked.
- Browser read-only checks: all 21,680 suppliers visible; phase 5.3 produced 2,250 results; A–Z category A produced 415 results. Filtering remains functional.

## Remaining before claiming complete / production-ready

1. **Authentication and administration:** `AuthModal.jsx` and `AuthPage.jsx` still simulate login/SSO/KYC. Admin operational workflows still use localStorage. Do not treat client roles or demo approvals as authorization. Need a confirmed administrator identity and actual Supabase Auth/RBAC implementation before exposing private administration.
2. **Historical data:** MongoDB host was unreachable (DNS). No historical MongoDB export or private browser-local records were migrated. Need an export file or working source access; never overwrite/drop the source before reconciliation and backup.
3. **Attachments:** some forms save file metadata, not binary files in Supabase Storage. Bucket permissions and upload validation remain to implement.
4. **Performance/free quota:** current public bootstrap transfers roughly 54 MB uncompressed on initial load, with gzip/server caching. It is transitional; replace with indexed/paginated reads and smaller projections before scale. Free-plan capacity and egress are finite; no guarantee of indefinitely free hosting.
5. **Legacy cleanup:** remaining demo fixtures, local operational writes, obsolete Mongo indexing scripts/dependency, and SEO escaping need review. Four unrelated frontend visual-test mismatches are unresolved.
6. **Final runtime refresh:** latest server-side projection fixes require restarting `node server/index.js`; the already-running process does not watch files. Do so in a controlled window, then rerun readiness and the build.

## Commands / configuration

Backend-only `.env`: `SUPABASE_URL` and `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`; public key is needed by explicit permission-verification scripts. Configure a stable `ASSISTANT_SESSION_SECRET` for deployment. Do not paste secrets into chat.

```sh
npm run server
npm run dev
npm test
npm run build
npm run supabase:seed
node server/scripts/verifySupabaseMigration.js --live
```

`supabase:seed` writes additively to the configured cloud project. `--live` QA writes only synthetic private records and deletes those exact records in its cleanup. Review the configured destination before running either command. `/readyz` checks database readiness; `/api/status` reports the database provider. These checks do not prove model inference, paid/free AI tier, authentication, or admin readiness.

## Self-evaluation

Accuracy 4/5: live persistence/security checks and 101 backend tests support the core migration; final build/runtime refresh pending. Completeness 2/5: requested complete migration still lacks Auth/admin, historical records and binary uploads. Clarity 4/5: completed and incomplete areas are separated, but legacy architecture remains complex. Actionability 4/5: scripts and exact remaining steps provided; administrator/source input still required. Conciseness 4/5: this document keeps detailed evidence out of the chat. Overall 3.6/5. Highest-impact follow-ups: replace simulated authentication/admin, reconcile historical records, then paginate public loading. Self-check: user would reasonably reject a 100%-complete claim; deliver this as a verified partial cutover, not a finished production migration.

Sources: [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [upsert](https://supabase.com/docs/reference/javascript/upsert).
