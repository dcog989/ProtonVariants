import { loadVariants } from "$lib/data";
import { countOptionNames } from "$lib/unique";
import { VARIANTS } from "$lib/variants";

export const prerender = true;

function build() {
  const variants = loadVariants();
  const nameToVariants = countOptionNames(variants);
  const allNames = [...nameToVariants.keys()].sort();
  return { variants, nameToVariants, allNames, registry: VARIANTS };
}

export async function load() {
  return build();
}
