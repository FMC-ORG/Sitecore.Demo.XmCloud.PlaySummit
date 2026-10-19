# Native homepage marketing content — ticket 06

All `PageContent` rendering callers now use Content SDK directly and scoped React JSX annotations. The retained hero/CTA, banner, image section, section, feature, testimonial, three-column and featured-event compositions keep their rendering names, nested slots, wrapper classes and content contracts. The static welcome and existing native-event adapter remain; no legacy Boxever/IP/commerce/Discover/Send flow was recreated.

## Local behavior and fixes

- Hero CTA and section/feature links lead to the retained session journey.
- Header/full-image banners use their title values as image descriptions rather than stringifying Field objects.
- Empty hero-image and section-CTA fields retain native metadata editing instead of disappearing behind normal-delivery guards.
- Featured events tolerate missing optional speaker/premium fields.
- Existing hero, section and feature nested placeholder names remain unchanged.
- Normal compositions and a static welcome render with excluded integrations unconfigured. Integration-only notices/hiding remain covered by the complete baseline.
- Entity sections and detailed native-event behavior remain owned by their subsequent feature tickets.

## Mode-verification correction

Ticket 06 exposed a gap in the earlier fixture-backed mode checks: metadata markers alone did not prove the normalized Page was in edit/preview mode. The external fixture now honors the SDK local-CM `EditingQuery` mode headers, and tests assert actual editor/preview wrapper states.

A second finding was timing-related: Content SDK 2.4.1 creates preview data with a three-second lifetime. Cold Next.js development compilation can outlast it and render in normal mode. The test harness explicitly warms the catch-all over HTTP before editing checks. No application secret, cookie lifetime or origin validation was relaxed.

Earlier ticket-05 evidence is retained unchanged. Its shell checks were rerun with these stronger mode assertions as part of ticket 06 and pass in development and production. Cold remote Pages entry still requires authorized environment testing; this local warm-up is not a cold-live acceptance claim.

## Visual evidence

The synthetic marketing composition is checked through the real browser. An unpinned SVG text font initially varied between sans-serif and serif. The fixture now pins it explicitly. Its revised reference was captured by temporarily rendering the preserved **pre-native** callers, not by accepting the migrated output as a new baseline. Native sources were restored in `finally` and their SHA-256 hashes verified.

The original unpinned image/reference, failures, comparison images and pinned pre-native receipt are all preserved. The current golden PNG contains only synthetic loopback content and tests layout/content, not a customer's tenant or live media fidelity. Application CSS and public assets were not changed to make the comparison pass.

## Verification

- 36 browser/HTTP/visual cases repeated twice in development: **72 passes**, zero failures/flakes.
- All **36 cases pass against `next start`** and the optimized production build.
- Application TypeScript, ESLint/Stylelint and baseline lint pass.
- Original content/platform/public-media/configuration and archive hashes remain protected.
- Known missing Context ID/import-map warnings remain documented; no live native analytics/personalization/Pages publication acceptance is implied.

Local evidence is preserved in the Git-excluded run `ticket-06.UkIcyf`. No ticket/code staging, commit, push, deployment, agent-worker replacement or environment reinitialization occurred.
