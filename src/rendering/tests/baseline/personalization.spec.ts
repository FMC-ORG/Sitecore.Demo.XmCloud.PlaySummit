import { APIRequestContext, BrowserContext, expect, test } from '@playwright/test';

// Embedded personalization runs in the proxy only with an Edge (server) Context ID, so these
// checks run against the production build in simulated Edge mode.
test.skip(
  process.env.BASELINE_PRODUCTION !== '1',
  'Personalization requires Edge mode, which the production harness simulates.'
);

const fixture = 'http://127.0.0.1:3311';
const page = '/embedded-personalization';
const defaultContent = 'Explore our sessions';
const campaignContent = 'Campaign offer: save your seat';
const campaignOnly = 'Campaign-only highlight';

type PersonalizeCall = {
  siteId: string;
  contextId: string;
  body: { friendlyId: string; browserId?: string; variants?: string[]; params?: unknown };
};

const personalizeCalls = async (request: APIRequestContext): Promise<PersonalizeCall[]> =>
  (await request.get(`${fixture}/__fixture/personalize-requests`)).json();

// The browser stays on loopback; Edge calls are made server-side by the proxy to the fixture.
const loopbackOnly = (context: BrowserContext) =>
  context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname)
      ? route.continue()
      : route.abort('blockedbyclient');
  });

test.beforeAll(async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
});

test.beforeEach(async ({ context, request }) => {
  await loopbackOnly(context);
  await request.delete(`${fixture}/__fixture/personalize-requests`);
});

test('a fresh visitor without a matching audience sees the default experience', async ({
  page: browserPage,
  request,
}) => {
  await browserPage.goto(page);
  await expect(browserPage.getByRole('heading', { name: defaultContent })).toBeVisible();
  await expect(browserPage.getByRole('heading', { name: campaignOnly })).toHaveCount(0);
  const [call] = await personalizeCalls(request);
  expect(call.body.friendlyId).toBe('embedded_68edf2febbdf4c05ab821f5a880e6b78_en');
  expect(call.siteId).toBe('playwebsite');
  expect(call.contextId).toBe('local-fixture-server-context');
  expect(call.body.browserId).toMatch(/^fixture-server-browser-/);
  expect(call.body.variants).toContain('ee12ae1fa982465598b5d270b963b1d6');
});

test('a campaign visitor sees the variant datasource and variant-only component', async ({
  page: browserPage,
}) => {
  await browserPage.goto(`${page}?utm_campaign=demoexample`);
  await expect(browserPage.getByRole('heading', { name: campaignContent })).toBeVisible();
  await expect(browserPage.getByRole('heading', { name: campaignOnly })).toBeVisible();
  await expect(browserPage.getByRole('heading', { name: defaultContent })).toHaveCount(0);
  await expect(browserPage.getByRole('heading', { name: 'Personalization example' })).toBeVisible();
});

test('a variant can hide a component', async ({ page: browserPage }) => {
  await browserPage.goto(`${page}?utm_campaign=sessions-fans`);
  await expect(browserPage.getByRole('heading', { name: 'Personalization example' })).toBeVisible();
  await expect(browserPage.getByRole('heading', { name: defaultContent })).toHaveCount(0);
  await expect(browserPage.getByRole('heading', { name: campaignContent })).toHaveCount(0);
});

test('separate visitors never receive each other’s cached variant', async ({ browser }) => {
  const visit = async (query: string) => {
    const context = await browser.newContext();
    await loopbackOnly(context);
    const tab = await context.newPage();
    await tab.goto(`${page}${query}`);
    const headings = await tab.getByRole('heading').allTextContents();
    await context.close();
    return headings;
  };
  // Interleave visitors so each cached render is requested right after the other variant.
  for (let round = 0; round < 2; round += 1) {
    expect(await visit('?utm_campaign=demoexample')).toContain(campaignContent);
    const fresh = await visit('');
    expect(fresh).toContain(defaultContent);
    expect(fresh).not.toContain(campaignContent);
    expect(fresh).not.toContain(campaignOnly);
  }
});

test('a returning visitor keeps one sandbox identity across requests', async ({
  context,
  page: browserPage,
  request,
}) => {
  await browserPage.goto(page);
  await browserPage.goto(`${page}?utm_campaign=demoexample`);
  await expect(browserPage.getByRole('heading', { name: campaignContent })).toBeVisible();
  const calls = await personalizeCalls(request);
  expect(calls).toHaveLength(2);
  expect(calls[1].body.browserId).toBe(calls[0].body.browserId);
  const cookies = await context.cookies();
  expect(cookies.some((cookie) => cookie.value === calls[0].body.browserId)).toBe(true);
});

test('slow or failing personalization falls back to the default experience', async ({
  page: browserPage,
  request,
}) => {
  for (const campaign of ['slow', 'fail']) {
    const started = Date.now();
    const response = await browserPage.goto(`${page}?utm_campaign=${campaign}`);
    expect(response?.status()).toBe(200);
    await expect(browserPage.getByRole('heading', { name: defaultContent })).toBeVisible();
    await expect(browserPage.getByRole('heading', { name: campaignOnly })).toHaveCount(0);
    // The 400 ms CDP timeout bounds the wait even though the slow upstream takes 1.5 s.
    expect(Date.now() - started).toBeLessThan(1_400);
  }
  expect((await personalizeCalls(request)).length).toBe(2);
});

test('editors preview a selected variant without visitor personalization calls', async ({
  page: browserPage,
  request,
}) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '68edf2fe-bbdf-4c05-ab82-1f5a880e6b78',
    sc_lang: 'en',
    route: page,
    mode: 'preview',
    sc_variant: 'ee12ae1fa982465598b5d270b963b1d6',
  });
  await browserPage.goto(`/api/editing/render?${params}`);
  await expect(browserPage.getByRole('heading', { name: campaignContent })).toBeVisible();
  await expect(browserPage.getByRole('heading', { name: campaignOnly })).toBeVisible();
  params.set('sc_variant', '');
  await browserPage.goto(`/api/editing/render?${params}`);
  await expect(browserPage.getByRole('heading', { name: defaultContent })).toBeVisible();
  await expect(browserPage.getByRole('heading', { name: campaignOnly })).toHaveCount(0);
  expect(await personalizeCalls(request)).toEqual([]);
});
