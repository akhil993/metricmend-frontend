import type { TechMeldSourceRow } from "@/types/techmeld";
import { normalizeCanonicalUrl } from "./deduplicate";
import type { ParsedFeedItem } from "./parse-rss";
import { clampText } from "./sanitize";
import { buildArticleSlug } from "./slug";
import { getDefaultTagsForFeedUrl } from "./sources";
import { buildArticleSummary, buildWhyItMatters } from "./summarize";
import { inferTopicTags } from "./tag-rules";
import { isValidExternalUrl } from "./validate-url";

const MAX_TITLE_LENGTH = 300;
const MAX_TAGS = 8;

export interface NormalizedArticle {
  source_id: string;
  external_id: string | null;
  title: string;
  slug: string;
  source_name: string;
  source_url: string;
  canonical_url: string;
  category: string;
  summary: string;
  why_it_matters: string;
  publisher: string;
  article_language: string;
  summary_method: "metadata_template";
  image_rights_status: "not_cleared";
  published_at: string;
  image_url: string | null;
  author: string | null;
  tags: string[];
  status: "pending" | "approved";
}

/**
 * Normalizes one parsed feed item into an insertable article row, or returns
 * null if a required field is missing/invalid. The summary is the feed's own
 * publicly-syndicated excerpt (contentSnippet), trimmed — never the full
 * article body. Trusted official sources are auto-approved; everything else
 * lands as pending for editorial review.
 */
export function normalizeArticle(
  item: ParsedFeedItem,
  source: TechMeldSourceRow
): NormalizedArticle | null {
  const title = item.title?.trim();
  const link = item.link?.trim();

  if (!title || !link || !isValidExternalUrl(link)) {
    return null;
  }

  const publishedAtRaw = item.isoDate ?? item.pubDate;
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;
  if (!publishedAt || Number.isNaN(publishedAt.getTime())) {
    return null;
  }

  const publishedIso = publishedAt.toISOString();
  const tags = Array.from(
    new Set([
      ...getDefaultTagsForFeedUrl(source.feed_url),
      ...inferTopicTags(`${title} ${source.category}`),
      ...item.categories.map((tag) => tag.trim()).filter(Boolean),
    ])
  ).slice(0, MAX_TAGS);

  const summary = buildArticleSummary({ title, publisher: source.name, category: source.category, tags });

  return {
    source_id: source.id,
    external_id: item.guid ?? link,
    title: clampText(title, MAX_TITLE_LENGTH),
    slug: buildArticleSlug(title, publishedIso),
    source_name: source.name,
    source_url: source.base_url,
    canonical_url: normalizeCanonicalUrl(link),
    category: source.category,
    summary,
    why_it_matters: buildWhyItMatters(source.category, tags),
    publisher: source.name,
    article_language: "en",
    summary_method: "metadata_template",
    published_at: publishedIso,
    // Publisher images are not displayed unless rights are affirmatively cleared.
    image_url: null,
    image_rights_status: "not_cleared",
    author: item.creator?.trim() || null,
    tags,
    status:
      source.official_source &&
      source.trust_level === "official" &&
      source.rights_review_status === "approved"
        ? "approved"
        : "pending",
  };
}
