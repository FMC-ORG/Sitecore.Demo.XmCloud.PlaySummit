# Multilingual routing and redirects — ticket 14

No application code changed in this ticket. The Pages Router i18n configuration (`en` default and unprefixed, `fr-CA`, `ja-JP`, locale detection off), the Content SDK proxies and the existing language switcher were verified as they are.

## Content facts (from serialized items)

- 59 items have `fr-CA` versions, and 14 dictionary phrases have `fr-CA` values (for example "Book Tickets" → "Réservez vos billets").
- **No item and no dictionary phrase has a `ja-JP` version.** Japanese is routing plus fallback only. No Japanese translation coverage is claimed, and no publication language was added.
- The site enables item and field language fallback, and its host name is `*`.
- The custom context `Languages` lists languages with versions or fallback (`DemoContextExtension`). `ja-JP` therefore appears in the switcher through fallback.
- **The serialized redirect map is empty.** Redirect behavior is verified as the proxy contract with synthetic fixture entries, not as authored redirects.

## Verified behavior

- `/fr-CA/...` renders French content, French dictionary phrases, `html lang="fr-CA"` and the French page title. Editors render French content with field metadata in metadata editing.
- `/ja-JP/...` renders with `html lang="ja-JP"`, falling back to English content and English dictionary phrases.
- The language switcher keeps the CMS path and query values (for example `utm_campaign`) when switching to French and back to the unprefixed default.
- Unknown routes return the public 404 page in every locale.
- Redirects (production): a `301` keeps the query when configured and the request language for locale-prefixed paths (`/fr-CA/old-sessions` → `/fr-CA/sessions`). A `302` drops the query when configured. A server transfer renders the target without changing the URL. Archived `/shop` paths stay excluded from redirects (404).
- Site resolution uses the generated site list (single site, host `*`) through the multisite proxy.

## Notes

- **Redirects are disabled in development.** That is the Content SDK default (`redirects.enabled = NODE_ENV !== 'development'`) and matches the original JSS redirects middleware (`disabled` in development). The redirect checks therefore run against the production build only.
- **Intentional difference from JSS:** the original JSS redirects middleware was configured with `locales: ['en']`. The migration configures all three frontend locales, so locale-prefixed request paths are understood when matching redirects.
- Language fallback, dictionary fallback and redirect evaluation happen upstream in Sitecore; the fixture models them from the site settings above. Real fallback configuration, Japanese language-item setup and authored redirects must be confirmed on the tenant (ticket 16).
- No App Router or new localization architecture was introduced.

## Verification

- 7 i18n/redirect cases: French direct request, Japanese fallback, switching with query, unknown routes in all locales, redirect types/language/query/exclusion, server transfer, and French metadata editing.
- Fault injection proved the switching and redirect checks sensitive: a switcher that dropped the query failed switching, and removing the proxy exclusion let `/shop/old-sessions` redirect (`301` instead of `404`). Sources were restored byte-for-byte.
- Complete suite: **83 cases**. Development (local-API mode): 66 run twice = **132 passes**, 34 skips by design. Production (simulated Edge mode): **all 83 pass**, with zero blocked server-side requests and no redirect-proxy failures. TypeScript, both lint gates and the optimized build pass.

Local evidence is in Git-excluded run `ticket-14.7ae8X4`. No staging, commit, push, deployment or live service call occurred.
