import type { Metadata } from "next";
import { EventCard } from "@/components/techmeld/event-card";
import { EventFilterBar } from "@/components/techmeld/event-filter-bar";
import { Pagination } from "@/components/techmeld/pagination";
import { SectionHeading } from "@/components/techmeld/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getUpcomingEvents } from "@/lib/techmeld/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Technology Events | TechMeld",
  description:
    "Browse approved AI, cloud, analytics, data engineering, and software development events, workshops, and conferences.",
  alternates: { canonical: "/techmeld/events" },
};

type SearchParams = Promise<{
  category?: string;
  format?: string;
  costType?: string;
  q?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
}>;

function toIsoOrUndefined(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export default async function TechMeldEventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);

  const validFormat =
    params.format === "virtual" || params.format === "in_person" || params.format === "hybrid"
      ? params.format
      : undefined;
  const validCostType =
    params.costType === "free" || params.costType === "paid" ? params.costType : undefined;

  const events = await getUpcomingEvents({
    category: params.category,
    format: validFormat,
    costType: validCostType,
    q: params.q,
    location: params.location,
    dateFrom: toIsoOrUndefined(params.dateFrom),
    dateTo: toIsoOrUndefined(params.dateTo),
    page,
  });

  const hasFilters = Boolean(
    params.category ||
      params.format ||
      params.costType ||
      params.q ||
      params.location ||
      params.dateFrom ||
      params.dateTo
  );

  return (
    <main>
      <Reveal as="section" className="techmeld-subpage-hero section" y={16}>
        <p className="eyebrow">TechMeld Events</p>
        <h1>Technology events, brought together.</h1>
        <p>
          Approved workshops, webinars, conferences, summits, meetups, and
          community gatherings.
        </p>
      </Reveal>

      <section className="section techmeld-subpage-content">
        <SectionHeading title="Browse events" description="Upcoming events only, soonest first." />

        <EventFilterBar />

        {events.items.length > 0 ? (
          <>
            <RevealGroup className="techmeld-event-grid">
              {events.items.map((event) => (
                <RevealItem key={event.id}>
                  <EventCard event={event} />
                </RevealItem>
              ))}
            </RevealGroup>

            <Pagination
              page={page}
              hasMore={events.hasMore}
              basePath="/techmeld/events"
              searchParams={params}
            />
          </>
        ) : (
          <div className="techmeld-empty-state">
            {hasFilters
              ? "No events match these filters."
              : "No upcoming events yet. Check back soon, or suggest one from the submit page."}
          </div>
        )}
      </section>
    </main>
  );
}
