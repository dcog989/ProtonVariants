<script lang="ts">
  let { data } = $props();
  const { variants, nameToVariants, allNames, registry } = data;

  const variantById = new Map(variants.map((v) => [v.id, v]));
  const displayName = (id: string) => registry.find((r) => r.id === id)?.displayName ?? id;

  function isUnique(name: string): boolean {
    return (nameToVariants.get(name)?.length ?? 0) === 1;
  }
  function owner(name: string): string {
    return nameToVariants.get(name)?.[0] ?? "";
  }
  function optionFor(variantId: string, name: string) {
    return variantById.get(variantId)?.options.find((o) => o.name === name);
  }
</script>

<svelte:head><title>Compare — ProtonNexus</title></svelte:head>

<a href="/" class="text-xs text-sky-400 hover:underline">← All variants</a>
<h1 class="mb-1 mt-2 text-2xl font-bold">Compare Variants</h1>
<p class="mb-4 text-sm text-neutral-400">
  All {allNames.length} environment variables across variants. Rows highlighted in
  <span class="text-amber-400">amber</span> are unique to a single variant.
</p>

<div class="overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-neutral-800 text-left text-neutral-400">
        <th class="py-2 pr-4 font-medium">Env Var</th>
        {#each variants as v (v.id)}
          <th class="py-2 pr-4 font-medium">{displayName(v.id)}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each allNames as name (name)}
        {@const unique = isUnique(name)}
        <tr class="border-b border-neutral-900 align-top" class:text-amber-400={unique}>
          <td class="py-2 pr-4 font-mono">{name}</td>
          {#each variants as v (v.id)}
            {@const opt = optionFor(v.id, name)}
            <td class="py-2 pr-4 text-neutral-300">
              {#if opt}
                {opt.type}{opt.default ? ` · ${opt.default}` : ""}
              {:else}
                <span class="text-neutral-700">—</span>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="mt-6 text-sm text-neutral-400">
  <h2 class="mb-2 font-semibold text-neutral-200">Unique per variant</h2>
  <ul class="space-y-1">
    {#each variants as v (v.id)}
      {@const uniques = v.options.filter((o) => isUnique(o.name))}
      <li>
        <span class="font-medium text-neutral-200">{displayName(v.id)}:</span>
        {#if uniques.length}
          <span class="font-mono text-amber-400">{uniques.map((o) => o.name).join(", ")}</span>
        {:else}
          <span class="text-neutral-600">none</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
