import { describe, expect, it } from "vitest";
import { validateSubscribeInput } from "../subscribe";

describe("validateSubscribeInput", () => {
  it("accepts a valid email and normalizes case/whitespace", () => {
    const result = validateSubscribeInput({ email: "  Person@Example.COM  " });
    expect(result).toMatchObject({ email: "person@example.com" });
  });

  it("rejects an invalid email", () => {
    const result = validateSubscribeInput({ email: "not-an-email" });
    expect(result).toHaveProperty("error");
  });

  it("rejects a missing email", () => {
    const result = validateSubscribeInput({ email: "" });
    expect(result).toHaveProperty("error");
  });

  it("silently rejects when the honeypot field is filled in", () => {
    const result = validateSubscribeInput({ email: "person@example.com", honeypot: "I am a bot" });
    expect(result).toHaveProperty("error");
  });

  it("dedupes and caps interests", () => {
    const result = validateSubscribeInput({
      email: "person@example.com",
      interests: ["AI", "AI", "Cloud", " Cloud ", ""],
    });
    if ("error" in result) throw new Error("expected a valid result");
    expect(result.interests).toEqual(["AI", "Cloud"]);
  });
});
