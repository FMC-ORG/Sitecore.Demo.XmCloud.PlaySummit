# Upgrade the PLAY! Summit XMC demo to Content SDK

## Problem Statement

Sales engineers need a reliable, maintainable PLAY! Summit demo that demonstrates XM Cloud using the supported Content SDK rather than the older JSS frontend. The current application mixes CMS rendering and authoring code with commerce, authentication, separate Search, legacy CDP and other integrations. That coupling makes a focused SDK upgrade difficult and introduces dependency conflicts unrelated to the XMC demonstration.

The current frontend uses JSS 22.2.1, Next.js 14.2.35, React 18.2.0 and TypeScript 4.9.4. It has extensive customized CMS components, integrated GraphQL, field serialization, layout-context extensions, presentation variants and styling that must not be lost by replacing it with an unmodified starter.

The user wants minimum disruption: retain Pages Router and the existing content/presentation contracts, preserve excluded integration source, work in a separate migration checkout, and merge only when the migration is complete, tested and reviewed. This is an SE demo upgrade, not a new production starter or a production commerce implementation.

## Solution

Migrate the existing XMC rendering application to the supported Content SDK architecture in the separate migration checkout. Retain Pages Router, preserve the core CMS experience, and isolate out-of-scope frontend integrations in a clearly documented archive that is not part of the active build.

Use Content SDK-native configuration, data fetching, component registration, metadata editing, analytics and embedded personalization. Preserve compatible component UI, content fields, rendering names, placeholders, item IDs, integrated GraphQL and the current ISR contract. Where CMS components relied on an archived integration, retain their CMS UI with safe fallbacks and applicable native XMC events. Integration-only widgets display an explanatory editor notice and are hidden from normal delivery.

Validate the focused upgrade against the existing dedicated nonproduction XM Cloud environment and a test editing host. Keep the original checkout and current deployed demo intact during migration. Require repeatable local checks, core rendering regressions, actual Pages/publishing validation and review before merge or host cutover.

## User Stories

