# Retained forms and native components — ticket 13

## What the content actually uses

A survey of the serialized items, not an assumption, found:

- **FEaaS (Component Builder):** one component on `landing-pages/landing-page-ch-one-content` (rendering `CAA0C742…`, `ComponentName=CHONE`). It comes from an external library `{{libraryId}}` hosted on `feaas.blob.core.windows.net`; the library ID is filled in by the existing platform utility.
- **BYOC:** the custom `Countdown Timer` component (`src/components/BYOCC/CountdownTimer.tsx`). It registers itself when its module loads; the generated component map imports it, as the original JSS component builder did.
- **XM Cloud Forms:** no serialized content uses the `SitecoreForm` BYOC component. Its registration (`@sitecore/components/form` in `byoc/index.client.tsx`) is kept as the template default. No BYOC Form migration was needed or invented.
- **Sitecore Send:** `EmbedSendForm` stays an integration-only rendering. Authors see an editor notice; visitors see nothing.

Rendering names, component-map wrappers (`BYOCWrapper`, `FEaaSWrapper`), FEaaS image handling (`FEAASScripts`), the BYOC/FEaaS provider wiring and Design Studio library stylesheet links are unchanged. No new library, Design Studio showcase or service provisioning was added.

## Retained CMS demo forms

- Attendee registration, request-information and sponsor forms and the simulated ticket journey (ticket grid → attendee → payment → confirmation) keep their UI. The payment step remains a **simulation**: no payment provider, OrderCloud, shop, account or auth call exists.
- **Fixed:** these forms waited for native Edge events before continuing, so a slow upstream left the visitor stuck. Examples: the attendee form waited for `IDENTITY` and `ATTENDEE_FORM_COMPLETED`; the payment form waited for three purchase events; the information forms delayed their thank-you message. The events are now sent in the background; client-side navigation keeps the same document, so they still complete. Failures are logged at debug level.
- Native events per journey are unchanged and verified once each: `TICKET_SELECTED`, `IDENTITY` (email), `ATTENDEE_FORM_COMPLETED`, `PAYMENT_FORM_COMPLETED`, `PAYMENT_SUCCESSFUL`, `TICKET_PURCHASED` (ticket name). Identity and attendee events are now issued together instead of strictly in sequence.
- Forms do not prefill from legacy CDP profiles and make no guest-extension writes.

## Compatibility bridge

After this ticket no active (non-story) source file imports the temporary `@sitecore-jss/sitecore-jss-nextjs` alias. Payment progress, the editing-state helper and the product-category type were migrated. A few page/integration-placeholder files still use the global `JSX.Element` annotation bridge. Stories still use the alias. Both are removed in the ticket-15 contract step.

## Verification

- Development and production: the simulated ticket journey works end to end (progress steps, order summary total, confirmation). A registered BYOC Countdown Timer renders for a future date and shows its expiry message for a past one. An unregistered BYOC component and an unreachable FEaaS library leave the page usable. The Send form is hidden for visitors and explained to editors.
- Production only (simulated Edge boundary): each journey event is sent exactly once. Under a 15-second Edge delay the ticket journey and request-information form finish within three seconds. The delay checks failed before the fix.
- The BYOC check was proven fault-sensitive: disabling the Countdown Timer registration failed it, and the file was restored byte-for-byte.
- Complete suite: **76 cases**. Development: 61 run twice = **122 passes**, 30 skips by design (production-only analytics, personalization and form-event checks). Production (simulated Edge mode): **all 76 pass**, with zero blocked server-side requests. TypeScript, both lint gates and the optimized build pass.

The FEaaS test library is deliberately unreachable: its loopback TLS fetch fails, and the SDK logs and contains it. The page also requests the Design Studio library stylesheet from the Edge files path; that link is generated correctly and the fixture returns 404. Real library rendering, live Forms and real event delivery require the tenant (tickets 03/16).

Local evidence is in Git-excluded run `ticket-13.ngaTU7`. No staging, commit, push, deployment or live service call occurred.
