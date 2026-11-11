import { describe, expect, it } from 'vitest';
import {
  robotsAllows, parseSeoHtml, indexablePageErrors, indexingRestrictions,
  reciprocalHreflangErrors, sitemapUrls, sitemapCoverageErrors,
  htmlReachability, publicArticlePath, forEachAtMostTwo, retryAfterNotBefore,
} from '../scripts/lib/live-seo.mjs';
import { verifyLive } from '../scripts/verify-live.mjs';

// Synthetic, in-memory documents only; no editorial file or public site writes.
const origin = 'https://example.test';
const date = '2026-11-01T12:00:00Z';
const articles = (['es', 'en'] as const).map((locale) => ({
  id: 'sample', destinationId: 'sample-city', locale,
  slug: locale === 'es' ? 'guia-de-prueba' : 'sample-guide',
  title: locale === 'es' ? 'Guía turística de prueba' : 'A practical sample travel guide',
  description: locale === 'es' ? 'Descripción de prueba para organizar una visita informada.' : 'A sample description for planning a well-informed visit.',
  status: 'published', publishedAt: date, updatedAt: date,
  intro: [locale === 'es' ? 'El texto íntegro debe existir en el HTML del artículo.' : 'The complete manuscript must be present in the article HTML.'],
  sections: [], quickFacts: [], faq: [], itinerary: [], relatedIds: [],
  conclusion: locale === 'es' ? 'Resumen para preparar la visita.' : 'A summary to prepare the visit.',
}));
const guideUrls = articles.map((article) => origin + publicArticlePath(article));