1. As a sales engineer, I want the demo to use the supported Content SDK, so that I can demonstrate current XMC capabilities confidently.
2. As a demo maintainer, I want the upgrade limited to XMC rendering and authoring, so that unrelated product integrations do not expand the migration.
3. As a migration engineer, I want to retain Pages Router, so that the SDK upgrade does not require an unrelated App Router redesign.
4. As a migration engineer, I want a separate migration checkout and branch, so that the original working demo remains available for comparison.
5. As a reviewer, I want the migrated application to retain its existing frontend role and location, so that the final repository does not acquire a permanent second runnable frontend.
6. As a demo maintainer, I want excluded integration source preserved with its Git history, so that future integration work can recover it without reconstructing it.
7. As a migration engineer, I want archived integrations excluded from routing, type checking and component registration, so that their old dependencies do not enter the active Content SDK application.
8. As a reviewer, I want an inventory of retained, adapted and archived frontend functionality, so that intentional scope differences are visible rather than mistaken for regressions.
9. As a content author, I want existing Sitecore item IDs and content templates preserved, so that I do not have to recreate the demo content.
10. As a content author, I want existing rendering names preserved, so that saved layouts continue to resolve the intended components.
11. As a content author, I want existing placeholders preserved, so that page composition remains compatible with the serialized presentation.
12. As a content author, I want nested placeholders and partial designs to continue working, so that reusable page structures remain editable.
13. As a content author, I want existing rendering variants preserved, so that the demo retains its intended visual alternatives.
14. As a demo visitor, I want the home page and its main content sections to render consistently, so that the demonstration retains its recognizable appearance.
15. As a demo visitor, I want navigation and footer links to work, so that I can explore the available XMC experience without dead integration journeys.
16. As a sales engineer, I want hero, CTA, banner, rich-text and layout components retained, so that established presentation stories still work.
17. As a demo visitor, I want session listings and details to display related content correctly, so that the event-discovery journey remains coherent.
18. As a demo visitor, I want speaker listings and details to remain usable, so that the presenter-discovery journey still supports demonstrations.
19. As a demo visitor, I want the retained sponsor, vendor and news content to render, so that the CMS-driven experience remains complete within the agreed scope.
20. As a content author, I want integrated GraphQL to retain its component data contract, so that related content continues to appear without rewriting queries unnecessarily.
21. As a demo maintainer, I want custom event information and language context preserved where used, so that browser titles and locale controls do not lose their current data sources.
22. As a demo visitor, I want existing media and image transformations to display correctly, so that externally sourced content remains visually usable without a connector upgrade.
23. As a content author, I want CMP-derived relationships to retain their rendering shape, so that the frontend can consume existing synchronized content.
24. As a content author, I want to edit text fields through Pages/Page Builder, so that the migrated demo supports the current authoring workflow.
25. As a content author, I want to edit image fields through Pages/Page Builder, so that media editing is demonstrated without legacy editable-HTML assumptions.
26. As a content author, I want to save changes and preview them, so that I can verify content before publishing.
27. As a content author, I want to add and remove renderings, so that page composition remains demonstrable after migration.
28. As a content author, I want preview and editing to use unpublished content appropriately, so that authoring does not accidentally rely on Live-only delivery data.
29. As a content author, I want to publish content and see it on the test delivery host, so that the full authoring-to-delivery journey is verified.
30. As a content administrator, I want normal Content Editor administration retained, so that the loss of its legacy preview integration does not imply loss of content administration.
31. As a sales engineer, I want the editing support boundary documented, so that I do not promise Experience Editor or Content Editor Preview on the migrated frontend.
32. As a demo visitor, I want English routing retained, so that the primary demonstration remains accessible.
33. As a demo visitor, I want French Canadian routing and available content retained, so that the existing multilingual demonstration remains possible.
34. As a demo visitor, I want Japanese routing and fallback retained, so that a configured locale is not silently removed during migration.
35. As a sales engineer, I want Japanese translation claims limited to available content, so that the demo does not imply translation coverage it does not have.
36. As a demo maintainer, I want publishing language configuration preserved unless a change is explicitly required, so that frontend migration does not silently broaden publication scope.
37. As a sales engineer, I want native XMC analytics to record the required normal visitor events, so that the analytics demonstration remains meaningful.
38. As a content author, I want editing and preview activity kept out of normal visitor analytics, so that authoring does not pollute the demonstration data.
39. As a sales engineer, I want native embedded personalization and existing definitions retained, so that current XMC personalization journeys can be validated.
40. As a tester, I want personalization variants rendered independently, so that one visitor's variant does not contaminate another visitor's response.
41. As a sales engineer, I want fresh sandbox visitor identities supported, so that migration testing does not depend on historical profile continuity.
42. As a demo maintainer, I want existing guest records left intact, so that fresh test identities do not become permission to delete data.
43. As a demo visitor, I want blocked or unavailable cookies handled safely, so that privacy settings do not crash the core demonstration.
44. As a demo visitor, I want a safe static welcome message when legacy Boxever behavior is excluded, so that the welcome section remains usable.
45. As a demo visitor, I want retained questionnaire UI to function with applicable native XMC events, so that its CMS interaction survives without legacy CDP calls.
46. As a content author, I want integration-only widgets to explain their unavailable status in the editor, so that archived functionality is distinguishable from a broken component.
47. As a demo visitor, I want integration-only widgets hidden from normal delivery, so that the focused XMC experience does not display misleading or broken integrations.
48. As a demo maintainer, I want unconfigured external integrations to be unnecessary for startup and builds, so that an XMC-only setup is independently usable.
49. As a sales engineer, I want existing used and provisioned native Forms, FEaaS and BYOC rendering support retained, so that established native component demonstrations can continue.
50. As a demo maintainer, I want appropriate Design Studio support retained without mandatory new showcase work, so that the SDK upgrade stays focused.
51. As a migration engineer, I want compatible existing Tailwind and PostCSS styling preserved, so that the upgrade does not introduce an unrelated design-system migration.
52. As a demo visitor, I want unknown routes and missing content to fail gracefully, so that normal navigation mistakes do not crash the demonstration.
53. As a content author, I want missing or deleted datasources to produce an appropriate editor state, so that I can diagnose content configuration problems.
54. As a demo maintainer, I want the current blocking fallback and five-second ISR baseline retained, so that the SDK upgrade does not silently introduce a new caching architecture.
55. As a developer, I want local Next.js development against remote XM Cloud, so that I can work without building a full local Windows CM stack.
56. As a demo maintainer, I want supported SDK and framework versions locked reproducibly, so that other SEs can install the same working application.
57. As a developer, I want lint, type checks, builds and relevant regressions to run independently, so that a green build does not conceal missing quality checks.
58. As a tester, I want to exercise the application through its browser and HTTP behavior, so that tests remain useful when internal SDK wiring changes.
59. As a reviewer, I want live Pages and publishing evidence from an authorized nonproduction environment, so that acceptance is not based on local compilation alone.
60. As an environment owner, I want private credentials and appropriately scoped Context IDs, so that the test application does not expose unrestricted preview access.
61. As an environment owner, I want the test editing host isolated from the active demo host, so that migration validation does not disrupt other demonstrations.
62. As a demo maintainer, I want health, metadata, robots and sitemap behavior reviewed, so that the migrated host retains its intended operational and indexing contracts.
63. As a reviewer, I want required checks and manual evidence complete before merge, so that unfinished migration work does not become the default application.
64. As a demo maintainer, I want host cutover and rollback reviewed separately from local code changes, so that deployment changes remain deliberate and recoverable.
65. As a migration engineer, I want original source, checkpoints and recovery records preserved, so that migration progress does not destroy the reference or transport history.

