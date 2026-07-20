import { loadVariants } from "$lib/data";
import type { Variant } from "$lib/types";
import { VARIANTS } from "$lib/variants";

export const prerender = true;

function build(variants: Variant[]) {
  const allNames = [...new Set(variants.flatMap((v) => v.options.map((o) => o.name)))].sort();
  return { variants, allNames, registry: VARIANTS };
}

export async function load() {
  return build(loadVariants());
}
