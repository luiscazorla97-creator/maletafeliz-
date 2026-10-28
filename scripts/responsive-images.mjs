import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const path = 'content/images/manifest.json';
const photos = JSON.parse(await readFile(path, 'utf8'));
for (const photo of photos) {
  const input = resolve('public', '.' + photo.src);
  photo.variants = [];
  for (const target of [480, 800, 1200]) {
    if (target >= photo.width) continue;
    const src = photo.src.replace(/\.[a-z]+$/, `-${target}w.webp`);
    const { data, info } = await sharp(input)
      .rotate()
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    await writeFile(resolve('public', '.' + src), data);
    photo.variants.push({
      src,
      width: info.width,
      height: info.height,
      sha256: createHash('sha256').update(data).digest('hex'),
    });
  }
  photo.variants.push({
    src: photo.src,
    width: photo.width,
    height: photo.height,
    sha256: photo.sha256,
  });
}
await writeFile(path, JSON.stringify(photos, null, 2) + '\n');
console.log(`Prepared responsive variants for ${photos.length} photographs.`);
