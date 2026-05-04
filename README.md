# BDN 2026 Maine Primary Voter Guide

A static single-page application that lets readers explore where candidates stand on key issues in the 2026 Maine primary races.

## Races covered

- U.S. Senate — Democratic Primary
- Governor — Democratic Primary
- Governor — Republican Primary
- 1st Congressional District — Republican Primary
- 2nd Congressional District — Democratic Primary

## Features

- **Candidate cards** with inline expandable policy views — no page navigation required
- **Priority topics** surfaced per race based on party and office level
- **Side-by-side compare** — select up to two candidates and see key policy differences inline on the same page
- **Cited sources** — every claim links to a debate clip, interview, or news article
- Candidate photos with smart face-crop

## Files

| File | Description |
|---|---|
| `index.html` | App shell and static markup |
| `app.js` | All rendering, routing, and compare logic |
| `style.css` | Styles |
| `data.json` | Candidate profiles, topics, quotes, and sourced policy positions |
| `policy_differences.json` | Head-to-head policy contrast data for the compare view |
| `candidate-photos/` | Candidate headshots |

## Running locally

No build step required. Because the app fetches JSON files, it needs to be served over HTTP rather than opened directly from the filesystem:

```bash
cd voter-guide
python3 -m http.server 8765
```

Then open `http://localhost:8765/` in your browser.

## Data pipeline

Candidate data in `data.json` and `policy_differences.json` is produced by a separate Python/Jupyter pipeline that processes debate transcripts, interviews, and news coverage. Contact the newsroom for pipeline access.

---

*Produced by the Bangor Daily News newsroom.*
