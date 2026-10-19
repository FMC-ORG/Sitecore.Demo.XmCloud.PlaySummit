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

test('empty search results can be cleared without changing the public CMS route', async ({
  page,
}) => {
  await page.goto('/sessions');
  await page.getByPlaceholder('Search sessions...').fill('no-matching-session');
  await expect(page.getByRole('status')).toHaveText('0 sessions');
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('2 sessions');
  await expect(page).toHaveURL(/\/sessions$/);
});

test('missing multilist relations do not break session discovery', async ({ page }) => {
  await page.goto('/sessions-missing-relations');
  await expect(
    page.getByRole('link', { name: /Session without optional relations/ })
  ).toBeVisible();
});

test('session details retain CMP-shaped room/day data and metadata fields', async ({ page }) => {
  await page.goto('/sessions/fuel-for-life-nutrition-101');
  await expect(page.getByText('Summit Hall', { exact: true })).toBeVisible();
  await expect(page.getByText('Day 1', { exact: true })).toBeVisible();
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000012',
    sc_lang: 'en',
    route: '/sessions/fuel-for-life-nutrition-101',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  for (const id of [
    '00000000-0000-0000-0000-000000000970',
    '00000000-0000-0000-0000-000000000971',
  ]) {
    await expect(
      page.locator('code[chrometype="field"][kind="open"]').filter({ hasText: id })
    ).toHaveCount(1);
  }
});

test('related session speaker links hydrate without nested anchors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|hydrated|descendant/i.test(message.text()))
      errors.push(message.text());
  });
  await page.goto('/session-related');
  await expect(page.getByRole('link', { name: 'Elle Smith', exact: true })).toHaveCount(1);
  await expect(page.getByText('Summit Hall', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('session ordering uses CMS timeslots and can switch to session name', async ({ page }) => {
  await page.goto('/sessions');
  const cards = page.locator('.sessions-grid .grid-content > a');
  await expect(cards.first()).toContainText('Recovery and Resilience');
  await page.getByLabel('Sort sessions', { exact: true }).selectOption('name');
  await expect(cards.first()).toContainText('Fuel For Life: Nutrition 101');
});

test('session cards render the speaker role supplied by the saved integrated query', async ({
  page,
}) => {
  await page.goto('/sessions');
  await expect(page.getByText('Performance coach', { exact: true })).toBeVisible();
});

test('session cards retain numerically ordered integrated timeslots', async ({ page }) => {
  await page.goto('/sessions');
  await expect(page.getByText('9:00 am - 10:55 am', { exact: true })).toBeVisible();
});

test('visitors can filter CMS sessions and navigate to a matching detail', async ({ page }) => {
  await page.goto('/sessions');
  await page.getByPlaceholder('Search sessions...').fill('Recovery');
  await expect(page.getByRole('link', { name: /Fuel For Life: Nutrition 101/ })).toHaveCount(0);
  await page.getByRole('link', { name: /Recovery and Resilience/ }).click();
  await expect(
    page.getByText('Build a sustainable recovery practice.', { exact: true })
  ).toBeVisible();
});
