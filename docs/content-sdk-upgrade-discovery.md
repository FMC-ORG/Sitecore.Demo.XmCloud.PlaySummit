# PLAY! Summit: JSS → Content SDK upgrade discovery

**Research baseline:** `main` at `1ea92e5`; verified on **2026-10-08**. This document resumes the [saved research checkpoint](content-sdk-migration-checkpoint.md), which remains unchanged. It supplements the [project discovery](discovery.md).

**Status:** migration discovery completed. User approved a **modular SE demo with an XMC-only upgrade scope**, retaining **Pages Router for minimum disruption**. User approved a **separate migration checkout**, modifying `src/rendering` on a migration branch and merging only after completion and testing. The worktree is created; application migration is not yet complete. No application, Sitecore item, runtime, credential, or deployment configuration has been changed so far. Existing recovery/transport records and downloaded artifacts were preserved; no additional worker was started.

## Confirmed purpose

**User clarification:** this is a reusable demo baseline for sales engineers (SEs), not a production implementation starter.

Migration acceptance should prioritize reliable demo journeys, repeatable provisioning/reset, easy SE onboarding, visual editing, and the integrations required for demonstrations. Simulated checkout can remain simulated; production payment processing is not a migration requirement. Credentials, shared tenants, and guest data still need appropriate protection.

## Confirmed migration scope — XMC only

**User decision:** option C, a modular demo, with this upgrade focused only on XM Cloud (XMC) code moving to Content SDK.

**In scope:** the CMS rendering head; Content SDK configuration/client/providers/component maps; CMS-driven React/SXA renderings and field helpers; Pages metadata editing/preview; Experience Edge connectivity; existing integrated GraphQL and placeholder contracts; locale/site/redirect handling; XMC-native analytics and embedded personalization wiring; existing native Forms/FEaaS/BYOC rendering support where needed; build/runtime and editing-host configuration required for this head.

**Out of scope:** upgrading OrderCloud/shop/account/Discover, Auth0, the separate Sitecore Search SDK/domain, legacy Boxever/CDP APIs, Send, CareConnect/channel demos, Content Hub connectors or Content Hub ONE provisioning, and a production-hardening/payment-processing initiative. Native rendering wrappers are not permission to redesign Components libraries or external service assets.

**Preservation rule:** leave the existing JSS application and external integration code/assets intact. Reuse compatible CMS templates, item IDs, integrated queries, images and data contracts; do not change CMP/DAM processors merely because their output is consumed by the new frontend.

**Isolation requirement:** the migrated XMC frontend in the separate checkout must have an XMC-only dependency manifest and must not import the existing global Search/commerce/Auth0/legacy-CDP providers or excluded API routes. An env toggle alone does not isolate incompatible dependencies. For CMS components that mix content rendering with excluded integration calls, migrate the rendering behavior and native XMC wiring separately; explicitly inventory external-integration renderings not included in the target rather than claiming full composable-demo parity.

## Confirmed router — Pages Router, minimum disruption

**User decision:** keep Pages Router. Do not combine the Content SDK upgrade with an App Router migration.

Preserve the existing CMS catch-all route, Next.js page data-fetching conventions, `next/router` consumers, supported locale routing, placeholder/rendering names and content IDs. Retain the current empty prebuilt path list, blocking fallback and 5-second ISR baseline unless validation identifies a required change. Keep compatible Tailwind 3/PostCSS styling; do not add Tailwind 4, RSC, Cache Components or on-demand revalidation as unrelated modernization.

The Content SDK migration still requires its supported Node/Next.js/React/TypeScript versions, metadata-based Pages editing, the new client/provider/config/component-map APIs, and Next.js 16 proxy handling. Keeping the router is not a promise that all dependencies can stay unchanged.

## Confirmed execution — separate Git worktree

**User decision:** migrate in a separate checkout and merge only when the migration is complete and tested. Keep the existing `src/rendering` path in the migration branch; do not add a permanent sibling frontend directory to the repository.

- Original checkout: `/home/fedmuj/projects/Sitecore.Demo.XmCloud.PlaySummit` on `main`.
- Migration checkout: `/home/fedmuj/projects/Sitecore.Demo.XmCloud.PlaySummit-content-sdk`.
- Migration branch: `migration/content-sdk-pages-router`, created from `1ea92e5`.
- Discovery notes were copied because they are still uncommitted in the original checkout. The originals and recovery checkpoint remain unchanged.
- No deployed editing/delivery host is changed by creating the worktree. Merge/cutover waits for tests and review.

Scope, purpose, router and checkout strategy are accepted. The [eight-question decision record](content-sdk-open-decisions.md) is complete: archive excluded frontend integrations, preserve CMS UI with safe fallbacks, use Pages-only editing, an existing dedicated nonproduction test environment, all three configured locales, fresh sandbox visitors, remote-first development, and focused existing-XMC acceptance tests. Private environment setup and test execution remain pending. The broader integration/App Router/sibling-folder analysis below is retained as research/reference, not an expansion of this approved scope.

## 1. Executive recommendation

**This is an application migration, not a package rename.** The current frontend is JSS 22.2.1, Next.js 14.2.35, React 18.2.0 and TypeScript 4.9.4. The latest stable Next.js Content SDK package is **2.4.0**, with Node **24+**, Next.js **^16.2.0**, React/React DOM **^19.2.1**, and optional TypeScript peer **^5.4.0**. [Current package/lock](../src/rendering/package.json), [target registry][npm-next]

Recommended approach for this repository:

1. Keep the original `main` checkout and existing deployed JSS head as reference/rollback targets.
2. Use the approved **separate Git worktree** to migrate the existing `src/rendering` path. Use a clean, version-pinned Content SDK template outside the repository as reference, not as a permanent sibling app.
3. Preserve Sitecore item IDs, component names, placeholder names, content templates, integrated GraphQL queries and author-owned content.
4. Migrate one vertical feature slice at a time and validate both delivery and Pages editing.
5. Retain **Pages Router**, as approved. Preserve existing route/localization/ISR contracts; do not include an App Router or unrelated CSS migration.
6. Keep the new head **XMC-only**: do not install/import Discover, commerce, Auth0, separate Search or legacy-CDP integration code. Their compatibility issues are outside this migration, not blockers for an isolated XMC head.
7. Switch the editing and delivery hosts only after explicit acceptance gates pass.

