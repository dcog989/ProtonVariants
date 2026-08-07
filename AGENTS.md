# AGENTS.md

*Proton Variants* is a web app reference that compiles the features and runtime options for each variant of Proton, the Steam compatibility layer from Valve.

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
- Routes: `/` (variant list + about info), `/variant/[id]` (option table with client-side filter/search), `/compare` (cross-variant comparison).
- See `.docs/HLD.md` for the full high-level design.

## Coding Principles

- Keep modifications minimal and scoped. Ask before architectural changes.
- Do not delete files or make destructive changes without confirmation.
- Do not create documentation files unless explicitly requested.
- Prefer incremental improvements over rewrites.
- Use explicit types and named constants (no magic numbers).
- Return explicit error types; do not suppress exceptions.
- Follow standard repository linting and formatting configs (Biome, rustfmt, .editorconfig).
- Decompose files over 400 lines if they mix concerns.
- Never run git mutations (commit, push, reset, rebase, amend) unless explicitly asked.
- Self-documenting code via clear naming. Use comments only for complex workarounds or issues that need noting - why, not what.
- Do not run full `bun run check`/`bun run test` on trivial changes (constant tweaks, one-line edits, CSS value changes). Only run the full suite on real logic changes.
- On completion of an update or fix, print a concise conventional commit message in a fenced code block.

## File System Access

### Allowed

- `/home/bubba/Projects/FeedMee/` unless excluded below.

### Disallowed

- `.assets/`, `.docs/`, `.git/`, `node_modules/`, `.repomix/`
- `/src-tauri/capabilities`, `/src-tauri/target`, `/src-tauri/gen`, `/src-tauri/Cargo.lock`
- `repomix.config.json`, `.repomixignore`, `bun.lock`

## Interaction Style

- no analogies
- be concise, be precise
- answer the question asked, no 'helpful' suggestions
