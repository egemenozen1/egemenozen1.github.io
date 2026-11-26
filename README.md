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
- `src/components/` — `SignalField` (hero canvas), `MissionReplay`, `ProvenanceInspector`, `FutureMeStage`, `HorizonExplorer`, `EvidenceLedger`.
- `src/data/` — committed TFT metrics from `egemenozen1/pytorch-forecasting-tft@26ee667` used by the horizon chart.
- `src/styles/global.css` — the whole design system.

No analytics, cookies or third-party requests: fonts are self-hosted through Fontsource.

## Release
`deploy.yml` publishes `main` to GitHub Pages only when `release-approval.json` marks content, legal pages and links as reviewed. The pre-rebuild site is preserved at tag `baseline/pre-rebuild-2026-11-26`.
