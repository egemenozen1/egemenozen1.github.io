# Portfolio architecture and release status

## Objectives

A restrained, English-language Astro portfolio showing data analysis, applied AI, product thinking and technical implementation through evidence-backed projects. The existing navy/mint identity is preserved.

## Architecture

- Astro 7 builds the site to static HTML; GitHub Pages needs no runtime server.
- `src/content/projects/*.md` is the typed source for the four ordered case studies.
- `src/pages/projects/[id].astro` prerenders all four case routes with a shared scannable overview and previous/next navigation.
- `ProjectCard.astro` uses native anchors; `ProjectInteraction.astro` uses native `<details>` for keyboard-operable product and method walkthroughs.
- Global CSS provides responsive breakpoints, visible focus styles and reduced-motion behavior. No new runtime dependency, analytics, data store or client-side chart library was added.
- The TFT flow describes the repository code because a verified prediction output is not available. The recommendation walkthrough describes the thesis research, not a deployed engine.

## Routes

- `/` — hero, four ordered projects, expertise, education, background and contact.
- `/projects/futureme-ai/`
- `/projects/pytorch-forecasting-tft/`
- `/projects/recommendation-systems/`
- `/projects/antidepressant-binding-mechanisms/`
- `/404.html`, `/robots.txt`, and `/sitemap.xml` are generated during the production build.

## GitHub Pages target

- Repository: `egemenozen1/egemenozen1.github.io`; default branch: `main`.
- Existing address: `https://egemenozen1.github.io/`; no custom domain is configured.
- The repository is an account-level user site, so `astro.config.mjs` sets `site` and does not set a repository-prefix `base`.
- Current Pages settings still publish `main` from `/`. The migration branch is `portfolio-astro-preparation`; it does not affect the live site.
- The old site commit `3eca72aa716905e0eaef2f9972be5fc9a810d687` is preserved on `backup/pre-astro-portfolio-2026-10-27` and in `legacy-site-backup/` on the migration branch.
- `.github/workflows/deploy.yml` is prepared for `main` push/manual deployment but runs `check:release` before build/deploy. Switch Pages to GitHub Actions only as part of the approved release sequence; see `docs/RELEASE_CHECKLIST.md`.

## Validation state

- Source inventory, static preview check and generated production HTML/link check pass.
- Production Astro build generates six HTML pages: homepage, four case studies and 404.
- Source audit confirms the English labels, Education wording and reduced-motion/focus hooks.
- Real browser testing of the new Astro site remains unverified: the local server was reachable from its shell but browser navigation timed out; the workspace has no Playwright/Puppeteer package. See `docs/QA_REPORT_TR.md`.
- `npm run check:release` currently blocks because the real Impressum and privacy pages and owner-reviewed approval are absent. Do not create placeholders.
