import scConfig from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { generateMetadata, extractFiles, writeImportMap } from '@sitecore-content-sdk/nextjs/tools';

/**
 * Offline build preparation for Storybook. Stories need the component and import maps but no
 * site information, so this omits `generateSites` (which requires a Context ID or local API).
 * Application builds keep using `sitecore.cli.config.ts`, which fails without API configuration.
 */
export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [generateMetadata(), extractFiles(), writeImportMap({ paths: ['src/components'] })],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: ['src/components/content-sdk/*'],
  },
});
