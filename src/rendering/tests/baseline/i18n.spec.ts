import { expect, test } from '@playwright/test';

test.beforeAll(async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
});

test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname)
      ? route.continue()
      : route.abort('blockedbyclient');
  });
});

const languageSelect = 'Language';

test('French Canadian visitors get translated content and dictionary phrases', async ({ page }) => {
  const response = await page.goto('/fr-CA/i18n-shell');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr-CA');
  await expect(page).toHaveTitle('PLAY! Summit - Bienvenue');
  await expect(page.getByRole('heading', { name: 'Bienvenue au PLAY! Summit' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Réservez vos billets' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: languageSelect })).toHaveValue('fr-CA');
});

test('Japanese routes fall back to English content without claiming translations', async ({
  page,
}) => {
  const response = await page.goto('/ja-JP/i18n-shell');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja-JP');
  await expect(page.getByRole('heading', { name: 'Welcome to PLAY! Summit' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Book Tickets' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: languageSelect })).toHaveValue('ja-JP');
});

test('switching language keeps the CMS route and query values', async ({ page }) => {
  await page.goto('/i18n-shell?utm_campaign=demoexample&ref=header');
  await page.getByRole('combobox', { name: languageSelect }).selectOption('fr-CA');
  await expect(page).toHaveURL(/\/fr-CA\/i18n-shell\?utm_campaign=demoexample&ref=header$/);
  await expect(page.getByRole('heading', { name: 'Bienvenue au PLAY! Summit' })).toBeVisible();
  await page.getByRole('combobox', { name: languageSelect }).selectOption('en');
  await expect(page).toHaveURL(/\/i18n-shell\?utm_campaign=demoexample&ref=header$/);
  await expect(page).not.toHaveURL(/\/fr-CA\//);
  await expect(page.getByRole('heading', { name: 'Welcome to PLAY! Summit' })).toBeVisible();
});

test('unknown routes return the public 404 in every locale', async ({ page }) => {
  for (const path of ['/no-such-page', '/fr-CA/no-such-page', '/ja-JP/no-such-page']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found', exact: true })).toBeVisible();
  }
});

test('redirect map entries redirect, preserve language/query as configured and respect exclusions', async ({
  request,
}) => {
  // Redirects are disabled in development by SDK default (as the JSS middleware was).
  test.skip(process.env.BASELINE_PRODUCTION !== '1', 'Redirects run outside development only.');
  const permanent = await request.get('/old-sessions?ref=campaign', { maxRedirects: 0 });
  expect(permanent.status()).toBe(301);
  expect(new URL(permanent.headers().location, 'http://localhost').pathname).toBe('/sessions');
  expect(permanent.headers().location).toContain('ref=campaign');

  const french = await request.get('/fr-CA/old-sessions', { maxRedirects: 0 });
  expect(french.status()).toBe(301);
  expect(new URL(french.headers().location, 'http://localhost').pathname).toBe('/fr-CA/sessions');

  const temporary = await request.get('/summit-news?ref=campaign', { maxRedirects: 0 });
  expect(temporary.status()).toBe(302);
  expect(temporary.headers().location).not.toContain('ref=campaign');

  // Archived shop paths are excluded from Sitecore redirects and routing.
  const excluded = await request.get('/shop/old-sessions', { maxRedirects: 0 });
  expect(excluded.status()).toBe(404);
});

test('server-transfer redirects render the target without changing the URL', async ({ page }) => {
  // Redirects are disabled in development by SDK default (as the JSS middleware was).
  test.skip(process.env.BASELINE_PRODUCTION !== '1', 'Redirects run outside development only.');
  const response = await page.goto('/legacy-speakers');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/legacy-speakers$/);
  await expect(page.locator('.speakers-grid')).toContainText('Sam Runner');
});

test('editors render French Canadian content in metadata editing', async ({ page }) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000800',
    sc_lang: 'fr-CA',
    route: '/i18n-shell',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(page.getByText('Bienvenue au PLAY! Summit')).toBeVisible();
  await expect(
    page
      .locator('code[chrometype="field"][kind="open"]')
      .filter({ hasText: '00000000-0000-0000-0000-000000000890' })
  ).toHaveCount(1);
});
