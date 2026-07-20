<script lang="ts">
import "../app.css";
import { base } from "$app/paths";

let { children } = $props();
</script>

<div class="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
  <header class="border-b border-neutral-200 dark:border-neutral-800">
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <a href="{base}/" class="text-2xl font-semibold tracking-tight">Proton Variants</a>
      <div class="flex gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        <a href="{base}/about" class="hover:text-neutral-900 dark:hover:text-neutral-100">About</a>
      </div>
    </nav>
  </header>
  <main class="mx-auto max-w-5xl px-4 py-8">
    {@render children()}
  </main>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-500">
    Proton Variants — compiled runtime options for Proton variants.
  </footer>
</div>
