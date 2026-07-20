<script lang="ts">
import { base } from "$app/paths";
import type { OptionType } from "$lib/types";

let { data } = $props();
let query = $state("");
let typeFilter = $state<OptionType | "all">("all");
let hasDefault = $state(false);

const types: Array<OptionType | "all"> = [
  "all",
  "bool",
  "string",
  "int",
  "enum",
  "path",
  "unknown",
];

const filtered = $derived(
  data.options.filter((o) => {
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    if (hasDefault && !o.default) return false;
    if (query && !`${o.name} ${o.description}`.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  }),
);
</script>

<svelte:head><title>{data.ref.displayName} — ProtonNexus</title></svelte:head>

<a href="{base}/" class="text-xs text-sky-400 hover:underline">← All variants</a>
<h1 class="mb-1 mt-2 text-2xl font-bold">{data.ref.displayName}</h1>
<p class="mb-4 text-xs text-neutral-500">
  {data.options.length} env vars · scraped {data.variant?.scrapedAt ?? "n/a"}
</p>

<div class="mb-4 flex flex-wrap items-center gap-3">
  <input
    type="search"
    bind:value={query}
    placeholder="Filter by name or description…"
    class="w-64 rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
  />
  <select
    bind:value={typeFilter}
    class="rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm"
  >
    {#each types as t}
      <option value={t}>{t === "all" ? "All types" : t}</option>
    {/each}
  </select>
  <label class="flex items-center gap-1.5 text-sm text-neutral-300">
    <input type="checkbox" bind:checked={hasDefault} /> has default
  </label>
</div>

{#if filtered.length === 0}
  <p class="text-sm text-neutral-500">No matching environment variables.</p>
{:else}
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-neutral-800 text-left text-neutral-400">
        <th class="py-2 pr-4 font-medium">Name</th>
        <th class="py-2 pr-4 font-medium">Type</th>
        <th class="py-2 pr-4 font-medium">Default</th>
        <th class="py-2 font-medium">Description</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as o (o.name)}
        <tr class="border-b border-neutral-900 align-top">
          <td class="py-2 pr-4 font-mono text-sky-300">{o.name}</td>
          <td class="py-2 pr-4 text-neutral-400">{o.type}</td>
          <td class="py-2 pr-4 font-mono text-neutral-300">{o.default ?? "—"}</td>
          <td class="py-2 text-neutral-300">{o.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
