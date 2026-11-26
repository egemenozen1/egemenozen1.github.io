---
title: "FutureMe AI"
category: "Decision-support product"
thesis: "A place to think a decision through — ranges instead of promises, and no hidden winner."
summary: "A live public demo that compares a decision against the same fictional baseline, shows a modeled five-year range and suggests one small experiment. It accepts only built-in example IDs, never personal data."
year: "2026"
role: "Product, backend, interface and deployment"
status: "Live public demo"
order: 3
flagship: true
disciplines: ["Product Development", "Data Analytics", "AI Engineering"]
technologies: ["Python", "FastAPI", "JavaScript", "Docker", "Render", "GitHub Actions"]
liveUrl: "https://futureme-ai-6rgq.onrender.com/"
evidence:
  - state: live
    text: "Public demo online with three fictional examples: a short career course, reduced working hours and a small side project."
  - state: by-design
    text: "The server accepts only a built-in example ID and rejects personal questions, custom profiles, notes and save requests."
  - state: by-design
    text: "The same seeded model runs both options; lines are medians and shading is the modeled P10–P90 range."
  - state: limit
    text: "The engine is largely deterministic and assumption-based. It is not an LLM forecast, a personal prediction or financial advice."
  - state: private
    text: "Source repository is private; the live demo is public."
cover: "../../assets/work/futureme-home.png"
coverAlt: "FutureMe public demo homepage: the headline 'Give a decision some room.' beside a dark green card comparing a course with a project."
coverCaption: "Public demo homepage, captured November 2026."
---
## The problem

Big decisions — a course, fewer working hours, a side project — involve trade-offs that are hard to compare honestly. Chat answers tend to pick a winner. FutureMe is designed to show the assumptions instead.

## What the public demo does

Each example compares one change against the same fictional starting profile. The calculated view shows both paths over one, three or five years: medians as lines and the modeled P10–P90 range as shading, with a table alternative for the chart. A deterministic narrator turns the validated output into a briefing through four lenses — financial route, uncertainty boundary, whole-life trade-off and a possible next experiment — without changing a single calculation.

No overall winner is calculated. A financial difference is presented as one lens, not a verdict.

## Privacy by construction

The public version demonstrates the calculation with fixed fictional examples only. The server accepts a sample ID and nothing else; decisions saved in an earlier version stay in the visitor's browser through a device-recovery flow and are not sent to the server.

## My contribution

I built the product end to end: the Python/FastAPI backend and simulation, the JavaScript interface and its accessibility, the Docker deployment on Render and the GitHub Actions test workflow, with AI-assisted development as part of the workflow.

## Limits

The ranges cover only the modeled income and expense variability, not every real-world event. No usage, reliability or outcome metrics are claimed.
