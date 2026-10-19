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

test('missing speaker pictures, flags and relations stay safe for visitors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/speakers-missing');
  await expect(page.getByText('Speaker without picture', { exact: true })).toBeVisible();
  await page.goto('/speakers/incomplete');
  await expect(page.getByRole('heading', { name: 'Speaker without picture' })).toBeVisible();
  await expect(page.getByText('No sessions', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('authors can edit speaker hero and biography fields, including empty details', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000240',
    sc_lang: 'en',
    route: '/speakers/elle-smith-edit',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(page.getByText('Job Title:', { exact: true })).toBeVisible();
  for (const id of ['980', '981', '982']) {
    await expect(
      page
        .locator('code[chrometype="field"][kind="open"]')
        .filter({ hasText: `00000000-0000-0000-0000-000000000${id}` })
    ).toHaveCount(1);
  }
});

test('session details list related speakers with partial profiles safely', async ({ page }) => {
  await page.goto('/session-speakers');
  await expect(page.getByText('Speaker with partial profile', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Learn more', exact: true }).click();
  await expect(
    page.getByText('Elle helps athletes perform sustainably.', { exact: true })
  ).toBeVisible();
});

test('visitors browse featured speakers to a biography and related session', async ({ page }) => {
  await page.goto('/speakers');
  const featured = page.locator('.featured-speakers');
  await expect(featured.getByText('Elle Smith', { exact: true })).toBeVisible();
  await expect(featured.getByText('Demo Coach', { exact: true })).toHaveCount(0);
  const grid = page.locator('.speakers-grid');
  await expect(grid.getByText('Sam Runner', { exact: true })).toBeVisible();
  await expect(grid.getByText('Elle Smith', { exact: true })).toHaveCount(0);

  await featured.getByRole('link', { name: /Elle Smith/ }).click();
  await expect(
    page.getByText('Elle helps athletes perform sustainably.', { exact: true })
  ).toBeVisible();
  for (const detail of ['Performance director', 'PLAY! Labs', 'Montreal']) {
    await expect(page.getByText(detail, { exact: true })).toBeVisible();
  }
  await expect(page.locator('.image-container img')).toHaveJSProperty('naturalWidth', 120);

  await page.getByRole('link', { name: 'More Information', exact: true }).click();
  await expect(
    page.getByText('Explore practical nutrition strategies for athletes.', { exact: true })
  ).toBeVisible();
});
