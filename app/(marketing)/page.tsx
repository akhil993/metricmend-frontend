import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HeroSection } from "@/components/hero/hero-section";
import { UpdateCard } from "@/components/techmeld/update-card";
import { ProductShowcase } from "@/components/company-site/product-showcase";
import { getLatestArticles } from "@/lib/techmeld/queries";

export default async function HomePage() {
  const latestArticles = await getLatestArticles({ pageSize: 3 });

  return (
    <main>
      <HeroSection />

      <section
        className="section purpose-section"
        id="our-purpose"
        data-section-label="Our purpose"
      >
        <Reveal className="section-heading">
          <p className="eyebrow">Why MetricMend AI exists</p>
          <h2>AI should understand more than one part of your world.</h2>
          <p>
            We build an ecosystem where specialized, applied AI helps people
            organize life, understand business, and make calmer, clearer
            decisions.
          </p>
        </Reveal>

        <RevealGroup className="feature-grid">
          <RevealItem>
            <Feature
              icon={<Network />}
              title="One ecosystem"
              description="A growing family of connected AI products, built under one trusted company and a shared intelligence layer."
            />
          </RevealItem>
          <RevealItem>
            <Feature
              icon={<Eye />}
              title="Explainable by design"
              description="Every insight traces back to its source. Nothing MetricMend AI shows you is a black box."
            />
          </RevealItem>
          <RevealItem>
            <Feature
              icon={<Sparkles />}
              title="Human-centered AI"
              description="Technology that feels calm, approachable, and genuinely useful — never noisy, never a beta."
            />
          </RevealItem>
        </RevealGroup>
      </section>

      <div className="band band-surface">
        <section
          className="section products-preview"
          id="our-products"
          data-section-label="Products"
        >
          <Reveal className="section-heading is-centered">
            <p className="eyebrow">Our products</p>
            <h2>Intelligence for life and business.</h2>
            <p>
              InsightMend, LifeMeld, and TechMeld share one intelligent
              platform while solving distinct problems across work, life,
              and technology.
            </p>
          </Reveal>

          <Reveal>
            <div className="ecosystem-tree">
              <div className="ecosystem-hub">
                <span className="ecosystem-hub-icon">
                  <Network size={14} />
                </span>
                MetricMend AI
              </div>
              <div className="ecosystem-stem" />
            </div>
          </Reveal>

          <ProductShowcase />
        </section>
      </div>

      <section
        className="section assistants-preview"
        id="ai-assistants"
        data-section-label="AI assistants"
      >
        <Reveal className="assistant-preview-card">
          <div>
            <p className="eyebrow">The AI Platform</p>
            <h2>One intelligence layer. Specialized product experiences.</h2>
            <p>
              MINA and MIRA are built on the same underlying MetricMend AI
              platform — one tuned for life, the other for business — each
              designed for the environment where it is most useful.
            </p>
          </div>

          <div className="assistant-links">
            <Link href="/assistants/mina">
              <strong>MINA</strong>
              <span>Life assistant, inside LifeMeld</span>
              <ArrowRight size={18} />
            </Link>

            <Link href="/assistants/mira">
              <strong>MIRA</strong>
              <span>Business assistant, inside InsightMend</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="band band-surface">
        <section
          className="section principles-section"
          id="technology-principles"
          data-section-label="Technology"
        >
          <Reveal className="section-heading is-centered">
            <p className="eyebrow">Technology principles</p>
            <h2>Built on a few things we won&apos;t compromise on.</h2>
          </Reveal>

          <RevealGroup className="feature-grid">
            <RevealItem>
              <Feature
                icon={<Network />}
                title="Context-aware"
                description="Every product understands the connections between the information it holds, not just isolated data points."
              />
            </RevealItem>
            <RevealItem>
              <Feature
                icon={<Eye />}
                title="Explainable"
                description="Insights and recommendations always show their reasoning and their source."
              />
            </RevealItem>
            <RevealItem>
              <Feature
                icon={<ShieldCheck />}
                title="Private by design"
                description="Your information is used to help you — never sold, never used to train models without consent."
              />
            </RevealItem>
          </RevealGroup>

          <div className="techmeld-section-action">
            <Link href="/technology" className="secondary-button">
              Learn about our technology <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      {latestArticles.items.length > 0 && (
      <section className="section techmeld-latest-preview" id="latest-techmelds" data-section-label="Latest TechMelds">
        <Reveal className="section-heading">
          <p className="eyebrow">Latest TechMelds</p>
          <h2>AI, engineering, and analytics news — brought together.</h2>
          <p>
            Original summaries from official technology feeds, reviewed
            before publishing.
          </p>
        </Reveal>

          <RevealGroup className="techmeld-update-grid">
            {latestArticles.items.map((article) => (
              <RevealItem key={article.id}>
                <UpdateCard article={article} />
              </RevealItem>
            ))}
          </RevealGroup>

        <div className="techmeld-section-action">
          <Link href="/techmeld" className="secondary-button">
            Browse all TechMelds <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      )}

      <section className="section roadmap-section">
        <Reveal className="section-heading">
          <p className="eyebrow">Product portfolio</p>
          <h2>Focused products. One company platform.</h2>
          <p>
            Each MetricMend AI product is built for a distinct customer need,
            with a shared commitment to context, explainability, and privacy.
          </p>
        </Reveal>

        <RevealGroup className="timeline">
          <RevealItem>
            <div className="timeline-item">
              <span>Live</span>
              <div>
                <h3>LifeMeld</h3>
                <p>
                  An intelligent workspace for everyday life — tasks, plans,
                  budgets, documents, and MINA — available today.
                </p>
              </div>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="timeline-item">
              <span>Enterprise</span>
              <div>
                <h3>InsightMend</h3>
                <p>
                  Business intelligence guided by MIRA, turning raw data into
                  explanations and governed decisions for modern teams.
                </p>
              </div>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="timeline-item">
              <span>Intelligence</span>
              <div>
                <h3>TechMeld</h3>
                <p>
                  Source-grounded technology updates with concise context and
                  clear implications for professionals and builders.
                </p>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
