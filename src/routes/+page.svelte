<script lang="ts">
  let { data } = $props();
  const { variants, registry } = data;
</script>

<svelte:head><title>ProtonNexus — Variants</title></svelte:head>

<h1 class="mb-2 text-2xl font-bold">Proton Variants</h1>
<p class="mb-6 text-sm text-neutral-400">
  Runtime environment variables compiled from each variant's README. Refreshed daily.
</p>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each registry as ref (ref.id)}
    {@const v = variants.find((x) => x.id === ref.id)}
    <a
      href={`/variant/${ref.id}`}
      class="block rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-600"
    >
      <h2 class="text-base font-semibold">{ref.displayName}</h2>
      <p class="mt-1 text-xs text-neutral-500">{v ? `${v.options.length} env vars` : "pending scrape"}</p>
      <p class="mt-2 truncate text-xs text-sky-400">{ref.repoUrl}</p>
    </a>
  {/each}
</div>
