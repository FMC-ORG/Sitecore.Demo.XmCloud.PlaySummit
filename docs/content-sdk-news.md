# Native news journey — ticket 10

`NewsList`, `NewsGrid`, `NewsDetail` and the `News` type now import Content SDK directly. Rendering names, rendering contents resolvers, the news page presentation, the News and Media / News Content partial designs and Sitecore items are unchanged. No Search product, session/speaker/sponsor dependency or connector change was added.

## Contracts preserved

- `NewsList` (news page, no datasource) keeps its context-item children resolver and the resolver's item order.
- `NewsGrid` (News and Media partial design) keeps its datasource children resolver and shows the **four newest** stories by `PublishDate`.
- `NewsDetail` keeps its context-item resolver. Dates still use the existing `newsDateFormatter` (for example "Wed, August 4, 2021"); excerpts and body rich text are unchanged.
- The static social "tweet" panel content is unchanged.
- Empty news lists stay hidden in delivery and still show the existing "Missing Datasource Item" guidance in metadata editing.

## Fixed failures

- News list images passed the whole `Title` field object as `alt`, so they had no meaningful accessible name. They now use the title value.
- A story without `PublishDate`, or a deleted child, crashed the news grid. Undated stories now sort last and deleted entries are skipped. This was confirmed against the preserved pre-native components, which were then restored and hash-verified.
- The grid sorted the shared layout array in place. It now sorts a filtered copy.
- The tweet profile picture never rendered: a static image import was passed to Sitecore's field-based `Image`, which returns nothing without a field. It now renders from public assets like the adjacent conference image. This also removes the long-standing CLI codegen warning about resolving `profile-pic.jpg`.
- News details without an image or Open Graph image source render safely. Unknown article routes return the public 404 page.

## Verification

- 4 news browser/HTTP cases: list → full article (title/date/excerpt/body/loaded image); newest-four grid order, loaded tweet images and navigation; empty/undated/missing-image/unknown-route behavior; metadata editing for Title, Content and PublishDate plus empty-list guidance.
- Complete suite: **57 cases repeated twice in development = 114 passes**, zero failures/flakes.
- All **57 cases pass against `next start`** and the optimized production build.
- TypeScript, application ESLint/Stylelint and baseline lint pass; the codegen unresolved-import warning no longer appears.

Fixtures prove rendering compatibility with representative resolver/field shapes, not live tenant content. Date fixtures use midday UTC values; the existing formatter uses the runtime's local date, so stories published near midnight can show a different day depending on server/browser time zone. That behavior is unchanged.

Local evidence is in Git-excluded run `ticket-10.NhwEvd`. No staging, commit, push, deployment or live-tenant validation occurred.
