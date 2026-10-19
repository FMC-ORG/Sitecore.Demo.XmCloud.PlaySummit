# Native analytics and questionnaire — ticket 11

## Native events

The Content SDK browser events setup from ticket 04 is retained and now verified:

- `Bootstrap` initializes `initContentSdk` with `analyticsPlugin` (browser adapter, first-party cookie) and `eventsPlugin` only in **normal** mode, only outside development, and only when a client Context ID is configured.
- `CdpPageView` sends one native `VIEW` event per normal page render (route name, language, page-variant ID, `WEB`/`USD`).
- Edit and preview rendering never initializes analytics or sends events.
- Bot visitors (by user agent or the `sc_bot` cookie) are not counted.
- Each fresh browser gets one sandbox identity from Edge (`browser/create.json`) and reuses it for the visit. No legacy profile migration, guest-data deletion or personalization-definition reset is involved.
- Unavailable/blocked Edge services, missing configuration and failed initialization are swallowed by the SDK and app code. Pages and the questionnaire keep working.

Retained custom events (`AUDIENCE_PREFERENCE`, ticket/payment/attendee events, identity) use native `@sitecore-content-sdk/events` calls. The form/payment interactions are verified with their components in ticket 13.

## Questionnaire

`Questionnaire` and `QuestionnaireQuestion` now import Content SDK directly. Their rendering, saved integrated query and Session Finder content are unchanged.

- **Fixed:** a single session without audience or type tags crashed the whole questionnaire. Ranking now tolerates missing tags and deleted sessions.
- **Fixed:** an audience choice waited for the Edge event call before moving on, so a slow upstream stalled visitors. The event is now sent without blocking; failures are logged at debug level.
- Recommendations still rank type match, then audience match, and show four sessions. No legacy CDP/Send/guest-extension writes exist.

## Test harness changes

- **Production checks simulate XM Cloud Edge mode** with synthetic, non-secret server and client Context IDs (`local-fixture-server-context` / `local-fixture-client-context`). A client ID without a server ID is an unsupported SDK configuration: the SDK warns it "will cause the application to fail at runtime", and the personalize proxy does fail. Server-side Edge content, personalize-info and analytics calls go to the loopback fixture through `SITECORE_EDGE_PLATFORM_HOSTNAME` / `NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME`.
- **Development checks keep local-API mode.** Native events are disabled in development by design, so the five native-event checks are skipped there.
- The browser always uses the SDK's default Edge URL (`https://edge-platform.sitecorecloud.io`), because the SDK reads the hostname through a dynamic `process.env` lookup that Next does not inline. Playwright simulates that origin inside the browser context; every other non-loopback browser request is refused.
- A preloaded **loopback-only fetch guard** (`tests/fixtures/loopback-only-fetch.cjs`, via `NODE_OPTIONS`) refuses and logs every non-loopback server-side fetch. Final production runs logged **zero** blocked requests. It also showed that `next dev` and `next build` previously made an npm-registry version check on every run; that framework call is now refused locally. npm's own update notifier is disabled for test servers.
- The fixture serves the Edge content GraphQL path with the same protocol as local CM GraphQL. It answers personalize-info queries with "no variants" by default and logs any unhandled endpoint.

A production build for these checks must be created with the same synthetic values and loopback hostnames (see the tests README). Synthetic IDs appear only in test-harness files.

## Verification

- Native-event checks (production only): one page view per page with one reused sandbox identity, no events in edit/preview, bots skipped, one non-blocking audience event under a 15-second upstream delay, pages/questionnaire unaffected by unavailable Edge.
- Red evidence: the questionnaire crash was observed before the fix. Native-event checks were proven fault-sensitive by injection: a duplicate page view, removed edit/preview guards and the old blocking `await` each made the expected check fail. Sources were restored byte-for-byte and hash-verified.
- Complete suite: **63 cases**. Development: 58 run twice = **116 passes**, 10 skips by design, zero failures/flakes. Production (simulated Edge mode): **all 63 pass**.
- TypeScript, application ESLint/Stylelint and baseline lint pass; the optimized production build passes with type checks.

These are fixture-backed contract checks. They do not prove delivery to a real XM Cloud tenant, Edge acceptance of the payload, consent handling, or live analytics reporting. Those remain ticket 03/16 acceptance items.

One incident was recorded: the first fault-injection attempt failed before any build/test because CRLF files did not match an LF pattern. Its text round-trip briefly rewrote two CRLF files with LF endings. Hash checks caught this, and both files were restored byte-for-byte from ticket-start snapshots.

Local evidence is in Git-excluded run `ticket-11.SyCQE0`. No staging, commit, push, deployment or live-tenant call occurred.
