import { resolve } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const fixtureOrigin = 'http://127.0.0.1:3311';
// Match Next.js 14's dev hostname: mismatched loopback hosts trigger external rewrite loops.
const renderingOrigin = 'http://localhost:3310';
const runStamp = new Date().toISOString().replace(/[:.]/g, '-');
const artifactDirectory = `./test-results/baseline/${runStamp}`;
const obsoleteCdpConfiguration = process.env.BASELINE_LEGACY_CDP === '1';
const productionServer = process.env.BASELINE_PRODUCTION === '1';
// Synthetic, non-secret values. Production-mode runs must use a build created with the same
// values (see the local production-build runner) so native browser events are enabled.
// Production runs simulate XM Cloud Edge mode (both context IDs) against the loopback fixture;
// development runs use local-API mode. A client ID alone is an unsupported SDK configuration.
const syntheticServerContextId = productionServer ? 'local-fixture-server-context' : '';
const syntheticClientContextId = productionServer ? 'local-fixture-client-context' : '';
// Server-side Edge calls go to the loopback fixture; a preloaded guard refuses anything else.
const loopbackOnlyFetch = resolve('tests/fixtures/loopback-only-fetch.cjs');

export default defineConfig({
  testDir: './tests/baseline',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  outputDir: artifactDirectory,
  reporter: [['list'], ['json', { outputFile: `${artifactDirectory}/results.json` }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: renderingOrigin,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node tests/fixtures/sitecore-server.mjs',
      url: `${fixtureOrigin}/health`,
      reuseExistingServer: false,
      timeout: 30_000,
      stdout: 'pipe',
    },
    {
      command: productionServer
        ? 'npm exec -- next start --hostname localhost --port 3310'
        : 'npm run bootstrap && npm exec -- next dev --webpack --hostname localhost --port 3310',
      url: `${renderingOrigin}/healthz`,
      reuseExistingServer: false,
      timeout: 180_000,
      stdout: 'pipe',
      env: {
        NODE_ENV: productionServer ? 'production' : 'development',
        NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --require ${loopbackOnlyFetch}`.trim(),
        NEXT_TELEMETRY_DISABLED: '1',
        // npm's own update check is not application traffic; keep guard logs focused on the app.
        npm_config_update_notifier: 'false',
        PUBLIC_URL: renderingOrigin,
        NEXT_PUBLIC_DEFAULT_SITE_NAME: 'playwebsite',
        NEXT_PUBLIC_DEFAULT_LANGUAGE: 'en',
        NEXT_PUBLIC_SITECORE_API_HOST: fixtureOrigin,
        NEXT_PUBLIC_SITECORE_API_KEY: 'local-fixture-api-key',
        SITECORE_EDGE_CONTEXT_ID: syntheticServerContextId,
        NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID: syntheticClientContextId,
        NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME: fixtureOrigin,
        SITECORE_EDGE_PLATFORM_HOSTNAME: fixtureOrigin,
        SITECORE_EDITING_SECRET: 'local-fixture-editing-secret',
        GENERATE_STATIC_PATHS: 'false',
        NEXT_PUBLIC_CUSTOM_CDP_CLIENT_KEY: obsoleteCdpConfiguration ? 'local-obsolete-cdp-key' : '',
        NEXT_PUBLIC_CUSTOM_CDP_API_TARGET_ENDPOINT: obsoleteCdpConfiguration
          ? `${fixtureOrigin}/legacy-cdp/v1.2`
          : '',
        CUSTOM_CDP_API_TOKEN: '',
        CUSTOM_CDP_AUTHENTICATED_API_TARGET_ENDPOINT: '',
        NEXT_PUBLIC_SEARCH_ENV: '',
        NEXT_PUBLIC_SEARCH_CUSTOMER_KEY: '',
        NEXT_PUBLIC_SEARCH_API_KEY: '',
        NEXT_PUBLIC_DISCOVER_CUSTOMER_KEY: '',
        NEXT_PUBLIC_DISCOVER_API_KEY: '',
        NEXT_PUBLIC_ORDERCLOUD_BUYER_CLIENT_ID: '',
        NEXT_PUBLIC_ORDERCLOUD_BASE_API_URL: '',
        NEXT_PUBLIC_AUTH0_ENABLED: 'false',
        NEXT_PUBLIC_SEND_WEBSITE_ID: '',
      },
    },
  ],
});