A clean head with incremental migration is consistent with Sitecore's guidance for older or heavily customized JSS applications. There is no requirement in the current JSS 22.0 → Content SDK 2.1 guide to deploy every intervening JSS/Content SDK release first. Use the guide as a conceptual mapping, then the **2.4.0 published template and types** as the actual target. [Migration overview][migration-overview], [JSS migration guide][migration-jss]

**Important distinction:** upgrading this existing demo is reasonable; the repository's warning against using PLAY! Summit as a new production starter still applies. Migration alone does not fix its demo security/payment behavior. [Root notice](../README.md), [security discovery](discovery.md)

## 2. Verified target versions—not every package is 2.4

Since Content SDK 2.2, packages are independently versioned. A blanket `@sitecore-content-sdk/*@2.4.0` installation is incorrect. [2.4 upgrade notes][changes-24]

| Package | Published stable latest | How to use it |
| --- | --- | --- |
| `@sitecore-content-sdk/nextjs` | **2.4.0** | Main framework package |
| `@sitecore-content-sdk/react` | **2.4.0** | Transitive through Next.js; direct only if directly imported |
| `@sitecore-content-sdk/cli` | **2.3.0** | Development/build CLI, executable `sitecore-tools` |
| `create-content-sdk-app` | **2.4.0** | Scaffold tool; not necessarily a production dependency |
| `@sitecore-content-sdk/content` | **2.3.0** | Content/client APIs; transitive unless directly imported |
| `@sitecore-content-sdk/core` | **2.1.4** | Shared core; transitive unless directly imported |
| `@sitecore-content-sdk/events` | **2.1.2** | Replaces Cloud SDK event imports |
| `@sitecore-content-sdk/analytics-core` | **2.1.2** | Analytics plugin/adapters |
| `@sitecore-content-sdk/personalize` | **2.1.0** | Personalization; declared Next.js peer |

[Next.js registry][npm-next], [CLI registry][npm-cli], [initializer registry][npm-create], [2.4 notes][changes-24]. The remaining versions were checked against each package's npm `latest` metadata and the Next.js package's dependencies/peers.

Framework/tooling baseline:

- **Node 24+** is the Content SDK package requirement, even though Next.js 16 itself has a lower minimum. Align local Node, XM Cloud editing host, delivery hosting, Docker rendering and CI.
- **Next.js 16.x meeting `^16.2.0`** and **React/React DOM meeting `^19.2.1`** are required. Select currently patched exact versions during implementation and lock them; a lower-bound version number is not a security recommendation.
- The published initializer template uses **TypeScript ~5.8.3**, Node types **^24.10.4**, React types **^19.2.7**, and React DOM types **^19.2.3**.
- The template uses **ESLint 9**, flat config, Prettier 3 and `npm-run-all2`. Preserve this repo's Stylelint/PostCSS checks deliberately.
- Tailwind 4 is present in the App Router template, but **not a Content SDK requirement**. Keeping Tailwind 3 initially avoids an unrelated CSS migration.

[Published initializer tarball][tar-create], member paths `package/dist/templates/nextjs/package.json` and `package/dist/templates/nextjs-app-router/package.json`; [Next.js 16 guide][next-16]

## 3. What must change and what should stay

### Measured frontend coupling

| Pattern | Files with references | Implication |
| --- | ---: | --- |
| `@sitecore-jss/` | 131 | Imports, types, helpers, scripts and Storybook—not just renderings |
| `temp/config` | 24 | Replace generated runtime config with typed `sitecore.config.ts` |
| `temp/componentBuilder` | 7 | Replace builder/moduleFactory with component map |
| Old page modes | 24 | Move application behavior to `page.mode` |
| Context hooks/HOCs | 20 | `useSitecoreContext`/context props need model changes |
| `next/router` imports | 23 | Can remain with Pages Router; must be reviewed for App Router |
| `JSX.*` references | 221 | React 19 scoped JSX typing migration |

These are overlapping static file counts, not independent work items or a time estimate. [Frontend source](../src/rendering), [React 19 typing changes][react-19]

### Preserve by default

- `src/items` IDs and serialized templates/renderings/content, plus the existing SCS module ownership.
- `headless-header`, `headless-main`, `headless-footer`, nested placeholders and dynamic partial-design signatures.
- Existing rendering names and named export variants: `Promo.Default/WithText/WithColumns`, `Image.Default/Banner`, `Navigation.Default/LandingPagesNavigation`.
- Integrated rendering GraphQL and their `props.fields.data` result shape until a deliberate data-contract change.
- Business types and UI behavior, including unsupported/missing datasource states.
- .NET CM project and connectors **pending compatibility validation**, not blind deletion/replacement.
- Separate Components and Personalize serialization workflows until explicitly redesigned.

The npm Content SDK CLI **does not replace the .NET Sitecore CLI used for SCS**. Root `sitecore.json`, module files and `serpull.ps1`/`serpush.ps1` remain a separate concern. [SCS config](../sitecore.json), [module files](../src), [asset workflows](website.md)

## 4. Router choice: decouple it from the SDK migration

| Option | Advantages | Additional risk/work |
| --- | --- | --- |
| **Pages Router first—recommended default** | Existing `pages`, APIs, `getLayout`, localization and ISR can be ported without an RSC redesign | Still requires new SDK client/provider/config/proxy, React 19, editing and dependencies |
| **App Router now** | Server-component architecture, modern route handlers, dual component maps and optional tagged caching | Rewrite route ownership, 23 router consumers, provider boundaries, API raw-body handling, localization and preview |
| **Modern event head + separate legacy shop** | Resolves the immediate React 18 Discover dependency by keeping it outside the React 19 process | Separate deployment, routing, cookie/session boundaries, navigation and eventual shop retirement plan |

