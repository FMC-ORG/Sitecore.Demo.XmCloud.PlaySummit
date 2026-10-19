# Native sponsor and vendor journeys — ticket 09

Sponsor and vendor grids, selected sponsors, featured vendors, information heroes and history/information renderings now import Content SDK directly. Their types also use native field types.

Rendering names, datasources, rendering contents resolvers, the Premium Sponsors / Sponsor Content / Vendor Content partial designs, related-session queries (`SponsorSession`, `VendorSession` → `SessionList`) and Sitecore items are unchanged. No commerce, Search, CDP or connector integration was added.

## Contracts preserved

- `SponsorsGrid` / `VendorsGrid` keep their page-item datasource and children resolvers (`excluding Webpages` / `excluding Folder`), so Content SDK's datasource check still renders them.
- `SelectedSponsorsGrid` keeps its datasource multilist inside the Premium Sponsors section.
- `FeaturedVendors` keeps its Title/Subtitle/Vendors datasource. It is an available rendering but is not placed on any serialized page.
- Sponsor/vendor `Level` still provides the hero qualifier (for example "Meet the premium sponsor"). It remains plain text in the hero, as before.
- Detail sidebars reuse the restored session list; session speaker links lead to restored speaker details.

## Fixed failures

- Featured vendor logos passed the whole `Name` field object as `alt`, so images had no meaningful accessible name. They now use the name value.
- Deleted/unpublished selections, grid children without fields and missing logos crashed sponsor/vendor listings. This was confirmed against the preserved pre-native components, which were then restored and hash-verified.
- Sponsor/vendor detail pages without fields render safely (headings, empty history, "No sessions").
- In metadata editing, an empty featured-vendor selection still shows the existing "Missing Datasource Item" guidance; in delivery it stays hidden.

## Known existing limitation (unchanged)

The grids' "Filter by Schedule / Speakers / Category / Sport" buttons were already decorative: they have no menus or handlers, and the resolver data has no schedule/category/sport values to filter. They were kept unchanged to preserve the existing presentation. Making them work would need a separately approved query/content decision.

## Verification

- 5 sponsor/vendor browser/HTTP cases: sponsor → history → session speaker → speaker detail; vendor → history → session detail; named/loaded selected-sponsor and featured-vendor logos with navigation; missing selections/logos/details; metadata editing.
- Complete suite: **53 cases repeated twice in development = 106 passes**, zero failures/flakes.
- All **53 cases pass against `next start`** and the optimized production build.
- TypeScript, application ESLint/Stylelint and baseline lint pass.

Fixtures prove rendering compatibility with representative field/resolver shapes, not live connector synchronization or externally sourced logo delivery from a tenant.

Local evidence is in Git-excluded run `ticket-09.PhbJIg`. No staging, commit, push, deployment or live-tenant validation occurred.
