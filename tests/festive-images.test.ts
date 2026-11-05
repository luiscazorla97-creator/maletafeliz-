import { afterEach, describe, expect, it } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
// @ts-ignore Shared CLI/build module.
import {
  assertFutureFestiveArticle,
  festiveRecordSchema,
  festiveReviewChecks,
  sha256,
  validateFestiveImages,
} from '../scripts/lib/festive-images.mjs';
// @ts-ignore Shared registration command; synthetic data never enters site content.
import { prepareFestiveImage } from '../scripts/prepare-festive-image.mjs';
// @ts-ignore Shared production article schema.
import { articleSchema, hashArticle } from '../scripts/lib/content.mjs';

const folders: string[] = [];
afterEach(() =>
  folders
    .splice(0)
    .forEach((root) => rmSync(root, { recursive: true, force: true })),
);
async function setup() {
  const root = mkdtempSync(join(tmpdir(), 'festive-images-fixture-'));
  folders.push(root);
  for (const folder of [
    'editorial',
    'content/articles',
    'content/images',
    'content/research',
    'public/images',
  ])
    mkdirSync(join(root, folder), { recursive: true });
  const date = '2026-11-05T20:00:00.000Z';
  const policy = {
    version: 1,
    defaultEnabled: false,
    implementedAt: '2026-11-05T19:00:00.000Z',
    historicalArticleIds: ['historical-guide'],
  };
  const write = (file: string, value: unknown) =>
    writeFileSync(join(root, file), JSON.stringify(value, null, 2) + '\n');
  write('editorial/festive-images.json', policy);
  // Plain rectangles are decoding fixtures, NOT AI edits or travel photographs.
  const originalBytes = await sharp({
    create: { width: 1000, height: 700, channels: 3, background: '#112233' },
  })
    .png()
    .toBuffer();
  const editBytes = await sharp({
    create: { width: 1000, height: 700, channels: 3, background: '#445566' },
  })
    .png()
    .toBuffer();
  writeFileSync(join(root, 'input-original.png'), originalBytes);
  writeFileSync(join(root, 'input-edit.png'), editBytes);
  write('content/research/test-rights.json', {
    url: 'https://example.org/synthetic-photo',
    httpStatus: 200,
    fetchedAt: date,
    contentSha256: 'a'.repeat(64),
    facts: ['Synthetic licence fixture only'],
  });
  const original = {
    id: 'test-original',
    src: '/images/test-original.webp',
    width: 1000,
    height: 700,
    sha256: sha256(originalBytes),
    originalSha256: sha256(originalBytes),
    sourceUrl: 'https://example.org/synthetic-photo',
    credit: 'Synthetic fixture author',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    verifiedAt: date,
    destinationIds: ['test-city'],
    alt: { es: 'Prueba', en: 'Test' },
  };
  write('content/images/manifest.json', [original]);
  const articles: any[] = ['es', 'en'].map((locale) => ({
    id: 'future-guide',
    locale,
    destinationId: 'test-city',
    status: 'draft',
    createdAt: date,
    festive_image_enhancement: true,
    festivity: 'christmas',
    coverImageId: original.id,
    festiveCoverImageId: 'test-festive',
    sections: [
      {
        id: locale === 'es' ? 'lugar' : 'place',
        kind: 'place',
        imageId: original.id,
      },
    ],
  }));
  const writeArticles = () =>
    articles.forEach((a) =>
      write(`content/articles/future-guide.${a.locale}.json`, a),
    );
  writeArticles();
  const record: any = {
    version: 1,
    imageId: 'test-festive',
    articleId: 'future-guide',
    originalPhotoId: original.id,
    originalFile: 'content/images/originals/test-festive-original.png',
    originalSha256: sha256(originalBytes),
    editedFile: 'content/images/edits/test-festive-edit.png',
    editedSha256: sha256(editBytes),
    modifications: {
      es: 'Ilustración sintética de prueba, nunca contenido real.',
      en: 'Synthetic illustrative test fixture, never real site content.',
    },
    generation: {
      tool: 'image_gen.imagegen',
      editedAt: date,
      prompt: 'Synthetic automated test only; no image generation happened.',
    },
    rights: {
      commercialUse: true,
      derivativesAllowed: true,
      evidenceFile: 'content/research/test-rights.json',
      evidenceSha256: sha256(
        readFileSync(join(root, 'content/research/test-rights.json')),
      ),
      checkedAt: date,
      explanation: 'Synthetic unit-test evidence only; no actual rights claim.',
    },
    review: {
      reviewer: 'Isolated synthetic test',
      reviewedAt: date,
      editedSha256: sha256(editBytes),
      checks: Object.fromEntries(
        festiveReviewChecks.map((k: string) => [k, true]),
      ),
      notes:
        'Synthetic review flags for tests only, never an editorial approval.',
    },
  };
  const spec = {
    record,
    originalInput: 'input-original.png',
    editedInput: 'input-edit.png',
    alt: {
      es: 'Ilustración sintética de prueba con IA',
      en: 'Synthetic AI illustration test fixture',
    },
  };
  const photos: any[] = [original];
  const validate = () =>
    validateFestiveImages({ root, articles, photos, policy, now: Date.now() });
  const register = async () => {
    const photo = await prepareFestiveImage(root, spec);
    photos.push(photo);
    return photo;
  };
  return {
    root,
    policy,
    original,
    articles,
    record,
    spec,
    photos,
    write,
    writeArticles,
    validate,
    register,
    originalBytes,
    editBytes,
  };
}

