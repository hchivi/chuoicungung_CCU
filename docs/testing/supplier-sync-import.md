# Permissioned Trang Vang refresh — 2026-10-09

## Current status: browser collection works; full-site refresh incomplete

### Optimization and restart — 2026-10-10

Current implementation and TDD/timing evidence: [crawl optimization](trangvang-crawl-optimization.md). This supersedes the prior run state and the prior unfixed publisher-name warning below. The preceding run stopped on a network-change error at 17:12 Vietnam on October 9 with 4,830 saved / 4,820 exported. Corrected/re-exported all saved HTML locally, built an incremental SQLite content cache, added bounded transient retries and overlap between offline export and collection. No Supabase writes or binary-image downloads were performed.

Resumed the same archive/tab 5 at **08:32 Vietnam on October 10**, six-hour deadline **14:32**, per-page budget checks. At 08:33:05: **4,843 saved**, runner `running`, no collector error. Export-only benchmarks: 60.36 seconds cold for 4,830 versus 0.96 seconds warm unchanged; 0.84 seconds with two new profiles. This is not a claim of 63x faster total crawling. Check private runner/browser status for newer counts and whether the execution is still alive.

### User-requested continuation — 2026-10-09 10:05 UTC / 17:05 Vietnam

- The preceding run stopped normally at **09:37:06 UTC / 16:37 Vietnam** on its time budget, with **4,701 profiles exported**. No source challenge/error was recorded. The user explicitly requested continued collection.
- The former collector tab no longer existed. Created a separate collector **tab 5** in the same supported browser and marked it for handoff; user tabs were not navigated. A two-page resume advanced the durable archive to 4,703 profiles without refetching acknowledged jobs.
- Resumed the existing deterministic queue at **09:58:44 UTC / 16:58 Vietnam**, with a new six-hour budget ending **15:58:44 UTC / 22:58 Vietnam**. Deadline checks occur between batches, so the final batch/export can finish slightly later. Serial 60-page batches, minimum three-second interval, 10 GiB archive ceiling, 1 GiB disk reserve, stop-on-error/challenge and no automatic Supabase writes remain unchanged. Past runner status was appended to private `runner-history.jsonl`.
- At **10:05:15 UTC / 17:05 Vietnam**, saved **4,794 supplier profiles / 159 category pages**, with **3,869 discovered jobs pending**. One automatic export succeeded with **4,761 profiles**. The client wait timed out after 300 seconds, but subsequent filesystem evidence confirmed continued progress from 4,764 to 4,794, with runner state `running` and no recorded error. Do not launch a duplicate writer on a client timeout.
- This remains tied to the open app/browser/runtime, not an installed OS service. Binary images downloaded and database writes in this run remain **0**; image URLs are not image backups. Pending counts are not total remaining website coverage.
- Known extraction issues are **not fixed by resuming collection**: JSON-LD publisher `name` can incorrectly override the supplier heading; product/service keywords and named contact-person associations are not independently structured. Retain raw HTML and repair/reparse before any bulk cloud import. No assertion of complete or validated full-site data is made.

Loop review (`loop-design-check`): resuming an existing bounded data worker, not creating an LLM-driven autonomous judgment loop. Queue exhaustion is only a discovered-scope stopping condition, not proof of full-site coverage; the human retains publication/import approval. The limits above provide damping and fail-closed recovery.

Operational self-evaluation (`agent-self-evaluation`): **4.0/5**. Accuracy **4/5**: post-timeout advancing filesystem counts and a successful export verify actual progress; no independent service guarantee. Completeness **4/5**: requested continuation is running, while full collection remains unfinished. Clarity **4/5**: saved/exported counts and the stopping deadline are distinguished; a visible status dashboard is still absent. Actionability **4/5**: no user intervention is required now beyond retaining the active app/session, but sleep/closure can interrupt it. Conciseness **4/5**: compact handoff, though bootstrap/documentation checks prolonged startup. Improvement: persist a visible progress surface rather than requiring repeated status questions. Self-check: the user can reasonably accept resumed collection, not a claim of finished migration. Verdict: deliver resumed-run status as verified.

