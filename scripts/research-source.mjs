// Capture a source once; reuse the evidence for both languages. Does not approve facts.
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const [id, url] = process.argv.slice(2);
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id || '') || !url) {
  console.error(
    'Usage: node scripts/research-source.mjs source-id https://official-source/path',
  );
  process.exit(1);
}
const parsed = new URL(url);
if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
  throw Error('Use a public HTTPS source without credentials');
}
const response = await fetch(parsed, {
  signal: AbortSignal.timeout(25000),
  headers: { 'User-Agent': 'MaletaFeliz editorial research/0.1' },
});
if (!response.ok)
  throw Error(
    `Source unavailable: HTTP ${response.status}; no evidence recorded`,
  );
const text = await response.text();
if (text.length > 5000000) throw Error('Source too large');
const record = {
  url,
  finalUrl: response.url,
  fetchedAt: new Date().toISOString(),
  httpStatus: response.status,
  contentType: response.headers.get('content-type'),
  contentSha256: createHash('sha256').update(text).digest('hex'),
  facts: [],
  notes:
    'Read the source and add specific verified facts with excerpts/locations. Fetching a page does not verify relevance.',
};
await mkdir('content/research', { recursive: true });
await writeFile(
  `content/research/${id}.json`,
  JSON.stringify(record, null, 2) + '\n',
  { flag: 'wx' },
);
console.log(
  `Saved source metadata: content/research/${id}.json. Facts still require editorial checking.`,
);
