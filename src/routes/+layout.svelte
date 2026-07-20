<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="min-h-screen bg-neutral-950 text-neutral-100">
  <header class="border-b border-neutral-800">
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <a href="/" class="text-lg font-semibold tracking-tight">ProtonNexus</a>
      <div class="flex gap-4 text-sm text-neutral-400">
        <a href="/" class="hover:text-neutral-100">Variants</a>
        <a href="/compare" class="hover:text-neutral-100">Compare</a>
        <a href="/about" class="hover:text-neutral-100">About</a>
      </div>
    </nav>
  </header>
  <main class="mx-auto max-w-5xl px-4 py-8">
    {@render children()}
  </main>
  <footer class="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
    ProtonNexus — compiled runtime options for Proton variants.
  </footer>
</div>
