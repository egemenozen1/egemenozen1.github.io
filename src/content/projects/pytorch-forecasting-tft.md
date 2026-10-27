---
title: "PyTorch Forecasting — Temporal Fusion Transformer (TFT)"
category: "Time-series forecasting"
summary: "An exploratory forecasting project applying PyTorch Forecasting's Temporal Fusion Transformer to environmental time-series data."
problem: "Explore whether a Temporal Fusion Transformer can be configured for one-step environmental time-series forecasting."
approach: "The repository analysis script selects UCI Air Quality's CO_GT_ field, creates a chronological 80/20 split and configures a one-step TFT."
verifiedOutput: "The public repository contains the analysis code and evaluation logic, including an R² calculation; no forecast output or reproducible score has been independently verified."
order: 2
featured: true
technologies: ["Python", "PyTorch Forecasting", "Temporal Fusion Transformer", "PyTorch Lightning"]
sourceUrl: "https://github.com/egemenozen1/pytorch-forecasting-tft"
scope: "Independent project"
---
## Overview and objective

This project explores the Temporal Fusion Transformer (TFT) for time-series forecasting. The repository identifies the UCI Air Quality dataset and the `CO_GT_` carbon monoxide field as the prediction target.

## Technical approach

The analysis script parses the date and time fields, creates a sequential time index, and defines a single series. It creates a chronological 80/20 train/test split and configures a TFT through PyTorch Forecasting and PyTorch Lightning. The script sets a one-step prediction horizon and computes an R² value as part of its evaluation code.

## Results and validation

No performance result is presented here. The repository README reports metrics, but the training and evaluation pipeline has not been independently reproduced or reviewed for preprocessing, test-set construction, scaling, and metric consistency. A reported score should not be read as verified forecasting performance until that review is complete.

## Limitations

This is an exploratory model implementation, not a deployed environmental forecasting service. The current code and README differ in some training details; the evaluation design also needs further review before quantitative results can support a conclusion.

## What I learned

Time-series model comparisons depend on a clear forecasting horizon and an evaluation pipeline that preserves the chronology and context of the held-out period. Reporting the model name alone does not establish forecast quality.
