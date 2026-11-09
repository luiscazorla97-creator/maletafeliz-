type PresentationAsset = { src: string; width: number; height: number };

// Optional, pre-encoded presentation assets. Published photo records and their
// original WebP URLs remain authoritative and are always the img fallback.
const assets = import.meta.glob<PresentationAsset | string>(
  '../assets/home-photos/*.avif',
  { eager: true, import: 'default' },
);
const variants = new Map<string, { src: string; width: number }[]>();
for (const [file, asset] of Object.entries(assets)) {
  const match = file.match(/\/([^/]+)-(\d+)w\.avif$/);
  if (!match) continue;
  const entries = variants.get(match[1]) || [];
  entries.push({
    src: typeof asset === 'string' ? asset : asset.src,
    width: Number(match[2]),
  });
  variants.set(match[1], entries);
}

export function homeAvifSrcSet(photoId: string): string | undefined {
  return variants
    .get(photoId)
    ?.toSorted((a, b) => a.width - b.width)
    .map((image) => `${image.src} ${image.width}w`)
    .join(', ');
}
