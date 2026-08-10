import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, GraduationCap } from "lucide-react";
import { Pagination } from "@/components/techmeld/pagination";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getLearningResources } from "@/lib/techmeld/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Technology Learning | TechMeld",
  description:
    "Discover approved technology courses, certifications, workshops, and learning resources.",
  alternates: { canonical: "/techmeld/learning" },
};

type SearchParams = Promise<{
  accessType?: string;
  certification?: string;
  category?: string;
  page?: string;
}>;

const ACCESS_OPTIONS: Array<{ accessType?: string; certification?: string; label: string }> = [
  { label: "All" },
  { accessType: "free", label: "Free" },
  { accessType: "paid", label: "Paid" },
  { certification: "true", label: "Certification" },
];

const CATEGORY_OPTIONS = ["AI", "Cloud", "Analytics", "Data Engineering", "Software Development"];

/** Builds a /techmeld/learning link that keeps the current filters except for the keys explicitly overridden. */
function buildFilterHref(
  current: { accessType?: string; certification?: string; category?: string },
  overrides: { accessType?: string; certification?: string; category?: string }
) {
  const next = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.accessType) params.set("accessType", next.accessType);
  if (next.certification) params.set("certification", next.certification);

  const qs = params.toString();
  return qs ? `/techmeld/learning?${qs}` : "/techmeld/learning";
}

export default async function LearningPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);

  const validAccessType =
    params.accessType === "free" || params.accessType === "paid" ? params.accessType : undefined;

  const resources = await getLearningResources({
    accessType: validAccessType,
    certification: params.certification === "true" ? true : undefined,
    category: params.category,
    page,
  });

  const isAccessActive = (option: (typeof ACCESS_OPTIONS)[number]) => {
    if (!option.accessType && !option.certification) {
      return !params.accessType && !params.certification;
    }
    return option.accessType === params.accessType && option.certification === params.certification;
  };

  return (
    <main>
      <Reveal as="section" className="techmeld-subpage-hero section" y={16}>
        <p className="eyebrow">TechMeld Learning</p>
        <h1>Learning opportunities, brought together.</h1>
        <p>
          Approved courses, certifications, workshops, and guided technical
          learning from official providers.
        </p>
      </Reveal>

      <section className="section techmeld-subpage-content">
        <div className="techmeld-filter-bar">
          <div className="techmeld-filter-group" role="group" aria-label="Filter by access">
            {ACCESS_OPTIONS.map((option) => (
              <Link
                key={option.label}
                href={buildFilterHref(params, {
                  accessType: option.accessType ?? "",
                  certification: option.certification ?? "",
                })}
                className={isAccessActive(option) ? "is-active" : ""}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <div className="techmeld-filter-group" role="group" aria-label="Filter by topic">
            <Link
              href={buildFilterHref(params, { category: "" })}
              className={!params.category ? "is-active" : ""}
            >
              All topics
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

        {resources.items.length > 0 ? (
          <>
            <RevealGroup className="techmeld-resource-grid">
              {resources.items.map((resource) => (
                <RevealItem key={resource.id}>
                  <article className="techmeld-resource-card">
                    <GraduationCap />
                    <span>{resource.accessType === "free" ? "Free" : "Paid"}</span>
                    <h2>{resource.title}</h2>
                    <p className="techmeld-resource-provider">{resource.provider}</p>
                    <p>{resource.description}</p>
                    {resource.certification ? (
                      <p className="techmeld-resource-certification">Offers certification</p>
                    ) : null}
                    <div className="techmeld-tags">
                      {resource.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer">
                      Visit {resource.provider}
                      <ExternalLink size={14} />
                    </a>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>

            <Pagination
              page={page}
              hasMore={resources.hasMore}
              basePath="/techmeld/learning"
              searchParams={params}
            />
          </>
        ) : (
          <div className="techmeld-empty-state">
            {params.category || params.accessType || params.certification
              ? "No learning resources match these filters."
              : "No approved learning resources yet. Suggest one from the submit page."}
          </div>
        )}
      </section>
    </main>
  );
}
