---
title: "Ictavo"
category: "Data product / market intelligence"
thesis: "The signal behind the noise: each screen answers one question in one big sentence — what happened this week, what changed for you, why it may have happened, and what is ahead."
summary: "A market app that replays the week hour by hour, splits changes in your holdings into price, exchange-rate and transaction effects, and tests possible causes one by one — without advice or forecasts. The public demo runs it in your browser with invented data."
year: "2026"
role: "Product direction, data rules and full-stack build, with AI-assisted development"
status: "Public demo with invented data · private source"
liveUrl: "https://ictavo.pages.dev/"
order: 2
flagship: true
disciplines: ["Data Analytics", "Product Development", "AI Engineering"]
technologies: ["React", "TypeScript", "Python", "FastAPI", "SQLite", "Motion", "Lenis", "Pyodide (WebAssembly)", "Cloudflare Pages", "CoinGecko, ECB, Fed & GDELT data"]
evidence:
  - state: verified
    text: "164 backend tests, 11 demo-engine tests, 14 local and 9 demo browser journeys pass on synthetic data, locally and in CI (27 November 2026)."
  - state: live
    text: "The public demo runs the same interface and Python calculations in the browser, with no server. Every price, exchange rate, release, headline and sample holding in it is invented."
  - state: limit
    text: "No investment advice, price forecasts or trading. The explanation thresholds are product judgement and are not backtested."
  - state: by-design
    text: "Local-first: in the full app, quantities and trades stay in a local SQLite ledger and a Why? page sends only the asset's public ID to CoinGecko and GDELT. In the demo, records stay in the visitor's browser."
  - state: by-design
    text: "Each possible cause is tested separately and stamped Fits, Partly, Doesn't fit or Can't check. Fitting the evidence is not presented as proof."
  - state: limit
    text: "The optional AI narrative is off by default and no successful model answer has been verified yet; the rules-based reading is used."
  - state: private
    text: "The source is private. Live market data stays out of the public demo until display and redistribution rights are cleared."
cover: "../../assets/work/ictavo-week.png"
coverAlt: "The week screen in Ictavo: the headline “A heavy week. 59 of 73 fell.” above an hourly line of the typical asset over seven days, with a replay slider. Sample portfolio with invented holdings."
coverCaption: "The week, replayable hour by hour. Sample portfolio, invented holdings."
---
## The question

What changed since I last looked, what may explain it, what did it do to my holdings, and what should I watch next? A first redesign answered this with a dense, dark dashboard. I replaced it: now the colour of a page follows the market, and every screen opens with one answer generated from data.

## Four screens

**The week** puts seven days into one sentence and one line you can drag or play back. Assets appear as bubbles sized by market value, central-bank publications sit on the timeline, and “What the week hid” surfaces measured facts — the worst hour, assets that moved against the crowd, large assets furthest below their peak (a research list, never a buy signal).

**Your beat** shows what changed in your holdings since your last visit, split into price, exchange-rate and own-transaction effects that add up exactly to the change in recorded value. A missing or changed price source is excluded and named.

**Why?** takes one asset and tests explanations one by one. A market-wide move counts when beta × Bitcoin covers at least 70% of it; an asset-specific one when the remainder is at least 1.5 times its usual size; volume is compared with its 30-day median.

**Ahead** lists the next official dates and Federal Reserve and ECB publications next to your exposure.

## Data and the AI boundary

In the local app, market data comes from CoinGecko, the ECB, the Federal Reserve and GDELT, cached in memory with timestamps and backoff; unreliable sources degrade to a stated gap. The accounting engine and ledger schema stayed unchanged through the rebuild. An optional model narrative receives public evidence only, and an answer is shown only if every statement cites that evidence and contains no advice, prediction or unhedged cause.

## Limits

The full application is local and single-user. The public demo has invented data, no accounts and no AI, keeps records in one browser and downloads about 11 MB on the first visit. In the local app, live data covers crypto and official macro sources; stocks, ETFs and gold can be recorded but have no live feed. Portfolio returns are not computed because cash flows are outside the ledger. Real holdings in the new screens, a screen reader and a physical phone have not been tested.
