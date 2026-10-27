---
title: "FutureMe AI"
category: "Decision-support web application"
summary: "A public demo for comparing assumption-based outcomes through fixed fictional decision scenarios."
problem: "Compare consequential trade-offs without presenting uncertain outcomes as forecasts."
approach: "The public interface uses three fixed fictional examples and one shared fictional starting profile; it does not accept personal questions or custom profiles."
verifiedOutput: "A live demo with a five-year modeled range and a small-experiment prompt for the selected fictional scenario; no user or outcome metrics have been verified."
order: 1
featured: true
technologies: ["Python", "FastAPI", "JavaScript", "Docker"]
liveUrl: "https://futureme-ai-6rgq.onrender.com/"
scope: "Product and engineering"
---
## Overview and objective

Important decisions involve trade-offs that are difficult to compare clearly. FutureMe AI is a decision-support application for exploring scenarios and possible outcomes. Its current public demo uses three fixed fictional examples and one shared fictional starting profile. The objective is to make assumptions and alternatives easier to examine, without presenting an uncertain outcome as a forecast.

## My contribution and approach

I developed the product and worked across its Python backend, JavaScript interface and user experience. AI-assisted development was part of the workflow; implementation choices and claims on this page remain my responsibility. The known stack includes FastAPI and Docker, but the private source must be checked before describing endpoints, deployment architecture or model behavior in detail.

## Validation and result

The [public demo](https://futureme-ai-6rgq.onrender.com/) currently offers examples for a short career course, reduced working hours and a side project. Its interface shows a modeled range over a five-year horizon and suggests a small experiment to consider. The current deployment's test coverage could not be independently verified for this case study, so no reliability, usage or outcome metrics are claimed.

## Limitations

This is an evolving independent product. The public demo accepts built-in sample IDs, not personal questions or custom profiles. It should be evaluated as decision support, not as guaranteed predictive advice. The private repository and deployment configuration need review before publishing more precise technical details.

## What I learned

Building a usable product requires both technical correctness and clear communication of uncertainty. Features need to justify their complexity through the problem they solve.
