---
title: "FutureMe AI"
category: "Decision lab"
thesis: "Decide today, find out who was right: a hard choice becomes a few dated predictions in your own numbers — and then it keeps score."
summary: "A local-first decision lab. It frames a choice in your own words, asks you to set the probabilities, helps you commit, and later compares what you said with what actually happened. It never predicts outcomes."
year: "2026"
role: "Product direction, backend, interface and deployment, with AI-assisted development"
status: "Live public demo"
order: 3
flagship: true
disciplines: ["Product Development", "AI Engineering", "Data Analytics"]
technologies: ["Python", "FastAPI", "React", "TypeScript", "Vite", "Motion", "Claude API (off by default)", "Docker", "Render", "GitHub Actions"]
liveUrl: "https://futureme-ai-6rgq.onrender.com/"
evidence:
  - state: verified
    text: "135 Python tests, 10 web unit tests, the type check and 12 browser journeys on desktop and mobile pass (re-run on 26 November 2026)."
  - state: limit
    text: "The live demo runs guided templates with AI switched off. The Claude path is tested against a recording fake; no live model call has been made."
  - state: live
    text: "The public demo runs the new version, with a fictional worked example that shows the full loop."
  - state: by-design
    text: "FutureMe never predicts outcomes or gives odds. You set every probability."
  - state: by-design
    text: "Decisions are saved only in your browser: no account, database, cookies or analytics. Framing sends the text to the server for that request; it is not logged or stored."
  - state: private
    text: "Source repository is private. Screens show a fictional example."
cover: "../../assets/work/futureme-home.png"
coverAlt: "FutureMe home: “Decide today. Find out who was right.” beside a fork diagram with three options and dated predictions, above the field “What are you deciding?”."
coverCaption: "Live demo home, captured 26 November 2026."
---
## The problem

People facing a job offer, a move or a course already have plenty of advice. What they lack is a record of what they expected at the time. Six months later hindsight rewrites the story, so nothing is learned about their own judgement.

## One loop, four stages

**Frame** turns free text into the real options, what matters, what is still unknown and the assumptions underneath. **Forecast** asks for your own probability or number on dated predictions. **Decide** runs a pre-mortem and records a commitment, with calendar check-ins. **Keep score** compares predictions with what happened: a Brier score, an honesty curve of what you said against what came true, and how far time and cost estimates drift.

The fork is the product's signature: today branches into one road per option, and every dated prediction is a knot on its road.

## AI, where it helps and no further

Claude is used as a bounded drafting engine for frames, pre-mortems and reflections — behind consent, a daily budget, a safety screen and an output critic that rejects certainty language and invented numbers. When AI is off, unavailable or declined, guided templates do the job and say so. Money and time ranges come from a seeded, versioned simulation rather than from a language model.

## Safety and privacy

Crisis language is detected before any engine runs and is routed to human help; nothing is sent to AI. Regulated topics are framed but never judged. Decisions can be exported, imported or deleted at any time.

## What changed

The first version compared three fixed fictional scenarios and accepted no personal input. The rebuild lets people work on real decisions by keeping them in their own browser, and moves the simulation from being the product to one optional tool inside a decision.

## Limits

The browser storage is unencrypted and lives on one device. A Brier score becomes meaningful only after roughly ten resolved predictions. No usage or outcome metrics are claimed, and nothing here is financial, medical, legal or psychological advice.