Content SDK 2.4 ships `nextjs`, `nextjs-app-router`, and `nextjs-app-router-cache-components` templates. Pages Router uses one component map by default; App Router uses full/server and client-safe maps. [Template tarball][tar-create], [component maps][component-maps]

For App Router:

- CMS routing follows `[site]/[locale]/[[...path]]` internally; host/locale proxies drive rewrites.
- Use `AppPlaceholder` with explicit `page`, `rendering` and appropriate component map.
- Hook/browser/Redux/SDK widget components need appropriate client boundaries; importing a server module into a client map is not fixed by adding `'use client'` everywhere.
- The reference uses `next-intl`; the existing `next-localization` setup should not be copied blindly.
- Request APIs and route params need Next.js 16 asynchronous patterns.
- Existing API handlers use `NextApiRequest/Response`; if moved, preserve signed webhook **raw bytes**, method validation and response contracts.
- Search crawlers parse `__NEXT_DATA__`. App Router does not preserve the same Pages Router payload contract; these crawlers need a new extraction source/schema.

[App Router template][tar-create], [Next.js upgrade][next-16], [crawler code](../src/rendering/search-crawlers)

## 5. Core SDK architecture migration

### File-by-file mapping

| Existing path under `src/rendering` | Target treatment |
| --- | --- |
| `package.json` / `package-lock.json` | Pin target framework/SDK packages; resolve peers; retain only used integration dependencies |
| `scripts/config/*`, `scripts/generate-config.ts`, `src/lib/config.ts` | `sitecore.config.ts` with `defineConfig` |
| `scripts/generate-component-builder/*`, generated `componentBuilder` | `sitecore.cli.config.ts` and `.sitecore/component-map.ts` |
| `scripts/generate-metadata.ts`, `scripts/generate-plugins.ts` | CLI build commands/artifacts; no legacy plugin generation |
| `src/lib/page-props-factory/*` | `SitecoreClient` calls; explicitly port custom behavior |
| `src/lib/layout-service-factory.ts`, dictionary/GraphQL/editing factories | Unified client and configuration; subclass/customize only where behavior requires it |
| `src/pages/[[...path]].tsx` | SDK `SitecorePageProps` with `page`; fetch preview/design-library/normal data through client |
| `src/Layout.tsx` | `page.layout`, `page.mode`, preserved placeholders, metadata and `SitecoreStyles` |
| `src/pages/_app.tsx` | Preserve custom `getLayout`, Search/commerce providers and tracking deliberately; do not replace wholesale |
| `src/Bootstrap.tsx`, `src/Scripts.tsx` | SDK plugin/adapters, metadata editing and BYOC support |
| `src/middleware.ts`, `src/lib/middleware/*` | `src/proxy.ts` and `defineProxy` composition |
| `src/pages/api/editing/*` | Current metadata editing routes; remove legacy stash endpoint only after confirming no caller |
| `src/pages/api/robots.ts`, sitemap, healthz | Target SDK middleware helpers, existing route contracts |
| `src/lib/next-config/*`, `next.config.js` | Consolidate custom rewrites/images/CORS/FEaaS/build configuration |
| `scripts/generate-categories-data.ts` | **Retain/move as explicit custom build step**; it is not obsolete JSS boilerplate |
| `.storybook/*`, `src/stories/*` | Compatible Storybook, SDK provider/page fixtures, same CSS/mock feature coverage |
| `xmcloud.build.json`, Docker rendering startup and CI | Node 24, target path, environment names and updated build/dev/start scripts |

[Migration guide][migration-jss], [published templates][tar-create], [existing source](../src/rendering), [host config](../xmcloud.build.json)

### The new Page contract

Conceptually:

```ts
// Content SDK Page—not a flattened replacement for every old context field:
page.layout          // retains layout.sitecore.route/context
page.locale
page.siteName
page.mode.isNormal
page.mode.isEditing
page.mode.isPreview
page.mode.isDesignLibrary
```

```tsx
const { page } = useSitecore();
const editing = page.mode.isEditing;
const route = page.layout.sitecore.route;
```

Custom CM context properties **can still live in `page.layout.sitecore.context`**. `EventInfo` and `Languages` are not automatically promoted to properties such as `page.EventInfo`. Add typed access/guards or deliberately replace their data source. [Published content tarball][tar-content], member `package/types/client/sitecore-client.d.ts`; [CM extension](../src/platform/Pipelines/DemoContextExtension.cs), [HeaderContent](../src/rendering/src/components/Navigation/HeaderContent.tsx), [Layout](../src/rendering/src/Layout.tsx)

For a Pages Router slice, the target route sequence is:

1. Extract normalized path.
2. Fetch `getDesignLibraryData` for design-library preview, `getPreview` for editing preview, or `getPage(path, { locale })` for normal delivery.
3. Return `page`, dictionary and `getComponentData(page.layout, context, components)` where required.
4. Render `SitecoreProvider` through a `Providers` component and `Layout page={page}`.
5. Preserve the current missing-page and ISR contract explicitly.

**Do not rename page-level Next.js `getStaticProps` to `getComponentServerProps`.** That rename in the SDK migration guide applies to **component-level server-data exports**, not Next.js page entry points. No such component exports were found in this repo's rendering components. [Reference catch-all][tar-create], [existing component-data plugin](../src/rendering/src/lib/page-props-factory/plugins/component-props.ts)

### Component map and variants

Automatic mapping is suitable initially because there are no duplicate component file basenames. However:

- Map the actual CMS names, not folder names or display names.
- Exclude helper-only UI and infrastructure where appropriate, instead of exposing every file as an editor rendering.
- Preserve variants; exported variant objects and file-based `Base.variant.tsx` patterns are supported.
- The existing CMS rendering `ProductDetail` has no same-name module; `ProductDetails` is not automatically the same rendering.
- Keep `PartialDesignDynamicPlaceholder` mapped using its existing Sitecore name/signature.
- Confirm built-in BYOC/FEaaS/Form components are present in generated maps.
- App Router additionally requires client-safe mapping and intentional server/client classification.

