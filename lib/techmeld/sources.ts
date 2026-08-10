// Reference metadata for the sources seeded into techmeld_sources by
// supabase/migrations/20260804120000_techmeld_schema.sql. The DATABASE ROW is
// the runtime source of truth for ingestion (enabled/disabled, trust level,
// etc.) — this file supplies the default topic tags per feed (there's no
// `tags` column on techmeld_sources) and doubles as the reference for
// docs/techmeld.md.

export interface TechMeldSourceReference {
  name: string;
  feedUrl: string;
  defaultTags: string[];
}

export const TECHMELD_CONFIGURED_SOURCES: TechMeldSourceReference[] = [
  { name: "AWS News Blog", feedUrl: "https://aws.amazon.com/blogs/aws/feed/", defaultTags: ["Cloud"] },
  { name: "AWS What's New", feedUrl: "https://aws.amazon.com/about-aws/whats-new/recent/feed/", defaultTags: ["Cloud"] },
  { name: "Google Cloud Release Notes", feedUrl: "https://docs.cloud.google.com/feeds/gcp-release-notes.xml", defaultTags: ["Cloud"] },
  { name: "Google AI Blog", feedUrl: "https://blog.google/technology/ai/rss/", defaultTags: ["AI"] },
  { name: "Microsoft Cloud Blog", feedUrl: "https://www.microsoft.com/en-us/microsoft-cloud/blog/feed/", defaultTags: ["Cloud"] },
  { name: "Microsoft DevBlogs", feedUrl: "https://devblogs.microsoft.com/feed/", defaultTags: ["Software Development"] },
  { name: "GitHub Blog", feedUrl: "https://github.blog/feed/", defaultTags: ["Software Development"] },
  { name: "GitHub Changelog", feedUrl: "https://github.blog/changelog/feed/", defaultTags: ["Software Development"] },
  { name: "NVIDIA Developer Blog", feedUrl: "https://developer.nvidia.com/blog/feed", defaultTags: ["AI"] },
  { name: "NVIDIA Blog", feedUrl: "https://blogs.nvidia.com/feed/", defaultTags: ["AI"] },
  { name: "Databricks Blog", feedUrl: "https://www.databricks.com/feed", defaultTags: ["Data Engineering", "AI"] },
  { name: "Docker Blog", feedUrl: "https://www.docker.com/feed/", defaultTags: ["Software Development"] },
  { name: "Kubernetes Blog", feedUrl: "https://kubernetes.io/feed.xml", defaultTags: ["Cloud", "Data Engineering"] },
  { name: "Vercel News", feedUrl: "https://vercel.com/atom", defaultTags: ["Software Development"] },
  { name: "Supabase Blog", feedUrl: "https://supabase.com/rss.xml", defaultTags: ["Software Development"] },
  { name: "Cloudflare Blog", feedUrl: "https://blog.cloudflare.com/rss/", defaultTags: ["Cloud"] },
  { name: "OpenAI News", feedUrl: "https://openai.com/news/rss.xml", defaultTags: ["AI"] },
  { name: "Hugging Face Blog", feedUrl: "https://huggingface.co/blog/feed.xml", defaultTags: ["AI"] },
  { name: "MongoDB Blog", feedUrl: "https://www.mongodb.com/blog/rss", defaultTags: ["Data Engineering"] },
  { name: "Stack Overflow Blog", feedUrl: "https://stackoverflow.blog/feed/", defaultTags: ["Software Development"] },
];

export interface TechMeldUnconfiguredSource {
  name: string;
  attemptedUrl: string;
  reason: string;
}

export const TECHMELD_UNCONFIGURED_SOURCES: TechMeldUnconfiguredSource[] = [
  { name: "Azure Updates", attemptedUrl: "https://azure.microsoft.com/en-us/updates/feed/", reason: "Feed endpoint now serves an HTML SPA shell instead of XML." },
  { name: "Snowflake Newsroom", attemptedUrl: "https://www.snowflake.com/en/news/rss/", reason: "Returned HTTP 404." },
  { name: "dbt Labs Blog", attemptedUrl: "https://blog.dbtlabs.com/rss.xml", reason: "Host unreachable during verification." },
  { name: "Apple Developer News", attemptedUrl: "https://developer.apple.com/news/rss/news.rss", reason: "Returned HTTP 500." },
  { name: "HashiCorp Blog", attemptedUrl: "https://www.hashicorp.com/en/blog/feed.xml", reason: "Rate-limited (HTTP 429) on every verification attempt." },
  { name: "Anthropic", attemptedUrl: "https://www.anthropic.com/news/rss.xml", reason: "No public RSS endpoint found." },
  { name: "Meta / AI at Meta", attemptedUrl: "https://ai.meta.com/blog/rss/", reason: "Returned HTTP 404." },
];

export function getDefaultTagsForFeedUrl(feedUrl: string | null): string[] {
  if (!feedUrl) return [];
  return (
    TECHMELD_CONFIGURED_SOURCES.find((source) => source.feedUrl === feedUrl)
      ?.defaultTags ?? []
  );
}
