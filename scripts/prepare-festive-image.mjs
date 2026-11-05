import { readFile, writeFile, open, unlink, rename } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import sharp from 'sharp';
import { z } from 'zod';
import {
  assertFutureFestiveArticle,
  festiveRecordSchema,
  isFestiveIllustration,
  sha256,
  validateFestiveImages,
} from './lib/festive-images.mjs';
import { readArticles } from './lib/content.mjs';

// This command cannot generate or buy images. An actual Codex image edit and a
// human/Codex visual review must precede registration. No defaults approve QA.
export async function prepareFestiveImage(root, spec) {
  const input = z
    .object({
      record: festiveRecordSchema,
      originalInput: z.string().min(1),
      editedInput: z.string().min(1),
      alt: z
        .object({ es: z.string().min(20), en: z.string().min(20) })
        .strict(),
    })
    .strict()
    .parse(spec);
  const record = input.record;
  const policy = JSON.parse(
    await readFile(resolve(root, 'editorial/festive-images.json'), 'utf8'),
  );
  const articles = readArticles(root)
    .map((a) => a.data)
    .filter((a) => a.id === record.articleId);
  if (
    articles.length !== 2 ||
    new Set(articles.map((a) => a.locale)).size !== 2
  )
    throw new Error(
      'Create both new festive drafts before registering an illustration',
    );
  for (const article of articles) {
    assertFutureFestiveArticle(article, policy);
    if (article.status === 'published')
      throw new Error('Cannot add images to an already published article');
  }
  const manifestPath = resolve(root, 'content/images/manifest.json');
  const manifestBytes = await readFile(manifestPath);
  const photos = JSON.parse(manifestBytes);
  if (photos.some((p) => p.id === record.imageId))
    throw new Error('Image ID already exists; overwrites are prohibited');
  const original = photos.find((p) => p.id === record.originalPhotoId);
  if (!original || isFestiveIllustration(original))
    throw new Error('Verified documentary original required');
  const originalBytes = await readFile(resolve(root, input.originalInput));
  const editedBytes = await readFile(resolve(root, input.editedInput));
  if (
    sha256(originalBytes) !== record.originalSha256 ||
    sha256(editedBytes) !== record.editedSha256
  )
    throw new Error('Input checksum does not match the reviewed original/edit');
  for (const [path, bytes] of [
    [record.originalFile, originalBytes],
    [record.editedFile, editedBytes],
  ]) {
    const format = (
      await sharp(bytes, { limitInputPixels: 40000000 }).metadata()
    ).format;
    const extensions = {
      png: ['.png'],
      jpeg: ['.jpg', '.jpeg'],
      webp: ['.webp'],
      avif: ['.avif'],
      heif: ['.avif'],
    };
    if (!extensions[format]?.includes(extname(path)))
      throw new Error('Original and edit must be actual supported image files');
    await sharp(bytes, { limitInputPixels: 40000000 }).stats();
  }
  const { data, info } = await sharp(editedBytes, {
    limitInputPixels: 40000000,
  })
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });
  if (info.width < 640 || info.height < 300)
    throw new Error('Edit too small for the editorial image gate');
  const src = `/images/${record.imageId}.webp`;
  const photo = {
    id: record.imageId,
    kind: 'festive-ai-illustration',
    enhancementRecord: `content/images/enhancements/${record.imageId}.json`,
    src,
    width: info.width,
    height: info.height,
    sha256: sha256(data),
    alt: input.alt,
    credit: `${original.credit} · illustrative AI festive edit by MaletaFeliz`,
    sourceUrl: original.sourceUrl,
    license: original.license,
    licenseUrl: original.licenseUrl,
    ...(original.attributionUrl
      ? { attributionUrl: original.attributionUrl }
      : {}),
    verifiedAt: record.review.reviewedAt,
    destinationIds: [articles[0].destinationId],
    modifications: record.modifications,
    variants:
      /** @type {Array<{src: string, width: number, height: number, sha256: string}>} */ ([]),
  };
  const outputs = [
    [record.originalFile, originalBytes],
    [record.editedFile, editedBytes],
    [
      photo.enhancementRecord,
      Buffer.from(JSON.stringify(record, null, 2) + '\n'),
    ],
    ['public' + src, data],
  ];
  for (const width of [480, 800, 1200]) {
    if (width >= info.width) continue;
    const variantSrc = src.replace('.webp', `-${width}w.webp`);
    const result = await sharp(data)
      .resize({ width })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    photo.variants.push({
      src: variantSrc,
      width: result.info.width,
      height: result.info.height,
      sha256: sha256(result.data),
    });
    outputs.push(['public' + variantSrc, result.data]);
  }
  photo.variants.push({
    src,
    width: info.width,
    height: info.height,
    sha256: photo.sha256,
  });
  // Both language drafts must actually select the same new image. The command
  // never changes article JSON, timestamps or editorial approvals on their behalf.
  if (
    articles.some(
      (a) =>
        a.festiveCoverImageId !== record.imageId &&
        !a.sections.some((s) => s.illustrationImageId === record.imageId),
    )
  )
    throw new Error(
      'Select the illustration in both drafts before registration',
    );
  const created = [];
  const lockPath = resolve(root, 'content/images/.festive-images.lock');
  const lock = await open(lockPath, 'wx');
  const temporaryManifest = `${manifestPath}.${process.pid}.tmp`;
  try {
    for (const [path, bytes] of outputs) {
      const full = resolve(root, path);
      mkdirSync(resolve(full, '..'), { recursive: true });
      await writeFile(full, bytes, { flag: 'wx' });
      created.push(full);
    }
    const errors = validateFestiveImages({
      root,
      photos: [...photos, photo],
      articles,
      policy,
      now: Date.now(),
    });
    if (errors.length) throw new Error(errors.join('\n'));
    if (sha256(await readFile(manifestPath)) !== sha256(manifestBytes))
      throw new Error(
        'Manifest changed concurrently; retry after reviewing its new contents',
      );
    await writeFile(
      temporaryManifest,
      JSON.stringify([...photos, photo], null, 2) + '\n',
      { flag: 'wx' },
    );
    created.push(temporaryManifest);
    await rename(temporaryManifest, manifestPath);
    return photo;
  } catch (error) {
    for (const file of created.reverse()) await unlink(file).catch(() => {});
    throw error;
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === new URL(import.meta.url).pathname
) {
  if (process.argv.length !== 3) {
    console.error(
      'Usage: npm run images:festive -- /path/to/reviewed-image-packet.json',
    );
    process.exitCode = 1;
  } else {
    try {
      const photo = await prepareFestiveImage(
        process.cwd(),
        JSON.parse(await readFile(process.argv[2], 'utf8')),
      );
      console.log(
        `Registered ${photo.id}: ${photo.variants.length} WebP sizes; originals and edit archived. Drafts still require editorial approval and release checks.`,
      );
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
