# Source audit and verified inventory — 2026-10-26

## Existing website
- Public repo: https://github.com/egemenozen1/egemenozen1.github.io
- Existing `main` contains `index.html` and `background.webp`.
- Last visible commit: `3eca72aa716905e0eaef2f9972be5fc9a810d687` (2024-11-10).
- The old HTML uses a static sample email `egemen.ozen@example.com`, an unconnected contact form and arbitrary skill bars; do not carry these over.
- Existing site incorrectly presents German B2 in 2024 HTML; current level must be confirmed before any claims.
- Do not overwrite `main` without backing up and reviewing old contents.

## Confirmed public sources
- PyTorch Forecasting TFT: https://github.com/egemenozen1/pytorch-forecasting-tft — README, analysis script, notebook and AirQualityUCI dataset files are public. The source identifies `CO_GT_` as the target and implements a chronological split. README metrics are omitted pending review of test dataset construction, scaling and metric consistency.
- Recommendation-systems repository: https://github.com/egemenozen1/Personalized-Content-Recommendation-Systems-with-SQL-AI — public dissertation PDF and README. Present as research, not deployed software.
- FutureMe AI live URL user provided: https://futureme-ai-6rgq.onrender.com/ . Private repo not accessible through current GitHub connector (404, does **not** prove that the repository is missing). Confirm screenshots, stack and specific features with local Codex access before launch.
- Antidepressants senior design report: local report names Egemen Özen and Kemal Tan Karademir as project members. It describes docking ten compounds against structures 5I6X and 7VOE using AutoDock Vina and PyMOL. It does not establish treatment effects. Report inconsistencies and unvalidated docking scores remain; omit numeric rankings and clinical conclusions.

## Publication blockers
<!-- Editorial TODO: Obtain the private FutureMe source, verify its current architecture and test coverage, and confirm which AI-assisted development details Egemen wants disclosed. -->
<!-- Editorial TODO: Review the TFT notebook/script for evaluation context, scaling, preprocessing, and metric consistency before adding reported scores. -->
<!-- Editorial TODO: Review the dissertation PDF directly before citing specific empirical findings or implementation details. -->
<!-- Editorial TODO: Reconcile the senior design report's compound groupings and protein context, then validate any docking-score ranking before publication. -->
1. Verify technical details and feature claims for FutureMe AI from current code/release.
2. Review TFT notebook/script and repeat its evaluation before publishing numerical scores.
3. Reconcile and validate the senior design report before publishing any docking scores; make no clinical claims.
4. Verify education degree status and current CV; add downloadable PDF when approved.
5. Confirm whether public email `egemen.oezen@gmail.com` is desired for new site (appears in old public project README).
6. Confirm personal LinkedIn link; old site has a possible URL but was not tested.
7. Complete legitimate Impressum & privacy notice (Germany), obtain legal review where appropriate. Never fabricate an address.
8. Keep the current Astro build and generated HTML checks passing.
