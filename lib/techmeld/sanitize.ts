const HTML_TAG_PATTERN = /<[^>]*>/g;

const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

/** Strips all HTML tags/entities. Safe by construction: output is always plain text, never rendered as HTML. */
export function stripHtml(input: string): string {
  const withoutTags = input.replace(HTML_TAG_PATTERN, " ");
  const withoutEntities = withoutTags.replace(
    /&[a-zA-Z#0-9]+;/g,
    (match) => ENTITY_MAP[match] ?? " "
  );
  return withoutEntities.replace(/\s+/g, " ").trim();
}

export function clampText(input: string, maxLength: number): string {
  const trimmed = input.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const truncated = trimmed.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const safe = lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated;
  return `${safe.trim()}…`;
}

/** Removes characters that have special meaning in PostgREST filter syntax before interpolating user input into an .or()/.ilike() query string. */
export function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,()%_]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}
