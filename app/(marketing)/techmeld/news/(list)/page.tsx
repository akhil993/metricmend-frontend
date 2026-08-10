import type { Metadata } from "next";
import { NewsFilterBar } from "@/components/techmeld/news-filter-bar";
import { Pagination } from "@/components/techmeld/pagination";
import { UpdateCard } from "@/components/techmeld/update-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getDistinctArticleSources, getLatestArticles } from "@/lib/techmeld/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI and Technology News | TechMeld",
  description:
    "Original summaries of AI, cloud, analytics, and technology news from official sources, reviewed before publishing.",
  alternates: { canonical: "/techmeld/news" },
};

type SearchParams = Promise<{
  category?: string;
  source?: string;
  q?: string;
  page?: string;
}>;

export default async function TechMeldNewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);

  const [articles, sources] = await Promise.all([
    getLatestArticles({
      category: params.category,
      sourceName: params.source,
      q: params.q,
      page,
    }),
    getDistinctArticleSources(),
  ]);

  return (
    <main>
      <Reveal as="section" className="techmeld-subpage-hero section" y={16}>
        <p className="eyebrow">TechMeld News</p>
        <h1>Important technology developments, without the noise.</h1>
        <p>
          Original summaries of approved articles from official AI, cloud,
          and developer-platform sources.
        </p>
      </Reveal>

      <section className="section techmeld-subpage-content">
        <NewsFilterBar sources={sources} />

        {articles.items.length > 0 ? (
          <>
            <RevealGroup className="techmeld-update-grid">
              {articles.items.map((article) => (
                <RevealItem key={article.id}>
                  <UpdateCard article={article} />
                </RevealItem>
              ))}
            </RevealGroup>

            <Pagination
              page={page}
              hasMore={articles.hasMore}
              basePath="/techmeld/news"
              searchParams={params}
            />
          </>
        ) : (
          <div className="techmeld-empty-state">
            {params.q || params.category || params.source
              ? "No updates match these filters."
              : "No approved updates yet. Once ingestion runs and editorial review completes, they will appear here."}
          </div>
        )}
      </section>
    </main>
  );
}
