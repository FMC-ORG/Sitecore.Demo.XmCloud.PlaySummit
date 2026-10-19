import { expect, test } from '@playwright/test';

// Compile the dev catch-all before the SDK's short-lived editing preview data is created.
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

test('selected sponsors and featured vendors expose named, loaded logos', async ({ page }) => {
  await page.goto('/partners');
  await expect(page.getByRole('heading', { name: 'Featured vendors', exact: true })).toBeVisible();
  await expect(page.getByText('Gear up for the summit', { exact: true })).toBeVisible();
  const sponsorLogo = page
    .locator('.selected-sponsors-grid')
    .getByRole('img', { name: 'Demo Athletics' });
  await expect(sponsorLogo).toHaveJSProperty('naturalWidth', 120);
  const vendorLogo = page.locator('.section-light').getByRole('img', { name: 'Demo Gear' });
  await expect(vendorLogo).toHaveJSProperty('naturalWidth', 120);
  await page.locator('.selected-sponsors-grid').getByRole('link').click();
  await expect(page.getByRole('heading', { name: 'Demo Athletics' })).toBeVisible();
});

test('deleted selections, missing logos and empty sponsor details stay safe', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/partners-missing');
  await expect(page.getByText('Sponsor without logo', { exact: true })).toBeVisible();
  await expect(page.getByText('Vendor without logo', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured vendors' })).toHaveCount(0);
  await page.goto('/sponsors/incomplete');
  await expect(page.getByText('Sponsor history:', { exact: true })).toBeVisible();
  await expect(page.getByText('No sessions', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('authors can edit sponsor fields and see empty featured-vendor guidance', async ({ page }) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000370',
    sc_lang: 'en',
    route: '/sponsors/demo-athletics-edit',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(page.getByText('Missing Datasource Item', { exact: true })).toBeVisible();
  for (const id of ['990', '991']) {
    await expect(
      page
        .locator('code[chrometype="field"][kind="open"]')
        .filter({ hasText: `00000000-0000-0000-0000-000000000${id}` })
    ).toHaveCount(1);
  }
});

test('visitors follow a sponsor to its history, sessions and speakers', async ({ page }) => {
  await page.goto('/sponsors');
  await page.getByRole('link', { name: /Demo Athletics/ }).click();
  await expect(page.getByRole('heading', { name: 'Demo Athletics' })).toBeVisible();
  await expect(page.locator('.information-type')).toHaveText('premium');
  await expect(
    page.getByText('Demo Athletics has supported PLAY! since 2015.', { exact: true })
  ).toBeVisible();
  await expect(page.locator('.image-container img')).toHaveJSProperty('naturalWidth', 120);
  await page.getByRole('link', { name: 'Elle Smith', exact: true }).click();
  await expect(
    page.getByText('Elle helps athletes perform sustainably.', { exact: true })
  ).toBeVisible();
});

test('visitors follow a vendor to its history and related session', async ({ page }) => {
  await page.goto('/vendors');
  await page.getByRole('link', { name: /Demo Gear/ }).click();
  await expect(page.locator('.information-type')).toHaveText('gold');
  await expect(
    page.getByText('Demo Gear outfits every summit athlete.', { exact: true })
  ).toBeVisible();
  await page.getByRole('link', { name: 'More Information', exact: true }).click();
  await expect(
    page.getByText('Explore practical nutrition strategies for athletes.', { exact: true })
  ).toBeVisible();
});
