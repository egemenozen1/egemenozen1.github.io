---
title: "PyTorch Forecasting — Temporal Fusion Transformer (TFT)"
category: "Time-series forecasting"
summary: "Lower average CO forecast error, but weak uncertainty coverage: a held-out comparison with persistence."
problem: "How much can we trust a prediction interval when the model reduces average error?"
approach: "Evaluate a PyTorch Forecasting TFT against same-origin persistence on chronological held-out data, checking both error and interval coverage."
verifiedOutput: "Committed outputs show 7.8% lower aggregate MAE than persistence; the nominal 80% interval covers only 43.3% of observed forecast points."
order: 2
featured: true
technologies: ["Python", "PyTorch Forecasting", "Temporal Fusion Transformer", "PyTorch Lightning"]
sourceUrl: "https://github.com/egemenozen1/pytorch-forecasting-tft"
scope: "Independent experiment · implementation using PyTorch Forecasting"
---
## Problem

Can lower average carbon-monoxide forecast error coexist with unreliable uncertainty? The experiment uses hourly UCI Air Quality CO measurements in mg/m³.

## Decision

The repository implementation uses PyTorch Forecasting's TFT rather than implementing the architecture from scratch. It separates training, validation and test periods chronologically and evaluates the median forecast and p10–p90 interval. The source code and committed outputs support these implementation choices; the README describes Egemen's independent experiment, rather than providing an independent authorship audit.

## Alternative

Same-origin persistence repeats the last observed CO value for every future hour. It is a deliberately simple benchmark against which the model must justify its complexity.

## Measurement

Across all 24 horizons, MAE is 1.109 mg/m³ versus persistence at 1.203 mg/m³: a 7.8% reduction. MAE is the mean absolute difference between actual and predicted CO. The 32,437 evaluated forecast-origin/horizon pairs represent 1,374 unique timestamps; overlapping windows are not independent observations.

## Where it fails

The nominal 80% interval covers only 43.3% of observations overall, falling from 48.3% at one hour to 42.0% at 24 hours. Persistence also beats TFT on MAE at both selected horizons (1 and 24 hours), despite TFT’s lower aggregate MAE. Lower point error does not establish reliable uncertainty. This is a single-site experiment, not an operational air-quality alert service.

## Inspect the evidence

[Code and methodology at source commit 26ee667](https://github.com/egemenozen1/pytorch-forecasting-tft/tree/26ee6676494eea76b2219c4c9adfe66481ecdc16). The graph above uses a local copy of the committed metrics and horizon CSV; per-horizon persistence MAE is derived from the same prediction CSV and checked against its aggregate metric. Training was not rerun for this portfolio update.

Data attribution: Vito, S. (2008), *Air Quality*, UCI Machine Learning Repository, [DOI 10.24432/C59K5F](https://doi.org/10.24432/C59K5F), CC BY 4.0 as documented in the source repository. The chart is an original SVG rendering of aggregate results, with no third-party image asset.
