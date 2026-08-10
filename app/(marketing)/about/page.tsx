import { ArrowDown, BarChart3, Heart, Network, Sparkles, Users2 } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import Link from "next/link";

export const metadata = {
  title: "Company",
};

export default function AboutPage() {
  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">Company</p>
        <h1>Applied AI that understands work and life.</h1>
        <p>
          MetricMend AI is the parent company behind a growing ecosystem of
          intelligent products and assistants — built to turn scattered
          information into understanding.
        </p>
      </Reveal>

      <section className="section story-section">
        <Reveal className="section-heading">
          <p className="eyebrow">Why we exist</p>
          <h2>It started with one simple question.</h2>
          <p>
            What would happen if AI understood the real context behind the
            things people plan, manage, analyze, and decide — instead of
            answering each question in isolation? MetricMend AI exists to
            build that kind of context-aware intelligence, one focused
            product at a time.
          </p>
        </Reveal>

        <RevealGroup className="timeline">
          <RevealItem>
            <TimelineItem
              number="01"
              title="Life became the starting point"
              text="LifeMeld began as a way to organize tasks and plans, then evolved into an intelligent workspace for everyday life."
            />
          </RevealItem>
          <RevealItem>
            <TimelineItem
              number="02"
              title="Business needed the same clarity"
              text="InsightMend was created to help people understand business data without depending on complex reports or technical language."
            />
          </RevealItem>
          <RevealItem>
            <TimelineItem
              number="03"
              title="An ecosystem began to form"
              text="MINA and MIRA became specialized assistants serving two different worlds under one shared MetricMend AI platform."
            />
          </RevealItem>
        </RevealGroup>
      </section>

      <section className="section">
        <Reveal className="section-heading">
          <p className="eyebrow">Vision &amp; mission</p>
          <h2>A calm, capable intelligence layer for everyday decisions.</h2>
        </Reveal>

        <RevealGroup className="feature-grid">
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Network />
              </div>
              <h3>Vision</h3>
              <p>
                A world where AI quietly connects the scattered parts of
                people&apos;s lives and businesses into something they can
                actually understand and act on.
              </p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Sparkles />
              </div>
              <h3>Mission</h3>
              <p>
                Build specialized, applied AI products — not one general
                assistant trying to do everything — each designed around a
                clear, meaningful purpose.
              </p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className="feature-card">
              <div className="feature-icon">
                <Users2 />
              </div>
              <h3>Philosophy</h3>
              <p>
                Calm confidence over hype. We would rather ship something
                genuinely useful than something that merely feels impressive.
              </p>
            </article>
          </RevealItem>
        </RevealGroup>
      </section>

      <section className="section meld-mend-section">
        <Reveal className="section-heading">
          <p className="eyebrow">Meld versus Mend</p>
          <h2>Similar names. Different purposes. One platform.</h2>
        </Reveal>

        <RevealGroup className="meaning-grid">
          <RevealItem>
            <article className="meaning-card meld-card">
              <Heart />
              <p className="meaning-word">MELD</p>
              <h3>Bring different parts together.</h3>
              <p>
                LifeMeld combines plans, tasks, budgets, documents, people, and
                everyday decisions into one connected experience.
              </p>

              <div className="flow-list">
                <span>Tasks</span>
                <span>Budgets</span>
                <span>Documents</span>
                <span>Events</span>
              </div>

              <ArrowDown className="flow-arrow" />
              <strong>One life workspace</strong>
            </article>
          </RevealItem>

          <RevealItem>
            <article className="meaning-card mend-card">
              <BarChart3 />
              <p className="meaning-word">MEND</p>
              <h3>Improve understanding and decisions.</h3>
              <p>
                InsightMend helps businesses repair the gap between raw data and
                useful business understanding.
              </p>

              <div className="flow-list">
                <span>Metrics</span>
                <span>Dashboards</span>
                <span>Reports</span>
                <span>Trends</span>
              </div>

              <ArrowDown className="flow-arrow" />
              <strong>Clear business decisions</strong>
            </article>
          </RevealItem>
        </RevealGroup>
      </section>

      <section className="section">
        <Reveal className="section-heading">
          <p className="eyebrow">Team</p>
          <h2>A small, focused team.</h2>
          <p>
            MetricMend AI is built by a small team that would rather spend
            time on the product than on a press page. As the company grows,
            we&apos;ll introduce the people building it here.
          </p>
        </Reveal>
      </section>

      <Reveal as="section" className="section vision-card">
        <Network />
        <p className="eyebrow">What comes next</p>
        <h2>A company capable of building many intelligent products.</h2>
        <p>
          InsightMend, LifeMeld, and TechMeld are the beginning. MetricMend AI is designed
          to grow into a broader family of specialized products, all sharing
          the same context-aware, explainable, human-centered foundation.
        </p>
        <Sparkles />
      </Reveal>
      <section className="section">
        <p className="eyebrow">TechMeld transparency</p>
        <h2>Original reporting remains with its publisher.</h2>
        <p>TechMeld organizes source metadata and adds clearly identified summaries and analysis. Readers are directed to the publisher for the full article and authoritative context.</p>
        <Link href="/techmeld/content-policy" className="secondary-button">Read our News Attribution &amp; Content Policy</Link>
      </section>
    </main>
  );
}

function TimelineItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="timeline-item">
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
