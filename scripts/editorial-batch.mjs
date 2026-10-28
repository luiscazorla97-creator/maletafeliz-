import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { readJson, readArticles } from './lib/content.mjs';
const count = Number(process.argv[2] || 5);
if (!Number.isInteger(count) || count < 1 || count > 5)
  throw Error(
    'Choose between 1 and 5 topics. This script only reserves a batch; it does not generate or publish content.',
  );
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const path = `editorial/batches/${today}.json`;
await mkdir('editorial/batches', { recursive: true });
try {
  const existing = JSON.parse(await readFile(path, 'utf8'));
  console.log(JSON.stringify({ reused: true, batch: existing }, null, 2));
  process.exit(0);
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
const plan = readJson('editorial/plan.json'),
  articles = readArticles().map((a) => a.data);
const pending = plan.filter(
  (t) =>
    !['es', 'en'].every((lang) =>
      articles.some(
        (a) => a.id === t.id && a.locale === lang && a.status === 'published',
      ),
    ),
);
const selected = [];
for (const continent of ['america', 'europe', 'asia', 'africa', 'oceania']) {
  const topic = pending.find(
    (t) => t.continent === continent && !selected.includes(t),
  );
  if (topic && selected.length < count) selected.push(topic);
}
for (const topic of pending)
  if (selected.length < count && !selected.includes(topic))
    selected.push(topic);
if (!selected.length) {
  console.log(
    'No planned topics remain. Research distinct needs and extend editorial/plan.json before reserving another batch.',
  );
  process.exit(0);
}
const batch = {
  id: today,
  timeZone: 'America/New_York',
  createdAt: new Date().toISOString(),
  status: 'reserved-not-generated',
  topicIds: selected.map((t) => t.id),
  requestedCount: count,
  publishedCount: 0,
  errors: [],
};
try {
  await writeFile(path, JSON.stringify(batch, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify(batch, null, 2));
} catch (e) {
  if (e.code !== 'EEXIST') throw e;
  console.log(await readFile(path, 'utf8'));
}
