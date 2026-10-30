import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
// Do not generate real ad impressions in automated content checks.
test.beforeEach(async ({ page }) => {
  await page.route('https://bauval.org/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '/* test: no ad request */' }),
  );
});
const articles = readdirSync('content/articles')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync('content/articles/' + f, 'utf8')))
  .filter((a) => a.status === 'published');
const pathFor = (a: any) =>
  `/${a.locale}/${a.locale === 'es' ? 'guias' : 'guides'}/${a.slug}/`;
test('production contains the complete bilingual launch and sitemap', async ({
  request,
}) => {
  expect(new Set(articles.map((a) => a.id)).size).toBeGreaterThanOrEqual(20);
  const spanishIds = articles
    .filter((a) => a.locale === 'es')
    .map((a) => a.id)
    .sort();
  const englishIds = articles
    .filter((a) => a.locale === 'en')
    .map((a) => a.id)
    .sort();
  expect(spanishIds.length).toBeGreaterThanOrEqual(20);
  expect(englishIds).toEqual(spanishIds);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const a of articles)
    expect(sitemap).toContain(`https://maletafeliz.com${pathFor(a)}`);
  expect(sitemap).not.toContain('/search/');
  expect(sitemap).not.toContain('/buscar/');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).not.toMatch(/Disallow: \/\s/);
});
for (const article of articles) {
  test(`${article.locale}: ${article.id} complete article and translation`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const response = await page.goto(pathFor(article));
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', article.locale);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(article.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index,follow,max-image-preview:large',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://maletafeliz.com${pathFor(article)}`,
    );
    expect(await page.locator('.prose').innerText()).toContain(
      article.sections[0].heading,
    );
    await expect(page.locator('.toc a').first()).toHaveAttribute(
      'href',
      '#' + article.sections[0].id,
    );
    const jsonLd = JSON.parse(
      await page.locator('script[type="application/ld+json"]').innerText(),
    );
    expect(jsonLd['@graph'][0].headline).toBe(article.title);
    expect(jsonLd['@graph'][0].inLanguage).toBe(article.locale);
    for (const place of article.sections.filter((s: any) => s.kind === 'place')) {
      await expect(
        page.locator(`.prose section[aria-labelledby="${place.id}"] figure img`),
      ).toHaveCount(1);
    }
    for (const image of await page
      .locator('.article-cover img,.prose figure img')
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const other = articles.find(
      (b) => b.id === article.id && b.locale !== article.locale,
    );
    expect(other).toBeTruthy();
    await expect(
      page.locator(`link[hreflang="${other.locale}"]`),
    ).toHaveAttribute('href', `https://maletafeliz.com${pathFor(other)}`);
    await page.locator('.language').click();
    await expect(page).toHaveURL(pathFor(other));
    await expect(page.locator('h1')).toHaveText(other.title);
    expect(errors).toEqual([]);
  });
}
test('production homepage uses real images, credits and published search results', async ({
  page,
}, info) => {
  await page.goto('/es/');
  await expect(page.locator('.preview-bar')).toHaveCount(0);
  await expect(page.locator('.hero-picture img')).toBeVisible();
  await expect(page.locator('.scenery')).toHaveCount(0);
  await expect(
    page.locator('footer a[href="/es/informacion/photography/"]'),
  ).toBeVisible();
  for (const photo of await page
    .locator('.hero-picture img, .card-image img')
    .all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `test-results/release-home-${info.project.name}.png`,
    fullPage: true,
  });
  await page.goto('/en/search/?q=tokyo');
  const tokyo = articles.find((a) => a.id === 'tokyo' && a.locale === 'en');
  const paris = articles.find((a) => a.id === 'paris' && a.locale === 'en');
  expect(tokyo).toBeTruthy();
  expect(paris).toBeTruthy();
  await expect(page.locator(`.search-result[href="${pathFor(paris)}"]`)).toHaveCount(0);
  const tokyoResult = page.locator(`.search-result[href="${pathFor(tokyo)}"]`);
  await expect(tokyoResult).toHaveCount(1);
  await tokyoResult.click();
  await expect(page.locator('h1')).toContainText('Tokyo');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index,follow,max-image-preview:large',
  );
});
