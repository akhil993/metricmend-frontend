import type { TechMeldEventCostType, TechMeldEventFormat } from "@/types/techmeld";
import { clampText, stripHtml } from "./sanitize";
import { buildEventSlug } from "./slug";
import { isValidExternalUrl } from "./validate-url";

const MAX_NAME_LENGTH = 300;
const MAX_DESCRIPTION_LENGTH = 600;
const MAX_TAGS = 8;

export interface NormalizedEventInput {
  name: string;
  organizer: string;
  sourceUrl: string;
  registrationUrl?: string | null;
  registrationOpenAt?: string | null;
  registrationCloseAt?: string | null;
  registrationStatus?: "open" | "closed" | "unknown";
  sameDayRegistration?: boolean;
  category: string;
  description: string;
  startAt: string;
  endAt?: string | null;
  timezone?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  venue?: string | null;
  format: TechMeldEventFormat;
  costType: TechMeldEventCostType;
  priceText?: string | null;
  tags?: string[];
}

export interface NormalizedEvent {
  name: string;
  slug: string;
  organizer: string;
  source_url: string;
  registration_url: string | null;
  registration_open_at: string | null;
  registration_close_at: string | null;
  registration_status: "open" | "closed" | "unknown";
  same_day_registration: boolean;
  category: string;
  description: string;
  start_at: string;
  end_at: string | null;
  timezone: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  venue: string | null;
  format: TechMeldEventFormat;
  cost_type: TechMeldEventCostType;
  price_text: string | null;
  tags: string[];
  status: "pending";
}

/**
 * Normalizes event input (from a structured source or a promoted editorial
 * submission) into an insertable event row, or null if required fields are
 * missing/invalid. Always lands as 'pending' — events are never
 * auto-approved, since there is currently no verified structured event feed
 * wired into ingestion.
 */
export function normalizeEvent(input: NormalizedEventInput): NormalizedEvent | null {
  const name = input.name?.trim();
  const organizer = input.organizer?.trim();

  if (!name || !organizer || !isValidExternalUrl(input.sourceUrl)) {
    return null;
  }

  const startDate = new Date(input.startAt);
  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  let endAtIso: string | null = null;
  if (input.endAt) {
    const endDate = new Date(input.endAt);
    if (Number.isNaN(endDate.getTime()) || endDate.getTime() < startDate.getTime()) {
      return null;
    }
    endAtIso = endDate.toISOString();
  }

  const registrationUrl =
    input.registrationUrl && isValidExternalUrl(input.registrationUrl)
      ? input.registrationUrl
      : null;

  const registrationOpen = input.registrationOpenAt ? new Date(input.registrationOpenAt) : null;
  const registrationClose = input.registrationCloseAt ? new Date(input.registrationCloseAt) : null;
  if (
    (registrationOpen && Number.isNaN(registrationOpen.getTime())) ||
    (registrationClose && Number.isNaN(registrationClose.getTime())) ||
    (registrationOpen && registrationClose && registrationClose < registrationOpen)
  ) return null;

  return {
    name: clampText(name, MAX_NAME_LENGTH),
    slug: buildEventSlug(name, startDate.toISOString()),
    organizer,
    source_url: input.sourceUrl,
    registration_url: registrationUrl,
    registration_open_at: registrationOpen?.toISOString() ?? null,
    registration_close_at: registrationClose?.toISOString() ?? null,
    registration_status: input.registrationStatus ?? "unknown",
    same_day_registration: input.sameDayRegistration ?? false,
    category: input.category?.trim() || "Software Development",
    description: clampText(stripHtml(input.description ?? ""), MAX_DESCRIPTION_LENGTH),
    start_at: startDate.toISOString(),
    end_at: endAtIso,
    timezone: input.timezone?.trim() || null,
    city: input.city?.trim() || null,
    region: input.region?.trim() || null,
    country: input.country?.trim() || null,
    venue: input.venue?.trim() || null,
    format: input.format,
    cost_type: input.costType,
    price_text: input.priceText?.trim() || null,
    tags: Array.from(new Set(input.tags ?? [])).slice(0, MAX_TAGS),
    status: "pending",
  };
}