function pageHtml(url: string, pair: string[], article?: typeof articles[number], extra = '') {
  const locale = new URL(url).pathname.split('/')[1];
  const title = article?.title || `Portal ${new URL(url).pathname}`;
  const description = article?.description || 'Useful localized public navigation information.';
  const ld = article ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article',
    headline: article.title, description, inLanguage: article.locale, datePublished: date, dateModified: date, mainEntityOfPage: url })}</script>` : '';
  return `<!doctype html><html lang="${locale}"><head><title>${title} | MaletaFeliz</title><meta name="description" content="${description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}">${pair.map((href) => `<link rel="alternate" hreflang="${new URL(href).pathname.split('/')[1]}" href="${href}">`).join('')}${ld}</head><body><main><h1>${title}</h1><p>${description}</p>${article ? `<p>${article.intro[0]}</p><p>${article.conclusion}</p>` : ''}${extra}</main></body></html>`;
}
const validGuide = () => parseSeoHtml(pageHtml(guideUrls[0], guideUrls, articles[0]), guideUrls[0]);

describe('robots group and path eligibility', () => {
  it('rejects guide and destination blocks even when Allow:/ exists', () => {
    const robots = 'User-agent: *\nAllow: /\nDisallow: /es/guias/\nDisallow: /en/guides/\nDisallow: /es/destinos/\nDisallow: /en/destinations/';
    for (const path of ['/es/guias/a/', '/en/guides/a/', '/es/destinos/a/', '/en/destinations/a/']) expect(robotsAllows(robots, path)).toBe(false);
    expect(robotsAllows(robots, '/es/')).toBe(true);
  });

  it('uses specific UA groups, combines equally specific groups and preserves empty Disallow boundaries', () => {
    const robots = 'User-agent: *\nDisallow: /\nUser-agent: Googlebot\nDisallow:\nUser-agent: Googlebot\nDisallow: /private/\nUser-agent: Googlebot-Image\nDisallow: /images/';
    expect(robotsAllows(robots, '/es/guias/a/')).toBe(true);
    expect(robotsAllows(robots, '/private/a')).toBe(false);
    expect(robotsAllows(robots, '/es/', '*')).toBe(false);
    expect(robotsAllows(robots, '/images/a', 'Googlebot-Image')).toBe(false);
    expect(robotsAllows(robots, '/private/a', 'Googlebot-Image')).toBe(true);
  });

  it('uses longest matching paths, allows ties, supports wildcard/end and URL/query matching', () => {
    const robots = 'User-agent: *\nDisallow: /private/\nAllow: /private/public/\nDisallow: /same\nAllow: /same\nDisallow: /*.pdf$\nDisallow: /*?secret=*\nDisallow: /caf%C3%A9/\nDisallow: /literal%2Fpart/';
    expect(robotsAllows(robots, '/private/public/a')).toBe(true);
    expect(robotsAllows(robots, '/same')).toBe(true);
    expect(robotsAllows(robots, origin + '/guide.pdf')).toBe(false);
    expect(robotsAllows(robots, '/guide.pdf?download=yes')).toBe(true);
    expect(robotsAllows(robots, '/es/?secret=yes')).toBe(false);
    expect(robotsAllows(robots, '/café/a')).toBe(false);
    expect(robotsAllows(robots, '/literal/part/a')).toBe(true);
    expect(robotsAllows(robots, '/literal%2fpart/a')).toBe(false);
  });
});

describe('semantic public HTML validation', () => {
  it('accepts a complete source-bound guide with a real Article JSON-LD', () => {
    expect(indexablePageErrors(validGuide(), { article: articles[0] })).toEqual([]);
  });

  it('requires the unique canonical element instead of accepting any matching href', () => {
    const html = pageHtml(guideUrls[0], guideUrls, articles[0]);
    const wrong = html.replace(`rel="canonical" href="${guideUrls[0]}"`, 'rel="canonical" href="https://wrong.test/"');
    expect(wrong).toContain(`href="${guideUrls[0]}"`); // The alternate still matches the old substring check.
    expect(indexablePageErrors(parseSeoHtml(wrong, guideUrls[0]))).toContain('Expected one exact self-referencing canonical link');
    const duplicate = html.replace('</head>', `<link rel="canonical" href="${guideUrls[0]}"></head>`);
    expect(indexablePageErrors(parseSeoHtml(duplicate, guideUrls[0]))).toContain('Expected one exact self-referencing canonical link');
    const invalidRel = html.replace('rel="canonical"', 'rel="canonical,alternate"');
    expect(indexablePageErrors(parseSeoHtml(invalidRel, guideUrls[0]))).toContain('Expected one exact self-referencing canonical link');
    const emptyMeta = html.replace(`content="${articles[0].description}"`, 'content="   "');
    expect(indexablePageErrors(parseSeoHtml(emptyMeta, guideUrls[0]))).toContain('Expected one nonempty description');
  });

  it('detects reversed/single-quoted robot meta, none/nofollow and relevant HTTP header directives', () => {
    const html = pageHtml(guideUrls[0], guideUrls, articles[0]).replace('<meta name="robots" content="index,follow,max-image-preview:large">', "<meta content='NONE' name='ROBOTS'>");
    expect(indexablePageErrors(parseSeoHtml(html, guideUrls[0]))).toContain('Restrictive indexing/follow directives: nofollow, noindex');
    expect(indexingRestrictions([], 'bingbot: noindex, nofollow, googlebot: index, follow')).toEqual([]);
    expect(indexingRestrictions([], 'otherbot: noindex, Googlebot: nofollow')).toEqual(['nofollow']);
    expect(indexingRestrictions([], ['bingbot: noindex', 'noindex'])).toEqual(['noindex']);
    expect(indexingRestrictions([], 'max-image-preview: none')).toEqual([]);
    expect(indexablePageErrors(validGuide(), { xRobotsTag: 'googlebot: noindex' })).toContain('Restrictive indexing/follow directives: noindex');
  });

  it('does not accept manuscript strings in JavaScript or fake Article data of the wrong type', () => {
    const html = pageHtml(guideUrls[0], guideUrls, articles[0])
      .replace(`<p>${articles[0].intro[0]}</p>`, `<script>const manuscript = ${JSON.stringify(articles[0].intro[0])};</script>`)
      .replace('type="application/ld+json"', 'type="text/plain"');
    expect(html).toContain(articles[0].intro[0]);
    const errors = indexablePageErrors(parseSeoHtml(html, guideUrls[0]), { article: articles[0] });
    expect(errors).toContain('Expected one real Article JSON-LD node');
    expect(errors.some((error) => error.includes('manuscript chunks missing from main HTML'))).toBe(true);
  });

  it('checks source fields in Article metadata and actual reciprocal localized targets', () => {
    const changed = pageHtml(guideUrls[0], guideUrls, articles[0]).replace(`"datePublished":"${date}"`, '"datePublished":"2000-01-01"');
    expect(indexablePageErrors(parseSeoHtml(changed, guideUrls[0]), { article: articles[0] })).toContain('Article JSON-LD datePublished differs from published source');
    const spanish = validGuide();
    const english = parseSeoHtml(pageHtml(guideUrls[1], guideUrls, articles[1]), guideUrls[1]);
    expect(reciprocalHreflangErrors(new Map([[guideUrls[0], spanish], [guideUrls[1], english]]))).toEqual([]);
    english.alternates = english.alternates.filter((alternate) => alternate.lang !== 'es');
    expect(reciprocalHreflangErrors(new Map([[guideUrls[0], spanish], [guideUrls[1], english]])).length).toBeGreaterThan(0);
  });
});

describe('sitemap and HTML discovery coverage', () => {
  it('parses actual sitemap entries, entity escapes and complete urlsets while ignoring comments', () => {
    const xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><!-- <url><loc>https://fake.test/</loc></url> --><url><loc>${origin}/es/?a=1&amp;b=2</loc></url></urlset>`;
    expect(sitemapUrls(xml)).toEqual([origin + '/es/?a=1&b=2']);
    expect(() => sitemapUrls(xml.replace('</urlset>', ''))).toThrow('complete urlset');
    expect(() => sitemapUrls('<urlset xmlns="bad"><url><loc>x</loc></url></urlset>')).toThrow('namespace');
  });

  it('rejects partial guide coverage, duplicate URLs and foreign URLs', () => {
    const errors = sitemapCoverageErrors([guideUrls[0], guideUrls[0], 'https://foreign.test/en/'], guideUrls, origin);
    expect(errors).toContain('Production sitemap contains duplicate URLs');
    expect(errors).toContain('Published URL missing from sitemap: ' + guideUrls[1]);
    expect(errors).toContain('Unexpected public sitemap URL: https://foreign.test/en/');
  });

  it('requires crawlable anchors for reachability and treats Cloudflare mail protection as auxiliary', () => {
    const home = origin + '/es/';
    const html = pageHtml(home, [home, origin + '/en/'], undefined, `<script>const href='${guideUrls[0]}';</script><a href="/cdn-cgi/l/email-protection#private">contact</a>`);
    const parsed = parseSeoHtml(html, home);
    expect(parsed.internalLinks).toEqual([]);
    expect(htmlReachability(new Map([[home, parsed], [guideUrls[0], validGuide()]]), [home]).unreachable).toEqual([guideUrls[0]]);
    const withAnchor = parseSeoHtml(html.replace('</main>', `<a href="${guideUrls[0]}">Read the guide</a></main>`), home);
    expect(htmlReachability(new Map([[home, withAnchor], [guideUrls[0], validGuide()]]), [home]).unreachable).toEqual([]);
    const nofollow = parseSeoHtml(html.replace('</main>', `<a rel="external nofollow" href="${guideUrls[0]}">Read the guide</a></main>`), home);
    expect(htmlReachability(new Map([[home, nofollow], [guideUrls[0], validGuide()]]), [home]).unreachable).toEqual([guideUrls[0]]);
  });
});

