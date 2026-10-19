import { expect, Page, test } from '@playwright/test';
import { EdgeEvent, simulateEdge, syntheticContextId } from './support/edge';

// Native browser events are disabled in development by design (template behavior), so these
// checks run only against the optimized production build created with a synthetic client context.
test.skip(
  process.env.BASELINE_PRODUCTION !== '1',
  'Native browser events are disabled in development by design.'
);

const views = (events: EdgeEvent[]) => events.filter((e) => e.body.type === 'VIEW');
const settle = (page: Page) => page.waitForTimeout(1_500);

test('normal visitors send one native page view per page with fresh sandbox identity', async ({
  context,
  page,
}) => {
  const edge = await simulateEdge(context);
  await page.goto('/sessions');
  await expect.poll(() => views(edge.events).length).toBe(1);
  await page.getByRole('link', { name: /Fuel For Life: Nutrition 101/ }).click();
  await expect(
    page.getByText('Explore practical nutrition strategies for athletes.')
  ).toBeVisible();
  await expect.poll(() => views(edge.events).length).toBe(2);
  await settle(page);

  const [first, second] = views(edge.events);
  expect(views(edge.events)).toHaveLength(2);
  expect(first.url).toContain('siteId=playwebsite');
  expect(first.contextId).toBe(syntheticContextId);
  expect(first.body).toMatchObject({ page: 'sessions', language: 'en', channel: 'WEB' });
  expect(second.body).toMatchObject({ page: 'fuel-for-life-nutrition-101' });
  // One fresh sandbox identity, reused for the visit.
  expect(edge.clientIdRequests).toHaveLength(1);
  expect(first.body.browser_id).toBe('fixture-browser-1');
  expect(second.body.browser_id).toBe('fixture-browser-1');
});

test('metadata editing and preview never send visitor analytics', async ({ context, page }) => {
  const edge = await simulateEdge(context);
  for (const mode of ['edit', 'preview']) {
    const params = new URLSearchParams({
      secret: 'local-fixture-editing-secret',
      sc_site: 'playwebsite',
      sc_itemid: '00000000-0000-0000-0000-000000000055',
      sc_lang: 'en',
      route: '/primitive-missing',
      mode,
    });
    await page.goto(`/api/editing/render?${params}`);
    await expect(page.getByRole('heading', { name: 'Primitive diagnostics' })).toBeVisible();
  }
  await settle(page);
  expect(edge.events).toEqual([]);
  expect(edge.clientIdRequests).toEqual([]);
});

test('bot visitors are not counted as page views', async ({ browser }) => {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  });
  const edge = await simulateEdge(context);
  const page = await context.newPage();
  await page.goto('/sessions');
  await expect(page.getByRole('link', { name: /Fuel For Life/ })).toBeVisible();
  await settle(page);
  expect(views(edge.events)).toEqual([]);
  await context.close();
});

test('questionnaire choices send one audience event without waiting on a slow upstream', async ({
  context,
  page,
}) => {
  const edge = await simulateEdge(context, { eventDelayMs: 15_000 });
  await page.goto('/session-finder');
  await expect.poll(() => views(edge.events).length).toBe(1);
  await page.getByRole('button', { name: /Running/ }).click();
  // The visitor moves on promptly even though Edge has not answered yet.
  await expect(page.getByRole('heading', { name: 'Preferred session type' })).toBeVisible({
    timeout: 3_000,
  });
  await expect
    .poll(() => edge.events.filter((e) => e.body.type === 'AUDIENCE_PREFERENCE').length)
    .toBe(1);
  const audience = edge.events.find((e) => e.body.type === 'AUDIENCE_PREFERENCE');
  expect(JSON.stringify(audience?.body)).toContain('Weekend Warrior');
});

test('unavailable Edge services do not break pages or the questionnaire', async ({
  context,
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await simulateEdge(context, { failAll: true });
  await page.goto('/session-finder');
  await page.getByRole('button', { name: /Yoga/ }).click();
  await page.getByRole('button', { name: /Keynotes/ }).click();
  await expect(page.getByRole('heading', { name: 'Recommended sessions' })).toBeVisible();
  await expect(page.locator('.questionnaire-recommendations-grid > a').first()).toContainText(
    'Keynote for wellness'
  );
  expect(errors).toEqual([]);
});