### Status inquiry and operational recovery — 2026-10-09 06:33 UTC

The user's observation that the crawl was no longer visibly advancing was correct. The first automatic loop stopped at **05:41:03 UTC / 12:41 Vietnam time**, following a failed offline Python export. Its last collection checkpoint was **2,029 profiles, 68 category pages, 3,611 pending discovered jobs**. The previous successful export contained 1,971 profiles / 46,815 gallery URLs. No collector/source challenge was recorded. The old wrapper retained only `error.message`, so the exact exit code/signal/stdout/stderr and root cause cannot be reconstructed; a timeout or transient process failure is a hypothesis, not a confirmed diagnosis.

Contained recovery under the user's standing request to continue collection:

- Read-only parsing checked **all 2,029 archived supplier pages**, zero failures, in 24.99 seconds. No corrupt/unknown listing was reproduced. A single retry of the existing offline exporter succeeded with all 2,029 profiles. No source page was refetched to repair this export.
- Archived the stopped runner record in private `runner-history.jsonl`. Resumed the same browser tab and durable queue at **06:25:17 UTC / 13:25 Vietnam time**, keeping the original **09:33 UTC / 16:33 Vietnam time** deadline. No deadline extension or duplicate writer was created. New operational wrapper captures error code, signal, killed flag and bounded stdout/stderr; export process timeout is now 300 seconds rather than 120. This does not prove the original error was a timeout.
- Verified increasing saved counts **2,029 → 2,050 → 2,099 → 2,144**, and the first successful automatic recovery export: **2,087 profiles / 48,302 gallery URLs**. At 06:33:03 UTC, the collector had completed the next 60-page batch and was exporting it; the writer lock was correctly absent during offline export. An absent collector lock alone is not evidence that the whole loop stopped. Check runner state, advancing timestamps and successful batch/export receipts together.
- The caller's 300-second wait timed out again, while the long-awaited Node execution continued. This client transport limit is distinct from the old failed Python export. The collector preserves its minimum 3-second interval, 10 GiB cap, source-challenge stop and no automatic database-write behavior. No application source or Supabase data was changed in this recovery.

