import { error } from "@sveltejs/kit";
import { loadVariants } from "$lib/data";
import { getVariant } from "$lib/variants";

export const prerender = true;

export async function load({ params }: { params: { id: string } }) {
  const ref = getVariant(params.id);
  if (!ref) throw error(404, "Unknown variant");
  const all = loadVariants();
  const variant = all.find((v) => v.id === params.id);
  const nameCounts = new Map<string, number>();
  for (const v of all) {
    for (const o of v.options) {
      nameCounts.set(o.name, (nameCounts.get(o.name) ?? 0) + 1);
    }
  }
  const uniqueNames = new Set([...nameCounts.entries()].filter(([, count]) => count === 1).map(([name]) => name));
  return {
    ref,
    variant,
    options: (variant?.options ?? []).map((o) => ({ ...o, unique: uniqueNames.has(o.name) })),
    uniqueCount: variant?.options.filter((o) => uniqueNames.has(o.name)).length ?? 0,
  };
}
