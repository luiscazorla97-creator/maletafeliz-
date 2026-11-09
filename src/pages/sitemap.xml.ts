import type { APIRoute } from 'astro';
import { publishedArticles, articlePath, type Article } from '../lib/content';
import { locales, type Locale } from '../i18n';
import {
  destinations,
  destinationUrl,
  type Destination,
} from '../data/destinations';
import { legal } from '../data/legal';
import site from '../../editorial/site.json';
import { absolute, production } from '../lib/site';
import { route } from '../lib/routes';
const escape = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );
type SitemapEntry = {
  path: string;
  updated?: string;
  alternates?: { lang: Locale; path: string }[];
};

// Collection dates follow real changes to their published guides. Rebuilding the
// site must not make unchanged content appear newly updated to a crawler.
const latestArticleDate = (articles: Article[]) =>
  articles.reduce<string | undefined>((latest, article) => {
    const value = article.updatedAt || article.publishedAt;
    if (!value || !Number.isFinite(Date.parse(value))) return latest;
    return !latest || Date.parse(value) > Date.parse(latest) ? value : latest;
  }, undefined);

export function sitemapPaths({
  productionMode = production,
  articles = publishedArticles,
  destinationList = destinations,
  legalReviewed = !!site.legalReviewedAt,
}: {
  productionMode?: boolean;
  articles?: Article[];
  destinationList?: Destination[];
  legalReviewed?: boolean;
} = {}): SitemapEntry[] {
  const paths: SitemapEntry[] = [];
  const published = articles.filter((a) => a.status === 'published');
  const alternatesFor = (
    path: (lang: Locale) => string,
    include: (lang: Locale) => boolean = () => true,
  ) => locales.filter(include).map((lang) => ({ lang, path: path(lang) }));
  const forDestinations = (ids: Set<string>) =>
    published.filter((a) => ids.has(a.destinationId));
  if (productionMode) {
    for (const lang of locales) {
      const localized = published.filter((a) => a.locale === lang);
      paths.push({
        path: `/${lang}/`,
        updated: latestArticleDate(localized),
        alternates: locales.map((l) => ({ lang: l, path: `/${l}/` })),
      });
      const christmas = localized.filter((a) => a.id.startsWith('christmas-'));
      if (christmas.length)
        paths.push({
          path: route(lang, 'christmas'),
          updated: latestArticleDate(christmas),
          alternates: alternatesFor(
            (l) => route(l, 'christmas'),
            (l) =>
              published.some(
                (a) => a.locale === l && a.id.startsWith('christmas-'),
              ),
          ),
        });
      if (localized.length)
        for (const kind of ['destinations', 'guides', 'explore'] as const)
          paths.push({
            path: route(lang, kind),
            updated: latestArticleDate(localized),
            alternates: alternatesFor(
              (l) => route(l, kind),
              (l) => published.some((a) => a.locale === l),
            ),
          });
      // These are existing public pages. The same review gate as their Layout
      // keeps unreviewed, noindex information pages out of the sitemap.
      if (legalReviewed)
        for (const id of Object.keys(legal))
          paths.push({
            path: route(lang, 'info', id),
            alternates: alternatesFor((l) => route(l, 'info', id)),
          });
      const active = destinationList.filter((d) =>
        localized.some((a) => a.destinationId === d.id),
      );
      for (const d of active)
        paths.push({
          path: destinationUrl(d, lang),
          updated: latestArticleDate(
            localized.filter((a) => a.destinationId === d.id),
          ),
          alternates: locales
            .filter((l) =>
              published.some((a) => a.locale === l && a.destinationId === d.id),
            )
            .map((l) => ({ lang: l, path: destinationUrl(d, l) })),
        });
      for (const c of new Set(active.map((d) => d.continent)))
        paths.push({
          path: route(lang, 'explore', c),
          updated: latestArticleDate(
            forDestinations(
              new Set(active.filter((d) => d.continent === c).map((d) => d.id)),
            ).filter((a) => a.locale === lang),
          ),
          alternates: alternatesFor(
            (l) => route(l, 'explore', c),
            (l) =>
              destinationList.some(
                (d) =>
                  d.continent === c &&
                  published.some(
                    (a) => a.locale === l && a.destinationId === d.id,
                  ),
              ),
          ),
        });
      for (const c of new Set(active.map((d) => d.countryId)))
        paths.push({
          path: route(lang, 'explore', `country-${c}`),
          updated: latestArticleDate(
            forDestinations(
              new Set(active.filter((d) => d.countryId === c).map((d) => d.id)),
            ).filter((a) => a.locale === lang),
          ),
          alternates: alternatesFor(
            (l) => route(l, 'explore', `country-${c}`),
            (l) =>
              destinationList.some(
                (d) =>
                  d.countryId === c &&
                  published.some(
                    (a) => a.locale === l && a.destinationId === d.id,
                  ),
              ),
          ),
        });
      for (const c of new Set(active.flatMap((d) => d.categories)))
        paths.push({
          path: route(lang, 'explore', `category-${c}`),
          updated: latestArticleDate(
            forDestinations(
              new Set(
                active.filter((d) => d.categories.includes(c)).map((d) => d.id),
              ),
            ).filter((a) => a.locale === lang),
          ),
          alternates: alternatesFor(
            (l) => route(l, 'explore', `category-${c}`),
            (l) =>
              destinationList.some(
                (d) =>
                  d.categories.includes(c) &&
                  published.some(
                    (a) => a.locale === l && a.destinationId === d.id,
                  ),
              ),
          ),
        });
    }
    for (const a of published)
      paths.push({
        path: articlePath(a),
        updated: a.updatedAt || a.publishedAt,
        alternates: locales
          .map((l) => published.find((b) => b.id === a.id && b.locale === l))
          .filter(Boolean)
          .map((b) => ({ lang: b!.locale, path: articlePath(b!) })),
      });
  }
  return paths;
}

export const GET: APIRoute = () => {
  const paths = sitemapPaths();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${paths.map((p) => `<url><loc>${escape(absolute(p.path))}</loc>${p.updated ? `<lastmod>${escape(p.updated)}</lastmod>` : ''}${(p.alternates || []).map((a) => `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${escape(absolute(a.path))}"/>`).join('')}</url>`).join('')}</urlset>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
