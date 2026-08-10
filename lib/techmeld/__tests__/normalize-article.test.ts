import { describe, expect, it } from "vitest";
import type { TechMeldSourceRow } from "@/types/techmeld";
import { normalizeArticle } from "../normalize-article";
import type { ParsedFeedItem } from "../parse-rss";

function makeSource(overrides: Partial<TechMeldSourceRow> = {}): TechMeldSourceRow {
  return {
    id: "source-1",
    name: "AWS News Blog",
    source_type: "rss",
    base_url: "https://aws.amazon.com/blogs/aws/",
    feed_url: "https://aws.amazon.com/blogs/aws/feed/",
    api_url: null,
    official_source: true,
    enabled: true,
    trust_level: "official",
    rights_review_status: "approved",
    terms_url: null,
    robots_url: null,
    terms_reviewed_at: "2026-01-01T00:00:00.000Z",
    attribution_requirements: null,
    permitted_use: "Metadata aggregation and linking",
    category: "ai-news",
    last_checked_at: null,
    last_success_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeItem(overrides: Partial<ParsedFeedItem> = {}): ParsedFeedItem {
  return {
    title: "AWS launches a new Bedrock feature",
    link: "https://aws.amazon.com/blogs/aws/new-bedrock-feature/?utm_source=twitter",
    guid: "guid-123",
    isoDate: "2026-07-01T12:00:00.000Z",
    pubDate: null,
    contentSnippet: "AWS today announced a new capability for Bedrock that helps teams build AI agents faster.",
    content: null,
    categories: ["Artificial Intelligence"],
    creator: "AWS Team",
    imageUrl: null,
    ...overrides,
  };
}

describe("normalizeArticle", () => {
  it("normalizes a valid item into an insertable article", () => {
    const result = normalizeArticle(makeItem(), makeSource());

    expect(result).not.toBeNull();
    expect(result?.title).toBe("AWS launches a new Bedrock feature");
    expect(result?.canonical_url).not.toContain("utm_source");
    expect(result?.summary.length).toBeGreaterThan(0);
    expect(result?.summary).not.toContain("helps teams build AI agents faster");
    expect(result?.why_it_matters.length).toBeGreaterThan(0);
    expect(result?.image_url).toBeNull();
    expect(result?.tags).toContain("AI");
    expect(result?.tags).toContain("Cloud");
    expect(result?.status).toBe("approved");
  });

  it("lands as pending when the source is not official/trusted", () => {
    const result = normalizeArticle(
      makeItem(),
      makeSource({ official_source: false, trust_level: "community" })
    );

    expect(result?.status).toBe("pending");
  });

  it("rejects items missing a title", () => {
    expect(normalizeArticle(makeItem({ title: null }), makeSource())).toBeNull();
  });

  it("rejects items with an invalid link", () => {
    expect(normalizeArticle(makeItem({ link: "not-a-url" }), makeSource())).toBeNull();
  });

  it("rejects items with an unparseable published date", () => {
    expect(
      normalizeArticle(makeItem({ isoDate: null, pubDate: "not-a-date" }), makeSource())
    ).toBeNull();
  });

  it("does not need or store a publisher excerpt", () => {
    const result = normalizeArticle(makeItem({ contentSnippet: null, content: null }), makeSource());
    expect(result).not.toBeNull();
    expect(result?.summary_method).toBe("metadata_template");
  });
});
