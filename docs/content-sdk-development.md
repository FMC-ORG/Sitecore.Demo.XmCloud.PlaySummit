# Developing the Content SDK rendering host

This is the development guide for the migrated PLAY! Summit rendering host in `src/rendering`: **Content SDK 2.4.1, Next.js 16 Pages Router, React 19, Node 24**. The supported workflow is **remote-first**: a local Next.js process against a remote XM Cloud environment. Running a full local Windows CM/Docker stack is **not** certified by this migration (see [Docker](docker.md) for the legacy setup).

## Prerequisites

- Node.js **24.19.0** (the same version as `xmcloud.build.json`; `engines.node` is `>=24`).
- npm 12. `npm ci` installs from the lockfile without force or legacy-peer flags.
  - npm 12 blocks unapproved install scripts and warns about nine packages. None of them is required: Font Awesome attribution notices, a core-js message, esbuild and unrs-resolver binary checks, and a `@parcel/watcher` source-build fallback. The prebuilt native binaries (sharp, esbuild, unrs-resolver, @parcel/watcher) are installed and work.

## Configuration

Copy non-secret defaults from `.env` and put real values in a private `.env.local` (never committed):

| Variable | Purpose |
| --- | --- |
| `SITECORE_EDGE_CONTEXT_ID` | Server-side Edge Context ID (content, editing, personalization, redirects). |
| `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` | Browser Context ID for native events. Use only a scoped client/Live context. A client ID without a server ID is an unsupported SDK configuration. |
| `SITECORE_EDITING_SECRET` | Must match the editing host configured in XM Cloud for Pages metadata editing. |
| `NEXT_PUBLIC_DEFAULT_SITE_NAME` / `NEXT_PUBLIC_DEFAULT_LANGUAGE` | `playwebsite` / `en`. |
| `NEXT_PUBLIC_SITECORE_API_HOST` / `NEXT_PUBLIC_SITECORE_API_KEY` | Optional local-API mode (local CM or test fixture) instead of Edge. |
| `NEXT_PUBLIC_PERSONALIZE_SCOPE`, `PERSONALIZE_MIDDLEWARE_*_TIMEOUT` | Personalization scope and Edge/CDP timeouts (default 400 ms). |

**A build needs API configuration.** `npm run build` (and `dev`) runs `sitecore-tools project build`, which fetches site information. It fails without a Context ID or local API host/key. XM Cloud Deploy supplies the Context ID; other CI must provide one as a secret variable.

## Commands (from `src/rendering`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Generates the component map and Sitecore build data, then runs `next dev --webpack`. |
| `npm run build` / `npm run start` | Optimized production build (Webpack) and server. The XM Cloud editing host uses `build` and `next:start`. |
| `npm run storybook` / `npm run build-storybook` | Storybook. Preparation is **offline** (`sitecore.cli.storybook.config.ts`: component map, metadata, import map; no site data). |
| `npm run typecheck`, `npm run lint`, `npm run lint:baseline` | Independent quality gates. |
| `npm run test:baseline` | Browser/HTTP suite against a loopback fixture (see `tests/baseline/README.md`). `BASELINE_PRODUCTION=1` runs it against a production build in simulated Edge mode. |

Webpack is used explicitly (`--webpack`). This preserves server-only component-prop stripping (the component-props loader) and the FEaaS/BYOC server externals.

## Behavior to know

- **Pages Router** with on-demand rendering: no paths are prebuilt (`GENERATE_STATIC_PATHS=false`), fallback is blocking, and pages revalidate every 5 seconds.
- Locales: `en` (default, unprefixed), `fr-CA`, `ja-JP`. Japanese has no translations and falls back to English. Redirects and personalization run outside development only (SDK defaults).
- Native events and personalization need Edge (server and client Context IDs). They are disabled in development and in edit/preview modes.
- `public/robots.txt` disallows all crawlers and pages send `meta robots=noindex`: the demo intentionally opts out of indexing. The Content SDK `/api/robots` and `/sitemap*.xml` routes are wired and serve site-settings data.
- Commerce, Search/Discover, Auth0, legacy CDP/Send and OrderCloud are archived in `legacy/play-integrations`; integration-only renderings show an editor notice and are hidden from visitors.

## Pages editing

Configure the XM Cloud editing host to point at the rendering host and use `SITECORE_EDITING_SECRET`. Pages uses metadata editing (`/api/editing/render`, GET only, secret-protected; `/api/editing/config` advertises the SDK). Experience Editor is not supported.

## Not certified here

Full Windows CM/Docker development, the legacy Azure DevOps image pipeline, live Pages save/publish, live analytics/personalization, tenant language fallback setup and authored redirects. These need an authorized nonproduction environment (tickets 03/16).
