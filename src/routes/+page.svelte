<script lang="ts">
import { base } from "$app/paths";

let { data } = $props();

const variantOf = (id: string) => data.variants.find((x) => x.id === id);

let selected = $state<Set<string>>(new Set(data.registry.map((r) => r.id)));

const selectedIds = $derived([...selected]);
const compareHref = $derived(selectedIds.length ? `${base}/compare?ids=${selectedIds.join(",")}` : `${base}/compare`);
</script>

<svelte:head><title>Proton Variants</title></svelte:head>

<h2 class="mb-4 text-xl font-semibold">Compare selected…</h2>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each data.registry as ref (ref.id)}
    {@const v = data.variants.find((x) => x.id === ref.id)}
    <div
      class="relative flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-100 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
    >
      <input
        type="checkbox"
        checked={selected.has(ref.id)}
        onchange={(e) => {
          const next = new Set(selected);
          if (e.currentTarget.checked) next.add(ref.id);
          else next.delete(ref.id);
          selected = next;
        }}
        class="relative z-10 mt-1"
        aria-label={`Select ${ref.displayName}`}
      />
      <div class="min-w-0 flex-1">
        <a href={`${base}/variant/${ref.id}`} class="absolute inset-0" aria-label={ref.displayName}></a>
        <h3 class="text-base font-semibold">{ref.displayName}</h3>
        {#if variantOf(ref.id)?.release}
          {@const vInfo = variantOf(ref.id)!}
          <p class="mt-1 text-xs text-neutral-400">{vInfo.release}</p>
          {#if vInfo.releaseDate}
            <p class="text-xs text-neutral-500">{vInfo.releaseDate}</p>
          {/if}
        {/if}
        <p class="mt-1 text-xs text-neutral-500">{v ? `${v.options.length} env vars` : "pending scrape"}</p>
        <a
          href={ref.repoUrl}
          target="_blank"
          rel="noreferrer"
          class="relative z-10 mt-2 block truncate text-xs text-sky-400 hover:underline"
        >
          {ref.repoUrl}
        </a>
      </div>
    </div>
  {/each}
</div>

<div class="mt-6">
  <a
    href={compareHref}
    class="inline-block rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
  >
    Compare {selectedIds.length} selected
  </a>
</div>
