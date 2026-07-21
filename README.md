# Proton Variants

This web app allows you to compare and query the numerous variants of Proton, the Steam compatibility layer produced by Valve Software.

It compiles and lists the runtime environment variables for each variant of Proton. It allows you to compare and explore those environment variables. The data is scraped daily from the respective README files for each Proton variant.

The Proton variants are referenced from [CachyOS Gaming Wiki](https://wiki.cachyos.org/configuration/gaming/) and [ProtonPlus](https://github.com/Vysp3r/protonplus).

---

## Proton Variants

- <https://github.com/ValveSoftware/Proton>
- <https://github.com/CachyOS/proton-cachyos>
- <https://github.com/Etaash-mathamsetty/Proton>
- <https://github.com/GloriousEggroll/proton-ge-custom>
- <https://dawn.wine/dawn-winery/dwproton>
- <https://github.com/SpookySkeletons/proton-ge-rtsp>

## Features

- Landing page listing all Proton variants with summary cards.
- Per-variant page with a full, filterable env-var table.
- Client-side search/filter over prerendered data (no server).
- Provenance and update-cadence disclosure on an About page.
- Static output: fast load, cheap to host, no runtime database.

## Tech Stack

- SvelteKit (prerendered via `adapter-static`)
- TypeScript 6
- Tailwind CSS 4
- Biome (lint + format)
- bun (dev, build, package scripts)
- lefthook (local + CI git hooks)
- Static hosting (GitHub Pages)

## Build & Deploy

1. `bun run scrape` — fetch and parse variant READMEs into `src/data`.
2. `bun run build` — prerender the static site via SvelteKit.
3. A scheduled CI workflow (`cron: "0 0 * * *"`) runs steps 1–2 and publishes the build output.

See `.docs/HLD.md` for the full high-level design.

## License

MIT
