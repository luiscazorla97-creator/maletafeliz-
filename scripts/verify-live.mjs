import { writeFile } from 'node:fs/promises';
import { readArticles } from './lib/content.mjs';

const origin = 'https://maletafeliz.com';
const articles = readArticles()
  .map(({ data }) => data)
  .filter((a) => a.status === 'published');
const errors = [];
const checked = [];
async function get(path, status = 200) {
  try {
    const response = await fetch(origin + path, {
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': 'MaletaFeliz-Launch-Check/1.0' },
    });
    checked.push({ path, status: response.status, finalUrl: response.url });
    if (response.status !== status)
      errors.push(
        `${path}: expected HTTP ${status}, received ${response.status}`,
      );
    if (!response.url.startsWith(origin + '/'))
      errors.push(`${path}: unexpected destination ${response.url}`);
    return await response.text();
  } catch (error) {
    errors.push(
      `${path}: HTTPS request failed (${error.cause?.code || error.name})`,
    );
    return '';
  }
}
const home = await get('/es/');
if (home) {
  const english = await get('/en/');
  if (!home.includes('El mundo es grande'))
    errors.push('/es/: expected home heading missing');
  if (!english.includes('A big, beautiful world'))
    errors.push('/en/: expected home heading missing');
  for (const article of articles) {
    const path = `/${article.locale}/${article.locale === 'es' ? 'guias' : 'guides'}/${article.slug}/`;
    const html = await get(path);
    if (
      !html.includes('index,follow,max-image-preview:large') ||
      /<meta[^>]+name="robots"[^>]+noindex/.test(html)
    )
      errors.push(`${path}: production indexing metadata missing`);
    if (!html.includes(`href="${origin}${path}"`))
      errors.push(`${path}: canonical URL missing`);
  }
  const sitemap = await get('/sitemap.xml');
  if (!sitemap.includes('<url>') || !sitemap.includes(origin + '/es/guias/'))
    errors.push('Production sitemap is empty or incomplete');
  const robots = await get('/robots.txt');
  if (!robots.includes('Allow: /') || /Disallow: \/\s/.test(robots))
    errors.push('Production robots.txt blocks crawling');
  await get('/maletafeliz-launch-check-nonexistent/', 404);
  for (const path of ['/', '/es/?ref=www-check', '/en/']) {
    const url = 'https://www.maletafeliz.com' + path;
    try {
      const response = await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(30000),
      });
      const location = response.headers.get('location');
      checked.push({ path: url, status: response.status, location });
      if (response.status !== 301 || location !== origin + path)
        errors.push(
          `${url}: expected permanent redirect preserving path/query; received HTTP ${response.status} and ${location}`,
        );
    } catch (error) {
      errors.push(
        `${url}: redirect verification failed (${error.cause?.code || error.name})`,
      );
    }
  }
}
const result = {
  checkedAt: new Date().toISOString(),
  origin,
  httpVerified: errors.length === 0,
  checked,
  errors,
};
await writeFile(
  '/tmp/maletafeliz-live-verification.json',
  JSON.stringify(result, null, 2) + '\n',
);
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
