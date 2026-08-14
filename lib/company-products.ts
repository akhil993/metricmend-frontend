export type CompanyProduct = {
  slug: "insightmend" | "lifemeld" | "techmeld";
  name: string;
  category: string;
  headline: string;
  description: string;
  capabilities: string[];
  assistant?: string;
  href: string;
  external?: boolean;
};

export const companyProducts: CompanyProduct[] = [
  {
    slug: "insightmend",
    name: "InsightMend",
    category: "Enterprise decision intelligence",
    headline: "AI-powered analytics for governed business decisions.",
    description:
      "Connect business data, define trusted metrics, explore dashboards, and move from questions to explainable decisions.",
    capabilities: [
      "Business intelligence",
      "Dashboards",
      "Natural-language analytics",
      "Semantic layer",
      "Governance",
    ],
    assistant: "Powered by Mira",
    href: "https://insightmend.com",
    external: true,
  },
  {
    slug: "lifemeld",
    name: "LifeMeld",
    category: "AI life assistant",
    headline: "A connected workspace for planning everyday life.",
    description:
      "Bring tasks, budgets, events, documents, and long-term plans into one calm, intelligent workspace.",
    capabilities: ["Tasks", "Budgets", "Events", "Documents", "Life planning"],
    assistant: "Powered by Mina",
    href: "https://www.lifemeldai.com",
    external: true,
  },
  {
    slug: "techmeld",
    name: "TechMeld",
    category: "Technology intelligence",
    headline: "Technology updates with context and clear implications.",
    description:
      "Follow AI news, product launches, industry events, and developer updates through concise, source-grounded summaries.",
    capabilities: [
      "Technology news",
      "Product launches",
      "Industry events",
      "AI summaries",
      "Why it matters",
    ],
    href: "/techmeld",
  },
];
