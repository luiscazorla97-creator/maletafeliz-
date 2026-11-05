import { afterAll, describe, expect, it, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { chromium, type Browser } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import FestiveFigure from '../src/components/FestiveFigure.astro';
import ArticleView from '../src/components/Article.astro';
import PhotoCredits from '../src/components/PhotoCredits.astro';

// Test-only manifest/record overlay. Production and historic content are never
// edited and none of these fixtures is written to the site's content directories.
vi.mock('../src/lib/content', async (importOriginal) => {
  const actual: any = await importOriginal();
  const original = actual.photoFor('pk-christmas-miami-fairchild');
  const illustrative = {
    ...original,
    id: 'synthetic-festive-test',
    kind: 'festive-ai-illustration',
    src: '/images/synthetic-fixture.webp',
    variants: [],
    alt: {
      es: 'Miami con ambientación ilustrativa mediante IA (prueba sintética)',
      en: 'Miami with illustrative AI enhancements (synthetic fixture)',
    },
  };
  return {
    ...actual,
    photos: [...actual.photos, illustrative],
    publishedArticles: [
      ...actual.publishedArticles,
      {
        id: 'future-festive-fixture',
        festive_image_enhancement: true,
        festiveCoverImageId: illustrative.id,
        sections: [],
      },
    ],
    photoFor: (id: string) =>
      id === illustrative.id ? illustrative : actual.photoFor(id),
  };
});
vi.mock('../src/lib/festive-images', async (importOriginal) => {
  const actual: any = await importOriginal();
  const record = {
    imageId: 'synthetic-festive-test',
    originalPhotoId: 'pk-christmas-miami-fairchild',
    modifications: {
      es: 'Prueba de identificación; no representa un evento real.',
      en: 'Disclosure test fixture; does not represent an actual event.',
    },
  };
  const recordFor = (photo: any) =>
    photo.id === record.imageId ? record : actual.enhancementFor(photo);
  return {
    ...actual,
    enhancementFor: recordFor,
    festiveCoverFor: (article: any, photos: any[]) =>
      actual.festiveCoverFor(article, photos, recordFor),
  };
});
let browser: Browser;
afterAll(async () => {
  await browser?.close();
});
describe('actual Astro festive image rendering, synthetic fixtures only', () => {
  it('renders the cover, additional illustration and credits with visible localized disclosures on desktop and mobile', async () => {
    const { photoFor } = await import('../src/lib/content');
    const { festiveDisclosure } = await import('../src/lib/festive-images');
    const photo = photoFor('synthetic-festive-test')!;
    const container = await AstroContainer.create();
    const source = JSON.parse(
      readFileSync('content/articles/christmas-miami.es.json', 'utf8'),
    );
    const image = await sharp({
      create: { width: 1200, height: 800, channels: 3, background: '#126273' },
    })
      .webp()
      .toBuffer();
    // Vite resolves this build directive in production. Raw fixture CSS must
    // not turn it into an HTTP request to fixture.invalid/tailwindcss.
    const css = readFileSync('src/styles/global.css', 'utf8').replace(
      /^@import\s+['"]tailwindcss['"];\s*/m,
      '',
    );
    browser = await chromium.launch({
      executablePath:
        process.env.CHROMIUM_PATH ||
        (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
      args: ['--no-sandbox'],
    });
    for (const lang of ['es', 'en'] as const) {
      const article = {
        ...source,
        id: 'future-festive-fixture',
        locale: lang,
        festive_image_enhancement: true,
        festiveCoverImageId: photo.id,
        sections: [
          { ...source.sections[0], illustrationImageId: photo.id },
          ...source.sections.slice(1),
        ],
      };
      const html = await container.renderToString(ArticleView, {
        props: { article },
      });
      expect(html).toContain(festiveDisclosure[lang]);
      expect(html).toContain(photo.alt[lang]);
      expect(html).toContain('data-festive-disclosure');
      const credits = await container.renderToString(PhotoCredits, {
        props: { lang },
      });
      expect(credits).toContain(festiveDisclosure[lang]);
      const figure = await container.renderToString(FestiveFigure, {
        props: { photo, lang },
      });
      expect(figure).toContain('loading="lazy"');
      for (const width of [390, 1440]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
        });
        const page = await context.newPage();
        const blockedRequests: string[] = [];
        await context.route('**/*', (route) => {
          const url = new URL(route.request().url());
          if (
            url.origin === 'https://fixture.invalid' &&
            url.pathname.startsWith('/images/')
          )
            return route.fulfill({ contentType: 'image/webp', body: image });
          blockedRequests.push(url.href);
          return route.abort('blockedbyclient');
        });
        await page.setContent(
          `<html lang="${lang}"><head><base href="https://fixture.invalid/"><style>${css}</style></head><body>${html}</body></html>`,
        );
        expect(blockedRequests).toEqual([]);
        const disclosures = page.locator('[data-festive-disclosure]');
        expect(await disclosures.count()).toBe(2);
        for (const disclosure of await disclosures.all()) {
          await disclosure.scrollIntoViewIfNeeded();
          expect(await disclosure.isVisible()).toBe(true);
          expect(await disclosure.innerText()).toContain(
            festiveDisclosure[lang],
          );
        }
        expect(
          await page.locator('.article-cover img').getAttribute('src'),
        ).toBe(photo.src);
        expect(
          await page
            .locator('.article-cover img')
            .getAttribute('fetchpriority'),
        ).toBe('high');
        const place = page.locator('.prose section').first();
        expect(
          await place.locator('figure:not(.festive-illustration) img').count(),
        ).toBe(1);
        expect(await place.locator('.festive-illustration img').count()).toBe(
          1,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await context.close();
      }
    }
    const unchanged = await container.renderToString(ArticleView, {
      props: { article: source },
    });
    expect(unchanged).not.toContain('data-festive-disclosure');
    expect(unchanged).not.toContain('synthetic-fixture.webp');
  }, 30000);
});
