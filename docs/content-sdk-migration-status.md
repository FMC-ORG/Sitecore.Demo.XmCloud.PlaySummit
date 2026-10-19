# Content SDK migration execution status

## Approved approach

- Purpose: reusable modular demo for sales engineers.
- Scope: XMC rendering/authoring code only; keep Pages Router for minimum disruption.
- Execution: modify the existing `src/rendering` in a separate Git checkout/worktree.
- Merge: only after migration completion, test evidence and review. No automatic merge or deployed-host switch during setup.
- No permanent `src/rendering-content-sdk` app directory is required by this approach.
- Excluded frontend integrations are preserved under the planned `legacy/play-integrations/` archive outside the active build.
- Mixed CMS components retain UI/content contracts and native XMC events with safe fallbacks; integration-only widgets show editor notices and are hidden from delivery.
- Visual editing/preview is Pages/Page Builder-only; normal Content Editor administration remains.
- Preserve `en`, `fr-CA`, `ja-JP` routing; validate available content and Japanese fallback without claiming unavailable translations.
- Fresh sandbox visitor identities are acceptable; no legacy CDP profile migration or guest-data deletion.
- Remote XM Cloud plus local Next.js is the supported acceptance workflow; full Windows CM/Docker validation is not required.
- First release validates existing XMC/native capabilities, not new showcase features or service provisioning.

Detailed findings and scope: [upgrade discovery](content-sdk-upgrade-discovery.md).

## Checkout locations

| Role | Location | Branch |
| --- | --- | --- |
| Original/reference | `/home/fedmuj/projects/Sitecore.Demo.XmCloud.PlaySummit` | `main` |
| Migration | `/home/fedmuj/projects/Sitecore.Demo.XmCloud.PlaySummit-content-sdk` | `migration/content-sdk-pages-router` |

The migration branch starts at `1ea92e5`. Future migration edits/commands must explicitly target the migration checkout; the harness's original working directory is not implicitly changed by creating a worktree.

## Completed

- [x] Confirmed demo purpose, XMC-only scope and Pages Router.
- [x] Created a separate worktree and migration branch.
- [x] Copied the existing uncommitted discovery notes into the migration checkout; did not move, stage or commit the original notes.
- [x] Updated the migration copy of the discovery document with the approved worktree approach.
- [x] Verified original checkout status and discovery/checkpoint file hashes remained unchanged after worktree creation.
- [x] Preserved original downloaded package artifacts and recovery/transport references.
- [x] Completed the eight-question decision review; the user selected A for every question.
- [x] Implemented ticket 01's rendering-host baseline: seven checks, repeated twice for 14 passes with zero failures/flaky results; test lint, application TypeScript and formatting also pass.

- [x] Implemented ticket 02's XMC-only prefactor: 395 preserved source files, excluded runtime dependencies/APIs/global wiring removed, compatible CMS UI retained with fallbacks, and 17 browser/HTTP checks repeated twice for 34 passes. Application ESLint/Stylelint, TypeScript and baseline lint pass.

- [x] Implemented ticket 04's Content SDK foundation: compatible patch targets, new client/provider/config/maps/proxy/editor wiring, temporary caller/type bridges, 21 browser/HTTP checks repeated twice for 42 passes, and passing types/lint/optimized production build plus production HTTP smoke.

- [x] Implemented ticket 05's native shell and editable primitives: direct SDK/Page APIs, custom context and nested presentation preserved, missing/empty states hardened, 29 cases repeated twice in development for 58 passes plus all 29 cases passing against the optimized production build. Types and both lint gates pass.

- [x] Implemented ticket 06's native homepage/marketing callers and representative visual/interactions coverage: 36 cases repeated twice for 72 development passes, all 36 production passes, and passing types/lint/optimized build. Earlier mode tests were strengthened and rerun; see the explicit warm-up/fixture limitations in the marketing record.

- [x] Implemented ticket 07's native session discovery: working bounded CMS search/order, integrated query compatibility fixes, safe missing relations and metadata states; 44 cases repeated twice for 88 development passes and all 44 production passes, with types/lint/optimized build green.

- [x] Implemented ticket 08's native speaker discovery: featured/grid/detail/related-session journey, missing-data fixes and metadata editing; 48 cases repeated twice for 96 development passes and all 48 production passes, with types/lint/optimized build green.

- [x] Implemented ticket 09's native sponsor/vendor journeys: grids, selected/featured logos, detail/history/related sessions and speakers, missing-data and editing states; 53 cases repeated twice for 106 development passes and all 53 production passes, with types/lint/optimized build green.

