# Content SDK migration — accepted decision record

This record follows the approved [migration plan](content-sdk-upgrade-discovery.md) and [worktree setup](content-sdk-migration-status.md). The user answered **A to all eight questions**. Scope/acceptance choices are now settled; private environment connection details and actual test evidence remain pending. No application code was changed by this decision review.

## Already settled — do not reopen unnecessarily

- This is a modular SE demo, not a production starter.
- Upgrade only XMC rendering/authoring code to Content SDK.
- Keep Pages Router for minimum disruption.
- Work in the separate `migration/content-sdk-pages-router` checkout, modifying `src/rendering` there.
- Preserve the original checkout and recovery records.
- Merge only after completion, testing and review.
- Do not upgrade commerce, Discover, Auth0, separate Search, legacy CDP/Send or connectors in this migration.
- **Question 1 accepted: option A.** Preserve excluded frontend integration source/history in a clearly labeled archive outside the active application build, with `legacy/play-integrations/` as the planned location. Do not introduce a second runnable frontend or modify Sitecore/backend connector assets for this archival step.
- **Question 2 accepted: option A.** Preserve CMS UI/content/rendering contracts, remove archived integration calls, keep applicable native XMC events, and use safe static fallbacks. Integration-only widgets show an editor notice and are hidden from normal delivery.
- **Question 3 accepted: option A.** Use Pages/Page Builder metadata editing and preview in the migrated frontend; retain Content Editor for normal administration, not its legacy preview. The current deployed demo remains unchanged until migration testing and cutover approval.

- **Question 4 accepted: option A.** Use an existing dedicated nonproduction XM Cloud environment and a test editing host without changing the current demo's active host. Environment identity, access configuration and test ownership still need to be supplied privately; no connection or deployment is configured by this answer.

- **Question 5 accepted: option A.** Preserve `en`, `fr-CA` and `ja-JP` routing. Validate English/French Canadian content and editing, plus Japanese routing/fallback; do not claim full Japanese translation support without ready tenant content.

- **Question 6 accepted: option A.** Fresh sandbox/native analytics visitor identities are acceptable. Preserve personalization definitions and required native events; do not migrate legacy CDP profiles or delete existing guest records. This does not authorize resets of Git, agent/session, recovery or transport records.

- **Question 7 accepted: option A.** Support remote XM Cloud with local Next.js development and test-host validation. Full local Windows CM/Docker compatibility is not a release acceptance requirement. Preserve existing Docker source; do not expand this migration into CM/container modernization.

- **Question 8 accepted: option A.** Validate the focused upgrade of the existing XMC demo: core CMS pages/renderings, Pages editing/publishing, approved locale routing/fallback, native analytics/personalization, existing used/provisioned native Forms/FEaaS/BYOC, and install/lint/type/build/regression checks. No new showcase features, mandatory new Design Studio demo or service provisioning.

## A. Implementation decisions — original questions and accepted answers

### 1. Where should excluded integration source live after the merge?

**Question:** may we preserve excluded routes/components/services in a clearly documented archive or package outside the active Next.js build, rather than leave them under its `pages` and broadly included TypeScript source tree?

This is not a request to delete or upgrade them. The original checkout remains untouched. But after merging, the migrated app cannot both ignore those features and continue compiling all their legacy dependencies without a real isolation boundary.

**Evidence:** [current TypeScript config](../src/rendering/tsconfig.json) includes `**/*.ts` and `**/*.tsx`; the frontend package contains the excluded integration dependencies. Next.js says: “When a file is added to the `pages` directory, it's automatically available as a route.” [Pages Router docs][pages-docs]

**Recommended default:** preserve source/history outside the active application's route/component-map/type-check input; document future restoration. No permanent second runnable frontend is required. Name/location must be approved before moving files. An env toggle or blanket `skipLibCheck` is not dependency isolation.

**Accepted answer: A — archive outside the active app.** Preserve excluded frontend code in the repository with Git history, provisionally under `legacy/play-integrations/`, and document restoration. The original checkout remains untouched. This approves the preservation strategy; no files have been moved yet.

### 2. How should existing CMS pages behave when they contain excluded integrations?

**Question:** can mixed CMS components keep their content/UI while dropping out-of-scope calls, and can integration-only widgets render an explicit editor placeholder or a neutral delivery fallback?

Examples:

