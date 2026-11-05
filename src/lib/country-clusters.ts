import { destinations } from '../data/destinations';
import { countryCityClusters, countryGuides } from '../data/country-guides';
import { forLocale, type Article } from './content';
import type { Locale } from '../i18n';

export const hasCountryGuide = (id: string) => Boolean(countryGuides[id]);
export const countryGuidePath = (id: string, lang: Locale) =>
  `/${lang}/${lang === 'es' ? 'explorar' : 'explore'}/country-${id}/`;

export const countryArticles = (id: string, lang: Locale) =>
  forLocale(lang)
    .filter(
      (a) =>
        destinations.find((d) => d.id === a.destinationId)?.countryId === id,
    )
    .sort((a, b) => a.title.localeCompare(b.title, lang));

export function countryArticleGroups(id: string, lang: Locale) {
  const available = countryArticles(id, lang);
  const assigned = new Set<string>();
  const groups: { id: string; name: string; articles: Article[] }[] = [];
  for (const city of countryCityClusters[id] || []) {
    const articles = available.filter((a) =>
      city.destinationIds.includes(a.destinationId),
    );
    if (!articles.length) continue;
    articles.forEach((a) => assigned.add(a.id));
    groups.push({ id: city.id, name: city.name[lang], articles });
  }
  const remaining = available.filter((a) => !assigned.has(a.id));
  if (remaining.length)
    groups.push({
      id: 'other',
      name:
        lang === 'es'
          ? 'Más destinos y guías de temporada'
          : 'More destinations and seasonal guides',
      articles: remaining,
    });
  return groups;
}
