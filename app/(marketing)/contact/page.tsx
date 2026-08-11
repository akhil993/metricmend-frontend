import Link from "next/link";
import { ArrowRight, Building2, Headphones, Mail } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <div className="empty-icon">
          <Mail size={34} />
        </div>
        <p className="eyebrow">Contact MetricMend AI</p>
        <h1>Let&apos;s build something useful.</h1>
        <p>
          Contact MetricMend AI about products, partnerships, press, or company
          inquiries. We&apos;ll route your note to the right team.
        </p>
        <a className="primary-button" href="mailto:support@metricmendai.com">
          support@metricmendai.com <ArrowRight size={17} />
        </a>
      </Reveal>

      <section className="section">
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon"><Building2 /></div>
            <h2>Business &amp; partnerships</h2>
            <p>Talk with us about InsightMend, strategic partnerships, or working with MetricMend AI.</p>
            <a href="mailto:support@metricmendai.com?subject=Business%20inquiry">Email our team</a>
          </article>
          <article className="feature-card">
            <div className="feature-icon"><Headphones /></div>
            <h2>Product support</h2>
            <p>For product-specific help, include the product name and the email associated with your account.</p>
            <a href="mailto:support@metricmendai.com?subject=Product%20support">Get support</a>
          </article>
          <article className="feature-card">
            <div className="feature-icon"><Mail /></div>
            <h2>Company information</h2>
            <p>Learn more about our mission, platform, and the products built by MetricMend AI.</p>
            <Link href="/about">About the company <ArrowRight size={16} /></Link>
          </article>
        </div>
      </section>
    </main>
  );
}