- [DynamicWelcomeMessage](../src/rendering/src/components/PageContent/DynamicWelcomeMessage.tsx) obtains its message through **legacy Boxever**, not automatically through XMC embedded personalization.
- [Questionnaire](../src/rendering/src/components/Questionnaire/Questionnaire.tsx) combines legacy CDP and Context-aware analytics calls.
- [_app](../src/rendering/src/pages/_app.tsx) and the [CMS catch-all](../src/rendering/src/pages/[[...path]].tsx) import Search, legacy CDP and Send behavior globally.
- Serialized page layouts can still reference externally powered renderings even if their packages/routes are removed from the migrated build.

**Recommended default:** preserve rendering names, content fields and normal UI where possible; send only approved native XMC events; use the existing static welcome fallback for the legacy welcome flow. For integration-only widgets, show a clear editor hint and avoid dead delivery navigation. Do not mutate Sitecore layouts/items or claim old personalization flows were recreated without approval.

**Accepted answer: A — preserve CMS UI with safe fallbacks.** Keep names, fields and styling, remove archived calls, retain applicable native XMC events and use a static welcome message. Integration-only widgets show an editor notice and are hidden from normal delivery. Inventory affected rendering names before implementation; do not claim legacy personalization flows were recreated.

### 3. Is Pages-only authoring explicitly accepted?

**Question:** can we retire Experience Editor and Content Editor Preview support for the migrated demo?

Keeping **Next.js Pages Router** does not preserve **Sitecore Experience Editor**. Those are different meanings of “Pages.”

Official migration guidance states: “Content SDK removes all Experience Editor–based rendering and preview capabilities, including preview functionality accessed from the Content Editor. Preview and editing are supported only through Page Builder.” [Migration guide][migration-docs]

**Recommended default:** yes; support Sitecore Pages/Page Builder metadata editing. Keep Content Editor for normal content administration, without promising its old preview integration.

**Accepted answer: A — Pages/Page Builder-only visual editing.** Retain normal Content Editor administration, but do not promise Experience Editor or Content Editor Preview support in the migrated frontend. Validate metadata editing before merge/cutover; do not switch the currently deployed demo during migration.

### 4. Which authorized nonproduction environment and test editing host can we use?

**Question:** which XM Cloud environment can be used for live/preview parity, native analytics/personalization and editor testing, without switching the current demo's active editing host?

There is no `src/rendering/.env.local` in the migration checkout, and no tenant/editor testing has occurred. SDK package/framework migration can begin with fixtures, but the merge gates cannot be completed through a build alone.

Official guidance distinguishes Live access to published content from Preview access to drafts and requires scoped public Context IDs for browser usage. [Context ID docs][context-docs]

**Recommended default:** an authorized nonproduction environment plus a separately configured test editing host/deployment. Put credentials/Context IDs in private configuration, not chat or Git. The current demo host remains unchanged until acceptance.

**Accepted answer: A — existing dedicated nonproduction environment.** Use a separately configured test editing host and leave the current demo host unchanged. The specific environment, access and testing owner remain pending; configure secrets privately, not in chat/Git. Live validation has not yet occurred.

## B. Questions with reasonable defaults

### 5. Which locales require demonstrated end-to-end support?

**Question:** are `en` and `fr-CA` required demo journeys, and is `ja-JP` also required or merely retained as a configured locale?

**Evidence:** [Next config](../src/rendering/next.config.js) declares three locales; [XM Cloud publishing configuration](../xmcloud.build.json) selects `en` and `fr-CA`. Published item versions are not proof of complete authoring/translation support.

**Recommended default:** do not remove declared locales during the SDK migration. Test English/French Canadian plus the actual Japanese fallback/routing behavior; claim translated Japanese demo support only if its tenant content is ready.

**Accepted answer: A — preserve all three configured locales.** Keep `en`, `fr-CA` and `ja-JP` routing. Validate English/French Canadian content/editing and Japanese routing/fallback. Full translated Japanese demo acceptance remains conditional on available content; do not remove the locale or silently expand the publishing configuration.

### 6. Is fresh native analytics visitor state acceptable?

**Question:** must existing identities/experiments continue across cutover, or is a fresh sandbox/native analytics visitor acceptable for the SE demo?

