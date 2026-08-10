import { describe, expect, it } from "vitest";
import { computeContentFingerprint, normalizeCanonicalUrl } from "../deduplicate";

describe("normalizeCanonicalUrl", () => {
  it("strips utm tracking params", () => {
    const result = normalizeCanonicalUrl(
      "https://aws.amazon.com/blogs/aws/post/?utm_source=twitter&utm_medium=social"
    );
    expect(result).not.toContain("utm_source");
    expect(result).not.toContain("utm_medium");
  });

  it("strips ref and source params but keeps meaningful ones", () => {
    const result = normalizeCanonicalUrl("https://example.com/post?ref=hn&id=42");
    expect(result).not.toContain("ref=hn");
    expect(result).toContain("id=42");
  });

  it("removes the fragment", () => {
    const result = normalizeCanonicalUrl("https://example.com/post#comments");
    expect(result).not.toContain("#comments");
  });

  it("removes a trailing slash", () => {
    const result = normalizeCanonicalUrl("https://example.com/post/");
    expect(result).toBe("https://example.com/post");
  });

  it("makes two differently-decorated URLs to the same article equal", () => {
    const a = normalizeCanonicalUrl("https://example.com/post/?utm_source=twitter");
    const b = normalizeCanonicalUrl("https://example.com/post");
    expect(a).toBe(b);
  });

  it("falls back to the trimmed input for an unparseable URL", () => {
    expect(normalizeCanonicalUrl("  not a url  ")).toBe("not a url");
  });
});

describe("computeContentFingerprint", () => {
  it("is stable across whitespace and case differences", () => {
    const a = computeContentFingerprint("  Hello   World  ", "AWS", "2026-07-01T12:00:00.000Z");
    const b = computeContentFingerprint("hello world", "aws", "2026-07-01T09:00:00.000Z");
    expect(a).toBe(b);
  });

  it("differs when the title differs", () => {
    const a = computeContentFingerprint("Hello World", "AWS", "2026-07-01T12:00:00.000Z");
    const b = computeContentFingerprint("Goodbye World", "AWS", "2026-07-01T12:00:00.000Z");
    expect(a).not.toBe(b);
  });
});
