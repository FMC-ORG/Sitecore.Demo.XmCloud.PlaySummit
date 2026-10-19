import { expect, test } from '@playwright/test';

test.beforeAll(async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
});

// Native events cannot reach any live service: only loopback traffic is allowed.
test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname)
      ? route.continue()
      : route.abort('blockedbyclient');
  });
});

test('visitors answer the questionnaire and get matching session recommendations', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/session-finder');
  await expect(page.getByRole('heading', { name: 'Preferred sport' })).toBeVisible();
  await page.getByRole('button', { name: /Running/ }).click();
  await expect(page.getByRole('heading', { name: 'Preferred session type' })).toBeVisible();
  await page.getByRole('button', { name: /Workshops/ }).click();

  await expect(page.getByRole('heading', { name: 'Recommended sessions' })).toBeVisible();
  const results = page.locator('.questionnaire-recommendations-grid > a');
  await expect(results.first()).toContainText('Trail running workshop');
  await expect(results).toHaveCount(4);

  await page.getByRole('button', { name: 'Start over', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Preferred sport' })).toBeVisible();
  expect(errors).toEqual([]);
});
