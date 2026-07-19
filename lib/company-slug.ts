export function slugifyCompanyName(value?: string | null) {
  return (value || "company")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
