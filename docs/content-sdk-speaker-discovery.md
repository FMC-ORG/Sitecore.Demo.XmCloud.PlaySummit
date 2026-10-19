# Native speaker discovery — ticket 08

Speaker listing, featured speakers, speaker detail hero/biography and the session-detail speaker list now import Content SDK directly. The shared information-page hero, social-icon and info-text helpers were migrated with them because the speaker detail depends on them.

Rendering names, saved integrated queries, the speaker-detail partial design, the `jss-entity-sidebar` placeholder and Sitecore items are unchanged. Speaker detail continues to reuse the `SessionList` rendering restored in ticket 07 (`SpeakerSession`).

## Preserved behavior

- `FeaturedSpeakers` shows featured speakers, limited by the datasource `NumberOfSpeakers` field. That GraphQL value arrives as a string; numeric and string values are both accepted.
- `SpeakersGrid` continues to exclude featured speakers so they are not duplicated.
- The previous `.sort()` on speaker objects compared identical object strings and did not reorder results. It was removed; order is still the saved query's order.
- The saved query limits (`first: 50` featured, `first: 22` grid) are content contracts and were not changed.
- Empty job title/company/location labels still appear in edit mode so authors can fill them.
- Shared vendor/sponsor heroes receive only null-safety and import changes; their feature migration remains ticket 09.

## Fixed failures

- A deleted/unpublished speaker target or missing `featured` flag crashed the speakers page.
- Missing speaker pictures broke featured/grid/detail rendering and Open Graph metadata.
- A related speaker without `fields` crashed the session-detail speaker list. This was confirmed against the preserved pre-native component, which was then restored and hash-verified.
- Speaker detail without fields or related sessions renders safely and shows the existing "No sessions" fallback.

## Verification

- 4 speaker browser/HTTP cases: featured/grid to biography to related session, missing data, metadata editing (including an empty detail field), and session-detail speaker profiles.
- Complete suite: **48 cases repeated twice in development = 96 passes**, zero failures/flakes.
- All **48 cases pass against `next start`** and the optimized production build.
- TypeScript, application ESLint/Stylelint and baseline lint pass.

Fixtures prove rendering compatibility with representative field/query shapes. They do not prove live CMP speaker synchronization, picture transformations, or tenant content completeness. No Search SDK, legacy CDP or connector change was introduced.

Non-speaker helpers such as `Accordion` and `RequireDatasource` still use the temporary global JSX annotation bridge; they belong to later feature/contract tickets.

Local evidence is in Git-excluded run `ticket-08.GyAUBE`. No staging, commit, push, deployment or live-tenant validation occurred.
