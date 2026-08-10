const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function buildArticleSlug(title: string, publishedAtIso: string): string {
  const base = slugify(title) || "update";
  const datePart = publishedAtIso.slice(0, 10);
  return `${base}-${datePart}`;
}

export function buildEventSlug(name: string, startAtIso: string): string {
  const base = slugify(name) || "event";
  const datePart = startAtIso.slice(0, 10);
  return `${base}-${datePart}`;
}
