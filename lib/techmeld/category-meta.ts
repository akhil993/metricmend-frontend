import type { TechMeldCategory, TechMeldCategorySlug } from "@/types/techmeld";
import type { TechMeldCategoryCounts } from "./queries";

type CategoryMeta = Omit<TechMeldCategory, "itemCount">;

export const TECHMELD_CATEGORY_META: CategoryMeta[] = [
  {
    slug: "ai-news",
    title: "AI News",
    description:
      "Important developments across artificial intelligence, models, platforms, and research.",
    href: "/techmeld/news",
    icon: "brain",
  },
  {
    slug: "events",
    title: "Events",
    description:
      "Cloud conferences, webinars, workshops, meetups, summits, and developer gatherings.",
    href: "/techmeld/events",
    icon: "calendar",
  },
  {
    slug: "releases",
    title: "Product Releases",
    description:
      "New models, cloud services, analytics products, frameworks, and developer platforms.",
    href: "/techmeld/releases",
    icon: "rocket",
  },
  {
    slug: "learning",
    title: "Learning",
    description:
      "Certifications, workshops, technical courses, documentation, and guided learning.",
    href: "/techmeld/learning",
    icon: "graduation",
  },
  {
    slug: "tools",
    title: "Tools",
    description:
      "Useful tools for AI, cloud, analytics, engineering, software development, and productivity.",
    href: "/techmeld/tools",
    icon: "wrench",
  },
  {
    slug: "community",
    title: "Hackathons & Community",
    description:
      "Technical competitions, local meetups, virtual communities, and collaborative events.",
    href: "/techmeld/community",
    icon: "users",
  },
];

export function buildTechMeldCategories(counts: TechMeldCategoryCounts): TechMeldCategory[] {
  const countMap: Record<TechMeldCategorySlug, number> = {
    "ai-news": counts.aiNews,
    events: counts.events,
    releases: counts.releases,
    learning: counts.learning,
    tools: counts.tools,
    community: counts.community,
  };

  return TECHMELD_CATEGORY_META.map((meta) => ({
    ...meta,
    itemCount: countMap[meta.slug],
  }));
}
