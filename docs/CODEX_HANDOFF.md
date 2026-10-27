# Codex execution brief — Egemen Özen portfolio V1

> Historical handoff from 26 October 2026. Check current project content and QA results in `CONTENT_AUDIT.md`, `QA_REPORT_TR.md` and `README.md` before acting on any older checklist below.

## Mission
Implement and verify the supplied Astro source locally, using the approved minimalist navy/mint design. Preserve user's existing GitHub Pages website until review. Do not add generic AI imagery, fake stats, skill percentages, testimonials, empty buttons or marketing fluff.

## Important current context
- GitHub repo already exists: `egemenozen1/egemenozen1.github.io` (public, contains old 2024 `index.html` & `background.webp`). Do **not** run `gh repo create` under the same name.
- Older site should remain available pending sign-off; create backup branch / annotated tag and work in `revamp/astro-portfolio` branch, not `main`.
- This bundle is intentionally unpublished. No changes should go live without owner approval.
- Current source inventory, project lineup and local runtime may have changed; consult the current README and QA report.

## Execute in order
1. Read `docs/ARCHITECTURE.md` and `docs/CONTENT_AUDIT.md`. Check current repository state with authenticated GitHub access before mutations. No destructive actions.
2. Ensure supported Node.js >=22.23.4 (recommend Node 24 LTS); from project root run `npm install` and commit `package-lock.json`.
3. Run `npm run check:source`, `npm run build`, `npm run check:dist`, start Astro local server and inspect desktop & mobile in a real browser. Fix Astro 7 / Markdown collection issues if any. `docs/QA_REPORT_TR.md` documents tests performed on static preview only, not a real Astro build.
4. Audit public links and verify all project claims against their source material. Avoid unsupported metrics and clinical claims.
5. Keep visual alignment with `preview/index.html` (logo and hero left edges must align). Source of truth is the Astro components, content collection, and CSS. Preview is a visual QA reference, not deploy artifact.
6. Add proper `impressum.astro`, `privacy.astro` ONLY after legally correct content and owner-provided details. Add no placeholder postal address. Confirm publicly exposed personal contact data before go-live. Verify the final English CV before enabling Resume download.
7. Use the existing special GitHub Pages repo; require branch + PR, run checks, review preview. Never overwrite original main before approval.
8. After owner confirms release, create `release-approval.json` with the reviewed boolean fields and deploy manually with GitHub Pages Source=GitHub Actions.

## Definitions of done
- Astro builds without warnings/errors; homepage, four case-study routes, custom 404, robots.txt, sitemap.xml render.
- Responsive at 360/390/768/1024/1440 px, no horizontal overflow.
- Navigation, keyboard focus, link safety and reduced-motion audited.
- Project descriptions backed by real repository/documentation.
- No placeholder links, dead forms, analytics cookies, external font calls or fabricated claims.
- Legal/privacy/contacts reviewed before public release.
- Existing 2024 site safely backed up and new main only after owner review.
