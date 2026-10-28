import type { APIRoute } from 'astro';
import { production, SITE } from '../lib/site';
export const GET: APIRoute = () =>
  new Response(
    production
      ? `User-agent: *\nAllow: /\nDisallow: /es/buscar/\nDisallow: /en/search/\nSitemap: ${SITE}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
