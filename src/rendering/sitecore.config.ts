import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

export default defineConfig({
  defaultSite: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'playwebsite',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  // Preserve the existing on-demand Pages Router/ISR baseline.
  generateStaticPaths: false,
  redirects: { locales: ['en', 'fr-CA', 'ja-JP'] },
});
