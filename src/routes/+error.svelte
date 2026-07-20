<script lang="ts">
import { base } from "$app/paths";
import { page } from "$app/stores";
</script>

<svelte:head><title>Not found — Proton Variants</title></svelte:head>

<div class="py-16 text-center">
  <h1 class="text-3xl font-bold">{$page.status}</h1>
  <p class="mt-2 text-neutral-600 dark:text-neutral-400">
    {$page.status === 404 ? "Page not found" : ($page.error?.message ?? "Something went wrong")}
  </p>
  <a href="{base}/" class="mt-4 inline-block text-sky-400 hover:underline">← Back to variants</a>
</div>
