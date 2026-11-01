# MaletaFeliz 3D logo

Static transparent resources preserve the supplied orange suitcase/turquoise raised route and white/turquoise MaletaFeliz wordmark, without a trailing period. Header/footer use a shared BrandLogo component. Standalone marks, app icons and favicon use only the suitcase. No 3D runtime or new dependency was added.

## Application files

- `src/components/BrandLogo.astro`
- `src/layouts/Layout.astro`
- `src/components/Home.astro`
- `src/pages/404.astro`
- `src/pages/[lang]/[...route].astro`
- `src/styles/global.css`
- `public/site.webmanifest`

## Brand resources

- `public/brand/apple-touch-icon-3d.png`
- `public/brand/favicon-3d-32.png`
- `public/brand/icon-3d-192.png`
- `public/brand/icon-3d-512.png`
- `public/brand/icon-3d.webp`
- `public/brand/logo-horizontal-3d-1024.webp`
- `public/brand/logo-horizontal-3d-512.webp`
- `public/brand/logo-horizontal-3d.png`

PNG originals and responsive WebP variants have real alpha transparency. The horizontal lockup is reserved at a 1024:288 ratio; responsive CSS sets its rendered width without stretching it. Header height and menu structure are unchanged. Width-specific header checks passed at 320, 390, 768, 820, 1024 and 1440 px. Header/footer use the wordmark only on dark backgrounds; light-background contexts use the standalone orange suitcase.

All active legacy SVG references were replaced, including publisher logo metadata (only the logo URL changes) and the web manifest. Legacy files are retained to preserve existing asset URLs.

## Verification

- `npm run check`: zero errors/warnings.
- `npm test`: 33 passed.
- `npm run test:e2e`: 28 passed.
- `npm run build`: 626 pages compiled successfully; every generated HTML page references the new brand.
- Header/logo geometry checked across six widths: image loads, correct aspect ratio, no logo clipping or overlap with navigation/actions.
- Advertising components, Analytics/consent, provider configuration and IDs, article data, editorial records, documentary images, route generation, sitemap and dependencies are unchanged. The earlier authorized banner move and language/header changes are retained.
- Cloudflare's existing `npm run build:release` remains the mandatory production gate.

Screenshots: `logo-3d-1440.png`, `logo-3d-390.png`. The reference presentation was used to prepare the independent logo resources; the presentation board is not embedded in the site.
