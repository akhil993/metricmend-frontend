import { Briefcase, Compass, Sparkles, Target, Users2 } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata = {
  title: "MendJobs",
  description: "Build the next generation of AI products with MetricMend AI.",
};

export default function CareersPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">MendJobs</p>
        <h1>Help us build what&apos;s next.</h1>
        <p>
          MetricMend AI is a small, focused team building an intelligent
          product ecosystem from the ground up. We care more about what we
          ship than how big the team looks.
        </p>
      </Reveal>

      <section className="section">
        <Reveal className="section-heading">
          <p className="eyebrow">How we work</p>
          <h2>A few things that stay true regardless of team size.</h2>
        </Reveal>

        <RevealGroup className="feature-grid">
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Users2 />
              </div>
              <h3>Real ownership</h3>
              <p>
                Small teams mean your decisions show up in the product
                quickly — and you carry a problem end to end, not a slice of
                it.
              </p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Target />
              </div>
              <h3>Calm, focused execution</h3>
              <p>
                We&apos;d rather do fewer things well than chase every idea.
                No busywork, no performative urgency.
              </p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Compass />
              </div>
              <h3>Build what you&apos;d use</h3>
              <p>
                Every product decision gets tested against a simple question:
                would we actually want this for our own life or business?
              </p>
            </article>
          </RevealItem>
        </RevealGroup>
      </section>

      <Reveal as="section" className="empty-state section" y={16}>
        <div className="empty-icon">
          <Briefcase size={34} />
        </div>
        <p className="eyebrow">Open roles</p>
        <h1>No open roles right now.</h1>
        <p>
          We&apos;re not actively hiring at the moment, but the team is
          growing alongside the products. Check back soon, or reach out
          through our contact page to say hello.
        </p>
        <div className="coming-pill">
          <Sparkles size={15} />
          Check back soon
        </div>
      </Reveal>
    </main>
  );
}
