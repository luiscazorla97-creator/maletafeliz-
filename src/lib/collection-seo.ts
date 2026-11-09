import type { Locale } from '../i18n';

export type CollectionSeoInput = {
  lang: Locale;
  kind: 'destinations' | 'guides' | 'explore';
  id?: string;
  /** Localized country, continent or category name, supplied by the route. */
  title?: string;
  /** Published guides in this collection and locale, not planned topics. */
  guideCount: number;
};

/** Prefer word boundaries when shortening plain source text for metadata. */
export function compactDescription(text: string, maxLength = 160): string {
  if (!Number.isSafeInteger(maxLength) || maxLength < 1)
    throw new RangeError('Description length must be a positive integer.');
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  if (maxLength === 1) return '…';
  const prefix = clean.slice(0, maxLength - 1);
  const boundary = prefix.lastIndexOf(' ');
  return (
    (boundary > 0 ? prefix.slice(0, boundary) : prefix).replace(
      /[\s,;:.!?–—-]+$/u,
      '',
    ) + '…'
  );
}

/** Metadata for collection routes; individual guides and cities keep theirs. */
export function collectionDescription({
  lang,
  kind,
  id,
  title,
  guideCount,
}: CollectionSeoInput): string | undefined {
  if ((kind === 'guides' || kind === 'destinations') && id) return undefined;
  if (!Number.isSafeInteger(guideCount) || guideCount < 0)
    throw new RangeError('Use the actual number of published guides.');

  const count =
    lang === 'es'
      ? `${guideCount} ${guideCount === 1 ? 'guía publicada' : 'guías publicadas'}`
      : `${guideCount} published ${guideCount === 1 ? 'guide' : 'guides'}`;
  let description: string;

  if (!id && kind === 'guides') {
    description =
      lang === 'es'
        ? `Consultá ${count}: lugares que visitar, rutas, fotografías y consejos prácticos para organizar tu próximo viaje.`
        : `Browse ${count} with places to visit, routes, photographs and practical advice to help you plan your next trip.`;
  } else if (!id && kind === 'destinations') {
    description =
      lang === 'es'
        ? `Descubrí ciudades y destinos con ${count}. Elegí dónde viajar y consultá lugares, rutas y consejos para preparar tu visita.`
        : `Discover cities and destinations covered by ${count}. Find places to visit, routes and practical advice for planning your visit.`;
  } else if (!id && kind === 'explore') {
    description =
      lang === 'es'
        ? `Explorá destinos por continente, país y tipo de viaje. Encontrá ${count} para elegir tu próxima ruta y preparar la visita.`
        : `Explore destinations by continent, country and type of trip. Find ${count} to choose your next route and plan your visit.`;
  } else {
    const name = title?.replace(/\s+/g, ' ').trim();
    if (!name) return undefined;
    if (id?.startsWith('country-')) {
      description =
        lang === 'es'
          ? `${name}: ${count}. Lugares para conocer, rutas y consejos prácticos para organizar tu viaje por el país.`
          : `${name}: ${count}. Find places to visit, routes and practical advice to help organise your trip around the country.`;
    } else if (id?.startsWith('category-')) {
      description =
        lang === 'es'
          ? `${name}: ${count}. Ideas para elegir destinos, conocer sus lugares y organizar rutas según el tipo de viaje que buscás.`
          : `${name}: ${count}. Explore destination ideas, places to visit and routes for the kind of trip you want to plan.`;
    } else {
      description =
        lang === 'es'
          ? `${name}: ${count}. Compará ciudades y destinos del continente, con lugares y rutas para preparar tu viaje.`
          : `${name}: ${count}. Compare cities and destinations across the continent, with places to visit and routes to help plan your trip.`;
    }
  }
  return compactDescription(description);
}
