import { loadVariants } from "$lib/data";
import type { Variant } from "$lib/types";
import { countOptionNames } from "$lib/unique";
import { VARIANTS } from "$lib/variants";

export const prerender = true;

function build(variants: Variant[]) {
  const nameToVariants = countOptionNames(variants);
  const allNames = [...nameToVariants.keys()].sort();
  return { variants, nameToVariants, allNames, registry: VARIANTS };
}

export async function load() {
  return build(loadVariants());
}
