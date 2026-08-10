import { BrainCircuit, Eye, FlaskConical, Network, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata = {
  title: "Research",
};

export default function ResearchPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">Research</p>
        <h1>Research into applied, context-aware AI.</h1>
        <p>
          MetricMend AI invests in research that directly shapes our
          products — not research for its own sake. Here&apos;s where we&apos;re
          currently focused.
        </p>
      </Reveal>

      <section className="section">
        <Reveal className="section-heading">
          <p className="eyebrow">Focus areas</p>
          <h2>Three questions guide our work.</h2>
        </Reveal>

        <RevealGroup className="feature-grid">
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Network />
              </div>
              <h3>Context modeling</h3>
              <p>
                How can a system understand the relationships between a
                person&apos;s tasks, documents, and events well enough to be
                genuinely useful — without requiring manual setup?
              </p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Eye />
              </div>
              <h3>Explainable reasoning</h3>
              <p>
                How do we make sure every recommendation can be traced back to
                a clear, human-readable reason — even as the underlying models
                grow more capable?
              </p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <BrainCircuit />
              </div>
              <h3>Human-AI interaction</h3>
              <p>
                What does it feel like to collaborate with an assistant you
                trust — calm, clear, and always leaving the final decision to
                you?
              </p>
            </article>
          </RevealItem>
        </RevealGroup>
      </section>

      <Reveal as="section" className="empty-state section" y={16}>
        <div className="empty-icon">
          <FlaskConical size={34} />
        </div>
        <p className="eyebrow">Publications</p>
        <h1>Our first publications are still in progress.</h1>
        <p>
          As this research matures, we&apos;ll publish findings, write-ups, and
          technical notes here.
        </p>
        <div className="coming-pill">
          <Sparkles size={15} />
          Coming soon
        </div>
      </Reveal>
    </main>
  );
}
