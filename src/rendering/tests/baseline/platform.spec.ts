import { expect, test } from '@playwright/test';

const fixture = 'http://127.0.0.1:3311';

test.beforeAll(async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
});

test.afterEach(async ({ request }) => {
  await request.delete(`${fixture}/__fixture/page-title`);
});

test('the health endpoint reports a healthy rendering host', async ({ request }) => {
  const response = await request.get('/healthz');
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe('Healthy');
});

test('robots.txt keeps the demo out of search indexes, with site robots still available', async ({
  request,
}) => {
  // As in the original JSS app, the static public/robots.txt takes precedence over the
  // /robots.txt -> /api/robots rewrite, so the demo opts out of indexing.
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toBe('User-agent: *\nDisallow: /');
  // The Content SDK site-settings robots route still works if the static file is removed.
  const siteRobots = await request.get('/api/robots');
  expect(siteRobots.status()).toBe(200);
  expect(await siteRobots.text()).toContain('Sitemap: http://localhost:3310/sitemap.xml');
});

test('the sitemap index and site sitemap are served as XML', async ({ request }) => {
  const index = await request.get('/sitemap.xml');
  expect(index.status()).toBe(200);
  expect(index.headers()['content-type']).toContain('text/xml');
  expect(await index.text()).toContain('<loc>http://localhost:3310/sitemap-1.xml</loc>');

  const sitemap = await request.get('/sitemap-1.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<loc>http://localhost:3310/sessions</loc>');
});

test('pages expose their title, indexing and Open Graph metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('PLAY! Summit - Home');
  // The demo deliberately asks search engines not to index it (unchanged from JSS).
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await page.goto('/sessions/fuel-for-life-nutrition-101');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Fuel For Life: Nutrition 101'
  );
});

test.describe('incremental static regeneration (production)', () => {
  test.skip(
    process.env.BASELINE_PRODUCTION !== '1',
    'Development renders every request; ISR applies to the production build.'
  );

  test('an unbuilt route renders fully on its first request (blocking fallback)', async ({
    request,
  }) => {
    const path = `/fallback-probe-${Date.now()}`;
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['x-nextjs-cache']).toBe('MISS');
    const html = await response.text();
    expect(html).toContain('fallback-probe content');
    expect(html).toContain('"isFallback":false');
  });

  test('cached pages revalidate within the five-second window', async ({ request }) => {
    const path = `/isr-probe-${Date.now()}`;
    const get = () => request.get(path);
    const titleOf = async () =>
      (await (await get()).text()).match(/<title[^>]*>([^<]*)<\/title>/)?.[1];

    expect((await get()).headers()['x-nextjs-cache']).toBe('MISS');
    const cached = await get();
    expect(cached.headers()['x-nextjs-cache']).toBe('HIT');
    expect(cached.headers()['cache-control']).toContain('s-maxage=5');
    expect((await cached.text()).match(/<title[^>]*>([^<]*)<\/title>/)?.[1]).toBe(
      'PLAY! Summit - Version 1'
    );

    await request.post(`${fixture}/__fixture/page-title`, { data: { path, title: 'Version 2' } });
    // Still inside the window: the cached render is served.
    expect(await titleOf()).toBe('PLAY! Summit - Version 1');
    // After the window, a request triggers regeneration and the new content follows.
    await new Promise((resolve) => setTimeout(resolve, 5_500));
    await expect
      .poll(titleOf, { timeout: 15_000, intervals: [500] })
      .toBe('PLAY! Summit - Version 2');
  });
});
