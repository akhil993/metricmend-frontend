import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Heart,
} from "lucide-react";

const ecosystem = [
  {
    name: "LifeMeld",
    description: "AI for organizing everyday life.",
    href: "https://www.lifemeldai.com",
    external: true,
    icon: Heart,
  },
  {
    name: "InsightMend",
    description: "AI for business intelligence and analytics.",
    href: "/products",
    external: false,
    icon: BarChart3,
  },
  {
    name: "MINA",
    description: "Your Life AI Assistant.",
    href: "/assistants/mina",
    external: false,
    icon: Bot,
  },
  {
    name: "MIRA",
    description: "Your Business Intelligence AI.",
    href: "/assistants/mira",
    external: false,
    icon: BriefcaseBusiness,
  },
];

export function EcosystemSection() {
  return (
    <section className="techmeld-ecosystem">
      <div className="techmeld-ecosystem-copy">
        <p className="eyebrow">Built by MetricMend AI</p>
        <h2>One ecosystem for life, work, and technology.</h2>
        <p>
          TechMeld is part of a growing ecosystem of AI products designed to
          make life, work, and technology easier to understand.
        </p>
      </div>

      <div className="techmeld-ecosystem-grid">
        {ecosystem.map((item) => {
          const Icon = item.icon;

          const content = (
            <>
              <Icon />
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <ArrowRight size={17} />
            </>
          );

          return item.external ? (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            <Link key={item.name} href={item.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