## Implementation Decisions

1. The product is a modular SE demo. Migration scope is XMC rendering, authoring and required native XMC capability wiring—not full composable-product parity or production commerce.
2. Retain Pages Router. Do not introduce App Router, React Server Component architecture, Cache Components, a new revalidation architecture or an unrelated CSS major-version migration.
3. Perform migration in the approved separate Git worktree and migration branch, modifying the existing frontend there. Keep the original checkout as the reference. No permanent additional runnable frontend is part of the final architecture.
4. Use the verified Content SDK 2.4.0 Next.js baseline, with independently versioned Content SDK dependencies and CLI. Use supported patched framework versions compatible with Node 24+, Next.js ^16.2.0, React/React DOM ^19.2.1 and the compatible TypeScript toolchain. Do not blanket-version every SDK package as 2.4.0.
5. Replace JSS runtime/build infrastructure with typed Content SDK configuration, its unified Sitecore client, provider/page model, component registration and SDK CLI generation. Preserve project-specific behavior instead of copying a clean starter wholesale.
6. Keep the npm Content SDK CLI distinct from the .NET Sitecore CLI used for content serialization. The frontend upgrade does not replace the existing SCS ownership or deployment model.
7. Preserve serialized content, item IDs, template contracts, rendering names, root/nested placeholders, partial-design signatures and required component variants. Avoid content/schema/presentation changes unless specifically needed and reviewed.
8. Preserve integrated rendering GraphQL and its data shape. Remove obsolete operation-generation tooling only after proving it is not required by retained application behavior. Do not confuse tooling removal with removal of integrated GraphQL support.
9. Consume normal, preview and design-library data through the Content SDK client. Use the normalized Page model and its mode flags for application behavior while preserving retained custom data within the layout context.
10. Preserve custom event and language context where the XMC frontend relies on it. Treat the existing CM image/CMP/GraphQL serializers as a compatibility validation track, not authorization to upgrade connectors or rewrite the platform.
11. Use Content SDK-compatible field helpers and field metadata for editing. Eliminate reliance on legacy editable HTML or chromes-based rendering in the active frontend.
12. Support Pages/Page Builder metadata editing and preview. Experience Editor and Content Editor Preview are not supported by the migrated frontend. Normal Content Editor administration remains outside that removed preview integration.
13. Preserve the current CMS page route conventions, empty prebuilt path list, blocking fallback and five-second ISR setting unless implementation reveals a required, reviewed compatibility correction. This is not a guarantee that all visitors see a publish within five wall-clock seconds.
14. Preserve the existing English, French Canadian and Japanese frontend locales. Validate actual English/French Canadian content/editing and Japanese routing/fallback. Do not silently expand publication language configuration or promise unavailable Japanese translations.
15. Preserve compatible styling and public/media asset behavior. The application URL, media origin and editing host are separate configuration concerns.
16. Archive excluded frontend integration source outside active route discovery, component-map generation, type checking and dependency installation. Preserve its source/history and document what was archived and how to recover it; do not create a second runnable legacy frontend as an implicit requirement.
17. Do not upgrade OrderCloud, shop/account/Discover, Auth0, separate Sitecore Search, legacy Boxever/CDP APIs, Send, CareConnect/channel demos, Content Hub connectors or Content Hub ONE provisioning as part of this migration.
18. For mixed CMS/integration components, preserve content fields, rendering identity, styling and usable UI, remove archived integration calls, retain applicable native XMC events and implement safe static fallbacks. The welcome-message example retains a static fallback rather than silently recreating a legacy flow.
19. Integration-only widgets produce a clear editor notice and are hidden from normal delivery. Navigation must not send visitors into removed integration-only routes. Do not rewrite Sitecore layouts or delete their items to implement this frontend boundary.
20. Compose routing, preview, site/locale resolution, redirects and native personalization through the supported Next.js proxy architecture. Preserve existing necessary route exclusions and response cookies/headers without bringing archived authentication or service-admin endpoints into the active app.
21. Replace old Cloud SDK initialization and event imports with the target Content SDK analytics/events architecture and appropriate adapters. Preserve required native page, audience and personalization events while preventing duplicate events or tracking in editing/preview mode.
22. Fresh sandbox native analytics identities are accepted. Historical visitor/experiment-assignment continuity and legacy profile migration are not required. Preserve personalization definitions and existing guest records; no deletion or agent/session reset is authorized by this decision.
23. Keep native Forms/FEaaS/BYOC rendering support where already used and provisioned. Retain appropriate Design Studio support without requiring new showcase features, new service provisioning or a library/asset redesign.
24. Support local Next.js development against an existing dedicated nonproduction XM Cloud environment. Full local Windows CM/Docker compatibility is not a first-release acceptance requirement; preserve its source and accurately document the unvalidated workflow.
25. Use a test editing host without switching the active demo host. Actual environment identity, access and test ownership remain prerequisites for live validation; choosing the strategy did not configure them.
26. Keep server-only editing credentials private. Use Live versus Preview access appropriately and scoped public Context IDs for browser operations. Do not place credentials in documentation, test artifacts or archived source as part of this work.
27. Select and validate a supported bundler strategy explicitly, preserving required FEaaS externalization and server-code exclusion behavior. Do not discard required customization or ignore peer conflicts merely to obtain a successful install/build.
28. Retain necessary custom build preparation such as category data generation and independent lint/type checks. Update only the frontend-related runtime, scripts and CI settings required by the migrated application.
29. Implement incrementally: establish the XMC boundary and baseline, migrate the SDK foundation, migrate CMS vertical slices, validate native capabilities, then prove deployment/test behavior. Keep changes reviewable and distinguish pre-existing defects from regressions.
30. Do not merge or switch deployed hosts until the agreed acceptance evidence passes and the changes are reviewed. Prepare rollback to the prior application/deployment and preserve original checkpoints, source and recovery/transport records.