- [x] Implemented ticket 10's native news journey: list/grid/detail, newest-four ordering, image/date/excerpt/body, missing-data and editing states; 57 cases repeated twice for 114 development passes and all 57 production passes, with types/lint/optimized build green.

- [x] Implemented ticket 11's native analytics and questionnaire: verified page-view/edit-preview/bot/identity/failure behavior against a simulated Edge boundary, fixed questionnaire crash and blocking event; production checks now run in simulated Edge mode behind a loopback-only server fetch guard. 63 cases: 116 development passes (10 skips by design) and all 63 production passes.

- [x] Implemented ticket 12's native embedded personalization verification: template-equivalent proxy/page wiring proven against a simulated Edge personalize boundary (variants, hiding, isolation, identity, timeout/failure, editor preview); existing definitions unchanged. 70 cases: 116 development passes (24 skips by design) and all 70 production passes.

- [x] Implemented ticket 13's retained forms and native components: content-based Forms/FEaaS/BYOC survey, simulated ticket journey, BYOC/FEaaS containment, Send notice, non-blocking native form events; no active file uses the JSS alias anymore. 76 cases: 122 development passes (30 skips by design) and all 76 production passes.

- [x] Implemented ticket 14's multilingual routing and redirects verification: fr-CA content/dictionary/editing, ja-JP fallback (no translations claimed), path/query-preserving switching, localized 404s, redirect contract with exclusions; no app change needed. 83 cases: 132 development passes (34 skips by design) and all 83 production passes.

- [x] Implemented ticket 15's contract and complete local verification: JSS compatibility adapter, JSX bridge and alias wiring removed; leftover JSS infrastructure archived; offline Storybook preparation; reproducible `npm ci`; platform contracts (health/robots/sitemap/metadata/blocking fallback/5 s ISR) verified. 89 cases: 140 development passes (38 skips by design), all 89 production passes; Storybook 87 stories render.

**The foundation now uses Content SDK Next.js 2.4.1, CLI 2.3.0, Next.js 16.4.1, React 19.3.1 and TypeScript 5.8.3 on Node 24.19.0.** Old JSS packages are not installed; the temporary compatibility adapters were removed in ticket 15; all callers use Content SDK directly. Platform/items/public media and deployed hosts are unchanged. Editing-host source configuration declares Node 24.19.0 but was not deployed.

## Current ticket frontier

- **01 — completed:** home content, navigation, session list-to-detail, public 404, missing datasource, and unauthenticated/authenticated editing-configuration behavior.
- **02 — completed:** excluded source archived with raw-byte/Git-clean provenance, legacy APIs/providers/dependencies removed, editor notices/delivery hiding and CMS fallbacks verified.
- **04 — completed:** Content SDK Pages Router foundation, secret-protected metadata entry, SDK descriptor, native config/maps/proxy, compatible runtime and fixture-backed production verification.
- **05 — completed:** native navigation/shell/layout/field helpers, context and metadata identities, safe missing/empty states, preserved nested slots/partial designs and development/production browser/HTTP verification.
- **06 — completed:** native marketing callers, image/empty-field/reference fixes, preserved nested compositions and pre-native visual comparison, full development/production verification.
- **07 — completed:** native session list/detail, bounded CMS filtering/ordering, query-shape compatibility, missing-relation/metadata coverage and development/production verification.
- **08 — completed:** native speaker list/featured/detail, session-detail speaker list, missing-data fixes and metadata editing, development/production verified.
- **09 — completed:** native sponsor/vendor listings, selected/featured logos, detail journeys, missing-data fixes and editing states, development/production verified.
- **10 — completed:** native news list/grid/detail, accessibility/ordering/missing-data fixes, tweet-panel image and editing states, development/production verified.
- **11 — completed:** native events verified at the Edge network boundary (production, simulated Edge mode), questionnaire migrated and fixed, loopback-only harness guard.
- **12 — completed:** embedded personalization verified at the Edge boundary (no app change needed); fault-sensitivity proven; definitions untouched.
- **13 — completed:** retained demo forms and ticket journey, BYOC/FEaaS/Forms rendering contracts, non-blocking native events, JSS alias unused by active code.
- **14 — completed:** locales, fallback, switching and redirect contract verified (redirects production-only by SDK/JSS default; empty real redirect map noted).
- **15 — completed:** bridges removed, JSS leftovers archived, whole-application green locally (development and production modes), Storybook and docs updated.
- **16 — blocked by 03:** live XMC acceptance and merge readiness need the authorized nonproduction environment.
- **14 — ready:** multilingual/redirect coverage can also proceed after the completed shell; no translations or live redirect behavior are claimed yet.
- **03 — blocked:** specific authorized nonproduction environment/private settings/test-host/testing-owner configuration is absent. No live service calls were attempted.
- Other tickets remain gated by their local blocking edges. No ticket files are staged or published.

