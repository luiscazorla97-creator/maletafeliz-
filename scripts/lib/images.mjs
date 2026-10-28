import sharp from 'sharp';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
export async function verifyImageFiles(root, photos) {
  const errors = [];
  for (const photo of photos) {
    for (const image of [photo, ...(photo.variants || [])]) {
      if (
        typeof image.src !== 'string' ||
        !/^\/images\/[a-zA-Z0-9/_-]+\.(webp|avif|jpg|jpeg|png)$/.test(image.src)
      ) {
        errors.push(`${photo.id}: unsafe image path`);
        continue;
      }
      const path = resolve(root, 'public', '.' + image.src);
      try {
        const bytes = readFileSync(path);
        if (createHash('sha256').update(bytes).digest('hex') !== image.sha256)
          errors.push(`${photo.id}: image checksum mismatch`);
        const decoder = sharp(bytes, { limitInputPixels: 40000000 });
        const meta = await decoder.metadata();
        await decoder.stats();
        if (meta.width !== image.width || meta.height !== image.height)
          errors.push(`${photo.id}: decoded dimensions do not match manifest`);
      } catch {
        errors.push(`${photo.id}: image file cannot be decoded`);
      }
    }
  }
  return errors;
}
