"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TechMeldEvent } from "@/types/techmeld";
import { EventCard } from "./event-card";

const filters = [
  "All",
  "Free",
  "Paid",
  "Virtual",
  "In person",
  "Hybrid",
  "AI",
  "Cloud",
  "Analytics",
  "Data Engineering",
  "Software Development",
] as const;

type Filter = (typeof filters)[number];

export function EventBrowser({
  events,
  limit,
}: {
  events: TechMeldEvent[];
  limit?: number;
}) {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filteredEvents = useMemo(() => {
    const matching = events.filter((event) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Free") return event.costType === "free";
      if (activeFilter === "Paid") return event.costType === "paid";
      if (activeFilter === "Virtual") return event.format === "virtual";
      if (activeFilter === "In person") return event.format === "in_person";
      if (activeFilter === "Hybrid") return event.format === "hybrid";

      return event.category === activeFilter;
    });

    return typeof limit === "number" ? matching.slice(0, limit) : matching;
  }, [activeFilter, events, limit]);

  return (
    <div>
      <div className="techmeld-event-filters" aria-label="Filter events">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === activeFilter ? "is-active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredEvents.length > 0 ? (
        <div className="techmeld-event-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="techmeld-empty-filter">
          No upcoming events yet. Check back soon, or{" "}
          <Link href="/techmeld/submit">suggest one</Link>.
        </div>
      ) : (
        <div className="techmeld-empty-filter">No events match this filter.</div>
      )}
    </div>
  );
}
