import type { Metadata } from "next";
import { Pagination } from "@/components/techmeld/pagination";
import { UpdateCard } from "@/components/techmeld/update-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getLatestArticles } from "@/lib/techmeld/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Product Releases | TechMeld",
  description:
    "Approved product releases across AI, cloud, analytics, developer tools, and enterprise technology.",
  alternates: { canonical: "/techmeld/releases" },
};

type SearchParams = Promise<{ page?: string }>;

export default async function ReleasesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);

  const releases = await getLatestArticles({ category: "releases", page });

  return (
    <main>
      <Reveal as="section" className="techmeld-subpage-hero section" y={16}>
        <p className="eyebrow">TechMeld Releases</p>
        <h1>A clearer way to follow technology releases.</h1>
        <p>
          Major model launches, cloud services, analytics products,
          frameworks, and developer-platform updates from official sources.
        </p>
      </Reveal>

      <section className="section techmeld-subpage-content">
        {releases.items.length > 0 ? (
          <>
            <RevealGroup className="techmeld-update-grid">
              {releases.items.map((article) => (
                <RevealItem key={article.id}>
                  <UpdateCard article={article} />
                </RevealItem>
              ))}
            </RevealGroup>

            <Pagination
              page={page}
              hasMore={releases.hasMore}
              basePath="/techmeld/releases"
              searchParams={params}
            />
          </>
        ) : (
          <div className="techmeld-empty-state">
            No approved releases yet. Once ingestion runs and editorial
            review completes, they will appear here.
          </div>
        )}
      </section>
    </main>
  );
}