[Map registration][component-register], [dual maps/variants][component-maps], [ProductDetail rendering](../src/items/sxa-renderings/Project/PLAY/Products/ProductDetail.yml), [existing partial placeholder](../src/rendering/src/components/nextjs-sxa/PartialDesignDynamicPlaceholder.tsx)

## 6. Editing, GraphQL and CM contracts

### Pages-only visual editing is a breaking business change

Content SDK removes Experience Editor and Content Editor Preview. Do not promise to preserve them. The target uses metadata editing in Pages/Page Builder. [Official removal notice][migration-jss]

Specific repo consequences:

- Current preview code supports both metadata and chromes modes; replace it with the target metadata workflow.
- `Image.Banner` manipulates `Image.editable` HTML and checks `EditMode`; remove the chromes branch and use metadata-safe field rendering.
- `field.editable` is not in the target field contract; `field.metadata` is.
- Preserve JSS-style field-helper semantics through their Content SDK equivalents (`Text`, `RichText`, `Image`, `Link`, etc.). Do not convert them all to raw values and lose editor metadata.
- Verify empty fields, missing datasources, image captions/links and in-editor behavior—not just normal screenshots.
- Latest `withDatasourceCheck` also understands `rendering.isContentResolved=false` as missing data.
- Update rendering host configuration/secret and editing config endpoint; test internal editing-host preview authorization.

[Image implementation](../src/rendering/src/components/nextjs-sxa/Image.tsx), [target field types][tar-content], [2.4 datasource behavior][release-next]

### Integrated GraphQL is supported—keep it

This repo has **11 non-empty integrated `ComponentQuery` fields**, with `fields.data` consumers. Content SDK explicitly supports integrated GraphQL, including automatic `$datasource`, `$contextItem`, `$language` variables. Removing GraphQL-let tooling does **not** mean removing the queries or rewriting every component to fetch client-side. [Integrated GraphQL docs][integrated-graphql], [rendering exports](../src/items/sxa-renderings)

No `.graphql` operation files or `graphql-tag` imports were found in application code. The GraphQL package is used by the old introspection script. The old `.graphql-let.yml`, loaders, generated-type alias and large introspection export are good cleanup candidates **after dependency/consumer checks**, not before preserving the integrated query contract.

### CM customizations are a separate validation track

The Node frontend upgrade does not automatically require a .NET rewrite. Nevertheless, these customizations are unusually important:

- `DemoContextExtension` uses a JSS processor to add `EventInfo` and `Languages`.
- `DemoImageFieldSerializer` customizes image output/editable rendering and Content Hub transformations.
- `DemoFieldTypeFactoryStore` copies a default GraphQL field-type implementation and adds `CmpMultiList`; its own comment requires comparisons during platform/headless/Edge upgrades.
- `ParseXml`, CMP imports and automatic publishing must keep working.
- NuGet versions and local CM images are older/partly floating; actual tenant assembly compatibility is unverified.

Capture and compare **live Edge versus preview editing** responses for normal fields, DAM images, CMP relations and custom context. Do not assume all custom CM context data behaves identically at publish time. Preserve IDs/schema unless a change is justified and tested. [Platform custom code](../src/platform), [NuGet baseline](../Packages.props)

### Forms and Components

Do not conflate custom HTML forms, Send forms and XM Cloud Forms:

- The source imports the older `@sitecore/components/form` BYOC registration.
- The migration guide moves legacy BYOC-hosted XM Forms to the dedicated Form rendering/`FormId`.
- The static serialization scan found no layout `formId` reference; this does **not** prove the deployed tenant has none.
- Custom attendee/ticket/sponsor forms are not automatically rewritten into Sitecore Forms.
- Components collections currently reference four missing version exports and an empty datasource export; restore/parity must be verified.
- CountdownTimer self-registers but has no explicit BYOC entry import found; registration should be proved in the target rather than assumed.

[Forms migration][migration-jss], [BYOC source](../src/rendering/src/byoc), [Components exports](../src/components), [timer](../src/rendering/src/components/BYOCC/CountdownTimer.tsx)

## 7. Dependency compatibility blockers

These are declared peer constraints, **not proof of runtime failure or certification of newer versions**.

| Dependency | Current baseline | Verified candidate/status | Decision |
| --- | --- | --- | --- |
| Sitecore Discover React/UI | `1.1.1` | Latest **1.2.4 still supports React only through 18** | **Blocker for one supported React 19 head** |
| Sitecore Search React/UI | React `2.2.2` | **3.0.0** declares React 19 peers | Upgrade with widget/profile/schema regression tests |
| React Redux | `8.0.4` | **9.3.0** supports React 19; requires Redux 5 | Align Redux Toolkit/store/types, not an isolated version bump |
| Redux Toolkit | `1.9.5` | **2.13.0** candidate | Review RTK 2 migration and reducer/thunk behavior |
| Auth0 Next.js SDK | `1.7.0` | **4.31.1** declares Next 16/React 19 peers | API/auth-flow migration, not import-only |
| Storybook Next.js | `7.6.15` | **10.6.1** declares Next 16/React 19 peers | Upgrade framework/addons/decorators together |
| TanStack React Query | `4.32.0` | Current peers end at React 18; no direct source imports found | Remove if unused, otherwise migrate to a tested v5 |
| Discover UI, portal SDK, Engage | Declared dependencies | No direct source imports found for these packages | Audit indirect/build usage before removal |
| `next-localization` | `0.12.0` | Broad React peer; retained in official Pages template | Keep initially for Pages; test actual behavior |
| Font Awesome React | `0.2.0` | Existing peer broadly allows React 19 | No need to jump automatically to latest major, which also changes core requirements |
| Bundle analyzer | Next major 12 tooling | Use a tested Next 16-compatible version | Verify plugin/webpack behavior |

[Discover metadata][npm-discover], [Search metadata][npm-search], [Redux metadata][npm-redux], [Auth0 metadata][npm-auth0], [Storybook metadata][npm-storybook], [current lock](../src/rendering/package-lock.json)

