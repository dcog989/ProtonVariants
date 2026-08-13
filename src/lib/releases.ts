const FETCH_TIMEOUT_MS = 15_000;
const USER_AGENT = "ProtonVariants/0.1 (+https://github.com/dcog989/ProtonVariants)";
const PRERELEASE_PATTERN = /(bleeding-edge|experimental|-beta|-alpha|-rc\d)/i;

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
