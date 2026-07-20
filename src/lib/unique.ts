import type { Variant } from "./types";

export function countOptionNames(variants: Variant[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const v of variants) {
    for (const o of v.options) {
      counts.set(o.name, (counts.get(o.name) ?? 0) + 1);
    }
  }
  return counts;
}

export function uniqueNames(variants: Variant[]): Set<string> {
  return new Set([...countOptionNames(variants).entries()].filter(([, count]) => count === 1).map(([name]) => name));
}
