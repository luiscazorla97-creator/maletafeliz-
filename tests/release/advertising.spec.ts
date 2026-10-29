import { test, expect } from '@playwright/test';

test('banner preserves provider options and stays isolated on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  let requests = 0;
  await page.route('https://bauval.org/**', async (route) => {
    requests++;
    await route.fulfill({ contentType: 'application/javascript', body: `
      document.body.dataset.options = JSON.stringify(atOptions);
      try { parent.document.body.dataset.adEscaped = 'yes'; }
      catch { document.body.dataset.isolated = 'yes'; }
      document.body.append(document.createTextNode('Test advertisement'));
    ` });
  });
  await page.goto('/es/guias/5-lugares-que-visitar-en-quebec/');
  const banner = page.locator('.advertisement');
  await banner.scrollIntoViewIfNeeded();
  await expect(banner).toHaveCount(1);
  await expect(banner).toHaveAttribute('aria-label', 'Publicidad');
  const frame = page.frameLocator('iframe.advertisement-frame');
  await expect(frame.locator('body')).toHaveAttribute('data-isolated', 'yes');
  const options = JSON.parse(await frame.locator('body').getAttribute('data-options') || '{}');
  expect(options).toEqual({ key: 'c5a78736a50be383ac6b05853c770b4e', format: 'iframe', width: 300, height: 250, params: {} });
  expect(requests).toBe(1);
  expect(await page.locator('body').getAttribute('data-ad-escaped')).toBeNull();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.advertisement-viewport')).toHaveCSS('height', '220px');
});

test('English banner is labelled and editorial content survives a blocked provider', async ({ page }) => {
  await page.route('https://bauval.org/**', (route) => route.fulfill({ status: 403, body: '' }));
  await page.goto('/en/guides/5-places-to-visit-in-wellington/');
  await page.locator('.advertisement').scrollIntoViewIfNeeded();
  await expect(page.locator('.advertisement')).toHaveAttribute('aria-label', 'Advertisement');
  await expect(page.locator('#faq')).toBeAttached();
  await expect(page.locator('h1')).toContainText('Wellington');
});