Run the baseline from the rendering application with `npm run test:baseline`; repeat with `-- --repeat-each=2`. Set `BASELINE_LEGACY_CDP=1` to prove obsolete local-only integration settings cannot affect retained CMS content. Use `npm run lint`, `npm run lint:baseline` and the application TypeScript check for local quality gates. The active archive/inventory and restoration notes are in [preserved frontend integrations](../legacy/play-integrations/README.md). See the test-suite README for fixture boundaries and the lifecycle/native-media validation limitation.

Historical baseline finding: Next.js 14 internal multisite rewrites looped when browser/dev-server hostnames differed; matching localhost fixed HTTP 431. The target now installs with native lifecycle checks and passes an optimized production build and production HTTP smoke. Live optimized media, tenant publishing and native analytics/personalization still require real environment acceptance. See [foundation details and temporary bridges](content-sdk-foundation.md) for the loader-export workaround, hydration fix and known warnings; [native shell/field details](content-sdk-shell-and-fields.md) describes ticket 05. [Native marketing details](content-sdk-marketing-content.md) records the corrected mode assertions, fixture headers, short-lived preview/cold-dev limitation and pinned visual reference. [Session discovery details](content-sdk-session-discovery.md) record filtering scope and integrated-data limits. [Speaker discovery details](content-sdk-speaker-discovery.md) record featured/grid contracts and fixed failures. [Sponsor/vendor details](content-sdk-sponsors-vendors.md) record resolver contracts, fixes and the unchanged decorative grid filters. [News details](content-sdk-news.md) record ordering, fixes and the date/time-zone note. [Analytics/questionnaire details](content-sdk-analytics-questionnaire.md) record the event contract, Edge-mode harness and loopback guard. [Personalization details](content-sdk-personalization.md) record the variant flow, isolation and limits. [Forms/native-component details](content-sdk-forms-native-components.md) record the content survey and event fix. [i18n/redirect details](content-sdk-i18n-redirects.md) record the language facts and redirect contract. [Contract/verification details](content-sdk-contract-and-verification.md) record the cleanup and complete local gates; the [development guide](content-sdk-development.md) describes the remote-first workflow.

## Next implementation sequence

1. **Preserve a baseline and classify the XMC boundary.** Inventory CMS component names/variants and identify imports that pull in excluded integrations. Keep the original checkout/deployment as the reference; distinguish existing failures from migration regressions.
2. **Replace the SDK foundation in `src/rendering`.** Use the pinned Content SDK Pages Router template as reference. Update packages, typed config/client/providers, CLI generation, proxy, editing routes and page props. Preserve route and ISR contracts.
3. **Migrate XMC components incrementally.** Preserve item IDs, placeholders, integrated GraphQL and content styles; update React typings, page mode/context access and metadata editing.
4. **Isolate external integrations without upgrading them.** Do not force Discover/Search/Auth0/commerce packages into the XMC dependency tree. Any source quarantine/exclusion or intentional missing external-integration rendering must be explicit and reviewed, not silently claimed as feature parity.
5. **Restore native XMC capabilities.** Validate embedded personalization, native analytics and required Forms/FEaaS/BYOC rendering support.
6. **Update build/runtime configuration and tests.** Node 24+, compatible Next.js 16/React 19/TypeScript, explicit bundler strategy, independent lint/type checks, tests and reproducible lockfile.
7. **Test in a nonproduction tenant and review.** Verify Pages authoring and publish-to-Live delivery, then prepare—not automatically perform—merge/cutover.

## Merge gates

- [ ] Target dependency installation has no ignored peer conflicts or forced compatibility exceptions.
- [ ] Lint, type checks, production build and relevant automated tests pass.
- [ ] XMC routes preserve intended URLs, locales, placeholders and required component variants.
- [ ] Integrated query fields and custom CM context/image/CMP data contracts are validated where required.
- [ ] Pages editing/preview, save, component add/remove and publication are tested in an authorized nonproduction environment.
- [ ] Native analytics/personalization behaves correctly in normal/edit/preview modes and missing-cookie cases.
- [ ] Excluded external integrations do not enter the migrated XMC build; intentional scope differences are documented.
- [ ] Editing-host/delivery environment variables, runtime and secret scoping are reviewed.
- [ ] Rollback to the previous deployment is documented and tested where applicable.
- [ ] Changes are reviewed before merge into `main` or another agreed integration branch.

## Accepted decisions and remaining prerequisites