### Discover decision—must be explicit

Choose one:

1. **Replace the React integration with a supported API/adapter/UI implementation**, preserving required search/recommendation/cart-event behavior.
2. **Keep the shop in a separate React 18 application temporarily**, with documented routing/session/cookie boundaries and migration ownership.
3. **Exclude/retire shop features for the first delivery milestone**, with user approval; this is scope reduction, not complete feature parity.
4. Obtain vendor-confirmed React 19 compatibility or a supported release before porting the dependency.

`npm --force` / `--legacy-peer-deps` is not evidence of support. Disabling the shop through env variables also does not remove incompatible dependency declarations or imports from the build. The current shop gate requires both OrderCloud **and Discover**, and Discover is coupled to Redux authentication, product/cart events, widgets and mocks. [Commerce gate](../src/rendering/src/helpers/CommerceHelper.ts), [OcProvider](../src/rendering/src/redux/ocProvider.tsx), [Discover consumers](../src/rendering/src/components)

### Search is not automatically replaced by Content SDK Search

`@sitecore-content-sdk/search` queries **SitecoreAI indexes** using Context ID/index ID. Existing `@sitecore-search/react` widgets target a separately configured Sitecore Search customer/domain and use its profile/suggestion contracts. They are **not drop-in replacements**. Keep the existing Search product and upgrade its SDK unless changing search architecture is explicitly in scope. [SDK Search API][sdk-search], [current Search service](../src/rendering/src/services/SearchSDKService.ts)

## 8. Auth0, proxy composition and API protection

If Auth0 moves to v4, review its versioned migration notes as a separate track:

- `AUTH0_BASE_URL` → `APP_BASE_URL`; issuer/domain handling changes.
- The auth routes are handled through the SDK's middleware/proxy integration; defaults move from `/api/auth/*` to `/auth/*`.
- `UserProvider`, `handleAuth`, `handleLogin`, `getSession` and auth wrappers have changed across majors.
- The current OrderCloud seeding code constructs OIDC endpoints and reuses Auth0 base URL; changing only environment names breaks this assumption.
- Callback/logout URLs in Auth0 and OrderCloud must agree with the target deployment.
- Preserve OpenID Connect create/sync webhook signatures and auth failure behavior.

The retrieved Auth0 v4 migration guide describes **3.x → 4.x**, while this repo is on **1.7.0**. It is not a complete direct v1 migration recipe. Pin the selected Auth0 version and use its actual exports/types/tests; some current docs show helpers that differ from earlier v4 migration notes. [Auth0 guide][auth0-migration], [current authentication service](../src/rendering/src/services/AuthenticationService.ts), [seeding](../src/rendering/src/pages/api/ordercloud/init.ts)

Only one Next.js `proxy.ts` entry should compose the Sitecore and authentication behavior:

- Preserve existing exclusions for `/search`, `/shop`, `/account`, `/channels`, `/careconnect`.
- Handle auth routes before Sitecore rewriting.
- Preserve authentication cookies/headers when passing the response into the Sitecore proxy chain; do not discard an Auth0 redirect or response.
- Retain preview/bot/site/redirect/personalization ordering based on the current template. App Router additionally needs locale resolution before site/redirect/personalization.
- Use target `skip(req,res)` predicates rather than copying old `excludeRoute` options unchanged.
- Apply route/API resource authorization explicitly. Authentication middleware is not a replacement for checking guest/order ownership.

[Target proxy/template][tar-create], [old exclusions](../src/rendering/src/lib/middleware/plugins/multisite.ts), [discovered API issues](discovery.md)

Do not port unguarded CDP admin proxies, query-string middleware secrets, dangerous utility routes or automatic payment acceptance into a publicly exposed modern head without a safety decision.

## 9. Configuration, analytics and cookies

### Environment migration contract

