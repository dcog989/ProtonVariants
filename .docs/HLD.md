# High-Level Design: ProtonNexus

## 1. Overview

ProtonNexus is a static web reference that compiles the features and runtime
options for each variant of Proton, Valve's Steam compatibility layer. Content
is sourced from the upstream README files of each Proton variant and regenerated
on a 24-hour cadence at build time. No runtime database or server-side scraping
is required; the site is a pre-rendered static bundle.

### Goals

- Provide a single, searchable reference for Proton runtime options across variants.
- Keep content current via periodic, automated rebuilds from upstream sources.
- Load fast and stay cheap to host (static output, no runtime backend).

### Non-Goals

- No user accounts, comments, or contributions.
- No runtime fetching of upstream data (scraping is build-time only).
- No historical version diffing beyond what upstream READMEs document.

## 2. Scope & Data Sources

Proton variants covered (configurable list):

| Variant        | Source |
|----------------|--------|
| Valve Proton   | <https://github.com/ValveSoftware/Proton> |
| Proton CachyOS | <https://github.com/CachyOS/proton-cachyos> |
| Etaash Proton  | <https://github.com/Etaash-mathamsetty/Proton> |
| Proton GE      | <https://github.com/GloriousEggroll/proton-ge-custom/> |
| DWProton       | <https://dawn.wine/dawn-winery/dwproton> |

## 3. Tech Stack

- **Framework:** SvelteKit + TypeScript 6
- **Runtime / tooling:** bun (dev, build, package scripts)
- **Styling:** Tailwind CSS 4
- **Lint/Format:** Biome 2.5
- **Output:** Prerendered static site (`adapter-static`)
- **Scheduling:** External cron / CI job triggers `bun run build` every 24h
- **Hosting:** GitHub Pages

## 4. Architecture

```text
                ┌─────────────────────────┐
   cron / CI ──▶│   bun run build          │
   every 24h    │                          │
                │  1. Scrape stage         │
                │     fetch README files   │
                │     parse → structured   │
                │     write data/*.json    │
                │                          │
                │  2. Prerender stage      │
                │     SvelteKit routes     │
                │     read data/*.json     │
                │     emit static HTML/CSS │
                └────────────┬─────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Static host     │
                    │  (built assets)  │
                    └────────┬─────────┘
                             │
                             ▼
                        End user browser
```

### 4.1 Scrape Stage (`scripts/scrape.ts`)

- Reads the variant registry (id, display name, README URL).
- Fetches each README over HTTP with a timeout and a `User-Agent`.
- Parses runtime options into a normalized schema (see §5).
- Writes `src/data/<variant>.json` (or a single `src/data/proton.json`).
- Fail-fast: a fetch/parse error for a variant aborts the build and is logged.
- Caching: store raw README bytes with a short TTL to avoid redundant fetches
  within a single run; never rely on a stale cache for the published build.

### 4.2 Prerender Stage

- SvelteKit `prerender = true` for all public routes.
- `adapter-static` emits the static bundle.
- Routes read from the generated JSON; no runtime data fetching.

## 5. Data Model

Normalized per-option record:

```ts
interface RuntimeOption {
  name: string;        // e.g. PROTON_LOG
  description: string; // plain-text summary
  type: "bool" | "string" | "int" | "enum" | "path";
  default?: string;
  values?: string[];   // for enums
  source: string;      // variant id
}

interface Variant {
  id: string;
  displayName: string;
  repoUrl: string;
  readmeUrl: string;
  options: RuntimeOption[];
  scrapedAt: string;   // ISO timestamp
}
```

## 6. Routes / Pages

- `/` — landing: list of variants with summary cards.
- `/variant/[id]` — full option table for one variant, with filtering/search.
- `/about` — provenance, update cadence, source links.

Search/filter is client-side over the prerendered JSON (no server).

## 7. Project Layout

```text
ProtonNexus/
├── scripts/
│   └── scrape.ts          # build-time scraper
├── src/
│   ├── data/              # generated JSON (git-ignored or committed)
│   │   └── proton.json
│   ├── lib/
│   │   ├── variants.ts    # variant registry
│   │   ├── parse.ts       # README → RuntimeOption[]
│   │   └── types.ts       # interfaces above
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte           # /
│       ├── variant/[id]/+page.ts  # load + render
│       └── about/+page.svelte
├── static/
├── svelte.config.js       # adapter-static, prerender
├── tailwind.config.ts
└── package.json           # bun scripts: dev, build, scrape
```

## 8. Build & Deploy Pipeline

1. `bun run scrape` — fetch + parse READMEs into `src/data`.
2. `bun run build` — prerender static site via SvelteKit.
3. CI cron (GitHub Actions scheduled workflow, `cron: "0 0 * * *"`) runs
   steps 1–2 and publishes the `build/` output to the static host.
4. Commit the generated JSON only if changes are detected (optional).

## 9. Coding Principles (from AGENTS.md)

- KISS, DRY, YAGNI, SoC, SOLID; composition over inheritance.
- Self-documenting names; comments only for workarounds/complex logic.
- No magic numbers — use named constants (e.g. fetch timeout, TTL).
- Decompose files > 500 lines.
- Fail fast on scrape/parse errors.

## 10. Open Questions

- Commit generated JSON to the repo, or treat as build artifact only?
- Exact scheduling mechanism (GitHub Actions vs host cron).
- Search/filter requirements (full-text vs simple substring).
- Handling variants whose README has no parseable options table.
