import { describe, expect, it } from "vitest";
import { normalizeEvent, type NormalizedEventInput } from "../normalize-event";

function makeInput(overrides: Partial<NormalizedEventInput> = {}): NormalizedEventInput {
  return {
    name: "AWS AI and Data Workshop",
    organizer: "AWS",
    sourceUrl: "https://aws.amazon.com/events/workshop",
    registrationUrl: "https://aws.amazon.com/events/workshop/register",
    category: "AI",
    description: "A hands-on workshop covering AI services and data platforms.",
    startAt: "2026-09-01T17:00:00.000Z",
    endAt: "2026-09-01T20:00:00.000Z",
    format: "virtual",
    costType: "free",
    tags: ["AWS", "AI"],
    ...overrides,
  };
}

describe("normalizeEvent", () => {
  it("normalizes a valid event", () => {
    const result = normalizeEvent(makeInput());

    expect(result).not.toBeNull();
    expect(result?.status).toBe("pending");
    expect(result?.slug).toContain("aws-ai-and-data-workshop");
    expect(result?.slug).toContain("2026-09-01");
  });

  it("rejects events missing a name or organizer", () => {
    expect(normalizeEvent(makeInput({ name: "" }))).toBeNull();
    expect(normalizeEvent(makeInput({ organizer: "" }))).toBeNull();
  });

  it("rejects events with an invalid source URL", () => {
    expect(normalizeEvent(makeInput({ sourceUrl: "not-a-url" }))).toBeNull();
  });

  it("rejects events with an unparseable start date", () => {
    expect(normalizeEvent(makeInput({ startAt: "not-a-date" }))).toBeNull();
  });

  it("rejects events where the end date is before the start date", () => {
    expect(
      normalizeEvent(
        makeInput({ startAt: "2026-09-01T17:00:00.000Z", endAt: "2026-09-01T10:00:00.000Z" })
      )
    ).toBeNull();
  });

  it("drops an invalid registration URL instead of failing the whole event", () => {
    const result = normalizeEvent(makeInput({ registrationUrl: "not-a-url" }));
    expect(result).not.toBeNull();
    expect(result?.registration_url).toBeNull();
  });
});
