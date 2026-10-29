import { validateEditorial, readJson, readArticles } from './lib/content.mjs';
import { existsSync } from 'node:fs';
const plan = readJson('editorial/plan.json'),
  site = readJson('editorial/site.json'),
  articles = readArticles();
console.log(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        ...validateEditorial(),
        note: 'Counts reflect local content states, not a verified public deployment.',
      },
      automation: site.automation,
      publication: existsSync('editorial/publication.json')
        ? readJson('editorial/publication.json')
        : null,
      coverage: plan.map((p) => ({
        id: p.id,
        continent: p.continent,
        country: p.country.es,
        city: p.city.es,
        intent: p.intent,
        plannedPlaces: p.placeCount,
        versions: Object.fromEntries(
          ['es', 'en'].map((l) => [
            l,
            articles.find((a) => a.data.id === p.id && a.data.locale === l)
              ?.data.status || 'pending',
          ]),
        ),
        research: p.researchStatus,
        images: p.imageStatus,
      })),
    },
    null,
    2,
  ),
);
