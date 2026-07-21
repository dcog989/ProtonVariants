<script lang="ts">
import { browser } from "$app/environment";
import { base } from "$app/paths";
import { page } from "$app/stores";

let { data } = $props();

let query = $state("");
let selectedIds = $state<string[] | null>(null);

if (browser) {
  $effect(() => {
    const ids = $page.url.searchParams.get("ids")?.split(",").filter(Boolean) ?? null;
    selectedIds = ids;
  });
}

const visibleVariants = $derived.by(() => {
  const ids = selectedIds;
  if (!ids) return data.variants;
  return data.variants.filter((v) => ids.includes(v.id));
});

const variantById = $derived(new Map(visibleVariants.map((v) => [v.id, v])));
const displayName = (id: string) => data.registry.find((r) => r.id === id)?.displayName ?? id;

const filteredNames = $derived(
  data.allNames.filter((name) => !query || name.toLowerCase().includes(query.toLowerCase())),
);

function optionFor(variantId: string, name: string) {
  return variantById.get(variantId)?.options.find((o) => o.name === name);
}
</script>

<svelte:head><title>Compare — Proton Variants</title></svelte:head>

<nav class="mb-4 text-2xl text-neutral-500 dark:text-neutral-400">
  <a href="{base}/" class="text-sky-400 hover:underline">All variants</a>
  <span class="px-2">→</span>
  <span class="font-bold text-neutral-900 dark:text-neutral-100">Compare</span>
</nav>
<p class="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
  All {data.allNames.length} environment variables across variants. <span class="text-amber-600 dark:text-amber-400">Amber highlights</span> indicate a unique env var for that Proton variant.
</p>

<div class="mb-4">
  <input
    type="search"
    bind:value={query}
    placeholder="Filter by variable name…"
    class="w-72 rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-sky-500 dark:border-neutral-700 dark:bg-neutral-900"
  />
</div>

<div class="overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <th class="py-2 pr-4 font-medium">Env Var</th>
        {#each visibleVariants as v (v.id)}
          <th class="py-2 pr-4 font-medium">{displayName(v.id)}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each filteredNames as name (name)}
        {@const unique = data.uniqueNames.includes(name)}
        <tr class="border-b border-neutral-200 align-top dark:border-neutral-900">
           <td
            class="py-2 pr-4 font-mono"
            class:text-neutral-900={!unique}
            class:dark:text-neutral-100={!unique}
            class:text-amber-600={unique}
            class:dark:text-amber-400={unique}
          >
            <span class="group relative inline-flex items-center gap-0.5">
              {name}
              {#if data.descriptions[name]}
                <span
                  class="cursor-help pl-1 text-neutral-400 hover:text-sky-500 dark:text-neutral-600 dark:hover:text-sky-400"
                  aria-label={data.descriptions[name]}
                  role="note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
                    <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 5.25a.75.75 0 0 0 1.5 0 .75.75 0 0 0-1.5 0ZM8 7a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 7Z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span
                  class="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden w-64 rounded bg-neutral-900 px-2 py-1 text-xs font-normal normal-case text-neutral-100 shadow-lg group-hover:block dark:bg-neutral-700"
                >{data.descriptions[name]}</span>
              {/if}
            </span>
          </td>
          {#each visibleVariants as v (v.id)}
            {@const opt = optionFor(v.id, name)}
            <td
              class="py-2 pr-4"
              class:text-neutral-700={!unique}
              class:dark:text-neutral-300={!unique}
              class:text-amber-600={unique}
              class:dark:text-amber-400={unique}
            >
              {#if opt}
                {opt.type}
              {:else}
                <span class="text-neutral-400 dark:text-neutral-700">—</span>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
  <h2 class="mb-2 font-semibold text-neutral-900 dark:text-neutral-200">Unique per variant</h2>
  <ul class="space-y-1">
    {#each visibleVariants as v (v.id)}
      {@const uniques = v.options.filter(
        (o) => data.uniqueNames.includes(o.name) && (!query || o.name.toLowerCase().includes(query.toLowerCase())),
      )}
      <li>
        <span class="font-medium text-neutral-900 dark:text-neutral-200">{displayName(v.id)}:</span>
        {#if uniques.length}
          <span class="font-mono text-amber-600 dark:text-amber-400">{uniques.map((o) => o.name).join(", ")}</span>
        {:else}
          <span class="text-neutral-500 dark:text-neutral-600">none</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
