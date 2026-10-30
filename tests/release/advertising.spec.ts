import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';

const headersFile = readFileSync('public/_headers', 'utf8');
// Astro preview does not apply Cloudflare's _headers. Render with the actual
// matching production policies, so a CSP regression fails these browser tests.
test.beforeEach(async ({ page }) => {
  await page.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* mock AdSense: no real ad impressions */' }));
  await page.route('https://bauval.org/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* no real ad impressions in tests */' }));
  await page.route('http://127.0.0.1:4322/**', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
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

test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'wait' });
});

const googleScript = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1382859681401211';

test('all built content pages include AdSense and no built page retains Adsterra', () => {
  const files = readdirSync('dist', { recursive: true }).map(String).filter(path => path.endsWith('.html'));
  let excluded = 0;
  for (const path of files) {
    const noAd = /^(es\/informacion|en\/information)\/(privacy|terms|cookies|photography)\/index\.html$/.test(path) || path === '404.html';
    const html = readFileSync(`dist/${path}`, 'utf8');
    expect(html, path).not.toContain('bauval.org');
    expect(html, path).not.toContain('atOptions');
    expect(html, path).not.toContain('advertisement-slot');
    expect(html.split(`src="${googleScript}"`).length - 1, path).toBe(noAd ? 0 : 1);
    if (noAd) excluded++;
  }
  expect(excluded).toBe(9);
});

test('AdSense loads once in the head with the supplied publisher and async attributes', async ({ page }) => {
  let requested = 0;
  let oldProviderRequests = 0;
  await page.route('https://bauval.org/**', route => { oldProviderRequests++; return route.abort(); });
  await page.route('https://pagead2.googlesyndication.com/**', route => {
    requested++;
    expect(route.request().url()).toBe(googleScript);
    return route.fulfill({ contentType: 'application/javascript', body: 'window.__adsenseMockLoaded = true;' });
  });
  for (const path of ['/', '/es/', '/en/', '/es/guias/que-ver-en-madrid-3-lugares/', '/en/guides/3-places-to-visit-in-melbourne/', '/es/destinos/', '/en/explore/category-culture/']) {
    const before = requested;
    await page.goto(path);
    await expect(page.locator('head script[src*="adsbygoogle.js"]')).toHaveCount(1);
    await expect(page.locator('head script[src*="adsbygoogle.js"]')).toHaveAttribute('async', '');
    await expect(page.locator('head script[src*="adsbygoogle.js"]')).toHaveAttribute('crossorigin', 'anonymous');
    await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute('content', 'ca-pub-1382859681401211');
    await expect.poll(() => requested - before).toBe(1);
    await expect(page.locator('.advertisement')).toHaveCount(0);
  }
  expect(oldProviderRequests).toBe(0);
});

test('a blocked Google script leaves the complete guide usable', async ({ page }) => {
  await page.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({ status: 403, body: '' }));
  await page.goto('/en/guides/3-places-to-visit-in-luxor/');
  await expect(page.locator('h1')).toContainText('Luxor');
  await expect(page.locator('#faq')).toBeAttached();
  await expect(page.locator('.prose figure img')).toHaveCount(3);
  await expect(page.locator('.advertisement')).toHaveCount(0);
});

test('legal pages and 404 make no Google or Adsterra advertising requests', async ({ page }) => {
  const requests: string[] = [];
  await page.route(/https:\/\/(pagead2\.googlesyndication\.com|bauval\.org)\//, route => { requests.push(route.request().url()); return route.abort(); });
  for (const lang of ['es', 'en']) for (const id of ['privacy', 'terms', 'cookies', 'photography']) {
    await page.goto(`/${lang}/${lang === 'es' ? 'informacion' : 'information'}/${id}/`);
    await expect(page.locator('script[src*="adsbygoogle.js"], .advertisement')).toHaveCount(0);
  }
  await page.goto('/404.html');
  await expect(page.locator('script[src*="adsbygoogle.js"], .advertisement')).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('ads.txt declares the same Google publisher without previous ad-network entries', async ({ request }) => {
  const response = await request.get('/ads.txt');
  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe('google.com, pub-1382859681401211, DIRECT, f08c47fec0942fa0');
});
