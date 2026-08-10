import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import ClientRuntimeGuards from "@/components/app/ClientRuntimeGuards";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://metricmendai.com",
  ),
  title: {
    default: "MetricMend AI",
    template: "%s | MetricMend AI",
  },
  description:
    "MetricMend AI builds InsightMend, LifeMeld, and TechMeld on one shared AI platform.",
  applicationName: "MetricMend AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientRuntimeGuards />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
