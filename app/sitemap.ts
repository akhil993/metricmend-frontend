import type { MetadataRoute } from "next";
import { getLatestArticles, getUpcomingEvents } from "@/lib/techmeld/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://metricmendai.com";
const MAX_DYNAMIC_ENTRIES = 200;

const STATIC_ROUTES = [
  "",
  "/about",
  "/technology",
  "/research",
  "/mendjobs",
  "/contact",
  "/products",
  "/solutions",
  "/products/coming-soon",
  "/assistants",
  "/assistants/mina",
  "/assistants/mira",
  "/techmeld",
  "/techmeld/news",
  "/techmeld/events",
  "/techmeld/releases",
  "/techmeld/learning",
  "/techmeld/tools",
  "/techmeld/opportunities",
  "/techmeld/community",
  "/techmeld/submit",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" || path.startsWith("/techmeld") ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  const [articles, events] = await Promise.all([
    getLatestArticles({ pageSize: MAX_DYNAMIC_ENTRIES }),
    getUpcomingEvents({ pageSize: MAX_DYNAMIC_ENTRIES }),
  ]);

  const articleEntries: MetadataRoute.Sitemap = articles.items.map((article) => ({
    url: `${SITE_URL}/techmeld/news/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.items.map((event) => ({
    url: `${SITE_URL}/techmeld/events/${event.slug}`,
    lastModified: event.startAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticEntries, ...articleEntries, ...eventEntries];
}
