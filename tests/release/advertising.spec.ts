import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';

const headersFile = readFileSync('public/_headers', 'utf8');
const adsenseScript = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1382859681401211';
const analyticsScript = 'https://www.googletagmanager.com/gtag/js?id=G-RQKZL13K0Z';
// Avoid real advertising impressions and analytics events in all browser checks.
// Astro preview does not apply _headers; apply the matching production CSP here.
test.beforeEach(async ({ page }) => {
  await page.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* AdSense test stub */' }));
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* Analytics test stub: no collection */' }));
  await page.route('https://bauval.org/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* Adsterra test stub */' }));
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
test.afterEach(async ({ page }) => { await page.unrouteAll({ behavior: 'wait' }); });

test('all production pages require Analytics consent and preserve advertising exclusions', () => {
  const files = readdirSync('dist', { recursive: true }).map(String).filter(path => path.endsWith('.html'));
  let excluded = 0;
  for (const path of files) {
    const noAd = /^(es\/informacion|en\/information)\/(privacy|terms|cookies|photography)\/index\.html$/.test(path) || path === '404.html';
    const html = readFileSync(`dist/${path}`, 'utf8');
    expect(html.split(`src="${analyticsScript}"`).length - 1, path).toBe(0);
    expect(html.split('data-measurement-id="G-RQKZL13K0Z"').length - 1, path).toBe(1);
    expect(html, path).toContain('id="analytics-consent"');
    expect(html.split(`src="${adsenseScript}"`).length - 1, path).toBe(noAd ? 0 : 1);
    expect((html.match(/data-ad-placement="(top|bottom|left|right)"/g) || []).length, path).toBe(noAd ? 0 : 4);
    if (noAd) { expect(html, path).not.toContain('src="https://bauval.org/'); excluded++; }
  }
  expect(excluded).toBe(9);
});

test('saved Analytics permission initializes once per page under the production CSP', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('maletafeliz-analytics-consent', 'granted'));
  let requests = 0;
  const violations: string[] = [];
  page.on('console', message => { if (message.text().includes('Content Security Policy')) violations.push(message.text()); });
  await page.route('https://www.googletagmanager.com/**', route => {
    requests++;
    expect(route.request().url()).toBe(analyticsScript);
    return route.fulfill({ contentType: 'application/javascript', body: 'window.__analyticsMockLoaded = true;' });
  });
  for (const path of ['/', '/es/', '/en/', '/es/guias/que-ver-en-madrid-3-lugares/', '/en/information/privacy/', '/es/informacion/cookies/', '/404.html']) {
    const before = requests;
    await page.goto(path);
    await expect(page.locator('head script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
    await expect(page.locator('head script[src*="googletagmanager.com/gtag/js"]')).toHaveAttribute('async', '');
    expect(await page.evaluate(() => (window as any).dataLayer.map((args: any) => Array.from(args).slice(0, 2)).map((args: any) => args[0] === 'js' ? ['js'] : args))).toEqual([['consent', 'default'], ['js'], ['config', 'G-RQKZL13K0Z']]);
    expect(await page.evaluate(() => (window as any).__analyticsMockLoaded)).toBe(true);
    expect(requests - before).toBe(1);
  }
  expect(violations).toEqual([]);
});

test('AdSense verification remains present alongside Adsterra', async ({ page }) => {
  for (const path of ['/es/', '/en/guides/3-places-to-visit-in-melbourne/', '/es/destinos/', '/en/explore/category-culture/']) {
    await page.goto(path);
    await expect(page.locator('head script[src*="adsbygoogle.js"]')).toHaveCount(1);
    await expect(page.locator('head script[src*="adsbygoogle.js"]')).toHaveAttribute('crossorigin', 'anonymous');
    await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute('content', 'ca-pub-1382859681401211');
    await expect(page.locator('.advertisement:visible')).toHaveCount(2);
  }
});

