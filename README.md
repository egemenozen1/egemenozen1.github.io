# Egemen Özen portfolio

An Astro portfolio for Data Analytics × Applied AI × Product Development. It targets the existing `egemenozen1/egemenozen1.github.io` user-site repository and preserves its `https://egemenozen1.github.io/` address.

## Start locally

```bash
# Install Node.js >=22.23.4 first
npm ci
npm run check:source
npm run dev
npm run build
npm run check:dist
npm run preview
```

The project was built locally with Node 24.22.1 and Astro 7.4.2. Open `http://localhost:4321/` after `npm run dev`. `preview/index.html` is a static visual reference; use the Astro server or `dist/` for production-route review.

On Windows PowerShell, use `npm.cmd run dev -- --host 127.0.0.1`. With a local server running, `node scripts/responsive-check.mjs http://127.0.0.1:4321` checks the homepage and FutureMe case study at 360, 390, 768, 1280 and 1440 CSS px in Edge and saves temporary screenshots.

## Source of truth
- `src/components/*` — reusable UI
- `src/layouts/BaseLayout.astro` — document layout, metadata
- `src/pages/index.astro` — homepage sections
- `src/pages/projects/[id].astro` — shared case-study template
- `src/content/projects/*.md` — projects; `src/content.config.ts` validates frontmatter
- `src/styles/global.css` — design system and responsive styles

## Deployment

The deploy workflow runs on pushes to `main` and manual dispatch. It checks `check:release` before building or deploying. The owner-reviewed Impressum, privacy page and release approval are in this repository; keep the gate enabled. A remote backup branch, `backup/pre-astro-portfolio-2026-10-27`, preserves the old site's exact source commit `3eca72aa716905e0eaef2f9972be5fc9a810d687`.

## Checks already executed
- Real Astro build: homepage, four case studies, legal pages, 404, robots.txt and sitemap.xml.
- Generated HTML/anchor audit: **8 pages, zero failures** (`npm run check:dist`).
- Source, preview and release checks: zero failures on the November 2026 redesign branch.
- Local Edge viewport audit: homepage and FutureMe case study at five widths, zero horizontal-overflow failures. See `docs/QA_REPORT_TR.md`.
- **Not yet tested:** Lighthouse, Core Web Vitals or private FutureMe source.

## Static visual prototype
Open `preview/index.html` directly in a browser. It has no external assets or services and is not the Astro build output.
