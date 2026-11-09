import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Functional regressions only. These tests isolate third-party providers and
// must never be used as Lighthouse or real advertising performance measurements.
const photos = JSON.parse(readFileSync('content/images/manifest.json', 'utf8'));
const geometrySelectors = [
  '.site-header',
  '.header-inner',
  '.brand-logo-3d',
  '.explorer-hero',
  '.explorer-copy h1',
  '.travel-globe',
  'img.earth',
  '.continent-photo',
  '.featured-grid .destination-card',
];

async function isolateProviders(context: BrowserContext, origin: string) {
  await context.route('**/*', (route) =>
    new URL(route.request().url()).origin === origin
      ? route.continue()
      : route.fulfill({
          contentType:
            route.request().resourceType() === 'script'
              ? 'application/javascript'
              : 'text/plain',
          body: '/* isolated regression test: no ad impressions or analytics */',
        }),
  );
}

async function twoFrames(page: Page) {
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
}

async function geometry(page: Page) {
  return page.evaluate((selectors) => Object.fromEntries(selectors.map((selector) => {
    const element = document.querySelector(selector);
    if (!element) throw new Error('Missing layout landmark: ' + selector);
    const box = element.getBoundingClientRect();
    return [selector, { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height }];
  })), geometrySelectors);
}

function expectSameGeometry(
  before: Awaited<ReturnType<typeof geometry>>,
  after: Awaited<ReturnType<typeof geometry>>,
) {
  for (const selector of geometrySelectors) {
    for (const property of ['x', 'y', 'width', 'height'] as const) {
      expect(Math.abs(before[selector][property] - after[selector][property]), `${selector}: ${property}`).toBeLessThanOrEqual(0.5);
    }
  }
}

test('home reserves image and consent geometry while its images are delayed', async ({
  browser, baseURL, viewport, isMobile, hasTouch,
}) => {
  for (const lang of ['es', 'en']) {
    const context = await browser.newContext({ baseURL, viewport, isMobile, hasTouch, deviceScaleFactor: isMobile ? 1.75 : 1 });
    let releaseImages!: () => void;
    const imagesReady = new Promise<void>((resolve) => { releaseImages = resolve; });
    try {
      await isolateProviders(context, new URL(baseURL!).origin);
      await context.route('**/*', async (route) => {
        const kind = route.request().resourceType();
        if (kind === 'image' && new URL(route.request().url()).origin === new URL(baseURL!).origin) {
          await imagesReady;
        }
        return route.fallback();
      });
      await context.addInitScript(() => {
        const state = { shifts: [] as number[] };
        (window as any).__reservedLayoutTest = state;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!shift.hadRecentInput) state.shifts.push(shift.value);
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      const page = await context.newPage();
      expect((await page.goto(`/${lang}/`, { waitUntil: 'domcontentloaded' }))?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(3, 23, 39)');
      const headingSize = await page.locator('.explorer-copy h1').evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
      expect(headingSize).toBeGreaterThan(50);
      const header = await page.locator('.header-inner').boundingBox();
      expect(header!.height).toBeGreaterThanOrEqual(60);
      expect(header!.height).toBeLessThanOrEqual(100);
      const consent = page.locator('#analytics-consent');
      await expect(consent).toBeVisible();
      await expect(consent).toHaveCSS('position', 'fixed');
      await twoFrames(page);
      const before = await geometry(page);
      await page.evaluate(() => { (window as any).__reservedLayoutTest.shifts.length = 0; });

      releaseImages();
      for (const selector of ['img.earth', '.site-header .brand-logo-3d']) {
        await expect.poll(() => page.locator(selector).evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0), { timeout: 10000 }).toBe(true);
      }
      await twoFrames(page);
      expectSameGeometry(before, await geometry(page));
      const thumbnailStartGaps = await page.locator('.recent-list > a').evaluateAll((rows) => rows.map((row) => {
        const image = row.querySelector('img');
        if (!image) throw new Error('Recent story thumbnail missing');
        const style = getComputedStyle(row);
        return image.getBoundingClientRect().left - row.getBoundingClientRect().left
          - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.borderLeftWidth) || 0);
      }));
      for (const gap of thumbnailStartGaps) expect(Math.abs(gap), 'No empty flex item before the thumbnail').toBeLessThanOrEqual(0.5);
      const imageShifts = await page.evaluate(() => (window as any).__reservedLayoutTest.shifts as number[]);
      expect(imageShifts.reduce((sum, value) => sum + value, 0)).toBe(0);

      await consent.locator('[data-analytics-choice="denied"]').click();
      await expect(consent).toBeHidden();
      await twoFrames(page);
      expectSameGeometry(before, await geometry(page));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally {
      releaseImages();
      await context.unrouteAll({ behavior: 'wait' });
      await context.close();
    }
  }
});