Self-check for the status/recovery response (`agent-self-evaluation`): accuracy **4/5** (filesystem/progress/export proof; original failure's root cause remains unknown); completeness **4/5** (answered status and recovered the standing crawl; no visible progress dashboard or completion ETA); clarity **4/5** (stopped versus running and snapshot versus exported counts separated); actionability **4/5** (same queue resumed and first export verified; still depends on the app/runtime staying available); conciseness **3/5** (diagnosis/recovery required several tool cycles). Overall **3.8/5**. Highest-impact improvement is a durable visible progress/failure surface; do not claim it exists. The user should reasonably accept restored progress, not a claim that the full website refresh is finished.

### Continuation requested by user — active snapshot, 2026-10-09 03:40 UTC

This section supersedes the handoff counts/background status below. The crawl is **not complete**.

- At 03:40:35 UTC: **346 saved supplier profiles, 13 category pages, 3,459 discovered jobs pending**, 29,918,658 HTML bytes. All 359 acknowledged page snapshots exist; zero duplicate page acknowledgements.
- The latest completed automatic export contains **344 distinct supplier IDs and 10,041 gallery URLs**. Export counts lag the currently running batch intentionally. Binary images downloaded remain **0**.
- An **awaited long-running Node REPL execution** started at 03:33:07 UTC (10:33 Vietnam time), collecting serial 60-page batches and invoking the existing offline exporter after each successful batch. Two batches/export checkpoints are verified. The execution has a **6-hour work budget**, a 7-hour execution timeout, 10 GiB archive ceiling, 1 GiB disk reserve and minimum 3-second page interval. It stops on challenge/markup/export errors, operator `STOP`, storage limit, completion or its time budget. There are **no automatic Supabase writes** in this loop.
- Private `runner-status.json` records its start/deadline/state, completed batches and last export. The current deadline is **2026-10-09 09:33:07 UTC / 16:33 Vietnam time**. This is an active execution in the existing supported browser runtime, **not an independently installed OS service or scheduler**. App/session closure, machine sleep or runtime interruption may stop it. No guarantee of post-closure progress or quota-free browser operations is made.
- The tool client's wait expires after 300 seconds despite a longer requested Node timeout. This does **not** by itself establish that the execution stopped: saved progress advanced from 170 to 228 after the first wait timeout; the second execution advanced from 312 to 346 and exported its second batch after its caller timed out. Do not start another writer merely because a tool wait timed out. Check `runner-status.json`, advancing `browser-status.json` and the writer lock first.
- Reconciled the 228-profile checkpoint with Supabase once: **30 acknowledged updates, 0 inserts, 198 review items** (25 multiple identity matches; 173 name-only matches). Private plan/journal: `.crawl-data/trangvang/imports/2026-10-09T03-31-21-826Z/`. Ambiguous records were not overwritten. Readback verified all 30 payloads and unchanged phase/publication/access fields: **29 already unpublished, 1 already public**. The public projection excludes phone/email/contact/tax fields. No public cache invalidation/restart was performed; do not claim the browser directory already reflects the public update.
- Focused regression checks rerun: Node **13/13**, Python **12/12**. No application source was edited during this continuation. Whole-site coverage, binary image storage, industry/18-phase reconciliation, ambiguous identity resolution and final publication remain open.

Failure capture / contained recovery (`agent-introspection-debugging`): the failing operation was the client waiting on a long browser call, not a demonstrated source/network failure. Filesystem evidence showed the same writer continuing, so no concurrent replacement was started. A later verification assertion incorrectly assumed all 30 existing matches were drafts; it failed because one matched existing record was public. The corrected read-only check compares each record against its actual prior publication/classification state and verifies contact masking; it passed. This was a reporting assumption, not a reason to change publication settings.

### Prior handoff after user reconfirmed owner permission — historical snapshot

Ordinary access through the existing in-app browser works. The earlier direct-network failure was not evidence that all access was impossible. No CAPTCHA, proxy rotation, cookie copying or stealth was used. The supported browser API reads DOM snapshots and follows links already observed on source pages.

- Downloaded all **69 index pages**, containing **3,421 distinct category IDs/entries**. The source heading says 3,422; offline recount found 3,421 entries and no duplicate IDs. This discrepancy is unresolved, not silently counted as a complete 3,422-category inventory.
- Completed the sample category `484435`: **3 category pages, 36 distinct supplier profiles**, matching its current result-page count of 36 (the index badge says 40), **869 gallery URLs**. This is not evidence that all categories are complete.
- Expanded the durable queue to all 3,421 observed categories. Latest saved archive/export: **59 supplier profiles**, 4 category pages and **1,937 gallery URLs**; **3,439 mixed category/listing jobs pending**. All 59 exported profiles have an address, 53 have telephone links. Missing fields remain missing rather than being invented.
- First 36-profile reconciliation against all 21,680 Supabase enterprises: **36 inserts, 0 updates, 0 ambiguous matches**. Applied these **36 new records as DRAFT/unpublished**, with durable journal and database ACKs. Existing supplier records were not deleted/replaced. This is staging, **not a public-directory refresh**. Remaining 23 locally exported profiles have not been imported.
- **Binary images downloaded: 0.** URLs/captions are preserved, not independent image copies. No claimed migration to Supabase Storage.
- Crawl4AI 0.9.4 and dependencies are installed in ignored `.venv-crawl/`. No LLM extraction/model calls. Standard, fresh Chrome via Playwright was tested once (no user profile or stealth): HTTP 403, `Attention Required! | Cloudflare`. The standalone direct crawler still cannot run end-to-end from this machine.
- The browser collector runs in **awaited bounded batches**. An experiment launching it without awaiting failed with an execution-context error; it was stopped and resumed normally. **There is no unattended crawl running after this handoff.** Its saved queue must be resumed in an active supported browser session. Do not promise that it runs in the background or consumes no Codex quota.

Private snapshots/progress: `.crawl-data/trangvang-browser/`; supplier archive: `.crawl-data/trangvang-browser/pilot-484435/`. That directory now contains the expanded full-index queue despite its pilot name. Applied journal: `.crawl-data/trangvang/imports/2026-10-09T03-07-09-988Z/`. Do not publish these files: they contain contacts.

### Follow-up implementation and verification

- Added `tools/trangvang/browserArchive.mjs`: supported tab API only, observed same-source pagination, category membership, source-ID deduplication, private append-only ACK journal, one writer, resume, 3-second minimum interval, 2 GiB default archive cap, 1 GiB disk reserve, `STOP` file support. It does not perform database writes or solve challenges. The size cap can stop a large crawl before completion.
- Corrected the actual `listing_trai`/`tvxl`/`tvxc` parser: explicit supplier panels override the source's incorrect JSON-LD publisher phone/email; registration/footer contacts excluded; 83 Hanteco gallery images correctly extracted; company type, markets, customers, tax code, year, employees and branches retained. Empty image `src` no longer becomes the listing URL.
- Offline export: `python3 tools/trangvang/crawl.py --browser-archive .crawl-data/trangvang-browser/pilot-484435`. Preserves snapshot timestamps and category membership; rejects archive paths outside its pages directory. A `complete` flag concerns only the saved manifest scope.
- Importer stores branch prose privately, preserves image captions and places source photos first in both `gallery` and the directory's actual `images` field. Existing publication/KYC/phases remain unchanged; new profiles still require classification and publication.
- RED checkpoints on the current branch: `bd3ef19` (actual DOM scoping/gallery), `cc7500d` (publisher metadata/empty image sources), `c7c49b1` (browser archive missing), `4e969ce` (offline export/enrichment), `bbaddfb` (actual directory image field). Each failing target was executed before its corresponding production fix.
- Latest `npm test`: **144/144 passed**, no skips. Focused Node: **13/13 passed**, combined coverage **98.25% lines, 87.61% branches, 93.33% functions**. Python: **12/12 passed**. Node syntax/Python compilation and scoped whitespace checks passed. No frontend source changed; the prior build result below is historical, not a newly rerun build. Full Python branch coverage and live standalone crawling remain unverified.

### Remaining

Full supplier traversal, resolving source-count discrepancies, all-category live extraction checks, industry/18-phase reconciliation, publication, independent image storage and capacity/pagination work are still required. Public website cache invalidation is also required after future published updates. No public cache restart was needed for these hidden drafts. The current source access works only in the active browser, so an independently running crawler remains a technical limitation; owner permission is already confirmed and is not the missing authorization.

Self-evaluation for this follow-up: accuracy **4/5** (real DOM and database ACK evidence, unresolved source counts), completeness **2/5** (59 profiles, not whole site; staged not published), clarity **4/5** (explicit scope/background limitations), actionability **3/5** (durable queue exists but requires active browser), conciseness **4/5** (detailed evidence centralized here). Overall **3.4/5**. Highest-impact next steps: a legitimate autonomous access path, then full traversal/taxonomy/publication. The user would not accept a claim that the whole request is complete.

## Historical first pass — superseded counts, retained for audit

The user confirmed permission to reuse source data/images. The actual network preflight is still blocked: `python3 tools/trangvang/crawl.py --probe --start 'https://trangvangvietnam.com/categories/484435/an-toan-song-nuoc-phao-ao-phao,...html' --output .crawl-data/trangvang-pilot` exited **2**, reporting `robots.txt unavailable/blocked; no site-wide crawl attempted`. An earlier direct robots request returned a Cloudflare block page rather than robots rules. No bypass, CAPTCHA service, proxy rotation or stealth mode was attempted.

**Real suppliers crawled: 0. Supabase writes: 0. Binary images downloaded: 0.** The full A–Z refresh is not complete. No existing website data was replaced. Crawl4AI is pinned in a requirements file but has not been installed/run against the live source; preflight deliberately runs before importing it.

## Acceptance and implementation scope

- Discover all index/letter/pagination links encountered, then category pagination and listing URLs. Deduplicate URLs and source listing IDs; retain category membership when the same supplier appears in multiple industries.
- Resume through a private SQLite queue. A page is complete only after successful parsing and durable discovery. Blocking, unknown markup and robots failures stop the run instead of claiming success.
- Default pilot limit: 5 pages, sequential requests, at least 3 seconds between pages, longer when robots specifies a delay. No LLM/API inference or AI quota use.
- Extract structured business identity, address, corporate phone/email links, supplier website links, logo/gallery URLs and captions. JSON-LD and scoped DOM extraction are covered using synthetic HTML, **not verified against the current live Trang Vang markup**.
- Match imports by exact source identity or tax code, or exact normalized name plus address. Name-only, ambiguous and conflicting matches require review. Stable CCU IDs/URLs and existing phases/KYC/publication settings are preserved. Blank extracted fields never erase existing values.
- New suppliers are **DRAFT**, unpublished and unclassified, not fabricated as verified. Source verification/sponsor badges never become CCU KYC. A separate review/classification/publish workflow is still needed for new suppliers.
- Import is dry-run by default. Apply requires explicit live-read and configured project-host confirmation. Before each write: re-read/compare current record, fsync the private before/after journal, conditional update using `updated_at`, verify database acknowledgement and journal it. Failures stop the batch; previously acknowledged rows may already have changed (not a whole-batch transaction).
- Contact arrays live under the private `contact` key; legacy `phone`/`email` fields remain excluded by the existing public projection. Imported descriptions redact known contacts and recognizable email/phone patterns; original source prose is retained privately as `contact.sourceDescription`. Live review is still required for unstructured contact text. No service keys or contact dumps are committed.

## Files and commands

Crawler: `tools/trangvang/crawl.py`. Import planner: `server/crawling/trangvangImport.js`. Supabase CLI: `server/scripts/importTrangVangSupabase.js`.

First obtain crawler access approved by the source, or an authorized CSV/JSON/HTML export. Do not keep retrying blocked requests. Once access works, use a dedicated Python 3.12 environment:

```sh
python3.12 -m venv .venv-crawl
.venv-crawl/bin/python -m pip install -r tools/trangvang/requirements.txt
.venv-crawl/bin/crawl4ai-setup
.venv-crawl/bin/python tools/trangvang/crawl.py --probe
.venv-crawl/bin/python tools/trangvang/crawl.py --start 'https://trangvangvietnam.com/categories/484435/an-toan-song-nuoc-phao-ao-phao,...html' --output .crawl-data/trangvang-pilot --max-pages 5
```

The system Python here is 3.14; the bundled runtime is 3.12. Use an available 3.12 executable for environment creation. No dependency installer was run in this task because source access is blocked.

Review the pilot against source pages, including missing fields/false footer contacts and every gallery image, before a large run. A configured large page cap is an operational limit, not proof of completeness. `status.json` reports queue completion **for that run's discovered scope**, not independently verified coverage of the whole site.

```sh
# Export saved results without network access; never retries failed jobs implicitly.
python3 tools/trangvang/crawl.py --output .crawl-data/trangvang-pilot --export-only

# No network: requires an explicit existing-row snapshot.
node server/scripts/importTrangVangSupabase.js --source .crawl-data/trangvang-pilot/suppliers.jsonl --existing /absolute/path/private-enterprise-snapshot.json

# Read-only cloud reconciliation (can consume Supabase egress; no writes by default).
node server/scripts/importTrangVangSupabase.js --source .crawl-data/trangvang-pilot/suppliers.jsonl --live-read

# Only after review: writes the specific configured project, leaves new records DRAFT.
node server/scripts/importTrangVangSupabase.js --source .crawl-data/trangvang-pilot/suppliers.jsonl --live-read --apply --confirm-host PROJECT.supabase.co
```

Plans and journals contain private data; `.crawl-data/` and `.venv-crawl/` are gitignored. Do not put them in `public/`, share them in chat or commit them. Protect and retain the journal until reconciliation is complete. It records which rows have acknowledged writes; recovery must target exact IDs and recheck for subsequent Admin edits, not blindly replay a whole snapshot.

## Known gaps / next steps

1. **External blocker:** source must allow legitimate crawler access or supply an authorized export/API. No full job has been launched.
2. **Live extraction:** validate actual HTML selectors, contact sections, company-profile fields (branches, markets, years, employees) and lazy-loaded gallery coverage. Unstructured fields are not guessed or fabricated. Current parser does not guarantee all those fields.
3. **Media:** currently retains source image URLs only. Managed binary downloads/storage, MIME/size checks, per-host robots/permission checks and a storage budget remain before claiming images are fully migrated. Source links can expire; no full image backup exists.
4. **Taxonomy/publication:** cloud taxonomy/A–Z and industry multi-membership still need application wiring/reconciliation; parts of the website import local taxonomy JSON. New suppliers need approved 18-phase mapping and publication. Existing mappings are preserved.
5. **Performance:** the existing website loads a large bootstrap snapshot. Do not bulk-publish hundreds of thousands of records without paginated public reads and capacity/egress checks.
6. **Refresh:** direct CLI writes do not invalidate the already-running backend's in-memory bootstrap/repository caches. A controlled restart/cache invalidation and browser reload are required after a reviewed apply. No realtime synchronization is claimed.
7. **Recovery:** backup journal prepared, but no automated rollback command or whole-batch transaction exists. Interrupted `run.lock` files require checking that the process is no longer active before removal; failed jobs need deliberate review before requeueing.

## TDD and verification evidence

User journeys were derived from the request to refresh all supplier industries without damaging existing CCU records or exposing hidden contacts.

- RED checkpoint `2e016c5`: 6/7 Node cases failed and Python cases failed because the new import/crawl implementation was absent.
- Additional RED checkpoint `9c1058d`: JSONB key reordering caused a false conflict; a second runner reset another job before obtaining its lock. Both were reproduced and then fixed.
- Additional RED checkpoint `0d70fd6`: source prose exposed contacts through description, and export-only added the default index to a category queue. Both regression tests now pass.
- Node focused target: **9/9 passed**, import-model coverage **100% lines, 89.04% branches, 96% functions**. CLI/network/database branch coverage is not included in that percentage.
- Python `python3 -m unittest discover -s tools/trangvang -p 'test_*.py'`: **10/10 passed**. Includes mocked Crawl4AI index → two categories → one deduplicated supplier → export, queue resume, access failure, export-only scope and concurrent-run lock behavior. These are offline fixtures, not a live-source end-to-end result. Standard-library trace was diagnostic only; no validated branch-coverage percentage for the Python runner is claimed.
- `npm test`: **140/140 passed**, no skipped tests. No live AI, email, payment or database mutation invoked.
- `npm run build`: passed in 8.91 seconds. CLI Node syntax and Python compilation checks passed. Whitespace checking is scoped to this task; unrelated existing whitespace warnings were not modified.
- Live robots preflight: **BLOCKED**, exit 2, zero suppliers/zero writes.

## Self-evaluation

Accuracy **4/5**: offline tests and the blocked preflight support the stated behavior; live extraction and database apply are unverified. Completeness **2/5**: whole-site crawl, binary images, taxonomy reconciliation and publication remain undone due to the access blocker and unimplemented follow-ups. Clarity **4/5**: completed preparation is separated from actual data migration; the CLI workflow still needs an operator. Actionability **3/5**: commands and checkpoints are available, but the source must unblock access or provide an export. Conciseness **4/5**: detailed caveats are kept here rather than a long chat response. Overall **3.4/5**. Highest-impact next step is obtaining legitimate source access, then verifying a pilot and image/taxonomy/publication behavior before writing live data. Self-check: the user would not reasonably accept a claim that all data is refreshed; deliver only as tested preparation with an explicit external blocker.
