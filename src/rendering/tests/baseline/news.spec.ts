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

test('the news grid shows the four newest stories beside the social panel', async ({ page }) => {
  await page.goto('/news-media');
  const cards = page.locator('.news-grid .news-grid-item');
  await expect(cards).toHaveText([
    'Striva premiere',
    'New mountain bike park',
    'PLAY! Summit Goes Live',
    'Fitness app access',
  ]);
  const tweet = page.locator('.news-tweet');
  // Known intrinsic sizes of the retained public assets (371x309 and 60x60).
  await expect(tweet.locator('.tweet-img')).toHaveJSProperty('naturalWidth', 371);
  await expect(tweet.locator('.tweet-profile-pic')).toHaveJSProperty('naturalWidth', 60);
  await cards.first().getByRole('link').click();
  await expect(page).toHaveURL(/\/news\/striva-premiere$/);
});

test('empty collections, undated stories, missing images and unknown articles fail gracefully', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/news-empty');
  await expect(page.locator('.section-news-list')).toHaveCount(0);
  await expect(page.getByText('Undated story', { exact: true })).toBeVisible();
  await page.goto('/news/incomplete');
  await expect(page.getByRole('heading', { name: 'Story without image', level: 2 })).toBeVisible();
  const unknown = await page.goto('/news/not-a-published-story');
  expect(unknown?.status()).toBe(404);
  expect(errors).toEqual([]);
});

test('authors edit article fields and see guidance for an empty news list', async ({ page }) => {
  test.setTimeout(60_000);
  const params = new URLSearchParams({
    secret: 'local-fixture-editing-secret',
    sc_site: 'playwebsite',
    sc_itemid: '00000000-0000-0000-0000-000000000450',
    sc_lang: 'en',
    route: '/news/play-summit-goes-live-edit',
    mode: 'edit',
  });
  await page.goto(`/api/editing/render?${params}`);
  await expect(page.locator('.editing-mode')).toBeVisible();
  await expect(page.getByText('Missing Datasource Item', { exact: true })).toBeVisible();
  for (const id of ['960', '961', '962']) {
    await expect(
      page
        .locator('code[chrometype="field"][kind="open"]')
        .filter({ hasText: `00000000-0000-0000-0000-000000000${id}` })
    ).toHaveCount(1);
  }
});

test('visitors read a news listing and continue to the full article', async ({ page }) => {
  await page.goto('/news');
  const story = page.locator('.section-news-list .news').first();
  await expect(story.getByText('PLAY! Summit Goes Live', { exact: true })).toBeVisible();
  await expect(story.getByText('Wed, August 4, 2021', { exact: true })).toBeVisible();
  await expect(story.getByText('PLAY! Summit Goes Live excerpt.', { exact: true })).toBeVisible();
  await expect(
    story.getByRole('img', { name: 'PLAY! Summit Goes Live', exact: true })
  ).toHaveJSProperty('naturalWidth', 120);

  await story.getByRole('link', { name: 'Read More' }).click();
  await expect(
    page.getByRole('heading', { name: 'PLAY! Summit Goes Live', level: 2 })
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wed, August 4, 2021', level: 3 })).toBeVisible();
  await expect(
    page.getByText('The global gathering is officially live.', { exact: true })
  ).toBeVisible();
});