test('home AVIF selection and WebP fallback preserve photographs, crop and credits in both languages', async ({
  browser, browserName, baseURL, viewport, isMobile, hasTouch,
}) => {
  test.skip(browserName !== 'chromium', 'The fallback check uses Chromium image-format emulation.');
  for (const lang of ['es', 'en']) {
    const snapshots: any[][] = [];
    for (const disableAvif of [false, true]) {
      const context = await browser.newContext({ baseURL, viewport, isMobile, hasTouch, deviceScaleFactor: isMobile ? 1.75 : 1 });
      try {
        await isolateProviders(context, new URL(baseURL!).origin);
        const page = await context.newPage();
        const cdp = await context.newCDPSession(page);
        await cdp.send('Emulation.setDisabledImageTypes', { imageTypes: disableAvif ? ['avif'] : [] });
        expect((await page.goto(`/${lang}/`))?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        const samples = [
          { selector: 'img.earth', container: '.travel-globe', credit: null },
          { selector: '.globe-card img', container: '.globe-card', credit: '.globe-credit' },
          { selector: '.continent-photo img', container: '.continent-photo', credit: '.continent-photo-credit' },
          { selector: '.featured-grid .destination-card img', container: '.destination-card', credit: '.card-credit' },
        ];
        const rows: any[] = [];
        for (const sample of samples) {
          const image = page.locator(sample.selector).first();
          await image.scrollIntoViewIfNeeded();
          await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0), { timeout: 10000 }).toBe(true);
          const data = await image.evaluate((node: HTMLImageElement, selector) => {
            const container = node.closest(selector)!;
            const box = node.getBoundingClientRect();
            const outer = container.getBoundingClientRect();
            return {
              src: node.getAttribute('src'), srcset: node.getAttribute('srcset'),
              currentSrc: node.currentSrc, alt: node.alt,
              width: node.getAttribute('width'), height: node.getAttribute('height'),
              imageWidth: box.width, imageHeight: box.height,
              containerWidth: outer.width, containerHeight: outer.height,
              objectFit: getComputedStyle(node).objectFit,
              avifSrcset: node.parentElement?.querySelector('source[type="image/avif"]')?.getAttribute('srcset'),
              creditText: container.textContent || '',
            };
          }, sample.container);
          expect(new URL(data.currentSrc).pathname).toMatch(disableAvif ? /\.webp$/ : /\.avif$/);
          if (sample.selector === 'img.earth') {
            const preload = page.locator('link[rel="preload"][as="image"][type="image/avif"]');
            await expect(preload).toHaveAttribute('imagesrcset', data.avifSrcset!);
            await expect(preload).toHaveAttribute('imagesizes', await image.getAttribute('sizes') || '');
            await expect(image).toHaveAttribute('fetchpriority', 'high');
            if (!disableAvif && isMobile) expect(new URL(data.currentSrc).pathname).toMatch(/earth-atlas-960\./);
          }
          expect(data.imageWidth).toBeGreaterThan(50);
          expect(data.imageHeight).toBeGreaterThan(50);
          expect(data.containerWidth).toBeGreaterThanOrEqual(data.imageWidth - 0.5);
          expect(data.containerHeight).toBeGreaterThanOrEqual(data.imageHeight - 0.5);
          expect(data.objectFit).toBe('cover');
          const candidates = disableAvif ? [data.src, ...(data.srcset || '').split(',').map((s) => s.trim().split(/\s+/)[0])] : (data.avifSrcset || '').split(',').map((s) => s.trim().split(/\s+/)[0]);
          expect(candidates.filter(Boolean).map((src) => new URL(src!, baseURL!).href)).toContain(data.currentSrc);
          if (sample.credit) {
            const photo = photos.find((p: any) => p.src === data.src);
            expect(photo, data.src || '').toBeTruthy();
            expect(data.alt).toBe(photo.alt[lang]);
            expect(data.width).toBe(String(photo.width));
            expect(data.height).toBe(String(photo.height));
            expect(data.creditText).toContain(photo.credit);
            expect(data.creditText).toContain(photo.license);
          } else {
            expect(data.src).toBe('/design/earth-atlas.webp');
            expect(data.alt.length).toBeGreaterThan(15);
          }
          rows.push(data);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        snapshots.push(rows);
      } finally {
        await context.unrouteAll({ behavior: 'wait' });
        await context.close();
      }
    }
    for (let index = 0; index < snapshots[0].length; index++) {
      const normal = snapshots[0][index];
      const fallback = snapshots[1][index];
      for (const key of ['src', 'srcset', 'alt', 'width', 'height', 'creditText']) {
        expect(fallback[key], `${lang}: preserved ${key}`).toEqual(normal[key]);
      }
      for (const key of ['imageWidth', 'imageHeight', 'containerWidth', 'containerHeight']) {
        expect(Math.abs(normal[key] - fallback[key]), `${lang}: stable ${key}`).toBeLessThanOrEqual(0.5);
      }
    }
  }
});
