# Content SDK foundation — ticket 04

The Pages Router foundation now uses the compatible published patch baseline:

| Package/runtime | Version |
| --- | --- |
| Content SDK Next.js | 2.4.1 |
| Content SDK CLI | 2.3.0 |
| Next.js | 16.4.1 |
| React / React DOM | 19.3.1 |
| TypeScript | 5.8.3 |
| Node used for local verification | 24.19.0 |
| Sharp | 0.35.5 |

Packages were resolved without force or legacy-peer exceptions. TypeScript 7 was not selected because the current lint parser supports TypeScript below 6.1. Native dependency lifecycle checks ran successfully.

## Active architecture

- Typed `sitecore.config.ts` and `sitecore.cli.config.ts` replace generated JSS runtime/plugin configuration.
- `SitecoreClient` handles normal pages, metadata preview, dictionary and component data.
- `SitecoreProvider`, normalized `Page.mode` and generated component/import maps replace the old context/builder infrastructure.
- `proxy.ts` composes preview, bot, site, redirect and native personalization behavior.
- Pages Router routes, placeholder names, item IDs, locale declarations, blocking fallback and five-second ISR remain intact.
- Native analytics/events use Content SDK plugins/adapters and require an appropriately scoped browser context. Local fixture runs intentionally have no Edge/client Context ID and do not validate live analytics/personalization.
- Metadata editing is GET-based, secret-protected, and rejects legacy POST requests.
- Old factory/plugin/scripts and original source snapshots are preserved in `legacy/jss-infrastructure`, outside the active application build.
- The editing-host build configuration declares the tested Node 24.19.0 runtime; no host was deployed or switched.

## Temporary expand-contract bridges

> **Removed in ticket 15.** See [contract cleanup](content-sdk-contract-and-verification.md). The description below is historical.

`src/lib/jss-compat.ts` is a runtime/type adapter over **Content SDK**, not the old JSS package. It preserves existing field imports and read-only `useSitecoreContext` consumers while feature tickets migrate their callers. The old JSS packages are not installed.

`src/types/legacy-jsx.d.ts` supplies the legacy `JSX.Element` annotation through React's scoped JSX type for unmigrated return annotations. New foundation code uses `React.JSX`.

Both bridges must be removed during contract cleanup only after their callers are migrated. Their existence does not mean all retained components have been natively ported or tested against a live tenant.

## Configuration and scripts

Real configuration belongs in private `.env.local` files. The tracked defaults contain no API/Context ID/editing-secret values. Use:

- `NEXT_PUBLIC_DEFAULT_SITE_NAME` and `NEXT_PUBLIC_DEFAULT_LANGUAGE`
- `SITECORE_EDGE_CONTEXT_ID` for the server
- `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` with public scoped access for browser functionality
- `SITECORE_EDITING_SECRET` for editing endpoints
- Appropriately scoped local `NEXT_PUBLIC_SITECORE_API_HOST` / `NEXT_PUBLIC_SITECORE_API_KEY` only when using local CM/fixtures

`bootstrap` is retained as a compatibility script alias for component-map and Content SDK CLI build generation. `dev` / `start:connected` use Pages Router with explicit Webpack; `build` performs SDK generation and `next build --webpack`. Do not use ignored old generated JSS config as the active connection source.

## Published loader-export workaround

The pinned Next.js SDK package's `component-props-loader` export points to a missing directory. The package nevertheless ships its public root loader shim, which delegates to the actual loader implementation.

`next.config.js` resolves that shipped root shim from the package's main entry. This preserves server-only component-prop stripping without modifying `node_modules`, removing the loader, or ignoring build errors. Recheck/remove this version-specific resolution when a later supported SDK package fixes the export.

Image host patterns are shared as client-safe data. The FEaaS image adapter must not import server-only Next configuration or bundle-analyzer code into the browser.

## Verification

- Editor descriptor was observed red on JSS, then green with Content SDK 2.4.1.
- 21 browser/HTTP checks repeated twice: 42 passes, zero failures/flaky results.
- Real metadata-editing endpoint exercised with fixture-backed item editing data; editing authorization and GET-only behavior are checked.
- Retained form hydration regression observed red, then green after preserving literal fragment anchors rather than Next's rewrite-sensitive placeholder links.
- Application TypeScript, ESLint/Stylelint and baseline lint pass.
- Optimized production build passed with TypeScript checking enabled.
- Production HTTP smoke passed for home content, public 404 and the SDK metadata descriptor.

These checks use only loopback fixtures. They do **not** validate real Pages save/publication, preview-origin permissions, a live Context ID, native analytics/personalization behavior, all rendering variants, or the complete Design Studio experience.

## Remaining limitations

- Ticket 03 still requires the specific authorized nonproduction environment/private configuration/test host/testing owner.
- Existing component batches still use compatibility imports until their native migration tickets complete.
- CLI import-map generation previously warned about a static news profile-image import. Ticket 10 removed that import; the warning no longer appears. Complete component/Design Studio generation behavior remains a later validation/contract gate.
- Fixture runs warn about missing browser Context ID and disabled personalization. This is expected; do not suppress the warning by inventing a real context or treat it as live acceptance.
- The existing Tailwind line-clamp plugin is redundant with the installed Tailwind 3 version; no unrelated CSS major-version migration was performed.
- New Next.js dev generates a versioned AGENTS guidance file automatically. This does not start an additional agent worker.
- Windows CM/Docker and the legacy Azure image pipeline are not certified by these local frontend checks.

## Local records

Evidence, old dependency lock/tree, preserved-source receipts, red/green logs, build logs, production HTTP smoke and the owned-test-server cleanup receipt are preserved under the locally Git-excluded ticket-04 execution run `ticket-04.LnMkt7`.

No code or tickets were staged, committed, pushed or published. No tenant resource was reinitialized or active host changed.
