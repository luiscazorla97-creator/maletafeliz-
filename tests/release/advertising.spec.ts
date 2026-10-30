import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';

const headersFile = readFileSync('public/_headers', 'utf8');
// Astro preview does not apply Cloudflare's _headers. Render with the actual
// matching production policies, so a CSP regression fails these browser tests.
test.beforeEach(async ({ page }) => {
  await page.route('https://bauval.org/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* no real ad impressions in tests */' }));
  await page.route('http://127.0.0.1:4322/**', async route => {
    const response = await route.fetch();
    const path = new URL(route.request().url()).pathname;
    const policies = headersFile.split(/\n\s*\n/).flatMap(block => {
      const [pattern, ...lines] = block.trim().split('\n');
      const matches = pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : path === pattern;
      return matches ? lines.filter(line => line.trim().startsWith('Content-Security-Policy:')).map(line => line.split('Content-Security-Policy:')[1].trim()) : [];
    });
    await route.fulfill({ response, headers: { ...response.headers(), ...(policies.length ? { 'content-security-policy': policies.join(', ') } : {}) } });
  });
});

test('previous sandbox wrapper prevents provider storage access', async ({ page }) => {
  await page.goto('/es/');
  await page.evaluate(() => {
    const frame = document.createElement('iframe');
    frame.id = 'previous-wrapper';
    frame.sandbox.add('allow-scripts', 'allow-popups', 'allow-popups-to-escape-sandbox');
    frame.srcdoc = `<body><script>try { localStorage.getItem('probe'); } catch (error) { document.body.dataset.error = error.name; }<\/script></body>`;
    document.body.append(frame);
  });
  await expect(page.frameLocator('#previous-wrapper').locator('body')).toHaveAttribute('data-error', 'SecurityError');
});

test('direct provider tag keeps page context, storage, order and following content', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  let requests = 0;
  await page.route('https://ads.example.test/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect width="300" height="250" fill="orange"/></svg>' }));
  await page.route('https://bauval.org/**', async route => {
    requests++;
    await new Promise(resolve => setTimeout(resolve, 150));
    await route.fulfill({ contentType: 'application/javascript', body: `
      document.body.dataset.options = JSON.stringify(atOptions);
      document.body.dataset.pageContext = String(window === top);
      localStorage.setItem('banner-regression', 'ok');
      sessionStorage.setItem('banner-regression', 'ok');
      document.body.dataset.storage = localStorage.getItem('banner-regression') + sessionStorage.getItem('banner-regression');
      localStorage.removeItem('banner-regression'); sessionStorage.removeItem('banner-regression');
      document.write('<iframe title="Provider banner" width="300" height="250" srcdoc="<img src=https://ads.example.test/banner.svg width=300 height=250>"></iframe>');
    ` });
  });
  await page.goto('/es/guias/5-lugares-que-visitar-en-quebec/');
  await expect(page.locator('.advertisement')).toHaveCount(1);
  await expect(page.locator('.advertisement')).toHaveAttribute('aria-label', 'Publicidad');
  await expect(page.locator('body')).toHaveAttribute('data-page-context', 'true');
  await expect(page.locator('body')).toHaveAttribute('data-storage', 'okok');
  expect(JSON.parse(await page.locator('body').getAttribute('data-options') || '{}')).toEqual({ key: 'c5a78736a50be383ac6b05853c770b4e', format: 'iframe', width: 300, height: 250, params: {} });
  expect(requests).toBe(1);
  await expect(page.locator('iframe.advertisement-frame, iframe[sandbox]')).toHaveCount(0);
  const providerFrame = page.locator('.advertisement-slot > iframe');
  await expect(providerFrame).toHaveCount(1);
  await expect(page.frameLocator('iframe[title="Provider banner"]').locator('img')).toBeVisible();
  await expect.poll(() => page.frameLocator('iframe[title="Provider banner"]').locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(300);
  await expect(page.locator('h1')).toContainText('Québec');
  await expect(page.locator('#faq')).toBeAttached();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.advertisement-viewport')).toHaveCSS('height', '220px');
});

test('English guide survives a blocked provider without losing editorial content', async ({ page }) => {
  await page.route('https://bauval.org/**', route => route.fulfill({ status: 403, body: '' }));
  await page.goto('/en/guides/5-places-to-visit-in-wellington/');
  await expect(page.locator('.advertisement')).toHaveAttribute('aria-label', 'Advertisement');
  await expect(page.locator('#faq')).toBeAttached();
  await expect(page.locator('h1')).toContainText('Wellington');
});


test('every built content page has one direct ad and every legal page has none', async () => {
  const files = readdirSync('dist', { recursive: true }).map(String).filter(path => path.endsWith('.html'));
  let excluded = 0;
  let advertised = 0;
  for (const path of files) {
    const legal = /^(es\/informacion|en\/information)\/(privacy|terms|cookies|photography)\/index\.html$/.test(path);
    const noAd = legal || path === '404.html';
    const html = readFileSync(`dist/${path}`, 'utf8');
    expect((html.match(/src="https:\/\/bauval\.org\//g) || []).length, path).toBe(noAd ? 0 : 1);
    expect(html.includes('/ads/banner'), path).toBe(false);
    if (noAd) excluded++; else advertised++;
  }
  expect(excluded).toBe(9);
  expect(advertised).toBeGreaterThan(100);
});

test('banners load on discovery pages while legal pages make no advertising requests', async ({ page }) => {
  let requested = 0;
  await page.route('https://bauval.org/**', route => {
    requested++;
    return route.fulfill({ contentType: 'application/javascript', body: 'document.body.dataset.adLoaded = "yes";' });
  });
  for (const path of ['/', '/es/', '/en/', '/es/destinos/', '/en/explore/category-culture/', '/es/buscar/', '/en/information/about/', '/es/informacion/contact/']) {
    const before = requested;
    await page.goto(path);
    await expect(page.locator('.advertisement')).toHaveCount(1);
    await expect(page.locator('body')).toHaveAttribute('data-ad-loaded', 'yes');
    expect(requested - before, path).toBe(1);
  }
  for (const lang of ['es', 'en']) {
    for (const id of ['privacy', 'terms', 'cookies', 'photography']) {
      const before = requested;
      const response = await page.goto(`/${lang}/${lang === 'es' ? 'informacion' : 'information'}/${id}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('.advertisement')).toHaveCount(0);
      expect(requested, id).toBe(before);
    }
  }
});
