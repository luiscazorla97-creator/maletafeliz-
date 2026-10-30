# MaletaFeliz editorial and development instructions

The current specification is docs/requirements.md. It supersedes earlier project prompts.

- Spanish and English only. No paid AI APIs, databases, automated AI workers, purchases, or quota workarounds.
- Work in this existing checkout; each Codex task is already isolated. Do not create a worktree unless requested.
- Never confuse planned destinations, illustrations or test fixtures with published guides or licensed documentary photographs.
- Do not launch publicly until the twenty requested originals and all forty complete localisations pass research, image, editorial, build and browser checks.
- `npm run build` creates a noindex design preview. `npm run build:release` is the mandatory production gate. Do not bypass it or lower checks to obtain a passing build.
- Content lives in `content/articles/*.json`; geographic coverage and unique intent in `editorial/plan.json`; source evidence in `content/research/`; exact image permissions in `content/images/manifest.json`; content-hash approvals in `content/reviews/`.
- Every recommended place (`kind: place`) must have its own relevant, licensed documentary photograph. A cover image elsewhere in the guide does not satisfy this requirement. Match the actual place, retain attribution, and use optimized responsive images in both languages.
- Read `docs/EDITORIAL.md` before handling `PUBLICAR 5 ARTÍCULOS`. Research real sources, reuse facts/photos across languages, keep incomplete items pending, and record external blockers.
- The batch reservation command is not an AI writer, scheduler or publication command. No persistent Codex cloud scheduler has been verified. Never claim an active daily task without actual configuration and a witnessed run.
- No quota percentage is available in this environment. Reduce a batch when necessary, never buy credits.
- Preserve real publication dates, do not refresh update dates without substantive changes, and review both languages after a factual correction.
- `npm run check`, `npm test`, `npm run build`, and `npm run test:e2e` are the standard verification commands. Tests contain isolated synthetic data, never launch content.
- Keep private credentials out of Git, content, logs and browser code. No application credentials are needed for the static site.
