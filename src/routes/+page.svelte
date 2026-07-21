<script lang="ts">
import { base } from "$app/paths";
import { VARIANTS } from "$lib/variants";

let { data } = $props();

const variantOf = (id: string) => data.variants.find((x) => x.id === id);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
};

function initialSelected() {
  return new Set(data.registry.map((r) => r.id));
}

let selected = $state(initialSelected());

const selectedIds = $derived([...selected]);
const compareHref = $derived(selectedIds.length ? `${base}/compare?ids=${selectedIds.join(",")}` : `${base}/compare`);
</script>

<svelte:head><title>Proton Variants</title></svelte:head>

<p class="mb-4 text-sm text-neutral-600 dark:text-neutral-400">Click to view or compare the following…</p>

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
            <p class="text-xs text-neutral-500">{formatDate(vInfo.releaseDate)}</p>
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
    class="inline-block rounded bg-neutral-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-400"
  >
    Compare {selectedIds.length} selected
  </a>
</div>

<hr class="mt-8 border-neutral-200 dark:border-neutral-800">

<section class="mt-8 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
  <h2 class="text-base font-semibold text-neutral-900 dark:text-neutral-100">What is this?</h2>
  <p>Proton is Steam's compatibility layer, produced by Valve Software, that allows you to run Windows games on Linux. There are numerous variants of this base Proton version.</p>
  <p>This web app compiles and lists the runtime environment variables for each variant of Proton. It allows you to compare and explore those environment variables. The data is scraped daily from the respective README files for each Proton variant. </p>
  <p>The Proton variants are referenced from <a href="https://wiki.cachyos.org/configuration/gaming/" class="text-sky-400 hover:underline">CachyOS Gaming Wiki</a> and <a href="https://github.com/Vysp3r/protonplus" class="text-sky-400 hover:underline">ProtonPlus</a>.</p>
</section>
