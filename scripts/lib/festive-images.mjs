import { z } from 'zod';
import { createHash } from 'node:crypto';
import { readFileSync, realpathSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const timestamp = z.iso.datetime({ offset: true });
export const festivities = [
  'christmas',
  'halloween',
  'new-year',
  'winter-celebration',
  'festival-of-lights',
  'other-festivity',
];
export const festiveArticleFields = {
  // Optional instead of a Zod default: parsing must not mutate historical hashes.
  festive_image_enhancement: z.boolean().optional(),
  festivity: z.enum(festivities).optional(),
  createdAt: timestamp.optional(),
  festiveCoverImageId: id.optional(),
};
export const festiveReviewChecks = [
  'recognizablePlace',
  'architecturePreserved',
  'geographyPreserved',
  'proportionsPreserved',
  'noInventedPermanentStructures',
  'noMisleadingEventClaim',
  'noUnnecessaryText',
  'licenseAndAttribution',
  'disclosureAndAlt',
  'visualQuality',
];
const archive = (folder) =>
  z
    .string()
    .regex(
      new RegExp(
        `^content/images/${folder}/[a-z0-9-]+\\.(png|jpe?g|webp|avif)$`,
      ),
    );
export const festiveRecordSchema = z
  .object({
    version: z.literal(1),
    imageId: id,
    articleId: id,
    originalPhotoId: id,
    originalFile: archive('originals'),
    originalSha256: hash,
    editedFile: archive('edits'),
    editedSha256: hash,
    modifications: z
      .object({ es: z.string().min(20), en: z.string().min(20) })
      .strict(),
    generation: z
      .object({
        tool: z.literal('image_gen.imagegen'),
        editedAt: timestamp,
        prompt: z.string().min(40),
      })
      .strict(),
    rights: z
      .object({
        commercialUse: z.literal(true),
        derivativesAllowed: z.literal(true),
        evidenceFile: z.string().regex(/^content\/research\/[a-z0-9-]+\.json$/),
        evidenceSha256: hash,
        checkedAt: timestamp,
        explanation: z.string().min(40),
      })
      .strict(),
    review: z
      .object({
        reviewer: z.string().min(3),
        reviewedAt: timestamp,
        editedSha256: hash,
        checks: z
          .object(
            Object.fromEntries(
              festiveReviewChecks.map((k) => [k, z.literal(true)]),
            ),
          )
          .strict(),
        notes: z.string().min(40),
      })
      .strict(),
  })
  .strict();

export const isFestiveIllustration = (photo) =>
  photo?.kind === 'festive-ai-illustration' || !!photo?.enhancementRecord;
export const sha256 = (bytes) =>
  createHash('sha256').update(bytes).digest('hex');
export function readContained(root, path) {
  const full = realpathSync(resolve(root, path));
  const rel = relative(realpathSync(root), full);
  if (rel === '..' || rel.startsWith('../') || isAbsolute(rel))
    throw new Error('File must stay inside the repository');
  return readFileSync(full);
}
export function assertFutureFestiveArticle(article, policy, now = Date.now()) {
  const fail = (message) => {
    throw new Error(message);
  };
  if (
    policy.version !== 1 ||
    policy.defaultEnabled !== false ||
    !Number.isFinite(Date.parse(policy.implementedAt)) ||
    !Array.isArray(policy.historicalArticleIds)
  )
    fail('invalid festive image policy');
  if (policy.historicalArticleIds.includes(article.id))
    fail('historical articles cannot enable festive image enhancement');
  if (
    article.festive_image_enhancement !== true ||
    !festivities.includes(article.festivity)
  )
    fail('explicit opt-in and a supported festivity are required');
  if (
    !timestamp.safeParse(article.createdAt).success ||
    Date.parse(article.createdAt) < Date.parse(policy.implementedAt) ||
    Date.parse(article.createdAt) > now
  )
    fail(
      'new festive articles require a real creation timestamp after implementation',
    );
  if (
    article.publishedAt &&
    Date.parse(article.publishedAt) < Date.parse(article.createdAt)
  )
    fail('publication cannot precede creation');
}

// Called by every existing editorial/build gate. This adds checks; it does not
// relax documentary photographs, source research or content-hash approvals.
export function validateFestiveImages({ root, articles, photos, policy, now }) {
  const errors = [];
  const fail = (message) => errors.push(`festive images: ${message}`);
  const illustrations = photos.filter(isFestiveIllustration);
  if (!policy) {
    if (
      illustrations.length ||
      articles.some(
        (a) =>
          a.festive_image_enhancement ||
          a.festiveCoverImageId ||
          a.sections.some((s) => s.illustrationImageId),
      )
    )
      fail('missing implementation policy');
    return errors;
  }
  if (
    policy.version !== 1 ||
    policy.defaultEnabled !== false ||
    !Number.isFinite(Date.parse(policy.implementedAt)) ||
    !Array.isArray(policy.historicalArticleIds)
  ) {
    fail('invalid implementation policy');
    return errors;
  }
  const records = new Map();
  for (const photo of photos)
    if (
      photo.kind !== undefined &&
      !['documentary', 'festive-ai-illustration'].includes(photo.kind)
    )
      fail(`${photo.id}: unsupported photograph type`);
  for (const photo of illustrations) {
    try {
      if (
        photo.kind !== 'festive-ai-illustration' ||
        !/^content\/images\/enhancements\/[a-z0-9-]+\.json$/.test(
          photo.enhancementRecord || '',
        )
      )
        throw new Error('missing illustration type or provenance record');
      const record = festiveRecordSchema.parse(
        JSON.parse(readContained(root, photo.enhancementRecord)),
      );
      if (record.imageId !== photo.id)
        throw new Error('provenance image ID mismatch');
      if (record.originalSha256 === record.editedSha256)
        throw new Error(
          'unchanged original cannot be registered as an AI edit',
        );
      if (policy.historicalArticleIds.includes(record.articleId))
        throw new Error('historical articles cannot receive enhanced images');
      const original = photos.find((p) => p.id === record.originalPhotoId);
      if (!original || isFestiveIllustration(original))
        throw new Error('documentary original required');
      if (
        !original.originalSha256 ||
        original.originalSha256 !== record.originalSha256
      )
        throw new Error(
          'original bytes must match the verified documentary source',
        );
      if (
        photo.sourceUrl !== original.sourceUrl ||
        photo.license !== original.license ||
        photo.licenseUrl !== original.licenseUrl ||
        photo.attributionUrl !== original.attributionUrl ||
        !photo.credit?.includes(original.credit)
      )
        throw new Error(
          'original licence and full attribution must be retained',
        );
      if (
        !photo.destinationIds?.length ||
        photo.destinationIds.some((d) => !original.destinationIds?.includes(d))
      )
        throw new Error('illustration destination must match original');
      if (
        !photo.alt?.es ||
        !photo.alt?.en ||
        !/IA|inteligencia artificial/i.test(photo.alt.es) ||
        !/\bAI\b|artificial intelligence/i.test(photo.alt.en)
      )
        throw new Error(
          'both ALT texts must describe the illustrative AI edit',
        );
      for (const [file, expected] of [
        [record.originalFile, record.originalSha256],
        [record.editedFile, record.editedSha256],
        [record.rights.evidenceFile, record.rights.evidenceSha256],
      ])
        if (sha256(readContained(root, file)) !== expected)
          throw new Error('archived original/edit/rights checksum mismatch');
      const rightsEvidence = JSON.parse(
        readContained(root, record.rights.evidenceFile),
      );
      if (
        rightsEvidence.httpStatus !== 200 ||
        !/^[a-f0-9]{64}$/.test(rightsEvidence.contentSha256 || '') ||
        !Array.isArray(rightsEvidence.facts) ||
        !rightsEvidence.facts.length ||
        !Number.isFinite(Date.parse(rightsEvidence.fetchedAt)) ||
        Date.parse(rightsEvidence.fetchedAt) > now
      )
        throw new Error(
          'licence evidence must record an actual successful source consultation',
        );
      const normalize = (url) => new URL(url).href.replace(/\/$/, '');
      if (
        ![rightsEvidence.url, rightsEvidence.finalUrl]
          .filter(Boolean)
          .some((url) => normalize(url) === normalize(original.sourceUrl))
      )
        throw new Error(
          'licence evidence must concern the specific original photograph',
        );
      if (
        /\bNC\b|\bND\b|noncommercial|no.?derivatives|all rights reserved/i.test(
          original.license,
        )
      )
        throw new Error('licence prohibits commercial use or derivative works');
      if (record.review.editedSha256 !== record.editedSha256)
        throw new Error('visual approval is not bound to the final edit');
      const dates = [
        record.generation.editedAt,
        record.rights.checkedAt,
        record.review.reviewedAt,
      ];
      if (
        dates.some((d) => Date.parse(d) > now) ||
        Date.parse(record.generation.editedAt) <
          Date.parse(policy.implementedAt) ||
        Date.parse(record.rights.checkedAt) <
          Date.parse(rightsEvidence.fetchedAt) ||
        Date.parse(record.generation.editedAt) <
          Date.parse(record.rights.checkedAt) ||
        Date.parse(record.review.reviewedAt) <
          Date.parse(record.generation.editedAt)
      )
        throw new Error('invalid edit, rights or review timestamp');
      records.set(photo.id, record);
    } catch (error) {
      fail(`${photo.id}: ${error.message}`);
    }
  }
  for (const a of articles) {
    const illustrationIds = [
      a.festiveCoverImageId,
      ...a.sections.map((s) => s.illustrationImageId),
    ].filter(Boolean);
    // coverImageId and place.imageId always remain documentary, also on cards,
    // search previews, country pages, Open Graph and Article JSON-LD.
    for (const imageId of [
      a.coverImageId,
      ...a.sections.map((s) => s.imageId),
    ].filter(Boolean))
      if (isFestiveIllustration(photos.find((p) => p.id === imageId)))
        fail(
          `${a.id}/${a.locale}: documentary image slot cannot contain an AI illustration`,
        );
    if (a.festive_image_enhancement === true) {
      try {
        assertFutureFestiveArticle(a, policy, now);
      } catch (error) {
        fail(`${a.id}/${a.locale}: ${error.message}`);
      }
    } else if (illustrationIds.length)
      fail(`${a.id}/${a.locale}: illustrations require explicit opt-in`);
    for (const imageId of illustrationIds) {
      const image = photos.find((p) => p.id === imageId),
        record = records.get(imageId);
      if (
        !image ||
        !record ||
        record.articleId !== a.id ||
        !image.destinationIds?.includes(a.destinationId)
      )
        fail(
          `${a.id}/${a.locale}: missing or mismatched approved illustration ${imageId}`,
        );
      else {
        const section = a.sections.find(
          (s) => s.illustrationImageId === imageId,
        );
        const originalId =
          imageId === a.festiveCoverImageId ? a.coverImageId : section?.imageId;
        if (originalId && originalId !== record.originalPhotoId)
          fail(
            `${a.id}/${a.locale}: illustration must derive from its accompanying original`,
          );
        if (Date.parse(record.generation.editedAt) < Date.parse(a.createdAt))
          fail(
            `${a.id}/${a.locale}: illustration edit cannot precede article creation`,
          );
      }
    }
    const other = articles.find((b) => b.id === a.id && b.locale !== a.locale);
    if (
      other &&
      (other.festive_image_enhancement !== a.festive_image_enhancement ||
        other.festivity !== a.festivity ||
        other.createdAt !== a.createdAt ||
        other.festiveCoverImageId !== a.festiveCoverImageId ||
        JSON.stringify(
          other.sections.map((s) => s.illustrationImageId || null),
        ) !==
          JSON.stringify(a.sections.map((s) => s.illustrationImageId || null)))
    ) {
      // Section anchors can be localized; illustration positions must match.
      if (
        a.festive_image_enhancement ||
        other.festive_image_enhancement ||
        illustrationIds.length
      )
        fail(
          `${a.id}/${a.locale}: both languages must share the same festive images and settings`,
        );
    }
  }
  return errors;
}
