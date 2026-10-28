import { test, expect } from '@playwright/test';
test('localized home, logo, real navigation and no overflow', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/es/');
  await expect(page.locator('h1')).toContainText('El mundo es grande');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://maletafeliz.com/es/',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  await expect(page.locator('.featured-grid .destination-card')).toHaveCount(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  if (testInfo.project.name === 'mobile') {
    await page.locator('.mobile-menu summary').click();
    await expect(page.locator('.mobile-menu nav')).toBeVisible();
    await page.locator('.mobile-menu summary').click();
  }
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.locator('.language').click();
  await expect(page).toHaveURL('/en/');
  await expect(page.locator('h1')).toContainText('A big, beautiful world');
  expect(errors).toEqual([]);
});
test('search respects active language and filters', async ({ page }) => {
  await page.goto('/es/buscar/?q=paris');
  await expect(page.locator('.search-result')).toHaveCount(1);
  await expect(page.locator('.search-result h2')).toHaveText('París');
  await page.getByRole('button', { name: 'Asia', exact: true }).click();
  await expect(page.locator('.empty-state')).toContainText('No encontramos');
  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();
  await expect(page.locator('.search-result')).toHaveCount(20);
  await page.locator('#search-query').fill('japon');
  await expect(page.locator('.search-result')).toHaveCount(2);
  await page.goto('/en/search/?q=japan');
  await expect(page.locator('.search-result')).toHaveCount(2);
  await expect(page.locator('.search-result').first()).toContainText(
    'Research in progress',
  );
});
test('destination language switch preserves destination and reciprocal hreflang', async ({
  page,
}) => {
  await page.goto('/es/destinos/tokyo/');
  await expect(page.locator('h1')).toHaveText('Tokio');
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    'https://maletafeliz.com/en/destinations/tokyo/',
  );
  await page.locator('.language').click();
  await expect(page).toHaveURL('/en/destinations/tokyo/');
  await expect(page.locator('h1')).toHaveText('Tokyo');
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    'href',
    'https://maletafeliz.com/es/destinos/tokyo/',
  );
  await expect(page.locator('.notice')).toContainText('has not been published');
});
test('missing routes return 404 and drafts are excluded from sitemap', async ({
  request,
}) => {
  expect((await request.get('/es/guias/does-not-exist/')).status()).toBe(404);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain('<url>');
  expect(await (await request.get('/robots.txt')).text()).toContain(
    'Disallow: /',
  );
});
test('Spanish and English pages link to working local routes', async ({
  page,
  request,
}) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/`);
    const paths = await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => [
        ...new Set(nodes.map((n) => n.getAttribute('href')!)),
      ]);
    for (const path of paths) {
      const result = await request.get(path);
      expect(result.status(), path).toBe(200);
    }
  }
});
