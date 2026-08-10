"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const concepts = [
  {
    title: "Home intelligence",
    description:
      "AI tools that understand maintenance, projects, purchases, and household planning.",
  },
  {
    title: "Education intelligence",
    description:
      "Tools that help people organize learning goals, materials, and progress.",
  },
  {
    title: "Travel intelligence",
    description:
      "Smarter planning that connects destinations, budgets, schedules, and documents.",
  },
];

export default function ComingSoonPage() {
  const [submitted, setSubmitted] = useState(false);

  function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <Reveal as="section" className="page-hero section" y={16}>
        <p className="eyebrow">Coming Soon</p>
        <h1>Building what comes next.</h1>
        <p>
          We continuously explore new ways AI can make life and work more
          understandable.
        </p>
      </Reveal>

      <section className="section">
        <RevealGroup className="concept-grid">
          {concepts.map((concept) => (
            <RevealItem key={concept.title}>
              <article className="concept-card">
                <Sparkles size={21} />
                <h2>{concept.title}</h2>
                <p>{concept.description}</p>
                <span>Concept exploration</span>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="section idea-section">
        <Reveal>
          <Lightbulb size={34} />
          <p className="eyebrow">Share an idea</p>
          <h2>What should MetricMend AI build next?</h2>
          <p>
            Tell us about a problem that you believe could be solved through a
            thoughtful AI product.
          </p>
        </Reveal>

        {submitted ? (
          <div className="form-success">
            <Sparkles size={28} />
            <h3>Thank you for sharing your idea.</h3>
            <p>
              This starter currently shows a confirmation locally. Connect the
              form to Supabase when you are ready to store submissions.
            </p>
          </div>
        ) : (
          <form className="idea-form" onSubmit={submitIdea}>
            <label>
              Name
              <input name="name" required placeholder="Your name" />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>

            <label>
              Product idea
              <textarea
                name="idea"
                required
                rows={6}
                placeholder="Describe the problem and your idea..."
              />
            </label>

            <button type="submit" className="primary-button">
              Submit idea
              <ArrowRight size={17} />
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
