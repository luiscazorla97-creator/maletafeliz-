import { z } from 'zod';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
const https = z
  .url()
  .refine((s) => new URL(s).protocol === 'https:', 'HTTPS required');
const date = z
  .string()
  .refine(
    (s) => /^\d{4}-\d{2}-\d{2}T/.test(s) && Number.isFinite(Date.parse(s)),
    'Full ISO timestamp required',
  );
const validTimestamp = (s, now) =>
  typeof s === 'string' &&
  /^\d{4}-\d{2}-\d{2}T/.test(s) &&
  Number.isFinite(Date.parse(s)) &&
  Date.parse(s) <= now;
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const paragraph = z.string().trim().min(40);
export const articleSchema = z
  .object({
    id: slug,
    destinationId: slug,
    locale: z.enum(['es', 'en']),
    slug,
    title: z.string().min(15).max(110),
    description: z.string().min(70).max(190),
    keyword: z.string().min(3),
    relatedQueries: z.array(z.string().min(3)).min(2),
    intent: z.string().min(3),
    status: z.enum(['draft', 'review', 'published']),
    publishedAt: date.optional(),
    updatedAt: date.optional(),
    coverImageId: slug,
    intro: z.array(paragraph).min(1),
    quickFacts: z
      .array(z.object({ label: z.string().min(2), value: z.string().min(3) }))
      .min(3),
    sections: z
      .array(
        z.object({
          id: slug,
          kind: z.enum(['place', 'practical']),
          heading: z.string().min(3),
          paragraphs: z.array(paragraph).min(2),
          sourceIds: z.array(slug).min(1),
          imageId: slug.optional(),
        }),
      )
      .min(3),
    itinerary: z.array(paragraph),
    faq: z
      .array(z.object({ question: z.string().min(10), answer: paragraph }))
      .min(3),
    conclusion: paragraph,
    sources: z
      .array(
        z.object({
          id: slug,
          url: https,
          title: z.string().min(5),
          accessedAt: date,
          evidenceFile: z
            .string()
            .regex(/^content\/research\/[a-z0-9-]+\.json$/),
        }),
      )
      .min(2),
    relatedIds: z.array(slug).min(1),
  })
  .strict();
