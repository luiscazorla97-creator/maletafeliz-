import { route } from '../lib/routes';
import plan from '../../editorial/plan.json';
import type { Locale, Continent } from '../i18n';
export type Destination = {
  id: string;
  destinationId?: string;
  city: Record<Locale, string>;
  countryId: string;
  country: Record<Locale, string>;
  categories: string[];
  continent: Continent;
  category: 'cities' | 'nature';
  placeCount: number;
  titles: Record<Locale, string>;
  slugs: Record<Locale, string>;
  status: string;
};
// Additional articles can share a city without inventing another destination page.
export const destinations = (plan as Destination[]).filter(
  (d) => !d.destinationId || d.destinationId === d.id,
);
export const destinationUrl = (d: Destination, lang: Locale) =>
  route(lang, 'destinations', d.id);
export const guideUrl = (d: Destination, lang: Locale) =>
  route(lang, 'guides', d.slugs[lang]);