| Current frontend setting | Target | Notes |
| --- | --- | --- |
| `SITECORE_SITE_NAME` | `NEXT_PUBLIC_DEFAULT_SITE_NAME` | Set `playwebsite` explicitly |
| `DEFAULT_LANGUAGE` | `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Align all supported locales |
| `JSS_EDITING_SECRET` | `SITECORE_EDITING_SECRET` | Server-side editing secret; **never public** |
| `SITECORE_EDGE_CONTEXT_ID` | Same | Server-side context |
| None | `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` | Browser context, scoped appropriately |
| `SITECORE_API_KEY` / `SITECORE_API_HOST` | `NEXT_PUBLIC_SITECORE_API_KEY` / `NEXT_PUBLIC_SITECORE_API_HOST` | Local CM fallback; review access scopes/exposure |
| `DISABLE_SSG_FETCH` | `GENERATE_STATIC_PATHS` | **Invert semantics**, not just rename |
| `SITECORE_EDGE_URL` if used | `NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME` | Old Edge URL variable obsolete; target has hostname normalization |
| Personalize timeout names | `PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT` / `PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT` | Confirmed in published target defaults despite proxy rename |
| `NEXT_PUBLIC_PERSONALIZE_SCOPE` | Same | Must match tenant/environment scope |
| `PUBLIC_URL` / asset-prefix assumptions | Deliberate target asset handling | Do not confuse app URL, DAM media host and OIDC base URL |

Update **both** direct frontend env files and root-to-Docker mappings, plus XM Cloud Deploy and delivery-host variables. Public variables are compiled into browser assets and require a rebuild when changed. [Target configuration][sdk-config], [published config][tar-next], [Docker mapping](../docker-compose.override.yml)

Server delivery should use Live access; authoring/preview uses Preview access. Current Sitecore guidance treats environment Context IDs as secrets and recommends scoped public contexts for browser calls. Do not blindly copy the unrestricted server Preview context into a public bundle. [Context guidance][context-docs]

### Events and identity migration

Replace old initialization:

```ts
CloudSDK(...).addEvents().initialize();
```

with the target `initContentSdk` configuration/plugins/adapters:

- `analyticsPlugin` + browser or server/proxy adapter;
- `eventsPlugin`;
- personalization plugin/adapters only where needed;
- top-level `contextId`, `edgeUrl`, `siteName`.

Move `@sitecore-cloudsdk/events/browser` imports to the target event APIs; avoid relying on `@sitecore-cloudsdk/core/internal` types such as the current `EPResponse` import. [Analytics migration][tracking-docs], [CloudSDKService](../src/rendering/src/services/CloudSDKService.ts)

Event parity needs an inventory, not “the new SDK tracks everything”:

- Page views, identity, audience choice, ticket selection/purchase, attendee completion and Search profile events.
- Existing legacy Boxever guest extension writes and dynamic personalization calls are separate from Context-aware SDK events.
- Sitecore Send is a separate tracker/form integration.
- Search's `__rutma` identity is not the same cookie as SDK analytics identity.
- SDK cookies change from `sc_{contextId}` to `sc_cid`, and personalize cookies to `sc_cid_personalize`; review continuity and scoped domains across sites.
- Existing demo keypress handlers forget/close **legacy Boxever** sessions, not necessarily the modern analytics identity.
- Add consent-aware initialization, blocked-cookie handling and no duplicate normal/edit/preview events.

[Tracking/cookie docs][tracking-docs], [IdentificationService](../src/rendering/src/services/IdentificationService.ts), [legacy keypress handler](../src/rendering/src/services/KeypressHandlerService.tsx)

## 10. Build, caching and deployment

### New build lifecycle

The target CLI replaces the old generated config/plugin/builder lifecycle:

```text
sitecore-tools project component generate-map
sitecore-tools project build
next build
```

Metadata/sites/import maps move under the frontend's `.sitecore` directory. That is different from the repository root `.sitecore` SCS schemas. Keep custom category generation and Storybook build preparation explicitly. [CLI template][tar-create], [existing bootstrap](../src/rendering/scripts/bootstrap.ts)

Next.js 16 uses **Turbopack by default**. This repo and the published Pages template contain custom Webpack configuration, including field/component-props loaders and FEaaS externalization. Choose either:

- Explicit `next dev --webpack` / `next build --webpack` as a tested initial compatibility route; or
- A deliberate Turbopack port that preserves all required behavior.

Do not delete externalization/loader code just to silence build errors, or assume Turbopack runs Webpack plugins. Remove unused GraphQL/YAML loaders only after checking consumers. Existing component-props regexes use Windows path separators; validate Linux/Windows bundling and server-code exclusion. Next.js 16 does not run lint during `next build`; CI needs a separate lint step. [Next.js guide][next-16], [current next-config plugins](../src/rendering/src/lib/next-config), [template][tar-create]

### Cache policy is a separate decision

Current CMS behavior is empty prebuilt paths, blocking fallback and 5-second ISR. For **Pages Router**, retain that baseline initially, with `GENERATE_STATIC_PATHS=false` for equivalent non-prebuilt behavior; Sitecore recommends false for internal editing hosts. [Existing catch-all](../src/rendering/src/pages/[[...path]].tsx), [config guidance][sdk-config]

For **App Router**, choose explicitly:

- Standard template: custom/dynamic/time-based caching strategy.
- Cache Components template: cached helpers/tagging plus optional on-demand revalidation.

SDK on-demand revalidation requires tagged cached reads, a webhook/endpoint and matching `sc:*` tags. Preview/editing remain dynamic. Configure a nonempty revalidation secret; do not leave a production endpoint unprotected merely because the starter allows optional configuration. Verify freshness, variants, deletion and dependent datasource/query updates. `revalidateTag(..., 'max')` can use stale-while-revalidate semantics; do not promise immediate fresh content without testing the selected cache profile. [OSR documentation][sdk-osr], [Next.js cache semantics][next-16]

### Deployment touchpoints

- `xmcloud.build.json`: target head path, Node 24, build/run command and matching editing host definition.
- Delivery project: matching SDK build, Live context, scoped browser context, Node version and URLs.
- Docker: rendering image/runtime/start command and root env mapping; local Windows CM compatibility remains a separate track.
- CI: Node pin, dependency lock, build scripts, updated Storybook, independent lint/type/tests and audit.
- Components/Personalize service assets: controlled separate restore with completeness checks.
- Rollback: retain previous frontend artifact/host mapping/env set. Coordinate item changes that the old head must still understand.

[Build configuration](../xmcloud.build.json), [pipeline](../docker/build-and-push-images.yml), [Docker rendering](../docker/build/rendering/Dockerfile), [hosting distinction][hosts-docs]

## 11. Documentation pitfalls resolved against the target

1. **The migration guide targets 2.1, not latest 2.4.** Its dependency minimums/examples are not the target manifest.
2. **Independent versions:** CLI/core/content/events are not all 2.4.0.
3. **`loadImportMap`:** the 2.1 guide calls it required; the published React **2.4.0** declaration is optional and uses an empty fallback when omitted. Include it when preserving Design Studio/variant generation; do not report its absence as an unconditional type error.
4. **Old page-mode enum still exists in layout types**, but application-level behavior should use the normalized `Page.mode`; import replacement alone is insufficient.
5. **Proxy versus middleware:** the migration page has contradictory wording in one note. The published 2.4 template uses `src/proxy.ts`/`defineProxy`; API middleware helpers remain separate.
6. **Timeout example drift:** template example configuration uses proxy-named timeout variables and repeats an Edge variable for CDP. Published defaults use `PERSONALIZE_MIDDLEWARE_*`; use confirmed target behavior, not the typo.
7. **GraphQL cleanup is tooling cleanup**, not loss of integrated GraphQL support.
8. **Auth0 documentation is version-sensitive:** v3→v4 notes are not a v1→latest recipe.
9. **Source availability:** attempts to fetch the npm `gitHead` commit via raw GitHub returned 404. The npm tarballs were successfully downloaded and inspected, so package-contract findings cite those published artifacts instead.

[Migration guide][migration-jss], [published Next.js types][tar-next], [React types][tar-react], [content types][tar-content], [initializer][tar-create]

## 12. Phased execution and acceptance gates

### Phase 0 — approve scope and capture baseline

- Scope is confirmed as XMC-only and Pages Router is selected. Confirm Pages-only editing acceptance; identify which existing CMS renderings mix in excluded integration code.
- Get authorized nonproduction tenant/editor/delivery access; secrets go in private settings, not chat/Git.
- Confirm deployed CM/SDK versions and whether custom context/DAM/CMP behavior appears in Preview and Live.
- Capture route/component inventory, content/field fixtures, screenshots, network event baselines and known broken behavior.
- Establish reproducible JSS baseline if possible and distinguish existing defects from regressions.

**Gate:** approved parity checklist, compatible dependency strategy, test environment and rollback owner.

### Phase 1 — Content SDK foundation in the migration checkout

- Use the pinned Pages Router initializer as an external reference; replace JSS infrastructure in the migration checkout's existing `src/rendering`, preserving the SSG/ISR baseline.
- Set current site/locale/Context IDs privately; use the target config/CLI/client/provider/proxy.
- Preserve placeholders and only necessary existing build/CSS conventions.
- Test missing-page, editing config/render endpoint, normal delivery and one simple editable rendering.

A proposed command, **not executed**:

```sh
npx create-content-sdk-app@2.4.0 nextjs \
  --destination /tmp/playsummit-content-sdk-reference \
  --noInstall
