import Link from "next/link";
import {
  Ban,
  CalendarDays,
  ExternalLink,
  Laptop,
  MapPin,
  Star,
  Ticket,
} from "lucide-react";
import type { TechMeldEvent } from "@/types/techmeld";

const FORMAT_LABELS: Record<TechMeldEvent["format"], string> = {
  virtual: "Virtual",
  in_person: "In person",
  hybrid: "Hybrid",
};

function locationLabel(event: TechMeldEvent): string {
  if (event.format === "virtual") return "Virtual";
  return [event.city, event.country].filter(Boolean).join(", ") || "Location TBA";
}

function costLabel(event: TechMeldEvent): string {
  if (event.costType === "free") return "Free";
  if (event.costType === "paid") return event.priceText || "Paid";
  return "Cost TBA";
}

export function EventCard({ event }: { event: TechMeldEvent }) {
  return (
    <article className="techmeld-event-card">
      <div className="techmeld-event-topline">
        <span>{event.category}</span>
        {event.status === "cancelled" ? (
          <strong className="is-cancelled">
            <Ban size={13} />
            Cancelled
          </strong>
        ) : event.featured ? (
          <strong>
            <Star size={13} />
            Featured
          </strong>
        ) : null}
      </div>

      <strong className="techmeld-event-registration-badge">{event.registrationBadge}</strong>

      <h3>
        <Link href={`/techmeld/events/${event.slug}`}>{event.name}</Link>
      </h3>
      <p className="techmeld-event-organizer">{event.organizer}</p>
      <p>{event.description}</p>

      <div className="techmeld-event-details">
        <span>
          <CalendarDays size={15} />
          {event.startDateLabel}
        </span>

        <span>
          {event.format === "virtual" ? <Laptop size={15} /> : <MapPin size={15} />}
          {locationLabel(event)}
        </span>

        <span>
          <Ticket size={15} />
          {costLabel(event)}
        </span>
      </div>

      <div className="techmeld-tags">
        <span>{FORMAT_LABELS[event.format]}</span>
        {event.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {event.registrationUrl && event.status === "approved" && !event.isExpired ? (
        <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
          Register
          <ExternalLink size={14} />
        </a>
      ) : (
        <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
          View source
          <ExternalLink size={14} />
        </a>
      )}
    </article>
  );
}
