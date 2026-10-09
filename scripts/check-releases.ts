import { readFileSync } from "node:fs";
import { parseEnvVars } from "../src/lib/parse";
import { fetchReadme } from "../src/lib/readme";
import { fetchVariantRelease } from "../src/lib/releases";
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

// Some README hosts ignore conditional requests, so a 200 does not prove the
// content changed. Re-parse and compare against what the site would render.
function optionsChanged(markdown: string, id: string, stored?: Variant): boolean {
  if (!stored) return true;
  return JSON.stringify(parseEnvVars(markdown, id)) !== JSON.stringify(stored.options);
}

async function main() {
  const previous = loadPrevious();
  const prevById = new Map(previous.map((v) => [v.id, v]));
  const updated: string[] = [];

  for (const ref of VARIANTS) {
    const stored = prevById.get(ref.id);
    // A README edit without a release still changes the scraped data, so check
    // both the release tag and the README's conditional-fetch validators.
    const [release, readme] = await Promise.all([fetchVariantRelease(ref), fetchReadme(ref.readmeUrl, stored)]);

    const releaseChanged = release !== undefined && release.tag !== stored?.release;
    const readmeChanged = readme.changed && optionsChanged(readme.markdown, ref.id, stored);

    if (releaseChanged) {
      updated.push(ref.id);
      console.log(`[new] ${ref.id}: ${stored?.release ?? "(none)"} -> ${release.tag}`);
    } else if (readmeChanged) {
      updated.push(ref.id);
      console.log(`[readme] ${ref.id}: README content changed`);
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
