import { parse } from 'parse5';

const asciiTrim = (value) => value.replace(/^[\t\n\r\f ]+|[\t\n\r\f ]+$/g, '');
const normalizePath = (value) => [...value].map((character) => character.codePointAt(0) > 127 ? encodeURIComponent(character) : character).join('')
  .replace(/%[a-f0-9]{2}/gi, (escape) => {
    const character = String.fromCharCode(parseInt(escape.slice(1), 16));
    return /^[a-z0-9._~-]$/i.test(character) ? character : escape.toUpperCase();
  });

/**
 * Evaluate the applicable robots group, not a global substring such as Allow:/.
 * Equally specific UA groups combine; the longest matching path wins and Allow
 * wins a path-length tie. Empty Disallow does not block anything. Query strings
 * are part of matching; fragments are not. This also accepts absolute URLs.
 * @param {string} robotsText
 * @param {string} pathOrUrl
 * @param {string} [userAgent]
 * @returns {boolean}
 */
export function robotsAllows(robotsText, pathOrUrl, userAgent = 'Googlebot') {
  const groups = [];
  let group;
  for (const line of robotsText.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const match = line.replace(/#.*/, '').match(/^\s*([^:]+):(.*)$/);
    if (!match) continue;
    const key = asciiTrim(match[1]).toLowerCase(), value = asciiTrim(match[2]);
    if (key === 'user-agent') {
      if (!group || group.hasRules) {
        group = { agents: [], rules: [], hasRules: false };
        groups.push(group);
      }
      if (value) group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(key)) {
      group.hasRules = true;
      if (value) group.rules.push({ allow: key === 'allow', path: normalizePath(value) });
    }
  }
  const bot = userAgent.toLowerCase();
  const matching = groups.flatMap((entry) => entry.agents
    .filter((agent) => agent === '*' || bot.includes(agent))
    .map((agent) => ({ group: entry, specificity: agent === '*' ? 0 : agent.length })));
  if (!matching.length) return true;
  const specificity = Math.max(...matching.map((entry) => entry.specificity));
  const parsed = new URL(pathOrUrl, 'https://maletafeliz.com');
  const pathname = normalizePath(parsed.pathname + parsed.search);
  const rules = matching.filter((entry) => entry.specificity === specificity).flatMap((entry) => entry.group.rules)
    .filter((rule) => {
      const end = rule.path.endsWith('$'), pattern = end ? rule.path.slice(0, -1) : rule.path;
      const regex = pattern.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
      return new RegExp('^' + regex + (end ? '$' : '')).test(pathname);
    }).sort((a, b) => b.path.replace(/\*|\$$/g, '').length - a.path.replace(/\*|\$$/g, '').length || Number(b.allow) - Number(a.allow));
  return !rules.length || rules[0].allow;
}

const attr = (node, name) => node.attrs?.find((entry) => entry.name === name)?.value;
const nodesUnder = (node) => [node, ...(node.childNodes || []).flatMap(nodesUnder)];
const normalizeText = (value) => (value || '').replace(/\s+/gu, ' ').trim();
const textBlocks = new Set(['article', 'section', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'li', 'ul', 'ol', 'dl', 'dt', 'dd', 'figure', 'figcaption', 'nav', 'aside', 'header', 'footer', 'details', 'summary', 'br']);
function htmlText(node) {
  if (!node) return '';
  if (node.nodeName === '#text') return node.value;
  if (['script', 'style', 'template', 'noscript'].includes(node.tagName)) return '';
  const value = (node.childNodes || []).map(htmlText).join('');
  return textBlocks.has(node.tagName) ? ` ${value} ` : value;
}
const tokens = (value) => (value || '').toLowerCase().split(/[\s,;]+/).filter(Boolean);
const includesToken = (value, token) => asciiTrim(value || '').toLowerCase().split(/[\t\n\r\f ]+/).includes(token);

/** Relevant restrictive directives; an unrelated bot's header is not global.
 * @param {{name: string, content: string}[]} metaEntries
 * @param {string | string[]} [xRobotsTag]
 * @param {string} [userAgent]
 */
export function indexingRestrictions(metaEntries, xRobotsTag = '', userAgent = 'Googlebot') {
  const restrictions = new Set();
  const bot = userAgent.toLowerCase();
  const valued = new Set(['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after']);
  const add = (value) => {
    for (const segment of value.toLowerCase().split(',')) {
      if (valued.has(segment.trim().split(':', 1)[0])) continue;
      for (const directive of tokens(segment)) {
        if (['noindex', 'nofollow'].includes(directive)) restrictions.add(directive);
        if (directive === 'none') { restrictions.add('noindex'); restrictions.add('nofollow'); }
      }
    }
  };
  for (const entry of metaEntries) {
    if (entry.name.toLowerCase() === 'robots' || entry.name.toLowerCase() === bot) add(entry.content);
  }
  for (const header of Array.isArray(xRobotsTag) ? xRobotsTag : [xRobotsTag]) {
    let scope = '';
    for (let segment of header.split(',')) {
      const scoped = segment.match(/^\s*([a-z][a-z0-9_-]*)\s*:\s*(.*)$/i);
      if (scoped && !valued.has(scoped[1].toLowerCase())) {
        scope = scoped[1].toLowerCase();
        segment = scoped[2];
      }
      if (!scope || bot === scope) add(segment);
    }
  }
  return [...restrictions].sort();
}

/** Parse actual HTML elements, excluding JS/data blocks from manuscript text.
 * @param {string} html
 * @param {string} url
 */
export function parseSeoHtml(html, url) {
  const nodes = nodesUnder(parse(html, { scriptingEnabled: true }));
  const elements = (tag) => nodes.filter((node) => node.tagName === tag);
  const mains = elements('main');
  const meta = elements('meta');
  const links = elements('link');
  const structuredData = [], parseErrors = [];
  for (const script of elements('script').filter((node) => (attr(node, 'type') || '').toLowerCase() === 'application/ld+json')) {
    try {
      const value = JSON.parse((script.childNodes || []).map((node) => node.value || '').join(''));
      const graph = Array.isArray(value) ? value : value['@graph'] || [value];
      if (!Array.isArray(graph) || graph.some((entry) => !entry || typeof entry !== 'object')) throw Error('Invalid JSON-LD graph');
      structuredData.push(...graph);
    } catch (error) { parseErrors.push(`Invalid JSON-LD: ${error.message}`); }
  }
  const internalLinks = [];
  for (const anchor of elements('a')) {
    const href = attr(anchor, 'href');
    if (!href || includesToken(attr(anchor, 'rel'), 'nofollow')) continue;
    try {
      const target = new URL(href, url), current = new URL(url);
      if (['http:', 'https:'].includes(target.protocol) && [current.hostname, 'www.' + current.hostname].includes(target.hostname)
        && !target.pathname.startsWith('/cdn-cgi/')) internalLinks.push(current.origin + target.pathname);
    } catch { parseErrors.push(`Invalid anchor URL: ${href}`); }
  }
  return {
    url,
    lang: attr(elements('html')[0], 'lang') || '',
    titles: elements('title').map((node) => normalizeText(htmlText(node))),
    descriptions: meta.filter((node) => (attr(node, 'name') || '').toLowerCase() === 'description').map((node) => normalizeText(attr(node, 'content'))),
    h1: mains.flatMap((main) => nodesUnder(main).filter((node) => node.tagName === 'h1')).map((node) => normalizeText(htmlText(node))),
    mainCount: mains.length,
    mainText: mains.map((node) => normalizeText(htmlText(node))).join(' '),
    canonicals: links.filter((node) => includesToken(attr(node, 'rel'), 'canonical')).map((node) => attr(node, 'href') || ''),
    alternates: links.filter((node) => includesToken(attr(node, 'rel'), 'alternate') && attr(node, 'hreflang'))
      .map((node) => ({ lang: attr(node, 'hreflang'), href: attr(node, 'href') || '' })),
    robots: meta.filter((node) => attr(node, 'name')).map((node) => ({ name: attr(node, 'name'), content: attr(node, 'content') || '' })),
    articleJsonLd: structuredData.filter((entry) => entry['@type'] === 'Article' || (Array.isArray(entry['@type']) && entry['@type'].includes('Article'))),
    internalLinks: [...new Set(internalLinks)],
    parseErrors,
  };
}

/** @param {object} article */
export function publicArticlePath(article) {
  return `/${article.locale}/${article.locale === 'es' ? 'guias' : 'guides'}/${article.slug}/`;
}

/** Semantic checks for one page intentionally selected for indexing.
 * @param {ReturnType<typeof parseSeoHtml>} page
 * @param {{xRobotsTag?: string | string[], article?: object, alternateUrls?: Record<string,string>}} [options]
 */
export function indexablePageErrors(page, { xRobotsTag = '', article, alternateUrls } = {}) {
  const errors = [...page.parseErrors];
  const locale = new URL(page.url).pathname.split('/')[1];
  if (!['es', 'en'].includes(locale) || page.lang !== locale) errors.push(`HTML language ${page.lang} does not match URL locale ${locale}`);
  for (const [label, values] of [['title', page.titles], ['description', page.descriptions], ['H1', page.h1]]) {
    if (values.length !== 1 || !values[0]) errors.push(`Expected one nonempty ${label}`);
  }
  if (page.mainCount !== 1 || !page.mainText) errors.push('Expected one nonempty main element in server HTML');
  if (page.canonicals.length !== 1 || page.canonicals[0] !== page.url) errors.push('Expected one exact self-referencing canonical link');
  const blocked = indexingRestrictions(page.robots, xRobotsTag);
  if (blocked.length) errors.push(`Restrictive indexing/follow directives: ${blocked.join(', ')}`);
  for (const lang of ['es', 'en']) {
    const targets = page.alternates.filter((entry) => entry.lang === lang);
    if (targets.length !== 1) errors.push(`Expected one ${lang} hreflang alternate`);
    else if ((lang === locale && targets[0].href !== page.url) || (alternateUrls?.[lang] && targets[0].href !== alternateUrls[lang])) errors.push(`Incorrect ${lang} hreflang target`);
  }
  if (article) {
    if (page.titles[0] !== article.title + ' | MaletaFeliz' || page.descriptions[0] !== article.description || page.h1[0] !== article.title) errors.push('Guide title/description/H1 differ from published source');
    if (page.articleJsonLd.length !== 1) errors.push('Expected one real Article JSON-LD node');
    const ld = page.articleJsonLd[0];
    const expected = { headline: article.title, description: article.description, inLanguage: article.locale,
      datePublished: article.publishedAt, dateModified: article.updatedAt || article.publishedAt };
    for (const [key, value] of Object.entries(expected)) if (!value || ld?.[key] !== value) errors.push(`Article JSON-LD ${key} differs from published source`);
    if ((typeof ld?.mainEntityOfPage === 'string' ? ld.mainEntityOfPage : ld?.mainEntityOfPage?.['@id']) !== page.url) errors.push('Article JSON-LD mainEntityOfPage does not identify this guide');
    const chunks = [article.title, article.description, ...(article.intro || []),
      ...(article.quickFacts || []).flatMap((item) => [item.label, item.value]),
      ...(article.sections || []).flatMap((section) => [section.heading, ...section.paragraphs]),
      ...(article.itinerary || []), ...(article.faq || []).flatMap((entry) => [entry.question, entry.answer]), article.conclusion].filter(Boolean);
    const missing = chunks.filter((chunk) => !page.mainText.includes(normalizeText(chunk)));
    if (missing.length) errors.push(`${missing.length} published manuscript chunks missing from main HTML (scripts do not count)`);
  }
  return errors;
}

/** @param {Map<string, ReturnType<typeof parseSeoHtml>>} pages */
export function reciprocalHreflangErrors(pages) {
  const errors = [];
  for (const [url, page] of pages) for (const alternate of page.alternates.filter((entry) => ['es', 'en'].includes(entry.lang))) {
    const target = pages.get(alternate.href);
    if (!target || target.lang !== alternate.lang) errors.push(`${url}: ${alternate.lang} hreflang target unavailable or wrong language`);
    else if (!target.alternates.some((entry) => entry.lang === page.lang && entry.href === url)) errors.push(`${url}: ${alternate.lang} hreflang is not reciprocal`);
  }
  return errors;
}

/** Read the generated urlset structurally, excluding comments and duplicate loc.
 * @param {string} xml
 */
export function sitemapUrls(xml) {
  if (!/<\/urlset>\s*$/i.test(xml)) throw Error('Sitemap has no complete urlset');
  const elements = nodesUnder(parse(xml, { scriptingEnabled: false }));
  const roots = elements.filter((node) => node.tagName === 'urlset');
  if (roots.length !== 1 || attr(roots[0], 'xmlns') !== 'http://www.sitemaps.org/schemas/sitemap/0.9') throw Error('Invalid sitemap urlset namespace');
  return nodesUnder(roots[0]).filter((node) => node.tagName === 'url').map((node) => {
    const loc = nodesUnder(node).filter((child) => child.tagName === 'loc');
    if (loc.length !== 1 || !normalizeText(htmlText(loc[0]))) throw Error('Each sitemap entry must have one nonempty loc');
    return normalizeText(htmlText(loc[0]));
  });
}

/** @param {string[]} urls @param {string[]} required @param {string} origin */
export function sitemapCoverageErrors(urls, required, origin) {
  const errors = [], unique = new Set(urls);
  if (!urls.length) errors.push('Production sitemap is empty');
  if (unique.size !== urls.length) errors.push('Production sitemap contains duplicate URLs');
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== origin || parsed.search || parsed.hash || !/^\/(es|en)\//.test(parsed.pathname)) errors.push(`Unexpected public sitemap URL: ${url}`);
    } catch { errors.push(`Invalid public sitemap URL: ${url}`); }
  }
  for (const url of new Set(required)) if (!unique.has(url)) errors.push(`Published URL missing from sitemap: ${url}`);
  return errors;
}

/** @param {Map<string, ReturnType<typeof parseSeoHtml>>} pages @param {string[]} starts */
export function htmlReachability(pages, starts) {
  const distances = new Map(starts.filter((url) => pages.has(url)).map((url) => [url, 0]));
  const queue = [...distances.keys()];
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    for (const target of pages.get(current).internalLinks) {
      if (pages.has(target) && !distances.has(target)) { distances.set(target, distances.get(current) + 1); queue.push(target); }
    }
  }
  return { distances, unreachable: [...pages.keys()].filter((url) => !distances.has(url)) };
}

/** @template T @param {T[]} items @param {(item:T)=>Promise<unknown>} operation @param {()=>boolean} [shouldStop] */
export async function forEachAtMostTwo(items, operation, shouldStop = () => false) {
  let next = 0;
  await Promise.all([0, 1].map(async () => {
    while (next < items.length && !shouldStop()) await operation(items[next++]);
  }));
}

/** @param {string | null} value @param {number} [now] */
export function retryAfterNotBefore(value, now = Date.now()) {
  if (!value) return null;
  const timestamp = /^\d+$/.test(value) ? now + Number(value) * 1000 : Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}
