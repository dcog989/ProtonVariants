<script lang="ts">
import { base } from "$app/paths";
import { VARIANTS } from "$lib/variants";
</script>

<svelte:head><title>About — Proton Variants</title></svelte:head>

<nav class="mb-4 text-2xl text-neutral-500 dark:text-neutral-400">
  <a href="{base}/" class="text-sky-400 hover:underline">All variants</a>
  <span class="px-2">→</span>
  <span class="font-bold text-neutral-900 dark:text-neutral-100">About</span>
</nav>

<section class="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
  <p>
    Proton Variants compiles the runtime environment variables for each Proton variant — Valve's
    Steam compatibility layer and its community forks. Content is parsed from each variant's
    README at build time and regenerated on a 24-hour cadence via CI. The site is a prerendered
    static bundle with no runtime backend.
  </p>

  <h2 class="text-base font-semibold text-neutral-900 dark:text-neutral-100">Update cadence</h2>
  <p>
    A scheduled workflow (<code class="font-mono">cron: "0 0 * * *"</code>) runs the scraper, which
    performs a conditional GET against each README (using <code class="font-mono">ETag</code> /
    <code class="font-mono">Last-Modified</code>). Unchanged sources are skipped; changed sources
    are re-parsed, the generated data is committed, and the static site is rebuilt and published.
  </p>

  <h2 class="text-base font-semibold text-neutral-900 dark:text-neutral-100">Sources</h2>
  <ul class="space-y-1">
    {#each VARIANTS as ref (ref.id)}
      <li>
        <a href={ref.repoUrl} class="text-sky-400 hover:underline">{ref.displayName}</a>
      </li>
    {/each}
  </ul>

  <h2 class="text-base font-semibold text-neutral-900 dark:text-neutral-100">License</h2>
  <p>MIT</p>
</section>
