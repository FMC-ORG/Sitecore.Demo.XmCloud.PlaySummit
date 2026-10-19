# Native embedded personalization — ticket 12

No application code changed in this ticket. The ticket-04 wiring (`PersonalizeProxy` in `proxy.ts`, Pages Router `getPage` handling of the personalized rewrite) is template-equivalent and is now verified through the rendering host and a simulated Edge personalize boundary.

## How it works (verified)

1. The proxy asks Edge for the page's personalize info (page variant IDs from the saved component rules).
2. It sends one `POST /v1/personalize` per definition. For embedded (page-level) personalization the friendly ID is `embedded_<pageId>_<lang>`, matching the existing serialized definitions `embedded_{scope}_<pageId>_en` (scope is empty unless `NEXT_PUBLIC_PERSONALIZE_SCOPE` is set). The request carries the visitor's sandbox browser ID, the offered variant IDs, UTM parameters, `siteId` and the server Context ID.
3. A returned variant rewrites the request to `/_variantId_<id>/<path>`. `getPage` applies the matching component `experiences`: datasource swaps, variant-only components and hidden components.
4. Next.js caches each rewritten variant path separately, so visitors cannot receive another variant's cached page.
5. No variant, an unoffered variant, an upstream failure or the CDP timeout (default 400 ms) all fall back to the default experience.
6. Preview and editing skip the visitor proxy. The editor-selected variant (`sc_variant`) is sent to the editing GraphQL request and rendered from the already-personalized upstream layout, with no visitor personalization call.
7. Bots (the `sc_bot` cookie) are skipped by the proxy.

Existing personalization definitions (`src/personalize/*.json`), page rules, rendering identities, guest records and Sitecore items were not changed. Their hashes were checked unchanged. No legacy Boxever flow was recreated.

## Verification

Production (simulated Edge mode) checks against the Embedded Personalization Example route shape. They use its real item ID and the page variant IDs from its saved rules:

- a fresh non-matching visitor gets the default experience; the recorded Edge call has the expected friendly ID, site, server Context ID, sandbox browser ID and offered variants;
- a campaign visitor (`utm_campaign=demoexample`, the definition's "From a specific campaign" condition) gets the variant datasource and the variant-only component;
- a variant can hide a component;
- interleaved fresh visitors never receive each other's cached variant;
- a returning visitor keeps one sandbox identity (cookie reused, no new browser ID);
- slow (1.5 s) and failing upstreams fall back to default within the timeout;
- editor preview of a selected variant renders it, the default preview renders the default, and no visitor personalization call is made.

The checks were proven fault-sensitive. Not executing the proxy failed six of seven (preview correctly unaffected). A naive route cache ignoring the variant failed the isolation check (a campaign visitor received the cached default). A raised 5 s CDP timeout failed the fallback check. Sources were restored byte-for-byte and hash-verified. Two injection attempts were invalid and are recorded as such: one did not type-check, and one cache key conflated variants but not the default. Both were rerun.

Complete suite: **70 cases**. Development (local-API mode): 58 run twice = **116 passes**, 24 skips by design (personalization and native events need Edge mode / production). Production: **all 70 pass**, with zero blocked server-side requests and zero unhandled fixture calls. TypeScript, both lint gates and the optimized build pass.

## Notes and limits

- The fixture's audience decision is a deterministic stand-in keyed to UTM campaign values; it is not CDP audience evaluation. "Visited a specific page" is represented by `utm_campaign=sessions-fans` purely as a test switch. Real audience/condition behavior, traffic allocation and reporting require the tenant (ticket 16).
- On a failed personalize response the SDK proxy logs `TypeError: Cannot read properties of null (reading 'variantId')` before falling back. This is an unguarded null inside the SDK proxy, not app code; the visitor still gets default content. Revisit on SDK upgrade.
- Cookie checks prove a single sandbox identity within the visit. They make no claim about continuity with historical (JSS/Boxever-era) visitor assignments.
- All existing serialized definitions are page-level (`embedded_…`). Component-level A/B tests (`<componentId>_<variantId>` executions) are not used by this demo and were not covered.
- Personalization is inactive in local-API mode (no server Context ID), which is expected for local CM development.

Local evidence is in Git-excluded run `ticket-12.4H5mC3`. No staging, commit, push, deployment or live-tenant call occurred.
