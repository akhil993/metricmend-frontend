import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News Attribution & Content Policy | TechMeld",
  description: "How TechMeld discovers, summarizes, attributes, corrects, and removes technology-news listings.",
};

export default function TechMeldContentPolicyPage() {
  return (
    <main>
      <section className="techmeld-subpage-hero section">
        <p className="eyebrow">Transparency</p>
        <h1>News Attribution &amp; Content Policy</h1>
        <p>TechMeld is a discovery and intelligence index designed to complement—not replace—original journalism.</p>
      </section>
      <section className="section techmeld-subpage-content techmeld-detail-content">
        <h2>Discovery and storage</h2>
        <p>We discover articles through publisher-provided RSS or Atom feeds and store limited metadata such as the title, publisher, author when supplied, canonical URL, publication date, identifiers, categories, and tags. We do not intentionally store or republish article bodies.</p>
        <h2>Summaries and analysis</h2>
        <p>TechMeld summaries and “Why it matters” notes are generated from source metadata. They are not publisher excerpts and should not be treated as a substitute for the original article. When AI-generated summaries are introduced, they will be labeled and subject to editorial and factual-quality controls.</p>
        <h2>Attribution and links</h2>
        <p>Each listing identifies the original publisher, publication date, author when available, and a prominent canonical link. The publisher’s article is the authoritative source. A listing does not imply sponsorship, endorsement, or partnership.</p>
        <h2>Images and branding</h2>
        <p>Publisher images and logos are not displayed unless TechMeld has documented permission or an applicable license. TechMeld may use its own illustrations or appropriately licensed assets.</p>
        <h2>Corrections, removal, and publisher inquiries</h2>
        <p>Publishers and rights holders may request a correction, attribution change, source disablement, or removal. Include the URL, your relationship to the work, and the requested action through our <Link href="/contact">contact page</Link>. We review credible requests promptly.</p>
        <h2>Source compliance</h2>
        <p>Feeds are subject to source-specific terms and technical policies. TechMeld may disable a source while permissions, attribution requirements, or feed terms are reviewed. This policy does not claim a partnership with any indexed publisher.</p>
      </section>
    </main>
  );
}

