# Native session discovery — ticket 07

Session listing, card, list, detail and hero renderings now import Content SDK directly and use scoped React JSX annotations. Their rendering names, placeholder (`jss-entity-sidebar`), saved integrated GraphQL query and Sitecore items are unchanged.

## Retained filtering

The original `SessionsFilters` rendering showed only its title: its filter rows were hidden by CSS and contained a hardcoded `214 sessions` count, a decorative pager, and a non-functional availability checkbox.

The filters now work against the CMS results already returned by the saved `SessionsGrid` query:

- Name search, persisted in the shareable `q` URL parameter.
- Chronological (day, then start timeslot) or session-name ordering, persisted as `sort=name`.
- Live result count and a clear-search action.
- Shallow client URL replacement preserves the public CMS route.
- Controls are disabled and filtering ignored in metadata editing so authors see the full saved list.

These filters intentionally do **not** reintroduce Sitecore Search/Discover, capacity/availability data, or server pagination. The saved query has `first: 200`; search applies to those returned layout-bearing session results. Larger catalogues need a separately approved query/content decision.

The filter controls are now visible. This is an intentional, local styling change to make retained controls usable; it is not a CSS-framework upgrade.

## Integrated data compatibility

- Session cards use the saved query's speaker `role` when `jobTitle` is absent; both shapes are supported.
- Timeslots sort numerically. Lexical sorting previously showed incorrect ranges for mixed one/two-digit times.
- Timeslots accept both scalar strings and `{ value }` field shapes.
- Null multilist targets, missing images, empty timeslots and missing results are tolerated.
- Related speaker links no longer nest an anchor inside Next Link, eliminating hydration/DOM-validity errors.
- Session detail room/day/timeslot and image data render from the existing CMP-shaped multilist field structure.

`imageTransformation` remains in the type contract, but the active session components do not consume it. No DAM/CMP connector, transformation behavior, platform pipeline or synchronization was changed. Fixture tests prove only rendering compatibility with representative field/query shapes, not live CMP/DAM synchronization or tenant content completeness.

## Verification

- 8 session-specific browser/HTTP cases cover search/navigation, empty results/clear, ordering, role compatibility, timeslot order, related-link hydration, missing relations, CMP-shaped detail data and metadata field identities.
- Complete suite: **44 cases repeated twice in development = 88 passes**, zero failures/flakes.
- All **44 cases pass against `next start`** and the optimized production build.
- TypeScript, application ESLint/Stylelint and baseline lint pass.

The first production-suite command was interrupted by the tool's time limit after the build and partial test progress. Only verified migration-owned test processes were stopped; the interrupted log and cleanup receipt are retained. The rerun passed all 44 cases.

Local evidence is in Git-excluded run `ticket-07.yq4SHt`. No staging, commit, push, deployment, connector change or live-tenant validation occurred.
