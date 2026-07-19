import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import ClientRuntimeGuards from "@/components/app/ClientRuntimeGuards";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetricMend",
  description: "AI analytics workspace",
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
