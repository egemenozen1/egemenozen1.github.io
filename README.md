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

## Source of truth
- `src/components/*` — reusable UI
- `src/layouts/BaseLayout.astro` — document layout, metadata
- `src/pages/index.astro` — homepage sections
- `src/pages/projects/[id].astro` — shared case-study template
- `src/content/projects/*.md` — projects; `src/content.config.ts` validates frontmatter
- `src/styles/global.css` — design system and responsive styles

## Deployment

The deploy workflow runs on pushes to `main` and manual dispatch. It checks `check:release` before building or deploying, so publication remains blocked until real legal pages and an explicitly reviewed approval file are supplied. The existing Pages source is currently `main` at `/`; switch Pages to **GitHub Actions** only when the reviewed release is ready. A remote backup branch, `backup/pre-astro-portfolio-2026-10-27`, preserves the old site's exact source commit `3eca72aa716905e0eaef2f9972be5fc9a810d687`.

## Checks already executed
- Real Astro build: homepage, four case studies, 404, robots.txt and sitemap.xml.
- Generated HTML/anchor audit: **6 pages, zero failures** (`npm run check:dist`).
- Source inventory: `npm run check:source` (zero failures).
- **Not yet tested:** Lighthouse, Core Web Vitals, private FutureMe source or legal approval. See `docs/QA_REPORT_TR.md`.

## Static visual prototype
Open `preview/index.html` directly in a browser. It has no external assets or services and is not the Astro build output.
