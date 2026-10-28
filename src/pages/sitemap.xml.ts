import type { APIRoute } from 'astro';
import {
  publishedArticles,
  articlePath,
  translatedArticle,
} from '../lib/content';
import { locales } from '../i18n';
import { destinations, destinationUrl } from '../data/destinations';
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
export const GET: APIRoute = () => {
  const paths: {
    path: string;
    updated?: string;
    alternates?: { lang: string; path: string }[];
  }[] = [];
  if (production) {
    for (const lang of locales) {
      paths.push({
        path: `/${lang}/`,
        alternates: locales.map((l) => ({ lang: l, path: `/${l}/` })),
      });
      for (const kind of ['destinations', 'guides', 'explore'] as const)
        paths.push({ path: route(lang, kind) });
      const active = destinations.filter((d) =>
        publishedArticles.some(
          (a) => a.locale === lang && a.destinationId === d.id,
        ),
      );
      for (const d of active)
        paths.push({
          path: destinationUrl(d, lang),
          alternates: locales
            .filter((l) =>
              publishedArticles.some(
                (a) => a.locale === l && a.destinationId === d.id,
              ),
            )
            .map((l) => ({ lang: l, path: destinationUrl(d, l) })),
        });
      for (const c of new Set(active.map((d) => d.continent)))
        paths.push({ path: route(lang, 'explore', c) });
      for (const c of new Set(active.map((d) => d.countryId)))
        paths.push({ path: route(lang, 'explore', `country-${c}`) });
    }
    for (const a of publishedArticles)
      paths.push({
        path: articlePath(a),
        updated: a.updatedAt || a.publishedAt,
        alternates: locales
          .map((l) => translatedArticle(a, l))
          .filter(Boolean)
          .map((b) => ({ lang: b!.locale, path: articlePath(b!) })),
      });
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${paths.map((p) => `<url><loc>${escape(absolute(p.path))}</loc>${p.updated ? `<lastmod>${escape(p.updated)}</lastmod>` : ''}${(p.alternates || []).map((a) => `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${escape(absolute(a.path))}"/>`).join('')}</url>`).join('')}</urlset>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
