import { readFileSync } from "node:fs";
import { fetchLatestRelease } from "../src/lib/releases";
import type { Variant } from "../src/lib/types";
import { VARIANTS } from "../src/lib/variants";

const DATA_FILE = "src/data/proton.json";

function loadPrevious(): Variant[] {
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8")) as Variant[];
  } catch {
    return [];
  }
}

async function main() {
  const previous = loadPrevious();
  const prevById = new Map(previous.map((v) => [v.id, v]));
  const updated: string[] = [];

  for (const ref of VARIANTS) {
    const release = await fetchLatestRelease(ref.feedUrl);
    const stored = prevById.get(ref.id)?.release;
    if (release && release.tag !== stored) {
      updated.push(ref.id);
      console.log(`[new] ${ref.id}: ${stored ?? "(none)"} -> ${release.tag}`);
    } else {
      console.log(`[ok] ${ref.id}: ${release?.tag ?? "none"}`);
    }
  }

  if (updated.length > 0) {
    console.log(`UPDATE ${updated.join(",")}`);
  } else {
    console.log("NO_CHANGE");
  }
}

main().catch((err) => {
  console.error("Release check failed:", err);
  process.exit(1);
});
