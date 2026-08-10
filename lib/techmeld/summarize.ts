import { clampText } from "./sanitize";

const MAX_SUMMARY_LENGTH = 720;

/** Builds original context from non-body metadata only. It intentionally does
 * not ingest, paraphrase, or persist the publisher's RSS description. This is
 * a conservative fallback until a licensed, server-side AI summarizer exists.
 */
export function buildArticleSummary(input: {
  title: string;
  publisher: string;
  category: string;
  tags: string[];
}): string {
  const topic = input.tags.slice(0, 3).join(", ") || input.category;
  return clampText(
    `${input.publisher} reports “${input.title}.” This development relates to ${topic}. ` +
      `TechMeld has indexed the announcement to help readers track relevant technology activity; ` +
      `consult the publisher’s original article for its reporting, evidence, details, and complete context.`,
    MAX_SUMMARY_LENGTH
  );
}

export function buildWhyItMatters(category: string, tags: string[]): string {
  const topics = tags.slice(0, 3).join(", ") || "technology teams";
  if (category === "releases") {
    return `Teams working with ${topics} may need to evaluate compatibility, cost, security, and adoption timing before changing production systems.`;
  }
  return `This may affect technical roadmaps, vendor choices, and operating practices for teams working with ${topics}. The original reporting remains the authoritative source.`;
}