test('banners load in their own slots without covering content or requesting hidden side ads', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('maletafeliz-analytics-consent', 'denied'));
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const banner = '<iframe data-test-banner title="Test advertisement" width="300" height="250" srcdoc="<body style=\'margin:0;background:#f5dbc5;display:grid;place-items:center;height:100vh;font:18px Arial\'>Publicidad · prueba</body>"></iframe>';
  await page.route('https://bauval.org/**', async route => {
    await route.fulfill({ contentType: 'application/javascript', body: `(() => {
      if (window.top !== window) throw Error('Provider sandboxed');
      localStorage.setItem('maletafeliz-ad-test', 'ok'); localStorage.removeItem('maletafeliz-ad-test');
      const slot = document.currentScript.closest('.advertisement');
      (window.__adCalls ||= []).push({position: slot.dataset.adPlacement, options: {...window.atOptions}});
      document.write(${JSON.stringify(banner)});
    })();` });
  });
  for (const width of [320, 390, 1440, 1919, 1920, 2560]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto('/es/guias/que-ver-en-madrid-3-lugares/');
    const count = width >= 1920 ? 4 : 2;
    await expect(page.locator('iframe[data-test-banner]')).toHaveCount(count);
    await expect(page.locator('.advertisement:visible')).toHaveCount(count);
    const calls = await page.evaluate(() => (window as any).__adCalls);
    expect(calls.map((c: any) => c.position)).toEqual(width >= 1920 ? ['left', 'top', 'bottom', 'right'] : ['top', 'bottom']);
    for (const call of calls) expect(call.options).toEqual({key:'c5a78736a50be383ac6b05853c770b4e',format:'iframe',height:250,width:300,params:{}});
    const geometry = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      return { overflow: document.documentElement.scrollWidth > window.innerWidth, topClear: box('#advertisement-top').bottom <= box('.article-header').top, bottomClear: box('#advertisement-bottom').top >= box('.prose').bottom, sidesClear: window.innerWidth < 1920 || (box('#advertisement-left').right <= box('main').left && box('#advertisement-right').left >= box('main').right) };
    });
    expect(geometry).toEqual({overflow:false,topClear:true,bottomClear:true,sidesClear:true});
    if (width === 390 || width === 1920) await page.screenshot({path:`test-results/ads-${testInfo.project.name}-${width}.png`});
    if (width >= 1920) {
      await page.locator('footer').scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.querySelector('#advertisement-left')!.getBoundingClientRect().bottom <= document.querySelector('footer')!.getBoundingClientRect().top)).toBe(true);
    }
  }
  await page.setViewportSize({width:1920, height:1000});
  await page.goto('/es/');
  await expect(page.locator('h1')).toContainText('El mundo es grande');
  await expect(page.locator('iframe[data-test-banner]')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({path:`test-results/ads-home-${testInfo.project.name}-1920.png`});
  expect(errors).toEqual([]);
});

