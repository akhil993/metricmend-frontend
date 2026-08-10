const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function isValidExternalUrl(rawUrl: string | null | undefined): rawUrl is string {
  if (!rawUrl) return false;
  try {
    const url = new URL(rawUrl);
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}
