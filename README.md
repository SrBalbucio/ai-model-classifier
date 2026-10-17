# AI Model Classifier

A private app to catalog AI coding models and rate them across categories, so you
can remember which ones you actually liked. Local-only, single SQLite file, no
accounts and no public hosting.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **SQLite** via the built-in `node:sqlite` module (no native dependencies)
- Data lives in `data/classifier.db` (gitignored)

## Getting started

```bash
npm install
npm run seed   # optional: load 16 popular models from the OpenRouter catalog
npm run dev
```

Then open http://localhost:3000 (or the port printed in the terminal).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run seed` | Seed the DB with a handful of popular models |
| `npm run lint` | Run ESLint |

## Features

- **Dashboard** — grid of saved models with logo, provider, average score and a mini radar chart.
- **Add model** — search the OpenRouter catalog (470+ models with price, context
  length and Artificial Analysis benchmarks) or create an entry manually.
- **Model detail** — 1–10 sliders per category, a radar chart profile, external
  reference data and private free-text notes.
- **Rankings** — leaderboard per category.
- **Compare** — two models side by side with overlaid radars and a per-category table.

## Categories

Each model is rated 1–10 on:

| Category | Note |
| --- | --- |
| Autonomy | Works through a task without hand-holding |
| Speed | Feels fast to work with |
| Reasoning | Logical / multi-step problem solving |
| Task Completion | Takes a task end-to-end without stalling |
| Tools / MCP | Tool use and function calling |
| Context Window | Holds context before losing track |
| Cost | Higher = cheaper |
| Hallucinations | Higher = fewer hallucinations |
| Multilingual | Understands and replies in non-English languages |

To add or rename a category, edit `lib/categories.ts`.

## External data

The catalog is fetched from the free [OpenRouter](https://openrouter.ai) models
API (`/api/v1/models`, no API key needed) and cached for 24 hours. Provider logos
are resolved from the model id via Google's favicon service, with an
initials avatar as fallback.

## Notes

- **Corporate proxy / TLS inspection:** `dev`, `build`, `start` and `seed` run with
  `NODE_OPTIONS=--use-system-ca` so Node trusts the OS certificate store. If your
  machine doesn't need this, remove the `cross-env NODE_OPTIONS=--use-system-ca`
  prefix from the scripts in `package.json`.
- To reset all data, delete `data/` and run `npm run seed` again.
