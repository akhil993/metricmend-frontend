import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ProductDiscoveryCard } from "@/components/techmeld/product-discovery-card";
import { SourceAttribution } from "@/components/techmeld/source-attribution";
import { UpdateCard } from "@/components/techmeld/update-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { getArticleBySlug, getRelatedArticles } from "@/lib/techmeld/queries";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Update not found | TechMeld" };
  }

  return {
    title: `${article.title} | TechMeld`,
    description: article.summary,
    alternates: { canonical: `/techmeld/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      url: `/techmeld/news/${article.slug}`,
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(article, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
    publisher: { "@type": "Organization", name: article.sourceName },
    mainEntityOfPage: article.canonicalUrl,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal as="section" className="techmeld-detail-hero section" y={16}>
        <Link href="/techmeld/news" className="techmeld-back-link">
          <ArrowLeft size={16} />
          Back to news
        </Link>

        <div className="techmeld-content-meta">
          <span>{article.category === "releases" ? "Product Release" : "AI News"}</span>
          <span>{article.publishedDateLabel}</span>
        </div>

        <h1>{article.title}</h1>

        <div className="techmeld-tags">
          {article.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="section techmeld-detail-content">
        <p className="eyebrow">TechMeld summary</p>
        <p className="techmeld-detail-summary">{article.summary}</p>
        <h2>Why it matters</h2>
        <p>{article.whyItMatters}</p>
        <p><small>This summary and analysis were generated from source metadata, not the publisher’s article body. Original reporting belongs to the publisher.</small></p>

        <SourceAttribution sourceName={article.publisher} author={article.author} publishedDate={article.publishedDateLabel} />

        <a
          href={article.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="secondary-button"
        >
          Read the full article at {article.publisher}
          <ExternalLink size={16} />
        </a>

        {article.relatedProduct ? (
          <div className="techmeld-detail-discovery">
            <ProductDiscoveryCard product={article.relatedProduct} />
          </div>
        ) : null}
      </Reveal>

      {related.length > 0 ? (
        <section className="section techmeld-related-section">
          <h2>Related updates</h2>
          <RevealGroup className="techmeld-update-grid">
            {related.map((relatedArticle) => (
              <RevealItem key={relatedArticle.id}>
                <UpdateCard article={relatedArticle} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      ) : null}
    </main>
  );
}
