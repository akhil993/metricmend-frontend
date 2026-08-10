import Link from "next/link";
import { ArrowRight, BarChart3, Heart, Network, Newspaper } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">MetricMend AI Products</p>
        <h1>Purpose-built intelligence for different parts of your world.</h1>
        <p>
          Each MetricMend AI product solves a distinct problem while sharing
          the same underlying platform, the same human-centered design
          philosophy, and the same commitment to clarity over noise.
        </p>
      </Reveal>

      <section className="section">
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

        <RevealGroup className="product-directory">
          <RevealItem>
            <article className="directory-card">
              <Heart />
              <div>
                <p className="product-type">Life intelligence</p>
                <h2>LifeMeld</h2>
                <p>
                  Plan events, manage tasks, organize budgets, understand
                  documents, collaborate, and receive support from MINA — all
                  inside one connected life workspace.
                </p>
                <a href="https://www.lifemeldai.com" target="_blank" rel="noopener noreferrer">
                  Visit LifeMeld <ArrowRight size={17} />
                </a>
              </div>
            </article>
          </RevealItem>

          <RevealItem>
            <article className="directory-card">
              <BarChart3 />
              <div>
                <p className="product-type">Business intelligence</p>
                <h2>InsightMend</h2>
                <p>
                  Govern business data, ask natural-language questions,
                  understand KPIs, diagnose changes, and make decisions with
                  support from MIRA.
                </p>
                <Link href="/insightmend">
                  Explore InsightMend <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          </RevealItem>

          <RevealItem>
            <article className="directory-card">
              <Newspaper />
              <div>
                <p className="product-type">Technology intelligence</p>
                <h2>TechMeld</h2>
                <p>
                  Follow trustworthy AI, engineering, analytics, product, and
                  research updates through one curated intelligence platform.
                </p>
                <Link href="/techmeld">
                  Explore TechMeld <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>
      </section>
    </main>
  );
}
