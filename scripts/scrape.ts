import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseEnvVars } from "../src/lib/parse";
import { fetchReadme } from "../src/lib/readme";
import { fetchVariantRelease } from "../src/lib/releases";
import type { Variant } from "../src/lib/types";
import { VARIANTS } from "../src/lib/variants";

const DATA_DIR = "src/data";
const DATA_FILE = `${DATA_DIR}/proton.json`;

function loadPrevious(): Variant[] {
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8")) as Variant[];
  } catch {
    return [];
  }
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });
  const previous = await loadPrevious();
  const prevById = new Map(previous.map((v) => [v.id, v]));
  const now = new Date().toISOString();
  const results: Variant[] = [];
  let dataChanged = false;

  for (const ref of VARIANTS) {
    const cached = prevById.get(ref.id);

    const { markdown, etag, lastModified, changed } = await fetchReadme(ref.readmeUrl, cached);

    const options = !changed && cached ? cached.options : parseEnvVars(markdown, ref.id);
    const release = await fetchVariantRelease(ref);
    const releaseChanged =
      release !== undefined &&
      (release.tag !== cached?.release ||
        (release.publishedAt !== undefined && release.publishedAt !== cached?.releaseDate));
    // A 200 only means the host served the body; when the host ignores
    // conditional requests, confirm the parsed data actually differs.
    const optionsChanged = changed && JSON.stringify(options) !== JSON.stringify(cached?.options);
    const variantChanged = optionsChanged || releaseChanged;

    const variant: Variant = {
      id: ref.id,
      displayName: ref.displayName,
      repoUrl: ref.repoUrl,
      readmeUrl: ref.readmeUrl,
      options,
      // Only advance the timestamp when the variant's data actually changes, so
      // it reflects when the data last changed, not when CI last ran.
      scrapedAt: variantChanged ? now : (cached?.scrapedAt ?? now),
      ...(release
        ? { release: release.tag, releaseDate: release.publishedAt }
        : cached?.release
          ? { release: cached.release, releaseDate: cached.releaseDate }
          : {}),
      ...(etag ? { etag } : {}),
      ...(lastModified ? { lastModified } : {}),
    };
    results.push(variant);
    if (variantChanged) dataChanged = true;
    console.log(
      `[${variantChanged ? "ok" : "skip"}] ${ref.id}: ${options.length} env vars${release ? ` (${release.tag})` : ""}`,
    );
  }

  writeFileSync(DATA_FILE, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`Wrote ${DATA_FILE}`);

  if (dataChanged) {
    console.log("Data changed; commit via CI.");
  } else {
    console.log("No upstream changes; data unchanged.");
  }
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
