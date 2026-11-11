import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';
import { robotsAllows } from '../../scripts/lib/live-seo.mjs';

const articles = readdirSync('content/articles')
  .filter((file) => file.endsWith('.json'))
  .map((file) =>
    JSON.parse(readFileSync(join('content/articles', file), 'utf8')),
  )
  .filter((a) => a.status === 'published');
const plan = JSON.parse(readFileSync('editorial/plan.json', 'utf8'));
const pathFor = (a: any) =>
  `/${a.locale}/${a.locale === 'es' ? 'guias' : 'guides'}/${a.slug}/`;

type HtmlNode = {
  tagName?: string;
  value?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: HtmlNode[];
};
const nodes = (node: HtmlNode): HtmlNode[] => [
  node,
  ...(node.childNodes || []).flatMap(nodes),
];
const attribute = (node: HtmlNode, name: string) =>
  node.attrs?.find((item) => item.name === name)?.value;
const text = (node: HtmlNode): string =>
  node.value || (node.childNodes || []).map(text).join('');
const htmlFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? htmlFiles(join(directory, entry.name))
      : entry.name.endsWith('.html')
        ? [join(directory, entry.name)]
        : [],
  );

test('indexable pages expose valid metadata and distinct titles within each language', () => {
  const titlesByLanguage = new Map<string, Map<string, string[]>>();
  for (const file of htmlFiles('dist')) {
    const elements = nodes(parse(readFileSync(file, 'utf8')) as HtmlNode);
    const meta = elements.filter((node) => node.tagName === 'meta');
    if (
      meta.some(
        (node) =>
          attribute(node, 'name') === 'robots' &&
          /noindex/i.test(attribute(node, 'content') || ''),
      )
    )
      continue;
    const titles = elements.filter((node) => node.tagName === 'title');
    const descriptions = meta.filter(
      (node) => attribute(node, 'name') === 'description',
    );
    const headings = elements.filter((node) => node.tagName === 'h1');
    const canonicals = elements.filter(
      (node) =>
        node.tagName === 'link' && attribute(node, 'rel') === 'canonical',
    );
    expect(titles, file).toHaveLength(1);
    expect(descriptions, file).toHaveLength(1);
    expect(headings, file).toHaveLength(1);
    expect(canonicals, file).toHaveLength(1);
    expect(text(titles[0]).trim(), file).not.toBe('');
    expect(attribute(descriptions[0], 'content')?.trim(), file).toBeTruthy();
    expect(text(headings[0]).trim(), file).not.toBe('');
    const html = elements.find((node) => node.tagName === 'html')!;
    const lang = attribute(html, 'lang')!;
    expect(['es', 'en'], file).toContain(lang);
    const title = text(titles[0]).trim();
    const canonical = attribute(canonicals[0], 'href')!;
    const byTitle = titlesByLanguage.get(lang) || new Map<string, string[]>();
    byTitle.set(title, [...(byTitle.get(title) || []), canonical]);
    titlesByLanguage.set(lang, byTitle);
  }
  // Translations can legitimately share a place name. Distinct pages within
  // one language must identify their scope, including country/city homonyms.
  for (const lang of ['es', 'en'])
    expect(titlesByLanguage.get(lang)?.size, `${lang}: production must contain indexable pages`)
      .toBeGreaterThanOrEqual(articles.filter((article) => article.locale === lang).length);
  const duplicates = [...titlesByLanguage].flatMap(([lang, titles]) =>
    [...titles]
      .filter(([, urls]) => urls.length > 1)
      .map(([title, urls]) => ({ lang, title, urls })),
  );
  expect(titlesByLanguage.size).toBe(2);
  expect(duplicates).toEqual([]);
});

test('production robots allows every published guide and destination route', () => {
  const robots = readFileSync('dist/robots.txt', 'utf8');
  const required = new Set(
    articles.flatMap((article) => [
      pathFor(article),
      `/${article.locale}/${article.locale === 'es' ? 'destinos' : 'destinations'}/${article.destinationId}/`,
    ]),
  );
  for (const path of required) {
    expect(robotsAllows(robots, path), `Googlebot: ${path}`).toBe(true);
    expect(robotsAllows(robots, path, '*'), `Wildcard: ${path}`).toBe(true);
  }
});

for (const lang of ['es', 'en']) {
  test(`${lang}: guide directory exposes every article without JavaScript`, async ({
    browser,
    baseURL,
    viewport,
    isMobile,
    hasTouch,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      viewport,
      isMobile,
      hasTouch,
    });
    const page = await context.newPage();
    await page.route('**/*', (route) =>
      new URL(route.request().url()).origin === new URL(baseURL!).origin
        ? route.continue()
        : route.abort(),
    );
    const path = `/${lang}/${lang === 'es' ? 'guias' : 'guides'}/`;
    expect((await page.goto(path))?.status()).toBe(200);
    const available = articles.filter((a) => a.locale === lang);
    const links = await page
      .locator('main .card-grid a.destination-card')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
    expect(links.sort()).toEqual(available.map(pathFor).sort());
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website',
    );
    const schema = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) || '{}',
    );
    const collection = schema['@graph'].find(
      (node: any) => node['@type'] === 'CollectionPage',
    );
    expect(
      collection.mainEntity.itemListElement
        .map((item: any) => item.item)
        .sort(),
    ).toEqual(
      available.map((a) => `https://maletafeliz.com${pathFor(a)}`).sort(),
    );
    await page.locator(`main a[href="${pathFor(available[0])}"]`).click();
    await expect(page.locator('h1')).toHaveText(available[0].title);
    await expect(page.locator('.prose')).toContainText(
      available[0].sections[0].paragraphs[0],
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article',
    );
    await context.close();
  });
}

test('sitemap includes exactly the existing indexable HTML routes and reciprocal alternates', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  const crawl = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? crawl(join(directory, entry.name))
        : entry.name.endsWith('.html')
          ? [join(directory, entry.name)]
          : [],
    );
  const canonicalPages = crawl('dist')
    .map((file) => readFileSync(file, 'utf8'))
    .filter(
      (html) => !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html),
    );
  const canonicalUrls = canonicalPages.map(
    (html) => html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1],
  );
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls.sort()).toEqual(canonicalUrls.sort());
  for (const html of canonicalPages) {
    const canonical = html.match(
      /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/,
    )![1];
    const entry = sitemap
      .split('<url>')
      .find((value) => value.startsWith(`<loc>${canonical}</loc>`))!;
    for (const alternate of html.matchAll(
      /<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g,
    )) {
      expect(entry).toContain(
        `hreflang="${alternate[1]}" href="${alternate[2]}"`,
      );
    }
  }
});

test('all article and destination country labels expose their existing country hubs', () => {
  for (const article of articles) {
    const destination = plan.find(
      (topic: any) => topic.id === article.destinationId,
    );
    const country = `/${article.locale}/${article.locale === 'es' ? 'explorar' : 'explore'}/country-${destination.countryId}/`;
    const guide = readFileSync(
      join('dist', pathFor(article), 'index.html'),
      'utf8',
    );
    const destinationPath = `/${article.locale}/${article.locale === 'es' ? 'destinos' : 'destinations'}/${article.destinationId}/`;
    const city = readFileSync(
      join('dist', destinationPath, 'index.html'),
      'utf8',
    );
    expect(guide).toContain(`href="${country}"`);
    expect(city).toContain(`href="${country}"`);
  }
});
