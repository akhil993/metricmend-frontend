import { describe, expect, it } from "vitest";
import { isEventExpired } from "../format";

describe("isEventExpired", () => {
  it("is not expired for a future approved event", () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired({ start_at: future, end_at: null, status: "approved" })).toBe(false);
  });

  it("is expired for a past approved event with no end date", () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired({ start_at: past, end_at: null, status: "approved" })).toBe(true);
  });

  it("uses the end date when present, not the start date", () => {
    const start = new Date(Date.now() - 1000).toISOString();
    const futureEnd = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired({ start_at: start, end_at: futureEnd, status: "approved" })).toBe(false);
  });

  it("treats cancelled events as expired regardless of date", () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired({ start_at: future, end_at: null, status: "cancelled" })).toBe(true);
  });

  it("treats completed events as expired regardless of date", () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(isEventExpired({ start_at: future, end_at: null, status: "completed" })).toBe(true);
  });
});
