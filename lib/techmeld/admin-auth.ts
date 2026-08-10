/** Constant-time string comparison so secret checks don't leak timing information. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Checks a request's `Authorization: Bearer <secret>` header against the
 * given env var. Used by the ingest route (TECHMELD_INGEST_SECRET) and every
 * admin route (TECHMELD_ADMIN_SECRET). Returns false (never throws) when the
 * env var isn't set, so a misconfigured deployment fails closed.
 */
export function isAuthorizedBearerRequest(
  authorizationHeader: string | null,
  expectedSecret: string | undefined
): boolean {
  if (!expectedSecret) return false;
  if (!authorizationHeader?.startsWith("Bearer ")) return false;

  const provided = authorizationHeader.slice("Bearer ".length).trim();
  if (!provided) return false;

  return timingSafeEqual(provided, expectedSecret);
}
