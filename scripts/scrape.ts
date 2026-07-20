import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseEnvVars } from "../src/lib/parse";
import type { Variant } from "../src/lib/types";
import { VARIANTS } from "../src/lib/variants";

const DATA_DIR = "src/data";
const DATA_FILE = `${DATA_DIR}/proton.json`;
const FETCH_TIMEOUT_MS = 30_000;
const USER_AGENT = "ProtonVariants/0.1 (+https://github.com/dcog989/proton-variants)";

interface CacheEntry {
  etag?: string;
  lastModified?: string;
  scrapedAt: string;
}

async function fetchReadme(
  url: string,
  cached?: CacheEntry,
): Promise<{ markdown: string; etag?: string; lastModified?: string; changed: boolean }> {
  const headers: Record<string, string> = { "User-Agent": USER_AGENT };
  if (cached?.etag) headers["If-None-Match"] = cached.etag;
  if (cached?.lastModified) headers["If-Modified-Since"] = cached.lastModified;

  const res = await fetch(url, { headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

  if (res.status === 304) {
    return { markdown: "", etag: cached?.etag, lastModified: cached?.lastModified, changed: false };
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const markdown = await res.text();
  return {
    markdown,
    etag: res.headers.get("etag") ?? undefined,
    lastModified: res.headers.get("last-modified") ?? undefined,
    changed: true,
  };
}

function loadPrevious(): Variant[] {
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8")) as Variant[];
  } catch {
    return [];
  }
}

async function fetchRelease(releaseUrl: string): Promise<string | undefined> {
  try {
    const res = await fetch(releaseUrl, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return undefined;
    const body = await res.text();
    if (releaseUrl.includes("api.github.com")) {
      return (JSON.parse(body) as { tag_name?: string }).tag_name;
    }
    const match = body.match(/(?:version|release|v)\s*[:=]?\s*([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i);
    return match?.[1];
  } catch {
    return undefined;
  }
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });
  const previous = await loadPrevious();
  const prevById = new Map(previous.map((v) => [v.id, v]));
  const now = new Date().toISOString();
  const results: Variant[] = [];
  let changedAny = false;

  for (const ref of VARIANTS) {
    const cached = prevById.get(ref.id);
    const cacheEntry: CacheEntry | undefined = cached
      ? { etag: cached.etag, lastModified: cached.lastModified, scrapedAt: cached.scrapedAt }
      : undefined;

    const { markdown, etag, lastModified, changed } = await fetchReadme(ref.readmeUrl, cacheEntry);

    const options = !changed && cached ? cached.options : parseEnvVars(markdown, ref.id);
    const release = ref.releaseUrl ? await fetchRelease(ref.releaseUrl) : undefined;

    const variant: Variant = {
      id: ref.id,
      displayName: ref.displayName,
      repoUrl: ref.repoUrl,
      readmeUrl: ref.readmeUrl,
      options,
      scrapedAt: now,
      ...(etag ? { etag } : {}),
      ...(lastModified ? { lastModified } : {}),
      ...(release ? { release } : {}),
    };
    results.push(variant);
    if (changed) changedAny = true;
    console.log(`[${changed ? "ok" : "skip"}] ${ref.id}: ${options.length} env vars${release ? ` (${release})` : ""}`);
  }

  writeFileSync(DATA_FILE, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`Wrote ${DATA_FILE}`);

  if (changedAny) {
    console.log("Data changed; commit via CI.");
  } else {
    console.log("No upstream changes; data unchanged.");
  }
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