## Testing Decisions

1. **Proposed highest-level seam, pending the user's narrow confirmation:** test the running rendering host through its browser/HTTP boundary. Treat it as the single application seam for delivery, editing entry points, normal/preview modes and observable native event behavior.
2. A good test verifies an external contract: visible content, interaction, navigation, HTTP outcome, authoring behavior or emitted event. It must not assert private SDK methods, plugin order internals, generated file text, arbitrary component state or incidental CSS implementation details.
3. Use browser/HTTP automation—Playwright is the proposed runner—to exercise the built application. Assertions should use user-facing roles, labels and content where possible rather than brittle DOM structure.
4. Supply deterministic content and controlled upstream responses through existing configuration/network boundaries. Avoid adding per-component injection APIs or mocking private SDK factories solely for tests. Capture native event requests at the external network boundary without introducing another application test seam.
5. The repo has no existing automated assertion suite. Existing CMS Storybook stories, page examples and mock content are prior art for fixtures and visual expectations, not proof of behavior. Reuse retained CMS examples where practical; archived commerce/Search mocks are not required to compile in the active XMC test setup.
6. Cover home/navigation, session list/detail, speaker list/detail, hero/CTA, required SXA layouts, nested placeholders and preserved variants with representative current-content fixtures.
7. Cover the retained integrated GraphQL result shape, custom event/language context, CMP relation consumption and media transformations through rendered output. Do not test the internals of unchanged connector processors as a substitute for proving their output is usable.
8. Exercise normal delivery, metadata editing/preview and required provisioned native component modes. Assert missing-content/datasource behavior is safe and appropriate to the mode.
9. Validate routing and dictionary/fallback behavior for the approved locales, including Japanese fallback without inventing translated-content coverage. Cover unknown routes and the intended 404 behavior.
10. Validate safe static welcome behavior, retained questionnaire UI/native events and unavailable-integration behavior. Integration-only editor notices must be observable, delivery widgets must be hidden, and users must not be led into dead integration routes.
11. Assert required native analytics/events occur once during normal visitor journeys and are not emitted as normal traffic during editing/preview. Cover blocked/missing cookies and initialization failures. Do not require legacy profile continuity or delete existing guest data for test setup.
12. Validate native embedded personalization and independent variant responses using fresh sandbox visitors. Test the actual response behavior instead of merely checking that a personalization package is installed.
13. Cover retained ISR/fallback behavior at the application boundary. Distinguish the configured revalidation policy from upstream publication latency; do not use brittle wall-clock guarantees to declare publication correctness.
14. Add failure-path coverage for missing datasources, excluded integrations, unavailable media/content services and upstream errors that could otherwise crash the core demo.
15. Keep install/dependency-boundary validation, lint, type checks, production build and archive-preservation checks as separate quality gates. They are not substitutes for behavioral tests and do not require additional private-code test seams.
16. Perform actual Pages text/image edits, saves, rendering add/remove, preview and publish-to-Live checks in the authorized dedicated nonproduction environment/test host. Automate where practical and retain explicit manual evidence where authenticated authoring automation is unavailable. Local fixtures cannot close this gate.
17. Validate existing used/provisioned native Forms/FEaaS/BYOC behavior. Retain appropriate Design Studio compatibility without making an unprovisioned capability or a new demonstration an acceptance dependency.
18. Review operational endpoints, metadata/indexing behavior, editing-secret protection and scoped browser/server configuration. Do not put private credentials in logs or artifacts while producing evidence.
19. Compare the migrated demo with the original reference for retained behavior and appearance, accounting for explicitly approved static fallbacks and hidden external widgets. Do not classify those approved differences as regressions or claim full composable parity.
20. Completion requires a reproducible active dependency tree without ignored peer conflicts, passing local gates, live authoring/publication/native-capability evidence, review and rollback readiness. Record any blocked gate honestly; a green build alone does not satisfy the spec.

