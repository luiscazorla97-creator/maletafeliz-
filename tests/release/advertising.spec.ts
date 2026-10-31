import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';

const headersFile = readFileSync('public/_headers', 'utf8');
const adsenseScript = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1382859681401211';
const nativeScript = 'https://bauval.org/21/baf26907b67b4fd5cdb22901aa38108e';
const nativeContainer = '#container-baf26907b67b4fd5cdb22901aa38108e';
const popunderScript = 'https://abscloud.org/1/7a7683e73ba102718744e3df1c9fbe35';
const analyticsScript = 'https://www.googletagmanager.com/gtag/js?id=G-RQKZL13K0Z';
// Avoid real advertising impressions and analytics events in all browser checks.
// Astro preview does not apply _headers; apply the matching production CSP here.
test.beforeEach(async ({ page }) => {
  await page.route('https://abscloud.org/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* Popunder test stub: no real windows */' }));
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
    expect(html.split(`src="${nativeScript}"`).length - 1, path).toBe(noAd ? 0 : 1);
    expect(html.split(`id="${nativeContainer.slice(1)}"`).length - 1, path).toBe(noAd ? 0 : 1);
    expect(html.split(popunderScript).length - 1, path).toBe(noAd ? 0 : 1);
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
    await expect(page.locator('.advertisement:visible')).toHaveCount(page.viewportSize()!.width >= 1440 ? 4 : 2);
  }
});