function fixtureSite() {
  const pairs = [
    [origin + '/es/', origin + '/en/'], guideUrls,
    [origin + '/es/destinos/sample-city/', origin + '/en/destinations/sample-city/'],
    [origin + '/es/explorar/country-test/', origin + '/en/explore/country-test/'],
  ];
  const urls = pairs.flat();
  const extra = urls.map((url) => `<a href="${url}">Destination</a>`).join('');
  const pages = new Map(urls.map((url) => [url, pageHtml(url, pairs.find((pair) => pair.includes(url))!, articles.find((article) => origin + publicArticlePath(article) === url), extra)]));
  const requests: string[] = [];
  const responseHeaders = new Map<string, Record<string, string>>();
  const responseStatuses = new Map<string, number>();
  const omittedSitemapUrls = new Set<string>();
  let rateLimit = false, breakWwwQuery = false;
  const fetchImpl: typeof fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url === origin + '/robots.txt') return new Response(`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml`, { headers: { 'content-type': 'text/plain' } });
    if (url === origin + '/sitemap.xml') return rateLimit
      ? new Response('Rate limited', { status: 429, headers: { 'retry-after': '60' } })
      : new Response(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.filter((href) => !omittedSitemapUrls.has(href)).map((href) => `<url><loc>${href}</loc></url>`).join('')}</urlset>`, { headers: { 'content-type': 'application/xml' } });
    if (new URL(url).hostname === 'www.example.test') {
      const parsed = new URL(url);
      return new Response('', { status: 301, headers: { location: origin + parsed.pathname + (breakWwwQuery ? '' : parsed.search) } });
    }
    if (url === origin + '/maletafeliz-launch-check-nonexistent/') return new Response('<meta name="robots" content="noindex"><main><h1>404</h1></main>', { status: 404, headers: { 'content-type': 'text/html' } });
    const html = pages.get(url);
    if (html === undefined) throw Error('Unexpected test request: ' + url);
    return new Response(html, { status: responseStatuses.get(url) || 200, headers: { 'content-type': 'text/html', ...responseHeaders.get(url) } });
  };
  return { urls, pages, requests, responseHeaders, responseStatuses, omittedSitemapUrls, fetchImpl, limit: () => { rateLimit = true; }, breakRedirectQuery: () => { breakWwwQuery = true; } };
}

describe('live verifier contract and safe HTTP policy', () => {
  it('verifies every exact sitemap URL, source guide and archive with at most two concurrent GETs', async () => {
    const site = fixtureSite();
    const result = await verifyLive({ origin, articles, fetchImpl: site.fetchImpl, expectedSitemapUrls: site.urls });
    expect(result.errors).toEqual([]);
    expect(result.httpVerified).toBe(true);
    expect(result.origin).toBe(origin);
    expect(Number.isFinite(Date.parse(result.checkedAt))).toBe(true);
    expect(result.checked.every((record) => 'path' in record && 'status' in record && 'finalUrl' in record)).toBe(true);
    expect(result.details.sitemapUrls).toBe(site.urls.length);
    expect(result.details.checkedSitemapPages).toBe(site.urls.length);
    expect(result.details.guideVersions).toBe(2);
    expect(result.details.maximumObservedConcurrentRequests).toBeLessThanOrEqual(2);
    for (const url of site.urls) expect(site.requests.filter((requested) => requested === url)).toHaveLength(1);
    expect(site.requests.every((url) => ['example.test', 'www.example.test'].includes(new URL(url).hostname))).toBe(true);
  });

  it('rejects a broken archive canonical, Googlebot response header and lost WWW query', async () => {
    const site = fixtureSite();
    const archive = origin + '/es/explorar/country-test/';
    site.pages.set(archive, site.pages.get(archive)!.replace(`rel="canonical" href="${archive}"`, 'rel="canonical" href="https://wrong.test/"'));
    site.responseHeaders.set(guideUrls[0], { 'x-robots-tag': 'googlebot: nofollow' });
    site.breakRedirectQuery();
    const result = await verifyLive({ origin, articles, fetchImpl: site.fetchImpl, expectedSitemapUrls: site.urls });
    expect(result.httpVerified).toBe(false);
    expect(result.errors.some((error) => error.includes('/es/explorar/country-test/') && error.includes('canonical'))).toBe(true);
    expect(result.errors.some((error) => error.includes('nofollow'))).toBe(true);
    expect(result.errors.some((error) => error.includes('preserving exact path/query'))).toBe(true);
  });

  it('compares the full production baseline, so omitting a country hub cannot pass guide-only coverage', async () => {
    const site = fixtureSite();
    const country = origin + '/es/explorar/country-test/';
    site.omittedSitemapUrls.add(country);
    const result = await verifyLive({ origin, articles, fetchImpl: site.fetchImpl, expectedSitemapUrls: site.urls });
    expect(result.httpVerified).toBe(false);
    expect(result.errors).toContain('Published URL missing from sitemap: ' + country);
    expect(site.requests.filter((url) => url === country)).toHaveLength(1);
  });

  it('checks unique linked HTML targets outside the sitemap and reports actual404 instead of ignoring them', async () => {
    const site = fixtureSite();
    const missing = origin + '/es/missing-linked-page/';
    for (const home of [origin + '/es/', origin + '/en/']) site.pages.set(home, site.pages.get(home)!.replace('</main>', `<a href="${missing}">Important link</a></main>`));
    site.pages.set(missing, '<meta name="robots" content="noindex"><main><h1>404</h1></main>');
    site.responseStatuses.set(missing, 404);
    const result = await verifyLive({ origin, articles, fetchImpl: site.fetchImpl, expectedSitemapUrls: site.urls });
    expect(result.httpVerified).toBe(false);
    expect(result.errors).toContain('/es/missing-linked-page/: expected HTTP 200, received 404');
    expect(site.requests.filter((url) => url === missing)).toHaveLength(1);
  });

  it('stops new requests on429, preserves Retry-After and never retries or changes identity', async () => {
    const site = fixtureSite();
    site.limit();
    const result = await verifyLive({ origin, articles, fetchImpl: site.fetchImpl, expectedSitemapUrls: site.urls });
    expect(result.httpVerified).toBe(false);
    expect(result.details.stopped?.retryAfter).toBe('60');
    expect(result.details.stopped?.reason).toBe('HTTP429');
    expect(site.requests.sort()).toEqual([origin + '/robots.txt', origin + '/sitemap.xml'].sort());
    expect(result.checked.find((record) => record.status === 429)?.headers['retry-after']).toBe('60');
    expect(retryAfterNotBefore('60', 0)).toBe('1970-01-01T00:01:00.000Z');
    expect(retryAfterNotBefore('Wed, 11 Nov 2026 17:00:00 GMT')).toBe('2026-11-11T17:00:00.000Z');

    // Hold a sitemap page's429 body open while the other worker gets a full
    // event-loop turn. No additional page may start after those headers arrive.
    const slow = fixtureSite();
    let releaseBody!: () => void;
    let headersArrived!: () => void;
    const headersReady = new Promise<void>((resolve) => { headersArrived = resolve; });
    const slowFetch: typeof fetch = async (input, options) => {
      if (String(input) !== slow.urls[0]) return slow.fetchImpl(input, options);
      slow.requests.push(String(input));
      const body = new ReadableStream<Uint8Array>({ start(controller) {
        releaseBody = () => { controller.enqueue(new TextEncoder().encode('Rate limited body')); controller.close(); };
      } });
      const response = new Response(body, { status: 429, headers: { 'retry-after': '60' } });
      headersArrived();
      return response;
    };
    const verification = verifyLive({ origin, articles, fetchImpl: slowFetch, expectedSitemapUrls: slow.urls });
    await headersReady;
    await new Promise<void>((resolve) => setImmediate(resolve));
    const pageRequestsBeforeBody = slow.requests.filter((url) => slow.urls.includes(url));
    releaseBody();
    const slowResult = await verification;
    expect(pageRequestsBeforeBody.length).toBeLessThanOrEqual(2);
    expect(slowResult.httpVerified).toBe(false);
    expect(slowResult.checked.find((record) => record.status === 429)?.bytes).toBe(Buffer.byteLength('Rate limited body'));
    expect(slowResult.details.stopped?.retryAfter).toBe('60');
  });

  it('bounds the shared pool at two and starts no additional tasks after a stop', async () => {
    let active = 0, maximum = 0, stopped = false;
    const started: number[] = [];
    await forEachAtMostTwo([0, 1, 2, 3, 4], async (value) => {
      started.push(value); maximum = Math.max(maximum, ++active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      if (value === 0) stopped = true;
      active--;
    }, () => stopped);
    expect(maximum).toBeLessThanOrEqual(2);
    expect(started).toEqual([0, 1]);
  });
});
