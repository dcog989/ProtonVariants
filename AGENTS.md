# AGENTS.md

*ProtonNexus* is a web app reference that compiles the features and runtime options for each variant of Proton, the Steam compatibility layer from Valve.

## Dev Environment

Linux CachyOS / KDE Plasma 6 + Firefox, Zed code editor, fish shell with Ghostty + Fresh editor. yay and bun package managers. All software is updated as of today.

## Tech Stack

- SvelteKit (prerendered via `adapter-static`)
- TypeScript 6
- Tailwind CSS 4
- Biome (lint + format)
- bun (dev, build, package scripts)
- lefthook (local + CI git hooks)

## Architecture

- Build-time scrape: `scripts/scrape.ts` fetches each variant's README, parses runtime options into a normalized schema, and writes `src/data/proton.json`. Fail-fast on fetch/parse errors.
- Prerender stage: SvelteKit prerenders all public routes from the generated JSON via `adapter-static`. No runtime data fetching.
- Scheduled CI (`cron: "0 0 * * *"`) runs scrape + build and publishes the static output.
- Routes: `/` (variant list), `/variant/[id]` (option table with client-side filter/search), `/about` (provenance, cadence, sources).
- See `.docs/HLD.md` for the full high-level design.

## Coding Principles

- Use current coding standards and patterns
- KISS, DRY, YAGNI, SoC, SOLID Principles, Composition Over Inheritance, Rule of Three, POLA, Fail Fast
- Optimize for actual and perceived performance
- Self-documenting code via clear naming
- Comments only for workarounds/complex logic - do NOT add comments as running dev commentary.
- No magic numbers
- Decompose files of 500+ lines
- **Do NOT create docs files** (summary, reference, testing, etc.) unless explicitly requested

## File System Access

### Allowed

- `/home/bubba/Projects/FeedMee/` unless excluded below.

### Disallowed

- `.assets/`, `.docs/`, `.git/`, `node_modules/`, `.repomix/`
- `/src-tauri/capabilities`, `/src-tauri/target`, `/src-tauri/gen`, `/src-tauri/Cargo.lock`
- `repomix.config.json`, `.repomixignore`, `bun.lock`

## Interaction Style

- do not pretend to understand how the user feels. no "You're right to be frustrated." etc.
- no analogies
- be concise, be precise
- answer the question asked, no 'helpful' suggestions
