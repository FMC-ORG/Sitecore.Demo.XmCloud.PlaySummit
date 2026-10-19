# Preserved PLAY! Summit frontend integrations

This archive preserves excluded frontend integrations and original snapshots from the XMC-only migration. It is **not a second runnable frontend** and is outside the active rendering application's route discovery, type checking, component-map generation and dependency installation.

Do not run the historical package scripts or install the archived dependency manifest as a replacement for the active application's manifest. The archive is deliberately incomplete as an application: required core framework/configuration/build files are not copied wholesale.

## Provenance and integrity

`archive-manifest.json` records each preserved source path, archive path, raw SHA-256, base Git revision and the preservation action. `matchesBaseRevision` compares Git-clean blob IDs using the original source attributes, so CRLF checkout conversion is not mistaken for a code change. The initial raw-byte comparison is retained separately:

- `move`: the excluded source was moved out of the active application without changing its bytes.
- `snapshot`: the original source was copied before adapting its active counterpart to an XMC-only implementation.

Source paths beneath the rendering application are mirrored under `rendering/`. The historical `rendering/package.json` is a **dependency snapshot only**. It includes the baseline test tooling added before isolation and therefore is explicitly marked as not matching the starting Git revision's content.

The migration branch started at `1ea92e5`; per-file records carry the full revision. Git history and the original checkout remain the source of truth for earlier revisions. No private environment files, dependency directories, Sitecore items or backend connector files were selected for archival.

## Preserved areas

- OrderCloud/shop/account UI, Redux, hooks/models, authentication and checkout integration APIs
- Auth0/OpenID Connect and private service endpoints
- Separate Sitecore Search and Discover widgets, helpers, crawlers and related mock stories
- Legacy Boxever/CDP, Send, CareConnect and channel demo code
- Associated integration-only styles, commerce category feeds/build preparation and supporting source
- Pre-isolation global wiring and retained mixed CMS component/service snapshots

The original browser assets remain in place for retained CMS content. The platform, serialized items, connector assets and root deployment configurations are not migrated by this archive.

## Active compatibility renderings

Saved CMS rendering identities remain resolvable through thin XMC-only wrappers:

| Rendering/component | Active behavior |
| --- | --- |
| `PersonalizedPicksWrapper` | Search notice for authors; hidden from normal delivery |
| `ProductCategoriesGrid` | Commerce notice for authors; no link into the archived shop |
| `EmbedSendForm` | Send notice for authors; hidden from normal delivery |
| `HeaderCdpMessageBar` | Legacy CDP notice if explicitly rendered in editing; no legacy DOM injection target |

Mixed components retain CMS content/interaction where applicable:

- Hero content always renders from CMS fields rather than a legacy CDP configuration flag.
- Dynamic welcome uses the approved translated/static welcome fallback.
- Main/footer/header link collections filter archived journeys without modifying authored link items.
- Questionnaire and retained CMS forms keep native XMC telemetry where available; no legacy guest-extension reads/writes occur.
- Visitor identification is native-only and optional for the simulated CMS form interaction; unavailable native telemetry does not hang form completion.
- Form prefills are blank rather than fetched from archived guest profiles.
- Mock ticket prices retain their standard values; legacy guest-extension offers are not recreated.
- Mock ticket confirmation is simulated, not a payment-provider operation, and invalid ticket selections are rejected.

The custom commerce category generation step is archived because no active XMC consumer remains; native CMS queries and serialized templates are not removed with it.

## Future restoration

1. Use the manifest and original Git revision to identify the desired source and supporting dependencies.
2. Restore only the selected integration as an explicitly scoped feature, not the archived global application wiring.
3. Check compatibility with the active SDK/React/framework versions. Old dependency declarations are evidence, not a supported modern installation recipe.
4. Provide private nonproduction configuration and test its rendering, route, event and authorization contracts.
5. Re-enable the relevant navigation/rendering deliberately after testing.

Do not blindly copy back the global CDP/Search/Auth0 providers, admin APIs or the historical dependency manifest. That would undo the XMC-only dependency and route boundary.
