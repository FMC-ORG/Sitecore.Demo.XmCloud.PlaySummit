import { expect, Page, test } from '@playwright/test';
import { eventsOfType, simulateEdge } from './support/edge';

// Native browser events are disabled in development by design; production runs only.
test.skip(
  process.env.BASELINE_PRODUCTION !== '1',
  'Native browser events are disabled in development by design.'
);

const fillAttendee = async (page: Page) => {
  await page.getByLabel('First Name', { exact: true }).fill('Demo');
  await page.getByLabel('Last Name', { exact: true }).fill('Visitor');
  await page.getByLabel('Email', { exact: true }).fill('demo.visitor@example.invalid');
};

test('the simulated ticket journey records each native interaction event once', async ({
  context,
  page,
}) => {
  const edge = await simulateEdge(context);
  await page.goto('/tickets');
  await page.getByRole('link', { name: 'Get Tickets' }).nth(1).click();
  await expect(page).toHaveURL(/\/tickets\/registration\/attendee\?ticket=1$/);
  await fillAttendee(page);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/\/tickets\/payment\?ticket=1$/);
  await page.getByRole('button', { name: 'Confirm Purchase', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Payment Confirmed' })).toBeVisible();

  for (const type of [
    'TICKET_SELECTED',
    'IDENTITY',
    'ATTENDEE_FORM_COMPLETED',
    'PAYMENT_FORM_COMPLETED',
    'PAYMENT_SUCCESSFUL',
    'TICKET_PURCHASED',
  ]) {
    await expect.poll(() => eventsOfType(edge.events, type).length, { message: type }).toBe(1);
  }
  const identity = eventsOfType(edge.events, 'IDENTITY')[0].body;
  expect(JSON.stringify(identity)).toContain('demo.visitor@example.invalid');
  const purchase = eventsOfType(edge.events, 'TICKET_PURCHASED')[0].body;
  expect(JSON.stringify(purchase)).toContain('Regular Ticket');
});

test('a slow Edge upstream does not hold up the ticket journey', async ({ context, page }) => {
  await simulateEdge(context, { eventDelayMs: 15_000 });
  await page.goto('/tickets/registration/attendee?ticket=1');
  await fillAttendee(page);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/\/tickets\/payment\?ticket=1$/, { timeout: 3_000 });
  await page.getByRole('button', { name: 'Confirm Purchase', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Payment Confirmed' })).toBeVisible({
    timeout: 3_000,
  });
});

test('a slow Edge upstream does not hold up the request-information form', async ({
  context,
  page,
}) => {
  await simulateEdge(context, { eventDelayMs: 15_000 });
  await page.goto('/core-fallbacks');
  await page.getByLabel('First Name *', { exact: true }).fill('Demo');
  await page.getByLabel('Last Name *', { exact: true }).fill('Visitor');
  await page.getByLabel('Email *', { exact: true }).fill('demo.visitor@example.invalid');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByText(/Thank you for your request for information/)).toBeVisible({
    timeout: 3_000,
  });
});
