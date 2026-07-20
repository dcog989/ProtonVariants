import { loadVariants } from "$lib/data";
import { VARIANTS } from "$lib/variants";

export const prerender = true;

export async function load() {
  return { variants: loadVariants(), registry: VARIANTS };
}
