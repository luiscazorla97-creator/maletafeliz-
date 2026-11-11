import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readArticles } from './lib/content.mjs';
import {
  robotsAllows, parseSeoHtml, indexablePageErrors, reciprocalHreflangErrors,
  sitemapUrls, sitemapCoverageErrors, publicArticlePath, htmlReachability,
  indexingRestrictions, forEachAtMostTwo, retryAfterNotBefore,
} from './lib/live-seo.mjs';

const hash = (value) => createHash('sha256').update(value).digest('hex');

/** @typedef {{
 * url: string, lang: string, canonical: string[],
 * hreflang: {lang: string, href: string}[],
 * title: string[], description: string[], h1: string[], article: boolean,
 * articleJsonLdCount: number, mainTextSha256: string,
 * manuscriptPresentInHtml?: boolean, internalHtmlLinks: number, errors: string[]
 * }} LivePageDetails
 */
/** @typedef {{
 * sitemapUrls: number, guideVersions: number, checkedSitemapPages: number,
 * reachableSitemapPages: number, pages: LivePageDetails[],
 * expectedProductionSitemapUrls?: number, auxiliaryHtmlTargets?: string[],
 * guideMaximumHtmlDistance?: number, maximumObservedConcurrentRequests: number,
 * stopped?: {reason: string, url: string, retryAfter: string | null, notBefore: string | null}
 * }} LiveVerificationDetails
 */

/** Read-only public verification. Fetch injection keeps unit fixtures isolated.
 * The CLI writes the historical result contract only after verification ends.
 * @param {{origin?: string, articles?: object[], fetchImpl?: typeof fetch, expectedSitemapUrls?: string[]}} [options]
 */
