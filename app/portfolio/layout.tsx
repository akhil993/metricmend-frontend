import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akhil Devabhakthuni | Founder @ MetricMend",
  description:
    "Portfolio of Akhil Devabhakthuni, Senior Data & Analytics Engineer and founder of MetricMend.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}