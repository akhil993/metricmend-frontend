import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Gauge,
  Network,
  ShieldCheck,
  UserCheck,
  Waypoints,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata = {
  title: "Technology",
};

export default function TechnologyPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">Technology</p>
        <h1>The platform behind every MetricMend AI product.</h1>
        <p>
          InsightMend, LifeMeld, TechMeld, MINA, and MIRA are all expressions of the same
          underlying platform — a shared, context-aware intelligence layer
          built on a small number of principles we don&apos;t compromise on.
        </p>
      </Reveal>

      <section className="section">
        <Reveal className="section-heading">
          <p className="eyebrow">Our approach</p>
          <h2>Applied AI, not AI for its own sake.</h2>
          <p>
            We don&apos;t start with a model and look for a use case. We start
            with a real problem — organizing a life, understanding a
            business — and build the smallest, clearest piece of intelligence
            that solves it well.
          </p>
        </Reveal>
      </section>

      <div className="band band-surface">
        <section className="section">
          <Reveal className="section-heading is-centered">
            <p className="eyebrow">Principles</p>
            <h2>What every product is held to.</h2>
          </Reveal>

          <RevealGroup className="feature-grid">
            <RevealItem>
              <Principle
                icon={<Network />}
                title="Context-aware"
                description="Products understand the relationships between the information they hold, not just isolated facts."
              />
            </RevealItem>
            <RevealItem>
              <Principle
                icon={<Eye />}
                title="Explainable"
                description="Every insight and recommendation shows its reasoning and its source. No black boxes."
              />
            </RevealItem>
            <RevealItem>
              <Principle
                icon={<ShieldCheck />}
                title="Private by design"
                description="Your information is used to help you — never sold, and never used to train models without consent."
              />
            </RevealItem>
            <RevealItem>
              <Principle
                icon={<UserCheck />}
                title="Human-in-the-loop"
                description="AI suggests; you decide. Every product keeps a person in control of consequential actions."
              />
            </RevealItem>
            <RevealItem>
              <Principle
                icon={<Waypoints />}
                title="Grounded in real data"
                description="Answers are traced back to your actual documents, transactions, and events — not generated from thin air."
              />
            </RevealItem>
            <RevealItem>
              <Principle
                icon={<Gauge />}
                title="Built to scale"
                description="The same platform that runs a personal workspace today is architected to run business-grade workloads tomorrow."
              />
            </RevealItem>
          </RevealGroup>
        </section>
      </div>

      <section className="section">
        <Reveal className="section-heading">
          <p className="eyebrow">How it powers our products</p>
          <h2>One platform, tuned for two different worlds.</h2>
        </Reveal>

        <RevealGroup className="product-directory">
          <RevealItem>
            <article className="directory-card">
              <Network />
              <div>
                <p className="product-type">Life intelligence</p>
                <h2>LifeMeld + MINA</h2>
                <p>
                  The platform is tuned to understand personal context — plans,
                  budgets, documents, and relationships — and to surface next
                  steps without overwhelming you.
                </p>
                <Link href="/assistants/mina">
                  Meet MINA <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          </RevealItem>

          <RevealItem>
            <article className="directory-card">
              <Gauge />
              <div>
                <p className="product-type">Business intelligence</p>
                <h2>InsightMend + MIRA</h2>
                <p>
                  The same platform is tuned to understand business context —
                  metrics, trends, and reports — and to explain what changed
                  and why in plain language.
                </p>
                <Link href="/assistants/mira">
                  Meet MIRA <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>
      </section>

      <Reveal as="section" className="section vision-card">
        <Waypoints />
        <p className="eyebrow">Where this is going</p>
        <h2>A platform designed to support many products.</h2>
        <p>
          As MetricMend AI grows, new products will inherit this same
          foundation — so every new idea starts from a platform that already
          understands context, explains itself, and respects your data.
        </p>
      </Reveal>
    </main>
  );
}

function Principle({
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
