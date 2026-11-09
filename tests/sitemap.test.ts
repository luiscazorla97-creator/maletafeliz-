import { describe, expect, it } from 'vitest';
import { sitemapPaths } from '../src/pages/sitemap.xml';
import {
  articlePath,
  publishedArticles,
  type Article,
} from '../src/lib/content';
import { destinations, type Destination } from '../src/data/destinations';
import { legal } from '../src/data/legal';
import { locales } from '../src/i18n';
import { route } from '../src/lib/routes';

const productionPaths = () => sitemapPaths({ productionMode: true });

describe('production sitemap discovery', () => {
  it('includes every published localization once with its real date and translation', () => {
    const entries = productionPaths();
    expect(new Set(entries.map((entry) => entry.path)).size).toBe(
      entries.length,
    );
    for (const article of publishedArticles) {
      const matches = entries.filter(
        (entry) => entry.path === articlePath(article),
      );
      expect(matches).toHaveLength(1);
      expect(matches[0].updated).toBe(article.updatedAt || article.publishedAt);
      expect(matches[0].alternates).toEqual(
        locales.flatMap((locale) => {
          const translation = publishedArticles.find(
            (other) => other.id === article.id && other.locale === locale,
          );
          return translation
            ? [{ lang: locale, path: articlePath(translation) }]
            : [];
        }),
      );
    }
  });

  it('includes existing reviewed information pages and excludes intentional noindex routes', () => {
    const entries = productionPaths();
    const paths = entries.map((entry) => entry.path);
    for (const lang of locales) {
      for (const id of Object.keys(legal)) {
        const entry = entries.find(
          (entry) => entry.path === route(lang, 'info', id),
        );
        expect(entry).toBeDefined();
        expect(entry?.alternates).toEqual(
          locales.map((locale) => ({
            lang: locale,
            path: route(locale, 'info', id),
          })),
        );
        // An old legal review is not evidence of when every information page changed.
        expect(entry?.updated).toBeUndefined();
      }
      expect(paths).not.toContain(route(lang, 'search'));
      expect(paths).not.toContain(route(lang, 'explore', 'antarctica'));
    }
    expect(paths).not.toContain('/');
    expect(paths).not.toContain('/404.html');
    expect(sitemapPaths({ productionMode: false })).toEqual([]);
    expect(
      sitemapPaths({ productionMode: true, legalReviewed: false }).some(
        (entry) => /\/(informacion|information)\//.test(entry.path),
      ),
    ).toBe(false);
  });

  it('automatically discovers a newly published city and both localized article URLs', () => {
    // Isolated fixtures, never written to the editorial catalogue or public build.
    const destination: Destination = {
      ...destinations[0],
      id: 'sitemap-test-city',
      countryId: 'test-country',
      continent: 'europe',
      categories: ['culture'],
      slugs: { es: 'guia-de-prueba-es', en: 'test-guide-en' },
    };
    const date = '2020-06-12T10:00:00-04:00';
    const articles: Article[] = locales.map((locale) => ({
      ...publishedArticles[0],
      id: 'sitemap-test-city',
      destinationId: destination.id,
      locale,
      slug: destination.slugs[locale],
      status: 'published',
      publishedAt: date,
      updatedAt: date,
    }));
    const entries = sitemapPaths({
      productionMode: true,
      articles,
      destinationList: [destination],
      legalReviewed: false,
    });
    for (const article of articles) {
      for (const path of [
        articlePath(article),
        route(article.locale, 'destinations', destination.id),
        route(article.locale, 'explore', 'country-test-country'),
        route(article.locale, 'explore', 'category-culture'),
        route(article.locale, 'explore', 'europe'),
        route(article.locale, 'guides'),
      ]) {
        const entry = entries.find((entry) => entry.path === path);
        expect(entry).toBeDefined();
        expect(entry?.updated).toBe(date);
      }
    }
    for (const entry of entries)
      for (const alternate of entry.alternates || []) {
        const other = entries.find((other) => other.path === alternate.path);
        expect(
          other?.alternates?.some((other) => other.path === entry.path),
        ).toBe(true);
      }
    expect(
      sitemapPaths({
        productionMode: true,
        articles,
        destinationList: [destination],
        legalReviewed: false,
      }),
    ).toEqual(entries);
  });

  it('does not advertise drafts, empty collections or nonexistent translations', () => {
    const destination = {
      ...destinations[0],
      id: 'sitemap-test-single',
      countryId: 'test-single',
      continent: 'asia',
      categories: ['culture'],
    } as Destination;
    const article = {
      ...publishedArticles[0],
      id: destination.id,
      destinationId: destination.id,
      locale: 'es',
      slug: 'solo-es',
      status: 'published',
    } as Article;
    const draft = {
      ...article,
      id: 'sitemap-draft',
      slug: 'borrador',
      status: 'draft',
    } as Article;
    const entries = sitemapPaths({
      productionMode: true,
      articles: [article, draft],
      destinationList: [destination],
      legalReviewed: false,
    });
    expect(entries.some((entry) => entry.path === articlePath(draft))).toBe(
      false,
    );
    expect(
      entries.find((entry) => entry.path === articlePath(article))?.alternates,
    ).toEqual([{ lang: 'es', path: articlePath(article) }]);
    expect(
      entries.find(
        (entry) => entry.path === route('es', 'explore', 'country-test-single'),
      )?.alternates,
    ).toEqual([
      { lang: 'es', path: route('es', 'explore', 'country-test-single') },
    ]);
    expect(
      entries.some(
        (entry) => entry.path === route('en', 'explore', 'country-test-single'),
      ),
    ).toBe(false);
    expect(
      entries.some((entry) => entry.path === route('es', 'christmas')),
    ).toBe(false);
  });

  it('gives navigation collections reciprocal alternates and preserves recorded dates', () => {
    const entries = productionPaths();
    for (const entry of entries)
      for (const alternate of entry.alternates || []) {
        const other = entries.find((other) => other.path === alternate.path);
        expect(other, alternate.path).toBeDefined();
        expect(
          other?.alternates?.some((other) => other.path === entry.path),
        ).toBe(true);
      }
    const storedDates = new Set(
      publishedArticles.flatMap((article) => [
        article.publishedAt,
        article.updatedAt,
      ]),
    );
    for (const entry of entries)
      if (entry.updated)
        expect(storedDates.has(entry.updated), entry.path).toBe(true);
  });
});
