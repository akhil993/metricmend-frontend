import { describe, expect, it } from "vitest";
import { isValidExternalUrl } from "../validate-url";

describe("isValidExternalUrl", () => {
  it("accepts http and https URLs", () => {
    expect(isValidExternalUrl("https://example.com/post")).toBe(true);
    expect(isValidExternalUrl("http://example.com/post")).toBe(true);
  });

  it("rejects unsafe protocols", () => {
    expect(isValidExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isValidExternalUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isValidExternalUrl("ftp://example.com/file")).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(isValidExternalUrl("not a url")).toBe(false);
    expect(isValidExternalUrl("")).toBe(false);
    expect(isValidExternalUrl(null)).toBe(false);
    expect(isValidExternalUrl(undefined)).toBe(false);
  });
});
