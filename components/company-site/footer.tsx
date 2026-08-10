import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MMMonogram } from "@/components/brand/mm-monogram";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link href="/" className="footer-brand">
            <span className="mm-monogram-wrap">
              <MMMonogram size={30} decorative />
            </span>
            <span className="footer-brand-wordmark">MetricMend AI</span>
          </Link>
          <p>Applied AI that turns scattered information into understanding.</p>
        </div>

        <div>
          <h3>Products</h3>
          <a href="https://www.lifemeldai.com" target="_blank" rel="noopener noreferrer">
            LifeMeld
            <ExternalLink size={12} />
          </a>
          <Link href="/insightmend">
            InsightMend
          </Link>
          <Link href="/techmeld">TechMeld</Link>
        </div>

        <div>
          <h3>Platform</h3>
          <Link href="/technology">Technology</Link>
          <Link href="/techmeld">TechMeld</Link>
          <Link href="/research">Research</Link>
        </div>

        <div>
          <h3>Assistants</h3>
          <Link href="/assistants/mina">MINA</Link>
          <Link href="/assistants/mira">MIRA</Link>
        </div>

        <div>
          <h3>Company</h3>
          <Link href="/about">Company</Link>
          <Link href="/mendjobs">MendJobs</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/techmeld/content-policy">News Attribution &amp; Content Policy</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MetricMend AI. All rights reserved.</span>
        <span>TechMeld summaries and analysis are generated from source metadata. Original reporting belongs to the cited publishers.</span>
      </div>
    </footer>
  );
}
