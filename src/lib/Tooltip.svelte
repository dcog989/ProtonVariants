<script lang="ts">
import type { Snippet } from "svelte";

let {
  text,
  children,
}: {
  text: string;
  children: Snippet;
} = $props();
</script>

<span class="group relative z-20 inline-flex items-center">
  {@render children()}
  <span
    role="tooltip"
    class="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden w-64 rounded bg-neutral-900 px-2 py-1 text-xs font-normal normal-case text-neutral-100 shadow-lg group-hover:block dark:bg-neutral-700"
  >
    {text}
  </span>
</span>
