# Rendering-host regression baseline

This suite first characterized the JSS application and now guards the Content SDK Pages Router migration. It tests the **running rendering host through browser/HTTP behavior**, not mocked internal SDK modules.

## Run

From the rendering application:

```sh
npm ci
npx playwright install chromium
npm run test:baseline
npm run lint:baseline
npx tsc --noEmit
```

The initial JSS baseline skipped lifecycle scripts. The Content SDK target now installs with native lifecycle checks and passes a fixture-backed optimized production build/HTTP smoke. These DOM/HTTP tests still use SVG fixture media and do not certify live optimized media or a real tenant.

The runner is pinned to Playwright 1.64.0. It starts and stops two loopback-only processes:

- Sitecore fixture API: `http://127.0.0.1:3311`
- Real Next.js rendering host: `http://localhost:3310`

One browser worker is used. Ports must be available; the suite does not reuse an unrelated running server.

### Two server topologies

- **Development (default, `next dev --webpack`)**: local-API mode against the fixture. Native browser events are disabled in development by design, so the native-event checks are skipped.
- **Production (`BASELINE_PRODUCTION=1`, `next start`)**: simulated XM Cloud Edge mode with synthetic, non-secret Context IDs. The optimized build must be created with the same values first:

  ```sh
  # Start the fixture (node tests/fixtures/sitecore-server.mjs) and then build with:
  NODE_ENV=production NEXT_PUBLIC_SITECORE_API_HOST=http://127.0.0.1:3311 \
  NEXT_PUBLIC_SITECORE_API_KEY=local-fixture-api-key SITECORE_EDITING_SECRET=local-fixture-editing-secret \
  SITECORE_EDGE_CONTEXT_ID=local-fixture-server-context \
  NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID=local-fixture-client-context \
  SITECORE_EDGE_PLATFORM_HOSTNAME=http://127.0.0.1:3311 \
  NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME=http://127.0.0.1:3311 \
  NODE_OPTIONS="--require $PWD/tests/fixtures/loopback-only-fetch.cjs" npm run build
  BASELINE_PRODUCTION=1 npm run test:baseline
  ```

Server-side Edge calls go to the loopback fixture. In the browser, the SDK's default Edge origin is simulated inside Playwright; no request leaves the machine. A preloaded loopback-only fetch guard refuses and logs (`[loopback-only]`) any non-loopback server-side fetch, so synthetic IDs can never reach a live service. Only framework version checks during `next dev`/`next build` have been observed and refused. Legacy CDP, Search, Discover, Send and commerce have been removed from active wiring/dependencies and preserved in the integration archive. Browser requests outside the loopback hosts are blocked. No tenant credentials are needed or submitted.

**Keep the Next.js dev-server hostname and browser origin both `localhost`.** With Next.js 14.2.35, mismatching the loopback hostnames caused repeated internal multisite rewrites and eventually HTTP 431. The test configuration avoids that setup issue without changing application middleware.

## Covered behavior

1. The homepage renders the summit title supplied through Sitecore layout data.
2. Main navigation exposes the CMS sessions link.
3. A visitor navigates home → session listing → session detail and sees the description.
4. An unknown CMS route returns HTTP 404 and the public not-found page.
5. A missing component datasource does not prevent other page content from rendering.
6. Editing configuration rejects requests without its editing secret.
7. An authorized editor discovers metadata mode and the required CMS rendering names.
8. Archived CDP/auth/checkout/OIDC/OrderCloud/private endpoint families return 404.
9. CMS navigation hides excluded routes, locale-prefixed account links and legacy API login links without changing the authored items.
10. Integration-only widgets are hidden for visitors and display an explanatory author notice.
11. The static welcome and retained CMS request form work without legacy guest services.
12. The simulated CMS ticket form rejects unknown ticket IDs before confirmation.
13. Native header/footer/navigation tolerate deleted data and unavailable optional language context.
14. Partial designs and nested container/row/column slots retain text, rich text, links, route body fallback and a loaded SVG image.
15. Metadata field identities survive shell and primitive rendering; deleted/empty image fields remain safe in normal/edit/preview modes.
16. Marketing compositions, nested CTAs, loaded banner artwork, empty metadata fields and optional featured-event references remain usable.
17. A pinned-media screenshot compares the native marketing layout to preserved pre-native callers; application CSS is not modified to update the reference.
18. Session search/order/clear, list-to-detail navigation, integrated role/timeslot/relation shapes, related-link hydration and session metadata fields work with fixture query results.
19. Featured speakers/grid lead to biography and related sessions; missing speaker data, empty edit fields and session-detail speaker profiles stay safe.
20. Sponsor/vendor grids and logos lead to history, related sessions and speakers; deleted selections, missing logos/details and editing guidance stay safe.
21. News list → article, newest-four grid with tweet images, empty/undated/missing-image/unknown-route behavior and article editing metadata work.
22. The questionnaire recommends matching sessions, tolerates untagged sessions and restarts.
23. Production only: one native page view per page with one reused sandbox identity; no events in edit/preview or for bots; a non-blocking audience event under a slow upstream; pages/questionnaire unaffected by unavailable Edge.
24. Production only: embedded personalization serves default, variant (datasource swap, variant-only and hidden components) and editor-preview variants; visitors are isolated; identity is reused; slow/failing personalization falls back to default.
25. The simulated ticket journey, registered BYOC Countdown Timer, unregistered BYOC/unreachable FEaaS containment and the editor-only Send notice work. Production only: each journey event is sent once and a slow Edge never holds up the forms.
26. French Canadian content/dictionary/editing, Japanese routing with English fallback, language switching that keeps path and query, and 404s in every locale work. Production only: redirect map types, language/query preservation, server transfer and archived-path exclusion.
27. Health, robots (static disallow-all plus site robots route), sitemap index/site sitemap and page metadata work. Production only: blocking fallback on a never-rendered route and five-second ISR revalidation.

