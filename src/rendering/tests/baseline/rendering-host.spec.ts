import { expect, test } from '@playwright/test';

// Avoid spending the SDK's three-second preview-cookie lifetime on dev compilation.
test.beforeAll(async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
});

// Only the rendering host and the loopback Sitecore fixture may receive browser traffic.
test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['127.0.0.1', 'localhost'].includes(url.hostname)
      ? route.continue()
      : route.abort('blockedbyclient');
  });
});

test('the home page renders the summit content supplied by Sitecore', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'RAISE YOUR GAME' })).toBeVisible();
});

test('the home navigation exposes the sessions route from Sitecore', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Sessions', exact: true })).toHaveAttribute(
    'href',
    '/sessions'
  );
});

test('the CMS shell survives unavailable optional language context', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/shell-primitives');
  await expect(page.getByRole('combobox', { name: 'Language', exact: true })).toHaveValue('en');
  await expect(page.getByRole('link', { name: 'Session programme', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'PLAY! Summit footer logo' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('a deleted banner datasource does not break metadata editing', async ({ page }) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000055',
    sc_lang: 'en',
    route: '/primitive-missing',
    mode: 'edit',
  });
  const response = await page.goto(`/api/editing/render?${params}`);
  expect(response?.status()).toBe(200);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Primitive diagnostics' })).toBeVisible();
});

test('a deleted footer logo and empty link title do not break the CMS shell', async ({ page }) => {
  await page.goto('/shell-missing');
  await expect(page.getByRole('heading', { name: 'Shell primitives' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sessions', exact: true })).toBeVisible();
});

test('saved partial designs and nested layout slots retain CMS fields and links', async ({
  page,
}) => {
  await page.goto('/layout-primitives');
  await expect(page).toHaveTitle('CMS event context - Layout primitives');
  await expect(page.getByRole('link', { name: 'Nested title', exact: true })).toBeVisible();
  await expect(page.getByText('Nested rich text survives.', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Nested summit image' })).toHaveJSProperty(
    'naturalWidth',
    120
  );
  await expect(page.getByRole('link', { name: 'Explore sessions', exact: true })).toHaveAttribute(
    'href',
    '/sessions'
  );
  await expect(page.getByText('Route context body survives.', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('combobox', { name: 'Language', exact: true }).getByRole('option')
  ).toHaveCount(3);
});

test('metadata editing retains field identities across the shell and nested primitives', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000070',
    sc_lang: 'en',
    route: '/layout-primitives-edit',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(page.getByText('Nested title', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Nested summit image' })).toBeVisible();
  const fields = page.locator('code[chrometype="field"][kind="open"]');
  for (const fieldId of [801, 802, 803, 804, 805]) {
    await expect(
      fields.filter({ hasText: `00000000-0000-0000-0000-000000000${fieldId}` })
    ).toHaveCount(1);
  }
});

test('missing shell fields stay safe in normal delivery and metadata preview', async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/primitive-missing');
  await expect(page.getByRole('heading', { name: 'Primitive diagnostics' })).toBeVisible();
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000055',
    sc_lang: 'en',
    route: '/primitive-missing',
    mode: 'preview',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toHaveCount(0);
  await expect(page.getByRole('main')).toHaveClass('experience-editor-active');
  await expect(page.getByRole('heading', { name: 'Primitive diagnostics' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('an empty banner field remains safe and editable across page modes', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/empty-banner');
  await expect(page.getByRole('heading', { name: 'Primitive diagnostics' })).toBeVisible();
  for (const mode of ['edit', 'preview']) {
    const params = new URLSearchParams({
      secret: 'local-fixture-editing-secret',
      sc_site: 'playwebsite',
      sc_itemid: '00000000-0000-0000-0000-000000000075',
      sc_lang: 'en',
      route: '/empty-banner',
      mode,
    });
    await page.goto(`/api/editing/render?${params}`);
    await expect(page.getByRole('heading', { name: 'Primitive diagnostics' })).toBeVisible();
    if (mode === 'edit') {
      await expect(page.locator('.editing-mode')).toBeVisible();
      await expect(
        page
          .locator('code[chrometype="field"][kind="open"]')
          .filter({ hasText: '00000000-0000-0000-0000-000000000809' })
      ).toHaveCount(1);
    }
  }
});

test('main navigation remains usable when the logo item is deleted', async ({ page }) => {
  await page.goto('/main-navigation-missing');
  await expect(page.getByRole('link', { name: 'Book Tickets', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shell primitives' })).toBeVisible();
});

test('CMS navigation hides archived integration journeys', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Shop', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Account', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'CareConnect', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Legacy login', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Sessions', exact: true })).toBeVisible();
});

test('a visitor can navigate from the summit home to a session detail', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sessions', exact: true }).click();
  await page.getByRole('link', { name: /Fuel For Life: Nutrition 101/ }).click();
  await expect(
    page.getByText('Explore practical nutrition strategies for athletes.')
  ).toBeVisible();
});

test('an unknown CMS route returns the public not-found page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found', exact: true })).toBeVisible();
});

test('a missing component datasource does not prevent the rest of the page rendering', async ({
  page,
}) => {
  const response = await page.goto('/missing-datasource');
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole('heading', { name: 'Datasource diagnostics', exact: true })
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'This component has no datasource' })).toHaveCount(
    0
  );
});

test('integration-only widgets are hidden for visitors and explained to authors', async ({
  page,
}) => {
  await page.goto('/integration-widget');
  await expect(page.getByRole('main')).toHaveText('Integration diagnostics');
  const editingParams = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000033',
    sc_lang: 'en',
    route: '/integration-widget-edit',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${editingParams}`);
  await expect(
    page.getByText('Sitecore Search is not included in this XMC-only demo.', { exact: true })
  ).toBeVisible();
});

test('retained CMS forms and welcome content work without legacy guest services', async ({
  page,
}) => {
  await page.goto('/core-fallbacks');
  await expect(page.getByText('Welcome to PLAY! Summit', { exact: true })).toBeVisible();
  await page.getByLabel('First Name *', { exact: true }).fill('Demo');
  await page.getByLabel('Last Name *', { exact: true }).fill('Visitor');
  await page.getByLabel('Email *', { exact: true }).fill('demo.visitor@example.invalid');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByText(/Thank you for your request for information/)).toBeVisible();
});

test('retained CMS forms hydrate without server/client link mismatches', async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on('pageerror', (error) => {
    if (/hydration|hydrated/i.test(error.message)) hydrationErrors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|hydrated/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await page.goto('/core-fallbacks');
  await page.getByLabel('First Name *', { exact: true }).fill('Demo');
  expect(hydrationErrors).toEqual([]);
});

test('the simulated CMS payment form rejects an unknown ticket before confirmation', async ({
  page,
}) => {
  await page.goto('/tickets/payment?ticket=999');
  const [message] = await Promise.all([
    page.waitForEvent('dialog', { timeout: 5_000 }).then(async (dialog) => {
      const text = dialog.message();
      await dialog.accept();
      return text;
    }),
    page.getByRole('button', { name: 'Confirm Purchase', exact: true }).click(),
  ]);
  expect(message).toContain('Ticket information unavailable');
  await expect(page).toHaveURL(/\/tickets\/payment\?ticket=999$/);
});

test('the XMC host does not expose legacy CDP guest administration', async ({ request }) => {
  const response = await request.get('/api/cdp/getguests');
  expect(response.status()).toBe(404);
});

for (const endpoint of [
  '/api/auth/login',
  '/api/checkout/shippingrates',
  '/api/openid-connect/syncuser',
  '/api/ordercloud/init',
  '/api/private/me',
]) {
  test(`the XMC host does not expose the excluded endpoint ${endpoint}`, async ({ request }) => {
    const response = await request.get(endpoint, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  });
}

test('editor configuration rejects a request without the editing secret', async ({ request }) => {
  const response = await request.get('/api/editing/config');
  expect(response.status()).toBe(401);
});

test('metadata rendering rejects a request without the editing secret', async ({ request }) => {
  const response = await request.get('/api/editing/render');
  expect(response.status()).toBe(401);
});

test('metadata rendering rejects legacy POST requests', async ({ request }) => {
  const response = await request.post('/api/editing/render', {
    params: { secret: 'local-fixture-editing-secret' },
  });
  expect(response.status()).toBe(405);
  expect(response.headers().allow).toBe('GET');
});

test('the editor host advertises the migrated Content SDK package', async ({ request }) => {
  const response = await request.get('/api/editing/config', {
    params: { secret: 'local-fixture-editing-secret' },
  });
  expect(response.status()).toBe(200);
  expect((await response.json()).packages['@sitecore-content-sdk/nextjs']).toBe('2.4.1');
});

test('an authorized editor discovers metadata mode and the required CMS renderings', async ({
  request,
}) => {
  const response = await request.get('/api/editing/config', {
    params: { secret: 'local-fixture-editing-secret' },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(
    expect.objectContaining({
      editMode: 'metadata',
      components: expect.arrayContaining([
        'HeroSection',
        'MainNavigation',
        'SessionsGrid',
        'SessionInformation',
      ]),
    })
  );
});