test('failed advertising and Analytics scripts leave the complete guide usable', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('maletafeliz-analytics-consent', 'granted'));
  await page.route(/https:\/\/(pagead2\.googlesyndication\.com|www\.googletagmanager\.com|bauval\.org)\//, route => route.fulfill({ status: 403, body: '' }));
  await page.goto('/en/guides/3-places-to-visit-in-luxor/');
  await expect(page.locator('h1')).toContainText('Luxor');
  await expect(page.locator('#faq')).toBeAttached();
  await expect(page.locator('.prose figure img')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('legal pages and 404 have consent controls but make no advertising requests', async ({ page }) => {
  const requests: string[] = [];
  await page.route(/https:\/\/(pagead2\.googlesyndication\.com|bauval\.org)\//, route => { requests.push(route.request().url()); return route.abort(); });
  for (const lang of ['es', 'en']) for (const id of ['privacy', 'terms', 'cookies', 'photography']) {
    await page.goto(`/${lang}/${lang === 'es' ? 'informacion' : 'information'}/${id}/`);
    await expect(page.locator('script[src*="adsbygoogle.js"], .advertisement')).toHaveCount(0);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
    await expect(page.locator('#analytics-consent')).toBeVisible();
  }
  await page.goto('/404.html');
  await expect(page.locator('script[src*="adsbygoogle.js"], .advertisement')).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('ads.txt keeps the supplied Google publisher', async ({ request }) => {
  const response = await request.get('/ads.txt');
  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe('google.com, pub-1382859681401211, DIRECT, f08c47fec0942fa0');
});

test('Analytics is not requested until acceptance and remembers rejection across languages', async ({ page }) => {
  let requests = 0;
  await page.route('https://www.googletagmanager.com/**', route => { requests++; return route.fulfill({contentType:'application/javascript',body:'/* consent test */'}); });
  await page.goto('/es/');
  await expect(page.locator('#analytics-consent')).toBeVisible();
  await expect(page.locator('#google-analytics-tag')).toHaveCount(0);
  expect(requests).toBe(0);
  await page.getByRole('button', {name:'Rechazar',exact:true}).click();
  await expect(page.locator('#analytics-consent')).toBeHidden();
  await page.reload();
  await page.goto('/en/information/privacy/');
  await expect(page.locator('#analytics-consent')).toBeHidden();
  await expect(page.locator('#google-analytics-tag')).toHaveCount(0);
  expect(requests).toBe(0);
  await page.getByRole('button', {name:'Analytics preferences',exact:true}).click();
  await page.getByRole('button', {name:'Accept Analytics',exact:true}).click();
  await expect(page.locator('#analytics-consent')).toBeHidden();
  await expect(page.locator('#google-analytics-tag')).toHaveAttribute('src', analyticsScript);
  await expect.poll(() => requests).toBe(1);
  expect(await page.evaluate(() => localStorage.getItem('maletafeliz-analytics-consent'))).toBe('granted');
});

test('withdrawal stops Analytics after reload and removes accessible Analytics cookies', async ({ page, context }) => {
  let requests = 0;
  await page.route('https://www.googletagmanager.com/**', route => { requests++; return route.fulfill({contentType:'application/javascript',body:'/* consent test */'}); });
  await page.goto('/es/');
  await page.getByRole('button', {name:'Aceptar Analytics',exact:true}).click();
  await expect.poll(() => requests).toBe(1);
  await context.addCookies([{name:'_ga',value:'test',url:'http://127.0.0.1:4322/'},{name:'_ga_RQKZL13K0Z',value:'test',url:'http://127.0.0.1:4322/'}]);
  await page.getByRole('button', {name:'Preferencias de Analytics',exact:true}).click();
  await Promise.all([page.waitForEvent('load'),page.getByRole('button', {name:'Rechazar',exact:true}).click()]);
  await expect(page.locator('#google-analytics-tag')).toHaveCount(0);
  await expect(page.locator('#analytics-consent')).toBeHidden();
  expect(requests).toBe(1);
  expect((await context.cookies()).filter(c=>c.name.startsWith('_ga'))).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('maletafeliz-analytics-consent'))).toBe('denied');
  await page.goto('/en/');
  await expect(page.locator('#google-analytics-tag')).toHaveCount(0);
  expect(requests).toBe(1);
});

test('unavailable local storage never enables Analytics without an explicit choice', async ({ page }) => {
  let requests = 0;
  await page.route('https://www.googletagmanager.com/**', route => { requests++; return route.fulfill({contentType:'application/javascript',body:''}); });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); };
  });
  await page.goto('/es/');
  await expect(page.locator('#analytics-consent')).toBeVisible();
  await page.getByRole('button', {name:'Rechazar',exact:true}).click();
  await expect(page.locator('#analytics-consent')).toBeHidden();
  await page.reload();
  await expect(page.locator('#analytics-consent')).toBeVisible();
  expect(requests).toBe(0);
  await page.getByRole('button', {name:'Aceptar Analytics',exact:true}).click();
  await expect.poll(() => requests).toBe(1);
});
