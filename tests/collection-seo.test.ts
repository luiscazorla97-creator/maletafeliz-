import { describe, expect, it } from 'vitest';
import {
  collectionDescription,
  compactDescription,
} from '../src/lib/collection-seo';

describe('collection metadata', () => {
  it('distinguishes the three localized navigation indexes', () => {
    const descriptions = (['es', 'en'] as const).flatMap((lang) =>
      (['destinations', 'guides', 'explore'] as const).map((kind) =>
        collectionDescription({ lang, kind, guideCount: 186 })!,
      ),
    );
    expect(new Set(descriptions).size).toBe(6);
    for (const description of descriptions) {
      expect(description).toContain('186');
      expect(description.length).toBeLessThanOrEqual(160);
    }
    expect(descriptions[0]).toContain('guías publicadas');
    expect(descriptions[3]).toContain('published guides');
  });

  it('uses the actual collection name, count and language for geographic pages', () => {
    const canada = collectionDescription({
      lang: 'es',
      kind: 'explore',
      id: 'country-ca',
      title: 'Canadá',
      guideCount: 1,
    })!;
    const france = collectionDescription({
      lang: 'es',
      kind: 'explore',
      id: 'country-fr',
      title: 'Francia',
      guideCount: 4,
    })!;
    const europe = collectionDescription({
      lang: 'en',
      kind: 'explore',
      id: 'europe',
      title: 'Europe',
      guideCount: 15,
    })!;
    expect(canada).toContain('Canadá: 1 guía publicada.');
    expect(france).toContain('Francia: 4 guías publicadas.');
    expect(europe).toContain('Europe: 15 published guides.');
    expect(europe).toContain('continent');
    expect(canada).not.toBe(france);
  });

  it('describes categories independently of country and continent pages', () => {
    const description = collectionDescription({
      lang: 'en',
      kind: 'explore',
      id: 'category-nature',
      title: 'Nature',
      guideCount: 12,
    })!;
    expect(description).toContain('Nature: 12 published guides.');
    expect(description).toContain('kind of trip');
    expect(description).not.toContain('country');
    expect(description).not.toContain('continent');
  });

  it('keeps individual article and destination metadata outside this fallback', () => {
    for (const kind of ['guides', 'destinations'] as const)
      expect(
        collectionDescription({
          lang: 'es',
          kind,
          id: 'existing-guide',
          title: 'Existing title',
          guideCount: 1,
        }),
      ).toBeUndefined();
    expect(
      collectionDescription({
        lang: 'en',
        kind: 'explore',
        id: 'country-ca',
        guideCount: 1,
      }),
    ).toBeUndefined();
  });

  it('updates the count when a new guide joins its collection', () => {
    const input = {
      lang: 'en',
      kind: 'explore',
      id: 'country-ca',
      title: 'Canada',
    } as const;
    expect(collectionDescription({ ...input, guideCount: 1 })).toContain(
      '1 published guide.',
    );
    expect(collectionDescription({ ...input, guideCount: 2 })).toContain(
      '2 published guides.',
    );
    expect(() => collectionDescription({ ...input, guideCount: -1 })).toThrow(
      RangeError,
    );
  });
});

describe('compact source descriptions', () => {
  it('uses source text unchanged except whitespace when it already fits', () => {
    expect(compactDescription('  Nuestra revista\n  de viajes. ')).toBe(
      'Nuestra revista de viajes.',
    );
    expect(compactDescription('Read the editorial policy.')).toBe(
      'Read the editorial policy.',
    );
  });

  it('ends long source text at a complete word within the limit', () => {
    expect(
      compactDescription(
        'Guías de viaje con contexto, fotografías y fuentes.',
        30,
      ),
    ).toBe('Guías de viaje con contexto…');
    const description = collectionDescription({
      lang: 'es',
      kind: 'explore',
      id: 'country-ae',
      title: 'Emiratos Árabes Unidos',
      guideCount: 100,
    })!;
    expect(description.length).toBeLessThanOrEqual(160);
  });
});
