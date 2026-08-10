import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { TechMeldArticle } from "@/types/techmeld";
import { ArticleImage } from "./article-image";
import { ProductDiscoveryCard } from "./product-discovery-card";
import { SourceAttribution } from "./source-attribution";

const CATEGORY_LABELS: Record<string, string> = {
  "ai-news": "AI News",
  releases: "Product Release",
};

export function UpdateCard({ article }: { article: TechMeldArticle }) {
  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;

  return (
    <article className="techmeld-update-card">
      <ArticleImage
        imageUrl={article.imageUrl}
        categoryLabel={categoryLabel}
        featured={article.featured}
      />

      <div className="techmeld-update-content">
        <div className="techmeld-content-meta">
          <span>{categoryLabel}</span>
          <span>{article.publishedDateLabel}</span>
        </div>

        <h3>
          <Link href={`/techmeld/news/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.summary}</p>
        <p><strong>Why it matters:</strong> {article.whyItMatters}</p>

        <div className="techmeld-tags">
          {article.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <SourceAttribution sourceName={article.publisher} author={article.author} publishedDate={article.publishedDateLabel} />

        <a href={article.canonicalUrl} target="_blank" rel="noopener noreferrer">
          Read the full article at {article.publisher}
          <ExternalLink size={14} />
        </a>
      </div>

      {article.relatedProduct ? (
        <ProductDiscoveryCard product={article.relatedProduct} />
      ) : null}
    </article>
  );
}
