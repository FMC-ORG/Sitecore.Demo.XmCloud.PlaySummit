import { expect, test } from '@playwright/test';

// Compile the dev catch-all before the SDK creates its short-lived preview cookie.
// This is HTTP warm-up, not an application override of SDK mode/security.
test.beforeAll(async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
});

// Match the approved rendering-host seam; never call excluded/live services.
test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['127.0.0.1', 'localhost'].includes(url.hostname)
      ? route.continue()
      : route.abort('blockedbyclient');
  });
});

test('marketing banners expose meaningful image descriptions and loaded artwork', async ({
  page,
}) => {
  await page.goto('/marketing');
  await expect(page.getByRole('img', { name: 'Meet the community', exact: true })).toHaveJSProperty(
    'naturalWidth',
    120
  );
  await expect(page.getByRole('img', { name: 'Experience PLAY', exact: true })).toHaveJSProperty(
    'naturalWidth',
    120
  );
});

test('authors can edit an empty marketing hero image field', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/marketing-empty');
  await expect(
    page.getByText('Hero image is missing from the datasource', { exact: true })
  ).toBeVisible();
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000140',
    sc_lang: 'en',
    route: '/marketing-empty',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(
    page
      .locator('code[chrometype="field"][kind="open"]')
      .filter({ hasText: '00000000-0000-0000-0000-000000000900' })
  ).toHaveCount(1);
});

test('authors can edit an empty section call-to-action field', async ({ page }) => {
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000140',
    sc_lang: 'en',
    route: '/marketing-empty',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(
    page
      .locator('code[chrometype="field"][kind="open"]')
      .filter({ hasText: '00000000-0000-0000-0000-000000000901' })
  ).toHaveCount(1);
});

test('marketing content and nested calls to action lead to the retained session journey', async ({
  page,
}) => {
  const legacyRequests: string[] = [];
  page.on('request', (request) => {
    if (/boxever|legacy-cdp|ipapi|ipinfo|sendcloud|discover\.sitecore/i.test(request.url()))
      legacyRequests.push(request.url());
  });
  await page.goto('/marketing');
  await expect(page.getByRole('heading', { name: 'RAISE YOUR GAME', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why PLAY?', exact: true })).toBeVisible();
  await expect(page.getByText('This summit brings us together.', { exact: true })).toBeVisible();
  await expect(page.getByText('Welcome to PLAY! Summit', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Access every moment/ })).toHaveAttribute(
    'href',
    '/sessions'
  );
  await page.getByRole('link', { name: 'Explore the programme', exact: true }).click();
  await expect(page.getByRole('link', { name: /Fuel For Life: Nutrition 101/ })).toBeVisible();
  expect(legacyRequests).toEqual([]);
});

test('a featured marketing event tolerates missing optional speaker and premium fields', async ({
  page,
}) => {
  await page.goto('/marketing-missing-references');
  await expect(
    page.getByRole('heading', { name: 'Featured community session', exact: true })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Book Tickets', exact: true })).toHaveAttribute(
    'href',
    '/tickets'
  );
});

test('three-column and featured-event marketing compositions retain their content', async ({
  page,
}) => {
  await page.goto('/marketing-variants');
  await expect(
    page.getByRole('heading', { name: 'Choose your summit', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'One community, three experiences', exact: true })
  ).toBeVisible();
  for (const name of ['Explore Learn', 'Explore Connect', 'Explore Play']) {
    await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute(
      'href',
      '/sessions'
    );
  }
  await expect(page.getByText('Demo Speaker')).toBeVisible();
  await expect(page.getByText('Coach', { exact: true })).toBeVisible();
});

test('the marketing visual composition retains its pre-native layout', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/marketing');
  await expect(page.getByText('Welcome to PLAY! Summit', { exact: true })).toBeVisible();
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((image) => image.decode().catch((): void => {}))
    );
    await document.fonts.ready;
  });
  // Exclude Next's development toolbar, not any CMS or application styling.
  await page.addStyleTag({ content: 'nextjs-portal { visibility: hidden !important; }' });
  await expect(page.getByRole('main')).toHaveScreenshot('marketing-composition.png', {
    animations: 'disabled',
  });
});
