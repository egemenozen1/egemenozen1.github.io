---
title: "EGO AI Studio"
category: "Agent systems / AI automation"
thesis: "A human-governed AI office: one Director, six specialist agents, quality gates and an owner who approves everything irreversible."
summary: "My own AI operating company. Specialist agents research, build, review and verify work through a mission log with quality gates — and nothing is sent, published, bought or pushed without me."
year: "2026 — ongoing"
role: "Founder · system design, engineering, operations"
status: "Running locally · private source"
order: 1
flagship: true
disciplines: ["AI Engineering", "AI Automation", "Product Development"]
technologies: ["Claude Code subagents", "Node.js", "Obsidian knowledge layer", "n8n", "Notion", "Local Control Center"]
evidence:
  - state: verified
    text: "All six specialists were invoked on real assignments and their tool use, output and flaws were recorded, then re-run in four recorded missions in November 2026."
  - state: verified
    text: "21 offline test suites across office, knowledge, revenue, projects and storage. A recorded coordination run passed 118 tests across seven suites."
  - state: by-design
    text: "Specialists never call each other; every hand-off goes through the Director, who runs the commands and tests."
  - state: by-design
    text: "Sending, applying, publishing, buying and pushing stay with the owner."
  - state: private
    text: "The repository and its data are private. This page describes the architecture; it does not link to source."
---
## What it is

EGO AI Studio is the operating system behind my independent AI practice. A Director — the main Claude Code session — receives an objective, breaks it into stages and assigns them to six specialists: research and market intelligence, software engineering, product and UX review, quality and security review, data and automation, and career intelligence. Each specialist is a subagent with its own role, instructions and a deliberately narrow tool set: reviewers read and search, but cannot edit.

## How a mission runs

Every objective becomes a mission in a log. Stages can depend on each other, carry quality gates that must pass before the next stage starts, and record disagreements between specialists instead of hiding them. A hook stores each specialist's report against its stage, so the history shows who read what, who changed what and what was left unverified.

In one recorded coordination test the objective was an integrity check for the office's own status command. Research gathered sourced facts with a "verify first" list; the Director checked the key claim against the official documentation; the engineer implemented the check; the Director ran all seven suites (118 tests passed); and the QA reviewer — read-only, running nothing — returned three minor findings, which were fixed with a new test.

## Knowledge and operations

The office reads a curated Obsidian vault as its long-term memory and writes its own notes to a dedicated folder. Revenue and project operations — leads, qualification, estimates, proposals, milestones — run as modules with a locked, atomic, backed-up JSON store. A local Control Center shows today's work, the business pipeline, projects and knowledge in one place.

## Why it matters for client work

The same patterns — narrow agent roles, explicit gates, human approval for irreversible actions, recorded evidence — are what I bring to client automations. An agent is only added where it adds value; plain sequential work stays in a workflow tool such as n8n.

## Limits

This is a single-owner system that runs on my machine. Its source and data are private, its agents are tested on my own objectives, and no client-facing uptime or business result is claimed here.
