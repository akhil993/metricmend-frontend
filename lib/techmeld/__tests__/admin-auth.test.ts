import { describe, expect, it } from "vitest";
import { isAuthorizedBearerRequest } from "../admin-auth";

describe("isAuthorizedBearerRequest", () => {
  it("authorizes a request with the correct bearer secret", () => {
    expect(isAuthorizedBearerRequest("Bearer super-secret", "super-secret")).toBe(true);
  });

  it("rejects a request with no Authorization header", () => {
    expect(isAuthorizedBearerRequest(null, "super-secret")).toBe(false);
  });

  it("rejects a request with the wrong secret", () => {
    expect(isAuthorizedBearerRequest("Bearer wrong-secret", "super-secret")).toBe(false);
  });

  it("rejects a request missing the Bearer prefix", () => {
    expect(isAuthorizedBearerRequest("super-secret", "super-secret")).toBe(false);
  });

  it("fails closed when the expected secret env var is not configured", () => {
    expect(isAuthorizedBearerRequest("Bearer anything", undefined)).toBe(false);
  });

  it("rejects an empty bearer token even if the expected secret is empty", () => {
    expect(isAuthorizedBearerRequest("Bearer ", "")).toBe(false);
  });
});
