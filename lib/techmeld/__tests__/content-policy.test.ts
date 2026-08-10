import { describe, expect, it } from "vitest";
import { getEventRegistrationBadge } from "../format";

const now = new Date("2026-08-09T19:00:00.000Z");

describe("event action labels", () => {
  it("prioritizes a future registration opening", () => {
    expect(getEventRegistrationBadge({
      registration_open_at: "2026-08-14T16:00:00.000Z",
      registration_close_at: "2026-08-20T16:00:00.000Z",
      registration_status: "unknown",
      start_at: "2026-09-02T16:00:00.000Z",
    }, now)).toBe("Opens Aug 14");
  });

  it("shows the closest open-registration deadline", () => {
    expect(getEventRegistrationBadge({
      registration_open_at: "2026-08-01T16:00:00.000Z",
      registration_close_at: "2026-08-12T19:00:00.000Z",
      registration_status: "open",
      start_at: "2026-09-02T16:00:00.000Z",
    }, now)).toBe("Closes in 3 days");
  });

  it("falls back to the event start without inventing a deadline", () => {
    expect(getEventRegistrationBadge({
      registration_open_at: null,
      registration_close_at: null,
      registration_status: "unknown",
      start_at: "2026-09-02T16:00:00.000Z",
    }, now)).toBe("Event starts Sep 2");
  });
});