describe('future festive images, isolated synthetic fixtures only', () => {
  it('leaves omitted flags and historical article hashes untouched', async () => {
    const article = JSON.parse(
      readFileSync('content/articles/christmas-miami.es.json', 'utf8'),
    );
    const before = hashArticle(article);
    expect(articleSchema.safeParse(article).success).toBe(true);
    expect(
      articleSchema.parse(article).festive_image_enhancement,
    ).toBeUndefined();
    expect(hashArticle(article)).toBe(before);
    const s = await setup();
    s.articles.forEach((a) => {
      delete a.festive_image_enhancement;
      delete a.festiveCoverImageId;
    });
    expect(s.validate()).toEqual([]);
  });
  it('archives both exact inputs and creates responsive WebP files without rewriting the original entry', async () => {
    const s = await setup();
    const before = structuredClone(s.original);
    const photo = await s.register();
    expect(s.validate()).toEqual([]);
    const manifest = JSON.parse(
      readFileSync(join(s.root, 'content/images/manifest.json'), 'utf8'),
    );
    expect(manifest[0]).toEqual(before);
    expect(readFileSync(join(s.root, s.record.originalFile))).toEqual(
      s.originalBytes,
    );
    expect(readFileSync(join(s.root, s.record.editedFile))).toEqual(
      s.editBytes,
    );
    expect(photo.variants.map((v: any) => v.width)).toEqual([480, 800, 1000]);
    for (const v of photo.variants) {
      const bytes = readFileSync(join(s.root, 'public', v.src));
      expect(sha256(bytes)).toBe(v.sha256);
      expect((await sharp(bytes).metadata()).width).toBe(v.width);
    }
  });
  it.each([
    ['historical ID', { id: 'historical-guide' }, /historical/],
    ['missing opt-in', { festive_image_enhancement: undefined }, /opt-in/],
    ['ordinary guide', { festivity: undefined }, /festivity/],
    ['old creation date', { createdAt: '2026-11-01T12:00:00Z' }, /creation/],
    ['missing creation date', { createdAt: undefined }, /creation/],
    ['future creation date', { createdAt: '2099-11-01T12:00:00Z' }, /creation/],
    [
      'backdated publication',
      { publishedAt: '2026-11-01T12:00:00Z' },
      /precede/,
    ],
  ])('rejects %s', async (_label, fields, message) => {
    const s = await setup();
    expect(() =>
      assertFutureFestiveArticle({ ...s.articles[0], ...fields }, s.policy),
    ).toThrow(message);
  });
  it('does not permit a labelled AI illustration to substitute for a place photograph or documentary cover', async () => {
    const s = await setup();
    await s.register();
    s.articles[0].sections[0].imageId = 'test-festive';
    s.articles[0].coverImageId = 'test-festive';
    expect(s.validate().join(' ')).toContain('documentary image slot');
  });
  it('requires an opt-in for both cover and interior illustrations', async () => {
    const s = await setup();
    await s.register();
    delete s.articles[0].festive_image_enhancement;
    expect(s.validate().join(' ')).toContain('explicit opt-in');
    delete s.articles[0].festiveCoverImageId;
    s.articles[0].sections[0].illustrationImageId = 'test-festive';
    expect(s.validate().join(' ')).toContain('explicit opt-in');
  });
  it('shares a reviewed image between localized sections without requiring identical anchor names', async () => {
    const s = await setup();
    await s.register();
    for (const a of s.articles)
      a.sections[0].illustrationImageId = 'test-festive';
    expect(s.validate()).toEqual([]);
    delete s.articles[1].sections[0].illustrationImageId;
    expect(s.validate().join(' ')).toContain('both languages');
  });
  it.each(['commercialUse', 'derivativesAllowed'])(
    'requires explicit verified %s',
    async (field) => {
      const s = await setup();
      s.record.rights[field] = false;
      expect(festiveRecordSchema.safeParse(s.record).success).toBe(false);
    },
  );
  it.each(['CC BY-NC 4.0', 'CC BY-ND 4.0', 'All rights reserved'])(
    'rejects incompatible %s and rolls back new files',
    async (license) => {
      const s = await setup();
      s.original.license = license;
      s.write('content/images/manifest.json', [s.original]);
      await expect(s.register()).rejects.toThrow(/licence prohibits/);
      expect(existsSync(join(s.root, s.record.originalFile))).toBe(false);
      expect(
        JSON.parse(
          readFileSync(join(s.root, 'content/images/manifest.json'), 'utf8'),
        ),
      ).toEqual([s.original]);
    },
  );
  it('rejects incomplete visual review instead of automatically approving it', async () => {
    const s = await setup();
    delete s.record.review.checks.architecturePreserved;
    await expect(s.register()).rejects.toThrow();
  });
  it('invalidates approval when the final edit or archived original changes', async () => {
    const s = await setup();
    await s.register();
    writeFileSync(join(s.root, s.record.editedFile), 'changed');
    expect(s.validate().join(' ')).toContain('checksum mismatch');
  });
  it('requires a hash-bound visual review of the actual edited bytes', async () => {
    const s = await setup();
    s.record.review.editedSha256 = 'a'.repeat(64);
    await expect(s.register()).rejects.toThrow(/bound to the final edit/);
  });
  it('blocks input mismatches, repeated IDs, file collisions and concurrent registrations', async () => {
    const s = await setup();
    s.record.editedSha256 = 'b'.repeat(64);
    await expect(s.register()).rejects.toThrow(/Input checksum/);
    s.record.editedSha256 = sha256(s.editBytes);
    writeFileSync(
      join(s.root, 'content/images/.festive-images.lock'),
      'another execution',
    );
    await expect(s.register()).rejects.toThrow(/EEXIST/);
    rmSync(join(s.root, 'content/images/.festive-images.lock'));
    mkdirSync(join(s.root, 'content/images/edits'), { recursive: true });
    writeFileSync(join(s.root, s.record.editedFile), 'protected existing file');
    await expect(s.register()).rejects.toThrow(/EEXIST/);
    expect(readFileSync(join(s.root, s.record.editedFile), 'utf8')).toBe(
      'protected existing file',
    );
    expect(existsSync(join(s.root, s.record.originalFile))).toBe(false);
    rmSync(join(s.root, s.record.editedFile));
    await s.register();
    await expect(s.register()).rejects.toThrow(/already exists/);
  });
  it('does not edit published articles or silently choose images for drafts', async () => {
    const s = await setup();
    s.articles[0].status = 'published';
    s.writeArticles();
    await expect(s.register()).rejects.toThrow(/already published/);
    s.articles[0].status = 'draft';
    delete s.articles[0].festiveCoverImageId;
    s.writeArticles();
    await expect(s.register()).rejects.toThrow(/both drafts/);
  });
  it('checks the specific rights evidence, attribution and both ALT texts', async () => {
    const s = await setup();
    await s.register();
    s.photos[1].alt.en = 'Unlabelled street';
    expect(s.validate().join(' ')).toContain('both ALT texts');
    s.photos[1].alt.en = s.spec.alt.en;
    s.photos[1].credit = 'Missing author';
    expect(s.validate().join(' ')).toContain('attribution');
    s.photos[1].credit = s.original.credit;
    s.write('content/research/test-rights.json', { httpStatus: 403 });
    expect(s.validate().join(' ')).toContain('checksum mismatch');
  });
});