There are 89 test cases (19 run in production mode only: 5 native-event, 7 personalization, 3 form-event, 2 redirect and 2 ISR checks), including the parameterized excluded-endpoint checks, metadata authorization/GET-only behavior, the SDK descriptor, form hydration, native shell context, nested/partial-design slots and missing/empty field states. Run `BASELINE_LEGACY_CDP=1 npm run test:baseline` to provide obsolete local-only CDP settings deliberately and verify they cannot replace CMS content or re-enable archived wiring. No real service credentials are used.

The home-page labels and session/speaker names are drawn from existing Storybook examples. Fixture identifiers and content are synthetic; this is not a copy of a customer's tenant. The GraphQL fixture endpoint returns controlled site information, dictionary and materialized layout/item-editing responses. Author-mode checks enter through the real metadata-editing endpoint, not a normal delivery route carrying a forged editing flag. The fixture honors its local-CM editing GraphQL mode headers; tests assert actual normalized editor/preview wrapper states. The dev catch-all is explicitly warmed over HTTP before the SDK creates its three-second preview data, so these checks do not claim cold remote Pages acceptance. It does not execute Sitecore's real integrated queries or validate the entire GraphQL schema.

Fixtures are stored under `tests/fixtures`. Do not import rendering implementations into the tests or derive expected output from their internal helpers. Expectations should describe public behavior with known literal content.

## Evidence and preservation

Each invocation writes a unique timestamped directory beneath `test-results/baseline`, including JSON results and retained failure traces/screenshots. Existing run artifacts are not overwritten by subsequent invocations. Runtime results and build outputs are Git-ignored.

The implementation's red/green and diagnostic runs are additionally preserved in local migration execution records. Tests were shown to fail when homepage/navigation/session/missing-datasource content was absent, then pass after the external fixture supplied the appropriate content. Existing public 404 and editing-secret behavior passed characterization without application fixes.

## Baseline observations

- The active XMC application now uses Content SDK 2.4.1, Next.js 16.4.1 and React 19.3.1, with temporary caller/type bridges for staged component migration.
- The old application emits a Node `util._extend` deprecation warning and an outdated Browserslist-data warning. Neither caused these checks to fail; they are not silently fixed by the test harness.
- Existing private test-host configuration is absent. No live Pages, save, publication, analytics or personalization acceptance has occurred.
- By default these checks use `next dev --webpack`. With `BASELINE_PRODUCTION=1` they use `next start`; a prior optimized build must have used the same synthetic loopback configuration. Development runs 70 cases (19 skipped by design); production runs all 89. This still does not certify all routes/variants, live optimized media, authoring-origin permissions or a real tenant.

## Later migration gates

Preserve these browser/HTTP contracts when changing SDK wiring. Adapt only the external fixture protocol where the real target SDK requires it; do not replace behavioral assertions with tests of generated maps or private factories.

Actual Pages text/image editing, save, add/remove, publish-to-Live, native analytics/personalization, translated-content coverage, and existing provisioned native components remain separate nonproduction acceptance requirements. This suite cannot close those gates.
