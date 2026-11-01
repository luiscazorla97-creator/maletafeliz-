# Explorer + Atlas design review

Implemented in `design/explorer-atlas`, starting from commit `31988ad`.

The existing Astro site keeps its orange suitcase logo, editorial JSON, photographs, translations, dates, routes and SEO generation. Presentation now uses warm white, navy, teal and coral, serif headings, a two-column homepage and a lightweight shaded globe. The globe is an SVG orthographic projection, not WebGL; there is no new runtime dependency, paid API or blocking 3D initialization. Its decorative routes animate only while visible, pause in hidden tabs, and respect reduced motion. Navigation, the GET search form and destination cards work without JavaScript.

Globe coastlines: Natural Earth 1:110m land, public domain, downloaded from `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson`. Terms: `https://www.naturalearthdata.com/about/terms-of-use/`. The globe is labelled as an illustration. Destination cards reuse the existing documentary photographs and credits, linking to published guides. The reference screenshot is not used as a page or documentary photograph.

Home sections cover published destinations, the five continents with real coverage, existing categories, seasonal guides and recent articles. Category and article pages inherit the palette and reading typography. Article content and templates are unchanged.

## Preservation evidence

- `explorer-atlas-before.json`: source baseline, 65 published ES and 65 published EN articles, dates, slugs, advertising configuration and SHA-256 hashes for 2,902 protected files.
- `explorer-atlas-routes-before.json`: 395 existing generated documents, SEO metadata and article text hashes captured before the new build replaced `dist`.
- `explorer-atlas-preservation.json`: comparison after the preview build. Reproduce from the repository root with `npm run build` followed by `python docs/design/verify-preservation.py`.
- Advertising components, Layout, analytics scripts, configuration, `ads.txt` and headers remain byte-for-byte unchanged. Existing top, bottom, side and native placements retain their provider identifiers, script ordering, responsive behavior and exclusions. The popunder stays disabled.

## Verification

Results are recorded in the task delivery. Browser advertising tests use simulated creatives to avoid real impressions and Analytics events. They verify placement, dimensions, provider configuration, consent and exclusions; they do not establish actual provider delivery or approval.

Screenshots in this directory are local design previews and are intentionally noindex. The redesign has not been deployed to the public domain.

### Completed checks

- `npm run check`: 47 files, zero errors/warnings/hints.
- `npm test`: 33 passed. The initial restricted sandbox blocked subprocesses; rerunning with the supported execution permissions passed without code changes.
- `npm run build`: passed.
- `npm run build:release`: passed, 130 published localizations, no editorial errors or pending items, 392 HTML pages built.
- `npm run test:e2e`: 14 passed, desktop and mobile, plus checks at 320/768/1024 px, reduced motion, disabled JavaScript and unavailable globe asset.
- Selected production browser suite: 38 passed (all advertising/consent tests, homepage and sitemap checks, and ES/EN Lisbon, Tokyo and Cape Town guides on desktop and mobile). Banner geometry checks cover 320–2560 px. Command: `npm run test:release -- --grep 'production|Analytics|AdSense|banners|legal pages|ads.txt|withdrawal|unavailable local|content clicks|: (lisbon|tokyo|cape-town) '`.
- Preservation audit: 2,902 protected files unchanged; 395 generated documents before and after; no changed routes, SEO metadata or article text hashes.
- Screenshots: `explorer-atlas-desktop.png`, `explorer-atlas-mobile.png`, `explorer-atlas-tablet.png`, `explorer-atlas-category.png`, `explorer-atlas-article.png`.
- `explorer-atlas-ads-simulated.png` shows production layout with clearly labelled simulated creatives. Actual provider delivery remains unverified.
- `git diff --check`: passed.
