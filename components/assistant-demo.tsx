"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Eye, ShieldCheck, Sparkles, Workflow } from "lucide-react";

type AssistantDemoProps = {
  name: string;
  title: string;
  description: string;
  greeting: string;
  capabilities: string[];
  examplePrompt: string;
  exampleResponse: string;
  theme: "mina" | "mira";
};

// initial/animate always describe the same shape on server and client —
// only durations collapse to 0 for prefers-reduced-motion, so the first
// client render matches the SSR output and hydration never mismatches.
export function AssistantDemo({
  name,
  title,
  description,
  greeting,
  capabilities,
  examplePrompt,
  exampleResponse,
  theme,
}: AssistantDemoProps) {
  const noMotion = useReducedMotion();
  const d = (value: number) => (noMotion ? 0 : value);
  const productName = theme === "mina" ? "LifeMeld" : "InsightMend";
  const productHref = theme === "mina" ? "https://www.lifemeldai.com" : "/insightmend";
  const workflow = theme === "mina"
    ? [
        ["Bring life into one view", "Connect plans, tasks, budgets, events, and documents around what matters to you."],
        ["Ask naturally", "Describe a goal or responsibility in everyday language without learning a new system."],
        ["Review the plan", "Mina organizes practical next steps and keeps you in control before anything changes."],
      ]
    : [
        ["Ground answers in governed data", "Mira works through approved models, metric definitions, and access boundaries."],
        ["Ask a business question", "Move from a KPI to comparisons, drivers, and follow-up analysis in plain language."],
        ["Decide with context", "Review the evidence, explanation, and suggested next actions before your team acts."],
      ];

  return (
    <main className={`assistant-page assistant-${theme}`}>
      <section className="assistant-hero section">
        <motion.div
          className="assistant-avatar"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: d(0.6) }}
        >
          <Bot size={40} />
        </motion.div>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.15), duration: d(0.4) }}
        >
          {productName} powered by {name}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.25), duration: d(0.4) }}
        >
          Hi, I&apos;m {name}.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.4), duration: d(0.4) }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="assistant-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.5), duration: d(0.4) }}
        >
          {description}
        </motion.p>
      </section>

      <section className="section assistant-content">
        <div>
          <p className="eyebrow">What I can do</p>
          <h2>{greeting}</h2>

          <div className="capability-list">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability}
                className="capability-item"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: d(index * 0.08), duration: d(0.4) }}
              >
                <Sparkles size={17} />
                <span>{capability}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="chat-demo"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: d(0.5) }}
        >
          <div className="chat-header">
            <span className="status-dot" />
            {name} is ready
          </div>

          <div className="chat-message user-message">{examplePrompt}</div>

          <motion.div
            className="chat-message assistant-message"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: d(0.6), duration: d(0.4) }}
          >
            {exampleResponse}
          </motion.div>
        </motion.div>
      </section>

      <section className="section assistant-how-it-works" data-section-label="How it works">
        <div className="section-heading is-centered">
          <p className="eyebrow">How {name} works</p>
          <h2>Useful intelligence, grounded in your context.</h2>
          <p>{name} is not a general chatbot. It is a specialized assistant designed around the information and decisions inside {productName}.</p>
        </div>
        <div className="assistant-workflow-grid">
          {workflow.map(([step, body], index) => (
            <article className="assistant-workflow-card" key={step}>
              <span>0{index + 1}</span>
              <Workflow size={22} />
              <h3>{step}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="band band-surface">
        <section className="section assistant-trust" data-section-label="Trust">
          <div className="section-heading">
            <p className="eyebrow">Designed for trust</p>
            <h2>Clear about what it knows—and what you control.</h2>
          </div>
          <div className="assistant-trust-grid">
            <article><Eye /><div><h3>Explainable</h3><p>Responses show their context and reasoning so you can understand where guidance comes from.</p></div></article>
            <article><ShieldCheck /><div><h3>Private by design</h3><p>Your information supports your experience and remains inside the appropriate product boundaries.</p></div></article>
            <article><CheckCircle2 /><div><h3>You approve the outcome</h3><p>{name} helps organize and recommend. You stay responsible for consequential actions and final decisions.</p></div></article>
          </div>
        </section>
      </div>

      <section className="section assistant-product-cta" data-section-label={`Explore ${productName}`}>
        <div>
          <p className="eyebrow">Available inside {productName}</p>
          <h2>Meet {name} where the work happens.</h2>
          <p>Use the assistant alongside the plans, documents, data, and workflows it is designed to understand.</p>
        </div>
        <Link href={productHref} target={theme === "mina" ? "_blank" : undefined} rel={theme === "mina" ? "noopener noreferrer" : undefined} className="primary-button">
          Explore {productName} <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
