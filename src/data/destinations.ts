import { route } from '../lib/routes';
import plan from '../../editorial/plan.json';
import type { Locale, Continent } from '../i18n';
export type Destination = {
  id: string;
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
export const destinations = plan as Destination[];
export const destinationUrl = (d: Destination, lang: Locale) =>
  route(lang, 'destinations', d.id);
export const guideUrl = (d: Destination, lang: Locale) =>
  route(lang, 'guides', d.slugs[lang]);
