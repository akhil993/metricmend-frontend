import { describe, expect, it } from "vitest";
import { validateSubmissionInput } from "../submissions";

function makeInput(overrides: Partial<Parameters<typeof validateSubmissionInput>[0]> = {}) {
  return {
    submissionType: "event",
    title: "A great local meetup",
    sourceUrl: "https://example.com/event",
    ...overrides,
  };
}

describe("validateSubmissionInput", () => {
  it("accepts a valid submission", () => {
    const result = validateSubmissionInput(makeInput());
    expect(result).not.toHaveProperty("error");
  });

  it("rejects an invalid submission type", () => {
    const result = validateSubmissionInput(makeInput({ submissionType: "not-a-type" }));
    expect(result).toHaveProperty("error");
  });

  it("rejects a missing title", () => {
    const result = validateSubmissionInput(makeInput({ title: "" }));
    expect(result).toHaveProperty("error");
  });

  it("rejects an invalid source URL", () => {
    const result = validateSubmissionInput(makeInput({ sourceUrl: "not-a-url" }));
    expect(result).toHaveProperty("error");
  });

  it("rejects an invalid submitter email but allows a blank one", () => {
    expect(
      validateSubmissionInput(makeInput({ submittedByEmail: "not-an-email" }))
    ).toHaveProperty("error");
    expect(validateSubmissionInput(makeInput({ submittedByEmail: "" }))).not.toHaveProperty(
      "error"
    );
  });

  it("silently rejects when the honeypot field is filled in", () => {
    const result = validateSubmissionInput(makeInput({ honeypot: "I am a bot" }));
    expect(result).toHaveProperty("error");
  });
});
