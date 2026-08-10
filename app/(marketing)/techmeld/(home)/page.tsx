import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/techmeld/category-card";
import { EcosystemSection } from "@/components/techmeld/ecosystem-section";
import { EventBrowser } from "@/components/techmeld/event-browser";
import { FeaturedUpdate } from "@/components/techmeld/featured-update";
import { LiveStatusStrip } from "@/components/techmeld/live-status";
import { NewsletterSignup } from "@/components/techmeld/newsletter-signup";
import { SectionHeading } from "@/components/techmeld/section-heading";
import { TechMeldHero } from "@/components/techmeld/techmeld-hero";
import { UpdateCard } from "@/components/techmeld/update-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { TechMeldArticle } from "@/types/techmeld";
import { buildTechMeldCategories } from "@/lib/techmeld/category-meta";
import {
  getFeaturedArticle,
  getLatestArticles,
  getTechMeldCategoryCounts,
  getTechMeldLiveStatus,
  getUpcomingEvents,
} from "@/lib/techmeld/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "TechMeld | AI News, Tech Events and Product Releases",
  description:
    "TechMeld brings together AI news, cloud events, product releases, learning opportunities, tools, and technology gatherings for modern professionals.",
  alternates: { canonical: "/techmeld" },
  openGraph: {
    title: "TechMeld | Technology, brought together",
    description:
      "Discover AI news, technology events, product releases, learning opportunities, and useful tools in one place.",
    type: "website",
    url: "/techmeld",
  },
};

export default async function TechMeldPage() {
  const [featuredArticle, aiNews, productReleases, upcomingEvents, categoryCounts, liveStatus] =
    await Promise.all([
      getFeaturedArticle(),
      getLatestArticles({ category: "ai-news", pageSize: 4 }),
      getLatestArticles({ category: "releases", pageSize: 4 }),
      getUpcomingEvents({ pageSize: 6 }),
      getTechMeldCategoryCounts(),
      getTechMeldLiveStatus(),
    ]);

  const categories = buildTechMeldCategories(categoryCounts);

  return (
    <main className="techmeld-page">
      <TechMeldHero />

      <section className="section techmeld-status-section" data-section-nav="false">
        <Reveal>
          <LiveStatusStrip status={liveStatus} />
        </Reveal>
      </section>

      <section
        className="section techmeld-featured-section"
        id="featured"
        data-section-label="Featured"
      >
        <Reveal>
          <FeaturedUpdate article={featuredArticle} />
        </Reveal>
      </section>

      <ArticleSection
        id="ai-news"
        eyebrow="AI news"
        title="The AI developments worth knowing."
        description="Clear, sourced reporting on models, platforms, research, policy, and the teams shaping artificial intelligence."
        articles={aiNews.items}
        emptyMessage="No approved AI news yet. New reporting will appear here after editorial review."
        actionLabel="Browse all AI news"
        actionHref="/techmeld/news?category=ai-news"
      />

      <ArticleSection
        id="product-releases"
        eyebrow="Product releases"
        title="New technology, without the launch-day noise."
        description="Important model, cloud, analytics, framework, and developer-platform releases—summarized with the details that matter."
        articles={productReleases.items}
        emptyMessage="No approved product releases yet. Verified release coverage will appear here soon."
        actionLabel="Browse all releases"
        actionHref="/techmeld/releases"
      />

      <section
        className="section techmeld-events-section"
        id="upcoming-events"
        data-section-label="Events"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Upcoming events"
            title="Technology gatherings worth your time."
            description="Verified workshops, meetups, conferences, webinars, and learning opportunities—organized for quick discovery."
          />
        </Reveal>

        <EventBrowser events={upcomingEvents.items} limit={3} />

        <div className="techmeld-section-action">
          <Link href="/techmeld/events" className="secondary-button">
            Explore all events
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section
        className="section techmeld-category-section"
        id="explore-topics"
        data-section-label="Explore topics"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Explore TechMeld"
            title="Everything technology professionals need to discover."
            description="Browse focused sections for developments, events, learning, tools, product releases, and community opportunities."
          />
        </Reveal>

        <RevealGroup className="techmeld-category-grid">
          {categories.map((category) => (
            <RevealItem key={category.slug}>
              <CategoryCard category={category} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="section" id="metricmeld-ecosystem" data-section-label="Ecosystem">
        <Reveal>
          <EcosystemSection />
        </Reveal>
      </section>

      <section className="section" id="techmeld-briefing" data-section-label="Newsletter">
        <Reveal>
          <NewsletterSignup />
        </Reveal>
      </section>
    </main>
  );
}

function ArticleSection({
  id,
  eyebrow,
  title,
  description,
  articles,
  emptyMessage,
  actionLabel,
  actionHref,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  articles: TechMeldArticle[];
  emptyMessage: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <section className="section techmeld-latest-section" id={id} data-section-label={eyebrow}>
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </Reveal>

      {articles.length > 0 ? (
        <>
          <RevealGroup className="techmeld-update-grid">
            {articles.map((article) => (
              <RevealItem key={article.id}>
                <UpdateCard article={article} />
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="techmeld-section-action">
            <Link href={actionHref} className="secondary-button">
              {actionLabel}
              <ArrowRight size={17} />
            </Link>
          </div>
        </>
      ) : (
        <div className="techmeld-empty-state">{emptyMessage}</div>
      )}
    </section>
  );
}
