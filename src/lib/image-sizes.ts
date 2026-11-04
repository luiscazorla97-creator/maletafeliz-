const px = (n: number) => `${Number(n.toFixed(3))}px`;
const scaled = (offset: number, factor: number) =>
  `calc((100vw - ${offset}px) * ${Number(factor.toFixed(6))})`;

// The two advertisement columns occupy 160px each, with 24px gaps. The
// content frame caps at1608px; .shell then has96px of horizontal clearance.
function sizesForGrid(
  rules: [number, number, number][],
  desktopOffset: number,
  desktopFactor: number,
  desktopCap: number,
  sideAds: boolean,
) {
  const parts = rules.map(([width, offset, factor]) =>
    `(max-width: ${width}px) ${scaled(offset, factor)}`,
  );
  if (sideAds) {
    parts.push(`(max-width: 1439px) min(${px(desktopCap)}, ${scaled(desktopOffset, desktopFactor)})`);
    parts.push(`(max-width: 1640px) ${scaled(desktopOffset + 400, desktopFactor)}`);
    parts.push(px((1640 - desktopOffset - 400) * desktopFactor));
  } else {
    parts.push(`min(${px(desktopCap)}, ${scaled(desktopOffset, desktopFactor)})`);
  }
  return parts.join(', ');
}

export function continentImageSizes(aspect: number, sideAds: boolean) {
  const crop = Math.max(1, aspect);
  return sizesForGrid(
    [[540, 45, crop / 2], [800, 72, crop / 3], [1100, 120, crop / 5]],
    160, crop / 5, 235.2 * crop, sideAds,
  );
}

export function homeCardImageSizes(aspect: number, sideAds: boolean, featuredIndex?: number) {
  const featured = featuredIndex !== undefined;
  const crop = Math.max(1, aspect / (featured ? 1.45 : 1.3));
  if (featured) {
    const fraction = featuredIndex === 0 ? 1.3 / 3.3 : 1 / 3.3;
    return sizesForGrid(
      [[540, 32, crop], [800, 70, crop / 3], [1100, 92, crop / 3]],
      144, fraction * crop, 1192 * fraction * crop, sideAds,
    );
  }
  return sizesForGrid(
    [[540, 45, crop / 2], [800, 60, crop / 2], [1100, 125, crop / 4]],
    165, crop / 4, 292.75 * crop, sideAds,
  );
}

export const articleCoverSizes = '(max-width: 540px) calc(100vw - 32px), (max-width: 800px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 56px), (max-width: 1439px) min(1240px, calc(100vw - 96px)), (max-width: 1640px) calc(100vw - 496px), 1144px';
export const articleBodySizes = '(max-width: 540px) calc(100vw - 32px), (max-width: 800px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 286px), (max-width: 1439px) min(720px, calc(100vw - 406px)), (max-width: 1640px) min(720px, calc(100vw - 806px)), 720px';
