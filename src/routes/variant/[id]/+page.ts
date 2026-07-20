import { error } from "@sveltejs/kit";
import { loadVariants } from "$lib/data";
import { getVariant } from "$lib/variants";
import type { OptionType } from "$lib/types";

export const prerender = true;

export async function load({ params }: { params: { id: string } }) {
  const ref = getVariant(params.id);
  if (!ref) throw error(404, "Unknown variant");
  const variant = loadVariants().find((v) => v.id === params.id);
  return { ref, variant, options: variant?.options ?? [] };
}
