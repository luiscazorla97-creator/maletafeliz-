import { describe, it, expect } from 'vitest';
import { filterItems, type SearchItem } from '../src/components/Search';
const items: SearchItem[] = [
  {
    id: 'paris',
    title: '15 lugares de París',
    city: 'París',
    country: 'Francia',
    continent: 'europe',
    category: 'Cultura Europa',
    href: '/es/destinos/paris/',
    published: false,
  },
  {
    id: 'tokyo',
    title: '15 lugares de Tokio',
    city: 'Tokio',
    country: 'Japón',
    continent: 'asia',
    category: 'Ciudades Asia',
    href: '/es/destinos/tokyo/',
    published: false,
  },
];
describe('search', () => {
  it('normalizes accents and case', () =>
    expect(filterItems(items, 'PARIS', 'all').map((x) => x.id)).toEqual([
      'paris',
    ]));
  it('combines geographic filters and country terms', () => {
    expect(filterItems(items, 'japon', 'asia')).toHaveLength(1);
    expect(filterItems(items, 'japon', 'europe')).toHaveLength(0);
  });
  it('handles multiple terms and no results', () => {
    expect(filterItems(items, 'paris francia', 'all')).toHaveLength(1);
    expect(filterItems(items, 'paris japon', 'all')).toHaveLength(0);
  });
  it('does not alter the locale or destination link', () =>
    expect(filterItems(items, 'paris', 'all')[0].href).toBe(
      '/es/destinos/paris/',
    ));
});
