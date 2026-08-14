import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Database,
  GitBranch,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata = {
  title: "InsightMend",
  description:
    "InsightMend is MetricMend AI's enterprise decision intelligence platform, powered by Mira.",
};

const capabilities = [
  {
    icon: <Database />,
    title: "Connected data",
    description: "Bring governed business data together without replacing the systems your teams already trust.",
  },
  {
    icon: <GitBranch />,
    title: "Semantic layer",
    description: "Define shared metrics and relationships once so every answer uses the same business meaning.",
  },
  {
    icon: <MessageSquareText />,
    title: "Natural-language analysis",
    description: "Ask business questions in plain language and move from a KPI to its drivers without writing SQL.",
  },
  {
    icon: <BarChart3 />,
    title: "Decision-ready insight",
    description: "Turn trusted metrics into explanations, comparisons, diagnostics, and clear next actions.",
  },
  {
    icon: <ShieldCheck />,
    title: "Governance and security",
    description: "Protect access, certify definitions, trace lineage, and promote changes through controlled environments.",
  },
  {
    icon: <Bot />,
    title: "Powered by Mira",
    description: "Work with an AI decision partner grounded in your governed models, metrics, and operating context.",
  },
];

export default function InsightMendPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">InsightMend by MetricMend AI</p>
        <h1>Enterprise decision intelligence, grounded in your business.</h1>
        <p>
          InsightMend connects data, shared metric definitions, governance,
          and Mira in one workspace so teams can understand what changed,
          why it changed, and what to do next.
        </p>
        <div className="mm-hero-actions">
          <a href="https://insightmend.com" className="primary-button">
            Open InsightMend <ArrowRight size={17} />
          </a>
          <Link href="/contact" className="secondary-button">Talk to us</Link>
        </div>
      </Reveal>

      <section className="section">
        <Reveal className="section-heading is-centered">
          <p className="eyebrow">One governed operating model</p>
          <h2>From scattered data to confident decisions.</h2>
          <p>
            InsightMend is MetricMend AI&apos;s independent B2B analytics
            product, with its own sign-in, workspace, and admin experience at
            insightmend.com.
          </p>
        </Reveal>
        <RevealGroup className="feature-grid">
          {capabilities.map((capability) => (
            <RevealItem key={capability.title}>
              <article className="feature-card">
                <div className="feature-icon">{capability.icon}</div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </main>
  );
}
