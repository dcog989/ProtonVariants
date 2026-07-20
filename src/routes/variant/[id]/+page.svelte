<script lang="ts">
import { base } from "$app/paths";
import type { OptionType } from "$lib/types";

let { data } = $props();
let query = $state("");
let typeFilter = $state<OptionType | "all">("all");
let uniqueOnly = $state(false);

const types: Array<OptionType | "all"> = ["all", "bool", "string", "int", "enum", "path", "unknown"];

const typeLabel = (t: OptionType | "all") => (t === "unknown" ? "other" : t);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
};

const filtered = $derived(
  data.options.filter((o) => {
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    if (uniqueOnly && !o.unique) return false;
    if (query && !`${o.name} ${o.description}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }),
);
</script>

<svelte:head><title>{data.ref.displayName} — Proton Variants</title></svelte:head>

<nav class="mb-4 text-2xl text-neutral-500 dark:text-neutral-400">
  <a href="{base}/" class="text-sky-400 hover:underline">All variants</a>
  <span class="px-2">→</span>
  <span class="font-bold text-neutral-900 dark:text-neutral-100">{data.ref.displayName}</span>
</nav>
<p class="mb-4 text-xs text-neutral-500">
  {data.options.length} env vars · {data.uniqueCount} unique to this variant · scraped
  {data.variant?.scrapedAt ? formatDate(data.variant.scrapedAt) : "n/a"}
</p>

<div class="mb-4 flex flex-wrap items-center gap-3">
  <input
    type="search"
    bind:value={query}
    placeholder="Filter by name or description…"
    class="w-64 rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-sky-500 dark:border-neutral-700 dark:bg-neutral-900"
  />
  <select
    bind:value={typeFilter}
    class="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    {#each types as t}
      <option value={t}>{t === "all" ? "All types" : typeLabel(t)}</option>
    {/each}
  </select>
  <label class="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
    <input type="checkbox" bind:checked={uniqueOnly} /> unique only
  </label>
</div>

{#if filtered.length === 0}
  <p class="text-sm text-neutral-500">No matching environment variables.</p>
{:else}
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <th class="py-2 pr-4 font-medium">Name</th>
        <th class="py-2 pr-4 font-medium">Type</th>
        <th class="py-2 font-medium">Description</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as o (o.name)}
        <tr class="border-b border-neutral-200 align-top dark:border-neutral-900" class:text-amber-600={o.unique} class:dark:text-amber-400={o.unique}>
          <td class="py-2 pr-4 font-mono text-sky-600 dark:text-sky-300">
            {o.name}
            {#if o.unique}
              <span class="ml-2 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">unique</span>
            {/if}
          </td>
          <td class="py-2 pr-4 text-neutral-500 dark:text-neutral-400">{o.type}</td>
          <td class="py-2 text-neutral-700 dark:text-neutral-300">{o.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
