import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/techmeld/event-card";
import { Pagination } from "@/components/techmeld/pagination";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getUpcomingEvents } from "@/lib/techmeld/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Hackathons & Technology Community | TechMeld",
  description: "Reviewed technology hackathons, meetups, community programs, and collaborative events.",
  alternates: { canonical: "/techmeld/community" },
};

type SearchParams = Promise<{ page?: string }>;

export default async function CommunityPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);
  const events = await getUpcomingEvents({
    eventTypes: ["hackathon", "meetup", "community"],
    page,
    pageSize: 12,
  });

  return (
    <main>
      <Reveal as="section" className="techmeld-subpage-hero section" y={16}>
        <p className="eyebrow">Hackathons &amp; Community</p>
        <h1>Build, collaborate, and learn with the technology community.</h1>
        <p>Reviewed hackathons, meetups, community programs, and collaborative technology events from attributable sources.</p>
      </Reveal>
      <section className="section techmeld-subpage-content">
        {events.items.length ? (
          <>
            <RevealGroup className="techmeld-event-grid">
              {events.items.map((event) => <RevealItem key={event.id}><EventCard event={event} /></RevealItem>)}
            </RevealGroup>
            <Pagination page={page} hasMore={events.hasMore} basePath="/techmeld/community" searchParams={params} />
          </>
        ) : (
          <div className="techmeld-empty-state">
            <p>No approved upcoming community opportunities yet.</p>
            <Link href="/techmeld/submit" className="secondary-button">Submit a hackathon or meetup</Link>
          </div>
        )}
      </section>
    </main>
  );
}
