<script lang="ts">
import { base } from "$app/paths";
import { page } from "$app/stores";

let { data } = $props();

let query = $state("");

const selectedIds = $derived($page.url.searchParams.get("ids")?.split(",").filter(Boolean) ?? null);
const visibleVariants = $derived(selectedIds ? data.variants.filter((v) => selectedIds.includes(v.id)) : data.variants);

const variantById = $derived(new Map(visibleVariants.map((v) => [v.id, v])));
const displayName = (id: string) => data.registry.find((r) => r.id === id)?.displayName ?? id;

const filteredNames = $derived(
  data.allNames.filter((name) => !query || name.toLowerCase().includes(query.toLowerCase())),
);

function isUnique(name: string): boolean {
  return (data.nameToVariants.get(name) ?? 0) === 1;
}
function optionFor(variantId: string, name: string) {
  return variantById.get(variantId)?.options.find((o) => o.name === name);
}
</script>

<svelte:head><title>Compare — Proton Variants</title></svelte:head>

<nav class="mb-2 text-2xl text-neutral-500 dark:text-neutral-400">
  <a href="{base}/" class="text-sky-400 hover:underline">All variants</a>
  <span class="px-2">→</span>
  <span class="font-bold text-neutral-900 dark:text-neutral-100">Compare</span>
</nav>
<p class="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
  All {data.allNames.length} environment variables across variants. Rows highlighted in
  <span class="text-amber-600 dark:text-amber-400">amber</span> are unique to a single variant.
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
        {@const unique = isUnique(name)}
        <tr class="border-b border-neutral-200 align-top dark:border-neutral-900" class:text-amber-600={unique} class:dark:text-amber-400={unique}>
          <td class="py-2 pr-4 font-mono text-neutral-900 dark:text-neutral-100">{name}</td>
          {#each visibleVariants as v (v.id)}
            {@const opt = optionFor(v.id, name)}
            <td class="py-2 pr-4 text-neutral-700 dark:text-neutral-300">
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
        (o) => isUnique(o.name) && (!query || o.name.toLowerCase().includes(query.toLowerCase())),
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