## Out of Scope

- App Router migration, React Server Component redesign, Cache Components or a new on-demand revalidation architecture.
- A permanent second runnable frontend or a new production starter kit.
- Upgrading or rebuilding commerce, shop/account, Discover, OrderCloud, Auth0 or their authentication/payment journeys.
- Upgrading or replacing the separate Sitecore Search product/domain or recreating its profile/recommendation/crawler capabilities.
- Porting legacy Boxever/CDP admin APIs, Send tracking, CareConnect or channel demonstrations into the active XMC application.
- Upgrading Content Hub DAM/CMP connectors, Content Hub ONE provisioning or the CM platform merely because their content is consumed by the frontend.
- Removing or rewriting author-owned Sitecore items, templates or saved layouts simply to hide excluded frontend integrations.
- Recreating legacy personalization flows using native XMC without a separately approved feature request.
- Experience Editor/chromes-based frontend integration or Content Editor Preview support.
- Historical visitor/profile migration, uninterrupted legacy identity continuity, deleting guest data or resetting personalization definitions.
- Full Windows CM/Docker support certification as a first-release requirement.
- New Design Studio, Forms, Components or other product showcase features and new service/library provisioning.
- A production payment provider, tax/shipping compliance implementation, enterprise hardening program or a new consent-management platform. Basic credential protection, safe native event behavior and no-cookie resilience remain necessary.
- Forced dependency installation as a compatibility solution.
- Automatic merge, deployment cutover, production data changes, reset/reinitialization of recovery records or starting another worker.

