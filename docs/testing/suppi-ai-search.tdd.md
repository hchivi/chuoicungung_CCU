# SUPPI AI Search Engine — TDD Evidence

## Source

User journeys were derived from the architecture audit and the implementation request on 2026-09-29. No external plan file was used.

## User journeys

1. A buyer describes a sourcing need naturally and receives only CCU database results.
2. A buyer can answer a follow-up such as “Long Thành” without repeating “carton”.
3. Sponsorship does not affect organic ranking.
4. SUPPI can call strict Responses API functions and continue with matching `call_id` values.
5. SUPPI may create a draft but cannot publish or submit a requirement.
6. The homepage search opens a conversational search experience.

## RED → GREEN evidence

| Behavior | RED evidence | GREEN evidence |
| --- | --- | --- |
| Search, strict tools, drafts and Responses loop | `npm test` failed with `ERR_MODULE_NOT_FOUND` for the new SUPPI modules | 8/8 initial tests passed after implementation |
| Conversation memory and safe fallback | `npm test` failed because `conversationStore.js` was missing | Conversation tests passed, including `carton → Long Thành` and no-result behavior |
| All searchable domains are loaded | Test failed because `dataSource.js` was missing | Loader test passed with suppliers, factories, KCNs, associations, products, programs, catalogues and public requirements |
| Hybrid rank fusion | Test failed because `atlasHybridSearch.js` was missing | Fusion test passed and confirms commercial fields are stripped |
| HTTP conversation API | Test failed because `app.js` was missing, then sandbox denied localhost binding | Escalated local integration run passed 16/16 tests with no skips |

## Guarantees

| # | Guarantee | Test | Type | Result |
| --- | --- | --- | --- | --- |
| 1 | Natural supplier search combines query and location | `suppi-search.test.js` | Unit | PASS |
| 2 | Sponsor flags cannot alter organic order | `suppi-search.test.js` | Unit | PASS |
| 3 | Tool schemas are strict and expose no publish/submit tool | `suppi-tools.test.js` | Contract | PASS |
| 4 | Draft starts as `DRAFT` with null submit/publish timestamps | `suppi-drafts.test.js` | Unit | PASS |
| 5 | Function output preserves the OpenAI `call_id` | `suppi-responses.test.js` | Integration | PASS |
| 6 | Unknown tool calls are rejected | `suppi-responses.test.js` | Security | PASS |
| 7 | Conversation remembers carton when the next message is only Long Thành | `suppi-orchestrator.test.js` | Integration | PASS |
| 8 | No database match produces an explicit no-result answer | `suppi-orchestrator.test.js` | Integration | PASS |
| 9 | Every requested entity domain has a data source | `suppi-data-source.test.js` | Integration | PASS |
| 10 | Hybrid fusion uses lexical + vector ranks without commercial fields | `suppi-hybrid.test.js` | Unit | PASS |
| 11 | HTTP API preserves context across two messages | `suppi-api.test.js` | HTTP integration | PASS in socket-enabled run |

## Commands and results

- `npm test`: 15 passed, 1 environment-gated HTTP test skipped, 0 failed.
- `RUN_HTTP_TESTS=1 SUPPI_DISABLE_OPENAI=1 npm test`: 16 passed, 0 failed, 0 skipped.
- `npm run test:coverage`: SUPPI service line coverage 84.54%, threshold 80%.
- `npm run build`: production build passed. Existing unrelated `CATEGORY_HUBS` export warning remains.

## Known gaps

- Live Responses API was not called because that consumes external API quota.
- Atlas text/vector indexes must be created in the target cluster before running `npm run suppi:index`.
- Browser-level E2E is not included; HTTP, service and production-build checks cover this MVP.
- Checkpoint commits were intentionally not created because the working tree already contains extensive user changes unrelated to SUPPI.
