import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
// @ts-ignore Runtime module is shared by CLI and build gate.
import { validateEditorial, hashArticle } from '../scripts/lib/content.mjs';
const folders: string[] = [];
afterEach(() => {
  for (const path of folders.splice(0))
    rmSync(path, { recursive: true, force: true });
});
function setup() {
  const root = mkdtempSync(join(tmpdir(), 'maletafeliz-test-'));
  folders.push(root);
  for (const dir of [
    'content/research',
    'content/reviews',
    'public/images',
    'editorial',
  ])
    mkdirSync(join(root, dir), { recursive: true });
  const timestamp = '2026-10-28T10:00:00.000Z';
  const now = Date.parse('2026-10-28T14:00:00.000Z');
  const plan = [{ id: 'test-city', placeCount: 3 }];
  const photos = ['cover', 'interior'].map((id) => {
    const bytes = Buffer.from(`test fixture ${id}`);
    writeFileSync(join(root, `public/images/${id}.webp`), bytes);
    return {
      id,
      src: `/images/${id}.webp`,
      width: 1000,
      height: 700,
      credit: 'Synthetic test fixture',
      license: 'Test only',
      licenseUrl: 'https://example.org/license',
      sourceUrl: 'https://example.org/photo',
      verifiedAt: timestamp,
      alt: { es: 'Imagen de prueba', en: 'Test image' },
      sha256: createHash('sha256').update(bytes).digest('hex'),
      destinationIds: ['test-city'],
    };
  });
  const paragraph = (label: string) =>
    `${label} ` + Array.from({ length: 105 }, (_, i) => `word${i}`).join(' ');
  const articles = ['es', 'en'].map((locale) => ({
    file: `test-city.${locale}.json`,
    data: {
      id: 'test-city',
      destinationId: 'test-city',
      locale,
      slug: `test-city-${locale}`,
      title: `Test guide to a synthetic city ${locale}`,
      description:
        'This synthetic fixture is only used to test the editorial gates and is never part of the published website.',
      keyword: 'test city guide',
      relatedQueries: ['test query one', 'test query two'],
      intent: 'first-visit-highlights',
      status: 'published',
      publishedAt: timestamp,
      coverImageId: 'cover',
      intro: [paragraph(`${locale} intro`)],
      quickFacts: [
        { label: 'One', value: 'Value one' },
        { label: 'Two', value: 'Value two' },
        { label: 'Three', value: 'Value three' },
      ],
      sections: [0, 1, 2].map((n) => ({
        id: `place-${n}`,
        kind: 'place',
        heading: `Synthetic place ${n}`,
        paragraphs: [
          paragraph(`${locale} place ${n} first`),
          paragraph(`${locale} place ${n} second`),
        ],
        sourceIds: ['source-one'],
        imageId: n === 0 ? 'interior' : undefined,
      })),
      itinerary: [paragraph(`${locale} route one`)],
      faq: [0, 1, 2].map((n) => ({
        question: `Synthetic question ${n}?`,
        answer: paragraph(`${locale} answer ${n}`),
      })),
      conclusion: paragraph(`${locale} conclusion`),
      sources: ['one', 'two'].map((id) => ({
        id: `source-${id}`,
        url: `https://example.org/${id}`,
        title: `Synthetic test source ${id}`,
        accessedAt: timestamp,
        evidenceFile: `content/research/source-${id}.json`,
      })),
      relatedIds: ['other-city'],
    },
  }));
  const second = articles.map((a) => ({
    file: a.file.replace('test-city', 'other-city'),
    data: {
      ...structuredClone(a.data),
      id: 'other-city',
      destinationId: 'other-city',
      slug: a.data.slug.replace('test-city', 'other-city'),
      title: a.data.title.replace('synthetic', 'different synthetic'),
      intent: 'another-intent',
      relatedIds: ['test-city'],
      sections: a.data.sections.map((s) => ({
        ...s,
        paragraphs: s.paragraphs.map((p) => `Different ${p}`),
      })),
    },
  }));
  articles.push(...second);
  plan.push({ id: 'other-city', placeCount: 3 });
  for (const p of photos) p.destinationIds.push('other-city');
  for (const id of ['one', 'two'])
    writeFileSync(
      join(root, `content/research/source-${id}.json`),
      JSON.stringify({
        url: `https://example.org/${id}`,
        fetchedAt: timestamp,
        httpStatus: 200,
        contentSha256: 'a'.repeat(64),
        facts: [{ fact: 'Synthetic fixture only' }],
      }),
    );
  const approve = () => {
    for (const a of articles)
      writeFileSync(
        join(root, `content/reviews/${a.data.id}.${a.data.locale}.json`),
        JSON.stringify({
          contentHash: hashArticle(a.data),
          reviewer: 'test fixture',
          reviewedAt: timestamp,
          checks: Object.fromEntries(
            [
              'facts',
              'sourceRelevance',
              'imageRights',
              'imageRelevance',
              'language',
              'originality',
              'usefulness',
              'timeSensitiveFacts',
              'internalLinks',
            ].map((k) => [k, true]),
          ),
        }),
      );
  };
  approve();
  return { root, articles, plan, photos, now, approve };
}
describe('publication gate', () => {
  it('accepts complete synthetic pairs only in the isolated fixture', () => {
    const s = setup();
    expect(validateEditorial(s).errors).toEqual([]);
  });
  it('blocks duplicate URLs and IDs', () => {
    const s = setup();
    s.articles.push(s.articles[0]);
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'duplicate article/locale',
    );
  });
  it('blocks a missing English version', () => {
    const s = setup();
    s.articles = s.articles.filter(
      (a) => !(a.data.id === 'test-city' && a.data.locale === 'en'),
    );
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'missing published translation',
    );
  });
  it('invalidates approval when content changes', () => {
    const s = setup();
    s.articles[0].data.title += ' changed';
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'approval bound to current content hash',
    );
  });
  it('blocks missing licences and image mismatch', () => {
    const s = setup();
    s.photos[0].license = '';
    s.photos[1].destinationIds = [];
    const e = validateEditorial(s).errors.join(' ');
    expect(e).toContain('incomplete photo rights');
    expect(e).toContain('destination not verified');
  });
  it('blocks images whose bytes changed', () => {
    const s = setup();
    writeFileSync(join(s.root, 'public/images/cover.webp'), 'changed');
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'image hash mismatch',
    );
  });
  it('blocks missing and stale research', () => {
    const s = setup();
    rmSync(join(s.root, 'content/research/source-one.json'));
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'missing checked source evidence',
    );
    expect(
      validateEditorial({ ...s, now: s.now + 181 * 864e5 }).errors.join(' '),
    ).toContain('fresh research');
  });
  it('blocks future publication dates', () => {
    const s = setup();
    s.articles[0].data.publishedAt = '2099-01-01T00:00:00.000Z';
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'future publication',
    );
  });
  it('does not count drafts towards the launch', () => {
    const s = setup();
    s.articles.forEach((a) => (a.data.status = 'draft'));
    const r = validateEditorial({ ...s, launch: true });
    expect(r.published).toBe(0);
    expect(r.errors.join(' ')).toContain('Launch missing');
    expect(r.pending).toHaveLength(4);
  });
  it('rejects self links and repeated paragraphs', () => {
    const s = setup();
    s.articles[0].data.relatedIds = ['test-city'];
    s.articles[0].data.sections[0].paragraphs[1] =
      s.articles[0].data.sections[0].paragraphs[0];
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'repeated paragraphs',
    );
    expect(validateEditorial(s).errors.join(' ')).toContain(
      'broken/self related',
    );
  });
});
