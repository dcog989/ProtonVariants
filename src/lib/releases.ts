import type { VariantRef } from "./types";

const FETCH_TIMEOUT_MS = 15_000;
const USER_AGENT = "ProtonVariants/0.1 (+https://github.com/dcog989/ProtonVariants)";
const PRERELEASE_PATTERN = /(bleeding-edge|experimental|-beta|-alpha|-rc\d)/i;
const VERSION_TAG_PATTERN = /^proton-(\d+)\.(\d+)-(\d+)([a-z]?)$/;

export interface ReleaseInfo {
  tag: string;
  publishedAt?: string;
}

function isPrereleaseTag(tag: string): boolean {
  return PRERELEASE_PATTERN.test(tag);
}

export async function fetchLatestRelease(feedUrl: string): Promise<ReleaseInfo | undefined> {
  const res = await fetch(feedUrl, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/atom+xml" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${feedUrl}: ${res.status} ${res.statusText}`);
  }
  const body = await res.text();
  const entries = body.split("<entry>").slice(1);
  for (const entry of entries) {
    const tag = entry
      .match(/href="([^"]*\/tag\/[^"]+)"/)?.[1]
      .split("/tag/")
      .pop();
    if (!tag || isPrereleaseTag(tag)) continue;
    const publishedAt = entry.match(/<updated>([^<]+)<\/updated>/)?.[1];
    return { tag, publishedAt };
  }
  return undefined;
}

// Valve publishes numbered Proton releases as git tags, not GitHub releases, so
// its feed only carries SDK and experimental builds. GitHub does not order the
// tags endpoint by date, so pick the highest version instead of the first entry.
export async function fetchLatestTagVersion(tagsUrl: string): Promise<ReleaseInfo | undefined> {
  const res = await fetch(tagsUrl, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${tagsUrl}: ${res.status} ${res.statusText}`);
  }
  const tags = (await res.json()) as Array<{ name: string }>;
  let newest: { version: number[]; tag: string } | undefined;
  for (const { name } of tags) {
    const match = name.match(VERSION_TAG_PATTERN);
    if (!match) continue;
    const version = [Number(match[1]), Number(match[2]), Number(match[3]), match[4] ? match[4].charCodeAt(0) : 0];
    if (!newest || compareVersions(version, newest.version) > 0) newest = { version, tag: name };
  }
  return newest ? { tag: newest.tag } : undefined;
}

export function fetchVariantRelease(ref: VariantRef): Promise<ReleaseInfo | undefined> {
  return ref.tagsUrl ? fetchLatestTagVersion(ref.tagsUrl) : fetchLatestRelease(ref.feedUrl);
}

function compareVersions(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