test('banners load in their own slots without covering content or requesting hidden side ads', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('maletafeliz-analytics-consent', 'denied'));
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/https:\/\/bauval\.org\/22\/(c5a78736a50be383ac6b05853c770b4e|1e5a2d407257849915d4433674f1978f|54722d11ca1374a1fe221435ad9001ac)$/, async route => {
    await route.fulfill({ contentType: 'application/javascript', body: `(() => {
      if (window.top !== window) throw Error('Provider sandboxed');
      localStorage.setItem('maletafeliz-ad-test', 'ok'); localStorage.removeItem('maletafeliz-ad-test');
      const slot = document.currentScript.closest('.advertisement');
      const options = {...window.atOptions};
      (window.__adCalls ||= []).push({position: slot.dataset.adPlacement, options, url: document.currentScript.src});
      const banner = document.createElement('iframe');
      banner.dataset.testBanner = '';
      banner.title = 'Test advertisement';
      banner.width = String(options.width); banner.height = String(options.height);
      banner.srcdoc = "<body style='margin:0;background:#f5dbc5;display:grid;place-items:center;height:100vh;font:18px Arial'>Publicidad · prueba<br>" + options.width + ' × ' + options.height + '</body>';
      document.write(banner.outerHTML);
    })();` });
  });
  await page.route(nativeScript, route => route.fulfill({ contentType: 'application/javascript', body: `(() => {
    const target = document.querySelector('${nativeContainer}');
    if (!target) throw Error('Native container not ready');
    target.dataset.nativeReady = 'true';
    const card = document.createElement('div');
    card.textContent = 'Publicidad nativa · prueba';
    card.style.cssText = 'background:#f5dbc5;padding:24px;min-height:140px;display:grid;place-items:center';
    target.append(card);
  })();` }));
  for (const width of [320, 390, 728, 759, 760, 1366, 1439, 1440, 1640, 1920, 2560]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto('/es/guias/que-ver-en-madrid-3-lugares/');
    const count = width >= 1440 ? 4 : 2;
    await expect(page.locator('iframe[data-test-banner]')).toHaveCount(count);
    await expect(page.locator('.advertisement:visible')).toHaveCount(count);
    await expect(page.locator(nativeContainer)).toHaveCount(1);
    await expect(page.locator(nativeContainer)).toHaveAttribute('data-native-ready', 'true');
    await expect(page.locator(`script[src="${nativeScript}"]`)).toHaveAttribute('async', '');
    await expect(page.locator(`script[src="${nativeScript}"]`)).toHaveAttribute('data-cfasync', 'false');
    expect(await page.locator('.native-advertisement iframe').count()).toBe(0);
    const nativeBox = await page.locator('.native-advertisement').boundingBox();
    const bottomBox = await page.locator('#advertisement-bottom').boundingBox();
    const footerBox = await page.locator('footer').boundingBox();
    expect(nativeBox!.y).toBeGreaterThanOrEqual(bottomBox!.y + bottomBox!.height);
    expect(nativeBox!.y + nativeBox!.height).toBeLessThanOrEqual(footerBox!.y);
    const calls = await page.evaluate(() => (window as any).__adCalls);
    expect(calls.map((c: any) => c.position)).toEqual(width >= 1440 ? ['left', 'top', 'bottom', 'right'] : ['top', 'bottom']);
    for (const call of calls) {
      const side = ['left', 'right'].includes(call.position);
      const expected = side
        ? {key:'1e5a2d407257849915d4433674f1978f',format:'iframe',height:600,width:160,params:{}}
        : call.position === 'top'
          ? {key:'54722d11ca1374a1fe221435ad9001ac',format:'iframe',height:90,width:728,params:{}}
          : {key:'c5a78736a50be383ac6b05853c770b4e',format:'iframe',height:250,width:300,params:{}};
      expect(call.options).toEqual(expected);
      expect(call.url).toBe(`https://bauval.org/22/${expected.key}`);
      const frame = page.locator(`#advertisement-${call.position} iframe[data-test-banner]`);
      await expect(frame).toHaveAttribute('width', String(expected.width));
      await expect(frame).toHaveAttribute('height', String(expected.height));
      if (side) {
        const bounds = await frame.boundingBox();
        expect(bounds!.width).toBe(160);
        expect(bounds!.height).toBe(600);
      }
      if (call.position === 'top') {
        const bounds = (await frame.boundingBox())!;
        const viewport = (await page.locator('#advertisement-top .advertisement-viewport').boundingBox())!;
        const main = (await page.locator('main').boundingBox())!;
        expect(bounds.width).toBeCloseTo(Math.min(728, width - 32), 1);
        expect(bounds.height / bounds.width).toBeCloseTo(90 / 728, 4);
        expect(bounds.width).toBeCloseTo(viewport.width, 1);
        expect(bounds.height).toBeCloseTo(viewport.height, 1);
        expect(bounds.x + bounds.width / 2).toBeCloseTo(main.x + main.width / 2, 1);
      }
    }
    const geometry = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      return { overflow: document.documentElement.scrollWidth > window.innerWidth, topClear: box('#advertisement-top').bottom <= box('.article-header').top, bottomClear: box('#advertisement-bottom').top >= box('.prose').bottom, sidesClear: window.innerWidth < 1440 || (box('#advertisement-left').right <= box('main').left && box('#advertisement-right').left >= box('main').right) };
    });
    expect(geometry).toEqual({overflow:false,topClear:true,bottomClear:true,sidesClear:true});
    if (width === 390 || width === 1440 || width === 1920) await page.screenshot({path:`test-results/ads-${testInfo.project.name}-${width}.png`});
    if (width >= 1440) {
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
  const callsBeforeResize = await page.evaluate(() => (window as any).__adCalls.length);
  await page.setViewportSize({width:390, height:844});
  await expect.poll(async () => Math.round((await page.locator('#advertisement-top iframe').boundingBox())!.width)).toBe(358);
  await page.setViewportSize({width:1920, height:1000});
  await expect.poll(async () => Math.round((await page.locator('#advertisement-top iframe').boundingBox())!.width)).toBe(728);
  expect(await page.evaluate(() => (window as any).__adCalls.length)).toBe(callsBeforeResize);
  await page.setViewportSize({width:1440, height:600});
  await page.goto('/es/');
  await expect(page.locator('iframe[data-test-banner]')).toHaveCount(4);
  await expect(page.locator('#advertisement-left')).toHaveCSS('position', 'static');
  await expect(page.locator('#advertisement-right')).toHaveCSS('position', 'static');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('failed advertising and Analytics scripts leave the complete guide usable', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('maletafeliz-analytics-consent', 'granted'));
  await page.route(/https:\/\/(pagead2\.googlesyndication\.com|www\.googletagmanager\.com|bauval\.org|abscloud\.org)\//, route => route.fulfill({ status: 403, body: '' }));
  await page.goto('/en/guides/3-places-to-visit-in-luxor/');
  await expect(page.locator('h1')).toContainText('Luxor');
  await expect(page.locator('#faq')).toBeAttached();
  await expect(page.locator('.prose figure img')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('legal pages and 404 have consent controls but make no advertising requests', async ({ page }) => {
  const requests: string[] = [];
  await page.route(/https:\/\/(pagead2\.googlesyndication\.com|bauval\.org|abscloud\.org)\//, route => { requests.push(route.request().url()); return route.abort(); });
  for (const lang of ['es', 'en']) for (const id of ['privacy', 'terms', 'cookies', 'photography']) {
    await page.goto(`/${lang}/${lang === 'es' ? 'informacion' : 'information'}/${id}/`);
    await expect(page.locator('script[src*="adsbygoogle.js"], .advertisement, .native-advertisement, #adsterra-popunder-script')).toHaveCount(0);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
    await expect(page.locator('#analytics-consent')).toBeVisible();
  }
  await page.goto('/404.html');
  await expect(page.locator('script[src*="adsbygoogle.js"], .advertisement, .native-advertisement, #adsterra-popunder-script')).toHaveCount(0);
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

test('popunder initializes once on trusted content interaction without cancelling navigation', async ({ page }) => {
  let requests = 0;
  const popups: string[] = [];
  page.on('popup', popup => popups.push(popup.url()));
  await page.route(popunderScript, route => { requests++; return route.fulfill({contentType:'application/javascript',body:'window.__popunderMockLoaded = true;'}); });
  await page.goto('/es/guias/que-ver-en-madrid-3-lugares/');
  expect(requests).toBe(0);
  await page.locator('h1').evaluate(node => (node as HTMLElement).click());
  expect(requests).toBe(0);
  await page.getByRole('button', {name:'Rechazar',exact:true}).click();
  expect(requests).toBe(0);
  await page.locator('h1').click();
  await expect.poll(() => requests).toBe(1);
  await expect(page.locator('#adsterra-popunder-script')).toHaveAttribute('src', popunderScript);
  await expect(page.locator('#adsterra-popunder-script')).toHaveAttribute('data-cfasync', 'false');
  await expect.poll(() => page.evaluate(() => (window as any).__popunderMockLoaded)).toBe(true);
  await page.locator('h1').click();
  expect(requests).toBe(1);
  await page.locator('.breadcrumbs a').last().click();
  await expect(page).toHaveURL('/es/destinos/madrid/');
  expect(popups).toEqual([]);
  await page.goto('/en/information/privacy/');
  await page.locator('h1').click();
  expect(requests).toBe(1);
  await expect(page.locator('#adsterra-popunder-script')).toHaveCount(0);
});
