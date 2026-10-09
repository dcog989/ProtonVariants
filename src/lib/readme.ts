const FETCH_TIMEOUT_MS = 30_000;
const USER_AGENT = "ProtonVariants/0.1 (+https://github.com/dcog989/ProtonVariants)";

export interface ReadmeCache {
  etag?: string;
  lastModified?: string;
}

export interface ReadmeFetch {
  markdown: string;
  etag?: string;
  lastModified?: string;
  changed: boolean;
}

export async function fetchReadme(url: string, cached?: ReadmeCache): Promise<ReadmeFetch> {
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
