# ProtonNexus

*ProtonNexus* is a web app reference that compiles the features and runtime options for each variant of Proton, the Steam compatibility layer from Valve.

The runtime options for each are scraped from their respective README files at build time and regenerated on a 24-hour cadence via CI. The output is a prerendered static site with no runtime backend.

Repository: <https://github.com/dcog989/ProtonNexus>

---

## Proton Variants

- <https://github.com/ValveSoftware/Proton>
- <https://github.com/CachyOS/proton-cachyos>
- <https://github.com/Etaash-mathamsetty/Proton>
- <https://github.com/GloriousEggroll/proton-ge-custom/>
- <https://dawn.wine/dawn-winery/dwproton>

## Features

- Landing page listing all Proton variants with summary cards.
- Per-variant page with a full, filterable runtime-options table.
- Client-side search/filter over prerendered data (no server).
- Provenance and update-cadence disclosure on an About page.
- Static output: fast load, cheap to host, no runtime database.

## Tech Stack

- SvelteKit (prerendered via `adapter-static`)
- TypeScript
- Tailwind CSS
- bun (dev, build, package scripts)
- lefthook (local + CI git hooks)
- Static hosting (GitHub Pages / Cloudflare Pages / Netlify)

## Build & Deploy

1. `bun run scrape` — fetch and parse variant READMEs into `src/data`.
2. `bun run build` — prerender the static site via SvelteKit.
3. A scheduled CI workflow (`cron: "0 0 * * *"`) runs steps 1–2 and publishes the build output.

See `.docs/HLD.md` for the full high-level design.

## License

MIT
