import { getCurrentUserId } from "@/lib/auth/session";

export function getApiBaseUrl() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured"
    );
  }

  return apiBaseUrl;
}

function getErrorMessage(data: unknown) {
  if (!data) {
    return "Request failed";
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object") {
    const value = data as {
      detail?: unknown;
      message?: unknown;
      error?: unknown;
    };

    if (typeof value.detail === "string") {
      return value.detail;
    }

    if (Array.isArray(value.detail)) {
      return value.detail
        .map((item) => {
          if (
            item &&
            typeof item === "object" &&
            "msg" in item
          ) {
            return String(
              (item as { msg: unknown }).msg
            );
          }

          return String(item);
        })
        .join(", ");
    }

    if (typeof value.message === "string") {
      return value.message;
    }

    if (typeof value.error === "string") {
      return value.error;
    }
  }

  return "Request failed";
}

export async function fetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${getApiBaseUrl()}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data) ||
        `Request failed: ${response.status}`
    );
  }

  return data as T;
}

export async function fetchJsonWithAuth<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const userId = await getCurrentUserId();

  return fetchJson<T>(path, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      "user-id": userId,
    },
  });
}