import { useEffect, useMemo, useState } from 'react';
import { dictionary, continents, type Locale } from '../i18n';
import type { Destination } from '../data/destinations';
import { route } from '../lib/routes';
export type SearchItem = {
  id: string;
  title: string;
  city: string;
  country: string;
  continent: Destination['continent'];
  category: string;
  href: string;
  published: boolean;
};
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
export function filterItems(
  items: SearchItem[],
  query: string,
  continent: string,
) {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return items.filter(
    (item) =>
      (continent === 'all' || item.continent === continent) &&
      terms.every((term) =>
        normalize(
          `${item.title} ${item.city} ${item.country} ${item.category}`,
        ).includes(term),
      ),
  );
}
export default function Search({
  lang,
  items,
}: {
  lang: Locale;
  items: SearchItem[];
}) {
  const t = dictionary[lang];
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState('all');
  useEffect(() => {
    function sync() {
      const p = new URLSearchParams(location.search);
      setQuery((p.get('q') || '').slice(0, 100));
      const c = p.get('continent') || 'all';
      setContinent(c in continents ? c : 'all');
    }
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  const results = useMemo(
    () => filterItems(items, query, continent),
    [items, query, continent],
  );
  function update(q: string, c: string) {
    setQuery(q);
    setContinent(c);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (c !== 'all') p.set('continent', c);
    history.replaceState(
      null,
      '',
      `${route(lang, 'search')}${p.size ? '?' + p : ''}`,
    );
  }
  return (
    <div className="search-panel">
      <form
        className="search-controls"
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <div className="search-input-wrap">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="7" />
            <path d="m15 15 7 7" />
          </svg>
          <label className="sr-only" htmlFor="search-query">
            {t.searchLabel}
          </label>
          <input
            id="search-query"
            name="q"
            value={query}
            maxLength={100}
            onChange={(e) => update(e.target.value, continent)}
            placeholder={t.searchPlaceholder}
          />
        </div>
        <button
          type="button"
          className="button button-dark"
          onClick={() => update('', 'all')}
        >
          {t.clear}
        </button>
      </form>
      <div className="filter-tabs" aria-label={t.continent}>
        <button
          onClick={() => update(query, 'all')}
          aria-pressed={continent === 'all'}
        >
          {t.all}
        </button>
        {Object.entries(continents).map(([key, names]) => (
          <button
            key={key}
            onClick={() => update(query, key)}
            aria-pressed={continent === key}
          >
            {names[lang]}
          </button>
        ))}
      </div>
      <p className="result-count" role="status" aria-live="polite">
        {results.length} {t.results}
      </p>
      <div className="search-results">
        {results.length ? (
          results.map((item) => (
            <a key={item.id} href={item.href} className="search-result">
              <span className="eyebrow">
                {item.country} · {continents[item.continent][lang]}
              </span>
              <h2>{item.city}</h2>
              <p>{item.title}</p>
              <span className="text-link">
                {item.published ? t.read : t.preparing}{' '}
                <span aria-hidden="true">→</span>
              </span>
            </a>
          ))
        ) : (
          <div className="empty-state">
            <h2>{t.noResults}</h2>
            <p>{t.tryAgain}</p>
          </div>
        )}
      </div>
    </div>
  );
}
