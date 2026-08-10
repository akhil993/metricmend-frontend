import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { TechMeldArticle } from "@/types/techmeld";

export function FeaturedUpdate({ article }: { article: TechMeldArticle | null }) {
  if (!article) {
    return (
      <article className="techmeld-featured-update">
        <div className="techmeld-featured-copy">
          <p className="techmeld-content-label">Featured update</p>
          <h2>No approved updates yet.</h2>
          <p>
            TechMeld is connected and ready — the first approved article will
            appear here once ingestion runs and editorial review completes.
          </p>
        </div>

        <div className="techmeld-featured-visual" aria-hidden="true">
          <div className="techmeld-orbit techmeld-orbit-one" />
          <div className="techmeld-orbit techmeld-orbit-two" />
          <div className="techmeld-visual-core">
            <Sparkles />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="techmeld-featured-update">
      <div className="techmeld-featured-copy">
        <p className="techmeld-content-label">
          {article.category === "releases" ? "Product release" : "Featured update"} · {article.sourceName}
        </p>

        <h2>{article.title}</h2>

        <p>{article.summary}</p>
        <p><strong>Why it matters:</strong> {article.whyItMatters}</p>

        <div className="techmeld-content-meta">
          <span>{article.publishedDateLabel}</span>
        </div>

        <Link href={`/techmeld/news/${article.slug}`} className="techmeld-text-action">
          Read update
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="techmeld-featured-visual" aria-hidden="true">
        <div className="techmeld-orbit techmeld-orbit-one" />
        <div className="techmeld-orbit techmeld-orbit-two" />
        <div className="techmeld-visual-core">
          <Sparkles />
        </div>
      </div>
    </article>
  );
}