See the [accepted decision record](content-sdk-open-decisions.md). All eight scope/acceptance choices are approved. Local implementation can proceed under those constraints. The specific nonproduction environment, private connection settings, test editing-host configuration and live-testing owner/evidence remain pending; no connection or deployment was created by the answers.

## Specification

The [upgrade spec](specs/xmc-content-sdk-upgrade.md) synthesizes the accepted scope, user stories, implementation constraints and test gates. The implementation uses the rendering-host browser/HTTP seam declared in the approved local ticket 01, with controlled upstream content. Real nonproduction Pages/publication evidence remains pending; no additional private-module seam was introduced.

Issue-tracker publication is blocked: no configured project tracker/triage vocabulary was found. Run `/setup-matt-pocock-skills` before publishing with `ready-for-agent`. No issue or label has been created.

## Pending environment evidence

No nonproduction tenant connection or live editor testing has been performed. Credentials should be configured privately, never copied into these documents. A successful local build alone does not satisfy the authoring/publication gates.

## Recovery records

- Original research checkpoint: [content-sdk-migration-checkpoint.md](content-sdk-migration-checkpoint.md), copied without modifying its contents.
- Worktree setup records were stored in `/tmp/playsummit-worktree-setup.hyOQ8P/` and verified through ticket 06. That temporary directory was later cleared by the system; its prior hashes cannot be rechecked. Ticket 07 recorded the original checkout's current Git state and note hashes as observations only (no tracked source/config diff, no staging, HEAD `1ea92e5`), not as a recovered baseline.
- Original package research reference: `/tmp/playsummit-content-sdk-3lsv0leo/`. This temporary directory is absent in the current session; the checkpoint and references are preserved. Refresh package evidence before the SDK replacement rather than claiming the old cache still exists.
- Baseline execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-01.H4JuF0/`, locally Git-excluded, including red/green logs and retained traces/screenshots.
- Prefactor execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-02.o4qUWH/`, locally Git-excluded, with source hashes, append-only archive ledger, red/green logs and provenance reconciliation receipts.
- Foundation execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-04.LnMkt7/`, locally Git-excluded, including refreshed registry/tarball evidence, preserved old lock/dependency tree, red/green/protocol/hydration logs, production build/HTTP smoke and a verified owned-test-process cleanup receipt.
- Native shell execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-05.1vkLNJ/`, locally Git-excluded, with before-source snapshots, retained red/green traces/logs, final development/production suite receipts and optimized build logs.
- Marketing execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-06.UkIcyf/`, locally Git-excluded, with original/native source snapshots, original/pinned visual references, restored-source hashes, retained failures, mode diagnostics and final development/production receipts.
- Session execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-07.yq4SHt/`, locally Git-excluded, with before-source snapshots, filter-contract observation, red/green logs, interrupted/retried production logs and owned-process cleanup receipt.
- Speaker execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-08.GyAUBE/`, locally Git-excluded, with before-source snapshots, contract observation, red/green and pre-native differential logs, and development/production receipts.
- Sponsor/vendor execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-09.PhbJIg/`, locally Git-excluded, with before-source snapshots, contract observation, red/green and pre-native differential logs, and development/production receipts.
- News execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-10.NhwEvd/`, locally Git-excluded, with before-source snapshots, contract observation, red/green and pre-native differential logs, and development/production receipts.
- Analytics execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-11.SyCQE0/`, locally Git-excluded, with snapshots, contract observation, red/green logs, fault-injection receipts and the CRLF restoration incident record, and development/production receipts.
- Personalization execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-12.4H5mC3/`, locally Git-excluded, with contract observation, definition hashes, characterization logs, fault-injection builds/receipts (including two invalid attempts), and development/production receipts.
- Forms/native-component execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-13.ngaTU7/`, locally Git-excluded, with snapshots, content survey, red/green logs, BYOC fault injection and development/production receipts.
- i18n/redirect execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-14.7ae8X4/`, locally Git-excluded, with content observation, debug evidence for the development redirect default, fault-injection receipts and development/production receipts.
- Contract/verification execution records: `.scratch/xmc-content-sdk-upgrade/runs/ticket-15.oXcMBI/`, locally Git-excluded, with bridge copies, generated JSS temp copies, legacy-move receipts, npm ci/ls logs, Storybook build and render smoke, ISR header probe, fault-injection receipts and development/production receipts.
- Old source snapshots: `legacy/jss-infrastructure/preservation-manifest.json`; private environment/generated config was not archived.
- Future baseline invocations retain separate timestamped results under the rendering application's Git-ignored test-results directory.

Existing records have not been reset, reinitialized or deleted. A Git worktree is a checkout, not an additional agent worker.