# Use an unused reference path. Select SSG and inspect before installing.
# Application migration remains inside src/rendering of the separate checkout.
```

The tool itself may need to be fetched/executed by npx; `--noInstall` skips generated app dependency installation/linting. Pin subsequent app dependencies and create a lock before deployment. For App Router, select `nextjs-app-router` or the cache-components template deliberately. [Initializer CLI source][tar-create]

**Gate:** target install has no silently ignored peer conflicts; lint/type/build pass; first page and Pages editing work.

### Phase 2 — CMS vertical slices

1. Header/footer, dictionary, navigation, site title/custom context.
2. Hero/CTA/SXA containers, splitters, images, rich text and partial designs.
3. Session listing/detail with integrated GraphQL, CMP relations and DAM images.
4. Speakers/sponsors/vendors/news.
5. Locales, redirects, missing datasources and query-driven variants.

**Gate:** preserved CMS IDs/names; edited fields save and render; live/preview parity; no legacy `editable` rendering assumptions; CSS/assets correct; required variants map correctly.

### Phase 3 — native XMC capabilities and dependency isolation

- Migrate Context-aware XMC analytics and embedded personalization; do not port separate legacy CDP/Send paths.
- Validate native Forms/FEaaS/BYOC rendering and required editor behavior without redesigning external libraries/connectors.
- Remove excluded global providers/imports from the new head, not from the existing JSS application.
- Inventory CMS rendering names whose external-integration behavior is intentionally not migrated; make the core demo's navigation and presentation scope explicit.
- Confirm no OrderCloud/Discover/Auth0/separate Search/legacy-CDP dependencies or privileged external-service APIs enter the target head.

**Gate:** normal/preview/edit behavior, native personalization variants and analytics, missing-cookie/duplicate-event tests, supported native rendering wrappers, and an independently installable XMC-only dependency tree.

### Phase 4 — deployment/cutover

- Run all quality gates in CI and rebuild Storybook.
- Deploy new nonproduction delivery + editing hosts; test authoring and publish-to-Live flow.
- Exercise realistic cache updates, redirects/locales, media, forms and integration outages.
- Rehearse rollback, verify monitoring, then switch production only with approval.

**Gate:** agreed feature parity and failure behavior, protected endpoints, proven rollback and environment-owner acceptance—not merely a green build.

### Minimum regression matrix

| Area | Required evidence |
| --- | --- |
| Delivery | Home, listings/details, 404, empty fields, deleted datasource, assets, navigation |
| Authoring | Pages field edit/save, add/remove component, variant edit, preview language, no analytics leakage |
| Data | Integrated queries, CMP multilist shape, DAM transformations, custom context Live/Preview |
| Locale/site | `en`/`fr-CA`/approved others, host resolution, redirects, locale-switching query strings |
| Analytics | Consent/no consent, no cookies, single page events, identity, ticket/audience/Search events |
| Search | Suggestions, facets/sort, profile/recommendations, crawler index parity |
| Commerce | Anonymous/authenticated cart, OIDC callback/logout, orders/account, authorized payments/webhooks |
| Operations | Metadata/robots/sitemap, health, build determinism, cache freshness, outage fallback, rollback |

## 13. Grill: decisions you must answer

1. **Are we upgrading a demo, or shipping real customer data/orders?** Demo shortcuts cannot silently become production requirements.
2. **Must Experience Editor or Content Editor Preview survive?** If yes, that conflicts with Content SDK's supported editing workflow. Who approves Pages-only authoring?
3. **Pages Router first, or App Router now—and why?** “Latest Content SDK” alone is not a reason to combine migrations. Default recommendation: Pages first.
4. **What is the Discover plan?** Replace integration, isolate legacy shop, defer shop, or wait for supported React 19? This is the biggest declared dependency conflict.
5. **Does milestone one require the entire shop/account/Auth0 flow?** If yes, budget a separate Redux/Auth0/OrderCloud compatibility track, not just CMS components.
6. **Which integrations must preserve behavior?** Mark each keep/defer/remove: Search, legacy CDP, embedded Personalize/analytics, DAM, CMP, Components, Forms, Send, Discover, OrderCloud, Auth0, CareConnect, channels, Content Hub ONE.
7. **Must existing identities/experiments continue uninterrupted?** Define cookie/domain/event/guest expectations before modernizing SDK initialization.
8. **Which languages are contractual?** Current routing, publication and Search settings disagree; is Japanese required or merely configured?
9. **Which CM extensions are essential?** Prove `EventInfo`/`Languages`, DAM images and CMP fields in tenant payloads before deleting old factories/processors.
10. **Can we deploy a sibling head and test tenant before changing the existing host?** If not, what is the safe rollback method?
11. **What does done mean?** Name the pages, editor operations, integrations and negative tests whose failure blocks cutover.
12. **Who owns security and consent changes?** The new SDK cannot be used as an excuse to preserve unguarded privileged endpoints.
13. **Do you want ISR parity, or a new caching/freshness contract?** App Router OSR requires explicit tagged caching/webhook configuration and tests.
14. **Is Design Studio part of acceptance, or is existing Storybook enough for the first milestone?** They are complementary, not an automatic replacement for one another.

**Answered:** purpose is an SE demo; modular scope is XMC-only; Pages Router is retained for minimum disruption. Questions about upgrading external commerce/Search/Auth0/connectors and App Router are deferred and are not prerequisites for this migration. The separate worktree/branch strategy is approved; merge and host cutover wait for completed migration, testing and review. No additional architecture decision is assumed.

## 14. Evidence, artifacts and limitations

### Completed

- Read official migration overview, JSS→2.1 guide, Content SDK 2.1–2.4 updates, editing/config/GraphQL/map/analytics/search/OSR docs, Next.js 16 and React 19 guides.
- Verified current `latest` package metadata against npm's registry.
- Inspected the **published** 2.4.0 initializer templates and Next.js/React/content package declarations/implementations without executing package code.
- Traced affected repository paths, provider boundaries, fields, modes, variants, GraphQL loaders, cookies, auth/commerce/crawler and deployment assumptions.

### Preserved artifacts

Original checkpoint: `docs/content-sdk-migration-checkpoint.md` (unchanged).

Original downloaded initializer: `/tmp/playsummit-content-sdk-3lsv0leo/package/` (unchanged).

Additional inspected package artifacts: `/tmp/playsummit-content-sdk-3lsv0leo/migration-source-check/`.

Registry snapshot: `/tmp/playsummit-content-sdk-3lsv0leo/migration-source-check/registry-latest-2026-10-08.json`.

Additional stored response IDs: `muzpnizb9df0o5`, `muzpnizyw9bjgj`, `muzpnx6p26lggi`, `muzppnere140tp`, `muzpqnb2p94f4d`, `muzpr9cabje2pi`. Original response IDs remain listed in the checkpoint. Temporary artifacts are not guaranteed durable outside the session.

### Not verified

No app scaffold was executed, dependencies installed, builds/tests run, Sitecore tenant accessed, credential submitted, deployment changed, API exploit attempted or compatibility exception forced. No definitive dependency vulnerability count, effort estimate, live field parity or production-readiness certification is claimed.

### Primary references

- [Migration overview][migration-overview]
- [JSS 22.0 → Content SDK 2.1][migration-jss]
- [Content SDK 2.4 update notes][changes-24] and [published Next.js release][release-next]
- [Component maps][component-maps], [registration][component-register], [integrated GraphQL][integrated-graphql]
- [SDK configuration][sdk-config], [tracking/identity][tracking-docs], [Context ID scopes][context-docs]
- [App Router tagged revalidation][sdk-osr]
- [Next.js 16 guide][next-16], [React 19 guide][react-19]
- [Auth0 v4 migration notes][auth0-migration]
- Immutable npm artifacts: [initializer][tar-create], [Next.js][tar-next], [React][tar-react], [content][tar-content]

[migration-overview]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/upgrade-jss-next-js-apps-to-content-sdk.html
[migration-jss]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/upgrade-jss-22-0-next-js-apps-to-content-sdk-2-1.html
[changes-24]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/what-s-new-in-content-sdk-2-4.html
[release-next]: https://github.com/Sitecore/content-sdk/releases/tag/%40sitecore-content-sdk%2Fnextjs%402.4.0
[npm-next]: https://registry.npmjs.org/@sitecore-content-sdk%2fnextjs/latest
[npm-cli]: https://registry.npmjs.org/@sitecore-content-sdk%2fcli/latest
[npm-create]: https://registry.npmjs.org/create-content-sdk-app/latest
[npm-discover]: https://registry.npmjs.org/@sitecore-discover%2freact/latest
[npm-search]: https://registry.npmjs.org/@sitecore-search%2freact/latest
[npm-redux]: https://registry.npmjs.org/react-redux/latest
[npm-auth0]: https://registry.npmjs.org/@auth0%2fnextjs-auth0/latest
[npm-storybook]: https://registry.npmjs.org/@storybook%2fnextjs/latest
[tar-create]: https://registry.npmjs.org/create-content-sdk-app/-/create-content-sdk-app-2.4.0.tgz
[tar-next]: https://registry.npmjs.org/@sitecore-content-sdk/nextjs/-/nextjs-2.4.0.tgz
[tar-react]: https://registry.npmjs.org/@sitecore-content-sdk/react/-/react-2.4.0.tgz
[tar-content]: https://registry.npmjs.org/@sitecore-content-sdk/content/-/content-2.3.0.tgz
[component-register]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/register-a-component-in-the-component-map.html
[component-maps]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/manage-component-maps-for-client-and-server-components.html
[integrated-graphql]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/integrated-graphql-in-content-sdk-apps.html
[sdk-search]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/search-api.html
[sdk-config]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/the-sitecore-configuration-file.html
[tracking-docs]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/initializing-tracking,-events,-and-personalization-in-the-content-sdk.html
[context-docs]: https://doc.sitecore.com/sai/en/developers/sitecoreai/deploying-sitecoreai/deploy-app/manage-an-environment/context-id-environment-variables.html
[hosts-docs]: https://doc.sitecore.com/sai/en/developers/sitecoreai/environment-editing-hosts-and-rendering-hosts.html
[sdk-osr]: https://doc.sitecore.com/sai/en/developers/content-sdk/20/on-demand-static-revalidation-for-app-router-apps.html
[next-16]: https://nextjs.org/docs/app/guides/upgrading/version-16
[react-19]: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
[auth0-migration]: https://raw.githubusercontent.com/auth0/nextjs-auth0/main/V4_MIGRATION_GUIDE.md
