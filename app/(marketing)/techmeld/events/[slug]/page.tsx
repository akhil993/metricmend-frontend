import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Laptop,
  MapPin,
  Ticket,
} from "lucide-react";
import { EventCard } from "@/components/techmeld/event-card";
import { SourceAttribution } from "@/components/techmeld/source-attribution";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getEventBySlug, getRelatedEvents } from "@/lib/techmeld/queries";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event not found | TechMeld" };
  }

  return {
    title: `${event.name} | TechMeld Events`,
    description: event.description,
    alternates: { canonical: `/techmeld/events/${event.slug}` },
    openGraph: {
      title: event.name,
      description: event.description,
      type: "website",
      url: `/techmeld/events/${event.slug}`,
    },
  };
}

const FORMAT_LABELS: Record<string, string> = {
  virtual: "Virtual",
  in_person: "In person",
  hybrid: "Hybrid",
};

const ATTENDANCE_MODE: Record<string, string> = {
  virtual: "https://schema.org/OnlineEventAttendanceMode",
  in_person: "https://schema.org/OfflineEventAttendanceMode",
  hybrid: "https://schema.org/MixedEventAttendanceMode",
};

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const related = await getRelatedEvents(event, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startAt,
    endDate: event.endAt ?? undefined,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: ATTENDANCE_MODE[event.format],
    location:
      event.format === "virtual"
        ? { "@type": "VirtualLocation", url: event.registrationUrl ?? event.sourceUrl }
        : {
            "@type": "Place",
            name: event.venue ?? event.city ?? undefined,
            address: [event.city, event.region, event.country].filter(Boolean).join(", ") || undefined,
          },
    organizer: { "@type": "Organization", name: event.organizer },
    description: event.description,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal as="section" className="techmeld-detail-hero section" y={16}>
        <Link href="/techmeld/events" className="techmeld-back-link">
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <div className="techmeld-content-meta">
          <span>{event.category}</span>
          <span>{FORMAT_LABELS[event.format]}</span>
        </div>

        {event.status === "cancelled" ? (
          <div className="techmeld-status-banner is-cancelled">
            <Ban size={16} />
            This event has been cancelled.
          </div>
        ) : event.status === "completed" || event.isExpired ? (
          <div className="techmeld-status-banner">
            <CheckCircle2 size={16} />
            This event has already taken place.
          </div>
        ) : null}

        <h1>{event.name}</h1>
        <p className="techmeld-event-organizer">Organized by {event.organizer}</p>

        <div className="techmeld-event-details">
          <span>
            <CalendarDays size={16} />
            {event.startDateLabel}
            {event.timezone ? ` (${event.timezone})` : ""}
          </span>

          <span>
            {event.format === "virtual" ? <Laptop size={16} /> : <MapPin size={16} />}
            {event.format === "virtual"
              ? "Virtual"
              : [event.venue, event.city, event.region, event.country].filter(Boolean).join(", ") ||
                "Location TBA"}
          </span>

          <span>
            <Ticket size={16} />
            {event.costType === "free" ? "Free" : event.priceText || "Paid"}
          </span>
        </div>

        <div className="techmeld-tags">
          {event.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="section techmeld-detail-content">
        <p className="techmeld-detail-summary">{event.description}</p>

        <SourceAttribution sourceName={event.organizer} />

        <div className="techmeld-detail-actions">
          {event.registrationUrl && event.status === "approved" && !event.isExpired ? (
            <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="primary-button">
              Register
              <ExternalLink size={16} />
            </a>
          ) : null}

          <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="secondary-button">
            View original source
            <ExternalLink size={16} />
          </a>
        </div>
      </Reveal>

      {related.length > 0 ? (
        <section className="section techmeld-related-section">
          <h2>Related events</h2>
          <RevealGroup className="techmeld-event-grid">
            {related.map((relatedEvent) => (
              <RevealItem key={relatedEvent.id}>
                <EventCard event={relatedEvent} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      ) : null}
    </main>
  );
}
