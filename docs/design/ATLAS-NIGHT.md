# Atlas night revision

The user requested the dark reference more closely and explicitly authorized publication. This revision supersedes the light Explorer preview documented in EXPLORER-ATLAS.md.

The homepage now uses a navy header and hero, large white and cyan headings, a realistic decorative globe, two dark floating cards linked to existing Lisbon/Tokyo guides, and continent photographs immediately below the hero. The search includes a working continent selector using the existing search query interface. The orange suitcase mark is retained. Mobile places the headline and search before the globe. Existing article/category reading styles remain light.

`public/design/earth-atlas.webp` is an AI-generated decorative Earth illustration, optimized to approximately 295 KiB. It is not presented as a documentary photograph, destination photo or geographical data source. All destination photographs are unchanged licensed assets from the existing manifest. The earlier vector globe remains available as an archived design asset but is not loaded by the homepage. No WebGL, runtime library or paid API was added.

Before publishing, remote main was fetched. New destination and Christmas publications were merged without replacing their content, routes, templates or photographs. `atlas-night-preservation.json` records the remote baseline and checks 3,702 protected files: none changed; 120 published ES articles and 120 EN articles retained. This later inventory supersedes the earlier 65-per-language count.

The globe routes pause offscreen/in hidden tabs and respect reduced motion. All text, navigation and search are real HTML. Advertising components, analytics/consent, identifiers, provider scripts, legal exclusions, popunder-disabled state, headers and existing ad dimensions remain unchanged.

Screenshots: `atlas-night-desktop.png` and `atlas-night-mobile.png`. Production validation, deployment and public verification results are recorded with the task delivery. Earlier screenshot/inventory files are historical evidence from the initial light preview.

## Validation before publication

- Astro check: zero errors, warnings or hints.
- Unit suite: 33 passed.
- Preview and release builds: passed, 626 HTML pages.
- E2E suite: 14 passed, including desktop/mobile, intermediate widths, reduced motion and unavailable globe/JavaScript.
- Selected production suite: 42 passed, covering all advertisement/consent checks, homepage and sitemap, ES/EN Lisbon, Tokyo, Cape Town and Christmas New York, on desktop/mobile. Existing ad formats were tested at 320–2560 px with simulated creatives. Real provider delivery is not claimed.
- Public sitemap before publication versus the release build: 602 URLs each, zero added or missing URLs.
- `atlas-night-ads-simulated.png`: the final production layout with clearly labelled simulated ads. Destination/editorial photos are unchanged; only the decorative Earth uses generated artwork.

## Verified publication

Published commit `c3966ec042fa914bfa4f035acd166e812761f030` to both existing Cloudflare projects; both deployment stages completed successfully. HTTPS verification passed for 248 requests, including the 240 localized articles and www redirects. The public sitemap still has the same 602 URLs. The globe's public bytes match the validated release. Public homepage rendering/search passed at desktop, mobile and tablet widths, in ES/EN, using real HTTPS responses forwarded through the managed Node proxy/CA while retaining CSP and TLS validation; third-party provider traffic was blocked. No browser page errors or horizontal overflow were detected.

Evidence: `editorial/verification/2026-11-01-atlas-design.json`. Screenshots: `atlas-night-live-desktop.png`, `atlas-night-live-mobile.png`, `atlas-night-live-english.png`.
