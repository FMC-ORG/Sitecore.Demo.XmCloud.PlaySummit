# Contract cleanup and complete local verification — ticket 15

All feature batches (tickets 05–14) were integrated before any temporary compatibility was removed.

## Removed (contract step)

- **`src/lib/jss-compat.ts`**: the JSS-shaped import/context adapter over Content SDK. No source or story imported `@sitecore-jss/sitecore-jss-nextjs` or used `useSitecoreContext` anymore.
- **`src/types/legacy-jsx.d.ts`**: the global `JSX.Element` annotation bridge. The remaining nine files now use React's own JSX type.
- The alias wiring in `tsconfig.json`, `next.config.js` (Webpack) and `.storybook/main.js`, and the obsolete `src/temp` exclusions in TypeScript/ESLint.
- **Obsolete JSS infrastructure still in the active tree:** `scjssconfig.json` (JSS CLI deploy settings), `sitecore/definitions/config.js` + `sitecore/.gitignore` (JSS manifest bootstrap) and `src/temp/.gitignore` (JSS generated-output folder). They were moved byte-identically, modulo checkout line endings, to `legacy/jss-infrastructure/` and recorded in its preservation manifest. Ignored generated JSS outputs in `src/temp` were copied to the local run record and removed.
- Two unused `eslint-disable` comments; application lint now reports zero problems.

The migration bridges were not original source; their last versions are kept in the local run record. No JSS/Cloud SDK package is installed.

## Added

- **`sitecore.cli.storybook.config.ts`** with a `storybook:prepare` script. Storybook preparation (component map, metadata, import map) now runs **offline**. The application build still uses `sitecore.cli.config.ts` and still requires a Context ID or local API host/key, as the SDK intends.
- The [development guide](content-sdk-development.md), pointers from the historical JSS docs, and a CI note on build-time API configuration.
- Platform checks for health, robots, sitemap, metadata/indexing, blocking fallback and five-second ISR.

## Verification

| Gate | Result |
| --- | --- |
| `npm ci` (lockfile, no force/legacy-peer flags, no `.npmrc` overrides) | pass; `npm ls --all` exit 0 (only optional/platform peers unmet) |
| npm 12 blocked install scripts | 9 non-essential scripts blocked; native sharp, esbuild, unrs-resolver and @parcel/watcher verified working |
| Archived integration packages in `node_modules` | none |
| TypeScript, application ESLint/Stylelint, baseline lint | pass (0 lint problems) |
| Prettier (code) | clean (17 CSS/HTML files byte-identical to the original checkout are not Prettier-managed) |
| Cold optimized production build (caches cleared) | pass, type checks enabled |
| Development suite (local-API mode) | 70 cases × 2 = **140 passes**, 38 production-only skips by design, 0 failures/flakes |
| Production suite (simulated Edge mode) | **89/89 pass**, zero blocked server-side requests |
| Storybook build (offline) + render smoke | 56 story files / **87 stories render** without page errors; no archived mocks |
| Server-only exclusion | no app component exports server props; no server GraphQL client, secrets or synthetic server IDs in client bundles |

The SDK's own BYOC/FEaaS wrappers ship their public component-fetch helpers to the browser. They are imported from the package exactly as in the template, and contain no secrets. The app's component-props loader matches both POSIX and Windows paths; the 2.4.1 template's regex matches Windows separators only.

## Platform contracts observed

- `/healthz` → 200 `Healthy`.
- `/robots.txt` → the static `public/robots.txt` (`Disallow: /`), as in the original JSS app: Next serves public files before the `/robots.txt` → `/api/robots` rewrite. With `meta robots=noindex`, the demo intentionally opts out of indexing. `/api/robots` still serves site-settings robots.
- `/sitemap.xml` → sitemap index; `/sitemap-1.xml` → the site sitemap proxied from Sitecore.
- Pages render title, `noindex` and Open Graph metadata.
- **Blocking fallback:** a never-rendered route returns full HTML on its first request (`x-nextjs-cache: MISS`, no fallback shell).
- **Five-second ISR:** cached responses carry `s-maxage=5`. Content changed upstream is served from cache inside the window and regenerated after it. The first response from a cache entry left by a previous server run is `STALE` without `Cache-Control` (Next behavior); later hits carry the header. Probes use unique per-run routes so they are independent of earlier runs.
- The ISR and fallback checks were proven fault-sensitive: `revalidate: 60` failed the window check (`s-maxage=60`), and `fallback: false` failed the first-request check (404). The page source was restored byte-for-byte.

## Not certified

Full Windows CM/Docker development, the legacy Azure DevOps image pipeline, live Pages save/publish, live analytics/personalization, tenant language/redirect content. These remain ticket 16 (blocked by ticket 03). No merge, deployment or host switch occurred.

Local evidence is in Git-excluded run `ticket-15.oXcMBI`.
