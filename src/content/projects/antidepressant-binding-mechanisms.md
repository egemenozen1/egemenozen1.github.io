---
title: "Antidepressant binding mechanisms — molecular docking"
category: "BSc senior design / computational biology"
thesis: "Where it started: a docking workflow, and the lesson that a computational score is not a clinical result."
summary: "A 2022 senior design team project with Kemal Tan Karademir exploring docking scores for selected compounds against two serotonin-transporter structures."
year: "2022"
role: "Team project · senior design"
status: "Academic report"
order: 6
flagship: false
disciplines: ["Data Analytics"]
technologies: ["AutoDock Vina", "AutoDockTools", "PyMOL", "Molecular docking"]
evidence:
  - state: verified
    text: "The team report documents AutoDock Vina docking and PyMOL visualization for ten compounds against structures 5I6X and 7VOE."
  - state: limit
    text: "Numerical comparisons are omitted because the report contains inconsistencies. No clinical or biological effect was measured."
---
## Overview

Our undergraduate senior design project in 2022, completed as a team with Kemal Tan Karademir. Although the report title refers to comparing drug effects, the documented work is docking and visualization; it does not measure clinical or biological treatment effects.

## Method

Ten compounds and two serotonin-transporter structures, 5I6X and 7VOE, were selected. Structures came from the Protein Data Bank and compounds from PubChem. The workflow prepared PDBQT files, placed docking grid boxes around previously bound ligands, ran AutoDock Vina and visualized poses in PyMOL.

## Why the numbers are not shown

The report's methods and discussion contain inconsistencies — including differences in the described compound groups and protein context — that need review before its scores can be interpreted. Docking scores are computational outputs; they do not establish measured binding affinity, effectiveness or safety.

## What I took from it

Computational screening can frame structural questions, but its outputs need validation. That habit — asking what a number does and does not prove — runs through everything I have built since.
