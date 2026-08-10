export function formatArticleDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatEventDate(iso: string, timezone?: string | null): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone || undefined,
      timeZoneName: timezone ? "short" : undefined,
    }).format(date);
  } catch {
    return formatArticleDate(iso);
  }
}

export function isEventExpired(event: {
  end_at: string | null;
  start_at: string;
  status: string;
}): boolean {
  if (event.status === "cancelled" || event.status === "completed") return true;

  const reference = event.end_at ?? event.start_at;
  const referenceDate = new Date(reference);
  if (Number.isNaN(referenceDate.getTime())) return false;

  return referenceDate.getTime() < Date.now();
}

export function getEventRegistrationBadge(event: {
  registration_open_at: string | null;
  registration_close_at: string | null;
  registration_status: string | null;
  start_at: string;
}, now = new Date()): string {
  const opens = event.registration_open_at ? new Date(event.registration_open_at) : null;
  const closes = event.registration_close_at ? new Date(event.registration_close_at) : null;
  if (opens && opens > now) return `Opens ${formatArticleDate(opens.toISOString()).replace(/, \d{4}$/, "")}`;
  if (event.registration_status === "open" || (closes && closes >= now)) {
    if (closes) {
      const days = Math.ceil((closes.getTime() - now.getTime()) / 86_400_000);
      if (days <= 7) return days === 0 ? "Closes today" : `Closes in ${days} day${days === 1 ? "" : "s"}`;
    }
    return "Registration Open";
  }
  return `Event starts ${formatArticleDate(event.start_at).replace(/, \d{4}$/, "")}`;
}
