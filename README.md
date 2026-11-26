# Egemen Özen — portfolio

Static Astro site for `https://egemenozen1.github.io/`: AI engineering, automation, data analytics and product work, presented with an evidence ledger per project.

```bash
npm ci
npm run dev            # http://localhost:4321
npm run check:source   # content and accessibility guardrails
npm test
npm run build && npm run check:dist
```

## Where things live
- `src/content/projects/*.md` — every project, with its evidence ledger (`verified`, `live`, `by-design`, `private`, `limit`). Schema in `src/content.config.ts`.
- `src/pages/index.astro` — homepage sections; `src/pages/projects/[id].astro` — case-study template.
- `src/components/` — `StoryCanvas` (helix → TFT forecast lines → agent office), `HorizonExplorer`, `MissionReplay`, `ProvenanceInspector`, `FutureMeStage`, `EvidenceLedger`.
- `src/data/` — committed TFT metrics from `egemenozen1/pytorch-forecasting-tft@26ee667` used by the horizon chart.
- `src/styles/global.css` — the "From DNA to Agents" theme (chapter colours via registered custom properties); `components.css` — shared component styles.
- Motion: the story canvas follows scroll while visible. GSAP loads near the stacked cards or toolkit marquee, and Lenis loads for fine pointers. Reduced motion uses static story frames and disables continuous animation.

No analytics, cookies or third-party requests: fonts are self-hosted through Fontsource.

Run `npm run check:browser` against a running build preview. It uses Edge on Windows and Chrome on Linux. Set `CHROME_PATH` to use another Chromium executable.

## Release

After reviewing a revision of `main`, manually dispatch the Pages workflow from `main` and enter the full reviewed commit SHA. The workflow compares it to the commit it will build and checks the recorded content, legal and link review in `release-approval.json`. Changes merged to `main` do not publish automatically.

The generated pages enforce a CSP through HTML metadata. Framing restrictions require an HTTP response header from the host and cannot be enforced by that metadata.
