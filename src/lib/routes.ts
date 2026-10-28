import type { Locale } from '../i18n';
const segments = {
  es: {
    search: 'buscar',
    destinations: 'destinos',
    guides: 'guias',
    explore: 'explorar',
    info: 'informacion',
  },
  en: {
    search: 'search',
    destinations: 'destinations',
    guides: 'guides',
    explore: 'explore',
    info: 'information',
  },
};
export const route = (lang: Locale, kind: keyof typeof segments.es, id = '') =>
  `/${lang}/${segments[lang][kind]}/${id ? id + '/' : ''}`;
