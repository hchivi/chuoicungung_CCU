# Trang Vang crawl optimization — 2026-10-10

## Outcome and scope

The user asked to make the existing authorized collection faster and resume it. Implemented incremental offline extraction, overlap between collection and export, bounded transient-navigation retries, per-page deadline checks, and correct supplier-heading precedence over publisher JSON-LD. No provider/API/model, database publication, binary-image downloads, challenge bypass, proxies or cookie transfer were introduced.

## User journeys and acceptance evidence

Journeys were derived from the user's request, not an external plan:

- Continue an interrupted archive without refetching acknowledged supplier pages.
- Process only new/changed HTML, but still update cross-industry memberships.
- Continue collecting while the offline exporter works; never run two exporters concurrently.
- Recover transient network failures with a bounded delay; do not retry source challenges/403s or mark failed pages complete.
- Preserve the supplier's visible name instead of importing the publisher's Organization name.

| Guarantee | Target | Evidence |
| --- | --- | --- |
| Cached HTML is not reparsed; new memberships and changed files still update | `tools/trangvang/test_crawl.py` | New test RED on missing `parsed` report; GREEN with parser patched to throw if unchanged HTML is reparsed |
| Supplier H1 takes priority over publisher JSON-LD | Same Python suite | RED returned `Publisher company`; GREEN returns `Supplier company` |
| Changed network connection retries once successfully; persistent failures stop after three attempts | `server/tests/trangvang-browser-archive.test.js` | RED navigation failure / one attempt; GREEN, one acknowledged page without duplication |
| 403 and DOM challenges do not retry; failed page stays pending | Same Node suite | GREEN with zero acknowledged failed pages |
| Deadline and STOP during backoff preserve pending work | Same Node suite | RED initially navigated past deadline; GREEN stops before navigation / next retry |
| Export overlaps the next collection batch and flushes the final completed manifest | Same Node suite, injected collector/exporter | RED missing pipeline; GREEN gated exporter proves overlap and final export |
| Export failure surfaces without concurrent exporters | Same Node suite | GREEN, maximum one active exporter and bounded next-batch work |
| Already-open pending page is read without redundant navigation, but a failed-navigation retry must navigate again | Same Node suite | Separate RED cases; GREEN includes failure changing the address bar before loading succeeds |

## Validation actually run

- `node --test --experimental-test-coverage --test-coverage-include='tools/trangvang/*.mjs' --test-coverage-lines=80 server/tests/trangvang-browser-archive.test.js`: **10/10**, **97.84% lines / 87.50% branches / 92.31% functions** across the collector and new pipeline.
- `python3 -m unittest discover -s tools/trangvang -p 'test_*.py'`: **14/14**. Standard-library trace over the same tests observed **41/43 executable lines (95.35%)** in `export_browser_archive`. This is a function-level trace metric, not full-module Python branch coverage. The `coverage` package is not installed; no dependencies were installed for this work.
- `npm test`, outside the filesystem/network sandbox so HTTP tests can bind localhost: **151/151**, zero skipped. The earlier sandbox invocation produced HTTP-test failures and did not finish; the unrestricted test run was the contained environment check and passed. Application code was not changed to make these tests pass.
- `node --check` on both crawler JS modules, Python compilation and scoped `git diff --check`: passed. No frontend changes; frontend build/type/lint tooling was not rerun. The changed crawler has syntax/test/coverage validation rather than a frontend build claim.
- No credentials or live cloud database operations are needed by the modified modules. All new test fixtures use synthetic contacts and isolated temporary directories. Existing unrelated working-tree changes were preserved.

TDD checkpoints on the active branch: `000e0ab` (retry/cache/name RED), `eea6d87` (overlap pipeline RED), `07eda8e` (already-open page RED), `130359a` (failed-navigation changed URL RED); GREEN **`3ce51cc`**. Tests were executed before production edits, and checkpoint history was not rewritten.

## Real archive timing

Commands: `/usr/bin/time -p python3 tools/trangvang/crawl.py --browser-archive .crawl-data/trangvang-browser/pilot-484435`.

