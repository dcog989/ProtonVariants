import { loadVariants } from "$lib/data";
import { VARIANTS } from "$lib/variants";

export const prerender = true;

function build() {
  const variants = loadVariants();
  const nameToVariants = new Map<string, string[]>();
  for (const v of variants) {
    for (const o of v.options) {
      const list = nameToVariants.get(o.name) ?? [];
      list.push(v.id);
      nameToVariants.set(o.name, list);
    }
  }
  const allNames = [...nameToVariants.keys()].sort();
  return { variants, nameToVariants, allNames, registry: VARIANTS };
}

export async function load() {
  return build();
}