export function hashArticle(article) {
  return createHash('sha256').update(JSON.stringify(article)).digest('hex');
}
export function words(article) {
  return [
    ...article.intro,
    ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    ...article.itinerary,
    ...article.faq.flatMap((f) => [f.question, f.answer]),
    article.conclusion,
  ]
    .join(' ')
    .trim()
    .split(/\s+/).length;
}
export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
export function readArticles(root = process.cwd()) {
  return readdirSync(resolve(root, 'content/articles'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      file: f,
      data: readJson(resolve(root, 'content/articles', f)),
    }));
}
const safeRead = (root, path) => {
  const full = resolve(root, path);
  if (relative(root, full).startsWith('..') || !existsSync(full)) return null;
  try {
    return readJson(full);
  } catch {
    return null;
  }
};
export function validateEditorial({
  root = process.cwd(),
  articles = readArticles(root),
  plan = readJson(resolve(root, 'editorial/plan.json')),
  photos = readJson(resolve(root, 'content/images/manifest.json')),
  launch = false,
  now = Date.now(),
} = {}) {
  const errors = [],
    pending = [],
    published = [];
  const unique = new Set(),
    intents = new Set(),
    titles = new Set();
  const parsed = [];
  for (const { file, data } of articles) {
    if (data.status !== 'published') {
      pending.push(`${file}: ${data.status || 'unknown'}`);
      continue;
    }
    const result = articleSchema.safeParse(data);
    if (!result.success) {
      errors.push(
        `${file}: ${result.error.issues.map((i) => i.path.join('.') + ': ' + i.message).join('; ')}`,
      );
      continue;
    }
    const a = result.data;
    parsed.push(a);
    published.push(a);
    const fail = (m) => errors.push(`${file}: ${m}`);
    const d = plan.find((d) => d.id === a.destinationId);
    if (!d) {
      fail('destination missing from editorial plan');
      continue;
    }
    for (const [set, key, label] of [
      [unique, `${a.id}:${a.locale}`, 'article/locale'],
      [unique, `${a.locale}/${a.slug}`, 'URL'],
      [titles, `${a.locale}:${a.title.toLowerCase()}`, 'title'],
      [intents, `${a.locale}:${a.destinationId}:${a.intent}`, 'search intent'],
    ]) {
      if (set.has(key)) fail(`duplicate ${label}`);
      set.add(key);
    }
    if (!a.publishedAt || Date.parse(a.publishedAt) > now)
      fail('missing/future publication timestamp');
    if (
      a.updatedAt &&
      (Date.parse(a.updatedAt) < Date.parse(a.publishedAt) ||
        Date.parse(a.updatedAt) > now)
    )
      fail('invalid update timestamp');
    if (words(a) < 1200) fail('guide is under 1,200 words');
    if (a.sections.filter((s) => s.kind === 'place').length !== d.placeCount)
      fail(`requires exactly ${d.placeCount} individually developed places`);
    const ids = new Set();
    const sourceIds = new Set(a.sources.map((s) => s.id));
    if (sourceIds.size !== a.sources.length) fail('duplicate source IDs');
    for (const s of a.sections) {
      if (ids.has(s.id) || ['faq', 'itinerary', 'sources'].includes(s.id))
        fail('duplicate/reserved heading ID');
      ids.add(s.id);
      if (s.kind === 'place' && s.paragraphs.join(' ').split(/\s+/).length < 70)
        fail(`place ${s.id} lacks depth`);
      for (const id of s.sourceIds)
        if (!sourceIds.has(id)) fail(`unknown source ${id}`);
    }
    const bodyParagraphs = [
      ...a.intro,
      ...a.sections.flatMap((s) => s.paragraphs),
      ...a.itinerary,
      a.conclusion,
    ];
    if (
      new Set(bodyParagraphs.map((s) => s.toLowerCase().trim())).size !==
      bodyParagraphs.length
    )
      fail('repeated paragraphs');
    for (const source of a.sources) {
      const evidence = safeRead(root, source.evidenceFile);
      if (
        !evidence ||
        evidence.url !== source.url ||
        evidence.httpStatus !== 200 ||
        !evidence.fetchedAt ||
        evidence.fetchedAt !== source.accessedAt ||
        !validTimestamp(evidence.fetchedAt, now) ||
        !/^[a-f0-9]{64}$/.test(evidence.contentSha256 || '') ||
        !Array.isArray(evidence.facts) ||
        !evidence.facts.length
      )
        fail(`missing checked source evidence: ${source.id}`);
      else if (
        Date.parse(evidence.fetchedAt) > now ||
        now - Date.parse(evidence.fetchedAt) > 180 * 864e5
      )
        fail(`source ${source.id} requires fresh research`);
    }
    const usedImages = new Set([
      a.coverImageId,
      ...a.sections.map((s) => s.imageId).filter(Boolean),
    ]);
    if (usedImages.size < 2)
      fail('guide needs a cover and relevant interior photograph');
    for (const imageId of usedImages) {
      const image = photos.find((p) => p.id === imageId);
      if (!image) {
        fail(`missing photo ${imageId}`);
        continue;
      }
      if (
        !image.src?.match(
          /^\/images\/[a-zA-Z0-9/_-]+\.(webp|avif|jpg|jpeg|png)$/,
        ) ||
        !image.credit ||
        !image.license ||
        !image.licenseUrl?.startsWith('https://') ||
        !image.sourceUrl?.startsWith('https://') ||
        !validTimestamp(image.verifiedAt, now) ||
        !image.alt?.[a.locale] ||
        !image.sha256 ||
        image.width < 640 ||
        image.height < 300
      )
        fail(`incomplete photo rights/metadata ${imageId}`);
      if (!image.destinationIds?.includes(a.destinationId))
        fail(`photo ${imageId} destination not verified`);
      if (image.src) {
        const path = resolve(root, 'public', '.' + image.src);
        if (
          !path.startsWith(resolve(root, 'public') + '/') ||
          !existsSync(path)
        )
          fail(`missing image file ${imageId}`);
        else if (
          createHash('sha256').update(readFileSync(path)).digest('hex') !==
          image.sha256
        )
          fail(`image hash mismatch ${imageId}`);
      }
    }
    const review = safeRead(root, `content/reviews/${a.id}.${a.locale}.json`);
    const checks = [
      'facts',
      'sourceRelevance',
      'imageRights',
      'imageRelevance',
      'language',
      'originality',
      'usefulness',
      'timeSensitiveFacts',
      'internalLinks',
    ];
    if (
      !review ||
      review.contentHash !== hashArticle(a) ||
      !review.reviewer ||
      !validTimestamp(review.reviewedAt, now) ||
      checks.some((k) => review.checks?.[k] !== true)
    )
      fail('missing editorial approval bound to current content hash');
  }
  for (const a of parsed) {
    if (!parsed.some((b) => b.id === a.id && b.locale !== a.locale))
      errors.push(`${a.id}: missing published translation`);
    for (const id of a.relatedIds)
      if (
        id === a.id ||
        !parsed.some((b) => b.id === id && b.locale === a.locale)
      )
        errors.push(`${a.id}/${a.locale}: broken/self related article ${id}`);
  }
  for (let i = 0; i < parsed.length; i++)
    for (let j = i + 1; j < parsed.length; j++) {
      const a = parsed[i],
        b = parsed[j];
      if (a.locale !== b.locale) continue;
      const first = new Set(
        a.sections
          .flatMap((s) => s.paragraphs)
          .map((s) => s.toLowerCase().trim()),
      );
      const overlap = b.sections
        .flatMap((s) => s.paragraphs)
        .filter((p) => first.has(p.toLowerCase().trim())).length;
      if (overlap > 1)
        errors.push(
          `${a.id}/${b.id}: reused body paragraphs; investigate overlap`,
        );
    }
  if (launch) {
    if (plan.length < 20)
      errors.push('Launch requires at least 20 planned originals');
    for (const topic of plan.slice(0, 20))
      for (const locale of ['es', 'en'])
        if (!parsed.some((a) => a.id === topic.id && a.locale === locale))
          errors.push(`Launch missing: ${topic.id}/${locale}`);
    const site = safeRead(root, 'editorial/site.json');
    if (
      !site?.ownerName ||
      !site?.contactEmail?.includes('@') ||
      !site?.jurisdiction ||
      !site?.legalReviewedAt
    )
      errors.push('Launch blocked: owner contact and legal review incomplete');
    const legalPath = resolve(root, 'src/data/legal.ts');
    if (
      !existsSync(legalPath) ||
      site?.legalContentHash !==
        createHash('sha256').update(readFileSync(legalPath)).digest('hex')
    )
      errors.push('Launch blocked: final legal copy has not been reviewed');
  }
  return {
    errors,
    pending,
    published: published.length,
    originals: new Set(published.map((a) => a.id)).size,
    planned: plan.length,
  };
}
