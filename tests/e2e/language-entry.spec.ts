import { test, expect } from '@playwright/test';

const providers = /https:\/\/(pagead2\.googlesyndication\.com|www\.googletagmanager\.com|bauval\.org|abscloud\.org)\//;

for (const [locale, target] of [['en-US', 'en'], ['es-AR', 'es'], ['fr-FR', 'es']]) {
  test(`entry opens ${target} for ${locale} without a chooser`, async ({ browser }) => {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    await page.route(providers, r => r.abort());
    await page.goto('/?utm_source=entry-test#main');
    await expect(page).toHaveURL(`/${target}/?utm_source=entry-test#main`);
    await expect(page.locator('html')).toHaveAttribute('lang', target);
    await expect(page.locator('.language-welcome')).toHaveCount(0);
    await expect(page.locator('.explorer-hero')).toBeVisible();
    await context.close();
  });
}

test('manual language choice persists and direct localized links keep their language', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.route(providers, r => r.abort());
  await page.goto('/');
  await expect(page).toHaveURL('/en/');
  await page.locator('.language').click();
  await expect(page).toHaveURL('/es/');
  await page.goto('/');
  await expect(page).toHaveURL('/es/');
  await page.goto('/en/explore/europe/');
  await expect(page).toHaveURL('/en/explore/europe/');
  await expect(page.locator('h1')).toHaveText('Europe');
  await context.close();
});

test('browser language detection works when local storage is unavailable', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-GB' });
  await context.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Unavailable'); } }));
  const page = await context.newPage();
  await page.route(providers, r => r.abort());
  await page.goto('/');
  await expect(page).toHaveURL('/en/');
  await expect(page.locator('h1')).toContainText('awaits you');
  await context.close();
});

test('without JavaScript the entry shows a complete homepage', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.language-welcome')).toHaveCount(0);
  await expect(page.locator('h1')).toContainText('El mundo');
  await expect(page.locator('.explorer-search')).toBeVisible();
  await context.close();
});

test('navy header, readable active links and mobile navigation on internal pages', async ({ page }, info) => {
  await page.route(providers, r => r.abort());
  for (const path of ['/es/', '/en/explore/europe/', '/es/guias/10-lugares-que-conocer-en-lisboa/', '/en/information/privacy/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(3, 23, 39)');
    await expect(page.locator('.site-header')).toHaveCSS('color', 'rgb(255, 255, 255)');
    if (info.project.name === 'mobile') {
      await page.locator('.mobile-menu summary').click();
      await expect(page.locator('.mobile-menu nav')).toBeVisible();
      await expect(page.locator('.mobile-menu nav')).toHaveCSS('background-color', 'rgb(6, 33, 51)');
      await page.locator('.mobile-menu summary').click();
    }
  }
  await page.goto('/en/explore/europe/');
  await expect(page.locator('.desktop-nav a[aria-current]')).toHaveCSS('color', 'rgb(119, 234, 242)');
});
