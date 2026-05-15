import { getCurrentUserId } from "@/lib/auth/session";

function getApiBaseUrl() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured"
    );
  }

  return apiBaseUrl;
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
        "Content-Type":
          "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      text ||
        `Request failed: ${response.status}`
    );
  }

  return response.json();
}

export async function fetchJsonWithAuth<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const userId =
    await getCurrentUserId();

  return fetchJson<T>(path, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      "user-id": userId,
    },
  });
}