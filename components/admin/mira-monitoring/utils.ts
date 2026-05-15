export function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function safeText(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function summarizeObject(value: any) {
  if (!value) return null;

  if (Array.isArray(value)) {
    return {
      type: "array",
      count: value.length,
      preview: value.slice(0, 3),
    };
  }

  if (typeof value === "object") {
    return {
      keys: Object.keys(value),
      preview: value,
    };
  }

  return value;
}

export function unwrapArray<T>(data: any, keys: string[]): T[] {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
}

export function formatMs(value?: number | null) {
  if (value === null || value === undefined) return "—";
  return `${Math.round(value)} ms`;
}

export function getLatencyLevel(value?: number | null) {
  if (value === null || value === undefined) return "unknown";

  if (value < 1000) return "fast";
  if (value < 3000) return "normal";
  if (value < 8000) return "slow";

  return "very_slow";
}

export function matchesSearch(value: string | null | undefined, search: string) {
  if (!search.trim()) return true;
  if (!value) return false;

  return value.toLowerCase().includes(search.toLowerCase().trim());
}