export async function verifyLive({ origin = 'https://maletafeliz.com', articles, fetchImpl = fetch, expectedSitemapUrls } = {}) {
  const errors = [], checked = [], pages = new Map(), cache = new Map();
  /** @type {LivePageDetails[]} */
  const pageDetails = [];
  /** @type {LiveVerificationDetails['stopped']} */
  let stopped;
  let published = [], urls = [], active = 0, maximumActive = 0;
  /** @type {LiveVerificationDetails} */
  const details = { sitemapUrls: 0, guideVersions: 0, checkedSitemapPages: 0, reachableSitemapPages: 0, pages: pageDetails, maximumObservedConcurrentRequests: 0 };
  const pathFor = (url) => new URL(url).origin === origin ? new URL(url).pathname + new URL(url).search : url;
  async function get(url, expectedStatus = 200) {
    if (cache.has(url)) return cache.get(url);
    if (stopped) return null;
    const promise = (async () => {
      active++;
      maximumActive = Math.max(maximumActive, active);
      try {
        const response = await fetchImpl(url, {
          redirect: 'manual', signal: AbortSignal.timeout(30000),
          headers: { 'User-Agent': 'MaletaFeliz-Launch-Check/2.0 (+https://maletafeliz.com/)' },
        });
        const headers = response.headers;
        // Stop the other worker as soon as429 headers arrive, even if its body
        // is slow. The response body is still read and recorded below.
        if (response.status === 429) {
          stopped = { reason: 'HTTP429', url, retryAfter: headers.get('retry-after'), notBefore: retryAfterNotBefore(headers.get('retry-after')) };
          errors.push(`${pathFor(url)}: HTTP429; verification stopped without retry, Retry-After=${stopped.retryAfter || 'unspecified'}`);
        }
        const body = await response.text();
        checked.push({ path: pathFor(url), status: response.status, finalUrl: response.url || url,
          ...(headers.get('location') ? { location: headers.get('location') } : {}),
          sha256: hash(body), bytes: Buffer.byteLength(body),
          headers: Object.fromEntries(['content-type', 'x-robots-tag', 'retry-after', 'cf-mitigated', 'cf-cache-status', 'location']
            .filter((key) => headers.has(key)).map((key) => [key, headers.get(key)])),
        });
        if (response.status !== 429 && response.status !== expectedStatus) errors.push(`${pathFor(url)}: expected HTTP ${expectedStatus}, received ${response.status}`);
        if ((response.url || url) !== url) errors.push(`${pathFor(url)}: unexpected final URL ${response.url}`);
        return { status: response.status, finalUrl: response.url || url, headers, body };
      } catch (error) {
        checked.push({ path: pathFor(url), status: null, finalUrl: url, error: error.cause?.code || error.name });
        errors.push(`${pathFor(url)}: HTTPS request failed (${error.cause?.code || error.name})`);
        return null;
      } finally { active--; }
    })();
    cache.set(url, promise);
    return promise;
  }

  try {
    if (new URL(origin).protocol !== 'https:') throw Error('Public origin must use HTTPS');
    published = articles || readArticles().map(({ data }) => data).filter((article) => article.status === 'published');
    details.guideVersions = published.length;
    if (!published.length) errors.push('No published source guides available for public verification');
    const sourceByUrl = new Map(published.map((article) => [origin + publicArticlePath(article), article]));
    const sourceByVersion = new Map(published.map((article) => [`${article.id}/${article.locale}`, article]));
    const homes = [origin + '/es/', origin + '/en/'];
    const destinations = published.map((article) => origin + `/${article.locale}/${article.locale === 'es' ? 'destinos' : 'destinations'}/${article.destinationId}/`);
    const required = [...new Set([...homes, ...sourceByUrl.keys(), ...destinations])];
    let expectedUrls = expectedSitemapUrls;
    if (!expectedUrls) {
      try {
        const [localRobots, localXml] = await Promise.all([readFile(resolve('dist/robots.txt'), 'utf8'), readFile(resolve('dist/sitemap.xml'), 'utf8')]);
        if (!required.every((url) => robotsAllows(localRobots, url, 'Googlebot') && robotsAllows(localRobots, url, '*'))
          || !localRobots.includes('Sitemap: ' + origin + '/sitemap.xml')) throw Error('dist is not an indexable production release');
        expectedUrls = sitemapUrls(localXml);
      } catch (error) { throw Error(`Verified production dist/sitemap.xml and robots.txt are required; run npm run build:release first (${error.message})`); }
    }
    const expectedErrors = sitemapCoverageErrors(expectedUrls, required, origin);
    if (expectedErrors.length) throw Error('Production sitemap baseline is incomplete: ' + expectedErrors.join('; '));
    details.expectedProductionSitemapUrls = expectedUrls.length;
    const [robots, sitemap] = await Promise.all([get(origin + '/robots.txt'), get(origin + '/sitemap.xml')]);
    if (!robots || !sitemap || stopped) throw Error('Cannot finish verification without current robots and sitemap');
    if (robots.status !== 200 || sitemap.status !== 200) throw Error('Robots or sitemap is not publicly HTTP200');
    if (!robots.body.split(/\r?\n/).some((line) => /^\s*Sitemap:\s*/i.test(line) && line.replace(/^\s*Sitemap:\s*/i, '').trim() === origin + '/sitemap.xml')) errors.push('robots.txt does not declare the canonical sitemap');
    urls = sitemapUrls(sitemap.body);
    details.sitemapUrls = urls.length;
    errors.push(...sitemapCoverageErrors(urls, [...required, ...expectedUrls], origin));
    const expectedSet = new Set(expectedUrls);
    for (const url of urls) if (!expectedSet.has(url)) errors.push(`Public sitemap URL absent from verified production baseline: ${url}`);
    const validUrls = [...new Set(urls)].filter((url) => {
      try { return new URL(url).origin === origin && new URL(url).protocol === 'https:'; }
      catch { return false; }
    });
    for (const url of new Set([...validUrls, ...required])) for (const agent of ['Googlebot', '*']) {
      if (!robotsAllows(robots.body, url, agent)) errors.push(`${pathFor(url)}: robots.txt blocks ${agent}`);
    }
    await forEachAtMostTwo(validUrls, async (url) => {
      const response = await get(url);
      if (!response || response.status !== 200) return;
      if (!/^text\/html(?:;|$)/i.test(response.headers.get('content-type') || '')) errors.push(`${pathFor(url)}: expected HTML content type`);
      const page = parseSeoHtml(response.body, url);
      pages.set(url, page);
      const article = sourceByUrl.get(url);
      const alternateUrls = article ? Object.fromEntries(['es', 'en'].flatMap((locale) => {
        const translated = sourceByVersion.get(`${article.id}/${locale}`);
        if (!translated) { errors.push(`${pathFor(url)}: missing published ${locale} source translation`); return []; }
        return [[locale, origin + publicArticlePath(translated)]];
      })) : undefined;
      const pageErrors = indexablePageErrors(page, { xRobotsTag: response.headers.get('x-robots-tag') || '', article, alternateUrls });
      for (const message of pageErrors) errors.push(`${pathFor(url)}: ${message}`);
      if (article) for (const relatedId of article.relatedIds || []) {
        const related = sourceByVersion.get(`${relatedId}/${article.locale}`);
        if (related && !page.internalLinks.includes(origin + publicArticlePath(related))) errors.push(`${pathFor(url)}: related guide ${relatedId} is not linked in HTML`);
      }
      pageDetails.push({ url, lang: page.lang, canonical: page.canonicals, hreflang: page.alternates,
        title: page.titles, description: page.descriptions, h1: page.h1,
        article: !!article, articleJsonLdCount: page.articleJsonLd.length,
        mainTextSha256: hash(page.mainText), manuscriptPresentInHtml: article ? !pageErrors.some((message) => message.includes('manuscript')) : undefined,
        internalHtmlLinks: page.internalLinks.length, errors: pageErrors });
    }, () => !!stopped);
    details.checkedSitemapPages = pages.size;
    if (!stopped) {
      errors.push(...reciprocalHreflangErrors(pages));
      const auxiliaryTargets = [...new Set([...pages.values()].flatMap((page) => page.internalLinks))]
        .filter((url) => !pages.has(url));
      details.auxiliaryHtmlTargets = auxiliaryTargets;
      await forEachAtMostTwo(auxiliaryTargets, async (url) => {
        const response = await get(url);
        if (!response || response.status !== 200) return;
        if (/^text\/html(?:;|$)/i.test(response.headers.get('content-type') || '')) {
          const parsed = parseSeoHtml(response.body, url);
          if (!indexingRestrictions(parsed.robots, response.headers.get('x-robots-tag') || '').includes('noindex'))
            errors.push(`${pathFor(url)}: linked indexable HTML route is absent from the public/production sitemap`);
        }
      }, () => !!stopped);
      const reachability = htmlReachability(pages, homes);
      details.reachableSitemapPages = reachability.distances.size;
      details.guideMaximumHtmlDistance = Math.max(0, ...[...sourceByUrl.keys()].map((url) => reachability.distances.get(url) || 0));
      for (const url of reachability.unreachable) errors.push(`${pathFor(url)}: sitemap page unreachable through HTML links from localized homes`);
      if (pages.size !== new Set(urls).size) errors.push('Not every exact sitemap URL completed public HTML verification');
      for (const url of sourceByUrl.keys()) if (!pages.has(url)) errors.push(`${pathFor(url)}: published guide was not verified as public HTML`);
      const missing = await get(origin + '/maletafeliz-launch-check-nonexistent/', 404);
      if (missing && missing.status === 404) {
        const page = parseSeoHtml(missing.body, origin + '/maletafeliz-launch-check-nonexistent/');
        if (!indexingRestrictions(page.robots, missing.headers.get('x-robots-tag') || '').includes('noindex')) errors.push('Nonexistent route404 lacks noindex');
      }
      await forEachAtMostTwo(['/', '/es/?ref=www-check&lang=es', '/en/?ref=www-check&lang=en'], async (pathname) => {
        const url = 'https://www.' + new URL(origin).host + pathname;
        const response = await get(url, 301);
        if (response && response.headers.get('location') !== origin + pathname) errors.push(`${url}: expected permanent redirect preserving exact path/query; received ${response.headers.get('location')}`);
      }, () => !!stopped);
    }
  } catch (error) { errors.push(`Verification could not complete: ${error.message}`); }
  details.maximumObservedConcurrentRequests = maximumActive;
  if (stopped) details.stopped = stopped;
  return { checkedAt: new Date().toISOString(), origin, httpVerified: errors.length === 0 && !stopped,
    checked, errors, details };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const result = await verifyLive();
  await writeFile('/tmp/maletafeliz-live-verification.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  if (!result.httpVerified) process.exitCode = 1;
}
