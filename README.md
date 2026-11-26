# Egemen Özen — portfolio

Static Astro site for `https://egemenozen1.github.io/`: AI engineering, automation, data analytics and product work, presented with an evidence ledger per project.

```bash
npm ci
npm run dev            # http://localhost:4321
npm run check:source   # content and accessibility guardrails
npm run build && npm run check:dist
```

## Where things live
- `src/content/projects/*.md` — every project, with its evidence ledger (`verified`, `live`, `by-design`, `private`, `limit`). Schema in `src/content.config.ts`.
- `src/pages/index.astro` — homepage sections; `src/pages/projects/[id].astro` — case-study template.
- `src/components/` — `StoryCanvas` (helix → TFT forecast lines → agent office), `HorizonExplorer`, `MissionReplay`, `ProvenanceInspector`, `FutureMeStage`, `EvidenceLedger`.
- `src/data/` — committed TFT metrics from `egemenozen1/pytorch-forecasting-tft@26ee667` used by the horizon chart.
- `src/styles/global.css` — the "From DNA to Agents" theme (chapter colours via registered custom properties); `components.css` — shared component styles.
- Motion: GSAP ScrollTrigger for the story, stacked cards and toolkit marquee; Lenis for smooth wheel scrolling. All of it is off under reduced motion.

No analytics, cookies or third-party requests: fonts are self-hosted through Fontsource.

## Release
`deploy.yml` publishes `main` to GitHub Pages only when `release-approval.json` marks content, legal pages and links as reviewed. The pre-rebuild site is preserved at tag `baseline/pre-rebuild-2026-11-26`.
