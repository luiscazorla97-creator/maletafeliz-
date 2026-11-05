import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
const plan = JSON.parse(readFileSync('editorial/plan.json', 'utf8'));
const published = readdirSync('content/articles')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync('content/articles/' + f, 'utf8')))
  .filter((a) => a.status === 'published');
const pathFor = (a: any) =>
  `/${a.locale}/${a.locale === 'es' ? 'guias' : 'guides'}/${a.slug}/`;
test.beforeEach(async ({ page }) => {
  for (const domain of [
    'bauval.org',
    'abscloud.org',
    'www.googletagmanager.com',
    'pagead2.googlesyndication.com',
  ])
    await page.route(`https://${domain}/**`, (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: '/* isolated provider mock: no impressions or analytics */',
      }),
    );
});
for (const countryId of ['it', 'jp', 'mx', 'us'])
  for (const locale of ['es', 'en']) {
    test(`country hub ${countryId}/${locale} connects every published guide and reciprocal language`, async ({
      page,
      request,
    }) => {
      const path = `/${locale}/${locale === 'es' ? 'explorar' : 'explore'}/country-${countryId}/`;
      const otherLocale = locale === 'es' ? 'en' : 'es';
      const other = `/${otherLocale}/${otherLocale === 'es' ? 'explorar' : 'explore'}/country-${countryId}/`;
      const available = published.filter(
        (a) =>
          a.locale === locale &&
          plan.find((t: any) => t.id === a.destinationId)?.countryId ===
            countryId,
      );
      expect(available.length).toBeGreaterThan(0);
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'index,follow,max-image-preview:large',
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://maletafeliz.com${path}`,
      );
      await expect(
        page.locator(`link[hreflang="${otherLocale}"]`),
      ).toHaveAttribute('href', `https://maletafeliz.com${other}`);
      for (const a of available)
        await expect(
          page.locator(`.country-hub a[href="${pathFor(a)}"]`),
        ).toHaveCount(1);
      expect(
        await page.locator('.country-city-groups section').count(),
      ).toBeGreaterThan(0);
      expect(
        await page
          .locator('.country-city-groups section')
          .evaluateAll((sections) =>
            sections.every((s) => s.querySelector('a')),
          ),
      ).toBe(true);
      const schema = JSON.parse(
        await page.locator('script[type="application/ld+json"]').innerText(),
      );
      const collection = schema['@graph'].find(
        (item: any) => item['@type'] === 'CollectionPage',
      );
      expect(collection.inLanguage).toBe(locale);
      expect(collection.mainEntity.numberOfItems).toBe(available.length);
      expect(
        collection.mainEntity.itemListElement
          .map((item: any) => item.item)
          .sort(),
      ).toEqual(
        available.map((a) => `https://maletafeliz.com${pathFor(a)}`).sort(),
      );
      const sitemap = await (await request.get('/sitemap.xml')).text();
      const entry = sitemap
        .split('<url>')
        .find((entry) =>
          entry.startsWith(`<loc>https://maletafeliz.com${path}</loc>`),
        );
      expect(entry).toContain(
        `hreflang="${otherLocale}" href="https://maletafeliz.com${other}"`,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator('.language').click();
      await expect(page).toHaveURL(other);
      await page.goto(pathFor(available[0]));
      await expect(page.locator(`.breadcrumbs a[href="${path}"]`)).toHaveCount(
        1,
      );
      await expect(
        page.locator(`.country-guide-link a[href="${path}"]`),
      ).toHaveCount(1);
      const articleSchema = JSON.parse(
        await page.locator('script[type="application/ld+json"]').innerText(),
      );
      const breadcrumb = articleSchema['@graph'].find(
        (item: any) => item['@type'] === 'BreadcrumbList',
      );
      expect(
        breadcrumb.itemListElement.map((item: any) => item.position),
      ).toEqual([1, 2, 3, 4]);
      expect(breadcrumb.itemListElement[1].item).toBe(
        `https://maletafeliz.com${path}`,
      );
    });
  }
