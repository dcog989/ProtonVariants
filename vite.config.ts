import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const base = (process.env.BASE_PATH ?? "") as `/${string}` | "";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        pages: "build",
        assets: "build",
        fallback: undefined,
        precompress: false,
        strict: true,
      }),
      paths: { base },
      prerender: { entries: ["*"] },
    }),
  ],
});
