import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Wrench } from "lucide-react";
import { Pagination } from "@/components/techmeld/pagination";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getFeaturedTools } from "@/lib/techmeld/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Technology Tools | TechMeld",
  description:
    "Explore verified tools for AI, cloud, analytics, data engineering, and software development.",
  alternates: { canonical: "/techmeld/tools" },
};

type SearchParams = Promise<{
  pricingType?: string;
  category?: string;
  page?: string;
}>;

const PRICING_OPTIONS = [
  { value: "", label: "All" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
];

const CATEGORY_OPTIONS = ["AI", "Cloud", "Analytics", "Data Engineering", "Software Development"];

function buildFilterHref(
  current: { pricingType?: string; category?: string },
  overrides: { pricingType?: string; category?: string }
) {
  const next = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.pricingType) params.set("pricingType", next.pricingType);

  const qs = params.toString();
  return qs ? `/techmeld/tools?${qs}` : "/techmeld/tools";
}

export default async function ToolsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);

  const validPricingType =
    params.pricingType === "free" || params.pricingType === "freemium" || params.pricingType === "paid"
      ? params.pricingType
      : undefined;

  const tools = await getFeaturedTools({
    pricingType: validPricingType,
    category: params.category,
    page,
  });

  return (
    <main>
      <Reveal as="section" className="techmeld-subpage-hero section" y={16}>
        <p className="eyebrow">TechMeld Tools</p>
        <h1>Useful technology tools, easier to discover.</h1>
        <p>
          Verified tools for AI, cloud, analytics, data engineering, and
          software development — description, pricing, and an official link,
          nothing more.
        </p>
      </Reveal>

      <section className="section techmeld-subpage-content">
        <div className="techmeld-filter-bar">
          <div className="techmeld-filter-group" role="group" aria-label="Filter by pricing">
            {PRICING_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={buildFilterHref(params, { pricingType: option.value })}
                className={(params.pricingType ?? "") === option.value ? "is-active" : ""}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <div className="techmeld-filter-group" role="group" aria-label="Filter by category">
            <Link
              href={buildFilterHref(params, { category: "" })}
              className={!params.category ? "is-active" : ""}
            >
              All categories
            </Link>
            {CATEGORY_OPTIONS.map((category) => (
              <Link
                key={category}
                href={buildFilterHref(params, { category })}
                className={params.category === category ? "is-active" : ""}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {tools.items.length > 0 ? (
          <>
            <RevealGroup className="techmeld-resource-grid">
              {tools.items.map((tool) => (
                <RevealItem key={tool.id}>
                  <article className="techmeld-resource-card">
                    <Wrench />
                    <span>{tool.pricingType}</span>
                    <h2>{tool.name}</h2>
                    <p className="techmeld-resource-provider">{tool.company ?? tool.category}</p>
                    <p>{tool.description}</p>
                    <div className="techmeld-tags">
                      {tool.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Visit website
                      <ExternalLink size={14} />
                    </a>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>

            <Pagination
              page={page}
              hasMore={tools.hasMore}
              basePath="/techmeld/tools"
              searchParams={params}
            />
          </>
        ) : (
          <div className="techmeld-empty-state">
            {params.category || params.pricingType
              ? "No tools match these filters."
              : "No verified tools yet. Suggest one from the submit page."}
          </div>
        )}
      </section>
    </main>
  );
}
