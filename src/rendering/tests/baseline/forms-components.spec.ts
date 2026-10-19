import { expect, test } from '@playwright/test';

test.beforeAll(async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
});

// No payment, Send, commerce or library service is reachable: only loopback traffic is allowed.
test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname)
      ? route.continue()
      : route.abort('blockedbyclient');
  });
});

test('visitors complete the simulated ticket journey from selection to confirmation', async ({
  page,
}) => {
  await page.goto('/tickets');
  await page.getByRole('link', { name: 'Get Tickets' }).nth(1).click();
  await expect(page).toHaveURL(/\/tickets\/registration\/attendee\?ticket=1$/);
  await expect(page.locator('.payment-progress-item.active')).toHaveText(/Personal Information/);
  await page.getByLabel('First Name', { exact: true }).fill('Demo');
  await page.getByLabel('Last Name', { exact: true }).fill('Visitor');
  await page.getByLabel('Email', { exact: true }).fill('demo.visitor@example.invalid');
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  await expect(page).toHaveURL(/\/tickets\/payment\?ticket=1$/);
  await expect(page.locator('.payment-progress-item.active')).toHaveText(/Payment Information/);
  await expect(page.locator('.order-summary')).toContainText('Regular Ticket');
  await expect(page.locator('.order-summary .total-line')).toContainText('$206.00');
  await page.getByRole('button', { name: 'Confirm Purchase', exact: true }).click();

  await expect(page).toHaveURL(/\/tickets\/payment\/confirmed\?ticket=1$/);
  await expect(page.getByRole('heading', { name: 'Payment Confirmed' })).toBeVisible();
  await expect(page.locator('.payment-progress-item.active')).toHaveText(/Payment Confirmation/);
});

test('registered BYOC components render and unavailable component services stay contained', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/native-components');
  await expect(page.getByRole('heading', { name: 'Native components', exact: true })).toBeVisible();
  // Custom BYOC "Countdown Timer": a future date shows the countdown, a past date the expiry message.
  await expect(page.locator('.coundown-timer').first()).toContainText('Days');
  await expect(page.getByRole('heading', { name: 'Early-bird offer ended' })).toBeVisible();
  // Unregistered BYOC and an unreachable FEaaS library leave the rest of the page usable.
  await expect(page.getByRole('heading', { name: 'After native components' })).toBeVisible();
  // Integration-only Send form stays hidden for visitors.
  await expect(page.getByText('Sitecore Send is not included in this XMC-only demo.')).toHaveCount(
    0
  );
  expect(errors).toEqual([]);
});

test('authors see the Send form notice and editable native components', async ({ page }) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000740',
    sc_lang: 'en',
    route: '/native-components',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(
    page.getByText('Sitecore Send is not included in this XMC-only demo.')
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Early-bird offer ended' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'After native components' })).toBeVisible();
});
