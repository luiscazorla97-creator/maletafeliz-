import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
// @ts-ignore Shared build validator.
import { verifyImageFiles } from '../scripts/lib/images.mjs';
describe('decoding actual images', () => {
  it('accepts a decodable file with exact dimensions and bytes', async () => {
    const root = mkdtempSync(join(tmpdir(), 'maletafeliz-image-'));
    try {
      mkdirSync(join(root, 'public/images'), { recursive: true });
      const bytes = await sharp({
        create: { width: 640, height: 300, channels: 3, background: '#aabbcc' },
      })
        .webp()
        .toBuffer();
      writeFileSync(join(root, 'public/images/test.webp'), bytes);
      const photo = {
        id: 'test',
        src: '/images/test.webp',
        width: 640,
        height: 300,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      };
      expect(await verifyImageFiles(root, [photo])).toEqual([]);
      expect(
        (await verifyImageFiles(root, [{ ...photo, width: 900 }])).join(' '),
      ).toContain('dimensions');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  it('rejects a text file disguised as WebP', async () => {
    const root = mkdtempSync(join(tmpdir(), 'maletafeliz-image-'));
    try {
      mkdirSync(join(root, 'public/images'), { recursive: true });
      const bytes = Buffer.from('this is not a photograph');
      writeFileSync(join(root, 'public/images/test.webp'), bytes);
      expect(
        (
          await verifyImageFiles(root, [
            {
              id: 'test',
              src: '/images/test.webp',
              width: 640,
              height: 300,
              sha256: createHash('sha256').update(bytes).digest('hex'),
            },
          ])
        ).join(' '),
      ).toContain('cannot be decoded');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