The SDK renames analytics cookies `sc_{contextId}` → `sc_cid` and personalize cookies → `sc_cid_personalize`. The existing demo's legacy Boxever identity/reset behavior is separate from the modern SDK analytics identity. [Tracking migration][tracking-docs], [legacy demo controls](../src/rendering/src/services/KeypressHandlerService.tsx)

**Recommended default:** synthetic/sandbox visitors and no cross-SDK legacy profile migration. Preserve required XMC page/audience/native personalization events; prevent duplicate events and edit/preview tracking. This concerns demo visitor behavior, not resetting the agent/session/recovery records; none are reset by this review.

**Accepted answer: A — fresh sandbox visitor identities are acceptable.** Test native analytics/personalization using fresh visitors without requiring historical identity/assignment continuity. Preserve definitions and required native events; do not migrate legacy Boxever profiles or delete existing guest data. Agent/session and recovery records remain untouched.

### 7. Must the local Windows Docker workflow remain supported in this release?

**Question:** is remote-XMC frontend development sufficient initially, or must SEs also build/run the full local Windows-container CM stack after merge?

**Evidence:** [Docker guide](docker.md) requires Windows containers and Windows PowerShell 5.1; current [host config](../xmcloud.build.json), [pipeline](../docker/build-and-push-images.yml) and rendering image/startup scripts are on the old Node/JSS workflow. The SDK target requires Node 24+.

**Recommended default:** remote-first development/testing, while preserving legacy scripts/source. If local Windows Docker is promised as supported, add a Windows validation track before merge; do not label it supported based on Linux frontend tests or rewrite CM/connector code without need.

**Accepted answer: A — remote XM Cloud plus local Next.js development.** Use the existing dedicated nonproduction environment/test host. Full Windows CM/Docker compatibility is not required for release acceptance; preserve source and document the validation limitation. Cloud-native authoring/publication still requires real environment tests.

## C. Accepted first-release test scope

**Question 8 accepted: A — focused upgrade of the existing XMC demo.** The following evidence is required before completion/merge:

1. Home/navigation, session list/detail, speaker list/detail, hero/CTA and required SXA layouts render with current content.
2. Pages supports text/image edits, save, add/remove rendering, preview and publishing.
3. Existing integrated GraphQL/custom context/media/CMP field contracts continue where used by the XMC frontend; connectors are not upgraded.
4. Approved locales route/edit/render correctly.
5. Native analytics and embedded personalization work without duplicate events or edit/preview tracking.
6. Missing datasource, missing cookie, excluded integration and upstream failure cases do not crash the core demo.
7. Install, lint, type checks, build and relevant automated regressions pass; no ignored peer conflicts.
8. No excluded dependencies/privileged external-service routes remain in the active XMC app.
9. A nonproduction host test and rollback review are complete before merge/cutover.

**Accepted native-capability boundary:** validate native Forms/FEaaS/BYOC where already used and provisioned. Retain appropriate Design Studio support without making a new Design Studio demonstration or unprovisioned service/library setup a first-release requirement. Do not promise full composable-demo parity or expand into new showcase features.

## Dependencies between answers

- **Questions 1 and 2** determine how we can safely change the active app without deleting or silently breaking excluded features.
- **Question 3** confirms the unavoidable editing-workflow change.
- **Question 4** is mandatory before closing live-testing/merge gates, but does not prevent local SDK scaffolding/type work.
- **Questions 1–8 are answered and accepted.** No further scope choice is needed before local implementation. The chosen nonproduction environment's private settings, test-host setup and live verification still need to be completed before closing merge gates.

## Evidence/recovery note

Some older stored web response IDs from the research checkpoint are no longer retrievable through the content tool. Their identifiers and the original checkpoint remain preserved; no records were reset/deleted. The relevant official pages were refreshed for this review:

- `mv7wo205iq9ovz`: migration/editing, Context IDs, tracking/cookie documentation.
- `mv7wq40ryy2hzj`: Next.js Pages Router file-to-route behavior.

No application source or deployment was changed by this review. This document now records explicit user-approved decisions; execution and test completion are tracked separately.

[pages-docs]: https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
[migration-docs]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/upgrade-jss-22-0-next-js-apps-to-content-sdk-2-1.html
[context-docs]: https://doc.sitecore.com/sai/en/developers/sitecoreai/deploying-sitecoreai/deploy-app/manage-an-environment/context-id-environment-variables.html
[tracking-docs]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/initializing-tracking,-events,-and-personalization-in-the-content-sdk.html
