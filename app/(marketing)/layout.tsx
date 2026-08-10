import { Footer } from "@/components/company-site/footer";
import { Navbar } from "@/components/company-site/navbar";
import { PageSectionNav } from "@/components/company-site/page-section-nav";
import "../../styles/company-site.css";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="company-site-shell">
      <Navbar />
      <PageSectionNav />
      {children}
      <Footer />
    </div>
  );
}
