import { VARIANTS } from "$lib/variants";
import { loadVariants } from "$lib/data";

export const prerender = true;

export async function load() {
  return { variants: loadVariants(), registry: VARIANTS };
}
