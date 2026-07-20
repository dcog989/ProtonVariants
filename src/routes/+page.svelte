<script lang="ts">
import { base } from "$app/paths";

let { data } = $props();
</script>

<svelte:head><title>Proton Variants</title></svelte:head>

<h1 class="mb-2 text-2xl font-bold">Proton Variants</h1>
<p class="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
  Runtime environment variables compiled from each variant's README. Refreshed daily.
</p>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each data.registry as ref (ref.id)}
    {@const v = data.variants.find((x) => x.id === ref.id)}
    <a
      href={`${base}/variant/${ref.id}`}
      class="block rounded-lg border border-neutral-200 bg-neutral-100 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
    >
      <h2 class="text-base font-semibold">{ref.displayName}</h2>
      <p class="mt-1 text-xs text-neutral-500">{v ? `${v.options.length} env vars` : "pending scrape"}</p>
      <p class="mt-2 truncate text-xs text-sky-400">{ref.repoUrl}</p>
    </a>
  {/each}
</div>
