import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, HeartHandshake, Newspaper } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata = {
  title: "Solutions",
  description: "AI solutions for business decisions, everyday planning, and technology intelligence from MetricMend AI.",
};

const solutions = [
  {
    icon: BriefcaseBusiness,
    audience: "For organizations",
    title: "Make governed business decisions",
    description: "Connect data, shared business definitions, dashboards, and natural-language analysis in InsightMend.",
    href: "/insightmend",
    action: "Explore InsightMend",
  },
  {
    icon: HeartHandshake,
    audience: "For everyday life",
    title: "Bring plans and responsibilities together",
    description: "Organize tasks, budgets, events, documents, and life plans with Mina inside LifeMeld.",
    href: "https://www.lifemeldai.com",
    action: "Explore LifeMeld",
    external: true,
  },
  {
    icon: Newspaper,
    audience: "For technology professionals",
    title: "Understand what changed and why it matters",
    description: "Follow technology news, launches, developer updates, and events through source-grounded TechMeld summaries.",
    href: "/techmeld",
    action: "Explore TechMeld",
  },
];

export default function SolutionsPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">Solutions</p>
        <h1>Specialized AI for the decisions people actually make.</h1>
        <p>One shared intelligence platform, expressed through focused products for business, life, and technology.</p>
      </Reveal>
      <section className="section">
        <RevealGroup className="product-directory">
          {solutions.map(({ icon: Icon, ...solution }) => (
            <RevealItem key={solution.title}>
              <article className="directory-card">
                <Icon />
                <div>
                  <p className="product-type">{solution.audience}</p>
                  <h2>{solution.title}</h2>
                  <p>{solution.description}</p>
                  <Link
                    href={solution.href}
                    target={solution.external ? "_blank" : undefined}
                    rel={solution.external ? "noopener noreferrer" : undefined}
                  >
                    {solution.action} <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </main>
  );
}
