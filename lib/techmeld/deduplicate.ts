/** Strips tracking params, fragments, and trailing slashes so the same article isn't stored twice under differently-decorated URLs. */
export function normalizeCanonicalUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.hash = "";

    const keysToRemove = [...url.searchParams.keys()].filter(
      (key) => /^utm_/i.test(key) || key === "ref" || key === "source"
    );
    keysToRemove.forEach((key) => url.searchParams.delete(key));

    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    return url.toString();
  } catch {
    return rawUrl.trim();
  }
}

/** Fallback fingerprint for items that share a source/date/title but arrive under different URLs. Not currently used for DB lookups (canonical URL + external ID cover that) but kept as a pure, testable building block for future near-duplicate detection. */
export function computeContentFingerprint(
  title: string,
  sourceName: string,
  publishedAtIso: string
): string {
  const normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, " ");
  const datePart = publishedAtIso.slice(0, 10);
  return `${sourceName.trim().toLowerCase()}::${datePart}::${normalizedTitle}`;
}