| Run | Profiles | Parsed / reused | Wall time |
| --- | --- | --- | --- |
| Cold corrected rebuild/cache population | 4,830 | 4,830 / 0 | 60.36 seconds |
| Unchanged warm export | 4,830 | 0 / 4,830 | 0.96 seconds |
| Two new profiles | 4,832 | 2 / 4,830 | 0.84 seconds |

The approximately 63x reduction concerns **unchanged offline export only**, not overall website collection. Rewriting the JSONL and stat/cache reconciliation still scale with total profiles. Raw HTML remains authoritative; cache signatures include parser version, file identity, mtime and size. Parser changes must bump the cache version. New industry memberships are reconciled outside the content cache. No image/keyword counts or whole-site completeness are inferred from this benchmark.

## Actual resumed execution

- Two-page live probe saved 4,830 → **4,832**, 6.976 seconds, no error or retries. It used the existing agent-owned tab 5; user tabs were not navigated.
- Started the optimized awaited execution at **2026-10-10 01:32:28 UTC / 08:32 Vietnam**, new six-hour deadline **07:32:28 UTC / 14:32 Vietnam**. The collector now checks the budget before each navigation/retry; in-flight navigation and final export can finish later.
- Mode: `incremental-overlapped`, 60-page batches, one collector, at most one offline exporter, minimum three-second source interval, 10 GiB archive limit / 1 GiB disk reserve. Progress and acknowledged HTML are retained per page. Transient navigation gets at most two retries with 3/6-second backoff. Export/source failures stop the pipeline; no infinite self-healing loop.
- At 01:33:05 UTC: **4,843 saved**, no collector error. Runner state `running`. The previous stopped runner was archived privately in `runner-history.jsonl`; no duplicate collector was launched.
- At 01:36:27 UTC: **4,899 saved / 162 category pages**, no error. First automatic optimized export succeeded with **4,891 profiles: 59 newly parsed / 4,832 reused**. The second collection batch was already advancing while this export completed. During overlap, `runner-status.json.lastExport` can lag until the next batch checkpoint; use `export-status.json` for the most recent completed export, and `browser-status.json` for saved pages.
- The worker still depends on the app/browser/runtime and awake machine. It is not an installed OS service, and there is no automatic notification/dashboard. Future turns must check actual status rather than assume it survived closure or a network failure.

Runtime loading note: the Node tool's absolute-path importer did not accept a query suffix. A standard `file:///.../browserArchive.mjs?optimized=20261010a` import loaded the changed module successfully without resetting the browser runtime. This was a local-module loading issue, not a source block.

Contained cleanup: identified the original stalled sandbox test parent/child PIDs from the process table and terminated only those three test processes after the unrestricted suite passed. The collector and website were not stopped. A status-check one-liner had a syntax typo; it did not touch state and was replaced with a simpler read-only command.

## Remaining boundaries

Full-site reconciliation, complete structured product/service keywords/contact-person associations, independent image files, ambiguity review, taxonomy/18-phase mapping and publication remain unfinished. Corrected names were regenerated locally; previously imported cloud records were not silently edited. No full-site completion ETA or overall speed multiplier is claimed.

Loop review (`loop-design-check`): existing deterministic archive worker, not a new LLM judgment loop. Tests independently check bounded retries, deadlines, writer ordering and preserved pending work. Queue exhaustion is only a discovered-scope condition; it cannot certify all source industries. Human approval remains necessary for cloud publication.

## Self-evaluation

Overall **4.0/5**: accuracy **4/5** (real timings, tests and increasing archive counts; long-run throughput not benchmarked); completeness **4/5** (requested optimizations implemented/resumed; total collection remains incomplete); clarity **4/5** (export-only gain distinguished from end-to-end speed; no dashboard); actionability **4/5** (running with private checkpoints, but app/awake-machine dependency); conciseness **4/5** (evidence centralized here, startup still involved multiple checks). Improvement: add a durable user-visible progress/failure surface in a separately scoped change; benchmark sustained collection against the previous serial/export workflow. Self-check: the user can reasonably accept measured processing improvements and resumed collection, not a claim that all data is finished. Verdict: deliver as verified, with runtime/completeness limits explicit.
