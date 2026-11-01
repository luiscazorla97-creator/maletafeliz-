import type { Locale } from '../i18n';
const segments = {
  es: {
    search: 'buscar',
    destinations: 'destinos',
    guides: 'guias',
    explore: 'explorar',
    info: 'informacion',
    christmas: 'navidad',
  },
  en: {
    search: 'search',
    destinations: 'destinations',
    guides: 'guides',
    explore: 'explore',
    info: 'information',
    christmas: 'christmas',
  },
};
export const route = (lang: Locale, kind: keyof typeof segments.es, id = '') =>
  `/${lang}/${segments[lang][kind]}/${id ? id + '/' : ''}`;
