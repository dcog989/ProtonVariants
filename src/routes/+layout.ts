import { loadVariants } from "#lib/data.js";
import { VARIANTS } from "#lib/variants.js";

export const prerender = true;

export async function load() {
  return { variants: loadVariants(), registry: VARIANTS };
}
