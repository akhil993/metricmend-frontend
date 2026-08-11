import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, HeartHandshake, Network } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductShowcase } from "@/components/company-site/product-showcase";

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

      <section className="section" data-section-nav="false">
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

        <ProductShowcase directory />
      </section>

      <div className="band band-surface">
        <section className="section" data-section-label="AI assistants">
          <Reveal className="section-heading is-centered">
            <p className="eyebrow">Specialized AI assistants</p>
            <h2>Meet Mina and Mira.</h2>
            <p>Each assistant is grounded in the product it serves, with focused capabilities and clear human control.</p>
          </Reveal>
          <RevealGroup className="assistant-directory">
            <RevealItem>
              <article id="mina" data-section-nav-item="true" data-section-label="Mina" className="assistant-directory-card mina-directory">
                <HeartHandshake />
                <p className="product-type">Inside LifeMeld</p>
                <h2>Mina</h2>
                <p>Your AI life assistant for organizing tasks, budgets, events, documents, and important plans.</p>
                <Link href="/assistants/mina">Explore Mina <ArrowRight size={17} /></Link>
              </article>
            </RevealItem>
            <RevealItem>
              <article id="mira" data-section-nav-item="true" data-section-label="Mira" className="assistant-directory-card mira-directory">
                <BriefcaseBusiness />
                <p className="product-type">Inside InsightMend</p>
                <h2>Mira</h2>
                <p>Your enterprise decision intelligence assistant for trusted analysis, explanations, and next actions.</p>
                <Link href="/assistants/mira">Explore Mira <ArrowRight size={17} /></Link>
              </article>
            </RevealItem>
          </RevealGroup>
        </section>
      </div>
    </main>
  );
}
