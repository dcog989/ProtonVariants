import { error } from "@sveltejs/kit";
import { loadVariants } from "$lib/data";
import { uniqueNames } from "$lib/unique";
import { getVariant } from "$lib/variants";

export const prerender = true;

export async function load({ params }: { params: { id: string } }) {
  const ref = getVariant(params.id);
  if (!ref) throw error(404, "Unknown variant");
  const all = loadVariants();
  const variant = all.find((v) => v.id === params.id);
  const uniques = uniqueNames(all);
  return {
    ref,
    variant,
    options: (variant?.options ?? []).map((o) => ({ ...o, unique: uniques.has(o.name) })),
    uniqueCount: variant?.options.filter((o) => uniques.has(o.name)).length ?? 0,
  };
}
