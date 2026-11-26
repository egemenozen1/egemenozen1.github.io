---
title: "MarketPulse"
category: "Data product / investment intelligence"
thesis: "A local-first investment workspace where every number keeps its receipt: source, observation time and whether it is a sample."
summary: "Positions, transactions, market context and a research journal in one editorial terminal. Missing values stay missing, stale prices are flagged, and sample data is never shown as live."
year: "2026"
role: "Product, data model, full-stack implementation, UI design"
status: "Runs locally · private source"
order: 2
flagship: true
disciplines: ["Data Analytics", "Product Development", "AI Engineering"]
technologies: ["React", "TypeScript", "Python", "FastAPI", "SQLite", "Lightweight Charts", "ECB & CoinGecko APIs"]
evidence:
  - state: verified
    text: "The backend suite passed 74 tests and the production build passed in the November 2026 redesign sprint."
  - state: verified
    text: "Browser checks at 360, 390, 768, 1280 and 1440 px covered overflow, navigation, valuations, chart keyboard controls, journal recovery and backups."
  - state: by-design
    text: "Local-first: transactions, quantities and holdings stay in a local SQLite file and are never sent to a data source."
  - state: limit
    text: "Not financial advice, not real-time prices and no investment returns are claimed. Screens use fictional fixture data."
  - state: private
    text: "A local application, not a public web service. Source and demo are not publicly available."
cover: "../../assets/work/marketpulse-portfolio.png"
coverAlt: "MarketPulse portfolio workspace on a dark navy interface: recorded holdings value, unrealized and realized P&L, a BTC price-history chart and an allocation bar, all using fictional fixture data."
coverCaption: "My Portfolio workspace, desktop. Fictional fixture data."
---
## The problem

Portfolio numbers are easy to show and hard to trust. Prices come from different sources, currencies and observation times; some are samples, some are stale, some are missing. Most dashboards smooth this over. MarketPulse makes it visible.

## Data model and calculations

Assets, trades, quotes and FX rates live in a local SQLite database. Every quote and rate carries its source, observation time, fetch time and a sample flag. Cost basis uses a moving-average EUR method: purchase fees join the cost, partial sales reduce it proportionally and sale fees reduce proceeds. Unrealized P&L uses the latest price and rate; an FX-effect component separates currency movement from asset movement.

When a price or rate is missing, the position's value stays **empty**. Totals are labeled "recorded" or "known" value, concentration is computed only on known values, and prices older than three days are marked stale and raise a data-review flag.

## Sources

ECB reference rates and CoinGecko crypto prices are connected and refreshed only on request — no background polling. Before connecting a source I compared coverage, limits and licensing; unofficial or key-gated feeds were deliberately left out, so stock, ETF and gold prices are entered manually for now.

## Interface

The November 2026 redesign moved the workspace to an ink-navy editorial terminal: Newsreader headings, Manrope controls and tabular figures for every amount. Portfolio, Markets, News & Events and Research & Outlook share one navigation rail and a mobile dock. Charts use TradingView's Lightweight Charts and break their lines across gaps longer than 36 hours instead of interpolating.

## Limits

MarketPulse is a single-user local application. It does not support dividends, splits or cash flows yet, so P&L may not equal economic return. It gives no buy or sell signals, and nothing here is financial advice.
