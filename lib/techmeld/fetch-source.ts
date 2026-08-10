const DEFAULT_TIMEOUT_MS = 10_000;

export interface FetchSourceResult {
  ok: boolean;
  status: number;
  body: string | null;
  error: string | null;
}

export async function fetchSourceText(
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<FetchSourceResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "TechMeldBot/1.0 (+https://metricmend.ai/techmeld)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      return { ok: false, status: response.status, body: null, error: `HTTP ${response.status}` };
    }

    const body = await response.text();
    return { ok: true, status: response.status, body, error: null };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: null,
      error: error instanceof Error ? error.message : "Unknown fetch error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
