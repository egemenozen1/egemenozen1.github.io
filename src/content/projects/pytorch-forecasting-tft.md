---
title: "Air-quality forecasting with a Temporal Fusion Transformer"
category: "Time-series forecasting experiment"
thesis: "Lower average error, weak uncertainty: a transformer that beats a naive baseline on average — and loses where it matters."
summary: "A held-out comparison of a PyTorch Forecasting TFT against same-origin persistence on hourly CO measurements, checking both error and prediction-interval coverage."
year: "2026"
role: "Independent experiment · evaluation design"
status: "Public source"
order: 4
flagship: false
disciplines: ["Data Analytics", "AI Engineering"]
technologies: ["Python", "PyTorch Forecasting", "Temporal Fusion Transformer", "PyTorch Lightning", "pandas"]
sourceUrl: "https://github.com/egemenozen1/pytorch-forecasting-tft"
evidence:
  - state: verified
    text: "Across all 24 horizons TFT MAE is 1.109 mg/m³ versus 1.203 for persistence — 7.8% lower, from committed outputs at commit 26ee667."
  - state: limit
    text: "The nominal 80% interval covers only 43.3% of observations, falling from 48.3% at one hour to 42.0% at 24 hours."
  - state: limit
    text: "Persistence beats TFT at the 1-hour and 24-hour horizons. Single-site experiment; training was not re-run for this portfolio."
cover: "../../assets/work/tft-forecast.png"
coverAlt: "Line chart of actual carbon-monoxide measurements, the TFT median forecast and its P10–P90 interval over a week of the test period."
coverCaption: "Committed 24-hour forecast versus observed CO, from the source repository."
---
## Question

Can lower average carbon-monoxide forecast error coexist with unreliable uncertainty? The experiment uses hourly CO measurements (mg/m³) from the UCI Air Quality dataset.

## Design

The implementation uses PyTorch Forecasting's TFT rather than writing the architecture from scratch. Training, validation and test periods are split chronologically, and the evaluation covers both the median forecast and the P10–P90 interval. Same-origin persistence — repeating the last observed value for every future hour — is the deliberately simple benchmark the model must beat to justify its complexity.

## Measurement

Across all 24 horizons, MAE is 1.109 mg/m³ against 1.203 for persistence: a 7.8% reduction. The 32,437 evaluated forecast-origin/horizon pairs cover 1,374 unique timestamps; overlapping windows are not independent observations.

## Where it fails

The nominal 80% interval covers only 43.3% of observations overall. Persistence also wins at exactly the horizons a user might care about most — the next hour, and the same hour tomorrow, where a daily cycle plausibly makes "repeat the last value" a strong forecast. Lower point error does not establish reliable uncertainty. This is a single-site experiment, not an operational air-quality service.

## Inspect the evidence

[Code and methodology at source commit 26ee667](https://github.com/egemenozen1/pytorch-forecasting-tft/tree/26ee6676494eea76b2219c4c9adfe66481ecdc16). The interactive chart uses a local copy of the committed metrics and per-horizon CSV; per-horizon persistence MAE is derived from the same prediction CSV and checked against its aggregate.

Data attribution: Vito, S. (2008), *Air Quality*, UCI Machine Learning Repository, [DOI 10.24432/C59K5F](https://doi.org/10.24432/C59K5F), CC BY 4.0 as documented in the source repository.
