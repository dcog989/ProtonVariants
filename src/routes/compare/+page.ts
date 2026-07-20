import { loadVariants } from "$lib/data";
import { countOptionNames } from "$lib/unique";
import { VARIANTS } from "$lib/variants";

export const prerender = true;

function build(ids?: string[]) {
  const all = loadVariants();
  const variants = ids && ids.length ? all.filter((v) => ids.includes(v.id)) : all;
  const nameToVariants = countOptionNames(variants);
  const allNames = [...nameToVariants.keys()].sort();
  return { variants, nameToVariants, allNames, registry: VARIANTS };
}

export async function load({ url }: { url: URL }) {
  const idsParam = url.searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;
  return build(ids);
}
