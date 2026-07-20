import data from "$lib/../data/proton.json";
import type { Variant } from "./types";

export function loadVariants(): Variant[] {
  return data as Variant[];
}
