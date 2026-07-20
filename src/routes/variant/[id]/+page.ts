import { error } from "@sveltejs/kit";
import { loadVariants } from "$lib/data";
import type { RuntimeOptionView } from "$lib/types";
import { uniqueNames } from "$lib/unique";
import { getVariant } from "$lib/variants";

export const prerender = true;

export async function load({ params }: { params: { id: string } }) {
  const ref = getVariant(params.id);
  if (!ref) throw error(404, "Unknown variant");
  const all = loadVariants();
  const variant = all.find((v) => v.id === params.id);
  const uniques = uniqueNames(all);
  const options: RuntimeOptionView[] = (variant?.options ?? []).map((o) => ({
    ...o,
    unique: uniques.has(o.name),
  }));
  return {
    ref,
    variant,
    options,
    uniqueCount: options.filter((o) => o.unique).length,
  };
}
