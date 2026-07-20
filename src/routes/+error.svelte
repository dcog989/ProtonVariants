<script lang="ts">
  import { page } from "$app/stores";
</script>

<svelte:head><title>Not found — ProtonNexus</title></svelte:head>

<div class="py-16 text-center">
  <h1 class="text-3xl font-bold">404</h1>
  <p class="mt-2 text-neutral-400">Page not found: {$page.status}</p>
  <a href="/" class="mt-4 inline-block text-sky-400 hover:underline">← Back to variants</a>
</div>