## Further Notes

- The eight accepted answers are the source of truth for scope and behavior. This spec synthesizes them rather than introducing another interview or new architecture choices.
- Work continues on `migration/content-sdk-pages-router` in the separate migration checkout. Its baseline is `1ea92e5`. The original checkout and deployed demo are reference/rollback targets.
- Application migration has not yet been implemented. Local discovery/worktree preparation and the decision review are complete; no application tests or live tenant validation have passed so far.
- The selected nonproduction environment, its private settings, test-host setup and live-testing owner still need configuration. This can block live acceptance without blocking local implementation work.
- Native Sitecore field/schema/context compatibility remains an empirical validation requirement. If preserving a contract requires platform or connector changes beyond the approved frontend scope, document the issue and obtain a separate scope decision rather than silently widening the migration.
- The proposed test seam is the rendering host's browser/HTTP boundary. The only requested confirmation is whether that seam matches expectations; it is not a reopening of the accepted scope questions.
- No domain glossary or applicable ADR was found in either checkout. Terminology follows the existing project documentation: XMC, rendering host, editing host, Experience Edge, Pages/Page Builder, Sitecore content/rendering/placeholder, native analytics and embedded personalization.
- **Publication is blocked:** the configured project issue tracker and triage-label vocabulary were not provided/found. The README names Sitecore's upstream GitHub issues, which is not sufficient to infer the user's intended publication target. Run `/setup-matt-pocock-skills`. Once configured and the seam is confirmed, publish this spec to that tracker with **`ready-for-agent`** and no additional triage. No issue or label has been created/applied yet.

Primary implementation references:

- [Sitecore migration overview](https://doc.sitecore.com/sai/en/developers/content-sdk/20/upgrade-jss-next-js-apps-to-content-sdk.html)
- [JSS 22.0 to Content SDK 2.1 migration guide](https://doc.sitecore.com/sai/en/developers/content-sdk/20/upgrade-jss-22-0-next-js-apps-to-content-sdk-2-1.html), used with the actual published 2.4 baseline rather than copied blindly.
- [Content SDK 2.4 release guidance](https://doc.sitecore.com/sai/en/developers/content-sdk/20/what-s-new-in-content-sdk-2-4.html)
- [Content SDK integrated GraphQL](https://doc.sitecore.com/sai/en/developers/content-sdk/20/integrated-graphql-in-content-sdk-apps.html)
- [Context ID and public scoping](https://doc.sitecore.com/sai/en/developers/sitecoreai/deploying-sitecoreai/deploy-app/manage-an-environment/context-id-environment-variables.html)
- [Native tracking/events/personalization migration](https://doc.sitecore.com/sai/en/developers/content-sdk/20/initializing-tracking,-events,-and-personalization-in-the-content-sdk.html)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
