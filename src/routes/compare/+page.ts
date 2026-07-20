import { loadVariants } from "$lib/data";
import type { Variant } from "$lib/types";
import { uniqueNames } from "$lib/unique";
import { VARIANTS } from "$lib/variants";

export const prerender = true;

function build(variants: Variant[]) {
  const allNames = [...new Set(variants.flatMap((v) => v.options.map((o) => o.name)))].sort();
  const descriptions: Record<string, string> = {};
  for (const v of variants) {
    for (const o of v.options) {
      if (!(o.name in descriptions)) descriptions[o.name] = o.description;
    }
  }
  return { variants, allNames, uniqueNames: [...uniqueNames(variants)], descriptions, registry: VARIANTS };
}

export async function load() {
  return build(loadVariants());
}
