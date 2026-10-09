# Permissioned Trang Vang refresh — 2026-10-09

## Status: implementation prepared; live crawl and publication blocked

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
